import React from 'react';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════
//  LABEL SYSTEM
// ═══════════════════════════════════════════════════════════════════
const LABEL_CACHE = new Map();

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function makeLabelSprite(lines, opts = {}) {
  const key = lines.join('|') + JSON.stringify(opts);
  if (LABEL_CACHE.has(key)) return LABEL_CACHE.get(key).clone();
  const {
    fontSize = 52, fontFace = '"Trebuchet MS", Arial, sans-serif', fontWeight = 'bold',
    textColor = '#000000', bgColor = 'rgba(255,255,255,0.93)',
    padX = 22, padY = 14, lineGap = 8, borderR = 10, scale = 1.0
  } = opts;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = `${fontWeight} ${fontSize}px ${fontFace}`;
  const lineWidths = lines.map(l => ctx.measureText(l).width);
  const maxW = Math.max(...lineWidths);
  const lineH = fontSize * 1.25;
  const totalH = lineH * lines.length + lineGap * (lines.length - 1);
  canvas.width = Math.ceil(maxW + padX * 2);
  canvas.height = Math.ceil(totalH + padY * 2);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = bgColor;
  roundRect(ctx, 0, 0, canvas.width, canvas.height, borderR); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 2;
  roundRect(ctx, 1, 1, canvas.width - 2, canvas.height - 2, borderR - 1); ctx.stroke();
  ctx.fillStyle = textColor;
  ctx.font = `${fontWeight} ${fontSize}px ${fontFace}`;
  ctx.textBaseline = 'top'; ctx.textAlign = 'center';
  lines.forEach((line, i) => { ctx.fillText(line, canvas.width / 2, padY + i * (lineH + lineGap)); });
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.anisotropy = 16; tex.needsUpdate = true;
  const aspect = canvas.width / canvas.height;
  const worldH = lines.length * 1.1 * scale;
  const mat = new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(aspect * worldH, worldH, 1);
  sprite.renderOrder = 999;
  LABEL_CACHE.set(key, sprite);
  return sprite;
}

// ═══════════════════════════════════════════════════════════════════
//  SCENE CONSTANTS
// ═══════════════════════════════════════════════════════════════════
const WALL_H = 3.4;
const OUTER_T = 0.40;
const INNER_T = 0.18;
const BW = 32, BD = 19;
const HW = BW / 2, HD = BD / 2;
const tx = bx => bx - HW;
const tz = bz => bz - HD;
const cx = (x1, x2) => tx((x1 + x2) / 2);
const cz = (z1, z2) => tz((z1 + z2) / 2);
const bw = (x1, x2) => x2 - x1;
const bd = (z1, z2) => z2 - z1;

// ═══════════════════════════════════════════════════════════════════
//  MATERIALS
// ═══════════════════════════════════════════════════════════════════
const MATS = {
  outerWall: new THREE.MeshLambertMaterial({ color: 0x4a3020 }),
  innerWall: new THREE.MeshLambertMaterial({ color: 0x7a5c40 }),
  floor:     new THREE.MeshLambertMaterial({ color: 0xe8d9b8 }),
  lab:       new THREE.MeshLambertMaterial({ color: 0xb8ccd4 }),
  cabin:     new THREE.MeshLambertMaterial({ color: 0xc4d0bc }),
  wc:        new THREE.MeshLambertMaterial({ color: 0xa8bcc8 }),
  lift:      new THREE.MeshLambertMaterial({ color: 0x909090 }),
  liftInner: new THREE.MeshLambertMaterial({ color: 0x606060 }),
  stair:     new THREE.MeshLambertMaterial({ color: 0x9a9a8a }),
  stairStep: new THREE.MeshLambertMaterial({ color: 0xc0bda8 }),
  stairAlt:  new THREE.MeshLambertMaterial({ color: 0xd8d4bc }),
  seminar:   new THREE.MeshLambertMaterial({ color: 0xd4c4a0 }),
  research:  new THREE.MeshLambertMaterial({ color: 0xc8b8a0 }),
  staff:     new THREE.MeshLambertMaterial({ color: 0xd0c8b0 }),
  door:      new THREE.MeshLambertMaterial({ color: 0x8B5E2A }),
  cse:       new THREE.MeshLambertMaterial({ color: 0xddd0aa }),
  compLab:   new THREE.MeshLambertMaterial({ color: 0xCBBEDE }),
};

// ═══════════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════════
function addBox(scene, scx, scz, w, d, h, mat, yBase = 0) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(scx, yBase + h / 2, scz);
  mesh.castShadow = mesh.receiveShadow = true;
  scene.add(mesh); return mesh;
}
function addSlab(scene, scx, scz, w, d, mat, yBase = 0, thick = 0.06) {
  const geo = new THREE.BoxGeometry(w, thick, d);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(scx, yBase + thick / 2, scz);
  mesh.receiveShadow = true; scene.add(mesh); return mesh;
}
function addDoor(scene, x, z, w, angle) {
  const geo = new THREE.BoxGeometry(w, WALL_H * 0.95, 0.07);
  const mesh = new THREE.Mesh(geo, MATS.door);
  mesh.position.set(x, WALL_H * 0.95 / 2, z);
  mesh.rotation.y = angle; scene.add(mesh);
}
function addLabel(scene, lines, scx, scz, y = 0.18, opts = {}) {
  const sprite = makeLabelSprite(Array.isArray(lines) ? lines : [lines], opts);
  sprite.position.set(scx, y, scz); scene.add(sprite); return sprite;
}

