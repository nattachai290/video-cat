// dialog.js: written by engine/dialog.mjs (do not edit). DIALOG rows [t0, who, env], env = mouth level 0-9 per 1/24 s
// from t0. SPEAK(who, t): that character's mouth level 0..1 at video time t, held for 1/12 s. LY: [[start, end, text, who]]
// for subs.js (each line's speech start and end).
const DIALOG = [[0.758,"pumpkin","1899898631038996211642011521000"],[8.433,"pumpkin","0000999936998641237566552100000000"],[20.25,"pumpkin","0000012599984456200000035203369999941026741189991000000000"],[27.433,"pumpkin","000199367789972339984022987476101434238984310000000"],[30.833,"pip","00013998734377653355599405544321100000"],[37.15,"pumpkin","0000019995361476643440000"],[40.158,"pip","0891024902259800179921488755311589401444442320000"],[43.633,"pip","0000699800079999864210000000001898662126443201127997534411000000"]];
const LY = [[0.8,1.883,"Mmm... perfect.","pumpkin"],[8.6,9.475,"Don't move, sun.","pumpkin"],[20.5,22.25,"Higher... I can... reach it...","pumpkin"],[27.6,29.225,"WHO turned off the sun?!","pumpkin"],[31,32.125,"Sunshine delivery!","pip"],[37.4,38.025,"Five stars.","pumpkin"],[40.2,42.033,"Tips accepted in crackers.","pip"],[43.8,45.966,"Uh-oh. Arm's getting tired...","pip"]];
function SPEAK(who, t) {
  const tq = Math.floor(t * 12) / 12;
  for (const [t0, w, env] of DIALOG) {
    if (w !== who || tq < t0) continue;
    const k = Math.floor((tq - t0) * 24);
    if (k < env.length) return +env[k] / 9;
  }
  return 0;
}
