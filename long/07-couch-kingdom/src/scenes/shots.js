// shots.js: chapter 1 "The Chosen One" of long/07 "The Kingdom Under the Couch" (180 s + End Screen 20 s, 1920 x 1080).
// See STORYBOARD.md. Real world: the sofa face-on. Under it: dark. The slide runs DOWN. Lostland: everything left <-> right on
// the ground line TFY; Pumpkin lands mid-square (x 960) on a matchbox house; Lostland's folk come from the left.
(() => {
  const U = 40, PKX = 960, cam = (cx, cy, z, sh = [0, 0]) => camBegin(cx + sh[0], cy + sh[1], z);
  const shake = (t, t0, amp = 10, dur = .35) => t > t0 && t < t0 + dur ? [Math.sin(t * 90) * amp * (1 - (t - t0) / dur), Math.cos(t * 77) * amp * .6 * (1 - (t - t0) / dur)] : [0, 0];
  const PIPX = 1170, HEAD = TFY - 338;   // HEAD: the top of Pumpkin's head while he sits squashed (sq .22)
  const camT = (cx, z, sh = [0, 0], up = 0) => cam(cx, TFY - 445 / z - up, z, sh);   // where Pip stands in the square from 50 s
  // the crowd of Lostland: [kind, x, seed]. They pop out of the houses at 66.5-69 and kneel at 69.
  const CROWD = [['bunny', 120, 1], ['btn', 250, 0], ['bunny', 360, 2], ['bunny', 500, 3], ['btn', 610, 1], ['bunny', 1330, 4], ['btn', 1440, 2], ['bunny', 1560, 5], ['bunny', 1660, 6], ['btn', 1780, 0], ['bunny', 1860, 7]];
  function crowd(t, o = {}) {
    CROWD.forEach(([k, x, sd], i) => {
      const out = seg(t, 66.6 + i * .2, 66.9 + i * .2); if (out <= 0) return;
      const kneel = o.kneel ? seg(t, 69 + i * .05, 69.3 + i * .05) : 0, cheer = o.cheer ? Math.abs(Math.sin(t * 9 + i)) : 0, flee = o.flee ? seg(t, o.flee + i * .05, o.flee + .6 + i * .05) : 0;
      if (flee >= 1) return;
      const fx = x + (x < PKX ? -1 : 1) * 900 * easeIn(flee), dy = -backOut(out) * 0 - cheer * .6 + (1 - out) * 3;
      const ff = { ...face(o.flee && flee > 0 ? 'panic' : kneel > 0 ? 'happy' : 'surprised'), lookX: x < PKX ? 1 : -1 };
      if (k === 'bunny') dustBunny(fx, TFY, U, { ...ff, seed: sd, sq: .25 * kneel, dy, hop: !!o.flee, boilKey: 'cb' + i });
      else buttonFolk(fx, TFY, U, { ...ff, sq: .2 * kneel, rot: -.25 * kneel * (x < PKX ? -1 : 1), dy, aL: cheer ? 1.2 : -.9, aR: cheer ? 1.2 : -.9, seed: sd, boilKey: 'cf' + i });
    });
  }

  // 1-01 · 0–12 · HOOK: dark under the sofa; eyes blink open; whispers. "Is he bringing snacks?" Then an orange paw comes
  // down through the slit of light (9.5) and gropes about... cut up.
  function s01(t) {
    cam(960, 560, lerp(1.0, 1.15, t / 12));
    underDark(t, seg(t, 0, 3));
    if (t > 8.6) { const k = ease(seg(t, 8.6, 10)); push(); translate(960, -60 + k * 340); rotate(Math.sin(t * 5) * .15); paint(ribbon([[0, -400], [0, -100], [10, 0]], 150, 120), { wash: PUMPKIN_COL.col, ink: PAL.ink, sw: 2.5 }); paint(ellPts(10, 10, 80, 60, 16), { wash: PUMPKIN_COL.col, ink: PAL.ink, sw: 2.5 }); for (const d of [-1, 0, 1]) inkLine([[10 + d * 30, 40], [10 + d * 30, 60]], 2, PAL.ink, 'ink', 0); pop(); }
    camEnd();
  }

  // the cushion gap swallowing his forearm: the cushion tops drawn back over the paw, a dark slit, strain lines
  const forearm = (u, sw) => paint(ribbon([[-.2 * u, 0], [2.6 * u, 0]], 1.25 * u, 1.1 * u), { wash: PUMPKIN_COL.col, ink: PAL.ink, sw: sw * .85 });   // the arm, stretched on into the gap
  function gapOverPaw(t, tug = 0) {
    paint(rrPts(912, 625, 140, 132, 14), { wash: CK.sofaLt, ink: null });
    paint(rectPts(948, 628, 24, 117), { wash: CK.dark, ink: null });
    inkLine([[912, 628], [1052, 628]], 2.5, PAL.ink, 'ink', .3);
    if (Math.abs(tug) > .02) for (const d of [-1, 1]) inkLine([[960 + d * 40, 615], [960 + d * 70, 595]], 3, '#FFFFFF', 'ink', 0);
  }
  // 1-02 · 12–21 · The sofa. Pumpkin, arm deep in the cushion gap, tongue out. Pip on the cushion beside him.
  // "Pip. I found the cracker." "Great. Pull it out." "...The cracker found ME." (his arm is stuck)
  function s02(t) {
    cam(1030, 470, 1.35);
    couchSet(t);
    const tug = t > 18.2 ? Math.sin(t * 14) * .08 : 0;
    pumpkin(700, 770, U * 1.15, { ...faces(t, [[12, 'greedy', { lookX: .6, lookY: 1, mouth: 'grin' }], [13.4, 'proud'], [17.4, 'neutral', { lookY: 1 }], [17.9, 'panic', { lookY: 1 }]]), view: 'q',
      aR: -1.08 + tug * .3, armR: forearm, rot: tug * .3, who: 'pumpkin', boilKey: 'pk' });
    gapOverPaw(t, tug);
    pip(1220, 700, U * 1.15, { ...faces(t, [[12, 'neutral', { lookX: -1 }], [15.5, 'deadpan', { lookX: -1 }], [18.6, 'surprised', { lookX: -1 }]]), view: 'q', flip: true, aL: -.6, aR: -.6, who: 'pip', boilKey: 'pip' });
    camEnd();
  }

  // 1-03 · 21–28 · Pip braces and pulls his tail... POP! Pumpkin is sucked down into the gap, tail last. Pip, still holding the
  // tail, goes too: "Not again!" The cushions boing shut. A beat. A lone cracker pops out of the gap.
  function s03(t) {
    cam(1030, 470, 1.35, shake(t, 22.6, 14));
    couchSet(t);
    const pop1 = 22.6, gone = seg(t, pop1, pop1 + .45), pipGo = seg(t, 24.2, 24.65), GAP = [960, 660];
    const pull = t < pop1 ? Math.sin(t * 12) : 0;
    const tailTip = [935, 470], pipHands = [lerp(1080, 1180, seg(t, 21, 21.6)) + pull * 8, 650];
    // Pumpkin: arm in the gap; at the pop he is sucked in (shrinks and spins into the slit)
    if (gone < 1) {
      const k = easeIn(gone), sc = 1 - k * .97, x = lerp(700, GAP[0], k), y = lerp(770, GAP[1] + 6 * U * 1.15 * sc, k);   // his middle goes to the slit as he shrinks
      pumpkin(x, y, U * 1.15 * sc, { ...faces(t, [[21, 'strain', { eyes: 'squeeze' }], [pop1, 'surprised', { eyes: 'wide', pupil: 0 }]]), view: 'q', rot: pull * .03,
        aR: -1.08, armR: k < .1 ? forearm : undefined, sq: -.3 * k, noShadow: k > 0, boilKey: 'pk' });
      if (k < .1) gapOverPaw(t, .1);
      // the stretched tail, from his tail tip to Pip's paws, like a rubber band
      if (t < pop1) paint(ribbon([tailTip, [lerp(tailTip[0], pipHands[0], .5), lerp(tailTip[1], pipHands[1], .5) - 30 - pull * 10], pipHands], 40, 34), { wash: PUMPKIN_COL.col, ink: PAL.ink, sw: 2.2 });
    }
    // Pip: braced, pulling; then yanked after him into the gap
    if (pipGo < 1) {
      const pre = t < 24.2, k = easeIn(pipGo);
      const px = pre ? (t < pop1 ? pipHands[0] + 70 : lerp(pipHands[0] + 70, 1010, ease(seg(t, pop1, 23.9)))) : lerp(1010, GAP[0], k);
      const sc = 1 - k * .95, py = pre ? 770 : lerp(770, GAP[1] + 3 * U * 1.15 * sc, k);
      if (gone > .1) { paint(rrPts(912, 625, 140, 132, 14), { wash: CK.sofaLt, ink: null }); paint(rectPts(948, 628, 24, 117), { wash: CK.dark, ink: null }); }
      pip(px, py, U * 1.15 * sc, { ...faces(t, [[21, 'strain'], [pop1, 'surprised', { eyes: 'wide' }], [23.5, 'panic']]), view: 'q', flip: true,
        rot: t < pop1 ? .35 : pre ? -.2 * seg(t, pop1, 23.9) : -.6 * k, aL: 1.0, aR: 1.0, sq: t < pop1 ? .08 + pull * .02 : 0, who: 'pip', noShadow: !pre || t > 23.8, boilKey: 'pip' });
      if (t > pop1 && pre) paint(ribbon([[GAP[0], GAP[1] - 20], [lerp(GAP[0], px - 40, .5), GAP[1] - 60], [px - 40, py - 120]], 26, 22), { wash: PUMPKIN_COL.col, ink: PAL.ink, sw: 2 });   // the tail end he's still holding, vanishing into the gap
    }
    // the cushions boing shut; a lone cracker pops back out
    const bo = t > 24.65 ? Math.sin((t - 24.65) * 20) * Math.exp(-(t - 24.65) * 5) * 12 : 0;
    if (pipGo >= 1) { paint(rrPts(912, 625 - bo, 140, 132, 14), { wash: CK.sofaLt, ink: null }); paint(rectPts(948, 628 - bo, 24, 117), { wash: CK.dark, ink: null }); }
    if (t > 26.5) { const k = seg(t, 26.5, 27.1); const p = arcPt([960, 640], [1110, 600], 160, k); crackerP(p[0], p[1], k * 8, 1.4); }
    burst(GAP[0], GAP[1], 180, (t - pop1) / .4, 10, '#FFFFFF', 2);
    burst(GAP[0], GAP[1], 120, (t - 24.65) / .35, 8, '#FFFFFF', 3);
    camEnd();
  }

  // 1-04 · 28–45 · The slide! Down through the lost things. Pumpkin screams, stops to snap up a passing chip, CRUNCH, screams
  // again on the same note. A sign: "LOST PENS 40 KM". Pip, sliding behind: "So that's where they go." Light below...
  function s04(t) {
    const lt = t - 28, s = lt * 520;
    cam(960, 540 + Math.sin(t * 3) * 10, 1.0, [Math.sin(t * 30) * 3, 0]);
    slideTunnel(t, s);
    slideJunk(t, s);
    // the sign
    const sy = 1300 - (t - 36.2) * 520; if (t > 36 && t < 40) { paint(rectPts(1440, sy - 10, 14, 320), { wash: '#B98157', ink: PAL.ink, sw: 1.2 }); paint(rrPts(1320, sy - 120, 360, 120, 12), { wash: '#F6EBDA', ink: PAL.ink, sw: 1.6 }); letter('LOST PENS', 1500, sy - 82, 40, '#2B2233', { font: '800 40px "Baloo 2", sans-serif', ink: false }); letter('40 KM  ↓', 1500, sy - 36, 36, '#C8363F', { font: '800 36px "Baloo 2", sans-serif', ink: false }); }
    // Pumpkin, head first down the chute (rotated), wobbling
    const chomp = t > 33.8 && t < 35.4;
    const cx = 960 + Math.sin(t * 2.2) * 120, cy = 560 + Math.sin(t * 1.3) * 40;
    if (t > 33.2 && t < 33.9) chip(lerp(1500, cx + 40, seg(t, 33.2, 33.85)), lerp(260, cy + 120, seg(t, 33.2, 33.85)), t * 6, 1.6);
    pumpkin(cx, cy - 250, U * 1.1, { ...faces(t, [[28, 'panic', { mouth: 'O' }], [33.8, 'munching'], [35.4, 'panic', { mouth: 'O' }]]), rot: Math.PI + Math.sin(t * 4) * .2, aL: 1.3 + Math.sin(t * 20) * .2, aR: 1.3 + Math.cos(t * 20) * .2,
      ...(chomp ? { talk: .3 * Math.max(0, Math.sin(t * 25)) } : { who: 'pumpkin', talk: t < 33.8 || t > 35.4 ? .8 + .2 * Math.sin(t * 30) : 0 }), noShadow: true, boilKey: 'pk' });
    if (chomp) for (let i = 0; i < 4; i++) { const k = frac((t - 33.8) * 2 + i / 4); paint(ellPts(cx + 60 + i * 10, cy + 200 - k * 300, 7, 5, 6), { wash: '#F2C14E', ink: null }); }
    // Pip: from 38.5 a little way behind, deadpan, arms folded
    if (t > 38.5) { const k = ease(seg(t, 38.5, 39.3)); pip(cx - 330 + Math.sin(t * 2) * 30, lerp(-200, cy - 60, k), U * 1.1, { ...face('deadpan', { lookX: 1 }), rot: Math.PI * .1, aL: .1, aR: .1, scarfWind: 1, who: 'pip', noShadow: true, boilKey: 'pip' }); }
    // light rising from below near the end
    if (t > 43) paint(rectPts(-400, 1080 - (t - 43) * 600, 2800, 2000), { wash: CK.glow, washOp: 255 * seg(t, 43.5, 45), ink: null });
    camEnd();
  }

  // 1-05 · 45–51 · Lostland. Pumpkin drops out of the sky onto a matchbox house: SQUASH. Pip lands on his head, boing.
  // Silence. A tiny voice from under his bottom: "My house!" Pumpkin: "...Your house is very comfy."
  function s05(t) {
    const land = 45.6, k = Math.exp(-(t - land) * 6);
    camT(980, 1.4, shake(t, land, 22, .6));
    townSquare(t, { squash: ease(seg(t, land, land + .15)) });
    const py = t < land ? lerp(-600, TFY, easeIn(seg(t, 45, land))) : TFY;
    pumpkin(PKX, py, U, { ...faces(t, [[45, 'panic'], [land, 'dazed', { eyes: 'squeeze' }], [46.6, 'surprised', { lookY: .4 }], [47.7, 'sheepish', { lookY: 1, lookX: -.3 }]]), sq: t > land ? .22 + .15 * k * Math.cos((t - land) * 22) : -.2, noShadow: t < land, who: 'pumpkin', boilKey: 'pk' });
    // Pip lands on his head at 46.2, bounces, sits there
    const hy = HEAD, pl = 46.2;
    if (t > 45.5) { const y = t < pl ? lerp(-400, hy, easeIn(seg(t, 45.5, pl))) : hy - Math.abs(Math.sin((t - pl) * 9)) * Math.exp(-(t - pl) * 4) * 120; pip(PKX + 30, y, U, { ...faces(t, [[45.5, 'panic'], [pl, 'dazed'], [47.2, 'deadpan', { lookY: 1 }]]), view: 'q', sq: t > pl && t < pl + .2 ? .3 : 0, noShadow: true, boilKey: 'pip' }); }
    burst(PKX, TFY - 30, 300, (t - land) / .5, 14, '#FFFFFF', 3);
    if (t > land) puffCloud(PKX, TFY - 30, 300, (t - land) * .9);
    if (t > 47.3 && t < 48.6) for (let i = 0; i < 3; i++) inkLine([[PKX - 90 + i * 90, TFY - 10], [PKX - 100 + i * 90, TFY - 40]], 3, '#FFFFFF', 'ink', 0);   // squeak lines from under him
    camEnd();
  }

  // 1-06 · 51–62 · Sir Lint charges in from the left on foot, lance down: "Halt, beast! I am Sir Lint, defender of..." He
  // sneezes: half of him puffs away. "...of Lostland!" Pumpkin leans down, nose to lance. The lance pokes his nose.
  function s06(t) {
    const ach = 56.5, poke = 60.2;
    const lx = lerp(-100, 640, ease(seg(t, 51, 52.6))), lean = ease(seg(t, 58.8, 59.8));
    camT(lerp(820, 800, lean), lerp(1.55, 1.9, lean), shake(t, ach, 8), lean * 40);
    townSquare(t, { squash: 1 });
    pumpkin(PKX, TFY, U, { ...faces(t, [[51, 'sheepish', { lookX: -1 }], [53, 'surprised', { lookX: -1 }], [poke, 'squeeze', { eyes: 'squeeze', mouth: 'O' }], [61, 'neutral', { lookX: -1, lookY: .5 }]]), view: 'q', flip: true, sq: .22, rot: -.35 * lean, aL: -1.2, aR: -1.2, boilKey: 'pk' });
    { const hop = seg(t, 61.0, 61.6), p = arcPt([PKX + 30, HEAD + lean * 60], [PIPX, TFY], 160, ease(hop)); pip(p[0], p[1], U, { ...face(hop > 0 ? 'surprised' : 'deadpan', { lookX: -1, lookY: 1 }), view: 'q', flip: true, rot: hop > 0 && hop < 1 ? -hop * 6 : -.35 * lean * (1 - hop), sq: hop <= 0 ? .2 : 0, noShadow: hop < 1, boilKey: 'pip' }); }
    const poof = t > ach ? Math.exp(-(t - ach) * .9) * (t < ach + .2 ? seg(t, ach, ach + .2) : 1) : 0;
    sirLint(lx, TFY, U * 1.1, { ...faces(t, [[51, 'determined', { mouth: 'grin' }], [ach - .4, 'strain', { eyes: 'squeeze' }], [ach + .5, 'determined', { blush: .5 }], [poke + .2, 'surprised']]),
      view: t < 52.6 ? 'side' : 'q', walk: t < 52.6 ? t * 5 : null, lance: t < 52.6 ? 1.2 : lerp(1.2, 1.5, seg(t, 59, poke)), poof, dy: t < 52.6 ? -Math.abs(Math.sin(t * 10)) * .3 : 0, who: 'lint', boilKey: 'lint' });
    burst(lx + 100, TFY - 400, 80, (t - poke) / .3, 8, '#FFFFFF', 4);
    camEnd();
  }

  // 1-07 · 62–80 · Sir Lint looks up... and up... ORANGE. He drops his lance: "...The Chosen One." The whole town pops out of the
  // houses and kneels. Pumpkin turns to see who's behind him. Pip: "Oh no. They're nice. This is worse."
  function s07(t) {
    const drop = 65.6;
    const z = t < 66.4 ? 1.9 : lerp(1.9, 1.15, ease(seg(t, 66.4, 67.6))), cx0 = t < 66.4 ? 760 : lerp(760, 960, ease(seg(t, 66.4, 67.6)));
    if (t > 72.4 && t < 76) camT(1110, 2.0); else camT(cx0, z);
    townSquare(t, { squash: 1 });
    crowd(t, { kneel: true });
    const turn = t > 70.4 && t < 72.2;
    pumpkin(PKX, TFY, U, { ...faces(t, [[62, 'neutral', { lookX: -1, lookY: .5 }], [67, 'surprised', { lookX: -1 }], [69.4, 'sheepish', { lookX: 1 }], [72.2, 'sheepish', { lookX: -1, mouth: 'smile' }]]), view: turn ? 'q' : 'front', flip: false, sq: .22, aL: -1.2, aR: -1.2, boilKey: 'pk' });
    pip(PIPX, TFY, U, { ...faces(t, [[62, 'deadpan', { lookX: -1 }], [72.8, 'sheepish', { lookX: -1 }], [75.6, 'deadpan']]), view: 'q', flip: true, aL: -.6, aR: -.6, who: 'pip', boilKey: 'pip' });
    const kneel = seg(t, 67.0, 67.4);
    sirLint(640, TFY, U * 1.1, { ...faces(t, [[62, 'surprised', { lookY: -1, lookX: 1 }], [64.4, 'surprised', { lookY: -1, eyes: 'wide', pupil: .2 }], [66.2, 'happy', { blush: .6 }]]), view: 'q', sq: .2 * kneel, rot: .25 * kneel, lance: t < drop ? 1.5 : 1.5 + 1.4 * easeIn(seg(t, drop, drop + .4)), who: 'lint', boilKey: 'lint' });
    camEnd();
  }

  // 1-08 · 80–108 · Queen Button arrives (bunny trumpets). "Behold! The Ancient Scroll!" — it unrolls, and unrolls, across the
  // square. "That's a receipt." "The Ancient RECEIPT!" ... the drawing: a cheese puff. "Then explain THAT!" — whip to Pumpkin,
  // who has just pulled a cheese puff out of his vest and is about to eat it. "...I can't."
  function s08(t) {
    const qx = lerp(-150, 560, ease(seg(t, 80, 83))), unroll = ease(seg(t, 86.6, 89.5));
    const whip = seg(t, 100.4, 100.8), cuPuff = t > 94.8 && t < 97.5;
    let cx = 820, z = 1.3;
    if (t > 89.2 && t < 90.8) { cx = 1110; z = 2.0; }            // Pip, deadpan
    if (t > 97.5 && t < 100.4) { cx = 1110; z = 2.0; }
    if (t >= 100.4) { cx = lerp(640, 900, ease(whip)); z = lerp(1.6, 1.7, whip); }
    camT(cx, z, [Math.sin(whip * Math.PI) * 300, 0]);
    townSquare(t, { squash: 1 });
    crowd(t, { kneel: true });
    // the receipt runs from the Queen's hand out along the ground to the right
    if (t > 86.4) receipt(qx + 90, TFY - 200, 120 + unroll * 700, t * .5);
    queenButton(qx, TFY, U, { ...faces(t, [[80, 'proud'], [86, 'happy', { mouth: 'grin' }], [89.5, 'annoyed'], [91, 'proud', { mouth: 'grin' }], [93.6, 'neutral', { brow: .3 }], [100.4, 'determined', { mouth: 'grin' }], [104.6, 'proud']]),
      aL: t > 86.4 && t < 99 ? .4 : -.9, aR: t > 100.4 && t < 103 ? .9 : .5, view: t > 100.4 ? 'q' : 'front', who: 'queen', boilKey: 'queen' });
    // the cheese puff he finds in his vest at 99.5 and is about to eat when the Queen points
    const holding = t > 99.3;
    pumpkin(PKX, TFY, U, { ...faces(t, [[80, 'neutral', { lookX: -1 }], [87, 'surprised', { lookX: -1, lookY: .5 }], [99.3, 'greedy', { lookY: .5 }], [100.8, 'surprised', { eyes: 'wide', lookX: -1 }], [102.4, 'sheepish', { lookX: -1 }]]),
      sq: .22, aL: holding ? .45 : -1.2, armL: holding ? (u, sw) => cheesePuff(1.2 * u, 0, .3, .55) : undefined, boilKey: 'pk' });
    pip(PIPX, TFY, U, { ...faces(t, [[80, 'deadpan', { lookX: -1 }], [96, 'deadpan', { lookX: -1, browUp: .4 }], [101, 'surprised', { lookX: -1 }], [103.6, 'sheepish', { lookX: -1 }]]), view: 'q', flip: true, aL: t > 97.4 && t < 99 ? .6 : -.6, aR: -.6, who: 'pip', boilKey: 'pip' });
    sirLint(250, TFY, U, { ...face('happy', { lookX: 1 }), view: 'q', sq: .2, rot: .25, lance: 2.9, boilKey: 'lint' });
    for (let i = 0; i < 2; i++) if (t < 84) { const x = qx - 220 - i * 120; dustBunny(x, TFY, U, { ...face('happy'), seed: 8 + i, hop: true, boilKey: 'tb' + i }); paint([[x + 20, TFY - 150], [x + 110, TFY - 190], [x + 110, TFY - 130]], { wash: CK.coin, ink: PAL.ink, sw: 1.2 }); }   // trumpets
    camEnd();
    if (cuPuff) {   // insert: the end of the receipt, full frame — the prophecy is a doodle of a cheese puff
      paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#FFFDF6', ink: null });
      for (let i = 0; i < 5; i++) inkLine([[300, 90 + i * 34], [1620 - (i % 2) * 300, 90 + i * 34]], 6, '#D8D1C4', 'ink', 0);
      letter('THE ORANGE ONE', W / 2, 330, 90, '#2B2233', { font: '800 90px "Baloo 2", sans-serif', ink: false, rot: -.03 });
      letter('SHALL SLAY THE DRAGON', W / 2, 430, 64, '#B23A44', { font: '800 64px "Baloo 2", sans-serif', ink: false, rot: .02 });
      cheesePuff(W / 2, 680, -.08 + Math.sin(t * 2) * .02, 5);
      for (const [x, y] of [[520, 600], [1420, 760]]) paint(starPts(x, y, 30, .4, 5), { wash: '#F2C14E', ink: PAL.ink, sw: 1.4 });
      paint(rectPts(-10, 980, W + 20, 120), { wash: '#F1EAD8', ink: null });
    }
  }

  // 1-09 · 108–130 · The ceremony. Bunnies stack up to crown him (bottle cap). "Rise, hero! Take... Excalifork!" — a fork stuck in
  // a marshmallow. He pulls: SHLOOP. "It's a fork." "It is EXCALI-fork." The crown slips over his eyes: "I've gone blind with
  // power." The bunnies tie the sock cape on. He poses. Cheers.
  function s09(t) {
    const crownOn = 110.0, pull = seg(t, 113.4, 114.2), slip = ease(seg(t, 119.8, 120.4)) * (1 - ease(seg(t, 123.4, 123.8))), cape = ease(seg(t, 124.5, 125.5));
    if (t > 119.6 && t < 123.8) cam(PKX, HEAD + 150, 2.6);        // close on the slipped crown
    else if (t > 114.8 && t < 118.6) camT(1050, 1.8);
    else camT(860, 1.3);
    townSquare(t, { squash: 1 });
    crowd(t, { kneel: t < 126, cheer: t > 126 });
    if (cape > 0) sockCape(PKX, TFY, U, { wind: t > 126 ? .4 : 0, dy: (1 - cape) * -3 });
    const hasFork = pull > 0;
    pumpkin(PKX, TFY, U, { ...faces(t, [[108, 'sheepish'], [crownOn, 'surprised', { lookY: -1 }], [111.4, 'happy'], [113.4, 'strain', { eyes: 'squeeze' }], [114.4, 'deadpan', { lookX: 1 }], [117.4, 'neutral'], [120.2, 'proud', { mouth: 'grin' }], [125.6, 'determined', { mouth: 'grin' }]]),
      crown: t > crownOn ? { slip } : false, sq: t < 112.8 ? .22 : 0, aR: hasFork ? (t > 125.6 ? 1.2 : lerp(-.4, .6, ease(pull))) : -1.2, aL: t > 125.6 ? .8 : -1.2,
      armR: hasFork ? excalifork(t > 125.6 ? .8 : 0) : undefined, who: 'pumpkin', boilKey: 'pk' });
    // the stack of bunnies carrying the crown up (108-110)
    if (t < crownOn + .3) { const k = ease(seg(t, 108, crownOn)); for (let i = 0; i < 4; i++) dustBunny(PKX - 330 + i * 0, TFY - i * k * 95, U * .9, { ...face('strain'), seed: 11 + i, noShadow: i > 0, boilKey: 'st' + i }); if (t < crownOn) castCrown(PKX - 330, TFY - 4 * 95 * k - 60, U, true, 2); }
    // the marshmallow stone at his right, until he pulls the fork out
    if (t > 111 && pull < 1) marshmallowStone(PKX + 300, TFY, pull, t);
    else if (t > 111 && t < 118) marshmallowStone(PKX + 300, TFY, 1, t);
    queenButton(560, TFY, U, { ...faces(t, [[108, 'proud'], [110.8, 'happy', { mouth: 'grin' }], [114.6, 'neutral'], [116.6, 'annoyed', { mouth: 'flat' }], [118.4, 'proud']]), aR: t > 110.8 && t < 113 ? .9 : .5, who: 'queen', boilKey: 'queen' });
    pip(PIPX + 120, TFY, U, { ...faces(t, [[108, 'deadpan', { lookX: -1 }], [121, 'sheepish', { lookX: -1 }], [126, 'deadpan', { lookX: -1 }]]), view: 'q', flip: true, aL: -.6, aR: -.6, boilKey: 'pip' });
    burst(PKX + 300, TFY - 160, 160, (t - 113.8) / .4, 10, '#FFFFFF', 5);
    camEnd();
  }

  // 1-10 · 130–155 · First magic. A wave of Excalifork: "Abraca... dinner?" A pebble becomes a cracker: POP. He eats it. "OOOOH."
  // A second wave zaps Sir Lint's shield: it's a cookie now. He eats that too. "My shield!" "Very brave shield." The crowd lifts
  // him up; Pip looks at us.
  function s10(t) {
    const z1 = 137.0, z2 = 143.3, lift = ease(seg(t, 150, 151.2));
    if (t > 145.8 && t < 149.8) camT(760, 1.9); else camT(900, 1.3, [0, 0], lift * 90);
    townSquare(t, { squash: 1 });
    crowd(t, { cheer: t > 140 });
    sockCape(PKX, TFY - lift * 120, U, { wind: .3 });
    const wave = (t > 131.5 && t < 137.2) || (t > 142 && t < 143.4);
    const eat1 = t > 138.4 && t < 139.6, eat2 = t > 144.6 && t < 146;
    pumpkin(PKX, TFY - lift * 120, U, { ...faces(t, [[130, 'determined'], [134.8, 'neutral', { lookY: .5 }], [z1, 'surprised', { lookX: 1, lookY: .5 }], [138.4, 'munching'], [139.6, 'proud'], [142, 'determined'], [z2, 'surprised', { lookX: -1 }], [144.6, 'munching'], [146, 'sheepish', { lookX: -1 }], [150, 'happy', { mouth: 'grin' }]]),
      crown: true, aR: wave ? .9 + Math.sin(t * 9) * .35 : eat1 || eat2 ? 1.6 : .4, armR: excalifork(wave ? 1 : 0), aL: eat1 || eat2 ? 1.6 : -1.1, noShadow: lift > 0,
      ...(eat1 || eat2 ? { talk: .3 * Math.max(0, Math.sin(t * 25)) } : { who: 'pumpkin' }), boilKey: 'pk' });
    // the pebble (right) -> cracker; the shield -> cookie
    if (t < z1) pebble(PKX + 260, TFY); else if (t < 138.4) { const k = seg(t, z1, 138.4); const p = arcPt([PKX + 260, TFY - 30], [PKX - 10, TFY - 330], 200, ease(k)); crackerP(p[0], p[1], k * 6, 1.2); }
    burst(PKX + 260, TFY - 30, 150, (t - z1) / .4, 10, '#FFE27A', 6);
    if (wave) { const a = .9 + Math.sin(t * 9) * .35; for (let i = 0; i < 6; i++) { const k = frac(t * 2 + i / 6); paint(starPts(PKX + 140 + Math.cos(a) * 260 * k + 100, TFY - 260 - Math.sin(a) * 260 * k, 12 * (1 - k), .4, 4), { wash: '#FFE27A', ink: null }); } }
    // Sir Lint at the left with his shield, then without
    const shieldGone = t > z2;
    sirLint(700, TFY, U * 1.1, { ...faces(t, [[130, 'happy'], [z2, 'surprised', { eyes: 'wide' }], [145.6, 'panic', { mouth: 'O' }], [148.4, 'sheepish']]), view: 'q', who: 'lint', boilKey: 'lint', ...(shieldGone ? { noShield: true } : {}) });
    if (shieldGone && t < 144.6) { const k = seg(t, z2 + .2, 144.5); const p = arcPt([640, TFY - 90], [PKX - 10, TFY - 330], 220, ease(k)); cookieP(p[0], p[1], k * 6, 1.1); }
    burst(640, TFY - 90, 120, (t - z2) / .4, 10, '#FFE27A', 7);
    // the crowd carries him (bunnies under his feet)
    if (lift > 0) for (let i = 0; i < 5; i++) dustBunny(PKX - 160 + i * 80, TFY, U * .9, { ...face('happy', { eyes: 'happy' }), seed: 20 + i, dy: -Math.abs(Math.sin(t * 9 + i)) * .3, boilKey: 'lb' + i });
    pip(PIPX + 120, TFY, U, { ...faces(t, [[130, 'deadpan', { lookX: -1 }], [139, 'deadpan', { lookX: -1, browUp: .5 }], [152, 'deadpan', { lookX: 0, lookY: 0 }]]), view: t > 152 ? 'front' : 'q', flip: t < 152, aL: -.6, aR: -.6, boilKey: 'pip' });
    camEnd();
  }

  // 1-11 · 155–180 · BOOM... BOOM. The lamps sway. A rumbling, sucking roar. Two huge red eyes far off in the dark. "The Dragon
  // wakes!" Everyone scatters. Pumpkin dives behind tiny Pip. "You're hiding behind ME?" "You're the brave one. I'm the...
  // snack one." The red glare sweeps over them... and turns away. Title card: CHAPTER 2 · THE SOCK BRIDGE.
  function s11(t) {
    if (t > 177.6) { titleCard(t, 'CHAPTER 2', 'THE SOCK BRIDGE', ease(seg(t, 178, 178.6))); return; }
    const thumps = [155.4, 156.8, 158.0], sh = thumps.reduce((a, b) => { const v = shake(t, b, 16, .4); return [a[0] + v[0], a[1] + v[1]]; }, [0, 0]);
    const close = t > 165.6;
    if (close) camT(1230, 1.9, sh); else camT(1000, 1.15, sh, 60);
    const sweep = t > 171 && t < 175 ? Math.sin(seg(t, 171, 175) * Math.PI) : 0;
    townSquare(t, { squash: 1, dark: .55 * seg(t, 158, 160) * (1 - sweep * .6) });
    dragonEyes(1500 - (t > 174.5 ? (t - 174.5) * 600 : 0), 300, seg(t, 158.6, 159.4) * (t > 175 ? 1 - seg(t, 175, 176) : 1), t);
    if (sweep > 0) paint([[1500, 300], [600 + sweep * 300, 1100], [1300 + sweep * 300, 1100]], { wash: '#FF4A4A', washOp: 70 * sweep, ink: null });
    crowd(t, { flee: 160.8 });
    queenButton(560 - 900 * easeIn(seg(t, 161, 161.8)), TFY, U, { ...faces(t, [[155, 'surprised'], [160.3, 'panic', { mouth: 'O' }]]), who: 'queen', boilKey: 'queen' });
    sirLint(700 - 900 * easeIn(seg(t, 161.3, 162.1)), TFY, U * 1.1, { ...face('panic'), view: 'q', flip: true, noShield: true, boilKey: 'lint' });
    // the dive: Pumpkin hides behind Pip (Pip in front, tiny; Pumpkin crouched behind, peeking over)
    const dive = seg(t, 162.6, 163.2), hid = t > 163.2;
    const px = PIPX - 60;
    if (!hid) { const p = arcPt([PKX, TFY], [px + 170, TFY], 160, ease(dive)); sockCape(p[0], p[1], U, { wind: .6 }); pumpkin(p[0], p[1], U, { ...faces(t, [[155, 'surprised', { lookX: 1 }], [158.6, 'panic', { lookX: 1 }]]), crown: true, aR: 1.2, armR: excalifork(0), aL: 1.2, sq: dive > 0 ? -.2 : 0, noShadow: dive > 0, boilKey: 'pk' }); }
    else { sockCape(px + 170, TFY, U, { wind: .2 }); pumpkin(px + 170, TFY, U, { ...faces(t, [[163.2, 'panic', { lookX: 1 }], [167.6, 'sheepish', { lookX: -1, lookY: .6 }], [174.6, 'surprised', { lookX: 1 }], [176.4, 'sheepish', { lookX: 1 }]]), crown: true, sq: .2 + Math.sin(t * 40) * .02, aL: .4, aR: .4, armR: excalifork(0), who: 'pumpkin', boilKey: 'pk' }); }
    pip(px, TFY, U, { ...faces(t, [[155, 'surprised', { lookX: 1 }], [163.4, 'deadpan', { lookX: 1, lookY: -.5 }], [164.6, 'annoyed', { lookY: -1, lookX: 1 }], [169.4, 'deadpan', { lookY: -1 }]]), view: t > 164 ? 'q' : 'front', flip: true, aL: -.6, aR: -.6, who: 'pip', boilKey: 'pip' });
    camEnd();
  }

  shots([[0, s01], [12, s02], [21, s03], [28, s04], [45, s05], [51, s06], [62, s07], [80, s08], [108, s09], [130, s10], [155, s11], [180, t => endScreen(t, 180, { hat: true, guides: typeof GUIDES !== 'undefined' })]]);
})();
