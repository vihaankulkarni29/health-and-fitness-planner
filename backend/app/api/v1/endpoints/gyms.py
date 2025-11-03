from typing import Any, List, Generator

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud.crud_gym import gym as crud_gym
from app.schemas.gym import Gym, GymCreate, GymUpdate
from app.db.session import SessionLocal

router = APIRouter(prefix="/gyms", tags=["gyms"]) 


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=Gym)
def create_gym(
    *,
    db: Session = Depends(get_db),
    gym_in: GymCreate,
) -> Any:
    existing = crud_gym.get_by_name(db, name=gym_in.name)
    if existing:
        raise HTTPException(status_code=400, detail="Gym with this name already exists")
    gym_obj = crud_gym.create(db, obj_in=gym_in)
    return gym_obj


@router.get("/", response_model=List[Gym])
def read_gyms(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    gyms = crud_gym.get_multi(db, skip=skip, limit=limit)
    return gyms


@router.get("/{gym_id}", response_model=Gym)
def read_gym(
    gym_id: int,
    db: Session = Depends(get_db),
) -> Any:
    gym_obj = crud_gym.get(db, id=gym_id)
    if not gym_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gym not found")
    return gym_obj


@router.put("/{gym_id}", response_model=Gym)
def update_gym(
    gym_id: int,
    gym_in: GymUpdate,
    db: Session = Depends(get_db),
) -> Any:
    gym_obj = crud_gym.get(db, id=gym_id)
    if not gym_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gym not found")
    gym_obj = crud_gym.update(db, db_obj=gym_obj, obj_in=gym_in)
    return gym_obj


@router.delete("/{gym_id}", response_model=Gym)
def delete_gym(
    gym_id: int,
    db: Session = Depends(get_db),
) -> Any:
    gym_obj = crud_gym.remove(db, id=gym_id)
    if not gym_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gym not found")
    return gym_obj
