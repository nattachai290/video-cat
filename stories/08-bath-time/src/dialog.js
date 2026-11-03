// dialog.js: written by engine/dialog.mjs (do not edit). DIALOG rows [t0, who, env], env = mouth level 0-9 per 1/24 s
// from t0. SPEAK(who, t): that character's mouth level 0..1 at video time t, held for 1/12 s. LY: [[start, end, text, who]]
// for subs.js (each line's speech start and end).
const DIALOG = [[0.958,"pip","09997675000010000001222699876666454100"],[7.233,"pumpkin","00014205899841256999853100000"],[17.358,"pip","1359964211111000000026999731000000"],[20.567,"pumpkin","110000002999620045210000"],[28.192,"pip","0000049986432100000000046788992059910552210375445421000000"],[40.633,"pumpkin","00002887311999875444410000"]];
const LY = [[1,2.416,"Bath... time.","pip"],[7.4,8.191,"You can't see me.","pumpkin"],[17.4,18.483,"Nice... lamp.","pip"],[20.9,21.359,"YOWCH!","pumpkin"],[28.4,30.317,"Fine. More bubbles for me.","pip"],[40.8,41.508,"...I'm thin now.","pumpkin"]];
function SPEAK(who, t) {
  const tq = Math.floor(t * 12) / 12;
  for (const [t0, w, env] of DIALOG) {
    if (w !== who || tq < t0) continue;
    const k = Math.floor((tq - t0) * 24);
    if (k < env.length) return +env[k] / 9;
  }
  return 0;
}
