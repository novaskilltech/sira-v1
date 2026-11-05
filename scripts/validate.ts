import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { registrySchema, validateRegistry } from '../src/schema';
const publicRelease = process.argv.includes('--public');
const parsed = registrySchema.safeParse(JSON.parse(fs.readFileSync('public/content/manifest.v1.json','utf8')));
if(!parsed.success) { console.error(parsed.error); process.exit(1); }
const issues = validateRegistry(parsed.data, publicRelease);
if(publicRelease) for(const a of parsed.data.assets) {
 if(!a.url) continue;
 const file = path.resolve('public', '.' + a.url);
 if(!fs.existsSync(file)) { issues.push(`${a.assetId}: file missing`); continue; }
 const actual=fs.realpathSync(file);const root=fs.realpathSync('public')+path.sep;
 if(!actual.startsWith(root)){issues.push(`${a.assetId}: file outside public root`);continue;}
 const bytes=fs.readFileSync(file);
 if(createHash('sha256').update(bytes).digest('hex')!==a.hash || bytes.length!==a.size) issues.push(`${a.assetId}: hash/size mismatch`);
 if(a.kind==='glb_modele_3d'&&(bytes.length<12||bytes.toString('ascii',0,4)!=='glTF'||bytes.readUInt32LE(4)!==2||bytes.readUInt32LE(8)!==bytes.length))issues.push(`${a.assetId}: invalid GLB header`);
 if(a.url.endsWith('.svg')&&/<script|<foreignObject|\son\w+\s*=|(?:href|src)\s*=\s*["'](?!#)|url\s*\(/i.test(bytes.toString('utf8')))issues.push(`${a.assetId}: unsafe SVG`);
 if(a.kind==='audio') {
  let duration:number|undefined;
  if(a.url.endsWith('.wav')&&bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WAVE'){
   let byteRate=0,dataLength=0;for(let offset=12;offset+8<=bytes.length;){const tag=bytes.toString('ascii',offset,offset+4),length=bytes.readUInt32LE(offset+4);if(offset+8+length>bytes.length)break;if(tag==='fmt '&&length>=16)byteRate=bytes.readUInt32LE(offset+16);if(tag==='data')dataLength+=length;offset+=8+length+(length%2);}if(byteRate>0)duration=dataLength/byteRate;
  }else{
   const result=spawnSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',file],{encoding:'utf8',timeout:15000,windowsHide:true});
   if(result.status===0)duration=Number(result.stdout.trim());
  }
  if(!duration||duration<180||duration>300||Math.abs(duration-(a.durationSeconds??0))>.05)issues.push(`${a.assetId}: binary audio duration unverified/invalid (ffprobe required for compressed audio)`);
 }
}
fs.mkdirSync('reports',{recursive:true});
const report = { channel: publicRelease?'public':'demo', passed: issues.length===0, checkedAt: new Date().toISOString(), contents: parsed.data.contents.length, media: parsed.data.assets.length, objects: parsed.data.objects.length, issues };
fs.writeFileSync(`reports/validation-${report.channel}.json`,JSON.stringify(report,null,2));
console.log(`${report.channel}: ${report.contents} content, ${report.media} media slots, ${report.objects} objects. ${issues.length} blocking issue(s).`);
if(issues.length) { console.error(issues.slice(0,12).join('\n')); process.exitCode=1; }
