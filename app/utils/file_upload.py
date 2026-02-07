import os
import uuid
import base64
from pathlib import Path
from typing import Optional, Tuple, List
from fastapi import UploadFile, HTTPException, status
from app.core.config import settings
from PIL import Image
import PyPDF2


ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
}


def validate_file(file: UploadFile) -> Tuple[str, str]:
    """Validate uploaded file and return (file_type, extension)"""
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file MIME type",
        )

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
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)

    file_ext = Path(file.filename).suffix.lower()
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = upload_dir / unique_filename

    # Check file size
    file_content = await file.read()
    file_size_mb = len(file_content) / (1024 * 1024)

    if file_size_mb > settings.MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Max size: {settings.MAX_FILE_SIZE_MB}MB",
        )

    # Validate image files
    if file_type in ["jpg", "png"]:
        try:
            from io import BytesIO

            img = Image.open(BytesIO(file_content))
            img.verify()
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid image file",
            )

    # Save file
    with open(file_path, "wb") as f:
        f.write(file_content)

    return str(file_path), file.filename


def get_file_url(file_path: str) -> str:
    """Get URL/path for file"""
    return f"/files/{Path(file_path).name}"


def extract_text_from_file(file_path: str) -> str:
    """Extract text from PDF using PyPDF2 (text-based PDFs only)"""
    path = Path(file_path)
    if not path.exists():
        raise ValueError(f"File not found: {file_path}")

    file_ext = path.suffix.lower()

    if file_ext == ".pdf":
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
        # Can't extract text from images without OCR
        return ""

    else:
        raise ValueError(f"Unsupported file type: {file_ext}")


def get_file_as_base64_images(file_path: str, max_pages: int = 3) -> List[str]:
    """
    Convert a file to base64-encoded PNG images for OpenAI Vision API.

    For PDFs: renders each page as an image (up to max_pages).
    For images: returns the image as-is in base64.

    Returns a list of base64 data-URI strings like:
        ["data:image/png;base64,iVBOR..."]
    """
    path = Path(file_path)
    if not path.exists():
        raise ValueError(f"File not found: {file_path}")

    file_ext = path.suffix.lower()
    images: List[str] = []

    if file_ext == ".pdf":
        try:
            import fitz  # PyMuPDF

            doc = fitz.open(file_path)
            for page_num in range(min(len(doc), max_pages)):
                page = doc[page_num]
                # Render at 150 DPI for good quality without huge size
                pix = page.get_pixmap(dpi=150)
                img_bytes = pix.tobytes("png")
                b64 = base64.b64encode(img_bytes).decode("utf-8")
                images.append(f"data:image/png;base64,{b64}")
            doc.close()
        except ImportError:
            raise ValueError("PyMuPDF (fitz) not installed. Cannot render PDF pages.")
        except Exception as e:
            raise ValueError(f"Failed to render PDF as images: {str(e)}")

    elif file_ext in [".jpg", ".jpeg"]:
        with open(file_path, "rb") as f:
            b64 = base64.b64encode(f.read()).decode("utf-8")
            images.append(f"data:image/jpeg;base64,{b64}")

    elif file_ext == ".png":
        with open(file_path, "rb") as f:
            b64 = base64.b64encode(f.read()).decode("utf-8")
            images.append(f"data:image/png;base64,{b64}")

    else:
        raise ValueError(f"Unsupported file type for image conversion: {file_ext}")

    return images
