// KobiAI Right Panel — Machine Card, Logbook, Knowledge Panel

const { useState } = React;

function MachineCardPanel({ machineId, onClose }) {
  const { setActiveChannel, addToast } = useKobi();
  const machine = window.KobiData.machines[machineId];
  const I = window.Icons;
  if (!machine) return null;

  const statusColor = machine.status === 'online' ? '#4CAF50' : '#FF9800';
  const statusLabel = machine.status === 'online' ? 'Online' : 'Maintenance';

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%' } },
    React.createElement('div', { style: { padding: '14px 16px', borderBottom: '1px solid #E8ECF0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
      React.createElement('div', { style: { fontWeight: 700, fontSize: 14, color: '#1A2433' } }, 'Machine Card'),
      React.createElement('button', { onClick: onClose, style: { background: 'none', border: 'none', cursor: 'pointer', color: '#8B97A3', fontSize: 20 } }, '×')
    ),
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: 16 } },
      // Machine image placeholder
      React.createElement('div', { style: { height: 120, background: `linear-gradient(135deg, ${machine.color}22, ${machine.color}44)`, border: `1px solid ${machine.color}33`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, position: 'relative' } },
        React.createElement('div', { style: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center' } },
            machineId === 'siemens' ? I.gear(40, machine.color) : machineId === 'kuka' ? I.robot(40, machine.color) : I.cutter(40, machine.color)),
          React.createElement('div', { style: { fontSize: 10, color: machine.color, fontFamily: 'monospace', opacity: 0.7 } }, `// ${machine.type.toUpperCase()} //`)
        ),
        React.createElement('div', { style: { position: 'absolute', top: 10, right: 10, fontSize: 12, fontWeight: 600, color: statusColor, display: 'flex', alignItems: 'center', gap: 6 } }, I.statusDot(8, statusColor), statusLabel)
      ),

      React.createElement('div', { style: { fontWeight: 800, fontSize: 16, color: '#1A2433', marginBottom: 4 } }, machine.name),
      React.createElement('div', { style: { fontSize: 12, color: '#8B97A3', marginBottom: 16 } }, machine.type),

      // Details grid
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', marginBottom: 16 } },
        [
          ['OEM', machine.oem],
          ['Location', machine.location],
          ['Commissioned', machine.commissioned],
          ['Last Incident', machine.lastIncident],
        ].map(([k, v]) => React.createElement('div', { key: k },
          React.createElement('div', { style: { fontSize: 10, color: '#9BA8B4', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 } }, k),
          React.createElement('div', { style: { fontSize: 13, color: '#1A2433', fontWeight: 500 } }, v)
        ))
      ),

      // Knowledge stats
      React.createElement('div', { style: { background: '#F0F5FA', border: '1px solid #C5D9EE', borderRadius: 10, padding: '12px 14px', marginBottom: 16 } },
        React.createElement('div', { style: { fontSize: 11, fontWeight: 700, color: '#1E3A5F', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 } }, I.brain(14, '#1E3A5F'), 'Knowledge Base'),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 } },
          [
            ['Docs', machine.docsIndexed],
            ['Chunks', machine.chunksIndexed.toLocaleString()],
            ['Diagrams', machine.diagramsExtracted],
          ].map(([k, v]) => React.createElement('div', { key: k, style: { textAlign: 'center' } },
            React.createElement('div', { style: { fontWeight: 800, fontSize: 18, color: '#1E3A5F' } }, v),
            React.createElement('div', { style: { fontSize: 10, color: '#6B8EAE' } }, k)
          ))
        )
      ),

      // Actions
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
        React.createElement('button', {
          onClick: () => { setActiveChannel('incidents'); onClose(); },
          style: { width: '100%', padding: '9px 14px', background: '#EEF4FB', border: '1px solid #C5D9EE', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#1E3A5F', textAlign: 'left' }
        }, React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 8 } }, I.alert(16, '#1E3A5F'), 'View all incidents')),
        React.createElement('button', {
          onClick: () => { setActiveChannel('docs-drop'); onClose(); },
          style: { width: '100%', padding: '9px 14px', background: '#EEF4FB', border: '1px solid #C5D9EE', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#1E3A5F', textAlign: 'left' }
        }, React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 8 } }, I.upload(16, '#1E3A5F'), 'Upload docs'))
      )
    )
  );
}

