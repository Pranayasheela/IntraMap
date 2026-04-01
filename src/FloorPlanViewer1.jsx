import React from 'react';
import * as THREE from 'three';

var S2D        = 42;
var BW         = 20;
var BD         = 14;
var OWT        = 0.32;
var IWT        = 0.10;
var WH         = 3.2;
var WALL_DARK     = 0x3b1f06;
var WALL_INNER    = 0x7a5030;
var WALL_DARK_2D  = '#3b1f06';
var WALL_INNER_2D = '#7a5030';

var ROOM_LEGEND = [
  ['#d8eef8','Male Washroom'],['#f8d8ee','Female Washroom'],['#eef8ff','Water Cooler'],
  ['#e2e8f5','Elevators'],['#f5f0e2','Big Room'],['#f5f0e0','Computer Lab 2'],
  ['#ecf0e2','Image Processing'],['#f0ead8','Prof. AO / PK'],['#f0f0e8','Staircase / Open'],
];

var SPECS = [
  ['Width','20 m'],['Depth','14 m'],['Height','3.2 m'],['Lifts','2'],
  ['Toilets','5'],['Sinks','4'],['Labs','2'],['Doors','10'],
];

var VIEWS = {
  iso:   { phi:Math.PI/3.5, theta:Math.PI/4,   radius:30 },
  top:   { phi:0.05,        theta:0,            radius:32 },
  south: { phi:1.55,        theta:Math.PI,      radius:28 },
  east:  { phi:1.55,        theta:Math.PI/2,    radius:26 },
};

