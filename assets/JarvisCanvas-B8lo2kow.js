import{r as u,j as t}from"./index-D35MvfLU.js";import{u as x,M as T,C as _,A as v,I as qe,W as $e,V as j,B as I,F as R,U as Ie,a as Qe,b as z,E as ke,c as me,T as Ge,d as Ke,D as W,O as q,S as ee,e as D,P as Je,f as Ee,g as et,h as tt,i as nt,j as rt,k as fe,l as st,m as ot,w as at}from"./useReducedMotion-BV0ISJd5.js";function it({palette:e,children:n}){const r=u.useRef(null),[s,o]=u.useState(e),i=u.useRef("idle"),c=u.useRef(1);return u.useEffect(()=>{if(e===s)return;i.current="out";const a=window.setTimeout(()=>{c.current=0,o(e),i.current="in"},150);return()=>window.clearTimeout(a)},[e,s]),x((a,l)=>{i.current==="out"?c.current=T.lerp(c.current,0,l*12):i.current==="in"&&(c.current=T.lerp(c.current,1,l*8),c.current>.95&&(c.current=1,i.current="idle")),r.current&&(r.current.scale.setScalar(c.current),r.current.rotation.y=(1-c.current)*Math.PI*.25)}),t.jsx("group",{ref:r,children:n(s)})}const te=new _("#fff8d6"),_e=new _("#d65f10"),ct={gold:["#fff8d6","#d65f10"],green:["#f5fff6","#18bd58"],violet:["#faf5ff","#7c3aed"],orange:["#fff5de","#ed5f12"]};function lt(e){return()=>{let n=e+=1831565813;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}function Fe(e){return e==="speaking"?1.52:e==="thinking"?1.28:e==="listening"?.82:1}function Le(e){return e==="speaking"?1.85:e==="thinking"?1.42:e==="listening"?.46:1}const re={uniforms:{uTime:{value:0},uEnergy:{value:1},uOpacity:{value:1},uColor:{value:te}},vertexShader:`
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
  `};function ut(){return{uniforms:Ie.clone(re.uniforms),vertexShader:re.vertexShader,fragmentShader:re.fragmentShader}}function mt(){const e=lt(60879),n=[],r=[],s=[];for(let i=0;i<42;i+=1){const c=e()*Math.PI*2,a=Math.acos(2*e()-1),l=new j(Math.sin(a)*Math.cos(c),Math.cos(a),Math.sin(a)*Math.sin(c)),m=.24+e()*.32,f=1.04+e()*(i%5===0?1.34:.82),d=l.clone().multiplyScalar(m),p=l.clone().multiplyScalar(f);n.push(d.x,d.y,d.z,p.x,p.y,p.z),r.push(e()*6.28,e()*6.28),s.push(.35+e()*.65,.35+e()*.65)}const o=new I;return o.setAttribute("position",new R(n,3)),o.setAttribute("aPhase",new R(r,1)),o.setAttribute("aIntensity",new R(s,1)),o}function ft({activity:e,flashRef:n}){const r=u.useRef(null),s=u.useRef(null),o=u.useMemo(mt,[]),i=u.useMemo(ut,[]);return x(({clock:c},a)=>{const l=Fe(e)*(1+n.current*2);s.current&&(s.current.uniforms.uTime.value=c.elapsedTime,s.current.uniforms.uEnergy.value=l*(e==="speaking"?1.22:1),s.current.uniforms.uOpacity.value=e==="speaking"?.82:.7,s.current.uniforms.uColor.value.copy(te)),r.current&&(r.current.rotation.y+=a*.055*Le(e),r.current.rotation.x=Math.sin(c.elapsedTime*.18)*.05,r.current.scale.setScalar(1+n.current*.2))}),t.jsx("group",{ref:r,children:t.jsx("lineSegments",{geometry:o,children:t.jsx("shaderMaterial",{ref:s,args:[i],blending:v,depthWrite:!1,toneMapped:!1,transparent:!0})})})}function dt({activity:e,flashRef:n}){const r=u.useRef(null),s=u.useRef(null),o=u.useRef(null),i=u.useRef(null),c=u.useMemo(()=>{const a=new qe(2.02,2),l=new $e(a);return a.dispose(),l},[]);return x(({clock:a},l)=>{const m=a.elapsedTime,f=Le(e),d=Fe(e),p=e==="speaking"?Math.sin(m*7.2)*.035:0,h=e==="thinking"?Math.sin(m*3.4)*.018:0,g=1+p+h+n.current*.075;r.current&&(r.current.rotation.x+=l*.035*f,r.current.rotation.y+=l*.052*f,r.current.rotation.z-=l*.018*f,r.current.scale.setScalar(g)),s.current&&(s.current.rotation.x-=l*.026*f,s.current.rotation.y-=l*.041*f,s.current.rotation.z+=l*.023*f,s.current.scale.setScalar(.91-p*.42+n.current*.035)),o.current&&(o.current.opacity=.2+d*.13+n.current*.24),i.current&&(i.current.opacity=.08+d*.075+n.current*.12)}),t.jsxs("group",{rotation:[.08,-.18,.06],children:[t.jsx("lineSegments",{ref:r,geometry:c,children:t.jsx("lineBasicMaterial",{ref:o,blending:v,color:te,depthWrite:!1,opacity:.34,toneMapped:!1,transparent:!0})}),t.jsx("lineSegments",{ref:s,geometry:c,children:t.jsx("lineBasicMaterial",{ref:i,blending:v,color:_e,depthWrite:!1,opacity:.15,toneMapped:!1,transparent:!0})})]})}function pt({activity:e,palette:n="gold"}){const[r,s]=ct[n];te.set(r),_e.set(s);const[o,i]=u.useState(0),c=u.useRef(0);return u.useEffect(()=>{let a;const l=()=>{i(1),setTimeout(()=>i(0),100);const m=500+Math.random()*2500;e==="thinking"?a=setTimeout(l,m*.5):a=setTimeout(l,m)};return a=setTimeout(l,1e3),()=>clearTimeout(a)},[e]),x((a,l)=>{c.current=T.lerp(c.current,o,l*8)}),t.jsxs("group",{scale:[1.3,.8,1.1],position:[.1,-.05,0],rotation:[.2,.1,-.1],children:[t.jsx(ft,{activity:e,flashRef:c}),t.jsx(dt,{activity:e,flashRef:c})]})}const O=new _("#ff8a18"),S=new _("#ffd15c"),de=new _("#fff8d6"),ae=new _("#b8490b"),pe=new _("#d65f10"),ht={gold:["#ff8a18","#ffd15c","#fff8d6","#b8490b","#d65f10"],green:["#4cff85","#b9ffc9","#f5fff6","#0b4f24","#18bd58"],violet:["#a855f7","#d8b4fe","#faf5ff","#1e0547","#7c3aed"],orange:["#ff7a18","#ffc46b","#fff5de","#7a2608","#ed5f12"]};function gt(e){const[n,r,s,o,i]=ht[e];O.set(n),S.set(r),de.set(s),ae.set(o),pe.set(i)}const P=[{radiusX:.66,radiusZ:.58,seed:11,speed:.33,tilt:[.28,.16,.84],opacity:.64,width:1,packets:3},{radiusX:.88,radiusZ:.74,seed:13,speed:-.26,tilt:[1.1,.04,-.38],opacity:.5,width:1,packets:2},{radiusX:1.06,radiusZ:.98,seed:17,speed:.21,tilt:[.08,.9,.24],opacity:.42,width:1,packets:4},{radiusX:1.28,radiusZ:1.05,seed:19,speed:-.18,tilt:[1.42,.32,.52],opacity:.58,width:1.3,packets:3},{radiusX:1.42,radiusZ:1.34,seed:23,speed:.13,tilt:[.46,1.18,-.2],opacity:.37,width:1,packets:2},{radiusX:1.58,radiusZ:1.18,seed:29,speed:-.11,tilt:[1.28,.82,1.05],opacity:.46,width:1.1,packets:3},{radiusX:1.78,radiusZ:1.58,seed:31,speed:.087,tilt:[.2,.2,1.47],opacity:.32,width:1,packets:2},{radiusX:2.03,radiusZ:1.72,seed:37,speed:-.072,tilt:[1.05,.42,-1.12],opacity:.34,width:1.2,packets:4},{radiusX:2.24,radiusZ:1.86,seed:41,speed:.055,tilt:[.72,1.05,.42],opacity:.28,width:1,packets:3},{radiusX:2.46,radiusZ:2.08,seed:43,speed:-.048,tilt:[1.38,.12,.08],opacity:.25,width:1,packets:2}];function $(e){return()=>{let n=e+=1831565813;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}function C(e){return e==="speaking"?1.52:e==="thinking"?1.28:e==="listening"?.82:1}function F(e){return e==="speaking"?1.85:e==="thinking"?1.42:e==="listening"?.46:1}const se={uniforms:{uTime:{value:0},uEnergy:{value:1},uOpacity:{value:1},uColor:{value:O}},vertexShader:`
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
  `};function Ue(){return{uniforms:Ie.clone(se.uniforms),vertexShader:se.vertexShader,fragmentShader:se.fragmentShader}}function vt(){const e=$(54421),n=[],r=[],s=[];for(let i=0;i<12;i+=1){const c=e()*Math.PI*2,a=Math.acos(2*e()-1),l=new j(Math.sin(a)*Math.cos(c),Math.cos(a),Math.sin(a)*Math.sin(c)),m=i%4===0?2.05+e()*.38:1.1+e()*.66,f=l.clone().multiplyScalar((e()-.5)*.22),d=l.clone().multiplyScalar(-m).add(f),p=l.clone().multiplyScalar(m).add(f.multiplyScalar(.35));n.push(d.x,d.y,d.z,p.x,p.y,p.z),r.push(e()*6.28,e()*6.28),s.push(i%4===0?.92:.44+e()*.32,i%4===0?.92:.44+e()*.32)}const o=new I;return o.setAttribute("position",new R(n,3)),o.setAttribute("aPhase",new R(r,1)),o.setAttribute("aIntensity",new R(s,1)),o}function xt(e){const n=$(e.seed*313),r=[],s=[],o=[],i=240,c=n()*Math.PI*2,a=n()*Math.PI*2;for(let m=0;m<i;m+=1){const f=m/i*Math.PI*2,d=(m+1)/i*Math.PI*2;if(Math.abs(Math.sin((f-c)*1.5))<.13||Math.abs(Math.sin((f-a)*2))<.11||(m+e.seed)%23===0)continue;const h=1+Math.sin(f*5+e.seed)*.018+(n()-.5)*.01,g=1+Math.sin(d*5+e.seed)*.018+(n()-.5)*.01,y=Math.sin(f*3+e.seed)*.025,M=Math.sin(d*3+e.seed)*.025;r.push(Math.cos(f)*e.radiusX*h,y,Math.sin(f)*e.radiusZ*h),r.push(Math.cos(d)*e.radiusX*g,M,Math.sin(d)*e.radiusZ*g),s.push(f+e.seed,d+e.seed),o.push(.55+n()*.45,.55+n()*.45)}const l=new I;return l.setAttribute("position",new R(r,3)),l.setAttribute("aPhase",new R(s,1)),l.setAttribute("aIntensity",new R(o,1)),l}function yt(e){const n=$(e.seed*791),r=[],s=96;for(let o=0;o<s;o+=1){const i=o/s*Math.PI*2,c=1+Math.sin(i*3+e.seed)*.018+(n()-.5)*.008;r.push(new j(Math.cos(i)*e.radiusX*c,Math.sin(i*2+e.seed)*.018,Math.sin(i)*e.radiusZ*c))}return new me(r,!0,"centripetal",.5)}function Mt({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useRef(null);return x(({clock:i},c)=>{const a=i.elapsedTime,l=F(e),m=C(e);if(n.current){const f=e==="speaking"?Math.sin(a*7.2)*.075:Math.sin(a*2.2)*.025;n.current.scale.setScalar((1+f)*(.98+m*.035)),n.current.rotation.y+=c*.18*l}r.current&&(r.current.rotation.x+=c*.42*l),s.current&&(s.current.rotation.y-=c*.34*l),o.current&&(o.current.rotation.z+=c*.27*l)}),t.jsxs("group",{ref:n,children:[t.jsxs("mesh",{children:[t.jsx("sphereGeometry",{args:[.105,32,32]}),t.jsx("meshBasicMaterial",{color:de,toneMapped:!1})]}),t.jsxs("mesh",{scale:1+C(e)*.075,children:[t.jsx("sphereGeometry",{args:[.31,32,32]}),t.jsx("meshBasicMaterial",{blending:v,color:S,depthWrite:!1,opacity:.32,toneMapped:!1,transparent:!0})]}),t.jsxs("mesh",{scale:1.72,children:[t.jsx("sphereGeometry",{args:[.42,32,32]}),t.jsx("meshBasicMaterial",{blending:v,color:O,depthWrite:!1,opacity:.092,toneMapped:!1,transparent:!0})]}),t.jsxs("mesh",{ref:r,rotation:[.3,.2,.1],children:[t.jsx("torusKnotGeometry",{args:[.34,.018,180,5,2,3]}),t.jsx("meshBasicMaterial",{blending:v,color:S,depthWrite:!1,toneMapped:!1})]}),t.jsxs("mesh",{ref:s,rotation:[1.1,.4,.8],scale:1.18,children:[t.jsx("torusKnotGeometry",{args:[.34,.011,180,4,3,5]}),t.jsx("meshBasicMaterial",{blending:v,color:O,depthWrite:!1,opacity:.72,toneMapped:!1,transparent:!0})]}),t.jsxs("mesh",{ref:o,rotation:[.2,1.2,.5],scale:1.42,children:[t.jsx("torusKnotGeometry",{args:[.34,.008,180,4,2,5]}),t.jsx("meshBasicMaterial",{blending:v,color:pe,depthWrite:!1,opacity:.48,toneMapped:!1,transparent:!0})]})]})}function jt({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(vt,[]),o=u.useMemo(Ue,[]);return x(({clock:i},c)=>{r.current&&(r.current.uniforms.uTime.value=i.elapsedTime*1.28,r.current.uniforms.uEnergy.value=C(e)*(e==="speaking"?1.34:.96),r.current.uniforms.uOpacity.value=e==="listening"?.26:e==="speaking"?.48:.38,r.current.uniforms.uColor.value.copy(S)),n.current&&(n.current.rotation.y+=c*.035*F(e),n.current.rotation.z-=c*.018)}),t.jsx("group",{ref:n,children:t.jsx("lineSegments",{geometry:s,children:t.jsx("shaderMaterial",{ref:r,args:[o],blending:v,depthWrite:!1,toneMapped:!1,transparent:!0})})})}function bt({activity:e,index:n,spec:r}){const s=u.useRef(null),o=u.useRef(null),i=u.useMemo(()=>xt(r),[r]),c=u.useMemo(Ue,[]);return x(({clock:a},l)=>{const m=F(e);if(s.current){s.current.rotation.y+=l*r.speed*m,s.current.rotation.z+=l*r.speed*.28*m;const f=1+Math.sin(a.elapsedTime*.8+r.seed)*.004*C(e);s.current.scale.setScalar(f)}o.current&&(o.current.uniforms.uTime.value=a.elapsedTime+n*.71,o.current.uniforms.uEnergy.value=C(e),o.current.uniforms.uOpacity.value=r.opacity,o.current.uniforms.uColor.value.copy(n<3?S:n>6?pe:O))}),t.jsx("group",{ref:s,rotation:r.tilt,children:t.jsx("lineSegments",{geometry:i,children:t.jsx("shaderMaterial",{ref:o,args:[c],blending:v,depthWrite:!1,toneMapped:!1,transparent:!0})})})}function wt({activity:e,index:n,spec:r}){const s=u.useRef(null),o=u.useMemo(()=>new Ge(yt(r),220,r.width*.011,5,!0),[r]);return x(({clock:i},c)=>{if(!s.current)return;const a=F(e);s.current.rotation.y+=c*r.speed*.72*a,s.current.rotation.z+=c*r.speed*.18*a;const l=s.current.material;l.color.copy(n%2===0?S:O),l.opacity=(.32+r.opacity*.58)*(.82+Math.sin(i.elapsedTime*(.95+n*.14)+r.seed)*.18)*C(e)}),t.jsx("group",{rotation:r.tilt,children:t.jsx("mesh",{ref:s,geometry:o,children:t.jsx("meshBasicMaterial",{blending:v,color:S,depthWrite:!1,opacity:.74,toneMapped:!1,transparent:!0})})})}function St({activity:e}){const n=u.useRef(null),r=u.useMemo(()=>{const a=[];return P.forEach((l,m)=>{for(let f=0;f<l.packets;f+=1)a.push({orbit:m,phase:((f+1)/(l.packets+1)+l.seed*.013)%1,speed:Math.abs(l.speed)*(.72+f*.16),size:.045+(f+m)%3*.018,offset:(f-l.packets*.5)*.012})}),a},[]),s=u.useMemo(()=>{const a=new I;return a.setAttribute("position",new z(new Float32Array(r.length*3),3)),a.setAttribute("aSize",new z(new Float32Array(r.map(l=>l.size)),1)),a},[r]),o=u.useMemo(()=>P.map(a=>new Ke().makeRotationFromEuler(new ke(...a.tilt))),[]),i=u.useMemo(()=>new j,[]);x(({clock:a})=>{if(!n.current)return;const l=s.getAttribute("position"),m=F(e);r.forEach((f,d)=>{const p=P[f.orbit],g=(f.phase+a.elapsedTime*f.speed*m)%1*Math.PI*2;i.set(Math.cos(g)*p.radiusX,Math.sin(g*3+p.seed)*.025+f.offset,Math.sin(g)*p.radiusZ),i.applyMatrix4(o[f.orbit]),l.setXYZ(d,i.x,i.y,i.z)}),l.needsUpdate=!0});const c=u.useMemo(()=>({uniforms:{uColor:{value:S}},vertexShader:`
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
      `}),[]);return t.jsx("points",{ref:n,geometry:s,children:t.jsx("shaderMaterial",{args:[c],blending:v,depthWrite:!1,toneMapped:!1,transparent:!0})})}function Et({activity:e}){const n=u.useRef(null);return x(({clock:r})=>{if(!n.current)return;const s=e==="speaking"?Math.sin(r.elapsedTime*6.8)*.018:0;n.current.scale.setScalar(1+s)}),t.jsxs("group",{ref:n,children:[[P[1],P[3],P[5],P[7]].map((r,s)=>t.jsx(wt,{activity:e,index:s,spec:r},`major-${r.seed}`)),P.map((r,s)=>t.jsx(bt,{activity:e,index:s,spec:r},r.seed)),t.jsx(St,{activity:e})]})}function Tt({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(()=>{const i=$(91822),c=760,a=new Float32Array(c*3),l=new Float32Array(c),m=new Float32Array(c);for(let d=0;d<c;d+=1){const p=i()*Math.PI*2,h=.52+Math.pow(i(),1.8)*.92;a[d*3]=Math.cos(p)*h,a[d*3+1]=(i()-.5)*.055,a[d*3+2]=Math.sin(p)*h*(.78+i()*.18),l[d]=p+i()*3,m[d]=1.2+i()*3.8}const f=new I;return f.setAttribute("position",new z(a,3)),f.setAttribute("aPhase",new z(l,1)),f.setAttribute("aSize",new z(m,1)),f},[]),o=u.useMemo(()=>({uniforms:{uTime:{value:0},uEnergy:{value:1},uColor:{value:S}},vertexShader:`
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
      `}),[]);return x(({clock:i},c)=>{r.current&&(r.current.uniforms.uTime.value=i.elapsedTime,r.current.uniforms.uEnergy.value=C(e),r.current.uniforms.uColor.value.copy(S)),n.current&&(n.current.rotation.x=.58+Math.sin(i.elapsedTime*.12)*.035,n.current.rotation.y+=c*.08*F(e),n.current.rotation.z=-.18)}),t.jsx("points",{ref:n,geometry:s,children:t.jsx("shaderMaterial",{ref:r,args:[o],blending:v,depthWrite:!1,toneMapped:!1,transparent:!0})})}function Rt(){const e=$(55123);return Array.from({length:14},(n,r)=>{const s=r/14*Math.PI*2+e()*.32,o=new ke(e()*1.4,e()*1.1,e()*1.2),i=Array.from({length:6},(c,a)=>{const l=a/5,m=.28+l*(1.76+e()*.38),f=s+Math.sin(l*Math.PI*2+r)*.28;return new j(Math.cos(f)*m,Math.sin(l*Math.PI*1.5+r)*.26,Math.sin(f)*m*(.74+e()*.22)).applyEuler(o)});return new me(i,!1,"centripetal",.44)})}function Pt({activity:e}){const n=u.useRef(null),r=u.useMemo(()=>Rt(),[]),s=u.useMemo(()=>Array.from({length:56},(c,a)=>({curve:a%r.length,phase:a*19%56/56,speed:.08+a%6*.012})),[r.length]),o=u.useMemo(()=>{const c=new I;return c.setAttribute("position",new z(new Float32Array(s.length*3),3)),c},[s.length]),i=u.useMemo(()=>new j,[]);return x(({clock:c})=>{if(!n.current)return;const a=o.getAttribute("position"),l=F(e);s.forEach((m,f)=>{const d=(m.phase+c.elapsedTime*m.speed*l)%1;r[m.curve].getPointAt(d,i);const p=e==="speaking"?1+Math.sin(c.elapsedTime*7+f)*.025:1;a.setXYZ(f,i.x*p,i.y*p,i.z*p)}),a.needsUpdate=!0}),t.jsx("points",{ref:n,geometry:o,children:t.jsx("pointsMaterial",{blending:v,color:de,depthWrite:!1,opacity:.76,size:.046,sizeAttenuation:!0,toneMapped:!1,transparent:!0})})}function zt({activity:e}){const n=u.useRef(null),r=u.useMemo(()=>({uniforms:{uEnergy:{value:1},uColor:{value:ae}},vertexShader:`
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
      `}),[]);return x(()=>{n.current&&(n.current.uniforms.uEnergy.value=C(e),n.current.uniforms.uColor.value.copy(ae))}),t.jsxs("mesh",{scale:[1.04,1.04,1.04],children:[t.jsx("sphereGeometry",{args:[2.18,48,48]}),t.jsx("shaderMaterial",{ref:n,args:[r],blending:v,depthWrite:!1,side:Qe,toneMapped:!1,transparent:!0})]})}function Te({activity:e,palette:n="gold"}){return gt(n),t.jsxs("group",{children:[t.jsx(zt,{activity:e}),t.jsx("group",{scale:n==="violet"?.46:1,children:t.jsx(pt,{activity:e,palette:n})}),t.jsx(Pt,{activity:e}),t.jsx(Mt,{activity:e}),t.jsx(Tt,{activity:e}),t.jsx(jt,{activity:e}),t.jsx(Et,{activity:e})]})}function b(e){return e==="speaking"?1.42:e==="thinking"?1.24:e==="listening"?.78:1}function w(e){return e==="speaking"?1.7:e==="thinking"?1.28:e==="listening"?.62:.86}function X(e,n,r=0){const s=e==="speaking"?8.4:e==="thinking"?4.6:e==="listening"?1.2:1.8,o=e==="speaking"?.12:e==="thinking"?.065:e==="listening"?.025:.038;return 1+Math.sin(n*s+r)*o}function k(e){let n=e>>>0;return()=>(n=n*1664525+1013904223>>>0,n/4294967296)}function Be(e){const n=new Float32Array(e.length*6);e.forEach(([s,o],i)=>{const c=i*6;n[c]=s.x,n[c+1]=s.y,n[c+2]=s.z,n[c+3]=o.x,n[c+4]=o.y,n[c+5]=o.z});const r=new I;return r.setAttribute("position",new z(n,3)),r}function We(e){const n=[];return e.forEach(r=>{for(let s=1;s<r.length;s+=1)n.push([r[s-1],r[s]])}),Be(n)}const At="#22b8ff",V="#dcfbff",ie="#0757ff",Ct=`
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
`,kt=`
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Gt=`
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
`,_t=`
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Ft=`
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
`,Lt=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Ut=`
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
`;function Bt({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=e==="speaking"||e==="thinking";return x(({clock:o},i)=>{const c=o.elapsedTime,a=w(e);r.current&&(r.current.rotation.y+=i*.15*a,r.current.rotation.x=Math.sin(c*.3)*.12),n.current&&(n.current.uniforms.uTime.value=c,n.current.uniforms.uEnergy.value=b(e),n.current.uniforms.uArcActivity.value=s?e==="speaking"?1.4:1:.25)}),t.jsxs("group",{children:[t.jsxs("mesh",{ref:r,children:[t.jsx("boxGeometry",{args:[2,2,2]}),t.jsx("meshPhysicalMaterial",{color:"#ffffff",transmission:.85,roughness:.1,metalness:.1,clearcoat:1,clearcoatRoughness:.05,ior:1.52,transparent:!0,opacity:.92,reflectivity:.9})]}),t.jsxs("mesh",{scale:.98,children:[t.jsx("boxGeometry",{args:[1.98,1.98,1.98]}),t.jsx("shaderMaterial",{ref:n,vertexShader:kt,fragmentShader:Gt,uniforms:{uTime:{value:0},uEnergy:{value:1},uArcActivity:{value:.3}},blending:v,depthWrite:!1,side:W,transparent:!0})]})]})}function Wt({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null);return x(({clock:o},i)=>{const c=o.elapsedTime,a=w(e),l=b(e);if(n.current&&(n.current.uniforms.uTime.value=c,n.current.uniforms.uEnergy.value=l),r.current){r.current.rotation.x+=i*.9*a,r.current.rotation.y+=i*1.3*a;const m=.85+Math.sin(c*6)*.05+l*.12;r.current.scale.setScalar(m)}s.current&&(s.current.rotation.z+=i*.4*a,s.current.scale.setScalar(1+Math.sin(c*8)*.08*l))}),t.jsxs("group",{children:[t.jsxs("mesh",{scale:.92,children:[t.jsx("boxGeometry",{args:[1.75,1.75,1.75,12,12,12]}),t.jsx("shaderMaterial",{ref:n,vertexShader:Ct,fragmentShader:It,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:v,depthWrite:!1,side:W,transparent:!0})]}),t.jsxs("mesh",{ref:r,children:[t.jsx("octahedronGeometry",{args:[.18,0]}),t.jsx("meshBasicMaterial",{color:V,toneMapped:!1})]}),t.jsx("group",{ref:s,children:[0,Math.PI/3,2*Math.PI/3].map((o,i)=>t.jsxs("mesh",{rotation:[0,0,o],children:[t.jsx("planeGeometry",{args:[.06,1.8]}),t.jsx("meshBasicMaterial",{color:V,blending:v,depthWrite:!1,opacity:.4,transparent:!0,toneMapped:!1})]},i))})]})}function Dt({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(()=>new q,[]),{geometry:o,vertices:i,edges:c}=u.useMemo(()=>{const l=[];for(let p=0;p<16;p+=1)l.push([p&1?1:-1,p&2?1:-1,p&4?1:-1,p&8?1:-1]);const m=[];for(let p=0;p<l.length;p+=1)for(let h=0;h<4;h+=1){const g=p^1<<h;p<g&&m.push([p,g])}const f=new Float32Array(m.length*6),d=new I;return d.setAttribute("position",new z(f,3)),{geometry:d,vertices:l,edges:m}},[]),a=u.useMemo(()=>new Float32Array(48),[]);return x(({clock:l},m)=>{const f=l.elapsedTime,d=w(e),p=b(e),h=o.attributes.position,g=h.array,y=f*.35*d,M=f*.25*d,N=f*.18*d,ge=Math.cos(y),ve=Math.sin(y),xe=Math.cos(M),ye=Math.sin(M),Me=Math.cos(N),je=Math.sin(N);i.forEach(([L,U,Q,E],Y)=>{let Ne=L*ge-E*ve,G=L*ve+E*ge,Ye=U*xe-G*ye;G=U*ye+G*xe;let Ze=Q*Me-G*je;G=Q*je+G*Me;const ne=1.75/(2.65-G*.38),be=Ne*ne,we=Ye*ne,Se=Ze*ne;if(a[Y*3]=be,a[Y*3+1]=we,a[Y*3+2]=Se,r.current){s.position.set(be,we,Se);const He=(.045+Math.sin(f*8+Y)*.015)*p;s.scale.setScalar(He),s.updateMatrix(),r.current.setMatrixAt(Y,s.matrix)}}),c.forEach(([L,U],Q)=>{const E=Q*6;g[E]=a[L*3],g[E+1]=a[L*3+1],g[E+2]=a[L*3+2],g[E+3]=a[U*3],g[E+4]=a[U*3+1],g[E+5]=a[U*3+2]}),h.needsUpdate=!0,r.current&&(r.current.instanceMatrix.needsUpdate=!0),n.current&&(n.current.rotation.y+=m*.1*d,n.current.scale.setScalar(X(e,f)))}),t.jsxs("group",{rotation:[.2,-.3,.08],children:[t.jsx("lineSegments",{ref:n,geometry:o,children:t.jsx("lineBasicMaterial",{color:V,blending:v,depthWrite:!1,opacity:.9,toneMapped:!1,transparent:!0})}),t.jsx("lineSegments",{geometry:o,scale:1.12,children:t.jsx("lineBasicMaterial",{color:ie,blending:v,depthWrite:!1,opacity:.35,toneMapped:!1,transparent:!0})}),t.jsxs("instancedMesh",{ref:r,args:[void 0,void 0,16],children:[t.jsx("sphereGeometry",{args:[1,12,12]}),t.jsx("meshBasicMaterial",{color:V,toneMapped:!1})]})]})}function Ot({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=600,{positions:o,initialAngles:i,initialRadii:c,speeds:a}=u.useMemo(()=>{const l=k(1088),m=new Float32Array(s*3),f=new Float32Array(s),d=new Float32Array(s),p=new Float32Array(s);for(let h=0;h<s;h++){const g=l()*Math.PI*2,y=.5+l()*3.8,M=-6+l()*8;m[h*3]=Math.cos(g)*y,m[h*3+1]=Math.sin(g)*y,m[h*3+2]=M,f[h]=g,d[h]=y,p[h]=.4+l()*1.2}return{positions:m,initialAngles:f,initialRadii:d,speeds:p}},[]);return x(({clock:l},m)=>{const f=l.elapsedTime,d=w(e);if(n.current&&(n.current.uniforms.uTime.value=f,n.current.uniforms.uEnergy.value=b(e)),r.current){const p=r.current.geometry.attributes.position,h=p.array;for(let g=0;g<s;g++){i[g]+=m*a[g]*.8*d;const y=i[g];let M=h[g*3+2]+m*a[g]*2.2*d;M>2&&(M=-6);const N=c[g]*(1+(M+6)*.15);h[g*3]=Math.cos(y)*N,h[g*3+1]=Math.sin(y)*N,h[g*3+2]=M}p.needsUpdate=!0}}),t.jsxs("group",{position:[0,0,-2.2],children:[t.jsxs("mesh",{rotation:[Math.PI/2,0,0],children:[t.jsx("cylinderGeometry",{args:[.6,4.8,10,32,32,!0]}),t.jsx("shaderMaterial",{ref:n,vertexShader:_t,fragmentShader:Ft,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:v,depthWrite:!1,side:W,transparent:!0})]}),t.jsxs("points",{ref:r,children:[t.jsx("bufferGeometry",{children:t.jsx("bufferAttribute",{attach:"attributes-position",args:[o,3]})}),t.jsx("pointsMaterial",{color:V,blending:v,depthWrite:!1,opacity:.65,size:.032,sizeAttenuation:!0,toneMapped:!1,transparent:!0})]})]})}function Vt({activity:e}){const n=u.useRef(null),r=e==="speaking"?1.6:e==="thinking"?1.1:.2;return x(({clock:s})=>{n.current&&(n.current.uniforms.uTime.value=s.elapsedTime,n.current.uniforms.uEnergy.value=b(e),n.current.uniforms.uPulseIntensity.value=r)}),t.jsx("group",{position:[0,0,-.4],children:[0,.4,.8].map((s,o)=>t.jsxs("mesh",{scale:[4.5+o*.8,4.5+o*.8,1],children:[t.jsx("planeGeometry",{args:[1,1]}),t.jsx("shaderMaterial",{ref:o===0?n:void 0,vertexShader:Lt,fragmentShader:Ut,uniforms:{uTime:{value:s},uEnergy:{value:1},uPulseIntensity:{value:r}},blending:v,depthWrite:!1,transparent:!0})]},o))})}function Xt({activity:e="idle"}){return t.jsxs("group",{name:"mcu-tesseract-space-scene",scale:.92,children:[t.jsx("ambientLight",{intensity:.6,color:ie}),t.jsx("pointLight",{position:[0,0,0],intensity:5,distance:8,color:V}),t.jsx("directionalLight",{position:[5,5,5],intensity:2.2,color:At}),t.jsx("directionalLight",{position:[-5,-5,-5],intensity:1.4,color:ie}),t.jsx(Ot,{activity:e}),t.jsx(Vt,{activity:e}),t.jsx(Dt,{activity:e}),t.jsx(Wt,{activity:e}),t.jsx(Bt,{activity:e})]})}const ce="#ff203c",De="#ff4b56",Nt="#ffc35a",Yt=`
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
`,Zt=`
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
`,Ht=`
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
`;function qt({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useMemo(()=>[{base:[-.65,.25,-.1],scale:[.55,.42,.45],phase:.3},{base:[.6,-.15,.05],scale:[.45,.6,.42],phase:1.5},{base:[.1,.7,-.15],scale:[.38,.5,.35],phase:2.7},{base:[-.15,-.72,-.1],scale:[.42,.48,.38],phase:4.1}],[]);return x(({clock:i},c)=>{const a=i.elapsedTime,l=w(e),m=b(e);n.current&&(n.current.rotation.y+=c*.15*l,n.current.rotation.z=Math.sin(a*.2)*.1,n.current.scale.setScalar(X(e,a,.8))),r.current&&(r.current.uniforms.uTime.value=a,r.current.uniforms.uEnergy.value=m),s.current&&s.current.children.forEach((f,d)=>{const p=o[d];if(!p)return;f.position.set(p.base[0]+Math.sin(a*.8*l+p.phase)*.12,p.base[1]+Math.cos(a*.65*l+p.phase)*.1,p.base[2]+Math.sin(a*.5*l+p.phase)*.14);const h=1+Math.sin(a*3+p.phase)*.1*m;f.scale.set(p.scale[0]*h,p.scale[1]/h,p.scale[2]*h)})}),t.jsxs("group",{position:[0,0,0],children:[t.jsxs("mesh",{ref:n,children:[t.jsx("icosahedronGeometry",{args:[.82,32]}),t.jsx("shaderMaterial",{ref:r,vertexShader:Yt,fragmentShader:Zt,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:v,depthWrite:!1,transparent:!0})]}),t.jsx("group",{ref:s,children:o.map((i,c)=>t.jsxs("mesh",{position:i.base,scale:i.scale,children:[t.jsx("icosahedronGeometry",{args:[1,16]}),t.jsx("meshStandardMaterial",{color:"#3a0009",emissive:c%2===0?ce:De,emissiveIntensity:1.8,metalness:.1,roughness:.3,transparent:!0,opacity:.82})]},c))}),t.jsx("pointLight",{color:ce,intensity:3.5,distance:5,decay:2})]})}function $t({activity:e}){const n=u.useRef(null);return x(({clock:r})=>{n.current&&(n.current.uniforms.uTime.value=r.elapsedTime,n.current.uniforms.uEnergy.value=b(e))}),t.jsxs("mesh",{position:[0,0,-1.6],scale:[5.8,4.4,1],children:[t.jsx("planeGeometry",{args:[1,1]}),t.jsx("shaderMaterial",{ref:n,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:Ht,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:v,depthWrite:!1,transparent:!0})]})}function Qt({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(()=>new q,[]),o=22,i=u.useMemo(()=>{const c=k(2026);return Array.from({length:o},(a,l)=>({angle:l/o*Math.PI*2,radius:2.1+(c()-.5)*.35,height:.7+c()*.5,z:-.6+(c()-.5)*.6,tilt:(c()-.5)*.3,phase:c()*Math.PI*2}))},[]);return x(({clock:c})=>{if(!n.current||!r.current)return;const a=c.elapsedTime,l=w(e);i.forEach((m,f)=>{var y,M;const d=m.angle+a*.03*l,p=Math.sin(a*.8+m.phase)*.08,h=Math.cos(d)*m.radius,g=Math.sin(d)*m.radius*.65+p;s.position.set(h,g,m.z),s.rotation.set(m.tilt,-.2,d+Math.PI/2),s.scale.set(.18,m.height,.12),s.updateMatrix(),(y=n.current)==null||y.setMatrixAt(f,s.matrix),s.position.set(h*1.004,g*1.004,m.z+.07),s.rotation.set(0,0,d+Math.PI/2),s.scale.set(.11,.04,.015),s.updateMatrix(),(M=r.current)==null||M.setMatrixAt(f,s.matrix)}),n.current.instanceMatrix.needsUpdate=!0,r.current.instanceMatrix.needsUpdate=!0}),t.jsxs("group",{rotation:[.15,-.06,.08],children:[t.jsxs("instancedMesh",{ref:n,args:[void 0,void 0,o],children:[t.jsx("boxGeometry",{args:[1,1,1]}),t.jsx("meshStandardMaterial",{color:"#1a0408",emissive:"#4a050d",emissiveIntensity:.6,metalness:.2,roughness:.8})]}),t.jsxs("instancedMesh",{ref:r,args:[void 0,void 0,o],children:[t.jsx("boxGeometry",{args:[1,1,1]}),t.jsx("meshBasicMaterial",{color:Nt,blending:v,depthWrite:!1,toneMapped:!1})]})]})}function Kt({activity:e}){const n=u.useRef(null),r=600,{positions:s,velocities:o}=u.useMemo(()=>{const i=k(8812),c=new Float32Array(r*3),a=new Float32Array(r*3);for(let l=0;l<r;l++)c[l*3]=(i()-.5)*5.5,c[l*3+1]=(i()-.5)*4.5,c[l*3+2]=(i()-.5)*3.5-.3,a[l*3]=(i()-.5)*.4,a[l*3+1]=.3+i()*.8,a[l*3+2]=(i()-.5)*.4;return{positions:c,velocities:a}},[]);return x((i,c)=>{if(!n.current)return;const a=n.current.geometry.attributes.position,l=a.array,m=w(e);for(let f=0;f<r;f++)l[f*3]+=o[f*3]*c*m,l[f*3+1]+=o[f*3+1]*c*m,l[f*3+2]+=o[f*3+2]*c*m,l[f*3+1]>2.5&&(l[f*3+1]=-2.5);a.needsUpdate=!0}),t.jsxs("points",{ref:n,children:[t.jsx("bufferGeometry",{children:t.jsx("bufferAttribute",{attach:"attributes-position",args:[s,3]})}),t.jsx("pointsMaterial",{color:De,blending:v,depthWrite:!1,opacity:.65,size:.035,sizeAttenuation:!0,toneMapped:!1,transparent:!0})]})}function Jt({activity:e="idle"}){return t.jsxs("group",{name:"reality-aether-forge-mcu",scale:.92,children:[t.jsx("ambientLight",{intensity:.5,color:ce}),t.jsx($t,{activity:e}),t.jsx(Kt,{activity:e}),t.jsx(Qt,{activity:e}),t.jsx(qt,{activity:e})]})}const Z="#23e777",K="#66ff9f",en="#e0ffea",B="#8c6721",Re=`
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
`,tn=`
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
`;function oe(e,n,r){const s=new ee,o=e*.14,i=Math.PI*2/n;for(let m=0;m<n;m++){const f=m*i,d=f,p=f+i*.28,h=f+i*.52,g=f+i*.78,y=e,M=e+o;m===0?s.moveTo(Math.cos(d)*y,Math.sin(d)*y):s.lineTo(Math.cos(d)*y,Math.sin(d)*y),s.lineTo(Math.cos(p)*M,Math.sin(p)*M),s.lineTo(Math.cos(h)*M,Math.sin(h)*M),s.lineTo(Math.cos(g)*y,Math.sin(g)*y)}const c=new Je,a=e*.65;for(let m=0;m<=32;m++){const f=m/32*Math.PI*2,d=Math.cos(f)*a,p=Math.sin(f)*a;m===0?c.moveTo(d,p):c.lineTo(d,p)}s.holes.push(c);const l={depth:r,bevelEnabled:!0,bevelSegments:2,steps:1,bevelSize:.015,bevelThickness:.015};return new D(s,l)}function nn({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useRef(0),i=8,c=u.useMemo(()=>{const a=new ee;a.moveTo(0,0),a.quadraticCurveTo(.6,.25,1.1,.05),a.lineTo(1.2,.45),a.quadraticCurveTo(.6,.75,0,.55),a.closePath();const l={depth:.04,bevelEnabled:!0,bevelSize:.01,bevelThickness:.01};return new D(a,l)},[]);return x(({clock:a},l)=>{const m=a.elapsedTime,f=w(e),d=e==="speaking"||e==="thinking"?.88:e==="listening"?.45:.18;if(o.current=T.lerp(o.current,d,.08),n.current&&(n.current.scale.set(X(e,m),e==="listening"?.92:1,1),n.current.rotation.y=Math.sin(m*.25)*.12),r.current&&r.current.children.forEach((p,h)=>{const g=h*Math.PI*2/i,y=o.current*.48,M=o.current*.55;p.position.x=Math.cos(g)*y,p.position.y=Math.sin(g)*y,p.rotation.z=g+M}),s.current){s.current.rotation.y+=l*1.4*f,s.current.rotation.x=Math.sin(m*.8)*.3;const p=.85+b(e)*.18+Math.sin(m*7)*.05;s.current.scale.setScalar(p)}}),t.jsxs("group",{ref:n,children:[t.jsxs("mesh",{position:[0,0,-.05],children:[t.jsx("torusGeometry",{args:[1.35,.08,16,48]}),t.jsx("meshStandardMaterial",{color:B,metalness:.88,roughness:.25,emissive:Z,emissiveIntensity:.15})]}),t.jsx("group",{ref:r,position:[0,0,.02],children:Array.from({length:i},(a,l)=>t.jsx("mesh",{geometry:c,children:t.jsx("meshStandardMaterial",{color:B,metalness:.85,roughness:.22,emissive:Z,emissiveIntensity:.12})},l))}),t.jsxs("mesh",{ref:s,position:[0,0,.18],children:[t.jsx("octahedronGeometry",{args:[.26,1]}),t.jsx("meshStandardMaterial",{color:"#0a8f45",emissive:Z,emissiveIntensity:2.8,metalness:.2,roughness:.05,toneMapped:!1})]}),t.jsx("pointLight",{position:[0,0,.22],color:Z,intensity:4.5,distance:5.5,decay:2})]})}function rn({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=e==="thinking";return x(({clock:i})=>{const c=i.elapsedTime,a=b(e),l=o?-1:1;n.current&&(n.current.uniforms.uTime.value=c,n.current.uniforms.uEnergy.value=a,n.current.uniforms.uDirection.value=l),r.current&&(r.current.uniforms.uTime.value=c*.8,r.current.uniforms.uEnergy.value=a*.9,r.current.uniforms.uDirection.value=-l),s.current&&(s.current.rotation.z=Math.sin(c*.15)*.08)}),t.jsxs("group",{ref:s,children:[t.jsxs("mesh",{position:[0,0,-.12],scale:[3.4,3.4,1],children:[t.jsx("planeGeometry",{args:[1,1]}),t.jsx("shaderMaterial",{ref:n,vertexShader:Re,fragmentShader:Pe,uniforms:{uTime:{value:0},uEnergy:{value:1},uDirection:{value:1}},blending:v,depthWrite:!1,transparent:!0})]}),t.jsxs("mesh",{position:[0,0,-.28],scale:[4.8,4.8,1],children:[t.jsx("planeGeometry",{args:[1,1]}),t.jsx("shaderMaterial",{ref:r,vertexShader:Re,fragmentShader:Pe,uniforms:{uTime:{value:0},uEnergy:{value:1},uDirection:{value:-1}},blending:v,depthWrite:!1,transparent:!0})]})]})}function sn({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useMemo(()=>oe(1.05,12,.08),[]),i=u.useMemo(()=>oe(1.55,18,.08),[]),c=u.useMemo(()=>oe(2.1,24,.08),[]);return x((a,l)=>{const m=w(e),f=e==="thinking"?-1:1;n.current&&(n.current.rotation.z+=l*.35*m*f),r.current&&(r.current.rotation.z-=l*.22*m*f),s.current&&(s.current.rotation.z+=l*.14*m*f)}),t.jsxs("group",{position:[0,0,-.35],children:[t.jsx("mesh",{ref:n,geometry:o,position:[0,0,0],children:t.jsx("meshStandardMaterial",{color:B,metalness:.82,roughness:.28,emissive:K,emissiveIntensity:.25})}),t.jsx("mesh",{ref:r,geometry:i,position:[0,0,-.06],children:t.jsx("meshStandardMaterial",{color:B,metalness:.85,roughness:.25,emissive:Z,emissiveIntensity:.2})}),t.jsx("mesh",{ref:s,geometry:c,position:[0,0,-.12],children:t.jsx("meshStandardMaterial",{color:B,metalness:.88,roughness:.22,emissive:K,emissiveIntensity:.18})})]})}function on({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=48,o=u.useMemo(()=>new q,[]),i=u.useMemo(()=>{const a=[],l=k(452);for(let m=0;m<6;m++){const f=m%2===0?1:-1,d=[];for(let p=0;p<=5;p++){const h=p/5;d.push(new j(f*(.4+h*2.2+l()*.2),(m-2.5)*.45+Math.sin(h*Math.PI*1.5+m)*.4,-.3-h*.8+Math.cos(h*Math.PI)*.3))}a.push(new me(d))}return a},[]),c=u.useMemo(()=>i.map(a=>new Ge(a,40,.018,8,!1)),[i]);return x(({clock:a})=>{const l=a.elapsedTime,m=w(e);n.current&&(n.current.position.z=Math.sin(l*.4)*.06),r.current&&(i.forEach((f,d)=>{var p;for(let h=0;h<8;h++){const g=d*8+h,y=(l*.25*m+h/8+d*.15)%1,M=f.getPoint(y);o.position.copy(M),o.scale.setScalar(.038+Math.sin(y*Math.PI)*.02),o.updateMatrix(),(p=r.current)==null||p.setMatrixAt(g,o.matrix)}}),r.current.instanceMatrix.needsUpdate=!0)}),t.jsxs("group",{ref:n,children:[c.map((a,l)=>t.jsx("mesh",{geometry:a,children:t.jsx("meshBasicMaterial",{color:K,blending:v,depthWrite:!1,opacity:.48,transparent:!0,toneMapped:!1})},l)),t.jsxs("instancedMesh",{ref:r,args:[void 0,void 0,s],children:[t.jsx("sphereGeometry",{args:[1,8,8]}),t.jsx("meshBasicMaterial",{color:en,toneMapped:!1})]})]})}function an({activity:e}){const n=u.useRef(null),r=e==="thinking";return x(({clock:s})=>{n.current&&(n.current.uniforms.uTime.value=s.elapsedTime,n.current.uniforms.uEnergy.value=b(e),n.current.uniforms.uReversing.value=r?1:0)}),t.jsxs("mesh",{position:[0,0,-.08],scale:[4.2,4.2,1],children:[t.jsx("planeGeometry",{args:[1,1]}),t.jsx("shaderMaterial",{ref:n,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:tn,uniforms:{uTime:{value:0},uEnergy:{value:1},uReversing:{value:0}},blending:v,depthWrite:!1,transparent:!0})]})}function cn({activity:e="idle"}){return t.jsxs("group",{name:"agamotto-temporal-eye-scene",scale:.94,children:[t.jsx("ambientLight",{intensity:.5,color:B}),t.jsx("directionalLight",{position:[4,4,4],intensity:1.8,color:K}),t.jsx(an,{activity:e}),t.jsx(rn,{activity:e}),t.jsx(on,{activity:e}),t.jsx(sn,{activity:e}),t.jsx(nn,{activity:e})]})}const A="#ff183b",ln="#ff5870",H="#ffffff";function ze(e=1){const n=new ee;return n.moveTo(.06*e,.62),n.quadraticCurveTo(.5*e,.48,.58*e,-.58),n.quadraticCurveTo(.22*e,-.4,.06*e,.62),n.closePath(),n}function un({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useMemo(()=>ze(-1),[]),i=u.useMemo(()=>ze(1),[]),c=u.useMemo(()=>new Ee(o,16),[o]),a=u.useMemo(()=>new Ee(i,16),[i]),l=u.useMemo(()=>({depth:.08,bevelEnabled:!0,bevelSize:.02,bevelThickness:.02}),[]),m=u.useMemo(()=>new D(o,l),[o,l]),f=u.useMemo(()=>new D(i,l),[i,l]);return x(({clock:d})=>{const p=d.elapsedTime;n.current&&n.current.scale.setScalar(X(e,p,.4));const h=e==="listening"?.68:e==="thinking"?.88:e==="speaking"?1.05:.92;r.current&&(r.current.scale.y=h+Math.sin(p*2.5)*.03),s.current&&(s.current.scale.y=h+Math.cos(p*2.5)*.03)}),t.jsxs("group",{ref:n,position:[0,.12,.42],children:[t.jsx("mesh",{position:[-.43,0,.02],scale:[1.14,1.14,1],geometry:m,children:t.jsx("meshStandardMaterial",{color:"#3a0009",emissive:A,emissiveIntensity:.8,metalness:.9,roughness:.2})}),t.jsx("mesh",{position:[.43,0,.02],scale:[1.14,1.14,1],geometry:f,children:t.jsx("meshStandardMaterial",{color:"#3a0009",emissive:A,emissiveIntensity:.8,metalness:.9,roughness:.2})}),t.jsx("mesh",{ref:r,position:[-.43,0,.08],geometry:c,children:t.jsx("meshBasicMaterial",{color:H,toneMapped:!1})}),t.jsx("mesh",{ref:s,position:[.43,0,.08],geometry:a,children:t.jsx("meshBasicMaterial",{color:H,toneMapped:!1})}),t.jsx("pointLight",{color:H,intensity:2.5,distance:3.5,position:[0,0,.5]})]})}function mn({activity:e}){const n=u.useRef(null),r=u.useMemo(()=>Array.from({length:8},(s,o)=>{const i=o<4?-1:1,c=o%4,a=i*(.45+c*.28);return{side:i,lane:c,angle:a}}),[]);return x(({clock:s})=>{if(!n.current)return;const o=s.elapsedTime,i=w(e);n.current.rotation.z=Math.sin(o*.8*i)*.04,n.current.scale.setScalar(.96+b(e)*.06)}),t.jsx("group",{ref:n,position:[0,0,-.15],children:r.map((s,o)=>{const{side:i,lane:c}=s,a=i*(.5+c*.06),l=.4-c*.25,m=i*(1.2+c*.15),f=.8-c*.35,d=i*(1.8+c*.22),p=.4-c*.48,h=i*(2.4+c*.18),g=.1-c*.55;return t.jsxs("group",{children:[t.jsxs("mesh",{position:[(a+m)/2,(l+f)/2,-.2],children:[t.jsx("boxGeometry",{args:[Math.abs(m-a),.08,.08]}),t.jsx("meshStandardMaterial",{color:"#2a040b",emissive:A,emissiveIntensity:.6,metalness:.88,roughness:.25})]}),t.jsxs("mesh",{position:[m,f,-.2],children:[t.jsx("sphereGeometry",{args:[.07,12,12]}),t.jsx("meshBasicMaterial",{color:H,toneMapped:!1})]}),t.jsxs("mesh",{position:[(m+d)/2,(f+p)/2,-.3],children:[t.jsx("boxGeometry",{args:[Math.abs(d-m),.06,.06]}),t.jsx("meshStandardMaterial",{color:"#2a040b",emissive:ln,emissiveIntensity:.5,metalness:.9,roughness:.2})]}),t.jsxs("mesh",{position:[d,p,-.3],children:[t.jsx("sphereGeometry",{args:[.06,12,12]}),t.jsx("meshBasicMaterial",{color:A,toneMapped:!1})]}),t.jsxs("mesh",{position:[(d+h)/2,(p+g)/2,-.4],children:[t.jsx("boxGeometry",{args:[Math.abs(h-d),.04,.04]}),t.jsx("meshStandardMaterial",{color:"#120004",emissive:A,emissiveIntensity:.8,metalness:.95,roughness:.15})]})]},o)})})}function fn({activity:e}){const n=u.useRef(null),r=u.useRef(null),{points:s}=u.useMemo(()=>{const o=k(2099),i=[];for(let c=0;c<64;c++)i.push(new j((o()-.5)*5.2,(o()-.5)*4,-.8-o()*1.5));return{points:i}},[]);return x(({clock:o})=>{const i=o.elapsedTime;n.current&&(n.current.rotation.y=Math.sin(i*.18)*.08),r.current&&(r.current.uniforms.uTime.value=i,r.current.uniforms.uEnergy.value=b(e))}),t.jsxs("group",{ref:n,children:[[1.2,2.2,3.2].map((o,i)=>t.jsxs("mesh",{position:[0,0,-.5],rotation:[0,0,i*.5],children:[t.jsx("ringGeometry",{args:[o,o+.015,64]}),t.jsx("meshBasicMaterial",{color:A,blending:v,opacity:.35,transparent:!0,toneMapped:!1})]},i)),t.jsxs("points",{children:[t.jsx("bufferGeometry",{children:t.jsx("bufferAttribute",{attach:"attributes-position",args:[new Float32Array(s.flatMap(o=>[o.x,o.y,o.z])),3]})}),t.jsx("pointsMaterial",{color:H,blending:v,opacity:.65,size:.035,sizeAttenuation:!0,transparent:!0,toneMapped:!1})]}),t.jsxs("mesh",{position:[0,-1.55,-.4],rotation:[-Math.PI/2.6,0,0],scale:[6.2,5.6,1],children:[t.jsx("planeGeometry",{args:[1,1]}),t.jsx("shaderMaterial",{ref:r,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:`
            uniform float uTime; uniform float uEnergy; varying vec2 vUv;
            void main(){
              vec2 p = vUv;
              float gx = smoothstep(0.035, 0.0, abs(fract(p.x * 18.0) - 0.5));
              float gy = smoothstep(0.035, 0.0, abs(fract((p.y + uTime * 0.05) * 14.0) - 0.5));
              float fade = smoothstep(0.0, 0.25, p.y) * (1.0 - smoothstep(0.75, 1.0, p.y));
              float scan = smoothstep(0.04, 0.0, abs(p.y - fract(uTime * 0.18)));
              float alpha = (gx + gy) * 0.14 * fade + scan * 0.35;
              gl_FragColor = vec4(vec3(1.0, 0.094, 0.235) * uEnergy, alpha * uEnergy);
            }
          `,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:v,depthWrite:!1,transparent:!0})]})]})}function dn({activity:e}){const n=u.useRef(null);return x(({clock:r},s)=>{n.current&&(n.current.rotation.y=Math.sin(r.elapsedTime*.3)*.12,n.current.rotation.z+=s*.015*w(e))}),t.jsxs("group",{position:[0,.04,-.18],children:[t.jsxs("mesh",{scale:[1.16,1.42,.72],children:[t.jsx("dodecahedronGeometry",{args:[1.02,1]}),t.jsx("meshStandardMaterial",{color:"#080204",emissive:"#200008",emissiveIntensity:.4,metalness:.88,roughness:.25})]}),t.jsxs("mesh",{ref:n,scale:[1.22,1.5,.78],children:[t.jsx("dodecahedronGeometry",{args:[1.02,1]}),t.jsx("meshBasicMaterial",{color:A,blending:v,depthWrite:!1,opacity:.3,toneMapped:!1,transparent:!0,wireframe:!0})]})]})}function pn({activity:e="idle"}){return t.jsxs("group",{name:"iron-spider-tactical-hud",scale:.92,children:[t.jsx("ambientLight",{intensity:.5,color:A}),t.jsx(fn,{activity:e}),t.jsx(mn,{activity:e}),t.jsx(dn,{activity:e}),t.jsx(un,{activity:e})]})}const Oe="#8b3dff",Ve="#e14cff",hn="#eef1ff",gn=`
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,vn=`
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
`,xn=`
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
`,yn=`
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
`;function Mn({activity:e}){const n=u.useRef(null),r=u.useRef(null);return x(({clock:s},o)=>{const i=s.elapsedTime,c=w(e);n.current&&(n.current.rotation.z+=o*.08*c,n.current.scale.setScalar(X(e,i,1.6))),r.current&&(r.current.uniforms.uTime.value=i,r.current.uniforms.uEnergy.value=b(e))}),t.jsxs("group",{ref:n,children:[t.jsxs("mesh",{position:[0,0,.28],children:[t.jsx("sphereGeometry",{args:[.36,64,64]}),t.jsx("meshBasicMaterial",{color:"#000000",toneMapped:!1})]}),t.jsxs("mesh",{position:[0,0,.2],scale:1.55,children:[t.jsx("planeGeometry",{args:[1,1]}),t.jsx("shaderMaterial",{ref:r,vertexShader:gn,fragmentShader:vn,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:v,depthWrite:!1,transparent:!0})]})]})}function jn({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=2200,{positions:o,seeds:i}=u.useMemo(()=>{const c=k(7719),a=new Float32Array(s*3),l=new Float32Array(s);for(let m=0;m<s;m++){const f=.52+Math.pow(c(),1.65)*2.2,d=c()*Math.PI*2;a[m*3]=Math.cos(d)*f,a[m*3+1]=Math.sin(d)*f,a[m*3+2]=(c()-.5)*(.035+f*.08),l[m]=c()}return{positions:a,seeds:l}},[]);return x(({clock:c})=>{r.current&&(r.current.uniforms.uTime.value=c.elapsedTime,r.current.uniforms.uSpeed.value=w(e),r.current.uniforms.uEnergy.value=b(e))}),t.jsxs("points",{ref:n,rotation:[1.14,.18,-.28],children:[t.jsxs("bufferGeometry",{children:[t.jsx("bufferAttribute",{attach:"attributes-position",args:[o,3]}),t.jsx("bufferAttribute",{attach:"attributes-aSeed",args:[i,1]})]}),t.jsx("shaderMaterial",{ref:r,vertexShader:xn,fragmentShader:yn,uniforms:{uTime:{value:0},uSpeed:{value:1},uEnergy:{value:1}},blending:v,depthWrite:!1,transparent:!0})]})}function bn({activity:e}){const n=u.useRef(null);return x(({clock:r})=>{if(!n.current)return;const s=r.elapsedTime,o=.85+b(e)*.3+Math.sin(s*5)*.06;n.current.scale.set(1,o,1)}),t.jsxs("group",{ref:n,rotation:[.12,.18,-.28],children:[t.jsxs("mesh",{position:[0,1.85,-.2],children:[t.jsx("coneGeometry",{args:[.1,3.2,24,1,!0]}),t.jsx("meshBasicMaterial",{color:hn,blending:v,depthWrite:!1,opacity:.3,side:W,toneMapped:!1,transparent:!0})]}),t.jsxs("mesh",{position:[0,-1.85,-.2],rotation:[0,0,Math.PI],children:[t.jsx("coneGeometry",{args:[.1,3.2,24,1,!0]}),t.jsx("meshBasicMaterial",{color:Ve,blending:v,depthWrite:!1,opacity:.25,side:W,toneMapped:!1,transparent:!0})]})]})}function wn({activity:e}){const n=u.useRef(null),r=u.useMemo(()=>new q,[]),s=48,o=u.useMemo(()=>{const i=k(514);return Array.from({length:s},(c,a)=>{const l=a/s*Math.PI*2+i()*.28,m=1.1+i()*2.05;return{angle:l,radius:m,yScale:.12+i()*.38,phase:i()*Math.PI*2,z:-.35+(i()-.5)*2.4}})},[]);return x(({clock:i})=>{if(!n.current)return;const c=i.elapsedTime,a=w(e),l=e==="thinking"?.35+Math.pow(Math.abs(Math.sin(c*.8)),6)*.3:1;o.forEach((m,f)=>{var h;const d=m.angle+c*.04*a*(f%2?1:-1),p=m.radius*l;r.position.set(Math.cos(d)*p,Math.sin(d)*p*.72,m.z+Math.sin(c*.6+m.phase)*.12),r.rotation.set(m.phase+c*.2,d,c*.25+m.phase),r.scale.set(.08,m.yScale,.08),r.updateMatrix(),(h=n.current)==null||h.setMatrixAt(f,r.matrix)}),n.current.instanceMatrix.needsUpdate=!0}),t.jsxs("instancedMesh",{ref:n,args:[void 0,void 0,s],children:[t.jsx("tetrahedronGeometry",{args:[1,0]}),t.jsx("meshPhysicalMaterial",{color:"#7a42ff",emissive:Oe,emissiveIntensity:.8,metalness:.1,roughness:.1,transmission:.45,transparent:!0,opacity:.82})]})}function Sn({activity:e}){const n=u.useRef(null),r=u.useMemo(()=>{const s=k(818),o=[];for(let i=0;i<16;i+=1){const c=i/16*Math.PI*2,a=[];for(let l=0;l<=42;l+=1){const m=l/42,f=m>.55?(i%3-1)*(m-.55)*.72:0,d=.48+m*(1.8+s()*.35);a.push(new j(Math.cos(c+f)*d,Math.sin(c+f)*d*.82,-.4-m*.95+Math.sin(m*Math.PI*2+i)*.16))}o.push(a)}return We(o)},[]);return x(({clock:s},o)=>{n.current&&(n.current.rotation.z-=o*.025*w(e),n.current.scale.setScalar(.94+b(e)*.08+Math.sin(s.elapsedTime*.7)*.015))}),t.jsx("group",{ref:n,rotation:[.14,-.2,0],children:t.jsx("lineSegments",{geometry:r,children:t.jsx("lineBasicMaterial",{color:Ve,blending:v,depthWrite:!1,opacity:.4,toneMapped:!1,transparent:!0})})})}function En({activity:e="idle"}){return t.jsxs("group",{name:"quantum-power-singularity-mcu",scale:.94,children:[t.jsx("ambientLight",{intensity:.5,color:Oe}),t.jsx(Sn,{activity:e}),t.jsx(wn,{activity:e}),t.jsx(bn,{activity:e}),t.jsx(jn,{activity:e}),t.jsx(Mn,{activity:e})]})}const J="#ff7a18",he="#ffc55c",le="#8ef7ff",Tn="#17100a";function Ae(e){const n=new ee;for(let r=0;r<3;r+=1){const s=Math.PI/2+r*Math.PI*2/3,o=Math.cos(s)*e,i=Math.sin(s)*e;r===0?n.moveTo(o,i):n.lineTo(o,i)}return n.closePath(),n}function Rn({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useRef(null),o=u.useMemo(()=>new D(Ae(.85),{depth:.12,bevelEnabled:!0,bevelSize:.04,bevelThickness:.04,bevelSegments:3}),[]),i=u.useMemo(()=>new D(Ae(.52),{depth:.16,bevelEnabled:!0,bevelSize:.03,bevelThickness:.03,bevelSegments:2}),[]);return x(({clock:c},a)=>{const l=c.elapsedTime,m=w(e);n.current&&(n.current.rotation.z=Math.sin(l*.2)*.04,n.current.scale.setScalar(X(e,l))),r.current&&(r.current.rotation.z-=a*.5*m),s.current&&(s.current.uniforms.uTime.value=l,s.current.uniforms.uEnergy.value=b(e))}),t.jsxs("group",{ref:n,rotation:[.02,-.05,0],children:[t.jsx("mesh",{geometry:o,position:[0,0,-.06],children:t.jsx("meshStandardMaterial",{color:Tn,emissive:J,emissiveIntensity:.4,metalness:.94,roughness:.18})}),t.jsx("mesh",{geometry:i,position:[0,0,.05],scale:.96,children:t.jsx("shaderMaterial",{ref:s,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:`
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
          `,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:v,depthWrite:!1,toneMapped:!1,transparent:!0})}),t.jsx("group",{ref:r,position:[0,0,.16],children:Array.from({length:9},(c,a)=>{const l=a*Math.PI*2/9;return t.jsxs("mesh",{position:[Math.cos(l)*.28,Math.sin(l)*.28,0],rotation:[0,0,l],children:[t.jsx("boxGeometry",{args:[.3,.038,.038]}),t.jsx("meshBasicMaterial",{color:a%3===0?le:he,toneMapped:!1})]},a)})}),t.jsx("pointLight",{color:J,intensity:4,distance:5,position:[0,0,.3]}),t.jsx("pointLight",{color:le,intensity:2.5,distance:3.5,position:[0,0,.4]})]})}function Pn({activity:e}){const n=u.useRef(null),r=u.useMemo(()=>new q,[]),s=u.useMemo(()=>{const o=[];for(let i=0;i<3;i+=1){const c=9+i*3;for(let a=0;a<c;a+=1)o.push({angle:a*Math.PI*2/c+i*.18,radius:1.1+i*.35,depth:-.14-i*.18,size:.22+i*.045,phase:a*.47+i})}return o},[]);return x(({clock:o})=>{if(!n.current)return;const i=o.elapsedTime,c=e==="thinking"?.28:e==="speaking"?.15:e==="listening"?-.05:0;s.forEach((a,l)=>{var d;const m=Math.sin(i*1.6+a.phase)*.03,f=a.radius+c+m;r.position.set(Math.cos(a.angle)*f,Math.sin(a.angle)*f*.78,a.depth+Math.sin(i*.8+a.phase)*.08),r.rotation.set(.16*Math.sin(a.phase),-.25,a.angle+Math.PI/2),r.scale.set(a.size*1.45,a.size*.45,.08),r.updateMatrix(),(d=n.current)==null||d.setMatrixAt(l,r.matrix)}),n.current.instanceMatrix.needsUpdate=!0}),t.jsxs("instancedMesh",{ref:n,args:[void 0,void 0,s.length],children:[t.jsx("boxGeometry",{args:[1,1,1]}),t.jsx("meshStandardMaterial",{color:"#140c08",emissive:J,emissiveIntensity:.4,metalness:.92,roughness:.22})]})}function zn({activity:e}){const n=u.useRef(null),r=u.useRef(null),s=u.useMemo(()=>[{position:[-2.2,.75,-.4],rotation:[.08,.48,-.04],scale:[1.15,.7,1]},{position:[2.15,.45,-.24],rotation:[-.04,-.52,.06],scale:[.95,.6,1]},{position:[-1.65,-1.35,-.68],rotation:[-.16,.34,-.14],scale:[.8,.44,1]},{position:[1.58,-1.4,-.5],rotation:[.14,-.4,.12],scale:[.88,.48,1]}],[]);return x(({clock:o})=>{n.current&&(n.current.position.y=Math.sin(o.elapsedTime*.45)*.05,n.current.scale.setScalar(.98+b(e)*.025)),r.current&&(r.current.uniforms.uTime.value=o.elapsedTime,r.current.uniforms.uEnergy.value=b(e))}),t.jsx("group",{ref:n,children:s.map((o,i)=>t.jsxs("mesh",{position:o.position,rotation:o.rotation,scale:o.scale,children:[t.jsx("planeGeometry",{args:[1,1]}),t.jsx("shaderMaterial",{ref:i===0?r:void 0,vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:`
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
            `,uniforms:{uTime:{value:0},uEnergy:{value:1}},blending:v,depthWrite:!1,side:W,transparent:!0})]},i))})}function An({activity:e}){const n=u.useRef(null),r=u.useMemo(()=>{const i=[new j(-1.75,.68,-.2),new j(1.72,.38,-.12),new j(-1.3,-1.08,-.38),new j(1.26,-1.12,-.3)].map((c,a)=>{const l=[];for(let m=0;m<=28;m+=1){const f=m/28;l.push(new j(c.x*f,c.y*f+Math.sin(f*Math.PI)*(a%2?-.24:.24),c.z*f+Math.sin(f*Math.PI*2+a)*.08))}return l});return We(i)},[]),s=u.useMemo(()=>Be([[new j(0,.85,0),new j(0,2.45,-.45)],[new j(-.08,.78,0),new j(-.56,2.1,-.3)],[new j(.08,.78,0),new j(.6,2.2,-.34)]]),[]);return x(({clock:o})=>{n.current&&(n.current.rotation.z=Math.sin(o.elapsedTime*.16)*.025,n.current.scale.setScalar(.98+b(e)*.025))}),t.jsxs("group",{ref:n,children:[t.jsx("lineSegments",{geometry:r,children:t.jsx("lineBasicMaterial",{color:he,blending:v,depthWrite:!1,opacity:.65,toneMapped:!1,transparent:!0})}),t.jsx("lineSegments",{geometry:s,children:t.jsx("lineBasicMaterial",{color:le,blending:v,depthWrite:!1,opacity:.52,toneMapped:!1,transparent:!0})})]})}function Cn({activity:e="idle"}){return t.jsxs("group",{name:"stark-mark-l-arc-reactor",scale:.96,rotation:[.08,-.18,.025],children:[t.jsx("ambientLight",{color:J,intensity:.5}),t.jsx("directionalLight",{color:he,intensity:1.8,position:[2.5,3.2,4]}),t.jsx(zn,{activity:e}),t.jsx(An,{activity:e}),t.jsx(Pn,{activity:e}),t.jsx(Rn,{activity:e})]})}const Ce={gold:"#020100",green:"#000704",blue:"#00040a",red:"#080002",violet:"#02000a",orange:"#080300",spider:"#000408"},In={blue:.9,green:.94,red:.88,violet:.86,orange:.92,spider:.78};function Xe(e){return Ce[e]||Ce.gold}function ue(e,n){const r=n.getBoundingClientRect(),s=Math.min(r.width,r.height)*.38;if(s<=0)return!1;const o=(e.clientX-(r.left+r.width/2))/s,i=(e.clientY-(r.top+r.height/2))/(s*.94);return o*o+i*i<=1}function kn({palette:e}){const{gl:n}=fe();return u.useEffect(()=>{const r=Xe(e);n.setClearColor(r,1),n.toneMappingExposure=In[e]??.94},[n,e]),null}function Gn({resetSignal:e=0}){const{camera:n,gl:r,size:s}=fe(),o=u.useMemo(()=>new st(n,r.domElement),[n,r]);return u.useEffect(()=>{o.enableDamping=!0,o.dampingFactor=.075,o.enablePan=!1,o.enableZoom=!1,o.enableRotate=!1,o.rotateSpeed=0,o.zoomSpeed=.48,o.minDistance=5.25,o.maxDistance=s.width/s.height<.72?15:8.6,o.target.set(0,0,0),r.domElement.classList.add("is-orbit-enabled");const i=a=>{const l=!document.body.classList.contains("hud-dragging")&&ue(a,r.domElement);o.enableZoom=l,r.domElement.classList.toggle("orb-hit-active",l)},c=()=>{o.enableZoom=!1,r.domElement.classList.remove("orb-hit-active")};return r.domElement.addEventListener("pointermove",i,{passive:!0}),r.domElement.addEventListener("pointerleave",c),r.domElement.addEventListener("wheel",i,{capture:!0,passive:!0}),()=>{r.domElement.classList.remove("is-orbit-enabled"),r.domElement.classList.remove("orb-hit-active"),r.domElement.removeEventListener("pointermove",i),r.domElement.removeEventListener("pointerleave",c),r.domElement.removeEventListener("wheel",i,!0),o.dispose()}},[o,r.domElement,s]),u.useEffect(()=>{const c=s.width/s.height<.72?12.9:7.15;n.position.set(0,0,c),o.target.set(0,0,0),o.update()},[n,o,e,s.height,s.width]),x(()=>o.update()),null}function _n(e){return e instanceof HTMLElement?!!e.closest(".hud-dock, .history-panel, .chat-side-panel, .settings-panel, .activity-hub, .prompt-shell, .draggable-panel, .os-taskbar, .os-minimized-dock, button, input, textarea, select"):!1}function Fn({resetSignal:e=0,children:n}){const r=u.useRef(null),{pointer:s,size:o,gl:i}=fe(),c=u.useRef(!1),a=u.useRef({active:!1,x:0,y:0,targetX:0,targetY:0,lastX:0,lastY:0});return u.useEffect(()=>{const l=d=>{d.button!==0||d.target!==i.domElement||_n(d.target)||document.body.classList.contains("hud-dragging")||!ue(d,i.domElement)||(c.current=!0,a.current.active=!0,a.current.lastX=d.clientX,a.current.lastY=d.clientY,document.body.classList.add("is-reactor-dragging"))},m=d=>{if(c.current=d.target===i.domElement&&!document.body.classList.contains("hud-dragging")&&ue(d,i.domElement),!a.current.active)return;const p=d.clientX-a.current.lastX,h=d.clientY-a.current.lastY;a.current.lastX=d.clientX,a.current.lastY=d.clientY,a.current.targetY+=p*.0065,a.current.targetX+=h*.0048,a.current.targetX=T.clamp(a.current.targetX,-.9,.9)},f=()=>{a.current.active=!1,document.body.classList.remove("is-reactor-dragging")};return window.addEventListener("pointerdown",l),window.addEventListener("pointermove",m),window.addEventListener("pointerup",f),window.addEventListener("pointercancel",f),()=>{window.removeEventListener("pointerdown",l),window.removeEventListener("pointermove",m),window.removeEventListener("pointerup",f),window.removeEventListener("pointercancel",f),document.body.classList.remove("is-reactor-dragging")}},[i.domElement]),u.useEffect(()=>{a.current.x=0,a.current.y=0,a.current.targetX=0,a.current.targetY=0},[e]),x(({clock:l})=>{const m=o.width/o.height<.72;if(r.current){a.current.x=T.lerp(a.current.x,a.current.targetX,.09),a.current.y=T.lerp(a.current.y,a.current.targetY,.09);const f=m||!c.current||document.body.classList.contains("hud-dragging")?0:.08;r.current.rotation.x=T.lerp(r.current.rotation.x,a.current.x-s.y*f,.045),r.current.rotation.y=T.lerp(r.current.rotation.y,a.current.y+s.x*f,.045),r.current.rotation.z=0}}),t.jsx("group",{ref:r,children:n})}function Ln({activity:e,palette:n}){const r=u.useMemo(()=>{const s=e==="speaking"?1.18:e==="thinking"?1.08:1,o={blue:{intensity:1.08,threshold:.34,smoothing:.52},green:{intensity:1.16,threshold:.3,smoothing:.58},red:{intensity:.96,threshold:.38,smoothing:.46},violet:{intensity:1.22,threshold:.32,smoothing:.5},orange:{intensity:.92,threshold:.42,smoothing:.42},spider:{intensity:.74,threshold:.5,smoothing:.36}},i=o[n]??o.blue;return{...i,intensity:i.intensity*s}},[e,n]);return t.jsx(ot,{multisampling:0,children:t.jsx(at,{intensity:r.intensity,luminanceSmoothing:r.smoothing,luminanceThreshold:r.threshold,mipmapBlur:!0})})}function Wn({activity:e,palette:n,resetSignal:r=0}){const s=et();return t.jsx("div",{className:"orb-webgl","aria-hidden":"true",children:t.jsxs(tt,{camera:{fov:41,near:.1,far:30,position:[0,0,7.15]},dpr:s?1:[1,1.45],frameloop:s?"demand":"always",gl:{alpha:!1,antialias:!1,powerPreference:"high-performance",stencil:!1},onCreated:({gl:o})=>{o.setClearColor(Xe(n),1),o.outputColorSpace=nt,o.toneMapping=rt,o.toneMappingExposure=.98},children:[t.jsx(kn,{palette:n}),t.jsx(Gn,{resetSignal:r}),t.jsx(Fn,{resetSignal:r,children:t.jsx(it,{palette:n,children:o=>o==="gold"?t.jsx(Te,{activity:e,palette:"gold"}):o==="green"?t.jsx(cn,{activity:e}):o==="blue"?t.jsx(Xt,{activity:e}):o==="red"?t.jsx(Jt,{activity:e}):o==="violet"?t.jsx(En,{activity:e}):o==="orange"?t.jsx(Cn,{activity:e}):o==="spider"?t.jsx(pn,{activity:e}):t.jsx(Te,{activity:e,palette:"gold"})})}),t.jsx(Ln,{activity:e,palette:n})]})})}export{Wn as default};
