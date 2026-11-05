import { useState, type ImgHTMLAttributes } from 'react';
import { ImageOff } from 'lucide-react';
import { useApp } from '../context';
export function MediaImage(props:ImgHTMLAttributes<HTMLImageElement>){const {t}=useApp();const [failed,setFailed]=useState(false);const [attempt,setAttempt]=useState(0);return failed?<div className="image-error" role="status"><ImageOff size={28}/><p>{t('imageMissing')}</p><button className="button secondary" onClick={()=>{setAttempt(n=>n+1);setFailed(false);}}>{t('retry')}</button></div>:<img {...props} key={attempt} onError={()=>setFailed(true)}/>;}
