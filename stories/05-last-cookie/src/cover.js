// cover.js: the cover / thumbnail of "The Last Cookie" (1080 x 1920), drawn fresh: Pumpkin on a crazily leaning tower
// reaching for the jar, and Pip already inside it, munching the cookie with a smirk. Render (from stories/05-last-cookie):
//   NODE_PATH=$(npm root -g) node ../../engine/flat/render_pw.mjs --loop=cover --still=0.6 --out=out/cover.png
(() => {
  LOOPS.cover = t => {
    paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#FFD15C', ink: null });
    const cx = 700, cy = 760;
    for (let i = 0; i < 24; i += 2) { const a0 = i / 24 * TAU, a1 = (i + 1) / 24 * TAU; paint([[cx, cy], [cx + Math.cos(a0) * 2600, cy + Math.sin(a0) * 2600], [cx + Math.cos(a1) * 2600, cy + Math.sin(a1) * 2600]], { wash: '#FFE38F', ink: null }); }
    paint(rectPts(-10, 1720, W + 20, 300), { wash: '#B88A5E', ink: null });
    // the fridge (right) with the jar; Pip inside, munching
    paint(rrPts(640, 980, 420, 760, 30), { wash: '#EEF2F5', sw: 3, shade: true, shadeK: .45 });
    const jx = 830, jb = 980, jw = 300, jh = 330;
    paint(rrPts(jx - jw / 2, jb - jh, jw, jh, 50), { wash: '#D9F0F7', washOp: 200, ink: null });
    pip(jx + 10, jb - 16, 40, { ...face('smug', { blush: .3 }), sq: .12, aR: .7, aL: .6, noShadow: true, armR: (u, sw) => cookie(u * .9, 0, u * 1.15, 1), talk: .3, boilKey: 'cvp' });
    for (let i = 0; i < 7; i++) paint(ellPts(jx - 90 + hash(i) * 180, jb - 22 - hash(i + 4) * 14, 6, 5, 8), { wash: '#D9A066', ink: null });
    paint(rrPts(jx - jw / 2, jb - jh, jw, jh, 50), { ink: '#7FA6B8', sw: 3 });
    inkLine([[jx - jw / 2 + 32, jb - jh + 60], [jx - jw / 2 + 32, jb - jh + 200]], 6, '#FFFFFF', 'ink', 0);
    paint(rrPts(jx - jw / 2 - 10, jb - jh - 40, jw + 20, 40, 14), { wash: '#E77F6A', sw: 2.4 });
    // the leaning tower (left) and Pumpkin on top, reaching, wide-eyed
    push(); translate(330, 1720); rotate(-.16);
    const P = [{ w: 260, h: 240, c: '#D9A86A' }, { w: 220, h: 160, c: '#5E7FA8' }, { w: 240, h: 90, c: '#C8363F' }, { w: 230, h: 38, c: '#DCE8EE' }];
    let y = 0; P.forEach((p, i) => { const dx = [0, 26, -18, 20][i]; paint(rrPts(dx - p.w / 2, y - p.h, p.w, p.h, 14), { wash: p.c, sw: 2.6, shade: true, shadeK: .4 }); y -= p.h; });
    pumpkin(20, y, 50, { ...face('greedy', { lookX: 1, lookY: -.6, blush: .5 }), sq: -.18, aR: 1.0, aL: -.2, rot: .2, tailWag: 1, noShadow: true, boilKey: 'cv' });
    pop();
    for (const [x0, y0] of [[150, 1100], [120, 1260], [520, 1180]]) for (let k = 0; k < 2; k++) inkLine([[x0 + k * 26, y0], [x0 + k * 26 - 30, y0 + 40]], 4, '#2B2233', 'ink', 0);   // wobble lines
    letter('THE LAST', W / 2, 230, 160, '#FFFFFF', { font: '800 160px "Baloo 2", sans-serif', stroke: '#2B2233', rot: -.04, screen: true });
    letter('COOKIE?!', W / 2 + 10, 410, 210, '#C8363F', { font: '800 210px "Baloo 2", sans-serif', stroke: '#2B2233', rot: .05, screen: true });
  };
  LOOPS.cover.len = 2;
})();
