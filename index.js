import * as TR from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'jsm/controls/GLTFLoader.js'

const w = window.innerWidth;
const h = window.innerHeight;

const renderer = new TR.WebGLRenderer({ antialias: true });

renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 100;
const camera = new TR.PerspectiveCamera(fov, aspect, near, far)
camera.position.z = 2

const scene = new TR.Scene();
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.03

//GLTF ------
const gltfLoader = new GLTFLoader();
console.log('Aaaa')
gltfLoader.load('./assets/pendiente.gltf', (gltf) => {
  console.log(gltf);
})



const loader = new TR.TextureLoader();
const geo = new TR.IcosahedronGeometry(1.0, 12);

const material = new TR.MeshStandardMaterial({
  map: loader.load("./assets/—Pngtree—white dot matrix square pattern_5756733.png")
})

const mesh = new TR.Mesh(geo, material)
scene.add(mesh)

const hemiLight = new TR.HemisphereLight(0xffffff, 0xFFFFFF, 3)
scene.add(hemiLight)

function animate(
  //t = 0
) {
  requestAnimationFrame(animate);
  //mesh.rotation.x = t * 0.0001
  //camera.position.x = Math.sin(t) + 1
  console.log('aAaa')
  renderer.render(scene, camera);
  controls.update()
}
animate()
