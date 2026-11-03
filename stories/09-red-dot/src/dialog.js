// dialog.js: written by engine/dialog.mjs (do not edit). DIALOG rows [t0, who, env], env = mouth level 0-9 per 1/24 s
// from t0. SPEAK(who, t): that character's mouth level 0..1 at video time t, held for 1/12 s. LY: [[start, end, text, who]]
// for subs.js (each line's speech start and end).
const DIALOG = [[4.433,"pip","001124333100024899979776521000000"],[15.317,"pumpkin","01973899989982577321000"],[21.2,"pip","550002449997543000000"],[30.758,"pip","0499300000034249989932353100000"],[38.233,"pumpkin","00009940599861864100000"]];
const LY = [[4.6,5.516,"Too slow!","pip"],[15.4,16.109,"WHOAAA!","pumpkin"],[21.2,21.825,"...Uh oh.","pip"],[30.8,31.8,"Look! Behind you!","pip"],[38.4,38.941,"...I caught it.","pumpkin"]];
function SPEAK(who, t) {
  const tq = Math.floor(t * 12) / 12;
  for (const [t0, w, env] of DIALOG) {
    if (w !== who || tq < t0) continue;
    const k = Math.floor((tq - t0) * 24);
    if (k < env.length) return +env[k] / 9;
  }
  return 0;
}
