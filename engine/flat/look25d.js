// look25d.js: an optional "2.5D" finish for the flat engine (a post pass over the finished frame). Add after timeline.js:
//   <script src="../../../engine/flat/look25d.js"></script>   and open studio.html?look25d (render_pw.mjs: --query=look25d)
// What it adds (no change to the scenes): tilt-shift depth of field (far top blurred, the ground band sharp), a soft warm key
// light from the upper left, bloom on bright things, a darker floor foreground and a vignette. The flat look is untouched
// without the query. Real layered parallax needs the scenes to be split into depth layers; this is the cheap first test.
(() => {
  if (!location.search.includes('look25d')) return;
  const _dw = drawWorld, tmp = document.createElement('canvas'), tc = tmp.getContext('2d'), msk = document.createElement('canvas'), mc = msk.getContext('2d');
  drawWorld = function (t) {
    _dw(t);
    const w = W, h = H; tmp.width = msk.width = w; tmp.height = msk.height = h;
    const c = CTX; c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
    // 1) depth of field: a blurred copy shown through a vertical mask (blur at the far top, sharp in the ground band)
    tc.clearRect(0, 0, w, h); tc.filter = 'blur(5px)'; tc.drawImage(outC, 0, 0); tc.filter = 'none';
    mc.clearRect(0, 0, w, h); const g = mc.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(.16, 'rgba(0,0,0,0)'); g.addColorStop(.86, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.5)');
    mc.fillStyle = g; mc.fillRect(0, 0, w, h);
    tc.globalCompositeOperation = 'destination-in'; tc.drawImage(msk, 0, 0); tc.globalCompositeOperation = 'source-over';
    c.drawImage(tmp, 0, 0);
    // 2) bloom on the bright parts
    tc.clearRect(0, 0, w, h); tc.filter = 'blur(18px) brightness(1.3) contrast(1.3)'; tc.drawImage(outC, 0, 0); tc.filter = 'none';
    c.globalCompositeOperation = 'screen'; c.globalAlpha = .10; c.drawImage(tmp, 0, 0); c.globalAlpha = 1;
    // 3) key light (warm, upper left) and a cool fill (lower right)
    c.globalCompositeOperation = 'soft-light';
    let k = c.createRadialGradient(w * .22, h * .12, 40, w * .22, h * .12, w * .85); k.addColorStop(0, 'rgba(255,214,150,.5)'); k.addColorStop(1, 'rgba(255,214,150,0)'); c.fillStyle = k; c.fillRect(0, 0, w, h);
    k = c.createRadialGradient(w * .95, h * .95, 40, w * .95, h * .95, w * .7); k.addColorStop(0, 'rgba(90,110,190,.35)'); k.addColorStop(1, 'rgba(90,110,190,0)'); c.fillStyle = k; c.fillRect(0, 0, w, h);
    // 4) darker foreground floor + vignette
    c.globalCompositeOperation = 'multiply';
    k = c.createLinearGradient(0, h * .72, 0, h); k.addColorStop(0, 'rgba(255,255,255,1)'); k.addColorStop(1, 'rgba(185,175,200,1)'); c.fillStyle = k; c.fillRect(0, h * .72, w, h * .28);
    k = c.createRadialGradient(w / 2, h * .5, h * .45, w / 2, h * .5, w * .72); k.addColorStop(0, 'rgba(255,255,255,1)'); k.addColorStop(1, 'rgba(165,155,190,1)'); c.fillStyle = k; c.fillRect(0, 0, w, h);
    c.restore();
  };
})();
