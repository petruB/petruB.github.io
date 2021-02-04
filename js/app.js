import { BoxLineGeometry } from './geometries/BoxLineGeometry.js';
import { XRControllerModelFactory } from './webxr/XRControllerModelFactory.js';
var APP = {

	Player: function () {

		const clock = new THREE.Clock();

		let container;
		let camera, scene, raycaster, renderer;

		let room;
		var cube;
		var SPEED = 0.01;

		let controller, controllerGrip;
		let INTERSECTED;
		const tempMatrix = new THREE.Matrix4();

		const fov = 75;
		const aspect = 2;  // the canvas default
		const near = 0.1;
		const far = 5;

		const boxWidth = 1;
		const boxHeight = 1;
		const boxDepth = 1;
		const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
		const fragmentShader = `
		#include <common>

		uniform vec3 iResolution;
		uniform float iTime;
		uniform sampler2D iChannel0;

		// By Daedelus: https://www.shadertoy.com/user/Daedelus
		// license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
		// #define TIMESCALE 0.25 
		// #define TILES 8
		// #define COLOR 0.7, 1.6, 2.8

		#define TAU 6.28318530718

		#define TILING_FACTOR 1.0
		#define MAX_ITER 8

		void mainImage( out vec4 fragColor, in vec2 fragCoord ) 
		{
			float time = iTime * 0.1+23.0;
			vec2 uv = fragCoord.xy / iResolution.xy;
			vec2 uv_square = vec2(uv.x * iResolution.x / iResolution.y, uv.y);
			float dist_center = pow(2.0*length(uv - 0.5), 2.0);
			
			float foaminess = smoothstep(0.4, 1.8, dist_center);
			float clearness = 0.1 + 0.9*smoothstep(0.1, 0.5, dist_center);
			
			vec2 p = mod(uv_square*TAU*TILING_FACTOR, TAU)-250.0;
			
			//waterHighlight
			vec2 i = vec2(p);
			float c = 0.0;
			float foaminess_factor = mix(1.0, 6.0, foaminess);
			float inten = .005 * foaminess_factor;

			for (int n = 0; n < MAX_ITER; n++) 
			{
				float t = time * (1.0 - (3.5 / float(n+1)));
				i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
				c += 1.0/length(vec2(p.x / (sin(i.x+t)),p.y / (cos(i.y+t))));
			}
			c = 0.2 + c / (inten * float(MAX_ITER));
			c = 1.17-pow(c, 1.4);
			c = pow(abs(c), 8.0);
			
			
			c = c / sqrt(foaminess_factor);
			
			vec3 water_color = vec3(0.1, 0.5, 0.0);
			vec3 color = vec3(c);
			color = clamp(color + water_color, 0.0, 1.0);
			
			color = mix(water_color, color, clearness);

			fragColor = vec4(color, 1.0);
		}

		varying vec2 vUv;

		void main() {
			mainImage(gl_FragColor, vUv * iResolution.xy);
		}
		`;
		const vertexShader = `
			varying vec2 vUv;
			void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}
		`;
		init();

		const loader = new THREE.TextureLoader();
		const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/bayer.png');
		texture.minFilter = THREE.NearestFilter;
		texture.magFilter = THREE.NearestFilter;
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		const uniforms = {
			iTime: { value: 0 },
			iResolution: { value: new THREE.Vector3(1, 1, 1) },
			iChannel0: { value: texture },
		};
		const material = new THREE.ShaderMaterial({
			vertexShader,
			fragmentShader,
			uniforms,
		});
		function makeInstance(geometry, x) {
			const cube = new THREE.Mesh(geometry, material);
			scene.add(cube);

			cube.position.x = x;

			return cube;
		}

		const cubes = [
			makeInstance(geometry, 0),
			makeInstance(geometry, -2),
			makeInstance(geometry, 2),
		];


		animate();

		function init() {

			container = document.createElement('div');
			document.body.appendChild(container);

			scene = new THREE.Scene();
			scene.background = new THREE.Color(0x505050);

			camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;
			scene.add(camera);

			// room = new THREE.LineSegments(
			// 	new BoxLineGeometry(6, 6, 6, 10, 10, 10).translate(0, 3, 0),
			// 	new THREE.LineBasicMaterial({ color: 0x808080 })
			// );
			// scene.add(room);

			scene.add(new THREE.HemisphereLight(0x606060, 0x404040));

			const light = new THREE.DirectionalLight(0xffffff);
			light.position.set(1, 1, 1).normalize();
			scene.add(light);

			// const geometry = new THREE.BoxBufferGeometry( 0.15, 0.15, 0.15 );

			// for ( let i = 0; i < 50; i ++ ) {

			// const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

			// 	object.position.x = Math.random() * 4 - 2;
			// 	object.position.y = Math.random() * 4;
			// 	object.position.z = Math.random() * 4 - 2;

			// 	object.rotation.x = Math.random() * 2 * Math.PI;
			// 	object.rotation.y = Math.random() * 2 * Math.PI;
			// 	object.rotation.z = Math.random() * 2 * Math.PI;

			// 	object.scale.x = Math.random() + 0.5;
			// 	object.scale.y = Math.random() + 0.5;
			// 	object.scale.z = Math.random() + 0.5;

			// 	object.userData.velocity = new THREE.Vector3();
			// 	object.userData.velocity.x = Math.random() * 0.01 - 0.005;
			// 	object.userData.velocity.y = Math.random() * 0.01 - 0.005;
			// 	object.userData.velocity.z = Math.random() * 0.01 - 0.005;

			// 	room.add( object );

			// }

			//BoxGeometry (makes a geometry)
			var geometry = new THREE.BoxGeometry(1, 1, 1);
			//Material to apply to the cube (green)
			var material = new THREE.MeshLambertMaterial({ color: 0xaa0ff });
			//Applies material to BoxGeometry
			// cube = new THREE.Mesh(geometry, material);

			// cube.position.y = 1.5;
			// cube.position.z = -2.5;
			// cube.rotation.y = 1.5;
			// cube.rotation.z = 2.5;
			// //Adds cube to the scene
			// room.add(cube);

			raycaster = new THREE.Raycaster();

			renderer = new THREE.WebGLRenderer({ antialias: true });
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.outputEncoding = THREE.sRGBEncoding;
			renderer.xr.enabled = true;
			container.appendChild(renderer.domElement);

			//

			function onSelectStart() {

				this.userData.isSelecting = true;

			}

			function onSelectEnd() {

				this.userData.isSelecting = false;

			}

			controller = renderer.xr.getController(0);
			controller.addEventListener('selectstart', onSelectStart);
			controller.addEventListener('selectend', onSelectEnd);
			controller.addEventListener('connected', function (event) {

				this.add(buildController(event.data));

			});
			controller.addEventListener('disconnected', function () {

				this.remove(this.children[0]);

			});
			scene.add(controller);

			const controllerModelFactory = new XRControllerModelFactory();

			controllerGrip = renderer.xr.getControllerGrip(0);
			controllerGrip.add(controllerModelFactory.createControllerModel(controllerGrip));
			scene.add(controllerGrip);

			window.addEventListener('resize', onWindowResize, false);

			//

			document.body.appendChild(VRButton.createButton(renderer));

		}

		function resizeRendererToDisplaySize(renderer) {
			const canvas = renderer.domElement;
			const width = canvas.clientWidth;
			const height = canvas.clientHeight;
			const needResize = canvas.width !== width || canvas.height !== height;
			if (needResize) {
				renderer.setSize(width, height, false);
			}
			return needResize;
		}

		function buildController(data) {

			let geometry, material;

			switch (data.targetRayMode) {

				case 'tracked-pointer':

					geometry = new THREE.BufferGeometry();
					geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, - 1], 3));
					geometry.setAttribute('color', new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3));

					material = new THREE.LineBasicMaterial({ vertexColors: true, blending: THREE.AdditiveBlending });

					return new THREE.Line(geometry, material);

				case 'gaze':

					geometry = new THREE.RingBufferGeometry(0.02, 0.04, 32).translate(0, 0, - 1);
					material = new THREE.MeshBasicMaterial({ opacity: 0.5, transparent: true });
					return new THREE.Mesh(geometry, material);

			}

		}

		function onWindowResize() {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		}


		function animate() {


			renderer.setAnimationLoop(render);
			rotateCube();

		}

		function rotateCube() {
			if (cube) {
				cube.rotation.x = SPEED * 2;
				cube.rotation.y -= SPEED;
				cube.rotation.z -= SPEED * 3;
			}
		}

		function render(time) {

			const delta = clock.getDelta() * 60;
			time *= 0.001;  // convert to seconds
			// rotateCube();

			if (resizeRendererToDisplaySize(renderer)) {
				const canvas = renderer.domElement;
				camera.aspect = canvas.clientWidth / canvas.clientHeight;
				camera.updateProjectionMatrix();
			}

			cubes.forEach((cube, ndx) => {
				const speed = .01 + ndx * .1;
				const rot = time * speed;
				cube.rotation.x = rot;
				cube.rotation.y = rot;
			});

			uniforms.iTime.value = time;

			if (controller.userData.isSelecting === true) {
				// room.position.x = controller.position.x;
				// room.position.y = controller.position.y - 2;
				// room.position.z = -((controller.position.z - 2) * delta);

				cubes.forEach((cube, ndx) => {
					cube.position.z = -2;
					cube.position.y = 1.5;
				});

			}

			// find intersections

			tempMatrix.identity().extractRotation(controller.matrixWorld);

			raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
			raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

			// const intersects = raycaster.intersectObjects(room.children);

			// if (intersects.length > 0) {

			// 	if (INTERSECTED != intersects[0].object) {

			// 		if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

			// 		INTERSECTED = intersects[0].object;
			// 		INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
			// 		INTERSECTED.material.emissive.setHex(0xff0000);

			// 	}

			// } else {

			// 	if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

			// 	INTERSECTED = undefined;

			// }

			// Keep cubes inside room

			// for ( let i = 0; i < room.children.length; i ++ ) {

			// 	const cube = room.children[ i ];

			// 	cube.userData.velocity.multiplyScalar( 1 - ( 0.001 * delta ) );

			// 	cube.position.add( cube.userData.velocity );

			// 	if ( cube.position.x < - 3 || cube.position.x > 3 ) {

			// 		cube.position.x = THREE.MathUtils.clamp( cube.position.x, - 3, 3 );
			// 		cube.userData.velocity.x = - cube.userData.velocity.x;

			// 	}

			// 	if ( cube.position.y < 0 || cube.position.y > 6 ) {

			// 		cube.position.y = THREE.MathUtils.clamp( cube.position.y, 0, 6 );
			// 		cube.userData.velocity.y = - cube.userData.velocity.y;

			// 	}

			// 	if ( cube.position.z < - 3 || cube.position.z > 3 ) {

			// 		cube.position.z = THREE.MathUtils.clamp( cube.position.z, - 3, 3 );
			// 		cube.userData.velocity.z = - cube.userData.velocity.z;

			// 	}

			// 	cube.rotation.x += cube.userData.velocity.x * 2 * delta;
			// 	cube.rotation.y += cube.userData.velocity.y * 2 * delta;
			// 	cube.rotation.z += cube.userData.velocity.z * 2 * delta;

			// }

			renderer.render(scene, camera);

		}

	}
};

export { APP };
