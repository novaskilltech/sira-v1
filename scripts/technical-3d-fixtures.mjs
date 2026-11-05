/**
 * Technical, non-historical GLB fixtures for every catalogue object.
 * They are deliberately labelled DEMO / NON_VALIDE and test the viewer only.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

const output = path.resolve('public/media/demo');
if (!globalThis.FileReader) globalThis.FileReader = class {
  result = null; onloadend = null; onerror = null;
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(value => { this.result = value; this.onloadend?.({ target: this }); }).catch(error => this.onerror?.(error)); }
};
const materials = {
  clay: new THREE.MeshStandardMaterial({ color: '#a96e4e', roughness: .83 }),
  wood: new THREE.MeshStandardMaterial({ color: '#795638', roughness: .88 }),
  fibre: new THREE.MeshStandardMaterial({ color: '#ba9860', roughness: .95 }),
  bronze: new THREE.MeshStandardMaterial({ color: '#9a855b', roughness: .55, metalness: .35 }),
  dark: new THREE.MeshStandardMaterial({ color: '#3f392e', roughness: .9 }),
};
const add = (group, geometry, material, position = [0, 0, 0], rotation = [0, 0, 0]) => {
  const mesh = new THREE.Mesh(geometry, material); mesh.position.set(...position); mesh.rotation.set(...rotation); group.add(mesh); return mesh;
};
const lathe = points => new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), 32);
const g = () => new THREE.Group();
const fixtures = {
  'OBJ-003': () => { const x=g(); add(x,new THREE.BoxGeometry(1.45,.18,.3),materials.wood,[0,.85,0]); add(x,new THREE.BoxGeometry(.34,.62,.16),materials.bronze,[0,.62,.18]); add(x,new THREE.TorusGeometry(.13,.035,10,24),materials.bronze,[0,.67,.29],[Math.PI/2,0,0]); return x; },
  'OBJ-004': () => { const x=g(); add(x,new THREE.CylinderGeometry(.85,.85,.24,40),materials.clay,[0,.12,0]); add(x,new THREE.CylinderGeometry(.12,.12,.31,16),materials.wood,[0,.38,0]); add(x,new THREE.BoxGeometry(1.35,.1,.12),materials.wood,[0,.58,0]); return x; },
  'OBJ-005': () => { const x=g(); add(x,lathe([[0,0],[.56,0],[.65,.14],[.68,.42],[.48,.66],[.48,.77],[.34,.8],[.34,.65],[.52,.51],[.55,.24],[.44,.1],[0,.1]]),materials.clay); add(x,new THREE.TorusGeometry(.2,.035,10,24),materials.clay,[.62,.48,0]); return x; },
  'OBJ-006': () => { const x=g(); const body=add(x,new THREE.SphereGeometry(.62,30,20),materials.fibre); body.scale.set(1,.78,.66); add(x,new THREE.CylinderGeometry(.12,.14,.28,20),materials.fibre,[0,.63,0]); add(x,new THREE.TorusGeometry(.15,.035,10,24),materials.fibre,[0,.77,0]); return x; },
  'OBJ-008': () => { const x=g(); const shape=new THREE.Shape([new THREE.Vector2(-.72,0),new THREE.Vector2(.62,0),new THREE.Vector2(.78,.28),new THREE.Vector2(-.48,.38),new THREE.Vector2(-.82,.24)]); add(x,new THREE.ShapeGeometry(shape),materials.fibre,[0,0,0],[-Math.PI/2,0,0]); add(x,new THREE.TorusGeometry(.18,.032,8,20),materials.fibre,[-.1,.11,.05],[Math.PI/2,0,0]); return x; },
  'OBJ-009': () => { const x=g(); add(x,new THREE.CylinderGeometry(.055,.055,1.25,16),materials.wood,[0,.62,0]); add(x,new THREE.ConeGeometry(.17,.26,24),materials.wood,[0,.13,0]); add(x,new THREE.ConeGeometry(.1,.16,20),materials.bronze,[0,1.28,0]); return x; },
  'OBJ-010': () => { const x=g(); add(x,new THREE.BoxGeometry(1.45,.16,.35),materials.wood,[0,.1,0]); for(let i=-5;i<=5;i++)add(x,new THREE.BoxGeometry(.025,.45,.03),materials.wood,[i*.115,.32,0]); return x; },
  'OBJ-011': () => { const x=g(); add(x,new THREE.CylinderGeometry(.075,.075,1.35,16),materials.wood,[0,.67,0],[0,0,.5]); add(x,new THREE.SphereGeometry(.18,16,12),materials.bronze,[.57,1.0,0]); return x; },
  'OBJ-012': () => { const x=g(); add(x,new THREE.CapsuleGeometry(.1,.95,8,20),materials.wood,[0,.58,0],[0,0,Math.PI/2]); add(x,new THREE.BoxGeometry(.16,.24,.16),materials.wood,[-.52,.58,0]); add(x,new THREE.BoxGeometry(.16,.24,.16),materials.wood,[.52,.58,0]); return x; },
  'OBJ-013': () => { const x=g(); add(x,new THREE.CylinderGeometry(.075,.095,1.12,16),materials.wood,[0,.56,0],[0,0,-.55]); add(x,new THREE.ConeGeometry(.1,.32,4),materials.bronze,[.48,.23,0],[0,0,-.55]); return x; },
  'OBJ-014': () => { const x=g(); add(x,new THREE.CylinderGeometry(.06,.06,1.25,16),materials.wood,[0,.98,0]); add(x,new THREE.BoxGeometry(1.4,.08,.08),materials.wood,[0,1.45,0]); for(const k of [-.53,.53]){add(x,new THREE.CylinderGeometry(.018,.018,.55,8),materials.bronze,[k,1.14,0]);add(x,new THREE.CylinderGeometry(.32,.22,.09,28),materials.bronze,[k,.86,0]);} add(x,new THREE.CylinderGeometry(.36,.36,.1,20),materials.wood,[0,.05,0]); return x; },
  'OBJ-015': () => { const x=g(); add(x,new THREE.CylinderGeometry(.29,.34,.26,20),materials.bronze,[0,.13,0]); add(x,new THREE.TorusGeometry(.13,.035,10,20),materials.bronze,[0,.28,0]); return x; },
  'OBJ-016': () => { const x=g(); add(x,new THREE.BoxGeometry(1.1,1.25,.42),materials.fibre,[0,.63,0]); add(x,new THREE.TorusGeometry(.3,.055,10,24),materials.fibre,[0,1.34,0]); for(const k of [-.42,.42])add(x,new THREE.CylinderGeometry(.025,.025,1.18,8),materials.wood,[k,.63,.23]); return x; },
  'OBJ-017': () => { const x=g(); add(x,new THREE.BoxGeometry(1.25,.18,.72),materials.wood,[0,.2,0]); add(x,new THREE.TorusGeometry(.48,.055,10,24),materials.fibre,[0,.5,0],[Math.PI/2,0,0]); add(x,new THREE.BoxGeometry(.7,.12,.5),materials.fibre,[0,.38,0]); return x; },
  'OBJ-018': () => { const x=g(); add(x,new THREE.BoxGeometry(1.25,.82,.7),materials.wood,[0,.45,0]); add(x,new THREE.BoxGeometry(1.35,.14,.78),materials.wood,[0,.93,0]); add(x,new THREE.BoxGeometry(.16,.22,.04),materials.bronze,[0,.7,.38]); return x; },
  'OBJ-019': () => { const x=g(); add(x,lathe([[0,0],[.34,0],[.4,.12],[.4,.4],[.28,.52],[.18,.52],[.18,.38],[.27,.3],[.28,.14],[0,.1]]),materials.clay); add(x,new THREE.CylinderGeometry(.035,.035,.75,12),materials.wood,[.48,.62,0],[0,0,-.6]); return x; },
  'OBJ-020': () => { const x=g(); add(x,new THREE.BoxGeometry(1.05,1.35,.1),materials.wood,[0,.68,0]); for(let i=0;i<6;i++)add(x,new THREE.BoxGeometry(.68,.018,.035),materials.dark,[0,.35+i*.15,.08]); return x; },
};
for (const [id, create] of Object.entries(fixtures)) {
  const scene=create(); scene.name=`${id} — DEMO NON_VALIDE`; scene.userData={status:'DEMO',historicalStatus:'NON_VALIDE',source:'Procedural technical fixture; not an authenticated reconstruction.',generator:'scripts/technical-3d-fixtures.mjs',publicationAllowed:false}; scene.updateMatrixWorld(true);
  const bounds=new THREE.Box3().setFromObject(scene), center=bounds.getCenter(new THREE.Vector3()), size=bounds.getSize(new THREE.Vector3());
  for(const child of scene.children)child.position.sub(center); scene.scale.setScalar(2/Math.max(size.x,size.y,size.z)); scene.updateMatrixWorld(true);
  const binary=Buffer.from(await new GLTFExporter().parseAsync(scene,{binary:true,onlyVisible:true}));
  if(binary.toString('ascii',0,4)!=='glTF'||binary.readUInt32LE(4)!==2||binary.readUInt32LE(8)!==binary.length)throw new Error(`${id}: invalid GLB export`);
  await writeFile(path.join(output,`${id}.glb`),binary); const actual=await readFile(path.join(output,`${id}.glb`)); if(actual.length!==binary.length)throw new Error(`${id}: unreadable export`);
  console.log(`${id}: ${binary.length} bytes · DEMO NON_VALIDE`);
}
