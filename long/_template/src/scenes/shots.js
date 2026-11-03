// shots.js (TEMPLATE): replace the placeholder parts with the story's shots. Timeline: part 1 = 0-60, part 2 = 60-120,
// part 3 = 120-180, End Screen = 180-200 (see ../GUIDE.md). Every frame is a pure function of t.
(() => {
  const U = 40, FY = 1560;
  function placeholder(n) {
    return t => {
      camBegin(540, 1200, 1.0);   // the series' living room is laid out on a 1080-wide floor; at 16:9 frame it like this
      livingRoom6(t); curtain(t);
      pumpkin(420, FY, U, { ...face('happy'), boilKey: 'pk' });
      pip(640, FY, U, { ...face('happy'), view: 'q', boilKey: 'pip' });
      camEnd();
      letter(`PART ${n}`, W / 2, 140, 100, '#FFFFFF', { stroke: '#2B2233', screen: true });
    };
  }
  shots([[0, placeholder(1)], [60, placeholder(2)], [120, placeholder(3)], [180, t => endScreen(t, 180, { hat: true, guides: typeof GUIDES !== 'undefined' })]]);
})();
