# Model Biznesowy, Skalowalność i Architektura Utrzymania
*Dokumentacja strategiczna dla projektu „Kraków Bez Barier” (AccessKraków)*

---

## 1. Źródła Danych i Zarządzanie Wiarygodnością

### 1.1. Wykorzystywane Źródła Danych
1. **OpenStreetMap (OSM) via Overpass API**:
   - Wykorzystujemy tagi: `wheelchair`, `step_count`, `kerb`, `surface`, `toilets:wheelchair`, `tactile_paving`, `door:width`.
   - **Warunki licencji**: Open Database License (ODbL) – wymóg wskazania autorstwa OpenStreetMap (&copy; OpenStreetMap contributors).
2. **Portal Otwarte Dane Miasta Krakowa (`otwartedane.um.krakow.pl`)**:
   - Rejestry obiektów użyteczności publicznej, instytucji kultury i placówek miejskich.
   - **Warunki licencji**: Public domain / ponowne wykorzystanie informacji sektora publicznego bez opłat.
3. **Miejski System Informacji Przestrzennej (MSIP - `msip.krakow.pl`)**:
   - Warstwy WFS/WMS z danymi o sieci dróg i chodników, parkach i toaletach publicznych.
4. **Zgłoszenia Mieszkańców i Społeczności (Crowdsourcing)**:
   - Panel „Moje zgłoszenia” z grywalizacją (+10 pkt reputacji) do zgłaszania usterek (np. awaria windy, remont chodnika).
5. **Autoryzacja Właścicieli Obiektów (Self-Declaration B2B)**:
   - Wdrożony w prototypie moduł „+ Dodaj lokal” umożliwiający bezpośrednie wprowadzanie wymiarów wejść, toalet i ramp przez zarządców.

### 1.2. Algorytm Oceny Wiarygodności i Aktualności
Dane są klasyfikowane na 4 poziomach:
- **`VERIFIED_OFFICIAL` (Wiarygodność 90-100%)**: Pomiary z oficjalnych deklaracji dostępności oraz bezpośrednie audyty zarządców obiektów. Ważność: 12 miesięcy od audytu.
- **`VERIFIED_COMMUNITY` (Wiarygodność 70-89%)**: Potwierdzenie parametrów przez min. 3 niezależnych użytkowników lub certyfikowaną organizację pozarządową.
- **`OPEN_DATA_IMPORT` (Wiarygodność 50-69%)**: Surowe dane zaimportowane z OSM lub rejestrów publicznych.
- **`UNVERIFIED_REPORT` (Wiarygodność <50%)**: Pojedyncze, świeże zgłoszenie użytkownika (oznaczone żółtym trójkątem ostrzegawczym do czasu moderacji).

### 1.3. Postępowanie w Przypadku Braku Danych lub Awarii Źródła
- **Zasada „Brak informacji != Dostępne”**: Brak pomiaru progów lub windy **nigdy** nie skutkuje zielonym oznaczeniem dostępności. System wyświetla status `insufficient_data` z listą brakujących parametrów.
- **Cache i Odporność (Circuit Breaker)**: W przypadku awarii zewnętrznego API (np. Overpass API), system serwuje dane z lokalnej bazy PostgreSQL/PostGIS z informacją: *„Dane z pamięci podręcznej z dnia [data]”*.

---

## 2. Model Biznesowy i Komercjalizacja (Wycena 20%)

Celem projektu jest stworzenie samofinansującej się usługi o wysokim potencjale rynkowym.

### 2.1. Segment B2B: Certyfikacja i Widget „AccessBadge” (Model SaaS)
- **Klient**: Hotele, restauracje, muzea prywatne, centra kongresowe i konferencyjne (np. ICE Kraków, EXPO Kraków).
- **Zaimplementowany fundament w aplikacji**:
  - Dedykowany **Profil Biznesowy** oraz modal **`+ Dodaj lokal`**, w którym przedsiębiorcy mogą samodzielnie zgłaszać obiekt, wprowadzając precyzyjne parametry techniczne (szerokość drzwi, stopnie, obecność toalety dostosowanej, windę).
- **Produkt docelowy**:
  - Dedykowany, responsywny widżet JavaScript do wklejenia na stronę internetową obiektu.
  - Certyfikowany audyt mikropomiarowy (weryfikacja deklaracji przez certyfikatora).
  - Widżet prezentuje gościom przed dokonaniem rezerwacji precyzyjne parametry pokoju i budynku.
- **Cena**: Model subskrypcyjny:
  - Plan Standard (Kawiarnie / Restauracje): 49 zł / miesiąc.
  - Plan Pro (Hotele / Centra konferencyjne): 199 - 499 zł / miesiąc (w cenie coroczny re-audyt fizyczny).

