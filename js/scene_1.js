import * as THREE from '../build/three.module.js';

import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { FBXLoader } from '../jsm/loaders/FBXLoader.js';
import { ColladaLoader } from '../jsm/loaders/ColladaLoader.js';
import Stats from '../jsm/libs/stats.module.js';
import { CSS2DRenderer, CSS2DObject } from '../jsm/renderers/CSS2DRenderer.js';
import { VRButton } from '../jsm/webxr/VRButton.js';



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
var swiper1, swiper2;
var swiper = [swiper1, swiper2];
var light, light1, light2, light3, light4;

var clock = new THREE.Clock();

var mixer;
var InfoButton1, InfoButton2;
var InfoButton = [InfoButton1, InfoButton2];
var selectedButton = 0;
var isInfo = false;
var oldFov;
var targetFov = 0.7;
var targetCamera = new THREE.Vector3(0.8, 1, 3);
var oldTargetCamera = new THREE.Vector3(0, 0, 0);

init();
// buildGui();
animate();

function init() {

	container = document.createElement('div');
	container.id = "containerScene";
	document.body.appendChild(container);

	document.body.appendChild( VRButton.createButton( renderer ) );
	renderer.xr.enabled = true;

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
	camera.position.set(0, 0, 0);
	oldFov = camera.fov;

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

		// if (index == 12)
		// {
		const element = models[index];

		loader.load('../models/fbx/' + element + '/' + element + '.fbx', function (object) {
			object.position.y -= 200;

			var textureLoader = new THREE.TextureLoader();
			var map = textureLoader.load('../models/fbx/' + element + '/texture.png');
			var material = new THREE.MeshPhongMaterial({ map: map });

			object.traverse(function (child) {
				if (child.isMesh) {
					child.material = material;

					if (index == 6) {
						console.log("element: ", element);
						child.add(InfoButton[0]);
					}

					if (index == 4) {
						console.log("element2: ", element);
						child.add(InfoButton[1]);
					}
				}
			});
			scene.add(object);
		});
		// }
	}
	var loadingManager = new THREE.LoadingManager(function () {

		// scene.add( roomModel );

	});


	// collada

	var colladaLoader = new ColladaLoader(loadingManager);

	colladaLoader.load('../models/collada/basicroom/O20296_Basicroom.dae', function (collada) {
		roomModel = collada.scene;

	});
	//


	var tempDiv = document.createElement('div');
	tempDiv.id = 'tempDiv';
	var tempLabel = new CSS2DObject(tempDiv);
	tempLabel.position.set(0, 0, 0);
	scene.add(tempLabel);



	var fullScreenButton = document.createElement('div');
	fullScreenButton.className = 'fullScreenButton';
	fullScreenButton.id = 'fullScreenButton';

	container.appendChild(fullScreenButton);
	$(fullScreenButton).on('click touchend', function (event) {
		toogleFullScreen();
		event.stopPropagation();
		event.preventDefault();
	});

	AddPanel();


	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	container.appendChild(renderer.domElement);



	labelRenderer = new CSS2DRenderer();
	labelRenderer.domElement.id = "labelRenderer";
	labelRenderer.domElement.className = 'labelRenderer';
	labelRenderer.setSize(window.innerWidth, window.innerHeight);
	// labelRenderer.domElement.style.position = 'absolute';
	// labelRenderer.domElement.style.top = '0px';
	// labelRenderer.domElement.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
	document.body.appendChild(labelRenderer.domElement);
	$(labelRenderer.domElement).on('click touchend', function (event) {
		if (isInfo) {
			if (event.target != labelRenderer.domElement) {
				event.stopPropagation();
				return;
			}
			myFunction();
		}
		event.stopPropagation();
		event.preventDefault();
	});

	// controls

	controls = new OrbitControls(camera, labelRenderer.domElement);

	//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

	controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
	controls.dampingFactor = 0.05;

	controls.screenSpacePanning = false;

	controls.minDistance = 10;
	controls.maxDistance = 20;
	// controls.target.set( 0, 0, 0);

	controls.maxPolarAngle = Math.PI / 2;
	controls.minPolarAngle = Math.PI / 3;

	window.addEventListener('resize', onWindowResize, false);

	// stats
	stats = new Stats();
	container.appendChild(stats.dom);
	renderer.domElement.id = 'canv';


}

