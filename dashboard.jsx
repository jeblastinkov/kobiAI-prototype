// KobiAI Dashboard v2 — proper charts with grid/axes, clean KPI cards

const { useState, useEffect, useRef } = React;

/* ─── Chart primitives ─── */

function ChartGrid({ w, h, ySteps = 4 }) {
  return React.createElement('g', null,
    Array.from({ length: ySteps + 1 }, (_, i) => {
      const y = (i / ySteps) * h;
      return React.createElement('line', { key: i, x1: 0, y1: y, x2: w, y2: y, stroke: '#F0F2F4', strokeWidth: 1 });
    })
  );
}

function YAxisLabels({ min, max, steps = 4, h, unit = '' }) {
  return React.createElement('g', null,
    Array.from({ length: steps + 1 }, (_, i) => {
      const val = Math.round(max - (i / steps) * (max - min));
      const y = (i / steps) * h;
      return React.createElement('text', { key: i, x: -6, y: y + 4, textAnchor: 'end', fontSize: 10, fill: '#9BA8B4' }, val + unit);
    })
  );
}

function LineChart({ data, xKey, yKey, color = '#4d0a52', height = 100, annotation, showArea = true, unit = '' }) {
  if (!data?.length) return null;
  const vals = data.map(d => d[yKey]);
  const raw_min = Math.min(...vals), raw_max = Math.max(...vals);
  const pad = (raw_max - raw_min) * 0.15 || 5;
  const min = Math.max(0, raw_min - pad), max = raw_max + pad;
  const W = 300, H = height;
  const pts = data.map((d, i) => [
    (i / (data.length - 1)) * W,
    H - ((d[yKey] - min) / (max - min)) * H
  ]);
  const path = pts.map((p, i) => (i === 0 ? `M${p[0].toFixed(1)},${p[1].toFixed(1)}` : `L${p[0].toFixed(1)},${p[1].toFixed(1)}`)).join(' ');
  const area = `${path} L${W},${H} L0,${H} Z`;
  const gradId = 'g' + color.replace('#', '');

  // X labels: show first, middle, last
  const xLabels = [0, Math.floor(data.length / 2), data.length - 1].map(i => ({ i, label: data[i][xKey], x: pts[i][0] }));

  return React.createElement('div', { style: { position: 'relative' } },
    React.createElement('svg', { viewBox: `0 0 ${W} ${H}`, style: { width: '100%', height }, overflow: 'visible' },
      React.createElement('defs', null,
        React.createElement('linearGradient', { id: gradId, x1: 0, y1: 0, x2: 0, y2: 1 },
          React.createElement('stop', { offset: '0%', stopColor: color, stopOpacity: 0.18 }),
          React.createElement('stop', { offset: '100%', stopColor: color, stopOpacity: 0.02 })
        )
      ),
      React.createElement(ChartGrid, { w: W, h: H }),
      showArea && React.createElement('path', { d: area, fill: `url(#${gradId})` }),
      React.createElement('path', { d: path, fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      annotation && pts[annotation.idx] && React.createElement('g', null,
        React.createElement('circle', { cx: pts[annotation.idx][0], cy: pts[annotation.idx][1], r: 5, fill: '#fff', stroke: color, strokeWidth: 2 }),
        React.createElement('line', { x1: pts[annotation.idx][0], y1: pts[annotation.idx][1], x2: pts[annotation.idx][0], y2: H, stroke: color, strokeWidth: 1, strokeDasharray: '3,3', opacity: 0.5 }),
        React.createElement('text', { x: pts[annotation.idx][0] + 6, y: pts[annotation.idx][1] - 6, fontSize: 9, fill: color, fontWeight: 600 }, annotation.label)
      ),
      xLabels.map(({ i, label, x }) =>
        React.createElement('text', { key: i, x, y: H + 14, textAnchor: 'middle', fontSize: 9, fill: '#9BA8B4' }, label)
      )
    )
  );
}

function HorizontalBarChart({ data, maxVal, color = '#4d0a52' }) {
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
    data.map((d, i) => React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 10 } },
      React.createElement('div', { style: { width: 105, fontSize: 12, color: '#555', textAlign: 'right', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, d.machine),
      React.createElement('div', { style: { flex: 1, height: 16, background: '#F0F2F4', borderRadius: 8, overflow: 'hidden' } },
        React.createElement('div', { style: { height: '100%', width: `${(d.count / maxVal) * 100}%`, background: color, borderRadius: 8, transition: 'width 0.5s ease' } })
      ),
      React.createElement('div', { style: { width: 24, fontSize: 12, fontWeight: 700, color: '#1E3A5F', textAlign: 'right' } }, d.count)
    ))
  );
}

/* ─── KPI card ─── */

