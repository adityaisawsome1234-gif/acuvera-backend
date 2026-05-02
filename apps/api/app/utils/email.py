import smtplib
from email.message import EmailMessage

from app.core.config import settings


def send_email(to_email: str, subject: str, body: str) -> None:
    """
    Send email via SMTP. Falls back to logging if SMTP not configured.
    In production, SMTP settings MUST be configured.
    """
    if not settings.SMTP_HOST or not settings.SMTP_FROM_EMAIL:
        # Fallback: log to stdout for local dev
        import logging
        logger = logging.getLogger(__name__)
        logger.warning(f"[EMAIL NOT CONFIGURED] To: {to_email} | Subject: {subject}\n{body}")
        if settings.ENVIRONMENT == "production":
            logger.error("SMTP not configured in production! Email verification will not work.")
        return

    try:
        message = EmailMessage()
        message["From"] = settings.SMTP_FROM_EMAIL
        message["To"] = to_email
        message["Subject"] = subject
        message.set_content(body)

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(message)
        
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"Email sent successfully to {to_email}")
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Failed to send email to {to_email}: {str(e)}")
        # In production, raise the error so it's visible in logs
        if settings.ENVIRONMENT == "production":
            raise
