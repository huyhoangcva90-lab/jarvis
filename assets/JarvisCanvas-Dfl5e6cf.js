import{r as u,j as e}from"./index-BkODfPQu.js";import{u as v,M as S,C as k,A as h,I as Ge,W as Le,V as M,B as G,F as R,U as je,a as Be,b as I,E as be,c as ie,T as we,d as We,e as $,O as _,f as N,S as Fe,P as _e,g as Ue,h as Oe,D,i as H,j as W,k as De,l as de,m as Xe,n as Ve,o as Ne,p as Ze,w as Ye}from"./useReducedMotion-Czz-Lncq.js";function $e({palette:t,children:n}){const r=u.useRef(null),[s,o]=u.useState(t),a=u.useRef("idle"),l=u.useRef(1);return u.useEffect(()=>{if(t===s)return;a.current="out";const i=window.setTimeout(()=>{l.current=0,o(t),a.current="in"},150);return()=>window.clearTimeout(i)},[t,s]),v((i,c)=>{a.current==="out"?l.current=S.lerp(l.current,0,c*12):a.current==="in"&&(l.current=S.lerp(l.current,1,c*8),l.current>.95&&(l.current=1,a.current="idle")),r.current&&(r.current.scale.setScalar(l.current),r.current.rotation.y=(1-l.current)*Math.PI*.25)}),e.jsx("group",{ref:r,children:n(s)})}const q=new k("#fff8d6"),Se=new k("#d65f10"),He={gold:["#fff8d6","#d65f10"],green:["#f5fff6","#18bd58"],violet:["#faf5ff","#7c3aed"],orange:["#fff5de","#ed5f12"]};function qe(t){return()=>{let n=t+=1831565813;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}function Ee(t){return t==="speaking"?1.52:t==="thinking"?1.28:t==="listening"?.82:1}function Re(t){return t==="speaking"?1.85:t==="thinking"?1.42:t==="listening"?.46:1}const K={uniforms:{uTime:{value:0},uEnergy:{value:1},uOpacity:{value:1},uColor:{value:q}},vertexShader:`
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
  `};function Ke(){return{uniforms:je.clone(K.uniforms),vertexShader:K.vertexShader,fragmentShader:K.fragmentShader}}function Je(){const t=qe(60879),n=[],r=[],s=[];for(let a=0;a<42;a+=1){const l=t()*Math.PI*2,i=Math.acos(2*t()-1),c=new M(Math.sin(i)*Math.cos(l),Math.cos(i),Math.sin(i)*Math.sin(l)),f=.24+t()*.32,m=1.04+t()*(a%5===0?1.34:.82),d=c.clone().multiplyScalar(f),p=c.clone().multiplyScalar(m);n.push(d.x,d.y,d.z,p.x,p.y,p.z),r.push(t()*6.28,t()*6.28),s.push(.35+t()*.65,.35+t()*.65)}const o=new G;return o.setAttribute("position",new R(n,3)),o.setAttribute("aPhase",new R(r,1)),o.setAttribute("aIntensity",new R(s,1)),o}function Qe({activity:t,flashRef:n}){const r=u.useRef(null),s=u.useRef(null),o=u.useMemo(Je,[]),a=u.useMemo(Ke,[]);return v(({clock:l},i)=>{const c=Ee(t)*(1+n.current*2);s.current&&(s.current.uniforms.uTime.value=l.elapsedTime,s.current.uniforms.uEnergy.value=c*(t==="speaking"?1.22:1),s.current.uniforms.uOpacity.value=t==="speaking"?.82:.7,s.current.uniforms.uColor.value.copy(q)),r.current&&(r.current.rotation.y+=i*.055*Re(t),r.current.rotation.x=Math.sin(l.elapsedTime*.18)*.05,r.current.scale.setScalar(1+n.current*.2))}),e.jsx("group",{ref:r,children:e.jsx("lineSegments",{geometry:o,children:e.jsx("shaderMaterial",{ref:s,args:[a],blending:h,depthWrite:!1,toneMapped:!1,transparent:!0})})})}function et({activity:t,flashRef:n}){const r=u.useRef(null),s=u.useRef(null),o=u.useRef(null),a=u.useRef(null),l=u.useMemo(()=>{const i=new Ge(2.02,2),c=new Le(i);return i.dispose(),c},[]);return v(({clock:i},c)=>{const f=i.elapsedTime,m=Re(t),d=Ee(t),p=t==="speaking"?Math.sin(f*7.2)*.035:0,g=t==="thinking"?Math.sin(f*3.4)*.018:0,x=1+p+g+n.current*.075;r.current&&(r.current.rotation.x+=c*.035*m,r.current.rotation.y+=c*.052*m,r.current.rotation.z-=c*.018*m,r.current.scale.setScalar(x)),s.current&&(s.current.rotation.x-=c*.026*m,s.current.rotation.y-=c*.041*m,s.current.rotation.z+=c*.023*m,s.current.scale.setScalar(.91-p*.42+n.current*.035)),o.current&&(o.current.opacity=.2+d*.13+n.current*.24),a.current&&(a.current.opacity=.08+d*.075+n.current*.12)}),e.jsxs("group",{rotation:[.08,-.18,.06],children:[e.jsx("lineSegments",{ref:r,geometry:l,children:e.jsx("lineBasicMaterial",{ref:o,blending:h,color:q,depthWrite:!1,opacity:.34,toneMapped:!1,transparent:!0})}),e.jsx("lineSegments",{ref:s,geometry:l,children:e.jsx("lineBasicMaterial",{ref:a,blending:h,color:Se,depthWrite:!1,opacity:.15,toneMapped:!1,transparent:!0})})]})}function tt({activity:t,palette:n="gold"}){const[r,s]=He[n];q.set(r),Se.set(s);const[o,a]=u.useState(0),l=u.useRef(0);return u.useEffect(()=>{let i;const c=()=>{a(1),setTimeout(()=>a(0),100);const f=500+Math.random()*2500;t==="thinking"?i=setTimeout(c,f*.5):i=setTimeout(c,f)};return i=setTimeout(c,1e3),()=>clearTimeout(i)},[t]),v((i,c)=>{l.current=S.lerp(l.current,o,c*8)}),e.jsxs("group",{scale:[1.3,.8,1.1],position:[.1,-.05,0],rotation:[.2,.1,-.1],children:[e.jsx(Qe,{activity:t,flashRef:l}),e.jsx(et,{activity:t,flashRef:l})]})}const F=new k("#ff8a18"),E=new k("#ffd15c"),le=new k("#fff8d6"),te=new k("#b8490b"),ce=new k("#d65f10"),nt={gold:["#ff8a18","#ffd15c","#fff8d6","#b8490b","#d65f10"],green:["#4cff85","#b9ffc9","#f5fff6","#0b4f24","#18bd58"],violet:["#a855f7","#d8b4fe","#faf5ff","#1e0547","#7c3aed"],orange:["#ff7a18","#ffc46b","#fff5de","#7a2608","#ed5f12"]};function rt(t){const[n,r,s,o,a]=nt[t];F.set(n),E.set(r),le.set(s),te.set(o),ce.set(a)}const z=[{radiusX:.66,radiusZ:.58,seed:11,speed:.33,tilt:[.28,.16,.84],opacity:.64,width:1,packets:3},{radiusX:.88,radiusZ:.74,seed:13,speed:-.26,tilt:[1.1,.04,-.38],opacity:.5,width:1,packets:2},{radiusX:1.06,radiusZ:.98,seed:17,speed:.21,tilt:[.08,.9,.24],opacity:.42,width:1,packets:4},{radiusX:1.28,radiusZ:1.05,seed:19,speed:-.18,tilt:[1.42,.32,.52],opacity:.58,width:1.3,packets:3},{radiusX:1.42,radiusZ:1.34,seed:23,speed:.13,tilt:[.46,1.18,-.2],opacity:.37,width:1,packets:2},{radiusX:1.58,radiusZ:1.18,seed:29,speed:-.11,tilt:[1.28,.82,1.05],opacity:.46,width:1.1,packets:3},{radiusX:1.78,radiusZ:1.58,seed:31,speed:.087,tilt:[.2,.2,1.47],opacity:.32,width:1,packets:2},{radiusX:2.03,radiusZ:1.72,seed:37,speed:-.072,tilt:[1.05,.42,-1.12],opacity:.34,width:1.2,packets:4},{radiusX:2.24,radiusZ:1.86,seed:41,speed:.055,tilt:[.72,1.05,.42],opacity:.28,width:1,packets:3},{radiusX:2.46,radiusZ:2.08,seed:43,speed:-.048,tilt:[1.38,.12,.08],opacity:.25,width:1,packets:2}];function V(t){return()=>{let n=t+=1831565813;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}function C(t){return t==="speaking"?1.52:t==="thinking"?1.28:t==="listening"?.82:1}function L(t){return t==="speaking"?1.85:t==="thinking"?1.42:t==="listening"?.46:1}const J={uniforms:{uTime:{value:0},uEnergy:{value:1},uOpacity:{value:1},uColor:{value:F}},vertexShader:`
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
  `};function Te(){return{uniforms:je.clone(J.uniforms),vertexShader:J.vertexShader,fragmentShader:J.fragmentShader}}function st(){const t=V(54421),n=[],r=[],s=[];for(let a=0;a<12;a+=1){const l=t()*Math.PI*2,i=Math.acos(2*t()-1),c=new M(Math.sin(i)*Math.cos(l),Math.cos(i),Math.sin(i)*Math.sin(l)),f=a%4===0?2.05+t()*.38:1.1+t()*.66,m=c.clone().multiplyScalar((t()-.5)*.22),d=c.clone().multiplyScalar(-f).add(m),p=c.clone().multiplyScalar(f).add(m.multiplyScalar(.35));n.push(d.x,d.y,d.z,p.x,p.y,p.z),r.push(t()*6.28,t()*6.28),s.push(a%4===0?.92:.44+t()*.32,a%4===0?.92:.44+t()*.32)}const o=new G;return o.setAttribute("position",new R(n,3)),o.setAttribute("aPhase",new R(r,1)),o.setAttribute("aIntensity",new R(s,1)),o}function ot(t){const n=V(t.seed*313),r=[],s=[],o=[],a=240,l=n()*Math.PI*2,i=n()*Math.PI*2;for(let f=0;f<a;f+=1){const m=f/a*Math.PI*2,d=(f+1)/a*Math.PI*2;if(Math.abs(Math.sin((m-l)*1.5))<.13||Math.abs(Math.sin((m-i)*2))<.11||(f+t.seed)%23===0)continue;const g=1+Math.sin(m*5+t.seed)*.018+(n()-.5)*.01,x=1+Math.sin(d*5+t.seed)*.018+(n()-.5)*.01,y=Math.sin(m*3+t.seed)*.025,j=Math.sin(d*3+t.seed)*.025;r.push(Math.cos(m)*t.radiusX*g,y,Math.sin(m)*t.radiusZ*g),r.push(Math.cos(d)*t.radiusX*x,j,Math.sin(d)*t.radiusZ*x),s.push(m+t.seed,d+t.seed),o.push(.55+n()*.45,.55+n()*.45)}const c=new G;return c.setAttribute("position",new R(r,3)),c.setAttribute("aPhase",new R(s,1)),c.setAttribute("aIntensity",new R(o,1)),c}function at(t){const n=V(t.seed*791),r=[],s=96;for(let o=0;o<s;o+=1){const a=o/s*Math.PI*2,l=1+Math.sin(a*3+t.seed)*.018+(n()-.5)*.008;r.push(new M(Math.cos(a)*t.radiusX*l,Math.sin(a*2+t.seed)*.018,Math.sin(a)*t.radiusZ*l))}return new ie(r,!0,"centripetal",.5)}function it({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useRef(null);return v(({clock:a},l)=>{const i=a.elapsedTime,c=L(t),f=C(t);if(n.current){const m=t==="speaking"?Math.sin(i*7.2)*.075:Math.sin(i*2.2)*.025;n.current.scale.setScalar((1+m)*(.98+f*.035)),n.current.rotation.y+=l*.18*c}r.current&&(r.current.rotation.x+=l*.42*c),s.current&&(s.current.rotation.y-=l*.34*c),o.current&&(o.current.rotation.z+=l*.27*c)}),e.jsxs("group",{ref:n,children:[e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[.105,32,32]}),e.jsx("meshBasicMaterial",{color:le,toneMapped:!1})]}),e.jsxs("mesh",{scale:1+C(t)*.075,children:[e.jsx("sphereGeometry",{args:[.31,32,32]}),e.jsx("meshBasicMaterial",{blending:h,color:E,depthWrite:!1,opacity:.32,toneMapped:!1,transparent:!0})]}),e.jsxs("mesh",{scale:1.72,children:[e.jsx("sphereGeometry",{args:[.42,32,32]}),e.jsx("meshBasicMaterial",{blending:h,color:F,depthWrite:!1,opacity:.092,toneMapped:!1,transparent:!0})]}),e.jsxs("mesh",{ref:r,rotation:[.3,.2,.1],children:[e.jsx("torusKnotGeometry",{args:[.34,.018,180,5,2,3]}),e.jsx("meshBasicMaterial",{blending:h,color:E,depthWrite:!1,toneMapped:!1})]}),e.jsxs("mesh",{ref:s,rotation:[1.1,.4,.8],scale:1.18,children:[e.jsx("torusKnotGeometry",{args:[.34,.011,180,4,3,5]}),e.jsx("meshBasicMaterial",{blending:h,color:F,depthWrite:!1,opacity:.72,toneMapped:!1,transparent:!0})]}),e.jsxs("mesh",{ref:o,rotation:[.2,1.2,.5],scale:1.42,children:[e.jsx("torusKnotGeometry",{args:[.34,.008,180,4,2,5]}),e.jsx("meshBasicMaterial",{blending:h,color:ce,depthWrite:!1,opacity:.48,toneMapped:!1,transparent:!0})]})]})}function lt({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(st,[]),o=u.useMemo(Te,[]);return v(({clock:a},l)=>{r.current&&(r.current.uniforms.uTime.value=a.elapsedTime*1.28,r.current.uniforms.uEnergy.value=C(t)*(t==="speaking"?1.34:.96),r.current.uniforms.uOpacity.value=t==="listening"?.26:t==="speaking"?.48:.38,r.current.uniforms.uColor.value.copy(E)),n.current&&(n.current.rotation.y+=l*.035*L(t),n.current.rotation.z-=l*.018)}),e.jsx("group",{ref:n,children:e.jsx("lineSegments",{geometry:s,children:e.jsx("shaderMaterial",{ref:r,args:[o],blending:h,depthWrite:!1,toneMapped:!1,transparent:!0})})})}function ct({activity:t,index:n,spec:r}){const s=u.useRef(null),o=u.useRef(null),a=u.useMemo(()=>ot(r),[r]),l=u.useMemo(Te,[]);return v(({clock:i},c)=>{const f=L(t);if(s.current){s.current.rotation.y+=c*r.speed*f,s.current.rotation.z+=c*r.speed*.28*f;const m=1+Math.sin(i.elapsedTime*.8+r.seed)*.004*C(t);s.current.scale.setScalar(m)}o.current&&(o.current.uniforms.uTime.value=i.elapsedTime+n*.71,o.current.uniforms.uEnergy.value=C(t),o.current.uniforms.uOpacity.value=r.opacity,o.current.uniforms.uColor.value.copy(n<3?E:n>6?ce:F))}),e.jsx("group",{ref:s,rotation:r.tilt,children:e.jsx("lineSegments",{geometry:a,children:e.jsx("shaderMaterial",{ref:o,args:[l],blending:h,depthWrite:!1,toneMapped:!1,transparent:!0})})})}function ut({activity:t,index:n,spec:r}){const s=u.useRef(null),o=u.useMemo(()=>new we(at(r),220,r.width*.011,5,!0),[r]);return v(({clock:a},l)=>{if(!s.current)return;const i=L(t);s.current.rotation.y+=l*r.speed*.72*i,s.current.rotation.z+=l*r.speed*.18*i;const c=s.current.material;c.color.copy(n%2===0?E:F),c.opacity=(.32+r.opacity*.58)*(.82+Math.sin(a.elapsedTime*(.95+n*.14)+r.seed)*.18)*C(t)}),e.jsx("group",{rotation:r.tilt,children:e.jsx("mesh",{ref:s,geometry:o,children:e.jsx("meshBasicMaterial",{blending:h,color:E,depthWrite:!1,opacity:.74,toneMapped:!1,transparent:!0})})})}function ft({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>{const i=[];return z.forEach((c,f)=>{for(let m=0;m<c.packets;m+=1)i.push({orbit:f,phase:((m+1)/(c.packets+1)+c.seed*.013)%1,speed:Math.abs(c.speed)*(.72+m*.16),size:.045+(m+f)%3*.018,offset:(m-c.packets*.5)*.012})}),i},[]),s=u.useMemo(()=>{const i=new G;return i.setAttribute("position",new I(new Float32Array(r.length*3),3)),i.setAttribute("aSize",new I(new Float32Array(r.map(c=>c.size)),1)),i},[r]),o=u.useMemo(()=>z.map(i=>new We().makeRotationFromEuler(new be(...i.tilt))),[]),a=u.useMemo(()=>new M,[]);v(({clock:i})=>{if(!n.current)return;const c=s.getAttribute("position"),f=L(t);r.forEach((m,d)=>{const p=z[m.orbit],x=(m.phase+i.elapsedTime*m.speed*f)%1*Math.PI*2;a.set(Math.cos(x)*p.radiusX,Math.sin(x*3+p.seed)*.025+m.offset,Math.sin(x)*p.radiusZ),a.applyMatrix4(o[m.orbit]),c.setXYZ(d,a.x,a.y,a.z)}),c.needsUpdate=!0});const l=u.useMemo(()=>({uniforms:{uColor:{value:E}},vertexShader:`
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
      `}),[]);return e.jsx("points",{ref:n,geometry:s,children:e.jsx("shaderMaterial",{args:[l],blending:h,depthWrite:!1,toneMapped:!1,transparent:!0})})}function mt({activity:t}){const n=u.useRef(null);return v(({clock:r})=>{if(!n.current)return;const s=t==="speaking"?Math.sin(r.elapsedTime*6.8)*.018:0;n.current.scale.setScalar(1+s)}),e.jsxs("group",{ref:n,children:[[z[1],z[3],z[5],z[7]].map((r,s)=>e.jsx(ut,{activity:t,index:s,spec:r},`major-${r.seed}`)),z.map((r,s)=>e.jsx(ct,{activity:t,index:s,spec:r},r.seed)),e.jsx(ft,{activity:t})]})}function dt({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(()=>{const a=V(91822),l=760,i=new Float32Array(l*3),c=new Float32Array(l),f=new Float32Array(l);for(let d=0;d<l;d+=1){const p=a()*Math.PI*2,g=.52+Math.pow(a(),1.8)*.92;i[d*3]=Math.cos(p)*g,i[d*3+1]=(a()-.5)*.055,i[d*3+2]=Math.sin(p)*g*(.78+a()*.18),c[d]=p+a()*3,f[d]=1.2+a()*3.8}const m=new G;return m.setAttribute("position",new I(i,3)),m.setAttribute("aPhase",new I(c,1)),m.setAttribute("aSize",new I(f,1)),m},[]),o=u.useMemo(()=>({uniforms:{uTime:{value:0},uEnergy:{value:1},uColor:{value:E}},vertexShader:`
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
      `}),[]);return v(({clock:a},l)=>{r.current&&(r.current.uniforms.uTime.value=a.elapsedTime,r.current.uniforms.uEnergy.value=C(t),r.current.uniforms.uColor.value.copy(E)),n.current&&(n.current.rotation.x=.58+Math.sin(a.elapsedTime*.12)*.035,n.current.rotation.y+=l*.08*L(t),n.current.rotation.z=-.18)}),e.jsx("points",{ref:n,geometry:s,children:e.jsx("shaderMaterial",{ref:r,args:[o],blending:h,depthWrite:!1,toneMapped:!1,transparent:!0})})}function pt(){const t=V(55123);return Array.from({length:14},(n,r)=>{const s=r/14*Math.PI*2+t()*.32,o=new be(t()*1.4,t()*1.1,t()*1.2),a=Array.from({length:6},(l,i)=>{const c=i/5,f=.28+c*(1.76+t()*.38),m=s+Math.sin(c*Math.PI*2+r)*.28;return new M(Math.cos(m)*f,Math.sin(c*Math.PI*1.5+r)*.26,Math.sin(m)*f*(.74+t()*.22)).applyEuler(o)});return new ie(a,!1,"centripetal",.44)})}function ht({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>pt(),[]),s=u.useMemo(()=>Array.from({length:56},(l,i)=>({curve:i%r.length,phase:i*19%56/56,speed:.08+i%6*.012})),[r.length]),o=u.useMemo(()=>{const l=new G;return l.setAttribute("position",new I(new Float32Array(s.length*3),3)),l},[s.length]),a=u.useMemo(()=>new M,[]);return v(({clock:l})=>{if(!n.current)return;const i=o.getAttribute("position"),c=L(t);s.forEach((f,m)=>{const d=(f.phase+l.elapsedTime*f.speed*c)%1;r[f.curve].getPointAt(d,a);const p=t==="speaking"?1+Math.sin(l.elapsedTime*7+m)*.025:1;i.setXYZ(m,a.x*p,a.y*p,a.z*p)}),i.needsUpdate=!0}),e.jsx("points",{ref:n,geometry:o,children:e.jsx("pointsMaterial",{blending:h,color:le,depthWrite:!1,opacity:.76,size:.046,sizeAttenuation:!0,toneMapped:!1,transparent:!0})})}function gt({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>({uniforms:{uEnergy:{value:1},uColor:{value:te}},vertexShader:`
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
      `}),[]);return v(()=>{n.current&&(n.current.uniforms.uEnergy.value=C(t),n.current.uniforms.uColor.value.copy(te))}),e.jsxs("mesh",{scale:[1.04,1.04,1.04],children:[e.jsx("sphereGeometry",{args:[2.18,48,48]}),e.jsx("shaderMaterial",{ref:n,args:[r],blending:h,depthWrite:!1,side:Be,toneMapped:!1,transparent:!0})]})}function pe({activity:t,palette:n="gold"}){return rt(n),e.jsxs("group",{children:[e.jsx(gt,{activity:t}),e.jsx("group",{scale:n==="violet"?.46:1,children:e.jsx(tt,{activity:t,palette:n})}),e.jsx(ht,{activity:t}),e.jsx(it,{activity:t}),e.jsx(dt,{activity:t}),e.jsx(lt,{activity:t}),e.jsx(mt,{activity:t})]})}function b(t){return t==="speaking"?1.42:t==="thinking"?1.24:t==="listening"?.78:1}function w(t){return t==="speaking"?1.7:t==="thinking"?1.28:t==="listening"?.62:.86}function U(t,n,r=0){const s=t==="speaking"?8.4:t==="thinking"?4.6:t==="listening"?1.2:1.8,o=t==="speaking"?.12:t==="thinking"?.065:t==="listening"?.025:.038;return 1+Math.sin(n*s+r)*o}function P(t){let n=t>>>0;return()=>(n=n*1664525+1013904223>>>0,n/4294967296)}function Pe(t){const n=new Float32Array(t.length*6);t.forEach(([s,o],a)=>{const l=a*6;n[l]=s.x,n[l+1]=s.y,n[l+2]=s.z,n[l+3]=o.x,n[l+4]=o.y,n[l+5]=o.z});const r=new G;return r.setAttribute("position",new I(n,3)),r}function ze(t){const n=[];return t.forEach(r=>{for(let s=1;s<r.length;s+=1)n.push([r[s-1],r[s]])}),Pe(n)}const ue="#22b8ff",A="#dcfbff",vt="#0757ff",xt=`
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Mt=`
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    // --- Internal laser grid circuit pattern ---
    vec2 grid = fract(vUv * 8.0);
    float lineX = smoothstep(0.0, 0.06, grid.x) * (1.0 - smoothstep(0.94, 1.0, grid.x));
    float lineY = smoothstep(0.0, 0.06, grid.y) * (1.0 - smoothstep(0.94, 1.0, grid.y));
    float gridLines = 1.0 - lineX * lineY;

    // Traveling energy pulse along grid
    float pulse1 = sin(vUv.x * 25.0 - uTime * 4.0) * 0.5 + 0.5;
    float pulse2 = sin(vUv.y * 25.0 + uTime * 3.2) * 0.5 + 0.5;
    float energyFlow = max(pulse1 * gridLines, pulse2 * gridLines);

    // Fresnel rim for edge glow
    float viewAngle = abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
    float fresnel = pow(1.0 - viewAngle, 3.0);

    // Electric arc flicker on high activity
    float noise = hash(vUv * 80.0 + floor(uTime * 22.0));
    float arc = step(0.72, noise) * gridLines * uEnergy * 0.5;

    // Edge detection - bright edges of the box
    vec2 edgeDist = abs(vUv - 0.5) * 2.0;
    float edgeFactor = max(edgeDist.x, edgeDist.y);
    float edgeBright = smoothstep(0.88, 0.99, edgeFactor);

    vec3 colIce = vec3(0.863, 0.984, 1.0);   // #dcfbff
    vec3 colBlue = vec3(0.133, 0.722, 1.0);   // #22b8ff
    vec3 colDeep = vec3(0.027, 0.341, 1.0);   // #0757ff

    // Blend based on grid, pulse, and edge
    vec3 color = colDeep;
    color = mix(color, colBlue, energyFlow * 0.7);
    color = mix(color, colIce, edgeBright + arc);
    color = mix(color, colIce, fresnel * 0.8);

    float alpha = (gridLines * 0.35 + energyFlow * 0.25 + fresnel * 0.55 + edgeBright * 0.8 + arc * 0.6) * uEnergy;
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(color * (1.2 + uEnergy * 0.6), alpha);
  }
`,yt=`
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,jt=`
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec2 vUv;

  void main() {
    float viewAngle = abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
    float fresnel = pow(1.0 - viewAngle, 2.2);

    // Sharp crystalline edge highlight
    vec2 edgeDist = abs(vUv - 0.5) * 2.0;
    float edgeFactor = max(edgeDist.x, edgeDist.y);
    float edgeLine = smoothstep(0.92, 0.98, edgeFactor);

    // Subtle facet refraction shimmer
    float shimmer = sin(vWorldPos.x * 12.0 + vWorldPos.y * 8.0 + uTime * 1.5) * 0.5 + 0.5;
    shimmer *= fresnel;

    vec3 colIce = vec3(0.863, 0.984, 1.0);
    vec3 colBlue = vec3(0.133, 0.722, 1.0);

    vec3 color = mix(colBlue, colIce, edgeLine + shimmer * 0.4);
    float alpha = (fresnel * 0.35 + edgeLine * 0.65 + shimmer * 0.1) * (0.7 + uEnergy * 0.3);

    gl_FragColor = vec4(color * 1.6, alpha);
  }
`;function bt({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useRef(null),a=u.useMemo(()=>new N(2,2,2),[]),l=u.useMemo(()=>new N(1.85,1.85,1.85,12,12,12),[]),i=u.useMemo(()=>[1.92,1.5,1.1,.7].map(f=>{const m=new N(f,f,f),d=new Ue(m);return m.dispose(),d}),[]);return v(({clock:c},f)=>{const m=c.elapsedTime,d=w(t),p=b(t);n.current&&(n.current.rotation.y+=f*.14*d,n.current.rotation.x=Math.sin(m*.28)*.12,n.current.rotation.z=Math.cos(m*.22)*.06),r.current&&(r.current.uniforms.uTime.value=m,r.current.uniforms.uEnergy.value=p),s.current&&(s.current.uniforms.uTime.value=m,s.current.uniforms.uEnergy.value=p),o.current&&(o.current.rotation.y-=f*.08*d,o.current.rotation.x+=f*.05*d)}),e.jsxs("group",{ref:n,children:[e.jsx("mesh",{geometry:a,children:e.jsx("meshPhysicalMaterial",{color:"#aaddff",transmission:.82,roughness:.05,metalness:.15,clearcoat:1,clearcoatRoughness:.02,ior:1.65,transparent:!0,opacity:.88,reflectivity:.95,envMapIntensity:1.2})}),e.jsx("mesh",{geometry:a,scale:1.002,children:e.jsx("shaderMaterial",{ref:s,vertexShader:yt,fragmentShader:jt,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:h,depthWrite:!1,side:Oe,transparent:!0})}),e.jsx("mesh",{geometry:l,scale:.96,children:e.jsx("shaderMaterial",{ref:r,vertexShader:xt,fragmentShader:Mt,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:h,depthWrite:!1,side:D,transparent:!0})}),e.jsx("group",{ref:o,children:i.map((c,f)=>e.jsx("lineSegments",{geometry:c,rotation:[f*.12,f*.15,f*.08],children:e.jsx("lineBasicMaterial",{color:f<2?A:ue,blending:h,depthWrite:!1,opacity:.45+f*.12,toneMapped:!1,transparent:!0})},f))})]})}function wt({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>{const o=[];for(const a of[-1,1])for(const l of[-1,1])for(const i of[-1,1])o.push([a*1,l*1,i*1]);return o},[]),s=u.useMemo(()=>new _e(.04,3),[]);return v(({clock:o},a)=>{const l=o.elapsedTime,i=b(t),c=w(t);if(n.current){n.current.rotation.y+=a*.06*c;const f=.7+Math.sin(l*3.5)*.3*i;n.current.scale.setScalar(f)}}),e.jsx("group",{ref:n,children:r.map((o,a)=>{const l=new M(...o).normalize(),i=new M().addVectors(new M(...o),l.multiplyScalar(2));return e.jsxs("group",{position:o,children:[e.jsx("mesh",{geometry:s,lookAt:i,children:e.jsx("meshBasicMaterial",{color:A,blending:h,depthWrite:!1,opacity:.35,transparent:!0,toneMapped:!1})}),e.jsx("mesh",{geometry:s,lookAt:i,rotation:[0,0,Math.PI/2],children:e.jsx("meshBasicMaterial",{color:ue,blending:h,depthWrite:!1,opacity:.25,transparent:!0,toneMapped:!1})}),e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[.06,8,8]}),e.jsx("meshBasicMaterial",{color:A,toneMapped:!1})]})]},a)})})}function St({activity:t}){const n=u.useRef(null),r=u.useRef(null);return v(({clock:s},o)=>{const a=s.elapsedTime,l=w(t),i=b(t);if(n.current){n.current.rotation.z+=o*.35*l;const c=1+Math.sin(a*5.5)*.12*i;n.current.scale.setScalar(c)}r.current&&(r.current.intensity=3+i*3+Math.sin(a*6)*1.2)}),e.jsxs("group",{children:[e.jsxs("mesh",{children:[e.jsx("octahedronGeometry",{args:[.15,0]}),e.jsx("meshBasicMaterial",{color:A,toneMapped:!1})]}),e.jsxs("group",{ref:n,children:[[[0,0,0],[0,0,Math.PI/3],[0,0,2*Math.PI/3]].map((s,o)=>e.jsxs("mesh",{rotation:s,children:[e.jsx("planeGeometry",{args:[.06,2.8]}),e.jsx("meshBasicMaterial",{color:A,blending:h,depthWrite:!1,opacity:.4,transparent:!0,toneMapped:!1})]},`z${o}`)),[[Math.PI/6,Math.PI/2,0],[Math.PI/2,Math.PI/2,0],[5*Math.PI/6,Math.PI/2,0]].map((s,o)=>e.jsxs("mesh",{rotation:s,children:[e.jsx("planeGeometry",{args:[.05,2.4]}),e.jsx("meshBasicMaterial",{color:ue,blending:h,depthWrite:!1,opacity:.3,transparent:!0,toneMapped:!1})]},`x${o}`))]}),e.jsx("pointLight",{ref:r,color:A,intensity:5,distance:10})]})}function Et({activity:t}){const r=u.useRef(null),s=u.useMemo(()=>new _,[]),o=u.useMemo(()=>new N(.04,.04,.04),[]),a=u.useMemo(()=>{const l=P(3377);return Array.from({length:180},()=>({radius:1.5+l()*3.5,angle:l()*Math.PI*2,speed:(.15+l()*.6)*(l()>.5?1:-1),height:(l()-.5)*3.5,tilt:(l()-.5)*.8,size:.3+l()*.8}))},[]);return v(({clock:l},i)=>{const c=l.elapsedTime,f=w(t);if(r.current){for(let m=0;m<180;m++){const d=a[m],p=d.angle+c*d.speed*f;s.position.set(Math.cos(p)*d.radius,d.height+Math.sin(c*.8+m)*.15,Math.sin(p)*d.radius),s.rotation.set(c*d.speed*2,c*d.speed*1.5,d.tilt),s.scale.setScalar(d.size),s.updateMatrix(),r.current.setMatrixAt(m,s.matrix)}r.current.instanceMatrix.needsUpdate=!0}}),e.jsx("instancedMesh",{ref:r,args:[o,void 0,180],children:e.jsx("meshBasicMaterial",{color:A,blending:h,depthWrite:!1,opacity:.5,toneMapped:!1,transparent:!0})})}const Q=36;function he({activity:t,baseRadius:n=2.4,tiltX:r=0,tiltZ:s=0,phase:o=0}){const a=u.useRef(null),l=u.useRef(null),i=u.useMemo(()=>new _,[]),c=u.useMemo(()=>new Fe(.032,8,8),[]),f=u.useRef(n);return v(({clock:m},d)=>{const p=m.elapsedTime,g=w(t);let x=n;t==="listening"?x=n+.18:t==="thinking"?x=n+Math.sin(p*4.6)*.22:t==="speaking"&&(x=n+Math.sin(p*8.4)*.3),f.current=S.lerp(f.current,x,.1);const y=f.current;if(l.current&&(l.current.rotation.y+=d*.22*g),a.current){for(let j=0;j<Q;j++){const me=j/Q*Math.PI*2;i.position.set(Math.cos(me)*y,0,Math.sin(me)*y);const Ie=U(t,p,o+j*.4),ke=t==="speaking"?1.35:t==="thinking"?1.15:1;i.scale.setScalar(Ie*ke),i.updateMatrix(),a.current.setMatrixAt(j,i.matrix)}a.current.instanceMatrix.needsUpdate=!0}}),e.jsxs("group",{rotation:[r,0,s],ref:l,children:[e.jsx("instancedMesh",{ref:a,args:[c,void 0,Q],children:e.jsx("meshBasicMaterial",{color:"#ffffff",toneMapped:!1,blending:h,depthWrite:!1})}),e.jsxs("mesh",{rotation:[Math.PI/2,0,0],children:[e.jsx("torusGeometry",{args:[n,.007,8,96]}),e.jsx("meshBasicMaterial",{color:A,blending:h,depthWrite:!1,opacity:.4,transparent:!0,toneMapped:!1})]})]})}function Rt(){const n=u.useMemo(()=>{const s=P(2048),o=new Float32Array(500*3);for(let a=0;a<500;a++){const l=s()*Math.PI*2,i=Math.acos(2*s()-1),c=4+s()*6;o[a*3]=c*Math.sin(i)*Math.cos(l),o[a*3+1]=c*Math.sin(i)*Math.sin(l),o[a*3+2]=c*Math.cos(i)}return o},[]),r=u.useRef(null);return v(({clock:s})=>{r.current&&(r.current.rotation.y=s.elapsedTime*.006)}),e.jsxs("points",{ref:r,children:[e.jsx("bufferGeometry",{children:e.jsx("bufferAttribute",{attach:"attributes-position",args:[n,3]})}),e.jsx("pointsMaterial",{color:"#ffffff",blending:h,depthWrite:!1,opacity:.45,size:.02,sizeAttenuation:!0,toneMapped:!1,transparent:!0})]})}function Tt({children:t}){const n=u.useRef(null),{gl:r}=$(),s=u.useRef(!1),o=u.useRef(1);return u.useEffect(()=>{const a=r.domElement,l=()=>{s.current=!0},i=()=>{s.current=!1};return a.addEventListener("pointerenter",l),a.addEventListener("pointerleave",i),()=>{a.removeEventListener("pointerenter",l),a.removeEventListener("pointerleave",i)}},[r.domElement]),v(()=>{const a=s.current?1.12:1;o.current=S.lerp(o.current,a,.06),n.current&&n.current.scale.setScalar(o.current)}),e.jsx("group",{ref:n,children:t})}function Pt({activity:t="idle"}){return e.jsxs("group",{name:"crystal-tesseract-space-scene",scale:1.25,children:[e.jsx("ambientLight",{intensity:.4,color:vt}),e.jsxs(Tt,{children:[e.jsx(Rt,{}),e.jsx(Et,{activity:t}),e.jsx(he,{activity:t,baseRadius:2.4,tiltX:0,tiltZ:0,phase:0}),e.jsx(he,{activity:t,baseRadius:2.15,tiltX:1.05,tiltZ:.4,phase:2}),e.jsx(wt,{activity:t}),e.jsx(St,{activity:t}),e.jsx(bt,{activity:t})]})]})}const ne="#ff203c",Ae="#ff4b56",zt="#ffc35a",At=`
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
`,Ct=`
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
`,It=`
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
`;function kt({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useMemo(()=>[{base:[-.65,.25,-.1],scale:[.55,.42,.45],phase:.3},{base:[.6,-.15,.05],scale:[.45,.6,.42],phase:1.5},{base:[.1,.7,-.15],scale:[.38,.5,.35],phase:2.7},{base:[-.15,-.72,-.1],scale:[.42,.48,.38],phase:4.1}],[]);return v(({clock:a},l)=>{const i=a.elapsedTime,c=w(t),f=b(t);n.current&&(n.current.rotation.y+=l*.15*c,n.current.rotation.z=Math.sin(i*.2)*.1,n.current.scale.setScalar(U(t,i,.8))),r.current&&(r.current.uniforms.uTime.value=i,r.current.uniforms.uEnergy.value=f),s.current&&s.current.children.forEach((m,d)=>{const p=o[d];if(!p)return;m.position.set(p.base[0]+Math.sin(i*.8*c+p.phase)*.12,p.base[1]+Math.cos(i*.65*c+p.phase)*.1,p.base[2]+Math.sin(i*.5*c+p.phase)*.14);const g=1+Math.sin(i*3+p.phase)*.1*f;m.scale.set(p.scale[0]*g,p.scale[1]/g,p.scale[2]*g)})}),e.jsxs("group",{position:[0,0,0],children:[e.jsxs("mesh",{ref:n,children:[e.jsx("icosahedronGeometry",{args:[.82,32]}),e.jsx("shaderMaterial",{ref:r,vertexShader:At,fragmentShader:Ct,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:h,depthWrite:!1,transparent:!0})]}),e.jsx("group",{ref:s,children:o.map((a,l)=>e.jsxs("mesh",{position:a.base,scale:a.scale,children:[e.jsx("icosahedronGeometry",{args:[1,16]}),e.jsx("meshStandardMaterial",{color:"#3a0009",emissive:l%2===0?ne:Ae,emissiveIntensity:1.8,metalness:.1,roughness:.3,transparent:!0,opacity:.82})]},l))}),e.jsx("pointLight",{color:ne,intensity:3.5,distance:5,decay:2})]})}function Gt({activity:t}){const n=u.useRef(null);return v(({clock:r})=>{n.current&&(n.current.uniforms.uTime.value=r.elapsedTime,n.current.uniforms.uEnergy.value=b(t))}),e.jsxs("mesh",{position:[0,0,-1.6],scale:[5.8,4.4,1],children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("shaderMaterial",{ref:n,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:It,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:h,depthWrite:!1,transparent:!0})]})}function Lt({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(()=>new _,[]),o=22,a=u.useMemo(()=>{const l=P(2026);return Array.from({length:o},(i,c)=>({angle:c/o*Math.PI*2,radius:2.1+(l()-.5)*.35,height:.7+l()*.5,z:-.6+(l()-.5)*.6,tilt:(l()-.5)*.3,phase:l()*Math.PI*2}))},[]);return v(({clock:l})=>{if(!n.current||!r.current)return;const i=l.elapsedTime,c=w(t);a.forEach((f,m)=>{var y,j;const d=f.angle+i*.03*c,p=Math.sin(i*.8+f.phase)*.08,g=Math.cos(d)*f.radius,x=Math.sin(d)*f.radius*.65+p;s.position.set(g,x,f.z),s.rotation.set(f.tilt,-.2,d+Math.PI/2),s.scale.set(.18,f.height,.12),s.updateMatrix(),(y=n.current)==null||y.setMatrixAt(m,s.matrix),s.position.set(g*1.004,x*1.004,f.z+.07),s.rotation.set(0,0,d+Math.PI/2),s.scale.set(.11,.04,.015),s.updateMatrix(),(j=r.current)==null||j.setMatrixAt(m,s.matrix)}),n.current.instanceMatrix.needsUpdate=!0,r.current.instanceMatrix.needsUpdate=!0}),e.jsxs("group",{rotation:[.15,-.06,.08],children:[e.jsxs("instancedMesh",{ref:n,args:[void 0,void 0,o],children:[e.jsx("boxGeometry",{args:[1,1,1]}),e.jsx("meshStandardMaterial",{color:"#1a0408",emissive:"#4a050d",emissiveIntensity:.6,metalness:.2,roughness:.8})]}),e.jsxs("instancedMesh",{ref:r,args:[void 0,void 0,o],children:[e.jsx("boxGeometry",{args:[1,1,1]}),e.jsx("meshBasicMaterial",{color:zt,blending:h,depthWrite:!1,toneMapped:!1})]})]})}function Bt({activity:t}){const n=u.useRef(null),r=600,{positions:s,velocities:o}=u.useMemo(()=>{const a=P(8812),l=new Float32Array(r*3),i=new Float32Array(r*3);for(let c=0;c<r;c++)l[c*3]=(a()-.5)*5.5,l[c*3+1]=(a()-.5)*4.5,l[c*3+2]=(a()-.5)*3.5-.3,i[c*3]=(a()-.5)*.4,i[c*3+1]=.3+a()*.8,i[c*3+2]=(a()-.5)*.4;return{positions:l,velocities:i}},[]);return v((a,l)=>{if(!n.current)return;const i=n.current.geometry.attributes.position,c=i.array,f=w(t);for(let m=0;m<r;m++)c[m*3]+=o[m*3]*l*f,c[m*3+1]+=o[m*3+1]*l*f,c[m*3+2]+=o[m*3+2]*l*f,c[m*3+1]>2.5&&(c[m*3+1]=-2.5);i.needsUpdate=!0}),e.jsxs("points",{ref:n,children:[e.jsx("bufferGeometry",{children:e.jsx("bufferAttribute",{attach:"attributes-position",args:[s,3]})}),e.jsx("pointsMaterial",{color:Ae,blending:h,depthWrite:!1,opacity:.65,size:.035,sizeAttenuation:!0,toneMapped:!1,transparent:!0})]})}function Wt({activity:t="idle"}){return e.jsxs("group",{name:"reality-aether-forge-mcu",scale:1.25,children:[e.jsx("ambientLight",{intensity:.5,color:ne}),e.jsx(Gt,{activity:t}),e.jsx(Bt,{activity:t}),e.jsx(Lt,{activity:t}),e.jsx(kt,{activity:t})]})}const O="#23e777",Z="#66ff9f",Ft="#e0ffea",B="#8c6721",ge=`
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,ve=`
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
`,_t=`
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
`;function ee(t,n,r){const s=new H,o=t*.14,a=Math.PI*2/n;for(let f=0;f<n;f++){const m=f*a,d=m,p=m+a*.28,g=m+a*.52,x=m+a*.78,y=t,j=t+o;f===0?s.moveTo(Math.cos(d)*y,Math.sin(d)*y):s.lineTo(Math.cos(d)*y,Math.sin(d)*y),s.lineTo(Math.cos(p)*j,Math.sin(p)*j),s.lineTo(Math.cos(g)*j,Math.sin(g)*j),s.lineTo(Math.cos(x)*y,Math.sin(x)*y)}const l=new De,i=t*.65;for(let f=0;f<=32;f++){const m=f/32*Math.PI*2,d=Math.cos(m)*i,p=Math.sin(m)*i;f===0?l.moveTo(d,p):l.lineTo(d,p)}s.holes.push(l);const c={depth:r,bevelEnabled:!0,bevelSegments:2,steps:1,bevelSize:.015,bevelThickness:.015};return new W(s,c)}function Ut({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useRef(0),a=8,l=u.useMemo(()=>{const i=new H;i.moveTo(0,0),i.quadraticCurveTo(.6,.25,1.1,.05),i.lineTo(1.2,.45),i.quadraticCurveTo(.6,.75,0,.55),i.closePath();const c={depth:.04,bevelEnabled:!0,bevelSize:.01,bevelThickness:.01};return new W(i,c)},[]);return v(({clock:i},c)=>{const f=i.elapsedTime,m=w(t),d=t==="speaking"||t==="thinking"?.88:t==="listening"?.45:.18;if(o.current=S.lerp(o.current,d,.08),n.current&&(n.current.scale.set(U(t,f),t==="listening"?.92:1,1),n.current.rotation.y=Math.sin(f*.25)*.12),r.current&&r.current.children.forEach((p,g)=>{const x=g*Math.PI*2/a,y=o.current*.48,j=o.current*.55;p.position.x=Math.cos(x)*y,p.position.y=Math.sin(x)*y,p.rotation.z=x+j}),s.current){s.current.rotation.y+=c*1.4*m,s.current.rotation.x=Math.sin(f*.8)*.3;const p=.85+b(t)*.18+Math.sin(f*7)*.05;s.current.scale.setScalar(p)}}),e.jsxs("group",{ref:n,children:[e.jsxs("mesh",{position:[0,0,-.05],children:[e.jsx("torusGeometry",{args:[1.35,.08,16,48]}),e.jsx("meshStandardMaterial",{color:B,metalness:.88,roughness:.25,emissive:O,emissiveIntensity:.15})]}),e.jsx("group",{ref:r,position:[0,0,.02],children:Array.from({length:a},(i,c)=>e.jsx("mesh",{geometry:l,children:e.jsx("meshStandardMaterial",{color:B,metalness:.85,roughness:.22,emissive:O,emissiveIntensity:.12})},c))}),e.jsxs("mesh",{ref:s,position:[0,0,.18],children:[e.jsx("octahedronGeometry",{args:[.26,1]}),e.jsx("meshStandardMaterial",{color:"#0a8f45",emissive:O,emissiveIntensity:2.8,metalness:.2,roughness:.05,toneMapped:!1})]}),e.jsx("pointLight",{position:[0,0,.22],color:O,intensity:4.5,distance:5.5,decay:2})]})}function Ot({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=t==="thinking";return v(({clock:a})=>{const l=a.elapsedTime,i=b(t),c=o?-1:1;n.current&&(n.current.uniforms.uTime.value=l,n.current.uniforms.uEnergy.value=i,n.current.uniforms.uDirection.value=c),r.current&&(r.current.uniforms.uTime.value=l*.8,r.current.uniforms.uEnergy.value=i*.9,r.current.uniforms.uDirection.value=-c),s.current&&(s.current.rotation.z=Math.sin(l*.15)*.08)}),e.jsxs("group",{ref:s,children:[e.jsxs("mesh",{position:[0,0,-.12],scale:[3.4,3.4,1],children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("shaderMaterial",{ref:n,vertexShader:ge,fragmentShader:ve,uniforms:{uTime:{value:0},uEnergy:{value:1},uDirection:{value:1}},blending:h,depthWrite:!1,transparent:!0})]}),e.jsxs("mesh",{position:[0,0,-.28],scale:[4.8,4.8,1],children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("shaderMaterial",{ref:r,vertexShader:ge,fragmentShader:ve,uniforms:{uTime:{value:0},uEnergy:{value:1},uDirection:{value:-1}},blending:h,depthWrite:!1,transparent:!0})]})]})}function Dt({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useMemo(()=>ee(1.05,12,.08),[]),a=u.useMemo(()=>ee(1.55,18,.08),[]),l=u.useMemo(()=>ee(2.1,24,.08),[]);return v((i,c)=>{const f=w(t),m=t==="thinking"?-1:1;n.current&&(n.current.rotation.z+=c*.35*f*m),r.current&&(r.current.rotation.z-=c*.22*f*m),s.current&&(s.current.rotation.z+=c*.14*f*m)}),e.jsxs("group",{position:[0,0,-.35],children:[e.jsx("mesh",{ref:n,geometry:o,position:[0,0,0],children:e.jsx("meshStandardMaterial",{color:B,metalness:.82,roughness:.28,emissive:Z,emissiveIntensity:.25})}),e.jsx("mesh",{ref:r,geometry:a,position:[0,0,-.06],children:e.jsx("meshStandardMaterial",{color:B,metalness:.85,roughness:.25,emissive:O,emissiveIntensity:.2})}),e.jsx("mesh",{ref:s,geometry:l,position:[0,0,-.12],children:e.jsx("meshStandardMaterial",{color:B,metalness:.88,roughness:.22,emissive:Z,emissiveIntensity:.18})})]})}function Xt({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=48,o=u.useMemo(()=>new _,[]),a=u.useMemo(()=>{const i=[],c=P(452);for(let f=0;f<6;f++){const m=f%2===0?1:-1,d=[];for(let p=0;p<=5;p++){const g=p/5;d.push(new M(m*(.4+g*2.2+c()*.2),(f-2.5)*.45+Math.sin(g*Math.PI*1.5+f)*.4,-.3-g*.8+Math.cos(g*Math.PI)*.3))}i.push(new ie(d))}return i},[]),l=u.useMemo(()=>a.map(i=>new we(i,40,.018,8,!1)),[a]);return v(({clock:i})=>{const c=i.elapsedTime,f=w(t);n.current&&(n.current.position.z=Math.sin(c*.4)*.06),r.current&&(a.forEach((m,d)=>{var p;for(let g=0;g<8;g++){const x=d*8+g,y=(c*.25*f+g/8+d*.15)%1,j=m.getPoint(y);o.position.copy(j),o.scale.setScalar(.038+Math.sin(y*Math.PI)*.02),o.updateMatrix(),(p=r.current)==null||p.setMatrixAt(x,o.matrix)}}),r.current.instanceMatrix.needsUpdate=!0)}),e.jsxs("group",{ref:n,children:[l.map((i,c)=>e.jsx("mesh",{geometry:i,children:e.jsx("meshBasicMaterial",{color:Z,blending:h,depthWrite:!1,opacity:.48,transparent:!0,toneMapped:!1})},c)),e.jsxs("instancedMesh",{ref:r,args:[void 0,void 0,s],children:[e.jsx("sphereGeometry",{args:[1,8,8]}),e.jsx("meshBasicMaterial",{color:Ft,toneMapped:!1})]})]})}function Vt({activity:t}){const n=u.useRef(null),r=t==="thinking";return v(({clock:s})=>{n.current&&(n.current.uniforms.uTime.value=s.elapsedTime,n.current.uniforms.uEnergy.value=b(t),n.current.uniforms.uReversing.value=r?1:0)}),e.jsxs("mesh",{position:[0,0,-.08],scale:[4.2,4.2,1],children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("shaderMaterial",{ref:n,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:_t,uniforms:{uTime:{value:0},uEnergy:{value:1},uReversing:{value:0}},blending:h,depthWrite:!1,transparent:!0})]})}function Nt({activity:t="idle"}){return e.jsxs("group",{name:"agamotto-temporal-eye-scene",scale:1.25,children:[e.jsx("ambientLight",{intensity:.5,color:B}),e.jsx("directionalLight",{position:[4,4,4],intensity:1.8,color:Z}),e.jsx(Vt,{activity:t}),e.jsx(Ot,{activity:t}),e.jsx(Xt,{activity:t}),e.jsx(Dt,{activity:t}),e.jsx(Ut,{activity:t})]})}const T="#ff183b",re="#ff5870",X="#ffffff";function xe(t=1){const n=new H;return n.moveTo(.14*t,1.42),n.quadraticCurveTo(1.18*t,1.08,1.38*t,-1.28),n.quadraticCurveTo(.52*t,-.88,.14*t,1.42),n.closePath(),n}function Zt({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useMemo(()=>xe(-1),[]),a=u.useMemo(()=>xe(1),[]),l=u.useMemo(()=>new de(o,24),[o]),i=u.useMemo(()=>new de(a,24),[a]),c=u.useMemo(()=>({depth:.16,bevelEnabled:!0,bevelSize:.04,bevelThickness:.04,bevelSegments:3}),[]),f=u.useMemo(()=>new W(o,c),[o,c]),m=u.useMemo(()=>new W(a,c),[a,c]);return v(({clock:d})=>{const p=d.elapsedTime;n.current&&n.current.scale.setScalar(U(t,p,.4));const g=t==="listening"?.75:t==="thinking"?.92:t==="speaking"?1.08:.96;r.current&&(r.current.scale.y=g+Math.sin(p*2.5)*.035),s.current&&(s.current.scale.y=g+Math.cos(p*2.5)*.035)}),e.jsxs("group",{ref:n,position:[0,.15,.55],children:[e.jsx("mesh",{position:[-.92,0,.02],scale:[1.18,1.18,1],geometry:f,children:e.jsx("meshStandardMaterial",{color:"#3a0009",emissive:T,emissiveIntensity:1.2,metalness:.92,roughness:.18})}),e.jsx("mesh",{position:[.92,0,.02],scale:[1.18,1.18,1],geometry:m,children:e.jsx("meshStandardMaterial",{color:"#3a0009",emissive:T,emissiveIntensity:1.2,metalness:.92,roughness:.18})}),e.jsx("mesh",{ref:r,position:[-.92,0,.14],geometry:l,children:e.jsx("meshBasicMaterial",{color:X,toneMapped:!1})}),e.jsx("mesh",{ref:s,position:[.92,0,.14],geometry:i,children:e.jsx("meshBasicMaterial",{color:X,toneMapped:!1})}),e.jsx("mesh",{position:[-.92,0,.16],scale:[1.04,1.04,1],geometry:l,children:e.jsx("meshBasicMaterial",{color:re,blending:h,depthWrite:!1,opacity:.4,toneMapped:!1,transparent:!0})}),e.jsx("mesh",{position:[.92,0,.16],scale:[1.04,1.04,1],geometry:i,children:e.jsx("meshBasicMaterial",{color:re,blending:h,depthWrite:!1,opacity:.4,toneMapped:!1,transparent:!0})}),e.jsx("pointLight",{color:X,intensity:4,distance:5.5,position:[0,0,.8]}),e.jsx("pointLight",{color:T,intensity:3,distance:4.5,position:[0,0,.4]})]})}function Yt({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>Array.from({length:8},(s,o)=>{const a=o<4?-1:1,l=o%4;return{side:a,lane:l}}),[]);return v(({clock:s})=>{if(!n.current)return;const o=s.elapsedTime,a=w(t);n.current.rotation.z=Math.sin(o*.8*a)*.04,n.current.scale.setScalar(.98+b(t)*.07)}),e.jsx("group",{ref:n,position:[0,0,-.2],children:r.map((s,o)=>{const{side:a,lane:l}=s,i=a*(.8+l*.1),c=.6-l*.35,f=a*(1.8+l*.22),m=1.2-l*.48,d=a*(2.8+l*.32),p=.6-l*.68,g=a*(3.6+l*.28),x=.1-l*.82;return e.jsxs("group",{children:[e.jsxs("mesh",{position:[(i+f)/2,(c+m)/2,-.2],children:[e.jsx("boxGeometry",{args:[Math.abs(f-i),.12,.12]}),e.jsx("meshStandardMaterial",{color:"#2a040b",emissive:T,emissiveIntensity:.8,metalness:.9,roughness:.2})]}),e.jsxs("mesh",{position:[f,m,-.2],children:[e.jsx("sphereGeometry",{args:[.1,16,16]}),e.jsx("meshBasicMaterial",{color:X,toneMapped:!1})]}),e.jsxs("mesh",{position:[(f+d)/2,(m+p)/2,-.3],children:[e.jsx("boxGeometry",{args:[Math.abs(d-f),.09,.09]}),e.jsx("meshStandardMaterial",{color:"#2a040b",emissive:re,emissiveIntensity:.7,metalness:.92,roughness:.18})]}),e.jsxs("mesh",{position:[d,p,-.3],children:[e.jsx("sphereGeometry",{args:[.08,16,16]}),e.jsx("meshBasicMaterial",{color:T,toneMapped:!1})]}),e.jsxs("mesh",{position:[(d+g)/2,(p+x)/2,-.4],children:[e.jsx("boxGeometry",{args:[Math.abs(g-d),.06,.06]}),e.jsx("meshStandardMaterial",{color:"#120004",emissive:T,emissiveIntensity:1,metalness:.95,roughness:.12})]})]},o)})})}function $t({activity:t}){const n=u.useRef(null),r=u.useRef(null),{points:s}=u.useMemo(()=>{const o=P(2099),a=[];for(let l=0;l<72;l++)a.push(new M((o()-.5)*6.5,(o()-.5)*5,-.8-o()*1.8));return{points:a}},[]);return v(({clock:o})=>{const a=o.elapsedTime;n.current&&(n.current.rotation.y=Math.sin(a*.18)*.08),r.current&&(r.current.uniforms.uTime.value=a,r.current.uniforms.uEnergy.value=b(t))}),e.jsxs("group",{ref:n,children:[[1.6,2.8,4.2].map((o,a)=>e.jsxs("mesh",{position:[0,0,-.5],rotation:[0,0,a*.5],children:[e.jsx("ringGeometry",{args:[o,o+.02,64]}),e.jsx("meshBasicMaterial",{color:T,blending:h,opacity:.4,transparent:!0,toneMapped:!1})]},a)),e.jsxs("points",{children:[e.jsx("bufferGeometry",{children:e.jsx("bufferAttribute",{attach:"attributes-position",args:[new Float32Array(s.flatMap(o=>[o.x,o.y,o.z])),3]})}),e.jsx("pointsMaterial",{color:X,blending:h,opacity:.75,size:.04,sizeAttenuation:!0,transparent:!0,toneMapped:!1})]}),e.jsxs("mesh",{position:[0,-2.1,-.4],rotation:[-Math.PI/2.6,0,0],scale:[7.8,6.8,1],children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("shaderMaterial",{ref:r,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:`
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
          `,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:h,depthWrite:!1,transparent:!0})]})]})}function Ht({activity:t}){const n=u.useRef(null);return v(({clock:r},s)=>{n.current&&(n.current.rotation.y=Math.sin(r.elapsedTime*.3)*.12,n.current.rotation.z+=s*.015*w(t))}),e.jsxs("group",{position:[0,.05,-.2],children:[e.jsxs("mesh",{scale:[1.6,1.9,.95],children:[e.jsx("dodecahedronGeometry",{args:[1.02,1]}),e.jsx("meshStandardMaterial",{color:"#080204",emissive:"#28000a",emissiveIntensity:.5,metalness:.9,roughness:.2})]}),e.jsxs("mesh",{ref:n,scale:[1.66,1.98,1.02],children:[e.jsx("dodecahedronGeometry",{args:[1.02,1]}),e.jsx("meshBasicMaterial",{color:T,blending:h,depthWrite:!1,opacity:.35,toneMapped:!1,transparent:!0,wireframe:!0})]})]})}function qt({activity:t="idle"}){return e.jsxs("group",{name:"iron-spider-tactical-hud-mcu",scale:1.28,children:[e.jsx("ambientLight",{intensity:.6,color:T}),e.jsx($t,{activity:t}),e.jsx(Yt,{activity:t}),e.jsx(Ht,{activity:t}),e.jsx(Zt,{activity:t})]})}const Ce="#8b3dff",se="#e14cff",Kt="#eef1ff",Jt=`
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Qt=`
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
`,en=`
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
`,tn=`
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
`;function nn({activity:t}){const n=u.useRef(null),r=u.useRef(null);return v(({clock:s},o)=>{const a=s.elapsedTime,l=w(t);n.current&&(n.current.rotation.z+=o*.1*l,n.current.scale.setScalar(U(t,a,1.6))),r.current&&(r.current.uniforms.uTime.value=a,r.current.uniforms.uEnergy.value=b(t))}),e.jsxs("group",{ref:n,children:[e.jsxs("mesh",{position:[0,0,.35],children:[e.jsx("sphereGeometry",{args:[.52,64,64]}),e.jsx("meshBasicMaterial",{color:"#000000",toneMapped:!1})]}),e.jsxs("mesh",{position:[0,0,.25],scale:1.85,children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("shaderMaterial",{ref:r,vertexShader:Jt,fragmentShader:Qt,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:h,depthWrite:!1,transparent:!0})]})]})}function rn({activity:t}){const n=u.useRef(null),r=5e3,{positions:s,seeds:o,armOffsets:a}=u.useMemo(()=>{const l=P(9918),i=new Float32Array(r*3),c=new Float32Array(r),f=new Float32Array(r);for(let m=0;m<r;m++){const d=.55+Math.pow(l(),1.5)*2.5,p=l()*Math.PI*2,g=m%3*(Math.PI*2/3);i[m*3]=Math.cos(p)*d,i[m*3+1]=Math.sin(p)*d,i[m*3+2]=(l()-.5)*(.04+d*.08),c[m]=l(),f[m]=g}return{positions:i,seeds:c,armOffsets:f}},[]);return v(({clock:l})=>{n.current&&(n.current.uniforms.uTime.value=l.elapsedTime,n.current.uniforms.uSpeed.value=w(t),n.current.uniforms.uEnergy.value=b(t))}),e.jsxs("points",{rotation:[1.14,.18,-.28],children:[e.jsxs("bufferGeometry",{children:[e.jsx("bufferAttribute",{attach:"attributes-position",args:[s,3]}),e.jsx("bufferAttribute",{attach:"attributes-aSeed",args:[o,1]}),e.jsx("bufferAttribute",{attach:"attributes-aArmOffset",args:[a,1]})]}),e.jsx("shaderMaterial",{ref:n,vertexShader:en,fragmentShader:tn,uniforms:{uTime:{value:0},uSpeed:{value:1},uEnergy:{value:1}},blending:h,depthWrite:!1,transparent:!0})]})}function sn({activity:t}){const n=u.useRef(null);return v(({clock:r})=>{if(!n.current)return;const s=r.elapsedTime,o=.9+b(t)*.35+Math.sin(s*6)*.08;n.current.scale.set(1,o,1)}),e.jsxs("group",{ref:n,rotation:[.12,.18,-.28],children:[e.jsxs("mesh",{position:[0,2.4,-.2],children:[e.jsx("coneGeometry",{args:[.14,4.8,32,1,!0]}),e.jsx("meshBasicMaterial",{color:Kt,blending:h,depthWrite:!1,opacity:.35,side:D,toneMapped:!1,transparent:!0})]}),e.jsxs("mesh",{position:[0,2.4,-.2],scale:[1.4,1,1.4],children:[e.jsx("coneGeometry",{args:[.14,4.8,32,1,!0]}),e.jsx("meshBasicMaterial",{color:se,blending:h,depthWrite:!1,opacity:.2,side:D,toneMapped:!1,transparent:!0})]}),e.jsxs("mesh",{position:[0,-2.4,-.2],rotation:[0,0,Math.PI],children:[e.jsx("coneGeometry",{args:[.14,4.8,32,1,!0]}),e.jsx("meshBasicMaterial",{color:se,blending:h,depthWrite:!1,opacity:.3,side:D,toneMapped:!1,transparent:!0})]})]})}function on({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>new _,[]),s=64,o=u.useMemo(()=>{const a=P(1088);return Array.from({length:s},(l,i)=>{const c=i/s*Math.PI*2+a()*.3,f=1.2+a()*2.2;return{angle:c,radius:f,yScale:.14+a()*.42,phase:a()*Math.PI*2,z:-.4+(a()-.5)*2.8}})},[]);return v(({clock:a})=>{if(!n.current)return;const l=a.elapsedTime,i=w(t),c=t==="thinking"?.3+Math.pow(Math.abs(Math.sin(l*.8)),6)*.3:1;o.forEach((f,m)=>{var g;const d=f.angle+l*.045*i*(m%2?1:-1),p=f.radius*c;r.position.set(Math.cos(d)*p,Math.sin(d)*p*.72,f.z+Math.sin(l*.7+f.phase)*.14),r.rotation.set(f.phase+l*.22,d,l*.28+f.phase),r.scale.set(.09,f.yScale,.09),r.updateMatrix(),(g=n.current)==null||g.setMatrixAt(m,r.matrix)}),n.current.instanceMatrix.needsUpdate=!0}),e.jsxs("instancedMesh",{ref:n,args:[void 0,void 0,s],children:[e.jsx("tetrahedronGeometry",{args:[1,0]}),e.jsx("meshPhysicalMaterial",{color:"#7a42ff",emissive:Ce,emissiveIntensity:1,metalness:.1,roughness:.08,transmission:.52,transparent:!0,opacity:.88})]})}function an({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>{const s=P(818),o=[];for(let a=0;a<18;a+=1){const l=a/18*Math.PI*2,i=[];for(let c=0;c<=42;c+=1){const f=c/42,m=f>.55?(a%3-1)*(f-.55)*.72:0,d=.5+f*(2+s()*.4);i.push(new M(Math.cos(l+m)*d,Math.sin(l+m)*d*.82,-.4-f*.95+Math.sin(f*Math.PI*2+a)*.16))}o.push(i)}return ze(o)},[]);return v(({clock:s},o)=>{n.current&&(n.current.rotation.z-=o*.028*w(t),n.current.scale.setScalar(.94+b(t)*.08+Math.sin(s.elapsedTime*.7)*.015))}),e.jsx("group",{ref:n,rotation:[.14,-.2,0],children:e.jsx("lineSegments",{geometry:r,children:e.jsx("lineBasicMaterial",{color:se,blending:h,depthWrite:!1,opacity:.42,toneMapped:!1,transparent:!0})})})}function ln({activity:t="idle"}){return e.jsxs("group",{name:"quantum-power-singularity-mcu",scale:1.28,children:[e.jsx("ambientLight",{intensity:.6,color:Ce}),e.jsx(an,{activity:t}),e.jsx(on,{activity:t}),e.jsx(sn,{activity:t}),e.jsx(rn,{activity:t}),e.jsx(nn,{activity:t})]})}const Y="#ff7a18",fe="#ffc55c",oe="#8ef7ff",cn="#17100a";function Me(t){const n=new H;for(let r=0;r<3;r+=1){const s=Math.PI/2+r*Math.PI*2/3,o=Math.cos(s)*t,a=Math.sin(s)*t;r===0?n.moveTo(o,a):n.lineTo(o,a)}return n.closePath(),n}function un({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useMemo(()=>new W(Me(.85),{depth:.12,bevelEnabled:!0,bevelSize:.04,bevelThickness:.04,bevelSegments:3}),[]),a=u.useMemo(()=>new W(Me(.52),{depth:.16,bevelEnabled:!0,bevelSize:.03,bevelThickness:.03,bevelSegments:2}),[]);return v(({clock:l},i)=>{const c=l.elapsedTime,f=w(t);n.current&&(n.current.rotation.z=Math.sin(c*.2)*.04,n.current.scale.setScalar(U(t,c))),r.current&&(r.current.rotation.z-=i*.5*f),s.current&&(s.current.uniforms.uTime.value=c,s.current.uniforms.uEnergy.value=b(t))}),e.jsxs("group",{ref:n,rotation:[.02,-.05,0],children:[e.jsx("mesh",{geometry:o,position:[0,0,-.06],children:e.jsx("meshStandardMaterial",{color:cn,emissive:Y,emissiveIntensity:.4,metalness:.94,roughness:.18})}),e.jsx("mesh",{geometry:a,position:[0,0,.05],scale:.96,children:e.jsx("shaderMaterial",{ref:s,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:`
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
          `,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:h,depthWrite:!1,toneMapped:!1,transparent:!0})}),e.jsx("group",{ref:r,position:[0,0,.16],children:Array.from({length:9},(l,i)=>{const c=i*Math.PI*2/9;return e.jsxs("mesh",{position:[Math.cos(c)*.28,Math.sin(c)*.28,0],rotation:[0,0,c],children:[e.jsx("boxGeometry",{args:[.3,.038,.038]}),e.jsx("meshBasicMaterial",{color:i%3===0?oe:fe,toneMapped:!1})]},i)})}),e.jsx("pointLight",{color:Y,intensity:4,distance:5,position:[0,0,.3]}),e.jsx("pointLight",{color:oe,intensity:2.5,distance:3.5,position:[0,0,.4]})]})}function fn({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>new _,[]),s=u.useMemo(()=>{const o=[];for(let a=0;a<3;a+=1){const l=9+a*3;for(let i=0;i<l;i+=1)o.push({angle:i*Math.PI*2/l+a*.18,radius:1.1+a*.35,depth:-.14-a*.18,size:.22+a*.045,phase:i*.47+a})}return o},[]);return v(({clock:o})=>{if(!n.current)return;const a=o.elapsedTime,l=t==="thinking"?.28:t==="speaking"?.15:t==="listening"?-.05:0;s.forEach((i,c)=>{var d;const f=Math.sin(a*1.6+i.phase)*.03,m=i.radius+l+f;r.position.set(Math.cos(i.angle)*m,Math.sin(i.angle)*m*.78,i.depth+Math.sin(a*.8+i.phase)*.08),r.rotation.set(.16*Math.sin(i.phase),-.25,i.angle+Math.PI/2),r.scale.set(i.size*1.45,i.size*.45,.08),r.updateMatrix(),(d=n.current)==null||d.setMatrixAt(c,r.matrix)}),n.current.instanceMatrix.needsUpdate=!0}),e.jsxs("instancedMesh",{ref:n,args:[void 0,void 0,s.length],children:[e.jsx("boxGeometry",{args:[1,1,1]}),e.jsx("meshStandardMaterial",{color:"#140c08",emissive:Y,emissiveIntensity:.4,metalness:.92,roughness:.22})]})}function mn({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(()=>[{position:[-2.2,.75,-.4],rotation:[.08,.48,-.04],scale:[1.15,.7,1]},{position:[2.15,.45,-.24],rotation:[-.04,-.52,.06],scale:[.95,.6,1]},{position:[-1.65,-1.35,-.68],rotation:[-.16,.34,-.14],scale:[.8,.44,1]},{position:[1.58,-1.4,-.5],rotation:[.14,-.4,.12],scale:[.88,.48,1]}],[]);return v(({clock:o})=>{n.current&&(n.current.position.y=Math.sin(o.elapsedTime*.45)*.05,n.current.scale.setScalar(.98+b(t)*.025)),r.current&&(r.current.uniforms.uTime.value=o.elapsedTime,r.current.uniforms.uEnergy.value=b(t))}),e.jsx("group",{ref:n,children:s.map((o,a)=>e.jsxs("mesh",{position:o.position,rotation:o.rotation,scale:o.scale,children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("shaderMaterial",{ref:a===0?r:void 0,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:`
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
            `,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:h,depthWrite:!1,side:D,transparent:!0})]},a))})}function dn({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>{const a=[new M(-1.75,.68,-.2),new M(1.72,.38,-.12),new M(-1.3,-1.08,-.38),new M(1.26,-1.12,-.3)].map((l,i)=>{const c=[];for(let f=0;f<=28;f+=1){const m=f/28;c.push(new M(l.x*m,l.y*m+Math.sin(m*Math.PI)*(i%2?-.24:.24),l.z*m+Math.sin(m*Math.PI*2+i)*.08))}return c});return ze(a)},[]),s=u.useMemo(()=>Pe([[new M(0,.85,0),new M(0,2.45,-.45)],[new M(-.08,.78,0),new M(-.56,2.1,-.3)],[new M(.08,.78,0),new M(.6,2.2,-.34)]]),[]);return v(({clock:o})=>{n.current&&(n.current.rotation.z=Math.sin(o.elapsedTime*.16)*.025,n.current.scale.setScalar(.98+b(t)*.025))}),e.jsxs("group",{ref:n,children:[e.jsx("lineSegments",{geometry:r,children:e.jsx("lineBasicMaterial",{color:fe,blending:h,depthWrite:!1,opacity:.65,toneMapped:!1,transparent:!0})}),e.jsx("lineSegments",{geometry:s,children:e.jsx("lineBasicMaterial",{color:oe,blending:h,depthWrite:!1,opacity:.52,toneMapped:!1,transparent:!0})})]})}function pn({activity:t="idle"}){return e.jsxs("group",{name:"stark-mark-l-arc-reactor",scale:1.25,rotation:[.08,-.18,.025],children:[e.jsx("ambientLight",{color:Y,intensity:.5}),e.jsx("directionalLight",{color:fe,intensity:1.8,position:[2.5,3.2,4]}),e.jsx(mn,{activity:t}),e.jsx(dn,{activity:t}),e.jsx(fn,{activity:t}),e.jsx(un,{activity:t})]})}const ye={gold:"#020100",green:"#000704",blue:"#00040a",red:"#080002",violet:"#02000a",orange:"#080300",spider:"#000408"},hn={blue:.9,green:.94,red:.88,violet:.86,orange:.92,spider:.78};function gn(t){return ye[t]||ye.gold}function ae(t,n){const r=n.getBoundingClientRect(),s=Math.min(r.width,r.height)*.38;if(s<=0)return!1;const o=(t.clientX-(r.left+r.width/2))/s,a=(t.clientY-(r.top+r.height/2))/(s*.94);return o*o+a*a<=1}function vn({palette:t}){const{gl:n}=$();return u.useEffect(()=>{const r=gn(t);n.setClearColor(r,1),n.toneMappingExposure=hn[t]??.94},[n,t]),null}function xn({resetSignal:t=0}){const{camera:n,gl:r,size:s}=$(),o=u.useMemo(()=>new Ne(n,r.domElement),[n,r]);return u.useEffect(()=>{o.enableDamping=!0,o.dampingFactor=.075,o.enablePan=!1,o.enableZoom=!1,o.enableRotate=!1,o.rotateSpeed=0,o.zoomSpeed=.48,o.minDistance=5.25,o.maxDistance=s.width/s.height<.72?15:8.6,o.target.set(0,0,0),r.domElement.classList.add("is-orbit-enabled");const a=i=>{const c=!document.body.classList.contains("hud-dragging")&&ae(i,r.domElement);o.enableZoom=c,r.domElement.classList.toggle("orb-hit-active",c)},l=()=>{o.enableZoom=!1,r.domElement.classList.remove("orb-hit-active")};return r.domElement.addEventListener("pointermove",a,{passive:!0}),r.domElement.addEventListener("pointerleave",l),r.domElement.addEventListener("wheel",a,{capture:!0,passive:!0}),()=>{r.domElement.classList.remove("is-orbit-enabled"),r.domElement.classList.remove("orb-hit-active"),r.domElement.removeEventListener("pointermove",a),r.domElement.removeEventListener("pointerleave",l),r.domElement.removeEventListener("wheel",a,!0),o.dispose()}},[o,r.domElement,s]),u.useEffect(()=>{const l=s.width/s.height<.72?10.8:6.1;n.position.set(0,0,l),o.target.set(0,0,0),o.update()},[n,o,t,s.height,s.width]),v(()=>o.update()),null}function Mn(t){return t instanceof HTMLElement?!!t.closest(".hud-dock, .history-panel, .chat-side-panel, .settings-panel, .activity-hub, .prompt-shell, .draggable-panel, .os-taskbar, .os-minimized-dock, button, input, textarea, select"):!1}function yn({resetSignal:t=0,children:n}){const r=u.useRef(null),{pointer:s,size:o,gl:a}=$(),l=u.useRef(!1),i=u.useRef({active:!1,x:0,y:0,targetX:0,targetY:0,lastX:0,lastY:0});return u.useEffect(()=>{const c=d=>{d.button!==0||d.target!==a.domElement||Mn(d.target)||document.body.classList.contains("hud-dragging")||!ae(d,a.domElement)||(l.current=!0,i.current.active=!0,i.current.lastX=d.clientX,i.current.lastY=d.clientY,document.body.classList.add("is-reactor-dragging"))},f=d=>{if(l.current=d.target===a.domElement&&!document.body.classList.contains("hud-dragging")&&ae(d,a.domElement),!i.current.active)return;const p=d.clientX-i.current.lastX,g=d.clientY-i.current.lastY;i.current.lastX=d.clientX,i.current.lastY=d.clientY,i.current.targetY+=p*.0065,i.current.targetX+=g*.0048,i.current.targetX=S.clamp(i.current.targetX,-.9,.9)},m=()=>{i.current.active=!1,document.body.classList.remove("is-reactor-dragging")};return window.addEventListener("pointerdown",c),window.addEventListener("pointermove",f),window.addEventListener("pointerup",m),window.addEventListener("pointercancel",m),()=>{window.removeEventListener("pointerdown",c),window.removeEventListener("pointermove",f),window.removeEventListener("pointerup",m),window.removeEventListener("pointercancel",m),document.body.classList.remove("is-reactor-dragging")}},[a.domElement]),u.useEffect(()=>{i.current.x=0,i.current.y=0,i.current.targetX=0,i.current.targetY=0},[t]),v(({clock:c})=>{const f=o.width/o.height<.72;if(r.current){i.current.x=S.lerp(i.current.x,i.current.targetX,.09),i.current.y=S.lerp(i.current.y,i.current.targetY,.09);const m=f||!l.current||document.body.classList.contains("hud-dragging")?0:.08;r.current.rotation.x=S.lerp(r.current.rotation.x,i.current.x-s.y*m,.045),r.current.rotation.y=S.lerp(r.current.rotation.y,i.current.y+s.x*m,.045),r.current.rotation.z=0}}),e.jsx("group",{ref:r,children:n})}function jn({activity:t,palette:n}){const r=u.useMemo(()=>{const s=t==="speaking"?1.25:t==="thinking"?1.12:1,o={blue:{intensity:1.32,threshold:.28,smoothing:.52},green:{intensity:1.35,threshold:.26,smoothing:.55},red:{intensity:1.28,threshold:.32,smoothing:.48},violet:{intensity:1.42,threshold:.25,smoothing:.5},orange:{intensity:1.3,threshold:.35,smoothing:.45},spider:{intensity:1.25,threshold:.28,smoothing:.4}},a=o[n]??o.blue;return{...a,intensity:a.intensity*s}},[t,n]);return e.jsx(Ze,{multisampling:0,children:e.jsx(Ye,{intensity:r.intensity,luminanceSmoothing:r.smoothing,luminanceThreshold:r.threshold,mipmapBlur:!0})})}function Sn({activity:t,palette:n,resetSignal:r=0}){const s=Xe();return e.jsx("div",{className:"orb-webgl","aria-hidden":"true",children:e.jsxs(Ve,{camera:{fov:41,near:.1,far:30,position:[0,0,6.1]},dpr:s?1:[1,1.45],frameloop:s?"demand":"always",children:[e.jsx(vn,{palette:n}),e.jsx(xn,{resetSignal:r}),e.jsx(yn,{resetSignal:r,children:e.jsx($e,{palette:n,children:o=>o==="gold"?e.jsx(pe,{activity:t,palette:"gold"}):o==="green"?e.jsx(Nt,{activity:t}):o==="blue"?e.jsx(Pt,{activity:t}):o==="red"?e.jsx(Wt,{activity:t}):o==="violet"?e.jsx(ln,{activity:t}):o==="orange"?e.jsx(pn,{activity:t}):o==="spider"?e.jsx(qt,{activity:t}):e.jsx(pe,{activity:t,palette:"gold"})})}),e.jsx(jn,{activity:t,palette:n})]})})}export{Sn as default};
