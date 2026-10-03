export type Language = 'pl' | 'en';

export interface TranslationDictionary {
  // Nawigacja & Globalne
  appName: string;
  appBadge: string;
  skipLink: string;
  navHome: string;
  navPlaces: string;
  navRoutes: string;
  navSettings: string;
  navContrast: string;
  navContrastActive: string;
  navReport: string;
  navTextSize: string;
  navLanguage: string;
  navLogin: string;
  navLogout: string;
  navBusinessPanel: string;
  navMyReports: string;

  // Hero Section
  heroPill: string;
  heroTitle1: string;
  heroTitle2: string;
  heroDesc: string;
  searchPlaceholder: string;
  searchBtn: string;
  popularLabel: string;
  btnBrowseMap: string;
  btnBrowseRoutes: string;
  btnBrowseSettings: string;

  // Reklama / Showcase
  showcaseBadge: string;
  showcaseTitle: string;
  showcaseDesc: string;
  showcasePwaPill: string;
  showcasePrivacyPill: string;

  stat1Title: string;
  stat1Sub: string;
  stat1Desc: string;
  stat1Badge: string;
  stat1Tag: string;

  stat2Title: string;
  stat2Sub: string;
  stat2Desc: string;
  stat2Badge: string;
  stat2Tag: string;

  stat3Title: string;
  stat3Sub: string;
  stat3Desc: string;
  stat3Badge: string;
  stat3Tag: string;

  stat4Title: string;
  stat4Sub: string;
  stat4Desc: string;
  stat4Badge: string;
  stat4Tag: string;

  pwaTitle: string;
  pwaBadge: string;
  pwaDesc: string;
  pwaBtn: string;

  // Profile mobilności
  profilesHeaderPill: string;
  profilesTitle: string;
  profilesDesc: string;
  profilesAdvancedBtn: string;
  activeBadge: string;

  profileWheelchairTitle: string;
  profileWheelchairDesc: string;
  profileWheelchairRule1: string;
  profileWheelchairRule2: string;
  profileWheelchairRule3: string;

  profileLuggageTitle: string;
  profileLuggageDesc: string;
  profileLuggageRule1: string;
  profileLuggageRule2: string;
  profileLuggageRule3: string;

  profileStrollerTitle: string;
  profileStrollerDesc: string;
  profileStrollerRule1: string;
  profileStrollerRule2: string;
  profileStrollerRule3: string;

  profileSeniorTitle: string;
  profileSeniorDesc: string;
  profileSeniorRule1: string;
  profileSeniorRule2: string;
  profileSeniorRule3: string;

  ruleMinDoor: string;
  ruleMaxThreshold: string;
  ruleElevatorToilet: string;
  ruleCobblestones: string;
  ruleStairs: string;
  ruleRamps: string;
  ruleRestAreas: string;
  ruleBenchesRest: string;
  ruleStairsNoLift: string;
  ruleStonePaving: string;
  ruleRequired: string;
  ruleAvoid: string;
  ruleRecommended: string;

  // Wyróżnione miejsca
  featuredPoisPill: string;
  featuredPoisTitle: string;
  featuredPoisAllBtn: string;
  auditDetailsBtn: string;
  showOnMapBtn: string;
  entranceLabel: string;
  doorWidthLabel: string;
  toiletLabel: string;
  elevatorLabel: string;
  matchScore: string;
  dataGapsBadge: string;

  // Trasy
  routesPill: string;
  routesTitle: string;
  routesDesc: string;
  routesPlannerBtn: string;
  distanceLabel: string;
  surfaceLabel: string;
  viewRouteStepsBtn: string;
  route1Title: string;
  route1Desc: string;
  route1Surface: string;
  route2Title: string;
  route2Desc: string;
  route2Surface: string;
  routeRecommendedBadge: string;
  routeAttentionBadge: string;
  routePlannerTitle: string;
  routePlannerDesc: string;

  // Filary projektu
  pillarsPill: string;
  pillarsTitle: string;
  pillarsDesc: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
  pillar4Title: string;
  pillar4Desc: string;

  // Współtworzenie
  communityTitle: string;
  communityDesc: string;
  communityBtn: string;

