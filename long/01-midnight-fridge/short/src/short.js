// short.js: the vertical frame for posting part 1 as a YouTube Short (1080x1920): a title above the 16:9 clip, and a
// 6-second ending that points down at the Short's "related video" link (Shorts have no clickable end screen).
//   frame:   --loop=frame --still=0.5 --out=../out/short_frame.png      (the clip is laid over y 656..1264 by ffmpeg)
//   endcard: --loop=endcard --out=../out/short_endcard.mp4               (6 s, with short/ending_audio.mjs)
(() => {
  const VID = { y: 656, h: 608 };
  function nightSky(t) {
    paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#16143A', ink: null });
    for (let i = 0; i < 90; i++) { const tw = .6 + .4 * Math.sin(t * 3 + i); paint(ellPts(hash(i) * W, hash(i + 3) * H, (1.5 + 2.5 * hash(i + 5)) * tw, (1.5 + 2.5 * hash(i + 5)) * tw, 6), { wash: '#FFFFFF', washOp: 150, ink: null }); }
  }
  LOOPS.frame = t => {
    nightSky(.5);
    letter('THE MIDNIGHT', W / 2, 250, 110, '#FFFFFF', { font: '800 110px "Baloo 2", sans-serif', stroke: '#2B2233', rot: -.03 });
    letter('FRIDGE', W / 2, 410, 180, '#9CD6F5', { font: '800 180px "Baloo 2", sans-serif', stroke: '#2B2233', rot: .03 });
    paint(rrPts(W / 2 - 130, 520, 260, 76, 38), { wash: '#F2C14E', sw: 2 });
    letter('PART 1', W / 2, 560, 54, '#2B2233', { font: '800 54px "Baloo 2", sans-serif' });
    paint(rectPts(-10, VID.y - 8, W + 20, VID.h + 16), { wash: '#F2C14E', ink: null });   // a thin gold frame round the clip
    letter('Pumpkin & Pip', W / 2, 1360, 56, '#F2C14E', { font: '800 56px "Baloo 2", sans-serif', stroke: '#2B2233' });
  };
  LOOPS.frame.len = 1;
  // The 6-second ending: Pumpkin still frozen as a "lamp" in the beam; the vacuum rolls up and scans him (beep... beep...),
  // its eye narrows, "!" ... then WILL THEY GET THE CAKE? and PART 2 with an arrow down to the related-video link.
  LOOPS.endcard = t => {
    nightSky(t);
    const KX = 520, FYv = 1240;
    // the searchlight on his face
    const scan = t < 2.6 ? Math.sin(t * 5) * .08 : 0;
    paint([[lerp(1300, 860, easeOut(seg(t, .2, 1.2))) - 120, FYv - 40], [KX + 40, FYv - 560 + scan * 400], [KX - 60, FYv - 330 + scan * 400]], { wash: '#FFF3B0', washOp: 60, ink: null });
    glow(KX, FYv - 420, 200, '#FFF3B0', .6);
    pumpkin(KX, FYv, 46, { ...faces(t, [[0, 'neutral', { eyes: 'wide', lid: 0, pupil: .3, mouth: 'flat' }], [2.0, 'neutral', { eyes: 'wide', lid: 0, pupil: .3, lookX: 1, lookY: 1, mouth: 'wobble' }]]),
      aL: -1.5, aR: -1.5, sq: Math.sin(t * 30) * .01 * (t > 2 ? 3 : 1), boilKey: 'ek', draw: (u, sw) => shadeHook(0)(u, sw) });
    if (t > 2.2) { const k = seg(t, 2.2, 2.5); paint([[KX + 150, FYv - 380], [KX + 166, FYv - 420 + 10 * k], [KX + 182, FYv - 380], [KX + 166, FYv - 362]], { wash: '#9CD6F5', sw: 1 }); }   // a sweat drop
    // the vacuum rolls in from the right and scans
    const vx = lerp(1300, 860, easeOut(seg(t, .2, 1.2)));
    robotVac(vx, FYv + 20, .95, t, { led: 'red', blink: t < 1.8 });
    if (t > 1.8 && t < 2.6) letter('?', vx, FYv - 190, 130, '#FFFFFF', { stroke: '#2B2233', pop: seg(t, 1.8, 2.0) * 1.2 });
    if (t >= 2.6) letter('!', vx, FYv - 200, 160, '#FF4A4A', { stroke: '#2B2233', pop: seg(t, 2.6, 2.75) * 1.3 });
    // Pip, peeking from behind a pot, bottom left
    pip(230, FYv, 46, { ...faces(t, [[0, 'panic', { eyes: 'squeeze' }], [3.6, 'happy']]), view: 'q', aR: t > 3.6 ? -.9 : 1.2, aL: t > 3.6 ? -.6 : 1.2, boilKey: 'ep' });
    pottedPlant(260, FYv + 20, .55);
    // the titles
    letter('WILL THEY GET', W / 2, 250, 100, '#FFFFFF', { font: '800 100px "Baloo 2", sans-serif', stroke: '#2B2233', pop: Math.max(0, t - 3.0) * 4, rot: -.03 });
    letter('THE CAKE?', W / 2, 390, 140, '#F49AC1', { font: '800 140px "Baloo 2", sans-serif', stroke: '#2B2233', pop: Math.max(0, t - 3.25) * 4, rot: .03 });
    const b = Math.abs(Math.sin(t * 5)) * 20;
    letter('PART 2', W / 2, 1420, 120, '#F2C14E', { font: '800 120px "Baloo 2", sans-serif', stroke: '#2B2233', pop: Math.max(0, t - 4.0) * 4 });
    letter('▼', 300, 1540 + b, 90, '#F2C14E', { stroke: '#2B2233', alpha: Math.min(1, Math.max(0, t - 4.3) * 4) });
  };
  LOOPS.endcard.len = 6;
})();
