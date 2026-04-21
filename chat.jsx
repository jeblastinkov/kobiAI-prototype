// KobiAI Chat v2 — rich messages (reactions, file cards, URGENT), better composer

const { useState, useEffect, useRef, useCallback } = React;

/* ─── Markdown renderer ─── */
function MarkdownText({ text }) {
  if (!text) return null;
  const lines = text.split('\n');
  return React.createElement('div', { style: { lineHeight: 1.65 } },
    lines.map((line, i) => {
      if (line.trim() === '') return React.createElement('div', { key: i, style: { height: 6 } });
      if (line.startsWith('- ')) return React.createElement('div', { key: i, style: { display: 'flex', gap: 8, marginBottom: 3 } },
        React.createElement('span', { style: { color: '#4d0a52', minWidth: 12, fontWeight: 700 } }, '•'),
        React.createElement('span', null, renderInline(line.slice(2)))
      );
      if (line.match(/^\d+\./)) return React.createElement('div', { key: i, style: { display: 'flex', gap: 8, marginBottom: 3 } },
        React.createElement('span', { style: { color: '#4d0a52', fontWeight: 700, minWidth: 18 } }, line.match(/^(\d+)/)[1] + '.'),
        React.createElement('span', null, renderInline(line.replace(/^\d+\.\s*/, '')))
      );
      if (line.startsWith('|') && line.endsWith('|')) {
        if (line.replace(/\|/g,'').trim().match(/^[-\s]+$/)) return null;
        const cells = line.split('|').filter((_,j,a) => j>0 && j<a.length-1);
        const isHdr = lines[i+1] && lines[i+1].replace(/\|/g,'').trim().match(/^[-\s]+$/);
        return React.createElement('div', { key:i, style:{display:'flex',background:isHdr?'#F0EAF3':i%2===0?'#FAF7FB':'#fff',borderRadius:4,marginBottom:1} },
          cells.map((c,j)=>React.createElement('div',{key:j,style:{flex:1,padding:'4px 10px',fontSize:13,fontWeight:isHdr?700:400,borderRight:j<cells.length-1?'1px solid #E4E7EB':'none'}},renderInline(c.trim())))
        );
      }
      return React.createElement('div', { key: i }, renderInline(line));
    })
  );
}

function renderInline(text) {
  const parts = []; let rem = text, key = 0;
  while (rem.length > 0) {
    const bm = rem.match(/\*\*(.+?)\*\*/), cm = rem.match(/`(.+?)`/), im = rem.match(/_(.+?)_/);
    const matches = [bm,cm,im].filter(Boolean).sort((a,b)=>a.index-b.index);
    if (!matches.length) { parts.push(rem); break; }
    const first = matches[0];
    if (first.index > 0) parts.push(rem.slice(0, first.index));
    if (first===bm) parts.push(React.createElement('strong',{key:key++},first[1]));
    else if (first===cm) parts.push(React.createElement('code',{key:key++,style:{background:'#F0EAF3',padding:'1px 5px',borderRadius:4,fontFamily:'monospace',fontSize:'0.9em'}},first[1]));
    else parts.push(React.createElement('em',{key:key++},first[1]));
    rem = rem.slice(first.index + first[0].length);
  }
  return parts;
}

/* ─── Avatar ─── */
function Avatar({ user, size = 36 }) {
  return React.createElement('div', {
    style: { width:size, height:size, borderRadius:'50%', background:user?.color||'#555', display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.36, color:'#fff', fontWeight:700, flexShrink:0 }
  }, user?.initials||'?');
}

/* ─── File attachment card ─── */
function FileCard({ file }) {
  const ext = file.name.split('.').pop().toUpperCase();
  const extColor = ext==='PDF'?'#E53935':ext==='DOCX'?'#1565C0':'#2E7D32';
  return React.createElement('div', { style:{display:'inline-flex',alignItems:'center',gap:12,background:'#FAFBFC',border:'1px solid #E8ECF0',borderRadius:10,padding:'10px 14px',marginTop:6,cursor:'pointer',maxWidth:280},
    onMouseEnter:e=>e.currentTarget.style.background='#F3EAF5', onMouseLeave:e=>e.currentTarget.style.background='#FAFBFC' },
    React.createElement('div',{style:{width:36,height:44,background:extColor+'18',border:`1px solid ${extColor}33`,borderRadius:6,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flexShrink:0}},
      React.createElement('span',{style:{fontSize:9,fontWeight:800,color:extColor}},ext),
      window.Icons&&React.createElement('div',{style:{marginTop:2}},window.Icons.fileText(14,extColor))
    ),
    React.createElement('div',null,
      React.createElement('div',{style:{fontWeight:600,fontSize:13,color:'#1A2433',marginBottom:2}},file.name),
      React.createElement('div',{style:{fontSize:11,color:'#9BA8B4'}},file.size)
    )
  );
}

