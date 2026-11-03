// cover.js: cover of "Bath Time" (1080 x 1920), drawn fresh: tiny Pip in a shower cap, brush and duck raised, looming
// in a spooky green light; huge Pumpkin "hiding" as a lamp, sweating, fur on end. Render: --loop=cover --still=0.6
(() => {
  LOOPS.cover = t => {
    paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#2E2546', ink: null });
    const cx = 540, cy = 1150;
    for (let i = 0; i < 24; i += 2) { const a0 = i / 24 * TAU, a1 = (i + 1) / 24 * TAU; paint([[cx, cy], [cx + Math.cos(a0) * 2600, cy + Math.sin(a0) * 2600], [cx + Math.cos(a1) * 2600, cy + Math.sin(a1) * 2600]], { wash: '#3B3060', ink: null }); }
    paint(rectPts(-10, 1640, W + 20, 400), { wash: '#6E5A82', ink: null });
    // Pumpkin, the "lamp", behind: shade on, puffed, sweating
    glow(760, 900, 360, '#FFE7A0', .5);
    pumpkin(760, 1640, 70, { ...face('sheepish', { eyes: 'wide', pupil: .2, lookX: -.8, lookY: .6 }), puff: .7, flip: true, noTail: true, aL: -1.45, aR: -1.45, draw: shadeHook(0), boilKey: 'cvk' });
    for (const [x, y] of [[560, 1010], [600, 1060]]) paint([[x, y - 26], [x + 14, y], [x, y + 12], [x - 14, y]], { wash: '#9CD6F5', sw: 1.2 });
    // Pip, in front, looming in green light
    glow(330, 1450, 380, '#6CFF9C', .55);
    pip(330, 1720, 72, { ...face('smug'), brow: .8, lid: .45, mouth: 'smirk', pupil: .3, aR: .55, aL: .55, draw: capHook('front'), armR: brushHook, armL: duckHook(0), boilKey: 'cvp' });
    letter('BATH TIME?', W / 2, 250, 160, '#FFFFFF', { font: '800 160px "Baloo 2", sans-serif', stroke: '#2B2233', rot: -.04, screen: true });
    letter("I'M A LAMP.", W / 2 + 10, 430, 170, '#F49AC1', { font: '800 170px "Baloo 2", sans-serif', stroke: '#2B2233', rot: .05, screen: true });
  };
  LOOPS.cover.len = 2;
})();
