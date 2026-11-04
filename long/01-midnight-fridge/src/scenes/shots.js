// shots.js: "Pumpkin & Pip: The Midnight Fridge" (16:9, 200 s). See ../STORYBOARD.md.
// Parts 1-3 (0-180) are built until they are made; End Screen 180-200.
// Living room: characters on the floor at y = 1560. Kitchen: floor line 1310, characters at y = 1420, fridge RIGHT.
(() => {
  const U = 40, FY = FY1, FK = 1420, LAMP = [470, FK];
  const cam = (cx, cy, z, sh = [0, 0]) => camBegin(cx + sh[0], cy + sh[1], z);
  const shake = (t, t0, amp = 10, dur = .35) => t > t0 && t < t0 + dur ? [Math.sin(t * 90) * amp * (1 - (t - t0) / dur), Math.cos(t * 77) * amp * .6 * (1 - (t - t0) / dur)] : [0, 0];
  const roomNight = t => { livingRoom6(t); curtain(t); };
  const shades = (u, sw, dy = -8.75) => { for (const s of [-1, 1]) paint(ellPts(s * 1.15 * u, dy * u, .95 * u, .62 * u, 14), { wash: '#1E2533', sw }); inkLine([[-.3 * u, dy * u], [.3 * u, dy * u]], sw * 2, '#1E2533', 'ink', 0); };
  const pipShades = (u, sw) => { for (const s of [-1, 1]) paint(ellPts(s * .6 * u, -4.75 * u, .45 * u, .32 * u, 12), { wash: '#1E2533', sw: sw * .7 }); inkLine([[-.2 * u, -4.75 * u], [.2 * u, -4.75 * u]], sw, '#1E2533', 'ink', 0); };
  function floorLamp(x, y, withShade = true) { paint(ellPts(x, y - 4, 60, 14, 18), { wash: '#6B5A4E', sw: 1 }); paint(rectPts(x - 6, y - 620, 12, 616), { wash: '#C9A44C', sw: 1 }); if (withShade) lampShade(x, y - 600, 1.2); }


  // Pumpkin's spy look after the dress-up: the ripped sweater tied on as a ninja headband, and a crayon moustache
  // (rig options, so they follow his face in every view).
  const SPY = { headband: '#262A33', mustache: true };
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
  // and Pip's war paint turns into a crayon moustache. (v2.1: the ripped sweater becomes a ninja headband) "I love this plan."
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
      draw: (u, sw) => { if (sweater > 0 && !ripped) { push(); translate(0, -(1 - sweater) * 5 * u); blackSweater(0)(u, sw); pop(); } }, headband: scarf ? '#262A33' : undefined, mustache: stache, who: 'pumpkin', boilKey: 'pk' });
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
      view: kview, flip: kflip, rot: krot, dy: kdy + bob, sq: ballet > 0 ? 0 : .15, aL: freeze ? 1.0 : kaL, aR: freeze ? -1.3 : kaR, ...SPY, boilKey: 'pk' });
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
      ...SPY, draw: (u, sw) => { if (t < 49.6) LEAF(u, sw); }, boilKey: 'pk' });
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
      ...SPY, draw: (u, sw) => { if (stiff) shadeHook(0)(u, sw); }, who: 'pumpkin', boilKey: 'pk' });
    if (grab > 0 && grab < 1) { const p = arcPt([LAMP[0], LAMP[1] - 600], [600, FK - 10.3 * U], 80, ease(grab)); lampShade(p[0], p[1], 1.2 + .55 * grab, grab * 3); }
    camEnd();
    night(.75);
    cam(520, 1130, z);
    const a = lerp(Math.PI + .5, Math.PI + .1, ease(seg(t, 54.0, 56.5)));
    searchlight(1300, FK - 300, a, 760, .14);
    if (t > 56.5) glow(600, FK - 8.4 * U, 140, '#FFF3B0', .8);
    camEnd();
  }

  // ======================= PART 2 · 60–120 · the kitchen =======================
  const pop2 = (txt, x, y, t, t0, size = 64, col = '#FFFFFF', dur = .7, rot = -.06) => { const a = t - t0; if (a > 0 && a < dur) letter(txt, x, y - a * 30, size, col, { stroke: '#2B2233', pop: seg(a, 0, .15) * 1.2, rot, alpha: 1 - seg(a, dur - .2, dur) }); };

  // 2-1 · 60–65 · Still in the beam. A red scan line runs up and down him: "Still... a lamp." Pip pokes his flashlight up
  // under the shade -> it glows like a real lamp. Vacuum: ✓ beep, beam off. Pumpkin sighs with relief: his vest button pops.
  function s2_1(t) {
    const z = 1.6;
    cam(520, 1130, z, shake(t, 64.3, 6, .25));
    kitchen(t, { minutes: 4 });
    floorLamp(LAMP[0], LAMP[1], false);
    const poke = seg(t, 62.0, 62.5), lit = t > 62.7;
    pip(270, FK - 3.2 * U * ease(poke) * (t < 64.6 ? 1 : 1 - seg(t, 64.6, 65)), U, { ...faces(t, [[60, 'panic', { eyes: 'squeeze' }], [62.0, 'determined', { lookX: 1, lookY: -1 }], [63.4, 'happy']]), view: 'q', flip: false,
      aR: poke > 0 ? lerp(-.4, 1.1, poke) : -.4, aL: 1.0, armR: flashHook(lit ? 1 : 0), draw: ninjaMask(1), noShadow: true, boilKey: 'pip' });
    pottedPlant(300, FK + 20, .9);
    const sigh = seg(t, 64.0, 64.3);
    pumpkin(600, FK, U, { ...faces(t, [[60, 'neutral', { eyes: 'wide', lid: 0, pupil: .3, lookX: 1, mouth: 'flat' }], [63.6, 'neutral', { eyes: 'wide', lid: 0, pupil: .3, lookX: 1, mouth: 'flat' }], [64.0, 'proud'], [64.4, 'surprised', { lookY: 1 }]]),
      aL: -1.5, aR: -1.5, sq: t > 64.0 && t < 64.4 ? -.06 * Math.sin(sigh * Math.PI) : 0, rot: t < 61.8 ? Math.sin(t * 40) * .008 : 0,
      ...SPY, draw: (u, sw) => shadeHook(0)(u, sw), who: 'pumpkin', boilKey: 'pk' });
    // the popped vest button flies off to the right
    if (t > 64.3) { const k = seg(t, 64.3, 65.0), p = arcPt([600, FK - 4.4 * U], [1150, FK - 2 * U], 260, k); paint(ellPts(p[0], p[1], 14, 14, 12), { wash: '#EEC35A', sw: 1.4 }); }
    pop2('PING!', 680, FK - 5 * U, t, 64.3, 54, '#FFE27A');
    camEnd();
    night(.75);
    cam(520, 1130, z);
    const beamK = 1 - seg(t, 63.4, 63.6);
    searchlight(1300, FK - 300, Math.PI + .1, 760, .14, beamK);
    if (beamK > 0) glow(600, FK - 8.4 * U, 140, '#FFF3B0', .8 * beamK);
    // the scan line, up and down his body
    if (t > 60.2 && t < 61.8) { const k = seg(t, 60.2, 61.8), y = FK - 12.5 * U * Math.abs(Math.sin(k * Math.PI * 1.5)); inkLine([[420, y], [780, y]], 5, '#FF4A4A', 'ink', 0); glow(600, y, 160, '#FF4A4A', .45); }
    if (poke > .5 && t < 64.6) { const tip = [300 + 1.4 * U, FK - 3.2 * U - 5.0 * U]; paint([[tip[0], tip[1]], [600 - 3.4 * U, FK - 10.3 * U], [600 + 1.0 * U, FK - 10.3 * U]], { wash: '#FFF3B0', washOp: lit ? 110 : 60, ink: null }); glow(tip[0], tip[1], 50, '#FFF3B0', .8); }
    if (lit) { glow(600, FK - 11.2 * U, 260, '#FFE9A8', .85); paint([[600 - 4.2 * U, FK - 10.3 * U], [600 + 4.2 * U, FK - 10.3 * U], [600 + 7 * U, FK], [600 - 7 * U, FK]], { wash: '#FFE9A8', washOp: 50, ink: null }); }
    if (t > 63.0 && t < 63.9) letter('✓', 1000, 900, 110, '#5FE07A', { stroke: '#2B2233', pop: seg(t, 63.0, 63.15) * 1.2 });
    camEnd();
  }

  // 2-2 · 65–68 · The button lands on the vacuum: POK. It stops... slurps the button (SHLURP), green light, rolls on happy.
  function s2_2(t) {
    cam(1150, 1250, 1.9);
    kitchen(t, { minutes: 4 });
    const go = seg(t, 67.1, 68.0), vx = 1150 + 700 * easeIn(go);
    const land = seg(t, 65.0, 65.35), bounce = seg(t, 65.35, 65.75), slurp = seg(t, 66.4, 66.8);
    robotVac(vx, FK + 10, 1.0, t, { led: t > 66.8 ? 'green' : 'red', blink: t > 66.8 });
    if (slurp < 1) {
      let p = land < 1 ? [lerp(900, 1150, land), lerp(950, FK - 55, land * land)] : bounce < 1 ? arcPt([1150, FK - 55], [1190, FK - 50], 60, bounce) : [lerp(1190, 1290, slurp), FK - 50 + 20 * slurp];
      paint(ellPts(p[0], p[1], 14 * (1 - slurp * .7), 14 * (1 - slurp * .7), 12), { wash: '#EEC35A', sw: 1.4 });
    }
    pop2('POK!', 1150, FK - 140, t, 65.35, 58, '#FFFFFF');
    if (t > 65.8 && t < 66.4) emote('?', 1150, FK - 200, 50, seg(t, 65.8, 66.0), t - 65.8);
    pop2('SHLURP!', 1240, FK - 150, t, 66.4, 58, '#9CD6F5', .8, .05);
    if (go > 0) speedLines(vx - 200, FK - 40, -1, t, 4, 160, 120);
    camEnd();
    night(.7);
    cam(1150, 1250, 1.9); glow(vx + 70, FK - 16, 50, t > 66.8 ? '#5FE07A' : '#FF4A4A', .7); camEnd();
  }

  // 2-3 · 68–72 · The laser fence flickers on. Pip, one jab per word: "Don't. Chase. The lasers."
  // 2-4 · 72–76 · Pip ninja-flips through the beams, three moves, and lands posing on the far side.
  function s2_34(t) {
    cam(860, 1150, 1.2);
    kitchen(t, { minutes: 5 });
    laserPosts(FK);
    const jab = [68.5, 69.3, 70.0].some(a => t > a && t < a + .35);
    let px = 720, py = FK, prot = 0, flip = true, aL = -.6, aR = jab ? 1.2 : -.3, fc = [[68, 'determined', { brow: .9 }], [71.0, 'smug']];
    const F = [[72.2, [720, FK], [990, FK], 300], [72.95, [990, FK], [1150, FK], 140], [73.6, [1150, FK], [1430, FK], 320]];
    for (const [t0, a, b, h] of F) { const k = seg(t, t0, t0 + .6); if (k > 0 && k < 1) { [px, py] = arcPt(a, b, h, ease(k)); prot = -TAU * ease(k); flip = false; aL = aR = 1.3; } else if (k >= 1) { [px, py] = b; flip = false; } }
    if (t > 74.2) { aL = aR = 1.4; fc = [[74.2, 'proud']]; }
    if (t > 72.2) fc = t > 74.2 ? [[74.2, 'proud']] : [[72.2, 'determined']];
    pumpkin(470, FK, U, { ...faces(t, [[68, 'innocent', { lookX: 1 }], [72.4, 'surprised', { lookX: 1 }], [74.3, 'happy']]), view: 'q', aL: t > 74.3 ? 1.2 + .2 * Math.sin(t * 20) : -1.1, aR: t > 74.3 ? 1.2 - .2 * Math.sin(t * 20) : -1.1, ...SPY, boilKey: 'pk' });
    pip(px, py, U, { ...faces(t, fc), view: 'q', flip, rot: prot, aL, aR, draw: ninjaMask(flip ? 1 : 1), noShadow: py < FK - 2, who: 'pip', boilKey: 'pip' });
    if (t > 74.2 && t < 75.2) for (let i = 0; i < 4; i++) paint(starPts(1430 + Math.cos(i * 1.6 + t * 3) * 170, FK - 150 - Math.sin(i * 1.6 + t * 3) * 120, 22, .4, 4), { wash: '#FFE27A', sw: 1 });
    pop2('TA-DA!', 1430, FK - 330, t, 74.3, 60, '#FFE27A', .9);
    camEnd();
    night(.75);
    cam(860, 1150, 1.2); laserBeams(t, seg(t, 68.0, 68.4)); camEnd();
  }

  // 2-5 · 76–82 · Pumpkin's turn. A laser dot lands on his own belly. Eyes huge, trembling: "Hold it... hold it..."
  // Pip: "Pumpkin. NO." He pounces... on his own belly, tumbles into the beams: ALARM, everything flashes red.
  function s2_5(t) {
    const al = t > 80.6, sh = shake(t, 80.5, 14, .5);
    cam(1000, 1170, 1.5, sh);
    kitchen(t, { minutes: 6 });
    laserPosts(FK);
    const pounce = seg(t, 80.2, 80.6);
    let ky = FK, kdy = 0, krot = 0, ksq = 0;
    if (pounce > 0) { kdy = -2.4 * Math.sin(pounce * Math.PI); }
    if (t > 80.6) { ksq = .35 * Math.exp(-(t - 80.6) * 5) + .15; krot = .5 * ease(seg(t, 80.6, 81.0)); }
    const tremble = t > 76.8 && t < 80.2 ? Math.sin(t * 60) * (.01 + .02 * seg(t, 76.8, 80)) : 0;
    const kx5 = t < 80.2 ? 740 : lerp(740, 1080, ease(pounce));
    pumpkin(kx5, ky, U, { ...faces(t, [[76, 'determined'], [76.5, 'surprised', { lookY: 1, pupil: 1 }], [77.0, 'strain'], [78.4, 'greedy', { pupil: 1.2, lookY: 1 }], [79.0, 'strain'], [80.2, 'greedy', { pupil: 1.2, lookY: 1 }], [80.6, 'dazed']]),
      dy: kdy, rot: krot + tremble, sq: ksq, aL: pounce > 0 ? 1.3 : t > 80.6 ? -.2 : -1.1, aR: pounce > 0 ? 1.3 : t > 80.6 ? -.2 : -1.1, ...SPY, noShadow: pounce > 0 && pounce < 1, who: 'pumpkin', boilKey: 'pk' });
    pip(1480, FK, U, { ...faces(t, [[76, 'proud'], [78.6, 'annoyed', { lookX: -1 }], [79.6, 'determined', { brow: 1 }], [80.6, 'panic']]), view: 'q', flip: true, aL: t > 79.6 && t < 80.6 ? 1.0 : -.5, aR: t > 79.6 && t < 80.6 ? 1.0 : -.5, draw: ninjaMask(1), who: 'pip', boilKey: 'pip' });
    camEnd();
    night(.75);
    cam(1000, 1170, 1.5, sh);
    laserBeams(t, 1, al ? 1 : 0);
    if (t > 76.4 && t < 80.4) redDot(kx5 + Math.sin(t * 2.3) * 20, FK - 3.4 * U + Math.sin(t * 3) * 10, 1.4, seg(t, 76.4, 76.6));
    if (al) for (let i = 0; i < 3; i++) pop2('BEEP!', 820 + i * 260, 900 + (i % 2) * 60, t, 80.7 + i * .35, 64, '#FF4A4A', .6, (i - 1) * .1);
    camEnd();
    if (al) redAlarm(.5 + .5 * Math.sin(t * 16));
  }

  // 2-6 · 82–86 · Pip drags Pumpkin by the tail across the floor and they flatten against the side of the fridge. The vacuum
  // zooms in, searchlight sweeping, beeps "?"... and zooms off again.
  function s2_6(t) {
    cam(1150, 1150, 1.15);
    kitchen(t, { minutes: 6 });
    laserPosts(FK);
    const drag = seg(t, 82.0, 82.9), hid = t > 82.9;
    const kx = hid ? 1760 : lerp(900, 1760, ease(drag)), px = hid ? 1880 : kx + 260;
    pumpkin(kx, FK, U, { ...faces(t, [[82, 'dazed'], [83.2, 'panic', { eyes: 'squeeze' }]]), rot: hid ? 0 : -.35, sq: hid ? -.12 : .1, dy: hid ? 0 : -.3, aL: hid ? -1.4 : 1.2, aR: hid ? -1.4 : 1.2, ...SPY, noShadow: !hid, boilKey: 'pk' });
    pip(px, FK, U, { ...faces(t, [[82, 'determined'], [83.2, 'panic', { eyes: 'squeeze' }]]), view: 'q', flip: hid, sq: hid ? -.12 : 0, aL: hid ? -1.4 : -1.2, aR: hid ? -1.4 : .8, draw: ninjaMask(1), boilKey: 'pip' });
    if (!hid && drag > 0) speedLines(kx - 300, FK - 160, -1, t, 5, 200, 260);
    const vin = seg(t, 83.0, 83.5), vout = seg(t, 85.1, 85.7), vx = lerp(-300, 1060, easeOut(vin)) - 1500 * easeIn(vout);
    robotVac(vx, FK + 10, 1.0, t, { led: 'red' });
    if (t > 84.0 && t < 85.0) emote('?', vx, FK - 200, 56, seg(t, 84.0, 84.2), t - 84.0);
    camEnd();
    night(.75);
    cam(1150, 1150, 1.15);
    laserBeams(t, 1, t < 82.6 ? 1 : 0);
    if (vin > 0 && vout < 1) { const a = t < 84 ? Math.PI + .3 : lerp(Math.PI + .3, -.25, ease(seg(t, 84.0, 85.0))); searchlight(vx - 60, FK - 30, a, 820, .17); glow(vx + 70, FK - 16, 50, '#FF4A4A', .7); }
    camEnd();
    if (t < 82.6) redAlarm((.5 + .5 * Math.sin(t * 16)) * (1 - seg(t, 82.0, 82.6)));
  }

  // 2-7 · 86–92 · The fridge. Pumpkin jumps and hangs off the handle... the door swings open WITH him and flings him into the
  // wall: SPLAT. He slides down. Pip, deadpan, points at the open fridge: the cake.
  function s2_7(t) {
    cam(1500, 1000, 1.05, shake(t, 88.5, 12, .35));
    const open = ease(seg(t, 87.3, 88.2));
    kitchen(t, { minutes: 7, fridgeOpen: open });
    const jump = seg(t, 86.3, 86.8), swing = seg(t, 87.3, 88.2), fly = seg(t, 88.2, 88.5), slide = seg(t, 89.0, 90.6);
    let kx = 1180, ky = FK, aL = -1.1, aR = -1.1, rot = 0, sq = 0, sc = 1, fc = [[86, 'determined']];
    if (jump > 0) { const p = arcPt([1180, FK], [1310, 1250], 160, ease(jump)); kx = p[0]; ky = p[1]; aL = aR = 1.45; rot = jump >= 1 ? Math.sin(t * 6) * .06 : 0; }
    if (swing > 0) { kx = lerp(1310, 1760, swing); ky = 1250 - 120 * Math.sin(swing * Math.PI); sc = 1 + .25 * Math.sin(swing * Math.PI); rot = -.3 * swing; fc = [[87.3, 'panic']]; }
    if (fly > 0) { const p = arcPt([1760, 1250], [2140, 1180], 80, fly); kx = p[0]; ky = p[1]; rot = .2; }
    if (t > 88.5) { kx = 2140; ky = lerp(1180, FK, ease(slide)); sq = .18 * (1 - slide); sc = 1.08 - .08 * slide; rot = 0; aL = aR = lerp(.15, -1.1, slide); fc = [[88.5, 'dazed']]; }
    if (t > 88.5) { for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + .3, r0 = 200, r1 = 300 + 60 * hash(i + 2); inkLine([[2140 + Math.cos(a) * r0, 920 + Math.sin(a) * r0 * 1.2], [2140 + Math.cos(a + .08) * (r0 + r1) / 2, 920 + Math.sin(a + .08) * (r0 + r1) / 2 * 1.2], [2140 + Math.cos(a) * r1, 920 + Math.sin(a) * r1 * 1.2]], 4, '#7A6A48', 'ink', 0); } }
    pumpkin(kx, ky, U * sc, { ...faces(t, fc), rot, sq, aL, aR, ...SPY, noShadow: ky < FK - 4, boilKey: 'pk' });
    pip(1060, FK, U, { ...faces(t, [[86, 'determined', { lookX: 1 }], [88.5, 'deadpan', { lookX: 1 }], [90.8, 'smug', { lookX: 1 }]]), view: 'q', aL: -.5, aR: t > 90.8 ? .5 : -.4, draw: ninjaMask(1), boilKey: 'pip' });
    pop2('CREEEAK', 1600, 640, t, 87.3, 54, '#FFFFFF', .9, .05);
    pop2('SPLAT!', 2080, 900, t, 88.5, 80, '#FFE27A', .9);
    if (t > 88.5 && t < 89.6) dizzy(2140, 1180 - 520, 60, t);
    camEnd();
    night(.6 * (1 - .4 * open));
    cam(1500, 1000, 1.05);
    if (open > .05) { glow(1480, 800, 520, '#DDF2FF', .55 * open); paint([[1320, 520], [1640, 520], [2000, 1500], [1000, 1500]], { wash: '#DDF2FF', washOp: 40 * open, ink: null }); }
    if (t > 90.8) { const k = seg(t, 90.8, 91.1); for (let i = 0; i < 5; i++) paint(starPts(1460 + Math.cos(i * 1.3 + t * 2) * 150, 790 + Math.sin(i * 1.3 + t * 2) * 90, 18 * k, .3, 4), { wash: '#FFFFFF', ink: null }); }
    camEnd();
  }

  // 2-8 · 92–98 · Pumpkin marches up to the open fridge: a blast of cold mist... frozen solid in a block of ice. "So... cold."
  // Pip taps the ice with his cracker: tink, tink... it shatters. Pumpkin is left a shivering puffball.
  function s2_8(t) {
    cam(1480, 1060, 1.45);
    kitchen(t, { minutes: 7, fridgeOpen: 1 });
    const walk = seg(t, 92.0, 92.5), frozen = t > 93.0 && t < 97.2, shatter = t > 97.2;
    const kx = lerp(1900, 1480, ease(walk)), shiver = shatter ? Math.sin(t * 70) * .03 : frozen ? Math.sin(t * 50) * .006 : 0;
    pumpkin(kx, FK, U, { ...faces(t, [[92, 'determined'], [92.6, 'surprised', { eyes: 'wide' }], [97.2, 'strain'], [97.8, 'surprised', { eyes: 'wide', pupil: .3 }]]), rot: shiver, puff: shatter ? 1 : 0,
      aL: frozen ? -1.1 : -1.1, aR: frozen ? -1.1 : -1.1, ...SPY, who: 'pumpkin', boilKey: 'pk' });
    if (frozen || (t > 93 && t < 97.2)) {
      icicles(kx, FK - 7.8 * U, 3.0 * U, 6, 44);
      iceBlock(kx, FK + 20, 11 * U, 13.6 * U, t, seg(t, 96.0, 97.2));
    }
    const prun = seg(t, 95.0, 95.6);
    pip(lerp(900, 1180, ease(prun)), FK, U, { ...faces(t, [[92, 'surprised', { lookX: 1 }], [96.0, 'determined', { lookX: 1 }], [97.2, 'surprised', { lookX: 1 }]]), view: 'q', cracker: true, aR: t > 96.0 && t < 97.2 ? .2 + .6 * Math.abs(Math.sin(t * 9)) : -.3, aL: -.6, draw: ninjaMask(1), boilKey: 'pip' });
    pop2('KRRK!', kx + 300, 820, t, 93.0, 70, '#9CD6F5', .8);
    pop2('tink', 1300, 1000, t, 96.15, 46, '#FFFFFF', .5); pop2('tink', 1320, 960, t, 96.5, 46, '#FFFFFF', .5); pop2('tink', 1340, 920, t, 96.85, 46, '#FFFFFF', .5);
    burst(kx, FK - 6 * U, 520, (t - 97.2) / .6, 14, '#CFEFFF', 7);
    pop2('CRASH!', kx, 640, t, 97.2, 80, '#FFFFFF', .8);
    camEnd();
    night(.45);
    cam(1480, 1060, 1.45);
    glow(1480, 800, 520, '#DDF2FF', .5);
    coldMist(1400, 900, t, t < 92.4 ? 0 : t < 93.2 ? 1 : .4);
    camEnd();
    flash(seg(t, 93.0, 93.1) * (1 - seg(t, 93.1, 93.4)) * .7, '#E8F8FF');
  }

  // 2-9 · 98–106 · Inside the fridge. Pumpkin has his face stuck in a wobbly jelly. Pip hops up the groceries (eggs, butter,
  // milk) to the top shelf and lifts the cake: heavenly light. "Got it!"
  // 2-10 · 106–112.6 · Pip slides the cake off the shelf: it lands on Pumpkin's head. "Cake hat." A tiny victory dance; the
  // door swings shut on them: THUNK.
  const UI = 46;
  function s2_9(t) {
    const shut = seg(t, 112.0, 112.6);
    cam(960, 790, .93, shake(t, 112.6, 10, .3));
    // drawn in a 1920-wide world (top shelf y 700, bottom shelf y 1300), framed by the camera
    fridgeInside(t);
    // groceries: egg box, butter, milk carton (Pip's stairs)
    paint(rrPts(830, 1180, 210, 120, 12), { wash: '#F1E6CF', sw: 1.4 }); for (let i = 0; i < 4; i++) paint(ellPts(860 + i * 50, 1176, 20, 26, 12), { wash: '#FFF8EC', sw: 1 });
    paint(rrPts(1050, 1020, 170, 280, 10), { wash: '#F7D96A', sw: 1.4, shade: true, shadeK: .3 }); letter('BUTTER', 1135, 1150, 30, '#8A5A22', { font: '800 30px "Baloo 2", sans-serif' });
    paint(rectPts(1230, 860, 160, 440), { wash: '#FFFFFF', sw: 1.4, shade: true, shadeK: .25 }); paint([[1230, 860], [1390, 860], [1350, 800], [1270, 800]], { wash: '#4F9BD9', sw: 1.4 }); letter('MILK', 1310, 1060, 40, '#4F9BD9', { font: '800 40px "Baloo 2", sans-serif' });
    // Pip's route: floor -> eggs -> butter -> milk -> top shelf
    const HOPS = [[98.6, [760, FI.floor], [930, 1180]], [99.3, [930, 1180], [1135, 1020]], [100.0, [1135, 1020], [1310, 800]], [100.7, [1310, 800], [1470, FI.top]]];
    let pp = [760, FI.floor], prot = 0, air = false;
    for (const [t0, a, b] of HOPS) { const k = seg(t, t0, t0 + .5); if (k > 0 && k < 1) { pp = arcPt(a, b, 120, ease(k)); air = true; } else if (k >= 1) pp = b; }
    // the cake: on the top shelf, lifted (101.6), set down at the edge (105.6), pushed off -> Pumpkin's head (106.0-106.7)
    const lift = ease(seg(t, 101.5, 102.0)), push2 = seg(t, 105.6, 106.0), drop = seg(t, 106.0, 106.7), onHead = t > 106.7;
    const KX = t < 104.4 ? 640 : lerp(640, 800, easeOut(seg(t, 104.4, 104.8))), KXH = 800, headTop = FI.floor - 12.2 * UI;
    let cake = null;
    if (t < 105.6) cake = [lerp(1640, 1490, lift), lerp(FI.top, FI.top - 6.4 * UI, lift), lerp(1.05, .9, lift), true];
    else if (drop <= 0) cake = [lerp(1490, 1260, push2), FI.top, 1.05, true];
    else if (!onHead) { const p = arcPt([1260, FI.top], [KXH + 10, headTop + 20], 200, ease(drop)); cake = [p[0], p[1], 1.05 - .35 * drop, false]; }
    // rays while it's held up
    if (t > 101.8 && t < 105.6) { const k = seg(t, 101.8, 102.2); for (let i = 0; i < 8; i++) { const a = Math.PI / 2 + (i - 3.5) * .13; paint([[1490, -150], [1490 + Math.cos(a - .04) * 1300, -150 + Math.sin(a - .04) * 1300], [1490 + Math.cos(a + .04) * 1300, -150 + Math.sin(a + .04) * 1300]], { wash: '#FFF3B0', washOp: 90 * k, ink: null }); } glow(1490, 380, 380, '#FFF3B0', .6 * k); }
    // Pumpkin: face in the jelly (leaning in) until 104.4 (SHLOP), then up, cake hat, dance
    const stuck = t < 104.4, dance = seg(t, 109.4, 112.0);
    const jx = 470;
    pumpkin(KX, FI.floor, UI, { ...faces(t, [[98, 'strain'], [104.4, 'surprised', { eyes: 'wide' }], [105.0, 'neutral', { lookY: -1, lookX: 1 }], [106.7, 'surprised', { eyes: 'wide', lookY: -1 }], [107.4, 'proud'], [108.2, 'deadpan', { blush: .3 }], [109.4, 'happy']]),
      rot: stuck ? -.22 + Math.sin(t * 7) * .03 : dance > 0 ? Math.sin(t * 9) * .12 : 0, dy: dance > 0 ? -Math.abs(Math.sin(t * 9)) * .4 : 0,
      aL: stuck ? .9 + Math.sin(t * 14) * .5 : dance > 0 ? 1.3 : -1.1, aR: stuck ? .9 - Math.sin(t * 14) * .5 : dance > 0 ? 1.3 : -1.1,
      sq: t > 106.7 && t < 107.2 ? .25 * Math.exp(-(t - 106.7) * 8) : 0, ...SPY,
      draw: onHead ? (u, sw) => { push(); translate(.2 * u, -11.9 * u); scale(.8, .8); cakeSlice(0, 0, u / 46, false); pop(); } : undefined, who: 'pumpkin', boilKey: 'pk' });
    const JB = FI.floor - 330;   // the jelly sits on a yogurt tub, at face height
    paint(rrPts(jx - 130, JB, 260, 330, 16), { wash: '#FFFFFF', sw: 1.4, shade: true, shadeK: .2 }); paint(rectPts(jx - 130, JB + 90, 260, 80), { wash: '#F49AC1', ink: null }); letter('YOGURT', jx, JB + 132, 34, '#FFFFFF', { font: '800 34px "Baloo 2", sans-serif' });
    jelly(jx, JB, .9, t, stuck ? 1 : Math.max(0, 1 - (t - 104.4) * 1.2));
    if (t > 104.4) { pop2('SHLOP!', 560, 760, t, 104.4, 60, '#7ED957', .8); }
    pip(pp[0], pp[1], UI, { ...faces(t, [[98, 'determined'], [101.4, 'surprised', { eyes: 'wide' }], [101.8, 'happy'], [103.4, 'smug'], [105.4, 'determined'], [106.7, 'happy']]), view: 'q', flip: t > 105.0 && t < 106.2,
      rot: air ? Math.sin(t * 20) * .1 : 0, aL: lift > 0 && t < 105.6 ? 1.45 : dance > 0 ? 1.3 : -.6, aR: lift > 0 && t < 105.6 ? 1.45 : t > 105.6 && t < 106.1 ? .2 : dance > 0 ? 1.3 : -.4,
      dy: dance > 0 ? -Math.abs(Math.sin(t * 9 + 1)) * .5 : 0, draw: ninjaMask(1), noShadow: air || pp[1] < FI.floor - 2, who: 'pip', boilKey: 'pip' });
    if (cake) cakeSlice(cake[0], cake[1], cake[2], cake[3], t > 101.8 && t < 105.6 ? 1 : 0);
    pop2('BONK', KXH + 140, 560, t, 106.7, 56, '#FFFFFF', .6);
    camEnd();
    // the door swings shut over the camera (from the right)
    if (shut > 0) { const x = lerp(W + 40, -40, easeIn(shut)); paint(rectPts(x, -20, W + 80, H + 40), { wash: '#B8C2CC', sw: 3 }); paint(rrPts(x + 60, 300, 26, 420, 12), { wash: '#8E98A3', sw: 1 }); }
  }

  // 2-11 · 112.6–120 · THUNK. Pitch dark. Two pairs of eyes blink open, look at each other. "...Uh oh." Pumpkin's stomach
  // GRRRWLs in the dark. Then a red glow creeps in around the edge of the door: the vacuum's eye. Hold.
  function s2_11(t) {
    paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#06060E', ink: null });
    const g = 116.6, gs = t > g && t < g + 1.0 ? Math.sin(t * 60) * 8 : 0;
    const blink = (a) => { const k = t - a; return k < 0 ? 0 : k < .12 ? k / .12 : 1; };
    const b2 = t > 114.0 && t < 114.12 ? .1 : 1, red = seg(t, 117.8, 118.4);
    const kOpen = blink(113.3) * b2, pOpen = blink(113.6) * b2;
    const kLook = t < 114.3 ? 0 : t < 116.6 ? .8 : t < 117.8 ? -.3 : .9, pLook = t < 114.3 ? 0 : t < 117.8 ? -.8 : .9;
    const pup = red > 0 ? 1 - .55 * red : 1;
    darkEyes(820 + gs, 520, 52, 64, 74, kLook, kOpen, pup);
    darkEyes(1150, 640, 24, 30, 36, pLook, pOpen, pup);
    if (t > g && t < g + 1.4) letter('GRRRWL', 820 + Math.sin(t * 60) * 6, 330, 72, '#E2463F', { stroke: '#2B2233', pop: (t - g) * 4, rot: -.08, alpha: 1 - seg(t - g, 1.0, 1.4), screen: true });
    if (t > 112.6 && t < 113.3) letter('THUNK!', W / 2, H / 2, 120, '#FFFFFF', { stroke: '#2B2233', pop: seg(t, 112.6, 112.75) * 1.2, alpha: 1 - seg(t, 113.0, 113.3), screen: true });
    if (red > 0) {
      const p = .75 + .25 * Math.sin(t * 5);
      paint(rectPts(W - 26, -10, 40, H + 20), { wash: '#FF2E2E', washOp: 255 * red * p, ink: null });
      glow(W - 10, H / 2, 520, '#FF3A3A', .6 * red * p); glow(W - 10, H / 2, 200, '#FF8080', .5 * red * p);
    }
  }

  // ======================= PART 3 · 120–180 · the escape + the birthday =======================
  const CAKEHAT = (u, sw) => { push(); translate(.2 * u, -11.9 * u); scale(.8, .8); cakeSlice(0, 0, u / 46, false); pop(); };
  const onCake = (kx, ky, u) => [kx + .2 * u, ky - 13.5 * u];   // where Pip stands when he rides on the cake hat
  const runLegs = (x, y, u, t) => { for (let i = 0; i < 3; i++) { const a = t * 40 + i * 2.1; paint(ellPts(x + Math.cos(a) * 1.2 * u, y - .4 * u + Math.sin(a) * .5 * u, 1.3 * u, .5 * u, 12), { wash: PUMPKIN_COL.col, washOp: 120, ink: null }); } };

  // 3-1 · 120–125 · BANG: the vacuum rams the fridge door open. Light, a spinning siren. Both caught, frozen. "...Lamp?"
  // The vacuum answers with a big red ✗ (BZZT). Both scream.
  function s3_1(t) {
    if (t < 120.4) { paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#06060E', ink: null }); darkEyes(820, 520, 52, 64, 74, .9, 1, .45); darkEyes(1150, 640, 24, 30, 36, .9, 1, .45); glow(W - 10, H / 2, 520, '#FF3A3A', .6); paint(rectPts(W - 26, -10, 40, H + 20), { wash: '#FF2E2E', ink: null }); return; }
    const sh = shake(t, 120.4, 16, .4);
    cam(1500, 1000, 1.35, sh);
    const open = easeOut(seg(t, 120.4, 120.6));
    kitchen(t, { minutes: 8, fridgeOpen: open, cake: false });
    const scream = t > 124.4, U1 = 32;
    const top = KIT.fridge[1] - 820;
    pip(1560, top + 470, U1, { ...faces(t, [[120.4, 'surprised', { eyes: 'wide' }], [122.6, 'sheepish', { lookX: -1 }], [124.4, 'panic']]), view: 'q', flip: true, aL: scream ? 1.4 : .2, aR: scream ? 1.4 : -.3, draw: ninjaMask(1), noShadow: true, boilKey: 'pip' });
    pumpkin(1440, KIT.floor - 10, U1, { ...faces(t, [[120.4, 'surprised', { eyes: 'wide' }], [122.4, 'neutral', { eyes: 'wide', lid: 0, pupil: .3, mouth: 'flat' }], [124.4, 'panic', { mouth: 'O' }]]),
      aL: scream ? 1.4 : -1.5, aR: scream ? 1.4 : -1.5, ...SPY, draw: CAKEHAT, who: 'pumpkin', noShadow: true, boilKey: 'pk' });
    robotVac(1760, FK + 10, 1.0, t, { led: 'red' });
    if (t > 123.8) vacIcon(1760, FK + 10, 1.0, 'x', t, backOut(seg(t, 123.8, 124.0)));
    pop2('BANG!', 1700, 700, t, 120.4, 90, '#FFFFFF', .8);
    pop2('BZZT!', 1880, 1220, t, 123.8, 64, '#FF4A4A', .8);
    if (t > 122.4 && t < 124.4) emote('sweat', 1530, 1060, 14, 1, t - 122.4);
    camEnd();
    night(.55);
    cam(1500, 1000, 1.35, sh);
    glow(1480, 900, 420, '#DDF2FF', .55 * open);
    siren(1760, FK + 10, 1.0, t, 1);
    camEnd();
    flash(seg(t, 120.4, 120.5) * (1 - seg(t, 120.5, 120.8)) * .8);
  }

  // 3-2 · 125–129 · "RUN!" Pip hops onto the cake on Pumpkin's head; Pumpkin's legs spin in mid-air... and they're gone,
  // the vacuum (siren on) right behind.
  function s3_2(t) {
    cam(1150, 1040, 1.0);
    kitchen(t, { minutes: 8, fridgeOpen: 1, cake: false });
    const hop = seg(t, 125.6, 126.0), spin = t > 126.0 && t < 126.7, go = seg(t, 126.7, 127.3);
    const kx = lerp(1440, -600, easeIn(go)), ky = t < 126.0 ? FK : FK - 1.6 * U * (1 - go);
    pumpkin(kx, ky, U, { ...faces(t, [[125, 'panic'], [126.0, 'determined', { brow: 1 }]]), view: t > 126.0 ? 'q' : 'front', flip: true, aL: 1.2, aR: 1.2, rot: go > 0 ? -.2 : 0, ...SPY, draw: CAKEHAT, noShadow: t > 126.0, boilKey: 'pk' });
    if (spin) runLegs(kx, ky, U, t);
    const pp = hop < 1 ? arcPt([1700, FK], onCake(1440, FK, U), 220, ease(hop)) : onCake(kx, ky, U);
    pip(pp[0], pp[1], U, { ...faces(t, [[125, 'panic'], [126.0, 'determined']]), view: 'q', flip: true, aL: 1.3, aR: -.3, draw: ninjaMask(1), noShadow: true, who: 'pip', boilKey: 'pip' });
    if (go > 0) speedLines(kx + 300, FK - 260, -1, t, 6, 260, 420);
    const vx = lerp(1900, -700, easeIn(seg(t, 127.6, 128.6)));
    robotVac(vx, FK + 10, 1.0, t, { led: 'red' });
    pop2('ZOOM!', 700, 900, t, 126.8, 80, '#FFE27A', .8);
    camEnd();
    night(.55);
    cam(1150, 1040, 1.0); glow(1480, 900, 420, '#DDF2FF', .5); siren(vx, FK + 10, 1.0, t, 1); camEnd();
  }

  // 3-3 · 129–141 · The chase, a new gag every 3 s: (a) skidding on the kitchen tiles, (b) over the armchair (the vacuum
  // bonks into it and spins), (c) Pip drops cracker crumbs: the vacuum stops for every one, (d) a ring of crumbs: it goes
  // round and round until it's dizzy.
  function s3_3(t) {
    if (t < 132) {   // (a) kitchen: run left, skid past the doorway, scrabble back in
      const k = seg(t, 129, 130.6), skid = seg(t, 130.6, 131.2), back = seg(t, 131.2, 131.9);
      let kx = lerp(1700, 120, k); if (skid > 0) kx = 120 - 260 * easeOut(skid); if (back > 0) kx = -140 + 40 * back;
      const cx = clamp(kx + 300, 500, 1600);
      cam(cx, 1060, 1.0);
      kitchen(t, { minutes: 8 });
      pumpkin(kx, FK, U, { ...faces(t, [[129, 'determined', { brow: 1 }], [130.6, 'panic']]), view: 'q', flip: skid <= 0 || back > 0, rot: skid > 0 && back <= 0 ? .25 : 0, dy: -Math.abs(Math.sin(t * 16)) * .4, aL: 1.0, aR: 1.0, ...SPY, draw: CAKEHAT, boilKey: 'pk' });
      if (skid > 0 && back <= 0) { for (let i = 0; i < 3; i++) inkLine([[kx + 80 + i * 50, FK + 10], [kx + 200 + i * 60, FK + 10]], 4, '#FFFFFF', 'ink', 0); pop2('SKRRT!', kx + 120, FK - 640, t, 130.6, 64, '#FFFFFF', .7); }
      if (back > 0) runLegs(kx, FK, U, t);
      const pp = onCake(kx, FK + (-Math.abs(Math.sin(t * 16)) * .4) * U, U);
      pip(pp[0], pp[1], U, { ...face('panic'), view: 'q', flip: true, aL: 1.3, aR: 1.3, draw: ninjaMask(1), noShadow: true, boilKey: 'pip' });
      const vx = kx + 650 + 60 * Math.sin(t * 3);
      robotVac(vx, FK + 10, 1.0, t, { led: 'red' });
      speedLines(kx + 260, FK - 260, -1, t, 5, 200, 380);
      camEnd(); night(.6); cam(cx, 1060, 1.0); siren(vx, FK + 10, 1.0, t, 1); camEnd();
      return;
    }
    if (t < 135) {   // (b) living room: over the armchair; the vacuum bonks into it and spins
      cam(900, 1130, .85);
      roomNight(t);
      const jump = seg(t, 132.6, 133.5);
      let kx = lerp(1900, 1250, seg(t, 132, 132.6)), ky = FY;
      if (jump > 0) { const p = arcPt([1250, FY], [380, FY], 380, ease(jump)); kx = p[0]; ky = p[1]; }
      if (t > 133.5) kx = lerp(380, -300, seg(t, 133.5, 134.4));
      pumpkin(kx, ky, U, { ...faces(t, [[132, 'determined'], [132.6, 'surprised', { eyes: 'wide' }], [133.5, 'happy']]), view: 'q', flip: true, rot: jump > 0 && jump < 1 ? -.4 * Math.sin(jump * Math.PI) : 0, aL: 1.3, aR: 1.3, ...SPY, draw: CAKEHAT, noShadow: ky < FY - 4, boilKey: 'pk' });
      const pp = onCake(kx, ky, U);
      pip(pp[0], pp[1], U, { ...face(jump > 0 && jump < 1 ? 'surprised' : 'happy'), view: 'q', flip: true, aL: 1.4, aR: 1.4, draw: ninjaMask(1), noShadow: true, boilKey: 'pip' });
      const vin = seg(t, 132.4, 133.4), vx = lerp(1900, 1150, vin), bonk = t > 133.4;
      robotVac(vx, FY + 10, 1.0, t, { led: 'red', rot: bonk ? Math.sin((t - 133.4) * 14) * .25 * Math.exp(-(t - 133.4) * .8) : 0 });
      if (bonk) dizzy(vx, FY - 140, 70, t);
      pop2('POK!', 1150, 1250, t, 133.4, 70, '#FFFFFF', .7);
      camEnd(); night(.6); cam(900, 1130, .85); siren(vx, FY + 10, 1.0, t, 1); camEnd();
      return;
    }
    if (t < 138) {   // (c) crumbs: Pip drops cracker crumbs; the vacuum stops to slurp every one (fwip! fwip! fwip!)
      cam(1000, 1420, 1.5);
      roomNight(t);
      const kx = lerp(1300, -500, seg(t, 135, 136.6));
      const CR = [1250, 1050, 850, 650];
      CR.forEach((x, i) => { if (t > 135 + i * .35 && vacX(t) > x + 40) paint(ellPts(x, FY + 14, 12, 8, 10), { wash: '#E6B65F', sw: .8 }); });
      pumpkin(kx, FY, U, { ...face('determined'), view: 'q', flip: true, dy: -Math.abs(Math.sin(t * 16)) * .4, aL: 1.0, aR: 1.0, ...SPY, draw: CAKEHAT, boilKey: 'pk' });
      const pp = onCake(kx, FY - Math.abs(Math.sin(t * 16)) * .4 * U, U);
      pip(pp[0], pp[1], U, { ...face('smug'), view: 'q', flip: true, cracker: true, aR: .4 + .6 * Math.abs(Math.sin(t * 9)), aL: -.3, draw: ninjaMask(1), noShadow: true, boilKey: 'pip' });
      const vx = vacX(t);
      robotVac(vx, FY + 10, 1.0, t, { led: 'red' });
      CR.forEach((x, i) => pop2('fwip!', x, FY - 150, t, 136.0 + i * .5, 50, '#9CD6F5', .5));
      camEnd(); night(.6); cam(1000, 1420, 1.5); siren(vx, FY + 10, 1.0, t, 1); camEnd();
      return;
    }
    // (d) a ring of crumbs: round and round... dizzy. Its LED turns into a spiral.
    cam(800, 1350, 1.3);
    roomNight(t);
    const R = [800, FY + 30], loop = seg(t, 138.0, 140.0), stop = t > 140.0;
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; if ((loop * 2 * TAU) % TAU < a || loop >= 1) paint(ellPts(R[0] + Math.cos(a) * 300, R[1] + Math.sin(a) * 70, 11, 7, 10), { wash: '#E6B65F', sw: .8 }); }
    const a = loop * 2 * TAU + Math.PI, vx = R[0] + Math.cos(a) * 300, vy = R[1] + Math.sin(a) * 70;
    robotVac(vx, vy, 1.0, t, { led: 'red', rot: stop ? Math.sin(t * 6) * .08 : 0, blink: !stop });
    if (stop) { vacIcon(vx, vy, 1.0, 'spiral', t, 1); dizzy(vx, vy - 140, 80, t); }
    camEnd(); night(.6); cam(800, 1350, 1.3); siren(vx, vy, 1.0, t, stop ? .3 : 1); camEnd();
  }
  function vacX(t) { const S = [[136.0, 1250], [136.5, 1050], [137.0, 850], [137.5, 650]]; let x = lerp(1900, 1300, seg(t, 135.2, 135.9)); for (const [t0, cx] of S) if (t > t0 - .2) x = lerp(x, cx, ease(seg(t, t0 - .2, t0))); return x + 40; }

  // 3-4 · 141–150 · Into the cushion fort: FLUMP. Panting. "We did it." "Operation Cake... complete." A high five sends Pip
  // flying into the cushion wall.
  const FX = FORT.x, KF = FX - 120, PF = FX + 150;
  function s3_4(t) {
    cam(FX, 1300, 1.3, shake(t, 141.4, 8, .3));
    roomNight(t);
    fortBack(t);
    const dive = seg(t, 141.0, 141.4);
    const kp = dive < 1 ? arcPt([400, FY], [KF, FY], 200, ease(dive)) : [KF, FY];
    const pant = t > 141.4 && t < 143 ? Math.sin(t * 14) * .05 : 0;
    pumpkin(kp[0], kp[1], U, { ...faces(t, [[141, 'determined'], [141.5, 'strain'], [142.8, 'proud'], [146.5, 'happy'], [148.0, 'surprised', { lookX: 1 }]]), sq: pant, aL: -1.1, aR: t > 147.2 && t < 148.3 ? 1.2 : -1.1, ...SPY, draw: CAKEHAT, who: 'pumpkin', boilKey: 'pk' });
    const hi = seg(t, 147.4, 148.0), fly = seg(t, 148.0, 148.35), slide = seg(t, 148.35, 149.4);
    let pp = dive < 1 ? onCake(kp[0], kp[1], U) : [PF, FY], prot = 0, psq = 0;
    if (dive >= 1 && t < 141.8) pp = arcPt(onCake(KF, FY, U), [PF, FY], 120, ease(seg(t, 141.4, 141.8)));
    if (hi > 0) pp = arcPt([PF, FY], [KF + 4.2 * U, FY - 9.5 * U], 120, ease(hi));
    if (fly > 0) pp = [lerp(KF + 4.2 * U, FX + 300, fly), lerp(FY - 9.5 * U, FY - 6 * U, fly)];
    if (t > 148.35) { pp = [FX + 300, lerp(FY - 6 * U, FY, ease(slide))]; psq = -.25 * (1 - slide); }
    pip(pp[0], pp[1], U, { ...faces(t, [[141, 'panic'], [141.8, 'strain'], [145.0, 'proud'], [147.4, 'determined'], [148.0, 'surprised', { eyes: 'wide' }], [148.35, 'dazed']]), view: 'q', flip: t > 148.0, rot: fly > 0 && fly < 1 ? fly * TAU : prot, sq: psq,
      aL: hi > 0 && hi < 1 ? 1.4 : -.6, aR: hi > 0 && t < 148.1 ? 1.4 : -.4, draw: ninjaMask(1), noShadow: pp[1] < FY - 2, who: 'pip', boilKey: 'pip' });
    burst(KF + 4.2 * U, FY - 10 * U, 160, (t - 148.0) / .4, 10, '#FFFFFF', 3);
    pop2('CLAP!', KF + 4.2 * U, FY - 11.5 * U, t, 148.0, 70, '#FFE27A', .7);
    if (t > 148.4 && t < 149.6) dizzy(FX + 300, FY - 300, 50, t);
    fortFront(t, dive > 0 && dive < 1 ? 0 : .05 * Math.sin((t - 141.4) * 20) * Math.exp(-(t - 141.4) * 4));
    pop2('FLUMP!', FX, 1000, t, 141.4, 70, '#FFFFFF', .7);
    camEnd();
    night(.6);
  }

  // 3-5 · 150–158 · The cake goes in the middle. Both bite at once... SQUEAK. Chew... chew... "...It's a sponge." Soap
  // bubbles float out of their mouths; Pip blows a big one (POP).
  function s3_5(t) {
    cam(FX + 10, 1290, 1.9);
    roomNight(t);
    fortBack(t);
    const place = seg(t, 150.0, 150.8), bite = t > 151.4, lean = ease(seg(t, 151.0, 151.4)) * (1 - ease(seg(t, 151.8, 152.2)));
    const chew = t > 151.8 && t < 154.8 ? Math.max(0, Math.sin(t * 12)) * .3 : 0;
    pumpkin(KF, FY, U, { ...faces(t, [[150, 'happy'], [151.0, 'greedy'], [151.8, 'munching'], [153.0, 'munching', { brow: .4 }], [154.0, 'deadpan'], [155.9, 'deadpan', { mouth: 'O' }]]), ...(chew ? { talk: chew } : {}), rot: .18 * lean,
      aL: -1.1, aR: place < 1 ? .9 : -1.1, ...SPY, draw: place <= 0 ? CAKEHAT : undefined, who: t > 154.5 ? 'pumpkin' : undefined, boilKey: 'pk' });
    pip(PF, FY, U, { ...faces(t, [[150, 'happy'], [151.0, 'greedy'], [151.8, 'munching'], [153.4, 'deadpan'], [156.5, 'deadpan', { mouth: 'O' }]]), ...(chew ? { talk: chew } : {}), view: 'q', flip: true, rot: -.18 * lean, aL: -.6, aR: -.4, draw: ninjaMask(1), boilKey: 'pip' });
    if (place > 0) { const p = place < 1 ? arcPt([KF + .2 * U, FY - 11.9 * U], [FX + 20, FY + 10], 60, ease(place)) : [FX + 20, FY + 10]; cakeSlice(p[0], p[1], .7, false); }
    pop2('SQUEAK!', FX + 20, FY - 230, t, 151.5, 64, '#F49AC1', .9);
    bubbles(KF + 10, FY - 7.6 * U, t - 155.9, 6, 3);
    const bb = seg(t, 156.6, 157.5), popped = t > 157.5;
    if (bb > 0 && !popped) { const r = 20 + 90 * bb; paint(ellPts(PF - 30 - r * .6, FY - 4.3 * U, r, r, 24), { wash: '#DDF4FF', washOp: 80, sw: 1.6 }); paint(ellPts(PF - 30 - r * .9, FY - 4.3 * U - r * .4, r * .2, r * .14, 8), { wash: '#FFFFFF', ink: null }); }
    pop2('POP!', PF - 120, FY - 300, t, 157.5, 60, '#9CD6F5', .6);
    burst(PF - 120, FY - 4.3 * U, 120, (t - 157.5) / .3, 8, '#DDF4FF', 5);
    fortFront(t);
    camEnd();
    night(.55);
  }

  // 3-6 · 158–166 · SHLURP: the blanket roof is sucked away. The vacuum rolls in, LED blue, siren off, the REAL cake on its
  // back with a lit candle. It beeps a little birthday tune. Both stare.
  const VB = [FX + 520, FY + 10];
  function s3_6(t) {
    cam(FX + 120, 1240, 1.15);
    roomNight(t);
    fortBack(t, seg(t, 158.4, 159.2));
    const vin = seg(t, 159.3, 160.3), vx = lerp(2300, VB[0], easeOut(vin));
    pumpkin(KF, FY, U, { ...faces(t, [[158, 'deadpan'], [158.4, 'surprised', { lookY: -1 }], [160.0, 'surprised', { eyes: 'wide', lookX: 1 }], [163.0, 'sheepish', { lookX: -1 }], [164.0, 'surprised', { eyes: 'wide', lookX: 1, pupil: 1 }]]), aL: -1.1, aR: -1.1, ...SPY, boilKey: 'pk' });
    pip(PF, FY, U, { ...faces(t, [[158, 'deadpan'], [158.4, 'surprised', { lookY: -1 }], [160.0, 'surprised', { eyes: 'wide' }], [163.0, 'sheepish', { lookX: -1 }], [164.0, 'happy']]), view: 'q', flip: t > 163 && t < 164, aL: -.6, aR: -.4, draw: ninjaMask(1), boilKey: 'pip' });
    cakeSlice(FX + 20, FY + 10, .7, false);
    robotVac(vx, VB[1], 1.0, t, { led: 'blue', blink: false });
    cakeSlice(vx - 10, VB[1] - 60, .9, false, t > 160.4 ? .6 : 0); candle(vx - 20, VB[1] - 60 - 100, 1.0, t, 1);
    for (let i = 0; i < 6; i++) pop2('♪', vx + 90 + (i % 2) * 60, VB[1] - 280, t, 161.0 + i * .6, 56, '#9CD6F5', .9, (i % 2 ? .2 : -.2));
    fortFront(t, 0, seg(t, 158.4, 159.2), [vx, VB[1] - 40]);
    pop2('SHLURP!', 1700, 900, t, 158.6, 70, '#9CD6F5', .8);
    camEnd();
    night(.55);
    cam(FX + 120, 1240, 1.15); glow(vx - 20, VB[1] - 250, 260, '#FFD27A', .5 * vin); camEnd();
  }

  // 3-7 · 166–172 · Pip points at the wall calendar: today, circled in red, "PUMPKIN'S B-DAY". "...For me?" Tears gush like a
  // fountain. The vacuum shows a heart. "Happy birthday, Pumpkin."
  const CAL = [1900, 940];
  function s3_7(t) {
    cam(1460, 1260, 1.15);
    roomNight(t);
    calendar(CAL[0], CAL[1], seg(t, 166.4, 167.0));
    if (t > 166.9) letter("PUMPKIN'S B-DAY", CAL[0], CAL[1] + 175, 44, '#E2463F', { font: '800 44px "Baloo 2", sans-serif', stroke: '#FFFFFF', pop: seg(t, 166.9, 167.1) * 1.2, rot: -.05 });
    fortBack(t, 1);
    fortFront(t, 0, 1);
    const cry = t > 168.2;
    pumpkin(KF, FY, U, { ...faces(t, [[166, 'surprised', { lookX: -1, lookY: -1 }], [167.2, 'sheepish', { blush: .7 }], [168.2, 'happy', { blush: .8 }]]), aL: -1.1, aR: -1.1, ...SPY, who: 'pumpkin', boilKey: 'pk' });
    pip(PF, FY, U, { ...faces(t, [[166, 'happy', { lookX: -1 }], [169.4, 'happy']]), view: 'q', flip: t >= 168, aL: -.6, aR: t < 168 ? 1.3 : -.4, draw: ninjaMask(1), who: 'pip', boilKey: 'pip' });
    cakeSlice(FX + 20, FY + 10, .7, false);
    robotVac(VB[0], VB[1], 1.0, t, { led: 'blue', blink: false });
    cakeSlice(VB[0] - 10, VB[1] - 60, .9, false, .6); candle(VB[0] - 20, VB[1] - 160, 1.0, t, 1);
    if (cry) for (const s of [-1, 1]) for (let i = 0; i < 9; i++) { const k = frac(t * 1.6 + i / 9), ex = KF + s * 1.15 * U, ey = FY - 8.6 * U; paint(ellPts(ex + s * k * 330, ey - 220 * k + 380 * k * k, 13, 17, 10), { wash: '#8FD3F0', sw: .8 }); }
    if (t > 168.5) emote('heart', VB[0] + 60, VB[1] - 300, 40, seg(t, 168.5, 168.8), t - 168.5);
    camEnd();
    night(.5);
    cam(1460, 1260, 1.15); glow(VB[0] - 20, VB[1] - 250, 260, '#FFD27A', .55); camEnd();
  }

  // 3-8 · 172–180 · Pumpkin blows out the candle so hard Pip flies off (FWOOSH). Then all three share the real cake on the
  // rug; the vacuum slurps the crumbs off Pumpkin's face. Final picture.
  function s3_8(t) {
    const z = lerp(1.25, 1.1, ease(seg(t, 177.5, 180)));
    cam(1350, 1270, z);
    roomNight(t);
    fortBack(t, 1); fortFront(t, 0, 1);
    const blow = t > 173.0 && t < 173.8, eat = t > 174.6;
    const lit = t < 173.2 ? 1 : 0;
    pumpkin(KF, FY, U, { ...faces(t, [[172, 'happy'], [172.4, 'determined', { mouth: 'O' }], [173.0, 'strain', { mouth: 'O' }], [173.8, 'surprised', { lookX: 1 }], [174.6, 'munching'], [176.8, 'surprised', { lookX: 1, eyes: 'wide' }], [177.8, 'happy', { blush: .6 }]]),
      sq: t > 172.4 && t < 173 ? -.08 * seg(t, 172.4, 173) : 0, ...(eat && t < 176.8 ? { talk: Math.max(0, Math.sin(t * 12)) * .3 } : {}), aL: -1.1, aR: eat ? .6 : -1.1, ...SPY, boilKey: 'pk' });
    if (blow) for (let i = 0; i < 5; i++) inkLine([[KF + 2 * U + i * 30, FY - 8 * U + (i - 2) * 26], [KF + 6 * U + i * 60, FY - 7.6 * U + (i - 2) * 40]], 4, '#FFFFFF', 'ink', .3);
    const fly = seg(t, 173.0, 173.6), back = seg(t, 174.2, 174.8);
    let pp = [PF, FY], prot = 0;
    if (fly > 0 && back <= 0) { pp = arcPt([PF, FY], [FX + 700, FY - 2 * U], 260, fly); prot = fly * TAU * 1.5; }
    if (back > 0) pp = arcPt([FX + 700, FY], [PF + 60, FY], 140, ease(back));
    pip(pp[0], pp[1], U, { ...faces(t, [[172, 'happy'], [173.0, 'surprised', { eyes: 'wide' }], [174.2, 'happy'], [175.0, 'munching'], [177.8, 'happy']]), view: 'q', flip: true, rot: prot, aL: fly > 0 && fly < 1 ? 1.4 : -.6, aR: eat ? .6 : -.4, cracker: false, draw: ninjaMask(1), noShadow: pp[1] < FY - 2, boilKey: 'pip' });
    const vx = lerp(VB[0], KF + 330, ease(seg(t, 175.8, 176.6)));
    robotVac(vx, VB[1], 1.0, t, { led: 'blue', blink: false });
    if (t < 175.8) { cakeSlice(vx - 10, VB[1] - 60, .9, false, 0); candle(vx - 20, VB[1] - 160, 1.0, t, lit); }
    else cakeSlice(FX + 60, FY + 10, .9, false, 0);
    pop2('FWOOSH!', FX + 300, FY - 520, t, 173.0, 70, '#FFFFFF', .8);
    if (t > 176.8 && t < 177.6) { for (let i = 0; i < 4; i++) { const k = frac(t * 3 + i / 4); paint(ellPts(lerp(KF + 1.5 * U, vx + 60, k), lerp(FY - 7.5 * U, VB[1] - 40, k), 8, 6, 8), { wash: '#F6E3C6', ink: null }); } }
    pop2('SHLURP!', vx + 60, FY - 330, t, 176.8, 56, '#9CD6F5', .8);
    if (t > 178.0) emote('heart', vx + 40, VB[1] - 260, 36, seg(t, 178.0, 178.3), t - 178.0);
    camEnd();
    night(.45);
    cam(1350, 1270, z); if (lit) glow(vx - 20, VB[1] - 250, 260, '#FFD27A', .55); glow(FX, FY - 200, 520, '#FFE9A8', .25); camEnd();
  }

  function placeholder(n) {
    return t => { paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#2B2233', ink: null }); letter(`PART ${n} (not built yet)`, W / 2, H / 2, 80, '#FFFFFF', { screen: true }); };
  }
  shots([[0, s1_1], [4, s1_2], [9, s1_3], [14, s1_4], [22, s1_5], [25, s1_6], [32, s1_7], [44, s1_8], [52, s1_9], [60, s2_1], [65, s2_2], [68, s2_34], [76, s2_5], [82, s2_6], [86, s2_7], [92, s2_8], [98, s2_9], [112.6, s2_11], [120, s3_1], [125, s3_2], [129, s3_3], [141, s3_4], [150, s3_5], [158, s3_6], [166, s3_7], [172, s3_8], [180, t => endScreen(t, 180, { hat: true })]]);
})();