/* ─── Sources card ─── */
function SourcesCard({ sources, visible }) {
  const I = window.Icons;
  const [expanded, setExpanded] = useState(false);
  if (!visible || !sources?.length) return null;
  return React.createElement('div', { style:{marginTop:10,background:'#F3EAF5',border:'1px solid #C9A8D0',borderRadius:10,overflow:'hidden',fontSize:13} },
    React.createElement('button', { type:'button', onClick:()=>setExpanded(e=>!e), style:{width:'100%',padding:'8px 12px',background:'none',border:'none',textAlign:'left',cursor:'pointer',display:'flex',alignItems:'center',gap:8,color:'#4d0a52',fontWeight:600} },
      I && I.fileText(16, '#4d0a52'),
      React.createElement('span',null,`Sources (${sources.length})`),
      React.createElement('span',{style:{marginLeft:'auto',color:'#9BA8B4',display:'flex'}}, I && (expanded ? I.chevronUp(14, '#9BA8B4') : I.chevronDown(14, '#9BA8B4')))
    ),
    expanded && React.createElement('div',{style:{padding:'4px 12px 10px',borderTop:'1px solid #C9A8D0'}},
      sources.map((s,i)=>React.createElement('div',{key:i,style:{display:'flex',alignItems:'flex-start',gap:8,padding:'4px 0',borderBottom:i<sources.length-1?'1px solid #E2D4E5':'none'}},
        React.createElement('span',{style:{display:'flex',marginTop:1,flexShrink:0}}, s.isNote ? (I && I.brain(15, '#4d0a52')) : (I && I.fileText(15, '#4d0a52'))),
        React.createElement('div',null,
          React.createElement('div',{style:{color:'#4d0a52',fontWeight:600,fontSize:12}},s.title),
          (s.ref||s.date)&&React.createElement('div',{style:{color:'#8B97A3',fontSize:11}},[s.ref,s.date].filter(Boolean).join(' · '))
        )
      ))
    )
  );
}

/* ─── Diagram preview ─── */
function DiagramPreview({ diagram }) {
  if (!diagram) return null;
  return React.createElement('div', { style:{marginTop:8,background:'#EDF1F6',border:'1px solid #CDD5DF',borderRadius:9,padding:'10px 14px',display:'flex',alignItems:'center',gap:10,cursor:'pointer',maxWidth:340},
    onMouseEnter:e=>e.currentTarget.style.background='#E4ECF4', onMouseLeave:e=>e.currentTarget.style.background='#EDF1F6' },
    React.createElement('div',{style:{width:64,height:42,background:'repeating-linear-gradient(45deg,#CDD5DF,#CDD5DF 2px,#EDF1F6 2px,#EDF1F6 8px)',borderRadius:5}}),
    React.createElement('div',{style:{fontSize:12,color:'#4d0a52',fontWeight:500}},diagram.label)
  );
}

/* ─── Reactions bar ─── */
function ReactionsBar({ reactions }) {
  const [myReacts, setMyReacts] = useState([]);
  if (!reactions?.length) return null;
  return React.createElement('div',{style:{display:'flex',gap:6,marginTop:6,flexWrap:'wrap'}},
    reactions.map(r=>React.createElement('button',{key:r.emoji,
      onClick:()=>setMyReacts(m=>m.includes(r.emoji)?m.filter(x=>x!==r.emoji):[...m,r.emoji]),
      style:{display:'flex',alignItems:'center',gap:4,padding:'3px 9px',background:myReacts.includes(r.emoji)?'#F3EAF5':'#F5F6F8',border:`1px solid ${myReacts.includes(r.emoji)?'#C9A8D0':'#E8ECF0'}`,borderRadius:20,cursor:'pointer',fontSize:13,fontWeight:myReacts.includes(r.emoji)?700:400,transition:'all 0.15s'}},
      React.createElement('span',null,r.emoji),
      React.createElement('span',{style:{fontSize:12,color:'#555'}},r.count+(myReacts.includes(r.emoji)?1:0))
    ))
  );
}

/* ─── Bot message ─── */
function BotMessage({ msg, sourcesVisible }) {
  return React.createElement('div', { style:{background:'#F8F4FA',border:'1px solid #EAE0EF',borderRadius:12,padding:'12px 16px',maxWidth:'100%'} },
    React.createElement(MarkdownText,{text:msg.markdown||msg.text}),
    React.createElement(DiagramPreview,{diagram:msg.diagram}),
    React.createElement(SourcesCard,{sources:msg.sources,visible:sourcesVisible})
  );
}