function AddPanel() {

	// var backgroundDiv = document.createElement('div');
	// backgroundDiv.id = "backgroundDiv";
	// backgroundDiv.className = 'backgroundDiv';
	// // document.body.appendChild(backgroundDiv);
	// $(backgroundDiv).on('click touchend', function (event) {
	// 	myFunction();
	// 	event.stopPropagation();
	// 	event.preventDefault();
	// });
	for (let i = 0; i < InfoButton.length; i++) {

		var InfoButtonDiv = document.createElement('div');
		InfoButtonDiv.id = "infoContainer" + i;
		InfoButtonDiv.className = 'infoContainer';


		var panel = document.createElement('div');
		panel.className = 'panel';
		panel.id = "panel" + i;

		var title = document.createElement('div');
		title.className = 'title';
		title.id = "title" + i;
		title.innerHTML += '<h2>Scroll Container</h2>';
		title.innerHTML += '<h4>Scroll Container</h4>';


		var linkButton = document.createElement('div');
		linkButton.className = 'linkButton';
		linkButton.id = "linkButton" + i;
		linkButton.textContent = 'GOOGLE';
		$(linkButton).on('click touchend', function (event) {
			linkFunction();
			event.stopPropagation();
			event.preventDefault();
		});

		var swiperContainer = document.createElement('div');
		swiperContainer.className = 'swiper-container';
		swiperContainer.id = "swiper-container" + i;

		var swiperWrapper = document.createElement('div');
		swiperWrapper.className = 'swiper-wrapper';
		// swiperWrapper.id = "swiper-wrapper";
		swiperContainer.appendChild(swiperWrapper);

		var swiperSlide = document.createElement('div');
		swiperSlide.className = 'swiper-slide';
		// swiperSlide.id = "swiper-slide";
		swiperWrapper.appendChild(swiperSlide);

		swiperSlide.innerHTML += '<h4>Scroll Container</h4>';
		swiperSlide.innerHTML += '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In luctus, ex eu sagittis faucibus, ligula ipsum sagittis magna, et imperdiet dolor lectus eu libero. Vestibulum venenatis eget turpis sed faucibus. Maecenas in ullamcorper orci, eu ullamcorper sem. Etiam elit ante, luctus non ante sit amet, sodales vulputate odio. Aenean tristique nisl tellus, sit amet fringilla nisl volutpat cursus. Quisque dignissim lectus ac nunc consectetur mattis. Proin vel hendrerit ipsum, et lobortis dolor. Vestibulum convallis, nibh et tincidunt tristique, nisl risus facilisis lectus, ut interdum orci nisl ac nunc. Cras et aliquam felis. Quisque vel ipsum at elit sodales posuere eget non est. Fusce convallis vestibulum dolor non volutpat. Vivamus vestibulum quam ut ultricies pretium.</p>';
		swiperSlide.innerHTML += '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In luctus, ex eu sagittis faucibus, ligula ipsum sagittis magna, et imperdiet dolor lectus eu libero. Vestibulum venenatis eget turpis sed faucibus. Maecenas in ullamcorper orci, eu ullamcorper sem. Etiam elit ante, luctus non ante sit amet, sodales vulputate odio. Aenean tristique nisl tellus, sit amet fringilla nisl volutpat cursus. Quisque dignissim lectus ac nunc consectetur mattis. Proin vel hendrerit ipsum, et lobortis dolor. Vestibulum convallis, nibh et tincidunt tristique, nisl risus facilisis lectus, ut interdum orci nisl ac nunc. Cras et aliquam felis. Quisque vel ipsum at elit sodales posuere eget non est. Fusce convallis vestibulum dolor non volutpat. Vivamus vestibulum quam ut ultricies pretium.</p>';


		var swiperScrollbar = document.createElement('div');
		swiperScrollbar.className = 'swiper-scrollbar';
		// swiperScrollbar.id = "swiper-scrollbar";
		swiperContainer.appendChild(swiperScrollbar);



		var label = document.createElement('div');
		label.className = 'label';
		label.id = 'label' + i;
		label.textContent = '+';
		$(label).on('click touchend', function (event) {
			selectedButton = i;
			myFunction();
			event.stopPropagation();
			event.preventDefault();
		});

		InfoButtonDiv.appendChild(panel);

		panel.appendChild(title);
		InfoButtonDiv.appendChild(label);

		panel.appendChild(swiperContainer);

		panel.appendChild(linkButton);

		InfoButton[i] = new CSS2DObject(InfoButtonDiv);
		InfoButton[i].position.set(-2, 15, -1);


		// backgroundButton = new CSS2DObject(backgroundDiv);
		// scene.add(backgroundButton);


			// swiper[i] = new Swiper(swiperContainer, {
			// 	direction: 'vertical',
			// 	slidesPerView: 'auto',
			// 	freeMode: true,
			// 	scrollbar: {
			// 		el: swiperScrollbar,
			// 	},
			// 	mousewheel: true,
			// });
	}
}

