/* ---------------------------------- */
/*             Imports                */
/* ---------------------------------- */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { openCard, isCardOpen, setCardLanguage } from './cards.js';

/* ---------------------------------- */
/*     Global state and constants     */
/* ---------------------------------- */

let currentLang = localStorage.getItem('lang') || 'es'; // current language state
let activeCardId = null; // active card status
const IDLE_DELAY = 120000; // 2 minutes idle 
let idleTimer = null; // timer reference for idle hint
const BASE_PATH = '/interactive-cv'; // base path for fetching card content
const isMobile = window.innerWidth <= 768;

/* ---------------------------------- */
/*          DOM references            */
/* ---------------------------------- */

const idleHintEl = document.getElementById('idle-hint'); // idle hint element reference
const controlToggle = document.getElementById('control-toggle');
const controlCenter = document.getElementById('control-center');
const darkModeToggle = document.getElementById('darkmode-toggle');
const menuDateTimeEl = document.getElementById('menu-datetime');

/* ---------------------------------- */
/*          UI translations           */
/* ---------------------------------- */

const translations = {
  es: { // Spanish
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
  ca: { // Catalan
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
  en: { // English
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

/* ---------------------------------- */
/*       Three.js core setup          */
/*  scene, camera, renderer, lights   */
/* ---------------------------------- */

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a102b); // Background color (dark purple)

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-6, 3, 6); // Original camera position

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ambient Scene Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.12);
scene.add(ambientLight);

// Directional Light
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);

// Monitor Light
const monitorLight = new THREE.PointLight(0x00aaff, 1.2, 3);
monitorLight.position.set(-2.55, 1.68, -2.98);
scene.add(monitorLight);

// PC Lights
const pcLedLight = new THREE.PointLight(0x00ff88, 2, 1.5);
pcLedLight.position.set(-3, 0.52, -2.9);
scene.add(pcLedLight);

// Desktop Lights
const deskLight = new THREE.SpotLight(0xffaa00, 3);
deskLight.position.set(-1.3, 1.95, -2.9);
deskLight.angle = Math.PI / 6;
deskLight.penumbra = 0.6;
deskLight.distance = 10;
scene.add(deskLight.target);
deskLight.target.position.set(-1.3, 0.9, -2.9);
scene.add(deskLight);

/* ---------------------------------- */
/*        Static scene helpers        */
/*   monitor glow, room, floor, walls */
/* ---------------------------------- */

/* ------ Monitor Screen ------ */
// Main screen
const screenPlaneGeo = new THREE.PlaneGeometry(0.82, 0.53);
const screenPlaneMat = new THREE.MeshStandardMaterial({
  color: 0x111111,
  emissive: 0x00aaff,
  emissiveIntensity: 3
});
const screenPlane = new THREE.Mesh(screenPlaneGeo, screenPlaneMat);
screenPlane.position.set(-2.55, 1.767, -2.9699);
scene.add(screenPlane);

// Right pane 1
const screenPlaneGeo2 = new THREE.PlaneGeometry(0.25, 0.53);
const screenPlaneMat2 = new THREE.MeshStandardMaterial({
  color: 0x111111,
  emissive: 0x00aaff,
  emissiveIntensity: 3
});
const screenPlane2 = new THREE.Mesh(screenPlaneGeo2, screenPlaneMat2);
screenPlane2.position.set(-2, 1.767, -2.915);
scene.add(screenPlane2);

// Right pane 2
const screenPlaneGeo3 = new THREE.PlaneGeometry(0.15, 0.53);
const screenPlaneMat3 = new THREE.MeshStandardMaterial({
  color: 0x111111,
  emissive: 0x00aaff,
  emissiveIntensity: 3
});
const screenPlane3 = new THREE.Mesh(screenPlaneGeo3, screenPlaneMat3);
screenPlane3.position.set(-1.9, 1.7679, -2.859);
scene.add(screenPlane3);

// Right lateral pane 2
const screenPlaneGeo4 = new THREE.PlaneGeometry(0.15, 0.53);
const screenPlaneMat4 = new THREE.MeshStandardMaterial({
  color: 0x111111,
  emissive: 0x00aaff,
  emissiveIntensity: 3
});
const screenPlane4 = new THREE.Mesh(screenPlaneGeo4, screenPlaneMat4);
screenPlane4.position.set(-1.951, 1.7679, -2.94);
screenPlane4.rotateY(-Math.PI/2);
scene.add(screenPlane4);

