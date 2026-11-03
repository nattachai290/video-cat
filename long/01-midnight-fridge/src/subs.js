// subs.js (story 03): big karaoke subtitles for Shorts, drawn in screen space over the finished frame.
// LY rows come from src/dialog.js: [start, end, text, who]. The line pops in, each word lights up in the speaker's
// colour as it is said (timed by its share of the letters), and the line lifts and fades after it ends.
// Placement (16:9 long videos): bottom centre, like normal subtitles.
const SUBS = { y: 950, size: 64, maxW: 1500, lead: .12, hold: .5, gap: 18,
               font: s => `800 ${s}px "Baloo 2", "Comic Sans MS", sans-serif`,
               col: { pumpkin: '#FFB347', pip: '#8EE39B', dusty: '#C9C3F2' }, base: '#FFFFFF', stroke: '#2B2233' };
function subs(t) {
  if (typeof LY === 'undefined') return;
  const row = LY.find(([a, b]) => t >= a - SUBS.lead && t < b + SUBS.hold);
  if (!row) return;
  const [a, b, text, who] = row, words = text.split(' '), hi = SUBS.col[who] || '#FFE27A';
  CTX.save(); CTX.setTransform(1, 0, 0, 1, 0, 0); CTX.font = SUBS.font(SUBS.size);
  const sp = CTX.measureText(' ').width + SUBS.gap, wd = words.map(w => CTX.measureText(w).width);
  // wrap into rows that fit maxW
  const rows = [[]]; let w = 0;
  words.forEach((x, i) => { if (w && w + sp + wd[i] > SUBS.maxW) { rows.push([]); w = 0; } rows[rows.length - 1].push(i); w += (w ? sp : 0) + wd[i]; });
  CTX.restore();
  // word timing: each word starts at its share of the letters through [a, b]
  const L = words.map(x => x.replace(/[^\w']/g, '').length || 1), tot = L.reduce((s, v) => s + v, 0);
  let acc = 0; const on = L.map(v => { const s = a + (b - a) * acc / tot; acc += v; return s; });
  const pin = backOut(seg(t, a - SUBS.lead, a - SUBS.lead + .22)), out = seg(t, b + SUBS.hold - .3, b + SUBS.hold);
  const lift = -40 * easeIn(out), alpha = 1 - out;
  rows.forEach((r, ri) => {
    const rw = r.reduce((s, i, k) => s + wd[i] + (k ? sp : 0), 0);
    let x = W / 2 - rw / 2; const y = SUBS.y + ri * (SUBS.size * 1.05) + lift + (1 - pin) * 30;
    for (const i of r) {
      const said = t >= on[i], cur = said && (i === words.length - 1 || t < on[i + 1]);
      const k = cur ? backOut(seg(t, on[i], on[i] + .15)) : 1, size = SUBS.size * (cur ? 1 + .12 * k * (1 - seg(t, on[i] + .15, on[i] + .4)) : 1);
      letter(words[i], x + wd[i] / 2, y - (cur ? 8 * k : 0), size, said ? hi : SUBS.base,
        { font: SUBS.font(size), stroke: SUBS.stroke, alpha: alpha * (said ? 1 : .8) * clamp(pin * 1.2), screen: true, pop: undefined, rot: cur ? -.03 : 0 });
      x += wd[i] + sp;
    }
  });
}
// Short (vertical) version: the 16:9 frame is shown at ~56% size, so render it with bigger subtitles: --query=bigsubs
if (typeof location !== 'undefined' && /bigsubs/.test(location.search)) { SUBS.size = 108; SUBS.maxW = 1760; SUBS.y = 915; }
