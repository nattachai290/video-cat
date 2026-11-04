// dialog.js: written by engine/dialog.mjs (do not edit). DIALOG rows [t0, who, env], env = mouth level 0-9 per 1/24 s
// from t0. SPEAK(who, t): that character's mouth level 0..1 at video time t, held for 1/12 s. LY: [[start, end, text, who]]
// for subs.js (each line's speech start and end).
const DIALOG = [[3.117,"pip","00499974520100027653111102000"],[17.517,"pip","014999101030000000000000"],[21.792,"pumpkin","0000099975432211000000004835996620301432111000000"],[34.958,"pip","0687543333579998533210000"],[40.158,"pumpkin","09972001100000"]];
const LY = [[3.2,4.2,"Static boost!","pip"],[17.6,17.975,"Help!","pip"],[22,23.459,"I am... the junk ball.","pumpkin"],[35,35.791,"...Oh no.","pip"],[40.2,40.366,"Boop.","pumpkin"]];
function SPEAK(who, t) {
  const tq = Math.floor(t * 12) / 12;
  for (const [t0, w, env] of DIALOG) {
    if (w !== who || tq < t0) continue;
    const k = Math.floor((tq - t0) * 24);
    if (k < env.length) return +env[k] / 9;
  }
  return 0;
}