// Right lateral pane 1
const screenPlaneGeo5 = new THREE.PlaneGeometry(0.15, 0.53);
const screenPlaneMat5 = new THREE.MeshStandardMaterial({
  color: 0x111111,
  emissive: 0x00aaff,
  emissiveIntensity: 3
});
const screenPlane5 = new THREE.Mesh(screenPlaneGeo5, screenPlaneMat5);
screenPlane5.position.set(-2.131, 1.7679, -2.98);
screenPlane5.rotateY(-Math.PI/2);
scene.add(screenPlane5);

// Left pane 2
const screenPlaneGeo6 = new THREE.PlaneGeometry(0.12, 0.53);
const screenPlaneMat6 = new THREE.MeshStandardMaterial({
  color: 0x111111,
  emissive: 0x00aaff,
  emissiveIntensity: 3
});
const screenPlane6 = new THREE.Mesh(screenPlaneGeo6, screenPlaneMat6);
screenPlane6.position.set(-3.2, 1.7679, -2.859);
scene.add(screenPlane6);

// Left pane 1
const screenPlaneGeo7 = new THREE.PlaneGeometry(0.25, 0.53);
const screenPlaneMat7 = new THREE.MeshStandardMaterial({
  color: 0x111111,
  emissive: 0x00aaff,
  emissiveIntensity: 3
});
const screenPlane7 = new THREE.Mesh(screenPlaneGeo7, screenPlaneMat7);
screenPlane7.position.set(-3.1, 1.767, -2.915);
scene.add(screenPlane7);

// Left lateral pane 2
const screenPlaneGeo8 = new THREE.PlaneGeometry(0.15, 0.53);
const screenPlaneMat8 = new THREE.MeshStandardMaterial({
  color: 0x111111,
  emissive: 0x00aaff,
  emissiveIntensity: 3
});
const screenPlane8 = new THREE.Mesh(screenPlaneGeo8, screenPlaneMat8);
screenPlane8.position.set(-3.145, 1.7679, -2.94);
screenPlane8.rotateY(Math.PI/2);
scene.add(screenPlane8);

// Left lateral pane 1
const screenPlaneGeo9 = new THREE.PlaneGeometry(0.15, 0.53);
const screenPlaneMat9 = new THREE.MeshStandardMaterial({
  color: 0x111111,
  emissive: 0x00aaff,
  emissiveIntensity: 3
});
const screenPlane9 = new THREE.Mesh(screenPlaneGeo9, screenPlaneMat9);
screenPlane9.position.set(-2.965, 1.7679, -2.98); 
screenPlane9.rotateY(Math.PI/2);
scene.add(screenPlane9);

/* ------ Nightstand Lamp Panels ------ */
const lampPanelMaterial = new THREE.MeshStandardMaterial({
  color: 0xffe0a3,          // paper color base
  emissive: 0xffd6a3,       // yellow
  emissiveIntensity: 1.0,   // brightness of the glow
  transparent: true,
  opacity: 0.85,
  roughness: 0.9,           
  metalness: 0.0
});

const panelWidth  = 0.12;
const panelHeight = 0.15;
const panelDepth  = 0.18;

//Right Panel
const rightPanel = new THREE.Mesh(
  new THREE.PlaneGeometry(panelWidth, panelHeight),
  lampPanelMaterial
);
rightPanel.position.set(3.3, 1.25, -0.05);
scene.add(rightPanel);

// Back Panel
const backPanel = new THREE.Mesh(
  new THREE.PlaneGeometry(panelWidth, panelHeight),
  lampPanelMaterial
);
backPanel.position.set(3.4, 1.25, -0.101);
backPanel.rotateY(Math.PI / 2);
scene.add(backPanel);

// Front Panel
const frontPanel = new THREE.Mesh(
  new THREE.PlaneGeometry(panelWidth, panelHeight),
  lampPanelMaterial
);
frontPanel.position.set(3.25, 1.25, -0.101);
frontPanel.rotateY(-Math.PI / 2);
scene.add(frontPanel);

