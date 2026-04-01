// ═══════════════════════════════════════════════════════════════════
// LHTC — COMPLETE ARCHITECTURAL FLOOR PLAN
// Left Wing · Central Block · Right Wing
// 2D Blueprint + Interactive 3D Model · Single file
// FIX v2: Scrollable layout, responsive canvas heights, no content cutoff
// ═══════════════════════════════════════════════════════════════════

import { useState, useRef, useEffect, useCallback } from "react";
import * as THREE from "three";

// ─── Shared Design Tokens ───────────────────────────────────────────
const FONT         = "'Share Tech Mono','Courier New',monospace";
const ROOM_EDGE_2D = "rgba(245,200,66,0.55)";
const ROOM_EDGE_3D = 0xf5c842;
const GOLD         = "#f5c842";
const AMBER        = "#ffcc66";

// ═══════════════════════════════════════════════════════════════════
// ████  WING A — LEFT SIDE
// ═══════════════════════════════════════════════════════════════════
const LA = { S:0.1 };
LA.TW = 1513 * LA.S; LA.TH = 624 * LA.S; LA.WT = 37 * LA.S; LA.WH = 4.0;

const LEFT_ROOMS = [
  { id:"hall",   lbl:"Main Hall\n74.63 m²",   x:LA.WT+14,    z:LA.WT,        w:LA.TW-LA.WT*2-14-17, d:LA.TH-LA.WT*2-16, c2:"rgba(245,200,122,0.13)", c3:0xcab890, sym:"hall"  },
  { id:"boys",   lbl:"Boys\nWashroom",         x:LA.WT,       z:0,            w:14,                  d:14,               c2:"rgba(184,216,240,0.18)", c3:0x8aaccf, sym:"wc"   },
  { id:"girls",  lbl:"Girls\nWashroom",        x:LA.WT,       z:14,           w:14,                  d:12,               c2:"rgba(160,184,240,0.18)", c3:0x8aaacf, sym:"wc"   },
  { id:"stairD", lbl:"Downstairs",             x:LA.WT+15,    z:0,            w:11,                  d:16,               c2:"rgba(138,172,207,0.20)", c3:0x8aaccf, sym:"stair"},
  { id:"stairU", lbl:"Stairs",                 x:LA.WT+27,    z:0,            w:11,                  d:16,               c2:"rgba(106,140,175,0.20)", c3:0x6a8caf, sym:"stair"},
  { id:"L107",   lbl:"L107",                   x:LA.TW/2-9,   z:0,            w:14,                  d:14,               c2:"rgba(255,224,160,0.14)", c3:0xffe0b0, sym:"lab"  },
  { id:"L106",   lbl:"L106",                   x:LA.TW/2+6,   z:0,            w:14,                  d:14,               c2:"rgba(255,224,160,0.14)", c3:0xffe0b0, sym:"lab"  },
  { id:"slope",  lbl:"Way to Maa\nSaraswati",  x:LA.TW-LA.WT-20, z:0,         w:18,                  d:10,               c2:"rgba(240,200,128,0.18)", c3:0xf0c880, sym:"slope"},
  { id:"east",   lbl:"East\nClassroom",        x:LA.TW-LA.WT-17, z:LA.WT+3,   w:17,                  d:LA.TH-LA.WT*2-13, c2:"rgba(255,224,160,0.14)", c3:0xfff0c0, sym:"class"},
  { id:"CR110",  lbl:"CR110",                  x:LA.WT,       z:LA.TH-LA.WT-22, w:12,               d:22,               c2:"rgba(255,224,160,0.14)", c3:0xfce8d0, sym:"class"},
  { id:"CR109",  lbl:"CR109",                  x:LA.WT+13,    z:LA.TH-LA.WT-20, w:12,               d:20,               c2:"rgba(250,232,224,0.14)", c3:0xf8e0c8, sym:"class"},
  { id:"CR108a", lbl:"CR108",                  x:LA.WT+26,    z:LA.TH-LA.WT-20, w:14,               d:20,               c2:"rgba(246,236,224,0.14)", c3:0xf4d8c0, sym:"class"},
  { id:"CR108b", lbl:"CR108",                  x:LA.WT+41,    z:LA.TH-LA.WT-20, w:14,               d:20,               c2:"rgba(242,232,220,0.14)", c3:0xf0d0b8, sym:"class"},
];

// ═══════════════════════════════════════════════════════════════════
// ████  WING B — CENTRAL BLOCK
// ═══════════════════════════════════════════════════════════════════
const CENTRAL_ROOMS_2D = [
  { x:17,z:0,  w:14,d:9,   fill:"rgba(245,200,122,0.12)" },
  { x:1, z:9,  w:8, d:6,   fill:"rgba(255,224,160,0.13)" },
  { x:9, z:9,  w:9, d:6,   fill:"rgba(255,224,160,0.13)" },
  { x:32,z:9,  w:10,d:5,   fill:"rgba(255,224,160,0.13)" },
  { x:32,z:14, w:10,d:4,   fill:"rgba(255,224,160,0.13)" },
  { x:44,z:9,  w:7, d:4.5, fill:"rgba(160,216,240,0.18)" },
  { x:51,z:9,  w:7, d:4.5, fill:"rgba(240,184,208,0.18)" },
  { x:52,z:0,  w:8, d:8.8, fill:"rgba(138,172,207,0.18)" },
  { x:0, z:15, w:18,d:13,  fill:"rgba(232,213,176,0.10)" },
  { x:18,z:11, w:14,d:17,  fill:"rgba(208,192,144,0.10)" },
  { x:28,z:15, w:5, d:6,   fill:"rgba(138,172,207,0.18)" },
  { x:18,z:20, w:10,d:8,   fill:"rgba(255,224,160,0.13)" },
  { x:32,z:11, w:28,d:17,  fill:"rgba(245,200,122,0.12)" },
  { x:60,z:0,  w:25,d:12,  fill:"rgba(245,200,122,0.12)" },
  { x:60,z:12, w:25,d:16,  fill:"rgba(255,224,160,0.13)" },
  { x:65,z:19, w:8, d:8,   fill:"rgba(160,224,160,0.15)" },
  { x:85,z:0,  w:5, d:28,  fill:"rgba(208,192,144,0.13)" },
  { x:86,z:5,  w:3, d:7,   fill:"rgba(138,172,207,0.18)" },
  { x:90,z:13, w:17,d:15,  fill:"rgba(245,200,122,0.12)" },
  { x:90,z:0,  w:20,d:13,  fill:"rgba(138,172,207,0.18)" },
];

// ═══════════════════════════════════════════════════════════════════
// ████  WING C — RIGHT SIDE
// ═══════════════════════════════════════════════════════════════════
const RL = {
  OW:140, OH:90,
  BW:5,   IW:0.5, WH:3.4,
  NW_X:5,  NW_Z:5,  NW_W:38, NW_H:42,
  NSTAIR_X:6, NSTAIR_Z:8, NSTAIR_W:10, NSTAIR_H:32,
  COR_TOP_Z:47,
  COR_X:5,  COR_Z:47, COR_W:130, COR_H:24,
  CSTAIR_X:46, CSTAIR_Z:49, CSTAIR_W:24, CSTAIR_H:20,
  BWC_X:96, BWC_Z:47, BWC_W:34, BWC_H:12,
  GWC_X:96, GWC_Z:59, GWC_W:34, GWC_H:12,
  L102_WALL_X:28, L102_WALL_Z:47, L102_WALL_W:18, L102_WALL_D:0.6,
  CR_Z:71, CR_H:19,
  CR104_X:5,   CR104_W:33,
  CR103_X:38,  CR103_W:26,
  CR102_X:64,  CR102_W:26,
  CR101_X:90,  CR101_W:45,
};

const RIGHT_ROOMS = [
  {id:"nw",   lbl:"UPSTAIRS\n18.39 m²",      x:RL.NW_X,    z:RL.NW_Z,  w:RL.NW_W,    d:RL.NW_H,  c2:"rgba(220,200,160,0.22)", c3:0xcab890, sym:"stair"},
  {id:"corr", lbl:"MAIN CORRIDOR\n74.16 m²",  x:RL.COR_X,   z:RL.COR_Z, w:RL.COR_W,   d:RL.COR_H, c2:"rgba(230,210,160,0.14)", c3:0xcab890, sym:"hall" },
  {id:"bwc",  lbl:"BOYS\nWASHROOM",           x:RL.BWC_X,   z:RL.BWC_Z, w:RL.BWC_W,   d:RL.BWC_H, c2:"rgba(180,210,235,0.22)", c3:0x8aaccf, sym:"wc"  },
  {id:"gwc",  lbl:"GIRLS\nWASHROOM",          x:RL.GWC_X,   z:RL.GWC_Z, w:RL.GWC_W,   d:RL.GWC_H, c2:"rgba(160,180,235,0.22)", c3:0x8aaacf, sym:"wc"  },
  {id:"cr104",lbl:"CR104",                    x:RL.CR104_X, z:RL.CR_Z,  w:RL.CR104_W, d:RL.CR_H,  c2:"rgba(240,215,150,0.20)", c3:0xfce8d0, sym:"class"},
  {id:"cr103",lbl:"CR103",                    x:RL.CR103_X, z:RL.CR_Z,  w:RL.CR103_W, d:RL.CR_H,  c2:"rgba(240,215,150,0.20)", c3:0xf8e0c8, sym:"class"},
  {id:"cr102",lbl:"CR102",                    x:RL.CR102_X, z:RL.CR_Z,  w:RL.CR102_W, d:RL.CR_H,  c2:"rgba(240,215,150,0.20)", c3:0xf4d8c0, sym:"class"},
  {id:"cr101",lbl:"CR101",                    x:RL.CR101_X, z:RL.CR_Z,  w:RL.CR101_W, d:RL.CR_H,  c2:"rgba(240,215,150,0.20)", c3:0xf0d0b8, sym:"class"},
];

