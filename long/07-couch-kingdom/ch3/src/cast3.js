// cast3.js: what chapter 3 "The Fizzy Swamp" adds to the Lostland cast and props (reference + shots). Needs ../src/cast.js.
//   moth(x, y, u, o)             the Royal Messenger: a night moth in a courier sash. Hovers. Cold, formal, deep voice.
//                                view 'front' | 'q' | 'side'; flip; o.flap (wing phase 0..1, default: beats with T); o.scroll 0..1 (legs hold the scroll);
//                                o.land 0..1 (wings folded, perched: on the car's winding key). Face fields as for the rest of the cast.
//   royalSeal(x, y, D, o)        THE royal seal (locked spec in ../STORYBOARD.md): red wax, pressed button, 4 holes, paper-clip crown.
//   royalScroll(x, y, W, o)      the receipt scroll with the seal on its bottom edge, tied with red thread (W = paper width)
//   bittenShield(x, y, u, o)     Sir Lint's bottle-cap shield with one bite out of the rim (draw after sirLint({noShield:true}))
//   hairSpear(x, y, u, o)        the toothpick lance with the hair rope tied on (o.rope 0..1 = how much line is paid out)
//   hairCoil(x, y, u, o)         the rope coiled on the car's winding key
//   snackBag(x, y, u, o)         the empty cracker bag Pumpkin hugs while asleep
//   ledLamp(x, y, u, o)          the "campfire": a tiny rechargeable LED lamp glowing orange
//   jellyPlank(x, y, w, o)       a stretch of the jelly bridge (o.bite 0..1, o.wave 0..1, o.wob)
//   fizzBubble(x, y, r, o)       a soda bubble (the giant ones that go pop)
//   autograph(x, y, u, o)        the tiny autograph paper the Dust Bunny holds up
//   redLight(x, y, r, k)         the far-off red light (the Dragon's eye / a clue)
const MOTH = { fur: '#CDB89A', furDk: '#A58E6E', furLt: '#E6D8BF', wing: '#8F7B66', wingDk: '#5E4E3E', wingLt: '#B7A38A', eye: '#2B2233', sash: '#B3202A', sashDk: '#7A1218', ant: '#6B5A48' };
const WAX = { wax: '#B3202A', dk: '#7A1218', hi: '#D9505A', hole: '#5A0D12' };

