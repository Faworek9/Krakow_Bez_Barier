import { POI, UserPreferences, EvaluatedPOI, AccessibilityEvaluation } from '../types';

export const SEED_POIS: POI[] = [
  {
    id: "poi-dworzec-glowny",
    name: "Kraków Główny (Dworzec Kolejowy)",
    category: "dworzec",
    address: "pl. Jana Nowaka-Jeziorańskiego 3, 31-154 Kraków",
    district: "Stare Miasto",
    location: { lat: 50.0668, lng: 19.9482 },
    description: "Główny węzeł komunikacyjny Krakowa. Wszystkie perony połączone windami z antresolą i tunelem Magda.",
    features: {
      entrance_width_cm: 140,
      steps_at_entrance: 0,
      has_ramp: true,
      ramp_slope_percent: 3.0,
      max_curb_cm: 0.5,
      door_type: "automatyczne przesuwne",
      surface_type: "plyty_chodnikowe",
      elevator: {
        available: true,
        cabin_dimensions: "120x150 cm",
        door_width_cm: 100,
        has_braille: true,
        has_audio_signals: true
      },
      accessible_toilet: {
        available: true,
        entry_flat: true,
        door_width_cm: 95,
        has_grab_rails: true,
        has_emergency_cord: true,
        wheelchair_turning_space: true
      },
      rest_places_nearby: true,
      hearing_loop: true,
      guide_dog_allowed: true,
      tactile_paving: true
    },
    meta: {
      source_name: "Oficjalny Audyt Dworców PKP S.A. & UMK",
      source_url: "https://otwartedane.um.krakow.pl",
      last_verified_at: "2026-04-10",
      credibility_level: "VERIFIED_OFFICIAL",
      credibility_score: 98,
      has_data_gaps: false,
      data_gaps: [],
      verified_by: "Koordynator Dostępności PKP"
    }
  },
  {
    id: "poi-sukiennice",
    name: "Sukiennice - Galeria Sztuki Polskiej XIX w.",
    category: "muzeum",
    address: "Rynek Główny 1/3, 31-042 Kraków",
    district: "Stare Miasto",
    location: { lat: 50.0617, lng: 19.9373 },
    description: "Zabytkowy budynek w sercu Rynku Głównego. Wystawa na I piętrze dostępna przez windę przeszkloną od strony arkad.",
    features: {
      entrance_width_cm: 95,
      steps_at_entrance: 0,
      has_ramp: true,
      ramp_slope_percent: 5.5,
      max_curb_cm: 1.5,
      door_type: "automatyczne",
      surface_type: "kostka_brukowa",
      elevator: {
        available: true,
        cabin_dimensions: "110x140 cm",
        door_width_cm: 90,
        has_braille: true,
        has_audio_signals: true
      },
      accessible_toilet: {
        available: true,
        entry_flat: true,
        door_width_cm: 90,
        has_grab_rails: true,
        has_emergency_cord: true,
        wheelchair_turning_space: true
      },
      rest_places_nearby: true,
      hearing_loop: true,
      guide_dog_allowed: true,
      tactile_paving: false
    },
    meta: {
      source_name: "Muzeum Narodowe w Krakowie - Deklaracja Dostępności",
      source_url: "https://mnk.pl/dostepnosc",
      last_verified_at: "2026-05-18",
      credibility_level: "VERIFIED_OFFICIAL",
      credibility_score: 95,
      has_data_gaps: false,
      data_gaps: [],
      verified_by: "MNK Zespół ds. Dostępności"
    }
  },
  {
    id: "poi-wawel-zamek",
    name: "Zamek Królewski na Wawelu",
    category: "zabytek",
    address: "Wawel 5, 31-001 Kraków",
    district: "Stare Miasto",
    location: { lat: 50.0544, lng: 19.9354 },
    description: "Wzgórze Wawelskie. Główne podejście od ul. Kanoniczej i św. Idziego ma spore nachylenie (ok. 8-10%) i kostkę brukową. Możliwy wjazd asystowany.",
    features: {
      entrance_width_cm: 110,
      steps_at_entrance: 0,
      has_ramp: true,
      ramp_slope_percent: 8.5,
      max_curb_cm: 2.5,
      door_type: "reczne_ciezkie",
      surface_type: "kocie_lby",
      elevator: {
        available: true,
        cabin_dimensions: "110x140 cm",
        door_width_cm: 90,
        has_braille: true,
        has_audio_signals: false
      },
      accessible_toilet: {
        available: true,
        entry_flat: true,
        door_width_cm: 90,
        has_grab_rails: true,
        has_emergency_cord: true,
        wheelchair_turning_space: true
      },
      rest_places_nearby: true,
      hearing_loop: false,
      guide_dog_allowed: true,
      tactile_paving: false
    },
    meta: {
      source_name: "Audyt Dostępności Wzgórza Wawelskiego",
      source_url: "https://wawel.krakow.pl",
      last_verified_at: "2026-03-20",
      credibility_level: "VERIFIED_OFFICIAL",
      credibility_score: 90,
      has_data_gaps: false,
      data_gaps: [],
      verified_by: "Zarządca Wzgórza Wawelskiego"
    }
  },
  {
    id: "poi-kazimierz-cafe-literacka",
    name: "Kawiarnia 'Literacka Cafe'",
    category: "kawiarnia",
    address: "ul. Józefa 18, 31-056 Kraków",
    district: "Kazimierz",
    location: { lat: 50.0512, lng: 19.9448 },
    description: "Klimatyczna kawiarnia w zabytkowej kamienicy na Kazimierzu. Wejście z pojedynczym progiem/stopniem, brak podjazdu stałego.",
    features: {
      entrance_width_cm: 78,
      steps_at_entrance: 1,
      has_ramp: false,
      ramp_slope_percent: null,
      max_curb_cm: 15.0,
      door_type: "reczne_lekkie",
      surface_type: "kocie_lby",
      elevator: {
        available: false,
        cabin_dimensions: null,
        door_width_cm: null,
        has_braille: false,
        has_audio_signals: false
      },
      accessible_toilet: {
        available: false,
        entry_flat: false,
        door_width_cm: 65,
        has_grab_rails: false,
        has_emergency_cord: false,
        wheelchair_turning_space: false
      },
      rest_places_nearby: false,
      hearing_loop: false,
      guide_dog_allowed: true,
      tactile_paving: false
    },
    meta: {
      source_name: "Zgłoszenie społecznościowe (Fundacja Aktywnych)",
      source_url: null,
      last_verified_at: "2026-07-02",
      credibility_level: "VERIFIED_COMMUNITY",
      credibility_score: 78,
      has_data_gaps: false,
      data_gaps: [],
      verified_by: "Wolontariusze 3x potwierdzone"
    }
  },
  {
    id: "poi-urzad-miasta-wszystkich-swietych",
    name: "Urząd Miasta Krakowa - Pałac Wielopolskich",
    category: "urzad",
    address: "pl. Wszystkich Świętych 3-4, 31-004 Kraków",
    district: "Stare Miasto",
    location: { lat: 50.0588, lng: 19.9382 },
    description: "Główna siedziba UMK. Wejście dla osób z ograniczoną mobilnością od strony dziedzińca z automatyczną platformą.",
    features: {
      entrance_width_cm: 100,
      steps_at_entrance: 0,
      has_ramp: true,
      ramp_slope_percent: 4.5,
      max_curb_cm: 1.0,
      door_type: "automatyczne",
      surface_type: "plyty_chodnikowe",
      elevator: {
        available: true,
        cabin_dimensions: "110x140 cm",
        door_width_cm: 90,
        has_braille: true,
        has_audio_signals: true
      },
      accessible_toilet: {
        available: true,
        entry_flat: true,
        door_width_cm: 90,
        has_grab_rails: true,
        has_emergency_cord: true,
        wheelchair_turning_space: true
      },
      rest_places_nearby: true,
      hearing_loop: true,
      guide_dog_allowed: true,
      tactile_paving: true
    },
    meta: {
      source_name: "Deklaracja Dostępności BIP Miasta Krakowa",
      source_url: "https://bip.krakow.pl",
      last_verified_at: "2026-06-01",
      credibility_level: "VERIFIED_OFFICIAL",
      credibility_score: 96,
      has_data_gaps: false,
      data_gaps: [],
      verified_by: "Koordynator Dostępności UMK"
    }
  },
  {
    id: "poi-cricoteka-podgorze",
    name: "Cricoteka - Ośrodek Dokumentacji Sztuki T. Kantora",
    category: "muzeum",
    address: "ul. Nadwiślańska 2-4, 30-527 Kraków",
    district: "Podgórze",
    location: { lat: 50.0465, lng: 19.9515 },
    description: "Nowoczesny, w pełni dostosowany architektonicznie obiekt nad Wisłą z obszernym placem wejściowym.",
    features: {
      entrance_width_cm: 130,
      steps_at_entrance: 0,
      has_ramp: true,
      ramp_slope_percent: 2.5,
      max_curb_cm: 0.0,
      door_type: "automatyczne przesuwne",
      surface_type: "asfalt",
      elevator: {
        available: true,
        cabin_dimensions: "140x160 cm",
        door_width_cm: 110,
        has_braille: true,
        has_audio_signals: true
      },
      accessible_toilet: {
        available: true,
        entry_flat: true,
        door_width_cm: 100,
        has_grab_rails: true,
        has_emergency_cord: true,
        wheelchair_turning_space: true
      },
      rest_places_nearby: true,
      hearing_loop: true,
      guide_dog_allowed: true,
      tactile_paving: true
    },
    meta: {
      source_name: "Oficjalny audyt 'Kultura Bez Barier'",
      source_url: "https://cricoteka.pl",
      last_verified_at: "2026-04-22",
      credibility_level: "VERIFIED_OFFICIAL",
      credibility_score: 99,
      has_data_gaps: false,
      data_gaps: [],
      verified_by: "Audytor Dostępności Cyfrowej i Architektonicznej"
    }
  },
  {
    id: "poi-restauracja-stara-kamienica-luki-danych",
    name: "Restauracja 'Pod Basztą' (Przykład: Luki w danych)",
    category: "restauracja",
    address: "ul. Floriańska 42, 31-019 Kraków",
    district: "Stare Miasto",
    location: { lat: 50.0645, lng: 19.9405 },
    description: "Obiekt zaimportowany ze wstępnej bazy OpenStreetMap. Brak informacji o stopniach wejściowych i toalecie!",
    features: {
      entrance_width_cm: null,
      steps_at_entrance: null,
      has_ramp: null,
      ramp_slope_percent: null,
      max_curb_cm: null,
      door_type: "nieznany",
      surface_type: "kostka_brukowa",
      elevator: {
        available: false,
        cabin_dimensions: null,
        door_width_cm: null,
        has_braille: false,
        has_audio_signals: false
      },
      accessible_toilet: {
        available: false,
        entry_flat: false,
        door_width_cm: null,
        has_grab_rails: false,
        has_emergency_cord: false,
        wheelchair_turning_space: false
      },
      rest_places_nearby: false,
      hearing_loop: false,
      guide_dog_allowed: true,
      tactile_paving: false
    },
    meta: {
      source_name: "Automatyczny import OpenStreetMap (brak tagów wheelchair)",
      source_url: "https://openstreetmap.org/node/12345678",
      last_verified_at: "2024-02-11",
      credibility_level: "DATA_GAP",
      credibility_score: 35,
      has_data_gaps: true,
      data_gaps: [
        "Brak pomiaru szerokości wejścia",
        "Nieznana liczba stopni lub brak potwierdzenia rampy",
        "Brak informacji o dostępności toalety",
        "Dane nieodświeżane od ponad 2 lat"
      ],
      verified_by: null
    }
  },
  {
    id: "poi-kladka-bernatka",
    name: "Kładka Ojca Bernatka",
    category: "zabytek",
    address: "Most pieszo-rowerowy Kazimierz - Podgórze",
    district: "Kazimierz / Podgórze",
    location: { lat: 50.0487, lng: 19.9478 },
    description: "Pieszo-rowerowe połączenie Kazimierza z Podgórzem. Płaskie, łagodne najazdy, idealne dla wózków i walizek.",
    features: {
      entrance_width_cm: 300,
      steps_at_entrance: 0,
      has_ramp: true,
      ramp_slope_percent: 3.0,
      max_curb_cm: 0.0,
      door_type: "otwarta przestrzeń",
      surface_type: "plyty_chodnikowe",
      elevator: {
        available: false,
        cabin_dimensions: null,
        door_width_cm: null,
        has_braille: false,
        has_audio_signals: false
      },
      accessible_toilet: {
        available: false,
        entry_flat: false,
        door_width_cm: null,
        has_grab_rails: false,
        has_emergency_cord: false,
        wheelchair_turning_space: false
      },
      rest_places_nearby: true,
      hearing_loop: false,
      guide_dog_allowed: true,
      tactile_paving: false
    },
    meta: {
      source_name: "Zarząd Dróg Miasta Krakowa (ZDMK)",
      source_url: "https://zdmk.krakow.pl",
      last_verified_at: "2026-05-10",
      credibility_level: "VERIFIED_OFFICIAL",
      credibility_score: 97,
      has_data_gaps: false,
      data_gaps: [],
      verified_by: "ZDMK Inspektorat Dróg"
    }
  },
  {
    id: "poi-planty-teatr-slowackiego",
    name: "Planty Krakowskie (Ogród przy Teatrze Słowackiego)",
    category: "park",
    address: "pl. Świętego Ducha 1, 31-023 Kraków",
    district: "Stare Miasto",
    location: { lat: 50.0637, lng: 19.9431 },
    description: "Zacieniona trasa parkowa wokół Starego Miasta. Równy asfalt, szerokie alejki, liczne ławki z oparciami.",
    features: {
      entrance_width_cm: 250,
      steps_at_entrance: 0,
      has_ramp: true,
      ramp_slope_percent: 1.5,
      max_curb_cm: 0.0,
      door_type: "otwarta przestrzeń",
      surface_type: "asfalt",
      elevator: {
        available: false,
        cabin_dimensions: null,
        door_width_cm: null,
        has_braille: false,
        has_audio_signals: false
      },
      accessible_toilet: {
        available: true,
        entry_flat: true,
        door_width_cm: 90,
        has_grab_rails: true,
        has_emergency_cord: false,
        wheelchair_turning_space: true
      },
      rest_places_nearby: true,
      hearing_loop: false,
      guide_dog_allowed: true,
      tactile_paving: false
    },
    meta: {
      source_name: "Zarząd Zieleni Miejskiej w Krakowie",
      source_url: "https://zzm.krakow.pl",
      last_verified_at: "2026-04-05",
      credibility_level: "VERIFIED_OFFICIAL",
      credibility_score: 94,
      has_data_gaps: false,
      data_gaps: [],
      verified_by: "ZZM Kraków"
    }
  },
  {
    id: "poi-ksiegarnia-pod-globusem",
    name: "Księgarnia 'Pod Globusem'",
    category: "kawiarnia",
    address: "ul. Długa 1, 31-147 Kraków",
    district: "Stare Miasto",
    location: { lat: 50.0660, lng: 19.9388 },
    description: "Zabytkowa księgarnia. Wejście z niewielkim progiem (ok. 4 cm). Drzwi skrzydłowe otwierane ręcznie.",
    features: {
      entrance_width_cm: 86,
      steps_at_entrance: 0,
      has_ramp: false,
      ramp_slope_percent: null,
      max_curb_cm: 4.0,
      door_type: "reczne_lekkie",
      surface_type: "plyty_chodnikowe",
      elevator: {
        available: false,
        cabin_dimensions: null,
        door_width_cm: null,
        has_braille: false,
        has_audio_signals: false
      },
      accessible_toilet: {
        available: false,
        entry_flat: false,
        door_width_cm: null,
        has_grab_rails: false,
        has_emergency_cord: false,
        wheelchair_turning_space: false
      },
      rest_places_nearby: true,
      hearing_loop: false,
      guide_dog_allowed: true,
      tactile_paving: false
    },
    meta: {
      source_name: "Pojedyncze zgłoszenie użytkownika w aplikacji",
      source_url: null,
      last_verified_at: "2026-08-14",
      credibility_level: "UNVERIFIED_REPORT",
      credibility_score: 50,
      has_data_gaps: false,
      data_gaps: [
        "Wymaga potwierdzenia przez min. 2 dodatkowych użytkowników"
      ],
      verified_by: null
    }
  }
];