function u(v){ return v*S2D; }
function fillRect(ctx,x,y,w,h,color){ ctx.fillStyle=color; ctx.fillRect(u(x),u(y),u(w),u(h)); }
function wallH(ctx,x1,x2,y){ var t=IWT*S2D; ctx.fillStyle=WALL_INNER_2D; ctx.fillRect(u(x1),u(y)-t/2,u(x2-x1),t); }
function wallV(ctx,x,y1,y2){ var t=IWT*S2D; ctx.fillStyle=WALL_INNER_2D; ctx.fillRect(u(x)-t/2,u(y1),t,u(y2-y1)); }
function door(ctx,x,y,size,axis){
  ctx.fillStyle='#ffffff'; ctx.strokeStyle='#222'; ctx.lineWidth=1.2;
  var s=u(size);
  if(axis==='V'){ctx.fillRect(u(x)-4,u(y),8,s);ctx.strokeRect(u(x)-4,u(y),8,s);}
  else{ctx.fillRect(u(x),u(y)-4,s,8);ctx.strokeRect(u(x),u(y)-4,s,8);}
}
function toilet2D(ctx,x,y){
  ctx.save(); ctx.translate(u(x)+u(0.25),u(y)+u(0.28));
  ctx.fillStyle='#ccc'; ctx.strokeStyle='#555'; ctx.lineWidth=1;
  ctx.fillRect(-u(0.25),-u(0.28),u(0.5),u(0.12)); ctx.strokeRect(-u(0.25),-u(0.28),u(0.5),u(0.12));
  ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(0,u(0.12),u(0.2),u(0.24),0,0,Math.PI*2); ctx.fill(); ctx.stroke(); ctx.restore();
}
function sink2D(ctx,x,y){
  ctx.fillStyle='#ddd'; ctx.strokeStyle='#555'; ctx.lineWidth=1;
  ctx.fillRect(u(x),u(y),u(0.45),u(0.38)); ctx.strokeRect(u(x),u(y),u(0.45),u(0.38));
  ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(u(x)+u(0.225),u(y)+u(0.19),u(0.13),u(0.10),0,0,Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#888'; ctx.beginPath(); ctx.arc(u(x)+u(0.225),u(y)+u(0.10),3,0,Math.PI*2); ctx.fill();
}
function fridge2D(ctx,x,y,w,h){
  var pw=u(w||0.55),ph=u(h||0.8);
  ctx.fillStyle='#a8ccd8'; ctx.strokeStyle='#1a4455'; ctx.lineWidth=1.5;
  ctx.fillRect(u(x),u(y),pw,ph); ctx.strokeRect(u(x),u(y),pw,ph);
  ctx.beginPath(); ctx.moveTo(u(x),u(y)+ph*0.48); ctx.lineTo(u(x)+pw,u(y)+ph*0.48); ctx.stroke();
  ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(u(x)+pw*0.25,u(y)+5); ctx.lineTo(u(x)+pw*0.75,u(y)+5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(u(x)+pw*0.25,u(y)+ph*0.48+5); ctx.lineTo(u(x)+pw*0.75,u(y)+ph*0.48+5); ctx.stroke();
  ctx.fillStyle='#1a4455'; ctx.font='bold 6px sans-serif'; ctx.textAlign='center';
  ctx.fillText('W.COOLER',u(x)+pw/2,u(y)+ph+9);
}
function elevator2D(ctx,x,y,w,h,lbl){
  var px=u(x),py=u(y),pw=u(w),ph=u(h);
  ctx.fillStyle='#dde4f5'; ctx.strokeStyle='#334477'; ctx.lineWidth=1.5;
  ctx.fillRect(px,py,pw,ph); ctx.strokeRect(px,py,pw,ph);
  ctx.strokeStyle='#8899bb'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(px+pw,py+ph); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(px+pw,py); ctx.lineTo(px,py+ph); ctx.stroke();
  ctx.fillStyle='#334477'; ctx.font='bold 8px sans-serif'; ctx.textAlign='center';
  ctx.fillText('▲',px+pw/2,py+ph/2-3); ctx.fillText('▼',px+pw/2,py+ph/2+10); ctx.fillText(lbl,px+pw/2,py+ph+11);
}
function staircase2D(ctx,x,y,w,h,n){
  var px=u(x),py=u(y),pw=u(w),ph=u(h); n=n||14;
  ctx.fillStyle='#f0ead8'; ctx.strokeStyle='#888'; ctx.lineWidth=1;
  ctx.fillRect(px,py,pw,ph); ctx.strokeRect(px,py,pw,ph);
  for(var i=0;i<=n;i++){var sy=py+(ph/n)*i;ctx.beginPath();ctx.moveTo(px,sy);ctx.lineTo(px+pw,sy);ctx.stroke();}
  ctx.strokeStyle='#333'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(px+pw/2,py+ph-6); ctx.lineTo(px+pw/2,py+6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(px+pw/2,py+6); ctx.lineTo(px+pw/2-4,py+14); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(px+pw/2,py+6); ctx.lineTo(px+pw/2+4,py+14); ctx.stroke();
}
function desk2D(ctx,x,y,w,h){
  ctx.fillStyle='#d4c49a'; ctx.strokeStyle='#887755'; ctx.lineWidth=0.8;
  ctx.fillRect(u(x),u(y),u(w||1.1),u(h||0.55)); ctx.strokeRect(u(x),u(y),u(w||1.1),u(h||0.55));
  ctx.fillStyle='#445566'; ctx.fillRect(u(x)+4,u(y)+4,u(w||1.1)-8,u(h||0.55)*0.45);
}
function label2D(ctx,text,x,y,size){
  ctx.font=(size||8)+'px sans-serif'; ctx.fillStyle='#333'; ctx.textAlign='center';
  text.split('\n').forEach(function(ln,i){ctx.fillText(ln,u(x),u(y)+i*((size||8)+2));});
}

function draw2D(canvas){
  var ctx=canvas.getContext('2d');
  canvas.width=BW*S2D+80; canvas.height=BD*S2D+80;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.save(); ctx.translate(40,40);

  fillRect(ctx,0,0,2.2,3.2,'#d8eef8'); fillRect(ctx,0,3.2,2.2,0.8,'#eef8ff'); fillRect(ctx,0,4.0,2.2,3.2,'#f8d8ee');
  fillRect(ctx,2.2,0,2.8,5.2,'#f5f2ea'); fillRect(ctx,5.0,0,1.8,3.5,'#f8d8ee'); fillRect(ctx,6.8,0,0.9,3.5,'#eef8ff');
  fillRect(ctx,7.7,0,2.0,3.5,'#d8eef8'); fillRect(ctx,9.7,0,4.5,5.2,'#f5f0e2'); fillRect(ctx,9.7,3.5,4.5,1.7,'#f5f2ea');
  fillRect(ctx,14.2,0,1.9,5.2,'#e2e8f5'); fillRect(ctx,16.1,0,1.9,5.2,'#e2e8f5');
  fillRect(ctx,2.2,5.2,2.8,1.0,'#f5f2ea'); fillRect(ctx,5.0,5.2,4.7,1.0,'#f5f2ea');
  fillRect(ctx,0,6.2,4.8,7.8,'#f5f0e0'); fillRect(ctx,4.8,6.2,2.4,3.0,'#ecf0e2');
  fillRect(ctx,4.8,9.2,1.2,2.8,'#f0ead8'); fillRect(ctx,6.0,9.2,1.2,2.8,'#f0ead8');
  fillRect(ctx,7.2,5.2,7.0,8.8,'#f0f0e8'); fillRect(ctx,14.2,5.2,5.8,8.8,'#f0f0e8');

  wallV(ctx,2.2,0,BD); wallH(ctx,0,2.2,3.2); wallH(ctx,0,2.2,4.0); wallH(ctx,0,2.2,6.2);
  wallV(ctx,5.0,0,5.2); wallV(ctx,6.8,0,3.5); wallV(ctx,7.7,0,3.5); wallV(ctx,9.7,0,5.2);
  wallH(ctx,5.0,9.7,3.5); wallV(ctx,14.2,0,5.2); wallV(ctx,16.1,0,5.2);
  wallH(ctx,5.0,BW,5.2); wallH(ctx,2.2,5.0,6.2); wallH(ctx,5.0,7.2,6.2);
  wallV(ctx,4.8,6.2,BD); wallV(ctx,7.2,5.2,BD); wallH(ctx,4.8,7.2,9.2); wallV(ctx,6.0,9.2,BD);

  var T=OWT*S2D;
  ctx.fillStyle=WALL_DARK_2D;
  ctx.fillRect(-T,-T,u(BW)+T*2,T); ctx.fillRect(-T,u(BD),u(BW)+T*2,T);
  ctx.fillRect(-T,-T,T,u(BD)+T*2); ctx.fillRect(u(BW),-T,T,u(BD)+T*2);

  toilet2D(ctx,0.25,0.08); toilet2D(ctx,0.25,4.08); toilet2D(ctx,5.05,0.08); toilet2D(ctx,7.72,0.08); toilet2D(ctx,8.42,0.08);
  sink2D(ctx,1.15,0.08); sink2D(ctx,1.15,4.08); sink2D(ctx,5.85,0.08); sink2D(ctx,8.55,0.08);
  fridge2D(ctx,0.5,3.28,0.55,0.55); fridge2D(ctx,6.85,0.35,0.55,0.85);
  elevator2D(ctx,14.25,0.25,1.75,4.6,'LIFT 1'); elevator2D(ctx,16.15,0.25,1.75,4.6,'LIFT 2');
  staircase2D(ctx,9.85,11.7,2.1,2.3,10);
  for(var j=0;j<6;j++){ desk2D(ctx,0.15,6.5+j*0.88,0.85,0.5); desk2D(ctx,1.2,6.5+j*0.88,0.85,0.5); }
  desk2D(ctx,4.92,9.5,0.85,0.5); desk2D(ctx,6.08,9.5,0.85,0.5);

  door(ctx,2.2,1.75,0.85,'V'); door(ctx,2.2,5.55,0.85,'V'); door(ctx,5.25,3.5,0.80,'H');
  door(ctx,8.05,3.5,0.80,'H'); door(ctx,11.1,5.2,1.00,'H'); door(ctx,4.8,8.75,0.85,'V');
  door(ctx,5.45,6.2,0.80,'H'); door(ctx,5.45,9.2,0.75,'H'); door(ctx,4.88,BD,0.72,'H'); door(ctx,6.2,BD,0.72,'H');

  label2D(ctx,'MALE\nWASHROOM',1.1,1.3,7); label2D(ctx,'FEMALE\nWASHROOM',1.1,5.3,7);
  label2D(ctx,'FEMALE',5.9,1.3,7); label2D(ctx,'WATER\nCOOLER',7.22,1.5,6); label2D(ctx,'MALE',8.7,1.3,7);
  label2D(ctx,'CORRIDOR',3.5,3.2,7); label2D(ctx,'CORRIDOR',3.5,5.6,7); label2D(ctx,'EMPTY ROOM',11.9,1.8,8);
  label2D(ctx,'COMPUTER\nLAB 2',2.4,9.5,7); label2D(ctx,'IMAGE\nPROC.',6.0,7.5,7);
  label2D(ctx,'PROF.\nAO',5.38,10.8,7); label2D(ctx,'PROF.\nPK',6.6,10.8,7);

  ctx.strokeStyle='#0055aa'; ctx.lineWidth=0.8; ctx.fillStyle='#0055aa';
  ctx.font='9px sans-serif'; ctx.textAlign='center';
  ctx.beginPath(); ctx.moveTo(0,-22); ctx.lineTo(u(BW),-22); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0,-27); ctx.lineTo(0,-17); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(u(BW),-27); ctx.lineTo(u(BW),-17); ctx.stroke();
  ctx.fillText('20000',u(BW/2),-25);
  ctx.save(); ctx.translate(-25,u(BD/2)); ctx.rotate(-Math.PI/2);
  ctx.beginPath(); ctx.moveTo(-u(BD/2),0); ctx.lineTo(u(BD/2),0); ctx.stroke();
  ctx.fillText('14000',0,-3); ctx.restore();

  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════════════════
//  3D HELPERS
// ═══════════════════════════════════════════════════════════════════════════
function mat3(color,opts){ return new THREE.MeshLambertMaterial(Object.assign({color:color},opts||{})); }
function box3(scene,x,y,w,d,h,material,zBase){
  var g=new THREE.BoxGeometry(w,h,d); var m=new THREE.Mesh(g,material);
  m.position.set(x+w/2,(zBase||0)+h/2,y+d/2); m.castShadow=true; m.receiveShadow=true; scene.add(m); return m;
}
function floorRect3(scene,x,y,w,d,color){
  var g=new THREE.PlaneGeometry(w,d); var m=new THREE.Mesh(g,mat3(color));
  m.rotation.x=-Math.PI/2; m.position.set(x+w/2,0.01,y+d/2); m.receiveShadow=true; scene.add(m);
}
function outerWall3(scene,x,y,w,d){ box3(scene,x,y,w,d,WH,mat3(WALL_DARK)); }
function innerWallH3(scene,x1,x2,y){ box3(scene,x1,y-IWT/2,x2-x1,IWT,WH,mat3(WALL_INNER)); }
function innerWallV3(scene,x,y1,y2){ box3(scene,x-IWT/2,y1,IWT,y2-y1,WH,mat3(WALL_INNER)); }
function toilet3(scene,x,y){
  box3(scene,x,y,0.5,0.12,0.28,mat3(0xcccccc));
  var bg=new THREE.CylinderGeometry(0.18,0.20,0.20,16); var bm=new THREE.Mesh(bg,mat3(0xfafafa));
  bm.position.set(x+0.25,0.10,y+0.35); bm.castShadow=true; scene.add(bm);
}
function sink3(scene,x,y){ box3(scene,x,y,0.45,0.35,0.08,mat3(0xd0d0d0),0.78); box3(scene,x+0.07,y+0.07,0.30,0.20,0.02,mat3(0xfafafa),0.82); }
function fridge3(scene,x,y){
  box3(scene,x,y,0.55,0.45,1.5,mat3(0x88c0d0));
  box3(scene,x+0.05,y+0.44,0.44,0.04,0.06,mat3(0x336677),0.65);
  box3(scene,x+0.05,y+0.44,0.44,0.04,0.06,mat3(0x336677),1.10);
  box3(scene,x,y+0.44,0.55,0.02,0.02,mat3(0x224455),0.75);
}
function elevator3(scene,x,y,w,d){
  box3(scene,x,y,w,d,WH,mat3(0xc8d4f0));
  box3(scene,x,y,w,0.04,WH*0.75,mat3(0x8899cc));
  box3(scene,x+w/2-0.02,y,0.04,d,WH,mat3(0x8899cc));
}
function staircase3(scene,x,y,w,d,n){
  n=n||10;
  var treadM=mat3(0xe8dfc8); var riserM=mat3(0xd4c8a8);
  var totalDrop=WH; var sh=totalDrop/n; var sd=d/n;
  for(var i=0;i<n;i++){
    var tg=new THREE.BoxGeometry(w,0.04,sd); var tr=new THREE.Mesh(tg,treadM);
    tr.position.set(x+w/2,-(i*sh),y+i*sd+sd/2); tr.castShadow=true; tr.receiveShadow=true; scene.add(tr);
    var rg=new THREE.BoxGeometry(w,sh,0.035); var ri=new THREE.Mesh(rg,riserM);
    ri.position.set(x+w/2,-(i*sh)-sh/2,y+i*sd); ri.castShadow=true; scene.add(ri);
  }
  var bg=new THREE.BoxGeometry(w,totalDrop,0.08); var bw=new THREE.Mesh(bg,mat3(WALL_INNER));
  bw.position.set(x+w/2,-totalDrop/2,y); scene.add(bw);
}
function desk3(scene,x,y,w,d){
  box3(scene,x,y,w||1.1,d||0.55,0.75,mat3(0xc8b880));
  box3(scene,x+(w||1.1)*0.2,y+(d||0.55)*0.6,(w||1.1)*0.6,0.04,0.35,mat3(0x223344),0.75);
}
function door3(scene,x,y,size,isV){
  var dm=mat3(0xffffff);
  if(isV) box3(scene,x-0.04,y,0.06,size,2.1,dm);
  else    box3(scene,x,y-0.04,size,0.06,2.1,dm);
}
function makeLabel3(text,x,y){
  var c=document.createElement('canvas'); c.width=256; c.height=64;
  var ctx=c.getContext('2d'); ctx.clearRect(0,0,256,64);
  ctx.fillStyle='#fff'; ctx.font='bold 18px sans-serif'; ctx.textAlign='center'; ctx.fillText(text,128,38);
  var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true}));
  sp.position.set(x,WH+0.5,y); sp.scale.set(3,0.75,1); return sp;
}

