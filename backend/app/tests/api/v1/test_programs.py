from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.api.v1.endpoints.programs import get_db
from app.db.base import Base

# Setup a temporary SQLite database for tests
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_programs.db"
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


# Override the dependency in the programs module
app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def test_create_program():
    payload = {"name": "Test Program", "description": "A test program", "trainer_id": 1}
    r = client.post("/api/v1/programs/", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["name"] == payload["name"]
    assert data["description"] == payload["description"]
    assert "id" in data


def test_read_program():
    # create first
    c = client.post("/api/v1/programs/", json={"name": "Strength Program", "description": "Strength building", "trainer_id": 1})
    assert c.status_code == 200
    created = c.json()

    # read
    r = client.get(f"/api/v1/programs/{created['id']}")
    assert r.status_code == 200
    got = r.json()
    assert got["id"] == created["id"]
    assert got["name"] == "Strength Program"


def test_read_programs():
    # ensure a couple of programs exist
    client.post("/api/v1/programs/", json={"name": "P1", "description": "Desc1", "trainer_id": 1})
    client.post("/api/v1/programs/", json={"name": "P2", "description": "Desc2", "trainer_id": 1})

    r = client.get("/api/v1/programs/?skip=0&limit=50")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert any(p["name"] == "P1" for p in data)


def test_update_program():
    # create
    c = client.post("/api/v1/programs/", json={"name": "Old Name", "description": "Old Desc", "trainer_id": 1})
    created = c.json()

    # update
    new_data = {"name": "Updated Name", "description": "Updated Desc", "trainer_id": 1}
    r = client.put(f"/api/v1/programs/{created['id']}", json=new_data)
    assert r.status_code == 200
    updated = r.json()
    assert updated["name"] == "Updated Name"
    assert updated["description"] == "Updated Desc"


def test_delete_program():
    # create
    c = client.post("/api/v1/programs/", json={"name": "To Delete", "description": "Will be deleted", "trainer_id": 1})
    created = c.json()

    # delete
    r = client.delete(f"/api/v1/programs/{created['id']}")
    assert r.status_code == 200

    # verify 404 after delete
    r2 = client.get(f"/api/v1/programs/{created['id']}")
    assert r2.status_code == 404