// Left Panel
const leftPanel = new THREE.Mesh(
  new THREE.PlaneGeometry(panelWidth, panelHeight),
  lampPanelMaterial
);
leftPanel.position.set(3.3, 1.25, -0.15);
leftPanel.rotateY(Math.PI);
scene.add(leftPanel);

/* ------ Room Walls and Floor ------ */
const roomColor = 0xb3aeb4;
const roomSize = 7;
const wallHeight = 3.5;

const wallMaterial = new THREE.MeshStandardMaterial({
  color: roomColor,
  side: THREE.DoubleSide
});

// Floor
const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
const floorMaterial = new THREE.MeshStandardMaterial({ color: roomColor });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Right Wall (X+)
const rightWall = new THREE.Mesh(
  new THREE.PlaneGeometry(roomSize, wallHeight),
  wallMaterial
);
rightWall.rotation.y = -Math.PI / 2;
rightWall.position.set(roomSize / 2, wallHeight / 2, 0);
scene.add(rightWall);

// Front Wall (Z-)
const frontWall = new THREE.Mesh(
  new THREE.PlaneGeometry(roomSize, wallHeight),
  wallMaterial
);
frontWall.rotation.y = Math.PI;
frontWall.position.set(0, wallHeight / 2, -roomSize / 2);
scene.add(frontWall);

/* ---------------------------------- */
/* Controls and interaction setup     */
/* raycaster, hover, click logic      */
/* ---------------------------------- */

// Camera Controls
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

if (isMobile) { // Mobile-optimized camera position and controls
  camera.position.set(-5, 2.8, 5.5);

  controls.minDistance = 2.2;
  controls.maxDistance = 5.2;

  controls.minPolarAngle = Math.PI * 0.25;
  controls.maxPolarAngle = Math.PI * 0.44;

  controls.target.set(0, 1.15, 0);
  controls.update();
}

// Interaction Setup
const canvas = renderer.domElement;

canvas.style.cursor = 'default';
controls.addEventListener('start', () => canvas.style.cursor = 'grabbing');
controls.addEventListener('end',   () => canvas.style.cursor = 'default');

let isDragging = false;
controls.addEventListener('start', () => { isDragging = true; });
controls.addEventListener('end', () => { isDragging = false; });

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const interactables = [];

let hoveredRoot = null;

// Mouse move updates
window.addEventListener('mousemove', (e) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
});

// 3D Object clicks
window.addEventListener('click', () => {
  if (isDragging) return;
  if (!hoveredRoot) return;
  if (isCardOpen) return; // prevents opening another card while one is already open

  const cardId = hoveredRoot.userData.id;
  if (cardId){
    activeCardId = cardId;
    hideIdleHint();
    openCard(cardId);
  }
});

// Make interactive objects and their outlines
function makeInteractive(root) {
  root.userData.interactive = true;
  root.userData.outline = buildOutline(root);  // highlight effect only once
  root.userData.outline.visible = false;
  root.add(root.userData.outline);

  interactables.push(root);
}

// Outline builder
function buildOutline(root) {
  const outlineGroup = new THREE.Group();

  const outlineMat = new THREE.MeshBasicMaterial({
    color: 0xeeeeee,          // white
    side: THREE.BackSide,     // outline effect
    depthTest: true,
    depthWrite: false
  });

  root.traverse((o) => {
    if (!o.isMesh) return;

    const outlineMesh = new THREE.Mesh(o.geometry, outlineMat);
    outlineMesh.position.copy(o.position);
    outlineMesh.rotation.copy(o.rotation);
    outlineMesh.scale.copy(o.scale).multiplyScalar(1.08); // outline thickness

    outlineMesh.renderOrder = 999; // just in case
    outlineGroup.add(outlineMesh);
  });

  return outlineGroup;
}

// Interaction hover logic
function findInteractiveRoot(obj) {
  let cur = obj;
  while (cur) {
    if (cur.userData?.interactive) return cur;
    cur = cur.parent;
  }
  return null;
}

// Outline visibility helper
function setOutlineVisible(root, visible) {
  if (!root?.userData?.outline) return;
  root.userData.outline.visible = visible;
}

// Hover update loop
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


/* ---------------------------------- */
/*             Idle hint              */
/* ---------------------------------- */