// ---------- Moth ----------
function moth(x, y, u, o = {}) {
  const C = MOTH, sw = folkSW(u, o), view = o.view || 'front', q = view === 'q' ? 1 : 0, side = view === 'side';
  const land = clamp(o.land || 0), flapK = o.flap ?? (frac(T * 2.4)), beat = land ? 0 : Math.sin(flapK * TAU);   // -1..1
  const hov = land ? 0 : Math.sin(T * 2.6) * .18 * u;
  folkBegin(x, y, u, { ...o, noShadow: true }, 1.5);
  if (!o.noShadow) paint(ellPts(0, 0, (land ? .9 : 1.5) * u, .28 * u, 16), { wash: PAL.ink, washOp: land ? 70 : 45 + 10 * beat, ink: null });
  const gy = land ? -1.0 * u : -2.7 * u + hov;           // body centre height
  const wingOut = (d, far) => {                           // d = -1 left / +1 right (screen)
    // wing: big rounded triangle swept up and out; flapping squeezes it round the shoulder (cos) and lifts the tip
    const open = land ? .28 : .55 + .45 * beat, lift = land ? 1.1 : (.2 + .8 * beat);
    const sx = d * (side ? .2 : 1);
    push(); translate(sx * .55 * u, gy - .55 * u); scale(d * (side ? 1 : 1) * (far ? .8 : 1) * (side ? .35 : 1 - q * (d > 0 ? .25 : -.15)), 1);
    const sp = 2.5 * u * open, up = (1.1 + 1.2 * lift) * u;
    const fore = [[0, 0], [.6 * u, -.9 * u], [sp * .7, -up * .95], [sp * 1.05, -up * .6], [sp * 1.1, -up * .1], [sp * .95, up * .4]];
    const hk = land ? .2 : 1, hind = [[0, .1 * u], [sp * .9, up * .35 * hk], [sp * .95, up * .85 * hk], [sp * .5, up * 1.0 * hk], [.25 * u, .85 * u * hk]];
    for (const [P, wash] of [[hind, C.wing], [fore, C.wing]]) paint(P, { wash: far ? mixCol(wash, '#3A2F26', .35) : wash, ink: PAL.ink, sw: sw * .8, curv: .6, shade: true, shadeK: .5 });
    // dusty pattern: a pale band along the edge, two eyespots (the "watching" moth), tiny scale flecks
    inkLine([[sp * .85, -up * .62], [sp * 1.0, -up * .15], [sp * .86, up * .3]], sw * 1.6, C.wingLt, 'ink', .4);
    for (const [ex, ey, r] of [[sp * .66, -up * .38, .34], [sp * .55, up * .5, .26]]) {
      paint(ellPts(ex, ey, r * u, r * u * 1.05, 14), { wash: C.furLt, ink: PAL.ink, sw: sw * .5 });
      paint(ellPts(ex + .02 * u, ey, r * .55 * u, r * .6 * u, 12), { wash: C.eye, ink: null });
      paint(ellPts(ex - .08 * u, ey - .1 * u, r * .18 * u, r * .18 * u, 6), { wash: '#FFFFFF', ink: null });
    }
    for (let i = 0; i < 7; i++) paint(ellPts(sp * (.3 + .6 * hash(i + 2)), -up * (.1 + .6 * hash(i + 9)) + up * .3 * hash(i), .07 * u, .04 * u, 5), { wash: C.wingDk, washOp: 150, ink: null });
    pop();
  };
  // side view: one wing seen edge-on-ish, hinged at the shoulder and swept back; it swings up and down as it beats
  const sideWing = () => {
    const ang = land ? 1.25 : .15 + .8 * (.5 + .5 * beat), L = 3.0 * u, Wd = 1.5 * u;
    push(); translate(-.1 * u, gy - .55 * u); rotate(ang);
    paint([[0, 0], [-.4 * u, -Wd * .6], [-L * .8, -Wd * 1.0], [-L, -Wd * .45], [-L * .95, Wd * .2], [-L * .4, Wd * .55]], { wash: C.wing, ink: PAL.ink, sw: sw * .8, curv: .6, shade: true, shadeK: .5 });
    inkLine([[-L * .35, -Wd * .75], [-L * .8, -Wd * .75], [-L * .95, -Wd * .3]], sw * 1.4, C.wingLt, 'ink', .4);
    paint(ellPts(-L * .62, -Wd * .2, .28 * u, .3 * u, 12), { wash: C.furLt, ink: PAL.ink, sw: sw * .5 });
    paint(ellPts(-L * .62 + .02 * u, -Wd * .2, .15 * u, .17 * u, 10), { wash: C.eye, ink: null });
    pop();
  };
  if (!side) { wingOut(-1, false); wingOut(1, false); } else sideWing();
  // legs: six thin legs; the front pair clamp the scroll
  for (const [lx, ly, ang] of [[-.5, .3, .3], [.5, .3, -.3], [-.35, .55, .15], [.35, .55, -.15]]) inkLine([[lx * u * (side ? .5 : 1), gy + ly * u], [lx * u * 1.4 * (side ? .5 : 1), gy + (ly + 1.0) * u], [lx * u * 1.4 * (side ? .5 : 1) + ang * u * .6, gy + (ly + 1.35) * u]], sw * .9, C.ant, 'ink', .3);
  // body: a long fuzzy teardrop, a lighter chest tuft
  paint(fluff(0, gy + .25 * u, .85 * u, 1.45 * u, 14, .14, 5, 1), { wash: C.fur, ink: PAL.ink, sw: sw * .85, shade: true, shadeK: .45 });
  paint(fluff(0, gy + .05 * u, .5 * u, .7 * u, 9, .22, 8, 1), { wash: C.furLt, ink: null });
  for (let i = 0; i < 4; i++) inkLine([[-.7 * u + i * .01 * u, gy + (.55 + i * .28) * u], [.7 * u, gy + (.6 + i * .28) * u]], sw * .5, C.furDk, 'ink', .4);   // abdomen stripes
  // the courier sash: a thin red band across the chest, a tiny knot: his only decoration (he is on official business)
  paint([[-.7 * u, gy - .1 * u], [-.52 * u, gy - .26 * u], [.7 * u, gy + .42 * u], [.53 * u, gy + .58 * u]], { wash: C.sash, ink: PAL.ink, sw: sw * .6, curv: 0 });
  paint(ellPts(-.58 * u, gy - .22 * u, .13 * u, .11 * u, 8), { wash: C.sashDk, ink: PAL.ink, sw: sw * .5 });   // the knot
  // head: a small fuzzy ball with big feathered antennae
  const hx = side ? .55 * u : q * .22 * u, hy = gy - 1.25 * u;
  for (const d of side ? [1] : [-1, 1]) {
    const sway = Math.sin(T * 3 + d) * .06;
    push(); translate(hx + d * .3 * u, hy - .55 * u); rotate(d * (.55 + (o.ant ?? 0) * .3) + sway);
    inkLine([[0, 0], [0, -.9 * u], [.1 * d * u, -1.7 * u]], sw * 1.1, C.ant, 'ink', .4);
    for (let i = 1; i < 8; i++) { const yy = -i * .22 * u; inkLine([[0, yy], [-.26 * u, yy - .12 * u]], sw * .6, C.ant, 'ink', 0); inkLine([[0, yy], [.26 * u, yy - .12 * u]], sw * .6, C.ant, 'ink', 0); }
    pop();
  }
  paint(fluff(hx, hy, .72 * u, .62 * u, 10, .12, 3, 1), { wash: C.fur, ink: PAL.ink, sw: sw * .85, shade: true, shadeK: .4 });
  paint(fluff(hx, hy - .52 * u, .5 * u, .2 * u, 7, .3, 6, 1), { wash: C.furLt, ink: null });   // forehead tuft
  folkFace(hx + (side ? .15 * u : 0), hy - .02 * u, u, { ...o, lid: o.lid ?? .5, pupil: o.pupil ?? .55, brow: o.brow ?? .55 }, sw, C.fur, { gap: side ? 0 : .37, er: .18, my: .5, mw: .3, style: 'cat', single: side });
  // the scroll in his front legs
  if (o.scroll) { push(); translate(hx * .2, gy + 1.25 * u); rotate(-.08); royalScroll(0, 0, 1.9 * u, { roll: .6, sealK: o.scroll }); pop(); }
  pop();
}

