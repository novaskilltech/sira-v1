/**
 * Sîra V1.0 — Générateur enrichi des 45 illustrations originales et 14 aperçus d'animation (SVG vectoriel multi-couches)
 *
 * Conformité stricte :
 * - Aniconisme absolu : aucune personne, silhouette, visage, main, ombre humaine ni animal ("No people, silhouettes, animals").
 * - Aucune balise externe ou interdite (<use>, <image>, <script>, <foreignObject>).
 * - Marquage explicite DEMO / NON VALIDÉ.
 * - Mise à jour automatique des empreintes SHA-256 et tailles en octets dans public/content/manifest.v1.json.
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const manifestPath = path.resolve('public/content/manifest.v1.json');
const registry = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const output = path.resolve('public/media/demo');

const safeText = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char]);

// Palettes atmosphériques (ciel haut, ciel bas, montagne lointaine, relief proche, accent or/ocre, texte clair)
const themes = {
  meccaValley: ['#1a2a3a', '#4a3b32', '#3b2d26', '#261c17', '#d8b467', '#f6efe2'],
  desertDawn: ['#2c3e50', '#c97b53', '#8c5336', '#59331f', '#f0c97d', '#fbf5e9'],
  revelationLight: ['#0f2027', '#203a43', '#2c5364', '#1b2b34', '#f5d77f', '#f7f4eb'],
  redSea: ['#16324f', '#2a6f97', '#1d4e6f', '#3d3124', '#e2b86b', '#f2f7fa'],
  medinaOasis: ['#19382d', '#2d5a47', '#234235', '#3e2f23', '#d9ba75', '#f3f6f0'],
  nightJourney: ['#0b132b', '#1c2541', '#222b45', '#141929', '#e0c068', '#eef1f8'],
  sandDunes: ['#4a3525', '#8c5e3c', '#6e472b', '#422917', '#e8c57b', '#fcf6ec'],
  earthCraft: ['#3d271d', '#6b4432', '#4e3123', '#2e1c13', '#dfae62', '#f9f2e7'],
  parchmentScribe: ['#2a231d', '#4d3f32', '#382e24', '#211b15', '#d4af63', '#f7f1e3'],
};

// Générateurs de motifs vectoriels réutilisables (sans balise <use>)
function stars(seed, color = '#f6efe2') {
  let out = `<g fill="${color}" opacity="0.55">`;
  for (let i = 0; i < 14; i++) {
    const cx = 42 + ((seed * (i + 3) * 29) % 436);
    const cy = 38 + ((seed * (i + 7) * 17) % 85);
    const r = (i % 3 === 0) ? 2.2 : 1.3;
    out += `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
  }
  out += `</g>`;
  return out;
}

function sunOrMoon(type, x, y, color) {
  if (type === 'crescent') {
    return `<g opacity="0.88">
      <path d="M${x} ${y - 22} A22 22 0 1 0 ${x + 22} ${y} A17 17 0 1 1 ${x} ${y - 22} Z" fill="${color}"/>
      <circle cx="${x}" cy="${y}" r="36" fill="${color}" opacity="0.12"/>
    </g>`;
  }
  if (type === 'rays') {
    let rays = '';
    for (let a = 0; a < 360; a += 30) {
      const rad = (a * Math.PI) / 180;
      const x1 = Math.round(x + Math.cos(rad) * 28);
      const y1 = Math.round(y + Math.sin(rad) * 28);
      const x2 = Math.round(x + Math.cos(rad) * 58);
      const y2 = Math.round(y + Math.sin(rad) * 58);
      rays += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.5" opacity="0.4"/>`;
    }
    return `<g>${rays}<circle cx="${x}" cy="${y}" r="22" fill="${color}" opacity="0.85"/><circle cx="${x}" cy="${y}" r="42" fill="${color}" opacity="0.18"/></g>`;
  }
  return `<g>
    <circle cx="${x}" cy="${y}" r="24" fill="${color}" opacity="0.75"/>
    <circle cx="${x}" cy="${y}" r="40" fill="${color}" opacity="0.15"/>
  </g>`;
}

function mountainRange(cFar, cNear, variant = 0) {
  const p1 = variant % 2 === 0
    ? 'M24 235 L24 162 L88 118 L154 156 L232 98 L314 148 L392 108 L458 144 L496 126 L496 235 Z'
    : 'M24 235 L24 148 L96 104 L176 149 L258 112 L338 92 L418 142 L496 114 L496 235 Z';
  const p2 = variant % 2 === 0
    ? 'M24 252 L24 192 L112 158 L198 196 L284 146 L376 188 L448 162 L496 178 L496 252 Z'
    : 'M24 252 L24 182 L84 164 L168 198 L264 152 L352 184 L436 154 L496 182 L496 252 Z';
  return `<path d="${p1}" fill="${cFar}" opacity="0.85"/>
          <path d="${p2}" fill="${cNear}" opacity="0.95"/>`;
}

function sandHorizons(cFar, cNear, accent) {
  return `<path d="M24 245 Q140 165 268 198 T496 172 L496 255 L24 255 Z" fill="${cFar}" opacity="0.85"/>
          <path d="M24 255 Q175 195 310 218 T496 192 L496 262 L24 262 Z" fill="${cNear}" opacity="0.95"/>
          <path d="M44 222 Q165 182 288 206 T476 184" fill="none" stroke="${accent}" stroke-width="2" opacity="0.55"/>`;
}

function palmTree(x, y, scale, trunkColor, frondColor) {
  return `<g transform="translate(${x},${y}) scale(${scale})">
    <path d="M0 0 Q-4 -28 2 -56" fill="none" stroke="${trunkColor}" stroke-width="5" stroke-linecap="round"/>
    <path d="M2 -56 Q-22 -64 -32 -46" fill="none" stroke="${frondColor}" stroke-width="3" stroke-linecap="round"/>
    <path d="M2 -56 Q-18 -76 -34 -68" fill="none" stroke="${frondColor}" stroke-width="3" stroke-linecap="round"/>
    <path d="M2 -56 Q0 -82 -12 -86" fill="none" stroke="${frondColor}" stroke-width="3" stroke-linecap="round"/>
    <path d="M2 -56 Q18 -78 32 -70" fill="none" stroke="${frondColor}" stroke-width="3" stroke-linecap="round"/>
    <path d="M2 -56 Q24 -64 36 -46" fill="none" stroke="${frondColor}" stroke-width="3" stroke-linecap="round"/>
  </g>`;
}

function compassRose(x, y, color) {
  return `<g transform="translate(${x},${y})" stroke="${color}" fill="none">
    <circle cx="0" cy="0" r="22" stroke-width="1.2" opacity="0.65"/>
    <circle cx="0" cy="0" r="16" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.5"/>
    <polygon points="0,-26 4,-5 0,-9 -4,-5" fill="${color}"/>
    <polygon points="0,26 3,5 0,9 -3,5" fill="${color}" opacity="0.5"/>
    <polygon points="-26,0 -5,-3 -9,0 -5,3" fill="${color}" opacity="0.5"/>
    <polygon points="26,0 5,-3 9,0 5,3" fill="${color}" opacity="0.5"/>
  </g>`;
}

// Scène spécifique par ID d'actif
function buildCustomArtwork(assetId, index, isAnimation) {
  // Sélection de la palette et du décor selon la famille et le numéro
  if (assetId.startsWith('IMG-CHR-')) {
    const num = parseInt(assetId.slice(8), 10);
    if (num === 1) {
      // Cuvette de La Mecque et pistes caravanières
      const t = themes.meccaValley;
      return {
        colors: t,
        scene: `
          ${stars(num, t[4])}
          ${sunOrMoon('disc', 410, 78, t[4])}
          ${mountainRange(t[2], t[3], 0)}
          <rect x="232" y="154" width="52" height="46" rx="3" fill="${t[3]}" stroke="${t[4]}" stroke-width="2.5"/>
          <line x1="232" y1="168" x2="284" y2="168" stroke="${t[4]}" stroke-width="3"/>
          <path d="M58 242 Q178 214 258 202 Q342 214 462 242" fill="none" stroke="${t[4]}" stroke-width="3" stroke-dasharray="6 6"/>
        `
      };
    }
    if (num === 2 || num === 3) {
      // Désert de la Badia / Pistes caravanières vers le Nord
      const t = themes.desertDawn;
      return {
        colors: t,
        scene: `
          ${sunOrMoon('disc', 120 + num * 30, 82, t[4])}
          ${sandHorizons(t[2], t[3], t[4])}
          ${num === 2
            ? `<polygon points="150,215 195,175 240,215" fill="${t[3]}" stroke="${t[4]}" stroke-width="2"/>
               <polygon points="265,222 302,188 340,222" fill="${t[3]}" stroke="${t[4]}" stroke-width="2"/>`
            : `<path d="M72 238 C165 190, 290 230, 445 162" fill="none" stroke="${t[4]}" stroke-width="3.5" stroke-dasharray="8 6"/>
               <rect x="172" y="192" width="12" height="22" rx="2" fill="${t[4]}"/>
               <rect x="312" y="182" width="12" height="22" rx="2" fill="${t[4]}"/>`
          }
        `
      };
    }
    if (num === 4 || num === 6) {
      // Architecture domestique mecquoise / Dar al-Arqam
      const t = themes.earthCraft;
      return {
        colors: t,
        scene: `
          <rect x="84" y="68" width="352" height="176" rx="8" fill="${t[2]}" stroke="${t[4]}" stroke-width="2"/>
          <path d="M134 244 V134 A50 50 0 0 1 234 134 V244" fill="${t[3]}" stroke="${t[4]}" stroke-width="2.5"/>
          <path d="M276 244 V134 A50 50 0 0 1 376 134 V244" fill="${t[3]}" stroke="${t[4]}" stroke-width="2.5"/>
          <circle cx="255" cy="112" r="24" fill="${t[4]}" opacity="0.22"/>
          <path d="M238 116 Q255 128 272 116 L282 110 L268 108 Z" fill="${t[4]}"/>
        `
      };
    }
    if (num === 5 || num === 7) {
      // Jabal an-Nûr (Grotte de Hirâ') / Appel sur le mont as-Safâ
      const t = themes.revelationLight;
      return {
        colors: t,
        scene: `
          ${stars(num, t[4])}
          ${sunOrMoon('rays', 260, 86, t[4])}
          <polygon points="75,248 260,88 445,248" fill="${t[2]}" stroke="${t[4]}" stroke-width="2"/>
          <polygon points="225,185 260,138 295,185" fill="${t[3]}" stroke="${t[4]}" stroke-width="1.8"/>
          <circle cx="260" cy="148" r="65" fill="none" stroke="${t[4]}" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.6"/>
          <circle cx="260" cy="148" r="95" fill="none" stroke="${t[4]}" stroke-width="1.2" stroke-dasharray="4 8" opacity="0.4"/>
        `
      };
    }
    if (num === 8 || num === 10) {
      // Épreuves mecquoises / Ravin du boycott (Shi'b Abî Tâlib)
      const t = themes.meccaValley;
      return {
        colors: t,
        scene: `
          ${sunOrMoon('disc', 260, 74, '#e07a5f')}
          <polygon points="24,64 195,248 24,248" fill="${t[3]}"/>
          <polygon points="496,64 325,248 496,248" fill="${t[3]}"/>
          <path d="M195 248 L260 198 L325 248" fill="none" stroke="${t[4]}" stroke-width="2.5"/>
          ${num === 10
            ? `<rect x="238" y="102" width="44" height="58" rx="3" fill="${t[5]}" stroke="${t[4]}" stroke-width="2"/>
               <line x1="246" y1="118" x2="274" y2="118" stroke="${t[2]}" stroke-width="2"/>
               <line x1="246" y1="132" x2="270" y2="132" stroke="${t[2]}" stroke-width="2"/>`
            : `<circle cx="235" cy="168" r="14" fill="none" stroke="${t[4]}" stroke-width="4"/>
               <circle cx="285" cy="168" r="14" fill="none" stroke="${t[4]}" stroke-width="4"/>
               <line x1="252" y1="158" x2="268" y2="178" stroke="${t[4]}" stroke-width="3"/>`
          }
        `
      };
    }
    if (num === 9) {
      // Traversée de la mer Rouge vers l'Abyssinie
      const t = themes.redSea;
      return {
        colors: t,
        scene: `
          ${sunOrMoon('disc', 405, 76, t[4])}
          <path d="M24 205 Q105 190 185 205 T345 205 T496 205 L496 255 L24 255 Z" fill="${t[2]}"/>
          <path d="M48 228 Q130 215 215 228 T385 228 T480 228" fill="none" stroke="${t[4]}" stroke-width="2" opacity="0.65"/>
          <path d="M185 196 L315 196 L292 220 L208 220 Z" fill="${t[3]}" stroke="${t[4]}" stroke-width="2"/>
          <line x1="252" y1="102" x2="252" y2="196" stroke="${t[4]}" stroke-width="3.5"/>
          <polygon points="252,106 328,176 205,184" fill="${t[5]}" opacity="0.9" stroke="${t[4]}" stroke-width="1.5"/>
        `
      };
    }
    if (num === 11 || num === 12 || num === 13) {
      // Taïf / Pactes nocturnes d'al-‘Aqaba / Départ nocturne de l'Hégire
      const t = themes.nightJourney;
      return {
        colors: t,
        scene: `
          ${stars(num, t[4])}
          ${sunOrMoon('crescent', 395, 78, t[4])}
          ${mountainRange(t[2], t[3], num)}
          ${num === 12
            ? Array.from({ length: 12 }, (_, k) => `<rect x="${112 + k * 25}" y="196" width="8" height="28" rx="3" fill="${t[4]}" opacity="0.88"/>`).join('')
            : `<path d="M74 242 Q195 212 285 178 T438 118" fill="none" stroke="${t[4]}" stroke-width="3.5" stroke-dasharray="7 6"/>`
          }
        `
      };
    }
    if (num === 14 || num === 15 || num === 16) {
      // Arrivée à Qubâ', Mosquée de Médine et Constitution (Sahîfa)
      const t = themes.medinaOasis;
      return {
        colors: t,
        scene: `
          ${sunOrMoon('disc', 415, 76, t[4])}
          <path d="M24 248 L496 248" stroke="${t[4]}" stroke-width="2"/>
          ${palmTree(92, 238, 1.15, t[4], '#6aa887')}
          ${palmTree(428, 238, 1.15, t[4], '#6aa887')}
          ${num === 15
            ? `<rect x="148" y="138" width="224" height="100" fill="${t[3]}" stroke="${t[4]}" stroke-width="2.5"/>
               <line x1="142" y1="138" x2="378" y2="138" stroke="${t[4]}" stroke-width="6"/>
               <line x1="192" y1="138" x2="192" y2="238" stroke="${t[4]}" stroke-width="5"/>
               <line x1="236" y1="138" x2="236" y2="238" stroke="${t[4]}" stroke-width="5"/>
               <line x1="280" y1="138" x2="280" y2="238" stroke="${t[4]}" stroke-width="5"/>
               <line x1="324" y1="138" x2="324" y2="238" stroke="${t[4]}" stroke-width="5"/>`
            : num === 16
            ? `<rect x="195" y="96" width="130" height="132" rx="6" fill="${t[5]}" stroke="${t[4]}" stroke-width="3"/>
               <line x1="215" y1="126" x2="305" y2="126" stroke="${t[0]}" stroke-width="2.5"/>
               <line x1="215" y1="148" x2="305" y2="148" stroke="${t[0]}" stroke-width="2.5"/>
               <line x1="215" y1="170" x2="285" y2="170" stroke="${t[0]}" stroke-width="2.5"/>
               <circle cx="260" cy="202" r="12" fill="${t[4]}"/>`
            : `<rect x="175" y="152" width="170" height="86" rx="4" fill="${t[3]}" stroke="${t[4]}" stroke-width="2.5"/>
               <path d="M235 238 V186 A25 25 0 0 1 285 186 V238" fill="${t[0]}" stroke="${t[4]}" stroke-width="2"/>`
          }
        `
      };
    }
    if (num === 17 || num === 18 || num === 19) {
      // Badr (puits & dunes), Uhud (massif granitique), Khandaq (tranchée du Fossé)
      const t = themes.sandDunes;
      return {
        colors: t,
        scene: `
          ${mountainRange(t[2], t[3], num)}
          ${num === 17
            ? `<ellipse cx="195" cy="216" rx="42" ry="16" fill="${t[0]}" stroke="${t[4]}" stroke-width="3"/>
               <ellipse cx="335" cy="222" rx="34" ry="13" fill="${t[0]}" stroke="${t[4]}" stroke-width="2.5"/>
               <line x1="260" y1="115" x2="260" y2="215" stroke="${t[4]}" stroke-width="3"/>
               <polygon points="260,115 308,132 260,148" fill="${t[4]}"/>`
            : num === 18
            ? `<polygon points="64,242 184,96 294,168 398,88 468,242" fill="${t[2]}" stroke="${t[4]}" stroke-width="2.5"/>
               <ellipse cx="260" cy="218" rx="95" ry="22" fill="${t[3]}" stroke="${t[4]}" stroke-width="2"/>`
            : `<path d="M48 198 L168 198 L195 238 L325 238 L352 198 L472 198" fill="none" stroke="${t[4]}" stroke-width="4"/>
               <path d="M195 238 L325 238" stroke="${t[0]}" stroke-width="10"/>`
          }
        `
      };
    }
    if (num === 20 || num === 21 || num === 22 || num === 23 || num === 24) {
      // Hudaybiyya, Entrée à La Mecque, Délégations, Pèlerinage d'adieu, Derniers jours
      const t = num === 21 ? themes.nightJourney : num === 20 ? themes.medinaOasis : themes.desertDawn;
      return {
        colors: t,
        scene: `
          ${num === 21 ? stars(num, t[4]) : sunOrMoon('rays', 260, 84, t[4])}
          ${mountainRange(t[2], t[3], num)}
          ${num === 20
            ? `<path d="M260 236 V152" stroke="${t[4]}" stroke-width="8" stroke-linecap="round"/>
               <ellipse cx="260" cy="138" rx="78" ry="28" fill="#3b6e52" stroke="${t[4]}" stroke-width="2"/>`
            : num === 21
            ? Array.from({ length: 9 }, (_, i) => `<circle cx="${88 + i * 42}" cy="${168 - (i % 3) * 18}" r="5" fill="#f4a261"/><circle cx="${88 + i * 42}" cy="${168 - (i % 3) * 18}" r="11" fill="#f4a261" opacity="0.3"/>`).join('')
            : num === 22
            ? `<circle cx="260" cy="168" r="34" fill="${t[3]}" stroke="${t[4]}" stroke-width="3"/>
               <circle cx="260" cy="168" r="24" fill="none" stroke="${t[4]}" stroke-width="1.5" stroke-dasharray="4 3"/>
               <line x1="120" y1="168" x2="215" y2="168" stroke="${t[4]}" stroke-width="2.5" stroke-dasharray="5 5"/>
               <line x1="305" y1="168" x2="400" y2="168" stroke="${t[4]}" stroke-width="2.5" stroke-dasharray="5 5"/>`
            : num === 23
            ? `<polygon points="180,238 260,118 340,238" fill="${t[2]}" stroke="${t[4]}" stroke-width="2.5"/>
               <rect x="256" y="88" width="8" height="32" fill="${t[5]}"/>
               <polygon points="92,238 116,204 140,238" fill="${t[5]}" opacity="0.85"/>
               <polygon points="376,238 400,204 424,238" fill="${t[5]}" opacity="0.85"/>`
            : `<rect x="168" y="112" width="184" height="126" rx="6" fill="${t[3]}" stroke="${t[4]}" stroke-width="2.5"/>
               <path d="M222 238 V152 A38 38 0 0 1 298 152 V238" fill="${t[0]}" stroke="${t[4]}" stroke-width="2"/>
               <circle cx="260" cy="176" r="14" fill="${t[4]}" opacity="0.45"/>`
          }
        `
      };
    }
  }

  // Cartes et étapes de l'Hégire (IMG-HEG-*)
  if (assetId.startsWith('IMG-HEG-')) {
    const t = themes.nightJourney;
    return {
      colors: t,
      scene: `
        ${stars(index + 11, t[4])}
        ${compassRose(432, 86, t[4])}
        <path d="M54 228 Q145 215 212 178 T348 134 T438 92" fill="none" stroke="${t[4]}" stroke-width="4" stroke-dasharray="8 6"/>
        <circle cx="54" cy="228" r="8" fill="${t[4]}"/>
        <circle cx="148" cy="204" r="7" fill="${t[2]}" stroke="${t[4]}" stroke-width="2.5"/>
        <circle cx="272" cy="156" r="7" fill="${t[2]}" stroke="${t[4]}" stroke-width="2.5"/>
        <circle cx="378" cy="118" r="8" fill="${t[4]}"/>
        <path d="M44 162 Q132 138 218 164 T392 148" fill="none" stroke="${t[4]}" stroke-width="1.2" opacity="0.35"/>
        <path d="M44 192 Q152 168 248 194 T412 178" fill="none" stroke="${t[4]}" stroke-width="1.2" opacity="0.35"/>
      `
    };
  }

  // Vie quotidienne — Thèmes et Détails (IMG-VIE-*)
  if (assetId.startsWith('IMG-VIE-')) {
    const isScribe = assetId.includes('08') && assetId.includes('THEME') || assetId.includes('23');
    const t = isScribe ? themes.parchmentScribe : themes.earthCraft;
    if (assetId === 'IMG-VIE-THEME-01') {
      // Habitat : lampe, coffre, porte
      return {
        colors: t,
        scene: `
          <rect x="78" y="88" width="136" height="146" rx="6" fill="${t[3]}" stroke="${t[4]}" stroke-width="2.5"/>
          <rect x="96" y="148" width="100" height="18" rx="3" fill="${t[4]}"/>
          <rect x="248" y="156" width="168" height="78" rx="5" fill="${t[2]}" stroke="${t[4]}" stroke-width="2.5"/>
          <line x1="248" y1="182" x2="416" y2="182" stroke="${t[4]}" stroke-width="3"/>
          <path d="M298 118 Q332 138 368 118 L384 106 L358 104 Z" fill="${t[4]}"/>
          <circle cx="384" cy="102" r="8" fill="#f4a261"/>
        `
      };
    }
    if (assetId === 'IMG-VIE-THEME-02' || assetId === 'IMG-VIE-DETAIL-05') {
      // Alimentation & cuisson : meule et marmite sur foyer
      return {
        colors: t,
        scene: `
          <ellipse cx="165" cy="198" rx="68" ry="24" fill="${t[3]}" stroke="${t[4]}" stroke-width="2.5"/>
          <ellipse cx="165" cy="182" rx="64" ry="22" fill="${t[2]}" stroke="${t[4]}" stroke-width="2.5"/>
          <line x1="205" y1="176" x2="205" y2="132" stroke="${t[4]}" stroke-width="6" stroke-linecap="round"/>
          <path d="M302 152 Q302 224 358 224 Q414 224 414 152 Z" fill="${t[2]}" stroke="${t[4]}" stroke-width="2.5"/>
          <ellipse cx="358" cy="152" rx="56" ry="14" fill="${t[3]}" stroke="${t[4]}" stroke-width="2"/>
          <path d="M338 128 Q346 110 338 94 M358 124 Q366 106 358 88 M378 128 Q386 110 378 94" fill="none" stroke="${t[4]}" stroke-width="2" opacity="0.7"/>
        `
      };
    }
    if (assetId === 'IMG-VIE-THEME-03' || assetId === 'IMG-VIE-DETAIL-08') {
      // Eau et stockage : jarre et outre
      return {
        colors: t,
        scene: `
          <path d="M152 96 H196 V122 Q238 156 218 214 Q206 238 174 238 Q142 238 130 214 Q110 156 152 122 Z" fill="${t[2]}" stroke="${t[4]}" stroke-width="2.5"/>
          <path d="M318 112 H354 L348 136 Q396 158 392 204 Q386 236 336 236 Q286 236 282 204 Q280 158 322 136 Z" fill="${t[3]}" stroke="${t[4]}" stroke-width="2.5"/>
          <line x1="316" y1="124" x2="356" y2="124" stroke="${t[4]}" stroke-width="3.5"/>
        `
      };
    }
    if (assetId === 'IMG-VIE-THEME-04' || assetId === 'IMG-VIE-THEME-05' || assetId === 'IMG-VIE-DETAIL-13') {
      // Textiles, artisanat, poterie et tissage
      return {
        colors: t,
        scene: `
          <line x1="124" y1="88" x2="124" y2="232" stroke="${t[4]}" stroke-width="5" stroke-linecap="round"/>
          <ellipse cx="124" cy="186" rx="34" ry="12" fill="${t[2]}" stroke="${t[4]}" stroke-width="2.5"/>
          <path d="M212 162 Q288 112 364 162 Q288 212 212 162 Z" fill="${t[3]}" stroke="${t[4]}" stroke-width="2.5"/>
          <ellipse cx="288" cy="162" rx="38" ry="12" fill="${t[2]}" stroke="${t[4]}" stroke-width="2"/>
          <rect x="392" y="114" width="56" height="104" rx="6" fill="${t[2]}" stroke="${t[4]}" stroke-width="2"/>
          <line x1="402" y1="132" x2="438" y2="132" stroke="${t[4]}" stroke-width="2"/>
          <line x1="402" y1="148" x2="438" y2="148" stroke="${t[4]}" stroke-width="2"/>
          <line x1="402" y1="164" x2="438" y2="164" stroke="${t[4]}" stroke-width="2"/>
        `
      };
    }
    if (assetId === 'IMG-VIE-THEME-06') {
      // Commerce et mesures : balance à fléau et poids
      return {
        colors: t,
        scene: `
          <line x1="230" y1="78" x2="230" y2="236" stroke="${t[4]}" stroke-width="5"/>
          <line x1="128" y1="108" x2="332" y2="108" stroke="${t[4]}" stroke-width="4" stroke-linecap="round"/>
          <line x1="142" y1="108" x2="122" y2="178" stroke="${t[4]}" stroke-width="1.8"/>
          <line x1="142" y1="108" x2="162" y2="178" stroke="${t[4]}" stroke-width="1.8"/>
          <path d="M112 178 Q142 198 172 178 Z" fill="${t[4]}"/>
          <line x1="318" y1="108" x2="298" y2="178" stroke="${t[4]}" stroke-width="1.8"/>
          <line x1="318" y1="108" x2="338" y2="178" stroke="${t[4]}" stroke-width="1.8"/>
          <path d="M288 178 Q318 198 348 178 Z" fill="${t[4]}"/>
          <polygon points="388,232 398,184 438,184 448,232" fill="${t[2]}" stroke="${t[4]}" stroke-width="2.5"/>
          <circle cx="418" cy="174" r="9" fill="none" stroke="${t[4]}" stroke-width="3"/>
        `
      };
    }
    if (assetId === 'IMG-VIE-THEME-07') {
      // Voyage et équipements : selle de bât, sacoches, coffret
      return {
        colors: t,
        scene: `
          ${stars(77, t[4])}
          <rect x="86" y="132" width="96" height="98" rx="10" fill="${t[2]}" stroke="${t[4]}" stroke-width="2.5"/>
          <path d="M86 164 Q134 184 182 164" fill="none" stroke="${t[4]}" stroke-width="2.5"/>
          <path d="M222 228 L264 128 L306 228 M214 202 H314" fill="none" stroke="${t[4]}" stroke-width="5" stroke-linecap="round"/>
          <rect x="344" y="156" width="108" height="74" rx="5" fill="${t[3]}" stroke="${t[4]}" stroke-width="2.5"/>
          <line x1="344" y1="180" x2="452" y2="180" stroke="${t[4]}" stroke-width="3"/>
        `
      };
    }
    // Écriture et transmission : tablette, calame, encrier
    return {
      colors: t,
      scene: `
        <rect x="96" y="78" width="128" height="158" rx="6" fill="${t[2]}" stroke="${t[4]}" stroke-width="2.5"/>
        <line x1="116" y1="114" x2="204" y2="114" stroke="${t[4]}" stroke-width="2.5"/>
        <line x1="116" y1="138" x2="204" y2="138" stroke="${t[4]}" stroke-width="2.5"/>
        <line x1="116" y1="162" x2="188" y2="162" stroke="${t[4]}" stroke-width="2.5"/>
        <line x1="116" y1="186" x2="196" y2="186" stroke="${t[4]}" stroke-width="2.5"/>
        <path d="M278 168 H326 L338 232 H266 Z" fill="${t[3]}" stroke="${t[4]}" stroke-width="2.5"/>
        <line x1="332" y1="188" x2="432" y2="92" stroke="${t[4]}" stroke-width="6" stroke-linecap="round"/>
        <polygon points="322,198 332,184 338,192" fill="${t[5]}"/>
      `
    };
  }

  // Animations scénarisées (ANI-001 à ANI-014)
  const t = themes.nightJourney;
  const seed = index * 17 + 23;
  return {
    colors: t,
    scene: `
      ${stars(seed, t[4])}
      ${compassRose(434, 82, t[4])}
      <path d="M68 228 C148 ${112 + (seed % 40)}, 276 ${260 - (seed % 45)}, 442 126" fill="none" stroke="${t[4]}" stroke-width="4.5" stroke-dasharray="8 8"/>
      <circle cx="68" cy="228" r="9" fill="${t[4]}"/>
      <circle cx="248" cy="${178 - (seed % 24)}" r="7" fill="${t[2]}" stroke="${t[4]}" stroke-width="2.5"/>
      <circle cx="442" cy="126" r="9" fill="${t[4]}"/>
    `
  };
}

const visualAssets = registry.assets.filter((asset) =>
  ['illustration_originale', 'animation_scenarisee'].includes(asset.kind)
);

if (
  visualAssets.filter((a) => a.kind === 'illustration_originale').length !== 45 ||
  visualAssets.filter((a) => a.kind === 'animation_scenarisee').length !== 14
) {
  throw new Error('Expected 45 illustration and 14 animation slots.');
}

for (const [index, asset] of visualAssets.entries()) {
  const isAnimation = asset.kind === 'animation_scenarisee';
  const folder = isAnimation ? 'animations' : 'illustrations';
  const titleFr =
    asset.contentIds
      .map((id) => registry.contents.find((entry) => entry.id === id)?.localized.fr.title)
      .filter(Boolean)
      .join(' · ') || asset.assetId;
  const titleAr =
    asset.contentIds
      .map((id) => registry.contents.find((entry) => entry.id === id)?.localized.ar.title)
      .filter(Boolean)
      .join(' · ') || asset.assetId;

  const { colors, scene } = buildCustomArtwork(asset.assetId, index, isAnimation);
  const gradId = `sky-${asset.assetId.toLowerCase()}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 320" role="img" aria-labelledby="title desc"><title id="title">${safeText(asset.assetId)} — DEMO</title><desc id="desc">Visual technical fixture only. No people, silhouettes, animals, historical claim, geographic claim, or authenticated reconstruction. ${isAnimation ? 'Static fallback for a voluntary animation preview.' : 'Static illustration placeholder.'}</desc><defs><linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${colors[0]}"/><stop offset="100%" stop-color="${colors[1]}"/></linearGradient></defs><rect width="520" height="320" rx="24" fill="${colors[5]}"/><rect x="18" y="18" width="484" height="284" rx="18" fill="url(#${gradId})"/><rect x="26" y="26" width="468" height="268" rx="14" fill="none" stroke="${colors[4]}" stroke-width="1" opacity="0.35"/>${scene}<rect x="26" y="246" width="468" height="48" rx="10" fill="${colors[0]}" opacity="0.82"/><text x="42" y="52" fill="${colors[4]}" font-family="Arial, sans-serif" font-size="12" font-weight="bold" letter-spacing="1.8">${safeText(asset.assetId)}</text><text x="42" y="268" fill="${colors[5]}" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${safeText(titleFr).slice(0, 56)}</text><text x="42" y="285" fill="${colors[4]}" font-family="Arial, sans-serif" font-size="10.5">DEMO · NON VALIDÉ · ${isAnimation ? 'APERÇU D’ANIMATION VOLONTAIRE' : 'ÉVOCATION GRAPHIQUE ANICONIQUE'}</text></svg>`;

  const filename = `${asset.assetId}.svg`;
  const filePath = path.join(output, folder, filename);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, svg);
  const bytes = Buffer.from(svg);

  Object.assign(asset, {
    status: 'DEMO',
    url: `/media/demo/${folder}/${filename}`,
    hash: createHash('sha256').update(bytes).digest('hex'),
    size: bytes.length,
    mimeType: 'image/svg+xml',
    source: 'Illustration vectorielle thématique générée localement ; DEMO / NON VALIDE, conforme à l’aniconisme strict.',
    alt: {
      fr: `Illustration évocatrice DEMO pour ${titleFr} (${asset.assetId}), sans aucune représentation humaine ni animale.`,
      ar: `رسم توضيحي تجريبي للموضوع: ${titleAr} (${asset.assetId}) دون أي تجسيد لبشر أو ذوات أرواح.`,
    },
    caption: {
      fr: `Évocation graphique (${titleFr}) — DEMO / NON VALIDÉ, sans valeur de reconstitution historique.`,
      ar: `تصور بصري (${titleAr}) — نموذج تجريبي غير معتمد، لا يمثل إعادة بناء تاريخية موثقة.`,
    },
    revision: 'demo-visual-rich-v2',
  });
}

fs.writeFileSync(manifestPath, JSON.stringify(registry, null, 2) + '\n');
console.log(
  `Generated ${visualAssets.filter((a) => a.kind === 'illustration_originale').length} rich thematic illustrations and ${visualAssets.filter((a) => a.kind === 'animation_scenarisee').length} animation previews.`
);