/* ─── Ingestion card ─── */
function IngestionCard({ file }) {
  const I = window.Icons;
  const [phase, setPhase] = useState(file.status==='indexed'?'done':'parsing');
  const [progress, setProgress] = useState(file.status==='indexed'?100:0);
  useEffect(()=>{
    if(file.status==='indexed') return;
    const t1=setTimeout(()=>{
      let p=0; const iv=setInterval(()=>{p+=4;setProgress(p);if(p>=100){clearInterval(iv);setPhase('done');}},60);
      return ()=>clearInterval(iv);
    },300);
    return ()=>clearTimeout(t1);
  },[]);
  return React.createElement('div',{style:{background:'#F0F8FF',border:'1px solid #C5D9EE',borderRadius:10,padding:'12px 16px',maxWidth:380}},
    React.createElement('div',{style:{display:'flex',alignItems:'center',gap:10,marginBottom:8}},
      React.createElement('span',{style:{display:'flex',flexShrink:0}}, I && I.fileText(22, '#1565C0')),
      React.createElement('div',{style:{minWidth:0,flex:1}},
        React.createElement('div',{style:{fontWeight:600,fontSize:13,color:'#1A2433'}}, file.name),
        React.createElement('div',{style:{fontSize:11,color:'#6B8EAE'}},file.size+' MB')
      ),
      phase==='done'&&React.createElement('span',{style:{marginLeft:'auto',display:'flex',alignItems:'center',gap:5,color:'#4CAF50',fontWeight:700,fontSize:12}}, I && I.checkCircle(15, '#4CAF50'), 'Indexed')
    ),
    phase!=='done'&&React.createElement('div',null,
      React.createElement('div',{style:{height:5,background:'#C5D9EE',borderRadius:3,overflow:'hidden'}},
        React.createElement('div',{style:{height:'100%',width:`${progress}%`,background:'#4CAF50',transition:'width 0.06s linear',borderRadius:3}})
      ),
      React.createElement('div',{style:{fontSize:11,color:'#6B8EAE',marginTop:4}},'Parsing…')
    ),
    phase==='done'&&React.createElement('div',{style:{fontSize:12,color:'#555'}},
      `${file.pages} pages · ${file.chunks} chunks · ${file.diagrams} diagrams`,
      React.createElement('br'),
      React.createElement('span',{style:{color:'#4CAF50',fontWeight:500}},`Tagged: ${file.machine}`)
    )
  );
}

/* ─── Incident card ─── */
function IncidentCard({ incident: inc }) {
  const I = window.Icons;
  const sevColor = { critical:'#B71C1C', warning:'#E65100', info:'#1565C0' }[inc.severity]||'#555';
  const stBg = { resolved:'#E8F5E9','in-progress':'#FFF3E0',open:'#FFEBEE','awaiting-approval':'#FFF3E0' }[inc.status]||'#F5F5F5';
  const stCol = { resolved:'#2E7D32','in-progress':'#E65100',open:'#B71C1C','awaiting-approval':'#E65100' }[inc.status]||'#555';
  const stDot = { resolved:'#4CAF50','in-progress':'#FF9800',open:'#F44336','awaiting-approval':'#FF9800' }[inc.status]||'#9E9E9E';
  const stLbl = { resolved:'Resolved','in-progress':'In progress',open:'Open','awaiting-approval':'Awaiting' }[inc.status]||String(inc.status);
  return React.createElement('div',{style:{border:`1px solid ${sevColor}44`,borderLeft:`4px solid ${sevColor}`,borderRadius:10,padding:'12px 16px',background:'#fff',marginBottom:6}},
    React.createElement('div',{style:{display:'flex',alignItems:'center',gap:8,marginBottom:5}},
      React.createElement('span',{style:{display:'flex',alignItems:'center',gap:6,fontWeight:700,color:'#1A2433',fontSize:13}}, I && I.alert(15, '#B71C1C'), inc.id),
      React.createElement('span',{style:{background:stBg,color:stCol,borderRadius:20,padding:'2px 10px',fontSize:11,fontWeight:700,display:'inline-flex',alignItems:'center',gap:5}}, I && I.statusDot(10, stDot), stLbl),
      React.createElement('span',{style:{marginLeft:'auto',color:'#6B8EAE',fontSize:11}},inc.opened)
    ),
    React.createElement('div',{style:{fontSize:14,color:'#1A2433',fontWeight:500,marginBottom:4}},
      React.createElement('strong',null,inc.machine),' · ',inc.issue
    ),
    inc.notes&&React.createElement('div',{style:{fontSize:13,color:'#555',fontStyle:'italic',marginBottom:5}},`"${inc.notes}"`),
    React.createElement('div',{style:{display:'flex',gap:12,fontSize:11,color:'#8B97A3',flexWrap:'wrap'}},
      React.createElement('span',null,`Opened by @${inc.openedBy}`),
      inc.resolvedBy&&React.createElement('span',null,`· Resolved by @${inc.resolvedBy}`),
      inc.mttr&&React.createElement('span',null,`· MTTR: ${inc.mttr}`),
      inc.parts?.length>0&&React.createElement('span',null,`· Parts: ${inc.parts.join(', ')}`)
    )
  );
}

/* ─── Day divider ─── */
function DayDivider({ label }) {
  return React.createElement('div',{style:{display:'flex',alignItems:'center',gap:12,padding:'14px 16px 6px',pointerEvents:'none'}},
    React.createElement('div',{style:{flex:1,height:1,background:'#E8ECF0'}}),
    React.createElement('span',{style:{fontSize:11,fontWeight:700,color:'#9BA8B4',background:'#fff',padding:'2px 10px',border:'1px solid #E8ECF0',borderRadius:20}},label),
    React.createElement('div',{style:{flex:1,height:1,background:'#E8ECF0'}})
  );
}

