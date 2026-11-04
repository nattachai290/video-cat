// cover.js: thumbnail for part 1 of "The Midnight Fridge" (drawn at 1920x1080, scaled to 1280x720), drawn fresh:
// Pumpkin, in a ninja headband and crayon moustache, frozen under a lampshade in the robot vacuum's searchlight; Pip hiding
// behind a tiny plant; the glowing DO-NOT-EAT cake in the open fridge. Render: --loop=cover --still=0.6
(() => {
  const coverScene = (t, title, pill, pillW = 300, tx = 560, ts = 150) => {
    paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#1B1A40', ink: null });
    for (let i = 0; i < 70; i++) paint(ellPts(hash(i) * W, hash(i + 3) * H * .6, 2 + 2 * hash(i + 5), 2 + 2 * hash(i + 5), 6), { wash: '#FFFFFF', washOp: 110, ink: null });
    paint(rectPts(-10, 900, W + 20, 200), { wash: '#3A3560', ink: null });
    // the fridge, open, the cake glowing (right)
    paint(rrPts(1450, 180, 380, 760, 30), { wash: '#E9EEF4', sw: 3 });
    paint(rrPts(1470, 420, 340, 500, 18), { wash: '#EAF6FF', sw: 2 });
    glow(1640, 560, 420, '#DDF2FF', .7);
    cakeSlice(1620, 640, 1.5, true, 1);
    // the searchlight from the vacuum onto Pumpkin's face
    
    robotVac(1330, 990, 1.3, .6, { led: 'red' });
    glow(1440, 950, 70, '#FF4A4A', .7);
    // Pumpkin, the "lamp"
    glow(760, 470, 260, '#FFF3B0', .55);
    pumpkin(760, 1000, 54, { ...face('neutral', { eyes: 'wide', lid: 0, pupil: .3, lookX: 1, mouth: 'wobble' }), aL: -1.5, aR: -1.5, mustache: true, boilKey: 'ck',
      draw: (u, sw) => shadeHook(0)(u, sw) });
    paint([[1290, 935], [700, 360], [700, 610]], { wash: '#FFF3B0', washOp: 85, ink: null }); glow(760, 500, 230, '#FFF3B0', .45);   // the searchlight, on his face
    paint([[980, 470], [1000, 430], [1020, 470], [1000, 492]], { wash: '#9CD6F5', sw: 2 });   // sweat drop
    // Pip behind a tiny plant (left)
    pip(330, 1000, 52, { ...face('panic', { eyes: 'squeeze' }), view: 'q', aL: 1.2, aR: 1.2, boilKey: 'cp', draw: ninjaMask(1) });
    pottedPlant(360, 1020, .75);
    letter(title, tx, 150, ts, '#FFFFFF', { font: `800 ${ts}px "Baloo 2", sans-serif`, stroke: '#2B2233', rot: -.04, screen: true });
    paint(rrPts(60, 250, pillW, 96, 48), { wash: '#F2C14E', sw: 3 });
    letter(pill, 60 + pillW / 2, 300, 64, '#2B2233', { font: '800 64px "Baloo 2", sans-serif', screen: true });
  };
  LOOPS.cover = t => coverScene(t, "I'M A LAMP.", 'PART 1');
  // the full episode: same picture, a different hook
  LOOPS.coverFull = t => coverScene(t, 'OPERATION: CAKE', 'FULL EPISODE', 470, 730, 136);
  LOOPS.coverFull.len = 2;
  LOOPS.cover.len = 2;
})();