function buildScene3D(scene){
  var fg=new THREE.PlaneGeometry(BW,BD); var fm=new THREE.Mesh(fg,mat3(0xe8e0c4));
  fm.rotation.x=-Math.PI/2; fm.position.set(BW/2,0,BD/2); fm.receiveShadow=true; scene.add(fm);

  floorRect3(scene,0,0,2.2,3.2,0xd8eef8); floorRect3(scene,0,3.2,2.2,0.8,0xeef8ff); floorRect3(scene,0,4.0,2.2,3.2,0xf8d8ee);
  floorRect3(scene,2.2,0,2.8,5.2,0xf5f2ea); floorRect3(scene,5.0,0,1.8,3.5,0xf8d8ee); floorRect3(scene,6.8,0,0.9,3.5,0xeef8ff);
  floorRect3(scene,7.7,0,2.0,3.5,0xd8eef8); floorRect3(scene,9.7,0,4.5,5.2,0xf5f0e2); floorRect3(scene,9.7,3.5,4.5,1.7,0xf5f2ea);
  floorRect3(scene,14.2,0,1.9,5.2,0xe2e8f5); floorRect3(scene,16.1,0,1.9,5.2,0xe2e8f5);
  floorRect3(scene,2.2,5.2,2.8,1.0,0xf5f2ea); floorRect3(scene,5.0,5.2,4.7,1.0,0xf5f2ea);
  floorRect3(scene,0,6.2,4.8,7.8,0xf5f0e0); floorRect3(scene,4.8,6.2,2.4,3.0,0xecf0e2);
  floorRect3(scene,4.8,9.2,1.2,2.8,0xf0ead8); floorRect3(scene,6.0,9.2,1.2,2.8,0xf0ead8);
  floorRect3(scene,7.2,5.2,7.0,8.8,0xf0f0e8); floorRect3(scene,14.2,5.2,5.8,8.8,0xf0f0e8);

  var T=OWT;
  outerWall3(scene,-T,-T,BW+T*2,T); outerWall3(scene,-T,BD,BW+T*2,T);
  outerWall3(scene,-T,-T,T,BD+T*2); outerWall3(scene,BW,-T,T,BD+T*2);

  innerWallV3(scene,2.2,0,BD); innerWallH3(scene,0,2.2,3.2); innerWallH3(scene,0,2.2,4.0); innerWallH3(scene,0,2.2,6.2);
  innerWallV3(scene,5.0,0,5.2); innerWallV3(scene,6.8,0,3.5); innerWallV3(scene,7.7,0,3.5); innerWallV3(scene,9.7,0,5.2);
  innerWallH3(scene,5.0,9.7,3.5); innerWallV3(scene,14.2,0,5.2); innerWallV3(scene,16.1,0,5.2);
  innerWallH3(scene,5.0,BW,5.2); innerWallH3(scene,2.2,5.0,6.2); innerWallH3(scene,5.0,7.2,6.2);
  innerWallV3(scene,4.8,6.2,BD); innerWallV3(scene,7.2,5.2,BD); innerWallH3(scene,4.8,7.2,9.2); innerWallV3(scene,6.0,9.2,BD);

  toilet3(scene,0.25,0.08); toilet3(scene,0.25,4.08); toilet3(scene,5.05,0.08); toilet3(scene,7.72,0.08); toilet3(scene,8.42,0.08);
  sink3(scene,1.15,0.08); sink3(scene,1.15,4.08); sink3(scene,5.85,0.08); sink3(scene,8.55,0.08);
  fridge3(scene,0.5,3.28); fridge3(scene,6.85,0.35);
  elevator3(scene,14.25,0.25,1.75,4.6); elevator3(scene,16.15,0.25,1.75,4.6);
  staircase3(scene,9.85,11.7,2.1,2.3,10);
  box3(scene,9.85-IWT,11.7,IWT,2.3,WH,mat3(WALL_INNER)); box3(scene,9.85+2.1,11.7,IWT,2.3,WH,mat3(WALL_INNER));
  var pitF=new THREE.Mesh(new THREE.PlaneGeometry(2.1,2.3),mat3(0x1a1208));
  pitF.rotation.x=-Math.PI/2; pitF.position.set(9.85+2.1/2,-WH,11.7+2.3/2); scene.add(pitF);

  for(var j=0;j<6;j++){ desk3(scene,0.15,6.5+j*0.88,0.85,0.5); desk3(scene,1.2,6.5+j*0.88,0.85,0.5); }
  desk3(scene,4.92,9.5,0.85,0.5); desk3(scene,6.08,9.5,0.85,0.5);

  door3(scene,2.2,1.75,0.85,true); door3(scene,2.2,5.55,0.85,true); door3(scene,5.25,3.5,0.80,false);
  door3(scene,8.05,3.5,0.80,false); door3(scene,11.1,5.2,1.00,false); door3(scene,4.8,8.75,0.85,true);
  door3(scene,5.45,6.2,0.80,false); door3(scene,5.45,9.2,0.75,false); door3(scene,4.88,BD,0.72,false); door3(scene,6.2,BD,0.72,false);

  var cm=new THREE.Mesh(new THREE.PlaneGeometry(BW,BD),mat3(0xffffff,{transparent:true,opacity:0.04,side:THREE.DoubleSide}));
  cm.rotation.x=Math.PI/2; cm.position.set(BW/2,WH,BD/2); scene.add(cm);

  [['MALE',1.1,1.6],['FEMALE',1.1,5.6],['FEMALE TC',5.9,1.5],['MALE TC',8.7,1.5],
   ['BIG ROOM',11.9,1.8],['COMP LAB 2',2.4,9.5],['CORRIDOR',3.5,5.7],
   ['IMAGE PROC',6.0,7.5],['PROF. AO',5.38,10.8],['PROF. PK',6.6,10.8],
   ['LIFT 1',15.1,2.5],['LIFT 2',17.0,2.5],
  ].forEach(function(l){ scene.add(makeLabel3(l[0],l[1],l[2])); });
}