// ═══════════════════════════════════════════════════════════════════
// ─── SHARED SYMBOL DRAWERS (2D canvas)
// ═══════════════════════════════════════════════════════════════════
function drawSymbol2D(ctx, sym, cx, cy, size, alpha=0.55) {
  ctx.save(); ctx.globalAlpha=alpha; ctx.translate(cx,cy);
  if(sym==="class"){
    const dw=size*1.1,dh=size*0.55;
    ctx.strokeStyle="#ffe0a0"; ctx.lineWidth=1.1;
    ctx.strokeRect(-dw/2,-dh/2,dw,dh);
    ctx.beginPath();ctx.arc(-dw*0.25,dh/2+size*0.28,size*0.22,0,Math.PI);ctx.stroke();
    ctx.beginPath();ctx.arc(dw*0.25,dh/2+size*0.28,size*0.22,0,Math.PI);ctx.stroke();
    ctx.fillStyle="#ffe0a0";ctx.fillRect(-size*0.25,-dh*0.3,size*0.5,dh*0.55);
    ctx.strokeRect(-size*0.25,-dh*0.3,size*0.5,dh*0.55);
    ctx.lineWidth=0.7;[-0.08,0,0.08].forEach(dy=>{ctx.beginPath();ctx.moveTo(-size*0.18,dy*size/0.3);ctx.lineTo(size*0.18,dy*size/0.3);ctx.stroke();});
  } else if(sym==="lab"){
    const mw=size*1.1,mh=size*0.75;
    ctx.strokeStyle="#ffe0a0";ctx.lineWidth=1.2;
    ctx.strokeRect(-mw/2,-mh/2-size*0.08,mw,mh);
    ctx.strokeStyle="rgba(255,224,160,0.5)";ctx.lineWidth=0.7;
    ctx.strokeRect(-mw*0.38,-mh*0.44-size*0.08,mw*0.76,mh*0.72);
    ctx.strokeStyle="#ffe0a0";ctx.lineWidth=1.2;
    ctx.beginPath();ctx.moveTo(0,mh/2-size*0.08);ctx.lineTo(0,mh/2+size*0.18);ctx.stroke();
    ctx.strokeRect(-mw*0.42,mh/2+size*0.15,mw*0.84,size*0.22);
  } else if(sym==="hall"){
    ctx.strokeStyle=GOLD;ctx.fillStyle=GOLD;ctx.lineWidth=1;
    [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([dx,dz])=>{ctx.beginPath();ctx.arc(dx*size*0.55,dz*size*0.55,size*0.1,0,Math.PI*2);ctx.fill();});
    ctx.lineWidth=1.4;
    for(let a=0;a<6;a++){const ang=(a/6)*Math.PI;ctx.beginPath();ctx.moveTo(Math.cos(ang)*size*0.28,Math.sin(ang)*size*0.28);ctx.lineTo(-Math.cos(ang)*size*0.28,-Math.sin(ang)*size*0.28);ctx.stroke();}
  } else if(sym==="wc"){
    ctx.strokeStyle="#a0d8ef";ctx.fillStyle="rgba(160,216,239,0.7)";ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(0,-size*0.45,size*0.18,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(-size*0.18,-size*0.22);ctx.lineTo(-size*0.22,size*0.1);ctx.lineTo(-size*0.1,size*0.1);ctx.lineTo(0,-size*0.05);ctx.lineTo(size*0.1,size*0.1);ctx.lineTo(size*0.22,size*0.1);ctx.lineTo(size*0.18,-size*0.22);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(-size*0.1,size*0.1);ctx.lineTo(-size*0.14,size*0.45);ctx.stroke();
    ctx.beginPath();ctx.moveTo(size*0.1,size*0.1);ctx.lineTo(size*0.14,size*0.45);ctx.stroke();
  } else if(sym==="stair"){
    ctx.strokeStyle="#a0cfef";ctx.lineWidth=1.1;
    const sw=size*0.9,sh=size*0.85,steps=5;
    for(let i=0;i<steps;i++){ctx.strokeRect(-sw/2+(i/steps)*sw,-sh/2+(i/(steps-1))*sh,sw*(1/steps),sh*(1/steps));}
    ctx.fillStyle="#a0cfef";ctx.lineWidth=1.3;
    ctx.beginPath();ctx.moveTo(-sw*0.1,-sh*0.38);ctx.lineTo(-sw*0.1,sh*0.38);ctx.moveTo(-sw*0.3,sh*0.15);ctx.lineTo(-sw*0.1,sh*0.38);ctx.lineTo(sw*0.1,sh*0.15);ctx.stroke();
  } else if(sym==="slope"){
    ctx.strokeStyle=GOLD;ctx.lineWidth=1;
    const sw=size*0.9,sh=size*0.7;
    ctx.beginPath();for(let i=-3;i<=3;i++){const off=i*(sw*0.28);ctx.moveTo(-sw*0.5+off,sh*0.45);ctx.lineTo(sw*0.5+off,-sh*0.45);}ctx.stroke();
    ctx.lineWidth=1.3;ctx.strokeRect(-sw/2,-sh/2,sw,sh);
    ctx.fillStyle=GOLD;ctx.lineWidth=1.6;
    ctx.beginPath();ctx.moveTo(0,-sh*0.35);ctx.lineTo(0,sh*0.4);ctx.stroke();
    ctx.beginPath();ctx.moveTo(-size*0.18,-sh*0.2);ctx.lineTo(0,-sh*0.42);ctx.lineTo(size*0.18,-sh*0.2);ctx.fill();
  }
  ctx.restore();
}

function makeSymbolCanvas(sym, color="#ffe0a0") {
  const c=document.createElement("canvas");c.width=128;c.height=128;
  const ctx=c.getContext("2d");const cx=64,cy=64,sz=42;
  ctx.clearRect(0,0,128,128);
  if(sym==="class"){
    ctx.strokeStyle=color;ctx.lineWidth=4;
    ctx.strokeRect(cx-sz*0.55,cy-sz*0.28,sz*1.1,sz*0.56);
    ctx.beginPath();ctx.arc(cx-sz*0.22,cy+sz*0.42,sz*0.2,0,Math.PI);ctx.stroke();
    ctx.beginPath();ctx.arc(cx+sz*0.22,cy+sz*0.42,sz*0.2,0,Math.PI);ctx.stroke();
    ctx.fillStyle=color;ctx.globalAlpha=0.8;
    ctx.fillRect(cx-sz*0.22,cy-sz*0.22,sz*0.44,sz*0.44);ctx.globalAlpha=1;
    ctx.strokeStyle=color;ctx.lineWidth=2.5;ctx.strokeRect(cx-sz*0.22,cy-sz*0.22,sz*0.44,sz*0.44);
    [-0.06,0.06].forEach(dy=>{ctx.beginPath();ctx.moveTo(cx-sz*0.15,cy+dy*sz);ctx.lineTo(cx+sz*0.15,cy+dy*sz);ctx.stroke();});
  } else if(sym==="lab"){
    ctx.strokeStyle=color;ctx.lineWidth=4;
    ctx.strokeRect(cx-sz*0.55,cy-sz*0.45,sz*1.1,sz*0.75);
    ctx.strokeRect(cx-sz*0.4,cy-sz*0.35,sz*0.8,sz*0.55);
    ctx.beginPath();ctx.moveTo(cx,cy+sz*0.3);ctx.lineTo(cx,cy+sz*0.55);ctx.stroke();
    ctx.strokeRect(cx-sz*0.42,cy+sz*0.52,sz*0.84,sz*0.22);
  } else if(sym==="hall"){
    ctx.strokeStyle="#f5c842";ctx.lineWidth=5;
    for(let a=0;a<6;a++){const ang=(a/6)*Math.PI;ctx.beginPath();ctx.moveTo(cx+Math.cos(ang)*sz*0.35,cy+Math.sin(ang)*sz*0.35);ctx.lineTo(cx-Math.cos(ang)*sz*0.35,cy-Math.sin(ang)*sz*0.35);ctx.stroke();}
    ctx.fillStyle="#f5c842";
    [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([dx,dz])=>{ctx.beginPath();ctx.arc(cx+dx*sz*0.72,cy+dz*sz*0.72,6,0,Math.PI*2);ctx.fill();});
  } else if(sym==="wc"){
    ctx.fillStyle="#a0d8ef";ctx.strokeStyle="#a0d8ef";ctx.lineWidth=3;
    ctx.beginPath();ctx.arc(cx,cy-sz*0.55,sz*0.2,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.moveTo(cx-sz*0.2,cy-sz*0.3);ctx.lineTo(cx-sz*0.26,cy+sz*0.12);ctx.lineTo(cx-sz*0.12,cy+sz*0.12);ctx.lineTo(cx,cy-sz*0.06);ctx.lineTo(cx+sz*0.12,cy+sz*0.12);ctx.lineTo(cx+sz*0.26,cy+sz*0.12);ctx.lineTo(cx+sz*0.2,cy-sz*0.3);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(cx-sz*0.12,cy+sz*0.12);ctx.lineTo(cx-sz*0.18,cy+sz*0.56);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx+sz*0.12,cy+sz*0.12);ctx.lineTo(cx+sz*0.18,cy+sz*0.56);ctx.stroke();
  } else if(sym==="stair"){
    ctx.strokeStyle="#a0cfef";ctx.lineWidth=4;
    const steps=5;
    for(let i=0;i<steps;i++){ctx.strokeRect(cx-sz*0.55+(i/steps)*sz*1.1,cy-sz*0.5+(i/(steps-1))*sz,sz*1.1/steps,sz/(steps-1));}
    ctx.fillStyle="#a0cfef";ctx.lineWidth=4;
    ctx.beginPath();ctx.moveTo(cx,cy-sz*0.45);ctx.lineTo(cx,cy+sz*0.5);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx-sz*0.22,cy+sz*0.2);ctx.lineTo(cx,cy+sz*0.55);ctx.lineTo(cx+sz*0.22,cy+sz*0.2);ctx.fill();
  } else if(sym==="slope"){
    ctx.strokeStyle="#f5c842";ctx.lineWidth=3;
    ctx.strokeRect(cx-sz*0.55,cy-sz*0.45,sz*1.1,sz*0.9);
    ctx.lineWidth=2;
    for(let i=-3;i<=3;i++){const off=i*(sz*0.36);ctx.beginPath();ctx.moveTo(cx-sz*0.5+off,cy+sz*0.42);ctx.lineTo(cx+sz*0.5+off,cy-sz*0.42);ctx.stroke();}
    ctx.fillStyle="#f5c842";ctx.lineWidth=4;
    ctx.beginPath();ctx.moveTo(cx,cy-sz*0.38);ctx.lineTo(cx,cy+sz*0.45);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx-sz*0.22,cy-sz*0.18);ctx.lineTo(cx,cy-sz*0.52);ctx.lineTo(cx+sz*0.22,cy-sz*0.18);ctx.fill();
  }
  return c;
}

