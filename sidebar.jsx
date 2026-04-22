// KobiAI Sidebar v2 — structured navigation, accessible, vector icons

function Sidebar() {
  const { role, activeChannel, setActiveChannel, setShowOnPremModal, setSidebarOpen, setRightPanel, t, activeWorkspaceId } = useKobi();
  const { buildMachineNavEntries } = window.KobiData;
  const [channelSearch, setChannelSearch] = useState('');
  const [expandedSection, setExpandedSection] = useState({ overview: true, machines: true, channels: true, dms: true });
  const I = window.Icons;

  const dms = [
    { id: 'kobi',   name: 'Kobi AI',        initials: 'K',  color: '#4d0a52', online: true,  isBot: true },
    { id: 'martin', name: 'Martin Horváth',  initials: 'MH', color: '#1E5B7A', online: true  },
    { id: 'pavol',  name: 'Pavol Kováč',     initials: 'PK', color: '#5A3A8E', online: false },
    { id: 'tomas',  name: 'Tomáš Gazda',     initials: 'TG', color: '#7A3A2E', online: false },
  ].filter(u => u.id !== (role === 'manager' ? 'martin' : 'jozef'));

  const otherChannels = [
    { slug: 'general',   name: 'General',    icon: I.general },
    { slug: 'incidents', name: 'Incidents',  icon: I.alert,   mentions: 1 },
    { slug: 'docs-drop', name: 'Docs Drop',  icon: I.inbox },
  ];

  const machineList = buildMachineNavEntries(activeWorkspaceId, t);

  const ACTIVE_BG   = 'rgba(255,255,255,0.18)';
  const HOVER_BG    = 'rgba(255,255,255,0.09)';
  const TEXT_COLOR  = 'rgba(255,255,255,0.88)';
  const MUTED_COLOR = 'rgba(255,255,255,0.5)';

  function NavBtn({ isActive, onClick, children }) {
    const [hov, setHov] = useState(false);
    return React.createElement('button', {
      onClick,
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => setHov(false),
      style: {
        display: 'flex', alignItems: 'center', gap: 11,
        width: '100%', minHeight: 48, padding: '0 14px 0 16px',
        background: isActive ? ACTIVE_BG : hov ? HOVER_BG : 'transparent',
        border: 'none',
        borderLeft: isActive ? '3px solid #4CAF50' : '3px solid transparent',
        color: TEXT_COLOR, fontSize: 15, textAlign: 'left', cursor: 'pointer',
        transition: 'background 0.12s',
        borderRadius: '0 8px 8px 0',
        marginRight: 8,
      }
    }, children);
  }

  function SectionHeader({ label, sectionKey, icon }) {
    return React.createElement('button', {
      onClick: () => setExpandedSection(s => ({...s, [sectionKey]: !s[sectionKey]})),
      style: {
        display: 'flex', alignItems: 'center', gap: 8,
        width: '100%', padding: '16px 14px 6px',
        background: 'none', border: 'none', cursor: 'pointer',
        color: MUTED_COLOR, fontSize: 11, fontWeight: 700,
        letterSpacing: '0.09em', textTransform: 'uppercase',
      }
    },
      expandedSection[sectionKey]
        ? I.chevronDown(13, MUTED_COLOR)
        : I.chevronRight(13, MUTED_COLOR),
      React.createElement('span', null, label),
      React.createElement('div', { style: { flex: 1 } })
    );
  }

  return React.createElement('div', {
    style: {
      display: 'flex', flexDirection: 'column', height: '100%',
      background: '#4d0a52', width: 256, flexShrink: 0, overflow: 'hidden',
    }
  },
    // Search (team / site switcher is in the top bar only)
    React.createElement('div', { style: { padding: '14px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.1)' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '8px 12px', gap: 8 } },
        I.search(15, MUTED_COLOR),
        React.createElement('input', {
          value: channelSearch,
          onChange: e => setChannelSearch(e.target.value),
          placeholder: t('findChannel'),
          style: { background: 'none', border: 'none', color: TEXT_COLOR, fontSize: 14, flex: 1, outline: 'none' }
        })
      )
    ),

    // Nav
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '6px 0' } },

      // Overview
      React.createElement(SectionHeader, { label: 'Overview', sectionKey: 'overview' }),
      expandedSection.overview && React.createElement(NavBtn, { isActive: activeChannel === 'dashboard', onClick: () => { setActiveChannel('dashboard'); setSidebarOpen(false); } },
        I.barChart(18, activeChannel === 'dashboard' ? '#4CAF50' : TEXT_COLOR),
        React.createElement('span', null, 'Dashboard')
      ),

      // Machines
      React.createElement(SectionHeader, { label: 'Machines', sectionKey: 'machines' }),
      expandedSection.machines && machineList.map(m =>
        React.createElement('div', { key: m.slug },
          React.createElement(NavBtn, {
            isActive: activeChannel === m.slug,
            onClick: () => { setActiveChannel(m.slug); setSidebarOpen(false); }
          },
            m.icon(18, activeChannel === m.slug ? '#4CAF50' : TEXT_COLOR),
            React.createElement('div', { style: { flex: 1, minWidth: 0 } },
              React.createElement('div', { style: { fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14 } }, m.name),
              React.createElement('div', { style: { fontSize: 11, color: MUTED_COLOR } }, m.short)
            ),
            React.createElement('span', { style: { width: 7, height: 7, borderRadius: '50%', background: m.status === 'online' ? '#4CAF50' : '#FF9800', flexShrink: 0 } })
          )
        )
      ),

      // Channels
      React.createElement(SectionHeader, { label: 'Channels', sectionKey: 'channels' }),
      expandedSection.channels && otherChannels.map(ch =>
        React.createElement(NavBtn, { key: ch.slug, isActive: activeChannel === ch.slug, onClick: () => { setActiveChannel(ch.slug); setSidebarOpen(false); } },
          ch.icon(18, activeChannel === ch.slug ? '#4CAF50' : TEXT_COLOR),
          React.createElement('span', { style: { flex: 1 } }, ch.name),
          ch.mentions > 0 && React.createElement('span', { style: { background: '#F44336', color: '#fff', borderRadius: 10, fontSize: 11, fontWeight: 700, padding: '2px 7px', minWidth: 20, textAlign: 'center' } }, ch.mentions)
        )
      ),

      // Direct messages
      React.createElement(SectionHeader, { label: 'Direct Messages', sectionKey: 'dms' }),
      expandedSection.dms && dms.map(u =>
        React.createElement(NavBtn, { key: u.id, isActive: activeChannel === 'dm-' + u.id, onClick: () => { setActiveChannel('dm-' + u.id); setSidebarOpen(false); } },
          React.createElement('div', { style: { position: 'relative', flexShrink: 0 } },
            React.createElement('div', { style: { width: 28, height: 28, borderRadius: '50%', background: u.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 700 } }, u.initials),
            React.createElement('span', { style: { position: 'absolute', bottom: 0, right: 0, width: 8, height: 8, background: u.online ? '#4CAF50' : 'rgba(255,255,255,0.3)', borderRadius: '50%', border: '2px solid #4d0a52' } })
          ),
          React.createElement('div', { style: { flex: 1, minWidth: 0 } },
            React.createElement('div', { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14 } }, u.name),
            u.isBot && React.createElement('div', { style: { fontSize: 10, color: MUTED_COLOR } }, 'AI Assistant')
          )
        )
      )
    ),

    // Footer
    React.createElement('button', {
      onClick: () => setShowOnPremModal(true),
      style: { padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', color: MUTED_COLOR, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left', width: '100%' }
    },
      I.shield(14, '#4CAF50'),
      React.createElement('span', null, t('onPrem'))
    )
  );
}

function SidebarDrawer() {
  const { sidebarOpen, setSidebarOpen, deviceMode } = useKobi();
  const compactNav = deviceMode === 'mobile' || deviceMode === 'tablet';
  if (!compactNav || !sidebarOpen) return null;
  return React.createElement('div', { style: { position: 'absolute', inset: 0, zIndex: 100, display: 'flex' } },
    React.createElement('div', { onClick: () => setSidebarOpen(false), style: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' } }),
    React.createElement('div', { style: { position: 'relative', zIndex: 1, height: '100%' } },
      React.createElement(Sidebar)
    )
  );
}

Object.assign(window, { Sidebar, SidebarDrawer });