/* ─── Message row ─── */
function Message({ msg, isGrouped }) {
  const I = window.Icons;
  const { users } = window.KobiData;
  const user = users[msg.userId]||{initials:'?',color:'#999',name:msg.userId};
  const [hov, setHov] = useState(false);
  const [showReactPicker, setShowReactPicker] = useState(false);

  if (msg.isIncidentCard) return React.createElement('div',{style:{padding:'4px 16px'}},React.createElement(IncidentCard,{incident:msg.incident}));
  if (msg.isDivider) return React.createElement(DayDivider,{label:msg.label});

  const reactions = msg.reactions || [];
  const files = msg.files || [];

  return React.createElement('div',{
    onMouseEnter:()=>setHov(true), onMouseLeave:()=>setHov(false),
    style:{display:'flex',gap:12,padding:'4px 16px',position:'relative',background:hov?'#F9F7FA':'transparent',transition:'background 0.1s',marginBottom:isGrouped?0:4}
  },
    !isGrouped ? React.createElement(Avatar,{user,size:38}) : React.createElement('div',{style:{width:38,flexShrink:0}}),
    React.createElement('div',{style:{flex:1,minWidth:0}},
      !isGrouped&&React.createElement('div',{style:{display:'flex',alignItems:'center',gap:8,marginBottom:3}},
        React.createElement('span',{style:{fontWeight:700,color:'#1A2433',fontSize:14}},user.name),
        user.isBot&&React.createElement('span',{style:{background:'#4d0a52',color:'#fff',fontSize:10,fontWeight:700,borderRadius:4,padding:'1px 6px',letterSpacing:'0.04em'}},'APP'),
        msg.urgent&&React.createElement('span',{style:{background:'#E53935',color:'#fff',fontSize:10,fontWeight:700,borderRadius:4,padding:'2px 8px',letterSpacing:'0.06em'}},'URGENT'),
        React.createElement('span',{style:{color:'#9BA8B4',fontSize:11}},msg.time)
      ),
      msg.isIngestion && msg.file
        ? React.createElement(IngestionCard,{ file: msg.file })
        : msg.isBot
          ? React.createElement(BotMessage,{ msg, sourcesVisible: true })
          : React.createElement('div',{style:{fontSize:14,color:'#2A3544',lineHeight:1.65}},
              msg.text&&React.createElement(MarkdownText,{text:msg.text})
            ),
      // File attachments
      files.length>0&&React.createElement('div',{style:{display:'flex',gap:8,flexWrap:'wrap',marginTop:6}},
        files.map((f,i)=>React.createElement(FileCard,{key:i,file:f}))
      ),
      // Reactions
      React.createElement(ReactionsBar,{reactions}),
      // Reply + Follow row
      msg.threadCount&&React.createElement('div',{style:{display:'flex',alignItems:'center',gap:12,marginTop:6}},
        React.createElement('div',{style:{display:'flex',alignItems:'center'}},
          msg.threadAvatars?.slice(0,3).map((a,i)=>React.createElement('div',{key:i,style:{width:20,height:20,borderRadius:'50%',background:a.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,color:'#fff',fontWeight:700,border:'2px solid #fff',marginLeft:i>0?-6:0}},a.initials))
        ),
        React.createElement('button',{type:'button',style:{background:'none',border:'none',cursor:'pointer',color:'#4d0a52',fontSize:12,fontWeight:600,padding:0,display:'inline-flex',alignItems:'center',gap:5}}, I.reply(14, '#4d0a52'), `${msg.threadCount} ${msg.threadCount===1?'reply':'replies'}`),
        React.createElement('button',{style:{background:'none',border:'none',cursor:'pointer',color:'#8B97A3',fontSize:12,padding:0}},`Follow`)
      )
    ),
    hov&&I&&React.createElement('div',{style:{position:'absolute',top:-6,right:16,background:'#fff',border:'1px solid #E8ECF0',borderRadius:9,display:'flex',gap:2,padding:'3px 6px',boxShadow:'0 2px 12px rgba(0,0,0,0.12)',zIndex:10}},
      [
        ['react-smile', () => I.smile(16, '#555'), 'React'],
        ['react-up', () => I.thumbsUp(16, '#555'), 'Thumbs up'],
        ['react-reply', () => I.reply(16, '#555'), 'Reply'],
        ['react-pin', () => I.bookmark(16, '#555'), 'Save'],
        ['react-more', () => I.dotsHorizontal(16, '#555'), 'More'],
      ].map(([key, render, title]) => React.createElement('button',{key,type:'button',style:{background:'none',border:'none',cursor:'pointer',padding:'4px 6px',borderRadius:6,color:'#555',display:'flex',alignItems:'center'},title}, render()))
    )
  );
}

