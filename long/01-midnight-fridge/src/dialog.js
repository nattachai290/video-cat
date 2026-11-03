// dialog.js: written by engine/dialog.mjs (do not edit). DIALOG rows [t0, who, env], env = mouth level 0-9 per 1/24 s
// from t0. SPEAK(who, t): that character's mouth level 0..1 at video time t, held for 1/12 s. LY: [[start, end, text, who]]
// for subs.js (each line's speech start and end).
const DIALOG = [[8.917,"pip","0078118879965534332000000139930010000"],[14.792,"pip","001103993001366655543100011299963000000000109990003177776420001899988752110001116950005478654100000255433003998851010133220010000"],[30.833,"pumpkin","00006997678981004355021997521000"],[57.458,"pumpkin","02479972100110000"],[70.417,"pip","002999754401100002379964211100000002655999721432211110000"],[103.958,"pumpkin","146996321000003479853211121000"],[117.5,"pip","49400069774000"],[151.792,"pumpkin","000007972099954100000"],[154.917,"pip","00910599984534411366410100001253049974011000"],[164.958,"pumpkin","0741435565009995322521000"],[180.875,"pip","00036532112899511100000000195014995321000000"],[183.25,"pumpkin","000001454335324606999531110000"]];
const LY = [[9,10.167,"Operation... Cake.","pip"],[15,19.875,"Step one. Sneak. Step two. Climb. Step three... CAKE.","pip"],[31,32,"I love this plan.","pumpkin"],[57.5,57.791,"...Lamp.","pumpkin"],[70.5,72.459,"Don't. Chase. The lasers.","pip"],[104,105.041,"So... cold.","pumpkin"],[117.5,117.958,"...Uh oh.","pip"],[152,152.417,"We did it.","pumpkin"],[155,156.5,"Operation Cake... complete.","pip"],[165,165.833,"...It's a sponge.","pumpkin"],[181,182.417,"More snacks? Pick one!","pip"],[183.5,184.208,"And subscribe!","pumpkin"]];
function SPEAK(who, t) {
  const tq = Math.floor(t * 12) / 12;
  for (const [t0, w, env] of DIALOG) {
    if (w !== who || tq < t0) continue;
    const k = Math.floor((tq - t0) * 24);
    if (k < env.length) return +env[k] / 9;
  }
  return 0;
}
