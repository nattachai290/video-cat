// shots.js: the 11 shots of "Pumpkin & Pip: Static Zap" (45 s, 1080 x 1920). See STORYBOARD.md.
// The series' living room, face-on; the door is off to the LEFT (x < 0). Pip's perch: the armchair's left arm.
// Frame 1 = last frame: close on sleeping Pumpkin's head, Pip's balloon resting on it (the film loops).
(() => {
  const U = 40, PK = 540, PERCH = [690, 1046];
  const cam = (cx, cy, z, sh = [0, 0]) => camBegin(cx + sh[0], cy + sh[1], z);
  const shake = (t, t0, amp = 10, dur = .35) => t > t0 && t < t0 + dur ? [Math.sin(t * 90) * amp * (1 - (t - t0) / dur), Math.cos(t * 77) * amp * .6 * (1 - (t - t0) / dur)] : [0, 0];
  const room = t => livingRoom12(t);
  const CU = [560, 1090, 2.4];
  const SLEEP = { ...face('proud'), eyes: 'closed', mouth: 'w', aL: -1.3, aR: -1.3, tailWag: 0 };
  const claws = (u, sw) => { for (let k = -1; k <= 1; k++) paint([[.1 * u, k * .28 * u - .1 * u], [.75 * u, k * .34 * u], [.1 * u, k * .28 * u + .1 * u]], { wash: '#FFFFFF', ink: PAL.ink, sw: sw * .5 }); };

  // Pip on the chair arm, holding a balloon out to the left at his paw. rub: 0..1 how hard he's rubbing (balloon swings).
  function pipBalloon(t, o = {}, rub = 0, bs = .55) {
    const swing = Math.sin(t * 16) * 26 * rub, aR = (o.aR ?? -.6) + Math.sin(t * 16) * .12 * rub;
    pip(PERCH[0], PERCH[1], U, { view: 'q', flip: true, aL: -.6, ...o, aR, boilKey: 'pip' });
    const pw = [PERCH[0] - 1.2 * U - Math.cos(aR) * 1.3 * U, PERCH[1] - 2.7 * U - Math.sin(aR) * 1.3 * U];
    // held against his paw, pressed onto whatever is below-left
    if (bs > 0) balloon(pw[0] - 70 * bs / .55 + swing, pw[1] + 40 * bs / .55, bs, { sq: rub * .12 * Math.abs(Math.sin(t * 16)), string: false, rot: .5 + swing * .002 });
    return pw;
  }
  // the sleeping head close-up, used by shot 01 and (identically at its end) shot 11. k = static charge 0..1.
  function sleepCU(t, k, rub, bs = .55, pipO = {}) {
    cam(...CU); room(t);
    chargedPumpkin(PK, FY, U, { ...SLEEP, sparks: false, boilKey: 'pk' }, k, t);
    zzz(PK - 230, 960, 1, t);
    pipBalloon(t, { ...face('teasing'), ...pipO }, rub, bs);
    camEnd();
  }

  // 01 · 0–2.5 · CU: the balloon squeaks back and forth on the sleeping head; the fur rises in spikes... ZAP.
  function s01(t) {
    const rub = seg(t, .15, .4) * (1 - seg(t, 2.0, 2.15)), k = ease(seg(t, .3, 2.0)) * .75;
    sleepCU(t, k, rub, .55, faces(t, [[0, 'teasing'], [1.0, 'happy', { mouth: 'grin' }]]));
    if (t > 2.0) { cam(...CU); zapBolt(PK - 40, 1050, PK - 180, 1000, t, 4, 2); burst(PK, 1060, 120, (t - 2.0) / .35, 8, ZAP, 1); camEnd(); }
  }

  // 02 · 2.5–6 · Zoom out: FWOOMP, the whole cat puffs into a spiky ball. He wakes, eyes popping, and floats up a bit.
  // Pip: "Static boost!" At 5.4 he turns to the door (left).
  function s02(t) {
    const fw = 2.55, z = lerp(2.4, 1.3, ease(seg(t, 2.5, 2.9)));
    cam(lerp(560, 520, ease(seg(t, 2.5, 2.9))), lerp(1090, 1160, ease(seg(t, 2.5, 2.9))), z, shake(t, fw, 12));
    room(t);
    const k = lerp(.75, 1, backOut(seg(t, fw, fw + .25))), float = t > 3.0 ? -.35 - .12 * Math.sin(t * 5) : 0;
    const turn = t > 5.4;
    chargedPumpkin(PK, FY, U, { ...faces(t, [[2.5, 'proud', { eyes: 'closed' }], [3.0, 'surprised', { eyes: 'wide', pupil: .1 }], [4.6, 'annoyed', { lookX: 1 }]]),
      view: turn ? 'q' : 'front', flip: turn, dy: float, aL: t > 3 ? .3 : -1.3, aR: t > 3 ? .3 : -1.3, noShadow: float < 0, boilKey: 'pk' }, k, t);
    if (float < 0) castShadow(PK, FY, U * 5, U, float);
    puffCloud(PK, FY - 300, 330, (t - fw) / 1);
    pipBalloon(t, { ...faces(t, [[2.5, 'happy', { mouth: 'grin' }], [4.6, 'teasing']]), who: 'pip', aL: t > 3.2 && t < 4.4 ? .9 : -.6 }, 0);
    camEnd();
  }

  // 03 · 6–9.5 · The door. He reaches for the brass knob... CRACK! A flash, a bolt, whiskers frizzled, smoke from his ears.
  function s03(t) {
    const zap = 7.3, x = 90;
    cam(-60, 1220, 1.45, shake(t, zap, 26, .6));
    room(t);
    doorKnob(t, t > zap ? .9 * Math.exp(-(t - zap) * 3) : 0);
    const reach = ease(seg(t, 6.0, 7.2)), hit = t > zap, k = Math.exp(-(t - zap) * 4);
    chargedPumpkin(x, FY, U, { ...faces(t, [[6, 'determined', { lookX: 1 }], [zap, 'panic', { eyes: 'wide', pupil: 0 }], [8.3, 'dazed', { eyes: 'spiral' }]]), view: 'q', flip: true,
      aR: hit ? 1.2 : lerp(-.6, .62, reach), aL: hit ? 1.2 : -.8, rot: hit ? .12 * k * Math.sin((t - zap) * 30) : 0, sq: hit ? -.12 * k : 0, boilKey: 'pk' }, 1, t);
    if (hit && t < zap + .5) { zapBolt(DOOR.knob[0], DOOR.knob[1], x - 210, 1180, t, 6, 4); zapBolt(DOOR.knob[0] + 10, DOOR.knob[1] - 20, x - 120, 1000, t, 4, 5); }
    flash(t > zap && t < zap + .09 ? 1 : 0, -60, 1220);
    if (t > 8.0) { puffCloud(x - 160, 1060 - (t - 8) * 120, 40, frac((t - 8) * 1.2) * .7); puffCloud(x + 150, 1060 - (t - 8) * 120, 40, frac((t - 8) * 1.2 + .4) * .7); dizzy(x, 840, 120, t); }
    camEnd();
  }

  // ---- the junk: things that fly at the charged cat and stick. at = where it sticks, relative to his body centre
  // (PK, FY - 6U) before any roll; src = where it flies from; t0 = launch time; fly .4 s.
  const JUNK = [
    { t0: 10.0, src: [150, FY - 20], at: [-4.6, 1.6], r: .9, d: (x, y, r) => sock(x, y, r) },
    { t0: 10.9, src: [760, FY - 30], at: [4.4, 2.6], r: .4, d: (x, y, r) => crackerProp(x, y, r, 1.6) },
    { t0: 11.8, src: [840, 1100], at: [-1.6, 3.3], r: .35, d: (x, y, r) => remote(x, y, r) },
    { t0: 14.6, src: [850, 1112], at: [.4, 4.9], r: -.05, d: (x, y, r) => cushion(x, y, r, 1.2) },
    { t0: 15.1, src: [1000, 980], at: [5.0, -1.6], r: 1.2, d: (x, y, r) => pillow(x, y, r, .9) },
    { t0: 15.6, src: [80, FY - 60], at: [-5.0, -3.4], r: 0, d: (x, y, r) => yarn(x, y, r, 1.1) },
    { t0: 16.0, src: [760, FY - 30], at: [5.3, 4.6], r: -.6, d: (x, y, r) => crackerProp(x, y, r, 1.6) },
    { t0: 16.1, src: [760, FY - 30], at: [-3.4, -6.4], r: .8, d: (x, y, r) => crackerProp(x, y, r, 1.6) },
  ];
  const PIPSTICK = { t0: 16.4, src: [860, FY], at: [1.2, 1.2] };
  const rotP = ([x, y], a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
  // world position of a stuck spot, body centre (cx, cy), roll a
  const stuckAt = (j, cx, cy, a) => { const p = rotP([j.at[0] * U, j.at[1] * U], a); return [cx + p[0], cy + p[1]]; };
  // draw the junk at time t for a body centred at (cx, cy) rolled by a. pop: 0..1 the blast that flings it all away.
  function drawJunk(t, cx, cy, a, blast = 0) {
    for (const [i, j] of JUNK.entries()) {
      const f = seg(t, j.t0, j.t0 + .4); if (f <= 0) continue;
      const s = stuckAt(j, cx, cy, a);
      if (blast > 0) { const dir = Math.atan2(s[1] - cy, s[0] - cx), d = 900 * easeOut(blast); j.d(s[0] + Math.cos(dir) * d, s[1] + Math.sin(dir) * d + 600 * blast * blast, j.r + a + blast * 8 * (i % 2 ? 1 : -1)); continue; }
      if (f < 1) { const p = arcPt(j.src, s, 160, ease(f)); j.d(p[0], p[1], f * 6); }
      else { j.d(s[0], s[1], j.r + a); burst(s[0], s[1], 70, (t - j.t0 - .4) / .3, 6, '#FFFFFF', i); }
    }
  }
  function drawStuckPip(t, cx, cy, a, o = {}) {
    const f = seg(t, PIPSTICK.t0, PIPSTICK.t0 + .4); if (f <= 0) return;
    const s = stuckAt(PIPSTICK, cx, cy, a);
    if (f < 1) { const p = arcPt(PIPSTICK.src, [s[0], s[1] + 80], 200, ease(f)); pip(p[0], p[1], U * .9, { ...face('panic'), view: 'q', flip: true, rot: -f * 4, aL: 1.3, aR: 1.3, scarfWind: 1, noShadow: true, boilKey: 'pip' }); return; }
    pip(s[0], s[1] + 80, U * .9, { ...face('panic'), view: 'front', rot: a - .2, aL: 1.2 + Math.sin(t * 22) * .3, aR: 1.2 + Math.cos(t * 22) * .3, dy: 0, noShadow: true, who: 'pip', ...o, boilKey: 'pip' });
  }
  // the charged cat with all his junk: body centre (cx, cy), roll a.
  function junkCat(t, cx, cy, a, o, k = 1, blast = 0) {
    push(); translate(cx, cy); rotate(a);
    chargedPumpkin(0, 6 * U, U, { ...o, noShadow: true, boilKey: 'pk' }, k, t);
    pop();
    drawJunk(t, cx, cy, a, blast);
  }

  // 04 · 9.5–14 · Sock... pap. Cracker... pap. The TV remote... PAP. He looks down at each one.
  function s04(t) {
    cam(470, 1300, 1.2);
    room(t);
    plate(760, FY + 20, t < 10.9 ? 3 : 2);
    pip(860, FY, U, { ...faces(t, [[9.5, 'happy'], [10.9, 'surprised'], [12.4, 'innocent']]), view: 'q', flip: true, aL: -.6, aR: -.6, boilKey: 'pip' });
    const look = t < 10.3 ? [-1, .5] : t < 11.2 ? [1, .5] : t < 12.1 ? [-.3, 1] : [0, 0];
    castShadow(PK, FY, U * 5, U);
    junkCat(t, PK, FY - 6 * U, 0, { ...faces(t, [[9.5, 'dazed', { eyes: 'spiral' }], [10.0, 'surprised', { lookX: look[0], lookY: look[1] }], [10.9, 'surprised', { lookX: 1, lookY: .5 }], [11.8, 'annoyed', { lookY: 1 }], [12.9, 'deadpan']]), aL: -.6, aR: -.6 }, 1);
    camEnd();
  }

  // 05 · 14–19 · He shakes like a wet dog: worse! Cushion, pillow, yarn, more crackers... and Pip himself. "Help!"
  function s05(t) {
    const sh = seg(t, 14.2, 14.4) * (1 - seg(t, 16.2, 16.5)), a = Math.sin(t * 28) * .22 * sh;
    cam(500, 1280, 1.15, [Math.sin(t * 40) * 8 * sh, 0]);
    room(t);
    plate(760, FY + 20, t < 16.0 ? 2 : 0);
    if (t < 16.4) pip(860, FY, U, { ...faces(t, [[14, 'surprised'], [15.6, 'panic']]), view: 'q', flip: true, aL: t > 15.6 ? 1.2 : -.6, aR: t > 15.6 ? 1.2 : -.6, rot: t > 16.1 ? -.2 : 0, boilKey: 'pip' });
    castShadow(PK, FY, U * 5.5, U);
    junkCat(t, PK, FY - 6 * U, a, { ...faces(t, [[14, 'determined', { eyes: 'squeeze' }], [16.5, 'surprised', { lookY: 1 }], [17.4, 'deadpan', { lookY: 1 }]]), aL: sh ? .8 : -.6, aR: sh ? .8 : -.6 }, 1);
    drawStuckPip(t, PK, FY - 6 * U, a);
    if (sh > .1) for (const s of [-1, 1]) { inkLine(arcPts(PK + s * 330, FY - 260, 60, 140, -1, 1, 6).map(([x, y]) => [s > 0 ? x : 2 * PK - x, y]), 3, '#FFFFFF', 'ink', 0); }
    camEnd();
  }

  // 06 · 19–25 · The junk ball rolls! Right across the rug, BONK into the armchair, rolls back, settles upright.
  // Deadpan: "I am... the junk ball."
  const R = 6.6 * U;
  function ballX(t) {
    if (t < 19.2) return 540;
    if (t < 19.8) return lerp(540, 300, ease(seg(t, 19.2, 19.8)));
    if (t < 20.3) return lerp(300, 760, easeIn(seg(t, 19.8, 20.3)));
    return lerp(760, 540, easeOut(seg(t, 20.3, 21.5)));
  }
  function s06(t) {
    const x = ballX(t), cy = FY - 6 * U;
    cam(clamp(x, 470, 600), 1270, 1.15, shake(t, 20.3, 22, .5));
    room(t);
    // the roll angle must come back to a whole turn when he settles upright: x 540 -> a = (540-480)/R ≈ .23, so ease it to 0
    const aa = (x - 540) / R * 2.6;   // a slipping cartoon roll; back to upright at x 540
    castShadow(x, FY, U * 5.5, U);
    junkCat(t, x, cy, aa, { ...faces(t, [[19, 'panic'], [20.3, 'dazed', { eyes: 'squeeze' }], [21.5, 'deadpan', { lid: .6 }], [23.6, 'deadpan', { lid: .6, lookX: -1 }]]), aL: -.6, aR: -.6, who: 'pumpkin' }, 1);
    drawStuckPip(t, x, cy, aa, faces(t, [[19, 'panic'], [21.5, 'sheepish', { lookY: -1 }]]));
    burst(760 + R * .9, cy, 200, (t - 20.3) / .4, 12, '#FFFFFF', 3);
    if (t < 20.3 && t > 19.2) speedLines(x, cy, t < 19.8 ? -1 : 1, t, 5, 200, 300);
    camEnd();
  }

  // 07 · 25–29 · A balloon drifts past his face. His eyes follow it. Pupils grow. Slowly... the claw comes up. (silence)
  function s07(t) {
    const x = 540, cy = FY - 6 * U;
    cam(560, 1220, 1.55);
    room(t);
    castShadow(x, FY, U * 5.5, U);
    const bx = lerp(-60, 330, ease(seg(t, 25, 27.6))), by = 900 + Math.sin(t * 2) * 14;
    const lx = clamp((bx - x) / 260, -1, 1), claw = ease(seg(t, 27.4, 28.8));
    junkCat(t, x, cy, 0, { ...faces(t, [[25, 'deadpan', { lid: .6, lookX: -1 }], [25.6, 'neutral', { lookX: lx, lookY: -.6 }], [26.8, 'greedy', { lookX: lx, lookY: -.6, mouth: 'smirk' }]]), lookX: lx,
      pupil: lerp(.6, 1.1, seg(t, 26.5, 27.4)), aL: lerp(-.6, 1.0, claw), armL: claw > .5 ? claws : undefined }, 1);
    drawStuckPip(t, x, cy, 0, { ...faces(t, [[25, 'sheepish', { lookY: -1 }], [26.5, 'surprised', { lookX: -1, lookY: -1 }], [27.6, 'panic', { lookX: -1 }]]), aL: .4, aR: .4 });
    balloon(bx, by, .55, { sx: bx + 30, sy: by + 260 });
    camEnd();
  }

  // 08 · 29–32.5 · POKE. BANG! A white flash, the charge blows out: all the junk flies off in a ring, Pip shoots up off
  // screen. The cat's fur drops flat as if soaked. A beat of silence.
  function s08(t) {
    const bang = 29.15, x = 540, cy = FY - 6 * U, blast = seg(t, bang, bang + 1.0);
    cam(540, 1260, 1.2, shake(t, bang, 34, .7));
    room(t);
    castShadow(x, FY, U * 5, U);
    if (t < bang) { junkCat(t, x, cy, 0, { ...face('greedy', { lookX: -.6, lookY: -.6, pupil: 1.1 }), aL: 1.0 + .1 * seg(t, 29, bang), armL: claws }, 1); drawStuckPip(t, x, cy, 0, face('panic', { lookX: -1 })); balloon(330, 900, .55, { sx: 360, sy: 1160 }); }
    else {
      pumpkin(x, FY, U, { ...faces(t, [[bang, 'surprised', { eyes: 'wide', pupil: 0 }], [29.9, 'soggy', { lid: .55 }], [30.85, 'soggy', { lid: .55, eyes: 'closed' }], [31.0, 'soggy', { lid: .55, lookY: -1 }]]), wet: .45 * ease(seg(t, bang, bang + .3)), aL: lerp(1.0, -1.2, ease(seg(t, 29.6, 30.2))), aR: -1.2, boilKey: 'pk' });
      drawJunk(t, x, cy, 0, blast);
      // Pip shoots straight up and away
      if (blast < 1) { const py = lerp(cy + 1.2 * U + 80, cy - 1600, easeOut(blast)); pip(x + 50, py, U * .9, { ...face('panic'), rot: blast * 9, aL: 1.3, aR: 1.3, noShadow: true, boilKey: 'pip' }); }
      // the beat: the sock rains back down, PLOP onto his flat head... and slowly slides off (no static left to hold it)
      if (t > 30.5) { const f = seg(t, 30.5, 30.85), sl = easeIn(seg(t, 31.4, 32.3)); sock(lerp(600, 560, f) + sl * 260, lerp(300, 1040, easeIn(f)) + sl * 380, .25 + sl * 1.6); }
      balloonBits(330, 900, (t - bang) / .8);
      burst(330, 900, 300, (t - bang) / .5, 14, ZAP, 6);
    }
    flash(t > bang && t < bang + .1 ? 1 : 0, 540, 1260);
    camEnd();
  }

  // 09 · 32.5–38 · PUMF: Pip drops back in... as a spiky grey puffball, crackling. "...Oh no." Pumpkin, flat and soggy,
  // slowly turns his head... and smirks.
  function s09(t) {
    const land = 32.95, PX = 300, KX = 620;
    cam(470, 1300, 1.45, shake(t, land, 10));
    room(t);
    pumpkin(KX, FY, U, { ...faces(t, [[32.5, 'soggy', { lid: .55 }], [34.0, 'soggy', { lid: .55, lookX: -1 }], [36.4, 'smug', { lookX: -1 }]]), wet: .45, view: t > 36 ? 'q' : 'front', flip: t > 36, aL: -1.2, aR: -1.2, boilKey: 'pk' });
    const fall = seg(t, 32.5, land), bounce = t > land ? Math.abs(Math.sin((t - land) * 9)) * Math.exp(-(t - land) * 5) * .9 : 0;
    const py = t < land ? lerp(FY - 1100, FY, easeIn(fall)) : FY;
    puffPip(PX, py, U, { ...faces(t, [[32.5, 'panic'], [land, 'surprised', { eyes: 'wide' }], [34.4, 'neutral', { lookY: 1, lookX: -.3 }], [34.9, 'sheepish', { lookY: .2 }]]), view: 'q', dy: -bounce, aL: t > 34.3 && t < 34.9 ? .3 : -.7, aR: -.7, who: 'pip', noShadow: t < land, boilKey: 'pip' }, t < land ? 1.1 : 1.3, t);
    burst(PX, FY - 120, 180, (t - land) / .35, 10, '#FFFFFF', 7);
    camEnd();
  }

  // 10 · 38–42 · Close: one soggy paw reaches out, slowly, to Pip's nose. "Boop." CRACK! Pip doubles in size.
  function s10(t) {
    const PX = 300, KX = 600, zap = 40.6, z = lerp(1.45, 2.0, ease(seg(t, 38, 38.6)));
    cam(lerp(470, 440, ease(seg(t, 38, 38.6))), lerp(1300, 1265, ease(seg(t, 38, 38.6))), z, shake(t, zap, 16, .5));
    room(t);
    const reach = ease(seg(t, 38.6, 40.2));
    const k = t < zap ? 1.3 : lerp(1.3, 2.2, backOut(seg(t, zap, zap + .3)));
    puffPip(PX, FY, U, { ...faces(t, [[38, 'sheepish', { lookX: 1 }], [39.4, 'panic', { lookX: 1, eyes: 'wide' }], [zap, 'surprised', { eyes: 'wide', pupil: 0 }], [41.4, 'deadpan', { lookX: 1 }]]), view: 'q', aL: -.7, aR: -.7, boilKey: 'pip' }, k, t);
    pumpkin(KX, FY, U, { ...faces(t, [[38, 'smug', { lookX: -1 }], [zap, 'happy', { mouth: 'grin' }]]), wet: .45, view: 'q', flip: true, aR: lerp(-1.2, -.6, reach) + (t > zap ? .5 * ease(seg(t, zap, zap + .2)) : 0), aL: -1.2, who: 'pumpkin', boilKey: 'pk' });
    if (t > zap && t < zap + .4) zapBolt(345, 1355, 250, 1250, t, 5, 8);
    flash(t > zap && t < zap + .08 ? .9 : 0, 440, 1300);
    camEnd();
  }

  // 11 · 42–45 · Later. Pumpkin asleep again (fur back to normal). Pip on the chair arm pulls out a NEW balloon and lowers
  // it onto the sleeping head... = frame 1.
  function s11(t) {
    const out = backOut(seg(t, 42.4, 42.8)), lower = ease(seg(t, 43.2, 44.6));
    sleepCU(t, 0, 0, .55 * out, faces(t, [[42, 'teasing', { lookX: 1 }], [42.8, 'happy', { mouth: 'grin' }], [44.0, 'teasing']]));
    if (t < 42.4) { cam(...CU); burst(PERCH[0] - 130, 960, 90, (t - 42.2) / .3, 6, '#FFFFFF', 4); camEnd(); }
    void lower;
  }

  shots([[0, s01], [2.5, s02], [6, s03], [9.5, s04], [14, s05], [19, s06], [25, s07], [29, s08], [32.5, s09], [38, s10], [42, s11]]);
})();
