// brand.js: Snackatoon channel art, drawn with the flat engine and the series cast.
//   LOOPS.profile  800 x 800: Pumpkin's big happy face, Pip sitting on his head with a cracker (reads as a circle).
//   LOOPS.banner   2560 x 1440 (?banner): logo + tagline in the 1546 x 423 safe area that every device shows,
//                  Pumpkin waving on the left, Pip on a cracker stack on the right, snacks scattered round the edges.
(() => {
  const SN = { sun: '#FFC94D', sun2: '#FFE08A', pink: '#FF8FA3', mint: '#7FD6B4', sky: '#8FD3F0', ink: '#2B2233', orange: '#F0973A', green: '#4FA060' };

  // ---- little snacks for the borders ----
  function cookie(x, y, r, rot) {
    push(); translate(x, y); rotate(rot);
    paint(ellPts(0, 0, r, r * .96, 24), { wash: '#D9A066', sw: r / 30, shade: true, shadeK: .5 });
    for (let i = 0; i < 5; i++) { const a = i * 1.3 + .4, d = r * (.25 + .4 * hash(i + r)); paint(ellPts(Math.cos(a) * d, Math.sin(a) * d, r * .13, r * .11, 10), { wash: '#6B3E26', ink: null }); }
    pop();
  }
  function cracker(x, y, s, rot) {
    push(); translate(x, y); rotate(rot);
    paint(rrPts(-s, -s, 2 * s, 2 * s, s * .18), { wash: '#E6B65F', sw: s / 35, shade: true, shadeK: .4 });
    for (const [a, b] of [[-.45, -.45], [.45, -.45], [-.45, .45], [.45, .45], [0, 0]]) paint(ellPts(a * s, b * s, s * .08, s * .08, 8), { wash: '#B8813A', ink: null });
    pop();
  }
  function donut(x, y, r, rot, icing) {
    push(); translate(x, y); rotate(rot);
    paint(ellPts(0, 0, r, r, 28), { wash: '#E2A35E', sw: r / 30 });
    paint(ellPts(0, -r * .05, r * .86, r * .82, 28).map(([a, b], i) => [a * (1 + (i % 3 ? 0 : .06)), b * (1 + (i % 3 ? 0 : .06))]), { wash: icing, ink: null });
    paint(ellPts(0, 0, r * .32, r * .32, 20), { wash: '#FFF3DA', sw: r / 40 });
    for (let i = 0; i < 9; i++) { const a = i * .7 + rot, d = r * (.5 + .2 * hash(i + 3)); push(); translate(Math.cos(a) * d, Math.sin(a) * d); rotate(a * 2); paint(rrPts(-r * .09, -r * .025, r * .18, r * .05, r * .025), { wash: ['#FFFFFF', '#7FD6B4', '#FFE08A', '#8FD3F0'][i % 4], ink: null }); pop(); }
    pop();
  }
  function sprinkle(x, y, s, rot, col) { push(); translate(x, y); rotate(rot); paint(rrPts(-s, -s * .3, 2 * s, s * .6, s * .3), { wash: col, ink: null }); pop(); }
  const snack = (i, x, y, s) => { const k = i % 3, rot = (hash(i * 7) - .5) * 1.4; if (k === 0) cookie(x, y, s, rot); else if (k === 1) cracker(x, y, s * .8, rot); else donut(x, y, s, rot, [SN.pink, '#C99BEA', SN.mint, '#FFFFFF'][Math.floor(hash(i * 3.3) * 4)]); };

  // ---- 800 x 800 profile ----
  LOOPS.profile = t => {
    paint(rectPts(-10, -10, W + 20, H + 20), { wash: SN.sun, ink: null });
    paint(ellPts(400, 420, 330, 330, 48), { wash: SN.sun2, ink: null });
    for (let i = 0; i < 26; i++) { const a = i / 26 * TAU + hash(i) * .2, d = 345 + hash(i + 40) * 40; sprinkle(400 + Math.cos(a) * d, 400 + Math.sin(a) * d, 13, a + hash(i) * 2, [SN.pink, SN.mint, SN.sky, '#FFFFFF', SN.orange][i % 5]); }
    pumpkin(400, 1045, 64, { ...face('happy', { blush: .7 }), aL: -1.35, aR: -1.35, noShadow: true, noTail: true, boilKey: 'pp' });
    pip(405, 318, 34, { ...face('happy', { blush: .5 }), cracker: true, aR: .55, aL: -.2, scarfWind: .3, noShadow: true, boilKey: 'pi' });
  };
  LOOPS.profile.len = 2;

  // ---- 2560 x 1440 banner ----
  LOOPS.banner = t => {
    const SAFE = { x: 507, y: 508, w: 1546, h: 423 };
    paint(rectPts(-10, -10, W + 20, H + 20), { wash: SN.sun, ink: null });
    paint(rrPts(SAFE.x - 140, SAFE.y - 60, SAFE.w + 280, SAFE.h + 120, 200), { wash: SN.sun2, ink: null });
    // snacks around the edges (TV and the cropped edges on desktop); none behind the logo
    let i = 0;
    for (let y = 70; y < H; y += 190) for (let x = 60 + (y / 190 % 2) * 120; x < W; x += 240) {
      i++;
      const inSafe = x > SAFE.x - 220 && x < SAFE.x + SAFE.w + 220 && y > SAFE.y - 110 && y < SAFE.y + SAFE.h + 110;
      if (!inSafe) snack(i, x + (hash(i) - .5) * 70, y + (hash(i + 9) - .5) * 60, 46 + hash(i + 3) * 18);
    }
    // logo: "Snack" orange + "atoon" green, one word, chunky with a dark outline
    const size = 140, f = s => `800 ${s}px "Baloo 2", sans-serif`;
    CTX.save(); CTX.font = f(size); const w1 = CTX.measureText('Snack').width, w2 = CTX.measureText('atoon').width; CTX.restore();
    const x0 = 1280 - (w1 + w2) / 2, ly = 690;
    letter('Snack', x0 + w1 / 2, ly, size, SN.orange, { font: f(size), stroke: SN.ink, rot: -.03 });
    letter('atoon', x0 + w1 + w2 / 2, ly + 6, size, '#5DBB6E', { font: f(size), stroke: SN.ink, rot: .02 });
    letter('Bite-size cartoon stories', 1280, 792, 52, '#FFFFFF', { font: f(52), stroke: SN.ink });
    // Pumpkin left (waving), Pip right on a cracker stack
    pumpkin(735, 875, 25, { ...face('happy', { blush: .6 }), view: 'q', aR: 1.25 + .1 * Math.sin(t * 6), aL: -.9, boilKey: 'bp' });
    for (let k = 0; k < 3; k++) { push(); translate(1760 + (k % 2 ? 6 : -5), 868 - k * 23); scale(1, .32); cracker(0, 0, 80, 0); pop(); }
    pip(1760, 808, 27, { ...face('teasing', { blush: .4 }), view: 'q', flip: true, cracker: true, aR: .4, aL: 1.2, scarfWind: -.3, noShadow: true, boilKey: 'bpi' });
  };
  LOOPS.banner.len = 2;
})();
