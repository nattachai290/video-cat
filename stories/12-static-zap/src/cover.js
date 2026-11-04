// cover.js: test loop (props) and the cover of "Static Zap" (1080 x 1920): Pumpkin as a crackling spiky junk ball, Pip stuck
// to his belly, a red balloon. Render: --loop=cover --still=0.3
(() => {
  LOOPS.props = t => {
    paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#CFE3D8', ink: null });
    chargedPumpkin(280, 700, 30, { ...face('surprised'), boilKey: 'a' }, 1, t);
    chargedPumpkin(800, 700, 30, { ...face('panic'), view: 'q', boilKey: 'b' }, 1, t);
    pumpkin(280, 1250, 30, { ...face('soggy'), wet: .4, boilKey: 'c' });
    puffPip2(780, 1200, 34, { ...face('surprised'), boilKey: 'd' }, 1.3, t, 'tufts');
    balloon(200, 1480, .8); sock(420, 1500, .3); remote(560, 1500, -.2); yarn(700, 1500); pillow(880, 1480); cushion(300, 1800); crackerProp(560, 1800); plate(760, 1820);
    zapBolt(450, 1700, 750, 1650, t, 4);
  };
  LOOPS.props.len = 2;
  LOOPS.pipball = t => {
    paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#CFE3D8', ink: null });
    paint(rectPts(-10, 1500, W + 20, 500), { wash: '#C99A6B', ink: null });
    const F = { ...face('surprised', { eyes: 'wide' }) };
    [['cotton', 270, 820], ['dandelion', 810, 820], ['tufts', 270, 1700], ['frizz', 810, 1700]].forEach(([st, x, y], i) => {
      puffPip2(x, y, 44, { ...F, view: 'front', aL: -.7, aR: -.7, boilKey: 'pb' + i }, 1.3, t, st);
      letter(['A cotton', 'B dandelion', 'C tufts', 'D frizz'][i], x, y - 560, 70, '#2B2233', { font: '800 70px "Baloo 2", sans-serif', screen: true });
    });
  };
  LOOPS.pipball.len = 2;
  LOOPS.wetears = t => {
    paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#CFE3D8', ink: null });
    [[0, 'front', false], [.45, 'front', false], [1, 'front', false], [0, 'q', true], [.45, 'q', true], [1, 'q', false]].forEach(([w, v, f], i) => {
      pumpkin(200 + (i % 3) * 340, 860 + Math.floor(i / 3) * 900, 34, { ...face('soggy'), wet: w, view: v, flip: f, boilKey: 'we' + i });
      letter('wet ' + w + ' ' + v, 200 + (i % 3) * 340, 300 + Math.floor(i / 3) * 900, 46, '#2B2233', { font: '800 46px "Baloo 2", sans-serif', screen: true });
    });
  };
  LOOPS.wetears.len = 2;
  LOOPS.cover = t => {
    paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#2E3A6E', ink: null });
    const cx = 540, cy = 1150;
    for (let i = 0; i < 24; i += 2) { const a0 = i / 24 * TAU, a1 = (i + 1) / 24 * TAU; paint([[cx, cy], [cx + Math.cos(a0) * 2600, cy + Math.sin(a0) * 2600], [cx + Math.cos(a1) * 2600, cy + Math.sin(a1) * 2600]], { wash: '#3B4C8A', ink: null }); }
    for (const [x0, y0, x1, y1, s] of [[90, 760, 260, 960, 1], [990, 760, 830, 980, 2], [120, 1500, 290, 1360, 3], [980, 1520, 820, 1380, 4]]) zapBolt(x0, y0, x1, y1, .3, 7, s);
    const u = 56;
    chargedPumpkin(cx, cy + 6 * u, u, { ...face('surprised', { eyes: 'wide', pupil: .1 }), aL: .9, aR: .9, noShadow: true, boilKey: 'cpk' }, 1, .3);
    sock(cx - 4.6 * u, cy + 1.6 * u, .9, 1.4); remote(cx - 2.2 * u, cy + 3.6 * u, .35, 1.4); yarn(cx - 5.0 * u, cy - 3.2 * u, 0, 1.5); pillow(cx + 5.0 * u, cy - 1.4 * u, 1.2, 1.2);
    crackerProp(cx + 4.6 * u, cy + 2.8 * u, .4, 2.2); crackerProp(cx - 3.2 * u, cy - 6.2 * u, .8, 2.2);
    pip(cx + 1.7 * u, cy + 5.6 * u, u * .85, { ...face('panic'), aL: 1.3, aR: 1.3, rot: -.2, noShadow: true, boilKey: 'cpp' });
    balloon(860, 560, 1.1, { sx: 800, sy: 900 });
    letter('STATIC', W / 2, 230, 170, '#7FE3FF', { font: '800 170px "Baloo 2", sans-serif', stroke: '#1B1F3A', rot: -.05, screen: true });
    letter('ZAP!', W / 2 - 40, 410, 190, '#FFE27A', { font: '800 190px "Baloo 2", sans-serif', stroke: '#1B1F3A', rot: .05, screen: true });
  };
  LOOPS.cover.len = 2;
})();
