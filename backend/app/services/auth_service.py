import os
import uuid
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any, List

import jwt
from app.models.user import (
    User, 
    UserRole, 
    UserResponse, 
    UserRegisterRequest, 
    UserLoginRequest, 
    TokenResponse, 
    BusinessInfo
)
from app.services.firestore_service import firestore_service

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "krakow-bez-barier-super-secret-jwt-key-2026")
ALGORITHM = "HS256"
TOKEN_EXPIRE_DAYS = 7

class AuthService:
    def __init__(self):
        # Lokalny magazyn w pamięci (fallback gdyby brakło połączenia z Firestore lub w testach offline)
        self._memory_users: Dict[str, User] = {}
        self._seed_demo_accounts()

    def _hash_password(self, password: str, salt: str) -> str:
        """Kryptograficzne haszowanie hasła z użyciem PBKDF2-HMAC-SHA256."""
        key = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt.encode('utf-8'),
            100_000
        )
        return key.hex()

    def _seed_demo_accounts(self):
        """Pre-seed kont demonstracyjnych dla wygody jury i testerów."""
        # 1. Konto użytkownika indywidualnego
        user_salt = "demo_salt_user_123"
        demo_user = User(
            id="user-demo-jan",
            email="jan@krakowbezbarier.pl",
            role=UserRole.USER,
            display_name="Jan Kowalski (Użytkownik wózka)",
            password_hash=self._hash_password("haslo123", user_salt),
            salt=user_salt,
            created_at=datetime.now(timezone.utc).isoformat(),
            reputation_points=45
        )
        self._memory_users[demo_user.email] = demo_user

        # 2. Konto właściciela lokalu / firmy
        biz_salt = "demo_salt_biz_456"
        demo_biz = User(
            id="biz-demo-kawiarnia",
            email="kontakt@kawiarniarelaks.pl",
            role=UserRole.BUSINESS,
            display_name="Kawiarnia Relaks (Właściciel)",
            password_hash=self._hash_password("haslo123", biz_salt),
            salt=biz_salt,
            created_at=datetime.now(timezone.utc).isoformat(),
            business_info=BusinessInfo(
                company_name="Kawiarnia Relaks sp. z o.o.",
                nip="6762512345",
                phone="+48 12 345 67 89",
                website="https://kawiarniarelaks-krakow.pl",
                address="ul. Bracka 8, Kraków"
            ),
            reputation_points=100
        )
        self._memory_users[demo_biz.email] = demo_biz

        # Zapis do Firestore, jeśli aktywne
        if firestore_service.is_connected and firestore_service._db:
            try:
                users_col = firestore_service._db.collection("users")
                # Sprawdzenie czy istnieje demo user
                if not users_col.document(demo_user.id).get().exists:
                    users_col.document(demo_user.id).set(demo_user.model_dump(mode="json"))
                if not users_col.document(demo_biz.id).get().exists:
                    users_col.document(demo_biz.id).set(demo_biz.model_dump(mode="json"))
            except Exception as e:
                pass

    def create_access_token(self, user: User) -> str:
        """Tworzy podpisany token JWT ważny przez TOKEN_EXPIRE_DAYS."""
        now = datetime.now(timezone.utc)
        payload = {
            "sub": user.id,
            "email": user.email,
            "role": user.role.value,
            "display_name": user.display_name,
            "exp": now + timedelta(days=TOKEN_EXPIRE_DAYS),
            "iat": now
        }
        return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    def decode_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Dekoduje i weryfikuje token JWT."""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except Exception:
            return None

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Pobiera użytkownika po adresie e-mail (z Firestore lub pamięci)."""
        normalized_email = email.strip().lower()

        # Próba pobrania z Firestore
        if firestore_service.is_connected and firestore_service._db:
            try:
                docs = firestore_service._db.collection("users").where("email", "==", normalized_email).limit(1).stream()
                for doc in docs:
                    return User(**doc.to_dict())
            except Exception:
                pass

        return self._memory_users.get(normalized_email)

    def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Pobiera użytkownika po identyfikatorze."""
        if firestore_service.is_connected and firestore_service._db:
            try:
                doc = firestore_service._db.collection("users").document(user_id).get()
                if doc.exists:
                    return User(**doc.to_dict())
            except Exception:
                pass

        for u in self._memory_users.values():
            if u.id == user_id:
                return u
        return None

    def register(self, req: UserRegisterRequest) -> TokenResponse:
        """Rejestruje nowego użytkownika (indywidualnego lub biznesowego)."""
        normalized_email = req.email.strip().lower()

        if self.get_user_by_email(normalized_email):
            raise ValueError(f"Użytkownik z adresem {normalized_email} już istnieje.")

        salt = secrets.token_hex(16)
        password_hash = self._hash_password(req.password, salt)
        user_id = f"usr_{uuid.uuid4().hex[:10]}"

        biz_info = None
        if req.role == UserRole.BUSINESS:
            biz_info = BusinessInfo(
                company_name=req.company_name or req.display_name,
                nip=req.nip,
                phone=req.phone,
                website=req.website
            )

        new_user = User(
            id=user_id,
            email=normalized_email,
            role=req.role,
            display_name=req.display_name,
            password_hash=password_hash,
            salt=salt,
            created_at=datetime.now(timezone.utc).isoformat(),
            business_info=biz_info,
            reputation_points=20 if req.role == UserRole.BUSINESS else 10
        )

        # Zapis do pamięci
        self._memory_users[normalized_email] = new_user

        # Zapis do Firestore
        if firestore_service.is_connected and firestore_service._db:
            try:
                firestore_service._db.collection("users").document(user_id).set(new_user.model_dump(mode="json"))
            except Exception:
                pass

        token = self.create_access_token(new_user)
        return TokenResponse(
            access_token=token,
            user=self._to_user_response(new_user)
        )

    def login(self, req: UserLoginRequest) -> TokenResponse:
        """Loguje użytkownika i zwraca token JWT."""
        normalized_email = req.email.strip().lower()
        user = self.get_user_by_email(normalized_email)

        if not user:
            raise ValueError("Nieprawidłowy adres e-mail lub hasło.")

        expected_hash = self._hash_password(req.password, user.salt)
        if expected_hash != user.password_hash:
            raise ValueError("Nieprawidłowy adres e-mail lub hasło.")

        token = self.create_access_token(user)
        return TokenResponse(
            access_token=token,
            user=self._to_user_response(user)
        )

    def demo_login(self, role: str) -> TokenResponse:
        """Logowanie jednym kliknięciem na konto demonstracyjne dla jury."""
        if role == "business":
            user = self.get_user_by_email("kontakt@kawiarniarelaks.pl")
        else:
            user = self.get_user_by_email("jan@krakowbezbarier.pl")

        if not user:
            self._seed_demo_accounts()
            user = self.get_user_by_email("kontakt@kawiarniarelaks.pl" if role == "business" else "jan@krakowbezbarier.pl")

        token = self.create_access_token(user)
        return TokenResponse(
            access_token=token,
            user=self._to_user_response(user)
        )

    def _to_user_response(self, user: User) -> UserResponse:
        return UserResponse(
            id=user.id,
            email=user.email,
            role=user.role,
            display_name=user.display_name,
            business_info=user.business_info,
            created_at=user.created_at,
            reputation_points=user.reputation_points
        )

auth_service = AuthService()
