// cover.js: the Short's cover / thumbnail (1080 x 1920): Pumpkin stuck in the flap, close, embarrassed, Pip smug
// beside him with his cracker, and one big word. Render (from stories/03-cat-flap):
//   NODE_PATH=$(npm root -g) node ../../engine/flat/render_pw.mjs --loop=cover --still=0.6 --out=out/cover.png
(() => {
  LOOPS.cover = t => {
    camBegin(560, 1010, 1.55);
    kitchenFront(t);
    const f = KF.flap;
    const P = { ...face('embarrassed', { lookX: .7, blush: 1 }), belly: 1, aL: -1.45, aR: -1.45, noShadow: true, noTail: true, boilKey: 'cv', sq: .03 };
    clipRects([[f.x, f.y, f.w, f.h]], () => pumpkin(540, 1361, 48, P));
    paint(rectPts(f.x - 18, f.y - 6, 18, f.h + 6), { wash: KC.doorDk, ink: null });
    paint(rectPts(f.x + f.w, f.y - 6, 18, f.h + 6), { wash: KC.doorDk, ink: null });
    clipRects([[-600, -600, W + 1200, f.y - 18 + 600]], () => pumpkin(540, 1361, 48, P));
    for (const s of [-1, 1]) {
      const px = s < 0 ? f.x - 8 : f.x + f.w + 8, py = f.y - 22;
      paint(ellPts(px, py, .78 * 48, .58 * 48, 20, 0, s * .25), { wash: PUMPKIN_COL.col, sw: 1.6, shade: true, shadeK: .5 });
      for (const k of [-1, 0, 1]) inkLine([[px + k * 14, py + 2], [px + k * 15, py + 22]], 1.3, mixCol(PUMPKIN_COL.col, '#2A1A30', .45), 'inkfine', 0);
    }
    for (const [x, y, r] of [[700, 870, 9], [728, 905, 7], [690, 930, 6]]) paint(ellPts(x, y, r * .8, r, 10), { wash: '#BFE6F5', sw: .6 });   // sweat drops
    pip(800, KF.floor + 75, 48, { ...face('smug'), view: 'q', flip: true, cracker: true, aR: .45, boilKey: 'cvp' });
    camEnd();
    // the words, high in the frame (clear of the Shorts UI at the bottom)
    letter('STUCK!', W / 2, 300, 230, '#FFB347', { font: '800 230px "Baloo 2", sans-serif', stroke: '#2B2233', rot: -.05, screen: true });
    letter('too much pie…', W / 2, 470, 92, '#FFFFFF', { font: '800 92px "Baloo 2", sans-serif', stroke: '#2B2233', rot: .02, screen: true });
  };
  LOOPS.cover.len = 2;
})();
