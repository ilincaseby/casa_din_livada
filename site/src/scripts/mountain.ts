import {
  Color, DirectionalLight, Fog, HemisphereLight, Mesh, MeshStandardMaterial,
  PerspectiveCamera, PlaneGeometry, Scene, WebGLRenderer,
} from "three";

export function createMountain(container: HTMLElement, surface: HTMLElement, onFailure: () => void): () => void {
  const renderer = new WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.domElement.setAttribute("aria-hidden", "true");
  const scene = new Scene();
  scene.background = new Color("#eaf0f2");
  scene.fog = new Fog("#eaf0f2", 16, 44);
  const camera = new PerspectiveCamera(35, 1, 0.1, 80);
  camera.position.set(0, 5.2, 17);
  camera.lookAt(0, 1.4, -4);
  scene.add(new HemisphereLight("#f4f8ff", "#6e8d9d", 2.4));
  const light = new DirectionalLight("#fff5e7", 2.2);
  light.position.set(-10, 14, 8);
  scene.add(light);
  const meshes: Mesh<PlaneGeometry, MeshStandardMaterial>[] = [];
  for (let layer = 0; layer < 3; layer++) {
    const geometry = new PlaneGeometry(48, 16, 128, 40);
    geometry.rotateX(-Math.PI / 2);
    const vertices = geometry.attributes.position;
    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i);
      const z = vertices.getZ(i);
      const ridge = Math.exp(-Math.pow((z + 1) / 3.8, 2));
      const peaks = 1.5
        + 2.4 * Math.exp(-Math.pow((x + 8 - layer * 3) / 4.1, 2))
        + 3.2 * Math.exp(-Math.pow((x - 5 + layer * 2) / 4.8, 2));
      const detail = Math.sin(x * 1.1 + z * .5 + layer) * .22
        + Math.sin(x * 2.3 - z * .8) * .12
        + Math.cos(x * .5 + z * 2) * .17;
      vertices.setY(i, Math.max(0, (peaks + detail) * ridge));
    }
    geometry.computeVertexNormals();
    const material = new MeshStandardMaterial({ color: ["#9ab2bf", "#b2c4cd", "#c5d1d9"][layer], roughness: 1 });
    const mesh = new Mesh(geometry, material);
    mesh.position.set(layer % 2 ? 3 : -2, -.8, -layer * 9);
    scene.add(mesh);
    meshes.push(mesh);
  }
  container.append(renderer.domElement);
  let disposed = false;
  let inView = true;
  let frame = 0;
  let previousTime = 0;
  let x = 0;
  let velocity = 0;
  let target = 0;
  const events = new AbortController();
  const render = () => {
    renderer.render(scene, camera);
    container.dataset.ready = "true";
    container.dataset.frames = String(Number(container.dataset.frames ?? 0) + 1);
  };
  const active = () => !disposed && inView && !document.hidden;
  function tick(time: number) {
    frame = 0;
    if (!active()) return;
    const dt = Math.min((time - previousTime) / 1000 || 1 / 60, 1 / 30);
    previousTime = time;
    velocity += ((target - x) * 100 - velocity * 10) * dt;
    x += velocity * dt;
    camera.position.x = x;
    camera.lookAt(0, 1.4, -4);
    render();
    if (Math.abs(target - x) > .0008 || Math.abs(velocity) > .0008) frame = requestAnimationFrame(tick);
  }
  function requestRender() {
    if (!frame && active()) {
      previousTime = performance.now();
      frame = requestAnimationFrame(tick);
    }
  }
  function pause() {
    cancelAnimationFrame(frame);
    frame = 0;
    container.dataset.rendering = "paused";
  }
  const resize = new ResizeObserver(() => {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height || disposed) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    requestRender();
  });
  resize.observe(container);
  const visibility = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) requestRender(); else pause();
  });
  visibility.observe(surface);
  surface.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    const rect = surface.getBoundingClientRect();
    target = ((event.clientX - rect.left) / rect.width - .5) * .55;
    container.dataset.rendering = "responding";
    requestRender();
  }, { signal: events.signal, passive: true });
  surface.addEventListener("pointerleave", () => { target = 0; requestRender(); }, { signal: events.signal });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause(); else requestRender();
  }, { signal: events.signal });
  renderer.domElement.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    console.warn("Contextul WebGL s-a pierdut. Se afișează posterul static.");
    onFailure();
  }, { signal: events.signal });
  return () => {
    if (disposed) return;
    disposed = true;
    pause();
    events.abort();
    resize.disconnect();
    visibility.disconnect();
    meshes.forEach((mesh) => { mesh.geometry.dispose(); mesh.material.dispose(); });
    renderer.dispose();
    renderer.domElement.remove();
    container.dataset.ready = "false";
  };
}
