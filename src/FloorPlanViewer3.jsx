import React from 'react';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════
//  2D — renders the SVG into a canvas
// ═══════════════════════════════════════════════════════════════
function draw2D_3rd(canvas) {
  const svgStr = `<svg viewBox="0 0 1100 680" xmlns="http://www.w3.org/2000/svg">
<defs>
  <marker id="arr" markerWidth="7" markerHeight="7" refX="3.5" refY="6" orient="auto">
    <polygon points="0,0 7,0 3.5,7" fill="#3D2510"/>
  </marker>
</defs>
<rect x="14" y="14" width="1072" height="652" fill="#EDE0C8"/>
<rect x="14"  y="14"  width="130" height="97"  fill="#E0CDB0"/>
<rect x="14"  y="111" width="130" height="97"  fill="#E0CDB0"/>
<rect x="14"  y="208" width="130" height="96"  fill="#E0CDB0"/>
<rect x="144" y="14"  width="230" height="290" fill="#C8DCF0"/>
<rect x="374" y="14"  width="44"  height="140" fill="#C2E0CE"/>
<rect x="418" y="14"  width="44"  height="140" fill="#C2E0CE"/>
<rect x="462" y="14"  width="42"  height="140" fill="#C2E0CE"/>
<rect x="504" y="14"  width="272" height="190" fill="#C8DCF0"/>
<rect x="504" y="204" width="272" height="100" fill="#E0CDB0"/>
<rect x="776" y="14"  width="40"  height="290" fill="#F0E2A0"/>
<rect x="816" y="14"  width="136" height="290" fill="#F0E2A0"/>
<rect x="952" y="14"  width="134" height="290" fill="#F0E2A0"/>
<rect x="14"  y="304" width="130" height="66"  fill="#C2E0CE"/>
<rect x="14"  y="370" width="130" height="66"  fill="#EDE0C8"/>
<rect x="14"  y="436" width="130" height="66"  fill="#C2E0CE"/>
<rect x="14"  y="502" width="130" height="62"  fill="#C8DCF0"/>
<rect x="14"  y="564" width="130" height="102" fill="#C8DCF0"/>
<rect x="144" y="304" width="360" height="166" fill="#E0CDB0"/>
<rect x="144" y="470" width="360" height="196" fill="#E0CDB0"/>
<rect x="590" y="480" width="186" height="186" fill="#D8CCBA"/>
<g stroke="#3D2510" stroke-width="1.5">
  <line x1="590" y1="503" x2="776" y2="503"/>
  <line x1="590" y1="526" x2="776" y2="526"/>
  <line x1="590" y1="549" x2="776" y2="549"/>
  <line x1="590" y1="572" x2="776" y2="572"/>
  <line x1="590" y1="595" x2="776" y2="595"/>
  <line x1="590" y1="618" x2="776" y2="618"/>
  <line x1="590" y1="641" x2="776" y2="641"/>
</g>
<line x1="683" y1="494" x2="683" y2="652" stroke="#3D2510" stroke-width="2" marker-end="url(#arr)"/>
<rect x="0" y="0" width="1100" height="680" fill="none" stroke="#2C1A0E" stroke-width="28"/>
<g fill="#3D2510">
  <rect x="141" y="14"  width="6" height="290"/>
  <rect x="14"  y="108" width="130" height="6"/>
  <rect x="14"  y="205" width="130" height="6"/>
  <rect x="14"  y="301" width="490" height="6"/>
  <rect x="371" y="14"  width="6" height="290"/>
  <rect x="374" y="151" width="130" height="6"/>
  <rect x="415" y="14"  width="6" height="143"/>
  <rect x="459" y="14"  width="6" height="143"/>
  <rect x="501" y="14"  width="6" height="290"/>
  <rect x="504" y="201" width="272" height="6"/>
  <rect x="773" y="14"  width="6" height="290"/>
  <rect x="813" y="14"  width="6" height="290"/>
  <rect x="949" y="14"  width="6" height="290"/>
  <rect x="141" y="304" width="6" height="198"/>
  <rect x="14"  y="367" width="130" height="6"/>
  <rect x="14"  y="433" width="130" height="6"/>
  <rect x="14"  y="499" width="130" height="6"/>
  <rect x="14"  y="561" width="130" height="6"/>
  <rect x="141" y="499" width="6" height="167"/>
  <rect x="144" y="467" width="360" height="6"/>
  <rect x="501" y="304" width="6" height="362"/>
  <rect x="590" y="477" width="186" height="6"/>
  <rect x="587" y="480" width="6" height="186"/>
</g>
<!-- Door symbols -->
<g stroke="#8B5E2F" stroke-width="2" fill="none">
  <line x1="144" y1="48"  x2="174" y2="48"/>
  <path d="M 174,48 A 30,30 0 0 0 144,78" stroke-dasharray="5,3"/>
  <line x1="144" y1="145" x2="174" y2="145"/>
  <path d="M 174,145 A 30,30 0 0 0 144,175" stroke-dasharray="5,3"/>
  <line x1="144" y1="242" x2="174" y2="242"/>
  <path d="M 174,242 A 30,30 0 0 0 144,272" stroke-dasharray="5,3"/>
  <line x1="210" y1="304" x2="210" y2="276"/>
  <path d="M 210,276 A 28,28 0 0 1 238,304" stroke-dasharray="5,3"/>
  <line x1="340" y1="304" x2="340" y2="276"/>
  <path d="M 340,276 A 28,28 0 0 0 312,304" stroke-dasharray="5,3"/>
  <line x1="620" y1="204" x2="620" y2="176"/>
  <path d="M 620,176 A 28,28 0 0 1 648,204" stroke-dasharray="5,3"/>
  <line x1="504" y1="270" x2="532" y2="270"/>
  <path d="M 532,270 A 28,28 0 0 0 504,298" stroke-dasharray="5,3"/>
  <line x1="144" y1="522" x2="144" y2="550"/>
  <path d="M 144,550 A 28,28 0 0 0 172,522" stroke-dasharray="5,3"/>
  <line x1="144" y1="584" x2="144" y2="612"/>
  <path d="M 144,612 A 28,28 0 0 0 172,584" stroke-dasharray="5,3"/>
  <line x1="250" y1="470" x2="250" y2="442"/>
  <path d="M 250,442 A 28,28 0 0 1 278,470" stroke-dasharray="5,3"/>
  <line x1="380" y1="470" x2="380" y2="498"/>
  <path d="M 380,498 A 28,28 0 0 0 408,470" stroke-dasharray="5,3"/>
</g>
<!-- Toilet fixtures -->
<g stroke="#4A7C59" stroke-width="1.4" fill="none">
  <ellipse cx="393" cy="80"  rx="8" ry="10"/><rect x="386" y="60" width="14" height="10" rx="2"/>
  <ellipse cx="393" cy="118" rx="8" ry="10"/><rect x="386" y="98" width="14" height="10" rx="2"/>
  <rect x="430" y="52" width="18" height="15" rx="4"/><circle cx="439" cy="60" r="4"/>
  <rect x="430" y="90" width="18" height="15" rx="4"/><circle cx="439" cy="98" r="4"/>
  <ellipse cx="480" cy="80"  rx="8" ry="10"/><rect x="473" y="60" width="14" height="10" rx="2"/>
  <ellipse cx="480" cy="118" rx="8" ry="10"/><rect x="473" y="98" width="14" height="10" rx="2"/>
  <ellipse cx="50"  cy="332" rx="7" ry="9"/><rect x="44"  y="316" width="13" height="8" rx="2"/>
  <ellipse cx="100" cy="332" rx="7" ry="9"/><rect x="94"  y="316" width="13" height="8" rx="2"/>
  <rect x="65" y="378" width="18" height="28" rx="3"/>
  <ellipse cx="74" cy="375" rx="8" ry="7"/>
  <ellipse cx="50"  cy="458" rx="7" ry="9"/><rect x="44"  y="442" width="13" height="8" rx="2"/>
  <ellipse cx="100" cy="458" rx="7" ry="9"/><rect x="94"  y="442" width="13" height="8" rx="2"/>
</g>
<!-- Labels -->
<g font-family="Georgia,serif" fill="#1A0E06">
  <text x="79"  y="67"  text-anchor="middle" font-size="11" font-weight="700">Dr. DS</text>
  <text x="79"  y="164" text-anchor="middle" font-size="11" font-weight="700">Dr. MKB</text>
  <text x="79"  y="261" text-anchor="middle" font-size="11" font-weight="700">Dr. SKM</text>
  <text x="259" y="145" text-anchor="middle" font-size="16" font-weight="700">COMPUTING</text>
  <text x="259" y="168" text-anchor="middle" font-size="16" font-weight="700">LAB</text>
  <text x="393" y="143" text-anchor="middle" font-size="10" font-weight="700">GIRLS</text>
  <text x="439" y="143" text-anchor="middle" font-size="9"  font-weight="700">CLEANSING</text>
  <text x="480" y="143" text-anchor="middle" font-size="10" font-weight="700">BOYS</text>
  <text x="640" y="97"  text-anchor="middle" font-size="14" font-weight="700">MTECH</text>
  <text x="640" y="117" text-anchor="middle" font-size="14" font-weight="700">STUDY ROOM</text>
  <text x="640" y="248" text-anchor="middle" font-size="12" font-weight="700">STORE ROOM</text>
  <text x="796" y="152" text-anchor="middle" font-size="10" font-weight="700">LIFT 1</text>
  <text x="882" y="152" text-anchor="middle" font-size="10" font-weight="700">LIFT 2</text>
  <text x="1019" y="155" text-anchor="middle" font-size="22">&#8597;</text>
  <text x="79"  y="338" text-anchor="middle" font-size="9"  font-weight="700">BOYS WC</text>
  <text x="79"  y="406" text-anchor="middle" font-size="9"  font-weight="700">WATER</text>
  <text x="79"  y="474" text-anchor="middle" font-size="9"  font-weight="700">GIRLS WC</text>
  <text x="79"  y="533" text-anchor="middle" font-size="11" font-weight="700">PG LAB 1</text>
  <text x="79"  y="607" text-anchor="middle" font-size="10" font-weight="700">RESEARCH LAB 1</text>
  <text x="324" y="382" text-anchor="middle" font-size="13" font-weight="700">HEAD CSE</text>
  <text x="324" y="548" text-anchor="middle" font-size="12" font-weight="700">OFFICE ASST OF CC</text>
  <text x="683" y="420" text-anchor="middle" font-size="26" font-weight="700" fill="#2C1A0E">CC 3RD FLOOR</text>
  <text x="683" y="454" text-anchor="middle" font-size="18" font-weight="700" fill="#3D2510">CSE</text>
  <text x="683" y="480" text-anchor="middle" font-size="13" fill="#5A3E2B">71.41 m&#178;</text>
  <text x="683" y="498" text-anchor="middle" font-size="10" font-weight="700" fill="#3D2510">STAIRCASE</text>
</g>
<!-- Legend -->
<g font-family="Georgia,serif" font-size="9.5" fill="#3D2510">
  <rect x="820" y="318" width="258" height="148" rx="4" fill="white" fill-opacity="0.82" stroke="#3D2510" stroke-width="1"/>
  <text x="834" y="336" font-weight="700" font-size="11">Legend</text>
  <rect x="834" y="343" width="14" height="10" rx="2" fill="#C8DCF0" stroke="#3D2510" stroke-width="0.7"/>
  <text x="854" y="353">Labs / Study Rooms</text>
  <rect x="834" y="361" width="14" height="10" rx="2" fill="#C2E0CE" stroke="#3D2510" stroke-width="0.7"/>
  <text x="854" y="371">Washrooms / Utilities</text>
  <rect x="834" y="379" width="14" height="10" rx="2" fill="#E0CDB0" stroke="#3D2510" stroke-width="0.7"/>
  <text x="854" y="389">Offices / Storage</text>
  <rect x="834" y="397" width="14" height="10" rx="2" fill="#EDE0C8" stroke="#3D2510" stroke-width="0.7"/>
  <text x="854" y="407">Corridor / Open Area</text>
  <rect x="834" y="415" width="14" height="10" rx="2" fill="#F0E2A0" stroke="#3D2510" stroke-width="0.7"/>
  <text x="854" y="425">Lifts</text>
  <rect x="834" y="433" width="14" height="10" rx="2" fill="#D8CCBA" stroke="#3D2510" stroke-width="0.7"/>
  <text x="854" y="443">Staircase</text>
</g>
</svg>`;

  canvas.width  = 1100;
  canvas.height = 680;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const img = new Image();
  img.onload = () => ctx.drawImage(img, 0, 0);
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
}

