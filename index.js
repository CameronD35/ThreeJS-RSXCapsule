import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import data from './data.js';


window.addEventListener('resize', resizeScene);



// SCENE & CAMERA
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x888888)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let frame = 0;

// LOADER
const loader = new GLTFLoader();

const draco = new DRACOLoader();
draco.setDecoderPath('/examples/jsm/libs/draco');
loader.setDRACOLoader(draco);


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
	frame++;
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


function addArrowToScene(){
	const origin = new THREE.Vector3(0, 0, 0);

	arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), origin, 2, 0x00ff00);
	scene.add(arrow);
}

function getCurrentAngle(obj, euler){
	if (euler){
		return obj.rotation;
	}

	return obj.quaternion;
}


function applyQuaternion(object, gyroscopeData){

	if(modelLoaded){

		let prevQuaternion = object.quaternion;

		let newQuaternion = calculateNewQuaternion(prevQuaternion, gyroscopeData);

		object.quaternion.slerp(newQuaternion, 0.5);
	}
}

function calculateNewQuaternion(prevQuaternion, gyroscopeData){

	// Angular velocities in respective axes
	const angV_X = toRad(gyroscopeData['Gyroscope_x'])/2;
	const angV_Y = toRad(gyroscopeData['Gyroscope_y'])/2;
	const angV_Z = toRad(gyroscopeData['Gyroscope_z'])/2;

	// https://www.steppeschool.com/pages/blog/imu-and-quaternions
	let matrixA = [
		[1, -angV_X, -angV_Y, -angV_Z],
		[angV_X, 1, angV_Z, -angV_Y],
		[-angV_Y, -angV_Z, 1, angV_X],
		[angV_Z, angV_Y, -angV_X, 1]
	];

	let matrixB = [
		[prevQuaternion.x],
		[prevQuaternion.w],
		[prevQuaternion.y],
		[prevQuaternion.z]
	];

	let result = multiplyMatricies(matrixA, matrixB);
	
	let newQuaternion = new THREE.Quaternion(result[0][0][0], result[1][0][0], result[2][0][0], result[3][0][0]);
	newQuaternion.normalize();

	return newQuaternion;
	
}

function multiplyMatricies(A, B){


	if (A[0].length == B.length){
		console.log('works', A.length);

		let result = []

		for(let i = 0; i < A.length; i++){
			let row = []

			for(let j = 0; j < B[0].length; j++){

				let total = 0;

				for(let k = 0; k < A[0].length; k++){

					//console.log(i, j, k);
					total = total + (A[i][k] * B[k][j]);
				}

				//console.log(total);
				row.push([total]);
			}

			result.push(row);


		}

		return result;

	} else {
		console.log('cannot multiply matricies');
	}


}

// angV = angular velocity
function toRad(angV){
	return ((angV * Math.PI)/180);
}

function findType(obj, type){
	let geometry;

	obj.children.forEach((child) => {
		if (child.type === type){
			geometry = child.geometry;
		}
	});

	return geometry;
}

function resizeScene(){

	camera.aspect = window.innerWidth / window.innerHeight;

	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth * 0.95, window.innerHeight * 0.95);
}

let testNum = 0
setInterval(() => {
	if(modelLoaded){
		applyQuaternion(model, data[testNum++])
	}
}, 100)

// START ANIMATION
renderer.setAnimationLoop(animate);