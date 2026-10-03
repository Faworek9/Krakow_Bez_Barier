import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends
from app.models.feedback import FeedbackSubmission, FeedbackResponse, FeedbackReportItem
from app.services.krakow_data_service import repo
from app.services.firestore_service import firestore_service
from app.models.user import User
from app.api.routes_auth import get_current_user, get_optional_current_user

router = APIRouter(prefix="/feedback", tags=["Zgłoszenia Użytkowników i Aktualizacje"])

@router.post("", response_model=FeedbackResponse, summary="Zgłoś korektę danych dostępności lub nową barierę")
def submit_feedback(
    submission: FeedbackSubmission,
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    if current_user:
        submission.user_id = current_user.id
        if not submission.reported_by_nickname or submission.reported_by_nickname == "Anonimowy użytkownik":
            submission.reported_by_nickname = current_user.display_name

    sub_id = f"fb-{uuid.uuid4().hex[:8]}"
    repo.add_feedback(submission)
    return FeedbackResponse(
        submission_id=sub_id,
        status="received",
        message="Dziękujemy! Twoje zgłoszenie zostało zarejestrowane i oczekuje na weryfikację społecznościową.",
        moderation_status="pending_verification"
    )

@router.get("/my-reports", response_model=List[FeedbackReportItem], summary="Pobierz zgłoszenia wysłane przez zalogowanego użytkownika")
def get_my_reports(current_user: User = Depends(get_current_user)):
    reports_data = firestore_service.get_feedback_by_user(current_user.id)
    result = []
    for r in reports_data:
        poi = repo.get_place_by_id(r.get("poi_id", ""))
        poi_name = poi.name if poi else r.get("poi_name", "Nieznany obiekt")
        result.append(FeedbackReportItem(
            id=r.get("id", ""),
            poi_id=r.get("poi_id", ""),
            poi_name=poi_name,
            reported_by_nickname=r.get("reported_by_nickname", current_user.display_name),
            verified_on_site=r.get("verified_on_site", True),
            comment=r.get("comment"),
            created_at=r.get("created_at", ""),
            moderation_status=r.get("moderation_status", "pending_verification"),
            user_id=current_user.id
        ))
    return result

