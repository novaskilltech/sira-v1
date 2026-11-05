/** Technical fixtures only. No historical reconstruction, voice or final media. */
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import * as THREE from 'three'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const output = path.join(root, 'public/media/demo')
await mkdir(output, { recursive: true })

// GLTFExporter uses browser FileReader for its final binary Blob.
if (!globalThis.FileReader) {
  globalThis.FileReader = class {
    result = null
    onloadend = null
    onerror = null
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buffer) => {
        this.result = buffer
        this.onloadend?.({ target: this })
      }).catch((error) => this.onerror?.(error))
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then((buffer) => {
        this.result = `data:${blob.type};base64,${Buffer.from(buffer).toString('base64')}`
        this.onloadend?.({ target: this })
      }).catch((error) => this.onerror?.(error))
    }
  }
}

const terracotta = new THREE.MeshStandardMaterial({ color: '#ae7250', roughness: 0.84, metalness: 0 })
const wood = new THREE.MeshStandardMaterial({ color: '#866242', roughness: 0.9, metalness: 0 })
const brass = new THREE.MeshStandardMaterial({ color: '#b49b65', roughness: 0.55, metalness: 0.3 })
const dark = new THREE.MeshStandardMaterial({ color: '#423c30', roughness: 0.9 })
function add(group, geometry, material, position = [0, 0, 0], rotation = [0, 0, 0]) {
  geometry.normalizeNormals()
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(...position)
  mesh.rotation.set(...rotation)
  group.add(mesh)
  return mesh
}
function lathe(points) {
  return new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), 48)
}
function lamp() {
  const group = new THREE.Group()
  add(group, lathe([[0, 0], [.45, 0], [.64, .12], [.72, .3], [.64, .44], [.25, .5], [.17, .46], [.17, .37], [0, .37]]), terracotta)
  const spout = add(group, new THREE.ConeGeometry(.2, .75, 24), terracotta, [.76, .26, 0], [0, 0, -Math.PI / 2])
  spout.scale.z = .66
  add(group, new THREE.TorusGeometry(.26, .07, 12, 32), terracotta, [-.72, .37, 0])
  add(group, new THREE.CylinderGeometry(.13, .13, .025, 24), dark, [0, .405, 0])
  return group
}
function chest() {
  const group = new THREE.Group()
  add(group, new THREE.BoxGeometry(1.8, .94, 1.05), wood, [0, .47, 0])
  add(group, new THREE.BoxGeometry(1.9, .18, 1.13), wood, [0, 1.02, 0])
  for (const x of [-.62, .62]) {
    add(group, new THREE.BoxGeometry(.1, .98, 1.08), brass, [x, .48, 0])
    add(group, new THREE.BoxGeometry(.1, .2, 1.16), brass, [x, 1.02, 0])
  }
  add(group, new THREE.BoxGeometry(.2, .28, .06), brass, [0, .87, .56])
  add(group, new THREE.BoxGeometry(.04, .08, .02), dark, [0, .85, .6])
  return group
}
function jar() {
  const group = new THREE.Group()
  add(group, lathe([[0, 0], [.32, 0], [.48, .12], [.64, .5], [.68, .9], [.53, 1.3], [.28, 1.5], [.28, 1.72], [.34, 1.75], [.34, 1.82], [.23, 1.82], [.23, 1.5], [.47, 1.27], [.59, .9], [.56, .5], [.25, .12], [0, .12]]), terracotta)
  for (const direction of [-1, 1]) {
    const handle = add(group, new THREE.TorusGeometry(.25, .055, 12, 32), terracotta, [direction * .5, 1.35, 0])
    handle.scale.y = 1.28
  }
  return group
}

for (const [id, create] of [['OBJ-001', lamp], ['OBJ-002', chest], ['OBJ-007', jar]]) {
  const group = create()
  group.name = `${id} — DEMO NON_VALIDE`
  group.userData = {
    status: 'DEMO', historicalStatus: 'NON_VALIDE',
    source: 'Procedural geometric technical fixture; not an authenticated reconstruction.',
    generator: 'scripts/demo-media.mjs', publicationAllowed: false,
  }
  group.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(group)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  const scale = 2 / Math.max(size.x, size.y, size.z)
  for (const child of group.children) child.position.sub(center)
  group.scale.setScalar(scale)
  group.updateMatrixWorld(true)
  const glb = await new GLTFExporter().parseAsync(group, { binary: true, onlyVisible: true })
  const buffer = Buffer.from(glb)
  if (buffer.toString('ascii', 0, 4) !== 'glTF' || buffer.readUInt32LE(4) !== 2 || buffer.readUInt32LE(8) !== buffer.length) {
    throw new Error(`Invalid GLB header: ${id}`)
  }
  const normalized = new THREE.Box3().setFromObject(group)
  const normalizedCenter = normalized.getCenter(new THREE.Vector3())
  if (normalizedCenter.length() > 1e-6) throw new Error(`Uncentered fixture: ${id}`)
  await writeFile(path.join(output, `${id}.glb`), buffer)
  console.log(`${id}.glb: ${buffer.length} bytes; GLB 2; centered; max extent 2`)
}