function KpiCard({ label, value, unit, trend, trendDir, sparkData, sparkKey, pulse, color }) {
  const [displayVal, setDisplayVal] = useState(value);
  const [pulsing, setPulsing] = useState(false);
  useEffect(() => {
    if (pulse) { setPulsing(true); setDisplayVal(v => v + 1); setTimeout(() => setPulsing(false), 800); }
  }, [pulse]);

  const isDown = trendDir === 'down';
  const trendGood = isDown; // for MTTR, down is good
  const trendColor = trendGood ? '#2E7D32' : '#C62828';
  const trendBg = trendGood ? '#E8F5E9' : '#FFEBEE';

  return React.createElement('div', {
    style: {
      background: pulsing ? '#F3FFF3' : '#fff',
      border: `1px solid ${pulsing ? '#4CAF50' : '#E8ECF0'}`,
      borderRadius: 14, padding: '18px 20px',
      transition: 'all 0.4s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      flex: 1, minWidth: 160,
    }
  },
    React.createElement('div', { style: { fontSize: 12, color: '#8B97A3', fontWeight: 600, letterSpacing: '0.04em', marginBottom: 8, textTransform: 'uppercase' } }, label),
    React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 } },
      React.createElement('span', { style: { fontSize: 32, fontWeight: 800, color: '#1A2433', letterSpacing: '-1px' } }, displayVal.toLocaleString()),
      unit && React.createElement('span', { style: { fontSize: 15, color: '#8B97A3' } }, unit)
    ),
    trend !== undefined && React.createElement('div', { style: { display: 'inline-flex', alignItems: 'center', gap: 5, background: trendBg, borderRadius: 20, padding: '3px 10px', marginBottom: 10 } },
      React.createElement('span', { style: { fontSize: 12, color: trendColor, fontWeight: 700 } },
        `${isDown ? '▼' : '▲'} ${Math.abs(trend)}${typeof trend === 'number' && Math.abs(trend) < 20 ? '%' : ''} ${isDown ? 'improvement' : 'this week'}`
      )
    ),
    sparkData && React.createElement(LineChart, { data: sparkData, xKey: 'week', yKey: sparkKey, color: color || '#4d0a52', height: 36, showArea: false })
  );
}

/* ─── Incidents table ─── */

