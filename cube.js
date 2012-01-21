// set the scene size
var WIDTH = 400,
    HEIGHT = 300;

// set some camera attributes
var VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

// get the DOM element to attach to
// - assume we've got jQuery to hand
var $container = $('#container');

// create a WebGL renderer, camera
// and a scene
var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(  VIEW_ANGLE,
                                ASPECT,
                                NEAR,
                                FAR  );
var scene = new THREE.Scene();
var cubes = new Array();

init();
animate();

function onDocumentKeyDown( event ) {
  var inc = 20;

  var rot = Math.PI / 15;
  switch (event.keyCode) {

//          case 38: camera.position.x++; break;  // up
//          case 40: camera.position.x--; break;  // down
//          case 37: moveLeft = true; break; // left
//          case 39: moveRight = true; break; // right
    case 87: cubes[0].rotation.x += rot; break; // w
    case 83: cubes[0].rotation.x -= rot; break; // s
    case 65: cubes[0].rotation.y += rot; break; // a
    case 68: cubes[0].rotation.y -= rot; break; // d

    case 88: camera.position.x += (event.shiftKey ? -inc : inc) ; break; // x
    case 89: camera.position.y += (event.shiftKey ? -inc : inc) ; break; // y
    case 90: camera.position.z += (event.shiftKey ? -inc : inc) ; break; // z
    default: console.log("keyCode:" + event.keyCode)
  }
  camera.lookAt(cubes[0].position);
}

function init() {
  // the camera starts at 0,0,0 so pull it back
  camera.position.x = 100;
  camera.position.y = 100;
  camera.position.z = 500;

  // start the renderer
  renderer.setSize(WIDTH, HEIGHT);

  // attach the render-supplied DOM element
  $container.append(renderer.domElement);

  // create the sphere's material
  var sphereMaterial = new THREE.MeshLambertMaterial(
  {
      color: 0xCC0000
  });

  // create a new mesh with sphere geometry -
  // we will cover the sphereMaterial next!
    var SIZE = 50;
    var SPACE = 5;
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        var cube = new THREE.Mesh(
           new THREE.CubeGeometry(SIZE, SIZE, SIZE),
           sphereMaterial);
      cubes.push(cube);
      cube.position.x = 50 + i * (SIZE + SPACE);
      cube.position.y = 50 + j * (SIZE + SPACE);

//      cube.rotation.x = Math.random() * 200 - 100;
//      cube.rotation.y = Math.random() * 200 - 100;
//      cube.rotation.z = Math.random() * 200 - 100;

        console.log("Cube position:" + cube.position.x + "," + cube.position.y + "," + cube.position.z);
        // add the sphere to the scene
        scene.add(cube);
      }
    }

  // create a point light
  var pointLight = new THREE.PointLight( 0xFFFFFF );

  // set its position
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;

  // add to the scene
  scene.add(pointLight);

  document.addEventListener('keydown', onDocumentKeyDown, false);
}

function animate() {
  requestAnimationFrame(animate);
  render();
  // stats.update();
}

function render() {
  renderer.render( scene, camera );
}