// ═══════════════════════════════════════════════════════════════════
//  FLOOR PLAN 3D
// ═══════════════════════════════════════════════════════════════════
function buildFloorPlan(scene) {
  // Floor slab
  addSlab(scene, 0, 0, BW, BD, MATS.floor, 0, 0.08);

  // Outer walls
  addBox(scene, 0, tz(OUTER_T / 2), BW, OUTER_T, WALL_H, MATS.outerWall);
  addBox(scene, 0, tz(BD - OUTER_T / 2), BW, OUTER_T, WALL_H, MATS.outerWall);
  addBox(scene, tx(OUTER_T / 2), 0, OUTER_T, BD, WALL_H, MATS.outerWall);
  addBox(scene, tx(BW - OUTER_T / 2), 0, OUTER_T, BD, WALL_H, MATS.outerWall);

  // West cabin strip: Dr.RKR / Dr.ND / Dr.MS
  const cabX0 = OUTER_T, cabX1 = 4.0;
  const cabDz = (8.8 - OUTER_T) / 3;
  addBox(scene, tx(cabX1), cz(OUTER_T, 8.8), INNER_T, bd(OUTER_T, 8.8), WALL_H, MATS.innerWall);
  [1, 2].forEach(i => { const zz = OUTER_T + cabDz * i; addBox(scene, cx(cabX0, cabX1), tz(zz), bw(cabX0, cabX1), INNER_T, WALL_H, MATS.innerWall); });
  addBox(scene, cx(cabX0, cabX1), tz(8.8), bw(cabX0, cabX1), INNER_T, WALL_H, MATS.innerWall);
  ['Dr. RKR', 'Dr. ND', 'Dr. MS'].forEach((name, i) => {
    const z0 = OUTER_T + cabDz * i, z1 = z0 + cabDz;
    addSlab(scene, cx(cabX0, cabX1), cz(z0, z1), bw(cabX0, cabX1) - 0.2, cabDz - 0.2, MATS.cabin, 0.08);
    addLabel(scene, [name], cx(cabX0, cabX1), cz(z0, z1), 0.22, { fontSize: 46, scale: 0.85 });
  });

  // Dr. AS
  const asX0 = cabX1, asX1 = 9.0, asZ0 = OUTER_T, asZ1 = 3.4;
  addSlab(scene, cx(asX0, asX1), cz(asZ0, asZ1), bw(asX0, asX1) - 0.2, bd(asZ0, asZ1) - 0.2, MATS.cabin, 0.08);
  addBox(scene, tx(asX1), cz(asZ0, asZ1), INNER_T, bd(asZ0, asZ1), WALL_H, MATS.innerWall);
  addBox(scene, cx(asX0, asX1), tz(asZ1), bw(asX0, asX1), INNER_T, WALL_H, MATS.innerWall);
  addLabel(scene, ['Dr. AS'], cx(asX0, asX1), cz(asZ0, asZ1), 0.22, { fontSize: 46, scale: 0.85 });

  // Tinkering Lab
  const tlX0 = asX1, tlX1 = 14.5, tlZ0 = OUTER_T, tlZ1 = 7.2;
  addSlab(scene, cx(tlX0, tlX1), cz(tlZ0, tlZ1), bw(tlX0, tlX1) - 0.2, bd(tlZ0, tlZ1) - 0.2, MATS.lab, 0.08);
  addBox(scene, tx(tlX1), cz(tlZ0, tlZ1), INNER_T, bd(tlZ0, tlZ1), WALL_H, MATS.innerWall);
  addBox(scene, cx(tlX0, tlX0 + 1.8), tz(tlZ1), 1.8, INNER_T, WALL_H, MATS.innerWall);
  addBox(scene, cx(tlX1 - 1.8, tlX1), tz(tlZ1), 1.8, INNER_T, WALL_H, MATS.innerWall);
  addDoor(scene, tx(tlX0 + 1.8 + 0.5), tz(tlZ1 - 0.45), 1.1, -Math.PI / 4);
  addLabel(scene, ['Tinkering', 'Lab'], cx(tlX0, tlX1), cz(tlZ0, tlZ1), 0.22, { fontSize: 48, scale: 0.95 });

  // Washrooms
  const wrX0 = tlX1, wrX1 = 20.0, wrZ0 = OUTER_T, wrZ1 = 5.0;
  const wrSeg = bw(wrX0, wrX1) / 3;
  addBox(scene, tx(wrX1), cz(wrZ0, wrZ1), INNER_T, bd(wrZ0, wrZ1), WALL_H, MATS.innerWall);
  addBox(scene, cx(wrX0, wrX1), tz(wrZ1), bw(wrX0, wrX1), INNER_T, WALL_H, MATS.innerWall);
  [1, 2].forEach(i => addBox(scene, tx(wrX0 + wrSeg * i), cz(wrZ0, wrZ1), INNER_T, bd(wrZ0, wrZ1), WALL_H, MATS.innerWall));
  const wrColors = [MATS.wc, new THREE.MeshLambertMaterial({ color: 0xb4ccd8 }), MATS.wc];
  const wrNames = [['Girls', 'WC'], ['Cleansing'], ['Boys', 'WC']];
  [0, 1, 2].forEach(i => {
    const x0 = wrX0 + wrSeg * i, x1 = x0 + wrSeg;
    addSlab(scene, cx(x0, x1), cz(wrZ0, wrZ1), wrSeg - 0.2, bd(wrZ0, wrZ1) - 0.2, wrColors[i], 0.08);
    addLabel(scene, wrNames[i], cx(x0, x1), cz(wrZ0, wrZ1), 0.22, { fontSize: 42, scale: 0.78 });
  });

  // IOT Lab
  const iotX0 = wrX1, iotX1 = 26.0, iotZ0 = OUTER_T, iotZ1 = 5.8;
  addSlab(scene, cx(iotX0, iotX1), cz(iotZ0, iotZ1), bw(iotX0, iotX1) - 0.2, bd(iotZ0, iotZ1) - 0.2, MATS.lab, 0.08);
  addBox(scene, tx(iotX0), cz(iotZ0, iotZ1), INNER_T, bd(iotZ0, iotZ1), WALL_H, MATS.innerWall);
  addBox(scene, tx(iotX1), cz(iotZ0, iotZ1), INNER_T, bd(iotZ0, iotZ1), WALL_H, MATS.innerWall);
  addBox(scene, cx(iotX0, iotX1), tz(iotZ1), bw(iotX0, iotX1), INNER_T, WALL_H, MATS.innerWall);
  addDoor(scene, cx(iotX0, iotX1) + 0.6, tz(iotZ1 - 0.45), 1.1, Math.PI / 4);
  addLabel(scene, ['IOT Lab'], cx(iotX0, iotX1), cz(iotZ0, iotZ1), 0.22, { fontSize: 50, scale: 1.0 });

  // East faculty cabins: Dr.AP / Computational / Dr.SM / Dr.NA
  const ecX0 = iotX1, ecX1 = 28.8;
  const ec4H = (10.2 - OUTER_T) / 4;
  addBox(scene, tx(ecX0), cz(OUTER_T, 10.2), INNER_T, bd(OUTER_T, 10.2), WALL_H, MATS.innerWall);
  addBox(scene, tx(ecX1), cz(OUTER_T, 10.2), INNER_T, bd(OUTER_T, 10.2), WALL_H, MATS.innerWall);
  addBox(scene, cx(ecX0, ecX1), tz(10.2), bw(ecX0, ecX1), INNER_T, WALL_H, MATS.innerWall);
  [1, 2, 3].forEach(i => addBox(scene, cx(ecX0, ecX1), tz(OUTER_T + ec4H * i), bw(ecX0, ecX1), INNER_T, WALL_H, MATS.innerWall));
  const ec4Mats = [MATS.cabin, MATS.compLab, MATS.cabin, MATS.cabin];
  const ec4Names = [['Dr. AP'], ['Compu-', 'tational'], ['Dr. SM'], ['Dr. NA']];
  ec4Names.forEach((name, i) => {
    const z0 = OUTER_T + ec4H * i, z1 = z0 + ec4H;
    addSlab(scene, cx(ecX0, ecX1), cz(z0, z1), bw(ecX0, ecX1) - 0.2, ec4H - 0.2, ec4Mats[i], 0.08);
    addLabel(scene, name, cx(ecX0, ecX1), cz(z0, z1), 0.22, { fontSize: 40, scale: 0.72 });
  });

  // Prof. PK
  const pkX0 = ecX1, pkX1 = 31.6, pkZ0 = OUTER_T, pkZ1 = 5.8;
  addSlab(scene, cx(pkX0, pkX1), cz(pkZ0, pkZ1), bw(pkX0, pkX1) - 0.2, bd(pkZ0, pkZ1) - 0.2, MATS.cabin, 0.08);
  addBox(scene, tx(pkX0), cz(pkZ0, pkZ1), INNER_T, bd(pkZ0, pkZ1), WALL_H, MATS.innerWall);
  addBox(scene, cx(pkX0, pkX1), tz(pkZ1), bw(pkX0, pkX1), INNER_T, WALL_H, MATS.innerWall);
  addLabel(scene, ['Prof. PK'], cx(pkX0, pkX1), cz(pkZ0, pkZ1), 0.22, { fontSize: 44, scale: 0.82 });

  // Lifts
  const lX0 = pkX0, lX1 = pkX1, lZ0 = pkZ1, lZ1 = 10.2;
  const lMid = (lX0 + lX1) / 2;
  addBox(scene, tx(lX0), cz(lZ0, lZ1), INNER_T, bd(lZ0, lZ1), WALL_H, MATS.innerWall);
  addBox(scene, tx(lMid), cz(lZ0, lZ1), INNER_T, bd(lZ0, lZ1), WALL_H, MATS.innerWall);
  addBox(scene, cx(lX0, lX1), tz(lZ1), bw(lX0, lX1), INNER_T, WALL_H, MATS.innerWall);
  [[lX0, lMid], [lMid, lX1]].forEach(([x0, x1], idx) => {
    addSlab(scene, cx(x0, x1), cz(lZ0, lZ1), bw(x0, x1) - 0.2, bd(lZ0, lZ1) - 0.2, MATS.lift, 0.08);
    addBox(scene, cx(x0 + 0.3, x1 - 0.3), cz(lZ0 + 0.3, lZ1 - 0.3), bw(x0, x1) - 0.7, bd(lZ0, lZ1) - 0.7, WALL_H * 0.75, MATS.liftInner);
    addLabel(scene, [`Lift ${idx + 1}`], cx(x0, x1), cz(lZ0, lZ1), 0.22, { fontSize: 42, scale: 0.78 });
  });

  // CSE Corridor
  addSlab(scene, cx(4, 26), cz(7.2, 13.5), 22, bd(7.2, 13.5), MATS.cse, 0.08);
  addLabel(scene, ['CSE Corridor', '83.01 m²  |  CC 2nd Floor'], cx(8, 22), cz(8.5, 12.0), 0.22, { fontSize: 52, scale: 1.3, bgColor: 'rgba(255,255,248,0.96)' });
  addBox(scene, cx(cabX1, tlX0), tz(7.2), bw(cabX1, tlX0), INNER_T, WALL_H, MATS.innerWall);
  addBox(scene, cx(wrX1, iotX0), tz(7.2), bw(wrX1, iotX0), INNER_T, WALL_H, MATS.innerWall);
  addBox(scene, cx(iotX1, ecX0), tz(7.2), bw(iotX1, ecX0), INNER_T, WALL_H, MATS.innerWall);
  addBox(scene, cx(4.0, 9.0), tz(13.5), bw(4.0, 9.0), INNER_T, WALL_H, MATS.innerWall);
  addBox(scene, cx(15.5, 26.0), tz(13.5), bw(15.5, 26.0), INNER_T, WALL_H, MATS.innerWall);
  addBox(scene, tx(4.0), cz(8.8, 13.5), INNER_T, bd(8.8, 13.5), WALL_H, MATS.innerWall);
  addBox(scene, tx(26.0), cz(7.2, 13.5), INNER_T, bd(7.2, 13.5), WALL_H, MATS.innerWall);

  // Left WC / Water Cooler strip
  const lwX0 = OUTER_T, lwX1 = 4.0, lwZ0 = 8.8, lwZ1 = 14.5;
  const lwSeg = bd(lwZ0, lwZ1) / 3;
  addBox(scene, tx(lwX1), cz(lwZ0, lwZ1), INNER_T, bd(lwZ0, lwZ1), WALL_H, MATS.innerWall);
  addBox(scene, cx(lwX0, lwX1), tz(lwZ1), bw(lwX0, lwX1), INNER_T, WALL_H, MATS.innerWall);
  [1, 2].forEach(i => addBox(scene, cx(lwX0, lwX1), tz(lwZ0 + lwSeg * i), bw(lwX0, lwX1), INNER_T, WALL_H, MATS.innerWall));
  const lwData = [
    { mat: MATS.wc, label: ['Boys', 'WC'] },
    { mat: new THREE.MeshLambertMaterial({ color: 0xc8d8b0 }), label: ['Water', 'Cooler'] },
    { mat: MATS.wc, label: ['Girls', 'WC'] },
  ];
  lwData.forEach(({ mat, label }, i) => {
    const z0 = lwZ0 + lwSeg * i, z1 = z0 + lwSeg;
    addSlab(scene, cx(lwX0, lwX1), cz(z0, z1), bw(lwX0, lwX1) - 0.2, lwSeg - 0.2, mat, 0.08);
    addLabel(scene, label, cx(lwX0, lwX1), cz(z0, z1), 0.22, { fontSize: 42, scale: 0.75 });
  });

  // Seminar Hall
  const shX0 = OUTER_T, shX1 = 4.0, shZ0 = lwZ1, shZ1 = 16.8;
  addSlab(scene, cx(shX0, shX1), cz(shZ0, shZ1), bw(shX0, shX1) - 0.2, bd(shZ0, shZ1) - 0.2, MATS.seminar, 0.08);
  addBox(scene, tx(shX1), cz(shZ0, shZ1), INNER_T, bd(shZ0, shZ1), WALL_H, MATS.innerWall);
  addBox(scene, cx(shX0, shX1), tz(shZ0), bw(shX0, shX1), INNER_T, WALL_H, MATS.innerWall);
  addBox(scene, cx(shX0, shX1), tz(shZ1), bw(shX0, shX1), INNER_T, WALL_H, MATS.innerWall);
  addLabel(scene, ['Seminar', 'Hall'], cx(shX0, shX1), cz(shZ0, shZ1), 0.22, { fontSize: 42, scale: 0.75 });

  // Research Lab
  const rlX0 = OUTER_T, rlX1 = 4.0, rlZ0 = shZ1, rlZ1 = BD - OUTER_T;
  addSlab(scene, cx(rlX0, rlX1), cz(rlZ0, rlZ1), bw(rlX0, rlX1) - 0.2, bd(rlZ0, rlZ1) - 0.2, MATS.research, 0.08);
  addBox(scene, tx(rlX1), cz(rlZ0, rlZ1), INNER_T, bd(rlZ0, rlZ1), WALL_H, MATS.innerWall);
  addBox(scene, cx(rlX0, rlX1), tz(rlZ0), bw(rlX0, rlX1), INNER_T, WALL_H, MATS.innerWall);
  addLabel(scene, ['Research', 'Lab'], cx(rlX0, rlX1), cz(rlZ0, rlZ1), 0.22, { fontSize: 42, scale: 0.75 });

  // Head CSE / Office Asst of CC
  const csX0 = 4.0, csX1 = 9.0, csZ0 = 13.5, csZ1 = BD - OUTER_T;
  addSlab(scene, cx(csX0, csX1), cz(csZ0, csZ1), bw(csX0, csX1) - 0.2, bd(csZ0, csZ1) - 0.2, MATS.staff, 0.08);
  addBox(scene, tx(csX0), cz(csZ0, csZ1), INNER_T, bd(csZ0, csZ1), WALL_H, MATS.innerWall);
  addBox(scene, tx(csX1), cz(csZ0, csZ1), INNER_T, bd(csZ0, csZ1), WALL_H, MATS.innerWall);
  addBox(scene, cx(csX0, csX1), tz(csZ0), bw(csX0, csX1), INNER_T, WALL_H, MATS.innerWall);
  addBox(scene, cx(csX0, csX1), tz((csZ0 + csZ1) / 2), bw(csX0, csX1), INNER_T, WALL_H * 0.45, MATS.innerWall);
  addLabel(scene, ['Head CSE', '/ Office CC'], cx(csX0, csX1), cz(csZ0, csZ1), 0.22, { fontSize: 42, scale: 0.78 });

  // Staircase
  const stX0 = csX1, stX1 = 16.0, stZ0 = 13.5, stZ1 = BD - OUTER_T;
  addSlab(scene, cx(stX0, stX1), cz(stZ0, stZ1), bw(stX0, stX1) - 0.2, bd(stZ0, stZ1) - 0.2, MATS.stair, 0.08);
  addBox(scene, tx(stX0), cz(stZ0, stZ1), INNER_T, bd(stZ0, stZ1), WALL_H, MATS.innerWall);
  addBox(scene, tx(stX1), cz(stZ0, stZ1), INNER_T, bd(stZ0, stZ1), WALL_H, MATS.innerWall);
  addBox(scene, cx(stX0, stX1), tz(stZ0), bw(stX0, stX1), INNER_T, WALL_H, MATS.innerWall);
  const nSteps = 7, flightW = (bw(stX0, stX1) - 0.5) / 2 - 0.2, stepD = bd(stZ0, stZ1) / nSteps;
  for (let i = 0; i < nSteps; i++) {
    const stepH = 0.12 * (i + 1);
    const stepMat = i % 2 === 0 ? MATS.stairStep : MATS.stairAlt;
    addBox(scene, tx(stX0 + 0.2 + flightW / 2), tz(stZ0 + stepD * i + stepD / 2), flightW, stepD - 0.04, stepH, stepMat);
    addBox(scene, tx(stX1 - 0.2 - flightW / 2), tz(stZ0 + stepD * (nSteps - 1 - i) + stepD / 2), flightW, stepD - 0.04, stepH, stepMat);
  }
  addBox(scene, cx(stX0, stX1), cz(stZ0, stZ1), 0.42, bd(stZ0, stZ1) - 0.4, 0.08, new THREE.MeshLambertMaterial({ color: 0x888878 }));
  addLabel(scene, ['Staircase'], cx(stX0, stX1), cz(stZ0, stZ1) - 0.5, 0.22, { fontSize: 44, scale: 0.82 });

  // East corridor extension
  addSlab(scene, cx(26, ecX1), cz(10.2, 13.5), bw(26, ecX1), bd(10.2, 13.5), MATS.cse, 0.08);

  // Subtle ceiling
  const ceilGeo = new THREE.BoxGeometry(BW - 1, 0.04, BD - 1);
  const ceilMesh = new THREE.Mesh(ceilGeo, new THREE.MeshLambertMaterial({ color: 0xfff8ee, transparent: true, opacity: 0.05, side: THREE.DoubleSide }));
  ceilMesh.position.set(0, WALL_H + 0.02, 0);
  scene.add(ceilMesh);
}

