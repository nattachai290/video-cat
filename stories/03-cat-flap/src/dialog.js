// dialog.js: written by engine/dialog.mjs (do not edit). DIALOG rows [t0, who, env], env = mouth level 0-9 per 1/24 s
// from t0. SPEAK(who, t): that character's mouth level 0..1 at video time t, held for 1/12 s. LY: [[start, end, text, who]]
// for subs.js (each line's speech start and end).
const DIALOG = [[0.317,"pumpkin","0069521011000000000133489731000000003999930242100000"],[4.358,"pip","02737761239996597761016543210000"],[6.725,"pip","0019997113334577554023210000000000038999886543310000000"],[14.175,"pumpkin","0002996549612255432100000000047516933664589981059740596432100000"],[18.117,"pip","002633996201009994035412895532210000000"],[20.275,"pumpkin","00045999978753231048875310000"],[28.175,"pip","0014654210000001699598300000"],[39.917,"pumpkin","004765221199976443343000000"],[48.117,"pip","0024432122432203689997300000"],[49.875,"pumpkin","001479989976998875310010000"]];
const LY = [[0.4,2.234,"Don't. Say. Anything.","pumpkin"],[4.4,5.483,"I didn't say anything.","pip"],[6.85,8.683,"Big lunch?","pip"],[14.3,16.592,"Push me through. I'll give you half my dinner.","pumpkin"],[18.2,19.409,"You just ate your dinner.","pip"],[20.4,21.275,"...Tomorrow's dinner.","pumpkin"],[28.3,29.133,"Okay. Run-up.","pip"],[40,40.792,"...I'm thin now.","pumpkin"],[48.2,49.075,"Same time tomorrow?","pip"],[50,50.667,"...Bring a run-up.","pumpkin"]];
function SPEAK(who, t) {
  const tq = Math.floor(t * 12) / 12;
  for (const [t0, w, env] of DIALOG) {
    if (w !== who || tq < t0) continue;
    const k = Math.floor((tq - t0) * 24);
    if (k < env.length) return +env[k] / 9;
  }
  return 0;
}