### 2.2. Segment B2B API: Integracje z Platformami Rezerwacyjnymi i Mapami
- **Klient**: Platformy takie jak Booking.com, Airbnb, e-podróżnik, aplikacje konferencyjne.
- **Produkt**: REST API dostarczające ustrukturyzowane dane JSON o dostępności obiektów i tras dojścia w standardzie dwujęzycznym (PL/EN).
- **Model**: Płatność za pakiet zapytań (pay-per-request / tiered pricing).

### 2.3. Segment B2G (Partnerstwo Publiczno-Prywatne)
- Dedykowany moduł raportowy dla Urzędu Miasta i Zarządu Dróg: generowanie mapy „białych plam” i wąskich gardeł infrastrukturalnych w Krakowie na podstawie zagregowanych zgłoszeń barier przez mieszkańców.

---

## 3. Plan Przejścia od Prototypu do Stałej Usługi

### 3.1. Podmiot Odpowiedzialny
- Utworzenie spółki technologicznej z misją społeczną (Social Enterprise / Spółka z o.o.) we współpracy z krakowskimi organizacjami pozarządowymi działającymi na rzecz osób z niepełnosprawnościami.
- Spółka odpowiada za:
  - Utrzymanie serwerów w chmurze i SLA,
  - Bezpieczeństwo i zgodność z RODO,
  - Obsługę zgłoszeń użytkowników i moderację bazy,
  - Rozwój komercyjny i sprzedaż widżetów B2B.

### 3.2. Koszty Infrastruktury i Utrzymania (Google Cloud)
Dzięki architekturze serverless opartej na **Google Cloud Run**, koszty rosną proporcjonalnie do ruchu:
- **Cloud Run (Frontend + Backend)**: Skalowanie do zera przy braku ruchu. Pierwsze 2 mln zapytań w darmowym pakiecie GCP Free Tier.
- **Cloud SQL PostgreSQL (db-f1-micro / mała instancja)**: ok. 40 - 60 zł / mies.
- **Cloud Storage / CDN**: ok. 10 - 20 zł / mies.
- **Łączny koszt stały etapu MVP**: **poniżej 80 - 100 zł miesięcznie**.

---

## 4. Ochrona Danych i Bezpieczeństwo (RODO & Privacy by Design)

1. **Brak przetwarzania danych o stanie zdrowia (art. 9 RODO)**:
   - Aplikacja **nie rejestruje** diagnoz medycznych, rodzaju niepełnosprawności ani orzeczeń.
   - Użytkownik operuje wyłącznie na parametrach technicznych otoczenia (szerokość przejścia, maksymalna wysokość krawężnika, unikanie kocich łbów).
2. **Anonimowość wyszukiwania i bezpieczeństwo kont**:
   - Podstawowe przeglądanie miejsc i planowanie tras nie wymaga rejestracji.
   - Konta użytkowników operują na tokenach JWT z hashowaniem haseł (bcrypt).
   - Preferencje ruchowe i ustawienia WCAG są przechowywane lokalnie w pamięci przeglądarki (`localStorage`).
3. **Bezpieczeństwo połączeń**:
   - Całość komunikacji zabezpieczona szyfrowaniem TLS 1.3 (HTTPS).
   - Ochrona formularza zgłoszeń przed spamem za pomocą mechanizmów rate-limitingu FastAPI.

---

## 5. Skalowalność na Inne Miasta (Kraj i Zagranica)

Architektura rozwiązania została zaprojektowana w sposób modularny i w 100% agnostyczny geograficznie:
1. **Uniwersalny model danych**: Model danych oparty o standard OpenStreetMap i GeoJSON funkcjonuje identycznie w każdym punkcie globu.
2. **Natywna dwujęzyczność (i18n)**: Kompletne wsparcie języka polskiego i angielskiego sprawia, że platforma jest natychmiast gotowa do ekspansji zagranicznej (np. Praga, Wiedeń, Berlin).
3. **Procedura dodania nowego miasta (np. Wrocław, Gdańsk, Warszawa)**:
   - **Krok 1**: Zdefiniowanie współrzędnych obszaru (`Bounding Box`) nowego miasta.
   - **Krok 2**: Uruchomienie skryptu ingestii z OSM Overpass API dla zadanego obszaru.
   - **Krok 3**: Podpięcie konektora lokalnego portalu otwartych danych miejskich.
   - Czas uruchomienia platformy dla kolejnego dużego miasta: **2-3 dni robocze**.