function makeLabel3D(scene, text, cx, y, cz, maxW, maxD, color="#fff8e0") {
  const lines=text.split("\n");
  const longest=lines.reduce((a,b)=>b.length>a.length?b:a,"");
  const fitW=(maxW*0.55)/(longest.length*0.54);
  const fitD=(maxD*0.55)/(lines.length*1.35);
  const worldSize=Math.min(fitW,fitD,3.5);
  const pxPerUnit=34;
  const cw=Math.max(Math.round(longest.length*pxPerUnit*0.58),90);
  const ch=Math.max(Math.round(lines.length*pxPerUnit*1.5),48);
  const c=document.createElement("canvas");c.width=cw;c.height=ch;
  const ctx2=c.getContext("2d");
  ctx2.fillStyle="rgba(13,17,23,0.90)";
  const rx2=Math.min(ch*0.22,10);
  if(ctx2.roundRect){ctx2.beginPath();ctx2.roundRect(1,1,cw-2,ch-2,rx2);ctx2.fill();}
  else{ctx2.fillRect(1,1,cw-2,ch-2);}
  ctx2.strokeStyle="rgba(245,200,66,0.75)";ctx2.lineWidth=2.2;
  if(ctx2.roundRect){ctx2.beginPath();ctx2.roundRect(1,1,cw-2,ch-2,rx2);ctx2.stroke();}
  else{ctx2.strokeRect(1,1,cw-2,ch-2);}
  ctx2.fillStyle=color;
  const fs=Math.round(ch/(lines.length*1.55));
  ctx2.font=`700 ${fs}px ${FONT}`;ctx2.textAlign="center";ctx2.textBaseline="middle";
  ctx2.shadowColor="rgba(0,0,0,0.9)";ctx2.shadowBlur=3;
  lines.forEach((ln,i)=>ctx2.fillText(ln,cw/2,ch/2+(i-(lines.length-1)/2)*(fs*1.28)));
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false}));
  sp.scale.set(worldSize,worldSize*(ch/cw),1);
  sp.position.set(cx,y,cz);
  scene.add(sp);
}

// ═══════════════════════════════════════════════════════════════════
// ████  RESPONSIVE CANVAS HOOK
// ═══════════════════════════════════════════════════════════════════
// Draws to canvas only after the container has real dimensions
function useResponsiveCanvas(drawFn) {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    if (!container || !canvas) return;

    const draw = () => {
      const W = container.clientWidth;
      const H = container.clientHeight;
      if (!W || !H) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = W + "px";
      canvas.style.height = H + "px";
      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
      drawFn(ctx, W, H);
    };

    // Draw immediately
    draw();

    // Also draw on resize
    const ro = new ResizeObserver(() => draw());
    ro.observe(container);
    return () => ro.disconnect();
  }, [drawFn]);

  return { containerRef, canvasRef };
}

// ═══════════════════════════════════════════════════════════════════
// ████  2D BLUEPRINTS
// ═══════════════════════════════════════════════════════════════════

function LeftBlueprint2D() {
  const drawFn = useCallback((ctx, W, H) => {
    const PAD=52;
    const sx=(W-PAD*2)/LA.TW, sy=(H-PAD*2)/LA.TH;
    const tx=x=>PAD+x*sx, tz=z=>PAD+z*sy;
    ctx.fillStyle="#0d1117";ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="rgba(74,55,40,0.25)";ctx.lineWidth=0.4;
    for(let x=0;x<=LA.TW;x+=5){ctx.beginPath();ctx.moveTo(tx(x),PAD);ctx.lineTo(tx(x),H-PAD);ctx.stroke();}
    for(let z=0;z<=LA.TH;z+=5){ctx.beginPath();ctx.moveTo(PAD,tz(z));ctx.lineTo(W-PAD,tz(z));ctx.stroke();}
    ctx.fillStyle="#1a1008";ctx.fillRect(tx(0),tz(0),LA.TW*sx,LA.TH*sy);
    LEFT_ROOMS.forEach(r=>{ctx.fillStyle=r.c2;ctx.fillRect(tx(r.x),tz(r.z),r.w*sx,r.d*sy);});
    ctx.save();
    LEFT_ROOMS.forEach(r=>{
      const inset=1.5,rx=tx(r.x)+inset,rz=tz(r.z)+inset,rw=r.w*sx-inset*2,rd=r.d*sy-inset*2;
      ctx.strokeStyle="rgba(92,61,42,0.9)";ctx.lineWidth=3.5;ctx.strokeRect(rx,rz,rw,rd);
      ctx.strokeStyle=ROOM_EDGE_2D;ctx.lineWidth=1.4;ctx.setLineDash([5,3]);
      ctx.strokeRect(rx+2,rz+2,rw-4,rd-4);ctx.setLineDash([]);
    });
    ctx.restore();
    ctx.strokeStyle="#7a5c3c";ctx.lineWidth=1.6;
    [[LA.WT+14,0,LA.WT+14,28],[LA.WT,14,LA.WT+14,14],[LA.WT+15,16,LA.WT+39,16],
     [LA.TW/2-9,14,LA.TW/2+21,14],[LA.TW/2+5,0,LA.TW/2+5,14],
     [LA.TW-LA.WT-17,LA.WT,LA.TW-LA.WT-17,LA.TH-LA.WT],
     [LA.WT,LA.TH-LA.WT-20,LA.TW-LA.WT-17,LA.TH-LA.WT-20],
     [LA.WT+13,LA.TH-LA.WT-20,LA.WT+13,LA.TH-LA.WT],
     [LA.WT+26,LA.TH-LA.WT-20,LA.WT+26,LA.TH-LA.WT],
     [LA.WT+41,LA.TH-LA.WT-20,LA.WT+41,LA.TH-LA.WT]
    ].forEach(([x1,z1,x2,z2])=>{ctx.beginPath();ctx.moveTo(tx(x1),tz(z1));ctx.lineTo(tx(x2),tz(z2));ctx.stroke();});
    LEFT_ROOMS.forEach(r=>{
      if(!r.sym)return;
      const cx2=tx(r.x)+(r.w*sx)*0.5;
      const lines=r.lbl.split("\n");const longest=lines.reduce((a,b)=>b.length>a.length?b:a,"");
      const fs=Math.max(Math.min((r.w*sx)/(longest.length*0.65),(r.d*sy)/(lines.length*1.6),11),7);
      const labelH=lines.length*(fs+2),availH=r.d*sy-labelH-6;
      const symSize=Math.min(availH*0.52,r.w*sx*0.28,14);
      if(symSize<4)return;
      drawSymbol2D(ctx,r.sym,cx2,tz(r.z)+(r.d*sy)*0.28,symSize,0.6);
    });
    const owt=LA.WT*sx*1.4;ctx.strokeStyle="#5c3d2a";ctx.lineWidth=owt;
    ctx.strokeRect(tx(0)+owt/2,tz(0)+owt/2,LA.TW*sx-owt,LA.TH*sy-owt);
    LEFT_ROOMS.forEach(r=>{
      const lines=r.lbl.split("\n");const longest=lines.reduce((a,b)=>b.length>a.length?b:a,"");
      const fs=Math.max(Math.min((r.w*sx)/(longest.length*0.65),(r.d*sy)/(lines.length*1.6),11),7);
      ctx.font=`700 ${fs}px ${FONT}`;
      ctx.fillStyle=r.id==="boys"?"#a0d8ef":r.id==="girls"?"#f0b8d0":r.id==="stairD"||r.id==="stairU"?"#a0cfef":r.id==="hall"||r.id==="slope"?GOLD:"#ffe0a0";
      ctx.textAlign="center";ctx.textBaseline="middle";ctx.shadowColor="rgba(0,0,0,0.95)";ctx.shadowBlur=3;
      const cx2=tx(r.x)+(r.w*sx)/2;const labelY=tz(r.z)+r.d*sy*0.68;
      lines.forEach((ln,i)=>ctx.fillText(ln,cx2,labelY+(i-(lines.length-1)/2)*(fs+1.8)));ctx.shadowBlur=0;
    });
    const cpx=W-30,cpy=30;
    ctx.fillStyle="#e74c3c";ctx.beginPath();ctx.moveTo(cpx,cpy-13);ctx.lineTo(cpx+5,cpy+6);ctx.lineTo(cpx-5,cpy+6);ctx.closePath();ctx.fill();
    ctx.fillStyle="#555";ctx.beginPath();ctx.moveTo(cpx,cpy+13);ctx.lineTo(cpx+5,cpy-6);ctx.lineTo(cpx-5,cpy-6);ctx.closePath();ctx.fill();
    ctx.fillStyle=GOLD;ctx.font="bold 10px sans-serif";ctx.textAlign="center";ctx.fillText("N",cpx,cpy-17);
  }, []);

  const { containerRef, canvasRef } = useResponsiveCanvas(drawFn);
  return (
    <div ref={containerRef} style={{ width:"100%", height:"48%" }}>
      <canvas ref={canvasRef} style={{ display:"block", borderRadius:8 }}/>
    </div>
  );
}

