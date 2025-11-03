from typing import Any

from fastapi import status


def test_create_gym_success(client):
    payload = {"name": "Downtown Fitness", "address": "123 Main St"}
    resp = client.post("/api/v1/gyms/", json=payload)
    assert resp.status_code == status.HTTP_200_OK, resp.text
    data = resp.json()
    assert data["name"] == payload["name"]
    assert data["address"] == payload["address"]
    assert "id" in data


def test_create_gym_duplicate_name_returns_400(client):
    payload = {"name": "Unique Gym", "address": "A St"}
    r1 = client.post("/api/v1/gyms/", json=payload)
    assert r1.status_code == status.HTTP_200_OK

    r2 = client.post("/api/v1/gyms/", json=payload)
    assert r2.status_code == status.HTTP_400_BAD_REQUEST


def test_read_gyms_list(client):
    # ensure at least one gym exists
    client.post("/api/v1/gyms/", json={"name": "List Gym", "address": "Somewhere"})
    resp = client.get("/api/v1/gyms/?skip=0&limit=10")
    assert resp.status_code == status.HTTP_200_OK
    data = resp.json()
    assert isinstance(data, list)
    assert any(g["name"] == "List Gym" for g in data)


def test_read_gym_not_found_returns_404(client):
    resp = client.get("/api/v1/gyms/999999")
    assert resp.status_code == status.HTTP_404_NOT_FOUND


def test_update_gym_success(client):
    # create
    r = client.post("/api/v1/gyms/", json={"name": "ToUpdate", "address": "Addr"})
    gym = r.json()

    # update
    new_data = {"name": "UpdatedName", "address": "New Addr"}
    resp = client.put(f"/api/v1/gyms/{gym['id']}", json=new_data)
    assert resp.status_code == status.HTTP_200_OK
    updated = resp.json()
    assert updated["name"] == "UpdatedName"
    assert updated["address"] == "New Addr"


def test_delete_gym_success(client):
    # create
    r = client.post("/api/v1/gyms/", json={"name": "ToDelete", "address": "A"})
    gym = r.json()

    # delete
    d = client.delete(f"/api/v1/gyms/{gym['id']}")
    assert d.status_code == status.HTTP_200_OK

    # verify 404 after deletion
    r2 = client.get(f"/api/v1/gyms/{gym['id']}")
    assert r2.status_code == status.HTTP_404_NOT_FOUND
