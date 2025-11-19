from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request, Response, Cookie, status
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


@router.post("/login/access-token", response_model=schemas.TokenPair)
@limiter.limit(RATE_LIMIT_AUTH)
def login_access_token(
    response: Response,
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
    access_token = auth_token.create_access_token(
        user.id, expires_delta=access_token_expires
    )
    refresh_token = auth_token.create_refresh_token(user.id, settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        secure=True,  # Set to True in production (requires HTTPS)
        samesite="lax",
    )
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token, # Keep for backward compatibility for now
        "token_type": "bearer",
    }



@router.get("/me", response_model=TraineeSchema)
def read_users_me(current_user: TraineeModel = Depends(get_current_user)) -> Any:
    """Return the currently authenticated user's profile."""
    return current_user


@router.post("/refresh", response_model=schemas.TokenPair)
def refresh_tokens(
    response: Response,
    payload: schemas.RefreshRequest,
    refresh_token: str = Cookie(None),
) -> Any:
    """Issue new access and refresh tokens using a valid refresh token."""
    from jose import jwt, JWTError

    token_to_use = payload.refresh_token or refresh_token
    if not token_to_use:
        raise HTTPException(status_code=400, detail="Refresh token missing")

    try:
        decoded = jwt.decode(token_to_use, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if decoded.get("type") != "refresh":
            raise HTTPException(status_code=400, detail="Invalid token type")
        user_id = decoded.get("sub")
        if not user_id:
            raise HTTPException(status_code=400, detail="Invalid refresh token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    new_access = auth_token.create_access_token(user_id, expires_delta=access_token_expires)
    new_refresh = auth_token.create_refresh_token(user_id, settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    response.set_cookie(
        key="refresh_token",
        value=new_refresh,
        httponly=True,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        secure=True,
        samesite="lax",
    )
    
    return {"access_token": new_access, "refresh_token": new_refresh, "token_type": "bearer"}
