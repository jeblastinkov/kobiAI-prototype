// Slovak localized mock data — patches EN seed content by stable IDs
(function () {
  const d = window.KobiData;
  if (!d) return;

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function patchMessages(messages, patches) {
    return messages.map((m) => (patches[m.id] ? { ...m, ...patches[m.id] } : m));
  }

  const generalPatches = {
    g1: { time: 'Včera 08:00', text: 'Vitajte v **KobiKan · Závod Bratislava**. Som váš AI asistent údržby. Opýtajte sa ma na čokoľvek o strojoch, zaznamenajte incidenty príkazom `/incident`, vložte dokumenty do `#docs-drop` a otvorte kanál stroja pre kontextovú pomoc. Všetko zostáva vo vašom závode.' },
    g2: { text: 'Upozornenie — KR 60 mal včera odchýlku zváracieho oblúka, vyriešené. Vlákno v #incidents.' },
    g3: { text: 'Dnes ráno nahrané nové dokumenty Zünd. KobiKan dokončil indexáciu za 18 sekúnd. 👀', threadPreview: { userId: 'kobi', text: '📄 Prijaté „Zünd_G3_Manual_EN.pdf“ (412 strán). Spracované. 1 034 chunkov indexovaných. 23 diagramov extrahovaných. Dostupné v #machine-zund-g3.' } },
    g5: { text: '**Kaskáda linky:** Zünd v hale C mešká ~40 min — upstream CNC v #machine-siemens bol v plánovanej PM do 11:00. Zváranie v #machine-kuka je voľné; rezanie by malo dobehnúť po obede. Pre MES bilanciu linky.' },
    g6: { text: '@kobi Dostali sme foto zvláštneho alarmu pohonu od zákazníka — nie je v OEM zozname. Nejaká triáž pred formalným ticketom?' },
    g7: {
      markdown: `**Neuvedený alarm typu SINAMICS — triáž (najprv OEM, potom komunita)**

Skontroloval som **OEM zoznamy chýb** pre vašu zostavu (presná zhoda nie je). Z **indexovaných neoficiálnych zdrojov** (fóra, DIY návody) — *iba nápady*; vždy **overte** podľa OEM a vášho bezpečnostného procesu:

1. **PracticalMachinist vlákna (fiktívne):** „falošný stall“ pri uvoľnenom **stínení kábla enkodéra** pri X411 — znovu dotiahnuť podľa diagramu.
2. **hobby-CNC technická poznámka (fiktívna):** vlhkosť / opätovné zapojenie **Control Unit** po dlhom odstavení — *menej pravdepodobné* vo vašej klimatizovanej hale.

**Oficiálny baseline:** SINAMICS S120 príručka chýb (zdroj pravdy pre príkazy práce).`,
    },
    g8: { text: 'Nočná zmena sa pýtala: Kobi som dotazoval v **slovenčine**; OEM PDF sú len **DE/EN** — odpoveď prišla v **SK** so správnymi referenciami. Realita CEE dielne.' },
    g4: { text: 'Pripomienka — odovzdanie zmeny o 14:00.' },
  };

  const siemensPatches = {
    s1: { text: '@kobi Pohon hlási chybu F-304 — čo znamená a ako to opravím?' },
    s2: {
      markdown: `**Chyba F-304 — Nadprúd v motorovom module**

Motorový modul zaznamenal prúd nad nastavenou hranicou. Bežné príčiny:

1. **Skrat** v kábli motora alebo vinutí
2. **Nesprávne parametre motora** (p0304, p0305)
3. **Mechanické preťaženie** — vreteno zablokované alebo pod nadmernou záťažou

**Okamžité kroky:**
1. Stlačte RESET na riadiacej jednotke CU320-2
2. Skontrolujte kábel na svorkách U, V, W
3. Zmerajte odpor vinutia (očakávané 2,1–2,5 Ω / fáza)
4. Overte p0304 = 12,5 A (typový štítok)

⚠️ Ak odpor < 1,0 Ω, vinutie motora je poškodené — nereštartujte.`,
      diagram: { label: '📊 Zapojovací diagram — Obr. 8.14 (pripojenie motorového modulu)' },
    },
    s3: { text: '@kobi Ktorá súčiastka je referencovaná v parametri p0304?' },
    s4: {
      markdown: `**Parameter p0304 — Menovitý prúd motora**

Definuje menovitý prúd pripojeného motora v ampéroch. Pre vašu jednotku (Siemens 1FK7083-5AF71):

- Typový štítok: **12,5 A**
- Nakonfigurované: **12,5 A** ✅
- Umiestnenie: Drive object DO3, slot motorového modulu 4

Ak sa nezhoduje s typovým štítkom motora, F-304 môže vypnúť pri normálnej záťaži.`,
    },
    s5: { text: '@kobi Aká je reštartovacia sekvencia po prerušení remena na tomto stroji?' },
    s6: {
      markdown: `**Obnova po prerušení remena — Siemens S7-1500 CNC (Linka 3)**

1. **Núdzové zastavenie** — potvrďte E-STOP (červená huba, panel vľavo)
2. **Otvorte dvere krytu** — počkajte na zastavenie vretena (≤30 s)
3. **Skontrolujte remeň** — stav, napínacia kladka, nečistoty
4. **Vymeňte remeň** — diel **3M-225-6** (polica B3-12)
5. **Reset sekvencia**: uvoľnite E-STOP · RESET na ovládacom paneli · spustite \`G28 U0 W0\` · potvrďte žiadne alarmy
6. **Testovací rez** — spustite program \`O0001\` pred výrobou

💡 *Tip od technika J. Nováka (12. mar 2026): Po výmene remena na tomto stroji vždy dotiahnite na **4,5 N** pomocou merača Gates. Továrenská špecifikácia hovorí 4,0 N, ale pri vysokom posuve kĺže.*`,
    },
    s7: { text: '@kobi F-304 len po **teplom štarte** po prerušení — nikdy ráno za studena. Pôsobí prerušované. Čo máme logovať?' },
    s8: {
      markdown: `**Prerušovaný F-304 (teplý / nábehový vzor)**

OEM text pokrýva **ustálený** F-304. Pri **popoludňajších** výpadkoch som našiel náš interný log + jeden **komunitný článok** (fiktívny fórum index) — *potvrďte pred konaním*:

| Kontrola | Riziko |
|----------|--------|
| Kábel motora v energy reťazi — praskliny izolácie pri zahriatí | Stredné |
| Trenie ložísk pri zahriatí | Stredné |
| Ventilátor modulu / prúdenie vzduchu po niekoľkých hodinách | Vysoké |

**Ďalej:** Logovať studený vs. horúci odpor vinutia; porovnať s baseline o 08:00.

**Náhradné diely (demo):** Motor **1FK7083-5AF71** — **polica D2-04 · QOH 1** · Remeň **3M-225-6** — **B3-12 · QOH 4**`,
    },
  };

  const kukaPatches = {
    k1: { text: '@kobi Zvárací oblúk KR 60 driftuje na priechode 3 — aká je najpravdepodobnejšia príčina?' },
    k2: {
      markdown: `**Odchýlka zváracieho oblúka — Diagnóza KUKA KR 60-3**

Najčastejšie príčiny odchýlky oblúka na priechode 3:

1. **Odchýlka TCP (Tool Centre Point)** — po výmene hrotu bez rekalibrácie. Drift typicky 0,5–2 mm.
2. **Opotrebovaný zvárací hrot** — opotrebenie kontaktnej trubice spôsobuje nestabilitu oblúka. Kontrola pri >87 % duty cycle.
3. **Nekonzistentné podávanie drôtu** — napätie cievky a stav lineru
4. **Posun upínacieho zariadenia** — overte moment upínacích skrutiek a referenčné body

**Odporúčaná prvá akcia**: Spustite kalibračnú rutinu \`$TOOL_CAL[1]\` z KRC4 pendantu. Trvá ~4 minúty.`,
    },
    k3: { text: '@kobi Ako bezpečne spustiť kalibráciu TCP s otvoreným bezpečnostným plotom?' },
    k4: {
      markdown: `**Kalibrácia TCP — Postup bezpečnostného override**

⚠️ **Bezpečnosť na prvom mieste** — tento postup vyžaduje T1 (manuálna redukovaná rýchlosť ≤250 mm/s).

1. Nastavte režim KRC4 na **T1** (prepínač kľúča)
2. Potvrďte override bezpečnostného plotu na pendante: \`Safety → Ext. Area → Acknowledge\`
3. Aktivujte enabling switch (3-polohový) — držte strednú polohu počas celého postupu
4. Navigácia: \`Menu → Startup → Calibrate → Tool → ABC World\`
5. Dotknite sa referenčného bodu 4× z rôznych orientácií
6. Akceptujte výsledok ak odchýlka < 0,15 mm

**NEPOUŽÍVAJTE T2 ani AUT režim pri kalibrácii s otvoreným plotom.**`,
    },
    k5: { text: 'Zarovnanie oblúka potvrdené po TCP rekalibrácii. Bežia testovacie zvary — vyzerá dobre.' },
  };

  const zundPatches = {
    z1: { text: '@kobi Vákuový stôl stráca tlak v zóne 3 — ako diagnostikovať?' },
    z2: {
      markdown: `**Strata tlaku vákuového stola — Diagnostika zóny 3 (Zünd G3)**

Postup izolácie krok za krokom:

1. **Skontrolujte ventil zóny** — Zünd Cut Center → Diagnostics → Vacuum → stav ventilu zóny 3. Mal by byť OPEN pri rezaní.
2. **Skontrolujte tesniace pásy** — opotrebované tesnenie okraja umožňuje únik. Pri aktívnom stole prejdite rukou po okraji.
3. **Upchatie nečistotami** — pena alebo odrezky môžu blokovať otvory. Vyčistite stlačeným vzduchom (max 60 PSI).
4. **Kontrola kapacity čerpadla** — ak aj zóny 1–2 degradujú, filter čerpadla môže byť nasýtený (výmena každých 500 h).

📊 Očakávaný tlak: **≥ −68 kPa** v zóne 3 počas aktívneho rezu.`,
    },
    z3: { text: '@kobi Našiel som nečistoty v otvoroch zóny 3. Vyčistené. Tlak späť na −71 kPa. Ďakujem.' },
    z4: {
      markdown: `Výborne — −71 kPa je nominálne. Toto riešenie som zaznamenal do histórie údržby Zünd G3.

💡 *Tip: Zóna 3 je priamo pod dráhou podávania fólie — zhromažďuje viac nečistôt ako zóny 1–2. Zvážte pridanie do denného predzmenovacieho checklistu.*`,
    },
    z5: { text: '@kobi Fólia na rolke praskla — aká je **reštartovacia** sekvencia pre Zünd, aby sme nepoškvrnili ďalší list?' },
    z6: {
      markdown: `**Prerušenie fólie / web — Procedurálny reštart Zünd G3**

1. Zastavte podávanie, zdvihnite nôž, vyčistite dráhu
2. Znovu navlečte podľa **Operator Manual §6.2** — pomaly zvyšujte **napätie** (vyhnite sa prasknutiu)
3. **Test** na rohu odpadu pred dobrým materiálom
4. Zapínajte **vákuové zóny** postupne 1 → 2 → 3

**Kontext linky:** Rovnaká disciplína ako **CNC linka 3** po udalosti **remena** — usporiadaný reset udrží **#machine-kuka** bez polovičných súprav. Pozrite vlákno obnovy remena v #machine-siemens.

**Spotrebný materiál (demo):** Pružina napínania **ZND-4412** — **polica C2-01 · QOH 6**`,
    },
    z7: { text: '@kobi Kvalita chce menej zdvíhania hrany na **hrubej pene** — naladiť vákuové setpointy pred spomalením noža?' },
    z8: {
      markdown: `**Ladenie vákuových zón (proces / kvalita)**

| Zóna | Teraz | Navrhované | Poznámka |
|------|-------|------------|----------|
| 1 | −70 kPa | **−72 kPa** | Viac držania na vedúcej hrane |
| 2 | −69 kPa | −69 kPa | OK |
| 3 | −66 kPa | **−70 kPa** | Zodpovedá hláseniu zdvíhania hrany |

**Ako:** Cut Center → **Process → Vacuum → Advanced** — menite jednu zónu, ~2 % kroky, **5 dobrých rezov** medzi zmenami.

**Logujte každú zmenu** v servisnom zázname pre audit. Vráťte späť ak klesne OEE.

📦 *Súvisiace spotrebné materiály:* tesniace pásy objednané — **QOH 0** (ETA piatok); oznamujem obstarávaniu.`,
    },
  };

  const docsDropPatches = {
    dd4: {
      markdown: `**Hlasový servisný záznam (demo)** — Prepísané a štruktúrované z audio z dielne

- **Stroj:** Siemens S7-1500 CNC · \`#machine-siemens\`
- **Súčiastka:** Motorový modul / dráha remena
- **Práce:** Vymenený remeň **3M-225-6** · napätie **4,5 N** (Gates merač) · testovací rez OK
- **Operátor:** @jozef · Zmena A
- **Prepojené:** INC-2026-0487

_Hands-free záznam → normalizované polia pre CMMS / servisnú históriu (prototyp)._`,
    },
  };

  const conversationsSk = {
    general: patchMessages(d.conversations.general, generalPatches),
    'machine-siemens': patchMessages(d.conversations['machine-siemens'], siemensPatches),
    'machine-kuka': patchMessages(d.conversations['machine-kuka'], kukaPatches),
    'machine-zund': patchMessages(d.conversations['machine-zund'], zundPatches),
    'docs-drop': patchMessages(d.conversations['docs-drop'], docsDropPatches),
    incidents: [],
  };

  const incidentPatches = {
    'INC-2026-0482': { issue: 'Varovanie napätia remena', opened: 'pred 3 dňami', resolved: 'pred 2 dňami', notes: 'Zistená mierna odchýlka tlaku — dotiahnuté a vyčistená dráha.' },
    'INC-2026-0483': { issue: 'F-304 Nadprúd', opened: 'pred 2 dňami', resolved: 'pred 2 dňami', notes: 'Nízky odpor vinutia na fáze V. Motor vymenený.' },
    'INC-2026-0484': { issue: 'Upozornenie kalibrácie TCP', opened: 'pred 2 dňami', resolved: 'pred 2 dňami', notes: 'Odchýlka TCP 1,2 mm po výmene hrotu. Rekalibrované.' },
    'INC-2026-0485': { issue: 'Odchýlka kalibrácie senzora', opened: 'Včera', notes: 'SICK IME30 senzor driftuje ±3 mm. Diel **IME30-15BPSZT0** — **polica E1-08 · QOH 2** (objednať pri min 1).' },
    'INC-2026-0486': { issue: 'Nezarovnanie zváracieho oblúka', opened: 'Dnes 08:45', notes: 'Drift oblúka diagnostikovaný na odchýlku TCP. Prebieha rekalibrácia.' },
    'INC-2026-0487': { issue: 'Opakovaný F-304 Nadprúd', opened: 'Dnes 09:14', notes: 'Remeň praskol počas rezu. Vymenený 3M-225-6, napätie 4,5 N.' },
  };

  const incidentsSk = d.incidents.map((inc) => ({ ...inc, ...(incidentPatches[inc.id] || {}) }));

  const predictiveAlertsSk = d.predictiveAlerts.map((a) => {
    const msgs = {
      a1: 'Opotrebenie zváracieho hrotu na 87 % — naplánovať výmenu do 2 zmien',
      a2: 'Vibračný vzor zodpovedá pred-zlyhaniu z októbra 2025',
      a3: '3 podobné incidenty F-304 za 14 dní — možná degradácia motora',
      a4: 'Klastre prerušovaného F-304 po teplom štarte — pozrite vlákno v #machine-siemens',
    };
    return msgs[a.id] ? { ...a, message: msgs[a.id] } : a;
  });

  const machineOperationalSk = deepClone(d.machineOperational);
  const kpiLabelsSk = { OEE: 'OEE', Availability: 'Dostupnosť', 'Active alarms': 'Aktívne alarmy', 'Shift runtime': 'Runtime zmeny', 'Last stop': 'Posledné zastavenie', 'Zone 3 vacuum': 'Vákuum zóna 3' };
  const daySk = { Mon: 'Po', Tue: 'Ut', Wed: 'St', Thu: 'Št', Fri: 'Pi', Sat: 'So', Sun: 'Ne' };
  const signalValSk = { 'RESET req.': 'RESET pož.', Elevated: 'Zvýšené', 'Replace soon': 'Vymeňte čoskoro' };
  const signalLblSk = { ok: 'OK', warn: 'Var', alarm: 'Alarm' };

  Object.keys(machineOperationalSk).forEach((mid) => {
    const op = machineOperationalSk[mid];
    op.kpis.forEach((k) => { if (kpiLabelsSk[k.label]) k.label = kpiLabelsSk[k.label]; });
    op.trendUtilization.forEach((t) => { if (daySk[t.day]) t.day = daySk[t.day]; });
    op.signals.forEach((s) => { if (signalValSk[s.value]) s.value = signalValSk[s.value]; });
  });

  const voicePrefillsSk = {
    'machine-siemens': '@kobi Pohon znova hlási F-304 — rovnako ako minulý týždeň?',
    'machine-kuka': '@kobi Zvárací oblúk na KR 60 stále driftuje — aká je najpravdepodobnejšia príčina?',
    'machine-zund': '@kobi Vákuový stôl stráca tlak v zóne 3 — ako diagnostikovať?',
    general: '@kobi Aké sú najčastejšie problémy tento týždeň naprieč všetkými strojmi?',
    incidents: '@kobi Ukáž mi otvorené incidenty s najvyššou závažnosťou.',
    'docs-drop': '@kobi Ktoré dokumenty boli indexované za posledných 7 dní?',
  };

  const knowledgePanelSk = {
    indexedDocs: [
      { name: 'Siemens_SINAMICS_S120_FaultManual.pdf', machine: 'Siemens S7-1500', pages: 247, date: '12. mar 2026' },
      { name: 'KUKA_Software_KSS_8.6.pdf', machine: 'KUKA KR 60-3', pages: 312, date: '5. feb 2026' },
      { name: 'Zund_G3_Operator_Manual_EN.pdf', machine: 'Zünd G3', pages: 412, date: 'pred 2 dňami' },
      { name: 'Machine_Config_CNC_Line3.pdf', machine: 'Siemens S7-1500', pages: 14, date: '8. jan 2026' },
      { name: 'Plant_Safety_SOP-042.pdf', machine: 'Všetky', pages: 38, date: '15. jan 2026' },
      { name: 'KUKA_KR60_System_Manual_v4.pdf', machine: 'KUKA KR 60-3', pages: 461, date: 'pred 3 dňami' },
    ],
    myNotes: [
      { text: 'Po výmene dotiahnuť remeň na 4,5 N (továrenská špecifikácia 4,0 N kĺže)', machine: 'Siemens S7-1500', date: 'Dnes', by: 'J. Novák' },
      { text: 'Vákuové otvory zóny 3 sa upchávajú 3× rýchlejšie — pridať do predzmenovacej kontroly', machine: 'Zünd G3', date: 'Včera', by: 'P. Kováč' },
      { text: 'Kalibrácia TCP povinná po každej výmene zváracieho hrotu (+4 min)', machine: 'KUKA KR 60-3', date: '5. feb 2026', by: 'M. Horváth' },
    ],
    gaps: [
      { text: 'Zünd G3 — elektrická schéma v2.3 nie je indexovaná', machine: 'Zünd G3' },
      { text: 'KUKA KR 60 — chýbajú release notes firmware v4.1', machine: 'KUKA KR 60-3' },
      { text: 'Siemens S7-1500 — postup výmeny motora nenájdený', machine: 'Siemens S7-1500' },
    ],
  };

  const dashboardIncidentsSk = [
    { time: 'Dnes 09:14', machine: 'Siemens S7-1500', issue: 'F-304 Nadprúd', status: 'resolved', resolvedBy: 'J. Novák' },
    { time: 'Dnes 08:45', machine: 'KUKA KR 60-3', issue: 'Nezarovnanie zváracieho oblúka', status: 'in-progress', resolvedBy: 'M. Horváth' },
    { time: 'Včera', machine: 'Zünd G3 Cutting', issue: 'Varovanie napätia remena', status: 'resolved', resolvedBy: 'P. Kováč' },
    { time: 'Včera', machine: 'Conveyor L4', issue: 'Odchýlka kalibrácie senzora', status: 'open', resolvedBy: '—' },
    { time: 'pred 2 dňami', machine: 'KUKA KR 60-3', issue: 'Upozornenie kalibrácie TCP', status: 'resolved', resolvedBy: 'M. Horváth' },
  ];

  const machinesSk = deepClone(d.machines);
  Object.assign(machinesSk.siemens, { type: 'CNC obrábacie centrum', location: 'Hala A, Linka 3', lastIncident: 'pred 2 dňami' });
  Object.assign(machinesSk.kuka, { type: 'Zvárací robot', location: 'Hala B, Linka 1', lastIncident: 'Včera' });
  Object.assign(machinesSk.zund, { type: 'Digitálny rezací systém', location: 'Hala C', lastIncident: 'pred 3 dňami' });

  function getLocalizedBundle(lang) {
    const isSk = lang === 'sk';
    return {
      conversations: isSk ? conversationsSk : d.conversations,
      incidents: isSk ? incidentsSk : d.incidents,
      predictiveAlerts: isSk ? predictiveAlertsSk : d.predictiveAlerts,
      machineOperational: isSk ? machineOperationalSk : d.machineOperational,
      voicePrefills: isSk ? voicePrefillsSk : d.voicePrefills,
      knowledgePanel: isSk ? knowledgePanelSk : null,
      dashboardIncidents: isSk ? dashboardIncidentsSk : null,
      machines: isSk ? machinesSk : d.machines,
    };
  }

  function statusLabel(status, t) {
    const key = `status_${String(status).replace(/-/g, '_')}`;
    return t(key) || status;
  }

  Object.assign(d, {
    conversationsSk,
    incidentsSk,
    predictiveAlertsSk,
    machineOperationalSk,
    voicePrefillsSk,
    knowledgePanelSk,
    getLocalizedBundle,
    statusLabel,
  });
})();
