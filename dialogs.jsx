// KobiKan Dialogs v2 — AddNote, Incident (Run-details style), OnPrem, Search, Toast

const { useState, useEffect } = React;

/* ─── shared primitives ─── */

function Modal({ title, subtitle, width = 540, onClose, children, footer }) {
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return React.createElement('div', {
    style: { position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:20 },
    onClick: e => { if (e.target===e.currentTarget) onClose(); }
  },
    React.createElement('div', { style:{background:'#fff',borderRadius:14,width:'100%',maxWidth:width,boxShadow:'0 24px 64px rgba(0,0,0,0.22)',display:'flex',flexDirection:'column',maxHeight:'92vh',overflow:'hidden'} },
      React.createElement('div', { style:{padding:'18px 22px 14px',borderBottom:'1px solid #EBEEF2',display:'flex',alignItems:'flex-start',justifyContent:'space-between'} },
        React.createElement('div', null,
          React.createElement('div', { style:{fontWeight:800,fontSize:17,color:'#1A2433'} }, title),
          subtitle && React.createElement('div', { style:{fontSize:12,color:'#8B97A3',marginTop:3} }, subtitle)
        ),
        React.createElement('button', { onClick:onClose, style:{background:'none',border:'none',cursor:'pointer',color:'#8B97A3',fontSize:22,lineHeight:1,padding:2} }, '×')
      ),
      React.createElement('div', { style:{flex:1,overflowY:'auto',padding:'20px 22px'} }, children),
      footer && React.createElement('div', { style:{padding:'14px 22px',borderTop:'1px solid #EBEEF2',display:'flex',gap:10,justifyContent:'flex-end',alignItems:'center'} }, footer)
    )
  );
}

function Field({ label, required, hint, children }) {
  return React.createElement('div', { style:{marginBottom:18} },
    React.createElement('label', { style:{display:'block',fontSize:13,fontWeight:700,color:'#1A2433',marginBottom:6} },
      label, required && React.createElement('span', { style:{color:'#F44336',marginLeft:2} }, '*'),
      hint && React.createElement('span', { style:{fontWeight:400,color:'#9BA8B4',marginLeft:6,fontSize:12} }, hint)
    ),
    children
  );
}

function VoiceTextArea({ value, onChange, placeholder, rows=4, voiceText }) {
  const I = window.Icons;
  const [recording, setRecording] = useState(false);
  const handleVoice = () => {
    if (recording) return;
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      let i=0; const iv=setInterval(() => { onChange(voiceText.slice(0,++i)); if(i>=voiceText.length) clearInterval(iv); }, 25);
    }, 2000);
  };
  return React.createElement('div', { style:{position:'relative'} },
    React.createElement('textarea', { value, onChange:e=>onChange(e.target.value), placeholder, rows,
      style:{width:'100%',padding:'10px 40px 10px 12px',border:'1px solid #C5D0DB',borderRadius:10,fontSize:14,color:'#1A2433',resize:'vertical',fontFamily:'inherit',lineHeight:1.6,boxSizing:'border-box',outline:'none',background:'#FAFBFC'} }),
    React.createElement('button', { type:'button', onClick:handleVoice,
      style:{position:'absolute',right:10,top:10,background:recording?'#FEE2E2':'#F3F4F6',border:'none',cursor:'pointer',padding:'5px 6px',borderRadius:7,color:recording?'#F44336':'#6B7280',transition:'all 0.2s',display:'flex',alignItems:'center'} },
      recording ? (I && I.record(18, '#F44336')) : (I && I.mic(18, '#6B7280')))
  );
}

function SegCtrl({ options, value, onChange }) {
  return React.createElement('div', { style:{display:'flex',gap:0,border:'1px solid #C5D0DB',borderRadius:10,overflow:'hidden',background:'#F7F9FB'} },
    options.map(opt => React.createElement('button', { key:opt.value, onClick:()=>onChange(opt.value),
      style:{flex:1,padding:'9px 12px',border:'none',cursor:'pointer',fontSize:13,fontWeight:600,background:value===opt.value?(opt.color||'#4d0a52'):'transparent',color:value===opt.value?'#fff':'#555',transition:'all 0.15s'} },
      opt.label))
  );
}

/* ─── AddNote dialog ─── */