// ═══════════════════════════════════════════════════════════════
//  3D — Three.js scene for 3rd floor
// ═══════════════════════════════════════════════════════════════
const WH3 = 3;
const OT3 = 0.35;
const WT3 = 0.18;

const COLORS3 = {
  wall:'#4A2F1B', floor:'#D8C3A5', lab:'#7FA7D9', washroom:'#7FBF9F',
  office:'#C9A66B', corridor:'#D8C3A5', lift:'#D4B04C',
  stair:'#A08060', door:'#6B4A18',
};

function mat3rd(hex){ return new THREE.MeshStandardMaterial({color:new THREE.Color(hex),roughness:0.92,metalness:0}); }
const wallMat3rd = mat3rd(COLORS3.wall);

function addBox3rd(scene,x,y,z,w,h,d,material,cast=true){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
  mesh.position.set(x,y+h/2,z); if(cast){mesh.castShadow=true;mesh.receiveShadow=true;} scene.add(mesh);
}
function addFloor3rd(scene,x,z,w,d,color){ addBox3rd(scene,x,0,z,w,0.1,d,mat3rd(color),false); }
function addWall3rd(scene,x,z,w,d,h=WH3,m=wallMat3rd){ addBox3rd(scene,x,0,z,w,h,d,m); }

function roundRect3rd(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();
}

