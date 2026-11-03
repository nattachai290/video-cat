// cover.js: cover of "The Red Dot" (1080 x 1920), drawn fresh: Pumpkin plastered flat on the wall, pupils huge, the tiny
// red dot just out of reach above him; Pip below, giggling, laser in paw. Render: --loop=cover --still=0.6
(() => {
  LOOPS.cover = t => {
    paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#FFD9DE', ink: null });
    const cx = 540, cy = 760;
    for (let i = 0; i < 24; i += 2) { const a0 = i / 24 * TAU, a1 = (i + 1) / 24 * TAU; paint([[cx, cy], [cx + Math.cos(a0) * 2600, cy + Math.sin(a0) * 2600], [cx + Math.cos(a1) * 2600, cy + Math.sin(a1) * 2600]], { wash: '#FFC2CB', ink: null }); }
    paint(rectPts(-10, 1650, W + 20, 400), { wash: '#C99A6B', ink: null });
    redDot(560, 640, 3.2);
    pumpkin(540, 1450, 66, { ...face('greedy'), eyes: 'wide', lid: 0, pupil: 1.15, lookY: -1, brow: .5, puff: .4, aL: 1.35, aR: 1.35, noShadow: true, boilKey: 'cvk' });
    for (const [x, y, r] of [[200, 1300, 1], [880, 1250, -1]]) for (let k = 0; k < 3; k++) inkLine([[x + r * k * 26, y + k * 40], [x + r * (k * 26 + 60), y + k * 40 + 10]], 5, '#FFFFFF', 'ink', 0);
    pip(860, 1780, 60, { ...face('happy', { mouth: 'grin' }), view: 'q', flip: true, aR: .7, aL: .5, armR: laserHook(1), boilKey: 'cvp' });
    letter('THE RED DOT', W / 2, 220, 150, '#FFFFFF', { font: '800 150px "Baloo 2", sans-serif', stroke: '#2B2233', rot: -.04, screen: true });
    letter('ALWAYS WINS.', W / 2 + 10, 390, 150, '#E2343F', { font: '800 150px "Baloo 2", sans-serif', stroke: '#2B2233', rot: .05, screen: true });
  };
  LOOPS.cover.len = 2;
})();
