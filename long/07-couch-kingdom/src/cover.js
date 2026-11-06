// cover.js: the chapter thumbnails, drawn at 1920x1080 and scaled to 1280x720. Render: --loop=cover1 --still=0.3
// Chapter 1: Pumpkin, huge, crowned, holding a glowing Excalifork; the tiny folk of Lostland kneeling before him; Pip deadpan
// at his feet; "THE CHOSEN ONE?" big and readable at phone size.
(() => {
  LOOPS.cover1 = t => {
    paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#2E2A4A', ink: null });
    const cx = 640, cy = 560;
    for (let i = 0; i < 24; i += 2) { const a0 = i / 24 * TAU, a1 = (i + 1) / 24 * TAU; paint([[cx, cy], [cx + Math.cos(a0) * 2600, cy + Math.sin(a0) * 2600], [cx + Math.cos(a1) * 2600, cy + Math.sin(a1) * 2600]], { wash: '#3D3766', ink: null }); }
    glow(cx, cy - 100, 700, '#FFE7A8', .35);
    paint(rectPts(-10, 960, W + 20, 200), { wash: CK.floor, ink: null });
    // the hero
    const u = 62;
    sockCape(cx, 1000, u, { wind: .5 });
    pumpkin(cx, 1000, u, { ...face('proud', { mouth: 'grin', blush: .4 }), crown: true, aR: 1.15, armR: excalifork(1), aL: -1.0, noShadow: true, boilKey: 'c1' });
    // the kneeling folk around his feet
    [[150, 'bunny', 1], [290, 'btn', 0], [1090, 'btn', 2], [1230, 'bunny', 4]].forEach(([x, k, sd], i) => {
      if (k === 'bunny') dustBunny(x, 1000, 46, { ...face('happy', { eyes: 'happy' }), seed: sd, sq: .25, flip: x > cx, boilKey: 'cv' + i });
      else buttonFolk(x, 1000, 46, { ...face('happy', { eyes: 'happy' }), seed: sd, sq: .2, rot: (x < cx ? .25 : -.25), boilKey: 'cv' + i });
    });
    sirLint(420, 1000, 50, { ...face('happy', { blush: .6 }), view: 'q', sq: .2, rot: .25, boilKey: 'cvl' });
    // Pip, unimpressed
    pip(930, 1000, 50, { ...face('deadpan', { lookX: -1, lookY: -1 }), view: 'q', flip: true, aL: -.6, aR: -.6, boilKey: 'cvp' });
    // the words (right side, clear of the cat)
    letter('THE', 1560, 260, 120, '#FFFFFF', { font: '800 120px "Baloo 2", sans-serif', stroke: '#1B1F3A', rot: -.04, screen: true });
    letter('CHOSEN', 1560, 420, 190, '#FFE27A', { font: '800 190px "Baloo 2", sans-serif', stroke: '#1B1F3A', rot: -.04, screen: true });
    letter('ONE?', 1560, 610, 220, '#FFB347', { font: '800 220px "Baloo 2", sans-serif', stroke: '#1B1F3A', rot: .04, screen: true });
    letter('PUMPKIN & PIP · CH.1', 1560, 800, 54, '#C9C3F2', { font: '800 54px "Baloo 2", sans-serif', stroke: '#1B1F3A', screen: true });
  };
  LOOPS.cover1.len = 2;
})();
