from fastapi import APIRouter

from app.api.v1 import auth, orgs, users, documents, findings, cases, reports, audit_log

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(orgs.router, tags=["orgs"])
api_router.include_router(users.router, tags=["users"])
api_router.include_router(documents.router, tags=["documents"])
api_router.include_router(findings.router, tags=["findings"])
api_router.include_router(cases.router, tags=["cases"])
api_router.include_router(reports.router, tags=["reports"])
api_router.include_router(audit_log.router, tags=["audit-log"])
