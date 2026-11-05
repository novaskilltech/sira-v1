type Snapshot = { key:string; state:'idle'|'loading'|'playing'|'paused'|'error'; time:number; duration:number };
export class NarrationController {
 readonly element: HTMLAudioElement;
 private listeners = new Set<()=>void>();
 private positions:Record<string,number>={};
 private snapshot:Snapshot={key:'',state:'idle',time:0,duration:0};
 private token=0;
 onPosition:(key:string,time:number)=>void=()=>{};
 constructor(element:HTMLAudioElement){
  this.element=element; element.preload='none';
  element.addEventListener('timeupdate',()=>{this.set({time:element.currentTime});this.remember();});
  element.addEventListener('loadedmetadata',()=>{const time=this.positions[this.snapshot.key]??0;element.currentTime=Math.min(time,Number.isFinite(element.duration)?element.duration:0);this.set({duration:Number.isFinite(element.duration)?element.duration:0,time:element.currentTime});});
  element.addEventListener('error',()=>this.set({state:'error'}));
  element.addEventListener('ended',()=>{this.element.currentTime=0;this.set({state:'paused',time:0});this.positions[this.snapshot.key]=0;this.onPosition(this.snapshot.key,0);});
 }
 subscribe=(fn:()=>void)=>{this.listeners.add(fn);return()=>{this.listeners.delete(fn);};};
 getSnapshot=()=>this.snapshot;
 private set(patch:Partial<Snapshot>){this.snapshot={...this.snapshot,...patch};this.listeners.forEach(fn=>fn());}
 private remember(){if(this.snapshot.key){this.positions[this.snapshot.key]=this.element.currentTime;this.onPosition(this.snapshot.key,this.element.currentTime);}}
 select(key:string,url:string,position=0){if(key===this.snapshot.key)return;this.pause();this.positions[key]=position;this.element.src=url;this.set({key,state:'idle',time:position,duration:0});}
 async play(){const token=++this.token;this.set({state:'loading'});try{await this.element.play();if(token===this.token)this.set({state:'playing'});}catch{if(token===this.token)this.set({state:'error'});}}
 pause(){this.token++;this.element.pause();this.remember();if(this.snapshot.key)this.set({state:'paused'});}
 seek(time:number){const safe=Math.max(0,Math.min(time,this.snapshot.duration));this.element.currentTime=safe;this.set({time:safe});this.remember();}
 clear(){this.pause();this.element.removeAttribute('src');this.set({key:'',state:'idle',time:0,duration:0});}
}
let singleton:NarrationController|undefined;
export function narration(){return singleton??=new NarrationController(new Audio());}
