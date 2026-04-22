# Manual test cases — Phase A mock data & behaviors

**Scope:** Content added in `data.js` (community sources, line cascade, voice log, Zünd restart/tuning, spare parts, multilingual note, predictive alert, `botResponses`).

**Prerequisites**

- Open the app via a local static server (recommended), not `file://`, so Babel and scripts load correctly.
  - Example: `npx --yes serve .` in the project folder, then open the served URL and navigate to `index.html` if needed.
- Use **`index.html`** (loads `data.js` from disk). The bundled **`KobiAI.html`** may not include the same `data.js` content until synced.

**Legend**

- **ID** — internal reference.
- **Steps** — what to do in the UI.
- **Pass if** — observable outcome.

---

## TC-GEN-01 — Line cascade (`#general`)

| Field | Value |
|-------|--------|
| **ID** | TC-GEN-01 |
| **Steps** | 1. Open **#general** (Channels → General). 2. Scroll through messages. |
| **Pass if** | A message from **Pavol** states that **Zünd (Hall C)** is behind because **CNC** in `#machine-siemens` was in **planned PM**, and **KUKA** in `#machine-kuka` is clear; MES / line balance is mentioned. |

---

## TC-GEN-02 — Community / non-OEM knowledge

| Field | Value |
|-------|--------|
| **ID** | TC-GEN-02 |
| **Steps** | 1. In **#general**, find **Jozef**’s message about a **customer photo** / **odd drive alarm** not in the OEM list. 2. Read the following **Kobi** reply. 3. Expand **Sources** on that bot message (if not expanded by default). |
| **Pass if** | Kobi says to check **OEM first**, then lists **non-official** / **community**-style sources (e.g. fictional PracticalMachinist / hobby-CNC), with a disclaimer to verify. At least one source title reads as **non-OEM**; one references **OEM baseline** (e.g. SINAMICS fault manual). |

---

## TC-GEN-03 — Multilingual note (CEE / SK)

| Field | Value |
|-------|--------|
| **ID** | TC-GEN-03 |
| **Steps** | 1. In **#general**, find **Martin**’s message about **Slovak** questions vs **DE/EN** manuals. |
| **Pass if** | Text explicitly links **Slovak** answers to **DE/EN** OEM documentation (workforce / night-shift context). |

---

## TC-SIE-01 — Intermittent F-304 + community + spares

| Field | Value |
|-------|--------|
| **ID** | TC-SIE-01 |
| **Steps** | 1. Open **#machine-siemens** (machine channel). 2. Find **Jozef**’s message about **F-304 only after warm start** / intermittent. 3. Read **Kobi**’s answer. 4. Check **Sources**. |
| **Pass if** | Response includes a **table** (checks: cable, bearing, fan). **Community**-style source is present. **Spare** line includes **shelf D2-04**, **QOH 1** for motor, and **B3-12 / QOH 4** for belt. |

---

## TC-SIE-02 — Belt restart + inventory note

| Field | Value |
|-------|--------|
| **ID** | TC-SIE-02 |
| **Steps** | 1. In **#machine-siemens**, find the **belt break recovery** / restart sequence from **Kobi**. 2. Open **Sources** on that message. |
| **Pass if** | **Spare Parts Inventory** (or similar) reference includes **B3-12** and **QOH 4** (or equivalent snapshot text). |

---

## TC-ZND-01 — Web/film restart + line cross-reference

| Field | Value |
|-------|--------|
| **ID** | TC-ZND-01 |
| **Steps** | 1. Open **#machine-zund**. 2. Find **Pavol**’s message about **web / roll** and **restart sequence**. 3. Read **Kobi**’s answer. |
| **Pass if** | Steps reference **operator manual** / procedural restart. **#machine-siemens** and **belt** / ordered reset are mentioned for **line coordination**. A **consumable** line includes **shelf C2-01** and **QOH 6** (ZND-4412 or equivalent). |

---

## TC-ZND-02 — Vacuum / process tuning (parameter table)

| Field | Value |
|-------|--------|
| **ID** | TC-ZND-02 |
| **Steps** | 1. In **#machine-zund**, find **Pavol**’s message about **edge lift** / **foam** and **vacuum setpoints**. 2. Read **Kobi**’s table and notes. |
| **Pass if** | A **markdown table** compares zones and suggested kPa. Instructions mention **Cut Center** (or equivalent UI path) and **logging** for audit. **Seal strips / QOH 0** or procurement flag appears. |

