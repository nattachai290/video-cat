// render_pw.mjs: renders a flat-engine story with Playwright (preinstalled on Claude's cloud machines) straight to MP4,
// piping JPEG frames into ffmpeg. No npm install needed. Run from a story folder:
//   NODE_PATH=$(npm root -g) node ../../engine/flat/render_pw.mjs --out=out/video.mp4 [--audio=out/audio/mix.wav] [--range=0:52] [--fps=24]
//   NODE_PATH=$(npm root -g) node ../../engine/flat/render_pw.mjs --sheet=0.5,4,9 --cols=3 --w=360 --out=out/check/a.jpg
//   NODE_PATH=$(npm root -g) node ../../engine/flat/render_pw.mjs --loop=cast --sheet=0.5 --cols=1 --w=1080 --out=out/check/cast.jpg
//   NODE_PATH=$(npm root -g) node ../../engine/flat/render_pw.mjs --still=0.5 --out=out/still.png       one clean full-size PNG
//   --page=other.html (instead of studio.html), --query=banner (extra URL query, read by the page's config)
import { createRequire } from 'module';
import { spawn } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { pathToFileURL } from 'url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const out = args.out || 'out/video.mp4', fps = +(args.fps || 24);
mkdirSync(dirname(resolve(out)), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
page.on('pageerror', e => console.log('[page error]', e.message));
await page.goto(pathToFileURL(resolve(args.page || 'studio.html')).href + '?render' + (args.query ? '&' + args.query : ''));
await page.waitForFunction('window.ready === true', null, { timeout: 60000 });
if (args.loop) await page.evaluate(n => { window.LOOP = LOOPS[n]; }, args.loop);

if (args.still) {   // one clean full-size PNG (no time label): --still=0.5
  const url = await page.evaluate(t => window.renderAt(t, 'image/png'), +args.still);
  writeFileSync(out, Buffer.from(url.split(',')[1], 'base64')); console.log(`wrote ${out}`);
} else if (args.sheet || args.strip) {
  let ts;
  if (args.sheet) ts = String(args.sheet).split(',').map(Number);
  else { const [a, b] = String(args.strip).split(':').map(Number); ts = []; for (let t = a; t <= b + 1e-6; t += 1 / fps) ts.push(+t.toFixed(4)); }
  const crop = args.crop ? String(args.crop).split(',').map(Number) : null;
  const r = await page.evaluate(([t, c, w, cr]) => window.renderSheet(t, c, w, cr), [ts, +(args.cols || 4), +(args.w || 270), crop]);
  writeFileSync(out, Buffer.from(r.url.split(',')[1], 'base64'));
  console.log(`wrote ${out} (${ts.length} frames, ${Math.round(r.ms.reduce((a, b) => a + b, 0) / r.ms.length)} ms/frame)`);
} else {
  const dur = await page.evaluate(() => window.LOOP ? window.LOOP.len : DUR);
  const [a, b] = args.range ? String(args.range).split(':').map(Number) : [0, dur], n = Math.round((b - a) * fps);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    ...(args.audio ? ['-ss', String(a), '-i', args.audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-shortest'] : []),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    const url = await page.evaluate(t => window.renderAt(t, 'image/jpeg', .93), a + i / fps);
    if (!ff.stdin.write(Buffer.from(url.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 240 === 0) console.log(`frame ${i}/${n}`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  console.log(`wrote ${out}: ${n} frames in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}
await browser.close();
