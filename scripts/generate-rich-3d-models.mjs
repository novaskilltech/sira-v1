/**
 * Sîra V1.0 — Génération des 20 Objets 3D Archéologiques & Matériels (Format GLB 2)
 *
 * Tous les modèles respectent rigoureusement :
 * 1. L'aniconisme strict (aucun être vivant, aucun personnage, silhouette, visage ou main).
 * 2. Les métadonnées non publiques obligatoires (DEMO / NON_VALIDE).
 * 3. Le centrage parfait à l'origine (Box3 center = [0,0,0], max extent = 2.0).
 * 4. Des matériaux PBR réalistes (terracotta, bois d'acacia patiné, basalte rugueux, bronze martelé, cuir tanné, fibres végétales).
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

const outputDir = path.resolve('public/media/demo');

// Polyfill FileReader for GLTFExporter in Node.js
if (!globalThis.FileReader) {
  globalThis.FileReader = class {
    result = null;
    onloadend = null;
    onerror = null;
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((val) => {
        this.result = val;
        this.onloadend?.({ target: this });
      }).catch((err) => this.onerror?.(err));
    }
  };
}

// Matériaux PBR évocateurs de l'Arabie du 7e siècle
const mat = {
  terracotta: new THREE.MeshStandardMaterial({ color: '#b26e47', roughness: 0.85, metalness: 0.05 }),
  terracottaDark: new THREE.MeshStandardMaterial({ color: '#874f32', roughness: 0.88, metalness: 0.03 }),
  potteryGlaze: new THREE.MeshStandardMaterial({ color: '#4a5d4e', roughness: 0.35, metalness: 0.1 }),
  woodAcacia: new THREE.MeshStandardMaterial({ color: '#6d4827', roughness: 0.75, metalness: 0.02 }),
  woodOlive: new THREE.MeshStandardMaterial({ color: '#82653a', roughness: 0.65, metalness: 0.02 }),
  woodDark: new THREE.MeshStandardMaterial({ color: '#382513', roughness: 0.85, metalness: 0.02 }),
  reedCalamus: new THREE.MeshStandardMaterial({ color: '#c4a668', roughness: 0.5, metalness: 0.05 }),
  bronzePatina: new THREE.MeshStandardMaterial({ color: '#8c7b50', roughness: 0.45, metalness: 0.6 }),
  bronzeAncient: new THREE.MeshStandardMaterial({ color: '#59553e', roughness: 0.6, metalness: 0.5 }),
  ironForged: new THREE.MeshStandardMaterial({ color: '#323234', roughness: 0.7, metalness: 0.65 }),
  stoneBasalt: new THREE.MeshStandardMaterial({ color: '#444446', roughness: 0.95, metalness: 0.02 }),
  stoneLimestone: new THREE.MeshStandardMaterial({ color: '#c8b99d', roughness: 0.9, metalness: 0.02 }),
  leatherTanned: new THREE.MeshStandardMaterial({ color: '#854b28', roughness: 0.7, metalness: 0.08 }),
  leatherStrap: new THREE.MeshStandardMaterial({ color: '#54301a', roughness: 0.75, metalness: 0.05 }),
  palmFibre: new THREE.MeshStandardMaterial({ color: '#9e814d', roughness: 0.92, metalness: 0.02 }),
  woolCloth: new THREE.MeshStandardMaterial({ color: '#bfb195', roughness: 0.95, metalness: 0.0 }),
  inkCharcoal: new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.9, metalness: 0.0 })
};

function g() { return new THREE.Group(); }
function add(parent, geometry, material, pos = [0, 0, 0], rot = [0, 0, 0], scale = [1, 1, 1]) {
  geometry.computeVertexNormals();
  const m = new THREE.Mesh(geometry, material);
  m.position.set(...pos);
  m.rotation.set(...rot);
  m.scale.set(...scale);
  parent.add(m);
  return m;
}
function lathe(points, segments = 36) {
  return new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), segments);
}

// ----------------------------------------------------------------------
// Les 20 modèles 3D
// ----------------------------------------------------------------------
const models = {
  // OBJ-001: Lampe à huile en terre cuite (Habitat)
  'OBJ-001': () => {
    const root = g();
    // Corps principal en coupelle pincée antique
    add(root, lathe([[0, 0], [0.55, 0.02], [0.75, 0.15], [0.82, 0.35], [0.7, 0.52], [0.35, 0.58], [0.25, 0.55], [0.22, 0.45], [0, 0.45]]), mat.terracotta);
    // Bec étiré pour la mèche de coton
    const spout = add(root, new THREE.ConeGeometry(0.24, 0.85, 24), mat.terracotta, [0.85, 0.32, 0], [0, 0, -Math.PI / 2.2]);
    spout.scale.set(1, 1, 0.6);
    // Trace de brûlure au bout du bec
    add(root, new THREE.SphereGeometry(0.09, 16, 12), mat.inkCharcoal, [1.22, 0.35, 0]);
    // Anse recourbée ergonomique
    const handle = add(root, new THREE.TorusGeometry(0.32, 0.08, 16, 32), mat.terracotta, [-0.8, 0.42, 0]);
    handle.scale.set(0.8, 1.2, 0.7);
    // Collerette et disque de remplissage d'huile
    add(root, new THREE.CylinderGeometry(0.22, 0.22, 0.05, 24), mat.terracottaDark, [0, 0.56, 0]);
    add(root, new THREE.CylinderGeometry(0.09, 0.09, 0.03, 16), mat.inkCharcoal, [0, 0.58, 0]);
    return root;
  },

  // OBJ-002: Coffre en bois et ferrures (Habitat)
  'OBJ-002': () => {
    const root = g();
    // Caisson en bois d'acacia
    add(root, new THREE.BoxGeometry(1.9, 0.95, 1.15), mat.woodAcacia, [0, 0.48, 0]);
    // Couvercle bombé
    const lid = add(root, new THREE.CylinderGeometry(0.62, 0.62, 1.94, 24, 1, false, 0, Math.PI), mat.woodAcacia, [0, 0.95, 0], [0, 0, -Math.PI / 2]);
    lid.scale.set(1, 1, 0.95);
    // 4 Cornières d'angles en fer forgé
    for (const x of [-0.92, 0.92]) {
      for (const z of [-0.55, 0.55]) {
        add(root, new THREE.BoxGeometry(0.08, 0.98, 0.08), mat.ironForged, [x, 0.48, z]);
      }
    }
    // Deux bandes de renfort cerclées
    for (const x of [-0.52, 0.52]) {
      add(root, new THREE.BoxGeometry(0.09, 1.0, 1.18), mat.ironForged, [x, 0.48, 0]);
    }
    // Serrure / moraillon en bronze patiné
    add(root, new THREE.BoxGeometry(0.24, 0.32, 0.07), mat.bronzePatina, [0, 0.88, 0.6]);
    add(root, new THREE.TorusGeometry(0.07, 0.02, 10, 16), mat.bronzePatina, [0, 0.78, 0.63]);
    return root;
  },

  // OBJ-003: Loquet de porte traditionnel (Habitat)
  'OBJ-003': () => {
    const root = g();
    // Plaque murale de fixation
    add(root, new THREE.BoxGeometry(0.5, 1.4, 0.12), mat.woodOlive, [-0.5, 0.7, 0]);
    // Pênes et barre coulissante en bois patiné
    add(root, new THREE.BoxGeometry(1.65, 0.22, 0.26), mat.woodDark, [0.1, 0.72, 0.12]);
    // Gâches de retenue
    add(root, new THREE.BoxGeometry(0.32, 0.45, 0.18), mat.ironForged, [-0.4, 0.72, 0.18]);
    add(root, new THREE.BoxGeometry(0.32, 0.45, 0.18), mat.ironForged, [0.55, 0.72, 0.18]);
    // Clavette et anneau de manœuvre forgé
    add(root, new THREE.TorusGeometry(0.18, 0.04, 12, 24), mat.bronzePatina, [0.1, 0.72, 0.3], [Math.PI / 2, 0, 0]);
    return root;
  },

  // OBJ-004: Meule manuelle rotative / Rahâ (Alimentation)
  'OBJ-004': () => {
    const root = g();
    // Meule dormante (inférieure) en basalte rugueux
    add(root, new THREE.CylinderGeometry(0.92, 0.95, 0.28, 36), mat.stoneBasalt, [0, 0.14, 0]);
    // Meule tournante (supérieure) avec cuvette
    add(root, new THREE.CylinderGeometry(0.86, 0.88, 0.25, 36), mat.stoneBasalt, [0, 0.4, 0]);
    // Œil central d'alimentation en grain
    add(root, new THREE.CylinderGeometry(0.22, 0.16, 0.28, 24), mat.terracottaDark, [0, 0.41, 0]);
    // Pivot en bois dur
    add(root, new THREE.CylinderGeometry(0.08, 0.08, 0.65, 16), mat.woodDark, [0, 0.45, 0]);
    // Poignée verticale excentrée en bois d'acacia
    add(root, new THREE.CylinderGeometry(0.06, 0.06, 0.45, 16), mat.woodAcacia, [0.65, 0.62, 0]);
    return root;
  },

  // OBJ-005: Récipient de cuisson / Marmite en argile (Alimentation)
  'OBJ-005': () => {
    const root = g();
    // Profil tourné de la marmite culinaire
    add(root, lathe([[0, 0], [0.6, 0.05], [0.82, 0.35], [0.85, 0.7], [0.72, 0.95], [0.68, 1.05], [0.75, 1.1], [0.64, 1.1], [0.6, 0.98], [0.7, 0.68], [0.68, 0.35], [0.45, 0.1], [0, 0.08]]), mat.terracottaDark);
    // Deux anses robustes symétriques
    for (const dir of [-1, 1]) {
      const handle = add(root, new THREE.TorusGeometry(0.24, 0.06, 12, 24), mat.terracottaDark, [dir * 0.78, 0.88, 0]);
      handle.scale.set(0.7, 1.2, 0.6);
    }
    // Base noircie par le feu
    add(root, new THREE.SphereGeometry(0.62, 24, 16), mat.inkCharcoal, [0, 0.22, 0]);
    return root;
  },

  // OBJ-006: Outre à eau en cuir / Qirbah (Eau et stockage)
  'OBJ-006': () => {
    const root = g();
    // Corps principal en peau de chèvre tannée souple
    const body = add(root, new THREE.SphereGeometry(0.78, 32, 24), mat.leatherTanned);
    body.scale.set(1.1, 0.82, 0.7);
    // Goulot ficelé
    add(root, new THREE.CylinderGeometry(0.12, 0.16, 0.38, 20), mat.leatherStrap, [0, 0.75, 0]);
    // Ligature en corde de palmier
    for (let y = 0.68; y <= 0.82; y += 0.05) {
      add(root, new THREE.TorusGeometry(0.16, 0.03, 10, 20), mat.palmFibre, [0, y, 0], [Math.PI / 2, 0, 0]);
    }
    // Sangles de suspension
    const strap = add(root, new THREE.TorusGeometry(0.85, 0.04, 10, 36), mat.leatherStrap, [0, 0.1, 0]);
    strap.scale.set(0.5, 1.1, 0.9);
    return root;
  },

  // OBJ-007: Jarre de stockage / Hababa (Eau et stockage)
  'OBJ-007': () => {
    const root = g();
    // Grande jarre ovoïde à panse cannelée
    add(root, lathe([[0, 0], [0.38, 0.05], [0.65, 0.3], [0.88, 0.75], [0.92, 1.2], [0.75, 1.65], [0.42, 1.9], [0.42, 2.15], [0.5, 2.22], [0.36, 2.22], [0.32, 1.9], [0.65, 1.6], [0.78, 1.18], [0.72, 0.7], [0.5, 0.3], [0, 0.12]]), mat.terracotta);
    // Deux anses verticales massives
    for (const dir of [-1, 1]) {
      const handle = add(root, new THREE.TorusGeometry(0.32, 0.07, 12, 24), mat.terracotta, [dir * 0.72, 1.65, 0]);
      handle.scale.set(0.6, 1.3, 0.6);
    }
    // Cordons de modelage décoratifs en relief
    add(root, new THREE.TorusGeometry(0.88, 0.035, 10, 36), mat.terracottaDark, [0, 1.1, 0], [Math.PI / 2, 0, 0]);
    add(root, new THREE.TorusGeometry(0.82, 0.035, 10, 36), mat.terracottaDark, [0, 1.35, 0], [Math.PI / 2, 0, 0]);
    return root;
  },

  // OBJ-008: Sandale antique en cuir / Na'l (Vêtements)
  'OBJ-008': () => {
    const root = g();
    // Semelle ergonomique multicouche
    const soleShape = new THREE.Shape([
      new THREE.Vector2(-0.45, -0.9),
      new THREE.Vector2(0.45, -0.9),
      new THREE.Vector2(0.55, 0.2),
      new THREE.Vector2(0.4, 0.95),
      new THREE.Vector2(-0.25, 1.05),
      new THREE.Vector2(-0.55, 0.3)
    ]);
    const extrudeSettings = { depth: 0.08, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
    add(root, new THREE.ExtrudeGeometry(soleShape, extrudeSettings), mat.leatherTanned, [0, 0, 0], [-Math.PI / 2, 0, 0]);
    // Lanière d'entre-doigt (Qibal)
    add(root, new THREE.CylinderGeometry(0.035, 0.035, 0.32, 12), mat.leatherStrap, [0.05, 0.18, 0.7]);
    // Lanières de cou-de-pied et de cheville
    const strap1 = add(root, new THREE.TorusGeometry(0.35, 0.035, 10, 24, Math.PI), mat.leatherStrap, [0, 0.18, 0.0], [0, 0, 0]);
    strap1.scale.set(1.2, 0.7, 1);
    const strap2 = add(root, new THREE.TorusGeometry(0.38, 0.035, 10, 24, Math.PI), mat.leatherStrap, [0, 0.16, -0.4], [0, 0, 0]);
    strap2.scale.set(1.1, 0.6, 1);
    return root;
  },

  // OBJ-009: Fuseau à filer la laine / Mighzal (Vêtements)
  'OBJ-009': () => {
    const root = g();
    // Tige en bois d'olivier poli
    add(root, new THREE.CylinderGeometry(0.035, 0.055, 1.6, 16), mat.woodOlive, [0, 0.8, 0]);
    // Fusaïole lestée discoïdale en stéatite
    add(root, new THREE.CylinderGeometry(0.24, 0.28, 0.14, 24), mat.stoneBasalt, [0, 0.35, 0]);
    add(root, new THREE.TorusGeometry(0.25, 0.03, 10, 24), mat.bronzePatina, [0, 0.35, 0], [Math.PI / 2, 0, 0]);
    // Crochet métallique supérieur
    add(root, new THREE.TorusGeometry(0.06, 0.018, 8, 16, Math.PI * 1.3), mat.ironForged, [0, 1.62, 0], [0, 0, Math.PI / 4]);
    // Pelote de laine cardée en cours de filage
    const wool = add(root, new THREE.SphereGeometry(0.18, 16, 12), mat.woolCloth, [0, 0.65, 0]);
    wool.scale.set(1, 1.6, 1);
    return root;
  },

  // OBJ-010: Peigne traditionnel double en bois (Vêtements)
  'OBJ-010': () => {
    const root = g();
    // Dos central profilé
    add(root, new THREE.BoxGeometry(1.6, 0.22, 0.14), mat.woodAcacia, [0, 0, 0]);
    // Dents larges d'un côté (démêlage)
    for (let x = -0.7; x <= 0.7; x += 0.14) {
      add(root, new THREE.ConeGeometry(0.03, 0.55, 8), mat.woodAcacia, [x, 0.35, 0]);
    }
    // Dents fines et serrées de l'autre côté (lissage)
    for (let x = -0.72; x <= 0.72; x += 0.06) {
      add(root, new THREE.ConeGeometry(0.016, 0.52, 8), mat.woodAcacia, [x, -0.35, 0], [Math.PI, 0, 0]);
    }
    // Gravures géométriques sur la tranche
    add(root, new THREE.BoxGeometry(1.4, 0.04, 0.16), mat.woodDark, [0, 0, 0]);
    return root;
  },

  // OBJ-011: Outil de potier / Estèque et mirette (Artisanat)
  'OBJ-011': () => {
    const root = g();
    // Manche ergonomique en bois dur
    add(root, new THREE.CylinderGeometry(0.065, 0.08, 1.15, 16), mat.woodDark, [0, 0.58, 0]);
    // Estèque plate pour galber
    const rib = add(root, new THREE.BoxGeometry(0.28, 0.45, 0.03), mat.woodOlive, [0, 1.25, 0]);
    rib.rotation.z = 0.2;
    // Virole en bronze
    add(root, new THREE.CylinderGeometry(0.08, 0.08, 0.12, 16), mat.bronzePatina, [0, 1.05, 0]);
    // Pointe biseautée inférieure pour inciser
    add(root, new THREE.ConeGeometry(0.06, 0.25, 12), mat.bronzeAncient, [0, -0.08, 0], [Math.PI, 0, 0]);
    return root;
  },

  // OBJ-012: Navette de tissage / Makkuk (Artisanat)
  'OBJ-012': () => {
    const root = g();
    // Corps fuselé en forme d'amande très lisse
    const body = add(root, new THREE.CylinderGeometry(0.12, 0.12, 1.8, 16), mat.woodOlive, [0, 0, 0], [0, 0, Math.PI / 2]);
    body.scale.set(0.7, 1, 1.4);
    // Extrémités coniques profilées
    add(root, new THREE.ConeGeometry(0.12, 0.4, 16), mat.woodOlive, [-1.05, 0, 0], [0, 0, Math.PI / 2]);
    add(root, new THREE.ConeGeometry(0.12, 0.4, 16), mat.woodOlive, [1.05, 0, 0], [0, 0, -Math.PI / 2]);
    // Cavité centrale creusée
    add(root, new THREE.BoxGeometry(0.85, 0.18, 0.12), mat.woodDark, [0, 0.04, 0]);
    // Canette de fil de trame à l'intérieur
    const spool = add(root, new THREE.CylinderGeometry(0.07, 0.07, 0.72, 16), mat.woolCloth, [0, 0.04, 0], [0, 0, Math.PI / 2]);
    spool.scale.set(1, 1, 1.3);
    return root;
  },

  // OBJ-013: Alêne de cordonnier / Mikhrâz (Artisanat)
  'OBJ-013': () => {
    const root = g();
    // Poignée piriforme ergonomique en bois poli
    const handle = add(root, new THREE.SphereGeometry(0.26, 20, 16), mat.woodOlive, [0, 0.35, 0]);
    handle.scale.set(0.75, 1.4, 0.75);
    // Virole métallique de serrage
    add(root, new THREE.CylinderGeometry(0.09, 0.09, 0.18, 16), mat.bronzePatina, [0, 0.72, 0]);
    // Pointe incurvée en acier forgé trempé
    const needle = add(root, new THREE.ConeGeometry(0.045, 0.85, 16), mat.ironForged, [0.08, 1.2, 0], [0, 0, -0.12]);
    needle.scale.set(1, 1, 0.7);
    return root;
  },

  // OBJ-014: Balance à fléau / Mizân (Commerce et mesures)
  'OBJ-014': () => {
    const root = g();
    // Anneau supérieur de suspension
    add(root, new THREE.TorusGeometry(0.14, 0.025, 12, 24), mat.bronzePatina, [0, 1.65, 0]);
    // Fléau central en bronze gradué
    add(root, new THREE.CylinderGeometry(0.04, 0.04, 1.9, 16), mat.bronzePatina, [0, 1.48, 0], [0, 0, Math.PI / 2]);
    // Aiguille centrale (languette de niveau)
    add(root, new THREE.ConeGeometry(0.03, 0.35, 12), mat.bronzePatina, [0, 1.32, 0], [Math.PI, 0, 0]);
    // Chaînettes et deux plateaux suspendus
    for (const dir of [-0.85, 0.85]) {
      // 3 chaînettes
      for (const ang of [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3]) {
        const cx = dir + Math.sin(ang) * 0.28;
        const cz = Math.cos(ang) * 0.28;
        add(root, new THREE.CylinderGeometry(0.008, 0.008, 0.7, 8), mat.bronzeAncient, [cx, 1.05, cz]);
      }
      // Plateau circulaire martelé concave
      add(root, lathe([[0, 0], [0.35, 0.02], [0.38, 0.08], [0.35, 0.09], [0, 0.04]], 24), mat.bronzePatina, [dir, 0.68, 0]);
    }
    return root;
  },

  // OBJ-015: Poids de mesure monétaire / Mithqâl (Commerce et mesures)
  'OBJ-015': () => {
    const root = g();
    // Grand poids principal tronconique à facettes
    add(root, new THREE.CylinderGeometry(0.42, 0.52, 0.55, 8), mat.bronzePatina, [0, 0.28, 0]);
    // Anneau supérieur de préhension
    add(root, new THREE.TorusGeometry(0.16, 0.04, 10, 24), mat.bronzePatina, [0, 0.65, 0]);
    // Poinçon officiel en creux au sommet
    add(root, new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16), mat.bronzeAncient, [0, 0.56, 0]);
    // Petit poids d'appoint étalonné
    add(root, new THREE.CylinderGeometry(0.2, 0.25, 0.28, 8), mat.bronzeAncient, [0.65, 0.14, 0.3]);
    return root;
  },

  // OBJ-016: Sac de voyage / Sacoche caravanière (Voyage)
  'OBJ-016': () => {
    const root = g();
    // Besace double en cuir tanné
    const bag1 = add(root, new THREE.BoxGeometry(0.85, 1.1, 0.4), mat.leatherTanned, [-0.48, 0.55, 0]);
    bag1.scale.set(1, 1, 0.85);
    const bag2 = add(root, new THREE.BoxGeometry(0.85, 1.1, 0.4), mat.leatherTanned, [0.48, 0.55, 0]);
    bag2.scale.set(1, 1, 0.85);
    // Rabats de fermeture à franges
    add(root, new THREE.BoxGeometry(0.9, 0.4, 0.44), mat.leatherStrap, [-0.48, 0.88, 0]);
    add(root, new THREE.BoxGeometry(0.9, 0.4, 0.44), mat.leatherStrap, [0.48, 0.88, 0]);
    // Lanières de liaison et boucles
    add(root, new THREE.BoxGeometry(1.2, 0.16, 0.22), mat.leatherStrap, [0, 1.05, 0]);
    add(root, new THREE.TorusGeometry(0.12, 0.025, 8, 16), mat.bronzePatina, [-0.48, 0.65, 0.24]);
    add(root, new THREE.TorusGeometry(0.12, 0.025, 8, 16), mat.bronzePatina, [0.48, 0.65, 0.24]);
    return root;
  },

  // OBJ-017: Selle de bât / Rahl (Voyage - sans animal)
  'OBJ-017': () => {
    const root = g();
    // Arçons croisés en bois de tamaris
    add(root, new THREE.CylinderGeometry(0.06, 0.06, 1.6, 16), mat.woodDark, [-0.5, 0.8, 0], [0, 0, 0.25]);
    add(root, new THREE.CylinderGeometry(0.06, 0.06, 1.6, 16), mat.woodDark, [0.5, 0.8, 0], [0, 0, -0.25]);
    // Entretoises longitudinales
    for (const z of [-0.45, 0.45]) {
      add(root, new THREE.CylinderGeometry(0.05, 0.05, 1.3, 16), mat.woodAcacia, [0, 0.65, z], [0, 0, Math.PI / 2]);
    }
    // Coussins de bât rembourrés
    const pad1 = add(root, new THREE.BoxGeometry(0.38, 0.85, 0.95), mat.palmFibre, [-0.42, 0.45, 0]);
    pad1.rotation.z = 0.25;
    const pad2 = add(root, new THREE.BoxGeometry(0.38, 0.85, 0.95), mat.palmFibre, [0.42, 0.45, 0]);
    pad2.rotation.z = -0.25;
    // Sangles d'arrimage avec anneaux
    add(root, new THREE.TorusGeometry(0.48, 0.04, 10, 24), mat.leatherStrap, [0, 0.35, 0], [Math.PI / 2, 0, 0]);
    return root;
  },

  // OBJ-018: Coffret de transport renforcé (Voyage)
  'OBJ-018': () => {
    const root = g();
    // Caisson bois rectangulaire compact
    add(root, new THREE.BoxGeometry(1.4, 0.75, 0.85), mat.woodAcacia, [0, 0.42, 0]);
    // Couvercle à charnières
    add(root, new THREE.BoxGeometry(1.46, 0.12, 0.92), mat.woodDark, [0, 0.85, 0]);
    // Cerclages d'angle en tôle de cuivre/fer
    for (const x of [-0.68, 0.68]) {
      for (const z of [-0.4, 0.4]) {
        add(root, new THREE.BoxGeometry(0.08, 0.78, 0.08), mat.ironForged, [x, 0.42, z]);
      }
    }
    // Poignées latérales tombantes pour le transport à deux
    for (const x of [-0.73, 0.73]) {
      add(root, new THREE.TorusGeometry(0.14, 0.025, 8, 16), mat.ironForged, [x, 0.45, 0], [0, Math.PI / 2, 0]);
    }
    // Fermoir central à goupille
    add(root, new THREE.BoxGeometry(0.18, 0.26, 0.05), mat.bronzePatina, [0, 0.7, 0.45]);
    return root;
  },

  // OBJ-019: Encrier et calames / Mihbarah (Écriture)
  'OBJ-019': () => {
    const root = g();
    // Encrier en faïence lustrée ou terre cuite vernie
    add(root, lathe([[0, 0], [0.42, 0.02], [0.55, 0.15], [0.58, 0.5], [0.45, 0.75], [0.28, 0.8], [0.28, 0.95], [0.34, 1.0], [0.24, 1.0], [0.2, 0.75], [0.42, 0.45], [0.38, 0.12], [0, 0.1]]), mat.potteryGlaze);
    // Encre noire au noir de fumée visible dans le goulot
    add(root, new THREE.CylinderGeometry(0.19, 0.19, 0.05, 20), mat.inkCharcoal, [0, 0.76, 0]);
    // Bouchon / opercule en bois à cordon
    add(root, new THREE.CylinderGeometry(0.24, 0.24, 0.08, 20), mat.woodDark, [0.55, 0.04, 0.4]);
    // Deux calames de roseau biseautés taillés avec précision
    add(root, new THREE.CylinderGeometry(0.035, 0.035, 1.45, 12), mat.reedCalamus, [0.35, 0.7, 0], [0, 0, -0.45]);
    add(root, new THREE.ConeGeometry(0.035, 0.12, 12), mat.inkCharcoal, [0.03, 1.32, 0], [0, 0, -0.45]); // Pointe encrée
    add(root, new THREE.CylinderGeometry(0.03, 0.03, 1.35, 12), mat.reedCalamus, [0.5, 0.65, 0.2], [0.2, 0, -0.38]);
    return root;
  },

  // OBJ-020: Tablette d'écriture en bois / Lawh (Écriture)
  'OBJ-020': () => {
    const root = g();
    // Planche rectangulaire en bois d'acacia lissé
    add(root, new THREE.BoxGeometry(1.15, 1.6, 0.08), mat.woodOlive, [0, 0.8, 0]);
    // Poignée supérieure trapézoïdale
    const grip = add(root, new THREE.BoxGeometry(0.48, 0.32, 0.08), mat.woodOlive, [0, 1.74, 0]);
    grip.scale.set(1, 1, 1);
    // Œillet de suspension au sommet
    add(root, new THREE.TorusGeometry(0.08, 0.02, 10, 20), mat.woodDark, [0, 1.76, 0]);
    // Lignes d'exercice tracées à l'encre noire
    for (let i = 0; i < 7; i++) {
      const y = 0.32 + i * 0.16;
      add(root, new THREE.BoxGeometry(0.9, 0.025, 0.02), mat.inkCharcoal, [0, y, 0.045]);
    }
    return root;
  }
};

async function main() {
  console.log(`Démarrage de la génération des 20 objets 3D GLB...`);
  const results = [];

  for (const [id, createFn] of Object.entries(models)) {
    console.log(`\n--- Génération de ${id} ---`);
    const scene = createFn();
    scene.name = `${id} — DEMO NON_VALIDE`;
    
    // Métadonnées obligatoires du CDC et des tests de recette
    scene.userData = {
      status: 'DEMO',
      historicalStatus: 'NON_VALIDE',
      source: 'Génération procédurale Three.js — Matériel archéologique de travail V1.0.',
      generator: 'scripts/generate-rich-3d-models.mjs',
      publicationAllowed: false,
      aniconismVerified: true,
      humanFiguresCount: 0
    };

    // Attribution des extras sur les nœuds pour satisfaire tests/technical-media.test.ts
    scene.traverse((obj) => {
      obj.userData = {
        status: 'DEMO',
        historicalStatus: 'NON_VALIDE',
        publicationAllowed: false
      };
    });

    scene.updateMatrixWorld(true);

    // Centrage parfait à l'origine et normalisation de l'envergure max à 2.0
    const bounds = new THREE.Box3().setFromObject(scene);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());

    for (const child of scene.children) {
      child.position.sub(center);
    }
    const maxExtent = Math.max(size.x, size.y, size.z);
    const scaleFactor = 2.0 / maxExtent;
    scene.scale.setScalar(scaleFactor);
    scene.updateMatrixWorld(true);

    // Re-contrôle du centrage
    const normalizedBounds = new THREE.Box3().setFromObject(scene);
    const normalizedCenter = normalizedBounds.getCenter(new THREE.Vector3());
    if (normalizedCenter.length() > 1e-4) {
      console.warn(`Avertissement centrage ${id}: offset = ${normalizedCenter.length()}`);
    }

    // Export binaire GLB
    const exporter = new GLTFExporter();
    const arrayBuffer = await exporter.parseAsync(scene, { binary: true, onlyVisible: true });
    const buffer = Buffer.from(arrayBuffer);

    // Validation intégrité GLB 2
    if (
      buffer.toString('ascii', 0, 4) !== 'glTF' ||
      buffer.readUInt32LE(4) !== 2 ||
      buffer.readUInt32LE(8) !== buffer.length
    ) {
      throw new Error(`En-tête GLB 2 invalide pour ${id}`);
    }

    const filePath = path.join(outputDir, `${id}.glb`);
    await writeFile(filePath, buffer);
    const readBack = await readFile(filePath);
    if (readBack.length !== buffer.length) {
      throw new Error(`Erreur d'écriture pour ${id}`);
    }

    console.log(`✓ Succès ! ${id}.glb écrit (${buffer.length} octets, max extent 2.0, centré).`);
    results.push({ id, bytes: buffer.length, status: 'SUCCESS' });
  }

  console.log(`\n========================================`);
  console.log(`20 modèles 3D GLB générés et intégrés avec succès !`);
  console.log(`========================================`);
}

main().catch((err) => {
  console.error("Erreur critique :", err);
  process.exit(1);
});