/* ─── Typing indicator ─── */
function TypingIndicator() {
  return React.createElement('div',{style:{display:'flex',gap:12,padding:'6px 16px',alignItems:'center'}},
    React.createElement('div',{style:{width:38,height:38,borderRadius:'50%',background:'#4d0a52',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:15,flexShrink:0}},'K'),
    React.createElement('div',{style:{background:'#F8F4FA',border:'1px solid #EAE0EF',borderRadius:12,padding:'10px 16px',display:'flex',alignItems:'center',gap:10}},
      React.createElement('div',{style:{display:'flex',gap:4}},
        [0,1,2].map(i=>React.createElement('div',{key:i,style:{width:7,height:7,borderRadius:'50%',background:'#4d0a52',opacity:0.6,animation:`bounce 1s ease-in-out ${i*0.15}s infinite`}}))
      ),
      React.createElement('span',{style:{fontSize:13,color:'#6B8EAE'}},'KobiAI is thinking…')
    )
  );
}

/* ─── Slash popover ─── */
function SlashPopover({ input, onSelect }) {
  const cmds=[
    {cmd:'/ask',desc:'Ask KobiAI a question',handler:true},
    {cmd:'/add-note',desc:'Add a maintenance note',handler:true},
    {cmd:'/incident',desc:'Log a structured incident',handler:true},
    {cmd:'/search',desc:'Search messages and docs',handler:true},
    {cmd:'/assign',desc:'Assign incident to technician',handler:false},
    {cmd:'/playbook',desc:'Run maintenance playbook',handler:false},
    {cmd:'/report',desc:'Generate weekly report',handler:false},
  ];
  const term=input.slice(1).toLowerCase();
  const filtered=cmds.filter(c=>c.cmd.slice(1).startsWith(term));
  if(!filtered.length) return null;
  return React.createElement('div',{style:{position:'absolute',bottom:'100%',left:0,right:0,background:'#fff',border:'1px solid #E8ECF0',borderRadius:12,boxShadow:'0 -6px 24px rgba(0,0,0,0.12)',zIndex:50,overflow:'hidden',animation:'slideUp 0.15s ease-out',marginBottom:6}},
    React.createElement('div',{style:{padding:'8px 14px',fontSize:11,fontWeight:700,color:'#9BA8B4',borderBottom:'1px solid #F0F2F4',textTransform:'uppercase',letterSpacing:'0.07em'}},'Commands'),
    filtered.map((c,i)=>React.createElement('button',{key:c.cmd,onClick:()=>onSelect(c),
      style:{display:'flex',alignItems:'center',gap:12,width:'100%',padding:'10px 16px',background:'none',border:'none',textAlign:'left',cursor:'pointer',borderBottom:i<filtered.length-1?'1px solid #F7F9FB':'none'},
      onMouseEnter:e=>e.currentTarget.style.background='#F3EAF5',
      onMouseLeave:e=>e.currentTarget.style.background='none'},
      React.createElement('span',{style:{fontWeight:700,color:'#4d0a52',fontSize:13,minWidth:90}},c.cmd),
      React.createElement('span',{style:{color:'#6B8EAE',fontSize:12}},c.desc),
      !c.handler&&React.createElement('span',{style:{marginLeft:'auto',fontSize:10,color:'#B0B8C4',fontStyle:'italic'}},'coming soon')
    ))
  );
}

/* ─── Voice wave ─── */
function VoiceWave({ active }) {
  if (!active) return null;
  return React.createElement('div',{style:{display:'flex',alignItems:'center',gap:3,padding:'0 8px'}},
    React.createElement('div',{style:{width:7,height:7,borderRadius:'50%',background:'#E53935',animation:'pulse 1s infinite'}}),
    [16,22,14,20,12].map((h,i)=>React.createElement('div',{key:i,style:{width:3,height:h,borderRadius:2,background:'#E53935',animation:`wave ${0.4+i*0.1}s ease-in-out infinite alternate`}}))
  );
}

/* ─── Docs drop zone ─── */
function DocsDropZone({ onDrop }) {
  const I = window.Icons;
  const [dragging, setDragging] = useState(false);
  return React.createElement('div',{
    onDragOver:e=>{e.preventDefault();setDragging(true);},
    onDragLeave:()=>setDragging(false),
    onDrop:e=>{e.preventDefault();setDragging(false);const f=e.dataTransfer.files[0];if(f)onDrop(f);},
    style:{margin:'14px 18px',padding:'28px 24px',border:`2px dashed ${dragging?'#4d0a52':'#C5D0DB'}`,borderRadius:14,background:dragging?'#F3EAF5':'#F7F9FB',textAlign:'center',transition:'all 0.2s',cursor:'pointer'}
  },
    React.createElement('div',{style:{display:'flex',justifyContent:'center',marginBottom:10}}, I && I.upload(36, '#4d0a52')),
    React.createElement('div',{style:{fontWeight:700,color:'#1A2433',fontSize:15,marginBottom:4}},'Drop documents here to feed the AI'),
    React.createElement('div',{style:{fontSize:13,color:'#8B97A3',marginBottom:6}},'PDFs · Schematics · Manuals · Images'),
    React.createElement('div',{style:{fontSize:12,color:'#4CAF50',fontWeight:600,display:'flex',alignItems:'center',justifyContent:'center',gap:6}}, I && I.lock(14, '#4CAF50'), 'Files stay on-prem. Nothing leaves this factory.')
  );
}