function makeLabel3rd(text,opts={}){
  const {fg='#111111',bg='rgba(255,255,255,0.93)',accent='#8B5E2F',fs=52,padX=22,padY=14,lineGap=8,borderR=10,scale=1.0}=opts;
  const lines=text.split('\n');
  const canvas=document.createElement('canvas');
  const ctx=canvas.getContext('2d');
  ctx.font=`bold ${fs}px 'Segoe UI',Arial,sans-serif`;
  const maxW=Math.max(...lines.map(l=>ctx.measureText(l).width));
  const lineH=fs*1.25;
  const totalH=lineH*lines.length+lineGap*(lines.length-1);
  canvas.width=Math.ceil(maxW+padX*2);
  canvas.height=Math.ceil(totalH+padY*2);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle=bg; roundRect3rd(ctx,0,0,canvas.width,canvas.height,borderR); ctx.fill();
  ctx.strokeStyle='rgba(0,0,0,0.15)'; ctx.lineWidth=2; roundRect3rd(ctx,1,1,canvas.width-2,canvas.height-2,borderR-1); ctx.stroke();
  ctx.fillStyle=fg; ctx.font=`bold ${fs}px 'Segoe UI',Arial,sans-serif`;
  ctx.textBaseline='top'; ctx.textAlign='center';
  lines.forEach((line,i)=>ctx.fillText(line,canvas.width/2,padY+i*(lineH+lineGap)));
  const tex=new THREE.CanvasTexture(canvas);
  tex.anisotropy=16; tex.needsUpdate=true;
  const aspect=canvas.width/canvas.height;
  const worldH=lines.length*1.1*scale;
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthTest:false,transparent:true}));
  spr.scale.set(aspect*worldH,worldH,1); spr.renderOrder=999; return spr;
}

