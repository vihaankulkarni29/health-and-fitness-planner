from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.api.v1.endpoints.trainees import get_db
from app.db.base import Base

# Setup a temporary SQLite database for tests
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_trainees.db"
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


# Override the dependency in the trainees module
app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def test_create_trainee():
    payload = {"first_name": "Jane", "last_name": "Doe", "email": "jane.doe@example.com", "gym_id": None, "trainer_id": None, "program_id": None}
    r = client.post("/api/v1/trainees/", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["first_name"] == payload["first_name"]
    assert data["email"] == payload["email"]
    assert "id" in data


def test_read_trainee():
    # create first
    c = client.post("/api/v1/trainees/", json={"first_name": "Alice", "last_name": "Smith", "email": "alice.t@example.com", "gym_id": None, "trainer_id": None, "program_id": None})
    assert c.status_code == 200
    created = c.json()

    # read
    r = client.get(f"/api/v1/trainees/{created['id']}")
    assert r.status_code == 200
    got = r.json()
    assert got["id"] == created["id"]
    assert got["email"] == "alice.t@example.com"


def test_read_trainees():
    # ensure a couple of trainees exist
    client.post("/api/v1/trainees/", json={"first_name": "T1", "last_name": "L1", "email": "t1.t@example.com", "gym_id": None, "trainer_id": None, "program_id": None})
    client.post("/api/v1/trainees/", json={"first_name": "T2", "last_name": "L2", "email": "t2.t@example.com", "gym_id": None, "trainer_id": None, "program_id": None})

    r = client.get("/api/v1/trainees/?skip=0&limit=50")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert any(t["email"] == "t1.t@example.com" for t in data)


def test_update_trainee():
    # create
    c = client.post("/api/v1/trainees/", json={"first_name": "Upd", "last_name": "Me", "email": "upd.t@example.com", "gym_id": None, "trainer_id": None, "program_id": None})
    created = c.json()

    # update
    new_data = {"first_name": "Updated", "last_name": "Name", "email": "upd.t@example.com", "gym_id": None, "trainer_id": None, "program_id": None}
    r = client.put(f"/api/v1/trainees/{created['id']}", json=new_data)
    assert r.status_code == 200
    updated = r.json()
    assert updated["first_name"] == "Updated"
    assert updated["last_name"] == "Name"


def test_delete_trainee():
    # create
    c = client.post("/api/v1/trainees/", json={"first_name": "Del", "last_name": "Me", "email": "del.t@example.com", "gym_id": None, "trainer_id": None, "program_id": None})
    created = c.json()

    # delete
    r = client.delete(f"/api/v1/trainees/{created['id']}")
    assert r.status_code == 200

    # verify 404 after delete
    r2 = client.get(f"/api/v1/trainees/{created['id']}")
    assert r2.status_code == 404
