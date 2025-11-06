from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings
from app.schemas.health_metric import HealthMetricCreate, HealthMetricUpdate
from app.crud.crud_health_metric import health_metric as crud_health_metric
from app.crud.crud_trainee import trainee as crud_trainee


def test_create_health_metric(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    # Create a trainee to associate the health metric with
    trainee_in = {"first_name": "Test", "last_name": "Trainee", "email": "test.trainee.health@example.com"}
    trainee = crud_trainee.create(db_session, obj_in=trainee_in)

    data = {"trainee_id": trainee.id, "height_cm": 180, "weight_kg": 75, "body_fat_percentage": 15.5}
    response = client.post(
        f"{settings.API_V1_STR}/health_metrics/",
        json=data,
        headers=auth_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["height_cm"] == data["height_cm"]
    assert content["weight_kg"] == data["weight_kg"]
    assert content["body_fat_percentage"] == data["body_fat_percentage"]
    assert "id" in content
    assert "recorded_at" in content


def test_read_health_metric(client: TestClient, db_session: Session, trainer_headers: dict[str, str]) -> None:
    trainee_in = {"first_name": "Test", "last_name": "Trainee", "email": "test.trainee.health2@example.com"}
    trainee = crud_trainee.create(db_session, obj_in=trainee_in)
    health_metric_in = HealthMetricCreate(trainee_id=trainee.id, height_cm=170, weight_kg=65, body_fat_percentage=20.0)
    health_metric = crud_health_metric.create(db_session, obj_in=health_metric_in)

    response = client.get(f"{settings.API_V1_STR}/health_metrics/{health_metric.id}", headers=trainer_headers)
    assert response.status_code == 200
    content = response.json()
    assert content["height_cm"] == health_metric.height_cm
    assert content["weight_kg"] == health_metric.weight_kg
    assert content["body_fat_percentage"] == health_metric.body_fat_percentage
    assert content["id"] == health_metric.id


def test_read_health_metrics(client: TestClient, db_session: Session, trainer_headers: dict[str, str]) -> None:
    response = client.get(f"{settings.API_V1_STR}/health_metrics/", headers=trainer_headers)
    assert response.status_code == 200
    content = response.json()
    assert isinstance(content, list)


def test_update_health_metric(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    trainee_in = {"first_name": "Test", "last_name": "Trainee", "email": "test.trainee.health3@example.com"}
    trainee = crud_trainee.create(db_session, obj_in=trainee_in)
    health_metric_in = HealthMetricCreate(trainee_id=trainee.id, height_cm=190, weight_kg=95, body_fat_percentage=12.0)
    health_metric = crud_health_metric.create(db_session, obj_in=health_metric_in)

    data = {"weight_kg": 96}
    response = client.put(
        f"{settings.API_V1_STR}/health_metrics/{health_metric.id}",
        json=data,
        headers=auth_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["weight_kg"] == data["weight_kg"]
    assert content["id"] == health_metric.id


def test_delete_health_metric(client: TestClient, db_session: Session, auth_headers: dict[str, str], trainer_headers: dict[str, str]) -> None:
    trainee_in = {"first_name": "Test", "last_name": "Trainee", "email": "test.trainee.health4@example.com"}
    trainee = crud_trainee.create(db_session, obj_in=trainee_in)
    health_metric_in = HealthMetricCreate(trainee_id=trainee.id, height_cm=160, weight_kg=55, body_fat_percentage=25.0)
    health_metric = crud_health_metric.create(db_session, obj_in=health_metric_in)

    response = client.delete(f"{settings.API_V1_STR}/health_metrics/{health_metric.id}", headers=auth_headers)
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == health_metric.id

    response = client.get(f"{settings.API_V1_STR}/health_metrics/{health_metric.id}", headers=trainer_headers)
    assert response.status_code == 404