export function evaluatePoiLocally(poi: POI, prefs: UserPreferences): AccessibilityEvaluation {
  const f = poi.features;
  const advantages: string[] = [];
  const barriers: string[] = [];
  const data_gaps: string[] = [...poi.meta.data_gaps];
  let match_score = 100;
  let can_access_independently = true;

  // 1. Schody i wejście
  if (f.steps_at_entrance === null) {
    data_gaps.push("Brak potwierdzonych danych o liczbie stopni przy wejściu.");
    match_score -= 20;
  } else if (f.steps_at_entrance > 0) {
    if (f.has_ramp) {
      const slopeInfo = f.ramp_slope_percent ? ` (nachylenie rampy: ${f.ramp_slope_percent}%)` : "";
      advantages.push(`Dostępna rampa/podjazd przy wejściu${slopeInfo}`);
      if (f.ramp_slope_percent && f.ramp_slope_percent > 8.0) {
        barriers.push(`Rampa ma duże nachylenie (${f.ramp_slope_percent}%) – może wymagać asysty.`);
        match_score -= 15;
        can_access_independently = false;
      }
    } else if (f.elevator.available) {
      advantages.push("Dostępna platforma/winda przy wejściu.");
    } else {
      barriers.push(`Schody przy wejściu: ${f.steps_at_entrance} stopnie bez podjazdu i rampy!`);
      match_score -= 45;
      can_access_independently = false;
    }
  } else {
    advantages.push("Wejście z poziomu terenu (0 stopni).");
  }

  // 2. Szerokość wejścia
  if (f.entrance_width_cm === null) {
    data_gaps.push("Brak pomiaru szerokości drzwi wejściowych.");
    match_score -= 10;
  } else {
    if (f.entrance_width_cm < prefs.min_door_width_cm) {
      barriers.push(`Wąskie wejście (${f.entrance_width_cm} cm) – wymagane minimum to ${prefs.min_door_width_cm} cm.`);
      match_score -= 35;
      can_access_independently = false;
    } else {
      advantages.push(`Szerokie wejście (${f.entrance_width_cm} cm) – komfortowe przejście.`);
    }
  }

  // 3. Progi i krawężniki
  if (f.max_curb_cm === null) {
    data_gaps.push("Brak informacji o wysokości progu wejściowego.");
    match_score -= 10;
  } else if (f.max_curb_cm > prefs.max_curb_cm) {
    barriers.push(`Wysoki próg/krawężnik (${f.max_curb_cm} cm) – dopuszczalny w Twoim profilu: ${prefs.max_curb_cm} cm.`);
    match_score -= 20;
    if (f.max_curb_cm > 5.0) {
      can_access_independently = false;
    }
  } else {
    if (f.max_curb_cm === 0.0) {
      advantages.push("Całkowicie bezprogowe wejście (0 cm).");
    } else {
      advantages.push(`Niski próg (${f.max_curb_cm} cm) w normie.`);
    }
  }

  // 4. Nawierzchnia
  if (f.surface_type === 'kocie_lby') {
    if (prefs.avoid_rough_surfaces) {
      barriers.push("Trudna nawierzchnia: kocie łby / nierówny bruk kamienny – znaczne wibracje.");
      match_score -= 25;
    } else {
      advantages.push("Nawierzchnia: historyczny bruk kamienny.");
    }
  } else if (['asfalt', 'plyty_chodnikowe', 'plytki_wewnetrzne'].includes(f.surface_type)) {
    advantages.push(`Gładka, równa nawierzchnia (${f.surface_type.replace('_', ' ')}).`);
  }

  // 5. Toaleta
  if (prefs.require_accessible_toilet) {
    if (!f.accessible_toilet.available) {
      barriers.push("Brak toalety przystosowanej dla osób z niepełnosprawnościami.");
      match_score -= 30;
    } else {
      advantages.push("Dostępna toaleta z uchwytami i bezprogowym wjazdem.");
      if (f.accessible_toilet.has_emergency_cord) {
        advantages.push("Toaleta wyposażona w instalację alarmową (sznurek SOS).");
      }
    }
  }

  // 6. Miejsca odpoczynku
  if (prefs.require_rest_places) {
    if (f.rest_places_nearby) {
      advantages.push("W pobliżu znajdują się ławki z oparciami do odpoczynku.");
    } else {
      barriers.push("Brak wydzielonych miejsc do siedzenia i odpoczynku w bezpośrednim sąsiedztwie.");
      match_score -= 10;
    }
  }

  // 7. Winda
  if (f.elevator.available) {
    advantages.push(`Winda dostępna w obiekcie (drzwi: ${f.elevator.door_width_cm || 'standard'} cm).`);
    if (f.elevator.has_braille) {
      advantages.push("Winda z oznaczeniami w alfabecie Braille'a.");
    }
  }

  match_score = Math.max(0, Math.min(100, match_score));

  let status: 'ideal' | 'good' | 'warning' | 'inaccessible' | 'insufficient_data';
  let status_label_pl: string;

  if (poi.meta.has_data_gaps && data_gaps.length >= 2) {
    status = 'insufficient_data';
    status_label_pl = 'Niepotwierdzone (braki w danych)';
  } else if (match_score >= 85) {
    status = 'ideal';
    status_label_pl = 'Wysoka dostępność';
  } else if (match_score >= 65) {
    status = 'good';
    status_label_pl = 'Dobra dostępność';
  } else if (match_score >= 45) {
    status = 'warning';
    status_label_pl = 'Wymaga asysty / uwagi';
  } else {
    status = 'inaccessible';
    status_label_pl = 'Znaczne bariery';
  }

  return {
    poi_id: poi.id,
    match_score,
    status,
    status_label_pl,
    advantages,
    barriers,
    data_gap_warnings: data_gaps,
    can_access_independently
  };
}

export function evaluateAllLocally(pois: POI[], prefs: UserPreferences): EvaluatedPOI[] {
  const list: EvaluatedPOI[] = pois.map((poi) => ({
    poi,
    evaluation: evaluatePoiLocally(poi, prefs)
  }));

  list.sort((a, b) => {
    if (b.evaluation.match_score !== a.evaluation.match_score) {
      return b.evaluation.match_score - a.evaluation.match_score;
    }
    return b.poi.meta.credibility_score - a.poi.meta.credibility_score;
  });

  return list;
}
