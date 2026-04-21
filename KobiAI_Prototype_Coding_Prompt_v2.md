# KobiAI (v2, Mattermost-shelled vibe-mock)



---

## 0. How to use this document

Paste this entire document as the initial prompt to your AI coding agent. It is self-contained. Do **not** trim it — the mock data, interaction details, and screens are all load-bearing for a good demo.

If your coding agent supports iterative prompting, feed it in three passes:
1. **Pass 1 — scaffold**: sections 1–6 (project, stack, branding, shell layout).
2. **Pass 2 — core flows**: sections 7–11 (channels, chat, slash commands, dashboard).
3. **Pass 3 — polish**: sections 12–14 (animations, mock-data file structure, acceptance).

---

## 1. Project summary (read first)

Build **KobiAI** — a pixel-polished, fully mocked **sales demo** web app for an AI assistant for industrial maintenance technicians. It looks and feels like a custom-branded, on-premise **Mattermost** install (because the real product will be built on Mattermost). **Zero real backend. Everything is mocked.**

A sales rep will open this on a laptop (and optionally show it on an iPad in mobile mode) during a factory visit. In ~12 minutes the rep demonstrates: AI Q&A grounded on machine docs → capturing knowledge → the system learning live → structured incident logging → a manager dashboard → the on-prem security story.

**This is a vibe-coded prototype.** It is NOT the real product. The real product is a Mattermost server + RAG backend (see companion doc). Do not implement real authentication, real LLM calls, real file parsing, real databases. Every interaction is scripted with pre-written responses.

**Success =** a sales rep can run the full demo flow end-to-end with zero friction, the UI is indistinguishable from a real Mattermost app, and the customer says "when can I get this."

---

## 2. Audience & use context

- **Who shows it**: sales rep (Martin + others), non-technical.
- **Where**: on a factory visit, often in a meeting room after a plant tour. Sometimes on the factory floor.
- **On what**: a laptop running Chrome/Edge, screen-mirrored to a TV. Optionally a tablet in hand (browser in mobile/tablet width).
- **To whom**: plant manager + maintenance manager + sometimes IT + sometimes plant owner. CEE audiences (Slovak, Czech, German).
- **Flow**: ~12-min guided walkthrough, then Q&A. No customer interaction with the app itself.

Implication: the app must be **rock-solid scripted**, visually impressive, and never show loading states or errors unless it's a deliberate "indexing" animation.

---

## 3. Tech stack (mandatory)