function CentralBlueprint2D() {
  const drawFn = useCallback((ctx, W, H) => {
    const PAD=52,TW=110,TH=28;
    const sx=(W-PAD*2)/TW,sy=(H-PAD*2)/TH;
    const tx=x=>PAD+x*sx,tz=z=>PAD+z*sy;
    ctx.fillStyle="#0d1117";ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="rgba(74,55,40,0.3)";ctx.lineWidth=0.4;
    for(let x=0;x<=TW;x+=2){ctx.beginPath();ctx.moveTo(tx(x),PAD);ctx.lineTo(tx(x),H-PAD);ctx.stroke();}
    for(let z=0;z<=TH;z+=2){ctx.beginPath();ctx.moveTo(PAD,tz(z));ctx.lineTo(W-PAD,tz(z));ctx.stroke();}
    ctx.fillStyle="#1a1008";ctx.fillRect(tx(0),tz(0),TW*sx,TH*sy);
    CENTRAL_ROOMS_2D.forEach(r=>{ctx.fillStyle=r.fill;ctx.fillRect(tx(r.x),tz(r.z),r.w*sx,r.d*sy);});
    ctx.save();ctx.strokeStyle=ROOM_EDGE_2D;ctx.lineWidth=1.6;ctx.setLineDash([5,3]);
    CENTRAL_ROOMS_2D.forEach(r=>{ctx.strokeRect(tx(r.x)+1,tz(r.z)+1,r.w*sx-2,r.d*sy-2);});
    ctx.setLineDash([]);ctx.restore();
    const owall=(x1,z1,x2,z2)=>{const cx=(x1+x2)/2,cz=(z1+z2)/2,dw=Math.abs(x2-x1)||0.5,dh=Math.abs(z2-z1)||0.5;ctx.fillStyle="#5c3d2a";ctx.fillRect(tx(cx-dw/2),tz(cz-dh/2),dw*sx,dh*sy);};
    owall(0,0,110,0.5);owall(0,27.5,110,28);owall(0,0,0.5,28);owall(59.5,0,60,28);owall(109.5,0,110,28);
    const roomLabel=(text,cx,cz,maxW,maxD,col=GOLD)=>{const lines=text.split("\n"),longest=lines.reduce((a,b)=>b.length>a.length?b:a,"");const fs=Math.max(Math.min((maxW*sx)/(longest.length*0.62),(maxD*sy)/(lines.length*1.55),12),6.5);ctx.font=`700 ${fs}px ${FONT}`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.shadowColor="rgba(0,0,0,0.9)";ctx.shadowBlur=3;lines.forEach((ln,i)=>{ctx.fillStyle=col;ctx.fillText(ln,tx(cx),tz(cz)+(i-(lines.length-1)/2)*(fs+2));});ctx.shadowBlur=0;};
    const navLabel=(text,cx,cz)=>{const lines=text.split("\n"),fs=7;ctx.font=`600 ${fs}px ${FONT}`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.shadowColor="rgba(0,0,0,0.9)";ctx.shadowBlur=2;lines.forEach((ln,i)=>{ctx.fillStyle=AMBER;ctx.fillText(ln,tx(cx),tz(cz)+(i-(lines.length-1)/2)*(fs+1.5));});ctx.shadowBlur=0;};
    roomLabel("Room\n12.26 m²",24,4.5,13,8);roomLabel("Maths Lab",5,12,7.5,5.5,"#ffe0a0");
    roomLabel("Dr. LKB & Dr. AKK\nCabin",13.5,12,8.5,5.5,"#ffe0a0");
    roomLabel("Dr.BG",37,11.5,9.5,4.5,"#ffe0a0");roomLabel("Dr. SSL\nCabin",37,16,9.5,3.5,"#ffe0a0");
    roomLabel("Male\nWashroom",47.5,11,5.5,3,"#a0d8ef");roomLabel("Female\nWashroom",54.5,11,5.5,3,"#f0b8d0");
    roomLabel("Upstairs",56,4.5,6.5,7,"#a0cfef");roomLabel("Storage /\nRoom",9,21.5,16,11,"#e8d5b0");
    roomLabel("Corridor",25,19,12,5,"#d0c090");roomLabel("Way to\n1F",30.5,18,4,5,"#a0cfef");
    roomLabel("L105",23,24,9,7,"#ffe0a0");
    roomLabel("L104\n151.82 m²",46,19.5,26,15);navLabel("Way to Exit",24,-1);navLabel("Entry",24,28.5);navLabel("L104 Back",62.5,19.5);
    roomLabel("Lecture Hall\n44.16 m²",72.5,5.5,23,10);roomLabel("L103",72.5,20,22,13,"#ffe0a0");roomLabel("Green Room",69,23,7,7,"#a0e0a0");
    roomLabel("Corridor",87.5,14,4,26,"#d0c090");roomLabel("PDES\n38.21 m²",98.5,20,15,13);roomLabel("Upstairs\n35.94 m²",100,6.5,18,11,"#a0cfef");
    navLabel("Entry",75,29);navLabel("L103 ←",58,15);navLabel("Entry ↓",98.5,29);navLabel("Mess →",100,-1);
    const cpx=W-36,cpy=72;
    ctx.fillStyle="#e74c3c";ctx.beginPath();ctx.moveTo(cpx,cpy-14);ctx.lineTo(cpx+5,cpy+6);ctx.lineTo(cpx-5,cpy+6);ctx.closePath();ctx.fill();
    ctx.fillStyle="#3a3a3a";ctx.beginPath();ctx.moveTo(cpx,cpy+14);ctx.lineTo(cpx+5,cpy-6);ctx.lineTo(cpx-5,cpy-6);ctx.closePath();ctx.fill();
    ctx.fillStyle=GOLD;ctx.font="bold 11px monospace";ctx.textAlign="center";ctx.fillText("N",cpx,cpy-20);
    ctx.fillStyle="#27ae60";ctx.font=`bold 9px ${FONT}`;ctx.textAlign="center";ctx.fillText("110 m",W/2,15);
    ctx.save();ctx.translate(14,H/2);ctx.rotate(-Math.PI/2);ctx.fillText("28 m",0,0);ctx.restore();
  }, []);

  const { containerRef, canvasRef } = useResponsiveCanvas(drawFn);
  return (
    <div ref={containerRef} style={{ width:"90%", height:"48%" }}>
      <canvas ref={canvasRef} style={{ display:"block" }}/>
    </div>
  );
}

