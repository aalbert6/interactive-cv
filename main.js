import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { openCard, isCardOpen, setCardLanguage } from './cards.js';

let currentLang = localStorage.getItem('lang') || 'es';
let activeCardId = null;
const idleHintEl = document.getElementById('idle-hint');
const IDLE_DELAY = 120000; // 2 minutos
let idleTimer = null;

const translations = {
  es: {
    about: 'Sobre mí',
    skills: 'Habilidades',
    education: 'Educación',
    experience: 'Experiencia',
    projects: 'Proyectos',
    certifications: 'Certificaciones',
    competencies: 'Competencias',
    languages: 'Idiomas',
    contact: 'Contacto',
    language: 'Idioma',
    appearance: 'Apariencia',
    darkMode: 'Modo oscuro',
    idleHint: 'Interactúa con los objetos para descubrir información'
  },
  ca: {
    about: 'Sobre mi',
    skills: 'Habilitats',
    education: 'Educació',
    experience: 'Experiència',
    projects: 'Projectes',
    certifications: 'Certificacions',
    competencies: 'Competències',
    languages: 'Idiomes',
    contact: 'Contacte',
    language: 'Idioma',
    appearance: 'Aparença',
    darkMode: 'Mode fosc',
    idleHint: 'Interactua amb els objectes per descobrir informació'
  },
  en: {
    about: 'About',
    skills: 'Skills',
    education: 'Education',
    experience: 'Experience',
    projects: 'Projects',
    certifications: 'Certifications',
    competencies: 'Competencies',
    languages: 'Languages',
    contact: 'Contact',
    language: 'Language',
    appearance: 'Appearance',
    darkMode: 'Dark mode',
    idleHint: 'Interact with objects to explore'
  }
};
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a102b); // Morado oscuro estilo voxel

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-6, 3, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);
const monitorLight = new THREE.PointLight(0x00aaff, 1.2, 3);
monitorLight.position.set(-2.55, 1.68, -2.98);
scene.add(monitorLight);

// Principal plano
const screenPlaneGeo = new THREE.PlaneGeometry(0.82, 0.53); // ajusta tamaño
const screenPlaneMat = new THREE.MeshStandardMaterial({
  color: 0x111111,
  emissive: 0x00aaff,
  emissiveIntensity: 3
});
const screenPlane = new THREE.Mesh(screenPlaneGeo, screenPlaneMat);
screenPlane.position.set(-2.55, 1.767, -2.9699); // coloca frente al monitor real
scene.add(screenPlane);

// Plano derecho pequeño 1
const screenPlaneGeo2 = new THREE.PlaneGeometry(0.25, 0.53); // ajusta tamaño
const screenPlaneMat2 = new THREE.MeshStandardMaterial({
  color: 0x111111,
  emissive: 0x00aaff,
  emissiveIntensity: 3
});
const screenPlane2 = new THREE.Mesh(screenPlaneGeo2, screenPlaneMat2);
screenPlane2.position.set(-2, 1.767, -2.915); // coloca frente al monitor real
scene.add(screenPlane2);

// Plano derecho pequeño 2
const screenPlaneGeo3 = new THREE.PlaneGeometry(0.15, 0.53); // ajusta tamaño
const screenPlaneMat3 = new THREE.MeshStandardMaterial({
  color: 0x111111,
  emissive: 0x00aaff,
  emissiveIntensity: 3
});
const screenPlane3 = new THREE.Mesh(screenPlaneGeo3, screenPlaneMat3);
screenPlane3.position.set(-1.9, 1.7679, -2.859); // coloca frente al monitor real
scene.add(screenPlane3);

// Plano derecho lateral 2
const screenPlaneGeo4 = new THREE.PlaneGeometry(0.15, 0.53); // ajusta tamaño
const screenPlaneMat4 = new THREE.MeshStandardMaterial({
  color: 0x111111,
  emissive: 0x00aaff,
  emissiveIntensity: 3
});
const screenPlane4 = new THREE.Mesh(screenPlaneGeo4, screenPlaneMat4);
screenPlane4.position.set(-1.951, 1.7679, -2.94); // coloca frente al monitor real
screenPlane4.rotateY(-Math.PI/2);
scene.add(screenPlane4);

