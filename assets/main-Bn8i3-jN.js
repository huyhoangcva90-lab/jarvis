const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./JarvisCanvas-CgbkFj9S.js","./maplibre-gl-QL1oPYgw.js","./maplibre-gl-PhPnDjd-.css","./useReducedMotion-B-GvtF-F.js","./LegacyCinematicOrb-C_2w-Ex_.js"])))=>i.map(i=>d[i]);
var xa=Object.defineProperty;var ma=(e,t,i)=>t in e?xa(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i;var ti=(e,t,i)=>ma(e,typeof t!="symbol"?t+"":t,i);import{r as o,j as n,m as at,c as ba,e as va}from"./maplibre-gl-QL1oPYgw.js";const fa="modulepreload",ya=function(e,t){return new URL(e,t).href},ii={},bi=function(t,i,a){let s=Promise.resolve();if(i&&i.length>0){let c=function(h){return Promise.all(h.map(x=>Promise.resolve(x).then(y=>({status:"fulfilled",value:y}),y=>({status:"rejected",reason:y}))))};const m=document.getElementsByTagName("link"),u=document.querySelector("meta[property=csp-nonce]"),v=(u==null?void 0:u.nonce)||(u==null?void 0:u.getAttribute("nonce"));s=c(i.map(h=>{if(h=ya(h,a),h in ii)return;ii[h]=!0;const x=h.endsWith(".css"),y=x?'[rel="stylesheet"]':"";if(!!a)for(let f=m.length-1;f>=0;f--){const T=m[f];if(T.href===h&&(!x||T.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${y}`))return;const l=document.createElement("link");if(l.rel=x?"stylesheet":fa,x||(l.as="script"),l.crossOrigin="",l.href=h,v&&l.setAttribute("nonce",v),document.head.appendChild(l),x)return new Promise((f,T)=>{l.addEventListener("load",f),l.addEventListener("error",()=>T(new Error(`Unable to preload CSS for ${h}`)))})}))}function p(c){const m=new Event("vite:preloadError",{cancelable:!0});if(m.payload=c,window.dispatchEvent(m),!m.defaultPrevented)throw c}return s.then(c=>{for(const m of c||[])m.status==="rejected"&&p(m.reason);return t().catch(p)})},wa=o.lazy(()=>bi(()=>import("./JarvisCanvas-CgbkFj9S.js"),__vite__mapDeps([0,1,2,3]),import.meta.url)),ka=o.lazy(()=>bi(()=>import("./LegacyCinematicOrb-C_2w-Ex_.js"),__vite__mapDeps([4,1,2,3]),import.meta.url));class ja extends o.Component{constructor(){super(...arguments);ti(this,"state",{failed:!1})}static getDerivedStateFromError(){return{failed:!0}}componentDidCatch(i,a){}componentDidUpdate(i){this.state.failed&&i.resetKey!==this.props.resetKey&&this.setState({failed:!1})}render(){return this.state.failed?n.jsxs("div",{className:"orb-recovery",role:"status",children:[n.jsx("span",{children:"ORB RENDER INTERRUPTED"}),n.jsx("button",{type:"button",onClick:()=>window.location.reload(),children:"Reload renderer"})]}):this.props.children}}function Na({activity:e,palette:t="gold",resetSignal:i=0}){const a=o.useRef(null),[s,p]=o.useState(!1);return o.useEffect(()=>{const c=a.current;if(!c)return;const m=new Map,u=y=>{if(m.has(y))return;const d=f=>{f.preventDefault(),p(!0)},l=()=>p(!1);y.addEventListener("webglcontextlost",d),y.addEventListener("webglcontextrestored",l),m.set(y,()=>{y.removeEventListener("webglcontextlost",d),y.removeEventListener("webglcontextrestored",l)})},v=()=>c.querySelectorAll("canvas").forEach(u),h=()=>{m.forEach((y,d)=>{c.contains(d)||(y(),m.delete(d))}),v()},x=new MutationObserver(h);return x.observe(c,{childList:!0,subtree:!0}),h(),()=>{x.disconnect(),m.forEach(y=>y()),m.clear()}},[]),o.useEffect(()=>{p(!1)},[t]),n.jsxs("div",{ref:a,className:"orb-render-host",children:[n.jsx(ja,{resetKey:t,children:n.jsx(o.Suspense,{fallback:n.jsx("div",{className:"orb-loading","aria-hidden":"true"}),children:t==="gold"?n.jsx(ka,{activity:e,palette:t,resetSignal:i}):n.jsx(wa,{activity:e,palette:t,resetSignal:i})})}),s&&n.jsxs("div",{className:"orb-recovery",role:"status",children:[n.jsx("span",{children:"GPU CONTEXT LOST"}),n.jsx("button",{type:"button",onClick:()=>window.location.reload(),children:"Restore orb"})]})]})}const ht="https://jarvisidhuykl.huykl.id.vn",vi={unauthorized:"Gateway token không hợp lệ.",hermes_not_configured:"Hermes chưa được cấu hình trên gateway.",hermes_profile_not_allowed:"Hermes profile không nằm trong danh sách được phép.",hermes_profile_multiplex_disabled:"Hermes profile phụ cần bật multiplex trên Ubuntu.",openclaw_not_configured:"OpenClaw task endpoint chưa được cấu hình trên gateway.",ninerouter_not_configured:"9Router chat endpoint chưa được cấu hình trên gateway.",claude_not_configured:"Claude bridge chưa được cấu hình trên gateway.",ai_not_configured:"Chưa có AI upstream nào được cấu hình để trả lời.",all_ai_upstreams_failed:"Tất cả AI upstream đã cấu hình đều không phản hồi.",payload_too_large:"Dữ liệu gửi lên vượt quá giới hạn gateway.",unknown_workspace_root:"Workspace root không tồn tại trong cấu hình Gateway.",workspace_root_unavailable:"Workspace root đang không khả dụng trên Ubuntu.",workspace_access_denied:"Đường dẫn nằm ngoài workspace được phép.",workspace_path_not_found:"Không tìm thấy đường dẫn trên Ubuntu.",workspace_not_a_directory:"Đường dẫn này không phải thư mục.",workspace_not_a_file:"Đường dẫn này không phải file.",workspace_file_too_large:"File vượt quá giới hạn đọc 512 KB.",workspace_file_type_not_allowed:"Gateway chỉ cho đọc các định dạng văn bản an toàn.",workspace_write_disabled:"Gateway chưa bật quyền sửa workspace. Đặt JCORE_WORKSPACE_WRITE_ENABLED=true rồi khởi động lại gateway.",workspace_file_changed:"File đã thay đổi trên máy chủ. Hãy tải lại trước khi lưu để tránh ghi đè.",terminal_disabled:"Ubuntu command broker đang bị tắt trên Gateway.",terminal_missing_command:"Chưa nhập lệnh Ubuntu.",terminal_missing_argument:"Lệnh còn thiếu tham số bắt buộc.",terminal_command_rejected:"Lệnh bị từ chối bởi bộ lọc terminal.",terminal_command_not_allowed:"Lệnh không nằm trong danh mục vận hành được phép.",terminal_service_not_allowed:"Service này không nằm trong danh sách Gateway được quản lý.",terminal_private_mode_disabled:"Private Ubuntu shell chưa được bật trên Gateway.",terminal_private_mode_requires_ubuntu:"Private shell chỉ chạy trên Ubuntu Gateway host.",dashboard_command_not_allowed:"Lệnh dashboard này chưa nằm trong allowlist Gateway.",voice_stt_not_configured:"Hermes STT local chưa được cấu hình; J-Core sẽ dùng nhận giọng nói của trình duyệt.",voice_tts_not_configured:"Hermes TTS local chưa được cấu hình; J-Core sẽ dùng giọng đọc của trình duyệt.",voice_audio_missing:"Chưa nhận được dữ liệu microphone.",voice_text_invalid:"Nội dung cần đọc không hợp lệ hoặc quá dài.",upstream_timeout:"Dịch vụ phía sau gateway phản hồi quá chậm.",upstream_offline:"Dịch vụ phía sau gateway đang offline.",app_config_not_configured:"Chưa khai báo file cấu hình của app trên Ubuntu.",app_config_not_found:"Không tìm thấy file cấu hình trên Ubuntu.",app_config_not_a_file:"Đường dẫn cấu hình không phải file.",app_config_type_not_allowed:"Chỉ hỗ trợ JSON, YAML, TOML, INI và CONF.",app_config_too_large:"File cấu hình vượt quá 512 KB.",app_config_write_disabled:"Quyền sửa cấu hình app đang tắt trên Ubuntu.",app_config_changed:"File đã thay đổi; hãy tải lại trước khi lưu."};function Ee(e){var s,p,c;const t=((s=e==null?void 0:e.auth)==null?void 0:s.sessionMode)==="same-origin",i=t&&typeof window<"u"?window.location.origin:((p=e==null?void 0:e.endpoints)==null?void 0:p.gateway)||ht,a=String(((c=e==null?void 0:e.endpoints)==null?void 0:c.gatewayToken)||"").trim().replace(/^Bearer\s+/i,"");return{gateway:String(i).trim().replace(/\/+$/,""),token:t?"":a,sameOrigin:t}}function fi(){var e,t;return((t=(e=globalThis.crypto)==null?void 0:e.randomUUID)==null?void 0:t.call(e))||`jcore-${Date.now()}-${Math.random().toString(16).slice(2)}`}async function sn(e,t,i={}){var d;const{gateway:a,token:s}=Ee(e),{timeoutMs:p=15e3,headers:c,...m}=i,u=fi(),v={"x-request-id":u,...c||{}};m.body&&!v["content-type"]&&(v["content-type"]="application/json"),s&&(v.authorization=`Bearer ${s}`);const h=new AbortController,x=()=>h.abort();m.signal&&(m.signal.aborted?h.abort():m.signal.addEventListener("abort",x,{once:!0}));const y=globalThis.setTimeout(()=>h.abort(),p);try{const l=await fetch(`${a}${t}`,{...m,credentials:m.credentials||"include",headers:v,signal:h.signal}),f=await l.text();let T={};try{T=f?JSON.parse(f):{}}catch{T={raw:f}}const S=l.headers.get("x-request-id")||T.requestId||u;if(T.requestId=S,T.meta={...T.meta||{},requestId:S,upstream:l.headers.get("x-jcore-upstream")||T.source||"",serverTiming:l.headers.get("server-timing")||""},!l.ok){const A=T.error||T.message,P=new Error(vi[A]||A||`Gateway error ${l.status}`);throw P.status=l.status,P.details=T,P.requestId=S,P}return T}catch(l){if((l==null?void 0:l.name)==="AbortError"){const f=new Error(`Gateway timeout after ${p}ms`);throw f.requestId=u,f}if(l instanceof TypeError){const f=new Error("Không thể kết nối gateway. Hãy kiểm tra URL, mạng và CORS.");throw f.requestId=u,f}throw l}finally{globalThis.clearTimeout(y),(d=m.signal)==null||d.removeEventListener("abort",x)}}async function ai(e,t,i={}){const{gateway:a,token:s}=Ee(e),{timeoutMs:p=6e4,headers:c,...m}=i,u=fi(),v={"x-request-id":u,...c||{}};s&&(v.authorization=`Bearer ${s}`);const h=new AbortController,x=globalThis.setTimeout(()=>h.abort(),p);try{const y=await fetch(`${a}${t}`,{...m,credentials:m.credentials||"include",headers:v,signal:h.signal});if(!y.ok){let d={};try{d=await y.json()}catch{d={}}const l=d.error||d.message,f=new Error(vi[l]||l||`Gateway error ${y.status}`);throw f.status=y.status,f.details=d,f.requestId=y.headers.get("x-request-id")||u,f}return y}catch(y){throw(y==null?void 0:y.name)==="AbortError"?new Error(`Gateway timeout after ${p}ms`):y}finally{globalThis.clearTimeout(x)}}function ri(e){var i,a,s,p,c;const t=(e==null?void 0:e.raw)??e;return typeof t=="string"?t:(e==null?void 0:e.reply)||(e==null?void 0:e.message)||(t==null?void 0:t.reply)||(t==null?void 0:t.message)||(t==null?void 0:t.content)||(t==null?void 0:t.output)||(t==null?void 0:t.response)||((s=(a=(i=t==null?void 0:t.choices)==null?void 0:i[0])==null?void 0:a.message)==null?void 0:s.content)||((c=(p=t==null?void 0:t.choices)==null?void 0:p[0])==null?void 0:c.text)||""}const Kn={POWER:"power",SPACE:"space",MIND:"mind",TIME:"time",REALITY:"reality",SOUL:"soul"},En={DORMANT:"dormant",READING:"reading",WORKING:"working",ERROR:"error"},Ca=[Kn.MIND,Kn.SPACE,Kn.TIME,Kn.POWER,Kn.REALITY,Kn.SOUL];function yi(){const e={};for(const t of Ca)e[t]={status:En.DORMANT,lastEvent:null,lastError:null,connectedAt:null,metrics:{}};return e}function Ta(e,t){switch(t.type){case"SET_STATUS":{const{stoneId:i,status:a,metrics:s,error:p}=t.payload;return{...e,[i]:{...e[i],status:a,lastEvent:new Date().toISOString(),lastError:p!==void 0?p:e[i].lastError,metrics:s?{...e[i].metrics,...s}:e[i].metrics}}}case"SET_CONNECTED":{const{stoneId:i}=t.payload;return{...e,[i]:{...e[i],connectedAt:new Date().toISOString(),status:En.READING,lastEvent:new Date().toISOString()}}}case"SET_DISCONNECTED":{const{stoneId:i,error:a}=t.payload;return{...e,[i]:{...e[i],status:En.ERROR,connectedAt:null,lastError:a||"Connection lost",lastEvent:new Date().toISOString()}}}case"RESET_ALL":return yi();default:return e}}const wi=o.createContext(null);function Sa({children:e,data:t}){var x,y;const[i,a]=o.useReducer(Ta,null,yi),[s,p]=o.useState({gateway:!1,hermes:!1,openclaw:!1,nineRouter:!1,claude:!1,lastCheckedAt:null,latencyMs:null,requestId:null,services:{},error:null});o.useEffect(()=>{let d=!1;const l=async()=>{var Y,B,j,C,R,O;const T=performance.now();let S=!1,A=!1,P=!1,U=!1;try{const k=await sn(t,"/health",{method:"GET",timeoutMs:5e3});if(d)return;const E=mn=>{const bn=mn.toLowerCase().replace(/[^a-z0-9]/g,""),M=k.services||{},pn=Object.keys(M).find(vn=>vn.toLowerCase().replace(/[^a-z0-9]/g,"")===bn);return pn?M[pn]:null},$=E("hermes"),F=E("openclaw"),tn=E("nineRouter")||E("ninerouter"),an=E("claude");S=!!($!=null&&$.online)&&($==null?void 0:$.configured)!==!1,A=!!(F!=null&&F.online)&&(F==null?void 0:F.configured)!==!1,P=!!(tn!=null&&tn.online)&&(tn==null?void 0:tn.configured)!==!1,U=!!(an!=null&&an.online)&&(an==null?void 0:an.configured)!==!1,p({gateway:!0,hermes:S,openclaw:A,nineRouter:P,claude:U,lastCheckedAt:new Date().toISOString(),latencyMs:Math.round(performance.now()-T),requestId:k.requestId||((Y=k.meta)==null?void 0:Y.requestId)||null,services:k.services||{},telemetry:{version:k.version||((B=k.meta)==null?void 0:B.version)||"1.0.0",uptime:k.uptime||((j=k.meta)==null?void 0:j.uptime)||null,environment:k.environment||((C=k.meta)==null?void 0:C.environment)||"production",activeConnections:k.activeConnections||((R=k.meta)==null?void 0:R.activeConnections)||null},error:null})}catch(k){if(d)return;p({gateway:!1,hermes:!1,openclaw:!1,nineRouter:!1,claude:!1,lastCheckedAt:new Date().toISOString(),latencyMs:Math.round(performance.now()-T),requestId:(k==null?void 0:k.requestId)||((O=k==null?void 0:k.details)==null?void 0:O.requestId)||null,services:{},error:(k==null?void 0:k.message)||"Gateway offline"})}a({type:"SET_STATUS",payload:{stoneId:"space",status:P?En.READING:En.ERROR,error:P?null:"9Router gateway is offline"}}),a({type:"SET_STATUS",payload:{stoneId:"power",status:A?En.READING:En.DORMANT,error:A?null:"OpenClaw agent workforce dormant"}}),a({type:"SET_STATUS",payload:{stoneId:"mind",status:S?En.WORKING:En.ERROR,error:S?null:"Hermes Core API offline"}})};l();const f=setInterval(l,1e4);return()=>{d=!0,clearInterval(f)}},[(x=t==null?void 0:t.endpoints)==null?void 0:x.gateway,(y=t==null?void 0:t.endpoints)==null?void 0:y.gatewayToken]);const c=o.useCallback((d,l,f={})=>{a({type:"SET_STATUS",payload:{stoneId:d,status:l,...f}})},[]),m=o.useCallback(d=>{a({type:"SET_CONNECTED",payload:{stoneId:d}})},[]),u=o.useCallback((d,l)=>{a({type:"SET_DISCONNECTED",payload:{stoneId:d,error:l}})},[]),v=o.useCallback(()=>{a({type:"RESET_ALL"})},[]),h=o.useMemo(()=>({stones:i,connections:s,setStoneStatus:c,connectStone:m,disconnectStone:u,resetAllStones:v}),[i,s,c,m,u,v]);return n.jsx(wi.Provider,{value:h,children:e})}function ki(){const e=o.useContext(wi);if(!e)throw new Error("useStoneState must be used within StoneStateProvider");return e}const Jn="jarvis.commandOrb.v2",Ma=["gold","blue","green","red","violet","orange","spider","world","javis"],Aa=new Set(Ma);function Ea(e){return typeof e=="string"&&Aa.has(e)}function za(){if(typeof window>"u")return"gold";try{const e=window.localStorage.getItem(Jn);if(!e)return"gold";const t=JSON.parse(e);return Ea(t.palette)?t.palette:"gold"}catch{return"gold"}}function Ia(e){if(!(typeof window>"u"))try{const t=window.localStorage.getItem(Jn),i=t?JSON.parse(t):{};window.localStorage.setItem(Jn,JSON.stringify({...i,palette:e}))}catch{window.localStorage.setItem(Jn,JSON.stringify({palette:e}))}}const gt="Code",Oa=[{id:"Code",label:"Code",detail:"Lập trình mặc định"},{id:"Combofree",label:"Combo Free",detail:"Định tuyến tiết kiệm"},{id:"Gemini",label:"Gemini",detail:"Đa phương thức"},{id:"claudecode",label:"Claude Code",detail:"Tác vụ coding dài"}];function Ra(e){var t,i;return((i=(t=e==null?void 0:e.endpoints)==null?void 0:t.nineRouterModel)==null?void 0:i.trim())||gt}const ji="j-core-console:data:v1",pt="j-core-console:gateway-token:session",ze="j-core-console:gateway-token:persistent";function rt(){try{return sessionStorage.getItem(pt)||localStorage.getItem(ze)||""}catch{return""}}function La(){try{return!!localStorage.getItem(ze)}catch{return!1}}function Ie(e,t=!1){const i=String(e||"").trim();try{if(sessionStorage.removeItem(pt),localStorage.removeItem(ze),!i)return;const a=t?localStorage:sessionStorage,s=t?ze:pt;a.setItem(s,i)}catch{}}function Ha(){Ie("")}const Da={ChatGPT:"https://chatgpt.com/",Notion:"https://www.notion.so/","Google Drive":"https://drive.google.com/",GitHub:"https://github.com/",n8n:"https://n8n.io/","YouTube Studio":"https://studio.youtube.com/",Gmail:"https://mail.google.com/",Calendar:"https://calendar.google.com/"},Ce={username:"Huy",aiPersonaName:"J-Core",mood:"calm",energy:"medium",mainQuest:"Build my personal AI console",sideQuests:["","",""],activeProject:"Personal AI assistant app",missionStatus:"Not started",themeIntensity:"Medium",memory:{whoIAm:"I am Huy, building a personal AI operating system for focus, planning, and creative execution.",currentProjects:"Personal AI assistant app",longTermGoals:"Design a calm, powerful workflow that helps me think clearly and finish important missions.",aiRules:"Be direct, useful, warm, and practical. Help me turn vague thoughts into next actions.",remember:"Prefer clean systems, daily momentum, and tools that reduce friction."},sectors:[{name:"Work Sector",status:"Stable",progress:68,notes:"Primary focus orbit is stable."},{name:"Money Sector",status:"Warning",progress:42,notes:"Review income systems and expenses."},{name:"Learning Sector",status:"Stable",progress:61,notes:"Keep one active study track."},{name:"Health Sector",status:"Stable",progress:55,notes:"Protect sleep and movement windows."},{name:"Content Sector",status:"Warning",progress:36,notes:"Prepare one reusable content pipeline."},{name:"System Sector",status:"Stable",progress:73,notes:"Console build in progress."}],toolUrls:Da,logs:["J-Core kernel initialized.","Operator profile loaded.","Mission control standing by."],endpoints:{gateway:ht,gatewayToken:"",nineRouterModel:gt},ai:{hermesProfile:"jarvis"},auth:{loginEnabled:!0,username:"admin",password:"123456"},soundEnabled:!0,activeDeck:"command"};function Pa(){var e;try{const t=localStorage.getItem(ji);if(!t)return{...Ce,endpoints:{...Ce.endpoints,gatewayToken:rt()}};const i=JSON.parse(t),a=((e=i.endpoints)==null?void 0:e.gatewayToken)||"",s=rt()||a;return a&&!rt()&&Ie(a,!1),Ba(Ce,{...i,endpoints:{...i.endpoints||{},gatewayToken:s}})}catch{return Ce}}function Ga(e){const t={...e.endpoints||{}};delete t.gatewayToken,localStorage.setItem(ji,JSON.stringify({...e,endpoints:t}))}function Ba(e,t){var p;const i=(p=t.endpoints)==null?void 0:p.gateway,s=typeof window<"u"&&window.location.protocol==="https:"&&/^http:\/\/(127\.0\.0\.1|localhost):8787\/?$/.test(i||"")?ht:i;return{...e,...t,memory:{...e.memory,...t.memory||{}},toolUrls:{...e.toolUrls,...t.toolUrls||{}},endpoints:{...e.endpoints,...t.endpoints||{},gateway:s||e.endpoints.gateway},ai:{...e.ai,...t.ai||{}},auth:{...e.auth,...t.auth||{}},activeDeck:t.activeDeck||e.activeDeck,sectors:Array.isArray(t.sectors)?t.sectors:e.sectors,sideQuests:Array.isArray(t.sideQuests)?t.sideQuests.slice(0,3):e.sideQuests,logs:Array.isArray(t.logs)?t.logs.slice(-16):e.logs}}const In=[{kind:"web",label:"Tình báo Web",code:"NET",description:"Tra cứu mạng và tổng hợp nguồn",group:"intel"},{kind:"news",label:"Phòng tin",code:"NWS",description:"Tin mới, diễn biến và nguồn",group:"intel"},{kind:"video",label:"YouTube",code:"VID",description:"Video, playlist và ghi chú",group:"intel"},{kind:"shopping",label:"Mua sắm",code:"SHP",description:"Sản phẩm, giá và lựa chọn",group:"intel"},{kind:"map",label:"Bản đồ",code:"MAP",description:"Địa chỉ, tuyến đường và khu vực",group:"spatial"},{kind:"places",label:"Địa điểm",code:"PLC",description:"Quán, menu và gợi ý",group:"spatial"},{kind:"travel",label:"Du lịch",code:"TRV",description:"Lịch trình, chặng và điểm đến",group:"spatial"},{kind:"weather",label:"Thời tiết",code:"WTH",description:"Thời tiết và điều kiện môi trường",group:"spatial"},{kind:"tasks",label:"Bảng nhiệm vụ",code:"TSK",description:"Danh sách và tiến độ nhiệm vụ",group:"planning"},{kind:"calendar",label:"Lịch",code:"CAL",description:"Lịch, cuộc hẹn và chương trình",group:"planning"},{kind:"timeline",label:"Dòng thời gian",code:"TML",description:"Mốc thời gian và diễn biến",group:"planning"},{kind:"files",label:"Kho tệp",code:"FIL",description:"Tệp, thư mục và tài nguyên",group:"workspace"},{kind:"document",label:"Tài liệu",code:"DOC",description:"Tài liệu và nội dung dài",group:"workspace"},{kind:"pdf",label:"Trình đọc PDF",code:"PDF",description:"Đọc, tóm tắt và trích dẫn PDF",group:"workspace"},{kind:"notes",label:"Ghi chú",code:"NTE",description:"Ghi chú, ý tưởng và bộ nhớ",group:"workspace"},{kind:"inbox",label:"Hộp thư",code:"INB",description:"Tin nhắn, email và ưu tiên",group:"workspace"},{kind:"dashboard",label:"Bảng tổng quan",code:"DSH",description:"KPI và trạng thái tổng quan",group:"data"},{kind:"chart",label:"Biểu đồ",code:"CHT",description:"Xu hướng và dữ liệu trực quan",group:"data"},{kind:"table",label:"Lưới dữ liệu",code:"TBL",description:"Bảng dữ liệu có cấu trúc",group:"data"},{kind:"compare",label:"So sánh",code:"CMP",description:"So sánh lựa chọn cạnh nhau",group:"data"},{kind:"finance",label:"Tài chính",code:"FIN",description:"Giá, ngân sách và biến động",group:"data"},{kind:"audio",label:"Bàn âm thanh",code:"AUD",description:"Âm thanh, nhạc và giọng nói",group:"media"},{kind:"podcast",label:"Podcast",code:"POD",description:"Tập podcast và transcript",group:"media"},{kind:"feed",label:"Dòng nội dung",code:"FED",description:"Dòng nội dung số được tuyển chọn",group:"media"},{kind:"images",label:"Hình ảnh",code:"IMG",description:"Thư viện và hình tham khảo",group:"creation"},{kind:"mindmap",label:"Sơ đồ tư duy",code:"MND",description:"Bản đồ ý tưởng tương tác",group:"creation"},{kind:"diagram",label:"Sơ đồ hệ thống",code:"DGM",description:"Luồng, hệ thống và kiến trúc",group:"creation"},{kind:"code",label:"Phòng mã",code:"COD",description:"Mã nguồn, giải thích và bản vá",group:"creation"},{kind:"text",label:"Bản tóm lược",code:"TXT",description:"Tóm tắt và nội dung chuyên sâu",group:"creation"},{kind:"automation",label:"Tự động hóa",code:"AUT",description:"Kích hoạt, quy trình và hành động",group:"system"},{kind:"monitor",label:"Giám sát hệ thống",code:"SYS",description:"Tài nguyên, dịch vụ và đo lường",group:"system"},{kind:"terminal",label:"Terminal",code:"TRM",description:"Lệnh, log và phiên thực thi",group:"system"}],Ua=[["terminal",/\b(terminal|command line|dong lenh|shell|powershell|bash|log he thong)\b/],["automation",/\b(automation|tu dong hoa|workflow|trigger|webhook|quy trinh tu dong)\b/],["monitor",/\b(system monitor|tai nguyen he thong|cpu|ram|telemetry|health check|process)\b/],["inbox",/\b(inbox|email|hop thu|thu moi|tin nhan|mail)\b/],["pdf",/\b(pdf|file pdf|tai lieu pdf|doc pdf)\b/],["document",/\b(document|tai lieu|van ban|docx|word|bao cao dai)\b/],["notes",/\b(note|notes|ghi chu|so tay|memory note)\b/],["files",/\b(file|folder|tep|thu muc|file manager|quan ly tep)\b/],["podcast",/\b(podcast|transcript podcast|tap moi|chuong trinh noi)\b/],["audio",/\b(audio|am thanh|nhac|music|voice note|ghi am)\b/],["feed",/\b(content feed|bang tin|dong noi dung|rss|feed|noi dung so)\b/],["finance",/\b(tai chinh|finance|co phieu|chung khoan|ngan sach|chi tieu|doanh thu|gia vang|crypto)\b/],["weather",/\b(thoi tiet|du bao|nhiet do|mua|nang|bao|weather|forecast)\b/],["calendar",/\b(lich|cuoc hen|hen lich|agenda|calendar|schedule|meeting)\b/],["tasks",/\b(todo|checklist|cong viec|nhiem vu|mission|task|viec can lam)\b/],["compare",/\b(so sanh|versus|vs|khac nhau|lua chon nao|compare)\b/],["timeline",/\b(timeline|lo trinh|moc thoi gian|dien bien|roadmap)\b/],["dashboard",/\b(dashboard|tong quan|kpi|chi so|monitor|bang dieu khien)\b/],["chart",/\b(bieu do|do thi|chart|thong ke|xu huong|trend)\b/],["table",/\b(bang du lieu|data grid|table|bang chi tiet)\b/],["travel",/\b(du lich|lich trinh|chuyen di|khach san|chuyen bay|travel|itinerary)\b/],["shopping",/\b(mua sam|san pham|gia ban|deal|shopping|review san pham)\b/],["news",/\b(tin tuc|tin moi|thoi su|news|su kien moi)\b/],["code",/\b(code|ma nguon|viet ham|lap trinh|snippet|implementation|patch)\b/],["video",/\b(video|youtube|clip|playlist|phim|xem)\b/],["mindmap",/\b(mind\s*map|mindmap|so do tu duy|ban do tu duy)\b/],["diagram",/\b(so do|diagram|flowchart|luong xu ly|kien truc|architecture)\b/],["images",/\b(hinh anh|hinh|anh|image|gallery|moodboard)\b/],["places",/\b(quan|cafe|ca phe|nha hang|menu|mon an|an gi|uong gi|dia diem goi y)\b/],["map",/\b(ban do|map|dia chi|duong di|chi duong|toa do|gan day)\b/],["web",/\b(tim kiem|tra cuu|tren mang|internet|web|tin moi|nghien cuu|search)\b/],["text",/\b(tom tat|viet|phan tich|bao cao|brief|ghi chu|tai lieu)\b/]];function _a(e){return e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/Đ/g,"D").toLowerCase()}function $a(e,t){const i=e.replace(/\s+/g," ").replace(/^(jarvis|j-core|j core)[,\s:;-]*/i,"").trim();return i?i.length>56?`${i.slice(0,53).trim()}…`:i:t}function Va(e){var i;const t=_a(e);return((i=Ua.find(([,a])=>a.test(t)))==null?void 0:i[0])??null}function oi(e,t){const i=t??Va(e);if(!i)return null;const a=In.find(s=>s.kind===i);return{id:`hub-${Date.now()}-${Math.random().toString(16).slice(2)}`,kind:i,title:$a(e,a.label),query:e.trim(),status:"loading",items:[],createdAt:Date.now()}}function qa(e){return Array.isArray(e)?e.slice(0,12).map((t,i)=>{if(typeof t=="string")return{id:`item-${i}`,title:t};const a=t??{};return{id:String(a.id??`item-${i}`),title:String(a.title??a.name??a.label??`Kết quả ${i+1}`),description:String(a.description??a.summary??a.snippet??a.detail??""),url:typeof a.url=="string"?a.url:typeof a.link=="string"?a.link:void 0,image:typeof a.image=="string"?a.image:typeof a.thumbnail=="string"?a.thumbnail:void 0,meta:typeof a.meta=="string"||typeof a.meta=="number"?String(a.meta):typeof a.price=="string"||typeof a.price=="number"?String(a.price):typeof a.value=="string"||typeof a.value=="number"?String(a.value):typeof a.status=="string"?a.status:typeof a.time=="string"?a.time:typeof a.date=="string"?a.date:void 0}}):[]}function Ka(e,t){return["dashboard","chart","table","compare","timeline","tasks","calendar","travel","files","document","pdf","notes","inbox","audio","podcast","feed","finance","automation","monitor","terminal"].includes(e)?Ni(t,e==="compare"?4:8).map((a,s)=>{var u,v,h;const p=(v=(u=a.match(/-?\d+(?:[.,]\d+)?\s*(?:%|ms|°|k|m|b)?/i))==null?void 0:u[0])==null?void 0:v.replace(/\s+/g,""),c=(h=a.match(/\b(?:[01]?\d|2[0-3]):[0-5]\d\b/))==null?void 0:h[0],m=a.replace(/^.{0,24}?:\s*/,"").trim()||a;return{id:`derived-${s}`,title:m,description:a===m?"":a,meta:c??p??(e==="tasks"||e==="automation"?"Queued":e==="timeline"||e==="travel"?`T+${s+1}`:e==="files"?"LOCAL":e==="inbox"?"Unread":void 0)}}):[]}function si(e,t,i){const a=(i==null?void 0:i.raw)??{},s=(Array.isArray(i==null?void 0:i.artifacts)?i==null?void 0:i.artifacts:void 0)??(Array.isArray(a.artifacts)?a.artifacts:void 0),p=(i==null?void 0:i.hub)??a.hub??(s?s.find(u=>u.kind===e.kind||u.type===e.kind):void 0),c=qa((p==null?void 0:p.items)??(p==null?void 0:p.results)??(i==null?void 0:i.results)??a.results),m=c.length?c:Ka(e.kind,t);return{...e,status:"ready",title:typeof(p==null?void 0:p.title)=="string"?p.title:e.title,summary:typeof(p==null?void 0:p.summary)=="string"?p.summary:t,items:m}}function Fa(e,t){return{...e,status:"error",error:t}}function ci(e,t){return["web","video","map","places","images","news","shopping","travel","weather","audio","podcast","feed","finance"].includes(e.kind)?{...e,status:"ready",summary:`Kênh tổng hợp AI đang gián đoạn (${t}). Jarvis đã giữ nguyên truy vấn và mở chế độ nguồn trực tiếp để b vẫn tiếp tục tra cứu.`}:Fa(e,t)}function Ni(e,t=7){const i=e.split(/\r?\n/).map(s=>s.replace(/^(\s*[-*•]|\s*\d+[.)])\s*/,"").trim()).filter(s=>s.length>2&&s.length<150),a=Array.from(new Set(i));return a.length>=2?a.slice(0,t):e.split(/[.!?]\s+/).map(s=>s.trim()).filter(s=>s.length>8).slice(0,t)}function Fn(e){return In.find(t=>t.kind===e)??In[0]}function Ci(e){let t=e.query.replace(/^(jarvis|j-core|j core)[,\s:;-]*/i,"").trim();const i={video:[/^(hãy\s+|giúp\s+)?tìm(\s+kiếm)?(\s+(một|vài|\d+))?\s+(video|clip)(\s+về)?\s*/i,/\byoutube\b/gi],map:[/^(hãy\s+|giúp\s+)?(tra|tìm)(\s+cứu)?\s+(địa\s+chỉ|vị\s+trí)\s*/i,/\b(trên\s+bản\s+đồ|bản\s+đồ|chỉ\s+đường)\b/gi],places:[/^(hãy\s+|giúp\s+)?(tìm|gợi\s+ý)(\s+cho\s+\w+)?\s*/i],images:[/^(hãy\s+|giúp\s+)?tìm(\s+kiếm)?(\s+(một|vài|\d+))?\s+(hình\s+ảnh|ảnh|image)(\s+về)?\s*/i],web:[/^(hãy\s+|giúp\s+)?(tìm\s+kiếm|tra\s+cứu|nghiên\s+cứu)(\s+trên\s+(mạng|web|internet))?\s*/i],news:[/^(hãy\s+|giúp\s+)?(tìm|xem|đọc)?\s*(tin\s+tức|tin\s+mới|news)(\s+về)?\s*/i],shopping:[/^(hãy\s+|giúp\s+)?(tìm|so\s+sánh)?\s*(mua\s+sắm|sản\s+phẩm|giá)(\s+về)?\s*/i],travel:[/^(hãy\s+|giúp\s+)?(lên|tạo|gợi\s+ý)?\s*(lịch\s+trình|chuyến\s+đi|du\s+lịch)(\s+đến)?\s*/i],weather:[/^(hãy\s+|giúp\s+)?(xem|kiểm\s+tra|dự\s+báo)?\s*(thời\s+tiết)(\s+tại|\s+ở)?\s*/i],audio:[/^(hãy\s+|giúp\s+)?(tìm|mở|nghe)?\s*(audio|âm\s+thanh|nhạc)(\s+về)?\s*/i],podcast:[/^(hãy\s+|giúp\s+)?(tìm|mở|nghe)?\s*(podcast)(\s+về)?\s*/i],feed:[/^(hãy\s+|giúp\s+)?(tạo|xem|tổng\s+hợp)?\s*(content\s+feed|feed|bảng\s+tin)(\s+về)?\s*/i],finance:[/^(hãy\s+|giúp\s+)?(xem|phân\s+tích|theo\s+dõi)?\s*(tài\s+chính|finance|giá)(\s+của)?\s*/i]};for(const a of i[e.kind]??[])t=t.replace(a," ");return t.replace(/\s+/g," ").trim()||e.query}function Ja(e){return{dashboard:[{id:"metric-1",title:"System readiness",description:"Core services available",meta:"92%"},{id:"metric-2",title:"Active missions",description:"2 high-priority workflows",meta:"06"},{id:"metric-3",title:"Response latency",description:"Rolling 5-minute median",meta:"184ms"},{id:"metric-4",title:"Memory context",description:"Relevant items in scope",meta:"24"}],chart:[{id:"chart-1",title:"Mon",meta:"42"},{id:"chart-2",title:"Tue",meta:"68"},{id:"chart-3",title:"Wed",meta:"54"},{id:"chart-4",title:"Thu",meta:"86"},{id:"chart-5",title:"Fri",meta:"73"}],table:[{id:"row-1",title:"Hermes",description:"Reasoning orchestrator",meta:"Ready"},{id:"row-2",title:"OpenClaw",description:"Agent workforce",meta:"Standby"},{id:"row-3",title:"9Router",description:"Model routing",meta:"Online"}],compare:[{id:"option-1",title:"Option Alpha",description:"Fast, focused and low overhead",meta:"86"},{id:"option-2",title:"Option Beta",description:"Broader coverage and more context",meta:"74"},{id:"option-3",title:"Option Gamma",description:"Balanced default profile",meta:"81"}],timeline:[{id:"time-1",title:"Discovery",description:"Collect constraints and signals",meta:"08:00"},{id:"time-2",title:"Synthesis",description:"Build the operating picture",meta:"09:30"},{id:"time-3",title:"Execution",description:"Dispatch tools and agents",meta:"11:00"},{id:"time-4",title:"Review",description:"Verify outputs and close loop",meta:"14:00"}],tasks:[{id:"task-1",title:"Verify source data",description:"Check freshness and provenance",meta:"Ready"},{id:"task-2",title:"Run primary workflow",description:"Execute with safe tool scope",meta:"Active"},{id:"task-3",title:"Review final output",description:"Validate against the objective",meta:"Queued"}],calendar:[{id:"event-1",title:"Daily briefing",description:"Command center sync",meta:"08:30"},{id:"event-2",title:"Mission review",description:"Progress and blockers",meta:"13:00"},{id:"event-3",title:"System maintenance",description:"Diagnostics window",meta:"20:30"}],weather:[{id:"weather-1",title:"Now",description:"Partly cloudy",meta:"29°"},{id:"weather-2",title:"Afternoon",description:"Light rain possible",meta:"31°"},{id:"weather-3",title:"Evening",description:"Cloudy",meta:"27°"},{id:"weather-4",title:"Night",description:"Calm",meta:"25°"}],travel:[{id:"trip-1",title:"Arrival",description:"Check in and establish base",meta:"Day 1"},{id:"trip-2",title:"Primary route",description:"Top locations by proximity",meta:"Day 2"},{id:"trip-3",title:"Local discovery",description:"Flexible exploration window",meta:"Day 3"}],news:[{id:"news-1",title:"Top signal",description:"Latest verified development",meta:"Now"},{id:"news-2",title:"Context",description:"Why this event matters",meta:"Analysis"},{id:"news-3",title:"Watch next",description:"Signals likely to change",meta:"Monitor"}],shopping:[{id:"shop-1",title:"Best overall",description:"Strong balance of price and capability",meta:"Recommended"},{id:"shop-2",title:"Best value",description:"Core features at lower cost",meta:"Value"},{id:"shop-3",title:"Premium",description:"Maximum capability and support",meta:"High-end"}],code:[{id:"code-1",title:"Implementation",description:"Primary code path",meta:"TSX"},{id:"code-2",title:"Validation",description:"Type and runtime checks",meta:"TEST"}],files:[{id:"file-1",title:"Mission Assets",description:"/workspace/mission-assets",meta:"12 files"},{id:"file-2",title:"Research Archive",description:"/knowledge/research",meta:"2.4 GB"},{id:"file-3",title:"Generated Media",description:"/outputs/media",meta:"38 items"},{id:"file-4",title:"System Logs",description:"/runtime/logs",meta:"Live"}],document:[{id:"doc-1",title:"Executive summary",description:"Decision-ready overview and key outcome",meta:"01"},{id:"doc-2",title:"Evidence",description:"Sources, observations and supporting details",meta:"02"},{id:"doc-3",title:"Recommendations",description:"Prioritized next actions with owners",meta:"03"}],pdf:[{id:"pdf-1",title:"Page 01",description:"Cover, abstract and document metadata",meta:"1/12"},{id:"pdf-2",title:"Key findings",description:"Highlighted passages and extracted claims",meta:"4/12"},{id:"pdf-3",title:"References",description:"Linked citations and source appendix",meta:"12/12"}],notes:[{id:"note-1",title:"Capture",description:"Fast ideas waiting to be organized",meta:"Pinned"},{id:"note-2",title:"Project memory",description:"Decisions, preferences and constraints",meta:"Linked"},{id:"note-3",title:"Next questions",description:"Unknowns worth investigating",meta:"Open"}],inbox:[{id:"mail-1",title:"Mission update",description:"New evidence is ready for review",meta:"Now"},{id:"mail-2",title:"Approval requested",description:"Workflow is waiting at a safe checkpoint",meta:"Priority"},{id:"mail-3",title:"Daily digest",description:"7 signals summarized by Jarvis",meta:"08:30"}],audio:[{id:"audio-1",title:"Focus Protocol",description:"Ambient command-center soundscape",meta:"04:18"},{id:"audio-2",title:"Voice Memo 07",description:"Captured idea with auto transcript",meta:"01:42"},{id:"audio-3",title:"System Theme",description:"J-Core interface audio profile",meta:"02:56"}],podcast:[{id:"pod-1",title:"Agentic systems",description:"How AI workspaces become durable operating systems",meta:"28 min"},{id:"pod-2",title:"Interface intelligence",description:"Designing calm, high-density command centers",meta:"41 min"},{id:"pod-3",title:"Local-first future",description:"Ownership, memory and resilient tools",meta:"35 min"}],feed:[{id:"feed-1",title:"Signals worth knowing",description:"Five verified developments selected for relevance",meta:"Briefing"},{id:"feed-2",title:"Creative radar",description:"Interfaces, media and ideas gaining momentum",meta:"Culture"},{id:"feed-3",title:"Deep read",description:"One long-form source with Jarvis annotations",meta:"12 min"},{id:"feed-4",title:"Watch queue",description:"Three videos grouped into a single learning path",meta:"Playlist"}],finance:[{id:"fin-1",title:"Available budget",description:"Current operating envelope",meta:"72%"},{id:"fin-2",title:"Monthly spend",description:"Tools, APIs and subscriptions",meta:"18.4M"},{id:"fin-3",title:"Market watch",description:"Tracked instruments with notable movement",meta:"+3.8%"},{id:"fin-4",title:"Forecast",description:"Projected runway at current velocity",meta:"9 mo"}],automation:[{id:"auto-1",title:"Signal detected",description:"A scheduled or external event starts the run",meta:"TRIGGER"},{id:"auto-2",title:"Jarvis reasons",description:"Context is enriched and a route is selected",meta:"AGENT"},{id:"auto-3",title:"Tools execute",description:"Approved actions run with observable state",meta:"ACTION"},{id:"auto-4",title:"Human checkpoint",description:"High-impact output waits for confirmation",meta:"REVIEW"}],monitor:[{id:"sys-1",title:"CPU load",description:"8 logical processors",meta:"34%"},{id:"sys-2",title:"Memory",description:"Working set across active modules",meta:"61%"},{id:"sys-3",title:"Network",description:"Gateway round-trip latency",meta:"142ms"},{id:"sys-4",title:"Services",description:"7 of 8 modules responding",meta:"87%"}],terminal:[{id:"term-1",title:"jcore status --all",description:"Inspect core services and active routes",meta:"READY"},{id:"term-2",title:"hub list --running",description:"Show live workspace surfaces",meta:"02"},{id:"term-3",title:"agent trace --latest",description:"Read the newest execution trace",meta:"LOG"}]}[e]??[]}function Dn({kind:e}){const t={web:n.jsxs(n.Fragment,{children:[n.jsx("circle",{cx:"12",cy:"12",r:"9"}),n.jsx("path",{d:"M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"})]}),video:n.jsxs(n.Fragment,{children:[n.jsx("rect",{x:"3",y:"5",width:"18",height:"14",rx:"2"}),n.jsx("path",{d:"m10 9 5 3-5 3Z"})]}),map:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z"}),n.jsx("path",{d:"M9 3v15M15 6v15"})]}),places:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"}),n.jsx("circle",{cx:"12",cy:"10",r:"2.5"})]}),images:n.jsxs(n.Fragment,{children:[n.jsx("rect",{x:"3",y:"4",width:"18",height:"16",rx:"2"}),n.jsx("circle",{cx:"9",cy:"9",r:"2"}),n.jsx("path",{d:"m3 17 5-5 4 4 3-3 6 6"})]}),mindmap:n.jsxs(n.Fragment,{children:[n.jsx("circle",{cx:"12",cy:"12",r:"3"}),n.jsx("circle",{cx:"4",cy:"5",r:"2"}),n.jsx("circle",{cx:"20",cy:"5",r:"2"}),n.jsx("circle",{cx:"4",cy:"19",r:"2"}),n.jsx("circle",{cx:"20",cy:"19",r:"2"}),n.jsx("path",{d:"m6 6 4 4m4 0 4-4M6 18l4-4m4 0 4 4"})]}),diagram:n.jsxs(n.Fragment,{children:[n.jsx("rect",{x:"8",y:"2",width:"8",height:"5",rx:"1"}),n.jsx("rect",{x:"2",y:"17",width:"8",height:"5",rx:"1"}),n.jsx("rect",{x:"14",y:"17",width:"8",height:"5",rx:"1"}),n.jsx("path",{d:"M12 7v5M6 17v-5h12v5"})]}),text:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"M6 3h8l4 4v14H6Z"}),n.jsx("path",{d:"M14 3v5h5M9 12h6M9 16h6"})]}),dashboard:n.jsxs(n.Fragment,{children:[n.jsx("rect",{x:"3",y:"3",width:"8",height:"8",rx:"1"}),n.jsx("rect",{x:"13",y:"3",width:"8",height:"5",rx:"1"}),n.jsx("rect",{x:"13",y:"10",width:"8",height:"11",rx:"1"}),n.jsx("rect",{x:"3",y:"13",width:"8",height:"8",rx:"1"})]}),chart:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"M4 20V10M10 20V4M16 20v-7M22 20H2"}),n.jsx("path",{d:"m3 7 6-4 6 6 6-5"})]}),table:n.jsxs(n.Fragment,{children:[n.jsx("rect",{x:"3",y:"4",width:"18",height:"16",rx:"1"}),n.jsx("path",{d:"M3 9h18M3 14h18M9 4v16M15 4v16"})]}),compare:n.jsx(n.Fragment,{children:n.jsx("path",{d:"M8 4 4 8l4 4M4 8h8M16 12l4 4-4 4M20 16h-8"})}),timeline:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"M7 3v18M7 6h11M7 12h8M7 18h11"}),n.jsx("circle",{cx:"7",cy:"6",r:"2"}),n.jsx("circle",{cx:"7",cy:"12",r:"2"}),n.jsx("circle",{cx:"7",cy:"18",r:"2"})]}),tasks:n.jsxs(n.Fragment,{children:[n.jsx("rect",{x:"3",y:"4",width:"18",height:"16",rx:"2"}),n.jsx("path",{d:"m7 9 2 2 4-4M7 16h2M12 16h5"})]}),calendar:n.jsxs(n.Fragment,{children:[n.jsx("rect",{x:"3",y:"5",width:"18",height:"16",rx:"2"}),n.jsx("path",{d:"M8 3v4M16 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"})]}),weather:n.jsxs(n.Fragment,{children:[n.jsx("circle",{cx:"8",cy:"8",r:"3"}),n.jsx("path",{d:"M8 2v2M8 12v2M2 8h2M12 8h2M4 4l1.5 1.5M10.5 10.5 12 12"}),n.jsx("path",{d:"M8 18h10a3 3 0 0 0 0-6 5 5 0 0 0-9.5 1.8A2.5 2.5 0 0 0 8 18Z"})]}),travel:n.jsx(n.Fragment,{children:n.jsx("path",{d:"M3 17h18M5 17l2-9h10l2 9M9 8V5h6v3M8 12h8"})}),shopping:n.jsx(n.Fragment,{children:n.jsx("path",{d:"M6 7h15l-2 8H8L6 3H3M9 20h.01M18 20h.01"})}),news:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"M5 4h14v16H5Z"}),n.jsx("path",{d:"M8 8h8M8 12h8M8 16h5"})]}),code:n.jsx(n.Fragment,{children:n.jsx("path",{d:"m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"})}),files:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"M3 6h7l2 2h9v11H3Z"}),n.jsx("path",{d:"M3 6V4h7l2 2"})]}),document:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"M6 3h8l4 4v14H6Z"}),n.jsx("path",{d:"M14 3v5h5M9 12h6M9 16h6"})]}),pdf:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"M6 3h8l4 4v14H6Z"}),n.jsx("path",{d:"M14 3v5h5M8.5 16v-4h2a1.5 1.5 0 0 1 0 3h-2m5 1v-4h1.5a2 2 0 0 1 0 4Z"})]}),notes:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"M5 4h14v16H5Z"}),n.jsx("path",{d:"M8 8h8M8 12h8M8 16h5M15 18l5-5"})]}),inbox:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"M4 5h16v14H4Z"}),n.jsx("path",{d:"m4 7 8 6 8-6M4 15h5l2 2h2l2-2h5"})]}),audio:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"M9 18V5l10-2v13"}),n.jsx("circle",{cx:"6",cy:"18",r:"3"}),n.jsx("circle",{cx:"16",cy:"16",r:"3"})]}),podcast:n.jsxs(n.Fragment,{children:[n.jsx("circle",{cx:"12",cy:"9",r:"3"}),n.jsx("path",{d:"M7 9a5 5 0 0 1 10 0M4 9a8 8 0 0 1 16 0M10 13l-1 8h6l-1-8"})]}),feed:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"M5 4h14v16H5Z"}),n.jsx("path",{d:"M8 8h8M8 12h5M8 16h7"}),n.jsx("circle",{cx:"17",cy:"12",r:"1"})]}),finance:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"M4 20V10M10 20V4M16 20v-7M22 20H2"}),n.jsx("path",{d:"m3 8 6-4 6 5 6-6"})]}),automation:n.jsxs(n.Fragment,{children:[n.jsx("circle",{cx:"6",cy:"6",r:"3"}),n.jsx("circle",{cx:"18",cy:"18",r:"3"}),n.jsx("path",{d:"M9 6h5a4 4 0 0 1 4 4v5M15 18h-5a4 4 0 0 1-4-4V9"})]}),monitor:n.jsxs(n.Fragment,{children:[n.jsx("rect",{x:"3",y:"4",width:"18",height:"14",rx:"2"}),n.jsx("path",{d:"M8 21h8M12 18v3M6 12h3l2-5 3 9 2-4h2"})]}),terminal:n.jsxs(n.Fragment,{children:[n.jsx("rect",{x:"3",y:"4",width:"18",height:"16",rx:"2"}),n.jsx("path",{d:"m7 9 3 3-3 3M12 16h5"})]})};return n.jsx("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:t[e]})}function Ya({artifact:e}){const t=[["ROUTE","Đã chọn đúng Hub"],["SOURCE","Đang truy vấn nguồn phù hợp"],["SYNTHESIS","Đang dựng giao diện kết quả"]];return n.jsxs("section",{className:"dynamic-hub-loading","aria-live":"polite",children:[n.jsxs("div",{className:"hub-loader-core",children:[n.jsx("i",{}),n.jsx("i",{}),n.jsx("b",{})]}),n.jsxs("div",{children:[n.jsx("span",{children:"JARVIS ORCHESTRATION"}),n.jsxs("h2",{children:["Đang dựng ",Fn(e.kind).label," Hub"]}),n.jsx("p",{children:e.query})]}),n.jsx("ol",{children:t.map(([i,a],s)=>n.jsxs("li",{className:s===0?"complete":s===1?"active":"",children:[n.jsx("b",{children:String(s+1).padStart(2,"0")}),n.jsxs("span",{children:[i,n.jsx("small",{children:a})]})]},i))})]})}function nn({artifact:e}){return n.jsxs("article",{className:"hub-intel-summary",children:[n.jsx("span",{children:"JARVIS SYNTHESIS"}),n.jsx("p",{children:e.summary||"Hub đã sẵn sàng."})]})}function Ti({artifact:e}){const t=encodeURIComponent(Ci(e)),i=e.kind==="video"?[["YouTube",`https://www.youtube.com/results?search_query=${t}`],["Google Video",`https://www.google.com/search?tbm=vid&q=${t}`]]:e.kind==="images"?[["Google Images",`https://www.google.com/search?tbm=isch&q=${t}`],["Bing Images",`https://www.bing.com/images/search?q=${t}`]]:e.kind==="news"?[["Google News",`https://news.google.com/search?q=${t}`],["Bing News",`https://www.bing.com/news/search?q=${t}`]]:e.kind==="shopping"?[["Google Shopping",`https://www.google.com/search?tbm=shop&q=${t}`],["Bing Shopping",`https://www.bing.com/shop?q=${t}`]]:e.kind==="travel"?[["Google Travel",`https://www.google.com/travel/search?q=${t}`],["Google Maps",`https://www.google.com/maps/search/${t}`]]:e.kind==="audio"?[["YouTube Music",`https://music.youtube.com/search?q=${t}`],["SoundCloud",`https://soundcloud.com/search?q=${t}`]]:e.kind==="podcast"?[["Spotify Podcasts",`https://open.spotify.com/search/${t}/podcastsAndEpisodes`],["YouTube",`https://www.youtube.com/results?search_query=${t}+podcast`]]:e.kind==="feed"?[["Google News",`https://news.google.com/search?q=${t}`],["Bing",`https://www.bing.com/search?q=${t}`]]:e.kind==="finance"?[["Google Finance",`https://www.google.com/finance/beta?q=${t}`],["Market Search",`https://www.google.com/search?q=${t}+market`]]:[["Google",`https://www.google.com/search?q=${t}`],["Bing",`https://www.bing.com/search?q=${t}`]];return n.jsx("div",{className:"hub-source-launchers",children:i.map(([a,s])=>n.jsxs("a",{href:s,target:"_blank",rel:"noopener noreferrer",children:[n.jsx(Dn,{kind:e.kind}),n.jsxs("span",{children:[a,n.jsx("small",{children:"Mở nguồn trực tiếp"})]}),n.jsx("b",{children:"↗"})]},a))})}function Wa({artifact:e}){return e.items.length?n.jsx("div",{className:`hub-results-grid ${e.kind}`,children:e.items.map((t,i)=>n.jsxs("a",{href:t.url||"#",target:t.url?"_blank":void 0,rel:t.url?"noopener noreferrer":void 0,onClick:a=>{t.url||a.preventDefault()},children:[t.image&&n.jsx("img",{src:t.image,alt:"",loading:"lazy"}),n.jsx("span",{children:String(i+1).padStart(2,"0")}),n.jsx("b",{children:t.title}),t.description&&n.jsx("p",{children:t.description}),t.meta&&n.jsx("small",{children:t.meta})]},t.id))}):n.jsx(Ti,{artifact:e})}function Za({artifact:e}){const t=Ci(e),i=`https://www.google.com/maps?q=${encodeURIComponent(t)}&output=embed`;return n.jsxs("div",{className:"hub-map-layout",children:[n.jsxs("div",{className:"hub-map-frame",children:[n.jsxs("div",{children:[n.jsx("span",{children:"LIVE CARTOGRAPHY"}),n.jsx("b",{children:"MAP://ACTIVE"})]}),n.jsx("iframe",{title:`Bản đồ ${e.query}`,src:i,loading:"lazy",referrerPolicy:"no-referrer-when-downgrade"})]}),n.jsx(nn,{artifact:e})]})}function Xa({artifact:e}){const t=o.useMemo(()=>e.items.length?e.items.map(i=>i.title):Ni(e.summary||e.query),[e]);return e.kind==="mindmap"?n.jsxs("div",{className:"hub-mindmap",style:{"--nodes":Math.max(t.length,1)},children:[n.jsxs("div",{className:"hub-mindmap-core",children:[n.jsx("span",{children:"CORE IDEA"}),n.jsx("b",{children:e.title})]}),t.map((i,a)=>n.jsxs("div",{className:"hub-mindmap-node",style:{"--index":a},children:[n.jsx("i",{}),n.jsx("span",{children:i})]},`${i}-${a}`))]}):n.jsx("div",{className:"hub-diagram",children:t.map((i,a)=>n.jsxs("div",{className:"hub-diagram-step",children:[n.jsx("span",{children:String(a+1).padStart(2,"0")}),n.jsx("b",{children:i}),a<t.length-1&&n.jsx("i",{"aria-hidden":"true",children:"→"})]},`${i}-${a}`))})}function li({artifact:e}){return n.jsxs("div",{className:"hub-dashboard-view",children:[n.jsx("div",{className:"hub-metric-grid",children:e.items.map((t,i)=>{const a=Number.parseFloat(t.meta||""),s=Number.isFinite(a)?Math.min(100,Math.max(8,a)):42+i*17%48;return n.jsxs("article",{children:[n.jsxs("span",{children:["METRIC ",String(i+1).padStart(2,"0")]}),n.jsx("b",{children:t.meta||"—"}),n.jsx("h3",{children:t.title}),n.jsx("p",{children:t.description}),n.jsx("div",{"aria-label":`${t.title}: ${t.meta||"không có dữ liệu"}`,children:n.jsx("i",{style:{width:`${s}%`}})})]},t.id)})}),n.jsx(nn,{artifact:e})]})}function Qa({artifact:e}){const t=e.items.map(a=>Number.parseFloat(a.meta||"")||0),i=Math.max(...t,1);return n.jsxs("div",{className:"hub-chart-view",children:[n.jsx("div",{className:"hub-bar-chart",role:"img","aria-label":`Biểu đồ ${e.title}`,children:e.items.map((a,s)=>n.jsxs("div",{children:[n.jsx("span",{children:a.meta||"0"}),n.jsx("i",{style:{height:`${Math.max(8,t[s]/i*100)}%`}}),n.jsx("b",{children:a.title})]},a.id))}),n.jsx("div",{className:"hub-chart-legend","aria-label":"Dữ liệu biểu đồ",children:e.items.map(a=>n.jsxs("span",{children:[n.jsx("i",{}),a.title,n.jsx("b",{children:a.meta})]},a.id))}),n.jsx(nn,{artifact:e})]})}function nr({artifact:e}){return n.jsxs("div",{className:"hub-table-view",children:[n.jsx("div",{className:"hub-table-scroll",children:n.jsxs("table",{children:[n.jsx("caption",{children:e.title}),n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx("th",{scope:"col",children:"ID"}),n.jsx("th",{scope:"col",children:"Mục"}),n.jsx("th",{scope:"col",children:"Chi tiết"}),n.jsx("th",{scope:"col",children:"Trạng thái"})]})}),n.jsx("tbody",{children:e.items.map((t,i)=>n.jsxs("tr",{children:[n.jsx("td",{children:String(i+1).padStart(2,"0")}),n.jsx("th",{scope:"row",children:t.title}),n.jsx("td",{children:t.description||"—"}),n.jsx("td",{children:n.jsx("span",{children:t.meta||"Ready"})})]},t.id))})]})}),n.jsx(nn,{artifact:e})]})}function er({artifact:e}){return n.jsxs("div",{className:"hub-compare-view",children:[n.jsx("div",{className:"hub-compare-grid",children:e.items.map((t,i)=>{const a=Math.min(100,Math.max(10,Number.parseFloat(t.meta||"")||70+i*7));return n.jsxs("article",{children:[n.jsxs("span",{children:["OPTION ",String.fromCharCode(65+i)]}),n.jsx("h3",{children:t.title}),n.jsx("b",{children:t.meta||`${a}%`}),n.jsx("p",{children:t.description}),n.jsx("div",{children:n.jsx("i",{style:{width:`${a}%`}})})]},t.id)})}),n.jsx(nn,{artifact:e})]})}function di({artifact:e,travel:t=!1}){return n.jsxs("div",{className:`hub-timeline-view ${t?"travel":""}`,children:[n.jsx("ol",{children:e.items.map((i,a)=>n.jsxs("li",{children:[n.jsx("i",{children:n.jsx("b",{children:String(a+1).padStart(2,"0")})}),n.jsxs("div",{children:[n.jsx("span",{children:i.meta||`T+${a}`}),n.jsx("h3",{children:i.title}),n.jsx("p",{children:i.description})]})]},i.id))}),n.jsx(nn,{artifact:e})]})}function tr({artifact:e}){const[t,i]=o.useState(()=>new Set),a=s=>i(p=>{const c=new Set(p);return c.has(s)?c.delete(s):c.add(s),c});return n.jsxs("div",{className:"hub-tasks-view",children:[n.jsxs("header",{children:[n.jsx("span",{children:"MISSION PROGRESS"}),n.jsxs("b",{children:[t.size,"/",e.items.length]}),n.jsx("progress",{value:t.size,max:Math.max(e.items.length,1)})]}),n.jsx("div",{children:e.items.map((s,p)=>n.jsxs("button",{type:"button","aria-pressed":t.has(s.id),onClick:()=>a(s.id),children:[n.jsx("i",{children:t.has(s.id)?"OK":String(p+1).padStart(2,"0")}),n.jsxs("span",{children:[n.jsx("b",{children:s.title}),n.jsx("small",{children:s.description})]}),n.jsx("em",{children:t.has(s.id)?"DONE":s.meta||"QUEUED"})]},s.id))}),n.jsx(nn,{artifact:e})]})}function ir({artifact:e}){const t=Array.from({length:7},(i,a)=>{const s=new Date;return s.setDate(s.getDate()+a),s});return n.jsxs("div",{className:"hub-calendar-view",children:[n.jsx("div",{className:"hub-week-strip",children:t.map((i,a)=>n.jsxs("div",{className:a===0?"active":"",children:[n.jsx("span",{children:new Intl.DateTimeFormat("vi-VN",{weekday:"short"}).format(i)}),n.jsx("b",{children:i.getDate()})]},i.toISOString()))}),n.jsx("div",{className:"hub-agenda",children:e.items.map(i=>n.jsxs("article",{children:[n.jsx("time",{children:i.meta||"TBD"}),n.jsx("i",{}),n.jsxs("span",{children:[n.jsx("b",{children:i.title}),n.jsx("small",{children:i.description})]})]},i.id))}),n.jsx(nn,{artifact:e})]})}function ar({artifact:e}){var t,i;return e.items.length?n.jsxs("div",{className:"hub-weather-view",children:[n.jsxs("div",{className:"hub-weather-hero",children:[n.jsx("span",{children:"LOCAL ATMOSPHERE"}),n.jsx("b",{children:(t=e.items[0])==null?void 0:t.meta}),n.jsx("h3",{children:e.title}),n.jsx("p",{children:(i=e.items[0])==null?void 0:i.description})]}),n.jsx("div",{className:"hub-forecast-grid",children:e.items.map((a,s)=>n.jsxs("article",{children:[n.jsx("span",{children:a.title}),n.jsx("i",{className:`weather-glyph phase-${s%4}`}),n.jsx("b",{children:a.meta}),n.jsx("p",{children:a.description})]},a.id))}),n.jsx(nn,{artifact:e})]}):n.jsxs("div",{className:"dynamic-hub-result",children:[n.jsx(nn,{artifact:e}),n.jsx(Ti,{artifact:e})]})}function rr({artifact:e}){var a,s,p;const t=(a=e.summary)==null?void 0:a.match(/```(?:[\w+-]+)?\s*([\s\S]*?)```/),i=((s=t==null?void 0:t[1])==null?void 0:s.trim())||`// ${e.title}
// Jarvis is ready to render structured code output here.`;return n.jsxs("div",{className:"hub-code-view",children:[n.jsxs("header",{children:[n.jsx("span",{children:"CODE://READ-ONLY"}),n.jsx("b",{children:((p=e.items[0])==null?void 0:p.meta)||"SOURCE"})]}),n.jsx("pre",{children:n.jsx("code",{children:i})}),n.jsx(nn,{artifact:e})]})}function or({artifact:e}){return n.jsxs("div",{className:"hub-files-view",children:[n.jsxs("header",{children:[n.jsx("span",{children:"LOCAL://WORKSPACE"}),n.jsxs("b",{children:[e.items.length," MOUNTS"]})]}),n.jsxs("div",{className:"hub-file-layout",children:[n.jsxs("aside",{"aria-label":"Vị trí nhanh",children:[n.jsx("button",{type:"button",className:"active",children:"Không gian làm việc"}),n.jsx("button",{type:"button",children:"Gần đây"}),n.jsx("button",{type:"button",children:"Được chia sẻ"}),n.jsx("button",{type:"button",children:"Lưu trữ"})]}),n.jsx("div",{className:"hub-file-list",children:e.items.map((t,i)=>n.jsxs("button",{type:"button",children:[n.jsx("i",{children:n.jsx(Dn,{kind:i%3===0?"files":i%3===1?"document":"images"})}),n.jsxs("span",{children:[n.jsx("b",{children:t.title}),n.jsx("small",{children:t.description})]}),n.jsx("em",{children:t.meta||"LOCAL"})]},t.id))})]}),n.jsxs("div",{className:"hub-storage-meter",children:[n.jsx("span",{children:"LƯU TRỮ CỤC BỘ"}),n.jsx("i",{children:n.jsx("b",{})}),n.jsx("em",{children:"CÒN TRỐNG 68%"})]}),n.jsx(nn,{artifact:e})]})}function sr({artifact:e}){var s;const[t,i]=o.useState(((s=e.items[0])==null?void 0:s.id)||""),a=e.items.find(p=>p.id===t)??e.items[0];return n.jsxs("div",{className:`hub-document-view ${e.kind}`,children:[n.jsxs("aside",{"aria-label":"Mục lục tài liệu",children:[n.jsx("span",{children:e.kind==="pdf"?"PAGE INDEX":e.kind==="notes"?"NOTE STACK":"DOCUMENT MAP"}),e.items.map((p,c)=>n.jsxs("button",{type:"button",className:p.id===(a==null?void 0:a.id)?"active":"",onClick:()=>i(p.id),children:[n.jsx("i",{children:String(c+1).padStart(2,"0")}),n.jsx("span",{children:p.title})]},p.id))]}),n.jsxs("article",{children:[n.jsxs("header",{children:[n.jsxs("span",{children:[e.kind.toUpperCase(),"://READ MODE"]}),n.jsx("b",{children:(a==null?void 0:a.meta)||"READY"})]}),n.jsx("h2",{children:(a==null?void 0:a.title)||e.title}),n.jsx("p",{children:(a==null?void 0:a.description)||e.summary}),n.jsxs("div",{className:"hub-document-lines","aria-hidden":"true",children:[n.jsx("i",{}),n.jsx("i",{}),n.jsx("i",{}),n.jsx("i",{}),n.jsx("i",{})]}),n.jsx("blockquote",{children:e.summary||"Jarvis sẽ đặt nội dung, trích dẫn và ghi chú ngữ cảnh tại bề mặt đọc này."})]})]})}function cr({artifact:e}){var s,p;const[t,i]=o.useState(((s=e.items[0])==null?void 0:s.id)||""),a=e.items.find(c=>c.id===t)??e.items[0];return n.jsxs("div",{className:"hub-inbox-view",children:[n.jsxs("div",{className:"hub-message-list",children:[n.jsxs("header",{children:[n.jsx("span",{children:"PRIORITY INBOX"}),n.jsx("b",{children:e.items.length})]}),e.items.map(c=>n.jsxs("button",{type:"button",className:c.id===(a==null?void 0:a.id)?"active":"",onClick:()=>i(c.id),children:[n.jsx("i",{children:c.title.slice(0,1)}),n.jsxs("span",{children:[n.jsx("b",{children:c.title}),n.jsx("small",{children:c.description})]}),n.jsx("em",{children:c.meta})]},c.id))]}),n.jsxs("article",{className:"hub-message-reader",children:[n.jsxs("span",{children:["MESSAGE://",((p=a==null?void 0:a.meta)==null?void 0:p.toUpperCase())||"OPEN"]}),n.jsx("h2",{children:(a==null?void 0:a.title)||e.title}),n.jsx("p",{children:a==null?void 0:a.description}),n.jsx("div",{children:e.summary||"Jarvis đã phân loại nội dung này theo độ khẩn cấp và mức liên quan với nhiệm vụ hiện tại."}),n.jsx("button",{type:"button",children:"Đánh dấu đã xử lý"})]})]})}function lr({artifact:e}){var s;const[t,i]=o.useState(((s=e.items[0])==null?void 0:s.id)||""),a=e.items.find(p=>p.id===t)??e.items[0];return n.jsxs("div",{className:`hub-media-view ${e.kind}`,children:[n.jsxs("section",{className:"hub-now-playing",children:[n.jsxs("div",{className:"hub-media-disc",children:[n.jsx("i",{}),n.jsx("b",{children:e.kind==="podcast"?"POD":"J"})]}),n.jsx("span",{children:"NOW PLAYING"}),n.jsx("h2",{children:(a==null?void 0:a.title)||e.title}),n.jsx("p",{children:a==null?void 0:a.description}),n.jsx("div",{className:"hub-waveform","aria-label":"Dạng sóng âm thanh",children:Array.from({length:36},(p,c)=>n.jsx("i",{style:{height:`${20+c*17%75}%`}},c))}),n.jsxs("footer",{children:[n.jsx("button",{type:"button","aria-label":"Lùi 15 giây",children:"−15"}),n.jsx("button",{type:"button",className:"primary","aria-label":"Phát hoặc tạm dừng",children:t?"PAUSE":"PLAY"}),n.jsx("button",{type:"button","aria-label":"Tiến 15 giây",children:"+15"})]})]}),n.jsxs("aside",{className:"hub-media-queue",children:[n.jsxs("header",{children:[n.jsx("span",{children:"UP NEXT"}),n.jsx("b",{children:e.items.length})]}),e.items.map((p,c)=>n.jsxs("button",{type:"button",className:p.id===(a==null?void 0:a.id)?"active":"",onClick:()=>i(p.id),children:[n.jsx("i",{children:String(c+1).padStart(2,"0")}),n.jsxs("span",{children:[n.jsx("b",{children:p.title}),n.jsx("small",{children:p.description})]}),n.jsx("em",{children:p.meta})]},p.id))]})]})}function dr({artifact:e}){return n.jsxs("div",{className:"hub-feed-view",children:[n.jsxs("header",{children:[n.jsx("span",{children:"PERSONAL SIGNAL FEED"}),n.jsx("b",{children:"CURATED BY JARVIS"})]}),n.jsx("div",{children:e.items.map((t,i)=>n.jsxs("article",{className:i===0?"featured":"",children:[n.jsx("span",{children:t.meta||`SIGNAL ${i+1}`}),n.jsx("h3",{children:t.title}),n.jsx("p",{children:t.description}),n.jsxs("footer",{children:[n.jsx("i",{children:String(i+1).padStart(2,"0")}),n.jsx("button",{type:"button",children:"Mở nội dung"})]})]},t.id))}),n.jsx(nn,{artifact:e})]})}function pr({artifact:e}){return n.jsxs("div",{className:"hub-automation-view",children:[n.jsxs("header",{children:[n.jsx("span",{children:"WORKFLOW://LIVE BLUEPRINT"}),n.jsxs("b",{children:[e.items.length," NODES"]})]}),n.jsx("div",{className:"hub-workflow-track",children:e.items.map((t,i)=>n.jsxs("article",{children:[n.jsx("i",{children:n.jsx(Dn,{kind:i===0?"automation":i===e.items.length-1?"tasks":"diagram"})}),n.jsx("span",{children:t.meta||`NODE ${i+1}`}),n.jsx("h3",{children:t.title}),n.jsx("p",{children:t.description}),i<e.items.length-1&&n.jsx("b",{"aria-hidden":"true",children:"→"})]},t.id))}),n.jsx(nn,{artifact:e})]})}function hr({artifact:e}){return n.jsxs("div",{className:"hub-finance-view",children:[n.jsxs("header",{children:[n.jsx("span",{children:"FINANCIAL OPERATING PICTURE"}),n.jsx("b",{children:"LIVE MODEL"})]}),n.jsx("div",{className:"hub-finance-grid",children:e.items.map((t,i)=>n.jsxs("article",{children:[n.jsx("span",{children:t.title}),n.jsx("b",{children:t.meta}),n.jsx("p",{children:t.description}),n.jsx("i",{className:i%3===1?"down":"up",children:i%3===1?"−1.2%":`+${2+i}.4%`})]},t.id))}),n.jsx("div",{className:"hub-finance-chart",role:"img","aria-label":"Biểu đồ xu hướng tài chính",children:n.jsx("svg",{viewBox:"0 0 100 28",preserveAspectRatio:"none",children:n.jsx("polyline",{points:"0,23 12,19 25,21 38,12 50,15 62,7 75,10 88,4 100,6"})})}),n.jsx(nn,{artifact:e})]})}function gr({artifact:e}){return n.jsxs("div",{className:"hub-terminal-view",children:[n.jsxs("header",{children:[n.jsx("span",{children:"J-CORE TERMINAL"}),n.jsx("b",{children:"SESSION 01"})]}),n.jsx("pre",{children:n.jsxs("code",{children:[n.jsx("i",{children:"jarvis@core:~$"})," ",e.query||"jcore status --all",`
`,e.items.map(t=>`[${t.meta||"OK"}] ${t.title}
    ${t.description||"ready"}`).join(`
`),`
`,n.jsx("i",{children:"jarvis@core:~$"})," ",n.jsx("b",{"aria-hidden":"true",children:"▋"})]})}),n.jsx(nn,{artifact:e})]})}function ur({artifact:e}){return e.status==="loading"?n.jsx(Ya,{artifact:e}):e.status==="error"?n.jsxs("section",{className:"dynamic-hub-error",children:[n.jsx("span",{children:"LINK INTERRUPTED"}),n.jsx("h2",{children:"Không thể hoàn tất Hub"}),n.jsx("p",{children:e.error})]}):e.kind==="map"?n.jsx(Za,{artifact:e}):e.kind==="mindmap"||e.kind==="diagram"?n.jsx(Xa,{artifact:e}):e.kind==="dashboard"?n.jsx(li,{artifact:e}):e.kind==="chart"?n.jsx(Qa,{artifact:e}):e.kind==="table"?n.jsx(nr,{artifact:e}):e.kind==="compare"?n.jsx(er,{artifact:e}):e.kind==="timeline"?n.jsx(di,{artifact:e}):e.kind==="travel"&&e.items.length?n.jsx(di,{artifact:e,travel:!0}):e.kind==="tasks"?n.jsx(tr,{artifact:e}):e.kind==="calendar"?n.jsx(ir,{artifact:e}):e.kind==="weather"?n.jsx(ar,{artifact:e}):e.kind==="code"?n.jsx(rr,{artifact:e}):e.kind==="files"?n.jsx(or,{artifact:e}):e.kind==="document"||e.kind==="pdf"||e.kind==="notes"?n.jsx(sr,{artifact:e}):e.kind==="inbox"?n.jsx(cr,{artifact:e}):e.kind==="audio"||e.kind==="podcast"?n.jsx(lr,{artifact:e}):e.kind==="feed"?n.jsx(dr,{artifact:e}):e.kind==="automation"?n.jsx(pr,{artifact:e}):e.kind==="monitor"?n.jsx(li,{artifact:e}):e.kind==="finance"?n.jsx(hr,{artifact:e}):e.kind==="terminal"?n.jsx(gr,{artifact:e}):n.jsxs("div",{className:"dynamic-hub-result",children:[n.jsx(nn,{artifact:e}),e.kind!=="text"&&n.jsx(Wa,{artifact:e})]})}const xr=[["intel","TÌNH BÁO"],["spatial","THẾ GIỚI & KHÔNG GIAN"],["planning","KẾ HOẠCH"],["workspace","BỘ CÔNG CỤ LÀM VIỆC"],["data","HỆ DỮ LIỆU"],["media","TRUYỀN THÔNG"],["creation","PHÒNG SÁNG TẠO"],["system","LÕI HỆ THỐNG"]],pi=["web","files","tasks","feed","audio","automation"];function mr({artifacts:e,activeId:t,onSelect:i,onCreateDemo:a,onRemove:s}){const[p,c]=o.useState(!1),[m,u]=o.useState(""),v=o.useRef(null),h=e.find(d=>d.id===t)??e[0]??null,x=o.useMemo(()=>{const d=m.trim().toLocaleLowerCase("vi-VN");return d?In.filter(l=>`${l.label} ${l.description} ${l.code}`.toLocaleLowerCase("vi-VN").includes(d)):In},[m]),y=d=>{a(d),c(!1),u("")};return o.useEffect(()=>{p&&window.setTimeout(()=>{var d;return(d=v.current)==null?void 0:d.focus()},80)},[p]),o.useEffect(()=>{const d=l=>{l.key==="/"&&!(l.target instanceof HTMLInputElement)&&!(l.target instanceof HTMLTextAreaElement)&&(l.preventDefault(),c(!0)),l.key==="Escape"&&p&&c(!1)};return window.addEventListener("keydown",d),()=>window.removeEventListener("keydown",d)},[p]),n.jsxs("div",{className:"dynamic-hub-shell",children:[n.jsxs("header",{className:"dynamic-hub-toolbar",children:[n.jsx("div",{className:"dynamic-hub-tabs",role:"tablist","aria-label":"Các Hub đang mở",children:e.map(d=>n.jsxs("button",{type:"button",role:"tab","aria-selected":d.id===(h==null?void 0:h.id),className:d.id===(h==null?void 0:h.id)?"active":"",onClick:()=>i(d.id),children:[n.jsx(Dn,{kind:d.kind}),n.jsx("span",{children:Fn(d.kind).label}),n.jsx("i",{className:d.status}),n.jsx("b",{role:"button",tabIndex:0,"aria-label":`Đóng ${d.title}`,onClick:l=>{l.stopPropagation(),s(d.id)},onKeyDown:l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),l.stopPropagation(),s(d.id))},children:"×"})]},d.id))}),n.jsxs("button",{className:"hub-catalog-toggle",type:"button","aria-expanded":p,onClick:()=>c(d=>!d),children:[n.jsx("span",{children:"MA TRẬN ỨNG DỤNG"}),n.jsx("b",{children:p?"−":"+"})]})]}),p&&n.jsxs("div",{className:"hub-template-catalog",children:[n.jsxs("header",{className:"hub-catalog-command",children:[n.jsxs("div",{children:[n.jsx("span",{children:"TRÌNH KHỞI CHẠY J-CORE"}),n.jsxs("b",{children:[x.length,"/",In.length," BỀ MẶT"]})]}),n.jsxs("label",{children:[n.jsx("span",{className:"sr-only",children:"Tìm Hub"}),n.jsxs("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:[n.jsx("circle",{cx:"11",cy:"11",r:"7"}),n.jsx("path",{d:"m16 16 5 5"})]}),n.jsx("input",{ref:v,name:"hub-search",value:m,autoComplete:"off",autoCorrect:"off",spellCheck:!1,"data-1p-ignore":"true","data-lpignore":"true",onChange:d=>u(d.target.value),placeholder:"Tìm ứng dụng, nội dung hoặc chức năng…"}),n.jsx("kbd",{children:"/"})]})]}),!m&&n.jsxs("section",{className:"hub-quick-lane",children:[n.jsxs("h3",{children:["TRUY CẬP NHANH",n.jsx("span",{children:"06"})]}),n.jsx("div",{children:pi.map(d=>{const l=Fn(d);return n.jsxs("button",{type:"button",onClick:()=>y(d),children:[n.jsx(Dn,{kind:d}),n.jsxs("span",{children:[n.jsx("b",{children:l.label}),n.jsx("small",{children:l.code})]})]},d)})})]}),xr.map(([d,l])=>x.some(f=>f.group===d)&&n.jsxs("section",{children:[n.jsxs("h3",{children:[l,n.jsx("span",{children:String(x.filter(f=>f.group===d).length).padStart(2,"0")})]}),n.jsx("div",{children:x.filter(f=>f.group===d).map(f=>n.jsxs("button",{type:"button",onClick:()=>y(f.kind),children:[n.jsx(Dn,{kind:f.kind}),n.jsxs("span",{children:[n.jsx("b",{children:f.label}),n.jsx("small",{children:f.description})]}),n.jsx("i",{children:f.code})]},f.kind))})]},d)),!x.length&&n.jsxs("div",{className:"hub-catalog-empty",children:[n.jsx("b",{children:"Không tìm thấy Hub phù hợp"}),n.jsx("span",{children:"Thử “âm thanh”, “tệp”, “quy trình”, “PDF” hoặc “tổng quan”."})]})]}),n.jsx("main",{className:"dynamic-hub-canvas",children:h?n.jsxs(n.Fragment,{children:[n.jsxs("div",{className:"dynamic-hub-context",children:[n.jsxs("span",{children:[Fn(h.kind).code,"://",h.status.toUpperCase()]}),n.jsx("h2",{children:h.title}),n.jsx("time",{children:new Date(h.createdAt).toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"})})]}),n.jsx(ur,{artifact:h})]}):n.jsxs("section",{className:"dynamic-hub-empty",children:[n.jsxs("div",{className:"hub-empty-radar",children:[n.jsx("i",{}),n.jsx("i",{}),n.jsx("b",{children:"J"})]}),n.jsx("span",{children:"KHÔNG GIAN LÀM VIỆC ĐA NĂNG J-CORE"}),n.jsx("h2",{children:"Một hệ điều hành cho mọi dạng công việc số"}),n.jsx("p",{children:"Jarvis có thể dựng không gian đọc, tệp, truyền thông, hộp thư, dữ liệu, quy trình, terminal hoặc nghiên cứu theo đúng ngữ cảnh. Chọn một Hub hoặc chỉ cần ra lệnh tự nhiên."}),n.jsx("div",{className:"hub-empty-quick",children:pi.slice(0,4).map(d=>n.jsxs("button",{type:"button",onClick:()=>a(d),children:[n.jsx(Dn,{kind:d}),n.jsx("span",{children:Fn(d).label})]},d))}),n.jsxs("button",{type:"button",onClick:()=>c(!0),children:["Mở trình ứng dụng · ",In.length," Hub"]})]})})]})}const xe="jarvis",me=[{id:"jarvis",name:"Jarvis Orchestrator",role:"Trợ lý điều phối mặc định của J-Core",description:"Profile Hermes mặc định cho web, có phiên hội thoại bền vững và cùng cơ chế session như Telegram.",icon:"terminal",tags:["Default","Memory","Command"],palette:"gold",systemPrompt:"Bạn là Jarvis Core Agent, hệ thống AI chỉ huy cao cấp của J-Core Console. Bạn trả lời ngắn gọn, chuyên nghiệp, chính xác và sử dụng tiếng Việt mượt mà."},{id:"ev-personal",name:"E.V Personal Link",role:"Trợ lý hoạch định đời sống & liên kết cá nhân",description:"Profile riêng cho Spider Mode: biến địa điểm, việc cần làm, ghi chú và liên kết thành một bản đồ hành động dễ hình dung.",icon:"router",tags:["Personal","Planner","OpenClaw","Notion"],palette:"spider",systemPrompt:"Bạn là E.V, trợ lý cá nhân trong Spider Link Hub. Hãy trả lời bằng tiếng Việt, ngắn gọn và thực tế. Mỗi kế hoạch nên được chia thành các nút: Ăn, Uống, Chơi, Việc phải làm, Người liên quan và Liên kết. Luôn đề xuất bước tiếp theo rõ ràng và định dạng phù hợp để đồng bộ sang Notion/OpenClaw."},{id:"cadence-content",name:"Cadence Content Studio",role:"Studio sáng tạo nội dung đa bước",description:"Truyền cảm hứng từ Cadence Content Machine. Tự động hóa quy trình 5 bước: Research, Scripting, Post Production, SEO, Scheduling.",icon:"media",tags:["Studio","Pipeline","5-Step"],palette:"violet",systemPrompt:"Bạn là Cadence Content Agent trong Hermes Studio. Bạn chịu trách nhiệm lên kịch bản, tóm tắt video, tối ưu SEO và xuất bản nội dung chất lượng cao theo từng bước rõ ràng."},{id:"code-architect",name:"Code Architect",role:"Kiến trúc sư phần mềm & Reviewer",description:"Phân tích kiến trúc mã nguồn, tối ưu hiệu năng và kiểm duyệt code quy chuẩn.",icon:"router",tags:["Dev","Architecture","Review"],palette:"blue",systemPrompt:"Bạn là Code Architect Agent. Bạn phân tích mã nguồn một cách tỉ mỉ, đưa ra các đề xuất tái cấu trúc (refactoring), tối ưu hóa thuật toán và áp dụng các mẫu thiết kế chuẩn."},{id:"security-auditor",name:"Security Auditor",role:"Kiểm thử an ninh & Quy tắc phòng thủ",description:"Đánh giá lỗ hổng bảo mật, kiểm tra quyền hạn và đề xuất quy tắc phòng thủ hacker có trách nhiệm.",icon:"shield",tags:["Security","Defense","Auditing"],palette:"red",systemPrompt:"Bạn là Security Auditor Agent của J-Core. Bạn chuyên kiểm tra an ninh thông tin, tìm lỗ hổng tiềm ẩn trong API/Gateway và hướng dẫn thực thi quy tắc phòng thủ mạng."}],Si="jarvis.hermes.profile.v2";function br(){if(typeof window>"u")return xe;try{const e=window.localStorage.getItem(Si);return e==="jarvis-core"?xe:e&&/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/.test(e)?e:xe}catch{return xe}}function vr(e){const t=new Map(me.map(a=>[a.id,a]));if(!Array.isArray(e))return me;const i=e.flatMap(a=>{if(!a||typeof a!="object")return[];const s=a,p=String(s.id||"").trim();if(!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/.test(p))return[];const c=t.get(p),m=String(s.palette||(c==null?void 0:c.palette)||"gold");return[{id:p,name:String(s.name||(c==null?void 0:c.name)||p),role:String(s.role||(c==null?void 0:c.role)||"Hermes profile"),description:String(s.description||(c==null?void 0:c.description)||`Profile ${p} được đồng bộ từ Hermes Ubuntu.`),icon:String(s.icon||(c==null?void 0:c.icon)||"terminal"),systemPrompt:(c==null?void 0:c.systemPrompt)||"",defaultModel:s.defaultModel?String(s.defaultModel):c==null?void 0:c.defaultModel,tags:Array.isArray(s.tags)?s.tags.map(String).slice(0,8):(c==null?void 0:c.tags)||["Hermes"],palette:m,source:"hermes"}]});return i.length?i:me}function fr(e){if(!(typeof window>"u"))try{window.localStorage.setItem(Si,e)}catch{}}function yr({data:e,service:t}){const[i,a]=o.useState("loading"),[s,p]=o.useState(""),[c,m]=o.useState(""),[u,v]=o.useState(""),[h,x]=o.useState(""),[y,d]=o.useState(""),[l,f]=o.useState(!1),[T,S]=o.useState(""),[A,P]=o.useState(""),U=o.useCallback(async()=>{var j;a("loading"),S("");try{const C=await sn(e,`/api/apps/config?service=${encodeURIComponent(t)}`);p(C.content||""),m(C.content||""),v(C.modifiedAt||""),x(C.fileName||"config"),d(C.format||"text"),f(C.writable!==!1),P(""),a("ready")}catch(C){P(((j=C==null?void 0:C.details)==null?void 0:j.requiredEnv)||""),S((C==null?void 0:C.message)||"Không thể đọc cấu hình app."),a("error")}},[e,t]);o.useEffect(()=>{U()},[U]);const Y=async()=>{a("saving"),S("");try{const j=await sn(e,"/api/apps/config",{method:"PUT",body:JSON.stringify({service:t,content:s,expectedModifiedAt:u})});m(s),v(j.modifiedAt||u),S("Đã ghi trực tiếp vào cấu hình Ubuntu."),a("ready")}catch(j){S((j==null?void 0:j.message)||"Không thể lưu cấu hình."),a("error")}},B=s!==c;return n.jsxs("section",{className:"app-config-editor","aria-label":`Chỉnh cấu hình ${t}`,children:[n.jsxs("header",{children:[n.jsxs("div",{children:[n.jsx("span",{children:"LIVE CONFIG WORKSPACE"}),n.jsx("b",{children:t.toUpperCase()})]}),n.jsxs("div",{className:`app-config-state is-${i}`,children:[n.jsx("i",{}),i==="saving"?"SAVING":i.toUpperCase()]})]}),i==="error"&&!s?n.jsxs("div",{className:"app-config-empty",role:"alert",children:[n.jsx("b",{children:"Chưa nối file cấu hình"}),n.jsx("p",{children:T}),A&&n.jsxs("code",{children:[A,"=/đường/dẫn/config"]}),n.jsx("button",{type:"button",onClick:()=>void U(),children:"Quét lại"})]}):n.jsxs(n.Fragment,{children:[n.jsxs("div",{className:"app-config-meta",children:[n.jsx("span",{children:h||"config"}),n.jsxs("small",{children:[y.toUpperCase()," · PRIVATE UBUNTU FILE"]})]}),n.jsx("textarea",{value:s,disabled:i==="loading"||i==="saving"||!l,spellCheck:!1,"aria-label":`Nội dung cấu hình ${t}`,onChange:j=>p(j.target.value)}),n.jsxs("footer",{children:[n.jsx("p",{className:i==="error"?"error":"",children:T||(B?"Có thay đổi chưa lưu.":"Đang đồng bộ với file thật trên Ubuntu.")}),n.jsxs("div",{children:[n.jsx("button",{type:"button",disabled:i==="loading"||i==="saving",onClick:()=>void U(),children:"Tải lại"}),n.jsx("button",{className:"primary",type:"button",disabled:!B||!l||i==="saving",onClick:()=>void Y(),children:i==="saving"?"Đang lưu":"Lưu cấu hình"})]})]})]})]})}function wr(e){return typeof e=="boolean"?e?"YES":"NO":typeof e=="string"||typeof e=="number"?String(e):Array.isArray(e)?`${e.length} ITEMS`:e&&typeof e=="object"?`${Object.keys(e).length} FIELDS`:"-"}function kr(e){var i,a;const t=((i=e==null?void 0:e.capabilities)==null?void 0:i.features)||(e==null?void 0:e.capabilities)||((a=e==null?void 0:e.raw)==null?void 0:a.features)||(e==null?void 0:e.raw)||{};return!t||typeof t!="object"||Array.isArray(t)?[]:Object.entries(t).filter(([s])=>!["data","models"].includes(s)).slice(0,8)}function jr(e){return(Array.isArray(e==null?void 0:e.models)?e.models:[]).map(i=>String((i==null?void 0:i.id)||(i==null?void 0:i.name)||i||"").trim()).filter(Boolean).slice(0,8)}function Nr({data:e,label:t,description:i,online:a,state:s,health:p,overview:c,error:m,prompt:u,reply:v,sending:h,selectedProfileId:x=xe,profiles:y=me,onSelectProfile:d,diagnostics:l=[],onRunDiagnostic:f,onPromptChange:T,onRefresh:S,onSubmit:A}){var R,O,k;const P=jr(c),U=kr(c),Y=((R=p==null?void 0:p.circuit)==null?void 0:R.state)||"closed",B=(c==null?void 0:c.configured)??(p==null?void 0:p.configured),j=t.toUpperCase()==="HERMES",C=E=>{E.preventDefault(),A()};return n.jsxs("div",{className:"service-console",children:[n.jsxs("header",{className:"service-console-toolbar",children:[n.jsxs("div",{children:[n.jsx("i",{className:a?"online":"offline","aria-hidden":"true"}),n.jsxs("span",{children:[n.jsxs("b",{children:[t," ",a?"ONLINE":"OFFLINE"]}),n.jsx("small",{children:i})]})]}),n.jsx("button",{type:"button",disabled:s==="loading",onClick:S,children:s==="loading"?"Đang quét":"Quét lại"})]}),j&&n.jsxs("section",{className:"hermes-profile-selector-panel","aria-label":"Profile Hermes",children:[n.jsxs("header",{className:"profile-panel-header",children:[n.jsx("span",{children:"Chọn profile Hermes"}),n.jsxs("small",{children:["Ubuntu · đang dùng: ",x]})]}),n.jsx("div",{className:"profile-chips",children:y.map(E=>n.jsxs("button",{type:"button",className:`profile-chip ${x===E.id?"active":""}`,onClick:()=>d==null?void 0:d(E.id),children:[n.jsx("b",{children:E.name}),n.jsx("small",{children:E.description||`${E.id} · bộ nhớ phiên bền vững`}),n.jsx("em",{children:E.source==="hermes"?"SYNCED METADATA":"LOCAL FALLBACK"})]},E.id))})]}),n.jsxs("section",{className:"service-metrics","aria-label":`Trạng thái ${t}`,children:[n.jsxs("article",{children:[n.jsx("span",{children:"UPSTREAM"}),n.jsx("b",{children:a?"READY":"NOT READY"}),n.jsxs("small",{children:["HTTP ",(p==null?void 0:p.status)??(c==null?void 0:c.upstreamStatus)??"-"]})]}),n.jsxs("article",{children:[n.jsx("span",{children:"LATENCY"}),n.jsxs("b",{children:[(p==null?void 0:p.latencyMs)??(c==null?void 0:c.latencyMs)??"-","ms"]}),n.jsx("small",{children:"Gateway probe"})]}),n.jsxs("article",{children:[n.jsx("span",{children:"CHAT LINK"}),n.jsx("b",{children:B===!1?"NOT CONFIGURED":B?"CONFIGURED":"UNKNOWN"}),n.jsx("small",{children:j?`${(c==null?void 0:c.defaultProfile)||"jarvis"} · ${(O=c==null?void 0:c.session)!=null&&O.continuity?"PERSISTENT":"STATELESS"}`:"Jarvis protected route"})]}),n.jsxs("article",{children:[n.jsx("span",{children:"CIRCUIT"}),n.jsx("b",{children:String(Y).toUpperCase()}),n.jsx("small",{children:j?`${String(((k=c==null?void 0:c.session)==null?void 0:k.mode)||"web").toUpperCase()} transcript`:"Failure protection"})]})]}),s==="error"?n.jsxs("div",{className:"service-console-alert",role:"alert",children:[n.jsxs("b",{children:["Không đọc được dữ liệu ",t]}),n.jsx("p",{children:m||"Dịch vụ chưa phản hồi. Kiểm tra cấu hình Gateway rồi thử lại."}),n.jsx("button",{type:"button",onClick:S,children:"Thử lại"})]}):n.jsxs("div",{className:"service-capability-grid",children:[n.jsxs("section",{children:[n.jsxs("header",{children:[n.jsx("span",{children:"CAPABILITIES"}),n.jsx("b",{children:U.length||"-"})]}),n.jsx("div",{children:U.length?U.map(([E,$])=>n.jsxs("p",{children:[n.jsx("span",{children:E}),n.jsx("b",{children:wr($)})]},E)):n.jsxs("p",{className:"empty",children:[n.jsx("span",{children:"Chưa có capability data"}),n.jsx("b",{children:"-"})]})})]}),n.jsxs("section",{children:[n.jsxs("header",{children:[n.jsx("span",{children:"MODELS"}),n.jsx("b",{children:P.length||"-"})]}),n.jsx("div",{children:P.length?P.map(E=>n.jsxs("p",{children:[n.jsx("span",{children:E}),n.jsx("b",{children:"AVAILABLE"})]},E)):n.jsxs("p",{className:"empty",children:[n.jsx("span",{children:"Upstream chưa công bố model"}),n.jsx("b",{children:"-"})]})})]})]}),l.length>0&&n.jsx("section",{className:"service-diagnostic-actions","aria-label":`Lệnh điều khiển ${t}`,children:l.map(E=>n.jsx("button",{type:"button",disabled:h,onClick:()=>f==null?void 0:f(E),children:E},E))}),e&&n.jsx(yr,{data:e,service:j?"hermes":"claude"}),n.jsxs("form",{className:"service-test-console",onSubmit:C,children:[n.jsx("label",{htmlFor:`${t.toLowerCase()}-test-prompt`,children:j?`Kiểm tra trực tiếp profile ${x}`:"Kiểm tra dịch vụ trực tiếp"}),n.jsxs("div",{children:[n.jsx("input",{id:`${t.toLowerCase()}-test-prompt`,value:u,onChange:E=>T(E.target.value),placeholder:j?`Gửi lệnh tới Hermes (${x})`:`Gửi lệnh kiểm tra trực tiếp tới ${t}`,disabled:h}),n.jsx("button",{type:"submit",disabled:h||!u.trim(),children:h?"Đang gửi":"Gửi test"})]}),n.jsx("output",{"aria-live":"polite",children:v||(j?`Mọi lệnh được định tuyến tới profile ${x} trên Ubuntu.`:`Chỉ gọi endpoint ${t}.`)})]})]})}function Ae(e){return e.replace(/\\/g,"/").replace(/\.md$/i,"").replace(/^\/+|\/+$/g,"").toLowerCase()}function Cr(e){if(!e.startsWith("---"))return{};const t=e.indexOf(`
---`,3);return t<0?{}:Object.fromEntries(e.slice(3,t).split(/\r?\n/).flatMap(i=>{const a=i.indexOf(":");return a>0?[[i.slice(0,a).trim().toLowerCase(),i.slice(a+1).trim()]]:[]}))}function Tr(e,t){const i=new Set;String(t.tags||"").replace(/^\[|\]$/g,"").split(",").map(a=>a.trim().replace(/^#/,"")).filter(Boolean).forEach(a=>i.add(a));for(const a of e.matchAll(/(?:^|\s)#([\p{L}\p{N}_\-/]+)/gu))i.add(a[1]);return[...i].slice(0,16)}function Sr(e,t){var a;return(((a=e[0])==null?void 0:a.split("/")[0])||t.split("/")[0]||"inbox").trim().toLowerCase()||"inbox"}function Mr(e,t){var y,d;const i=e.replace(/\\/g,"/"),a=i.split("/").pop()||i,s=i.includes("/")?i.slice(0,i.lastIndexOf("/")):"Inbox",p=Cr(t),c=(d=(y=t.match(/^#\s+(.+)$/m))==null?void 0:y[1])==null?void 0:d.trim(),m=String(p.title||c||a.replace(/\.md$/i,"")),u=[...new Set([...t.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g)].map(l=>l[1].trim()).filter(Boolean))],v=Tr(t,p),x=t.replace(/^---[\s\S]*?^---\s*/m,"").split(/\r?\n/).map(l=>l.replace(/^#+\s*/,"").trim()).filter(l=>l&&!l.startsWith("#")&&!/^[-*]\s*$/.test(l)).slice(0,3).join(" ").replace(/\[\[|\]\]/g,"");return{id:Ae(i),title:m,path:i,folder:s,topic:Sr(v,s),tags:v,links:u,linkIds:[],backlinks:[],summary:x?x.length>180?`${x.slice(0,177)}...`:x:"Obsidian markdown note."}}function Ar(e){const t=e.map(u=>Mr(u.path,u.content)),i=new Map(t.map(u=>[u.id,u])),a=new Map;for(const u of t)a.set(Ae(u.title),u),a.set(Ae(u.path.split("/").pop()||u.title),u);const s=[];for(const u of[...t])for(const v of u.links){const h=Ae(v);let x=a.get(h)||i.get(h);x||(x={id:`missing:${h}`,title:v,path:`${v}.md`,folder:"Unresolved",topic:"unresolved",tags:["unresolved"],links:[],linkIds:[],backlinks:[],summary:"Liên kết này chưa có note tương ứng trong vault.",placeholder:!0},t.push(x),a.set(h,x)),!u.linkIds.includes(x.id)&&(u.linkIds.push(x.id),x.backlinks.push(u.id),s.push({source:u.id,target:x.id}))}const p=new Map;for(const u of t)p.set(u.topic,[...p.get(u.topic)||[],u]);const c=[...p.entries()].map(([u,v])=>({id:u,label:u.replace(/[-_]/g," "),count:v.length})).sort((u,v)=>v.count-u.count||u.label.localeCompare(v.label)),m=Math.min(250,Math.max(130,c.length*54));return c.forEach((u,v)=>{const h=p.get(u.id)||[],x=c.length===1?0:v/c.length*Math.PI*2-Math.PI/2,y=c.length===1?0:Math.cos(x)*m,d=c.length===1?0:Math.sin(x)*m,l=Math.min(82,Math.max(34,h.length*9));h.forEach((f,T)=>{const S=h.length===1?0:T/h.length*Math.PI*2;f.x=y+Math.cos(S)*l,f.y=d+Math.sin(S)*l})}),{nodes:t,edges:s,topics:c}}function zn({name:e}){return n.jsx("svg",{"aria-hidden":"true",fill:"none",viewBox:"0 0 24 24",children:e==="document"?n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"M6 3h8l4 4v14H6z"}),n.jsx("path",{d:"M14 3v5h5M9 12h6M9 16h6"})]}):n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"M14 5h5v5M19 5l-9 9"}),n.jsx("path",{d:"M17 13v6H5V7h6"})]})})}function Er({notes:e,onSelectNote:t}){const i=o.useMemo(()=>Ar(e),[e]),[a,s]=o.useState(()=>{var l;return((l=i.nodes[0])==null?void 0:l.id)||null}),[p,c]=o.useState(""),[m,u]=o.useState("all"),[v,h]=o.useState(1),x=o.useMemo(()=>{const l=p.toLowerCase();return i.nodes.filter(f=>(m==="all"||f.topic===m)&&(!l||f.title.toLowerCase().includes(l)||f.folder.toLowerCase().includes(l)||f.tags.some(T=>T.toLowerCase().includes(l))))},[m,i.nodes,p]),y=o.useMemo(()=>new Set(x.map(l=>l.id)),[x]),d=o.useMemo(()=>i.nodes.find(l=>l.id===a)||i.nodes[0]||null,[i.nodes,a]);return n.jsxs("div",{className:"obsidian-mindmap-container",children:[n.jsxs("header",{className:"obsidian-mindmap-toolbar",children:[n.jsxs("div",{className:"mindmap-title",children:[n.jsx(zn,{name:"document"}),n.jsx("span",{children:"OBSIDIAN VAULT MINDMAP"}),n.jsxs("small",{children:[i.nodes.length," Notes · ",i.edges.length," Links"]})]}),n.jsxs("div",{className:"mindmap-controls",children:[n.jsx("input",{type:"text",placeholder:"Tìm ghi chú / #tag...",value:p,onChange:l=>c(l.target.value)}),n.jsx("button",{type:"button",onClick:()=>h(l=>Math.min(1.8,l+.15)),title:"Phóng to",children:"+"}),n.jsx("button",{type:"button",onClick:()=>h(l=>Math.max(.5,l-.15)),title:"Thu nhỏ",children:"-"}),n.jsx("button",{type:"button",onClick:()=>h(1),title:"Đặt lại zoom",children:"1:1"})]})]}),n.jsxs("nav",{className:"obsidian-topic-lane","aria-label":"Chủ đề trong Obsidian vault",children:[n.jsxs("button",{type:"button",className:m==="all"?"active":"",onClick:()=>u("all"),children:[n.jsx("b",{children:"Tất cả"}),n.jsx("small",{children:i.nodes.length})]}),i.topics.map(l=>n.jsxs("button",{type:"button",className:m===l.id?"active":"",onClick:()=>u(l.id),children:[n.jsx("b",{children:l.label}),n.jsx("small",{children:l.count})]},l.id))]}),n.jsxs("div",{className:"obsidian-mindmap-body",children:[n.jsx("div",{className:"mindmap-canvas-wrapper",children:n.jsxs("svg",{className:"mindmap-svg",viewBox:"-400 -300 800 600",style:{transform:`scale(${v})`,transformOrigin:"center center"},children:[n.jsx("defs",{children:n.jsx("marker",{id:"arrow",viewBox:"0 0 10 10",refX:"22",refY:"5",markerWidth:"6",markerHeight:"6",orient:"auto-start-reverse",children:n.jsx("path",{d:"M 0 0 L 10 5 L 0 10 z",fill:"rgba(var(--accent-rgb), 0.4)"})})}),n.jsx("g",{className:"mindmap-edges",children:i.edges.map((l,f)=>{if(!y.has(l.source)||!y.has(l.target))return null;const T=i.nodes.find(P=>P.id===l.source),S=i.nodes.find(P=>P.id===l.target);if(!T||!S)return null;const A=d&&(d.id===T.id||d.id===S.id);return n.jsx("line",{x1:T.x||0,y1:T.y||0,x2:S.x||0,y2:S.y||0,className:`mindmap-edge ${A?"highlighted":""}`,markerEnd:"url(#arrow)"},`${l.source}-${l.target}-${f}`)})}),n.jsx("g",{className:"mindmap-nodes",children:x.map(l=>{const f=(d==null?void 0:d.id)===l.id,T=f?24:18;return n.jsxs("g",{className:`mindmap-node-group ${f?"selected":""}`,transform:`translate(${l.x||0}, ${l.y||0})`,role:"button",tabIndex:0,"aria-label":`Mở ghi chú ${l.title}`,onClick:()=>{s(l.id),t&&t(l.path)},onKeyDown:S=>{S.key!=="Enter"&&S.key!==" "||(S.preventDefault(),s(l.id),t&&t(l.path))},children:[n.jsx("circle",{r:T,className:"mindmap-node-circle"}),n.jsx("text",{y:T+14,className:"mindmap-node-label",children:l.title})]},l.id)})})]})}),d&&n.jsxs("aside",{className:"mindmap-inspector",children:[n.jsxs("header",{children:[n.jsx("small",{children:"NOTE INSPECTOR"}),n.jsx("h4",{children:d.title}),n.jsx("span",{className:"node-path",children:d.path})]}),n.jsxs("div",{className:"inspector-content",children:[n.jsx("p",{className:"summary-text",children:d.summary}),n.jsxs("div",{className:"note-context-grid",children:[n.jsxs("span",{children:[n.jsx("small",{children:"TOPIC"}),n.jsx("b",{children:d.topic})]}),n.jsxs("span",{children:[n.jsx("small",{children:"FOLDER"}),n.jsx("b",{children:d.folder})]}),n.jsxs("span",{children:[n.jsx("small",{children:"LINKS"}),n.jsx("b",{children:d.linkIds.length})]}),n.jsxs("span",{children:[n.jsx("small",{children:"BACKLINKS"}),n.jsx("b",{children:d.backlinks.length})]})]}),d.tags.length>0&&n.jsxs("div",{className:"tags-section",children:[n.jsx("span",{children:"TAGS:"}),n.jsx("div",{className:"tag-badges",children:d.tags.map(l=>n.jsxs("span",{className:"tag-badge",children:["#",l]},l))})]}),d.links.length>0&&n.jsxs("div",{className:"links-section",children:[n.jsxs("span",{children:["OUTGOING LINKS (",d.links.length,"):"]}),n.jsx("ul",{children:d.links.map((l,f)=>n.jsxs("li",{onClick:()=>s(d.linkIds[f]||d.id),children:[n.jsx(zn,{name:"external"}),n.jsx("span",{children:l})]},`${l}-${f}`))})]}),d.backlinks.length>0&&n.jsxs("div",{className:"links-section backlinks-section",children:[n.jsxs("span",{children:["BACKLINKS (",d.backlinks.length,"):"]}),n.jsx("ul",{children:d.backlinks.map(l=>{const f=i.nodes.find(T=>T.id===l);return f?n.jsxs("li",{onClick:()=>s(l),children:[n.jsx(zn,{name:"external"}),n.jsx("span",{children:f.title})]},l):null})})]})]}),t&&n.jsx("button",{type:"button",className:"view-full-note-btn",onClick:()=>t(d.path),children:"Mở đọc tài liệu"})]})]})]})}function zr({data:e}){const[t,i]=o.useState([]),[a,s]=o.useState("loading"),[p,c]=o.useState(""),[m,u]=o.useState(0);return o.useEffect(()=>{let v=!0;return s("loading"),c(""),sn(e,"/api/obsidian/notes",{method:"GET",timeoutMs:15e3}).then(h=>{v&&(i(Array.isArray(h.notes)?h.notes:[]),s("ready"))}).catch(h=>{v&&(c(h instanceof Error?h.message:"Không đọc được Obsidian vault."),s("error"))}),()=>{v=!1}},[e,m]),a==="error"?n.jsxs("section",{className:"obsidian-vault-state",role:"tabpanel","aria-label":"Obsidian Vault",children:[n.jsx(zn,{name:"document"}),n.jsx("b",{children:"OBSIDIAN VAULT CHƯA KẾT NỐI"}),n.jsx("p",{children:p}),n.jsx("small",{children:"Đặt JCORE_OBSIDIAN_ROOT trên Ubuntu tới thư mục vault, sau đó khởi động lại Gateway."}),n.jsx("button",{type:"button",onClick:()=>u(v=>v+1),children:"Thử lại"})]}):a==="loading"?n.jsxs("section",{className:"obsidian-vault-state loading",role:"status",children:[n.jsx(zn,{name:"document"}),n.jsx("b",{children:"Đang lập chỉ mục vault…"})]}):t.length?n.jsx(Er,{notes:t}):n.jsxs("section",{className:"obsidian-vault-state",role:"status",children:[n.jsx(zn,{name:"document"}),n.jsx("b",{children:"Vault chưa có ghi chú Markdown."})]})}function hi(e){return e===null?"DIR":e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/1024/1024).toFixed(1)} MB`}function Ir(e,t){return t.startsWith("text/")?!0:/\.(?:txt|md|mdx|json|jsonc|ya?ml|toml|ini|conf|env|log|csv|tsv|js|jsx|mjs|cjs|ts|tsx|css|scss|html|xml|svg|py|sh|bash|zsh|fish|ps1|go|rs|java|c|h|cpp|hpp|sql|graphql|dockerfile)$/i.test(e)}function Or(){const[e,t]=o.useState(null),[i,a]=o.useState([]),[s,p]=o.useState([]),[c,m]=o.useState(null),[u,v]=o.useState("idle"),[h,x]=o.useState(""),[y,d]=o.useState(!1),l=o.useMemo(()=>i.map(j=>j.name).join(" / "),[i]),f=!!(c&&c.content!==c.originalContent),T=typeof window<"u"&&"showDirectoryPicker"in window,S=async(j,C)=>{v("loading"),x("");try{const R=[];for await(const[,O]of j.entries()){let k=null;if(O.kind==="file")try{k=(await O.getFile()).size}catch{k=0}R.push({name:O.name,kind:O.kind,handle:O,size:k})}R.sort((O,k)=>O.kind===k.kind?O.name.localeCompare(k.name):O.kind==="directory"?-1:1),p(R),a(C),m(null),v("ready")}catch(R){x(R instanceof Error?R.message:"Không thể đọc thư mục local."),v("error")}},A=async()=>{if(!T){x("Trình duyệt này chưa hỗ trợ mở thư mục trực tiếp. Hãy dùng Chrome hoặc Edge bản mới."),v("error");return}try{const j=await window.showDirectoryPicker({mode:"readwrite"});t(j),await S(j,[{name:j.name,handle:j}])}catch(j){if((j==null?void 0:j.name)==="AbortError")return;x(j instanceof Error?j.message:"Không thể cấp quyền thư mục."),v("error")}},P=async j=>{if(j.kind==="directory"){await S(j.handle,[...i,{name:j.name,handle:j.handle}]);return}v("loading"),x("");try{const C=await j.handle.getFile();if(C.size>4*1024*1024)throw new Error("File lớn hơn 4 MB; trình chỉnh sửa local chỉ mở file văn bản nhỏ.");if(!Ir(C.name,C.type))throw new Error("Đây không phải file văn bản có thể chỉnh sửa an toàn trong trình duyệt.");const R=await C.text();m({name:C.name,path:`${l} / ${C.name}`,handle:j.handle,content:R,originalContent:R,size:C.size}),v("ready")}catch(C){x(C instanceof Error?C.message:"Không thể đọc file."),v("error")}},U=async()=>{if(!(!c||!f||y)){d(!0),x("");try{const j=await c.handle.createWritable();await j.write(c.content),await j.close();const C=await c.handle.getFile();m(R=>R&&{...R,originalContent:R.content,size:C.size})}catch(j){x(j instanceof Error?j.message:"Không thể lưu file local.")}finally{d(!1)}}},Y=async()=>{if(i.length<=1)return;const j=i.slice(0,-1);await S(j[j.length-1].handle,j)},B=()=>{t(null),a([]),p([]),m(null),x(""),v("idle")};return e?n.jsxs("section",{className:"ubuntu-workspace",role:"tabpanel","aria-label":"Ubuntu local files",children:[n.jsxs("header",{className:"workspace-toolbar",children:[n.jsxs("div",{children:[n.jsx(zn,{name:"document"}),n.jsxs("span",{children:[n.jsx("b",{children:"UBUNTU LOCAL"}),n.jsx("small",{children:"DIRECT FILE ACCESS · NO API"})]})]}),n.jsxs("div",{className:"workspace-local-actions",children:[n.jsxs("span",{children:[n.jsx("i",{})," PHIÊN LOCAL"]}),n.jsx("button",{type:"button",onClick:B,children:"NGẮT THƯ MỤC"})]})]}),n.jsxs("div",{className:"workspace-pathbar",children:[n.jsx("button",{type:"button",disabled:i.length<=1||u==="loading",onClick:()=>void Y(),children:"← LÊN"}),n.jsx("code",{children:l}),n.jsx("button",{type:"button",disabled:u==="loading",onClick:()=>void S(i[i.length-1].handle,i),children:u==="loading"?"ĐANG TẢI":"LÀM MỚI"})]}),h&&n.jsxs("div",{className:"workspace-feedback error",role:"alert",children:[n.jsx("b",{children:"Không thể hoàn tất"}),n.jsx("span",{children:h}),n.jsx("button",{type:"button",onClick:()=>x(""),children:"ĐÓNG"})]}),n.jsxs("div",{className:"workspace-browser",children:[n.jsxs("nav",{className:"workspace-entry-list","aria-label":`Nội dung ${l}`,children:[s.length===0&&u!=="loading"&&n.jsx("p",{children:"Thư mục trống."}),s.map(j=>n.jsxs("button",{type:"button",onClick:()=>void P(j),children:[n.jsx("span",{className:`workspace-entry-icon ${j.kind}`,"aria-hidden":"true",children:j.kind==="directory"?"◇":"·"}),n.jsxs("span",{children:[n.jsx("b",{children:j.name}),n.jsx("small",{children:hi(j.size)})]})]},`${j.kind}-${j.name}`))]}),n.jsx("article",{className:"workspace-file-viewer","aria-live":"polite",children:c?n.jsxs(n.Fragment,{children:[n.jsxs("header",{children:[n.jsx("span",{children:"LOCAL EDITOR"}),n.jsx("b",{children:c.path}),n.jsx("small",{children:f?"CHƯA LƯU":hi(c.size)}),n.jsx("button",{type:"button",disabled:!f||y,onClick:()=>void U(),children:y?"ĐANG LƯU":"LƯU FILE"})]}),n.jsx("textarea",{className:"workspace-code-editor",value:c.content,spellCheck:!1,onChange:j=>m(C=>C&&{...C,content:j.target.value})})]}):n.jsxs("div",{className:"workspace-empty-viewer",children:[n.jsx(zn,{name:"document"}),n.jsx("b",{children:"Chọn file văn bản để đọc hoặc sửa"}),n.jsx("span",{children:"Quyền nằm trong phiên trình duyệt hiện tại. J-Core không giữ đường dẫn hay tải nội dung lên máy chủ."})]})})]})]}):n.jsxs("section",{className:"ubuntu-workspace ubuntu-local-onboarding",role:"tabpanel","aria-label":"Ubuntu local files",children:[n.jsxs("div",{className:"ubuntu-local-hero",children:[n.jsxs("span",{className:"local-kicker",children:[n.jsx("i",{})," LOCAL DIRECT / NO API"]}),n.jsx(zn,{name:"external"}),n.jsx("h2",{children:"Kết nối Ubuntu local"}),n.jsx("p",{children:"Mở thẳng một thư mục WSL trên máy này. J-Core chỉ đọc hoặc ghi sau khi bạn chủ động cấp quyền; dữ liệu không đi qua Gateway và không được tải lên."}),n.jsx("button",{type:"button",onClick:()=>void A(),children:"CHỌN THƯ MỤC UBUNTU"}),!T&&n.jsx("small",{children:"Yêu cầu Chrome hoặc Edge bản mới."})]}),n.jsxs("ol",{className:"ubuntu-local-steps",children:[n.jsxs("li",{children:[n.jsx("b",{children:"01"}),n.jsx("span",{children:"Đăng nhập J-Core"})]}),n.jsxs("li",{children:[n.jsx("b",{children:"02"}),n.jsxs("span",{children:["Chọn ",n.jsx("code",{children:"\\\\wsl.localhost\\Ubuntu\\home\\..."})]})]}),n.jsxs("li",{children:[n.jsx("b",{children:"03"}),n.jsx("span",{children:"Chỉnh sửa tại chỗ, không API"})]})]})]})}let _=null,gi=!0;const Cn={setEnabled(e){gi=!!e},play(e){if(gi)try{_||(_=new(window.AudioContext||window.webkitAudioContext)),_.state==="suspended"&&_.resume();const t=_.currentTime;switch(e){case"click":{const i=_.createOscillator(),a=_.createGain();i.connect(a),a.connect(_.destination),i.type="sine",i.frequency.setValueAtTime(1e3,t),i.frequency.exponentialRampToValueAtTime(150,t+.03),a.gain.setValueAtTime(.08,t),a.gain.exponentialRampToValueAtTime(.001,t+.03),i.start(t),i.stop(t+.035);break}case"beep":{const i=_.createOscillator(),a=_.createGain();i.connect(a),a.connect(_.destination),i.type="triangle",i.frequency.setValueAtTime(880,t),a.gain.setValueAtTime(.04,t),a.gain.exponentialRampToValueAtTime(.001,t+.06),i.start(t),i.stop(t+.07);break}case"warning":{const i=_.createOscillator(),a=_.createGain();i.connect(a),a.connect(_.destination),i.type="sawtooth",i.frequency.setValueAtTime(180,t),i.frequency.linearRampToValueAtTime(120,t+.15),a.gain.setValueAtTime(.12,t),a.gain.exponentialRampToValueAtTime(.001,t+.15),i.start(t),i.stop(t+.16);break}case"success":{const i=_.createOscillator(),a=_.createOscillator(),s=_.createGain(),p=_.createGain();i.connect(s),s.connect(_.destination),a.connect(p),p.connect(_.destination),i.type="sine",i.frequency.setValueAtTime(523.25,t),s.gain.setValueAtTime(.05,t),s.gain.exponentialRampToValueAtTime(.001,t+.12),a.type="sine",a.frequency.setValueAtTime(783.99,t+.08),p.gain.setValueAtTime(.05,t+.08),p.gain.exponentialRampToValueAtTime(.001,t+.2),i.start(t),i.stop(t+.15),a.start(t+.08),a.stop(t+.22);break}case"spider":{const i=_.createGain();i.gain.setValueAtTime(1e-4,t),i.gain.exponentialRampToValueAtTime(.075,t+.025),i.gain.exponentialRampToValueAtTime(.001,t+1.15),i.connect(_.destination),[146.83,220,293.66,440].forEach((a,s)=>{const p=_.createOscillator(),c=_.createGain();p.type=s<2?"sawtooth":"triangle",p.frequency.setValueAtTime(a,t+s*.13),p.frequency.exponentialRampToValueAtTime(a*1.015,t+.7+s*.08),c.gain.setValueAtTime(1e-4,t+s*.13),c.gain.exponentialRampToValueAtTime(s===3?.22:.13,t+.04+s*.13),c.gain.exponentialRampToValueAtTime(.001,t+.78+s*.1),p.connect(c),c.connect(i),p.start(t+s*.13),p.stop(t+1.2)});break}default:break}}catch(t){console.warn("Web Audio API not supported or blocked by permissions:",t)}}},Rr=""+new URL("spideytracker.net_images_tracker_logo3.png_809e57c2-5EJIbXfc.png",import.meta.url).href,Lr=""+new URL("spideytracker.net_images_SpiderMan_HeadTurn.png_3d9a6ff3-DQgEnpKB.png",import.meta.url).href,Hr=""+new URL("spideytracker.net_images_web_watch_map_bg.jpg_f911f39d-DYntsh8R.jpg",import.meta.url).href,Dr="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAqCAYAAAAH843fAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAKRJREFUeAHt2jEKgCAYQOHsDM0e0cN4ROfuUBhv9B8EI4j3jSIND+kfNG2L5Hxco/XWzjRar7UO95dShvsjq76zb3oYAoaAIWAITP1Zu2g6RKKpEflqmngiYAgYAoaAIZBmp8Cs2akReXuaeCJgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAh4L0GPBEwBAwBQ8AQWHLn0PmG6icMAUPAEDAEbjTmOwXhlATmAAAAAElFTkSuQmCC",Mi="jarvis.spider.personal.v3.empty",he=[{id:"eat",label:"Ăn",short:"ĂN",color:"amber"},{id:"drink",label:"Uống",short:"UỐNG",color:"cyan"},{id:"play",label:"Chơi",short:"CHƠI",color:"violet"},{id:"todo",label:"Việc phải làm",short:"VIỆC",color:"red"}],Oe={lng:106.7009,lat:10.7769},ui=[];function Ai(e=50,t=50){return{lng:Oe.lng+(e-50)/100*.18,lat:Oe.lat-(t-50)/100*.14}}function ot(e){return typeof e.lng=="number"&&typeof e.lat=="number"?e:{...e,...Ai(e.x,e.y)}}function Pr(){try{const e=JSON.parse(localStorage.getItem(Mi)||"null");return Array.isArray(e)?e.map(ot):ui.map(ot)}catch{return ui.map(ot)}}function xi({kind:e}){return e==="eat"?n.jsx("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:n.jsx("path",{d:"M7 3v8M4 3v5c0 2 6 2 6 0V3M7 11v10M16 3c-2 3-2 8 1 10v8M17 3v10"})}):e==="drink"?n.jsx("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:n.jsx("path",{d:"M7 4h10l-1 16H8L7 4ZM8 8h8M14 4l3-2"})}):e==="play"?n.jsxs("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:[n.jsx("path",{d:"m8 8 2-3h4l2 3 3 1 2 8-3 2-4-4h-4l-4 4-3-2 2-8 3-1Z"}),n.jsx("path",{d:"M8 10v4M6 12h4M16 11h.01M18 13h.01"})]}):n.jsx("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:n.jsx("path",{d:"M5 4h14v16H5zM8 9l2 2 5-5M8 15h7"})})}function Te(){return n.jsxs("svg",{className:"spidey-webhead",viewBox:"0 0 64 64","aria-hidden":"true",children:[n.jsx("path",{className:"head",d:"M32 3C15 3 9 16 11 34c2 17 12 27 21 27s19-10 21-27C55 16 49 3 32 3Z"}),n.jsx("path",{className:"web",d:"M32 5v53M13 26h38M17 43h30M16 17l16 11 16-11M18 48l14-20 14 20"}),n.jsx("path",{className:"eye",d:"M17 23c1 13 5 20 13 25V27c-4-4-8-5-13-4ZM47 23c-1 13-5 20-13 25V27c4-4 8-5 13-4Z"})]})}function Gr(){return n.jsxs("svg",{className:"spidey-pixel-hero",viewBox:"0 0 90 150","aria-hidden":"true",shapeRendering:"crispEdges",children:[n.jsx("path",{className:"hero-outline",d:"M28 3h34v5h10v10h6v30h-6v12h-8v8h8v9h8v31H68v20H55v19H37v-19H24v-20H10V77h8v-9h8v-8h-8V18h5V8h5V3Z"}),n.jsx("path",{className:"hero-red",d:"M31 9h28v5h8v8h5v23h-7v10H25V45h-5V22h5v-8h6V9Zm-5 54h38v15h8v25H58V83H32v20H17V78h9V63Zm6 44h26v18H48v17H40v-17h-8v-18Z"}),n.jsx("path",{className:"hero-blue",d:"M32 78h26v29H48v18H40v-18H32V78ZM17 83h15v20H17V83Zm41 0h14v20H58V83Z"}),n.jsx("path",{className:"hero-eye",d:"M27 22h14v19H30l-5-8 2-11Zm36 0H49v19h11l5-8-2-11Z"}),n.jsx("path",{className:"hero-web",d:"M45 10v48M23 30h44M28 16l17 15 17-15M28 49l17-18 17 18M45 64l-8 13 8 10 8-10-8-13Z"}),n.jsx("path",{className:"hero-spider",d:"M42 70h6v13h-6zM34 68h7v4h-7zm15 0h7v4h-7zm-18 9h11v4H31zm17 0h11v4H48z"})]})}function Br({currentTime:e,username:t,connections:i,messages:a,isSending:s,onAskEv:p,onExit:c,onResetView:m}){var Xn;const u=o.useRef(null),v=o.useRef(null),h=o.useRef({}),[x,y]=o.useState("all"),[d,l]=o.useState(Pr),[f,T]=o.useState(((Xn=d[0])==null?void 0:Xn.id)||""),[S,A]=o.useState(null),[P,U]=o.useState("todo"),[Y,B]=o.useState(""),[j,C]=o.useState(""),[R,O]=o.useState(null),[k,E]=o.useState(""),[$,F]=o.useState(""),[tn,an]=o.useState("todo"),[mn,bn]=o.useState("");o.useEffect(()=>{if(!u.current||v.current)return;const w=new at.Map({container:u.current,center:[Oe.lng,Oe.lat],zoom:12,attributionControl:{compact:!0},style:{version:8,sources:{osm:{type:"raster",tiles:["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],tileSize:256,attribution:"OpenStreetMap"}},layers:[{id:"osm",type:"raster",source:"osm"}]}});return w.addControl(new at.NavigationControl({showCompass:!1}),"bottom-right"),w.on("load",()=>w.resize()),w.on("click",z=>{O({lng:z.lngLat.lng,lat:z.lngLat.lat}),A("compose"),Cn.play("beep")}),v.current=w,()=>{Object.values(h.current).forEach(z=>z.remove()),h.current={},w.remove(),v.current=null}},[]),o.useEffect(()=>localStorage.setItem(Mi,JSON.stringify(d)),[d]);const M=d.find(w=>w.id===f)||null;o.useEffect(()=>{M&&(E(M.title),F(M.note),an(M.kind))},[f,M==null?void 0:M.title,M==null?void 0:M.note,M==null?void 0:M.kind]);const pn=o.useMemo(()=>[...a].reverse().find(w=>w.role==="assistant"),[a]),vn=o.useMemo(()=>x==="all"?d:d.filter(w=>w.kind===x),[x,d]);o.useEffect(()=>{const w=v.current;w&&(Object.values(h.current).forEach(z=>z.remove()),h.current={},vn.forEach(z=>{if(typeof z.lng!="number"||typeof z.lat!="number")return;const Z=he.find(Sn=>Sn.id===z.kind),rn=document.createElement("button"),Tn=document.createElement("span"),on=document.createElement("b");rn.type="button",rn.className=`spidey-map-marker pin-${z.kind}${f===z.id?" selected":""}${z.done?" done":""}`,rn.setAttribute("aria-label",`${(Z==null?void 0:Z.label)||z.kind}: ${z.title}`),Tn.textContent=(Z==null?void 0:Z.short)||z.kind,on.textContent=z.title,rn.append(Tn,on),rn.addEventListener("click",Sn=>{Sn.stopPropagation(),T(z.id),A("detail"),Cn.play("click")}),h.current[z.id]=new at.Marker({element:rn,anchor:"bottom"}).setLngLat([z.lng,z.lat]).addTo(w)}))},[f,vn]),o.useEffect(()=>{var w;typeof(M==null?void 0:M.lng)!="number"||typeof(M==null?void 0:M.lat)!="number"||(w=v.current)==null||w.flyTo({center:[M.lng,M.lat],zoom:14,speed:.8,essential:!1})},[f,M==null?void 0:M.lng,M==null?void 0:M.lat]);const Pn=w=>{if(w.preventDefault(),!Y.trim())return;const z=d.length,Z=18+z*19%70,rn=24+z*23%49,Tn=R||Ai(Z,rn),on={id:`${Date.now()}`,kind:P,title:Y.trim(),note:j.trim()||"Chưa có địa chỉ, link hoặc ghi chú",x:18+z*19%70,y:24+z*23%49};on.x=Z,on.y=rn,on.lng=Tn.lng,on.lat=Tn.lat,l(Sn=>[...Sn,on]),T(on.id),B(""),C(""),O(null),A("detail"),Cn.play("success")},Gn=w=>{w.preventDefault(),!(!M||!k.trim())&&(l(z=>z.map(Z=>Z.id===M.id?{...Z,title:k.trim(),note:$.trim(),kind:tn}:Z)),Cn.play("success"))},Yn=w=>{w.preventDefault();const z=mn.trim();!z||s||(p(`Trong Spider Personal Link, hãy giúp tôi hoạch định: ${z}. Trả lời theo các nút Ăn, Uống, Chơi, Việc phải làm và các liên kết cần lưu.`),bn(""))},Wn=w=>A(z=>z===w?null:w),Zn=()=>{!M||typeof M.lat!="number"||typeof M.lng!="number"||window.open(`https://www.openstreetmap.org/?mlat=${M.lat}&mlon=${M.lng}#map=17/${M.lat}/${M.lng}`,"_blank","noopener,noreferrer")};return n.jsxs("div",{className:"spider-personal-shell spidey-tracker-shell",children:[n.jsx("a",{className:"spidey-skip",href:"#spidey-map",children:"Bỏ qua điều hướng"}),n.jsx("div",{className:"spidey-blueprint","aria-hidden":"true"}),n.jsx("div",{className:"spider-scanlines","aria-hidden":"true"}),n.jsxs("section",{className:"spidey-frame",children:[n.jsxs("div",{className:"spidey-source-logo-strip",children:[n.jsx("img",{src:Rr,alt:"Spidey Tracker logo captured from snapshot"}),n.jsx("span",{children:"NO IFRAME · external/spideytracker-snapshot"})]}),n.jsx("button",{className:"spidey-corner spidey-corner-left",type:"button","aria-label":"Mở điều hướng","aria-expanded":S==="nav",onClick:()=>Wn("nav"),children:n.jsx(Te,{})}),n.jsxs("div",{className:"spidey-logo",children:[n.jsx("span",{children:"PERSONAL"}),n.jsxs("b",{children:["SPIDEY ",n.jsx(Te,{})," TRACKER"]}),n.jsx("small",{children:"J—CORE FIELD NETWORK"})]}),n.jsx("button",{className:"spidey-corner spidey-corner-right",type:"button","aria-label":"Trở về J-Core",onClick:c,children:n.jsxs("svg",{viewBox:"0 0 48 48","aria-hidden":"true",children:[n.jsx("path",{d:"M24 9v30M9 24h30M13 13l22 22M35 13 13 35"}),n.jsx("circle",{cx:"24",cy:"24",r:"17"})]})}),n.jsx("aside",{className:"spidey-filter-rail","aria-label":"Lọc loại địa điểm",children:he.map(w=>n.jsxs("button",{className:`${w.color} ${x===w.id?"active":""}`,type:"button","aria-label":`Lọc ${w.label}`,"aria-pressed":x===w.id,onClick:()=>y(z=>z===w.id?"all":w.id),children:[n.jsx(xi,{kind:w.id}),n.jsx("span",{children:w.short})]},w.id))}),n.jsxs("main",{id:"spidey-map",className:"spidey-map",tabIndex:-1,children:[n.jsx("img",{className:"spidey-source-bg",src:Hr,alt:"","aria-hidden":"true"}),n.jsx("div",{ref:u,className:"spidey-real-map","aria-label":"Spider personal map"}),n.jsx("div",{className:"spidey-map-vignette","aria-hidden":"true"}),n.jsxs("div",{className:"spidey-source-badge",children:[n.jsx("img",{src:Lr,alt:"","aria-hidden":"true"}),n.jsxs("div",{children:[n.jsx("span",{children:"CRAWLED ASSETS LOADED"}),n.jsx("b",{children:"SPIDEYTRACKER NATIVE SNAPSHOT"})]}),n.jsx("img",{src:Dr,alt:"","aria-hidden":"true"})]}),n.jsxs("div",{className:"spidey-map-status",children:[n.jsx("span",{children:"PERSONAL MAP // SAIGON"}),n.jsxs("b",{children:[vn.length," SIGNALS ONLINE"]}),R&&n.jsxs("em",{children:[R.lat.toFixed(5)," / ",R.lng.toFixed(5)]})]}),n.jsxs("div",{className:"spidey-radar","aria-label":"Điều khiển bản đồ",children:[n.jsx("i",{}),n.jsx("i",{}),n.jsx("i",{}),n.jsx("b",{}),n.jsx("button",{type:"button",onClick:()=>y("all"),"aria-label":"Hiển thị toàn bộ bản đồ",children:"◎"}),n.jsx("button",{type:"button",onClick:m,"aria-label":"Căn lại bản đồ",children:"⌾"})]})]}),n.jsxs("button",{className:"spidey-message-center",type:"button",onClick:()=>Wn("ev"),"aria-expanded":S==="ev",children:[n.jsx("span",{children:a.length}),n.jsx(Te,{}),n.jsxs("b",{children:["MESSAGE",n.jsx("br",{}),"CENTER"]})]}),n.jsxs("div",{className:"spidey-ticker","aria-label":"Trạng thái hệ thống",children:[n.jsx("b",{children:"PERSONAL LINK ACTIVE"}),n.jsxs("div",{children:[n.jsx("span",{children:"ĂN · UỐNG · CHƠI · VIỆC PHẢI LÀM"}),n.jsxs("span",{children:["HERMES ",i.hermes?"ONLINE":"LOCAL"," · OPENCLAW ",i.openclaw?"LINKED":"WAITING"]})]}),n.jsx("time",{children:e})]}),S==="nav"&&n.jsxs("aside",{className:"spidey-panel spidey-nav-panel",children:[n.jsxs("header",{children:[n.jsx("b",{children:"NAVIGATION"}),n.jsx("button",{type:"button",onClick:()=>A(null),children:"CLOSE"})]}),n.jsxs("nav",{children:[n.jsxs("button",{type:"button",onClick:()=>A("activity"),children:["ACTIVITY LOG ",n.jsx("span",{children:d.length})]}),n.jsxs("button",{type:"button",onClick:()=>A("compose"),children:["ADD SIGNAL ",n.jsx("span",{children:"＋"})]}),n.jsxs("button",{type:"button",onClick:()=>A("ev"),children:["MESSAGE CENTER ",n.jsx("span",{children:a.length})]}),n.jsxs("button",{type:"button",onClick:()=>A("links"),children:["SYSTEM LINKS ",n.jsx("span",{children:"03"})]}),n.jsxs("button",{type:"button",onClick:c,children:["J—CORE HUB ",n.jsx("span",{children:"↗"})]})]})]}),S==="activity"&&n.jsxs("aside",{className:"spidey-panel spidey-log-panel",children:[n.jsxs("header",{children:[n.jsx("b",{children:"ACTIVITY LOG"}),n.jsx("button",{type:"button",onClick:()=>A(null),children:"CLOSE"})]}),n.jsx("div",{className:"spidey-log-list",children:d.map(w=>{var z;return n.jsxs("button",{type:"button",onClick:()=>{T(w.id),A("detail")},children:[n.jsx(xi,{kind:w.kind}),n.jsxs("span",{children:[n.jsx("small",{children:w.done?"COMPLETED":(z=he.find(Z=>Z.id===w.kind))==null?void 0:z.label.toUpperCase()}),n.jsx("b",{children:w.title}),n.jsx("em",{children:w.note})]})]},w.id)})})]}),S==="compose"&&n.jsxs("aside",{className:"spidey-panel spidey-compose-panel",children:[n.jsxs("header",{children:[n.jsx("b",{children:"ADD SIGNAL"}),n.jsx("button",{type:"button",onClick:()=>A(null),children:"CLOSE"})]}),n.jsxs("form",{onSubmit:Pn,children:[n.jsxs("label",{children:["LOẠI",n.jsx("select",{value:P,onChange:w=>U(w.target.value),children:he.map(w=>n.jsx("option",{value:w.id,children:w.label},w.id))})]}),n.jsxs("label",{children:["TÊN",n.jsx("input",{value:Y,onChange:w=>B(w.target.value),placeholder:"Tên địa điểm hoặc việc…",autoFocus:!0})]}),n.jsxs("label",{children:["ĐỊA CHỈ / LINK / GHI CHÚ",n.jsx("textarea",{value:j,onChange:w=>C(w.target.value),placeholder:"Dán link Maps, Notion hoặc ghi chú…"})]}),n.jsx("button",{type:"submit",disabled:!Y.trim(),children:"GHIM VÀO MAP ＋"})]})]}),S==="detail"&&M&&n.jsxs("aside",{className:"spidey-panel spidey-detail-panel",children:[n.jsxs("header",{children:[n.jsxs("b",{children:["NODE INTEL // ",M.id.slice(-4)]}),n.jsx("button",{type:"button",onClick:()=>A(null),children:"CLOSE"})]}),n.jsxs("form",{onSubmit:Gn,children:[n.jsxs("label",{children:["LOẠI",n.jsx("select",{value:tn,onChange:w=>an(w.target.value),children:he.map(w=>n.jsx("option",{value:w.id,children:w.label},w.id))})]}),n.jsxs("label",{children:["TÊN",n.jsx("input",{value:k,onChange:w=>E(w.target.value)})]}),n.jsxs("label",{children:["ĐỊA CHỈ / LINK / GHI CHÚ",n.jsx("textarea",{value:$,onChange:w=>F(w.target.value)})]}),n.jsx("button",{type:"submit",children:"LƯU THAY ĐỔI"})]}),n.jsxs("div",{className:"spidey-node-coordinates",children:[n.jsx("span",{children:"COORDINATES"}),n.jsx("b",{children:typeof M.lat=="number"&&typeof M.lng=="number"?`${M.lat.toFixed(5)} / ${M.lng.toFixed(5)}`:"NO MAP POINT"})]}),n.jsxs("div",{className:"spidey-detail-actions",children:[n.jsx("button",{type:"button",onClick:()=>l(w=>w.map(z=>z.id===M.id?{...z,done:!z.done}:z)),children:M.done?"MỞ LẠI":"HOÀN TẤT"}),n.jsx("button",{type:"button",onClick:Zn,children:"MỞ MAP ↗"}),n.jsx("button",{className:"danger",type:"button",onClick:()=>{l(w=>w.filter(z=>z.id!==M.id)),T(""),A(null)},children:"XÓA"})]})]}),S==="ev"&&n.jsxs("aside",{className:"spidey-panel spidey-ev-panel",children:[n.jsxs("header",{children:[n.jsx("b",{children:"E.V // MESSAGE CENTER"}),n.jsx("button",{type:"button",onClick:()=>A(null),children:"CLOSE"})]}),n.jsxs("div",{className:"spidey-ev-message",children:[n.jsx("span",{children:n.jsx(Te,{})}),n.jsx("p",{children:(pn==null?void 0:pn.text)||"Nói mục tiêu của bạn. Tôi sẽ nối địa điểm, công việc và các bước tiếp theo thành bản đồ hành động."})]}),n.jsx("div",{className:"spidey-quick-prompts",children:["Lên lịch cuối tuần","Tìm chỗ ăn gần đây","Chia kế hoạch tuần","Chuẩn bị việc hôm nay"].map(w=>n.jsx("button",{type:"button",onClick:()=>bn(w),children:w},w))}),n.jsxs("form",{onSubmit:Yn,children:[n.jsx("label",{htmlFor:"spidey-ev-prompt",children:"TIN NHẮN CHO E.V"}),n.jsx("textarea",{id:"spidey-ev-prompt",value:mn,onChange:w=>bn(w.target.value),placeholder:"Mô tả kế hoạch bạn đang hình dung…"}),n.jsx("button",{type:"submit",disabled:s||!mn.trim(),children:s?"ĐANG NỐI…":"TẠO KẾ HOẠCH ↗"})]})]}),S==="links"&&n.jsxs("aside",{className:"spidey-panel spidey-links-panel",children:[n.jsxs("header",{children:[n.jsx("b",{children:"SYSTEM LINKS"}),n.jsx("button",{type:"button",onClick:()=>A(null),children:"CLOSE"})]}),n.jsxs("div",{children:[n.jsxs("span",{className:i.hermes?"online":"offline",children:["HERMES / E.V ",n.jsx("b",{children:i.hermes?"ONLINE":"LOCAL"})]}),n.jsxs("span",{className:i.openclaw?"online":"offline",children:["OPENCLAW ",n.jsx("b",{children:i.openclaw?"LINKED":"WAITING"})]}),n.jsxs("span",{className:i.nineRouter?"online":"offline",children:["9ROUTER ",n.jsx("b",{children:i.nineRouter?"READY":"OFFLINE"})]}),n.jsxs("span",{children:["NOTION ",n.jsx("b",{children:"CONFIGURE IN HUB"})]})]})]})]}),n.jsxs("div",{className:"spidey-hero-dock",children:[n.jsx(Gr,{}),n.jsx("button",{type:"button",onClick:()=>A("compose"),children:"ADD SIGNAL"})]}),n.jsxs("footer",{className:"spidey-footer",children:[n.jsx("b",{children:"J—CORE"}),n.jsx("span",{children:"POWERED BY HERMES + OPENCLAW"}),n.jsxs("small",{children:[t.toUpperCase()," · PRIVATE NETWORK · ",new Date().getFullYear()]})]})]})}const Ur=""+new URL("worldmonitor-7-mar-2026-CtI5YvxO.jpg",import.meta.url).href,_r=["Tóm tắt 5 biến động thế giới quan trọng nhất lúc này.","Phân tích các điểm nóng địa chính trị đang leo thang.","Có rủi ro nào có thể ảnh hưởng tới Việt Nam hôm nay?","Đối chiếu tin nóng với thị trường, năng lượng và chuỗi cung ứng."],$r=[["CONFLICTS","Live crisis, strikes, protests","56"],["MARKETS","Finance radar, commodities, crypto","07"],["INFRA","Ports, cables, nuclear, datacenters","18"],["CLIMATE","Fires, quakes, weather anomaly","09"],["INTEL","500+ feeds, AI briefs, local Ollama","AI"]];function ge({name:e}){const t={ai:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"M12 2l1.5 5.2L19 9l-5.5 1.8L12 16l-1.5-5.2L5 9l5.5-1.8L12 2Z"}),n.jsx("path",{d:"m18 15 .8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z"})]}),send:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"m21 3-7.5 18-3.2-7.3L3 10.5 21 3Z"}),n.jsx("path",{d:"m10.3 13.7 4.8-4.8"})]}),close:n.jsx("path",{d:"m6 6 12 12M18 6 6 18"}),reload:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"M20 6v5h-5"}),n.jsx("path",{d:"M18.5 15a7 7 0 1 1-.7-7.8L20 11"})]})};return n.jsx("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:t[e]})}function Vr({currentTime:e,username:t,messages:i,isSending:a,onAskAi:s,onExit:p}){const[c,m]=o.useState(!1),[u,v]=o.useState(""),h=o.useRef(null),x=o.useMemo(()=>i.slice(-8),[i]),y=d=>{d.preventDefault();const l=u.trim();!l||a||(s(`[WORLD MONITOR] ${l}`),v(""),window.setTimeout(()=>{var f;return(f=h.current)==null?void 0:f.scrollTo({top:h.current.scrollHeight,behavior:"smooth"})},120))};return n.jsxs("section",{className:`world-monitor-shell world-native-shell ${c?"is-ai-open":""}`,"aria-label":"World Monitor native realm",children:[n.jsxs("aside",{className:"world-ai-rail","aria-label":"AI phân tích thế giới",children:[n.jsxs("header",{children:[n.jsxs("button",{className:"world-ai-mark",type:"button",onClick:()=>m(d=>!d),"aria-label":c?"Thu gọn AI":"Mở AI","aria-expanded":c,children:[n.jsx(ge,{name:"ai"}),n.jsx("i",{})]}),n.jsxs("div",{children:[n.jsx("span",{children:"external/worldmonitor"}),n.jsx("b",{children:"World Monitor Native"})]}),n.jsx("button",{className:"world-icon-button",type:"button",onClick:()=>m(!1),"aria-label":"Thu gọn thanh AI",children:n.jsx(ge,{name:"close"})})]}),n.jsxs("div",{className:"world-ai-status",children:[n.jsx("i",{}),n.jsx("span",{children:a?"ĐANG PHÂN TÍCH TÍN HIỆU":"SOURCE CLONE ĐÃ NẠP"}),n.jsx("time",{children:e})]}),n.jsxs("div",{className:"world-ai-stream",ref:h,"aria-live":"polite",children:[x.length===0?n.jsxs("article",{className:"assistant",children:[n.jsx("small",{children:"WORLD MONITOR"}),n.jsx("p",{children:"Dashboard này đang chạy native trong J-Core, lấy nhận diện và kiến trúc từ repo đã clone: 500+ feeds, 56 layer map, finance radar, local AI."})]}):x.map(d=>n.jsxs("article",{className:d.role,children:[n.jsx("small",{children:d.role==="assistant"?"J-CORE AI":t.toUpperCase()}),n.jsx("p",{children:d.text.replace(/^\[WORLD MONITOR\]\s*/,"")})]},d.id)),a&&n.jsxs("div",{className:"world-ai-thinking",children:[n.jsx("i",{}),n.jsx("i",{}),n.jsx("i",{}),n.jsx("span",{children:"Đang tổng hợp qua Gateway"})]})]}),n.jsx("div",{className:"world-quick-grid",children:_r.map((d,l)=>n.jsxs("button",{type:"button",onClick:()=>v(d),children:[n.jsxs("small",{children:["0",l+1]}),d]},d))}),n.jsxs("form",{onSubmit:y,children:[n.jsx("label",{htmlFor:"world-ai-prompt",children:"HỎI AI CỦA BẠN"}),n.jsxs("div",{children:[n.jsx("textarea",{id:"world-ai-prompt",value:u,onChange:d=>v(d.target.value),placeholder:"Ví dụ: điều gì đang diễn ra ở Biển Đỏ?",onKeyDown:d=>{var l;d.key==="Enter"&&!d.shiftKey&&(d.preventDefault(),(l=d.currentTarget.form)==null||l.requestSubmit())}}),n.jsx("button",{type:"submit",disabled:!u.trim()||a,"aria-label":"Gửi câu hỏi",children:n.jsx(ge,{name:"send"})})]})]}),n.jsxs("footer",{children:[n.jsx("span",{children:"NO IFRAME"}),n.jsx("b",{children:"NATIVE PORT"})]})]}),!c&&n.jsxs("button",{className:"world-ai-restore",type:"button",onClick:()=>m(!0),"aria-label":"Mở AI phân tích",children:[n.jsx(ge,{name:"ai"}),n.jsx("span",{children:"ASK AI"}),n.jsx("i",{})]}),n.jsxs("main",{className:"world-monitor-stage world-native-stage",children:[n.jsxs("section",{className:"world-native-map",children:[n.jsx("img",{src:Ur,alt:"World Monitor dashboard captured from cloned repository"}),n.jsxs("div",{className:"world-native-map-overlay",children:[n.jsx("small",{children:"REAL SOURCE MIRROR"}),n.jsx("h1",{children:"World Monitor"}),n.jsx("p",{children:"Real-time global intelligence dashboard — map, feeds, markets, infrastructure and AI briefs ported into J-Core without iframe."})]})]}),n.jsx("aside",{className:"world-native-command world-native-command-compact",children:$r.map(([d,l,f])=>n.jsxs("article",{children:[n.jsx("small",{children:f}),n.jsx("b",{children:d}),n.jsx("span",{children:l})]},d))}),n.jsxs("nav",{className:"world-floating-controls","aria-label":"Điều khiển World Monitor",children:[n.jsx("button",{type:"button","aria-label":"Source loaded",children:n.jsx(ge,{name:"reload"})}),n.jsxs("button",{type:"button",onClick:p,"aria-label":"Trở về J-Core",children:[n.jsx("span",{children:"J"}),n.jsx("b",{children:"J-CORE"})]})]})]})]})}const qr=`<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Javis OS</title>
  <!-- Favicon = logo hiện tại (/brand-logo): mặc định theo logo.png, và tự đổi theo ảnh user tải lên. -->
  <link rel="icon" href="/brand-logo?v=5">
  <link rel="apple-touch-icon" href="/brand-logo?v=5">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap">
  <!-- Biến --ic-* cho icon dùng trong content: của CSS. Phải đứng TRƯỚC style.css
       vì style.css tham chiếu các biến này. -->
  <link rel="stylesheet" href="/static/vendor/lucide-icons.css?v=1">
  <link rel="stylesheet" href="/static/style.css?v=63">
  <link rel="stylesheet" href="/static/console.css?v=46">
  <!-- Áp tông đã lưu TRƯỚC khi vẽ để không nháy tối rồi mới đổi sang sáng.
       Giá trị cũ "dim" (tông tối-nhạt, gỡ ở 0.9.250) quy về tối; theme.js sẽ ghi đè lại. -->
  <script>(function(){try{if(localStorage.getItem('javis.theme')==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}})();<\/script>
</head>
<body>
  <div class="hud">

    <!-- ===== TOP BAR ===== -->
    <header class="hud-top">
      <!-- Mobile-only: mở ngăn kéo điều hướng -->
      <button class="hud-icon-btn nav-toggle-btn" id="navToggle" title="Menu" aria-label="Mở menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/>
        </svg>
      </button>
      <!-- NHÓM TRÁI: thương hiệu + chọn brain + số liệu (bám trái) -->
      <div class="hud-top-left">
        <div class="brand"><span class="brand-icon"><img src="/brand-logo" alt="" style="width:22px;height:22px;border-radius:5px;vertical-align:middle;object-fit:cover"></span> <span class="brand-text">JAVIS OS</span></div>
        <!-- Select Brain: dời từ góc graph lên navbar -->
        <div class="orb-graph-ctl navbar-brain">
          <i data-ic="brain" class="brain-select-ico" data-ic-title="Bộ não đang chọn"></i>
          <select id="graphSource" class="graph-select">
            <option value="brain">Brain Default</option>
          </select>
          <button class="graph-folder-btn" id="newBrainBtn" title="Tạo brain mới trong thư mục brains"><i data-ic="plus"></i></button>
          <button class="graph-folder-btn" id="delBrainBtn" title="Xoá brain đang chọn (xác nhận gõ đúng tên)"><i data-ic="trash-2"></i></button>
          <button class="graph-folder-btn" id="pickFolderBtn" title="Chọn brain từ folder ngoài bất kỳ"><i data-ic="folder-open"></i></button>
          <span class="graph-stats" id="graphStats">-</span>
        </div>
      </div>
      <!-- NHÓM GIỮA: thanh trạng thái đang quá tải nên bỏ tên workspace lẫn ngày tháng theo
           yêu cầu chủ (0.9.195) - tên vẫn hiện trong Cài đặt; chỗ này giờ dành cho đèn báo não
           khi bộ não mất đăng nhập. Chuông Thông báo đã dời về góc phải cho khớp với panel
           (panel ghim right:18px, để nút ở giữa thì bấm một nơi hộp bung nơi khác). -->
      <div class="hud-center-title">
        <span class="engine-banner" id="engineBanner" hidden></span>
      </div>
      <!-- NHÓM PHẢI: chuông Thông báo + nút đổi tông (LUÔN hiện) + cụm nút cockpit (ẩn ở trang quản lý) -->
      <div class="hud-top-right">
        <button class="notification-trigger" id="notificationTrigger" type="button"
                aria-haspopup="dialog" aria-expanded="false" title="Mở hộp thư Thông báo">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path>
            <path d="M10 21h4"></path>
          </svg>
          <span class="notification-trigger-label">Thông báo</span>
          <span class="notification-badge" id="notificationBadge" hidden>0</span>
        </button>
        <button class="hud-icon-btn theme-toggle" id="themeToggle" type="button" aria-pressed="false"
                title="Đang dùng tông tối - bấm để chuyển sang tông sáng"
                aria-label="Đang dùng tông tối - bấm để chuyển sang tông sáng">
          <!-- Trăng hiện ở tông tối, mặt trời hiện ở tông sáng (đổi qua CSS theo data-theme) -->
          <svg class="ic-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z"/>
          </svg>
          <svg class="ic-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4.1"/>
            <path d="M12 2.6v2.1M12 19.3v2.1M4.35 4.35l1.5 1.5M18.15 18.15l1.5 1.5M2.6 12h2.1M19.3 12h2.1M4.35 19.65l1.5-1.5M18.15 5.85l1.5-1.5"/>
          </svg>
        </button>
        <div class="hud-actions">
          <button class="studio-open-btn" id="studioOpenBtn" title="Studio - Agents, Skills, Workflows">▦ Studio</button>
          <button class="hud-icon-btn" id="settingsBtn" title="Cài đặt">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
              <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
              <line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>
            </svg>
          </button>
          <!-- Voice/tốc độ dùng lại cùng node trong trang Cài đặt để giữ nguyên handler. -->
          <button class="hud-icon-btn" id="ttsToggle" title="Bật/tắt giọng Javis">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          </button>
          <button class="hud-icon-btn" id="resetBtn" title="Reset hội thoại">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.7 3M3 4v5h5"/>
            </svg>
          </button>
          <!-- Mobile-only: hội thoại mới -->
          <button class="hud-icon-btn new-chat-btn" id="newChatBtn" title="Hội thoại mới" aria-label="Hội thoại mới">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Hộp thư chung: bản cập nhật + thông báo cộng đồng/marketing -->
    <div class="notification-shade" id="notificationShade" hidden></div>
    <aside class="notification-panel" id="notificationPanel" role="dialog"
           aria-modal="false" aria-label="Hộp thư Thông báo" aria-hidden="true" hidden>
      <div class="noti-head">
        <div>
          <div class="noti-title">Thông báo</div>
          <div class="noti-sub" id="notificationSummary">Cập nhật mới và tin từ Javis OS</div>
        </div>
        <div class="noti-head-actions">
          <button class="noti-text-btn" id="notificationReadAll" type="button">Đọc tất cả</button>
          <button class="noti-close" id="notificationClose" type="button" aria-label="Đóng">×</button>
        </div>
      </div>
      <div class="noti-list" id="notificationList">
        <div class="noti-loading">Đang tải thông báo…</div>
      </div>
      <div class="noti-foot">
        <button class="noti-text-btn" id="notificationRefresh" type="button">↻ Làm mới</button>
        <button class="noti-text-btn primary" id="notificationOpenUpdates" type="button">Xem nhật ký cập nhật →</button>
      </div>
    </aside>

    <!-- ===== BODY: 3 columns ===== -->
    <div class="hud-body">

      <!-- LEFT: Vault explorer (cây thư mục kiểu Obsidian + tìm note). Thay cho panel số liệu KD cũ. -->
      <aside class="hud-left">
        <div class="vault-head">
          <span class="vault-title">VAULT</span>
          <span class="vault-tools">
            <button class="mini-btn" id="vtNewFile" title="Tạo file mới ở gốc brain">＋</button>
            <button class="mini-btn" id="vtNewDir" title="Tạo thư mục mới ở gốc brain"><i data-ic="folder-plus"></i></button>
            <button class="mini-btn" id="vtRefresh" title="Làm mới cây">⟳</button>
          </span>
        </div>
        <div class="vault-search">
          <i class="vs-ico" data-ic="search"></i>
          <input id="vaultSearch" type="text" placeholder="Tìm note..." spellcheck="false" autocomplete="off">
          <button class="vs-clear" id="vaultSearchClear" title="Xoá tìm kiếm" hidden><i data-ic="x"></i></button>
        </div>
        <div class="vault-modes">
          <button class="vs-chip active" id="vsModeName" data-mode="name" title="Lọc nhanh theo tên trong cây">Tên</button>
          <button class="vs-chip" id="vsModeContent" data-mode="content" title="Tìm sâu theo nội dung (quét toàn vault)">Nội dung</button>
        </div>
        <div class="vault-tree" id="vaultTree"><div class="vt-info">Đang tải…</div></div>
        <div class="vault-results" id="vaultResults" hidden></div>
      </aside>

      <!-- CENTER: knowledge graph -->
      <div class="hud-center">
        <canvas id="starfield"></canvas>
        <div id="graph2d"></div>
        <div class="concept-labels" id="conceptLabels"></div>
        <div class="orb-overlay">
          <div class="orb-state" id="orbState">SẴN SÀNG</div>
          <div class="orb-interim" id="voiceInterim"></div>
        </div>
        <button class="brain-overlay-toggle" id="brainOverlayToggle" type="button"
                aria-pressed="false" aria-label="Ẩn nhãn và số liệu brain"
                title="Ẩn nhãn thư mục và số liệu Agents / Skills / Workflows">
          <svg class="brain-eye-on" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"></path>
            <circle cx="12" cy="12" r="2.75"></circle>
          </svg>
          <svg class="brain-eye-off" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 3l18 18M10.6 6.15A9.8 9.8 0 0 1 12 6c6 0 9.5 6 9.5 6a15 15 0 0 1-2.05 2.65M6.3 6.35C3.85 8.05 2.5 12 2.5 12s3.5 6 9.5 6a9.5 9.5 0 0 0 3.1-.52M9.9 9.9a3 3 0 0 0 4.2 4.2"></path>
          </svg>
        </button>

        <!-- Timelapse "cuộc đời brain": chiếu lại note mọc dần theo thời gian tạo (chỉ đồ thị 2D) -->
        <button class="brain-overlay-toggle graph-timelapse-btn" id="graphTimelapseBtn" type="button"
                aria-pressed="false" aria-label="Chiếu timelapse cuộc đời brain"
                title="Timelapse: xem lại brain lớn lên từ note đầu tiên tới giờ">
          <svg class="tl-play" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9"></circle>
            <path d="M12 7v5l3.5 2"></path>
          </svg>
          <svg class="tl-stop" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9"></circle>
            <rect x="9" y="9" width="6" height="6" rx="1"></rect>
          </svg>
        </button>

        <!-- BUNG/THU khoang não - CHỈ hiện trên điện thoại (console.css .brain-max-btn).
             Trên desktop khoang não đã chiếm cả cột giữa nên không có gì để bung. -->
        <button class="brain-overlay-toggle brain-max-btn" id="brainMaxBtn" type="button"
                aria-pressed="false" aria-label="Bung khoang não toàn màn"
                title="Bung khoang não ra toàn màn để nhìn rõ đồ thị">
          <svg class="bmx-in" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 3H5a2 2 0 0 0-2 2v4M15 3h4a2 2 0 0 1 2 2v4M9 21H5a2 2 0 0 1-2-2v-4M15 21h4a2 2 0 0 0 2-2v-4"></path>
          </svg>
          <svg class="bmx-out" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 10h4a2 2 0 0 0 2-2V4M20 10h-4a2 2 0 0 1-2-2V4M4 14h4a2 2 0 0 1 2 2v4M20 14h-4a2 2 0 0 0-2 2v4"></path>
          </svg>
        </button>

        <!-- Lớp Agentic: số agent / skill / workflow - bấm mở Studio -->
        <div class="brain-stats" id="brainStats">
          <button class="bstat" data-tab="agents" title="Mở Studio · Agents">
            <span class="bstat-num" id="statAgents">-</span>
            <span class="bstat-lbl">AGENTS</span>
          </button>
          <span class="bstat-sep"></span>
          <button class="bstat" data-tab="skills" title="Mở Studio · Skills">
            <span class="bstat-num" id="statSkills">-</span>
            <span class="bstat-lbl">SKILLS</span>
          </button>
          <span class="bstat-sep"></span>
          <button class="bstat" data-tab="workflows" title="Mở Studio · Workflows">
            <span class="bstat-num" id="statWorkflows">-</span>
            <span class="bstat-lbl">WORKFLOWS</span>
          </button>
        </div>

        <!-- MỨC DÙNG token đã chuyển thành trang riêng "Mức dùng" trong rail (nhóm Hệ thống) - có đồ thị 14 ngày. -->

        <!-- Popup sửa note: neo absolute BÊN TRONG .hud-center → đè lên visual não, cây trái & chat phải vẫn sống.
             Nội dung (toolbar + thân) do console.js openNote() dựng theo loại file. -->
        <div class="note-editor" id="noteEditor" hidden>
          <div class="ne-bar">
            <!-- Lùi / Tiến giữa các note. Đặt BÊN TRÁI tên file, đúng chỗ trình duyệt nào cũng
                 để nó, nên không phải học. console.js _neVeNutLui() dựng theo vệt đường đi. -->
            <span class="ne-nav" id="neNav"></span>
            <span class="ne-title" id="neTitle">note.md</span>
            <span class="ne-actions" id="neActions"></span>
          </div>
          <div class="ne-body" id="neBody"></div>
        </div>
      </div>

      <!-- RIGHT: transcript + activity -->
      <aside class="hud-right">
        <div class="panel-label">
          <span>HỘI THOẠI</span>
          <span style="display:flex;align-items:center;gap:6px">
            <span class="engine-badge" id="engineBadge" title="Engine + model THẬT đang chạy (lấy từ server - không phải tên model tự nhận)">-</span>
            <button class="mini-btn" id="chatZoomBtn" title="Mở trang Trò chuyện (khung chat toàn màn)"><i data-ic="maximize"></i></button>
          </span>
        </div>
        <!-- MỨC DÙNG token đã DỜI xuống góc dưới-phải khung giữa (giải phóng chỗ cho khung chat). -->
        <div class="transcript" id="chatArea"></div>
        <!-- Thanh #toolBar cũ ĐÃ BỎ: trạng thái "đang suy nghĩ / gọi tool" giờ hiện bằng
             chip hoạt động NGAY TRONG #chatArea (app.js showActivity) → tự đi theo cả khi
             phóng to chat workspace (chat-zoom chỉ dời #chatArea, trước đây toolBar bị bỏ lại). -->
        <!-- "BỘ NHỚ DÀI HẠN" + auto-reflect "sau mỗi 6 lượt" ĐÃ BỎ: engine tự học mới (learn.py)
             rewire sau MỖI lượt (có debounce, read-only, undo được). Cấu hình + xem "đã học gì" +
             hoàn tác ở trang sidebar "Tự học" (console.js renderLearn). Widget cũ vốn là UI chết,
             không còn JS nào gắn vào (autoLearnToggle/learnBtn/memCount không có handler). -->

        <!-- HỆ THỐNG + MCP ĐANG DÙNG đã DỜI xuống thanh model-bar (ngang hàng ô chọn model). -->


        <!-- ===== CÀI ĐẶT: avatar + tên miền + giọng nói + tốc độ (console.js nhúng vào trang Cài đặt) ===== -->
        <details class="quick-set" id="quickSet" open>
          <summary class="panel-label" style="cursor:pointer;list-style:none;user-select:none">
            <i data-ic="settings"></i> CÀI ĐẶT NHANH <i class="qs-caret" data-ic="chevron-right"></i>
          </summary>
          <div class="quick-set-body">

            <label class="qs-row">
              <span><i data-ic="volume-2"></i> Đọc trả lời bằng giọng</span>
              <span class="toggle"><input type="checkbox" id="qsTts" checked><span></span></span>
            </label>

            <!-- Nhà cung cấp giọng đọc: console.js render vào đây khi mở trang Cài đặt (gộp cùng nhóm giọng nói) -->
            <div id="ttsProviderHost"></div>

            <!-- Giọng đọc + ngôn ngữ nghe + tốc độ (dời từ header xuống, giữ nguyên id/name) -->
            <div class="voice-picker-wrap">
              <button id="voicePickerBtn" style="display:none" aria-hidden="true"></button>
              <div class="voice-popover" id="voicePopover">
                <div class="popover-section">
                  <div class="popover-label">NGÔN NGỮ NGHE</div>
                  <div class="voice-options">
                    <label class="voice-opt">
                      <input type="radio" name="recognitionLang" value="vi-VN" checked>
                      <div><strong>Tiếng Việt</strong><div class="opt-sub">vi-VN · mặc định</div></div>
                    </label>
                    <label class="voice-opt">
                      <input type="radio" name="recognitionLang" value="en-US">
                      <div><strong>Tiếng Anh</strong><div class="opt-sub">en-US · khi nói toàn Anh</div></div>
                    </label>
                  </div>
                </div>
                <div class="popover-section" id="edgeVoiceSection">
                  <div class="popover-label">GIỌNG ĐỌC <span class="dim" style="text-transform:none;letter-spacing:0">(Edge)</span></div>
                  <div class="voice-options">
                    <label class="voice-opt">
                      <input type="radio" name="voice" value="vi-VN-HoaiMyNeural" checked>
                      <div><strong>Ngọc Thu</strong><div class="opt-sub">Nữ · tự nhiên, ấm áp</div></div>
                    </label>
                    <label class="voice-opt">
                      <input type="radio" name="voice" value="vi-VN-NamMinhNeural">
                      <div><strong>Nam Minh</strong><div class="opt-sub">Nam · trầm</div></div>
                    </label>
                  </div>
                </div>
                <div class="popover-section">
                  <div class="popover-label">TỐC ĐỘ <span id="rateLabel" style="float:right;color:var(--accent);font-family:var(--font)">1.10×</span></div>
                  <input type="range" id="rateSlider" min="0.7" max="1.8" step="0.05" value="1.1" style="width:100%">
                  <div class="rate-marks"><span>Chậm</span><span>BT</span><span>Nhanh</span></div>
                </div>
                <div class="popover-section">
                  <button class="test-btn" id="testVoiceBtn">▶ Nghe thử</button>
                </div>
              </div>
            </div>

            <div class="qs-block">
              <div class="popover-label">ẢNH ĐẠI DIỆN</div>
              <div style="display:flex;align-items:center;gap:12px;margin:6px 0">
                <img id="brandLogoPreview" src="/brand-logo" alt="logo"
                     style="width:48px;height:48px;border-radius:10px;object-fit:cover;border:1px solid var(--border)">
                <div style="display:flex;flex-direction:column;gap:6px;flex:1">
                  <label class="s-btn" style="cursor:pointer;display:block;text-align:center">Tải ảnh lên
                    <input type="file" id="brandLogoInput" accept="image/png,image/jpeg,image/webp,image/gif" hidden></label>
                  <button class="s-btn-ghost" id="brandLogoReset">Khôi phục mặc định</button>
                </div>
              </div>
              <div class="opt-sub" id="brandLogoStatus"></div>
            </div>

            <div class="qs-block">
              <div class="popover-label">TÊN MIỀN & SSL</div>
              <div class="opt-sub dom-intro">Nhập tên miền để Javis kiểm tra DNS và hướng dẫn bật HTTPS theo đúng môi trường đang chạy.</div>
              <div class="dom-field">
                <input id="setDomain" placeholder="Ví dụ: javis.tencuaban.com" autocomplete="off" spellcheck="false">
                <button class="s-btn" id="saveDomain">Lưu &amp; kiểm tra</button>
              </div>
              <div class="dom-status" id="domStatusRow" style="display:none">
                <span class="dom-badge" id="dnsBadge">DNS: đang kiểm tra</span>
                <span class="dom-badge" id="sslBadge">SSL: đang kiểm tra</span>
              </div>
              <div class="dom-ssl" id="domSslRow" style="display:none">
                <button class="s-btn" id="sslToggle">Bật SSL</button>
                <button class="s-btn-ghost" id="checkDomain">Kiểm tra lại</button>
              </div>
              <div id="domainGuide" class="dom-guide" style="display:none"></div>
              <div class="opt-sub" id="domainStatus"></div>
              <div class="dom-docs">
                <a href="https://github.com/blogminhquy/javis-os/blob/main/docs/15-thuong-hieu-ten-mien.md" target="_blank" rel="noopener">Hướng dẫn cài tên miền ↗</a>
                <a href="https://github.com/blogminhquy/javis-os/blob/main/DEPLOY.md" target="_blank" rel="noopener">Hướng dẫn deploy/SSL ↗</a>
              </div>
            </div>

          </div>
        </details>
      </aside>
    </div>

    <!-- Việc nền đang sống của hội thoại này (app.js JavisBackground bơm nội dung, ẩn khi rỗng).
         Nằm NGAY trên khung nhập vì đó là chỗ mắt người dùng đang ở lúc họ tự hỏi "nó có chạy
         thật không". Được đăng ký trong CHAT_NODE_IDS (console.js) nên sang trang Trò chuyện
         là nó đi theo, không bị bỏ lại như thanh #toolBar cũ. -->
    <div class="bg-strip" id="bgStrip" hidden></div>

    <!-- Attachment chips -->
    <div class="attach-bar" id="attachBar"></div>

    <!-- Chọn model (đa nhà cung cấp) + effort ngay trên khung chat -->
    <div class="model-bar" id="modelBar">
      <button class="mb-chip" id="mbOpen" title="Đổi model / nhà cung cấp / effort">
        <span class="mb-dot"></span>
        <span id="mbModelTxt">Model</span>
        <span class="mb-sep">·</span>
        <span id="mbEffortTxt" class="mb-eff">Effort</span>
        <span class="mb-caret">▾</span>
      </button>
      <div class="mb-pop" id="mbPop" hidden></div>
      <!-- HỆ THỐNG + MCP ĐANG DÙNG: dời từ cột phải xuống đây, nằm ngang bên phải ô chọn model. -->
      <div class="sysbar" id="sysBar">
        <span class="sysbar-label">HỆ THỐNG</span>
        <div class="sys-status">
          <div class="mcp-item" id="claudeStatus"><i data-ic="circle" class="ic-fill ic-sm"></i> Claude Code CLI</div>
          <div class="mcp-item" id="ttsStatus"><i data-ic="circle" class="ic-fill ic-sm"></i> Voice (Edge TTS)</div>
        </div>
        <span class="sysbar-sep"></span>
        <span class="sysbar-label">MCP</span>
        <div id="mcpList" class="mcp-list"><div class="mcp-item dim">Chưa có hoạt động</div></div>
      </div>
    </div>

    <!-- ===== BOTTOM: voice bar ===== -->
    <div class="hud-voice" id="hudVoice">
      <button class="mic-big" id="voiceBtn" title="Bấm để nói (hoặc giữ Space)">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
        </svg>
      </button>
      <button class="attach-btn" id="attachBtn" title="Đính kèm file (ảnh, text, tài liệu) → lưu vào Sources">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
        </svg>
      </button>
      <button class="attach-btn tts-bar-btn" id="ttsToggleBar" type="button" title="Tắt giọng đọc">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>
        </svg>
      </button>
      <input type="file" id="fileInput" multiple style="display:none">
      <textarea id="chatInput" class="voice-input" placeholder="Nói với Javis, gõ ở đây, hoặc kéo/dán file vào..." rows="1"></textarea>
      <button class="stop-btn" id="stopBtn" title="Ngắt lệnh / dừng đọc (Esc)" style="display:none">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
      </button>
      <button class="send-btn" id="sendBtn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
      </button>
    </div>
  </div>

  <!-- Mobile-only: nền mờ khi mở ngăn kéo -->
  <div class="nav-backdrop" id="navBackdrop" hidden></div>

  <!-- ===== Console layer: rail điều hướng + trang quản lý (Alpine-driven) ===== -->
  <nav class="rail" x-data x-cloak :class="{ collapsed: $store.nav.collapsed }"
       x-effect="document.body.classList.toggle('rail-collapsed', $store.nav.collapsed)">
    <!-- ĐỈNH cố định -->
    <div class="rail-top">
      <div class="rail-brand"><img src="/brand-logo" alt="Javis" style="width:30px;height:30px;border-radius:8px;display:block;object-fit:cover"></div>
    </div>
    <!-- GIỮA cuộn được - gom theo nhóm; nhóm foot (Hệ thống) tự ghim xuống đáy -->
    <div class="rail-nav">
      <template x-for="g in $store.nav.groups" :key="g.label">
        <div class="rail-group" :class="{ foot: g.foot, open: $store.nav.isOpen(g.label), 'has-active': g.items.some(it => it.id === $store.nav.active) }">
          <button class="rail-grp-lbl" @click="$store.nav.toggleGroup(g.label)" :title="g.label">
            <span class="rail-grp-ico" x-html="g.icon"></span>
            <span class="grp-name" x-text="g.label"></span>
          </button>
          <div class="rail-grp-items">
            <template x-for="it in g.items" :key="it.id">
              <button class="rail-item" :class="{ active: $store.nav.active === it.id }"
                      @click="$store.nav.go(it.id)" :title="it.label">
                <span class="rail-ico" x-html="it.icon"></span>
                <span class="rail-lbl" x-text="it.label"></span>
              </button>
            </template>
          </div>
        </div>
      </template>
    </div>
    <!-- ĐÁY cố định: nút thu/mở + version + tác giả -->
    <div class="rail-foot">
      <button class="rail-collapse-btn" @click="$store.nav.toggleCollapsed()"
              :title="$store.nav.collapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'"
              x-html="$store.nav.collapseIcon"></button>
      <div class="rf-meta">
        <div class="rf-ver" id="railVersion">v0.0.0</div>
        <a class="rf-author" href="https://javisos.com" target="_blank" rel="noopener">by Minh Quý</a>
      </div>
    </div>
  </nav>

  <section class="cview" id="cview" x-data x-cloak x-show="$store.nav.active !== 'home'" x-transition.opacity.duration.200ms>
    <div class="cview-head">
      <div>
        <!-- meta.icon là TÊN icon Lucide (VIEW_ICON trong console.js) nên phải render
             qua ic() bằng x-html; x-text sẽ in nguyên tên ("brain", "bot"...) ra màn hình. -->
        <div class="cview-title"><span class="ico" x-html="ic($store.nav.meta.icon || 'sparkles')"></span> <span x-text="$store.nav.meta.label"></span></div>
        <div class="cview-sub" x-text="$store.nav.meta.sub"></div>
      </div>
    </div>
    <div class="cview-body" id="cviewBody"></div>
  </section>

  <!-- Studio tách thành các trang sidebar riêng (console.js render vào #cviewBody).
       Editor + run-drawer giờ là overlay TOP-LEVEL (dùng từ trang Workflows/Agents). -->
  <!-- Run output drawer -->
  <div class="run-drawer" id="runDrawer">
    <div class="run-head">
      <span id="runTitle">Chạy workflow</span>
      <button class="run-close" id="runClose"><i data-ic="x"></i></button>
    </div>
    <div class="run-steps" id="runSteps"></div>
  </div>
  <!-- Editor modal (agent/workflow) -->
  <div class="studio-editor" id="studioEditor">
    <div class="editor-box" id="editorBox"></div>
  </div>

  <!-- Vault structure banner -->
  <div class="vault-banner" id="vaultBanner">
    <i class="vb-icon" data-ic="triangle-alert"></i>
    <span class="vb-text" id="vbText">Cấu trúc vault chưa chuẩn cho Javis.</span>
    <button class="vb-init" id="vbInit">Khởi tạo cấu trúc</button>
    <button class="vb-close" id="vbClose"><i data-ic="x"></i></button>
  </div>

  <!-- Drag-drop overlay -->
  <div class="drop-overlay" id="dropOverlay">
    <div class="drop-msg"><i data-ic="paperclip"></i> Thả file vào đây → lưu vào Sources</div>
  </div>

  <!-- Folder picker modal -->
  <div class="modal-overlay" id="folderModal">
    <div class="folder-modal">
      <div class="fm-head">
        <span><i data-ic="folder-open"></i> Chọn brain (folder chứa ghi chú .md)</span>
        <button class="fm-close" id="fmClose"><i data-ic="x"></i></button>
      </div>
      <div class="fm-path" id="fmPath">-</div>
      <div class="fm-list" id="fmList"></div>
      <div class="fm-foot">
        <span class="fm-hint" id="fmHint"></span>
        <button class="fm-use" id="fmUse">Dùng folder này</button>
      </div>
    </div>
  </div>

  <!-- Bộ cài đặt lần đầu (hiện khi chưa setup_done) -->
  <div class="modal-overlay" id="setupWizard">
    <div class="settings-modal" style="max-width:460px">
      <div class="fm-head"><img src="/brand-logo" alt="" style="width:24px;height:24px;border-radius:6px;vertical-align:middle;margin-right:6px;object-fit:cover"><span>Chào mừng tới Javis</span></div>
      <div class="settings-body">
        <style>
        .wz-prov{display:flex;flex-direction:column;gap:8px;margin-top:6px}
        .wz-card{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border:1px solid rgba(255,255,255,.14);border-radius:10px;cursor:pointer;transition:.15s}
        .wz-card:hover{border-color:rgba(255,138,60,.5)} .wz-card.sel{border-color:#ff8a3c;background:rgba(255,138,60,.12)}
        .wz-card input{margin-top:3px;accent-color:#ff8a3c} .wz-card b{font-size:15px;color:#e7eefc}
        .wz-rec{font-size:12px;background:#ff8a3c;color:#1a1a1a;border-radius:6px;padding:1px 6px;margin-left:6px;font-weight:700}
        .wz-pdesc{font-size:15px;color:#9fb0cf;margin-top:3px;line-height:1.45}
        .wz-tokhelp{border:1px solid rgba(255,138,60,.3);background:rgba(255,138,60,.06);border-radius:10px;padding:10px 12px;margin-top:8px;font-size:14px;color:#cdd8ee;line-height:1.55}
        .wz-tokhelp ol{margin:6px 0 4px 18px;padding:0} .wz-tokhelp li{margin:3px 0}
        .wz-tokhelp code,#wzProvHint code{background:rgba(0,0,0,.35);padding:1px 5px;border-radius:4px;font-size:13px}
        #wzProvHint{margin-top:8px;font-size:15px;color:#8aa}
        </style>
        <div class="set-note">Vài bước nhanh để bắt đầu. Mọi thứ đổi lại được sau trong <i data-ic="settings"></i> Cài đặt.</div>
        <div class="set-sec">
          <h4>1. Workspace</h4>
          <label>Tên hiển thị</label><input id="wzWsName" placeholder="Javis OS">
        </div>
        <div class="set-sec">
          <h4>2. Tài khoản admin <span class="dim">(khuyến nghị)</span></h4>
          <div class="set-note">Đặt mật khẩu để chặn người lạ - quan trọng nếu đưa lên VPS. Bỏ trống nếu chỉ chạy máy cá nhân.</div>
          <label>Tài khoản</label><input id="wzUser" placeholder="Ví dụ: admin">
          <label>Mật khẩu</label><input id="wzPass" type="password" placeholder="Để trống nếu không đặt mật khẩu">
          <div id="wzTokenWrap" style="display:none">
            <label>Mã thiết lập <span class="dim">(bảo mật)</span></label>
            <input id="wzToken" placeholder="Dán MÃ THIẾT LẬP từ log server">
            <div class="wz-tokhelp">
              <b><i data-ic="circle-help"></i> Mã thiết lập là gì?</b> Javis đang chạy trên server công khai. Để chắc <b>chính bạn</b> (không phải người lạ vô tình mở link) là người tạo tài khoản admin, bạn dán một mã chỉ in ra <b>log server</b> - nơi duy nhất chủ máy xem được.
              <br><b>Cách lấy mã (Hostinger → App terminal):</b>
              <ol>
                <li>Mở app → bấm <b>App terminal</b> (bạn sẽ vào BÊN TRONG container <code>javis</code>).</li>
                <li>Chạy: <code>cat /data/state/.setup_token</code></li>
                <li>Copy chuỗi hiện ra → dán vào ô trên.</li>
              </ol>
              <span class="dim">Nếu SSH vào HOST (không phải App terminal): <code>docker compose logs javis | grep "SETUP TOKEN"</code></span><br>
              <i data-ic="lightbulb"></i> <b>Khỏi cần mã:</b> nếu lúc deploy bạn đặt sẵn env <code>JAVIS_ADMIN_PASSWORD</code> (+ <code>JAVIS_ADMIN_USER</code>), mở app ra là <b>đăng nhập luôn</b>, không hỏi mã.
            </div>
          </div>
        </div>
        <div class="set-sec">
          <h4>3. Nhà cung cấp AI (bộ não)</h4>
          <div class="set-note">Chọn 1 nhà cung cấp chính. Đổi lại được trong <i data-ic="cpu"></i> <b>Models</b>.</div>
          <div class="wz-prov" id="wzProv">
            <label class="wz-card" data-prov="anthropic-cli">
              <input type="radio" name="wzprov" value="anthropic-cli" checked>
              <div><b><i data-ic="brain"></i> Claude Code <span class="wz-rec">khuyên dùng</span></b>
                <div class="wz-pdesc">Đăng nhập subscription Claude → đủ MCP, skill, đọc/ghi file, vòng lặp tự cải thiện. Mạnh & đầy đủ nhất.</div></div>
            </label>
            <label class="wz-card" data-prov="openai-oauth">
              <input type="radio" name="wzprov" value="openai-oauth">
              <div><b><i data-ic="message-circle"></i> ChatGPT (gói subscription)</b>
                <div class="wz-pdesc">Đăng nhập ChatGPT Plus/Pro (qua Codex) → vẫn dùng được MCP của Javis. Hợp nếu bạn đã có gói ChatGPT.</div></div>
            </label>
            <label class="wz-card" data-prov="openrouter">
              <input type="radio" name="wzprov" value="openrouter">
              <div><b><i data-ic="globe"></i> OpenRouter</b>
                <div class="wz-pdesc">Nhiều model giá rẻ một chỗ, vẫn đủ MCP Javis + skill + đọc/ghi file brain. Chỉ cần API key - không cần đăng nhập.</div></div>
            </label>
          </div>
          <div id="wzOrKey" style="display:none">
            <label>OpenRouter API key <span class="dim">(có thể dán sau ở Models)</span></label>
            <input id="wzOrKeyInput" placeholder="Ví dụ: sk-or-v1-… (tùy chọn)">
          </div>
          <div id="wzProvHint"></div>
        </div>
        <div class="set-actions"><button class="s-btn" id="wzFinish">Bắt đầu dùng Javis →</button></div>
        <div class="auth-err" id="wzErr"></div>
      </div>
    </div>
  </div>

  <!-- Đăng nhập (chỉ hiện khi admin đã đặt mật khẩu & chưa đăng nhập) -->
  <div class="modal-overlay" id="authOverlay">
    <div class="folder-modal auth-modal">
      <div class="fm-head"><img src="/brand-logo" alt="" style="width:24px;height:24px;border-radius:6px;vertical-align:middle;margin-right:6px;object-fit:cover"><span id="authTitle">Đăng nhập Javis</span></div>
      <div class="auth-body">
        <input id="authUser" placeholder="Tài khoản" autocomplete="username">
        <input id="authPass" type="password" placeholder="Mật khẩu" autocomplete="current-password">
        <!-- Ô mã 2 lớp: ẩn cho tới khi server trả needs_2fa. Hiện sẵn từ đầu thì người CHƯA bật
             2FA phải nhìn một ô họ không hiểu, mỗi lần đăng nhập. inputmode=numeric để điện
             thoại bật bàn phím số; autocomplete=one-time-code để iOS/Android tự điền từ SMS/app. -->
        <div id="authCodeWrap" style="display:none">
          <input id="authCode" inputmode="numeric" autocomplete="one-time-code"
                 placeholder="Mã 6 số, hoặc mã khôi phục">
          <div class="auth-hint">Mở app Authenticator và nhập mã đang hiện. Mất điện thoại thì
            nhập một mã khôi phục đã lưu lúc bật.</div>
        </div>
        <button class="fm-use" id="authSubmit">Đăng nhập</button>
        <div class="auth-err" id="authErr"></div>
        <div class="auth-help"><span id="authForgot">Quên mật khẩu?</span></div>
        <div class="auth-reset" id="authResetInfo" style="display:none">
          Mở file <code>server/settings.json</code>, xóa khối <code>"auth"</code> (hoặc đặt rỗng), rồi
          chạy <code>stop-javis.bat</code> → <code>start-javis.vbs</code>. Mở lại sẽ về bộ cài đặt để tạo tài khoản mới.
        </div>
      </div>
    </div>
  </div>

  <!-- Cài đặt -->
  <div class="modal-overlay" id="settingsOverlay">
    <div class="settings-modal">
      <div class="fm-head"><span><i data-ic="settings"></i> Cài đặt Javis</span><button class="fm-close" id="settingsClose"><i data-ic="x"></i></button></div>
      <div class="settings-body">
        <div class="set-sec">
          <h4>Chung</h4>
          <label>Tên workspace</label><input id="setWsName">
          <button class="s-btn" id="saveGeneral">Lưu</button>
        </div>
        <div class="set-sec">
          <h4>Model</h4>
          <label>Engine xử lý chat</label>
          <select id="setEngine">
            <option value="cli">Claude Code CLI - MCP Javis + skill + loop + lệnh máy</option>
            <option value="openrouter">OpenRouter - MCP Javis + skill + loop (không lệnh máy)</option>
          </select>
          <label>Model Claude (khi dùng CLI)</label>
          <select id="setClaudeModel">
            <option value="">Mặc định</option><option value="sonnet">Sonnet</option>
            <option value="opus">Opus</option><option value="haiku">Haiku</option>
          </select>
          <label>OpenRouter API key <span class="dim" id="setKeyHint"></span></label>
          <input id="setOrKey" type="password" placeholder="Ví dụ: sk-or-... (để trống nếu không đổi)">
          <label>OpenRouter model <button type="button" class="set-mini" id="loadModelsBtn">↻ Tải danh sách</button></label>
          <select id="setOrModelSel"><option value="__custom__">Nhập tên model khác (custom)…</option></select>
          <input id="setOrModel" placeholder="Ví dụ: openai/gpt-4o-mini" style="display:none">
          <div class="set-note">Danh sách model tải động từ OpenRouter. Không thấy model cần? Chọn "Nhập tên khác" rồi gõ chính xác id. OpenRouter sẽ kích hoạt ở bản kế (P2).</div>
          <button class="s-btn" id="saveModel">Lưu</button>
        </div>
        <div class="set-sec">
          <h4>Telegram</h4>
          <label class="loop-row" style="padding:0"><span>Bật bot Telegram</span>
            <label class="toggle"><input type="checkbox" id="setTgEnabled"><span></span></label></label>
          <label>Bot token <span class="dim" id="setTgHint"></span></label>
          <input id="setTgToken" type="password" placeholder="Ví dụ: 123456:ABC... (để trống nếu không đổi)">
          <label>Chat ID được phép dùng <span class="dim">(nhiều ID cách nhau dấu phẩy)</span></label>
          <input id="setTgChat" placeholder="Ví dụ: 123456789, 987654321">
          <div class="set-note" id="setTgStatus">-</div>
          <div class="set-note">Nhắn Telegram ↔ Javis. Dùng đúng engine đang chọn (CLI thì có cả MCP để hỏi doanh thu/ads qua điện thoại). Có thể dùng lại token bot Morning Briefing.</div>
          <div class="set-actions">
            <button class="s-btn" id="saveTelegram">Lưu & bật</button>
            <button class="s-btn-ghost" id="testTelegram">Gửi test</button>
          </div>
        </div>
        <div class="set-sec">
          <h4>Tài khoản đăng nhập</h4>
          <div class="set-note" id="setAuthState"></div>
          <label>Tài khoản</label><input id="setAuthUser" placeholder="Ví dụ: admin">
          <!-- Mật khẩu hiện tại: chỉ hiện khi ĐÃ có tài khoản (app.js refreshAuthRow bật lên).
               Server đòi nó để một phiên bị mượn không đổi được mật khẩu rồi khoá chính chủ. -->
          <label id="setAuthCurLbl" hidden>Mật khẩu hiện tại</label>
          <input id="setAuthCur" type="password" autocomplete="current-password" placeholder="Mật khẩu đang dùng" hidden>
          <label>Mật khẩu</label><input id="setAuthPass" type="password" autocomplete="new-password" placeholder="Đặt mật khẩu (để trống nếu không đổi)">
          <div class="set-actions">
            <button class="s-btn" id="savePassword">Lưu tài khoản</button>
            <button class="s-btn-ghost" id="logoutBtn">Đăng xuất</button>
            <button class="s-btn-ghost" id="disableAuthBtn">Tắt đăng nhập</button>
          </div>
          <div class="set-note">Đặt mật khẩu để chặn người lạ khi đưa Javis lên VPS. Lưu ý: trên VPS nên chạy sau HTTPS (reverse proxy).</div>
          <!-- Xác thực 2 lớp: CỐ Ý chỉ là dòng trạng thái + lối đi, không phải luồng bật đầy đủ.
               Màn quét QR nằm ở trang Tài khoản. Bê nguyên luồng đó sang đây là có hai bản sao
               của một tính năng bảo mật, và chỗ nào quên sửa thì chỗ đó thành lỗ.
               Nội dung do console.js đổ vào (renderTfaRow) vì nó cần hỏi /auth/status. -->
          <div class="set-tfa" id="setTfaRow" hidden></div>
        </div>
        <div class="set-note" style="opacity:.7">Ảnh đại diện, tên miền, giọng nói &amp; tốc độ nằm trong trang <b>Cài đặt</b>.</div>
      </div>
    </div>
  </div>

  <!-- Holder ẩn giữ #quickSet khi KHÔNG ở trang Cài đặt (node vẫn trong DOM → handler còn sống) -->
  <div id="quickSetHolder" hidden></div>

  <!-- Bộ icon nạp ĐẦU TIÊN: mọi file dưới đây gọi ic() lúc render, thiếu nó thì
       icon ra rỗng. lucide-icons.js chỉ định nghĩa dữ liệu nên phải đứng trước
       icons.js (file dựng hàm ic / Icons). Cả hai đều không phụ thuộc DOM. -->
  <script src="/static/vendor/lucide-icons.js?v=3"><\/script>
  <script src="/static/icons.js?v=2"><\/script>

  <!-- theme.js phải nạp TRƯỚC mọi file khác: graph.js / app.js đăng ký
       hàm vẽ lại theo tông ngay lúc parse, nếu window.javisTheme chưa có thì chúng
       đăng ký hụt và các lớp canvas kẹt ở bảng màu tối. -->
  <script src="/static/theme.js?v=1"><\/script>
  <script src="/static/voice.js?v=14"><\/script>
  <script src="/static/graph.js?v=16"><\/script>
  <script src="/static/chat-render.js?v=9"><\/script>
  <script src="/static/code-hl.js?v=1"><\/script>
  <script src="/static/dataview.js?v=1"><\/script>
  <script src="/static/task-suggest.js?v=1"><\/script>
  <!-- Bảng lệnh của trình soạn .md (nút thanh công cụ + phím tắt + menu "/"). PHẢI đứng
       trước console.js: _neBuildToolbar đọc window.JavisEditorCmds để vẽ nút. -->
  <script src="/static/editor-cmds.js?v=1"><\/script>
  <script src="/static/file-editor.js?v=8"><\/script>
  <script src="/static/chat-ask.js?v=1"><\/script>
  <script src="/static/chat-slash.js?v=1"><\/script>
  <script src="/static/chat-acts.js?v=1"><\/script>
  <script src="/static/chat-marks.js?v=1"><\/script>
  <script src="/static/app.js?v=85"><\/script>
  <!-- Sau app.js: dải việc nền đọc window.JavisSessions (app.js dựng) để biết phiên + brain. -->
  <script src="/static/background-strip.js?v=1"><\/script>
  <script src="/static/model-picker.js?v=3"><\/script>
  <script src="/static/branding.js?v=7"><\/script>
  <script src="/static/quick-settings.js?v=4"><\/script>
  <script src="/static/chat-zoom.js?v=6"><\/script>
  <script src="/static/brains-ui.js?v=7"><\/script>
  <script src="/static/sessions-ui.js?v=12"><\/script>
  <script src="/static/studio.js?v=27"><\/script>
  <script src="/static/chatbots.js?v=10"><\/script>
  <!-- Dashboard Token (trang Mức dùng nâng cấp): nạp TRƯỚC console.js để renderUsage ủy quyền được. -->
  <script src="/static/usage.js?v=1"><\/script>
  <!-- Trang Code (terminal): nạp TRƯỚC console.js để renderCode ủy quyền được. File này CHỈ có
       phần khung - xterm.js (285KB) nạp lười ở lần đầu mở tab, không nằm trong đường khởi động. -->
  <script src="/static/code-term.js?v=2"><\/script>
  <!-- Console layer: console.js đăng ký store TRƯỚC khi Alpine khởi động (defer) -->
  <script src="/static/console.js?v=107"><\/script>
  <script src="/static/mobile-chat.js?v=5"><\/script>
  <script src="/static/brain-view.js?v=1"><\/script>
  <script src="/static/notifications.js?v=1"><\/script>
  <!-- (Nút đổi tông TỐI ↔ SÁNG: theme.js đã nạp ở đầu khối script phía trên) -->
  <!-- Alpine self-host (dashboard/vendor): bản unpkg đo được 2.1s lúc first load + chết khi offline -->
  <script defer src="/static/vendor/alpinejs-3.14.1.min.js?v=1"><\/script>
</body>
</html>
`,Kr=`/* ============================================================================
   TÔNG MÀU - hai bộ token đầy đủ: TỐI (mặc định) và SÁNG (data-theme="light").
   ----------------------------------------------------------------------------
   Luật: mọi màu phụ thuộc tông phải đi qua biến ở đây. Màu gõ thẳng trong thân
   file chỉ được phép khi nó KHÔNG đổi theo tông (vd màu logo, màu cú pháp code
   đã có biến riêng). Thêm màu mới mà quên khai biến là tông sáng vỡ chỗ đó.

   Vì sao cần nhiều biến hơn bộ nền/chữ cơ bản: giao diện tối dựng bằng ba thủ
   pháp mà nền sáng không có: mặt kính trắng-mờ chồng lên nền tối, bóng đen để
   tách lớp, và quầng phát sáng. Trên nền trắng cả ba đều vô hình hoặc thành vết
   bẩn, nên chúng được tách thành token riêng (--surface-*, --shadow-*, --*-wash)
   để tông sáng thay bằng thủ pháp tương đương: tô sẫm nhẹ, bóng nâu rất nhạt,
   và viền vòng thay cho quầng sáng.
   ========================================================================== */
:root {
  /* Báo cho trình duyệt biết đang ở tông nào. Thiếu dòng này thì các thứ do TRÌNH
     DUYỆT tự vẽ vẫn giữ mặc định sáng/tối cũ: thanh cuộn hệ thống, caret, ô date,
     select popup, checkbox, và nền vàng của autofill. CSS không với tới chúng. */
  color-scheme: dark;
  --bg: #0e0e16;
  --bg2: #181822;
  --bg3: #22222e;
  --border: #36364c;
  --accent: #ff7a3c;
  --accent2: #8b5cf6;
  --text: #f3f3fb;
  --text2: #c0c0da;
  --text3: #9a9ab6;
  --green: #34d36b;
  --red: #f4565a;
  --yellow: #f0c020;
  --font: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  --mono: 'SF Mono', 'Fira Code', 'Consolas', ui-monospace, monospace;

  /* --- Mực: màu dùng cho CHỮ. Khác --accent/--accent2 (dùng để tô nền, viền,
         quầng sáng). Trên nền tối chữ nhấn phải sáng hơn nền; trên nền trắng nó
         phải đậm hơn hẳn, nếu bê nguyên #ff7a3c sang chỉ đạt 3.4:1 - đọc mỏi. --- */
  --text-hi: #ffffff;              /* chữ bật lên khi hover/chọn */
  --accent-ink: #ffab81;
  --accent2-ink: #d5b5ff;
  /* Cam để TÔ ĐẶC nút có chữ đè lên. Tách khỏi --accent vì tương phản là ĐỐI XỨNG:
     một màu vừa nổi trên nền trắng vừa đỡ được chữ trắng là bất khả. --accent giữ
     cam thương hiệu cho chấm/gạch/viền (không mang chữ), --accent-solid sẫm hơn
     để chữ trắng đặt lên vẫn đạt chuẩn đọc. */
  --accent-solid: #ff7a3c;

  /* --- Mặt phẳng nổi chồng lên nền (nút mờ, thẻ, dòng hover) --- */
  --surface-1: rgba(255, 255, 255, 0.025);
  --surface-2: rgba(255, 255, 255, 0.052);
  --surface-3: rgba(255, 255, 255, 0.085);
  --hairline: rgba(255, 255, 255, 0.08);      /* viền mảnh trên mặt kính */
  --sunken: rgba(0, 0, 0, 0.25);              /* ô nhập liệu chìm xuống */

  /* --- Bóng đổ theo 3 độ cao --- */
  --shadow-1: 0 4px 14px rgba(0, 0, 0, 0.28);
  --shadow-2: 0 8px 30px rgba(0, 0, 0, 0.45);
  --shadow-3: 0 24px 70px rgba(0, 0, 0, 0.62);
  --shadow-veil: rgba(0, 0, 0, 0.5);          /* MÀU bóng (không phải cả box-shadow) cho
                                                 mép ngăn kéo trượt - cần tự đặt offset */

  /* --- Vùng nhuộm màu nhấn (nền cảnh báo, thẻ chưa đọc, nút chính) --- */
  --accent-wash: rgba(255, 101, 45, 0.07);
  --accent-wash-2: rgba(255, 105, 45, 0.12);
  --accent-line: rgba(255, 130, 67, 0.30);
  --accent-ring: 0 0 18px rgba(255, 107, 43, 0.20);
  --accent2-wash: rgba(159, 104, 255, 0.12);
  --accent2-wash-2: rgba(124, 58, 237, 0.22);
  --accent2-line: rgba(124, 58, 237, 0.4);

  /* --- Nền của khối chứa chữ. Tách riêng vì đây là cụm làm vỡ tông sáng nặng
         nhất: chỗ nào gõ cứng nền tối mà chữ lấy từ var(--text) thì lật sáng
         thành chữ đen trên nền đen. --- */
  --field-bg: rgba(20, 20, 30, 0.8);      /* ô nhập, select, nút chìm */
  --panel-bg: rgba(15, 16, 25, 0.78);     /* khay/thẻ mờ trôi trên nền */
  --panel-solid: rgba(10, 14, 26, 0.97);  /* panel đặc (ngăn kéo, popup) */
  --scrim: rgba(3, 3, 8, 0.8);            /* màn che sau modal */

  /* --- Hộp thoại thông tin (xanh) --- */
  --info-ink: #cfe0ff;
  --info-wash: rgba(15, 22, 40, 0.85);
  --info-line: rgba(120, 180, 255, 0.35);

  /* --- Màu ngữ nghĩa lẻ --- */
  --link-ink: #7fb0ff;
  --on-accent: #1a1400;      /* chữ đặt TRÊN nền màu nhấn/vàng đặc */

  /* --- Trạng thái: cảnh báo / nguy hiểm / xong. Mỗi trạng thái một bộ ba
         mực-nền-viền để dùng nhất quán ở mọi thẻ, banner, badge. --- */
  --warn-ink: #e0a04a;
  --warn-wash: rgba(210, 160, 60, 0.14);
  --warn-line: rgba(210, 160, 60, 0.5);
  --danger-wash: rgba(210, 70, 70, 0.14);
  --danger-line: rgba(210, 70, 70, 0.5);
  --ok-wash: rgba(44, 122, 75, 0.16);
  --ok-line: rgba(44, 122, 75, 0.5);

  /* --- Khối code: bảng cú pháp riêng, không suy ra được từ token nền --- */
  --code-bg: #0c0c16;
  --code-ink: #d6c9ff;
  --tok-c: #6b7a8f;          /* chú thích */
  --tok-s: #7ee787;          /* chuỗi */
  --tok-n: #f0883e;          /* số */
  --tok-k: #c792ea;          /* từ khoá */
  --tok-t: #79c0ff;          /* tên thẻ HTML/XML */
  --tok-a: #ffa657;          /* tên thuộc tính, tên trường JSON, thuộc tính CSS */

  /* --- KHOANG NÃO (.hud-center) --- */
  --brain-bg: radial-gradient(ellipse 55% 55% at 50% 48%,
    rgba(124, 58, 237, 0.20) 0%, rgba(70, 40, 140, 0.10) 32%,
    rgba(20, 12, 40, 0.04) 55%, #03030a 78%);
  --brain-vignette: radial-gradient(ellipse 70% 70% at 50% 46%,
    transparent 45%, rgba(3, 3, 10, 0.55) 100%);
  --brain-glass: rgba(16, 14, 28, 0.55);
  --brain-glass-brd: rgba(185, 140, 255, 0.36);
  --brain-glass-shadow: 0 6px 24px rgba(0, 0, 0, 0.45);
  --brain-halo: 0 0 12px rgba(0, 0, 0, 0.9);     /* viền chữ để đọc được trên đồ thị */
  --brain-ink: #d9c9ff;                          /* tên vùng khái niệm */
  --brain-ink2: #8a7ab8;                         /* dòng phụ dưới tên vùng */
  --brain-ink-hot: #ff9d6b;                      /* vùng đang "nóng" */
}

/* ============================================================================
   TÔNG SÁNG - giấy ngà ấm, mực gần đen, nhấn cam đậm.
   Nền ngà #FBF9F7 thay vì trắng tinh: bớt chói khi nhìn lâu và hợp với cam
   thương hiệu hơn trắng lạnh. Thẻ/bảng để trắng thật nên vẫn nổi rõ trên nền.
   ========================================================================== */
:root[data-theme="light"] {
  color-scheme: light;
  --bg: #fbf9f7;
  --bg2: #ffffff;
  --bg3: #f7f4ef;
  --border: #e7e1da;
  --accent: #e85d1f;
  --accent2: #7c3aed;
  --text: #1c1a24;
  --text2: #55505f;
  --text3: #6e6878;
  --green: #15803d;
  --red: #d11f1f;
  --yellow: #96590a;

  --text-hi: #08060e;
  --accent-ink: #b4430d;
  --accent2-ink: #6d28d9;
  --accent-solid: #c2410c;   /* chữ trắng đặt lên đạt 5.2:1 */

  /* Nền sáng thì "nổi lên" = tô SẪM nhẹ, ngược hẳn với nền tối. Sắc nâu ấm
     (60,42,24) thay vì đen thuần để không bị xám xịt trên giấy ngà. */
  --surface-1: rgba(60, 42, 24, 0.035);
  --surface-2: rgba(60, 42, 24, 0.062);
  --surface-3: rgba(60, 42, 24, 0.095);
  --hairline: rgba(60, 42, 24, 0.11);
  --sunken: rgba(60, 42, 24, 0.045);

  --shadow-1: 0 2px 8px rgba(76, 58, 38, 0.07);
  --shadow-2: 0 8px 24px rgba(76, 58, 38, 0.10);
  --shadow-3: 0 22px 58px rgba(76, 58, 38, 0.16);
  --shadow-veil: rgba(76, 58, 38, 0.16);

  --accent-wash: rgba(232, 93, 31, 0.075);
  --accent-wash-2: rgba(232, 93, 31, 0.14);
  --accent-line: rgba(232, 93, 31, 0.34);
  /* Quầng toả sáng vô nghĩa trên giấy - đổi thành vòng đặc ôm sát viền. */
  --accent-ring: 0 0 0 3px rgba(232, 93, 31, 0.13);
  --accent2-wash: rgba(124, 58, 237, 0.10);
  --accent2-wash-2: rgba(124, 58, 237, 0.17);
  --accent2-line: rgba(124, 58, 237, 0.34);

  /* Ô nhập trên giấy: trắng có viền, KHÔNG tô sẫm - tô sẫm làm chữ nhập vào
     nhìn như đang bị vô hiệu hoá. Khay/panel thì trắng thật để nổi trên nền ngà. */
  --field-bg: #ffffff;
  --panel-bg: rgba(255, 255, 255, 0.9);
  --panel-solid: #ffffff;
  --scrim: rgba(46, 34, 22, 0.34);

  --info-ink: #1e40af;
  --info-wash: rgba(59, 130, 246, 0.09);
  --info-line: rgba(59, 130, 246, 0.36);

  --link-ink: #1d4ed8;
  --on-accent: #ffffff;      /* nền vàng tông sáng là #a16207 (sẫm) nên chữ phải trắng */

  /* Trên giấy, nền trạng thái phải NHẠT hơn hẳn (7-10% thay vì 14-16%) còn mực
     thì ĐẬM hơn hẳn - ngược chiều với nền tối. */
  --warn-ink: #96590a;
  --warn-wash: rgba(180, 120, 20, 0.10);
  --warn-line: rgba(161, 98, 7, 0.38);
  --danger-wash: rgba(220, 38, 38, 0.08);
  --danger-line: rgba(220, 38, 38, 0.34);
  --ok-wash: rgba(21, 128, 61, 0.09);
  --ok-line: rgba(21, 128, 61, 0.34);

  /* Khối code cũng sáng theo, không giữ đảo tối: một mảng đen giữa trang giấy
     nhìn như thủng lỗ, và chuyển tông đột ngột làm mỏi mắt khi đọc xen kẽ. */
  --code-bg: #f6f2ec;
  --code-ink: #2c2438;
  --tok-c: #6f6880;
  --tok-s: #0a7d3f;
  --tok-n: #b4430d;
  --tok-k: #7c3aed;
  --tok-t: #0b5fa5;
  --tok-a: #9a5b00;

  /* Khoang não: giấy ngà có quầng lavender-đào rất nhạt ở giữa, tối dần ra rìa
     bằng chính màu giấy (không phải bằng màu đen). */
  --brain-bg: radial-gradient(ellipse 58% 54% at 50% 43%,
      rgba(124, 58, 237, 0.13) 0%, rgba(124, 58, 237, 0.06) 30%,
      rgba(232, 93, 31, 0.05) 52%, rgba(255, 255, 255, 0) 72%),
    linear-gradient(176deg, #fffdfc 0%, #faf6f1 46%, #f2ebe2 100%);
  --brain-vignette: radial-gradient(ellipse 74% 74% at 50% 43%,
    transparent 40%, rgba(226, 215, 201, 0.5) 100%);
  --brain-glass: rgba(255, 255, 255, 0.86);
  --brain-glass-brd: rgba(60, 42, 24, 0.13);
  --brain-glass-shadow: 0 6px 20px rgba(76, 58, 38, 0.11);
  /* Trên giấy, chữ đè lên đồ thị cần viền TRẮNG để tách khỏi dây nối. */
  --brain-halo: 0 1px 2px rgba(255, 255, 255, 0.95), 0 0 9px rgba(255, 255, 255, 0.92);
  --brain-ink: #4a3568;
  --brain-ink2: #6f6486;
  --brain-ink-hot: #c2410c;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  height: 100vh;
  overflow: hidden;
}

/* ===== HUD shell ===== */
.hud {
  display: grid;
  /* 4 hàng: top · thân (giãn hết) · thanh đính kèm (auto, 0 khi trống) · ô chat.
     Trước đây chỉ khai báo 3 hàng nên attach-bar chiếm mất hàng 70px → chừa 1 dải trống
     full-width phía trên khung chat. Để 'auto' cho attach-bar là nó tự co về 0 khi rỗng.
     0.9.229: hàng cuối 70px cứng thực ra rơi vào model-bar (5 con trong flow mà chỉ khai 4 hàng),
     ô chat rớt xuống hàng ngầm dán sát mép dưới. Khai đủ 5 hàng auto, khoảng thở giao cho
     margin/padding của từng tầng. */
  grid-template-rows: 52px 1fr auto auto auto;
  height: 100vh;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}
.hud > * { min-width: 0; }

/* TOP */
.hud-top {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;   /* trái + phải theo nội dung, giữa co giãn → cụm trái đủ chỗ, không ép xuống dòng */
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid var(--border);
  background: var(--bg2);
}
/* 3 nhóm header bám 3 cột: trái (brand + chọn brain), giữa (tên + ngày), phải (nút theme + cụm nút).
   Con bị ẩn (.brand, .hud-actions khi in-console) chỉ tự co, nhóm vẫn giữ cột → cân ở mọi chế độ. */
.hud-top-left { display: flex; align-items: center; gap: 14px; justify-self: start; }
.hud-top-right { display: flex; align-items: center; gap: 8px; justify-self: end; }
.brand { display: flex; align-items: center; gap: 8px; }
.brand-icon { color: var(--accent); font-size: 18px; }
.brand-text { font-family: var(--font); font-size: 15px; font-weight: 700; letter-spacing: 3px; }
.hud-center-title {
  min-width: 0; display: flex; align-items: center; justify-content: center; gap: 10px;
  white-space: nowrap; overflow: visible;
}
.ws-name { font-weight: 600; font-size: 16px; }
.ws-date { margin-left: 10px; font-size: 13px; color: var(--text2); font-family: var(--font); }
.notification-trigger {
  position: relative; min-width: 38px; height: 34px; padding: 0 11px;
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  border: 1px solid var(--accent-line); border-radius: 10px;
  color: var(--text2); background: var(--bg3);
  font-family: var(--font); font-size: 12px; font-weight: 600;
  cursor: pointer; transition: border-color .2s, background .2s, color .2s, box-shadow .2s, transform .2s;
}
.notification-trigger:hover,
.notification-trigger[aria-expanded="true"] {
  color: var(--text-hi); border-color: var(--accent); background: var(--accent-wash-2);
  box-shadow: 0 0 0 3px var(--accent-wash), var(--shadow-1);
}
.notification-trigger:active { transform: scale(.96); }
.notification-trigger svg {
  width: 17px; height: 17px; fill: none; stroke: currentColor; stroke-width: 1.8;
  stroke-linecap: round; stroke-linejoin: round;
}
.notification-trigger.has-unread {
  color: var(--text-hi); border-color: var(--accent);
  background: var(--accent-wash-2);
  box-shadow: var(--accent-ring);
}
.notification-trigger.has-unread::before {
  content: ""; position: absolute; inset: -2px; border: 1px solid var(--accent-line);
  border-radius: 11px; pointer-events: none;
  animation: notiPulse 2.2s ease-out infinite;
}
@keyframes notiPulse {
  0%, 45% { opacity: 0; transform: scale(1); }
  65% { opacity: .7; }
  100% { opacity: 0; transform: scale(1.10); }
}
.notification-badge {
  min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px;
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--on-accent); background: var(--accent-solid); box-shadow: 0 0 10px rgba(255,99,47,.55);
  font-size: 10px; font-weight: 700; line-height: 1;
}
.notification-badge[hidden] { display: none; }
.notification-shade { position: fixed; inset: 0; z-index: 169; background: transparent; }
.notification-shade[hidden], .notification-panel[hidden] { display: none; }
.notification-panel {
  position: fixed; top: 60px; right: 18px; z-index: 170;
  width: min(410px, calc(100vw - 28px)); max-height: min(620px, calc(100dvh - 90px));
  display: flex; flex-direction: column; overflow: hidden;
  color: var(--text); background: var(--bg2);
  border: 1px solid var(--accent-line); border-radius: 16px;
  box-shadow: var(--shadow-3), 0 0 0 1px var(--surface-1);
  backdrop-filter: blur(22px) saturate(1.25);
  animation: notiIn .18s ease-out;
}
@keyframes notiIn { from { opacity: 0; transform: translateY(-8px) scale(.98); } }
.noti-head {
  flex: 0 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 16px 16px 13px; border-bottom: 1px solid var(--hairline);
}
.noti-title { font-family: var(--font); font-size: 18px; font-weight: 700; }
.noti-sub { margin-top: 3px; color: var(--text3); font-size: 11.5px; }
.noti-head-actions { display: flex; align-items: center; gap: 5px; }
.noti-text-btn, .noti-close {
  border: 0; color: var(--text2); background: transparent; cursor: pointer;
  font: inherit; transition: color .15s, background .15s;
}
.noti-text-btn { padding: 6px 8px; border-radius: 7px; font-size: 11.5px; }
.noti-text-btn:hover { color: var(--text-hi); background: var(--surface-2); }
.noti-text-btn.primary { color: var(--accent-ink); font-weight: 600; }
.noti-close {
  width: 30px; height: 30px; border-radius: 8px; font-size: 23px; line-height: 1;
}
.noti-close:hover { color: var(--text-hi); background: var(--surface-3); }
.noti-list { flex: 1 1 auto; min-height: 90px; overflow-y: auto; padding: 8px; }
.noti-list::-webkit-scrollbar { width: 5px; }
.noti-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
.noti-card {
  position: relative; display: block; width: 100%; margin: 0 0 6px; padding: 12px 12px 11px 15px;
  color: inherit; text-align: left; background: var(--surface-1);
  border: 1px solid transparent; border-radius: 11px;
  cursor: pointer; transition: border-color .16s, background .16s, transform .16s;
}
.noti-card:hover { background: var(--surface-2); border-color: var(--hairline); transform: translateY(-1px); }
.noti-card.unread { background: var(--accent-wash); border-color: var(--accent-line); }
.noti-card.unread::before {
  content: ""; position: absolute; left: 6px; top: 17px; width: 5px; height: 5px;
  border-radius: 50%; background: var(--accent); box-shadow: 0 0 8px rgba(255,114,61,.75);
}
.noti-card-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.noti-kind {
  padding: 3px 7px; border-radius: 6px; color: var(--accent-ink); background: var(--accent-wash);
  font-size: 9px; font-weight: 700; letter-spacing: .7px; text-transform: uppercase;
}
.noti-kind.marketing { color: var(--accent2-ink); background: var(--accent2-wash); }
.noti-kind.community { color: var(--info-ink); background: var(--info-wash); }
.noti-time { color: var(--text3); font-size: 10.5px; }
.noti-card h4 { margin: 8px 0 4px; color: var(--text); font-size: 14px; line-height: 1.35; }
.noti-card p { margin: 0; color: var(--text2); font-size: 12px; line-height: 1.5; }
.noti-card-summary,
.noti-card-body {
  display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden;
}
.noti-card-summary { -webkit-line-clamp: 2; line-clamp: 2; }
.noti-card-body {
  margin-top: 7px !important; white-space: pre-line; color: var(--text3) !important;
  -webkit-line-clamp: 3; line-clamp: 3;
}
.noti-cta { display: inline-block; margin-top: 9px; color: var(--accent-ink); font-size: 11.5px; font-weight: 600; }
.noti-loading, .noti-empty { padding: 30px 18px; color: var(--text3); text-align: center; font-size: 13px; line-height: 1.6; }
.noti-load-more {
  display: block; width: calc(100% - 8px); margin: 10px 4px 4px; padding: 10px 12px;
  border: 1px dashed var(--accent-line); border-radius: 10px;
  color: var(--accent-ink); background: var(--accent-wash);
  font: 600 12px var(--font); cursor: pointer;
  transition: color .15s, border-color .15s, background .15s;
}
.noti-load-more:hover {
  color: var(--accent-ink); border-color: var(--accent); background: var(--accent-wash-2);
}
.noti-foot {
  flex: 0 0 auto; display: flex; align-items: center; justify-content: space-between;
  padding: 10px 12px; border-top: 1px solid var(--hairline);
}
@media (min-width: 861px) and (max-width: 1180px) {
  .ws-date, .notification-trigger-label { display: none; }
  .notification-trigger { width: 34px; min-width: 34px; padding: 0; }
  /* Giống hệt bản mobile: số chưa đọc nổi ở góc trên nút, không chen vào trong viên 34px
     cùng cái chuông (trước đây chen chung nhìn rất lôi thôi trên tablet). */
  .notification-badge {
    position: absolute; top: -4px; right: -5px; min-width: 16px; height: 16px; padding: 0 4px;
  }
}
.hud-actions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; }
.hud-icon-btn {
  background: var(--bg3); border: 1px solid var(--border); color: var(--text2);
  width: 34px; height: 34px; border-radius: 8px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all 0.2s;
}
.hud-icon-btn:hover { color: var(--accent); border-color: var(--accent); }
.hud-icon-btn.muted { opacity: 0.4; }
/* Nút đổi tông: trăng khi đang tối, mặt trời khi đang sáng - báo TÔNG HIỆN TẠI
   (không phải tông sẽ chuyển sang), khớp với tooltip do theme.js đặt. */
.theme-toggle .ic-sun { display: none; }
:root[data-theme="light"] .theme-toggle .ic-moon { display: none; }
:root[data-theme="light"] .theme-toggle .ic-sun { display: block; }

/* BODY 3 cols */
.hud-body {
  display: grid;
  /* minmax(0, 1fr) rất quan trọng: canvas và chuỗi tool dài không được dùng min-content
     để nới cột giữa rồi đẩy khung hội thoại ra ngoài viewport. */
  grid-template-columns: 260px minmax(0, 1fr) 320px;
  min-width: 0;
  overflow: hidden;
}
.hud-left, .hud-right {
  background: var(--bg2);
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.hud-center { min-width: 0; }
.hud-left { border-right: 1px solid var(--border); }
.hud-right { border-left: 1px solid var(--border); }
.hud-left::-webkit-scrollbar, .hud-right::-webkit-scrollbar, .transcript::-webkit-scrollbar { width: 4px; }
.hud-left::-webkit-scrollbar-thumb, .hud-right::-webkit-scrollbar-thumb, .transcript::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

.panel-label {
  font-family: var(--font); font-size: 12px; letter-spacing: 2px;
  color: var(--text3); margin-bottom: 10px;
  display: flex; align-items: center; justify-content: space-between;
}
.mini-btn {
  background: none; border: 1px solid var(--border); color: var(--text2);
  width: 22px; height: 22px; border-radius: 5px; cursor: pointer; font-size: 14px;
}
.mini-btn:hover { color: var(--accent); border-color: var(--accent); }

/* CENTER graph */
.hud-center {
  position: relative; overflow: hidden;
  background: var(--brain-bg);
}
#starfield { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; display: block; }
#graph2d { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; cursor: grab; display: none; }
.concept-label.cl-active .cl-name { color: var(--accent-ink); text-shadow: var(--brain-halo); }
/* (Widget MỨC DÙNG nổi đã gỡ - chuyển thành trang riêng "Mức dùng" trong rail, có đồ thị 14 ngày) */
#graph2d canvas { display: block; background: transparent !important; }
/* Vignette - chiều sâu kiểu HUD. Tông tối: sẫm dần ra rìa. Tông sáng: KHÔNG dùng
   màu đen (thành bẩn) mà đậm dần bằng chính màu giấy, nên vẫn co tiêu điểm vào giữa. */
.hud-center::after {
  content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 2;
  background: var(--brain-vignette);
}

/* Nhãn concept (HUD brain regions) */
.concept-labels { position: absolute; inset: 0; z-index: 3; pointer-events: none; }
.concept-label {
  position: absolute; transform: translate(-50%, -50%);
  font-family: var(--font); text-align: center; white-space: nowrap;
  text-shadow: var(--brain-halo);
  opacity: 0; transition: opacity 0.6s ease;
}
/* Tông sáng: chữ mực đậm trên giấy đã đủ rõ ở mờ 0.9, nhưng nhãn nằm đè lên dây
   nối nên đẩy lên đặc hẳn cho sắc nét. */
.concept-label.show { opacity: 0.9; }
:root[data-theme="light"] .concept-label.show { opacity: 1; }
.concept-label .cl-name {
  font-size: 13px; letter-spacing: 2px; color: var(--brain-ink); font-weight: 600;
}
.concept-label .cl-meta {
  font-size: 11px; letter-spacing: 1px; color: var(--brain-ink2); margin-top: 2px;
}
.concept-label .cl-fire { color: var(--brain-ink-hot); }
.brain-overlay-toggle {
  position: absolute; top: 14px; right: 14px; z-index: 6;
  width: 36px; height: 36px; padding: 8px;
  display: grid; place-items: center;
  border: 1px solid var(--brain-glass-brd); border-radius: 10px;
  color: var(--brain-ink); background: var(--brain-glass);
  box-shadow: var(--brain-glass-shadow);
  backdrop-filter: blur(8px);
  cursor: pointer; transition: color .2s, border-color .2s, background .2s, transform .2s;
}
.brain-overlay-toggle:hover {
  color: var(--text-hi); border-color: var(--accent); background: var(--accent2-wash);
}
:root[data-theme="light"] .brain-overlay-toggle:hover {
  color: var(--accent-ink); background: #fff;
}
.brain-overlay-toggle:active { transform: scale(.94); }
.brain-overlay-toggle:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.brain-overlay-toggle svg {
  width: 19px; height: 19px; fill: none; stroke: currentColor;
  stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round;
}
.brain-eye-off { display: none; }
/* Nút bung/thu khoang não: MẶC ĐỊNH ẨN, chỉ mobile bật lên (console.css). Trên desktop
   khoang não đã là cả cột giữa, không có gì để bung ra. */
.brain-max-btn { display: none; }
/* Nút timelapse: cùng khuôn nút mắt, xếp ngay bên dưới */
.graph-timelapse-btn { top: 58px; }
.graph-timelapse-btn .tl-stop { display: none; }
.graph-timelapse-btn.playing .tl-play { display: none; }
.graph-timelapse-btn.playing .tl-stop { display: block; }
.graph-timelapse-btn.playing {
  color: var(--text-hi); border-color: var(--accent); background: var(--accent2-wash);
  animation: tlPulse 1.6s ease-in-out infinite;
}
@keyframes tlPulse {
  0%, 100% { box-shadow: var(--brain-glass-shadow); }
  50% { box-shadow: 0 5px 22px rgba(185,140,255,.5); }
}
/* Trên giấy, quầng tím toả ra không thấy gì - nhịp đập đổi thành vòng cam đậm dần. */
:root[data-theme="light"] .graph-timelapse-btn.playing {
  color: var(--accent-ink); background: var(--accent-wash-2);
}
:root[data-theme="light"] .graph-timelapse-btn.playing { animation-name: tlPulseLight; }
@keyframes tlPulseLight {
  0%, 100% { box-shadow: var(--brain-glass-shadow), 0 0 0 0 rgba(232,93,31,.30); }
  50% { box-shadow: var(--brain-glass-shadow), 0 0 0 4px rgba(232,93,31,.20); }
}
.hud-center .concept-labels,
.hud-center .brain-stats {
  transition: opacity .24s ease, visibility .24s ease, transform .24s ease;
}
.hud-center.brain-overlays-hidden .concept-labels,
.hud-center.brain-overlays-hidden .brain-stats {
  opacity: 0; visibility: hidden; pointer-events: none;
}
.hud-center.brain-overlays-hidden .brain-eye-on { display: none; }
.hud-center.brain-overlays-hidden .brain-eye-off { display: block; }
.orb-overlay {
  position: absolute; bottom: 92px; left: 0; right: 0;
  text-align: center; pointer-events: none; z-index: 5;
}
.orb-state {
  font-family: var(--font); font-size: 14px; letter-spacing: 3px;
  color: var(--text2); transition: color 0.3s;
}
.orb-state.listening { color: var(--accent); }
.orb-state.speaking { color: var(--accent2); }
.orb-state.thinking { color: var(--yellow); }
.orb-interim {
  font-size: 17px; color: var(--text); margin-top: 8px;
  max-width: 600px; margin-left: auto; margin-right: auto; min-height: 20px;
  text-shadow: var(--brain-halo);
}
.orb-graph-ctl {
  position: absolute; top: 14px; right: 14px; z-index: 5;
  display: flex; align-items: center; gap: 10px;
}
.graph-select {
  background: var(--bg3); border: 1px solid var(--border);
  color: var(--text); padding: 5px 8px; border-radius: 6px; font-size: 14px;
}
.graph-stats { font-size: 13px; color: var(--text2); font-family: var(--font); white-space: nowrap; transition: color .25s, text-shadow .25s; }
.graph-stats.pulse { color: var(--accent2-ink); text-shadow: 0 0 10px rgba(160,120,255,.8); }
/* Giấy: nhấp nháy bằng ĐẬM CHỮ thay vì bằng quầng sáng. */
:root[data-theme="light"] .graph-stats.pulse { text-shadow: none; font-weight: 700; }
.graph-folder-btn {
  background: var(--bg3); border: 1px solid var(--border); color: var(--text2);
  width: 30px; height: 28px; border-radius: 6px; cursor: pointer; font-size: 15px;
}
.graph-folder-btn:hover { border-color: var(--accent); }

/* Lớp Agentic - dải số liệu agent/skill/workflow ở đáy graph */
.brain-stats {
  position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%);
  z-index: 5; display: flex; align-items: stretch;
  background: var(--brain-glass); border: 1px solid var(--border);
  border-radius: 12px; padding: 4px; backdrop-filter: blur(8px);
  box-shadow: var(--brain-glass-shadow);
}
.bstat {
  background: none; border: none; cursor: pointer;
  display: flex; flex-direction: column; align-items: center;
  padding: 8px 22px; border-radius: 9px; transition: background 0.2s;
}
.bstat:hover { background: var(--accent2-wash); }
.bstat-num {
  font-family: var(--font); font-size: 22px; font-weight: 700;
  color: var(--text); line-height: 1; transition: color 0.2s, text-shadow 0.2s;
}
.bstat:hover .bstat-num { color: var(--accent); text-shadow: 0 0 12px rgba(160,120,255,0.7); }
:root[data-theme="light"] .bstat:hover .bstat-num { color: var(--accent-ink); text-shadow: none; }
.bstat-lbl {
  font-family: var(--font); font-size: 11px; letter-spacing: 2px;
  color: var(--text3); margin-top: 6px;
}
.bstat-num.bump { animation: bstatBump 0.6s ease; }
@keyframes bstatBump { 0% { transform: scale(1); } 40% { transform: scale(1.35); color: var(--accent); } 100% { transform: scale(1); } }
.bstat-sep { width: 1px; background: var(--border); margin: 9px 0; }

/* Vòng lặp tự cải thiện (Beta) */
.beta-tag {
  font-size: 8px; letter-spacing: 1px; background: linear-gradient(90deg,var(--accent),var(--accent2));
  color: var(--on-accent); padding: 1px 6px; border-radius: 6px; font-weight: 700; margin-left: 4px;
}
.loop-box {
  background: var(--bg3); border: 1px solid var(--border); border-radius: 10px;
  padding: 12px; display: flex; flex-direction: column; gap: 9px;
}
.loop-desc { font-size: 13px; color: var(--text3); line-height: 1.5; }
.loop-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 14px; color: var(--text2); }
.loop-sel, .loop-num {
  background: var(--field-bg); border: 1px solid var(--border); color: var(--text);
  border-radius: 6px; padding: 4px 6px; font-size: 14px;
}
.loop-num { width: 64px; text-align: right; }
.loop-actions { display: flex; gap: 8px; }
.loop-btn {
  flex: 1; background: var(--accent-solid); color: var(--on-accent); border: none; border-radius: 7px;
  padding: 7px; font-size: 14px; cursor: pointer; font-weight: 600;
}
.loop-btn.ghost { background: none; border: 1px solid var(--border); color: var(--text2); }
.loop-btn:hover { filter: brightness(1.1); }
.loop-btn:disabled { opacity: .5; cursor: default; }
.loop-status { font-size: 13px; color: var(--text3); font-family: var(--font); }
.loop-status.running { color: var(--yellow); }
.loop-status.on { color: var(--green); }
.loop-log { display: flex; flex-direction: column; gap: 6px; max-height: 180px; overflow-y: auto; }
.loop-log-item {
  font-size: 13px; color: var(--text2); background: var(--bg2); border: 1px solid var(--border);
  border-radius: 7px; padding: 7px 9px; line-height: 1.45; white-space: pre-wrap;
}
.loop-log-item .lli-time { color: var(--accent); font-family: var(--font); font-size: 12px; }

/* Studio - tab Lịch tự động */
.auto-hint { font-size: 13px; color: var(--text3); line-height: 1.5; margin: 4px 0 12px; }

/* Loop - ô mục tiêu tự định nghĩa */
.loop-custom {
  width: 100%; background: var(--field-bg); border: 1px solid var(--border); color: var(--text);
  border-radius: 7px; padding: 7px 9px; font-size: 14px; resize: vertical; min-height: 48px; font-family: inherit;
}

/* Auth + Settings overlays */
.auth-modal { max-width: 360px; width: 90%; }
.auth-body { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.auth-body input {
  background: var(--field-bg); border: 1px solid var(--border); color: var(--text);
  border-radius: 8px; padding: 10px 12px; font-size: 16px;
}
.auth-err { color: var(--red); font-size: 14px; min-height: 16px; }
.auth-help { font-size: 14px; }
.auth-help span { color: var(--accent); cursor: pointer; text-decoration: underline; }
.auth-reset { font-size: 13px; color: var(--text3); line-height: 1.6; background: var(--bg3); border: 1px solid var(--border); border-radius: 7px; padding: 8px 10px; }
.auth-reset code { background: var(--surface-2); padding: 1px 4px; border-radius: 4px; }

.settings-modal {
  background: var(--bg2); border: 1px solid var(--border); border-radius: 14px;
  width: 92%; max-width: 520px; max-height: 86vh; display: flex; flex-direction: column; overflow: hidden;
}
.settings-body { padding: 14px 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
.set-sec { background: var(--bg3); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; display: flex; flex-direction: column; gap: 7px; }
.set-sec h4 { margin: 0 0 4px; font-size: 15px; color: var(--text); letter-spacing: .5px; }
.set-sec label { font-size: 13px; color: var(--text2); }
.set-sec input, .set-sec select {
  background: var(--field-bg); border: 1px solid var(--border); color: var(--text);
  border-radius: 7px; padding: 8px 10px; font-size: 15px; width: 100%;
}
.set-note { font-size: 13px; color: var(--text3); line-height: 1.5; }
.engine-badge {
  font-family: var(--font); font-size: 12px; letter-spacing: .3px; font-weight: 600;
  padding: 2px 8px; border-radius: 999px; border: 1px solid var(--border); color: var(--text2);
  text-transform: none; max-width: 60%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.engine-badge.or { color: var(--accent-ink); border-color: var(--accent-line); background: var(--accent-wash); }
.engine-badge.cli { color: var(--accent2-ink); border-color: var(--accent2-line); background: var(--accent2-wash); }
.set-mini { background: none; border: 1px solid var(--border); color: var(--text2); border-radius: 5px; font-size: 12px; padding: 1px 7px; cursor: pointer; margin-left: 6px; }
.set-mini:hover { color: var(--accent); border-color: var(--accent); }
.set-actions { display: flex; gap: 8px; }
.settings-body .s-btn { align-self: flex-start; background: var(--accent-solid); color: var(--on-accent); border: none; border-radius: 7px; padding: 7px 14px; font-size: 14px; cursor: pointer; }
.settings-body .s-btn-ghost { background: none; border: 1px solid var(--border); color: var(--text2); border-radius: 7px; padding: 7px 14px; font-size: 14px; cursor: pointer; }

/* Markdown bảng + code trong chat */
.md-table { border-collapse: collapse; margin: 6px 0; font-size: 14px; width: 100%; }
.md-table th, .md-table td { border: 1px solid var(--border); padding: 4px 8px; text-align: left; }
.md-table th { background: var(--bg3); color: var(--text); }
.code-block {
  background: var(--code-bg); border: 1px solid var(--border); border-radius: 8px;
  padding: 10px 12px; font-size: 14px; overflow-x: auto; white-space: pre; margin: 6px 0;
  font-family: ui-monospace, monospace; color: var(--code-ink);
}

/* Checkbox task "- [ ]" (kiểu obsidian-tasks) + khối Dataview lite */
input.md-cb { cursor: pointer; accent-color: var(--accent); margin-right: 6px; vertical-align: middle; }
li.task-item { list-style: none; margin-left: -16px; }
li.task-done > .dv-ttext, li.task-done { color: var(--text3); }
li.task-done > .dv-ttext { text-decoration: line-through; text-decoration-color: var(--text3); }
/* Frontmatter YAML của note (--- ... --- ở đầu file): khối metadata, KHÔNG phải văn bản để soạn.
   Hiện ra cho thấy, khoá lại để không sửa nhầm - và nhờ vậy lưu lại vẫn nguyên vẹn từng ký tự. */
.jv-fm {
  border: 1px solid var(--border); border-radius: 10px; background: var(--bg2);
  margin: 0 0 12px; overflow: hidden; user-select: none;
}
.jv-fm .jv-fm-head {
  font-size: 12px; letter-spacing: .4px; color: var(--text3); padding: 5px 12px 4px;
  border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 6px;
}
.jv-fm .jv-fm-body {
  margin: 0; padding: 8px 12px; font: 12.5px/1.6 ui-monospace, Menlo, Consolas, monospace;
  color: var(--text2); white-space: pre-wrap; word-break: break-word; background: none;
}
.jv-dataview {
  border: 1px solid var(--border); border-radius: 10px; background: var(--bg2);
  margin: 10px 0; overflow: hidden;
}
.jv-dataview .jv-dv-head {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  font-size: 12px; letter-spacing: .4px; color: var(--text3); padding: 5px 12px 4px;
  border-bottom: 1px solid var(--border); user-select: none;
}
.jv-dataview .dv-add {
  background: none; border: 1px solid var(--border); color: var(--text2);
  border-radius: 6px; font-size: 12px; padding: 1px 8px; cursor: pointer; font-family: inherit;
}
.jv-dataview .dv-add:hover { color: var(--accent); border-color: var(--accent); }
.jv-dataview .dv-addform {
  display: none; gap: 6px; align-items: center; padding: 7px 12px;
  border-bottom: 1px solid var(--border); background: var(--bg3);
}
.jv-dataview .dv-addform.open { display: flex; }
.jv-dataview .dv-addform input {
  background: var(--bg); border: 1px solid var(--border); color: var(--text);
  border-radius: 6px; padding: 4px 8px; font-size: 13px; font-family: inherit;
}
.jv-dataview .dv-add-text { flex: 1; min-width: 0; }
.jv-dataview .dv-add-date { color-scheme: dark; }
.jv-dataview .dv-add-go {
  background: var(--accent-solid); border: none; color: var(--on-accent); border-radius: 6px;
  padding: 4px 12px; font-size: 13px; cursor: pointer; font-family: inherit;
}
.jv-dataview .jv-dv-body { padding: 8px 12px 10px; font-size: 14px; }
.jv-dataview .jv-dv-wait { color: var(--text3); font-size: 13px; }
.jv-dataview .dv-count { font-size: 12px; color: var(--text3); margin-bottom: 6px; }
.jv-dataview .dv-warn { font-size: 12px; color: var(--yellow); margin-bottom: 6px; }
.jv-dataview .dv-empty { color: var(--text3); font-size: 13px; padding: 4px 0; }
.jv-dataview .dv-err { color: var(--red); font-size: 13px; margin-bottom: 6px; }
.jv-dataview .dv-src { font-size: 12.5px; color: var(--text3); background: var(--bg); border-radius: 6px; padding: 8px 10px; overflow-x: auto; }
.jv-dataview .dv-group { margin: 6px 0 10px; }
.jv-dataview .dv-ghead { font-weight: 600; margin-bottom: 3px; }
.jv-dataview .dv-ghead a, .jv-dataview .dv-list a { color: var(--accent); text-decoration: none; }
.jv-dataview .dv-ghead a:hover, .jv-dataview .dv-list a:hover { text-decoration: underline; }
.jv-dataview ul.dv-tasks, .jv-dataview ul.dv-list { margin: 2px 0 2px 6px; padding-left: 12px; }
.jv-dataview li.dv-task { list-style: none; margin: 3px 0; line-height: 1.5; }
.jv-dataview li.dv-failed { outline: 1px solid var(--red); border-radius: 5px; }
.jv-dataview .dv-badge { font-size: 12px; color: var(--text3); background: var(--bg3); border-radius: 5px; padding: 0 5px; margin-left: 4px; white-space: nowrap; }
.jv-dataview .dv-badge.dv-over { color: var(--on-accent); background: var(--red); }
.jv-dataview .dv-tablewrap { overflow-x: auto; }

/* Menu gợi ý task (task-suggest.js) - kiểu obsidian-tasks bản gọn */
.ts-pop {
  position: fixed; z-index: 4000; min-width: 230px; max-width: 300px;
  background: var(--bg2); border: 1px solid var(--border); border-radius: 10px;
  box-shadow: var(--shadow-3); padding: 4px; font-size: 13.5px;
}
.ts-item {
  display: flex; align-items: center; gap: 8px; padding: 6px 10px;
  border-radius: 7px; color: var(--text); cursor: pointer; user-select: none;
}
.ts-item.sel, .ts-item:hover { background: var(--bg3); }
.ts-ic { width: 20px; text-align: center; flex: none; }
.ts-date { margin-left: auto; color: var(--text3); font-size: 12px; }
/* Menu gõ "/" trong trình soạn .md (editor-cmds.js). Dùng lại đúng bộ mặt của .ts-pop để
   hai menu trong cùng một editor không lệch nhau, thêm cột phím tắt căn phải. */
.ec-pop {
  position: fixed; z-index: 4000; min-width: 250px; max-width: 320px;
  max-height: 292px; overflow-y: auto;
  background: var(--bg2); border: 1px solid var(--border); border-radius: 10px;
  box-shadow: var(--shadow-3); padding: 4px; font-size: 13.5px;
}
.ec-item {
  display: flex; align-items: center; gap: 9px; padding: 6px 10px;
  border-radius: 7px; color: var(--text); cursor: pointer; user-select: none;
}
.ec-item.sel, .ec-item:hover { background: var(--bg3); }
/* Ô icon rộng cố định để nhãn thẳng cột, dù bên trong là SVG hay chữ ("B", "H1", "1."). */
.ec-ic { width: 22px; flex: none; text-align: center; color: var(--text2); font-size: 12px; }
.ec-lb { flex: 1 1 auto; min-width: 0; }
.ec-key {
  flex: none; color: var(--text3); font-size: 11.5px; letter-spacing: 0.4px;
  border: 1px solid var(--border); border-radius: 5px; padding: 1px 6px; white-space: nowrap;
}
.ts-pop .ts-datein {
  width: 100%; box-sizing: border-box; background: var(--bg); border: 1px solid var(--border);
  color: var(--text); border-radius: 7px; padding: 6px 8px; font-size: 13.5px;
  font-family: inherit; color-scheme: dark;
}

/* Run drawer - trạng thái kiểm chứng */
.rs-verify { font-size: 13px; color: var(--text3); margin-left: 6px; }
.rs-verify.ok { color: var(--green); }
.rs-verify.fail { color: var(--red); }
.rs-retry { font-size: 13px; color: var(--yellow); margin: 4px 0; }
.rs-warn { font-size: 13px; color: var(--red); margin-top: 4px; }

/* Editor - cấu hình kiểm chứng cho bước workflow (styles moved to step-row section) */

/* Folder picker modal */
.modal-overlay {
  position: fixed; inset: 0; background: var(--scrim); backdrop-filter: blur(6px);
  z-index: 400; display: none; align-items: center; justify-content: center;
}
.modal-overlay.open { display: flex; }
.folder-modal {
  width: 560px; max-width: 90vw; max-height: 80vh; background: var(--bg2);
  border: 1px solid var(--border); border-radius: 14px; display: flex; flex-direction: column;
  box-shadow: var(--shadow-3);
}
.fm-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px; border-bottom: 1px solid var(--border); font-size: 16px; font-weight: 600;
}
.fm-close { background: var(--bg3); border: 1px solid var(--border); color: var(--text2); width: 28px; height: 28px; border-radius: 6px; cursor: pointer; }
.fm-close:hover { color: var(--accent); border-color: var(--accent); }
.fm-path {
  padding: 8px 16px; font-family: var(--font); font-size: 13px; color: var(--text2);
  border-bottom: 1px solid var(--border); word-break: break-all; background: var(--bg);
}
.fm-list { flex: 1; overflow-y: auto; padding: 8px; min-height: 200px; }
.fm-list::-webkit-scrollbar { width: 5px; }
.fm-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
.fm-row {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding: 9px 12px; border-radius: 8px; cursor: pointer; font-size: 15px; transition: background 0.12s;
}
.fm-row:hover { background: var(--bg3); }
.fm-row .fm-name { display: flex; align-items: center; gap: 8px; color: var(--text); }
.fm-row .fm-md { font-size: 13px; color: var(--text3); font-family: var(--font); }
.fm-row.up { color: var(--text2); font-style: italic; }
.fm-foot {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 12px 16px; border-top: 1px solid var(--border);
}
.fm-hint { font-size: 14px; color: var(--text2); }
.fm-use {
  background: var(--accent-solid); color: var(--on-accent); border: none; padding: 9px 18px;
  border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer;
}
.fm-use:hover { opacity: 0.88; }
/* RIGHT transcript */
.transcript {
  flex: 1 1 auto; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;
  /* Ô chat chiếm phần lớn chiều cao, co giãn theo cửa sổ; các panel dưới cuộn tiếp */
  min-height: clamp(280px, 46vh, 620px);
}
.transcript:empty::after {
  content: "Nói hoặc gõ để bắt đầu hội thoại với Javis.";
  color: var(--text3); font-size: 14px; font-style: italic;
}
.msg { animation: fadeIn 0.2s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.msg-user { display: flex; flex-direction: column; align-items: flex-end; }
.msg-user .bubble {
  background: var(--accent-wash-2); border: 1px solid var(--accent-line);
  padding: 8px 12px; border-radius: 12px 12px 3px 12px; max-width: 90%;
  line-height: 1.55; font-size: 16px;
}
/* ===== Bong bóng Javis: đây là chỗ người dùng ĐỌC, không phải chỗ nhét chữ =====
   Chủ repo gửi ảnh một câu trả lời dài (2026-08-07): "muốn cải thiện lại cách hiển thị của
   Javis cho dễ đọc, xuống cách dòng nhiều hơn chứ đọc khó quá". Ba thứ cộng lại làm nên bức
   tường chữ đó, và sửa thiếu một thứ thì vẫn khó đọc:
     - giãn dòng 1.6 hơi chật cho một khối văn xuôi dài;
     - hai đoạn văn cách nhau 6px, tức là gần bằng khoảng cách giữa hai DÒNG trong cùng đoạn,
       nên mắt không tách được đoạn;
     - và nặng nhất: không giới hạn ĐỘ DÀI DÒNG. Trên màn rộng một dòng chạy tới hơn 120 ký
       tự, mà mắt bắt đầu lạc dòng từ khoảng 90 trở đi - đọc xong dòng này phải dò lại mới tìm
       ra đầu dòng kế tiếp. Đây là thứ người ta cảm thấy là "mỏi" chứ ít khi gọi tên ra được.
   Trần độ dài đặt trên CẢ bong bóng chứ không trên từng đoạn chữ: chặn từng đoạn thì nền bong
   bóng vẫn rộng nguyên, chừa một mảng trống bên phải trông như lỗi hiển thị. Khối mã vốn đã có
   cuộn ngang riêng (\`.code-block { overflow-x: auto }\`) nên không bị bóp, bảng của dataview
   cũng vậy. Khung chat hẹp (khoang não, điện thoại) thì trần này không đụng tới gì cả. */
.msg-javis .bubble {
  background: var(--bg3); border: 1px solid var(--border);
  padding: 12px 14px; border-radius: 3px 12px 12px 12px;
  line-height: 1.75; font-size: 16px; max-width: 76ch;
}
.msg-javis .bubble strong { color: var(--accent); }
.msg-javis .bubble ul { padding-left: 18px; margin: 10px 0; }
.msg-javis .bubble code { font-family: var(--mono); font-size: 13px; background: var(--bg); padding: 1px 4px; border-radius: 3px; color: var(--accent2-ink); }
.msg-javis .bubble h3 { font-size: 15px; color: var(--text); margin: 18px 0 6px; }
.msg-javis .bubble h3:first-child { margin-top: 0; }

/* Link/URL dài trong tin nhắn: ngắt dòng theo khung thay vì tràn ra ngoài (vd link Google Docs
   dài không có khoảng trắng). Áp cho cả bubble và thẻ <a> bên trong. */
.msg-javis .bubble, .msg-user .bubble { overflow-wrap: anywhere; }
.msg-javis .bubble a, .msg-user .bubble a { overflow-wrap: anywhere; word-break: break-word; }

/* Hàng nút dưới mỗi tin: giờ gửi + gửi lại / sửa lại / sao chép.
   Ẩn sẵn, hiện khi rê chuột (máy tính) hoặc khi chạm vào tin (điện thoại, .acts-on).
   Hàng LUÔN chiếm chỗ nên hiện/ẩn không làm nhảy layout khung chat. */
.msg-javis { display: block; }
.msg-javis .bubble { min-width: 0; }
.msg-acts { display: flex; align-items: center; gap: 2px; height: 22px; margin-top: 2px;
  opacity: 0; transition: opacity 0.15s; }
.msg-user .msg-acts { justify-content: flex-end; }
.msg:hover .msg-acts, .msg.acts-on .msg-acts, .msg-acts:focus-within { opacity: 1; }
.msg-time { color: var(--text3); font-size: 12px; margin-right: 4px; }
.msg-act { background: none; border: 1px solid transparent; color: var(--text3);
  border-radius: 6px; cursor: pointer; font-size: 13px; line-height: 1; padding: 3px 6px; }
.msg-act:hover { color: var(--text-hi); border-color: var(--border); }
/* Đang chạy một lượt thì không cho bấm gửi lại (app.js gắn .busy vào #chatArea) */
.transcript.busy .msg-act[data-act="retry"] { opacity: 0.35; pointer-events: none; }

/* Copy code block (nút nổi góc phải khối code) */
.code-wrap { position: relative; }
.code-copy { position: absolute; top: 6px; right: 6px; z-index: 2;
  background: var(--field-bg); border: 1px solid var(--border); color: var(--text2);
  border-radius: 6px; padding: 2px 8px; font-size: 12px; cursor: pointer;
  opacity: 0; transition: opacity 0.15s; }
.code-wrap:hover .code-copy { opacity: 1; }
.code-copy:hover { color: var(--text-hi); border-color: var(--accent); }

/* Tin user nhiều dòng: giữ xuống dòng + thu gọn khi quá dài */
.msg-user .bubble .utext { white-space: pre-wrap; word-break: break-word; }
.msg-user .bubble .utext.clamped { display: -webkit-box; -webkit-line-clamp: 10;
  -webkit-box-orient: vertical; overflow: hidden; }
.clamp-more { display: block; margin-top: 5px; background: none; border: none;
  color: var(--accent); font-size: 13px; cursor: pointer; padding: 0; }
.clamp-more:hover { text-decoration: underline; }

/* Nút xuống cuối - sticky đáy khung chat, hiện ngay khi user rời đáy cuộn lên đọc.
   Hai dạng: mặc định là nút TRÒN chỉ có mũi tên (chỉ để nhảy xuống, không cần chữ);
   thêm .has-new khi có tin mới thì nở ra thành viên thuốc có chữ để nó đập vào mắt.
   flex: none BẮT BUỘC: .transcript là flex dọc, nút là flex item nên mặc định BỊ CO theo
   chiều chính (chiều cao). Thiếu nó thì nút tròn 32px bị bóp còn 15px, méo thành bầu dục. */
#newMsgBtn { position: sticky; bottom: 6px; align-self: center; display: none; z-index: 3;
  flex: none; align-items: center; justify-content: center; gap: 5px;
  background: var(--panel-solid); border: 1px solid var(--text3); color: var(--text);
  width: 32px; height: 32px; padding: 0; border-radius: 50%;
  /* Bóng đậm hơn --shadow-1 vì nút NỔI ĐÈ lên chữ của tin nhắn; bóng nhạt là nó chìm vào nền chữ. */
  font-size: 13px; cursor: pointer; box-shadow: var(--shadow-2);
  transition: color 0.15s, border-color 0.15s, background 0.15s; }
#newMsgBtn.has-new { width: auto; height: auto; padding: 5px 14px; border-radius: 16px;
  border-color: var(--accent); color: var(--accent); }
#newMsgBtn.show { display: inline-flex; }
#newMsgBtn:hover { background: var(--accent-wash-2); color: var(--accent); border-color: var(--accent); }

/* ===== THANH MỐC HỘI THOẠI (chat-marks.js) =====
   Mỗi vạch là một câu mình đã hỏi; rê vào hiện danh sách để nhảy về prompt cũ.

   height:0 + align-self:flex-end là cặp quan trọng: .transcript là flex DỌC, nên một flex item
   bình thường sẽ chiếm một hàng ngang và đẩy tin nhắn xuống. Cao 0 thì nó không chiếm hàng nào,
   còn phần nhìn thấy được là .cm-ray định vị tuyệt đối bên trong. sticky top:0 giữ nó dính mép
   trên vùng cuộn, và chiều cao thật của ray do JS đo theo clientHeight của khung. */
#chatMarks { position: sticky; top: 0; height: 0; z-index: 4; flex: none;
  align-self: flex-end; width: 0; overflow: visible; }
.cm-ray { position: absolute; top: 0; right: 2px; width: 22px;
  display: flex; flex-direction: column; align-items: flex-end; justify-content: center;
  gap: calc(var(--cm-cach, 11px) - 2px); pointer-events: auto; }
.cm-vach { flex: none; width: 13px; height: 2px; padding: 0; border: 0; border-radius: 2px;
  background: var(--text3); opacity: .38; cursor: pointer;
  transition: width .14s, opacity .14s, background .14s; }
.cm-vach:hover { width: 20px; opacity: .85; }
/* Vạch đang đọc: dài hơn VÀ đậm hơn. Chỉ đổi màu thôi thì trên dãy vạch mờ nhìn lướt không
   thấy, mà mục đích của nó là biết mình đang ở đâu trong hội thoại chỉ bằng một cái liếc. */
.cm-vach.active { width: 20px; opacity: 1; background: var(--accent); }
#chatMarks:hover .cm-vach { opacity: .62; }
#chatMarks:hover .cm-vach.active { opacity: 1; }

/* Danh sách prompt - mở khi rê vào. Nằm bên TRÁI dãy vạch vì dãy đã sát mép phải khung.
   right:100% = mép phải hộp DÍNH vào mép trái dãy vạch, không chừa khe nào. Chủ repo báo bản
   đầu "hover thì nó hiện hơi xa trỏ nên không trỏ được": hộp neo ở đỉnh khung trong khi vạch
   nằm giữa, giữa hai thứ là một vùng không thuộc hover, chuột đi chéo qua là hộp tắt.
   top:50% ăn theo .cm-ray (cao thật, JS đặt bằng clientHeight của khung) chứ không ăn theo
   #chatMarks vốn cao 0 - phần trăm trên số 0 luôn ra 0. max-height cũng vậy: 100% ở đây là
   chiều cao khung chat, nên hộp không bao giờ tràn ra ngoài khung dù hội thoại dài tới đâu. */
.cm-hop { position: absolute; top: 50%; right: 100%; transform: translateY(-50%); z-index: 5;
  display: flex; flex-direction: column; gap: 1px; padding: 6px;
  width: min(320px, 52vw); max-height: min(420px, calc(100% - 16px)); overflow-y: auto;
  background: var(--panel-solid); border: 1px solid var(--border); border-radius: 12px;
  box-shadow: var(--shadow-2); }
.cm-hop[hidden] { display: none; }
/* flex: none KHÔNG phải trang trí - thiếu nó là hội thoại dài thì danh sách không đọc được.
   .cm-hop là flex column có max-height, mà con của flex mặc định flex-shrink:1. Nhiều mốc hơn
   chỗ chứa thì trình duyệt KHÔNG cho hộp cuộn, nó ép mọi dòng bé lại theo tỉ lệ: đo trong
   Chromium thật, 5 câu mỗi dòng cao 30.8px (đọc được), 60 câu tụt còn 12px - đúng bằng phần
   đệm trên dưới, tức chữ bị cắt còn 0. Nhìn ra màn hình là một mớ vệt mờ (chủ repo báo kèm ảnh
   2026-08-13). .cm-vach ngay trên đã có flex:none vì đúng lý do này, chỗ đây bị sót.
   Test cũ có câu "60 câu hỏi không tràn khung" nên tưởng đã phủ - nhưng nó đo TRÀN, mà bệnh
   này thì không tràn: hộp vừa khít vì các dòng bị bóp. Đo sai thứ nên lọt. */
.cm-muc { flex: none; text-align: left; padding: 6px 9px; border: 0; border-radius: 7px;
  cursor: pointer;
  background: transparent; color: var(--text2); font-family: var(--font); font-size: 13px;
  line-height: 1.45; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cm-muc:hover { background: var(--surface-2); color: var(--text); }
.cm-muc.active { background: var(--accent-wash-2); color: var(--text); font-weight: 600; }

/* Nhảy xong thì nháy nhẹ vào đúng bong bóng vừa tới. Không có nhát này thì màn hình vừa
   trượt một đoạn dài xong người đọc phải tự dò xem mình đang đứng ở câu nào. */
.msg-user.cm-vua-nhay .bubble { animation: cmNhay 1.2s ease; }
@keyframes cmNhay {
  0%, 100% { box-shadow: 0 0 0 0 transparent; }
  22% { box-shadow: 0 0 0 3px var(--accent-line); }
}

/* ===== CHẾ ĐỘ ĐIỆN THOẠI =====
   Không phải dãy vạch thu nhỏ, mà là thứ khác hẳn: một nút ở góc trên, chạm vào thì mở tấm
   trượt lên từ đáy. Dãy vạch sống bằng rê chuột (ngón tay không rê được) và bằng một dải sát
   mép phải (giành mất cú vuốt để cuộn) - bỏ hai thứ đó đi thì nó chẳng còn là gì. */
.cm-nut { position: absolute; top: 8px; right: 8px; display: none;
  align-items: center; gap: 5px; padding: 5px 10px 5px 8px; border-radius: 16px;
  background: var(--panel-solid); border: 1px solid var(--border); color: var(--text2);
  font-family: var(--font); font-size: 12px; line-height: 1; cursor: pointer;
  box-shadow: var(--shadow-1); opacity: .9; }
/* Ba gạch vẽ bằng CSS, không nhét SVG: nút này nằm trong khối do JS dựng bằng chuỗi HTML, mà
   bộ icon của app nạp theo cách khác - thêm một đường phụ thuộc cho ba cái gạch là không đáng. */
.cm-nut-ic { width: 12px; height: 9px; flex: none;
  border-top: 2px solid currentColor; border-bottom: 2px solid currentColor;
  position: relative; }
.cm-nut-ic::after { content: ""; position: absolute; left: 0; right: 0; top: 3px;
  border-top: 2px solid currentColor; }
.cm-nut-so { font-variant-numeric: tabular-nums; }
.cm-nut:active { background: var(--surface-2); }

/* Tấm trượt: gắn ở body nên neo theo MÀN HÌNH, không cuộn theo khung chat. */
.cm-tam-lop { position: fixed; inset: 0; z-index: 120; background: var(--scrim);
  display: flex; align-items: flex-end; }
.cm-tam { width: 100%; max-height: 68vh; display: flex; flex-direction: column;
  background: var(--panel-solid); border-top-left-radius: 18px; border-top-right-radius: 18px;
  box-shadow: 0 -8px 40px var(--shadow-veil); animation: cmTruot .18s ease-out; }
@keyframes cmTruot { from { transform: translateY(18px); opacity: .6; } to { transform: none; opacity: 1; } }
.cm-tam-dau { display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px 10px; font-family: var(--font); font-size: 15px; color: var(--text);
  border-bottom: 1px solid var(--border); flex: none; }
.cm-tam-dong { background: none; border: 0; color: var(--text3); font-size: 17px;
  padding: 4px 8px; cursor: pointer; }
/* Vùng an toàn dưới đáy: iPhone có thanh gạt Home đè lên mục cuối nếu không chừa. */
.cm-tam-ds { overflow-y: auto; padding: 6px 8px calc(10px + env(safe-area-inset-bottom, 0px)); }
/* Mục trong tấm trượt là ĐÍCH CHẠM, không phải dòng chữ: cao tối thiểu 44px theo cỡ ngón tay,
   và cho xuống 2 dòng vì màn dọc có bề ngang chứ không thiếu như cột bên máy tính. */
.cm-tam .cm-muc { width: 100%; min-height: 44px; padding: 11px 12px; border-radius: 10px;
  font-size: 14px; white-space: normal; text-overflow: clip;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.cm-so { color: var(--text3); font-variant-numeric: tabular-nums; margin-right: 8px; }
.cm-tam .cm-muc.active .cm-so { color: var(--accent); }
/* Bên máy tính số thứ tự là thừa: dãy vạch đã nói vị trí bằng hình rồi. */
#chatMarks .cm-so { display: none; }

@media (max-width: 860px) {
  .cm-ray { display: none; }
  .cm-nut { display: inline-flex; }
}
@media (min-width: 861px) { .cm-tam-lop { display: none; } }
@media (prefers-reduced-motion: reduce) {
  .msg-user.cm-vua-nhay .bubble { animation: none; }
}

/* Chip hoạt động trong transcript - "đang suy nghĩ / gọi tool / soạn trả lời"
   (thay .tool-bar cũ nằm ngoài #chatArea nên biến mất khi phóng to chat workspace) */
.msg-activity .act-bubble {
  display: inline-flex; align-items: center; gap: 9px;
  background: var(--accent2-wash); border: 1px solid var(--accent2-line);
  border-radius: 3px 12px 12px 12px; padding: 8px 12px;
  font-size: 13px; color: var(--accent2-ink); font-family: var(--font);
  animation: actGlow 2.2s ease-in-out infinite;
}
.act-dots { display: inline-flex; gap: 3px; align-items: center; }
.act-dots i {
  width: 5px; height: 5px; border-radius: 50%; background: var(--accent2); opacity: 0.35;
  animation: actDot 1.2s ease-in-out infinite;
}
.act-dots i:nth-child(2) { animation-delay: 0.18s; }
.act-dots i:nth-child(3) { animation-delay: 0.36s; }
@keyframes actDot { 30% { opacity: 1; transform: translateY(-3px); } }
@keyframes actGlow { 50% { border-color: var(--accent2); box-shadow: 0 0 14px var(--accent2-wash); } }
.act-time { color: var(--text3); font-size: 12px; font-variant-numeric: tabular-nums; }
@keyframes spin { to { transform: rotate(360deg); } }   /* vẫn dùng cho .rs-spin */

.mem-count {
  background: var(--accent2-wash-2); color: var(--accent2-ink); border: 1px solid var(--accent2-line);
  border-radius: 10px; padding: 1px 8px; font-size: 12px; font-weight: 700;
}
.mem-box { display: flex; flex-direction: column; gap: 8px; }
.mem-desc { font-size: 13px; color: var(--text3); line-height: 1.5; }
.learn-btn {
  background: var(--accent2-wash); border: 1px solid var(--accent2-line); color: var(--accent2-ink);
  padding: 8px 10px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;
  transition: all 0.2s;
}
.learn-btn:hover { background: var(--accent2-wash-2); }
.learn-btn:disabled { opacity: 0.6; cursor: wait; }
.mem-result { font-size: 13px; color: var(--text2); line-height: 1.5; white-space: pre-wrap; }
.auto-learn { display: flex; align-items: center; gap: 7px; font-size: 13px; color: var(--text2); cursor: pointer; }
.auto-learn input { accent-color: var(--accent2); }

.sys-status, .mcp-list { display: flex; flex-direction: column; gap: 4px; }
.mcp-item { font-size: 13px; color: var(--text3); display: flex; align-items: center; gap: 6px; }
.mcp-item.active { color: var(--green); }
.mcp-item.loading { color: var(--yellow); }
.mcp-item.error { color: var(--red); }
.mcp-item.dim { color: var(--text3); font-style: italic; }

/* BOTTOM voice bar: pill nổi có khoảng thở quanh 4 phía (đồng bộ với kiểu pill của mobile),
   thay cho dải full-width dán sát mép dưới viewport */
.hud-voice {
  display: flex; align-items: center; gap: 12px;
  margin: 4px 16px 16px; padding: 8px 12px;
  border: 1px solid var(--border); border-radius: 18px; background: var(--bg2);
}
.mic-big {
  background: var(--bg3); border: 1px solid var(--border); color: var(--text2);
  width: 46px; height: 46px; border-radius: 50%; cursor: pointer; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; transition: all 0.2s;
}
.mic-big:hover { border-color: var(--accent); color: var(--accent); }
.mic-big.recording {
  border-color: var(--red); color: var(--red);
  box-shadow: 0 0 0 4px var(--danger-wash); animation: micpulse 1.2s ease-in-out infinite;
}
@keyframes micpulse { 50% { box-shadow: 0 0 0 10px rgba(239,68,68,0); } }
/* Hands-free: luôn nghe - vòng cam cố định */
.mic-big.handsfree {
  border-color: var(--accent); color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-line), 0 0 18px rgba(255,107,43,0.35);
}
.mic-big.handsfree.recording {
  border-color: var(--accent); color: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-line);
  animation: micpulse-hf 1.2s ease-in-out infinite;
}
@keyframes micpulse-hf { 50% { box-shadow: 0 0 0 11px rgba(255,107,43,0); } }
.voice-input {
  flex: 1; background: var(--bg3); border: 1px solid var(--border); border-radius: 12px;
  color: var(--text); font-size: 16px; padding: 11px 14px; resize: none; outline: none;
  line-height: 1.4; max-height: 90px; font-family: inherit;
}
.voice-input:focus { border-color: var(--accent-line); }
.voice-input::placeholder { color: var(--text3); }
.send-btn {
  background: var(--accent-solid); border: none; color: var(--on-accent); width: 44px; height: 44px;
  border-radius: 12px; cursor: pointer; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; transition: opacity 0.2s;
}
.send-btn:hover { opacity: 0.85; }
.send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ===== Mobile: ô nhập thành viên pill lớn (chat là chính) ===== */
@media (max-width: 860px) {
  .hud-voice {
    margin: 6px 10px 8px; padding: 5px 6px 5px 8px; gap: 4px;
    border: 1px solid var(--border); border-radius: 24px; background: var(--bg2);
    align-items: flex-end;
  }
  #ttsToggleBar { display: none; }                 /* loa dời vào ngăn kéo */
  .hud-voice .attach-btn { order: 1; width: 34px; height: 34px; border: none; background: transparent; }
  .hud-voice .voice-input {
    order: 2; border: none; background: transparent; border-radius: 0;
    min-height: 36px; max-height: 40vh; padding: 8px 4px; font-size: 16px;
  }
  .hud-voice .voice-input:focus { border: none; }
  .hud-voice .mic-big { order: 3; width: 34px; height: 34px; border: none; background: transparent; }
  .hud-voice .stop-btn, .hud-voice .send-btn { order: 4; width: 36px; height: 36px; border-radius: 50%; }
}

.stop-btn {
  background: var(--red); border: none; color: white; width: 44px; height: 44px;
  border-radius: 12px; cursor: pointer; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; transition: opacity 0.2s;
  animation: stoppulse 1.3s ease-in-out infinite;
}
.stop-btn:hover { opacity: 0.85; }
@keyframes stoppulse { 50% { box-shadow: 0 0 0 5px var(--danger-wash); } }

.attach-btn {
  background: var(--bg3); border: 1px solid var(--border); color: var(--text2);
  width: 40px; height: 40px; border-radius: 10px; cursor: pointer; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; transition: all 0.2s;
}
.attach-btn:hover { border-color: var(--accent); color: var(--accent); }
/* Nút loa trên khung chat: khi TẮT giọng thì đỏ + gạch chéo cho thấy rõ đang tắt */
.tts-bar-btn.muted { color: var(--red); border-color: var(--danger-line); position: relative; }
.tts-bar-btn.muted:hover { color: var(--red); border-color: var(--red); }
.tts-bar-btn.muted::after {
  content: ""; position: absolute; left: 9px; right: 9px; top: 50%; height: 2px;
  background: var(--red); border-radius: 2px; transform: rotate(-45deg);
}

/* ===== Dải VIỆC NỀN ngay trên khung nhập (background-strip.js) =====
   Hai tông, đúng hai trạng thái đáng cắt ngang khung chat:
     .bg-run   xanh  - có việc đang chạy THẬT
     .bg-stall vàng  - vừa giao nhưng điều phối tắt nên nó KHÔNG chạy (đây là ca gây hiểu lầm
                       nhất, nên nó phải nổi hơn cả ca đang chạy)
   Mọi trạng thái khác (nhắc hẹn/loop chờ tới giờ) thì phần tử mang [hidden] nên không chiếm
   một pixel nào - xem mức "idle" trong background_status.active_view để biết vì sao. */
.bg-strip {
  margin: 0 20px 8px; padding: 8px 12px; border-radius: 12px;
  border: 1px solid var(--border); background: var(--bg3);
  font-size: 13px; color: var(--text2); max-height: 132px; overflow-y: auto;
}
.bg-strip[hidden] { display: none; }
.bg-run { border-color: var(--ok-line); background: var(--ok-wash); }
.bg-stall { border-color: var(--warn-line); background: var(--warn-wash); }
.bg-head { display: flex; align-items: center; gap: 8px; }
.bg-title { font-weight: 600; color: var(--text); flex: 1 1 auto; min-width: 0; }
.bg-open {
  flex: none; background: none; border: 1px solid var(--border); color: var(--text2);
  border-radius: 8px; padding: 3px 9px; font-size: 12px; cursor: pointer; font-family: inherit;
}
.bg-open:hover { color: var(--accent); border-color: var(--accent); }
.bg-dot {
  flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--text2);
}
.bg-run .bg-dot { background: var(--green, #3fb27f); animation: bgPulse 1.4s ease-in-out infinite; }
.bg-stall .bg-dot { background: var(--warn-ink); }
@keyframes bgPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
.bg-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 7px; }
.bg-chip {
  display: inline-flex; align-items: baseline; gap: 5px; max-width: 320px;
  padding: 3px 8px; border-radius: 999px; border: 1px solid var(--border);
  background: var(--bg); font-size: 12px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.bg-chip b { font-weight: 600; color: var(--text2); font-size: 11px; }
.bg-chip i { font-style: normal; color: var(--text2); opacity: 0.75; font-size: 11px; }
.bg-chip.mine { border-color: var(--accent); }
.bg-chip.on b { color: var(--green, #3fb27f); }
.bg-warn { margin-top: 7px; color: var(--warn-ink); line-height: 1.45; }
@media (max-width: 860px) {
  .bg-strip { margin: 0 12px 6px; max-height: 108px; }
}

/* Attachment chips */
.attach-bar {
  display: flex; flex-wrap: wrap; gap: 8px; padding: 0 20px;
  max-height: 0; overflow: hidden; transition: max-height 0.2s, padding 0.2s;
}
.attach-bar.has-items { max-height: 140px; padding: 8px 20px; }
.attach-chip {
  display: flex; align-items: center; gap: 8px; background: var(--bg3);
  border: 1px solid var(--border); border-radius: 10px; padding: 6px 8px 6px 6px;
  font-size: 14px; max-width: 240px;
}
.attach-chip img {
  width: 34px; height: 34px; object-fit: cover; border-radius: 6px; flex-shrink: 0;
}
.attach-chip .chip-ico {
  width: 34px; height: 34px; border-radius: 6px; background: var(--bg);
  display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;
}
.attach-chip .chip-info { display: flex; flex-direction: column; min-width: 0; }
.attach-chip .chip-name { color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.attach-chip .chip-meta { color: var(--text3); font-size: 12px; font-family: var(--font); }
.attach-chip .chip-x {
  background: none; border: none; color: var(--text3); cursor: pointer; font-size: 16px;
  padding: 0 2px; flex-shrink: 0;
}
.attach-chip .chip-x:hover { color: var(--red); }
.attach-chip.uploading { opacity: 0.6; }
/* Chip FILE ĐANG MỞ (ghim): phải nhìn ra ngay là khác đính kèm một lần - nó sống qua nhiều
   lượt chat nên người dùng cần thấy "à, Javis vẫn đang làm việc trên file này". */
.attach-chip.pinned {
  background: var(--accent-wash-2); border-color: var(--accent-line); max-width: 300px;
}
.attach-chip.pinned .chip-ico { background: var(--bg2); color: var(--accent); }
.attach-chip.pinned .chip-name { font-weight: 600; }
.attach-chip.pinned .chip-meta { color: var(--accent-ink); }
/* Cả chip là một nút: bấm vào là quay lại trình sửa của đúng file này. Cây bút bên phải là
   thứ duy nhất báo cho mắt biết chip bấm được - không có nó thì tính năng vô hình. */
.attach-chip.pinned { cursor: pointer; }
.attach-chip.pinned:hover { border-color: var(--accent); }
.attach-chip.pinned:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.attach-chip.pinned .chip-edit {
  display: flex; align-items: center; color: var(--text3); flex-shrink: 0; font-size: 14px;
}
.attach-chip.pinned:hover .chip-edit { color: var(--accent); }

/* Vault structure banner */
.vault-banner {
  position: fixed; top: 62px; left: 50%; transform: translateX(-50%);
  display: none; align-items: center; gap: 12px; z-index: 350;
  background: var(--bg2); border: 1px solid var(--yellow); border-radius: 10px;
  padding: 10px 14px; box-shadow: var(--shadow-2); max-width: 90vw;
}
.vault-banner.show { display: flex; animation: fadeIn 0.25s ease; }
.vb-icon { color: var(--yellow); font-size: 17px; }
.vb-text { font-size: 15px; color: var(--text); }
.vb-init {
  background: var(--yellow); color: var(--on-accent); border: none; padding: 6px 14px;
  border-radius: 7px; font-size: 14px; font-weight: 700; cursor: pointer; white-space: nowrap;
}
.vb-init:hover { opacity: 0.88; }
.vb-init:disabled { opacity: 0.6; cursor: wait; }
.vb-close { background: none; border: none; color: var(--text3); cursor: pointer; font-size: 16px; }
.vb-close:hover { color: var(--text); }

/* Drag-drop overlay */
.drop-overlay {
  position: fixed; inset: 0; z-index: 500; display: none;
  align-items: center; justify-content: center;
  background: var(--accent-wash); backdrop-filter: blur(3px);
  border: 3px dashed var(--accent); border-radius: 12px;
}
.drop-overlay.show { display: flex; }
.drop-overlay .drop-msg {
  font-size: 20px; color: var(--accent); font-weight: 600;
  background: var(--bg2); padding: 20px 32px; border-radius: 12px; border: 1px solid var(--accent);
}

/* Attachment in chat message */
.msg-attach { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
.msg-attach img { max-width: 160px; max-height: 120px; border-radius: 8px; border: 1px solid var(--border); }
.msg-attach .file-tag {
  font-size: 13px; background: var(--bg); border: 1px solid var(--border);
  border-radius: 6px; padding: 4px 8px; font-family: var(--font); color: var(--text2);
}

/* Voice picker popover */
.voice-picker-wrap { position: relative; }
.voice-popover {
  position: absolute; top: calc(100% + 8px); right: 0; width: 260px;
  background: var(--bg2); border: 1px solid var(--border); border-radius: 12px;
  padding: 14px; box-shadow: var(--shadow-2); z-index: 100; display: none;
}
.voice-popover.open { display: block; }
.popover-section { margin-bottom: 14px; }
.popover-section:last-child { margin-bottom: 0; }
.popover-label { font-family: var(--font); font-size: 12px; letter-spacing: 2px; color: var(--text3); margin-bottom: 8px; }
.voice-options { display: flex; flex-direction: column; gap: 6px; }
.voice-opt {
  display: flex; align-items: center; gap: 10px; padding: 8px 10px;
  background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; cursor: pointer;
}
.voice-opt:has(input:checked) { border-color: var(--accent); background: var(--accent-wash); }
.voice-opt input { accent-color: var(--accent); }
.voice-opt strong { font-size: 15px; }
.voice-opt .opt-sub { font-size: 13px; color: var(--text3); margin-top: 2px; }
#rateSlider { accent-color: var(--accent); }
.rate-marks { display: flex; justify-content: space-between; font-size: 12px; color: var(--text3); font-family: var(--font); margin-top: 4px; }
.test-btn {
  width: 100%; background: transparent; color: var(--accent); border: 1px solid var(--accent);
  padding: 8px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer;
}
.test-btn:hover { background: var(--accent-wash-2); }

/* ===== STUDIO ===== */
.studio-open-btn {
  background: var(--accent2-wash); border: 1px solid var(--accent2-line); color: var(--accent2-ink);
  padding: 6px 14px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; margin-right: 8px;
}
.studio-open-btn:hover { background: var(--accent2-wash-2); }
.studio {
  position: fixed; inset: 0; z-index: 420; background: var(--bg); display: none; flex-direction: column;
}
.studio.open { display: flex; animation: fadeIn 0.2s ease; }
.studio-head {
  display: flex; align-items: center; gap: 20px; padding: 0 20px; height: 54px;
  border-bottom: 1px solid var(--border); background: var(--bg2);
}
.studio-title { font-family: var(--font); font-weight: 700; letter-spacing: 2px; color: var(--accent2); }
.studio-tabs { display: flex; gap: 6px; flex: 1; }
.stab {
  background: none; border: 1px solid transparent; color: var(--text2); padding: 7px 16px;
  border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: 600;
}
.stab:hover { color: var(--text); }
.stab.active { background: var(--bg3); border-color: var(--border); color: var(--accent2); }
.studio-close { background: var(--bg3); border: 1px solid var(--border); color: var(--text2); width: 32px; height: 32px; border-radius: 8px; cursor: pointer; }
.studio-close:hover { color: var(--accent); border-color: var(--accent); }
.studio-body { flex: 1; overflow-y: auto; padding: 20px; }
.stab-panel { max-width: 1000px; margin: 0 auto; }
.panel-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.panel-bar h3 { font-size: 16px; color: var(--text); }
.pb-actions { display: flex; gap: 8px; }
.s-btn { background: var(--accent2); color: var(--on-accent); border: none; padding: 8px 16px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; }
.s-btn:hover { opacity: 0.88; }
.s-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.s-btn-ghost { background: var(--bg3); color: var(--text2); border: 1px solid var(--border); padding: 7px 14px; border-radius: 8px; font-size: 14px; cursor: pointer; }
.s-btn-ghost:hover { color: var(--text); border-color: var(--accent2); }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
.empty { color: var(--text3); font-size: 15px; padding: 30px; text-align: center; grid-column: 1/-1; line-height: 1.7; }
.dim { color: var(--text3); font-size: 13px; }

/* Workflow row: mỗi workflow một hàng đầy chiều rộng (KHÔNG dùng lưới .cards như
   Agents/Lịch - pipeline nằm ngang nên cần trọn bề ngang, cột hẹp sẽ bóp nát nó). */
.wf-list { display: flex; flex-direction: column; gap: 14px; }
.wf-row { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 14px; transition: border-color 0.3s; }
.wf-row.archived { opacity: 0.5; }
.wf-row.running { border-color: var(--accent); }

/* Workflow card (tab Lịch vẫn dùng) */
.wf-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 14px; transition: border-color 0.3s; }
.wf-card.archived { opacity: 0.5; }
/* Mức quyền của nhắc hẹn "tự làm". Mức toàn quyền phải NỔI trên thẻ: việc đó tới giờ tự chạy
   một mình và làm được cả hành động không rút lại được, nên nó không được trông giống một dòng
   phụ chú xám như các mức khác. */
.rm-mq { color: var(--text3); }
.rm-mq.on {
  color: var(--red); font-weight: 600;
  border: 1px solid rgba(224, 102, 74, .45); border-radius: 999px; padding: 0 6px;
}
.wf-card.running { border-color: var(--accent); }
.wf-header { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 6px; }
.wf-spacer { flex: 1; min-width: 8px; }
.wf-count { font-size: 12px; color: var(--text3); font-family: var(--font); white-space: nowrap; }
.wf-name { font-size: 16px; font-weight: 600; color: var(--text); }
.wf-badge { font-size: 12px; padding: 3px 9px; border-radius: 20px; font-family: var(--font); white-space: nowrap; }
.wf-badge.ready { background: var(--ok-wash); color: var(--green); }
.wf-badge.off { background: var(--bg3); color: var(--text3); }
.wf-badge.running { background: var(--accent2-wash); color: var(--accent); }
.wf-desc { font-size: 14px; color: var(--text2); margin-bottom: 10px; line-height: 1.5; }
/* Bước dàn ngang, hết chỗ thì xuống dòng. 150px là mức tối thiểu để chữ còn đọc được;
   trước đây flex:1 chia đều nên 11 bước bóp mỗi ô còn ~35px, chữ bị ellipsis mất sạch
   và chỉ còn lại mấy cột rỗng. Dùng grid auto-fill chứ KHÔNG dùng flex-wrap: với flex,
   ô lẻ ở hàng cuối bị flex-grow kéo giãn ra full-width (11 bước → ô cuối rộng 1650px). */
.wf-pipeline { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 6px; margin: 10px 0 0; }
.wf-pstep { min-width: 0; background: var(--surface-1); border: 1px solid var(--border); border-radius: 8px; padding: 8px; text-align: left; transition: border-color 0.3s, background 0.3s; }
.wf-pstep.active { border-color: var(--accent); background: var(--accent2-wash); animation: wf-pulse 1.3s ease-in-out infinite; }
.wf-pstep.done { border-color: var(--green); background: var(--ok-wash); }
.wps-num { font-size: 11px; color: var(--text3); font-family: var(--font); margin-bottom: 3px; letter-spacing: 0.05em; }
.wf-pstep.done .wps-num { color: var(--green); }
.wf-pstep.done .wps-num::before {
  content: ""; display: inline-block; width: 1em; height: 1em; margin-right: .2em;
  vertical-align: -0.14em; background-color: currentColor;
  -webkit-mask: var(--ic-check) center/contain no-repeat;
  mask: var(--ic-check) center/contain no-repeat;
}
.wf-pstep.active .wps-num { color: var(--accent); }
/* Việc làm là chữ chính, tên agent hạ xuống chữ phụ: nhiều workflow gọi CÙNG một
   agent ở mọi bước (vd viral-video-production), lấy agent làm chính thì các ô hiện
   chữ giống hệt nhau và không phân biệt được bước nào với bước nào. */
.wps-task { font-size: 13px; color: var(--text); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; overflow-wrap: anywhere; }
.wps-name { font-size: 11px; color: var(--text3); margin-top: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wf-actions { display: flex; gap: 6px; flex-wrap: wrap; }
.s-btn.run { background: var(--accent-solid); padding: 6px 12px; font-size: 14px; }
@keyframes wf-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(168,139,250,0); }
  50% { box-shadow: 0 0 0 5px var(--accent2-wash-2); }
}

/* toggle */
.toggle { position: relative; display: inline-block; width: 38px; height: 21px; cursor: pointer; }
.toggle input { opacity: 0; width: 0; height: 0; }
.toggle span { position: absolute; inset: 0; background: var(--bg3); border: 1px solid var(--border); border-radius: 21px; transition: 0.2s; }
.toggle span::before { content: ""; position: absolute; width: 15px; height: 15px; left: 2px; top: 2px; background: var(--text3); border-radius: 50%; transition: 0.2s; }
.toggle input:checked + span { background: var(--ok-line); border-color: var(--green); }
.toggle input:checked + span::before { transform: translateX(17px); background: var(--green); }

/* Agent card */
.ag-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 14px; }
.ag-name { font-size: 16px; font-weight: 600; color: var(--text); }
.ag-model { font-size: 11px; color: var(--text3); font-family: var(--font); border: 1px solid var(--border); padding: 1px 5px; border-radius: 5px; }
.ag-role { font-size: 14px; color: var(--text2); margin: 6px 0 8px; line-height: 1.5; }
.ag-skills { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 12px; }
.chip-skill { font-size: 12px; background: var(--accent2-wash); border: 1px solid var(--accent2-line); color: var(--accent2-ink); padding: 2px 7px; border-radius: 6px; font-family: var(--font); }

/* Skill card */
.sk-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 14px; }
.sk-name { font-size: 15px; font-weight: 600; color: var(--text); }
.sk-desc { font-size: 14px; color: var(--text2); margin: 6px 0; line-height: 1.5; }
.sk-src { font-size: 12px; color: var(--text3); font-family: var(--font); }

/* Run drawer */
.run-drawer {
  position: absolute; top: 54px; right: 0; bottom: 0; width: 460px; max-width: 90vw;
  background: var(--bg2); border-left: 1px solid var(--border); display: none; flex-direction: column;
  box-shadow: -12px 0 30px var(--shadow-veil);
}
.run-drawer.open { display: flex; animation: fadeIn 0.2s ease; }
.run-head { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--border); font-weight: 600; font-size: 16px; }
.run-close { background: var(--bg3); border: 1px solid var(--border); color: var(--text2); width: 28px; height: 28px; border-radius: 6px; cursor: pointer; }
.run-steps { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 12px; }
.run-info { font-size: 14px; color: var(--text3); font-family: var(--font); text-align: center; }
.run-info.done { color: var(--green); }
.run-step { background: var(--bg3); border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; }
.run-step.done { border-color: var(--ok-line); }
.rs-head { display: flex; align-items: center; gap: 8px; font-size: 14px; }
.rs-num { background: var(--accent2); color: var(--on-accent); width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; }
.rs-agent { font-weight: 600; color: var(--text); }
.rs-tool { font-size: 12px; color: var(--accent2-ink); font-family: var(--font); }
.rs-ok { color: var(--green); }
.rs-spin { width: 10px; height: 10px; border: 1.5px solid var(--accent2-line); border-top-color: var(--accent2); border-radius: 50%; animation: spin 0.7s linear infinite; }
.rs-task { font-size: 13px; color: var(--text2); margin: 6px 0; font-style: italic; }
.rs-out { font-size: 14px; color: var(--text); line-height: 1.55; white-space: pre-wrap; max-height: 240px; overflow-y: auto; }
.rs-err { color: var(--red); font-size: 13px; }

/* Editor modal */
.studio-editor { position: fixed; inset: 0; z-index: 440; background: var(--scrim); backdrop-filter: blur(6px); display: none; align-items: center; justify-content: center; }
.studio-editor.open { display: flex; animation: fadeIn 0.15s ease; }
.editor-box { width: 560px; max-width: 92vw; max-height: 86vh; overflow-y: auto; background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 20px; }
.editor-box h3 { font-size: 16px; margin-bottom: 14px; color: var(--text); }
.editor-box label { display: block; font-size: 13px; color: var(--text2); margin: 12px 0 5px; font-weight: 600; }
.editor-box input, .editor-box textarea, .editor-box select {
  width: 100%; background: var(--bg3); border: 1px solid var(--border); color: var(--text);
  padding: 9px 11px; border-radius: 8px; font-size: 15px; font-family: inherit; outline: none;
}
.editor-box input:focus, .editor-box textarea:focus { border-color: var(--accent2); }
.editor-box textarea { resize: vertical; }
/* Bước gập lại để thấy toàn cảnh workflow dài; bấm header thì mở ra sửa.
   Gập = ẩn bằng CSS chứ KHÔNG bỏ input khỏi DOM, vì captureSteps() đọc value của chúng. */
.step-row { background: var(--surface-1); border: 1px solid var(--border); border-radius: 10px; padding: 12px; margin-bottom: 8px; display: flex; flex-direction: column; gap: 8px; }
.step-row:not(.open) { padding: 8px 10px; }
.step-row.open { border-color: var(--accent2); background: var(--accent2-wash); }
.step-row:not(.open) .step-header { cursor: pointer; }
.step-row:not(.open) .step-header:hover .step-sum { color: var(--text); }
.step-row:not(.open) .st-agent, .step-row:not(.open) .step-body { display: none; }
.step-row.open .step-sum { display: none; }
.step-body { display: flex; flex-direction: column; gap: 8px; }
.step-sum { flex: 1; min-width: 0; font-size: 13px; color: var(--text2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.st-move { background: none; border: 1px solid var(--border); color: var(--text3); border-radius: 6px; cursor: pointer; height: 28px; width: 24px; flex-shrink: 0; font-size: 12px; line-height: 1; }
.st-move:hover:not(:disabled) { border-color: var(--accent2); color: var(--accent2); }
.st-move:disabled { opacity: 0.3; cursor: default; }
.step-header { display: flex; align-items: center; gap: 8px; }
.step-num { background: var(--accent2); color: var(--on-accent); width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
.st-agent { flex: 1; }
.st-del { background: none; border: 1px solid var(--border); color: var(--text3); border-radius: 6px; cursor: pointer; height: 28px; width: 28px; flex-shrink: 0; font-size: 14px; }
.st-del:hover { border-color: var(--red); color: var(--red); }
.st-task { width: 100%; min-height: 64px; resize: vertical; box-sizing: border-box; }
.st-verify { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; padding-top: 6px; border-top: 1px solid var(--surface-2); }
.st-verify .stv-lbl { font-size: 13px; color: var(--text3); }
.st-verify-agent { flex: 1; min-width: 120px; background: var(--field-bg); border: 1px solid var(--border); color: var(--text2); border-radius: 5px; padding: 3px 5px; font-size: 13px; }
/* Phải là ".editor-box .st-retries" (0,2,0) chứ KHÔNG phải ".st-retries" (0,1,0): quy tắc
   gộp ".editor-box input {width:100%}" ở trên có specificity (0,1,1) nên thắng, kéo ô số này
   full-width làm nó rớt xuống dòng riêng và đẩy chữ "lần" xuống dòng thứ ba. */
.editor-box .st-retries { width: 48px; flex: 0 0 48px; background: var(--field-bg); border: 1px solid var(--border); color: var(--text); border-radius: 5px; padding: 3px; font-size: 13px; text-align: center; }
.st-del:hover { color: var(--red); border-color: var(--red); }
/* Thanh lật trang của các khung nhật ký (pager() trong console.js). Trước đây trang Việc định
   kỳ tự vẽ bằng style nội tuyến; nay ba trang dùng chung một khối nên style về đây luôn. */
.jv-pager { display: flex; align-items: center; gap: 10px; margin-top: 10px; }
.jv-pager-n { font-size: 13px; color: var(--text3); }
.jv-pager button[disabled] { opacity: .45; cursor: default; }

/* ===== Khung chọn skill trong màn sửa Agent (tìm kiếm + gom nhóm) ===== */
.sp-box { background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; }
.sp-bar { display: flex; align-items: center; gap: 8px; padding: 8px; border-bottom: 1px solid var(--border); }
.sp-bar input { flex: 1 1 auto; min-width: 0; padding: 6px 9px; border-radius: 7px;
  border: 1px solid var(--border); background: var(--field-bg); color: var(--text);
  font-size: 13.5px; outline: none; }
.sp-bar input:focus { border-color: var(--info-line); }
.sp-count { flex: none; font-size: 12px; color: var(--text3); white-space: nowrap; }
.sp-clear { flex: none; font-size: 12px; padding: 5px 9px; }
.sp-groups { max-height: 320px; overflow-y: auto; padding: 6px; }
.sp-empty { padding: 14px 8px; text-align: center; font-size: 13px; }
.sp-g + .sp-g { margin-top: 2px; }
.sp-g-head { display: flex; align-items: center; gap: 7px; width: 100%; padding: 6px 8px;
  border: 0; border-radius: 7px; background: transparent; cursor: pointer;
  color: var(--text2); font-size: 13px; font-weight: 600; font-family: inherit; text-align: left; }
.sp-g-head:hover { background: var(--info-wash); color: var(--text); }
.sp-g-caret { flex: none; display: inline-flex; transition: transform .15s; }
.sp-g.open .sp-g-caret { transform: rotate(90deg); }
.sp-g-name { flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sp-g-n { flex: none; font-size: 11px; font-weight: 400; color: var(--text3); }
.sp-g-body { display: none; padding: 2px 8px 8px 26px; }
.sp-g.open .sp-g-body { display: flex; flex-direction: column; gap: 5px; }
.sp-g-body .sp { display: flex; align-items: center; gap: 7px; font-size: 13.5px;
  color: var(--text); cursor: pointer; }
.sp-g-body .sp span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sp-g-body input { width: auto; flex: none; accent-color: var(--accent2); }

.skill-pick { display: flex; flex-wrap: wrap; gap: 8px; background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; padding: 10px; }
.skill-pick .sp { display: flex; align-items: center; gap: 5px; font-size: 14px; color: var(--text); width: auto; background: none; border: none; padding: 0; cursor: pointer; }
.skill-pick input { width: auto; accent-color: var(--accent2); }
.editor-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; }

/* ===== #quickSet: ẩn mặc định, CHỈ hiện khi được nhúng vào trang Cài đặt (#cviewBody) ===== */
.quick-set { display: none; }
#cviewBody .quick-set { display: block; }
#cviewBody .quick-set > summary { display: none; }   /* trang Cài đặt đã có tiêu đề riêng */
.quick-set > summary::-webkit-details-marker { display: none; }
.quick-set .qs-caret { display: inline-block; transition: transform 0.2s; }
.quick-set[open] .qs-caret { transform: rotate(90deg); }
.quick-set-body { display: flex; flex-direction: column; gap: 12px; padding: 12px 0 4px; }
.settings-page .quick-set-body {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;
  padding: 16px 0 0;
}
.settings-page .quick-set-body > .qs-row { grid-column: 1 / -1; }
.settings-page .quick-set-body > #ttsProviderHost,
.settings-page .quick-set-body > .voice-picker-wrap { min-width: 0; }
.settings-page .quick-set-body > .qs-block { min-width: 0; }
.qs-block { background: var(--bg3); border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; }
.qs-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; font-size: 14px; color: var(--text2);
  background: var(--bg3); border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; }
/* Popover giọng nói giờ hiển thị INLINE trong sidebar (không nổi/che như ở header) */
.quick-set .voice-picker-wrap { position: static; }
.quick-set .voice-popover { position: static; display: block; width: auto; padding: 0; border: none; background: transparent; box-shadow: none; }
.quick-set-body .s-btn, .quick-set-body .s-btn-ghost, .quick-set-body .test-btn { width: 100%; }
/* Trừ nút nằm trong HÀNG NGANG (ô nhập + nút). Trong một flex row, item mang width:100% có
   flex-basis:auto nên "cỡ mong muốn" của nó = trọn hàng; ô nhập bên cạnh lại là flex:1
   (basis 0) nên khi phải co, toàn bộ phần co dồn vào nút còn ô nhập teo lại còn một sợi.
   Đúng lỗi ô nhập tên miền bé tí không nhìn thấy. Specificity 3 lớp để thắng dòng trên
   bất kể thứ tự nạp (CSS của khối tên miền do branding.js tiêm lúc chạy). */
.quick-set-body .dom-field .s-btn,
.quick-set-body .dom-ssl .s-btn,
.quick-set-body .dom-ssl .s-btn-ghost { width: auto; }
.quick-set .set-actions { display: flex; flex-direction: column; gap: 6px; margin-top: 6px; }

@media (max-width: 700px) {
  .settings-page .quick-set-body { grid-template-columns: 1fr; }
  .settings-page .quick-set-body > .qs-row { grid-column: auto; }
}

/* Dòng nhỏ dưới mỗi câu trả lời: lượt này đi đường nào, tốn bao nhiêu token vào.
   Cố ý MỜ và nhỏ: đây là thông tin nền, không được tranh chỗ với câu trả lời. Nhưng phải có,
   vì trước đó chuyện lượt chat tụt về đường cũ là hoàn toàn vô hình. */
.msg-ctx { font-size: 10.5px; color: var(--text3); margin: 3px 0 0 2px; cursor: pointer;
  font-variant-numeric: tabular-nums; opacity: .65; transition: opacity .15s; }
.msg-ctx:hover { opacity: 1; }
.msg-ctx.saved { color: var(--accent); }

/* ===== SIDEBAR LỊCH SỬ HỘI THOẠI (sessions-ui.js) =====
   Dùng chung cho MỌI chỗ đặt danh sách hội thoại. Hiện chỉ còn một chỗ: cột trái của trang
   Trò chuyện (console.js renderChat -> #chatPageSide). Lớp nổi .chat-stage cũ - khung chat
   "phóng to" đè lên cockpit - đã bỏ ở 0.12.4: nó mượn đúng bốn node #chatArea/#attachBar/
   #modelBar/#hudVoice mà trang Trò chuyện cũng mượn, nên hai bên giành nhau và người dùng
   có hai khung chat gần giống hệt. Nút phóng to nay chuyển thẳng sang trang Trò chuyện. */
/* Hai tab của cột trái: Hội thoại | Thư mục. Cột này vốn chỉ có lịch sử chat, nên muốn xem
   brain đang có file gì là phải rời khung chat sang trang Tệp tin - mà rời đi rồi thì mất chỗ
   đang nói dở. Tab thứ hai giữ cả hai thứ trong cùng một cột. */
.cside-tabs { display: flex; gap: 4px; flex: none; }
.cside-tab { flex: 1 1 0; display: inline-flex; align-items: center; justify-content: center;
  gap: 6px; padding: 7px 8px; border-radius: 8px; cursor: pointer;
  border: 1px solid transparent; background: transparent; color: var(--text3);
  font-size: 13px; font-weight: 600; }
.cside-tab:hover { color: var(--text); }
.cside-tab.active { background: var(--accent-wash-2); border-color: var(--accent-line);
  color: var(--accent); }
/* Pane không hoạt động phải display:none chứ không chỉ ẩn: cây thư mục dài có thanh cuộn
   riêng, để nó nằm trong luồng là cột trái cao gấp đôi và danh sách hội thoại bị đẩy mất. */
.cside-pane { display: none; flex-direction: column; gap: 10px; flex: 1 1 auto; min-height: 0; }
.cside-pane.on { display: flex; }

/* ===== PANEL VAULT KHI ĐƯỢC MƯỢN SANG CỘT CHAT =====
   Không có cây thứ hai: tab "Thư mục" mượn đúng .hud-left của màn chính. Nó vốn là một cột
   của lưới HUD nên mang theo bề rộng và viền riêng; ở đây phải gỡ những thứ đó ra, nếu không
   cột chat bị đội rộng và có hai đường viền chồng nhau. */
/* display:flex KHÔNG thừa. Trên điện thoại console.css ẩn hẳn .hud-left (\`display: none\`) vì
   ở màn chính cột đó không có chỗ. Nhưng tab "Thư mục" MƯỢN đúng node ấy, nên luật kia đi
   theo sang đây và cả tab thành một khoảng trắng - bấm vào không thấy gì, không lỗi, không
   báo. Chủ repo báo đúng triệu chứng đó (2026-08-12). Chọn hai lớp nên thắng luật một lớp
   trong media query mà không cần !important; pane đang tắt vẫn display:none nên cây chỉ hiện
   khi thật sự mở tab. */
.cside-pane > .hud-left { display: flex; width: auto; max-width: none; min-width: 0; flex: 1 1 auto;
  min-height: 0; padding: 0; border: 0; background: transparent; }
/* Nút "Vị trí" ở kết quả tìm kiếm: xổ cây tới đúng thư mục đang chứa file. Nằm bên phải tên
   file, chỉ hiện rõ khi rê chuột để không tranh chỗ với chính cái tên. */
.vr-name { display: flex; align-items: center; gap: 6px; }
.vr-loc { margin-left: auto; flex: none; padding: 2px 7px; border-radius: 6px; cursor: pointer;
  border: 1px solid var(--border); background: transparent; color: var(--text3);
  font-size: 11px; opacity: .55; transition: opacity .15s; }
.vr-item:hover .vr-loc { opacity: 1; }
.vr-loc:hover { border-color: var(--accent-line); color: var(--accent); }

.cside-new { background: var(--accent-wash-2); border: 1px solid var(--accent-line);
  color: var(--accent); border-radius: 9px; padding: 9px 10px; cursor: pointer;
  font-size: 14px; font-weight: 600; text-align: left; }
.cside-new:hover { background: var(--accent-wash-2); }
.cside-search { padding: 8px 10px; border-radius: 8px; border: 1px solid var(--border);
  background: var(--field-bg); color: var(--text); font-size: 14px; outline: none; }
.cside-search:focus { border-color: var(--info-line); }

/* ===== Thanh Project (nhóm hội thoại) trên đầu cột trái ===== */
.cside-proj { display: flex; align-items: center; gap: 4px; flex: none; }
.cs-proj-cur { flex: 1 1 auto; min-width: 0; display: flex; align-items: center; gap: 6px;
  padding: 7px 9px; border-radius: 8px; cursor: pointer; text-align: left;
  border: 1px solid var(--border); background: transparent; color: var(--text2);
  font-size: 13px; font-family: inherit; }
.cs-proj-cur:hover { border-color: var(--info-line); color: var(--text); }
.cs-proj-name { flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cs-proj-caret { flex: none; opacity: .6; display: inline-flex; }
.cs-proj-x, .cs-proj-add { flex: none; width: 30px; height: 30px; border-radius: 8px;
  display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
  border: 1px solid var(--border); background: transparent; color: var(--text3); }
.cs-proj-x:hover, .cs-proj-add:hover { border-color: var(--accent-line); color: var(--accent); }

/* ===== Popover dùng chung: menu project + bộ chọn icon ===== */
/* Neo vào body chứ không vào cột trái: cột đó có overflow riêng, để menu bên trong là nó bị
   cắt cụt ngay hàng thứ hai. */
.cs-menu { position: fixed; z-index: 4000; min-width: 200px; max-width: 280px;
  max-height: 60vh; overflow-y: auto; padding: 5px;
  background: var(--bg2); border: 1px solid var(--border); border-radius: 10px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, .45); }
.cs-menu-sep { height: 1px; background: var(--border); margin: 5px 3px; }
.cs-menu-row { display: flex; align-items: center; gap: 2px; border-radius: 7px; }
.cs-menu-row:hover { background: var(--info-wash); }
.cs-menu-row.on .cs-menu-lbl { color: var(--accent); font-weight: 600; }
.cs-menu-main { flex: 1 1 auto; min-width: 0; display: flex; align-items: center; gap: 8px;
  padding: 7px 8px; border: 0; background: transparent; cursor: pointer;
  color: var(--text); font-size: 13.5px; font-family: inherit; text-align: left; }
.cs-menu-lbl { flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cs-menu-right { flex: none; color: var(--text3); font-size: 12px; }
.cs-menu-acts { flex: none; display: flex; gap: 1px; opacity: 0; transition: opacity .15s; }
.cs-menu-row:hover .cs-menu-acts { opacity: 1; }
.cs-menu-act { width: 24px; height: 24px; border-radius: 6px; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
  border: 0; background: transparent; color: var(--text3); }
.cs-menu-act:hover { color: var(--text-hi); background: var(--bg3); }
/* Bộ chọn icon: lưới icon Lucide app đã vendor (KHÔNG phải emoji - xem sessions-ui.js).
   Ô lọc dính trên đầu vì lưới dài hơn khung và có thanh cuộn riêng. */
.cs-ico { min-width: 280px; }
.cs-ico-head { position: sticky; top: -5px; z-index: 1; display: flex; gap: 5px;
  padding: 3px 0 6px; margin-bottom: 4px; background: var(--bg2);
  border-bottom: 1px solid var(--border); }
.cs-ico-in { flex: 1 1 auto; min-width: 0; padding: 5px 8px; border-radius: 7px;
  border: 1px solid var(--border); background: var(--field-bg); color: var(--text);
  font-size: 13px; outline: none; }
.cs-ico-in:focus { border-color: var(--info-line); }
.cs-ico-clear { flex: none; padding: 5px 9px; border-radius: 7px; cursor: pointer;
  border: 1px solid var(--border); background: transparent; color: var(--text3); font-size: 12px; }
.cs-ico-clear:hover { border-color: var(--red); color: var(--red); }
.cs-ico-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.cs-ico-b { display: inline-flex; align-items: center; justify-content: center;
  height: 32px; border-radius: 6px; cursor: pointer; font-size: 17px; color: var(--text2);
  border: 1px solid transparent; background: transparent; }
.cs-ico-b:hover { background: var(--info-wash); color: var(--text-hi); }
.cs-ico-b.on { border-color: var(--accent-line); background: var(--accent-wash-2); color: var(--accent); }
.cs-ico-empty { grid-column: 1 / -1; padding: 14px 6px; text-align: center;
  color: var(--text3); font-size: 12.5px; }
/* Icon đứng trước nhãn project, ở thanh chọn nhóm lẫn trong menu. Icon để PHÂN LOẠI nằm ở
   đây chứ không ở từng hội thoại: mỗi project thật sự là một thứ khác nhau, còn hàng nào
   trong danh sách hội thoại cũng là một cuộc trò chuyện. */
.cs-menu-ico, .cs-proj-name .ic { display: inline-flex; flex: none; color: var(--text2); }
.cs-menu-row.on .cs-menu-ico, .cs-proj-name .ic { color: inherit; }
/* Nút ghim đang BẬT thì tô màu, nhưng vẫn nằm trong .act nên chỉ hiện khi rê chuột - hàng đã
   ghim đã có nhóm "Đã ghim" trên đầu làm dấu hiệu rồi, không cần thêm một chấm màu nữa. */
.ci-meta .act .pin.on { color: var(--accent); }
.cside-list { flex: 1 1 auto; overflow-y: auto; min-height: 0; padding-right: 2px; }
.cside-list::-webkit-scrollbar { width: 4px; }
.cside-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
.cside-group { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--text3); padding: 10px 6px 4px; }
.cside-item { padding: 8px 10px; border-radius: 9px; cursor: pointer;
  border: 1px solid transparent; margin-bottom: 2px; }
.cside-item:hover { background: var(--info-wash); border-color: var(--info-line); }
.cside-item.active { background: var(--accent-wash-2); border-color: var(--accent-line); }
.ci-title { color: var(--text); font-size: 14px; font-weight: 600;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ci-meta { display: flex; gap: 8px; align-items: center; font-size: 12px;
  color: var(--text3); margin-top: 3px; }
.ci-badge { border: 1px solid var(--border); border-radius: 8px; padding: 0 6px; font-size: 11px; }
.ci-meta .act { margin-left: auto; display: flex; gap: 7px; opacity: 0; transition: opacity 0.15s; }
.cside-item:hover .act { opacity: 1; }
.ci-meta .act span { cursor: pointer; }
.ci-meta .act span:hover { color: var(--text-hi); }
/* Lớp chắn thứ hai cho cùng lỗi bấm-trượt: icon không nhận chuột thì e.target luôn là cái
   span, kể cả khi ai đó lỡ viết lại handler theo kiểu so classList. */
.ci-meta .act span .ic { pointer-events: none; }
.ci-snip { font-size: 12.5px; color: var(--text2); margin-top: 2px; }
.ci-snip b { color: var(--warn-ink); }
.cside-empty { color: var(--text3); text-align: center; padding: 26px 8px; font-size: 13.5px; }
.cside-more { display: block; width: 100%; margin: 8px 0 4px; padding: 8px 10px;
  border: 1px solid var(--border); border-radius: 9px; background: transparent;
  color: var(--text2); font-size: 13px; cursor: pointer; }
.cside-more:hover { background: var(--info-wash); border-color: var(--info-line);
  color: var(--text); }

/* nút Lịch sử (sessions-ui): nằm INLINE trong hàng nút header (.hud-actions) để không đè
   lên các nút Cài đặt/Đọc/Reset như khi còn position:fixed. Bấm vào là sang trang Trò chuyện. */
#jv-sess-btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px;
  border-radius: 20px; white-space: nowrap; flex-shrink: 0;
  border: 1px solid var(--info-line); background: var(--info-wash); color: var(--info-ink);
  font: 600 12px/1 var(--font, system-ui); cursor: pointer; }
#jv-sess-btn:hover { border-color: var(--info-line); color: var(--text-hi); }

/* ===== Thanh chọn model + effort ngay trên khung chat ===== */
/* KHÔNG đặt overflow:hidden lên hàng này. Popup đổi model (.mb-pop) là con position:absolute
   nằm HOÀN TOÀN phía trên hàng (bottom: 100% + 6px), mà hàng lại là khối chứa của nó
   (position:relative) - cắt tràn ở đây là popup biến mất sạch, bấm chip không thấy gì.
   Việc chống nở ngang do dải HỆ THỐNG/MCP dài đã có .sysbar và .mb-chip tự lo bên dưới. */
.model-bar {
  position: relative; display: flex; align-items: center; gap: 8px 16px;
  width: 100%; max-width: 100%; min-width: 0; box-sizing: border-box;
  padding: 8px 18px 6px;
}
/* Dải HỆ THỐNG + MCP nằm ngang nhưng chỉ dùng phần rộng còn lại. Nội dung dài bị cắt
   trong chính dải này, tuyệt đối không làm nở grid/canvas hay đẩy cột chat ra ngoài. */
.sysbar {
  display: flex; align-items: center; gap: 6px 12px;
  flex: 1 1 0; width: 0; min-width: 0; max-width: 100%;
  flex-wrap: nowrap; overflow: hidden;
}
.sysbar-label { font-family: var(--font); font-size: 11px; letter-spacing: 1px; color: var(--text3); flex: none; white-space: nowrap; }
.sysbar-sep { width: 1px; height: 13px; background: var(--border); flex: none; }
.sysbar .sys-status {
  flex: 0 0 auto; min-width: 0; flex-direction: row; flex-wrap: nowrap; gap: 4px 12px;
}
.sysbar .mcp-list {
  flex: 1 1 0; width: 0; min-width: 0; max-width: 100%;
  flex-direction: row; flex-wrap: nowrap; gap: 4px 12px; overflow: hidden;
}
.sysbar .mcp-item {
  min-width: 0; max-width: min(420px, 42vw); overflow: hidden; text-overflow: ellipsis;
  font-size: 12.5px; white-space: nowrap;
}
.sysbar .mcp-list .mcp-item { flex: 0 1 auto; }
.sysbar .mcp-kind { color: var(--text3); font-size: 10px; }
.mb-chip { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text2);
  background: var(--bg3); border: 1px solid var(--border); border-radius: 999px; padding: 4px 11px;
  cursor: pointer; font-family: var(--font); transition: border-color .15s, color .15s;
  /* tên model dài cũng không được phép đẩy nở hàng ra ngoài cột chat */
  flex: 0 1 auto; min-width: 0; max-width: 100%; white-space: nowrap; overflow: hidden; }
.mb-chip:hover { color: var(--text); border-color: var(--accent); }
.mb-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); flex: none; }
.mb-sep { opacity: .4; }
.mb-eff { color: var(--accent2); }
.mb-caret { opacity: .6; font-size: 10px; }
.mb-pop { position: absolute; bottom: calc(100% + 6px); left: 12px; z-index: 60; width: 340px;
  max-height: 62vh; overflow: auto; background: var(--bg2); border: 1px solid var(--border);
  border-radius: 12px; box-shadow: var(--shadow-3); padding: 8px; }
.mb-pop[hidden] { display: none; }
.mb-search { width: 100%; box-sizing: border-box; background: var(--bg); border: 1px solid var(--border);
  color: var(--text); border-radius: 8px; padding: 7px 9px; font-size: 13px; margin-bottom: 6px;
  font-family: var(--font); }
.mb-search:focus { outline: none; border-color: var(--accent); }
.mb-prov { font-size: 11px; text-transform: uppercase; letter-spacing: .4px; color: var(--text3);
  padding: 8px 8px 3px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
.mb-prov:hover { color: var(--text2); }
.mb-prov.off { opacity: .55; cursor: default; }
.mb-item { display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 8px;
  font-size: 13px; color: var(--text); cursor: pointer; }
.mb-item:hover { background: var(--bg3); }
.mb-item.cur { background: var(--accent-wash-2); color: var(--accent); }
.mb-item .tick { width: 14px; color: var(--green); flex: none; }
.mb-empty { font-size: 12px; color: var(--text3); padding: 4px 10px 8px; }
.mb-link { font-size: 12px; color: var(--accent2); padding: 4px 10px 8px; cursor: pointer; }
.mb-link:hover { text-decoration: underline; }
.mb-eff-row { display: flex; gap: 6px; border-top: 1px solid var(--border); margin-top: 6px; padding: 8px 4px 4px; }
.mb-eff-row .lbl { font-size: 11px; color: var(--text3); align-self: center; margin-right: 2px; }
.mb-eff-btn { flex: 1; font-size: 12px; color: var(--text2); background: var(--bg3);
  border: 1px solid var(--border); border-radius: 8px; padding: 5px; cursor: pointer; text-align: center;
  font-family: var(--font); }
.mb-eff-btn:hover { color: var(--text); }
.mb-eff-btn.cur { background: var(--accent2-wash-2); color: var(--accent2); border-color: var(--accent2); }

/* ============================================================
   Chat render (chat-render.js): markdown day du + code highlight + ARTIFACT
   ============================================================ */

/* Markdown block trong bong bong Javis */
.msg-javis .bubble h1 { font-size: 19px; }
.msg-javis .bubble h2 { font-size: 17px; }
.msg-javis .bubble h1, .msg-javis .bubble h2,
.msg-javis .bubble h4, .msg-javis .bubble h5, .msg-javis .bubble h6 {
  color: var(--text); margin: 18px 0 6px; line-height: 1.35; }
.msg-javis .bubble h1:first-child, .msg-javis .bubble h2:first-child,
.msg-javis .bubble h4:first-child, .msg-javis .bubble h5:first-child,
.msg-javis .bubble h6:first-child { margin-top: 0; }
/* Khoảng cách giữa hai ĐOẠN phải lớn hơn hẳn khoảng cách giữa hai DÒNG trong cùng đoạn, không
   thì cả khối dính thành một mảng chữ. 14px so với ~26px giãn dòng là đủ tách mà không rời rạc. */
.msg-javis .bubble p { margin: 14px 0; }
.msg-javis .bubble p:first-child { margin-top: 0; }
.msg-javis .bubble p:last-child { margin-bottom: 0; }
.msg-javis .bubble ol { padding-left: 22px; margin: 10px 0; }
.msg-javis .bubble li { margin: 6px 0; }
/* Danh sách lồng nhau thì siết lại: nó vốn đã thuộc về mục cha, giãn bằng đoạn văn là gãy mạch. */
.msg-javis .bubble ul ul, .msg-javis .bubble ul ol,
.msg-javis .bubble ol ol, .msg-javis .bubble ol ul { margin: 4px 0; }
.msg-javis .bubble li > p { margin: 4px 0; }
.msg-javis .bubble blockquote { margin: 14px 0; padding: 8px 14px; color: var(--text2);
  border-left: 3px solid var(--accent); background: var(--surface-1); border-radius: 0 6px 6px 0; }
.msg-javis .bubble blockquote p:last-child { margin-bottom: 0; }
.msg-javis .bubble hr { border: none; border-top: 1px solid var(--border); margin: 10px 0; }
.msg-javis .bubble del { opacity: .65; }
.msg-javis .bubble em { font-style: italic; }
.msg-javis .bubble a { color: var(--link-ink); text-decoration: none; }
.msg-javis .bubble a:hover { text-decoration: underline; }
.msg-javis .bubble .task-item { list-style: none; margin-left: -16px; }
.msg-javis .bubble .task-item input { margin-right: 6px; vertical-align: middle; }
.chat-img { max-width: min(100%, 440px); border-radius: 8px; display: block; margin: 6px 0; cursor: zoom-in; }
/* Anh da bi don khoi vung cache (media_gc) hoac bi xoa tay. Vien dut de nhin ra ngay day la
   cho trong chu khong phai mot the anh that. */
.chat-img-gone { display: inline-block; margin: 6px 0; padding: 10px 14px; border-radius: 8px;
  border: 1px dashed var(--border); background: var(--bg3); color: var(--text3); font-size: 13px; }

/* ===== Lightbox xem ảnh (bấm ảnh trong chat) =====
   Con trỏ .chat-img vốn đã là zoom-in từ lâu, nhưng bấm vào lại TẢI FILE VỀ - hứa một đằng
   làm một nẻo. Nay bấm là mở lớp này: ảnh vừa màn, kèm nút Tải về / Mở tab mới / Đóng. */
.jv-lb { position: fixed; inset: 0; z-index: 5000; display: flex; flex-direction: column;
  background: rgba(0, 0, 0, 0.86); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
body.jv-lb-open { overflow: hidden; }        /* khoá cuộn nền để lăn chuột là lăn trong ảnh */
.jv-lb-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 10px 14px; color: #fff; flex: none; }
.jv-lb-ten { font-size: 13px; opacity: 0.75; overflow: hidden; text-overflow: ellipsis;
  white-space: nowrap; min-width: 0; }
.jv-lb-nut { display: flex; align-items: center; gap: 8px; flex: none; }
.jv-lb-nut button { display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
  background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.22);
  color: #fff; border-radius: 8px; padding: 6px 12px; font: inherit; font-size: 13px; }
.jv-lb-nut button:hover { background: rgba(255, 255, 255, 0.2); }
/* Khung ảnh chiếm hết phần còn lại; ảnh canh giữa và luôn vừa màn ở trạng thái mặc định. */
.jv-lb-khung { flex: 1 1 auto; min-height: 0; display: flex; align-items: center;
  justify-content: center; padding: 0 14px 14px; overflow: auto; }
.jv-lb-img { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 6px;
  cursor: zoom-in; }
/* Bấm vào ảnh -> xem cỡ thật để soi chi tiết, kéo trong khung để xem phần khuất. */
.jv-lb.that .jv-lb-khung { align-items: flex-start; justify-content: flex-start; }
.jv-lb.that .jv-lb-img { max-width: none; max-height: none; cursor: zoom-out; }
@media (max-width: 700px) {
  .jv-lb-bar { padding: 8px 10px; }
  .jv-lb-nut button { padding: 6px 9px; }
}

/* Code block: header nhan ngon ngu + nut Copy + to mau cu phap */
.code-wrap { position: relative; margin: 8px 0; }
.code-head { display: flex; align-items: center; justify-content: space-between; gap: 8px;
  padding: 5px 10px; background: var(--code-bg); border: 1px solid var(--border); border-bottom: none;
  border-radius: 8px 8px 0 0; }
.code-lang { font-family: var(--font); font-size: 11px; letter-spacing: .06em; text-transform: uppercase;
  color: var(--text3); }
.code-wrap .code-copy { position: static; top: auto; right: auto; opacity: 0;
  background: var(--bg3); border: 1px solid var(--border); color: var(--text2);
  border-radius: 6px; padding: 2px 8px; font-size: 12px; cursor: pointer; }
.code-wrap:hover .code-copy { opacity: 1; }
.code-wrap .code-block { margin: 0; border-radius: 0 0 8px 8px; border-top: none; }
.code-wrap.code-live { outline: 1px solid var(--accent-line); }
.code-wrap.code-live .code-lang::after { content: " · dang go"; color: var(--accent); }
.code-block .tok-c { color: var(--tok-c); font-style: italic; }
.code-block .tok-s { color: var(--tok-s); }
.code-block .tok-n { color: var(--tok-n); }
.code-block .tok-k { color: var(--tok-k); font-weight: 600; }

/* ---- To mau cu phap trong O SUA code (code-hl.js) ----
   Hai lop chong khit: <pre.jvhl-view> nam duoi lo mau, <textarea.jvhl-ta> nam tren voi chu
   TRONG SUOT nhung con tro van thay. Moi thuoc tinh anh huong toi cho xuong dong phai giong
   HET nhau o ca hai, khong thi chu mau se lech khoi chu that. Doi mot dong o day = phai doi
   ca hai selector, dung tach ra. */
.jvhl { position: relative; width: 100%; height: 100%; min-height: 0; overflow: hidden; }
.jvhl-view, .jvhl .jvhl-ta {
  margin: 0; border: 0; box-sizing: border-box; padding: 14px;
  font: 13.5px/1.6 ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  letter-spacing: normal; tab-size: 2;
  white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;
  /* Cho DU CHO thanh cuon o CA HAI lop, ke ca khi chua co thanh cuon nao. Thieu dong nay la
     co mot loi rat kho doan: file dai toi muc hien thanh cuon doc thi be ngang cho chu trong
     textarea hut di khoang 15px, con lop mau ben duoi khong hut - tu dong dai dau tien tro di
     hai ben xuong dong khac nhau va chu mau troi han khoi chu that. */
  scrollbar-gutter: stable;
}
.jvhl-view { position: absolute; inset: 0; overflow: hidden; pointer-events: none;
  background: none; color: var(--text); }
.jvhl .jvhl-ta { position: absolute; inset: 0; width: 100%; height: 100%; resize: none;
  outline: none; overflow: auto; background: transparent; color: transparent;
  caret-color: var(--text); }
/* Boi den vung chon: giu nen, KHONG tra lai mau chu (chu that phai trong suot de khong
   in dam len chu da to mau ben duoi). */
.jvhl .jvhl-ta::selection { background: var(--accent-line); color: transparent; }
.jvhl-view .tok-c { color: var(--tok-c); font-style: italic; }
.jvhl-view .tok-s { color: var(--tok-s); }
.jvhl-view .tok-n { color: var(--tok-n); }
.jvhl-view .tok-k { color: var(--tok-k); font-weight: 600; }
.jvhl-view .tok-t { color: var(--tok-t); }
.jvhl-view .tok-a { color: var(--tok-a); }
/* Khung sua bung giua man hinh: .jvfe-body la flex doc, o sua phai gian ra nhu textarea cu. */
.jvfe-body > .jvhl { flex: 1; min-height: 52vh; height: auto; }

/* Wikilink [[..]] + duong dan file trong inline code: bam de mo/di chuyen toi note (chat-render.js) */
a.jv-wikilink { color: var(--accent); text-decoration: none; cursor: pointer;
  border-bottom: 1px dashed var(--accent-line); }
a.jv-wikilink:hover { border-bottom-style: solid; filter: brightness(1.12); }
a.jv-wikilink.jv-wl-busy { opacity: .55; cursor: progress; }
a.jv-wikilink.jv-wl-miss { color: var(--red); border-bottom-color: var(--red); }
a.jv-fcode { text-decoration: none; }
a.jv-fcode code { cursor: pointer; transition: color .12s; }
a.jv-fcode:hover code { color: var(--accent); text-decoration: underline; }

/* The artifact trong luong chat */
.jv-art { display: flex; align-items: center; gap: 10px; margin: 8px 0; padding: 10px 12px;
  max-width: 420px; border: 1px solid var(--border); border-radius: 10px; cursor: pointer;
  background: linear-gradient(180deg, var(--surface-1), rgba(255,255,255,0));
  transition: border-color .15s, background .15s; }
.jv-art:hover { border-color: var(--accent); background: var(--accent-wash); }
.jv-art:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.jv-art-ic { font-size: 20px; flex: none; }
.jv-art-meta { display: flex; flex-direction: column; min-width: 0; flex: 1; }
.jv-art-title { color: var(--text); font-size: 14px; font-weight: 600;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.jv-art-sub { color: var(--text3); font-size: 12px; }
.jv-art-open { color: var(--accent); font-size: 13px; font-weight: 600; flex: none; }

/* Panel artifact (drawer ben phai, chay ca o chat thuong lan chat phong to) */
.jv-artpanel { position: fixed; top: 0; right: 0; bottom: 0; width: min(52vw, 720px);
  z-index: 390; display: none; flex-direction: column; background: var(--bg2);
  border-left: 1px solid var(--border); box-shadow: -16px 0 50px var(--shadow-veil); }
.jv-artpanel.open { display: flex; animation: artIn .18s ease; }
@keyframes artIn { from { transform: translateX(24px); opacity: .4; } to { transform: translateX(0); opacity: 1; } }
.jv-ap-head { display: flex; align-items: center; gap: 10px; padding: 10px 12px;
  border-bottom: 1px solid var(--border); }
.jv-ap-title { font-weight: 600; font-size: 14px; color: var(--text); flex: none; max-width: 30%;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.jv-ap-tabs { display: flex; gap: 4px; flex: 1; }
.jv-ap-tab { background: var(--bg3); border: 1px solid var(--border); color: var(--text2);
  border-radius: 7px; padding: 4px 12px; font-size: 13px; cursor: pointer; }
.jv-ap-tab.active { color: var(--accent); border-color: var(--accent); }
.jv-artpanel.no-preview .jv-ap-tabs { display: none; }
.jv-ap-actions { display: flex; gap: 6px; flex: none; }
.jv-ap-btn { background: var(--bg3); border: 1px solid var(--border); color: var(--text2);
  width: 30px; height: 30px; border-radius: 7px; cursor: pointer; font-size: 14px; }
.jv-ap-btn:hover { color: var(--text-hi); border-color: var(--accent); }
.jv-ap-body { flex: 1; min-height: 0; overflow: auto; background: var(--bg); }
.jv-ap-frame { width: 100%; height: 100%; border: 0; background: #fff; display: block; }
.jv-ap-mermaid { min-height: 100%; display: flex; align-items: center; justify-content: center;
  padding: 16px; background: var(--bg); color: var(--text2); }
.jv-ap-mermaid svg { max-width: 100%; height: auto; }
.jv-ap-code { margin: 0; border: 0; border-radius: 0; min-height: 100%; box-sizing: border-box; }
.jv-ap-note { color: var(--text3); font-size: 13px; padding: 10px 12px; }
@media (max-width: 900px) { .jv-artpanel { width: 100vw; } }

/* ============================================================
   VAULT EXPLORER (cột trái) - cây thư mục kiểu Obsidian + tìm note
   ============================================================ */
.hud-left { padding: 12px 0 0; overflow: hidden; }
.vault-head { display: flex; align-items: center; justify-content: space-between; padding: 0 12px 8px; }
.vault-title { font-family: var(--font); font-size: 12px; letter-spacing: 2px; color: var(--text3); }
.vault-tools { display: flex; gap: 6px; }
.vault-search { display: flex; align-items: center; gap: 6px; margin: 0 12px 6px; background: var(--bg3);
  border: 1px solid var(--border); border-radius: 8px; padding: 6px 8px; }
.vault-search:focus-within { border-color: var(--accent); }
.vault-search .vs-ico { font-size: 12px; opacity: .55; }
.vault-search input { flex: 1; min-width: 0; background: none; border: none; outline: none; color: var(--text);
  font-size: 13px; font-family: inherit; }
.vault-search input::placeholder { color: var(--text3); }
.vs-clear { background: none; border: none; color: var(--text3); cursor: pointer; font-size: 12px; padding: 0 2px; }
.vs-clear:hover { color: var(--accent); }
.vault-modes { display: flex; gap: 6px; margin: 0 12px 8px; }
.vs-chip { font-size: 11px; padding: 3px 11px; border-radius: 20px; background: var(--bg3);
  border: 1px solid var(--border); color: var(--text3); cursor: pointer; }
.vs-chip.active { background: var(--accent-wash-2); border-color: var(--accent-line); color: var(--accent); }
.vault-tree, .vault-results { flex: 1; overflow-y: auto; padding: 2px 8px 14px; }
.vault-tree::-webkit-scrollbar, .vault-results::-webkit-scrollbar { width: 4px; }
.vault-tree::-webkit-scrollbar-thumb, .vault-results::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
.vt-info { color: var(--text3); font-size: 13px; padding: 8px 6px; }
.vt-node { display: flex; align-items: center; gap: 5px; padding: 4px 6px; border-radius: 6px; cursor: pointer;
  font-size: 13.5px; color: var(--text2); white-space: nowrap; overflow: hidden; }
.vt-node:hover { background: var(--info-wash); color: var(--text); }
.vt-node.active { background: var(--info-wash); box-shadow: inset 3px 0 0 var(--accent); color: var(--text); }
.vt-chev { flex: none; width: 13px; text-align: center; font-size: 10px; color: var(--text3); transition: transform .12s; }
.vt-chev.open { transform: rotate(90deg); }
.vt-chev.leaf { visibility: hidden; }
.vt-ico { flex: none; font-size: 13px; }
.vt-name { flex: 1; overflow: hidden; text-overflow: ellipsis; }
.vt-act { display: none; gap: 1px; flex: none; padding-left: 4px; }
.vt-node:hover .vt-act, .vt-node:focus-within .vt-act { display: flex; }
/* Máy cảm ứng không có hover: nút hiện SẴN, nếu không thì không đời nào bấm được Tải/Xoá. */
@media (hover: none) { .vt-act { display: flex; opacity: .75; } }
.vt-act button { background: none; border: none; color: var(--text3); cursor: pointer; font-size: 12px; padding: 0 3px; line-height: 1; }
.vt-act button:hover { color: var(--accent); }
.vt-hidden { display: none !important; }
.vr-item { padding: 7px 8px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 6px; }
.vr-item:hover { background: var(--info-wash); }
.vr-main { min-width: 0; flex: 1; }
.vr-name { font-size: 13px; color: var(--text); display: flex; align-items: center; gap: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.vr-snip { font-size: 12px; color: var(--text3); margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.vr-dl { flex: none; border: 1px solid var(--border); background: var(--surface-1); color: var(--text2); border-radius: 6px; padding: 3px 7px; cursor: pointer; }
.vr-dl:hover { color: var(--accent); border-color: var(--accent-line); }
.vr-empty { color: var(--text3); font-size: 13px; padding: 10px 6px; }

/* ============================================================
   NOTE EDITOR overlay - đè lên khoang não (.hud-center), giữ cây + chat sống
   ============================================================ */
.note-editor { position: absolute; inset: 0; z-index: 12; display: flex; flex-direction: column;
  background: var(--panel-solid); }
.note-editor[hidden] { display: none; }
.note-editor.ne-full { position: fixed; inset: 0; z-index: 1000; }
.ne-bar { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 9px 12px;
  border-bottom: 1px solid var(--border); background: var(--bg2); }
.ne-title { font-size: 14px; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  display: flex; align-items: center; gap: 7px; flex: 1; min-width: 0; }
/* Lùi / Tiến giữa các note. Hết chỗ để đi thì MỜ ĐI chứ không biến mất: nút ẩn hiện làm
   thanh tiêu đề nhảy, và người dùng không bao giờ học được là có nút đó. */
.ne-nav { display: flex; gap: 3px; flex: none; align-items: center; }
.ne-nav button { background: var(--surface-1); border: 1px solid var(--border); color: var(--text2);
  cursor: pointer; width: 28px; height: 26px; border-radius: 6px; padding: 0;
  display: flex; align-items: center; justify-content: center; }
.ne-nav button:hover:not(:disabled) { color: var(--accent); border-color: var(--accent-line); }
.ne-nav button:disabled { opacity: 0.35; cursor: default; }
.ne-actions { display: flex; gap: 5px; flex: none; align-items: center; }
/* Màn hẹp: tên file xuống hẳn một dòng riêng. Thanh nút có tới 8 nút, để chung một dòng thì tên
   file bị bóp còn 0px - mở file ra mà không biết đang mở file nào. */
@media (max-width: 700px) {
  .ne-bar { flex-wrap: wrap; padding: 8px 10px; }
  .ne-title { order: -1; flex: 1 0 100%; }
  .ne-actions { flex-wrap: wrap; justify-content: flex-end; margin-left: auto; }
}
.ne-actions button { background: var(--surface-1); border: 1px solid var(--border); color: var(--text2);
  cursor: pointer; font-size: 13px; padding: 4px 10px; border-radius: 6px; white-space: nowrap; }
.ne-actions button:hover { color: var(--text); border-color: var(--info-line); }
.ne-actions button.ne-saved { color: var(--green); border-color: var(--ok-line); }
.ne-seg { display: flex; }
.ne-seg button { border-radius: 0; border-right: none; }
.ne-seg button:first-child { border-radius: 6px 0 0 6px; }
.ne-seg button:last-child { border-radius: 0 6px 6px 0; border-right: 1px solid var(--border); }
.ne-seg button.active { background: var(--accent-wash-2); border-color: var(--accent-line); color: var(--accent); }
.ne-body { flex: 1; display: flex; min-height: 0; overflow: hidden; }
.ne-body.ne-md { flex-direction: column; }                    /* .md: thanh công cụ trên, khung soạn/xem dưới */
.ne-fmt { display: flex; flex-wrap: wrap; gap: 3px; padding: 6px 8px; border-bottom: 1px solid var(--border); background: var(--bg2); flex: none; }
.ne-fmt button { background: var(--surface-1); border: 1px solid var(--border); color: var(--text2); cursor: pointer;
  font-size: 13px; min-width: 28px; height: 26px; border-radius: 5px; padding: 0 6px; }
.ne-fmt button:hover { color: var(--text); border-color: var(--info-line); }
.ne-panes { flex: 1; display: flex; min-height: 0; overflow: hidden; }
.ne-wys { outline: none; border-left: none; }                  /* bản render sửa trực tiếp: full màn, không viền */
.ne-wys:focus { outline: none; }
.ne-body.ne-md.mode-wys .ne-src { display: none; }             /* chế độ Sửa: chỉ hiện bản render */
.ne-body.ne-md.mode-source .ne-wys { display: none; }          /* chế độ Nguồn: chỉ hiện markdown thô */
.ne-src, .ne-prev { flex: 1; min-width: 0; overflow: auto; }
.ne-src { background: var(--field-bg); }
.ne-src textarea { width: 100%; height: 100%; background: none; color: var(--text); border: none; outline: none;
  padding: 14px; font: 14px/1.6 var(--font); resize: none; }
.ne-prev { padding: 14px 20px; color: var(--text); background: var(--bg); border-left: 1px solid var(--border); line-height: 1.7; }
.ne-body.mode-source .ne-prev { display: none; }
.ne-body.mode-source .ne-src { border-right: none; }
.ne-body.mode-preview .ne-src { display: none; }
.ne-body.mode-preview .ne-prev { border-left: none; }
.ne-img { flex: 1; display: flex; align-items: center; justify-content: center; overflow: auto; padding: 16px; }
.ne-img img { max-width: 100%; max-height: 100%; border-radius: 8px; }
/* .pdf xem tại chỗ (nền trắng vì trình xem PDF của trình duyệt tự vẽ trên nền của nó) */
.ne-frame { flex: 1; width: 100%; min-height: 0; border: 0; background: #fff; }
.ne-dl { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px;
  color: var(--text2); padding: 24px; text-align: center; }
.ne-dl .ne-dl-ico { font-size: 46px; }
.ne-dl a { color: var(--text); }
/* Gợi ý "có lẽ là file này" khi link trỏ hụt - bấm một phát là mở đúng file */
.ne-hits { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; align-items: center; max-width: 620px; }
.ne-hits .dim { width: 100%; color: var(--text3); font-size: 13px; }
.ne-hits button { background: var(--surface-1); border: 1px solid var(--border); color: var(--text2);
  cursor: pointer; font-size: 13px; padding: 4px 10px; border-radius: 6px; }
.ne-hits button:hover { color: var(--text); border-color: var(--accent-line); }
/* markdown trong preview */
.ne-prev h1, .ne-prev h2, .ne-prev h3, .ne-prev h4 { color: var(--text); margin: .6em 0 .3em; line-height: 1.3; }
.ne-prev h1 { font-size: 1.5em; } .ne-prev h2 { font-size: 1.28em; } .ne-prev h3 { font-size: 1.12em; }
.ne-prev p, .ne-prev li { margin: .4em 0; }
.ne-prev ul, .ne-prev ol { padding-left: 1.4em; margin: .4em 0; }
.ne-prev a { color: var(--link-ink); }
/* Bản render là contenteditable nên con trỏ mặc định là con trỏ chữ - nhìn vào không ai đoán
   được link bấm được. Mà bấm thì ĐI THẬT (chat-render.js xử lý trước hàng rào contenteditable),
   nên con trỏ phải nói đúng điều đó. Ảnh thì không: ảnh vẫn để kéo thả và xoá như một ký tự. */
.ne-prev a:not(:has(img)), .jvfe-prev a:not(:has(img)) { cursor: pointer; }
.ne-prev a:not(:has(img)):hover, .jvfe-prev a:not(:has(img)):hover { text-decoration: underline; }
.ne-prev code { background: var(--surface-3); padding: 1px 5px; border-radius: 4px; font-family: var(--font); font-size: .92em; }
.ne-prev pre { background: var(--field-bg); border: 1px solid var(--border); border-radius: 8px; padding: 12px; overflow: auto; margin: .5em 0; }
.ne-prev pre code { background: none; padding: 0; }
.ne-prev blockquote { border-left: 3px solid var(--border); margin: .5em 0; padding: .2em 0 .2em 12px; color: var(--text2); }
.ne-prev img { max-width: 100%; border-radius: 6px; }
.ne-prev hr { border: none; border-top: 1px solid var(--border); margin: 1em 0; }
.ne-prev table { border-collapse: collapse; margin: .5em 0; }
.ne-prev th, .ne-prev td { border: 1px solid var(--border); padding: 5px 9px; }

/* Khoi hoi-lai co lua chon (chat-ask.js) */
.jv-ask { margin-top: 10px; padding-top: 9px; border-top: 1px solid var(--border); }
.jv-ask-q { font-size: 13px; color: var(--text2); margin-bottom: 7px; }
.jv-ask-tag {
  display: inline-block; margin-right: 6px; padding: 1px 6px; border-radius: 5px;
  background: var(--bg3); border: 1px solid var(--border);
  color: var(--text3); font-size: 11px; text-transform: uppercase; letter-spacing: .4px;
}
.jv-ask-row { display: flex; flex-wrap: wrap; gap: 6px; }
.jv-ask-chip {
  background: var(--bg3); border: 1px solid var(--border); color: var(--text);
  border-radius: 999px; padding: 5px 12px; font-family: var(--font); font-size: 13px;
  cursor: pointer; transition: border-color .15s, color .15s, background .15s;
}
.jv-ask-chip:hover { border-color: var(--accent); color: var(--accent); }
.jv-ask-other { color: var(--text3); border-style: dashed; }

/* Da tra loi: cung lai, chi con doc duoc */
.jv-ask-done .jv-ask-chip { cursor: default; opacity: .45; }
.jv-ask-done .jv-ask-chip:hover { border-color: var(--border); color: var(--text); }
.jv-ask-done .jv-ask-other { display: none; }
.jv-ask-done .jv-ask-chip.jv-ask-picked {
  opacity: 1; border-color: var(--accent); color: var(--accent); background: var(--accent-wash-2);
}
.jv-ask-done .jv-ask-chip.jv-ask-picked::before {
  content: ""; display: inline-block; width: 1em; height: 1em; margin-right: .2em;
  vertical-align: -0.14em; background-color: currentColor;
  -webkit-mask: var(--ic-check) center/contain no-repeat;
  mask: var(--ic-check) center/contain no-repeat;
}

/* Menu lệnh / (chat-slash.js) */
.slash-menu {
  position: fixed;
  z-index: 999;
  max-height: 280px;
  overflow-y: auto;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: var(--shadow-2);
  padding: 4px;
}
.slash-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-areas: "cmd name" "cmd desc";
  gap: 0 10px;
  padding: 6px 10px;
  border-radius: 7px;
  cursor: pointer;
}
.slash-item.active, .slash-item:hover { background: var(--bg3); }
.slash-cmd { grid-area: cmd; align-self: center; font-weight: 600; color: var(--accent); white-space: nowrap; }
/* name + desc: mỗi cái CẮT 1 DÒNG, tràn thì "..." (min-width:0 để ellipsis chạy trong grid) */
.slash-name { grid-area: name; font-size: 13px; color: var(--text); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.slash-desc { grid-area: desc; font-size: 11px; color: var(--text3); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* ==========================================================================
   ICON (Lucide) - dashboard/icons.js dựng thẻ <svg class="ic">
   --------------------------------------------------------------------------
   Icon vẽ bằng nét, màu là currentColor nên TỰ ĂN THEO màu chữ của chỗ nó
   đứng và tự đổi khi chuyển tông SÁNG/TỐI. Đây là lý do chính bỏ emoji: emoji
   cứng màu, ở tông sáng nó chọc vào mắt và mỗi máy vẽ một kiểu.

   Cỡ mặc định là 1em - icon lớn nhỏ theo cỡ chữ của khối chứa nó, không phải
   con số cứng. Nhờ vậy icon trong nút 11px và icon trong tiêu đề 18px đều cân.
   ========================================================================== */
.ic {
  display: inline-block;
  width: 1em;
  height: 1em;
  /* Nhấc lên khỏi đường chân chữ: SVG mặc định ngồi trên baseline nên trông
     như bị tụt so với chữ bên cạnh. -0.14em đưa tâm icon về ngang tâm chữ. */
  vertical-align: -0.14em;
  flex: none;              /* trong flex container thì không cho co méo */
  stroke-width: 2;
  overflow: visible;       /* nét ở sát rìa viewBox không bị cắt cụt */
}

/* Nét mảnh dần khi icon to lên: nét 2 ở cỡ 16px là vừa, ở cỡ 32px thì thô. */
.ic-lg { width: 1.35em; height: 1.35em; stroke-width: 1.75; }
.ic-xl { width: 2em; height: 2em; stroke-width: 1.5; }
.ic-sm { width: .85em; height: .85em; stroke-width: 2.25; }

/* Tô đặc: dùng cho đèn trạng thái (thay ● đặc so với ○ rỗng). */
.ic-fill { fill: currentColor; }

/* Màu theo trạng thái. Dùng biến "mực" nên tông sáng tự có bản đậm hơn. */
.ic-ok   { color: var(--green); }
.ic-warn { color: var(--warn-ink); }
.ic-err  { color: var(--red); }
.ic-dim  { color: var(--text3); }
.ic-accent { color: var(--accent-ink); }

/* Icon đang chờ thì quay. prefers-reduced-motion thì đứng im. */
.ic-spin { animation: ic-spin 1.1s linear infinite; }
@keyframes ic-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .ic-spin { animation: none; } }

/* Nút chỉ có icon, không có chữ: canh giữa tuyệt đối. */
.ic-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* --------------------------------------------------------------------------
   Icon trong ngữ cảnh CHỈ CSS với tới được (content của ::before/::after).
   Thẻ SVG không nhét vào content: được, nên vẽ bằng MẶT NẠ: một ô vuông tô
   currentColor rồi khoét theo hình icon. Nhờ vậy vẫn ăn màu chữ và vẫn tự đổi
   theo tông SÁNG/TỐI - đúng như icon thường, việc emoji không làm được.

   Biến --ic-<tên> do vendor/lucide-icons.css sinh ra; muốn thêm icon dùng được
   ở đây thì thêm tên vào "css_vars" trong dashboard/icons.manifest.json.
   -------------------------------------------------------------------------- */

/* ===== Trang Chatbot: lưới thẻ bot chuyên trách ===== */
/* Dựng theo hướng NHIỀU BOT ngay từ đầu dù lần đầu chỉ chạy một con - thêm con thứ hai
   không phải sửa lại giao diện. */
.cb-bar { display: flex; gap: 8px; align-items: center; margin-bottom: 10px; }
.cb-search { flex: 1 1 auto; min-width: 0; padding: 8px 11px; border-radius: 9px;
  border: 1px solid var(--border); background: var(--field-bg); color: var(--text);
  font-size: 14px; outline: none; }
.cb-search:focus { border-color: var(--info-line); }
.cb-intro { color: var(--text3); font-size: 14px; line-height: 1.6; max-width: 720px; margin: 0 0 16px; }
.cb-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 12px; }
.cb-card { border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px;
  background: var(--bg2); display: flex; flex-direction: column; gap: 8px; }
.cb-head { display: flex; align-items: center; gap: 8px; }
.cb-ico { display: inline-flex; color: var(--accent); position: relative; }

/* ---- Dấu hiệu KÊNH (Telegram / Zalo) --------------------------------------------------
   Hai con bot khác nền tảng nằm cạnh nhau trong cùng một lưới thẻ mà chỉ khác nhau ở một
   chữ nhỏ thì người ta sẽ bấm nhầm - và bấm nhầm ở đây nghĩa là sửa nhầm con bot đang nói
   chuyện với khách. Nên kênh được nói ba lần, mỗi lần cho một khoảng cách nhìn khác nhau:
   huy hiệu trên icon (liếc qua), chip trong phần thông tin (đọc lướt), và hàng nút lọc ở
   đầu trang (khi có nhiều bot). Màu thương hiệu giữ nguyên ở cả nền sáng lẫn nền tối. */
.kenh-logo { display: inline-block; vertical-align: -0.15em; flex: none; }
/* Huy hiệu nhỏ nằm đè góc icon bot. Viền cùng màu nền thẻ để nó tách khỏi icon bên dưới. */
.cb-ico-kenh { position: absolute; right: -5px; bottom: -5px; display: inline-flex;
  border-radius: 50%; background: var(--bg2); box-shadow: 0 0 0 2px var(--bg2); }
.cb-kenh-chip { display: inline-flex; align-items: center; gap: 4px; }

/* Hàng lọc theo kênh. Chỉ hiện khi thật sự có từ hai kênh trở lên (xem chatbots.js: người
   mới chỉ có bot Telegram mà đã phải nhìn nút lọc thì đó là trả lời một câu chưa ai hỏi). */
.cb-loc { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
.cb-loc-o { display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
  padding: 5px 11px; border-radius: 999px; font-size: 13px;
  border: 1px solid var(--border); background: var(--bg2); color: var(--text2); }
.cb-loc-o:hover { border-color: var(--info-line); }
.cb-loc-o.on { background: var(--surface-3); color: var(--text); border-color: var(--info-line); }
.cb-loc-n { font-size: 11.5px; color: var(--text3); }

/* Bộ chọn kênh trong form. Thẻ bấm to chứ không phải <select>: đây là quyết định ĐẦU TIÊN
   và nó đổi cả phần còn lại của form (token lấy ở đâu, có nhóm không), nên nó phải nhìn ra
   được là một ngã rẽ chứ không phải một tuỳ chọn nhỏ. */
.cb-kenh { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 4px; }
.cb-kenh-o { display: flex; flex-direction: column; align-items: flex-start; gap: 3px;
  cursor: pointer; text-align: left; padding: 11px 12px; border-radius: 10px;
  border: 1px solid var(--border); background: var(--bg2); color: var(--text); }
.cb-kenh-o:hover { border-color: var(--info-line); }
.cb-kenh-o.on { border-color: var(--accent); background: var(--surface-3);
  box-shadow: inset 0 0 0 1px var(--accent); }
.cb-kenh-o b { font-size: 14px; }
.cb-kenh-o small { font-size: 12px; color: var(--text3); line-height: 1.45; }
.cb-kenh-logo { display: inline-flex; margin-bottom: 2px; }
.cb-kenh-khoa { display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  padding: 9px 12px; border-radius: 10px; margin-top: 4px;
  border: 1px solid var(--border); background: var(--surface-3); color: var(--text); }
.cb-kenh-khoa span { font-size: 12.5px; color: var(--text3); }
.cb-khong-nhom { border-left: 2px solid var(--info-line); padding-left: 9px; }

/* Hàng chờ ghép nối của kênh Zalo. Zalo không có công cụ kiểu @userinfobot để user tự tra id
   của mình, và id là chuỗi hex không ai đọc nổi - nên đảo chiều: người lạ nhắn cho bot thì họ
   hiện ra ở đây kèm tên thật, chủ bấm một nút là xong. */
.zl-cho { border: 1px solid var(--border); border-radius: 10px; padding: 9px 11px;
  margin-top: 8px; background: var(--surface-3); font-size: 13px; }
.zl-cho .js-actions { margin-top: 7px; }
.cb-name { font-weight: 600; color: var(--text); flex: 1 1 auto; overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap; }
/* Đèn trạng thái: bốn màu cho bốn trạng thái thật. Bot chết âm thầm là thứ chủ chỉ phát
   hiện khi khách phàn nàn, nên "lỗi" phải nhìn thấy được chứ không phải sự vắng mặt. */
.cb-dot { width: 9px; height: 9px; border-radius: 50%; flex: none; }
.cb-dot.ok { background: var(--green); }
.cb-dot.wait { background: var(--warn-ink); }
.cb-dot.err { background: var(--red); }
.cb-dot.off { background: var(--text3); opacity: .5; }
.cb-state { font-size: 12px; color: var(--text3); flex: none; }
.cb-meta { display: flex; flex-wrap: wrap; gap: 10px; font-size: 12.5px; color: var(--text3); }
.cb-meta span { display: inline-flex; align-items: center; gap: 4px; }
.cb-warn { color: var(--warn-ink); }
.cb-err { font-size: 12.5px; color: var(--red); line-height: 1.5;
  background: var(--surface-3); border-radius: 7px; padding: 6px 8px; }
/* Mức quyền trên thẻ - hiện ở CẢ BA mức, kể cả mức chỉ đọc. Bản trước bỏ trống ô này cho mức
   mặc định, và "không có nhãn" đọc ra được hai nghĩa ngược nhau: bot đang chỉ đọc, hay trang
   này không nói? Ba màu để phân biệt được từ xa giữa một lưới thẻ giống hệt nhau. */
.cb-quyen { display: flex; align-items: flex-start; gap: 6px; font-size: 12.5px;
  line-height: 1.5; border-radius: 7px; padding: 6px 8px; }
.cb-quyen.doc { color: var(--text3); background: var(--surface-3);
  border: 1px solid var(--border); }
.cb-quyen.ghi { color: var(--warn-ink); background: var(--warn-wash);
  border: 1px solid var(--warn-line); }
.cb-quyen.full { color: var(--red); background: var(--danger-wash);
  border: 1px solid var(--danger-line); }
/* Nhóm đang chờ chủ cho phép. Cố ý nổi bằng màu thông tin chứ không phải màu lỗi: không có gì
   hỏng cả, chỉ là có một quyết định đang chờ đúng một cú bấm. */
.cb-nhomcho { border: 1px solid var(--info-line); background: var(--info-wash);
  border-radius: 8px; padding: 8px 10px; display: flex; flex-direction: column; gap: 5px; }
.cb-nhomcho-t { display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  font-size: 13px; color: var(--text); }
.cb-nhomcho-id { font-family: var(--mono, monospace); font-size: 11.5px; color: var(--text3); }
.cb-nhomcho-d { font-size: 12.5px; line-height: 1.5; color: var(--text3); }
.cb-nhomcho-a { display: flex; gap: 6px; flex-wrap: wrap; }
.cb-acts { display: flex; gap: 6px; margin-top: 2px; }
.cb-empty { grid-column: 1 / -1; text-align: center; color: var(--text3); padding: 40px 16px;
  font-size: 14px; line-height: 1.7; }
.cb-empty b { color: var(--text); display: block; margin: 8px 0 4px; font-size: 15px; }
.cb-empty-ico { color: var(--text3); opacity: .6; }

/* Form tạo/sửa bot */
.cb-modal { position: fixed; inset: 0; z-index: 3200; display: flex; align-items: center;
  justify-content: center; background: rgba(0, 0, 0, .55); padding: 24px; }
.cb-form { width: min(560px, 94vw); max-height: 88vh; overflow-y: auto; padding: 18px 20px;
  background: var(--bg2); border: 1px solid var(--border); border-radius: 14px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, .6); }
.cb-form h3 { margin: 0 0 14px; color: var(--text); }
.cb-form label { display: block; margin: 12px 0 4px; font-size: 13px; color: var(--text2); font-weight: 600; }
.cb-form input, .cb-form select, .cb-form textarea { width: 100%; box-sizing: border-box;
  padding: 8px 10px; border-radius: 8px; border: 1px solid var(--border);
  background: var(--field-bg); color: var(--text); font-size: 14px; font-family: inherit; outline: none; }
.cb-form input:focus, .cb-form select:focus, .cb-form textarea:focus { border-color: var(--info-line); }
.cb-row { display: flex; gap: 6px; align-items: center; }
.cb-row > :first-child { flex: 1 1 auto; min-width: 0; }
.cb-row > button { flex: 0 0 auto; white-space: nowrap; }
/* Tên Agent + vai trò dài làm <select> nở rộng ra khỏi form. min-width:0 ở trên mới cho phép
   co lại (mặc định flex item không co dưới nội dung), còn hai dòng này cắt phần thừa thành "…"
   thay vì đẩy ngang. Bản thân <option> thì trình duyệt không cho tạo kiểu, nên chuỗi cũng đã
   được cắt sẵn ở JS - đây là lớp thứ hai cho tên brain dài. */
.cb-form select { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cb-hint { font-size: 12.5px; color: var(--text3); line-height: 1.55; margin-top: 5px; }
/* Cảnh báo rủi ro của mức quyền. Cố ý KHÔNG dùng .cb-hint (chữ xám nhạt, mắt lướt qua): đây là
   thứ duy nhất trong form mà đọc sót là mất tiền thật, nên nó phải chặn mắt lại. Ô đồng ý nằm
   trong chính khối này, không tách ra - tick vào một ô đặt cách xa danh sách rủi ro thì cái
   tick ấy không còn nghĩa gì. */
.cb-canhbao { margin-top: 8px; border-radius: 9px; padding: 10px 12px; font-size: 12.5px;
  line-height: 1.6; }
.cb-canhbao.ghi { color: var(--warn-ink); background: var(--warn-wash);
  border: 1px solid var(--warn-line); }
.cb-canhbao.full { color: var(--red); background: var(--danger-wash);
  border: 1px solid var(--danger-line); }
.cb-canhbao-h { display: flex; align-items: center; gap: 6px; font-weight: 600; }
.cb-canhbao ul { margin: 7px 0 0; padding-left: 18px; }
.cb-canhbao li { margin: 3px 0; }
.cb-ack { display: flex; align-items: flex-start; gap: 7px; margin-top: 10px; font-weight: 600;
  cursor: pointer; }
.cb-ack input { width: auto; flex: none; margin-top: 2px; }
.cb-form-acts { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; }

/* ---- Nhật ký bot: hai tab "Bot bí" / "Hội thoại gần đây" ---- */
.cb-log-form { width: min(760px, 96vw); }
.cb-tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--line); margin-bottom: 12px; }
.cb-tab { background: none; border: 0; border-bottom: 2px solid transparent; cursor: pointer;
          padding: 8px 12px; font-size: 13.5px; color: var(--text3); font-weight: 600; }
.cb-tab.on { color: var(--text); border-bottom-color: var(--info-line); }
.cb-log-body { min-height: 120px; max-height: 58vh; overflow-y: auto; }
.cb-sum { font-size: 12.5px; color: var(--text3); line-height: 1.55; margin-bottom: 10px; }
.cb-tbl { width: 100%; border-collapse: collapse; font-size: 13px; }
.cb-tbl th { text-align: left; font-size: 12px; color: var(--text3); font-weight: 600;
             padding: 6px 8px; border-bottom: 1px solid var(--line); }
.cb-tbl td { padding: 7px 8px; border-bottom: 1px solid var(--line); color: var(--text2);
             vertical-align: top; }
.cb-tbl .cb-num { text-align: right; width: 64px; color: var(--text); font-weight: 600; }
.cb-turn { border-left: 2px solid var(--line); padding: 6px 0 10px 10px; margin-bottom: 10px; }
.cb-turn.bi { border-left-color: var(--warn-ink); }
.cb-turn.loi { border-left-color: var(--red); }
.cb-turn-h { font-size: 11.5px; color: var(--text3); margin-bottom: 4px; }
.cb-q { font-size: 13.5px; color: var(--text); font-weight: 600; line-height: 1.5; }
.cb-a { font-size: 13px; color: var(--text2); line-height: 1.55; margin-top: 3px;
        white-space: pre-wrap; }
.cb-src { font-size: 11.5px; color: var(--text3); margin-top: 5px;
          display: inline-flex; align-items: center; gap: 4px; }
`,Fr=`/* ============================================
   JAVIS OS - Console layer (sidebar + pages)
   Tông màu kế thừa style.css (:root). Glassmorphism + glow.
   Cockpit (.hud) giữ nguyên; layer này bọc thêm bên ngoài.
   ============================================ */
:root {
  --rail-w: 160px;
  --rail-w-collapsed: 60px;
  --font-ui: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  --rail-bg: rgba(14, 14, 22, 0.72);
  --glass: rgba(22, 22, 31, 0.55);
  --glass-brd: var(--hairline);
  --glow: 0 0 0 1px var(--glass-brd), var(--shadow-2);
  --rail-anim: 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  --topbar-h: 52px;          /* chiều cao header .hud-top - cview chừa ra để header hiện mọi trang */
}
/* Tông sáng: mặt kính đổi từ "tối mờ chồng lên nền đen" thành "trắng mờ chồng lên
   giấy ngà". Vẫn giữ backdrop-filter nên vẫn có chiều sâu, chỉ đổi chất liệu. */
:root[data-theme="light"] {
  --rail-bg: rgba(255, 255, 255, 0.82);
  --glass: rgba(255, 255, 255, 0.72);
}

/* Header (.hud-top) thành thanh top TOÀN CỤC: luôn nằm trên cùng, cview quản lý bắt đầu dưới nó.
   .hud render sẵn phía sau → header (row 52px đầu) lộ ra; z-index để chắc chắn nổi trên cview. */
.hud-top { position: relative; z-index: 45; }
/* Nút điều khiển trợ lý (cài đặt, giọng nói, làm mới) chỉ thuộc cockpit Javis → ẩn khi đang ở trang quản lý */
body.in-console .hud-actions { display: none; }

/* ===== Rail (sidebar dọc, kính mờ) ===== */
.rail {
  position: fixed; top: 0; left: 0; bottom: 0; z-index: 60;
  width: var(--rail-w);
  display: flex; flex-direction: column; align-items: stretch;
  padding: 10px 8px; gap: 0;
  background: var(--rail-bg);
  backdrop-filter: blur(18px) saturate(1.2);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
  border-right: 1px solid var(--glass-brd);
}
.rail-top { flex: 0 0 auto; }                         /* đỉnh cố định */
.rail-nav {                                           /* giữa: cuộn dọc */
  flex: 1 1 auto; min-height: 0; overflow-y: auto; overflow-x: hidden;
  display: flex; flex-direction: column; gap: 4px; padding: 6px 0;
}
.rail-nav::-webkit-scrollbar { width: 0; }            /* ẩn thanh cuộn cho gọn */
.rail-nav { scrollbar-width: none; }
/* Rail 2 tầng: tầng 1 = nhãn nhóm bấm gập/mở; tầng 2 = mục con xổ ra dưới. Nhóm .foot ghim đáy. */
.rail-group { display: flex; flex-direction: column; }
.rail-group.foot { margin-top: auto; }                /* đẩy Hệ thống xuống đáy rail */
.rail-grp-lbl {                                        /* tầng 1: nút nhãn nhóm, bấm để gập/mở */
  display: flex; align-items: center; width: 100%;
  background: transparent; border: 0; cursor: pointer;
  font-family: var(--font-ui); font-size: 12.5px; font-weight: 600; letter-spacing: 0.2px;
  color: var(--text2); text-align: left; white-space: nowrap;
  padding: 8px 8px 8px 5px; border-radius: 9px; user-select: none;
  transition: color var(--rail-anim), background var(--rail-anim);
}
.rail-grp-lbl::before {                                /* mũi tên ▸, xoay xuống ▾ khi mở */
  content: ""; flex: 0 0 auto; margin-right: 6px;
  width: 0; height: 0; border-left: 4px solid currentColor;
  border-top: 4px solid transparent; border-bottom: 4px solid transparent;
  opacity: 0.55; transition: transform var(--rail-anim);
}
.rail-grp-ico { flex: 0 0 auto; display: flex; align-items: center; margin-right: 9px; opacity: 0.8; }
.rail-grp-ico svg { width: 17px; height: 17px; }
.rail-group.open > .rail-grp-lbl::before { transform: rotate(90deg); }
.rail-grp-lbl:hover { color: var(--text); background: var(--surface-2); }
.rail-group.has-active:not(.open) > .rail-grp-lbl { color: var(--accent); }   /* nhóm gập nhưng đang chứa trang hiện tại → hé màu cam */
.rail-group.foot .rail-grp-lbl { border-top: 1px solid var(--glass-brd); border-radius: 0; margin-top: 6px; padding-top: 12px; }
/* tầng 2: khối mục con, trượt mở/đóng bằng max-height */
.rail-grp-items {
  display: flex; flex-direction: column; gap: 2px;
  max-height: 0; overflow: hidden; opacity: 0;
  transition: max-height var(--rail-anim), opacity var(--rail-anim);
}
.rail-group.open > .rail-grp-items { max-height: 340px; opacity: 1; padding: 2px 0 4px; }
.rail-brand {
  height: 42px; display: flex; align-items: center; justify-content: center;
  color: var(--accent); font-size: 22px;
  filter: drop-shadow(0 0 8px rgba(255, 107, 43, 0.55));
}
.rail-item {
  position: relative; background: transparent; border: 0; cursor: pointer;
  color: var(--text3); border-radius: 9px; padding: 7px 8px 7px 16px;
  display: flex; flex-direction: row; align-items: center; gap: 10px;
  transition: color var(--rail-anim), background var(--rail-anim);
}
.rail-item .rail-ico { flex: 0 0 auto; line-height: 0; display: flex; align-items: center; justify-content: center; }
.rail-item .rail-ico svg { width: 19px; height: 19px; }
.rail-item .rail-lbl {
  font-family: var(--font-ui); font-size: 13.5px; letter-spacing: 0.1px; opacity: 0.95;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.rail-item:hover { color: var(--text); background: var(--surface-2); }
.rail-item.active { color: var(--accent); background: var(--accent-wash-2); }
.rail-item.active::before {
  content: ""; position: absolute; left: -8px; top: 18%; bottom: 18%;
  width: 3px; border-radius: 0 3px 3px 0; background: var(--accent);
  box-shadow: 0 0 10px var(--accent);
}
/* Select Brain - dời lên navbar (header trái), dùng dropdown sẵn có (.orb-graph-ctl) */
.hud-top .navbar-brain { position: static; z-index: auto; gap: 8px; }
.hud-top .navbar-brain .graph-select { max-width: 200px; }
/* Icon bộ não đứng trước dropdown chọn brain - đi theo khối .navbar-brain kể cả
   khi mobile-chat.js dời cả khối vào rail, nên không cần rule riêng cho mobile. */
.navbar-brain .brain-select-ico { color: var(--accent); font-size: 17px; }
@media (max-width: 860px) {
  .hud-top .navbar-brain .graph-stats { display: none; }   /* mobile: ẩn stats cho gọn */
}

/* Form trong card (Channels / Account / provider key) */
.js-lbl { display: block; font-size: 13px; color: var(--text2); margin: 12px 0 5px; font-family: var(--font); }
.js-lbl .dim { color: var(--green); }
.js-input {
  width: 100%; background: var(--sunken); border: 1px solid var(--glass-brd);
  color: var(--text); border-radius: 9px; padding: 9px 11px; font-size: 15px; margin-bottom: 4px;
}
.js-input:focus { outline: none; border-color: var(--accent); }
.js-row { display: flex; align-items: center; justify-content: space-between; padding: 6px 0; font-size: 15px; }
.js-actions { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
/* Nút phụ (Ngắt / Kiểm tra lại / Qua trình duyệt...). Dùng class này thay vì gõ
   style="background:transparent" ngay trên thẻ: style inline thắng cả rule :hover,
   nên nền giữ nguyên trong suốt còn chữ đổi sang var(--on-accent) - chữ tàng hình ở
   cả tông tối lẫn tông sáng. */
.gcard-btn.ghost { background: transparent; border-color: var(--glass-brd); color: var(--text2); }
.gcard-btn.ghost:hover { background: var(--surface-2); color: var(--text); border-color: var(--text2); }
.gcard-btn { width: auto; padding: 9px 16px; }
.gcard .gcard-btn { width: 100%; }   /* nút trong card model vẫn full-width */
.js-actions .gcard-btn { width: auto; }

/* Providers - card OAuth (đăng nhập/kết nối) */
.prov-list { display: flex; flex-direction: column; gap: 10px; max-width: 760px; }
.prov-card {
  background: var(--glass); border: 1px solid var(--glass-brd); border-radius: 14px;
  padding: 14px 16px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  transition: border-color 0.18s;
}
.prov-card.main { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent-line); }
.prov-head { display: flex; align-items: center; gap: 12px; }
.prov-shield { color: var(--text3); flex: 0 0 auto; display: flex; }
.prov-shield svg { width: 22px; height: 22px; }
.prov-shield.on { color: var(--green); filter: drop-shadow(0 0 6px rgba(34,197,94,0.45)); }
.prov-info { flex: 1; min-width: 0; }
.prov-name { font-family: var(--font); font-weight: 700; font-size: 16px; }
.prov-kind { font-size: 11px; padding: 2px 6px; border-radius: 5px; background: var(--accent2-wash-2); color: var(--accent2-ink); text-transform: uppercase; letter-spacing: 0.5px; margin-left: 6px; vertical-align: middle; }
.prov-status { font-family: var(--font); font-size: 13px; color: var(--text3); margin-top: 3px; }
.prov-status.on { color: var(--green); }
.prov-badge { font-family: var(--font); font-size: 11px; letter-spacing: 1px; color: var(--accent); border: 1px solid var(--accent); border-radius: 5px; padding: 2px 6px; }
.prov-action { display: flex; gap: 8px; margin-top: 12px; }
.prov-action .js-input { margin-bottom: 0; flex: 1; }
.prov-action .gcard-btn { width: auto; flex: 0 0 auto; }
.prov-note { font-size: 13px; color: var(--text3); margin-top: 8px; opacity: 0.7; }
/* Cảnh báo trên thẻ provider (vd Google đã ngắt Gemini CLI với tài khoản cá nhân). Bỏ luôn
   opacity 0.7 của .prov-note: đây là thứ người dùng PHẢI đọc, làm mờ đi là phản tác dụng. */
.prov-note.warn { color: var(--yellow); opacity: 1; }
.prov-note.warn code { background: var(--bg3); padding: 1px 5px; border-radius: 5px; font-size: 12.5px; }
/* Ba bước cài + đăng nhập Gemini CLI. Có <code> nên cần dễ đọc hơn .prov-note một chút. */
.prov-steps { font-size: 13px; color: var(--text2); margin-top: 8px; line-height: 1.75; }
.prov-steps code { background: var(--bg3); padding: 1px 6px; border-radius: 5px;
  font-size: 12.5px; word-break: break-all; }
/* Hàng dán mã đăng nhập Google (#gcliLogin). Cần luật riêng vì khối này nằm NGOÀI
   .prov-action, nên không hưởng hai dòng width:auto/flex ở trên - mà luật gốc .gcard-btn cuối
   file đặt \`width:100%\` + \`margin-top:14px\`. Kết quả trước khi có rule này: nút "Xong" giãn ra
   nuốt cả hàng flex, ô nhập mã teo còn vài chục pixel và người dùng KHÔNG gõ nổi mã vào.
   - min-width:0 để ô nhập co được thật (input có kích thước nội tại chặn co lại trong flex).
   - flex-wrap + basis 180px: màn hẹp thì nút rơi xuống dòng dưới thay vì bóp ô nhập. */
.gcli-code-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px;
  max-width: 520px; margin-top: 6px; }
.gcli-code-row .js-input { flex: 1 1 180px; min-width: 0; margin-bottom: 0; }
.gcli-code-row .gcard-btn { flex: 0 0 auto; width: auto; margin-top: 0; }

/* Nguồn xác thực của gói Claude Code (subscription / API key) */
.prov-auth { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--glass-brd); }
.prov-auth-title { font-family: var(--font); font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: var(--text3); margin-bottom: 8px; }
/* Một dòng nói TRƯỚC cái mà hai lựa chọn bên dưới KHÔNG đổi. Thiếu nó thì người đọc thấy
   "API key Anthropic" ở đây và thẻ "Anthropic (API)" bên dưới, tưởng trùng nhau rồi hỏi làm
   thêm nút này chi (chủ repo hỏi đúng câu đó 2026-08-13). */
.prov-auth-note { font-size: 12.5px; line-height: 1.6; color: var(--text2); margin-bottom: 10px; }
.prov-auth-opt { display: flex; gap: 8px; align-items: flex-start; font-size: 13px; color: var(--text2); line-height: 1.5; margin-bottom: 6px; cursor: pointer; }
.prov-auth-opt input { margin-top: 3px; flex: 0 0 auto; }
.prov-auth-opt b { color: var(--text); font-weight: 600; }
.prov-auth-opt i { color: var(--text3); }
.prov-auth-warn { font-size: 13px; line-height: 1.55; color: var(--warn-ink); background: var(--warn-wash); border: 1px solid var(--warn-line); border-radius: 8px; padding: 8px 10px; margin-top: 8px; }

/* Auxiliary model chips */
.aux-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.aux-chip {
  background: var(--surface-2); border: 1px solid var(--glass-brd); color: var(--text2);
  border-radius: 9px; padding: 8px 14px; font-family: var(--font); font-size: 14px; cursor: pointer; transition: all 0.15s;
}
.aux-chip:hover { color: var(--text); border-color: var(--text2); }
.aux-chip.sel { background: var(--accent-wash-2); border-color: var(--accent); color: var(--accent); }

/* Model việc nền: chỉ hiện LỰA CHỌN HIỆN TẠI + nút mở picker. Phơi hết model thành chip thì
   tràn trang (riêng OpenRouter đã vài trăm dòng) và không có đường tìm kiếm. */
.aux-card { max-width: 660px; }
/* Card này KHÔNG nhấc lên khi rê chuột: nó là bảng cài đặt đứng yên, không phải thẻ bấm được.
   Để nguyên hiệu ứng của .gcard thì rê ngang là cả khối nhún nhảy, trông lỏng lẻo.
   Phải viết .gcard.aux-card: chỉ .aux-card:hover thì NGANG ĐIỂM với .gcard:hover, mà rule kia
   nằm sau trong file nên nó thắng - đúng lỗi đo được trong trình duyệt. */
.gcard.aux-card:hover { transform: none; border-color: var(--glass-brd); }
.aux-now {
  display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
  margin-top: 12px; padding: 12px 14px;
  background: var(--surface-1); border: 1px solid var(--glass-brd); border-radius: 10px;
}
.aux-now-txt { min-width: 0; }
.aux-now-model { font-family: var(--font); font-size: 16px; color: var(--accent);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.aux-now-prov { font-size: 13px; color: var(--text3); margin-top: 3px; }
.aux-now-act { display: flex; gap: 8px; flex-shrink: 0; }
.aux-card .aux-now-act .gcard-btn { width: auto; }   /* thắng luật full-width của .gcard .gcard-btn */
.aux-warn { color: var(--yellow); }
/* Ghi chú phụ: chữ nhỏ, mờ, một dòng ý - phần dài dòng đã cắt bớt ở console.js. */
.aux-note { margin-top: 10px; font-size: 12.5px; line-height: 1.5; color: var(--text3); }
.aux-note.warn { color: var(--yellow); }

/* Thanh phân đoạn chọn độ sâu suy nghĩ. Sáu nấc mà để rời thành chip thì hàng nút trôi lung
   tung; gộp vào một thanh liền thì nhìn ra ngay đây là MỘT thang từ nhẹ tới nặng. */
.seg { display: flex; flex-wrap: wrap; gap: 2px; margin-top: 12px; padding: 3px;
  background: var(--surface-1); border: 1px solid var(--glass-brd); border-radius: 12px; }
.seg-btn { flex: 1 1 90px; display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 8px 10px; border: 1px solid transparent; border-radius: 9px; cursor: pointer;
  background: transparent; color: var(--text2); font-family: inherit; transition: all 0.15s; }
.seg-btn:hover { background: var(--surface-2); color: var(--text); }
.seg-btn.sel { background: var(--accent-wash-2); border-color: var(--accent); color: var(--accent); }
.seg-lb { font-size: 14px; font-weight: 600; }
.seg-d { font-size: 11px; opacity: 0.7; white-space: nowrap; }
@media (max-width: 640px) {
  .seg-btn { flex-basis: 70px; padding: 7px 6px; }
  .seg-d { display: none; }        /* màn hẹp: giữ nhãn, bỏ dòng phụ cho khỏi vỡ hàng */
}

/* Picker model (SET MAIN MODEL) */
.mp-overlay {
  display: none; position: fixed; inset: 0; z-index: 200;
  background: var(--scrim); backdrop-filter: blur(6px);
  align-items: center; justify-content: center;
}
.mp-overlay.open { display: flex; animation: fadeIn 0.15s ease; }
.mp-box {
  width: 760px; max-width: 94vw; max-height: 86vh; display: flex; flex-direction: column;
  background: var(--bg2); border: 1px solid var(--glass-brd); border-radius: 16px; box-shadow: var(--glow);
}
.mp-head { display: flex; align-items: flex-start; justify-content: space-between; padding: 18px 20px 12px; }
.mp-title { font-family: var(--font); font-weight: 700; font-size: 16px; letter-spacing: 1px; }
.mp-sub { font-size: 14px; color: var(--text2); margin-top: 3px; }
.mp-x { background: var(--bg3); border: 1px solid var(--border); color: var(--text2); width: 30px; height: 30px; border-radius: 8px; cursor: pointer; }
.mp-filter { margin: 0 20px 12px; background: var(--sunken); border: 1px solid var(--glass-brd); color: var(--text); padding: 10px 12px; border-radius: 9px; font-size: 15px; }
.mp-filter:focus { outline: none; border-color: var(--accent); }
.mp-body { display: grid; grid-template-columns: 260px 1fr; gap: 0; flex: 1; overflow: hidden; border-top: 1px solid var(--glass-brd); }
.mp-provs { border-right: 1px solid var(--glass-brd); overflow-y: auto; padding: 8px; }
.mp-prov { display: block; width: 100%; text-align: left; background: transparent; border: 1px solid transparent; color: var(--text2); border-radius: 10px; padding: 9px 11px; cursor: pointer; margin-bottom: 2px; }
.mp-prov:hover { background: var(--surface-2); color: var(--text); }
.mp-prov.active { background: var(--accent2-wash); border-color: var(--accent2-line); color: var(--text); }
.mp-prov-l { font-size: 15px; font-weight: 600; }
.mp-prov-c { font-family: var(--font); font-size: 12px; color: var(--text3); margin-top: 2px; }
.mp-models { overflow-y: auto; padding: 8px 12px; }
.mp-model { display: block; width: 100%; text-align: left; background: transparent; border: 1px solid transparent; color: var(--text); border-radius: 9px; padding: 11px 12px; cursor: pointer; font-family: var(--font); font-size: 15px; }
.mp-model:hover { background: var(--surface-2); }
.mp-model.sel { background: var(--accent-wash-2); border-color: var(--accent); }
.mp-cur { float: right; font-size: 11px; color: var(--accent2); letter-spacing: 1px; }
.mp-empty { color: var(--text3); font-size: 14px; padding: 16px; }
.mp-foot { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid var(--glass-brd); }
.mp-foot .mp-note { max-height: 84px; overflow-y: auto; }   /* lỗi dài không làm footer phình đẩy nút ra ngoài */
.mp-note { font-size: 13px; color: var(--text3); }
.mp-btn { background: var(--bg3); border: 1px solid var(--border); color: var(--text); padding: 9px 18px; border-radius: 9px; cursor: pointer; font-size: 15px; margin-left: 8px; }
.mp-btn.primary { background: var(--accent-solid); border-color: var(--accent-solid); color: var(--on-accent); font-weight: 600; }
.mp-btn.primary:disabled { opacity: 0.4; cursor: not-allowed; }
@media (max-width: 860px) {
  .mp-body { grid-template-columns: 1fr; }
  .mp-provs { border-right: 0; border-bottom: 1px solid var(--glass-brd); max-height: 140px; }
}

/* Skills chia nhóm (trang Skills) */
.sk-group { margin-bottom: 22px; }
.sk-group-head { font-family: var(--font); font-size: 15px; color: var(--accent2); margin-bottom: 10px; font-weight: 700; }
.sk-group-head .dim { color: var(--text3); font-weight: 400; margin-left: 6px; }

.rail-spacer { flex: 1; }
.rail-foot {                                           /* version/tác giả bên TRÁI, nút thu/mở bên PHẢI */
  font-family: var(--font); line-height: 1.35; padding: 8px 6px 0;
  border-top: 1px solid var(--glass-brd);
  display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 8px;
}
.rail-collapse-btn {                                   /* nút thu/mở sidebar, ghim bên phải; icon căn cỡ với icon nav */
  order: 2; display: flex; align-items: center; justify-content: center;
  width: 32px; height: 28px; padding: 0; flex: 0 0 auto;
  background: transparent; border: 1px solid var(--glass-brd); border-radius: 8px;
  color: var(--text3); cursor: pointer;
  transition: color var(--rail-anim), background var(--rail-anim);
}
.rail-collapse-btn:hover { color: var(--text); background: var(--surface-2); }
.rail-collapse-btn svg { width: 18px; height: 18px; }
.rail-foot .rf-meta { order: 1; text-align: left; min-width: 0; }
.rail-foot .rf-ver { font-size: 11px; color: var(--text2); }
.rail-foot .rf-author { display: block; margin-top: 2px; font-size: 8.5px; color: var(--accent); text-decoration: none; }
.rail-foot .rf-author:hover { text-decoration: underline; }

/* Tooltip nhanh cho rail thu gọn (JS đặt vị trí; body-level nên không bị overflow rail cắt) */
.rail-tip {
  position: fixed; z-index: 200; pointer-events: none;
  background: var(--panel-solid); color: var(--text);
  border: 1px solid var(--glass-brd); border-radius: 8px;
  padding: 5px 10px; font-size: 12.5px; font-family: var(--font-ui); white-space: nowrap;
  box-shadow: var(--shadow-2);
  opacity: 0; transform: translateY(-50%) translateX(-4px);
  transition: opacity 0.1s, transform 0.1s;
}
.rail-tip.show { opacity: 1; transform: translateY(-50%) translateX(0); }

/* ===== Chế độ THU GỌN sidebar (chỉ desktop): còn mỗi icon, tên hiện qua tooltip ===== */
@media (min-width: 861px) {
  body.rail-collapsed { --rail-w: var(--rail-w-collapsed); }
  .rail.collapsed .rail-grp-lbl { display: none; }              /* ẩn header nhóm */
  .rail.collapsed .rail-grp-items {                             /* hiện HẾT mục (bỏ accordion), icon xếp dọc */
    max-height: none; opacity: 1; overflow: visible; padding: 0;
  }
  .rail.collapsed .rail-group + .rail-group > .rail-grp-items { /* vạch ngăn mờ giữa các nhóm */
    border-top: 1px solid var(--glass-brd); margin-top: 5px; padding-top: 5px;
  }
  .rail.collapsed .rail-item { justify-content: center; padding: 9px 0; gap: 0; }
  .rail.collapsed .rail-item .rail-lbl { display: none; }       /* giấu chữ, chỉ còn icon */
  .rail.collapsed .rf-meta { display: none; }                   /* giấu version/tác giả cho vừa bề ngang hẹp, chỉ còn nút */
  .rail.collapsed .rail-foot { justify-content: center; }       /* thu: chỉ còn nút, căn giữa */
}

/* ===== Đẩy cockpit sang phải để chừa rail ===== */
body.has-rail .hud { margin-left: var(--rail-w); width: calc(100% - var(--rail-w)); }

/* ===== Console view (vùng trang quản lý) - bắt đầu DƯỚI header toàn cục ===== */
.cview {
  position: fixed; top: var(--topbar-h); right: 0; bottom: 0; left: var(--rail-w); z-index: 40;
  display: flex; flex-direction: column;
  background:
    radial-gradient(1200px 600px at 80% -10%, var(--accent2-wash), transparent 60%),
    radial-gradient(900px 500px at -10% 110%, var(--accent-wash), transparent 60%),
    var(--bg);
  overflow: hidden;
}
.cview-head {
  display: flex; align-items: center; gap: 12px;
  padding: 16px 26px; border-bottom: 1px solid var(--glass-brd);
}
.cview-title { font-family: var(--font); font-size: 18px; font-weight: 700; letter-spacing: 1px; }
.cview-title .ico { color: var(--accent); margin-right: 8px; }
.cview-sub { font-size: 14px; color: var(--text2); }
.cview-body { flex: 1; overflow-y: auto; padding: 24px 26px; }

/* ===== Cards chung ===== */
.cgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.gcard {
  background: var(--glass); border: 1px solid var(--glass-brd); border-radius: 16px;
  padding: 18px; box-shadow: var(--glow);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  transition: transform 0.18s, border-color 0.18s;
}
.gcard:hover { transform: translateY(-2px); border-color: var(--accent-line); }
.gcard.current { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent), 0 8px 30px rgba(255, 107, 43, 0.18); }
.gcard-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.gcard-name { font-family: var(--font); font-weight: 700; font-size: 16px; }
.gcard-tag {
  font-family: var(--font); font-size: 11px; padding: 3px 7px; border-radius: 6px;
  background: var(--accent2-wash-2); color: var(--accent2-ink); text-transform: uppercase; letter-spacing: 0.5px;
}
.gcard-meta { margin-top: 8px; font-size: 14px; color: var(--text2); }

/* Token API (CLI). Bản thô chỉ hiện đúng một lần nên khối .tk-new phải NỔI BẬT - lướt qua nó
   là mất token và phải tạo lại cái khác. */
.tk-list { margin-top: 14px; display: flex; flex-direction: column; gap: 8px; }
.tk-row {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding: 10px 12px; border-radius: 10px; background: var(--surface-2);
  border: 1px solid var(--glass-brd);
}
.tk-info { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.tk-meta { font-size: 12px; color: var(--text2); }
.tk-row .gcard-btn { margin-top: 0; width: auto; padding: 6px 12px; font-size: 13px; flex: none; }
.tk-new {
  margin-top: 14px; padding: 12px; border-radius: 10px;
  background: var(--accent2-wash-2); border: 1px solid var(--accent-solid);
}
.tk-new-hd { font-weight: 700; font-size: 14px; margin-bottom: 8px; }
.tk-code {
  display: block; padding: 10px; border-radius: 8px; background: var(--surface);
  border: 1px solid var(--glass-brd); font-size: 13px; word-break: break-all;
  user-select: all;
}
/* Token mà không có tài liệu thì người dùng cầm chuỗi jvs_ trong tay mà không biết dán vào đâu.
   Link đặt ngay dưới thẻ, và lặp lại lúc token vừa hiện ra - đúng lúc cần bước kế tiếp nhất. */
.tk-docs {
  display: flex; gap: 12px; flex-wrap: wrap;
  margin-top: 14px; padding-top: 10px; border-top: 1px solid var(--surface-3);
}
.tk-docs a, .tk-doclink { font-size: 12.5px; color: var(--link-ink); text-decoration: none; }
.tk-docs a:hover, .tk-doclink:hover { text-decoration: underline; }
.gcard-btn {
  margin-top: 14px; width: 100%; padding: 9px; border-radius: 10px; cursor: pointer;
  background: var(--surface-2); border: 1px solid var(--glass-brd); color: var(--text);
  font-family: var(--font); font-size: 14px; transition: all 0.18s;
}
.gcard-btn:hover { background: var(--accent-solid); border-color: var(--accent-solid); color: var(--on-accent); }
/* Nút đang bận/khoá: giữ nguyên bộ mặt thường, không tô cam khi rê chuột (tô cam
   xong chữ đổi sang var(--on-accent) trong khi opacity hạ xuống là đọc không ra). */
.gcard-btn:disabled { cursor: not-allowed; }
.gcard-btn:disabled:hover { background: var(--surface-2); border-color: var(--glass-brd); color: var(--text); }
.gcard-btn.ghost:disabled:hover { background: transparent; color: var(--text2); }
.gcard.current .gcard-btn { background: var(--accent-wash-2); border-color: var(--accent); color: var(--accent); }

.cview-section { margin-bottom: 28px; }
.cview-section h3 {
  font-family: var(--font); font-size: 14px; letter-spacing: 1px; text-transform: uppercase;
  color: var(--text2); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
}

/* Cài đặt: một cột đọc tập trung, nhóm ít dùng có thể gập lại thay vì trải kín màn hình. */
.settings-page { width: min(100%, 960px); margin: 0 auto; display: flex; flex-direction: column; gap: 14px; }
.settings-group {
  border: 1px solid var(--glass-brd); border-radius: 16px; overflow: hidden;
  background: var(--glass); box-shadow: var(--shadow-1);
}
.settings-group > summary {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 16px 18px; cursor: pointer; list-style: none; user-select: none;
}
.settings-group > summary::-webkit-details-marker { display: none; }
.settings-group > summary span:first-child { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.settings-group > summary b { font-family: var(--font); font-size: 15px; color: var(--text); }
.settings-group > summary small { font-size: 12.5px; color: var(--text3); font-weight: 400; }
.settings-caret { color: var(--text3); font-size: 18px; transition: transform .18s ease; }
.settings-group:not([open]) .settings-caret { transform: rotate(-90deg); }
.settings-group-body { padding: 0 18px 18px; border-top: 1px solid var(--hairline); }
.settings-status-grid {
  display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 1px;
  margin: 0 -18px 16px; background: var(--surface-2);
}
.settings-status-grid > div { min-width: 0; padding: 13px 16px; background: var(--bg2); }
.settings-status-grid span { display: block; color: var(--text3); font-size: 11px; text-transform: uppercase; letter-spacing: .7px; }
.settings-status-grid b { display: block; margin-top: 5px; color: var(--text); font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.settings-links { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 8px; }
.settings-links button {
  display: grid; grid-template-columns: 24px 1fr; grid-template-rows: auto auto; column-gap: 7px;
  padding: 11px; text-align: left; color: var(--text); background: var(--surface-1);
  border: 1px solid var(--glass-brd); border-radius: 10px; cursor: pointer;
}
.settings-links button:hover { border-color: var(--accent-line); background: var(--accent-wash); }
.settings-links button > span { grid-row: 1 / 3; align-self: center; color: var(--accent); }
.settings-links button b { font-size: 13px; }
.settings-links button small { color: var(--text3); font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.settings-two-col { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; padding-top: 16px; }
.settings-card { min-width: 0; padding: 14px; border: 1px solid var(--glass-brd); border-radius: 12px; background: var(--surface-1); }
.settings-card.compact { max-width: 520px; margin-top: 16px; }
.settings-card-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.settings-card p { margin: 8px 0 0; color: var(--text2); font-size: 13px; line-height: 1.5; }
.settings-card .gcard-btn { width: auto; }
.cview-placeholder {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 100%; gap: 10px; color: var(--text3); text-align: center;
}
.cview-placeholder .ph-ico { font-size: 44px; opacity: 0.5; }

/* ===== View transition (mượt khi đổi trang) ===== */
@media (prefers-reduced-motion: no-preference) {
  ::view-transition-old(root), ::view-transition-new(root) { animation-duration: 0.26s; }
}
.cview[hidden] { display: none !important; }
[x-cloak] { display: none !important; }

/* Editor + run-drawer giờ top-level (không còn trong overlay Studio) → nổi trên rail/cview */
.run-drawer { z-index: 430; }

/* Dọn header cockpit: bỏ logo lặp (đã có ở rail) + nút Studio/Cài đặt (đã có ở rail).
   #settingsBtn cũ chỉ còn là fallback tương thích; mọi lối vào hiển thị dùng trang Cài đặt trên rail. */
.hud-top .brand,
.hud-top .studio-open-btn,
.hud-top #settingsBtn { display: none; }
/* Studio panels render trong cview: bỏ căn giữa cứng cho hợp khung trang */
.cview-body .stab-panel { max-width: 1100px; margin: 0; }

/* ============================================
   NHÓM CODE trên rail (hôm nay có Terminal)
   ============================================ */
/* Trang duy nhất chiếm TRỌN khung: terminal đo chiều cao thật để tính ra số dòng, nên khung
   phải cao cố định và tự cuộn bên trong chứ không để cả trang trôi. console.js gắn/gỡ lớp này. */
.cview-body.cview-flush { padding: 0; overflow: hidden; }
.code-page { display: flex; flex-direction: column; height: 100%; min-height: 0; }
.code-panel { flex: 1; min-height: 0; display: flex; }
.code-empty {
  flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; text-align: center; color: var(--text2); padding: 24px;
}
.code-empty svg { color: var(--text3); }
.code-dim { font-size: 13px; color: var(--text3); max-width: 460px; line-height: 1.6; }
.code-dim code, .term-note code {
  background: var(--surface-2); padding: 1px 5px; border-radius: 5px; font-family: var(--mono);
}

/* ---- Terminal ---- */
.term-wrap { flex: 1; display: flex; flex-direction: column; min-height: 0; min-width: 0; }
.term-bar {
  display: flex; align-items: center; gap: 10px; flex: 0 0 auto;
  padding: 8px 16px; border-bottom: 1px solid var(--glass-brd);
  font-size: 12.5px; color: var(--text2);
}
.term-sp { flex: 1; }
.term-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--text3); flex: 0 0 auto; }
.term-dot.ok { background: var(--green); box-shadow: 0 0 8px var(--green); }
.term-dot.err { background: var(--red); }
.term-dot.off { background: var(--text3); }
.term-st { font-weight: 600; color: var(--text); }
/* Đường dẫn dài thì cắt ở GIỮA dải chứ không đẩy hai cái nút ra khỏi màn hình. */
.term-cwd {
  display: inline-flex; align-items: center; gap: 5px; min-width: 0;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  font-family: var(--mono); font-size: 12px; color: var(--text3);
}
.term-cwd svg { width: 13px; height: 13px; flex: 0 0 auto; }
.term-btn {
  display: inline-flex; align-items: center; gap: 5px; flex: 0 0 auto;
  padding: 5px 10px; border-radius: 8px; cursor: pointer;
  border: 1px solid var(--glass-brd); background: var(--surface-1);
  color: var(--text2); font-family: var(--font-ui); font-size: 12px; font-weight: 600;
}
.term-btn:hover { background: var(--surface-2); color: var(--text); border-color: var(--accent-line); }
.term-btn svg { width: 13px; height: 13px; }
.term-note {
  flex: 0 0 auto; padding: 8px 16px; font-size: 12.5px; line-height: 1.55;
  color: var(--text2); background: var(--accent-wash); border-bottom: 1px solid var(--glass-brd);
}
.term-note svg { width: 14px; height: 14px; vertical-align: -2px; }
/* Khung xterm: nền riêng (bảng màu do JS truyền vào canvas) nên không ăn nền kính của cview. */
.term-host { flex: 1; min-height: 0; min-width: 0; padding: 8px 4px 8px 12px; overflow: hidden; }
.term-host .xterm { height: 100%; }
.term-host .xterm-viewport { scrollbar-width: thin; }

@media (max-width: 860px) {
  .term-bar { padding: 7px 10px; gap: 8px; flex-wrap: wrap; }
  .term-cwd { display: none; }          /* màn hẹp: nhường chỗ cho hai cái nút */
  .term-host { padding: 6px 2px 6px 8px; }
}

/* ============================================
   RESPONSIVE - điện thoại: rail → thanh đáy
   ============================================ */
/* Hai nút chỉ hiện ở mobile (desktop ẩn) */
.nav-toggle-btn, .new-chat-btn { display: none; }

@media (max-width: 860px) {
  :root {
    --rail-w: 0px;
    --topbar-h: calc(46px + env(safe-area-inset-top, 0px));
  }   /* header thấp hơn trên mobile nhưng vẫn chừa tai thỏ khi chạy full-screen */

  /* Header mobile: chỉ nút menu, chip model, nút thêm. Ẩn phần rườm rà. */
  .nav-toggle-btn, .new-chat-btn { display: inline-flex; }
  /* Header CỐ ĐỊNH trên cùng: luôn thấy nút menu, chip model, nút thêm ở mọi trang, không bị cuộn trôi mất. */
  .hud-top { position: fixed; top: 0; left: 0; right: 0; height: 46px; z-index: 55;
    background: var(--bg2); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 6px; padding: 0 8px; }
  .hud-top-left, .hud-top-right { display: none; }    /* rỗng ở mobile: nút menu, chip model, nút thêm là con trực tiếp header */
  .hud-top .brand, .hud-top .navbar-brain,
  .hud-top #themeToggle, .hud-top #studioOpenBtn,
  .hud-top #settingsBtn, .hud-top #ttsToggle, .hud-top #resetBtn { display: none; }
  .hud-center-title { display: none; }                /* mobile: ẩn tên workspace + ngày; chip model làm giữa header */
  .hud-top #mbOpen { display: inline-flex; margin-left: auto; margin-right: auto; }  /* chip model căn giữa, đẩy ＋ sang phải */
  .hud-top .notification-trigger {
    flex: 0 0 34px; width: 34px; min-width: 34px; height: 34px; padding: 0;
  }
  .hud-top .notification-trigger-label { display: none; }
  .hud-top .notification-badge {
    position: absolute; top: -4px; right: -5px; min-width: 16px; height: 16px; padding: 0 4px;
  }
  .notification-panel {
    top: calc(52px + env(safe-area-inset-top, 0px)); right: 8px;
    width: calc(100vw - 16px);
    max-height: min(72dvh, calc(100dvh - 76px - env(safe-area-inset-bottom, 0px)));
    border-radius: 14px;
  }
  .notification-shade { background: var(--scrim); backdrop-filter: blur(2px); }
  .noti-head { padding: 14px 13px 12px; }
  .noti-list { padding: 7px; }
  .hud-top #mbPop { position: fixed; top: calc(50px + env(safe-area-inset-top, 0px)); bottom: auto; left: 50%; transform: translateX(-50%);
    width: min(340px, 92vw); z-index: 200; max-height: 70vh; }
  .model-bar { display: none; }                       /* hàng model gốc ẩn; chip + sysBar bên trong dời đi (JS) */
  #jv-sess-btn { display: none; }                     /* nút Lịch sử: ẩn ở mobile để header cockpit khỏi chồng/lệch */

  /* Rail: từ thanh đáy → ngăn kéo trượt từ trái */
  .rail {
    top: 0; left: 0; bottom: 0; right: auto; width: min(280px, 82vw); height: 100vh;
    height: 100dvh;
    flex-direction: column;
    padding: max(10px, env(safe-area-inset-top, 0px)) 8px max(10px, env(safe-area-inset-bottom, 0px));
    gap: 4px;
    border-top: 0; border-right: 1px solid var(--glass-brd);
    transform: translateX(-100%); transition: transform .22s ease; z-index: 60; overflow-y: auto;
  }
  body.nav-open .rail { transform: translateX(0); box-shadow: 8px 0 40px var(--shadow-veil); }
  .rail-top, .rail-foot { display: flex; }            /* hiện lại brand + version trong ngăn kéo */
  .rail-nav { flex-direction: column; overflow-x: hidden; overflow-y: auto; gap: 2px; padding: 0; }
  .rail-group, .rail-grp-items { display: block; }
  .rail-grp-lbl { display: flex; }
  .rail-item { flex: none; flex-direction: row; gap: 10px; padding: 9px 10px; border-radius: 9px; }
  .rail-item .rail-lbl { font-size: 13px; }
  .rail-item.active::before { left: 0; right: auto; top: 15%; bottom: 15%; width: 3px; height: auto; }

  /* Mục "Hệ thống" ở đáy ngăn kéo: chọn brain, đổi tông, loa và trạng thái; Cài đặt dùng mục rail duy nhất. */
  .rail-sys { margin-top: 8px; padding: 10px 6px 4px; border-top: 1px solid var(--glass-brd);
    display: flex; flex-direction: column; gap: 10px; }
  .rail-sys-lbl { font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: var(--text3); }
  .rail-sys .navbar-brain { position: static; display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  .rail-sys .graph-select { flex: 1 1 auto; min-width: 0; max-width: 100%; }
  .rail-sys-btns { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
  .rail-sys-btns .hud-icon-btn { display: inline-flex; }
  .rail-sys .sysbar {
    display: flex; flex: none; width: 100%; min-width: 0; max-width: 100%;
    flex-direction: column; align-items: flex-start; gap: 6px; overflow: visible;
  }
  .rail-sys .sys-status, .rail-sys .mcp-list {
    width: 100%; min-width: 0; flex-direction: column; align-items: flex-start;
    gap: 3px; overflow: hidden;
  }

  /* Nền mờ khi mở ngăn kéo */
  .nav-backdrop { position: fixed; inset: 0; background: var(--scrim); z-index: 55; }
  .nav-backdrop[hidden] { display: none; }
  body.nav-open .nav-backdrop { display: block; }

  /* Không còn chừa 56px đáy cho rail; chat chiếm hết */
  body.has-rail .hud {
    margin-left: 0; width: 100%;
    height: 100vh; height: 100dvh;
  }
  .cview { left: 0; bottom: 0; }
  .cview-body { padding: 16px 14px; }
  .cgrid { grid-template-columns: 1fr; }
  .settings-page { width: 100%; gap: 10px; }
  .settings-group > summary { padding: 14px; }
  .settings-group-body { padding: 0 14px 14px; }
  .settings-status-grid { grid-template-columns: repeat(2,minmax(0,1fr)); margin: 0 -14px 14px; }
  .settings-links { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .settings-two-col { grid-template-columns: 1fr; padding-top: 14px; }

  /* Mobile: KHÔNG cho cả trang trôi lên xuống - cả màn là 1 khung cố định; mỗi khung tự cuộn bên trong. */
  html, body { width: 100%; height: 100%; overflow: hidden; }
  body.in-console .hud-body { visibility: hidden; }   /* trang quản lý: giấu quả cầu cockpit phía sau */
  .hud {
    height: 100vh; height: 100dvh;
    grid-template-rows: minmax(0, 1fr) auto auto;
    padding-top: calc(46px + env(safe-area-inset-top, 0px));
  }  /* header fixed; ba hàng còn lại = body + đính kèm + ô nhập */
  .hud-top {
    height: calc(46px + env(safe-area-inset-top, 0px));
    padding-top: env(safe-area-inset-top, 0px);
  }
  .hud-body { display: flex; flex-direction: column; overflow: hidden; min-height: 0; }  /* cockpit: quả cầu trên, chat dưới, không trôi */
  .hud-left { display: none; }              /* số liệu KD ẩn trên mobile (xem ở Console) */
  .hud-center {
    flex: 0 0 auto;
    height: 30vh;
    height: clamp(210px, 31dvh, 300px);
    min-height: 0;
  }
  /* BUNG NÃO: khoang não chiếm trọn phần thân, khung chat nhường chỗ. Đây là câu trả lời
     thật cho "trên điện thoại não bé quá không thấy gì" - chỉnh lề với co chữ chỉ giúp
     khung 228px bớt tệ, chứ 228px thì không bao giờ là chỗ xem đồ thị tử tế. */
  body.brain-max .hud-center { flex: 1 1 auto; height: auto; min-height: 0; }
  body.brain-max .hud-right { display: none; }
  /* Dải việc nền là thông tin trạng thái, thu não lại là thấy ngay - giấu đi để lấy chỗ.
     Chip ĐÍNH KÈM thì KHÔNG giấu: giấu là người dùng vừa gắn file xong không thấy nó đâu,
     tưởng gắn hụt. */
  body.brain-max .bg-strip { display: none; }
  .hud-right {
    flex: 1 1 auto; min-height: 0; overflow: hidden;
    padding: 8px 10px 4px;
    border-top: 1px solid var(--border);
  }
  .hud-right .panel-label {
    flex: 0 0 auto;
    min-height: 22px;
    margin-bottom: 4px;
    font-size: 10px;
    letter-spacing: 1.2px;
    /* Dồn tên model + nút phóng to về SÁT TRÁI, ngay cạnh chữ HỘI THOẠI. Mặc định là
       space-between: trên màn rộng thì đẹp, nhưng trên điện thoại nó ném hai thứ đó ra tận mép
       phải, cách chữ HỘI THOẠI một khoảng trống to - mắt phải quét ngang cả màn mới đọc được
       đang chạy model nào (chủ repo báo 2026-08-12). */
    justify-content: flex-start;
    gap: 8px;
  }
  /* max-width: 60% mặc định tính theo khối bọc, mà khối đó lại co theo nội dung nên tên model
     dài là nó đẩy nút phóng to đi. Trên màn hẹp neo theo BỀ NGANG MÀN HÌNH mới chặn được. */
  .hud-right .panel-label .engine-badge { max-width: 58vw; }
  .hud-right .transcript {
    flex: 1 1 auto;
    min-height: 0;
    max-height: none;
    padding-right: 2px;
  }

  /* Neuron chỉ là bối cảnh trên mobile: nhãn và lớp trạng thái nhỏ hơn để chat là nội dung chính. */
  .concept-label .cl-name { font-size: 10px; letter-spacing: 1.2px; }
  .concept-label .cl-meta { font-size: 8px; letter-spacing: .5px; margin-top: 0; }
  /* Tên thư mục dài ("BRAIN DEFAULT") vốn nowrap + translate(-50%) nên tràn hẳn ra ngoài mép
     phải và bị cắt cụt. Kẹp bề ngang rồi cắt bằng dấu ba chấm: nhãn nào cũng nằm gọn trong
     khoang, kể cả nhãn ngoài rìa nhất. */
  .concept-label { max-width: 32vw; }
  .concept-label .cl-name, .concept-label .cl-meta {
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .orb-overlay { bottom: 40px; }
  .orb-state { font-size: 11px; letter-spacing: 2px; }
  .orb-interim {
    max-width: calc(100vw - 28px);
    margin-top: 3px;
    min-height: 14px;
    font-size: 13px;
  }
  .brain-overlay-toggle {
    top: 7px; right: 7px;
    width: 32px; height: 32px; padding: 7px; border-radius: 9px;
  }
  .brain-overlay-toggle svg { width: 17px; height: 17px; }
  /* CẢ BA nút cùng mang class .brain-overlay-toggle, nên dòng \`top: 7px\` ngay trên đè luôn
     \`.graph-timelapse-btn { top: 58px }\` của style.css (cùng độ ưu tiên, console.css nạp
     sau). Hệ quả suốt từ trước: trên điện thoại nút mắt và nút timelapse CHỒNG KHÍT lên
     nhau ở góc phải, nút vẽ sau ăn hết cú chạm, và nút ẩn nhãn không cách nào bấm được.
     Xếp lại tường minh, mỗi nút một hàng. */
  .graph-timelapse-btn { top: 46px; }
  .brain-max-btn { top: 85px; }

  /* Agents / Skills / Workflows thành một thanh mỏng thay vì một card lớn che neuron.
     Số và nhãn nằm CÙNG MỘT DÒNG: xếp chồng như desktop thì dải cao ~56px, tức một phần tư
     khoang não mobile, chỉ để nói ba con số. Một dòng còn ~28px. */
  .brain-stats {
    bottom: 6px;
    width: min(420px, calc(100% - 20px));
    padding: 2px;
    border-radius: 10px;
  }
  .bstat { flex: 1 1 0; flex-direction: row; align-items: baseline; justify-content: center;
    gap: 4px; padding: 4px 5px; border-radius: 8px; }
  .bstat-num { font-size: 14px; }
  .bstat-lbl { margin-top: 0; font-size: 8px; letter-spacing: .8px; }
  .bstat-sep { margin: 4px 0; }

  /* Nút BUNG/THU khoang não - chỉ có trên mobile, xếp dưới nút mắt và nút timelapse. */
  .brain-max-btn { display: grid; }
  .brain-max-btn .bmx-out { display: none; }
  body.brain-max .brain-max-btn .bmx-in { display: none; }
  body.brain-max .brain-max-btn .bmx-out { display: block; }
  body.brain-max .brain-max-btn { color: var(--accent-ink); border-color: var(--accent-line); }

  /* Ô nhập luôn nằm trong visual viewport của Safari/Chrome iOS và chừa safe area. */
  .hud-voice {
    min-width: 0;
    margin: 5px 8px max(7px, env(safe-area-inset-bottom, 0px));
  }
  .hud-voice .voice-input { min-width: 0; }
  .cview-head { padding: 14px 16px; }
  .cview-title { font-size: 16px; }
}

@media (max-width: 860px) and (max-height: 620px) {
  .hud-center { height: clamp(160px, 27dvh, 210px); }
  .concept-label .cl-meta { display: none; }
  /* Màn thấp: ba nút xếp dọc đã chạm mép dưới khoang, kéo khoảng cách lại. */
  .graph-timelapse-btn { top: 42px; }
  .brain-max-btn { top: 77px; }
}

/* ==== Trang Kết nối (kho connector + đa tài khoản) ==== */
.conn-card .conn-ico { font-size: 26px; width: 40px; text-align: center; flex-shrink: 0; }
.conn-accounts { display: flex; flex-wrap: wrap; gap: 8px; padding: 10px 14px 14px; }
.conn-chip { display: inline-flex; align-items: center; gap: 6px; padding: 5px 11px; border-radius: 16px;
  border: 1px solid var(--border); background: var(--surface-2); color: inherit;
  font-size: 13px; cursor: pointer; }
.conn-chip:hover { background: var(--surface-3); }
.conn-chip.off { opacity: .45; }
.conn-chip.add { border-style: dashed; opacity: .75; }
.conn-chip .cdot { color: var(--text3); font-size: 10px; }
.conn-chip .cdot.on { color: var(--green); }
/* Sức khoẻ kết nối (vòng check nền): sống / lỗi / chưa rõ - đè lên màu on/off cơ bản */
.conn-chip .cdot.hok { color: var(--green); }
.conn-chip .cdot.herr { color: var(--red); }
.conn-chip .cdot.hunk { color: var(--warn-ink); }
.conn-chip.conn-fix { border-color: var(--danger-line); color: var(--red); background: var(--danger-wash); }
.conn-chip.conn-fix:hover { background: var(--danger-wash); }
.conn-chip .cstar { color: var(--warn-ink); }
/* Khối B: nhóm Google một cửa + wizard từng bước + kéo thả JSON + dùng lại key */
.gico { display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px;
  border-radius: 9px; background: #fff; color: #4285f4; font-weight: 800; font-size: 21px;
  font-family: Arial, sans-serif; }
.conn-steps { margin: 4px 0 10px; padding-left: 22px; display: flex; flex-direction: column; gap: 9px;
  font-size: 13.5px; line-height: 1.5; }
.conn-steps li::marker { color: var(--accent); font-weight: 700; }
.conn-steps .step-link { margin-left: 6px; padding: 2px 9px; font-size: 12px; vertical-align: 1px; }
.conn-steps .wiz-copy { margin-top: 6px; }
.gp-row { display: flex; align-items: center; gap: 10px; text-align: left; }
.gp-ico { flex: 0 0 auto; width: 30px; display: inline-flex; justify-content: center; font-size: 20px; }
.gp-ico .ico-img { width: 24px; height: 24px; object-fit: contain; }
.gp-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.gp-name { font-weight: 600; }
.json-drop { border: 1.5px dashed var(--border); border-radius: 10px; padding: 12px 14px;
  font-size: 13px; opacity: .85; cursor: pointer; margin: 2px 0 6px; transition: border-color .15s, background .15s; }
.json-drop:hover, .json-drop.over { border-color: var(--accent); background: var(--info-wash); opacity: 1; }
.json-drop.ok { border-color: var(--green); color: var(--green); opacity: 1; }
.json-drop.bad { border-color: var(--red); color: var(--red); opacity: 1; }
.reuse-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin: 2px 0 6px;
  padding: 9px 12px; border: 1px solid var(--ok-line); border-radius: 10px; background: var(--ok-wash); }
.reuse-row select { max-width: 200px; }
/* Đèn báo não: bộ não mất đăng nhập - dải đỏ mỏng giữa thanh trạng thái */
/* Ngắn gọn và BẤM ĐƯỢC. Trước đây chuỗi dài hơn cả thanh trạng thái nên bị cắt cụt giữa
   chừng, và phần bị cắt lại đúng là phần nói phải làm gì. Nay chữ đủ ngắn để không cần cắt;
   max-width chỉ còn là lưới an toàn cho màn hẹp. */
.engine-banner { display: inline-flex; align-items: center; gap: 5px; max-width: 46vw;
  padding: 3px 12px; cursor: pointer;
  border: 1px solid var(--danger-line); border-radius: 14px; background: var(--danger-wash);
  color: var(--red); font-size: 12.5px; white-space: nowrap; overflow: hidden;
  text-overflow: ellipsis; transition: background 0.15s, border-color 0.15s; }
.engine-banner:hover { background: var(--danger-wash); border-color: var(--red); }
/* display của class đè mất [hidden] mặc định của trình duyệt → phải tự ẩn lại, không thì
   đèn lộ vỏ rỗng thường trực trên thanh trạng thái (bug 0.9.195). */
.engine-banner[hidden] { display: none; }
@media (max-width: 700px) { .engine-banner { max-width: 70vw; font-size: 11.5px; } }
/* Khối D: khu "kết nối sẵn của CLI" gập mặc định + mobile 1 cột */
.amb-details summary { cursor: pointer; list-style: none; }
.amb-details summary::-webkit-details-marker { display: none; }
.amb-details summary h3::before { content: "▸ "; opacity: .6; }
.amb-details[open] summary h3::before { content: "▾ "; }
@media (max-width: 700px) {
  .cat-grid { grid-template-columns: 1fr; }
  .conn-accounts { flex-wrap: wrap; }
  .conn-chip { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .reuse-row select { max-width: 100%; }
}
.perm-chip { font-size: 11px; border: 1px solid; border-radius: 10px; padding: 1px 7px; opacity: .9; }
.cat-tools { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin: 10px 0 4px; }
.cat-filter { display: flex; flex-wrap: wrap; gap: 6px; }
.cat-chip { border: 1px solid var(--border); background: transparent; color: inherit;
  border-radius: 14px; padding: 4px 12px; font-size: 12.5px; cursor: pointer; opacity: .8; }
.cat-chip.on { border-color: var(--accent); color: var(--accent); opacity: 1; }
.cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px; margin-top: 12px; max-width: 980px; }
.cat-card { border: 1px solid var(--border); border-radius: 12px; padding: 14px;
  background: var(--surface-1); display: flex; flex-direction: column; gap: 8px; }
.cat-card.soon { opacity: .55; }
.cat-ico { font-size: 30px; height: 34px; display: flex; align-items: center; }
.ico-img { width: 32px; height: 32px; object-fit: contain; border-radius: 7px; vertical-align: middle; }
.conn-card .conn-ico .ico-img { display: block; margin: 0 auto; }
.cat-name { font-weight: 600; font-size: 14.5px; }
.cat-desc { font-size: 12.5px; opacity: .7; flex: 1; line-height: 1.45; }
.cat-doc { font-size: 12px; opacity: .7; }
.conn-form { padding: 14px 18px; display: flex; flex-direction: column; gap: 10px; flex: 1 1 auto; min-height: 0; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--accent) transparent; }
.conn-form::-webkit-scrollbar { width: 10px; }
.conn-form::-webkit-scrollbar-thumb { background: var(--border); border-radius: 6px; border: 2px solid transparent; background-clip: content-box; }
.conn-form::-webkit-scrollbar-thumb:hover { background: var(--accent); background-clip: content-box; }
.conn-form .mcp-lb { display: flex; flex-direction: column; gap: 4px; font-size: 14px; opacity: .85; }
/* white-space: pre-line -> xuống dòng viết trong mcp-catalog.json hiện ĐÚNG thành xuống dòng
   (guide là chuỗi thuần đi qua esc(), không phải HTML). overflow-wrap: anywhere -> chuỗi dài
   không khoảng trắng (lệnh shell, URL callback) bẻ dòng thay vì đẩy tràn ngang cả modal. */
.conn-guide { font-size: 13px; opacity: .8; background: var(--info-wash);
  border: 1px solid var(--info-line); border-radius: 8px; padding: 9px 12px; line-height: 1.6;
  white-space: pre-line; overflow-wrap: anywhere; }
.conn-risk { font-size: 13px; background: var(--warn-wash); border: 1px solid var(--warn-line);
  border-radius: 8px; padding: 10px 12px; line-height: 1.55;
  white-space: pre-line; overflow-wrap: anywhere; }
.conn-wizard { display: flex; flex-direction: column; gap: 10px; }
.wiz-links { display: flex; flex-wrap: wrap; gap: 8px; }
.wiz-links .wiz-open { margin-left: 0; font-size: 13px; padding: 7px 12px; }
.wiz-copy { display: flex; gap: 8px; align-items: stretch; }
.wiz-copy input { flex: 1 1 auto; font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 12.5px; }
.wiz-copy .wiz-copy-btn { margin-left: 0; white-space: nowrap; }
.conn-ok { font-size: 14.5px; padding: 8px 2px; color: var(--green); }
.conn-hint { margin-top: 8px; font-size: 13px; color: var(--warn-ink); }
.qr-img { width: 240px; height: 240px; border-radius: 10px; background: #fff; padding: 8px;
  display: block; margin: 10px auto 4px; }
.conn-menu { display: flex; flex-direction: column; gap: 6px; padding: 12px 16px; }
.conn-menu-btn { text-align: left; border: 1px solid var(--border); background: var(--surface-1);
  color: inherit; border-radius: 8px; padding: 9px 12px; font-size: 13.5px; cursor: pointer;
  display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.conn-menu-btn:hover:not(:disabled) { background: var(--surface-3); }
.conn-menu-btn:disabled { opacity: .4; cursor: default; }
.conn-menu-btn.danger { color: var(--red); }
.conn-audit { max-height: 380px; overflow-y: auto; padding: 10px 16px; font-size: 13px; }
.aud-row { padding: 6px 0; border-bottom: 1px solid var(--surface-2); }
.aud-row.bad { color: var(--red); }
.aud-ts { opacity: .55; font-size: 12px; margin-right: 6px; }
.aud-err { font-size: 12px; opacity: .8; margin-top: 2px; }


/* Xác thực 2 lớp (trang Tài khoản) */
.tfa-card .tfa-warn { color: var(--warn-ink); font-weight: 600; }
.tfa-steps { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
.tfa-step { font-size: 13px; line-height: 1.55; color: var(--text2); }
.tfa-step b { color: var(--text); }
.tfa-qr { align-self: flex-start; background: #fff; padding: 10px; border-radius: 10px; border: 1px solid var(--glass-brd); }
/* KHÔNG ép kích thước: để SVG ra đúng cỡ tự nhiên mà server đã tính (8px mỗi ô).
   Ép xuống 200px là nén 49 ô vào 200px = 3,7px mỗi ô, và camera điện thoại soi màn hình
   ở cỡ đó thì quét không ra - đúng lỗi ở 0.26.20. max-width giữ cho nó không tràn thẻ
   trên màn hình hẹp; height:auto để tỉ lệ vuông không bị méo khi bị thu. */
.tfa-qr svg { display: block; width: auto; max-width: 100%; height: auto; }
.tfa-secret { display: inline-block; font-family: var(--font-mono, monospace); font-size: 13px; letter-spacing: 1px; background: var(--surface-2); border: 1px solid var(--glass-brd); border-radius: 6px; padding: 3px 8px; margin-left: 4px; user-select: all; word-break: break-all; }
.tfa-rec { margin-top: 10px; }
.tfa-rec-note { font-size: 13px; line-height: 1.55; color: var(--warn-ink); background: var(--warn-wash); border: 1px solid var(--warn-line); border-radius: 8px; padding: 9px 11px; margin-bottom: 10px; }
.tfa-rec-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(122px, 1fr)); gap: 7px; margin-bottom: 12px; }
.tfa-rec-grid code { font-family: var(--font-mono, monospace); font-size: 13px; letter-spacing: 1px; text-align: center; background: var(--surface-2); border: 1px solid var(--glass-brd); border-radius: 6px; padding: 6px 4px; user-select: all; }

/* Dòng trạng thái 2FA trong khối "Tài khoản đăng nhập" cũ (#quickSet nhúng ở trang Cài đặt) */
.set-tfa { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; font-size: 13px; line-height: 1.55; color: var(--text2); margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--glass-brd); }
.set-tfa .tfa-on { color: var(--green); }
.set-tfa .tfa-off { color: var(--text); }
.set-tfa .tfa-low { color: var(--warn-ink); }
.set-tfa button { margin-left: auto; flex: 0 0 auto; }
`;function Jr(e){var i;return(((i=e.match(/<body[^>]*>([\s\S]*?)<\/body>/i))==null?void 0:i[1])||e).replaceAll("/brand-logo",new URL(""+new URL("logo-B3HHiTKS.png",import.meta.url).href,import.meta.url).href).replaceAll("/static/","./javis-static/").replace(/<script[\s\S]*?<\/script>/gi,"")}function Yr({currentTime:e,username:t,messages:i,isSending:a,onExit:s}){const p=o.useMemo(()=>Jr(qr),[]);return n.jsxs("section",{className:"javis-original-shell","aria-label":"Javis OS original dashboard clone",children:[n.jsx("style",{children:Kr}),n.jsx("style",{children:Fr}),n.jsx("div",{className:"javis-original-runtime",dangerouslySetInnerHTML:{__html:p}}),n.jsxs("div",{className:"javis-original-jcore-rail",children:[n.jsx("button",{type:"button",onClick:s,children:"EXIT J-CORE"}),n.jsx("span",{children:"NO IFRAME · external/javis-os/dashboard"}),n.jsxs("small",{children:[t," · ",e," · ",i.length," msgs · ",a?"THINKING":"READY"]})]})]})}const st={workspace:{eyebrow:"JARVIS://HUB-RUNTIME",title:"Không gian hoạch định"},terminal:{eyebrow:"LOCAL://UBUNTU",title:"Ubuntu local"},agents:{eyebrow:"PWR://OPENCLAW",title:"OpenClaw & tác nhân"},router:{eyebrow:"SPC://9ROUTER",title:"9Router Control"},hermes:{eyebrow:"AI://HERMES",title:"Hermes Core"},claude:{eyebrow:"AI://CLAUDE",title:"Claude Bridge"},intel:{eyebrow:"NET://KNOWLEDGE",title:"Thư viện & Ubuntu Files"}},mi={state:"idle",overview:null,error:"",prompt:"",reply:"",sending:!1},Wr=/\b(jarvis|j core|jcore|jay core|tro ly)\b/,Zr=/\b(giup|hoi|tu van|phan tich|lam sao|nen|co nen|hay|cho t|cho tao|cho minh|debug|sua|mo|tim|nhac|ghi nho|ke hoach|y kien|danh gia)\b/,Xr=new Set(["uh","uh huh","um","uhm","hmm","hm","ok","okay","oke","u","um dung","thoi","khong sao","duoc roi","de xem"]),Qr=[{label:"Tình trạng",prompt:"Kiểm tra tình trạng hệ thống và báo ngắn gọn."},{label:"Lên kế hoạch",prompt:"Lập kế hoạch hành động cho mục tiêu hiện tại của tôi."},{label:"Phân tích",prompt:"Phân tích vấn đề tôi đang gặp và đề xuất bước tiếp theo."},{label:"Viết code",prompt:"Hỗ trợ tôi xử lý một tác vụ lập trình."}],ct={gold:"Gold Core",blue:"Spatial Tesseract",green:"Stark Matrix",red:"Stark Combat",violet:"Stark Quantum",orange:"Arc Reactor",spider:"Spider 2099",world:"World Monitor",javis:"Javis Neural OS"},no={idle:"Sẵn sàng",listening:"Đang lắng nghe",thinking:"Đang xử lý",speaking:"Đang phản hồi"},Se={female:"Nữ chuẩn",male:"Nam trầm"};function eo(e){var s,p;const i=(((p=(s=window.speechSynthesis)==null?void 0:s.getVoices)==null?void 0:p.call(s))??[]).filter(c=>/^vi(?:-|_)/i.test(c.lang));if(!i.length)return null;const a=e==="female"?/hoai\s*my|hoài\s*my|female|woman|linh|mai|an\b/i:/nam\s*minh|male|man|duy|long/i;return[...i].sort((c,m)=>{const u=v=>(v.lang.toLowerCase()==="vi-vn"?6:0)+(a.test(v.name)?8:0)+(v.localService?2:0)+(/natural|neural/i.test(v.name)?2:0);return u(m)-u(c)})[0]??null}function D({name:e}){const t={hub:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"M4 4h7v7H4ZM13 4h7v4h-7ZM13 10h7v10h-7ZM4 13h7v7H4Z"}),n.jsx("path",{d:"M7.5 11v2M11 7.5h2M11 16.5h2"})]}),chat:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"}),n.jsx("path",{d:"M8 9h8M8 13h5"})]}),settings:n.jsxs(n.Fragment,{children:[n.jsx("circle",{cx:"12",cy:"12",r:"3"}),n.jsx("path",{d:"M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.09A1.7 1.7 0 0 0 8.5 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3V9.6h.09A1.7 1.7 0 0 0 4.6 8.5a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.09A1.7 1.7 0 0 0 15.5 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.16.37.37.72.6 1 .3.3.69.44 1.1.4h.1v4h-.1A1.7 1.7 0 0 0 19.4 15Z"})]}),reset:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"M3 12a9 9 0 1 0 3-6.7"}),n.jsx("path",{d:"M3 4v6h6"}),n.jsx("path",{d:"M12 8v4l3 2"})]}),external:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"M14 3h7v7M10 14 21 3"}),n.jsx("path",{d:"M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"})]}),copy:n.jsxs(n.Fragment,{children:[n.jsx("rect",{x:"8",y:"8",width:"12",height:"12",rx:"2"}),n.jsx("path",{d:"M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"})]}),trash:n.jsx(n.Fragment,{children:n.jsx("path",{d:"M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6"})}),close:n.jsx("path",{d:"m6 6 12 12M18 6 6 18"}),minimize:n.jsx("path",{d:"M6 12h12"}),maximize:n.jsx(n.Fragment,{children:n.jsx("path",{d:"M8 4H4v4M16 4h4v4M20 16v4h-4M8 20H4v-4"})}),mic:n.jsxs(n.Fragment,{children:[n.jsx("rect",{x:"9",y:"3",width:"6",height:"11",rx:"3"}),n.jsx("path",{d:"M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"})]}),attach:n.jsx("path",{d:"m20.5 11.5-8.7 8.7a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7L9 17.4a2 2 0 0 1-2.8-2.8l8.6-8.6"}),screen:n.jsxs(n.Fragment,{children:[n.jsx("rect",{x:"3",y:"4",width:"18",height:"13",rx:"2"}),n.jsx("path",{d:"M8 21h8M12 17v4"}),n.jsx("path",{d:"m14 8 3 3-3 3M17 11H9"})]}),send:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"m22 2-7 20-4-9-9-4Z"}),n.jsx("path",{d:"M22 2 11 13"})]}),terminal:n.jsxs(n.Fragment,{children:[n.jsx("rect",{x:"3",y:"4",width:"18",height:"16",rx:"2"}),n.jsx("path",{d:"m7 9 3 3-3 3M13 15h4"})]}),agents:n.jsxs(n.Fragment,{children:[n.jsx("circle",{cx:"12",cy:"8",r:"3"}),n.jsx("path",{d:"M6 20v-2a6 6 0 0 1 12 0v2M5 9H3v6h2M19 9h2v6h-2"})]}),router:n.jsxs(n.Fragment,{children:[n.jsx("circle",{cx:"5",cy:"6",r:"2"}),n.jsx("circle",{cx:"19",cy:"6",r:"2"}),n.jsx("circle",{cx:"12",cy:"18",r:"2"}),n.jsx("path",{d:"m7 7 4 9M17 7l-4 9M7 6h10"})]}),hermes:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"M12 3 5 7v5c0 4.7 2.8 7.5 7 9 4.2-1.5 7-4.3 7-9V7Z"}),n.jsx("path",{d:"M9 9h6M9 13h6M12 9v7"})]}),claude:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4"}),n.jsx("circle",{cx:"12",cy:"12",r:"4"})]}),media:n.jsxs(n.Fragment,{children:[n.jsx("rect",{x:"3",y:"5",width:"18",height:"14",rx:"2"}),n.jsx("path",{d:"m10 9 5 3-5 3Z"})]}),document:n.jsxs(n.Fragment,{children:[n.jsx("path",{d:"M6 3h8l4 4v14H6Z"}),n.jsx("path",{d:"M14 3v5h5M9 12h6M9 16h6"})]})};return n.jsx("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:t[e]})}function Nn(){const e=o.useRef(null),[t,i]=o.useState({x:0,y:0}),a=o.useRef(null),s=m=>{if(m.button!==0||window.innerWidth<=760||m.target.closest("button"))return;const u=e.current;u&&(a.current={pointerId:m.pointerId,startX:m.clientX,startY:m.clientY,base:t,rect:u.getBoundingClientRect()},m.currentTarget.setPointerCapture(m.pointerId),document.body.classList.add("hud-dragging"))},p=m=>{const u=a.current;if(!u||u.pointerId!==m.pointerId)return;const v=8,h=m.clientX-u.startX,x=m.clientY-u.startY,y=Math.min(window.innerWidth-v-u.rect.right,Math.max(v-u.rect.left,h)),d=Math.min(window.innerHeight-v-u.rect.bottom,Math.max(v-u.rect.top,x));i({x:u.base.x+y,y:u.base.y+d})},c=m=>{var u;((u=a.current)==null?void 0:u.pointerId)===m.pointerId&&(a.current=null,document.body.classList.remove("hud-dragging"),m.currentTarget.hasPointerCapture(m.pointerId)&&m.currentTarget.releasePointerCapture(m.pointerId))};return{panelRef:e,offset:t,resetPosition:()=>i({x:0,y:0}),dragHandleProps:{onPointerDown:s,onPointerMove:p,onPointerUp:c,onPointerCancel:c}}}function Hn({title:e,code:t,children:i,drag:a,minimized:s,active:p,className:c="",onActivate:m,onClose:u,onToggleMinimize:v}){return s?null:n.jsxs("aside",{ref:a.panelRef,className:`os-window draggable-panel ${s?"is-minimized":""} ${p?"is-active":""} ${c}`,style:{transform:`translate3d(${a.offset.x}px, ${a.offset.y}px, 0)`},"aria-label":e,onPointerDown:m,children:[n.jsxs("div",{className:"os-window-head panel-drag-handle",...a.dragHandleProps,onDoubleClick:a.resetPosition,onWheel:h=>{window.innerWidth<=760||h.deltaY<24||(h.preventDefault(),h.stopPropagation(),v())},children:[n.jsxs("div",{className:"os-window-title",children:[n.jsx("span",{children:t}),n.jsx("b",{children:e})]}),n.jsxs("div",{className:"panel-actions",children:[n.jsx("button",{type:"button","aria-label":`Thu nhỏ ${e}`,onClick:v,children:n.jsx(D,{name:"minimize"})}),n.jsx("button",{type:"button","aria-label":`Đóng ${e}`,onClick:u,children:n.jsx(D,{name:"close"})})]})]}),n.jsx("div",{className:"os-window-body",children:i})]})}function lt({label:e,url:t,online:i}){const[a,s]=o.useState(!1);return n.jsxs("div",{className:"native-dashboard-stage",children:[!a&&n.jsxs("div",{className:"native-dashboard-loader",role:"status",children:[n.jsx("i",{className:i?"online":"offline"}),n.jsx("b",{children:i?`Đang mở ${e}`:`${e} chưa sẵn sàng`}),n.jsx("span",{children:i?"Đang nối phiên local được bảo vệ…":"Kiểm tra dịch vụ Ubuntu rồi thử lại."})]}),t&&n.jsx("iframe",{className:"native-dashboard-frame",src:t,title:`${e} native dashboard`,onLoad:()=>s(!0)})]})}function ue(){return`${Date.now()}-${Math.random().toString(16).slice(2)}`}const Me=[{id:"gateway",code:"DOC-01",title:"Gateway Protocol",summary:"Luồng kết nối an toàn của J-Core.",sections:[["ROUTE","Mọi yêu cầu AI đi qua HTTPS Gateway; trình duyệt không gọi trực tiếp upstream."],["AUTH","Gateway token được gửi bằng header và không hiển thị trong log giao diện."],["HEALTH","Dùng Terminal với lệnh scan để kiểm tra Gateway, Hermes, OpenClaw và 9Router."]]},{id:"shortcuts",code:"DOC-02",title:"Operator Shortcuts",summary:"Bản đồ điều khiển nhanh cửa sổ.",sections:[["ALT + 1…7","Mở System, Chat, Terminal, Agents, Router, Gateway và Intel Library."],["DRAG","Kéo thanh tiêu đề để di chuyển; nhấp đúp thanh tiêu đề để trả về vị trí gốc."],["MOBILE","Trên màn hình nhỏ, cửa sổ tự khóa vào vùng an toàn để tránh thao tác nhầm."]]},{id:"defense",code:"DOC-03",title:"Defense Rules",summary:"Quy tắc vận hành hacker có trách nhiệm.",sections:[["SCOPE","Chỉ kiểm thử hệ thống, tài khoản và dữ liệu mà operator được phép truy cập."],["SECRETS","Không dán token, mật khẩu hoặc khóa riêng tư vào video, chat hay tài liệu công khai."],["TERMINAL","Terminal mặc định dùng allowlist; Private Ubuntu shell chỉ bật khi Gateway cho phép."]]},{id:"mission",code:"DOC-04",title:"Mission Playbook",summary:"Quy trình xử lý một tín hiệu mới.",sections:[["01 / OBSERVE","Thu thập trạng thái và ghi nhận dấu hiệu mà không làm thay đổi hệ thống."],["02 / VERIFY","Đối chiếu nguồn, kiểm tra health và xác nhận phạm vi được phép."],["03 / ACT","Thực hiện thay đổi nhỏ, có thể hoàn tác và kiểm tra lại sau mỗi bước."]]}];function to(e){var i;const t=e.trim();if(/^[a-zA-Z0-9_-]{11}$/.test(t))return t;try{const a=new URL(t),s=a.hostname.replace(/^www\./,"");let p="";return s==="youtu.be"&&(p=a.pathname.split("/").filter(Boolean)[0]||""),(s.endsWith("youtube.com")||s.endsWith("youtube-nocookie.com"))&&(p=a.searchParams.get("v")||((i=a.pathname.match(/\/(?:embed|shorts)\/([a-zA-Z0-9_-]{11})/))==null?void 0:i[1])||""),/^[a-zA-Z0-9_-]{11}$/.test(p)?p:null}catch{return null}}function io(e){return e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/[^a-z0-9?\s]/g," ").replace(/\s+/g," ").trim()}function ao(e){const t=e.trim(),i=io(t),a=i?i.split(" "):[];return i?Wr.test(i)||Zr.test(i)||t.includes("?")&&a.length>=4?!0:Xr.has(i)||a.length<=3||/^(troi oi|haiz|haz|met nhi|chan nhi|thoi ke|sao cung duoc|biet the nao|khong biet nua)\b/.test(i)||/\b(sao minh|sao toi|sao t|tai sao minh|tai sao toi)\b.*\b(the|vay|nhi|ha)\b/.test(i)?!1:a.length>=9&&/\b(can|muon|phai|nen|lam|xem|kiem|tim|sua|hoc|viet)\b/.test(i):!1}function ro(){try{const e=localStorage.getItem(Jn);return e?JSON.parse(e):null}catch{return null}}function oo({currentTime:e,data:t,palette:i,updateData:a,onActivityChange:s,onPaletteChange:p,onResetView:c,coreMinimized:m,onCoreMinimizedChange:u}){var Ft,Jt,Yt,Wt,Zt,Xt,Qt,ni,ei;const v=Ee(t).sameOrigin,h=o.useMemo(()=>typeof window>"u"?null:ro(),[]),{connections:x}=ki(),[y,d]=o.useState(""),[l,f]=o.useState(()=>{var r;return(r=h==null?void 0:h.messages)!=null&&r.length?h.messages:[{id:ue(),role:"assistant",text:"Giao diện J-Core đã sẵn sàng. Đang kiểm tra kết nối Gateway và Hermes.",at:Date.now()}]}),[T,S]=o.useState((h==null?void 0:h.voiceReply)??!0),[A,P]=o.useState((h==null?void 0:h.voiceStyle)??"female"),[U,Y]=o.useState((h==null?void 0:h.handsFree)??!1),[B,j]=o.useState((h==null?void 0:h.advisorMode)??!0),[C,R]=o.useState(!1),[O,k]=o.useState({stt:!1,tts:!1}),[E,$]=o.useState(!1),[F,tn]=o.useState(()=>typeof window<"u"&&window.innerWidth>760),[an,mn]=o.useState(()=>typeof window<"u"&&window.innerWidth>980),[bn,M]=o.useState(!1),[pn,vn]=o.useState(!1),[Pn,Gn]=o.useState(!1),[Yn,Wn]=o.useState(!1),[Zn,Xn]=o.useState(!1),[w,z]=o.useState(!1),[Z,rn]=o.useState(!1),[Tn,on]=o.useState(!1),[Sn,ut]=o.useState(!1),[Re,Le]=o.useState(!1),[xt,mt]=o.useState(!1),[bt,vt]=o.useState(!1),[ft,yt]=o.useState(!1),[wt,He]=o.useState(!1),[kt,De]=o.useState(!1),[jt,Nt]=o.useState(!1),[Ct,Pe]=o.useState(!1),[Mn,fn]=o.useState(null),[Ge,Qn]=o.useState(()=>((h==null?void 0:h.hubArtifacts)??[]).map(r=>r.status==="loading"?ci(r,"Phiên xử lý trước đã bị gián đoạn."):r)),[Be,be]=o.useState(()=>{var r,g;return(h==null?void 0:h.activeHubId)??((g=(r=h==null?void 0:h.hubArtifacts)==null?void 0:r[0])==null?void 0:g.id)??null}),[yn,en]=o.useState("chat"),[hn,Bn]=o.useState("youtube"),[ve,Ei]=o.useState("gateway"),[Tt,zi]=o.useState("https://www.youtube.com/watch?v=ciNHn38EyRc"),[Ue,Ii]=o.useState("ciNHn38EyRc"),[_e,$e]=o.useState(""),[Ve,qe]=o.useState(""),[On,St]=o.useState("local"),[Ke,ne]=o.useState(!1),[Oi,Mt]=o.useState(["J-CORE LOCAL CONSOLE // không API","Phiên này điều khiển giao diện local; file Ubuntu mở bằng quyền thư mục của trình duyệt.","Gõ 'files' để kết nối Ubuntu, hoặc 'help' để xem lệnh."]),[gn,fe]=o.useState(null),[At,Un]=o.useState(!1),[cn,X]=o.useState("idle"),[Fe,V]=o.useState(""),[ee,Et]=o.useState(!1),[te,_n]=o.useState("idle"),[Ri,ie]=o.useState(""),[ye,zt]=o.useState(null),[Je,It]=o.useState(((Ft=t.endpoints)==null?void 0:Ft.gateway)||""),[Ye,We]=o.useState(((Jt=t.endpoints)==null?void 0:Jt.gatewayToken)||""),[Ze,Ot]=o.useState(()=>La()),[Rt,Li]=o.useState(!1),[wn,Lt]=o.useState(null),[Xe,Hi]=o.useState(()=>{var g;const r=(g=t==null?void 0:t.ai)==null?void 0:g.hermesProfile;return r||br()}),[ho,Di]=o.useState(me),[un,Pi]=o.useState({hermes:{...mi},claude:{...mi}}),ae=Ra(t),Gi=Oa,we=o.useRef(null),Ht=o.useRef(null),$n=o.useRef(null),re=o.useRef(!1),Rn=o.useRef(!1),Qe=o.useRef(!1),nt=o.useRef("idle"),et=o.useRef(!1),ke=o.useRef(!1),oe=o.useRef(null),se=o.useRef(null),Ln=o.useRef(null),Dt=o.useRef(null),Pt=o.useRef(null),ce=Nn(),le=Nn(),de=Nn(),Bi=Nn(),Ui=Nn(),_i=Nn(),$i=Nn(),Vi=Nn(),qi=Nn(),Ki=Nn(),tt=o.useCallback((r,g)=>{window.innerWidth<=760||r.deltaY<24||(r.preventDefault(),r.stopPropagation(),g())},[]);o.useEffect(()=>{localStorage.setItem(Jn,JSON.stringify({messages:l,palette:i,voiceReply:T,voiceStyle:A,handsFree:U,advisorMode:B,hubArtifacts:Ge,activeHubId:Be}))},[Be,B,U,Ge,l,i,T,A]),o.useEffect(()=>s(cn),[cn,s]),o.useEffect(()=>{i!=="spider"||Xe==="ev-personal"||(Hi("ev-personal"),fr("ev-personal"),a({ai:{...t.ai||{},hermesProfile:"ev-personal"}}))},[i]),o.useEffect(()=>{var r,g;It(((r=t.endpoints)==null?void 0:r.gateway)||""),We(((g=t.endpoints)==null?void 0:g.gatewayToken)||"")},[(Yt=t.endpoints)==null?void 0:Yt.gateway,(Wt=t.endpoints)==null?void 0:Wt.gatewayToken]),o.useEffect(()=>{let r=!0;return sn(t,"/api/hermes/voice/capabilities",{method:"GET",timeoutMs:5e3}).then(g=>{var b,N;r&&k({stt:!!((b=g==null?void 0:g.stt)!=null&&b.configured),tts:!!((N=g==null?void 0:g.tts)!=null&&N.configured)})}).catch(()=>{r&&k({stt:!1,tts:!1})}),()=>{r=!1}},[(Zt=t.endpoints)==null?void 0:Zt.gateway,(Xt=t.endpoints)==null?void 0:Xt.gatewayToken]),o.useEffect(()=>{let r=!0;return sn(t,"/api/native-dashboards",{method:"GET",credentials:"include",timeoutMs:5e3}).then(g=>{r&&(g!=null&&g.dashboards)&&Lt(g.dashboards)}).catch(()=>{r&&Lt(null)}),()=>{r=!1}},[(Qt=t.endpoints)==null?void 0:Qt.gateway,(ni=t.endpoints)==null?void 0:ni.gatewayToken]),o.useEffect(()=>{nt.current=cn},[cn]),o.useEffect(()=>{re.current=C},[C]),o.useEffect(()=>{var r;(r=Dt.current)==null||r.scrollIntoView({behavior:"smooth"})},[l]),o.useEffect(()=>{if(!Fe)return;const r=window.setTimeout(()=>V(""),2400);return()=>window.clearTimeout(r)},[Fe]),o.useEffect(()=>()=>{var r,g,b,N,I,L;se.current&&window.clearTimeout(se.current),Ln.current&&window.clearTimeout(Ln.current),(r=oe.current)==null||r.abort(),(b=(g=we.current)==null?void 0:g.abort)==null||b.call(g),(N=Ht.current)==null||N.pause(),(I=$n.current)==null||I.close(1e3,"j-core-unmounted"),(L=window.speechSynthesis)==null||L.cancel()},[]);const pe=(r=520)=>{!re.current||!U||(Ln.current&&window.clearTimeout(Ln.current),Ln.current=window.setTimeout(()=>{Gt()},B?Math.max(r,1700):r))},Fi=r=>{se.current&&window.clearTimeout(se.current),X("speaking");const g=Date.now(),b=Math.min(5600,Math.max(2400,r.length*42)),N=()=>{const L=Math.max(300,b-(Date.now()-g));se.current=window.setTimeout(()=>{X("idle"),pe()},L)};if(!T){N();return}const I=()=>{if(!("speechSynthesis"in window)){N();return}window.speechSynthesis.cancel();const L=new SpeechSynthesisUtterance(r);L.lang="vi-VN",L.voice=eo(A),L.rate=A==="female"?.98:.9,L.pitch=A==="female"?1.02:.78,L.onend=N,L.onerror=N,window.speechSynthesis.speak(L)};if(!O.tts){I();return}ai(t,"/api/hermes/voice/synthesize",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({text:r,voice:A==="female"?"female":"male"}),timeoutMs:6e4}).then(L=>L.blob()).then(L=>{const H=new Audio(URL.createObjectURL(L));return Ht.current=H,H.onended=()=>{URL.revokeObjectURL(H.src),N()},H.onerror=()=>{URL.revokeObjectURL(H.src),I()},H.play()}).catch(I)},Vn=async(r=y,g="text")=>{var K,J;const b=r.trim();if(!b&&!gn||ee)return;if(g==="voice"&&B&&!ao(b)){d(""),X("idle"),V("Đã nghe, chưa cần phản hồi."),pe(1500);return}const N=b||`Đã ghim ${(gn==null?void 0:gn.name)??"tệp"}.`,I=oi(N),L={id:ue(),role:"user",text:N,at:Date.now()},H=[...l,L].slice(-30);f(W=>[...W,L].slice(-80)),d(""),fe(null),tn(!0),X("thinking"),Et(!0),I&&(Qn(W=>[...W,I].slice(-8)),be(I.id),Le(!0),Pe(!1),en("workspace")),(K=oe.current)==null||K.abort();const q=new AbortController;oe.current=q;try{const ln=await sn(t,"/api/hermes/chat",{method:"POST",timeoutMs:6e4,signal:q.signal,body:JSON.stringify({profile:Xe,message:N,messages:H.map(G=>({role:G.role,content:G.text})),operator:(t==null?void 0:t.username)||"Operator",attachment:gn?{name:gn.name,type:gn.type,size:gn.size}:null,clientCapabilities:{responseMode:"jarvis-hub",hubKinds:In.map(G=>G.kind),structuredArtifacts:!0}})}),dn=ri(ln);if(ln.source==="mock")throw new Error(dn||"Chưa có AI upstream nào được cấu hình trên gateway.");if(!dn)throw new Error("AI upstream phản hồi nhưng không có nội dung.");const jn={id:ue(),role:"assistant",text:dn,at:Date.now()};f(G=>[...G,jn].slice(-80)),I&&Qn(G=>G.map(An=>An.id===I.id?si(An,dn,ln):An)),Fi(jn.text)}catch(W){if(q.signal.aborted)return;const ln=W instanceof Error?W.message:"Không thể kết nối AI upstream.",dn=(W==null?void 0:W.requestId)||((J=W==null?void 0:W.details)==null?void 0:J.requestId),jn={id:ue(),role:"assistant",text:`AI link đang lỗi: ${ln}${dn?` · Trace ${dn}`:""}`,at:Date.now()};f(G=>[...G,jn].slice(-80)),I&&Qn(G=>G.map(An=>An.id===I.id?ci(An,ln):An)),X("idle"),V("Không thể nhận phản hồi từ AI upstream."),pe(1800)}finally{oe.current===q&&(oe.current=null),Et(!1)}},Ji=r=>{r.preventDefault(),Vn()},Yi=()=>{var r;return(r=Pt.current)==null?void 0:r.click()},Wi=r=>{var b;const g=(b=r.target.files)==null?void 0:b[0];if(g){if(g.size>15*1024*1024){V("Tệp vượt quá giới hạn 15 MB."),r.target.value="";return}fe(g),V(`Đã ghim ${g.name}.`)}},Zi=async()=>{var g,b;if(!((g=navigator.mediaDevices)!=null&&g.getDisplayMedia)){V("Trình duyệt này chưa hỗ trợ chia sẻ màn hình.");return}let r=null;try{r=await navigator.mediaDevices.getDisplayMedia({video:!0,audio:!1});const N=document.createElement("video");N.srcObject=r,N.muted=!0,N.playsInline=!0,await new Promise(H=>{N.onloadedmetadata=()=>H()}),await N.play();const I=document.createElement("canvas");I.width=N.videoWidth,I.height=N.videoHeight,(b=I.getContext("2d"))==null||b.drawImage(N,0,0);const L=await new Promise(H=>I.toBlob(H,"image/png"));if(!L)throw new Error("capture-failed");fe(new File([L],`screen-${Date.now()}.png`,{type:"image/png"})),V("Đã chụp màn hình và ghim vào chat.")}catch(N){const I=N instanceof DOMException?N.name:"";V(I==="NotAllowedError"||I==="AbortError"?"Đã hủy chia sẻ màn hình.":"Không thể chụp màn hình.")}finally{r==null||r.getTracks().forEach(N=>N.stop())}};async function Xi(){var jn;if(!((jn=navigator.mediaDevices)!=null&&jn.getUserMedia)||!("MediaRecorder"in window))return!1;const r=await navigator.mediaDevices.getUserMedia({audio:!0});Qe.current=!0;const g=["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus"].find(G=>MediaRecorder.isTypeSupported(G)),b=new MediaRecorder(r,g?{mimeType:g}:void 0),N=[],I=new AudioContext,L=I.createAnalyser();L.fftSize=512,I.createMediaStreamSource(r).connect(L);const H=new Uint8Array(L.fftSize);let q=!1,K=!1,J=Date.now();const W=Date.now(),ln=window.setInterval(()=>{L.getByteTimeDomainData(H);let G=0;for(const qn of H)G+=Math.abs(qn-128);G/H.length>4.2&&(K=!0,J=Date.now());const Ne=Date.now()-W;b.state==="recording"&&(Ne>2e4||K&&Ne>1400&&Date.now()-J>950)&&b.stop()},100),dn=()=>{window.clearInterval(ln),r.getTracks().forEach(G=>G.stop()),I.close(),Rn.current=!1,Un(!1)};return b.ondataavailable=G=>{G.data.size&&N.push(G.data)},b.onstart=()=>{Rn.current=!0,Un(!0),X("listening")},b.onerror=()=>{dn(),X("idle"),V("Không thể ghi âm giọng nói local.")},b.onstop=async()=>{if(dn(),q||!N.length){X("idle");return}X("thinking");try{const G=new Blob(N,{type:b.mimeType||"audio/webm"}),Ne=await(await ai(t,"/api/hermes/voice/transcribe",{method:"POST",headers:{"content-type":G.type},body:G,timeoutMs:6e4})).json(),qn=String(Ne.transcript||"").trim();ke.current=!!qn,d(qn),qn?await Vn(qn,"voice"):(X("idle"),V("Hermes STT chưa nhận được nội dung tiếng Việt."),pe(900))}catch(G){X("idle"),V(G instanceof Error?G.message:"Hermes STT không phản hồi.")}},we.current={stop:()=>{b.state==="recording"&&b.stop()},abort:()=>{q=!0,b.state==="recording"&&b.stop()}},b.start(250),!0}async function Gt(){var b;if(O.stt)try{return await Xi()}catch{return V("Không mở được microphone cho Hermes STT."),X("idle"),!1}const r=window.SpeechRecognition||window.webkitSpeechRecognition;if(!r){V("Trình duyệt này chưa hỗ trợ nhận giọng nói. Hãy dùng Chrome hoặc Edge.");return}if(Rn.current||nt.current==="thinking"||nt.current==="speaking")return;if(!Qe.current&&((b=navigator.mediaDevices)!=null&&b.getUserMedia))try{(await navigator.mediaDevices.getUserMedia({audio:!0})).getTracks().forEach(I=>I.stop()),Qe.current=!0}catch{re.current=!1,R(!1),V("Microphone đang bị chặn. Hãy cấp quyền cho trang rồi bật Voice lại.");return}et.current=!1,ke.current=!1;const g=new r;g.lang="vi-VN",g.interimResults=!1,g.continuous=!1,g.onstart=()=>{Rn.current=!0,Un(!0),X("listening")},g.onend=()=>{if(Rn.current=!1,Un(!1),et.current){X("idle");return}ke.current||(X(N=>N==="listening"?"idle":N),pe(700))},g.onerror=()=>{Rn.current=!1,Un(!1),X("idle"),V("Không thể truy cập microphone.")},g.onresult=N=>{var L,H,q;const I=((q=(H=(L=N.results)==null?void 0:L[0])==null?void 0:H[0])==null?void 0:q.transcript)||"";ke.current=!0,d(I),I&&Vn(I,"voice")},we.current=g;try{g.start()}catch{Rn.current=!1}}const Qi=()=>{var r,g;et.current=!0,Ln.current&&window.clearTimeout(Ln.current),(g=(r=we.current)==null?void 0:r.stop)==null||g.call(r),R(!1),Un(!1),X("idle")},Bt=async()=>{if(re.current||At){Qi();return}R(!0),re.current=!0,V("Chế độ giọng nói đã bật. J-Core sẽ tiếp tục nghe sau mỗi câu."),await Gt()},Ut=async()=>{await navigator.clipboard.writeText(l.map(r=>`${r.role==="user"?"User":"J-Core"}: ${r.text}`).join(`
`)),V("Đã copy lịch sử chat.")},_t=()=>{var r;(r=window.speechSynthesis)==null||r.cancel(),X("idle"),f([{id:ue(),role:"assistant",text:"Lịch sử đã được xóa. J-Core đang kiểm tra lại kết nối gateway.",at:Date.now()}])},na=async()=>{_n("testing"),ie("Đang kiểm tra Gateway và các dịch vụ nội bộ..."),zt(null);const r=Ye.trim().replace(/^Bearer\s+/i,""),g={...t.endpoints,gateway:Je.trim(),gatewayToken:r};a({endpoints:g}),Ie(r,Ze);try{const b=await sn({...t,endpoints:g},"/health",{method:"GET",timeoutMs:7e3});_n("success"),zt(b),ie("Gateway đã xác thực. Trạng thái dịch vụ được cập nhật bên dưới."),V("Gateway đã kết nối.")}catch(b){_n("error");const N=(b==null?void 0:b.status)===401?"Jarvis token bị Gateway từ chối. Kiểm tra token đang chạy trên Ubuntu.":(b==null?void 0:b.message)||"Không thể kết nối Gateway.";ie(N),V(N)}},ea=()=>{Ha(),We(""),Ot(!1),_n("idle"),ie(""),a({endpoints:{...t.endpoints,gateway:Je.trim(),gatewayToken:""}}),V("Đã xóa Jarvis token khỏi trình duyệt.")},kn=(r,g)=>{Pi(b=>({...b,[r]:{...b[r],...g}}))},$t=async r=>{kn(r,{state:"loading",error:""});try{const[g,b]=await Promise.all([sn(t,r==="hermes"?"/api/hermes/capabilities":"/api/claude/capabilities",{method:"GET",timeoutMs:7e3}),r==="hermes"?sn(t,"/api/hermes/profiles",{method:"GET",timeoutMs:7e3}).catch(()=>null):Promise.resolve(null)]);b!=null&&b.profiles&&Di(vr(b.profiles)),kn(r,{state:"ready",overview:g,error:""})}catch(g){kn(r,{state:"error",error:(g==null?void 0:g.message)||`Không thể đọc trạng thái ${r}.`})}},Vt=r=>{en(r),fn(r),r==="hermes"?(rn(!0),He(!1)):(on(!0),De(!1)),(un[r].state==="idle"||un[r].state==="error")&&$t(r)},ta=async r=>{const g=un[r].prompt.trim();if(!(!g||un[r].sending)){kn(r,{sending:!0,reply:""});try{const b=await sn(t,`/api/${r}/chat`,{method:"POST",timeoutMs:6e4,body:JSON.stringify({message:g,messages:[{role:"user",content:g}],operator:(t==null?void 0:t.username)||"Operator",...r==="hermes"?{profile:Xe}:{}})});kn(r,{sending:!1,reply:ri(b)||`${r} đã phản hồi nhưng không có nội dung văn bản.`})}catch(b){kn(r,{sending:!1,reply:(b==null?void 0:b.message)||`Không thể gửi test tới ${r}.`})}}},ia=async()=>{try{await fetch("/api/auth/logout",{method:"POST",credentials:"include"})}finally{window.location.reload()}},aa=async(r,g)=>{if(!un[r].sending){kn(r,{sending:!0,reply:""});try{const b=await sn(t,"/api/system/dashboard-command",{method:"POST",timeoutMs:35e3,body:JSON.stringify({service:r,action:g})});kn(r,{sending:!1,reply:b.output||JSON.stringify(b,null,2)})}catch(b){kn(r,{sending:!1,reply:(b==null?void 0:b.message)||`Khong the chay ${r} ${g}.`})}}},ra=r=>{a({endpoints:{...t.endpoints,nineRouterModel:r}}),V(`9Router model: ${r}`)},oa=o.useMemo(()=>{const r=q=>{var W;const K=q.toLowerCase().replace(/[^a-z0-9]/g,""),J=Object.keys(x.services||{}).find(ln=>ln.toLowerCase().replace(/[^a-z0-9]/g,"")===K);return J?(W=x.services)==null?void 0:W[J]:null},g=(q,K)=>{var jn;const J=r(q);if(!J)return K;const W=Number.isFinite(J.latencyMs)?`${J.latencyMs}ms`:null,ln=(jn=J.circuit)!=null&&jn.state&&J.circuit.state!=="closed"?`circuit ${J.circuit.state}`:null,dn=J.status?`HTTP ${J.status}`:null;return[W,ln,dn,K].filter(Boolean).join(" · ")},b=(q,K)=>{const J=r(q);return J?!!J.online&&J.configured!==!1:K},N=[Number.isFinite(x.latencyMs)?`${x.latencyMs}ms`:null,x.requestId?`req: ${x.requestId.slice(0,8)}`:null,v?"PHIÊN DỰ ÁN TỰ ĐỘNG":"LOCAL PREVIEW"].filter(Boolean).join(" · "),I=[{label:"CỔNG KẾT NỐI",value:x.gateway?"TRỰC TUYẾN":"NGẮT KẾT NỐI",detail:N,tone:x.gateway?"online":"offline"},{label:"HERMES",value:b("hermes",x.hermes)?"AI SẴN SÀNG":"NGẮT KẾT NỐI",detail:g("hermes","Bộ điều phối hội thoại"),tone:b("hermes",x.hermes)?"online":"offline"},{label:"OPENCLAW",value:b("openclaw",x.openclaw)?"TRỰC TUYẾN":"NGẮT KẾT NỐI",detail:g("openclaw","Đội tác nhân chuyên môn"),tone:b("openclaw",x.openclaw)?"online":"offline"},{label:"9ROUTER",value:b("nineRouter",x.nineRouter)?"TRỰC TUYẾN":"NGẮT KẾT NỐI",detail:g("nineRouter",`Mô hình ${ae}`),tone:b("nineRouter",x.nineRouter)?"online":"offline"},{label:"CLAUDE",value:b("claude",x.claude)?"AI SẴN SÀNG":"NGẮT KẾT NỐI",detail:g("claude","Cầu nối suy luận"),tone:b("claude",x.claude)?"online":"offline"}],L=new Set(["hermes","openclaw","ninerouter","claude"]),H=Object.entries(x.services||{}).filter(([q])=>!L.has(q.toLowerCase().replace(/[^a-z0-9]/g,""))).map(([q,K])=>({label:q.toUpperCase().replace(/_/g," "),value:K.online&&K.configured!==!1?"TRỰC TUYẾN":"NGẮT KẾT NỐI",detail:[Number.isFinite(K.latencyMs)?`${K.latencyMs}ms`:null,K.configured===!1?"Chưa cấu hình":"Gateway service",K.status?`HTTP ${K.status}`:null].filter(Boolean).join(" · "),tone:K.online&&K.configured!==!1?"online":"offline"}));return[...I,...H,{label:"GIỌNG NÓI",value:C?"ĐANG NGHE":"SẴN SÀNG",detail:`${Se[A]} · ${B?"lọc câu vu vơ":"phản hồi mọi câu"}`,tone:"online"},{label:"CHẾ ĐỘ LÕI",value:ct[i].toUpperCase(),detail:"Màu và cấu trúc 3D độc lập",tone:"online"},{label:"BỘ NHỚ",value:`${l.length} BẢN GHI`,detail:"Lưu cục bộ trong trình duyệt",tone:"online"}]},[B,x,l.length,ae,i,v,C,A]),Q=r=>{const g=Array.isArray(r)?r:[r];Mt(b=>[...b,...g].slice(-80))},xn=o.useCallback(r=>{en(r),r in st&&fn(r),r==="core"&&u(!1),r==="system"&&(mn(!0),vn(!1)),r==="chat"&&(tn(!0),M(!1)),r==="settings"&&($(!0),Gn(!1)),r==="terminal"&&(Wn(!0),mt(!1)),r==="agents"&&(Xn(!0),vt(!1)),r==="router"&&(z(!0),yt(!1)),r==="hermes"&&(rn(!0),He(!1)),r==="claude"&&(on(!0),De(!1)),r==="intel"&&(ut(!0),Nt(!1)),r==="workspace"&&(Le(!0),Pe(!1))},[u]),qt=o.useCallback(()=>{fn(null)},[]),sa=o.useCallback(r=>{const g=Fn(r),b=oi(`${g.label} Hub`,r);if(!b)return;const N=si(b,`${g.description}. Mẫu giao diện đã được nạp và đang chờ Jarvis truyền dữ liệu vào.`,{results:Ja(r)});Qn(I=>[...I,N].slice(-8)),be(N.id)},[]),ca=o.useCallback(r=>{Qn(g=>{const b=g.filter(N=>N.id!==r);return be(N=>{var I;return N===r?((I=b[b.length-1])==null?void 0:I.id)??null:N}),b})},[]),je=o.useMemo(()=>Me.find(r=>r.id===ve)||Me[0],[ve]),la=r=>{r.preventDefault();const g=to(Tt);if(!g){$e("URL không hợp lệ. Hãy dán link YouTube, Shorts hoặc video ID gồm 11 ký tự.");return}Ii(g),$e("")},da=async()=>{const r=$n.current;if(r&&r.readyState<=WebSocket.OPEN){r.close(1e3,"operator-disconnect");return}if(!Ke){ne(!0);try{const g=await sn(t,"/api/system/terminal/session",{method:"POST",timeoutMs:1e4}),{gateway:b}=Ee(t),N=new URL(b);N.protocol=N.protocol==="https:"?"wss:":"ws:",N.pathname=String(g.websocketPath||"/ws/terminal"),N.search=new URLSearchParams({ticket:String(g.ticket||"")}).toString();const I=new WebSocket(N.toString());$n.current=I,I.onopen=()=>{St("pty"),ne(!1),Q("PRIVATE UBUNTU PTY // connected with one-time ticket // audited session")},I.onmessage=L=>{try{const H=JSON.parse(String(L.data));if(H.type==="output"){const q=String(H.data||"").replace(/\u001b\[[0-?]*[ -/]*[@-~]/g,"");Q(q.split(/\r?\n/).filter(Boolean))}H.type==="ready"&&Q(`session ${H.sessionId} ready · expires ${H.expiresInSeconds}s`),H.type==="error"&&Q(`PTY ERROR: ${H.message||"unknown error"}`),H.type==="exit"&&Q(`[PTY EXIT ${H.code??"?"}]`)}catch{Q(String(L.data))}},I.onerror=()=>{ne(!1),Q("PTY CONNECTION FAILED // kiểm tra private mode và tunnel WebSocket.")},I.onclose=L=>{$n.current=null,St("local"),ne(!1),Q(`PTY DISCONNECTED${L.reason?` // ${L.reason}`:""}`)}}catch(g){ne(!1),Q(`PTY UNAVAILABLE: ${g instanceof Error?g.message:"unknown error"}`)}}},pa=async r=>{var I;r.preventDefault();const g=Ve.trim();if(!g)return;const[b,...N]=g.toLowerCase().split(/\s+/);if(On==="pty"&&((I=$n.current)==null?void 0:I.readyState)===WebSocket.OPEN){$n.current.send(JSON.stringify({type:"input",data:`${g}
`})),qe("");return}if(Q(`operator@j-core:~$ ${g}`),qe(""),b==="clear"){Mt([]);return}if(b==="help"){Q(["help     danh sách lệnh local","files    mở Ubuntu Files trực tiếp","status   trạng thái phiên","open     mở dashboard","whoami   tài khoản hiện tại","date     thời gian local","clear    xóa màn hình"]);return}if(b==="files"){Bn("files"),xn("intel"),Q("Ubuntu Files opened // browser permission required once per mounted folder.");return}if(b==="status"||b==="scan"){Q(["session   AUTHENTICATED LOCAL","files     DIRECT ACCESS / NO API",`hermes    ${x.hermes?"READY":"OFFLINE"}`,`openclaw  ${x.openclaw?"ONLINE":"OFFLINE"}`,`9router   ${x.nineRouter?"ONLINE":"OFFLINE"}`,`claude    ${x.claude?"READY":"OFFLINE"}`]);return}if(b==="whoami"){Q(`${t.username||"Operator"} // authenticated local operator`);return}if(b==="date"){Q(new Date().toLocaleString("vi-VN"));return}if(b==="open"){const L=N[0]||"",H=L==="gateway"?"settings":L;["system","chat","agents","router","hermes","claude","settings","terminal","intel","workspace"].includes(H)?(xn(H),Q(`Window '${H}' opened.`)):Q("Unknown app. Use: system, chat, agents, router, hermes, claude, settings, intel.");return}Q("Lệnh shell hệ thống không được chạy từ website. Dùng 'files' để sửa dữ liệu Ubuntu local, hoặc mở Ubuntu Terminal của máy nếu cần thực thi lệnh.")};o.useEffect(()=>{const r=g=>{if(!g.altKey)return;const N={1:"system",2:"chat",3:"terminal",4:"agents",5:"router",6:"hermes",7:"claude",8:"settings",9:"intel",0:"workspace"}[g.key];N&&(g.preventDefault(),xn(N))};return window.addEventListener("keydown",r),()=>window.removeEventListener("keydown",r)},[xn]);const ha=()=>{!F||bn?(tn(!0),M(!1)):tn(!1),en("chat")},ga=()=>{!E||Pn?($(!0),Gn(!1)):$(!1),en("settings")},ua=()=>{!an||pn?(mn(!0),vn(!1)):mn(!1),en("system")},Kt=[m?{id:"core",label:"Lõi AI 3D",code:"CORE",icon:"hub"}:null,an&&pn?{id:"system",label:"System Monitor",code:"SYS",icon:"hub"}:null,F&&bn?{id:"chat",label:"Neural Chat",code:"CHAT",icon:"chat"}:null,Yn&&xt?{id:"terminal",label:"Ubuntu Terminal",code:"TERM",icon:"terminal"}:null,Zn&&bt?{id:"agents",label:"Agent Matrix",code:"AGNT",icon:"agents"}:null,w&&ft?{id:"router",label:"Router Matrix",code:"ROUT",icon:"router"}:null,Z&&wt?{id:"hermes",label:"Hermes Core",code:"HRMS",icon:"hermes"}:null,Tn&&kt?{id:"claude",label:"Claude Bridge",code:"CLDE",icon:"claude"}:null,Sn&&jt?{id:"intel",label:"Intel Library",code:"INTL",icon:"media"}:null,Re&&Ct?{id:"workspace",label:"Universal Workspace",code:"HUB",icon:"hub"}:null,E&&Pn?{id:"settings",label:"Gateway Settings",code:"GATE",icon:"settings"}:null].filter(r=>!!r);if(i==="spider")return n.jsx(Br,{currentTime:e,username:(t==null?void 0:t.username)||"Operator",connections:x,messages:l,isSending:ee,onAskEv:r=>void Vn(r),onExit:()=>p("gold"),onResetView:c});if(i==="world")return n.jsx(Vr,{currentTime:e,username:(t==null?void 0:t.username)||"Operator",messages:l,isSending:ee,onAskAi:r=>void Vn(r),onExit:()=>p("gold")});if(i==="javis")return n.jsx(Yr,{currentTime:e,username:(t==null?void 0:t.username)||"Operator",messages:l,isSending:ee,connections:x,nativeDashboards:wn,onAskAi:r=>void Vn(r),onExit:()=>p("gold")});const it=Mn==="agents"||Mn==="router"||Mn==="hermes";return n.jsxs("div",{className:`hud-overlay ${Mn?"is-dashboard-focus":""} ${it?"is-native-dashboard-focus":""}`,"data-focus-dashboard":Mn||void 0,"aria-label":"J-Core AI interface",children:[Mn&&it&&n.jsxs("button",{type:"button",className:"native-dashboard-back",onClick:qt,"aria-label":"Quay lại J-Core Hub",children:[n.jsx("span",{"aria-hidden":"true",children:"←"}),n.jsx("b",{children:"J-CORE"})]}),Mn&&!it&&n.jsxs("header",{className:"dashboard-focus-header",children:[n.jsxs("button",{type:"button",className:"dashboard-back",onClick:qt,"aria-label":"Quay lại J-Core Hub",children:[n.jsx("span",{"aria-hidden":"true",children:"←"}),n.jsx("b",{children:"J-CORE HUB"})]}),n.jsxs("div",{className:"dashboard-focus-title",children:[n.jsx("span",{children:st[Mn].eyebrow}),n.jsx("h1",{children:st[Mn].title})]}),n.jsxs("div",{className:"dashboard-local-session",children:[n.jsx("i",{}),n.jsx("span",{children:"LOCAL SESSION"}),n.jsx("time",{children:e})]})]}),n.jsxs("div",{className:`system-signal ${cn}`,"aria-hidden":"true",children:[n.jsx("i",{}),n.jsx("i",{}),n.jsx("i",{})]}),n.jsxs("nav",{className:"os-taskbar","aria-label":"J-Core OS taskbar",children:[n.jsxs("button",{className:`os-start ${m?"":"active"}`,type:"button","aria-label":m?"Khôi phục Lõi AI 3D":"Thu nhỏ Lõi AI 3D","aria-pressed":!m,onClick:()=>u(!m),children:[n.jsx("span",{children:"J"}),n.jsx("b",{children:"J-CORE OS"})]}),n.jsxs("div",{className:"os-app-strip",children:[n.jsxs("button",{className:an?"active":"",type:"button","aria-label":"Mở giám sát hệ thống",onClick:ua,children:[n.jsx(D,{name:"hub"}),n.jsx("span",{children:"Hệ thống"})]}),n.jsxs("button",{className:F?"active":"",type:"button","aria-label":"Mở trò chuyện",onClick:ha,children:[n.jsx(D,{name:"chat"}),n.jsx("span",{children:"Trò chuyện"})]}),n.jsxs("button",{className:Yn?"active":"",type:"button","aria-label":"Mở Terminal",onClick:()=>xn("terminal"),children:[n.jsx(D,{name:"terminal"}),n.jsx("span",{children:"Terminal"})]}),n.jsxs("button",{className:Zn?"active":"",type:"button","aria-label":"Mở ma trận tác nhân",onClick:()=>xn("agents"),children:[n.jsx(D,{name:"agents"}),n.jsx("span",{children:"Tác nhân"})]}),n.jsxs("button",{className:w?"active":"",type:"button","aria-label":"Mở bảng điều khiển 9Router",onClick:()=>xn("router"),children:[n.jsx(D,{name:"router"}),n.jsx("span",{children:"9Router"})]}),n.jsxs("button",{className:Z?"active":"",type:"button","aria-label":"Mở bảng điều khiển Hermes",onClick:()=>Vt("hermes"),children:[n.jsx(D,{name:"hermes"}),n.jsx("span",{children:"Hermes"})]}),n.jsxs("button",{className:Tn?"active":"",type:"button","aria-label":"Mở bảng điều khiển Claude",onClick:()=>Vt("claude"),children:[n.jsx(D,{name:"claude"}),n.jsx("span",{children:"Claude"})]}),n.jsxs("button",{className:Sn?"active":"",type:"button","aria-label":"Mở thư viện tình báo",onClick:()=>xn("intel"),children:[n.jsx(D,{name:"media"}),n.jsx("span",{children:"Thư viện"})]}),n.jsxs("button",{className:Re?"active":"",type:"button","aria-label":"Mở không gian làm việc",onClick:()=>xn("workspace"),children:[n.jsx(D,{name:"hub"}),n.jsx("span",{children:"Không gian"})]}),n.jsxs("button",{className:E?"active":"",type:"button","aria-label":"Mở cài đặt J-Core",onClick:ga,children:[n.jsx(D,{name:"settings"}),n.jsx("span",{children:"Cài đặt"})]})]}),n.jsxs("div",{className:"os-tray",children:[n.jsx("button",{type:"button","aria-label":"Reset góc nhìn lõi",onClick:c,children:n.jsx(D,{name:"reset"})}),n.jsx("span",{className:"online",children:"LOCAL SESSION"}),n.jsx("time",{children:e})]})]}),Kt.length>0&&n.jsxs("nav",{className:"os-minimized-dock","aria-label":"Cửa sổ đang thu nhỏ",children:[n.jsx("span",{children:"ĐÃ ẨN"}),Kt.map(r=>n.jsxs("button",{type:"button","aria-label":`Khôi phục ${r.label}`,title:`Khôi phục ${r.label}`,onClick:()=>xn(r.id),children:[n.jsx(D,{name:r.icon}),n.jsx("b",{children:r.code})]},r.id))]}),an&&!pn&&n.jsxs("aside",{ref:ce.panelRef,className:`activity-hub draggable-panel ${pn?"is-minimized":""} ${yn==="system"?"is-active":""}`,style:{transform:`translate3d(${ce.offset.x}px, ${ce.offset.y}px, 0)`},"aria-label":"Activity hub",onPointerDown:()=>en("system"),children:[n.jsxs("div",{className:"hub-title panel-drag-handle",...ce.dragHandleProps,onDoubleClick:ce.resetPosition,onWheel:r=>tt(r,()=>vn(!0)),children:[n.jsxs("div",{className:"hub-title-copy",children:[n.jsx("span",{children:"TRUNG TÂM ĐIỀU HÀNH"}),n.jsx("b",{children:cn==="speaking"?"ĐANG PHẢN HỒI":cn==="thinking"?"ĐANG PHÂN TÍCH":cn==="listening"?"ĐANG LẮNG NGHE":"SẴN SÀNG"})]}),n.jsxs("div",{className:"panel-actions hub-actions",children:[n.jsx("button",{type:"button","aria-label":"Thu nhỏ trung tâm điều hành",onClick:()=>vn(!0),children:n.jsx(D,{name:"minimize"})}),n.jsx("button",{type:"button","aria-label":"Đóng trung tâm điều hành",onClick:()=>mn(!1),children:n.jsx(D,{name:"close"})})]})]}),n.jsxs("div",{className:"hub-orbit-map","aria-hidden":"true",children:[n.jsx("i",{}),n.jsx("i",{}),n.jsx("i",{}),n.jsx("b",{})]}),n.jsx("div",{className:"hub-modules",children:oa.map(r=>n.jsxs("section",{className:`hub-module ${r.tone||""}`,children:[n.jsx("span",{children:r.label}),n.jsx("b",{children:r.value}),n.jsx("p",{children:r.detail})]},r.label))})]}),F&&!bn&&n.jsxs("aside",{ref:le.panelRef,className:`history-panel draggable-panel ${bn?"is-minimized":""} ${yn==="chat"?"is-active":""}`,style:{transform:`translate3d(${le.offset.x}px, ${le.offset.y}px, 0)`},"aria-label":"Lịch sử chat",onPointerDown:()=>en("chat"),children:[n.jsxs("div",{className:"panel-head panel-drag-handle",...le.dragHandleProps,onDoubleClick:le.resetPosition,onWheel:r=>tt(r,()=>M(!0)),children:[n.jsxs("div",{children:[n.jsx("i",{className:`status-dot ${cn}`}),n.jsx("span",{children:"ĐỐI THOẠI"})]}),n.jsxs("div",{className:"panel-actions",children:[n.jsx("button",{type:"button","aria-label":"Copy lịch sử",onClick:Ut,children:n.jsx(D,{name:"copy"})}),n.jsx("button",{type:"button","aria-label":"Xóa lịch sử",onClick:_t,children:n.jsx(D,{name:"trash"})}),n.jsx("button",{type:"button","aria-label":"Thu nhỏ chat",onClick:()=>M(!0),children:n.jsx(D,{name:"minimize"})}),n.jsx("button",{type:"button","aria-label":"Đóng lịch sử",onClick:()=>tn(!1),children:n.jsx(D,{name:"close"})})]})]}),n.jsxs("div",{className:"message-list",children:[l.map(r=>n.jsxs("article",{className:`message ${r.role}`,children:[n.jsx("b",{children:r.role==="user"?"BẠN":"J-CORE"}),n.jsx("p",{children:r.text})]},r.id)),n.jsx("div",{ref:Dt})]})]}),E&&!Pn&&n.jsxs("aside",{ref:de.panelRef,className:`settings-panel draggable-panel ${Pn?"is-minimized":""} ${yn==="settings"?"is-active":""}`,style:{transform:`translate3d(${de.offset.x}px, ${de.offset.y}px, 0)`},"aria-label":"Cài đặt",onPointerDown:()=>en("settings"),children:[n.jsxs("div",{className:"settings-hero panel-drag-handle",...de.dragHandleProps,onDoubleClick:de.resetPosition,onWheel:r=>tt(r,()=>Gn(!0)),children:[n.jsxs("div",{children:[n.jsx("span",{children:"CỔNG KẾT NỐI"}),n.jsx("b",{children:x.gateway?"GATEWAY TRỰC TUYẾN":"GATEWAY NGOẠI TUYẾN"})]}),n.jsxs("div",{className:"panel-actions settings-window-actions",children:[n.jsx("button",{type:"button","aria-label":"Thu nhỏ cài đặt",onClick:()=>Gn(!0),children:n.jsx(D,{name:"minimize"})}),n.jsx("button",{type:"button","aria-label":"Đóng cài đặt",onClick:()=>$(!1),children:n.jsx(D,{name:"close"})})]})]}),n.jsxs("section",{className:`settings-block gateway-settings ${v?"is-same-origin":""}`,children:[n.jsxs("div",{className:"settings-block-head",children:[n.jsx("span",{children:"Gateway Ubuntu"}),n.jsx("button",{className:te==="error"?"danger":"primary",type:"button",disabled:te==="testing",onClick:()=>void na(),children:te==="testing"?"Đang thử":"Kiểm tra"})]}),n.jsxs("div",{className:"gateway-session-card",children:[n.jsx("i",{}),n.jsxs("div",{children:[n.jsx("b",{children:"LOCAL PROJECT SESSION"}),n.jsx("span",{children:"J-Core tự kết nối dịch vụ trong dự án sau đăng nhập. Không có URL, API key hay token cần nhập."})]}),v&&n.jsx("button",{type:"button",onClick:()=>void ia(),children:"Đăng xuất"})]}),n.jsxs("label",{className:"gateway-field",children:[n.jsx("span",{children:"Gateway URL"}),n.jsx("input",{type:"url",name:"jcore-gateway-url",value:Je,autoComplete:"off",autoCorrect:"off",spellCheck:!1,"data-1p-ignore":"true","data-lpignore":"true",onChange:r=>{It(r.target.value),_n("idle")}})]}),n.jsxs("label",{className:"gateway-field",children:[n.jsx("span",{children:"Jarvis device token"}),n.jsxs("div",{className:"gateway-token-control",children:[n.jsx("input",{type:Rt?"text":"password",value:Ye,placeholder:"Chỉ nhập chuỗi token, không cần Bearer",autoComplete:"off",autoCorrect:"off",spellCheck:!1,"data-1p-ignore":"true","data-lpignore":"true",onChange:r=>{We(r.target.value),_n("idle"),ie("")}}),n.jsx("button",{type:"button",onClick:()=>Li(r=>!r),children:Rt?"Ẩn":"Hiện"})]})]}),n.jsxs("label",{className:"toggle-row gateway-remember-row",children:[n.jsxs("span",{children:["Nhớ token trên thiết bị",n.jsx("small",{children:Ze?"Lưu lâu dài trong trình duyệt này":"Chỉ giữ đến khi đóng tab"})]}),n.jsx("input",{checked:Ze,type:"checkbox",onChange:r=>{const g=r.target.checked;Ot(g),Ie(Ye,g)}})]}),n.jsx("p",{className:`gateway-test-status ${te}`,role:te==="error"?"alert":"status",children:Ri||(x.gateway?"Health check đang hoạt động.":"Gateway chưa kết nối.")}),(ye==null?void 0:ye.services)&&n.jsx("div",{className:"gateway-service-grid","aria-label":"Trạng thái dịch vụ nội bộ",children:Object.entries(ye.services).map(([r,g])=>n.jsxs("div",{className:g.online?"online":"offline",children:[n.jsx("span",{children:r}),n.jsx("b",{children:g.online?"ONLINE":"OFFLINE"}),n.jsx("small",{children:Number.isFinite(g.latencyMs)?`${g.latencyMs}ms`:"Không phản hồi"})]},r))}),n.jsx("button",{className:"gateway-clear-token",type:"button",onClick:ea,children:"Xóa token khỏi trình duyệt"})]}),n.jsxs("section",{className:"settings-block model-settings",children:[n.jsxs("div",{className:"settings-block-head",children:[n.jsx("span",{children:"9Router model"}),n.jsx("b",{className:"active-model-readout",children:ae})]}),n.jsx("div",{className:"model-grid",role:"group","aria-label":"Chọn model 9Router",children:Gi.map(r=>n.jsxs("button",{className:ae===r.id?"active":"",type:"button","aria-pressed":ae===r.id,onClick:()=>ra(r.id),children:[n.jsx("b",{children:r.label}),n.jsx("small",{children:r.detail})]},r.id))}),n.jsxs("p",{children:["Model được gửi trực tiếp tới 9Router cho mọi cửa sổ chat. Mặc định: ",gt,"."]})]}),n.jsxs("section",{className:"settings-block",children:[n.jsxs("div",{className:"settings-block-head",children:[n.jsx("span",{children:"Kênh giọng nói tiếng Việt"}),n.jsx("button",{className:C?"danger":"primary",type:"button",onClick:Bt,children:C?"Tắt":"Bật"})]}),n.jsxs("div",{className:"voice-pipeline-status",children:[n.jsxs("span",{children:[n.jsx("i",{className:O.stt?"online":"fallback"}),"STT: ",O.stt?"HERMES LOCAL":"BROWSER"]}),n.jsxs("span",{children:[n.jsx("i",{className:O.tts?"online":"fallback"}),"TTS: ",O.tts?"HERMES LOCAL":"BROWSER"]})]}),n.jsx("div",{className:"voice-style-grid",role:"group","aria-label":"Chọn chất giọng tiếng Việt",children:Object.keys(Se).map(r=>n.jsxs("button",{className:A===r?"active":"",type:"button","aria-pressed":A===r,onClick:()=>{P(r),V(`Đã chọn giọng ${Se[r].toLowerCase()}.`)},children:[n.jsx("b",{children:Se[r]}),n.jsx("small",{children:r==="female"?"Rõ, tự nhiên, tốc độ chuẩn":"Thấp, chậm và chắc"})]},r))}),n.jsxs("label",{className:"toggle-row",children:[n.jsx("span",{children:"Chế độ cố vấn"}),n.jsx("input",{checked:B,type:"checkbox",onChange:r=>j(r.target.checked)})]}),n.jsxs("label",{className:"toggle-row",children:[n.jsx("span",{children:"Tự nghe tiếp"}),n.jsx("input",{checked:U,type:"checkbox",onChange:r=>Y(r.target.checked)})]}),n.jsxs("label",{className:"toggle-row",children:[n.jsx("span",{children:"Đọc phản hồi"}),n.jsx("input",{checked:T,type:"checkbox",onChange:r=>S(r.target.checked)})]})]}),n.jsxs("section",{className:"settings-block",children:[n.jsx("div",{className:"settings-block-head",children:n.jsx("span",{children:"Màu năng lượng"})}),n.jsx("div",{className:"palette-grid",children:Object.keys(ct).map(r=>n.jsxs("button",{className:i===r?"active":"",type:"button",onClick:()=>p(r),children:[n.jsx("i",{}),ct[r]]},r))})]}),n.jsxs("section",{className:"settings-actions",children:[n.jsxs("button",{type:"button",onClick:()=>window.open("https://chatgpt.com/","_blank","noopener,noreferrer"),children:[n.jsx(D,{name:"external"}),n.jsx("span",{children:"Mở ChatGPT Web"})]}),n.jsxs("button",{type:"button",onClick:Ut,children:[n.jsx(D,{name:"copy"}),n.jsx("span",{children:"Copy ngữ cảnh"})]}),n.jsxs("button",{className:"danger-text",type:"button",onClick:_t,children:[n.jsx(D,{name:"trash"}),n.jsx("span",{children:"Xóa lịch sử"})]})]})]}),Re&&n.jsx(Hn,{title:"Không gian làm việc đa năng",code:"JARVIS://HUB-RUNTIME",drag:Ki,minimized:Ct,active:yn==="workspace",className:"workspace-os-window",onActivate:()=>en("workspace"),onClose:()=>{Le(!1),fn(null)},onToggleMinimize:()=>Pe(!0),children:n.jsx(mr,{artifacts:Ge,activeId:Be,onSelect:be,onCreateDemo:sa,onRemove:ca})}),Yn&&n.jsxs(Hn,{title:"Ubuntu Terminal",code:On==="pty"?"PTY://UBUNTU-PRIVATE":"LOCAL://BROWSER",drag:Bi,minimized:xt,active:yn==="terminal",className:"terminal-os-window",onActivate:()=>en("terminal"),onClose:()=>{Wn(!1),fn(null)},onToggleMinimize:()=>mt(!0),children:[n.jsxs("div",{className:"terminal-mode-toggle",children:[n.jsxs("span",{children:[On==="pty"?"Private Ubuntu PTY":"Local browser console",n.jsx("small",{children:On==="pty"?"Phiên riêng có thời hạn · input/output được audit theo byte":"Ubuntu Files dùng quyền thư mục trực tiếp · PTY là chế độ nâng cao tùy chọn"})]}),n.jsxs("div",{className:"terminal-mode-actions",children:[n.jsx("button",{type:"button",onClick:()=>{Bn("files"),xn("intel")},children:"UBUNTU FILES"}),n.jsx("button",{className:On==="pty"?"danger":"",type:"button",disabled:Ke,onClick:()=>void da(),children:Ke?"ĐANG NỐI":On==="pty"?"NGẮT PTY":"MỞ PRIVATE PTY"})]})]}),n.jsx("div",{className:"os-terminal-stream","aria-live":"polite",children:Oi.map((r,g)=>n.jsx("p",{children:r},`${g}-${r}`))}),n.jsxs("form",{className:"os-terminal-input",onSubmit:r=>void pa(r),children:[n.jsx("span",{children:On==="pty"?"ubuntu@j-core:~$":"operator@j-core:~$"}),n.jsx("input",{value:Ve,onChange:r=>qe(r.target.value),"aria-label":"Lệnh Ubuntu",autoComplete:"off",spellCheck:!1}),n.jsx("button",{type:"submit","aria-label":"Chạy lệnh local",disabled:!Ve.trim(),children:"RUN"})]})]}),Zn&&n.jsx(Hn,{title:"Agent Matrix & OpenClaw Console",code:"PWR://OPENCLAW",drag:Ui,minimized:bt,active:yn==="agents",className:"agents-os-window",onActivate:()=>en("agents"),onClose:()=>{Xn(!1),fn(null)},onToggleMinimize:()=>vt(!0),children:n.jsx(lt,{label:"OpenClaw Control UI",url:(wn==null?void 0:wn.openclaw)||"",online:x.openclaw})}),w&&n.jsx(Hn,{title:"9Router Config & Provider Control",code:"SPC://9ROUTER-ADMIN",drag:_i,minimized:ft,active:yn==="router",className:"router-os-window",onActivate:()=>en("router"),onClose:()=>{z(!1),fn(null)},onToggleMinimize:()=>yt(!0),children:n.jsx(lt,{label:"9Router Admin",url:(wn==null?void 0:wn.nineRouter)||"",online:x.nineRouter})}),Z&&n.jsx(Hn,{title:"Hermes Core",code:"AI://HERMES",drag:$i,minimized:wt,active:yn==="hermes",className:"service-os-window hermes-os-window",onActivate:()=>en("hermes"),onClose:()=>{rn(!1),fn(null)},onToggleMinimize:()=>He(!0),children:n.jsx(lt,{label:"Hermes Dashboard",url:(wn==null?void 0:wn.hermes)||"",online:x.hermes})}),Tn&&n.jsx(Hn,{title:"Claude Bridge",code:"AI://CLAUDE",drag:Vi,minimized:kt,active:yn==="claude",className:"service-os-window claude-os-window",onActivate:()=>en("claude"),onClose:()=>{on(!1),fn(null)},onToggleMinimize:()=>De(!0),children:n.jsx(Nr,{data:t,label:"CLAUDE",description:"Local Claude Code bridge · health and direct-chat diagnostics",online:x.claude,state:un.claude.state,health:(ei=x.services)==null?void 0:ei.claude,overview:un.claude.overview,error:un.claude.error,prompt:un.claude.prompt,reply:un.claude.reply,sending:un.claude.sending,onPromptChange:r=>kn("claude",{prompt:r}),onRefresh:()=>void $t("claude"),onSubmit:()=>void ta("claude"),diagnostics:["version","status","doctor","auth"],onRunDiagnostic:r=>void aa("claude",r)})}),Sn&&n.jsx(Hn,{title:"Intel Library",code:"NET://KNOWLEDGE",drag:qi,minimized:jt,active:yn==="intel",className:"intel-os-window",onActivate:()=>en("intel"),onClose:()=>{ut(!1),fn(null)},onToggleMinimize:()=>Nt(!0),children:n.jsxs("div",{className:"intel-shell",children:[n.jsxs("header",{className:"intel-toolbar",children:[n.jsxs("div",{className:"intel-tabs",role:"tablist","aria-label":"Nguồn dữ liệu Intel",children:[n.jsxs("button",{type:"button",role:"tab","aria-label":"YouTube","aria-selected":hn==="youtube",className:hn==="youtube"?"active":"",onClick:()=>Bn("youtube"),children:[n.jsx(D,{name:"media"}),n.jsx("span",{children:"YouTube"})]}),n.jsxs("button",{type:"button",role:"tab","aria-label":"Tài liệu","aria-selected":hn==="docs",className:hn==="docs"?"active":"",onClick:()=>Bn("docs"),children:[n.jsx(D,{name:"document"}),n.jsx("span",{children:"Tài liệu"})]}),n.jsxs("button",{type:"button",role:"tab","aria-label":"Ubuntu Files","aria-selected":hn==="files",className:hn==="files"?"active":"",onClick:()=>Bn("files"),children:[n.jsx(D,{name:"terminal"}),n.jsx("span",{children:"Ubuntu Files"})]}),n.jsxs("button",{type:"button",role:"tab","aria-label":"Obsidian Vault","aria-selected":hn==="obsidian",className:hn==="obsidian"?"active":"",onClick:()=>Bn("obsidian"),children:[n.jsx(D,{name:"document"}),n.jsx("span",{children:"Obsidian"})]})]}),n.jsxs("div",{className:"intel-secure-status",children:[n.jsx("i",{}),n.jsx("span",{children:"ISOLATED VIEWER"})]})]}),hn==="youtube"?n.jsxs("section",{className:"intel-youtube",role:"tabpanel","aria-label":"YouTube viewer",children:[n.jsxs("form",{className:"intel-address-bar",onSubmit:la,children:[n.jsx("label",{htmlFor:"intel-youtube-url",children:"YouTube URL / video ID"}),n.jsxs("div",{children:[n.jsx("span",{children:"HTTPS://"}),n.jsx("input",{id:"intel-youtube-url",value:Tt,onChange:r=>{zi(r.target.value),_e&&$e("")},inputMode:"url",autoComplete:"off",spellCheck:!1}),n.jsx("button",{type:"submit",children:"LOAD"})]}),_e&&n.jsx("p",{role:"alert",children:_e})]}),n.jsxs("div",{className:"intel-video-frame",children:[n.jsxs("div",{className:"intel-frame-label",children:[n.jsx("span",{children:"LIVE MEDIA FEED"}),n.jsxs("b",{children:["ID::",Ue]})]}),n.jsx("iframe",{src:`https://www.youtube-nocookie.com/embed/${Ue}?rel=0`,title:"J-Core YouTube viewer",loading:"lazy",referrerPolicy:"strict-origin-when-cross-origin",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowFullScreen:!0},Ue)]}),n.jsxs("div",{className:"intel-video-queries","aria-label":"Tìm nhanh trên YouTube",children:[n.jsx("span",{children:"SEARCH CHANNELS"}),[["Ethical hacking","ethical+hacking+fundamentals"],["Network defense","network+defense+fundamentals"],["AI security","AI+security+fundamentals"]].map(([r,g])=>n.jsxs("button",{type:"button",onClick:()=>window.open(`https://www.youtube.com/results?search_query=${g}`,"_blank","noopener,noreferrer"),children:[n.jsx(D,{name:"external"}),n.jsx("span",{children:r})]},r))]})]}):hn==="docs"?n.jsxs("section",{className:"intel-docs",role:"tabpanel","aria-label":"Tài liệu nội bộ",children:[n.jsxs("nav",{className:"intel-doc-index","aria-label":"Chỉ mục tài liệu",children:[n.jsxs("span",{children:["LOCAL ARCHIVE / ",Me.length," FILES"]}),Me.map(r=>n.jsxs("button",{type:"button",className:ve===r.id?"active":"","aria-pressed":ve===r.id,onClick:()=>Ei(r.id),children:[n.jsx("small",{children:r.code}),n.jsx("b",{children:r.title}),n.jsx("span",{children:r.summary})]},r.id))]}),n.jsxs("article",{className:"intel-doc-viewer",children:[n.jsxs("header",{children:[n.jsxs("span",{children:[je.code," / INTERNAL"]}),n.jsx("h2",{children:je.title}),n.jsx("p",{children:je.summary})]}),n.jsx("div",{children:je.sections.map(([r,g])=>n.jsxs("section",{children:[n.jsx("b",{children:r}),n.jsx("p",{children:g})]},r))}),n.jsx("footer",{children:"J-CORE KNOWLEDGE NODE // READ-ONLY // LOCAL CACHE"})]})]}):hn==="files"?n.jsx(Or,{}):n.jsx(zr,{data:t})]})}),n.jsxs("section",{className:"hud-bottom",children:[n.jsxs("div",{className:`ai-state-readout ${cn}`,children:[n.jsx("i",{className:`status-dot ${cn}`}),n.jsx("span",{children:no[cn]}),n.jsx("div",{className:"voice-wave","aria-hidden":"true",children:Array.from({length:12},(r,g)=>n.jsx("i",{style:{animationDelay:`${g*48}ms`}},g))})]}),gn&&n.jsxs("div",{className:"legacy-attachment-tray",children:[n.jsx("span",{children:gn.name}),n.jsx("button",{type:"button","aria-label":"Gỡ tệp đính kèm",onClick:()=>fe(null),children:n.jsx(D,{name:"close"})})]}),n.jsxs("div",{className:"quick-command-strip","aria-label":"Lệnh gợi ý",children:[n.jsx("span",{children:"QUICK://"}),Qr.map(r=>n.jsx("button",{type:"button",onClick:()=>d(r.prompt),children:r.label},r.label))]}),n.jsxs("form",{className:"prompt-shell prompt-shell-with-tools",autoComplete:"off",onSubmit:Ji,children:[n.jsx("button",{className:C||At?"listening":"",type:"button","aria-label":"Bật chế độ giọng nói",onClick:Bt,children:n.jsx(D,{name:"mic"})}),n.jsxs("div",{className:"legacy-chat-tools","aria-label":"Công cụ chat",children:[n.jsx("button",{type:"button","aria-label":"Ghim một tệp hoặc hình ảnh",onClick:Yi,children:n.jsx(D,{name:"attach"})}),n.jsx("button",{type:"button","aria-label":"Chia sẻ và chụp màn hình",onClick:Zi,children:n.jsx(D,{name:"screen"})})]}),n.jsx("input",{ref:Pt,className:"attachment-input",type:"file",accept:"image/*,.pdf,.txt,.md,.csv,.json,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip","aria-label":"Chọn tệp đính kèm",onChange:Wi}),n.jsx("label",{className:"sr-only",htmlFor:"jcore-command",children:"Nhập tin nhắn"}),n.jsx("input",{id:"jcore-command",name:"jcore-command",placeholder:"Nói hoặc nhập lệnh...",value:y,autoComplete:"off",autoCorrect:"off",autoCapitalize:"sentences",spellCheck:!1,"aria-autocomplete":"none","data-1p-ignore":"true","data-lpignore":"true",onChange:r=>d(r.target.value)}),n.jsx("button",{type:"submit","aria-label":"Gửi tin nhắn",disabled:ee||!y.trim()&&!gn,children:n.jsx(D,{name:"send"})})]}),n.jsx("p",{"aria-live":"polite",children:Fe})]})]})}function so(){const{connections:e}=ki();return n.jsxs("div",{className:"fixed inset-0 z-50 grid place-items-center bg-void text-cyan-100",children:[n.jsx("div",{className:"absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_34%),linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:auto,42px_42px,42px_42px]"}),n.jsxs("div",{className:"relative w-[min(560px,90vw)] animate-boot rounded-lg border border-cyan-300/30 bg-slate-950/70 p-8 shadow-hud",children:[n.jsxs("div",{className:"mb-6 flex items-center gap-4",children:[n.jsx("div",{className:"h-12 w-12 rounded-full border border-greenCore/70 shadow-greenHud",children:n.jsx("div",{className:"m-3 h-6 w-6 animate-pulseCore rounded-full bg-greenCore/70 shadow-[0_0_22px_rgba(74,222,128,0.8)]"})}),n.jsxs("div",{children:[n.jsx("p",{className:"font-mono text-sm uppercase text-greenCore",children:"Infinity System Boot"}),n.jsx("h1",{className:"font-mono text-3xl uppercase",children:"JARVIS"})]})]}),n.jsxs("div",{className:"space-y-2 font-mono text-xs sm:text-sm text-cyan-100/80",children:[n.jsx("p",{children:"> Initializing J-Core Kernel..."}),n.jsxs("p",{className:e.gateway?"text-greenCore font-bold":"text-warningCore",children:["> Gateway Link: ",e.gateway?"CONNECTED (ONLINE)":"SEARCHING / OFFLINE"]}),n.jsxs("p",{className:e.hermes?"text-greenCore font-bold":"text-cyan-100/40",children:["> Hermes Core: ",e.hermes?"READY":"STANDBY"]}),n.jsxs("p",{className:e.openclaw?"text-purpleCore font-bold":"text-cyan-100/40",children:["> OpenClaw Workforce: ",e.openclaw?"ACTIVE":"STANDBY"]}),n.jsxs("p",{className:e.nineRouter?"text-cyanCore font-bold":"text-cyan-100/40",children:["> 9Router Router: ",e.nineRouter?"ONLINE":"STANDBY"]}),n.jsxs("p",{className:e.claude?"text-amberCore font-bold":"text-cyan-100/40",children:["> Claude Bridge: ",e.claude?"ONLINE":"STANDBY"]})]}),n.jsx("div",{className:"mt-6 h-1 overflow-hidden rounded-full bg-cyan-950",children:n.jsx("div",{className:"h-full w-full origin-left animate-[boot_1.9s_ease-out_both] bg-gradient-to-r from-cyanCore to-greenCore"})})]})]})}const dt=()=>n.jsxs("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:[n.jsx("path",{d:"M7.5 10V7.75a4.5 4.5 0 0 1 9 0V10M6 10h12v10H6z"}),n.jsx("path",{d:"M12 14v2.5"})]}),co=()=>n.jsxs("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"8",r:"3.5"}),n.jsx("path",{d:"M5.5 20c.6-3.8 2.8-5.8 6.5-5.8s5.9 2 6.5 5.8"})]});function lo({data:e,onUnlock:t}){var Y,B,j;const[i,a]=o.useState(((Y=e==null?void 0:e.auth)==null?void 0:Y.username)||"admin"),[s,p]=o.useState(""),[c,m]=o.useState(!1),[u,v]=o.useState(""),[h,x]=o.useState(0),[y,d]=o.useState("standby"),l=o.useRef([]),f=((B=e==null?void 0:e.auth)==null?void 0:B.username)||"admin",T=((j=e==null?void 0:e.auth)==null?void 0:j.password)||"123456",S=h>=5;o.useEffect(()=>Cn.setEnabled((e==null?void 0:e.soundEnabled)!==!1),[e==null?void 0:e.soundEnabled]),o.useEffect(()=>()=>l.current.forEach(window.clearTimeout),[]);const A=()=>{v(""),y==="denied"&&d("standby")},P=async C=>{if(C.preventDefault(),!(S||y==="scanning"||y==="granting")){v(""),d("scanning"),await new Promise(R=>l.current.push(window.setTimeout(R,560)));try{const R=await fetch("/api/auth/login",{method:"POST",credentials:"include",headers:{"content-type":"application/json"},body:JSON.stringify({username:i.trim(),password:s})});if(!(R.headers.get("content-type")||"").includes("application/json"))throw new Error("static_preview");const k=await R.json();if(!R.ok){const E=new Error(k.error||"invalid_credentials");throw E.remaining=k.remaining,E}d("granting"),Cn.play("success"),l.current.push(window.setTimeout(()=>t(k),900))}catch(R){if(((R==null?void 0:R.message)==="static_preview"||window.location.protocol==="file:"||window.location.hostname.endsWith("github.io"))&&i.trim()===f&&s===T){d("granting"),Cn.play("success"),l.current.push(window.setTimeout(()=>t({preview:!0}),900));return}Cn.play("warning"),x(k=>k+1),d("denied"),v((R==null?void 0:R.message)==="login_rate_limited"?"Đăng nhập đang tạm khóa 15 phút vì thử sai quá nhiều lần.":"Thông tin truy cập chưa đúng. Hãy kiểm tra và thử lại."),p("")}}},U=S?"Đã tạm khóa sau 5 lần thử. Tải lại trang để tiếp tục.":y==="scanning"?"Đang xác minh khóa truy cập…":y==="granting"?"Danh tính hợp lệ. Đang mở J-Core…":u;return n.jsxs("main",{className:`aegis-auth is-${y}`,children:[n.jsxs("div",{className:"aegis-ambient","aria-hidden":"true",children:[n.jsx("i",{className:"aegis-aurora aegis-aurora-one"}),n.jsx("i",{className:"aegis-aurora aegis-aurora-two"}),n.jsx("i",{className:"aegis-grain"}),n.jsx("i",{className:"aegis-grid"}),n.jsx("i",{className:"aegis-scan-beam"}),n.jsx("i",{className:"aegis-vignette"})]}),n.jsxs("nav",{className:"aegis-nav","aria-label":"J-Core identity",children:[n.jsxs("div",{className:"aegis-brand",children:[n.jsx("span",{children:"J"}),n.jsxs("div",{children:[n.jsx("b",{children:"J—CORE"}),n.jsx("small",{children:"PRIVATE INTELLIGENCE"})]})]}),n.jsxs("div",{className:"aegis-private",children:[n.jsx("i",{})," J-CORE LOCAL ",n.jsx("span",{children:"SECURE CHANNEL"})]})]}),n.jsxs("section",{className:"aegis-stage",children:[n.jsxs("div",{className:"aegis-story",children:[n.jsxs("p",{className:"aegis-kicker",children:[n.jsx("span",{children:"01"})," ARC COMMAND ACCESS PROTOCOL"]}),n.jsxs("h1",{children:["Hệ lõi",n.jsx("br",{}),n.jsx("em",{children:"hồ quang."})]}),n.jsx("p",{className:"aegis-lead",children:"Đăng nhập một lần để mở không gian hoạch định, tác nhân AI và hệ thống cá nhân."}),n.jsxs("div",{className:"aegis-core","aria-hidden":"true",children:[n.jsx("div",{className:"aegis-core-halo"}),n.jsx("img",{className:"aegis-reactor-image",src:"./assets/arc-reactor-v2.webp",alt:""}),n.jsxs("div",{className:"aegis-core-shell",children:[n.jsx("i",{}),n.jsx("i",{}),n.jsx("i",{}),n.jsx("span",{children:"J"})]}),n.jsxs("div",{className:"aegis-core-ring",children:[n.jsx("b",{}),n.jsx("b",{}),n.jsx("b",{})]}),n.jsx("div",{className:"aegis-core-orbit orbit-a"}),n.jsx("div",{className:"aegis-core-orbit orbit-b"}),n.jsx("small",{className:"aegis-core-label label-a",children:"ARC CORE // 100%"}),n.jsx("small",{className:"aegis-core-label label-b",children:"IDENTITY LINK"})]}),n.jsxs("div",{className:"aegis-links","aria-label":"Hệ thống sẵn sàng",children:[n.jsxs("span",{children:[n.jsx("i",{})," HERMES"]}),n.jsxs("span",{children:[n.jsx("i",{})," OPENCLAW"]}),n.jsxs("span",{children:[n.jsx("i",{})," 9ROUTER"]})]})]}),n.jsxs("form",{className:"aegis-card",onSubmit:P,noValidate:!0,children:[n.jsx("div",{className:"aegis-card-glow","aria-hidden":"true"}),n.jsxs("header",{children:[n.jsxs("p",{children:[n.jsx(dt,{})," IDENTITY HANDSHAKE / 01"]}),n.jsx("h2",{children:"Kích hoạt J-Core."}),n.jsx("span",{children:"Nhập tài khoản và mật khẩu. Những kết nối còn lại được hệ thống tự xử lý."})]}),n.jsxs("div",{className:"aegis-diagnostics","aria-hidden":"true",children:[n.jsxs("span",{children:[n.jsx("i",{})," CORE ONLINE"]}),n.jsxs("span",{children:[n.jsx("i",{})," LOCAL VAULT"]}),n.jsxs("span",{children:[n.jsx("i",{})," AUTO LINK"]})]}),n.jsxs("div",{className:"aegis-fields",children:[n.jsx("label",{htmlFor:"aegis-operator",children:"Tài khoản"}),n.jsxs("div",{className:"aegis-input",children:[n.jsx(co,{}),n.jsx("input",{id:"aegis-operator",autoComplete:"username",value:i,disabled:S||y==="granting",onChange:C=>{a(C.target.value),A()}}),n.jsx("small",{children:i.trim()===f?"RECOGNIZED":"LOCAL"})]}),n.jsx("label",{htmlFor:"aegis-key",children:"Mật khẩu"}),n.jsxs("div",{className:`aegis-input ${u?"has-error":""}`,children:[n.jsx(dt,{}),n.jsx("input",{id:"aegis-key",type:c?"text":"password",autoComplete:"current-password",value:s,disabled:S||y==="granting",placeholder:"Nhập khóa truy cập","aria-invalid":!!u,"aria-describedby":"aegis-feedback",onChange:C=>{p(C.target.value),A()}}),n.jsx("button",{type:"button",className:"aegis-reveal","aria-label":c?"Ẩn mật khẩu":"Hiện mật khẩu",onClick:()=>m(C=>!C),children:c?"HIDE":"SHOW"})]})]}),n.jsxs("div",{id:"aegis-feedback",className:"aegis-feedback",role:"status","aria-live":"polite",children:[n.jsx("span",{children:U}),!S&&h>0&&n.jsxs("small",{children:["Còn ",5-h," lần thử"]})]}),n.jsxs("button",{className:"aegis-submit",type:"submit",disabled:S||y==="scanning"||y==="granting",children:[n.jsx("span",{children:y==="granting"?"TRUY CẬP ĐÃ CẤP":y==="scanning"?"ĐANG QUÉT DANH TÍNH":S?"TẠM KHÓA":"KÍCH HOẠT HỆ THỐNG"}),n.jsx("i",{"aria-hidden":"true",children:y==="granting"?"✓":"↗"})]}),n.jsxs("footer",{children:[n.jsx(dt,{}),n.jsx("span",{children:"Một lần đăng nhập · tự kết nối toàn bộ dự án local."})]})]})]}),n.jsxs("footer",{className:"aegis-foot",children:[n.jsx("span",{children:"J—CORE / HERMES GATEWAY"}),n.jsxs("span",{children:["SAIGON · ",new Date().getFullYear()]})]}),n.jsx("div",{className:"aegis-aperture","aria-hidden":"true"})]})}function po(){var R;const[e,t]=o.useState(!0),[i,a]=o.useState(()=>Pa()),[s,p]=o.useState(()=>new Date),[c,m]=o.useState(((R=i.auth)==null?void 0:R.loginEnabled)===!1),[u,v]=o.useState(!0),[h,x]=o.useState("idle"),[y,d]=o.useState(za),[l,f]=o.useState(0),[T,S]=o.useState(!0),[A,P]=o.useState(!1),U=o.useRef(y);o.useEffect(()=>{const O=window.setTimeout(()=>t(!1),2e3),k=window.setInterval(()=>p(new Date),1e3);return()=>{window.clearTimeout(O),window.clearInterval(k)}},[]),o.useEffect(()=>{let O=!0;return fetch("/api/auth/session",{credentials:"include",headers:{accept:"application/json"}}).then(async k=>(k.headers.get("content-type")||"").includes("application/json")?k.json():null).then(k=>{!O||!(k!=null&&k.authenticated)||(a(E=>{var $,F;return{...E,auth:{...E.auth,username:(($=k.user)==null?void 0:$.username)||((F=E.auth)==null?void 0:F.username),sessionMode:"same-origin"},endpoints:{...E.endpoints,gateway:window.location.origin,gatewayToken:""}}}),m(!0))}).catch(()=>{}).finally(()=>{O&&v(!1)}),()=>{O=!1}},[]),o.useEffect(()=>{Cn.setEnabled(i.soundEnabled!==!1)},[i.soundEnabled]),o.useEffect(()=>{Ga(i)},[i]),o.useEffect(()=>{document.body.dataset.activity=h},[h]),o.useEffect(()=>{document.body.dataset.palette=y,Ia(y),y==="spider"&&U.current!=="spider"&&Cn.play("spider"),U.current=y},[y]),o.useEffect(()=>{const O=k=>{const E=k.target;E instanceof HTMLInputElement||E instanceof HTMLTextAreaElement||E instanceof HTMLSelectElement||E instanceof HTMLElement&&E.isContentEditable||(k.ctrlKey&&k.shiftKey&&k.key.toLowerCase()==="h"&&(k.preventDefault(),S(F=>!F)),k.key==="Escape"&&d("gold"),k.key==="1"&&x("idle"),k.key==="2"&&x("listening"),k.key==="3"&&x("thinking"),k.key==="4"&&x("speaking"),k.key.toLowerCase()==="r"&&f(F=>F+1))};return window.addEventListener("keydown",O),()=>window.removeEventListener("keydown",O)},[]);const Y=o.useMemo(()=>new Intl.DateTimeFormat("vi-VN",{hour:"2-digit",minute:"2-digit",second:"2-digit",weekday:"short",hour12:!1}).format(s),[s]),B={Low:"theme-low",Medium:"theme-medium",High:"theme-high"}[i.themeIntensity]||"theme-medium",j=O=>{a(k=>({...k,...O}))},C=O=>{O!=null&&O.preview||a(k=>{var E,$;return{...k,auth:{...k.auth,username:((E=O==null?void 0:O.user)==null?void 0:E.username)||(($=k.auth)==null?void 0:$.username),sessionMode:"same-origin"},endpoints:{...k.endpoints,gateway:window.location.origin,gatewayToken:""}}}),m(!0)};return u?n.jsxs("main",{className:"auth-session-probe",children:[n.jsx("i",{}),n.jsx("span",{children:"J—CORE"}),n.jsx("small",{children:"VERIFYING LOCAL SESSION"})]}):c?n.jsx(Sa,{data:i,children:n.jsxs("main",{className:`jarvis-shell min-h-dvh overflow-hidden bg-void text-cyan-50 ${B}`,children:[n.jsx("div",{className:`orb-stage fixed inset-0 z-0 ${A?"is-core-minimized":""}`,children:!A&&y!=="world"&&y!=="javis"&&n.jsx(Na,{activity:h,palette:y,resetSignal:l})}),e&&n.jsx(so,{}),n.jsxs("div",{className:"pointer-events-none fixed inset-0 z-10",children:[n.jsx("div",{className:"absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.13),transparent_28%),radial-gradient(circle_at_86%_20%,rgba(74,222,128,0.11),transparent_26%),linear-gradient(rgba(34,211,238,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.035)_1px,transparent_1px)] bg-[size:auto,auto,48px_48px,48px_48px]"}),n.jsx("div",{className:"absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-cyan-300/10 to-transparent"}),n.jsx("div",{className:"absolute h-28 w-full animate-scan bg-gradient-to-b from-transparent via-cyan-300/10 to-transparent"})]}),T&&n.jsx(oo,{currentTime:Y,data:i,palette:y,updateData:j,onActivityChange:x,onPaletteChange:d,onResetView:()=>f(O=>O+1),coreMinimized:A,onCoreMinimizedChange:P})]})}):n.jsx(lo,{data:i,onUnlock:C})}ba.createRoot(document.getElementById("root")).render(n.jsx(va.StrictMode,{children:n.jsx(po,{})}));
