// short.js: the vertical frame for posting part 1 as a YouTube Short (1080x1920): a title above the 16:9 clip, and a
// 3-second end card that points down at the Short's "related video" link (Shorts have no clickable end screen).
//   frame:   --loop=frame --still=0.5 --out=../out/short_frame.png      (the clip is laid over y 656..1264 by ffmpeg)
//   endcard: --loop=endcard --out=../out/short_endcard.mp4               (3 s)
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
  LOOPS.endcard = t => {
    nightSky(t);
    letter('WILL THEY GET', W / 2, 260, 100, '#FFFFFF', { font: '800 100px "Baloo 2", sans-serif', stroke: '#2B2233', pop: Math.min(1.2, t * 4), rot: -.03 });
    letter('THE CAKE?', W / 2, 400, 140, '#F49AC1', { font: '800 140px "Baloo 2", sans-serif', stroke: '#2B2233', pop: Math.min(1.2, Math.max(0, t - .2) * 4), rot: .03 });
    glow(540, 980, 360, '#FFF3B0', .5);
    pumpkin(560, 1330, 46, { ...face('neutral', { eyes: 'wide', lid: 0, pupil: .3, lookY: 1, mouth: 'flat' }), aL: -1.5, aR: -1.5, sq: Math.sin(t * 30) * .01, boilKey: 'ek',
      draw: (u, sw) => shadeHook(0)(u, sw) });
    pip(250, 1330, 46, { ...face('happy'), view: 'q', aR: -.9, aL: -.6, dy: -.2 * Math.abs(Math.sin(t * 6)), boilKey: 'ep' });
    const b = Math.abs(Math.sin(t * 5)) * 20;
    letter('PART 2', W / 2, 1460, 110, '#F2C14E', { font: '800 110px "Baloo 2", sans-serif', stroke: '#2B2233', pop: Math.min(1.2, Math.max(0, t - .5) * 4) });
    letter('▼', 300, 1560 + b, 90, '#F2C14E', { stroke: '#2B2233', alpha: Math.min(1, Math.max(0, t - .7) * 4) });
  };
  LOOPS.endcard.len = 3;
})();
