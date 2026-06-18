/* Hero 3D scene — iyO Edition.
   A stylized custom-fit mat, centered on a black stage, slowly rotating
   and periodically swept by a laser scan line that reveals a point cloud
   across the surface: the 3D laser-scanning story, shown literally. This
   is the WebGL centerpiece, mirroring iyo.ai's full-screen product canvas.

   - prefers-reduced-motion (or ?static) renders one composed frame.
   - The loop pauses when the tab is hidden.
   - If WebGL is unavailable, the page stands on its own (black stage). */

import * as THREE from 'three';

const container = document.querySelector('[data-hero-3d]');
const reducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  new URLSearchParams(window.location.search).has('static');

function roundedRectShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0);
  s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2);
  s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
  s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
  return s;
}

function init() {
  if (!container) return;

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
  catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
  const camHome = new THREE.Vector3(0, 2.4, 4.4);
  camera.position.copy(camHome);

  scene.add(new THREE.HemisphereLight(0x33363c, 0x070708, 0.9));
  const key = new THREE.SpotLight(0xffffff, 160, 0, 0.55, 1);
  key.position.set(1.0, 6.5, 2.2); scene.add(key);
  const rim = new THREE.DirectionalLight(0xbfc6d0, 1.4);
  rim.position.set(-3.5, 2.0, -3.0); scene.add(rim);

  const mat = new THREE.Group();
  scene.add(mat);

  const W = 3.4, D = 2.2, R = 0.28, WALL = 0.16, curveSegments = 28;

  const base = new THREE.Mesh(
    new THREE.ExtrudeGeometry(roundedRectShape(W, D, R), { depth: 0.08, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2, curveSegments }),
    new THREE.MeshStandardMaterial({ color: 0x121316, roughness: 0.6, metalness: 0.1 })
  );
  base.rotation.x = -Math.PI / 2; mat.add(base);

  const wallShape = roundedRectShape(W, D, R);
  wallShape.holes.push(new THREE.Path(roundedRectShape(W - WALL * 2, D - WALL * 2, Math.max(R - WALL * 0.7, 0.08)).getPoints(curveSegments)));
  const walls = new THREE.Mesh(
    new THREE.ExtrudeGeometry(wallShape, { depth: 0.36, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2, curveSegments }),
    new THREE.MeshStandardMaterial({ color: 0x191c21, roughness: 0.48, metalness: 0.18 })
  );
  walls.rotation.x = -Math.PI / 2; walls.position.y = 0.08; mat.add(walls);

  const ridgeMatl = new THREE.MeshStandardMaterial({ color: 0x20242a, roughness: 0.42, metalness: 0.22 });
  const ridgeGeo = new THREE.BoxGeometry(W - WALL * 2 - 0.3, 0.022, 0.05);
  for (let i = 0; i < 7; i++) { const r = new THREE.Mesh(ridgeGeo, ridgeMatl); r.position.set(0, 0.105, -0.78 + i * 0.26); mat.add(r); }

  const innerW = W / 2 - WALL - 0.1, innerD = D / 2 - WALL - 0.1;
  const positions = [];
  for (let ix = 0; ix <= 44; ix++) for (let iz = 0; iz <= 28; iz++)
    positions.push(-innerW + (2 * innerW * ix) / 44, 0.13, -innerD + (2 * innerD * iz) / 28);
  const cloudGeo = new THREE.BufferGeometry();
  cloudGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const cloudMatl = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uScan: { value: -10 }, uFade: { value: 0 }, uPx: { value: Math.min(window.devicePixelRatio, 2) } },
    vertexShader: `uniform float uPx; varying float vX; void main(){ vX=position.x; gl_PointSize=2.1*uPx; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `uniform float uScan; uniform float uFade; varying float vX; void main(){ vec2 c=gl_PointCoord-0.5; if(dot(c,c)>0.25) discard; float behind=step(vX,uScan); float nearLine=smoothstep(0.45,0.0,abs(vX-uScan)); float a=behind*(0.12+0.7*nearLine)*uFade; if(a<0.012) discard; gl_FragColor=vec4(0.92,0.95,1.0,a); }`,
  });
  mat.add(new THREE.Points(cloudGeo, cloudMatl));

  const barMatl = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.012, D + 0.5), barMatl);
  bar.position.y = 0.5; mat.add(bar);

  mat.rotation.y = 0.5;

  const pointer = new THREE.Vector2(0, 0), pointerTarget = new THREE.Vector2(0, 0);
  if (window.matchMedia('(hover: hover)').matches && !reducedMotion) {
    window.addEventListener('pointermove', (e) => {
      pointerTarget.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    }, { passive: true });
  }

  function frame(time) {
    const t = time % 8;
    let scanX = -10, barOpacity = 0, fade = 0;
    if (t >= 0.8 && t < 3.4) { const p = (t - 0.8) / 2.6, e = p * p * (3 - 2 * p); scanX = -innerW - 0.2 + (2 * innerW + 0.4) * e; barOpacity = Math.min(1, Math.min(p, 1 - p) * 8) * 0.85; fade = 1; }
    else if (t >= 3.4 && t < 6.2) { scanX = innerW + 0.3; fade = 1 - Math.max(0, (t - 4.6) / 1.6); }
    cloudMatl.uniforms.uScan.value = scanX;
    cloudMatl.uniforms.uFade.value = Math.max(0, fade);
    bar.position.x = Math.max(-innerW - 0.2, Math.min(scanX, innerW + 0.2));
    barMatl.opacity = barOpacity * (fade > 0 ? 1 : 0);

    mat.rotation.y = 0.5 + Math.sin(time * 0.22) * 0.28;
    mat.position.y = Math.sin(time * 0.4) * 0.03;
    camera.position.x = camHome.x + pointer.x * 0.3;
    camera.position.y = camHome.y + pointer.y * 0.14;
    camera.lookAt(0, 0.05, 0);
    renderer.render(scene, camera);
  }

  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    camHome.z = camera.aspect < 0.9 ? 6.2 : 4.4;
    camHome.y = camera.aspect < 0.9 ? 2.7 : 2.4;
    if (reducedMotion) frame(5);
  }
  new ResizeObserver(resize).observe(container);
  resize();

  if (reducedMotion) { cloudMatl.uniforms.uScan.value = 10; cloudMatl.uniforms.uFade.value = 0.6; frame(5); return; }

  let running = true;
  const clock = new THREE.Clock(); let elapsed = 0;
  function loop() { if (!running) return; elapsed += Math.min(clock.getDelta(), 0.1); pointer.lerp(pointerTarget, 0.06); frame(elapsed); requestAnimationFrame(loop); }
  function setRunning(n) { if (n === running) return; running = n; if (running) { clock.getDelta(); requestAnimationFrame(loop); } }
  document.addEventListener('visibilitychange', () => setRunning(!document.hidden));
  requestAnimationFrame(loop);
}

init();