// ---------- the royal seal (locked spec: ../STORYBOARD.md "ตราราชสำนัก") ----------
// D = wax diameter. Same lobed outline every time (fixed numbers, no random).
const SEAL_LOBES = [1.04, .96, 1.07, .97, 1.02, .94, 1.06, .98, 1.01];
function royalSeal(x, y, D, o = {}) {
  const R = D / 2, n = 9, sw = clamp(D / 90, .8, 4);
  push(); translate(x, y); if (o.rot) rotate(o.rot);
  const outline = []; for (let i = 0; i < 54; i++) { const a = i / 54 * TAU, k = i / 54 * n, i0 = Math.floor(k) % n, i1 = (i0 + 1) % n, f = k - Math.floor(k), s = .5 - .5 * Math.cos(f * Math.PI); outline.push([Math.cos(a) * R * (SEAL_LOBES[i0] * (1 - s) + SEAL_LOBES[i1] * s) * (.96 + .04 * Math.sin(a * 7 + 1)), Math.sin(a) * R * (SEAL_LOBES[i0] * (1 - s) + SEAL_LOBES[i1] * s) * (.96 + .04 * Math.sin(a * 7 + 1))]); }
  paint(outline, { wash: WAX.dk, ink: PAL.ink, sw: sw * .8 });
  paint(outline.map(([a, b]) => [a * .93, b * .93 - R * .015]), { wash: WAX.wax, ink: null });
  // pressed button: a sunken disc Ø.70 D with a raised rim .06 D
  const br = R * .70;
  paint(ellPts(0, 0, br, br, 36), { wash: WAX.dk, ink: null });
  paint(ellPts(0, R * .01, br * .94, br * .94, 36), { wash: WAX.wax, ink: null });
  paint(ringPts(0, 0, br, br, br - .06 * D, br - .06 * D, 0, 36), { wash: WAX.hi, ink: null });
  // four holes: 2x2, centres .22 D apart, Ø.12 D, axis-aligned
  for (const hx of [-.11, .11]) for (const hy of [-.11, .11]) { paint(ellPts(hx * D, hy * D + .02 * D, .06 * D, .06 * D, 14), { wash: WAX.hole, ink: null }); paint(arcPts(hx * D, hy * D - .005 * D, .06 * D, .06 * D, Math.PI * 1.05, Math.PI * 1.95, 8), { wash: WAX.hi, ink: null }); }
  // paper-clip crown: raised, .40 D wide, .18 D tall, sitting on the top of the button rim
  push(); translate(0, -br * .96);
  const cw = .40 * D, ch = .18 * D;
  inkLine([[-cw / 2, ch * .1], [-cw / 2, -ch * .55], [-cw * .22, -ch * .05], [0, -ch * .95], [cw * .22, -ch * .05], [cw / 2, -ch * .55], [cw / 2, ch * .1], [-cw / 2, ch * .1]], Math.max(1.4, D * .035), WAX.hi, 'ink', .2);
  inkLine([[-cw / 2, ch * .22], [cw / 2, ch * .22]], Math.max(1.4, D * .035), WAX.dk, 'ink', 0);
  pop();
  // one highlight, top left
  paint(ellPts(-R * .55, -R * .62, R * .13, R * .08, 8, 0, -.7), { wash: '#FFFFFF', washOp: 120, ink: null });
  pop();
}
function royalScroll(x, y, W, o = {}) {
  const roll = clamp(o.roll ?? 0), Hp = W * 1.5, sw = clamp(W / 130, .8, 3.5);   // roll 0 = fully open, 1 = tight roll
  push(); translate(x, y); if (o.rot) rotate(o.rot);
  const curl = roll * .3 * W, top = -Hp;
  paint([[-W / 2, top], [W / 2, top], [W / 2 + curl * .1, 0], [-W / 2 - curl * .1, 0]].map(([a, b], i) => [a, b + (i > 1 ? 0 : 0)]), { wash: '#F3EAD3', ink: PAL.ink, sw, curv: 0, shade: true, shadeK: .3 });
  paint(ellPts(0, top, W / 2, W * .075, 16), { wash: '#E3D7B8', ink: PAL.ink, sw: sw * .8 });   // the curl at the top
  for (let i = 0; i < 5; i++) { const yy = top + W * .28 + i * W * .17, ln = W * (.6 - (i % 3) * .1); inkLine([[-W * .32, yy], [-W * .32 + ln * .35, yy - W * .03], [-W * .32 + ln * .6, yy + W * .02], [-W * .32 + ln, yy - W * .01]], sw * 1.1, '#8A7F6B', 'ink', .4); }   // scribbles (not meant to be read)
  // red thread: two strands hanging under the seal
  const D = W / 3;
  if ((o.sealK ?? 1) > 0) {
    for (const d of [-1, 1]) inkLine([[d * D * .1, -D * .1], [d * D * .25, D * .5], [d * D * .12, D * .95]], Math.max(1.4, D * .05), '#B3202A', 'ink', .5);
    royalSeal(0, 0, D, {});   // half on the paper, half past the bottom edge
  }
  pop();
}

