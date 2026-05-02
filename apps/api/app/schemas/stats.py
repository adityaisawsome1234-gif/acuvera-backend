from pydantic import BaseModel


class OrgStatsOut(BaseModel):
    documents_total: int
    documents_processing: int
    findings_total: int
    cases_total: int