function AddNoteDialog({ machine, onSave, onClose }) {
  const { t, language } = useKobi();
  const I = window.Icons;
  const [category, setCategory] = useState('Repair');
  const [text, setText] = useState('');
  const [severity, setSeverity] = useState('info');
  const [photo, setPhoto] = useState(false);
  const voiceText = language === 'sk'
    ? 'Vymenený remeň 3M-225-6. Dotiahnuté na 4,5 N — továrenská špecifikácia hovorí 4, ale pri vysokom posuve kĺže. Potvrdené testovacím rezom O0001.'
    : 'Replaced timing belt 3M-225-6. Re-tensioned to 4.5 N — factory spec says 4 but it slips under high feed. Confirmed with test cut O0001.';
  const categories = [
    { v: 'Repair', l: t('catRepair') },
    { v: 'Observation', l: t('catObservation') },
    { v: 'Tip', l: t('catTip') },
    { v: 'Incident note', l: t('catIncidentNote') },
  ];

  return React.createElement(Modal, { title: React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 10 } }, I && I.brain(20, '#4d0a52'), t('addNoteTitle')), subtitle: t('addNoteSubtitle'), onClose,
    footer: React.createElement(React.Fragment, null,
      React.createElement('button', { onClick:onClose, style:{padding:'9px 18px',border:'1px solid #C5D0DB',borderRadius:9,background:'#fff',cursor:'pointer',fontSize:13,color:'#555'} }, t('cancel')),
      React.createElement('button', { onClick:()=>{ if(text.trim()) onSave({text:text.trim(),category,severity}); }, disabled:!text.trim(),
        style:{padding:'9px 22px',background:text.trim()?'#4d0a52':'#C5D0DB',border:'none',borderRadius:9,color:'#fff',fontWeight:700,cursor:text.trim()?'pointer':'default',fontSize:13} }, t('save'))
    )
  },
    React.createElement(Field, { label: t('fieldMachine') },
      React.createElement('div', { style:{display:'inline-flex',alignItems:'center',gap:8,background:'#F3EAF5',border:'1px solid #C9A8D0',borderRadius:8,padding:'6px 14px',fontSize:14,color:'#4d0a52',fontWeight:600} },
        window.Icons && window.Icons.gear(16,'#4d0a52'),
        machine?.name || t('currentMachine')
      )
    ),
    React.createElement(Field, { label: t('fieldCategory') },
      React.createElement('select', { value:category, onChange:e=>setCategory(e.target.value),
        style:{width:'100%',padding:'10px 12px',border:'1px solid #C5D0DB',borderRadius:10,fontSize:14,color:'#1A2433',background:'#FAFBFC',outline:'none'} },
        categories.map(c=>React.createElement('option',{key:c.v,value:c.v},c.l)))
    ),
    React.createElement(Field, { label: t('fieldWhatHappened'), required:true, hint: t('fieldWhatHint') },
      React.createElement(VoiceTextArea, { value:text, onChange:setText, placeholder: t('describePlaceholder'), rows:4, voiceText })
    ),
    React.createElement(Field, { label: t('fieldSeverity') },
      React.createElement(SegCtrl, { value:severity, onChange:setSeverity,
        options:[{value:'info',label:t('sevInfo'),color:'#1E88E5'},{value:'warning',label:t('sevWarning'),color:'#FB8C00'},{value:'critical',label:t('sevCritical'),color:'#E53935'}] })
    ),
    React.createElement(Field, { label: t('fieldPhoto') },
      !photo
        ? React.createElement('button', { type:'button', onClick:()=>setPhoto(true), style:{padding:'8px 16px',border:'1.5px dashed #C5D0DB',borderRadius:9,background:'#FAFBFC',cursor:'pointer',fontSize:13,color:'#6B8EAE',display:'inline-flex',alignItems:'center',gap:8} }, I && I.camera(16, '#6B8EAE'), t('attachPhoto'))
        : React.createElement('div', { style:{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',background:'#F3EAF5',border:'1px solid #C9A8D0',borderRadius:9} },
            React.createElement('div', { style:{width:44,height:32,background:'repeating-linear-gradient(45deg,#C9A8D0,#C9A8D0 2px,#EDE0EF 2px,#EDE0EF 6px)',borderRadius:5} }),
            React.createElement('span', { style:{fontSize:13,color:'#4d0a52'} }, 'IMG_20260420_104532.jpg'),
            React.createElement('button', { onClick:()=>setPhoto(false), style:{marginLeft:'auto',background:'none',border:'none',cursor:'pointer',color:'#9BA8B4',fontSize:16} }, '×')
          )
    )
  );
}

