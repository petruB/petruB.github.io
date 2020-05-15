import * as THREE from '../build/three.module.js';

import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { FBXLoader } from '../jsm/loaders/FBXLoader.js';
import { ColladaLoader } from '../jsm/loaders/ColladaLoader.js';
import Stats from '../jsm/libs/stats.module.js';
import { CSS2DRenderer, CSS2DObject } from '../jsm/renderers/CSS2DRenderer.js';



var models = [
	"Bild",
	"Drucker",
	"EPXL",
	"Heater",
	"Helpdesk",
	"Helpdesk_mirror",
	"Infoboard",
	"Kassenstele",
	"Magazine",
	"Room",
	"Sicherung",
	"Sitzhocker",
	"Staffelei",
	"Tastatur",
	"Door",
	"Wall 01_01",
	"Wall 01_02",
	"Wall 01_03",
	"Wall 01_04",
	"Wall 01_05",
	"Wall 01_06",
	"Wall 01_07",
	"Wall 02"
];



var container, stats, controls;
var camera, scene, renderer, labelRenderer;
var roomModel;
var spotLight, spotLight1;

var light, light1, light2, light3, light4;

var clock = new THREE.Clock();

var mixer;

init();
// buildGui();
animate();

function init() {

	container = document.createElement('div');
	document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
	camera.position.set(100, 200, 300);

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xa0a0a0);



	spotLight = new THREE.SpotLight(0xffffff, 1);
	spotLight.position.set(200, 100, -100);
	spotLight.angle = Math.PI / 7;
	spotLight.target.position.set(380, -100, -120);


	spotLight.penumbra = 0.05;
	spotLight.decay = 2;
	spotLight.intensity = 1;
	spotLight.distance = 550;

	spotLight.castShadow = false;
	// spotLight.shadow.mapSize.width = 1024;
	// spotLight.shadow.mapSize.height = 1024;
	// spotLight.shadow.camera.near = 10;
	// spotLight.shadow.camera.far = 500;
	scene.add(spotLight);
	scene.add(spotLight.target);

	// lightHelper = new THREE.SpotLightHelper(spotLight);
	// scene.add(lightHelper);

	// shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
	// scene.add(shadowCameraHelper);



	var sphere = new THREE.SphereBufferGeometry(0.5, 16, 8);

	// light1 = new THREE.PointLight(0xffffff, 2, 50);
	// // light1.position.set(0, 200, 0);
	// light1.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xffffff })));
	// scene.add(light1);

	light = new THREE.HemisphereLight(0xffffff, 0x444444);
	light.position.set(0, 200, 0);
	scene.add(light);

	// light = new THREE.DirectionalLight(0xffffff);
	// light.position.set(0, 200, 100);
	// // light.castShadow = true;
	// // light.shadow.camera.top = 180;
	// // light.shadow.camera.bottom = - 100;
	// // light.shadow.camera.left = - 120;
	// // light.shadow.camera.right = 120;
	// scene.add(light);

	// scene.add( new CameraHelper( light.shadow.camera ) );


	// model
	var loader = new FBXLoader();
	// var material = new THREE.MeshStandardMaterial();


	for (let index = 0; index < models.length; index++) {
		const element = models[index];
		
		loader.load('../models/fbx/' + element + '/' + element + '.fbx', function (object) {
			object.position.y -= 200;

			var textureLoader = new THREE.TextureLoader();
			var map = textureLoader.load('../models/fbx/' + element + '/texture.png');
			var material = new THREE.MeshPhongMaterial({ map: map });

			object.traverse(function (child) {
				if (child.isMesh) {
					child.material = material;
					if (index == 6)
					{
						console.log("element: ", element);
						child.add(moonLabel);
					}

					if (index == models.length -1)
					{
						console.log("element: ", element);
						child.add(earthLabel);
					}
				}
			});
			scene.add(object);
		});
	}
	var loadingManager = new THREE.LoadingManager(function () {

		//scene.add( roomModel );

	});


	// collada

	var colladaLoader = new ColladaLoader(loadingManager);

	colladaLoader.load('../models/collada/basicroom/O20296_Basicroom.dae', function (collada) {
		roomModel = collada.scene;

	});
	//


	var earthDiv = document.createElement('div');
	earthDiv.className = 'label';
	earthDiv.textContent = 'Info';
	earthDiv.style.marginTop = '-1em';
	var earthLabel = new CSS2DObject(earthDiv);
	earthLabel.position.set(0, 1, 0);
	//scene.add(earthLabel);

	var moonDiv = document.createElement('div');
	moonDiv.className = 'label';
	moonDiv.textContent = 'Info';
	moonDiv.style.marginTop = '-1em';
	var moonLabel = new CSS2DObject(moonDiv);
	moonLabel.position.set(-1, 6, 0);
	// scene.add(moonLabel);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	container.appendChild(renderer.domElement);



	labelRenderer = new CSS2DRenderer();
	labelRenderer.setSize(window.innerWidth, window.innerHeight);
	labelRenderer.domElement.style.position = 'absolute';
	labelRenderer.domElement.style.top = '0px';
	document.body.appendChild(labelRenderer.domElement);

	// controls

	controls = new OrbitControls(camera, labelRenderer.domElement);

	//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

	controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
	controls.dampingFactor = 0.05;

	controls.screenSpacePanning = false;

	controls.minDistance = 10;
	controls.maxDistance = 20;
	//controls.target.set( 0, 0, 0);

	controls.maxPolarAngle = Math.PI / 2;
	controls.minPolarAngle = Math.PI / 3;

	window.addEventListener('resize', onWindowResize, false);

	// stats
	stats = new Stats();
	container.appendChild(stats.dom);

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

//

function animate() {
	// lightHelper.update();
	// shadowCameraHelper.update();
	requestAnimationFrame(animate);

	var delta = clock.getDelta();

	if (mixer) mixer.update(delta);

	renderer.render(scene, camera);
	controls.update();
	labelRenderer.render( scene, camera );
	stats.update();

}

// function buildGui() {

// 	gui = new GUI();

// 	var params = {
// 		'light color': spotLight.color.getHex(),
// 		intensity: spotLight.intensity,
// 		distance: spotLight.distance,
// 		angle: spotLight.angle,
// 		penumbra: spotLight.penumbra,
// 		decay: spotLight.decay
// 	};

// 	gui.addColor(params, 'light color').onChange(function (val) {

// 		spotLight.color.setHex(val);
// 		render();

// 	});

// 	gui.add(params, 'intensity', 0, 2).onChange(function (val) {

// 		spotLight.intensity = val;
// 		render();

// 	});


// 	gui.add(params, 'distance', 50, 200).onChange(function (val) {

// 		spotLight.distance = val;
// 		render();

// 	});

// 	gui.add(params, 'angle', 0, Math.PI / 3).onChange(function (val) {

// 		spotLight.angle = val;
// 		render();

// 	});

// 	gui.add(params, 'penumbra', 0, 1).onChange(function (val) {

// 		spotLight.penumbra = val;
// 		render();

// 	});

// 	gui.add(params, 'decay', 1, 2).onChange(function (val) {

// 		spotLight.decay = val;
// 		render();

// 	});

// 	gui.open();

// }