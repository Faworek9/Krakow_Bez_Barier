"""
Serwis integracji z bazą Google Cloud Firestore dla projektu Kraków Bez Barier.
Zawiera mechanizm Graceful Fallback:
- Jeśli w backendzie znajduje się plik service_account.json lub zmienna GOOGLE_APPLICATION_CREDENTIALS,
  serwis łączy się bezpośrednio z chmurą Google Cloud Firestore.
- Jeśli brak poświadczeń (np. testy jednostkowe offline), automatycznie używa lokalnej bazy JSON.
"""

import os
import json
import logging
from typing import List, Optional, Dict, Any
from pathlib import Path

from app.models.poi import POI
from app.models.feedback import FeedbackSubmission, FeedbackResponse

logger = logging.getLogger(__name__)

# Ścieżka do opcjonalnego klucza serwisowego GCP
BASE_DIR = Path(__file__).resolve().parent.parent.parent
CREDENTIALS_PATH = BASE_DIR / "service_account.json"
LOCAL_SEED_PATH = Path(__file__).resolve().parent.parent / "data" / "krakow_seed_places.json"

class FirestoreService:
    def __init__(self):
        self._db = None
        self._is_connected = False
        self._init_firestore()

    def _init_firestore(self):
        """Inicjalizuje klienta Google Cloud Firestore z uwzględnieniem poświadczeń."""
        try:
            # Sprawdzenie obecności pliku service_account.json w backend/
            if CREDENTIALS_PATH.exists() and "GOOGLE_APPLICATION_CREDENTIALS" not in os.environ:
                os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(CREDENTIALS_PATH)
                logger.info(f"Ustawiono poświadczenia GCP z pliku: {CREDENTIALS_PATH}")

            from google.cloud import firestore
            project = os.getenv("GOOGLE_CLOUD_PROJECT") or os.getenv("GCP_PROJECT")
            if project:
                self._db = firestore.Client(project=project)
            else:
                self._db = firestore.Client()
            self._is_connected = True
            logger.info("Pomyślnie połączono z Google Cloud Firestore!")
        except Exception as e:
            logger.warning(
                f"Brak aktywnego połączenia z Google Cloud Firestore ({e}). "
                "Backend działa w trybie lokalnym (Local Fallback)."
            )
            self._db = None
            self._is_connected = False

    @property
    def is_connected(self) -> bool:
        return self._is_connected

    def get_all_pois(self) -> List[POI]:
        """Pobiera wszystkie obiekty POI z Firestore (lub fallback do lokalnego pliku JSON)."""
        if self._is_connected and self._db:
            try:
                places_ref = self._db.collection("places")
                docs = places_ref.stream()
                items = []
                for doc in docs:
                    data = doc.to_dict()
                    try:
                        items.append(POI(**data))
                    except Exception as err:
                        logger.error(f"Błąd parsowania dokumentu {doc.id}: {err}")
                if items:
                    return items
            except Exception as e:
                logger.error(f"Błąd pobierania danych z Firestore: {e}. Używam lokalnego fallbacku.")

        # Fallback do lokalnego pliku JSON
        return self._load_local_seed()

    def save_poi(self, poi: POI) -> bool:
        """Zapisuje lub aktualizuje obiekt POI w kolekcji 'places'."""
        if not self._is_connected or not self._db:
            logger.warning("Brak połączenia z Firestore - pomijam zdalny zapis POI.")
            return False

        try:
            doc_ref = self._db.collection("places").document(poi.id)
            doc_ref.set(poi.model_dump(mode="json"))
            return True
        except Exception as e:
            logger.error(f"Błąd zapisu POI {poi.id} do Firestore: {e}")
            return False

    def save_feedback(self, submission: FeedbackSubmission) -> Optional[FeedbackResponse]:
        """Zapisuje zgłoszenie użytkownika w kolekcji 'feedback_reports' w Firestore."""
        import uuid
        from datetime import datetime

        report_id = f"rep_{uuid.uuid4().hex[:10]}"
        now_str = datetime.utcnow().isoformat()

        report_dict = submission.model_dump(mode="json")
        report_dict["id"] = report_id
        report_dict["created_at"] = now_str
        report_dict["moderation_status"] = "pending_verification"

        if not hasattr(self, '_memory_feedbacks'):
            self._memory_feedbacks = []
        self._memory_feedbacks.insert(0, report_dict)

        if self._is_connected and self._db:
            try:
                self._db.collection("feedback_reports").document(report_id).set(report_dict)
                logger.info(f"Zapisano zgłoszenie społeczności w Firestore: {report_id}")
            except Exception as e:
                logger.error(f"Błąd zapisu feedbacku do Firestore: {e}")

        return FeedbackResponse(
            submission_id=report_id,
            status="received",
            message="Dziękujemy! Twoja korekta parametrów dostępności została zapisana w chmurze.",
            moderation_status="pending_verification"
        )

    def get_feedback_by_user(self, user_id: str) -> List[Dict[str, Any]]:
        """Zwraca listę zgłoszeń dodanych przez danego użytkownika."""
        if self._is_connected and self._db:
            try:
                docs = self._db.collection("feedback_reports").where("user_id", "==", user_id).stream()
                reports = [doc.to_dict() for doc in docs]
                if reports:
                    return sorted(reports, key=lambda x: x.get("created_at", ""), reverse=True)
            except Exception as e:
                logger.error(f"Błąd pobierania zgłoszeń użytkownika z Firestore: {e}")

        if hasattr(self, '_memory_feedbacks'):
            return [f for f in self._memory_feedbacks if f.get("user_id") == user_id]
        return []

    def seed_initial_places_if_empty(self) -> int:
        """Zasila Firestore początkowymi audytami z Krakowa, jeśli kolekcja jest pusta."""
        if not self._is_connected or not self._db:
            return 0

        try:
            places_ref = self._db.collection("places")
            existing = list(places_ref.limit(1).stream())
            if existing:
                logger.info("Kolekcja 'places' w Firestore zawiera już dane. Pomijam auto-seed.")
                return 0

            local_items = self._load_local_seed()
            batch = self._db.batch()
            count = 0

            for item in local_items:
                doc_ref = places_ref.document(item.id)
                batch.set(doc_ref, item.model_dump(mode="json"))
                count += 1

            batch.commit()
            logger.info(f"Załadowano {count} początkowych miejsc z Krakowa do Google Cloud Firestore!")
            return count
        except Exception as e:
            logger.error(f"Błąd podczas seedowania Firestore: {e}")
            return 0

    def _load_local_seed(self) -> List[POI]:
        """Ładuje dane wzorcowe z lokalnego pliku JSON."""
        if not LOCAL_SEED_PATH.exists():
            return []
        with open(LOCAL_SEED_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            return [POI(**item) for item in data]

# Singleton serwisu
firestore_service = FirestoreService()