const icons = [
  '<path d="M105 160 Q110 211 180 211 Q223 210 241 169 L294 147 L271 183 L234 193 M108 166 Q80 137 83 167 Q84 191 115 189"/><ellipse cx="173" cy="160" rx="68" ry="19"/><ellipse cx="173" cy="155" rx="16" ry="6"/>',
  '<path d="M91 142 L264 142 L277 157 L277 229 L91 229 Z M91 162 H277 M121 143 V228 M245 143 V228"/><rect x="175" y="153" width="19" height="28" rx="2"/>',
  '<rect x="119" y="117" width="19" height="117" rx="4"/><rect x="243" y="117" width="19" height="117" rx="4"/><rect x="105" y="166" width="169" height="20" rx="5"/><circle cx="128" cy="135" r="3"/><circle cx="253" cy="135" r="3"/>',
  '<ellipse cx="190" cy="194" rx="93" ry="30"/><path d="M97 194 V219 Q190 259 283 219 V194"/><ellipse cx="190" cy="188" rx="68" ry="22"/><path d="M190 185 V133 M239 177 V123"/><ellipse cx="190" cy="188" rx="9" ry="3"/>',
  '<path d="M113 157 Q118 237 190 237 Q262 237 267 157 M113 168 Q82 147 88 179 Q90 201 123 194 M264 168 Q295 147 292 179 Q290 201 257 194"/><ellipse cx="190" cy="157" rx="77" ry="20"/>',
  '<path d="M169 112 H207 L202 137 Q251 160 250 201 Q247 242 192 245 Q135 242 132 201 Q133 164 174 138 Z M170 122 H206 M163 151 Q184 165 214 150"/>',
  '<path d="M163 111 H217 V139 Q272 169 249 225 Q240 249 190 249 Q139 249 131 225 Q109 168 164 139 Z M163 125 H217 M144 160 Q104 136 112 175 Q114 193 132 200 M237 160 Q279 136 269 175 Q266 193 248 200"/>',
  '<path d="M137 142 Q177 119 226 139 L255 210 Q233 244 159 230 L126 173 Z M143 150 L213 210 M226 150 L165 211 M153 220 Q207 235 242 214"/>',
  '<path d="M191 105 V251 M171 178 L211 178 L219 194 L164 194 Z"/><ellipse cx="191" cy="185" rx="37" ry="13"/><path d="M185 107 L191 94 L197 107"/>',
  '<path d="M110 147 Q190 121 270 147 V171 H110 Z M116 171 V221 M130 171 V222 M144 171 V223 M158 171 V224 M172 171 V225 M186 171 V226 M200 171 V225 M214 171 V224 M228 171 V223 M242 171 V222 M256 171 V221 M269 171 V220"/>',
  '<path d="M140 117 L224 225 Q239 241 250 228 Q258 218 244 206 L151 107 Z M148 128 L164 115 M219 220 L238 205"/>',
  '<path d="M91 177 Q190 104 288 177 Q190 250 91 177 Z"/><ellipse cx="190" cy="177" rx="49" ry="17"/><path d="M170 161 V193 M180 160 V194 M190 160 V194 M200 160 V194 M210 162 V192"/>',
  '<path d="M161 111 Q180 104 188 121 L201 160 L178 171 L157 131 Q149 115 161 111 Z M189 166 L240 242"/>',
  '<path d="M190 110 V239 M143 239 H237 M111 144 H269 M121 146 L100 194 M121 146 L144 194 M259 146 L236 194 M259 146 L282 194 M97 194 Q121 223 147 194 Z M232 194 Q259 223 286 194 Z"/>',
  '<path d="M143 160 H237 L253 235 H127 Z"/><path d="M173 158 V143 Q190 120 207 143 V158"/><ellipse cx="190" cy="199" rx="18" ry="13"/>',
  '<path d="M126 158 Q190 137 254 158 L267 234 Q190 254 113 234 Z M160 153 V132 Q190 107 220 132 V153 M126 167 Q190 185 254 167 M151 178 V235 M229 178 V235"/>',
  '<path d="M104 210 L129 133 L161 151 L219 151 L250 133 L275 210 L239 219 L218 180 L162 180 L139 219 Z M127 143 L151 208 M250 143 L229 208"/>',
  '<path d="M118 143 H260 V231 H118 Z M118 169 H260 M141 143 V231 M237 143 V231"/><rect x="180" y="160" width="19" height="24" rx="2"/><path d="M163 140 V129 H213 V140"/>',
  '<path d="M156 141 H225 L239 225 Q190 245 140 225 Z"/><ellipse cx="190" cy="141" rx="35" ry="11"/><ellipse cx="190" cy="141" rx="19" ry="5"/><path d="M232 120 L269 90"/>',
  '<rect x="119" y="107" width="143" height="144" rx="15"/><path d="M133 123 H248 V233 H133 Z M153 150 H227 M153 169 H219 M153 188 H227 M153 207 H208"/>',
]
const names = ['Lampe', 'Coffre', 'Loquet de porte', 'Meule manuelle', 'Récipient de cuisson', 'Outre', 'Jarre', 'Sandale', 'Fuseau', 'Peigne', 'Outil de poterie', 'Navette de tissage', 'Alêne', 'Balance', 'Poids de mesure', 'Sac de voyage', 'Selle de bât sans animal', 'Coffret de transport', 'Encrier', "Tablette d’écriture"]
for (let index = 0; index < names.length; index++) {
  const id = `OBJ-${String(index + 1).padStart(3, '0')}`
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 320" role="img" aria-labelledby="title description"><title id="title">${id} — ${names[index]} — DEMO</title><desc id="description">Pictogramme géométrique de test, non validé et sans valeur de reconstitution historique. نموذج تجريبي غير معتمد</desc><rect width="380" height="320" rx="16" fill="#e8dec8"/><circle cx="190" cy="170" r="112" fill="#dfd2b7"/><g fill="#c7ab7e" stroke="#665942" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round">${icons[index]}</g><text x="24" y="32" fill="#665942" font-family="sans-serif" font-size="11" letter-spacing="2">${id}</text><text x="190" y="282" text-anchor="middle" fill="#514b3c" font-family="sans-serif" font-size="12">DEMO · NON VALIDÉ</text><text x="190" y="302" text-anchor="middle" fill="#665942" font-family="sans-serif" font-size="12" lang="ar" direction="rtl">نموذج غير معتمد</text></svg>`
  await writeFile(path.join(output, `${id}.svg`), svg)
}
console.log('20 fallback SVG files: explicit DEMO / NON VALIDÉ labels')