function addLabel3rd(scene,text,x,z,y=0.18,opts={}){
  const s=makeLabel3rd(text,opts); s.position.set(x,y,z); scene.add(s); return s;
}

function buildScene3D_3rd(scene){
  const BW=22,BD=14;
  addFloor3rd(scene,0,0,BW,BD,COLORS3.corridor);
  addWall3rd(scene,0,-7,BW,OT3);
  addWall3rd(scene,0,7,BW,OT3);
  addWall3rd(scene,-11,0,OT3,BD);
  addWall3rd(scene,11,0,OT3,BD);

  // Faculty rooms NW
  addWall3rd(scene,-7.3,-4.5,WT3,5);
  addWall3rd(scene,-9,-5.35,3.4,WT3);
  addWall3rd(scene,-9,-3.85,3.4,WT3);
  addWall3rd(scene,-9,-2,3.4,WT3);
  addFloor3rd(scene,-9.2,-6.1,3.2,1.5,COLORS3.office);
  addFloor3rd(scene,-9.2,-4.6,3.2,1.5,COLORS3.office);
  addFloor3rd(scene,-9.2,-3.1,3.2,1.5,COLORS3.office);
  addLabel3rd(scene,'Dr. DS',   -9.2,-6.1,0.22,{fontSize:46,scale:0.85});
  addLabel3rd(scene,'Dr. MKB',  -9.2,-4.6,0.22,{fontSize:46,scale:0.85});
  addLabel3rd(scene,'Dr. SKM',  -9.2,-3.1,0.22,{fontSize:46,scale:0.85});

  // Computing Lab
  addWall3rd(scene,-4.6,-2,5.4,WT3);
  addWall3rd(scene,-2,-4.5,WT3,5);
  addFloor3rd(scene,-4.65,-4.5,5.2,5,COLORS3.lab);
  addLabel3rd(scene,'COMPUTING\nLAB',-4.65,-4.5,0.22,{fs:48,scale:0.95});

  // Washrooms
  addWall3rd(scene,0,-4.5,4,WT3);
  addWall3rd(scene,-2,-5.75,WT3,2.5);
  addWall3rd(scene,2,-5.75,WT3,2.5);
  addWall3rd(scene,-0.7,-5.75,WT3,2.5);
  addWall3rd(scene,0.7,-5.75,WT3,2.5);
  addFloor3rd(scene,-1.35,-5.75,1.3,2.3,COLORS3.washroom);
  addFloor3rd(scene,0,-5.75,1.3,2.3,COLORS3.washroom);
  addFloor3rd(scene,1.35,-5.75,1.3,2.3,COLORS3.washroom);
  addLabel3rd(scene,'GIRLS',  -1.35,-5.75,0.22,{fontSize:42,scale:0.78});
  addLabel3rd(scene,'CLEAN',   0,   -5.75,0.22,{fontSize:40,scale:0.72});
  addLabel3rd(scene,'BOYS',    1.35,-5.75,0.22,{fontSize:42,scale:0.78});

  // MTech Study Room
  addWall3rd(scene,5.25,-4,6.5,WT3);
  addWall3rd(scene,2,-5.5,WT3,3);
  addWall3rd(scene,8.5,-5.5,WT3,3);
  addFloor3rd(scene,5.25,-5.5,6.3,2.8,COLORS3.lab);
  addLabel3rd(scene,'MTECH\nSTUDY ROOM',5.25,-5.5,0.22,{fontSize:44,scale:0.90});

  // Store Room
  addWall3rd(scene,5.25,-2,6.5,WT3);
  addFloor3rd(scene,5.25,-3,6.3,2,COLORS3.office);
  addLabel3rd(scene,'STORE ROOM',5.25,-3,0.22,{fontSize:46,scale:0.88});

  // Lift shafts
  addWall3rd(scene,8.5,-4.5,WT3,5);
  addFloor3rd(scene,9.45,-5.5,2.1,2.3,COLORS3.lift);
  addFloor3rd(scene,10.65,-5.5,2.1,2.3,COLORS3.lift);
  addLabel3rd(scene,'LIFT 1',9.45,-5.5,0.22,{fontSize:42,scale:0.78});
  addLabel3rd(scene,'LIFT 2',10.65,-5.5,0.22,{fontSize:42,scale:0.78});

  // Utility strip
  addWall3rd(scene,-8.5,-0.5,WT3,3);
  addWall3rd(scene,-9.75,-2,2.5,WT3);
  addWall3rd(scene,-9.75,1,2.5,WT3);
  addWall3rd(scene,-9.75,-1.1,2.5,WT3);
  addWall3rd(scene,-9.75,0,2.5,WT3);
  addFloor3rd(scene,-9.75,-1.55,2.3,0.9,COLORS3.washroom);
  addFloor3rd(scene,-9.75,-0.55,2.3,0.9,COLORS3.corridor);
  addFloor3rd(scene,-9.75,0.5,2.3,0.9,COLORS3.washroom);
  addLabel3rd(scene,'BOYS',  -9.75,-1.55,0.22,{fontSize:40,scale:0.72});
  addLabel3rd(scene,'WATER', -9.75,-0.55,0.22,{fontSize:40,scale:0.72});
  addLabel3rd(scene,'GIRLS', -9.75, 0.5, 0.22,{fontSize:40,scale:0.72});

  // PG Lab 1 & Research Lab 1
  addWall3rd(scene,-7.3,4,WT3,6);
  addWall3rd(scene,-9.15,1,3.7,WT3);
  addWall3rd(scene,-9.15,4,3.7,WT3);
  addWall3rd(scene,-9.15,7,3.7,WT3);
  addFloor3rd(scene,-9.15,2.5,3.5,3,COLORS3.lab);
  addFloor3rd(scene,-9.15,5.5,3.5,3,COLORS3.lab);
  addLabel3rd(scene,'PG LAB 1',     -9.15,2.5,0.22,{fontSize:44,scale:0.82});
  addLabel3rd(scene,'RESEARCH\nLAB 1',-9.15,5.5,0.22,{fontSize:42,scale:0.78});

  // HEAD CSE
  addWall3rd(scene,-4.65,2,5.3,WT3);
  addWall3rd(scene,-4.65,4,5.3,WT3);
  addWall3rd(scene,-2,3,WT3,2);
  addFloor3rd(scene,-4.65,3,5.1,1.8,COLORS3.office);
  addLabel3rd(scene,'HEAD CSE',-4.65,3,0.22,{fontSize:46,scale:0.88});

  // Office Asst of CC
  addWall3rd(scene,-4.65,7,5.3,WT3);
  addFloor3rd(scene,-4.65,5.5,5.1,3,COLORS3.office);
  addLabel3rd(scene,'OFFICE ASST\nOF CC',-4.65,5.5,0.22,{fontSize:42,scale:0.80});

  // Staircase
  for(let i=0;i<7;i++){
    const s=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.14,0.38),mat3rd(COLORS3.stair));
    s.position.set(1.5,i*0.15+0.07,4.5-i*0.38); s.castShadow=true; scene.add(s);
  }
  addLabel3rd(scene,'STAIRCASE',1.5,5.5,0.22,{fontSize:44,scale:0.82});

  // Corridor labels
  addLabel3rd(scene,'CC 3RD FLOOR',5.5,1.5,0.22,{fontSize:56,scale:1.2});
  addLabel3rd(scene,'CSE · 71.41 m²',5.5,3.0,0.22,{fontSize:44,scale:0.90});
}