// Plano derecho lateral 1
const screenPlaneGeo5 = new THREE.PlaneGeometry(0.15, 0.53); // ajusta tamaño
const screenPlaneMat5 = new THREE.MeshStandardMaterial({
  color: 0x111111,
  emissive: 0x00aaff,
  emissiveIntensity: 3
});
const screenPlane5 = new THREE.Mesh(screenPlaneGeo5, screenPlaneMat5);
screenPlane5.position.set(-2.131, 1.7679, -2.98); // coloca frente al monitor real
screenPlane5.rotateY(-Math.PI/2);
scene.add(screenPlane5);

// Plano izquierdo pequeño 2
const screenPlaneGeo6 = new THREE.PlaneGeometry(0.12, 0.53); // ajusta tamaño
const screenPlaneMat6 = new THREE.MeshStandardMaterial({
  color: 0x111111,
  emissive: 0x00aaff,
  emissiveIntensity: 3
});
const screenPlane6 = new THREE.Mesh(screenPlaneGeo6, screenPlaneMat6);
screenPlane6.position.set(-3.2, 1.7679, -2.859); // coloca frente al monitor real
scene.add(screenPlane6);

// Plano izquierdo pequeño 1
const screenPlaneGeo7 = new THREE.PlaneGeometry(0.25, 0.53); // ajusta tamaño
const screenPlaneMat7 = new THREE.MeshStandardMaterial({
  color: 0x111111,
  emissive: 0x00aaff,
  emissiveIntensity: 3
});
const screenPlane7 = new THREE.Mesh(screenPlaneGeo7, screenPlaneMat7);
screenPlane7.position.set(-3.1, 1.767, -2.915); // coloca frente al monitor real
scene.add(screenPlane7);

// Plano izquierdo lateral 2
const screenPlaneGeo8 = new THREE.PlaneGeometry(0.15, 0.53); // ajusta tamaño
const screenPlaneMat8 = new THREE.MeshStandardMaterial({
  color: 0x111111,
  emissive: 0x00aaff,
  emissiveIntensity: 3
});
const screenPlane8 = new THREE.Mesh(screenPlaneGeo8, screenPlaneMat8);
screenPlane8.position.set(-3.145, 1.7679, -2.94); // coloca frente al monitor real
screenPlane8.rotateY(Math.PI/2);
scene.add(screenPlane8);

// Plano izquierdo lateral 1
const screenPlaneGeo9 = new THREE.PlaneGeometry(0.15, 0.53); // ajusta tamaño
const screenPlaneMat9 = new THREE.MeshStandardMaterial({
  color: 0x111111,
  emissive: 0x00aaff,
  emissiveIntensity: 3
});
const screenPlane9 = new THREE.Mesh(screenPlaneGeo9, screenPlaneMat9);
screenPlane9.position.set(-2.965, 1.7679, -2.98); // coloca frente al monitor real
screenPlane9.rotateY(Math.PI/2);
scene.add(screenPlane9); 

// Luz ordenador
const pcLedLight = new THREE.PointLight(0x00ff88, 2, 1.5);
pcLedLight.position.set(-3, 0.52, -2.9);
scene.add(pcLedLight);

// Luz escritorio 
const deskLight = new THREE.SpotLight(0xffaa00, 3);
deskLight.position.set(-1.3, 1.95, -2.9);
deskLight.angle = Math.PI / 6;
deskLight.penumbra = 0.6;
deskLight.distance = 10;
scene.add(deskLight.target);
deskLight.target.position.set(-1.3, 0.9, -2.9);
scene.add(deskLight);

// Luz mesa de noche
const lampPanelMaterial = new THREE.MeshStandardMaterial({
  color: 0xffe0a3,          // color base del papel
  emissive: 0xffd6a3,       // amarillo/naranja suave
  emissiveIntensity: 1.0,   // intensidad del brillo
  transparent: true,
  opacity: 0.85,
  roughness: 0.9,           // papel mate
  metalness: 0.0
});

const panelWidth  = 0.12;
const panelHeight = 0.15;
const panelDepth  = 0.18;

const rightPanel = new THREE.Mesh(
  new THREE.PlaneGeometry(panelWidth, panelHeight),
  lampPanelMaterial
);
rightPanel.position.set(3.3, 1.25, -0.05);
scene.add(rightPanel);

