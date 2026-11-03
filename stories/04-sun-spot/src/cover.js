// cover.js: the cover / thumbnail of "The Sun Spot" (1080 x 1920), drawn fresh: Pumpkin stretched impossibly tall up a
// wall after a tiny patch of sunlight, eyes shut, Pip below with the lid, laughing. Render (from stories/04-sun-spot):
//   NODE_PATH=$(npm root -g) node ../../engine/flat/render_pw.mjs --loop=cover --still=0.6 --out=out/cover.png
(() => {
  LOOPS.cover = t => {
    paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#BFE3EE', ink: null });
    const cx = 560, cy = 760;
    for (let i = 0; i < 24; i += 2) { const a0 = i / 24 * TAU, a1 = (i + 1) / 24 * TAU; paint([[cx, cy], [cx + Math.cos(a0) * 2600, cy + Math.sin(a0) * 2600], [cx + Math.cos(a1) * 2600, cy + Math.sin(a1) * 2600]], { wash: '#D6EEF4', ink: null }); }
    paint(rectPts(-10, 1640, W + 20, 400), { wash: '#C99A6B', ink: null });
    // the sun spot high on the wall, glowing
    glow(560, 760, 330, '#FFC94D', .9);
    paint(rrPts(420, 640, 280, 250, 50), { wash: '#FFD54F', washOp: 230, ink: null });
    paint(rrPts(470, 690, 180, 150, 36), { wash: '#FFF3B0', washOp: 230, ink: null });
    // Pumpkin, stretched like an elastic band, face pressed into the light
    pumpkin(560, 1700, 46, { ...face('happy', { eyes: 'closed', blush: .8 }), sq: -.95, aL: 1.55, aR: 1.5, rot: .03, tailWag: 1, boilKey: 'cv' });
    for (const s of [-1, 1]) for (let k = 0; k < 3; k++) inkLine([[560 + s * (120 + k * 26), 1200 + k * 120], [560 + s * (150 + k * 26), 1230 + k * 120]], 4, '#2B2233', 'ink', 0);   // strain marks
    // Pip below, laughing, lid in hand
    pip(860, 1760, 52, { ...face('happy', { eyes: 'squeeze', mouth: 'grin', blush: .9, talk: .6 }), view: 'q', flip: true, aL: .9, aR: -.4,
      armR: (u, sw) => { paint(ellPts(u * .9, 0, u * .95, u * .9, 26), { wash: '#D9E2EA', sw: 1.4 }); paint(ellPts(u * .9, 0, u * .65, u * .62, 20), { wash: '#EEF3F7', ink: null }); }, boilKey: 'cvp' });
    letter('COME BACK,', W / 2, 230, 150, '#FFFFFF', { font: '800 150px "Baloo 2", sans-serif', stroke: '#2B2233', rot: -.04, screen: true });
    letter('SUN!!', W / 2 + 10, 410, 240, '#FFB347', { font: '800 240px "Baloo 2", sans-serif', stroke: '#2B2233', rot: .05, screen: true });
  };
  LOOPS.cover.len = 2;
})();
