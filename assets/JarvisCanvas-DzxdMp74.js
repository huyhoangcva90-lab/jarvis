import{r as p,j as e}from"./index-BCjlcQ4B.js";import{u as S,M as I,C as R,A as g,I as Je,W as Qe,V as v,B as k,F as L,U as Be,a as ce,b as V,E as ye,c as ve,T as et,d as tt,S as Fe,D as K,e as pe,f as he,g as nt,h as rt,O as Ie,i as st,j as Ee,k as ot,l as at,m as it,n as ct,o as je,p as lt,q as ut,w as ft}from"./useReducedMotion-c5mC2vBO.js";function pt({palette:t,children:n}){const r=p.useRef(null),[u,i]=p.useState(t),[c,a]=p.useState("idle"),s=p.useRef(1);return p.useEffect(()=>{t!==u&&a("out")},[t,u]),S((l,o)=>{c==="out"?(s.current=I.lerp(s.current,0,o*12),s.current<.05&&(s.current=0,i(t),a("in"))):c==="in"&&(s.current=I.lerp(s.current,1,o*8),s.current>.95&&(s.current=1,a("idle"))),r.current&&(r.current.scale.setScalar(s.current),r.current.rotation.y=(1-s.current)*Math.PI*.25)}),e.jsx("group",{ref:r,children:n(u)})}const le=new R("#fff8d6"),_e=new R("#d65f10"),ht={gold:["#fff8d6","#d65f10"],green:["#f5fff6","#18bd58"],violet:["#faf5ff","#7c3aed"],orange:["#fff5de","#ed5f12"]};function dt(t){return()=>{let n=t+=1831565813;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}function Le(t){return t==="speaking"?1.52:t==="thinking"?1.28:t==="listening"?.82:1}function Ve(t){return t==="speaking"?1.85:t==="thinking"?1.42:t==="listening"?.46:1}const de={uniforms:{uTime:{value:0},uEnergy:{value:1},uOpacity:{value:1},uColor:{value:le}},vertexShader:`
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
  `};function mt(){return{uniforms:Be.clone(de.uniforms),vertexShader:de.vertexShader,fragmentShader:de.fragmentShader}}function gt(){const t=dt(60879),n=[],r=[],u=[];for(let c=0;c<42;c+=1){const a=t()*Math.PI*2,s=Math.acos(2*t()-1),l=new v(Math.sin(s)*Math.cos(a),Math.cos(s),Math.sin(s)*Math.sin(a)),o=.24+t()*.32,f=1.04+t()*(c%5===0?1.34:.82),h=l.clone().multiplyScalar(o),d=l.clone().multiplyScalar(f);n.push(h.x,h.y,h.z,d.x,d.y,d.z),r.push(t()*6.28,t()*6.28),u.push(.35+t()*.65,.35+t()*.65)}const i=new k;return i.setAttribute("position",new L(n,3)),i.setAttribute("aPhase",new L(r,1)),i.setAttribute("aIntensity",new L(u,1)),i}function xt({activity:t,flashRef:n}){const r=p.useRef(null),u=p.useRef(null),i=p.useMemo(gt,[]),c=p.useMemo(mt,[]);return S(({clock:a},s)=>{const l=Le(t)*(1+n.current*2);u.current&&(u.current.uniforms.uTime.value=a.elapsedTime,u.current.uniforms.uEnergy.value=l*(t==="speaking"?1.22:1),u.current.uniforms.uOpacity.value=t==="speaking"?.82:.7,u.current.uniforms.uColor.value.copy(le)),r.current&&(r.current.rotation.y+=s*.055*Ve(t),r.current.rotation.x=Math.sin(a.elapsedTime*.18)*.05,r.current.scale.setScalar(1+n.current*.2))}),e.jsx("group",{ref:r,children:e.jsx("lineSegments",{geometry:i,children:e.jsx("shaderMaterial",{ref:u,args:[c],blending:g,depthWrite:!1,toneMapped:!1,transparent:!0})})})}function Mt({activity:t,flashRef:n}){const r=p.useRef(null),u=p.useRef(null),i=p.useRef(null),c=p.useRef(null),a=p.useMemo(()=>{const s=new Je(2.02,2),l=new Qe(s);return s.dispose(),l},[]);return S(({clock:s},l)=>{const o=s.elapsedTime,f=Ve(t),h=Le(t),d=t==="speaking"?Math.sin(o*7.2)*.035:0,m=t==="thinking"?Math.sin(o*3.4)*.018:0,y=1+d+m+n.current*.075;r.current&&(r.current.rotation.x+=l*.035*f,r.current.rotation.y+=l*.052*f,r.current.rotation.z-=l*.018*f,r.current.scale.setScalar(y)),u.current&&(u.current.rotation.x-=l*.026*f,u.current.rotation.y-=l*.041*f,u.current.rotation.z+=l*.023*f,u.current.scale.setScalar(.91-d*.42+n.current*.035)),i.current&&(i.current.opacity=.2+h*.13+n.current*.24),c.current&&(c.current.opacity=.08+h*.075+n.current*.12)}),e.jsxs("group",{rotation:[.08,-.18,.06],children:[e.jsx("lineSegments",{ref:r,geometry:a,children:e.jsx("lineBasicMaterial",{ref:i,blending:g,color:le,depthWrite:!1,opacity:.34,toneMapped:!1,transparent:!0})}),e.jsx("lineSegments",{ref:u,geometry:a,children:e.jsx("lineBasicMaterial",{ref:c,blending:g,color:_e,depthWrite:!1,opacity:.15,toneMapped:!1,transparent:!0})})]})}function yt({activity:t,palette:n="gold"}){const[r,u]=ht[n];le.set(r),_e.set(u);const[i,c]=p.useState(0),a=p.useRef(0);return p.useEffect(()=>{let s;const l=()=>{c(1),setTimeout(()=>c(0),100);const o=500+Math.random()*2500;t==="thinking"?s=setTimeout(l,o*.5):s=setTimeout(l,o)};return s=setTimeout(l,1e3),()=>clearTimeout(s)},[t]),S((s,l)=>{a.current=I.lerp(a.current,i,l*8)}),e.jsxs("group",{scale:[1.3,.8,1.1],position:[.1,-.05,0],rotation:[.2,.1,-.1],children:[e.jsx(xt,{activity:t,flashRef:a}),e.jsx(Mt,{activity:t,flashRef:a})]})}const re=new R("#ff8a18"),Z=new R("#ffd15c"),we=new R("#fff8d6"),xe=new R("#b8490b"),be=new R("#d65f10"),vt={gold:["#ff8a18","#ffd15c","#fff8d6","#b8490b","#d65f10"],green:["#4cff85","#b9ffc9","#f5fff6","#0b4f24","#18bd58"],violet:["#a855f7","#d8b4fe","#faf5ff","#1e0547","#7c3aed"],orange:["#ff7a18","#ffc46b","#fff5de","#7a2608","#ed5f12"]};function jt(t){const[n,r,u,i,c]=vt[t];re.set(n),Z.set(r),we.set(u),xe.set(i),be.set(c)}const J=[{radiusX:.66,radiusZ:.58,seed:11,speed:.33,tilt:[.28,.16,.84],opacity:.64,width:1,packets:3},{radiusX:.88,radiusZ:.74,seed:13,speed:-.26,tilt:[1.1,.04,-.38],opacity:.5,width:1,packets:2},{radiusX:1.06,radiusZ:.98,seed:17,speed:.21,tilt:[.08,.9,.24],opacity:.42,width:1,packets:4},{radiusX:1.28,radiusZ:1.05,seed:19,speed:-.18,tilt:[1.42,.32,.52],opacity:.58,width:1.3,packets:3},{radiusX:1.42,radiusZ:1.34,seed:23,speed:.13,tilt:[.46,1.18,-.2],opacity:.37,width:1,packets:2},{radiusX:1.58,radiusZ:1.18,seed:29,speed:-.11,tilt:[1.28,.82,1.05],opacity:.46,width:1.1,packets:3},{radiusX:1.78,radiusZ:1.58,seed:31,speed:.087,tilt:[.2,.2,1.47],opacity:.32,width:1,packets:2},{radiusX:2.03,radiusZ:1.72,seed:37,speed:-.072,tilt:[1.05,.42,-1.12],opacity:.34,width:1.2,packets:4},{radiusX:2.24,radiusZ:1.86,seed:41,speed:.055,tilt:[.72,1.05,.42],opacity:.28,width:1,packets:3},{radiusX:2.46,radiusZ:2.08,seed:43,speed:-.048,tilt:[1.38,.12,.08],opacity:.25,width:1,packets:2}];function se(t){return()=>{let n=t+=1831565813;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}function Q(t){return t==="speaking"?1.52:t==="thinking"?1.28:t==="listening"?.82:1}function ne(t){return t==="speaking"?1.85:t==="thinking"?1.42:t==="listening"?.46:1}const me={uniforms:{uTime:{value:0},uEnergy:{value:1},uOpacity:{value:1},uColor:{value:re}},vertexShader:`
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
  `};function Oe(){return{uniforms:Be.clone(me.uniforms),vertexShader:me.vertexShader,fragmentShader:me.fragmentShader}}function wt(){const t=se(54421),n=[],r=[],u=[];for(let c=0;c<12;c+=1){const a=t()*Math.PI*2,s=Math.acos(2*t()-1),l=new v(Math.sin(s)*Math.cos(a),Math.cos(s),Math.sin(s)*Math.sin(a)),o=c%4===0?2.05+t()*.38:1.1+t()*.66,f=l.clone().multiplyScalar((t()-.5)*.22),h=l.clone().multiplyScalar(-o).add(f),d=l.clone().multiplyScalar(o).add(f.multiplyScalar(.35));n.push(h.x,h.y,h.z,d.x,d.y,d.z),r.push(t()*6.28,t()*6.28),u.push(c%4===0?.92:.44+t()*.32,c%4===0?.92:.44+t()*.32)}const i=new k;return i.setAttribute("position",new L(n,3)),i.setAttribute("aPhase",new L(r,1)),i.setAttribute("aIntensity",new L(u,1)),i}function bt(t){const n=se(t.seed*313),r=[],u=[],i=[],c=240,a=n()*Math.PI*2,s=n()*Math.PI*2;for(let o=0;o<c;o+=1){const f=o/c*Math.PI*2,h=(o+1)/c*Math.PI*2;if(Math.abs(Math.sin((f-a)*1.5))<.13||Math.abs(Math.sin((f-s)*2))<.11||(o+t.seed)%23===0)continue;const m=1+Math.sin(f*5+t.seed)*.018+(n()-.5)*.01,y=1+Math.sin(h*5+t.seed)*.018+(n()-.5)*.01,j=Math.sin(f*3+t.seed)*.025,C=Math.sin(h*3+t.seed)*.025;r.push(Math.cos(f)*t.radiusX*m,j,Math.sin(f)*t.radiusZ*m),r.push(Math.cos(h)*t.radiusX*y,C,Math.sin(h)*t.radiusZ*y),u.push(f+t.seed,h+t.seed),i.push(.55+n()*.45,.55+n()*.45)}const l=new k;return l.setAttribute("position",new L(r,3)),l.setAttribute("aPhase",new L(u,1)),l.setAttribute("aIntensity",new L(i,1)),l}function St(t){const n=se(t.seed*791),r=[],u=96;for(let i=0;i<u;i+=1){const c=i/u*Math.PI*2,a=1+Math.sin(c*3+t.seed)*.018+(n()-.5)*.008;r.push(new v(Math.cos(c)*t.radiusX*a,Math.sin(c*2+t.seed)*.018,Math.sin(c)*t.radiusZ*a))}return new ve(r,!0,"centripetal",.5)}function Pt({activity:t}){const n=p.useRef(null),r=p.useRef(null),u=p.useRef(null),i=p.useRef(null);return S(({clock:c},a)=>{const s=c.elapsedTime,l=ne(t),o=Q(t);if(n.current){const f=t==="speaking"?Math.sin(s*7.2)*.075:Math.sin(s*2.2)*.025;n.current.scale.setScalar((1+f)*(.98+o*.035)),n.current.rotation.y+=a*.18*l}r.current&&(r.current.rotation.x+=a*.42*l),u.current&&(u.current.rotation.y-=a*.34*l),i.current&&(i.current.rotation.z+=a*.27*l)}),e.jsxs("group",{ref:n,children:[e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[.105,32,32]}),e.jsx("meshBasicMaterial",{color:we,toneMapped:!1})]}),e.jsxs("mesh",{scale:1+Q(t)*.075,children:[e.jsx("sphereGeometry",{args:[.31,32,32]}),e.jsx("meshBasicMaterial",{blending:g,color:Z,depthWrite:!1,opacity:.32,toneMapped:!1,transparent:!0})]}),e.jsxs("mesh",{scale:1.72,children:[e.jsx("sphereGeometry",{args:[.42,32,32]}),e.jsx("meshBasicMaterial",{blending:g,color:re,depthWrite:!1,opacity:.092,toneMapped:!1,transparent:!0})]}),e.jsxs("mesh",{ref:r,rotation:[.3,.2,.1],children:[e.jsx("torusKnotGeometry",{args:[.34,.018,180,5,2,3]}),e.jsx("meshBasicMaterial",{blending:g,color:Z,depthWrite:!1,toneMapped:!1})]}),e.jsxs("mesh",{ref:u,rotation:[1.1,.4,.8],scale:1.18,children:[e.jsx("torusKnotGeometry",{args:[.34,.011,180,4,3,5]}),e.jsx("meshBasicMaterial",{blending:g,color:re,depthWrite:!1,opacity:.72,toneMapped:!1,transparent:!0})]}),e.jsxs("mesh",{ref:i,rotation:[.2,1.2,.5],scale:1.42,children:[e.jsx("torusKnotGeometry",{args:[.34,.008,180,4,2,5]}),e.jsx("meshBasicMaterial",{blending:g,color:be,depthWrite:!1,opacity:.48,toneMapped:!1,transparent:!0})]})]})}function Rt({activity:t}){const n=p.useRef(null),r=p.useRef(null),u=p.useMemo(wt,[]),i=p.useMemo(Oe,[]);return S(({clock:c},a)=>{r.current&&(r.current.uniforms.uTime.value=c.elapsedTime*1.28,r.current.uniforms.uEnergy.value=Q(t)*(t==="speaking"?1.34:.96),r.current.uniforms.uOpacity.value=t==="listening"?.26:t==="speaking"?.48:.38,r.current.uniforms.uColor.value.copy(Z)),n.current&&(n.current.rotation.y+=a*.035*ne(t),n.current.rotation.z-=a*.018)}),e.jsx("group",{ref:n,children:e.jsx("lineSegments",{geometry:u,children:e.jsx("shaderMaterial",{ref:r,args:[i],blending:g,depthWrite:!1,toneMapped:!1,transparent:!0})})})}function zt({activity:t,index:n,spec:r}){const u=p.useRef(null),i=p.useRef(null),c=p.useMemo(()=>bt(r),[r]),a=p.useMemo(Oe,[]);return S(({clock:s},l)=>{const o=ne(t);if(u.current){u.current.rotation.y+=l*r.speed*o,u.current.rotation.z+=l*r.speed*.28*o;const f=1+Math.sin(s.elapsedTime*.8+r.seed)*.004*Q(t);u.current.scale.setScalar(f)}i.current&&(i.current.uniforms.uTime.value=s.elapsedTime+n*.71,i.current.uniforms.uEnergy.value=Q(t),i.current.uniforms.uOpacity.value=r.opacity,i.current.uniforms.uColor.value.copy(n<3?Z:n>6?be:re))}),e.jsx("group",{ref:u,rotation:r.tilt,children:e.jsx("lineSegments",{geometry:c,children:e.jsx("shaderMaterial",{ref:i,args:[a],blending:g,depthWrite:!1,toneMapped:!1,transparent:!0})})})}function At({activity:t,index:n,spec:r}){const u=p.useRef(null),i=p.useMemo(()=>new et(St(r),220,r.width*.011,5,!0),[r]);return S(({clock:c},a)=>{if(!u.current)return;const s=ne(t);u.current.rotation.y+=a*r.speed*.72*s,u.current.rotation.z+=a*r.speed*.18*s;const l=u.current.material;l.color.copy(n%2===0?Z:re),l.opacity=(.32+r.opacity*.58)*(.82+Math.sin(c.elapsedTime*(.95+n*.14)+r.seed)*.18)*Q(t)}),e.jsx("group",{rotation:r.tilt,children:e.jsx("mesh",{ref:u,geometry:i,children:e.jsx("meshBasicMaterial",{blending:g,color:Z,depthWrite:!1,opacity:.74,toneMapped:!1,transparent:!0})})})}function kt({activity:t}){const n=p.useRef(null),r=p.useMemo(()=>{const s=[];return J.forEach((l,o)=>{for(let f=0;f<l.packets;f+=1)s.push({orbit:o,phase:((f+1)/(l.packets+1)+l.seed*.013)%1,speed:Math.abs(l.speed)*(.72+f*.16),size:.045+(f+o)%3*.018,offset:(f-l.packets*.5)*.012})}),s},[]),u=p.useMemo(()=>{const s=new k;return s.setAttribute("position",new V(new Float32Array(r.length*3),3)),s.setAttribute("aSize",new V(new Float32Array(r.map(l=>l.size)),1)),s},[r]),i=p.useMemo(()=>J.map(s=>new tt().makeRotationFromEuler(new ye(...s.tilt))),[]),c=p.useMemo(()=>new v,[]);S(({clock:s})=>{if(!n.current)return;const l=u.getAttribute("position"),o=ne(t);r.forEach((f,h)=>{const d=J[f.orbit],y=(f.phase+s.elapsedTime*f.speed*o)%1*Math.PI*2;c.set(Math.cos(y)*d.radiusX,Math.sin(y*3+d.seed)*.025+f.offset,Math.sin(y)*d.radiusZ),c.applyMatrix4(i[f.orbit]),l.setXYZ(h,c.x,c.y,c.z)}),l.needsUpdate=!0});const a=p.useMemo(()=>({uniforms:{uColor:{value:Z}},vertexShader:`
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
      `}),[]);return e.jsx("points",{ref:n,geometry:u,children:e.jsx("shaderMaterial",{args:[a],blending:g,depthWrite:!1,toneMapped:!1,transparent:!0})})}function Et({activity:t}){const n=p.useRef(null);return S(({clock:r})=>{if(!n.current)return;const u=t==="speaking"?Math.sin(r.elapsedTime*6.8)*.018:0;n.current.scale.setScalar(1+u)}),e.jsxs("group",{ref:n,children:[[J[1],J[3],J[5],J[7]].map((r,u)=>e.jsx(At,{activity:t,index:u,spec:r},`major-${r.seed}`)),J.map((r,u)=>e.jsx(zt,{activity:t,index:u,spec:r},r.seed)),e.jsx(kt,{activity:t})]})}function Ct({activity:t}){const n=p.useRef(null),r=p.useRef(null),u=p.useMemo(()=>{const c=se(91822),a=760,s=new Float32Array(a*3),l=new Float32Array(a),o=new Float32Array(a);for(let h=0;h<a;h+=1){const d=c()*Math.PI*2,m=.52+Math.pow(c(),1.8)*.92;s[h*3]=Math.cos(d)*m,s[h*3+1]=(c()-.5)*.055,s[h*3+2]=Math.sin(d)*m*(.78+c()*.18),l[h]=d+c()*3,o[h]=1.2+c()*3.8}const f=new k;return f.setAttribute("position",new V(s,3)),f.setAttribute("aPhase",new V(l,1)),f.setAttribute("aSize",new V(o,1)),f},[]),i=p.useMemo(()=>({uniforms:{uTime:{value:0},uEnergy:{value:1},uColor:{value:Z}},vertexShader:`
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
      `}),[]);return S(({clock:c},a)=>{r.current&&(r.current.uniforms.uTime.value=c.elapsedTime,r.current.uniforms.uEnergy.value=Q(t),r.current.uniforms.uColor.value.copy(Z)),n.current&&(n.current.rotation.x=.58+Math.sin(c.elapsedTime*.12)*.035,n.current.rotation.y+=a*.08*ne(t),n.current.rotation.z=-.18)}),e.jsx("points",{ref:n,geometry:u,children:e.jsx("shaderMaterial",{ref:r,args:[i],blending:g,depthWrite:!1,toneMapped:!1,transparent:!0})})}function Tt(){const t=se(55123);return Array.from({length:14},(n,r)=>{const u=r/14*Math.PI*2+t()*.32,i=new ye(t()*1.4,t()*1.1,t()*1.2),c=Array.from({length:6},(a,s)=>{const l=s/5,o=.28+l*(1.76+t()*.38),f=u+Math.sin(l*Math.PI*2+r)*.28;return new v(Math.cos(f)*o,Math.sin(l*Math.PI*1.5+r)*.26,Math.sin(f)*o*(.74+t()*.22)).applyEuler(i)});return new ve(c,!1,"centripetal",.44)})}function Gt({activity:t}){const n=p.useRef(null),r=p.useMemo(()=>Tt(),[]),u=p.useMemo(()=>Array.from({length:56},(a,s)=>({curve:s%r.length,phase:s*19%56/56,speed:.08+s%6*.012})),[r.length]),i=p.useMemo(()=>{const a=new k;return a.setAttribute("position",new V(new Float32Array(u.length*3),3)),a},[u.length]),c=p.useMemo(()=>new v,[]);return S(({clock:a})=>{if(!n.current)return;const s=i.getAttribute("position"),l=ne(t);u.forEach((o,f)=>{const h=(o.phase+a.elapsedTime*o.speed*l)%1;r[o.curve].getPointAt(h,c);const d=t==="speaking"?1+Math.sin(a.elapsedTime*7+f)*.025:1;s.setXYZ(f,c.x*d,c.y*d,c.z*d)}),s.needsUpdate=!0}),e.jsx("points",{ref:n,geometry:i,children:e.jsx("pointsMaterial",{blending:g,color:we,depthWrite:!1,opacity:.76,size:.046,sizeAttenuation:!0,toneMapped:!1,transparent:!0})})}function Wt({activity:t}){const n=p.useRef(null),r=p.useMemo(()=>({uniforms:{uEnergy:{value:1},uColor:{value:xe}},vertexShader:`
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
      `}),[]);return S(()=>{n.current&&(n.current.uniforms.uEnergy.value=Q(t),n.current.uniforms.uColor.value.copy(xe))}),e.jsxs("mesh",{scale:[1.04,1.04,1.04],children:[e.jsx("sphereGeometry",{args:[2.18,48,48]}),e.jsx("shaderMaterial",{ref:n,args:[r],blending:g,depthWrite:!1,side:ce,toneMapped:!1,transparent:!0})]})}function Ce({activity:t,palette:n="gold"}){return jt(n),e.jsxs("group",{children:[e.jsx(Wt,{activity:t}),e.jsx("group",{scale:n==="violet"?.46:1,children:e.jsx(yt,{activity:t,palette:n})}),e.jsx(Gt,{activity:t}),e.jsx(Pt,{activity:t}),e.jsx(Ct,{activity:t}),e.jsx(Rt,{activity:t}),e.jsx(Et,{activity:t})]})}function ge(t,n){return Math.abs(Math.sin(t*127.13+n*311.7)*43758.5453)%1}const Bt=`
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vViewDirection;
  varying float vFlow;

  void main() {
    vec3 transformed = position;
    float flow =
      sin(position.y * 8.0 + uTime * 1.25) *
      sin(position.x * 6.5 - uTime * 0.72) *
      sin(position.z * 7.5 + uTime * 0.48);
    transformed += normal * flow * (0.026 + uEnergy * 0.022);
    vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
    vec4 viewPosition = viewMatrix * worldPosition;
    vNormal = normalize(normalMatrix * normal);
    vViewDirection = normalize(-viewPosition.xyz);
    vFlow = flow;
    gl_Position = projectionMatrix * viewPosition;
  }
`,Ft=`
  uniform vec3 uColor;
  uniform vec3 uHotColor;
  uniform float uOpacity;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vViewDirection;
  varying float vFlow;

  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDirection), 0.0), 2.35);
    float filament = smoothstep(0.42, 0.92, abs(vFlow));
    vec3 color = mix(uColor, uHotColor, filament * 0.72 + fresnel * 0.38);
    float alpha = (fresnel * 0.72 + filament * 0.2 + 0.025) * uOpacity * (0.78 + uEnergy * 0.22);
    gl_FragColor = vec4(color, alpha);
  }
`;function Se({activity:t,color:n,hotColor:r,radius:u=2.05,particleCount:i=260,opacity:c=.72}){const a=p.useRef(null),s=p.useRef(null),l=p.useMemo(()=>new Fe({uniforms:{uTime:{value:0},uEnergy:{value:.35},uColor:{value:new R(n)},uHotColor:{value:new R(r)},uOpacity:{value:c}},vertexShader:Bt,fragmentShader:Ft,transparent:!0,depthWrite:!1,side:K,blending:g,toneMapped:!1}),[n,r,c]),o=p.useMemo(()=>{const f=new Float32Array(i*3);for(let d=0;d<i;d+=1){const m=ge(d,1)*2-1,y=ge(d,2)*Math.PI*2,j=u*(1.08+ge(d,3)*.34),C=Math.sqrt(1-m*m);f[d*3]=Math.cos(y)*C*j,f[d*3+1]=m*j,f[d*3+2]=Math.sin(y)*C*j}const h=new k;return h.setAttribute("position",new V(f,3)),h},[i,u]);return S(({clock:f},h)=>{const d=t==="speaking"?1:t==="thinking"?.78:t==="listening"?.48:.3;l.uniforms.uTime.value=f.elapsedTime,l.uniforms.uEnergy.value=I.lerp(l.uniforms.uEnergy.value,d,.06),a.current&&(a.current.rotation.y+=h*(.045+d*.055),a.current.rotation.z-=h*.018),s.current&&(s.current.rotation.y-=h*(.018+d*.032),s.current.rotation.x=Math.sin(f.elapsedTime*.13)*.08)}),e.jsxs("group",{name:"shared-orb-energy-field",children:[e.jsx("mesh",{ref:a,material:l,children:e.jsx("icosahedronGeometry",{args:[u,5]})}),e.jsx("points",{ref:s,geometry:o,children:e.jsx("pointsMaterial",{color:r,size:.026,opacity:.62,transparent:!0,depthWrite:!1,blending:g,toneMapped:!1})})]})}new R("#35d8ff");new R("#d9ffff");new R("#087eaa");const It=new R("#024a6e");new R("#f8ffff");function N(t,n){return Math.abs(Math.sin(t*127.13+n*311.7)*43758.5453)%1}function Pe(t){return t==="speaking"?1.9:t==="thinking"?1.45:t==="listening"?.62:1}function Re(t){return t==="speaking"?1.5:t==="thinking"?1.28:t==="listening"?.75:1}function _t({activity:t}){const n=p.useRef(null),r=p.useRef(null),u=p.useRef(null),i=p.useRef(null),c=p.useRef(null),a=p.useRef(null),s=p.useMemo(()=>{const d=new pe(2.56,2.56,2.56),m=new he(d);return d.dispose(),m},[]),l=p.useMemo(()=>{const d=new pe(1.44,1.44,1.44),m=new he(d);return d.dispose(),m},[]),o=p.useMemo(()=>{const d=new pe(1.92,1.92,1.92),m=new he(d);return d.dispose(),m},[]),f=p.useMemo(()=>{const d=[];for(const m of[-1,1])for(const y of[-1,1])for(const j of[-1,1])d.push(new v(m*.72,y*.72,j*.72)),d.push(new v(m*1.28,y*1.28,j*1.28));return new k().setFromPoints(d)},[]),h=p.useMemo(()=>({uniforms:{uTime:{value:0},uEnergy:{value:1}},vertexShader:`
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform float uTime;
      uniform float uEnergy;
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        float pulse = 0.7 + 0.3 * sin(uTime * 3.0 + length(vPosition) * 8.0);
        float swirl = sin(vPosition.x * 12.0 + uTime * 2.5) * sin(vPosition.y * 10.0 - uTime * 1.8) * 0.5 + 0.5;
        vec3 color = mix(vec3(0.21, 0.85, 1.0), vec3(0.85, 1.0, 1.0), swirl * pulse);
        float alpha = (0.25 + swirl * 0.35) * uEnergy;
        gl_FragColor = vec4(color, alpha);
      }
    `}),[]);return S(({clock:d},m)=>{const y=d.elapsedTime,j=Pe(t),C=Re(t);if(n.current&&(n.current.rotation.x+=m*.11*j,n.current.rotation.y+=m*.18*j),r.current&&(r.current.rotation.z+=m*.07*j,r.current.rotation.x+=m*.04*j),u.current){u.current.rotation.x-=m*.2*j,u.current.rotation.y-=m*.14*j;const G=.88+Math.sin(y*1.8*j)*.12;u.current.scale.setScalar(G)}if(i.current){i.current.rotation.y+=m*.12*j,i.current.rotation.z-=m*.08*j;const G=t==="thinking"?.85+Math.pow(Math.max(0,Math.sin(y*2.5)),8)*.35:1+Math.sin(y*1.2)*.04;i.current.scale.setScalar(G)}if(c.current){const G=t==="speaking"?1+Math.sin(y*7.2)*.15+Math.sin(y*11.3)*.06:t==="thinking"?.8+Math.pow(Math.max(0,Math.sin(y*2.8)),10)*.7:1+Math.sin(y*1.4)*.06;c.current.scale.setScalar(G);const O=c.current.material;O.uniforms&&(O.uniforms.uTime.value=y,O.uniforms.uEnergy.value=C)}if(a.current){const G=t==="speaking"?1.3+Math.sin(y*5.8)*.15:1.1;a.current.scale.setScalar(G)}}),e.jsxs("group",{ref:n,scale:.86,children:[e.jsx("lineSegments",{ref:r,geometry:s,rotation:[.18,.32,.12],children:e.jsx("lineBasicMaterial",{blending:g,color:"#35d8ff",depthWrite:!1,opacity:.78,toneMapped:!1,transparent:!0})}),e.jsx("lineSegments",{ref:i,geometry:o,rotation:[.4,-.2,.3],children:e.jsx("lineBasicMaterial",{blending:g,color:"#56ffb1",depthWrite:!1,opacity:.42,toneMapped:!1,transparent:!0})}),e.jsx("lineSegments",{ref:u,geometry:l,rotation:[-.34,.26,-.18],children:e.jsx("lineBasicMaterial",{blending:g,color:"#56ffb1",depthWrite:!1,opacity:.88,toneMapped:!1,transparent:!0})}),e.jsx("lineSegments",{geometry:f,children:e.jsx("lineBasicMaterial",{blending:g,color:"#d9ffff",depthWrite:!1,opacity:.48,toneMapped:!1,transparent:!0})}),e.jsxs("mesh",{ref:c,children:[e.jsx("sphereGeometry",{args:[.38,32,32]}),e.jsx("shaderMaterial",{args:[h],blending:g,depthWrite:!1,toneMapped:!1,transparent:!0})]}),e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[.105,20,20]}),e.jsx("meshBasicMaterial",{color:"#f1ffff",toneMapped:!1})]}),e.jsxs("mesh",{ref:a,children:[e.jsx("sphereGeometry",{args:[.55,24,24]}),e.jsx("meshBasicMaterial",{blending:g,color:"#35d8ff",depthWrite:!1,opacity:.08,toneMapped:!1,transparent:!0})]}),[...Array(8)].map((d,m)=>{const y=(m&1?1:-1)*1.75,j=(m&2?1:-1)*1.05,C=(m&4?1:-1)*.42;return e.jsxs("mesh",{position:[y+(N(m,1)-.5)*.3,j+(N(m,2)-.5)*.3,C],children:[e.jsx("boxGeometry",{args:[.14,.14,.14]}),e.jsx("meshBasicMaterial",{blending:g,color:m%2?"#56ffb1":"#35d8ff",depthWrite:!1,opacity:.7,toneMapped:!1,transparent:!0,wireframe:!0})]},m)})]})}function Lt({activity:t}){const n=p.useRef(null),r=p.useRef(null),u=p.useRef(null),i=p.useRef(null);return S(({clock:c},a)=>{const s=c.elapsedTime,l=Pe(t),o=Re(t);if(n.current){n.current.rotation.x+=a*.15*l,n.current.rotation.z+=a*.08*l;const f=t==="speaking"?1+Math.sin(s*6)*.06:1;n.current.scale.setScalar(f)}if(r.current&&(r.current.rotation.y-=a*.12*l,r.current.rotation.x+=a*.05*l),u.current&&(u.current.rotation.z+=a*.09*l,u.current.rotation.y-=a*.06*l),i.current){i.current.rotation.x-=a*.07*l,i.current.rotation.z-=a*.04*l;const f=1+Math.sin(s*.8)*.02*o;i.current.scale.setScalar(f)}}),e.jsxs("group",{children:[e.jsxs("mesh",{ref:n,rotation:[.3,.1,.5],children:[e.jsx("torusGeometry",{args:[1.72,.022,6,128]}),e.jsx("meshBasicMaterial",{blending:g,color:"#35d8ff",depthWrite:!1,opacity:.72,toneMapped:!1,transparent:!0})]}),e.jsxs("mesh",{ref:r,rotation:[1.1,.4,-.2],children:[e.jsx("torusGeometry",{args:[2.08,.016,6,128]}),e.jsx("meshBasicMaterial",{blending:g,color:"#56ffb1",depthWrite:!1,opacity:.55,toneMapped:!1,transparent:!0})]}),e.jsxs("mesh",{ref:u,rotation:[.6,1.2,.8],children:[e.jsx("torusGeometry",{args:[2.42,.012,6,128]}),e.jsx("meshBasicMaterial",{blending:g,color:"#87ecff",depthWrite:!1,opacity:.38,toneMapped:!1,transparent:!0})]}),e.jsxs("mesh",{ref:i,rotation:[1.4,.2,1.1],children:[e.jsx("torusGeometry",{args:[2.78,.009,6,128]}),e.jsx("meshBasicMaterial",{blending:g,color:"#d9ffff",depthWrite:!1,opacity:.22,toneMapped:!1,transparent:!0})]})]})}function Vt({activity:t}){const n=p.useRef(null),r=p.useRef(null),u=p.useMemo(()=>{const a=new Float32Array(840);for(let l=0;l<280;l++){const o=Math.acos(2*N(l,1)-1),f=N(l,2)*Math.PI*2,h=3.2+N(l,3)*2.2;a[l*3]=Math.sin(o)*Math.cos(f)*h,a[l*3+1]=Math.cos(o)*h,a[l*3+2]=Math.sin(o)*Math.sin(f)*h}const s=new k;return s.setAttribute("position",new V(a,3)),s},[]),i=p.useMemo(()=>{const c=[],a=u.getAttribute("position"),s=1.8;let l=0;for(let f=0;f<120&&l<60;f++)for(let h=f+1;h<120&&l<60;h++){const d=a.getX(f)-a.getX(h),m=a.getY(f)-a.getY(h),y=a.getZ(f)-a.getZ(h);Math.sqrt(d*d+m*m+y*y)<s&&(c.push(a.getX(f),a.getY(f),a.getZ(f),a.getX(h),a.getY(h),a.getZ(h)),l++)}const o=new k;return o.setAttribute("position",new L(c,3)),o},[u]);return S(({clock:c},a)=>{const s=t==="thinking"?.08:.025;n.current&&(n.current.rotation.y-=a*s),r.current&&(r.current.rotation.y-=a*s)}),e.jsxs("group",{children:[e.jsx("points",{ref:n,geometry:u,children:e.jsx("pointsMaterial",{blending:g,color:"#87ecff",depthWrite:!1,opacity:.42,size:.028,sizeAttenuation:!0,toneMapped:!1,transparent:!0})}),e.jsx("lineSegments",{ref:r,geometry:i,children:e.jsx("lineBasicMaterial",{blending:g,color:"#35d8ff",depthWrite:!1,opacity:.12,toneMapped:!1,transparent:!0})})]})}function Ot({activity:t}){const n=p.useRef(null),r=p.useRef([]),u=p.useMemo(()=>Array.from({length:6},(i,c)=>{const a=c/6*Math.PI*2,s=8,l=[];for(let f=0;f<s;f++){const h=f/(s-1),d=.3+h*2.2,m=(N(c*100+f,1)-.5)*.4*h,y=(N(c*100+f,2)-.5)*.4*h;if(l.push(Math.cos(a)*d+m,Math.sin(a)*d+y,(N(c*100+f,3)-.5)*.6*h),f<s-1){const j=(f+1)/(s-1),C=.3+j*2.2,G=(N(c*100+f+1,1)-.5)*.4*j,O=(N(c*100+f+1,2)-.5)*.4*j;l.push(Math.cos(a)*C+G,Math.sin(a)*C+O,(N(c*100+f+1,3)-.5)*.6*j)}}const o=new k;return o.setAttribute("position",new L(l,3)),o}),[]);return S(({clock:i})=>{const c=i.elapsedTime;r.current.forEach((a,s)=>{if(!a)return;const l=Math.pow(Math.max(0,Math.sin(c*(3+s*.7)+s*1.2)),4),o=t==="speaking"?.6:t==="thinking"?.45:.18;a.opacity=o*l}),n.current&&(n.current.rotation.z=Math.sin(c*.15)*.08)}),e.jsx("group",{ref:n,children:u.map((i,c)=>e.jsx("lineSegments",{geometry:i,children:e.jsx("lineBasicMaterial",{ref:a=>{a&&(r.current[c]=a)},blending:g,color:c%2===0?"#87ecff":"#56ffb1",depthWrite:!1,opacity:.2,toneMapped:!1,transparent:!0})},c))})}function Xt({activity:t}){const n=p.useRef(null),r=p.useMemo(()=>({uniforms:{uEnergy:{value:1},uColor:{value:It}},vertexShader:`
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
        float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 4.0);
        gl_FragColor = vec4(uColor, fresnel * 0.003 * uEnergy);
      }
    `}),[]);return S(()=>{n.current&&(n.current.uniforms.uEnergy.value=Re(t))}),e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[2.8,48,48]}),e.jsx("shaderMaterial",{ref:n,args:[r],blending:g,depthWrite:!1,side:ce,toneMapped:!1,transparent:!0})]})}function Nt({activity:t}){const n=p.useRef(null),r=p.useMemo(()=>{const u=[];[[[0,0,0],[2.5,0,0]],[[0,0,0],[-2.5,0,0]],[[0,0,0],[0,2.5,0]],[[0,0,0],[0,-2.5,0]],[[0,0,0],[0,0,2.5]],[[0,0,0],[0,0,-2.5]],[[0,0,0],[1.4,1.4,1.4]],[[0,0,0],[-1.4,-1.4,-1.4]]].forEach(([a,s])=>{u.push(a[0],a[1],a[2],s[0],s[1],s[2])});const c=new k;return c.setAttribute("position",new L(u,3)),c},[]);return S(({clock:u},i)=>{n.current&&(n.current.rotation.y+=i*.03*Pe(t),n.current.rotation.z=Math.sin(u.elapsedTime*.12)*.02)}),e.jsx("group",{ref:n,children:e.jsx("lineSegments",{geometry:r,children:e.jsx("lineBasicMaterial",{blending:g,color:"#35d8ff",depthWrite:!1,opacity:.12,toneMapped:!1,transparent:!0})})})}function Dt({activity:t="idle"}){return e.jsxs("group",{name:"space-tesseract-realm",children:[e.jsx("ambientLight",{color:"#003348",intensity:.12}),e.jsx("pointLight",{position:[0,0,2.1],color:"#35d8ff",intensity:2.5,distance:8,decay:2}),e.jsx(Se,{activity:t,color:"#087eaa",hotColor:"#b9f5ff",radius:2.18,particleCount:280,opacity:.38}),e.jsx(_t,{activity:t}),e.jsx(Lt,{activity:t}),e.jsx(Vt,{activity:t}),e.jsx(Ot,{activity:t}),e.jsx(Xt,{activity:t}),e.jsx(Nt,{activity:t}),e.jsx("fog",{attach:"fog",args:["#00040a",7,20]})]})}new R("#ef2b2d");new R("#fbbf24");new R("#991b1b");new R("#ffd4a3");new R("#fff2e0");const T=Math.PI*2;function q(t,n){return Math.abs(Math.sin(t*91.733+n*37.19)*43758.5453)%1}function ue(t){return t==="speaking"?1.8:t==="thinking"?2.4:t==="listening"?.55:1}function ze(t){return t==="speaking"?1.5:t==="thinking"?1.3:t==="listening"?.7:1}function Te(t,n,r=0){return new v(Math.cos(n)*t,Math.sin(n)*t,r)}function Ut({activity:t}){const n=p.useRef(null),r=p.useRef(null),u=p.useRef(null),i=p.useMemo(()=>({uniforms:{uTime:{value:0},uEnergy:{value:1}},vertexShader:`
      uniform float uTime;
      uniform float uEnergy;
      varying vec3 vPosition;
      varying vec3 vNormal;
      void main() {
        vPosition = position;
        vNormal = normal;
        vec3 p = position;
        float distortion = sin(p.x * 8.0 + uTime * 2.0) * sin(p.y * 6.0 - uTime * 1.5) * sin(p.z * 7.0 + uTime * 1.2);
        p += normal * distortion * 0.06 * uEnergy;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,fragmentShader:`
      uniform float uTime;
      uniform float uEnergy;
      varying vec3 vPosition;
      varying vec3 vNormal;
      void main() {
        float flow = sin(vPosition.x * 12.0 + uTime * 3.0) * sin(vPosition.y * 10.0 - uTime * 2.2) * 0.5 + 0.5;
        float pulse = 0.6 + 0.4 * sin(uTime * 4.0 + length(vPosition) * 6.0);
        vec3 blood = vec3(0.93, 0.17, 0.18);
        vec3 fire = vec3(1.0, 0.85, 0.5);
        vec3 color = mix(blood, fire, flow * pulse * 0.6);
        float alpha = (0.35 + flow * 0.4) * uEnergy;
        gl_FragColor = vec4(color, alpha);
      }
    `}),[]);return S(({clock:c})=>{const a=c.elapsedTime,s=ze(t);if(n.current){const l=t==="speaking"?1+Math.sin(a*7.5)*.18+Math.sin(a*12)*.06:t==="thinking"?.75+Math.pow(Math.max(0,Math.sin(a*2.5)),10)*.8:1+Math.sin(a*1.3)*.06;n.current.scale.setScalar(l);const o=n.current.material;o.uniforms&&(o.uniforms.uTime.value=a,o.uniforms.uEnergy.value=s)}if(r.current){const l=t==="speaking"?1.4+Math.sin(a*5.8)*.12:1.15;r.current.scale.setScalar(l)}u.current&&(u.current.rotation.y=a*.4,u.current.rotation.x=Math.sin(a*.3)*.2)}),e.jsxs("group",{children:[e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[.09,20,20]}),e.jsx("meshBasicMaterial",{color:"#fff8e0",toneMapped:!1})]}),e.jsxs("mesh",{ref:n,children:[e.jsx("icosahedronGeometry",{args:[.42,4]}),e.jsx("shaderMaterial",{args:[i],blending:g,depthWrite:!1,toneMapped:!1,transparent:!0})]}),e.jsxs("mesh",{ref:r,children:[e.jsx("sphereGeometry",{args:[.58,24,24]}),e.jsx("meshBasicMaterial",{blending:g,color:"#ef2b2d",depthWrite:!1,opacity:.1,toneMapped:!1,transparent:!0})]}),e.jsxs("mesh",{ref:u,children:[e.jsx("tetrahedronGeometry",{args:[.22,0]}),e.jsx("meshBasicMaterial",{blending:g,color:"#fbbf24",depthWrite:!1,opacity:.5,toneMapped:!1,transparent:!0,wireframe:!0})]})]})}function Yt({activity:t}){const n=p.useRef(null),r=p.useRef(null),u=p.useRef(null),i=p.useMemo(()=>{const s=[];for(let o=0;o<128;o++){const f=o/128*T,h=(o+1)/128*T;s.push(Math.cos(f)*1.2,Math.sin(f)*1.2,0),s.push(Math.cos(h)*1.2,Math.sin(h)*1.2,0)}for(let o=0;o<128;o++){const f=o/128*T,h=(o+1)/128*T;s.push(Math.cos(f)*1.42,Math.sin(f)*1.42,0),s.push(Math.cos(h)*1.42,Math.sin(h)*1.42,0)}for(let o=0;o<24;o++){const f=o/24*T,h=o%3===0?1.12:1.18;s.push(Math.cos(f)*h,Math.sin(f)*h,0),s.push(Math.cos(f)*1.44,Math.sin(f)*1.44,0);const d=Te(1.31,f),m=new v(-Math.sin(f),Math.cos(f),0).multiplyScalar(.04),y=new v(Math.cos(f),Math.sin(f),0).multiplyScalar(o%2?.035:-.035);s.push(d.x-m.x+y.x,d.y-m.y+y.y,0),s.push(d.x+m.x-y.x,d.y+m.y-y.y,0),o%4===0&&(s.push(d.x-m.x,d.y-m.y,0),s.push(d.x+m.x*.5+y.x,d.y+m.y*.5+y.y,0))}const l=new k;return l.setAttribute("position",new L(s,3)),l},[]),c=p.useMemo(()=>{const s=[];for(let o=0;o<3;o++){const f=o/3*T+Math.PI/2,h=(o+1)/3*T+Math.PI/2;s.push(Math.cos(f)*1.85,Math.sin(f)*1.85,0),s.push(Math.cos(h)*1.85,Math.sin(h)*1.85,0)}for(let o=0;o<3;o++){const f=o/3*T-Math.PI/2,h=(o+1)/3*T-Math.PI/2;s.push(Math.cos(f)*1.85,Math.sin(f)*1.85,0),s.push(Math.cos(h)*1.85,Math.sin(h)*1.85,0)}for(let o=0;o<6;o++){const f=o/6*T,h=(o+1)/6*T;s.push(Math.cos(f)*2.05,Math.sin(f)*2.05,0),s.push(Math.cos(h)*2.05,Math.sin(h)*2.05,0)}for(let o=0;o<4;o++){const f=o/4*T+Math.PI/4,h=(o+1)/4*T+Math.PI/4;s.push(Math.cos(f)*1.92,Math.sin(f)*1.92,0),s.push(Math.cos(h)*1.92,Math.sin(h)*1.92,0)}for(let o=0;o<96;o++){const f=o/96*T,h=(o+1)/96*T;s.push(Math.cos(f)*2.12,Math.sin(f)*2.12,0),s.push(Math.cos(h)*2.12,Math.sin(h)*2.12,0)}const l=new k;return l.setAttribute("position",new L(s,3)),l},[]),a=p.useMemo(()=>{const s=[];for(let o=0;o<128;o++){const f=o/128*T,h=(o+1)/128*T;s.push(Math.cos(f)*2.52,Math.sin(f)*2.52,0),s.push(Math.cos(h)*2.52,Math.sin(h)*2.52,0),s.push(Math.cos(f)*2.78,Math.sin(f)*2.78,0),s.push(Math.cos(h)*2.78,Math.sin(h)*2.78,0)}for(let o=0;o<24;o++){const f=o/24*T,h=Te(2.65,f),d=new v(-Math.sin(f),Math.cos(f),0),m=new v(Math.cos(f),Math.sin(f),0),y=.032+o%4*.008,j=.045+o%3*.015;s.push(h.x-m.x*j,h.y-m.y*j,0),s.push(h.x+m.x*j,h.y+m.y*j,0),o%3!==1&&(s.push(h.x-d.x*y-m.x*j*.4,h.y-d.y*y-m.y*j*.4,0),s.push(h.x+d.x*y+m.x*j*.4,h.y+d.y*y+m.y*j*.4,0)),o%4===0&&(s.push(h.x,h.y,0),s.push(h.x+d.x*y*1.5+m.x*j*.6,h.y+d.y*y*1.5+m.y*j*.6,0))}const l=new k;return l.setAttribute("position",new L(s,3)),l},[]);return S(({clock:s},l)=>{const o=ue(t);n.current&&(n.current.rotation.z+=l*.045*o),r.current&&(r.current.rotation.z-=l*.028*o),u.current&&(u.current.rotation.z+=l*.018*o)}),e.jsxs("group",{children:[e.jsx("group",{ref:n,children:e.jsx("lineSegments",{geometry:i,children:e.jsx("lineBasicMaterial",{blending:g,color:"#fbbf24",depthWrite:!1,opacity:.72,toneMapped:!1,transparent:!0})})}),e.jsx("group",{ref:r,children:e.jsx("lineSegments",{geometry:c,children:e.jsx("lineBasicMaterial",{blending:g,color:"#ef2b2d",depthWrite:!1,opacity:.48,toneMapped:!1,transparent:!0})})}),e.jsx("group",{ref:u,children:e.jsx("lineSegments",{geometry:a,children:e.jsx("lineBasicMaterial",{blending:g,color:"#fbbf24",depthWrite:!1,opacity:.52,toneMapped:!1,transparent:!0})})})]})}function Zt(){const t=p.useRef(null),n=p.useMemo(()=>{const u=[[[0,-2.5,-3.4],[0,3.8,-3.4]],[[0,2.2,-3.4],[-2.5,4.5,-3.7]],[[0,2.2,-3.4],[2.5,4.5,-3.7]],[[0,1.2,-3.4],[-3.4,2.7,-4]],[[0,1.2,-3.4],[3.4,2.7,-4]],[[0,-2.2,-3.4],[-2.6,-4.1,-3.8]],[[0,-2.2,-3.4],[2.6,-4.1,-3.8]],[[0,-1.5,-3.4],[-1.8,-3.2,-3.6]],[[0,-1.5,-3.4],[1.8,-3.2,-3.6]],[[0,3,-3.4],[-1.2,5.2,-3.8]],[[0,3,-3.4],[1.2,5.2,-3.8]]].flatMap(i=>i.map(([c,a,s])=>new v(c,a,s)));return new k().setFromPoints(u)},[]);return e.jsx("lineSegments",{ref:t,geometry:n,children:e.jsx("lineBasicMaterial",{color:"#ff6a1a",transparent:!0,opacity:.14,blending:g,depthWrite:!1,toneMapped:!1})})}function $t({activity:t}){const n=p.useRef(null),r=p.useMemo(()=>{const i=new Float32Array(1260);for(let c=0;c<420;c++){const a=3.5+q(c,1)*8,s=q(c,2)*T,l=(q(c,3)-.5)*10;i[c*3]=Math.cos(s)*a,i[c*3+1]=l,i[c*3+2]=Math.sin(s)*a-2}return i},[]);return S(({clock:u})=>{if(!n.current)return;const i=ue(t);n.current.rotation.y=u.elapsedTime*.018*i,n.current.rotation.z=Math.sin(u.elapsedTime*.08)*.025}),e.jsxs("points",{ref:n,children:[e.jsx("bufferGeometry",{children:e.jsx("bufferAttribute",{attach:"attributes-position",args:[r,3]})}),e.jsx("pointsMaterial",{color:"#ff3b18",size:.04,transparent:!0,opacity:.52,depthWrite:!1,blending:g,toneMapped:!1,sizeAttenuation:!0})]})}function Ht({activity:t}){const n=p.useRef(null),r=p.useRef(null);return S(({clock:u},i)=>{const c=ue(t);if(n.current&&(n.current.rotation.z+=i*.018*c,n.current.rotation.y=Math.sin(u.elapsedTime*.12)*.08),r.current){const a=t==="speaking"?1.18+Math.sin(u.elapsedTime*6)*.12:1;r.current.scale.setScalar(a),r.current.rotation.y-=i*.08*c}}),e.jsxs("group",{children:[e.jsxs("group",{ref:n,position:[0,.35,-1.1],children:[[3.2,3.75,4.35].map((u,i)=>e.jsxs("mesh",{rotation:[i*.72,i*.48,i*.31],children:[e.jsx("torusGeometry",{args:[u,i===0?.028:.014,6,96]}),e.jsx("meshBasicMaterial",{color:i===1?"#fbbf24":"#ef2b2d",transparent:!0,opacity:.28-i*.05,depthWrite:!1,blending:g,toneMapped:!1})]},u)),e.jsxs("mesh",{rotation:[Math.PI/2,0,0],children:[e.jsx("ringGeometry",{args:[4.65,4.72,48]}),e.jsx("meshBasicMaterial",{color:"#ff421d",transparent:!0,opacity:.14,side:K,depthWrite:!1,toneMapped:!1})]})]}),e.jsxs("group",{ref:r,position:[0,-2.35,.35],rotation:[-Math.PI/2,0,0],children:[e.jsxs("mesh",{children:[e.jsx("ringGeometry",{args:[2.05,2.12,12]}),e.jsx("meshBasicMaterial",{color:"#ff351e",transparent:!0,opacity:.38,side:K,depthWrite:!1,toneMapped:!1})]}),e.jsxs("mesh",{rotation:[0,0,Math.PI/12],children:[e.jsx("ringGeometry",{args:[2.48,2.54,6]}),e.jsx("meshBasicMaterial",{color:"#f59e0b",transparent:!0,opacity:.18,side:K,depthWrite:!1,toneMapped:!1})]})]})]})}function qt({activity:t}){const n=p.useRef(null),r=p.useRef(null),u=p.useMemo(()=>{const a=new Float32Array(960),s=new Float32Array(320),l=new Float32Array(320);for(let f=0;f<320;f++){const h=q(f,1)*T,d=.6+Math.pow(q(f,2),1.5)*1.8;a[f*3]=Math.cos(h)*d,a[f*3+1]=(q(f,3)-.5)*.08,a[f*3+2]=Math.sin(h)*d*(.8+q(f,4)*.2),s[f]=h+q(f,5)*4,l[f]=1.5+q(f,6)*3.5}const o=new k;return o.setAttribute("position",new V(a,3)),o.setAttribute("aPhase",new V(s,1)),o.setAttribute("aSize",new V(l,1)),o},[]),i=p.useMemo(()=>({uniforms:{uTime:{value:0},uEnergy:{value:1}},vertexShader:`
      attribute float aPhase;
      attribute float aSize;
      uniform float uTime;
      uniform float uEnergy;
      varying float vAlpha;
      void main() {
        vec3 p = position;
        float spin = uTime * (0.2 + fract(aPhase) * 0.1) * uEnergy;
        float c = cos(spin); float s = sin(spin);
        p.xz = mat2(c, -s, s, c) * p.xz;
        p.y += sin(uTime * 2.0 + aPhase * 2.5) * 0.02 * uEnergy;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * (22.0 / max(1.0, -mv.z));
        vAlpha = (0.35 + 0.65 * pow(0.5 + 0.5 * sin(uTime * 2.5 + aPhase * 8.0), 4.0)) * uEnergy;
      }
    `,fragmentShader:`
      varying float vAlpha;
      void main() {
        float mask = smoothstep(0.5, 0.05, length(gl_PointCoord - 0.5));
        vec3 color = mix(vec3(0.93, 0.17, 0.18), vec3(1.0, 0.82, 0.22), vAlpha * 0.5);
        gl_FragColor = vec4(color, mask * vAlpha * 0.72);
      }
    `}),[]);return S(({clock:c},a)=>{r.current&&(r.current.uniforms.uTime.value=c.elapsedTime,r.current.uniforms.uEnergy.value=ze(t)),n.current&&(n.current.rotation.x=.55,n.current.rotation.y+=a*.1*ue(t))}),e.jsx("points",{ref:n,geometry:u,children:e.jsx("shaderMaterial",{ref:r,args:[i],blending:g,depthWrite:!1,toneMapped:!1,transparent:!0})})}function Kt({activity:t}){const n=p.useRef(null),r=p.useMemo(()=>({uniforms:{uEnergy:{value:1}},vertexShader:`
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
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 4.2);
        vec3 color = vec3(0.6, 0.1, 0.04);
        gl_FragColor = vec4(color, fresnel * 0.003 * uEnergy);
      }
    `}),[]);return S(()=>{n.current&&(n.current.uniforms.uEnergy.value=ze(t))}),e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[2.6,48,48]}),e.jsx("shaderMaterial",{ref:n,args:[r],blending:g,depthWrite:!1,side:ce,toneMapped:!1,transparent:!0})]})}const Jt=({activity:t="idle"})=>e.jsxs("group",{name:"reality-runic-forge",children:[e.jsx("ambientLight",{intensity:.13,color:"#9f1239"}),e.jsx("directionalLight",{position:[4,8,5],intensity:.72,color:"#ffd4a3"}),e.jsx("pointLight",{position:[0,2.2,1.8],intensity:2.8,color:"#ff2400",distance:13,decay:2}),e.jsx($t,{activity:t}),e.jsx(Zt,{}),e.jsx(Ht,{activity:t}),e.jsx(Yt,{activity:t}),e.jsx(Ut,{activity:t}),e.jsx(qt,{activity:t}),e.jsx(Kt,{activity:t}),e.jsx("fog",{attach:"fog",args:["#090001",7.5,22]})]}),W=Math.PI*2,oe="#ffffff",U="#dfffee",Y="#57ff9a",Ge="#18c96b";function A(t,n,r=0){return new v(Math.cos(n)*t,Math.sin(n)*t,r)}function ie(t){return[...t,t[0].clone()]}function X(t){const n=[];t.forEach(u=>{for(let i=0;i<u.length-1;i+=1){const c=u[i],a=u[i+1];n.push(c.x,c.y,c.z,a.x,a.y,a.z)}});const r=new k;return r.setAttribute("position",new L(n,3)),r}function te(t,n=96,r=0,u=0){return Array.from({length:n+1},(i,c)=>A(t,u+c/n*W,r))}function ae(t,n,r,u){return ie(Array.from({length:t},(i,c)=>A(n,r+c/t*W,u)))}function Qt({activity:t}){const n=p.useRef(null),r=p.useRef(null),u=p.useRef(null),i=p.useRef(null),c=p.useRef(null),a=p.useRef(null),s=p.useRef(null),l=p.useRef(null),o=p.useRef(null),f=p.useRef(null),h=p.useRef(null),d=p.useRef(null),m=p.useRef(null),y=p.useRef(null),j=p.useRef(null),C=p.useRef(!1),G=p.useRef(0),O=p.useRef(0),B=p.useMemo(()=>{const w=Array.from({length:12},(M,x)=>{const b=x/12*W+x%2*.08,P=x%3===0?.18:.23,z=.38+x%4*.055;return[A(P,b,.28),A(z,b,.28)]});return X(w)},[]),$=p.useMemo(()=>{const w=[],M=[];for(let x=0;x<=48;x+=1){const b=-1.28+x/48*2.56,P=b/1.28,z=Math.pow(Math.max(0,1-P*P),.72)*.48;w.push(new v(b,z,.2)),M.push(new v(b,-z,.2))}return X([w,M,[new v(-1.55,0,.2),new v(-1.28,0,.2)],[new v(1.28,0,.2),new v(1.55,0,.2)],[new v(0,.48,.2),new v(0,.78,.2)],[new v(-.13,.57,.2),new v(0,.78,.2),new v(.13,.57,.2)],[new v(0,-.48,.2),new v(0,-.78,.2)],[new v(-.13,-.57,.2),new v(0,-.78,.2),new v(.13,-.57,.2)]])},[]),H=p.useMemo(()=>{const w=Array.from({length:8},(M,x)=>{const b=x/8*W;return ie([A(.18,b,.25),A(.47,b+.13,.25),A(.31,b+W/8,.25)])});return X(w)},[]),Ne=p.useMemo(()=>{const w=[te(1.62,120,.08),te(1.82,120,.08)];for(let M=0;M<12;M+=1){const x=M/12*W,b=M%3===0?1.57:1.64;w.push([A(b,x,.09),A(1.84,x,.09)]);const P=A(1.72,x,.1),z=new v(-Math.sin(x),Math.cos(x),0).multiplyScalar(.06);w.push([P.clone().sub(z),P.clone().add(z),P.clone().add(new v(Math.cos(x),Math.sin(x),0).multiplyScalar(M%2?.04:-.04))])}return w.push([new v(0,0,.12),A(1.52,Math.PI*.38,.12)]),X(w)},[]),De=p.useMemo(()=>{const w=Array.from({length:8},(M,x)=>{const b=x/8*W,P=x%2===0,z=P?2.42:2.18,E=P?.16:.12;return ie([A(1.02,b,.02),A(1.7,b-E,.02),A(z,b,.02),A(1.7,b+E,.02)])});return X([...w,te(2.02,96,.01),te(2.48,96,.01)])},[]),Ue=p.useMemo(()=>{const w=[te(2.63,128,-.03),te(2.86,128,-.03)];for(let M=0;M<30;M+=1){const x=M/30*W,b=A(2.745,x,-.015),P=new v(-Math.sin(x),Math.cos(x),0),z=new v(Math.cos(x),Math.sin(x),0),E=.035+M%4*.008,F=.045+M%3*.012;w.push([b.clone().add(P.clone().multiplyScalar(-E)).add(z.clone().multiplyScalar(-F)),b.clone().add(P.clone().multiplyScalar(E)).add(z.clone().multiplyScalar(F))]),M%3!==1&&w.push([b.clone().add(P.clone().multiplyScalar(-E)).add(z.clone().multiplyScalar(F)),b.clone().add(P.clone().multiplyScalar(E*.4)).add(z.clone().multiplyScalar(-F))])}return X(w)},[]),Ye=p.useMemo(()=>X([ae(3,3.08,Math.PI/2,-.08),ae(3,3.08,-Math.PI/2,-.08),ae(4,2.95,Math.PI/4,-.075),ae(8,3.18,Math.PI/8,-.07),te(3.04,128,-.09)]),[]),Ze=p.useMemo(()=>{const w=[];for(let M=0;M<32;M+=1){if(M%7===3)continue;const x=M/32*W,b=x+W/32*.68;w.push([A(3.43,x,-.12),A(3.43,b,-.12)]);const P=M%4===0?3.68:3.58;w.push(ie([A(3.45,x-.022,-.1),A(P,x,-.1),A(3.45,x+.022,-.1)]))}return X(w)},[]),$e=p.useMemo(()=>{const w=[],M=[.055,.08,.045,.095,.06,.075,.05,.065,.085];let x=.02;return M.forEach((b,P)=>{const z=x*W,E=(x+b)*W,F=Array.from({length:10},(D,ee)=>{const fe=ee/9;return A(4.18+P%3*.055,I.lerp(z,E,fe),-.18)});w.push(F),x+=b+.012+P%2*.005}),X(w)},[]),ke=p.useMemo(()=>{const w=[];for(let M=0;M<23;M+=1){if(M%7===4)continue;const x=M/23*W,b=3.7-M%3*.025,P=3.91+M%4*.018;w.push([A(b,x,0),A(P,x,0)]),M%4===0&&w.push([A(3.77,x+.018,0),A(3.9,x+.042,0)])}return X(w)},[]),He=p.useMemo(()=>{const w=[];for(let x=-4;x<=4;x+=1){const b=x/10*Math.PI,P=Math.cos(b)*4.02,z=Math.sin(b)*4.02;w.push(Array.from({length:65},(E,F)=>{const D=F/64*W,ee=1+Math.sin(F*.77+x*2.1)*.008;return new v(Math.cos(D)*P*ee,Math.sin(D)*P*ee,z)}))}for(let x=0;x<12;x+=1){const b=x/12*W;w.push(Array.from({length:49},(P,z)=>{const E=-Math.PI/2+z/48*Math.PI,F=4.02*(1+Math.sin(z*.61+x)*.007);return new v(Math.cos(E)*Math.cos(b)*F,Math.cos(E)*Math.sin(b)*F,Math.sin(E)*F)}))}return X(w)},[]),qe=p.useMemo(()=>{const w=[];for(let M=0;M<42;M+=1){const x=Math.sin(M*91.73)*43758.5453,b=x-Math.floor(x),P=M/42*W+b*.11,z=4.34+M%5*.09,E=.055+M%4*.025;w.push([A(z,P,(b-.5)*1.2),A(z+E,P+.025,(b-.5)*1.2)]),M%3===0&&w.push([A(z,P,.1),A(z,P+.045,.1)])}return X(w)},[]),Ke=p.useMemo(()=>{const w=new Float32Array(540);for(let x=0;x<180;x+=1){const b=Math.sin(x*12.9898)*43758.5453%1,P=Math.sin(x*78.233+2.4)*12741.371%1,z=Math.abs(b)*W,E=3.8+Math.abs(P)*1.1;w[x*3]=Math.cos(z)*E,w[x*3+1]=Math.sin(z)*E,w[x*3+2]=(Math.abs(b+P)%1-.5)*2.8}const M=new k;return M.setAttribute("position",new V(w,3)),M},[]);return p.useEffect(()=>{const w=window.matchMedia("(prefers-reduced-motion: reduce)"),M=()=>{C.current=w.matches};return M(),w.addEventListener("change",M),()=>w.removeEventListener("change",M)},[]),S(({clock:w},M)=>{var E,F;if(C.current)return;const x=w.elapsedTime,b=t==="thinking"?1.75:t==="speaking"?1.4:t==="listening"?.62:1;n.current&&(n.current.rotation.z=Math.sin(x*.16)*.014);const P=Math.pow(Math.max(0,Math.sin(x*2.45)),12),z=t==="speaking"?1+Math.sin(x*8.2)*.24+Math.sin(x*13.7)*.08:t==="thinking"?.72+P*.95:1+Math.sin(x*1.35)*(t==="listening"?.12:.075);if((E=r.current)==null||E.scale.setScalar(z),(F=u.current)==null||F.scale.setScalar(.92+z*.34),i.current&&(i.current.rotation.z-=M*.34*b,i.current.material.opacity=.24+Math.max(0,Math.sin(x*3.1))*.5+P*.2),c.current){const D=t==="thinking"?.84+P*.2:.96+Math.sin(x*.8)*.025;c.current.scale.setScalar(D),c.current.rotation.z-=M*.18*b}if(O.current+=M*b,O.current>=.72&&(O.current%=.72,G.current-=W/12),a.current&&(a.current.rotation.z=I.lerp(a.current.rotation.z,G.current,Math.min(1,M*13))),s.current){s.current.rotation.z+=M*.055*b;const D=t==="thinking"?.9+P*.1:.96+Math.sin(x*.55)*.018;s.current.scale.setScalar(D)}l.current&&(l.current.rotation.z-=M*.028*b),o.current&&(o.current.rotation.z+=M*.045,o.current.children.forEach((D,ee)=>{const fe=Math.max(0,Math.sin(x*3.2-ee*.72));D.scale.setScalar(.88+fe*.28),D.rotation.z+=M*(ee%2===0?.42:-.34)})),f.current&&(f.current.rotation.z-=M*.075*b),h.current&&(h.current.rotation.z+=M*.12*b),d.current&&(d.current.rotation.z-=M*.095*b),m.current&&(m.current.rotation.z+=M*.11*b),y.current&&(y.current.rotation.y+=M*.026),j.current&&(j.current.rotation.z-=M*.036,j.current.rotation.y=Math.sin(x*.2)*.12)}),e.jsxs("group",{ref:n,rotation:[.08,-.08,0],scale:.58,children:[e.jsxs("mesh",{ref:r,position:[0,0,.34],children:[e.jsx("sphereGeometry",{args:[.115,24,24]}),e.jsx("meshBasicMaterial",{color:oe,toneMapped:!1})]}),e.jsxs("mesh",{ref:u,position:[0,0,.3],children:[e.jsx("sphereGeometry",{args:[.235,24,24]}),e.jsx("meshBasicMaterial",{blending:g,color:Y,depthWrite:!1,opacity:.22,toneMapped:!1,transparent:!0})]}),e.jsx("lineSegments",{ref:i,geometry:B,children:e.jsx("lineBasicMaterial",{blending:g,color:U,depthWrite:!1,opacity:.5,toneMapped:!1,transparent:!0})}),e.jsx("lineSegments",{geometry:$,children:e.jsx("lineBasicMaterial",{blending:g,color:U,depthWrite:!1,opacity:.92,toneMapped:!1,transparent:!0})}),[.32,.5,.68].map((w,M)=>e.jsxs("mesh",{position:[0,0,.19-M*.012],children:[e.jsx("torusGeometry",{args:[w,M===0?.018:.012,6,96]}),e.jsx("meshBasicMaterial",{blending:g,color:M===0?oe:Y,depthWrite:!1,opacity:.82-M*.14,toneMapped:!1,transparent:!0})]},w)),e.jsx("group",{ref:c,children:e.jsx("lineSegments",{geometry:H,children:e.jsx("lineBasicMaterial",{blending:g,color:oe,depthWrite:!1,opacity:.9,toneMapped:!1,transparent:!0})})}),[-1,1].map(w=>e.jsxs("group",{position:[w*1.43,0,.18],children:[e.jsxs("mesh",{children:[e.jsx("torusGeometry",{args:[.12,.022,5,32]}),e.jsx("meshBasicMaterial",{color:Ge,toneMapped:!1})]}),e.jsxs("mesh",{rotation:[0,0,Math.PI/2],children:[e.jsx("boxGeometry",{args:[.3,.035,.035]}),e.jsx("meshBasicMaterial",{color:U,toneMapped:!1})]})]},w)),e.jsx("group",{ref:a,children:e.jsx("lineSegments",{geometry:Ne,children:e.jsx("lineBasicMaterial",{blending:g,color:Y,depthWrite:!1,opacity:.72,toneMapped:!1,transparent:!0})})}),e.jsx("group",{ref:s,children:e.jsx("lineSegments",{geometry:De,children:e.jsx("lineBasicMaterial",{blending:g,color:U,depthWrite:!1,opacity:.74,toneMapped:!1,transparent:!0})})}),e.jsx("lineSegments",{geometry:Ue,children:e.jsx("lineBasicMaterial",{blending:g,color:Y,depthWrite:!1,opacity:.58,toneMapped:!1,transparent:!0})}),e.jsx("group",{ref:l,children:e.jsx("lineSegments",{geometry:Ye,children:e.jsx("lineBasicMaterial",{blending:g,color:U,depthWrite:!1,opacity:.27,toneMapped:!1,transparent:!0})})}),e.jsx("group",{ref:o,children:Array.from({length:8},(w,M)=>{const x=M/8*W;return e.jsxs("group",{position:[Math.cos(x)*3.2,Math.sin(x)*3.2,.16],children:[e.jsxs("mesh",{children:[e.jsx("torusGeometry",{args:[M%2===0?.17:.125,.018,5,28]}),e.jsx("meshBasicMaterial",{blending:g,color:M%2===0?U:Y,depthWrite:!1,opacity:.82,toneMapped:!1,transparent:!0})]}),e.jsxs("mesh",{children:[e.jsx("ringGeometry",{args:[.045,.075,6]}),e.jsx("meshBasicMaterial",{blending:g,color:oe,depthWrite:!1,opacity:.72,side:K,toneMapped:!1,transparent:!0})]})]},M)})}),e.jsx("group",{ref:f,children:e.jsx("lineSegments",{geometry:Ze,children:e.jsx("lineBasicMaterial",{blending:g,color:Ge,depthWrite:!1,opacity:.54,toneMapped:!1,transparent:!0})})}),e.jsxs("group",{ref:h,rotation:[Math.PI/3,.12,0],children:[e.jsxs("mesh",{children:[e.jsx("torusGeometry",{args:[3.82,.018,6,192]}),e.jsx("meshBasicMaterial",{blending:g,color:U,depthWrite:!1,opacity:.38,toneMapped:!1,transparent:!0})]}),e.jsx("lineSegments",{geometry:ke,children:e.jsx("lineBasicMaterial",{blending:g,color:U,depthWrite:!1,opacity:.28,toneMapped:!1,transparent:!0})})]}),e.jsxs("group",{ref:d,rotation:[-Math.PI/3,-.12,0],children:[e.jsxs("mesh",{children:[e.jsx("torusGeometry",{args:[3.88,.014,6,192]}),e.jsx("meshBasicMaterial",{blending:g,color:Y,depthWrite:!1,opacity:.32,toneMapped:!1,transparent:!0})]}),e.jsx("lineSegments",{geometry:ke,children:e.jsx("lineBasicMaterial",{blending:g,color:Y,depthWrite:!1,opacity:.24,toneMapped:!1,transparent:!0})})]}),e.jsx("group",{ref:m,children:e.jsx("lineSegments",{geometry:$e,children:e.jsx("lineBasicMaterial",{blending:g,color:U,depthWrite:!1,opacity:.48,toneMapped:!1,transparent:!0})})}),e.jsx("group",{ref:y,rotation:[.2,.34,0],children:e.jsx("lineSegments",{geometry:He,children:e.jsx("lineBasicMaterial",{blending:g,color:Y,depthWrite:!1,opacity:.1,toneMapped:!1,transparent:!0})})}),e.jsxs("group",{ref:j,children:[e.jsx("lineSegments",{geometry:qe,children:e.jsx("lineBasicMaterial",{blending:g,color:U,depthWrite:!1,opacity:.38,toneMapped:!1,transparent:!0})}),e.jsx("points",{geometry:Ke,children:e.jsx("pointsMaterial",{blending:g,color:Y,depthWrite:!1,opacity:.34,size:.027,sizeAttenuation:!0,toneMapped:!1,transparent:!0})})]}),e.jsx("pointLight",{color:Y,distance:9,intensity:2.2,position:[0,0,1.4]})]})}function en({activity:t="idle"}){return e.jsxs("group",{children:[e.jsx("ambientLight",{color:"#0c6f3c",intensity:.18}),e.jsx(Se,{activity:t,color:"#0e9f58",hotColor:"#c8ffdf",radius:2.28,particleCount:220,opacity:.34}),e.jsx(Qt,{activity:t})]})}const _={red:new R("#ff1744"),white:new R("#ffffff"),darkRed:new R("#8b0000"),dark:new R("#1a1a2e"),core:new R("#ffffff"),hotRed:new R("#ff6b6b")};function tn({activity:t}){const n=p.useRef(null),r=p.useRef(null),u=p.useRef(null),i=p.useMemo(()=>[new v(0,.4,0),new v(.5,.1,0),new v(.3,-.4,0),new v(0,-.1,0),new v(-.3,-.4,0),new v(-.5,.1,0),new v(0,.4,0)],[]),c=p.useMemo(()=>i.map(l=>l.clone().multiplyScalar(.7)),[i]),a=p.useMemo(()=>new k().setFromPoints(i),[i]),s=p.useMemo(()=>new k().setFromPoints(c),[c]);return S(l=>{const o=l.clock.getElapsedTime();let f=1;t==="speaking"?f=1+Math.sin(o*15)*.3+Math.random()*.2:t==="idle"?f=1+Math.sin(o*2)*.05:t==="thinking"?f=1+Math.sin(o*8)*.1:t==="listening"&&(f=.9+Math.sin(o)*.02),n.current&&n.current.scale.setScalar(f),r.current&&(r.current.scale.setScalar(f),r.current.rotation.z=Math.sin(o*.5)*.1),u.current&&(u.current.scale.setScalar(f),u.current.rotation.z=Math.sin(o*.5)*.1)}),e.jsxs("group",{children:[e.jsxs("mesh",{ref:n,children:[e.jsx("sphereGeometry",{args:[.1,16,16]}),e.jsx("meshBasicMaterial",{color:_.core,toneMapped:!1})]}),e.jsx("line",{ref:r,geometry:a,children:e.jsx("lineBasicMaterial",{color:_.red,linewidth:2,toneMapped:!1,transparent:!0,depthWrite:!1})}),e.jsx("line",{ref:u,geometry:s,children:e.jsx("lineBasicMaterial",{color:_.white,linewidth:1,toneMapped:!1,transparent:!0,depthWrite:!1})}),e.jsxs("mesh",{scale:[1.2,1.2,1.2],children:[e.jsx("shapeGeometry",{args:[new nt(i.map(l=>new rt(l.x,l.y)))]}),e.jsx("meshBasicMaterial",{color:new R("#000000"),opacity:.8,transparent:!0,depthWrite:!1})]})]})}function nn({activity:t}){const n=p.useRef(null),{redLines:r,whiteLines:u}=p.useMemo(()=>{const i=[],c=[];for(let h=0;h<10;h++){const d=h/10*Math.PI*2,y=h%4===0?c:i;y.push(new v(0,0,0)),y.push(new v(Math.cos(d)*1.8,Math.sin(d)*1.8,0));for(let j=1;j<=8;j++){const C=j/8*1.8,G=(h+1)/10*Math.PI*2,O=C+Math.sin(d*3)*.05,B=C+Math.sin(G*3)*.05,$=new v(Math.cos(d)*O,Math.sin(d)*O,0),H=new v(Math.cos(G)*B,Math.sin(G)*B,0);y.push($),y.push(H)}}const o=new k().setFromPoints(i),f=new k().setFromPoints(c);return{redLines:o,whiteLines:f}},[]);return S(i=>{const c=i.clock.getElapsedTime();if(n.current){let a=.1,s=1;t==="thinking"?(a=.5,s=1):t==="speaking"?(a=.3,s=1.05):t==="listening"&&(a=.05,s=.95),n.current.rotation.y+=a*.01,n.current.rotation.z+=a*.005;const l=Math.sin(c*2)*.02,o=n.current.scale.x,f=I.lerp(o,s+l,.05);n.current.scale.setScalar(f)}}),e.jsxs("group",{ref:n,children:[e.jsxs("group",{rotation:[0,0,0],children:[e.jsx("lineSegments",{geometry:r,children:e.jsx("lineBasicMaterial",{color:_.red,transparent:!0,opacity:.6,depthWrite:!1,toneMapped:!1})}),e.jsx("lineSegments",{geometry:u,children:e.jsx("lineBasicMaterial",{color:_.white,transparent:!0,opacity:.8,depthWrite:!1,toneMapped:!1})})]}),e.jsx("group",{rotation:[Math.PI/2,0,0],children:e.jsx("lineSegments",{geometry:r,children:e.jsx("lineBasicMaterial",{color:_.red,transparent:!0,opacity:.3,depthWrite:!1,toneMapped:!1})})}),e.jsx("group",{rotation:[0,Math.PI/2,0],children:e.jsx("lineSegments",{geometry:r,children:e.jsx("lineBasicMaterial",{color:_.red,transparent:!0,opacity:.3,depthWrite:!1,toneMapped:!1})})})]})}const rn=new Fe({uniforms:{time:{value:0},color:{value:_.red}},vertexShader:`
    varying vec2 vUv;
    varying vec3 vPos;
    void main() {
      vUv = uv;
      vPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    varying vec3 vPos;
    void main() {
      float scan = sin(vPos.y * 15.0 - time * 3.0) * 0.5 + 0.5;
      float gridX = abs(fract(vUv.x * 20.0) - 0.5) * 2.0;
      float gridY = abs(fract(vUv.y * 20.0) - 0.5) * 2.0;
      float lineX = smoothstep(0.85, 1.0, gridX);
      float lineY = smoothstep(0.85, 1.0, gridY);
      float alpha = (lineX + lineY) * scan * 0.15;
      gl_FragColor = vec4(color, alpha);
    }
  `,transparent:!0,depthWrite:!1,blending:g,side:K});function sn(){const t=p.useRef(null);return S(n=>{t.current&&(t.current.material.uniforms.time.value=n.clock.getElapsedTime(),t.current.rotation.y=n.clock.getElapsedTime()*.05)}),e.jsxs("mesh",{ref:t,children:[e.jsx("sphereGeometry",{args:[2,32,32]}),e.jsx("primitive",{object:rn,attach:"material"})]})}function on({activity:t}){const r=p.useRef(null),u=p.useMemo(()=>new Ie,[]),i=p.useMemo(()=>Array.from({length:40},(a,s)=>({angle:Math.random()*Math.PI*2,radius:Math.random()*1.5+.2,speed:(Math.random()*.5+.5)*(Math.random()>.5?1:-1),plane:Math.floor(Math.random()*3),isLarge:s%7===0,isWhite:Math.random()>.7})),[40]),c=p.useMemo(()=>{const a=new Float32Array(120);for(let s=0;s<40;s++)(i[s].isWhite?_.white:_.red).toArray(a,s*3);return a},[40,i]);return S(a=>{if(!r.current)return;let s=1;t==="thinking"&&(s=3),t==="speaking"&&(s=2),t==="listening"&&(s=.3),i.forEach((l,o)=>{l.angle+=l.speed*s*.02;let f=Math.cos(l.angle)*l.radius,h=Math.sin(l.angle)*l.radius,d=0;l.plane===1?(d=h,h=0):l.plane===2&&(d=f,f=0),u.position.set(f,h,d);const m=l.isLarge?1.5:.8;u.scale.setScalar(m),u.updateMatrix(),r.current.setMatrixAt(o,u.matrix)}),r.current.instanceMatrix.needsUpdate=!0}),e.jsxs("instancedMesh",{ref:r,args:[new st(.015,8,8),void 0,40],children:[e.jsx("meshBasicMaterial",{toneMapped:!1,transparent:!0,opacity:.9,depthWrite:!1,blending:g}),e.jsx("instancedBufferAttribute",{attach:"geometry-attributes-color",args:[c,3]})]})}function an({activity:t}){const n=p.useRef(null),r=8,u=p.useMemo(()=>{const i=[];for(let c=0;c<r;c++){const a=c/r*Math.PI*2,s=[];for(let l=0;l<=10;l++){const o=l/10,f=o*1.5+.1,h=Math.sin(o*Math.PI)*.4;s.push(new v(Math.cos(a)*f,Math.sin(a)*f,-h))}i.push(new ve(s))}return i},[]);return S(i=>{const c=i.clock.getElapsedTime();if(n.current)if(n.current.rotation.z=c*.05,t==="speaking"){const a=1+Math.sin(c*10)*.05;n.current.scale.setScalar(a)}else n.current.scale.setScalar(I.lerp(n.current.scale.x,1,.1))}),e.jsx("group",{ref:n,children:u.map((i,c)=>e.jsxs("mesh",{children:[e.jsx("tubeGeometry",{args:[i,20,.02,8,!1]}),e.jsx("meshBasicMaterial",{color:c%2===0?_.red:_.dark,toneMapped:!1,transparent:!0,opacity:.8})]},c))})}function cn({activity:t}){const n=p.useRef(null),r=12,u=p.useMemo(()=>Array.from({length:r},()=>{const a=Math.random()*Math.PI*2,s=Math.acos(2*Math.random()-1),l=1.4+Math.random()*.4;return{pos:new v(l*Math.sin(s)*Math.cos(a),l*Math.sin(s)*Math.sin(a),l*Math.cos(s)),phase:Math.random()*Math.PI*2,isRed:Math.random()>.5}}),[]),i=p.useMemo(()=>{const a=[];return u.forEach(s=>{a.push(new v(0,0,0)),a.push(s.pos)}),new k().setFromPoints(a)},[u]),c=p.useRef([]);return S(a=>{const s=a.clock.getElapsedTime();c.current.forEach((l,o)=>{let f=.5+Math.sin(s*2+u[o].phase)*.3;t==="thinking"&&(f=.5+Math.sin(s*10+o*.5)*.5),l.opacity=f}),n.current&&n.current.children.forEach(l=>{l.rotation.x+=.01,l.rotation.y+=.02})}),e.jsxs("group",{children:[e.jsx("lineSegments",{geometry:i,children:e.jsx("lineBasicMaterial",{color:_.red,transparent:!0,opacity:.15,depthWrite:!1,toneMapped:!1})}),e.jsx("group",{ref:n,children:u.map((a,s)=>e.jsxs("mesh",{position:a.pos,children:[e.jsx("octahedronGeometry",{args:[.04,0]}),e.jsx("meshBasicMaterial",{ref:l=>{l&&(c.current[s]=l)},color:a.isRed?_.red:_.white,toneMapped:!1,transparent:!0,depthWrite:!1,blending:g})]},s))})]})}function ln(){const n=p.useMemo(()=>{const u=new k,i=new Float32Array(600);for(let c=0;c<200;c++){const a=Math.random()*Math.PI*2,s=Math.acos(2*Math.random()-1),l=1+Math.random()*1.5;i[c*3]=l*Math.sin(s)*Math.cos(a),i[c*3+1]=l*Math.sin(s)*Math.sin(a),i[c*3+2]=l*Math.cos(s)}return u.setAttribute("position",new V(i,3)),u},[]),r=p.useRef(null);return S(u=>{r.current&&(r.current.rotation.y=u.clock.getElapsedTime()*.02,r.current.rotation.x=u.clock.getElapsedTime()*.01)}),e.jsx("points",{ref:r,geometry:n,children:e.jsx("pointsMaterial",{size:.02,color:_.darkRed,transparent:!0,opacity:.4,depthWrite:!1,blending:g})})}function un({activity:t="idle"}){return e.jsxs(e.Fragment,{children:[e.jsx("color",{attach:"background",args:["#020000"]}),e.jsx("fog",{attach:"fog",args:["#050000",7,19]}),e.jsx("ambientLight",{color:"#1a0000",intensity:.1}),e.jsx("pointLight",{position:[0,0,2.1],color:"#ff1744",intensity:2,distance:7}),e.jsx(tn,{activity:t}),e.jsx(nn,{activity:t}),e.jsx(sn,{}),e.jsx(on,{activity:t}),e.jsx(an,{activity:t}),e.jsx(cn,{activity:t}),e.jsx(ln,{}),e.jsx(Se,{color:"#8b0000",hotColor:"#ff6b6b",radius:2.3,particleCount:280,opacity:.28})]})}const Ae=`
// Simplex 3D Noise 
// by Ian McEwan, Ashima Arts
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 1.0/7.0;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
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
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}
`,fn=`
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float uTime;
uniform float uActivityPulse;

${Ae}

void main() {
  vUv = uv;
  vNormal = normal;
  
  float n = snoise(position * 5.0 + uTime * 2.0);
  vec3 pos = position + normal * n * 0.03 * uActivityPulse;
  vPosition = pos;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`,pn=`
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float uTime;
uniform vec3 uColor;

${Ae}

void main() {
  float n = snoise(vPosition * 8.0 - uTime * 3.0);
  float intensity = pow(0.6 + 0.4 * n, 2.0);
  
  vec3 glow = uColor * intensity * 2.5;
  
  // Core center white-hot
  float center = 1.0 - length(vPosition) * 4.0;
  center = clamp(center, 0.0, 1.0);
  glow += vec3(1.0) * pow(center, 3.0);

  gl_FragColor = vec4(glow, 1.0);
}
`,hn=`
varying vec2 vUv;
varying vec3 vPosition;
void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,dn=`
varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;

${Ae}

void main() {
  float flow = fract(vUv.x * 3.0 - uTime * uSpeed);
  float noiseFlow = snoise(vec3(vUv.x * 10.0, vUv.y * 2.0, uTime));
  
  float glow = smoothstep(0.4, 0.5, flow) * smoothstep(0.6, 0.5, flow);
  glow += pow(max(0.0, noiseFlow), 2.0) * 0.8;
  
  // Edge fading on the torus
  float edge = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
  
  vec3 finalColor = uColor * glow * edge * 2.0;
  gl_FragColor = vec4(finalColor, glow * edge);
}
`,mn=`
attribute float aAngle;
attribute float aRadius;
attribute float aSpeed;
attribute float aSize;
attribute vec3 aColor;

varying vec3 vColor;
varying float vAlpha;

uniform float uTime;
uniform float uExpansion;

void main() {
  vColor = aColor;
  
  // Spiral motion
  float currentAngle = aAngle - uTime * aSpeed;
  float currentRadius = mod(aRadius - uTime * aSpeed * 0.5, 3.0);
  currentRadius = mix(currentRadius, currentRadius * uExpansion, 0.5);
  
  if(currentRadius < 0.2) currentRadius += 2.8; // Respawn

  float x = cos(currentAngle) * currentRadius;
  float z = sin(currentAngle) * currentRadius;
  float y = sin(currentAngle * 5.0 + uTime) * 0.05 * currentRadius; // Slight vertical wave
  
  vec3 pos = vec3(x, y, z);
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  
  // Size attenuation
  gl_PointSize = aSize * (10.0 / -mvPosition.z);
  
  // Fade out at edges and center
  vAlpha = smoothstep(0.0, 0.5, currentRadius) * smoothstep(3.0, 1.5, currentRadius);
}
`,gn=`
varying vec3 vColor;
varying float vAlpha;

void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  
  float glow = pow(1.0 - (dist * 2.0), 1.5);
  gl_FragColor = vec4(vColor * glow * 1.5, vAlpha * glow);
}
`,xn=`
varying vec3 vNormal;
varying vec3 vViewPosition;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`,Mn=`
varying vec3 vNormal;
varying vec3 vViewPosition;
uniform vec3 uColor;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);
  
  float rim = 1.0 - max(dot(viewDir, normal), 0.0);
  float rimPower = pow(rim, 6.0); // Sharp edge
  float innerGlow = pow(rim, 2.0) * 0.1;
  
  vec3 color = uColor * (rimPower * 3.0 + innerGlow);
  float alpha = rimPower * 0.8 + innerGlow * 0.2;
  
  gl_FragColor = vec4(color, alpha);
}
`,yn=({activity:t})=>{const n=p.useRef(null),r=p.useRef(null),u=p.useMemo(()=>({uTime:{value:0},uColor:{value:new R("#ffffff")},uActivityPulse:{value:1}}),[]);return S(i=>{const c=i.clock.elapsedTime;u.uTime.value=c;let a=1,s=1;switch(t){case"listening":a=.9,s=.5;break;case"thinking":a=.8+Math.sin(c*8)*.1,s=2;break;case"speaking":a=1.2+Math.sin(c*7)*.15,s=3;break;case"idle":default:a=1+Math.sin(c*2)*.05,s=1;break}if(n.current&&n.current.scale.lerp(new v(a,a,a),.1),r.current){r.current.scale.lerp(new v(a*1.5,a*1.5,a*1.5),.1);const l=r.current.material;l.opacity=I.lerp(l.opacity,t==="speaking"?.5:.25,.1)}u.uActivityPulse.value=I.lerp(u.uActivityPulse.value,s,.1)}),e.jsxs("group",{children:[e.jsxs("mesh",{ref:n,children:[e.jsx("sphereGeometry",{args:[.105,64,64]}),e.jsx("shaderMaterial",{vertexShader:fn,fragmentShader:pn,uniforms:u,transparent:!0,depthWrite:!1,blending:g})]}),e.jsxs("mesh",{ref:r,children:[e.jsx("sphereGeometry",{args:[.15,32,32]}),e.jsx("meshBasicMaterial",{color:"#d8b4fe",transparent:!0,opacity:.25,depthWrite:!1,blending:g})]})]})},vn=({activity:t})=>{const n=p.useRef(null),r=p.useMemo(()=>[{radius:.6,tube:.015,color:"#a855f7",tilt:[Math.PI/3,Math.PI/4,0],speed:1},{radius:1.2,tube:.02,color:"#7c3aed",tilt:[-Math.PI/4,Math.PI/3,Math.PI/6],speed:-.7},{radius:1.8,tube:.03,color:"#6d28d9",tilt:[Math.PI/2.5,-Math.PI/6,Math.PI/2],speed:.5}],[]),u=p.useMemo(()=>r.map(i=>({uTime:{value:0},uColor:{value:new R(i.color)},uSpeed:{value:i.speed}})),[r]);return S(i=>{i.clock.elapsedTime;let c=1;t==="speaking"?c=2:t==="listening"?c=.5:t==="thinking"&&(c=-1.5),u.forEach((a,s)=>{if(a.uTime.value+=i.clock.getDelta()*c,n.current){const l=n.current.children[s];l.rotation.y+=i.clock.getDelta()*.1*(s%2===0?1:-1)*c}})}),e.jsx("group",{ref:n,children:r.map((i,c)=>e.jsxs("mesh",{rotation:new ye(...i.tilt),children:[e.jsx("torusGeometry",{args:[i.radius,i.tube,32,100]}),e.jsx("shaderMaterial",{vertexShader:hn,fragmentShader:dn,uniforms:u[c],transparent:!0,depthWrite:!1,blending:g,side:K})]},c))})},jn=({activity:t})=>{const n=p.useRef(null),r=800,u=p.useMemo(()=>({uTime:{value:0},uExpansion:{value:1}}),[]),{positions:i,angles:c,radii:a,speeds:s,sizes:l,colors:o}=p.useMemo(()=>{const f=new Float32Array(r*3),h=new Float32Array(r),d=new Float32Array(r),m=new Float32Array(r),y=new Float32Array(r),j=new Float32Array(r*3),C=new R("#4c1d95"),G=new R("#9333ea"),O=new R("#f3e8ff");for(let B=0;B<r;B++){h[B]=Math.random()*Math.PI*2;const $=.2+Math.pow(Math.random(),1.5)*2.8;d[B]=$,m[B]=1/($+.5)*(.5+Math.random()*.5),y[B]=Math.random()*8+2;const H=new R;$<1?H.lerpColors(O,G,$):H.lerpColors(G,C,($-1)/1.8),j[B*3]=H.r,j[B*3+1]=H.g,j[B*3+2]=H.b,f[B*3]=0,f[B*3+1]=0,f[B*3+2]=0}return{positions:f,angles:h,radii:d,speeds:m,sizes:y,colors:j}},[r]);return S(f=>{const h=f.clock.getDelta();u.uTime.value+=h*(t==="speaking"?2.5:t==="thinking"?1.5:1);let d=1;t==="speaking"&&(d=1.3),t==="listening"&&(d=.8),u.uExpansion.value=I.lerp(u.uExpansion.value,d,.05)}),e.jsxs("points",{ref:n,children:[e.jsxs("bufferGeometry",{children:[e.jsx("bufferAttribute",{attach:"attributes-position",count:r,array:i,itemSize:3}),e.jsx("bufferAttribute",{attach:"attributes-aAngle",count:r,array:c,itemSize:1}),e.jsx("bufferAttribute",{attach:"attributes-aRadius",count:r,array:a,itemSize:1}),e.jsx("bufferAttribute",{attach:"attributes-aSpeed",count:r,array:s,itemSize:1}),e.jsx("bufferAttribute",{attach:"attributes-aSize",count:r,array:l,itemSize:1}),e.jsx("bufferAttribute",{attach:"attributes-aColor",count:r,array:o,itemSize:3})]}),e.jsx("shaderMaterial",{vertexShader:mn,fragmentShader:gn,uniforms:u,transparent:!0,depthWrite:!1,blending:g})]})},wn=()=>{const t=p.useRef(null),n=250,{positions:r,linesPos:u}=p.useMemo(()=>{const i=new Float32Array(n*3),c=[];for(let s=0;s<n;s++){const l=3.5+Math.random()*1.5,o=Math.random()*Math.PI*2,f=Math.acos(Math.random()*2-1),h=l*Math.sin(f)*Math.cos(o),d=l*Math.sin(f)*Math.sin(o),m=l*Math.cos(f);i[s*3]=h,i[s*3+1]=d,i[s*3+2]=m,c.push(new v(h,d,m))}const a=[];for(let s=0;s<n;s++)for(let l=s+1;l<n;l++)c[s].distanceTo(c[l])<1.2&&(a.push(c[s].x,c[s].y,c[s].z),a.push(c[l].x,c[l].y,c[l].z));return{positions:i,linesPos:new Float32Array(a)}},[n]);return S((i,c)=>{t.current&&(t.current.rotation.y+=c*.01,t.current.rotation.x+=c*.005)}),e.jsxs("group",{ref:t,children:[e.jsxs("points",{children:[e.jsx("bufferGeometry",{children:e.jsx("bufferAttribute",{attach:"attributes-position",count:n,array:r,itemSize:3})}),e.jsx("pointsMaterial",{size:.03,color:"#e9d5ff",transparent:!0,opacity:.5,depthWrite:!1,blending:g})]}),e.jsxs("lineSegments",{children:[e.jsx("bufferGeometry",{children:e.jsx("bufferAttribute",{attach:"attributes-position",count:u.length/3,array:u,itemSize:3})}),e.jsx("lineBasicMaterial",{color:"#a855f7",transparent:!0,opacity:.15,depthWrite:!1,blending:g})]})]})},bn=({activity:t})=>{const n=p.useRef(null),r=160,u=p.useMemo(()=>new Ie,[]),i=p.useMemo(()=>Array.from({length:r},(c,a)=>{const s=a<r/2;return{y:s?Math.random()*4:-Math.random()*4,speed:1+Math.random()*2,x:(Math.random()-.5)*.1,z:(Math.random()-.5)*.1,isUp:s,scale:Math.random()*.5+.5}}),[r]);return S((c,a)=>{if(!n.current)return;const s=c.clock.elapsedTime;let l=1;t==="speaking"&&(l=3),t==="thinking"&&(l=1.5),i.forEach((o,f)=>{o.y+=(o.isUp?1:-1)*o.speed*l*a;const h=Math.sin(s*5+f)*.05*(Math.abs(o.y)/2),d=Math.cos(s*5+f)*.05*(Math.abs(o.y)/2);Math.abs(o.y)>4&&(o.y=o.isUp?.1:-.1),u.position.set(o.x+h,o.y,o.z+d);const m=Math.max(0,1-Math.abs(o.y)/4),y=o.scale*m*(t==="speaking"?2:1);u.scale.set(y,y*4,y),u.updateMatrix(),n.current.setMatrixAt(f,u.matrix)}),n.current.instanceMatrix.needsUpdate=!0}),e.jsxs("instancedMesh",{ref:n,args:[void 0,void 0,r],blending:g,depthWrite:!1,children:[e.jsx("sphereGeometry",{args:[.02,8,8]}),e.jsx("meshBasicMaterial",{color:"#f3e8ff",transparent:!0,opacity:.6,toneMapped:!1})]})},Sn=()=>{const t=p.useMemo(()=>({uColor:{value:new R("#4c1d95")}}),[]);return e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[2.5,64,64]}),e.jsx("shaderMaterial",{vertexShader:xn,fragmentShader:Mn,uniforms:t,transparent:!0,depthWrite:!1,side:ce,blending:g})]})},Pn=({activity:t})=>{const n=p.useRef(null),r=8,u=10,i=p.useMemo(()=>Array.from({length:r},()=>({active:!1,timer:0,duration:0,target:new v,positions:new Float32Array((u+1)*3)})),[r,u]),c=p.useMemo(()=>i.map(()=>new k),[i]);return S((a,s)=>{a.clock.elapsedTime;let l=.01;t==="thinking"&&(l=.08),t==="speaking"&&(l=.05),i.forEach((o,f)=>{if(o.active)if(o.timer+=s,o.timer>o.duration)o.active=!1,c[f].setAttribute("position",new V(new Float32Array(0),3));else{for(let h=0;h<=u;h++){const d=h/u,m=new v().lerpVectors(new v(0,0,0),o.target,d);if(h>0&&h<u){const y=(Math.random()-.5)*.3,j=(Math.random()-.5)*.3,C=(Math.random()-.5)*.3;m.add(new v(y,j,C))}o.positions[h*3]=m.x,o.positions[h*3+1]=m.y,o.positions[h*3+2]=m.z}c[f].setAttribute("position",new V(o.positions,3))}else if(Math.random()<l){o.active=!0,o.timer=0,o.duration=.1+Math.random()*.2;const h=Math.random()*Math.PI*2,d=Math.acos(Math.random()*2-1),m=1+Math.random()*1.5;o.target.set(m*Math.sin(d)*Math.cos(h),m*Math.sin(d)*Math.sin(h),m*Math.cos(d))}})}),e.jsx("group",{ref:n,children:c.map((a,s)=>e.jsx("line",{geometry:a,children:e.jsx("lineBasicMaterial",{color:"#e9d5ff",transparent:!0,opacity:.8,depthWrite:!1,blending:g,toneMapped:!1})},s))})};function Rn({activity:t="idle"}){return e.jsxs("group",{children:[e.jsx("ambientLight",{color:"#2e1065",intensity:.15}),e.jsx("pointLight",{position:[0,0,2],color:"#a855f7",intensity:2.5,distance:8}),e.jsx("fog",{attach:"fog",args:["#0a0015",7,20]}),e.jsx(yn,{activity:t}),e.jsx(vn,{activity:t}),e.jsx(jn,{activity:t}),e.jsx(wn,{}),e.jsx(bn,{activity:t}),e.jsx(Sn,{}),e.jsx(Pn,{activity:t})]})}const zn=`
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,An=`
  uniform float time;
  uniform float intensity;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                       -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    float dist = length(vUv - 0.5) * 2.0;
    float noise = snoise(vUv * 5.0 - time * 1.5) * 0.2;
    float glow = 1.0 - smoothstep(0.0, 0.8 + noise, dist);
    
    vec3 colorA = vec3(1.0, 0.8, 0.4); // bright yellow/white
    vec3 colorB = vec3(1.0, 0.55, 0.1); // orange
    
    vec3 finalColor = mix(colorB, colorA, glow * 1.5) * intensity;
    
    float alpha = glow * intensity;
    gl_FragColor = vec4(finalColor, alpha);
  }