  // Katalog miejsc
  catalogTitle: string;
  catalogDesc: string;
  catalogSearchPlaceholder: string;
  viewModeBoth: string;
  viewModeList: string;
  viewModeMap: string;
  allCategories: string;
  allDistricts: string;
  catMuseum: string;
  catMonument: string;
  catOffice: string;
  catStation: string;
  catCafe: string;
  catRestaurant: string;
  catPark: string;
  distAll: string;
  distOldTown: string;
  distKazimierz: string;
  distPodgorze: string;
  filterParamOptionsBtn: string;
  filterMobilityHeader: string;
  filterMobilitySub: string;
  filterAllOptions: string;
  filterAdvancedTitle: string;
  searchResultsStatus: string;
  loadingCalculating: string;

  // Ustawienia
  settingsTitle: string;
  settingsDesc: string;
  settingsBtnBack: string;
  settingsBtnSave: string;
  settingsTabWcag: string;
  settingsTabMobility: string;
  settingsTabMap: string;
  settingsTabPrivacy: string;
  languageSelectTitle: string;
  languageSelectDesc: string;
  langPolish: string;
  langEnglish: string;
  wcagSectionTitle: string;
  wcagSectionDesc: string;
  highContrastLabel: string;
  highContrastDesc: string;
  textSizeLabel: string;
  textSizeDesc: string;
  textSizeStandard: string;
  textSizeLarge: string;
  textSizeXLarge: string;
  dyslexicFontLabel: string;
  dyslexicFontDesc: string;
  reducedMotionLabel: string;
  reducedMotionDesc: string;
  soundAssistantLabel: string;
  soundAssistantDesc: string;
  testSpeechBtn: string;
  speechToastPlaying: string;
  speechToastUnsupported: string;
  settingsSavedToast: string;
  resetDefaultsBtn: string;
  clearStorageBtn: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  pl: {
    // Nawigacja & Globalne
    appName: 'Kraków Bez Barier',
    appBadge: 'AccessKraków',
    skipLink: 'Przejdź do głównej zawartości',
    navHome: 'Strona Główna',
    navPlaces: 'Miejsca i Obiekty',
    navRoutes: 'Dostępne Trasy Piesze',
    navSettings: 'Ustawienia i Opcje',
    navContrast: 'Kontrast',
    navContrastActive: 'Wysoki kontrast (Włączony)',
    navReport: 'Zgłoś barierę',
    navTextSize: 'Zmień rozmiar tekstu',
    navLanguage: 'Język',
    navLogin: 'Zaloguj',
    navLogout: 'Wyloguj',
    navBusinessPanel: 'Mój lokal / Biznes',
    navMyReports: 'Moje zgłoszenia',

    // Hero Section
    heroPill: 'Kraków Bez Barier • Oficjalna Platforma Dostępności Miejskiej',
    heroTitle1: 'Odkrywaj Kraków',
    heroTitle2: 'bez barier architektonicznych',
    heroDesc: 'Pierwsza platforma parametrycznej oceny dostępności zabytków, urzędów, muzeów i tras spacerowych. Dokładne wymiary w centymetrach, stopnie, windy, toalety i rodzaj nawierzchni – dopasowane precyzyjnie do Twoich potrzeb.',
    searchPlaceholder: 'Czego szukasz? np. Wawel, Sukiennice, Dworzec, Cricoteka...',
    searchBtn: 'Szukaj',
    popularLabel: 'Popularne:',
    btnBrowseMap: 'Przeglądaj Mapę i Miejsca',
    btnBrowseRoutes: 'Dostępne Trasy Piesze',
    btnBrowseSettings: 'Ustawienia i Opcje',

    // Reklama / Showcase
    showcaseBadge: 'APLIKACJA MIEJSKA NOWEJ GENERACJI • WEB & PWA',
    showcaseTitle: 'Aplikacja, która nie zgaduje Twojej drogi',
    showcaseDesc: 'Standardowe mapy kończą się na ogólnym znaczku „dostępne”. Kraków Bez Barier dostarcza twarde fakty, wymiary w centymetrach i pełną transparentność danych.',
    showcasePwaPill: 'Błyskawiczna (PWA)',
    showcasePrivacyPill: 'Zero Śledzenia RODO',

    stat1Title: '10+ Obiektów',
    stat1Sub: 'Zweryfikowanych kluczowych punktów w Krakowie',
    stat1Desc: 'Wawel, Sukiennice, Dworzec Główny i zabytki. Wszystkie sprawdzone w terenie pod kątem realnych barier architektonicznych.',
    stat1Badge: 'Audyt terenowy',
    stat1Tag: 'Baza Wiedzy',

    stat2Title: '100% Parametrów',
    stat2Sub: 'Centymetry i stopnie zamiast ogólnego „dostępne”',
    stat2Desc: 'Precyzyjne wymiary drzwi, progów, nachylenia ramp i kabin toalet. Ty sam decydujesz, co jest dla Ciebie bezpieczne.',
    stat2Badge: 'Dokładność do cm',
    stat2Tag: 'Twarde Liczby',

    stat3Title: 'Brak danych != Dostępne',
    stat3Sub: 'Luki informacyjne są oznaczane jako ostrzeżenia',
    stat3Desc: 'Nigdy nie ryzykujemy Twojego bezpieczeństwa domysłami. Gdy brak audytu wejścia, system wyraźnie informuje o luce.',
    stat3Badge: 'Czerwona flaga',
    stat3Tag: 'Uczciwość Danych',

    stat4Title: 'WCAG 2.2 AA',
    stat4Sub: 'Kontrast, powiększenie tekstu i obsługa czytników',
    stat4Desc: 'Aplikacja dostępna cyfrowo: tryb wysokiego kontrastu, czcionka ułatwiająca czytanie przy dysleksji i nawigacja klawiaturą.',
    stat4Badge: 'Pełna dostępność',
    stat4Tag: 'Standard Cyfrowy',

    pwaTitle: 'Zainstaluj na smartfonie bezpośrednio z przeglądarki (PWA)',
    pwaBadge: 'Bez pobierania ze sklepu',
    pwaDesc: 'Brak opłat, 100% zgodności z RODO, błyskawiczne działanie w terenie i oszczędność baterii podczas spaceru po Krakowie.',
    pwaBtn: 'Przeglądaj obiekty',

    // Profile mobilności
    profilesHeaderPill: 'Personalizacja parametrów',
    profilesTitle: 'Wybierz swój profil mobilności',
    profilesDesc: 'Kliknij profil, aby natychmiast przeliczyć ocenę dostępności obiektów w Krakowie. Żadnych pytań o orzeczenia medyczne.',
    profilesAdvancedBtn: 'Zaawansowane parametry w Ustawieniach →',
    activeBadge: 'Aktywny',

    profileWheelchairTitle: 'Osoba na wózku',
    profileWheelchairDesc: 'Manualnym lub elektrycznym',
    profileWheelchairRule1: 'Drzwi min.: ≥ 85 cm',
    profileWheelchairRule2: 'Próg max.: ≤ 2.0 cm',
    profileWheelchairRule3: 'Winda i toaleta: Wymagane',

    profileLuggageTitle: 'Turysta z walizką',
    profileLuggageDesc: 'Podróż bez wibracji i dźwigania',
    profileLuggageRule1: 'Kocie łby: Unikaj',
    profileLuggageRule2: 'Schody: Unikaj',
    profileLuggageRule3: 'Pochylnie: Wskazane',

    profileStrollerTitle: 'Rodzina z dzieckiem',
    profileStrollerDesc: 'Wózek gondola lub spacerówka',
    profileStrollerRule1: 'Drzwi min.: ≥ 75 cm',
    profileStrollerRule2: 'Próg max.: ≤ 4.0 cm',
    profileStrollerRule3: 'Strefy odpoczynku: Wymagane',

    profileSeniorTitle: 'Senior / Asysta',
    profileSeniorDesc: 'Miejsca odpoczynku i poręcze',
    profileSeniorRule1: 'Ławki i odpoczynek: Wymagane',
    profileSeniorRule2: 'Schody bez windy: Unikaj',
    profileSeniorRule3: 'Bruk kamienny: Unikaj',

    ruleMinDoor: 'Drzwi min.:',
    ruleMaxThreshold: 'Próg max.:',
    ruleElevatorToilet: 'Winda i toaleta:',
    ruleCobblestones: 'Kocie łby:',
    ruleStairs: 'Schody:',
    ruleRamps: 'Pochylnie:',
    ruleRestAreas: 'Strefy odpoczynku:',
    ruleBenchesRest: 'Ławki i odpoczynek:',
    ruleStairsNoLift: 'Schody bez windy:',
    ruleStonePaving: 'Bruk kamienny:',
    ruleRequired: 'Wymagane',
    ruleAvoid: 'Unikaj',
    ruleRecommended: 'Wskazane',

    // Wyróżnione miejsca
    featuredPoisPill: 'Dopasowane do Twojego profilu',
    featuredPoisTitle: 'Wyróżnione miejsca w Krakowie',
    featuredPoisAllBtn: 'Zobacz wszystkie obiekty',
    auditDetailsBtn: 'Szczegóły audytu',
    showOnMapBtn: 'Pokaż na mapie',
    entranceLabel: 'Wejście:',
    doorWidthLabel: 'Szerokość drzwi:',
    toiletLabel: 'Toaleta:',
    elevatorLabel: 'Winda:',
    matchScore: 'dopasowania',
    dataGapsBadge: 'Luki danych',

    // Trasy
    routesPill: 'Nawigacja bez barier',
    routesTitle: 'Rekomendowane trasy piesze',
    routesDesc: 'Analiza nawierzchni krok po kroku z podziałem na asfalt, płyty chodnikowe i kocie łby.',
    routesPlannerBtn: 'Otwórz Planer Tras',
    distanceLabel: 'Dystans:',
    surfaceLabel: 'Nawierzchnia:',
    viewRouteStepsBtn: 'Zobacz etapy trasy krok po kroku',
    route1Title: 'Dworzec Główny PKP → Rynek Główny',
    route1Desc: 'Trasa przez Planty i ul. Szpitalną. Płaskie wjazdy z peronów, gładkie płyty chodnikowe i asfalt w parku.',
    route1Surface: '60% płyty, 30% asfalt, 10% bruk',
    route2Title: 'Rynek Główny → Zamek Królewski Wawel',
    route2Desc: 'Trasa przez ul. Grodzką. Historyczna kostka brukowa na podejściu wawelskim wymaga uwagi przy wózkach i walizkach.',
    route2Surface: '50% płyty, 35% bruk, 15% kocie łby',
    routeRecommendedBadge: 'Rekomendowana (92%)',
    routeAttentionBadge: 'Wymaga uwagi (75%)',
    routePlannerTitle: 'Planer Dostępnych Tras Pieszych w Krakowie',
    routePlannerDesc: 'Wybierz trasę, aby sprawdzić analizę nawierzchni, krawężników, schodów oraz profilu nachylenia terenu.',

    // Filary projektu
    pillarsPill: 'Innowacja i Rzetelność',
    pillarsTitle: 'Dlaczego standardowe mapy zawodzą, a Kraków Bez Barier daje pewność?',
    pillarsDesc: 'Koniec z jednym znaczkiem „dostępne dla niepełnosprawnych”. Rzeczywiste potrzeby wymagają konkretnych danych.',
    pillar1Title: 'Parametry zamiast etykiet',
    pillar1Desc: 'Podajemy dokładną liczbę stopni, szerokość drzwi w centymetrach, kąt nachylenia rampy i rodzaj nawierzchni. Ty decydujesz, co jest dla Ciebie bezpieczne.',
    pillar2Title: 'Piramida wiarygodności',
    pillar2Desc: 'Każde miejsce ma określone źródło (audyt miejski UMK, OpenStreetMap lub zgłoszenie mieszkańców) i datę ostatniej weryfikacji w terenie.',
    pillar3Title: 'Brak danych != Dostępne',
    pillar3Desc: 'Gdy nie ma pomiaru wejścia lub toalety, system ostrzega czerwoną plakietką „Luki w danych”. Nigdy nie ryzykujemy Twojego bezpieczeństwa domysłami.',
    pillar4Title: 'Prywatność (RODO)',
    pillar4Desc: 'Zero pytań o stan zdrowia czy niepełnosprawność. Twoje ustawienia fizyczne pozostają wyłącznie w Twojej przeglądarce i nie są profilowane.',

    // Współtworzenie
    communityTitle: 'Zauważyłeś nową barierę lub błąd w danych w Krakowie?',
    communityDesc: 'Społeczność jest sercem tego projektu. Zgłoś brakujący podjazd, remont wejścia lub nieczynną windę w prostym formularzu.',
    communityBtn: 'Zgłoś barierę / Dodaj korektę',

    // Katalog miejsc
    catalogTitle: 'Katalog Miejsc i Obiektów w Krakowie',
    catalogDesc: 'Sprawdź parametry wejść, progów, toalet i nawierzchni według Twojego profilu.',
    catalogSearchPlaceholder: 'Szukaj obiektu lub ulicy (np. Sukiennice, Wawel, Dworzec, Floriańska, Cricoteka)...',
    viewModeBoth: 'Oba',
    viewModeList: 'Lista',
    viewModeMap: 'Mapa',
    allCategories: 'Wszystkie kategorie',
    allDistricts: 'Cały Kraków',
    catMuseum: 'Muzea',
    catMonument: 'Zabytki',
    catOffice: 'Urzędy',
    catStation: 'Dworce',
    catCafe: 'Kawiarnie',
    catRestaurant: 'Restauracje',
    catPark: 'Parki',
    distAll: 'Cały Kraków',
    distOldTown: 'Stare Miasto',
    distKazimierz: 'Kazimierz',
    distPodgorze: 'Podgórze',
    filterParamOptionsBtn: '⚙️ Opcje parametrów',
    filterMobilityHeader: 'Dopasuj do swoich możliwości ruchowych',
    filterMobilitySub: 'Prywatność przede wszystkim: nie pytamy o diagnozy, lecz o konkretne wymiary i nawierzchnie.',
    filterAllOptions: '⚙️ Wszystkie opcje',
    filterAdvancedTitle: 'Szczegółowe parametry fizyczne',
    searchResultsStatus: 'Znaleziono {count} obiektów spełniających wybrane kryteria mobilności.',
    loadingCalculating: 'Ładowanie i przeliczanie barier architektonicznych...',

    // Ustawienia
    settingsTitle: 'Ustawienia i Opcje Dostępności',
    settingsDesc: 'Skonfiguruj ułatwienia cyfrowe (WCAG 2.2 AA), fizyczne wymiary barier architektonicznych oraz sposób wyświetlania mapy.',
    settingsBtnBack: 'Powrót do strony głównej',
    settingsBtnSave: 'Zapisz ustawienia',
    settingsTabWcag: 'Dostępność Cyfrowa (WCAG 2.2)',
    settingsTabMobility: 'Parametry Mobilności i Wymiary',
    settingsTabMap: 'Widok Mapy i Preferencje',
    settingsTabPrivacy: 'Prywatność i Pamięć (RODO)',
    languageSelectTitle: 'Język Aplikacji / App Language',
    languageSelectDesc: 'Wybierz język interfejsu (polski lub angielski).',
    langPolish: 'Polski (PL)',
    langEnglish: 'English (EN)',
    wcagSectionTitle: 'Dostępność Cyfrowa & Wygląd Interfejsu (WCAG 2.2 AA)',
    wcagSectionDesc: 'Dostosuj kontrast, rozmiar tekstu oraz asystenta dźwiękowego do swoich indywidualnych potrzeb percepcyjnych.',
    highContrastLabel: 'Tryb wysokiego kontrastu',
    highContrastDesc: 'Zwiększa kontrast krawędzi i elementów do współczynnika >7:1 (żółto-czarne akcenty).',
    textSizeLabel: 'Wielkość czcionki (Skalowanie)',
    textSizeDesc: 'Ułatwia czytanie bez utraty struktury i czytelności strony.',
    textSizeStandard: 'Standardowa (100%)',
    textSizeLarge: 'Powiększona (115%)',
    textSizeXLarge: 'Duża (130%)',
    dyslexicFontLabel: 'Krój pisma dla osób z dysleksją (OpenDyslexic)',
    dyslexicFontDesc: 'Specjalny profil liter z obciążoną dolną linią wspomaga płynne czytanie.',
    reducedMotionLabel: 'Redukcja animacji (Ruch i przejścia)',
    reducedMotionDesc: 'Wyłącza efekty ruchu i dynamiczne animacje, chroniąc przed zawrotami głowy.',
    soundAssistantLabel: 'Asystent dźwiękowy & syntezator mowy',
    soundAssistantDesc: 'Odczytuje na głos kluczowe parametry barier po kliknięciu obiektu.',
    testSpeechBtn: 'Przetestuj mowę',
    speechToastPlaying: 'Odtwarzanie testowej podpowiedzi głosowej.',
    speechToastUnsupported: 'Twoja przeglądarka nie obsługuje wbudowanego syntezatora mowy.',
    settingsSavedToast: 'Wszystkie preferencje i opcje zostały zapisane w pamięci przeglądarki (localStorage).',
    resetDefaultsBtn: 'Przywróć domyślne ustawienia profilu',
    clearStorageBtn: 'Wyczyść dane z pamięci lokalnej (Reset)'
  },
  en: {
    // Navigation & Global
    appName: 'Krakow Barrier-Free',
    appBadge: 'AccessKrakow',
    skipLink: 'Skip to main content',
    navHome: 'Home',
    navPlaces: 'Places & POIs',
    navRoutes: 'Accessible Routes',
    navSettings: 'Settings & Options',
    navContrast: 'Contrast',
    navContrastActive: 'High Contrast (Enabled)',
    navReport: 'Report barrier',
    navTextSize: 'Change text size',
    navLanguage: 'Language',
    navLogin: 'Log in',
    navLogout: 'Log out',
    navBusinessPanel: 'My Venue / Business',
    navMyReports: 'My reports',

    // Hero Section
    heroPill: 'Krakow Barrier-Free • Official City Accessibility Platform',
    heroTitle1: 'Explore Krakow',
    heroTitle2: 'without architectural barriers',
    heroDesc: 'The first platform for parametric accessibility evaluation of monuments, public offices, museums, and walking routes. Exact dimensions in centimeters, steps, elevators, toilets, and surface types – tailored precisely to your needs.',
    searchPlaceholder: 'What are you looking for? e.g. Wawel, Cloth Hall, Station, Cricoteka...',
    searchBtn: 'Search',
    popularLabel: 'Popular:',
    btnBrowseMap: 'Browse Map & Places',
    btnBrowseRoutes: 'Accessible Walking Routes',
    btnBrowseSettings: 'Settings & Options',

    // Showcase
    showcaseBadge: 'NEXT-GENERATION CITY APP • WEB & PWA',
    showcaseTitle: 'An app that does not guess your path',
    showcaseDesc: 'Standard maps stop at a vague "accessible" badge. Krakow Barrier-Free delivers hard facts, centimeter dimensions, and full data transparency.',
    showcasePwaPill: 'Lightning Fast (PWA)',
    showcasePrivacyPill: 'Zero Tracking GDPR',

    stat1Title: '10+ Places',
    stat1Sub: 'Verified key landmarks in Krakow',
    stat1Desc: 'Wawel, Cloth Hall, Main Railway Station, and museums. All verified on-site for real architectural barriers.',
    stat1Badge: 'On-site audit',
    stat1Tag: 'Knowledge Base',

    stat2Title: '100% Parameters',
    stat2Sub: 'Centimeters and degrees instead of generic "accessible"',
    stat2Desc: 'Precise measurements of doors, thresholds, ramp slopes, and accessible restrooms. You decide what is safe for you.',
    stat2Badge: 'Accuracy to cm',
    stat2Tag: 'Hard Numbers',

    stat3Title: 'No data != Accessible',
    stat3Sub: 'Information gaps are flagged as warnings',
    stat3Desc: 'We never risk your safety with guesswork. When an entrance measurement is missing, the system clearly alerts you of a data gap.',
    stat3Badge: 'Red flag warning',
    stat3Tag: 'Data Honesty',

    stat4Title: 'WCAG 2.2 AA',
    stat4Sub: 'Contrast, text scaling, and screen reader support',
    stat4Desc: 'Digitally accessible application: high contrast mode, dyslexia-friendly font, and full keyboard navigation support.',
    stat4Badge: 'Full accessibility',
    stat4Tag: 'Digital Standard',

    pwaTitle: 'Install on your smartphone directly from browser (PWA)',
    pwaBadge: 'No app store download needed',
    pwaDesc: 'No fees, 100% GDPR compliant, blazing-fast in the field, and battery-friendly while walking around Krakow.',
    pwaBtn: 'Browse places',

    // Profiles
    profilesHeaderPill: 'Parameter Personalization',
    profilesTitle: 'Choose your mobility profile',
    profilesDesc: 'Click a profile to instantly recalculate accessibility evaluations across Krakow. Zero questions about medical conditions.',
    profilesAdvancedBtn: 'Advanced parameters in Settings →',
    activeBadge: 'Active',

    profileWheelchairTitle: 'Wheelchair User',
    profileWheelchairDesc: 'Manual or electric wheelchair',
    profileWheelchairRule1: 'Min door width: ≥ 85 cm',
    profileWheelchairRule2: 'Max threshold: ≤ 2.0 cm',
    profileWheelchairRule3: 'Elevator & toilet: Required',

    profileLuggageTitle: 'Tourist with Luggage',
    profileLuggageDesc: 'Smooth rolling without vibration or lifting',
    profileLuggageRule1: 'Cobblestones: Avoid',
    profileLuggageRule2: 'Stairs: Avoid',
    profileLuggageRule3: 'Ramps: Recommended',

    profileStrollerTitle: 'Family with Stroller',
    profileStrollerDesc: 'Pram or stroller walking',
    profileStrollerRule1: 'Min door width: ≥ 75 cm',
    profileStrollerRule2: 'Max threshold: ≤ 4.0 cm',
    profileStrollerRule3: 'Resting spots: Required',

    profileSeniorTitle: 'Senior / Assisted',
    profileSeniorDesc: 'Resting spots and handrails',
    profileSeniorRule1: 'Benches & rest: Required',
    profileSeniorRule2: 'Stairs without lift: Avoid',
    profileSeniorRule3: 'Uneven stone paving: Avoid',

    ruleMinDoor: 'Min door:',
    ruleMaxThreshold: 'Max threshold:',
    ruleElevatorToilet: 'Elevator & toilet:',
    ruleCobblestones: 'Cobblestones:',
    ruleStairs: 'Stairs:',
    ruleRamps: 'Ramps:',
    ruleRestAreas: 'Rest areas:',
    ruleBenchesRest: 'Benches & rest:',
    ruleStairsNoLift: 'Stairs without lift:',
    ruleStonePaving: 'Stone paving:',
    ruleRequired: 'Required',
    ruleAvoid: 'Avoid',
    ruleRecommended: 'Recommended',

    // Featured POIs
    featuredPoisPill: 'Matched to your profile',
    featuredPoisTitle: 'Featured Places in Krakow',
    featuredPoisAllBtn: 'View all places',
    auditDetailsBtn: 'Audit details',
    showOnMapBtn: 'Show on map',
    entranceLabel: 'Entrance:',
    doorWidthLabel: 'Door width:',
    toiletLabel: 'Toilet:',
    elevatorLabel: 'Elevator:',
    matchScore: 'match',
    dataGapsBadge: 'Data gaps',

    // Routes
    routesPill: 'Barrier-free navigation',
    routesTitle: 'Recommended walking routes',
    routesDesc: 'Step-by-step surface analysis covering asphalt, smooth sidewalk slabs, and historical cobblestones.',
    routesPlannerBtn: 'Open Route Planner',
    distanceLabel: 'Distance:',
    surfaceLabel: 'Surface:',
    viewRouteStepsBtn: 'View route steps step-by-step',
    route1Title: 'Main Railway Station → Main Square',
    route1Desc: 'Route via Planty Park and Szpitalna Street. Flat curb cuts, smooth sidewalk tiles, and park asphalt.',
    route1Surface: '60% slabs, 30% asphalt, 10% cobbles',
    route2Title: 'Main Square → Wawel Royal Castle',
    route2Desc: 'Route via Grodzka Street. Historical cobblestones on the Wawel approach require attention for wheelchairs and strollers.',
    route2Surface: '50% slabs, 35% cobbles, 15% rough cobbles',
    routeRecommendedBadge: 'Recommended (92%)',
    routeAttentionBadge: 'Requires attention (75%)',
    routePlannerTitle: 'Krakow Barrier-Free Walking Route Planner',
    routePlannerDesc: 'Select a route to view analysis of surface types, curbs, stairs, and incline slope profiles.',

    // Pillars
    pillarsPill: 'Innovation & Reliability',
    pillarsTitle: 'Why standard maps fail and Krakow Barrier-Free delivers certainty?',
    pillarsDesc: 'No more single "wheelchair accessible" icon. Real needs require concrete physical data.',
    pillar1Title: 'Parameters instead of labels',
    pillar1Desc: 'We provide exact step count, door width in centimeters, ramp slope angle, and surface type. You decide what is safe for you.',
    pillar2Title: 'Reliability Pyramid',
    pillar2Desc: 'Every place has an identified source (Krakow City Hall audit, OpenStreetMap, or community reports) and date of last field verification.',
    pillar3Title: 'No data != Accessible',
    pillar3Desc: 'When entrance or restroom measurements are missing, the system warns with a red "Data gaps" badge. We never risk your safety with assumptions.',
    pillar4Title: 'Privacy & GDPR',
    pillar4Desc: 'Zero questions about your health conditions or disability. Your physical preferences stay strictly on your device and are never profiled.',

    // Community
    communityTitle: 'Spotted a new barrier or data inaccuracy in Krakow?',
    communityDesc: 'The community is at the heart of this project. Report a missing ramp, renovation, or broken elevator in a simple form.',
    communityBtn: 'Report barrier / Submit correction',

    // Catalog
    catalogTitle: 'Krakow Places & Points of Interest Catalog',
    catalogDesc: 'Check entrance dimensions, thresholds, toilets, and surface types according to your personalized profile.',
    catalogSearchPlaceholder: 'Search for place or street (e.g. Cloth Hall, Wawel, Station, Florianska, Cricoteka)...',
    viewModeBoth: 'Both',
    viewModeList: 'List',
    viewModeMap: 'Map',
    allCategories: 'All categories',
    allDistricts: 'All Krakow',
    catMuseum: 'Museums',
    catMonument: 'Monuments',
    catOffice: 'Offices',
    catStation: 'Stations',
    catCafe: 'Cafes',
    catRestaurant: 'Restaurants',
    catPark: 'Parks',
    distAll: 'All Krakow',
    distOldTown: 'Old Town',
    distKazimierz: 'Kazimierz',
    distPodgorze: 'Podgórze',
    filterParamOptionsBtn: '⚙️ Parameter options',
    filterMobilityHeader: 'Match your mobility requirements',
    filterMobilitySub: 'Privacy first: we do not ask about medical diagnosis, only specific dimensions and surfaces.',
    filterAllOptions: '⚙️ All options',
    filterAdvancedTitle: 'Detailed physical parameters',
    searchResultsStatus: 'Found {count} places matching selected mobility criteria.',
    loadingCalculating: 'Loading and recalculating architectural barriers...',

    // Settings
    settingsTitle: 'Settings & Accessibility Center',
    settingsDesc: 'Configure digital accessibility (WCAG 2.2 AA), physical architectural barrier dimensions, and map display preferences.',
    settingsBtnBack: 'Back to home page',
    settingsBtnSave: 'Save settings',
    settingsTabWcag: 'Digital Accessibility (WCAG 2.2)',
    settingsTabMobility: 'Mobility Parameters & Dimensions',
    settingsTabMap: 'Map View & Preferences',
    settingsTabPrivacy: 'Privacy & Storage (GDPR)',
    languageSelectTitle: 'App Language / Język Aplikacji',
    languageSelectDesc: 'Select preferred interface language (Polish or English).',
    langPolish: 'Polski (PL)',
    langEnglish: 'English (EN)',
    wcagSectionTitle: 'Digital Accessibility & Interface (WCAG 2.2 AA)',
    wcagSectionDesc: 'Customize contrast, font scaling, and voice assistant for your perception needs.',
    highContrastLabel: 'High Contrast Mode',
    highContrastDesc: 'Increases contrast of borders and controls to ratio >7:1 (yellow-black accents).',
    textSizeLabel: 'Font Size Scaling',
    textSizeDesc: 'Improves reading comfort without compromising layout or responsiveness.',
    textSizeStandard: 'Standard (100%)',
    textSizeLarge: 'Enlarged (115%)',
    textSizeXLarge: 'Large (130%)',
    dyslexicFontLabel: 'Dyslexia-Friendly Font (OpenDyslexic)',
    dyslexicFontDesc: 'Weighted lower character shapes assist fluent reading comprehension.',
    reducedMotionLabel: 'Reduced Motion (Transitions & Effects)',
    reducedMotionDesc: 'Disables movement effects and dynamic animations, preventing vestibular discomfort.',
    soundAssistantLabel: 'Voice Assistant & Speech Synthesizer',
    soundAssistantDesc: 'Reads out key barrier parameters aloud when a venue is selected.',
    testSpeechBtn: 'Test speech',
    speechToastPlaying: 'Playing test voice prompt.',
    speechToastUnsupported: 'Your browser does not support built-in speech synthesis.',
    settingsSavedToast: 'All preferences and options have been saved to local storage (localStorage).',
    resetDefaultsBtn: 'Restore default profile settings',
    clearStorageBtn: 'Clear local storage data (Reset)'
  }
};
