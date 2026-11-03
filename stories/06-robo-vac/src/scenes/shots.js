// shots.js: the 8 shots of "Pumpkin & Pip: The Robot Vacuum" (50 s, 1080 x 1920). See STORYBOARD.md.
// The living room from story 04, face-on: window + curtain LEFT, armchair + dock RIGHT. Last frame = first (loop).
(() => {
  const U = 40, PX = ROOM.home, FY = ROOM.floorY;
  const say = (who, t) => typeof SPEAK === 'function' ? SPEAK(who, t) : 0;
  const chew = (t, on = true) => on ? .28 * Math.max(0, Math.sin(t * 15)) : 0;
  const cam = (cx, cy, z, sh = [0, 0]) => camBegin(cx + sh[0], cy + sh[1], z);
  const SLEEP = { ...face('proud'), brow: 0, browUp: 0 };
  const CLING = [190, 1010];   // Pumpkin's feet while he clings to the curtain

  // where the vacuum is (x, scale, led, rot) at time t
  function VAC(t) {
    if (t < 4.5) return { x: lerp(1400, 790, ease(seg(t, 1.2, 3.8))), s: 1, led: 'red' };
    if (t < 9.3) return { x: 790, s: 1, led: 'red' };
    if (t < 15.5) return { x: lerp(790, 235, ease(seg(t, 9.6, 15.5))), s: 1, led: 'green' };
    if (t < 21.6) return { x: 235, s: 1, led: 'green', shake: t > 16 && t < 21 ? 1.5 : 0 };
    if (t < 30) { const a = (t - 21.6) * 1.7; return { x: 540 - 360 * Math.cos(a), s: 1 + .1 * Math.sin(a * 2), led: 'red', rot: .06 * Math.sin(a) }; }
    if (t < 45.5) return { x: lerp(540 - 360 * Math.cos(8.4 * 1.7), PX, ease(seg(t, 30, 45.2))), s: 1, led: 'blue', shake: t < 43 ? .8 : 0 };
    return { x: lerp(PX, 1400, easeIn(seg(t, 47.0, 49.2))), s: 1, led: 'red', rot: -.12 * Math.sin(seg(t, 45.8, 46.9) * Math.PI) };
  }
  const vacDraw = t => { const V = VAC(t); return robotVac(V.x, FY + 10, V.s * 1.3, t, V); };
  function loaf(x, y, t, o = {}) {
    pumpkin(x, y, U, { ...SLEEP, ...o.face, sq: .2 + Math.sin(t * 2.2) * .025 + (o.sq || 0), aL: -1.45, aR: -1.45, tailWag: .15, who: 'pumpkin', boilKey: 'pk', ...o.extra });
    if (o.zzz !== false) zzz(x + 120, y - 330, 1, t);
  }

  // 01 · 0–4.5 · Hook: asleep; a red light blinks in from the right, humming... bump.
  function s01(t, lt) {
    cam(PX + 40, 1330, 1.6);
    livingRoom6(t); curtain(t);
    const bump = 3.8;
    loaf(PX, FY, t, { sq: t > bump ? .1 * Math.exp(-(t - bump) * 6) * Math.cos((t - bump) * 22) : 0, extra: { dx: t > bump ? -.1 * Math.exp(-(t - bump) * 5) : 0 } });
    vacDraw(t);
    camEnd();
  }

  // 02 · 4.5–9 · Eyes pop, fur explodes, up the curtain he goes. "WHAT is THAT?!"
  function s02(t, lt) {
    cam(500, 1150, 1.0);
    livingRoom6(t);
    const jump0 = 4.75, grab = 5.35;
    curtain(t, 0, t > grab ? Math.exp(-(t - grab) * 2) * Math.sin((t - grab) * 7) : 0);
    vacDraw(t);
    const puff = backOut(seg(t, 4.5, 4.7));
    if (t < jump0) pumpkin(PX, FY, U, { ...face('surprised', { pupil: .02 }), puff, sq: -.2 * puff, aL: 1.2, aR: 1.2, boilKey: 'pk' });
    else if (t < grab) { const k = seg(t, jump0, grab), p = arcPt([PX, FY], CLING, 260, easeOut(k)); pumpkin(p[0], p[1], U, { ...face('panic'), puff: 1, sq: -.2, rot: -.4 * k, aL: 1.4, aR: 1.4, noShadow: true, boilKey: 'pk' }); }
    else pumpkin(CLING[0], CLING[1], U, { ...faces(t, [[grab, 'panic'], [7.6, 'panic', { lookX: 1, lookY: .8 }]]), puff: 1, aL: 1.5, aR: 1.35, noShadow: true, who: 'pumpkin', boilKey: 'pk',
      dx: Math.sin(t * 40) * .03 });
    puffCloud(PX, FY - 250, 200, t - 4.5);
    camEnd();
  }

  // 03 · 9–14 · Pip surfs in on top of it, munching, dropping crumbs. "Relax. It only eats crumbs."
  function s03(t, lt) {
    const V = VAC(t);
    cam(lerp(640, 420, ease(seg(t, 10, 14))), 1300, 1.25);
    livingRoom6(t); curtain(t);
    crumbs(t, V.x);
    const top = vacDraw(t);
    const hop = seg(t, 9.0, 9.5), from = [V.x + 260, FY];
    if (hop < 1) { const p = arcPt(from, top, 160, easeOut(hop)); pip(p[0], p[1], U, { ...face('happy'), view: 'side', flip: true, noShadow: true, boilKey: 'pip' }); }
    else pip(top[0] + 10, top[1], U, { ...faces(t, [[9, 'smug'], [10.5, 'deadpan', { lid: .3 }]]), view: 'q', flip: true, cracker: true, aR: .3, aL: .9, rot: -.08 + .04 * Math.sin(t * 3), scarfWind: .8,
      talk: Math.max(say('pip', t), chew(t, t < 10.4 || t > 12.6)), noShadow: true, boilKey: 'pip' });
    camEnd();
  }

  // 04 · 14–21 · The trail ends right under the curtain. His tail hangs down... SHLOOORP. "I'm... not... a crumb!"
  function s04(t, lt) {
    const V = VAC(t), suck = ease(seg(t, 15.8, 20.6));
    cam(320, 1160, 1.25);
    livingRoom6(t); curtain(t, 0, Math.sin(t * 5) * .3 * suck);
    crumbs(t, V.x);
    const top = vacDraw(t);
    // the tail: from his rear down into the vacuum's top, longer and thinner as it's sucked
    const pull = suck * 40, base = [CLING[0] + 60, CLING[1] - 2.6 * U + pull], tip = [lerp(base[0] + 80, top[0] + 30, suck), lerp(base[1] - 120, top[1] - 6, suck)];
    paint(ribbon([base, [lerp(base[0], tip[0], .5) + 30 * (1 - suck), lerp(base[1], tip[1], .5)], tip], U * lerp(1.1, .45, suck), U * lerp(.7, .3, suck)), { wash: PUMPKIN_COL.col, sw: 1.4, shade: true, shadeK: .5 });
    if (suck > .1) for (let k = 0; k < 3; k++) inkLine([[top[0] - 40 + k * 40, top[1] - 30 - k * 8], [top[0] - 20 + k * 30, top[1] - 70 - k * 8]], 2.4, '#FFFFFF', 'ink', 0);   // suction lines
    pumpkin(CLING[0], CLING[1] + pull, U, { ...faces(t, [[14, 'panic', { lookY: 1 }], [16.0, 'strain'], [17.9, 'strain', { mouth: 'gritted' }]]), puff: 1, sq: -.12 * suck, aL: 1.5, aR: 1.4,
      noTail: true, noShadow: true, who: 'pumpkin', boilKey: 'pk' });
    if (t > 14.6) pip(380, FY, U, { ...face('teasing'), view: 'q', flip: true, cracker: true, aR: .3, talk: chew(t), boilKey: 'pip' });
    else { const p = arcPt(top, [380, FY], 120, seg(t, 14.0, 14.6)); pip(p[0], p[1], U, { ...face('happy'), view: 'side', noShadow: true, boilKey: 'pip' }); }
    camEnd();
  }

  // 05 · 21–30 · The rod snaps, he drops onto it, and it takes him for a ride. "Make it stop! Make it STOP!"
  function s05(t, lt) {
    const fall = seg(t, 21.0, 21.55), land = 21.55, sh = t > land && t < land + .2 ? shakeXY(t, 10) : [0, 0];
    cam(540, 1250, 1.0, sh);
    livingRoom6(t); curtain(t, ease(seg(t, 21.0, 21.5)));
    // Pip sits on the armchair, BEHIND the ride: draw him first so Pumpkin passes in front of him
    if (t > 22) pip(860, ROOM.chair.seat + 8, U, { ...face('happy', { eyes: 'squeeze', mouth: 'grin' }), view: 'q', flip: true, cracker: true, aR: .3, boilKey: 'pip' });
    const top = vacDraw(t), V = VAC(t);
    if (t < land) { const p = arcPt(CLING, [235, FY - 80], 30, easeIn(fall)); pumpkin(p[0], p[1], U, { ...face('panic'), puff: 1, aL: 1.4, aR: 1.4, noShadow: true, boilKey: 'pk' }); }
    else pumpkin(top[0], top[1], U * V.s, { ...faces(t, [[land, 'dazed'], [22.4, 'panic'], [27.5, 'dazed']]), puff: 1, sq: .15 * Math.exp(-(t - land) * 6) + .05 * Math.sin(t * 30),
      rot: (V.rot || 0) * 2 - Math.cos((t - 21.6) * 1.7) * .15, aL: .2 + .2 * Math.sin(t * 9), aR: .2 - .2 * Math.sin(t * 9), noShadow: true, who: 'pumpkin', boilKey: 'pk' });
    for (let k = 0; k < 3; k++) if (t > 22) inkLine([[top[0] - Math.sign(Math.sin((t - 21.6) * 1.7)) * (190 + k * 30), top[1] + 20 + k * 30], [top[0] - Math.sign(Math.sin((t - 21.6) * 1.7)) * (260 + k * 30), top[1] + 20 + k * 30]], 3, '#FFFFFF', 'ink', 0);   // speed lines
    camEnd();
  }

  // 06 · 30–40 · It slows down... and hums... and vibrates. The fur settles. "...Oh. It vibrates." "This is... actually nice."
  function s06(t, lt) {
    const V = VAC(t), relax = ease(seg(t, 31.5, 36.0));
    cam(lerp(V.x, 540, .3), 1300, 1.35);
    livingRoom6(t); curtain(t, 1);
    const top = vacDraw(t);
    const pf = faces(t, [[30, 'dazed'], [31.6, 'surprised', { lookY: .9 }], [33.4, 'sheepish', { lid: .3 }], [35.4, 'happy', { blush: .5 }], [37.8, 'proud']]);
    pumpkin(top[0], top[1], U, { ...pf, puff: 1 - relax, sq: .2 * relax + Math.sin(t * 60) * .012, dx: Math.sin(t * 55) * .015, aL: lerp(.2, -1.45, relax), aR: lerp(.2, -1.45, relax),
      noShadow: true, tailWag: .2, who: 'pumpkin', boilKey: 'pk' });
    if (t > 37.8) zzz(top[0] + 120, top[1] - 330, 1, t);
    camEnd();
  }

  // 07 · 40–45 · Pip on the armchair, munching, smug: "Told you." The vacuum glides past with Pumpkin asleep on top.
  function s07(t, lt) {
    cam(700, 1180, 1.15);
    livingRoom6(t); curtain(t, 1);
    pip(860, ROOM.chair.seat + 8, U, { ...faces(t, [[40, 'munching'], [41.2, 'smug']]), view: 'q', flip: true, cracker: true, aR: .3, talk: Math.max(say('pip', t), chew(t, t < 41.2 || t > 42.6)), boilKey: 'pip' });
    const top = vacDraw(t);
    loaf(top[0], top[1], t, { extra: { noShadow: true } });
    camEnd();
  }

  // 08 · 45–50 · Back at the spot it tilts, he slides off onto the floor (still asleep), it reverses out right = frame 1.
  function s08(t, lt) {
    const k = ease(seg(t, 46.8, 49.6));
    cam(lerp(560, PX + 40, k), lerp(1260, 1330, k), lerp(1.2, 1.6, k));
    livingRoom6(t); curtain(t, 1);   // the fallen curtain lies left, outside the final (= first) frame
    const V = VAC(t), slide = ease(seg(t, 46.0, 46.8));
    if (t < 46.0) { const top = vacDraw(t); loaf(top[0], top[1], t, { extra: { noShadow: true } }); }
    else { loaf(PX, lerp(FY - 80, FY, slide), t, { extra: { rot: (1 - slide) * -.2 } }); vacDraw(t); }
    camEnd();
  }

  shots([[0, s01], [4.5, s02], [9, s03], [14, s04], [21, s05], [30, s06], [40, s07], [45, s08]]);
})();
