import uuid
from fastapi import APIRouter
from app.models.feedback import FeedbackSubmission, FeedbackResponse
from app.services.krakow_data_service import repo

router = APIRouter(prefix="/feedback", tags=["Zgłoszenia Użytkowników i Aktualizacje"])

@router.post("", response_model=FeedbackResponse, summary="Zgłoś korektę danych dostępności lub nową barierę")
def submit_feedback(submission: FeedbackSubmission):
    sub_id = f"fb-{uuid.uuid4().hex[:8]}"
    repo.add_feedback(submission)
    return FeedbackResponse(
        submission_id=sub_id,
        status="received",
        message="Dziękujemy! Twoje zgłoszenie zostało zarejestrowane i oczekuje na weryfikację społecznościową.",
        moderation_status="pending_verification"
    )
