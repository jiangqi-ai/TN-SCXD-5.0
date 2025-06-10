"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[939],{7332:function(e,t,a){a.d(t,{Z:function(){return o}});var i=a(2898);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let o=(0,i.Z)("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]])},519:function(e,t,a){a.d(t,{Z:function(){return o}});var i=a(2898);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let o=(0,i.Z)("Loader",[["line",{x1:"12",x2:"12",y1:"2",y2:"6",key:"gza1u7"}],["line",{x1:"12",x2:"12",y1:"18",y2:"22",key:"1qhbu9"}],["line",{x1:"4.93",x2:"7.76",y1:"4.93",y2:"7.76",key:"xae44r"}],["line",{x1:"16.24",x2:"19.07",y1:"16.24",y2:"19.07",key:"bxnmvf"}],["line",{x1:"2",x2:"6",y1:"12",y2:"12",key:"89khin"}],["line",{x1:"18",x2:"22",y1:"12",y2:"12",key:"pb8tfm"}],["line",{x1:"4.93",x2:"7.76",y1:"19.07",y2:"16.24",key:"1uxjnu"}],["line",{x1:"16.24",x2:"19.07",y1:"7.76",y2:"4.93",key:"6duxfx"}]])},9409:function(e,t,a){a.d(t,{Z:function(){return o}});var i=a(2898);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let o=(0,i.Z)("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]])},7521:function(e,t,a){var i=a(2362),o=a(2601);class r{static getDefaultConfig(){let e="https://demo-project.supabase.co",t="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo";return e&&t?{url:e,anonKey:t,serviceRoleKey:o.env.SUPABASE_SERVICE_ROLE_KEY,connectionPool:10,timeout:30}:null}static async loadConfigFromDatabase(){try{let e=this.getDefaultConfig();if(!e)return console.warn("No default config available, cannot load from database"),null;let t=(0,i.eI)(e.url,e.anonKey),{data:a,error:o}=await t.from("settings").select("key, value").in("key",["db_url","db_anon_key","db_service_key","db_connection_pool","db_timeout"]);if(o)return console.warn("Failed to load config from database:",o),e;if(!a||0===a.length)return console.log("No database config found, using default"),e;let r={};a.forEach(e=>{switch(e.key){case"db_url":r.url=e.value;break;case"db_anon_key":r.anonKey=e.value;break;case"db_service_key":r.serviceRoleKey=e.value;break;case"db_connection_pool":r.connectionPool=parseInt(e.value)||10;break;case"db_timeout":r.timeout=parseInt(e.value)||30}});let n={url:r.url||e.url,anonKey:r.anonKey||e.anonKey,serviceRoleKey:r.serviceRoleKey||e.serviceRoleKey,connectionPool:r.connectionPool||10,timeout:r.timeout||30};return console.log("Loaded config from database successfully"),n}catch(e){return console.error("Error loading config from database:",e),this.getDefaultConfig()}}static async initialize(){if(this.instance.initialized&&this.instance.client)return this.instance.client;try{let e=await this.loadConfigFromDatabase();if(e||(e=this.getDefaultConfig()),!e)return console.error("No valid Supabase configuration found"),null;let t=(0,i.eI)(e.url,e.anonKey,{auth:{persistSession:!0,autoRefreshToken:!0},db:{schema:"public"}});return this.instance.config=e,this.instance.client=t,this.instance.initialized=!0,console.log("Supabase client initialized successfully"),t}catch(e){return console.error("Failed to initialize Supabase client:",e),null}}static getClient(){return this.instance.client}static getConfig(){return this.instance.config}static async reloadConfig(){return this.instance.initialized=!1,this.instance.client=null,this.instance.config=null,await this.initialize()}static async updateConfig(e){try{let t=this.getClient();if(!t)throw Error("No client available for config update");let a=[];for(let i of(e.url&&a.push({key:"db_url",value:e.url,category:"database",is_public:!1}),e.anonKey&&a.push({key:"db_anon_key",value:e.anonKey,category:"database",is_public:!1}),e.serviceRoleKey&&a.push({key:"db_service_key",value:e.serviceRoleKey,category:"database",is_public:!1}),void 0!==e.connectionPool&&a.push({key:"db_connection_pool",value:e.connectionPool.toString(),category:"database",is_public:!1}),void 0!==e.timeout&&a.push({key:"db_timeout",value:e.timeout.toString(),category:"database",is_public:!1}),a)){let{error:e}=await t.from("settings").upsert(i,{onConflict:"key"});if(e)throw e}return await this.reloadConfig(),console.log("Database config updated successfully"),!0}catch(e){return console.error("Failed to update database config:",e),!1}}static async checkConnection(){try{let e=this.getClient();if(!e)return{connected:!1,error:"No client available"};let{data:t,error:a}=await e.from("settings").select("count").limit(1);if(a)return{connected:!1,error:a.message};return{connected:!0}}catch(e){return{connected:!1,error:e.message}}}}r.instance={config:null,client:null,initialized:!1},t.Z=r},5925:function(e,t,a){let i,o;a.r(t),a.d(t,{CheckmarkIcon:function(){return G},ErrorIcon:function(){return U},LoaderIcon:function(){return B},ToastBar:function(){return es},ToastIcon:function(){return et},Toaster:function(){return ed},default:function(){return ep},resolveValue:function(){return E},toast:function(){return j},useToaster:function(){return L},useToasterStore:function(){return S}});var r,n=a(2265);let s={data:""},l=e=>"object"==typeof window?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||s,c=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,u=/\/\*[^]*?\*\/|  +/g,d=/\n+/g,p=(e,t)=>{let a="",i="",o="";for(let r in e){let n=e[r];"@"==r[0]?"i"==r[1]?a=r+" "+n+";":i+="f"==r[1]?p(n,r):r+"{"+p(n,"k"==r[1]?"":t)+"}":"object"==typeof n?i+=p(n,t?t.replace(/([^,])+/g,e=>r.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):r):null!=n&&(r=/^--/.test(r)?r:r.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=p.p?p.p(r,n):r+":"+n+";")}return a+(t&&o?t+"{"+o+"}":o)+i},f={},y=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+y(e[a]);return t}return e},m=(e,t,a,i,o)=>{var r;let n=y(e),s=f[n]||(f[n]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(n));if(!f[s]){let t=n!==e?e:(e=>{let t,a,i=[{}];for(;t=c.exec(e.replace(u,""));)t[4]?i.shift():t[3]?(a=t[3].replace(d," ").trim(),i.unshift(i[0][a]=i[0][a]||{})):i[0][t[1]]=t[2].replace(d," ").trim();return i[0]})(e);f[s]=p(o?{["@keyframes "+s]:t}:t,a?"":"."+s)}let l=a&&f.g?f.g:null;return a&&(f.g=f[s]),r=f[s],l?t.data=t.data.replace(l,r):-1===t.data.indexOf(r)&&(t.data=i?r+t.data:t.data+r),s},g=(e,t,a)=>e.reduce((e,i,o)=>{let r=t[o];if(r&&r.call){let e=r(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;r=t?"."+t:e&&"object"==typeof e?e.props?"":p(e,""):!1===e?"":e}return e+i+(null==r?"":r)},"");function h(e){let t=this||{},a=e.call?e(t.p):e;return m(a.unshift?a.raw?g(a,[].slice.call(arguments,1),t.p):a.reduce((e,a)=>Object.assign(e,a&&a.call?a(t.p):a),{}):a,l(t.target),t.g,t.o,t.k)}h.bind({g:1});let b,v,x,k=h.bind({k:1});function w(e,t){let a=this||{};return function(){let i=arguments;function o(r,n){let s=Object.assign({},r),l=s.className||o.className;a.p=Object.assign({theme:v&&v()},s),a.o=/ *go\d+/.test(l),s.className=h.apply(a,i)+(l?" "+l:""),t&&(s.ref=n);let c=e;return e[0]&&(c=s.as||e,delete s.as),x&&c[0]&&x(s),b(c,s)}return t?t(o):o}}var _=e=>"function"==typeof e,E=(e,t)=>_(e)?e(t):e,C=(i=0,()=>(++i).toString()),z=()=>{if(void 0===o&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");o=!e||e.matches}return o},I=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return I(e,{type:e.toasts.find(e=>e.id===a.id)?1:0,toast:a});case 3:let{toastId:i}=t;return{...e,toasts:e.toasts.map(e=>e.id===i||void 0===i?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let o=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+o}))}}},D=[],N={toasts:[],pausedAt:void 0},$=e=>{N=I(N,e),D.forEach(e=>{e(N)})},K={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},S=(e={})=>{let[t,a]=(0,n.useState)(N),i=(0,n.useRef)(N);(0,n.useEffect)(()=>(i.current!==N&&a(N),D.push(a),()=>{let e=D.indexOf(a);e>-1&&D.splice(e,1)}),[]);let o=t.toasts.map(t=>{var a,i,o;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(i=e[t.type])?void 0:i.duration)||(null==e?void 0:e.duration)||K[t.type],style:{...e.style,...null==(o=e[t.type])?void 0:o.style,...t.style}}});return{...t,toasts:o}},O=(e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||C()}),P=e=>(t,a)=>{let i=O(t,e,a);return $({type:2,toast:i}),i.id},j=(e,t)=>P("blank")(e,t);j.error=P("error"),j.success=P("success"),j.loading=P("loading"),j.custom=P("custom"),j.dismiss=e=>{$({type:3,toastId:e})},j.remove=e=>$({type:4,toastId:e}),j.promise=(e,t,a)=>{let i=j.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let o=t.success?E(t.success,e):void 0;return o?j.success(o,{id:i,...a,...null==a?void 0:a.success}):j.dismiss(i),e}).catch(e=>{let o=t.error?E(t.error,e):void 0;o?j.error(o,{id:i,...a,...null==a?void 0:a.error}):j.dismiss(i)}),e};var A=(e,t)=>{$({type:1,toast:{id:e,height:t}})},R=()=>{$({type:5,time:Date.now()})},T=new Map,F=1e3,M=(e,t=F)=>{if(T.has(e))return;let a=setTimeout(()=>{T.delete(e),$({type:4,toastId:e})},t);T.set(e,a)},L=e=>{let{toasts:t,pausedAt:a}=S(e);(0,n.useEffect)(()=>{if(a)return;let e=Date.now(),i=t.map(t=>{if(t.duration===1/0)return;let a=(t.duration||0)+t.pauseDuration-(e-t.createdAt);if(a<0){t.visible&&j.dismiss(t.id);return}return setTimeout(()=>j.dismiss(t.id),a)});return()=>{i.forEach(e=>e&&clearTimeout(e))}},[t,a]);let i=(0,n.useCallback)(()=>{a&&$({type:6,time:Date.now()})},[a]),o=(0,n.useCallback)((e,a)=>{let{reverseOrder:i=!1,gutter:o=8,defaultPosition:r}=a||{},n=t.filter(t=>(t.position||r)===(e.position||r)&&t.height),s=n.findIndex(t=>t.id===e.id),l=n.filter((e,t)=>t<s&&e.visible).length;return n.filter(e=>e.visible).slice(...i?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+o,0)},[t]);return(0,n.useEffect)(()=>{t.forEach(e=>{if(e.dismissed)M(e.id,e.removeDelay);else{let t=T.get(e.id);t&&(clearTimeout(t),T.delete(e.id))}})},[t]),{toasts:t,handlers:{updateHeight:A,startPause:R,endPause:i,calculateOffset:o}}},Z=k`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,V=k`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,H=k`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,U=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Z} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${V} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${H} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,q=k`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,B=w("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${q} 1s linear infinite;
`,J=k`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Y=k`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,G=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${J} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Y} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,X=w("div")`
  position: absolute;
`,Q=w("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,W=k`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ee=w("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${W} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,et=({toast:e})=>{let{icon:t,type:a,iconTheme:i}=e;return void 0!==t?"string"==typeof t?n.createElement(ee,null,t):t:"blank"===a?null:n.createElement(Q,null,n.createElement(B,{...i}),"loading"!==a&&n.createElement(X,null,"error"===a?n.createElement(U,{...i}):n.createElement(G,{...i})))},ea=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,ei=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,eo=w("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,er=w("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,en=(e,t)=>{let a=e.includes("top")?1:-1,[i,o]=z()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[ea(a),ei(a)];return{animation:t?`${k(i)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${k(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},es=n.memo(({toast:e,position:t,style:a,children:i})=>{let o=e.height?en(e.position||t||"top-center",e.visible):{opacity:0},r=n.createElement(et,{toast:e}),s=n.createElement(er,{...e.ariaProps},E(e.message,e));return n.createElement(eo,{className:e.className,style:{...o,...a,...e.style}},"function"==typeof i?i({icon:r,message:s}):n.createElement(n.Fragment,null,r,s))});r=n.createElement,p.p=void 0,b=r,v=void 0,x=void 0;var el=({id:e,className:t,style:a,onHeightUpdate:i,children:o})=>{let r=n.useCallback(t=>{if(t){let a=()=>{i(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,i]);return n.createElement("div",{ref:r,className:t,style:a},o)},ec=(e,t)=>{let a=e.includes("top"),i=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:z()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(a?1:-1)}px)`,...a?{top:0}:{bottom:0},...i}},eu=h`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ed=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:i,children:o,containerStyle:r,containerClassName:s})=>{let{toasts:l,handlers:c}=L(a);return n.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...r},className:s,onMouseEnter:c.startPause,onMouseLeave:c.endPause},l.map(a=>{let r=a.position||t,s=ec(r,c.calculateOffset(a,{reverseOrder:e,gutter:i,defaultPosition:t}));return n.createElement(el,{id:a.id,key:a.id,onHeightUpdate:c.updateHeight,className:a.visible?eu:"",style:s},"custom"===a.type?E(a.message,a):o?o(a):n.createElement(es,{toast:a,position:r}))}))},ep=j}}]);