/* TuxMat hero3d.js — Three.js WebGL mat scene
   Mirrors iyo.ai's full-screen canvas-w product WebGL:
   - A stylized custom-fit floor mat on a black stage
   - Slowly rotates and bobs
   - Periodically swept by a laser scan line (point cloud reveal)
   - Parallax on pointer/gyro
   - Pauses when tab hidden, honours prefers-reduced-motion
   Targets: .canvas-w.is--home (data-module="webgl") */

import * as THREE from 'three';

const container = document.querySelector('.canvas-w.is--home');
if (!container) throw new Error('no canvas container');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  || new URLSearchParams(window.location.search).has('static');

/* ── rounded-rect shape helper ── */
function rrShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0);
  s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2);
  s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
  s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
  return s;
}

/* ── renderer ── */
let renderer;
try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
catch (e) { console.warn('WebGL unavailable'); }
if (!renderer) { /* graceful — black stage already via CSS */ }
else { bootstrap(); }

function bootstrap() {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 80);
  const camHome = new THREE.Vector3(0, 5.0, 9.5);
  camera.position.copy(camHome);

  /* ── lights ── */
  scene.add(new THREE.HemisphereLight(0x2a2e36, 0x060607, 0.8));
  const key = new THREE.SpotLight(0xffffff, 180, 0, 0.52, 1);
  key.position.set(1.2, 7.0, 2.4); scene.add(key);
  const rim = new THREE.DirectionalLight(0xb0bacc, 1.5);
  rim.position.set(-4.0, 2.0, -3.5); scene.add(rim);
  const fill = new THREE.DirectionalLight(0x8899bb, 0.4);
  fill.position.set(3.0, -1.0, 2.0); scene.add(fill);

  /* ── mat geometry ── */
  const W = 3.5, D = 2.3, R = 0.30, WALL = 0.17, CS = 30;
  const mat = new THREE.Group(); scene.add(mat);

  // Base layer (dark rubber)
  const base = new THREE.Mesh(
    new THREE.ExtrudeGeometry(rrShape(W, D, R), {
      depth: 0.085, bevelEnabled: true,
      bevelThickness: 0.018, bevelSize: 0.018, bevelSegments: 3, curveSegments: CS
    }),
    new THREE.MeshStandardMaterial({ color: 0x0f1115, roughness: 0.65, metalness: 0.08 })
  );
  base.rotation.x = -Math.PI / 2; mat.add(base);

  // Raised lip / walls
  const lipShape = rrShape(W, D, R);
  const inner = new THREE.Path(rrShape(W - WALL * 2, D - WALL * 2, Math.max(R - WALL * 0.7, 0.08)).getPoints(CS));
  lipShape.holes.push(inner);
  const walls = new THREE.Mesh(
    new THREE.ExtrudeGeometry(lipShape, {
      depth: 0.38, bevelEnabled: true,
      bevelThickness: 0.013, bevelSize: 0.013, bevelSegments: 3, curveSegments: CS
    }),
    new THREE.MeshStandardMaterial({ color: 0x161a20, roughness: 0.52, metalness: 0.20 })
  );
  walls.rotation.x = -Math.PI / 2; walls.position.y = 0.085; mat.add(walls);

  // Surface ridges (TriForce™ channels)
  const ridgeMatl = new THREE.MeshStandardMaterial({ color: 0x1e2228, roughness: 0.45, metalness: 0.25 });
  const ridgeGeo = new THREE.BoxGeometry(W - WALL * 2 - 0.32, 0.024, 0.055);
  for (let i = 0; i < 8; i++) {
    const r = new THREE.Mesh(ridgeGeo, ridgeMatl);
    r.position.set(0, 0.11, -0.85 + i * 0.24); mat.add(r);
  }
  // Cross ridges
  const crossGeo = new THREE.BoxGeometry(0.05, 0.022, D - WALL * 2 - 0.3);
  for (let i = 0; i < 5; i++) {
    const c = new THREE.Mesh(crossGeo, ridgeMatl);
    c.position.set(-0.8 + i * 0.4, 0.11, 0); mat.add(c);
  }

  /* ── laser scan point cloud ── */
  const innerW = W / 2 - WALL - 0.1, innerD = D / 2 - WALL - 0.1;
  const pts = [];
  for (let ix = 0; ix <= 50; ix++) for (let iz = 0; iz <= 32; iz++)
    pts.push(-innerW + (2 * innerW * ix) / 50, 0.14, -innerD + (2 * innerD * iz) / 32);

  const cloudGeo = new THREE.BufferGeometry();
  cloudGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  const dpr = Math.min(window.devicePixelRatio, 2);
  const cloudMatl = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uScan: { value: -20 }, uFade: { value: 0 }, uPx: { value: dpr } },
    vertexShader: `
      uniform float uPx; varying float vX;
      void main() {
        vX = position.x;
        gl_PointSize = 2.2 * uPx;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform float uScan; uniform float uFade; varying float vX;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        if (dot(c,c) > 0.25) discard;
        float behind = step(vX, uScan);
        float nearLine = smoothstep(0.5, 0.0, abs(vX - uScan));
        float a = behind * (0.10 + 0.75 * nearLine) * uFade;
        if (a < 0.01) discard;
        gl_FragColor = vec4(0.88, 0.93, 1.0, a);
      }`,
  });
  mat.add(new THREE.Points(cloudGeo, cloudMatl));

  /* scan bar */
  const barMatl = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.014, D + 0.6), barMatl);
  bar.position.y = 0.55; mat.add(bar);

  mat.position.y = -0.3;  /* shift mat down slightly so it reads center-frame */
  mat.rotation.y = 0.55;

  /* ── pointer parallax ── */
  const ptrTarget = new THREE.Vector2(0, 0), ptr = new THREE.Vector2(0, 0);
  if (window.matchMedia('(hover: hover)').matches && !reducedMotion) {
    window.addEventListener('pointermove', e => {
      ptrTarget.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    }, { passive: true });
  }

  /* ── render frame ── */
  function frame(t) {
    const cycle = t % 9;
    let scanX = -20, barOp = 0, fade = 0;

    // Phase 0.8–3.6: scan sweeps left→right
    if (cycle >= 0.8 && cycle < 3.6) {
      const p = (cycle - 0.8) / 2.8, e = p * p * (3 - 2 * p);
      scanX = -innerW - 0.25 + (2 * innerW + 0.5) * e;
      barOp = Math.min(1, Math.min(p, 1 - p) * 8) * 0.85;
      fade = 1;
    }
    // Phase 3.6–7: cloud lingers, fades
    else if (cycle >= 3.6 && cycle < 7) {
      scanX = innerW + 0.4;
      fade = 1 - Math.max(0, (cycle - 5.0) / 2.0);
    }

    cloudMatl.uniforms.uScan.value = scanX;
    cloudMatl.uniforms.uFade.value = Math.max(0, fade);
    bar.position.x = Math.max(-innerW - 0.25, Math.min(scanX, innerW + 0.25));
    barMatl.opacity = barOp * (fade > 0 ? 1 : 0);

    mat.rotation.y = 0.55 + Math.sin(t * 0.20) * 0.30;
    mat.position.y = -0.3 + Math.sin(t * 0.38) * 0.035; /* -0.3 base offset */
    camera.position.x = camHome.x + ptr.x * 0.28;
    camera.position.y = camHome.y + ptr.y * 0.14;
    // aim below the mat so the mat occupies the upper ~40% of the viewport
    const lookY = camera.aspect < 0.65 ? -2.0 : camera.aspect < 0.85 ? -1.4 : -0.8;
    camera.lookAt(0, lookY, 0);
    renderer.render(scene, camera);
  }

  /* ── resize ── */
  function resize() {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // portrait phone: pull way back so mat reads as a floating product object
    // 390×844 → aspect 0.46; target mat ~35% of viewport height
    if (camera.aspect < 0.55) {
      camHome.z = 14.0; camHome.y = 5.5;
    } else if (camera.aspect < 0.75) {
      camHome.z = 10.0; camHome.y = 4.2;
    } else if (camera.aspect < 0.95) {
      camHome.z = 7.5;  camHome.y = 3.4;
    } else {
      camHome.z = 6.0;  camHome.y = 2.8;
    }
    camera.position.copy(camHome);
    if (reducedMotion) frame(5);
  }
  new ResizeObserver(resize).observe(container);
  resize();

  if (reducedMotion) {
    cloudMatl.uniforms.uScan.value = 20;
    cloudMatl.uniforms.uFade.value = 0.55;
    frame(5);
    return;
  }

  /* ── animation loop ── */
  let running = true;
  const clock = new THREE.Clock(); let elapsed = 0;
  function loop() {
    if (!running) return;
    elapsed += Math.min(clock.getDelta(), 0.1);
    ptr.lerp(ptrTarget, 0.055);
    frame(elapsed);
    requestAnimationFrame(loop);
  }
  function setRunning(v) {
    if (v === running) return;
    running = v;
    if (running) { clock.getDelta(); requestAnimationFrame(loop); }
  }
  document.addEventListener('visibilitychange', () => setRunning(!document.hidden));
  requestAnimationFrame(loop);
}
