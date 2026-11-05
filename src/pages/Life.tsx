import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useApp } from '../context';
import { BackLink, EntryCard, PageHeading, entryRoute } from '../components/Shared';
import { ObjectArt } from '../components/Artwork';
export default function Life(){const {registry,prefs,t,ui,setUi}=useApp();const entries=registry.contents.filter(c=>c.space==='vie_quotidienne');const groups=[...new Set(entries.map(c=>c.group.fr))];const selected=typeof ui.theme==='string'?ui.theme:'';
 return <div className="page-wrap"><BackLink/><PageHeading eyebrow={t('lifeMeta')} title={t('life')} description={t('lifeIntro')}/><nav className="filter-bar" aria-label={t('themes')}><button className={!selected?'active':''} onClick={()=>setUi('theme','')}>{t('all')}</button>{groups.map(g=><button key={g} className={selected===g?'active':''} aria-pressed={selected===g} onClick={()=>setUi('theme',g)}>{entries.find(c=>c.group.fr===g)!.group[prefs.locale]}</button>)}</nav>
 <div className="theme-grid">{groups.filter(g=>!selected||g===selected).map(g=>{const groupEntries=entries.filter(c=>c.group.fr===g);return <section className="theme-card" key={g}><div className="theme-cover"><ObjectArt variant={groups.indexOf(g)}/><span className="eyebrow">0{groups.indexOf(g)+1}</span></div><div className="theme-body"><h2>{groupEntries[0].group[prefs.locale]}</h2>{groupEntries.map(entry=><Link to={entryRoute(entry)} key={entry.id}>{entry.localized[prefs.locale].title}<ArrowUpRight size={18}/></Link>)}</div></section>;})}</div>
 {selected&&<section className="entry-grid">{entries.filter(c=>c.group.fr===selected).map((entry,i)=><EntryCard entry={entry} index={i} key={entry.id}/>)}</section>}</div>;
}
