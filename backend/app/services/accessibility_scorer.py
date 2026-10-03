from typing import List
from app.models.poi import POI, UserPreferences, AccessibilityEvaluation, SurfaceType, CredibilityLevel

def evaluate_poi_accessibility(poi: POI, prefs: UserPreferences) -> AccessibilityEvaluation:
    """
    Kluczowy silnik ewaluacji dostępności:
    Zgodnie z wymaganiami konkursu, nie zwraca wyłącznie binarnego 'tak/nie',
    lecz szczegółowo analizuje każdą barierę, udogodnienie oraz luki informacyjne.
    Nigdy nie zakłada, że brak danych oznacza pełną dostępność!
    """
    f = poi.features
    advantages: List[str] = []
    barriers: List[str] = []
    data_gaps: List[str] = list(poi.meta.data_gaps)
    
    match_score = 100
    can_access_independently = True
    
    # 1. Analiza wejścia i schodów
    if f.steps_at_entrance is None:
        data_gaps.append("Brak potwierdzonych danych o liczbie stopni przy wejściu.")
        match_score -= 20
    elif f.steps_at_entrance > 0:
        if f.has_ramp:
            slope_info = f" (nachylenie rampy: {f.ramp_slope_percent}%)" if f.ramp_slope_percent else ""
            advantages.append(f"Dostępna rampa/podjazd przy wejściu{slope_info}")
            if f.ramp_slope_percent and f.ramp_slope_percent > 8.0:
                barriers.append(f"Rampa ma duże nachylenie ({f.ramp_slope_percent}%) – może wymagać asysty.")
                match_score -= 15
                can_access_independently = False
        elif f.elevator.available:
            advantages.append("Dostępna platforma/winda przy wejściu.")
        else:
            barriers.append(f"Schody przy wejściu: {f.steps_at_entrance} stopnie bez podjazdu i rampy!")
            match_score -= 45
            can_access_independently = False
    else:
        advantages.append("Wejście z poziomu terenu (0 stopni).")
        
    # 2. Analiza szerokości wejścia
    if f.entrance_width_cm is None:
        data_gaps.append("Brak pomiaru szerokości drzwi wejściowych.")
        match_score -= 10
    else:
        if f.entrance_width_cm < prefs.min_door_width_cm:
            barriers.append(f"Wąskie wejście ({f.entrance_width_cm} cm) – wymagane minimum to {prefs.min_door_width_cm} cm.")
            match_score -= 35
            can_access_independently = False
        else:
            advantages.append(f"Szerokie wejście ({f.entrance_width_cm} cm) – komfortowe przejście.")

    # 3. Analiza progów i krawężników
    if f.max_curb_cm is None:
        data_gaps.append("Brak informacji o wysokości progu wejściowego.")
        match_score -= 10
    elif f.max_curb_cm > prefs.max_curb_cm:
        barriers.append(f"Wysoki próg/krawężnik ({f.max_curb_cm} cm) – dopuszczalny w Twoim profilu: {prefs.max_curb_cm} cm.")
        match_score -= 20
        if f.max_curb_cm > 5.0:
            can_access_independently = False
    else:
        if f.max_curb_cm == 0.0:
            advantages.append("Całkowicie bezprogowe wejście (0 cm).")
        else:
            advantages.append(f"Niski próg ({f.max_curb_cm} cm) w normie.")

    # 4. Analiza nawierzchni (kluczowe dla walizek, wózków i seniorów)
    if f.surface_type == SurfaceType.COBBLESTONE_ROUGH:
        if prefs.avoid_rough_surfaces:
            barriers.append("Trudna nawierzchnia: kocie łby / nierówny bruk kamienny – znaczne wibracje i opór kół.")
            match_score -= 25
        else:
            advantages.append("Nawierzchnia: historyczny bruk kamienny.")
    elif f.surface_type in (SurfaceType.ASPHALT, SurfaceType.PAVING_SLABS, SurfaceType.INDOOR_TILES):
        advantages.append(f"Gładka, równa nawierzchnia ({f.surface_type.value.replace('_', ' ')}).")

    # 5. Analiza toalety dostosowanej
    if prefs.require_accessible_toilet:
        if not f.accessible_toilet.available:
            barriers.append("Brak toalety przystosowanej dla osób z niepełnosprawnościami.")
            match_score -= 30
        else:
            advantages.append("Dostępna toaleta z uchwytami i bezprogowym wjazdem.")
            if f.accessible_toilet.has_emergency_cord:
                advantages.append("Toaleta wyposażona w instalację alarmową (sznurek SOS).")

    # 6. Miejsca odpoczynku (ławki)
    if prefs.require_rest_places:
        if f.rest_places_nearby:
            advantages.append("W pobliżu znajdują się ławki z oparciami do odpoczynku.")
        else:
            barriers.append("Brak wydzielonych miejsc do siedzenia i odpoczynku w bezpośrednim sąsiedztwie.")
            match_score -= 10

    # 7. Winda dla wielopiętrowych
    if f.elevator.available:
        advantages.append(f"Winda dostępna w obiekcie (drzwi: {f.elevator.door_width_cm or 'standard'} cm).")
        if f.elevator.has_braille:
            advantages.append("Winda z oznaczeniami w alfabecie Braille'a.")

    # Ograniczenie wyniku w zakresie 0-100
    match_score = max(0, min(100, match_score))

    # Wyznaczenie statusu końcowego
    if len(data_gaps) >= 2 or poi.meta.credibility_level == CredibilityLevel.DATA_GAP:
        status = "insufficient_data"
        status_label_pl = "Uwaga: Luki w danych o dostępności"
        can_access_independently = False
    elif match_score >= 85 and len(barriers) == 0:
        status = "ideal"
        status_label_pl = "Idealnie dopasowane do Twoich potrzeb"
    elif match_score >= 65 and can_access_independently:
        status = "good"
        status_label_pl = "Dostępne samodzielnie z drobnymi uwagami"
    elif match_score >= 40:
        status = "warning"
        status_label_pl = "Może wymagać pomocy lub asysty"
    else:
        status = "inaccessible"
        status_label_pl = "Wykryto istotne bariery architektoniczne"

    return AccessibilityEvaluation(
        poi_id=poi.id,
        match_score=match_score,
        status=status,
        status_label_pl=status_label_pl,
        advantages=advantages,
        barriers=barriers,
        data_gap_warnings=data_gaps,
        can_access_independently=can_access_independently
    )
