// cover.js: cover of "The Robot Vacuum" (1080 x 1920), drawn fresh: Pumpkin puffed into a ball, clinging to the curtain,
// the robot vacuum below glaring with its red eye, Pip surfing on it. Render: --loop=cover --still=0.6
(() => {
  LOOPS.cover = t => {
    paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#C9B8EC', ink: null });
    const cx = 540, cy = 900;
    for (let i = 0; i < 24; i += 2) { const a0 = i / 24 * TAU, a1 = (i + 1) / 24 * TAU; paint([[cx, cy], [cx + Math.cos(a0) * 2600, cy + Math.sin(a0) * 2600], [cx + Math.cos(a1) * 2600, cy + Math.sin(a1) * 2600]], { wash: '#DCCFF5', ink: null }); }
    paint(rectPts(-10, 1650, W + 20, 400), { wash: '#C99A6B', ink: null });
    // the curtain and Pumpkin clinging to it, puffed, eyes popping
    paint([[330, 520], [750, 520], [790, 1500], [290, 1500]], { wash: '#9B86CF', sw: 3, shade: true, shadeK: .4 });
    for (let k = 1; k < 6; k++) inkLine([[330 + k * 70, 530], [320 + k * 80, 1490]], 2, '#7A66AE', 'ink', .3);
    paint(rrPts(280, 500, 520, 26, 10), { wash: '#8E6A55', sw: 2 });
    pumpkin(540, 1230, 50, { ...face('panic', { mouth: 'O', pupil: .02, blush: .8 }), puff: 1, aL: 1.5, aR: 1.4, noShadow: true, boilKey: 'cv' });
    for (const s of [-1, 1]) for (let k = 0; k < 3; k++) inkLine([[540 + s * (230 + k * 30), 760 + k * 50], [540 + s * (275 + k * 30), 730 + k * 50]], 5, '#2B2233', 'ink', 0);
    // the vacuum below, its red eye glowing; Pip surfing on it, cool
    robotVac(560, 1760, 1.9, .2, { led: 'red', blink: false });
    pip(600, 1760 - 62 * 1.9, 44, { ...face('smug', { lid: .35 }), view: 'q', flip: true, cracker: true, aR: .3, aL: 1.0, rot: -.1, scarfWind: .9, noShadow: true, boilKey: 'cvp' });
    letter('WHAT IS', W / 2, 230, 170, '#FFFFFF', { font: '800 170px "Baloo 2", sans-serif', stroke: '#2B2233', rot: -.04, screen: true });
    letter('THAT?!', W / 2 + 10, 420, 230, '#FF4A4A', { font: '800 230px "Baloo 2", sans-serif', stroke: '#2B2233', rot: .05, screen: true });
  };
  LOOPS.cover.len = 2;
})();
