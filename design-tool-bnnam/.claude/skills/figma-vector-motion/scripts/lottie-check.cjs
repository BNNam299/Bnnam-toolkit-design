#!/usr/bin/env node
// lottie-check.cjs — figma-vector-motion: play a Lottie with lottie-web (the player family of lottie-ios / lottie-android) in the
// machine's own Chrome / Edge, headless — nothing to install — and answer what a designer would see:
//   · a sheet of the beat frames (every key time of motion.json, or --frames), one image to look at once;
//   · numbers: rest pose vs the Figma export (--ref), loop seam (last frame → first vs a normal step), sudden pops, empty frames,
//     art touching the canvas edge (clipped while it moves);
//   · --preview page.html: a stand-alone player for the designer (play / scrub / speed / background), works offline.
//
//   node lottie-check.cjs --anim anim.json|anim.lottie [--motion motion.json | --frames 0,12,30] [--ref figma.png] [--rest last|first|<frame>]
//                         [--bg checker|#ffffff|#1b1b1b] [--out sheet.png] [--preview preview.html]
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

function args() {
  const a = {}; const v = process.argv.slice(2);
  for (let i = 0; i < v.length; i++) if (v[i].startsWith('--')) { const k = v[i].slice(2); a[k] = v[i + 1] && !v[i + 1].startsWith('--') ? v[++i] : true; }
  return a;
}
function findChrome() {
  const c = [process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].filter(Boolean);
  const f = c.find((p) => fs.existsSync(p));
  if (!f) throw new Error('No Chrome / Edge found — set CHROME_PATH to a Chromium browser');
  return f;
}
const LOTTIE = () => fs.readFileSync(path.join(__dirname, 'vendor', 'lottie.min.js'), 'utf8');
const esc = (s) => s.replace(/<\/script/gi, '<\\/script');

function beatFrames(anim, motion, list) {
  const op = anim.op, fps = anim.fr, last = op - 1;
  if (list) return [...new Set(String(list).split(',').map(Number).filter((x) => x >= 0 && x <= last))].sort((x, y) => x - y);
  let f = [];
  if (motion) for (const t of motion.tracks || []) for (const k of ['rotate', 'move', 'scale', 'opacity', 'color', 'trim']) for (const key of t[k] || []) f.push(Math.round(key[0] * fps));
  f.push(0, Math.round(op / 2), last);
  // a few in-betweens so arcs and overlaps show, not only the poses
  const s = [...new Set(f.map((x) => Math.max(0, Math.min(last, x))))].sort((a, b) => a - b);
  const mids = []; for (let j = 1; j < s.length; j++) if (s[j] - s[j - 1] > 6) mids.push(Math.round((s[j] + s[j - 1]) / 2));
  return [...new Set([...s, ...mids])].sort((a, b) => a - b).slice(0, 24);
}

