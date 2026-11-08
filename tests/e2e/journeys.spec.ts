import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
const registry=JSON.parse(fs.readFileSync('public/content/manifest.v1.json','utf8'));
test('three spaces, filters, direct links and local resume',async({page})=>{
 await page.goto('/');await expect(page.locator('.feature-card')).toHaveCount(3);
 await page.locator('.feature-chronology').click();await expect(page.locator('.entry-card')).toHaveCount(24);
 await page.getByRole('button',{name:'02 Débuts de la Révélation'}).click();await expect(page.locator('.entry-card')).toHaveCount(4);
 await page.locator('.entry-card').first().click();await expect(page.locator('.chronology-preview')).toContainText('Premières révélations');await page.locator('.chronology-preview a').click();await expect(page.locator('h1')).toHaveText('Premières révélations');
 await page.getByRole('link',{name:'Retour',exact:true}).click();await expect(page.locator('.entry-card')).toHaveCount(4);
 await page.goto('/');await expect(page.locator('.resume-panel')).toContainText('Premières révélations');
 await page.locator('.feature-life').click();await expect(page.locator('.theme-card')).toHaveCount(8);await expect(page.locator('.theme-body a')).toHaveCount(24);
 await page.goto('/vie/VIE-01');await expect(page.locator('h1')).toHaveText('Espaces domestiques');await expect(page.locator('.object-viewer')).toHaveCount(3);
 await page.goto('/chronologie/INVALID');await expect(page.locator('h1')).toHaveText('Cette fiche n’est pas disponible.');
});
test('map markers and list agree; no dossier pins, pause and restore',async({page})=>{
 await page.goto('/hegire');await expect(page.locator('.map-marker')).toHaveCount(4);await expect(page.locator('.step-list li')).toHaveCount(6);await expect(page.locator('.dossier-grid a')).toHaveCount(6);
 await expect(page.getByTestId('route-progress')).toHaveAttribute('stroke-dashoffset','100');
 await page.locator('[data-id="HEG-ETP-01"]').click();await expect(page.locator('.selected-preview')).toContainText('La Mecque');
 await page.locator('.step-list button').nth(2).click();await expect(page.locator('[data-id="HEG-ETP-03"]')).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Agrandir',exact:true}).click();await expect(page.getByTestId('map-transform')).toHaveAttribute('transform',/scale\(1.25\)/);
 await page.getByRole('button',{name:'Voir le parcours',exact:true}).click();await expect.poll(()=>page.getByTestId('route-progress').getAttribute('stroke-dashoffset')).not.toBe('100');
 await page.getByRole('button',{name:'Pause',exact:true}).click();const stopped=await page.getByTestId('route-progress').getAttribute('stroke-dashoffset');
 await page.locator('.selected-preview a').click();await expect(page.locator('h1')).toHaveText('La grotte de Thawr');
 await page.getByRole('link',{name:'Retour',exact:true}).click();await expect(page.getByTestId('map-transform')).toHaveAttribute('transform',/scale\(1.25\)/);await expect(page.getByTestId('route-progress')).toHaveAttribute('stroke-dashoffset',stopped!);
 await page.getByRole('button',{name:'عربي',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('dir','rtl');await expect(page.getByTestId('map-transform')).toHaveAttribute('transform',/scale\(1.25\)/);
 await page.setViewportSize({width:1194,height:834});await expect(page.locator('[data-id="HEG-ETP-03"]')).toHaveAttribute('aria-pressed','true');
});
test('reduced motion yields a static complete route',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/hegire');await page.getByRole('button',{name:'Voir le parcours',exact:true}).click();await expect(page.getByTestId('route-progress')).toHaveAttribute('stroke-dashoffset','0');await expect(page.getByText('Parcours statique : mouvements réduits')).toBeVisible();
});
test('audio is opt-in, paused on language/navigation, positions are independent',async({page})=>{
 await page.addInitScript(()=>{const Original=window.Audio;const audios:HTMLAudioElement[]=[];Object.defineProperty(window,'__testAudios',{value:audios});window.Audio=function(src?:string){const audio=new Original(src);audios.push(audio);return audio;} as unknown as typeof Audio;});
 await page.goto('/chronologie/CHR-01');await expect(page.getByRole('button',{name:/Écouter la narration/})).toBeVisible();await expect(page.getByRole('button',{name:'Tester le son (8 s)'})).toHaveCount(0);
 expect(await page.evaluate(()=>(window as unknown as {__testAudios:HTMLAudioElement[]}).__testAudios.every(a=>a.paused))).toBe(true);
 await page.getByRole('button',{name:/Écouter la narration/}).click();await page.getByRole('button',{name:'Écouter',exact:true}).click();
 await expect(page.locator('.immersive-contemplation-overlay')).toBeVisible();
 await page.locator('.immersive-contemplation-overlay').click();
 await expect(page.locator('.immersive-contemplation-overlay')).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Pause',exact:true})).toBeVisible();
 await page.getByRole('slider',{name:'Position de lecture'}).fill('3');await page.getByRole('button',{name:'عربي',exact:true}).click();
 await expect(page.getByRole('button',{name:'استمع',exact:true})).toBeVisible();
 expect(await page.evaluate(()=>(window as unknown as {__testAudios:HTMLAudioElement[]}).__testAudios.every(a=>a.paused))).toBe(true);
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('sira.preferences.v1')!));expect(stored.audioPositionsByContentLocale['CHR-01:fr:pilot']).toBeGreaterThanOrEqual(3);
 await page.getByRole('button',{name:'FR',exact:true}).click();await expect(page.getByRole('slider')).toHaveValue(/3|4/);
 await page.getByRole('link',{name:'Retour',exact:true}).click();expect(await page.evaluate(()=>(window as unknown as {__testAudios:HTMLAudioElement[]}).__testAudios.every(a=>a.paused))).toBe(true);
});
test('GLB loads only on demand and recovers from a failed asset',async({page})=>{
 const loaded:string[]=[];page.on('request',request=>{if(request.url().endsWith('.glb'))loaded.push(request.url());});
 await page.goto('/vie/VIE-01');await expect(page.locator('.object-viewer')).toHaveCount(3);expect(loaded).toHaveLength(0);
 await page.locator('.object-viewer').first().getByRole('button',{name:'Explorer en 3D'}).click();await expect(page.locator('canvas')).toBeVisible();await expect.poll(()=>loaded.length).toBe(1);
 await page.locator('.object-viewer').first().getByRole('button',{name:'Agrandir',exact:true}).click();await page.locator('.object-viewer').first().getByRole('button',{name:'Tourner à droite'}).click();await page.locator('.object-viewer').first().getByRole('button',{name:'Réinitialiser'}).click();await page.locator('.object-viewer').first().screenshot({path:'reports/screenshots/demo-3d.png'});
 await page.locator('.object-viewer').first().getByRole('button',{name:'Fermer la vue 3D'}).click();await expect(page.locator('canvas')).toHaveCount(0);
 await page.route('**/OBJ-002.glb',route=>route.abort());await page.locator('.object-viewer').nth(1).getByRole('button',{name:'Explorer en 3D'}).click();await expect(page.locator('.object-viewer').nth(1).getByRole('alert')).toBeVisible();await expect(page.locator('.object-viewer').nth(1).locator('img')).toBeVisible();
});
test('manifest and audio failures keep a recoverable screen',async({page})=>{
 await page.route('**/manifest.v1.json',route=>route.abort());await page.goto('/');await expect(page.getByRole('heading',{name:'L’atlas n’a pas pu être chargé.'})).toBeVisible();
 await page.unroute('**/manifest.v1.json');await page.getByRole('button',{name:'Réessayer'}).click();await expect(page.locator('.feature-card')).toHaveCount(3);
 await page.route('**/narration-heg-etp-03-fr.mp3',route=>route.abort());await page.goto('/hegire/HEG-ETP-03');await page.getByRole('button',{name:/Écouter la narration/}).click();await page.getByRole('button',{name:'Écouter',exact:true}).click();await expect(page.getByRole('alert')).toContainText('Lecture impossible');await expect(page.locator('.article-section')).toHaveCount(4);
});
test('offline retains article; corrupt storage recovers; no third-party requests',async({page,context})=>{
 const external:string[]=[];page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4173')&&!r.url().startsWith('data:'))external.push(r.url());});
 await page.addInitScript(()=>localStorage.setItem('sira.preferences.v1','not-json'));await page.goto('/hegire/HEG-ETP-03');await expect(page.locator('h1')).toHaveText('La grotte de Thawr');
 await context.setOffline(true);await expect(page.getByRole('status')).toContainText('Connexion interrompue');await expect(page.locator('.article-section')).toHaveCount(4);await context.setOffline(false);expect(external).toEqual([]);
});
test('image failures retain the article and 48px controls remain usable',async({page})=>{
 await page.route(/.*(atlas-valley|illustration-.*)\.webp$/,route=>route.abort());await page.goto('/hegire/HEG-ETP-03');await expect(page.locator('.image-error').first()).toBeVisible();await expect(page.locator('.article-section')).toHaveCount(4);
 await page.goto('/hegire');await page.setViewportSize({width:320,height:740});
 const undersized=await page.locator('button:visible').evaluateAll(buttons=>buttons.map(button=>({name:button.getAttribute('aria-label')||button.textContent,rect:button.getBoundingClientRect()})).filter(item=>item.rect.width<47.9||item.rect.height<47.9).map(item=>({name:item.name,width:item.rect.width,height:item.rect.height})));
 expect(undersized).toEqual([]);
});
test('article media is clean and documentary player opens properly',async({page})=>{
 await page.goto('/chronologie/CHR-05');
 await expect(page.locator('.article-image img')).toBeVisible();
 await expect(page.locator('.animation-preview')).toHaveCount(0);
 await page.goto('/documentaire');
 await expect(page.locator('.documentary-player')).toBeVisible();
});
test('all 60 records open in French and Arabic',async({page})=>{
 test.setTimeout(180000);
 for(const locale of ['fr','ar'] as const){await page.goto('/');await page.getByRole('button',{name:locale==='fr'?'FR':'عربي',exact:true}).click();for(const entry of registry.contents){await page.goto(`/${entry.space==='vie_quotidienne'?'vie':entry.space}/${entry.id}`);await expect(page.locator('h1')).toHaveText(entry.localized[locale].title);await expect(page.locator('.article-section')).toHaveCount(4);}}
});
for(const [width,height] of [[834,1194],[1194,834],[390,844],[844,390],[320,740]]){
 test(`responsive ${width}x${height} FR/AR and screenshots`,async({page})=>{
  test.setTimeout(120000);await page.setViewportSize({width,height});
  for(const locale of ['fr','ar']){for(const route of ['/','/hegire','/hegire/HEG-ETP-03','/vie']){await page.goto(route);await page.getByRole('button',{name:locale==='fr'?'FR':'عربي',exact:true}).click();await expect(page.locator('h1')).toBeVisible();await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);if(route==='/'||route==='/hegire')await page.screenshot({path:`reports/screenshots/${locale}-${width}-${route==='/'?'home':'map'}.png`,fullPage:true});}}
 });
}
test('automated accessibility on central pages in both languages',async({page})=>{
 test.setTimeout(180000);const reports=[];
 for(const locale of ['fr','ar'])for(const route of ['/','/chronologie','/hegire','/vie','/vie/VIE-01','/aide']){
  await page.goto(route);await page.getByRole('button',{name:locale==='fr'?'FR':'عربي',exact:true}).click();const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();reports.push({route,locale,violations:result.violations});
 }
 fs.writeFileSync('reports/accessibility.json',JSON.stringify(reports,null,2));expect(reports.flatMap(r=>r.violations.map(v=>({route:r.route,locale:r.locale,id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})))).toEqual([]);
});