/* ─── Composer ─── */
function Composer({ channelName, onSend, onVoice, voiceActive, input, setInput, onSlashSelect, inputRef, showSlash }) {
  const I = window.Icons;
  const fmtBtns = [
    ['B',()=>{},'font-weight:700'],['I',()=>{},'font-style:italic'],
    ['S',()=>{},'text-decoration:line-through'],
  ];
  return React.createElement('div',{style:{borderTop:'1px solid #E8ECF0',background:'#fff',flexShrink:0,position:'relative',padding:'8px 14px 12px'}},
    showSlash&&React.createElement(SlashPopover,{input,onSelect:onSlashSelect}),
    React.createElement('div',{style:{border:'1.5px solid #C5D0DB',borderRadius:12,background:'#FAFBFC',overflow:'hidden'}},
      // Formatting bar
      React.createElement('div',{style:{display:'flex',alignItems:'center',gap:2,padding:'6px 10px 2px',borderBottom:'1px solid #F0F2F4'}},
        ['B','I','S','H'].map(btn=>React.createElement('button',{key:btn,style:{background:'none',border:'none',cursor:'pointer',width:26,height:26,borderRadius:5,fontSize:12,fontWeight:700,color:'#6B7280',display:'flex',alignItems:'center',justifyContent:'center'},
          onMouseEnter:e=>e.currentTarget.style.background='#F3EAF5',onMouseLeave:e=>e.currentTarget.style.background='none'},btn)),
        React.createElement('div',{style:{width:1,height:16,background:'#E8ECF0',margin:'0 4px'}}),
        I&&[['lock',I.lock],['docs',I.fileText],['chat',I.chat]].map(([k,ic])=>React.createElement('button',{key:k,style:{background:'none',border:'none',cursor:'pointer',padding:'4px 5px',borderRadius:5,display:'flex',alignItems:'center',color:'#6B7280'},
          onMouseEnter:e=>e.currentTarget.style.background='#F3EAF5',onMouseLeave:e=>e.currentTarget.style.background='none'},ic(15,'#6B7280')))
      ),
      // Input row
      React.createElement('div',{style:{display:'flex',alignItems:'flex-end',padding:'8px 10px',gap:8}},
        React.createElement('button',{type:'button',style:{background:'none',border:'none',cursor:'pointer',color:'#8B97A3',padding:'0 4px',lineHeight:1,flexShrink:0,marginBottom:1,display:'flex'}}, I && I.plus(20, '#8B97A3')),
        React.createElement(VoiceWave,{active:voiceActive}),
        React.createElement('textarea',{
          ref:inputRef, value:input, onChange:e=>setInput(e.target.value),
          onKeyDown:e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();onSend();}},
          placeholder:`Write to #${channelName}`, rows:1,
          style:{flex:1,background:'none',border:'none',outline:'none',resize:'none',fontSize:14,color:'#1A2433',lineHeight:1.6,maxHeight:120,overflow:'auto',fontFamily:'inherit',paddingTop:2}
        }),
        React.createElement('button',{onClick:onVoice,
          style:{background:voiceActive?'#FEE2E2':'#F3F4F6',border:'none',cursor:'pointer',padding:'6px 8px',borderRadius:8,color:voiceActive?'#E53935':'#6B7280',transition:'all 0.2s',flexShrink:0,display:'flex',alignItems:'center'}},
          I&&I.mic(18,voiceActive?'#E53935':'#6B7280')
        ),
        React.createElement('button',{onClick:onSend,disabled:!input.trim(),
          style:{background:input.trim()?'#4d0a52':'#E8ECF0',border:'none',borderRadius:9,padding:'7px 14px',color:input.trim()?'#fff':'#9BA8B4',fontSize:14,fontWeight:700,cursor:input.trim()?'pointer':'default',transition:'all 0.2s',flexShrink:0,display:'flex',alignItems:'center'}},
          I&&I.send(16,input.trim()?'#fff':'#9BA8B4')
        )
      )
    ),
    React.createElement('div',{style:{fontSize:11,color:'#B0B8C4',marginTop:5,paddingLeft:4}},'Type / for commands · @kobi to ask AI')
  );
}

