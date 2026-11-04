// dialog.js: written by engine/dialog.mjs (do not edit). DIALOG rows [t0, who, env], env = mouth level 0-9 per 1/24 s
// from t0. SPEAK(who, t): that character's mouth level 0..1 at video time t, held for 1/12 s. LY: [[start, end, text, who]]
// for subs.js (each line's speech start and end).
const DIALOG = [[3.117,"pip","012015599799810100015542101110100000"],[17.475,"pip","000279989997120000110000"],[21.917,"pumpkin","0199999997331100000056117998432016554310000"],[35,"pip","27975433222112223799998885321111000000"],[40.2,"pumpkin","599400000000"]];
const LY = [[3.2,4.117,"Static boost!","pip"],[17.6,18.058,"Help!","pip"],[22,23.5,"I am... the junk ball.","pumpkin"],[35,36.167,"Oh... no.","pip"],[40.2,40.367,"Boop.","pumpkin"]];
function SPEAK(who, t) {
  const tq = Math.floor(t * 12) / 12;
  for (const [t0, w, env] of DIALOG) {
    if (w !== who || tq < t0) continue;
    const k = Math.floor((tq - t0) * 24);
    if (k < env.length) return +env[k] / 9;
  }
  return 0;
}
