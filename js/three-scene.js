/* ============================================================
   THREE.JS HERO SCENE — floating geometry, particle starfield,
   mouse-responsive lighting & parallax
   ============================================================ */

(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const heroSection = document.getElementById('hero');
  let width = heroSection.clientWidth;
  let height = heroSection.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
  camera.position.z = 26;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);

  /* ---------- Lighting ---------- */
  const ambient = new THREE.AmbientLight(0x404060, 1.2);
  scene.add(ambient);

  const pointLight1 = new THREE.PointLight(0x00f0ff, 3, 60);
  pointLight1.position.set(10, 10, 12);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xa855ff, 3, 60);
  pointLight2.position.set(-12, -8, 10);
  scene.add(pointLight2);

  /* ---------- Floating geometric objects ---------- */
  const geometries = [
    new THREE.IcosahedronGeometry(2.4, 0),
    new THREE.OctahedronGeometry(2, 0),
    new THREE.TorusGeometry(1.7, 0.55, 16, 60),
    new THREE.TetrahedronGeometry(2.1, 0),
    new THREE.DodecahedronGeometry(1.9, 0),
  ];

  const colorPalette = [0x00f0ff, 0xa855ff, 0xff2fb0, 0xffb020];

  const shapes = [];
  const shapeCount = window.innerWidth < 768 ? 5 : 8;

  for (let i = 0; i < shapeCount; i++) {
    const geo = geometries[i % geometries.length];
    const mat = new THREE.MeshStandardMaterial({
      color: colorPalette[i % colorPalette.length],
      wireframe: true,
      transparent: true,
      opacity: 0.55,
      roughness: 0.4,
      metalness: 0.6,
    });
    const mesh = new THREE.Mesh(geo, mat);

    mesh.position.set(
      (Math.random() - 0.5) * 34,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 18 - 4
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

    const scale = 0.5 + Math.random() * 0.7;
    mesh.scale.setScalar(scale);

    mesh.userData = {
      rotSpeedX: (Math.random() - 0.5) * 0.004,
      rotSpeedY: (Math.random() - 0.5) * 0.004,
      floatSpeed: 0.4 + Math.random() * 0.6,
      floatOffset: Math.random() * Math.PI * 2,
      baseY: mesh.position.y,
    };

    scene.add(mesh);
    shapes.push(mesh);
  }

  /* ---------- Starfield particles ---------- */
  const starGeo = new THREE.BufferGeometry();
  const starCount = window.innerWidth < 768 ? 400 : 900;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 90;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 60;
    starPos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0x9db4ff,
    size: 0.09,
    transparent: true,
    opacity: 0.7,
  });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  /* ---------- Mouse-responsive parallax & lighting ---------- */
  let mouseX = 0, mouseY = 0;
  let targetRotX = 0, targetRotY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
    }
  }, { passive: true });

  const clock = new THREE.Clock();

  function animate() {
    const t = clock.getElapsedTime();

    shapes.forEach((mesh) => {
      mesh.rotation.x += mesh.userData.rotSpeedX;
      mesh.rotation.y += mesh.userData.rotSpeedY;
      mesh.position.y = mesh.userData.baseY + Math.sin(t * mesh.userData.floatSpeed + mesh.userData.floatOffset) * 1.2;
    });

    stars.rotation.y += 0.0002;

    targetRotX += (mouseY * 0.15 - targetRotX) * 0.03;
    targetRotY += (mouseX * 0.2 - targetRotY) * 0.03;
    scene.rotation.x = targetRotX;
    scene.rotation.y = targetRotY;

    pointLight1.position.x = 10 + mouseX * 6;
    pointLight1.position.y = 10 + mouseY * 6;
    pointLight2.position.x = -12 - mouseX * 6;
    pointLight2.position.y = -8 - mouseY * 6;

    camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 1.5 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  function onResize() {
    width = heroSection.clientWidth;
    height = heroSection.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener('resize', onResize);

  /* Expose for potential external use */
  window.__heroScene = { scene, camera, renderer };
})();
