// KobiAI Machine Home — landing page for each machine channel

function MachineHome({ machineId, onAction }) {
  const { setRightPanel, addToast } = useKobi();
  const machine = window.KobiData.machines[machineId];
  const I = window.Icons;

  if (!machine) return null;

  const statusColor = machine.status === 'online' ? '#4CAF50' : '#FF9800';
  const statusLabel = machine.status === 'online' ? 'Online' : 'Maintenance';

  const actions = [
    {
      id: 'status',
      icon: I.activity,
      color: '#1565C0',
      bg: '#E3F2FD',
      border: '#90CAF9',
      label: 'Machine Status',
      desc: 'View live status, specs and indexed knowledge',
      onClick: () => setRightPanel({ type: 'machine-card', machineId }),
    },
    {
      id: 'incident',
      icon: I.alert,
      color: '#B71C1C',
      bg: '#FFEBEE',
      border: '#EF9A9A',
      label: 'Report Incident',
      desc: 'Log a fault, repair or maintenance event',
      onClick: () => onAction('incident'),
    },
    {
      id: 'help',
      icon: I.help,
      color: '#1B5E20',
      bg: '#E8F5E9',
      border: '#A5D6A7',
      label: 'Get Help',
      desc: 'Ask KobiAI — get answers from the manual',
      onClick: () => onAction('ask'),
    },
    {
      id: 'chat',
      icon: I.chat,
      color: '#4A148C',
      bg: '#F3E5F5',
      border: '#CE93D8',
      label: 'Open Chat',
      desc: 'See conversation history and send a message',
      onClick: () => onAction('chat'),
    },
  ];

  return React.createElement('div', {
    style: { flex: 1, overflowY: 'auto', background: '#F5F6F8', padding: '32px 28px' }
  },
    // Machine header
    React.createElement('div', {
      style: { background: '#fff', borderRadius: 16, padding: '24px 28px', marginBottom: 24, border: '1px solid #E4E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }
    },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 20 } },
        // Machine icon placeholder
        React.createElement('div', {
          style: {
            width: 80, height: 80, borderRadius: 16, flexShrink: 0,
            background: `linear-gradient(135deg, ${machine.color}22, ${machine.color}55)`,
            border: `2px solid ${machine.color}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }
        },
          machineId === 'siemens' ? I.gear(40, machine.color) :
          machineId === 'kuka'    ? I.robot(40, machine.color) :
          I.wrench(40, machine.color)
        ),
        React.createElement('div', { style: { flex: 1 } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 } },
            React.createElement('h1', { style: { fontSize: 22, fontWeight: 800, color: '#1A2433', margin: 0 } }, machine.name),
            React.createElement('span', {
              style: { display: 'inline-flex', alignItems: 'center', gap: 5, background: machine.status === 'online' ? '#E8F5E9' : '#FFF8E1', border: `1px solid ${statusColor}44`, borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 700, color: statusColor }
            },
              React.createElement('span', { style: { width: 7, height: 7, borderRadius: '50%', background: statusColor, display: 'inline-block' } }),
              statusLabel
            )
          ),
          React.createElement('div', { style: { fontSize: 15, color: '#6B8EAE', marginBottom: 10 } }, `${machine.type} · ${machine.location}`),
          React.createElement('div', { style: { display: 'flex', gap: 20 } },
            [
              { label: 'Docs indexed', value: machine.docsIndexed },
              { label: 'Knowledge chunks', value: machine.chunksIndexed.toLocaleString() },
              { label: 'Diagrams', value: machine.diagramsExtracted },
              { label: 'Last incident', value: machine.lastIncident },
            ].map(({ label, value }) =>
              React.createElement('div', { key: label },
                React.createElement('div', { style: { fontSize: 11, color: '#9BA8B4', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' } }, label),
                React.createElement('div', { style: { fontSize: 15, fontWeight: 700, color: '#1A2433', marginTop: 2 } }, value)
              )
            )
          )
        )
      )
    ),

    // Action cards
    React.createElement('div', { style: { marginBottom: 12 } },
      React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: '#8B97A3', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 } }, 'What would you like to do?')
    ),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 } },
      actions.map(action => {
        const [hov, setHov] = useState(false);
        return React.createElement('button', {
          key: action.id,
          onClick: action.onClick,
          onMouseEnter: () => setHov(true),
          onMouseLeave: () => setHov(false),
          style: {
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
            padding: '22px 22px', borderRadius: 14,
            background: hov ? action.bg : '#fff',
            border: `1.5px solid ${hov ? action.border : '#E4E7EB'}`,
            cursor: 'pointer', textAlign: 'left',
            boxShadow: hov ? `0 4px 16px ${action.color}20` : '0 1px 4px rgba(0,0,0,0.06)',
            transition: 'all 0.18s ease',
            transform: hov ? 'translateY(-2px)' : 'none',
            minHeight: 130,
          }
        },
          React.createElement('div', {
            style: { width: 48, height: 48, borderRadius: 12, background: action.bg, border: `1.5px solid ${action.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }
          }, action.icon(24, action.color)),
          React.createElement('div', { style: { fontSize: 16, fontWeight: 700, color: '#1A2433', marginBottom: 5 } }, action.label),
          React.createElement('div', { style: { fontSize: 13, color: '#6B8EAE', lineHeight: 1.4 } }, action.desc)
        );
      })
    ),

    // Recent activity hint
    React.createElement('div', {
      style: { marginTop: 24, padding: '14px 18px', background: '#fff', borderRadius: 12, border: '1px solid #E4E7EB', display: 'flex', alignItems: 'center', gap: 12 }
    },
      I.activity(18, '#9BA8B4'),
      React.createElement('div', { style: { fontSize: 13, color: '#6B8EAE' } },
        `Last incident: `,
        React.createElement('strong', { style: { color: '#1A2433' } }, machine.lastIncident),
        ` · ${machine.chunksIndexed.toLocaleString()} knowledge chunks ready`
      ),
      React.createElement('button', {
        onClick: () => onAction('chat'),
        style: { marginLeft: 'auto', padding: '6px 14px', background: '#4d0a52', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }
      }, 'Open Chat →')
    )
  );
}

Object.assign(window, { MachineHome });
