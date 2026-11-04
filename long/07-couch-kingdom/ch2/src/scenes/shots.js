// shots.js: chapter 2 "The Sock Bridge" (titles 5 s + chapter 180 s + End Screen 20 s, 1920 x 1080). See ../STORYBOARD.md.
// Written in CHAPTER time (0 = right after the titles). The party travels LEFT -> RIGHT the whole chapter.
(() => {
  const U = 40, HEAD = TFY - 338, cam = (cx, cy, z, sh = [0, 0]) => camBegin(cx + sh[0], cy + sh[1], z);
  const camT = (cx, z, sh = [0, 0], up = 0) => cam(cx, TFY - 445 / z - up, z, sh);
  const camC = (cx, z, sh = [0, 0]) => camT(cx, z, sh, -230 / z);   // canyon shots: the frame shows the deck and the drop below it
  const shake = (t, t0, amp = 10, dur = .35) => t > t0 && t < t0 + dur ? [Math.sin(t * 90) * amp * (1 - (t - t0) / dur), Math.cos(t * 77) * amp * .6 * (1 - (t - t0) / dur)] : [0, 0];
  const PKO = { crown: true };   // Pumpkin's hero kit (the cape is drawn separately with sockCape until he gives it away)
  const hero = (x, y, o, t, cape = true) => { if (cape) sockCape(x, y, U, { view: o.view, flip: o.flip, rot: o.rot, dy: o.dy, wind: o.wind ?? Math.sin(t * 2) * .15 }); pumpkin(x, y, U, { ...PKO, armR: o.aR > .3 ? excalifork(o.lit || 0) : undefined, ...o, boilKey: 'pk' }); };
  const mouse = (x, y, o) => { pipPack(x, y, U, { view: o.view, flip: o.flip, dy: o.dy }); pip(x, y, U, { ...o, boilKey: 'pip' }); };
  const crumbsMouth = (x, y, t, t0, t1) => { if (t > t0 && t < t1) for (let i = 0; i < 4; i++) { const k = frac((t - t0) * 2 + i / 4); paint(ellPts(x + i * 10 - 15, y - k * 120, 7, 5, 6), { wash: '#E6B65F', ink: null }); } };

  // 2-01 · 0–14 · The send-off at the town gate: the Queen, the crowd throws crumbs like confetti; Pumpkin catches them in
  // his mouth (waving, chewing). Sir Lint revs up in his wind-up car. They set off through the gate to the right.
  function s01(t) {
    camT(lerp(980, 1120, ease(seg(t, 10, 14))), 1.25);
    townGate(t);
    for (let i = 0; i < 6; i++) { const x = 120 + i * 120; dustBunny(x, TFY, U, { ...face('happy', { eyes: 'happy' }), seed: i + 2, dy: -Math.abs(Math.sin(t * 8 + i)) * .5, boilKey: 'cb' + i }); }
    queenButton(320, TFY, U, { ...faces(t, [[0, 'proud', { mouth: 'grin' }], [4, 'happy']]), aL: t < 4 ? 1.1 : .2 + Math.sin(t * 6) * .3, who: 'queen', boilKey: 'queen' });
    // confetti crumbs arcing in from the left; he catches every third one in his mouth
    for (let i = 0; i < 18; i++) { const t0 = 2.5 + i * .45, k = seg(t, t0, t0 + 1.4); if (k <= 0 || k >= 1) continue; const caught = i % 3 === 0; const end = caught ? [880, HEAD + 170] : [700 + (i * 97 % 700), TFY + 10]; const p = arcPt([150 + (i % 4) * 60, TFY - 200], end, 300, k); if (!(caught && k > .95)) crackerP(p[0], p[1], k * 8, .35); }
    const chewing = t > 3.5 && t < 11;
    hero(880, TFY, { ...faces(t, [[0, 'proud'], [3.5, 'munching'], [11, 'determined', { mouth: 'grin' }]]), aR: .9 + Math.sin(t * 5) * .15, aL: -1.1, ...(chewing ? { talk: .3 * Math.max(0, Math.sin(t * 22)) } : {}), view: t > 11 ? 'side' : 'front', walk: t > 11 ? t * 4 : undefined, dx: t > 11 ? (t - 11) * 6 : 0 }, t);
    mouse(1140, TFY, { ...faces(t, [[0, 'deadpan', { lookX: -1 }], [11, 'neutral']]), view: t > 11 ? 'side' : 'q', walk: t > 11 ? t * 5 : undefined, dx: t > 11 ? (t - 11) * 6 : 0 });
    // Sir Lint in his car, revving (winding the key) then off
    const go = seg(t, 9.5, 14);
    windupCar(1420 + go * 900, TFY, .9, t, { key: t * 3, moving: go > 0 });
    sirLint(1420 + go * 900, TFY - 130, U * .9, { ...face('determined', { mouth: 'grin' }), view: 'side', lance: .6, noShadow: true, boilKey: 'lint' });
    camEnd();
  }

  // 2-02 · 14–38 · The road. The Oracle Cookie floats down out of the dark, glowing. "You will eat... soon." "Wow. She knows me."
  // "Where's the dragon?" "Go right." — the fortune slides out: an arrow. "That's the whole map?" Pip flips it: blank on the
  // back. "Left is also bad." Pumpkin sniffs the cookie... opens wide... she floats up and away just in time.
  function s02(t) {
    const z = t > 26.8 && t < 29.6 ? 2.1 : t > 19 && t < 21.6 ? 1.9 : 1.35;
    const cx = t > 26.8 && t < 29.6 ? 1060 : t > 19 && t < 21.6 ? 820 : 960;
    camT(cx, z);
    outsideRoad(t, 0);
    const oy = lerp(TFY - 900, TFY - 330, ease(seg(t, 14, 15.4))) - (t > 34.8 ? easeIn(seg(t, 34.8, 36.2)) * 900 : 0);
    const paper = t > 24.8 && t < 34 ? ease(seg(t, 24.8, 25.6)) : 0;
    oracleCookie(1010, oy + 330 - 330, U * 1.2, { ...faces(t, [[14, 'neutral'], [33.6, 'surprised', { eyes: 'wide' }]]), lid: t > 33.6 ? 0 : .45, paper, who: 'oracle', noShadow: true, boilKey: 'oc' });
    // the arrow on the fortune (drawn big when Pip reads it), then flipped: blank
    if (t > 26.8 && t < 29.6) { const flip = Math.abs(Math.cos(seg(t, 28.2, 28.8) * Math.PI)); paint(rrPts(1060, oy - 30, 320 * flip, 90, 8), { wash: '#FFFDF6', ink: PAL.ink, sw: 1.6 }); if (t < 28.5) letter('→', 1060 + 160 * flip, oy + 15, 80, '#C8363F', { font: '800 80px "Baloo 2", sans-serif', ink: false }); }
    const lunge = seg(t, 33.4, 34.8), chomp = t > 34.6 && t < 35.2;
    hero(700 + lunge * 80, TFY, { ...faces(t, [[14, 'surprised', { lookX: 1, lookY: -.5 }], [19.4, 'happy', { blush: .5 }], [22, 'neutral', { lookX: 1, lookY: -.5 }], [32.4, 'greedy', { lookX: 1, lookY: -.5 }], [34.4, 'surprised', { mouth: 'O', lookY: -1 }], [35.4, 'sheepish', { lookY: -1 }]]),
      view: 'q', aR: -1.1, aL: -1.1, rot: lunge * .15 * (1 - seg(t, 35, 35.6)), who: chomp ? undefined : 'pumpkin', talk: chomp ? 1 : undefined }, t);
    mouse(1200, TFY, { ...faces(t, [[14, 'neutral', { lookX: -1, lookY: -.5 }], [22, 'neutral', { lookX: -1, lookY: -1 }], [27.4, 'annoyed', { lookX: -1 }], [30, 'deadpan', { lookX: -1 }]]), view: 'q', flip: true, aL: t > 27.8 && t < 29.6 ? 1.0 : -.6, aR: -.6, who: 'pip' });
    sirLint(1470, TFY, U * 1.1, { ...face('surprised', { lookY: -1, lookX: -1 }), view: 'q', flip: true, sq: .2, rot: -.2, boilKey: 'lint' });
    camEnd();
  }

  // 2-03 · 38–58 · The journey, a gag every few seconds. Every sign says RIGHT → (even the one pointing left). Sir Lint's car
  // runs down: he winds it — "Onward!" — zoom. Runs down again — "Onward!" — zoom. Third time he winds it the wrong way:
  // it races BACKWARDS into Pumpkin's foot. "Onward?"
  function s03(t) {
    const sc = (t - 38) * 140;
    camT(960, 1.2);
    outsideRoad(t, sc);
    for (const [x0, left] of [[1300, false], [2300, true], [3300, false]]) { const x = x0 - sc; if (x > -300 && x < 2300) roadSign(x, TFY, 'RIGHT', left); }
    // the car: winds at 39.4 / 45 / 50.8; zooms ahead; the third time it shoots backwards (51.2) into Pumpkin (52.0)
    const lapX = tt => tt < 39.4 ? lerp(1300, 1250, seg(tt, 38, 39.4)) : tt < 41 ? 1250 : tt < 45 ? lerp(1250, 1500, ease(seg(tt, 41, 42.2))) - (tt - 42.2 > 0 ? (tt - 42.2) * 40 : 0) : tt < 46.8 ? 1390 : tt < 50.8 ? lerp(1390, 1600, ease(seg(tt, 46.8, 48))) - (tt - 48 > 0 ? (tt - 48) * 50 : 0) : tt < 51.4 ? 1460 : lerp(1460, 980, easeIn(seg(tt, 51.4, 52.0)));
    const carX = lapX(t), winding = (t > 39.4 && t < 41) || (t > 45 && t < 46.8) || (t > 50.8 && t < 51.4), moving = !winding && !(t > 52.0);
    const hit = 52.0, crashed = t > hit;
    windupCar(crashed ? 1000 : carX, TFY, .9, t, { key: winding ? t * (t > 50.8 ? -9 : 9) : t * 2, moving, back: t > 51.4 && !crashed, wheel: moving ? t * (t > 51.4 ? -12 : 12) : 0 });
    if (winding) sirLint(carX - 200, TFY, U * 1.0, { ...faces(t, [[38, 'strain', { eyes: 'squeeze' }]]), view: 'side', aR: .3, sq: .1, boilKey: 'lint' });
    else sirLint((crashed ? 1000 : carX), TFY - 130 - (crashed ? 0 : 0), U * .9, { ...faces(t, [[38, 'determined', { mouth: 'grin' }], [51.4, 'surprised', { eyes: 'wide' }], [hit, 'dazed', { eyes: 'spiral' }]]), view: 'side', flip: t > 51.4 && !crashed, lance: .6, rot: crashed ? -.4 : 0, noShadow: true, who: 'lint', boilKey: 'lint' });
    burst(990, TFY - 60, 160, (t - hit) / .35, 10, '#FFFFFF', 2);
    // Pumpkin and Pip walking (side view, in place: the world scrolls); Pumpkin hops on one foot after the hit
    const hop = crashed && t < 56 ? Math.abs(Math.sin((t - hit) * 9)) * .6 : 0;
    hero(820, TFY, { ...faces(t, [[38, 'happy'], [hit, 'strain', { eyes: 'squeeze', mouth: 'O' }], [55.4, 'sheepish']]), view: 'side', walk: crashed ? undefined : t * 4, dy: -hop, rot: hop * .1 }, t);
    mouse(560, TFY, { ...faces(t, [[38, 'neutral'], [48, 'deadpan', { lookX: 1 }], [hit, 'deadpan', { lookX: 1, browUp: .5 }]]), view: 'side', walk: crashed ? undefined : t * 5 });
    camEnd();
  }

  // 2-04 · 58–68 · The canyon (the gap between two floorboards) and the crumb bridge. A striped sock rises from under the
  // bridge, huge and dramatic: the Sock Troll. "None shall pass without answering my riddle!"
  const TX = 1060;   // the troll stands mid-bridge
  function troll(t, o = {}) { sockTroll(TX, BR.deck + 20, U * 1.25, { flip: true, ...o, boilKey: 'troll' }); }
  function s04(t) {
    const rise = backOut(seg(t, 59.6, 60.6));
    camC(lerp(820, 900, ease(seg(t, 58, 60))), lerp(1.1, 1.3, ease(seg(t, 58, 60))), shake(t, 59.6, 10));
    canyon(t);
    if (rise > 0) push(), clipRects([[-900, -600, 3800, BR.deck + 30 + 600]], () => troll(t, { ...faces(t, [[59.6, 'surprised'], [60.6, 'smug', { mouth: 'grin' }]]), dy: (1 - rise) * 7, who: 'troll' })), pop();
    hero(420, TFY, { ...faces(t, [[58, 'happy'], [59.8, 'surprised', { eyes: 'wide' }], [63, 'neutral', { lookX: 1 }]]), view: 'q' }, t);
    mouse(260, TFY, { ...faces(t, [[58, 'neutral', { lookX: 1 }], [60, 'surprised'], [63, 'deadpan', { lookX: 1 }]]), view: 'q' });
    sirLint(100, TFY, U * 1.1, { ...face('panic'), view: 'q', sq: .1, boilKey: 'lint' });
    camEnd();
  }

  // 2-05 · 68–100 · Three riddles. Every answer is "Snack" and every answer is right. The third: "What am I thinking about right
  // now?" — the troll's whole sock gurgles — "...Snack." "...Correct." (he starts to sob)
  function s05(t) {
    const onTroll = (t > 68.6 && t < 74) || (t > 75.6 && t < 83.6) || (t > 86 && t < 92.6) || t > 96;
    if (onTroll) camC(TX + 60, 2.4); else camC(620, 1.5);
    canyon(t);
    const gurgle = t > 92.4 && t < 94 ? Math.sin(t * 50) * .08 : 0;
    troll(t, { ...faces(t, [[68, 'smug', { mouth: 'smirk' }], [76, 'surprised'], [78.6, 'determined', { mouth: 'smirk' }], [86.4, 'panic', { mouth: 'O' }], [89.2, 'smug', { mouth: 'smirk' }], [92.4, 'surprised', { eyes: 'wide' }], [96.4, 'sheepish', { mouth: 'wobble' }]]), bend: gurgle * 4 + Math.sin(t * 2) * .3, sq: gurgle, tears: t > 97 ? seg(t, 97, 98) : 0, who: 'troll' });
    if (t > 92.4 && t < 94) for (let i = 0; i < 3; i++) inkLine(arcPts(TX - 40, BR.deck - 150, 40 + i * 20, 20 + i * 10, 0, Math.PI, 6), 2.5, '#FFFFFF', 'ink', 0);   // the gurgle
    hero(480, TFY, { ...faces(t, [[68, 'neutral', { lookX: 1 }], [72.8, 'neutral', { lookX: 1, lookY: -.3, brow: .3 }], [74.4, 'sheepish', { lookX: 1 }], [77, 'happy'], [82.6, 'greedy', { lookX: 1 }], [84, 'proud'], [91, 'neutral', { lookX: 1 }], [93.4, 'deadpan', { lookX: 1 }]]), view: 'q', aR: t > 84 && t < 85.5 ? 1.0 : .4, who: 'pumpkin' }, t);
    mouse(250, TFY, { ...faces(t, [[68, 'deadpan', { lookX: 1 }], [86.6, 'surprised', { lookX: 1 }], [87.4, 'deadpan', { lookX: 1 }]]), view: 'q' });
    if (t > 82.8 && t < 85.6) { paint(ellPts(680, HEAD + 40, 60, 60, 20), { wash: '#D9A35C', ink: PAL.ink, sw: 1.6 }); paint(ellPts(680, HEAD + 40, 20, 20, 12), { wash: '#272138', ink: PAL.ink, sw: 1.2 }); }   // the donut (a thought, a prop he produces)
    camEnd();
  }

  // 2-06 · 100–130 · The troll sobs: he lost his other half in the wash. Pip looks at Pumpkin's cape: same stripes. "Pumpkin."
  // "No. It's my cape. I look heroic." "You look like laundry." He gives it up: the cape flutters to the troll, opens two button
  // eyes: the two socks run to each other in slow motion, hearts. Pumpkin, cape-less, shivers: "I miss my laundry."
  function s06(t) {
    const give = seg(t, 114.0, 115.4), slow = t > 115.4 && t < 123.5;
    if (t > 104.6 && t < 108) camC(560, 2.0); else if (t > 108 && t < 114) camC(640, 1.6); else if (slow) camC(TX - 60, 1.5); else if (t > 123.5) camC(600, 1.8); else camC(TX, 1.5);
    canyon(t);
    const tears = t < 115 ? 1 : 0;
    // the troll and, from 115.4, his twin (the cape) running to him and hugging
    const twinX = t < 115.4 ? null : lerp(TX - 320, TX - 120, ease(seg(t, 115.6, 120.8)));
    troll(t, { ...faces(t, [[100, 'sheepish', { mouth: 'wobble' }], [114.6, 'surprised', { lookX: -1 }], [116, 'happy', { mouth: 'grin' }]]), tears, dx: slow ? -ease(seg(t, 115.6, 120.8)) * 2.2 : 0, who: 'troll' });
    if (twinX != null) sockTroll(twinX, BR.deck + 20, U * 1.15, { pink: true, ...face('happy', { eyes: t > 116.4 ? 'happy' : 'closed', mouth: 'smile' }), boilKey: 'twin' });
    if (t > 120.6 && t < 126) for (let i = 0; i < 5; i++) { const k = frac(t * .6 + i / 5); paint(heartPts(TX - 190 + Math.sin(k * 6 + i) * 40, BR.deck - 260 - k * 260, 22 * (1 - k * .4)), { wash: '#E2848C', washOp: 255 * (1 - k), ink: PAL.ink, sw: 1 }); }
    // the cape flies off Pumpkin to the troll (114-115.4), as a flat sock
    if (give > 0 && give < 1) { const p = arcPt([600, HEAD + 120], [TX - 320, BR.deck - 60], 200, ease(give)); push(); translate(p[0], p[1]); rotate(give * 6); sockFlat(0, 0, 0); pop(); }
    const cape = t < 114.0, shiver = t > 123.5 ? Math.sin(t * 60) * .02 : 0;
    hero(600, TFY, { ...faces(t, [[100, 'sheepish', { lookX: 1 }], [106.4, 'neutral', { lookX: 1 }], [107, 'surprised', { lookX: -1 }], [108.4, 'determined', { mouth: 'flat' }], [112.6, 'embarrassed'], [114, 'sheepish', { lookX: 1 }], [116, 'happy', { blush: .6 }], [123.5, 'soggy', { lid: .4 }]]),
      view: 'q', aL: t > 108.2 && t < 112.4 ? .4 : -1.1, aR: t > 123.5 ? -.2 + Math.sin(t * 50) * .05 : .4, rot: shiver, who: 'pumpkin' }, t, cape);
    if (t > 123.5) for (let i = 0; i < 3; i++) inkLine([[560 + i * 40, HEAD + 40], [565 + i * 40, HEAD + 10]], 2.5, '#BFE4F2', 'ink', 0);   // shiver lines
    mouse(360, TFY, { ...faces(t, [[100, 'sheepish', { lookX: 1 }], [106, 'deadpan', { lookX: 1 }], [112.4, 'deadpan', { lookX: 1, lid: .6 }], [116, 'happy', { eyes: 'happy' }], [123.5, 'deadpan', { lookX: 1 }]]), view: 'q', aR: t > 106 && t < 108 ? 1.0 : -.6, who: 'pip' });
    camEnd();
  }

  // 2-07 · 130–160 · Crossing. The twin socks wave from the side. Pumpkin, last, nibbles the pretzel railing as he goes. "Are you
  // eating the bridge?" "Just the decorative parts." The railing snaps; the bridge creaks; planks start to drop behind them.
  // "Run!" A mad dash, planks falling right behind his heels; Pip makes it; Pumpkin leaps... grabs the edge with his claws.
  const FALL = [[0, 143.0], [1, 144.0], [2, 145.2], [3, 146.6], [4, 148.2], [5, 149.8], [6, 151.4], [7, 153.0], [8, 154.6], [9, 156.4]];
  function s07(t) {
    // Pip ahead, Pumpkin behind (both walking right along the deck), then running
    const walk = tt => tt < 146 ? lerp(BR.x0 - 120, BR.x0 + 420, seg(tt, 130, 146)) : lerp(BR.x0 + 420, BR.x1 + 160, seg(tt, 146, 157.6));
    const px = walk(t) + 540, kx = Math.min(walk(t), BR.x1 - 70), run = t > 146;
    camC(clamp(kx + 160, 700, 1500), 1.25, shake(t, 140, 10));
    canyon(t, { eaten: seg(t, 131, 140) * .45, fall: FALL, cracks: 141, shake: t > 141 ? 1 : 0 });
    sockTroll(BR.x0 - 260, TFY, U * 1.0, { ...face('happy', { mouth: 'grin' }), bend: Math.sin(t * 4) * .6, boilKey: 'troll' });
    sockTroll(BR.x0 - 420, TFY, U * .95, { pink: true, ...face('happy', { eyes: 'happy', mouth: 'smile' }), bend: Math.sin(t * 4 + 1) * .6, boilKey: 'twin' });
    const pipDone = Math.min(px, BR.x1 + 260);
    mouse(pipDone, TFY, { ...faces(t, [[130, 'neutral'], [133.6, 'neutral', { lookX: -1 }], [140, 'surprised', { lookX: -1 }], [145.6, 'panic', { lookX: -1 }]]), view: 'side', flip: t > 133.4 && t < 137.6, walk: pipDone > BR.x1 + 200 ? undefined : t * (run ? 9 : 5), who: 'pip' });
    const chew = t > 131 && t < 140;
    const leap = seg(t, 157.6, 158.4);
    const ky = t < 157.6 ? TFY : TFY - Math.sin(leap * Math.PI) * 180;
    const kx2 = t < 157.6 ? kx : lerp(BR.x1 - 70, BR.x1 + 10, leap);
    hero(kx2, ky, { ...faces(t, [[130, 'munching'], [134.4, 'surprised', { lookX: 1 }], [136.2, 'munching'], [140, 'surprised', { eyes: 'wide', lookY: 1 }], [146, 'panic']]), view: 'side', walk: t < 157.6 ? t * (run ? 9 : 4) : undefined, aR: chew ? .4 : -.3, ...(chew && !(t > 136.3 && t < 138) ? { talk: .3 * Math.max(0, Math.sin(t * 22)) } : { who: 'pumpkin' }), noShadow: t > 157.6 }, t, false);
    crumbsMouth(kx + 120, HEAD + 100, t, 131, 140);
    if (run) speedLines(kx - 60, TFY - 250, 1, t, 5, 200, 260);
    camEnd();
  }

  // 2-08 · 160–176 · Hanging from the edge by his claws. Pip grabs his paw and pulls. The edge crumbles. He drops... down the
  // whole canyon (the camera falls with him)... SPLOOSH into the soda swamp. He sits up, dripping, a bubble pops on his nose:
  // "It's fizzy." Far above, Pip's tiny face peeks over the edge. Title card: Chapter 3, The Fizzy Swamp.
  function s08(t) {
    if (t > 176.4) { titleCard(t, 'CHAPTER 3', 'THE FIZZY SWAMP', ease(seg(t, 176.6, 177.2))); return; }
    if (t < 163.4) {   // hanging
      const slip = seg(t, 162.6, 163.4);
      cam(BR.x1 + 40, TFY + 160, 1.3, shake(t, 162.6, 12));
      canyon(t, { fall: FALL.map(([i]) => [i, 0]) });
      pumpkin(BR.x1 - 150, TFY + 440 + easeIn(slip) * 400, U, { ...faces(t, [[160, 'strain', { eyes: 'squeeze' }], [161.6, 'panic'], [162.6, 'surprised', { eyes: 'wide', pupil: 0 }]]), crown: true, aR: 1.5, aL: 1.5, noShadow: true, boilKey: 'pk' });
      mouse(BR.x1 + 140, TFY, { ...faces(t, [[160, 'strain', { eyes: 'squeeze' }], [162.6, 'panic']]), view: 'q', flip: true, rot: -.4, aL: .6, aR: .6 });
      if (t > 162.6) for (let i = 0; i < 5; i++) { const k = seg(t, 162.6 + i * .05, 163.4 + i * .05); paint(rrPts(BR.x1 + 10 + i * 18, TFY + 10 + k * 500, 16, 14, 4), { wash: CK.floor, ink: PAL.ink, sw: 1 }); }
      camEnd(); return;
    }
    if (t < 169.4) {   // the long fall: the canyon walls rush up past him
      const k = seg(t, 163.4, 169.4), wall = (t - 163.4) * 1800;
      cam(960, 540, 1.0, [Math.sin(t * 40) * 4, 0]);
      paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#15121F', ink: null });
      for (let i = 0; i < 14; i++) { const y = ((i * 180 - wall) % 2520 + 2520) % 2520 - 720; paint(rectPts(0, y, 260, 90), { wash: '#2A2440', ink: null }); paint(rectPts(W - 260, y + 90, 260, 90), { wash: '#2A2440', ink: null }); }
      for (let i = 0; i < 10; i++) { const x = 300 + hash(i) * 1320, y = frac(hash(i + 3) + t * 2.5) * 1400 - 200; inkLine([[x, y], [x, y - 220]], 3, '#FFFFFF', 'ink', 0); }
      glow(960, 1200, 700, SODA, .4 * k);
      pumpkin(960, 700 + Math.sin(t * 3) * 30, U * 1.1, { ...faces(t, [[163.4, 'panic', { mouth: 'O' }]]), crown: true, rot: Math.sin(t * 2) * .3, aL: 1.3 + Math.sin(t * 20) * .2, aR: 1.3 + Math.cos(t * 20) * .2, talk: .8, noShadow: true, boilKey: 'pk' });
      camEnd(); return;
    }
    // the swamp
    const land = 169.4;
    camT(1000, 1.5, shake(t, land, 18, .5));
    sodaSwamp(t);
    const sink = t < land + .4 ? 1 : 1 - ease(seg(t, land + 1.2, land + 2.0)) * .55;
    push(); clipRects([[-900, -600, 3800, TFY - 30 + 600]], () => pumpkin(1000, TFY + 260 * sink, U, { ...faces(t, [[land, 'surprised', { eyes: 'squeeze' }], [171.2, 'soggy', { lid: .5 }]]), crown: true, wet: .6, aL: -.4, aR: -.4, who: 'pumpkin', noShadow: true, boilKey: 'pk' })); pop();
    sodaSplash(1000, TFY - 40, (t - land) / 1.1);
    if (t > 173.6) { const k = seg(t, 173.6, 174.4); paint(ellPts(1000 + 80, HEAD + 120 - k * 40, 30 * (1 - k * .2), 30 * (1 - k * .2), 14), { wash: '#FFF2D6', washOp: 200, ink: PAL.ink, sw: 1 }); }   // a bubble on his nose... pop
    burst(1080, HEAD + 80, 50, (t - 174.4) / .3, 6, '#FFFFFF', 4);
    camEnd();
    // Pip far above, a tiny face over the edge (screen space, top)
    if (t > 174.6) { const k = backOut(seg(t, 174.6, 175.0)); push(); translate(1500, 70 - (1 - k) * 80); scale(.5, .5); pip(0, 0, 40, { ...face('surprised', { lookY: 1 }), noShadow: true, boilKey: 'pipt' }); pop(); }
  }

  const heartPts = (x, y, r) => { const P = []; for (let i = 0; i < 24; i++) { const a = i / 24 * TAU; P.push([x + r * 16 * Math.pow(Math.sin(a), 3) / 16, y - r * (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) / 16]); } return P; };
  const at = fn => t => fn(t - INTRO);
  shots([[0, t => introTitles(t, 'CHAPTER 2', 'THE SOCK BRIDGE')], [5, at(s01)], [19, at(s02)], [43, at(s03)], [63, at(s04)], [73, at(s05)], [105, at(s06)], [135, at(s07)], [165, at(s08)],
         [185, t => chapterEnd(t, 185, ['CHAPTER 3', 'THE FIZZY SWAMP'], 'none', /guides/.test(location.search))]]);
})();
