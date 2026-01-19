from typing import Optional, Any, Generic, TypeVar
from pydantic import BaseModel

T = TypeVar('T')


class StandardResponse(BaseModel, Generic[T]):
    """Standard API response format"""
    success: bool = True
    data: T
    meta: Optional[dict] = None


class ErrorResponse(BaseModel):
    """Standard error response format"""
    success: bool = False
    error: dict

