/**
 * Erduo's interactive tool collection.
 * Original sphere dynamics and interaction; rendered with vendored Three.js (MIT).
 * No external media, models, logos, physics engine, or runtime network requests.
 */
import * as THREE from './assets/vendor/three/three.module.min.js';

const section = document.querySelector('[data-toolbox]');
if (section) initialiseToolbox(section);

function initialiseToolbox(section) {
  const mount = section.querySelector('[data-toolbox-canvas]');
  const fallback = section.querySelector('[data-toolbox-fallback]');
  const resetButton = section.querySelector('[data-toolbox-reset]');
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(pointer: fine)');
  const tools = [
    ['Codex', 'CX', '#242227'], ['VidMuse', 'VM', '#7747b7'], ['AI', 'AI', '#0c3738'],
    ['GitHub', 'GH', '#28252e'], ['SRT', 'SRT', '#365882'], ['B-roll', 'BR', '#523082'],
    ['SURGE', 'S', '#8654b5'], ['知识', 'K', '#254f4e'], ['GPT', 'GPT', '#283d3b'],
    ['MCP', 'MCP', '#28292d'], ['Python', 'Py', '#376380'], ['JavaScript', 'JS', '#5f561d'],
    ['导演', 'D', '#41285e'], ['剪辑', 'CUT', '#703763'], ['IP', 'IP', '#4b5489'],
    ['系统', 'SYS', '#285758'], ['Git', 'Git', '#975342'], ['Claude', 'C', '#905f46'],
    ['音频', 'WAV', '#4b4789'], ['视觉', 'ART', '#883f58'], ['React', 'R', '#31758a'],
    ['工作流', 'FLOW', '#45426e'], ['创作', 'MAKE', '#2e4d40'], ['实验', 'LAB', '#705187']
  ];
  const status = {
    frame: 0, drag: 0, pointerHits: 0, collisions: 0, reset: 0,
    interaction: 'idle', visible: false, ready: false, failed: false
  };
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (_) {
    section.dataset.toolboxState = 'fallback';
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 60);
  camera.position.set(0, 0, 15);
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;
  const canvas = renderer.domElement;
  canvas.className = 'toolbox-scene__canvas';
  canvas.tabIndex = 0;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', '个人工具球：' + tools.map(item => item[0]).join('、') + '。鼠标推动，按住球拖动后松开抛出；方向键旋转，空格散开。');
  canvas.setAttribute('aria-describedby', 'toolbox-help');
  mount.append(canvas);

  scene.add(new THREE.HemisphereLight(0xf4efff, 0x655b77, 2.2));
  const keyLight = new THREE.DirectionalLight(0xffffff, 3.3);
  keyLight.position.set(-4, 6, 9);
  scene.add(keyLight);
  const rimLight = new THREE.PointLight(0xb987ff, 72, 30, 2);
  rimLight.position.set(5, 3, -3);
  scene.add(rimLight);
  const fillLight = new THREE.DirectionalLight(0xd6d0ff, 1.0);
  fillLight.position.set(4, -2, 5);
  scene.add(fillLight);

  const geometry = new THREE.SphereGeometry(1, 40, 28);
  const bodies = [];
  const meshes = [];
  const textures = [];
  const materials = [];
  let seed = 83027;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const pointer = new THREE.Vector2(3, 3);
  const raycaster = new THREE.Raycaster();
  const pointerPoint = new THREE.Vector3(30, 30, 1);
  const lastPointerPoint = new THREE.Vector3();
  const pointerVelocity = new THREE.Vector3();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -1);
  const holdPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const dragTarget = new THREE.Vector3();
  const delta = new THREE.Vector3();
  const axis = new THREE.Vector3();
  const rotation = new THREE.Quaternion();
  let held = null;
  let pointerInside = false;
  let gesture = null;
  let raf = 0;
  let previousTime = 0;
  let lastReport = 0;
  let simulationTime = 0;
  let width = 1;
  let height = 1;
  let horizontalBound = 6;
  let verticalBound = 3.8;

  function makeTexture(label, monogram, colour) {
    const art = document.createElement('canvas');
    art.width = 1024;
    art.height = 512;
    const ctx = art.getContext('2d');
    ctx.fillStyle = '#f3f2f5';
    ctx.fillRect(0, 0, art.width, art.height);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const centre of [256, 768]) {
      ctx.fillStyle = colour;
      ctx.font = '600 ' + (monogram.length > 3 ? 66 : 80) + 'px Geist, Arial, sans-serif';
      ctx.fillText(monogram, centre, 242, 188);
      ctx.fillStyle = '#635c70';
      ctx.font = '500 25px Noto, sans-serif';
      ctx.fillText(label, centre, 308, 175);
    }
    const texture = new THREE.CanvasTexture(art);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
    textures.push(texture);
    return texture;
  }

  for (let i = 0; i < tools.length; i++) {
    const radius = .64 + random() * .19;
    const y = 1 - (i / (tools.length - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    const angle = i * 2.39996323;
    const distance = 2.4 + random() * .65;
    const position = new THREE.Vector3(Math.cos(angle) * ring * distance, y * distance, Math.sin(angle) * ring * distance * .7);
    const material = new THREE.MeshPhysicalMaterial({
      map: makeTexture(...tools[i]), color: 0xffffff, roughness: .3,
      metalness: .025, clearcoat: .7, clearcoatRoughness: .28
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.setScalar(radius);
    mesh.rotation.set((random() - .5) * .4, (random() - .5) * .7, (random() - .5) * .32);
    mesh.userData.bodyIndex = i;
    scene.add(mesh);
    materials.push(material);
    meshes.push(mesh);
    bodies.push({
      mesh, position, radius, mass: radius ** 3,
      velocity: new THREE.Vector3((random() - .5) * .4, (random() - .5) * .4, (random() - .5) * .4),
      spin: new THREE.Vector3((random() - .5) * .15, (random() - .5) * .16, (random() - .5) * .12)
    });
  }

  function paused() {
    return root.classList.contains('motion-paused') || reducedMotion.matches;
  }
  function active() {
    return status.ready && !status.failed && status.visible && !document.hidden && !paused();
  }
  function report(force = false) {
    const now = performance.now();
    if (!force && now - lastReport < 240) return;
    lastReport = now;
    section.dataset.toolboxState = status.failed ? 'fallback' : paused() ? 'paused' : active() ? 'running' : 'offscreen';
    section.dataset.toolboxInteraction = status.interaction;
    section.dataset.toolboxFrames = String(status.frame);
    section.dataset.toolboxDrags = String(status.drag);
    section.dataset.toolboxPointerHits = String(status.pointerHits);
    section.dataset.toolboxCollisions = String(status.collisions);
    section.dataset.toolboxResets = String(status.reset);
    section.dataset.toolboxBodies = String(bodies.length);
    section.dataset.toolboxPositions = bodies.slice(0, 5).map(b => [b.position.x, b.position.y, b.position.z].map(n => n.toFixed(2)).join(',')).join(';');
  }

  function physics(dt, warmup = false) {
    simulationTime += dt;
    const damping = Math.exp(-1.3 * dt);
    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i];
      if (body === held) {
        delta.subVectors(dragTarget, body.position);
        body.velocity.copy(delta).multiplyScalar(Math.min(18, 1 / dt));
        body.position.addScaledVector(delta, 1 - Math.exp(-25 * dt));
        continue;
      }
      // A soft attraction keeps the cluster together while leaving it free to collide.
      body.velocity.addScaledVector(body.position, -.94 * dt);
      if (!warmup) {
        body.velocity.x += Math.sin(simulationTime * .55 + i * 1.7) * .12 * dt;
        body.velocity.y += Math.cos(simulationTime * .47 + i * 2.3) * .12 * dt;
      }
      body.velocity.multiplyScalar(damping);
      body.position.addScaledVector(body.velocity, dt);
      // Pointer behaves like a small invisible kinematic sphere.
      if (pointerInside && !held && !gesture?.rotating && !warmup) {
        delta.subVectors(body.position, pointerPoint);
        delta.z *= .48;
        const distance = delta.length();
        const separation = body.radius + .82;
        if (distance > .001 && distance < separation) {
          delta.divideScalar(distance);
          const penetration = separation - distance;
          body.position.addScaledVector(delta, penetration * .24);
          body.velocity.addScaledVector(delta, penetration * 20 * dt);
          body.velocity.addScaledVector(pointerVelocity, Math.min(.055, penetration * .055));
          status.pointerHits++;
        }
      }
      for (const [key, limit] of [['x', horizontalBound], ['y', verticalBound], ['z', 3.3]]) {
        const bound = Math.max(body.radius + .25, limit - body.radius);
        if (Math.abs(body.position[key]) > bound) {
          body.position[key] = Math.sign(body.position[key]) * bound;
          body.velocity[key] *= -.48;
        }
      }
    }
    // Two small position-solving passes avoid visible interpenetration at a low cost.
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < bodies.length; i++) {
        const a = bodies[i];
        for (let j = i + 1; j < bodies.length; j++) {
          const b = bodies[j];
          delta.subVectors(b.position, a.position);
          const length = delta.length();
          const contact = a.radius + b.radius;
          if (length < .0001 || length >= contact) continue;
          delta.divideScalar(length);
          const inverseA = a === held ? 0 : 1 / a.mass;
          const inverseB = b === held ? 0 : 1 / b.mass;
          const total = inverseA + inverseB;
          const overlap = (contact - length) * .84;
          a.position.addScaledVector(delta, -overlap * inverseA / total);
          b.position.addScaledVector(delta, overlap * inverseB / total);
          const approach = (b.velocity.x - a.velocity.x) * delta.x + (b.velocity.y - a.velocity.y) * delta.y + (b.velocity.z - a.velocity.z) * delta.z;
          if (approach < 0) {
            const impulse = -(1 + .38) * approach / total;
            a.velocity.addScaledVector(delta, -impulse * inverseA);
            b.velocity.addScaledVector(delta, impulse * inverseB);
            if (!warmup && pass === 0) status.collisions++;
          }
        }
      }
    }
  }

  function draw(dt = 0) {
    for (const body of bodies) {
      body.mesh.position.copy(body.position);
      // Velocity adds a visible roll to collisions and throws.
      body.mesh.rotation.x += (body.spin.x + body.velocity.y * .13) * dt;
      body.mesh.rotation.y += (body.spin.y + body.velocity.x * .13) * dt;
      body.mesh.rotation.z += body.spin.z * dt;
    }
    renderer.render(scene, camera);
  }
  function animate(time) {
    raf = 0;
    if (!active()) { report(true); return; }
    const elapsed = previousTime ? Math.min((time - previousTime) / 1000, .04) : 1 / 60;
    previousTime = time;
    const steps = Math.max(1, Math.ceil(elapsed / (1 / 90)));
    for (let i = 0; i < steps; i++) physics(elapsed / steps);
    pointerVelocity.multiplyScalar(.8);
    draw(elapsed);
    status.frame++;
    report();
    raf = requestAnimationFrame(animate);
  }
  function syncMotion() {
    resetButton.disabled = paused();
    if (!active()) {
      cancelAnimationFrame(raf);
      raf = 0;
      previousTime = 0;
      endGesture();
      if (!status.failed) draw();
    } else if (!raf) {
      previousTime = 0;
      raf = requestAnimationFrame(animate);
    }
    report(true);
  }
  function resize() {
    const rect = mount.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    camera.aspect = width / height;
    // A narrower screen pulls the camera back; the sphere group stays fully visible.
    camera.position.z = Math.max(14, 12.5 / camera.aspect);
    camera.updateProjectionMatrix();
    const halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    horizontalBound = halfHeight * camera.aspect * .93;
    verticalBound = halfHeight * .9;
    renderer.setSize(width, height, false);
    draw();
  }

  function updatePointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    lastPointerPoint.copy(pointerPoint);
    raycaster.ray.intersectPlane(plane, pointerPoint);
    pointerVelocity.subVectors(pointerPoint, lastPointerPoint).clampLength(0, .8).multiplyScalar(12);
    if (held) {
      raycaster.ray.intersectPlane(holdPlane, dragTarget);
      dragTarget.x = clamp(dragTarget.x, -horizontalBound + held.radius, horizontalBound - held.radius);
      dragTarget.y = clamp(dragTarget.y, -verticalBound + held.radius, verticalBound - held.radius);
    }
  }
  function beginGesture(event) {
    if (!active() || (event.button !== undefined && event.button !== 0)) return;
    updatePointer(event);
    const hit = raycaster.intersectObjects(meshes, false)[0];
    gesture = {
      id: event.pointerId, x: event.clientX, y: event.clientY,
      lastX: event.clientX, lastY: event.clientY,
      body: hit ? bodies[hit.object.userData.bodyIndex] : null,
      touch: event.pointerType === 'touch', committed: false, rotating: false
    };
    if (!gesture.touch) commitGesture(event);
  }
  function commitGesture(event) {
    if (!gesture || gesture.committed) return;
    gesture.committed = true;
    held = gesture.body;
    if (held) {
      holdPlane.constant = -held.position.z;
      dragTarget.copy(held.position);
      status.interaction = 'dragging';
    } else {
      gesture.rotating = true;
      status.interaction = 'rotating';
    }
    status.drag++;
    canvas.classList.add('is-dragging');
    canvas.setPointerCapture(event.pointerId);
    report(true);
  }
  function movePointer(event) {
    if (!active()) return;
    pointerInside = finePointer.matches && event.pointerType !== 'touch';
    updatePointer(event);
    if (gesture) {
      const dx = event.clientX - gesture.lastX;
      const dy = event.clientY - gesture.lastY;
      if (gesture.touch && !gesture.committed) {
        const totalX = Math.abs(event.clientX - gesture.x);
        const totalY = Math.abs(event.clientY - gesture.y);
        if (totalY > totalX && totalY > 7) { endGesture(); return; }
        if (totalX > 8 && totalX > totalY) commitGesture(event);
      }
      if (gesture?.rotating) rotateCluster(dx * .007, dy * .007);
      if (gesture) { gesture.lastX = event.clientX; gesture.lastY = event.clientY; }
    } else if (pointerInside) {
      status.interaction = 'hover';
    }
    report();
  }
  function rotateCluster(x, y) {
    axis.set(y, x, 0);
    const angle = axis.length();
    if (!angle) return;
    rotation.setFromAxisAngle(axis.divideScalar(angle), Math.min(angle, .25));
    for (const body of bodies) {
      body.position.applyQuaternion(rotation);
      body.velocity.applyQuaternion(rotation);
      body.mesh.quaternion.premultiply(rotation);
    }
  }
  function endGesture(event) {
    if (event && gesture && event.pointerId !== gesture.id) return;
    if (held) held.velocity.clampLength(0, 14);
    const capture = gesture?.id;
    held = null;
    gesture = null;
    canvas.classList.remove('is-dragging');
    if (capture !== undefined && canvas.hasPointerCapture(capture)) canvas.releasePointerCapture(capture);
    status.interaction = pointerInside ? 'hover' : 'idle';
    report(true);
  }
  function scatter() {
    if (!active()) return;
    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i];
      delta.copy(body.position).normalize();
      body.velocity.addScaledVector(delta, 6 + (i % 3));
    }
    status.reset++;
    report(true);
  }

  canvas.addEventListener('pointerdown', beginGesture);
  canvas.addEventListener('pointermove', movePointer, { passive: true });
  canvas.addEventListener('pointerup', endGesture);
  canvas.addEventListener('pointercancel', endGesture);
  canvas.addEventListener('lostpointercapture', () => { if (gesture) endGesture(); });
  canvas.addEventListener('pointerleave', () => {
    pointerInside = false;
    if (!gesture) status.interaction = 'idle';
    report(true);
  });
  canvas.addEventListener('keydown', event => {
    if (!active()) return;
    if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); scatter(); }
    else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      rotateCluster(event.key === 'ArrowLeft' ? -.16 : event.key === 'ArrowRight' ? .16 : 0, event.key === 'ArrowUp' ? -.16 : event.key === 'ArrowDown' ? .16 : 0);
      status.drag++;
      report(true);
    }
  });
  resetButton.addEventListener('click', scatter);
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    status.failed = true;
    section.classList.remove('toolbox-ready');
    fallback.removeAttribute('aria-hidden');
    canvas.tabIndex = -1;
    syncMotion();
  });

  const visibilityObserver = new IntersectionObserver(entries => {
    status.visible = entries[0].isIntersecting;
    syncMotion();
  }, { rootMargin: '80px 0px', threshold: 0 });
  visibilityObserver.observe(section);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(mount);
  const motionObserver = new MutationObserver(syncMotion);
  motionObserver.observe(root, { attributes: true, attributeFilter: ['class'] });
  reducedMotion.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);

  // Settle overlaps before the first frame, including when motion is disabled.
  for (let i = 0; i < 120; i++) physics(1 / 90, true);
  for (const body of bodies) body.velocity.multiplyScalar(.25);
  resize();
  status.ready = true;
  section.classList.add('toolbox-ready');
  fallback.setAttribute('aria-hidden', 'true');
  syncMotion();
  // Repaint labels after the site's local typefaces have loaded.
  document.fonts?.ready.then(() => {
    if (status.failed) return;
    for (let i = 0; i < tools.length; i++) {
      const old = materials[i].map;
      materials[i].map = makeTexture(...tools[i]);
      materials[i].needsUpdate = true;
      old.dispose();
    }
    if (!active()) draw();
  });
}