function RightBlueprint2D() {
  const drawFn = useCallback((ctx, W, H) => {
    const PAD=48;
    const sc=Math.min((W-PAD*2)/RL.OW,(H-PAD*2)/RL.OH);
    const offX=PAD+((W-PAD*2)-RL.OW*sc)*0.5;
    const offZ=PAD+((H-PAD*2)-RL.OH*sc)*0.5;
    const tx=x=>offX+x*sc;
    const tz=z=>offZ+z*sc;
    const BW=RL.BW;
    ctx.fillStyle="#0d1117";ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="rgba(74,55,40,0.20)";ctx.lineWidth=0.4;
    for(let x=0;x<=RL.OW;x+=5){ctx.beginPath();ctx.moveTo(tx(x),offZ);ctx.lineTo(tx(x),offZ+RL.OH*sc);ctx.stroke();}
    for(let z=0;z<=RL.OH;z+=5){ctx.beginPath();ctx.moveTo(offX,tz(z));ctx.lineTo(offX+RL.OW*sc,tz(z));ctx.stroke();}
    ctx.fillStyle="#1a1008";ctx.fillRect(tx(0),tz(0),RL.OW*sc,RL.OH*sc);
    ctx.fillStyle="#2a1e0e";
    ctx.fillRect(tx(0),tz(0),(RL.NW_X+RL.NW_W)*sc,RL.COR_TOP_Z*sc);
    ctx.fillRect(tx(0),tz(RL.COR_TOP_Z),RL.OW*sc,(RL.OH-RL.COR_TOP_Z)*sc);
    RIGHT_ROOMS.forEach(r=>{ctx.fillStyle=r.c2;ctx.fillRect(tx(r.x),tz(r.z),r.w*sc,r.d*sc);});
    ctx.save();ctx.strokeStyle=ROOM_EDGE_2D;ctx.lineWidth=1.4;ctx.setLineDash([5,3]);
    RIGHT_ROOMS.forEach(r=>{ctx.strokeRect(tx(r.x)+1,tz(r.z)+1,r.w*sc-2,r.d*sc-2);});
    ctx.setLineDash([]);ctx.restore();
    {
      const sx2=tx(RL.NSTAIR_X),sz2=tz(RL.NSTAIR_Z);
      const sw=RL.NSTAIR_W*sc,sh=RL.NSTAIR_H*sc;
      ctx.fillStyle="rgba(138,172,207,0.25)";ctx.fillRect(sx2,sz2,sw,sh);
      ctx.strokeStyle="#8aaccf";ctx.lineWidth=0.7;
      for(let i=0;i<=12;i++){const rz=sz2+sh*(i/12);ctx.beginPath();ctx.moveTo(sx2,rz);ctx.lineTo(sx2+sw,rz);ctx.stroke();}
    }
    ctx.fillStyle="#5c3d2a";
    ctx.fillRect(tx(0),tz(0),RL.OW*sc,BW*sc);
    ctx.fillRect(tx(0),tz(RL.OH-BW),RL.OW*sc,BW*sc);
    ctx.fillRect(tx(0),tz(0),BW*sc,RL.OH*sc);
    ctx.fillRect(tx(RL.OW-BW),tz(0),BW*sc,RL.OH*sc);
    ctx.fillRect(tx(RL.NW_X+RL.NW_W),tz(0),BW*sc,RL.COR_TOP_Z*sc);
    ctx.fillRect(tx(0),tz(RL.COR_TOP_Z-BW),RL.L102_WALL_X*sc,BW*sc);
    ctx.fillRect(tx(RL.L102_WALL_X+RL.L102_WALL_W),tz(RL.COR_TOP_Z-BW),(RL.CSTAIR_X-2-RL.L102_WALL_X-RL.L102_WALL_W)*sc,BW*sc);
    ctx.fillRect(tx(RL.CSTAIR_X+RL.CSTAIR_W+2),tz(RL.COR_TOP_Z-BW),(RL.OW-RL.CSTAIR_X-RL.CSTAIR_W-2)*sc,BW*sc);
    ctx.fillStyle="#7a5c3c";
    const ip=0.6;
    ctx.fillRect(tx(RL.BWC_X),tz(RL.BWC_Z+RL.BWC_H),RL.BWC_W*sc,ip*sc);
    ctx.fillRect(tx(RL.BWC_X),tz(RL.COR_TOP_Z),ip*sc,(RL.CR_Z-RL.COR_TOP_Z)*sc);
    [RL.CR104_X+RL.CR104_W,RL.CR103_X+RL.CR103_W,RL.CR102_X+RL.CR102_W].forEach(cx2=>{ctx.fillRect(tx(cx2),tz(RL.CR_Z),ip*sc,RL.CR_H*sc);});
    ctx.fillRect(tx(BW),tz(RL.CR_Z),(RL.OW-BW*2)*sc,ip*sc);
    RIGHT_ROOMS.forEach(r=>{
      if(!r.sym)return;
      const rcx=tx(r.x)+r.w*sc*0.5;
      const rcy=tz(r.z)+r.d*sc*0.30;
      const symSize=Math.min(r.w*sc*0.16,r.d*sc*0.22,18);
      if(symSize<5)return;
      drawSymbol2D(ctx,r.sym,rcx,rcy,symSize,0.55);
    });
    RIGHT_ROOMS.forEach(r=>{
      const lines=r.lbl.split("\n");
      const longest=lines.reduce((a,b)=>b.length>a.length?b:a,"");
      const availW=r.w*sc*0.82,availH=r.d*sc*0.40;
      const fs=Math.max(Math.min(availW/(longest.length*0.58),availH/(lines.length*1.55),13),6.5);
      const col=r.id==="bwc"||r.id==="gwc"?"#a0d8ef":r.id==="corr"?GOLD:r.id==="nw"?"#a0cfef":"#ffe0a0";
      ctx.font=`bold ${fs}px ${FONT}`;ctx.fillStyle=col;ctx.textAlign="center";ctx.textBaseline="middle";
      ctx.shadowColor="rgba(0,0,0,0.95)";ctx.shadowBlur=3;
      const rcx=tx(r.x)+r.w*sc/2;
      const labelY=tz(r.z)+r.d*sc*0.72;
      lines.forEach((ln,i)=>{ctx.fillText(ln,rcx,labelY+(i-(lines.length-1)/2)*(fs*1.55));});
      ctx.shadowBlur=0;
    });
    function callout(text,cx,cy){
      const fs=Math.max(Math.min(sc*1.2,10),7);
      ctx.save();ctx.font=`bold ${fs}px ${FONT}`;ctx.textAlign="center";ctx.textBaseline="middle";
      const tw2=ctx.measureText(text).width+6;
      ctx.fillStyle="rgba(13,17,23,0.85)";ctx.fillRect(cx-tw2/2,cy-fs/2-3,tw2,fs+6);
      ctx.strokeStyle="rgba(245,200,66,0.5)";ctx.lineWidth=0.8;ctx.strokeRect(cx-tw2/2,cy-fs/2-3,tw2,fs+6);
      ctx.fillStyle=AMBER;ctx.shadowColor="rgba(0,0,0,0.9)";ctx.shadowBlur=2;ctx.fillText(text,cx,cy);ctx.restore();
    }
    callout("Mess Slope ↑",tx(RL.NW_X+RL.NW_W/2),tz(RL.NW_Z)-14);
    callout("L102 Entry",tx(RL.L102_WALL_X+RL.L102_WALL_W/2),tz(RL.COR_TOP_Z-BW)-12);
    callout("→ CSE Block",tx(RL.OW-BW)-2,tz(RL.COR_Z+RL.COR_H/2));
    ctx.strokeStyle="rgba(39,174,96,0.55)";ctx.lineWidth=0.7;ctx.setLineDash([4,3]);
    ctx.beginPath();ctx.moveTo(tx(0),tz(0)-18);ctx.lineTo(tx(RL.OW),tz(0)-18);ctx.stroke();
    ctx.beginPath();ctx.moveTo(tx(0)-18,tz(0));ctx.lineTo(tx(0)-18,tz(RL.OH));ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle="#27ae60";ctx.font=`bold 9px ${FONT}`;ctx.textAlign="center";ctx.textBaseline="middle";
    ctx.fillText(`${RL.OW} m`,tx(RL.OW/2),tz(0)-18);
    ctx.save();ctx.translate(tx(0)-18,tz(RL.OH/2));ctx.rotate(-Math.PI/2);ctx.fillText(`${RL.OH} m`,0,0);ctx.restore();
    const cpx=W-32,cpy=32;
    ctx.fillStyle="#cc2211";ctx.beginPath();ctx.moveTo(cpx,cpy-14);ctx.lineTo(cpx+5,cpy+4);ctx.lineTo(cpx-5,cpy+4);ctx.closePath();ctx.fill();
    ctx.fillStyle="#555";ctx.beginPath();ctx.moveTo(cpx,cpy+14);ctx.lineTo(cpx+5,cpy-4);ctx.lineTo(cpx-5,cpy-4);ctx.closePath();ctx.fill();
    ctx.fillStyle=GOLD;ctx.font="bold 11px sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("N",cpx,cpy-19);
  }, []);

  const { containerRef, canvasRef } = useResponsiveCanvas(drawFn);
  return (
    <div ref={containerRef} style={{ width:"100%", height:"48%" }}>
      <canvas ref={canvasRef} style={{ display:"block", borderRadius:8 }}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ████  3D SCENES (unchanged from original — only layout wrappers change)
// ═══════════════════════════════════════════════════════════════════

function LeftScene3D() {
  const mountRef=useRef(null);
  useEffect(()=>{
    const el=mountRef.current;if(!el)return;
    const CW=el.clientWidth||800,CH=el.clientHeight||500;
    const renderer=new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(CW,CH);renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x0d1117,1);el.appendChild(renderer.domElement);
    const scene=new THREE.Scene();scene.background=new THREE.Color(0x0d1117);scene.fog=new THREE.Fog(0x0d1117,130,280);
    const camera=new THREE.PerspectiveCamera(42,CW/CH,0.5,500);
    let theta=-0.4,phi=0.68,radius=90;const target=new THREE.Vector3(LA.TW/2,0,LA.TH/2);
    function updateCamera(){camera.position.set(target.x+radius*Math.sin(phi)*Math.sin(theta),target.y+radius*Math.cos(phi),target.z+radius*Math.sin(phi)*Math.cos(theta));camera.lookAt(target);}
    updateCamera();
    scene.add(new THREE.AmbientLight(0xfff8e7,0.9));
    const sun=new THREE.DirectionalLight(0xfff5d0,1.8);
    sun.position.set(LA.TW*0.6,65,LA.TH*0.3);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
    sun.shadow.camera.left=-130;sun.shadow.camera.right=130;sun.shadow.camera.top=90;sun.shadow.camera.bottom=-90;sun.shadow.camera.far=300;
    scene.add(sun);
    const fill1=new THREE.DirectionalLight(0xd0e8ff,0.5);fill1.position.set(-40,30,LA.TH);scene.add(fill1);
    const grid=new THREE.GridHelper(Math.max(LA.TW,LA.TH)*2.2,48,0x4a3728,0x2a1e14);
    grid.position.set(LA.TW/2,-0.02,LA.TH/2);grid.material.opacity=0.25;grid.material.transparent=true;scene.add(grid);
    function makeBox(x,z,w,d,h,color){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshLambertMaterial({color}));m.position.set(x+w/2,h/2,z+d/2);m.castShadow=m.receiveShadow=true;scene.add(m);}
    function makePlane(x,z,w,d,color){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),new THREE.MeshLambertMaterial({color}));m.rotation.x=-Math.PI/2;m.position.set(x+w/2,0.02,z+d/2);m.receiveShadow=true;scene.add(m);}
    const edgeMat=new THREE.LineBasicMaterial({color:ROOM_EDGE_3D,transparent:true,opacity:0.8,depthWrite:false});
    function roomBoundary(x,z,w,d){const Y=0.18;scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,Y,z),new THREE.Vector3(x+w,Y,z),new THREE.Vector3(x+w,Y,z+d),new THREE.Vector3(x,Y,z+d),new THREE.Vector3(x,Y,z)]),edgeMat));}
    LEFT_ROOMS.forEach(r=>roomBoundary(r.x,r.z,r.w,r.d));
    LEFT_ROOMS.forEach(r=>{
      const bwc=0x8a6a4a,bwh=LA.WH*0.92,bwt=0.25;
      makeBox(r.x,r.z,r.w,bwt,bwh,bwc);makeBox(r.x,r.z+r.d-bwt,r.w,bwt,bwh,bwc);
      makeBox(r.x,r.z,bwt,r.d,bwh,bwc);makeBox(r.x+r.w-bwt,r.z,bwt,r.d,bwh,bwc);
    });
    LEFT_ROOMS.forEach(r=>{
      if(!r.sym)return;
      const symColor=r.id==="hall"||r.id==="slope"?"#f5c842":r.id==="boys"||r.id==="girls"?"#a0d8ef":r.id==="stairD"||r.id==="stairU"?"#a0cfef":"#ffe0a0";
      const cv=makeSymbolCanvas(r.sym,symColor);const tex=new THREE.CanvasTexture(cv);
      const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false,opacity:0.88}));
      const sz3d=Math.min(r.w*0.55,r.d*0.55,5.5);sp.scale.set(sz3d,sz3d,1);sp.position.set(r.x+r.w/2,1.6,r.z+r.d/2);scene.add(sp);
    });
    makePlane(-8,-8,LA.TW+16,LA.TH+16,0x1a1008);makePlane(0,0,LA.TW,LA.TH,0xe0d8c0);
    LEFT_ROOMS.forEach(r=>makePlane(r.x,r.z,r.w,r.d,r.c3));
    const OW=0x5c3d2a;
    makeBox(0,0,LA.TW,LA.WT,LA.WH,OW);makeBox(0,LA.TH-LA.WT,LA.TW,LA.WT,LA.WH,OW);makeBox(0,0,LA.WT,LA.TH,LA.WH,OW);makeBox(LA.TW-LA.WT,0,LA.WT,LA.TH,LA.WH,OW);
    const IW=0x7a5c3c,iw=0.4;
    makeBox(LA.WT+14,0,iw,28,LA.WH,IW);makeBox(LA.WT,14,14,iw,LA.WH,IW);makeBox(LA.WT+15,16,24,iw,LA.WH-0.4,IW);makeBox(LA.TW/2-9,14,23,iw,LA.WH-0.4,IW);makeBox(LA.TW/2+5,0,iw,14,LA.WH-0.4,IW);makeBox(LA.TW-LA.WT-17,LA.WT,iw,LA.TH-LA.WT*2,LA.WH,IW);makeBox(LA.WT,LA.TH-LA.WT-20,LA.TW-LA.WT*2-17,iw,LA.WH-0.5,IW);
    [13,26,41].forEach(ox=>makeBox(LA.WT+ox,LA.TH-LA.WT-20,iw,20,LA.WH-0.5,IW));
    LEFT_ROOMS.forEach(r=>{const col=r.id==="hall"||r.id==="slope"?GOLD:r.id==="boys"?"#a0d8ef":r.id==="girls"?"#f0b8d0":r.id==="stairD"||r.id==="stairU"?"#a0cfef":"#ffe0a0";makeLabel3D(scene,r.lbl,r.x+r.w/2,LA.WH+1.2,r.z+r.d/2,r.w,r.d,col);});
    let isDragging=false,prevX=0,prevY=0;const dom=renderer.domElement;
    dom.addEventListener("mousedown",e=>{isDragging=true;prevX=e.clientX;prevY=e.clientY;});
    window.addEventListener("mouseup",()=>{isDragging=false;});
    dom.addEventListener("mousemove",e=>{if(!isDragging)return;const dx=e.clientX-prevX,dy=e.clientY-prevY;if(e.buttons===1){theta-=dx*0.004;phi=Math.max(0.08,Math.min(1.48,phi+dy*0.004));}else if(e.buttons===2){target.x-=dx*0.07;target.z-=dy*0.07;}prevX=e.clientX;prevY=e.clientY;updateCamera();});
    dom.addEventListener("wheel",e=>{e.preventDefault();radius=Math.max(15,Math.min(220,radius+e.deltaY*0.07));updateCamera();},{passive:false});
    dom.addEventListener("contextmenu",e=>e.preventDefault());
    window.addEventListener("resize",()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();});
    let animId;const animate=()=>{animId=requestAnimationFrame(animate);renderer.render(scene,camera);};animate();
    return()=>{cancelAnimationFrame(animId);renderer.dispose();if(el.contains(renderer.domElement))el.removeChild(renderer.domElement);};
  },[]);
  return <div ref={mountRef} style={{width:"100%",height:"100%",borderRadius:8,overflow:"hidden"}}/>;
}

