def test_register_creates_org(client):
    payload = {
        "email": "new@acuvera.dev",
        "name": "New User",
        "password": "pass1234",
        "org_name": "New Org",
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["email"] == "new@acuvera.dev"
    assert data["org"]["name"] == "New Org"
