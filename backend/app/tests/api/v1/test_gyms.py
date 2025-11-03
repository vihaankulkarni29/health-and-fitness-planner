from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.api.v1.endpoints.gyms import get_db
from app.db.base import Base

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_create_gym():
    response = client.post(
        "/api/v1/gyms/",
        json={"name": "Test Gym", "address": "123 Test St"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Gym"
    assert data["address"] == "123 Test St"
    assert "id" in data

def test_read_gym():
    # Create a gym first
    create_response = client.post(
        "/api/v1/gyms/",
        json={"name": "Test Gym 2", "address": "456 Test Ave"},
    )
    assert create_response.status_code == 200
    created_gym_id = create_response.json()["id"]

    response = client.get(f"/api/v1/gyms/{created_gym_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Gym 2"
    assert data["address"] == "456 Test Ave"
    assert data["id"] == created_gym_id

def test_read_gyms():
    # Create multiple gyms
    client.post("/api/v1/gyms/", json={"name": "Test Gym 3", "address": "789 Test Rd"})
    client.post("/api/v1/gyms/", json={"name": "Test Gym 4", "address": "101 Test Ln"})

    response = client.get("/api/v1/gyms/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2 # At least the two we just created

def test_update_gym():
    # Create a gym first
    create_response = client.post(
        "/api/v1/gyms/",
        json={"name": "Test Gym 5", "address": "111 Update St"},
    )
    assert create_response.status_code == 200
    created_gym_id = create_response.json()["id"]

    update_response = client.put(
        f"/api/v1/gyms/{created_gym_id}",
        json={"name": "Updated Gym 5", "address": "222 New Ave"},
    )
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["name"] == "Updated Gym 5"
    assert data["address"] == "222 New Ave"
    assert data["id"] == created_gym_id

def test_delete_gym():
    # Create a gym first
    create_response = client.post(
        "/api/v1/gyms/",
        json={"name": "Test Gym 6", "address": "333 Delete Rd"},
    )
    assert create_response.status_code == 200
    created_gym_id = create_response.json()["id"]

    delete_response = client.delete(f"/api/v1/gyms/{created_gym_id}")
    assert delete_response.status_code == 200
    data = delete_response.json()
    assert data["id"] == created_gym_id

    # Try to read the deleted gym
    get_response = client.get(f"/api/v1/gyms/{created_gym_id}")
    assert get_response.status_code == 404
