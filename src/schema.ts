import { z } from 'zod';
const localized = z.object({ fr: z.string().min(1), ar: z.string().min(1) });
const approval = z.object({ dimension: z.enum(['history','fr','ar','rights','geography','audio','pronunciation','visual']), targetRevision: z.string(), targetId: z.string().optional(), reviewerRole: z.string(), reviewerId: z.string().min(1), decision: z.enum(['APPROUVE','REFUSE']), timestamp: z.string(), evidenceLink: z.string().min(1) });
export const safeMediaUrl = (url: string) => /^\/media\/[a-zA-Z0-9/_-]+\.(glb|webp|png|svg|mp3|wav|ogg|m4a)$/.test(url);
const asset = z.object({
 assetId: z.string(), kind: z.enum(['audio','illustration_originale','animation_scenarisee','glb_modele_3d','image_fallback_3d']), contentIds: z.array(z.string()), locale: z.enum(['fr','ar']).nullable(),
 role: z.string(), source: z.string(), status: z.enum(['PLACEHOLDER','DEMO','PRODUIT_NON_VERIFIE','EN_REVUE','APPROUVE']),
 url: z.string().refine(safeMediaUrl).nullable(), hash: z.string().nullable(), size: z.number().nullable(), mimeType: z.string().nullable(),
 durationSeconds: z.number().nullable(), measuredDurationSeconds: z.number().nullable(), scriptVersion: z.string().nullable(),
 sectionCuePoints: z.array(z.object({ sectionId: z.string(), seconds: z.number().nonnegative() })),
 alt: localized, caption: localized, credit: z.string().nullable(), license: z.string().nullable(),
 referenceIds: z.array(z.string()), approvalRecords: z.array(approval), revision: z.string(), fallbackAssetId: z.string().nullable(),
});
const article = z.object({ title: z.string().min(1), intro: z.string().min(1), learningObjective: z.string().min(1), sections: z.array(z.object({ sectionId: z.string(), heading: z.string().min(1), body: z.string().min(1) })).min(4), audioScript: z.string(), revision: z.string() });
export const registrySchema = z.object({
 version: z.string(), channel: z.enum(['demo','public']), updatedAt: z.string(),
 contents: z.array(z.object({ id: z.string(), space: z.enum(['chronologie','hegire','vie_quotidienne']), kind: z.string(), group: localized, order: z.number(), localized: z.object({ fr: article, ar: article }), mediaRefs: z.array(z.string()), objectIds: z.array(z.string()), animationIds: z.array(z.string()), audioRefs: z.object({ fr: z.string(), ar: z.string() }), relations: z.array(z.string()), referenceIds: z.array(z.string()), approvalRecords: z.array(approval), status: z.enum(['DEMO','APPROUVE']), revision: z.string(), geography: z.object({ kind: z.enum(['not_mappable','general_marker','illustrative_corridor','area']), sourceIds: z.array(z.string()), uncertainty: localized }).nullable() })),
 objects: z.array(z.object({ id: z.string(), name: localized, theme: z.string(), mediaId: z.string(), fallbackId: z.string(), status: z.enum(['DEMO','APPROUVE']) })),
 assets: z.array(asset),
 references: z.array(z.object({ referenceId: z.string(), bibliographicCitation: z.string().min(1), locator: z.string().min(1), checkedAt: z.string().min(1), reviewerId: z.string().min(1) })),
 operator: z.object({ name: z.string(), contact: z.string(), host: z.string(), privacyReviewed: z.boolean() }),
});
export type Registry = z.infer<typeof registrySchema>;
export type ContentEntry = Registry['contents'][number];
export type MediaAsset = Registry['assets'][number];
export type Locale = 'fr' | 'ar';
export function validateRegistry(r: Registry, publicRelease = false): string[] {
 const issues: string[] = [];
 const check = (ok: unknown, message: string) => { if (!ok) issues.push(message); };
 const ids = new Set(r.contents.map(c=>c.id));
 const objects = new Set(r.objects.map(o=>o.id));
 const assets = new Map(r.assets.map(a=>[a.assetId,a]));
 const refs = new Set(r.references.map(ref=>ref.referenceId));
 check(r.contents.length === 60 && ids.size === 60, '60 unique content IDs required');
 const expected = [...Array.from({length:24},(_,i)=>`CHR-${String(i+1).padStart(2,'0')}`),...Array.from({length:6},(_,i)=>`HEG-ETP-${String(i+1).padStart(2,'0')}`),...Array.from({length:6},(_,i)=>`HEG-DOS-${String(i+7).padStart(2,'0')}`),...Array.from({length:24},(_,i)=>`VIE-${String(i+1).padStart(2,'0')}`)];
 for (const id of expected) check(ids.has(id), `Missing ${id}`);
 check(r.objects.length === 20 && objects.size === 20, '20 unique objects required');
 for(let i=1;i<=20;i++) check(objects.has(`OBJ-${String(i).padStart(3,'0')}`), `Missing object ${i}`);
 check(r.assets.length === 219 && assets.size === 219, '219 unique media slots required');
 for(const [kind,count] of Object.entries({audio:120,illustration_originale:45,animation_scenarisee:14,glb_modele_3d:20,image_fallback_3d:20})) check(r.assets.filter(a=>a.kind===kind).length===count,`Invalid media count ${kind}`);
 for (const [space,count] of Object.entries({chronologie:24,hegire:12,vie_quotidienne:24})) check(r.contents.filter(c=>c.space===space).length===count, `Invalid count ${space}`);
 const approved = (records: z.infer<typeof approval>[], revision: string, dimension: string, targetId:string) => {
  const matches=records.filter(a=>a.dimension===dimension&&a.targetRevision===revision&&a.targetId===targetId).sort((a,b)=>Date.parse(b.timestamp)-Date.parse(a.timestamp));
  const latest=matches[0];return latest?.decision==='APPROUVE'&&latest.reviewerRole.trim()&&latest.reviewerId.trim()&&latest.evidenceLink.trim()&&!Number.isNaN(Date.parse(latest.timestamp));
 };
 for (const c of r.contents) {
  for (const id of c.mediaRefs) check(assets.has(id), `${c.id}: broken asset ${id}`);
  for (const id of c.objectIds) check(objects.has(id), `${c.id}: broken object ${id}`);
  for (const id of c.relations) check(ids.has(id), `${c.id}: broken relation ${id}`);
  for (const id of c.referenceIds) check(refs.has(id), `${c.id}: broken reference ${id}`);
  if (c.kind==='dossier') check(c.geography?.kind==='not_mappable', `${c.id}: dossier must not have a pin`);
  for (const locale of ['fr','ar'] as const) {
   const a = assets.get(c.audioRefs[locale]);
   check(a?.kind==='audio' && a.locale===locale && a.contentIds.includes(c.id), `${c.id}: invalid ${locale} audio link`);
   if(publicRelease) { check(!!c.localized[locale].audioScript.trim(), `${c.id}: ${locale} script absent`); check(a?.scriptVersion===c.localized[locale].revision, `${c.id}: ${locale} audio/script revision mismatch`); }
  }
  if(publicRelease) {
   check(c.status==='APPROUVE', `${c.id}: DEMO content forbidden`);
   check(c.referenceIds.length>0, `${c.id}: historical references absent`);
   for(const dim of ['history','fr','ar','rights',...(c.space==='hegire'?['geography']:[])]) {
    const revision=dim==='fr'||dim==='ar'?c.localized[dim].revision:c.revision;
    check(approved(c.approvalRecords,revision,dim,c.id), `${c.id}: ${dim} approval absent/stale`);
   }
   if(c.geography && c.geography.kind!=='not_mappable') check(c.geography.sourceIds.length>0 && c.geography.sourceIds.every(id=>refs.has(id)), `${c.id}: cartographic sources absent`);
  }
 }
 for(const o of r.objects) { check(assets.has(o.mediaId) && assets.has(o.fallbackId), `${o.id}: model/fallback absent`);check(assets.get(o.mediaId)?.kind==='glb_modele_3d'&&assets.get(o.fallbackId)?.kind==='image_fallback_3d',`${o.id}: model/fallback kind mismatch`); if(publicRelease) check(o.status==='APPROUVE',`${o.id}: object not approved`); }
 for(const a of r.assets) {
  for(const id of a.contentIds) check(ids.has(id), `${a.assetId}: broken content ${id}`);
  if(a.fallbackAssetId) check(assets.has(a.fallbackAssetId),`${a.assetId}: broken fallback`);
  if(publicRelease) {
   check(a.status==='APPROUVE',`${a.assetId}: unapproved asset`);
   check(!a.url?.startsWith('/media/demo/'),`${a.assetId}: demo file forbidden`);
   check(a.url && a.hash?.match(/^[a-f0-9]{64}$/) && (a.size??0)>0 && a.mimeType, `${a.assetId}: file metadata absent`);
   check(a.license?.trim() && a.credit?.trim(),`${a.assetId}: rights absent`);
   check(a.referenceIds.length>0 && a.referenceIds.every(id=>refs.has(id)),`${a.assetId}: sources absent`);
   for(const dim of ['history','rights',...(a.kind==='audio'?['audio','pronunciation']:['visual'])]) check(approved(a.approvalRecords,a.revision,dim,a.assetId),`${a.assetId}: ${dim} approval absent/stale`);
   if(a.url) { const ext=a.url.split('.').pop()!;const mime:Record<string,string>={glb:'model/gltf-binary',webp:'image/webp',png:'image/png',svg:'image/svg+xml',mp3:'audio/mpeg',wav:'audio/wav',ogg:'audio/ogg',m4a:'audio/mp4'};check(a.mimeType===mime[ext],`${a.assetId}: MIME mismatch`);check(a.kind==='audio'?['mp3','wav','ogg','m4a'].includes(ext):a.kind==='glb_modele_3d'?ext==='glb':['webp','png','svg'].includes(ext),`${a.assetId}: incompatible file kind`); }
   if(a.kind==='audio') check(a.durationSeconds!==null && a.durationSeconds>=180 && a.durationSeconds<=300 && a.measuredDurationSeconds===a.durationSeconds,`${a.assetId}: invalid measured duration`);
  }
 }
 if(publicRelease) { check(r.channel==='public','Manifest channel must be public'); check(r.operator.name.trim() && r.operator.contact.trim() && r.operator.host.trim() && r.operator.privacyReviewed,'Operator/legal details missing'); }
 return issues;
}
