// shots.js: the 9 shots of "Pumpkin & Pip: The Sandwich" (45 s, 1080 x 1920). See STORYBOARD.md.
// The living room, face-on: a coffee table mid-rug with Pip's plate; the armchair right (Pumpkin lurks behind it).
// Frame 1 = last frame: close on Pip on the table, a slice of bread raised over an empty plate (the film loops).
(() => {
  const U = 40, FY = FY10, PT = [400, TABLE.top], CU = [490, 1330, 2.4];
  const cam = (cx, cy, z, sh = [0, 0]) => camBegin(cx + sh[0], cy + sh[1], z);
  const shake = (t, t0, amp = 10, dur = .35) => t > t0 && t < t0 + dur ? [Math.sin(t * 90) * amp * (1 - (t - t0) / dur), Math.cos(t * 77) * amp * .6 * (1 - (t - t0) / dur)] : [0, 0];
  const room = t => { livingRoom6(t); curtain(t); };
  const P0 = { ...face('happy'), view: 'q', aR: 1.0, aL: -.6, armR: breadHook };
  const nBuild = t => clamp((t - .3) / .24, 0, LAYERS.length);
  const BELLY = 1.0;
  // the hiccups (shot 07): layer i pops out at H[i] and lands on the plate 0.4 s later
  const H = [30.6, 31.2, 31.75, 32.25, 32.7, 33.05, 33.35, 33.6, 33.85, 34.1, 34.35, 34.6];
  const landed = t => H.filter(h => t >= h + .4).length;
  function table(t, px = PLATE[0]) { coffeeTable(); plate(px, PLATE[1]); }

  // 01 · 0–3.5 · CU: Pip stacks the tower, layer after layer, POP POP POP; the camera tilts up with it; a cracker on top. Ta-da.
  function s01(t) {
    const n = nBuild(t), top = PLATE[1] - 6 - LAYERS.slice(0, Math.floor(n)).reduce((s, l) => s + l[1], 0);
    cam(CU[0], lerp(CU[1], Math.min(CU[1], top + 160), ease(seg(t, .3, 3.0))), CU[2]);
    room(t); table(t);
    sandwich(...PLATE, n, t);
    const flick = t > .3 && t < 3.0 ? Math.abs(Math.sin((t - .3) / .24 * Math.PI)) : 0;
    pip(...PT, U, { ...P0, ...faces(t, [[0, 'happy'], [.4, 'determined', { lookX: 1, lookY: -.4 }], [3.0, 'proud']]), aR: t < .3 ? 1.0 : t < 3.0 ? .2 + .9 * flick : -.4, aL: t > 3.0 ? .9 : -.6,
      armR: t < .3 ? breadHook : undefined, dy: t > 3.0 ? -.1 * Math.abs(Math.sin(t * 10)) : 0, boilKey: 'pip' });
    if (t > 2.95) { const k = seg(t, 2.95, 3.3); for (let i = 0; i < 3; i++) paint(starPts(560 - 70 + i * 70, PLATE[1] - STACK_H - 50 - (i % 2) * 30, 22 * Math.sin(k * Math.PI), .22, 4), { wash: '#FFFFFF', ink: null }); }
    camEnd();
  }

  // 02 · 3.5–7 · Behind the armchair: ears, eyes... pupils go huge. Drool. "...Sandwich."
  function s02(t) {
    cam(840, 760, 2.2);
    room(t);
    const peek = ease(seg(t, 3.6, 4.4)), boom = backOut(seg(t, 4.6, 4.8));
    clipRects([[640, -600, 420, 836 + 600]], () => pumpkin(840, 1110 + (1 - peek) * 260, U, { ...face('neutral', { lookX: -.8, lookY: .5 }), eyes: 'wide', lid: 0, pupil: lerp(.4, 1.15, boom), browUp: .4 * boom,
      aL: -1.2, aR: -1.2, noShadow: true, who: 'pumpkin', boilKey: 'pk' }));
    drool(855, 800, 330 * ease(seg(t, 5.4, 6.6)), t);
    camEnd();
  }

  // 03 · 7–12 · He strolls past, whistling, all innocent... SWIPE. Pip spins the plate away; the paw slaps the rim; a tomato
  // slice flips up and sticks to his face. "Nope."
  function s03(t) {
    cam(600, 1330, 1.4);
    room(t);
    const spin = t < 10.6 ? ease(seg(t, 8.85, 9.05)) : 1 - ease(seg(t, 10.6, 11.2)), px = PLATE[0] - 110 * spin;
    table(t, px); sandwich(px, PLATE[1], LAYERS.length, t, { wobble: t > 8.85 && t < 9.6 ? .5 : 0 });
    const walk = seg(t, 7.0, 8.5), swipe = seg(t, 8.8, 9.05), KX = lerp(1220, 930, walk);
    pumpkin(KX, FY, U, { ...faces(t, [[7, 'neutral', { lid: .45, mouth: 'O', lookX: .3 }], [8.6, 'greedy', { lookX: .6, lookY: .5 }], [9.35, 'deadpan', { lid: .5 }]]),
      view: 'side', flip: true, walk: walk < 1 ? t * 2.2 : null, aR: swipe > 0 ? lerp(-.9, .3, swipe) - (t > 9.05 ? .5 * seg(t, 9.05, 9.4) : 0) : undefined, boilKey: 'pk' });
    if (t > 7.1 && t < 8.6) for (let i = 0; i < 2; i++) { const k = frac(t * 1.2 + i * .5); letter('♪', KX - 190 - k * 40, 1220 - k * 90, 46, '#5A6FA8', { alpha: 1 - k }); }
    // the tomato slice: flips up off the plate and sticks to his face, then slides off
    const fly = seg(t, 9.05, 9.35), FACE = [KX - 150, 1262];
    if (fly > 0) {
      let x, y, r = 0;
      if (fly < 1) { const p = arcPt([PLATE[0] + 20, PLATE[1] - 80], FACE, 160, fly); x = p[0]; y = p[1]; r = fly * 9; }
      else { const sl = easeIn(seg(t, 11.0, 11.6)); x = FACE[0]; y = FACE[1] + sl * 300; r = sl * 2; }
      push(); translate(x, y); rotate(r); paint(ellPts(0, 0, 40, 34, 18), { wash: '#E2463F', sw: 1.2 }); paint(ellPts(0, 0, 28, 23, 14), { wash: '#F27A6E', ink: null }); for (const [a, b] of [[-10, -6], [10, -4], [0, 10]]) paint(ellPts(a, b, 5, 7, 8), { wash: '#F7D79A', ink: null }); pop();
    }
    burst(PLATE[0] - 20, PLATE[1] - 10, 120, (t - 9.05) / .3, 8, '#FFFFFF', 2);
    pip(...PT, U, { ...faces(t, [[7, 'happy'], [8.6, 'smug', { lookX: 1 }], [8.85, 'determined'], [9.4, 'smug', { lid: .5 }]]), view: 'q', aR: spin > 0 && spin < 1 ? .4 : -.4, aL: spin > 0 && spin < 1 ? .4 : -.6, who: 'pip', boilKey: 'pip' });
    camEnd();
  }

  // 04 · 12–18 · Spy music. Pumpkin on top of the armchair lowers a fishing line... the hook swings... and snags Pip's
  // scarf instead. Pip is reeled up, dangling face to face with the rod. "HEY!"
  function s04(t) {
    cam(640, 1150, 1.05);
    room(t); table(t); sandwich(...PLATE, LAYERS.length, t);
    const SIT = [850, 836], PAW = [625, 512], TIP = [470, 420];
    let hx = TIP[0] + 22 * Math.sin(t * 2.2), hy = lerp(440, 1150, ease(seg(t, 12.4, 14.2)));
    if (t > 14.2) { const k = ease(seg(t, 14.2, 14.7)); hx = lerp(TIP[0] + 22 * Math.sin(14.2 * 2.2), PT[0] + 12, k); hy = lerp(1150, PT[1] - 3.3 * U, k); }
    const reel = ease(seg(t, 14.8, 15.6)), snag = t >= 14.7;
    if (snag) { hx = lerp(PT[0] + 12, TIP[0], reel) + Math.sin(t * 3) * 14 * reel; hy = lerp(PT[1] - 3.3 * U, 880, reel); }
    pumpkin(...SIT, U, { ...faces(t, [[12, 'determined', { lookX: -1, lookY: 1 }], [14.7, 'happy', { lookX: -1, lookY: 1 }], [15.4, 'surprised', { lookX: -1 }], [16.2, 'sheepish', { lookX: -1 }]]),
      aL: .6, aR: -1.2, noShadow: true, boilKey: 'pk' });
    fishingRod(...PAW, ...TIP, hx, hy);
    if (!snag) pip(...PT, U, { ...faces(t, [[12, 'proud'], [13.8, 'happy', { lookX: 1 }]]), view: 'q', aR: -.4, aL: -.6, boilKey: 'pip' });
    else pip(hx - 12, hy + 3.3 * U, U, { ...faces(t, [[14.7, 'surprised', { eyes: 'wide' }], [15.4, 'annoyed', { brow: .9, mouth: 'O' }], [16.6, 'annoyed', { lookX: 1 }]]), rot: Math.sin(t * 3) * .12,
      aL: t < 16.2 ? 1.0 + Math.sin(t * 18) * .4 : -.3, aR: t < 16.2 ? 1.0 - Math.sin(t * 18) * .4 : -.3, noShadow: true, who: 'pip', boilKey: 'pip' });
    camEnd();
  }

  // 05 · 18–24 · He lowers Pip back down, rolls a cracker across the floor: Pip can't resist and runs after it.
  // Then: the jaw opens... wider... WIDER... (silence)... GULP. The whole tower, in one bite.
  function s05(t) {
    cam(600, 1300, 1.15);
    room(t); table(t);
    const gulp = seg(t, 23.35, 23.55), shut = t >= 23.55;
    if (gulp <= 0) sandwich(...PLATE, LAYERS.length, t, { wobble: t > 21.2 && t < 23.35 ? .25 : 0 });
    // the rod and the lowering of Pip
    const low = ease(seg(t, 18.0, 18.6));
    if (t < 18.7) { const hy = lerp(880, PT[1] - 3.3 * U, low), hx = lerp(470, PT[0] + 12, low); fishingRod(625, 512, 470, 420, hx, hy); }
    // Pumpkin: on the chair, hops down, rolls the cracker, then over to the table and the big mouth
    const hop = seg(t, 18.7, 19.1), walk = seg(t, 20.5, 21.1), mouth = ease(seg(t, 21.2, 23.0)) * (shut ? 0 : 1);
    let kx = 840, ky = FY, view = 'front', flip = false, walkp = null, aL = -1.2, aR = -1.2, noShadow = false;
    if (t < 18.7) { kx = 850; ky = 836; aL = .6; noShadow = true; }
    else if (hop < 1) { const p = arcPt([850, 836], [840, FY], 80, ease(hop)); kx = p[0]; ky = p[1]; noShadow = true; }
    else if (t < 20.5) { aL = t > 19.0 && t < 19.4 ? .2 : -1.2; }
    else if (walk < 1) { kx = lerp(840, 700, ease(walk)); view = 'side'; flip = true; walkp = t * 2.2; }
    else kx = 700;
    const sq = shut ? .25 * Math.exp(-(t - 23.55) * 6) * Math.cos((t - 23.55) * 22) : 0;
    pumpkin(kx, ky, U, { ...faces(t, [[18, 'sheepish', { lookX: -1 }], [19.2, 'smug', { lookX: -1 }], [21.1, 'greedy', { pupil: 1.1, lookX: -.6, lookY: .4 }], [23.55, 'happy', { blush: .6 }]]),
      view, flip, walk: walkp, aL, aR, sq, noShadow, dy: mouth > 0 && !shut ? Math.sin(t * 40) * .04 * mouth : 0,
      draw: view === 'front' ? (u, sw) => { bigMouth(mouth)(u, sw); squareBody(shut ? 1 : 0, PUMPKIN_COL.col)(u, sw); } : undefined, boilKey: 'pk' });
    if (gulp > 0 && gulp < 1) { push(); const x = lerp(PLATE[0], 700, ease(gulp)), y = lerp(PLATE[1], FY - 6.2 * U + 60, ease(gulp)), s = lerp(1, .15, ease(gulp)); translate(x, y); scale(s, s); sandwich(0, 0, LAYERS.length, t); pop(); }
    puffCloud(700, FY - 250, 220, (t - 23.55));
    // the cracker roll
    const roll = seg(t, 19.2, 20.5);
    if (roll > 0 && roll < 1) crackerProp(lerp(780, -200, roll), FY - 16, roll * 30);
    // Pip
    const off = seg(t, 19.6, 19.9), run = seg(t, 19.9, 20.7);
    if (t < 19.6) pip(PT[0] + (t < 18.6 ? 0 : 0), t < 18.6 ? lerp(880, PT[1] - 3.3 * U, low) + 3.3 * U : PT[1], U, { ...faces(t, [[18, 'annoyed'], [19.3, 'surprised', { lookX: -1, lookY: .5 }], [19.5, 'greedy', { lookX: -1 }]]), view: 'q', flip: t > 19.3,
      rot: t < 18.6 ? Math.sin(t * 3) * .1 : 0, aL: -.3, aR: -.3, noShadow: t < 18.6, boilKey: 'pip' });
    else if (off < 1) { const p = arcPt(PT, [300, FY], 60, off); pip(p[0], p[1], U, { ...face('greedy'), view: 'side', flip: true, noShadow: true, boilKey: 'pip' }); }
    else if (run < 1) { pip(lerp(300, -220, run), FY, U, { ...face('greedy'), view: 'side', flip: true, walk: t * 4, scarfWind: 1, boilKey: 'pip' }); speedLines(lerp(300, -220, run), FY - 120, -1, t, 3, 120, 120); }
    camEnd();
  }

  // 06 · 24–30 · The gulp has made him a box: a square cat with sandwich layers. Pip runs back with his cracker... the
  // empty plate... the square cat. "...Worth it."
  function s06(t) {
    cam(640, 1330, 1.35);
    room(t); table(t);
    pumpkin(830, FY, U, { ...faces(t, [[24, 'happy', { blush: .6 }], [26.8, 'proud', { blush: .5 }], [28.6, 'sheepish', { lookX: -1 }]]), draw: squareBody(1, PUMPKIN_COL.col), who: 'pumpkin', boilKey: 'pk' });
    const run = seg(t, 24.4, 25.4), hop = seg(t, 25.4, 25.8);
    let px, py = FY, view = 'side', walk = null, flip = false;
    if (run < 1) { px = lerp(-100, 300, run); walk = t * 4; }
    else if (hop < 1) { const p = arcPt([300, FY], PT, 60, hop); px = p[0]; py = p[1]; }
    else { px = PT[0]; py = PT[1]; view = 'q'; }
    const fume = t > 28.6;
    pip(px, py, U, { ...faces(t, [[24, 'happy'], [26.0, 'surprised', { lookX: 1, lookY: .6 }], [26.6, 'annoyed', { lookX: 1 }], [28.6, 'annoyed', { brow: 1, mouth: 'gritted' }]]), view, flip, walk,
      cracker: t < 26.0, aR: t < 26 ? .2 : -.5, aL: fume ? .6 : -.6, rot: fume ? Math.sin(t * 40) * .04 : 0, noShadow: hop > 0 && hop < 1, boilKey: 'pip' });
    if (fume) for (let i = 0; i < 2; i++) puffCloud(PT[0] + (i ? 40 : -40), PT[1] - 360, 50, frac(t * 1.5 + i * .5) * .7);
    camEnd();
  }

  // 07 · 30–36 · He flops over; Pip jumps on his belly: HIC! A layer pops out and lands on the plate. Again, faster and
  // faster, the whole tower rebuilds itself. He pops back to round.
  function s07(t) {
    cam(660, 1340, 1.3);
    room(t); table(t);
    const n = landed(t), sqK = 1 - n / LAYERS.length, round = t >= 34.95;
    sandwich(...PLATE, n, t);
    const r = 0, flop = 0;
    const hic = H.reduce((m, h) => t >= h && t < h + .25 ? 1 - (t - h) / .25 : m, 0);
    pumpkin(830, FY, U, { ...faces(t, [[30, 'happy', { blush: .5 }], [30.6, 'surprised', { eyes: 'squeeze' }], [33.0, 'dazed', { eyes: 'squeeze' }], [35.0, 'surprised'], [35.8, 'sheepish']]),
      rot: r, dy: -4.3 * Math.sin(r), sq: .12 * hic, noShadow: flop > .1, draw: round ? undefined : squareBody(sqK > .05 ? 1 : 0, PUMPKIN_COL.col), boilKey: 'pk' });
    if (round) puffCloud(830, FY - 250, 220, t - 34.95);
    // HIC! and the layers flying from his mouth to the plate
    const MOUTH = [830, FY - 7.9 * U];
    H.forEach((h, i) => {
      const k = seg(t, h, h + .4); if (k <= 0 || k >= 1) return;
      const topY = PLATE[1] - 6 - LAYERS.slice(0, i).reduce((s, l) => s + l[1], 0), p = arcPt(MOUTH, [PLATE[0], topY], 220, ease(k));
      layer(LAYERS[i][0], p[0], p[1], 1, (1 - k) * 6, .6);
      if (k < .5) letter('HIC!', MOUTH[0] + 30, MOUTH[1] - 120 - k * 60, 54, '#FFFFFF', { stroke: '#2B2233', alpha: 1 - k * 2, rot: -.1 });
    });
    // Pip: jumps on, bounces on every hiccup, then hops back to the table
    const on = seg(t, 30.2, 30.6), back = seg(t, 34.9, 35.4), TOP = [830, FY - 11.3 * U];
    let px, py, noShadow = true;
    if (on < 1) { const p = arcPt(PT, TOP, 160, ease(on)); px = p[0]; py = p[1]; noShadow = on > 0; }
    else if (back <= 0) { const last = [...H].reverse().find(h => t >= h) ?? 30.6, k = clamp((t - last) / .3); px = TOP[0]; py = TOP[1] - (t < 32.9 ? 70 : 20) * Math.sin(k * Math.PI); }
    else if (back < 1) { const p = arcPt(TOP, PT, 140, back); px = p[0]; py = p[1]; }
    else { px = PT[0]; py = PT[1]; noShadow = false; }
    pip(px, py, U, { ...faces(t, [[30, 'annoyed', { brow: 1 }], [31.4, 'surprised', { lookX: -1 }], [32.6, 'happy', { mouth: 'grin' }], [35.4, 'neutral', { lookX: 1 }]]), view: 'q', aL: 1.0, aR: 1.0, noShadow, boilKey: 'pip' });
    camEnd();
  }

  // 08 · 36–41 · The tower is back... dripping with drool. Pip's face. "...You keep it." He slides the plate over. Stars in
  // Pumpkin's eyes.
  function s08(t) {
    cam(600, 1340, 1.5);
    room(t);
    const push2 = ease(seg(t, 39.8, 40.3)), px = PLATE[0] + 110 * push2;
    table(t, px); sandwich(px, PLATE[1], LAYERS.length, t, { slime: 1 });
    pumpkin(870, FY, U, { ...faces(t, [[36, 'happy', { lookX: -1 }], [40.3, 'greedy', { eyes: 'wide', pupil: 1.15, lookX: -1, blush: .6 }]]), aL: t > 40.3 ? 1.2 : -1.2, aR: t > 40.3 ? 1.2 : -1.2, boilKey: 'pk' });
    if (t > 40.3) for (let i = 0; i < 4; i++) { const k = Math.max(0, Math.sin(t * 6 + i * 1.7)); if (k > .3) paint(starPts(870 - 200 + i * 130, FY - 560 - (i % 2) * 50, 26 * k, .22, 4), { wash: '#FFE27A', ink: null }); }
    pip(...PT, U, { ...faces(t, [[36, 'surprised', { lookX: 1 }], [37.0, 'annoyed', { mouth: 'wobble', lookX: 1, lid: .4 }], [38.6, 'deadpan', { lookX: 1 }]]), view: 'q',
      aR: push2 > 0 && push2 < 1 ? .1 : -.5, aL: push2 > 0 && push2 < 1 ? .1 : -.6, rot: t > 37 && t < 38.4 ? Math.sin(t * 30) * .03 : 0, who: 'pip', boilKey: 'pip' });
    camEnd();
  }

  // 09 · 41–45 · Pumpkin carries his prize off, delighted. Pip sighs, sets out a fresh plate, raises a new slice of bread.
  // Cut close = frame 1.
  function s09(t) {
    if (t < 43.2) {
      cam(600, 1330, 1.2);
      room(t); coffeeTable();
      const walk = seg(t, 41.6, 43.0), kx = lerp(870, 1350, walk);
      if (t > 42.2) plate(PLATE[0] - 0, PLATE[1]);
      push(); translate(kx, FY - 13.2 * U); plate(0, 0); sandwich(0, 0, LAYERS.length, t, { slime: 1 }); pop();
      pumpkin(kx, FY, U, { ...face('happy', { blush: .5 }), view: walk > 0 ? 'side' : 'front', walk: walk > 0 ? t * 2.4 : null, aL: 1.35, aR: 1.35, boilKey: 'pk' });
      pip(...PT, U, { ...faces(t, [[41, 'deadpan', { lookX: 1 }], [41.8, 'sheepish', { lid: .4 }], [42.6, 'happy']]), view: 'q', sq: .12 * Math.sin(seg(t, 41.6, 42.2) * Math.PI),
        aR: lerp(-.5, 1.0, ease(seg(t, 42.4, 42.9))), aL: -.6, armR: t > 42.4 ? breadHook : undefined, boilKey: 'pip' });
      camEnd(); return;
    }
    cam(...CU); room(t); table(t);
    pip(...PT, U, { ...P0, boilKey: 'pip' });
    camEnd();
  }

  shots([[0, s01], [3.5, s02], [7, s03], [12, s04], [18, s05], [24, s06], [30, s07], [36, s08], [41, s09]]);
})();
