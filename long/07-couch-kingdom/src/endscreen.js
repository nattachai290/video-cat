// endscreen.js: the reusable 20-second End Screen for long (16:9) videos. Leaves empty slots for YouTube's end-screen
// elements (added later in YouTube Studio): two "video" boxes on the right and a round "subscribe" slot.
// Use in shots.js:  [180, t => endScreen(t, 180, { hat: true })]
// Check the slots: add  ?guides=1  to studio.html, or pass { guides: true } (never in the final render).
const ENDSLOTS = { videos: [[1180, 190, 620, 350], [1180, 600, 620, 350]], subscribe: [900, 760, 150] };
function endScreen(t, t0, o = {}) {
  const lt = t - t0, U = 46;
  paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#F6C46A', ink: null });
  for (let i = 0; i < 40; i++) { const x = (hash(i) * 2200 + lt * 20) % 2100 - 100, y = (hash(i + 5) * 1200 + lt * 12) % 1200 - 60; push(); translate(x, y); rotate(hash(i + 9) * 3); paint(rrPts(-24, -18, 48, 36, 6), { wash: '#F2B04E', ink: null }); pop(); }
  letter('SNACKATOON', 560, 140, 120, '#FFFFFF', { font: '800 120px "Baloo 2", sans-serif', stroke: '#2B2233', rot: -.03 });
  // the characters, bottom left, pointing at the slots
  const wave = Math.sin(lt * 3);
  pumpkin(300, 1010, U, { ...face('happy', { blush: .4 }), aL: -1.1, aR: .5 + .15 * wave, who: 'pumpkin', boilKey: 'esk',
    draw: o.hat ? (u, sw) => { paint([[-1.3 * u, -11.0 * u], [.2 * u, -15.2 * u], [1.5 * u, -11.0 * u]], { wash: '#E2463F', ink: PAL.ink, sw }); paint(ellPts(.2 * u, -15.4 * u, .5 * u, .5 * u, 10), { wash: '#F7D154', ink: PAL.ink, sw: sw * .6 }); } : undefined });
  pip(520, 1010, U, { ...face('happy'), view: 'q', aR: .7 + .2 * wave, aL: -.6, cracker: true, who: 'pip', boilKey: 'esp' });
  if (typeof robotVac === 'function') robotVac(150 + ((lt * 120) % 1400), 1075, .7, lt, { led: 'blue' });
  // the slots (guides only)
  const guides = o.guides || (typeof location !== 'undefined' && /guides=1/.test(location.search));
  if (guides) {
    const dash = (P) => { for (let i = 0; i < P.length - 1; i++) { const [a, b] = [P[i], P[i + 1]], n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 30); for (let k = 0; k < n; k += 2) inkLine([[lerp(a[0], b[0], k / n), lerp(a[1], b[1], k / n)], [lerp(a[0], b[0], (k + 1) / n), lerp(a[1], b[1], (k + 1) / n)]], 4, '#2B2233', 'ink', 0); } };
    for (const [x, y, w, h] of ENDSLOTS.videos) dash([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]]);
    const [cx, cy, r] = ENDSLOTS.subscribe; dash([...ellPts(cx, cy, r, r, 40), ellPts(cx, cy, r, r, 40)[0]]);
  }
}