function LogbookPanel({ onClose }) {
  const I = window.Icons;
  const { incidents } = window.KobiData;
  const statusColors = { resolved: '#4CAF50', 'in-progress': '#FF9800', open: '#F44336', 'awaiting-approval': '#FF9800' };
  const sevColors = { critical: '#F44336', warning: '#FF9800', info: '#2196F3' };

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%' } },
    React.createElement('div', { style: { padding: '14px 16px', borderBottom: '1px solid #E8ECF0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
      React.createElement('div', { style: { fontWeight: 700, fontSize: 14, color: '#1A2433', display: 'flex', alignItems: 'center', gap: 8 } }, I.clipboardList(18, '#1A2433'), 'Maintenance Logbook'),
      React.createElement('button', { onClick: onClose, style: { background: 'none', border: 'none', cursor: 'pointer', color: '#8B97A3', fontSize: 20 } }, '×')
    ),
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: 12 } },
      incidents.map(inc => React.createElement('div', {
        key: inc.id,
        style: { background: '#fff', border: `1px solid ${sevColors[inc.severity] || '#E4E7EB'}`, borderLeft: `3px solid ${sevColors[inc.severity] || '#E4E7EB'}`, borderRadius: 8, padding: '10px 12px', marginBottom: 8, cursor: 'pointer' },
        onMouseEnter: e => e.currentTarget.style.background = '#F7F9FB',
        onMouseLeave: e => e.currentTarget.style.background = '#fff',
      },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 3 } },
          React.createElement('span', { style: { fontWeight: 700, fontSize: 12, color: '#1E3A5F' } }, inc.id),
          React.createElement('span', { style: { fontSize: 11, color: statusColors[inc.status], fontWeight: 600 } }, inc.status)
        ),
        React.createElement('div', { style: { fontSize: 13, color: '#1A2433', fontWeight: 500, marginBottom: 2 } }, inc.issue),
        React.createElement('div', { style: { fontSize: 11, color: '#8B97A3' } }, `${inc.machine} · ${inc.opened}`)
      ))
    )
  );
}

function KnowledgePanel({ onClose }) {
  const I = window.Icons;
  const { setMediaViewer } = useKobi();
  const [activeTab, setActiveTab] = useState('docs');
  const { docs: docsList } = window.KobiData || { docs: [] };

  const indexedDocs = [
    { name: 'Siemens_SINAMICS_S120_FaultManual.pdf', machine: 'Siemens S7-1500', pages: 247, date: '12 Mar 2026' },
    { name: 'KUKA_Software_KSS_8.6.pdf', machine: 'KUKA KR 60-3', pages: 312, date: '5 Feb 2026' },
    { name: 'Zund_G3_Operator_Manual_EN.pdf', machine: 'Zünd G3', pages: 412, date: '2 days ago' },
    { name: 'Machine_Config_CNC_Line3.pdf', machine: 'Siemens S7-1500', pages: 14, date: '8 Jan 2026' },
    { name: 'Plant_Safety_SOP-042.pdf', machine: 'All', pages: 38, date: '15 Jan 2026' },
    { name: 'KUKA_KR60_System_Manual_v4.pdf', machine: 'KUKA KR 60-3', pages: 461, date: '3 days ago' },
  ];

  const myNotes = [
    { text: 'Re-tension timing belt to 4.5N after replacement (factory spec 4.0N slips)', machine: 'Siemens S7-1500', date: 'Today', by: 'J. Novák' },
    { text: 'Zone 3 vacuum ports collect debris 3× faster than other zones — add to pre-shift check', machine: 'Zünd G3', date: 'Yesterday', by: 'P. Kováč' },
    { text: 'TCP calibration mandatory after every welding tip change (adds 4 min)', machine: 'KUKA KR 60-3', date: '5 Feb 2026', by: 'M. Horváth' },
  ];

  const gaps = [
    { text: 'Zünd G3 — electrical schema v2.3 not indexed', machine: 'Zünd G3' },
    { text: 'KUKA KR 60 — firmware release notes v4.1 missing', machine: 'KUKA KR 60-3' },
    { text: 'Siemens S7-1500 — motor replacement procedure not found', machine: 'Siemens S7-1500' },
  ];

  const tabs = [
    { id: 'docs', label: 'Indexed docs', icon: (c) => I.fileText(14, c) },
    { id: 'notes', label: 'My notes', icon: (c) => I.brain(14, c) },
    { id: 'gaps', label: 'Gaps', icon: (c) => I.alert(14, c) },
  ];

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%' } },
    React.createElement('div', { style: { padding: '14px 16px 0', borderBottom: '1px solid #E8ECF0' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 } },
        React.createElement('div', { style: { fontWeight: 700, fontSize: 14, color: '#1A2433' } }, 'Manage Knowledge'),
        React.createElement('button', { onClick: onClose, style: { background: 'none', border: 'none', cursor: 'pointer', color: '#8B97A3', fontSize: 20 } }, '×')
      ),
      React.createElement('div', { style: { display: 'flex', gap: 0 } },
        tabs.map(tab => React.createElement('button', {
          key: tab.id, type: 'button', onClick: () => setActiveTab(tab.id),
          style: { padding: '6px 12px', background: 'none', border: 'none', borderBottom: activeTab === tab.id ? '2px solid #1E3A5F' : '2px solid transparent', color: activeTab === tab.id ? '#1E3A5F' : '#8B97A3', fontWeight: activeTab === tab.id ? 700 : 400, cursor: 'pointer', fontSize: 12, transition: 'all 0.15s', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 6 }
        }, tab.icon(activeTab === tab.id ? '#1E3A5F' : '#8B97A3'), tab.label))
      )
    ),
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: 12 } },
      activeTab === 'docs' && indexedDocs.map((doc, i) => {
        const pv = window.KobiData?.mediaPreviewForFile ? window.KobiData.mediaPreviewForFile({ name: doc.name }) : null;
        return React.createElement('div', {
          key: i,
          role: pv ? 'button' : undefined,
          tabIndex: pv ? 0 : undefined,
          title: pv ? 'Open in viewer' : undefined,
          onKeyDown: pv ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setMediaViewer(pv); } } : undefined,
          onClick: pv ? () => setMediaViewer(pv) : undefined,
          style: { padding: '8px 10px', borderBottom: '1px solid #F0F2F4', display: 'flex', gap: 8, cursor: pv ? 'pointer' : 'default' },
        },
        React.createElement('span', { style: { display: 'flex', flexShrink: 0 } }, I.fileText(16, '#1E3A5F')),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { style: { fontSize: 13, color: '#1A2433', fontWeight: 500, textDecoration: pv ? 'underline' : 'none', textDecorationColor: 'rgba(30,58,95,0.3)' } }, doc.name),
          React.createElement('div', { style: { fontSize: 11, color: '#8B97A3', marginTop: 2 } }, `${doc.machine} · ${doc.pages} pages · ${doc.date}`)
        )
        );
      }),
      activeTab === 'notes' && myNotes.map((note, i) => React.createElement('div', { key: i, style: { background: '#FFFDF0', border: '1px solid #FFE57F', borderRadius: 8, padding: '10px 12px', marginBottom: 8 } },
        React.createElement('div', { style: { fontSize: 13, color: '#1A2433', marginBottom: 4, lineHeight: 1.5 } }, note.text),
        React.createElement('div', { style: { fontSize: 11, color: '#8B97A3' } }, `${note.machine} · ${note.by} · ${note.date}`)
      )),
      activeTab === 'gaps' && gaps.map((gap, i) => React.createElement('div', { key: i, style: { background: '#FFF3E0', border: '1px solid #FFB74D', borderRadius: 8, padding: '10px 12px', marginBottom: 8 } },
        React.createElement('div', { style: { fontSize: 13, color: '#1A2433', marginBottom: 6 } }, gap.text),
        React.createElement('div', { style: { display: 'flex', gap: 6 } },
          React.createElement('button', { style: { padding: '3px 10px', background: '#1E3A5F', border: 'none', borderRadius: 5, cursor: 'pointer', fontSize: 11, color: '#fff', fontWeight: 600 } }, 'Upload to #docs-drop')
        )
      ))
    )
  );
}

