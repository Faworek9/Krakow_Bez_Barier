import json
import os
from typing import List, Optional
from app.models.poi import POI, UserPreferences, AccessibilityEvaluation, CredibilityLevel
from app.models.feedback import FeedbackSubmission
from app.services.accessibility_scorer import evaluate_poi_accessibility
from app.services.firestore_service import firestore_service

class KrakowDataRepository:
    def __init__(self, data_path: Optional[str] = None):
        if not data_path:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            data_path = os.path.join(base_dir, "data", "krakow_seed_places.json")
        self.data_path = data_path
        self._places: List[POI] = []
        self._feedbacks: List[FeedbackSubmission] = []
        self._load_seed_data()

    def _load_seed_data(self):
        # Pobieranie z Google Cloud Firestore z automatycznym fallbackiem do pliku JSON
        pois = firestore_service.get_all_pois()
        if pois:
            self._places = pois
        elif os.path.exists(self.data_path):
            with open(self.data_path, "r", encoding="utf-8") as f:
                raw_list = json.load(f)
                self._places = [POI(**item) for item in raw_list]
        else:
            self._places = []

    def reload(self):
        """Ponowne odświeżenie danych z bazy Firestore."""
        self._load_seed_data()

    def get_all_places(self) -> List[POI]:
        return self._places

    def get_place_by_id(self, poi_id: str) -> Optional[POI]:
        for p in self._places:
            if p.id == poi_id:
                return p
        return None

    def search_places(
        self,
        query: Optional[str] = None,
        category: Optional[str] = None,
        district: Optional[str] = None,
        credibility_filter: Optional[str] = None,
        only_without_gaps: bool = False
    ) -> List[POI]:
        results = self._places
        if query:
            q = query.lower()
            results = [p for p in results if q in p.name.lower() or q in p.address.lower() or (p.description and q in p.description.lower())]
        if category:
            results = [p for p in results if p.category.lower() == category.lower()]
        if district:
            results = [p for p in results if p.district and district.lower() in p.district.lower()]
        if credibility_filter:
            results = [p for p in results if p.meta.credibility_level.value == credibility_filter]
        if only_without_gaps:
            results = [p for p in results if not p.meta.has_data_gaps]
        return results

    def evaluate_places(
        self,
        places: List[POI],
        prefs: UserPreferences
    ) -> List[dict]:
        output = []
        for p in places:
            eval_res = evaluate_poi_accessibility(p, prefs)
            output.append({
                "poi": p,
                "evaluation": eval_res
            })
        # Sortowanie: w pierwszej kolejności obiekty najlepiej dopasowane i z wiarygodnymi danymi
        output.sort(key=lambda x: (x["evaluation"].match_score, x["poi"].meta.credibility_score), reverse=True)
        return output

    def add_feedback(self, submission: FeedbackSubmission) -> bool:
        self._feedbacks.append(submission)
        # Zapis zgłoszenia do chmury Firestore
        firestore_service.save_feedback(submission)

        # Oznaczenie obiektu o toczącym się zgłoszeniu
        poi = self.get_place_by_id(submission.poi_id)
        if poi:
            # Jeżeli użytkownik zgłasza poprawki, podnosimy flagę aktualizacji
            if poi.meta.credibility_level == CredibilityLevel.DATA_GAP:
                if submission.reported_steps_count is not None:
                    poi.features.steps_at_entrance = submission.reported_steps_count
                if submission.reported_door_width_cm is not None:
                    poi.features.entrance_width_cm = submission.reported_door_width_cm
                poi.meta.credibility_level = CredibilityLevel.UNVERIFIED_REPORT
                poi.meta.credibility_score = 55
                poi.meta.data_gaps.append("Zawiera nowe, oczekujące na weryfikację zgłoszenie użytkownika")
                firestore_service.save_poi(poi)
        return True

repo = KrakowDataRepository()