- **Framework**: Next.js 14+ (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **State**: React useState + useContext (`KobiContext` provider at root for role, language, device, "demo state")
- **Persistence**: in-memory only (no localStorage, no backend). Fresh reload = fresh demo. Optional: a "Reset demo" button in the top bar.
- **Mock data**: hardcoded TypeScript/JSON in `/src/data/`
- **Routing**: Next.js App Router; each channel is `/team/kobiai/channels/[channelSlug]`
- **Deployment**: static export (`next export`) or Vercel; runnable via `npm run dev`
- **Responsive**: optimized for desktop (1280–1920px) and tablet (768–1024px). Mobile (375–428px) reachable via an in-app **"Device preview" toggle** (Desktop / Tablet / Mobile) — NOT via actual user-agent — so the rep can switch views while demoing.
- **No real APIs**: all fetches are to local JSON via a tiny mock loader.

**Do not** use Zustand, Redux, tRPC, Prisma, any database, any auth library, any real AI SDK. Keep it simple.

---

## 4. Branding

- **App name**: KobiAI
- **Tagline**: "Your AI maintenance expert — on your factory floor, on your infrastructure."
- **Primary**: `#1E3A5F` (deep industrial blue)
- **Primary hover**: `#2A4D7A`
- **Accent / online / success**: `#4CAF50`
- **Warning**: `#FF9800`
- **Critical / error**: `#F44336`
- **Background (app)**: `#F5F6F8`
- **Sidebar background**: `#1B2733` (very dark slate — Mattermost-like)
- **Sidebar text**: `#C5CCD4`
- **Sidebar active item**: white text on `#2F3E50` bar with a left accent in `#4CAF50`
- **Card**: `#FFFFFF` with 1px border `#E4E7EB` and subtle shadow
- **Font**: `Inter`, system font fallback
- **Logo**: placeholder square 36×36px, rounded-lg, `#1E3A5F` background, white **K** letter, a subtle green dot (online indicator)
- **Tone**: industrial, clean, professional. Not startup-playful. Siemens-meets-Slack.

---

## 5. Shell layout (Mattermost clone, re-skinned)

The whole app is one Mattermost-style three-column shell that stays mounted. Only the centre and optional right panel change content.

```
┌──────────────────────────────────────────────────────────────────────┐
│ TOP BAR: KobiAI logo · team name "KobiAI · Bratislava Plant" · search │
│          · "Demo state" pill · Device toggle (D/T/M) · Lang · Role    │
│          · user avatar (Martin / Jozef)                               │
├──────┬──────────────────────────────────────┬────────────────────────┤
│ LEFT │  CENTRE (channel view)               │ RIGHT (optional panel) │
│ SIDE │  - Channel header                    │ - Thread view OR       │
│ BAR  │  - Messages (virtualized list)       │ - KobiAI plugin panel: │
│      │  - Composer (input + mic + attach    │   · Machine card       │
│ (ch- │    + slash-cmd helper)               │   · Logbook            │
│ annel│                                      │   · Dashboard          │
│ list)│                                      │   · Ingestion status   │
└──────┴──────────────────────────────────────┴────────────────────────┘
```

### 5.1 Top bar (60px)
- Left: KobiAI logo + **Team switcher** showing "KobiAI · Bratislava Plant ▾" (dropdown listing one fake second team "KobiAI · Magna Austria (demo)" — not clickable, for show).
- Centre: **Search bar** ("Jump to…") — opens a mocked search modal with canned results (posts, files, users). Esc closes.
- Right (in order):
  1. **"Demo"** pill (yellow dot + label) — clicking it shows a tooltip "This is a sales demo with mock data."
  2. **Device preview toggle**: 🖥️ Desktop / 📱 Tablet / 📱 Mobile — wraps the app content in a max-width container (1440 / 1024 / 420px) with a subtle device frame.
  3. **Language toggle**: 🇬🇧 EN ▾ — menu with SK / CZ / EN / DE / PL. Switching swaps UI labels (not the mock message content). Default EN.
  4. **Role toggle**: "View as: Technician / Manager" — switches sidebar channel list + default landing channel.
  5. **User avatar** (Martin for Manager; Jozef Novák for Technician). Initials badge.

### 5.2 Left sidebar (240px, collapsible to 64px icon-rail)
Dark background. Three sections, top to bottom:

**Unreads** (only shows channels with red/mention dot)
- #incidents (1 mention)

**Channels**
- 🏭 #general
- ⚙️ #machine-siemens-s7-1500 (pinned)
- 🤖 #machine-kuka-kr-60
- ✂️ #machine-zund-g3
- 🚨 #incidents
- 📥 #docs-drop
- 📊 #dashboard
- + Add channel (non-functional — shows a toast "Admin-only in this demo")

**Direct messages**
- 🟢 @kobi (online) ← the AI bot
- 🟢 @martin.horvath
- ⚪ @pavol.kovac
- ⚪ @tomas.gazda

**Sidebar footer**
- "🔒 On-prem · Bratislava Plant · No cloud" — tiny status indicator with a green shield icon. Click opens the on-prem info modal (see §7.6).

### 5.3 Centre panel (flex-1)
Standard Mattermost-style channel. Header + messages + composer.

**Channel header** (44px)
- Channel name + purpose + member count + pinned-item count.
- Right side: 📌 Pinned · 👥 Members · ⓘ Info · (plugin buttons per channel, see §7).

**Messages area**
- Scrollable, auto-scroll to bottom on new message.
- Day dividers ("Today", "Yesterday", "Mon 13 Apr").
- Grouped consecutive messages from same author (single avatar + timestamp collapse).
- User messages: left-aligned bubbles with avatar. No "chat-bubble" heavy styling — it's Slack/Mattermost minimalist style (indented text with hover actions).
- Bot messages from **@kobi**: distinct background tint (`#F0F5FA`), KobiAI badge next to name, sources card appended (see §7.2).
- Hover on any message: reaction / reply-in-thread / save / ⋮ more — Mattermost standard.

**Composer** (fixed bottom, 72–96px tall)
- Plus button (attach) · 🎤 mic · Text area · `B I U` formatting bar above · Send button.
- Placeholder: `Write to #<channel-name>` (or `Reply to thread` inside a thread).
- **Slash-command hint**: when the input starts with `/`, a popover appears above the composer listing matching commands from §7.3. Arrow keys + Enter to select.
- **Mic button**: when pressed, shows a "Listening…" pulsing red dot next to a live-looking waveform (5 bars oscillating). After ~2s, auto-fills input with a pre-selected question based on current channel (see §7.2). Press again to "stop".
- Disabled state for composer: bot messages in `#dashboard` channel (read-only, but composer still visible greyed out: "Dashboard is read-only — try #general").

### 5.4 Right panel (optional, 320–420px)
Opens when:
- A message reply action is clicked → Thread view.
- A plugin action is triggered (e.g., machine card, logbook view, dashboard panel).
- `@kobi` DM: always-open Manage Knowledge side panel.

Closable with X in its own header.

---

## 6. Role modes & default landings

**Technician mode (user Jozef Novák)**
- Default channel on login: `#machine-siemens-s7-1500`.
- Left sidebar hides `#dashboard` channel.
- Simplified top bar (no Device toggle switching away from mobile).
- Larger tap targets (48px min) in mobile device preview.

**Manager mode (user Martin Horváth — default on load)**
- Default channel: `#dashboard`.
- Full sidebar visible.
- Manager-only actions (approve incident) visible in the Logbook panel.

Role toggle swaps instantly, no reload, no data change — just view.

---

## 7. Channels & flows (the demo)

### 7.1 #general
Pinned first post (bot):
> **@kobi** — *pinned* 📌
> Welcome to **KobiAI · Bratislava Plant**. I am your AI maintenance assistant. Ask me anything about your machines, log incidents with `/incident`, drop documents in `#docs-drop`, and open a machine channel to get context-aware help. Everything stays inside this factory.

A few ambient messages from fake teammates to make it feel alive:
- `@tomas.gazda`: "Heads up — KR 60 had a welding arc misalignment yesterday, resolved. Thread in #incidents."
- `@martin.horvath`: "New Zünd docs uploaded this morning. KobiAI finished indexing in 18 seconds. 👀"
- `@pavol.kovac`: "Reminder — shift handover at 14:00."
- Thread on Martin's post with one reply from @kobi: "📄 Received 'Zünd_G3_Manual_EN.pdf' (412 pages). Parsed. 1,034 chunks indexed. 23 diagrams extracted. Available in `#machine-zund-g3`."

### 7.2 Machine channels — the CORE of the demo

Three channels, one per machine. All use the same template; the pre-loaded messages differ.

**Channel header shows**:
- Left: machine icon · name · status badge (`🟢 Online` / `🟡 Maintenance`).
- Right: **"Machine card"** button (opens right panel with machine details), **"Logbook"** button, **"Ask Kobi"** button (focuses the composer with `@kobi `).

**Right-panel Machine card** (when button clicked):
- Image placeholder (coloured rectangle with machine icon)
- Machine name
- Type / OEM
- Location (Hall A, Line 3)
- Commissioned (2019)
- Docs indexed: **847 files · 12,340 chunks**
- Last incident: 2 days ago
- Status: Online / green
- Buttons: "View all incidents" (→ `#incidents` filtered), "Upload docs" (→ `#docs-drop` prefilled)

**Pre-loaded conversation for `#machine-siemens-s7-1500` (Siemens S7-1500 CNC)**

Render as if these messages already exist. Time-stamped earlier today.

1. **Jozef Novák — 09:14**
   `@kobi The drive is throwing an F-304 error — what does it mean and how do I fix it?`

2. **@kobi — 09:14** (styled as bot reply)
   > **Error F-304 — Overcurrent in Motor Module**
   >
   > The motor module detected current exceeding the configured threshold. Common causes:
   >
   > 1. **Short circuit** in the motor cable or winding
   > 2. **Incorrect motor parameters** (p0304, p0305)
   > 3. **Mechanical overload** — spindle blocked or under excessive load
   >
   > **Immediate steps:**
   > 1. Press RESET on the CU320-2 control unit
   > 2. Check cable at terminals U, V, W
   > 3. Measure winding resistance (expected 2.1–2.5 Ω / phase)
   > 4. Verify p0304 = 12.5 A (nameplate)
   >
   > ⚠️ If resistance < 1.0 Ω, motor winding is damaged — do not restart.

   **Sources card** (appended to message, compact):
   > 📄 **Sources (2)** — click to expand
   > - Siemens SINAMICS S120 Fault Manual · p.247 (F-304) · indexed 12 Mar
   > - Machine Config Sheet — CNC Line 3 · updated 8 Jan

   **Diagram preview** (inline, clickable): grey rectangle 320×180, label "📊 Wiring Diagram — Fig. 8.14 (Motor Module Connection)".

3. **Jozef Novák — 09:16**
   `@kobi Which component is referenced in parameter p0304?`

4. **@kobi — 09:16**
   > **Parameter p0304 — Rated Motor Current**
   >
   > Defines rated current of the connected motor in amperes. For your unit (Siemens 1FK7083-5AF71):
   >
   > - Nameplate: **12.5 A**
   > - Configured: **12.5 A** ✅
   > - Location: Drive object DO3, Motor Module slot 4
   >
   > If this doesn't match the motor nameplate, F-304 may trip under normal load.
   >
   > 📄 Sources: SINAMICS S120 Parameter Manual p.89 · Motor Nameplate Photo (T. Kováč, 3 Feb 2026)

5. **Jozef Novák — 09:41** (later gap in timestamps for realism)
   `@kobi What's the restart sequence after a belt break on this machine?`

6. **@kobi — 09:41**
   > **Belt Break Recovery — Siemens S7-1500 CNC (Line 3)**
   >
   > 1. **Emergency stop** — confirm E-STOP engaged (red mushroom, panel left)
   > 2. **Open guard door** — wait for spindle to stop (≤30 s)
   > 3. **Inspect belt** — check timing belt condition, tension pulley, debris
   > 4. **Replace belt** — part **3M-225-6** (shelf B3-12)
   > 5. **Reset sequence**: release E-STOP · RESET on operator panel · run `G28 U0 W0` · confirm no alarms
   > 6. **Test cut** — run program `O0001` before production
   >
   > 💡 *Tip from technician J. Novák (12 Mar 2026): After belt replacement on this machine, always re-tension to **4.5 N** using the Gates gauge. Factory spec says 4.0 N but it slips under high feed.*
   >
   > 📄 Sources (3): Operator Manual §12.4 · **Maintenance Log #MK-2026-0312 — J. Novák** · Spare Parts Inventory

   **Critical demo cue**: this last reply mixes official docs with a **personal technician note**. Highlight the Note source with a small 🧠 icon. This sets up the "learn live" beat in 7.4.

**Pre-loaded conversation for `#machine-kuka-kr-60` (KUKA KR 60-3 welding robot)** — create 2–3 realistic exchanges in the same style: welding-arc misalignment symptom diagnosis, TCP calibration, safety fence override procedure. Sources reference "KUKA System Software Manual" and a tech note from "M. Horváth".

**Pre-loaded conversation for `#machine-zund-g3` (Zünd G3 cutting line)** — create 2–3 exchanges: knife pressure calibration, vacuum-table leak diagnostic, film-feed misregistration. Sources reference "Zünd G3 Operator Manual" and a tech note from "P. Kováč".

**Voice mic prefills** (per channel):
- Siemens: `@kobi The drive is throwing F-304 again — same as last week?`
- KUKA: `@kobi Welding arc keeps drifting on KR 60 — what's the most likely cause?`
- Zünd: `@kobi Vacuum table is losing pressure in zone 3 — how do I diagnose?`

### 7.3 Slash commands (demo-grade)

Implement a `/` popover that shows matching commands. These four are required:

**`/ask <question>` — or implicit: typing `@kobi <question>` does the same**
- Behavior: adds user message, 1.5 s "KobiAI is thinking…" indicator (three animated dots + typing spinner), then bot reply streamed character-by-character (~25 ms/char) from the pre-scripted response for that channel.
- **Key**: the same question asked twice returns two different responses, cycling through the pre-loaded list. Keeps the demo feeling live.

**`/add-note` — open Add Note dialog**
- Opens Mattermost-style interactive dialog (centered modal, ~520px wide).
- Fields:
  1. **Machine** — read-only badge showing current channel's machine.
  2. **Category** — select: Repair / Observation / Tip / Incident note. Default Repair.
  3. **What happened** — textarea (4 rows), placeholder "Describe what you saw or what you fixed…". Mic button (🎤) next to it.
  4. **Severity** — segmented control: Info / Warning / Critical. Default Info.
  5. **Photo** — "Attach photo" button (mock, shows a filename "IMG_20260420_104532.jpg" with a thumbnail placeholder after click).
  6. Cancel · **Save note** (primary).
- **Voice mock inside dialog**: press mic → 2s listening pulse → autofill: "Replaced timing belt 3M-225-6. Re-tensioned to 4.5 N — factory spec says 4 but it slips under high feed. Confirmed with test cut O0001."
- **On Save**:
  - Green toast bottom-right: "Note saved. AI knowledge updated."
  - Post in channel: a compact card from @kobi:
    > 🧠 **New knowledge added by @jozef.novak** — *just now*
    > _"Replaced timing belt 3M-225-6. Re-tensioned to 4.5 N — factory spec says 4 but slips under high feed. Confirmed with O0001."_
    > Category: Repair · Severity: Info · Indexed in 2.1s · Now searchable.
  - Internal flag: next `@kobi` question in this channel surfaces this note as source #1 (see 7.4).

**`/incident` — open Incident (Maintenance Logbook) dialog**
- Tabbed dialog, 720px wide, two tabs: **Basics** · **Details & Parts**.
- **Basics tab**:
  1. Machine (auto-filled, read-only)
  2. Location in machine (text, placeholder "e.g., Motor module slot 4")
  3. Fault description (textarea + 🎤 voice) — required
  4. Photos / video (multi-attach, mock)
  5. Severity: Info / Warning / Critical
- **Details & Parts tab**:
  6. Component identified (autocomplete: "Timing belt (3M-225-6)", "Servo drive", "Proximity sensor SICK IME30", …)
  7. Schematic reference (file picker showing fake file list: "Siemens_S7-1500_Electrical_Schema.pdf p.34", etc.)
  8. Resolution (Repaired / Replaced / Workaround / Other)
  9. Resolution notes (textarea + 🎤)
  10. Spare parts used (add rows: part + qty)
  11. Resolution type: **Permanent** / **Temporary** (segmented)
- Footer: Save as draft · **Submit for approval** (primary).
- **On submit**:
  - Toast: "Incident submitted. Awaiting manager approval."
  - Post in current channel: thread-opening card:
    > 🚨 **Incident #INC-2026-0487 opened by @jozef.novak**
    > Machine: Siemens S7-1500 CNC · Severity: Warning · Status: **Awaiting approval**
    > "Timing belt snapped mid-cut. Replaced with 3M-225-6, tension 4.5 N, confirmed with test cut."
    > *View in Logbook →*
  - Post in `#incidents` channel: same card.
  - Dashboard "Open incidents" counter in `#dashboard` ticks up by 1 with a brief flash.

**`/search <term>` — opens an overlay with canned results** (optional polish). 3 matching messages + 2 matching docs. Small but shows "the audit trail is searchable."

Also register these (decorative, show in the popover, but no handler — click = toast "Coming in production"):
- `/assign`
- `/playbook run maintenance`
- `/report weekly`

### 7.4 The "learn live" loop (the demo climax)

After user adds a note via `/add-note` in `#machine-siemens-s7-1500`, the very next time they (or the rep) asks the F-304 or belt-related question, the bot response includes the **new note as source #1** with a 🧠 icon and timestamp "just now by you".

Implementation: a simple `useState` flag `notesAddedThisSession` in `KobiContext` that the chat-response picker checks.

### 7.5 #docs-drop channel — feed the system

Drag-and-drop area at the top of the channel:

> **📥 Drop documents here to feed the AI**
> PDFs · Schematics · Manuals · Images · Videos
> *Files stay on-prem. Nothing leaves this factory.*

On file drop (any file, any type):
1. Show a compact ingestion card in the channel (bot post):
   > 📄 **Received** `<filename>` (`<size>` MB)
   > ⏳ Parsing…
2. After 1.5 s, update the card:
   > 📄 `<filename>` · ✅ **Indexed**
   > `<N>` pages · `<M>` chunks · `<X>` diagrams extracted
   > Tagged to: **#machine-zund-g3** (auto-detected from content)
   > Available to query: `@kobi` in that channel
3. Pre-seed 2–3 historical ingestion cards in the channel so it's not empty.

Numbers are computed mock — derive N/M/X from file size so it feels real (e.g., `pages = Math.max(1, Math.round(sizeMB * 25))`).

### 7.6 #incidents channel

Pre-loaded 8–10 incident cards (mix of statuses). Each card is a structured post:

> 🚨 **INC-2026-0482** · Zünd G3 Cutting · Belt tension warning · 🟢 Resolved
> Opened by @pavol.kovac · 3 days ago · Resolved by @pavol.kovac · 2 days ago
> "Detected minor drift on pressure — tensioned and cleaned rail. Permanent fix."
> *Thread (2) · Parts: — · ERP: pushed · MTTR: 2h 14m*

One card shows "🔴 Open · Awaiting approval" to enable the manager-approval demo beat.

### 7.7 #dashboard channel (plugin panel)

This is a "channel" but its body is the **Manager Dashboard plugin view**, not a message list.

Header: "Manager Dashboard · Bratislava Plant · rolling 30d". Right-side filter chip: "Factory: Bratislava Plant ▾" (non-functional, decorative).

**KPI cards row (4 cards)**
- **MTTR**: `47 min` · trend `▼12%` (green) · sparkline (last 12 weeks)
- **Open Incidents**: `7` · trend `▲2 this week` (red) · mini stacked bar by severity
- **AI Queries Today**: `142` · trend `▲23%` (green) · sparkline
- **Knowledge Notes**: `1,847` · `+31 this week` (green)

**Charts row (2 columns on ≥1024px, stacked below)**
1. **Incidents by Machine** — horizontal bar. Data:
   - Siemens S7-1500 CNC: 12 · KUKA KR 60-3: 8 · Zünd G3 Cutting: 5 · Conveyor L4: 3 · Compressor: 2
2. **AI Query Volume — last 30 days** — line chart. Start ~40/day, end ~145/day, gentle upward curve with a noticeable bump around day 20 (label: "After Zünd docs ingested").

**Charts row 2**
3. **MTTR Trend — last 12 weeks** — line chart. From ~68 min → ~47 min. Annotation marker on week 7: "KobiAI deployed".
4. **Knowledge-base growth** — area chart of chunks indexed over time. 0 → 12,340.

**Recent Incidents table** (5 rows, sortable columns)
| Time | Machine | Issue | Status | Resolved By |
|---|---|---|---|---|
| 09:14 today | Siemens S7-1500 | F-304 Overcurrent | 🟢 Resolved | J. Novák |
| 08:45 today | KUKA KR 60-3 | Welding arc misalignment | 🟡 In Progress | M. Horváth |
| Yesterday | Zünd G3 Cutting | Belt tension warning | 🟢 Resolved | P. Kováč |
| Yesterday | Conveyor L4 | Sensor calibration drift | 🔴 Open | — |
| 2 days ago | KUKA KR 60-3 | TCP calibration alert | 🟢 Resolved | M. Horváth |

Rows clickable → opens the incident thread in the right panel.

**Predictive alerts panel** (side column on wide, stacked on narrow)
- ⚠️ **KUKA KR 60-3** · Welding tip wear at 87% — schedule replacement
- ⚠️ **Compressor Unit** · Vibration pattern matches pre-failure signature from Oct 2025
- ℹ️ **Siemens S7-1500** · 3 similar F-304 incidents in 14 days — possible motor degradation

Each alert: "Dismiss" and "Create incident" buttons (the latter opens `/incident` dialog pre-filled).

**Dashboard auto-refresh mock**: every 30 s, subtly flash one KPI card and bump a number by +1 with a brief green pulse. Makes the screen feel live.

### 7.8 @kobi DM — Manage Knowledge panel

Opening DM with @kobi shows a different layout: messages on the left, a **right-hand "Manage Knowledge"** panel with three tabs:
1. **Indexed docs** — searchable list with source, pages, date, machine.
2. **My notes** — your contributed notes, editable.
3. **Gaps** — mock list: "Zünd G3 — electrical schema v2.3 not indexed" · "KUKA KR 60 — firmware release notes v4.1 missing". Click a gap → "Upload to #docs-drop" button.

This panel is the subtle admin-y screen that signals "this is a real knowledge system, not just chat."

### 7.9 On-prem security modal (click sidebar footer)

Centered modal, ~560px wide:
- Icon: factory building with shield overlay.
- Headline: **Your data never leaves this factory.**
- Body:
  > KobiAI runs entirely on your infrastructure. No cloud, no outbound traffic, no data shared with any third party.
  >
  > Every document, every question, every log stays on your server.
- Three pill badges in a row: **On-Premise** · **Air-Gapped Capable** · **ISO 27001 / TISAX Ready**
- Small paragraph: "Delivered as an on-prem appliance by Touch4IT (NIST · ISO 27001 · ISO 14001)."
- Close button.

---

## 8. Languages

String table in `/src/i18n/` with keys for every UI label: menu items, buttons, placeholders, channel names, toast messages, dashboard labels, dialog titles.

- Provide full strings for EN (default) and SK. Stub files for CZ, DE, PL with 60–70% coverage — enough to look real if toggled during demo.
- Mock message content (conversations, notes, incidents) stays EN regardless of language. This is a demo; do not translate every sentence.
- Implementation: simple `useTranslation()` hook reading from the context.

---

## 9. Device preview (the iPad story)

The Device toggle in the top bar changes a `deviceMode` state: `"desktop" | "tablet" | "mobile"`. The app's main shell wraps in:

- **desktop**: full width (max 1920).
- **tablet**: max-width 1024, centred, with a subtle "tablet frame" (20px rounded bezel) so the rep can present "how it looks on iPad".
- **mobile**: max-width 420, centred, iPhone-like frame (rounded corners, a thin top notch bar). Left sidebar becomes a drawer (hamburger icon top-left). Composer takes full width.

This is NOT user-agent responsive; it's an explicit toggle so the rep can **show** the mobile view on a laptop screen.

The responsive breakpoints for Tailwind should still work (md/lg), so real browser resizing also works — but the in-app toggle is the demo mechanism.

---

## 10. Animations & micro-interactions (non-negotiable — these make or break the "wow")

1. **Bot typing**: when a user sends `@kobi <q>` or uses `/ask`, show a left-aligned "KobiAI is thinking…" indicator (three bouncing dots + a small spinner) for 1.2–1.8s, then reveal the bot message **character by character** at ~25 ms/char. Sources card fades in after the text is done.
2. **Voice mic**: on press, a red pulsing dot next to 5 oscillating waveform bars. After 2s, input field fills with the pre-determined string via a quick typewriter. Auto-focus send button.
3. **Slash-command popover**: slides up from composer with 150 ms ease-out. Arrow keys navigate.
4. **Note / incident save**: green check-circle animation inside the toast (stroke animation ~400 ms). Toast auto-dismisses after 3.5s.
5. **Docs-drop**: file card transitions from "Parsing…" to "Indexed" with a progress-bar fill (1.5 s) and a count-up for pages/chunks/diagrams.
6. **Dashboard live pulse**: every 30 s, one random KPI card pulses green and the number increments by 1. Subtle; not distracting.
7. **Channel switch**: fast (100 ms) cross-fade of the centre panel. No page reload flash.
8. **Role toggle**: the default channel slides in from the right (200 ms) after the sidebar updates.
9. **Device toggle**: smooth 250 ms max-width transition with easing. No layout jump.

All animations respect `prefers-reduced-motion` — halve durations when set.

---

## 11. Accessibility

- All interactive elements keyboard-focusable with visible 2px focus ring `#4CAF50`.
- ARIA roles on landmarks (`role="navigation"` for sidebar, `role="main"` for centre, `role="complementary"` for right panel).
- Bot messages have an `aria-live="polite"` region so typed-out text is announced once fully rendered.
- Colour contrast ≥ 4.5:1 for all text.
- Dialogs trap focus and close on Esc.

---

## 12. Mock-data file structure

```
src/data/
├── users.ts           // Jozef Novák, Martin Horváth, Pavol Kováč, Tomáš Gazda, @kobi
├── teams.ts           // KobiAI · Bratislava Plant + decorative second team
├── channels.ts        // All channels with metadata
├── machines.ts        // Siemens / KUKA / Zünd + 2 "other" (Conveyor, Compressor) for dashboard
├── conversations/
│   ├── siemens.ts     // Pre-loaded messages (use the 6 messages from §7.2 verbatim)
│   ├── kuka.ts
│   ├── zund.ts
│   └── general.ts
├── responses/
│   ├── siemens.ts     // Pool of bot responses per question; cycle on repeat
│   ├── kuka.ts
│   └── zund.ts
├── incidents.ts       // 10 incidents, mix of statuses
├── notes.ts           // 10 pre-existing technician notes
├── docs.ts            // Doc registry: filename, pages, chunks, machine, uploader, date
├── dashboard.ts       // KPIs, chart time series, alerts
└── i18n/
    ├── en.ts
    ├── sk.ts
    ├── cz.ts
    ├── de.ts
    └── pl.ts
```

Use realistic Slovak / Czech / German names: Novák, Kováč, Horváth, Gazda, Suster, Korman, Haluska, Gerstner, Bauer.

Realistic industrial references: Siemens SINAMICS, KUKA System Software, Zünd Cut Center, error codes F-304, F-308, p0304/p0305, TCP calibration, Gates tension gauge, parts 3M-225-6, SICK IME30.

---

## 13. File structure

```
kobiai-prototype/
├── public/
│   └── images/
│       ├── logo-kobiai.svg            // 36×36 square, blue, white K, green dot
│       ├── machine-siemens.png        // placeholder industrial image
│       ├── machine-kuka.png
│       └── machine-zund.png
├── src/
│   ├── app/
│   │   ├── layout.tsx                 // Provider wrap (KobiContext)
│   │   ├── page.tsx                   // Redirect to default channel
│   │   └── team/[teamSlug]/channels/[channelSlug]/page.tsx
│   ├── components/
│   │   ├── shell/                     // TopBar, LeftSidebar, RightPanel, Shell
│   │   ├── chat/                      // MessageList, Message, Composer, SlashPopover, Thread
│   │   ├── bot/                       // BotMessage, SourcesCard, DiagramPreview
│   │   ├── dialogs/                   // AddNoteDialog, IncidentDialog, SearchOverlay
│   │   ├── dashboard/                 // KpiCard, ChartCards, IncidentsTable, AlertsPanel
│   │   ├── machines/                  // MachineCard, MachineChannelHeader
│   │   ├── docsdrop/                  // DropZone, IngestionCard
│   │   ├── knowledge/                 // ManageKnowledgePanel (DM with @kobi)
│   │   ├── security/                  // OnPremModal
│   │   └── ui/                        // shadcn primitives
│   ├── context/
│   │   └── KobiContext.tsx            // role, language, device, notesAddedThisSession, demoFlags
│   ├── data/                          // see §12
│   ├── hooks/
│   │   ├── useChannel.ts
│   │   ├── useChatResponder.ts        // picks next response, handles "learn live" loop
│   │   ├── useVoiceMock.ts
│   │   └── useTranslation.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── types.ts
│   │   └── mock.ts                    // ID generators, time formatters
│   └── styles/
│       └── globals.css
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── package.json
└── README.md
```

`README.md` should include: how to run (`npm install && npm run dev`), the 12-minute demo script (copy §15), known mocks ("all data mocked, no backend"), and keyboard shortcuts.

---

## 14. Build order (priority)

Build in this order. Commit after each pass so the rep can demo early versions.

**Pass 1 — shell (day 1–2)**
- Next.js scaffold + Tailwind + shadcn + context
- Top bar, left sidebar, centre, right panel
- Role toggle, language toggle, device toggle
- On-prem security modal

**Pass 2 — core demo (day 3–5)**
- `#general` with pinned bot post and ambient messages
- `#machine-siemens-s7-1500` with pre-loaded conversation
- Composer + slash-command popover
- `@kobi` and `/ask` typewriter bot response (Siemens pool)
- Sources card + diagram preview

**Pass 3 — capture (day 6–7)**
- `/add-note` dialog + toast + bot confirmation card
- Voice mic mock (composer + dialog)
- `notesAddedThisSession` flag + learn-live loop (note surfaced as source #1 on next `@kobi`)

**Pass 4 — logging + docs (day 8–9)**
- `/incident` dialog (two tabs) + submission flow
- `#incidents` channel with pre-loaded cards
- `#docs-drop` with drag-drop ingestion card animation

**Pass 5 — manager view (day 10–11)**
- `#dashboard` plugin-style panel with KPIs, charts, incidents table, alerts
- Live-pulse refresh
- Role toggle to Technician hides dashboard

**Pass 6 — polish (day 12–14)**
- `@kobi` DM + Manage Knowledge right panel
- KUKA + Zünd channels (2–3 exchanges each)
- Language toggle coverage
- Device preview frames
- All animations tuned
- Accessibility audit
- README + demo script

---

## 15. The demo script (copy into README, print for reps)

**Total: ~12 minutes. Always in Manager role on laptop first; switch to Technician on tablet near the end.**

| Step | Time | Action | Narration |
|---|---|---|---|
| 1 | 0:00 | App opens on `#dashboard` in Manager mode. | "This is KobiAI, running on your on-prem server. Nothing here touches the internet. Everything you see is what a maintenance manager sees on Monday morning." |
| 2 | 0:30 | Click an incident row (e.g., "F-304 Overcurrent") — right panel opens the thread. | "Every incident is a structured record — what broke, who fixed it, what parts, how long. And it's exportable to your ERP." |
| 3 | 1:30 | Switch role to Technician. Landing in `#machine-siemens-s7-1500`. | "Now I'm Jozef, the maintenance technician on the floor. I work from the machine's channel — everything about this machine lives here." |
| 4 | 2:00 | Scroll up: show last 3 Q&A exchanges. | "Earlier today Jozef asked three questions. Look at the answers — grounded in the Siemens manual, with page references. No made-up answers." |
| 5 | 3:00 | Type `@kobi What's the restart sequence after a belt break?` | "Real-time. Watch." |
| 6 | 3:10 | Let typing animation run. Highlight sources, especially the Novák tech note. | "Notice the third source — that's not a manual. That's a note another technician left last month. The AI uses both." |
| 7 | 4:30 | Hit the 🎤 mic button in composer. Let it fill a question. | "On the factory floor, nobody types. They talk." |
| 8 | 5:00 | Run `/add-note`, use voice-mock inside the dialog to fill the text. Save. | "And when Jozef fixes something, he captures it — voice, 15 seconds, done." |
| 9 | 5:30 | Point at the bot confirmation card. Then ask `@kobi` the F-304 question again. | "Now watch — the same question I asked before. But now Jozef's fix is in the system. So the answer includes it." |
| 10 | 6:30 | Show `#docs-drop`. Drag any PDF from desktop into the channel. | "Need to add a new manual? Just drop it. 400 pages indexed in under 20 seconds, tagged to the right machine. No integration project." |
| 11 | 7:30 | Run `/incident`, fill fault + parts + resolution, submit. | "If it's a full incident — fault, parts, resolution type — we have structured logging. This is what replaces your WhatsApp group and paper notebook. And it pushes straight to your ERP." |
| 12 | 9:00 | Switch Device to Tablet, hand the iPad to the customer. | "This is exactly what your technicians see on the rented device we ship with the system." |
| 13 | 10:00 | Switch back to Manager. Click the on-prem sidebar footer. | "And this — this is why your IT team will actually say yes. On-prem, air-gapped capable, ISO 27001, TISAX-ready. Same platform the defence sector uses. Zero data leaves your factory." |
| 14 | 11:00 | Back to dashboard. Let the live pulse happen. | "Every question, every note, every incident — feeds this. MTTR is already down 12% in this simulated data. We've seen similar in real pilots." |
| 15 | 12:00 | Close. | "Next step — we'd love to run a 4-week pilot on one of your production lines. What would it take?" |

---

## 16. Acceptance criteria

The prototype is **done** when:

1. A sales rep can complete the full 15-step demo above on a laptop in ≤12 minutes, no intervention, no reloads needed.
2. Role toggle, language toggle, device toggle all work and don't break any state.
3. All slash commands (`/ask`, `/add-note`, `/incident`, `/search`) open dialogs/overlays with no visible errors.
4. Drag any file into `#docs-drop` → ingestion card appears and completes.
5. Voice mic works in composer and in both dialogs.
6. "Learn live" loop works: add a note, then `@kobi` surfaces it as source #1 on the next matching query.
7. Dashboard loads charts with no flicker; live pulse runs every 30 s.
8. No "404" / "coming soon" / console errors visible to the audience.
9. On-prem modal renders and closes cleanly.
10. Switching to Tablet or Mobile device mode wraps the whole app in a plausible device frame; sidebar collapses to drawer in Mobile.
11. `npm run build` passes; `npm run dev` starts cold in under 5 s on a modern laptop.
12. README includes: install, run, demo script, reset instructions, a disclaimer section stating "All data is mocked. No backend. No LLM. No network calls. This is a sales demo."

---

## 17. Explicitly out of scope

- Real authentication / login screens. Load straight into the app.
- Real LLM calls. No OpenAI/Anthropic/any API keys.
- Real file parsing. Drop triggers a canned animation.
- Real persistence. Page reload = reset (plus an explicit "Reset demo" button).
- Real multi-user. It's single-user demo state.
- Real Mattermost integration. It's a clone.
- Notifications beyond toast. No push, no email.
- Video calls. The icon exists for visual completeness only.
- Payment / settings / admin configuration screens.

---

## 18. Hand-off note

Once built, the rep should be able to:
1. `git clone && npm install && npm run dev` → demo in 2 minutes.
2. Alternatively, deploy to Vercel with one click and share a URL (for remote demos).
3. Open on a laptop with Chrome/Edge, full-screen.
4. Optional: mirror to iPad Safari for the "hand-it-to-the-customer" moment at step 12.

Hand any issues back to Edo (Scalent). Next revision (v3) will add: a second factory team for the multi-site story, and a pre-recorded screencast fallback for connectivity-free sites.

---

*End of prototype coding prompt v2.0. Paste this entire doc into your AI coding agent. Ask the agent to confirm it understands scope before generating code.*