// ---------- Sir Lint's bitten shield ----------
function bittenShield(x, y, u, o = {}) {
  const C = LOST, sw = folkSW(u, o), R = 1.0 * u, q = o.view === 'q' ? 1 : 0;
  push(); translate(x, y); rotate(o.rot ?? -.1);
  const bite = o.bite ?? 1, ba = o.biteAt ?? -.7, bw = .72;                  // the bite sits upper right (Pumpkin's paw came from the right)
  const dep = dA => bite && dA < bw ? Math.sqrt(1 - (dA / bw) ** 2) * (1 - .1 * Math.abs(Math.cos(dA * 17))) : 0;   // round chomp with tooth scallops
  const angD = a => Math.abs(((a - ba + Math.PI) % TAU + TAU) % TAU - Math.PI);
  const rim = []; for (let i = 0; i < 48; i++) { const a = i / 48 * TAU; const r = R * (i % 2 ? 1.06 : .98) - dep(angD(a)) * R * .62 * bite; rim.push([Math.cos(a) * r * (1 - q * .2), Math.sin(a) * r]); }
  paint(rim, { wash: C.capDk, ink: PAL.ink, sw: sw * .7 });
  const face = []; for (let i = 0; i < 32; i++) { const a = i / 32 * TAU; const r = Math.min(R * .82, R * (1.0 - dep(angD(a)) * .62 * bite) - R * .17); face.push([Math.cos(a) * r * (1 - q * .2), Math.sin(a) * r]); }
  paint(face, { wash: C.cap, ink: null, shade: true, shadeK: .4 });
  paint(starPts(0, 0, R * .45, .45, 5), { wash: '#F2C14E', ink: PAL.ink, sw: sw * .4 });
  // tooth marks on the bite edge
  if (bite) for (const d of [-.3, 0, .3]) { const a = ba + d, r = R * (1 - Math.sqrt(1 - (Math.abs(d) / bw) ** 2) * .62 * bite) - R * .17; paint(ellPts(Math.cos(a) * r, Math.sin(a) * r, .05 * u, .07 * u, 8), { wash: C.capDk, ink: null }); }
  pop();
}

