# Scenariusz Wideo Demonstracyjnego (Maksymalnie 3 Minuty)
*Projekt: Kraków Bez Barier (AccessKraków)*

---

### [0:00 - 0:30] Wprowadzenie i Zdefiniowanie Problemu
- **Wizualia**: Widok na ekran główny aplikacji AccessKraków. W tle historyczna mapa Krakowa (Rynek Główny / Sukiennice / Dworzec Główny) oraz jasny panel kluczowych wskaźników weryfikacji.
- **Lektor**:
  > „Witajcie. Każdego dnia tysiące osób odwiedzają Kraków – osoby na wózkach inwalidzkich, rodzice z wózkami dziecięcymi czy turyści ciągnący ciężkie walizki po bruku. Dla nich proste oznaczenie 'miejsce dostępne' to za mało. Nie wiemy, czy w środku jest próg 5 cm, czy winda pomieści szeroki wózek elektryczny, a nawierzchnia to zabytkowe kocie łby.
  > Oto 'Kraków Bez Barier'. W pilotażowej wersji skupiliśmy się na historycznym Starym Mieście – terenie o największym nasyceniu zabytkowych barier. Nasze narzędzie daje konkretne parametry architektoniczne, pełną dwujęzyczność (PL/EN) i transparentność źródeł.”

---

### [0:30 - 1:15] Scenariusz 1: Osoba na Wózku Inwalidzkim (Precyzyjny Audyt)
- **Działanie w aplikacji**:
  1. Kliknięcie profilu: **„Osoba na wózku”** (min. szerokość drzwi: 85 cm, max próg: 2 cm, bez schodów, wymagana toaleta z uchwytami).
  2. Sprawdzenie obiektu: **Kraków Główny (Dworzec)** – aplikacja pokazuje zielony badge dopasowania 98% (drzwi 140 cm, 0 stopni, windy na perony z Braillem i komunikatami głosowymi).
  3. Sprawdzenie obiektu trudnego: **Kawiarnia na Kazimierzu** – system natychmiast ostrzega: *Schody 1 stopień (15 cm) bez podjazdu, wąskie drzwi 78 cm, toaleta niedostosowana*.
- **Lektor**:
  > „Użytkownik nie podaje informacji o chorobie – zachowujemy 100% prywatności. Wybiera po prostu profil wózkowy. Sprawdzamy Dworzec Główny: pełen sukces, windy, toaleta z uchwytami, certyfikowany audyt PKP i UMK z kwietnia 2026. Z kolei kawiarnia na Kazimierzu od razu sygnalizuje czerwoną barierę: stopień 15 cm i wąskie drzwi, uniemożliwiające samodzielny wjazd.”

---

### [1:15 - 1:55] Scenariusz 2: Turysta z Walizką i Planer Tras
- **Działanie w aplikacji**:
  1. Przełączenie profilu na: **„Turysta z walizką”** (filtr automatycznie włącza unikanie nawierzchni z kocich łbów).
  2. Przejście do zakładki: **„Dostępne Trasy Piesze”**.
  3. Wybór trasy: **Kraków Główny PKP → Sukiennice (Rynek Główny)**.
  4. Prezentacja paska struktury nawierzchni: 60% płyt chodnikowych, 30% asfaltu (Planty), 10% bruku.
  5. Pokazanie etapów trasy krok po kroku: wyjazd windą, obniżone krawężniki przy Teatrze Słowackiego, ławki do odpoczynku.
- **Lektor**:
  > „Zmieńmy profil na turystę z ciężką walizką. Wchodzimy w Planer Tras: system analizuje trasę z Dworca na Rynek. Wykrywa, że alejki na Plantach mają gładki asfalt i krawężniki 1 cm, a na Rynku rekomenduje pas gładkich płyt zamiast nierównego bruku. Mamy też podgląd nawigacji krok po kroku.”

---

### [1:55 - 2:25] Scenariusz 3: Reakcja na Brak Danych i Społeczność (Wymóg Konkursu!)
- **Działanie w aplikacji**:
  1. Wyszukanie obiektu z luką w danych: obiekt wyświetla się z pulsującym statusem: **„Luki w danych architektonicznych”**.
  2. Otwarcie panelu **„Moje zgłoszenia”** z historią weryfikacji i punktami reputacji (+10 pkt).
  3. Kliknięcie: **„Zgłoś nową barierę / Dodaj korektę”**.
  4. Wypełnienie formularza: wpisanie rzeczywistych parametrów i wysłanie zgłoszenia.
  5. Pokazanie profilu biznesowego: **„+ Dodaj lokal”** dla właścicieli kawiarni i hoteli.
- **Lektor**:
  > „Co w sytuacji, gdy danych brakuje? Nasza zasada: brak informacji NIGDY nie jest potwierdzeniem dostępności! Obiekt bez audytu otrzymuje wyraźne ostrzeżenie. Po zalogowaniu w panelu 'Moje zgłoszenia' mieszkańcy śledzą status swoich uwag i zdobywają punkty reputacji, a przedsiębiorcy mogą samodzielnie dodać audytowany lokal.”

---

### [2:25 - 3:00] Dostępność WCAG, Język Angielski i Podsumowanie
- **Działanie w aplikacji**:
  1. Otwarcie **Centrum Ustawień (⚙️)**:
     - Przełączenie języka na angielski (`English EN`) – cały interfejs i komunikaty stają się anglojęzyczne.
     - Test syntezatora mowy (Web Speech API) czytającego parametry po angielsku.
     - Włączenie trybu wysokiego kontrastu (>7:1) i powiększenia tekstu.
  2. Pokaz nawigacji z klawiatury oraz przełącznika widoku na „Tylko Lista” (dla czytników ekranu).
- **Lektor**:
  > „Aplikacja została zaprojektowana zgodnie z WCAG 2.2 AA – posiada dedykowane centrum ustawień, tryb wysokiego kontrastu, płynne skalowanie czcionki oraz pełną dwujęzyczność z lektorem mowy.
  > Nasz pilotaż na Starym Mieście dowodzi skuteczności algorytmu. Przy skalowaniu projektu bez problemu powiększymy obszar o Kazimierz, Nową Hutę, całą Metropolię Krakowską oraz kolejne miasta w Polsce i Europie.
  > Działa w chmurze Google Cloud Run w technologii serverless, co minimalizuje koszty.
  > Dziękujemy – twórzmy razem Kraków bez barier!”
