import * as THREE from 'three';
import { getViewPosition, rotate } from 'three/tsl';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const sampleData = [
	{
		x: -1.8904000000000000,
		y: 2.4392000000000000,
		z: 0.9388000000000000
	}, 
	{
		x: -1.6826,
		y: -0.8904,
		z: 2.1708
	},
	{
		x: 2.5608000000000000,
		y: -0.2560000000000000,
		z: -1.4146
	}
]

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
let modelLoaded = false;
loader.load('capsule/capsule1.gltf', (gltf) => {


	scene.add(gltf.scene);

	gltf.asset;

	model = gltf.scene;

	centerModel(model, 0.01);

	modelLoaded = true;

	let geometry = findType(model, 'Mesh');

	model.prevPositon = model.quaternion;

	addArrowToScene();
}, 
(xhr) => {console.log((xhr.loaded/xhr.total * 100) + '% Loaded')},
(err) => {console.log('error')});


// CAMERA ADJUST
camera.position.set(0, 3, 5);
camera.lookAt(0, 0, 0);

// ARROW VARIABLE
let arrow;

// ANIMATION
function animate(){
	renderer.render(scene, camera);
	

	if(modelLoaded){
		//rotateWithQuaternion(model);
		//console.log(model.prevPositon);
	}
}

function centerModel(obj, precisionAmount){
	const geometry = findType(obj, 'Mesh');
	console.log(geometry);

	geometry.center();
}

// axis (string) - string denoting the axis of which to align the center of the object (x, y, z)
function alignToAxis(obj, currentAngles, axis){
	console.log(currentAngles);
}

function addArrowToScene(){
	const origin = new THREE.Vector3(0, 0, 0);

	arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), origin, 2, 0x00ff00);
	scene.add(arrow);
}

// function getCenterPosition(obj) {
// 	//let pos = capsuleModel.position;

// 	//console.log(capsuleModel.isObject3D);
// 	const box = new THREE.Box3().expandByObject(obj);


// 	let coords = new THREE.Vector3();
	
// 	box.getCenter(coords);

// 	console.log(coords);

// 	return coords;

// 	// const posMin = box.min.z;
// 	// const posMax = box.max.z;
	


// 	// const direction = posMax.sub(posMin).normalize();
// 	// console.log(direction)


	
// 	// ARROW



// 	//return [pos.x, pos.y, pos.z];
// }

function getCurrentAngle(obj, euler){
	if (euler){
		return obj.rotation;
	}

	return obj.quaternion;
}


function rotateWithQuaternion(object){

	if(modelLoaded){

		const quaternion = new THREE.Quaternion(0, 0.8, 0, 0.6)

		console.log(object.quaternion);

		object.applyQuaternion(quaternion);
	}
}

function calculateNewRotation(prevQuaternion){
	
	let matrixA = new THREE.Matrix3()
	
}

let test = new THREE.Quaternion(0, 1, 0, 0);
calculateNewRotation(test);
console.log(test);

function findType(obj, type){
	let geometry;

	obj.children.forEach((child) => {
		if (child.type === type){
			geometry = child.geometry;
		}
	});

	return geometry;
}

// window.addEventListener('resize', (evt) => {
// 	let windowDimensions = evt.target.getBoundingClientRect;
// })

// START ANIMATION
renderer.setAnimationLoop(animate);