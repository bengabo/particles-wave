import * as THREE from "three";
import { AxesHelper } from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */

// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
// scene.add(new AxesHelper());

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
let currentTexture = "/textures/particles/12.png";
const particleTexture = textureLoader.load("/textures/particles/1.png");

// Material
const particlesMaterial = new THREE.PointsMaterial({
  color: 0xff88cc,
  map: particleTexture,
  size: 0.7,
  sizeAttenuation: true,
  transparent: true,
  alphaMap: particleTexture,
  //   alphaTest: 0.001,
  depthTest: false,
  //   depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
});

const changeTexture = () => {
  const randomNumber = Math.floor(Math.random() * 13) + 1;
  let newTexture = `/textures/particles/${randomNumber}.png`;
  currentTexture = newTexture;

  textureLoader.load(newTexture, function (texture) {
    particlesMaterial.map = texture;
    particlesMaterial.needsUpdate = true;
  });
};

// Textures button
const texturesButton = document.getElementById("changeTexture");
texturesButton.addEventListener("click", changeTexture);

/**
 * Particles
 */
// Geometry
const particlesSphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const particlesGeometry = new THREE.BufferGeometry();
const count = 2000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 5;
  colors[i] = Math.random();
}
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const cameraGroup = new THREE.Group();
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 2;
camera.position.y = 0.25;
camera.position.z = 4.5;
cameraGroup.add(camera);
scene.add(cameraGroup);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update particles
  particles.rotation.y = elapsedTime * 0.01;
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const x = particlesGeometry.attributes.position.array[i3];
    const y = particlesGeometry.attributes.position.array[i3 + 1];
    const z = particlesGeometry.attributes.position.array[i3 + 2];
    particlesGeometry.attributes.position.array[i3 + 1] =
      Math.sin(elapsedTime + z + x) / 0.8;
  }

  particlesGeometry.attributes.position.needsUpdate = true;

  // Update camera
  cameraGroup.rotation.y = elapsedTime * -0.05;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
