// sheets.js: model sheets for the new cast of long/07 (reference only; labels allowed). Render, from this folder:
//   node ../../engine/flat/render_pw.mjs --loop=lineup --still=0.4 --out=out/check/lineup.png
//   ... --loop=sheetA (Sir Lint + Queen Button), sheetB (Sock Troll + Oracle Cookie + Dust Bunnies), sheetC (Pumpkin's costume + Pip)
(() => {
  const bg = () => paint(rectPts(-20, -20, W + 40, H + 40), { wash: '#F1E7D6', ink: null });
  const label = (txt, x, y, size = 30) => letter(txt, x, y, size, '#2B2233', { font: `800 ${size}px "Baloo 2", sans-serif`, ink: false, alpha: .85, screen: true });
  const floor = y => inkLine([[40, y + 6], [W / 2, y + 4], [W - 40, y + 7]], 1, '#B9A98F', 'inkfine', .4);
  const title = t => letter(t, W / 2, 50, 44, '#2B2233', { font: '800 44px "Baloo 2", sans-serif', ink: false, screen: true });

  // Everyone side by side at the SAME u, Pumpkin (in costume) and Pip for scale.
  LOOPS.lineup = t => {
    bg(); title('Lostland cast · scale lineup (same u)');
    const u = 52, gy = 960, xs = [230, 640, 900, 1110, 1330, 1540, 1700, 1800];
    sockCape(xs[0], gy, u, {});
    pumpkin(xs[0], gy, u, { ...face('proud'), crown: true, aR: .9, armR: excalifork(.6), boilKey: 'l0' });
    pipPack(xs[1], gy, u, {}); pip(xs[1], gy, u, { ...face('deadpan'), boilKey: 'l1' });
    sirLint(xs[2], gy, u, { ...face('determined'), boilKey: 'l2' });
    queenButton(xs[3], gy, u, { ...face('happy'), boilKey: 'l3' });
    sockTroll(xs[4], gy, u, { ...face('neutral'), boilKey: 'l4' });
    oracleCookie(xs[5], gy, u, { paper: .8, text: 'GO RIGHT', boilKey: 'l5' });
    dustBunny(xs[6], gy, u, { seed: 1, boilKey: 'l6' }); dustBunny(xs[7], gy, u, { seed: 4, boilKey: 'l7' });
    floor(gy);
    ['Pumpkin (hero kit)', 'Pip + pack', 'Sir Lint', 'Queen Button', 'Sock Troll', 'Oracle Cookie', 'Dust Bunnies'].forEach((n, i) => label(n, i < 6 ? xs[i] : 1750, gy + 60, 28));
  };
  LOOPS.lineup.len = 2;
  // the new town, wide, with the folk in it for scale
  LOOPS.town = t => {
    camBegin(960, TFY - 445 / 0.85, 0.85);
    townSquare(t, {});
    sirLint(300, TFY, 40, { ...face('happy'), boilKey: 'tl' }); queenButton(640, TFY, 40, { ...face('proud'), boilKey: 'tq' });
    dustBunny(760, TFY, 40, { seed: 2, boilKey: 'tb' }); buttonFolk(1250, TFY, 40, { ...face('happy'), seed: 1, boilKey: 'tf' }); dustBunny(1560, TFY, 40, { seed: 4, boilKey: 'tb2' });
    pumpkin(1960, TFY, 40, { ...face('surprised'), boilKey: 'tp' });
    camEnd();
  };
  LOOPS.town.len = 2;
  const placeCam = () => camBegin(960, TFY - 445 / .85, .85);
  LOOPS.place0 = t => { placeCam(); palaceFront(t); queenButton(960, TFY - STEP, 40, { ...face('proud'), boilKey: 'pq' }); pumpkin(560, TFY, 40, { ...face('surprised'), view: 'q', boilKey: 'pp' }); pip(1350, TFY, 40, { ...face('deadpan'), view: 'q', flip: true, boilKey: 'pi' }); camEnd(); };
  LOOPS.place1 = t => { placeCam(); throneRoom(t); queenButton(560, TFY, 40, { ...face('happy'), boilKey: 'tq' }); pumpkin(960, TFY, 40, { ...face('proud'), crown: true, boilKey: 'tp' }); dustBunny(1300, TFY, 40, { seed: 3, boilKey: 'tb' }); camEnd(); };
  LOOPS.place2 = t => { placeCam(); townGate(t, { dark: .3 }); pumpkin(800, TFY, 40, { ...face('panic'), view: 'q', boilKey: 'gp' }); pip(1050, TFY, 40, { ...face('surprised'), view: 'q', boilKey: 'gi' }); dragonEyes(2000, TFY - 300, 1, t); camEnd(); };
  for (const k of ['place0', 'place1', 'place2']) LOOPS[k].len = 2;

  // a row: views then expressions of one character
  const row = (fn, gy, u, views, faces_, extra = {}) => {
    const n = views.length + faces_.length, cw = (W - 80) / n;
    views.forEach(([nm, o], i) => { fn(40 + cw * (i + .5), gy, u, { ...face('neutral'), ...extra, ...o, boilKey: 'v' + gy + i }); label(nm, 40 + cw * (i + .5), gy + 44, 24); });
    faces_.forEach(([nm, o], i) => { const j = views.length + i; fn(40 + cw * (j + .5), gy, u, { ...extra, ...o, boilKey: 'f' + gy + i }); label(nm, 40 + cw * (j + .5), gy + 44, 24); });
    floor(gy);
  };
  const V3 = [['front', {}], ['3/4', { view: 'q' }], ['side', { view: 'side' }], ['3/4 flip', { view: 'q', flip: true }]];

  LOOPS.sheetA = t => {
    bg(); title('Sir Lint · Queen Button');
    row(sirLint, 470, 58, V3, [['heroic', face('determined', { mouth: 'grin' })], ['scared', face('panic')], ['ACHOO (poof)', { ...face('strain'), poof: .7 }], ['sad', face('sheepish')]]);
    row(queenButton, 1010, 54, V3, [['regal', face('proud')], ['shocked', face('surprised')], ['stern', face('annoyed', { mouth: 'flat' })], ['talking', { ...face('happy'), talk: .5 + .5 * Math.sin(t * 18) }]]);
  };
  LOOPS.sheetA.len = 2;

  LOOPS.sheetB = t => {
    bg(); title('Sock Troll · Oracle Cookie · Dust Bunnies');
    row(sockTroll, 450, 58, [['side', {}], ['front', { view: 'front' }], ['side flip', { flip: true }]], [['riddling', face('smug', { mouth: 'smirk' })], ['crying', { ...face('sheepish'), tears: 1, mouth: 'wobble' }], ['joy (reunited)', face('happy', { mouth: 'grin' })], ['shouting', face('surprised', { talk: 1 })]]);
    const gy = 1000, u = 60;
    [['mystic', { paper: 0 }], ['fortune out', { paper: 1, text: 'YOU WILL EAT... SOON' }], ['eyes open', { lid: .05, pupil: .3, paper: 0 }]].forEach(([nm, o], i) => { oracleCookie(170 + i * 330, gy, u, { ...o, boilKey: 'oc' + i }); label(nm, 170 + i * 330, gy + 44, 24); });
    [['bunny', { seed: 1 }], ['bunny', { seed: 2 }], ['scared', { seed: 3, ...face('panic') }], ['happy', { seed: 5, eyes: 'happy' }], ['hop', { seed: 6, hop: true }]].forEach(([nm, o], i) => { dustBunny(1150 + i * 165, gy, 60, { ...o, boilKey: 'db' + i }); label(nm, 1150 + i * 165, gy + 44, 24); });
    floor(gy);
  };
  LOOPS.sheetB.len = 2;

  LOOPS.sheetC = t => {
    bg(); title("Pumpkin's hero kit (crown in the rig, sock cape, Excalifork) · Pip's cracker pack");
    const u = 34, gy = 520, xs = [170, 470, 770, 1070];
    [['front', {}], ['3/4', { view: 'q' }], ['side', { view: 'side' }], ['3/4 flip', { view: 'q', flip: true }]].forEach(([nm, o], i) => {
      sockCape(xs[i], gy, u, o); pumpkin(xs[i], gy, u, { ...face('proud'), ...o, crown: true, aR: .5, armR: excalifork(0), boilKey: 'c' + i }); label(nm, xs[i], gy + 40, 24);
    });
    sockCape(1370, gy, u, {}); pumpkin(1370, gy, u, { ...face('surprised', { lookY: -1 }), crown: { slip: 1 }, aR: .3, aL: .8, armR: excalifork(0), boilKey: 'c5' }); label('crown slipped', 1370, gy + 40, 24);
    sockCape(1680, gy, u, { wind: .6 }); pumpkin(1680, gy, u, { ...face('determined', { mouth: 'grin' }), crown: true, aR: 1.1, armR: excalifork(1), boilKey: 'c6' }); label('spell!', 1680, gy + 40, 24);
    floor(gy);
    const g2 = 990, u2 = 52;
    [['front', {}], ['3/4', { view: 'q' }], ['side', { view: 'side' }], ['3/4 flip', { view: 'q', flip: true }]].forEach(([nm, o], i) => { pipPack(260 + i * 300, g2, u2, o); pip(260 + i * 300, g2, u2, { ...face('neutral'), ...o, boilKey: 'p' + i }); label(nm, 260 + i * 300, g2 + 40, 24); });
    floor(g2);
    // close-ups: crown and fork
    push(); translate(1500, 900); scale(2.4, 2.4); castCrown(0, 0, 40, true, 1.4); pop(); label('bottle-cap crown', 1500, 990, 24);
    push(); translate(1640, 760); rotate(-.6); excalifork(.8)(60, 1.6); pop(); label('Excalifork', 1760, 990, 24);
  };
  LOOPS.sheetC.len = 2;
  // the hero kit, side and 3/4 views on their own (no overlaps), for checking the crown and cape
  LOOPS.kitViews = t => {
    bg();
    [['front', {}], ['3/4', { view: 'q' }], ['side', { view: 'side' }], ['side flip', { view: 'side', flip: true }]].forEach(([nm, o], i) => {
      const x = 260 + i * 470; sockCape(x, 900, 40, o); pumpkin(x, 900, 40, { ...face('proud'), ...o, crown: true, aR: o.view === 'side' ? -.2 : .5, armR: excalifork(0), boilKey: 'k' + i }); label(nm, x, 950, 28);
    });
  };
  LOOPS.kitViews.len = 2;
})();
