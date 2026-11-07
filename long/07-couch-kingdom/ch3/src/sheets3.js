// sheets3.js: chapter 3 "The Fizzy Swamp" model sheets (reference only; labels allowed). Render from THIS folder:
//   NODE_PATH=$(npm root -g) node ../../../engine/flat/render_pw.mjs --loop=sheetMoth --still=0.4 --out=out/check/ch3_sheetMoth.png
//   loops: sheetMoth, sheetHeroes (Pumpkin / Pip / Sir Lint as they are in ch3), sheetPropsA (seal, scroll, shield, rope),
//          sheetPropsB (jelly bridge, car, night camp), lineup3 (scale lineup)
(() => {
  const bg = () => paint(rectPts(-20, -20, W + 40, H + 40), { wash: '#F1E7D6', ink: null });
  const label = (txt, x, y, size = 24) => letter(txt, x, y, size, '#2B2233', { font: `800 ${size}px "Baloo 2", sans-serif`, ink: false, alpha: .85, screen: true });
  const note = (txt, x, y, size = 22) => letter(txt, x, y, size, '#5C5166', { font: `700 ${size}px "Baloo 2", sans-serif`, ink: false, alpha: .9, screen: true });
  const floor = (y, x0 = 40, x1 = W - 40) => inkLine([[x0, y + 6], [(x0 + x1) / 2, y + 4], [x1, y + 7]], 1, '#B9A98F', 'inkfine', .4);
  const title = (t, s) => { letter(t, W / 2, 50, 44, '#2B2233', { font: '800 44px "Baloo 2", sans-serif', ink: false, screen: true }); if (s) note(s, W / 2, 86, 22); };
  const stained = (o, k = 1) => ({ draw: sodaStains(k), ...o });

  // ---- everyone at the same u (scale) ----
  LOOPS.lineup3 = t => {
    bg(); title('Chapter 3 · The Fizzy Swamp · scale lineup (same u)');
    const u = 42, gy = 900, xs = [230, 600, 850, 1130, 1340, 1450, 1560];
    pumpkin(xs[0], gy, u, stained({ ...face('soggy'), crown: true, wet: 1, aR: -.4, armR: excalifork(0), boilKey: 'l0' }, 1));
    pipPack(xs[1], gy, u, {}); pip(xs[1], gy, u, { ...face('deadpan'), boilKey: 'l1' });
    sirLint(xs[2], gy, u, { ...face('determined'), noShield: true, boilKey: 'l2' }); bittenShield(xs[2] - 1.75 * u, gy - 1.45 * u, u);
    moth(xs[3], gy, u, { ...face('deadpan'), flap: .25, boilKey: 'l3' });
    dustBunny(xs[4], gy, u, { seed: 1, boilKey: 'l4' }); dustBunny(xs[5], gy, u, { seed: 4, boilKey: 'l5' }); dustBunny(xs[6], gy, u, { seed: 2, boilKey: 'l6' });
    floor(gy, 40, 1640);
    [['Pumpkin (soda-soaked, no cape)', xs[0]], ['Pip + pack', xs[1]], ['Sir Lint (bitten shield)', xs[2]], ['Moth (hovering)', xs[3]], ['Dust Bunnies', 1450]].forEach(([n, x]) => label(n, x, gy + 52, 22));
    // height ruler in u
    for (let k = 0; k <= 12; k += 2) { inkLine([[1700, gy - k * u], [1740, gy - k * u]], 1.5, '#8A7F6B', 'inkfine', 0); note(k + 'u', 1780, gy - k * u + 6, 20); }
    inkLine([[1720, gy], [1720, gy - 12 * u]], 1.5, '#8A7F6B', 'inkfine', 0);
    note('Moth: body ≈ 3.4u, antennae tip ≈ 6u up, wingspan ≈ 6.5u, hovers ≈ 2.7u above the ground', W / 2, gy + 100, 22);
  };
  LOOPS.lineup3.len = 2;

  // ---- Moth ----
  const row = (fn, gy, u, views, faces_, extra = {}) => {
    const n = views.length + faces_.length, cw = (W - 80) / n;
    views.forEach(([nm, o], i) => { fn(40 + cw * (i + .5), gy, u, { ...face('deadpan'), ...extra, ...o, boilKey: 'v' + gy + i }); label(nm, 40 + cw * (i + .5), gy + (extra.ly || 44), 24); });
    faces_.forEach(([nm, o], i) => { const j = views.length + i; fn(40 + cw * (j + .5), gy, u, { ...extra, ...o, boilKey: 'f' + gy + i }); label(nm, 40 + cw * (j + .5), gy + 44, 24); });
    floor(gy);
  };
  LOOPS.sheetMoth = t => {
    bg(); title('Moth · the Royal Messenger', 'night moth · red courier sash · hovers · formal, cold, deep voice · every wing = forewing + hindwing (all views) · beat ≈ 0.42 s');
    row(moth, 380, 44, [['front', { flap: .25 }], ['3/4', { view: 'q', flap: .25 }], ['side', { view: 'side', flap: 0 }], ['3/4 flip', { view: 'q', flip: true, flap: .25 }], ['perched (wings folded)', { land: 1 }], ['carrying the scroll', { scroll: 1, flap: .1 }]], [], { ly: 50 });
    row(moth, 770, 44, [], [
      ['"Is the hero ready?"', { ...face('deadpan', { mouth: 'flat', browUp: .2 }), flap: .25, talk: .35 + .35 * Math.sin(t * 15) }],
      ['"He\'s the offering. Not a guest."', { ...face('annoyed', { brow: .8, lid: .6 }), flap: .25 }],
      ['"He ate your shield."', { ...face('deadpan', { lid: .7, brow: .1, lookX: -.5 }), flap: .25 }],
      ['flies off into the dark', { ...face('deadpan'), view: 'side', flip: true, flap: .1 }]]);
    const gy = 1010; row(moth, gy, 26, [['wing up', { flap: .25 }], ['mid', { flap: 0 }], ['wing down', { flap: .75 }], ['side up', { view: 'side', flap: .25 }], ['side mid', { view: 'side', flap: 0 }], ['side down', { view: 'side', flap: .75 }], ['side perched', { view: 'side', land: 1 }]], []);
  };
  LOOPS.sheetMoth.len = 2;
  // motion check: the wing beat and hover at the real speed (front, 3/4, side) + a pass across the frame
  LOOPS.mothFly = t => {
    paint(rectPts(-20, -20, W + 40, H + 40), { wash: '#1E1A2B', ink: null });
    ledLamp(960, 1000, 50, { flick: .3 });
    moth(360, 560, 50, { ...face('deadpan'), boilKey: 'm0' }); moth(960, 560, 50, { ...face('deadpan'), view: 'q', boilKey: 'm1' }); moth(1560, 560, 50, { ...face('deadpan'), view: 'side', boilKey: 'm2' });
    const px = -200 + (t % 3) / 3 * 2400; moth(px, 900 - Math.sin(t * 2) * 40, 28, { ...face('deadpan'), view: 'side', boilKey: 'm3' });
    windupCar(1500, 1000, .6, t, { noFront: true, tilt: .1 }); moth(1500 - 130 * .6 - 30, 1000 - 80 * .6 + 18, 26, { ...face('deadpan'), land: 1, noShadow: true, boilKey: 'm4' });
  };
  LOOPS.mothFly.len = 3;

  // ---- the heroes as they are in chapter 3 ----
  LOOPS.sheetHeroes = t => {
    bg(); title('Chapter 3 continuity · the heroes', 'Pumpkin: NO cape · crown + Excalifork · soda-soaked (dries in ch4) · limps after the spear      Sir Lint: bitten shield');
    const gy = 500, u = 27;
    [['soaked, front', { view: 'front', wet: 1, ...face('soggy') }], ['3/4', { view: 'q', wet: 1, ...face('soggy') }], ['side · limp', { view: 'side', wet: 1, walk: .15, ...face('annoyed') }], ['3/4 flip', { view: 'q', flip: true, wet: 1, ...face('soggy') }], ['"Ow! Third time\'s the butt!"', { wet: 1, ...face('panic', { mouth: 'O', talk: .8 }) }], ['bites the shield', { wet: .6, ...face('greedy') }], ['asleep, hugging the bag', { wet: .35, eyes: 'closed', brow: -.3, mouth: 'smile', blush: .5 }]].forEach(([nm, o], i) => {
      const x = 140 + i * 273; pumpkin(x, gy, u, stained({ crown: true, armR: excalifork(0), aR: -.6, ...o, boilKey: 'h' + i }, o.wet)); label(nm, x, gy + 40, 20);
    });
    floor(gy);
    const g2 = 960, u2 = 38;
    [['front', {}], ['3/4', { view: 'q' }], ['side', { view: 'side' }]].forEach(([nm, o], i) => { const x = 130 + i * 250; pipPack(x, g2, u2, o); pip(x, g2, u2, { ...face('deadpan'), ...o, boilKey: 'p' + i }); label('Pip ' + nm, x, g2 + 40, 22); });
    pipPack(880, g2, u2, {}); pip(880, g2, u2, { ...face('deadpan', { eyes: 'closed' }), boilKey: 'p3' }); label('Pip, eyes shut', 880, g2 + 40, 22);
    [['front', {}], ['3/4', { view: 'q' }], ['side', { view: 'side' }]].forEach(([nm, o], i) => { const x = 1110 + i * 230; sirLint(x, g2, u2, { ...face('determined'), noShield: true, ...o, boilKey: 's' + i }); if (o.view !== 'side') bittenShield(x - 1.75 * u2 + (o.view === 'q' ? .3 * u2 : 0), g2 - 1.45 * u2, u2, { view: o.view }); label('Sir Lint ' + nm, x, g2 + 40, 22); });
    sirLint(1800, g2, u2, { ...face('sheepish'), noShield: true, boilKey: 's3' }); bittenShield(1800 - 1.75 * u2, g2 - 1.45 * u2, u2); label('guilty (rubs the bite)', 1790, g2 + 40, 22);
    floor(g2);
  };
  LOOPS.sheetHeroes.len = 2;

  // ---- props A: seal, scroll, shield, rope ----
  LOOPS.sheetPropsA = t => {
    bg(); title('Chapter 3 props A', 'the royal seal is the locked asset: one function, same shape every shot (ch3 143.0 · ch4 49.0 · ch5 193.0)');
    royalSeal(280, 330, 360, {}); label('royal seal (D)', 280, 560, 26); note('wax #B3202A · button Ø.70 D · 4 holes 2×2 · clip crown', 280, 592, 20);
    royalScroll(800, 620, 300, { roll: .3 }); label('scroll: receipt paper, D = ⅓ paper width', 800, 790, 24);
    sirLint(1260, 620, 54, { ...face('determined'), noShield: true, boilKey: 'ps' }); bittenShield(1260 - 1.75 * 54, 620 - 1.45 * 54, 54); label('Sir Lint, bitten shield', 1260, 676, 24); floor(620, 1060, 1480);
    bittenShield(1590, 360, 120, { bite: 0, rot: 0 }); bittenShield(1790, 560, 120, { rot: 0 }); label('before', 1590, 520, 24); label('after (81.0): one bite', 1790, 740, 24);
    const y2 = 960;
    hairSpear(480, y2 - 60, 36, { rope: 1 }); label('toothpick spear + hair rope (tied at the tail)', 520, y2, 24);
    hairCoil(1040, y2 - 80, 90); label('rope coiled on the car key', 1040, y2, 24);
    autograph(1500, y2 - 40, 100); label('autograph paper', 1500, y2, 24);
    floor(y2);
  };
  LOOPS.sheetPropsA.len = 2;

  // ---- props B: jelly bridge, the car, night camp ----
  LOOPS.sheetPropsB = t => {
    bg(); title('Chapter 3 props B', 'jelly bridge (from the soda swamp) · Sir Lint\'s car · night camp');
    jellyPlank(80, 300, 540, { wob: .3 }); label('jelly bridge: whole', 350, 340, 24);
    jellyPlank(690, 300, 540, { bite: 1 }); label('bitten (118.0)', 960, 340, 24);
    jellyPlank(1300, 300, 540, { wave: 1 }); label('wave runs right → left to the car (119.5)', 1570, 340, 22);
    windupCar(380, 760, 1.0, 0, { noFront: true, tilt: .1 }); label('Sir Lint\'s car: front wheel gone, nose down (does not lose more)', 380, 810, 22);
    hairCoil(232, 700, 46);
    ledLamp(900, 770, 70); label('LED "campfire"', 900, 830, 24);
    snackBag(1150, 770, 70); label('empty cracker bag', 1150, 830, 24);
    fizzBubble(1380, 650, 70); fizzBubble(1520, 710, 40); fizzBubble(1680, 650, 100, { pop: .5 }); label('soda bubbles · big one pops', 1550, 830, 24);
    redLight(1820, 700, 16); label('far red light', 1820, 830, 22);
    floor(840, 40, W - 40);
    note('night camp: the LED is the only "fire" · Dust Bunnies sleep in a fluffy heap next to it', W / 2, 1060, 22);
    for (let i = 0; i < 5; i++) dustBunny(790 + i * 80, 1010, 26, { seed: i + 1, eyes: 'closed', boilKey: 'b' + i });
  };
  LOOPS.sheetPropsB.len = 2;
})();
