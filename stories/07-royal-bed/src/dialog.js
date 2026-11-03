// dialog.js: written by engine/dialog.mjs (do not edit). DIALOG rows [t0, who, env], env = mouth level 0-9 per 1/24 s
// from t0. SPEAK(who, t): that character's mouth level 0..1 at video time t, held for 1/12 s. LY: [[start, end, text, who]]
// for subs.js (each line's speech start and end).
const DIALOG = [[2.192,"pip","010009975449217544995057778531000000"],[8.233,"pip","0000574126997761007854210000000000000488999649139932210044224432100000000"],[14.6,"pumpkin","49999532100000075310002443210000"],[18.358,"pumpkin","0299511331001410000"],[20.958,"pip","07753000399950011253110000000009999842320011101795101443211000003322222222100"],[27.833,"pumpkin","000069339841000399611620031000000"],[34.833,"pip","000089997544467664332100000000029970016998311244443210000000000000"]];
const LY = [[2.4,3.4,"Special delivery!","pip"],[8.4,10.9,"A royal bed. Only the best for you.","pip"],[14.6,15.725,"...Box.","pumpkin"],[18.4,18.941,"Perfect.","pumpkin"],[21,24.041,"That bed cost forty crackers!","pip"],[28,28.916,"Still... perfect.","pumpkin"],[35,37,"...Oh no. It IS nice.","pip"]];
function SPEAK(who, t) {
  const tq = Math.floor(t * 12) / 12;
  for (const [t0, w, env] of DIALOG) {
    if (w !== who || tq < t0) continue;
    const k = Math.floor((tq - t0) * 24);
    if (k < env.length) return +env[k] / 9;
  }
  return 0;
}