function RightPanel() {
  const { rightPanel, setRightPanel, activeChannel, deviceMode } = useKobi();
  const compactNav = deviceMode === 'mobile' || deviceMode === 'tablet';

  const isDmKobi = activeChannel === 'dm-kobi';
  const show = rightPanel || isDmKobi;
  if (!show) return null;

  const close = () => setRightPanel(null);
  let content;

  if (isDmKobi && !rightPanel) {
    content = React.createElement(KnowledgePanel, { onClose: close });
  } else if (rightPanel?.type === 'machine-card') {
    content = React.createElement(MachineCardPanel, { machineId: rightPanel.machineId, onClose: close });
  } else if (rightPanel?.type === 'logbook') {
    content = React.createElement(LogbookPanel, { onClose: close });
  } else if (rightPanel?.type === 'knowledge') {
    content = React.createElement(KnowledgePanel, { onClose: close });
  } else {
    return null;
  }

  const panelBox = {
    width: deviceMode === 'mobile' ? '100%' : 320,
    maxWidth: '100%',
    height: '100%',
    flexShrink: 0,
    borderLeft: '1px solid #E8ECF0',
    background: '#FAFBFC',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: compactNav ? '-6px 0 28px rgba(0,0,0,0.12)' : 'none',
  };

  if (compactNav) {
    return React.createElement('div', {
      style: { position: 'absolute', inset: 0, zIndex: 85, display: 'flex', flexDirection: 'row', alignItems: 'stretch' },
    },
      React.createElement('button', {
        type: 'button',
        'aria-label': 'Close panel',
        onClick: close,
        style: { flex: 1, minWidth: 0, border: 'none', padding: 0, cursor: 'pointer', background: 'rgba(15,23,42,0.42)' },
      }),
      React.createElement('div', { style: panelBox }, content)
    );
  }

  return React.createElement('div', {
    style: { width: 320, flexShrink: 0, borderLeft: '1px solid #E8ECF0', background: '#FAFBFC', display: 'flex', flexDirection: 'column', overflow: 'hidden' }
  }, content);
}

Object.assign(window, { RightPanel });
