# KobiAI — Executive demo scenár (SK)

| | |
|---|---|
| **Účel** | Ukázať rozhodovateľom a obchodným partnerom tri veci: *kontext pri stroji*, *odpovede z vlastnej dokumentácie*, *riaditeľný pohľad na údržbu*. |
| **Čas** | **8–10 min** (jadro) · +5 min rozšírenie |
| **Formát** | Jedna obrazovka, ideálne desktop · pred štartom **reload** stránky |

---

# I. PRÍPRAVA (1 min)

## Čo musí byť nastavené

1. Čistý štart: obnoviť stránku.
2. Ukázať žltú značku **DEMO** — *fiktívne dáta, riadený prototyp*.
3. Voliteľne prepnúť jazyk **SK** v hornom paneli.

## Jedna veta o produkte (elevator pitch)

> **KobiAI spája tímový chat, stroje a dokumentáciu: technik má pri každom stroji prehľad a môže sa pýtať na manuály v kontexte; vedenie vidí trendy a incidenty; dáta ostávajú u zákazníka (on-prem).**

---

# II. TRI PILIERE (povedať pred klikaním)

Pred vstupom do UI stručne pomenovať tri piliere — potom ich v demo **dôkázať** v poradí nižšie.

| Pilier | Čo tým riešime |
|--------|----------------|
| **1. Stroj ako „domov“** | Menej chaosu v chate; všetko dôležité pri linke. |
| **2. Znalosť z dokumentov** | Rýchle odpovede z manuálov a histórie, nie všeobecný internet. |
| **3. Riaditeľnosť** | Štruktúrované incidenty a dashboard pre manažment. |

---

# III. DEMO — PREVÁDZKA A HALA (Technician)

**Nastavenie:** Horný panel → rola **Technician (JN)** → v ľavom menu vybrať **kanál stroja** (napr. KUKA alebo Siemens).

## Krok 1 — Domovská stránka stroja (prehľad bez šumu)

**Akcia:** Nechať zobrazenú úvodnú obrazovku stroja (tri karty).

**Posolstvo:**  
*„Technik nezačína v dlhom chate. Začína kontextom stroja: čo je linka, čo je evidované, čo môže urobiť ďalej.“*

---

## Krok 2 — Stroj v číslach a signáloch

**Akcia:** **Machine Status** → pravý panel → krátka ukážka → zatvoriť panel.

**Posolstvo:**  
*„Operatívny stav — KPI, trend, signály, súvisiace incidenty — všetko viazané na tento stroj, nie na celý závod naraz.“*

---

## Krok 3 — Incident ako proces, nie len správa

**Akcia:** **Report Incident** → pravý panel → prejsť záložky (Incident Details → Resolution Tasks → Parts) → zatvoriť alebo uložiť koncept.

**Posolstvo:**  
*„Zápis udalosti je štruktúrovaný — vhodné pre schvaľovanie, audit a napojenie na CMMS. Deje sa v tom istom prostredí ako komunikácia.“*

---

## Krok 4 — Odpoveď z „ich“ dokumentácie

**Akcia:** **Get Help** alebo **View channel messages** → do poľa napísať **`@kobi`** + krátka otázka (napr. chyba F-304 na Siemens, oblúk na KUKA, podtlak Zünd).

**Posolstvo:**  
*„Otázka je v kontexte kanála stroja. Odpoveď má ukázať **Sources** — odkaz na dokumenty a históriu, nie anonymný model bez podkladov.“*

---

## Krok 5 — Známy spôsob práce

**Akcia:** V poli správ napísať **`/`** (slash príkazy).

**Posolstvo:**  
*„Nízka náuka: rovnaká logika ako v nástrojoch typu Slack / Mattermost.“*

**Zhrnutie pre halu (jedna veta):**  
*„Prehľad → stav → incident → odpoveď z manuálu — bez preskakovania medzi piatimi systémami.“*

