import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

export default defineConfig(({mode,command})=>({
 publicDir: mode==='demo'||command==='serve'?'public':false,
 plugins: [react(),{
  name:'sira-public-release-gate',
  buildStart(){if(command==='build'&&mode!=='demo')execFileSync(process.execPath,['--import','tsx','scripts/validate.ts','--public'],{stdio:'inherit',windowsHide:true});},
  generateBundle(){if(mode==='demo')return;const manifest=JSON.parse(fs.readFileSync('public/content/manifest.v1.json','utf8'));const paths=new Set<string>(['content/manifest.v1.json','favicon.svg','_headers','health.json',...manifest.assets.map((asset:{url:string})=>asset.url.slice(1))]);for(const fileName of paths)this.emitFile({type:'asset',fileName,source:fs.readFileSync(`public/${fileName}`)});},
 }],
 server: { port: 5173, strictPort: true },
 build: { target: ['safari17', 'chrome120'], chunkSizeWarningLimit: 650 },
 test: { environment: 'jsdom', pool:'threads', maxWorkers:1, setupFiles: ['./tests/setup.ts'], include: ['tests/**/*.test.{ts,tsx}'] },
}));
