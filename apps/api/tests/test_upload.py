from app.core.security import create_access_token, get_password_hash
from app.models import Organization, OrgUser, User, UserRole


def auth_headers(user):
    token = create_access_token({"sub": user.id})
    return {"Authorization": f"Bearer {token}"}


def test_upload_creates_case_and_document(client, db_session):
    org = Organization(name="Upload Org")
    user = User(
        email="upload@acuvera.dev",
        name="uploader",
        hashed_password=get_password_hash("pw"),
        is_email_verified=True,
    )
    db_session.add_all([org, user])
    db_session.flush()
    db_session.add(OrgUser(org_id=org.id, user_id=user.id, role=UserRole.analyst))
    db_session.commit()

    files = {"file": ("test.pdf", b"dummy", "application/pdf")}
    response = client.post(
        f"/api/v1/orgs/{org.id}/documents/upload",
        headers=auth_headers(user),
        files=files,
        data={"case_title": "Upload Case"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["document"]["name"] == "test.pdf"
    assert data["case_id"]