// Quiet, short synthetic pulses separated by silence. This is not narration.
function signalWav(frequency) {
  const sampleRate = 22050
  const duration = 8
  const samples = sampleRate * duration
  const buffer = Buffer.alloc(44 + samples * 2)
  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(buffer.length - 8, 4)
  buffer.write('WAVEfmt ', 8)
  buffer.writeUInt32LE(16, 16)
  buffer.writeUInt16LE(1, 20)
  buffer.writeUInt16LE(1, 22)
  buffer.writeUInt32LE(sampleRate, 24)
  buffer.writeUInt32LE(sampleRate * 2, 28)
  buffer.writeUInt16LE(2, 32)
  buffer.writeUInt16LE(16, 34)
  buffer.write('data', 36)
  buffer.writeUInt32LE(samples * 2, 40)
  for (let index = 0; index < samples; index++) {
    const t = index / sampleRate
    const phase = t % 2
    const envelope = phase < .35 ? Math.sin(Math.PI * phase / .35) ** 2 : 0
    const sample = .075 * envelope * Math.sin(2 * Math.PI * frequency * t)
    buffer.writeInt16LE(Math.round(sample * 32767), 44 + index * 2)
  }
  return buffer
}
for (const [locale, frequency] of [['fr', 440], ['ar', 554.37]]) {
  const wav = signalWav(frequency)
  await writeFile(path.join(output, `signal-${locale}.wav`), wav)
  console.log(`signal-${locale}.wav: ${wav.length} bytes; PCM mono 22050 Hz; 8 seconds; no voice`)
}

// An optional local input keeps this script portable; no external URL is fetched.
const inputImage = process.env.SIRA_DEMO_IMAGE
if (inputImage) {
  const { default: sharp } = await import('sharp')
  await sharp(inputImage).resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(output, 'atlas-valley.webp'))
  const size = (await stat(path.join(output, 'atlas-valley.webp'))).size
  if (size > 1_500_000) throw new Error('Demo image exceeds the 1.5 MB budget')
  console.log(`atlas-valley.webp: ${size} bytes; DEMO decorative illustration`)
} else {
  console.log('atlas-valley.webp: existing asset preserved (set SIRA_DEMO_IMAGE for local conversion)')
}

// Read the generated files, not only the export return values.
for (const id of ['OBJ-001', 'OBJ-002', 'OBJ-007']) {
  const bytes = await readFile(path.join(output, `${id}.glb`))
  if (bytes.readUInt32LE(0) !== 0x46546c67 || bytes.readUInt32LE(4) !== 2 || bytes.length !== bytes.readUInt32LE(8)) throw new Error(`${id}: header check failed`)
  const document = JSON.parse(bytes.toString('utf8', 20, 20 + bytes.readUInt32LE(12)).trim())
  if (!document.nodes.some((node) => node.extras?.status === 'DEMO')) throw new Error(`${id}: DEMO metadata missing`)
}
