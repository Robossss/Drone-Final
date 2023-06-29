import * as THREE from 'three';
import Stats from '/jsm/libs/stats.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';
import VirtualJoystick from '/jsm/controls/Joystick.js';
import { GLTFLoader } from '/jsm/loaders/GLTFLoader.js'


  let renderer, scene, camera, world, stats, container,container2, raycaster, fog, controls;
  let clock = new THREE.Clock();
  let deltaTime = clock.getDelta()
  const STATE = { DISABLE_DEACTIVATION: 4 };

  container = document.getElementById('joystick-container');
  container2 = document.getElementById('joystick-container2');
  const joystick = new VirtualJoystick(container, {
    width: 100,
    height: 100,
    color: 'grey',
    handleColor: 'black',
    handleRadius: 28
  });
const joystick2 = new VirtualJoystick(container2, {
    width: 100,
    height: 100,
    color: 'grey',
    handleColor: 'black',
    handleRadius: 28
  });





  // Create the renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  // Create the scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

  raycaster = new THREE.Raycaster();

  const fogColor = new THREE.Color(0x000000);
  const fogNear = 10;
  const fogFar = 100;
  fog = new THREE.Fog(fogColor, fogNear, fogFar);

  // Set the fog for the scene
  //  scene.fog = fog;


  stats = new Stats();
  document.body.appendChild(stats.dom);

  function onWindowResize() {
    // Get the current size of the screen
    var width = window.innerWidth;
    var height = window.innerHeight;
    
    // Update the renderer size and aspect ratio
    renderer.setSize(width, height);
    camera.aspect = width / height;
    
    // Check if the device is in landscape or portrait mode
    if (width > height) {
        // Landscape mode
        camera.left = -width / height;
        camera.right = width / height;
        camera.top = 1;
        camera.bottom = -1;
    } else {
        // Portrait mode
        camera.left = -1;
        camera.right = 1;
        camera.top = height / width;
        camera.bottom = -height / width;
    }
    
    // Update the camera projection matrix
    camera.updateProjectionMatrix();
}

// Call the onWindowResize function whenever the window is resized
window.addEventListener('resize', onWindowResize);


  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000000);
  camera.position.set(0, 30, 30);

  scene.add(camera);


   
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 10, 0);
  const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
  const axisHelper = new THREE.AxesHelper(10);
  scene.add(directionalLight);
  scene.add(directionalLightHelper);
  scene.add(axisHelper);

  
  
const loader = new GLTFLoader();
loader.load(
  'assets/scene.gltf',
  function (gltf) {
    const model = gltf.scene;
    const scaleValue = 10; // Adjust the scale factor as needed
    model.scale.set(scaleValue, scaleValue, scaleValue);
    scene.add(model);

    const animations = gltf.animations;
    if (animations && animations.length > 0) {
      const mixer = new THREE.AnimationMixer(model);
      const animation = animations[0]; // Assuming you want to play the first animation

      const action = mixer.clipAction(animation);
      action.play();


function updateModel() {
  // Adjust the position or rotation of the model based on joystick input
 const translationFactor = 0.05; // Adjust the translation factor as needed
  const angle = controls.getAzimuthalAngle(); // Get the azimuthal angle from your controls
  
  // Calculate the movement in the X and Z axes based on joystick input and angle
  const moveX = joystick.x * Math.cos(angle) + joystick.y * Math.sin(angle);
  const moveZ = -joystick.x * Math.sin(angle) + joystick.y * Math.cos(angle);
  
  // Adjust the position of the model based on the calculated movement
  model.position.x += moveX * translationFactor;
  model.position.z += moveZ * translationFactor;
  
  model.position.y += -joystick2.y * 0.04
  // Example: Rotate the model based on joystick input
  model.rotation.y += -joystick2.x * 0.01; // Adjust the rotation factor as needed
  //model.rotation.x += joystick.y * 0.05;

 // Update the sphere coordinates display
 const sphereCoordinatesElement = document.getElementById('sphere-position');
 sphereCoordinatesElement.textContent = `X: ${model.position.x.toFixed(2)}, Y: ${model.position.y.toFixed(2)}, Z: ${model.position.z.toFixed(2)}`;
}

      // Render loop
      function animate() {
        requestAnimationFrame(animate);
        mixer.update(0.016); // Time delta for the animation playback
     //  renderer.render(scene, camera);
     updateModel()
      }
      animate();
    }
  },
  undefined,
  function (error) {
    console.error('Error loading GLTF model:', error);
  }
);



controls = new OrbitControls(camera, renderer.domElement);


function animate() {
    requestAnimationFrame(animate);
    


const deltaTime = clock.getDelta(); // Use Three.js clock to measure time


    stats.update();
    renderer.render(scene, camera);
  }

  animate();

