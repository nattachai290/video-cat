// shots.js: the 7 shots of "Pumpkin & Pip: The Royal Bed" (50 s, 1080 x 1920). See STORYBOARD.md.
// The series' living room, face-on. Big box mid-rug, the royal bed LEFT, Pip's tiny cracker box RIGHT.
// The first and last frames are the big box wiggling, close (the bed is out of that frame): the film loops.
(() => {
  const U = 40, FY = BOX.y;
  const say = (who, t) => typeof SPEAK === 'function' ? SPEAK(who, t) : 0;
  const chew = (t, on = true) => on ? .28 * Math.max(0, Math.sin(t * 15)) : 0;
  const cam = (cx, cy, z, sh = [0, 0]) => camBegin(cx + sh[0], cy + sh[1], z);
  const BOX_CAM = [560, 1430, 2.0];
  const wiggle = (t, amp = 1) => amp * (.035 * Math.sin(t * TAU * 2) + .015 * Math.sin(t * TAU * 6));   // period divides 50 s
  const SLEEP = { ...face('proud'), brow: 0, browUp: 0 };
  function room(t) { livingRoom6(t); curtain(t); }

  // 01 · 0–5 · The box wiggles... a "?" ... the flaps pop, Pip pops up: "Special delivery!"
  function s01(t, lt) {
    cam(...BOX_CAM);
    room(t); tinyBox(TINY.x, TINY.y, TINYS);
    const pop = seg(t, 2.05, 2.5), open = backOut(seg(t, 2.0, 2.3));
    bigBox(t, { open, wig: wiggle(t, t < 2.0 ? 1 : 0), inside: () => {
      if (pop > 0) clipRects([[BOX.x - BOX.w / 2, -600, BOX.w + 60, BOX.y - BOX.h + 600]], () =>
        pip(BOX.x, BOX.y - BOX.h + lerp(250, 0, backOut(pop)), U, { ...faces(t, [[2, 'surprised'], [2.6, 'happy']]), aR: 1.3, aL: .9 + .3 * Math.sin(t * 8), noShadow: true, who: 'pip', boilKey: 'pip' }));
    } });
    if (t > .8 && t < 2.0) emote('?', BOX.x + 120, BOX.y - BOX.h - 110, 60, seg(t, .8, 1.05), t - .8);
    camEnd();
  }

  // 02 · 5–12 · Pip climbs out and hauls the royal bed out of the box (it gleams). "A royal bed. Only the best for you."
  // Pumpkin hops off the armchair and wanders over.
  function s02(t, lt) {
    cam(470, 1300, 1.05);
    room(t); tinyBox(TINY.x, TINY.y, TINYS);
    const out = seg(t, 5.0, 5.6), bedK = seg(t, 6.0, 7.4);
    bigBox(t, { open: 1, inside: () => { if (bedK <= 0) clipRects([[0, -600, 2000, BOX.y - BOX.h + 600]], () => royalBed(BOX.x, BOX.y - BOX.h + 90, .6, t)); } });
    if (bedK > 0) { const p = arcPt([BOX.x, BOX.y - BOX.h], [BED.x, BED.y], 260, ease(bedK)), s = lerp(.6, BED.s, ease(bedK)); royalBed(p[0], p[1], s, t, seg(t, 7.3, 7.6)); }
    // Pip: out of the box, then the salesman's "ta-da"
    let px, py, view = 'q', pf = faces(t, [[5, 'happy'], [8.2, 'smug', { blush: .3 }]]), aL = -1.1, aR = -1.1;
    if (out < 1) { const p = arcPt([BOX.x, BOX.y - BOX.h], [BOX.x + 230, FY], 140, easeOut(out)); px = p[0]; py = p[1]; view = 'side'; }
    else if (t < 7.4) { px = BOX.x + 230; py = FY; aL = aR = 1.2 * Math.sin(seg(t, 6.0, 7.4) * Math.PI); }   // heave
    else { px = BOX.x + 230; py = FY; aL = -.1; aR = .5; }
    pip(px, py, U, { ...pf, view, flip: true, aL, aR, who: 'pip', boilKey: 'pip', noShadow: view === 'side' });
    // Pumpkin: on the armchair, then down and over towards the bed
    const down = seg(t, 9.5, 10.0), walk = seg(t, 10.0, 11.8);
    if (down <= 0) pumpkin(850, ROOM.chair.seat + 8, U, { ...face('neutral', { lookX: -.8, lookY: .5 }), aL: -1.3, aR: -1.3, boilKey: 'pk' });
    else if (down < 1) { const p = arcPt([850, ROOM.chair.seat + 8], [780, FY], 80, ease(down)); pumpkin(p[0], p[1], U, { ...face('neutral'), view: 'side', flip: true, noShadow: true, boilKey: 'pk' }); }
    else pumpkin(lerp(780, 250, ease(walk)), FY, U, { ...face('neutral', { lookX: -.6 }), view: walk < 1 ? 'side' : 'q', flip: true, walk: walk < 1 ? t * 2.2 : null, boilKey: 'pk' });
    camEnd();
  }

  // 03 · 12–20 · He sniffs the bed, one paw on it... then his head snaps to the empty box. "...Box." Into it: "Perfect."
  function s03(t, lt) {
    cam(lerp(330, 470, ease(seg(t, 13.0, 14.0))), 1360, 1.3);
    room(t); tinyBox(TINY.x, TINY.y, TINYS);
    royalBed(BED.x, BED.y, BED.s, t, .4);
    const jump = seg(t, 16.3, 16.9);
    const inBox = jump >= 1;
    bigBox(t, { open: 1, inside: () => { if (inBox) clipRects([[0, -600, 2000, BOX.y - BOX.h + 600 + 10]], () =>
      pumpkin(BOX.x, BOX.y - 40, U, { ...faces(t, [[16.9, 'surprised'], [17.3, 'happy', { blush: .4 }]]), sq: .1 * Math.exp(-(t - 16.9) * 6) * Math.cos((t - 16.9) * 20), aL: -1.4, aR: -1.4, noShadow: true, who: 'pumpkin', boilKey: 'pk' })); } });
    if (!inBox) {
      let x = 250, y = FY, sq = 0, rot = 0, pf;
      if (t < 13.2) { pf = face('neutral', { lookX: -.8, lookY: .7 }); rot = -.08 * Math.sin(seg(t, 12.0, 13.0) * Math.PI); }
      else if (t < 16.3) { pf = faces(t, [[13.2, 'surprised', { lookX: 1 }], [13.9, 'greedy', { lookX: 1, pupil: 1 }]]); sq = .2 * ease(seg(t, 15.6, 16.2)); rot = t > 15.6 && t < 16.2 ? Math.sin(t * 26) * .05 : 0; }
      else { const p = arcPt([250, FY], [BOX.x, BOX.y - 60], 220, easeOut(jump)); x = p[0]; y = p[1]; pf = face('greedy'); sq = -.18 * Math.sin(jump * Math.PI); rot = .3 * jump; }
      pumpkin(x, y, U, { ...pf, sq, rot, aL: t > 16.3 ? 1.2 : -1.3, aR: t > 16.3 ? 1.2 : -1.3, noShadow: t > 16.3, who: 'pumpkin', boilKey: 'pk' });
      if (t > 13.2 && t < 16.3) for (let i = 0; i < 3; i++) { const k = Math.max(0, Math.sin(t * 5 + i * 2)); if (k > .3) paint(starPts(BOX.x - 100 + i * 100, BOX.y - BOX.h - 60 - (i % 2) * 30, 26 * k, .22, 4), { wash: '#FFFFFF', ink: null }); }
    }
    pip(BOX.x + 230, FY, U, { ...faces(t, [[12, 'smug'], [13.4, 'surprised'], [17.0, 'annoyed']]), view: 'q', flip: true, aL: -.1, aR: .5, boilKey: 'pip' });
    camEnd();
  }

  // 04 · 20–30 · "That bed cost forty crackers!" Pip yanks him out by the tail (POP), shuts the flaps and sits on them.
  // Pumpkin squeezes into Pip's tiny cracker box instead: "Still... perfect."
  function s04(t, lt) {
    cam(lerp(560, 720, ease(seg(t, 24.6, 26.0))), 1330, lerp(1.05, 1.35, ease(seg(t, 24.6, 26.0))));
    room(t);
    royalBed(BED.x, BED.y, BED.s, t);
    const yank = 23.3, shut = ease(seg(t, 23.6, 24.0)), sitK = seg(t, 24.1, 24.6);
    bigBox(t, { open: 1 - shut, inside: () => { if (t < yank) clipRects([[0, -600, 2000, BOX.y - BOX.h + 610]], () =>
      pumpkin(BOX.x, BOX.y - 40 - (t > 22.6 ? Math.sin(t * 30) * 4 : 0), U, { ...faces(t, [[20, 'happy'], [22.6, 'surprised']]), aL: -1.4, aR: -1.4, noShadow: true, boilKey: 'pk' })); } });
    // Pip: stomping; tugging the tail; then shutting the box and sitting on it, arms crossed
    let px = BOX.x + 230, py = FY, pf = faces(t, [[20, 'annoyed', { brow: .9 }], [22.6, 'strain'], [23.6, 'determined'], [24.6, 'annoyed']]), aL = -1.1, aR = -1.1, dy = 0, view = 'q', flip = true;
    if (t < 22.5) dy = -Math.abs(Math.sin((t - 20) * 7)) * .3;
    else if (t < yank) { px = BOX.x + 170; aL = aR = .1; dy = 0; }
    else if (sitK > 0) { const p = arcPt([BOX.x + 200, FY], [BOX.x + 20, BOX.y - BOX.h - 18], 80, ease(sitK)); px = p[0]; py = p[1]; aL = aR = sitK >= 1 ? -.6 : .5; }
    pip(px, py, U, { ...pf, view, flip, aL, aR, dy, who: 'pip', noShadow: sitK > 0, boilKey: 'pip' });
    if (t > 22.6 && t < yank) { const P = [[BOX.x + 40, BOX.y - BOX.h - 10], [BOX.x + 110, BOX.y - BOX.h - 50], [px - 40, py - 2.4 * U]]; paint(ribbon(P, U * .8, U * .6), { wash: PUMPKIN_COL.col, sw: 1.4 }); }   // the tail, tugged
    // Pumpkin: pops out, tumbles, walks to the tiny box, squeezes in
    if (t >= yank) {
      const fly = seg(t, yank, yank + .6), walk = seg(t, 24.4, 25.6), sqz = seg(t, 25.8, 27.6);
      let x, y, sq = 0, rot = 0, pf2, view2 = 'q', flip2 = false, walkp = null;
      if (fly < 1) { const p = arcPt([BOX.x, BOX.y - BOX.h], [640, FY], 160, fly); x = p[0]; y = p[1]; rot = fly * TAU; pf2 = face('panic'); }
      else if (t < 24.4) { x = 640; y = FY; sq = .3 * Math.exp(-(t - yank - .6) * 6); pf2 = face('dazed'); }
      else if (walk < 1) { x = lerp(640, TINY.x, ease(walk)); y = FY; view2 = 'side'; walkp = t * 2.2; pf2 = face('determined'); }
      else { x = TINY.x; y = FY; pf2 = faces(t, [[25.6, 'determined'], [26.4, 'strain'], [27.6, 'happy', { blush: .5 }]]); }
      if (walk < 1) { tinyBox(TINY.x, TINY.y, TINYS); pumpkin(x, y, U, { ...pf2, sq, rot, view: view2, flip: flip2, walk: walkp, aL: -1.3, aR: -1.3, noShadow: fly < 1, who: 'pumpkin', boilKey: 'pk' }); }
      else { const hop = seg(t, 25.7, 26.1), wig = sqz > 0 && sqz < 1 ? Math.sin(t * 22) * .05 : 0;
        if (hop < 1) { tinyBox(TINY.x, TINY.y, TINYS); const p = arcPt([TINY.x, FY], [TINY.x, TINY.y - TINY.h * TINYS + 10], 120, ease(hop)); pumpkin(p[0], p[1], U, { ...pf2, aL: .8, aR: .8, noShadow: true, boilKey: 'pk' }); }
        else crammed(t, ease(sqz), { ...pf2, rot: wig, who: 'pumpkin' }); }
      puffCloud(BOX.x, BOX.y - BOX.h - 20, 120, t - yank);
    } else tinyBox(TINY.x, TINY.y, TINYS);
    camEnd();
  }

  // 05 · 30–39 · Pip gives up and flops into the royal bed. He sinks right in. "...Oh no. It IS nice."
  function s05(t, lt) {
    cam(lerp(450, 240, ease(seg(t, 30.6, 32.4))), 1380, 1.4);
    room(t);
    bigBox(t, {});
    // Pumpkin, still in his tiny box (right), half in frame
    crammed(t, 1, { ...face('happy', { blush: .4 }) });
    royalBedBack(BED.x, BED.y, BED.s, t);
    const hop = seg(t, 30.2, 30.8), walk = seg(t, 30.8, 32.2), flop = seg(t, 32.4, 33.0);
    if (flop <= 0) {
      let px, py, view = 'side';
      if (hop < 1) { const p = arcPt([BOX.x + 20, BOX.y - BOX.h - 18], [BOX.x - 170, FY], 60, ease(hop)); px = p[0]; py = p[1]; }
      else { px = lerp(BOX.x - 170, BED.x + 60, ease(walk)); py = FY; }
      pip(px, py, U, { ...face('sheepish'), view, flip: true, walk: t * 3, noShadow: hop < 1, boilKey: 'pip' });
    } else {
      const sink = ease(flop);
      const py = BED.y - 30 + sink * 26;
      pip(BED.x + 10, py, U, { rot: -.14 * sink, ...faces(t, [[32.4, 'surprised'], [33.4, 'sheepish', { lid: .3 }], [34.6, 'happy', { blush: .4 }], [36.6, 'proud']]),
        aL: lerp(1.3, -.2, sink), aR: lerp(1.3, -.2, sink), noShadow: true, who: 'pip', boilKey: 'pip' });
      if (sink > .05) royalBedBlanket(BED.x, BED.y, BED.s, BED.x + 6, lerp(py - 60, py - 118, sink));   // tucked in up to his chest
    }
    royalBedFront(BED.x, BED.y, BED.s, t);
    if (t > 36.6) zzz(BED.x + 80, BED.y - 260, .7, t);
    camEnd();
  }

  // 06 · 39–45 · Pumpkin in the tiny box, watching. Eyes narrow. Jealous. Tail lashing.
  function s06(t, lt) {
    cam(800, 1290, 1.8);
    room(t);
    crammed(t, 1, { ...faces(t, [[39, 'happy'], [40.0, 'neutral', { lookX: -1 }], [41.2, 'annoyed', { lookX: -1 }], [43.0, 'determined', { lookX: -1, brow: 1 }]]), tailWag: 1, who: 'pumpkin' });
    camEnd();
  }

  // 07 · 45–50 · He leaps into the royal bed: BOING, Pip is launched across the room... into the big box. The box wiggles = frame 1.
  function s07(t, lt) {
    const leap = seg(t, 45.0, 45.7), land = 45.7, fly = seg(t, 45.75, 46.6), into = 46.6;
    if (t < 46.9) {
      cam(470, 1330, 1.0);
      room(t);
      royalBedBack(BED.x, BED.y, BED.s, t);
      if (t < land) { pip(BED.x + 10, BED.y - 4, U, { ...face('proud'), rot: -.14, noShadow: true, boilKey: 'pip' }); royalBedBlanket(BED.x, BED.y, BED.s, BED.x + 6, BED.y - 122); }
      if (leap < 1) { const p = arcPt([TINY.x, FY], [BED.x, BED.y - 30], 260, ease(leap)); pumpkin(p[0], p[1], U, { ...face('determined'), sq: -.15, rot: -.3 * leap, aL: 1.2, aR: 1.2, noShadow: true, boilKey: 'pk' }); }
      else pumpkin(BED.x, BED.y - 30, U, { ...face('proud', { blush: .4 }), sq: .22 + .2 * Math.exp(-(t - land) * 6) * Math.cos((t - land) * 22), aL: -1.4, aR: -1.4, noShadow: true, who: 'pumpkin', boilKey: 'pk' });
      royalBedFront(BED.x, BED.y, BED.s, t);
      bigBox(t, { open: t > into - .1 && t < into + .2 ? .6 : 0 });
      tinyBox(TINY.x, TINY.y, TINYS);
      if (t >= land && fly < 1) { const p = arcPt([BED.x + 170, BED.y - 120], [BOX.x, BOX.y - BOX.h - 30], 520, fly); pip(p[0], p[1], U, { ...face('panic'), rot: fly * TAU * 1.5, aL: 1.4, aR: 1.4, scarfWind: 1, noShadow: true, boilKey: 'pip' }); }
      burst(BED.x, BED.y - 100, 160, (t - land) / .4, 10, '#FFFFFF');
      camEnd();
      return;
    }
    cam(...BOX_CAM);
    room(t); tinyBox(TINY.x, TINY.y, TINYS);
    bigBox(t, { wig: wiggle(t, seg(t, 46.9, 47.3)) });
    camEnd();
  }

  shots([[0, s01], [5, s02], [12, s03], [20, s04], [30, s05], [39, s06], [45, s07]]);
})();
