import{r as u,j as e}from"./index-DRKvBvQ5.js";import{u as x,M as T,C as _,A as v,I as qe,W as $e,V as j,B as I,F as R,U as ke,a as Qe,b as A,E as Ge,c as fe,T as _e,d as Ke,D as U,O as q,S as ee,e as D,P as Je,f as Te,g as et,h as tt,i as de,j as nt,k as rt,w as st}from"./useReducedMotion-DIvIF0W8.js";function ot({palette:t,children:n}){const r=u.useRef(null),[s,o]=u.useState(t),i=u.useRef("idle"),c=u.useRef(1);return u.useEffect(()=>{if(t===s)return;i.current="out";const a=window.setTimeout(()=>{c.current=0,o(t),i.current="in"},150);return()=>window.clearTimeout(a)},[t,s]),x((a,l)=>{i.current==="out"?c.current=T.lerp(c.current,0,l*12):i.current==="in"&&(c.current=T.lerp(c.current,1,l*8),c.current>.95&&(c.current=1,i.current="idle")),r.current&&(r.current.scale.setScalar(c.current),r.current.rotation.y=(1-c.current)*Math.PI*.25)}),e.jsx("group",{ref:r,children:n(s)})}const te=new _("#fff8d6"),Fe=new _("#d65f10"),at={gold:["#fff8d6","#d65f10"],green:["#f5fff6","#18bd58"],violet:["#faf5ff","#7c3aed"],orange:["#fff5de","#ed5f12"]};function it(t){return()=>{let n=t+=1831565813;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}function Le(t){return t==="speaking"?1.52:t==="thinking"?1.28:t==="listening"?.82:1}function Be(t){return t==="speaking"?1.85:t==="thinking"?1.42:t==="listening"?.46:1}const re={uniforms:{uTime:{value:0},uEnergy:{value:1},uOpacity:{value:1},uColor:{value:te}},vertexShader:`
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
  `};function ct(){return{uniforms:ke.clone(re.uniforms),vertexShader:re.vertexShader,fragmentShader:re.fragmentShader}}function lt(){const t=it(60879),n=[],r=[],s=[];for(let i=0;i<42;i+=1){const c=t()*Math.PI*2,a=Math.acos(2*t()-1),l=new j(Math.sin(a)*Math.cos(c),Math.cos(a),Math.sin(a)*Math.sin(c)),m=.24+t()*.32,f=1.04+t()*(i%5===0?1.34:.82),d=l.clone().multiplyScalar(m),p=l.clone().multiplyScalar(f);n.push(d.x,d.y,d.z,p.x,p.y,p.z),r.push(t()*6.28,t()*6.28),s.push(.35+t()*.65,.35+t()*.65)}const o=new I;return o.setAttribute("position",new R(n,3)),o.setAttribute("aPhase",new R(r,1)),o.setAttribute("aIntensity",new R(s,1)),o}function ut({activity:t,flashRef:n}){const r=u.useRef(null),s=u.useRef(null),o=u.useMemo(lt,[]),i=u.useMemo(ct,[]);return x(({clock:c},a)=>{const l=Le(t)*(1+n.current*2);s.current&&(s.current.uniforms.uTime.value=c.elapsedTime,s.current.uniforms.uEnergy.value=l*(t==="speaking"?1.22:1),s.current.uniforms.uOpacity.value=t==="speaking"?.82:.7,s.current.uniforms.uColor.value.copy(te)),r.current&&(r.current.rotation.y+=a*.055*Be(t),r.current.rotation.x=Math.sin(c.elapsedTime*.18)*.05,r.current.scale.setScalar(1+n.current*.2))}),e.jsx("group",{ref:r,children:e.jsx("lineSegments",{geometry:o,children:e.jsx("shaderMaterial",{ref:s,args:[i],blending:v,depthWrite:!1,toneMapped:!1,transparent:!0})})})}function mt({activity:t,flashRef:n}){const r=u.useRef(null),s=u.useRef(null),o=u.useRef(null),i=u.useRef(null),c=u.useMemo(()=>{const a=new qe(2.02,2),l=new $e(a);return a.dispose(),l},[]);return x(({clock:a},l)=>{const m=a.elapsedTime,f=Be(t),d=Le(t),p=t==="speaking"?Math.sin(m*7.2)*.035:0,h=t==="thinking"?Math.sin(m*3.4)*.018:0,g=1+p+h+n.current*.075;r.current&&(r.current.rotation.x+=l*.035*f,r.current.rotation.y+=l*.052*f,r.current.rotation.z-=l*.018*f,r.current.scale.setScalar(g)),s.current&&(s.current.rotation.x-=l*.026*f,s.current.rotation.y-=l*.041*f,s.current.rotation.z+=l*.023*f,s.current.scale.setScalar(.91-p*.42+n.current*.035)),o.current&&(o.current.opacity=.2+d*.13+n.current*.24),i.current&&(i.current.opacity=.08+d*.075+n.current*.12)}),e.jsxs("group",{rotation:[.08,-.18,.06],children:[e.jsx("lineSegments",{ref:r,geometry:c,children:e.jsx("lineBasicMaterial",{ref:o,blending:v,color:te,depthWrite:!1,opacity:.34,toneMapped:!1,transparent:!0})}),e.jsx("lineSegments",{ref:s,geometry:c,children:e.jsx("lineBasicMaterial",{ref:i,blending:v,color:Fe,depthWrite:!1,opacity:.15,toneMapped:!1,transparent:!0})})]})}function ft({activity:t,palette:n="gold"}){const[r,s]=at[n];te.set(r),Fe.set(s);const[o,i]=u.useState(0),c=u.useRef(0);return u.useEffect(()=>{let a;const l=()=>{i(1),setTimeout(()=>i(0),100);const m=500+Math.random()*2500;t==="thinking"?a=setTimeout(l,m*.5):a=setTimeout(l,m)};return a=setTimeout(l,1e3),()=>clearTimeout(a)},[t]),x((a,l)=>{c.current=T.lerp(c.current,o,l*8)}),e.jsxs("group",{scale:[1.3,.8,1.1],position:[.1,-.05,0],rotation:[.2,.1,-.1],children:[e.jsx(ut,{activity:t,flashRef:c}),e.jsx(mt,{activity:t,flashRef:c})]})}const O=new _("#ff8a18"),S=new _("#ffd15c"),pe=new _("#fff8d6"),ae=new _("#b8490b"),he=new _("#d65f10"),dt={gold:["#ff8a18","#ffd15c","#fff8d6","#b8490b","#d65f10"],green:["#4cff85","#b9ffc9","#f5fff6","#0b4f24","#18bd58"],violet:["#a855f7","#d8b4fe","#faf5ff","#1e0547","#7c3aed"],orange:["#ff7a18","#ffc46b","#fff5de","#7a2608","#ed5f12"]};function pt(t){const[n,r,s,o,i]=dt[t];O.set(n),S.set(r),pe.set(s),ae.set(o),he.set(i)}const z=[{radiusX:.66,radiusZ:.58,seed:11,speed:.33,tilt:[.28,.16,.84],opacity:.64,width:1,packets:3},{radiusX:.88,radiusZ:.74,seed:13,speed:-.26,tilt:[1.1,.04,-.38],opacity:.5,width:1,packets:2},{radiusX:1.06,radiusZ:.98,seed:17,speed:.21,tilt:[.08,.9,.24],opacity:.42,width:1,packets:4},{radiusX:1.28,radiusZ:1.05,seed:19,speed:-.18,tilt:[1.42,.32,.52],opacity:.58,width:1.3,packets:3},{radiusX:1.42,radiusZ:1.34,seed:23,speed:.13,tilt:[.46,1.18,-.2],opacity:.37,width:1,packets:2},{radiusX:1.58,radiusZ:1.18,seed:29,speed:-.11,tilt:[1.28,.82,1.05],opacity:.46,width:1.1,packets:3},{radiusX:1.78,radiusZ:1.58,seed:31,speed:.087,tilt:[.2,.2,1.47],opacity:.32,width:1,packets:2},{radiusX:2.03,radiusZ:1.72,seed:37,speed:-.072,tilt:[1.05,.42,-1.12],opacity:.34,width:1.2,packets:4},{radiusX:2.24,radiusZ:1.86,seed:41,speed:.055,tilt:[.72,1.05,.42],opacity:.28,width:1,packets:3},{radiusX:2.46,radiusZ:2.08,seed:43,speed:-.048,tilt:[1.38,.12,.08],opacity:.25,width:1,packets:2}];function $(t){return()=>{let n=t+=1831565813;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}function C(t){return t==="speaking"?1.52:t==="thinking"?1.28:t==="listening"?.82:1}function F(t){return t==="speaking"?1.85:t==="thinking"?1.42:t==="listening"?.46:1}const se={uniforms:{uTime:{value:0},uEnergy:{value:1},uOpacity:{value:1},uColor:{value:O}},vertexShader:`
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
  `};function We(){return{uniforms:ke.clone(se.uniforms),vertexShader:se.vertexShader,fragmentShader:se.fragmentShader}}function ht(){const t=$(54421),n=[],r=[],s=[];for(let i=0;i<12;i+=1){const c=t()*Math.PI*2,a=Math.acos(2*t()-1),l=new j(Math.sin(a)*Math.cos(c),Math.cos(a),Math.sin(a)*Math.sin(c)),m=i%4===0?2.05+t()*.38:1.1+t()*.66,f=l.clone().multiplyScalar((t()-.5)*.22),d=l.clone().multiplyScalar(-m).add(f),p=l.clone().multiplyScalar(m).add(f.multiplyScalar(.35));n.push(d.x,d.y,d.z,p.x,p.y,p.z),r.push(t()*6.28,t()*6.28),s.push(i%4===0?.92:.44+t()*.32,i%4===0?.92:.44+t()*.32)}const o=new I;return o.setAttribute("position",new R(n,3)),o.setAttribute("aPhase",new R(r,1)),o.setAttribute("aIntensity",new R(s,1)),o}function gt(t){const n=$(t.seed*313),r=[],s=[],o=[],i=240,c=n()*Math.PI*2,a=n()*Math.PI*2;for(let m=0;m<i;m+=1){const f=m/i*Math.PI*2,d=(m+1)/i*Math.PI*2;if(Math.abs(Math.sin((f-c)*1.5))<.13||Math.abs(Math.sin((f-a)*2))<.11||(m+t.seed)%23===0)continue;const h=1+Math.sin(f*5+t.seed)*.018+(n()-.5)*.01,g=1+Math.sin(d*5+t.seed)*.018+(n()-.5)*.01,y=Math.sin(f*3+t.seed)*.025,M=Math.sin(d*3+t.seed)*.025;r.push(Math.cos(f)*t.radiusX*h,y,Math.sin(f)*t.radiusZ*h),r.push(Math.cos(d)*t.radiusX*g,M,Math.sin(d)*t.radiusZ*g),s.push(f+t.seed,d+t.seed),o.push(.55+n()*.45,.55+n()*.45)}const l=new I;return l.setAttribute("position",new R(r,3)),l.setAttribute("aPhase",new R(s,1)),l.setAttribute("aIntensity",new R(o,1)),l}function vt(t){const n=$(t.seed*791),r=[],s=96;for(let o=0;o<s;o+=1){const i=o/s*Math.PI*2,c=1+Math.sin(i*3+t.seed)*.018+(n()-.5)*.008;r.push(new j(Math.cos(i)*t.radiusX*c,Math.sin(i*2+t.seed)*.018,Math.sin(i)*t.radiusZ*c))}return new fe(r,!0,"centripetal",.5)}function xt({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useRef(null);return x(({clock:i},c)=>{const a=i.elapsedTime,l=F(t),m=C(t);if(n.current){const f=t==="speaking"?Math.sin(a*7.2)*.075:Math.sin(a*2.2)*.025;n.current.scale.setScalar((1+f)*(.98+m*.035)),n.current.rotation.y+=c*.18*l}r.current&&(r.current.rotation.x+=c*.42*l),s.current&&(s.current.rotation.y-=c*.34*l),o.current&&(o.current.rotation.z+=c*.27*l)}),e.jsxs("group",{ref:n,children:[e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[.105,32,32]}),e.jsx("meshBasicMaterial",{color:pe,toneMapped:!1})]}),e.jsxs("mesh",{scale:1+C(t)*.075,children:[e.jsx("sphereGeometry",{args:[.31,32,32]}),e.jsx("meshBasicMaterial",{blending:v,color:S,depthWrite:!1,opacity:.32,toneMapped:!1,transparent:!0})]}),e.jsxs("mesh",{scale:1.72,children:[e.jsx("sphereGeometry",{args:[.42,32,32]}),e.jsx("meshBasicMaterial",{blending:v,color:O,depthWrite:!1,opacity:.092,toneMapped:!1,transparent:!0})]}),e.jsxs("mesh",{ref:r,rotation:[.3,.2,.1],children:[e.jsx("torusKnotGeometry",{args:[.34,.018,180,5,2,3]}),e.jsx("meshBasicMaterial",{blending:v,color:S,depthWrite:!1,toneMapped:!1})]}),e.jsxs("mesh",{ref:s,rotation:[1.1,.4,.8],scale:1.18,children:[e.jsx("torusKnotGeometry",{args:[.34,.011,180,4,3,5]}),e.jsx("meshBasicMaterial",{blending:v,color:O,depthWrite:!1,opacity:.72,toneMapped:!1,transparent:!0})]}),e.jsxs("mesh",{ref:o,rotation:[.2,1.2,.5],scale:1.42,children:[e.jsx("torusKnotGeometry",{args:[.34,.008,180,4,2,5]}),e.jsx("meshBasicMaterial",{blending:v,color:he,depthWrite:!1,opacity:.48,toneMapped:!1,transparent:!0})]})]})}function yt({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(ht,[]),o=u.useMemo(We,[]);return x(({clock:i},c)=>{r.current&&(r.current.uniforms.uTime.value=i.elapsedTime*1.28,r.current.uniforms.uEnergy.value=C(t)*(t==="speaking"?1.34:.96),r.current.uniforms.uOpacity.value=t==="listening"?.26:t==="speaking"?.48:.38,r.current.uniforms.uColor.value.copy(S)),n.current&&(n.current.rotation.y+=c*.035*F(t),n.current.rotation.z-=c*.018)}),e.jsx("group",{ref:n,children:e.jsx("lineSegments",{geometry:s,children:e.jsx("shaderMaterial",{ref:r,args:[o],blending:v,depthWrite:!1,toneMapped:!1,transparent:!0})})})}function Mt({activity:t,index:n,spec:r}){const s=u.useRef(null),o=u.useRef(null),i=u.useMemo(()=>gt(r),[r]),c=u.useMemo(We,[]);return x(({clock:a},l)=>{const m=F(t);if(s.current){s.current.rotation.y+=l*r.speed*m,s.current.rotation.z+=l*r.speed*.28*m;const f=1+Math.sin(a.elapsedTime*.8+r.seed)*.004*C(t);s.current.scale.setScalar(f)}o.current&&(o.current.uniforms.uTime.value=a.elapsedTime+n*.71,o.current.uniforms.uEnergy.value=C(t),o.current.uniforms.uOpacity.value=r.opacity,o.current.uniforms.uColor.value.copy(n<3?S:n>6?he:O))}),e.jsx("group",{ref:s,rotation:r.tilt,children:e.jsx("lineSegments",{geometry:i,children:e.jsx("shaderMaterial",{ref:o,args:[c],blending:v,depthWrite:!1,toneMapped:!1,transparent:!0})})})}function jt({activity:t,index:n,spec:r}){const s=u.useRef(null),o=u.useMemo(()=>new _e(vt(r),220,r.width*.011,5,!0),[r]);return x(({clock:i},c)=>{if(!s.current)return;const a=F(t);s.current.rotation.y+=c*r.speed*.72*a,s.current.rotation.z+=c*r.speed*.18*a;const l=s.current.material;l.color.copy(n%2===0?S:O),l.opacity=(.32+r.opacity*.58)*(.82+Math.sin(i.elapsedTime*(.95+n*.14)+r.seed)*.18)*C(t)}),e.jsx("group",{rotation:r.tilt,children:e.jsx("mesh",{ref:s,geometry:o,children:e.jsx("meshBasicMaterial",{blending:v,color:S,depthWrite:!1,opacity:.74,toneMapped:!1,transparent:!0})})})}function bt({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>{const a=[];return z.forEach((l,m)=>{for(let f=0;f<l.packets;f+=1)a.push({orbit:m,phase:((f+1)/(l.packets+1)+l.seed*.013)%1,speed:Math.abs(l.speed)*(.72+f*.16),size:.045+(f+m)%3*.018,offset:(f-l.packets*.5)*.012})}),a},[]),s=u.useMemo(()=>{const a=new I;return a.setAttribute("position",new A(new Float32Array(r.length*3),3)),a.setAttribute("aSize",new A(new Float32Array(r.map(l=>l.size)),1)),a},[r]),o=u.useMemo(()=>z.map(a=>new Ke().makeRotationFromEuler(new Ge(...a.tilt))),[]),i=u.useMemo(()=>new j,[]);x(({clock:a})=>{if(!n.current)return;const l=s.getAttribute("position"),m=F(t);r.forEach((f,d)=>{const p=z[f.orbit],g=(f.phase+a.elapsedTime*f.speed*m)%1*Math.PI*2;i.set(Math.cos(g)*p.radiusX,Math.sin(g*3+p.seed)*.025+f.offset,Math.sin(g)*p.radiusZ),i.applyMatrix4(o[f.orbit]),l.setXYZ(d,i.x,i.y,i.z)}),l.needsUpdate=!0});const c=u.useMemo(()=>({uniforms:{uColor:{value:S}},vertexShader:`
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
      `}),[]);return e.jsx("points",{ref:n,geometry:s,children:e.jsx("shaderMaterial",{args:[c],blending:v,depthWrite:!1,toneMapped:!1,transparent:!0})})}function wt({activity:t}){const n=u.useRef(null);return x(({clock:r})=>{if(!n.current)return;const s=t==="speaking"?Math.sin(r.elapsedTime*6.8)*.018:0;n.current.scale.setScalar(1+s)}),e.jsxs("group",{ref:n,children:[[z[1],z[3],z[5],z[7]].map((r,s)=>e.jsx(jt,{activity:t,index:s,spec:r},`major-${r.seed}`)),z.map((r,s)=>e.jsx(Mt,{activity:t,index:s,spec:r},r.seed)),e.jsx(bt,{activity:t})]})}function St({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(()=>{const i=$(91822),c=760,a=new Float32Array(c*3),l=new Float32Array(c),m=new Float32Array(c);for(let d=0;d<c;d+=1){const p=i()*Math.PI*2,h=.52+Math.pow(i(),1.8)*.92;a[d*3]=Math.cos(p)*h,a[d*3+1]=(i()-.5)*.055,a[d*3+2]=Math.sin(p)*h*(.78+i()*.18),l[d]=p+i()*3,m[d]=1.2+i()*3.8}const f=new I;return f.setAttribute("position",new A(a,3)),f.setAttribute("aPhase",new A(l,1)),f.setAttribute("aSize",new A(m,1)),f},[]),o=u.useMemo(()=>({uniforms:{uTime:{value:0},uEnergy:{value:1},uColor:{value:S}},vertexShader:`
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
      `}),[]);return x(({clock:i},c)=>{r.current&&(r.current.uniforms.uTime.value=i.elapsedTime,r.current.uniforms.uEnergy.value=C(t),r.current.uniforms.uColor.value.copy(S)),n.current&&(n.current.rotation.x=.58+Math.sin(i.elapsedTime*.12)*.035,n.current.rotation.y+=c*.08*F(t),n.current.rotation.z=-.18)}),e.jsx("points",{ref:n,geometry:s,children:e.jsx("shaderMaterial",{ref:r,args:[o],blending:v,depthWrite:!1,toneMapped:!1,transparent:!0})})}function Et(){const t=$(55123);return Array.from({length:14},(n,r)=>{const s=r/14*Math.PI*2+t()*.32,o=new Ge(t()*1.4,t()*1.1,t()*1.2),i=Array.from({length:6},(c,a)=>{const l=a/5,m=.28+l*(1.76+t()*.38),f=s+Math.sin(l*Math.PI*2+r)*.28;return new j(Math.cos(f)*m,Math.sin(l*Math.PI*1.5+r)*.26,Math.sin(f)*m*(.74+t()*.22)).applyEuler(o)});return new fe(i,!1,"centripetal",.44)})}function Tt({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>Et(),[]),s=u.useMemo(()=>Array.from({length:56},(c,a)=>({curve:a%r.length,phase:a*19%56/56,speed:.08+a%6*.012})),[r.length]),o=u.useMemo(()=>{const c=new I;return c.setAttribute("position",new A(new Float32Array(s.length*3),3)),c},[s.length]),i=u.useMemo(()=>new j,[]);return x(({clock:c})=>{if(!n.current)return;const a=o.getAttribute("position"),l=F(t);s.forEach((m,f)=>{const d=(m.phase+c.elapsedTime*m.speed*l)%1;r[m.curve].getPointAt(d,i);const p=t==="speaking"?1+Math.sin(c.elapsedTime*7+f)*.025:1;a.setXYZ(f,i.x*p,i.y*p,i.z*p)}),a.needsUpdate=!0}),e.jsx("points",{ref:n,geometry:o,children:e.jsx("pointsMaterial",{blending:v,color:pe,depthWrite:!1,opacity:.76,size:.046,sizeAttenuation:!0,toneMapped:!1,transparent:!0})})}function Rt({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>({uniforms:{uEnergy:{value:1},uColor:{value:ae}},vertexShader:`
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
      `}),[]);return x(()=>{n.current&&(n.current.uniforms.uEnergy.value=C(t),n.current.uniforms.uColor.value.copy(ae))}),e.jsxs("mesh",{scale:[1.04,1.04,1.04],children:[e.jsx("sphereGeometry",{args:[2.18,48,48]}),e.jsx("shaderMaterial",{ref:n,args:[r],blending:v,depthWrite:!1,side:Qe,toneMapped:!1,transparent:!0})]})}function Re({activity:t,palette:n="gold"}){return pt(n),e.jsxs("group",{children:[e.jsx(Rt,{activity:t}),e.jsx("group",{scale:n==="violet"?.46:1,children:e.jsx(ft,{activity:t,palette:n})}),e.jsx(Tt,{activity:t}),e.jsx(xt,{activity:t}),e.jsx(St,{activity:t}),e.jsx(yt,{activity:t}),e.jsx(wt,{activity:t})]})}function b(t){return t==="speaking"?1.42:t==="thinking"?1.24:t==="listening"?.78:1}function w(t){return t==="speaking"?1.7:t==="thinking"?1.28:t==="listening"?.62:.86}function X(t,n,r=0){const s=t==="speaking"?8.4:t==="thinking"?4.6:t==="listening"?1.2:1.8,o=t==="speaking"?.12:t==="thinking"?.065:t==="listening"?.025:.038;return 1+Math.sin(n*s+r)*o}function k(t){let n=t>>>0;return()=>(n=n*1664525+1013904223>>>0,n/4294967296)}function Ue(t){const n=new Float32Array(t.length*6);t.forEach(([s,o],i)=>{const c=i*6;n[c]=s.x,n[c+1]=s.y,n[c+2]=s.z,n[c+3]=o.x,n[c+4]=o.y,n[c+5]=o.z});const r=new I;return r.setAttribute("position",new A(n,3)),r}function De(t){const n=[];return t.forEach(r=>{for(let s=1;s<r.length;s+=1)n.push([r[s-1],r[s]])}),Ue(n)}const Pt="#22b8ff",V="#dcfbff",ie="#0757ff",zt=`
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,At=`
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

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
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vec3 p = vPosition * 2.2;
    float time = uTime * 0.45;

    // Multi-octave cosmic swirling noise
    float n1 = snoise(p + vec3(0.0, 0.0, time));
    float n2 = snoise(p * 2.1 - vec3(time * 0.6, 0.0, time * 0.4));
    float n3 = snoise(p * 4.2 + vec3(time * 0.8, -time * 0.5, 0.0));

    float nebula = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
    float density = smoothstep(-0.2, 0.85, nebula);

    // Fresnel edge brightness
    float viewAngle = abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
    float fresnel = pow(1.0 - viewAngle, 2.5);

    vec3 colDeep = vec3(0.027, 0.341, 1.0);  // DEEP SPACE #0757ff
    vec3 colBlue = vec3(0.133, 0.722, 1.0);  // COSMIC BLUE #22b8ff
    vec3 colIce  = vec3(0.863, 0.984, 1.0);  // ICE CYAN #dcfbff

    vec3 color = mix(colDeep, colBlue, density);
    color = mix(color, colIce, pow(density, 2.2) * 0.85);

    float alpha = (density * 0.45 + fresnel * 0.35) * uEnergy;
    gl_FragColor = vec4(color * (0.8 + uEnergy * 0.5), alpha);
  }
`,Ct=`
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,It=`
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
    // Edge proximity detection on box UVs
    vec2 edgeDist = abs(vUv - 0.5) * 2.0;
    float edgeFactor = max(edgeDist.x, edgeDist.y);
    float lineEdge = smoothstep(0.88, 0.98, edgeFactor);

    // High frequency electric arc flickering
    float noise = hash(vUv * 100.0 + floor(uTime * 25.0));
    float electricArc = step(0.68, noise) * lineEdge * uArcActivity;

    // Rim inner glow
    float viewAngle = abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
    float rimGlow = pow(1.0 - viewAngle, 3.0) * (0.3 + uEnergy * 0.5);

    vec3 iceColor = vec3(0.863, 0.984, 1.0);
    vec3 blueColor = vec3(0.133, 0.722, 1.0);

    vec3 finalColor = mix(blueColor, iceColor, electricArc + rimGlow);
    float finalAlpha = (rimGlow * 0.5 + electricArc * 0.85);

    gl_FragColor = vec4(finalColor * 1.5, finalAlpha);
  }
`,kt=`
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Gt=`
  uniform float uTime;
  uniform float uEnergy;
  varying vec2 vUv;

  void main() {
    vec2 st = vUv;
    float zScroll = st.y * 12.0 - uTime * 2.5;
    float spiral = st.x * 24.0 + st.y * 8.0 + uTime * 1.8;

    float grid = abs(sin(spiral) * sin(zScroll));
    float lines = smoothstep(0.75, 0.95, grid);

    float depthFade = smoothstep(0.0, 0.35, st.y) * (1.0 - smoothstep(0.75, 1.0, st.y));

    vec3 ice = vec3(0.863, 0.984, 1.0);
    vec3 deep = vec3(0.027, 0.341, 1.0);
    vec3 color = mix(deep, ice, lines * 0.8);

    gl_FragColor = vec4(color * (0.7 + uEnergy * 0.4), lines * depthFade * 0.35 * uEnergy);
  }
`,_t=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Ft=`
  uniform float uTime;
  uniform float uEnergy;
  uniform float uPulseIntensity;
  varying vec2 vUv;

  void main() {
    vec2 center = vUv - vec2(0.5);
    float dist = length(center) * 2.0;

    float waveTime = fract(uTime * 0.45);
    float ringWidth = 0.08;
    float ring = smoothstep(waveTime - ringWidth, waveTime, dist) - smoothstep(waveTime, waveTime + ringWidth, dist);

    float fade = (1.0 - smoothstep(0.0, 1.0, dist)) * (1.0 - waveTime);
    float alpha = ring * fade * 0.6 * uPulseIntensity * uEnergy;

    vec3 color = mix(vec3(0.133, 0.722, 1.0), vec3(0.863, 0.984, 1.0), ring);
    gl_FragColor = vec4(color * 1.8, alpha);
  }
`;function Lt({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=t==="speaking"||t==="thinking";return x(({clock:o},i)=>{const c=o.elapsedTime,a=w(t);r.current&&(r.current.rotation.y+=i*.15*a,r.current.rotation.x=Math.sin(c*.3)*.12),n.current&&(n.current.uniforms.uTime.value=c,n.current.uniforms.uEnergy.value=b(t),n.current.uniforms.uArcActivity.value=s?t==="speaking"?1.4:1:.25)}),e.jsxs("group",{children:[e.jsxs("mesh",{ref:r,children:[e.jsx("boxGeometry",{args:[2,2,2]}),e.jsx("meshPhysicalMaterial",{color:"#ffffff",transmission:.85,roughness:.1,metalness:.1,clearcoat:1,clearcoatRoughness:.05,ior:1.52,transparent:!0,opacity:.92,reflectivity:.9})]}),e.jsxs("mesh",{scale:.98,children:[e.jsx("boxGeometry",{args:[1.98,1.98,1.98]}),e.jsx("shaderMaterial",{ref:n,vertexShader:Ct,fragmentShader:It,uniforms:{uTime:{value:0},uEnergy:{value:1},uArcActivity:{value:.3}},blending:v,depthWrite:!1,side:U,transparent:!0})]})]})}function Bt({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null);return x(({clock:o},i)=>{const c=o.elapsedTime,a=w(t),l=b(t);if(n.current&&(n.current.uniforms.uTime.value=c,n.current.uniforms.uEnergy.value=l),r.current){r.current.rotation.x+=i*.9*a,r.current.rotation.y+=i*1.3*a;const m=.85+Math.sin(c*6)*.05+l*.12;r.current.scale.setScalar(m)}s.current&&(s.current.rotation.z+=i*.4*a,s.current.scale.setScalar(1+Math.sin(c*8)*.08*l))}),e.jsxs("group",{children:[e.jsxs("mesh",{scale:.92,children:[e.jsx("boxGeometry",{args:[1.75,1.75,1.75,12,12,12]}),e.jsx("shaderMaterial",{ref:n,vertexShader:zt,fragmentShader:At,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:v,depthWrite:!1,side:U,transparent:!0})]}),e.jsxs("mesh",{ref:r,children:[e.jsx("octahedronGeometry",{args:[.18,0]}),e.jsx("meshBasicMaterial",{color:V,toneMapped:!1})]}),e.jsx("group",{ref:s,children:[0,Math.PI/3,2*Math.PI/3].map((o,i)=>e.jsxs("mesh",{rotation:[0,0,o],children:[e.jsx("planeGeometry",{args:[.06,1.8]}),e.jsx("meshBasicMaterial",{color:V,blending:v,depthWrite:!1,opacity:.4,transparent:!0,toneMapped:!1})]},i))})]})}function Wt({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(()=>new q,[]),{geometry:o,vertices:i,edges:c}=u.useMemo(()=>{const l=[];for(let p=0;p<16;p+=1)l.push([p&1?1:-1,p&2?1:-1,p&4?1:-1,p&8?1:-1]);const m=[];for(let p=0;p<l.length;p+=1)for(let h=0;h<4;h+=1){const g=p^1<<h;p<g&&m.push([p,g])}const f=new Float32Array(m.length*6),d=new I;return d.setAttribute("position",new A(f,3)),{geometry:d,vertices:l,edges:m}},[]),a=u.useMemo(()=>new Float32Array(48),[]);return x(({clock:l},m)=>{const f=l.elapsedTime,d=w(t),p=b(t),h=o.attributes.position,g=h.array,y=f*.35*d,M=f*.25*d,N=f*.18*d,ve=Math.cos(y),xe=Math.sin(y),ye=Math.cos(M),Me=Math.sin(M),je=Math.cos(N),be=Math.sin(N);i.forEach(([L,B,Q,E],Y)=>{let Ne=L*ve-E*xe,G=L*xe+E*ve,Ye=B*ye-G*Me;G=B*Me+G*ye;let Ze=Q*je-G*be;G=Q*be+G*je;const ne=1.75/(2.65-G*.38),we=Ne*ne,Se=Ye*ne,Ee=Ze*ne;if(a[Y*3]=we,a[Y*3+1]=Se,a[Y*3+2]=Ee,r.current){s.position.set(we,Se,Ee);const He=(.045+Math.sin(f*8+Y)*.015)*p;s.scale.setScalar(He),s.updateMatrix(),r.current.setMatrixAt(Y,s.matrix)}}),c.forEach(([L,B],Q)=>{const E=Q*6;g[E]=a[L*3],g[E+1]=a[L*3+1],g[E+2]=a[L*3+2],g[E+3]=a[B*3],g[E+4]=a[B*3+1],g[E+5]=a[B*3+2]}),h.needsUpdate=!0,r.current&&(r.current.instanceMatrix.needsUpdate=!0),n.current&&(n.current.rotation.y+=m*.1*d,n.current.scale.setScalar(X(t,f)))}),e.jsxs("group",{rotation:[.2,-.3,.08],children:[e.jsx("lineSegments",{ref:n,geometry:o,children:e.jsx("lineBasicMaterial",{color:V,blending:v,depthWrite:!1,opacity:.9,toneMapped:!1,transparent:!0})}),e.jsx("lineSegments",{geometry:o,scale:1.12,children:e.jsx("lineBasicMaterial",{color:ie,blending:v,depthWrite:!1,opacity:.35,toneMapped:!1,transparent:!0})}),e.jsxs("instancedMesh",{ref:r,args:[void 0,void 0,16],children:[e.jsx("sphereGeometry",{args:[1,12,12]}),e.jsx("meshBasicMaterial",{color:V,toneMapped:!1})]})]})}function Ut({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=600,{positions:o,initialAngles:i,initialRadii:c,speeds:a}=u.useMemo(()=>{const l=k(1088),m=new Float32Array(s*3),f=new Float32Array(s),d=new Float32Array(s),p=new Float32Array(s);for(let h=0;h<s;h++){const g=l()*Math.PI*2,y=.5+l()*3.8,M=-6+l()*8;m[h*3]=Math.cos(g)*y,m[h*3+1]=Math.sin(g)*y,m[h*3+2]=M,f[h]=g,d[h]=y,p[h]=.4+l()*1.2}return{positions:m,initialAngles:f,initialRadii:d,speeds:p}},[]);return x(({clock:l},m)=>{const f=l.elapsedTime,d=w(t);if(n.current&&(n.current.uniforms.uTime.value=f,n.current.uniforms.uEnergy.value=b(t)),r.current){const p=r.current.geometry.attributes.position,h=p.array;for(let g=0;g<s;g++){i[g]+=m*a[g]*.8*d;const y=i[g];let M=h[g*3+2]+m*a[g]*2.2*d;M>2&&(M=-6);const N=c[g]*(1+(M+6)*.15);h[g*3]=Math.cos(y)*N,h[g*3+1]=Math.sin(y)*N,h[g*3+2]=M}p.needsUpdate=!0}}),e.jsxs("group",{position:[0,0,-2.2],children:[e.jsxs("mesh",{rotation:[Math.PI/2,0,0],children:[e.jsx("cylinderGeometry",{args:[.6,4.8,10,32,32,!0]}),e.jsx("shaderMaterial",{ref:n,vertexShader:kt,fragmentShader:Gt,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:v,depthWrite:!1,side:U,transparent:!0})]}),e.jsxs("points",{ref:r,children:[e.jsx("bufferGeometry",{children:e.jsx("bufferAttribute",{attach:"attributes-position",args:[o,3]})}),e.jsx("pointsMaterial",{color:V,blending:v,depthWrite:!1,opacity:.65,size:.032,sizeAttenuation:!0,toneMapped:!1,transparent:!0})]})]})}function Dt({activity:t}){const n=u.useRef(null),r=t==="speaking"?1.6:t==="thinking"?1.1:.2;return x(({clock:s})=>{n.current&&(n.current.uniforms.uTime.value=s.elapsedTime,n.current.uniforms.uEnergy.value=b(t),n.current.uniforms.uPulseIntensity.value=r)}),e.jsx("group",{position:[0,0,-.4],children:[0,.4,.8].map((s,o)=>e.jsxs("mesh",{scale:[4.5+o*.8,4.5+o*.8,1],children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("shaderMaterial",{ref:o===0?n:void 0,vertexShader:_t,fragmentShader:Ft,uniforms:{uTime:{value:s},uEnergy:{value:1},uPulseIntensity:{value:r}},blending:v,depthWrite:!1,transparent:!0})]},o))})}function Ot({activity:t="idle"}){return e.jsxs("group",{name:"mcu-tesseract-space-scene",scale:1.25,children:[e.jsx("ambientLight",{intensity:.6,color:ie}),e.jsx("pointLight",{position:[0,0,0],intensity:5,distance:8,color:V}),e.jsx("directionalLight",{position:[5,5,5],intensity:2.2,color:Pt}),e.jsx("directionalLight",{position:[-5,-5,-5],intensity:1.4,color:ie}),e.jsx(Ut,{activity:t}),e.jsx(Dt,{activity:t}),e.jsx(Wt,{activity:t}),e.jsx(Bt,{activity:t}),e.jsx(Lt,{activity:t})]})}const ce="#ff203c",Oe="#ff4b56",Vt="#ffc35a",Xt=`
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
`,Nt=`
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
`,Yt=`
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
`;function Zt({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useMemo(()=>[{base:[-.65,.25,-.1],scale:[.55,.42,.45],phase:.3},{base:[.6,-.15,.05],scale:[.45,.6,.42],phase:1.5},{base:[.1,.7,-.15],scale:[.38,.5,.35],phase:2.7},{base:[-.15,-.72,-.1],scale:[.42,.48,.38],phase:4.1}],[]);return x(({clock:i},c)=>{const a=i.elapsedTime,l=w(t),m=b(t);n.current&&(n.current.rotation.y+=c*.15*l,n.current.rotation.z=Math.sin(a*.2)*.1,n.current.scale.setScalar(X(t,a,.8))),r.current&&(r.current.uniforms.uTime.value=a,r.current.uniforms.uEnergy.value=m),s.current&&s.current.children.forEach((f,d)=>{const p=o[d];if(!p)return;f.position.set(p.base[0]+Math.sin(a*.8*l+p.phase)*.12,p.base[1]+Math.cos(a*.65*l+p.phase)*.1,p.base[2]+Math.sin(a*.5*l+p.phase)*.14);const h=1+Math.sin(a*3+p.phase)*.1*m;f.scale.set(p.scale[0]*h,p.scale[1]/h,p.scale[2]*h)})}),e.jsxs("group",{position:[0,0,0],children:[e.jsxs("mesh",{ref:n,children:[e.jsx("icosahedronGeometry",{args:[.82,32]}),e.jsx("shaderMaterial",{ref:r,vertexShader:Xt,fragmentShader:Nt,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:v,depthWrite:!1,transparent:!0})]}),e.jsx("group",{ref:s,children:o.map((i,c)=>e.jsxs("mesh",{position:i.base,scale:i.scale,children:[e.jsx("icosahedronGeometry",{args:[1,16]}),e.jsx("meshStandardMaterial",{color:"#3a0009",emissive:c%2===0?ce:Oe,emissiveIntensity:1.8,metalness:.1,roughness:.3,transparent:!0,opacity:.82})]},c))}),e.jsx("pointLight",{color:ce,intensity:3.5,distance:5,decay:2})]})}function Ht({activity:t}){const n=u.useRef(null);return x(({clock:r})=>{n.current&&(n.current.uniforms.uTime.value=r.elapsedTime,n.current.uniforms.uEnergy.value=b(t))}),e.jsxs("mesh",{position:[0,0,-1.6],scale:[5.8,4.4,1],children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("shaderMaterial",{ref:n,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:Yt,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:v,depthWrite:!1,transparent:!0})]})}function qt({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(()=>new q,[]),o=22,i=u.useMemo(()=>{const c=k(2026);return Array.from({length:o},(a,l)=>({angle:l/o*Math.PI*2,radius:2.1+(c()-.5)*.35,height:.7+c()*.5,z:-.6+(c()-.5)*.6,tilt:(c()-.5)*.3,phase:c()*Math.PI*2}))},[]);return x(({clock:c})=>{if(!n.current||!r.current)return;const a=c.elapsedTime,l=w(t);i.forEach((m,f)=>{var y,M;const d=m.angle+a*.03*l,p=Math.sin(a*.8+m.phase)*.08,h=Math.cos(d)*m.radius,g=Math.sin(d)*m.radius*.65+p;s.position.set(h,g,m.z),s.rotation.set(m.tilt,-.2,d+Math.PI/2),s.scale.set(.18,m.height,.12),s.updateMatrix(),(y=n.current)==null||y.setMatrixAt(f,s.matrix),s.position.set(h*1.004,g*1.004,m.z+.07),s.rotation.set(0,0,d+Math.PI/2),s.scale.set(.11,.04,.015),s.updateMatrix(),(M=r.current)==null||M.setMatrixAt(f,s.matrix)}),n.current.instanceMatrix.needsUpdate=!0,r.current.instanceMatrix.needsUpdate=!0}),e.jsxs("group",{rotation:[.15,-.06,.08],children:[e.jsxs("instancedMesh",{ref:n,args:[void 0,void 0,o],children:[e.jsx("boxGeometry",{args:[1,1,1]}),e.jsx("meshStandardMaterial",{color:"#1a0408",emissive:"#4a050d",emissiveIntensity:.6,metalness:.2,roughness:.8})]}),e.jsxs("instancedMesh",{ref:r,args:[void 0,void 0,o],children:[e.jsx("boxGeometry",{args:[1,1,1]}),e.jsx("meshBasicMaterial",{color:Vt,blending:v,depthWrite:!1,toneMapped:!1})]})]})}function $t({activity:t}){const n=u.useRef(null),r=600,{positions:s,velocities:o}=u.useMemo(()=>{const i=k(8812),c=new Float32Array(r*3),a=new Float32Array(r*3);for(let l=0;l<r;l++)c[l*3]=(i()-.5)*5.5,c[l*3+1]=(i()-.5)*4.5,c[l*3+2]=(i()-.5)*3.5-.3,a[l*3]=(i()-.5)*.4,a[l*3+1]=.3+i()*.8,a[l*3+2]=(i()-.5)*.4;return{positions:c,velocities:a}},[]);return x((i,c)=>{if(!n.current)return;const a=n.current.geometry.attributes.position,l=a.array,m=w(t);for(let f=0;f<r;f++)l[f*3]+=o[f*3]*c*m,l[f*3+1]+=o[f*3+1]*c*m,l[f*3+2]+=o[f*3+2]*c*m,l[f*3+1]>2.5&&(l[f*3+1]=-2.5);a.needsUpdate=!0}),e.jsxs("points",{ref:n,children:[e.jsx("bufferGeometry",{children:e.jsx("bufferAttribute",{attach:"attributes-position",args:[s,3]})}),e.jsx("pointsMaterial",{color:Oe,blending:v,depthWrite:!1,opacity:.65,size:.035,sizeAttenuation:!0,toneMapped:!1,transparent:!0})]})}function Qt({activity:t="idle"}){return e.jsxs("group",{name:"reality-aether-forge-mcu",scale:1.25,children:[e.jsx("ambientLight",{intensity:.5,color:ce}),e.jsx(Ht,{activity:t}),e.jsx($t,{activity:t}),e.jsx(qt,{activity:t}),e.jsx(Zt,{activity:t})]})}const Z="#23e777",K="#66ff9f",Kt="#e0ffea",W="#8c6721",Pe=`
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
`,Jt=`
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
`;function oe(t,n,r){const s=new ee,o=t*.14,i=Math.PI*2/n;for(let m=0;m<n;m++){const f=m*i,d=f,p=f+i*.28,h=f+i*.52,g=f+i*.78,y=t,M=t+o;m===0?s.moveTo(Math.cos(d)*y,Math.sin(d)*y):s.lineTo(Math.cos(d)*y,Math.sin(d)*y),s.lineTo(Math.cos(p)*M,Math.sin(p)*M),s.lineTo(Math.cos(h)*M,Math.sin(h)*M),s.lineTo(Math.cos(g)*y,Math.sin(g)*y)}const c=new Je,a=t*.65;for(let m=0;m<=32;m++){const f=m/32*Math.PI*2,d=Math.cos(f)*a,p=Math.sin(f)*a;m===0?c.moveTo(d,p):c.lineTo(d,p)}s.holes.push(c);const l={depth:r,bevelEnabled:!0,bevelSegments:2,steps:1,bevelSize:.015,bevelThickness:.015};return new D(s,l)}function en({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useRef(0),i=8,c=u.useMemo(()=>{const a=new ee;a.moveTo(0,0),a.quadraticCurveTo(.6,.25,1.1,.05),a.lineTo(1.2,.45),a.quadraticCurveTo(.6,.75,0,.55),a.closePath();const l={depth:.04,bevelEnabled:!0,bevelSize:.01,bevelThickness:.01};return new D(a,l)},[]);return x(({clock:a},l)=>{const m=a.elapsedTime,f=w(t),d=t==="speaking"||t==="thinking"?.88:t==="listening"?.45:.18;if(o.current=T.lerp(o.current,d,.08),n.current&&(n.current.scale.set(X(t,m),t==="listening"?.92:1,1),n.current.rotation.y=Math.sin(m*.25)*.12),r.current&&r.current.children.forEach((p,h)=>{const g=h*Math.PI*2/i,y=o.current*.48,M=o.current*.55;p.position.x=Math.cos(g)*y,p.position.y=Math.sin(g)*y,p.rotation.z=g+M}),s.current){s.current.rotation.y+=l*1.4*f,s.current.rotation.x=Math.sin(m*.8)*.3;const p=.85+b(t)*.18+Math.sin(m*7)*.05;s.current.scale.setScalar(p)}}),e.jsxs("group",{ref:n,children:[e.jsxs("mesh",{position:[0,0,-.05],children:[e.jsx("torusGeometry",{args:[1.35,.08,16,48]}),e.jsx("meshStandardMaterial",{color:W,metalness:.88,roughness:.25,emissive:Z,emissiveIntensity:.15})]}),e.jsx("group",{ref:r,position:[0,0,.02],children:Array.from({length:i},(a,l)=>e.jsx("mesh",{geometry:c,children:e.jsx("meshStandardMaterial",{color:W,metalness:.85,roughness:.22,emissive:Z,emissiveIntensity:.12})},l))}),e.jsxs("mesh",{ref:s,position:[0,0,.18],children:[e.jsx("octahedronGeometry",{args:[.26,1]}),e.jsx("meshStandardMaterial",{color:"#0a8f45",emissive:Z,emissiveIntensity:2.8,metalness:.2,roughness:.05,toneMapped:!1})]}),e.jsx("pointLight",{position:[0,0,.22],color:Z,intensity:4.5,distance:5.5,decay:2})]})}function tn({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=t==="thinking";return x(({clock:i})=>{const c=i.elapsedTime,a=b(t),l=o?-1:1;n.current&&(n.current.uniforms.uTime.value=c,n.current.uniforms.uEnergy.value=a,n.current.uniforms.uDirection.value=l),r.current&&(r.current.uniforms.uTime.value=c*.8,r.current.uniforms.uEnergy.value=a*.9,r.current.uniforms.uDirection.value=-l),s.current&&(s.current.rotation.z=Math.sin(c*.15)*.08)}),e.jsxs("group",{ref:s,children:[e.jsxs("mesh",{position:[0,0,-.12],scale:[3.4,3.4,1],children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("shaderMaterial",{ref:n,vertexShader:Pe,fragmentShader:ze,uniforms:{uTime:{value:0},uEnergy:{value:1},uDirection:{value:1}},blending:v,depthWrite:!1,transparent:!0})]}),e.jsxs("mesh",{position:[0,0,-.28],scale:[4.8,4.8,1],children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("shaderMaterial",{ref:r,vertexShader:Pe,fragmentShader:ze,uniforms:{uTime:{value:0},uEnergy:{value:1},uDirection:{value:-1}},blending:v,depthWrite:!1,transparent:!0})]})]})}function nn({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useMemo(()=>oe(1.05,12,.08),[]),i=u.useMemo(()=>oe(1.55,18,.08),[]),c=u.useMemo(()=>oe(2.1,24,.08),[]);return x((a,l)=>{const m=w(t),f=t==="thinking"?-1:1;n.current&&(n.current.rotation.z+=l*.35*m*f),r.current&&(r.current.rotation.z-=l*.22*m*f),s.current&&(s.current.rotation.z+=l*.14*m*f)}),e.jsxs("group",{position:[0,0,-.35],children:[e.jsx("mesh",{ref:n,geometry:o,position:[0,0,0],children:e.jsx("meshStandardMaterial",{color:W,metalness:.82,roughness:.28,emissive:K,emissiveIntensity:.25})}),e.jsx("mesh",{ref:r,geometry:i,position:[0,0,-.06],children:e.jsx("meshStandardMaterial",{color:W,metalness:.85,roughness:.25,emissive:Z,emissiveIntensity:.2})}),e.jsx("mesh",{ref:s,geometry:c,position:[0,0,-.12],children:e.jsx("meshStandardMaterial",{color:W,metalness:.88,roughness:.22,emissive:K,emissiveIntensity:.18})})]})}function rn({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=48,o=u.useMemo(()=>new q,[]),i=u.useMemo(()=>{const a=[],l=k(452);for(let m=0;m<6;m++){const f=m%2===0?1:-1,d=[];for(let p=0;p<=5;p++){const h=p/5;d.push(new j(f*(.4+h*2.2+l()*.2),(m-2.5)*.45+Math.sin(h*Math.PI*1.5+m)*.4,-.3-h*.8+Math.cos(h*Math.PI)*.3))}a.push(new fe(d))}return a},[]),c=u.useMemo(()=>i.map(a=>new _e(a,40,.018,8,!1)),[i]);return x(({clock:a})=>{const l=a.elapsedTime,m=w(t);n.current&&(n.current.position.z=Math.sin(l*.4)*.06),r.current&&(i.forEach((f,d)=>{var p;for(let h=0;h<8;h++){const g=d*8+h,y=(l*.25*m+h/8+d*.15)%1,M=f.getPoint(y);o.position.copy(M),o.scale.setScalar(.038+Math.sin(y*Math.PI)*.02),o.updateMatrix(),(p=r.current)==null||p.setMatrixAt(g,o.matrix)}}),r.current.instanceMatrix.needsUpdate=!0)}),e.jsxs("group",{ref:n,children:[c.map((a,l)=>e.jsx("mesh",{geometry:a,children:e.jsx("meshBasicMaterial",{color:K,blending:v,depthWrite:!1,opacity:.48,transparent:!0,toneMapped:!1})},l)),e.jsxs("instancedMesh",{ref:r,args:[void 0,void 0,s],children:[e.jsx("sphereGeometry",{args:[1,8,8]}),e.jsx("meshBasicMaterial",{color:Kt,toneMapped:!1})]})]})}function sn({activity:t}){const n=u.useRef(null),r=t==="thinking";return x(({clock:s})=>{n.current&&(n.current.uniforms.uTime.value=s.elapsedTime,n.current.uniforms.uEnergy.value=b(t),n.current.uniforms.uReversing.value=r?1:0)}),e.jsxs("mesh",{position:[0,0,-.08],scale:[4.2,4.2,1],children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("shaderMaterial",{ref:n,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:Jt,uniforms:{uTime:{value:0},uEnergy:{value:1},uReversing:{value:0}},blending:v,depthWrite:!1,transparent:!0})]})}function on({activity:t="idle"}){return e.jsxs("group",{name:"agamotto-temporal-eye-scene",scale:1.25,children:[e.jsx("ambientLight",{intensity:.5,color:W}),e.jsx("directionalLight",{position:[4,4,4],intensity:1.8,color:K}),e.jsx(sn,{activity:t}),e.jsx(tn,{activity:t}),e.jsx(rn,{activity:t}),e.jsx(nn,{activity:t}),e.jsx(en,{activity:t})]})}const P="#ff183b",le="#ff5870",H="#ffffff";function Ae(t=1){const n=new ee;return n.moveTo(.14*t,1.42),n.quadraticCurveTo(1.18*t,1.08,1.38*t,-1.28),n.quadraticCurveTo(.52*t,-.88,.14*t,1.42),n.closePath(),n}function an({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useMemo(()=>Ae(-1),[]),i=u.useMemo(()=>Ae(1),[]),c=u.useMemo(()=>new Te(o,24),[o]),a=u.useMemo(()=>new Te(i,24),[i]),l=u.useMemo(()=>({depth:.16,bevelEnabled:!0,bevelSize:.04,bevelThickness:.04,bevelSegments:3}),[]),m=u.useMemo(()=>new D(o,l),[o,l]),f=u.useMemo(()=>new D(i,l),[i,l]);return x(({clock:d})=>{const p=d.elapsedTime;n.current&&n.current.scale.setScalar(X(t,p,.4));const h=t==="listening"?.75:t==="thinking"?.92:t==="speaking"?1.08:.96;r.current&&(r.current.scale.y=h+Math.sin(p*2.5)*.035),s.current&&(s.current.scale.y=h+Math.cos(p*2.5)*.035)}),e.jsxs("group",{ref:n,position:[0,.15,.55],children:[e.jsx("mesh",{position:[-.92,0,.02],scale:[1.18,1.18,1],geometry:m,children:e.jsx("meshStandardMaterial",{color:"#3a0009",emissive:P,emissiveIntensity:1.2,metalness:.92,roughness:.18})}),e.jsx("mesh",{position:[.92,0,.02],scale:[1.18,1.18,1],geometry:f,children:e.jsx("meshStandardMaterial",{color:"#3a0009",emissive:P,emissiveIntensity:1.2,metalness:.92,roughness:.18})}),e.jsx("mesh",{ref:r,position:[-.92,0,.14],geometry:c,children:e.jsx("meshBasicMaterial",{color:H,toneMapped:!1})}),e.jsx("mesh",{ref:s,position:[.92,0,.14],geometry:a,children:e.jsx("meshBasicMaterial",{color:H,toneMapped:!1})}),e.jsx("mesh",{position:[-.92,0,.16],scale:[1.04,1.04,1],geometry:c,children:e.jsx("meshBasicMaterial",{color:le,blending:v,depthWrite:!1,opacity:.4,toneMapped:!1,transparent:!0})}),e.jsx("mesh",{position:[.92,0,.16],scale:[1.04,1.04,1],geometry:a,children:e.jsx("meshBasicMaterial",{color:le,blending:v,depthWrite:!1,opacity:.4,toneMapped:!1,transparent:!0})}),e.jsx("pointLight",{color:H,intensity:4,distance:5.5,position:[0,0,.8]}),e.jsx("pointLight",{color:P,intensity:3,distance:4.5,position:[0,0,.4]})]})}function cn({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>Array.from({length:8},(s,o)=>{const i=o<4?-1:1,c=o%4;return{side:i,lane:c}}),[]);return x(({clock:s})=>{if(!n.current)return;const o=s.elapsedTime,i=w(t);n.current.rotation.z=Math.sin(o*.8*i)*.04,n.current.scale.setScalar(.98+b(t)*.07)}),e.jsx("group",{ref:n,position:[0,0,-.2],children:r.map((s,o)=>{const{side:i,lane:c}=s,a=i*(.8+c*.1),l=.6-c*.35,m=i*(1.8+c*.22),f=1.2-c*.48,d=i*(2.8+c*.32),p=.6-c*.68,h=i*(3.6+c*.28),g=.1-c*.82;return e.jsxs("group",{children:[e.jsxs("mesh",{position:[(a+m)/2,(l+f)/2,-.2],children:[e.jsx("boxGeometry",{args:[Math.abs(m-a),.12,.12]}),e.jsx("meshStandardMaterial",{color:"#2a040b",emissive:P,emissiveIntensity:.8,metalness:.9,roughness:.2})]}),e.jsxs("mesh",{position:[m,f,-.2],children:[e.jsx("sphereGeometry",{args:[.1,16,16]}),e.jsx("meshBasicMaterial",{color:H,toneMapped:!1})]}),e.jsxs("mesh",{position:[(m+d)/2,(f+p)/2,-.3],children:[e.jsx("boxGeometry",{args:[Math.abs(d-m),.09,.09]}),e.jsx("meshStandardMaterial",{color:"#2a040b",emissive:le,emissiveIntensity:.7,metalness:.92,roughness:.18})]}),e.jsxs("mesh",{position:[d,p,-.3],children:[e.jsx("sphereGeometry",{args:[.08,16,16]}),e.jsx("meshBasicMaterial",{color:P,toneMapped:!1})]}),e.jsxs("mesh",{position:[(d+h)/2,(p+g)/2,-.4],children:[e.jsx("boxGeometry",{args:[Math.abs(h-d),.06,.06]}),e.jsx("meshStandardMaterial",{color:"#120004",emissive:P,emissiveIntensity:1,metalness:.95,roughness:.12})]})]},o)})})}function ln({activity:t}){const n=u.useRef(null),r=u.useRef(null),{points:s}=u.useMemo(()=>{const o=k(2099),i=[];for(let c=0;c<72;c++)i.push(new j((o()-.5)*6.5,(o()-.5)*5,-.8-o()*1.8));return{points:i}},[]);return x(({clock:o})=>{const i=o.elapsedTime;n.current&&(n.current.rotation.y=Math.sin(i*.18)*.08),r.current&&(r.current.uniforms.uTime.value=i,r.current.uniforms.uEnergy.value=b(t))}),e.jsxs("group",{ref:n,children:[[1.6,2.8,4.2].map((o,i)=>e.jsxs("mesh",{position:[0,0,-.5],rotation:[0,0,i*.5],children:[e.jsx("ringGeometry",{args:[o,o+.02,64]}),e.jsx("meshBasicMaterial",{color:P,blending:v,opacity:.4,transparent:!0,toneMapped:!1})]},i)),e.jsxs("points",{children:[e.jsx("bufferGeometry",{children:e.jsx("bufferAttribute",{attach:"attributes-position",args:[new Float32Array(s.flatMap(o=>[o.x,o.y,o.z])),3]})}),e.jsx("pointsMaterial",{color:H,blending:v,opacity:.75,size:.04,sizeAttenuation:!0,transparent:!0,toneMapped:!1})]}),e.jsxs("mesh",{position:[0,-2.1,-.4],rotation:[-Math.PI/2.6,0,0],scale:[7.8,6.8,1],children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("shaderMaterial",{ref:r,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:`
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
          `,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:v,depthWrite:!1,transparent:!0})]})]})}function un({activity:t}){const n=u.useRef(null);return x(({clock:r},s)=>{n.current&&(n.current.rotation.y=Math.sin(r.elapsedTime*.3)*.12,n.current.rotation.z+=s*.015*w(t))}),e.jsxs("group",{position:[0,.05,-.2],children:[e.jsxs("mesh",{scale:[1.6,1.9,.95],children:[e.jsx("dodecahedronGeometry",{args:[1.02,1]}),e.jsx("meshStandardMaterial",{color:"#080204",emissive:"#28000a",emissiveIntensity:.5,metalness:.9,roughness:.2})]}),e.jsxs("mesh",{ref:n,scale:[1.66,1.98,1.02],children:[e.jsx("dodecahedronGeometry",{args:[1.02,1]}),e.jsx("meshBasicMaterial",{color:P,blending:v,depthWrite:!1,opacity:.35,toneMapped:!1,transparent:!0,wireframe:!0})]})]})}function mn({activity:t="idle"}){return e.jsxs("group",{name:"iron-spider-tactical-hud-mcu",scale:1.28,children:[e.jsx("ambientLight",{intensity:.6,color:P}),e.jsx(ln,{activity:t}),e.jsx(cn,{activity:t}),e.jsx(un,{activity:t}),e.jsx(an,{activity:t})]})}const Ve="#8b3dff",Xe="#e14cff",fn="#eef1ff",dn=`
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,pn=`
  uniform float uTime;
  uniform float uEnergy;
  varying vec2 vUv;

  void main() {
    vec2 p = (vUv - vec2(0.5)) * 2.0;
    p.x *= 1.2;
    float r = length(p);
    float angle = atan(p.y, p.x);

    // Gravitational distortion rings
    float lens1 = smoothstep(0.02, 0.0, abs(r - (0.28 + 0.025 * sin(angle * 5.0 + uTime * 0.4))));
    float lens2 = smoothstep(0.03, 0.0, abs(r - (0.48 + 0.035 * sin(angle * 3.0 - uTime * 0.3))));
    float halo  = smoothstep(0.65, 0.25, r) * smoothstep(0.18, 0.32, r);

    vec3 colDeepViolet = vec3(0.545, 0.239, 1.0); // #8b3dff
    vec3 colNeonMag    = vec3(0.882, 0.298, 1.0); // #e14cff
    vec3 colQuantumIce = vec3(0.933, 0.945, 1.0); // #eef1ff

    vec3 color = mix(colDeepViolet, colNeonMag, lens1 + halo);
    color = mix(color, colQuantumIce, lens2);

    float alpha = (lens1 * 0.8 + lens2 * 0.6 + halo * 0.4) * uEnergy;
    gl_FragColor = vec4(color * 2.2, alpha);
  }
`,hn=`
  uniform float uTime;
  uniform float uSpeed;
  attribute float aSeed;
  varying float vSeed;

  void main() {
    vSeed = aSeed;
    float r = length(position.xy);
    // Inverse square orbital speed physics (1 / r^2)
    float speedFactor = 0.12 + 0.38 / (r * r + 0.05);
    float a = atan(position.y, position.x) + uTime * speedFactor * uSpeed;

    vec3 p = vec3(cos(a) * r, sin(a) * r, position.z + sin(uTime * 2.5 + aSeed * 14.0) * 0.02);
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);

    gl_PointSize = (2.2 + aSeed * 3.2) * (8.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`,gn=`
  uniform float uEnergy;
  varying float vSeed;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float alpha = smoothstep(0.5, 0.0, d);

    vec3 colDeepViolet = vec3(0.545, 0.239, 1.0); // #8b3dff
    vec3 colNeonMag    = vec3(0.882, 0.298, 1.0); // #e14cff
    vec3 colQuantumIce = vec3(0.933, 0.945, 1.0); // #eef1ff

    vec3 color = mix(colDeepViolet, colNeonMag, vSeed);
    color = mix(color, colQuantumIce, pow(vSeed, 2.5));

    gl_FragColor = vec4(color * (1.2 + uEnergy * 0.6), alpha * (0.35 + vSeed * 0.65));
  }
`;function vn({activity:t}){const n=u.useRef(null),r=u.useRef(null);return x(({clock:s},o)=>{const i=s.elapsedTime,c=w(t);n.current&&(n.current.rotation.z+=o*.08*c,n.current.scale.setScalar(X(t,i,1.6))),r.current&&(r.current.uniforms.uTime.value=i,r.current.uniforms.uEnergy.value=b(t))}),e.jsxs("group",{ref:n,children:[e.jsxs("mesh",{position:[0,0,.28],children:[e.jsx("sphereGeometry",{args:[.36,64,64]}),e.jsx("meshBasicMaterial",{color:"#000000",toneMapped:!1})]}),e.jsxs("mesh",{position:[0,0,.2],scale:1.55,children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("shaderMaterial",{ref:r,vertexShader:dn,fragmentShader:pn,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:v,depthWrite:!1,transparent:!0})]})]})}function xn({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=2200,{positions:o,seeds:i}=u.useMemo(()=>{const c=k(7719),a=new Float32Array(s*3),l=new Float32Array(s);for(let m=0;m<s;m++){const f=.52+Math.pow(c(),1.65)*2.2,d=c()*Math.PI*2;a[m*3]=Math.cos(d)*f,a[m*3+1]=Math.sin(d)*f,a[m*3+2]=(c()-.5)*(.035+f*.08),l[m]=c()}return{positions:a,seeds:l}},[]);return x(({clock:c})=>{r.current&&(r.current.uniforms.uTime.value=c.elapsedTime,r.current.uniforms.uSpeed.value=w(t),r.current.uniforms.uEnergy.value=b(t))}),e.jsxs("points",{ref:n,rotation:[1.14,.18,-.28],children:[e.jsxs("bufferGeometry",{children:[e.jsx("bufferAttribute",{attach:"attributes-position",args:[o,3]}),e.jsx("bufferAttribute",{attach:"attributes-aSeed",args:[i,1]})]}),e.jsx("shaderMaterial",{ref:r,vertexShader:hn,fragmentShader:gn,uniforms:{uTime:{value:0},uSpeed:{value:1},uEnergy:{value:1}},blending:v,depthWrite:!1,transparent:!0})]})}function yn({activity:t}){const n=u.useRef(null);return x(({clock:r})=>{if(!n.current)return;const s=r.elapsedTime,o=.85+b(t)*.3+Math.sin(s*5)*.06;n.current.scale.set(1,o,1)}),e.jsxs("group",{ref:n,rotation:[.12,.18,-.28],children:[e.jsxs("mesh",{position:[0,1.85,-.2],children:[e.jsx("coneGeometry",{args:[.1,3.2,24,1,!0]}),e.jsx("meshBasicMaterial",{color:fn,blending:v,depthWrite:!1,opacity:.3,side:U,toneMapped:!1,transparent:!0})]}),e.jsxs("mesh",{position:[0,-1.85,-.2],rotation:[0,0,Math.PI],children:[e.jsx("coneGeometry",{args:[.1,3.2,24,1,!0]}),e.jsx("meshBasicMaterial",{color:Xe,blending:v,depthWrite:!1,opacity:.25,side:U,toneMapped:!1,transparent:!0})]})]})}function Mn({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>new q,[]),s=48,o=u.useMemo(()=>{const i=k(514);return Array.from({length:s},(c,a)=>{const l=a/s*Math.PI*2+i()*.28,m=1.1+i()*2.05;return{angle:l,radius:m,yScale:.12+i()*.38,phase:i()*Math.PI*2,z:-.35+(i()-.5)*2.4}})},[]);return x(({clock:i})=>{if(!n.current)return;const c=i.elapsedTime,a=w(t),l=t==="thinking"?.35+Math.pow(Math.abs(Math.sin(c*.8)),6)*.3:1;o.forEach((m,f)=>{var h;const d=m.angle+c*.04*a*(f%2?1:-1),p=m.radius*l;r.position.set(Math.cos(d)*p,Math.sin(d)*p*.72,m.z+Math.sin(c*.6+m.phase)*.12),r.rotation.set(m.phase+c*.2,d,c*.25+m.phase),r.scale.set(.08,m.yScale,.08),r.updateMatrix(),(h=n.current)==null||h.setMatrixAt(f,r.matrix)}),n.current.instanceMatrix.needsUpdate=!0}),e.jsxs("instancedMesh",{ref:n,args:[void 0,void 0,s],children:[e.jsx("tetrahedronGeometry",{args:[1,0]}),e.jsx("meshPhysicalMaterial",{color:"#7a42ff",emissive:Ve,emissiveIntensity:.8,metalness:.1,roughness:.1,transmission:.45,transparent:!0,opacity:.82})]})}function jn({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>{const s=k(818),o=[];for(let i=0;i<16;i+=1){const c=i/16*Math.PI*2,a=[];for(let l=0;l<=42;l+=1){const m=l/42,f=m>.55?(i%3-1)*(m-.55)*.72:0,d=.48+m*(1.8+s()*.35);a.push(new j(Math.cos(c+f)*d,Math.sin(c+f)*d*.82,-.4-m*.95+Math.sin(m*Math.PI*2+i)*.16))}o.push(a)}return De(o)},[]);return x(({clock:s},o)=>{n.current&&(n.current.rotation.z-=o*.025*w(t),n.current.scale.setScalar(.94+b(t)*.08+Math.sin(s.elapsedTime*.7)*.015))}),e.jsx("group",{ref:n,rotation:[.14,-.2,0],children:e.jsx("lineSegments",{geometry:r,children:e.jsx("lineBasicMaterial",{color:Xe,blending:v,depthWrite:!1,opacity:.4,toneMapped:!1,transparent:!0})})})}function bn({activity:t="idle"}){return e.jsxs("group",{name:"quantum-power-singularity-mcu",scale:1.25,children:[e.jsx("ambientLight",{intensity:.5,color:Ve}),e.jsx(jn,{activity:t}),e.jsx(Mn,{activity:t}),e.jsx(yn,{activity:t}),e.jsx(xn,{activity:t}),e.jsx(vn,{activity:t})]})}const J="#ff7a18",ge="#ffc55c",ue="#8ef7ff",wn="#17100a";function Ce(t){const n=new ee;for(let r=0;r<3;r+=1){const s=Math.PI/2+r*Math.PI*2/3,o=Math.cos(s)*t,i=Math.sin(s)*t;r===0?n.moveTo(o,i):n.lineTo(o,i)}return n.closePath(),n}function Sn({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useMemo(()=>new D(Ce(.85),{depth:.12,bevelEnabled:!0,bevelSize:.04,bevelThickness:.04,bevelSegments:3}),[]),i=u.useMemo(()=>new D(Ce(.52),{depth:.16,bevelEnabled:!0,bevelSize:.03,bevelThickness:.03,bevelSegments:2}),[]);return x(({clock:c},a)=>{const l=c.elapsedTime,m=w(t);n.current&&(n.current.rotation.z=Math.sin(l*.2)*.04,n.current.scale.setScalar(X(t,l))),r.current&&(r.current.rotation.z-=a*.5*m),s.current&&(s.current.uniforms.uTime.value=l,s.current.uniforms.uEnergy.value=b(t))}),e.jsxs("group",{ref:n,rotation:[.02,-.05,0],children:[e.jsx("mesh",{geometry:o,position:[0,0,-.06],children:e.jsx("meshStandardMaterial",{color:wn,emissive:J,emissiveIntensity:.4,metalness:.94,roughness:.18})}),e.jsx("mesh",{geometry:i,position:[0,0,.05],scale:.96,children:e.jsx("shaderMaterial",{ref:s,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:`
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
          `,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:v,depthWrite:!1,toneMapped:!1,transparent:!0})}),e.jsx("group",{ref:r,position:[0,0,.16],children:Array.from({length:9},(c,a)=>{const l=a*Math.PI*2/9;return e.jsxs("mesh",{position:[Math.cos(l)*.28,Math.sin(l)*.28,0],rotation:[0,0,l],children:[e.jsx("boxGeometry",{args:[.3,.038,.038]}),e.jsx("meshBasicMaterial",{color:a%3===0?ue:ge,toneMapped:!1})]},a)})}),e.jsx("pointLight",{color:J,intensity:4,distance:5,position:[0,0,.3]}),e.jsx("pointLight",{color:ue,intensity:2.5,distance:3.5,position:[0,0,.4]})]})}function En({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>new q,[]),s=u.useMemo(()=>{const o=[];for(let i=0;i<3;i+=1){const c=9+i*3;for(let a=0;a<c;a+=1)o.push({angle:a*Math.PI*2/c+i*.18,radius:1.1+i*.35,depth:-.14-i*.18,size:.22+i*.045,phase:a*.47+i})}return o},[]);return x(({clock:o})=>{if(!n.current)return;const i=o.elapsedTime,c=t==="thinking"?.28:t==="speaking"?.15:t==="listening"?-.05:0;s.forEach((a,l)=>{var d;const m=Math.sin(i*1.6+a.phase)*.03,f=a.radius+c+m;r.position.set(Math.cos(a.angle)*f,Math.sin(a.angle)*f*.78,a.depth+Math.sin(i*.8+a.phase)*.08),r.rotation.set(.16*Math.sin(a.phase),-.25,a.angle+Math.PI/2),r.scale.set(a.size*1.45,a.size*.45,.08),r.updateMatrix(),(d=n.current)==null||d.setMatrixAt(l,r.matrix)}),n.current.instanceMatrix.needsUpdate=!0}),e.jsxs("instancedMesh",{ref:n,args:[void 0,void 0,s.length],children:[e.jsx("boxGeometry",{args:[1,1,1]}),e.jsx("meshStandardMaterial",{color:"#140c08",emissive:J,emissiveIntensity:.4,metalness:.92,roughness:.22})]})}function Tn({activity:t}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(()=>[{position:[-2.2,.75,-.4],rotation:[.08,.48,-.04],scale:[1.15,.7,1]},{position:[2.15,.45,-.24],rotation:[-.04,-.52,.06],scale:[.95,.6,1]},{position:[-1.65,-1.35,-.68],rotation:[-.16,.34,-.14],scale:[.8,.44,1]},{position:[1.58,-1.4,-.5],rotation:[.14,-.4,.12],scale:[.88,.48,1]}],[]);return x(({clock:o})=>{n.current&&(n.current.position.y=Math.sin(o.elapsedTime*.45)*.05,n.current.scale.setScalar(.98+b(t)*.025)),r.current&&(r.current.uniforms.uTime.value=o.elapsedTime,r.current.uniforms.uEnergy.value=b(t))}),e.jsx("group",{ref:n,children:s.map((o,i)=>e.jsxs("mesh",{position:o.position,rotation:o.rotation,scale:o.scale,children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("shaderMaterial",{ref:i===0?r:void 0,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:`
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
            `,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:v,depthWrite:!1,side:U,transparent:!0})]},i))})}function Rn({activity:t}){const n=u.useRef(null),r=u.useMemo(()=>{const i=[new j(-1.75,.68,-.2),new j(1.72,.38,-.12),new j(-1.3,-1.08,-.38),new j(1.26,-1.12,-.3)].map((c,a)=>{const l=[];for(let m=0;m<=28;m+=1){const f=m/28;l.push(new j(c.x*f,c.y*f+Math.sin(f*Math.PI)*(a%2?-.24:.24),c.z*f+Math.sin(f*Math.PI*2+a)*.08))}return l});return De(i)},[]),s=u.useMemo(()=>Ue([[new j(0,.85,0),new j(0,2.45,-.45)],[new j(-.08,.78,0),new j(-.56,2.1,-.3)],[new j(.08,.78,0),new j(.6,2.2,-.34)]]),[]);return x(({clock:o})=>{n.current&&(n.current.rotation.z=Math.sin(o.elapsedTime*.16)*.025,n.current.scale.setScalar(.98+b(t)*.025))}),e.jsxs("group",{ref:n,children:[e.jsx("lineSegments",{geometry:r,children:e.jsx("lineBasicMaterial",{color:ge,blending:v,depthWrite:!1,opacity:.65,toneMapped:!1,transparent:!0})}),e.jsx("lineSegments",{geometry:s,children:e.jsx("lineBasicMaterial",{color:ue,blending:v,depthWrite:!1,opacity:.52,toneMapped:!1,transparent:!0})})]})}function Pn({activity:t="idle"}){return e.jsxs("group",{name:"stark-mark-l-arc-reactor",scale:1.25,rotation:[.08,-.18,.025],children:[e.jsx("ambientLight",{color:J,intensity:.5}),e.jsx("directionalLight",{color:ge,intensity:1.8,position:[2.5,3.2,4]}),e.jsx(Tn,{activity:t}),e.jsx(Rn,{activity:t}),e.jsx(En,{activity:t}),e.jsx(Sn,{activity:t})]})}const Ie={gold:"#020100",green:"#000704",blue:"#00040a",red:"#080002",violet:"#02000a",orange:"#080300",spider:"#000408"},zn={blue:.9,green:.94,red:.88,violet:.86,orange:.92,spider:.78};function An(t){return Ie[t]||Ie.gold}function me(t,n){const r=n.getBoundingClientRect(),s=Math.min(r.width,r.height)*.38;if(s<=0)return!1;const o=(t.clientX-(r.left+r.width/2))/s,i=(t.clientY-(r.top+r.height/2))/(s*.94);return o*o+i*i<=1}function Cn({palette:t}){const{gl:n}=de();return u.useEffect(()=>{const r=An(t);n.setClearColor(r,1),n.toneMappingExposure=zn[t]??.94},[n,t]),null}function In({resetSignal:t=0}){const{camera:n,gl:r,size:s}=de(),o=u.useMemo(()=>new nt(n,r.domElement),[n,r]);return u.useEffect(()=>{o.enableDamping=!0,o.dampingFactor=.075,o.enablePan=!1,o.enableZoom=!1,o.enableRotate=!1,o.rotateSpeed=0,o.zoomSpeed=.48,o.minDistance=5.25,o.maxDistance=s.width/s.height<.72?15:8.6,o.target.set(0,0,0),r.domElement.classList.add("is-orbit-enabled");const i=a=>{const l=!document.body.classList.contains("hud-dragging")&&me(a,r.domElement);o.enableZoom=l,r.domElement.classList.toggle("orb-hit-active",l)},c=()=>{o.enableZoom=!1,r.domElement.classList.remove("orb-hit-active")};return r.domElement.addEventListener("pointermove",i,{passive:!0}),r.domElement.addEventListener("pointerleave",c),r.domElement.addEventListener("wheel",i,{capture:!0,passive:!0}),()=>{r.domElement.classList.remove("is-orbit-enabled"),r.domElement.classList.remove("orb-hit-active"),r.domElement.removeEventListener("pointermove",i),r.domElement.removeEventListener("pointerleave",c),r.domElement.removeEventListener("wheel",i,!0),o.dispose()}},[o,r.domElement,s]),u.useEffect(()=>{const c=s.width/s.height<.72?10.8:6.1;n.position.set(0,0,c),o.target.set(0,0,0),o.update()},[n,o,t,s.height,s.width]),x(()=>o.update()),null}function kn(t){return t instanceof HTMLElement?!!t.closest(".hud-dock, .history-panel, .chat-side-panel, .settings-panel, .activity-hub, .prompt-shell, .draggable-panel, .os-taskbar, .os-minimized-dock, button, input, textarea, select"):!1}function Gn({resetSignal:t=0,children:n}){const r=u.useRef(null),{pointer:s,size:o,gl:i}=de(),c=u.useRef(!1),a=u.useRef({active:!1,x:0,y:0,targetX:0,targetY:0,lastX:0,lastY:0});return u.useEffect(()=>{const l=d=>{d.button!==0||d.target!==i.domElement||kn(d.target)||document.body.classList.contains("hud-dragging")||!me(d,i.domElement)||(c.current=!0,a.current.active=!0,a.current.lastX=d.clientX,a.current.lastY=d.clientY,document.body.classList.add("is-reactor-dragging"))},m=d=>{if(c.current=d.target===i.domElement&&!document.body.classList.contains("hud-dragging")&&me(d,i.domElement),!a.current.active)return;const p=d.clientX-a.current.lastX,h=d.clientY-a.current.lastY;a.current.lastX=d.clientX,a.current.lastY=d.clientY,a.current.targetY+=p*.0065,a.current.targetX+=h*.0048,a.current.targetX=T.clamp(a.current.targetX,-.9,.9)},f=()=>{a.current.active=!1,document.body.classList.remove("is-reactor-dragging")};return window.addEventListener("pointerdown",l),window.addEventListener("pointermove",m),window.addEventListener("pointerup",f),window.addEventListener("pointercancel",f),()=>{window.removeEventListener("pointerdown",l),window.removeEventListener("pointermove",m),window.removeEventListener("pointerup",f),window.removeEventListener("pointercancel",f),document.body.classList.remove("is-reactor-dragging")}},[i.domElement]),u.useEffect(()=>{a.current.x=0,a.current.y=0,a.current.targetX=0,a.current.targetY=0},[t]),x(({clock:l})=>{const m=o.width/o.height<.72;if(r.current){a.current.x=T.lerp(a.current.x,a.current.targetX,.09),a.current.y=T.lerp(a.current.y,a.current.targetY,.09);const f=m||!c.current||document.body.classList.contains("hud-dragging")?0:.08;r.current.rotation.x=T.lerp(r.current.rotation.x,a.current.x-s.y*f,.045),r.current.rotation.y=T.lerp(r.current.rotation.y,a.current.y+s.x*f,.045),r.current.rotation.z=0}}),e.jsx("group",{ref:r,children:n})}function _n({activity:t,palette:n}){const r=u.useMemo(()=>{const s=t==="speaking"?1.25:t==="thinking"?1.12:1,o={blue:{intensity:1.32,threshold:.28,smoothing:.52},green:{intensity:1.35,threshold:.26,smoothing:.55},red:{intensity:1.28,threshold:.32,smoothing:.48},violet:{intensity:1.42,threshold:.25,smoothing:.5},orange:{intensity:1.3,threshold:.35,smoothing:.45},spider:{intensity:1.25,threshold:.28,smoothing:.4}},i=o[n]??o.blue;return{...i,intensity:i.intensity*s}},[t,n]);return e.jsx(rt,{multisampling:0,children:e.jsx(st,{intensity:r.intensity,luminanceSmoothing:r.smoothing,luminanceThreshold:r.threshold,mipmapBlur:!0})})}function Bn({activity:t,palette:n,resetSignal:r=0}){const s=et();return e.jsx("div",{className:"orb-webgl","aria-hidden":"true",children:e.jsxs(tt,{camera:{fov:41,near:.1,far:30,position:[0,0,6.1]},dpr:s?1:[1,1.45],frameloop:s?"demand":"always",children:[e.jsx(Cn,{palette:n}),e.jsx(In,{resetSignal:r}),e.jsx(Gn,{resetSignal:r,children:e.jsx(ot,{palette:n,children:o=>o==="gold"?e.jsx(Re,{activity:t,palette:"gold"}):o==="green"?e.jsx(on,{activity:t}):o==="blue"?e.jsx(Ot,{activity:t}):o==="red"?e.jsx(Qt,{activity:t}):o==="violet"?e.jsx(bn,{activity:t}):o==="orange"?e.jsx(Pn,{activity:t}):o==="spider"?e.jsx(mn,{activity:t}):e.jsx(Re,{activity:t,palette:"gold"})})}),e.jsx(_n,{activity:t,palette:n})]})})}export{Bn as default};