// ═══════════════════════════════════════════════════════════════════════════
//  EXPORTED COMPONENT — accepts `floorLabel` prop for the title
// ═══════════════════════════════════════════════════════════════════════════
export default function FloorPlanViewer({ floorLabel }) {
  var modeState  = React.useState('2d');
  var mode       = modeState[0]; var setMode = modeState[1];
  var viewState  = React.useState('iso');
  var activeView = viewState[0]; var setActiveView = viewState[1];
  var canvas2Ref = React.useRef(null);
  var mount3Ref  = React.useRef(null);
  var stateRef   = React.useRef({ phi:Math.PI/3.5, theta:Math.PI/4, radius:30, dragging:false, lx:0, ly:0 });
  var camRef     = React.useRef(null);
  var frameRef   = React.useRef(null);

  React.useEffect(function(){
    if(mode!=='2d') return;
    var c=canvas2Ref.current; if(!c) return;
    draw2D(c);
  },[mode]);

  React.useEffect(function(){
    if(mode!=='3d') return;
    var mount=mount3Ref.current; if(!mount) return;
    var W=mount.clientWidth, H=mount.clientHeight;
    var target=new THREE.Vector3(BW/2,0,BD/2);

    var renderer=new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(W,H); renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x1a1410); mount.appendChild(renderer.domElement);

    var scene=new THREE.Scene();
    scene.fog=new THREE.FogExp2(0x1a1410,0.013);
    scene.add(new THREE.AmbientLight(0xfff8f0,0.65));
    var sun=new THREE.DirectionalLight(0xfff5e0,1.3);
    sun.position.set(14,24,16); sun.castShadow=true;
    sun.shadow.mapSize.set(2048,2048);
    sun.shadow.camera.left=-30; sun.shadow.camera.right=30;
    sun.shadow.camera.top=30; sun.shadow.camera.bottom=-30;
    scene.add(sun);
    var fill=new THREE.PointLight(0x88aaff,0.3,50);
    fill.position.set(BW/2,WH+2,BD/2); scene.add(fill);

    var camera=new THREE.PerspectiveCamera(50,W/H,0.1,130);
    camRef.current=camera;
    buildScene3D(scene);

    var s=stateRef.current;
    function updateCam(){
      camera.position.set(
        target.x+s.radius*Math.sin(s.phi)*Math.sin(s.theta),
        target.y+s.radius*Math.cos(s.phi),
        target.z+s.radius*Math.sin(s.phi)*Math.cos(s.theta)
      );
      camera.lookAt(target);
    }
    updateCam();

    function onDown(e){ s.dragging=true; s.lx=e.clientX; s.ly=e.clientY; }
    function onUp(){ s.dragging=false; }
    function onMove(e){
      if(!s.dragging) return;
      s.theta-=(e.clientX-s.lx)*0.008;
      s.phi=Math.max(0.08,Math.min(Math.PI/2-0.01,s.phi+(e.clientY-s.ly)*0.008));
      s.lx=e.clientX; s.ly=e.clientY; updateCam();
    }
    function onWheel(e){ s.radius=Math.max(4,Math.min(55,s.radius+e.deltaY*0.025)); updateCam(); }
    function onTS(e){ s.dragging=true; s.lx=e.touches[0].clientX; s.ly=e.touches[0].clientY; }
    function onTM(e){
      if(!s.dragging) return;
      s.theta-=(e.touches[0].clientX-s.lx)*0.01;
      s.phi=Math.max(0.08,Math.min(Math.PI/2-0.01,s.phi+(e.touches[0].clientY-s.ly)*0.01));
      s.lx=e.touches[0].clientX; s.ly=e.touches[0].clientY; updateCam();
    }
    mount.addEventListener('mousedown',onDown); window.addEventListener('mouseup',onUp);
    window.addEventListener('mousemove',onMove); mount.addEventListener('wheel',onWheel,{passive:true});
    mount.addEventListener('touchstart',onTS,{passive:true}); mount.addEventListener('touchend',onUp);
    mount.addEventListener('touchmove',onTM,{passive:true});

    frameRef.current=requestAnimationFrame(function loop(){
      frameRef.current=requestAnimationFrame(loop); renderer.render(scene,camera);
    });

    function onResize(){
      var W2=mount.clientWidth,H2=mount.clientHeight;
      renderer.setSize(W2,H2); camera.aspect=W2/H2; camera.updateProjectionMatrix();
    }
    window.addEventListener('resize',onResize);

    return function(){
      cancelAnimationFrame(frameRef.current);
      mount.removeEventListener('mousedown',onDown); window.removeEventListener('mouseup',onUp);
      window.removeEventListener('mousemove',onMove); mount.removeEventListener('wheel',onWheel);
      mount.removeEventListener('touchstart',onTS); mount.removeEventListener('touchend',onUp);
      mount.removeEventListener('touchmove',onTM); window.removeEventListener('resize',onResize);
      renderer.dispose();
      if(mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  },[mode]);

  function setView(v){
    setActiveView(v);
    var p=VIEWS[v]; if(!p) return;
    var s=stateRef.current;
    s.phi=p.phi; s.theta=p.theta; s.radius=p.radius;
    var cam=camRef.current; if(!cam) return;
    var t=new THREE.Vector3(BW/2,0,BD/2);
    cam.position.set(t.x+s.radius*Math.sin(s.phi)*Math.sin(s.theta),t.y+s.radius*Math.cos(s.phi),t.z+s.radius*Math.sin(s.phi)*Math.cos(s.theta));
    cam.lookAt(t);
  }

  function btn(label,active,onClick,small){
    return React.createElement('button',{key:label,onClick:onClick,style:{
      padding:small?'4px 10px':'6px 16px', border:'1px solid', cursor:'pointer',
      fontSize:10, letterSpacing:1.5, borderRadius:2, fontFamily:'monospace', textTransform:'uppercase',
      borderColor:active?'#b08840':'#2a2010',
      background:active?'#2e1e06':'transparent',
      color:active?'#b08840':'#554430',
    }},label);
  }

  var e=React.createElement;

  return e('div',{style:{width:'100%',height:'100%',background:'#1a1410',display:'flex',flexDirection:'column',overflow:'hidden'}},

    // ── toolbar ──
    e('div',{style:{padding:'8px 16px',background:'#0c0906',borderBottom:'1px solid #2a1a08',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}},
      e('div',null,
        e('div',{style:{color:'#b08840',fontSize:9,letterSpacing:4,textTransform:'uppercase',fontFamily:'monospace'}},'IIITDM Jabalpur — Floor Plan Viewer'),
        e('div',{style:{color:'#e8d8b0',fontSize:14,fontWeight:700,letterSpacing:1}}, floorLabel || 'Floor Plan')
      ),
      e('div',{style:{display:'flex',gap:6,alignItems:'center'}},
        btn('2D Plan',mode==='2d',function(){setMode('2d');}),
        btn('3D View',mode==='3d',function(){setMode('3d');}),
        mode==='3d' && e('div',{style:{display:'flex',gap:4,marginLeft:8}},
          Object.keys(VIEWS).map(function(v){return btn(v,activeView===v,function(){setView(v);},true);})
        )
      )
    ),

    // ── main area ──
    e('div',{style:{flex:1,display:'flex',overflow:'hidden'}},
      e('div',{style:{flex:1,display:'flex',alignItems:'center',justifyContent:'center',overflow:'auto',background:mode==='2d'?'#cdd8df':'#1a1410',position:'relative'}},
        mode==='2d' && e('canvas',{ref:canvas2Ref,style:{display:'block',maxWidth:'100%',maxHeight:'100%',objectFit:'contain'}}),
        mode==='3d' && e('div',{ref:mount3Ref,style:{width:'100%',height:'100%',cursor:'grab',position:'absolute',top:0,left:0}},
          e('div',{style:{position:'absolute',bottom:10,left:10,color:'#554430',fontSize:10,lineHeight:1.9,pointerEvents:'none',background:'rgba(0,0,0,0.3)',padding:'5px 8px',borderRadius:4,fontFamily:'monospace'}},
            e('div',null,'🖱  Drag — Rotate'),
            e('div',null,'⚲  Scroll — Zoom'),
            e('div',null,'👆  Touch — Supported')
          )
        )
      ),

      // ── sidebar ──
      e('div',{style:{width:150,background:'#100c08',borderLeft:'1px solid #3b1f06',padding:'12px 10px',overflowY:'auto',flexShrink:0}},
        e('div',{style:{color:'#c8a060',fontSize:9,letterSpacing:3,marginBottom:10,textTransform:'uppercase'}},'Legend'),
        ROOM_LEGEND.map(function(item){
          return e('div',{key:item[1],style:{display:'flex',alignItems:'center',gap:6,marginBottom:6}},
            e('div',{style:{width:11,height:11,borderRadius:2,background:item[0],border:'1px solid #554430',flexShrink:0}}),
            e('span',{style:{color:'#998870',fontSize:9}},item[1])
          );
        }),
        e('div',{style:{borderTop:'1px solid #2a2010',marginTop:12,paddingTop:10}},
          e('div',{style:{color:'#c8a060',fontSize:9,letterSpacing:3,marginBottom:8,textTransform:'uppercase'}},'Specs'),
          SPECS.map(function(row){
            return e('div',{key:row[0],style:{display:'flex',justifyContent:'space-between',marginBottom:5}},
              e('span',{style:{color:'#554430',fontSize:9}},row[0]),
              e('span',{style:{color:'#e8d8b8',fontSize:9}},row[1])
            );
          })
        )
      )
    )
  );
}