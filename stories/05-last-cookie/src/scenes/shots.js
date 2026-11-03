// shots.js: the 8 shots of "Pumpkin & Pip: The Last Cookie" (50 s, 1080 x 1920). See STORYBOARD.md.
// One kitchen, face-on: counter LEFT, fridge RIGHT, cookie jar on the fridge. The last frame = the first (loop).
(() => {
  const U = 40, PX = 420, FL = K5.floor, J = K5.jar;
  const say = (who, t) => typeof SPEAK === 'function' ? SPEAK(who, t) : 0;
  const chew = (t, on = true) => on ? .28 * Math.max(0, Math.sin(t * 15)) : 0;
  const cam = (cx, cy, z, sh = [0, 0]) => camBegin(cx + sh[0], cy + sh[1], z);
  const jarTop = J.bottom - J.h;
  const JAR_CAM = [J.x, J.bottom - 130, 2.5];
  // the cookie inside the jar, and its sparkle (period 2.5 s: 50 s holds a whole number of them, so the loop matches)
  const wholeCookie = t => () => { cookie(J.x, J.bottom - 46, 62); };
  function sparkleAt(t) { const k = Math.max(0, Math.sin(t * TAU / 2.5)); if (k > .25) paint(starPts(J.x + 42, J.bottom - 92, 40 * k, .2, 4), { wash: '#FFFFFF', ink: null }); }
  // tower sway: an angle about the base; amplitude grows as it gets taller and as he climbs
  const swayAmp = t => t < 24 ? .006 * seg(t, 15, 24) : t < 37 ? lerp(.008, .05, seg(t, 24, 36.5)) : .06;
  const sway = t => Math.sin(t * 2.7) * swayAmp(t) + Math.sin(t * 6.3) * swayAmp(t) * .25;
  const rotAbout = ([x, y], a, [cx, cy] = [505, FL]) => [cx + (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a), cy + (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a)];
  function tower(t, upTo = 4) {
    const a = sway(t);
    PIECES.slice(0, upTo).forEach((p, i) => { const [x, y] = rotAbout(p.tower, a); piece(p, x, y, a * (1 + i * .2)); });
  }
  function pipOnCounter(t, o = {}) { pip(300, K5.counter.y - 24, U, { view: 'q', cracker: true, aR: .25, ...o.face, talk: Math.max(say('pip', t), chew(t, o.chew)), boilKey: 'pip', noShadow: true, ...o.extra }); }

  // 01 · 0–4 · The hook: the last cookie glints. Then his face: "One... last... cookie." (drool)
  function s01(t, lt) {
    if (lt < 1.7) {
      cam(...JAR_CAM);
      kitchen5(t); cookieJar(t, wholeCookie(t)); sparkleAt(t);
      camEnd();
      return;
    }
    cam(PX, 1190, 2.0);
    kitchen5(t); cookieJar(t, wholeCookie(t));
    pumpkin(PX, FL, U, { ...face('greedy', { lookY: -.9, lookX: .5 }), aL: -1.3, aR: -1.3, who: 'pumpkin', boilKey: 'pk' });
    const d = frac((t - 1.7) / 1.4); paint(ellPts(PX + 38, 1265 + d * 90, 8, 11 + d * 6, 10), { wash: '#BFE6F5', washOp: 255 * (1 - d * .6), sw: .6 });   // drool
    camEnd();
  }

  // 02 · 4–8 · "Mine." He crouches and wiggles his bottom (cat pre-pounce).
  function s02(t, lt) {
    cam(520, 1260, 1.25);
    kitchen5(t); cookieJar(t, wholeCookie(t));
    PIECES.forEach(p => piece(p, ...p.counter));
    const wig = seg(t, 5.9, 7.9) > 0 && t < 7.9 ? Math.sin(t * 26) : 0;
    pumpkin(PX, FL, U, { ...faces(t, [[4, 'greedy', { lookY: -.9 }], [5.2, 'determined', { lookY: -.8, lookX: .6 }]]), sq: .22 * ease(seg(t, 5.6, 6.0)), rot: wig * .06, dx: wig * .08,
      aL: -1.3, aR: -1.3, tailWag: 1, who: 'pumpkin', boilKey: 'pk' });
    pipOnCounter(t, { face: face('munching'), chew: true });
    camEnd();
  }

  // 03 · 8–14 · Plan A: the leap. SPLAT on the fridge door, hold, slide down. "...Plan B." (face still on the door)
  function s03(t, lt) {
    const hit = 8.75, sh = t > hit && t < hit + .2 ? shakeXY(t, 10) : [0, 0];
    cam(620, 1120, .95, sh);
    kitchen5(t); cookieJar(t, wholeCookie(t));
    PIECES.forEach(p => piece(p, ...p.counter));
    const SPL = [780, 1250];
    let x, y, sq, rot = 0, pf, aL = -1.3, aR = -1.3;
    if (t < 8.2) { x = PX; y = FL; sq = .22; pf = face('determined'); }
    else if (t < hit) { const k = seg(t, 8.2, hit), p = arcPt([PX, FL], SPL, 120, easeOut(k)); x = p[0]; y = p[1]; sq = -.25 * Math.sin(k * Math.PI); pf = face('determined'); aL = aR = 1.2; }
    else if (t < 9.6) { x = SPL[0]; y = SPL[1]; sq = .38; pf = face('strain'); aL = aR = .35; }                       // flattened on the door
    else { const k = easeIn(seg(t, 9.6, 11.0)); x = SPL[0]; y = lerp(SPL[1], FL, k); sq = lerp(.38, .3, k); pf = face('strain', { mouth: 'gritted' }); aL = aR = lerp(.35, .1, k); rot = Math.sin(t * 20) * .02 * (k < 1 ? 1 : 0); }
    if (t > 9.6) paint(rectPts(SPL[0] - 80, SPL[1] - 260, 160, Math.max(0, (y - SPL[1])) + 10), { wash: '#F0973A', washOp: 40, ink: null });   // a faint orange fur smear down the door
    pumpkin(x, y, U, { ...pf, sq, rot, aL, aR, noShadow: t > 8.3 && t < 11, who: 'pumpkin', boilKey: 'pk' });
    if (t > hit) burst(SPL[0], SPL[1] - 220, 190, (t - hit) / .4, 12, '#FFFFFF');
    pipOnCounter(t, { face: faces(t, [[8, 'munching'], [hit, 'surprised'], [9.5, 'teasing']]), chew: t < hit || t > 10.5 });
    camEnd();
  }

  // 04 · 14–24 · Plan B, time-lapse: he hauls each piece over and stacks the tower. Pip slips away (tail behind the fridge).
  const PICK = [14.4, 16.6, 18.8, 21.0];   // each piece flies from its counter spot to the tower over 0.9 s
  function s04(t, lt) {
    cam(560, 1130, .95);
    kitchen5(t); cookieJar(t, wholeCookie(t));
    let placed = 0;
    PIECES.forEach((p, i) => {
      const k = seg(t, PICK[i] + .5, PICK[i] + 1.4);
      if (k >= 1) { placed = i + 1; return; }
      if (k <= 0) { piece(p, ...p.counter); return; }
      const q = arcPt(p.counter, p.tower, 260, ease(k)); piece(p, q[0], q[1], Math.sin(k * Math.PI) * .6);
    });
    tower(t, placed);
    // Pumpkin dashes between the counter and the tower (side view), arms up when he throws
    const i = Math.max(0, PICK.findIndex(a => t < a + 2.2)), a0 = PICK[Math.min(i, 3)];
    const back = seg(t, a0, a0 + .45), there = seg(t, a0 + .5, a0 + 1.1);
    const x = t > 22.4 ? lerp(330, PX, ease(seg(t, 22.4, 23.2))) : lerp(330, 160 + i * 40, ease(back) * (1 - ease(there)));
    const moving = (back > 0 && back < 1) || (there > 0 && there < 1);
    pumpkin(x, FL, U, { ...face(t > 22.4 ? 'smug' : 'determined'), view: moving ? 'side' : 'q', flip: back > 0 && back < 1 && there <= 0, walk: moving ? t * 3 : null,
      aR: there > 0 && there < .5 ? 1.3 : -1.2, aL: there > 0 && there < .5 ? 1.2 : -1.2, tailWag: 1, who: 'pumpkin', boilKey: 'pk' });
    // Pip: munching on the counter, then sinks out of sight behind it (18.0) ... and his tail flicks up behind the fridge (19.3)
    if (t < 18.6) clipRects([[-600, -600, 1800, K5.counter.y - 24 + 600]], () => pipOnCounter(t, { face: face(t > 16.5 ? 'smug' : 'munching'), chew: t < 16.5, extra: { dy: 6 * ease(seg(t, 18.0, 18.6)) } }));
    const tail = seg(t, 19.3, 20.4);
    if (tail > 0 && tail < 1) { const yy = lerp(1150, 900, tail), wig = Math.sin(t * 9) * 18; paint(ribbon([[K5.fridge.x + K5.fridge.w - 4, yy], [K5.fridge.x + K5.fridge.w + 30 + wig, yy - 40], [K5.fridge.x + K5.fridge.w + 18 - wig, yy - 90]], 12, 5), { wash: PIP_COL.tail, sw: .9 }); }
    camEnd();
  }

  // 05 · 24–31 · The climb, one level per hop; the tower sways more and more. On top: "Victory is MINE!"
  const LEVELS = [[24.4, 25.3, 1340], [25.9, 26.7, 1190], [27.3, 28.0, 1110], [28.6, 29.3, TOWER_TOP]];
  function climbPos(t) {
    let y = FL, x = PX, sq = 0, k0 = 1;
    for (const [a, b, top] of LEVELS) { const k = seg(t, a, b); if (k > 0) { const p = arcPt([x, y], [505, top], 90, easeOut(k)); x = p[0]; y = p[1]; sq = k < 1 ? -.15 * Math.sin(k * Math.PI) : .12 * Math.exp(-(t - b) * 8); k0 = k; } }
    return { x, y, sq };
  }
  function s05(t, lt) {
    const c = climbPos(t), a = sway(t);
    cam(560, lerp(1200, 820, ease(seg(t, 24, 30))), lerp(.95, 1.25, ease(seg(t, 24, 30))));
    kitchen5(t); cookieJar(t, wholeCookie(t));
    tower(t);
    const [x, y] = c.y < FL - 5 ? rotAbout([c.x, c.y], a) : [c.x, c.y];
    const balance = t > 29.3 && t < 29.5, win = t >= 29.5;
    pumpkin(x, y, U, { ...faces(t, [[24, 'determined'], [27.0, 'panic', { lookY: .9 }], [28.0, 'determined'], [29.5, 'proud']]),
      rot: a * 1.4 + (balance ? Math.sin(t * 9) * .08 : 0), sq: c.sq + (win ? -.08 : 0), aL: win ? 1.5 : balance ? .05 + Math.sin(t * 9) * .3 : -1.1, aR: win ? 1.45 : balance ? .05 - Math.sin(t * 9) * .3 : -1.1,
      noShadow: c.y < FL - 5, tailWag: 1, who: 'pumpkin', boilKey: 'pk' });
    camEnd();
  }

  // 06 · 31–37 · He lifts the lid... Pip is inside, eating the cookie. "Took you long enough."
  function s06(t, lt) {
    cam(705, 690, 1.85);
    kitchen5(t);
    tower(t);
    const lift = ease(seg(t, 31.9, 32.4)), L = [lerp(J.x, J.x - 60, lift), lerp(jarTop - 8, jarTop - 150, lift)];
    cookieJar(t, () => {
      pip(J.x + 10, J.bottom - 12, 30, { ...faces(t, [[31, 'munching'], [33.0, 'deadpan', { lookX: -.8, lookY: -.4 }]]), sq: .12, aR: .7, aL: .6, noShadow: true,
        armR: (u, sw) => { cookie(u * .9, 0, u * 1.1, 1); }, talk: Math.max(say('pip', t), chew(t, t < 32.9 || t > 36.2)), boilKey: 'pipj' });
      for (let i = 0; i < 6; i++) paint(ellPts(J.x - 60 + hash(i) * 120, J.bottom - 14 - hash(i + 3) * 10, 5, 4, 8), { wash: KC5.cookie, ink: null });   // crumbs
    }, 0, L);
    const [x, y] = rotAbout([505, TOWER_TOP], sway(t));
    pumpkin(x, y, U, { ...faces(t, [[31, 'greedy', { lookX: 1, lookY: -.3 }], [32.5, 'surprised', { lookX: 1 }], [33.4, 'surprised', { lookX: 1, pupil: .05 }]]),
      rot: sway(t) * 1.4, aR: lerp(1.1, 1.35, lift), aL: -.4, noShadow: true, tailWag: 1, who: 'pumpkin', boilKey: 'pk' });
    camEnd();
  }

  // 07 · 37–44 · A beat of silence. One last sway... CRASH. He lands, pieces rain on him, the pie tin lands on his head.
  const FALLS = [   // piece: start, end, landing spot, spin
    { p: 0, a: 38.0, b: 38.6, to: [600, FL], rot: .35 },
    { p: 1, a: 38.75, b: 39.15, to: [PX + 10, FL - 300], rot: -.4, roll: [39.15, 39.8, [260, FL]] },
    { p: 2, a: 39.0, b: 39.4, to: [PX - 10, FL - 330], rot: .3, roll: [39.4, 39.9, [560, FL - 4]] },
  ];
  function s07(t, lt) {
    const sh = [38.6, 39.15, 39.4, 39.85].some(h => t > h && t < h + .18) ? shakeXY(t, 12) : [0, 0];
    cam(560, 1150, .95, sh);
    kitchen5(t); cookieJar(t, wholeCookie(t));
    // the falling pieces
    FALLS.forEach(f => {
      const P = PIECES[f.p], from = rotAbout(P.tower, sway(t));
      if (t < f.a) return piece(P, ...from, sway(t));
      const k = seg(t, f.a, f.b);
      if (!f.roll || t < f.roll[0]) { const q = arcPt(from, f.to, 60, easeIn(k)); return piece(P, q[0], q[1], f.rot * k); }
      const r = ease(seg(t, f.roll[0], f.roll[1])), q = [lerp(f.to[0], f.roll[2][0], r), lerp(f.to[1], f.roll[2][1], r)];
      piece(P, q[0], q[1], f.rot + r * (f.p === 1 ? -1.6 : .4));
    });
    if (t < 37.9) piece(PIECES[3], ...rotAbout(PIECES[3].tower, sway(t)), sway(t) * 1.6);
    // Pumpkin: the hang (a beat), the drop, the landing
    let x, y, sq = 0, pf, rot = 0, emote = null;
    const drop = 38.1, land = 38.6;
    if (t < drop) { [x, y] = rotAbout([505, TOWER_TOP], sway(t) * (1 + seg(t, 37, 38) * 2)); pf = face('surprised', { pupil: .05 }); rot = sway(t) * 2; }
    else if (t < land) { const k = seg(t, drop, land), p = arcPt([505, TOWER_TOP], [PX, FL], 40, easeIn(k)); x = p[0]; y = p[1]; pf = face('panic'); rot = -.4 * k; }
    else { x = PX; y = FL; sq = .3 * Math.exp(-(t - land) * 5) * Math.cos((t - land) * 20) + .1 * (t > 39.15 ? Math.exp(-(t - 39.15) * 6) : 0); pf = face('dazed'); emote = t > 39.0 ? 'stars' : null; }
    pumpkin(x, y, U, { ...pf, sq, rot, aL: t > land ? -1.3 : 1.2, aR: t > land ? -1.3 : 1.2, emote, emoteK: seg(t, 39.0, 39.3), noShadow: t < land, who: 'pumpkin', boilKey: 'pk' });
    // the pie tin flies up, spins, and lands on his head as a hat
    if (t >= 37.9) {
      const k = seg(t, 38.0, 39.85), start = rotAbout(PIECES[3].tower, sway(37.9)), headTop = [PX, FL - 12.2 * U];
      const q = arcPt(start, headTop, 420, easeIn(k) * .3 + k * .7);
      push(); translate(q[0], q[1]); rotate(k < 1 ? k * 5 * Math.PI : .18); translate(-q[0], -q[1]);
      piece(PIECES[3], q[0], q[1] + (k >= 1 ? 6 : 0)); pop();
    }
    [38.6, 39.15, 39.4].forEach((h, i) => puffCloud(PX + (i - 1) * 140, FL - 40, 110, t - h));
    camEnd();
  }

  // 08 · 44–50 · From the rubble, tin hat on: "...Plan C." Cut to the jar: Pip leaves a NEW cookie as bait, climbs out, the lid drops shut. = frame 1.
  function s08(t, lt) {
    if (t < 46.4) {
      cam(PX + 40, 1280, 1.4);
      kitchen5(t); cookieJar(t, wholeCookie(t));
      piece(PIECES[0], 600, FL, .35); piece(PIECES[1], 260, FL, -2.0); piece(PIECES[2], 560, FL - 4, .7);
      pumpkin(PX, FL, U, { ...faces(t, [[44, 'dazed'], [44.7, 'deadpan', { lid: .5 }], [45.9, 'deadpan', { lid: .4, lookY: -1, lookX: .6 }]]), aL: -1.3, aR: -1.3,
        who: 'pumpkin', boilKey: 'pk' });
      push(); translate(PX + 6, FL - 12.2 * U + 6); rotate(.18); piece(PIECES[3], 0, 0); pop();   // the tin hat
      camEnd();
      return;
    }
    cam(...JAR_CAM);
    kitchen5(t);
    const open = t > 46.5 && t < 48.25, liftK = ease(seg(t, 46.5, 46.8)) * (1 - ease(seg(t, 48.0, 48.25)));
    const out = seg(t, 47.5, 48.1);
    const L = [J.x + 20 * liftK, jarTop - 8 - 120 * liftK + (t > 48.25 ? -14 * Math.exp(-(t - 48.25) * 8) * Math.abs(Math.cos((t - 48.25) * 22)) : 0)];
    cookieJar(t, () => {
      const placed = seg(t, 46.9, 47.4);
      if (placed > 0) cookie(J.x, lerp(J.bottom - 160, J.bottom - 46, easeOut(placed)), 62);
      if (out < 1) { const q = arcPt([J.x - 50, J.bottom - 12], [J.x + 260, jarTop - 260], 120, easeIn(out));
        pip(q[0], q[1], 30, { ...face('smug'), sq: out > 0 ? -.1 : .12, aR: placed < 1 ? .1 : 1.3, aL: 1.3, noShadow: true, boilKey: 'pipj' }); }
    }, 0, open ? L : (t > 48.25 ? L : null));
    if (t > 48.4) sparkleAt(t);
    camEnd();
  }

  shots([[0, s01], [4, s02], [8, s03], [14, s04], [24, s05], [31.5, s06], [37, s07], [44, s08]]);
})();