const backPanel = new THREE.Mesh(
  new THREE.PlaneGeometry(panelWidth, panelHeight),
  lampPanelMaterial
);
backPanel.position.set(3.4, 1.25, -0.101);
backPanel.rotateY(Math.PI / 2);
scene.add(backPanel);

const frontPanel = new THREE.Mesh(
  new THREE.PlaneGeometry(panelWidth, panelHeight),
  lampPanelMaterial
);
frontPanel.position.set(3.25, 1.25, -0.101);
frontPanel.rotateY(-Math.PI / 2);
scene.add(frontPanel);

const leftPanel = new THREE.Mesh(
  new THREE.PlaneGeometry(panelWidth, panelHeight),
  lampPanelMaterial
);
leftPanel.position.set(3.3, 1.25, -0.15);
leftPanel.rotateY(Math.PI);
scene.add(leftPanel);

// Luz ambiente tenue (general)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.12); // color + intensidad
scene.add(ambientLight);


const roomColor = 0xb3aeb4;
const roomSize = 7;
const wallHeight = 3.5;

const wallMaterial = new THREE.MeshStandardMaterial({
  color: roomColor,
  side: THREE.DoubleSide
});

// Suelo
const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
const floorMaterial = new THREE.MeshStandardMaterial({ color: roomColor });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Pared derecha (X+)
const rightWall = new THREE.Mesh(
  new THREE.PlaneGeometry(roomSize, wallHeight),
  wallMaterial
);
rightWall.rotation.y = -Math.PI / 2;
rightWall.position.set(roomSize / 2, wallHeight / 2, 0);
scene.add(rightWall);

// Pared frontal (Z-)
const frontWall = new THREE.Mesh(
  new THREE.PlaneGeometry(roomSize, wallHeight),
  wallMaterial
);
frontWall.rotation.y = Math.PI;
frontWall.position.set(0, wallHeight / 2, -roomSize / 2);
scene.add(frontWall);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;

controls.minDistance = 1.2;
controls.maxDistance = 6.0;

controls.minPolarAngle = Math.PI * 0.2;
controls.maxPolarAngle = Math.PI * 0.48;

const RANGE = Math.PI * 0.35
const center = controls.getAzimuthalAngle();

controls.minAzimuthAngle = center - RANGE;
controls.maxAzimuthAngle = center + RANGE;

controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.target.set(0,1.2,0);
controls.update();


const canvas = renderer.domElement;

canvas.style.cursor = 'default';
controls.addEventListener('start', () => canvas.style.cursor = 'grabbing');
controls.addEventListener('end',   () => canvas.style.cursor = 'default');

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const interactables = [];

let hoveredRoot = null;

let isDragging = false;
controls.addEventListener('start', () => { isDragging = true; });
controls.addEventListener('end', () => { isDragging = false; });

window.addEventListener('mousemove', (e) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
});

window.addEventListener('click', () => {
  if (isDragging) return;
  if (!hoveredRoot) return;
  if (isCardOpen) return; // evita abrir otra tarjeta si ya hay una abierta

  const cardId = hoveredRoot.userData.id;
  if (cardId){
    activeCardId = cardId;
    hideIdleHint();
    openCard(cardId);
  }
});

function makeInteractive(root) {
  root.userData.interactive = true;
  root.userData.outline = buildOutline(root);  // <- crea el contorno una vez
  root.userData.outline.visible = false;
  root.add(root.userData.outline);

  interactables.push(root);
}

function buildOutline(root) {
  const outlineGroup = new THREE.Group();

  const outlineMat = new THREE.MeshBasicMaterial({
    color: 0xeeeeee,          // ✅ blanco apagado
    side: THREE.BackSide,     // dibuja “por detrás” para parecer contorno
    depthTest: true,
    depthWrite: false
  });

  root.traverse((o) => {
    if (!o.isMesh) return;

    const outlineMesh = new THREE.Mesh(o.geometry, outlineMat);
    outlineMesh.position.copy(o.position);
    outlineMesh.rotation.copy(o.rotation);
    outlineMesh.scale.copy(o.scale).multiplyScalar(1.08); // grosor del contorno

    outlineMesh.renderOrder = 999; // por si acaso
    outlineGroup.add(outlineMesh);
  });

  return outlineGroup;
}

function findInteractiveRoot(obj) {
  let cur = obj;
  while (cur) {
    if (cur.userData?.interactive) return cur;
    cur = cur.parent;
  }
  return null;
}