// ---------- the rescue rope ----------
function hairSpear(x, y, u, o = {}) {
  const sw = clamp(u / 16, .6, 2.6), rope = clamp(o.rope ?? 1);
  push(); translate(x, y); if (o.rot) rotate(o.rot);
  paint([[-.12 * u, -3.8 * u], [.12 * u, -3.8 * u], [.06 * u, 3.8 * u], [0, 4.3 * u], [-.06 * u, 3.8 * u]].map(([a, b]) => [b, a]), { wash: LOST.pick, ink: PAL.ink, sw: sw * .7 });   // toothpick lying along x
  // the knot and the long hair (dark, thin) trailing off the tail end
  paint(ellPts(-3.85 * u, 0, .2 * u, .2 * u, 8), { wash: '#4A3326', ink: PAL.ink, sw: sw * .5 });
  if (rope > 0) inkLine([[-3.85 * u, 0], [-5.3 * u, .5 * u * rope], [-7.2 * u, -.2 * u], [-9.4 * u, .4 * u * rope]], sw * .9, '#4A3326', 'ink', .6);
  pop();
}
function hairCoil(x, y, u, o = {}) {
  const sw = clamp(u / 16, .6, 2.6);
  push(); translate(x, y);
  paint(rectPts(-.9 * u, -.12 * u, .9 * u, .24 * u), { wash: '#C9CED6', ink: PAL.ink, sw: sw * .7 });   // the key's axle
  for (let i = 0; i < 6; i++) inkLine(arcPts(-.45 * u, 0, (.35 + i * .07) * u, (.35 + i * .07) * u * .9, 0, TAU * .96, 14), sw * .8, '#4A3326', 'ink', .3);
  pop();
}

