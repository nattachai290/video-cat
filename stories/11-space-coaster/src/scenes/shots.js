// shots.js: the 9 shots of "Pumpkin & Pip: The Space Coaster" (50 s, 1080 x 1920). See STORYBOARD.md.
// Living room (portal on the wall above the armchair) -> space -> the size-swapped room -> warp -> home.
// Frame 1 = last frame: close on Pumpkin in his shark hood with Pip (shark hood too) on his head, claws up (loops).
(() => {
  const U = 40, FY = FY11, PK = [300, FY], PORTAL = [760, 700, 170];
  const cam = (cx, cy, z, sh = [0, 0]) => camBegin(cx + sh[0], cy + sh[1], z);
  const shake = (t, t0, amp = 10, dur = .35) => t > t0 && t < t0 + dur ? [Math.sin(t * 90) * amp * (1 - (t - t0) / dur), Math.cos(t * 77) * amp * .6 * (1 - (t - t0) / dur)] : [0, 0];
  const room = t => { livingRoom6(t); curtain(t); };
  const POSE = { ...face('smug'), aL: .6, aR: .6 };
  // Pumpkin with Pip on his head (both in shark hoods). o: pumpkin options; p: pip options.
  function duo(x, y, u, t, o = {}, p = {}) {
    pumpkin(x, y, u, { ...POSE, ...o, draw: sharkHood(o.view === 'q' ? 1 : 0), who: 'pumpkin', boilKey: 'pk' });
    const q = o.view === 'q' ? 1 : 0, hx = x + (o.flip ? -1 : 1) * q * .55 * u;
    pip(hx, y + (o.dy || 0) * u - 13.0 * u, u * .8, { ...face('smug'), aL: .6, aR: .6, ...p, draw: pipSharkHood(0), noShadow: true, who: 'pip', boilKey: 'pip' });
  }
  // riders in cart space: Dusty in front, Pumpkin (+ Pip) behind. o: { d: dusty options, k: pumpkin options, p: pip options, noPip, noPumpkin }
  const riders = (t, o = {}) => (u, L, Hh) => {
    const top = -Hh - .4 * u;
    if (!o.noPumpkin) duo(-L * .2, top + 5.6 * u + (o.kdy || 0), u, t, { noShadow: true, aL: 1.0, aR: 1.0, ...o.k }, o.p);
    else if (!o.noPip) pip(-L * .2, top + 2.4 * u, u, { ...face('dazed'), draw: pipSharkHood(0), noShadow: true, ...o.p, boilKey: 'pip' });
    dusty(L * .2, top + 4.4 * u + (o.ddy || 0), u, { aR: .9, noShadow: true, ...o.d, who: 'dusty', boilKey: 'du' });
  };

  // ---- the living-room track: down out of the portal and along the floor to the left
  const RT = through([[PORTAL[0], PORTAL[1] + 40], [880, 880], [930, 1150], [880, 1420], [740, 1590], [560, 1600], [100, 1600]], 10);
  const RL = []; { let acc = 0; RT.forEach((p, i) => { if (i) acc += Math.hypot(p[0] - RT[i - 1][0], p[1] - RT[i - 1][1]); RL.push(acc); }); }
  function along(s) {   // point + angle at arc length s along RT
    s = clamp(s, 0, RL[RL.length - 1]); let i = 1; while (i < RL.length - 1 && RL[i] < s) i++;
    const a = RT[i - 1], b = RT[i], k = (s - RL[i - 1]) / (RL[i] - RL[i - 1] || 1);
    return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), Math.atan2(b[1] - a[1], b[0] - a[0])];
  }
  const S_STOP = (() => { let s = 0; while (along(s)[0] > 640 || along(s)[1] < 1590) s += 4; return s; })();
  const railPart = k => RT.slice(0, Math.max(2, Math.round(RT.length * k)));

  // 01 · 0–3 · CU: Pumpkin in a shark hood, Pip in a tiny one on his head. Claws up. "Rawr."
  function s01(t) {
    cam(300, 1180, 1.9);
    room(t);
    duo(...PK, U, t, { ...faces(t, [[0, 'smug'], [.9, 'smug', { mouth: 'grin' }], [1.6, 'smug']]) }, { ...faces(t, [[0, 'smug'], [1.0, 'smug', { mouth: 'O' }], [1.6, 'smug']]) });
    camEnd();
  }

  // 02 · 3–8 · A portal swirls open on the wall. Wind. A coaster track shoots out, a cart screeches up and stops.
  // Dusty taps his bat on his paw: "All aboard. No refunds."
  function s02(t) {
    cam(560, 1250, 1.05);
    room(t);
    const open = backOut(seg(t, 3.0, 3.8)), wind = open * (1 - seg(t, 5.2, 6.0));
    portal(...PORTAL, open, t);
    if (wind > .05) for (let i = 0; i < 8; i++) { const k = frac(t * 1.5 + i / 8), y = 500 + hash(i) * 1000, x0 = -100 + hash(i + 3) * 400; inkLine([[lerp(x0, PORTAL[0], k), lerp(y, PORTAL[1], k * k)], [lerp(x0, PORTAL[0], k) + 80, lerp(y, PORTAL[1], k * k)]], 3, '#FFFFFF', 'ink', 0); }
    const grow = ease(seg(t, 3.8, 4.5));
    if (grow > 0) rail(railPart(grow), U);
    const go = seg(t, 4.4, 5.2), s = S_STOP * easeOut(go), [cx, cy, ca] = along(s), stopped = go >= 1;
    if (go > 0) coasterCart(cx, cy, U, { rot: ca + Math.PI, flip: true, light: true, seats: riders(t, { noPumpkin: true, noPip: true, d: { ...faces(t, [[4, 'neutral']]), lid: .55, aR: stopped ? .9 + .25 * Math.max(0, Math.sin((t - 5.2) * 9)) : .9, aL: stopped && t > 5.4 ? .4 : -1.1 } }) });
    if (stopped) burst(cx - 260, cy - 20, 90, (t - 5.2) / .3, 8, '#FFFFFF', 3);
    duo(220, FY, U, t, { ...faces(t, [[3, 'smug'], [3.2, 'surprised', { lookX: 1 }], [5.3, 'greedy', { lookX: 1, eyes: 'wide' }]]), rot: .08 * wind, aL: -1.1, aR: -1.1 }, { ...faces(t, [[3, 'surprised', { lookX: 1 }], [5.3, 'happy']]), scarfWind: -wind });
    camEnd();
  }

  // 03 · 8–11 · They hop in; the lap bar drops; Dusty bonks the lever with his bat: the cart rockets backwards up into the portal.
  function s03(t) {
    const launch = seg(t, 9.25, 10.2);
    cam(lerp(600, 760, ease(launch)), lerp(1420, 1000, ease(launch)), 1.3);
    room(t); portal(...PORTAL, 1, t); rail(RT, U);
    const s = S_STOP * (1 - easeIn(launch)), [cx, cy, ca] = along(s);
    const hop = seg(t, 8.0, 8.6), bonk = seg(t, 8.9, 9.1);
    const inCart = hop >= 1;
    coasterCart(cx, cy, U, { rot: ca + Math.PI, flip: true, light: true, bar: ease(seg(t, 8.6, 8.85)),
      seats: riders(t, { noPumpkin: !inCart, noPip: !inCart, k: { ...faces(t, [[8.6, 'happy'], [9.3, 'surprised', { eyes: 'wide' }]]) }, p: { ...faces(t, [[8.6, 'happy'], [9.3, 'panic']]) },
        d: { lid: .55, aR: bonk > 0 && bonk < 1 ? lerp(1.4, -.6, bonk) : t < 8.9 ? 1.4 : -.6 } }) });
    if (!inCart) { const p = arcPt([220, FY], [cx + 100, cy - 140], 220, ease(hop)); duo(p[0], p[1], U, t, { ...face('happy'), aL: 1.2, aR: 1.2, noShadow: true }); }
    if (launch > 0) speedLines(cx, cy - 200, -1, t, 6, 300, 300);
    burst(cx - 200, cy - 180, 80, (t - 9.05) / .3, 8, '#FFFFFF', 5);
    camEnd();
    flash(seg(t, 10.3, 10.8) * (1 - seg(t, 10.8, 11)));
  }

  // ---- space track: a wave, with a full loop around t = 15..16.5
  const SPEED = 480, LOOP_T = [15, 16.5], LR = 260;
  const baseY = x => 1150 + 160 * Math.sin(x / 260);
  function spaceCart(t) {
    if (t < LOOP_T[0]) { const x = 300 + (t - 11) * SPEED; return [x, baseY(x), Math.atan(160 / 260 * Math.cos(x / 260))]; }
    const x0 = 300 + (LOOP_T[0] - 11) * SPEED, y0 = baseY(x0);
    if (t < LOOP_T[1]) { const a = ease(seg(t, ...LOOP_T)) * TAU, cx = x0, cy = y0 - LR; return [cx + Math.sin(a) * LR, cy + Math.cos(a) * LR, -a]; }
    const x = x0 + (t - LOOP_T[1]) * SPEED; return [x, baseY(x) + (y0 - baseY(x0)), Math.atan(160 / 260 * Math.cos(x / 260))];
  }
  function spaceRail(cxCam) {
    const P = []; for (let x = cxCam - 900; x <= cxCam + 900; x += 30) P.push([x, baseY(x)]); rail(P, U);
    const x0 = 300 + (LOOP_T[0] - 11) * SPEED, y0 = baseY(x0); const L = []; for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU; L.push([x0 + Math.sin(a) * LR, y0 - LR + Math.cos(a) * LR]); } rail(L, U);
  }

  // 04 · 11–19 · Space! The track waves through the stars; a full loop; hoods flapping. "WHEEE!" Pip eyes shut. Dusty: bored.
  function s04(t) {
    const [x, y, a] = spaceCart(t);
    space(t, x * 1.2, { planet: [830, 560, 160] });
    cam(x + 120, y - 150, 1.15, [Math.sin(t * 13) * 4, Math.cos(t * 11) * 4]);
    spaceRail(x);
    coasterCart(x, y, U, { rot: a, light: true, bar: 1, seats: riders(t, { k: { ...faces(t, [[11, 'happy', { mouth: 'grin' }], [12.6, 'happy', { mouth: 'O' }], [14, 'happy', { mouth: 'grin', blush: .5 }]]), aL: 1.3, aR: 1.3 },
      p: { ...face('panic', { eyes: 'squeeze' }), aL: 1.2, aR: 1.2 }, d: { lid: .6, aR: .9, mouth: 'flat' } }) });
    speedLines(x - 200, y - 200, 1, t, 6, 320, 360);
    camEnd();
  }

  // 05 · 19–25 · Behind a big planet a GIANT monster rises, roars, reaches up, grabs a star... squeezes... BOOM.
  function s05(t) {
    space(t, 600 + (t - 19) * 120, { planet: false });
    const rise = easeOut(seg(t, 19.2, 20.6)), roar = Math.sin(seg(t, 20.8, 21.8) * Math.PI), up = ease(seg(t, 22.0, 22.8)), boom = 23.5;
    const sh = shake(t, 20.8, 14, 1.0), sh2 = shake(t, boom, 30, .8);
    push(); translate(sh[0] + sh2[0], sh[1] + sh2[1]);
    const MX = 520, MY = 1500 - 260 * rise, S = .9;
    if (t < boom) { const hand = [MX + S * lerp(600, 480, up), MY + S * lerp(-200, -1200, up)], star = up < 1 ? [lerp(880, hand[0], up), lerp(260, hand[1], up)] : hand; starBall(star[0], star[1], 40 * (t > 22.8 ? 1 - .4 * seg(t, 22.8, 23.4) + .1 * Math.sin(t * 60) : 1), t); }
    monster(MX, MY, S, t, { mouth: t < boom ? .3 + .7 * roar : .5, armUp: up * (t < boom + .3 ? 1 : 1 - seg(t, boom + .3, boom + 1)) });
    paint(ellPts(540, 1950, 760, 520, 40), { wash: '#4F7FC9', sw: 3, shade: true, shadeK: .6 }); inkLine(arcPts(540, 1950, 1100, 200, Math.PI + .3, TAU - .3, 30), 14, '#9CC8E8', 'ink', 0);   // the big planet in front
    // the little coaster riding past in the foreground
    const cxp = 80 + (t - 19) * 70; coasterCart(cxp, 1380, 16, { light: true, bar: 1, seats: riders(t, { k: face('surprised', { eyes: 'wide' }), p: face('panic'), d: { lid: .6 } }) });
    starBlast(MX + S * 480, MY - S * 1200, (t - boom));
    pop();
    flash(t > boom ? 1 - seg(t, boom, boom + .5) : 0);
  }

  // 06 · 25–31 · A fireball streaks at the cart. Dusty stands up... swings... BONK! Straight back into the monster's mouth.
  // It coughs smoke. "Home run." Then the shockwave hits: the cart flips off the rails and tumbles into a new portal.
  function s06(t) {
    space(t, 1400 + (t - 25) * 200, { planet: [180, 380, 110] });
    const MXY = [880, 1020], S = .42, mouthAt = [MXY[0], MXY[1] - S * 430];
    monster(...MXY, S, t, { mouth: t > 27.4 && t < 28.2 ? 1 : .35 });
    const hit = 26.6, CART = [430, 1420], stand = ease(seg(t, 25.5, 25.9)), swing = seg(t, 26.4, 26.65);
    // fireball in, then out
    if (t > 25.3 && t < hit) { const k = seg(t, 25.3, hit); fireball(lerp(mouthAt[0], CART[0] + 230, k), lerp(mouthAt[1], CART[1] - 330, k), lerp(26, 80, k), t); }
    else if (t >= hit && t < 27.4) { const k = seg(t, hit, 27.4); fireball(lerp(CART[0] + 230, mouthAt[0], easeIn(k)), lerp(CART[1] - 330, mouthAt[1], easeIn(k)), lerp(80, 20, k), t); }
    if (t > 27.4 && t < 29) for (let i = 0; i < 3; i++) { const k = seg(t, 27.4 + i * .15, 28.4 + i * .15); if (k > 0 && k < 1) inkLine(ellPts(mouthAt[0] - 40 * k, mouthAt[1] - 90 * k - i * 30, 40 + 60 * k, 20 + 30 * k, 18).concat([ellPts(mouthAt[0] - 40 * k, mouthAt[1] - 90 * k - i * 30, 40 + 60 * k, 20 + 30 * k, 18)[0]]), 8 * (1 - k) + 1, '#8E8E9E', 'ink', 0); }
    burst(CART[0] + 240, CART[1] - 330, 120, (t - hit) / .3, 10, '#FFF3B0', 7);
    // the shockwave and the tumble into the portal
    const wave = seg(t, 28.9, 29.6), tumble = seg(t, 29.5, 30.8), PORT = [540, 760];
    if (wave > 0 && wave < 1) { const r = 200 + 1400 * wave; inkLine(ellPts(...MXY, r, r, 50).concat([ellPts(...MXY, r, r, 50)[0]]), 30 * (1 - wave) + 3, '#FFD24A', 'ink', 0); }
    portal(...PORT, 220, ease(seg(t, 29.4, 29.8)) * (1 - seg(t, 30.7, 31)), t);
    const P = arcPt(CART, PORT, 260, ease(tumble)), sc = lerp(1, .2, easeIn(tumble));
    if (tumble < 1) { const rl = []; for (let x = -300; x <= 1400; x += 30) rl.push([x, CART[1] + 6 + 40 * Math.sin(x / 200)]); if (tumble <= 0) rail(rl, U);
      push(); translate(...P); scale(sc, sc); coasterCart(0, 0, U * 1.1, { rot: tumble * TAU * 1.5, light: true, bar: 1,
        seats: riders(t, { ddy: -4.2 * stand * U * (tumble > 0 ? 0 : 1), k: { ...faces(t, [[25, 'happy'], [25.4, 'surprised', { eyes: 'wide' }], [27.0, 'happy', { mouth: 'grin' }], [29.0, 'panic']]) },
          p: { ...faces(t, [[25, 'panic'], [27.0, 'happy'], [29, 'panic']]) },
          d: { ...faces(t, [[25, 'neutral'], [28.4, 'neutral']]), lid: .6, aR: swing > 0 ? lerp(1.5, -.8, swing) : stand > 0 ? 1.5 : .9, aL: stand > 0 ? .3 : -1.1, mouth: 'flat' } }) }); pop(); }
  }

  // 07 · 31–38 · They drop out of a portal into a room where everything's swapped: Pumpkin is TINY, Pip is a GIANT.
  // "...Rawr?" (squeak). The giant mouse leans down, grinning: "Well, well, well."
  const GIANT = 110, TINY = 16, TP = [380, FY], GP = [720, FY];
  function s07(t) {
    cam(560, 1180, 1.0);
    room(t);
    portal(380, 520, 160, 1 - ease(seg(t, 32.2, 32.8)), t);
    const fallK = seg(t, 31.0, 31.5), pipFall = seg(t, 31.3, 31.8), grow = backOut(seg(t, 31.8, 32.3));
    // the giant (falls in normal-sized, then BOOM grows)
    const gu = lerp(U, GIANT, grow), lean = ease(seg(t, 36.4, 37.6));
    if (pipFall > 0) { const y = pipFall < 1 ? lerp(520, GP[1], easeIn(pipFall)) : GP[1]; pip(GP[0], y, gu, { ...faces(t, [[31.3, 'panic'], [32.3, 'surprised'], [33.2, 'neutral', { lookX: -1, lookY: 1 }], [34.8, 'smug', { lookX: -1, lookY: 1, mouth: 'smirk' }]]),
      rot: -.25 * lean, aL: lerp(-.6, -.2, lean), aR: -.6, draw: pipSharkHood(0), noShadow: pipFall < 1, who: 'pip', boilKey: 'pip' }); }
    const sh = shake(t, 31.8, 16, .5);
    // the tiny Pumpkin: falls, lands, trembles
    const ky = fallK < 1 ? lerp(520, TP[1], easeIn(fallK)) : TP[1], trem = t > 33 ? Math.sin(t * 50) * .04 : 0;
    pumpkin(TP[0] + sh[0], ky, TINY, { ...faces(t, [[31, 'panic'], [31.6, 'dazed'], [32.6, 'surprised', { eyes: 'wide', lookX: 1, lookY: -1 }], [35.4, 'panic', { lookX: 1, lookY: -1 }]]), rot: trem, aL: .6, aR: .6,
      draw: sharkHood(0), who: 'pumpkin', boilKey: 'pk' });
    if (lean > .3) paint(ellPts(TP[0] + 60, TP[1] + 4, 200 * lean, 40 * lean, 20), { wash: '#2B2233', washOp: 70 * lean, ink: null });   // the giant's shadow over him
    camEnd();
  }

  // 08 · 38–44 · The coaster smashes in through the wall and scoops them both up (the giant shrinks back with a POP).
  // "Wrong stop." Into a portal, through a warp tunnel, home.
  function s08(t) {
    if (t < 41.6) {
      cam(560, 1180, 1.0, shake(t, 38.6, 18, .4));
      room(t);
      portal(80, 1300, 200, ease(seg(t, 40.4, 40.8)), t);
      const cx = t < 41.0 ? lerp(1500, 520, easeOut(seg(t, 38.6, 39.4))) : lerp(520, 40, easeIn(seg(t, 41.0, 41.6))), scoop = t > 39.2;
      // the hole in the wall
      if (t > 38.6) { paint(ellPts(1020, 1350, 160, 190, 20), { wash: '#3A2A2E', sw: 2 }); for (let i = 0; i < 6; i++) { const k = seg(t, 38.6, 39.4); paint(rectPts(1000 + Math.cos(i) * 200 * k, 1300 + Math.sin(i * 2) * 140 * k - 300 * k * (1 - k), 30, 20), { wash: '#CFE3D8', sw: 1 }); } }
      if (!scoop) { pip(...GP, GIANT, { ...face('surprised', { lookX: 1 }), draw: pipSharkHood(0), boilKey: 'pip' }); pumpkin(...TP, TINY, { ...face('panic'), draw: sharkHood(0), boilKey: 'pk' }); }
      else if (t < 39.6) { const g = seg(t, 39.2, 39.6); pip(...GP, lerp(GIANT, U, ease(g)), { ...face('surprised'), draw: pipSharkHood(0), boilKey: 'pip' }); puffCloud(GP[0], GP[1] - 200, 260, g); }
      coasterCart(cx, FY + 30, U, { flip: true, light: true, bar: 1, seats: riders(t, { noPumpkin: !scoop, noPip: !scoop || t < 39.6, k: { ...face('dazed') }, p: { ...face('dazed') }, d: { lid: .6, aR: .9, mouth: 'flat' } }) });
      camEnd();
      return;
    }
    // the warp tunnel
    paint(rectPts(0, 0, W, H), { wash: '#1B1638', ink: null });
    for (let i = 0; i < 40; i++) { const a = hash(i) * TAU, k = frac(t * 1.6 + hash(i + 4)), r0 = 60 + 900 * k * k, r1 = r0 + 60 + 300 * k; inkLine([[540 + Math.cos(a) * r0, 960 + Math.sin(a) * r0], [540 + Math.cos(a) * r1, 960 + Math.sin(a) * r1]], 2 + 6 * k, i % 3 ? '#B98CFF' : '#3FC9E8', 'ink', 0); }
    const z = lerp(.6, 1.2, seg(t, 41.6, 44));
    push(); translate(540, 1050); scale(z, z); coasterCart(0, 0, U, { rot: Math.sin(t * 6) * .08, light: true, bar: 1, seats: riders(t, { k: { ...face('happy', { mouth: 'grin' }), aL: 1.2, aR: 1.2 }, p: { ...face('happy') }, d: { lid: .6, mouth: 'flat' } }) }); pop();
    flash(seg(t, 43.6, 44));
  }

  // 09 · 44–50 · Home: the cart pops out of the portal and tips them into the armchair, dizzy. Dusty tips his cap; the
  // cart reverses into the portal; it shrinks to a dot, POP. Pumpkin hops down, straightens his hood, Pip climbs back up = frame 1.
  function s09(t) {
    if (t < 48.2) {
      cam(560, 1250, 1.05);
      room(t);
      const shut = seg(t, 46.8, 47.4), open = 1 - ease(shut);
      portal(...PORTAL, open, t); if (t > 47.35 && t < 47.7) burst(...PORTAL.slice(0, 2), 80, (t - 47.35) / .35, 8, '#FFFFFF', 9);
      const out = seg(t, 44.0, 44.5), back = seg(t, 46.2, 46.8), tip = seg(t, 44.5, 44.9);
      if (back < 1) { const p = back > 0 ? arcPt([700, 1000], PORTAL, 60, easeIn(back)) : arcPt(PORTAL, [700, 1000], 120, easeOut(out)), s = back > 0 ? lerp(1, .2, back) : lerp(.3, 1, easeOut(out));
        push(); translate(...p); scale(s, s); coasterCart(0, 0, U, { flip: true, rot: -.5 * Math.sin(tip * Math.PI), light: true, seats: riders(t, { noPumpkin: tip > .5, noPip: true,
          k: face('dazed'), d: { lid: .6, aL: t > 45.6 && t < 46.2 ? 1.6 : -1.1, aR: .9, mouth: t > 45.6 ? 'smirk' : 'flat' } }) }); pop(); }
      const fly = seg(t, 44.7, 45.2), hopDown = seg(t, 47.4, 47.8), walk = seg(t, 47.8, 48.2), SEAT = [850, 1160];
      if (tip > .5) {
        let x, y, view = 'front', flip = false, rot = 0, pf = faces(t, [[44.7, 'panic'], [45.2, 'dazed', { eyes: 'spiral' }], [46.6, 'dazed'], [47.4, 'happy']]);
        if (fly < 1) { const p = arcPt([700, 1000], SEAT, 160, ease(fly)); x = p[0]; y = p[1]; rot = fly * TAU; }
        else if (hopDown <= 0) { x = SEAT[0]; y = SEAT[1]; }
        else if (hopDown < 1) { const p = arcPt(SEAT, [700, FY], 80, ease(hopDown)); x = p[0]; y = p[1]; }
        else { x = lerp(700, PK[0] + 40, ease(walk)); y = FY; view = 'q'; flip = true; }
        duo(x, y, U, t, { ...pf, view, flip, rot, aL: -1.1, aR: -1.1, noShadow: y < FY - 5, walk: view === 'side' ? t * 2.2 : null }, { ...faces(t, [[44.7, 'panic'], [45.2, 'dazed', { eyes: 'spiral' }], [47.4, 'happy']]) });
        if (t > 45.2 && t < 47.4) dizzy(SEAT[0], SEAT[1] - 640, 120, t);
      }
      camEnd(); return;
    }
    // CU: he straightens his hood, Pip settles back on top, claws up = frame 1
    cam(300, 1180, 1.9);
    room(t);
    const fix = Math.sin(seg(t, 48.3, 49.2) * Math.PI);
    duo(...PK, U, t, { ...faces(t, [[48.2, 'happy'], [49.2, 'smug']]), aL: lerp(.6, 1.6, fix), aR: lerp(.6, 1.6, fix) }, { ...faces(t, [[48.2, 'happy'], [49.2, 'smug']]), dy: -.4 * Math.abs(Math.sin(seg(t, 48.3, 49.0) * TAU)) });
    camEnd();
  }

  shots([[0, s01], [3, s02], [8, s03], [11, s04], [19, s05], [25, s06], [31, s07], [38, s08], [44, s09]]);
})();