// Shows a hint after some idle time to encourage interaction
function showIdleHint() {
  if (!idleHintEl) return;
  if (isCardOpen) return;

  idleHintEl.classList.remove('hidden');
}

// Hides the idle hint 
function hideIdleHint() {
  if (!idleHintEl) return;
  idleHintEl.classList.add('hidden');
}

// Resets idle timer
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
// Event listeners to reset idle timer on user interaction
['mousemove', 'mousedown', 'click', 'keydown', 'touchstart'].forEach(eventName => {
  window.addEventListener(eventName, resetIdleTimer, { passive: true });
});

resetIdleTimer(); // Reset idle timer on page load

/* ---------------------------------- */
/*            UI helpers              */
/*   language, datetime, dark mode    */
/* ---------------------------------- */

// Updates language of static UI elements based on currentLang
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

// Updates date and time display in the menu and the cards language
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

// Event listeners for language selection
document.querySelectorAll('[data-lang]').forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    applyLanguageSelection(lang);

    if (controlCenter) {
      controlCenter.classList.add('hidden');
    }
  });
});

// Helper to get current locale for date formatting
function getCurrentLocale() {
  if (currentLang === 'ca') return 'ca-ES';
  if (currentLang === 'en') return 'en-US';
  return 'es-ES';
}

