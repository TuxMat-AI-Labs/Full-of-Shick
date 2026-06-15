/* Hero 3D scene. A stylized custom-fit mat tray under a single overhead
   light, periodically swept by a laser scan line that reveals a point
   cloud across the surface: the 3D laser scanning story, shown literally.

   Rules of engagement:
   - A delivered heroLoop asset always wins; this module then does nothing.
   - prefers-reduced-motion (or ?static) renders one composed frame, no loop.
   - The render loop pauses when the hero leaves the viewport or the tab hides.
   - If WebGL is unavailable, the CSS-lit gradient hero stands on its own. */

import * as THREE from 'three';

const GOLD = 0xc8a96e;

const container = document.querySelector('.hero-3d');
const heroSection = document.querySelector('.hero');

const reducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  new URLSearchParams(window.location.search).has('static');

function roundedRectShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
  return s;
}

function init() {
  if (!container || (window.ASSETS && window.ASSETS.heroLoop)) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    return; // gradient hero remains
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  const camHome = new THREE.Vector3(1.9, 2.1, 4.0);
  camera.position.copy(camHome);

  /* lights: one overhead key, one warm rim, faint ambience */
  scene.add(new THREE.HemisphereLight(0x2c2e33, 0x0a0b0c, 0.85));
  const key = new THREE.SpotLight(0xffffff, 140, 0, 0.55, 1);
  key.position.set(1.2, 6, 1.8);
  scene.add(key);
  const rim = new THREE.DirectionalLight(GOLD, 1.6);
  rim.position.set(-3.5, 2.2, -2.8);
  scene.add(rim);

  /* the mat tray, staged right of center so the headline owns the left */
  const mat = new THREE.Group();
  mat.position.x = 0.55;
  scene.add(mat);

  const W = 3.4, D = 2.2, R = 0.28, WALL = 0.16;
  const curveSegments = 28;

  const baseGeo = new THREE.ExtrudeGeometry(roundedRectShape(W, D, R), {
    depth: 0.08, bevelEnabled: true, bevelThickness: 0.015,
    bevelSize: 0.015, bevelSegments: 2, curveSegments,
  });
  const base = new THREE.Mesh(
    baseGeo,
    new THREE.MeshStandardMaterial({ color: 0x16181c, roughness: 0.62, metalness: 0.08 })
  );
  base.rotation.x = -Math.PI / 2;
  mat.add(base);

  const wallShape = roundedRectShape(W, D, R);
  const hole = roundedRectShape(W - WALL * 2, D - WALL * 2, Math.max(R - WALL * 0.7, 0.08));
  wallShape.holes.push(new THREE.Path(hole.getPoints(curveSegments)));
  const wallGeo = new THREE.ExtrudeGeometry(wallShape, {
    depth: 0.36, bevelEnabled: true, bevelThickness: 0.012,
    bevelSize: 0.012, bevelSegments: 2, curveSegments,
  });
  const walls = new THREE.Mesh(
    wallGeo,
    new THREE.MeshStandardMaterial({ color: 0x1b1e23, roughness: 0.5, metalness: 0.16 })
  );
  walls.rotation.x = -Math.PI / 2;
  walls.position.y = 0.08;
  mat.add(walls);

  /* engineered ridges across the floor */
  const ridgeMatl = new THREE.MeshStandardMaterial({ color: 0x21242a, roughness: 0.45, metalness: 0.2 });
  const ridgeGeo = new THREE.BoxGeometry(W - WALL * 2 - 0.3, 0.022, 0.05);
  for (let i = 0; i < 7; i++) {
    const ridge = new THREE.Mesh(ridgeGeo, ridgeMatl);
    ridge.position.set(0, 0.105, -0.78 + i * 0.26);
    mat.add(ridge);
  }

  /* scan line and point cloud */
  const innerW = W / 2 - WALL - 0.1;
  const innerD = D / 2 - WALL - 0.1;
  const positions = [];
  for (let ix = 0; ix <= 44; ix++) {
    for (let iz = 0; iz <= 28; iz++) {
      positions.push(
        -innerW + (2 * innerW * ix) / 44,
        0.13,
        -innerD + (2 * innerD * iz) / 28
      );
    }
  }
  const cloudGeo = new THREE.BufferGeometry();
  cloudGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const cloudMatl = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uScan: { value: -10 },
      uFade: { value: 0 },
      uPx: { value: Math.min(window.devicePixelRatio, 2) },
    },
    vertexShader: `
      uniform float uPx;
      varying float vX;
      void main() {
        vX = position.x;
        gl_PointSize = 2.1 * uPx;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform float uScan;
      uniform float uFade;
      varying float vX;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        if (dot(c, c) > 0.25) discard;
        float behind = step(vX, uScan);
        float nearLine = smoothstep(0.45, 0.0, abs(vX - uScan));
        float a = behind * (0.12 + 0.6 * nearLine) * uFade;
        if (a < 0.012) discard;
        gl_FragColor = vec4(0.784, 0.663, 0.431, a);
      }`,
  });
  mat.add(new THREE.Points(cloudGeo, cloudMatl));

  const barMatl = new THREE.MeshBasicMaterial({
    color: GOLD, transparent: true, opacity: 0, blending: THREE.AdditiveBlending,
  });
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.015, D + 0.5), barMatl);
  bar.position.y = 0.5;
  mat.add(bar);

  mat.rotation.y = 0.45;

  function frame(time) {
    /* laser scan cycle: sweep, hold, fade, rest */
    const t = time % 8;
    let scanX = -10, barOpacity = 0, fade = 0;
    if (t >= 0.8 && t < 3.4) {
      const p = (t - 0.8) / 2.6;
      const eased = p * p * (3 - 2 * p);
      scanX = -innerW - 0.2 + (2 * innerW + 0.4) * eased;
      barOpacity = Math.min(1, Math.min(p, 1 - p) * 8) * 0.85;
      fade = 1;
    } else if (t >= 3.4 && t < 6.2) {
      scanX = innerW + 0.3;
      fade = 1 - Math.max(0, (t - 4.6) / 1.6);
    }
    cloudMatl.uniforms.uScan.value = scanX;
    cloudMatl.uniforms.uFade.value = Math.max(0, fade);
    bar.position.x = Math.max(-innerW - 0.2, Math.min(scanX, innerW + 0.2));
    barOpacity *= fade > 0 ? 1 : 0;
    barMatl.opacity = barOpacity;

    /* slow drift, scroll tilt, pointer parallax */
    const scrollP = Math.min(window.scrollY / Math.max(heroSection.offsetHeight, 1), 1);
    mat.rotation.y = 0.45 + Math.sin(time * 0.25) * 0.035 + scrollP * 0.3;
    mat.position.y = Math.sin(time * 0.4) * 0.02 - scrollP * 0.4;
    camera.position.x = camHome.x + pointer.x * 0.22;
    camera.position.y = camHome.y + pointer.y * 0.12 + scrollP * 0.5;
    camera.position.z = camHome.z;
    camera.lookAt(0.3, 0.05, 0);

    renderer.render(scene, camera);
  }

  /* pointer parallax (hover devices only), smoothed */
  const pointer = new THREE.Vector2(0, 0);
  const pointerTarget = new THREE.Vector2(0, 0);
  if (window.matchMedia('(hover: hover)').matches && !reducedMotion) {
    window.addEventListener('pointermove', (e) => {
      pointerTarget.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    }, { passive: true });
  }

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    camHome.z = camera.aspect < 0.9 ? 5.6 : 4.0; // portrait: pull back, keep the mat in frame
    if (reducedMotion) frame(5); // composed static frame: cloud lit, no bar
  }
  new ResizeObserver(resize).observe(container);
  resize();

  if (reducedMotion) {
    cloudMatl.uniforms.uScan.value = 10;
    cloudMatl.uniforms.uFade.value = 0.6;
    frame(5);
    return;
  }

  /* render loop, paused when offscreen or tab hidden */
  let running = true;
  const clock = new THREE.Clock();
  let elapsed = 0;

  function loop() {
    if (!running) return;
    elapsed += Math.min(clock.getDelta(), 0.1);
    pointer.lerp(pointerTarget, 0.06);
    frame(elapsed);
    requestAnimationFrame(loop);
  }

  function setRunning(next) {
    if (next === running) return;
    running = next;
    if (running) { clock.getDelta(); requestAnimationFrame(loop); }
  }

  new IntersectionObserver(
    (entries) => setRunning(entries[0].isIntersecting && !document.hidden)
  ).observe(container);
  document.addEventListener('visibilitychange', () =>
    setRunning(!document.hidden && heroVisible())
  );
  const heroVisible = () => {
    const r = container.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  };

  requestAnimationFrame(loop);
}

init();