renderer.setAnimationLoop( function () {

	renderer.render( scene, camera );

} );

function toogleFullScreen() {

	if (THREEx.FullScreen.activated()) {
		THREEx.FullScreen.cancel();
		onWindowResize();
	} else {
		THREEx.FullScreen.request();
		onWindowResize();
	}
}
function linkFunction() {
	window.open("https://www.google.com");
}

function myFunction() {

	if (isInfo) {
		isInfo = false;
		document.getElementById("panel" + selectedButton).style.width = "0px";
		document.getElementById("panel" + selectedButton).style.height = "0px";
		// document.getElementById("panel" + selectedButton).style.borderRadius = "50%";
		document.getElementById("panel" + selectedButton).style.background = 'rgba(112, 112, 112, 0)';
		document.getElementById("panel" + selectedButton).style.paddingTop = "0px";
		document.getElementById("panel" + selectedButton).style.paddingLeft = "0px";
		document.getElementById("panel" + selectedButton).style.paddingRight = "0px";
		document.getElementById("panel" + selectedButton).style.paddingBottom = "0px";
		document.getElementById("title" + selectedButton).style.opacity = "0";
		document.getElementById("linkButton" + selectedButton).style.opacity = "0";
		document.getElementById("swiper-container" + selectedButton).style.opacity = "0";
		document.getElementById("label" + selectedButton).style.transform = 'rotate(0deg)';
		labelRenderer.domElement.style.backgroundColor = "rgba(0, 0, 0, 0)";
		controls.enabled = true;
		gsap.to(tempDiv, 2, {
			left: 0, ease: "power2.out",
			onUpdate: function () {
				var value = parseInt(tempDiv.style.left) / 100000;
				camera.fov = oldFov * gsap.utils.interpolate(1, targetFov, value);
				camera.updateProjectionMatrix();
			},
			onComplete: function () {
				// controls.enabled = true;
			}
		});
	}
	else {
		isInfo = true;
		controls.enabled = false;

		oldTargetCamera = camera.position;

		gsap.to(tempDiv, 1.8, {
			left: 100000, ease: "power2.out",
			onUpdate: function () {
				var value = parseInt(tempDiv.style.left) / 100000;
				camera.position.x = gsap.utils.interpolate(oldTargetCamera.x, targetCamera.x, value);
				camera.position.y = gsap.utils.interpolate(oldTargetCamera.y, targetCamera.y, value);
				camera.position.z = gsap.utils.interpolate(oldTargetCamera.z, targetCamera.z, value);
				camera.fov = oldFov * gsap.utils.interpolate(1, targetFov, value);
				camera.updateProjectionMatrix();
			},
			onComplete: function () {
				if (isInfo) {
					document.getElementById("panel" + selectedButton).style.width = "350px";//document.getElementById("infoContainer").offsetWidth + "px";
					document.getElementById("panel" + selectedButton).style.height = "420px";//document.getElementById("infoContainer").offsetHeight + "px";
					// document.getElementById("panel").style.borderRadius = "10px";
					document.getElementById("panel" + selectedButton).style.background = 'rgba(180, 180, 180, 0.9)';
					document.getElementById("panel" + selectedButton).style.paddingTop = "80px";
					document.getElementById("panel" + selectedButton).style.paddingLeft = "40px";
					document.getElementById("panel" + selectedButton).style.paddingRight = "40px";
					document.getElementById("panel" + selectedButton).style.paddingBottom = "40px";
					document.getElementById("title" + selectedButton).style.opacity = "1";
					document.getElementById("linkButton" + selectedButton).style.opacity = "1";
					document.getElementById("swiper-container" + selectedButton).style.opacity = "1";
					document.getElementById("label" + selectedButton).style.transform = 'rotate(45deg)';
					labelRenderer.domElement.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
				}
			}
		});
	}

}




function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.render(scene, camera);
	document.getElementById("labelRenderer").style.width = window.innerWidth + "px";
	document.getElementById("labelRenderer").style.height = window.innerHeight + "px";
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
	labelRenderer.render(scene, camera);
	stats.update();
	for (let i = 0; i < swiper.length; i++) {
		swiper[i].update();
	}

}