/* ─── Incident form (shared: modal + right slide panel) ─── */

function IncidentFormContent({ machine, onSubmit, onClose }) {
  const { t, role, language } = useKobi();
  const I = window.Icons;
  const [tab, setTab] = useState('details');
  const [form, setForm] = useState({
    location:'', description:'', severity:'warning',
    component:'', resolution:'Repaired', resolutionNotes:'', resolutionType:'Permanent', parts:[],
    owner: role === 'manager' ? 'Martin Horváth' : 'Jozef Novák',
  });
  const [tasks, setTasks] = useState(() => language === 'sk' ? [
    { id:1, label:'Bezpečnostná kontrola dokončená',         done:false },
    { id:2, label:'Identifikovaná hlavná príčina',           done:false },
    { id:3, label:'Požadované diely dostupné',        done:false },
    { id:4, label:'Oprava / výmena dokončená',  done:false },
    { id:5, label:'Testovací beh OK',                 done:false },
    { id:6, label:'Supervízor informovaný',             done:false },
  ] : [
    { id:1, label:'Safety check completed',         done:false },
    { id:2, label:'Root cause identified',           done:false },
    { id:3, label:'Required parts available',        done:false },
    { id:4, label:'Repair / replacement completed',  done:false },
    { id:5, label:'Test run passed',                 done:false },
    { id:6, label:'Supervisor notified',             done:false },
  ]);
  const setField = (k,v) => setForm(f=>({...f,[k]:v}));
  const toggleTask = id => setTasks(ts => ts.map(t => t.id===id ? {...t,done:!t.done} : t));
  const doneTasks = tasks.filter(t=>t.done).length;

  const voiceDesc = language === 'sk'
    ? 'Remeň praskol počas rezu na osi 3. Stroj zastavil. Bez zranenia. Remeň vymenený 3M-225-6, napätie 4,5 N. Testovací rez O0001 OK.'
    : 'Timing belt snapped mid-cut on axis 3. Machine stopped. No injury. Belt replaced with 3M-225-6, tension 4.5 N. Test cut O0001 passed.';
  const voiceRes  = language === 'sk'
    ? 'Remeň vymenený a dotiahnutý na 4,5 N. Stroj späť v prevádzke. Testovací rez v norme.'
    : 'Belt replaced and tensioned to 4.5 N. Machine back in service. Test cut nominal.';

  const participants = [
    {initials:'JN',color:'#2E7D32'},{initials:'MH',color:'#1565C0'},{initials:'PK',color:'#6A1B9A'}
  ];

  return React.createElement('div', { style: { minWidth: 0 } },
    /* Owner + Participants row */
    React.createElement('div', { style:{display:'flex',gap:24,marginBottom:20,padding:'14px 16px',background:'#F7F9FB',borderRadius:12,border:'1px solid #EBEEF2'} },
      React.createElement('div', null,
        React.createElement('div', { style:{fontSize:11,fontWeight:700,color:'#9BA8B4',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8} }, t('owner')),
        React.createElement('div', { style:{display:'flex',alignItems:'center',gap:8,background:'#fff',border:'1px solid #C5D0DB',borderRadius:20,padding:'5px 12px',fontSize:13,fontWeight:600,color:'#1A2433'} },
          React.createElement('div', { style:{width:24,height:24,borderRadius:'50%',background:role==='manager'?'#1565C0':'#2E7D32',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#fff',fontWeight:700} }, role==='manager'?'MH':'JN'),
          form.owner
        )
      ),
      React.createElement('div', null,
        React.createElement('div', { style:{fontSize:11,fontWeight:700,color:'#9BA8B4',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8} }, t('participants')),
        React.createElement('div', { style:{display:'flex',alignItems:'center',gap:4} },
          participants.map((p,i) => React.createElement('div', { key:i, style:{width:30,height:30,borderRadius:'50%',background:p.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'#fff',fontWeight:700,border:'2px solid #fff',marginLeft:i>0?-8:0} }, p.initials)),
          React.createElement('div', { style:{width:30,height:30,borderRadius:'50%',background:'#E8ECF0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,color:'#6B8EAE',border:'2px solid #fff',marginLeft:-8} }, '+')
        )
      ),
      React.createElement('div', { style:{marginLeft:'auto'} },
        React.createElement('div', { style:{fontSize:11,fontWeight:700,color:'#9BA8B4',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8} }, t('machineLabel')),
        React.createElement('div', { style:{display:'inline-flex',alignItems:'center',gap:6,background:'#F3EAF5',border:'1px solid #C9A8D0',borderRadius:8,padding:'5px 12px',fontSize:13,color:'#4d0a52',fontWeight:600} },
          machine?.name || t('machineLabel')
        )
      )
    ),

    /* Tabs */
    React.createElement('div', { style:{display:'flex',gap:0,marginBottom:20,borderBottom:'1px solid #EBEEF2'} },
      [['details', t('tabDetails')], ['tasks', t('tabTasks')], ['parts', t('tabParts')]].map(([id,lbl]) =>
        React.createElement('button', { key:id, onClick:()=>setTab(id),
          style:{padding:'9px 20px',background:'none',border:'none',borderBottom:tab===id?'2px solid #4d0a52':'2px solid transparent',color:tab===id?'#4d0a52':'#8B97A3',fontWeight:tab===id?700:400,cursor:'pointer',fontSize:13,transition:'all 0.15s'} },
          lbl)
      )
    ),

    /* Tab: Details */
    tab==='details' && React.createElement(React.Fragment, null,
      React.createElement(Field, { label: t('fieldLocation'), hint: t('fieldLocationHint') },
        React.createElement('input', { value:form.location, onChange:e=>setField('location',e.target.value), placeholder: t('locationPlaceholder'),
          style:{width:'100%',padding:'10px 12px',border:'1px solid #C5D0DB',borderRadius:10,fontSize:14,outline:'none',background:'#FAFBFC',boxSizing:'border-box'} })
      ),
      React.createElement(Field, { label: t('fieldFaultDesc'), required:true },
        React.createElement(VoiceTextArea, { value:form.description, onChange:v=>setField('description',v), placeholder: t('faultPlaceholder'), rows:4, voiceText:voiceDesc })
      ),
      React.createElement(Field, { label: t('fieldSeverity') },
        React.createElement(SegCtrl, { value:form.severity, onChange:v=>setField('severity',v),
          options:[{value:'info',label:t('sevInfo'),color:'#1E88E5'},{value:'warning',label:t('sevWarning'),color:'#FB8C00'},{value:'critical',label:t('sevCritical'),color:'#E53935'}] })
      ),
      React.createElement(Field, { label: t('fieldComponent') },
        React.createElement(React.Fragment, null,
          React.createElement('input', { value:form.component, onChange:e=>setField('component',e.target.value), placeholder: t('componentPlaceholder'), list:'comp-list',
            style:{width:'100%',padding:'10px 12px',border:'1px solid #C5D0DB',borderRadius:10,fontSize:14,outline:'none',background:'#FAFBFC',boxSizing:'border-box'} }),
          React.createElement('datalist', { id:'comp-list' },
            ['Timing belt (3M-225-6)','Servo drive','Proximity sensor SICK IME30','Welding tip WA-120','Motor 1FK7083-5AF71','Vacuum sealing strip'].map(c=>React.createElement('option',{key:c,value:c})))
        )
      )
    ),

    /* Tab: Tasks checklist */
    tab==='tasks' && React.createElement('div', null,
      React.createElement('div', { style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12} },
        React.createElement('div', { style:{fontSize:14,fontWeight:700,color:'#1A2433'} }, t('resolutionChecklist')),
        React.createElement('div', { style:{fontSize:13,color:'#4d0a52',fontWeight:600} }, `${doneTasks} / ${tasks.length} ${t('tasksDone')}`)
      ),
      /* Progress bar */
      React.createElement('div', { style:{height:5,background:'#EBEEF2',borderRadius:3,marginBottom:18,overflow:'hidden'} },
        React.createElement('div', { style:{height:'100%',width:`${(doneTasks/tasks.length)*100}%`,background:'#4CAF50',borderRadius:3,transition:'width 0.3s ease'} })
      ),
      tasks.map(task =>
        React.createElement('div', { key:task.id, onClick:()=>toggleTask(task.id),
          style:{display:'flex',alignItems:'center',gap:14,padding:'13px 14px',marginBottom:6,background:task.done?'#F3EAF5':'#FAFBFC',border:`1px solid ${task.done?'#C9A8D0':'#EBEEF2'}`,borderRadius:10,cursor:'pointer',transition:'all 0.15s'} },
          React.createElement('div', { style:{width:22,height:22,borderRadius:6,border:`2px solid ${task.done?'#4d0a52':'#C5D0DB'}`,background:task.done?'#4d0a52':'#fff',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all 0.15s'} },
            task.done && window.Icons.check(13,'#fff')
          ),
          React.createElement('span', { style:{fontSize:14,color:task.done?'#4d0a52':'#1A2433',fontWeight:task.done?500:400,textDecoration:task.done?'line-through':'none',opacity:task.done?0.75:1} }, task.label)
        )
      ),
      React.createElement('div', { style:{marginTop:18,padding:'12px 14px',background:'#FFF8E1',border:'1px solid #FFE082',borderRadius:10,fontSize:13,color:'#795548',display:'flex',gap:10,alignItems:'flex-start'} },
        I && I.help(18, '#795548'),
        React.createElement('span', null, t('tasksCompliance'))
      )
    ),

    /* Tab: Parts & Notes */
    tab==='parts' && React.createElement(React.Fragment, null,
      React.createElement(Field, { label: t('resolutionType') },
        React.createElement(SegCtrl, { value:form.resolutionType, onChange:v=>setField('resolutionType',v),
          options:[{value:'Permanent',label:t('resolutionPermanent'),color:'#2E7D32'},{value:'Temporary',label:t('resolutionTemporary'),color:'#FB8C00'}] })
      ),
      React.createElement(Field, { label: t('resolutionNotes') },
        React.createElement(VoiceTextArea, { value:form.resolutionNotes, onChange:v=>setField('resolutionNotes',v), placeholder: t('resolutionNotesPlaceholder'), rows:3, voiceText:voiceRes })
      ),
      React.createElement(Field, { label: t('sparePartsUsed') },
        React.createElement('div', null,
          form.parts.map((p,i) =>
            React.createElement('div', { key:i, style:{display:'flex',gap:8,marginBottom:8} },
              React.createElement('input', { value:p.part, onChange:e=>setField('parts',form.parts.map((x,j)=>j===i?{...x,part:e.target.value}:x)), placeholder: t('partName'),
                style:{flex:1,padding:'9px 11px',border:'1px solid #C5D0DB',borderRadius:9,fontSize:13,outline:'none'} }),
              React.createElement('input', { value:p.qty, onChange:e=>setField('parts',form.parts.map((x,j)=>j===i?{...x,qty:e.target.value}:x)), placeholder: t('qty'), type:'number',
                style:{width:64,padding:'9px 10px',border:'1px solid #C5D0DB',borderRadius:9,fontSize:13,outline:'none'} }),
              React.createElement('button', { onClick:()=>setField('parts',form.parts.filter((_,j)=>j!==i)), style:{background:'none',border:'none',cursor:'pointer',color:'#F44336',fontSize:18,padding:'0 4px'} }, '×')
            )
          ),
          React.createElement('button', { onClick:()=>setField('parts',[...form.parts,{part:'',qty:1}]),
            style:{padding:'7px 14px',border:'1.5px dashed #C5D0DB',borderRadius:9,background:'none',cursor:'pointer',fontSize:13,color:'#6B8EAE'} }, t('addPart'))
        )
      )
    ),
    React.createElement('div', { style:{display:'flex',flexWrap:'wrap',alignItems:'center',gap:10,marginTop:22,paddingTop:16,borderTop:'1px solid #EBEEF2'} },
      React.createElement('div', { style:{fontSize:12,color:'#9BA8B4',marginRight:'auto'} }, `${doneTasks}/${tasks.length} ${t('tasksChecked')}`),
      React.createElement('button', { type:'button', onClick:onClose, style:{padding:'9px 18px',border:'1px solid #C5D0DB',borderRadius:9,background:'#fff',cursor:'pointer',fontSize:13,color:'#555'} }, t('saveDraft')),
      React.createElement('button', { type:'button', onClick:()=>{ if(form.description.trim()) onSubmit(form); }, disabled:!form.description.trim(),
        style:{padding:'9px 24px',background:form.description.trim()?'#E53935':'#C5D0DB',border:'none',borderRadius:9,color:'#fff',fontWeight:700,cursor:form.description.trim()?'pointer':'default',fontSize:13} }, t('submit'))
    )
  );
}

function IncidentDialog({ machine, onSubmit, onClose }) {
  const { t } = useKobi();
  const I = window.Icons;
  return React.createElement(Modal, {
    title: React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 10 } }, I && I.alert(20, '#E53935'), t('logIncidentTitle')),
    subtitle: t('incidentSubtitle'),
    width: 700,
    onClose,
    footer: null,
  },
    React.createElement(IncidentFormContent, { machine, onSubmit, onClose })
  );
}

/**
 * Incident form chrome — variant "main" fills the center column (same content as the old modal).
 * variant "rail" is for a narrow right drawer (optional / legacy).
 */
function IncidentFormShell({ machineId, onClose, variant }) {
  const isMain = variant === 'main';
  const I = window.Icons;
  const { t, addMessage, activeChannel, addToast, setOpenIncidentCount, role, language } = useKobi();
  const { channels, machines } = window.KobiData;
  const channel = channels.find((c) => c.slug === activeChannel);
  const machine = (machineId && machines[machineId]) || (channel?.machineId ? machines[channel.machineId] : null);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const handleSubmit = (inc) => {
    setOpenIncidentCount((n) => n + 1);
    addToast(t('incidentSubmitted'));
    const userId = role === 'manager' ? 'martin' : 'jozef';
    const incId = `INC-2026-0${490 + Math.floor(Math.random() * 10)}`;
    addMessage(activeChannel, {
      id: Date.now() + 'inc',
      userId: 'kobi',
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      isBot: true,
      markdown: language === 'sk'
        ? `🚨 **${t('incidentOpened')} @${userId} — ${incId}**\nStroj: ${machine?.name || t('machineLabel')} · ${t('noteSeverity')}: ${inc.severity} · Stav: **${t('incidentAwaiting')}**\n_"${inc.description}"_\n*${t('viewInLogbook')}*`
        : `🚨 **Incident ${incId} opened by @${userId}**\nMachine: ${machine?.name || 'Machine'} · Severity: ${inc.severity} · Status: **Awaiting approval**\n_"${inc.description}"_\n*View in Logbook →*`,
      sources: [],
    });
    addMessage('incidents', {
      id: Date.now() + 'incc',
      isIncidentCard: true,
      incident: {
        id: incId,
        machine: machine?.name || 'Machine',
        issue: (inc.description || '').slice(0, 40) + '…',
        severity: inc.severity,
        status: 'awaiting-approval',
        openedBy: userId,
        opened: language === 'sk' ? 'práve teraz' : 'just now',
        notes: inc.description,
        resolution: inc.resolution,
      },
    });
    onClose();
  };

  const rootStyle = isMain
    ? { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: '#F5F6F8', overflow: 'hidden' }
    : { display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, background: '#FAFBFC' };

  const headerStyle = isMain
    ? {
        padding: '18px 22px',
        borderBottom: '1px solid #EBEEF2',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 8,
        flexShrink: 0,
        background: '#fff',
      }
    : {
        padding: '14px 16px',
        borderBottom: '1px solid #E8ECF0',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 8,
        flexShrink: 0,
        background: '#FAFBFC',
      };

  const titleRowStyle = isMain
    ? { fontWeight: 800, fontSize: 17, color: '#1A2433', display: 'flex', alignItems: 'center', gap: 10 }
    : { fontWeight: 700, fontSize: 14, color: '#1A2433', display: 'flex', alignItems: 'center', gap: 8 };

  const subtitleStyle = { fontSize: 12, color: '#8B97A3', marginTop: isMain ? 3 : 4, lineHeight: 1.35 };

  const scrollOuter = isMain
    ? { flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0, background: '#F5F6F8', padding: '16px 18px 24px' }
    : { flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '12px 14px 20px', minHeight: 0, background: '#fff' };

  const formWrapStyle = isMain ? { width: '100%', maxWidth: 720, margin: '0 auto' } : { width: '100%' };

  return React.createElement('div', { style: rootStyle },
    React.createElement('div', { style: headerStyle },
      React.createElement('div', { style: { minWidth: 0 } },
        React.createElement('div', { style: titleRowStyle }, I && I.alert(isMain ? 20 : 18, '#E53935'), t('incident')),
        React.createElement('div', { style: subtitleStyle }, t('incidentSubtitle'))
      ),
      React.createElement('button', { type: 'button', onClick: onClose, style: { background: 'none', border: 'none', cursor: 'pointer', color: '#8B97A3', fontSize: 22, lineHeight: 1, flexShrink: 0, padding: 2 } }, '×')
    ),
    React.createElement('div', { style: scrollOuter },
      React.createElement('div', { style: formWrapStyle },
        React.createElement(IncidentFormContent, { machine, onSubmit: handleSubmit, onClose })
      )
    )
  );
}

function IncidentSlidePanel(props) {
  return React.createElement(IncidentFormShell, { ...props, variant: 'rail' });
}

/** Center column — same fields as the modal (pic 2). */
function IncidentMainPanel(props) {
  return React.createElement(IncidentFormShell, { ...props, variant: 'main' });
}

/* ─── OnPrem modal ─── */

function OnPremModal() {
  const { showOnPremModal, setShowOnPremModal, t } = useKobi();
  const I = window.Icons;
  if (!showOnPremModal) return null;
  return React.createElement(Modal, { title:'', width:560, onClose:()=>setShowOnPremModal(false),
    footer: React.createElement('button', { onClick:()=>setShowOnPremModal(false), style:{padding:'9px 28px',background:'#4d0a52',border:'none',borderRadius:9,color:'#fff',fontWeight:700,cursor:'pointer',fontSize:13} }, t('close'))
  },
    React.createElement('div', { style:{textAlign:'center',padding:'0 12px 10px'} },
      React.createElement('div', { style:{display:'flex',justifyContent:'center',marginBottom:14} }, I && I.general(56, '#4d0a52')),
      React.createElement('div', { style:{fontWeight:800,fontSize:22,color:'#1A2433',marginBottom:14} }, t('onPremTitle')||'Your data never leaves this factory.'),
      React.createElement('div', { style:{fontSize:15,color:'#555',lineHeight:1.75,marginBottom:20} },
        t('onPremBody1'),
        React.createElement('br'),React.createElement('br'),
        t('onPremBody2')
      ),
      React.createElement('div', { style:{display:'flex',gap:10,justifyContent:'center',marginBottom:18,flexWrap:'wrap'} },
        [t('badgeOnPrem'), t('badgeAirGap'), t('badgeIso')].map(b =>
          React.createElement('span', { key:b, style:{background:'#F3EAF5',border:'1px solid #C9A8D0',borderRadius:20,padding:'6px 14px',fontSize:13,color:'#4d0a52',fontWeight:600} }, b)
        )
      ),
      React.createElement('div', { style:{fontSize:12,color:'#8B97A3',borderTop:'1px solid #EBEEF2',paddingTop:14} }, t('onPremFooter'))
    )
  );
}

/* ─── Search overlay ─── */

function SearchOverlay() {
  const { showSearchOverlay, setShowSearchOverlay, t, language } = useKobi();
  const [query, setQuery] = useState('');
  if (!showSearchOverlay) return null;
  const results = query.length > 1 ? (language === 'sk' ? [
    { type:'message', text:'Chyba F-304 na Siemens S7-1500 — nadprúd motora, kontrola vinutia', channel:'#machine-siemens-s7-1500', user:'Jozef Novák', time:'Dnes 09:14' },
    { type:'message', text:'Remeň 3M-225-6 vymenený, napätie 4,5 N potvrdené meračom Gates', channel:'#machine-siemens-s7-1500', user:'Kobi', time:'Dnes 09:41' },
    { type:'message', text:'Nezarovnanie zváracieho oblúka na KR 60-3 — odchýlka TCP po výmene hrotu', channel:'#incidents', user:'Martin Horváth', time:'Včera' },
    { type:'doc', text:'Siemens SINAMICS S120 Fault Manual — F-304 Nadprúd motorového modulu', ref:'247 strán · indexované 12. mar 2026' },
    { type:'doc', text:'KUKA System Software KSS 8.6 — Procedúra kalibrácie TCP', ref:'312 strán · indexované 5. feb 2026' },
  ] : [
    { type:'message', text:'F-304 error on Siemens S7-1500 — motor overcurrent, winding check required', channel:'#machine-siemens-s7-1500', user:'Jozef Novák', time:'Today 09:14' },
    { type:'message', text:'Timing belt 3M-225-6 replaced, tension 4.5N confirmed with Gates gauge', channel:'#machine-siemens-s7-1500', user:'Kobi', time:'Today 09:41' },
    { type:'message', text:'Welding arc misalignment on KR 60-3 — TCP deviation after tip change', channel:'#incidents', user:'Martin Horváth', time:'Yesterday' },
    { type:'doc', text:'Siemens SINAMICS S120 Fault Manual — F-304 Motor Module Overcurrent', ref:'247 pages · indexed 12 Mar 2026' },
    { type:'doc', text:'KUKA System Software KSS 8.6 — TCP Calibration Procedure', ref:'312 pages · indexed 5 Feb 2026' },
  ]) : [];
  return React.createElement('div', {
    style:{position:'fixed',inset:0,background:'rgba(0,0,0,0.45)',zIndex:300,display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:80},
    onClick:e=>{ if(e.target===e.currentTarget) setShowSearchOverlay(false); }
  },
    React.createElement('div', { style:{background:'#fff',borderRadius:14,width:'100%',maxWidth:640,boxShadow:'0 20px 60px rgba(0,0,0,0.2)',overflow:'hidden'} },
      React.createElement('div', { style:{padding:'14px 18px',borderBottom:'1px solid #EBEEF2',display:'flex',alignItems:'center',gap:10} },
        window.Icons && window.Icons.search(16,'#8B97A3'),
        React.createElement('input', { autoFocus:true,value:query,onChange:e=>setQuery(e.target.value),placeholder: t('searchPlaceholder'),
          style:{flex:1,border:'none',outline:'none',fontSize:15,color:'#1A2433'} }),
        React.createElement('button', { onClick:()=>setShowSearchOverlay(false), style:{background:'none',border:'none',cursor:'pointer',color:'#8B97A3',fontSize:13} }, t('searchEsc'))
      ),
      results.length>0 && React.createElement('div', { style:{padding:'8px 0',maxHeight:380,overflowY:'auto'} },
        results.map((r,i)=>React.createElement('div', { key:i, onClick:()=>setShowSearchOverlay(false),
          style:{padding:'12px 18px',cursor:'pointer',borderBottom:'1px solid #F7F9FB',display:'flex',gap:12},
          onMouseEnter:e=>e.currentTarget.style.background='#F7F9FB',
          onMouseLeave:e=>e.currentTarget.style.background='#fff',
        },
          React.createElement('span',{style:{display:'flex',flexShrink:0}}, window.Icons && (r.type==='doc' ? window.Icons.fileText(17, '#1565C0') : window.Icons.chat(17, '#4d0a52'))),
          React.createElement('div',null,
            React.createElement('div',{style:{fontSize:13,color:'#1A2433',marginBottom:3}},r.text),
            React.createElement('div',{style:{fontSize:11,color:'#9BA8B4'}},r.type==='doc'?r.ref:`${r.channel} · ${r.user} · ${r.time}`)
          )
        ))
      ),
      query.length<=1 && React.createElement('div',{style:{padding:'28px 18px',textAlign:'center',color:'#9BA8B4',fontSize:14}}, t('searchHint'))
    )
  );
}

/* ─── Toast container ─── */

function ToastContainer() {
  const { toasts } = useKobi();
  const I = window.Icons;
  return React.createElement('div', { style:{position:'fixed',bottom:24,right:24,zIndex:400,display:'flex',flexDirection:'column',gap:8} },
    toasts.map(toast=>React.createElement('div', { key:toast.id,
      style:{background:toast.type==='success'?'#1B3A1B':toast.type==='info'?'#1A2E45':'#3A1B1B',color:'#fff',padding:'13px 20px',borderRadius:12,fontSize:13,fontWeight:500,boxShadow:'0 4px 24px rgba(0,0,0,0.28)',display:'flex',alignItems:'center',gap:10,animation:'slideInRight 0.25s ease-out',maxWidth:340} },
      React.createElement('span',{style:{display:'flex',flexShrink:0}}, toast.type==='success' ? (I && I.checkCircle(18, '#fff')) : toast.type==='info' ? (I && I.infoCircle(18, '#fff')) : (I && I.alert(18, '#fff'))),
      toast.msg
    ))
  );
}

Object.assign(window, { AddNoteDialog, IncidentDialog, IncidentFormContent, IncidentSlidePanel, IncidentMainPanel, OnPremModal, SearchOverlay, ToastContainer });
