// flat/timeline.js: shots, loops and transitions for the flat engine (same API as timeline.js).
//   shots([[t0, fn], ...]); fn(t, lt, dur) paints the whole frame and must be a pure function of t.
//   LOOPS.name = t => {...}; LOOPS.name.len = 4;   studio.html?loop=name or render.mjs --loop=name
const SHOTS = [];
function shots(list) { SHOTS.push(...list); SHOTS.sort((a, b) => a[0] - b[0]); }
const LOOPS = {};

function drawWorld(t) {
  if (window.LOOP) window.LOOP(t);
  else if (!SHOTS.length) placeholder(t);
  else {
    let i = 0; while (i + 1 < SHOTS.length && t >= SHOTS[i + 1][0]) i++;
    const t0 = SHOTS[i][0], end = i + 1 < SHOTS.length ? SHOTS[i + 1][0] : DUR;
    SHOTS[i][1](t, t - t0, end - t0);
    if (CAM) camEnd();
  }
  if (typeof subs === 'function' && !window.LOOP) subs(t);
  flushLetters();
}
function placeholder(t) {
  paint(rectPts(0, 0, W, H), { wash: '#BFE3F2', ink: null });
  if (typeof pumpkin === 'function') pumpkin(W / 2, H * .7, Math.min(W, H) / 22, { ...face('happy'), dy: -Math.abs(Math.sin(t * 3)) });
}

// ---------- transitions (screen space, after camEnd) ----------
// brushWipe(p, [c1, c2]): in the flat engine, big rounded bands of colour sweep across (p 0 → .5 covers, .5 → 1 uncovers).
// Cut to the next shot at p = .5. End of shot A: if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6);
//                                 Start of shot B: if (lt < .3) brushWipe(.5 + lt / .6);
function brushWipe(p, cols = ['#F2B33E', '#E9865C']) {
  if (p <= 0 || p >= 1) return;
  const n = 4, bh = (H + 300) / n + 30;
  push(); translate(W / 2, H / 2); rotate(-.12); translate(-W / 2, -H / 2);
  for (let i = 0; i < n; i++) {
    const d = [0, .12, .05, .16][i], y0 = -150 + i * (H + 300) / n;
    const q = p < .5 ? easeOut(clamp((p * 2 - d) / (1 - d))) : ease(clamp(((p - .5) * 2 - d) / (1 - d)));
    const x0 = p < .5 ? -W * .4 : lerp(-W * .4, W * 1.4, q), x1 = p < .5 ? lerp(-W * .4, W * 1.4, q) : W * 1.4;
    if (x1 - x0 < 20) continue;
    paint(rrPts(x0, y0, x1 - x0, bh, bh / 2), { wash: cols[i % 2], ink: null });
  }
  pop();
}
// circleWipe(p, x, y, col): a dot grows from (x, y) to cover the frame (0 → .5), then a hole opens from it (.5 → 1).
function circleWipe(p, x = W / 2, y = H / 2, col = '#2B2233') {
  if (p <= 0 || p >= 1) return;
  const R = Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) * 1.05;
  if (p < .5) paint(ellPts(x, y, R * easeIn(p * 2) + 1, R * easeIn(p * 2) + 1, 48), { wash: col, ink: null });
  else iris(x, y, R * easeOut((p - .5) * 2), col);
}
