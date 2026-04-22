// KobiAI — plant / line switcher (top bar + sidebar)

const { useState, useRef, useEffect } = React;

function WorkspaceMenu({ onPick, onClose, activeId }) {
  const I = window.Icons;
  const { t } = useKobi();
  const workspaces = window.KobiData.workspaces;
  return React.createElement('div', {
    style: {
      minWidth: 280,
      maxWidth: 360,
      background: '#3a0a42',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 8,
      overflow: 'hidden',
      zIndex: 200,
      boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
    },
  },
    React.createElement('div', { style: { padding: '8px 12px', fontSize: 10, color: '#6B8EAE', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' } }, t('wsSwitchMenu')),
    workspaces.map((w) =>
      React.createElement('button', {
        key: w.id,
        type: 'button',
        onClick: () => { onPick(w.id); onClose(); },
        style: {
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 10,
          width: '100%',
          padding: '10px 14px',
          background: w.id === activeId ? 'rgba(0,0,0,0.28)' : 'transparent',
          border: 'none',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          cursor: 'pointer',
          textAlign: 'left',
        },
      },
        React.createElement('div', { style: { minWidth: 0, flex: 1 } },
          React.createElement('div', { style: { fontWeight: 700, fontSize: 14, color: '#E8EDF2' } }, t(w.nameKey)),
          React.createElement('div', { style: { fontSize: 11, color: '#8B97A3', marginTop: 2, lineHeight: 1.35 } }, t(w.subKey))
        ),
        w.id === activeId && React.createElement('span', { style: { flexShrink: 0, display: 'flex', marginTop: 2 } }, I.check(16, '#4CAF50'))
      )
    )
  );
}

function WorkspaceSwitcher({ variant }) {
  const I = window.Icons;
  const { activeWorkspaceId, setActiveWorkspace, t, addToast } = useKobi();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const current = window.KobiData.getWorkspaceById(activeWorkspaceId);

  useEffect(() => {
    if (!open) return;
    function onDoc(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('click', onDoc, true);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDoc, true);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pick = (id) => {
    if (id === activeWorkspaceId) return;
    setActiveWorkspace(id);
    addToast(t('wsSwitched'), 'success');
  };

  if (variant === 'topbar') {
    return React.createElement('div', { ref: wrapRef, style: { position: 'relative', display: 'flex', alignItems: 'center' } },
      React.createElement('button', {
        type: 'button',
        'aria-expanded': open,
        'aria-haspopup': 'listbox',
        onClick: (e) => { e.stopPropagation(); setOpen((o) => !o); },
        style: {
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          color: '#fff',
          fontWeight: 700,
          fontSize: 13,
          padding: '4px 2px',
        },
      },
        React.createElement('span', null, t('wsBrandName') + ' · ' + t(current.nameKey)),
        I.chevronDown(12, 'rgba(255,255,255,0.65)')
      ),
      open && React.createElement('div', { style: { position: 'absolute', top: '100%', left: 0, marginTop: 6, zIndex: 200 } },
        React.createElement(WorkspaceMenu, { activeId: activeWorkspaceId, onClose: () => setOpen(false), onPick: pick })
      )
    );
  }

  const MUTED = 'rgba(255,255,255,0.5)';
  return React.createElement('div', { ref: wrapRef, style: { position: 'relative', flex: 1, minWidth: 0 } },
    React.createElement('button', {
      type: 'button',
      'aria-expanded': open,
      'aria-haspopup': 'listbox',
      onClick: (e) => { e.stopPropagation(); setOpen((o) => !o); },
      style: {
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        display: 'block',
      },
    },
      React.createElement('div', { style: { color: '#fff', fontWeight: 800, fontSize: 16 } }, t('wsBrandName')),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 } },
        React.createElement('span', { style: { color: MUTED, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 } }, t(current.nameKey)),
        I.chevronDown(12, MUTED)
      )
    ),
    open && React.createElement('div', { style: { position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6, zIndex: 300 } },
      React.createElement(WorkspaceMenu, { activeId: activeWorkspaceId, onClose: () => setOpen(false), onPick: pick })
    )
  );
}

Object.assign(window, { WorkspaceSwitcher, WorkspaceMenu });
