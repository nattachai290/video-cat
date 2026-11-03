// cast/sheet.js: model sheets for Pumpkin & Pip, as standalone loops (labels are fine here: sheets are reference).
// Works on any canvas size (landscape or the 1080 x 1920 Shorts frame). Render:
//   node ../../engine/render.mjs --loop=cast --sheet=1 --cols=1 --w=1080 --out=out/check/cast.jpg
//   node ../../engine/render.mjs --loop=facesPumpkin --sheet=1 --cols=1 --w=1080 --out=out/check/faces_pumpkin.jpg
//   node ../../engine/render.mjs --loop=facesPip --sheet=1 --cols=1 --w=1080 --out=out/check/faces_pip.jpg
//   node ../../engine/render.mjs --loop=cast --strip=0:1 --cols=6 --w=360 --out=out/check/cast_motion.jpg
(() => {
  const label = (txt, x, y, size = 22) => letter(txt, x, y, size, PAL.ink, { ink: false, alpha: .8 });
  const floor = (y, x0 = 0, x1 = W) => inkLine([[x0 + 30, y + 6], [(x0 + x1) / 2, y + 4], [x1 - 30, y + 7]], .6, mixCol(PAL.paper, PAL.ink, .35), 'inkfine', .5);
  const bg = () => paint(rectPts(-20, -20, W + 40, H + 40), { wash: '#F1E7D6', ink: null });
  const talk = t => .5 + .5 * Math.sin(t * TAU * 3);

  // Views (front, 3/4, side, facing left), Pumpkin's states, Pip's props. Rows scale with the canvas.
  LOOPS.cast = t => {
    bg();
    const rows = 4, rh = H / rows, u = Math.min(W / 46, rh / 15);
    const cell = (n, i) => W / n * (i + .5);
    // row 1: Pumpkin views
    let gy = rh * .86;
    [['front', {}], ['3/4', { view: 'q' }], ['side', { view: 'side', walk: t * 1.2 }], ['3/4 flip', { view: 'q', flip: true }]].forEach(([n, o], i) => {
      pumpkin(cell(4, i), gy, u * .85, { ...face('neutral', { seed: i }), ...o, boilKey: 'v' + i }); label(n, cell(4, i), gy + 30);
    });
    floor(gy);
    // row 2: Pumpkin states
    gy = rh * 1.86;
    [['belly (pie)', { belly: 1, ...face('proud') }], ['wet', { wet: 1, ...face('soggy') }], ['puff', { puff: 1, ...face('surprised') }], ['talking', { ...face('smug'), talk: talk(t), view: 'q' }]].forEach(([n, o], i) => {
      pumpkin(cell(4, i), gy, u * .8, { ...o, boilKey: 's' + i }); label(n, cell(4, i), gy + 30);
    });
    floor(gy);
    // row 3: Pip views, at the same u as Pumpkin would be (so the scale reads)
    gy = rh * 2.86;
    [['front', {}], ['3/4', { view: 'q' }], ['side run', { view: 'side', walk: t * 3, scarfWind: .9 }], ['cracker', { cracker: true, aR: .3, ...face('munching') }]].forEach(([n, o], i) => {
      pip(cell(4, i), gy, u * 1.15, { ...face('neutral', { seed: i + 4 }), ...o, boilKey: 'p' + i }); label(n, cell(4, i), gy + 30);
    });
    floor(gy);
    // row 4: the two together, in scale, talking to each other
    gy = rh * 3.86;
    pumpkin(W * .38, gy, u * .95, { ...face('deadpan'), view: 'q', talk: Math.max(0, talk(t + .5) - .4), boilKey: 'duoA' });
    pip(W * .74, gy, u * .95, { ...face('teasing'), view: 'q', flip: true, talk: Math.max(0, talk(t) - .4), cracker: true, aR: .2, boilKey: 'duoB' });
    label('in scale (same u)', W * .5, gy + 30);
    floor(gy);
  };
  LOOPS.cast.len = 2;

  const grid = (t, draw, scale) => {
    bg();
    const names = Object.keys(CAST_FACES), cols = W > H ? 6 : 3, rows = Math.ceil(names.length / cols);
    const cw = W / cols, rh = H / rows, u = Math.min(cw / 10, rh / 15.5) * scale;
    names.forEach((n, i) => {
      const cx = cw * (i % cols) + cw / 2, gy = rh * Math.floor(i / cols) + rh * .86;
      draw(cx, gy, u, { ...face(n, { seed: i }), view: 'q', boilKey: 'f' + i, talk: n === 'neutral' ? talk(t) : 0 });
      label(n, cx, gy + 26, 20);
    });
  };
  // Every face preset in CAST_FACES (3/4 view). 'neutral' is shown talking.
  LOOPS.facesPumpkin = t => grid(t, pumpkin, 1);
  LOOPS.facesPumpkin.len = 2;
  LOOPS.facesPip = t => grid(t, pip, 1.6);
  LOOPS.facesPip.len = 2;

  // Cuteness dial: the same pose at cute 0 / .6 / 1 (CAST_CUTE turns it on for the whole series).
  // Render: node ../../engine/flat/render_pw.mjs --loop=cute --still=0.2 --out=out/check/cute.jpg
  LOOPS.cute = t => {
    bg();
    const cw = W / 3, rh = H / 3, cell = i => cw * (i + .5), lv = [0, .6, 1], names = ['before (0)', 'series (.6)', 'max (1)'];
    const u = Math.min(cw / 11.5, rh / 15.5), say = k => Math.max(0, .5 + .5 * Math.sin(t * TAU * 2.2 + k) - .55);
    lv.forEach((c, i) => label(names[i], cell(i), 26, 22));
    let gy = rh * .8;
    lv.forEach((c, i) => pumpkin(cell(i), gy, u, { ...face('happy'), talk: say(i), cute: c, boilKey: 'cu' + i }));
    label('Pumpkin', 34, gy - u * 13, 20); floor(gy);
    gy = rh * 1.8;
    lv.forEach((c, i) => pip(cell(i), gy, u, { ...face('happy'), talk: say(i + 4), cute: c, boilKey: 'cp' + i }));
    label('Pip (same u)', 34, gy - u * 7.4, 20); floor(gy);
    gy = rh * 2.8;
    const du = u * .8;
    lv.forEach((c, i) => {
      pumpkin(cell(i) - cw * .16, gy, du, { ...face('smug'), view: 'q', cute: c, boilKey: 'dup' + i });
      pip(cell(i) + cw * .27, gy, du, { ...face('teasing'), view: 'q', flip: true, cracker: true, aR: .2, cute: c, boilKey: 'dpp' + i });
    });
    label('together', 34, gy - u * 10.5, 20); floor(gy);
  };
  LOOPS.cute.len = 2;
})();
