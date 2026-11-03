// dialog.js: written by engine/dialog.mjs (do not edit). DIALOG rows [t0, who, env], env = mouth level 0-9 per 1/24 s
// from t0. SPEAK(who, t): that character's mouth level 0..1 at video time t, held for 1/12 s. LY: [[start, end, text, who]]
// for subs.js (each line's speech start and end).
const DIALOG = [[5.033,"pumpkin","0001349995333015200000"],[10.317,"pip","002579983001000100"],[15.6,"pip","2984925603950000053389965310000"],[26.875,"pumpkin","00123599962113310231000000000000001459999521253105520000"],[38.958,"pip","0599986432100000244002698106631011000"]];
const LY = [[5.2,5.741,"...Sandwich.","pumpkin"],[10.4,10.692,"Nope.","pip"],[15.6,16.683,"HEY!","pip"],[27,29.042,"...Worth it.","pumpkin"],[39,40.208,"...You keep it.","pip"]];
function SPEAK(who, t) {
  const tq = Math.floor(t * 12) / 12;
  for (const [t0, w, env] of DIALOG) {
    if (w !== who || tq < t0) continue;
    const k = Math.floor((tq - t0) * 24);
    if (k < env.length) return +env[k] / 9;
  }
  return 0;
}
