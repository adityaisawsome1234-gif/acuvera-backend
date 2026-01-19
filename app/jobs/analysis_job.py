"""
Background job system for bill analysis.
In production, this would use Celery/Redis.
For MVP, we'll use a simple threading system.
"""
import threading
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.services.analysis_service import AnalysisService


def queue_analysis_job(bill_id: int):
    """Queue an analysis job (non-blocking)"""
    # In production: Use Celery task queue
    # For MVP: Run in background thread
    thread = threading.Thread(target=process_analysis_job, args=(bill_id,), daemon=True)
    thread.start()


def process_analysis_job(bill_id: int):
    """Process a single analysis job in background thread"""
    db = SessionLocal()
    try:
        service = AnalysisService(db)
        result = service.analyze_bill(bill_id)
        return result
    except Exception as e:
        # Error handling is done in the service
        print(f"Error processing analysis job for bill {bill_id}: {e}")
    finally:
        db.close()

