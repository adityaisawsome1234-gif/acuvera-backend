from sqlalchemy.orm import Session
from typing import Optional
from app.models.analysis_job import AnalysisJob, JobStatus


class AnalysisJobRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_bill_id(self, bill_id: int) -> Optional[AnalysisJob]:
        return self.db.query(AnalysisJob).filter(AnalysisJob.bill_id == bill_id).first()

    def create(self, bill_id: int) -> AnalysisJob:
        job = AnalysisJob(bill_id=bill_id, status=JobStatus.PENDING)
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)
        return job

    def update(self, job: AnalysisJob) -> AnalysisJob:
        self.db.commit()
        self.db.refresh(job)
        return job

    def mark_processing(self, job: AnalysisJob) -> AnalysisJob:
        from datetime import datetime
        job.status = JobStatus.PROCESSING
        job.started_at = datetime.utcnow()
        return self.update(job)

    def mark_completed(self, job: AnalysisJob) -> AnalysisJob:
        from datetime import datetime
        job.status = JobStatus.COMPLETED
        job.completed_at = datetime.utcnow()
        return self.update(job)

    def mark_failed(self, job: AnalysisJob, error_message: str) -> AnalysisJob:
        from datetime import datetime
        job.status = JobStatus.FAILED
        job.error_message = error_message
        job.completed_at = datetime.utcnow()
        return self.update(job)