function CentralScene3D() {
  const mountRef=useRef(null);
  const sphRef=useRef({r:100,th:-0.35,ph:0.62});
  const tgtRef=useRef(new THREE.Vector3(55,0,14));
  useEffect(()=>{
    const el=mountRef.current;if(!el)return;
    const W=el.clientWidth||800,H=el.clientHeight||600;
    const renderer=new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(W,H);renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);
    const scene=new THREE.Scene();scene.background=new THREE.Color(0x0d1117);scene.fog=new THREE.Fog(0x0d1117,100,240);
    const camera=new THREE.PerspectiveCamera(45,W/H,0.1,500);
    const camUpdate=()=>{const{r,th,ph}=sphRef.current,tgt=tgtRef.current;camera.position.set(tgt.x+r*Math.sin(ph)*Math.sin(th),tgt.y+r*Math.cos(ph),tgt.z+r*Math.sin(ph)*Math.cos(th));camera.lookAt(tgt);};
    camUpdate();
    scene.add(new THREE.AmbientLight(0xfff8e7,0.8));
    const dir=new THREE.DirectionalLight(0xfff5d0,1.6);dir.position.set(30,65,45);dir.castShadow=true;dir.shadow.mapSize.set(2048,2048);dir.shadow.camera.left=-130;dir.shadow.camera.right=130;dir.shadow.camera.top=90;dir.shadow.camera.bottom=-90;scene.add(dir);
    const f1=new THREE.DirectionalLight(0xd0e8ff,0.4);f1.position.set(-30,35,-30);scene.add(f1);
    const grid=new THREE.GridHelper(240,96,0x4a3728,0x2a1e14);grid.position.set(55,-0.04,14);grid.material.opacity=0.2;grid.material.transparent=true;scene.add(grid);
    const mat=k=>new THREE.MeshLambertMaterial({color:k});
    const M={ow:mat(0x5c3d2a),iw:mat(0x7a5c3c),fl:mat(0xe0d8c0),fa:mat(0xcab890),dr:new THREE.MeshLambertMaterial({color:0xc8a060,transparent:true,opacity:0.85}),st:mat(0x8aaccf),sr:mat(0x6a8caf),wf:mat(0xb8d8f0),sf:mat(0x8aaccf),cf:mat(0xc8b880),gn:mat(0xa0e0a0),gr:mat(0x1a1008)};
    const edgeMat=new THREE.LineBasicMaterial({color:ROOM_EDGE_3D,transparent:true,opacity:0.8,depthWrite:false});
    CENTRAL_ROOMS_2D.forEach(r=>{const Y=0.18,{x,z,w,d}=r;scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,Y,z),new THREE.Vector3(x+w,Y,z),new THREE.Vector3(x+w,Y,z+d),new THREE.Vector3(x,Y,z+d),new THREE.Vector3(x,Y,z)]),edgeMat));});
    const bx=(w,h,d,m,x,y,z)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);return mesh;};
    const ow=(x1,z1,x2,z2,H=3.5)=>{const cx=(x1+x2)/2,cz=(z1+z2)/2,dx=Math.abs(x2-x1)||0.5,dz=Math.abs(z2-z1)||0.5;bx(dx,H,dz,M.ow,cx,H/2,cz);};
    const iw=(x1,z1,x2,z2,H=3.5)=>{const cx=(x1+x2)/2,cz=(z1+z2)/2,dx=Math.abs(x2-x1)||0.2,dz=Math.abs(z2-z1)||0.2;bx(dx,H,dz,M.iw,cx,H/2,cz);};
    const fl=(x,z,w,d,m=M.fl)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,0.12,d),m);mesh.position.set(x+w/2,0.06,z+d/2);mesh.receiveShadow=true;scene.add(mesh);};
    const lbl=(text,x,y,z,rW,rD,color="#fff8e0")=>makeLabel3D(scene,text,x,y,z,rW,rD,color);
    const gnd=new THREE.Mesh(new THREE.PlaneGeometry(260,120),M.gr);gnd.rotation.x=-Math.PI/2;gnd.position.set(55,-0.06,14);gnd.receiveShadow=true;scene.add(gnd);
    fl(0,0,110,28);fl(0,0,60,28,M.fa);fl(60,0,50,28,M.fa);
    ow(0,0,110,0.5);ow(0,27.5,110,28);ow(0,0,0.5,28);ow(109.5,0,110,28);
    ow(17,0,17.5,9);ow(30.5,0,31,9);ow(17,8.5,31,9);
    iw(0,8.8,110,9.0);iw(0,11.0,110,11.2);
    iw(1,9,9,9.18);iw(1,9,1.18,15);iw(8.82,9,9,15);iw(1,14.82,9,15);fl(1,9,8,6,M.fa);lbl("Maths Lab",5,3.5,12,7.5,5.5,"#ffe0a0");
    iw(9,9,18,9.18);iw(9,9,9.18,15);iw(17.82,9,18,15);iw(9,14.82,18,15);fl(9,9,9,6,M.fa);lbl("Dr. LKB & Dr. AKK\nCabin",13.5,3.5,12,8.5,5.5,"#ffe0a0");
    iw(32,9,42,9.18);iw(32,9,32.18,14);iw(41.82,9,42,14);iw(32,13.82,42,14);fl(32,9,10,5,M.fa);lbl("Dr. BG Cabin",37,3.5,11.5,9.5,4.5,"#ffe0a0");
    iw(32,14,42,14.18);iw(32,17.82,42,18);fl(32,14,10,4,M.fa);lbl("Dr.SSL Cabin",37,3.5,16,9.5,3.5,"#ffe0a0");
    iw(44,9,51,9.18);iw(44,9,44.18,13.5);iw(50.82,9,51,13.5);iw(44,13.32,51,13.5);fl(44,9,7,4.5,M.wf);lbl("Male\nWashroom",47.5,3.5,11,6.5,4,"#a0d8ef");
    iw(51,9,58,9.18);iw(57.82,9,58,13.5);iw(51,13.32,58,13.5);fl(51,9,7,4.5,M.wf);lbl("Female\nWashroom",54.5,3.5,11,6.5,4,"#f0b8d0");
    ow(52,0,52.5,8.8);fl(52,0,8,8.5,M.sf);lbl("Upstairs\nSlope",56,3.5,4,7,7,"#a0cfef");
    iw(0,15,18,15.18);iw(17.82,15,18,28);fl(0,15,18,13,M.fa);lbl("Storage /\nLarge Room",9,3.5,21.5,16,12,"#e8d5b0");
    fl(18,11,14,17,M.cf);iw(18,11,18.18,28);iw(31.82,11,32,28);lbl("Corridor",25,3.5,19,12,5,"#d0c090");
    fl(28,15,5,6,M.sf);lbl("Way to\n1F",30.5,3.5,18,4.5,5.5,"#a0cfef");
    iw(18,20,28,20.18);iw(27.82,20,28,28);fl(18,20,10,8,M.fa);lbl("L105",23,3.5,24,9.5,7.5,"#ffe0a0");
    iw(32,11,60,11.18);iw(32,11,32.18,28);fl(32,11,28,17,M.fa);lbl("L104\n151.82 m²",46,3.5,19.5,27,15,GOLD);
    iw(60,12,85,12.18);iw(84.82,0,85,12);fl(60,0,25,12,M.fa);lbl("Lecture Hall\n44.16 m²",72.5,3.5,5.5,23,10,GOLD);
    iw(60,12,60.18,28);iw(84.82,12,85,28);iw(60,27.82,85,28);fl(60,12,25,16,M.fa);lbl("L103",72.5,3.5,20,23,14,"#ffe0a0");
    iw(65,19,73,19.18);iw(65,19,65.18,27);iw(72.82,19,73,27);iw(65,26.82,73,27);fl(65,19,8,8,M.gn);lbl("Green\nRoom",69,3.5,23,7.5,7.5,"#a0e0a0");
    iw(85,0,85.18,28);iw(89.82,0,90,28);fl(85,0,5,28,M.cf);
    iw(90,13,107,13.18);iw(90,13,90.18,28);iw(106.82,13,107,28);iw(90,27.82,107,28);fl(90,13,17,15,M.fa);lbl("Design Studio\n(PDES)\n38.21 m²",98.5,3.5,20,16,13,GOLD);
    iw(90,13,110,13.18);iw(90,0,90.18,13);fl(90,0,20,13,M.sf);lbl("Upstairs\n35.94 m²",100,3.5,6.5,19,11,"#a0cfef");
    lbl("Room\n12.26 m²",24,3.5,4.5,13,8,GOLD);
    let drag=false,rgt=false,prev={x:0,y:0};const dom=renderer.domElement;
    dom.addEventListener("mousedown",e=>{drag=true;rgt=e.button===2;prev={x:e.clientX,y:e.clientY};});
    window.addEventListener("mouseup",()=>{drag=false;});
    window.addEventListener("mousemove",e=>{if(!drag)return;const dx=(e.clientX-prev.x)*0.008,dy=(e.clientY-prev.y)*0.008;prev={x:e.clientX,y:e.clientY};const s=sphRef.current;if(rgt){const rv=new THREE.Vector3();rv.crossVectors(camera.getWorldDirection(new THREE.Vector3()),camera.up).normalize();tgtRef.current.addScaledVector(rv,dx*s.r*0.15);tgtRef.current.y-=dy*s.r*0.15;}else{s.th-=dx;s.ph=Math.max(0.08,Math.min(Math.PI/2.05,s.ph+dy));}camUpdate();});
    dom.addEventListener("wheel",e=>{e.preventDefault();sphRef.current.r=Math.max(10,Math.min(200,sphRef.current.r+e.deltaY*0.08));camUpdate();},{passive:false});
    dom.addEventListener("contextmenu",e=>e.preventDefault());
    window.addEventListener("resize",()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();});
    let animId;const animate=()=>{animId=requestAnimationFrame(animate);renderer.render(scene,camera);};animate();
    return()=>{cancelAnimationFrame(animId);if(el.contains(renderer.domElement))el.removeChild(renderer.domElement);renderer.dispose();};
  },[]);
  return <div ref={mountRef} style={{width:"100%",height:"100%",overflow:"hidden"}}/>;
}

