import pytest


def test_health(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_register(client):
    payload = {"full_name": "Alice Test", "email": "alice@example.com", "password": "secret123"}
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data


def test_register_duplicate_email(client):
    payload = {"full_name": "Bob Test", "email": "bob@example.com", "password": "password"}
    client.post("/api/auth/register", json=payload)
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 409


def test_login(client):
    client.post("/api/auth/register", json={
        "full_name": "Carol", "email": "carol@example.com", "password": "pass123"
    })
    response = client.post("/api/auth/login", json={
        "email": "carol@example.com", "password": "pass123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_wrong_password(client):
    client.post("/api/auth/register", json={
        "full_name": "Dave", "email": "dave@example.com", "password": "correct"
    })
    response = client.post("/api/auth/login", json={
        "email": "dave@example.com", "password": "wrong"
    })
    assert response.status_code == 401


def test_get_me(client):
    token_resp = client.post("/api/auth/register", json={
        "full_name": "Eve", "email": "eve@example.com", "password": "evepw"
    })
    token = token_resp.json()["access_token"]
    me = client.get("/api/users/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["email"] == "eve@example.com"


def test_update_profile(client):
    token_resp = client.post("/api/auth/register", json={
        "full_name": "Frank", "email": "frank@example.com", "password": "frankpw"
    })
    token = token_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    update = client.put("/api/users/me", json={"skills": "Python, SQL"}, headers=headers)
    assert update.status_code == 200
    assert update.json()["profile"]["skills"] == "Python, SQL"


def test_get_questions_unauthenticated(client):
    response = client.get("/api/assessments/questions")
    assert response.status_code == 401
