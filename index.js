import * as THREE from 'three';
import { getViewPosition } from 'three/tsl';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

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

// CAMERA CONTROL
const controls = new OrbitControls(camera, renderer.domElement);

// LIGHT
const light = new THREE.PointLight(0xffffff, 100)
light.position.set(2.5, 2.5, 2.5)
scene.add(light)

// SHOW AXES
const axes = new THREE.AxesHelper(5);
scene.add(axes);

// ADD ELEMENT
document.body.appendChild(renderer.domElement);

// CAPSULE
let model;
loader.load('capsule/capsule1.gltf', (gltf) => {


	scene.add(gltf.scene);

	gltf.asset;

	model = gltf.scene
}, 
(xhr) => {console.log((xhr.loaded/xhr.total * 100) + '% Loaded')},
(err) => {console.log('error')});


// CAMERA ADJUST
camera.position.set(0, 3, 5);
camera.lookAt(0, 0, 0);

// ANIMATION
function animate(){

	if (model) {
		//model.rotation.x += 0.01;
		//getCapsulePosition(model);
	}
	renderer.render(scene, camera);
}

function getCapsulePosition(capsuleModel) {
	//let pos = capsuleModel.position;

	console.log(capsuleModel.isObject3D);
	const box = new THREE.Box3().expandByObject(capsuleModel);

	const posMin = box.min.z;
	const posMax = box.max.z;
	


	const direction = posMax.sub(posMin).normalize();
	console.log(direction)


	
	// ARROW

	const origin = new THREE.Vector3(0, 0, 0);

	const arrow = new THREE.ArrowHelper(direction, origin, 10, 0x00ff00);
	scene.add(arrow);



	//return [pos.x, pos.y, pos.z];
}


// START ANIMATION
renderer.setAnimationLoop(animate);