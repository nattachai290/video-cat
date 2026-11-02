// shots.js: the 12 shots of "Pumpkin & Pip: The Cat Flap" (52 s, 1080 x 1920). See STORYBOARD.md.
// Staging: Pumpkin is stuck coming IN: head in the kitchen, rear in the garden. Front shots show the kitchen side of the
// door; side shots show the door edge-on (kitchen left, garden right). The last frame matches the first (loop).
(() => {
  const U = 48;                                   // Pumpkin and Pip share one size unit in the front shots
  const say = (who, t) => typeof SPEAK === 'function' ? SPEAK(who, t) : 0;
  const chew = (t, on = true) => on ? .28 * Math.max(0, Math.sin(t * 15)) : 0;
  const STUCK = { x: 540, y: 1361 };              // Pumpkin's feet (hidden behind the door) when stuck, front view

  // Pumpkin stuck in the flap, seen from the kitchen: the chest shows in the hole, the head and paws stick out over
  // the door; the frame's top bar crosses under the chin.
  function stuckFront(t, o = {}) {
    const f = KF.flap, wig = Math.sin(t * 7) * .04 + (o.wig || 0);
    const P = { ...o.face, belly: 1, puff: o.puff || 0, aL: -1.45, aR: -1.45, noShadow: true, noTail: true,
                who: 'pumpkin', dx: wig, rot: wig * .15, sq: o.sq || 0, dy: o.dy || 0, boilKey: 'stuck', ...o.extra };
    clipRects([[f.x, f.y, f.w, f.h]], () => pumpkin(STUCK.x, STUCK.y, U, P));
    paint(rectPts(f.x - 18, f.y - 6, 18, f.h + 6), { wash: KC.doorDk, ink: null });
    paint(rectPts(f.x + f.w, f.y - 6, 18, f.h + 6), { wash: KC.doorDk, ink: null });
    clipRects([[-600, -600, W + 1200, f.y - 18 + 600]], () => pumpkin(STUCK.x, STUCK.y, U, P));
    // the two front paws gripping the frame's top corners, toes over the edge, flexing
    const C = PUMPKIN_COL, col = mixCol(C.col, '#8E6A55', 0);
    for (const s of [-1, 1]) {
      const g = Math.sin(t * 5 + s) * 3, px = (s < 0 ? f.x - 8 : f.x + f.w + 8) + (o.dx || 0) * U, py = f.y - 22 + g;
      paint(ellPts(px, py, .78 * U, .58 * U, 20, 0, s * .25), { wash: col, sw: 1.6, shade: true, shadeK: .5 });
      for (const k of [-1, 0, 1]) inkLine([[px + k * .3 * U, py + .05 * U], [px + k * .32 * U, py + .45 * U]], 1.3, mixCol(C.col, '#2A1A30', .45), 'inkfine', 0);
    }
  }
  // Pumpkin stuck, seen edge-on: facing left (head in the kitchen), the rear and tail out in the garden.
  const SIDE_U = 50, SIDE_X = SW.x + .6 * SIDE_U;
  function stuckSide(t, o = {}) {
    pumpkin(SIDE_X + (o.dx || 0), SW.floor, SIDE_U, { view: 'side', flip: true, belly: o.belly ?? 1, puff: o.puff || 0, wet: o.wet || 0, noShadow: false,
      ...o.face, who: 'pumpkin', sq: o.sq || 0, boilKey: 'side', tailWag: o.tailWag ?? .6 });
    sideWallOver(SW.holeTop, o.squeeze ?? .8);
  }
  const cam = (cx, cy, z, sh = [0, 0]) => camBegin(cx + sh[0], cy + sh[1], z);
  const drift = (lt, a = 6) => [Math.sin(lt * .7) * a, Math.cos(lt * .5) * a * .6];

  // 01 · 0–4 · CU, the hook: "Don't. Say. Anything."
  function s01(t, lt) {
    const z = 1.9 + .02 * Math.sin(lt * .8 * Math.PI / 4) ** 2, [dx, dy] = drift(lt, 4);
    cam(540 + dx * lt / 4, 960 + dy * lt / 4, z);
    kitchenFront(t);
    const words = [.42, 1.0, 1.55];   // a twitch on each word
    stuckFront(t, { face: faces(t, [[0, 'embarrassed'], [1.2, 'annoyed', { lookX: 0 }], [3.1, 'embarrassed']]), sq: ring(t, words, 9, 30) * .04 });
    camEnd();
  }

  // 02 · 4–9 · Pip walks in munching. "I didn't say anything." … "Big lunch?"
  function s02(t, lt, dur) {
    const z = lerp(1.9, 1.2, ease(seg(lt, 0, 1.1))), cy = lerp(960, 1110, ease(seg(lt, 0, 1.1)));
    cam(lerp(540, 600, ease(seg(lt, 0, 1.1))), cy, z);
    kitchenFront(t);
    stuckFront(t, { face: faces(t, [[4, 'embarrassed'], [4.5, 'annoyed'], [7.7, 'embarrassed', { lookX: -.8 }]]) });
    const walk = seg(t, 4.0, 5.3), px = lerp(1260, 820, ease(walk));
    const looking = t > 6.1 && t < 7.0, lookY = looking ? Math.sin((t - 6.1) / .9 * TAU) * .9 : 0;
    const pf = faces(t, [[4, 'munching'], [4.35, 'innocent'], [6.1, 'deadpan'], [7.05, 'teasing']]);
    if (t < 5.35) pip(px, KF.floor + 70, U, { view: 'side', flip: true, walk: (1260 - px) / (1.6 * U), dy: -Math.abs(Math.sin(walk * 9)) * .15, cracker: true, aR: .2, ...pf, talk: chew(t), boilKey: 'pip' });
    else pip(820, KF.floor + 70, U, { view: 'q', flip: true, cracker: true, aR: .25 + (t > 7 ? .15 : 0), ...pf, lookY, talk: Math.max(say('pip', t), chew(t, t < 6.1 || t > 8.2)), boilKey: 'pip' });
    camEnd();
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, ['#F2B33E', '#F4C98A']);
  }

  // 03 · 9–14 · Flashback: the fish pie, in three bites. The belly swells; a burp.
  function s03(t, lt, dur) {
    cam(KF.dish.x + 20, 1260, 1.35 + .04 * lt / 5);
    kitchenFront(t, { dish: false, bucket: false });
    const bites = [10.0, 10.8, 11.6], n = bites.filter(b => t >= b).length;
    const belly = n === 0 ? 0 : clamp((n - 1) / 3 + backOut(seg(t, bites[n - 1], bites[n - 1] + .25)) / 3, 0, 1.1);
    const dip = bites.reduce((s, b) => s + Math.exp(-((t - b + .05) ** 2) / .012), 0);
    const pf = faces(t, [[9, 'greedy'], [9.8, 'munching'], [12.35, 'surprised', { mouth: 'O' }], [12.9, 'proud']]);
    pumpkin(KF.dish.x + 10, 1430, 40, { ...pf, belly, dy: dip * .5, sq: dip * .12 + take(t, 12.35, .6).sq, rot: dip * .05, aL: -.6, aR: -.6 + dip * .8,
      talk: n < 3 || t < 12 ? chew(t, t > 9.8 && t < 12.2) * 1.6 : 0, boilKey: 'pk3' });
    pieDish(KF.dish.x, KF.dish.y + 10, 1.05, 1 - n / 3);
    if (t > 12.35) puffCloud(380, 1050, 40, t - 12.35);
    // warm memory tint and a soft vignette
    camEnd();
    paint(rectPts(0, 0, W, H), { wash: '#F6C27A', washOp: 46, ink: null });
    irisShape(ellPts(W / 2, H / 2, W * .78, H * .6, 48), mixCol('#F6C27A', '#7A4A2A', .5));
    if (lt < .3) brushWipe(.5 + lt / .6, ['#F2B33E', '#F4C98A']);
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, ['#F2B33E', '#F4C98A']);
  }

  // 04 · 14–18 · "Push me through. I'll give you half my dinner."
  function s04(t, lt) {
    cam(560, 990, 1.55 + .03 * lt / 4);
    kitchenFront(t);
    stuckFront(t, { face: faces(t, [[14, 'deadpan', { browUp: .35, brow: -.1 }], [16.1, 'innocent'], [17.4, 'deadpan']]) });
    pip(860, KF.floor + 70, U, { view: 'q', flip: true, cracker: true, aR: .25, ...face('deadpan'), talk: chew(t), boilKey: 'pip' });
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, ['#F2B33E', '#F4C98A']);
  }

  // 05 · 18–22 · "You just ate your dinner." (points at the empty dish) "…Tomorrow's dinner."
  function s05(t, lt) {
    cam(480 + 10 * lt, 1170, 1.18);
    kitchenFront(t);
    const glance = seg(t, 19.0, 19.3) * (1 - seg(t, 20.1, 20.4));
    stuckFront(t, { face: faces(t, [[18, 'annoyed'], [19.05, 'surprised', { lookX: -1, lookY: .9 }], [20.15, 'sheepish', { lookX: .3 }]]), extra: { lookX: glance ? -1 : undefined } });
    const point = backOut(seg(t, 18.3, 18.6)) * (1 - ease(seg(t, 20.0, 20.4)));
    pip(830, KF.floor + 70, U, { view: 'q', flip: true, cracker: true, aR: .2, aL: lerp(-1.1, .55, point), ...faces(t, [[18, 'deadpan'], [20.4, 'smug']]),
      lookX: point > .5 ? .9 : 0, talk: say('pip', t), boilKey: 'pip' });
    camEnd();
  }

  // 06 · 22–28 · Edge-on: Pip comes out of the mouse hole, sets the cracker down and pushes. Nothing moves.
  function s06(t, lt) {
    cam(560, 1200, 1.02);
    sideWall(t);
    const crackerDown = t > 23.25;
    if (crackerDown) pipCrackerAt(985, SW.floor - 6);
    stuckSide(t, { face: faces(t, [[22, 'deadpan', { lookX: .6 }], [24.5, 'strain'], [27.2, 'annoyed']]), dx: Math.sin(t * 30) * .03 * seg(t, 24.5, 24.7) * (1 - seg(t, 27.6, 27.9)) });
    // Pip's path: out of the hole (22.2), right to the cracker spot (to 23.0), bend (23.0–23.4), back left to the rear (23.6–24.4), push
    let px, flip, walk = null, sq = 0, rot = 0, aR = -1.1, pf, wind = 0;
    if (t < 23.0) { const k = seg(t, 22.2, 23.0); px = lerp(SW.x + 40, 960, ease(k)); flip = false; walk = (px - SW.x) / (1.4 * U); pf = face('innocent'); }
    else if (t < 23.6) { px = 960; flip = false; sq = .18 * Math.sin(seg(t, 23.0, 23.5) * Math.PI); aR = lerp(-1.1, -1.5, Math.sin(seg(t, 23.0, 23.5) * Math.PI)); pf = face('munching'); }
    else if (t < 24.4) { const k = seg(t, 23.6, 24.4); px = lerp(960, 905, ease(k)); flip = true; walk = k * 1.5; pf = face('determined'); }
    else { px = 905 + Math.sin(t * 22) * 3; flip = true; walk = (t - 24.4) * 3.2; rot = -.18; aR = .08; pf = face('strain'); wind = .3; }
    pip(px, SW.floor, U, { view: 'side', flip, walk, sq, rot, aR, ...pf, scarfWind: wind, cracker: !crackerDown, emote: t > 25.2 ? 'sweat' : null, emoteK: seg(t, 25.2, 25.5), boilKey: 'pip' });
    camEnd();
  }
  function pipCrackerAt(x, y) { push(); translate(x, y - 14); rotate(-.1); pipCracker(U, 1.4); pop(); }

  // 07 · 28–32 · "Okay. Run-up." Pip backs off across the lawn, stretches. Pumpkin looks back, worried.
  function s07(t, lt) {
    const z = lerp(1.02, .86, ease(seg(lt, 0, 1.4)));
    cam(lerp(560, 640, ease(seg(lt, 0, 1.4))), 1200, z);
    sideWall(t);
    pipCrackerAt(985, SW.floor - 6);
    stuckSide(t, { face: faces(t, [[28, 'annoyed'], [28.9, 'panic', { lookX: -1 }]]), tailWag: 1 });
    let px = 905, walk = null, aR = -1.1, aL = -1.1, sq = 0, pf = faces(t, [[28, 'determined'], [30.6, 'determined', { eyes: 'closed' }], [31.5, 'determined']]);
    if (t >= 28.8 && t < 30.6) { const k = seg(t, 28.8, 30.6); px = lerp(905, 1190, ease(k)); walk = -(px - 905) / (1.0 * U); }   // walks backwards
    else if (t >= 30.6) { px = 1190; const s = seg(t, 30.6, 31.5); aR = lerp(-1.1, 1.4, Math.sin(s * Math.PI)); aL = aR; sq = -.12 * Math.sin(s * Math.PI) + .2 * ease(seg(t, 31.6, 32)); }
    pip(px, SW.floor, U, { view: 'side', flip: true, walk, aR, aL, sq, ...pf, talk: say('pip', t), boilKey: 'pip' });
    camEnd();
  }

  // 08 · 32–35 · The charge. Head first into Pumpkin's rear: BOING. Then the squeeze starts to give.
  function s08(t, lt) {
    const hit = 33.6, sh = t > hit && t < hit + .3 ? shakeXY(t, 16 * (1 - seg(t, hit, hit + .3))) : [0, 0];
    cam(lerp(820, 700, ease(seg(t, 32, 33.6))), 1250, 1.15, sh);
    sideWall(t);
    pipCrackerAt(985, SW.floor - 6);
    const give = ease(seg(t, 34.2, 35)) * .35;
    stuckSide(t, { face: faces(t, [[32, 'panic', { lookX: -1 }], [hit, 'surprised'], [34.3, 'strain']]), dx: -give + spring(t, hit, 7, 26) * .08, sq: spring(t, hit, 6, 30) * .1, tailWag: 1 });
    let px, sq = 0, rot = -.25, walk = null, pf = face('determined', { lid: .2 }), dy = 0;
    if (t < hit) { const k = seg(t, 32.0, hit); px = lerp(1190, 905, easeIn(k) * .6 + k * .4); walk = (1190 - px) / (1.1 * U); dy = -Math.abs(Math.sin(walk * Math.PI)) * .4; }
    else { const a = t - hit; px = 905 + 60 * (1 - Math.exp(-a * 6)); sq = .4 * Math.exp(-a * 7) * Math.cos(a * 26); rot = -.25 * Math.exp(-a * 4); pf = face('dazed'); }
    pip(px, SW.floor, U, { view: 'side', flip: true, walk, sq, rot, dy, aR: .3, aL: .3, scarfWind: t < hit ? 1 : .2, ...pf, boilKey: 'pip' });
    burst(SIDE_X + 6.2 * SIDE_U, SW.floor - 3.5 * SIDE_U, 120, (t - hit) / .45, 12, '#FFFFFF');
    camEnd();
  }

  // 09 · 35–39 · POP. Pumpkin shoots into the kitchen like a cork, spins, and lands in the mop bucket.
  function s09(t, lt) {
    const pop0 = 35.05, land = 36.4, sh = t > land && t < land + .3 ? shakeXY(t, 12) : [0, 0];
    const pan = ease(seg(t, 36.5, 37.3));
    cam(lerp(540, 330, pan) + sh[0], lerp(1180, 1300, pan) + sh[1], lerp(1.0, 1.35, pan));
    kitchenFront(t, { bucket: false, flapOpen: clamp(Math.abs(spring(t, pop0, 3, 10)) * 1.3) });
    const B = KF.bucket, wob = t > land ? Math.exp(-(t - land) * 1.6) : 0;
    mopBucketBack(B.x, B.y, 1, wob);
    if (t < land) {
      const k = seg(t, pop0, land), p = arcPt([540, 1330], [B.x, B.y - 140], 560, k);
      pumpkin(p[0], p[1], 40, { ...face('panic'), belly: 1, rot: -k * 3.2 * Math.PI, sq: -.2 * Math.sin(k * Math.PI), aL: 1.3, aR: 1.1, noShadow: true, boilKey: 'fly' });
    }
    else {   // upside down in the bucket: only the feet and tail stick out, kicking
      const kick = Math.sin((t - land) * 9) * Math.exp(-(t - land) * .5);
      clipRects([[B.x - 260, -600, 520, B.y - 230 + 600 + 12]], () =>
        pumpkin(B.x + 6, B.y - 230 - 3.2 * 40 + kick * 8, 40, { ...face('dazed'), belly: 1, rot: Math.PI + kick * .08, noShadow: true, tailWag: 1, boilKey: 'legs' }));
    }
    mopBucketFront(B.x, B.y, 1, wob);
    puffCloud(540, 1240, 120, t - pop0);
    burst(540, 1220, 220, (t - pop0) / .5, 14, '#FFFFFF', 3);
    splash(B.x, B.y - 230, 1, t - land);
    if (t > 37.6) bubbles(B.x, B.y - 230, 1, 37.6, 4);
    camEnd();
  }

  // 10 · 39–43 · Out of the bucket, soaked flat and skinny. "…I'm thin now."
  function s10(t, lt) {
    const B = KF.bucket;
    cam(B.x + 60, 1180, 1.55);
    kitchenFront(t, { bucket: false });
    mopBucketBack(B.x, B.y, 1, .2);
    const rise = backOut(seg(t, 39.05, 39.7)), drip = Math.sin(t * 5);
    pumpkin(B.x, B.y - 110, 40, { ...faces(t, [[39, 'soggy'], [41.5, 'proud', { eyes: ['closed', 'closed'] }], [42.5, 'soggy']]), wet: 1, dy: lerp(9, 0, rise),
      aL: -1.2 + .05 * drip, aR: -1.2, who: 'pumpkin', noShadow: true, boilKey: 'wet' });
    if (rise > .9) { const bx = B.x + 6, by = B.y - 110 - 40 * 13.2 + 12 * Math.sin(t * 2); paint(ellPts(bx, by, 26, 24, 18), { wash: '#E9F7FC', washOp: 200, sw: .6 }); paint(ellPts(bx - 8, by - 8, 6, 5, 8), { wash: '#FFFFFF', ink: null }); }
    for (let i = 0; i < 4; i++) { const a = frac(t * 1.3 + i * .27); paint(ellPts(B.x - 120 + i * 80, B.y - 380 + a * 160, 6, 9, 8), { wash: KC.water, washOp: 255 * (1 - a), ink: null }); }
    mopBucketFront(B.x, B.y, 1, 0);
    camEnd();
  }

  // 11 · 43–48 · Edge-on: thin and wet, Pumpkin strolls out through the flap… turns, strolls back in, dries mid-way: POOF.
  function s11(t, lt) {
    cam(540, 1180, 1.0);
    sideWall(t);
    const poof = 45.9;
    let x, flip, walk = null, wet = 1, puff = 0, sq = 0, pf;
    if (t < 44.7) { const k = seg(t, 43.0, 44.7); x = lerp(150, 790, ease(k)); flip = false; walk = (x - 150) / (2.2 * SIDE_U); pf = face('proud', { eyes: 'closed' }); }
    else if (t < 45.0) { x = 790; flip = t > 44.85; pf = face('smug'); }
    else { const k = seg(t, 45.0, poof); x = lerp(790, SIDE_X, ease(k)); flip = true; walk = k < 1 ? (790 - x) / (2.2 * SIDE_U) : null; pf = faces(t, [[45, 'smug'], [poof, 'surprised'], [46.5, 'panic'], [47.3, 'deadpan']]); }
    if (t > poof) { const k = backOut(seg(t, poof, poof + .25)); puff = k; wet = 1 - clamp(k); sq = take(t, poof, 1).sq; }
    pumpkin(x, SW.floor, SIDE_U, { view: 'side', flip, walk, wet, puff, belly: 0, sq, ...pf, boilKey: 'side' });
    sideWallOver(t > poof ? SW.holeTop : SW.holeTop - 150);
    puffCloud(SIDE_X, SW.floor - 3.5 * SIDE_U, 330, (t - poof) * 1.6);
    camEnd();
  }

  // 12 · 48–52 · "Same time tomorrow?" "…Bring a run-up." The camera pushes back in to shot 01's frame (loop).
  function s12(t, lt) {
    const k = ease(seg(t, 49.6, 52));
    cam(lerp(600, 540, k), lerp(1110, 960, k), lerp(1.2, 1.9, k));
    kitchenFront(t);
    const puff = 1 - ease(seg(t, 48.4, 51.4));
    stuckFront(t, { puff, face: faces(t, [[48, 'annoyed'], [49.7, 'deadpan'], [51.35, 'embarrassed']]) });
    const go = seg(t, 50.9, 51.8), pf = faces(t, [[48, 'teasing'], [49.6, 'munching']]);
    if (go <= 0) pip(820, KF.floor + 70, U, { view: 'q', flip: true, cracker: true, aR: .3, ...pf, talk: Math.max(say('pip', t), chew(t, t > 49.6)), boilKey: 'pip' });
    else { const px = lerp(820, 1260, easeIn(go)); pip(px, KF.floor + 70, U, { view: 'side', walk: (px - 820) / (1.4 * U), cracker: true, aR: .2, ...pf, talk: chew(t), boilKey: 'pip' }); }
    camEnd();
  }

  shots([[0, s01], [4, s02], [9, s03], [14, s04], [18, s05], [22, s06], [28, s07], [32, s08], [35, s09], [39, s10], [43, s11], [48, s12]]);
})();