function RightScene3D() {
  const mountRef=useRef(null);
  useEffect(()=>{
    const el=mountRef.current;if(!el)return;
    const CW=el.clientWidth||800,CH=el.clientHeight||500;
    const renderer=new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(CW,CH);renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x0d1117,1);el.appendChild(renderer.domElement);
    const scene=new THREE.Scene();scene.background=new THREE.Color(0x0d1117);scene.fog=new THREE.Fog(0x0d1117,180,380);
    const camera=new THREE.PerspectiveCamera(44,CW/CH,0.5,600);
    let theta=-0.45,phi=0.65,radius=140;
    const target=new THREE.Vector3(RL.OW/2,0,RL.OH/2);
    function updateCam(){camera.position.set(target.x+radius*Math.sin(phi)*Math.sin(theta),target.y+radius*Math.cos(phi),target.z+radius*Math.sin(phi)*Math.cos(theta));camera.lookAt(target);}
    updateCam();
    scene.add(new THREE.AmbientLight(0xfff8e7,0.88));
    const sun=new THREE.DirectionalLight(0xfff5d0,1.7);sun.position.set(RL.OW*0.55,70,RL.OH*0.3);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-160;sun.shadow.camera.right=160;sun.shadow.camera.top=100;sun.shadow.camera.bottom=-100;sun.shadow.camera.far=320;scene.add(sun);
    const fill1=new THREE.DirectionalLight(0xd0e8ff,0.4);fill1.position.set(-40,30,RL.OH);scene.add(fill1);
    const fill2=new THREE.DirectionalLight(0xffe8d0,0.35);fill2.position.set(RL.OW+40,25,-20);scene.add(fill2);
    const grid=new THREE.GridHelper(Math.max(RL.OW,RL.OH)*2.4,56,0x4a3728,0x2a1e14);grid.position.set(RL.OW/2,-0.04,RL.OH/2);grid.material.opacity=0.22;grid.material.transparent=true;scene.add(grid);
    function box(x,z,w,d,h,color){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshLambertMaterial({color}));m.position.set(x+w/2,h/2,z+d/2);m.castShadow=true;m.receiveShadow=true;scene.add(m);}
    function plane(x,z,w,d,color){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),new THREE.MeshLambertMaterial({color,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.set(x+w/2,0.02,z+d/2);m.receiveShadow=true;scene.add(m);}
    const edgeMat=new THREE.LineBasicMaterial({color:ROOM_EDGE_3D,transparent:true,opacity:0.80,depthWrite:false});
    function roomEdge(x,z,w,d){const Y=0.20;scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,Y,z),new THREE.Vector3(x+w,Y,z),new THREE.Vector3(x+w,Y,z+d),new THREE.Vector3(x,Y,z+d),new THREE.Vector3(x,Y,z)]),edgeMat));}
    const lbl=(txt,x,y,z,mw,md,col="#fff8e0")=>makeLabel3D(scene,txt,x,y,z,mw,md,col);
    const OW=0x5c3d2a,IW=0x7a5c3c,BW=RL.BW,WH=RL.WH;
    plane(-12,-12,RL.OW+24,RL.OH+24,0x1a1008);
    plane(0,0,RL.NW_X+RL.NW_W,RL.COR_TOP_Z,0xe0d8c0);
    plane(0,RL.COR_TOP_Z,RL.OW,RL.OH-RL.COR_TOP_Z,0xe0d8c0);
    RIGHT_ROOMS.forEach(r=>plane(r.x,r.z,r.w,r.d,r.c3));
    box(0,0,RL.NW_X+RL.NW_W,BW,WH,OW);box(RL.NW_X+RL.NW_W,0,BW,RL.COR_TOP_Z,WH,OW);
    box(0,RL.COR_TOP_Z-BW,RL.L102_WALL_X,BW,WH,OW);
    box(RL.L102_WALL_X+RL.L102_WALL_W,RL.COR_TOP_Z-BW,RL.CSTAIR_X-2-(RL.L102_WALL_X+RL.L102_WALL_W),BW,WH,OW);
    box(RL.CSTAIR_X+RL.CSTAIR_W+2,RL.COR_TOP_Z-BW,RL.OW-(RL.CSTAIR_X+RL.CSTAIR_W+2),BW,WH,OW);
    box(0,RL.OH-BW,RL.OW,BW,WH,OW);box(0,0,BW,RL.OH,WH,OW);box(RL.OW-BW,0,BW,RL.OH,WH,OW);
    const ip=0.45;
    box(RL.BWC_X,RL.BWC_Z+RL.BWC_H,RL.BWC_W,ip,WH*0.86,IW);
    box(RL.BWC_X,RL.COR_TOP_Z,ip,RL.CR_Z-RL.COR_TOP_Z,WH*0.86,IW);
    [RL.CR104_X+RL.CR104_W,RL.CR103_X+RL.CR103_W,RL.CR102_X+RL.CR102_W].forEach(cx=>{box(cx,RL.CR_Z,ip,RL.CR_H,WH*0.86,IW);});
    box(BW,RL.CR_Z,RL.OW-BW*2,ip,WH*0.88,IW);
    box(RL.NW_X+RL.NW_W,RL.NW_Z,ip,RL.NW_H,WH*0.90,IW);
    box(RL.NW_X,RL.NW_Z+RL.NW_H,RL.NW_W,ip,WH*0.90,IW);
    for(let i=0;i<12;i++){const sh=0.26*(i+1);const m=new THREE.Mesh(new THREE.BoxGeometry(RL.NSTAIR_W,sh,RL.NSTAIR_H/12),new THREE.MeshLambertMaterial({color:0x8aaccf}));m.position.set(RL.NSTAIR_X+RL.NSTAIR_W/2,sh/2,RL.NSTAIR_Z+i*(RL.NSTAIR_H/12)+(RL.NSTAIR_H/24));m.castShadow=true;scene.add(m);}
    for(let i=0;i<10;i++){const sh=0.30*(i+1);const m=new THREE.Mesh(new THREE.BoxGeometry(RL.CSTAIR_W,sh,RL.CSTAIR_H/10),new THREE.MeshLambertMaterial({color:0x8aaccf}));m.position.set(RL.CSTAIR_X+RL.CSTAIR_W/2,sh/2,RL.CSTAIR_Z+i*(RL.CSTAIR_H/10)+(RL.CSTAIR_H/20));m.castShadow=true;scene.add(m);}
    function doorArc3(x,z,r,rotY,color=0xc8a060){const segs=14,shape=new THREE.Shape();shape.moveTo(0,0);for(let i=0;i<=segs;i++){const a=(i/segs)*(Math.PI/2);shape.lineTo(Math.cos(a)*r,Math.sin(a)*r);}shape.lineTo(0,0);const mesh=new THREE.Mesh(new THREE.ShapeGeometry(shape),new THREE.MeshLambertMaterial({color,transparent:true,opacity:0.42,side:THREE.DoubleSide}));mesh.rotation.x=-Math.PI/2;mesh.rotation.z=rotY;mesh.position.set(x,0.06,z);scene.add(mesh);}
    const P=Math.PI;
    doorArc3(RL.NW_X+RL.NW_W/2-3,RL.NW_Z,4.5,-P/2);doorArc3(RL.NW_X+RL.NW_W/2+3,RL.NW_Z,4.5,0);
    doorArc3(RL.L102_WALL_X+2,RL.COR_TOP_Z-BW,4,P,0xa07030);doorArc3(RL.CSTAIR_X-2,RL.COR_TOP_Z-BW,4,-P/2);doorArc3(RL.CSTAIR_X+RL.CSTAIR_W+2,RL.COR_TOP_Z-BW,4,P,0xa07030);
    [RL.CR104_X+RL.CR104_W/2,RL.CR103_X+RL.CR103_W/2,RL.CR102_X+RL.CR102_W/2,RL.CR101_X+RL.CR101_W/2].forEach(dx=>{doorArc3(dx,RL.CR_Z,4,P);});
    doorArc3(BW,RL.CR_Z+RL.CR_H/2,3.5,-P/2,0xa07030);doorArc3(BW,RL.COR_TOP_Z+10,3.5,-P/2,0xa07030);
    doorArc3(RL.OW-BW,RL.COR_Z+RL.COR_H/2-3,4,-P/2);doorArc3(RL.OW-BW,RL.COR_Z+RL.COR_H/2+3,4,P/2);
    RIGHT_ROOMS.forEach(r=>roomEdge(r.x,r.z,r.w,r.d));
    RIGHT_ROOMS.forEach(r=>{if(!r.sym)return;const col=r.id==="bwc"||r.id==="gwc"?"#c8ecff":r.id==="corr"?"#fff176":r.id==="nw"?"#c8e6ff":"#fff8e0";const cv=makeSymbolCanvas(r.sym,col);const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthTest:false,opacity:0.85}));const sz2=Math.min(r.w*0.40,r.d*0.40,7);sp.scale.set(sz2,sz2,1);sp.position.set(r.x+r.w/2,0.9,r.z+r.d/2);scene.add(sp);});
    RIGHT_ROOMS.forEach(r=>{const col=r.id==="bwc"||r.id==="gwc"?"#c8ecff":r.id==="corr"?"#fff176":r.id==="nw"?"#c8e6ff":"#fff8e0";lbl(r.lbl,r.x+r.w/2,WH+1.5,r.z+r.d/2,r.w,r.d,col);});
    lbl("▲ Mess Slope",RL.NW_X+RL.NW_W/2,WH+1,RL.NW_Z-6,18,7,"#ffdd66");
    lbl("L102 Entry",RL.L102_WALL_X+RL.L102_WALL_W/2,WH+1,RL.COR_TOP_Z-8,14,6,"#ffdd66");
    lbl("▶ CSE Block",RL.OW-BW+7,WH+1,RL.COR_Z+RL.COR_H/2,14,7,"#ffdd66");
    let isDragging=false,prevX=0,prevY=0;const dom=renderer.domElement;
    dom.addEventListener("mousedown",e=>{isDragging=true;prevX=e.clientX;prevY=e.clientY;});
    window.addEventListener("mouseup",()=>{isDragging=false;});
    dom.addEventListener("mousemove",e=>{if(!isDragging)return;const dx=e.clientX-prevX,dy=e.clientY-prevY;if(e.buttons===1){theta-=dx*0.004;phi=Math.max(0.08,Math.min(1.48,phi+dy*0.004));}else if(e.buttons===2){target.x-=dx*0.09;target.z-=dy*0.09;}prevX=e.clientX;prevY=e.clientY;updateCam();});
    dom.addEventListener("wheel",e=>{e.preventDefault();radius=Math.max(20,Math.min(300,radius+e.deltaY*0.09));updateCam();},{passive:false});
    dom.addEventListener("contextmenu",e=>e.preventDefault());
    window.addEventListener("resize",()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();});
    let animId;const animate=()=>{animId=requestAnimationFrame(animate);renderer.render(scene,camera);};animate();
    return()=>{cancelAnimationFrame(animId);renderer.dispose();if(el.contains(renderer.domElement))el.removeChild(renderer.domElement);};
  },[]);
  return <div ref={mountRef} style={{width:"100%",height:"100%",borderRadius:8,overflow:"hidden"}}/>;
}

