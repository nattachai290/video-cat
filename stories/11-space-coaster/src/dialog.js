// dialog.js: written by engine/dialog.mjs (do not edit). DIALOG rows [t0, who, env], env = mouth level 0-9 per 1/24 s
// from t0. SPEAK(who, t): that character's mouth level 0..1 at video time t, held for 1/12 s. LY: [[start, end, text, who]]
// for subs.js (each line's speech start and end).
const DIALOG = [[0.958,"pumpkin","079974211000"],[5.292,"dusty","00000599868149954211000000000000000005899669931153221221000000"],[12.758,"pumpkin","029999988300"],[28.108,"dusty","00000017998556994211000000000"],[33.558,"pumpkin","127974792000"],[35.233,"pip","00012999987543101888987642210157764211000"],[39.875,"dusty","00037999752420787400000000"]];
const LY = [[1,1.25,"Rawr.","pumpkin"],[5.5,7.584,"All aboard. No refunds.","dusty"],[12.8,13.175,"WHEEE!","pumpkin"],[28.4,28.858,"Home run.","dusty"],[33.6,33.933,"...Rawr?","pumpkin"],[35.4,36.733,"Well, well, well.","pip"],[40,40.625,"Wrong stop.","dusty"]];
function SPEAK(who, t) {
  const tq = Math.floor(t * 12) / 12;
  for (const [t0, w, env] of DIALOG) {
    if (w !== who || tq < t0) continue;
    const k = Math.floor((tq - t0) * 24);
    if (k < env.length) return +env[k] / 9;
  }
  return 0;
}
