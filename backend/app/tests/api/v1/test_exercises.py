from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.api.v1.endpoints.exercises import get_db
from app.db.base import Base

# Setup a temporary SQLite database for tests
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_exercises.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create the tables
Base.metadata.create_all(bind=engine)  # type: ignore[attr-defined]


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Override the dependency in the exercises module
app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def test_create_exercise():
    payload = {"name": "Test Exercise", "description": "A test exercise", "video_url": "https://example.com/video"}
    r = client.post("/api/v1/exercises/", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["name"] == payload["name"]
    assert data["description"] == payload["description"]
    assert "id" in data


def test_create_exercise_duplicate_name_returns_400():
    payload = {"name": "Unique Exercise", "description": "Desc"}
    r1 = client.post("/api/v1/exercises/", json=payload)
    assert r1.status_code == 200

    r2 = client.post("/api/v1/exercises/", json=payload)
    assert r2.status_code == 400


def test_read_exercise():
    # create first
    c = client.post("/api/v1/exercises/", json={"name": "Squat", "description": "Leg exercise", "video_url": None})
    assert c.status_code == 200
    created = c.json()

    # read
    r = client.get(f"/api/v1/exercises/{created['id']}")
    assert r.status_code == 200
    got = r.json()
    assert got["id"] == created["id"]
    assert got["name"] == "Squat"


def test_read_exercises():
    # ensure a couple of exercises exist
    client.post("/api/v1/exercises/", json={"name": "E1", "description": "Desc1", "video_url": None})
    client.post("/api/v1/exercises/", json={"name": "E2", "description": "Desc2", "video_url": None})

    r = client.get("/api/v1/exercises/?skip=0&limit=50")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert any(e["name"] == "E1" for e in data)


def test_update_exercise():
    # create
    c = client.post("/api/v1/exercises/", json={"name": "OldName", "description": "Old", "video_url": None})
    created = c.json()

    # update
    new_data = {"name": "UpdatedName", "description": "Updated", "video_url": "https://updated.com"}
    r = client.put(f"/api/v1/exercises/{created['id']}", json=new_data)
    assert r.status_code == 200
    updated = r.json()
    assert updated["name"] == "UpdatedName"
    assert updated["description"] == "Updated"


def test_delete_exercise():
    # create
    c = client.post("/api/v1/exercises/", json={"name": "ToDelete", "description": "Will be deleted", "video_url": None})
    created = c.json()

    # delete
    r = client.delete(f"/api/v1/exercises/{created['id']}")
    assert r.status_code == 200

    # verify 404 after delete
    r2 = client.get(f"/api/v1/exercises/{created['id']}")
    assert r2.status_code == 404
