import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ═══════════════════════════════════════════════════════════════
//  2D FLOOR PLAN
// ═══════════════════════════════════════════════════════════════
function FloorPlan2DFirst() {
  const rooms = [
    { id:"boys-wr-cc",  label:"🚹 Boys\nWashroom",  x:30,  y:40,  w:90,  h:100, fill:"#4fa8d8", stroke:"#2a6e9a", textColor:"#fff", fontSize:11 },
    { id:"girls-wr-cc", label:"🚺 Girls\nWashroom", x:30,  y:148, w:90,  h:100, fill:"#b06ccc", stroke:"#7a3a9a", textColor:"#fff", fontSize:11 },
    { id:"pwd-wr",      label:"♿ PWD\nWashroom",   x:30,  y:256, w:90,  h:100, fill:"#2a90c8", stroke:"#1a5e8a", textColor:"#fff", fontSize:11 },
    { id:"cc-lobby",    label:"🖥️ CC Wing\nLobby",  x:128, y:40,  w:150, h:316, fill:"#2ab8cc", stroke:"#1a7a8a", textColor:"#fff", fontSize:12 },
    { id:"pathway",     label:"🚶\nPathway",         x:286, y:250, w:54,  h:106, fill:"#a09070", stroke:"#706040", textColor:"#fff", fontSize:10 },
    { id:"comp-lab",    label:"💻 Computer\nLab 1", x:30,  y:364, w:148, h:134, fill:"#38b0d0", stroke:"#1a7090", textColor:"#fff", fontSize:12 },
    { id:"server",      label:"🖧 Server\nRoom",     x:286, y:364, w:116, h:74,  fill:"#3a6aaa", stroke:"#1a3a70", textColor:"#fff", fontSize:11 },
    { id:"sys-admin",   label:"⚙️ System\nAdmin",   x:286, y:446, w:116, h:52,  fill:"#8080cc", stroke:"#4040aa", textColor:"#fff", fontSize:11 },
    { id:"divider",     label:"",                   x:408, y:40,  w:14,  h:458, fill:"#3a3028", stroke:"#2a2018", textColor:"#fff", fontSize:10 },
    { id:"boys-wr-main",label:"🚹 Boys\nWashroom",  x:428, y:40,  w:108, h:120, fill:"#4fa8d8", stroke:"#2a6e9a", textColor:"#fff", fontSize:11 },
    { id:"water-zone",  label:"💧 Water\nCoolers",  x:544, y:40,  w:74,  h:120, fill:"#5abcde", stroke:"#2a8aaa", textColor:"#fff", fontSize:10 },
    { id:"girls-wr-main",label:"🚺 Girls\nWashroom",x:626, y:40,  w:108, h:120, fill:"#b06ccc", stroke:"#7a3a9a", textColor:"#fff", fontSize:11 },
    { id:"library",     label:"📚 Library",          x:428, y:168, w:178, h:150, fill:"#d4a020", stroke:"#9a6800", textColor:"#fff", fontSize:14 },
    { id:"study",       label:"📖 Study\nRoom",      x:736, y:40,  w:200, h:150, fill:"#3aae50", stroke:"#1a7030", textColor:"#fff", fontSize:13 },
    { id:"staff-cc",    label:"🖥️ Staff\nof CC",    x:614, y:168, w:174, h:150, fill:"#cc5a44", stroke:"#8a2a1a", textColor:"#fff", fontSize:12 },
    { id:"lift1",       label:"🛗 Lift 1",           x:796, y:198, w:70,  h:120, fill:"#cc9010", stroke:"#8a5e00", textColor:"#fff", fontSize:11 },
    { id:"lift2",       label:"🛗 Lift 2",           x:866, y:198, w:70,  h:120, fill:"#cc9010", stroke:"#8a5e00", textColor:"#fff", fontSize:11 },
    { id:"lobby",       label:"🏛️ ENTRANCE LOBBY",   x:428, y:326, w:508, h:172, fill:"#c8b470", stroke:"#8a7a30", textColor:"#1a0a00", fontSize:16 },
  ];

  return (
    <div style={{width:"100%",height:"100%",overflow:"auto",background:"#f0ede8",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div>
        <svg width={1060} height={520} style={{filter:"drop-shadow(0 8px 32px rgba(0,0,0,0.3))",borderRadius:8}}>
          <rect x={0} y={0} width={1060} height={520} rx={8} fill="#e8e0d0"/>
          <defs>
            <pattern id="gridG" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#d0c8b8" strokeWidth="0.5"/>
            </pattern>
            <filter id="shadowG"><feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.2"/></filter>
          </defs>
          <rect x={0} y={0} width={1060} height={520} fill="url(#gridG)"/>
          <rect x={22} y={22} width={1016} height={476} rx={4} fill="#3a3028"/>
          <rect x={36} y={36} width={988} height={448} rx={2} fill="#c8bc9a"/>
          {rooms.map(r=>(
            <g key={r.id} filter="url(#shadowG)">
              <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill} stroke={r.stroke} strokeWidth={2.5} rx={2}/>
              {r.label&&r.label.split("\n").map((line,i)=>(
                <text key={i} x={r.x+r.w/2} y={r.y+r.h/2+(i-(r.label.split("\n").length-1)/2)*(r.fontSize*1.4)}
                  textAnchor="middle" dominantBaseline="middle" fill={r.textColor}
                  fontSize={r.fontSize} fontWeight="bold" fontFamily="'Segoe UI',sans-serif">{line}</text>
              ))}
            </g>
          ))}
          <rect x={402} y={300} width={18} height={40} rx={2} fill="#ffd700" opacity={0.9}/>
          <text x={411} y={320} textAnchor="middle" fill="#000" fontSize={9} fontWeight="bold">🚪</text>
          <rect x={890} y={460} width={80} height={24} rx={4} fill="none" stroke="#ffd700" strokeWidth={2}/>
          <text x={930} y={476} textAnchor="middle" fill="#ffd700" fontSize={10} fontWeight="bold" fontFamily="sans-serif">▲ MAIN ENTRY</text>
          <rect x={890} y={468} width={80} height={16} fill="#c8bc9a"/>
          <rect x={36} y={36} width={390} height={22} rx={2} fill="rgba(0,40,70,0.7)"/>
          <text x={230} y={51} textAnchor="middle" fill="#40c0e8" fontSize={11} fontWeight="bold" fontFamily="sans-serif" letterSpacing={2}>◀ CC WING (Computer Centre)</text>
          <rect x={428} y={36} width={596} height={22} rx={2} fill="rgba(40,30,0,0.7)"/>
          <text x={726} y={51} textAnchor="middle" fill="#ffd700" fontSize={11} fontWeight="bold" fontFamily="sans-serif" letterSpacing={2}>MAIN WING (Library / Admin / Lobby) ▶</text>
          <g transform="translate(60,460)">
            <circle cx={0} cy={0} r={18} fill="rgba(0,0,0,0.6)" stroke="#ffd700" strokeWidth={1.5}/>
            <text x={0} y={-6} textAnchor="middle" fill="#ff4444" fontSize={12} fontWeight="bold">N</text>
            <text x={0} y={9} textAnchor="middle" fill="#aaa" fontSize={8}>↑</text>
          </g>
        </svg>
        <div style={{marginTop:12,display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center"}}>
          {[["#c8b470","Entrance Lobby"],["#d4a020","Library"],["#3aae50","Study Room"],["#cc5a44","Staff of CC"],
            ["#cc9010","Lifts"],["#2ab8cc","CC Wing Lobby"],["#38b0d0","Computer Lab"],["#3a6aaa","Server Room"],
            ["#8080cc","System Admin"],["#4fa8d8","Boys Washroom"],["#b06ccc","Girls Washroom"],["#2a90c8","PWD Washroom"]
          ].map(([color,label])=>(
            <div key={label} style={{display:"flex",alignItems:"center",gap:5,background:"rgba(0,0,0,0.08)",borderRadius:5,padding:"3px 8px"}}>
              <div style={{width:12,height:12,borderRadius:3,background:color,border:`2px solid ${color}99`}}/>
              <span style={{fontSize:11,fontWeight:600,color:"#333",fontFamily:"'Segoe UI',sans-serif"}}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  3D FLOOR PLAN
// ═══════════════════════════════════════════════════════════════
const WH1=3.6, WT1=0.30, FT1=0.12;
const P1={
  outerWall:0x2e261e,innerWall:0x4a3e30,divWall:0x3a3028,
  fGround:0xc4b690,fLobby:0xc8bb95,fCCLobby:0xa0b8c4,fLibrary:0xd6bc6a,
  fStudy:0x8abe88,fStaff:0xd49878,fBoysWR:0x90b8cc,fGirlsWR:0xb898cc,
  fPWD:0x6898c4,fLab:0x8abcd8,fSrv:0x5c6e88,fSysAdm:0x9898cc,
  fPath:0xa09888,fLift:0xd4b848,door:0xc08840,doorFrame:0xd4a840,
  desk:0x4878a0,monitor:0x0a1018,toilet:0xd8e8f0,server:0x141624,wCooler:0x1868b8,waterTop:0x0a3880,
};

function addBox1(scene,w,h,d,color,x,y,z,ry=0){
  const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshLambertMaterial({color}));
  m.position.set(x,y+h/2,z); m.rotation.y=ry; m.castShadow=m.receiveShadow=true; scene.add(m); return m;
}
function addFloor1(scene,x,z,w,d,color,yBase=0){
  const m=new THREE.Mesh(new THREE.BoxGeometry(w,FT1,d),new THREE.MeshLambertMaterial({color}));
  m.position.set(x,yBase+FT1/2,z); m.receiveShadow=true; scene.add(m);
}
function addWall1(scene,x,z,w,d,color=P1.outerWall){ addBox1(scene,w,WH1,d,color,x,0,z); }

function makeLabel1(text,opts={}){
  const {fg='#ffffff',bg='rgba(0,0,0,0.97)',accent='#ffd700',fs=52,padX=30,padY=18,worldScale=6}=opts;
  const lines=text.split('\n');
  const canvas=document.createElement('canvas');
  const SS=4; const FONT_SZ=fs*SS; const lh=FONT_SZ*1.28;
  const tmp=document.createElement('canvas').getContext('2d');
  tmp.font=`900 ${FONT_SZ}px 'Segoe UI',Arial,sans-serif`;
  const maxW=Math.max(...lines.map(l=>tmp.measureText(l).width));
  const CW=maxW+padX*2*SS; const CH=lines.length*lh+padY*2*SS;
  canvas.width=CW; canvas.height=CH;
  const ctx=canvas.getContext('2d');
  const r=18*SS;
  ctx.fillStyle=bg;
  ctx.beginPath();
  ctx.moveTo(r,0);ctx.lineTo(CW-r,0);ctx.quadraticCurveTo(CW,0,CW,r);
  ctx.lineTo(CW,CH-r);ctx.quadraticCurveTo(CW,CH,CW-r,CH);
  ctx.lineTo(r,CH);ctx.quadraticCurveTo(0,CH,0,CH-r);
  ctx.lineTo(0,r);ctx.quadraticCurveTo(0,0,r,0);ctx.closePath();
  ctx.fill();
  ctx.strokeStyle=accent+'ff'; ctx.lineWidth=4*SS/4; ctx.stroke();
  ctx.fillStyle=fg; ctx.font=`900 ${FONT_SZ}px 'Segoe UI',Arial,sans-serif`;
  ctx.textAlign='center'; ctx.textBaseline='middle';
  lines.forEach((line,i)=>ctx.fillText(line,CW/2,padY*SS+(i+0.5)*lh));
  const tex=new THREE.CanvasTexture(canvas);
  tex.needsUpdate=true;
  const aspect=CH/CW;
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthTest:false,sizeAttenuation:true,transparent:true}));
  spr.scale.set(worldScale,worldScale*aspect,1); return spr;
}

function roomLbl1(scene,text,x,z){ const s=makeLabel1(text,{fs:40,worldScale:5}); s.position.set(x,WH1+1.2,z); scene.add(s); }
function smallLbl1(scene,text,x,y,z){ const s=makeLabel1(text,{fs:34,worldScale:4}); s.position.set(x,y,z); scene.add(s); }

function addDoor1(scene,x,z,ry=0){
  const pts=[]; for(let a=0;a<=Math.PI/2;a+=Math.PI/22) pts.push(new THREE.Vector3(Math.cos(a)*1.1,0,Math.sin(a)*1.1));
  const arc=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0xffd700,linewidth:2}));
  arc.position.set(x,0.07,z); arc.rotation.y=ry; scene.add(arc);
  const leaf=new THREE.Mesh(new THREE.BoxGeometry(0.09,WH1*0.85,1.1),new THREE.MeshLambertMaterial({color:P1.door}));
  const ang=ry+Math.PI/4;
  leaf.position.set(x+Math.sin(ang)*0.55,WH1*0.425,z+Math.cos(ang)*0.55); leaf.rotation.y=ry; scene.add(leaf);
}
function addToilet1(scene,x,z,ry=0){
  addBox1(scene,0.54,0.42,0.68,P1.toilet,x,0,z,ry);
  const bowl=new THREE.Mesh(new THREE.BoxGeometry(0.46,0.11,0.46),new THREE.MeshLambertMaterial({color:0xc4d8ec}));
  bowl.position.set(x,0.47,z); scene.add(bowl);
}
function addWaterCooler1(scene,x,z){
  addBox1(scene,0.54,1.1,0.54,P1.wCooler,x,0,z);
  addBox1(scene,0.42,0.28,0.42,P1.waterTop,x,1.1,z);
}
function addServerRack1(scene,x,z){
  addBox1(scene,0.6,2.1,0.68,P1.server,x,0,z);
  for(let i=0;i<6;i++) addBox1(scene,0.48,0.1,0.62,0x12141e,x,0.24+i*0.3,z);
}
function addDesk1(scene,x,z,ry=0){
  addBox1(scene,1.1,0.76,0.65,P1.desk,x,0,z,ry);
  addBox1(scene,0.68,0.46,0.06,P1.monitor,x,0.76,z-0.28,ry);
}

function buildScene3D_1st(scene){
  addFloor1(scene,-1,0,42,36,P1.fGround);
  // Outer walls
  addWall1(scene,-1,-18,42,WT1); addWall1(scene,-1,18,42,WT1);
  addWall1(scene,-22,0,WT1,36); addWall1(scene,20,0,WT1,36);
  // Entry gap
  addBox1(scene,0.5,WH1,0.5,0x5a4a2e,-4,0,18); addBox1(scene,0.5,WH1,0.5,0x5a4a2e,6,0,18);
  addBox1(scene,10.5,0.38,0.5,0x4a3a1e,1,WH1-0.19,18);

  // Dividing wall
  addWall1(scene,-8,-5,WT1*1.5,26,P1.divWall);
  addWall1(scene,-8,14,WT1*1.5,8,P1.divWall);
  addDoor1(scene,-8,8.5,Math.PI/2);
  smallLbl1(scene,'🚪 Connecting\nDoor',-8,WH1+0.8,8.5);

  // Boys WR (right wing)
  addFloor1(scene,-5,-14.5,6,7,P1.fBoysWR);
  addWall1(scene,-2,-14.5,WT1,7,P1.innerWall); addWall1(scene,-5,-11,6,WT1,P1.innerWall);
  addToilet1(scene,-7.2,-17); addToilet1(scene,-7.2,-15); addToilet1(scene,-7.2,-13);
  addDoor1(scene,-2.15,-13,-Math.PI/2); roomLbl1(scene,'🚹 Boys\nWashroom',-5,-14.5);

  // Water coolers
  addFloor1(scene,0,-14.5,4,7,0xaac2d4);
  addWall1(scene,2,-14.5,WT1,7,P1.innerWall); addWall1(scene,0,-11,4,WT1,P1.innerWall);
  addWaterCooler1(scene,-0.9,-16.5); addWaterCooler1(scene,0.9,-16.5);
  addWaterCooler1(scene,-0.9,-13.8); addWaterCooler1(scene,0.9,-13.8);
  smallLbl1(scene,'💧 Water\nCoolers',0,2.8,-15.5);

  // Girls WR (right wing)
  addFloor1(scene,5,-14.5,6,7,P1.fGirlsWR);
  addWall1(scene,8,-14.5,WT1,7,P1.innerWall); addWall1(scene,5,-11,6,WT1,P1.innerWall);
  addToilet1(scene,2.8,-17,Math.PI); addToilet1(scene,5,-17,Math.PI); addToilet1(scene,7.2,-17,Math.PI);
  addDoor1(scene,2.15,-13,Math.PI/2); roomLbl1(scene,'🚺 Girls\nWashroom',5,-14.5);
  addWall1(scene,0,-11,16,WT1,P1.innerWall);

  // Library
  addFloor1(scene,-3,-6.5,10,9,P1.fLibrary);
  addWall1(scene,2,-6.5,WT1,9,P1.innerWall); addWall1(scene,-3,-2,10,WT1,P1.innerWall);
  addDoor1(scene,-1,-2.15,Math.PI); roomLbl1(scene,'📚 LIBRARY',-3,-6.5);

  // Study Room
  addFloor1(scene,14,-13.5,12,9,P1.fStudy);
  addWall1(scene,8,-13.5,WT1,9,P1.innerWall); addWall1(scene,14,-9,12,WT1,P1.innerWall);
  addDoor1(scene,8.15,-12.5,Math.PI/2); roomLbl1(scene,'📖 Study Room',14,-13.5);

  // Staff of CC
  addFloor1(scene,7,-5.5,10,7,P1.fStaff);
  addWall1(scene,2,-5.5,WT1,7,P1.innerWall); addWall1(scene,12,-5.5,WT1,7,P1.innerWall);
  addWall1(scene,7,-2,10,WT1,P1.innerWall); addDoor1(scene,2.15,-4.5,Math.PI/2);
  roomLbl1(scene,'🖥️ Staff of CC',7,-5.5);

  // Lifts
  addFloor1(scene,17,-3,6,11,P1.fLift);
  addWall1(scene,14,-3,WT1,11,P1.innerWall);
  addBox1(scene,2.1,WH1*0.95,2.3,0xd4b848,17,-5.5,0); addBox1(scene,2.1,WH1*0.95,2.3,0xd4b848,17,0,0);
  roomLbl1(scene,'🛗 Lift 1',17,-5.5); roomLbl1(scene,'🛗 Lift 2',17,0);

  // Entrance Lobby
  addFloor1(scene,3,8,22,20,P1.fLobby);
  const lobbyLbl=makeLabel1('🏛️  ENTRANCE LOBBY',{fs:70,padX:60,padY:40,worldScale:12});
  lobbyLbl.position.set(3,2.4,12); scene.add(lobbyLbl);

  // Boys WR CC (left wing)
  addFloor1(scene,-19.5,-15,5,6,P1.fBoysWR);
  addWall1(scene,-17,-15,WT1,6,P1.innerWall); addWall1(scene,-19.5,-12,5,WT1,P1.innerWall);
  addToilet1(scene,-21.2,-17,Math.PI/2); addToilet1(scene,-21.2,-15,Math.PI/2);
  addDoor1(scene,-17.15,-13.5,Math.PI/2); roomLbl1(scene,'🚹 Boys WR',-19.5,-15);

  // Girls WR CC
  addFloor1(scene,-19.5,-9,5,6,P1.fGirlsWR);
  addWall1(scene,-17,-9,WT1,6,P1.innerWall); addWall1(scene,-19.5,-6,5,WT1,P1.innerWall);
  addToilet1(scene,-21.2,-11,Math.PI/2); addToilet1(scene,-21.2,-9,Math.PI/2); addToilet1(scene,-21.2,-7,Math.PI/2);
  addDoor1(scene,-17.15,-8,Math.PI/2); roomLbl1(scene,'🚺 Girls WR',-19.5,-9);

  // PWD WR
  addFloor1(scene,-19.5,-3,5,6,P1.fPWD);
  addWall1(scene,-17,-3,WT1,6,P1.innerWall); addWall1(scene,-19.5,0,5,WT1,P1.innerWall);
  addToilet1(scene,-21.2,-5,Math.PI/2); addToilet1(scene,-21.2,-2.5,Math.PI/2);
  addDoor1(scene,-17.15,-2,Math.PI/2); roomLbl1(scene,'♿ PWD WR',-19.5,-3);

  // CC Lobby
  addFloor1(scene,-12.5,-6,9,24,P1.fCCLobby);
  addWall1(scene,-12.5,6,9,WT1,P1.innerWall);
  roomLbl1(scene,'🖥️ CC Wing\nLobby',-12.5,-6);
  addWaterCooler1(scene,-9.5,-14); addWaterCooler1(scene,-9.5,-11.5); addWaterCooler1(scene,-9.5,-9);

  // Pathway
  addFloor1(scene,-15.5,12,3,12,P1.fPath);
  addWall1(scene,-14,12,WT1,12,P1.innerWall); addWall1(scene,-17,12,WT1,12,P1.innerWall);
  smallLbl1(scene,'🚶 Pathway',-15.5,2.0,12);

  // Computer Lab 1
  addFloor1(scene,-19.5,12,5,12,P1.fLab);
  addWall1(scene,-19.5,6,5,WT1,P1.innerWall);
  for(let r=0;r<3;r++) for(let c=0;c<2;c++) addDesk1(scene,-21.2+c*1.8,7.8+r*2.8);
  addDoor1(scene,-17.15,7.5,Math.PI/2); roomLbl1(scene,'💻 Computer\nLab 1',-19.5,12);

  // Server Room
  addFloor1(scene,-11,9,6,6,P1.fSrv);
  addWall1(scene,-11,6,6,WT1,P1.innerWall); addWall1(scene,-11,12,6,WT1,P1.innerWall);
  addServerRack1(scene,-13.2,7.5); addServerRack1(scene,-13.2,9.5); addServerRack1(scene,-9.5,7.5);
  addDoor1(scene,-14.15,7.5,Math.PI/2); roomLbl1(scene,'🖧 Server\nRoom',-11,9);

  // System Admin
  addFloor1(scene,-11,15,6,6,P1.fSysAdm);
  addWall1(scene,-11,12,6,WT1,P1.innerWall);
  addDesk1(scene,-13,13.5); addDesk1(scene,-11,13.5); addDesk1(scene,-9.5,15.5);
  addDoor1(scene,-14.15,13.5,Math.PI/2); roomLbl1(scene,'⚙️ System\nAdmin',-11,15);

  // Wing banners
  const ccBanner=makeLabel1('◀  CC WING\n(Computer Centre)',{fs:56,padX:60,padY:36,worldScale:10,accent:'#40d0f0'});
  ccBanner.position.set(-15,WH1+3.8,0); scene.add(ccBanner);
  const mainBanner=makeLabel1('MAIN WING  ▶\n(Library / Lobby)',{fs:56,padX:60,padY:36,worldScale:11});
  mainBanner.position.set(6,WH1+3.8,0); scene.add(mainBanner);
  const entryLbl=makeLabel1('▶  MAIN ENTRY  ◀',{fs:68,padX:70,padY:40,worldScale:11,accent:'#ffd700'});
  entryLbl.position.set(1,WH1+2.4,20.0); scene.add(entryLbl);

  const grid=new THREE.GridHelper(130,100,0x0c1828,0x080e1e);
  grid.position.y=-0.06; scene.add(grid);
}

function FloorPlan3DFirst(){
  const mountRef=useRef(null);
  useEffect(()=>{
    const mount=mountRef.current;
    const W=mount.clientWidth,H=mount.clientHeight;
    const renderer=new THREE.WebGLRenderer({antialias:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.setSize(W,H); renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap; renderer.setClearColor(0x060c18);
    mount.appendChild(renderer.domElement);
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(46,W/H,0.1,300);
    scene.add(new THREE.AmbientLight(0xfff0d8,0.6));
    const sun=new THREE.DirectionalLight(0xfffce8,1.4);
    sun.position.set(22,55,32); sun.castShadow=true;
    sun.shadow.mapSize.setScalar(2048);
    sun.shadow.camera.left=sun.shadow.camera.bottom=-65;
    sun.shadow.camera.right=sun.shadow.camera.top=65; sun.shadow.camera.far=200;
    scene.add(sun);
    scene.add(new THREE.DirectionalLight(0x88aaff,0.3).position.set(-28,22,-22)&&new THREE.DirectionalLight(0x88aaff,0.3));
    buildScene3D_1st(scene);
    let theta=0.25,phi=1.0,radius=78,tT=theta,tP=phi,tR=radius,drag=false,prev={x:0,y:0};
    function updateCam(){
      camera.position.set(radius*Math.sin(phi)*Math.sin(theta),radius*Math.cos(phi),radius*Math.sin(phi)*Math.cos(theta));
      camera.lookAt(-1,2,0);
    }
    updateCam();
    const onD=e=>{drag=true;prev={x:e.clientX,y:e.clientY};};
    const onM=e=>{if(!drag)return;tT-=(e.clientX-prev.x)*0.005;tP=Math.max(0.12,Math.min(1.52,tP+(e.clientY-prev.y)*0.005));prev={x:e.clientX,y:e.clientY};};
    const onU=()=>drag=false;
    const onW=e=>{tR=Math.max(14,Math.min(130,tR+e.deltaY*0.07));e.preventDefault();};
    mount.addEventListener('mousedown',onD); window.addEventListener('mousemove',onM);
    window.addEventListener('mouseup',onU); mount.addEventListener('wheel',onW,{passive:false});
    let raf;
    const animate=()=>{
      raf=requestAnimationFrame(animate);
      theta+=(tT-theta)*0.09; phi+=(tP-phi)*0.09; radius+=(tR-radius)*0.09;
      updateCam(); renderer.render(scene,camera);
    };
    animate();
    const onResize=()=>{const w=mount.clientWidth,h=mount.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();};
    window.addEventListener('resize',onResize);
    return()=>{
      cancelAnimationFrame(raf); window.removeEventListener('mousemove',onM); window.removeEventListener('mouseup',onU);
      window.removeEventListener('resize',onResize); mount.removeEventListener('mousedown',onD); mount.removeEventListener('wheel',onW);
      renderer.dispose(); if(mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  },[]);
  return(
    <div style={{width:"100%",height:"100%",position:"relative"}}>
      <div ref={mountRef} style={{width:"100%",height:"100%",cursor:"grab"}}/>
      <div style={{position:"absolute",bottom:20,right:20,background:"rgba(3,8,22,0.9)",border:"1px solid rgba(50,90,150,0.5)",borderRadius:10,padding:"10px 14px",color:"#4a6888",fontSize:11,lineHeight:1.8}}>
        <div style={{color:"#ffd700",fontWeight:800,fontSize:12,marginBottom:3}}>CONTROLS</div>
        <div>🖱️ Drag — Rotate</div><div>🖱️ Scroll — Zoom</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  EXPORTED COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function FloorPlanViewer1({ floorLabel }) {
  const [tab, setTab] = useState('2d');
  function btn(label,active,onClick){
    return (
      <button key={label} onClick={onClick} style={{
        padding:'6px 16px',border:'1px solid',cursor:'pointer',fontSize:10,letterSpacing:1.5,
        borderRadius:2,fontFamily:'monospace',textTransform:'uppercase',
        borderColor:active?'#b08840':'#2a2010',background:active?'#2e1e06':'transparent',color:active?'#b08840':'#554430',
      }}>{label}</button>
    );
  }
  return (
    <div style={{width:'100%',height:'100%',background:'#1a1410',display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <div style={{padding:'8px 16px',background:'#0c0906',borderBottom:'1px solid #2a1a08',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
        <div>
          <div style={{color:'#b08840',fontSize:9,letterSpacing:4,textTransform:'uppercase',fontFamily:'monospace'}}>IIITDM Jabalpur — Floor Plan Viewer</div>
          <div style={{color:'#e8d8b0',fontSize:14,fontWeight:700,letterSpacing:1}}>{floorLabel||'1st Floor Plan'}</div>
        </div>
        <div style={{display:'flex',gap:6}}>
          {btn('2D Plan',tab==='2d',()=>setTab('2d'))}
          {btn('3D View',tab==='3d',()=>setTab('3d'))}
        </div>
      </div>
      <div style={{flex:1,overflow:'hidden',position:'relative'}}>
        {tab === '2d' ? <FloorPlan2DFirst /> : <FloorPlan3DFirst />}

      </div>
    </div>
  );
}