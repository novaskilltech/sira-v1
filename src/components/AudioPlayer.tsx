import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Headphones, Play, Pause, RotateCcw } from 'lucide-react';
import { narration } from '../audio';
import { useApp } from '../context';
import type { ContentEntry } from '../schema';
const format=(n:number)=>`${Math.floor(n/60)}:${String(Math.floor(n%60)).padStart(2,'0')}`;
export function AudioPlayer({entry}:{entry:ContentEntry}) {
 const {registry,prefs,updatePrefs,t}=useApp();
 const controller=narration();
 const state=useSyncExternalStore(controller.subscribe,controller.getSnapshot);
 const [test,setTest]=useState(false);
 const asset=registry.assets.find(a=>a.assetId===entry.audioRefs[prefs.locale]);
 const url=asset?.url || (test?`/media/demo/signal-${prefs.locale}.wav`:null);
 const key=`${entry.id}:${prefs.locale}${test?':test':''}`;
 const positions=useRef(prefs.audioPositionsByContentLocale);positions.current=prefs.audioPositionsByContentLocale;
 useEffect(()=>{controller.onPosition=(id,time)=>updatePrefs(previous=>({audioPositionsByContentLocale:{...previous.audioPositionsByContentLocale,[id]:time}}));return()=>{controller.onPosition=()=>{};};},[controller,updatePrefs]);
 useEffect(()=>{if(url)controller.select(key,url,positions.current[key]??0);return()=>controller.pause();},[controller,key,url]);
 const own=state.key===key;
 const playing=own&&state.state==='playing';
 return <section className="audio-player" aria-label={t('audio')}>
  <div className="audio-heading"><Headphones size={22}/><strong>{t('audio')}</strong><span className="locale-badge">{prefs.locale.toUpperCase()}</span></div>
  {!asset?.url&&<p>{t('audioMissing')}</p>}
  {!url?<button className="button secondary" onClick={()=>setTest(true)}><Play size={18}/>{t('audioTest')}</button>:<>
   <div className="audio-controls"><button className="button round" aria-label={playing?t('pause'):t('listen')} onClick={()=>playing?controller.pause():void controller.play()}>{playing?<Pause/>:<Play/>}</button>
   <input type="range" min="0" max={own?state.duration||8:8} step="0.1" value={own?state.time:0} aria-label={t('seek')} onChange={e=>controller.seek(Number(e.target.value))}/>
   <span className="audio-time" dir="ltr">{format(own?state.time:0)} / {format(own?state.duration:0)}</span></div>
   {own&&state.state==='loading'&&<p role="status">{t('loading')}</p>}
   {own&&state.state==='error'&&<div role="alert"><p>{t('audioError')}</p><button onClick={()=>void controller.play()} className="button secondary"><RotateCcw size={16}/>{t('retry')}</button></div>}
  </>}
  {asset?.url&&<p className="small-note">{prefs.locale==='fr'?'Voix de synthèse : écoutez et signalez toute prononciation à corriger.':'صوت مُولَّد بالذكاء الاصطناعي: يرجى الإبلاغ عن أي نطق يحتاج إلى تصحيح.'}</p>}
  {test&&<p className="small-note">{t('audioTestNote')}</p>}
 </section>;
}
