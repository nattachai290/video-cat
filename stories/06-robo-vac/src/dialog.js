// dialog.js: written by engine/dialog.mjs (do not edit). DIALOG rows [t0, who, env], env = mouth level 0-9 per 1/24 s
// from t0. SPEAK(who, t): that character's mouth level 0..1 at video time t, held for 1/12 s. LY: [[start, end, text, who]]
// for subs.js (each line's speech start and end).
const DIALOG = [[6.158,"pumpkin","0299100131000499841279741013100000"],[10.517,"pip","0068999950002221100000762699776514630330137642211211000000"],[17.917,"pumpkin","00488975442002699941105200000043025828999421100000"],[24.558,"pumpkin","169921461344056310000000479961492364321252100000"],[32.233,"pumpkin","0000799764221000000971119973179964100345310000"],[36.475,"pumpkin","001998768654344000002961157666689998422433100000"],[41.317,"pip","0021599612444420000"]];
const LY = [[6.2,7.325,"WHAT is THAT?!","pumpkin"],[10.6,12.6,"Relax. It only eats crumbs.","pip"],[18,19.709,"I'm... not... a crumb!","pumpkin"],[24.6,26.308,"Make it stop! Make it STOP!","pumpkin"],[32.4,33.941,"...Oh. It vibrates.","pumpkin"],[36.6,38.225,"This is... actually nice.","pumpkin"],[41.4,41.942,"Told you.","pip"]];
function SPEAK(who, t) {
  const tq = Math.floor(t * 12) / 12;
  for (const [t0, w, env] of DIALOG) {
    if (w !== who || tq < t0) continue;
    const k = Math.floor((tq - t0) * 24);
    if (k < env.length) return +env[k] / 9;
  }
  return 0;
}
