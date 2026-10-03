from typing import Optional, List
from pydantic import BaseModel, Field

class FeedbackSubmission(BaseModel):
    poi_id: str
    reported_by_nickname: Optional[str] = "Anonimowy użytkownik"
    verified_on_site: bool = True
    
    # Zgłaszane poprawki parametrów
    reported_steps_count: Optional[int] = None
    reported_has_ramp: Optional[bool] = None
    reported_ramp_steep: Optional[bool] = None
    reported_door_width_cm: Optional[int] = None
    reported_curb_height_cm: Optional[float] = None
    reported_toilet_accessible: Optional[bool] = None
    reported_surface_quality: Optional[str] = None
    
    comment: Optional[str] = None
    photo_url: Optional[str] = None
    user_id: Optional[str] = None

class FeedbackResponse(BaseModel):
    submission_id: str
    status: str = "received"
    message: str
    moderation_status: str = "pending_verification"

class FeedbackReportItem(BaseModel):
    id: str
    poi_id: str
    poi_name: Optional[str] = None
    reported_by_nickname: str
    verified_on_site: bool = True
    comment: Optional[str] = None
    created_at: str
    moderation_status: str = "pending_verification"
    user_id: Optional[str] = None