function IncidentsTable() {
  const rows = [
    { time: 'Today 09:14', machine: 'Siemens S7-1500', issue: 'F-304 Overcurrent', status: 'resolved',           resolvedBy: 'J. Novák' },
    { time: 'Today 08:45', machine: 'KUKA KR 60-3',    issue: 'Welding arc misalignment', status: 'in-progress', resolvedBy: 'M. Horváth' },
    { time: 'Yesterday',   machine: 'Zünd G3 Cutting', issue: 'Belt tension warning', status: 'resolved',         resolvedBy: 'P. Kováč' },
    { time: 'Yesterday',   machine: 'Conveyor L4',     issue: 'Sensor calibration drift', status: 'open',         resolvedBy: '—' },
    { time: '2 days ago',  machine: 'KUKA KR 60-3',    issue: 'TCP calibration alert', status: 'resolved',        resolvedBy: 'M. Horváth' },
  ];
  const statusStyle = {
    resolved:          { color: '#2E7D32', bg: '#E8F5E9', label: 'Resolved' },
    'in-progress':     { color: '#E65100', bg: '#FFF3E0', label: 'In Progress' },
    open:              { color: '#B71C1C', bg: '#FFEBEE', label: 'Open' },
    'awaiting-approval': { color: '#E65100', bg: '#FFF3E0', label: 'Awaiting' },
  };

  return React.createElement('div', { style: { background: '#fff', border: '1px solid #E8ECF0', borderRadius: 14, overflow: 'hidden' } },
    React.createElement('div', { style: { padding: '16px 20px', borderBottom: '1px solid #E8ECF0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
      React.createElement('div', { style: { fontWeight: 700, fontSize: 15, color: '#1A2433' } }, 'Recent Incidents'),
      React.createElement('button', { style: { padding: '5px 12px', background: '#F3EAF5', border: '1px solid #C9A8D0', borderRadius: 8, fontSize: 12, color: '#4d0a52', cursor: 'pointer', fontWeight: 600 } }, 'View all →')
    ),
    React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: 13 } },
      React.createElement('thead', null,
        React.createElement('tr', { style: { background: '#F7F9FB' } },
          ['Time', 'Machine', 'Issue', 'Status', 'Resolved By'].map(h =>
            React.createElement('th', { key: h, style: { padding: '10px 16px', textAlign: 'left', color: '#8B97A3', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' } }, h)
          )
        )
      ),
      React.createElement('tbody', null,
        rows.map((r, i) => {
          const st = statusStyle[r.status] || statusStyle.open;
          return React.createElement('tr', { key: i, style: { borderTop: '1px solid #F0F2F4', cursor: 'pointer' },
            onMouseEnter: e => e.currentTarget.style.background = '#F7F9FB',
            onMouseLeave: e => e.currentTarget.style.background = '#fff',
          },
            React.createElement('td', { style: { padding: '12px 16px', color: '#6B8EAE', fontSize: 12, whiteSpace: 'nowrap' } }, r.time),
            React.createElement('td', { style: { padding: '12px 16px', fontWeight: 600, color: '#1A2433' } }, r.machine),
            React.createElement('td', { style: { padding: '12px 16px', color: '#555' } }, r.issue),
            React.createElement('td', { style: { padding: '12px 16px' } },
              React.createElement('span', { style: { background: st.bg, color: st.color, borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600 } }, st.label)
            ),
            React.createElement('td', { style: { padding: '12px 16px', color: '#6B8EAE' } }, r.resolvedBy)
          );
        })
      )
    )
  );
}

/* ─── Alerts panel ─── */

function AlertsPanel() {
  const { addToast } = useKobi();
  const I = window.Icons;
  const [dismissed, setDismissed] = useState([]);
  const { predictiveAlerts } = window.KobiData;
  const visible = predictiveAlerts.filter(a => !dismissed.includes(a.id));

  return React.createElement('div', { style: { background: '#fff', border: '1px solid #E8ECF0', borderRadius: 14, overflow: 'hidden' } },
    React.createElement('div', { style: { padding: '16px 18px', borderBottom: '1px solid #E8ECF0', fontWeight: 700, fontSize: 15, color: '#1A2433', display: 'flex', alignItems: 'center', gap: 8 } }, I && I.zap(18, '#FF9800'), 'Predictive Alerts'),
    React.createElement('div', { style: { padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 } },
      visible.length === 0
        ? React.createElement('div', { style: { color: '#8B97A3', fontSize: 13, padding: 8, textAlign: 'center' } }, 'All clear — no active alerts')
        : visible.map(alert =>
            React.createElement('div', { key: alert.id,
              style: { background: alert.type === 'warning' ? '#FFF8E1' : '#E3F2FD', border: `1px solid ${alert.type === 'warning' ? '#FFD54F' : '#90CAF9'}`, borderRadius: 10, padding: '12px 14px' }
            },
              React.createElement('div', { style: { display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' } },
                React.createElement('span', { style: { display: 'flex', flexShrink: 0 } }, alert.type === 'warning' ? (I && I.alert(17, '#E65100')) : (I && I.infoCircle(17, '#1565C0'))),
                React.createElement('div', null,
                  React.createElement('div', { style: { fontWeight: 700, fontSize: 13, color: '#1A2433', marginBottom: 3 } }, alert.machine),
                  React.createElement('div', { style: { fontSize: 13, color: '#555', lineHeight: 1.5 } }, alert.message)
                )
              ),
              React.createElement('div', { style: { display: 'flex', gap: 8 } },
                React.createElement('button', { onClick: () => setDismissed(d => [...d, alert.id]), style: { padding: '4px 12px', border: '1px solid #C5D0DB', borderRadius: 7, background: '#fff', cursor: 'pointer', fontSize: 12, color: '#555' } }, 'Dismiss'),
                React.createElement('button', { onClick: () => addToast('Opening incident form…', 'info'), style: { padding: '4px 12px', border: 'none', borderRadius: 7, background: '#4d0a52', cursor: 'pointer', fontSize: 12, color: '#fff', fontWeight: 600 } }, 'Create incident')
              )
            )
          )
    )
  );
}

/* ─── Main Dashboard view ─── */

function DashboardView() {
  const { openIncidentCount, t } = useKobi();
  const { dashboardKPIs, aiQueryData, mttrData, knowledgeData, incidentsByMachine } = window.KobiData;
  const [pulseIdx, setPulseIdx] = useState(-1);
  const pulseRef = useRef(null);
  useEffect(() => {
    pulseRef.current = setInterval(() => {
      setPulseIdx(Math.floor(Math.random() * 4));
      setTimeout(() => setPulseIdx(-1), 900);
    }, 30000);
    return () => clearInterval(pulseRef.current);
  }, []);

  const kpis = [
    { key: 0, label: 'MTTR', value: dashboardKPIs.mttr.value, unit: 'min', trend: dashboardKPIs.mttr.trend, trendDir: 'down', sparkData: mttrData, sparkKey: 'mttr', color: '#4d0a52' },
    { key: 1, label: 'Open Incidents', value: openIncidentCount, trend: 2, trendDir: 'up', color: '#B71C1C' },
    { key: 2, label: 'AI Queries Today', value: dashboardKPIs.aiQueriesToday.value, trend: dashboardKPIs.aiQueriesToday.trend, trendDir: 'up', sparkData: aiQueryData.slice(-12), sparkKey: 'queries', color: '#2E7D32' },
    { key: 3, label: 'Knowledge Notes', value: dashboardKPIs.knowledgeNotes.value, trend: dashboardKPIs.knowledgeNotes.trend, trendDir: 'up', color: '#1565C0' },
  ];

  return React.createElement('div', { style: { padding: '24px 24px', overflowY: 'auto', height: '100%', boxSizing: 'border-box', background: '#F5F6F8' } },
    // Header
    React.createElement('div', { style: { marginBottom: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
      React.createElement('div', null,
        React.createElement('h1', { style: { fontSize: 20, fontWeight: 800, color: '#1A2433', margin: 0 } }, 'Manager Dashboard'),
        React.createElement('div', { style: { fontSize: 13, color: '#8B97A3', marginTop: 3 } }, 'Bratislava Plant · rolling 30 days')
      ),
      React.createElement('div', { style: { display: 'flex', gap: 10, alignItems: 'center' } },
        React.createElement('span', { style: { background: '#F3EAF5', border: '1px solid #C9A8D0', borderRadius: 20, padding: '5px 14px', fontSize: 13, color: '#4d0a52', fontWeight: 600 } }, 'Factory: Bratislava Plant ▾'),
        React.createElement('span', { style: { width: 9, height: 9, borderRadius: '50%', background: '#4CAF50', display: 'inline-block', animation: 'pulse 2s infinite' } })
      )
    ),

    // KPIs
    React.createElement('div', { style: { display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' } },
      kpis.map(kpi => React.createElement(KpiCard, { key: kpi.key, ...kpi, pulse: pulseIdx === kpi.key }))
    ),

    // Charts row 1
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16, marginBottom: 16 } },
      React.createElement('div', { style: { background: '#fff', border: '1px solid #E8ECF0', borderRadius: 14, padding: '18px 20px' } },
        React.createElement('div', { style: { fontWeight: 700, fontSize: 14, color: '#1A2433', marginBottom: 16 } }, 'Incidents by Machine'),
        React.createElement(HorizontalBarChart, { data: incidentsByMachine, maxVal: 12, color: '#4d0a52' })
      ),
      React.createElement('div', { style: { background: '#fff', border: '1px solid #E8ECF0', borderRadius: 14, padding: '18px 20px' } },
        React.createElement('div', { style: { fontWeight: 700, fontSize: 14, color: '#1A2433', marginBottom: 4 } }, 'AI Query Volume — last 30 days'),
        React.createElement('div', { style: { fontSize: 12, color: '#9BA8B4', marginBottom: 10 } }, 'Zünd docs ingested on day 20 caused jump'),
        React.createElement(LineChart, { data: aiQueryData, xKey: 'day', yKey: 'queries', color: '#2E7D32', height: 100, annotation: { idx: 19, label: 'Zünd docs' } })
      )
    ),

    // Charts row 2
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16, marginBottom: 20 } },
      React.createElement('div', { style: { background: '#fff', border: '1px solid #E8ECF0', borderRadius: 14, padding: '18px 20px' } },
        React.createElement('div', { style: { fontWeight: 700, fontSize: 14, color: '#1A2433', marginBottom: 4 } }, 'MTTR Trend — 12 weeks'),
        React.createElement('div', { style: { fontSize: 12, color: '#2E7D32', fontWeight: 600, marginBottom: 10 } }, '▼ 12% since KobiAI deployment (W7)'),
        React.createElement(LineChart, { data: mttrData, xKey: 'week', yKey: 'mttr', color: '#4d0a52', height: 100, annotation: { idx: 6, label: 'KobiAI' }, unit: 'min' })
      ),
      React.createElement('div', { style: { background: '#fff', border: '1px solid #E8ECF0', borderRadius: 14, padding: '18px 20px' } },
        React.createElement('div', { style: { fontWeight: 700, fontSize: 14, color: '#1A2433', marginBottom: 4 } }, 'Knowledge Base Growth'),
        React.createElement('div', { style: { fontSize: 12, color: '#9BA8B4', marginBottom: 10 } }, '12,340 chunks across all machines'),
        React.createElement(LineChart, { data: knowledgeData, xKey: 'week', yKey: 'chunks', color: '#1565C0', height: 100 })
      )
    ),

    // Table + alerts
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' } },
      React.createElement(IncidentsTable),
      React.createElement(AlertsPanel)
    )
  );
}

Object.assign(window, { DashboardView });
