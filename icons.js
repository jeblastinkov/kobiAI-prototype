// KobiAI SVG Icon Library — clean vector icons, no emoji
window.Icons = (function() {
  const ce = React.createElement;
  function svg(paths, size, color, sw) {
    return ce('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color || 'currentColor', strokeWidth: sw || 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', style: { flexShrink: 0, display: 'block' } }, ...paths);
  }
  /** SVG with mixed stroke/fill children (e.g. recording dot) */
  function svgMixed(children, size) {
    return ce('svg', { width: size, height: size, viewBox: '0 0 24 24', style: { flexShrink: 0, display: 'block' } }, ...children);
  }
  const p = (d) => ce('path', { d });
  const c = (cx,cy,r) => ce('circle', { cx, cy, r });
  const r = (x,y,w,h,rx) => ce('rect', { x, y, width: w, height: h, rx: rx||0 });
  const l = (x1,y1,x2,y2) => ce('line', { x1, y1, x2, y2 });
  const pl = (points) => ce('polyline', { points });
  const pg = (points) => ce('polygon', { points });

  /** Channel / chat header icon from KobiData channel shape */
  function channelHeaderIcon(channel, size, color) {
    if (!channel) return null;
    const col = color || '#1A2433';
    const Ic = window.Icons;
    if (channel.machineId === 'siemens') return Ic.gear(size, col);
    if (channel.machineId === 'kuka') return Ic.robot(size, col);
    if (channel.machineId === 'zund') return Ic.cutter(size, col);
    if (channel.slug === 'dashboard' || channel.managerOnly) return Ic.barChart(size, col);
    if (channel.slug === 'incidents') return Ic.alert(size, col);
    if (channel.slug === 'docs-drop') return Ic.inbox(size, col);
    return Ic.general(size, col);
  }

  return {
    dashboard: (sz,col) => svg([r(3,3,7,7,1), r(14,3,7,7,1), r(14,14,7,7,1), r(3,14,7,7,1)], sz, col),
    machine: (sz,col) => svg([p('M12 2a9 9 0 0 1 0 18 9 9 0 0 1 0-18zm0 0v3m0 15v-3m9-9h-3M6 12H3'), c(12,12,3)], sz, col),
    gear: (sz,col) => svg([p('M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'), p('M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z')], sz, col),
    robot: (sz,col) => svg([r(3,11,18,10,2), r(9,7,6,4,1), l(12,7,12,3), c(7,3,1), c(17,3,1), l(7,21,7,17), l(17,21,17,17), c(9.5,15,1), c(14.5,15,1), l(6,15,3,15), l(21,15,18,15)], sz, col),
    alert: (sz,col) => svg([pg('12 2 22 20 2 20 12 2'), l(12,9,12,13), c(12,17,0.5)], sz, col),
    help: (sz,col) => svg([c(12,12,10), p('M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'), c(12,17,0.5)], sz, col),
    chat: (sz,col) => svg([p('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z')], sz, col),
    status: (sz,col) => svg([p('M22 12h-4l-3 9L9 3l-3 9H2')], sz, col),
    incident: (sz,col) => svg([p('M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z'), p('M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z'), p('M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z'), p('M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z'), p('M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z'), p('M15.5 9H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5S16.33 9 15.5 9z'), p('M10 9.5c0 .83-.67 1.5-1.5 1.5h-5C2.67 11 2 10.33 2 9.5S2.67 8 3.5 8h5c.83 0 1.5.67 1.5 1.5z'), p('M8.5 15H10v-1.5c0-.83-.67-1.5-1.5-1.5S7 12.67 7 13.5 7.67 15 8.5 15z')], sz, col),
    wrench: (sz,col) => svg([p('M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z')], sz, col),
    docs: (sz,col) => svg([p('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'), pl('14 2 14 8 20 8'), l(16,13,8,13), l(16,17,8,17), l(10,9,8,9)], sz, col),
    general: (sz,col) => svg([c(12,12,10), l(2,12,22,12), p('M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z')], sz, col),
    lock: (sz,col) => svg([r(3,11,18,11,2), p('M7 11V7a5 5 0 0 1 10 0v4')], sz, col),
    search: (sz,col) => svg([c(11,11,8), l(21,21,16.65,16.65)], sz, col),
    plus: (sz,col) => svg([l(12,5,12,19), l(5,12,19,12)], sz, col),
    user: (sz,col) => svg([p('M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'), c(12,7,4)], sz, col),
    users: (sz,col) => svg([p('M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'), c(9,7,4), p('M23 21v-2a4 4 0 0 0-3-3.87'), p('M16 3.13a4 4 0 0 1 0 7.75')], sz, col),
    chevronRight: (sz,col) => svg([pl('9 18 15 12 9 6')], sz, col),
    chevronDown: (sz,col) => svg([pl('6 9 12 15 18 9')], sz, col),
    x: (sz,col) => svg([l(18,6,6,18), l(6,6,18,18)], sz, col),
    check: (sz,col) => svg([pl('20 6 9 17 4 12')], sz, col),
    checkCircle: (sz,col) => svg([p('M22 11.08V12a10 10 0 1 1-5.93-9.14'), pl('22 4 12 14.01 9 11.01')], sz, col),
    home: (sz,col) => svg([p('M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'), pl('9 22 9 12 15 12 15 22')], sz, col),
    activity: (sz,col) => svg([pl('22 12 18 12 15 21 9 3 6 12 2 12')], sz, col),
    shield: (sz,col) => svg([p('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z')], sz, col),
    barChart: (sz,col) => svg([l(12,20,12,10), l(18,20,18,4), l(6,20,6,16)], sz, col),
    fileText: (sz,col) => svg([p('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'), pl('14 2 14 8 20 8'), l(16,13,8,13), l(16,17,8,17), l(10,9,8,9)], sz, col),
    inbox: (sz,col) => svg([pl('22 12 16 12 14 15 10 15 8 12 2 12'), p('M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z')], sz, col),
    // Modern mic (Lucide-style capsule + bracket + slim stand)
    mic: (sz,col) => svg([
      p('M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z'),
      p('M19 10v2a7 7 0 0 1-14 0v-2'),
      l(12,17,12,22),
      l(8,22,16,22),
    ], sz, col, 1.65),
    send: (sz,col) => svg([p('M22 2L11 13'), pg('22 2 15 22 11 13 2 9 22 2')], sz, col),
    pin: (sz,col) => svg([p('M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'), c(12,10,3)], sz, col),
    zap: (sz,col) => svg([pg('13 2 3 14 12 14 11 22 21 10 12 10 13 2')], sz, col),
    menu: (sz,col) => svg([l(4,6,20,6), l(4,12,20,12), l(4,18,20,18)], sz, col, 2),
    monitor: (sz,col) => svg([r(2,4,20,12,2), l(8,20,16,20), l(12,16,12,20)], sz, col),
    tablet: (sz,col) => svg([r(5,2,14,18,2), c(12,19,0.75)], sz, col),
    smartphone: (sz,col) => svg([r(7,2,10,20,2.5), c(12,18,0.65)], sz, col),
    record: (sz,col) => svgMixed([ce('circle', { cx: 12, cy: 12, r: 5, fill: col || '#E53935', stroke: 'none' })], sz),
    camera: (sz,col) => svg([r(4,8,16,12,2), pl('10 8 10 6 14 6 14 8'), c(12,14,3)], sz, col),
    brain: (sz,col) => svg([p('M12 3a7 7 0 0 0-7 7v1a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-1a7 7 0 0 0-7-7z'), p('M8 14v3a4 4 0 0 0 8 0v-3'), l(9,22,15,22)], sz, col),
    clipboardList: (sz,col) => svg([p('M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'), r(9,2,6,4,1), l(8,12,16,12), l(8,16,16,16), l(8,8,12,8)], sz, col),
    cutter: (sz,col) => svg([p('M9.5 3.5 3 10l9 9 6.5-6.5L9.5 3.5z'), l(14,14,21,21), l(3,21,10,14)], sz, col),
    dotsHorizontal: (sz,col) => svg([c(5,12,1.5), c(12,12,1.5), c(19,12,1.5)], sz, col, 2.5),
    reply: (sz,col) => svg([pl('9 10 4 15 9 20'), l(20,15,4,15)], sz, col),
    thumbsUp: (sz,col) => svg([p('M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3')], sz, col),
    smile: (sz,col) => svg([c(12,12,10), p('M8 14s1.5 2 4 2 4-2 4-2'), l(9,9,9.01,9), l(15,9,15.01,9)], sz, col),
    bookmark: (sz,col) => svg([p('M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z')], sz, col),
    infoCircle: (sz,col) => svg([c(12,12,10), l(12,8,12,12), c(12,16,1)], sz, col),
    chevronUp: (sz,col) => svg([pl('18 15 12 9 6 15')], sz, col),
    upload: (sz,col) => svg([p('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'), pl('17 8 12 3 7 8'), l(12,3,12,15)], sz, col),
    statusDot: (sz, fill) => svgMixed([ce('circle', { cx: 12, cy: 12, r: 4, fill: fill || '#4CAF50', stroke: 'none' })], sz),

    channelHeaderIcon,
  };
})();
