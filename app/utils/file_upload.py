import os
import uuid
from pathlib import Path
from typing import Optional, Tuple
from fastapi import UploadFile, HTTPException, status
from app.core.config import settings
from PIL import Image
import PyPDF2


ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png"
}


def validate_file(file: UploadFile) -> Tuple[str, str]:
    """Validate uploaded file and return (file_type, extension)"""
    # Check file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Check MIME type
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file MIME type"
        )
    
    # Determine file type
    if file_ext == ".pdf":
        file_type = "pdf"
    elif file_ext in [".jpg", ".jpeg"]:
        file_type = "jpg"
    elif file_ext == ".png":
        file_type = "png"
    else:
        file_type = "unknown"
    
    return file_type, file_ext


async def save_uploaded_file(file: UploadFile, file_type: str) -> Tuple[str, str]:
    """Save uploaded file and return (file_path, file_name)"""
    # Create upload directory if it doesn't exist
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename
    file_ext = Path(file.filename).suffix.lower()
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = upload_dir / unique_filename
    
    # Check file size
    file_content = await file.read()
    file_size_mb = len(file_content) / (1024 * 1024)
    
    if file_size_mb > settings.MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Max size: {settings.MAX_FILE_SIZE_MB}MB"
        )
    
    # Validate image files
    if file_type in ["jpg", "png"]:
        try:
            from io import BytesIO
            img = Image.open(BytesIO(file_content))
            img.verify()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid image file"
            )
    
    # Save file
    await file.seek(0)  # Reset file pointer
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    return str(file_path), file.filename


def get_file_url(file_path: str) -> str:
    """Get URL/path for file (abstracts storage type)"""
    if settings.STORAGE_TYPE == "s3":
        # In production, return S3 URL
        # For now, return relative path
        return f"/files/{Path(file_path).name}"
    else:
        # Local storage - return relative path
        return f"/files/{Path(file_path).name}"


def extract_text_from_file(file_path: str) -> str:
    """Extract text from PDF or image file"""
    path = Path(file_path)
    
    if not path.exists():
        raise ValueError(f"File not found: {file_path}")
    
    file_ext = path.suffix.lower()
    
    if file_ext == ".pdf":
        # Extract text from PDF
        try:
            text_parts = []
            with open(file_path, "rb") as f:
                pdf_reader = PyPDF2.PdfReader(f)
                for page in pdf_reader.pages:
                    text = page.extract_text()
                    if text:
                        text_parts.append(text)
            return "\n".join(text_parts)
        except Exception as e:
            raise ValueError(f"Failed to extract text from PDF: {str(e)}")
    
    elif file_ext in [".jpg", ".jpeg", ".png"]:
        # For images, we would need OCR (Tesseract, AWS Textract, etc.)
        # For now, return a placeholder
        # In production, integrate OCR service here
        raise ValueError(
            "Image OCR not yet implemented. Please upload PDF files for AI analysis. "
            "Or set DEMO_MODE=true to use demo analysis."
        )
    
    else:
        raise ValueError(f"Unsupported file type for text extraction: {file_ext}")

