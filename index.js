import * as THREE from 'three';
import { getViewPosition } from 'three/tsl';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/Addons.js';

// SCENE & CAMERA
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x888888)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// LOADER
const loader = new GLTFLoader();

const draco = new DRACOLoader();
draco.setDecoderPath('/examples/jsm/libs/draco');
loader.setDRACOLoader(draco)


// RENDERER
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth * 0.95, window.innerHeight * 0.95);

// ADD ELEMENT
document.body.appendChild(renderer.domElement);

// CUBE
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial( {
	color: 0x8800ff
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

// LINE
const lineMaterial = new THREE.LineBasicMaterial({
	color: 0x00ff00
});

const points = [
	new THREE.Vector3(-2, 0, 0),
	new THREE.Vector3(0, 2, 0),
	new THREE.Vector3(2, 0, 0)
]

const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

const line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);

// CAPSULE
loader.load('capsule/capsule_rev_b.gltf', (gltf) => {

	scene.add(gltf.scene);

	gltf.animations;
	gltf.scene;
	gltf.scenes;
	gltf.cameras;
	gltf.asset;
}, 
(xhr) => {console.log((xhr.loaded/xhr.total * 100) + '% Loaded')},
(err) => {console.log('error')});


// CAMERA ADJUST
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

// ANIMATION
function animate(){
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	cube.rotation.z += 0.01;
	document.getElementById('text').textContent = 2;

	line.rotation.x += 0.01;
	renderer.render(scene, camera);
}

// START ANIMATION
renderer.setAnimationLoop(animate);