import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { chromium } from '@playwright/test';
const browser=await chromium.launch();const runs=[];
try{
 for(let i=0;i<5;i++){
  const context=await browser.newContext({viewport:{width:834,height:1194}});const page=await context.newPage();const session=await context.newCDPSession(page);
  await session.send('Network.enable');await session.send('Network.setCacheDisabled',{cacheDisabled:true});
  await session.send('Network.emulateNetworkConditions',{offline:false,latency:50,downloadThroughput:20*1024*1024/8,uploadThroughput:5*1024*1024/8});
  await page.addInitScript(()=>{window.__vitals={lcp:0,cls:0};new window.PerformanceObserver(list=>{for(const entry of list.getEntries())window.__vitals.lcp=entry.startTime;}).observe({type:'largest-contentful-paint',buffered:true});new window.PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput)window.__vitals.cls+=entry.value;}).observe({type:'layout-shift',buffered:true});});
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await page.locator('.hero-image img').waitFor();await page.evaluate(()=>document.fonts.ready);
  const vitals=await page.evaluate(()=>({...window.__vitals,resources:window.performance.getEntriesByType('resource').map(r=>({name:r.name,size:r.encodedBodySize}))}));runs.push(vitals);await context.close();
 }
}finally{await browser.close();}
const files=fs.readdirSync('dist/assets');const indexFile=files.find(file=>/^index-.*\.js$/.test(file));const mainBytes=fs.readFileSync(path.join('dist/assets',indexFile));
const result={profile:'Local Windows Chromium, 834x1194 CSS, cold HTTP cache, 20 Mbit/s and 50 ms RTT emulated. Not physical iPad/Android acceptance.',runs,medianLcpMs:runs.map(r=>r.lcp).sort((a,b)=>a-b)[2],maximumCls:Math.max(...runs.map(r=>r.cls)),initialJsGzipBytes:zlib.gzipSync(mainBytes).length,homeImageBytes:fs.statSync('public/media/demo/atlas-valley.webp').size,INP:'not measured: no field sample',physicalDeviceFps:'not measured'};
fs.writeFileSync('reports/performance.json',JSON.stringify(result,null,2));console.log(JSON.stringify({...result,runs:result.runs.map(r=>({lcp:r.lcp,cls:r.cls}))},null,2));
