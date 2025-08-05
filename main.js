import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a102b); // Morado oscuro estilo voxel

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.5, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);

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
controls.update();

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
    model.scale.set(0.725, 0.72, 0.601);

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
    model.scale.set(0.725, 0.72, 0.72);

    // Posicionar en la esquina inferior izquierda de la habitación
    model.position.set(0, 0, 2.3);

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
    model.scale.set(0.725, 0.72, 0.71);

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

    // Añadir a escena
    scene.add(model);

    console.log('Modelo cargado correctamente');
  },
  undefined,
  (err) => console.error('Error cargando modelo:', err)
);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
