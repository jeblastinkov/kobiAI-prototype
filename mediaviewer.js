// Full-screen PDF / image viewer with zoom (demo uses public sample URLs when no previewUrl)
(function () {
  const { useState, useEffect, useRef, useCallback } = React;

  function MediaViewer() {
  const { mediaViewer, setMediaViewer, t } = useKobi();
  const [scale, setScale] = useState(1);
  const scrollRef = useRef(null);
  const close = useCallback(() => setMediaViewer(null), [setMediaViewer]);

  useEffect(() => {
    if (!mediaViewer) {
      setScale(1);
      return;
    }
    setScale(1);
  }, [mediaViewer]);

  useEffect(() => {
    if (!mediaViewer) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mediaViewer, close]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !mediaViewer) return;
    const onWheel = (e) => {
      e.preventDefault();
      const d = e.deltaY > 0 ? -0.12 : 0.12;
      setScale((s) => Math.max(0.35, Math.min(4.5, s + d)));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [mediaViewer]);

  if (!mediaViewer) return null;

  const { kind, src, title } = mediaViewer;
  const pct = Math.round(scale * 100);
  const zoomIn = () => setScale((s) => Math.min(4.5, s + 0.25));
  const zoomOut = () => setScale((s) => Math.max(0.35, s - 0.25));
  const resetZoom = () => setScale(1);

  const btn = (onClick, label, extra = {}) =>
    React.createElement('button', {
      type: 'button',
      onClick,
      ...extra,
      style: {
        background: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.25)',
        color: '#fff',
        borderRadius: 8,
        padding: '6px 12px',
        fontSize: 13,
        cursor: 'pointer',
        fontWeight: 600,
        ...extra.style,
      },
    }, label);

  return React.createElement('div', {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 500,
      background: 'rgba(10,14,22,0.94)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'inherit',
    },
  },
    React.createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 14px',
        background: 'rgba(0,0,0,0.45)',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
        flexShrink: 0,
        flexWrap: 'wrap',
      },
    },
      React.createElement('span', {
        style: {
          fontWeight: 700,
          fontSize: 14,
          color: '#fff',
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
      }, title),
      btn(zoomOut, '−', { title: 'Zoom out' }),
      React.createElement('span', { style: { minWidth: 52, textAlign: 'center', color: '#B0B8C4', fontSize: 13 } }, `${pct}%`),
      btn(zoomIn, '+', { title: 'Zoom in' }),
      btn(resetZoom, '100%', { title: 'Reset zoom' }),
      btn(close, t('close'), { title: 'Close (Esc)', style: { marginLeft: 'auto', background: 'rgba(77,10,82,0.55)', borderColor: 'rgba(199,168,208,0.5)' } })
    ),
    React.createElement('div', {
      ref: scrollRef,
      style: {
        flex: 1,
        minHeight: 0,
        overflow: 'auto',
        padding: 16,
        display: 'flex',
        alignItems: kind === 'image' ? 'center' : 'flex-start',
        justifyContent: 'center',
      },
    },
      kind === 'pdf'
        ? React.createElement('div', {
            style: {
              width: '100%',
              maxWidth: 960,
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
            },
          },
            React.createElement('iframe', {
              title: title || 'PDF',
              src,
              style: {
                width: '100%',
                height: 'min(86vh, 1200px)',
                minHeight: 480,
                border: 'none',
                borderRadius: 8,
                background: '#fff',
                display: 'block',
                boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
              },
            })
          )
        : React.createElement('div', {
            style: {
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              maxWidth: '100%',
            },
          },
            React.createElement('img', {
              src,
              alt: title || '',
              draggable: false,
              style: {
                maxWidth: '92vw',
                maxHeight: '86vh',
                objectFit: 'contain',
                display: 'block',
                borderRadius: 4,
                boxShadow: '0 8px 40px rgba(0,0,0,0.45)',
                userSelect: 'none',
              },
            })
        )
    ),
    React.createElement('div', {
      style: {
        padding: '6px 16px 10px',
        fontSize: 11,
        color: 'rgba(255,255,255,0.45)',
        textAlign: 'center',
        flexShrink: 0,
      },
    }, 'Mouse wheel to zoom · Esc to close')
  );
  }

  Object.assign(window, { MediaViewer });
})();

