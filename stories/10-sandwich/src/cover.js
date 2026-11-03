// cover.js: cover of "The Sandwich" (1080 x 1920), drawn fresh: Pumpkin turned into a square sandwich-cat, blissful;
// Pip beside him holding an empty plate, outraged. Render: --loop=cover --still=0.6
(() => {
  LOOPS.cover = t => {
    paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#BFE6A8', ink: null });
    const cx = 540, cy = 1100;
    for (let i = 0; i < 24; i += 2) { const a0 = i / 24 * TAU, a1 = (i + 1) / 24 * TAU; paint([[cx, cy], [cx + Math.cos(a0) * 2600, cy + Math.sin(a0) * 2600], [cx + Math.cos(a1) * 2600, cy + Math.sin(a1) * 2600]], { wash: '#D3EFC0', ink: null }); }
    paint(rectPts(-10, 1660, W + 20, 400), { wash: '#C99A6B', ink: null });
    pumpkin(640, 1700, 70, { ...face('happy', { blush: .7 }), draw: squareBody(1, PUMPKIN_COL.col), boilKey: 'cvk' });
    for (let i = 0; i < 3; i++) layer(['lettuce', 'cheese', 'tomato'][i], 640 + (i - 1) * 260, 760 - (i % 2) * 60, .9, (i - 1) * .4);
    pip(230, 1720, 62, { ...face('annoyed', { brow: 1, mouth: 'O', blush: .5 }), view: 'q', aR: .9, aL: .9, boilKey: 'cvp',
      armR: (u, sw) => { push(); translate(1.2 * u, 0); rotate(-.9); paint(ellPts(0, 0, 1.6 * u, .35 * u, 20), { wash: '#FFFFFF', sw: sw * .8 }); pop(); } });
    letter('ONE BITE.', W / 2, 230, 170, '#FFFFFF', { font: '800 170px "Baloo 2", sans-serif', stroke: '#2B2233', rot: -.04, screen: true });
    letter('WHOLE SANDWICH.', W / 2 + 10, 410, 120, '#E2463F', { font: '800 120px "Baloo 2", sans-serif', stroke: '#2B2233', rot: .04, screen: true });
  };
  LOOPS.cover.len = 2;
})();