// ---------- the little things of the night camp ----------
function snackBag(x, y, u, o = {}) {
  const sw = clamp(u / 16, .6, 2.6);
  push(); translate(x, y); if (o.rot) rotate(o.rot);
  const w = 1.7 * u, h = 2.2 * u;
  paint([[-w / 2, 0], [-w * .56, -h * .5], [-w * .46, -h], [w * .46, -h * 1.04], [w * .55, -h * .5], [w / 2, 0]], { wash: '#D2434B', ink: PAL.ink, sw: sw * .8, curv: .3, shade: true, shadeK: .4 });
  for (let i = 0; i < 6; i++) inkLine([[-w * .45 + i * w * .18, -h * 1.0], [-w * .45 + i * w * .18 + w * .05, -h * .9]], sw * .6, PAL.ink, 'ink', 0);   // the crimped top
  paint(ellPts(0, -h * .5, w * .3, w * .3, 12), { wash: '#F6D99A', ink: PAL.ink, sw: sw * .5 });
  letter('CRACK', 0, -h * .47, u * .32, '#8E1F2A', { font: `800 ${u * .32}px "Baloo 2", sans-serif`, ink: false, screen: false });
  paint([[-w * .2, -h * .72], [0, -h * .66], [w * .2, -h * .74], [w * .1, -h * .8], [-w * .1, -h * .8]], { wash: '#2B2233', washOp: 160, ink: null });   // the dark open mouth
  for (let i = 0; i < 3; i++) paint(ellPts(w * (.2 + i * .25), .1 * u, .08 * u, .05 * u, 5), { wash: '#E6B65F', ink: null });   // the last crumbs
  pop();
}
function ledLamp(x, y, u, o = {}) {
  const sw = clamp(u / 16, .6, 2.6), fl = 1 + Math.sin(T * 9) * .06 + (o.flick || 0) * Math.sin(T * 31) * .12;
  push(); translate(x, y);
  glow(0, -1.3 * u, 2.2 * u * fl, '#FF9B3A', .45 * (o.on ?? 1));
  paint(rrPts(-.55 * u, -.5 * u, 1.1 * u, .5 * u, .15 * u), { wash: '#3B3F4A', ink: PAL.ink, sw: sw * .7 });   // base
  paint(ellPts(0, -.5 * u, .55 * u, .12 * u, 12), { wash: '#5B606E', ink: PAL.ink, sw: sw * .5 });
  paint(arcPts(0, -.5 * u, .45 * u, 1.1 * u, Math.PI, TAU, 14), { wash: mixCol('#FFC37A', '#FF8A3A', .4), ink: PAL.ink, sw: sw * .7 });     // the glowing bulb
  paint(ellPts(-.12 * u, -1.0 * u, .12 * u, .22 * u, 8, 0, .4), { wash: '#FFF2C4', washOp: 200, ink: null });
  paint(ellPts(.55 * u, -.3 * u, .1 * u, .1 * u, 6), { wash: '#6BE08A', ink: null });   // charge light
  inkLine([[.55 * u, -.2 * u], [1.6 * u, .0 * u], [2.6 * u, -.05 * u]], sw * .8, '#2B2233', 'ink', .4);   // the little USB cable
  pop();
}
function jellyPlank(x, y, w, o = {}) {
  const sw = 1.5, wob = o.wob || 0, bite = clamp(o.bite || 0), wv = clamp(o.wave || 0), n = 5, h = w * .11;
  push(); translate(x, y);
  const top = []; for (let i = 0; i <= 30; i++) { const k = i / 30; top.push([k * w, -h - Math.sin(k * 7 + T * 6) * wob * 6 - wv * Math.exp(-(((k - .55) * 6) ** 2)) * h * 2.4 + bite * h * .8 * Math.sqrt(Math.max(0, 1 - ((k - .5) / .06) ** 2))]); }
  const bot = [[w, 0], [0, 0]];
  paint([...top, ...bot], { wash: '#7BE0A5', washOp: 205, ink: PAL.ink, sw, curv: .3, shade: true, shadeK: .35 });
  for (let i = 0; i < n; i++) paint(ellPts(w * (.12 + i * .2), -h * .55, w * .04, h * .2, 8), { wash: '#FFFFFF', washOp: 90, ink: null });   // shine
  inkLine([[w * .04, -h * .2], [w * .96, -h * .2]], 1.2, '#4DBE80', 'ink', .3);
  if (bite) for (const d of [-.05, 0, .05]) inkLine([[w * (.5 + d), -h * (1 - .55 * bite)], [w * (.5 + d), -h * (1 - .8 * bite)]], 1.4, '#4DBE80', 'ink', 0);   // tooth marks
  pop();
}
function fizzBubble(x, y, r, o = {}) {
  const pop_ = clamp(o.pop || 0);
  if (pop_ > 0) { for (let i = 0; i < 6; i++) paint(arcPts(x, y, r * (1 + pop_ * .5), r * (1 + pop_ * .5), i * TAU / 6 + .15, i * TAU / 6 + .75, 6), { wash: '#F6D9A8', washOp: 0, ink: PAL.ink, sw: 1 }); for (let i = 0; i < 9; i++) { const a = i / 9 * TAU, d = r * (1 + pop_ * 1.1); paint(ellPts(x + Math.cos(a) * d, y + Math.sin(a) * d, r * .13 * (1 - pop_ * .6), r * .13 * (1 - pop_ * .6), 12), { wash: '#F6D9A8', ink: PAL.ink, sw: .8 }); } return; }
  paint(ellPts(x, y, r, r, 28), { wash: '#F6D9A8', washOp: 110, ink: PAL.ink, sw: Math.max(1, r / 40) });
  paint(arcPts(x - r * .1, y - r * .1, r * .7, r * .7, Math.PI * 1.05, Math.PI * 1.55, 10), { wash: '#FFFFFF', washOp: 220, ink: null });
  paint(ellPts(x - r * .45, y - r * .5, r * .13, r * .09, 8, 0, -.7), { wash: '#FFFFFF', ink: null });
}
function autograph(x, y, u, o = {}) {
  const sw = clamp(u / 16, .6, 2.4);
  push(); translate(x, y); rotate(o.rot ?? -.1);
  paint(rrPts(-.9 * u, -1.25 * u, 1.8 * u, 1.25 * u, .08 * u), { wash: '#FFFDF6', ink: PAL.ink, sw: sw * .7 });
  inkLine([[-.65 * u, -.5 * u], [-.4 * u, -.95 * u], [-.2 * u, -.4 * u], [.05 * u, -.9 * u], [.25 * u, -.5 * u], [.55 * u, -.7 * u]], sw * 1.1, '#2E5AA8', 'ink', .6);   // a hopeful scribble
  paint(ellPts(.55 * u, -.4 * u, .2 * u, .18 * u, 8), { wash: '#E9A44C', ink: PAL.ink, sw: sw * .4 });   // paw print
  pop();
}
function redLight(x, y, r, k = 1) {
  glow(x, y, r * 5, '#FF3B3B', .55 * k);
  paint(ellPts(x, y, r, r, 14), { wash: '#FF5A4D', washOp: 255 * k, ink: null });
  paint(ellPts(x - r * .25, y - r * .25, r * .3, r * .3, 8), { wash: '#FFFFFF', washOp: 170 * k, ink: null });
}

