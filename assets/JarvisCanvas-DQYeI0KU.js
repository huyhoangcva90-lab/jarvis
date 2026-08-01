import{r as u,j as e}from"./index-BPjIfp4J.js";import{u as x,M as T,C as F,A as v,I as qe,W as $e,V as j,B as I,F as R,U as ke,a as Ke,b as A,E as Ge,c as fe,T as _e,d as Je,D as _,O as q,S as ee,e as O,P as Qe,f as Te,g as et,h as tt,i as de,j as nt,k as rt,w as st}from"./useReducedMotion-B95IT8AQ.js";function ot({palette:t,children:n}){const r=u.useRef(null),[s,i]=u.useState(t),a=u.useRef("idle"),c=u.useRef(1);return u.useEffect(()=>{if(t===s)return;a.current="out";const o=window.setTimeout(()=>{c.current=0,i(t),a.current="in"},150);return()=>window.clearTimeout(o)},[t,s]),x((o,l)=>{a.current==="out"?c.current=T.lerp(c.current,0,l*12):a.current==="in"&&(c.current=T.lerp(c.current,1,l*8),c.current>.95&&(c.current=1,a.current="idle")),r.current&&(r.current.scale.setScalar(c.current),r.current.rotation.y=(1-c.current)*Math.PI*.25)}),e.jsx("group",{ref:r,children:n(s)})}const te=new F("#fff8d6"),Fe=new F("#d65f10"),at={gold:["#fff8d6","#d65f10"],green:["#f5fff6","#18bd58"],violet:["#faf5ff","#7c3aed"],orange:["#fff5de","#ed5f12"]};function it(t){return()=>{let n=t+=1831565813;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}function We(t){return t==="speaking"?1.52:t==="thinking"?1.28:t==="listening"?.82:1}function Le(t){return t==="speaking"?1.85:t==="thinking"?1.42:t==="listening"?.46:1}const re={uniforms:{uTime:{value:0},uEnergy:{value:1},uOpacity:{value:1},uColor:{value:te}},vertexShader:`
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
  `};function ct(){return{uniforms:ke.clone(re.uniforms),vertexShader:re.vertexShader,fragmentShader:re.fragmentShader}}function lt(){const t=it(60879),n=[],r=[],s=[];for(let a=0;a<42;a+=1){const c=t()*Math.PI*2,o=Math.acos(2*t()-1),l=new j(Math.sin(o)*Math.cos(c),Math.cos(o),Math.sin(o)*Math.sin(c)),m=.24+t()*.32,f=1.04+t()*(a%5===0?1.34:.82),d=l.clone().multiplyScalar(m),p=l.clone().multiplyScalar(f);n.push(d.x,d.y,d.z,p.x,p.y,p.z),r.push(t()*6.28,t()*6.28),s.push(.35+t()*.65,.35+t()*.65)}const i=new I;return i.setAttribute("position",new R(n,3)),i.setAttribute("aPhase",new R(r,1)),i.setAttribute("aIntensity",new R(s,1)),i}function ut({activity:t,flashRef:n}){const r=u.useRef(null),s=u.useRef(null),i=u.useMemo(lt,[]),a=u.useMemo(ct,[]);return x(({clock:c},o)=>{const l=We(t)*(1+n.current*2);s.current&&(s.current.uniforms.uTime.value=c.elapsedTime,s.current.uniforms.uEnergy.value=l*(t==="speaking"?1.22:1),s.current.uniforms.uOpacity.value=t==="speaking"?.82:.7,s.current.uniforms.uColor.value.copy(te)),r.current&&(r.current.rotation.y+=o*.055*Le(t),r.current.rotation.x=Math.sin(c.elapsedTime*.18)*.05,r.current.scale.setScalar(1+n.current*.2))}),e.jsx("group",{ref:r,children:e.jsx("lineSegments",{geometry:i,children:e.jsx("shaderMaterial",{ref:s,args:[a],blending:v,depthWrite:!1,toneMapped:!1,transparent:!0})})})}function mt({activity:t,flashRef:n}){const r=u.useRef(null),s=u.useRef(null),i=u.useRef(null),a=u.useRef(null),c=u.useMemo(()=>{const o=new qe(2.02,2),l=new $e(o);return o.dispose(),l},[]);return x(({clock:o},l)=>{const m=o.elapsedTime,f=Le(t),d=We(t),p=t==="speaking"?Math.sin(m*7.2)*.035:0,h=t==="thinking"?Math.sin(m*3.4)*.018:0,g=1+p+h+n.current*.075;r.current&&(r.current.rotation.x+=l*.035*f,r.current.rotation.y+=l*.052*f,r.current.rotation.z-=l*.018*f,r.current.scale.setScalar(g)),s.current&&(s.current.rotation.x-=l*.026*f,s.current.rotation.y-=l*.041*f,s.current.rotation.z+=l*.023*f,s.current.scale.setScalar(.91-p*.42+n.current*.035)),i.current&&(i.current.opacity=.2+d*.13+n.current*.24),a.current&&(a.current.opacity=.08+d*.075+n.current*.12)}),e.jsxs("group",{rotation:[.08,-.18,.06],children:[e.jsx("lineSegments",{ref:r,geometry:c,children:e.jsx("lineBasicMaterial",{ref:i,blending:v,color:te,depthWrite:!1,opacity:.34,toneMapped:!1,transparent:!0})}),e.jsx("lineSegments",{ref:s,geometry:c,children:e.jsx("lineBasicMaterial",{ref:a,blending:v,color:Fe,depthWrite:!1,opacity:.15,toneMapped:!1,transparent:!0})})]})}function ft({activity:t,palette:n="gold"}){const[r,s]=at[n];te.set(r),Fe.set(s);const[i,a]=u.useState(0),c=u.useRef(0);return u.useEffect(()=>{let o;const l=()=>{a(1),setTimeout(()=>a(0),100);const m=500+Math.random()*2500;t==="thinking"?o=setTimeout(l,m*.5):o=setTimeout(l,m)};return o=setTimeout(l,1e3),()=>clearTimeout(o)},[t]),x((o,l)=>{c.current=T.lerp(c.current,i,l*8)}),e.jsxs("group",{scale:[1.3,.8,1.1],position:[.1,-.05,0],rotation:[.2,.1,-.1],children:[e.jsx(ut,{activity:t,flashRef:c}),e.jsx(mt,{activity:t,flashRef:c})]})}const V=new F("#ff8a18"),S=new F("#ffd15c"),pe=new F("#fff8d6"),ae=new F("#b8490b"),he=new F("#d65f10"),dt={gold:["#ff8a18","#ffd15c","#fff8d6","#b8490b","#d65f10"],green:["#4cff85","#b9ffc9","#f5fff6","#0b4f24","#18bd58"],violet:["#a855f7","#d8b4fe","#faf5ff","#1e0547","#7c3aed"],orange:["#ff7a18","#ffc46b","#fff5de","#7a2608","#ed5f12"]};function pt(t){const[n,r,s,i,a]=dt[t];V.set(n),S.set(r),pe.set(s),ae.set(i),he.set(a)}const z=[{radiusX:.66,radiusZ:.58,seed:11,speed:.33,tilt:[.28,.16,.84],opacity:.64,width:1,packets:3},{radiusX:.88,radiusZ:.74,seed:13,speed:-.26,tilt:[1.1,.04,-.38],opacity:.5,width:1,packets:2},{radiusX:1.06,radiusZ:.98,seed:17,speed:.21,tilt:[.08,.9,.24],opacity:.42,width:1,packets:4},{radiusX:1.28,radiusZ:1.05,seed:19,speed:-.18,tilt:[1.42,.32,.52],opacity:.58,width:1.3,packets:3},{radiusX:1.42,radiusZ:1.34,seed:23,speed:.13,tilt:[.46,1.18,-.2],opacity:.37,width:1,packets:2},{radiusX:1.58,radiusZ:1.18,seed:29,speed:-.11,tilt:[1.28,.82,1.05],opacity:.46,width:1.1,packets:3},{radiusX:1.78,radiusZ:1.58,seed:31,speed:.087,tilt:[.2,.2,1.47],opacity:.32,width:1,packets:2},{radiusX:2.03,radiusZ:1.72,seed:37,speed:-.072,tilt:[1.05,.42,-1.12],opacity:.34,width:1.2,packets:4},{radiusX:2.24,radiusZ:1.86,seed:41,speed:.055,tilt:[.72,1.05,.42],opacity:.28,width:1,packets:3},{radiusX:2.46,radiusZ:2.08,seed:43,speed:-.048,tilt:[1.38,.12,.08],opacity:.25,width:1,packets:2}];function $(t){return()=>{let n=t+=1831565813;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}function C(t){return t==="speaking"?1.52:t==="thinking"?1.28:t==="listening"?.82:1}function W(t){return t==="speaking"?1.85:t==="thinking"?1.42:t==="listening"?.46:1}const se={uniforms:{uTime:{value:0},uEnergy:{value:1},uOpacity:{value:1},uColor:{value:V}},vertexShader:`
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
  `};function Be(){return{uniforms:ke.clone(se.uniforms),vertexShader:se.vertexShader,fragmentShader:se.fragmentShader}}function ht(){const t=$(54421),n=[],r=[],s=[];for(let a=0;a<12;a+=1){const c=t()*Math.PI*2,o=Math.acos(2*t()-1),l=new j(Math.sin(o)*Math.cos(c),Math.cos(o),Math.sin(o)*Math.sin(c)),m=a%4===0?2.05+t()*.38:1.1+t()*.66,f=l.clone().multiplyScalar((t()-.5)*.22),d=l.clone().multiplyScalar(-m).add(f),p=l.clone().multiplyScalar(m).add(f.multiplyScalar(.35));n.push(d.x,d.y,d.z,p.x,p.y,p.z),r.push(t()*6.28,t()*6.28),s.push(a%4===0?.92:.44+t()*.32,a%4===0?.92:.44+t()*.32)}const i=new I;return i.setAttribute("position",new R(n,3)),i.setAttribute("aPhase",new R(r,1)),i.setAttribute("aIntensity",new R(s,1)),i}function gt(t){const n=$(t.seed*313),r=[],s=[],i=[],a=240,c=n()*Math.PI*2,o=n()*Math.PI*2;for(let m=0;m<a;m+=1){const f=m/a*Math.PI*2,d=(m+1)/a*Math.PI*2;if(Math.abs(Math.sin((f-c)*1.5))<.13||Math.abs(Math.sin((f-o)*2))<.11||(m+t.seed)%23===0)continue;const h=1+Math.sin(f*5+t.seed)*.018+(n()-.5)*.01,g=1+Math.sin(d*5+t.seed)*.018+(n()-.5)*.01,y=Math.sin(f*3+t.seed)*.025,M=Math.sin(d*3+t.seed)*.025;r.push(Math.cos(f)*t.radiusX*h,y,Math.sin(f)*t.radiusZ*h),r.push(Math.cos(d)*t.radiusX*g,M,Math.sin(d)*t.radiusZ*g),s.push(f+t.seed,d+t.seed),i.push(.55+n()*.45,.55+n()*.45)}const l=new I;return l.setAttribute("position",new R(r,3)),l.setAttribute("aPhase",new R(s,1)),l.setAttribute("aIntensity",new R(i,1)),l}function vt(t){const n=$(t.seed*791),r=[],s=96;for(let i=0;i<s;i+=1){const a=i/s*Math.PI*2,c=1+Math.sin(a*3+t.seed)*.018+(n()-.5)*.008;r.push(new j(Math.cos(a)*t.radiusX*c,Math.sin(a*2+t.seed)*.018,Math.sin(a)*t.radiusZ*c))}return new fe(r,!0,"centripetal",.5)}function xt({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),i=u.useRef(null);return x(({clock:a},c)=>{const o=a.elapsedTime,l=W(t),m=C(t);if(n.current){const f=t==="speaking"?Math.sin(o*7.2)*.075:Math.sin(o*2.2)*.025;n.current.scale.setScalar((1+f)*(.98+m*.035)),n.current.rotation.y+=c*.18*l}r.current&&(r.current.rotation.x+=c*.42*l),s.current&&(s.current.rotation.y-=c*.34*l),i.current&&(i.current.rotation.z+=c*.27*l)}),e.jsxs("group",{ref:n,children:[e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[.105,32,32]}),e.jsx("meshBasicMaterial",{color:pe,toneMapped:!1})]}),e.jsxs("mesh",{scale:1+C(t)*.075,children:[e.jsx("sphereGeometry",{args:[.31,32,32]}),e.jsx("meshBasicMaterial",{blending:v,color:S,depthWrite:!1,opacity:.32,toneMapped:!1,transparent:!0})]}),e.jsxs("mesh",{scale:1.72,children:[e.jsx("sphereGeometry",{args:[.42,32,32]}),e.jsx("meshBasicMaterial",{blending:v,color:V,depthWrite:!1,opacity:.092,toneMapped:!1,transparent:!0})]}),e.jsxs("mesh",{ref:r,rotation:[.3,.2,.1],children:[e.jsx("torusKnotGeometry",{args:[.34,.018,180,5,2,3]}),e.jsx("meshBasicMaterial",{blending:v,color:S,depthWrite:!1,toneMapped:!1})]}),e.jsxs("mesh",{ref:s,rotation:[1.1,.4,.8],scale:1.18,children:[e.jsx("torusKnotGeometry",{args:[.34,.011,180,4,3,5]}),e.jsx("meshBasicMaterial",{blending:v,color:V,depthWrite:!1,opacity:.72,toneMapped:!1,transparent:!0})]}),e.jsxs("mesh",{ref:i,rotation:[.2,1.2,.5],scale:1.42,children:[e.jsx("torusKnotGeometry",{args:[.34,.008,180,4,2,5]}),e.jsx("meshBasicMaterial",{blending:v,color:he,depthWrite:!1,opacity:.48,toneMapped:!1,transparent:!0})]})]})}function yt({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(ht,[]),i=u.useMemo(Be,[]);return x(({clock:a},c)=>{r.current&&(r.current.uniforms.uTime.value=a.elapsedTime*1.28,r.current.uniforms.uEnergy.value=C(t)*(t==="speaking"?1.34:.96),r.current.uniforms.uOpacity.value=t==="listening"?.26:t==="speaking"?.48:.38,r.current.uniforms.uColor.value.copy(S)),n.current&&(n.current.rotation.y+=c*.035*W(t),n.current.rotation.z-=c*.018)}),e.jsx("group",{ref:n,children:e.jsx("lineSegments",{geometry:s,children:e.jsx("shaderMaterial",{ref:r,args:[i],blending:v,depthWrite:!1,toneMapped:!1,transparent:!0})})})}function Mt({activity:t,index:n,spec:r}){const s=u.useRef(null),i=u.useRef(null),a=u.useMemo(()=>gt(r),[r]),c=u.useMemo(Be,[]);return x(({clock:o},l)=>{const m=W(t);if(s.current){s.current.rotation.y+=l*r.speed*m,s.current.rotation.z+=l*r.speed*.28*m;const f=1+Math.sin(o.elapsedTime*.8+r.seed)*.004*C(t);s.current.scale.setScalar(f)}i.current&&(i.current.uniforms.uTime.value=o.elapsedTime+n*.71,i.current.uniforms.uEnergy.value=C(t),i.current.uniforms.uOpacity.value=r.opacity,i.current.uniforms.uColor.value.copy(n<3?S:n>6?he:V))}),e.jsx("group",{ref:s,rotation:r.tilt,children:e.jsx("lineSegments",{geometry:a,children:e.jsx("shaderMaterial",{ref:i,args:[c],blending:v,depthWrite:!1,toneMapped:!1,transparent:!0})})})}function jt({activity:t,index:n,spec:r}){const s=u.useRef(null),i=u.useMemo(()=>new _e(vt(r),220,r.width*.011,5,!0),[r]);return x(({clock:a},c)=>{if(!s.current)return;const o=W(t);s.current.rotation.y+=c*r.speed*.72*o,s.current.rotation.z+=c*r.speed*.18*o;const l=s.current.material;l.color.copy(n%2===0?S:V),l.opacity=(.32+r.opacity*.58)*(.82+Math.sin(a.elapsedTime*(.95+n*.14)+r.seed)*.18)*C(t)}),e.jsx("group",{rotation:r.tilt,children:e.jsx("mesh",{ref:s,geometry:i,children:e.jsx("meshBasicMaterial",{blending:v,color:S,depthWrite:!1,opacity:.74,toneMapped:!1,transparent:!0})})})}function bt({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>{const o=[];return z.forEach((l,m)=>{for(let f=0;f<l.packets;f+=1)o.push({orbit:m,phase:((f+1)/(l.packets+1)+l.seed*.013)%1,speed:Math.abs(l.speed)*(.72+f*.16),size:.045+(f+m)%3*.018,offset:(f-l.packets*.5)*.012})}),o},[]),s=u.useMemo(()=>{const o=new I;return o.setAttribute("position",new A(new Float32Array(r.length*3),3)),o.setAttribute("aSize",new A(new Float32Array(r.map(l=>l.size)),1)),o},[r]),i=u.useMemo(()=>z.map(o=>new Je().makeRotationFromEuler(new Ge(...o.tilt))),[]),a=u.useMemo(()=>new j,[]);x(({clock:o})=>{if(!n.current)return;const l=s.getAttribute("position"),m=W(t);r.forEach((f,d)=>{const p=z[f.orbit],g=(f.phase+o.elapsedTime*f.speed*m)%1*Math.PI*2;a.set(Math.cos(g)*p.radiusX,Math.sin(g*3+p.seed)*.025+f.offset,Math.sin(g)*p.radiusZ),a.applyMatrix4(i[f.orbit]),l.setXYZ(d,a.x,a.y,a.z)}),l.needsUpdate=!0});const c=u.useMemo(()=>({uniforms:{uColor:{value:S}},vertexShader:`
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
      `}),[]);return e.jsx("points",{ref:n,geometry:s,children:e.jsx("shaderMaterial",{args:[c],blending:v,depthWrite:!1,toneMapped:!1,transparent:!0})})}function wt({activity:t}){const n=u.useRef(null);return x(({clock:r})=>{if(!n.current)return;const s=t==="speaking"?Math.sin(r.elapsedTime*6.8)*.018:0;n.current.scale.setScalar(1+s)}),e.jsxs("group",{ref:n,children:[[z[1],z[3],z[5],z[7]].map((r,s)=>e.jsx(jt,{activity:t,index:s,spec:r},`major-${r.seed}`)),z.map((r,s)=>e.jsx(Mt,{activity:t,index:s,spec:r},r.seed)),e.jsx(bt,{activity:t})]})}function St({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(()=>{const a=$(91822),c=760,o=new Float32Array(c*3),l=new Float32Array(c),m=new Float32Array(c);for(let d=0;d<c;d+=1){const p=a()*Math.PI*2,h=.52+Math.pow(a(),1.8)*.92;o[d*3]=Math.cos(p)*h,o[d*3+1]=(a()-.5)*.055,o[d*3+2]=Math.sin(p)*h*(.78+a()*.18),l[d]=p+a()*3,m[d]=1.2+a()*3.8}const f=new I;return f.setAttribute("position",new A(o,3)),f.setAttribute("aPhase",new A(l,1)),f.setAttribute("aSize",new A(m,1)),f},[]),i=u.useMemo(()=>({uniforms:{uTime:{value:0},uEnergy:{value:1},uColor:{value:S}},vertexShader:`
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
      `}),[]);return x(({clock:a},c)=>{r.current&&(r.current.uniforms.uTime.value=a.elapsedTime,r.current.uniforms.uEnergy.value=C(t),r.current.uniforms.uColor.value.copy(S)),n.current&&(n.current.rotation.x=.58+Math.sin(a.elapsedTime*.12)*.035,n.current.rotation.y+=c*.08*W(t),n.current.rotation.z=-.18)}),e.jsx("points",{ref:n,geometry:s,children:e.jsx("shaderMaterial",{ref:r,args:[i],blending:v,depthWrite:!1,toneMapped:!1,transparent:!0})})}function Et(){const t=$(55123);return Array.from({length:14},(n,r)=>{const s=r/14*Math.PI*2+t()*.32,i=new Ge(t()*1.4,t()*1.1,t()*1.2),a=Array.from({length:6},(c,o)=>{const l=o/5,m=.28+l*(1.76+t()*.38),f=s+Math.sin(l*Math.PI*2+r)*.28;return new j(Math.cos(f)*m,Math.sin(l*Math.PI*1.5+r)*.26,Math.sin(f)*m*(.74+t()*.22)).applyEuler(i)});return new fe(a,!1,"centripetal",.44)})}function Tt({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>Et(),[]),s=u.useMemo(()=>Array.from({length:56},(c,o)=>({curve:o%r.length,phase:o*19%56/56,speed:.08+o%6*.012})),[r.length]),i=u.useMemo(()=>{const c=new I;return c.setAttribute("position",new A(new Float32Array(s.length*3),3)),c},[s.length]),a=u.useMemo(()=>new j,[]);return x(({clock:c})=>{if(!n.current)return;const o=i.getAttribute("position"),l=W(t);s.forEach((m,f)=>{const d=(m.phase+c.elapsedTime*m.speed*l)%1;r[m.curve].getPointAt(d,a);const p=t==="speaking"?1+Math.sin(c.elapsedTime*7+f)*.025:1;o.setXYZ(f,a.x*p,a.y*p,a.z*p)}),o.needsUpdate=!0}),e.jsx("points",{ref:n,geometry:i,children:e.jsx("pointsMaterial",{blending:v,color:pe,depthWrite:!1,opacity:.76,size:.046,sizeAttenuation:!0,toneMapped:!1,transparent:!0})})}function Rt({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>({uniforms:{uEnergy:{value:1},uColor:{value:ae}},vertexShader:`
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
      `}),[]);return x(()=>{n.current&&(n.current.uniforms.uEnergy.value=C(t),n.current.uniforms.uColor.value.copy(ae))}),e.jsxs("mesh",{scale:[1.04,1.04,1.04],children:[e.jsx("sphereGeometry",{args:[2.18,48,48]}),e.jsx("shaderMaterial",{ref:n,args:[r],blending:v,depthWrite:!1,side:Ke,toneMapped:!1,transparent:!0})]})}function Re({activity:t,palette:n="gold"}){return pt(n),e.jsxs("group",{children:[e.jsx(Rt,{activity:t}),e.jsx("group",{scale:n==="violet"?.46:1,children:e.jsx(ft,{activity:t,palette:n})}),e.jsx(Tt,{activity:t}),e.jsx(xt,{activity:t}),e.jsx(St,{activity:t}),e.jsx(yt,{activity:t}),e.jsx(wt,{activity:t})]})}function b(t){return t==="speaking"?1.42:t==="thinking"?1.24:t==="listening"?.78:1}function w(t){return t==="speaking"?1.7:t==="thinking"?1.28:t==="listening"?.62:.86}function X(t,n,r=0){const s=t==="speaking"?8.4:t==="thinking"?4.6:t==="listening"?1.2:1.8,i=t==="speaking"?.12:t==="thinking"?.065:t==="listening"?.025:.038;return 1+Math.sin(n*s+r)*i}function k(t){let n=t>>>0;return()=>(n=n*1664525+1013904223>>>0,n/4294967296)}function Ue(t){const n=new Float32Array(t.length*6);t.forEach(([s,i],a)=>{const c=a*6;n[c]=s.x,n[c+1]=s.y,n[c+2]=s.z,n[c+3]=i.x,n[c+4]=i.y,n[c+5]=i.z});const r=new I;return r.setAttribute("position",new A(n,3)),r}function De(t){const n=[];return t.forEach(r=>{for(let s=1;s<r.length;s+=1)n.push([r[s-1],r[s]])}),Ue(n)}const U="#dcfbff",Oe="#0757ff",Pt=`
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,zt=`
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vPosition;
  varying vec3 vNormal;

  // 3D Simplex Noise generator
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
    vec3 p = vPosition * 2.4;
    float time = uTime * 0.5;

    // Multi-octave cosmic galaxy swirling noise
    float n1 = snoise(p + vec3(0.0, 0.0, time));
    float n2 = snoise(p * 2.2 - vec3(time * 0.7, 0.0, time * 0.5));
    float n3 = snoise(p * 4.5 + vec3(time * 0.9, -time * 0.6, 0.0));

    float nebula = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
    float density = smoothstep(-0.15, 0.88, nebula);

    // Fresnel rim glow
    float viewAngle = abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
    float fresnel = pow(1.0 - viewAngle, 2.4);

    vec3 colDeep = vec3(0.027, 0.341, 1.0);  // DEEP SPACE #0757ff
    vec3 colBlue = vec3(0.133, 0.722, 1.0);  // COSMIC BLUE #22b8ff
    vec3 colIce  = vec3(0.863, 0.984, 1.0);  // ICE CYAN #dcfbff

    vec3 color = mix(colDeep, colBlue, density);
    color = mix(color, colIce, pow(density, 2.0) * 0.9);

    float alpha = (density * 0.5 + fresnel * 0.4) * uEnergy;
    gl_FragColor = vec4(color * (0.9 + uEnergy * 0.6), alpha);
  }
`,At=`
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Ct=`
  uniform float uTime;
  uniform float uEnergy;
  uniform float uArcActivity;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    // Edge proximity calculation for 12 edges on box UVs
    vec2 edgeDist = abs(vUv - 0.5) * 2.0;
    float edgeFactor = max(edgeDist.x, edgeDist.y);
    float lineEdge = smoothstep(0.86, 0.98, edgeFactor);

    // High frequency electric arc flickering
    float noise = hash(vUv * 120.0 + floor(uTime * 30.0));
    float electricArc = step(0.65, noise) * lineEdge * uArcActivity;

    // Rim inner glow
    float viewAngle = abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
    float rimGlow = pow(1.0 - viewAngle, 2.8) * (0.35 + uEnergy * 0.55);

    vec3 iceColor = vec3(0.863, 0.984, 1.0);
    vec3 blueColor = vec3(0.133, 0.722, 1.0);

    vec3 finalColor = mix(blueColor, iceColor, electricArc + rimGlow);
    float finalAlpha = (rimGlow * 0.55 + electricArc * 0.9);

    gl_FragColor = vec4(finalColor * 1.8, finalAlpha);
  }
`,It=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,kt=`
  uniform float uTime;
  uniform float uEnergy;
  varying vec2 vUv;

  void main() {
    vec2 st = vUv;
    float zScroll = st.y * 14.0 - uTime * 2.8;
    float spiral = st.x * 28.0 + st.y * 10.0 + uTime * 2.0;

    float grid = abs(sin(spiral) * sin(zScroll));
    float lines = smoothstep(0.72, 0.96, grid);
    float depthFade = smoothstep(0.0, 0.35, st.y) * (1.0 - smoothstep(0.75, 1.0, st.y));

    vec3 ice = vec3(0.863, 0.984, 1.0);
    vec3 deep = vec3(0.027, 0.341, 1.0);
    vec3 color = mix(deep, ice, lines * 0.85);

    gl_FragColor = vec4(color * (0.8 + uEnergy * 0.5), lines * depthFade * 0.42 * uEnergy);
  }
`;function Gt({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=t==="speaking"||t==="thinking";return x(({clock:i},a)=>{const c=i.elapsedTime,o=w(t);r.current&&(r.current.rotation.y+=a*.16*o,r.current.rotation.x=Math.sin(c*.3)*.12),n.current&&(n.current.uniforms.uTime.value=c,n.current.uniforms.uEnergy.value=b(t),n.current.uniforms.uArcActivity.value=s?t==="speaking"?1.5:1.1:.35)}),e.jsxs("group",{children:[e.jsxs("mesh",{ref:r,children:[e.jsx("boxGeometry",{args:[2,2,2]}),e.jsx("meshPhysicalMaterial",{color:"#ffffff",transmission:.88,roughness:.08,metalness:.1,clearcoat:1,clearcoatRoughness:.04,ior:1.55,transparent:!0,opacity:.94,reflectivity:.95})]}),e.jsxs("mesh",{scale:.98,children:[e.jsx("boxGeometry",{args:[1.98,1.98,1.98]}),e.jsx("shaderMaterial",{ref:n,vertexShader:At,fragmentShader:Ct,uniforms:{uTime:{value:0},uEnergy:{value:1},uArcActivity:{value:.35}},blending:v,depthWrite:!1,side:_,transparent:!0})]})]})}function _t({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null);return x(({clock:i},a)=>{const c=i.elapsedTime,o=w(t),l=b(t);if(n.current&&(n.current.uniforms.uTime.value=c,n.current.uniforms.uEnergy.value=l),r.current){r.current.rotation.x+=a*1*o,r.current.rotation.y+=a*1.4*o;const m=.88+Math.sin(c*6.5)*.06+l*.14;r.current.scale.setScalar(m)}s.current&&(s.current.rotation.z+=a*.45*o,s.current.scale.setScalar(1+Math.sin(c*8)*.1*l))}),e.jsxs("group",{children:[e.jsxs("mesh",{scale:.92,children:[e.jsx("boxGeometry",{args:[1.78,1.78,1.78,16,16,16]}),e.jsx("shaderMaterial",{ref:n,vertexShader:Pt,fragmentShader:zt,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:v,depthWrite:!1,side:_,transparent:!0})]}),e.jsxs("mesh",{ref:r,children:[e.jsx("octahedronGeometry",{args:[.2,0]}),e.jsx("meshBasicMaterial",{color:U,toneMapped:!1})]}),e.jsx("group",{ref:s,children:[0,Math.PI/3,2*Math.PI/3].map((i,a)=>e.jsxs("mesh",{rotation:[0,0,i],children:[e.jsx("planeGeometry",{args:[.08,1.95]}),e.jsx("meshBasicMaterial",{color:U,blending:v,depthWrite:!1,opacity:.5,transparent:!0,toneMapped:!1})]},a))}),e.jsx("pointLight",{color:U,intensity:4.5,distance:6,position:[0,0,0]})]})}function Ft({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(()=>new q,[]),{geometry:i,vertices:a,edges:c}=u.useMemo(()=>{const l=[];for(let p=0;p<16;p+=1)l.push([p&1?1:-1,p&2?1:-1,p&4?1:-1,p&8?1:-1]);const m=[];for(let p=0;p<l.length;p+=1)for(let h=0;h<4;h+=1){const g=p^1<<h;p<g&&m.push([p,g])}const f=new Float32Array(m.length*6),d=new I;return d.setAttribute("position",new A(f,3)),{geometry:d,vertices:l,edges:m}},[]),o=u.useMemo(()=>new Float32Array(48),[]);return x(({clock:l},m)=>{const f=l.elapsedTime,d=w(t),p=b(t),h=i.attributes.position,g=h.array,y=f*.38*d,M=f*.28*d,N=f*.2*d,ve=Math.cos(y),xe=Math.sin(y),ye=Math.cos(M),Me=Math.sin(M),je=Math.cos(N),be=Math.sin(N);a.forEach(([L,B,K,E],Y)=>{let Ne=L*ve-E*xe,G=L*xe+E*ve,Ye=B*ye-G*Me;G=B*Me+G*ye;let Ze=K*je-G*be;G=K*be+G*je;const ne=1.75/(2.65-G*.38),we=Ne*ne,Se=Ye*ne,Ee=Ze*ne;if(o[Y*3]=we,o[Y*3+1]=Se,o[Y*3+2]=Ee,r.current){s.position.set(we,Se,Ee);const He=(.05+Math.sin(f*8.5+Y)*.018)*p;s.scale.setScalar(He),s.updateMatrix(),r.current.setMatrixAt(Y,s.matrix)}}),c.forEach(([L,B],K)=>{const E=K*6;g[E]=o[L*3],g[E+1]=o[L*3+1],g[E+2]=o[L*3+2],g[E+3]=o[B*3],g[E+4]=o[B*3+1],g[E+5]=o[B*3+2]}),h.needsUpdate=!0,r.current&&(r.current.instanceMatrix.needsUpdate=!0),n.current&&(n.current.rotation.y+=m*.12*d,n.current.scale.setScalar(X(t,f)))}),e.jsxs("group",{rotation:[.2,-.3,.08],children:[e.jsx("lineSegments",{ref:n,geometry:i,children:e.jsx("lineBasicMaterial",{color:U,blending:v,depthWrite:!1,opacity:.92,toneMapped:!1,transparent:!0})}),e.jsx("lineSegments",{geometry:i,scale:1.12,children:e.jsx("lineBasicMaterial",{color:Oe,blending:v,depthWrite:!1,opacity:.4,toneMapped:!1,transparent:!0})}),e.jsxs("instancedMesh",{ref:r,args:[void 0,void 0,16],children:[e.jsx("sphereGeometry",{args:[1,12,12]}),e.jsx("meshBasicMaterial",{color:U,toneMapped:!1})]})]})}function Wt({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=1200,{positions:i,initialAngles:a,initialRadii:c,speeds:o}=u.useMemo(()=>{const l=k(1088),m=new Float32Array(s*3),f=new Float32Array(s),d=new Float32Array(s),p=new Float32Array(s);for(let h=0;h<s;h++){const g=l()*Math.PI*2,y=.5+l()*4.2,M=-7+l()*9;m[h*3]=Math.cos(g)*y,m[h*3+1]=Math.sin(g)*y,m[h*3+2]=M,f[h]=g,d[h]=y,p[h]=.4+l()*1.4}return{positions:m,initialAngles:f,initialRadii:d,speeds:p}},[]);return x(({clock:l},m)=>{const f=l.elapsedTime,d=w(t);if(n.current&&(n.current.uniforms.uTime.value=f,n.current.uniforms.uEnergy.value=b(t)),r.current){const p=r.current.geometry.attributes.position,h=p.array;for(let g=0;g<s;g++){a[g]+=m*o[g]*.9*d;const y=a[g];let M=h[g*3+2]+m*o[g]*2.5*d;M>2&&(M=-7);const N=c[g]*(1+(M+7)*.15);h[g*3]=Math.cos(y)*N,h[g*3+1]=Math.sin(y)*N,h[g*3+2]=M}p.needsUpdate=!0}}),e.jsxs("group",{position:[0,0,-2.5],children:[e.jsxs("mesh",{rotation:[Math.PI/2,0,0],children:[e.jsx("cylinderGeometry",{args:[.6,5.2,11,32,32,!0]}),e.jsx("shaderMaterial",{ref:n,vertexShader:It,fragmentShader:kt,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:v,depthWrite:!1,side:_,transparent:!0})]}),e.jsxs("points",{ref:r,children:[e.jsx("bufferGeometry",{children:e.jsx("bufferAttribute",{attach:"attributes-position",args:[i,3]})}),e.jsx("pointsMaterial",{color:U,blending:v,depthWrite:!1,opacity:.7,size:.035,sizeAttenuation:!0,toneMapped:!1,transparent:!0})]})]})}function Lt({activity:t="idle"}){return e.jsxs("group",{name:"mcu-tesseract-space-scene",scale:1.25,children:[e.jsx("ambientLight",{intensity:.6,color:Oe}),e.jsx(Wt,{activity:t}),e.jsx(Ft,{activity:t}),e.jsx(_t,{activity:t}),e.jsx(Gt,{activity:t})]})}const ie="#ff203c",Ve="#ff4b56",Bt="#ffc35a",Ut=`
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
`,Dt=`
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
`,Ot=`
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
`;function Vt({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),i=u.useMemo(()=>[{base:[-.65,.25,-.1],scale:[.55,.42,.45],phase:.3},{base:[.6,-.15,.05],scale:[.45,.6,.42],phase:1.5},{base:[.1,.7,-.15],scale:[.38,.5,.35],phase:2.7},{base:[-.15,-.72,-.1],scale:[.42,.48,.38],phase:4.1}],[]);return x(({clock:a},c)=>{const o=a.elapsedTime,l=w(t),m=b(t);n.current&&(n.current.rotation.y+=c*.15*l,n.current.rotation.z=Math.sin(o*.2)*.1,n.current.scale.setScalar(X(t,o,.8))),r.current&&(r.current.uniforms.uTime.value=o,r.current.uniforms.uEnergy.value=m),s.current&&s.current.children.forEach((f,d)=>{const p=i[d];if(!p)return;f.position.set(p.base[0]+Math.sin(o*.8*l+p.phase)*.12,p.base[1]+Math.cos(o*.65*l+p.phase)*.1,p.base[2]+Math.sin(o*.5*l+p.phase)*.14);const h=1+Math.sin(o*3+p.phase)*.1*m;f.scale.set(p.scale[0]*h,p.scale[1]/h,p.scale[2]*h)})}),e.jsxs("group",{position:[0,0,0],children:[e.jsxs("mesh",{ref:n,children:[e.jsx("icosahedronGeometry",{args:[.82,32]}),e.jsx("shaderMaterial",{ref:r,vertexShader:Ut,fragmentShader:Dt,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:v,depthWrite:!1,transparent:!0})]}),e.jsx("group",{ref:s,children:i.map((a,c)=>e.jsxs("mesh",{position:a.base,scale:a.scale,children:[e.jsx("icosahedronGeometry",{args:[1,16]}),e.jsx("meshStandardMaterial",{color:"#3a0009",emissive:c%2===0?ie:Ve,emissiveIntensity:1.8,metalness:.1,roughness:.3,transparent:!0,opacity:.82})]},c))}),e.jsx("pointLight",{color:ie,intensity:3.5,distance:5,decay:2})]})}function Xt({activity:t}){const n=u.useRef(null);return x(({clock:r})=>{n.current&&(n.current.uniforms.uTime.value=r.elapsedTime,n.current.uniforms.uEnergy.value=b(t))}),e.jsxs("mesh",{position:[0,0,-1.6],scale:[5.8,4.4,1],children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("shaderMaterial",{ref:n,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:Ot,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:v,depthWrite:!1,transparent:!0})]})}function Nt({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(()=>new q,[]),i=22,a=u.useMemo(()=>{const c=k(2026);return Array.from({length:i},(o,l)=>({angle:l/i*Math.PI*2,radius:2.1+(c()-.5)*.35,height:.7+c()*.5,z:-.6+(c()-.5)*.6,tilt:(c()-.5)*.3,phase:c()*Math.PI*2}))},[]);return x(({clock:c})=>{if(!n.current||!r.current)return;const o=c.elapsedTime,l=w(t);a.forEach((m,f)=>{var y,M;const d=m.angle+o*.03*l,p=Math.sin(o*.8+m.phase)*.08,h=Math.cos(d)*m.radius,g=Math.sin(d)*m.radius*.65+p;s.position.set(h,g,m.z),s.rotation.set(m.tilt,-.2,d+Math.PI/2),s.scale.set(.18,m.height,.12),s.updateMatrix(),(y=n.current)==null||y.setMatrixAt(f,s.matrix),s.position.set(h*1.004,g*1.004,m.z+.07),s.rotation.set(0,0,d+Math.PI/2),s.scale.set(.11,.04,.015),s.updateMatrix(),(M=r.current)==null||M.setMatrixAt(f,s.matrix)}),n.current.instanceMatrix.needsUpdate=!0,r.current.instanceMatrix.needsUpdate=!0}),e.jsxs("group",{rotation:[.15,-.06,.08],children:[e.jsxs("instancedMesh",{ref:n,args:[void 0,void 0,i],children:[e.jsx("boxGeometry",{args:[1,1,1]}),e.jsx("meshStandardMaterial",{color:"#1a0408",emissive:"#4a050d",emissiveIntensity:.6,metalness:.2,roughness:.8})]}),e.jsxs("instancedMesh",{ref:r,args:[void 0,void 0,i],children:[e.jsx("boxGeometry",{args:[1,1,1]}),e.jsx("meshBasicMaterial",{color:Bt,blending:v,depthWrite:!1,toneMapped:!1})]})]})}function Yt({activity:t}){const n=u.useRef(null),r=600,{positions:s,velocities:i}=u.useMemo(()=>{const a=k(8812),c=new Float32Array(r*3),o=new Float32Array(r*3);for(let l=0;l<r;l++)c[l*3]=(a()-.5)*5.5,c[l*3+1]=(a()-.5)*4.5,c[l*3+2]=(a()-.5)*3.5-.3,o[l*3]=(a()-.5)*.4,o[l*3+1]=.3+a()*.8,o[l*3+2]=(a()-.5)*.4;return{positions:c,velocities:o}},[]);return x((a,c)=>{if(!n.current)return;const o=n.current.geometry.attributes.position,l=o.array,m=w(t);for(let f=0;f<r;f++)l[f*3]+=i[f*3]*c*m,l[f*3+1]+=i[f*3+1]*c*m,l[f*3+2]+=i[f*3+2]*c*m,l[f*3+1]>2.5&&(l[f*3+1]=-2.5);o.needsUpdate=!0}),e.jsxs("points",{ref:n,children:[e.jsx("bufferGeometry",{children:e.jsx("bufferAttribute",{attach:"attributes-position",args:[s,3]})}),e.jsx("pointsMaterial",{color:Ve,blending:v,depthWrite:!1,opacity:.65,size:.035,sizeAttenuation:!0,toneMapped:!1,transparent:!0})]})}function Zt({activity:t="idle"}){return e.jsxs("group",{name:"reality-aether-forge-mcu",scale:1.25,children:[e.jsx("ambientLight",{intensity:.5,color:ie}),e.jsx(Xt,{activity:t}),e.jsx(Yt,{activity:t}),e.jsx(Nt,{activity:t}),e.jsx(Vt,{activity:t})]})}const Z="#23e777",J="#66ff9f",Ht="#e0ffea",D="#8c6721",Pe=`
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,ze=`
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
`,qt=`
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
`;function oe(t,n,r){const s=new ee,i=t*.14,a=Math.PI*2/n;for(let m=0;m<n;m++){const f=m*a,d=f,p=f+a*.28,h=f+a*.52,g=f+a*.78,y=t,M=t+i;m===0?s.moveTo(Math.cos(d)*y,Math.sin(d)*y):s.lineTo(Math.cos(d)*y,Math.sin(d)*y),s.lineTo(Math.cos(p)*M,Math.sin(p)*M),s.lineTo(Math.cos(h)*M,Math.sin(h)*M),s.lineTo(Math.cos(g)*y,Math.sin(g)*y)}const c=new Qe,o=t*.65;for(let m=0;m<=32;m++){const f=m/32*Math.PI*2,d=Math.cos(f)*o,p=Math.sin(f)*o;m===0?c.moveTo(d,p):c.lineTo(d,p)}s.holes.push(c);const l={depth:r,bevelEnabled:!0,bevelSegments:2,steps:1,bevelSize:.015,bevelThickness:.015};return new O(s,l)}function $t({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),i=u.useRef(0),a=8,c=u.useMemo(()=>{const o=new ee;o.moveTo(0,0),o.quadraticCurveTo(.6,.25,1.1,.05),o.lineTo(1.2,.45),o.quadraticCurveTo(.6,.75,0,.55),o.closePath();const l={depth:.04,bevelEnabled:!0,bevelSize:.01,bevelThickness:.01};return new O(o,l)},[]);return x(({clock:o},l)=>{const m=o.elapsedTime,f=w(t),d=t==="speaking"||t==="thinking"?.88:t==="listening"?.45:.18;if(i.current=T.lerp(i.current,d,.08),n.current&&(n.current.scale.set(X(t,m),t==="listening"?.92:1,1),n.current.rotation.y=Math.sin(m*.25)*.12),r.current&&r.current.children.forEach((p,h)=>{const g=h*Math.PI*2/a,y=i.current*.48,M=i.current*.55;p.position.x=Math.cos(g)*y,p.position.y=Math.sin(g)*y,p.rotation.z=g+M}),s.current){s.current.rotation.y+=l*1.4*f,s.current.rotation.x=Math.sin(m*.8)*.3;const p=.85+b(t)*.18+Math.sin(m*7)*.05;s.current.scale.setScalar(p)}}),e.jsxs("group",{ref:n,children:[e.jsxs("mesh",{position:[0,0,-.05],children:[e.jsx("torusGeometry",{args:[1.35,.08,16,48]}),e.jsx("meshStandardMaterial",{color:D,metalness:.88,roughness:.25,emissive:Z,emissiveIntensity:.15})]}),e.jsx("group",{ref:r,position:[0,0,.02],children:Array.from({length:a},(o,l)=>e.jsx("mesh",{geometry:c,children:e.jsx("meshStandardMaterial",{color:D,metalness:.85,roughness:.22,emissive:Z,emissiveIntensity:.12})},l))}),e.jsxs("mesh",{ref:s,position:[0,0,.18],children:[e.jsx("octahedronGeometry",{args:[.26,1]}),e.jsx("meshStandardMaterial",{color:"#0a8f45",emissive:Z,emissiveIntensity:2.8,metalness:.2,roughness:.05,toneMapped:!1})]}),e.jsx("pointLight",{position:[0,0,.22],color:Z,intensity:4.5,distance:5.5,decay:2})]})}function Kt({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),i=t==="thinking";return x(({clock:a})=>{const c=a.elapsedTime,o=b(t),l=i?-1:1;n.current&&(n.current.uniforms.uTime.value=c,n.current.uniforms.uEnergy.value=o,n.current.uniforms.uDirection.value=l),r.current&&(r.current.uniforms.uTime.value=c*.8,r.current.uniforms.uEnergy.value=o*.9,r.current.uniforms.uDirection.value=-l),s.current&&(s.current.rotation.z=Math.sin(c*.15)*.08)}),e.jsxs("group",{ref:s,children:[e.jsxs("mesh",{position:[0,0,-.12],scale:[3.4,3.4,1],children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("shaderMaterial",{ref:n,vertexShader:Pe,fragmentShader:ze,uniforms:{uTime:{value:0},uEnergy:{value:1},uDirection:{value:1}},blending:v,depthWrite:!1,transparent:!0})]}),e.jsxs("mesh",{position:[0,0,-.28],scale:[4.8,4.8,1],children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("shaderMaterial",{ref:r,vertexShader:Pe,fragmentShader:ze,uniforms:{uTime:{value:0},uEnergy:{value:1},uDirection:{value:-1}},blending:v,depthWrite:!1,transparent:!0})]})]})}function Jt({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),i=u.useMemo(()=>oe(1.05,12,.08),[]),a=u.useMemo(()=>oe(1.55,18,.08),[]),c=u.useMemo(()=>oe(2.1,24,.08),[]);return x((o,l)=>{const m=w(t),f=t==="thinking"?-1:1;n.current&&(n.current.rotation.z+=l*.35*m*f),r.current&&(r.current.rotation.z-=l*.22*m*f),s.current&&(s.current.rotation.z+=l*.14*m*f)}),e.jsxs("group",{position:[0,0,-.35],children:[e.jsx("mesh",{ref:n,geometry:i,position:[0,0,0],children:e.jsx("meshStandardMaterial",{color:D,metalness:.82,roughness:.28,emissive:J,emissiveIntensity:.25})}),e.jsx("mesh",{ref:r,geometry:a,position:[0,0,-.06],children:e.jsx("meshStandardMaterial",{color:D,metalness:.85,roughness:.25,emissive:Z,emissiveIntensity:.2})}),e.jsx("mesh",{ref:s,geometry:c,position:[0,0,-.12],children:e.jsx("meshStandardMaterial",{color:D,metalness:.88,roughness:.22,emissive:J,emissiveIntensity:.18})})]})}function Qt({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=48,i=u.useMemo(()=>new q,[]),a=u.useMemo(()=>{const o=[],l=k(452);for(let m=0;m<6;m++){const f=m%2===0?1:-1,d=[];for(let p=0;p<=5;p++){const h=p/5;d.push(new j(f*(.4+h*2.2+l()*.2),(m-2.5)*.45+Math.sin(h*Math.PI*1.5+m)*.4,-.3-h*.8+Math.cos(h*Math.PI)*.3))}o.push(new fe(d))}return o},[]),c=u.useMemo(()=>a.map(o=>new _e(o,40,.018,8,!1)),[a]);return x(({clock:o})=>{const l=o.elapsedTime,m=w(t);n.current&&(n.current.position.z=Math.sin(l*.4)*.06),r.current&&(a.forEach((f,d)=>{var p;for(let h=0;h<8;h++){const g=d*8+h,y=(l*.25*m+h/8+d*.15)%1,M=f.getPoint(y);i.position.copy(M),i.scale.setScalar(.038+Math.sin(y*Math.PI)*.02),i.updateMatrix(),(p=r.current)==null||p.setMatrixAt(g,i.matrix)}}),r.current.instanceMatrix.needsUpdate=!0)}),e.jsxs("group",{ref:n,children:[c.map((o,l)=>e.jsx("mesh",{geometry:o,children:e.jsx("meshBasicMaterial",{color:J,blending:v,depthWrite:!1,opacity:.48,transparent:!0,toneMapped:!1})},l)),e.jsxs("instancedMesh",{ref:r,args:[void 0,void 0,s],children:[e.jsx("sphereGeometry",{args:[1,8,8]}),e.jsx("meshBasicMaterial",{color:Ht,toneMapped:!1})]})]})}function en({activity:t}){const n=u.useRef(null),r=t==="thinking";return x(({clock:s})=>{n.current&&(n.current.uniforms.uTime.value=s.elapsedTime,n.current.uniforms.uEnergy.value=b(t),n.current.uniforms.uReversing.value=r?1:0)}),e.jsxs("mesh",{position:[0,0,-.08],scale:[4.2,4.2,1],children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("shaderMaterial",{ref:n,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:qt,uniforms:{uTime:{value:0},uEnergy:{value:1},uReversing:{value:0}},blending:v,depthWrite:!1,transparent:!0})]})}function tn({activity:t="idle"}){return e.jsxs("group",{name:"agamotto-temporal-eye-scene",scale:1.25,children:[e.jsx("ambientLight",{intensity:.5,color:D}),e.jsx("directionalLight",{position:[4,4,4],intensity:1.8,color:J}),e.jsx(en,{activity:t}),e.jsx(Kt,{activity:t}),e.jsx(Qt,{activity:t}),e.jsx(Jt,{activity:t}),e.jsx($t,{activity:t})]})}const P="#ff183b",ce="#ff5870",H="#ffffff";function Ae(t=1){const n=new ee;return n.moveTo(.14*t,1.42),n.quadraticCurveTo(1.18*t,1.08,1.38*t,-1.28),n.quadraticCurveTo(.52*t,-.88,.14*t,1.42),n.closePath(),n}function nn({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),i=u.useMemo(()=>Ae(-1),[]),a=u.useMemo(()=>Ae(1),[]),c=u.useMemo(()=>new Te(i,24),[i]),o=u.useMemo(()=>new Te(a,24),[a]),l=u.useMemo(()=>({depth:.16,bevelEnabled:!0,bevelSize:.04,bevelThickness:.04,bevelSegments:3}),[]),m=u.useMemo(()=>new O(i,l),[i,l]),f=u.useMemo(()=>new O(a,l),[a,l]);return x(({clock:d})=>{const p=d.elapsedTime;n.current&&n.current.scale.setScalar(X(t,p,.4));const h=t==="listening"?.75:t==="thinking"?.92:t==="speaking"?1.08:.96;r.current&&(r.current.scale.y=h+Math.sin(p*2.5)*.035),s.current&&(s.current.scale.y=h+Math.cos(p*2.5)*.035)}),e.jsxs("group",{ref:n,position:[0,.15,.55],children:[e.jsx("mesh",{position:[-.92,0,.02],scale:[1.18,1.18,1],geometry:m,children:e.jsx("meshStandardMaterial",{color:"#3a0009",emissive:P,emissiveIntensity:1.2,metalness:.92,roughness:.18})}),e.jsx("mesh",{position:[.92,0,.02],scale:[1.18,1.18,1],geometry:f,children:e.jsx("meshStandardMaterial",{color:"#3a0009",emissive:P,emissiveIntensity:1.2,metalness:.92,roughness:.18})}),e.jsx("mesh",{ref:r,position:[-.92,0,.14],geometry:c,children:e.jsx("meshBasicMaterial",{color:H,toneMapped:!1})}),e.jsx("mesh",{ref:s,position:[.92,0,.14],geometry:o,children:e.jsx("meshBasicMaterial",{color:H,toneMapped:!1})}),e.jsx("mesh",{position:[-.92,0,.16],scale:[1.04,1.04,1],geometry:c,children:e.jsx("meshBasicMaterial",{color:ce,blending:v,depthWrite:!1,opacity:.4,toneMapped:!1,transparent:!0})}),e.jsx("mesh",{position:[.92,0,.16],scale:[1.04,1.04,1],geometry:o,children:e.jsx("meshBasicMaterial",{color:ce,blending:v,depthWrite:!1,opacity:.4,toneMapped:!1,transparent:!0})}),e.jsx("pointLight",{color:H,intensity:4,distance:5.5,position:[0,0,.8]}),e.jsx("pointLight",{color:P,intensity:3,distance:4.5,position:[0,0,.4]})]})}function rn({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>Array.from({length:8},(s,i)=>{const a=i<4?-1:1,c=i%4;return{side:a,lane:c}}),[]);return x(({clock:s})=>{if(!n.current)return;const i=s.elapsedTime,a=w(t);n.current.rotation.z=Math.sin(i*.8*a)*.04,n.current.scale.setScalar(.98+b(t)*.07)}),e.jsx("group",{ref:n,position:[0,0,-.2],children:r.map((s,i)=>{const{side:a,lane:c}=s,o=a*(.8+c*.1),l=.6-c*.35,m=a*(1.8+c*.22),f=1.2-c*.48,d=a*(2.8+c*.32),p=.6-c*.68,h=a*(3.6+c*.28),g=.1-c*.82;return e.jsxs("group",{children:[e.jsxs("mesh",{position:[(o+m)/2,(l+f)/2,-.2],children:[e.jsx("boxGeometry",{args:[Math.abs(m-o),.12,.12]}),e.jsx("meshStandardMaterial",{color:"#2a040b",emissive:P,emissiveIntensity:.8,metalness:.9,roughness:.2})]}),e.jsxs("mesh",{position:[m,f,-.2],children:[e.jsx("sphereGeometry",{args:[.1,16,16]}),e.jsx("meshBasicMaterial",{color:H,toneMapped:!1})]}),e.jsxs("mesh",{position:[(m+d)/2,(f+p)/2,-.3],children:[e.jsx("boxGeometry",{args:[Math.abs(d-m),.09,.09]}),e.jsx("meshStandardMaterial",{color:"#2a040b",emissive:ce,emissiveIntensity:.7,metalness:.92,roughness:.18})]}),e.jsxs("mesh",{position:[d,p,-.3],children:[e.jsx("sphereGeometry",{args:[.08,16,16]}),e.jsx("meshBasicMaterial",{color:P,toneMapped:!1})]}),e.jsxs("mesh",{position:[(d+h)/2,(p+g)/2,-.4],children:[e.jsx("boxGeometry",{args:[Math.abs(h-d),.06,.06]}),e.jsx("meshStandardMaterial",{color:"#120004",emissive:P,emissiveIntensity:1,metalness:.95,roughness:.12})]})]},i)})})}function sn({activity:t}){const n=u.useRef(null),r=u.useRef(null),{points:s}=u.useMemo(()=>{const i=k(2099),a=[];for(let c=0;c<72;c++)a.push(new j((i()-.5)*6.5,(i()-.5)*5,-.8-i()*1.8));return{points:a}},[]);return x(({clock:i})=>{const a=i.elapsedTime;n.current&&(n.current.rotation.y=Math.sin(a*.18)*.08),r.current&&(r.current.uniforms.uTime.value=a,r.current.uniforms.uEnergy.value=b(t))}),e.jsxs("group",{ref:n,children:[[1.6,2.8,4.2].map((i,a)=>e.jsxs("mesh",{position:[0,0,-.5],rotation:[0,0,a*.5],children:[e.jsx("ringGeometry",{args:[i,i+.02,64]}),e.jsx("meshBasicMaterial",{color:P,blending:v,opacity:.4,transparent:!0,toneMapped:!1})]},a)),e.jsxs("points",{children:[e.jsx("bufferGeometry",{children:e.jsx("bufferAttribute",{attach:"attributes-position",args:[new Float32Array(s.flatMap(i=>[i.x,i.y,i.z])),3]})}),e.jsx("pointsMaterial",{color:H,blending:v,opacity:.75,size:.04,sizeAttenuation:!0,transparent:!0,toneMapped:!1})]}),e.jsxs("mesh",{position:[0,-2.1,-.4],rotation:[-Math.PI/2.6,0,0],scale:[7.8,6.8,1],children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("shaderMaterial",{ref:r,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:`
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
          `,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:v,depthWrite:!1,transparent:!0})]})]})}function on({activity:t}){const n=u.useRef(null);return x(({clock:r},s)=>{n.current&&(n.current.rotation.y=Math.sin(r.elapsedTime*.3)*.12,n.current.rotation.z+=s*.015*w(t))}),e.jsxs("group",{position:[0,.05,-.2],children:[e.jsxs("mesh",{scale:[1.6,1.9,.95],children:[e.jsx("dodecahedronGeometry",{args:[1.02,1]}),e.jsx("meshStandardMaterial",{color:"#080204",emissive:"#28000a",emissiveIntensity:.5,metalness:.9,roughness:.2})]}),e.jsxs("mesh",{ref:n,scale:[1.66,1.98,1.02],children:[e.jsx("dodecahedronGeometry",{args:[1.02,1]}),e.jsx("meshBasicMaterial",{color:P,blending:v,depthWrite:!1,opacity:.35,toneMapped:!1,transparent:!0,wireframe:!0})]})]})}function an({activity:t="idle"}){return e.jsxs("group",{name:"iron-spider-tactical-hud-mcu",scale:1.28,children:[e.jsx("ambientLight",{intensity:.6,color:P}),e.jsx(sn,{activity:t}),e.jsx(rn,{activity:t}),e.jsx(on,{activity:t}),e.jsx(nn,{activity:t})]})}const Xe="#8b3dff",le="#e14cff",cn="#eef1ff",ln=`
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,un=`
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
`,mn=`
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
`,fn=`
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
`;function dn({activity:t}){const n=u.useRef(null),r=u.useRef(null);return x(({clock:s},i)=>{const a=s.elapsedTime,c=w(t);n.current&&(n.current.rotation.z+=i*.1*c,n.current.scale.setScalar(X(t,a,1.6))),r.current&&(r.current.uniforms.uTime.value=a,r.current.uniforms.uEnergy.value=b(t))}),e.jsxs("group",{ref:n,children:[e.jsxs("mesh",{position:[0,0,.35],children:[e.jsx("sphereGeometry",{args:[.52,64,64]}),e.jsx("meshBasicMaterial",{color:"#000000",toneMapped:!1})]}),e.jsxs("mesh",{position:[0,0,.25],scale:1.85,children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("shaderMaterial",{ref:r,vertexShader:ln,fragmentShader:un,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:v,depthWrite:!1,transparent:!0})]})]})}function pn({activity:t}){const n=u.useRef(null),r=5e3,{positions:s,seeds:i,armOffsets:a}=u.useMemo(()=>{const c=k(9918),o=new Float32Array(r*3),l=new Float32Array(r),m=new Float32Array(r);for(let f=0;f<r;f++){const d=.55+Math.pow(c(),1.5)*2.5,p=c()*Math.PI*2,h=f%3*(Math.PI*2/3);o[f*3]=Math.cos(p)*d,o[f*3+1]=Math.sin(p)*d,o[f*3+2]=(c()-.5)*(.04+d*.08),l[f]=c(),m[f]=h}return{positions:o,seeds:l,armOffsets:m}},[]);return x(({clock:c})=>{n.current&&(n.current.uniforms.uTime.value=c.elapsedTime,n.current.uniforms.uSpeed.value=w(t),n.current.uniforms.uEnergy.value=b(t))}),e.jsxs("points",{rotation:[1.14,.18,-.28],children:[e.jsxs("bufferGeometry",{children:[e.jsx("bufferAttribute",{attach:"attributes-position",args:[s,3]}),e.jsx("bufferAttribute",{attach:"attributes-aSeed",args:[i,1]}),e.jsx("bufferAttribute",{attach:"attributes-aArmOffset",args:[a,1]})]}),e.jsx("shaderMaterial",{ref:n,vertexShader:mn,fragmentShader:fn,uniforms:{uTime:{value:0},uSpeed:{value:1},uEnergy:{value:1}},blending:v,depthWrite:!1,transparent:!0})]})}function hn({activity:t}){const n=u.useRef(null);return x(({clock:r})=>{if(!n.current)return;const s=r.elapsedTime,i=.9+b(t)*.35+Math.sin(s*6)*.08;n.current.scale.set(1,i,1)}),e.jsxs("group",{ref:n,rotation:[.12,.18,-.28],children:[e.jsxs("mesh",{position:[0,2.4,-.2],children:[e.jsx("coneGeometry",{args:[.14,4.8,32,1,!0]}),e.jsx("meshBasicMaterial",{color:cn,blending:v,depthWrite:!1,opacity:.35,side:_,toneMapped:!1,transparent:!0})]}),e.jsxs("mesh",{position:[0,2.4,-.2],scale:[1.4,1,1.4],children:[e.jsx("coneGeometry",{args:[.14,4.8,32,1,!0]}),e.jsx("meshBasicMaterial",{color:le,blending:v,depthWrite:!1,opacity:.2,side:_,toneMapped:!1,transparent:!0})]}),e.jsxs("mesh",{position:[0,-2.4,-.2],rotation:[0,0,Math.PI],children:[e.jsx("coneGeometry",{args:[.14,4.8,32,1,!0]}),e.jsx("meshBasicMaterial",{color:le,blending:v,depthWrite:!1,opacity:.3,side:_,toneMapped:!1,transparent:!0})]})]})}function gn({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>new q,[]),s=64,i=u.useMemo(()=>{const a=k(1088);return Array.from({length:s},(c,o)=>{const l=o/s*Math.PI*2+a()*.3,m=1.2+a()*2.2;return{angle:l,radius:m,yScale:.14+a()*.42,phase:a()*Math.PI*2,z:-.4+(a()-.5)*2.8}})},[]);return x(({clock:a})=>{if(!n.current)return;const c=a.elapsedTime,o=w(t),l=t==="thinking"?.3+Math.pow(Math.abs(Math.sin(c*.8)),6)*.3:1;i.forEach((m,f)=>{var h;const d=m.angle+c*.045*o*(f%2?1:-1),p=m.radius*l;r.position.set(Math.cos(d)*p,Math.sin(d)*p*.72,m.z+Math.sin(c*.7+m.phase)*.14),r.rotation.set(m.phase+c*.22,d,c*.28+m.phase),r.scale.set(.09,m.yScale,.09),r.updateMatrix(),(h=n.current)==null||h.setMatrixAt(f,r.matrix)}),n.current.instanceMatrix.needsUpdate=!0}),e.jsxs("instancedMesh",{ref:n,args:[void 0,void 0,s],children:[e.jsx("tetrahedronGeometry",{args:[1,0]}),e.jsx("meshPhysicalMaterial",{color:"#7a42ff",emissive:Xe,emissiveIntensity:1,metalness:.1,roughness:.08,transmission:.52,transparent:!0,opacity:.88})]})}function vn({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>{const s=k(818),i=[];for(let a=0;a<18;a+=1){const c=a/18*Math.PI*2,o=[];for(let l=0;l<=42;l+=1){const m=l/42,f=m>.55?(a%3-1)*(m-.55)*.72:0,d=.5+m*(2+s()*.4);o.push(new j(Math.cos(c+f)*d,Math.sin(c+f)*d*.82,-.4-m*.95+Math.sin(m*Math.PI*2+a)*.16))}i.push(o)}return De(i)},[]);return x(({clock:s},i)=>{n.current&&(n.current.rotation.z-=i*.028*w(t),n.current.scale.setScalar(.94+b(t)*.08+Math.sin(s.elapsedTime*.7)*.015))}),e.jsx("group",{ref:n,rotation:[.14,-.2,0],children:e.jsx("lineSegments",{geometry:r,children:e.jsx("lineBasicMaterial",{color:le,blending:v,depthWrite:!1,opacity:.42,toneMapped:!1,transparent:!0})})})}function xn({activity:t="idle"}){return e.jsxs("group",{name:"quantum-power-singularity-mcu",scale:1.28,children:[e.jsx("ambientLight",{intensity:.6,color:Xe}),e.jsx(vn,{activity:t}),e.jsx(gn,{activity:t}),e.jsx(hn,{activity:t}),e.jsx(pn,{activity:t}),e.jsx(dn,{activity:t})]})}const Q="#ff7a18",ge="#ffc55c",ue="#8ef7ff",yn="#17100a";function Ce(t){const n=new ee;for(let r=0;r<3;r+=1){const s=Math.PI/2+r*Math.PI*2/3,i=Math.cos(s)*t,a=Math.sin(s)*t;r===0?n.moveTo(i,a):n.lineTo(i,a)}return n.closePath(),n}function Mn({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),i=u.useMemo(()=>new O(Ce(.85),{depth:.12,bevelEnabled:!0,bevelSize:.04,bevelThickness:.04,bevelSegments:3}),[]),a=u.useMemo(()=>new O(Ce(.52),{depth:.16,bevelEnabled:!0,bevelSize:.03,bevelThickness:.03,bevelSegments:2}),[]);return x(({clock:c},o)=>{const l=c.elapsedTime,m=w(t);n.current&&(n.current.rotation.z=Math.sin(l*.2)*.04,n.current.scale.setScalar(X(t,l))),r.current&&(r.current.rotation.z-=o*.5*m),s.current&&(s.current.uniforms.uTime.value=l,s.current.uniforms.uEnergy.value=b(t))}),e.jsxs("group",{ref:n,rotation:[.02,-.05,0],children:[e.jsx("mesh",{geometry:i,position:[0,0,-.06],children:e.jsx("meshStandardMaterial",{color:yn,emissive:Q,emissiveIntensity:.4,metalness:.94,roughness:.18})}),e.jsx("mesh",{geometry:a,position:[0,0,.05],scale:.96,children:e.jsx("shaderMaterial",{ref:s,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:`
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
          `,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:v,depthWrite:!1,toneMapped:!1,transparent:!0})}),e.jsx("group",{ref:r,position:[0,0,.16],children:Array.from({length:9},(c,o)=>{const l=o*Math.PI*2/9;return e.jsxs("mesh",{position:[Math.cos(l)*.28,Math.sin(l)*.28,0],rotation:[0,0,l],children:[e.jsx("boxGeometry",{args:[.3,.038,.038]}),e.jsx("meshBasicMaterial",{color:o%3===0?ue:ge,toneMapped:!1})]},o)})}),e.jsx("pointLight",{color:Q,intensity:4,distance:5,position:[0,0,.3]}),e.jsx("pointLight",{color:ue,intensity:2.5,distance:3.5,position:[0,0,.4]})]})}function jn({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>new q,[]),s=u.useMemo(()=>{const i=[];for(let a=0;a<3;a+=1){const c=9+a*3;for(let o=0;o<c;o+=1)i.push({angle:o*Math.PI*2/c+a*.18,radius:1.1+a*.35,depth:-.14-a*.18,size:.22+a*.045,phase:o*.47+a})}return i},[]);return x(({clock:i})=>{if(!n.current)return;const a=i.elapsedTime,c=t==="thinking"?.28:t==="speaking"?.15:t==="listening"?-.05:0;s.forEach((o,l)=>{var d;const m=Math.sin(a*1.6+o.phase)*.03,f=o.radius+c+m;r.position.set(Math.cos(o.angle)*f,Math.sin(o.angle)*f*.78,o.depth+Math.sin(a*.8+o.phase)*.08),r.rotation.set(.16*Math.sin(o.phase),-.25,o.angle+Math.PI/2),r.scale.set(o.size*1.45,o.size*.45,.08),r.updateMatrix(),(d=n.current)==null||d.setMatrixAt(l,r.matrix)}),n.current.instanceMatrix.needsUpdate=!0}),e.jsxs("instancedMesh",{ref:n,args:[void 0,void 0,s.length],children:[e.jsx("boxGeometry",{args:[1,1,1]}),e.jsx("meshStandardMaterial",{color:"#140c08",emissive:Q,emissiveIntensity:.4,metalness:.92,roughness:.22})]})}function bn({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(()=>[{position:[-2.2,.75,-.4],rotation:[.08,.48,-.04],scale:[1.15,.7,1]},{position:[2.15,.45,-.24],rotation:[-.04,-.52,.06],scale:[.95,.6,1]},{position:[-1.65,-1.35,-.68],rotation:[-.16,.34,-.14],scale:[.8,.44,1]},{position:[1.58,-1.4,-.5],rotation:[.14,-.4,.12],scale:[.88,.48,1]}],[]);return x(({clock:i})=>{n.current&&(n.current.position.y=Math.sin(i.elapsedTime*.45)*.05,n.current.scale.setScalar(.98+b(t)*.025)),r.current&&(r.current.uniforms.uTime.value=i.elapsedTime,r.current.uniforms.uEnergy.value=b(t))}),e.jsx("group",{ref:n,children:s.map((i,a)=>e.jsxs("mesh",{position:i.position,rotation:i.rotation,scale:i.scale,children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("shaderMaterial",{ref:a===0?r:void 0,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:`
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
            `,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:v,depthWrite:!1,side:_,transparent:!0})]},a))})}function wn({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>{const a=[new j(-1.75,.68,-.2),new j(1.72,.38,-.12),new j(-1.3,-1.08,-.38),new j(1.26,-1.12,-.3)].map((c,o)=>{const l=[];for(let m=0;m<=28;m+=1){const f=m/28;l.push(new j(c.x*f,c.y*f+Math.sin(f*Math.PI)*(o%2?-.24:.24),c.z*f+Math.sin(f*Math.PI*2+o)*.08))}return l});return De(a)},[]),s=u.useMemo(()=>Ue([[new j(0,.85,0),new j(0,2.45,-.45)],[new j(-.08,.78,0),new j(-.56,2.1,-.3)],[new j(.08,.78,0),new j(.6,2.2,-.34)]]),[]);return x(({clock:i})=>{n.current&&(n.current.rotation.z=Math.sin(i.elapsedTime*.16)*.025,n.current.scale.setScalar(.98+b(t)*.025))}),e.jsxs("group",{ref:n,children:[e.jsx("lineSegments",{geometry:r,children:e.jsx("lineBasicMaterial",{color:ge,blending:v,depthWrite:!1,opacity:.65,toneMapped:!1,transparent:!0})}),e.jsx("lineSegments",{geometry:s,children:e.jsx("lineBasicMaterial",{color:ue,blending:v,depthWrite:!1,opacity:.52,toneMapped:!1,transparent:!0})})]})}function Sn({activity:t="idle"}){return e.jsxs("group",{name:"stark-mark-l-arc-reactor",scale:1.25,rotation:[.08,-.18,.025],children:[e.jsx("ambientLight",{color:Q,intensity:.5}),e.jsx("directionalLight",{color:ge,intensity:1.8,position:[2.5,3.2,4]}),e.jsx(bn,{activity:t}),e.jsx(wn,{activity:t}),e.jsx(jn,{activity:t}),e.jsx(Mn,{activity:t})]})}const Ie={gold:"#020100",green:"#000704",blue:"#00040a",red:"#080002",violet:"#02000a",orange:"#080300",spider:"#000408"},En={blue:.9,green:.94,red:.88,violet:.86,orange:.92,spider:.78};function Tn(t){return Ie[t]||Ie.gold}function me(t,n){const r=n.getBoundingClientRect(),s=Math.min(r.width,r.height)*.38;if(s<=0)return!1;const i=(t.clientX-(r.left+r.width/2))/s,a=(t.clientY-(r.top+r.height/2))/(s*.94);return i*i+a*a<=1}function Rn({palette:t}){const{gl:n}=de();return u.useEffect(()=>{const r=Tn(t);n.setClearColor(r,1),n.toneMappingExposure=En[t]??.94},[n,t]),null}function Pn({resetSignal:t=0}){const{camera:n,gl:r,size:s}=de(),i=u.useMemo(()=>new nt(n,r.domElement),[n,r]);return u.useEffect(()=>{i.enableDamping=!0,i.dampingFactor=.075,i.enablePan=!1,i.enableZoom=!1,i.enableRotate=!1,i.rotateSpeed=0,i.zoomSpeed=.48,i.minDistance=5.25,i.maxDistance=s.width/s.height<.72?15:8.6,i.target.set(0,0,0),r.domElement.classList.add("is-orbit-enabled");const a=o=>{const l=!document.body.classList.contains("hud-dragging")&&me(o,r.domElement);i.enableZoom=l,r.domElement.classList.toggle("orb-hit-active",l)},c=()=>{i.enableZoom=!1,r.domElement.classList.remove("orb-hit-active")};return r.domElement.addEventListener("pointermove",a,{passive:!0}),r.domElement.addEventListener("pointerleave",c),r.domElement.addEventListener("wheel",a,{capture:!0,passive:!0}),()=>{r.domElement.classList.remove("is-orbit-enabled"),r.domElement.classList.remove("orb-hit-active"),r.domElement.removeEventListener("pointermove",a),r.domElement.removeEventListener("pointerleave",c),r.domElement.removeEventListener("wheel",a,!0),i.dispose()}},[i,r.domElement,s]),u.useEffect(()=>{const c=s.width/s.height<.72?10.8:6.1;n.position.set(0,0,c),i.target.set(0,0,0),i.update()},[n,i,t,s.height,s.width]),x(()=>i.update()),null}function zn(t){return t instanceof HTMLElement?!!t.closest(".hud-dock, .history-panel, .chat-side-panel, .settings-panel, .activity-hub, .prompt-shell, .draggable-panel, .os-taskbar, .os-minimized-dock, button, input, textarea, select"):!1}function An({resetSignal:t=0,children:n}){const r=u.useRef(null),{pointer:s,size:i,gl:a}=de(),c=u.useRef(!1),o=u.useRef({active:!1,x:0,y:0,targetX:0,targetY:0,lastX:0,lastY:0});return u.useEffect(()=>{const l=d=>{d.button!==0||d.target!==a.domElement||zn(d.target)||document.body.classList.contains("hud-dragging")||!me(d,a.domElement)||(c.current=!0,o.current.active=!0,o.current.lastX=d.clientX,o.current.lastY=d.clientY,document.body.classList.add("is-reactor-dragging"))},m=d=>{if(c.current=d.target===a.domElement&&!document.body.classList.contains("hud-dragging")&&me(d,a.domElement),!o.current.active)return;const p=d.clientX-o.current.lastX,h=d.clientY-o.current.lastY;o.current.lastX=d.clientX,o.current.lastY=d.clientY,o.current.targetY+=p*.0065,o.current.targetX+=h*.0048,o.current.targetX=T.clamp(o.current.targetX,-.9,.9)},f=()=>{o.current.active=!1,document.body.classList.remove("is-reactor-dragging")};return window.addEventListener("pointerdown",l),window.addEventListener("pointermove",m),window.addEventListener("pointerup",f),window.addEventListener("pointercancel",f),()=>{window.removeEventListener("pointerdown",l),window.removeEventListener("pointermove",m),window.removeEventListener("pointerup",f),window.removeEventListener("pointercancel",f),document.body.classList.remove("is-reactor-dragging")}},[a.domElement]),u.useEffect(()=>{o.current.x=0,o.current.y=0,o.current.targetX=0,o.current.targetY=0},[t]),x(({clock:l})=>{const m=i.width/i.height<.72;if(r.current){o.current.x=T.lerp(o.current.x,o.current.targetX,.09),o.current.y=T.lerp(o.current.y,o.current.targetY,.09);const f=m||!c.current||document.body.classList.contains("hud-dragging")?0:.08;r.current.rotation.x=T.lerp(r.current.rotation.x,o.current.x-s.y*f,.045),r.current.rotation.y=T.lerp(r.current.rotation.y,o.current.y+s.x*f,.045),r.current.rotation.z=0}}),e.jsx("group",{ref:r,children:n})}function Cn({activity:t,palette:n}){const r=u.useMemo(()=>{const s=t==="speaking"?1.25:t==="thinking"?1.12:1,i={blue:{intensity:1.32,threshold:.28,smoothing:.52},green:{intensity:1.35,threshold:.26,smoothing:.55},red:{intensity:1.28,threshold:.32,smoothing:.48},violet:{intensity:1.42,threshold:.25,smoothing:.5},orange:{intensity:1.3,threshold:.35,smoothing:.45},spider:{intensity:1.25,threshold:.28,smoothing:.4}},a=i[n]??i.blue;return{...a,intensity:a.intensity*s}},[t,n]);return e.jsx(rt,{multisampling:0,children:e.jsx(st,{intensity:r.intensity,luminanceSmoothing:r.smoothing,luminanceThreshold:r.threshold,mipmapBlur:!0})})}function Gn({activity:t,palette:n,resetSignal:r=0}){const s=et();return e.jsx("div",{className:"orb-webgl","aria-hidden":"true",children:e.jsxs(tt,{camera:{fov:41,near:.1,far:30,position:[0,0,6.1]},dpr:s?1:[1,1.45],frameloop:s?"demand":"always",children:[e.jsx(Rn,{palette:n}),e.jsx(Pn,{resetSignal:r}),e.jsx(An,{resetSignal:r,children:e.jsx(ot,{palette:n,children:i=>i==="gold"?e.jsx(Re,{activity:t,palette:"gold"}):i==="green"?e.jsx(tn,{activity:t}):i==="blue"?e.jsx(Lt,{activity:t}):i==="red"?e.jsx(Zt,{activity:t}):i==="violet"?e.jsx(xn,{activity:t}):i==="orange"?e.jsx(Sn,{activity:t}):i==="spider"?e.jsx(an,{activity:t}):e.jsx(Re,{activity:t,palette:"gold"})})}),e.jsx(Cn,{activity:t,palette:n})]})})}export{Gn as default};
