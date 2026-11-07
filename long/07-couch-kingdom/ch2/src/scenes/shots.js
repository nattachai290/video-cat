// shots.js: chapter 2 "The Sock Bridge" (titles 0-5, chapter 5-185, End Screen 185-205; 1920 x 1080). See ../STORYBOARD.md (v4.1).
// EVERY time in this file is the CLIP time of the storyboard (absolute seconds, the same numbers as lines.json and the sfx/music
// scripts), so a scene line "141.0 Pip: Don't eat the bridge." sits at t = 141.0 here.
// The party travels LEFT -> RIGHT the whole chapter.
(() => {
  const U = 40, HEAD = TFY - 338, cam = (cx, cy, z, sh = [0, 0]) => camBegin(cx + sh[0], cy + sh[1], z);
  const camT = (cx, z, sh = [0, 0], up = 0) => cam(cx, TFY - 445 / z - up, z, sh);
  const camC = (cx, z, sh = [0, 0]) => camT(cx, z, sh, -230 / z);   // canyon shots: the frame shows the deck and the drop below it
  const shake = (t, t0, amp = 10, dur = .35) => t > t0 && t < t0 + dur ? [Math.sin(t * 90) * amp * (1 - (t - t0) / dur), Math.cos(t * 77) * amp * .6 * (1 - (t - t0) / dur)] : [0, 0];
  const PKO = { crown: true };   // Pumpkin's hero kit; the cloak is queued by sockCape and drawn over his body by pumpkin()
  const hero = (x, y, o, t, cape = true) => { if (cape) sockCape(x, y, U, { wind: o.wind ?? Math.sin(t * 2) * .15 }); pumpkin(x, y, U, { ...PKO, armR: excalifork(o.lit || 0), ...o, boilKey: 'pk' }); };
  const mouse = (x, y, o) => { pipPack(x, y, U, { view: o.view, flip: o.flip, dy: o.dy }); pip(x, y, U, { ...o, boilKey: 'pip' }); };
  const crumbsMouth = (x, y, t, t0, t1) => { if (t > t0 && t < t1) for (let i = 0; i < 4; i++) { const k = frac((t - t0) * 2 + i / 4); paint(ellPts(x + i * 10 - 15, y - k * 120, 7, 5, 6), { wash: '#E6B65F', ink: null }); } };
  const cutAt = (t, list) => { let r = list[0]; for (const e of list) if (t >= e[0]) r = e; return r; };   // hard cuts: the last entry whose time has come
  const munch = (t, a, b) => t > a && t < b ? { talk: .3 * Math.max(0, Math.sin(t * 22)) } : { who: 'pumpkin' };   // chewing instead of lip-sync
  const crumb = (x, y, r = 0, s = 1) => { push(); translate(x, y); rotate(r); scale(s, s); paint(rrPts(-9, -7, 18, 14, 4), { wash: '#E6B65F', ink: PAL.ink, sw: .8 }); pop(); };

  // ============ 2-1 · 5-20 · The Crumb Welcome (town gate) ============
  function s1(t) {
    camT(kf(t, [[5, 1000], [12.5, 1000], [13.3, 930], [16, 930], [16.6, 1000]]), kf(t, [[5, 1.3], [12.5, 1.3], [13.3, 1.8], [16, 1.8], [16.6, 1.3]]));
    townGate(t);
    crumbCloud(1010, TFY + 30, seg(t, 18.6, 20.2), 170);
    for (let i = 0; i < 5; i++) dustBunny(110 + i * 100, TFY, U, { ...face('happy', { eyes: 'happy' }), seed: i + 2, dy: -Math.abs(Math.sin(t * 8 + i)) * .5, boilKey: 'cb' + i });
    queenButton(420, TFY, U, { ...faces(t, [[5, 'proud', { mouth: 'grin' }]]), aL: .3 + Math.sin(t * 6) * .3, boilKey: 'queen' });
    crumbRain(t, 5.0, 64, .24, 0, 1900);
    // the crumb that lands on his nose (7.0-8.3), eaten at 8.3
    const nk = seg(t, 7.0, 7.9); if (nk > 0 && t < 8.3) crumb(880, nk < 1 ? lerp(HEAD - 520, HEAD + 14, nk * nk) : HEAD + 14, nk * 6);
    const catching = t > 13.3 && t < 16.5;
    if (catching) for (let i = 0; i < 4; i++) { const k = frac((t - 13.3) * .9 + i / 4); crumb(850 + i * 22, lerp(HEAD - 360, HEAD + 40, k * k), k * 9, .8); }
    hero(880, TFY, { ...faces(t, [[5, 'proud'], [7.3, 'surprised', { lookY: .9 }], [8.3, 'munching'], [9.4, 'happy', { blush: .5 }], [10.4, 'neutral', { lookX: 1 }], [13.3, 'greedy', { lookY: -.8 }], [16.5, 'panic', { eyes: ['squeeze', 'open'] }], [18, 'sheepish']]),
      aL: .6, aR: .6 + Math.sin(t * 5) * .1, rot: catching ? -.05 : 0, ...munch(t, 8.3, 9.4), ...(t > 7.3 && t < 8.3 ? { talk: 0 } : {}) }, t);
    mouse(1140, TFY, { ...faces(t, [[5, 'deadpan', { lookX: -1 }], [10.2, 'deadpan', { lookX: -1 }], [16.5, 'deadpan', { lookY: 1 }], [18, 'deadpan']]), view: 'q', flip: true, who: 'pip' });
    windupCar(1620, TFY, .9, t, { key: 0 });
    sirLint(1620, TFY - 130, U * .9, { ...face('determined', { mouth: 'grin' }), view: 'side', lance: .6, noShadow: true, boilKey: 'lint' });
    camEnd();
  }

  // ============ 2-2 · 20-45 · The Oracle's Map (town gate) ============
  const mapAt = t => [kf(t, [[21.5, 1090], [23.6, 1150], [34.4, 1150], [35.2, 1010], [35.6, 1010], [36.4, 1150], [44, 1150]]), kf(t, [[21.5, TFY - 330], [23.6, TFY - 250], [34.4, TFY - 250], [35.2, TFY - 190], [35.6, TFY - 190], [36.4, TFY - 250], [44, TFY - 250]]),
    kf(t, [[21.6, 0], [24.0, 0], [24.9, 1]]), t < 26.2 ? Math.cos(Math.PI * seg(t, 24.6, 25.4)) : t < 39.4 ? Math.cos(Math.PI * (1 + seg(t, 26.2, 27))) : t < 41.8 ? Math.cos((t - 39.4) * 8) : 1];
  function s2(t) {
    camT(kf(t, [[20, 960], [21.2, 960], [22, 1010], [23.6, 1010], [24.2, 1110], [27, 1110], [27.6, 960], [30, 960], [30.6, 880], [34, 880], [34.6, 960], [41.5, 960], [42, 1010], [44, 1010]]),
      kf(t, [[20, 1.3], [21.2, 1.3], [22, 1.7], [23.6, 1.7], [24.2, 2.0], [27, 2.0], [27.6, 1.4], [30, 1.4], [30.6, 1.7], [34, 1.7], [34.6, 1.4], [41.5, 1.4], [42, 1.8], [44, 1.8]]));
    townGate(t);
    crumbRain(t, 5.0, 64, .24, 0, 1900);   // the crumbs keep landing (all the landed ones stay)
    crumbCloud(1010, TFY + 30, 1 - seg(t, 20, 22), 170);
    crumbCloud(1010, TFY + 30, seg(t, 43.6, 45), 170);
    for (let i = 0; i < 5; i++) dustBunny(110 + i * 100, TFY, U, { ...face('happy', { eyes: 'happy' }), seed: i + 2, dy: -Math.abs(Math.sin(t * 8 + i)) * .3, boilKey: 'cb' + i });
    // the Oracle rises out of the crumb cloud, and sinks back at the end
    const oy = lerp(TFY + 140, TFY - 250, backOut(seg(t, 20, 21.4))) + easeIn(seg(t, 43.6, 44.6)) * 390;
    push(); clipRects([[-900, -600, 3800, TFY + 30 + 600]], () => oracleCookie(1010 + (t > 37.5 && t < 40 ? 28 : 0), oy, U * 1.2,
      { ...faces(t, [[20, 'neutral'], [27.4, 'annoyed'], [29, 'neutral'], [33, 'smug'], [34.5, 'neutral'], [42, 'neutral']]), lid: t > 27.4 && t < 29 ? .1 : .45, who: 'oracle', noShadow: true, boilKey: 'oc' })); pop();
    const kx = kf(t, [[20, 700], [30.2, 700], [31.2, 980], [35.6, 980], [36.6, 700]]);
    hero(kx, TFY, { ...faces(t, [[20, 'proud'], [21.4, 'surprised', { lookX: 1, lookY: -.3 }], [30.4, 'greedy', { lookX: 1 }], [33, 'sheepish', { lookX: 1 }], [34.5, 'happy', { eyes: 'happy', blush: .6 }], [36, 'neutral', { lookX: 1 }]]),
      view: 'q', aR: -1.1, aL: t > 34.5 && t < 36 ? .3 : -1.1, who: 'pumpkin' }, t);
    const pipArms = t > 23.8 && t < 42 ? .7 : -.6;
    mouse(1200, TFY, { ...faces(t, [[20, 'neutral', { lookX: -1, lookY: -.5 }], [24, 'deadpan', { lookX: -1 }], [29, 'annoyed', { lookX: -1 }], [35.5, 'annoyed'], [39.5, 'deadpan', { lookY: 1 }]]), view: 'q', flip: true, aL: pipArms, aR: pipArms, who: 'pip' });
    sirLint(1500, TFY, U * 1.1, { ...face('surprised', { lookY: -1, lookX: -1 }), view: 'q', flip: true, boilKey: 'lint' });
    if (t > 21.5 && t < 43.8) { const [mx, my, op, fy] = mapAt(t); mapScroll(mx, my, op, fy, .8); }
    camEnd();
  }

  // ============ 2-3 · 45-65 · The Journey (the road; the wind-up car) ============
  const ss = t => (t > 45 && t < 49.2 ? 150 : 0) + (t > 62.5 && t < 65 ? 150 : 0);
  const scrollAt = t => 150 * (clamp(t, 45, 49.2) - 45) + 150 * (clamp(t, 62.5, 65) - 62.5);
  const lin = x => x;
  const carS = t => kf(t, [[45, 1260], [48, 1260], [49.2, 1080], [51.6, 1080], [53.4, 1330], [56.5, 1330], [57.6, 1000], [62.5, 1000], [64.8, 1560]], lin);
  const pkS = t => kf(t, [[45, 760], [53.0, 760], [54.0, 1150], [57.9, 1150], [58.8, 760], [65, 760]], lin);
  const ppS = t => kf(t, [[45, 560], [49.2, 560], [50.4, 960], [51.6, 960], [52.8, 560], [56.0, 560], [56.8, 640], [61.0, 640], [61.9, 883], [62.5, 883], [63.0, 700], [65, 700]], lin);
  function s3(t) {
    const sc = scrollAt(t);
    camT(kf(t, [[45, 960], [62, 960], [64, 1240]]), kf(t, [[45, 1.2], [62, 1.2], [64, 1.45]]));
    outsideRoad(t, sc);
    for (const [x0, left] of [[2250, false], [2650, true]]) { const x = x0 - sc; if (x > -300 && x < 2400) roadSign(x, TFY, 'RIGHT', left); }
    const cx = carS(t), winding = (t > 50.4 && t < 51.6) || (t > 54.2 && t < 56.5) || (t > 61.9 && t < 62.5);
    const moving = (t > 45 && t < 48) || (t > 51.6 && t < 53.4) || (t > 56.5 && t < 57.6) || t > 62.5, back = t > 56.5 && t < 57.6;
    const lost = t > 63.0, tilt = lost ? .1 + Math.sin(t * 9) * .03 : 0;
    windupCar(cx, TFY, .9, t, { key: t > 54.2 && t < 56.5 ? t * 14 : winding ? t * 9 : (t > 48 && t < 50.4) ? -t * 1.5 : t * 2, moving, back, noFront: lost, tilt, wheel: moving ? t * (back ? -12 : 12) : 0 });
    if (lost) { const k = t - 63.0, wx = carS(63.0) + 63 + k * 330 - (scrollAt(t) - scrollAt(63.0)), wy = TFY - 27 - Math.abs(Math.sin(k * 9)) * 70 * (1 - seg(t, 63, 65) * .5);
      push(); translate(wx, wy); rotate(k * 12); paint(ellPts(0, 0, 29, 29, 14), { wash: '#2B2233', ink: PAL.ink, sw: 1.2 }); paint(ellPts(0, 0, 10, 10, 8), { wash: '#C9CED6', ink: null }); inkLine([[0, 0], [24, 0]], 3, '#C9CED6', 'ink', 0); pop(); }
    sirLint(cx, TFY - 130, U * .9, { ...faces(t, [[45, 'determined', { mouth: 'grin' }], [48, 'sheepish'], [51.6, 'happy', { mouth: 'grin' }], [53.4, 'sheepish'], [56.5, 'panic', { eyes: 'wide' }], [57.8, 'dazed', { eyes: 'spiral' }], [62.5, 'surprised'], [63.4, 'determined', { mouth: 'grin' }]]),
      view: 'side', flip: back, lance: .6, rot: t > 48 && t < 49 ? .12 : 0, noShadow: true, who: 'lint', boilKey: 'lint' });
    const px = pkS(t), pwalk = ss(t) > 0 || Math.abs(pkS(t + .05) - pkS(t - .05)) > .5, hop = t > 56.5 && t < 57.4 ? Math.sin(seg(t, 56.5, 57.4) * Math.PI) * .9 : 0, leftward = pkS(t + .05) < pkS(t - .05) - .3;
    hero(px, TFY, { ...faces(t, [[45, 'happy'], [53.5, 'strain', { eyes: 'squeeze' }], [56.5, 'surprised', { eyes: 'wide' }], [59.4, 'smug'], [61.6, 'neutral'], [63.4, 'surprised']]), view: 'side', flip: leftward,
      walk: pwalk ? t * 4 : undefined, dy: -hop, aR: t > 45.8 && t < 47.8 ? 1.2 : t > 54.2 && t < 56.5 ? .3 + Math.sin(t * 14) * .2 : undefined, rot: t > 54.2 && t < 56.5 ? Math.sin(t * 30) * .02 : 0, who: 'pumpkin' }, t);
    const pp = ppS(t), pw = ss(t) > 0 || Math.abs(ppS(t + .05) - ppS(t - .05)) > .5;
    mouse(pp, TFY, { ...faces(t, [[45, 'neutral'], [48.8, 'deadpan'], [57.4, 'deadpan', { browUp: .5 }], [61.4, 'smug'], [63.6, 'deadpan', { lookX: 1 }]]), view: 'side', walk: pw ? t * 5 : undefined, aR: (t > 50.4 && t < 51.6) || (t > 61.9 && t < 62.5) ? .1 + Math.sin(t * 20) * .3 : undefined, who: 'pip' });
    if (t > 63.2) burst(cx + 90, TFY - 60, 110, (t - 63.2) / .35, 8, '#FFFFFF', 3);
    camEnd();
  }

  // ============ 2-4 · 65-95 · The Sock Troll's riddles (canyon) ============
  const TX = 600;   // the troll stands at the head of the bridge
  const troll = (t, o = {}) => sockTroll(TX, BR.deck + 20 + (o.dyp || 0), U * 1.25 * (o.sc || 1), { flip: true, ...o, boilKey: 'troll' });
  const fingers = (n, t) => { for (let j = 0; j < n; j++) { const x = TX - 96 + j * 24, y = TFY - 395 - Math.sin(t * 6 + j) * 4; paint(rrPts(x - 8, y, 16, 54, 8), { wash: '#FFF8EC', ink: PAL.ink, sw: 1.4 }); inkLine([[x - 4, y + 36], [x + 4, y + 36]], 1.6, '#3E8C82', 'ink', 0); } };
  function s4(t) {
    const [, cx, z] = cutAt(t, [[65, 520, 1.5], [66, 640, 2.0], [70, 700, 1.5], [72, 640, 2.0], [76.3, 400, 2.1], [77.9, 640, 2.0], [84, 400, 2.1], [86, 640, 2.0], [90.4, 520, 1.5], [91.5, 690, 2.6], [92.5, 400, 2.1], [93.8, 640, 2.0]]);
    camC(cx, z, shake(t, 65.2, 12));
    canyon(t);
    windupCar(60, TFY, .8, t, { noFront: true, tilt: .1 });
    sirLint(60, TFY - 120, U * .8, { ...face('sheepish'), view: 'q', noShadow: true, boilKey: 'lint' });
    const sk = backOut(seg(t, 70, 70.5)); if (sk > 0) { push(); translate(TX + 290, TFY); scale(sk); translate(-(TX + 290), -TFY); riddleSign(TX + 290, TFY); pop(); }
    const gurgle = t > 90.5 && t < 92.0 ? Math.sin(t * 50) * .08 : 0;
    troll(t, { ...faces(t, [[65, 'smug', { mouth: 'smirk' }], [78, 'surprised'], [79.5, 'determined', { mouth: 'smirk' }], [86.2, 'panic', { mouth: 'O' }], [88, 'smug', { mouth: 'smirk' }], [90.5, 'surprised', { eyes: 'wide' }], [93.8, 'sheepish', { mouth: 'wobble' }]]),
      bend: gurgle * 4 + Math.sin(t * 2) * .3, sq: gurgle, tears: seg(t, 94.1, 95), who: 'troll' });
    fingers(t < 71 ? 0 : t < 72 ? 3 : t < 80 ? 1 : t < 88 ? 2 : t < 93.8 ? 3 : 0, t);
    if (t > 90.5 && t < 92) for (let i = 0; i < 3; i++) inkLine(arcPts(TX - 40, BR.deck - 150, 40 + i * 20, 20 + i * 10, 0, Math.PI, 6), 2.5, '#FFFFFF', 'ink', 0);   // the growl
    const belly = (t > 70 && t < 71) || (t > 90.5 && t < 92.9) ? { lookX: 1, lookY: .5 } : {};
    hero(330, TFY, { ...faces(t, [[65, 'neutral', { lookX: 1 }], [66, 'surprised', { eyes: 'wide', lookX: 1 }], [70, 'greedy', { lookX: 1, lookY: .5 }], [72.5, 'neutral', { lookX: 1 }], [76.5, 'sheepish', { lookX: 1 }], [78, 'happy'], [80, 'neutral', { lookX: 1 }], [83.4, 'proud'], [92.9, 'deadpan', { lookX: 1, lookY: -.3 }], [94, 'neutral', { lookX: 1 }]]), ...belly,
      view: 'q', aR: t > 83.4 && t < 85.6 ? 1.0 : -1.1, who: 'pumpkin' }, t);
    mouse(170, TFY, { ...faces(t, [[65, 'deadpan', { lookX: 1 }], [86, 'surprised', { lookX: 1 }], [87, 'deadpan', { lookX: 1 }]]), ...belly, view: 'q', who: 'pip' });
    if (t > 83.4 && t < 85.6) { paint(ellPts(440, HEAD + 40, 60, 60, 20), { wash: '#D9A35C', ink: PAL.ink, sw: 1.6 }); paint(ellPts(440, HEAD + 40, 20, 20, 12), { wash: '#272138', ink: PAL.ink, sw: 1.2 }); }   // the donut
    camEnd();
  }

  // ============ 2-5 · 95-135 · The Missing Half ============
  const stepAside = t => ease(seg(t, 130.7, 132.3));
  function s5(t) {
    const [, cx, z] = cutAt(t, [[95, 640, 2.0], [99.6, 330, 2.2], [100.7, 640, 2.0], [101.4, 330, 2.2], [102.0, 200, 2.2], [103.8, 330, 2.0], [107.3, 200, 2.2], [109.2, 640, 2.0], [112.3, 330, 1.9], [115.3, 230, 2.2], [118.6, 330, 1.9], [120.3, 520, 1.7], [124.4, 540, 1.9], [127.2, 330, 1.9], [130.2, 560, 1.6], [133, 480, 1.5]]);
    camC(cx, z);
    canyon(t);
    windupCar(60, TFY, .8, t, { noFront: true, tilt: .1 });
    sirLint(60, TFY - 120, U * .8, { ...face('sheepish'), view: 'q', noShadow: true, boilKey: 'lint' });
    const slow = t > 120.5 && t < 124.5, hug = t >= 124.5, k = ease(seg(t, 120.5, 124.5)), sa = stepAside(t);
    // the troll: sobbing, jumps for joy at 109.5, runs to his twin in slow motion, hugs and spins, then steps aside (towards the camera)
    const hop = t > 109.5 && t < 111.3 ? Math.abs(Math.sin(seg(t, 109.5, 111.3) * Math.PI * 2)) * .8 : 0, sob = t < 109.5 ? Math.sin(t * 9) * .06 : 0, spin = hug && t < 130.5 ? Math.sin((t - 124.5) * 5) * .22 : 0;
    troll(t, { ...faces(t, [[95, 'sheepish', { mouth: 'wobble' }], [109.5, 'surprised', { lookX: -1 }], [112, 'happy', { mouth: 'grin' }], [120.5, 'happy', { eyes: 'happy', mouth: 'grin' }], [127, 'happy', { eyes: 'happy' }]]),
      tears: t < 112 ? 1 : (hug ? .5 : 0), bend: t < 109 ? 1.2 : Math.sin(t * 3) * .4, sq: sob, dx: slow || hug ? -2.4 * k : 0, dyp: sa * 70, sc: 1 + sa * .12, rot: spin, dy: -hop, who: 'troll' });
    if (t > 121 && t < 128) for (let i = 0; i < 5; i++) { const h = frac(t * .6 + i / 5); paint(heartPts(TX - 190 + Math.sin(h * 6 + i) * 40, BR.deck - 260 - h * 260, 22 * (1 - h * .4)), { wash: '#E2848C', washOp: 255 * (1 - h), ink: PAL.ink, sw: 1 }); }
    // Pip thinks it through: the troll's memory of the pink sock (100.7-101.4)
    if (t > 100.7 && t < 101.4) { const bx = TX - 160, by = TFY - 470; for (const [dx, dy, r] of [[60, 120, 10], [32, 80, 16], [0, 0, 70]]) paint(ellPts(bx + dx, by + dy, r * 1.2, r, 14), { wash: '#FFFDF6', ink: PAL.ink, sw: 1.4 });
      paint([[bx - 18, by - 40], [bx + 18, by - 40], [bx + 18, by + 8], [bx + 46, by + 20], [bx + 46, by + 42], [bx - 8, by + 42], [bx - 18, by + 20]], { wash: '#F5A9B8', ink: PAL.ink, sw: 1.2, curv: .4 }); }
    // 119.0 the cape comes off: he holds it out folded (no face showing), it drops to the ground and unfolds (119.6-120.2):
    // it is the pink sock, button eyes open (120.2), the lashes blink once (120.45), then the slow-motion run (120.5)
    const cape = t < 119.0, shiver = t > 127.5 && t < 131 ? Math.sin(t * 60) * .02 : 0, back = ease(seg(t, 112.5, 114.5)) * 70 - ease(seg(t, 119, 120)) * 70;
    hero(330 - back + (t > 132 ? (t - 132) * 90 : 0), TFY, { ...faces(t, [[95, 'sheepish', { lookX: 1 }], [102.0, 'neutral', { lookX: 1 }], [104, 'determined', { mouth: 'flat' }], [107.5, 'embarrassed'], [112.5, 'sheepish'], [115.5, 'sheepish', { lookX: 1 }], [119.6, 'surprised', { eyes: 'wide', lookX: 1 }], [120.6, 'sad'], [127.5, 'soggy', { lid: .4 }], [130.5, 'happy', { blush: .7 }]]),
      view: t > 132 ? 'side' : 'q', walk: t > 132 ? t * 4 : undefined, aL: t > 104 && t < 119 ? -.2 : -1.1, aR: t > 104 && t < 119 ? -.2 : t > 119 && t < 119.5 ? .1 : t > 127.5 && t < 131 ? -.2 + Math.sin(t * 50) * .05 : -1.1, rot: shiver, who: 'pumpkin' }, t, cape);
    if (t > 127.5 && t < 131) for (let i = 0; i < 3; i++) inkLine([[290 + i * 40, HEAD + 40], [295 + i * 40, HEAD + 10]], 2.5, '#BFE4F2', 'ink', 0);   // shiver lines
    mouse(170 + (t > 132 ? (t - 132) * 100 : 0), TFY, { ...faces(t, [[95, 'sheepish', { lookX: 1 }], [100, 'deadpan', { lookX: 1 }], [107.5, 'deadpan', { lookX: 1, lid: .6 }], [115.5, 'neutral', { lookX: 1 }], [119.6, 'surprised', { lookX: 1 }], [120.6, 'happy', { eyes: 'happy' }], [127.5, 'deadpan', { lookX: 1 }], [131, 'happy']]),
      view: t > 132 ? 'side' : 'q', walk: t > 132 ? t * 5 : undefined, who: 'pip' });
    // in front of Pumpkin: the folded cape he hands over, then the pink sock that unfolds on the ground and runs to the troll
    if (t > 119.0 && t < 119.6) { push(); translate(lerp(400, 430, seg(t, 119, 119.4)), HEAD + 130 + seg(t, 119.3, 119.6) * 180); rotate(-.3 + seg(t, 119, 119.6)); capeFolded(); pop(); }
    if (t > 119.6) sockTroll(lerp(430, 470, k), BR.deck + 20 + sa * 70 - (slow ? Math.abs(Math.sin((t - 120.5) * 3)) * 14 : 0), U * 1.15 * (1 + sa * .12), { pink: true, ...face(t < 120.2 ? 'neutral' : 'happy', { eyes: t < 120.2 || (t > 120.45 && t < 120.6) ? 'closed' : t > 121.4 ? 'happy' : 'open', mouth: t < 120.2 ? 'flat' : 'smile' }), sq: t < 120.2 ? .6 * (1 - ease(seg(t, 119.6, 120.2))) : 0, rot: spin, boilKey: 'twin' });
    camEnd();
  }

  // ============ 2-6 · 135-166 · Quality Control (crossing the bridge; the collapse begins at 160) ============
  const FALL = [[0, 161.0], [1, 161.3], [2, 161.6], [3, 161.9], [4, 162.2], [5, 162.5], [6, 162.8], [7, 163.4], [8, 165.0], [9, 162.6]];
  const pk6 = t => t < 162.4 ? kf(t, [[135, 540], [137.6, 700], [143, 700], [144.5, 760], [149.2, 820], [150, 820], [153, 1000], [157, 1240], [160, 1310], [162.4, 1310]], lin) : kf(t, [[162.4, 1310], [164.9, 1450]], easeIn);
  const pp6 = t => t < 161 ? kf(t, [[135, 710], [140, 900], [148, 900], [153, 1100], [157, 1380], [160, 1450]], lin) : 1450;
  function s6(t) {
    const kx = pk6(t), z = kf(t, [[135, 1.3], [137.8, 1.3], [138.8, 1.9], [140.5, 1.9], [141.4, 1.5], [149, 1.5], [149.6, 2.0], [151, 1.5], [152, 1.8], [153, 1.8], [154, 1.3], [159.4, 1.3], [160, 1.9], [160.9, 1.9], [161.4, 1.2], [166, 1.2]]);
    camC(t > 160.9 ? 1400 : clamp(kx + (z > 1.7 ? 80 : 260), 700, 1500), z, shake(t, 152, 10, .5));
    canyon(t, { bites: [[1, kf(t, [[139.4, 0], [139.8, .5]])], [2, kf(t, [[149.4, 0], [149.9, .7]])], [7, kf(t, [[159.9, 0], [160.3, 1]])]], hair: 139.8, cracks: 152, shake: t > 152 ? 1 : 0, fall: FALL, eaten: 0 });
    // the Troll and his twin wave goodbye at the entrance (in front)
    sockTroll(BR.x0 - 70, TFY + 90, U * 1.4, { flip: true, ...face('happy', { mouth: 'grin' }), bend: Math.sin(t * 4) * .6, rot: Math.sin(t * 4) * .05, boilKey: 'troll' });
    sockTroll(BR.x0 - 190, TFY + 90, U * 1.3, { pink: true, ...face('happy', { eyes: 'happy', mouth: 'smile' }), bend: Math.sin(t * 4 + 1) * .6, rot: Math.sin(t * 4 + 1) * .05, boilKey: 'twin' });
    // Sir Lint (crooked car) leads; he wobbles when the bridge shakes
    const lx = t < 162.2 ? Math.min(pp6(t) + 260, 1500) : lerp(1500, 1900, ease(seg(t, 162.2, 163.0)));   // waits on the last plank, then just makes it
    windupCar(lx, TFY, .9, t, { noFront: true, tilt: .1 + (t > 153 && t < 156 ? Math.sin(t * 25) * .05 : 0), moving: true, wheel: t * 8 });
    sirLint(lx, TFY - 130, U * .9, { ...faces(t, [[135, 'determined', { mouth: 'grin' }], [153.4, 'panic'], [157, 'surprised'], [161, 'panic']]), view: 'side', lance: .6, noShadow: true, boilKey: 'lint' });
    // Pip: ahead; turns to scold; leaps to the far side at 161
    const leap = seg(t, 162.0, 162.9), pxp = t < 162 ? pp6(t) : lerp(1450, 1720, leap), py = TFY - Math.sin(leap * Math.PI) * 200;
    const turned = (t > 141 && t < 148.4) || t > 163.1;
    mouse(pxp, py, { ...faces(t, [[135, 'neutral'], [140.8, 'surprised'], [141.2, 'annoyed'], [145.5, 'deadpan'], [149.5, 'neutral'], [152, 'surprised', { lookX: -1 }], [155, 'deadpan', { lookX: -1 }], [161, 'panic'], [163.5, 'angry']]),
      view: 'side', flip: turned, walk: (t > 135 && t < 141) || (t > 148.4 && t < 161) ? t * 5 : undefined, aL: t > 163 ? 1.1 : undefined, aR: t > 163 ? 1.1 : undefined, who: 'pip' });
    // Pumpkin: nibbles the railing (bites at 139.5, 149.5, 160), keeps walking; the last bite brings it all down
    const run = t > 162.4 && t < 164.9, leapK = seg(t, 164.9, 165.4), air = t >= 164.9;
    const ky = air ? TFY - Math.sin(Math.min(leapK, 1) * Math.PI / 2) * 190 : TFY, kxx = air ? lerp(1450, 1505, ease(Math.min(leapK, 1))) : kx;   // hangs over the gap: well short of the far cliff (1560)
    const walking = (t < 137.6 || (t > 143 && t < 149.2) || (t > 150 && t < 160) || run) ? t * (run ? 12 : 4) : undefined;
    const chew = (t > 139.5 && t < 140.6) || (t > 149.5 && t < 150.6) || (t > 160 && t < 160.8);
    hero(kxx, ky, { ...faces(t, [[135, 'greedy', { lookX: 1, lookY: -.3 }], [138.5, 'greedy'], [139.5, 'munching'], [140.6, 'surprised', { lookX: 1 }], [143.5, 'smug'], [145.5, 'sheepish'], [147.5, 'smug'], [149.5, 'munching'], [150.6, 'surprised', { lookY: -.5 }], [152.1, 'panic', { lookY: 1 }],
      [155, 'sheepish'], [157.5, 'greedy'], [160, 'munching'], [160.8, 'surprised', { eyes: 'wide' }], [162.4, 'panic'], [164.9, 'determined', { mouth: 'grin' }], [165.75, 'surprised', { eyes: 'wide', pupil: 0 }]]), view: 'side', walk: air ? t * 14 : walking, aL: air ? 1.0 : undefined, aR: air ? 1.4 : undefined, noShadow: air,
      ...(chew ? { talk: .3 * Math.max(0, Math.sin(t * 22)) } : { who: 'pumpkin' }) }, t, false);
    crumbsMouth(kxx + 120, HEAD + 100, t, 139.5, 140.5); crumbsMouth(kxx + 120, HEAD + 100, t, 149.5, 150.5); crumbsMouth(kxx + 120, HEAD + 100, t, 160, 160.7);
    if (run) speedLines(kxx - 60, TFY - 250, 1, t, 5, 200, 260);
    if (t > 152 && t < 152.4) burst(900, TFY - 60, 150, (t - 152) / .4, 8, '#FFFFFF', 5);   // CRACK
    camEnd();
  }

  // ============ 2-7 · 166-185 · The long fall, the soda swamp, the bubble; black at 183.2 ============
  function s7(t) {
    if (t < 169.5) {   // the fall: the canyon walls rush up past him
      const k = seg(t, 166, 169.5), wall = (t - 166) * 1800;
      cam(960, 540, 1.0, [Math.sin(t * 40) * 4, 0]);
      paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#15121F', ink: null });
      for (let i = 0; i < 14; i++) { const y = ((i * 180 - wall) % 2520 + 2520) % 2520 - 720; paint(rectPts(0, y, 260, 90), { wash: '#2A2440', ink: null }); paint(rectPts(W - 260, y + 90, 260, 90), { wash: '#2A2440', ink: null }); }
      for (let i = 0; i < 10; i++) { const x = 300 + hash(i) * 1320, y = frac(hash(i + 3) + t * 2.5) * 1400 - 200; inkLine([[x, y], [x, y - 220]], 3, '#FFFFFF', 'ink', 0); }
      glow(960, 1200, 700, SODA, .4 * k);
      pumpkin(960, 700 + Math.sin(t * 3) * 30, U * 1.1, { ...faces(t, [[166, 'panic', { mouth: 'O' }], [168.6, 'surprised', { eyes: 'wide', pupil: 0 }]]), crown: true, rot: Math.sin(t * 2) * .3, aL: 1.3 + Math.sin(t * 20) * .2, aR: 1.3 + Math.cos(t * 20) * .2, armR: excalifork(0), who: 'pumpkin', noShadow: true, boilKey: 'pk' });
      camEnd(); return;
    }
    const land = 169.5;
    camT(1000, 1.5, shake(t, land, 18, .5));
    sodaSwamp(t);
    const sink = t < land + .4 ? 1 : t < 173.4 ? 1 - ease(seg(t, land + 1.2, land + 2.2)) * .62 : lerp(.38, .85, ease(seg(t, 174, 176.4)));   // goes under, then slowly surfaces
    push(); clipRects([[-900, -600, 3800, TFY - 30 + 600]], () => pumpkin(1000, TFY + 260 * sink, U, { ...faces(t, [[land, 'surprised', { eyes: 'squeeze' }], [172, 'soggy', { lid: .5 }], [176.4, 'deadpan', { lid: .5 }], [180.5, 'surprised', { eyes: 'wide' }]]), crown: true, wet: .6, aL: -.4, aR: t > 174.4 ? 1.0 : -.4, armR: excalifork(0),
      ...(t > 180.5 && t < 182.5 ? { talk: .3 } : { who: 'pumpkin' }), noShadow: true, boilKey: 'pk' })); pop();
    sodaSplash(1000, TFY - 40, (t - land) / 1.1);
    const hy = TFY + 260 * sink;   // his ground point: the head centre is 8.5u above it, the mouth a little below that
    if (t > 175) for (let i = 0; i < 7; i++) { const fx = 1000 + (i - 3) * 34 + Math.sin(t * 2 + i) * 5; paint(ellPts(fx, hy - 10.9 * U + (i % 2) * 10 + Math.abs(i - 3) * 6, 20 + (i % 3) * 6, 15, 10), { wash: '#FFF2D6', ink: PAL.ink, sw: .8 }); }   // foam on his head
    const bk = seg(t, 180.5, 182.5); if (bk > 0 && bk < 1) paint(ellPts(1040 + bk * 40, hy - 8.4 * U + 60 - bk * 50, 14 + 100 * bk, 14 + 100 * bk, 20), { wash: '#FFF2D6', washOp: 200, ink: PAL.ink, sw: 1.4 });   // the huge bubble from his mouth
    burst(1080, hy - 8.4 * U + 30, 150, (t - 182.5) / .3, 10, '#FFFFFF', 4);
    if (t > 182.6) for (let i = 0; i < 9; i++) { const bx = 1000 + (hash(i) - .5) * 220, by = hy - 8.4 * U - 40 + (hash(i + 4) - .5) * 160; paint(ellPts(bx, by, 9 + hash(i + 2) * 10, 9 + hash(i + 2) * 10, 10), { wash: '#FFF8EA', washOp: 210, ink: PAL.ink, sw: .7 }); }   // little bubbles all over his head
    camEnd();
    if (t > 174.0) { const k = backOut(seg(t, 174.0, 174.5)); push(); translate(1500, 70 - (1 - k) * 80); scale(.5, .5); pip(0, 0, 40, { ...face(t > 182.6 ? 'annoyed' : t > 178 ? 'deadpan' : 'surprised', { lookY: 1, lid: t > 182.6 ? .55 : 0 }), noShadow: true, boilKey: 'pipt' }); pop(); }
    const dark = seg(t, 183.2, 184.2); if (dark > 0) { CTX.save(); CTX.setTransform(1, 0, 0, 1, 0, 0); CTX.fillStyle = `rgba(0,0,0,${dark})`; CTX.fillRect(0, 0, W, H); CTX.restore(); }
  }

  // the sock cape folded in his paws: pink and striped, the face side folded in
  const capeFolded = () => { const C = LOST.sockPink; paint(rrPts(-70, -40, 140, 80, 18), { wash: C[2], ink: null }); clipPoly(rrPts(-70, -40, 140, 80, 18), () => bands(-80, 80, -45, 45, 6, [C[0], C[2], C[1], C[2]])); paint(rrPts(-70, -40, 140, 80, 18), { ink: PAL.ink, sw: 1.4 }); inkLine([[-60, 4], [60, 0]], 1.4, LOST.sockPinkDk, 'ink', .3); };
  const heartPts = (x, y, r) => { const P = []; for (let i = 0; i < 24; i++) { const a = i / 24 * TAU; P.push([x + r * 16 * Math.pow(Math.sin(a), 3) / 16, y - r * (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) / 16]); } return P; };
  shots([[0, t => introTitles(t, 'CHAPTER 2', 'THE SOCK BRIDGE')], [5, s1], [20, s2], [45, s3], [65, s4], [95, s5], [135, s6], [166, s7],
         [185, t => chapterEnd(t, 185, ['CHAPTER 3', 'THE FIZZY SWAMP'], 'none', /guides/.test(location.search))]]);
})();
