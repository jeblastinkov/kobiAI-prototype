// KobiAI Mock Data — all data is fictional for demo purposes

window.KobiData = (() => {

const users = {
  martin: { id: 'martin', name: 'Martin Horváth', initials: 'MH', color: '#1E3A5F', role: 'manager', online: true },
  jozef:  { id: 'jozef',  name: 'Jozef Novák',   initials: 'JN', color: '#2E7D32', role: 'technician', online: true },
  pavol:  { id: 'pavol',  name: 'Pavol Kováč',   initials: 'PK', color: '#6A1B9A', online: false },
  tomas:  { id: 'tomas',  name: 'Tomáš Gazda',   initials: 'TG', color: '#BF360C', online: false },
  kobi:   { id: 'kobi',   name: 'Kobi',           initials: 'K',  color: '#1E3A5F', isBot: true, online: true },
};

const channels = [
  { slug: 'general',              name: 'general',                icon: '🏭', purpose: 'General announcements and team updates', members: 9, pinned: 1 },
  { slug: 'machine-siemens',      name: 'machine-siemens-s7-1500', icon: '⚙️', purpose: 'Siemens S7-1500 CNC · Hall A, Line 3', members: 5, pinned: 3, machineId: 'siemens' },
  { slug: 'machine-kuka',         name: 'machine-kuka-kr-60',      icon: '🤖', purpose: 'KUKA KR 60-3 Welding Robot · Hall B, Line 1', members: 4, pinned: 2, machineId: 'kuka' },
  { slug: 'machine-zund',         name: 'machine-zund-g3',         icon: '✂️', purpose: 'Zünd G3 Cutting Line · Hall C', members: 4, pinned: 2, machineId: 'zund' },
  { slug: 'incidents',            name: 'incidents',               icon: '🚨', purpose: 'Incident tracking and maintenance log', members: 9, pinned: 0, mentions: 1 },
  { slug: 'docs-drop',            name: 'docs-drop',               icon: '📥', purpose: 'Drop documents to feed the AI knowledge base', members: 9, pinned: 0 },
  { slug: 'dashboard',            name: 'dashboard',               icon: '📊', purpose: 'Manager Dashboard · rolling 30d', members: 3, pinned: 0, managerOnly: true },
];

/** Mattermost-style apps bar: 3rd-party tools opened beside chat (iframe in production) */
const integrationApps = [
  { id: 'teams',  nameKey: 'intMsTeams',  descKey: 'intMsTeamsDesc',  color: '#5B5FC7', icon: 'intMsTeams',  embedUrl: null },
  { id: 'cmms',   nameKey: 'intCmms',     descKey: 'intCmmsDesc',     color: '#0D9488', icon: 'intCmms',     embedUrl: null },
  { id: 'erp',    nameKey: 'intErp',      descKey: 'intErpDesc',      color: '#D4A012', icon: 'intErp',      embedUrl: null },
  { id: 'mes',    nameKey: 'intMes',      descKey: 'intMesDesc',      color: '#2563EB', icon: 'intMes',      embedUrl: null },
  { id: 'kobi',   nameKey: 'intKobi',     descKey: 'intKobiDesc',     color: '#6B1B72', icon: 'sparkles',  embedUrl: null, openDmKobi: true },
];

const machines = {
  siemens: {
    id: 'siemens', name: 'Siemens S7-1500 CNC', type: 'CNC Machining Centre',
    oem: 'Siemens AG', location: 'Hall A, Line 3', commissioned: '2019',
    status: 'online', docsIndexed: 847, chunksIndexed: 12340, diagramsExtracted: 412,
    lastIncident: '2 days ago', color: '#1565C0',
  },
  kuka: {
    id: 'kuka', name: 'KUKA KR 60-3', type: 'Welding Robot',
    oem: 'KUKA Robotics', location: 'Hall B, Line 1', commissioned: '2020',
    status: 'maintenance', docsIndexed: 623, chunksIndexed: 8910, diagramsExtracted: 287,
    lastIncident: 'Yesterday', color: '#FF6F00',
  },
  zund: {
    id: 'zund', name: 'Zünd G3 Cutting Line', type: 'Digital Cutting System',
    oem: 'Zünd Systemtechnik AG', location: 'Hall C', commissioned: '2021',
    status: 'online', docsIndexed: 412, chunksIndexed: 6820, diagramsExtracted: 198,
    lastIncident: '3 days ago', color: '#2E7D32',
  },
};

/** Demo telemetry for Machine Status right panel (fictional). */
const machineOperational = {
  siemens: {
    kpis: [
      { label: 'OEE', value: '84', unit: '%' },
      { label: 'Availability', value: '96', unit: '%' },
      { label: 'Active alarms', value: '0', unit: '' },
      { label: 'Shift runtime', value: '6.2', unit: 'h' },
    ],
    trendUtilization: [
      { day: 'Mon', pct: 76 }, { day: 'Tue', pct: 81 }, { day: 'Wed', pct: 79 }, { day: 'Thu', pct: 85 },
      { day: 'Fri', pct: 88 }, { day: 'Sat', pct: 72 }, { day: 'Sun', pct: 68 },
    ],
    signals: [
      { time: '09:42', tag: 'NC.Program', value: 'OP4321', state: 'ok' },
      { time: '09:40', tag: 'Drive.Temp', value: '41 °C', state: 'ok' },
      { time: '09:38', tag: 'Spindle.Load', value: '78%', state: 'ok' },
      { time: '09:35', tag: 'Axes.Following', value: '< 2 µm', state: 'ok' },
      { time: '09:12', tag: 'Coolant.Flow', value: '12 L/min', state: 'ok' },
    ],
  },
  kuka: {
    kpis: [
      { label: 'OEE', value: '52', unit: '%' },
      { label: 'Availability', value: '71', unit: '%' },
      { label: 'Active alarms', value: '3', unit: '' },
      { label: 'Last stop', value: '2h ago', unit: '' },
    ],
    trendUtilization: [
      { day: 'Mon', pct: 72 }, { day: 'Tue', pct: 68 }, { day: 'Wed', pct: 45 }, { day: 'Thu', pct: 38 },
      { day: 'Fri', pct: 55 }, { day: 'Sat', pct: 40 }, { day: 'Sun', pct: 35 },
    ],
    signals: [
      { time: '09:41', tag: 'Safety.Circuit', value: 'RESET req.', state: 'warn' },
      { time: '09:39', tag: 'TCP.Deviation', value: '0.9 mm', state: 'warn' },
      { time: '09:36', tag: 'Arc.Voltage', value: '24.1 V', state: 'ok' },
      { time: '09:30', tag: 'Gun.Wear', value: 'Elevated', state: 'warn' },
      { time: '08:55', tag: 'Cycle.Count', value: '12 044', state: 'ok' },
    ],
  },
  zund: {
    kpis: [
      { label: 'OEE', value: '79', unit: '%' },
      { label: 'Availability', value: '94', unit: '%' },
      { label: 'Active alarms', value: '1', unit: '' },
      { label: 'Zone 3 vacuum', value: '−71', unit: ' kPa' },
    ],
    trendUtilization: [
      { day: 'Mon', pct: 74 }, { day: 'Tue', pct: 77 }, { day: 'Wed', pct: 80 }, { day: 'Thu', pct: 82 },
      { day: 'Fri', pct: 78 }, { day: 'Sat', pct: 65 }, { day: 'Sun', pct: 60 },
    ],
    signals: [
      { time: '09:43', tag: 'Zone3.Vacuum', value: '−71 kPa', state: 'ok' },
      { time: '09:40', tag: 'Z2.Lift', value: '−3 mm', state: 'ok' },
      { time: '09:15', tag: 'Conv.Speed', value: '8.2 m/min', state: 'ok' },
      { time: '08:50', tag: 'Knife.Wear', value: 'Replace soon', state: 'warn' },
    ],
  },
};

/** Plants / lines: same machine channels, different order & labels per site (demo). */
const workspaces = [
  {
    id: 'bratislava',
    nameKey: 'wsBratislava',
    subKey: 'wsBratislavaSub',
    machineIds: [
      { machineId: 'siemens', slug: 'machine-siemens', shortKey: 'wsNavBrSi' },
      { machineId: 'kuka', slug: 'machine-kuka', shortKey: 'wsNavBrKu' },
      { machineId: 'zund', slug: 'machine-zund', shortKey: 'wsNavBrZu' },
    ],
  },
  {
    id: 'kosice',
    nameKey: 'wsKosice',
    subKey: 'wsKosiceSub',
    machineIds: [
      { machineId: 'kuka', slug: 'machine-kuka', shortKey: 'wsNavKoKu' },
      { machineId: 'zund', slug: 'machine-zund', shortKey: 'wsNavKoZu' },
      { machineId: 'siemens', slug: 'machine-siemens', shortKey: 'wsNavKoSi' },
    ],
  },
  {
    id: 'trnava',
    nameKey: 'wsTrnava',
    subKey: 'wsTrnavaSub',
    machineIds: [
      { machineId: 'zund', slug: 'machine-zund', shortKey: 'wsNavTrZu' },
      { machineId: 'siemens', slug: 'machine-siemens', shortKey: 'wsNavTrSi' },
      { machineId: 'kuka', slug: 'machine-kuka', shortKey: 'wsNavTrKu' },
    ],
  },
];

function getWorkspaceById(id) {
  return workspaces.find((w) => w.id === id) || workspaces[0];
}

function getFirstMachineSlugForWorkspace(id) {
  const w = getWorkspaceById(id);
  return w?.machineIds?.[0]?.slug || 'machine-siemens';
}

function buildMachineNavEntries(workspaceId, t) {
  const w = getWorkspaceById(workspaceId);
  const I = window.Icons;
  const iconByMachine = { siemens: I.gear, kuka: I.robot, zund: I.cutter };
  return w.machineIds.map((row) => {
    const mach = machines[row.machineId];
    return {
      slug: row.slug,
      id: row.machineId,
      name: mach ? mach.name : row.machineId,
      short: t(row.shortKey),
      icon: iconByMachine[row.machineId] || I.gear,
      status: mach ? mach.status : 'online',
    };
  });
}

const now = Date.now();
const minsAgo = (m) => new Date(now - m * 60000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
const hrsAgo  = (h) => new Date(now - h * 3600000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

const conversations = {
  general: [
    { id: 'g1', userId: 'kobi', time: 'Yesterday 08:00', pinned: true, text: `Welcome to **KobiAI · Bratislava Plant**. I am your AI maintenance assistant. Ask me anything about your machines, log incidents with \`/incident\`, drop documents in \`#docs-drop\`, and open a machine channel to get context-aware help. Everything stays inside this factory.` },
    { id: 'g2', userId: 'tomas', time: 'Yesterday 13:22', text: 'Heads up — KR 60 had a welding arc misalignment yesterday, resolved. Thread in #incidents.' },
    { id: 'g3', userId: 'martin', time: 'Yesterday 16:05', text: 'New Zünd docs uploaded this morning. KobiAI finished indexing in 18 seconds. 👀', threadCount: 1, threadPreview: { userId: 'kobi', text: '📄 Received "Zünd_G3_Manual_EN.pdf" (412 pages). Parsed. 1,034 chunks indexed. 23 diagrams extracted. Available in #machine-zund-g3.' } },
    { id: 'g5', userId: 'pavol', time: hrsAgo(2.5), text: '**Line cascade:** Zünd in Hall C is ~40 min behind — upstream CNC in #machine-siemens was in planned PM until 11:00. Welding in #machine-kuka is clear; cutting should catch up after lunch. Posting for MES line balance.' },
    {
      id: 'g6',
      userId: 'jozef',
      time: hrsAgo(2),
      text: '@kobi We got a photo of an odd drive alarm from a customer site — not in the OEM list. Any triage before we open a formal ticket?',
    },
    {
      id: 'g7',
      userId: 'kobi',
      time: hrsAgo(2),
      isBot: true,
      markdown: `**Unlisted SINAMICS-style alarm — triage (OEM first, then community)**

I checked **OEM fault lists** for your build (no exact match). From **indexed non-official sources** (forums, DIY write-ups) — *ideas only*; always **verify** against OEM and your safety / CE process:

1. **PracticalMachinist-style threads (fictional):** “false stall” when **encoder cable shield** is loose at X411 — re-seat and torquing per diagram.
2. **hobby-CNC.org tech note (fictional):** moisture / re-seat **Control Unit** after long shutdown — *less likely* in your climate-controlled hall.

**Official baseline:** SINAMICS S120 fault manual (use as the source of truth for work orders).`,
      sources: [
        { title: '[Community] “S120 false stall” — indexed thread (fictional)', ref: 'non-official', date: '' },
        { title: '[DIY] Encoder cable checklist — hobby-CNC (fictional)', ref: 'non-official', date: '' },
        { title: 'Siemens SINAMICS S120 Fault Manual', ref: 'OEM baseline', date: 'priority', openAs: 'pdf' },
      ],
    },
    { id: 'g8', userId: 'martin', time: minsAgo(55), text: 'Night shift asked: I queried Kobi in **Slovak**; OEM PDFs are **DE/EN** only — the answer still came back in **SK** with the right refs. That’s the CEE floor reality.' },
    { id: 'g4', userId: 'pavol', time: minsAgo(47), text: 'Reminder — shift handover at 14:00.' },
  ],

  'machine-siemens': [
    {
      id: 's1', userId: 'jozef', time: hrsAgo(4) + ' · Today',
      text: '@kobi The drive is throwing an F-304 error — what does it mean and how do I fix it?',
    },
    {
      id: 's2', userId: 'kobi', time: hrsAgo(4),
      isBot: true,
      markdown: `**Error F-304 — Overcurrent in Motor Module**

The motor module detected current exceeding the configured threshold. Common causes:

1. **Short circuit** in the motor cable or winding
2. **Incorrect motor parameters** (p0304, p0305)
3. **Mechanical overload** — spindle blocked or under excessive load

**Immediate steps:**
1. Press RESET on the CU320-2 control unit
2. Check cable at terminals U, V, W
3. Measure winding resistance (expected 2.1–2.5 Ω / phase)
4. Verify p0304 = 12.5 A (nameplate)

⚠️ If resistance < 1.0 Ω, motor winding is damaged — do not restart.`,
      sources: [
        { title: 'Siemens SINAMICS S120 Fault Manual', ref: 'p.247 (F-304)', date: 'indexed 12 Mar', openAs: 'pdf' },
        { title: 'Machine Config Sheet — CNC Line 3', ref: 'updated 8 Jan', date: '', openAs: 'pdf' },
      ],
      diagram: { label: '📊 Wiring Diagram — Fig. 8.14 (Motor Module Connection)' },
    },
    {
      id: 's3', userId: 'jozef', time: hrsAgo(3.7),
      text: '@kobi Which component is referenced in parameter p0304?',
    },
    {
      id: 's4', userId: 'kobi', time: hrsAgo(3.7),
      isBot: true,
      markdown: `**Parameter p0304 — Rated Motor Current**

Defines rated current of the connected motor in amperes. For your unit (Siemens 1FK7083-5AF71):

- Nameplate: **12.5 A**
- Configured: **12.5 A** ✅
- Location: Drive object DO3, Motor Module slot 4

If this doesn't match the motor nameplate, F-304 may trip under normal load.`,
      sources: [
        { title: 'SINAMICS S120 Parameter Manual', ref: 'p.89', date: '', openAs: 'pdf' },
        { title: 'Motor Nameplate Photo (T. Kováč)', ref: '3 Feb 2026', date: '', openAs: 'image' },
      ],
    },
    {
      id: 's5', userId: 'jozef', time: hrsAgo(2.1),
      text: '@kobi What\'s the restart sequence after a belt break on this machine?',
    },
    {
      id: 's6', userId: 'kobi', time: hrsAgo(2.1),
      isBot: true,
      markdown: `**Belt Break Recovery — Siemens S7-1500 CNC (Line 3)**

1. **Emergency stop** — confirm E-STOP engaged (red mushroom, panel left)
2. **Open guard door** — wait for spindle to stop (≤30 s)
3. **Inspect belt** — check timing belt condition, tension pulley, debris
4. **Replace belt** — part **3M-225-6** (shelf B3-12)
5. **Reset sequence**: release E-STOP · RESET on operator panel · run \`G28 U0 W0\` · confirm no alarms
6. **Test cut** — run program \`O0001\` before production

💡 *Tip from technician J. Novák (12 Mar 2026): After belt replacement on this machine, always re-tension to **4.5 N** using the Gates gauge. Factory spec says 4.0 N but it slips under high feed.*`,
      sources: [
        { title: 'Operator Manual', ref: '§12.4', date: '' },
        { title: 'Maintenance Log #MK-2026-0312', ref: 'J. Novák', date: '', isNote: true },
        { title: 'Spare Parts Inventory', ref: 'B3-12 · 3M-225-6 · QOH 4', date: 'snapshot', isNote: true },
      ],
    },
    {
      id: 's7',
      userId: 'jozef',
      time: hrsAgo(1.2),
      text: '@kobi F-304 only after **warm start** post-break — never cold mornings. Feels intermittent. What should we log?',
    },
    {
      id: 's8',
      userId: 'kobi',
      time: hrsAgo(1.2),
      isBot: true,
      markdown: `**Intermittent F-304 (warm / inrush pattern)**

OEM text covers **steady-state** F-304. For **afternoon-only** trips I matched our internal log + one **community write-up** (fictional forum index) — *confirm before acting*:

| Check | Risk |
|-------|------|
| Motor cable in drag chain — insulation cracks when warm | Medium |
| Bearing drag as stack heats | Medium |
| Module fan / airflow after several hours | High |

**Next:** Log cold vs hot winding resistance; compare to 08:00 baseline.

**Spares (demo snapshot):** Motor **1FK7083-5AF71** — **shelf D2-04 · QOH 1** (reorder if consumed) · Belt **3M-225-6** — **B3-12 · QOH 4**`,
      sources: [
        { title: 'Siemens App Note — thermal / inrush (fictional ref)', ref: 'AN-2019-04', date: '' },
        { title: '[Forum] “F-304 afternoons only” — indexed (fictional)', ref: 'community', date: '' },
        { title: 'Spare parts snapshot', ref: 'ERP · demo', date: '', isNote: true },
      ],
    },
  ],

  'machine-kuka': [
    {
      id: 'k1', userId: 'martin', time: 'Yesterday 08:30',
      text: '@kobi The KR 60 welding arc is drifting on pass 3 — what\'s the most likely cause?',
    },
    {
      id: 'k2', userId: 'kobi', time: 'Yesterday 08:30',
      isBot: true,
      markdown: `**Welding Arc Drift — KUKA KR 60-3 Diagnosis**

Most common causes of arc drift on pass 3:

1. **TCP (Tool Centre Point) deviation** — occurs after tip replacement if TCP not recalibrated. Drift typically 0.5–2 mm.
2. **Worn welding tip** — contact tube wear causes arc instability. Check tip wear at >87% duty cycle.
3. **Wire feed inconsistency** — check wire spool tension and liner condition
4. **Workpiece fixture shift** — verify clamp torque and datum points

**Recommended first action**: Run \`$TOOL_CAL[1]\` calibration routine from KRC4 pendant. Takes ~4 minutes.`,
      sources: [
        { title: 'KUKA System Software KSS 8.6 Manual', ref: 'Ch.14 TCP Calibration', date: '' },
        { title: 'Tech note — M. Horváth', ref: '5 Feb 2026', date: '', isNote: true },
      ],
    },
    {
      id: 'k3', userId: 'martin', time: 'Yesterday 09:12',
      text: '@kobi How do I run the TCP calibration safely with the safety fence open?',
    },
    {
      id: 'k4', userId: 'kobi', time: 'Yesterday 09:12',
      isBot: true,
      markdown: `**TCP Calibration — Safety Override Procedure**

⚠️ **Safety first** — this procedure requires T1 (manual reduced speed ≤250 mm/s).

1. Set KRC4 operating mode to **T1** (key switch)
2. Acknowledge safety fence override on pendant: \`Safety → Ext. Area → Acknowledge\`
3. Enable enabling switch (3-position) — hold center position throughout
4. Navigate: \`Menu → Startup → Calibrate → Tool → ABC World\`
5. Touch reference point 4 times from different orientations
6. Accept result if deviation < 0.15 mm

**Do NOT use T2 or AUT mode during open-fence calibration.**`,
      sources: [
        { title: 'KUKA SafeOperation Manual', ref: 'p.88', date: '' },
        { title: 'Plant Safety SOP-042', ref: 'Rev 3, Jan 2026', date: '' },
      ],
    },
    {
      id: 'k5', userId: 'tomas', time: minsAgo(90),
      text: 'Arc alignment confirmed after TCP recal. Running test welds now — looks good.',
    },
  ],

  'machine-zund': [
    {
      id: 'z1', userId: 'pavol', time: 'Yesterday 14:00',
      text: '@kobi Vacuum table is losing pressure in zone 3 — how do I diagnose?',
    },
    {
      id: 'z2', userId: 'kobi', time: 'Yesterday 14:00',
      isBot: true,
      markdown: `**Vacuum Table Pressure Loss — Zone 3 Diagnostic (Zünd G3)**

Step-by-step isolation:

1. **Check zone valve** — open Zünd Cut Center → Diagnostics → Vacuum → Zone 3 valve status. Should read OPEN when cutting.
2. **Inspect sealing strips** — worn perimeter seal allows leak. Run hand over edge while table is active — feel for suction loss.
3. **Debris blockage** — foam or material scraps can block vacuum holes. Use compressed air to clear (60 PSI max).
4. **Pump capacity check** — if zones 1–2 also degrading, vacuum pump filter may be saturated (replace every 500h).

📊 Expected pressure: **≥ −68 kPa** in zone 3 during active cut.`,
      sources: [
        { title: 'Zünd G3 Operator Manual', ref: 'Ch.9 Vacuum System', date: '' },
        { title: 'Maintenance Note — P. Kováč', ref: '28 Jan 2026', date: '', isNote: true },
      ],
    },
    {
      id: 'z3', userId: 'pavol', time: 'Yesterday 15:30',
      text: '@kobi Found debris in zone 3 ports. Cleared. Pressure back to -71 kPa. Thanks.',
    },
    {
      id: 'z4', userId: 'kobi', time: 'Yesterday 15:30',
      isBot: true,
      markdown: `Great — −71 kPa is nominal. I've logged this resolution to the Zünd G3 maintenance history.

💡 *Tip: Zone 3 is directly below the film-feed path — it collects more debris than zones 1–2. Consider adding it to the daily pre-shift checklist.*`,
      sources: [
        { title: 'Zünd G3 Preventive Maintenance Schedule', ref: 'Rev 2.1', date: '' },
      ],
    },
    {
      id: 'z5',
      userId: 'pavol',
      time: hrsAgo(0.8),
      text: '@kobi Web snapped on the roll — what\'s the **restart** sequence for the Zünd so we don\'t wrinkle the next sheet?',
    },
    {
      id: 'z6',
      userId: 'kobi',
      time: hrsAgo(0.8),
      isBot: true,
      markdown: `**Web / film break — Zünd G3 (procedural restart)**

1. Stop feed, raise knife, clear the path
2. Re-thread per **Operator Manual §6.2** — ramp **tension** slowly (avoid snap)
3. **Test** on scrap corner before good material
4. Bring **vacuum zones** up 1 → 2 → 3 in order

**Line context:** Same discipline as **CNC line 3** after a **timing-belt** event — an ordered reset keeps **#machine-kuka** from getting half-finished kits. See belt recovery thread in #machine-siemens.

**Consumable (demo):** Tension assist spring **ZND-4412** — **shelf C2-01 · QOH 6**`,
      sources: [
        { title: 'Zünd G3 Operator Manual', ref: '§6.2 Web path', date: '' },
        { title: 'Line coordination', ref: 'MES · demo', date: '', isNote: true },
      ],
    },
    {
      id: 'z7',
      userId: 'pavol',
      time: minsAgo(35),
      text: '@kobi Quality wants less edge lift on **thick foam** — tune vacuum setpoints before we slow the knife?',
    },
    {
      id: 'z8',
      userId: 'kobi',
      time: minsAgo(35),
      isBot: true,
      markdown: `**Vacuum zone tuning (process / quality)**

| Zone | Now | Suggested | Note |
|------|-----|------------|------|
| 1 | −70 kPa | **−72 kPa** | More hold on lead edge |
| 2 | −69 kPa | −69 kPa | OK |
| 3 | −66 kPa | **−70 kPa** | Matches edge lift report |

**How:** Cut Center → **Process → Vacuum → Advanced** — change one zone, ~2% steps, **5 good cuts** between changes.

**Log every change** in the service log for audit. Revert if OEE drops.

📦 *Related consumables:* seal strips on order — **QOH 0** (ETA Fri); flagging procurement.`,
      sources: [
        { title: 'Zünd G3 Process Guide', ref: 'Ch.11 Vacuum optimization', date: '' },
        { title: 'Quality Q-2026-088', ref: 'edge lift · 40mm foam', date: '', isNote: true },
      ],
    },
  ],

  'docs-drop': [
    {
      id: 'dd1', userId: 'kobi', time: '3 days ago 09:12', isBot: true,
      isIngestion: true,
      file: { name: 'KUKA_KR60_System_Manual_v4.pdf', size: '18.4', pages: 461, chunks: 2840, diagrams: 94, machine: '#machine-kuka-kr-60', status: 'indexed' },
    },
    {
      id: 'dd2', userId: 'kobi', time: '2 days ago 11:47', isBot: true,
      isIngestion: true,
      file: { name: 'Zund_G3_Operator_Manual_EN.pdf', size: '16.5', pages: 412, chunks: 1034, diagrams: 23, machine: '#machine-zund-g3', status: 'indexed' },
    },
    {
      id: 'dd3', userId: 'kobi', time: 'Yesterday 08:02', isBot: true,
      isIngestion: true,
      file: { name: 'Siemens_SINAMICS_S120_FaultManual.pdf', size: '9.2', pages: 231, chunks: 1420, diagrams: 67, machine: '#machine-siemens-s7-1500', status: 'indexed' },
    },
    {
      id: 'dd4',
      userId: 'kobi',
      time: 'Today 07:15',
      isBot: true,
      markdown: `**Voice service log (demo)** — Transcribed and structured from shop-floor audio

- **Machine:** Siemens S7-1500 CNC · \`#machine-siemens\`
- **Component:** Motor module / timing path
- **Work:** Replaced belt **3M-225-6** · tension **4.5 N** (Gates gauge) · test cut OK
- **Operator:** @jozef · Shift A
- **Linked:** INC-2026-0487

_Hands-free capture → normalized fields for CMMS / service history (prototype)._`,
      sources: [
        { title: 'Voice capture policy', ref: 'SOP-AUDIO-01 (demo)', date: '' },
        { title: 'Structured log export', ref: 'CMMS bridge · demo', date: '', isNote: true },
      ],
    },
  ],

  incidents: [],
};

const incidents = [
  { id: 'INC-2026-0482', machine: 'Zünd G3 Cutting', issue: 'Belt tension warning', severity: 'warning', status: 'resolved', openedBy: 'pavol', resolvedBy: 'pavol', opened: '3 days ago', resolved: '2 days ago', notes: 'Detected minor drift on pressure — tensioned and cleaned rail.', resolution: 'Permanent', mttr: '2h 14m', parts: [] },
  { id: 'INC-2026-0483', machine: 'Siemens S7-1500 CNC', issue: 'F-304 Overcurrent', severity: 'critical', status: 'resolved', openedBy: 'jozef', resolvedBy: 'jozef', opened: '2 days ago', resolved: '2 days ago', notes: 'Winding resistance low on phase V. Motor replaced.', resolution: 'Permanent', mttr: '1h 42m', parts: ['Siemens Motor 1FK7083-5AF71'] },
  { id: 'INC-2026-0484', machine: 'KUKA KR 60-3', issue: 'TCP calibration alert', severity: 'warning', status: 'resolved', openedBy: 'martin', resolvedBy: 'martin', opened: '2 days ago', resolved: '2 days ago', notes: 'TCP deviation 1.2 mm after tip change. Recalibrated.', resolution: 'Permanent', mttr: '0h 28m', parts: ['Welding tip WA-120'] },
  { id: 'INC-2026-0485', machine: 'Conveyor L4', issue: 'Sensor calibration drift', severity: 'warning', status: 'open', openedBy: 'tomas', resolvedBy: null, opened: 'Yesterday', resolved: null, notes: 'SICK IME30 proximity sensor drifting ±3mm. Part **IME30-15BPSZT0** — **shelf E1-08 · QOH 2** (reorder at min 1).', resolution: null, mttr: null, parts: ['SICK IME30-15BPSZT0 (E1-08, QOH 2)'] },
  { id: 'INC-2026-0486', machine: 'KUKA KR 60-3', issue: 'Welding arc misalignment', severity: 'warning', status: 'in-progress', openedBy: 'martin', resolvedBy: null, opened: 'Today 08:45', resolved: null, notes: 'Arc drift diagnosed to TCP deviation. Recalibration in progress.', resolution: null, mttr: null, parts: [] },
  { id: 'INC-2026-0487', machine: 'Siemens S7-1500 CNC', issue: 'F-304 Overcurrent repeat', severity: 'critical', status: 'awaiting-approval', openedBy: 'jozef', resolvedBy: null, opened: 'Today 09:14', resolved: null, notes: 'Timing belt snapped mid-cut. Replaced with 3M-225-6, tension 4.5N.', resolution: 'Permanent', mttr: null, parts: ['Timing belt 3M-225-6'] },
];

const dashboardKPIs = {
  mttr: { value: 47, unit: 'min', trend: -12, trendDir: 'down' },
  openIncidents: { value: 7, trend: 2, trendDir: 'up' },
  aiQueriesToday: { value: 142, trend: 23, trendDir: 'up' },
  knowledgeNotes: { value: 1847, trend: 31, trendDir: 'up' },
};

// Generate last 30 days of AI query data
const aiQueryData = Array.from({length: 30}, (_, i) => ({
  day: i + 1,
  queries: Math.round(40 + (i * 3.5) + (i > 18 ? (i - 18) * 4 : 0) + (Math.random() * 10 - 5)),
}));

// MTTR trend last 12 weeks
const mttrData = Array.from({length: 12}, (_, i) => ({
  week: `W${i + 1}`,
  mttr: Math.round(68 - (i * 2.2) + (Math.random() * 4 - 2)),
  kobiDeployed: i === 6,
}));

// Knowledge growth
const knowledgeData = Array.from({length: 12}, (_, i) => ({
  week: `W${i + 1}`,
  chunks: Math.round((i / 11) * 12340 * (0.6 + Math.random() * 0.4)),
})).sort((a,b) => a.chunks - b.chunks);

const incidentsByMachine = [
  { machine: 'Siemens S7-1500', count: 12 },
  { machine: 'KUKA KR 60-3', count: 8 },
  { machine: 'Zünd G3', count: 5 },
  { machine: 'Conveyor L4', count: 3 },
  { machine: 'Compressor', count: 2 },
];

const predictiveAlerts = [
  { id: 'a1', machine: 'KUKA KR 60-3', type: 'warning', message: 'Welding tip wear at 87% — schedule replacement within 2 shifts' },
  { id: 'a2', machine: 'Compressor Unit', type: 'warning', message: 'Vibration pattern matches pre-failure signature from Oct 2025' },
  { id: 'a3', machine: 'Siemens S7-1500', type: 'info', message: '3 similar F-304 incidents in 14 days — possible motor degradation' },
  { id: 'a4', machine: 'Siemens S7-1500', type: 'warning', message: 'Intermittent F-304 clusters after warm start — see thread in #machine-siemens' },
];

const botResponses = {
  siemens: [
    {
      trigger: ['F-304', 'belt', 'restart', 'overcurrent', 'error'],
      markdown: `**F-304 — Overcurrent: Follow-up Analysis**

Based on the repeated F-304 pattern this week, I'm seeing a possible motor degradation trend on Line 3.

**Updated recommended actions:**
1. Schedule a full motor winding resistance test (all 3 phases) during next planned downtime
2. Check thermal overload history in drive parameters r0947[0..7]
3. Review bearing condition — worn bearings increase current draw

**Parts to have ready (demo):** Motor **1FK7083-5AF71** — **shelf D2-04 · QOH 1** · auto-reorder if consumed

⚠️ 3 F-304 incidents in 14 days = investigate root cause before next shift.`,
      sources: [
        { title: 'Siemens SINAMICS Diagnostics Guide', ref: 'p.312', date: '' },
        { title: 'Maintenance Log #MK-2026-0418', ref: 'J. Novák · Today', date: '', isNote: true },
        { title: 'Spare parts & inventory', ref: 'ERP snapshot · demo', date: '', isNote: true },
      ],
    },
    {
      trigger: ['p0304', 'parameter', 'rated'],
      markdown: `**Parameter Deep Dive — p0304 & Related Parameters**

For your Siemens 1FK7083-5AF71 on Line 3:

| Parameter | Expected | Actual | Status |
|-----------|----------|--------|--------|
| p0304 (Rated Current) | 12.5 A | 12.5 A | ✅ |
| p0305 (Rated Speed) | 2000 rpm | 2000 rpm | ✅ |
| p0307 (Rated Power) | 4.0 kW | 4.0 kW | ✅ |
| r0027 (Output Current) | < 12.5 A | 13.1 A | ⚠️ |

r0027 shows 13.1 A — slightly above rated. Monitor closely.`,
      sources: [
        { title: 'SINAMICS S120 Parameter Manual', ref: 'p.89–91', date: '' },
        { title: 'CNC Line 3 Commissioning Sheet', ref: 'Jan 2019', date: '' },
      ],
    },
  ],
  kuka: [
    {
      trigger: ['arc', 'drift', 'welding', 'TCP', 'calibration'],
      markdown: `**Welding Arc Drift — Updated Diagnosis**

After reviewing the KR 60-3 incident history:

The recurring arc drift on pass 3 correlates with welding tip change cycles. TCP deviation accumulates ~0.3 mm per tip change if calibration is skipped.

**Recommended protocol change:**
- Mandatory TCP calibration after every tip replacement (adds 4 min to procedure)
- Add tip wear check to daily pre-shift checklist at 80% threshold (current: replace at 95%)

**Upcoming maintenance window**: Schedule 45-min TCP + wire feed inspection before Friday production.`,
      sources: [
        { title: 'KUKA KSS 8.6 Maintenance Guide', ref: 'Ch.7.3', date: '' },
        { title: 'Incident INC-2026-0484', ref: 'Resolved by M. Horváth', date: '', isNote: true },
      ],
    },
  ],
  zund: [
    {
      trigger: ['vacuum', 'pressure', 'zone', 'knife', 'film'],
      markdown: `**Zünd G3 Vacuum System — Zone 3 Follow-up**

Based on the debris clearing yesterday, I've updated the maintenance recommendation:

**Zone 3 shows 3× higher debris accumulation** than zones 1–2 (film-feed path alignment).

**Proposed preventive action:**
- Add Zone 3 vacuum port inspection to pre-shift checklist (5 min)
- Replace sealing strips Q2 2026 (current wear: 73%)
- Knife pressure recalibration recommended — current: 38 daN, optimal: 40–42 daN for this material

📄 I've flagged this for the next maintenance window schedule.`,
      sources: [
        { title: 'Zünd G3 PM Schedule', ref: 'Rev 2.1', date: '' },
        { title: 'Note — P. Kováč', ref: 'Yesterday', date: '', isNote: true },
      ],
    },
    {
      trigger: ['tuning', 'setpoint', 'parameter', 'edge', 'foam', 'quality', 'zone'],
      markdown: `**Vacuum setpoint / process tuning**

For **edge lift** and **zone pressure** adjustments, use small steps and log each change. The latest **peer-approved table** is in the #machine-zund thread (zones 1–3).

I can re-summarize the suggested **−72 / −69 / −70 kPa** path and the **seal strip** procurement flag — say *"summarize zünd tuning"*.`,
      sources: [
        { title: 'Zünd G3 Process Guide', ref: 'Ch.11', date: '' },
        { title: 'Service log (audit trail)', ref: 'required for setpoint changes', date: '', isNote: true },
      ],
    },
  ],
};

const voicePrefills = {
  'machine-siemens': '@kobi The drive is throwing F-304 again — same as last week?',
  'machine-kuka': '@kobi Welding arc keeps drifting on KR 60 — what\'s the most likely cause?',
  'machine-zund': '@kobi Vacuum table is losing pressure in zone 3 — how do I diagnose?',
  general: '@kobi What are the most common issues this week across all machines?',
  incidents: '@kobi Show me the open incidents with highest severity.',
  'docs-drop': '@kobi What documents have been indexed in the last 7 days?',
};

const i18n = {
  en: {
    findChannel: 'Find channel',
    channels: 'Channels',
    directMessages: 'Direct Messages',
    threads: 'Threads',
    writeTo: 'Write to',
    replyToThread: 'Reply to thread',
    addNote: 'Add Note',
    incident: 'Log Incident',
    search: 'Jump to…',
    dashboard: 'Manager Dashboard',
    onPrem: 'On-prem · No cloud',
    viewAs: 'View as',
    technician: 'Technician',
    manager: 'Manager',
    machineCard: 'Machine Card',
    machineStatus: 'Machine Status',
    statusUtilizationTrend: 'Utilization (7 days)',
    statusLiveSignals: 'Live signals',
    statusRecentIncidents: 'Recent incidents',
    assetProfile: 'Asset profile',
    logbook: 'Logbook',
    askKobi: 'Ask Kobi',
    members: 'members',
    pinned: 'Pinned',
    today: 'Today',
    yesterday: 'Yesterday',
    thinking: 'KobiAI is thinking…',
    sources: 'Sources',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit for approval',
    noteSaved: 'Note saved. AI knowledge updated.',
    incidentSubmitted: 'Incident submitted. Awaiting manager approval.',
    indexed: 'Indexed',
    parsing: 'Parsing…',
    dropDocs: 'Drop documents here to feed the AI',
    onPremTitle: 'Your data never leaves this factory.',
    close: 'Close',
    openIncidents: 'Open Incidents',
    mttr: 'MTTR',
    aiQueries: 'AI Queries Today',
    knowledgNotes: 'Knowledge Notes',
    resetDemo: 'Reset Demo',
    breadcrumbWorkspace: 'Bratislava Plant',
    machineOverview: 'Overview',
    machineChat: 'Chat',
    knowledgePanel: 'Knowledge',
    appsBar: 'Integrations',
    intMsTeams: 'Microsoft Teams',
    intMsTeamsDesc: 'Shifts, channels, and calls — embedded like Mattermost with Microsoft.',
    intCmms: 'CMMS',
    intCmmsDesc: 'Work orders and asset history (Fiix / Infor EAM / Maximo style).',
    intErp: 'ERP',
    intErpDesc: 'Orders, stock, and costing (SAP/IFS-style bridge).',
    intMes: 'MES',
    intMesDesc: 'Shop-floor execution, OEE, and line status.',
    intKobi: 'Kobi AI',
    intKobiDesc: 'In-app Kobi direct message and knowledge panel (native, not an iframe).',
    intEmbedHint: 'In production, each tile opens your SSO iframe URL — same app-bar pattern as Mattermost.',
    channelMessages: 'Channel messages',
    wsSwitchMenu: 'Site & lines',
    wsSwitched: 'Site updated',
    wsBrandName: 'KobiAI',
    wsBratislava: 'Bratislava Plant',
    wsBratislavaSub: 'Halls A–C · Press & welding',
    wsKosice: 'Košice Plant',
    wsKosiceSub: 'Assembly · main floor',
    wsTrnava: 'Trnava Finishing',
    wsTrnavaSub: 'Line 4 · cut & pack',
    wsNavBrSi: 'CNC Line 3',
    wsNavBrKu: 'Welding L1',
    wsNavBrZu: 'Cutting',
    wsNavKoKu: 'Weld line 1',
    wsNavKoZu: 'Zünd cell',
    wsNavKoSi: 'CNC (support)',
    wsNavTrZu: 'Zünd (finishing)',
    wsNavTrSi: 'CNC (support)',
    wsNavTrKu: 'Weld (overflow)',
  },
  sk: {
    findChannel: 'Hľadať kanál',
    channels: 'Kanály',
    directMessages: 'Priame správy',
    threads: 'Vlákna',
    writeTo: 'Písať do',
    replyToThread: 'Odpovedať vo vlákne',
    addNote: 'Pridať poznámku',
    incident: 'Zaznamenať incident',
    search: 'Prejsť na…',
    dashboard: 'Manažérsky prehľad',
    onPrem: 'On-prem · Bez cloudu',
    viewAs: 'Zobraziť ako',
    technician: 'Technik',
    manager: 'Manažér',
    machineCard: 'Karta stroja',
    machineStatus: 'Stav stroja',
    statusUtilizationTrend: 'Využitie (7 dní)',
    statusLiveSignals: 'Signály v reálnom čase',
    statusRecentIncidents: 'Nedávne incidenty',
    assetProfile: 'Profil aktíva',
    logbook: 'Logbook',
    askKobi: 'Opýtať Kobi',
    members: 'členov',
    pinned: 'Pripnuté',
    today: 'Dnes',
    yesterday: 'Včera',
    thinking: 'KobiAI premýšľa…',
    sources: 'Zdroje',
    save: 'Uložiť',
    cancel: 'Zrušiť',
    submit: 'Odoslať na schválenie',
    noteSaved: 'Poznámka uložená. Znalostná báza aktualizovaná.',
    incidentSubmitted: 'Incident odoslaný. Čaká sa na schválenie.',
    indexed: 'Indexované',
    parsing: 'Spracovávam…',
    dropDocs: 'Presuňte dokumenty sem pre AI',
    onPremTitle: 'Vaše dáta neopustia závod.',
    close: 'Zavrieť',
    openIncidents: 'Otvorené incidenty',
    mttr: 'MTTR',
    aiQueries: 'AI Dotazy dnes',
    knowledgNotes: 'Poznámky znalostnej bázy',
    resetDemo: 'Resetovať demo',
    breadcrumbWorkspace: 'Závod Bratislava',
    machineOverview: 'Prehľad',
    machineChat: 'Chat',
    knowledgePanel: 'Znalosti',
    appsBar: 'Integrácie',
    intMsTeams: 'Microsoft Teams',
    intMsTeamsDesc: 'Zmeny, kanály, hovory — vložené podobne ako Mattermost s Microsoftom.',
    intCmms: 'CMMS',
    intCmmsDesc: 'Príkazy práce a história aktív.',
    intErp: 'ERP',
    intErpDesc: 'Objednávky, sklad, náklady (SAP/IFS).',
    intMes: 'MES',
    intMesDesc: 'Dielňa, OEE, linky.',
    intKobi: 'Kobi AI',
    intKobiDesc: 'Priama správa a znalostný panel (natívne).',
    intEmbedHint: 'V produkcii otvoríte SSO URL v iframe, ako u Mattermost.',
    channelMessages: 'Správy v kanáli',
    wsSwitchMenu: 'Závod a linky',
    wsSwitched: 'Závod bol zmenený',
    wsBrandName: 'KobiAI',
    wsBratislava: 'Závod Bratislava',
    wsBratislavaSub: 'Haly A–C · lisovanie a zváranie',
    wsKosice: 'Závod Košice',
    wsKosiceSub: 'Montáž · prízemie',
    wsTrnava: 'Dokončovňa Trnava',
    wsTrnavaSub: 'Linka 4 · rezanie a balenie',
    wsNavBrSi: 'CNC linka 3',
    wsNavBrKu: 'Zváranie L1',
    wsNavBrZu: 'Rezanie',
    wsNavKoKu: 'Zváracia linka 1',
    wsNavKoZu: 'Bunka Zünd',
    wsNavKoSi: 'CNC (podpora)',
    wsNavTrZu: 'Zünd (dokončenie)',
    wsNavTrSi: 'CNC (podpora)',
    wsNavTrKu: 'Zváranie (prebytok)',
  },
  de: {
    findChannel: 'Kanal suchen',
    channels: 'Kanäle',
    directMessages: 'Direktnachrichten',
    threads: 'Threads',
    writeTo: 'Schreiben an',
    dashboard: 'Manager Dashboard',
    onPrem: 'On-Premise · Keine Cloud',
    viewAs: 'Ansicht als',
    technician: 'Techniker',
    manager: 'Manager',
    sources: 'Quellen',
    thinking: 'KobiAI denkt…',
    save: 'Speichern',
    cancel: 'Abbrechen',
    today: 'Heute',
    yesterday: 'Gestern',
    close: 'Schließen',
    resetDemo: 'Demo zurücksetzen',
  },
  cz: {
    findChannel: 'Hledat kanál',
    channels: 'Kanály',
    directMessages: 'Přímé zprávy',
    threads: 'Vlákna',
    writeTo: 'Napsat do',
    dashboard: 'Manažerský přehled',
    onPrem: 'On-prem · Bez cloudu',
    viewAs: 'Zobrazit jako',
    technician: 'Technik',
    manager: 'Manažer',
    sources: 'Zdroje',
    thinking: 'KobiAI přemýšlí…',
    save: 'Uložit',
    cancel: 'Zrušit',
    today: 'Dnes',
    yesterday: 'Včera',
    close: 'Zavřít',
    resetDemo: 'Resetovat demo',
  },
  pl: {
    findChannel: 'Znajdź kanał',
    channels: 'Kanały',
    directMessages: 'Wiadomości bezpośrednie',
    threads: 'Wątki',
    writeTo: 'Pisz do',
    dashboard: 'Panel menedżera',
    onPrem: 'On-prem · Bez chmury',
    viewAs: 'Widok jako',
    technician: 'Technik',
    manager: 'Menedżer',
    sources: 'Źródła',
    thinking: 'KobiAI myśli…',
    save: 'Zapisz',
    cancel: 'Anuluj',
    today: 'Dzisiaj',
    yesterday: 'Wczoraj',
    close: 'Zamknij',
    resetDemo: 'Zresetuj demo',
  },
};

/** Public sample PDF for demo previews (all “manual” PDFs open this in the prototype). */
const DEMO_PDF_URL = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';

function mediaPreviewForFile(fileLike) {
  if (!fileLike) return null;
  if (fileLike.previewUrl) {
    const kind = fileLike.previewKind || (/\.(png|jpe?g|gif|webp|svg)$/i.test(String(fileLike.name)) ? 'image' : 'pdf');
    return { kind, src: fileLike.previewUrl, title: fileLike.name || 'Document' };
  }
  const name = typeof fileLike === 'string' ? fileLike : fileLike.name;
  if (!name) return null;
  const lower = name.toLowerCase();
  if (lower.endsWith('.pdf')) return { kind: 'pdf', src: DEMO_PDF_URL, title: name };
  if (/\.(png|jpe?g|gif|webp|svg)$/i.test(name)) {
    const seed = String(name).replace(/[^a-z0-9]/gi, '').slice(0, 32) || 'img';
    return { kind: 'image', src: `https://picsum.photos/seed/${encodeURIComponent(seed)}/1600/1000`, title: name };
  }
  return null;
}

function mediaPreviewForSource(s) {
  if (!s) return null;
  if (s.previewUrl) return { kind: s.previewKind || 'pdf', src: s.previewUrl, title: s.title || 'Source' };
  if (/\.(pdf|png|jpe?g|gif|webp|svg)$/i.test(s.title || '')) return mediaPreviewForFile({ name: s.title });
  if (s.openAs === 'pdf') return { kind: 'pdf', src: DEMO_PDF_URL, title: s.title || 'Document' };
  if (s.openAs === 'image') {
    const seed = `src-${(s.title || '').length}`;
    return { kind: 'image', src: `https://picsum.photos/seed/${encodeURIComponent(seed)}/1400/900`, title: s.title || 'Image' };
  }
  return null;
}

return {
  users, channels, machines, machineOperational, workspaces, integrationApps, conversations, incidents, dashboardKPIs, aiQueryData, mttrData, knowledgeData, incidentsByMachine, predictiveAlerts, botResponses, voicePrefills, i18n,
  getWorkspaceById, getFirstMachineSlugForWorkspace, buildMachineNavEntries,
  DEMO_PDF_URL, mediaPreviewForFile, mediaPreviewForSource,
};
})();
