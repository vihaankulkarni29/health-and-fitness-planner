from typing import Any

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.config import settings
from app.auth.schemas import TokenPayload
from app.models.trainee import Trainee, UserRole

# Explicit token URL path based on API inclusion
reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login/access-token"
)


def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> Trainee:
    try:
        payload: dict[str, Any] = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = db.query(Trainee).filter(Trainee.id == token_data.sub).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def require_trainer(
    current_user: Trainee = Depends(get_current_user),
) -> Trainee:
    """
    Dependency to require trainer role or higher (trainer or admin).
    Raises 403 Forbidden if user is not a trainer or admin.
    """
    if current_user.role not in [UserRole.TRAINER, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. Trainer role required.",
        )
    return current_user


def require_admin(
    current_user: Trainee = Depends(get_current_user),
) -> Trainee:
    """
    Dependency to require admin role.
    Raises 403 Forbidden if user is not an admin.
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. Admin role required.",
        )
    return current_user
