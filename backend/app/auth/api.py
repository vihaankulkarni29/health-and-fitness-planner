from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.config import settings
from app.core.rate_limit import limiter, RATE_LIMIT_AUTH
from app.auth import schemas
from app.auth import crud as auth_crud
from app.auth import token as auth_token
from app.auth.deps import get_current_user
from app.models.trainee import Trainee as TraineeModel
from app.schemas.trainee import Trainee as TraineeSchema

router = APIRouter(prefix="/auth")


@router.post("/login/access-token", response_model=schemas.Token)
@limiter.limit(RATE_LIMIT_AUTH)
def login_access_token(
    request: Request,
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    
    Rate limit: 5 requests per minute per IP address.
    """
    user = auth_crud.get_user_by_email(db, email=form_data.username)
    if not user or not auth_token.verify_password(
        form_data.password, user.hashed_password
    ):
        raise HTTPException(
            status_code=401, detail="Incorrect email or password"
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": auth_token.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }


@router.get("/me", response_model=TraineeSchema)
def read_users_me(current_user: TraineeModel = Depends(get_current_user)) -> Any:
    """Return the currently authenticated user's profile."""
    return current_user
