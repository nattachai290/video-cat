// cover.js: cover of "The Royal Bed" (1080 x 1920), drawn fresh: the gleaming royal bed, ignored, on the left; Pumpkin
// blissfully crammed into a plain cardboard box on the right; Pip between them, outraged. Render: --loop=cover --still=0.6
(() => {
  LOOPS.cover = t => {
    paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#F6C46A', ink: null });
    const cx = 540, cy = 1000;
    for (let i = 0; i < 24; i += 2) { const a0 = i / 24 * TAU, a1 = (i + 1) / 24 * TAU; paint([[cx, cy], [cx + Math.cos(a0) * 2600, cy + Math.sin(a0) * 2600], [cx + Math.cos(a1) * 2600, cy + Math.sin(a1) * 2600]], { wash: '#FAD58C', ink: null }); }
    paint(rectPts(-10, 1640, W + 20, 400), { wash: '#C99A6B', ink: null });
    // the royal bed, gleaming, empty
    glow(250, 1420, 260, '#FFE38F', .7);
    royalBed(220, 1640, 1.6, .3, 1);
    // the box with Pumpkin in it, eyes closed, bliss
    const bx = 740, by = 1640, bw = 400, bh = 300, d = 90;
    paint([[bx - bw / 2, by - bh], [bx - bw / 2 + d * .6, by - bh - d * .5], [bx + bw / 2 + d * .6, by - bh - d * .5], [bx + bw / 2, by - bh]], { wash: '#7A5A36', sw: 1.6 });
    clipRects([[0, -600, 2000, by - bh + 620]], () => pumpkin(bx, by - 40, 64, { ...face('happy', { blush: .8 }), aL: -1.4, aR: -1.4, noShadow: true, boilKey: 'cv' }));
    paint([[bx + bw / 2, by], [bx + bw / 2 + d * .6, by - d * .5], [bx + bw / 2 + d * .6, by - bh - d * .5], [bx + bw / 2, by - bh]], { wash: '#B8864C', sw: 2 });
    paint(rectPts(bx - bw / 2, by - bh, bw, bh), { wash: '#D9A86A', sw: 2.2, shade: true, shadeK: .35 });
    paint([[bx - 22, by - bh], [bx + 22, by - bh], [bx + 22, by - bh + 80], [bx - 22, by - bh + 80]], { wash: '#E9D7A8', ink: null });
    for (let i = 0; i < 3; i++) { const k = Math.max(0, Math.sin(1.3 + i * 2)); paint(starPts(bx - 140 + i * 140, by - bh - 560 - (i % 2) * 50, 40 * (.5 + k * .5), .22, 4), { wash: '#FFFFFF', ink: null }); }
    // Pip, outraged, pointing at the bed
    pip(470, 1720, 58, { ...face('annoyed', { brow: 1, mouth: 'O', blush: .6 }), view: 'q', flip: true, aR: .9, aL: -.4, noShadow: false, boilKey: 'cvp' });
    letter('FANCY BED?', W / 2, 230, 150, '#FFFFFF', { font: '800 150px "Baloo 2", sans-serif', stroke: '#2B2233', rot: -.04, screen: true });
    letter('NOPE. BOX!', W / 2 + 10, 410, 190, '#8E63C9', { font: '800 190px "Baloo 2", sans-serif', stroke: '#2B2233', rot: .05, screen: true });
  };
  LOOPS.cover.len = 2;
})();
