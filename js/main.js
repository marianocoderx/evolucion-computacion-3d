import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Elementos del DOM
const canvas = document.getElementById('three-canvas');
const infoPanel = document.getElementById('info-panel');
const infoTitle = document.getElementById('info-title');
const infoDesc = document.getElementById('info-description');
const infoImage = document.getElementById('info-image');
const closePanel = document.getElementById('close-panel');

// Escena básica
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000022); // Azul oscuro espacial

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 20, 80);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Controles de órbita (volar con mouse)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 10;
controls.maxDistance = 200;

// Luz básica
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(50, 50, 50);
scene.add(pointLight);

// Cargar el JSON y crear esferas
let hitos = [];

fetch('/events-computing.json')
  .then(response => response.json())
  .then(data => {
    hitos = data;

    hitos.forEach(hito => {
      // Esfera para cada hito
      const geometry = new THREE.SphereGeometry(3, 32, 32); // Radio 3
      const material = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x004444,
        metalness: 0.5,
        roughness: 0.3
      });
      const sphere = new THREE.Mesh(geometry, material);
      
      // Posición desde el JSON
      sphere.position.set(...hito.position);
      sphere.userData = hito; // Guardamos los datos del hito aquí
      
      scene.add(sphere);

      // Texto flotante simple (opcional, usa sprite o CSS3D para mejor efecto)
      // Por ahora lo dejamos en el panel
    });
  })
  .catch(err => console.error('Error cargando JSON:', err));

// Raycaster para detectar clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Click en la pantalla
window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const object = intersects[0].object;
    if (object.userData.title) { // Es un hito
      const hito = object.userData;
      
      infoTitle.textContent = hito.title + ' (' + hito.year + ')';
      infoDesc.textContent = hito.description;
      if (hito.image) {
        infoImage.src = hito.image;
        infoImage.style.display = 'block';
      } else {
        infoImage.style.display = 'none';
      }
      
      infoPanel.classList.add('visible');
    }
  }
});

// Cerrar panel
closePanel.addEventListener('click', () => {
  infoPanel.classList.remove('visible');
});

// Animación loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Responsive
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});