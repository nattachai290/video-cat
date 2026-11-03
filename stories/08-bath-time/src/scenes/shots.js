// shots.js: the 8 shots of "Pumpkin & Pip: Bath Time" (50 s, 1080 x 1920). See STORYBOARD.md.
// The series' living room, face-on: window + curtain LEFT, floor lamp by the window, armchair RIGHT, rug mid-floor.
// Frame 1 = last frame: Pip in his shower cap, brush and rubber duck raised, spooky green light (the film loops).
(() => {
  const U = 40, FY = FY8;
  const cam = (cx, cy, z, sh = [0, 0]) => camBegin(cx + sh[0], cy + sh[1], z);
  const MCU = [910, 1420, 3.0], PIP0 = [900, FY];
  const MENACE = { ...face('smug'), brow: .8, lid: .45, mouth: 'smirk', pupil: .3 };
  const BRUSH_FLOOR = [800, 1592];
  const lampOn = t => ease(seg(t, 19.4, 19.55));
  const kit = (view = 'front', o = {}) => ({ draw: capHook(view), armR: o.noBrush ? undefined : brushHook, armL: o.noDuck ? undefined : duckHook(o.sq || 0) });
  function room(t, o = {}) {
    livingRoom6(t);
    floorLamp(t, lampOn(t), o.tug || 0);
    if (!o.noCurtain) curtain8(t, { gone: t >= 13.7 });
  }
  // the spooky "horror movie" light of frames 1 and last: dark vignette round Pip, a green tint from below
  function spooky(k) {
    if (k <= .001) return;
    CTX.save(); CTX.setTransform(1, 0, 0, 1, 0, 0);
    const g = CTX.createRadialGradient(540, 980, 180, 540, 980, 1150);
    g.addColorStop(0, 'rgba(20,12,40,0)'); g.addColorStop(.55, `rgba(20,12,40,${.55 * k})`); g.addColorStop(1, `rgba(12,6,26,${.92 * k})`);
    CTX.fillStyle = g; CTX.fillRect(0, 0, W, H);
    const l = CTX.createLinearGradient(0, H, 0, 0);
    l.addColorStop(0, `rgba(60,200,120,${.3 * k})`); l.addColorStop(.6, 'rgba(60,200,120,0)');
    CTX.fillStyle = l; CTX.fillRect(0, 0, W, H);
    CTX.restore();
  }
  // Pip's hero pose (frame 1 / last frame). raise 0..1: arms from down to up.
  function pipHero(t, raise = 1, pf = MENACE, k = 1) {
    glow(PIP0[0], PIP0[1] - 150, 330, '#6CFF9C', .4 * k);
    const a = lerp(-1.1, .55, raise);
    pip(PIP0[0], PIP0[1], U, { ...pf, aR: a, aL: a, ...kit('front'), who: 'pip', boilKey: 'pip' });
  }

  // ---------- bubbles: a stream drifting from the tub towards the armchair, and three "hero" bubbles Pumpkin chases
  const HERO = [[31.0, 32.6, [520, 1320], [722, 1190], 26], [32.2, 33.8, [540, 1320], [662, 1190], 28], [33.4, 36.8, [560, 1320], [560, 1130], 48]];
  function bubbles(t) {
    for (let i = 0; i < 18; i++) {
      const b = 29.2 + i * .65, age = t - b; if (age < 0 || age > 5) continue;
      const x = TUB.x + (hash(i) - .5) * 260 + age * (55 + 40 * hash(i + 4)), y = TUB.y - TUB.h - 20 - age * (45 + 35 * hash(i + 8)) + Math.sin(age * 2.2 + i) * 14;
      bubble(x + Math.sin(age * 1.7 + i) * 18, y, 14 + 18 * hash(i + 2), clamp(Math.min(age * 3, (5 - age) * 3)));
    }
    for (const [b, p, A, B, r] of HERO) {
      if (t < b) continue;
      if (t < p) { const k = ease(seg(t, b, b + (p - b) * .7)); bubble(lerp(A[0], B[0], k) + Math.sin(t * 2) * 8, lerp(A[1], B[1], k) + Math.sin(t * 2.6) * 10, r * clamp((t - b) * 3)); }
      else burst(B[0], B[1], r * 2.2, (t - p) / .35, 8, '#FFFFFF', p);
    }
  }

  // 01 · 0–4 · Pip in a shower cap, brush and duck raised, horror light: "Bath... time."  Cut: Pumpkin's fur explodes.
  function s01(t) {
    if (t < 2.6) {
      cam(...MCU); room(t); pipHero(t, 1); camEnd(); spooky(1);
      return;
    }
    cam(560, 1290, 2.0);
    room(t);
    const pf = seg(t, 2.75, 2.95), sh = t > 2.75 && t < 3.1 ? [Math.sin(t * 90) * 6, 0] : [0, 0];
    pumpkin(560 + sh[0], FY, U, { ...faces(t, [[2.6, 'proud'], [2.75, 'surprised', { eyes: 'wide', pupil: .2 }], [3.3, 'panic']]), puff: backOut(pf), aL: lerp(-1.1, .9, pf), aR: lerp(-1.1, .9, pf),
      dy: -.8 * Math.sin(seg(t, 2.75, 3.1) * Math.PI), boilKey: 'pk' });
    camEnd();
  }

  // 02 · 4–10 · He dives "under" the rug: a cat-shaped lump, tail out. "You can't see me."  Pip tiptoes over and flips the
  // rug up: nothing. The lump is now on the other side.
  function s02(t) {
    cam(560, 1330, 1.2);
    room(t);
    const crouch = seg(t, 4.0, 4.4), jump = seg(t, 4.4, 4.95), lift = seg(t, 8.8, 9.0), drop = seg(t, 9.6, 9.8);
    // the lumps
    if (t >= 4.95 && t < 8.8) rugLump(t, 470, backOut(seg(t, 4.95, 5.2)));
    if (t >= 9.05) rugLump(t, 300, backOut(seg(t, 9.05, 9.3)));
    if (lift > 0 && drop < 1) { const k = lift * (1 - drop); paint([[480, 1585], [640, 1590], [640 - 10 * k, 1590 - 150 * k], [500, 1590 - 120 * k]], { wash: RC.rugDk, sw: 1.3 }); }
    // Pumpkin: crouch, the dive
    if (jump < 1) {
      let x = 560, y = FY, rot = 0, sq = .25 * ease(crouch);
      if (jump > 0) { const p = arcPt([560, FY], [470, 1540], 320, ease(jump)); x = p[0]; y = p[1]; rot = -TAU * .5 * jump; sq = -.15; }
      pumpkin(x, y, U, { ...face(jump > 0 ? 'determined' : 'panic'), puff: 1 - ease(seg(t, 4.0, 4.5)), sq, rot, aL: jump > 0 ? 1.3 : -1.2, aR: jump > 0 ? 1.3 : -1.2, noShadow: jump > 0, boilKey: 'pk' });
    }
    puffCloud(470, 1520, 150, (t - 4.95) / .6);
    // Pip: watches the dive, then tiptoes over
    const walk = seg(t, 5.6, 8.5);
    let px = PIP0[0], view = 'q', pf, aR = -.2, aL = .3, dy = 0;
    pf = faces(t, [[4, 'surprised'], [5.0, 'smug'], [5.6, 'determined', { brow: .6 }], [8.8, 'surprised'], [9.3, 'annoyed', { lookX: -1 }]]);
    if (walk > 0 && walk < 1) { px = lerp(PIP0[0], 690, walk); view = 'side'; dy = -Math.abs(Math.sin(t * 6)) * .25; aR = .6; }
    else if (walk >= 1) { px = 690; aR = lift > 0 && drop < 1 ? -.4 : .4; }
    pip(px, FY, U, { ...pf, view, flip: true, walk: walk > 0 && walk < 1 ? t * 1.6 : null, aR, aL, dy, ...kit(view), boilKey: 'pip' });
    if (t > 9.3) emote('?', 690 - 100, FY - 360, 50, seg(t, 9.3, 9.5), t - 9.3);
    camEnd();
  }

  // 03 · 10–16 · Behind the curtain: a cat-shaped bulge, belly sticking out both sides, feet and tail underneath.
  // Pip pokes the belly with the brush: MEOW! The curtain runs off with him in it.
  function s03(t) {
    cam(220, 1050, 1.5);
    room(t, { noCurtain: true });
    const poke = 13.35, flee = seg(t, 13.7, 14.6), lift = backOut(seg(t, poke + .05, poke + .25)) * (t < 13.7 ? 1 : 0);
    if (t < 13.7) {
      pumpkin(105, BACK - lift * 60, U, { ...faces(t, [[10, 'proud'], [poke + .05, 'panic']]), puff: seg(t, poke + .05, poke + .2), noTail: true, aL: -1.3, aR: -1.3, noShadow: true, boilKey: 'pk' });
      curtain8(t, { cat: 105, lift: lift * 60 });
      if (lift <= 0) paint(ribbon([[250, BACK - 14], [320, BACK - 6], [370 + Math.sin(t * 4) * 10, BACK - 30], [360 + Math.sin(t * 4) * 16, BACK - 80]], 30, 18), { wash: PUMPKIN_COL.col, sw: 1.3 });
      burst(275, 1100, 90, (t - poke) / .35, 9, '#FFFFFF', 4);
    } else {
      curtain8(t, { gone: true });
      if (flee < 1) curtainGhost(t, lerp(105, -620, easeIn(flee)), BACK);
    }
    // Pip: in from the right, a long look, the poke
    const walk = seg(t, 10.2, 12.0);
    let px = lerp(700, 480, ease(walk)), view = walk > 0 && walk < 1 ? 'side' : 'q', aR = .3, aL = .2, dy = 0;
    if (t > 12.9 && t < poke) aR = lerp(.3, .9, ease(seg(t, 12.9, 13.2)));
    else if (t >= poke && t < 13.9) aR = 0;
    if (t > 15.0 && t < 15.6) { const s = Math.sin(seg(t, 15.0, 15.6) * Math.PI); aL = .2 + s * .8; aR = .3 + s * .6; dy = -s * .2; }
    pip(px, BACK + 20, U, { ...faces(t, [[10, 'determined', { brow: .5 }], [12.0, 'annoyed', { lookX: -1 }], [12.9, 'smug'], [poke + .1, 'surprised'], [14.6, 'deadpan', { lookX: -1 }]]),
      view, flip: true, walk: view === 'side' ? t * 2.4 : null, aR, aL, dy, ...kit(view), boilKey: 'pip' });
    camEnd();
  }

  // 04 · 16–23 · "Lamp" disguise: Pumpkin stands stiff beside the real floor lamp with a shade on his head.
  // Pip: "Nice... lamp." He clicks the real lamp on... then pulls the other "cord" (the tail). "YOWCH!"
  // The shade flies off and lands right over Pip.
  function s04(t) {
    cam(430, 1050, 1.45);
    const lampTug = Math.sin(seg(t, 19.25, 19.6) * Math.PI), tailTug = seg(t, 20.4, 20.6);
    room(t, { tug: lampTug });
    const PX = 690, jump = seg(t, 20.65, 21.0), fly = seg(t, 21.0, 21.6);
    // the tail, hanging down like a pull cord (behind him), pulled
    if (jump <= 0) { const d = tailTug * 40; paint(ribbon([[PX - 120, 1140], [PX - 160, 1170 + d * .3], [PX - 172, 1210 + d * .7], [PX - 168, 1250 + d]], 30, 22), { wash: PUMPKIN_COL.col, sw: 1.3 }); }
    if (fly < 1) {
      let x = PX, y = BACK, dy = 0, rot = 0;
      if (jump > 0) dy = -7 * easeOut(jump);
      if (fly > 0) { const p = arcPt([PX, BACK - 7 * U], [1250, 500], 200, fly); x = p[0]; y = p[1]; dy = 0; rot = fly * 1.5; }
      const shakeX = t > 18.6 && t < 20.4 ? Math.sin(t * 40) * .6 : 0;
      pumpkin(x + shakeX, y, U, { ...faces(t, [[16, 'deadpan', { lid: .2, lookX: .4 }], [17.6, 'sheepish', { lookX: .9, lookY: .5 }], [19.4, 'deadpan', { lookX: .9, lid: .3 }], [20.6, 'panic', { eyes: 'wide', pupil: .1 }]]),
        flip: true, noTail: true, dy, rot, puff: seg(t, 20.65, 20.8), aL: jump > 0 ? 1.4 : -1.45, aR: jump > 0 ? 1.4 : -1.45, noShadow: jump > 0, who: 'pumpkin',
        draw: jump <= 0 ? shadeHook(0) : undefined, boilKey: 'pk' });
    }
    // Pip
    const walk = seg(t, 16.0, 16.8), shade = seg(t, 20.7, 22.3);
    let px = lerp(100, 330, walk), view = walk < 1 ? 'side' : 'q', flip = false, aR = .3, aL = .2, dy = 0;
    if (walk >= 1) {
      if (t > 18.6 && t < 19.0) dy = -.15 * Math.abs(Math.sin((t - 18.6) * 16));   // the nod
      if (t >= 19.0 && t < 19.9) { flip = true; aR = lerp(.4, 1.0, seg(t, 19.0, 19.2)) - .4 * lampTug; }
      if (t >= 19.9) px = lerp(330, 430, ease(seg(t, 19.9, 20.3)));
      if (t >= 19.9 && t < 20.7) aR = lerp(.3, .55, seg(t, 19.9, 20.3)) - .35 * tailTug;
    }
    pip(px, BACK + 20, U, { ...faces(t, [[16, 'determined'], [16.9, 'deadpan', { lookX: 1, lookY: -.4 }], [19.0, 'smug'], [20.7, 'surprised', { lookY: -1 }], [21.4, 'deadpan']]),
      view, flip, walk: view === 'side' ? t * 2.4 : null, aR, aL, dy, ...kit(view), who: 'pip', boilKey: 'pip' });
    // the shade: off his head, spinning up... and down over Pip
    if (jump > 0) {
      if (shade < 1) { const p = arcPt([PX, BACK - 9.75 * U - 60], [430, BACK - 30], 420, ease(shade)); lampShade(p[0], p[1], 1.55, shade * TAU * 1.5); }
      else lampShade(430, BACK - 30 + Math.abs(Math.sin((t - 22.3) * 12)) * -14 * Math.exp(-(t - 22.3) * 4), 1.55, Math.sin((t - 22.3) * 12) * .06 * Math.exp(-(t - 22.3) * 4));
    }
    camEnd();
  }

  // 05 · 23–31 · Pip shrugs the shade off, pushes a wooden tub in, squirts bubble bath, climbs in with the duck.
  // "Fine. More bubbles for me." Pumpkin peeks over the armchair. Bubbles start drifting.
  function s05(t) {
    cam(560, 1330, 1.2);
    room(t);
    brushProp(...BRUSH_FLOOR, U, -.06);
    // Pumpkin, peeking over the back of the armchair (only what is above the chair shows)
    const peek = ease(seg(t, 24.6, 25.4));
    if (peek > 0) clipRects([[640, -600, 420, 836 + 600]], () => pumpkin(850, 1130 + (1 - peek) * 200, U, { ...faces(t, [[24.6, 'neutral', { lookX: -1 }], [28.6, 'greedy', { lookX: -1, lookY: -.3 }]]), aL: -1.2, aR: -1.2, noShadow: true, boilKey: 'pk' }));
    // the shade, tossed away
    const toss = seg(t, 23.2, 23.8);
    if (toss < 1) { const p = arcPt([230, FY - 30], [-260, 1250], 300, toss); lampShade(p[0], p[1], 1.55, -toss * 3); }
    // the tub coming in; foam rising
    const push = seg(t, 24.4, 26.2), tx = lerp(-300, TUB.x, ease(push)), foam = ease(seg(t, 26.4, 27.0));
    const hop = seg(t, 27.1, 27.6);
    tubBack(tx, TUB.y, foam, t);
    if (hop >= 1) tubClip(tx, TUB.y, () => pip(TUB.x - 30, tubRim() + 70, U, { ...faces(t, [[27.6, 'happy'], [28.3, 'annoyed', { lookX: 1 }], [29.3, 'smug', { lid: .6 }], [30.6, 'happy']]), aL: .7, aR: -.2, ...kit('front', { noBrush: true }), noShadow: true, who: 'pip', boilKey: 'pip' }));
    tubFront(tx, TUB.y, foam, t);
    // Pip
    if (hop < 1) {
      let px = 230, py = FY, view = 'q', flip = false, aR = .1, aL = .1, sq = 0, walk = null, pf = faces(t, [[23, 'annoyed'], [23.6, 'sheepish', { lid: .4 }], [24.4, 'determined'], [26.3, 'smug']]), armR, noShadow = false;
      if (t < 23.6) { aR = aL = lerp(1.3, .2, toss); }
      else if (t < 24.4) { sq = .12 * Math.sin(seg(t, 23.6, 24.4) * Math.PI); }   // the sigh
      if (push > 0 && push < 1) { px = tx - 250; view = 'side'; aR = 0; walk = t * 2.6; }
      else if (push >= 1) { px = TUB.x - 250; }
      if (t > 26.2 && t < 27.0) { view = 'q'; aR = .9; armR = (u, sw) => { paint(rrPts(.2 * u, -.4 * u, 1.2 * u, .8 * u, .2 * u), { wash: '#E77FB6', sw: sw * .6 }); paint(rectPts(1.4 * u, -.15 * u, .35 * u, .3 * u), { wash: '#FFFFFF', sw: sw * .5 }); }; }
      if (hop > 0) { const p = arcPt([TUB.x - 250, FY], [TUB.x - 30, tubRim() + 20], 160, ease(hop)); px = p[0]; py = p[1]; aR = aL = 1.2; noShadow = true; }
      pip(px, py, U, { ...pf, view, flip, aR, aL, sq, walk, noShadow, ...kit(view, { noBrush: true }), ...(armR ? { armR } : {}), who: 'pip', boilKey: 'pip' });
      if (t > 26.3 && t < 27.0) for (let i = 0; i < 6; i++) { const k = frac((t - 26.3) * 2.5 + i / 6); paint(ellPts(lerp(TUB.x - 140, TUB.x - 40, k), tubRim() - 150 + 160 * k * k, 10, 12, 8), { wash: '#F7B7D8', ink: null }); }
    }
    bubbles(t);
    camEnd();
  }

  // 06 · 31–38 · Bubbles drift to Pumpkin. He hops down, pops one, another, creeps closer, reaches for the big one over
  // the tub... slips. SPLASH. Pip is launched out onto the rim.
  function s06(t) {
    cam(700, 1330, 1.3);
    room(t);
    brushProp(...BRUSH_FLOOR, U, -.06);
    const hop = seg(t, 31.6, 32.2), fall = seg(t, 36.8, 37.3), splashT = 37.3, launch = seg(t, splashT, splashT + .6);
    const pf = faces(t, [[31, 'neutral', { lookX: -1 }], [31.6, 'surprised'], [32.2, 'happy'], [33.0, 'greedy', { lookX: -1 }], [35.2, 'greedy', { pupil: 1, lookX: -1, lookY: -1 }], [36.3, 'surprised', { eyes: 'wide' }], [36.8, 'panic']]);
    // Pumpkin before the fall (outside the tub)
    let PX = 880, rot = 0, aL = -1.2, aR = -1.2, view = 'front', walk = null, dy = 0;
    if (t < 31.6) clipRects([[640, -600, 420, 836 + 600]], () => pumpkin(850, 1130, U, { ...pf, aL, aR, noShadow: true, boilKey: 'pk' }));
    tubBack(TUB.x, TUB.y, 1 + .5 * seg(t, splashT, splashT + .2) * (1 - seg(t, splashT + .5, splashT + 1.2)), t);
    // Pip in the tub until the splash
    if (t < splashT) tubClip(TUB.x, TUB.y, () => pip(TUB.x - 30, tubRim() + 70, U, { ...faces(t, [[31, 'proud'], [36.8, 'surprised', { lookX: 1, lookY: -1 }]]), aL: .7, aR: -.2, ...kit('front', { noBrush: true }), noShadow: true, boilKey: 'pip' }));
    if (fall > .5) tubClip(TUB.x, TUB.y, () => { const p = arcPt([790, FY], [TUB.x, TUB.y + 120], 350, ease(fall)); pumpkin(p[0], p[1], U, { ...face('panic'), rot: lerp(-.35, -2.6, fall), aL: 1.4, aR: 1.4, noShadow: true, boilKey: 'pk' }); });
    tubFront(TUB.x, TUB.y, 1, t);
    if (t >= 31.6 && fall <= .5) {
      if (hop < 1) { const p = arcPt([850, 1130], [880, FY], 120, ease(hop)); PX = p[0]; dy = (p[1] - FY) / U; aL = aR = 1.0; }
      else if (t < 33.0) { PX = 880; aL = lerp(-1.2, 1.3, Math.sin(seg(t, 32.25, 32.8) * Math.PI)); }
      else if (t < 34.2) { const w = seg(t, 33.0, 33.6); PX = lerp(880, 820, ease(w)); if (w > 0 && w < 1) { view = 'side'; walk = t * 2.2; } aL = lerp(-1.2, 1.3, Math.sin(seg(t, 33.45, 34.0) * Math.PI)); }
      else if (t < 35.2) { PX = lerp(820, 790, seg(t, 34.2, 35.2)); view = 'side'; walk = t * 1.4; dy = -Math.abs(Math.sin(t * 5)) * .1; }
      else { PX = 790; rot = -.35 * ease(seg(t, 35.2, 36.0)) + (t > 36.3 ? Math.sin(t * 30) * .04 : 0); aL = lerp(-1.2, 1.0, ease(seg(t, 35.2, 36.0))); dy = -.3 * ease(seg(t, 35.2, 36.0)); }
      if (fall > 0) { const p = arcPt([790, FY], [TUB.x, TUB.y + 120], 350, ease(fall)); PX = p[0]; dy = (p[1] - FY) / U; rot = lerp(-.35, -2.6, fall); aL = aR = 1.4; }
      pumpkin(PX, FY, U, { ...pf, view, flip: true, walk, rot, aL, aR, dy, noShadow: hop < 1 || fall > 0, boilKey: 'pk' });
    }
    bubbles(t);
    // the splash, and Pip launched onto the rim
    splash8(TUB.x, tubRim(), 520, (t - splashT) / .9, 16, 5);
    if (t >= splashT) {
      const RIM = [705, tubRim() + 26];
      if (launch < 1) { const p = arcPt([TUB.x - 30, tubRim() + 40], RIM, 260, launch); pip(p[0], p[1], U, { ...face('panic'), rot: launch * TAU, aL: 1.3, aR: 1.3, ...kit('front', { noBrush: true }), noShadow: true, boilKey: 'pip' }); }
      else pip(...RIM, U, { ...face('dazed'), aL: .3, aR: -.6, ...kit('front', { noBrush: true }), noShadow: true, boilKey: 'pip' });
    }
    camEnd();
  }

  // 07 · 38–44 · Pumpkin rises out of the foam: soaked, thin, a bubble hat. "...I'm thin now." Pip laughs on the rim.
  function s07(t) {
    cam(560, 1360, 1.7);
    room(t);
    const rise = ease(seg(t, 38.4, 39.4)), rim = tubRim();
    tubBack(TUB.x, TUB.y, 1.1, t);
    const hat = (u, sw) => { for (const [a, b, r] of [[0, -11.3, 1.1], [-1.0, -10.9, .8], [1.0, -10.95, .85], [.3, -12.1, .7], [-.5, -11.9, .6]]) paint(ellPts(a * u, b * u, r * u, r * .85 * u, 14), { wash: BC8.foam, sw: sw * .6 }); };
    tubClip(TUB.x, TUB.y, () => pumpkin(TUB.x - 50, rim + lerp(13, 6, rise) * U, U, { ...faces(t, [[38, 'soggy'], [39.6, 'deadpan', { lid: .6 }], [42.6, 'annoyed', { lookX: 1, lid: .55 }]]),
      wet: 1, aL: -1.3, aR: -1.3, noShadow: true, draw: hat, who: 'pumpkin', boilKey: 'pk' }));
    tubFront(TUB.x, TUB.y, 1.1, t);
    // drips off his chin and ears
    if (rise > .5) for (let i = 0; i < 4; i++) { const k = frac(t * .9 + i * .27), dx = [-120, -60, 50, 110][i]; paint(ellPts(TUB.x - 50 + dx, rim - 380 + i % 2 * 120 + k * 260, 7, 10, 8), { wash: BC8.water, sw: .7 }); }
    const laugh = t > 41.6 && t < 43.6, sq = ease(seg(t, 42.5, 42.6)) * (1 - ease(seg(t, 42.7, 42.9)));
    pip(705, rim + 26, U, { ...faces(t, [[38, 'dazed'], [39.4, 'surprised'], [41.6, 'happy', { mouth: 'grin' }], [43.6, 'smug']]), aL: laugh ? .4 + Math.sin(t * 14) * .2 : .3, aR: laugh ? -.3 : -.6,
      dy: laugh ? -Math.abs(Math.sin(t * 14)) * .12 : 0, ...kit('front', { noBrush: true, sq }), noShadow: true, boilKey: 'pip' });
    bubbles(t);
    camEnd();
  }

  // 08 · 44–50 · Pip hops down, picks up his brush, walks back to his spot... turns, raises brush and duck. Lights down.
  // = frame 1.
  function s08(t) {
    if (t < 46.6) {
      cam(680, 1380, 1.5);
      room(t);
      tubBack(TUB.x, TUB.y, 1.1, t);
      tubClip(TUB.x, TUB.y, () => pumpkin(TUB.x - 50, tubRim() + 6 * U, U, { ...face('deadpan', { lid: .6, lookX: .8 }), wet: 1, aL: -1.3, aR: -1.3, noShadow: true, boilKey: 'pk',
        draw: (u, sw) => paint(ellPts(0, -11.3 * u, 1.1 * u, .95 * u, 14), { wash: BC8.foam, sw: sw * .6 }) }));
      tubFront(TUB.x, TUB.y, 1.1, t);
      const hop = seg(t, 44.4, 44.9), bend = Math.sin(seg(t, 44.9, 45.3) * Math.PI), walk = seg(t, 45.4, 46.4), has = t >= 45.1;
      if (!has) brushProp(...BRUSH_FLOOR, U, -.06);
      let px = 705, py = tubRim() + 26, view = 'front', aR = -.6, aL = .3, noShadow = true, sq = 0;
      if (hop > 0) { const p = arcPt([705, tubRim() + 26], [770, FY], 120, ease(hop)); px = p[0]; py = p[1]; aR = aL = 1.1; }
      if (hop >= 1) { noShadow = false; view = 'q'; sq = .2 * bend; aR = has ? .3 : -1.3; }
      if (walk > 0) { px = lerp(770, PIP0[0], ease(walk)); view = walk < 1 ? 'side' : 'front'; }
      pip(px, py, U, { ...faces(t, [[44, 'smug'], [45.4, 'determined', { brow: .6 }]]), view, aR, aL, sq, noShadow, walk: view === 'side' ? t * 2.4 : null, ...kit(view, { noBrush: !has }), boilKey: 'pip' });
      camEnd();
      return;
    }
    const k = ease(seg(t, 47.6, 48.8));
    cam(...MCU); room(t);
    const raise = backOut(seg(t, 46.8, 47.3));
    pipHero(t, raise, t < 47.3 ? face('determined', { brow: .6 }) : MENACE, k);
    camEnd(); spooky(k);
  }

  shots([[0, s01], [4, s02], [10, s03], [16, s04], [23, s05], [31, s06], [38, s07], [44, s08]]);
})();
