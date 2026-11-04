// vertical.js: the vertical (1080x1920) YouTube Short of Part 1, made from the same 16:9 scenes. Loaded only by short.html.
// The 16:9 world is drawn straight into the tall canvas through a moving crop window (every setTransform() call is
// composed with the crop), so the picture stays sharp. Layout: a title band on top, the picture in the middle
// (zoom VZ, a window 800 world px wide), dark below (YouTube's buttons sit there), subtitles over the lower picture.
const VW = 1080, VH = 1920, VZ = 1.35, VY0 = 210, VBAND = 1080 * VZ;   // picture band: y 210 .. 1668
// Crop window centre x in world px. [t, cx, dur]: from t, move to cx over dur seconds (0 = cut).
const VKEYS = [
  [0, 880, 0], [3, 960, 0], [4, 1160, 0], [6.8, 830, .25], [9.0, 1080, .4], [9.8, 1000, .5],
  [14, 420, 0], [15.2, 700, 1.2], [16.4, 1250, .7], [18.6, 1380, .5], [22, 1100, 0], [25, 1080, 0],
  [32, 330, 0], [33, 420, 3.5], [37, 700, 1], [38.8, 1450, .3], [40.6, 1180, .9],
  [44, 1150, 0], [47.2, 1230, .3], [49, 1120, .4], [52, 1010, 0], [55, 960, 2],
];
function vcx(t) {
  let x = VKEYS[0][1];
  for (const [k, cx, d] of VKEYS) { if (t < k) break; x = d ? lerp(x, cx, ease(seg(t, k, k + d))) : cx; }
  return x;
}
let VRAW = false, VCX = 960;
window.addEventListener('load', () => {
  outC.width = VW; outC.height = VH; outC.style.aspectRatio = `${VW} / ${VH}`;
  const set = CTX.setTransform.bind(CTX);
  CTX.setTransform = (a, b, c, d, e, f) => VRAW ? set(a, b, c, d, e, f)
    : set(a * VZ, b * VZ, c * VZ, d * VZ, e * VZ + VW / 2 - VCX * VZ, f * VZ + VY0);
});
// on-screen captions placed for a 1920 frame (fantasy step labels, *SCRATCH*) follow the crop window instead
const _letter = letter;
letter = (txt, x, y, size, col, o = {}) => {
  if (o.screen && /^(THE MIDNIGHT|FRIDGE)$/.test(txt)) size *= .74;   // title card: fit the narrow window
  if (!CAM && !o.screen && /^(\d\. |\*SCRATCH\*)/.test(txt)) x = VCX + (/^\d\. /.test(txt) ? -360 + size * 2.2 : 0);
  return _letter(txt, x, y, size, col, o);
};
subs = () => {};                         // the 16:9 subtitles are replaced by vsubs() below
const _frame = frame;
frame = t => {
  VCX = clamp(vcx(t), 400, 1520);
  _frame(t);
  VRAW = true; CTX.save(); CTX.setTransform(1, 0, 0, 1, 0, 0);
  vbands(t); CTX.restore();
  vsubs(t); vteaser(t); flushLetters();
  CTX.setTransform(1, 0, 0, 1, 0, 0); VRAW = false;
};
function vbands(t) {
  const g = CTX.createLinearGradient(0, 0, 0, VY0);
  g.addColorStop(0, '#0E1236'); g.addColorStop(1, '#1D2258');
  CTX.fillStyle = g; CTX.fillRect(0, 0, VW, VY0);
  CTX.fillStyle = '#0E1236'; CTX.fillRect(0, VY0 + VBAND, VW, VH - VY0 - VBAND);
  for (let i = 0; i < 26; i++) {                       // twinkling stars in both bands
    const x = hash(i) * VW, y = i % 3 ? hash(i + 50) * (VY0 - 20) + 10 : VY0 + VBAND + 20 + hash(i + 90) * 220;
    CTX.globalAlpha = .35 + .5 * Math.max(0, Math.sin(t * 2 + i * 1.7)); CTX.fillStyle = '#FFF6D0';
    CTX.beginPath(); CTX.arc(x, y, 2 + hash(i + 7) * 2.5, 0, TAU); CTX.fill();
  }
  CTX.globalAlpha = 1;
  CTX.fillStyle = 'rgba(255,255,255,.12)'; CTX.fillRect(0, VY0 - 4, VW, 4); CTX.fillRect(0, VY0 + VBAND, VW, 4);
  if (t >= 57.8) return;   // the NEXT: PART 2 badge takes the top band
  letter('THE MIDNIGHT FRIDGE', VW / 2 - 92, 112, 62, '#FFE27A', { font: '800 62px "Baloo 2", sans-serif', stroke: '#2B2233', screen: true });
  CTX.save(); CTX.fillStyle = '#E2463F'; CTX.strokeStyle = '#2B2233'; CTX.lineWidth = 5;
  CTX.beginPath(); CTX.roundRect(VW / 2 + 268, 80, 150, 64, 32); CTX.fill(); CTX.stroke(); CTX.restore();
  letter('PART 1', VW / 2 + 343, 113, 40, '#FFFFFF', { font: '800 40px "Baloo 2", sans-serif', screen: true, ink: false });
}
// karaoke subtitles, same look as src/subs.js, sized for the tall frame (lower picture, above YouTube's buttons)
const VSUBS = { y: 1500, size: 74, maxW: 900 };
function vsubs(t) {
  if (typeof LY === 'undefined') return;
  const row = LY.find(([a, b]) => t >= a - SUBS.lead && t < b + SUBS.hold);
  if (!row) return;
  const [a, b, text, who] = row, words = text.split(' '), hi = SUBS.col[who] || '#FFE27A';
  CTX.save(); CTX.font = SUBS.font(VSUBS.size);
  const sp = CTX.measureText(' ').width + SUBS.gap, wd = words.map(w => CTX.measureText(w).width);
  CTX.restore();
  const rows = [[]]; let w = 0;
  words.forEach((x, i) => { if (w && w + sp + wd[i] > VSUBS.maxW) { rows.push([]); w = 0; } rows[rows.length - 1].push(i); w += (w ? sp : 0) + wd[i]; });
  const L = words.map(x => x.replace(/[^\w']/g, '').length || 1), tot = L.reduce((s, v) => s + v, 0);
  let acc = 0; const on = L.map(v => { const s = a + (b - a) * acc / tot; acc += v; return s; });
  const pin = backOut(seg(t, a - SUBS.lead, a - SUBS.lead + .22)), out = seg(t, b + SUBS.hold - .3, b + SUBS.hold);
  const sy = t >= 14 && t < 18.6 ? 700 : VSUBS.y;   // crayon fantasy: up high while they sneak and climb along the floor, back down when the cake comes
  const lift = -40 * easeIn(out), alpha = 1 - out, y0 = sy - (rows.length - 1) * VSUBS.size * 1.05;
  rows.forEach((r, ri) => {
    const rw = r.reduce((s, i, k) => s + wd[i] + (k ? sp : 0), 0);
    let x = VW / 2 - rw / 2; const y = y0 + ri * (VSUBS.size * 1.05) + lift + (1 - pin) * 30;
    for (const i of r) {
      const said = t >= on[i], cur = said && (i === words.length - 1 || t < on[i + 1]);
      const k = cur ? backOut(seg(t, on[i], on[i] + .15)) : 1, size = VSUBS.size * (cur ? 1 + .12 * k * (1 - seg(t, on[i] + .15, on[i] + .4)) : 1);
      letter(words[i], x + wd[i] / 2, y - (cur ? 8 * k : 0), size, said ? hi : SUBS.base,
        { font: SUBS.font(size), stroke: SUBS.stroke, alpha: alpha * (said ? 1 : .8) * clamp(pin * 1.2), screen: true, rot: cur ? -.03 : 0 });
      x += wd[i] + sp;
    }
  });
}
// "NEXT: PART 2" badge in the top band for the last 2.2 s (57.8-60, i.e. 55.8-58 after the 2 s cut)
function vteaser(t) {
  if (t < 57.8) return;
  const k = backOut(seg(t, 57.8, 58.1));
  CTX.save(); CTX.setTransform(1, 0, 0, 1, 0, 0); CTX.fillStyle = '#0E1236'; CTX.globalAlpha = clamp((t - 57.8) * 5);
  CTX.fillRect(0, 20, VW, VY0 - 30); CTX.restore();
  CTX.save(); CTX.setTransform(1, 0, 0, 1, 0, 0); CTX.translate(VW / 2, 112 + Math.sin(t * 6) * 4); CTX.scale(k, k);
  CTX.fillStyle = '#F2C14E'; CTX.strokeStyle = '#2B2233'; CTX.lineWidth = 6;
  CTX.beginPath(); CTX.roundRect(-250, -56, 500, 112, 56); CTX.fill(); CTX.stroke();
  CTX.fillStyle = '#2B2233'; CTX.font = '800 64px "Baloo 2", sans-serif'; CTX.textAlign = 'center'; CTX.textBaseline = 'middle';
  CTX.fillText('NEXT: PART 2 ▶', 0, 4); CTX.restore();
}