function page({ anim, frames, ref, rest, bg, cell }) {
  const W = anim.w, H = anim.h, sc = Math.min(1, cell / Math.max(W, H));
  const cw = Math.round(W * sc), ch = Math.round(H * sc);
  return `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;font:12px system-ui,sans-serif;background:#f3f3f3;color:#222}
.g{display:flex;flex-wrap:wrap;gap:8px;padding:8px}.c{background:#fff;padding:4px;border-radius:4px}
.c canvas{display:block;width:${cw}px;height:${ch}px;${bg === 'checker' ? 'background:repeating-conic-gradient(#ddd 0 25%,#fff 0 50%) 0 0/16px 16px' : `background:${bg}`}}
.l{padding-top:3px}</style></head><body><div class="g" id="g"></div><pre id="out" style="display:none"></pre>
<script>${esc(LOTTIE())}</script><script>
try{
const anim=${JSON.stringify(anim)};const frames=${JSON.stringify(frames)};const refSrc=${JSON.stringify(ref || '')};const restArg=${JSON.stringify(rest)};
const W=anim.w,H=anim.h,op=anim.op,fps=anim.fr;
function player(cv){const ctx=cv.getContext('2d');return lottie.loadAnimation({renderer:'canvas',loop:false,autoplay:false,animationData:JSON.parse(JSON.stringify(anim)),rendererSettings:{context:ctx,clearCanvas:true}});}
// small canvas for the numbers (max 256 px)
const k=Math.min(1,256/Math.max(W,H)),mw=Math.max(1,Math.round(W*k)),mh=Math.max(1,Math.round(H*k));
const mc=document.createElement('canvas');mc.width=W;mc.height=H;const mp=player(mc);
const sm=document.createElement('canvas');sm.width=mw;sm.height=mh;const sx=sm.getContext('2d',{willReadFrequently:true});
function grab(f){mp.goToAndStop(f,true);sx.clearRect(0,0,mw,mh);sx.drawImage(mc,0,0,mw,mh);return sx.getImageData(0,0,mw,mh).data;}
function onWhite(d){const o=new Float32Array(d.length/4*3);for(let i=0,j=0;i<d.length;i+=4){const a=d[i+3]/255;o[j++]=d[i]*a+255*(1-a);o[j++]=d[i+1]*a+255*(1-a);o[j++]=d[i+2]*a+255*(1-a);}return o;}
function diff(a,b){let s=0,n=0;for(let i=0;i<a.length;i+=3){const e=(Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2]))/3;s+=e;if(e>40)n++;}return{mean:+(s/(a.length/3)).toFixed(2),over40:+(100*n/(a.length/3)).toFixed(2)};}
function info(d){let any=0,edge=0,x0=mw,y0=mh,x1=-1,y1=-1;for(let y=0;y<mh;y++)for(let x=0;x<mw;x++){if(d[(y*mw+x)*4+3]>8){any++;if(x<x0)x0=x;if(y<y0)y0=y;if(x>x1)x1=x;if(y>y1)y1=y;if(x===0||y===0||x===mw-1||y===mh-1)edge++;}}return{empty:any===0,edge,box:any?[x0/k,y0/k,(x1+1)/k,(y1+1)/k].map(Math.round):null};}
const out={frames:op,fps,size:[W,H],empty:[],edge:[],steps:null,seam:null,rest:null};
// every frame once: steps between neighbours → pops and the loop seam
const N=Math.min(op,900);let prev=null,first=null;const st=[];const edges=[];
for(let f=0;f<N;f++){const d=grab(f);const w=onWhite(d);const i=info(d);if(i.empty)out.empty.push(f);edges.push(i.edge);if(prev)st.push([f,diff(prev,w).mean]);else first=w;prev=w;}
const sorted=st.map(s=>s[1]).sort((a,b)=>a-b);const med=sorted.length?sorted[Math.floor(sorted.length/2)]:0;
// a pop = one step far bigger than both neighbours (a hold that snaps, a missing key), not a fast but smooth move
const pops=st.map(([f,v],j)=>{const nb=Math.max(j>0?st[j-1][1]:0,j<st.length-1?st[j+1][1]:0);return{frame:f,mean:v,ratio:+(v/Math.max(nb,0.05)).toFixed(1)};}).filter(p=>p.ratio>4&&p.mean>1.5).sort((a,b)=>b.ratio-a.ratio).slice(0,5);
out.steps={median:med,pops};
if(first&&prev){const s=diff(prev,first).mean;out.seam={mean:s,ratio:+(s/Math.max(med,0.05)).toFixed(1)};}
const restF=restArg==='first'?0:restArg==='last'?op-1:Number(restArg);out.restFrame=restF;
// art leaving the canvas: more edge pixels than the rest pose has (a part swinging out gets clipped in the app)
const er=edges[Math.min(restF,edges.length-1)]||0;edges.forEach((e,f)=>{if(e>er+2)out.edge.push(f);});
function finish(){document.getElementById('out').textContent='RESULT'+JSON.stringify(out)+'END';}
// the sheet
const g=document.getElementById('g');
for(const f of frames){const c=document.createElement('div');c.className='c';const cv=document.createElement('canvas');cv.width=W;cv.height=H;c.appendChild(cv);const l=document.createElement('div');l.className='l';l.textContent='f'+f+' · '+(f/fps).toFixed(2)+'s'+(f===restF?' · rest':'');c.appendChild(l);g.appendChild(c);const p=player(cv);p.goToAndStop(f,true);}
if(refSrc){const im=new Image();im.onload=()=>{const rc=document.createElement('canvas');rc.width=mw;rc.height=mh;const rx=rc.getContext('2d');rx.drawImage(im,0,0,mw,mh);const r=onWhite(rx.getImageData(0,0,mw,mh).data);out.rest=diff(onWhite(grab(restF)),r);
 const c=document.createElement('div');c.className='c';const cv=document.createElement('canvas');cv.width=W;cv.height=H;cv.getContext('2d').drawImage(im,0,0,W,H);c.appendChild(cv);const l=document.createElement('div');l.className='l';l.textContent='Figma (reference)';c.appendChild(l);g.insertBefore(c,g.firstChild);finish();};im.src=refSrc;}
else finish();
}catch(e){document.getElementById('out').textContent='ERROR'+(e&&e.stack||e)+'END';}
</script></body></html>`;
}

