// cover.js: cover of "The Space Coaster" (1080 x 1920), drawn fresh: the coaster flying out of a portal in space, a giant
// monster behind, Dusty mid-swing at a fireball, Pumpkin and Pip in shark hoods screaming with joy. Render: --loop=cover --still=0.6
(() => {
  LOOPS.cover = t => {
    space(.6, 0, { planet: [180, 1400, 140] });
    monster(760, 1350, .75, .6, { mouth: 1 });
    portal(260, 1500, 260, 1, .6);
    fireball(860, 880, 90, .6);
    push(); translate(560, 1500); rotate(-.18);
    coasterCart(0, 0, 52, { light: true, bar: 1, seats: (u, L, Hh) => {
      const top = -Hh - .4 * u;
      pumpkin(-L * .2, top + 5.6 * u, u, { ...face('happy', { mouth: 'grin', blush: .5 }), aL: 1.3, aR: 1.3, draw: sharkHood(0), noShadow: true, boilKey: 'cvk' });
      pip(-L * .2, top + 5.6 * u - 13 * u, u * .8, { ...face('panic', { eyes: 'squeeze' }), aL: 1.2, aR: 1.2, draw: pipSharkHood(0), noShadow: true, boilKey: 'cvp' });
      dusty(L * .2, top + 1.0 * u, u, { aR: -.3, aL: .3, mouth: 'smirk', lid: .6, noShadow: true, boilKey: 'cvd' });
    } });
    pop();
    burst(830, 920, 200, .4, 12, '#FFF3B0', 3);
    letter('ALL ABOARD!', W / 2, 230, 160, '#FFFFFF', { font: '800 160px "Baloo 2", sans-serif', stroke: '#2B2233', rot: -.04, screen: true });
    letter('NO REFUNDS.', W / 2 + 10, 410, 150, '#F2C14E', { font: '800 150px "Baloo 2", sans-serif', stroke: '#2B2233', rot: .05, screen: true });
  };
  LOOPS.cover.len = 2;
})();