function setOutlineVisible(root, visible) {
  if (!root?.userData?.outline) return;
  root.userData.outline.visible = visible;
}

function updateHover() {
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(interactables, true);
  const newRoot = hits.length ? findInteractiveRoot(hits[0].object) : null;

  if (newRoot !== hoveredRoot) {
    if (hoveredRoot) setOutlineVisible(hoveredRoot, false);
    hoveredRoot = newRoot;
    if (hoveredRoot) setOutlineVisible(hoveredRoot, true);
  }
}


const loader = new GLTFLoader();

// Desk
  loader.load(
    'assets/models/desk.glb',
    (gltf) => {
      const model = gltf.scene;
      model.scale.set(0.6, 0.6, 0.6);

      // Posicionar en la esquina inferior izquierda de la habitación
      model.position.set(-2.1, 0.6, -2.89);

      // Rotar para que mire hacia la pared (Z+)
      model.rotation.y = Math.PI;

      // Añadir a escena
      scene.add(model);

      console.log('Modelo cargado correctamente');
    },
    undefined,
    (err) => console.error('Error cargando modelo:', err)
  );

loader.load(
  'assets/models/desk_drawer_1.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.7, 0.7, 0.6);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(-1.25, 0.4, -2.75);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

loader.load(
  'assets/models/desk_drawer_1.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.7, 0.7, 0.6);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(-1.25, 0.7, -2.75);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

loader.load(
  'assets/models/desk_drawer_1.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.7, 0.7, 0.6);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(-1.25, 1, -2.75);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

//Floor
loader.load(
  'assets/models/floor.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.73, 0.72, 0.601);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(0, 0, 0);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

loader.load(
  'assets/models/floor.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.73, 0.72, 0.699);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(0, 0, 2.26);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

loader.load(
  'assets/models/floor.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.73, 0.72, 0.72);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(0, 0, -2.3);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

//Bed
loader.load(
  'assets/models/bed_frame.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.7, 0.6, 0.7);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(1.62, 0.58, -2.16);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI/2;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

loader.load(
  'assets/models/bodypillowglb.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.6, 0.6, 0.6);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(3.2, 0.6, -2.16);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI/2;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

loader.load(
  'assets/models/duvet.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.7, 0.6, 0.7);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(1.25, 0.7, -2.16);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI/2;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

loader.load(
  'assets/models/pillow1.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.6, 0.6, 0.6);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(2.9, 0.75, -2.6);

    // Rotar para que mire hacia la pared (Z+)
    //model.rotation.y = Math.PI/2;
    model.rotation.x = Math.PI/2;
    model.rotation.z = Math.PI/2;
    model.rotation.y = -Math.PI/4;
    

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

loader.load(
  'assets/models/pillow2.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.6, 0.6, 0.6);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(2.9, 0.75, -1.7);

    // Rotar para que mire hacia la pared (Z+)
    //model.rotation.y = Math.PI/2;
    model.rotation.x = Math.PI/2;
    model.rotation.z = Math.PI/2;
    model.rotation.y = -Math.PI/4;
    

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

// Window
loader.load(
  'assets/models/window.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.9, 0.8, 0.7);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(-1.4, 2.4, -3.4);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = -Math.PI;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

// Rug
loader.load(
  'assets/models/rug.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(1, 1, 1);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(-0.4, 0.01, 0);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

// Shelf
loader.load(
  'assets/models/shelf.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.8, 0.8, 0.8);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(3.1, 1.27, 2.3);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI / 2;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

// Nightstand
loader.load(
  'assets/models/nightstand.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.8, 0.5, 0.7);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(3.2, 0.4, -0.3);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI / 2;
    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
)
loader.load(
  'assets/models/bottom_drawer.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.8, 0.5, 0.7);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(3.11, 0.4, -0.3);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI / 2;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
)
loader.load(
  'assets/models/bottom_drawer.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.8, 0.5, 0.7);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(3.11, 0.2, -0.3);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI / 2;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
)

// Chair
loader.load(
  'assets/models/gaming_chair_base.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.5, 0.4, 0.5);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(-1.8, 0.49, -1.5);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

loader.load(
  'assets/models/gaming_chair.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.4, 0.4, 0.4);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(-1.8, 1.45, -1.5);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI/3;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);
// DESK SETUP
// Monitor
loader.load(
  'assets/models/monitor.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.6, 0.6, 0.6);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(-2.55, 1.68, -3.1);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI;
    
    model.userData.id = 'monitor';
    makeInteractive(model);
    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

// Keyboard
loader.load(
  'assets/models/keyboard.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(-2.7, 1.3, -2.6);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

// Mouse
loader.load(
  'assets/models/mouse.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.1, 0.1, 0.1);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(-2.1, 1.3, -2.6);

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

// Lamp
loader.load(
  'assets/models/flexo.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.15, 0.15, 0.15);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(-1.2, 1.6, -3.1);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI/4 + 2;
    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

loader.load(
  'assets/models/lampara.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.15, 0.15, 0.15);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(-1.3, 1.9, -2.9);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI;
    model.rotation.x = - Math.PI / 4 ;
    model.rotation.z = Math.PI / 10;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
)

// Books
loader.load(
  'assets/models/books_stacked.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.4, 0.4, 0.4);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(-1.3, 1.4, -2.5);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI / 4;
    model.userData.id = 'books';
    makeInteractive(model);
    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

//PC
loader.load(
  'assets/models/pc.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(-2.97, 0.52, -2.9);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI;
    model.userData.id = 'pc';
    makeInteractive(model);
    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

// MacBook
loader.load(
  'assets/models/macbook.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(0.7, 1.085, -1.7);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = -Math.PI/4;
    model.userData.id = 'macbook';
    makeInteractive(model);
    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);
// Headphones
loader.load(
  'assets/models/headphones.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.1, 0.1, 0.1);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(1.45, 0.85, -1.6);

    // Rotar para que mire hacia la pared (Z+)

    model.rotation.x =  Math.PI / 2;
    //model.rotation.z = Math.PI/2;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

// Katana
loader.load(
  'assets/models/katana.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.4, 0.4, 0.4);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(3.1, 2.72, 2.3);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI / 2;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

// FLAGS
// JPN FLAG
loader.load(
  'assets/models/japan_flag.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.75, 0.6, 0.1);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(2.55, 1.9, -3.5);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI;
    model.userData.id = 'japan_flag';
    makeInteractive(model);
    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);
// PIRATE FLAG
loader.load(
  'assets/models/pirate_flag.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.5, 0.4, 0.1);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(2.5, 2.9, -3.5);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

// iPhone
loader.load(
  'assets/models/iphone.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.05, 0.05, 0.05);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(3.1, 0.76, -0.5);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI / 4;
    model.userData.id = 'phone';
    makeInteractive(model);
    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

// Japanese Light
loader.load(
  'assets/models/japan_light.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(3.3, 1.1, -0.1);

    // Rotar para que mire hacia la pared (Z+)
    //model.rotation.y = Math.PI / 2;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

// Wallet
loader.load(
  'assets/models/wallet.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.1, 0.1, 0.1);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(3.35, 0.77, -0.6);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI / 8;
    model.userData.id = 'wallet';
    makeInteractive(model);
    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

// Gameboy
loader.load(
  'assets/models/gameboy.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.1, 0.1, 0.1);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(3, 0.8, -0.1);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI / 2;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

// Poster 1
loader.load(
  'assets/models/poster_1.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.1);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(3.49, 2.3, -2.5);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI/2;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

// Poster 2
loader.load(
  'assets/models/poster_2.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.1);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(3.49, 2.9, -2.5);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI/2;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

// Poster 3
loader.load(
  'assets/models/poster_3.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.1);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(3.49, 2.5, -1.5);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI/2;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

// Neon
loader.load(
  'assets/models/neon.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.7, 0.7, 0.7);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(3.49, 2.5, 0.1);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI/2;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

// Goth Books
loader.load(
  'assets/models/books_gothic.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.25, 0.25, 0.25);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(3.1, 0.7, 2.7);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI/2;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

// Daruma
loader.load(
  'assets/models/daruma.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.4, 0.4, 0.4);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(3.1, 0.7, 1.9);

    // Rotar para que mire hacia la pared (Z+)
    model.rotation.y = Math.PI/2;

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

loader.load('assets/models/dragon_books.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(0.3, 0.3, 0.3);

  // Posicionar en la esquina inferior izquierda de la habitación
  model.position.set(3.1, 1.3, 1.75);

  // Rotar para que mire hacia la pared (Z+)
  model.rotation.y = - Math.PI / 2;

  // Añadir a escena
  scene.add(model);

  console.log('Modelo cargado correctamente');
},
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

loader.load('assets/models/single_book.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(0.7, 0.7, 0.7);

  // Posicionar en la esquina inferior izquierda de la habitación
  model.position.set(3.1, 1.3, 3.1);

  // Rotar para que mire hacia la pared (Z+)
  model.rotation.y = Math.PI;

  // Añadir a escena
  scene.add(model);

  console.log('Modelo cargado correctamente');
},
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

loader.load('assets/models/single_book.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(0.7, 0.7, 0.7);

  // Posicionar en la esquina inferior izquierda de la habitación
  model.position.set(3.1, 1.3, 2.89);

  // Rotar para que mire hacia la pared (Z+)
  model.rotation.y = Math.PI;

  // Añadir a escena
  scene.add(model);

  console.log('Modelo cargado correctamente');
},
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

loader.load('assets/models/single_book.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(0.7, 0.7, 0.7);

  // Posicionar en la esquina inferior izquierda de la habitación
  model.position.set(3.1, 1.3, 2.73);

  // Rotar para que mire hacia la pared (Z+)
  model.rotation.y = Math.PI;

  // Añadir a escena
  scene.add(model);

  console.log('Modelo cargado correctamente');
},
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

loader.load('assets/models/single_book.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(0.7, 0.7, 0.7);

  // Posicionar en la esquina inferior izquierda de la habitación
  model.position.set(3.1, 1.3, 2.58);

  // Rotar para que mire hacia la pared (Z+)
  model.rotation.y = Math.PI;

  // Añadir a escena
  scene.add(model);

  console.log('Modelo cargado correctamente');
},
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

loader.load('assets/models/pokeball.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(0.1, 0.1, 0.1);

  // Posicionar en la esquina inferior izquierda de la habitación
  model.position.set(3, 1.25, 2.3);

  // Rotar para que mire hacia la pared (Z+)
  model.rotation.y = Math.PI / 2;

  // Añadir a escena
  scene.add(model);

  console.log('Modelo cargado correctamente');
},
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

loader.load('assets/models/trophy.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(0.3, 0.3, 0.3);

  // Posicionar en la esquina inferior izquierda de la habitación
  model.position.set(3, 2, 2.8);

  // Rotar para que mire hacia la pared (Z+)
  model.rotation.y = Math.PI / 2;
  model.userData.id = 'trophy1';
  makeInteractive(model);
  // Añadir a escena
  scene.add(model);

  console.log('Modelo cargado correctamente');
},
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

loader.load('assets/models/trophy.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(0.3, 0.3, 0.3);

  // Posicionar en la esquina inferior izquierda de la habitación
  model.position.set(3, 2, 2.3);

  // Rotar para que mire hacia la pared (Z+)
  model.rotation.y = Math.PI / 2;
  model.userData.id = 'trophy2';
  makeInteractive(model);
  // Añadir a escena
  scene.add(model);

  console.log('Modelo cargado correctamente');
},
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

loader.load('assets/models/colonia_1.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(0.1, 0.1, 0.1);

  // Posicionar en la esquina inferior izquierda de la habitación
  model.position.set(3, 1.9, 1.8);

  // Rotar para que mire hacia la pared (Z+)
  model.rotation.y = - Math.PI / 2;

  // Añadir a escena
  scene.add(model);

  console.log('Modelo cargado correctamente');
},
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

loader.load('assets/models/colonia_2.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(0.1, 0.1, 0.1);

  // Posicionar en la esquina inferior izquierda de la habitación
  model.position.set(3, 1.9, 1.8);

  // Rotar para que mire hacia la pared (Z+)
  model.rotation.y = - Math.PI / 2;

  // Añadir a escena
  scene.add(model);

  console.log('Modelo cargado correctamente');
},
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

loader.load('assets/models/colonia_3.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(0.1, 0.1, 0.1);

  // Posicionar en la esquina inferior izquierda de la habitación
  model.position.set(3, 1.9, 1.8);

  // Rotar para que mire hacia la pared (Z+)
  model.rotation.y =  -Math.PI / 2;

  // Añadir a escena
  scene.add(model);

  console.log('Modelo cargado correctamente');
},
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

function showIdleHint() {
  if (!idleHintEl) return;
  if (isCardOpen) return;

  idleHintEl.classList.remove('hidden');
}

function hideIdleHint() {
  if (!idleHintEl) return;
  idleHintEl.classList.add('hidden');
}

function resetIdleTimer() {
  hideIdleHint();

  if (idleTimer) {
    clearTimeout(idleTimer);
  }

  idleTimer = setTimeout(() => {
    if (!isCardOpen) {
      showIdleHint();
    }
  }, IDLE_DELAY);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  updateHover();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.addEventListener('click', (e) => {

  const item = e.target.closest('.finder-menu li');
  if (!item) return;

  // activar selección visual
  document.querySelectorAll('.finder-menu li').forEach(li => li.classList.remove('active'));
  item.classList.add('active');

  const filter = item.dataset.filter;

  document.querySelectorAll('.experience-item').forEach(exp => {
    if (filter === 'all' || exp.dataset.company === filter) {
      exp.style.display = 'block';
    } else {
      exp.style.display = 'none';
    }
  });

});

document.addEventListener('click', (e) => {
  const item = e.target.closest('.dictionary-item');
  if (!item) return;

  document.querySelectorAll('.dictionary-item').forEach(i => i.classList.remove('active'));
  item.classList.add('active');

  const lang = item.dataset.lang;

  document.querySelectorAll('.dictionary-entry').forEach(entry => {
    if (entry.dataset.content === lang) {
      entry.style.display = 'block';
    } else {
      entry.style.display = 'none';
    }
  });
});
function getCurrentLocale() {
  if (currentLang === 'ca') return 'ca-ES';
  if (currentLang === 'en') return 'en-US';
  return 'es-ES';
}

function capitalizeWords(text) {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function updateDateTime() {
  const el = document.getElementById('menu-datetime');
  if (!el) return;

  const now = new Date();

  const options = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  };

  let formatted = now.toLocaleString(getCurrentLocale(), options);
  formatted = capitalizeWords(formatted);

  el.textContent = formatted;
}

// actualizar cada minuto
applyLanguageSelection(currentLang);
updateDateTime();
setInterval(updateDateTime, 60000);

resetIdleTimer();
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.appstore-btn');
  if (!btn) return;

  const url = btn.dataset.url;
  if (url) window.open(url, '_blank');
});

document.querySelectorAll('.menu-item[data-card]').forEach(item => {
  item.addEventListener('click', () => {
    const id = item.dataset.card;
    activeCardId = id;
    hideIdleHint();
    openCard(id);
  });
});

const controlToggle = document.getElementById('control-toggle');
const controlCenter = document.getElementById('control-center');
const darkModeToggle = document.getElementById('darkmode-toggle');

if (controlToggle && controlCenter) {
  controlToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    controlCenter.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#control-center') && !e.target.closest('#control-toggle')) {
      controlCenter.classList.add('hidden');
    }
  });
}
['mousemove', 'mousedown', 'click', 'keydown', 'touchstart'].forEach(eventName => {
  window.addEventListener(eventName, resetIdleTimer, { passive: true });
});
function updateStaticTexts(lang) {
  const langTexts = translations[lang] || translations.es;

  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;
    if (langTexts[key]) {
      el.textContent = langTexts[key];
    }
  });

  document.documentElement.lang = lang;
}

function applyLanguageSelection(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  setCardLanguage(lang);

  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  updateStaticTexts(lang);
  updateDateTime();

  if (isCardOpen && activeCardId) {
    openCard(activeCardId);
  }
}

document.querySelectorAll('[data-lang]').forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    applyLanguageSelection(lang);

    if (controlCenter) {
      controlCenter.classList.add('hidden');
    }
  });
});

if (darkModeToggle) {
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    updateDarkModeUI();

    if (controlCenter) {
      controlCenter.classList.add('hidden');
    }
  });
}

const savedDarkMode = localStorage.getItem('darkMode') === 'true';
if (savedDarkMode) {
  document.body.classList.add('dark-mode');
}
updateDarkModeUI();

function updateDarkModeUI() {
  const isDark = document.body.classList.contains('dark-mode');

  if (darkModeToggle) {
    darkModeToggle.classList.toggle('active', isDark);
  }
}