function preview(anim, file) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${anim.nm || 'Lottie'} · preview</title>
<style>body{margin:0;font:13px system-ui,sans-serif;background:#f5f5f5;color:#222;display:flex;flex-direction:column;align-items:center;gap:12px;padding:16px}
#st{width:min(90vw,${Math.max(anim.w, 320)}px);aspect-ratio:${anim.w}/${anim.h};border-radius:8px;background:repeating-conic-gradient(#ddd 0 25%,#fff 0 50%) 0 0/16px 16px}
.bar{display:flex;gap:8px;align-items:center;flex-wrap:wrap}button{font:inherit;padding:6px 10px;border:1px solid #ccc;border-radius:6px;background:#fff}input[type=range]{width:min(70vw,420px)}</style></head>
<body><div id="st"></div><div class="bar"><button id="pp">Pause</button><input id="sc" type="range" min="0" max="${anim.op - 1}" value="0"><span id="fr"></span></div>
<div class="bar">Speed <button data-s="0.5">0.5×</button><button data-s="1">1×</button> · Background <button data-b="checker">Checker</button><button data-b="#ffffff">Light</button><button data-b="#1b1b1b">Dark</button> · <label><input id="lp" type="checkbox" checked> Loop</label></div>
<div>${anim.w}×${anim.h} · ${anim.fr} fps · ${(anim.op / anim.fr).toFixed(2)} s</div>
<script>${esc(LOTTIE())}</script><script>
const a=lottie.loadAnimation({container:document.getElementById('st'),renderer:'svg',loop:true,autoplay:true,animationData:${JSON.stringify(anim)}});
const sc=document.getElementById('sc'),fr=document.getElementById('fr'),pp=document.getElementById('pp');
a.addEventListener('enterFrame',()=>{const f=Math.floor(a.currentFrame);sc.value=f;fr.textContent='f'+f+' · '+(f/${anim.fr}).toFixed(2)+'s';});
pp.onclick=()=>{a.isPaused?a.play():a.pause();pp.textContent=a.isPaused?'Play':'Pause';};
sc.oninput=()=>{a.goToAndStop(+sc.value,true);pp.textContent='Play';fr.textContent='f'+sc.value;};
document.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>a.setSpeed(+b.dataset.s));
document.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{document.getElementById('st').style.background=b.dataset.b==='checker'?'':b.dataset.b;});
document.getElementById('lp').onchange=e=>{a.loop=e.target.checked;if(e.target.checked&&a.isPaused)a.play();};
</script></body></html>`;
  fs.writeFileSync(file, html);
}

if (require.main === module) {
  const a = args();
  if (!a.anim) { console.error('usage: node lottie-check.cjs --anim anim.json [--motion motion.json | --frames 0,12] [--ref figma.png] [--rest last|first|N] [--bg checker|#hex] [--out sheet.png] [--preview page.html]'); process.exit(2); }
  const anim = require('./dotlottie.cjs').readAnim(fs, a.anim); // .json or .lottie
  const motion = a.motion ? JSON.parse(fs.readFileSync(a.motion, 'utf8')) : null;
  const loop = motion ? !!motion.loop : false;
  const frames = beatFrames(anim, motion, a.frames);
  const ref = a.ref ? `data:image/png;base64,${fs.readFileSync(a.ref).toString('base64')}` : '';
  const rest = a.rest || (loop ? 'first' : 'last');
  const cell = 220;
  const html = page({ anim, frames, ref, rest, bg: a.bg || 'checker', cell });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lottie-check-'));
  const file = path.join(tmp, 'check.html');
  fs.writeFileSync(file, html);
  const chrome = findChrome();
  const url = 'file:///' + file.replace(/\\/g, '/');
  const common = ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--virtual-time-budget=20000'];
  const dom = execFileSync(chrome, [...common, '--dump-dom', url], { encoding: 'utf8', maxBuffer: 64 << 20, timeout: 180000 });
  const m = dom.match(/RESULT(\{.*\})END/s);
  if (!m) { const e = dom.match(/ERROR(.*?)END/s); console.error(e ? `lottie-web failed: ${e[1].slice(0, 600)}` : 'lottie-web did not finish — the JSON may be invalid for the player'); process.exit(1); }
  const r = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
  if (a.out) {
    const sc = Math.min(1, cell / Math.max(anim.w, anim.h));
    const per = Math.max(Math.round(anim.w * sc) + 16, 120), cols = Math.max(1, Math.floor(1400 / (per + 8)));
    const n = frames.length + (ref ? 1 : 0), rows = Math.ceil(n / cols);
    const W = Math.min(1416, cols * (per + 8) + 16), H = rows * (Math.round(anim.h * sc) + 40) + 24;
    execFileSync(chrome, [...common, `--window-size=${W},${H}`, `--screenshot=${path.resolve(a.out)}`, url], { stdio: 'ignore', timeout: 180000 });
  }
  if (a.preview) preview(anim, a.preview);
  fs.rmSync(tmp, { recursive: true, force: true });

  // the verdict lines
  const lines = [];
  lines.push(`frames ${r.frames} @ ${r.fps} fps · ${r.size.join('×')} · sheet: ${frames.join(', ')}`);
  if (r.rest) lines.push(`${r.rest.mean <= 3 && r.rest.over40 <= 0.5 ? 'OK  ' : 'FAIL'} rest pose (f${r.restFrame}) vs Figma: mean Δ ${r.rest.mean}, ${r.rest.over40}% px > 40`);
  else lines.push('—    rest pose: no --ref given (export the frame and pass it)');
  if (loop && r.seam) lines.push(`${r.seam.ratio <= 2.5 ? 'OK  ' : 'FAIL'} loop seam: last → first = ${r.seam.mean} (${r.seam.ratio}× a normal step ${r.steps.median})`);
  const pop = r.steps.pops;
  lines.push(`${pop.length ? 'LOOK' : 'OK  '} pops: ${pop.length ? pop.map((b) => `f${b.frame} (${b.ratio}× its neighbours)`).join(', ') + ' — a hold that snaps, a missing key or a jump?' : 'none'}`);
  // an entrance may start from nothing and an exit may end in nothing — only an empty frame in the middle is a fault
  const E = new Set(r.empty); let lead = -1, tail = r.frames;
  while (E.has(lead + 1)) lead++;
  while (E.has(tail - 1)) tail--;
  const runs = r.empty.filter((f) => f > lead && f < tail);
  lines.push(`${runs.length ? 'FAIL' : 'OK  '} empty frames: ${r.empty.length ? r.empty.slice(0, 10).join(', ') + (runs.length ? ' — art vanishes mid-animation' : ' (starts / ends from nothing — an entrance or exit)') : 'none'}`);
  lines.push(`${r.edge.length ? 'LOOK' : 'OK  '} art touching the canvas edge: ${r.edge.length ? `${r.edge.length} frames (first f${r.edge[0]}) leave the canvas more than the rest pose — clipped in the app; give the frame room` : 'none'}`);
  if (a.out) lines.push(`sheet → ${path.resolve(a.out)}`);
  if (a.preview) lines.push(`preview → ${path.resolve(a.preview)}`);
  console.log(lines.join('\n'));
}
module.exports = { beatFrames };
