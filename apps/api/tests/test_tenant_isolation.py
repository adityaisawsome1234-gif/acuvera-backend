from app.core.security import create_access_token, get_password_hash
from app.models import (
    AuditFinding,
    Document,
    FindingCategory,
    FindingSeverity,
    Organization,
    OrgUser,
    User,
    UserRole,
)


def create_user_with_org(db, email: str, org_name: str):
    org = Organization(name=org_name)
    db.add(org)
    user = User(email=email, name=email.split("@")[0], hashed_password=get_password_hash("pw"))
    db.add(user)
    db.flush()
    membership = OrgUser(org_id=org.id, user_id=user.id, role=UserRole.admin)
    db.add(membership)
    db.commit()
    return user, org


def auth_headers(user):
    token = create_access_token({"sub": user.id})
    return {"Authorization": f"Bearer {token}"}


def test_documents_tenant_isolation(client, db_session):
    user_a, org_a = create_user_with_org(db_session, "a@acuvera.dev", "Org A")
    user_b, org_b = create_user_with_org(db_session, "b@acuvera.dev", "Org B")

    doc_a = Document(org_id=org_a.id, name="doc-a.pdf", storage_path="doc-a.pdf")
    doc_b = Document(org_id=org_b.id, name="doc-b.pdf", storage_path="doc-b.pdf")
    db_session.add_all([doc_a, doc_b])
    db_session.commit()

    response = client.get(
        f"/api/v1/orgs/{org_a.id}/documents", headers=auth_headers(user_a)
    )
    assert response.status_code == 200
    payload = response.json()
    assert len(payload) == 1
    assert payload[0]["id"] == doc_a.id

    forbidden = client.get(
        f"/api/v1/orgs/{org_b.id}/documents", headers=auth_headers(user_a)
    )
    assert forbidden.status_code == 403


def test_findings_tenant_isolation(client, db_session):
    user_a, org_a = create_user_with_org(db_session, "a2@acuvera.dev", "Org A2")
    user_b, org_b = create_user_with_org(db_session, "b2@acuvera.dev", "Org B2")

    doc_a = Document(org_id=org_a.id, name="doc-a.pdf", storage_path="doc-a.pdf")
    doc_b = Document(org_id=org_b.id, name="doc-b.pdf", storage_path="doc-b.pdf")
    db_session.add_all([doc_a, doc_b])
    db_session.flush()

    finding_a = AuditFinding(
        document_id=doc_a.id,
        category=FindingCategory.coding,
        severity=FindingSeverity.high,
        summary="A",
    )
    finding_b = AuditFinding(
        document_id=doc_b.id,
        category=FindingCategory.billing,
        severity=FindingSeverity.low,
        summary="B",
    )
    db_session.add_all([finding_a, finding_b])
    db_session.commit()

    response = client.get(
        f"/api/v1/orgs/{org_a.id}/findings", headers=auth_headers(user_a)
    )
    assert response.status_code == 200
    payload = response.json()
    assert len(payload) == 1
    assert payload[0]["id"] == finding_a.id
