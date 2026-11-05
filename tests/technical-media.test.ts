import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { registrySchema } from '../src/schema';

const demoDirectory = path.resolve('public/media/demo');
const objectIds = Array.from({ length: 20 }, (_, index) => `OBJ-${String(index + 1).padStart(3, '0')}`);

describe('technical DEMO media fixtures', () => {
  it('ships 20 readable GLB 2 fixtures with explicit non-public metadata', () => {
    for (const id of objectIds) {
      const bytes = readFileSync(path.join(demoDirectory, `${id}.glb`));
      expect(bytes.toString('ascii', 0, 4), id).toBe('glTF');
      expect(bytes.readUInt32LE(4), id).toBe(2);
      expect(bytes.readUInt32LE(8), id).toBe(bytes.length);
      expect(bytes.readUInt32LE(16), id).toBe(0x4e4f534a);
      const json = JSON.parse(bytes.toString('utf8', 20, 20 + bytes.readUInt32LE(12)).trim());
      expect(json.nodes.some((node: { extras?: { status?: string; historicalStatus?: string; publicationAllowed?: boolean } }) =>
        node.extras?.status === 'DEMO' && node.extras?.historicalStatus === 'NON_VALIDE' && node.extras?.publicationAllowed === false,
      ), id).toBe(true);
    }
  });

  it('ships one explicit DEMO SVG fallback per object', () => {
    for (const id of objectIds) {
      const svg = readFileSync(path.join(demoDirectory, `${id}.svg`), 'utf8');
      expect(svg, id).toContain('<svg');
      expect(svg, id).toContain('DEMO');
      expect(svg, id).toContain('NON VALID');
    }
  });

  it('provides all planned visual slots as labelled local DEMO fixtures', () => {
    const registry = registrySchema.parse(JSON.parse(readFileSync('public/content/manifest.v1.json', 'utf8')));
    const visuals = registry.assets.filter(asset => ['illustration_originale', 'animation_scenarisee'].includes(asset.kind));
    expect(visuals.filter(asset => asset.kind === 'illustration_originale')).toHaveLength(45);
    expect(visuals.filter(asset => asset.kind === 'animation_scenarisee')).toHaveLength(14);
    for (const asset of visuals) {
      expect(asset.status).toBe('DEMO');
      expect(asset.url).toMatch(/^\/media\/demo\/(illustrations|animations)\/.+\.svg$/);
      const file = readFileSync(path.resolve('public', asset.url!.slice(1)), 'utf8');
      expect(file).toContain('DEMO');
      expect(file).toContain('No people, silhouettes, animals');
    }
  });
});
