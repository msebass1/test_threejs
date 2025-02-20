import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { EffectComposer } from "jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "jsm/postprocessing/UnrealBloomPass.js";
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js'

function createGradientTexture() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 512;
  canvas.height = 512;

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#000000");
  gradient.addColorStop(0.3, "#030006")
  gradient.addColorStop(0.5, "#030006")
  gradient.addColorStop(1, "#000000");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return new THREE.CanvasTexture(canvas);
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const particles = new THREE.BufferGeometry();
const particleCount = 1000;
const positions = new Float32Array(particleCount * 3);
const velocities = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 200;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
  positions[i * 3 + 2] = Math.random() * -500;
  velocities[i] = Math.random() * 2;
}

particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
particles.setAttribute("velocity", new THREE.BufferAttribute(velocities, 1));

scene.background = createGradientTexture();

const glrfLoader = new GLTFLoader()
const necklace = await glrfLoader.loadAsync('./assets/avocado.gltf')
const avocadoScene = necklace.scene
avocadoScene.scale.set(30, 30, 30)
avocadoScene.traverse((child) => {
  if (child.isMesh) {
    child.geometry.center();
  }
})

scene.add(avocadoScene)

// glrfLoader.load('./assets/avocado.gltf', (glrf) =>{
//   console.log(glrf.scene.children)
//   const necklace = glrf.scene;
//   necklace.traverse((child) =>{
//     if(child.isMesh){
//       child.geometry.center();
//     }
//   });
//   necklace.scale.set(30,30,30)
//   scene.add(necklace)
// })

const loader = new THREE.TextureLoader();

const material = new THREE.PointsMaterial({
  map: loader.load("./assets/—Pngtree—white dot matrix square pattern_5756733.png"),
  size: 0.5,
  transparent: true,
  opacity: 0.8,
});
const points = new THREE.Points(particles, material);
scene.add(points);


// Roca
//const materialgeo = new THREE.MeshStandardMaterial({
// map: loader.load("./assets/cliff_side_diff_4k.jpg")
//})

//const mesh = new THREE.Mesh(geo, materialgeo)
//scene.add(mesh)

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xFFFFFF, 3)
scene.add(hemiLight)

camera.position.z = 5;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
composer.addPass(bloomPass);

let rotationVelocity = 0.01;

window.addEventListener('click', () => {
  setInterval(()=>{
  rotationVelocity += 0.01
  }, 20)
  setTimeout(() => {
    window.location.href = 'home.html'
  }, 1100)
})

function animate() {
  requestAnimationFrame(animate);
  avocadoScene.rotation.y += rotationVelocity;

  const positions = particles.attributes.position.array;
  const velocities = particles.attributes.velocity.array;

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3 + 2] += velocities[i];
    if (positions[i * 3 + 2] > 10) {
      positions[i * 3 + 2] = -500;
    }
  }

  particles.attributes.position.needsUpdate = true;

  controls.update();
  composer.render();
}

animate();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  composer.setSize(window.innerWidth, window.innerHeight);
});
