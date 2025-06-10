(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[286],{2482:function(e,t,a){"use strict";a.d(t,{Z:function(){return r}});var i=a(2898);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,i.Z)("Filter",[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]])},9883:function(e,t,a){"use strict";a.d(t,{Z:function(){return r}});var i=a(2898);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,i.Z)("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]])},1827:function(e,t,a){"use strict";a.d(t,{Z:function(){return r}});var i=a(2898);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,i.Z)("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]])},2695:function(e,t,a){Promise.resolve().then(a.bind(a,8823))},8823:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return g}});var i=a(7437),r=a(2265),s=a(2899),n=a(7267),o=a(610),l=a(1827),c=a(2482),u=a(9270),d=a(9883),m=a(5925),f=a(1396),p=a.n(f);function g(){let[e,t]=(0,r.useState)([]),[a,f]=(0,r.useState)([]),[g,h]=(0,r.useState)(!0),[y,b]=(0,r.useState)(""),[v,x]=(0,r.useState)(""),{addItem:w}=(0,n.j)(),{user:_}=(0,o.useAuth)(),k=(0,s.JU)();(0,r.useEffect)(()=>{N(),j()},[]);let N=async()=>{let{data:e}=await k.from("categories").select("*").order("name");e&&f(e)},j=async()=>{h(!0);let e=k.from("products").select("\n        *,\n        categories (\n          id,\n          name\n        )\n      ").eq("is_active",!0);v&&(e=e.eq("category_id",v)),y&&(e=e.ilike("name","%".concat(y,"%")));let{data:a}=await e.order("created_at",{ascending:!1});a&&t(a),h(!1)};(0,r.useEffect)(()=>{j()},[y,v]);let E=e=>{if(!_){m.default.error("请先登录");return}w({id:e.id,name:e.name,price:e.price,image_url:e.image_url||void 0,stock_quantity:e.stock_quantity}),m.default.success("已添加到购物车")},C=e=>new Intl.NumberFormat("zh-CN",{style:"currency",currency:"CNY"}).format(e);return(0,i.jsxs)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:[(0,i.jsxs)("div",{className:"mb-8",children:[(0,i.jsx)("h1",{className:"text-3xl font-bold text-gray-900 mb-4",children:"产品中心"}),(0,i.jsxs)("div",{className:"flex flex-col sm:flex-row gap-4 mb-6",children:[(0,i.jsxs)("div",{className:"relative flex-1",children:[(0,i.jsx)(l.Z,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"}),(0,i.jsx)("input",{type:"text",placeholder:"搜索产品...",className:"input-field pl-10",value:y,onChange:e=>b(e.target.value)})]}),(0,i.jsxs)("div",{className:"relative",children:[(0,i.jsx)(c.Z,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"}),(0,i.jsxs)("select",{className:"input-field pl-10 pr-10 appearance-none bg-white",value:v,onChange:e=>x(e.target.value),children:[(0,i.jsx)("option",{value:"",children:"所有分类"}),a.map(e=>(0,i.jsx)("option",{value:e.id,children:e.name},e.id))]})]})]})]}),g?(0,i.jsx)("div",{className:"grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",children:[...Array(8)].map((e,t)=>(0,i.jsxs)("div",{className:"card animate-pulse",children:[(0,i.jsx)("div",{className:"h-48 bg-gray-200 rounded-lg mb-4"}),(0,i.jsx)("div",{className:"h-4 bg-gray-200 rounded mb-2"}),(0,i.jsx)("div",{className:"h-3 bg-gray-200 rounded mb-4"}),(0,i.jsx)("div",{className:"h-8 bg-gray-200 rounded"})]},t))}):0===e.length?(0,i.jsxs)("div",{className:"text-center py-12",children:[(0,i.jsx)(u.Z,{className:"h-16 w-16 text-gray-300 mx-auto mb-4"}),(0,i.jsx)("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"暂无产品"}),(0,i.jsx)("p",{className:"text-gray-500",children:"没有找到符合条件的产品"})]}):(0,i.jsx)("div",{className:"grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",children:e.map(e=>(0,i.jsxs)("div",{className:"card group hover:shadow-lg transition-shadow",children:[(0,i.jsx)(p(),{href:"/products/".concat(e.id),children:(0,i.jsx)("div",{className:"h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden",children:e.image_url?(0,i.jsx)("img",{src:e.image_url,alt:e.name,className:"w-full h-full object-cover group-hover:scale-105 transition-transform"}):(0,i.jsx)(u.Z,{className:"h-16 w-16 text-gray-400"})})}),(0,i.jsx)(p(),{href:"/products/".concat(e.id),children:(0,i.jsx)("h3",{className:"text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors",children:e.name})}),(0,i.jsx)("p",{className:"text-gray-600 text-sm mb-4 line-clamp-2",children:e.description}),(0,i.jsxs)("div",{className:"flex items-center justify-between",children:[(0,i.jsx)("span",{className:"text-2xl font-bold text-primary-600",children:C(e.price)}),(0,i.jsxs)("button",{onClick:()=>E(e),disabled:0===e.stock_quantity,className:"btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",children:[(0,i.jsx)(d.Z,{className:"h-4 w-4"}),0===e.stock_quantity?"缺货":"加入购物车"]})]}),(0,i.jsxs)("div",{className:"mt-2 text-sm text-gray-500",children:["库存: ",e.stock_quantity," 件"]})]},e.id))})]})}},610:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return l},useAuth:function(){return o}});var i=a(7437),r=a(2265),s=a(2899);let n=(0,r.createContext)(void 0);function o(){let e=(0,r.useContext)(n);if(void 0===e)throw Error("useAuth must be used within an AuthProvider");return e}function l(e){let{children:t}=e,[a,o]=(0,r.useState)(null),[l,c]=(0,r.useState)(null),[u,d]=(0,r.useState)(!0),m=(0,s.JU)(),f=async()=>{if(!a)return;let{data:e}=await m.from("profiles").select("*").eq("id",a.id).single();c(e)},p=async()=>{await m.auth.signOut(),o(null),c(null)};return(0,r.useEffect)(()=>{let e=async()=>{let{data:{user:e}}=await m.auth.getUser();o(e),e&&await f(),d(!1)};e();let{data:{subscription:t}}=m.auth.onAuthStateChange(async(e,t)=>{var a;o(null!==(a=null==t?void 0:t.user)&&void 0!==a?a:null),(null==t?void 0:t.user)?await f():c(null),d(!1)});return()=>t.unsubscribe()},[null==a?void 0:a.id]),(0,i.jsx)(n.Provider,{value:{user:a,profile:l,loading:u,signOut:p,refreshProfile:f},children:t})}},7521:function(e,t,a){"use strict";var i=a(2362),r=a(2601);class s{static getDefaultConfig(){let e="https://demo-project.supabase.co",t="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo";return e&&t?{url:e,anonKey:t,serviceRoleKey:r.env.SUPABASE_SERVICE_ROLE_KEY,connectionPool:10,timeout:30}:null}static async loadConfigFromDatabase(){try{let e=this.getDefaultConfig();if(!e)return console.warn("No default config available, cannot load from database"),null;let t=(0,i.eI)(e.url,e.anonKey),{data:a,error:r}=await t.from("settings").select("key, value").in("key",["db_url","db_anon_key","db_service_key","db_connection_pool","db_timeout"]);if(r)return console.warn("Failed to load config from database:",r),e;if(!a||0===a.length)return console.log("No database config found, using default"),e;let s={};a.forEach(e=>{switch(e.key){case"db_url":s.url=e.value;break;case"db_anon_key":s.anonKey=e.value;break;case"db_service_key":s.serviceRoleKey=e.value;break;case"db_connection_pool":s.connectionPool=parseInt(e.value)||10;break;case"db_timeout":s.timeout=parseInt(e.value)||30}});let n={url:s.url||e.url,anonKey:s.anonKey||e.anonKey,serviceRoleKey:s.serviceRoleKey||e.serviceRoleKey,connectionPool:s.connectionPool||10,timeout:s.timeout||30};return console.log("Loaded config from database successfully"),n}catch(e){return console.error("Error loading config from database:",e),this.getDefaultConfig()}}static async initialize(){if(this.instance.initialized&&this.instance.client)return this.instance.client;try{let e=await this.loadConfigFromDatabase();if(e||(e=this.getDefaultConfig()),!e)return console.error("No valid Supabase configuration found"),null;let t=(0,i.eI)(e.url,e.anonKey,{auth:{persistSession:!0,autoRefreshToken:!0},db:{schema:"public"}});return this.instance.config=e,this.instance.client=t,this.instance.initialized=!0,console.log("Supabase client initialized successfully"),t}catch(e){return console.error("Failed to initialize Supabase client:",e),null}}static getClient(){return this.instance.client}static getConfig(){return this.instance.config}static async reloadConfig(){return this.instance.initialized=!1,this.instance.client=null,this.instance.config=null,await this.initialize()}static async updateConfig(e){try{let t=this.getClient();if(!t)throw Error("No client available for config update");let a=[];for(let i of(e.url&&a.push({key:"db_url",value:e.url,category:"database",is_public:!1}),e.anonKey&&a.push({key:"db_anon_key",value:e.anonKey,category:"database",is_public:!1}),e.serviceRoleKey&&a.push({key:"db_service_key",value:e.serviceRoleKey,category:"database",is_public:!1}),void 0!==e.connectionPool&&a.push({key:"db_connection_pool",value:e.connectionPool.toString(),category:"database",is_public:!1}),void 0!==e.timeout&&a.push({key:"db_timeout",value:e.timeout.toString(),category:"database",is_public:!1}),a)){let{error:e}=await t.from("settings").upsert(i,{onConflict:"key"});if(e)throw e}return await this.reloadConfig(),console.log("Database config updated successfully"),!0}catch(e){return console.error("Failed to update database config:",e),!1}}static async checkConnection(){try{let e=this.getClient();if(!e)return{connected:!1,error:"No client available"};let{data:t,error:a}=await e.from("settings").select("count").limit(1);if(a)return{connected:!1,error:a.message};return{connected:!0}}catch(e){return{connected:!1,error:e.message}}}}s.instance={config:null,client:null,initialized:!1},t.Z=s},2899:function(e,t,a){"use strict";a.d(t,{JU:function(){return s}});var i=a(2362),r=a(7521);function s(){let e=r.Z.getClient();if(e)return e;let t="https://demo-project.supabase.co",a="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo";if(!t)throw console.error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable"),Error("Supabase URL is required");if(!a)throw console.error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable"),Error("Supabase Anonymous Key is required");let s=(0,i.eI)(t,a,{auth:{persistSession:!0,autoRefreshToken:!0},db:{schema:"public"}});return s}s()},7267:function(e,t,a){"use strict";a.d(t,{j:function(){return s}});var i=a(4660),r=a(4810);let s=(0,i.Ue)()((0,r.tJ)((e,t)=>({items:[],addItem:a=>{let i=t().items,r=i.find(e=>e.id===a.id);r?e({items:i.map(e=>e.id===a.id?{...e,quantity:Math.min(e.quantity+1,a.stock_quantity)}:e)}):e({items:[...i,{...a,quantity:1}]})},removeItem:a=>{e({items:t().items.filter(e=>e.id!==a)})},updateQuantity:(a,i)=>{if(i<=0){t().removeItem(a);return}e({items:t().items.map(e=>e.id===a?{...e,quantity:Math.min(i,e.stock_quantity)}:e)})},clearCart:()=>{e({items:[]})},getTotalPrice:()=>t().items.reduce((e,t)=>e+t.price*t.quantity,0),getTotalItems:()=>t().items.reduce((e,t)=>e+t.quantity,0)}),{name:"cart-storage"}))},1396:function(e,t,a){e.exports=a(8326)},5925:function(e,t,a){"use strict";let i,r;a.r(t),a.d(t,{CheckmarkIcon:function(){return Y},ErrorIcon:function(){return J},LoaderIcon:function(){return H},ToastBar:function(){return eo},ToastIcon:function(){return et},Toaster:function(){return ed},default:function(){return em},resolveValue:function(){return N},toast:function(){return O},useToaster:function(){return Z},useToasterStore:function(){return q}});var s,n=a(2265);let o={data:""},l=e=>"object"==typeof window?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||o,c=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,u=/\/\*[^]*?\*\/|  +/g,d=/\n+/g,m=(e,t)=>{let a="",i="",r="";for(let s in e){let n=e[s];"@"==s[0]?"i"==s[1]?a=s+" "+n+";":i+="f"==s[1]?m(n,s):s+"{"+m(n,"k"==s[1]?"":t)+"}":"object"==typeof n?i+=m(n,t?t.replace(/([^,])+/g,e=>s.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):s):null!=n&&(s=/^--/.test(s)?s:s.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=m.p?m.p(s,n):s+":"+n+";")}return a+(t&&r?t+"{"+r+"}":r)+i},f={},p=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+p(e[a]);return t}return e},g=(e,t,a,i,r)=>{var s;let n=p(e),o=f[n]||(f[n]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(n));if(!f[o]){let t=n!==e?e:(e=>{let t,a,i=[{}];for(;t=c.exec(e.replace(u,""));)t[4]?i.shift():t[3]?(a=t[3].replace(d," ").trim(),i.unshift(i[0][a]=i[0][a]||{})):i[0][t[1]]=t[2].replace(d," ").trim();return i[0]})(e);f[o]=m(r?{["@keyframes "+o]:t}:t,a?"":"."+o)}let l=a&&f.g?f.g:null;return a&&(f.g=f[o]),s=f[o],l?t.data=t.data.replace(l,s):-1===t.data.indexOf(s)&&(t.data=i?s+t.data:t.data+s),o},h=(e,t,a)=>e.reduce((e,i,r)=>{let s=t[r];if(s&&s.call){let e=s(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;s=t?"."+t:e&&"object"==typeof e?e.props?"":m(e,""):!1===e?"":e}return e+i+(null==s?"":s)},"");function y(e){let t=this||{},a=e.call?e(t.p):e;return g(a.unshift?a.raw?h(a,[].slice.call(arguments,1),t.p):a.reduce((e,a)=>Object.assign(e,a&&a.call?a(t.p):a),{}):a,l(t.target),t.g,t.o,t.k)}y.bind({g:1});let b,v,x,w=y.bind({k:1});function _(e,t){let a=this||{};return function(){let i=arguments;function r(s,n){let o=Object.assign({},s),l=o.className||r.className;a.p=Object.assign({theme:v&&v()},o),a.o=/ *go\d+/.test(l),o.className=y.apply(a,i)+(l?" "+l:""),t&&(o.ref=n);let c=e;return e[0]&&(c=o.as||e,delete o.as),x&&c[0]&&x(o),b(c,o)}return t?t(r):r}}var k=e=>"function"==typeof e,N=(e,t)=>k(e)?e(t):e,j=(i=0,()=>(++i).toString()),E=()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r},C=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return C(e,{type:e.toasts.find(e=>e.id===a.id)?1:0,toast:a});case 3:let{toastId:i}=t;return{...e,toasts:e.toasts.map(e=>e.id===i||void 0===i?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let r=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+r}))}}},I=[],S={toasts:[],pausedAt:void 0},P=e=>{S=C(S,e),I.forEach(e=>{e(S)})},A={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},q=(e={})=>{let[t,a]=(0,n.useState)(S),i=(0,n.useRef)(S);(0,n.useEffect)(()=>(i.current!==S&&a(S),I.push(a),()=>{let e=I.indexOf(a);e>-1&&I.splice(e,1)}),[]);let r=t.toasts.map(t=>{var a,i,r;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(i=e[t.type])?void 0:i.duration)||(null==e?void 0:e.duration)||A[t.type],style:{...e.style,...null==(r=e[t.type])?void 0:r.style,...t.style}}});return{...t,toasts:r}},z=(e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||j()}),D=e=>(t,a)=>{let i=z(t,e,a);return P({type:2,toast:i}),i.id},O=(e,t)=>D("blank")(e,t);O.error=D("error"),O.success=D("success"),O.loading=D("loading"),O.custom=D("custom"),O.dismiss=e=>{P({type:3,toastId:e})},O.remove=e=>P({type:4,toastId:e}),O.promise=(e,t,a)=>{let i=O.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?N(t.success,e):void 0;return r?O.success(r,{id:i,...a,...null==a?void 0:a.success}):O.dismiss(i),e}).catch(e=>{let r=t.error?N(t.error,e):void 0;r?O.error(r,{id:i,...a,...null==a?void 0:a.error}):O.dismiss(i)}),e};var $=(e,t)=>{P({type:1,toast:{id:e,height:t}})},K=()=>{P({type:5,time:Date.now()})},R=new Map,T=1e3,U=(e,t=T)=>{if(R.has(e))return;let a=setTimeout(()=>{R.delete(e),P({type:4,toastId:e})},t);R.set(e,a)},Z=e=>{let{toasts:t,pausedAt:a}=q(e);(0,n.useEffect)(()=>{if(a)return;let e=Date.now(),i=t.map(t=>{if(t.duration===1/0)return;let a=(t.duration||0)+t.pauseDuration-(e-t.createdAt);if(a<0){t.visible&&O.dismiss(t.id);return}return setTimeout(()=>O.dismiss(t.id),a)});return()=>{i.forEach(e=>e&&clearTimeout(e))}},[t,a]);let i=(0,n.useCallback)(()=>{a&&P({type:6,time:Date.now()})},[a]),r=(0,n.useCallback)((e,a)=>{let{reverseOrder:i=!1,gutter:r=8,defaultPosition:s}=a||{},n=t.filter(t=>(t.position||s)===(e.position||s)&&t.height),o=n.findIndex(t=>t.id===e.id),l=n.filter((e,t)=>t<o&&e.visible).length;return n.filter(e=>e.visible).slice(...i?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+r,0)},[t]);return(0,n.useEffect)(()=>{t.forEach(e=>{if(e.dismissed)U(e.id,e.removeDelay);else{let t=R.get(e.id);t&&(clearTimeout(t),R.delete(e.id))}})},[t]),{toasts:t,handlers:{updateHeight:$,startPause:K,endPause:i,calculateOffset:r}}},F=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,M=w`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,L=w`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,J=_("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${F} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${M} 0.15s ease-out forwards;
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
    animation: ${L} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,B=w`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,H=_("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${B} 1s linear infinite;
`,V=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,X=w`
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
}`,Y=_("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${V} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${X} 0.2s ease-out forwards;
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
`,G=_("div")`
  position: absolute;
`,Q=_("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,W=w`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ee=_("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${W} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,et=({toast:e})=>{let{icon:t,type:a,iconTheme:i}=e;return void 0!==t?"string"==typeof t?n.createElement(ee,null,t):t:"blank"===a?null:n.createElement(Q,null,n.createElement(H,{...i}),"loading"!==a&&n.createElement(G,null,"error"===a?n.createElement(J,{...i}):n.createElement(Y,{...i})))},ea=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,ei=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,er=_("div")`
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
`,es=_("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,en=(e,t)=>{let a=e.includes("top")?1:-1,[i,r]=E()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[ea(a),ei(a)];return{animation:t?`${w(i)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${w(r)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},eo=n.memo(({toast:e,position:t,style:a,children:i})=>{let r=e.height?en(e.position||t||"top-center",e.visible):{opacity:0},s=n.createElement(et,{toast:e}),o=n.createElement(es,{...e.ariaProps},N(e.message,e));return n.createElement(er,{className:e.className,style:{...r,...a,...e.style}},"function"==typeof i?i({icon:s,message:o}):n.createElement(n.Fragment,null,s,o))});s=n.createElement,m.p=void 0,b=s,v=void 0,x=void 0;var el=({id:e,className:t,style:a,onHeightUpdate:i,children:r})=>{let s=n.useCallback(t=>{if(t){let a=()=>{i(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,i]);return n.createElement("div",{ref:s,className:t,style:a},r)},ec=(e,t)=>{let a=e.includes("top"),i=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:E()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(a?1:-1)}px)`,...a?{top:0}:{bottom:0},...i}},eu=y`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ed=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:i,children:r,containerStyle:s,containerClassName:o})=>{let{toasts:l,handlers:c}=Z(a);return n.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...s},className:o,onMouseEnter:c.startPause,onMouseLeave:c.endPause},l.map(a=>{let s=a.position||t,o=ec(s,c.calculateOffset(a,{reverseOrder:e,gutter:i,defaultPosition:t}));return n.createElement(el,{id:a.id,key:a.id,onHeightUpdate:c.updateHeight,className:a.visible?eu:"",style:o},"custom"===a.type?N(a.message,a):r?r(a):n.createElement(eo,{toast:a,position:s}))}))},em=O}},function(e){e.O(0,[199,326,367,971,472,744],function(){return e(e.s=2695)}),_N_E=e.O()}]);