`,kn=`
  varying vec3 vViewPosition;
  varying vec3 vNormal;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mvPosition;
  }
`,En=`
  uniform vec3 color;
  varying vec3 vViewPosition;
  varying vec3 vNormal;
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = dot(viewDir, normal);
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    fresnel = pow(fresnel, 3.0);
    gl_FragColor = vec4(color * fresnel * 1.5, fresnel * 0.4);
  }
`;function Cn(t){const n=Math.sin(t++)*1e4;return n-Math.floor(n)}const Tn=({activity:t})=>{const n=p.useRef(null),r=p.useRef(null),u=p.useRef(null);return S(i=>{const c=i.clock.elapsedTime;if(n.current){n.current.uniforms.time.value=c;let a=1;t==="speaking"?a=1.5+Math.sin(c*8)*.3:t==="thinking"?a=1.2+Math.random()*.4:t==="listening"&&(a=.5),n.current.uniforms.intensity.value=a}r.current&&(r.current.rotation.z=c*.2),u.current&&(u.current.rotation.z=-c*.1)}),e.jsxs("group",{children:[e.jsxs("mesh",{children:[e.jsx("circleGeometry",{args:[.15,32]}),e.jsx("shaderMaterial",{ref:n,vertexShader:zn,fragmentShader:An,uniforms:{time:{value:0},intensity:{value:1}},transparent:!0,blending:g,depthWrite:!1})]}),e.jsx("group",{ref:r,children:e.jsxs("mesh",{children:[e.jsx("ringGeometry",{args:[.2,.22,3]}),e.jsx("meshBasicMaterial",{color:"#fffde0",transparent:!0,opacity:.9,blending:g,depthWrite:!1,toneMapped:!1})]})}),e.jsxs("mesh",{children:[e.jsx("torusGeometry",{args:[.35,.02,16,64]}),e.jsx("meshBasicMaterial",{color:"#ff8c18",transparent:!0,opacity:.8,blending:g,depthWrite:!1,toneMapped:!1})]}),e.jsx("group",{ref:u,children:e.jsxs("mesh",{children:[e.jsx("ringGeometry",{args:[.45,.5,6]}),e.jsx("meshBasicMaterial",{color:"#ffd06b",transparent:!0,opacity:.6,blending:g,depthWrite:!1,toneMapped:!1})]})})]})},Gn=({activity:t})=>{const n=p.useRef(null),r=p.useRef(null),u=p.useRef(null),i=p.useRef(null),c=p.useMemo(()=>{const l=[];for(let o=0;o<24;o++){const f=Cn(o)>.5?.15:.05;l.push(e.jsxs("mesh",{rotation:[0,0,o/24*Math.PI*2],children:[e.jsx("ringGeometry",{args:[1.18,1.22,16,1,0,f]}),e.jsx("meshBasicMaterial",{color:"#ff9d2e",transparent:!0,opacity:.7,blending:g,depthWrite:!1,toneMapped:!1})]},o))}return l},[]),a=p.useMemo(()=>{const l=[];for(let o=0;o<12;o++)l.push(e.jsxs("mesh",{position:[Math.cos(o/12*Math.PI*2)*1.6,Math.sin(o/12*Math.PI*2)*1.6,0],children:[e.jsx("circleGeometry",{args:[.03,6]}),e.jsx("meshBasicMaterial",{color:"#ffc46b",transparent:!0,opacity:.8,blending:g,depthWrite:!1,toneMapped:!1})]},o));return l},[]),s=p.useMemo(()=>{const l=[];for(let o=0;o<4;o++)l.push(e.jsxs("mesh",{rotation:[0,0,o/4*Math.PI*2+Math.PI/4],children:[e.jsx("ringGeometry",{args:[1.98,2.02,16,1,-.1,.2]}),e.jsx("meshBasicMaterial",{color:"#ff7a18",transparent:!0,opacity:.6,blending:g,depthWrite:!1,toneMapped:!1})]},o));return l},[]);return S(l=>{const o=l.clock.elapsedTime;let f=1;t==="listening"&&(f=.2),t==="thinking"&&(f=1.5),t==="speaking"&&(f=2),n.current&&(n.current.rotation.z=o*.3*f),r.current&&(r.current.rotation.z=-o*.4*f),u.current&&(u.current.rotation.z=o*.2*f),i.current&&(i.current.rotation.z=-o*.1*f)}),e.jsxs("group",{children:[e.jsxs("mesh",{ref:n,children:[e.jsx("ringGeometry",{args:[.78,.82,64]}),e.jsx("meshBasicMaterial",{color:"#ff9d2e",transparent:!0,opacity:.5,blending:g,depthWrite:!1,toneMapped:!1})]}),e.jsx("group",{ref:r,children:c}),e.jsxs("group",{ref:u,children:[e.jsxs("mesh",{children:[e.jsx("ringGeometry",{args:[1.59,1.61,64]}),e.jsx("meshBasicMaterial",{color:"#ffc46b",transparent:!0,opacity:.4,blending:g,depthWrite:!1,toneMapped:!1})]}),a]}),e.jsxs("group",{ref:i,children:[e.jsxs("mesh",{children:[e.jsx("ringGeometry",{args:[1.99,2,64]}),e.jsx("meshBasicMaterial",{color:"#ff7a18",transparent:!0,opacity:.3,blending:g,depthWrite:!1,toneMapped:!1})]}),s]})]})},Wn=({activity:t})=>{const n=p.useRef(null),r=p.useMemo(()=>{const c=[];for(let a=0;a<60;a++){const l=Math.floor(Math.random()*14)/14*Math.PI*2;c.push({angle:l,radius:Math.random()*3+.5,speed:Math.random()*.5+.5,size:a%7===0?.08:.03})}return c},[]),[u,i]=p.useMemo(()=>{const c=new Float32Array(180),a=new Float32Array(60);return r.forEach((s,l)=>{a[l]=s.size}),[c,a]},[r]);return S(c=>{if(!n.current)return;const a=c.clock.getDelta();let s=1;t==="listening"&&(s=0),t==="thinking"&&(s=2),t==="speaking"&&(s=3);const l=n.current.geometry.attributes.position.array;for(let o=0;o<60;o++){const f=r[o];f.radius+=f.speed*a*s,f.radius>4&&(f.radius=.5);const h=f.angle+f.radius*.2;l[o*3]=Math.cos(h)*f.radius,l[o*3+1]=Math.sin(h)*f.radius,l[o*3+2]=0}n.current.geometry.attributes.position.needsUpdate=!0}),e.jsxs("points",{ref:n,children:[e.jsxs("bufferGeometry",{children:[e.jsx("bufferAttribute",{attach:"attributes-position",count:60,array:u,itemSize:3}),e.jsx("bufferAttribute",{attach:"attributes-size",count:60,array:i,itemSize:1})]}),e.jsx("pointsMaterial",{color:"#fffde0",size:.05,transparent:!0,opacity:.8,blending:g,depthWrite:!1,toneMapped:!1})]})},Bn=({activity:t})=>{const n=p.useRef(null),r=p.useRef([{radius:.5,active:!1,opacity:0},{radius:.5,active:!1,opacity:0}]),u=p.useRef(0);return S(i=>{const c=i.clock.elapsedTime,a=i.clock.getDelta();if(t==="speaking"&&c-u.current>1.5){u.current=c;const s=r.current.find(l=>!l.active);s&&(s.active=!0,s.radius=.5,s.opacity=1)}n.current&&n.current.children.forEach((s,l)=>{const o=r.current[l];o.active?(o.radius+=2*a,o.opacity-=.8*a,o.opacity<=0&&(o.active=!1),s.scale.setScalar(o.radius),s.material=new Ee({color:"#ff8c18",transparent:!0,opacity:Math.max(0,o.opacity),blending:g,depthWrite:!1,toneMapped:!1,side:K})):s.material=new Ee({opacity:0,transparent:!0})})}),e.jsxs("group",{ref:n,children:[e.jsxs("mesh",{children:[e.jsx("ringGeometry",{args:[.95,1,64]}),e.jsx("meshBasicMaterial",{transparent:!0,opacity:0})]}),e.jsxs("mesh",{children:[e.jsx("ringGeometry",{args:[.95,1,64]}),e.jsx("meshBasicMaterial",{transparent:!0,opacity:0})]})]})},Fn=()=>{const t=p.useMemo(()=>{const n=[];for(let r=1;r<=4;r++)n.push(e.jsxs("mesh",{children:[e.jsx("ringGeometry",{args:[r-.005,r+.005,64]}),e.jsx("meshBasicMaterial",{color:"#ff7a18",transparent:!0,opacity:.1,depthWrite:!1,blending:g})]},`circle-${r}`));for(let r=0;r<12;r++){const u=r/12*Math.PI;n.push(e.jsxs("mesh",{rotation:[0,0,u],children:[e.jsx("planeGeometry",{args:[8,.01]}),e.jsx("meshBasicMaterial",{color:"#ff7a18",transparent:!0,opacity:.08,depthWrite:!1,blending:g})]},`line-${r}`))}return n},[]);return e.jsx("group",{children:t})},In=({activity:t})=>{const n=p.useRef(null),[r,u]=p.useMemo(()=>{const i=new Float32Array(900),c=new Float32Array(300);for(let a=0;a<300;a++){const s=2+Math.random()*2,l=Math.random()*Math.PI*2,o=Math.acos(2*Math.random()-1);i[a*3]=s*Math.sin(o)*Math.cos(l),i[a*3+1]=s*Math.sin(o)*Math.sin(l),i[a*3+2]=s*Math.cos(o),c[a]=Math.random()*Math.PI*2}return[i,c]},[]);return S(i=>{if(!n.current)return;const c=i.clock.elapsedTime;let a=1;t==="listening"&&(a=.5),t==="thinking"&&(a=2),t==="speaking"&&(a=3),n.current.rotation.y=c*.05*a,n.current.rotation.z=c*.03*a}),e.jsxs("points",{ref:n,children:[e.jsxs("bufferGeometry",{children:[e.jsx("bufferAttribute",{attach:"attributes-position",count:300,array:r,itemSize:3}),e.jsx("bufferAttribute",{attach:"attributes-phase",count:300,array:u,itemSize:1})]}),e.jsx("pointsMaterial",{color:"#ffd06b",size:.03,transparent:!0,opacity:.4,blending:g,depthWrite:!1,toneMapped:!1})]})},_n=()=>e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[4.5,32,32]}),e.jsx("shaderMaterial",{vertexShader:kn,fragmentShader:En,uniforms:{color:{value:new R("#7a2608")}},transparent:!0,blending:g,depthWrite:!1,side:K})]}),Ln=({activity:t="idle"})=>e.jsxs("group",{children:[e.jsx("fog",{attach:"fog",args:["#060200",7,22]}),e.jsx("ambientLight",{color:"#4a2100",intensity:.12}),e.jsx("pointLight",{position:[0,0,1.5],color:"#ff8c18",intensity:2.8,distance:9}),e.jsx("directionalLight",{position:[5,8,4],color:"#ffd7a3",intensity:.3}),e.jsx(Fn,{}),e.jsx(Tn,{activity:t}),e.jsx(Gn,{activity:t}),e.jsx(Wn,{activity:t}),e.jsx(Bn,{activity:t}),e.jsx(In,{activity:t}),e.jsx(_n,{})]}),We={gold:"#020100",green:"#000704",blue:"#00040a",red:"#080002",violet:"#02000a",orange:"#080300",spider:"#000408"};function Xe(t){return We[t]||We.gold}function Me(t,n){const r=n.getBoundingClientRect(),u=Math.min(r.width,r.height)*.38;if(u<=0)return!1;const i=(t.clientX-(r.left+r.width/2))/u,c=(t.clientY-(r.top+r.height/2))/(u*.94);return i*i+c*c<=1}function Vn({palette:t}){const{gl:n}=je();return p.useEffect(()=>{const r=Xe(t);n.setClearColor(r,1)},[n,t]),null}function On({resetSignal:t=0}){const{camera:n,gl:r,size:u}=je(),i=p.useMemo(()=>new lt(n,r.domElement),[n,r]);return p.useEffect(()=>{i.enableDamping=!0,i.dampingFactor=.075,i.enablePan=!1,i.enableZoom=!1,i.enableRotate=!1,i.rotateSpeed=0,i.zoomSpeed=.48,i.minDistance=5.25,i.maxDistance=u.width/u.height<.72?15:8.6,i.target.set(0,0,0),r.domElement.classList.add("is-orbit-enabled");const c=s=>{const l=!document.body.classList.contains("hud-dragging")&&Me(s,r.domElement);i.enableZoom=l,r.domElement.classList.toggle("orb-hit-active",l)},a=()=>{i.enableZoom=!1,r.domElement.classList.remove("orb-hit-active")};return r.domElement.addEventListener("pointermove",c,{passive:!0}),r.domElement.addEventListener("pointerleave",a),r.domElement.addEventListener("wheel",c,{capture:!0,passive:!0}),()=>{r.domElement.classList.remove("is-orbit-enabled"),r.domElement.classList.remove("orb-hit-active"),r.domElement.removeEventListener("pointermove",c),r.domElement.removeEventListener("pointerleave",a),r.domElement.removeEventListener("wheel",c,!0),i.dispose()}},[i,r.domElement,u]),p.useEffect(()=>{const a=u.width/u.height<.72?12.9:7.15;n.position.set(0,0,a),i.target.set(0,0,0),i.update()},[n,i,t,u.height,u.width]),S(()=>i.update()),null}function Xn(t){return t instanceof HTMLElement?!!t.closest(".hud-dock, .history-panel, .chat-side-panel, .settings-panel, .activity-hub, .prompt-shell, .draggable-panel, .os-taskbar, .os-minimized-dock, button, input, textarea, select"):!1}function Nn({activity:t,palette:n,resetSignal:r=0,children:u}){const i=p.useRef(null),{pointer:c,size:a,gl:s}=je(),l=p.useRef(!1),o=p.useRef({active:!1,x:0,y:0,targetX:0,targetY:0,lastX:0,lastY:0});return p.useEffect(()=>{const f=m=>{m.button!==0||m.target!==s.domElement||Xn(m.target)||document.body.classList.contains("hud-dragging")||!Me(m,s.domElement)||(l.current=!0,o.current.active=!0,o.current.lastX=m.clientX,o.current.lastY=m.clientY,document.body.classList.add("is-reactor-dragging"))},h=m=>{if(l.current=m.target===s.domElement&&!document.body.classList.contains("hud-dragging")&&Me(m,s.domElement),!o.current.active)return;const y=m.clientX-o.current.lastX,j=m.clientY-o.current.lastY;o.current.lastX=m.clientX,o.current.lastY=m.clientY,o.current.targetY+=y*.0065,o.current.targetX+=j*.0048,o.current.targetX=I.clamp(o.current.targetX,-.9,.9)},d=()=>{o.current.active=!1,document.body.classList.remove("is-reactor-dragging")};return window.addEventListener("pointerdown",f),window.addEventListener("pointermove",h),window.addEventListener("pointerup",d),window.addEventListener("pointercancel",d),()=>{window.removeEventListener("pointerdown",f),window.removeEventListener("pointermove",h),window.removeEventListener("pointerup",d),window.removeEventListener("pointercancel",d),document.body.classList.remove("is-reactor-dragging")}},[s.domElement]),p.useEffect(()=>{o.current.x=0,o.current.y=0,o.current.targetX=0,o.current.targetY=0},[r]),S(({clock:f})=>{const h=f.elapsedTime,d=a.width/a.height<.72;if(i.current){o.current.x=I.lerp(o.current.x,o.current.targetX,.09),o.current.y=I.lerp(o.current.y,o.current.targetY,.09);const m=t==="speaking"?1.52:t==="thinking"?1.28:t==="listening"?.82:1,y=1+Math.sin(h*(t==="speaking"?5.8:.88))*(t==="speaking"?.026:.009)*m;i.current.scale.setScalar(y);const j=d||!l.current||document.body.classList.contains("hud-dragging")?0:.08;i.current.rotation.x=I.lerp(i.current.rotation.x,o.current.x-c.y*j,.045),i.current.rotation.y=I.lerp(i.current.rotation.y,o.current.y+c.x*j,.045),i.current.rotation.z=Math.sin(h*.12)*.016}}),e.jsx("group",{ref:i,children:u})}function Dn({activity:t,palette:n}){const r=p.useMemo(()=>{const u=t==="speaking"?2.55:t==="thinking"?2.08:1.84;return n==="green"?u*1.04:n==="blue"?u*.96:n==="spider"?u*1.08:u},[t,n]);return e.jsx(ut,{multisampling:0,children:e.jsx(ft,{intensity:r,luminanceSmoothing:.64,luminanceThreshold:.22,mipmapBlur:!0})})}function Zn({activity:t,palette:n,resetSignal:r=0}){const u=ot();return e.jsx("div",{className:"orb-webgl","aria-hidden":"true",children:e.jsxs(at,{camera:{fov:41,near:.1,far:30,position:[0,0,7.15]},dpr:u?1:[1,1.45],frameloop:u?"demand":"always",gl:{alpha:!1,antialias:!1,powerPreference:"high-performance",stencil:!1},onCreated:({gl:i})=>{i.setClearColor(Xe(n),1),i.outputColorSpace=it,i.toneMapping=ct,i.toneMappingExposure=.98},children:[e.jsx(Vn,{palette:n}),e.jsx(On,{resetSignal:r}),e.jsx(Nn,{activity:t,palette:n,resetSignal:r,children:e.jsx(pt,{palette:n,children:i=>i==="gold"?e.jsx(Ce,{activity:t,palette:"gold"}):i==="green"?e.jsx(en,{activity:t}):i==="blue"?e.jsx(Dt,{activity:t}):i==="red"?e.jsx(Jt,{activity:t}):i==="violet"?e.jsx(Rn,{activity:t}):i==="orange"?e.jsx(Ln,{activity:t}):i==="spider"?e.jsx(un,{activity:t}):e.jsx(Ce,{activity:t,palette:"gold"})})}),e.jsx(Dn,{activity:t,palette:n})]})})}export{Zn as default};
