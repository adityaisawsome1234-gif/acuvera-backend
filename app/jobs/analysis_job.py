"""
Background job system for bill analysis.
Uses threading for MVP. In production, use Celery/Redis.
"""
import threading
import traceback
from sqlalchemy.orm import Session
from app.core.database import SessionLocal


def queue_analysis_job(bill_id: int):
    """Queue an analysis job (non-blocking)"""
    print(f"[Job] Queuing analysis for bill {bill_id}", flush=True)
    thread = threading.Thread(
        target=process_analysis_job,
        args=(bill_id,),
        daemon=True,
        name=f"analysis-bill-{bill_id}",
    )
    thread.start()


def process_analysis_job(bill_id: int):
    """Process a single analysis job in background thread"""
    db: Session = SessionLocal()
    try:
        from app.services.analysis_service import AnalysisService

        print(f"[Job] Starting analysis for bill {bill_id}", flush=True)
        service = AnalysisService(db)
        result = service.analyze_bill(bill_id)
        print(f"[Job] Completed analysis for bill {bill_id}: {result.get('findings_count', 0)} findings", flush=True)
        return result
    except Exception as e:
        print(f"[Job] ERROR analyzing bill {bill_id}: {e}", flush=True)
        traceback.print_exc()

        # Last-resort: mark the bill as FAILED so the frontend doesn't hang
        try:
            from app.models.bill import Bill, BillStatus

            bill = db.query(Bill).filter(Bill.id == bill_id).first()
            if bill and bill.status != BillStatus.COMPLETED:
                bill.status = BillStatus.FAILED
                db.commit()
                print(f"[Job] Marked bill {bill_id} as FAILED", flush=True)
        except Exception:
            pass
    finally:
        db.close()