// soda stains for Pumpkin (his `draw` hook, body space): amber blotches, a drip, and clinging bubbles. k 0..1 = how soaked
function sodaStains(k = 1) {
  return (u, sw) => {
    const SODA = '#C9873A';
    for (const [x, y, rx, ry] of [[-1.9, -4.2, .9, .6], [1.6, -3.1, .7, .9], [.4, -6.4, 1.1, .5], [-.7, -2.0, .8, .5]]) paint(ellPts(x * u, y * u, rx * u * k, ry * u * k, 12, .03 * u), { wash: '#B8741F', washOp: 120, ink: null });
    for (const [x, y] of [[-2.2, -3.0], [2.0, -5.2], [.9, -1.4]]) { inkLine([[x * u, y * u], [x * u + .05 * u, (y + 1.0 * k) * u]], sw * 1.4, SODA, 'ink', 0); paint(ellPts(x * u + .05 * u, (y + 1.1 * k) * u, .13 * u, .17 * u, 8), { wash: SODA, ink: null }); }
    for (const [x, y, r] of [[-2.0, -9.6, .22], [1.6, -9.9, .16], [2.8, -5.0, .2], [-2.6, -1.8, .15]]) { paint(ellPts(x * u, y * u, r * u, r * u, 12), { wash: '#F6D9A8', washOp: 130, ink: PAL.ink, sw: sw * .35 }); paint(ellPts((x - .3 * r) * u, (y - .3 * r) * u, r * .3 * u, r * .22 * u, 6), { wash: '#FFFFFF', ink: null }); }
  };
}
