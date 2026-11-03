// dialog.js: written by engine/dialog.mjs (do not edit). DIALOG rows [t0, who, env], env = mouth level 0-9 per 1/24 s
// from t0. SPEAK(who, t): that character's mouth level 0..1 at video time t, held for 1/12 s. LY: [[start, end, text, who]]
// for subs.js (each line's speech start and end).
const DIALOG = [[0.858,"pumpkin","03889654458997534401000002496125310000"],[5.358,"pumpkin","15689998652110000"],[12.517,"pumpkin","002499987514975420000000"],[21.35,"pip","00000069992022488876449997100110000001139974200000000000000"],[29.433,"pumpkin","00002961013566641000299932000147778999743211100000"],[34.717,"pip","006401154235999557555531000000"],[44.917,"pumpkin","0199986356689752000000"]];
const LY = [[0.9,2.233,"One... last... cookie.","pumpkin"],[5.4,5.816,"Mine.","pumpkin"],[12.6,13.225,"...Plan B.","pumpkin"],[21.6,23.225,"That tower looks... safe.","pip"],[29.6,31.183,"Victory is MINE!","pumpkin"],[34.8,35.675,"Took you long enough.","pip"],[45,45.584,"...Plan C.","pumpkin"]];
function SPEAK(who, t) {
  const tq = Math.floor(t * 12) / 12;
  for (const [t0, w, env] of DIALOG) {
    if (w !== who || tq < t0) continue;
    const k = Math.floor((tq - t0) * 24);
    if (k < env.length) return +env[k] / 9;
  }
  return 0;
}