/* ─── Main ChatView ─── */
function ChatView() {
  const I = window.Icons;
  const { activeChannel, messages, addMessage, notesAdded, setNotesAdded, addToast, openIncidentCount, setOpenIncidentCount, setRightPanel, setShowSearchOverlay, t, role } = useKobi();
  const { channels, users, machines, botResponses, voicePrefills } = window.KobiData;
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showIncident, setShowIncident] = useState(false);
  const [machineView, setMachineView] = useState('home');
  const msgEndRef = useRef(null);
  const inputRef = useRef(null);
  const [, forceUpdate] = useState(0);

  const channel = channels.find(ch => ch.slug === activeChannel);
  const channelMessages = messages[activeChannel] || [];
  const machine = channel?.machineId ? machines[channel.machineId] : null;

  useEffect(() => { if (channel?.machineId) setMachineView('home'); }, [activeChannel]);
  useEffect(() => {
    if (msgEndRef.current?.parentElement) { const p=msgEndRef.current.parentElement; p.scrollTop=p.scrollHeight; }
  }, [channelMessages.length, typing]);

  useEffect(() => {
    window._kobiTypingUpdate = (id, text, sources) => {
      const m = window._kobiMessages || {}; m[id]={text,sources}; window._kobiMessages=m; forceUpdate(n=>n+1);
    };
    return () => { delete window._kobiTypingUpdate; };
  }, []);

  const getBotResponse = useCallback((userText) => {
    const slug = activeChannel;
    const key = slug.replace('machine-','').split('-')[0];
    const pool = botResponses[key] || botResponses.siemens || [];
    const matched = pool.find(r => r.trigger?.some(tk => userText.toLowerCase().includes(tk.toLowerCase())));
    const response = matched || pool[0] || { markdown: 'I\'m ready to help. Could you clarify your question?', sources: [] };
    const sources = notesAdded
      ? [{ title:'Your note (just now)', ref:'Added by you · today', isNote:true }, ...(response.sources||[])]
      : (response.sources||[]);
    return { ...response, sources };
  }, [activeChannel, notesAdded]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;
    const userId = role==='manager'?'martin':'jozef';
    addMessage(activeChannel, { id:Date.now()+'u', userId, time:new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}), text });
    setInput('');
    if (!text.includes('@kobi') && !text.startsWith('/ask')) return;
    setTyping(true);
    await new Promise(r => setTimeout(r, 1200+Math.random()*600));
    setTyping(false);
    const resp = getBotResponse(text);
    const fullText = resp.markdown || resp.text || '';
    const botId = Date.now()+'b';
    addMessage(activeChannel, { id:botId, userId:'kobi', time:new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}), isBot:true, markdown:'', sources:[], diagram:resp.diagram, _typing:true });
    let revealed='';
    for (const ch of fullText.split('')) {
      await new Promise(r => setTimeout(r, 16));
      revealed += ch;
      window._kobiTypingUpdate && window._kobiTypingUpdate(botId, revealed);
    }
    window._kobiTypingUpdate && window._kobiTypingUpdate(botId, fullText, resp.sources);
  }, [activeChannel, role, getBotResponse, addMessage]);

  const getDisplayMessages = () => channelMessages.map(msg => {
    if (window._kobiMessages?.[msg.id]) return { ...msg, markdown:window._kobiMessages[msg.id].text, sources:window._kobiMessages[msg.id].sources||msg.sources };
    return msg;
  });

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    if (text==='/add-note') { setInput(''); setShowAddNote(true); return; }
    if (text==='/incident') { setInput(''); setShowIncident(true); return; }
    if (text==='/search' || text.startsWith('/search ')) { setInput(''); setShowSearchOverlay(true); return; }
    sendMessage(text);
  };

  const handleSlashSelect = (cmd) => {
    if (!cmd.handler) { addToast('Coming in production 🚀','info'); setInput(''); return; }
    if (cmd.cmd==='/add-note') { setInput(''); setShowAddNote(true); return; }
    if (cmd.cmd==='/incident') { setInput(''); setShowIncident(true); return; }
    if (cmd.cmd==='/search') { setInput(''); setShowSearchOverlay(true); return; }
    setInput(cmd.cmd==='/ ask'?'@kobi ':cmd.cmd+' ');
    inputRef.current?.focus();
  };

  const handleVoice = () => {
    if (voiceActive) { setVoiceActive(false); return; }
    setVoiceActive(true);
    const prefill = voicePrefills[activeChannel]||'@kobi Tell me about recent issues on this machine.';
    setTimeout(()=>{
      setVoiceActive(false);
      let i=0; const iv=setInterval(()=>{ setInput(prefill.slice(0,++i)); if(i>=prefill.length){clearInterval(iv);inputRef.current?.focus();} },28);
    },2000);
  };

  const handleFileDrop = (file) => {
    const sizeMB=(file.size/1048576).toFixed(1);
    const pages=Math.max(1,Math.round(parseFloat(sizeMB)*25));
    addMessage('docs-drop',{id:Date.now()+'doc',userId:'kobi',time:new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}),isBot:true,isIngestion:true,file:{name:file.name,size:sizeMB,pages,chunks:pages*4,diagrams:Math.round(pages*0.1),machine:'#machine-siemens-s7-1500',status:'parsing'}});
    addToast('Document received. Indexing…','info');
  };

  const handleMachineAction = (action) => {
    if (action==='chat') { setMachineView('chat'); }
    else if (action==='ask') { setMachineView('chat'); setTimeout(()=>{ setInput('@kobi '); inputRef.current?.focus(); },60); }
    else if (action==='incident') { setMachineView('chat'); setTimeout(()=>setShowIncident(true),60); }
  };

  const handleNoteSubmit = (note) => {
    setShowAddNote(false); setNotesAdded(true); addToast(t('noteSaved'));
    const userId=role==='manager'?'martin':'jozef';
    addMessage(activeChannel,{id:Date.now()+'note',userId:'kobi',time:new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}),isBot:true,markdown:`🧠 **New knowledge added by @${userId}** — *just now*\n_"${note.text}"_\nCategory: ${note.category} · Severity: ${note.severity} · Indexed in 2.1s · Now searchable.`,sources:[]});
  };

  const handleIncidentSubmit = (inc) => {
    setShowIncident(false); setOpenIncidentCount(n=>n+1); addToast(t('incidentSubmitted'));
    const userId=role==='manager'?'martin':'jozef';
    const incId=`INC-2026-0${490+Math.floor(Math.random()*10)}`;
    addMessage(activeChannel,{id:Date.now()+'inc',userId:'kobi',time:new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}),isBot:true,markdown:`🚨 **Incident ${incId} opened by @${userId}**\nMachine: ${machine?.name||'Machine'} · Severity: ${inc.severity} · Status: **Awaiting approval**\n_"${inc.description}"_\n*View in Logbook →*`,sources:[]});
    addMessage('incidents',{id:Date.now()+'incc',isIncidentCard:true,incident:{id:incId,machine:machine?.name||'Machine',issue:(inc.description||'').slice(0,40)+'…',severity:inc.severity,status:'awaiting-approval',openedBy:userId,opened:'just now',notes:inc.description,resolution:inc.resolution}});
  };

  const isDashboard = activeChannel==='dashboard';
  const isDocsChannel = activeChannel==='docs-drop';
  const showSlash = input.startsWith('/') && input.length>=1;
  const displayMessages = getDisplayMessages();

  return React.createElement('div',{style:{flex:1,display:'flex',flexDirection:'column',background:'#fff',minWidth:0,overflow:'hidden'}},
    // Header
    React.createElement('div',{style:{height:52,borderBottom:'1px solid #E8ECF0',display:'flex',alignItems:'center',padding:'0 18px',gap:10,flexShrink:0,background:'#fff'}},
      channel&&React.createElement(React.Fragment,null,
        React.createElement('span',{style:{display:'flex',flexShrink:0}}, I && I.channelHeaderIcon(channel, 20, '#1A2433')),
        React.createElement('div',null,
          React.createElement('div',{style:{fontWeight:700,fontSize:15,color:'#1A2433'}},channel.name),
          React.createElement('div',{style:{fontSize:11,color:'#9BA8B4'}},`${channel.members} ${t('members')}${channel.purpose?' · '+channel.purpose.slice(0,50):''}`)
        ),
        machine&&React.createElement('div',{style:{marginLeft:'auto',display:'flex',gap:8}},
          machine&&machineView==='chat'&&React.createElement('button',{onClick:()=>setMachineView('home'),style:{padding:'5px 12px',background:'#F3EAF5',border:'1px solid #C9A8D0',borderRadius:7,fontSize:12,color:'#4d0a52',cursor:'pointer',fontWeight:500}},'← Overview'),
          ...[{label:t('machineCard'),fn:()=>setRightPanel({type:'machine-card',machineId:channel.machineId})},{label:t('logbook'),fn:()=>setRightPanel({type:'logbook'})},{label:t('askKobi'),fn:()=>{setMachineView('chat');setInput('@kobi ');inputRef.current?.focus();}}].map(btn=>React.createElement('button',{key:btn.label,onClick:btn.fn,style:{padding:'5px 12px',background:'#F3EAF5',border:'1px solid #C9A8D0',borderRadius:7,fontSize:12,color:'#4d0a52',cursor:'pointer',fontWeight:500}},btn.label))
        )
      )
    ),

    // Content
    machine && machineView==='home'
      ? React.createElement(window.MachineHome,{machineId:channel.machineId,onAction:handleMachineAction})
      : React.createElement('div',{style:{flex:1,overflowY:'auto',padding:'8px 0'}},
          isDashboard ? React.createElement(window.DashboardView||'div',null)
            : React.createElement(React.Fragment,null,
                isDocsChannel&&React.createElement(DocsDropZone,{onDrop:handleFileDrop}),
                displayMessages.map((msg,i)=>{
                  const prev=displayMessages[i-1];
                  const grouped=prev&&prev.userId===msg.userId&&!msg.isIncidentCard&&!prev.isIncidentCard&&!msg.isDivider;
                  return React.createElement(Message,{key:msg.id,msg,isGrouped:grouped});
                }),
                typing&&React.createElement(TypingIndicator),
                React.createElement('div',{ref:msgEndRef})
              )
        ),

    // Composer
    !(isDashboard||(machine&&machineView==='home'))&&React.createElement(Composer,{channelName:channel?.name||activeChannel,onSend:handleSend,onVoice:handleVoice,voiceActive,input,setInput,onSlashSelect:handleSlashSelect,inputRef,showSlash}),

    showAddNote&&React.createElement(window.AddNoteDialog,{machine,onSave:handleNoteSubmit,onClose:()=>setShowAddNote(false)}),
    showIncident&&React.createElement(window.IncidentDialog,{machine,onSubmit:handleIncidentSubmit,onClose:()=>setShowIncident(false)})
  );
}

Object.assign(window, { ChatView, Avatar, MarkdownText });
