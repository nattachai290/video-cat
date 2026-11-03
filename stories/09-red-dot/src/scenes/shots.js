// shots.js: the 10 shots of "Pumpkin & Pip: The Red Dot" (45 s, 1080 x 1920). See STORYBOARD.md.
// The series' living room, face-on. Every chase runs LEFT <-> RIGHT along the floor. A gag every 3-4 s.
// Frame 1 = last frame: close on Pip, laser pointer raised, just before the click (the film loops).
(() => {
  const U = 40, FY = FY9, PH = 260, PK0 = 760;
  const cam = (cx, cy, z, sh = [0, 0]) => camBegin(cx + sh[0], cy + sh[1], z);
  const shake = (t, t0, amp = 10, dur = .35) => t > t0 && t < t0 + dur ? [Math.sin(t * 90) * amp * (1 - (t - t0) / dur), Math.cos(t * 77) * amp * .6 * (1 - (t - t0) / dur)] : [0, 0];
  const CU = [400, 1460, 2.6];
  const POSE0 = { ...face('teasing'), view: 'q', aR: .25, aL: -.6 };
  const room = t => { livingRoom6(t); curtain(t); };
  const laser = (lit = 1) => ({ armR: laserHook(lit) });
  // the cushion: on the seat, knocked off at 9.2 (lands 10.0 at x 300), sucked into the tornado 34.6, lands on his head 37.4
  function cushionAt(t) {
    if (t < 9.2) return [850, 1112, 0];
    if (t < 10.0) { const p = arcPt([850, 1112], [60, FY + 20], 380, seg(t, 9.2, 10.0)); return [p[0], p[1], seg(t, 9.2, 10.0) * TAU * 1.2]; }
    if (t < 34.6) return [60, FY + 20, 0];
    return null;   // the tornado shot draws it
  }
  const drawCushion = t => { const c = cushionAt(t); if (c) cushion(...c); };
  // the robot vacuum: parked by the dock until 14.9, then a wild ride round the room until it hits the chair at 18.4
  function VAC(t) {
    if (t < 14.9) return { x: 900, led: 'blue', rot: 0 };
    if (t < 18.4) { const a = (t - 14.9) * 3.59; return { x: 540 + 360 * Math.cos(a), led: 'red', rot: .12 * Math.sin(a * 2), dir: -Math.sin(a) }; }
    return { x: 900, led: 'red', rot: 0, shake: t < 18.8 ? 3 : 0 };
  }
  const vac = t => { const V = VAC(t); return robotVac(V.x, FY + 10, 1.3, t, V); };

  // 01 · 0–2.5 · CU: Pip's paw, the laser... CLICK. A red dot on the floor. Cut: Pumpkin's pupils BOOM wide open.
  function s01(t) {
    if (t < 1.4) {
      cam(...CU); room(t);
      redDot(560 + Math.sin(t * 7) * 6, 1588, 1.2, seg(t, .5, .58));
      pip(PH, FY, U, { ...POSE0, ...faces(t, [[0, 'teasing'], [.55, 'smug']]), aR: .25 - .05 * Math.exp(-(t - .5) * 12) * (t > .5), ...laser(t > .5 ? 1 : 0), boilKey: 'pip' });
      camEnd(); return;
    }
    const boom = backOut(seg(t, 1.55, 1.75));
    cam(PK0 - 16, 1195, 4.5, shake(t, 1.55, 8));
    room(t); drawCushion(t);
    pumpkin(PK0, FY, U, { ...face('neutral'), eyes: 'wide', lid: 0, pupil: lerp(.15, 1.1, boom), lookX: -.5, lookY: .6, brow: -.2, browUp: .4 * boom, boilKey: 'pk' });
    camEnd();
  }

  // 02 · 2.5–6 · Butt wiggle... POUNCE. The dot zips away. Face-plant. Pip: "Too slow!"
  function s02(t) {
    const land = 4.1;
    cam(560, 1330, 1.5, shake(t, land, 14));
    room(t); drawCushion(t);
    const dx = t < 3.9 ? 560 + Math.sin(t * 7) * 6 : lerp(560, 400, easeOut(seg(t, 3.9, 4.0))) + Math.sin(t * 9) * 4;
    redDot(dx, 1588, 1.2);
    const jump = seg(t, 3.6, land);
    if (jump <= 0) {   // the wiggle
      const w = seg(t, 2.6, 3.6);
      pumpkin(PK0, FY, U, { ...face('determined', { pupil: 1.1, lookX: -1, lookY: .7, brow: .6 }), sq: .22 * ease(seg(t, 2.5, 2.8)), rot: Math.sin(t * 26) * .05 * w, tailWag: 1, aL: -1.4, aR: -1.4, boilKey: 'pk' });
    } else if (jump < 1) {
      const p = arcPt([PK0, FY], [560, FY], 230, ease(jump));
      pumpkin(p[0], p[1], U, { ...face('greedy', { pupil: 1.1 }), sq: -.2, rot: -.25 * Math.sin(jump * Math.PI), aL: .4, aR: .4, noShadow: true, boilKey: 'pk' });
    } else {   // splat, flat on his face
      const k = Math.exp(-(t - land) * 5);
      pumpkin(560, FY, U, { ...faces(t, [[land, 'dazed', { eyes: 'squeeze' }], [4.9, 'dazed']]), sq: .28 + .08 * k * Math.cos((t - land) * 25), aL: .1, aR: .1, boilKey: 'pk' });
      if (t > land + .1) dizzy(560, FY - 330, 110, t);
    }
    burst(560, FY - 40, 160, (t - land) / .35, 10, '#FFFFFF', 2);
    const laugh = t > 4.5;
    pip(PH, FY, U, { ...faces(t, [[2.5, 'teasing'], [4.1, 'happy', { mouth: 'grin' }]]), view: 'q', aR: lerp(.25, .05, seg(t, 3.9, 4.0)), aL: laugh ? .6 + Math.sin(t * 16) * .2 : -.6,
      dy: laugh ? -Math.abs(Math.sin(t * 14)) * .1 : 0, ...laser(), who: 'pip', boilKey: 'pip' });
    camEnd();
  }

  // 03 · 6–10.5 · Zig-zag! The dot whips left and right, he skids and scrambles (legs a wheel), then CRASH into the
  // armchair. The cushion flies off.
  const ZIG = [[6.0, 400], [6.7, 920], [7.4, 170], [8.1, 900], [8.5, 600]];
  const zigDot = t => { for (let i = 0; i < ZIG.length - 1; i++) { const [a, x0] = ZIG[i], [b, x1] = ZIG[i + 1]; if (t < b) return lerp(x0, x1, ease(seg(t, a, a + (b - a) * .55))); } return 600; };
  function s03(t) {
    const crash = 9.2;
    // Pumpkin follows the dot 0.35 s late (with a skid past it); from 8.5 he charges right into the chair
    let px, dir;
    if (t < 8.5) { px = zigDot(t - .35); dir = Math.sign(zigDot(t - .3) - zigDot(t - .4)) || 1; }
    else { px = lerp(zigDot(8.15), 790, easeIn(seg(t, 8.5, crash))); dir = 1; }
    if (t > crash) { px = 790 - 60 * easeOut(seg(t, crash, crash + .3)); }
    const cx = clamp(px, 430, 650);
    cam(cx, 1330, 1.15, shake(t, crash, 22, .5));
    room(t); drawCushion(t);
    // the dot: zig-zag on the floor, then up onto the chair
    if (t < 8.5) redDot(zigDot(t), 1590, 1.1); else redDot(lerp(600, 830, ease(seg(t, 8.5, 8.9))), lerp(1590, 1180, ease(seg(t, 8.5, 8.9))), 1.1);
    pip(150, FY, U, { ...face('teasing'), view: 'q', aR: .1, ...laser(), boilKey: 'pip' });
    const v = Math.abs(zigDot(t - .33) - zigDot(t - .37)) / .04, fast = t < crash && v > 300;
    const skid = ZIG.some(([a]) => t > a + .3 && t < a + .55);
    if (t < crash) {
      if (fast) speedLines(px, FY - 230, dir, t, 5, 200, 260);
      if (skid) { dust(px - dir * 120, FY, (t % .25) / .25, Math.round(t * 4)); legWheel(px, FY + 4, 90, t); }
      pumpkin(px, FY, U, { ...face(skid ? 'panic' : 'determined', { pupil: 1.1 }), view: 'q', flip: dir < 0, rot: skid ? -dir * .18 : dir * .12, dy: skid ? -.4 : -Math.abs(Math.sin(t * 12)) * .4, aL: skid ? 1.2 : -1.3 + Math.sin(t * 12) * .5, aR: skid ? 1.2 : -1.3 - Math.sin(t * 12) * .5, noShadow: skid, boilKey: 'pk' });
    } else {
      const k = Math.exp(-(t - crash) * 5);
      pumpkin(px, FY, U, { ...faces(t, [[crash, 'dazed', { eyes: 'squeeze' }], [9.7, 'dazed', { eyes: 'spiral' }]]), sq: -.2 * k * Math.cos((t - crash) * 20) + .1, aL: -.6, aR: -.6, boilKey: 'pk' });
      dizzy(px, FY - 520, 120, t);
    }
    burst(760, 1250, 220, (t - crash) / .4, 12, '#FFFFFF', 3);
    camEnd();
  }

  // 04 · 10.5–14 · The dot climbs the wall. He runs straight up after it... stops halfway, looks at us. Then falls.
  function s04(t) {
    const stop = 12.0, fall = seg(t, 12.9, 13.3), WX = 520;
    cam(500, 1050, 1.3, shake(t, 13.3, 16));
    room(t); drawCushion(t);
    pip(150, FY, U, { ...faces(t, [[10.5, 'teasing'], [12.0, 'surprised', { lookY: -1 }], [13.3, 'happy', { mouth: 'grin' }]]), view: 'q', aR: .1 + .9 * seg(t, 10.9, 11.9), ...laser(), boilKey: 'pip' });
    // the dot
    let d; if (t < 10.9) d = [lerp(380, WX, seg(t, 10.5, 10.9)), lerp(1590, 1310, seg(t, 10.5, 10.9))]; else d = [WX, lerp(1310, 640, ease(seg(t, 10.9, 11.9)))];
    redDot(d[0], d[1], 1.2);
    if (t < 11.0) { const k = seg(t, 10.5, 11.0); pumpkin(lerp(250, WX, k), FY - (FY - 1310) * ease(seg(t, 10.8, 11.0)), U, { ...face('determined', { pupil: 1.1 }), view: 'q', rot: .12, dy: -Math.abs(Math.sin(t * 12)) * .4, boilKey: 'pk' }); speedLines(lerp(250, WX, k), FY - 230, 1, t); }
    else if (t < stop) { const y = lerp(1310, 1200, ease(seg(t, 11.0, stop))), cl = Math.sin(t * 22); pumpkin(WX, y, U, { ...face('determined', { pupil: 1.1, lookY: -1 }), aL: 1.0 + .5 * cl, aR: 1.0 - .5 * cl, dy: -Math.abs(cl) * .2, noShadow: true, boilKey: 'pk' }); for (let i = 0; i < 3; i++) inkLine([[WX - 120 + i * 120, y + 30], [WX - 120 + i * 120, y + 140]], 3, '#FFFFFF', 'ink', 0); }
    else if (fall <= 0) {   // stuck flat on the wall, looking at camera
      pumpkin(WX, 1200, U, { ...faces(t, [[stop, 'surprised', { eyes: 'wide', pupil: .5 }], [12.5, 'sheepish', { lookX: 0, lookY: 0 }]]), aL: 1.3, aR: 1.3, noShadow: true, boilKey: 'pk' });
    } else {
      const y = lerp(1200, FY, easeIn(fall)), k = t > 13.3 ? Math.exp(-(t - 13.3) * 5) : 0;
      pumpkin(WX, y, U, { ...face(t > 13.3 ? 'dazed' : 'panic', t > 13.3 ? { eyes: 'squeeze' } : {}), sq: t > 13.3 ? .3 + .15 * k * Math.cos((t - 13.3) * 22) : -.15, aL: 1.3, aR: 1.3, noShadow: fall < 1, boilKey: 'pk' });
      if (t > 13.3) dizzy(WX, FY - 400, 110, t);
    }
    camEnd();
  }

  // 05 · 14–19 · The dot hops onto the robot vacuum. He pounces on it... and it TAKES OFF. A rodeo round the room. "WHOAAA!"
  function s05(t) {
    const V = VAC(t), ride = t >= 14.9 && t < 18.4, cx = t < 14.9 ? 680 : clamp(V.x, 420, 660);
    cam(cx, 1330, 1.15, shake(t, 18.4, 20, .5));
    room(t); drawCushion(t);
    pip(150, FY, U, { ...faces(t, [[14, 'teasing'], [14.9, 'surprised'], [16.0, 'happy', { mouth: 'grin' }]]), view: 'q', aR: .1, ...laser(), boilKey: 'pip' });
    if (ride) speedLines(V.x, FY - 120, Math.sign(V.dir) || 1, t, 4, 260, 160);
    const top = vac(t);
    if (t < 14.25) redDot(lerp(520, top[0], seg(t, 14.0, 14.25)), lerp(640, top[1] + 10, seg(t, 14.0, 14.25)), 1.2);
    else if (t < 18.4) redDot(top[0] + 30, top[1] + 12, 1.2);
    const pounce = seg(t, 14.4, 14.9), fling = seg(t, 18.4, 19.0);
    if (pounce <= 0) pumpkin(520, FY, U, { ...face('determined', { pupil: 1.1, lookX: 1 }), sq: .2, rot: Math.sin(t * 26) * .04, tailWag: 1, aL: -1.4, aR: -1.4, boilKey: 'pk' });
    else if (pounce < 1) { const p = arcPt([520, FY], top, 240, ease(pounce)); pumpkin(p[0], p[1], U, { ...face('greedy', { pupil: 1.1 }), sq: -.2, aL: .5, aR: .5, noShadow: true, boilKey: 'pk' }); }
    else if (ride) pumpkin(top[0], top[1] + 6, U, { ...faces(t, [[14.9, 'surprised', { eyes: 'wide' }], [15.3, 'panic', { mouth: 'O' }], [16.8, 'happy', { mouth: 'grin', blush: .4 }]]), puff: .5, rot: V.rot * 2 + Math.sin(t * 20) * .06,
      dy: -Math.abs(Math.sin(t * 16)) * .25, aL: 1.0 + Math.sin(t * 12) * .3, aR: -.4, noShadow: true, who: 'pumpkin', boilKey: 'pk' });
    else if (fling < 1) { const p = arcPt([900, top[1]], [380, 300], 300, fling); pumpkin(p[0], p[1], U, { ...face('panic'), rot: -fling * TAU, aL: 1.3, aR: 1.3, noShadow: true, boilKey: 'pk' }); }
    burst(980, FY - 60, 180, (t - 18.4) / .4, 12, '#FFFFFF', 5);
    camEnd();
  }

  // 06 · 19–22.5 · He drops in right in front of Pip. Pip is holding the laser backwards: the dot is on his OWN belly.
  // Silence. Pupils grow. "...Uh oh." The butt wiggle.
  function s06(t) {
    const land = 19.3;
    cam(430, 1330, 1.6, shake(t, land, 12));
    room(t); drawCushion(t);
    const PX = 640;
    if (t < land) pumpkin(PX, lerp(FY - 900, FY, easeIn(seg(t, 19.0, land))), U, { ...face('panic'), aL: 1.3, aR: 1.3, noShadow: true, boilKey: 'pk' });
    else {
      const k = Math.exp(-(t - land) * 6), boom = backOut(seg(t, 20.4, 20.6));
      pumpkin(PX, FY, U, { ...faces(t, [[land, 'dazed', { eyes: 'squeeze' }], [19.9, 'neutral', { lookX: -1, lookY: .4 }], [20.4, 'greedy', { lookX: -1, lookY: .4 }]]), pupil: t > 20.4 ? lerp(.3, 1.15, boom) : undefined,
        sq: .25 * k * Math.cos((t - land) * 22) + .2 * ease(seg(t, 21.7, 22.0)), rot: t > 21.8 ? Math.sin(t * 26) * .05 : 0, tailWag: t > 21.8 ? 1 : .3, aL: -1.3, aR: -1.3, boilKey: 'pk' });
    }
    // Pip: laser pointing back at himself
    pip(PH, FY, U, { ...faces(t, [[19, 'happy'], [20.5, 'neutral', { lookX: 1 }], [20.9, 'surprised', { lookY: 1, eyes: 'wide' }], [21.9, 'sheepish', { lookX: 1 }]]), view: 'q', aR: -.5, aL: -.9,
      sq: t > 20.9 ? -.06 : 0, who: 'pip', ...laser(), boilKey: 'pip' });
    redDot(PH + 24, FY - 66, 1.1, seg(t, 19.6, 19.7));
    camEnd();
  }

  // 07 · 22.5–30 · CHASE! Right across the room, whip pan, back left; Pip throws a cracker, Pumpkin snaps it up mid-run
  // without slowing. Pip ends up cornered by the curtain; Pumpkin closes in, wiggling.
  function s07(t) {
    let px, kx, dirP, kRun = true, pRun = true;
    if (t < 25.0) { const k = seg(t, 22.5, 25.0); px = lerp(PH, 1150, k); kx = px - 430; dirP = 1; }
    else if (t < 27.6) { const k = seg(t, 25.0, 27.6); px = lerp(1150, 140, ease(k)); kx = Math.min(px + 430, 1500); dirP = -1; }
    else { px = 140; pRun = false; kx = lerp(570, 520, ease(seg(t, 27.6, 28.6))); dirP = -1; kRun = t < 28.6; }
    const whip = seg(t, 24.85, 25.15), cx = t < 25 ? clamp(px - 120, 360, 760) : clamp(px + 120, 330, 760);
    cam(cx, 1330, t < 27.6 ? 1.2 : lerp(1.2, 1.45, ease(seg(t, 27.6, 28.6))), [Math.sin(whip * Math.PI) * 260 * (t < 25 ? 1 : -1), 0]);
    room(t); drawCushion(t);
    // Pip
    const bob = pRun ? -Math.abs(Math.sin(t * 14)) * .25 : 0, trem = pRun ? 0 : Math.sin(t * 50) * .03;
    if (pRun) speedLines(px, FY - 140, dirP, t, 4, 140, 160);
    pip(px, FY, U, { ...faces(t, [[22.5, 'panic'], [27.6, 'sheepish', { lookX: 1, eyes: 'wide' }]]), view: 'q', flip: dirP < 0 && pRun, walk: pRun ? t * 4 : null, dy: bob, rot: trem,
      aR: t > 25.7 && t < 26.0 ? 1.2 : pRun ? .2 : -.5, aL: pRun ? .4 : -.9, scarfWind: pRun ? -dirP : 0, ...laser(), boilKey: 'pip' });
    redDot(px + (pRun ? -dirP * 10 : 24), FY - 66 + bob * U, 1.1);
    // the cracker: thrown back over his shoulder at 25.8, snapped up at 26.3
    const throwK = seg(t, 25.8, 26.3);
    if (throwK > 0 && throwK < 1) crackerProp(lerp(px, kx + 40, throwK), FY - 200 - 180 * Math.sin(throwK * Math.PI), throwK * 9);
    // Pumpkin
    const chomp = t > 26.3 && t < 26.9;
    if (kRun) speedLines(kx, FY - 230, dirP, t, 5, 220, 260);
    pumpkin(kx, FY, U, { ...faces(t, [[22.5, 'determined', { pupil: 1.1 }], [26.3, 'munching'], [26.9, 'greedy', { pupil: 1.1 }]]), view: kRun ? 'q' : 'front', flip: dirP < 0 && kRun,
      dy: kRun ? -Math.abs(Math.sin(t * 10)) * .3 : 0, sq: !kRun ? .2 * ease(seg(t, 28.6, 29.0)) : 0, rot: kRun ? dirP * .1 : t > 29 ? Math.sin(t * 26) * .05 : 0, tailWag: !kRun ? 1 : .4,
      ...(chomp ? { talk: .3 * Math.max(0, Math.sin(t * 25)) } : {}), aL: kRun ? -1.3 + Math.sin(t * 12) * .5 : -1.4, aR: kRun ? -1.3 - Math.sin(t * 12) * .5 : -1.4, boilKey: 'pk' });
    if (chomp) for (let i = 0; i < 4; i++) { const k = frac((t - 26.3) * 2 + i / 4); paint(ellPts(kx - dirP * 80 + i * 10, FY - 300 + k * 260, 6, 5, 6), { wash: '#E6B65F', ink: null }); }
    camEnd();
  }

  // 08 · 30–34 · Cornered. Pip flips the laser round onto Pumpkin's tail: "Look! Behind you!" He spins after it... faster...
  function s08(t) {
    cam(360, 1330, 1.45);
    room(t); drawCushion(t);
    const KX = 520, spin = seg(t, 32.2, 34.0), sp = 2 + 30 * spin * spin;
    const ph = t < 32.2 ? 0 : (t - 32.2) * sp;
    const stage = Math.floor(ph * 2) % 4;   // front, side right, front (flipped), side left
    const dotOnTail = t > 30.6;
    if (spin > .7) { for (let i = 0; i < 6; i++) { const a = t * 20 + i; inkLine(arcPts(KX, FY - 260, 260, 120, a, a + 1, 8), 3, '#FFFFFF', 'ink', 0); } }
    pumpkin(KX, FY, U, { ...faces(t, [[30, 'greedy', { lookX: -1 }], [31.6, 'surprised', { lookX: 1, eyes: 'wide' }], [32.2, 'determined', { pupil: 1.1 }]]), view: t < 32.2 ? 'front' : (stage % 2 ? 'q' : 'front'),
      flip: stage === 3 || stage === 2, sq: t < 30.6 ? .2 : 0, rot: t < 30.6 ? Math.sin(t * 26) * .05 : 0, dy: spin > 0 ? -Math.abs(Math.sin(ph * 6)) * .15 : 0, tailWag: 1, aL: -1.4, aR: -1.4, boilKey: 'pk' });
    if (dotOnTail && t < 33.4) { const tw = Math.sin(t * 7) * 14; redDot(stage % 2 ? KX + (stage === 3 ? 230 : -230) : KX + (stage === 2 ? -180 : 180) + tw, FY - (stage % 2 ? 160 : 270), 1.1); }
    else if (!dotOnTail) redDot(140 + 24, FY - 66, 1.1);
    const a = t < 30.4 ? -.5 : lerp(-.5, .15, seg(t, 30.4, 30.6));
    pip(140, FY, U, { ...faces(t, [[30, 'sheepish', { lookX: 1 }], [30.3, 'determined', { brow: .6 }], [31.0, 'teasing'], [32.6, 'surprised', { eyes: 'wide' }]]), view: 'q', aR: a, aL: t > 30.7 && t < 32 ? .9 : -.6, ...laser(), who: 'pip', boilKey: 'pip' });
    camEnd();
  }

  // 09 · 34–40 · He's a tornado! The cushion and crackers whirl round him; he careens across the room... crashes, rolls,
  // flat out with spiral eyes, hugging his own tail. A cushion lands on his head. "...I caught it."
  function s09(t) {
    const crash = 36.8;
    cam(lerp(540, 760, ease(seg(t, crash + .2, crash + .9))), 1330, 1.15, shake(t, crash, 20, .5));
    room(t);
    const tx = 460 + 260 * Math.sin((t - 34) * 1.6) * seg(t, 34, 34.6);
    if (t < crash) {
      tornado(tx, FY, t, ease(seg(t, 34, 34.4)));
      // the whirling junk: the cushion, some crackers
      for (let i = 0; i < 4; i++) { const a = t * 7 + i * TAU / 4, r = 300, yy = FY - 200 - i * 90 + Math.sin(a) * 30; if (i === 0) { const k = seg(t, 34.6, 35.0); cushion(lerp(60, tx + Math.cos(a) * r, k), lerp(FY + 20, yy, k), a); } else crackerProp(tx + Math.cos(a) * r, yy, a * 2); }
    } else {
      const lie = 640, k = Math.exp(-(t - crash) * 4);
      pumpkin(lie, FY + 10, U, { ...faces(t, [[crash, 'dazed', { eyes: 'spiral' }], [38.2, 'happy', { eyes: 'spiral', blush: .4 }]]), rot: 1.45 + .2 * k * Math.sin((t - crash) * 18), aL: .4, aR: -.2, tailWag: 0, noShadow: true, who: 'pumpkin', boilKey: 'pk' });
      dizzy(lie + 380, FY - 260, 120, t);
      const land = seg(t, crash, 37.4);
      if (land < 1) { const p = arcPt([tx, FY - 600], [lie + 560, FY - 80], 200, land); cushion(p[0], p[1], land * 7); } else cushion(lie + 560, FY - 70, 1.45);
      for (let i = 1; i < 4; i++) { const l = seg(t, crash, crash + .5 + i * .15); const p = arcPt([tx, FY - 300], [lie - 260 + i * 150, FY + 20], 160, l); crackerProp(p[0], p[1], l * 9 + i); }
      puffCloud(tx, FY - 200, 260, (t - crash));
    }
    // Pip, hanging on to the curtain in the gale; then peeking out
    const gale = t < crash ? 1 : 0;
    pip(140, FY, U, { ...faces(t, [[34, 'panic'], [crash, 'surprised'], [38.9, 'sheepish', { lookX: 1 }]]), view: 'q', rot: gale * (-.15 + Math.sin(t * 13) * .05), scarfWind: gale, aL: gale ? 1.3 : -.6, aR: gale ? .9 : -.4, ...laser(0), boilKey: 'pip' });
    camEnd();
  }

  // 10 · 40–45 · Pip sighs with relief, wipes his brow, looks at the laser... grins, raises it. Cut close: = frame 1.
  function s10(t) {
    if (t < 43.2) {
      cam(420, 1360, 1.6);
      room(t);
      pumpkin(640, FY + 10, U, { ...face('happy', { eyes: 'spiral', blush: .4 }), rot: 1.45, aL: .4, aR: -.2, tailWag: 0, noShadow: true, boilKey: 'pk' });
      cushion(1200, FY - 70, 1.45); dizzy(1020, FY - 260, 120, t);
      const sigh = Math.sin(seg(t, 40.2, 41.2) * Math.PI), wipe = seg(t, 41.2, 41.9);
      pip(PH, FY, U, { ...faces(t, [[40, 'sheepish', { lid: .4 }], [41.2, 'happy'], [42.2, 'neutral', { lookX: 1, lookY: .5 }], [42.7, 'teasing']]), view: 'q', sq: .15 * sigh,
        aL: wipe > 0 && wipe < 1 ? 1.2 - .4 * Math.sin(wipe * TAU * 2) : -.6, aR: lerp(-.6, .25, ease(seg(t, 42.3, 42.9))), ...laser(0), boilKey: 'pip' });
      camEnd(); return;
    }
    cam(...CU); room(t);
    pip(PH, FY, U, { ...POSE0, ...faces(t, [[43.2, 'teasing']]), ...laser(0), boilKey: 'pip' });
    camEnd();
  }

  shots([[0, s01], [2.5, s02], [6, s03], [10.5, s04], [14, s05], [19, s06], [22.5, s07], [30, s08], [34, s09], [40, s10]]);
})();
