// Mattermost-style right app bar — CMMS, ERP, Teams, MES, etc. (iframe in production)

const { useCallback } = React;
const RAIL = '#4d0a52';
const PANEL = 420;
const RAIL_BTN = 34;
const RAIL_ICON = 18;

function renderAppIcon(app, size) {
  const I = window.Icons;
  if (app.icon === 'sparkles' && I.sparkles) return I.sparkles(size, '#fff');
  const fn = I[app.icon];
  return fn ? fn(size, '#fff') : I.gear(size, '#fff');
}

function AppEmbedPanel() {
  const I = window.Icons;
  const { activeIntegrationId, setActiveIntegrationId, t, deviceMode } = useKobi();
  const apps = window.KobiData.integrationApps || [];
  const app = apps.find((a) => a.id === activeIntegrationId);

  if (!app || deviceMode !== 'desktop') return null;

  const close = () => setActiveIntegrationId(null);
  const title = t(app.nameKey);
  const desc = t(app.descKey);

  const body = app.embedUrl
    ? React.createElement('iframe', {
        title,
        src: app.embedUrl,
        sandbox: 'allow-scripts allow-same-origin allow-popups allow-forms',
        style: { border: 'none', flex: 1, width: '100%', minHeight: 0, background: '#fff' },
      })
    : React.createElement(
        'div',
        {
          style: {
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            padding: '28px 24px',
            background: `linear-gradient(165deg, ${app.color}12 0%, #fff 45%)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: 14,
          },
        },
        React.createElement(
          'div',
          {
            style: {
              width: 64,
              height: 64,
              borderRadius: 16,
              background: app.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 28px ${app.color}55`,
            },
          },
          renderAppIcon(app, 26)
        ),
        React.createElement('div', { style: { fontSize: 17, fontWeight: 800, color: '#1A2433' } }, title),
        React.createElement('div', { style: { fontSize: 14, color: '#5C6370', lineHeight: 1.55, maxWidth: 320 } }, desc),
        React.createElement(
          'div',
          { style: { fontSize: 12, color: '#8B97A3', lineHeight: 1.5, maxWidth: 340, marginTop: 8 } },
          t('intEmbedHint')
        )
      );

  return React.createElement(
    'div',
    {
      style: {
        width: PANEL,
        maxWidth: '100%',
        height: '100%',
        flexShrink: 0,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        borderLeft: '1px solid #E4E7EB',
        boxShadow: '-4px 0 24px rgba(15, 23, 42, 0.06)',
        zIndex: 2,
        minWidth: 0,
      },
    },
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 12px',
          borderBottom: '1px solid #EEF0F2',
          flexShrink: 0,
        },
      },
      React.createElement('div', { style: { color: app.color, display: 'flex' } }, I.infoCircle(18, app.color)),
      React.createElement('div', { style: { flex: 1, minWidth: 0, fontWeight: 700, fontSize: 14, color: '#1A2433', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, title),
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: close,
          'aria-label': t('close'),
          style: {
            width: 32,
            height: 32,
            border: 'none',
            background: 'transparent',
            borderRadius: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8B97A3',
          },
        },
        I.x(18, '#8B97A3')
      )
    ),
    body
  );
}

function AppRail() {
  const { activeIntegrationId, setActiveIntegrationId, setRightPanel, setActiveChannel, t, deviceMode } = useKobi();
  const apps = window.KobiData.integrationApps || [];

  const onSelect = useCallback(
    (app) => {
      if (app.openDmKobi) {
        setRightPanel(null);
        setActiveChannel('dm-kobi');
        setActiveIntegrationId(null);
        return;
      }
      if (activeIntegrationId === app.id) {
        setActiveIntegrationId(null);
        return;
      }
      setRightPanel(null);
      setActiveIntegrationId(app.id);
    },
    [activeIntegrationId, setActiveIntegrationId, setRightPanel, setActiveChannel]
  );

  if (deviceMode !== 'desktop' || !apps.length) return null;

  return React.createElement(
    'div',
    {
      style: {
        width: 46,
        flexShrink: 0,
        height: '100%',
        background: RAIL,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.08)',
        zIndex: 3,
      },
    },
    React.createElement(
      'div',
      { style: { padding: '6px 0', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, overflowY: 'auto' } },
      apps.map((app) => {
        const active = app.openDmKobi ? false : activeIntegrationId === app.id;
        return React.createElement(
          'button',
          {
            key: app.id,
            type: 'button',
            title: t(app.nameKey),
            onClick: () => onSelect(app),
            style: {
              width: RAIL_BTN,
              height: RAIL_BTN,
              borderRadius: '50%',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: app.color,
              boxShadow: active ? '0 0 0 2px #fff, 0 4px 14px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.2)',
              transform: active ? 'scale(1.05)' : 'scale(1)',
              transition: 'box-shadow 0.15s, transform 0.15s',
            },
          },
          renderAppIcon(app, RAIL_ICON)
        );
      })
    )
  );
}

Object.assign(window, { AppEmbedPanel, AppRail });