---

## TC-DOC-01 — Voice service log (structured)

| Field | Value |
|-------|--------|
| **ID** | TC-DOC-01 |
| **Steps** | 1. Open **#docs-drop**. 2. Scroll past PDF ingestion cards to a **Kobi** message titled like **Voice service log (demo)**. |
| **Pass if** | Bulleted or structured fields include **machine**, **component**, **work performed**, **operator**, and link to **INC-2026-0487** (or same incident id in copy). Text states **transcribed** / **audio** / **hands-free** (prototype). **Sources** include policy / CMMS-style note. |

---

## TC-INC-01 — Spare part on open incident

| Field | Value |
|-------|--------|
| **ID** | TC-INC-01 |
| **Steps** | 1. Open **#incidents**. 2. Locate incident **Conveyor L4** / **sensor calibration drift** (INC-2026-0485). |
| **Pass if** | **Notes** mention **SICK** part, **shelf E1-08**, **QOH 2**. **Parts** line on the card shows the same part + location / QOH. |

---

## TC-DASH-01 — New predictive alert

| Field | Value |
|-------|--------|
| **ID** | TC-DASH-01 |
| **Steps** | 1. As **Manager**, open **Dashboard** (or view dashboard alerts if shown elsewhere). 2. Find **predictive** / alert strip. |
| **Pass if** | An alert exists about **intermittent F-304** / **warm start** and references **#machine-siemens** (or same wording as in `predictiveAlerts` **a4**). Note: if alerts are **dismissible** in session, use a fresh load or undismiss. |

---

## TC-CHAT-01 — Live bot reply (Zünd tuning triggers)

| Field | Value |
|-------|--------|
| **ID** | TC-CHAT-01 |
| **Steps** | 1. Go to **#machine-zund**. 2. In the composer, send: `@kobi summarize vacuum tuning for edge lift` (or include words: **tuning**, **setpoint**, **zone**, **foam**). 3. Wait for **Kobi** reply. |
| **Pass if** | Reply matches **`botResponses.zund`** tuning entry: mentions **zünd** / zones / **seal** / service log, and does not crash. (Exact text may match the template in `data.js`.) |

---

## TC-CHAT-02 — Live bot reply (Siemens F-304 + spares)

| Field | Value |
|-------|--------|
| **ID** | TC-CHAT-02 |
| **Steps** | 1. Open **#machine-siemens**. 2. Send: `@kobi F-304 overcurrent follow up`. |
| **Pass if** | Response includes **motor degradation** / follow-up style content, **D2-04** / **QOH**, and **Sources** (including **ERP** / inventory note if present in `botResponses`). |

---

## Regression — App still loads

| Field | Value |
|-------|--------|
| **ID** | TC-REG-01 |
| **Steps** | 1. Load app. 2. Switch **language** (e.g. EN → SK). 3. Open **#general** and one **machine** channel. |
| **Pass if** | No console errors; messages render; channel switch works. |

---

## Optional — Plant switcher (if testing full prototype)

| Field | Value |
|-------|--------|
| **ID** | TC-WS-01 |
| **Steps** | 1. Click **KobiAI · {plant}** in the top bar. 2. Choose **Košice** or **Trnava**. 3. Check **sidebar** → **Machines** order and subtitles. |
| **Pass if** | Site name updates; **Machines** list order/labels change per `workspaces` in `data.js`; user lands on **dashboard** (or expected reset). |

---

## Traceability (Phase A use-case rows)

| Shortlist theme | Test IDs |
|-----------------|----------|
| Community / non-OEM | TC-GEN-02, TC-SIE-01 |
| Line / multi-machine | TC-GEN-01, TC-ZND-01 |
| Voice / structured log | TC-DOC-01 |
| Intermittent fault | TC-SIE-01, TC-DASH-01 |
| Process / parameter tuning | TC-ZND-02, TC-CHAT-01 |
| Spare parts | TC-SIE-01, TC-SIE-02, TC-INC-01, TC-CHAT-02 |
| Multilingual | TC-GEN-03 |

---

*End of document.*
