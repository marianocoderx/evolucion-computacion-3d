// js/main.js - Versión completa, sin módulos extras por ahora

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Logs para depurar
console.log('main.js cargado correctamente');

// Elementos DOM
const canvas = document.getElementById('three-canvas');
if (!canvas) console.error('Canvas no encontrado en el DOM');

const infoPanel = document.getElementById('info-panel');
const infoTitle = document.getElementById('info-title');
const infoDesc = document.getElementById('info-description');
const infoImage = document.getElementById('info-image');
const closePanel = document.getElementById('close-panel');

// Escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000022);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 30, 120);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Luces
scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(100, 100, 100);
scene.add(pointLight);

// Controles
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Grupo de hitos
const hitosGroup = new THREE.Group();
scene.add(hitosGroup);

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Cargar JSON
fetch('/events-computing.json')
  .then(response => {
    console.log('Respuesta fetch:', response.status);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then(hitos => {
    console.log('JSON cargado con éxito. Hitos:', hitos.length);

    hitos.forEach((hito, index) => {
      const geo = new THREE.SphereGeometry(4, 32, 32);
      const mat = new THREE.MeshStandardMaterial({ color: 0x00ffff });
      const sphere = new THREE.Mesh(geo, mat);
      sphere.position.set(...hito.position);
      sphere.userData = hito;
      hitosGroup.add(sphere);
    });
  })
  .catch(err => {
    console.error('Error al cargar JSON:', err);
  });

// Click
window.addEventListener('click', e => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(hitosGroup.children);

  if (intersects.length > 0) {
    const hito = intersects[0].object.userData;
    infoTitle.textContent = hito.title;
    infoDesc.textContent = hito.description;
    infoImage.src = hito.image || '';
    infoImage.style.display = hito.image ? 'block' : 'none';
    infoPanel.classList.add('visible');
  }
});

closePanel.addEventListener('click', () => infoPanel.classList.remove('visible'));

// Animación
function animate() {
  requestAnimationFrame(animate);
  hitosGroup.children.forEach(s => s.rotation.y += 0.003);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});