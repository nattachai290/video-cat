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


  // Pumpkin's spy look after the dress-up: the ripped sweater worn as a scarf, and a crayon moustache. (body space)
  const mustache = (u, sw) => { for (const s of [-1, 1]) paint(ribbon([[0, -7.95 * u], [s * .9 * u, -7.75 * u], [s * 1.7 * u, -8.15 * u], [s * 1.9 * u, -8.6 * u]], .55 * u, .2 * u), { wash: '#262A33', sw: sw * .6 }); };
  const blackScarf = (u, sw) => { paint(ellPts(0, -5.2 * u, 3.3 * u, .6 * u, 22), { wash: '#262A33', sw }); paint(ribbon([[2.2 * u, -5.0 * u], [2.8 * u, -3.8 * u], [2.6 * u, -2.9 * u]], .9 * u, .6 * u), { wash: '#262A33', sw }); };
  const spyLook = (u, sw) => { blackScarf(u, sw); mustache(u, sw); };
  const growl = (t, t0, x, y) => { const a = t - t0; if (a > 0 && a < 1.4) letter('GRRRWL', x + Math.sin(t * 60) * 6, y, 70, '#E2463F', { stroke: '#2B2233', pop: a * 4, rot: -.08, alpha: 1 - seg(a, 1.0, 1.4) }); };

  // 1-1 · 0–4 · Hook: the fridge light, the cake (DO NOT EAT). An orange paw creeps in... the door SLAMS on it. Title.
  function s1_1(t) {
    const slam = seg(t, 2.0, 2.2), open = .55 * (1 - easeIn(slam));
    if (t < 2.45) {
      cam(1460, 900, 2.2, shake(t, 2.2, 14, .3));
      kitchen(t, { minutes: 0, fridgeOpen: open }); camEnd(); night(.8);
      cam(1460, 900, 2.2, shake(t, 2.2, 14, .3));
      if (open > .02) { glow(1460, 900, 420, '#DDF2FF', .55 * open / .55); cakeSlice(1460, KIT.fridge[1] - 820 + 465, 1, true, seg(t, .2, .5)); }
      const reach = ease(seg(t, .5, 1.9));
      if (t < 2.2) { const tip = [lerp(1220, 1390, reach), lerp(1150, 950, reach)]; paint(ribbon([[1160, 1260], [lerp(1190, 1320, reach), lerp(1210, 1030, reach)], tip], 70, 90), { wash: PUMPKIN_COL.col, sw: 2 }); paint(ellPts(tip[0] + 10, tip[1] - 10, 58, 46, 16), { wash: PUMPKIN_COL.col, sw: 2 }); for (const d of [-20, 0, 20]) inkLine([[tip[0] + 40 + d * .3, tip[1] - 30 + d], [tip[0] + 64, tip[1] - 26 + d * 1.2]], 2, '#8A4A22', 'ink', 0); }
      else paint(ellPts(1648, 1000, 46, 30, 14), { wash: PUMPKIN_COL.col, sw: 2 });   // the paw, caught in the door
      camEnd();
      flash(seg(t, 2.2, 2.3) * (1 - seg(t, 2.3, 2.45)) * .8);
      return;
    }
    paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#16143A', ink: null });
    for (let i = 0; i < 60; i++) paint(ellPts(hash(i) * W, hash(i + 3) * H, 2 + 2 * hash(i + 5), 2 + 2 * hash(i + 5), 6), { wash: '#FFFFFF', washOp: 120, ink: null });
    const k = seg(t, 2.45, 2.7);
    letter('THE MIDNIGHT', W / 2, 430, 130, '#FFFFFF', { stroke: '#2B2233', pop: k * 1.2, rot: -.03, screen: true });
    letter('FRIDGE', W / 2, 600, 200, '#9CD6F5', { stroke: '#2B2233', pop: seg(t, 2.65, 2.9) * 1.2, rot: .03, screen: true });
    letter('Pumpkin & Pip', W / 2, 760, 60, '#F2C14E', { stroke: '#2B2233', alpha: seg(t, 3.0, 3.3), screen: true });
  }

  // 1-2 · 4–9 · Pip, flashlight under his chin: "Operation... Cake." His spooky face scares Pumpkin: "AAH!" -> up the curtain.
  function s1_2(t) {
    cam(500, 1300, 1.25, shake(t, 6.8, 8, .3));
    roomNight(t);
    const jump = seg(t, 6.8, 7.3), CL = [200, 1470];
    let kx = 780, ky = FY, rot = 0, aL = -1.1, aR = -1.1, puff = 0, noShadow = false;
    if (jump > 0) { const p = arcPt([780, FY], CL, 260, ease(jump)); kx = p[0]; ky = p[1]; aL = aR = 1.3; puff = 1; noShadow = true; rot = jump < 1 ? -.3 * Math.sin(jump * Math.PI) : Math.sin(t * 40) * .03; }
    pumpkin(kx, ky, U, { ...faces(t, [[4, 'neutral', { lookX: -1 }], [6.4, 'surprised', { eyes: 'wide', lookX: -1 }], [6.8, 'panic', { mouth: 'O' }]]), rot, aL, aR, puff, noShadow, who: 'pumpkin', boilKey: 'pk' });
    pip(470, FY, U, { ...faces(t, [[4, 'smug', { brow: .8, lid: .35, mouth: 'smirk' }], [7.3, 'surprised', { lookX: -1, lookY: -.6 }]]), view: 'q', aR: -.2, aL: -.6, armR: flashHook(1), who: 'pip', boilKey: 'pip' });
    camEnd();
    night(.85);
    cam(500, 1300, 1.25, shake(t, 6.8, 8, .3)); glow(510, 1330, 240, '#FFE9A8', .7); camEnd();
  }

  // 1-3 · 9–14 · The crayon plan. Pumpkin's stomach growls so loud the paper flaps. "...Focus."
  function s1_3(t) {
    const g = 10.3, sh = shake(t, g, 12, 1.0);
    cam(560, 1300, 1.25, sh);
    roomNight(t);
    const rumble = t > g && t < g + 1.0 ? Math.sin(t * 50) * .06 * (1 - (t - g)) : 0;
    pumpkin(780, FY, U, { ...faces(t, [[9, 'greedy', { lookX: -1 }], [g, 'embarrassed'], [11.6, 'sheepish', { lookX: -1 }]]), sq: rumble, aL: t > g && t < g + 1 ? -.4 : -1.1, aR: t > g && t < g + 1 ? -.4 : -1.1, boilKey: 'pk' });
    pip(470, FY, U, { ...faces(t, [[9, 'smug'], [g, 'surprised', { lookX: 1 }], [11.4, 'deadpan', { lookX: 1, lid: .6 }]]), view: 'q', aR: -.2, aL: .9, armR: flashHook(1), who: 'pip', boilKey: 'pip' });
    const unroll = ease(seg(t, 9.2, 9.7)), flap = t > g && t < g + 1.2 ? Math.sin(t * 40) * .25 * (1 - (t - g) / 1.2) : 0;
    if (unroll > 0) { push(); translate(200, 1250); scale(unroll, 1 - Math.abs(flap) * .3); planPaper(0, 0, 300, 220, -.05 + flap); pop(); }
    growl(t, g, 780, FY - 260);
    camEnd();
    night(.85);
    cam(560, 1300, 1.25, sh); glow(510, 1330, 260, '#FFE9A8', .6); glow(200, 1250, 220, '#FFE9A8', .35); camEnd();
  }

  // 1-4 · 14–22 · The plan as Pip sees it (crayon paper), in step with his words: 1. SNEAK (15.0) 2. CLIMB (16.6) 3. CAKE (18.3)...
  // then a record scratch: the dream freezes and tilts.
  function s1_4(t) {
    const unroll = ease(seg(t, 14.0, 14.4)), scratch = t > 21.0, crumple = easeIn(seg(t, 21.5, 22.0));
    push(); translate(W / 2, H / 2); scale(unroll * (1 - crumple), 1 - crumple); rotate((scratch ? .06 : 0) + crumple * 3); translate(-W / 2, -H / 2);
    const tt = scratch ? 21.0 : t;   // freeze-frame after the scratch
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#FBF6E8', ink: null });
    for (let i = 1; i < 14; i++) inkLine([[-60, i * 78], [W + 60, i * 78]], 1.4, '#BFD6EA', 'ink', 0);
    inkLine([[150, -60], [150, H + 60]], 2, '#F4A7B5', 'ink', 0);
    crayon([[-60, 960], [W + 60, 960]], '#8E6A55', 8);
    crayon([[1360, 958], [1360, 520], [1640, 520], [1640, 958]], '#4F7FC9', 9, 3);
    crayon([[1360, 680], [1640, 680]], '#4F7FC9', 6, 4);
    const U2 = 22;
    if (tt < 16.6) {
      letter('1. SNEAK', 420, 140, 90, '#E2463F', { font: '800 90px "Baloo 2", sans-serif', rot: -.04 });
      const k = seg(tt, 14.4, 16.6), x = lerp(250, 1000, k), bob = -Math.abs(Math.sin(tt * 8)) * .3;
      pumpkin(x - 170, 958, U2, { ...face('smug', { mouth: 'smirk' }), view: 'q', dy: bob, sq: .15, aL: -.4, aR: -.4, draw: (u, sw) => shades(u, sw), noShadow: true, boilKey: 'pk' });
      pip(x + 60, 958, U2, { ...face('smug'), view: 'q', dy: bob, sq: .1, aL: .2, aR: -.2, draw: pipShades, noShadow: true, boilKey: 'pip' });
    } else if (tt < 18.4) {   // 2. CLIMB: spy-style grappling hook, then up the rope (Pip rides on his head)
      letter('2. CLIMB', 420, 140, 90, '#4F7FC9', { font: '800 90px "Baloo 2", sans-serif', rot: .03 });
      const KX = 1215, HOOK = [1372, 528], fire = seg(tt, 16.6, 16.95), climb = ease(seg(tt, 17.0, 18.2)), top = tt >= 18.2;
      const ky = top ? 520 : lerp(958, 640, climb), kx = top ? 1440 : KX;
      const sw = Math.sin(tt * 22), U3 = U2;
      const paw = [kx + (climb > 0 && !top ? 0 : 1.6 * U3), ky - (climb > 0 && !top ? 13.6 : 11.5) * U3];
      // the grapple: shot up, then the rope stays taut
      const hk = fire < 1 ? [lerp(paw[0], HOOK[0], fire), lerp(paw[1], HOOK[1], fire)] : HOOK;
      if (!top) { inkLine([paw, hk], 3, '#5A4636', 'ink', 0); paint([[hk[0] - 14, hk[1]], [hk[0], hk[1] - 18], [hk[0] + 14, hk[1]], [hk[0], hk[1] - 6]], { wash: '#8E96A3', sw: 1 }); }
      if (climb > 0 && !top) for (let i = 0; i < 3; i++) inkLine([[kx - 120 + i * 120, ky + 40], [kx - 120 + i * 120, ky + 140]], 4, '#C9A06A', 'ink', 0);   // speed lines (going up)
      const aL = climb > 0 && !top ? 1.35 + .25 * sw : -.4, aR = climb > 0 && !top ? 1.35 - .25 * sw : fire > 0 ? 1.1 : -.4;
      pumpkin(kx, ky, U3, { ...face('smug', { mouth: 'smirk' }), aL, aR, dy: climb > 0 && !top ? -Math.abs(sw) * .2 : 0, draw: (u, sw2) => shades(u, sw2), noShadow: true, boilKey: 'pk' });
      pip(kx, ky - 13.0 * U3, U3 * .9, { ...face('smug'), aL: 1.0, aR: climb > 0 ? -.3 : 1.0, draw: pipShades, noShadow: true, boilKey: 'pip' });
    } else {
      letter('3. CAKE!!!', 520, 140, 110, '#E2463F', { font: '800 110px "Baloo 2", sans-serif', rot: -.05 });
      for (let i = 0; i < 9; i++) { const a = Math.PI / 2 + (i - 4) * .16 + Math.sin(tt) * .03; paint([[1500, -100], [1500 + Math.cos(a - .05) * 1400, -100 + Math.sin(a - .05) * 1400], [1500 + Math.cos(a + .05) * 1400, -100 + Math.sin(a + .05) * 1400]], { wash: '#FFF3B0', washOp: 90, ink: null }); }
      glow(1500, 260, 420, '#FFF3B0', .7);
      cakeSlice(1240, lerp(-60, 470, easeOut(seg(tt, 18.4, 19.8))), 1.3, true, seg(tt, 19.6, 20.0));
      pumpkin(1440, 520, U2, { ...faces(tt, [[18.4, 'surprised', { eyes: 'wide' }], [19.8, 'greedy', { pupil: 1.1 }]]), aL: 1.4, aR: 1.4, draw: (u, sw) => shades(u, sw), noShadow: true, boilKey: 'pk' });
      pip(1590, 520, U2, { ...faces(tt, [[18.4, 'surprised'], [19.8, 'happy']]), view: 'q', flip: true, aL: 1.4, aR: 1.4, draw: pipShades, noShadow: true, boilKey: 'pip' });
    }
    if (scratch) { letter('*SCRATCH*', W / 2, H / 2, 120, '#2B2233', { rot: -.1, pop: seg(t, 21.0, 21.2) * 1.2, alpha: 1 - crumple }); }
    pop();
    if (crumple > 0) paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#16143A', washOp: 255 * crumple, ink: null });
  }

  // 1-5 · 22–25 · Reality: Pumpkin is chewing half the plan. "That's the plan." "It's a good plan."
  function s1_5(t) {
    cam(620, 1250, 1.45);
    roomNight(t);
    const chew = Math.max(0, Math.sin(t * 14)) * .25;
    pumpkin(780, FY, U, { ...faces(t, [[22, 'munching'], [23.8, 'happy', { lid: .3 }]]), ...(t < 23.8 ? { talk: chew } : {}), aL: -.4, aR: -.6, who: t >= 23.8 ? 'pumpkin' : undefined,
      draw: (u, sw) => { push(); translate(.6 * u, -7.7 * u); rotate(.3); paint([[0, 0], [2.4 * u, -.3 * u], [2.6 * u, 1.4 * u], [.4 * u, 1.9 * u], [.8 * u, .9 * u]], { wash: '#FBF6E8', sw: sw * .7 }); crayon([[.6 * u, .6 * u], [2 * u, .3 * u]], '#4F7FC9', 4); pop(); }, boilKey: 'pk' });
    pip(470, FY, U, { ...faces(t, [[22, 'deadpan', { lookX: 1, lid: .6 }]]), view: 'q', aR: .5, aL: -.6, armR: (u, sw) => { paint([[0, -.8 * u], [1.6 * u, -.9 * u], [1.4 * u, .4 * u], [.3 * u, .9 * u], [.6 * u, 0]], { wash: '#FBF6E8', sw: sw * .6 }); }, who: 'pip', boilKey: 'pip' });
    for (let i = 0; i < 4; i++) { const k = frac(t * 1.3 + i / 4); paint(rectPts(860 + i * 12, 1220 + k * 300, 10, 8), { wash: '#FBF6E8', ink: null }); }
    camEnd();
    night(.8);
    cam(620, 1250, 1.45); glow(510, 1330, 220, '#FFE9A8', .45); camEnd();
  }

  // 1-6 · 25–32 · Dressing up, fast: Pip's mask is too big (walks into Pumpkin's leg), the sweater rips instantly (-> a scarf),
  // and Pip's war paint turns into a crayon moustache. "I love this plan."
  function s1_6(t) {
    cam(600, 1300, 1.35, shake(t, 27.6, 10, .35));
    roomNight(t);
    const bigMask = t < 27.0, walk = seg(t, 25.4, 26.4), bonk = 26.4;
    let px = 470, psq = 0, prot = 0;
    if (bigMask) { px = lerp(470, 640, walk) - (t > bonk ? 30 * easeOut(seg(t, bonk, bonk + .3)) : 0); psq = t > bonk ? .2 * Math.exp(-(t - bonk) * 6) : 0; prot = t > bonk ? -.15 * Math.exp(-(t - bonk) * 4) : 0; }
    else if (t < 29.0) px = 560; else px = 700;
    const sweater = seg(t, 27.0, 27.5), ripped = t > 27.6, scarf = t > 28.2, stache = t > 29.8;
    pumpkin(800, FY, U, { ...faces(t, [[25, 'happy'], [26.4, 'surprised', { lookY: 1 }], [27.0, 'strain'], [27.6, 'surprised', { eyes: 'wide' }], [28.4, 'proud'], [29.0, 'neutral', { eyes: 'closed' }], [30.2, 'proud', { blush: .4 }]]),
      aL: !ripped && sweater > 0 ? 1.4 : -1.1, aR: !ripped && sweater > 0 ? 1.4 : -1.1,
      draw: (u, sw) => { if (sweater > 0 && !ripped) { push(); translate(0, -(1 - sweater) * 5 * u); blackSweater(0)(u, sw); pop(); } if (scarf) blackScarf(u, sw); if (stache) mustache(u, sw); }, who: 'pumpkin', boilKey: 'pk' });
    if (ripped && !scarf) for (let i = 0; i < 6; i++) { const k = seg(t, 27.6, 28.2); paint(rrPts(800 + Math.cos(i * 1.1) * 260 * k, 1360 + Math.sin(i * 2) * 120 * k - 100 * k, 70, 30, 10), { wash: '#262A33', sw: 1 }); }
    burst(800, FY - 230, 220, (t - 27.6) / .35, 10, '#FFFFFF', 4);
    // Pip: the oversized mask, the bonk; later he climbs up and draws (the moustache) with a black crayon
    const draw = t > 29.0 && t < 30.0;
    pip(px, draw ? FY - 6.2 * U : FY, U, { ...faces(t, [[25, 'determined'], [bonk, 'dazed'], [27.0, 'determined'], [29.0, 'determined', { lookX: 1 }], [30.4, 'sheepish', { lookX: 1 }]]), view: 'q', flip: t > 29.0,
      sq: psq, rot: prot, aR: draw ? .4 + .3 * Math.sin(t * 20) : -.4, aL: bigMask ? .9 : -.6, noShadow: draw,
      armR: draw ? (u, sw) => paint(rrPts(.1 * u, -.15 * u, 1.4 * u, .3 * u, .1 * u), { wash: '#262A33', sw: sw * .5 }) : undefined,
      draw: bigMask ? (u, sw) => { push(); translate(.25 * u, -4.6 * u); scale(2.1, 2.1); translate(-.25 * u, 4.6 * u); ninjaMask(1)(u, sw); pop(); } : ninjaMask(1), boilKey: 'pip' });
    if (t > bonk && t < bonk + .5) dizzy(px, FY - 330, 60, t);
    camEnd();
    night(.75);
  }

  // 1-7 · 32–44 · Kitchen doorway. Sneaking with incidents: a floorboard EEKs (freeze), Pumpkin pirouettes like a ballerina,
  // then his stomach growls again... the vacuum's red eye snaps open, its searchlight comes on.
  const VAC = [1150, FK + 10], PLANT = [760, FK + 20];
  function s1_7(t) {
    cam(620, 1120, 1.15, shake(t, 38.5, 8, .8));
    kitchen(t, { minutes: 3 });
    floorLamp(...LAMP);
    pottedPlant(PLANT[0], PLANT[1], .6);
    const awake = t > 39.0;
    robotVac(VAC[0], VAC[1], 1.0, t, { led: awake ? 'red' : 'blue', blink: awake });
    const freeze = t > 34.0 && t < 35.2, ballet = seg(t, 35.2, 38.0), panic = t > 39.2;
    const walk = seg(t, 32.0, 34.0);
    let px = lerp(120, 330, walk), kx = px - 300, kview = 'q', kflip = false, krot = 0, kaL = -.6, kaR = -.6, kdy = 0;
    if (ballet > 0) { kx = lerp(30, 330, ease(ballet)); const sp = Math.floor(ballet * 8) % 2; kview = sp ? 'front' : 'q'; kflip = Math.floor(ballet * 8) % 4 > 1; kaL = kaR = 1.4; kdy = -.6 * Math.sin(ballet * Math.PI); px = 470; }
    if (t > 38.0) { kx = 330; px = 470; }
    if (panic) { const r = seg(t, 39.6, 43.5); kx = lerp(330, 860, ease(r)); px = lerp(470, 720, ease(r)); }
    const bob = freeze || t > 38 && !panic ? 0 : -Math.abs(Math.sin(t * 6)) * .2;
    pumpkin(kx, FK, U, { ...faces(t, [[32, 'determined', { brow: .7 }], [34.0, 'surprised', { eyes: 'wide' }], [35.2, 'proud'], [38.5, 'embarrassed'], [39.2, 'panic']]),
      view: kview, flip: kflip, rot: krot, dy: kdy + bob, sq: ballet > 0 ? 0 : .15, aL: freeze ? 1.0 : kaL, aR: freeze ? -1.3 : kaR, draw: spyLook, boilKey: 'pk' });
    pip(px, FK, U, { ...faces(t, [[32, 'determined', { brow: .7 }], [34.0, 'surprised'], [35.4, 'deadpan', { lookX: -1 }], [39.2, 'panic']]), view: 'q', flip: t > 35.2 && t < 38.5, sq: .2, dy: bob, aL: freeze ? 1.0 : .3, aR: -.4, draw: ninjaMask(1), boilKey: 'pip' });
    growl(t, 38.5, kx, FK - 520);
    if (freeze) letter('EEK!', 230, FK - 40, 60, '#FFFFFF', { stroke: '#2B2233', pop: seg(t, 34.0, 34.2) * 1.2, rot: .1 });
    if (t > 39.0 && t < 39.8) letter('ding!', VAC[0], VAC[1] - 140, 54, '#FF6A6A', { stroke: '#2B2233', pop: seg(t, 39.0, 39.2) * 1.2 });
    camEnd();
    night(.75);
    if (awake) { cam(620, 1120, 1.15); const a = lerp(.2, Math.PI - .1, ease(seg(t, 39.2, 43.8))); searchlight(VAC[0] - 60, VAC[1] - 40, a, 900, .2, seg(t, 39.0, 39.3)); glow(VAC[0] + 90, VAC[1] - 33, 60, '#FF4A4A', .6); camEnd(); }
  }

  // 1-8 · 44–52 · Hiding behind a tiny potted plant: Pip fits; Pumpkin holds up ONE leaf over his face. The beam slides over
  // them... the vacuum beeps "?"... and whips back.
  function s1_8(t) {
    cam(860, 1150, 1.4);
    kitchen(t, { minutes: 3 });
    pip(PLANT[0] - 10, FK, U, { ...face('panic', { eyes: 'squeeze' }), view: 'q', sq: .3, aL: 1.2, aR: 1.2, draw: ninjaMask(1), boilKey: 'pip' });
    pottedPlant(PLANT[0], PLANT[1], .6);
    const LEAF = (u, sw) => { push(); translate(0, -8.4 * u); rotate(-.2); paint(ribbon([[-1.6 * u, .3 * u], [0, -.5 * u], [1.6 * u, .1 * u]], 1.6 * u, .3 * u), { wash: '#4FA060', sw }); inkLine([[-1.4 * u, .2 * u], [1.4 * u, 0]], sw * .6, '#2F6E3E', 'ink', 0); pop(); };
    pumpkin(910, FK, U, { ...faces(t, [[44, 'neutral', { eyes: 'closed' }], [48.6, 'surprised', { eyes: 'wide', lookX: 1 }]]), aL: 1.5, aR: -1.2, sq: -.04 + Math.sin(t * 30) * .01,
      draw: (u, sw) => { spyLook(u, sw); if (t < 49.6) LEAF(u, sw); }, boilKey: 'pk' });
    robotVac(VAC[0] + 150, VAC[1], 1.0, t, { led: 'red' });
    if (t > 47.4 && t < 48.6) emote('?', VAC[0] + 150, VAC[1] - 200, 60, seg(t, 47.4, 47.6), t - 47.4);
    camEnd();
    night(.75);
    cam(860, 1150, 1.4);
    const a = t < 47.4 ? lerp(Math.PI - .1, Math.PI + .25, ease(seg(t, 44.0, 47.0))) : t < 48.6 ? Math.PI + .25 - .3 * ease(seg(t, 47.4, 48.0)) : lerp(.1, Math.PI - .05, easeOut(seg(t, 48.6, 49.0)));
    searchlight(VAC[0] + 90, VAC[1] - 40, a, 1100, .16);
    glow(VAC[0] + 240, VAC[1] - 33, 60, '#FF4A4A', .6);
    camEnd();
  }

  // 1-9 · 52–60 · The beam swings their way. Pip dives behind the plant; Pumpkin snatches the lampshade, plants himself next
  // to the pole and freezes. The beam lands on his face. "...Lamp." Hold.
  function s1_9(t) {
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
      draw: (u, sw) => { spyLook(u, sw); if (stiff) shadeHook(0)(u, sw); }, who: 'pumpkin', boilKey: 'pk' });
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
  shots([[0, s1_1], [4, s1_2], [9, s1_3], [14, s1_4], [22, s1_5], [25, s1_6], [32, s1_7], [44, s1_8], [52, s1_9], [60, placeholder(2)], [120, placeholder(3)], [180, t => endScreen(t, 180, { hat: true })]]);
})();
