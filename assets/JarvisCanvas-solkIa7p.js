import{r as u,j as t}from"./index-DEcnGJb3.js";import{u as v,M as E,C as L,A as h,I as He,W as $e,V as M,B as _,F as R,U as Ie,a as qe,b as G,E as ke,c as ve,T as Ge,d as Ke,e as re,P as Je,O as K,S as Qe,f as Se,g as et,h as se,i as Z,j as tt,k as Ee,D as ee,l as nt,m as rt,n as st,o as ot,w as at}from"./useReducedMotion-CXgYtX1R.js";function it({palette:e,children:n}){const r=u.useRef(null),[s,o]=u.useState(e),a=u.useRef("idle"),c=u.useRef(1);return u.useEffect(()=>{if(e===s)return;a.current="out";const i=window.setTimeout(()=>{c.current=0,o(e),a.current="in"},150);return()=>window.clearTimeout(i)},[e,s]),v((i,l)=>{a.current==="out"?c.current=E.lerp(c.current,0,l*12):a.current==="in"&&(c.current=E.lerp(c.current,1,l*8),c.current>.95&&(c.current=1,a.current="idle")),r.current&&(r.current.scale.setScalar(c.current),r.current.rotation.y=(1-c.current)*Math.PI*.25)}),t.jsx("group",{ref:r,children:n(s)})}const oe=new L("#fff8d6"),We=new L("#d65f10"),ct={gold:["#fff8d6","#d65f10"],green:["#f5fff6","#18bd58"],violet:["#faf5ff","#7c3aed"],orange:["#fff5de","#ed5f12"]};function lt(e){return()=>{let n=e+=1831565813;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}function Le(e){return e==="speaking"?1.52:e==="thinking"?1.28:e==="listening"?.82:1}function _e(e){return e==="speaking"?1.85:e==="thinking"?1.42:e==="listening"?.46:1}const ce={uniforms:{uTime:{value:0},uEnergy:{value:1},uOpacity:{value:1},uColor:{value:oe}},vertexShader:`
    attribute float aPhase;
    attribute float aIntensity;
    varying float vFront;
    varying float vPhase;
    varying float vIntensity;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mv;
      vFront = smoothstep(-9.4, -5.2, mv.z);
      vPhase = aPhase;
      vIntensity = aIntensity;
    }
  `,fragmentShader:`
    uniform float uTime;
    uniform float uEnergy;
    uniform float uOpacity;
    uniform vec3 uColor;
    varying float vFront;
    varying float vPhase;
    varying float vIntensity;
    void main() {
      float pulse = pow(0.5 + 0.5 * sin(uTime * (1.1 + vIntensity * 2.4) + vPhase), 3.0);
      float packet = smoothstep(0.89, 1.0, sin(vPhase * 8.0 - uTime * 2.6));
      float alpha = uOpacity * (0.18 + vIntensity * 0.46 + packet * 0.44) * mix(0.18, 1.0, vFront);
      alpha *= mix(0.72, 1.18, pulse) * uEnergy;
      gl_FragColor = vec4(uColor, alpha);
    }
  `};function ut(){return{uniforms:Ie.clone(ce.uniforms),vertexShader:ce.vertexShader,fragmentShader:ce.fragmentShader}}function ft(){const e=lt(60879),n=[],r=[],s=[];for(let a=0;a<42;a+=1){const c=e()*Math.PI*2,i=Math.acos(2*e()-1),l=new M(Math.sin(i)*Math.cos(c),Math.cos(i),Math.sin(i)*Math.sin(c)),f=.24+e()*.32,m=1.04+e()*(a%5===0?1.34:.82),p=l.clone().multiplyScalar(f),d=l.clone().multiplyScalar(m);n.push(p.x,p.y,p.z,d.x,d.y,d.z),r.push(e()*6.28,e()*6.28),s.push(.35+e()*.65,.35+e()*.65)}const o=new _;return o.setAttribute("position",new R(n,3)),o.setAttribute("aPhase",new R(r,1)),o.setAttribute("aIntensity",new R(s,1)),o}function mt({activity:e,flashRef:n}){const r=u.useRef(null),s=u.useRef(null),o=u.useMemo(ft,[]),a=u.useMemo(ut,[]);return v(({clock:c},i)=>{const l=Le(e)*(1+n.current*2);s.current&&(s.current.uniforms.uTime.value=c.elapsedTime,s.current.uniforms.uEnergy.value=l*(e==="speaking"?1.22:1),s.current.uniforms.uOpacity.value=e==="speaking"?.82:.7,s.current.uniforms.uColor.value.copy(oe)),r.current&&(r.current.rotation.y+=i*.055*_e(e),r.current.rotation.x=Math.sin(c.elapsedTime*.18)*.05,r.current.scale.setScalar(1+n.current*.2))}),t.jsx("group",{ref:r,children:t.jsx("lineSegments",{geometry:o,children:t.jsx("shaderMaterial",{ref:s,args:[a],blending:h,depthWrite:!1,toneMapped:!1,transparent:!0})})})}function pt({activity:e,flashRef:n}){const r=u.useRef(null),s=u.useRef(null),o=u.useRef(null),a=u.useRef(null),c=u.useMemo(()=>{const i=new He(2.02,2),l=new $e(i);return i.dispose(),l},[]);return v(({clock:i},l)=>{const f=i.elapsedTime,m=_e(e),p=Le(e),d=e==="speaking"?Math.sin(f*7.2)*.035:0,g=e==="thinking"?Math.sin(f*3.4)*.018:0,x=1+d+g+n.current*.075;r.current&&(r.current.rotation.x+=l*.035*m,r.current.rotation.y+=l*.052*m,r.current.rotation.z-=l*.018*m,r.current.scale.setScalar(x)),s.current&&(s.current.rotation.x-=l*.026*m,s.current.rotation.y-=l*.041*m,s.current.rotation.z+=l*.023*m,s.current.scale.setScalar(.91-d*.42+n.current*.035)),o.current&&(o.current.opacity=.2+p*.13+n.current*.24),a.current&&(a.current.opacity=.08+p*.075+n.current*.12)}),t.jsxs("group",{rotation:[.08,-.18,.06],children:[t.jsx("lineSegments",{ref:r,geometry:c,children:t.jsx("lineBasicMaterial",{ref:o,blending:h,color:oe,depthWrite:!1,opacity:.34,toneMapped:!1,transparent:!0})}),t.jsx("lineSegments",{ref:s,geometry:c,children:t.jsx("lineBasicMaterial",{ref:a,blending:h,color:We,depthWrite:!1,opacity:.15,toneMapped:!1,transparent:!0})})]})}function dt({activity:e,palette:n="gold"}){const[r,s]=ct[n];oe.set(r),We.set(s);const[o,a]=u.useState(0),c=u.useRef(0);return u.useEffect(()=>{let i;const l=()=>{a(1),setTimeout(()=>a(0),100);const f=500+Math.random()*2500;e==="thinking"?i=setTimeout(l,f*.5):i=setTimeout(l,f)};return i=setTimeout(l,1e3),()=>clearTimeout(i)},[e]),v((i,l)=>{c.current=E.lerp(c.current,o,l*8)}),t.jsxs("group",{scale:[1.3,.8,1.1],position:[.1,-.05,0],rotation:[.2,.1,-.1],children:[t.jsx(mt,{activity:e,flashRef:c}),t.jsx(pt,{activity:e,flashRef:c})]})}const Y=new L("#ff8a18"),T=new L("#ffd15c"),xe=new L("#fff8d6"),fe=new L("#b8490b"),Me=new L("#d65f10"),ht={gold:["#ff8a18","#ffd15c","#fff8d6","#b8490b","#d65f10"],green:["#4cff85","#b9ffc9","#f5fff6","#0b4f24","#18bd58"],violet:["#a855f7","#d8b4fe","#faf5ff","#1e0547","#7c3aed"],orange:["#ff7a18","#ffc46b","#fff5de","#7a2608","#ed5f12"]};function gt(e){const[n,r,s,o,a]=ht[e];Y.set(n),T.set(r),xe.set(s),fe.set(o),Me.set(a)}const k=[{radiusX:.66,radiusZ:.58,seed:11,speed:.33,tilt:[.28,.16,.84],opacity:.64,width:1,packets:3},{radiusX:.88,radiusZ:.74,seed:13,speed:-.26,tilt:[1.1,.04,-.38],opacity:.5,width:1,packets:2},{radiusX:1.06,radiusZ:.98,seed:17,speed:.21,tilt:[.08,.9,.24],opacity:.42,width:1,packets:4},{radiusX:1.28,radiusZ:1.05,seed:19,speed:-.18,tilt:[1.42,.32,.52],opacity:.58,width:1.3,packets:3},{radiusX:1.42,radiusZ:1.34,seed:23,speed:.13,tilt:[.46,1.18,-.2],opacity:.37,width:1,packets:2},{radiusX:1.58,radiusZ:1.18,seed:29,speed:-.11,tilt:[1.28,.82,1.05],opacity:.46,width:1.1,packets:3},{radiusX:1.78,radiusZ:1.58,seed:31,speed:.087,tilt:[.2,.2,1.47],opacity:.32,width:1,packets:2},{radiusX:2.03,radiusZ:1.72,seed:37,speed:-.072,tilt:[1.05,.42,-1.12],opacity:.34,width:1.2,packets:4},{radiusX:2.24,radiusZ:1.86,seed:41,speed:.055,tilt:[.72,1.05,.42],opacity:.28,width:1,packets:3},{radiusX:2.46,radiusZ:2.08,seed:43,speed:-.048,tilt:[1.38,.12,.08],opacity:.25,width:1,packets:2}];function J(e){return()=>{let n=e+=1831565813;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}function W(e){return e==="speaking"?1.52:e==="thinking"?1.28:e==="listening"?.82:1}function O(e){return e==="speaking"?1.85:e==="thinking"?1.42:e==="listening"?.46:1}const le={uniforms:{uTime:{value:0},uEnergy:{value:1},uOpacity:{value:1},uColor:{value:Y}},vertexShader:`
    attribute float aPhase;
    attribute float aIntensity;
    varying float vFront;
    varying float vPhase;
    varying float vIntensity;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mv;
      vFront = smoothstep(-9.4, -5.2, mv.z);
      vPhase = aPhase;
      vIntensity = aIntensity;
    }
  `,fragmentShader:`
    uniform float uTime;
    uniform float uEnergy;
    uniform float uOpacity;
    uniform vec3 uColor;
    varying float vFront;
    varying float vPhase;
    varying float vIntensity;
    void main() {
      float pulse = pow(0.5 + 0.5 * sin(uTime * (1.1 + vIntensity * 2.4) + vPhase), 3.0);
      float packet = smoothstep(0.89, 1.0, sin(vPhase * 8.0 - uTime * 2.6));
      float alpha = uOpacity * (0.18 + vIntensity * 0.46 + packet * 0.44) * mix(0.18, 1.0, vFront);
      alpha *= mix(0.72, 1.18, pulse) * uEnergy;
      gl_FragColor = vec4(uColor, alpha);
    }
  `};function Be(){return{uniforms:Ie.clone(le.uniforms),vertexShader:le.vertexShader,fragmentShader:le.fragmentShader}}function vt(){const e=J(54421),n=[],r=[],s=[];for(let a=0;a<12;a+=1){const c=e()*Math.PI*2,i=Math.acos(2*e()-1),l=new M(Math.sin(i)*Math.cos(c),Math.cos(i),Math.sin(i)*Math.sin(c)),f=a%4===0?2.05+e()*.38:1.1+e()*.66,m=l.clone().multiplyScalar((e()-.5)*.22),p=l.clone().multiplyScalar(-f).add(m),d=l.clone().multiplyScalar(f).add(m.multiplyScalar(.35));n.push(p.x,p.y,p.z,d.x,d.y,d.z),r.push(e()*6.28,e()*6.28),s.push(a%4===0?.92:.44+e()*.32,a%4===0?.92:.44+e()*.32)}const o=new _;return o.setAttribute("position",new R(n,3)),o.setAttribute("aPhase",new R(r,1)),o.setAttribute("aIntensity",new R(s,1)),o}function xt(e){const n=J(e.seed*313),r=[],s=[],o=[],a=240,c=n()*Math.PI*2,i=n()*Math.PI*2;for(let f=0;f<a;f+=1){const m=f/a*Math.PI*2,p=(f+1)/a*Math.PI*2;if(Math.abs(Math.sin((m-c)*1.5))<.13||Math.abs(Math.sin((m-i)*2))<.11||(f+e.seed)%23===0)continue;const g=1+Math.sin(m*5+e.seed)*.018+(n()-.5)*.01,x=1+Math.sin(p*5+e.seed)*.018+(n()-.5)*.01,y=Math.sin(m*3+e.seed)*.025,j=Math.sin(p*3+e.seed)*.025;r.push(Math.cos(m)*e.radiusX*g,y,Math.sin(m)*e.radiusZ*g),r.push(Math.cos(p)*e.radiusX*x,j,Math.sin(p)*e.radiusZ*x),s.push(m+e.seed,p+e.seed),o.push(.55+n()*.45,.55+n()*.45)}const l=new _;return l.setAttribute("position",new R(r,3)),l.setAttribute("aPhase",new R(s,1)),l.setAttribute("aIntensity",new R(o,1)),l}function Mt(e){const n=J(e.seed*791),r=[],s=96;for(let o=0;o<s;o+=1){const a=o/s*Math.PI*2,c=1+Math.sin(a*3+e.seed)*.018+(n()-.5)*.008;r.push(new M(Math.cos(a)*e.radiusX*c,Math.sin(a*2+e.seed)*.018,Math.sin(a)*e.radiusZ*c))}return new ve(r,!0,"centripetal",.5)}function yt({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useRef(null);return v(({clock:a},c)=>{const i=a.elapsedTime,l=O(e),f=W(e);if(n.current){const m=e==="speaking"?Math.sin(i*7.2)*.075:Math.sin(i*2.2)*.025;n.current.scale.setScalar((1+m)*(.98+f*.035)),n.current.rotation.y+=c*.18*l}r.current&&(r.current.rotation.x+=c*.42*l),s.current&&(s.current.rotation.y-=c*.34*l),o.current&&(o.current.rotation.z+=c*.27*l)}),t.jsxs("group",{ref:n,children:[t.jsxs("mesh",{children:[t.jsx("sphereGeometry",{args:[.105,32,32]}),t.jsx("meshBasicMaterial",{color:xe,toneMapped:!1})]}),t.jsxs("mesh",{scale:1+W(e)*.075,children:[t.jsx("sphereGeometry",{args:[.31,32,32]}),t.jsx("meshBasicMaterial",{blending:h,color:T,depthWrite:!1,opacity:.32,toneMapped:!1,transparent:!0})]}),t.jsxs("mesh",{scale:1.72,children:[t.jsx("sphereGeometry",{args:[.42,32,32]}),t.jsx("meshBasicMaterial",{blending:h,color:Y,depthWrite:!1,opacity:.092,toneMapped:!1,transparent:!0})]}),t.jsxs("mesh",{ref:r,rotation:[.3,.2,.1],children:[t.jsx("torusKnotGeometry",{args:[.34,.018,180,5,2,3]}),t.jsx("meshBasicMaterial",{blending:h,color:T,depthWrite:!1,toneMapped:!1})]}),t.jsxs("mesh",{ref:s,rotation:[1.1,.4,.8],scale:1.18,children:[t.jsx("torusKnotGeometry",{args:[.34,.011,180,4,3,5]}),t.jsx("meshBasicMaterial",{blending:h,color:Y,depthWrite:!1,opacity:.72,toneMapped:!1,transparent:!0})]}),t.jsxs("mesh",{ref:o,rotation:[.2,1.2,.5],scale:1.42,children:[t.jsx("torusKnotGeometry",{args:[.34,.008,180,4,2,5]}),t.jsx("meshBasicMaterial",{blending:h,color:Me,depthWrite:!1,opacity:.48,toneMapped:!1,transparent:!0})]})]})}function jt({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(vt,[]),o=u.useMemo(Be,[]);return v(({clock:a},c)=>{r.current&&(r.current.uniforms.uTime.value=a.elapsedTime*1.28,r.current.uniforms.uEnergy.value=W(e)*(e==="speaking"?1.34:.96),r.current.uniforms.uOpacity.value=e==="listening"?.26:e==="speaking"?.48:.38,r.current.uniforms.uColor.value.copy(T)),n.current&&(n.current.rotation.y+=c*.035*O(e),n.current.rotation.z-=c*.018)}),t.jsx("group",{ref:n,children:t.jsx("lineSegments",{geometry:s,children:t.jsx("shaderMaterial",{ref:r,args:[o],blending:h,depthWrite:!1,toneMapped:!1,transparent:!0})})})}function bt({activity:e,index:n,spec:r}){const s=u.useRef(null),o=u.useRef(null),a=u.useMemo(()=>xt(r),[r]),c=u.useMemo(Be,[]);return v(({clock:i},l)=>{const f=O(e);if(s.current){s.current.rotation.y+=l*r.speed*f,s.current.rotation.z+=l*r.speed*.28*f;const m=1+Math.sin(i.elapsedTime*.8+r.seed)*.004*W(e);s.current.scale.setScalar(m)}o.current&&(o.current.uniforms.uTime.value=i.elapsedTime+n*.71,o.current.uniforms.uEnergy.value=W(e),o.current.uniforms.uOpacity.value=r.opacity,o.current.uniforms.uColor.value.copy(n<3?T:n>6?Me:Y))}),t.jsx("group",{ref:s,rotation:r.tilt,children:t.jsx("lineSegments",{geometry:a,children:t.jsx("shaderMaterial",{ref:o,args:[c],blending:h,depthWrite:!1,toneMapped:!1,transparent:!0})})})}function wt({activity:e,index:n,spec:r}){const s=u.useRef(null),o=u.useMemo(()=>new Ge(Mt(r),220,r.width*.011,5,!0),[r]);return v(({clock:a},c)=>{if(!s.current)return;const i=O(e);s.current.rotation.y+=c*r.speed*.72*i,s.current.rotation.z+=c*r.speed*.18*i;const l=s.current.material;l.color.copy(n%2===0?T:Y),l.opacity=(.32+r.opacity*.58)*(.82+Math.sin(a.elapsedTime*(.95+n*.14)+r.seed)*.18)*W(e)}),t.jsx("group",{rotation:r.tilt,children:t.jsx("mesh",{ref:s,geometry:o,children:t.jsx("meshBasicMaterial",{blending:h,color:T,depthWrite:!1,opacity:.74,toneMapped:!1,transparent:!0})})})}function St({activity:e}){const n=u.useRef(null),r=u.useMemo(()=>{const i=[];return k.forEach((l,f)=>{for(let m=0;m<l.packets;m+=1)i.push({orbit:f,phase:((m+1)/(l.packets+1)+l.seed*.013)%1,speed:Math.abs(l.speed)*(.72+m*.16),size:.045+(m+f)%3*.018,offset:(m-l.packets*.5)*.012})}),i},[]),s=u.useMemo(()=>{const i=new _;return i.setAttribute("position",new G(new Float32Array(r.length*3),3)),i.setAttribute("aSize",new G(new Float32Array(r.map(l=>l.size)),1)),i},[r]),o=u.useMemo(()=>k.map(i=>new Ke().makeRotationFromEuler(new ke(...i.tilt))),[]),a=u.useMemo(()=>new M,[]);v(({clock:i})=>{if(!n.current)return;const l=s.getAttribute("position"),f=O(e);r.forEach((m,p)=>{const d=k[m.orbit],x=(m.phase+i.elapsedTime*m.speed*f)%1*Math.PI*2;a.set(Math.cos(x)*d.radiusX,Math.sin(x*3+d.seed)*.025+m.offset,Math.sin(x)*d.radiusZ),a.applyMatrix4(o[m.orbit]),l.setXYZ(p,a.x,a.y,a.z)}),l.needsUpdate=!0});const c=u.useMemo(()=>({uniforms:{uColor:{value:T}},vertexShader:`
        attribute float aSize;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aSize * (64.0 / max(1.0, -mv.z));
        }
      `,fragmentShader:`
        uniform vec3 uColor;
        void main() {
          float core = smoothstep(0.46, 0.02, length(gl_PointCoord - 0.5));
          float haze = smoothstep(0.5, 0.02, length(gl_PointCoord - 0.5)) * 0.35;
          gl_FragColor = vec4(uColor, core + haze);
        }
      `}),[]);return t.jsx("points",{ref:n,geometry:s,children:t.jsx("shaderMaterial",{args:[c],blending:h,depthWrite:!1,toneMapped:!1,transparent:!0})})}function Et({activity:e}){const n=u.useRef(null);return v(({clock:r})=>{if(!n.current)return;const s=e==="speaking"?Math.sin(r.elapsedTime*6.8)*.018:0;n.current.scale.setScalar(1+s)}),t.jsxs("group",{ref:n,children:[[k[1],k[3],k[5],k[7]].map((r,s)=>t.jsx(wt,{activity:e,index:s,spec:r},`major-${r.seed}`)),k.map((r,s)=>t.jsx(bt,{activity:e,index:s,spec:r},r.seed)),t.jsx(St,{activity:e})]})}function Tt({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(()=>{const a=J(91822),c=760,i=new Float32Array(c*3),l=new Float32Array(c),f=new Float32Array(c);for(let p=0;p<c;p+=1){const d=a()*Math.PI*2,g=.52+Math.pow(a(),1.8)*.92;i[p*3]=Math.cos(d)*g,i[p*3+1]=(a()-.5)*.055,i[p*3+2]=Math.sin(d)*g*(.78+a()*.18),l[p]=d+a()*3,f[p]=1.2+a()*3.8}const m=new _;return m.setAttribute("position",new G(i,3)),m.setAttribute("aPhase",new G(l,1)),m.setAttribute("aSize",new G(f,1)),m},[]),o=u.useMemo(()=>({uniforms:{uTime:{value:0},uEnergy:{value:1},uColor:{value:T}},vertexShader:`
        attribute float aPhase;
        attribute float aSize;
        uniform float uTime;
        uniform float uEnergy;
        varying float vAlpha;
        void main() {
          vec3 p = position;
          float spin = uTime * (0.18 + fract(aPhase) * 0.08) * uEnergy;
          float c = cos(spin);
          float s = sin(spin);
          p.xz = mat2(c, -s, s, c) * p.xz;
          p.y += sin(uTime * 1.7 + aPhase * 2.0) * 0.014 * uEnergy;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aSize * (22.0 / max(1.0, -mv.z));
          vAlpha = (0.38 + 0.62 * pow(0.5 + 0.5 * sin(uTime * 2.0 + aPhase * 7.0), 4.0)) * uEnergy;
        }
      `,fragmentShader:`
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float mask = smoothstep(0.5, 0.05, length(gl_PointCoord - 0.5));
          gl_FragColor = vec4(uColor, mask * vAlpha * 0.78);
        }
      `}),[]);return v(({clock:a},c)=>{r.current&&(r.current.uniforms.uTime.value=a.elapsedTime,r.current.uniforms.uEnergy.value=W(e),r.current.uniforms.uColor.value.copy(T)),n.current&&(n.current.rotation.x=.58+Math.sin(a.elapsedTime*.12)*.035,n.current.rotation.y+=c*.08*O(e),n.current.rotation.z=-.18)}),t.jsx("points",{ref:n,geometry:s,children:t.jsx("shaderMaterial",{ref:r,args:[o],blending:h,depthWrite:!1,toneMapped:!1,transparent:!0})})}function Rt(){const e=J(55123);return Array.from({length:14},(n,r)=>{const s=r/14*Math.PI*2+e()*.32,o=new ke(e()*1.4,e()*1.1,e()*1.2),a=Array.from({length:6},(c,i)=>{const l=i/5,f=.28+l*(1.76+e()*.38),m=s+Math.sin(l*Math.PI*2+r)*.28;return new M(Math.cos(m)*f,Math.sin(l*Math.PI*1.5+r)*.26,Math.sin(m)*f*(.74+e()*.22)).applyEuler(o)});return new ve(a,!1,"centripetal",.44)})}function Pt({activity:e}){const n=u.useRef(null),r=u.useMemo(()=>Rt(),[]),s=u.useMemo(()=>Array.from({length:56},(c,i)=>({curve:i%r.length,phase:i*19%56/56,speed:.08+i%6*.012})),[r.length]),o=u.useMemo(()=>{const c=new _;return c.setAttribute("position",new G(new Float32Array(s.length*3),3)),c},[s.length]),a=u.useMemo(()=>new M,[]);return v(({clock:c})=>{if(!n.current)return;const i=o.getAttribute("position"),l=O(e);s.forEach((f,m)=>{const p=(f.phase+c.elapsedTime*f.speed*l)%1;r[f.curve].getPointAt(p,a);const d=e==="speaking"?1+Math.sin(c.elapsedTime*7+m)*.025:1;i.setXYZ(m,a.x*d,a.y*d,a.z*d)}),i.needsUpdate=!0}),t.jsx("points",{ref:n,geometry:o,children:t.jsx("pointsMaterial",{blending:h,color:xe,depthWrite:!1,opacity:.76,size:.046,sizeAttenuation:!0,toneMapped:!1,transparent:!0})})}function zt({activity:e}){const n=u.useRef(null),r=u.useMemo(()=>({uniforms:{uEnergy:{value:1},uColor:{value:fe}},vertexShader:`
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
          vec4 world = modelMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vView = normalize(cameraPosition - world.xyz);
          gl_Position = projectionMatrix * viewMatrix * world;
        }
      `,fragmentShader:`
        uniform float uEnergy;
        uniform vec3 uColor;
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
          float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 4.5);
          gl_FragColor = vec4(uColor, fresnel * 0.0022 * uEnergy);
        }
      `}),[]);return v(()=>{n.current&&(n.current.uniforms.uEnergy.value=W(e),n.current.uniforms.uColor.value.copy(fe))}),t.jsxs("mesh",{scale:[1.04,1.04,1.04],children:[t.jsx("sphereGeometry",{args:[2.18,48,48]}),t.jsx("shaderMaterial",{ref:n,args:[r],blending:h,depthWrite:!1,side:qe,toneMapped:!1,transparent:!0})]})}function Te({activity:e,palette:n="gold"}){return gt(n),t.jsxs("group",{children:[t.jsx(zt,{activity:e}),t.jsx("group",{scale:n==="violet"?.46:1,children:t.jsx(dt,{activity:e,palette:n})}),t.jsx(Pt,{activity:e}),t.jsx(yt,{activity:e}),t.jsx(Tt,{activity:e}),t.jsx(jt,{activity:e}),t.jsx(Et,{activity:e})]})}function b(e){return e==="speaking"?1.42:e==="thinking"?1.24:e==="listening"?.78:1}function w(e){return e==="speaking"?1.7:e==="thinking"?1.28:e==="listening"?.62:.86}function N(e,n,r=0){const s=e==="speaking"?8.4:e==="thinking"?4.6:e==="listening"?1.2:1.8,o=e==="speaking"?.12:e==="thinking"?.065:e==="listening"?.025:.038;return 1+Math.sin(n*s+r)*o}function S(e){let n=e>>>0;return()=>(n=n*1664525+1013904223>>>0,n/4294967296)}function ae(e){const n=new Float32Array(e.length*6);e.forEach(([s,o],a)=>{const c=a*6;n[c]=s.x,n[c+1]=s.y,n[c+2]=s.z,n[c+3]=o.x,n[c+4]=o.y,n[c+5]=o.z});const r=new _;return r.setAttribute("position",new G(n,3)),r}function Fe(e){const n=[];return e.forEach(r=>{for(let s=1;s<r.length;s+=1)n.push([r[s-1],r[s]])}),ae(n)}const z="#dcfbff",D="#22b8ff",At="#0757ff",Ct="#020713",It=`
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,kt=`
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - abs(dot(viewDir, normalize(vNormal))), 2.15);

    vec2 grid = abs(fract(vUv * 7.0) - 0.5);
    float circuit = 1.0 - smoothstep(0.012, 0.045, min(grid.x, grid.y));
    float scan = smoothstep(0.62, 1.0, sin((vUv.x + vUv.y) * 22.0 - uTime * 4.2) * 0.5 + 0.5);
    float chip = step(0.84, hash(floor(vUv * 11.0) + floor(uTime * 2.0))) * 0.28;

    vec3 ice = vec3(0.86, 0.98, 1.0);
    vec3 cyan = vec3(0.13, 0.72, 1.0);
    vec3 deep = vec3(0.03, 0.20, 0.86);
    vec3 color = mix(deep, cyan, 0.45 + circuit * 0.35);
    color = mix(color, ice, fresnel * 0.9 + scan * circuit * 0.45 + chip);

    float edge = smoothstep(0.42, 0.5, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    float alpha = 0.08 + fresnel * 0.58 + edge * 0.38 + circuit * scan * 0.22;
    alpha *= 0.72 + uEnergy * 0.36;
    gl_FragColor = vec4(color * (1.2 + uEnergy * 0.45), clamp(alpha, 0.0, 0.96));
  }
`,Gt=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Wt=`
  uniform float uTime;
  uniform float uEnergy;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    float core = 1.0 - smoothstep(0.0, 0.48, abs(vUv.y - 0.5));
    float taper = smoothstep(0.0, 0.14, vUv.x) * (1.0 - smoothstep(0.78, 1.0, vUv.x));
    float pulse = 0.65 + 0.35 * sin(uTime * 5.8 + vUv.x * 20.0);
    gl_FragColor = vec4(uColor * (1.35 + pulse * 0.8), core * taper * (0.09 + uEnergy * 0.11));
  }
`;function Lt(){const e=[];for(const r of[-1,1])for(const s of[-1,1])for(const o of[-1,1])for(const a of[-1,1])e.push([r,s,o,a]);const n=[];for(let r=0;r<e.length;r+=1)for(let s=r+1;s<e.length;s+=1){let o=0;for(let a=0;a<4;a+=1)e[r][a]!==e[s][a]&&(o+=1);o===1&&n.push([r,s])}return{baseVertices:e,edges:n,positions:new Float32Array(n.length*6)}}function _t(){const e=S(88201),n=[],r=[{axis:"z",sign:1},{axis:"z",sign:-1},{axis:"x",sign:1},{axis:"x",sign:-1},{axis:"y",sign:1},{axis:"y",sign:-1}],s=(o,a,c,i)=>{const l=a*.995;return o==="z"?new M(c,i,l):o==="x"?new M(l,c,i):new M(c,l,i)};return r.forEach((o,a)=>{for(let c=0;c<20;c+=1){const i=-.72+Math.floor(e()*7)*.24,l=-.88+e()*.24,f=.32+e()*.82,m=l+f*(.35+e()*.35),p=i+(e()>.5?1:-1)*(.08+e()*.18),d=c%2===0,g=d?s(o.axis,o.sign,l,i):s(o.axis,o.sign,i,l),x=d?s(o.axis,o.sign,m,i):s(o.axis,o.sign,i,m),y=d?s(o.axis,o.sign,m,p):s(o.axis,o.sign,p,m),j=d?s(o.axis,o.sign,Math.min(.92,l+f),p):s(o.axis,o.sign,p,Math.min(.92,l+f));if(n.push([g,x],[x,y],[y,j]),(c+a)%4===0){const Q=d?s(o.axis,o.sign,j.x||j.z,p+.055):s(o.axis,o.sign,p+.055,j.y||j.z);n.push([y,Q])}}}),ae(n)}function Bt(){const e=S(64043),n=[];for(let r=0;r<68;r+=1){const s=e()*Math.PI*2,o=(e()-.5)*2.8,a=1.35+e()*1.7,c=new M(Math.cos(s)*a,o,Math.sin(s)*a*.76),i=c.clone().add(new M((e()-.5)*.16,(e()-.5)*.16,(e()-.5)*.16));n.push([c,i])}return ae(n)}function Ft({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null);return v(({clock:o},a)=>{const c=o.elapsedTime,i=b(e),l=N(e,c,.8);n.current&&(n.current.rotation.x+=a*.72*w(e),n.current.rotation.y-=a*.58*w(e),n.current.scale.setScalar(.92+(l-1)*1.8)),r.current&&r.current.scale.setScalar(1.25+Math.sin(c*4.8)*.1*i),s.current&&(s.current.intensity=5.8+i*4.8+Math.sin(c*7.2)*1.3)}),t.jsxs("group",{children:[t.jsxs("mesh",{ref:r,children:[t.jsx("sphereGeometry",{args:[.52,48,48]}),t.jsx("meshBasicMaterial",{blending:h,color:D,depthWrite:!1,opacity:.22,toneMapped:!1,transparent:!0})]}),t.jsxs("mesh",{ref:n,children:[t.jsx("octahedronGeometry",{args:[.26,2]}),t.jsx("meshBasicMaterial",{color:z,toneMapped:!1})]}),t.jsx("pointLight",{ref:s,color:z,distance:9,intensity:8})]})}function Ut({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useRef(null),a=u.useMemo(()=>new Se(1.88,1.88,1.88,10,10,10),[]),c=u.useMemo(_t,[]),i=u.useMemo(()=>[1.94,1.48,1.08,.62].map(l=>{const f=new Se(l,l,l),m=new et(f);return f.dispose(),m}),[]);return u.useEffect(()=>()=>{a.dispose(),c.dispose(),i.forEach(l=>l.dispose())},[c,a,i]),v(({clock:l},f)=>{const m=l.elapsedTime,p=b(e),d=w(e);n.current&&(n.current.rotation.y+=f*.13*d,n.current.rotation.x=.62+Math.sin(m*.21)*.08,n.current.rotation.z=.78+Math.cos(m*.18)*.045,n.current.scale.setScalar(1+Math.sin(m*1.8)*.012*p)),r.current&&(r.current.uniforms.uTime.value=m,r.current.uniforms.uEnergy.value=p),s.current&&(s.current.rotation.y-=f*.06*d,s.current.rotation.x+=f*.025*d),o.current&&(o.current.rotation.y-=f*.08*d,o.current.rotation.z+=f*.03*d)}),t.jsxs("group",{ref:n,children:[t.jsx("mesh",{geometry:a,children:t.jsx("meshPhysicalMaterial",{clearcoat:1,clearcoatRoughness:.035,color:"#9be8ff",depthWrite:!1,envMapIntensity:1.6,ior:1.58,metalness:.08,opacity:.34,reflectivity:1,roughness:.045,transmission:.78,transparent:!0})}),t.jsx("mesh",{geometry:a,scale:1.006,children:t.jsx("shaderMaterial",{ref:r,blending:h,depthWrite:!1,fragmentShader:kt,transparent:!0,uniforms:{uTime:{value:0},uEnergy:{value:1}},vertexShader:It})}),t.jsx("lineSegments",{ref:s,geometry:c,children:t.jsx("lineBasicMaterial",{blending:h,color:z,depthWrite:!1,opacity:.58,toneMapped:!1,transparent:!0})}),t.jsx("group",{ref:o,children:i.map((l,f)=>t.jsx("lineSegments",{geometry:l,rotation:[f*.17,f*.21,f*.13],children:t.jsx("lineBasicMaterial",{blending:h,color:f<2?z:D,depthWrite:!1,opacity:.72-f*.09,toneMapped:!1,transparent:!0})},f))}),t.jsx(Ft,{activity:e})]})}function Ot({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(()=>new K,[]),o=u.useMemo(Lt,[]),a=u.useMemo(()=>new Qe(1,10,10),[]),c=u.useMemo(()=>{const i=new _;return i.setAttribute("position",new G(o.positions,3)),i},[o.positions]);return u.useEffect(()=>()=>{c.dispose(),a.dispose()},[c,a]),v(({clock:i})=>{const l=i.elapsedTime,f=w(e),m=b(e),p=[],d=l*.24*f,g=l*.18*f,x=l*.15*f,y=Math.cos(d),j=Math.sin(d),Q=Math.cos(g),je=Math.sin(g),be=Math.cos(x),we=Math.sin(x);o.baseVertices.forEach(([H,B,V,A])=>{let C=H,I=B,F=V,U=A;const De=C*y-U*j,Ve=C*j+U*y;C=De,U=Ve;const Xe=I*Q-F*je,Ze=I*je+F*Q;I=Xe,F=Ze;const Ye=F*be-U*we,Ne=F*we+U*be;F=Ye,U=Ne;const ie=2.35/(2.95-U);p.push(new M(C*ie,I*ie,F*ie).multiplyScalar(.98))}),o.edges.forEach(([H,B],V)=>{const A=V*6,C=p[H],I=p[B];o.positions[A]=C.x,o.positions[A+1]=C.y,o.positions[A+2]=C.z,o.positions[A+3]=I.x,o.positions[A+4]=I.y,o.positions[A+5]=I.z}),c.attributes.position.needsUpdate=!0,n.current&&n.current.scale.setScalar(1.04+Math.sin(l*2.8)*.018*m),r.current&&(p.forEach((H,B)=>{var V;s.position.copy(H),s.scale.setScalar(.04+B%3*.006+Math.sin(l*4.4+B)*.006*m),s.updateMatrix(),(V=r.current)==null||V.setMatrixAt(B,s.matrix)}),r.current.instanceMatrix.needsUpdate=!0)}),t.jsxs("group",{rotation:[.56,.28,.1],scale:1.18,children:[t.jsx("lineSegments",{ref:n,geometry:c,children:t.jsx("lineBasicMaterial",{blending:h,color:D,depthWrite:!1,opacity:.68,toneMapped:!1,transparent:!0})}),t.jsx("instancedMesh",{ref:r,args:[a,void 0,16],children:t.jsx("meshBasicMaterial",{blending:h,color:z,depthWrite:!1,toneMapped:!1})})]})}function Dt({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(()=>new Je(5.8,.26),[]);u.useEffect(()=>()=>s.dispose(),[s]),v(({clock:a},c)=>{const i=a.elapsedTime,l=w(e);n.current&&(n.current.rotation.z+=c*.08*l,n.current.scale.setScalar(1+Math.sin(i*3.6)*.025*b(e))),r.current&&(r.current.uniforms.uTime.value=i,r.current.uniforms.uEnergy.value=b(e))});const o=[[0,0,0],[0,0,Math.PI/2],[.55,Math.PI/2,0],[-.55,Math.PI/2,0],[0,0,Math.PI/4],[0,0,-Math.PI/4]];return t.jsx("group",{ref:n,children:o.map((a,c)=>t.jsx("mesh",{geometry:s,rotation:a,children:t.jsx("shaderMaterial",{ref:c===0?r:void 0,blending:h,depthWrite:!1,fragmentShader:Wt,transparent:!0,uniforms:{uTime:{value:0},uEnergy:{value:1},uColor:{value:new L(c<2?z:D)}},vertexShader:Gt})},c))})}function Vt({activity:e}){const r=u.useRef(null),s=u.useMemo(()=>new Float32Array(520*3),[]),o=u.useMemo(()=>{const a=S(37111);return Array.from({length:520},()=>({radius:1.7+a()*2.6,angle:a()*Math.PI*2,y:(a()-.5)*3.6,speed:(.08+a()*.44)*(a()>.5?1:-1),wobble:a()*Math.PI*2,band:a()>.76}))},[]);return v(({clock:a})=>{const c=a.elapsedTime,i=w(e),l=b(e);for(let f=0;f<520;f+=1){const m=o[f],p=m.angle+c*m.speed*i,d=m.radius+Math.sin(c*.8+m.wobble)*.08*l;s[f*3]=Math.cos(p)*d,s[f*3+1]=m.band?Math.sin(p*3)*.34:m.y,s[f*3+2]=Math.sin(p)*d*.62}r.current&&(r.current.rotation.x=.36,r.current.rotation.y=c*.018,r.current.geometry.attributes.position.needsUpdate=!0)}),t.jsxs("points",{ref:r,children:[t.jsx("bufferGeometry",{children:t.jsx("bufferAttribute",{attach:"attributes-position",args:[s,3]})}),t.jsx("pointsMaterial",{blending:h,color:z,depthWrite:!1,opacity:.52,size:.028,sizeAttenuation:!0,toneMapped:!1,transparent:!0})]})}function Xt({activity:e}){const n=u.useRef(null),r=u.useMemo(Bt,[]);return u.useEffect(()=>()=>r.dispose(),[r]),v(({clock:s},o)=>{n.current&&(n.current.rotation.y+=o*.025*w(e),n.current.rotation.z=Math.sin(s.elapsedTime*.22)*.08)}),t.jsx("lineSegments",{ref:n,geometry:r,children:t.jsx("lineBasicMaterial",{blending:h,color:D,depthWrite:!1,opacity:.42,toneMapped:!1,transparent:!0})})}function Zt({activity:e}){const n=u.useRef(null);return v(({clock:r},s)=>{n.current&&(n.current.rotation.y+=s*.16*w(e),n.current.scale.setScalar(1+Math.sin(r.elapsedTime*2.2)*.018*b(e)))}),t.jsx("group",{ref:n,children:[{radius:2.3,tube:.007,rotation:[Math.PI/2,0,0]},{radius:2.08,tube:.005,rotation:[1.12,.2,.46]},{radius:1.72,tube:.004,rotation:[.42,1.05,-.18]}].map((r,s)=>t.jsxs("mesh",{rotation:r.rotation,children:[t.jsx("torusGeometry",{args:[r.radius,r.tube,6,160]}),t.jsx("meshBasicMaterial",{blending:h,color:s===0?z:D,depthWrite:!1,opacity:.18+s*.08,toneMapped:!1,transparent:!0})]},s))})}function Yt(){const n=u.useMemo(()=>{const s=S(2048),o=new Float32Array(700*3);for(let a=0;a<700;a+=1){const c=s()*Math.PI*2,i=Math.acos(2*s()-1),l=5+s()*7.5;o[a*3]=l*Math.sin(i)*Math.cos(c),o[a*3+1]=l*Math.sin(i)*Math.sin(c),o[a*3+2]=l*Math.cos(i)}return o},[]),r=u.useRef(null);return v(({clock:s})=>{r.current&&(r.current.rotation.y=s.elapsedTime*.004)}),t.jsxs("points",{ref:r,children:[t.jsx("bufferGeometry",{children:t.jsx("bufferAttribute",{attach:"attributes-position",args:[n,3]})}),t.jsx("pointsMaterial",{blending:h,color:"#ffffff",depthWrite:!1,opacity:.38,size:.018,sizeAttenuation:!0,toneMapped:!1,transparent:!0})]})}function Nt({children:e}){const n=u.useRef(null),{gl:r}=re(),s=u.useRef(!1),o=u.useRef(1);return u.useEffect(()=>{const a=r.domElement,c=()=>{s.current=!0},i=()=>{s.current=!1};return a.addEventListener("pointerenter",c),a.addEventListener("pointerleave",i),()=>{a.removeEventListener("pointerenter",c),a.removeEventListener("pointerleave",i)}},[r.domElement]),v(()=>{o.current=E.lerp(o.current,s.current?1.1:1,.06),n.current&&n.current.scale.setScalar(o.current)}),t.jsx("group",{ref:n,children:e})}function Ht({activity:e="idle"}){return t.jsxs("group",{name:"blue-space-tesseract-ai-core",scale:.96,children:[t.jsx("color",{attach:"background",args:[Ct]}),t.jsx("ambientLight",{color:At,intensity:.42}),t.jsx("directionalLight",{color:z,intensity:1.45,position:[3,4,5]}),t.jsx("pointLight",{color:D,distance:11,intensity:2.4,position:[-2.4,1.2,2.2]}),t.jsxs(Nt,{children:[t.jsx(Yt,{}),t.jsx(Vt,{activity:e}),t.jsx(Xt,{activity:e}),t.jsx(Zt,{activity:e}),t.jsx(Dt,{activity:e}),t.jsx(Ot,{activity:e}),t.jsx(Ut,{activity:e})]})]})}const me="#ff203c",Ue="#ff4b56",$t="#ffc35a",qt=`
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;

  // 3D Simplex noise generator
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    // Organic liquid Aether fluid deformation
    float noise1 = snoise(position * 1.5 + vec3(0.0, uTime * 0.8, uTime * 0.5));
    float noise2 = snoise(position * 3.2 - vec3(uTime * 0.6, uTime * 0.9, 0.0));
    float displacement = (noise1 * 0.22 + noise2 * 0.12) * (0.8 + uEnergy * 0.6);

    vec3 newPos = position + normal * displacement;
    vWorldPosition = (modelMatrix * vec4(newPos, 1.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`,Kt=`
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;

  void main() {
    // Swirling crimson liquid blood vein math
    float veinPattern = pow(abs(sin(vPosition.x * 12.0 + sin(vPosition.y * 10.0 + uTime * 2.5))), 10.0);
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.4);

    vec3 colDeepDark = vec3(0.12, 0.0, 0.03);
    vec3 colCrimson  = vec3(1.0, 0.094, 0.235); // #ff203c
    vec3 colGold     = vec3(1.0, 0.765, 0.353); // #ffc35a

    vec3 baseColor = mix(colDeepDark, colCrimson, fresnel * 0.85 + 0.25);
    baseColor = mix(baseColor, colGold, veinPattern * 0.9);

    float alpha = (0.55 + fresnel * 0.45 + veinPattern * 0.3) * uEnergy;
    gl_FragColor = vec4(baseColor * (0.9 + uEnergy * 0.5), alpha);
  }
`,Jt=`
  uniform float uTime;
  uniform float uEnergy;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    vec2 st = (vUv - vec2(0.5)) * 7.0;
    vec2 id = floor(st);
    vec2 f  = fract(st) - vec2(0.5);

    float n = hash(id);
    // Voronoi glass shard reality cracks
    float crack = smoothstep(0.045, 0.0, abs(f.x + f.y * (n - 0.5) * 2.2));
    float pulse = 0.4 + 0.6 * pow(abs(sin(uTime * 0.8 + n * 6.28)), 6.0);

    vec3 colCrimson = vec3(1.0, 0.094, 0.235); // #ff203c
    vec3 colGold    = vec3(1.0, 0.765, 0.353); // #ffc35a
    vec3 color = mix(colCrimson, colGold, pulse);

    float alpha = crack * pulse * 0.35 * uEnergy;
    gl_FragColor = vec4(color * 2.2, alpha);
  }
`;function Qt({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useMemo(()=>[{base:[-.65,.25,-.1],scale:[.55,.42,.45],phase:.3},{base:[.6,-.15,.05],scale:[.45,.6,.42],phase:1.5},{base:[.1,.7,-.15],scale:[.38,.5,.35],phase:2.7},{base:[-.15,-.72,-.1],scale:[.42,.48,.38],phase:4.1}],[]);return v(({clock:a},c)=>{const i=a.elapsedTime,l=w(e),f=b(e);n.current&&(n.current.rotation.y+=c*.15*l,n.current.rotation.z=Math.sin(i*.2)*.1,n.current.scale.setScalar(N(e,i,.8))),r.current&&(r.current.uniforms.uTime.value=i,r.current.uniforms.uEnergy.value=f),s.current&&s.current.children.forEach((m,p)=>{const d=o[p];if(!d)return;m.position.set(d.base[0]+Math.sin(i*.8*l+d.phase)*.12,d.base[1]+Math.cos(i*.65*l+d.phase)*.1,d.base[2]+Math.sin(i*.5*l+d.phase)*.14);const g=1+Math.sin(i*3+d.phase)*.1*f;m.scale.set(d.scale[0]*g,d.scale[1]/g,d.scale[2]*g)})}),t.jsxs("group",{position:[0,0,0],children:[t.jsxs("mesh",{ref:n,children:[t.jsx("icosahedronGeometry",{args:[.82,32]}),t.jsx("shaderMaterial",{ref:r,vertexShader:qt,fragmentShader:Kt,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:h,depthWrite:!1,transparent:!0})]}),t.jsx("group",{ref:s,children:o.map((a,c)=>t.jsxs("mesh",{position:a.base,scale:a.scale,children:[t.jsx("icosahedronGeometry",{args:[1,16]}),t.jsx("meshStandardMaterial",{color:"#3a0009",emissive:c%2===0?me:Ue,emissiveIntensity:1.8,metalness:.1,roughness:.3,transparent:!0,opacity:.82})]},c))}),t.jsx("pointLight",{color:me,intensity:3.5,distance:5,decay:2})]})}function en({activity:e}){const n=u.useRef(null);return v(({clock:r})=>{n.current&&(n.current.uniforms.uTime.value=r.elapsedTime,n.current.uniforms.uEnergy.value=b(e))}),t.jsxs("mesh",{position:[0,0,-1.6],scale:[5.8,4.4,1],children:[t.jsx("planeGeometry",{args:[1,1]}),t.jsx("shaderMaterial",{ref:n,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:Jt,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:h,depthWrite:!1,transparent:!0})]})}function tn({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(()=>new K,[]),o=22,a=u.useMemo(()=>{const c=S(2026);return Array.from({length:o},(i,l)=>({angle:l/o*Math.PI*2,radius:2.1+(c()-.5)*.35,height:.7+c()*.5,z:-.6+(c()-.5)*.6,tilt:(c()-.5)*.3,phase:c()*Math.PI*2}))},[]);return v(({clock:c})=>{if(!n.current||!r.current)return;const i=c.elapsedTime,l=w(e);a.forEach((f,m)=>{var y,j;const p=f.angle+i*.03*l,d=Math.sin(i*.8+f.phase)*.08,g=Math.cos(p)*f.radius,x=Math.sin(p)*f.radius*.65+d;s.position.set(g,x,f.z),s.rotation.set(f.tilt,-.2,p+Math.PI/2),s.scale.set(.18,f.height,.12),s.updateMatrix(),(y=n.current)==null||y.setMatrixAt(m,s.matrix),s.position.set(g*1.004,x*1.004,f.z+.07),s.rotation.set(0,0,p+Math.PI/2),s.scale.set(.11,.04,.015),s.updateMatrix(),(j=r.current)==null||j.setMatrixAt(m,s.matrix)}),n.current.instanceMatrix.needsUpdate=!0,r.current.instanceMatrix.needsUpdate=!0}),t.jsxs("group",{rotation:[.15,-.06,.08],children:[t.jsxs("instancedMesh",{ref:n,args:[void 0,void 0,o],children:[t.jsx("boxGeometry",{args:[1,1,1]}),t.jsx("meshStandardMaterial",{color:"#1a0408",emissive:"#4a050d",emissiveIntensity:.6,metalness:.2,roughness:.8})]}),t.jsxs("instancedMesh",{ref:r,args:[void 0,void 0,o],children:[t.jsx("boxGeometry",{args:[1,1,1]}),t.jsx("meshBasicMaterial",{color:$t,blending:h,depthWrite:!1,toneMapped:!1})]})]})}function nn({activity:e}){const n=u.useRef(null),r=600,{positions:s,velocities:o}=u.useMemo(()=>{const a=S(8812),c=new Float32Array(r*3),i=new Float32Array(r*3);for(let l=0;l<r;l++)c[l*3]=(a()-.5)*5.5,c[l*3+1]=(a()-.5)*4.5,c[l*3+2]=(a()-.5)*3.5-.3,i[l*3]=(a()-.5)*.4,i[l*3+1]=.3+a()*.8,i[l*3+2]=(a()-.5)*.4;return{positions:c,velocities:i}},[]);return v((a,c)=>{if(!n.current)return;const i=n.current.geometry.attributes.position,l=i.array,f=w(e);for(let m=0;m<r;m++)l[m*3]+=o[m*3]*c*f,l[m*3+1]+=o[m*3+1]*c*f,l[m*3+2]+=o[m*3+2]*c*f,l[m*3+1]>2.5&&(l[m*3+1]=-2.5);i.needsUpdate=!0}),t.jsxs("points",{ref:n,children:[t.jsx("bufferGeometry",{children:t.jsx("bufferAttribute",{attach:"attributes-position",args:[s,3]})}),t.jsx("pointsMaterial",{color:Ue,blending:h,depthWrite:!1,opacity:.65,size:.035,sizeAttenuation:!0,toneMapped:!1,transparent:!0})]})}function rn({activity:e="idle"}){return t.jsxs("group",{name:"reality-aether-forge-mcu",scale:1.25,children:[t.jsx("ambientLight",{intensity:.5,color:me}),t.jsx(en,{activity:e}),t.jsx(nn,{activity:e}),t.jsx(tn,{activity:e}),t.jsx(Qt,{activity:e})]})}const $="#23e777",te="#66ff9f",sn="#e0ffea",X="#8c6721",Re=`
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Pe=`
  uniform float uTime;
  uniform float uEnergy;
  uniform float uDirection;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv - vec2(0.5);
    float r = length(p) * 2.0;
    float angle = atan(p.y, p.x);

    // Concentric magical glyph circles
    float ring1 = smoothstep(0.02, 0.0, abs(r - 0.42));
    float ring2 = smoothstep(0.015, 0.0, abs(r - 0.75));
    float ring3 = smoothstep(0.01, 0.0, abs(r - 0.94));

    // Rosette petalled pattern (8-fold and 16-fold eldritch symmetry)
    float petals8 = abs(cos(angle * 8.0 + uTime * 0.8 * uDirection));
    float petals16 = abs(sin(angle * 16.0 - uTime * 1.2 * uDirection));
    float pattern = smoothstep(0.65, 0.98, petals8 * (1.0 - abs(r - 0.58) * 3.0));
    float patternOuter = smoothstep(0.7, 0.99, petals16 * (1.0 - abs(r - 0.85) * 4.0));

    // Ancient glyph notches on outer ring
    float notches = step(0.85, sin(angle * 24.0 + uTime * 0.5 * uDirection)) * ring3;

    float mandala = ring1 + ring2 + ring3 + pattern * 0.8 + patternOuter * 0.9 + notches;

    vec3 colEmerald = vec3(0.137, 0.905, 0.466); // #23e777
    vec3 colMint    = vec3(0.400, 1.000, 0.623); // #66ff9f
    vec3 color = mix(colEmerald, colMint, r);

    float alpha = (mandala * 0.75) * uEnergy * smoothstep(1.0, 0.8, r);
    gl_FragColor = vec4(color * 1.8, alpha);
  }
`,on=`
  uniform float uTime;
  uniform float uEnergy;
  uniform float uReversing;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv - vec2(0.5);
    float dist = length(p) * 2.0;

    // Time loop expanding outwards then contracting back to core
    float cycle = fract(uTime * 0.5);
    float loopWave = uReversing > 0.5 ? (1.0 - cycle) : cycle;

    float width = 0.07;
    float ring = smoothstep(loopWave - width, loopWave, dist) - smoothstep(loopWave, loopWave + width, dist);
    float fade = (1.0 - dist) * (1.0 - abs(loopWave - dist));

    vec3 mint = vec3(0.4, 1.0, 0.62);
    vec3 pale = vec3(0.878, 1.0, 0.918);
    vec3 col = mix(mint, pale, ring);

    float alpha = ring * fade * 0.7 * uEnergy;
    gl_FragColor = vec4(col * 2.0, alpha);
  }
`;function ue(e,n,r){const s=new se,o=e*.14,a=Math.PI*2/n;for(let f=0;f<n;f++){const m=f*a,p=m,d=m+a*.28,g=m+a*.52,x=m+a*.78,y=e,j=e+o;f===0?s.moveTo(Math.cos(p)*y,Math.sin(p)*y):s.lineTo(Math.cos(p)*y,Math.sin(p)*y),s.lineTo(Math.cos(d)*j,Math.sin(d)*j),s.lineTo(Math.cos(g)*j,Math.sin(g)*j),s.lineTo(Math.cos(x)*y,Math.sin(x)*y)}const c=new tt,i=e*.65;for(let f=0;f<=32;f++){const m=f/32*Math.PI*2,p=Math.cos(m)*i,d=Math.sin(m)*i;f===0?c.moveTo(p,d):c.lineTo(p,d)}s.holes.push(c);const l={depth:r,bevelEnabled:!0,bevelSegments:2,steps:1,bevelSize:.015,bevelThickness:.015};return new Z(s,l)}function an({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useRef(0),a=8,c=u.useMemo(()=>{const i=new se;i.moveTo(0,0),i.quadraticCurveTo(.6,.25,1.1,.05),i.lineTo(1.2,.45),i.quadraticCurveTo(.6,.75,0,.55),i.closePath();const l={depth:.04,bevelEnabled:!0,bevelSize:.01,bevelThickness:.01};return new Z(i,l)},[]);return v(({clock:i},l)=>{const f=i.elapsedTime,m=w(e),p=e==="speaking"||e==="thinking"?.88:e==="listening"?.45:.18;if(o.current=E.lerp(o.current,p,.08),n.current&&(n.current.scale.set(N(e,f),e==="listening"?.92:1,1),n.current.rotation.y=Math.sin(f*.25)*.12),r.current&&r.current.children.forEach((d,g)=>{const x=g*Math.PI*2/a,y=o.current*.48,j=o.current*.55;d.position.x=Math.cos(x)*y,d.position.y=Math.sin(x)*y,d.rotation.z=x+j}),s.current){s.current.rotation.y+=l*1.4*m,s.current.rotation.x=Math.sin(f*.8)*.3;const d=.85+b(e)*.18+Math.sin(f*7)*.05;s.current.scale.setScalar(d)}}),t.jsxs("group",{ref:n,children:[t.jsxs("mesh",{position:[0,0,-.05],children:[t.jsx("torusGeometry",{args:[1.35,.08,16,48]}),t.jsx("meshStandardMaterial",{color:X,metalness:.88,roughness:.25,emissive:$,emissiveIntensity:.15})]}),t.jsx("group",{ref:r,position:[0,0,.02],children:Array.from({length:a},(i,l)=>t.jsx("mesh",{geometry:c,children:t.jsx("meshStandardMaterial",{color:X,metalness:.85,roughness:.22,emissive:$,emissiveIntensity:.12})},l))}),t.jsxs("mesh",{ref:s,position:[0,0,.18],children:[t.jsx("octahedronGeometry",{args:[.26,1]}),t.jsx("meshStandardMaterial",{color:"#0a8f45",emissive:$,emissiveIntensity:2.8,metalness:.2,roughness:.05,toneMapped:!1})]}),t.jsx("pointLight",{position:[0,0,.22],color:$,intensity:4.5,distance:5.5,decay:2})]})}function cn({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=e==="thinking";return v(({clock:a})=>{const c=a.elapsedTime,i=b(e),l=o?-1:1;n.current&&(n.current.uniforms.uTime.value=c,n.current.uniforms.uEnergy.value=i,n.current.uniforms.uDirection.value=l),r.current&&(r.current.uniforms.uTime.value=c*.8,r.current.uniforms.uEnergy.value=i*.9,r.current.uniforms.uDirection.value=-l),s.current&&(s.current.rotation.z=Math.sin(c*.15)*.08)}),t.jsxs("group",{ref:s,children:[t.jsxs("mesh",{position:[0,0,-.12],scale:[3.4,3.4,1],children:[t.jsx("planeGeometry",{args:[1,1]}),t.jsx("shaderMaterial",{ref:n,vertexShader:Re,fragmentShader:Pe,uniforms:{uTime:{value:0},uEnergy:{value:1},uDirection:{value:1}},blending:h,depthWrite:!1,transparent:!0})]}),t.jsxs("mesh",{position:[0,0,-.28],scale:[4.8,4.8,1],children:[t.jsx("planeGeometry",{args:[1,1]}),t.jsx("shaderMaterial",{ref:r,vertexShader:Re,fragmentShader:Pe,uniforms:{uTime:{value:0},uEnergy:{value:1},uDirection:{value:-1}},blending:h,depthWrite:!1,transparent:!0})]})]})}function ln({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useMemo(()=>ue(1.05,12,.08),[]),a=u.useMemo(()=>ue(1.55,18,.08),[]),c=u.useMemo(()=>ue(2.1,24,.08),[]);return v((i,l)=>{const f=w(e),m=e==="thinking"?-1:1;n.current&&(n.current.rotation.z+=l*.35*f*m),r.current&&(r.current.rotation.z-=l*.22*f*m),s.current&&(s.current.rotation.z+=l*.14*f*m)}),t.jsxs("group",{position:[0,0,-.35],children:[t.jsx("mesh",{ref:n,geometry:o,position:[0,0,0],children:t.jsx("meshStandardMaterial",{color:X,metalness:.82,roughness:.28,emissive:te,emissiveIntensity:.25})}),t.jsx("mesh",{ref:r,geometry:a,position:[0,0,-.06],children:t.jsx("meshStandardMaterial",{color:X,metalness:.85,roughness:.25,emissive:$,emissiveIntensity:.2})}),t.jsx("mesh",{ref:s,geometry:c,position:[0,0,-.12],children:t.jsx("meshStandardMaterial",{color:X,metalness:.88,roughness:.22,emissive:te,emissiveIntensity:.18})})]})}function un({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=48,o=u.useMemo(()=>new K,[]),a=u.useMemo(()=>{const i=[],l=S(452);for(let f=0;f<6;f++){const m=f%2===0?1:-1,p=[];for(let d=0;d<=5;d++){const g=d/5;p.push(new M(m*(.4+g*2.2+l()*.2),(f-2.5)*.45+Math.sin(g*Math.PI*1.5+f)*.4,-.3-g*.8+Math.cos(g*Math.PI)*.3))}i.push(new ve(p))}return i},[]),c=u.useMemo(()=>a.map(i=>new Ge(i,40,.018,8,!1)),[a]);return v(({clock:i})=>{const l=i.elapsedTime,f=w(e);n.current&&(n.current.position.z=Math.sin(l*.4)*.06),r.current&&(a.forEach((m,p)=>{var d;for(let g=0;g<8;g++){const x=p*8+g,y=(l*.25*f+g/8+p*.15)%1,j=m.getPoint(y);o.position.copy(j),o.scale.setScalar(.038+Math.sin(y*Math.PI)*.02),o.updateMatrix(),(d=r.current)==null||d.setMatrixAt(x,o.matrix)}}),r.current.instanceMatrix.needsUpdate=!0)}),t.jsxs("group",{ref:n,children:[c.map((i,l)=>t.jsx("mesh",{geometry:i,children:t.jsx("meshBasicMaterial",{color:te,blending:h,depthWrite:!1,opacity:.48,transparent:!0,toneMapped:!1})},l)),t.jsxs("instancedMesh",{ref:r,args:[void 0,void 0,s],children:[t.jsx("sphereGeometry",{args:[1,8,8]}),t.jsx("meshBasicMaterial",{color:sn,toneMapped:!1})]})]})}function fn({activity:e}){const n=u.useRef(null),r=e==="thinking";return v(({clock:s})=>{n.current&&(n.current.uniforms.uTime.value=s.elapsedTime,n.current.uniforms.uEnergy.value=b(e),n.current.uniforms.uReversing.value=r?1:0)}),t.jsxs("mesh",{position:[0,0,-.08],scale:[4.2,4.2,1],children:[t.jsx("planeGeometry",{args:[1,1]}),t.jsx("shaderMaterial",{ref:n,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:on,uniforms:{uTime:{value:0},uEnergy:{value:1},uReversing:{value:0}},blending:h,depthWrite:!1,transparent:!0})]})}function mn({activity:e="idle"}){return t.jsxs("group",{name:"agamotto-temporal-eye-scene",scale:1.25,children:[t.jsx("ambientLight",{intensity:.5,color:X}),t.jsx("directionalLight",{position:[4,4,4],intensity:1.8,color:te}),t.jsx(fn,{activity:e}),t.jsx(cn,{activity:e}),t.jsx(un,{activity:e}),t.jsx(ln,{activity:e}),t.jsx(an,{activity:e})]})}const P="#ff183b",pe="#ff5870",q="#ffffff";function ze(e=1){const n=new se;return n.moveTo(.14*e,1.42),n.quadraticCurveTo(1.18*e,1.08,1.38*e,-1.28),n.quadraticCurveTo(.52*e,-.88,.14*e,1.42),n.closePath(),n}function pn({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useMemo(()=>ze(-1),[]),a=u.useMemo(()=>ze(1),[]),c=u.useMemo(()=>new Ee(o,24),[o]),i=u.useMemo(()=>new Ee(a,24),[a]),l=u.useMemo(()=>({depth:.16,bevelEnabled:!0,bevelSize:.04,bevelThickness:.04,bevelSegments:3}),[]),f=u.useMemo(()=>new Z(o,l),[o,l]),m=u.useMemo(()=>new Z(a,l),[a,l]);return v(({clock:p})=>{const d=p.elapsedTime;n.current&&n.current.scale.setScalar(N(e,d,.4));const g=e==="listening"?.75:e==="thinking"?.92:e==="speaking"?1.08:.96;r.current&&(r.current.scale.y=g+Math.sin(d*2.5)*.035),s.current&&(s.current.scale.y=g+Math.cos(d*2.5)*.035)}),t.jsxs("group",{ref:n,position:[0,.15,.55],children:[t.jsx("mesh",{position:[-.92,0,.02],scale:[1.18,1.18,1],geometry:f,children:t.jsx("meshStandardMaterial",{color:"#3a0009",emissive:P,emissiveIntensity:1.2,metalness:.92,roughness:.18})}),t.jsx("mesh",{position:[.92,0,.02],scale:[1.18,1.18,1],geometry:m,children:t.jsx("meshStandardMaterial",{color:"#3a0009",emissive:P,emissiveIntensity:1.2,metalness:.92,roughness:.18})}),t.jsx("mesh",{ref:r,position:[-.92,0,.14],geometry:c,children:t.jsx("meshBasicMaterial",{color:q,toneMapped:!1})}),t.jsx("mesh",{ref:s,position:[.92,0,.14],geometry:i,children:t.jsx("meshBasicMaterial",{color:q,toneMapped:!1})}),t.jsx("mesh",{position:[-.92,0,.16],scale:[1.04,1.04,1],geometry:c,children:t.jsx("meshBasicMaterial",{color:pe,blending:h,depthWrite:!1,opacity:.4,toneMapped:!1,transparent:!0})}),t.jsx("mesh",{position:[.92,0,.16],scale:[1.04,1.04,1],geometry:i,children:t.jsx("meshBasicMaterial",{color:pe,blending:h,depthWrite:!1,opacity:.4,toneMapped:!1,transparent:!0})}),t.jsx("pointLight",{color:q,intensity:4,distance:5.5,position:[0,0,.8]}),t.jsx("pointLight",{color:P,intensity:3,distance:4.5,position:[0,0,.4]})]})}function dn({activity:e}){const n=u.useRef(null),r=u.useMemo(()=>Array.from({length:8},(s,o)=>{const a=o<4?-1:1,c=o%4;return{side:a,lane:c}}),[]);return v(({clock:s})=>{if(!n.current)return;const o=s.elapsedTime,a=w(e);n.current.rotation.z=Math.sin(o*.8*a)*.04,n.current.scale.setScalar(.98+b(e)*.07)}),t.jsx("group",{ref:n,position:[0,0,-.2],children:r.map((s,o)=>{const{side:a,lane:c}=s,i=a*(.8+c*.1),l=.6-c*.35,f=a*(1.8+c*.22),m=1.2-c*.48,p=a*(2.8+c*.32),d=.6-c*.68,g=a*(3.6+c*.28),x=.1-c*.82;return t.jsxs("group",{children:[t.jsxs("mesh",{position:[(i+f)/2,(l+m)/2,-.2],children:[t.jsx("boxGeometry",{args:[Math.abs(f-i),.12,.12]}),t.jsx("meshStandardMaterial",{color:"#2a040b",emissive:P,emissiveIntensity:.8,metalness:.9,roughness:.2})]}),t.jsxs("mesh",{position:[f,m,-.2],children:[t.jsx("sphereGeometry",{args:[.1,16,16]}),t.jsx("meshBasicMaterial",{color:q,toneMapped:!1})]}),t.jsxs("mesh",{position:[(f+p)/2,(m+d)/2,-.3],children:[t.jsx("boxGeometry",{args:[Math.abs(p-f),.09,.09]}),t.jsx("meshStandardMaterial",{color:"#2a040b",emissive:pe,emissiveIntensity:.7,metalness:.92,roughness:.18})]}),t.jsxs("mesh",{position:[p,d,-.3],children:[t.jsx("sphereGeometry",{args:[.08,16,16]}),t.jsx("meshBasicMaterial",{color:P,toneMapped:!1})]}),t.jsxs("mesh",{position:[(p+g)/2,(d+x)/2,-.4],children:[t.jsx("boxGeometry",{args:[Math.abs(g-p),.06,.06]}),t.jsx("meshStandardMaterial",{color:"#120004",emissive:P,emissiveIntensity:1,metalness:.95,roughness:.12})]})]},o)})})}function hn({activity:e}){const n=u.useRef(null),r=u.useRef(null),{points:s}=u.useMemo(()=>{const o=S(2099),a=[];for(let c=0;c<72;c++)a.push(new M((o()-.5)*6.5,(o()-.5)*5,-.8-o()*1.8));return{points:a}},[]);return v(({clock:o})=>{const a=o.elapsedTime;n.current&&(n.current.rotation.y=Math.sin(a*.18)*.08),r.current&&(r.current.uniforms.uTime.value=a,r.current.uniforms.uEnergy.value=b(e))}),t.jsxs("group",{ref:n,children:[[1.6,2.8,4.2].map((o,a)=>t.jsxs("mesh",{position:[0,0,-.5],rotation:[0,0,a*.5],children:[t.jsx("ringGeometry",{args:[o,o+.02,64]}),t.jsx("meshBasicMaterial",{color:P,blending:h,opacity:.4,transparent:!0,toneMapped:!1})]},a)),t.jsxs("points",{children:[t.jsx("bufferGeometry",{children:t.jsx("bufferAttribute",{attach:"attributes-position",args:[new Float32Array(s.flatMap(o=>[o.x,o.y,o.z])),3]})}),t.jsx("pointsMaterial",{color:q,blending:h,opacity:.75,size:.04,sizeAttenuation:!0,transparent:!0,toneMapped:!1})]}),t.jsxs("mesh",{position:[0,-2.1,-.4],rotation:[-Math.PI/2.6,0,0],scale:[7.8,6.8,1],children:[t.jsx("planeGeometry",{args:[1,1]}),t.jsx("shaderMaterial",{ref:r,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:`
            uniform float uTime; uniform float uEnergy; varying vec2 vUv;
            void main(){
              vec2 p = vUv;
              float gx = smoothstep(0.035, 0.0, abs(fract(p.x * 18.0) - 0.5));
              float gy = smoothstep(0.035, 0.0, abs(fract((p.y + uTime * 0.05) * 14.0) - 0.5));
              float fade = smoothstep(0.0, 0.25, p.y) * (1.0 - smoothstep(0.75, 1.0, p.y));
              float scan = smoothstep(0.04, 0.0, abs(p.y - fract(uTime * 0.18)));
              float alpha = (gx + gy) * 0.16 * fade + scan * 0.4;
              gl_FragColor = vec4(vec3(1.0, 0.094, 0.235) * uEnergy, alpha * uEnergy);
            }
          `,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:h,depthWrite:!1,transparent:!0})]})]})}function gn({activity:e}){const n=u.useRef(null);return v(({clock:r},s)=>{n.current&&(n.current.rotation.y=Math.sin(r.elapsedTime*.3)*.12,n.current.rotation.z+=s*.015*w(e))}),t.jsxs("group",{position:[0,.05,-.2],children:[t.jsxs("mesh",{scale:[1.6,1.9,.95],children:[t.jsx("dodecahedronGeometry",{args:[1.02,1]}),t.jsx("meshStandardMaterial",{color:"#080204",emissive:"#28000a",emissiveIntensity:.5,metalness:.9,roughness:.2})]}),t.jsxs("mesh",{ref:n,scale:[1.66,1.98,1.02],children:[t.jsx("dodecahedronGeometry",{args:[1.02,1]}),t.jsx("meshBasicMaterial",{color:P,blending:h,depthWrite:!1,opacity:.35,toneMapped:!1,transparent:!0,wireframe:!0})]})]})}function vn({activity:e="idle"}){return t.jsxs("group",{name:"iron-spider-tactical-hud-mcu",scale:1.28,children:[t.jsx("ambientLight",{intensity:.6,color:P}),t.jsx(hn,{activity:e}),t.jsx(dn,{activity:e}),t.jsx(gn,{activity:e}),t.jsx(pn,{activity:e})]})}const Oe="#8b3dff",de="#e14cff",xn="#eef1ff",Mn=`
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,yn=`
  uniform float uTime;
  uniform float uEnergy;
  varying vec2 vUv;

  void main() {
    vec2 p = (vUv - vec2(0.5)) * 2.0;
    p.x *= 1.25;
    float r = length(p);
    float angle = atan(p.y, p.x);

    // Blazing Photon Sphere Ring directly framing the event horizon
    float photonRing = smoothstep(0.015, 0.0, abs(r - 0.52));
    float photonGlow = smoothstep(0.06, 0.0, abs(r - 0.52));

    // Gravitational lensing space warp distortion
    float lensWarp = smoothstep(0.03, 0.0, abs(r - (0.78 + 0.04 * sin(angle * 4.0 + uTime * 0.5))));
    float halo = smoothstep(0.95, 0.35, r) * smoothstep(0.25, 0.52, r);

    vec3 colViolet = vec3(0.545, 0.239, 1.0); // #8b3dff
    vec3 colMag    = vec3(0.882, 0.298, 1.0); // #e14cff
    vec3 colWhite  = vec3(0.933, 0.945, 1.0); // #eef1ff

    vec3 color = mix(colViolet, colMag, photonGlow + halo);
    color = mix(color, colWhite, photonRing * 1.5 + lensWarp);

    float alpha = (photonRing * 1.2 + photonGlow * 0.7 + lensWarp * 0.6 + halo * 0.45) * uEnergy;
    gl_FragColor = vec4(color * 2.5, alpha);
  }
`,jn=`
  uniform float uTime;
  uniform float uSpeed;
  attribute float aSeed;
  attribute float aArmOffset;
  varying float vSeed;

  void main() {
    vSeed = aSeed;
    float r = length(position.xy);

    // 1/r^2 inverse square orbital speed physics
    float speedFactor = 0.15 + 0.45 / (r * r + 0.04);
    float a = atan(position.y, position.x) + uTime * speedFactor * uSpeed + aArmOffset;

    // Spiral accretion arm turbulence
    vec3 p = vec3(cos(a) * r, sin(a) * r, position.z + sin(uTime * 3.0 + aSeed * 18.0) * 0.025);
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);

    gl_PointSize = (2.4 + aSeed * 3.6) * (9.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`,bn=`
  uniform float uEnergy;
  varying float vSeed;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float alpha = smoothstep(0.5, 0.0, d);

    vec3 colViolet = vec3(0.545, 0.239, 1.0);
    vec3 colMag    = vec3(0.882, 0.298, 1.0);
    vec3 colWhite  = vec3(0.933, 0.945, 1.0);

    vec3 color = mix(colViolet, colMag, vSeed);
    color = mix(color, colWhite, pow(vSeed, 2.2));

    gl_FragColor = vec4(color * (1.3 + uEnergy * 0.7), alpha * (0.4 + vSeed * 0.6));
  }
`;function wn({activity:e}){const n=u.useRef(null),r=u.useRef(null);return v(({clock:s},o)=>{const a=s.elapsedTime,c=w(e);n.current&&(n.current.rotation.z+=o*.1*c,n.current.scale.setScalar(N(e,a,1.6))),r.current&&(r.current.uniforms.uTime.value=a,r.current.uniforms.uEnergy.value=b(e))}),t.jsxs("group",{ref:n,children:[t.jsxs("mesh",{position:[0,0,.35],children:[t.jsx("sphereGeometry",{args:[.52,64,64]}),t.jsx("meshBasicMaterial",{color:"#000000",toneMapped:!1})]}),t.jsxs("mesh",{position:[0,0,.25],scale:1.85,children:[t.jsx("planeGeometry",{args:[1,1]}),t.jsx("shaderMaterial",{ref:r,vertexShader:Mn,fragmentShader:yn,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:h,depthWrite:!1,transparent:!0})]})]})}function Sn({activity:e}){const n=u.useRef(null),r=5e3,{positions:s,seeds:o,armOffsets:a}=u.useMemo(()=>{const c=S(9918),i=new Float32Array(r*3),l=new Float32Array(r),f=new Float32Array(r);for(let m=0;m<r;m++){const p=.55+Math.pow(c(),1.5)*2.5,d=c()*Math.PI*2,g=m%3*(Math.PI*2/3);i[m*3]=Math.cos(d)*p,i[m*3+1]=Math.sin(d)*p,i[m*3+2]=(c()-.5)*(.04+p*.08),l[m]=c(),f[m]=g}return{positions:i,seeds:l,armOffsets:f}},[]);return v(({clock:c})=>{n.current&&(n.current.uniforms.uTime.value=c.elapsedTime,n.current.uniforms.uSpeed.value=w(e),n.current.uniforms.uEnergy.value=b(e))}),t.jsxs("points",{rotation:[1.14,.18,-.28],children:[t.jsxs("bufferGeometry",{children:[t.jsx("bufferAttribute",{attach:"attributes-position",args:[s,3]}),t.jsx("bufferAttribute",{attach:"attributes-aSeed",args:[o,1]}),t.jsx("bufferAttribute",{attach:"attributes-aArmOffset",args:[a,1]})]}),t.jsx("shaderMaterial",{ref:n,vertexShader:jn,fragmentShader:bn,uniforms:{uTime:{value:0},uSpeed:{value:1},uEnergy:{value:1}},blending:h,depthWrite:!1,transparent:!0})]})}function En({activity:e}){const n=u.useRef(null);return v(({clock:r})=>{if(!n.current)return;const s=r.elapsedTime,o=.9+b(e)*.35+Math.sin(s*6)*.08;n.current.scale.set(1,o,1)}),t.jsxs("group",{ref:n,rotation:[.12,.18,-.28],children:[t.jsxs("mesh",{position:[0,2.4,-.2],children:[t.jsx("coneGeometry",{args:[.14,4.8,32,1,!0]}),t.jsx("meshBasicMaterial",{color:xn,blending:h,depthWrite:!1,opacity:.35,side:ee,toneMapped:!1,transparent:!0})]}),t.jsxs("mesh",{position:[0,2.4,-.2],scale:[1.4,1,1.4],children:[t.jsx("coneGeometry",{args:[.14,4.8,32,1,!0]}),t.jsx("meshBasicMaterial",{color:de,blending:h,depthWrite:!1,opacity:.2,side:ee,toneMapped:!1,transparent:!0})]}),t.jsxs("mesh",{position:[0,-2.4,-.2],rotation:[0,0,Math.PI],children:[t.jsx("coneGeometry",{args:[.14,4.8,32,1,!0]}),t.jsx("meshBasicMaterial",{color:de,blending:h,depthWrite:!1,opacity:.3,side:ee,toneMapped:!1,transparent:!0})]})]})}function Tn({activity:e}){const n=u.useRef(null),r=u.useMemo(()=>new K,[]),s=64,o=u.useMemo(()=>{const a=S(1088);return Array.from({length:s},(c,i)=>{const l=i/s*Math.PI*2+a()*.3,f=1.2+a()*2.2;return{angle:l,radius:f,yScale:.14+a()*.42,phase:a()*Math.PI*2,z:-.4+(a()-.5)*2.8}})},[]);return v(({clock:a})=>{if(!n.current)return;const c=a.elapsedTime,i=w(e),l=e==="thinking"?.3+Math.pow(Math.abs(Math.sin(c*.8)),6)*.3:1;o.forEach((f,m)=>{var g;const p=f.angle+c*.045*i*(m%2?1:-1),d=f.radius*l;r.position.set(Math.cos(p)*d,Math.sin(p)*d*.72,f.z+Math.sin(c*.7+f.phase)*.14),r.rotation.set(f.phase+c*.22,p,c*.28+f.phase),r.scale.set(.09,f.yScale,.09),r.updateMatrix(),(g=n.current)==null||g.setMatrixAt(m,r.matrix)}),n.current.instanceMatrix.needsUpdate=!0}),t.jsxs("instancedMesh",{ref:n,args:[void 0,void 0,s],children:[t.jsx("tetrahedronGeometry",{args:[1,0]}),t.jsx("meshPhysicalMaterial",{color:"#7a42ff",emissive:Oe,emissiveIntensity:1,metalness:.1,roughness:.08,transmission:.52,transparent:!0,opacity:.88})]})}function Rn({activity:e}){const n=u.useRef(null),r=u.useMemo(()=>{const s=S(818),o=[];for(let a=0;a<18;a+=1){const c=a/18*Math.PI*2,i=[];for(let l=0;l<=42;l+=1){const f=l/42,m=f>.55?(a%3-1)*(f-.55)*.72:0,p=.5+f*(2+s()*.4);i.push(new M(Math.cos(c+m)*p,Math.sin(c+m)*p*.82,-.4-f*.95+Math.sin(f*Math.PI*2+a)*.16))}o.push(i)}return Fe(o)},[]);return v(({clock:s},o)=>{n.current&&(n.current.rotation.z-=o*.028*w(e),n.current.scale.setScalar(.94+b(e)*.08+Math.sin(s.elapsedTime*.7)*.015))}),t.jsx("group",{ref:n,rotation:[.14,-.2,0],children:t.jsx("lineSegments",{geometry:r,children:t.jsx("lineBasicMaterial",{color:de,blending:h,depthWrite:!1,opacity:.42,toneMapped:!1,transparent:!0})})})}function Pn({activity:e="idle"}){return t.jsxs("group",{name:"quantum-power-singularity-mcu",scale:1.28,children:[t.jsx("ambientLight",{intensity:.6,color:Oe}),t.jsx(Rn,{activity:e}),t.jsx(Tn,{activity:e}),t.jsx(En,{activity:e}),t.jsx(Sn,{activity:e}),t.jsx(wn,{activity:e})]})}const ne="#ff7a18",ye="#ffc55c",he="#8ef7ff",zn="#17100a";function Ae(e){const n=new se;for(let r=0;r<3;r+=1){const s=Math.PI/2+r*Math.PI*2/3,o=Math.cos(s)*e,a=Math.sin(s)*e;r===0?n.moveTo(o,a):n.lineTo(o,a)}return n.closePath(),n}function An({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useMemo(()=>new Z(Ae(.85),{depth:.12,bevelEnabled:!0,bevelSize:.04,bevelThickness:.04,bevelSegments:3}),[]),a=u.useMemo(()=>new Z(Ae(.52),{depth:.16,bevelEnabled:!0,bevelSize:.03,bevelThickness:.03,bevelSegments:2}),[]);return v(({clock:c},i)=>{const l=c.elapsedTime,f=w(e);n.current&&(n.current.rotation.z=Math.sin(l*.2)*.04,n.current.scale.setScalar(N(e,l))),r.current&&(r.current.rotation.z-=i*.5*f),s.current&&(s.current.uniforms.uTime.value=l,s.current.uniforms.uEnergy.value=b(e))}),t.jsxs("group",{ref:n,rotation:[.02,-.05,0],children:[t.jsx("mesh",{geometry:o,position:[0,0,-.06],children:t.jsx("meshStandardMaterial",{color:zn,emissive:ne,emissiveIntensity:.4,metalness:.94,roughness:.18})}),t.jsx("mesh",{geometry:a,position:[0,0,.05],scale:.96,children:t.jsx("shaderMaterial",{ref:s,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:`
            uniform float uTime; uniform float uEnergy; varying vec2 vUv;
            void main(){
              vec2 p = vUv - vec2(0.5);
              float r = length(p);
              float spokes = pow(abs(sin(atan(p.y, p.x) * 9.0 - uTime * 2.0)), 10.0);
              float bands = pow(abs(sin(r * 48.0 - uTime * 5.5)), 8.0);
              float core = 1.0 - smoothstep(0.02, 0.45, r);

              float signal = (spokes * 0.65 + bands * 0.35 + core) * uEnergy;
              vec3 orange = vec3(1.0, 0.478, 0.094); // #ff7a18
              vec3 cyan   = vec3(0.557, 0.969, 1.0);   // #8ef7ff
              vec3 color = mix(orange, cyan, clamp(signal * 0.8, 0.0, 1.0));

              gl_FragColor = vec4(color * signal * 2.0, clamp(signal, 0.2, 1.0));
            }
          `,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:h,depthWrite:!1,toneMapped:!1,transparent:!0})}),t.jsx("group",{ref:r,position:[0,0,.16],children:Array.from({length:9},(c,i)=>{const l=i*Math.PI*2/9;return t.jsxs("mesh",{position:[Math.cos(l)*.28,Math.sin(l)*.28,0],rotation:[0,0,l],children:[t.jsx("boxGeometry",{args:[.3,.038,.038]}),t.jsx("meshBasicMaterial",{color:i%3===0?he:ye,toneMapped:!1})]},i)})}),t.jsx("pointLight",{color:ne,intensity:4,distance:5,position:[0,0,.3]}),t.jsx("pointLight",{color:he,intensity:2.5,distance:3.5,position:[0,0,.4]})]})}function Cn({activity:e}){const n=u.useRef(null),r=u.useMemo(()=>new K,[]),s=u.useMemo(()=>{const o=[];for(let a=0;a<3;a+=1){const c=9+a*3;for(let i=0;i<c;i+=1)o.push({angle:i*Math.PI*2/c+a*.18,radius:1.1+a*.35,depth:-.14-a*.18,size:.22+a*.045,phase:i*.47+a})}return o},[]);return v(({clock:o})=>{if(!n.current)return;const a=o.elapsedTime,c=e==="thinking"?.28:e==="speaking"?.15:e==="listening"?-.05:0;s.forEach((i,l)=>{var p;const f=Math.sin(a*1.6+i.phase)*.03,m=i.radius+c+f;r.position.set(Math.cos(i.angle)*m,Math.sin(i.angle)*m*.78,i.depth+Math.sin(a*.8+i.phase)*.08),r.rotation.set(.16*Math.sin(i.phase),-.25,i.angle+Math.PI/2),r.scale.set(i.size*1.45,i.size*.45,.08),r.updateMatrix(),(p=n.current)==null||p.setMatrixAt(l,r.matrix)}),n.current.instanceMatrix.needsUpdate=!0}),t.jsxs("instancedMesh",{ref:n,args:[void 0,void 0,s.length],children:[t.jsx("boxGeometry",{args:[1,1,1]}),t.jsx("meshStandardMaterial",{color:"#140c08",emissive:ne,emissiveIntensity:.4,metalness:.92,roughness:.22})]})}function In({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(()=>[{position:[-2.2,.75,-.4],rotation:[.08,.48,-.04],scale:[1.15,.7,1]},{position:[2.15,.45,-.24],rotation:[-.04,-.52,.06],scale:[.95,.6,1]},{position:[-1.65,-1.35,-.68],rotation:[-.16,.34,-.14],scale:[.8,.44,1]},{position:[1.58,-1.4,-.5],rotation:[.14,-.4,.12],scale:[.88,.48,1]}],[]);return v(({clock:o})=>{n.current&&(n.current.position.y=Math.sin(o.elapsedTime*.45)*.05,n.current.scale.setScalar(.98+b(e)*.025)),r.current&&(r.current.uniforms.uTime.value=o.elapsedTime,r.current.uniforms.uEnergy.value=b(e))}),t.jsx("group",{ref:n,children:s.map((o,a)=>t.jsxs("mesh",{position:o.position,rotation:o.rotation,scale:o.scale,children:[t.jsx("planeGeometry",{args:[1,1]}),t.jsx("shaderMaterial",{ref:a===0?r:void 0,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:`
              uniform float uTime; uniform float uEnergy; varying vec2 vUv;
              void main(){
                vec2 p = vUv;
                float frame = max(step(p.x, 0.025) + step(0.975, p.x), step(p.y, 0.035) + step(0.965, p.y));
                float grid = (step(0.982, fract(p.x * 12.0)) + step(0.982, fract(p.y * 7.0))) * 0.2;
                float scan = smoothstep(0.03, 0.0, abs(p.y - fract(uTime * 0.18))) * 0.8;
                float graph = smoothstep(0.035, 0.0, abs(p.y - (0.35 + 0.16 * sin(p.x * 11.0 + uTime * 2.0)))) * 0.8;

                float alpha = clamp(frame + grid + scan + graph, 0.0, 1.0) * uEnergy;
                vec3 orange = vec3(1.0, 0.478, 0.094);
                vec3 cyan   = vec3(0.557, 0.969, 1.0);
                vec3 color = mix(orange, cyan, graph);

                gl_FragColor = vec4(color * 1.5, alpha * 0.68);
              }
            `,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:h,depthWrite:!1,side:ee,transparent:!0})]},a))})}function kn({activity:e}){const n=u.useRef(null),r=u.useMemo(()=>{const a=[new M(-1.75,.68,-.2),new M(1.72,.38,-.12),new M(-1.3,-1.08,-.38),new M(1.26,-1.12,-.3)].map((c,i)=>{const l=[];for(let f=0;f<=28;f+=1){const m=f/28;l.push(new M(c.x*m,c.y*m+Math.sin(m*Math.PI)*(i%2?-.24:.24),c.z*m+Math.sin(m*Math.PI*2+i)*.08))}return l});return Fe(a)},[]),s=u.useMemo(()=>ae([[new M(0,.85,0),new M(0,2.45,-.45)],[new M(-.08,.78,0),new M(-.56,2.1,-.3)],[new M(.08,.78,0),new M(.6,2.2,-.34)]]),[]);return v(({clock:o})=>{n.current&&(n.current.rotation.z=Math.sin(o.elapsedTime*.16)*.025,n.current.scale.setScalar(.98+b(e)*.025))}),t.jsxs("group",{ref:n,children:[t.jsx("lineSegments",{geometry:r,children:t.jsx("lineBasicMaterial",{color:ye,blending:h,depthWrite:!1,opacity:.65,toneMapped:!1,transparent:!0})}),t.jsx("lineSegments",{geometry:s,children:t.jsx("lineBasicMaterial",{color:he,blending:h,depthWrite:!1,opacity:.52,toneMapped:!1,transparent:!0})})]})}function Gn({activity:e="idle"}){return t.jsxs("group",{name:"stark-mark-l-arc-reactor",scale:1.25,rotation:[.08,-.18,.025],children:[t.jsx("ambientLight",{color:ne,intensity:.5}),t.jsx("directionalLight",{color:ye,intensity:1.8,position:[2.5,3.2,4]}),t.jsx(In,{activity:e}),t.jsx(kn,{activity:e}),t.jsx(Cn,{activity:e}),t.jsx(An,{activity:e})]})}const Ce={gold:"#020100",green:"#000704",blue:"#00040a",red:"#080002",violet:"#02000a",orange:"#080300",spider:"#000408"},Wn={blue:.9,green:.94,red:.88,violet:.86,orange:.92,spider:.78};function Ln(e){return Ce[e]||Ce.gold}function ge(e,n){const r=n.getBoundingClientRect(),s=Math.min(r.width,r.height)*.38;if(s<=0)return!1;const o=(e.clientX-(r.left+r.width/2))/s,a=(e.clientY-(r.top+r.height/2))/(s*.94);return o*o+a*a<=1}function _n({palette:e}){const{gl:n}=re();return u.useEffect(()=>{const r=Ln(e);n.setClearColor(r,1),n.toneMappingExposure=Wn[e]??.94},[n,e]),null}function Bn({resetSignal:e=0}){const{camera:n,gl:r,size:s}=re(),o=u.useMemo(()=>new st(n,r.domElement),[n,r]);return u.useEffect(()=>{o.enableDamping=!0,o.dampingFactor=.075,o.enablePan=!1,o.enableZoom=!1,o.enableRotate=!1,o.rotateSpeed=0,o.zoomSpeed=.48,o.minDistance=5.25,o.maxDistance=s.width/s.height<.72?15:8.6,o.target.set(0,0,0),r.domElement.classList.add("is-orbit-enabled");const a=i=>{const l=!document.body.classList.contains("hud-dragging")&&ge(i,r.domElement);o.enableZoom=l,r.domElement.classList.toggle("orb-hit-active",l)},c=()=>{o.enableZoom=!1,r.domElement.classList.remove("orb-hit-active")};return r.domElement.addEventListener("pointermove",a,{passive:!0}),r.domElement.addEventListener("pointerleave",c),r.domElement.addEventListener("wheel",a,{capture:!0,passive:!0}),()=>{r.domElement.classList.remove("is-orbit-enabled"),r.domElement.classList.remove("orb-hit-active"),r.domElement.removeEventListener("pointermove",a),r.domElement.removeEventListener("pointerleave",c),r.domElement.removeEventListener("wheel",a,!0),o.dispose()}},[o,r.domElement,s]),u.useEffect(()=>{const c=s.width/s.height<.72?10.8:6.1;n.position.set(0,0,c),o.target.set(0,0,0),o.update()},[n,o,e,s.height,s.width]),v(()=>o.update()),null}function Fn(e){return e instanceof HTMLElement?!!e.closest(".hud-dock, .history-panel, .chat-side-panel, .settings-panel, .activity-hub, .prompt-shell, .draggable-panel, .os-taskbar, .os-minimized-dock, button, input, textarea, select"):!1}function Un({resetSignal:e=0,children:n}){const r=u.useRef(null),{pointer:s,size:o,gl:a}=re(),c=u.useRef(!1),i=u.useRef({active:!1,x:0,y:0,targetX:0,targetY:0,lastX:0,lastY:0});return u.useEffect(()=>{const l=p=>{p.button!==0||p.target!==a.domElement||Fn(p.target)||document.body.classList.contains("hud-dragging")||!ge(p,a.domElement)||(c.current=!0,i.current.active=!0,i.current.lastX=p.clientX,i.current.lastY=p.clientY,document.body.classList.add("is-reactor-dragging"))},f=p=>{if(c.current=p.target===a.domElement&&!document.body.classList.contains("hud-dragging")&&ge(p,a.domElement),!i.current.active)return;const d=p.clientX-i.current.lastX,g=p.clientY-i.current.lastY;i.current.lastX=p.clientX,i.current.lastY=p.clientY,i.current.targetY+=d*.0065,i.current.targetX+=g*.0048,i.current.targetX=E.clamp(i.current.targetX,-.9,.9)},m=()=>{i.current.active=!1,document.body.classList.remove("is-reactor-dragging")};return window.addEventListener("pointerdown",l),window.addEventListener("pointermove",f),window.addEventListener("pointerup",m),window.addEventListener("pointercancel",m),()=>{window.removeEventListener("pointerdown",l),window.removeEventListener("pointermove",f),window.removeEventListener("pointerup",m),window.removeEventListener("pointercancel",m),document.body.classList.remove("is-reactor-dragging")}},[a.domElement]),u.useEffect(()=>{i.current.x=0,i.current.y=0,i.current.targetX=0,i.current.targetY=0},[e]),v(({clock:l})=>{const f=o.width/o.height<.72;if(r.current){i.current.x=E.lerp(i.current.x,i.current.targetX,.09),i.current.y=E.lerp(i.current.y,i.current.targetY,.09);const m=f||!c.current||document.body.classList.contains("hud-dragging")?0:.08;r.current.rotation.x=E.lerp(r.current.rotation.x,i.current.x-s.y*m,.045),r.current.rotation.y=E.lerp(r.current.rotation.y,i.current.y+s.x*m,.045),r.current.rotation.z=0}}),t.jsx("group",{ref:r,children:n})}function On({activity:e,palette:n}){const r=u.useMemo(()=>{const s=e==="speaking"?1.25:e==="thinking"?1.12:1,o={blue:{intensity:1.32,threshold:.28,smoothing:.52},green:{intensity:1.35,threshold:.26,smoothing:.55},red:{intensity:1.28,threshold:.32,smoothing:.48},violet:{intensity:1.42,threshold:.25,smoothing:.5},orange:{intensity:1.3,threshold:.35,smoothing:.45},spider:{intensity:1.25,threshold:.28,smoothing:.4}},a=o[n]??o.blue;return{...a,intensity:a.intensity*s}},[e,n]);return t.jsx(ot,{multisampling:0,children:t.jsx(at,{intensity:r.intensity,luminanceSmoothing:r.smoothing,luminanceThreshold:r.threshold,mipmapBlur:!0})})}function Xn({activity:e,palette:n,resetSignal:r=0}){const s=nt();return t.jsx("div",{className:"orb-webgl","aria-hidden":"true",children:t.jsxs(rt,{camera:{fov:41,near:.1,far:30,position:[0,0,6.1]},dpr:s?1:[1,1.45],frameloop:s?"demand":"always",children:[t.jsx(_n,{palette:n}),t.jsx(Bn,{resetSignal:r}),t.jsx(Un,{resetSignal:r,children:t.jsx(it,{palette:n,children:o=>o==="gold"?t.jsx(Te,{activity:e,palette:"gold"}):o==="green"?t.jsx(mn,{activity:e}):o==="blue"?t.jsx(Ht,{activity:e}):o==="red"?t.jsx(rn,{activity:e}):o==="violet"?t.jsx(Pn,{activity:e}):o==="orange"?t.jsx(Gn,{activity:e}):o==="spider"?t.jsx(vn,{activity:e}):t.jsx(Te,{activity:e,palette:"gold"})})}),t.jsx(On,{activity:e,palette:n})]})})}export{Xn as default};