// ═══════════════════════════════════════════════════════════════════
// ████  WING CONFIG
// ═══════════════════════════════════════════════════════════════════
const WING_CONFIG = {
  left: {
    title:"LHTC — Ground Floor",subtitle:"LEFT SIDE · ARCHITECTURAL FLOOR PLAN VISUALIZATION",
    Blueprint2D: LeftBlueprint2D, Scene3D: LeftScene3D,
    legend:[{color:"#cabb90",label:"Main Hall"},{color:"#8aaccf",label:"Washrooms"},{color:"#6a8caf",label:"Staircase"},{color:"#ffe0b0",label:"Classrooms"},{color:"#f0c880",label:"Exit / Slope"},{color:"#5c3d2a",label:"Outer Walls"},{color:"#8a6a4a",label:"Room Walls"},{color:"#c8a060",label:"Doors"},{color:GOLD,label:"Room Bounds"}],
    symLegend:[{sym:"class",label:"Classroom"},{sym:"lab",label:"Lab"},{sym:"hall",label:"Main Hall"},{sym:"wc",label:"Washroom"},{sym:"stair",label:"Staircase"},{sym:"slope",label:"Slope/Exit"}],
    roomIndex:[["CR108","Classroom (×2)","#ffe0b0"],["CR109","Classroom","#ffe0b0"],["CR110","Classroom + Back Door","#ffe0b0"],["L106","Lab / Room (North)","#ffe0b0"],["L107","Lab / Room (North)","#ffe0b0"],["East Block","Classroom + CR107 Door","#ffe0b0"],["Boys WC","Boys Washroom (NW)","#8aaccf"],["Girls WC","Girls Washroom (NW)","#8aaccf"],["Stairs","Downstairs + Landing","#6a8caf"],["Main Hall","74.63 m² Central Space","#cabb90"],["Entry Door","East-facing Main Entry","#c8a060"],["Slope Exit","Way to Maa Saraswati","#f0c880"]],
  },
  central: {
    title:"LHTC — Ground Floor",subtitle:"CENTRAL BLOCK · ARCHITECTURAL FLOOR PLAN VISUALIZATION",
    Blueprint2D: CentralBlueprint2D, Scene3D: CentralScene3D,
    legend:[{color:"#5c3d2a",label:"Outer Walls"},{color:"#7a5c3c",label:"Inner Walls"},{color:"#1a1008",label:"Floor"},{color:"#c8a060",label:"Door Swings"},{color:"#8aaccf",label:"Stairs"},{color:"#b8d8f0",label:"Washroom"},{color:GOLD,label:"Room Bounds"}],
    symLegend:[{sym:"wc",label:"Washroom"},{sym:"stair",label:"Staircase"},{sym:"hall",label:"Corridor"}],
    roomIndex:[["Room","12.26 m² Entry Room","#ffe0a0"],["Maths Lab","Faculty Cabin","#ffe0a0"],["Dr. LKB","Faculty Cabin","#ffe0a0"],["Dr. BG","Faculty Cabin","#ffe0a0"],["Dr. SSL","Faculty Cabin","#ffe0a0"],["L104","151.82 m² Lecture Hall",GOLD],["L105","Small classroom","#ffe0a0"],["L103","Lecture Hall","#ffe0a0"],["Green Room","Production room","#a0e0a0"],["PDES","Design Studio 38.21 m²",GOLD],["Male WC","Boys Washroom","#a0d8ef"],["Female WC","Girls Washroom","#f0b8d0"]],
  },
  right: {
    title:"LHTC — Ground Floor",subtitle:"RIGHT SIDE · ARCHITECTURAL FLOOR PLAN VISUALIZATION",
    Blueprint2D: RightBlueprint2D, Scene3D: RightScene3D,
    legend:[{color:"#cab890",label:"Corridor / Hall"},{color:"#8aaccf",label:"Washrooms"},{color:"#8aaccf",label:"Staircase"},{color:"#fce8d0",label:"Classrooms"},{color:"#4a3520",label:"Outer Walls"},{color:"#7a5c3c",label:"Inner Walls"},{color:"#c8a060",label:"Doors"},{color:GOLD,label:"Room Bounds"}],
    symLegend:[{sym:"class",label:"Classroom"},{sym:"wc",label:"Washroom"},{sym:"hall",label:"Corridor"},{sym:"stair",label:"Staircase"}],
    roomIndex:[["CR101","South classroom (wide, rightmost)","#f0d0b8"],["CR102","South classroom","#f4d8c0"],["CR103","South classroom","#f8e0c8"],["CR104","South classroom (wide, leftmost)","#fce8d0"],["Boys WC","Washroom (right side, north)","#8aaccf"],["Girls WC","Washroom (right side, south)","#8aaacf"],["Corridor","Main hall 74.16 m² (full width)","#cab890"],["NW Block","Upstairs / 18.39 m²","#cab890"],["NW Staircase","Stairs inside NW block","#8aaccf"],["Centre Stair","Corridor upstairs staircase","#8aaccf"],["L102 Entry","Left door into corridor","#c8a060"],["Ally Door","Left wall side door","#c8a060"],["CR104 Back","Back door (bottom left)","#c8a060"],["CSE Block","Right wall exit → CSE","#c8a060"]],
  },
};

// ═══════════════════════════════════════════════════════════════════
// ████  MAIN APP — FIXED LAYOUT WITH SCROLL
// ═══════════════════════════════════════════════════════════════════
export default function LHTCFloorPlanApp() {
  const [wing, setWing] = useState("left");
  const [view, setView] = useState("both");
  const cfg = WING_CONFIG[wing];
  const { Blueprint2D, Scene3D: WingScene } = cfg;

  // Panel height: taller in single view, shorter in both-view to fit side by side
  const PANEL_H_BOTH   = 520;
  const PANEL_H_SINGLE = 640;
  const panelH = view === "both" ? PANEL_H_BOTH : PANEL_H_SINGLE;

  const base = {
    fontFamily: FONT,
    background: "linear-gradient(135deg,#0d1117 0%,#1a0e06 60%,#0d1117 100%)",
    // KEY FIX: allow natural height + vertical scroll on the outer container
    minHeight: "100vh",
    overflowY: "auto",
    overflowX: "hidden",
    color: "#e8d5b0",
    padding: "14px 14px 40px",   // extra bottom padding so content isn't flush at edge
    boxSizing: "border-box",
  };

  const panelStyle = {
    background: "rgba(13,17,23,0.92)",
    border: "1px solid #4a3728",
    borderRadius: 10,
    overflow: "hidden",
    // KEY FIX: panels have fixed height but panel CONTENT area will auto-scroll if needed
    display: "flex",
    flexDirection: "column",
  };

  const panelHeader = {
    padding: "7px 13px",
    background: "#0f0a04",
    borderBottom: "1px solid #4a3728",
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  };

  const btnBase = {
    padding: "7px 18px", borderRadius: 6, border: "2px solid",
    fontFamily: FONT, fontWeight: 700, fontSize: 12, cursor: "pointer",
    letterSpacing: 1, transition: "all 0.2s",
  };
  const wingBtn = { ...btnBase, padding: "7px 16px", fontSize: 11 };

  function SymIcon({ sym }) {
    const ref = useRef(null);
    useEffect(() => {
      if (!ref.current) return;
      const c = makeSymbolCanvas(sym, sym === "hall" || sym === "slope" ? GOLD : sym === "wc" ? "#a0d8ef" : sym === "stair" ? "#a0cfef" : "#ffe0a0");
      ref.current.width = c.width; ref.current.height = c.height;
      ref.current.getContext("2d").drawImage(c, 0, 0);
    }, [sym]);
    return <canvas ref={ref} style={{ width: 22, height: 22, borderRadius: 3, background: "rgba(13,17,23,0.7)", border: "1px solid #3a2a1a" }} />;
  }

  return (
    <div style={base}>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <h1 style={{ fontSize: 20, fontWeight: 900, letterSpacing: 4, color: GOLD, margin: 0, textTransform: "uppercase" }}>{cfg.title}</h1>
        <p style={{ color: "#6a5040", fontSize: 10, margin: "3px 0 0", letterSpacing: 3 }}>{cfg.subtitle}</p>
      </div>

      {/* Wing selector */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 10 }}>
        <span style={{ color: "#6a5040", fontFamily: FONT, fontSize: 10, letterSpacing: 2, alignSelf: "center", marginRight: 4 }}>WING ▸</span>
        {[["left", "◀ Left Wing"], ["central", "⬡ Central Block"], ["right", "Right Wing ▶"]].map(([w, lbl]) => (
          <button key={w} onClick={() => { setWing(w); setView("both"); }} style={{
            ...wingBtn,
            borderColor: wing === w ? "#f5c842" : "#4a3728",
            background: wing === w ? "#f5c842" : "transparent",
            color: wing === w ? "#1a0e06" : "#e8d5b0",
          }}>{lbl}</button>
        ))}
      </div>

      {/* View selector */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 14 }}>
        {[["2d", "⬜ 2D Blueprint"], ["3d", "◈ 3D Model"], ["both", "⊞ Both Views"]].map(([v, lbl]) => (
          <button key={v} onClick={() => setView(v)} style={{
            ...btnBase,
            borderColor: view === v ? GOLD : "#4a3728",
            background: view === v ? GOLD : "transparent",
            color: view === v ? "#1a0e06" : "#e8d5b0",
          }}>{lbl}</button>
        ))}
      </div>

      {/* Panels grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: view === "both" ? "1fr 1fr" : "1fr",
        gap: 14,
        maxWidth: 1600,
        margin: "0 auto",
      }}>
        {(view === "2d" || view === "both") && (
          <div style={panelStyle}>
            <div style={panelHeader}>
              <span style={{ color: "#27ae60", fontWeight: 700, fontSize: 12, fontFamily: FONT }}>◈ 2D BLUEPRINT</span>
              <span style={{ color: "#4a3728", fontSize: 10, marginLeft: "auto", fontFamily: FONT }}>Scale: 1 unit ≈ 1 m</span>
            </div>
            {/* KEY FIX: canvas area has explicit height — ResizeObserver inside Blueprint2D handles the rest */}
            <div style={{ height: panelH, flex: "none", padding: 6, overflow: "hidden" }}>
              <Blueprint2D key={wing + "-2d"} />
            </div>
          </div>
        )}
        {(view === "3d" || view === "both") && (
          <div style={panelStyle}>
            <div style={panelHeader}>
              <span style={{ color: GOLD, fontWeight: 700, fontSize: 12, fontFamily: FONT }}>◈ 3D MODEL</span>
              <span style={{ color: "#4a3728", fontSize: 10, marginLeft: "auto", fontFamily: FONT }}>Drag · Scroll zoom · Right-drag pan</span>
            </div>
            <div style={{ height: panelH, flex: "none", overflow: "hidden" }}>
              <WingScene key={wing + "-3d"} />
            </div>
          </div>
        )}
      </div>

      {/* Legend row */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18, marginTop: 14 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, fontFamily: FONT }}>
          {cfg.legend.map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: color, border: "1px solid #4a3728", flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: "#a89070" }}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, fontFamily: FONT }}>
          {cfg.symLegend.map(({ sym, label }) => (
            <div key={sym} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <SymIcon sym={sym} />
              <span style={{ fontSize: 10, color: "#a89070" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Room index */}
      <div style={{ maxWidth: 1600, margin: "12px auto 0", background: "rgba(13,17,23,0.92)", borderRadius: 10, border: "1px solid #2a1e14", padding: "10px 14px", fontFamily: FONT }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: 2, marginBottom: 7 }}>ROOM INDEX</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: "3px 18px" }}>
          {cfg.roomIndex.map(([id, desc, color]) => (
            <div key={id + desc} style={{ display: "flex", gap: 7, alignItems: "center" }}>
              <div style={{ width: 9, height: 9, borderRadius: 2, background: color, flexShrink: 0, border: "1px solid #4a3728" }} />
              <span style={{ color: GOLD, fontSize: 10, fontWeight: 700, minWidth: 80, fontFamily: FONT }}>{id}</span>
              <span style={{ color: "#a89070", fontSize: 10, fontFamily: FONT }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}