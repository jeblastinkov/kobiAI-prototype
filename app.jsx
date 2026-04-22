// KobiAI App root — TopBar, Shell, Device frame

const { useState, useEffect } = React;

function TopBar() {
  const I = window.Icons;
  const { role, setRole, language, setLanguage, deviceMode, setDeviceMode, showSearchOverlay, setShowSearchOverlay, setSidebarOpen, addToast, t } = useKobi();
  const compactNav = deviceMode === 'mobile' || deviceMode === 'tablet';

  const langs = ['EN','SK','CZ','DE','PL'];
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  return React.createElement('div', {
    style: { height: 50, background: '#4d0a52', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10, flexShrink: 0, zIndex: 10, position: 'relative' }
  },
    // Hamburger when sidebar is off-canvas (tablet + mobile)
    compactNav && React.createElement('button', {
      type: 'button',
      onClick: () => setSidebarOpen(true),
      title: 'Open menu',
      style: { background: 'none', border: 'none', cursor: 'pointer', color: '#C5CCD4', padding: '4px 6px', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }
    }, I.menu(20, '#C5CCD4')),

    // Logo + team name
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 } },
      React.createElement('div', { style: { width: 28, height: 28, background: '#1E3A5F', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13, position: 'relative' } },
        'K',
        React.createElement('span', { style: { position: 'absolute', bottom: -1, right: -1, width: 7, height: 7, background: '#4CAF50', borderRadius: '50%', border: '2px solid #4d0a52' } })
      ),
      deviceMode !== 'mobile' && React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 4, color: '#fff', fontWeight: 700, fontSize: 13 } },
        React.createElement('span', null, 'KobiAI · Bratislava Plant'),
        I.chevronDown(12, 'rgba(255,255,255,0.65)')
      )
    ),

    // Search bar
    React.createElement('button', {
      onClick: () => setShowSearchOverlay(true),
      style: { flex: 1, maxWidth: deviceMode === 'mobile' ? 200 : deviceMode === 'tablet' ? 260 : 320, minWidth: 0, margin: '0 auto', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#8B97A3', fontSize: 13, textAlign: 'left' }
    },
      React.createElement('span', { style:{display:'flex',alignItems:'center'} }, I.search(15, '#8B97A3')),
      React.createElement('span', null, t('search'))
    ),

    // Right controls
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 } },
      // Demo pill
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.22)', borderRadius: 20, padding: '3px 10px', cursor: 'pointer' } },
        React.createElement('span', { style: { width: 6, height: 6, borderRadius: '50%', background: '#FFD54F', display: 'inline-block' } }),
        deviceMode !== 'mobile' && React.createElement('span', { style: { color: '#C5CCD4', fontSize: 11, fontWeight: 600 } }, 'DEMO')
      ),

      // Device preview (always visible so mobile preview can switch back to desktop/tablet)
      React.createElement('div', { style: { display: 'flex', background: 'rgba(0,0,0,0.22)', borderRadius: 6, overflow: 'hidden', flexShrink: 0, alignItems: 'center' } },
        ['desktop', 'tablet', 'mobile'].map((mode) => {
          const active = deviceMode === mode;
          const col = active ? '#fff' : '#8B97A3';
          const sz = deviceMode === 'mobile' ? 15 : 16;
          const icon = mode === 'desktop' ? I.monitor(sz, col) : mode === 'tablet' ? I.tablet(sz, col) : I.smartphone(sz, col);
          const title = mode === 'desktop' ? 'Desktop preview' : mode === 'tablet' ? 'Tablet preview' : 'Mobile preview';
          return React.createElement('button', {
            key: mode, type: 'button', onClick: () => setDeviceMode(mode),
            title,
            style: { padding: deviceMode === 'mobile' ? '5px 7px' : '6px 8px', background: active ? '#1E3A5F' : 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }
          }, icon);
        })
      ),

      // Language
      React.createElement('div', { style: { position: 'relative' } },
        React.createElement('button', {
          type: 'button',
          onClick: () => { setShowLangMenu(l => !l); setShowRoleMenu(false); },
          style: { background: 'rgba(0,0,0,0.22)', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: '#C5CCD4', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }
        },
          React.createElement('span', null, language.toUpperCase()),
          I.chevronDown(11, '#9BA8B4')
        ),
        showLangMenu && React.createElement('div', {
          style: { position: 'absolute', top: '100%', right: 0, marginTop: 4, background: '#3a0a42', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, overflow: 'hidden', zIndex: 100, minWidth: 80 }
        },
          langs.map(l => React.createElement('button', {
            key: l, onClick: () => { setLanguage(l.toLowerCase()); setShowLangMenu(false); },
            style: { display: 'block', width: '100%', padding: '7px 14px', background: language === l.toLowerCase() ? 'rgba(0,0,0,0.25)' : 'none', border: 'none', cursor: 'pointer', color: '#C5CCD4', fontSize: 12, textAlign: 'left', fontWeight: language === l.toLowerCase() ? 700 : 400 }
          }, l))
        )
      ),

      // Role toggle
      React.createElement('div', { style: { position: 'relative' } },
        React.createElement('button', {
          onClick: () => { setShowRoleMenu(r => !r); setShowLangMenu(false); },
          style: { background: 'rgba(0,0,0,0.22)', border: 'none', borderRadius: 6, padding: '4px 9px', cursor: 'pointer', color: '#C5CCD4', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }
        },
          React.createElement('span', { style: { width: 18, height: 18, borderRadius: '50%', background: role === 'manager' ? '#1E3A5F' : '#2E7D32', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', fontWeight: 800 } }, role === 'manager' ? 'MH' : 'JN'),
          I.chevronDown(11, '#9BA8B4')
        ),
        showRoleMenu && React.createElement('div', {
          style: { position: 'absolute', top: '100%', right: 0, marginTop: 4, background: '#3a0a42', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, overflow: 'hidden', zIndex: 100, minWidth: 200 }
        },
          React.createElement('div', { style: { padding: '8px 14px', fontSize: 10, color: '#6B8EAE', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' } }, t('viewAs')),
          [
            { r: 'manager', name: 'Martin Horváth', label: t('manager'), initials: 'MH', color: '#1E3A5F' },
            { r: 'technician', name: 'Jozef Novák', label: t('technician'), initials: 'JN', color: '#2E7D32' },
          ].map(opt => React.createElement('button', {
            key: opt.r, onClick: () => { setRole(opt.r); setShowRoleMenu(false); },
            style: { display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 14px', background: role === opt.r ? 'rgba(0,0,0,0.25)' : 'none', border: 'none', cursor: 'pointer', color: '#C5CCD4', fontSize: 13, textAlign: 'left' }
          },
            React.createElement('div', { style: { width: 26, height: 26, borderRadius: '50%', background: opt.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 800 } }, opt.initials),
            React.createElement('div', null,
              React.createElement('div', { style: { fontWeight: 600 } }, opt.name),
              React.createElement('div', { style: { fontSize: 11, color: '#8B97A3' } }, opt.label)
            ),
            role === opt.r && React.createElement('span', { style: { marginLeft: 'auto', display: 'flex' } }, I.check(16, '#4CAF50'))
          ))
        )
      )
    )
  );
}

function Shell() {
  const { deviceMode } = useKobi();
  const showInlineSidebar = deviceMode === 'desktop';
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' } },
    React.createElement(TopBar),
    React.createElement('div', { style: { flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' } },
      // Sidebar (desktop only; tablet/mobile use drawer so main content is not squeezed)
      showInlineSidebar && React.createElement(Sidebar),
      React.createElement(SidebarDrawer),
      // Centre
      React.createElement(ChatView),
      // Kobi RHS (machine, logbook, …)
      React.createElement(RightPanel),
      // Mattermost-style: embedded app (Teams, CMMS, …) + far-right app bar
      React.createElement(window.AppEmbedPanel),
      React.createElement(window.AppRail)
    ),
    React.createElement(OnPremModal),
    React.createElement(SearchOverlay),
    React.createElement(ToastContainer),
    React.createElement(MediaViewer)
  );
}

function DeviceFrame({ children, mode }) {
  if (mode === 'desktop') {
    return React.createElement('div', { style: { width: '100vw', height: '100vh', overflow: 'hidden' } }, children);
  }
  if (mode === 'tablet') {
    return React.createElement('div', {
      style: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh', background: '#0D1117' }
    },
      React.createElement('div', {
        style: { width: 1024, height: '90vh', maxHeight: 768, border: '14px solid #2A2A2A', borderRadius: 20, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.5)', transition: 'all 0.25s ease', position: 'relative' }
      }, children)
    );
  }
  // mobile
  return React.createElement('div', {
    style: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh', background: '#0D1117' }
  },
    React.createElement('div', {
      style: { width: 390, height: '90vh', maxHeight: 844, border: '12px solid #1A1A1A', borderRadius: 44, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.6)', position: 'relative', transition: 'all 0.25s ease' }
    },
      React.createElement('div', { style: { position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 120, height: 28, background: '#1A1A1A', borderRadius: '0 0 18px 18px', zIndex: 999 } }),
      children
    )
  );
}

function App() {
  const { deviceMode } = useKobi();
  return React.createElement(DeviceFrame, { mode: deviceMode },
    React.createElement(Shell)
  );
}

const rootEl = document.getElementById('root');
ReactDOM.createRoot(rootEl).render(
  React.createElement(KobiProvider, null,
    React.createElement(App)
  )
);