// ═══════════════════════════════════════════════════════════════════
//  2D FLOOR PLAN (inline JSX)
// ═══════════════════════════════════════════════════════════════════
function FloorPlan2D() {
  const colors = {
    wall: '#3B1F0A', cor: '#C8A870', lab: '#A8C8DF', wash: '#9FD3B5',
    off: '#D4B890', lift: '#D8D88A', stair: '#BEBAA0', purp: '#CBBEDE', txt: '#2C1206'
  };

  const R = ({ style, children }) => (
    <div style={{
      position: 'absolute', border: `2.5px solid ${colors.wall}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center', overflow: 'hidden', ...style
    }}>{children}</div>
  );

  const Label = ({ size = 16, children }) => (
    <span style={{ fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 700, color: colors.txt, lineHeight: 1.25, letterSpacing: '0.04em', fontSize: size }}>{children}</span>
  );

  const DoorSVG = ({ style }) => (
    <svg className="da" style={{ position: 'absolute', pointerEvents: 'none', ...style }} viewBox="0 0 30 30">
      <path d="M0 0L28 0A28 28 0 0 1 0 28" fill="rgba(160,100,40,.15)" stroke={colors.wall} strokeWidth="1.3" />
      <line x1="0" y1="0" x2="0" y2="28" stroke={colors.wall} strokeWidth="1.5" />
    </svg>
  );

  const Toilet = () => (
    <svg width="34" height="52" viewBox="0 0 34 52">
      <rect x="5" y="1" width="24" height="14" rx="3" fill="white" stroke={colors.wall} strokeWidth="1" />
      <ellipse cx="17" cy="38" rx="14" ry="16" fill="white" stroke={colors.wall} strokeWidth="1" />
    </svg>
  );

  const DivH = ({ style }) => <div style={{ position: 'absolute', height: '2.5px', background: colors.wall, ...style }} />;
  const DivV = ({ style }) => <div style={{ position: 'absolute', width: '2.5px', background: colors.wall, ...style }} />;

  return (
    <div style={{
      position: 'relative', width: 1360, height: 774,
      background: colors.cor, border: `7px solid ${colors.wall}`,
      overflow: 'hidden', flexShrink: 0,
      boxShadow: `0 0 0 3px #0C0400, 0 20px 70px #00000099`
    }}>

      {/* LEFT COLUMN */}
      <R style={{ background: colors.off, left: 0, top: 0, width: 210, height: 108 }}>
        <Label>Dr. RKR</Label>
        <DoorSVG style={{ right: -1, top: 30, width: 30, height: 30 }} />
      </R>
      <R style={{ background: colors.off, left: 0, top: 108, width: 210, height: 108 }}>
        <Label>Dr. ND</Label>
        <DoorSVG style={{ right: -1, top: 30, width: 30, height: 30 }} />
      </R>
      <R style={{ background: colors.off, left: 0, top: 216, width: 210, height: 108 }}>
        <Label>Dr. MS</Label>
        <DoorSVG style={{ right: -1, top: 30, width: 30, height: 30 }} />
      </R>

      {/* Boys WC left */}
      <R style={{ background: colors.wash, left: 0, top: 324, width: 210, height: 112 }}>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}><Toilet /><Toilet /></div>
        <Label size={13}>BOYS</Label>
      </R>

      {/* Water Cooler */}
      <R style={{ background: colors.wash, left: 0, top: 436, width: 210, height: 80 }}>
        <svg width="30" height="36" viewBox="0 0 30 40">
          <ellipse cx="15" cy="16" rx="11" ry="14" fill="white" stroke={colors.wall} strokeWidth="1" />
          <rect x="10" y="28" width="10" height="8" rx="2" fill="white" stroke={colors.wall} strokeWidth="1" />
          <line x1="15" y1="36" x2="15" y2="40" stroke={colors.wall} strokeWidth="1.2" />
          <line x1="11" y1="38" x2="19" y2="38" stroke={colors.wall} strokeWidth="1.2" />
        </svg>
        <Label size={13}>WATER</Label>
      </R>

      {/* Girls WC left */}
      <R style={{ background: colors.wash, left: 0, top: 516, width: 210, height: 112 }}>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}><Toilet /><Toilet /></div>
        <Label size={13}>GIRLS</Label>
      </R>

      {/* Seminar Hall */}
      <R style={{ background: colors.lab, left: 0, top: 628, width: 210, height: 74 }}>
        <Label size={14}>SEMINAR HALL</Label>
        <svg style={{ position: 'absolute', top: -1, right: 50, width: 28, height: 28, transform: 'rotate(90deg)', pointerEvents: 'none' }} viewBox="0 0 28 28">
          <path d="M0 0L26 0A26 26 0 0 1 0 26" fill="rgba(160,100,40,.15)" stroke={colors.wall} strokeWidth="1.3" />
          <line x1="0" y1="0" x2="0" y2="26" stroke={colors.wall} strokeWidth="1.5" />
        </svg>
      </R>

      {/* Research Lab */}
      <R style={{ background: colors.lab, left: 0, top: 702, width: 210, height: 72 }}>
        <Label size={14}>RESEARCH LAB</Label>
      </R>

      {/* Compass */}
      <div style={{ position: 'absolute', left: 10, bottom: 8, zIndex: 6, pointerEvents: 'none' }}>
        <svg width="66" height="66" viewBox="0 0 66 66">
          <circle cx="33" cy="33" r="30" fill="rgba(255,255,255,.88)" stroke={colors.wall} strokeWidth="1.5" />
          <polygon points="33,6 37,33 33,28 29,33" fill="#8B1818" />
          <polygon points="33,60 37,33 33,38 29,33" fill={colors.wall} opacity=".4" />
          <polygon points="6,33 33,29 28,33 33,37" fill={colors.wall} opacity=".4" />
          <polygon points="60,33 33,29 38,33 33,37" fill={colors.wall} opacity=".4" />
          <text x="33" y="15" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="Crimson Text,Georgia,serif" fill={colors.txt}>N</text>
          <text x="33" y="57" textAnchor="middle" fontSize="9" fontFamily="Crimson Text,Georgia,serif" fill={colors.txt} opacity=".6">S</text>
          <text x="11" y="37" textAnchor="middle" fontSize="9" fontFamily="Crimson Text,Georgia,serif" fill={colors.txt} opacity=".6">W</text>
          <text x="55" y="37" textAnchor="middle" fontSize="9" fontFamily="Crimson Text,Georgia,serif" fill={colors.txt} opacity=".6">E</text>
        </svg>
      </div>

      {/* Dr. AS */}
      <R style={{ background: colors.off, left: 210, top: 0, width: 130, height: 130 }}>
        <Label size={15}>Dr. AS</Label>
        <svg style={{ position: 'absolute', right: -1, top: 40, width: 28, height: 28, pointerEvents: 'none' }} viewBox="0 0 28 28">
          <path d="M0 0L26 0A26 26 0 0 1 0 26" fill="rgba(160,100,40,.15)" stroke={colors.wall} strokeWidth="1.3" />
          <line x1="0" y1="0" x2="0" y2="26" stroke={colors.wall} strokeWidth="1.5" />
        </svg>
      </R>

      {/* TINKERING LAB */}
      <R style={{ background: colors.lab, left: 210, top: 130, width: 360, height: 324 }}>
        <Label size={28}>TINKERING</Label>
        <Label size={28}>LAB</Label>
        <svg style={{ position: 'absolute', bottom: -1, left: 50, width: 32, height: 32, transform: 'scaleY(-1)', pointerEvents: 'none' }} viewBox="0 0 32 32">
          <path d="M0 0L30 0A30 30 0 0 1 0 30" fill="rgba(160,100,40,.15)" stroke={colors.wall} strokeWidth="1.3" />
          <line x1="0" y1="0" x2="0" y2="30" stroke={colors.wall} strokeWidth="1.5" />
        </svg>
        <svg style={{ position: 'absolute', bottom: -1, right: 50, width: 32, height: 32, transform: 'scaleY(-1) scaleX(-1)', pointerEvents: 'none' }} viewBox="0 0 32 32">
          <path d="M0 0L30 0A30 30 0 0 1 0 30" fill="rgba(160,100,40,.15)" stroke={colors.wall} strokeWidth="1.3" />
          <line x1="0" y1="0" x2="0" y2="30" stroke={colors.wall} strokeWidth="1.5" />
        </svg>
      </R>

      {/* WASHROOM BLOCK (Girls/Cleansing/Boys) */}
      <R style={{ background: colors.wash, left: 570, top: 0, width: 70, height: 260 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}><Toilet /><Toilet /></div>
        <Label size={12}>GIRLS</Label>
      </R>
      <R style={{ background: colors.wash, left: 640, top: 0, width: 70, height: 260 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          {[0, 1].map(k => (
            <svg key={k} width="34" height="30" viewBox="0 0 34 30">
              <rect x="4" y="1" width="26" height="6" rx="2" fill="white" stroke={colors.wall} strokeWidth="1" />
              <ellipse cx="17" cy="22" rx="14" ry="10" fill="white" stroke={colors.wall} strokeWidth="1" />
            </svg>
          ))}
        </div>
        <Label size={11}>CLEANSING</Label>
      </R>
      <R style={{ background: colors.wash, left: 710, top: 0, width: 70, height: 260 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}><Toilet /><Toilet /></div>
        <Label size={12}>BOYS</Label>
      </R>

      {/* IOT LAB */}
      <R style={{ background: colors.lab, left: 780, top: 0, width: 230, height: 260 }}>
        <Label size={22}>IOT LAB</Label>
        <svg style={{ position: 'absolute', bottom: -1, left: 90, width: 32, height: 32, transform: 'scaleY(-1)', pointerEvents: 'none' }} viewBox="0 0 32 32">
          <path d="M0 0L30 0A30 30 0 0 1 0 30" fill="rgba(160,100,40,.15)" stroke={colors.wall} strokeWidth="1.3" />
          <line x1="0" y1="0" x2="0" y2="30" stroke={colors.wall} strokeWidth="1.5" />
        </svg>
      </R>

      {/* Right cabins */}
      <R style={{ background: colors.off, left: 780, top: 260, width: 113, height: 97 }}>
        <Label size={14}>Dr. AP</Label>
        <svg style={{ position: 'absolute', left: -1, top: 28, width: 26, height: 26, transform: 'scaleX(-1)', pointerEvents: 'none' }} viewBox="0 0 26 26">
          <path d="M0 0L24 0A24 24 0 0 1 0 24" fill="rgba(160,100,40,.15)" stroke={colors.wall} strokeWidth="1.3" />
          <line x1="0" y1="0" x2="0" y2="24" stroke={colors.wall} strokeWidth="1.5" />
        </svg>
      </R>
      <R style={{ background: colors.purp, left: 893, top: 260, width: 117, height: 97 }}>
        <Label size={12}>COMPU-</Label>
        <Label size={12}>TATIONAL</Label>
      </R>
      <R style={{ background: colors.off, left: 780, top: 357, width: 113, height: 97 }}>
        <Label size={14}>Dr. SM</Label>
        <svg style={{ position: 'absolute', left: -1, top: 28, width: 26, height: 26, transform: 'scaleX(-1)', pointerEvents: 'none' }} viewBox="0 0 26 26">
          <path d="M0 0L24 0A24 24 0 0 1 0 24" fill="rgba(160,100,40,.15)" stroke={colors.wall} strokeWidth="1.3" />
          <line x1="0" y1="0" x2="0" y2="24" stroke={colors.wall} strokeWidth="1.5" />
        </svg>
      </R>
      <R style={{ background: colors.off, left: 893, top: 357, width: 117, height: 97 }}>
        <Label size={14}>Dr. NA</Label>
        <svg style={{ position: 'absolute', left: -1, top: 28, width: 26, height: 26, transform: 'scaleX(-1)', pointerEvents: 'none' }} viewBox="0 0 26 26">
          <path d="M0 0L24 0A24 24 0 0 1 0 24" fill="rgba(160,100,40,.15)" stroke={colors.wall} strokeWidth="1.3" />
          <line x1="0" y1="0" x2="0" y2="24" stroke={colors.wall} strokeWidth="1.5" />
        </svg>
      </R>

      {/* PROF. PK */}
      <R style={{ background: colors.off, left: 1010, top: 0, width: 130, height: 454 }}>
        <Label size={16}>Prof. PK</Label>
        <svg style={{ position: 'absolute', left: -1, bottom: 90, width: 28, height: 28, transform: 'scaleX(-1) scaleY(-1)', pointerEvents: 'none' }} viewBox="0 0 28 28">
          <path d="M0 0L26 0A26 26 0 0 1 0 26" fill="rgba(160,100,40,.15)" stroke={colors.wall} strokeWidth="1.3" />
          <line x1="0" y1="0" x2="0" y2="26" stroke={colors.wall} strokeWidth="1.5" />
        </svg>
      </R>

      {/* LIFT 1 */}
      <R style={{ background: colors.lift, left: 1140, top: 0, width: 100, height: 380 }}>
        <Label size={16}>LIFT</Label>
        <Label size={16}>1</Label>
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: .18 }} viewBox="0 0 100 380" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="100" y2="380" stroke={colors.wall} strokeWidth="1.2" />
          <line x1="100" y1="0" x2="0" y2="380" stroke={colors.wall} strokeWidth="1.2" />
        </svg>
      </R>

      {/* LIFT 2 */}
      <R style={{ background: colors.lift, left: 1240, top: 0, width: 100, height: 380 }}>
        <Label size={16}>LIFT</Label>
        <Label size={16}>2</Label>
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: .18 }} viewBox="0 0 100 380" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="100" y2="380" stroke={colors.wall} strokeWidth="1.2" />
          <line x1="100" y1="0" x2="0" y2="380" stroke={colors.wall} strokeWidth="1.2" />
        </svg>
        <svg style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} width="22" height="44" viewBox="0 0 22 44">
          <line x1="11" y1="2" x2="11" y2="42" stroke={colors.wall} strokeWidth="1.5" />
          <polyline points="4,12 11,2 18,12" fill="none" stroke={colors.wall} strokeWidth="1.5" />
          <polyline points="4,32 11,42 18,32" fill="none" stroke={colors.wall} strokeWidth="1.5" />
        </svg>
      </R>

      {/* Far right strip */}
      <div style={{ position: 'absolute', background: colors.lift, left: 1340, top: 0, width: 13, height: 774, border: `2.5px solid ${colors.wall}`, borderRight: 0 }} />

      {/* HEAD CSE */}
      <R style={{ background: colors.off, left: 210, top: 454, width: 360, height: 174 }}>
        <Label size={24}>HEAD</Label>
        <Label size={24}>CSE</Label>
        <svg style={{ position: 'absolute', bottom: -1, left: 60, width: 32, height: 32, transform: 'scaleY(-1) scaleX(-1)', pointerEvents: 'none' }} viewBox="0 0 32 32">
          <path d="M0 0L30 0A30 30 0 0 1 0 30" fill="rgba(160,100,40,.15)" stroke={colors.wall} strokeWidth="1.3" />
          <line x1="0" y1="0" x2="0" y2="30" stroke={colors.wall} strokeWidth="1.5" />
        </svg>
      </R>

      {/* OFFICE ASST OF CC */}
      <R style={{ background: colors.off, left: 210, top: 628, width: 360, height: 146 }}>
        <Label size={20}>OFFICE ASST</Label>
        <Label size={20}>OF CC</Label>
        <svg style={{ position: 'absolute', top: -1, left: 60, width: 32, height: 32, transform: 'scaleX(-1)', pointerEvents: 'none' }} viewBox="0 0 32 32">
          <path d="M0 0L30 0A30 30 0 0 1 0 30" fill="rgba(160,100,40,.15)" stroke={colors.wall} strokeWidth="1.3" />
          <line x1="0" y1="0" x2="0" y2="30" stroke={colors.wall} strokeWidth="1.5" />
        </svg>
      </R>

      {/* STAIRCASE */}
      <R style={{ background: colors.stair, left: 570, top: 560, width: 210, height: 214, borderTop: `3px solid ${colors.wall}` }}>
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} viewBox="0 0 210 214" preserveAspectRatio="none">
          {[26, 52, 78, 104, 130, 156, 182].map(y => (
            <line key={y} x1="0" y1={y} x2="210" y2={y} stroke={colors.wall} strokeWidth="1" />
          ))}
          <line x1="105" y1="0" x2="105" y2="214" stroke={colors.wall} strokeWidth="2" />
          <polyline points="86,192 105,214 124,192" fill="none" stroke={colors.wall} strokeWidth="2.5" />
        </svg>
        <span style={{ fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 700, color: colors.txt, fontSize: 13, position: 'absolute', top: 7, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', letterSpacing: 1 }}>STAIRCASE</span>
      </R>

      {/* CC 2ND FLOOR label */}
      <div style={{ position: 'absolute', left: 570, top: 454, width: 570, height: 106, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <span style={{ fontFamily: "'Crimson Text', Georgia, serif", fontSize: 40, fontWeight: 700, color: colors.txt, letterSpacing: 2, lineHeight: 1.1 }}>CC 2ND FLOOR</span>
        <span style={{ fontFamily: "'Crimson Text', Georgia, serif", fontSize: 22, fontWeight: 600, color: colors.txt, marginTop: 2 }}>CSE</span>
        <span style={{ fontFamily: "'Crimson Text', Georgia, serif", fontSize: 13, color: colors.txt, opacity: .55, marginTop: 2 }}>83.01 m²</span>
      </div>

      {/* INTERNAL WALL DIVIDERS - Horizontal */}
      <DivH style={{ left: 0, top: 108, width: 210 }} />
      <DivH style={{ left: 0, top: 216, width: 210 }} />
      <DivH style={{ left: 0, top: 324, width: 210 }} />
      <DivH style={{ left: 0, top: 436, width: 210 }} />
      <DivH style={{ left: 0, top: 516, width: 210 }} />
      <DivH style={{ left: 0, top: 628, width: 210 }} />
      <DivH style={{ left: 0, top: 702, width: 210 }} />
      <DivH style={{ left: 210, top: 130, width: 130 }} />
      <DivH style={{ left: 210, top: 454, width: 360 }} />
      <DivH style={{ left: 210, top: 628, width: 360 }} />
      <DivH style={{ left: 570, top: 260, width: 210 }} />
      <DivH style={{ left: 780, top: 260, width: 230 }} />
      <DivH style={{ left: 780, top: 357, width: 230 }} />
      <DivH style={{ left: 780, top: 454, width: 230 }} />
      <DivH style={{ left: 1010, top: 454, width: 130 }} />
      <DivH style={{ left: 1140, top: 380, width: 200 }} />
      <DivH style={{ left: 570, top: 560, width: 210 }} />

      {/* INTERNAL WALL DIVIDERS - Vertical */}
      <DivV style={{ left: 210, top: 0, height: 774 }} />
      <DivV style={{ left: 340, top: 0, height: 130 }} />
      <DivV style={{ left: 570, top: 0, height: 560 }} />
      <DivV style={{ left: 640, top: 0, height: 260 }} />
      <DivV style={{ left: 710, top: 0, height: 260 }} />
      <DivV style={{ left: 780, top: 0, height: 774 }} />
      <DivV style={{ left: 893, top: 260, height: 194 }} />
      <DivV style={{ left: 1010, top: 0, height: 454 }} />
      <DivV style={{ left: 1140, top: 0, height: 774 }} />
      <DivV style={{ left: 1240, top: 0, height: 380 }} />
      <DivV style={{ left: 1340, top: 0, height: 774 }} />

      {/* LEGEND */}
      <div style={{
        position: 'absolute', right: 12, bottom: 12,
        background: 'rgba(255,255,255,.93)', border: `1.5px solid ${colors.wall}`,
        padding: '10px 14px', fontSize: 12, lineHeight: 1.9, color: colors.txt, zIndex: 9
      }}>
        <b style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 3 }}>Legend</b>
        {[
          { bg: colors.lab, label: 'Labs / Study Rooms' },
          { bg: colors.wash, label: 'Washrooms / Utilities' },
          { bg: colors.off, label: 'Offices / Storage' },
          { bg: colors.cor, label: 'Corridor / Open Area' },
          { bg: colors.lift, label: 'Lifts' },
          { bg: colors.stair, label: 'Staircase' },
        ].map(({ bg, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 18, height: 12, background: bg, border: `1.5px solid ${colors.wall}`, flexShrink: 0 }} />
            {label}
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', fontSize: 10, letterSpacing: 2, color: colors.txt, opacity: .38, whiteSpace: 'nowrap' }}>
        Navigation — CC Building · 2nd Floor · CSE Department
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function FloorPlanViewer() {
  const [mode, setMode] = React.useState('2d');
  const mount3Ref = React.useRef(null);
  const stateRef = React.useRef({ theta: 0.52, phi: 0.88, r: 62, drag: false, rightDrag: false, px: 0, py: 0 });
  const frameRef = React.useRef(null);
  const targetRef = React.useRef(new THREE.Vector3(0, 0, 0));

  // 2D resize
  const [scale2D, setScale2D] = React.useState(1);
  React.useEffect(() => {
    function resize() {
      const vw = window.innerWidth - 32;
      const vh = window.innerHeight - 80;
      setScale2D(Math.min(1, vw / 1367, vh / 790));
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // 3D init
  React.useEffect(() => {
    if (mode !== '3d') return;
    const mount = mount3Ref.current; if (!mount) return;
    const W = mount.clientWidth, H = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x151820);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x151820, 0.012);

    scene.add(new THREE.AmbientLight(0xfff5e4, 0.75));
    const sun = new THREE.DirectionalLight(0xfff0cc, 1.0);
    sun.position.set(12, 30, 18); sun.castShadow = true;
    sun.shadow.mapSize.set(4096, 4096);
    sun.shadow.camera.left = -30; sun.shadow.camera.right = 30;
    sun.shadow.camera.top = 25; sun.shadow.camera.bottom = -25;
    sun.shadow.camera.far = 100; sun.shadow.bias = -0.001;
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xc8e0ff, 0.35);
    fill.position.set(-10, 15, -12); scene.add(fill);
    scene.add(new THREE.HemisphereLight(0xfff0d0, 0x303840, 0.4));

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 300);
    camera.position.set(0, 48, 42);
    camera.lookAt(0, 0, 0);

    buildFloorPlan(scene);

    const groundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(120, 120),
      new THREE.MeshLambertMaterial({ color: 0x0e1016 })
    );
    groundMesh.rotation.x = -Math.PI / 2; groundMesh.position.y = -0.12;
    groundMesh.receiveShadow = true; scene.add(groundMesh);

    const s = stateRef.current;
    const target = targetRef.current;

    function updateCam() {
      camera.position.set(
        target.x + s.r * Math.sin(s.phi) * Math.sin(s.theta),
        target.y + s.r * Math.cos(s.phi),
        target.z + s.r * Math.sin(s.phi) * Math.cos(s.theta)
      );
      camera.lookAt(target);
    }
    updateCam();

    const el = renderer.domElement;
    function onDown(e) { s.drag = true; s.rightDrag = e.button === 2; s.px = e.clientX; s.py = e.clientY; }
    function onUp() { s.drag = false; }
    function onMove(e) {
      if (!s.drag) return;
      const dx = e.clientX - s.px, dy = e.clientY - s.py; s.px = e.clientX; s.py = e.clientY;
      if (s.rightDrag) {
        const right = new THREE.Vector3().crossVectors(new THREE.Vector3().subVectors(camera.position, target).normalize(), camera.up).normalize();
        target.addScaledVector(right, -dx * 0.05);
        target.addScaledVector(new THREE.Vector3(0, 1, 0), dy * 0.05);
      } else {
        s.theta -= dx * 0.007;
        s.phi = Math.max(0.18, Math.min(1.35, s.phi + dy * 0.007));
      }
      updateCam();
    }
    function onWheel(e) { s.r = Math.max(20, Math.min(90, s.r + e.deltaY * 0.06)); updateCam(); e.preventDefault(); }
    el.addEventListener('mousedown', onDown);
    el.addEventListener('contextmenu', e => e.preventDefault());
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    el.addEventListener('wheel', onWheel, { passive: false });

    let lastTouchDist = 0;
    function onTouchStart(e) {
      if (e.touches.length === 1) { s.drag = true; s.rightDrag = false; s.px = e.touches[0].clientX; s.py = e.touches[0].clientY; }
      if (e.touches.length === 2) { const dx = e.touches[0].clientX - e.touches[1].clientX, dy = e.touches[0].clientY - e.touches[1].clientY; lastTouchDist = Math.sqrt(dx * dx + dy * dy); }
    }
    function onTouchMove(e) {
      if (e.touches.length === 1 && s.drag) {
        const dx = e.touches[0].clientX - s.px, dy = e.touches[0].clientY - s.py; s.px = e.touches[0].clientX; s.py = e.touches[0].clientY;
        s.theta -= dx * 0.007; s.phi = Math.max(0.18, Math.min(1.35, s.phi + dy * 0.007)); updateCam();
      }
      if (e.touches.length === 2) {
        const dx2 = e.touches[0].clientX - e.touches[1].clientX, dy2 = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        s.r = Math.max(20, Math.min(90, s.r - (dist - lastTouchDist) * 0.1));
        lastTouchDist = dist; updateCam();
      }
      e.preventDefault();
    }
    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', () => { s.drag = false; });

    function onResize() {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    frameRef.current = requestAnimationFrame(function loop() {
      frameRef.current = requestAnimationFrame(loop);
      renderer.render(scene, camera);
    });

    return () => {
      cancelAnimationFrame(frameRef.current);
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [mode]);

  const togBtn = (label, isActive, onClick) => (
    <button key={label} onClick={onClick} style={{
      padding: '6px 18px', border: '1px solid', cursor: 'pointer',
      fontSize: 10, letterSpacing: 2, borderRadius: 2,
      fontFamily: "'Crimson Text', Georgia, serif", textTransform: 'uppercase',
      transition: 'all .2s',
      borderColor: isActive ? '#b08840' : '#3a2a12',
      background: isActive ? '#2e1e06' : 'transparent',
      color: isActive ? '#e8c870' : '#6a5030',
    }}>{label}</button>
  );

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#1A0E06', overflow: 'hidden' }}>
      {/* HEADER */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 24px',
        background: 'rgba(10,6,2,0.94)',
        borderBottom: '1px solid rgba(200,168,112,0.18)',
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontFamily: "'Crimson Text', Georgia, serif", fontSize: 16, letterSpacing: 3, textTransform: 'uppercase', color: '#e8d5a3', fontWeight: 600 }}>
            Computer Centre — 2nd Floor
          </div>
          <div style={{ color: '#6a5a40', fontSize: 10, letterSpacing: 2, fontFamily: 'monospace' }}>
            CSE DEPARTMENT · CC BUILDING
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {togBtn('2D Plan', mode === '2d', () => setMode('2d'))}
          {togBtn('3D View', mode === '3d', () => setMode('3d'))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* 2D VIEW */}
        {mode === '2d' && (
  <div style={{
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'flex-start',   // IMPORTANT (not center)
    justifyContent: 'center',
    background: '#1A0E06',
    overflow: 'auto'
  }}>
    <div style={{
      transform: `scale(${scale2D})`,
      transformOrigin: 'top center',  // BETTER than top left
    }}>
      <FloorPlan2D />
    </div>
  </div>
)}


        {/* 3D VIEW */}
        {mode === '3d' && (
          <div ref={mount3Ref} style={{ width: '100%', height: '100%', cursor: 'grab', background: '#151820' }}>
            {/* Legend */}
            <div style={{
              position: 'absolute', top: 12, right: 12, zIndex: 10,
              background: 'rgba(8,9,12,0.88)', border: '1px solid rgba(255,255,255,0.08)',
              padding: '14px 18px', borderRadius: 8,
              fontFamily: 'monospace', fontSize: 10.5, color: '#8a9090',
            }}>
              <div style={{ color: '#c8b88a', fontSize: 11, letterSpacing: 2, marginBottom: 10 }}>LEGEND</div>
              {[
                { bg: '#d4c4a0', label: 'Open Corridor / CSE' },
                { bg: '#b8ccd4', label: 'Labs' },
                { bg: '#c4d0bc', label: 'Faculty Cabins' },
                { bg: '#a8bcc8', label: 'Washrooms' },
                { bg: '#9999aa', label: 'Lifts / Stairs' },
                { bg: '#c8b8a0', label: 'Staff / Seminar' },
              ].map(({ bg, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 2, background: bg, flexShrink: 0 }} />
                  {label}
                </div>
              ))}
            </div>

            {/* Controls hint */}
            <div style={{
              position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 10,
              display: 'flex', gap: 24,
              background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.1)',
              padding: '10px 24px', borderRadius: 30,
              fontFamily: 'monospace', fontSize: 11, color: '#8a9090', letterSpacing: 1,
              pointerEvents: 'none',
            }}>
              {[['Drag', 'Orbit'], ['Scroll', 'Zoom'], ['Right-drag', 'Pan']].map(([key, label]) => (
                <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <kbd style={{ background: '#2a2c32', border: '1px solid #444', padding: '2px 7px', borderRadius: 4, color: '#c8b88a', fontSize: 10 }}>{key}</kbd>
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}