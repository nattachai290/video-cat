// cover.js: the Short's cover / thumbnail (1080 x 1920), drawn fresh (not a frame from the film): a comic sunburst,
// Pumpkin's face squeezed through a cat flap far too small for him, Pip in front laughing so hard he cries, the empty
// pie dish flying, and big words at the top. Render (from stories/03-cat-flap):
//   NODE_PATH=$(npm root -g) node ../../engine/flat/render_pw.mjs --loop=cover --still=0.6 --out=out/cover.png
(() => {
  LOOPS.cover = t => {
    // sunburst
    paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#FFC94D', ink: null });
    const cx = 540, cy = 1000;
    for (let i = 0; i < 24; i += 2) { const a0 = i / 24 * TAU, a1 = (i + 1) / 24 * TAU; paint([[cx, cy], [cx + Math.cos(a0) * 2400, cy + Math.sin(a0) * 2400], [cx + Math.cos(a1) * 2400, cy + Math.sin(a1) * 2400]], { wash: '#FFDA7A', ink: null }); }
    // the door panel with a tiny flap
    paint(rrPts(150, 640, 780, 1500, 40), { wash: '#7FB3A8', sw: 3, shade: true, shadeK: .4 });
    inkLine([[190, 690], [890, 690]], 2, '#5E9086', 'ink', 0);
    const hole = { x: 395, y: 1080, w: 290, h: 300 };
    paint(rrPts(hole.x - 26, hole.y - 26, hole.w + 52, hole.h + 52, 30), { wash: '#5E9086', sw: 2.4 });
    paint(rrPts(hole.x, hole.y, hole.w, hole.h, 20), { wash: '#2E3B36', ink: null });
    // Pumpkin squeezed through it: narrow and tall, eyes popping, cheeks bulging past the frame
    const P = { ...face('panic', { mouth: 'O', blush: 1, pupil: .02 }), belly: 1, sq: -.12, aL: -1.45, aR: -1.45, noShadow: true, noTail: true, boilKey: 'cv' };
    clipRects([[hole.x, hole.y, hole.w, hole.h]], () => pumpkin(540, 1530, 66, P));
    clipRects([[-50, -50, W + 100, hole.y - 26 + 50]], () => pumpkin(540, 1530, 66, P));
    paint(rrPts(hole.x - 26, hole.y - 26, hole.w + 52, 34, 14), { wash: '#5E9086', sw: 2.4 });
    for (const s of [-1, 1]) {   // paws clinging to the frame, and squeeze marks
      const px = 540 + s * (hole.w / 2 + 30), py = hole.y - 30;
      paint(ellPts(px, py, 52, 40, 20, 0, s * .3), { wash: PUMPKIN_COL.col, sw: 2.2, shade: true, shadeK: .5 });
      for (const k of [-1, 0, 1]) inkLine([[px + k * 16, py + 4], [px + k * 17, py + 30]], 2, '#8A4A22', 'inkfine', 0);
      for (let k = 0; k < 3; k++) inkLine([[540 + s * (220 + k * 34), 800 - k * 40], [540 + s * (260 + k * 34), 770 - k * 40]], 4, '#2B2233', 'ink', 0);
    }
    for (const [x, y, r] of [[300, 760, 16], [770, 720, 18], [260, 900, 12], [810, 880, 13]]) paint([[x, y - r * 1.6], [x + r, y], [x, y + r], [x - r, y]], { wash: '#BFE6F5', sw: 1.6, curv: .5 });   // sweat
    // the empty pie dish flying past, crumbs everywhere
    push(); translate(200, 1500); rotate(-.45);
    paint(ellPts(0, 0, 150, 44, 28), { wash: '#DCE8EE', sw: 2.4 }); paint(ellPts(0, -6, 118, 30, 28), { wash: '#C2D3DD', ink: null });
    for (let i = 0; i < 7; i++) paint(ellPts(-80 + hash(i) * 160, -10 + hash(i + 5) * 14, 8, 6, 8), { wash: '#B9833F', ink: null });
    pop();
    for (let i = 0; i < 10; i++) paint(ellPts(120 + hash(i * 2.3) * 280, 1300 + hash(i * 4.1) * 180, 9, 7, 8), { wash: '#E7B868', sw: 1 });
    // Pip in front, laughing so hard he's crying, pointing at Pumpkin
    pip(830, 1745, 66, { ...face('happy', { eyes: 'squeeze', mouth: 'grin', blush: .9, talk: .6 }), view: 'q', flip: true, aL: .9, aR: -.6, rot: -.08, cracker: false, scarfWind: .4, boilKey: 'cvp' });
    for (const s of [-1, 1]) for (let k = 0; k < 2; k++) paint(ellPts(830 - 20 + s * 70 + s * k * 22, 1395 + k * 34, 10, 14, 10), { wash: '#BFE6F5', sw: 1.2 });   // tears of laughter
    // the words (top: clear of the Shorts UI)
    letter('TOO MUCH', W / 2, 250, 175, '#FFFFFF', { font: '800 175px "Baloo 2", sans-serif', stroke: '#2B2233', rot: -.04, screen: true });
    letter('PIE!!', W / 2 + 20, 440, 260, '#FF6B4A', { font: '800 260px "Baloo 2", sans-serif', stroke: '#2B2233', rot: .05, screen: true });
  };
  LOOPS.cover.len = 2;
})();
