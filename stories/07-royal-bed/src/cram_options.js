// cram_options.js: two ways to show Pumpkin crammed into Pip's (too small) cracker box, side by side for choosing.
//   NODE_PATH=$(npm root -g) node ../../engine/flat/render_pw.mjs --loop=cramAB --still=0.6 --out=out/check/cram_AB.png
// Box art shared: a cracker box front with a cracker label. bulge 0..1 bows its sides out.
function crackerFront(cx, bottom, w, h, bulge = 0, cracks = false) {
  const b = bulge * w * .12, pts = [[cx - w / 2, bottom], ...through([[cx - w / 2, bottom], [cx - w / 2 - b, bottom - h / 2], [cx - w / 2, bottom - h]], 6).slice(1),
    [cx + w / 2, bottom - h], ...through([[cx + w / 2, bottom - h], [cx + w / 2 + b, bottom - h / 2], [cx + w / 2, bottom]], 6).slice(1)];
  paint(pts, { wash: '#E6B65F', sw: 2, shade: true, shadeK: .35 });
  paint(rrPts(cx - w * .26, bottom - h * .72, w * .52, h * .42, 10), { wash: '#F2D08A', sw: 1.2 });
  for (const [a, c] of [[-.1, -.56], [.1, -.56], [0, -.44]]) paint(ellPts(cx + a * w, bottom + c * h, w * .03, w * .03, 8), { wash: '#B8813A', ink: null });
  if (cracks) for (const s of [-1, 1]) inkLine([[cx + s * w * .5, bottom - h * .85], [cx + s * w * .44, bottom - h * .72], [cx + s * w * .5, bottom - h * .6]], 2, '#8A5A2A', 'ink', 0);
}
// A: muffin top. The box (as tall as his chest) hides his body; his belly and fur spill over the rim; paws on the rim.
function crammedA(cx, floor, U, o = {}) {
  const w = 230, h = 150, rim = floor - h;
  paint([[cx - w / 2, rim], [cx - w / 2 + 26, rim - 18], [cx + w / 2 + 26, rim - 18], [cx + w / 2, rim]], { wash: '#7A5A36', sw: 1.2 });
  clipRects([[-600, -600, 2400, rim + 600 + 4]], () => pumpkin(cx, floor - 30, U, { sq: .05, aL: -1.45, aR: -1.45, noShadow: true, noTail: true, boilKey: 'pkA', ...o }));
  // the muffin top: fur and belly bulging over the front rim and past both sides
  paint(through([[cx - w / 2 - 34, rim + 6], [cx - w / 2 - 10, rim - 40], [cx, rim - 54], [cx + w / 2 + 10, rim - 40], [cx + w / 2 + 34, rim + 6]], 6).concat([[cx + w / 2 + 34, rim + 22], [cx - w / 2 - 34, rim + 22]]),
    { wash: PUMPKIN_COL.col, sw: 1.6, shade: true, shadeK: .4 });
  paint(through([[cx - 70, rim + 8], [cx, rim - 30], [cx + 70, rim + 8]], 6).concat([[cx + 70, rim + 22], [cx - 70, rim + 22]]), { wash: PUMPKIN_COL.lt, ink: null });
  crackerFront(cx, floor, w, h, .9, true);
  for (const s of [-1, 1]) { const px = cx + s * 86, py = rim + 6; paint(ellPts(px, py, 36, 24, 18), { wash: PUMPKIN_COL.col, sw: 1.4, shade: true, shadeK: .5 }); for (const k of [-1, 0, 1]) inkLine([[px + k * 11, py + 2], [px + k * 12, py + 16]], 1.2, '#8A4A22', 'inkfine', 0); }
  // his tail sticking out at the back
  paint(ribbon([[cx + w / 2 + 10, rim - 10], [cx + w / 2 + 70, rim - 60], [cx + w / 2 + 60, rim - 130]], 34, 24), { wash: PUMPKIN_COL.col, sw: 1.4 });
}
// B: only his head pokes out of a swollen, splitting box; paws dangle over the front; cheeks squished up.
function crammedB(cx, floor, U, o = {}) {
  const w = 240, h = 200, rim = floor - h;
  paint([[cx - w / 2, rim], [cx - w / 2 + 26, rim - 18], [cx + w / 2 + 26, rim - 18], [cx + w / 2, rim]], { wash: '#7A5A36', sw: 1.2 });
  clipRects([[-600, -600, 2400, rim + 600 - 2]], () => pumpkin(cx, rim + 8.2 * U - 10, U, { sq: -.05, aL: -1.4, aR: -1.4, noShadow: true, noTail: true, boilKey: 'pkB', ...o }));
  crackerFront(cx, floor, w, h, 1.6, true);
  // the tape popping off the top, fur tufts squeezing out of the corners
  paint([[cx + w / 2 - 50, rim + 2], [cx + w / 2 - 14, rim + 2], [cx + w / 2 + 6, rim - 34], [cx + w / 2 - 34, rim - 42]], { wash: '#E9D7A8', sw: 1 });
  for (const s of [-1, 1]) paint(through([[cx + s * (w / 2 - 6), rim + 30], [cx + s * (w / 2 + 26), rim + 46], [cx + s * (w / 2 + 14), rim + 70], [cx + s * (w / 2 + 30), rim + 90], [cx + s * (w / 2 - 4), rim + 100]], 4), { wash: PUMPKIN_COL.col, sw: 1.2 });
  for (const s of [-1, 1]) { const px = cx + s * 70; paint(ellPts(px, rim + 34, 30, 40, 18), { wash: PUMPKIN_COL.col, sw: 1.4, shade: true, shadeK: .5 }); for (const k of [-1, 0, 1]) inkLine([[px + k * 9, rim + 52], [px + k * 10, rim + 68]], 1.2, '#8A4A22', 'inkfine', 0); }
  paint(ribbon([[cx + w / 2 + 6, floor - 30], [cx + w / 2 + 60, floor - 50], [cx + w / 2 + 50, floor - 120]], 30, 22), { wash: PUMPKIN_COL.col, sw: 1.4 });
}
LOOPS.cramAB = t => {
  paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#CFE3D8', ink: null });
  paint(rectPts(-10, 1250, W + 20, 700), { wash: '#C99A6B', ink: null });
  crammedA(280, 1500, 40, { ...face('happy', { blush: .5 }) });
  crammedB(800, 1500, 40, { ...face('happy', { blush: .6 }) });
  letter('A', 280, 1640, 90, '#FFFFFF', { stroke: '#2B2233', screen: true });
  letter('B', 800, 1640, 90, '#FFFFFF', { stroke: '#2B2233', screen: true });
};
LOOPS.cramAB.len = 2;