// Capitalizes the first letter of each word in a string (for date formatting)
function capitalizeWords(text) {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Updates the date and time display in the menu according to the current language
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

applyLanguageSelection(currentLang); // initial language setup
updateDateTime(); // initial date/time setup
setInterval(updateDateTime, 60000); // update date/time every minute

// DARK MODE
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

const savedDarkMode = localStorage.getItem('darkMode') === 'true'; // apply saved dark mode preference on load
if (savedDarkMode) {
  document.body.classList.add('dark-mode');
}
updateDarkModeUI(); // update dark mode toggle UI state

// Updates the dark mode toggle button state based on current mode
function updateDarkModeUI() {
  const isDark = document.body.classList.contains('dark-mode');

  if (darkModeToggle) {
    darkModeToggle.classList.toggle('active', isDark);
  }
}

/* ---------------------------------- */
/* UI event bindings                  */
/* menu, control center, filters      */
/* ---------------------------------- */

// Top menu item clicks to open cards
document.querySelectorAll('.menu-item[data-card]').forEach(item => {
  item.addEventListener('click', () => {
    const id = item.dataset.card;
    activeCardId = id;
    hideIdleHint();
    openCard(id);
  });
});

// Control center toggle and outside click to close
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

// Finder menu filtering logic
document.addEventListener('click', (e) => {

  const item = e.target.closest('.finder-menu li');
  if (!item) return;

  // activate selected filter
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

// Dictionary menu filtering logic
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

// App Store app external button logic
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.appstore-btn');
  if (!btn) return;

  const url = btn.dataset.url;
  if (url) window.open(url, '_blank');
});

/* ---------------------------------- */
/* Model loading helpers              */
/* ---------------------------------- */

// Loader instance
const loader = new GLTFLoader();

// PENDING: Improve the code by adding helpers on this section. 

/* ---------------------------------- */
/* Scene model loading                */
/* desk, bed, shelf, flags, etc.      */
/* ---------------------------------- */

/* ---------------------------------- */
/* Desk area                          */
/* ---------------------------------- */

loader.load(
  'assets/models/desk.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.6, 0.6, 0.6);
    model.position.set(-2.1, 0.6, -2.89);
    model.rotation.y = Math.PI;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: desk', err)
);

/* Reused drawer model to build the desk drawer stack */
loader.load(
  'assets/models/desk_drawer_1.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.7, 0.7, 0.6);
    model.position.set(-1.25, 0.4, -2.75);
    model.rotation.y = Math.PI;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: desk drawer', err)
);

loader.load(
  'assets/models/desk_drawer_1.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.7, 0.7, 0.6);
    model.position.set(-1.25, 0.7, -2.75);
    model.rotation.y = Math.PI;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: desk drawer', err)
);

loader.load(
  'assets/models/desk_drawer_1.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.7, 0.7, 0.6);
    model.position.set(-1.25, 1, -2.75);
    model.rotation.y = Math.PI;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: desk drawer', err)
);

/* ---------------------------------- */
/* Floor tiles                        */
/* ---------------------------------- */

loader.load(
  'assets/models/floor.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.73, 0.72, 0.601);
    model.position.set(0, 0, 0);
    model.rotation.y = Math.PI;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: floor tile', err)
);

loader.load(
  'assets/models/floor.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.73, 0.72, 0.699);
    model.position.set(0, 0, 2.26);
    model.rotation.y = Math.PI;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: floor tile', err)
);

loader.load(
  'assets/models/floor.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.73, 0.72, 0.72);
    model.position.set(0, 0, -2.3);
    model.rotation.y = Math.PI;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: floor tile', err)
);

/* ---------------------------------- */
/* Bed area                           */
/* ---------------------------------- */

loader.load(
  'assets/models/bed_frame.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.7, 0.6, 0.7);
    model.position.set(1.62, 0.58, -2.16);
    model.rotation.y = Math.PI / 2;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: bed frame', err)
);

loader.load(
  'assets/models/bodypillowglb.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.6, 0.6, 0.6);
    model.position.set(3.2, 0.6, -2.16);
    model.rotation.y = Math.PI / 2;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: body pillow', err)
);

loader.load(
  'assets/models/duvet.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.7, 0.6, 0.7);
    model.position.set(1.25, 0.7, -2.16);
    model.rotation.y = Math.PI / 2;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: duvet', err)
);

/* Combined rotation to align the pillow with the bed surface */
loader.load(
  'assets/models/pillow1.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.6, 0.6, 0.6);
    model.position.set(2.9, 0.75, -2.6);
    model.rotation.x = Math.PI / 2;
    model.rotation.z = Math.PI / 2;
    model.rotation.y = -Math.PI / 4;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: pillow 1', err)
);

loader.load(
  'assets/models/pillow2.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.6, 0.6, 0.6);
    model.position.set(2.9, 0.75, -1.7);
    model.rotation.x = Math.PI / 2;
    model.rotation.z = Math.PI / 2;
    model.rotation.y = -Math.PI / 4;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: pillow 2', err)
);

/* ---------------------------------- */
/* Room decor                         */
/* ---------------------------------- */

loader.load(
  'assets/models/window.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.9, 0.8, 0.7);
    model.position.set(-1.4, 2.4, -3.4);
    model.rotation.y = -Math.PI;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: window', err)
);

loader.load(
  'assets/models/rug.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.set(-0.4, 0.01, 0);
    model.rotation.y = Math.PI;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: rug', err)
);

/* ---------------------------------- */
/* Right-side furniture               */
/* ---------------------------------- */

loader.load(
  'assets/models/shelf.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.8, 0.8, 0.8);
    model.position.set(3.1, 1.27, 2.3);
    model.rotation.y = Math.PI / 2;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: shelf', err)
);

loader.load(
  'assets/models/nightstand.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.8, 0.5, 0.7);
    model.position.set(3.2, 0.4, -0.3);
    model.rotation.y = Math.PI / 2;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: nightstand', err)
);

/* Reused drawer model to build the nightstand drawer stack */
loader.load(
  'assets/models/bottom_drawer.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.8, 0.5, 0.7);
    model.position.set(3.11, 0.4, -0.3);
    model.rotation.y = Math.PI / 2;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: bottom drawer', err)
);

loader.load(
  'assets/models/bottom_drawer.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.8, 0.5, 0.7);
    model.position.set(3.11, 0.2, -0.3);
    model.rotation.y = Math.PI / 2;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: bottom drawer', err)
);

/* ---------------------------------- */
/* Chair setup                        */
/* ---------------------------------- */

loader.load(
  'assets/models/gaming_chair_base.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.5, 0.4, 0.5);
    model.position.set(-1.8, 0.49, -1.5);
    model.rotation.y = Math.PI;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: gaming chair base', err)
);

loader.load(
  'assets/models/gaming_chair.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.4, 0.4, 0.4);
    model.position.set(-1.8, 1.45, -1.5);
    model.rotation.y = Math.PI / 3;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: gaming chair', err)
);

/* ---------------------------------- */
/* Desk setup                         */
/* ---------------------------------- */

/* Interactive object */
loader.load(
  'assets/models/monitor.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.6, 0.6, 0.6);
    model.position.set(-2.55, 1.68, -3.1);
    model.rotation.y = Math.PI;
    model.userData.id = 'monitor';
    makeInteractive(model);
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: monitor', err)
);

loader.load(
  'assets/models/keyboard.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5);
    model.position.set(-2.7, 1.3, -2.6);
    model.rotation.y = Math.PI;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: keyboard', err)
);

loader.load(
  'assets/models/mouse.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.1, 0.1, 0.1);
    model.position.set(-2.1, 1.3, -2.6);
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: mouse', err)
);

loader.load(
  'assets/models/flexo.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.15, 0.15, 0.15);
    model.position.set(-1.2, 1.6, -3.1);
    model.rotation.y = Math.PI / 4 + 2;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: desk lamp', err)
);

loader.load(
  'assets/models/lampara.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.15, 0.15, 0.15);
    model.position.set(-1.3, 1.9, -2.9);
    model.rotation.y = Math.PI;
    model.rotation.x = -Math.PI / 4;
    model.rotation.z = Math.PI / 10;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: desk light', err)
);

/* Interactive object */
loader.load(
  'assets/models/books_stacked.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.4, 0.4, 0.4);
    model.position.set(-1.3, 1.4, -2.5);
    model.rotation.y = Math.PI / 4;
    model.userData.id = 'books';
    makeInteractive(model);
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: stacked books', err)
);

/* Interactive object */
loader.load(
  'assets/models/pc.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5);
    model.position.set(-2.97, 0.52, -2.9);
    model.rotation.y = Math.PI;
    model.userData.id = 'pc';
    makeInteractive(model);
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: pc', err)
);

/* Interactive object */
loader.load(
  'assets/models/macbook.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2);
    model.position.set(0.7, 1.085, -1.7);
    model.rotation.y = -Math.PI / 4;
    model.userData.id = 'macbook';
    makeInteractive(model);
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: macbook', err)
);

loader.load(
  'assets/models/headphones.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.1, 0.1, 0.1);
    model.position.set(1.45, 0.85, -1.6);
    model.rotation.x = Math.PI / 2;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: headphones', err)
);

/* ---------------------------------- */
/* Wall decor                         */
/* ---------------------------------- */

loader.load(
  'assets/models/katana.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.4, 0.4, 0.4);
    model.position.set(3.1, 2.72, 2.3);
    model.rotation.y = Math.PI / 2;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: katana', err)
);

/* Interactive wall object */
loader.load(
  'assets/models/japan_flag.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.75, 0.6, 0.1);
    model.position.set(2.55, 1.9, -3.5);
    model.rotation.y = Math.PI;
    model.userData.id = 'japan_flag';
    makeInteractive(model);
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: japan flag', err)
);

loader.load(
  'assets/models/pirate_flag.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.5, 0.4, 0.1);
    model.position.set(2.5, 2.9, -3.5);
    model.rotation.y = Math.PI;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: pirate flag', err)
);

loader.load(
  'assets/models/poster_1.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.1);
    model.position.set(3.49, 2.3, -2.5);
    model.rotation.y = Math.PI / 2;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: poster 1', err)
);

loader.load(
  'assets/models/poster_2.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.1);
    model.position.set(3.49, 2.9, -2.5);
    model.rotation.y = Math.PI / 2;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: poster 2', err)
);

loader.load(
  'assets/models/poster_3.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.1);
    model.position.set(3.49, 2.5, -1.5);
    model.rotation.y = Math.PI / 2;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: poster 3', err)
);

loader.load(
  'assets/models/neon.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.7, 0.7, 0.7);
    model.position.set(3.49, 2.5, 0.1);
    model.rotation.y = Math.PI / 2;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: neon', err)
);

/* ---------------------------------- */
/* Shelf collectibles                 */
/* ---------------------------------- */

loader.load(
  'assets/models/japan_light.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2);
    model.position.set(3.3, 1.1, -0.1);
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: japanese light', err)
);

/* Interactive object */
loader.load(
  'assets/models/iphone.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.05, 0.05, 0.05);
    model.position.set(3.1, 0.76, -0.5);
    model.rotation.y = Math.PI / 4;
    model.userData.id = 'phone';
    makeInteractive(model);
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

/* Interactive object */
loader.load(
  'assets/models/wallet.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.1, 0.1, 0.1);
    model.position.set(3.35, 0.77, -0.6);
    model.rotation.y = Math.PI / 8;
    model.userData.id = 'wallet';
    makeInteractive(model);
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: wallet', err)
);

loader.load(
  'assets/models/gameboy.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.1, 0.1, 0.1);
    model.position.set(3, 0.8, -0.1);
    model.rotation.y = Math.PI / 2;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: gameboy', err)
);

loader.load(
  'assets/models/books_gothic.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.25, 0.25, 0.25);
    model.position.set(3.1, 0.7, 2.7);
    model.rotation.y = Math.PI / 2;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: gothic books', err)
);

loader.load(
  'assets/models/daruma.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.4, 0.4, 0.4);
    model.position.set(3.1, 0.7, 1.9);
    model.rotation.y = Math.PI / 2;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: daruma', err)
);

loader.load(
  'assets/models/dragon_books.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.3, 0.3, 0.3);
    model.position.set(3.1, 1.3, 1.75);
    model.rotation.y = -Math.PI / 2;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: dragon books', err)
);

/* Reused single-book model to populate the shelf */
loader.load(
  'assets/models/single_book.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.7, 0.7, 0.7);
    model.position.set(3.1, 1.3, 3.1);
    model.rotation.y = Math.PI;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: single book', err)
);

loader.load(
  'assets/models/single_book.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.7, 0.7, 0.7);
    model.position.set(3.1, 1.3, 2.89);
    model.rotation.y = Math.PI;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: single book', err)
);

loader.load(
  'assets/models/single_book.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.7, 0.7, 0.7);
    model.position.set(3.1, 1.3, 2.73);
    model.rotation.y = Math.PI;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: single book', err)
);

loader.load(
  'assets/models/single_book.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.7, 0.7, 0.7);
    model.position.set(3.1, 1.3, 2.58);
    model.rotation.y = Math.PI;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: single book', err)
);

loader.load(
  'assets/models/pokeball.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.1, 0.1, 0.1);
    model.position.set(3, 1.25, 2.3);
    model.rotation.y = Math.PI / 2;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: pokeball', err)
);

/* Interactive trophy cards */
loader.load(
  'assets/models/trophy.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.3, 0.3, 0.3);
    model.position.set(3, 2, 2.8);
    model.rotation.y = Math.PI / 2;
    model.userData.id = 'trophy1';
    makeInteractive(model);
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: trophy 1', err)
);

loader.load(
  'assets/models/trophy.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.3, 0.3, 0.3);
    model.position.set(3, 2, 2.3);
    model.rotation.y = Math.PI / 2;
    model.userData.id = 'trophy2';
    makeInteractive(model);
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: trophy 2', err)
);

/* Reused perfume bottle models for shelf decoration */
loader.load(
  'assets/models/colonia_1.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.1, 0.1, 0.1);
    model.position.set(3, 1.9, 1.8);
    model.rotation.y = -Math.PI / 2;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: perfume bottle 1', err)
);

loader.load(
  'assets/models/colonia_2.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.1, 0.1, 0.1);
    model.position.set(3, 1.9, 1.8);
    model.rotation.y = -Math.PI / 2;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: perfume bottle 2', err)
);

loader.load(
  'assets/models/colonia_3.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.1, 0.1, 0.1);
    model.position.set(3, 1.9, 1.8);
    model.rotation.y = -Math.PI / 2;
    scene.add(model);
  },
  undefined,
  (err) => console.error('Error loading model: perfume bottle 3', err)
);

/* ---------------------------------- */
/* Animation loop and startup         */
/* ---------------------------------- */

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

  const mobileView = window.innerWidth <= 768;

  if (mobileView) {
    camera.position.set(-5, 2.8, 5.5);

    controls.minDistance = 2.2;
    controls.maxDistance = 5.2;
    controls.minPolarAngle = Math.PI * 0.25;
    controls.maxPolarAngle = Math.PI * 0.44;
    controls.target.set(0, 1.15, 0);
  } else {
    camera.position.set(-6, 3, 6);

    controls.minDistance = 1.2;
    controls.maxDistance = 6.0;
    controls.minPolarAngle = Math.PI * 0.2;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.target.set(0, 1.2, 0);
  }

  controls.update();
});




