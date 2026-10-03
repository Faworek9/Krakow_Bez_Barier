from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional

from app.models.user import (
    UserRegisterRequest, 
    UserLoginRequest, 
    TokenResponse, 
    UserResponse,
    User
)
from app.services.auth_service import auth_service

router = APIRouter(prefix="/auth", tags=["Uwierzytelnianie i Profile (Konta)"])

def get_current_user(authorization: Optional[str] = Header(None)) -> User:
    """Dependency wyciągająca profil zalogowanego użytkownika z nagłówka Authorization."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Brak autoryzacji. Zaloguj się, aby uzyskać dostęp.")
    
    token = authorization.replace("Bearer ", "").strip()
    payload = auth_service.decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token wygasł lub jest nieprawidłowy.")
    
    user_id = payload.get("sub")
    user = auth_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=401, detail="Nie odnaleziono użytkownika dla podanego tokenu.")
    
    return user

def get_optional_current_user(authorization: Optional[str] = Header(None)) -> Optional[User]:
    """Dependency opcjonalnej autoryzacji (zwraca User lub None bez rzucania 401)."""
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.replace("Bearer ", "").strip()
    payload = auth_service.decode_token(token)
    if not payload:
        return None
    return auth_service.get_user_by_id(payload.get("sub"))

@router.post("/register", response_model=TokenResponse, summary="Rejestracja nowego konta (użytkownik lub firma)")
def register(req: UserRegisterRequest):
    try:
        return auth_service.register(req)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=TokenResponse, summary="Logowanie do konta")
def login(req: UserLoginRequest):
    try:
        return auth_service.login(req)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.get("/me", response_model=UserResponse, summary="Pobierz profil aktualnie zalogowanego użytkownika")
def get_profile(current_user: User = Depends(get_current_user)):
    return auth_service._to_user_response(current_user)

@router.post("/demo/{role}", response_model=TokenResponse, summary="Szybkie logowanie na konto demonstracyjne (dla jury)")
def demo_login(role: str):
    if role not in ["user", "business"]:
        raise HTTPException(status_code=400, detail="Nieprawidłowa rola demonstracyjna. Użyj 'user' lub 'business'.")
    return auth_service.demo_login(role)