---

# IV. DEMO — VEDENIE A RIADENIE (Manager)

**Nastavenie:** Horný panel → rola **Manager (MH)** — otvorí sa **Manager Dashboard**.

## Krok 1 — Pohľad cez čísla

**Akcia:** Prejsť dashboard (KPI, grafy, tabuľka incidentov, upozornenia).

**Posolstvo:**  
*„Vedenie nečíta vlákno po vlákne. Má agregovaný obraz: čo horí, čo sa zlepšuje, ako sa používa znalostná vrstva.“*

---

## Krok 2 — Incidenty a dôkazná stopa

**Akcia:** Otvoriť **Incidents** / súvisiaci tok (podľa toho, čo v demo vedie z dashboardu).

**Posolstvo:**  
*„Incidenty sú evidované — nie stratené v neštruktúrovanej konverzácii.“*

---

## Krok 3 — Viacer závody, jedna logika

**Akcia:** V hornom paneli prepnúť závod (**Bratislava / Košice / Trnava**), ak je k dispozícii.

**Posolstvo:**  
*„Rovnaký model pre viac lokalít — škálovateľná prezentácia pre skupiny.“*

---

## Krok 4 — Dokumenty ako palivo pre AI

**Akcia:** Otvoriť **Docs drop**.

**Posolstvo:**  
*„Nahrávanie a indexácia dokumentov priamo v ekosystéme; v produkcii stále v režime on-prem u zákazníka.“*

**Zhrnutie pre vedenie (jedna veta):**  
*„Prevádzka dostane rýchle odpovede; vy dostanete metriky, kontrolu a dohľadateľnosť.“*

---

# V. ROZŠÍRENIE (voliteľné, do 5 min)

## Integrácie (pravý okraj)

Ukázať pás ikon (Teams, CMMS, ERP, MES).  
**Posolstvo:** *„V produkcii odkaz na existujúce systémy v jednom rámci — menej prepínania okien.“*

## Zariadenia

Prepínač **Desktop / Tablet / Mobile** v hornom paneli.  
**Posolstvo:** *„Rovnaké procesy na PC v kancelárii aj na tablete pri stroji.“*

---

# VI. NÁMITKY — KRÁTKA ODPOVEĎ

- **„Je to ChatGPT?“** → Nie. Je to **váš** kontext: stroj, kanál, dokumenty, história.
- **„Kde sú dáta?“** → Pozícia **on-prem**; demo dáta sú značené ako fiktívne.
- **„Máme CMMS.“** → Kobi dopĺňa **zbieranie pri stroji** a **prirodzený jazyk**; štruktúra sa dá prepojiť s existujúcim systémom.

---

# VII. KONTROLNÝ LIST (pred stretnutím)

- [ ] Reload, DEMO badge, voliteľne SK
- [ ] Povedať **tri piliere** (sekcia II)
- [ ] Technik: domov stroja → **Machine Status** → **Report Incident** → **Get Help** + `@kobi` → **`/`**
- [ ] Manažér: **Dashboard** → incidenty → závod → **Docs drop**
- [ ] Zakončiť: **on-prem** + **odpovede z dokumentov**

---

# PRÍLOHA A — Otázky pre `@kobi` (kopírovať)

Po otvorení chatu na danom kanáli stroja:

- **Siemens:** `@kobi Menič hlási F-304 — čo mám skontrolovať ako prvé?`
- **KUKA:** `@kobi Po výmene hrotu máme výkyv zváracieho oblúka — čo je najpravdepodobnejšia príčina?`
- **Zünd:** `@kobi V zóne 3 klesá podtlak — ako to mám diagnostikovať?`
- **General:** `@kobi Na čo si dať pozor naprieč strojmi tento týždeň?`

---

*Čas prispôsobte slotu: skráťte sekciu III alebo IV; pri dlhšom stretnutí zopakujte sekciu III na druhom stroji.*