// ═══════════════════════════════════════════════════════════════
//  COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function FloorPlanViewer3({ floorLabel }) {
  const modeState  = React.useState('2d');
  const mode       = modeState[0]; const setMode = modeState[1];
  const canvas2Ref = React.useRef(null);
  const mount3Ref  = React.useRef(null);
  const stateRef   = React.useRef({ theta:0.6, phi:0.75, r:34, drag:false, rightDrag:false, px:0, py:0 });
  const frameRef   = React.useRef(null);

  React.useEffect(()=>{
    if(mode!=='2d') return;
    const c=canvas2Ref.current; if(!c) return;
    draw2D_3rd(c);
  },[mode]);

  React.useEffect(()=>{
    if(mode!=='3d') return;
    const mount=mount3Ref.current; if(!mount) return;
    const W=mount.clientWidth, H=mount.clientHeight;
    const renderer=new THREE.WebGLRenderer({antialias:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.setSize(W,H); renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x1a1410); mount.appendChild(renderer.domElement);
    const scene=new THREE.Scene();
    scene.fog=new THREE.Fog(0x141210,42,75);
    scene.add(new THREE.AmbientLight(0xd4b896,0.45));
    const sun=new THREE.DirectionalLight(0xfff4e0,1.05);
    sun.position.set(14,22,12); sun.castShadow=true;
    sun.shadow.mapSize.set(2048,2048);
    sun.shadow.camera.left=-25; sun.shadow.camera.right=25;
    sun.shadow.camera.top=25; sun.shadow.camera.bottom=-25;
    scene.add(sun);
    scene.add(new THREE.DirectionalLight(0xc8ddf5,0.28).position.set(-10,10,-10) && new THREE.DirectionalLight(0xc8ddf5,0.28));
    scene.add(new THREE.HemisphereLight(0xe8c898,0x3a2510,0.2));
    const camera=new THREE.PerspectiveCamera(48,W/H,0.1,200);
    camera.position.set(0,22,17); camera.lookAt(0,0,0);
    buildScene3D_3rd(scene);
    const grid=new THREE.GridHelper(30,30,0x6b5040,0x4a3428);
    grid.position.y=0.001; grid.material.opacity=0.18; grid.material.transparent=true; scene.add(grid);
    const s=stateRef.current;
    function updateCam(){
      camera.position.set(s.r*Math.sin(s.phi)*Math.sin(s.theta),s.r*Math.cos(s.phi),s.r*Math.sin(s.phi)*Math.cos(s.theta));
      camera.lookAt(0,0,0);
    }
    updateCam();
    const el=renderer.domElement;
    function onDown(e){ s.drag=true; s.rightDrag=e.button===2; s.px=e.clientX; s.py=e.clientY; }
    function onUp(){ s.drag=false; }
    function onMove(e){
      if(!s.drag) return;
      if(!s.rightDrag){ s.theta-=(e.clientX-s.px)*0.008; s.phi=Math.max(0.1,Math.min(Math.PI/2.05,s.phi-(e.clientY-s.py)*0.008)); }
      s.px=e.clientX; s.py=e.clientY; updateCam();
    }
    function onWheel(e){ s.r=Math.max(6,Math.min(42,s.r+e.deltaY*0.04)); updateCam(); e.preventDefault(); }
    el.addEventListener('mousedown',onDown); el.addEventListener('contextmenu',e=>e.preventDefault());
    window.addEventListener('mousemove',onMove); window.addEventListener('mouseup',onUp);
    el.addEventListener('wheel',onWheel,{passive:false});
    function onResize(){ const w=mount.clientWidth,h=mount.clientHeight; renderer.setSize(w,h); camera.aspect=w/h; camera.updateProjectionMatrix(); }
    window.addEventListener('resize',onResize);
    frameRef.current=requestAnimationFrame(function loop(){ frameRef.current=requestAnimationFrame(loop); renderer.render(scene,camera); });
    return ()=>{
      cancelAnimationFrame(frameRef.current);
      el.removeEventListener('mousedown',onDown); el.removeEventListener('contextmenu',e=>e.preventDefault());
      window.removeEventListener('mousemove',onMove); window.removeEventListener('mouseup',onUp);
      el.removeEventListener('wheel',onWheel); window.removeEventListener('resize',onResize);
      renderer.dispose(); if(mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  },[mode]);

  function btn(label,active,onClick){
    return React.createElement('button',{key:label,onClick,style:{
      padding:'6px 16px',border:'1px solid',cursor:'pointer',fontSize:10,letterSpacing:1.5,
      borderRadius:2,fontFamily:'monospace',textTransform:'uppercase',
      borderColor:active?'#b08840':'#2a2010',background:active?'#2e1e06':'transparent',color:active?'#b08840':'#554430',
    }},label);
  }
  const e=React.createElement;
  return e('div',{style:{width:'100%',height:'100%',background:'#1a1410',display:'flex',flexDirection:'column',overflow:'hidden'}},
    e('div',{style:{padding:'8px 16px',background:'#0c0906',borderBottom:'1px solid #2a1a08',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}},
      e('div',null,
        e('div',{style:{color:'#b08840',fontSize:9,letterSpacing:4,textTransform:'uppercase',fontFamily:'monospace'}},'IIITDM Jabalpur — Floor Plan Viewer'),
        e('div',{style:{color:'#e8d8b0',fontSize:14,fontWeight:700,letterSpacing:1}},floorLabel||'3rd Floor Plan')
      ),
      e('div',{style:{display:'flex',gap:6}},btn('2D Plan',mode==='2d',()=>setMode('2d')),btn('3D View',mode==='3d',()=>setMode('3d')))
    ),
    e('div',{style:{flex:1,overflow:'hidden',position:'relative'}},
      mode==='2d'&&e('div',{style:{width:'100%',height:'100%',overflow:'auto',background:'#cdd8df',display:'flex',alignItems:'center',justifyContent:'center'}},
        e('canvas',{ref:canvas2Ref,style:{display:'block',maxWidth:'100%',maxHeight:'100%',objectFit:'contain'}})
      ),
      mode==='3d'&&e('div',{ref:mount3Ref,style:{width:'100%',height:'100%',cursor:'grab',position:'absolute',top:0,left:0}},
        e('div',{style:{position:'absolute',bottom:10,left:10,color:'#554430',fontSize:10,lineHeight:1.9,pointerEvents:'none',background:'rgba(0,0,0,0.3)',padding:'5px 8px',borderRadius:4,fontFamily:'monospace'}},
          e('div',null,'🖱  Drag — Rotate'),e('div',null,'⚲  Scroll — Zoom'),e('div',null,'🖱  Right-drag — Pan')
        )
      )
    )
  );
}