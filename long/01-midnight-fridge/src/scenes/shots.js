// shots.js: "Pumpkin & Pip: The Midnight Fridge" (16:9, 200 s). See ../STORYBOARD.md.
// Part 1 (0-60) is built; parts 2 and 3 are placeholders until they are made; End Screen 180-200.
// Living room: characters on the floor at y = 1560. Kitchen: floor line 1310, characters at y = 1420, fridge RIGHT.
(() => {
  const U = 40, FY = FY1, FK = 1420, LAMP = [470, FK];
  const cam = (cx, cy, z, sh = [0, 0]) => camBegin(cx + sh[0], cy + sh[1], z);
  const shake = (t, t0, amp = 10, dur = .35) => t > t0 && t < t0 + dur ? [Math.sin(t * 90) * amp * (1 - (t - t0) / dur), Math.cos(t * 77) * amp * .6 * (1 - (t - t0) / dur)] : [0, 0];
  const roomNight = t => { livingRoom6(t); curtain(t); };
  const shades = (u, sw, dy = -8.75) => { for (const s of [-1, 1]) paint(ellPts(s * 1.15 * u, dy * u, .95 * u, .62 * u, 14), { wash: '#1E2533', sw }); inkLine([[-.3 * u, dy * u], [.3 * u, dy * u]], sw * 2, '#1E2533', 'ink', 0); };
  const pipShades = (u, sw) => { for (const s of [-1, 1]) paint(ellPts(s * .6 * u, -4.75 * u, .45 * u, .32 * u, 12), { wash: '#1E2533', sw: sw * .7 }); inkLine([[-.2 * u, -4.75 * u], [.2 * u, -4.75 * u]], sw, '#1E2533', 'ink', 0); };
  function floorLamp(x, y, withShade = true) { paint(ellPts(x, y - 4, 60, 14, 18), { wash: '#6B5A4E', sw: 1 }); paint(rectPts(x - 6, y - 620, 12, 616), { wash: '#C9A44C', sw: 1 }); if (withShade) lampShade(x, y - 600, 1.2); }

  // 1-1 · 0–6 · Midnight. The clock strikes twelve. The fridge door, ajar, glows: the last slice of cake, DO NOT EAT.
  // Two pairs of eyes shine in the dark doorway.
  function s1_1(t) {
    if (t < 2.2) { cam(KIT.clock[0], KIT.clock[1] - 140, 2.6, shake(t, .6, 4, .3)); kitchen(t, { minutes: 0 }); camEnd(); night(.85); return; }
    if (t < 4.4) {
      const open = lerp(.12, .5, ease(seg(t, 2.2, 3.6)));
      cam(1460, 900, lerp(2.0, 2.3, seg(t, 2.2, 4.4))); kitchen(t, { minutes: 0, fridgeOpen: open }); camEnd(); night(.8);
      cam(1460, 900, lerp(2.0, 2.3, seg(t, 2.2, 4.4))); glow(1460, 900, 420, '#DDF2FF', .55); cakeSlice(1460, KIT.fridge[1] - 820 + 465, 1, true, seg(t, 3.0, 3.4)); camEnd();
      return;
    }
    cam(240, 1050, 1.6); kitchen(t, { minutes: 1 }); camEnd(); night(1);
    const blink = t > 5.1 && t < 5.25;
    cam(240, 1050, 1.6);
    for (const [x, y, r] of [[60, 900, 34], [150, 900, 34]]) { glow(x, y, r * 2.4, '#E9F27A', .25); if (!blink) { paint(ellPts(x, y, r, r * 1.15, 18), { wash: '#C9E04A', ink: null }); paint(ellPts(x, y, r * .35, r, 12), { wash: '#1B1638', ink: null }); paint(ellPts(x - r * .3, y - r * .4, r * .2, r * .2, 8), { wash: '#FFFFFF', ink: null }); } }
    for (const [x, y, r] of [[190, 1235, 12], [222, 1235, 12]]) { if (!blink) { paint(ellPts(x, y, r, r * 1.1, 12), { wash: '#FFFFFF', ink: null }); paint(ellPts(x, y, r * .55, r * .6, 10), { wash: '#1B1638', ink: null }); } }
    camEnd();
  }

  // 1-2 · 6–14 · Living room, night. Pip, flashlight under his chin like a ghost story, unrolls a crayon plan.
  // "Operation... Cake." Pumpkin's pupils go huge.
  function s1_2(t) {
    cam(560, 1300, 1.25);
    roomNight(t);
    const unroll = ease(seg(t, 7.0, 7.6));
    pumpkin(780, FY, U, { ...faces(t, [[6, 'neutral', { lookX: -1 }], [10.4, 'greedy', { lookX: -1, pupil: 1.15 }]]), aL: -1.1, aR: -1.1, boilKey: 'pk' });
    pip(470, FY, U, { ...faces(t, [[6, 'smug', { brow: .7, lid: .45 }], [8.6, 'smug', { brow: .8, lid: .3 }]]), view: 'q', aR: -.2, aL: .9, armR: flashHook(1), who: 'pip', boilKey: 'pip' });
    if (unroll > 0) { push(); translate(180, 1250); scale(unroll, 1); planPaper(0, 0, 300, 220, -.05); pop(); }
    camEnd();
    night(.85);
    cam(560, 1300, 1.25); glow(510, 1330, 260, '#FFE9A8', .65); glow(180, 1250, 220, '#FFE9A8', .35); camEnd();
  }

  // 1-3 · 14–30 · The plan, as Pip imagines it, on crayon paper: 1. SNEAK (cool sunglasses tiptoe), 2. CLIMB (a slow-motion
  // backflip onto the crayon fridge), 3. CAKE (heavenly light, the slice descends, fireworks). Then the paper crumples away.
  function s1_3(t) {
    const unroll = ease(seg(t, 14.0, 14.6)), crumple = easeIn(seg(t, 28.8, 29.8));
    push(); translate(W / 2, H / 2); scale(unroll * (1 - crumple), 1 - crumple); rotate(crumple * 3); translate(-W / 2, -H / 2);
    paint(rectPts(-20, -20, W + 40, H + 40), { wash: '#FBF6E8', ink: null });
    for (let i = 1; i < 14; i++) inkLine([[0, i * 78], [W, i * 78]], 1.4, '#BFD6EA', 'ink', 0);
    inkLine([[150, 0], [150, H]], 2, '#F4A7B5', 'ink', 0);
    crayon([[0, 960], [W, 960]], '#8E6A55', 8);   // the crayon floor
    crayon([[1360, 958], [1360, 520], [1640, 520], [1640, 958]], '#4F7FC9', 9, 3);   // the crayon fridge
    crayon([[1360, 680], [1640, 680]], '#4F7FC9', 6, 4);
    const U2 = 30;
    if (t < 19) {   // 1. SNEAK
      letter('1. SNEAK', 420, 140, 90, '#E2463F', { font: '800 90px "Baloo 2", sans-serif', rot: -.04 });
      const k = seg(t, 14.6, 19), x = lerp(250, 1100, k), bob = -Math.abs(Math.sin(t * 7)) * .3;
      for (let i = 0; i < 8; i++) { const fx = 250 + i * 110; if (fx < x - 120) paint(ellPts(fx, 975 + (i % 2) * 14, 14, 7, 8), { wash: '#C9A06A', ink: null }); }
      pumpkin(x - 170, 958, U2, { ...face('smug', { mouth: 'smirk' }), view: 'q', dy: bob, sq: .15, aL: -.4, aR: -.4, draw: (u, sw) => shades(u, sw), noShadow: true, boilKey: 'pk' });
      pip(x + 60, 958, U2, { ...face('smug'), view: 'q', dy: bob, sq: .1, aL: .2, aR: -.2, draw: pipShades, noShadow: true, boilKey: 'pip' });
    } else if (t < 23.5) {   // 2. CLIMB: the slow-motion backflip
      letter('2. CLIMB', 420, 140, 90, '#4F7FC9', { font: '800 90px "Baloo 2", sans-serif', rot: .03 });
      const k = ease(seg(t, 19.2, 22.6)), p = arcPt([900, 958], [1500, 520], 330, k);
      pumpkin(p[0], p[1], U2, { ...face('smug', { mouth: 'smirk' }), rot: -k * TAU, aL: 1.2, aR: 1.2, draw: (u, sw) => shades(u, sw), noShadow: true, boilKey: 'pk' });
      push(); translate(p[0], p[1]); rotate(-k * TAU); pip(0, -13.0 * U2, U2 * .9, { ...face('smug'), aL: 1.2, aR: 1.2, draw: pipShades, noShadow: true, boilKey: 'pip' }); pop();
      for (let i = 0; i < 5; i++) { const q = clamp(k - i * .06); const pp = arcPt([900, 958], [1500, 520], 330, q); paint(starPts(pp[0], pp[1] - 200, 16, .3, 5), { wash: '#F7D154', ink: null }); }
    } else {   // 3. CAKE: heavenly light
      letter('3. CAKE!!!', 520, 140, 110, '#E2463F', { font: '800 110px "Baloo 2", sans-serif', rot: -.05 });
      for (let i = 0; i < 9; i++) { const a = Math.PI / 2 + (i - 4) * .16 + Math.sin(t) * .03; paint([[1500, -100], [1500 + Math.cos(a - .05) * 1400, -100 + Math.sin(a - .05) * 1400], [1500 + Math.cos(a + .05) * 1400, -100 + Math.sin(a + .05) * 1400]], { wash: '#FFF3B0', washOp: 90, ink: null }); }
      glow(1500, 260, 420, '#FFF3B0', .7);
      const d = easeOut(seg(t, 23.6, 25.4));
      cakeSlice(1240, lerp(-60, 470, d), 1.3, true, seg(t, 25.0, 25.5));
      pumpkin(1440, 520, U2, { ...faces(t, [[23.5, 'surprised', { eyes: 'wide' }], [25.4, 'happy', { blush: .6 }]]), aL: 1.4, aR: 1.4, draw: (u, sw) => shades(u, sw), noShadow: true, boilKey: 'pk' });
      pip(1590, 520, U2, { ...faces(t, [[23.5, 'surprised'], [25.4, 'happy']]), view: 'q', flip: true, aL: 1.4, aR: 1.4, draw: pipShades, noShadow: true, boilKey: 'pip' });
      for (let i = 0; i < 6; i++) { const k = frac((t - 25.4) * .7 + i / 6); if (t > 25.4) crayon([[300 + i * 160, 700 - k * 300], [300 + i * 160 + 40 * Math.cos(i), 700 - k * 300 - 40]], ['#E2463F', '#F7D154', '#4FA060'][i % 3], 7, i); }
    }
    pop();
    if (crumple > 0) paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#16143A', washOp: 255 * crumple, ink: null });
  }

  // 1-4 · 30–40 · Back to the dark living room: "I love this plan." Pip ties his scarf into a ninja mask; Pumpkin squeezes
  // into a tiny black sweater (RIP) and paints war stripes. Spy pose.
  function s1_4(t) {
    const z = t > 37.2 ? lerp(1.25, 1.5, ease(seg(t, 37.2, 38.2))) : 1.25;
    cam(600, 1300, z, shake(t, 36.2, 10, .4));
    roomNight(t);
    const drop = ease(seg(t, 32.8, 35.6)), rip = t > 36.2 ? backOut(seg(t, 36.2, 36.4)) : 0, pose = t > 37.2;
    const pumpkinDraw = drop > 0 ? (u, sw) => { push(); translate(0, -(1 - drop) * 7 * u); blackSweater(rip)(u, sw); pop(); } : undefined;
    pumpkin(780, FY, U, { ...faces(t, [[30, 'happy', { blush: .5 }], [32.6, 'strain'], [36.2, 'surprised', { eyes: 'wide' }], [37.2, 'determined', { brow: .8 }]]),
      aL: pose ? .3 : drop > 0 && drop < 1 ? 1.4 : -1.1, aR: pose ? -.4 : drop > 0 && drop < 1 ? 1.4 : -1.1, sq: pose ? .15 : drop > 0 && drop < 1 ? -.05 + Math.sin(t * 30) * .03 : 0,
      draw: pumpkinDraw, who: 'pumpkin', boilKey: 'pk' });
    burst(780, FY - 210, 200, (t - 36.2) / .35, 10, '#FFFFFF', 4);
    const mask = backOut(seg(t, 31.4, 31.8));
    pip(430, FY, U, { ...faces(t, [[30, 'smug'], [37.2, 'determined', { brow: .8 }]]), view: 'q', aL: t < 31.6 ? 1.3 : pose ? .4 : -.6, aR: t < 31.6 ? 1.3 : pose ? -.6 : -.4, sq: pose ? .2 : 0,
      draw: mask > 0 ? (u, sw) => { push(); scale(mask, 1); ninjaMask(1)(u, sw); pop(); } : undefined, boilKey: 'pip' });
    camEnd();
    night(.75);
  }

  // 1-5 · 40–52 · Kitchen doorway, wide. They tiptoe in along the counter; the robot vacuum (night-patrol mode: red eye,
  // searchlight) sweeps the floor. They freeze whenever the beam swings near.
  const VAC = [1020, FK + 10];
  const beamAngle = t => Math.PI * (.5 - .5 * Math.cos((t - 40) * .9));   // right -> down -> left -> ...
  function s1_5(t) {
    cam(620, 1120, 1.15);
    kitchen(t, { minutes: 3 });
    floorLamp(...LAMP);
    pottedPlant(300, FK + 20, .9);
    robotVac(VAC[0], VAC[1], 1.0, t, { led: 'red' });
    const freeze = Math.sin((t - 40) * .9) > .55, k = seg(t, 40.5, 51.0);
    const px = lerp(120, 560, k), bob = freeze ? 0 : -Math.abs(Math.sin(t * 6)) * .25;
    pumpkin(px - 320, FK, U, { ...face(freeze ? 'surprised' : 'determined', freeze ? { eyes: 'wide' } : { brow: .7 }), view: 'q', sq: .18, dy: bob, aL: -.6, aR: -.6, draw: (u, sw) => blackSweater(1)(u, sw), boilKey: 'pk' });
    pip(px, FK, U, { ...face(freeze ? 'surprised' : 'determined', freeze ? {} : { brow: .7 }), view: 'q', sq: .2, dy: bob, aL: .3, aR: -.4, draw: ninjaMask(1), boilKey: 'pip' });
    camEnd();
    night(.75);
    cam(620, 1120, 1.15); searchlight(VAC[0] - 60, VAC[1] - 40, beamAngle(t) + Math.PI, 900, .2); glow(VAC[0] + 90, VAC[1] - 33, 60, '#FF4A4A', .6); camEnd();
  }

  // 1-6 · 52–60 · The beam swings their way. Pip dives behind the plant; Pumpkin snatches the lampshade, plants himself next
  // to the pole and freezes. The beam lands on his face. "...Lamp." Hold.
  function s1_6(t) {
    const z = lerp(1.35, 1.6, ease(seg(t, 57.0, 60)));
    cam(520, 1130, z);
    kitchen(t, { minutes: 3 });
    const grab = seg(t, 53.4, 53.9);
    floorLamp(...LAMP, grab <= 0);
    const dive = seg(t, 52.4, 52.9);
    const pp = dive < 1 ? arcPt([360, FK], [270, FK], 90, ease(dive)) : [270, FK];
    pip(pp[0], pp[1], U, { ...faces(t, [[52, 'surprised'], [53, 'panic', { eyes: 'squeeze' }]]), view: 'q', flip: true, sq: dive >= 1 ? .25 : 0, aL: 1.2, aR: 1.2, draw: ninjaMask(1), noShadow: dive < 1, boilKey: 'pip' });
    pottedPlant(300, FK + 20, .9);
    const stiff = t > 53.9;
    pumpkin(600, FK, U, { ...faces(t, [[52, 'surprised', { eyes: 'wide' }], [53.9, 'neutral', { eyes: 'wide', lid: 0, pupil: .4, mouth: 'flat' }], [57.0, 'neutral', { eyes: 'wide', lid: 0, pupil: .3, lookX: 1, mouth: 'flat' }]]),
      aL: stiff ? -1.5 : 1.2, aR: stiff ? -1.5 : 1.2, rot: !stiff && t > 53.0 ? Math.sin(t * 30) * .03 : 0,
      draw: (u, sw) => { blackSweater(1)(u, sw); if (stiff) shadeHook(0)(u, sw); }, who: 'pumpkin', boilKey: 'pk' });
    if (grab > 0 && grab < 1) { const p = arcPt([LAMP[0], LAMP[1] - 600], [600, FK - 10.3 * U], 80, ease(grab)); lampShade(p[0], p[1], 1.2 + .55 * grab, grab * 3); }
    camEnd();
    night(.75);
    cam(520, 1130, z);
    const a = lerp(Math.PI + .5, Math.PI + .1, ease(seg(t, 54.0, 56.5)));
    searchlight(1300, FK - 300, a, 760, .14);
    if (t > 56.5) glow(600, FK - 8.4 * U, 140, '#FFF3B0', .8);
    camEnd();
  }

  function placeholder(n) {
    return t => { paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#2B2233', ink: null }); letter(`PART ${n} (not built yet)`, W / 2, H / 2, 80, '#FFFFFF', { screen: true }); };
  }
  shots([[0, s1_1], [6, s1_2], [14, s1_3], [30, s1_4], [40, s1_5], [52, s1_6], [60, placeholder(2)], [120, placeholder(3)], [180, t => endScreen(t, 180, { hat: true })]]);
})();
