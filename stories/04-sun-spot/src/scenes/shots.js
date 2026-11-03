// shots.js: the 8 shots of "Pumpkin & Pip: The Sun Spot" (50 s, 1080 x 1920). See STORYBOARD.md.
// One room, seen face-on, window LEFT, armchair RIGHT. Pumpkin sleeps as a "loaf" and slides after the sun spot;
// the last frame matches the first (loop).
(() => {
  const U = 40;
  const say = (who, t) => typeof SPEAK === 'function' ? SPEAK(who, t) : 0;
  const cam = (cx, cy, z, sh = [0, 0]) => camBegin(cx + sh[0], cy + sh[1], z);
  const SLEEP = { ...face('proud'), brow: 0, browUp: 0 };   // eyes shut, content little smile

  // Pumpkin asleep as a loaf at x on the floor (or on the seat), purring: a slow breathing squash.
  function loaf(x, y, t, o = {}) {
    const breathe = Math.sin(t * 2.2) * .025;
    pumpkin(x, y, U, { ...SLEEP, ...o.face, sq: .2 + breathe + (o.sq || 0), dy: o.dy || 0, rot: o.rot || 0, aL: -1.45, aR: -1.45, tailWag: .15,
      who: 'pumpkin', boilKey: 'pk', emote: null, ...o.extra });
    if (o.zzz !== false) zzz(x + 120, y - 330, 1, t);
  }
  // where Pumpkin is while he sleep-slides after the floor spot (he lags each jump by ~0.6 s, with a little scoot hop)
  function slideX(t, steps, x0) {
    let x = x0, hop = 0;
    for (const [a, b, to] of steps) { const k = ease(seg(t, a + .55, b + .75)); x = lerp(x, to, k); hop += Math.sin(seg(t, a + .55, b + .75) * Math.PI); }
    return { x, hop };
  }

  // 01 · 0–5 · The hook: asleep in the spot. "Mmm... perfect." The spot starts to slide; he slides after it.
  function s01(t, lt) {
    cam(ROOM.spot0 + 40 + lt * 4, 1330, 1.6);
    livingRoom(t); sunLight(t);
    const p = slideX(t, SUN_STEPS.slice(0, 1), ROOM.spot0);
    loaf(p.x, ROOM.floorY, t, { dy: -p.hop * .35, sq: p.hop * .05 });
    camEnd();
  }

  // 02 · 5–12 · Step, scoot, step, scoot. "Don't move, sun." The last step is fast; he barely keeps up.
  function s02(t, lt) {
    const p = slideX(t, SUN_STEPS, ROOM.spot0);
    cam(lerp(p.x, SUN(t).x, .4), 1300, 1.25);
    livingRoom(t); sunLight(t);
    loaf(p.x, ROOM.floorY, t, { dy: -p.hop * .35, sq: p.hop * .05, rot: (SUN(t).x - p.x) * .0006 });
    camEnd();
  }

  // 03 · 12–18 · Time-lapse, wide: the light turns orange, the spot crosses the rug and climbs onto the chair; he follows, still asleep, and hops up.
  function s03(t, lt) {
    cam(540, 1100, 1.0);
    livingRoom(t); sunLight(t);
    const S = SUN(t), seatY = ROOM.chair.seat + 8;
    let x, y, dy = 0, sq = .2, rot = 0;
    if (t < 14.8) { x = lerp(760, Math.min(S.x, 820), ease(seg(t, 12.6, 14.6))); y = ROOM.floorY; }
    else if (t < 15.8) { const k = seg(t, 14.9, 15.7), p = arcPt([820, ROOM.floorY], [850, seatY], 260, easeOut(k)); x = p[0]; y = p[1]; sq = k < .1 ? .3 : -.1 * Math.sin(k * Math.PI); rot = .2 * Math.sin(k * Math.PI); }
    else { x = 850; y = seatY; sq = .2 + .15 * Math.exp(-(t - 15.8) * 6); }
    loaf(x, y, t, { sq: sq - .2, rot });
    camEnd();
    warmOverlay(seg(t, 12, 18) * .8);
  }

  // 04 · 18–25 · The spot climbs the wall; he stands on tiptoe and stretches like an elastic band after it.
  function s04(t, lt) {
    cam(820, 960, 1.3);
    livingRoom(t); sunLight(t);
    const S = SUN(t), reach = clamp((ROOM.chair.seat - 70 - S.y) / 520);   // 0 at the seat .. 1 high up the wall
    const sway = Math.sin(t * 3.1) * .05 * reach;
    pumpkin(850, ROOM.chair.seat + 8, U, { ...faces(t, [[18, 'proud'], [19.0, 'strain', { blush: .3 }]]), sq: lerp(.2, -.62, ease(reach)), rot: sway,
      aL: lerp(-1.45, 1.5, ease(seg(reach, 0, .35))), aR: lerp(-1.45, 1.45, ease(seg(reach, 0, .35))), dy: -reach * .3, tailWag: .8, who: 'pumpkin', boilKey: 'pk' });
    camEnd();
    warmOverlay(.8);
  }

  // 05 · 25–30 · The sun hides. He hangs in mid-air for a beat (cartoon rules), drops, wakes up freezing: "WHO turned off the sun?!"
  function s05(t, lt) {
    const land = 26.4, sh = t > land && t < land + .25 ? shakeXY(t, 10) : [0, 0];
    cam(lerp(820, 700, ease(seg(t, 26.6, 27.4))), lerp(960, 1150, ease(seg(t, 26.6, 27.4))), lerp(1.3, 1.1, ease(seg(t, 26.6, 27.4))), sh);
    livingRoom(t); sunLight(t);
    let x = 850, y = ROOM.chair.seat + 8, sq = -.62, aU = 1.5, pf, rot = 0, extra = {};
    if (t < 25.95) { pf = face('strain', { blush: .3 }); }                                   // still stretched, the light gone
    else if (t < land) { const k = seg(t, 25.95, land), p = arcPt([850, ROOM.chair.seat + 8], [720, ROOM.floorY], -40, easeIn(k)); x = p[0]; y = p[1]; sq = lerp(-.62, -.2, k); pf = face('surprised'); rot = -.3 * k; }
    else { x = 720; y = ROOM.floorY; sq = .25 * Math.exp(-(t - land) * 7) * Math.cos((t - land) * 24); aU = -1.3; pf = faces(t, [[land, 'dazed'], [26.9, 'panic'], [27.5, 'annoyed', { brow: .9 }]]);
      extra = { dx: Math.sin(t * 46) * .05 * seg(t, 26.9, 27.2) }; }
    pumpkin(x, y, U, { ...pf, sq, rot, aL: aU, aR: aU, who: 'pumpkin', tailWag: 1, boilKey: 'pk', ...extra });
    if (t > 26.9) shiver(720, ROOM.floorY - 260, 1, t);
    camEnd();
    warmOverlay((1 - seg(t, 25.4, 26.0)) * .8);
    coolOverlay(seg(t, 25.4, 26.4));
  }

  // Pip on the windowsill with the lid; returns the mirror's world position (the beam's source).
  function pipOnSill(t, o = {}) {
    const s = ROOM.sill, walk = seg(t, 30.0, 30.9), px = lerp(s.x + 40, s.x + 250, ease(walk)), py = s.y;
    const lift = ease(seg(t, 31.6, 32.0)), tire = seg(t, 43.6, 46), tremble = Math.sin(t * 34) * .09 * tire;
    const aR = walk < 1 ? -1.1 : lerp(-1.1, .95, lift) + tremble - tire * .25;
    if (t > 47.2) {   // gives up: props the lid on the sill (it keeps reflecting) and walks off left, out of the frame
      const k = seg(t, 47.4, 48.5);
      pip(lerp(px, s.x - 260, k), py, U, { view: 'side', flip: true, walk: k * 4, ...face('happy'), boilKey: 'pip', noShadow: true });
      return LID;
    }
    if (walk < 1) pip(px, py, U, { view: 'side', walk: walk * 3, ...face('determined'), boilKey: 'pip', noShadow: true });
    else pip(px, py, U, { view: 'q', aR, aL: -.4 + .2 * tire, ...o.face, who: 'pip', boilKey: 'pip', noShadow: true,
      armR: (u, sw) => { crackerLid(u * .9, 0, u * .95, .4, t); } });
    // mirror position ≈ the paw (shoulder + arm) in world space
    const sx = px + 1.32 * U, sy = py - 2.7 * U, ang = aR;
    return [sx + Math.cos(ang) * 1.3 * U + Math.cos(ang) * .9 * U, sy - Math.sin(ang) * 1.3 * U - Math.sin(ang) * .9 * U];
  }

  // 06 · 30–36 · Pip on the sill catches the last sun with the lid. "Sunshine delivery!" A new spot lands mid-floor.
  function s06(t, lt) {
    const z = lerp(1.45, 1.05, ease(seg(t, 32.2, 33.4)));
    cam(lerp(260, 470, ease(seg(t, 32.2, 33.4))), lerp(930, 1180, ease(seg(t, 32.2, 33.4))), z);
    livingRoom(t);
    const m = pipOnSill(t, { face: faces(t, [[30, 'determined'], [31.0, 'happy'], [32.4, 'smug']]) });
    sunLight(t, m);
    if (t > 32.0) burst(m[0], m[1], 70, (t - 32.0) / .5, 8, '#FFFFFF');
    pumpkin(720, ROOM.floorY, U, { ...faces(t, [[30, 'annoyed'], [32.1, 'surprised', { lookX: -.9, lookY: .2 }], [33.2, 'greedy']]), aL: -1.3, aR: -1.3,
      dx: Math.sin(t * 46) * .04 * (1 - seg(t, 32.0, 32.6)), who: 'pumpkin', boilKey: 'pk' });
    if (t < 32.4) shiver(720, ROOM.floorY - 260, 1, t);
    camEnd();
    coolOverlay(1 - seg(t, 32.0, 33.0) * .85);
  }

  // 07 · 36–43 · He flops into the delivered spot: "Five stars." Cut to Pip: "Tips accepted in crackers."
  function s07(t, lt) {
    const onPip = t >= 39.9;
    if (!onPip) cam(500, 1330, 1.45); else cam(300, 930, 1.55);
    livingRoom(t);
    const m = pipOnSill(t, { face: faces(t, [[36, 'smug'], [40.1, 'teasing']]) });
    sunLight(t, m);
    let x = 480, y = ROOM.floorY;
    if (t < 37.0) { const k = seg(t, 36.1, 36.9), p = arcPt([720, ROOM.floorY], [480, ROOM.floorY], 120, ease(k)); x = p[0]; y = p[1]; }
    const melt = ease(seg(t, 37.0, 37.5));
    if (t < 37.0) pumpkin(x, y, U, { ...face('greedy'), sq: .1, aL: 1.0, aR: 1.0, boilKey: 'pk' });
    else loaf(x, y, t, { face: { ...face('happy', { blush: .5 }) }, sq: .1 * melt + .2 * Math.exp(-(t - 37) * 6) * Math.cos((t - 37) * 20), zzz: t > 38.6, extra: { who: 'pumpkin' } });
    camEnd();
    coolOverlay(.15);
  }

  // 08 · 43–50 · "Uh-oh. Arm's getting tired..." The spot wobbles and drifts; Pumpkin starts sliding after it again.
  // The camera pushes back to shot 01's frame (Pip leaves the frame), so the film loops.
  function s08(t, lt) {
    const k = ease(seg(t, 45.6, 49.8));
    cam(lerp(420, ROOM.spot0 + 40, k), lerp(1150, 1330, k), lerp(1.05, 1.6, k));
    livingRoom(t);
    const m = pipOnSill(t, { face: faces(t, [[43, 'smug'], [43.7, 'panic'], [46, 'strain']]) });
    sunLight(t, m);
    const S = SUN(t), lagX = lerp(480, ROOM.spot0, ease(seg(t, 46.8, 49.6)));
    const hop = Math.abs(Math.sin(seg(t, 46.8, 49.6) * Math.PI * 3)) * (t > 46.8 && t < 49.6 ? 1 : 0);
    loaf(lagX, ROOM.floorY, t, { dy: -hop * .3, sq: hop * .04, rot: (S.x - lagX) * .0006 });
    camEnd();
    coolOverlay(.15 * (1 - k));
  }

  shots([[0, s01], [5, s02], [12, s03], [18, s04], [25, s05], [30, s06], [36, s07], [43, s08]]);
})();
