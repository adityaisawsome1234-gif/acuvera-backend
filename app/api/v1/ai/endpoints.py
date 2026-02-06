from fastapi import APIRouter, HTTPException, status
from app.schemas.ai import AnalyzeRequest, AnalyzeResult
from app.schemas.common import StandardResponse
from app.services.openai_service import OpenAIService

router = APIRouter()


@router.post("/analyze", response_model=StandardResponse[AnalyzeResult])
async def analyze_bill_text(request: AnalyzeRequest):
    """
    Analyze medical bill text using OpenAI.
    
    Accepts bill text and returns structured analysis including:
    - Summary of the bill
    - List of issues found
    - Estimated savings
    - Confidence score
    """
    try:
        service = OpenAIService()
        result = service.analyze_bill_text(request.text)
        
        return StandardResponse(
            success=True,
            data=AnalyzeResult(result=result)
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze bill text: {str(e)}"
        )
