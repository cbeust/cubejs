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
var lon = 45;
var lat = 45;

init();
animate();

function onDocumentKeyDown( event ) {
  var inc = 20;

  var rot = Math.PI / 15;
  var rotX = Math.cos(Math.PI / 10) * 20;
  var rotY = Math.sin(Math.PI / 10) * 20;
  var rotZ = Math.sin(Math.PI / 10) * 20;
  switch (event.keyCode) {

//          case 38: camera.position.x++; break;  // up
//          case 40: camera.position.x--; break;  // down
//          case 37: moveLeft = true; break; // left
//          case 39: moveRight = true; break; // right
    case 87: cubes[0].rotation.x += rot; break; // w
    case 83: cubes[0].rotation.x -= rot; break; // s
    case 65: cubes[0].rotation.y += rot; break; // a
    case 68: cubes[0].rotation.y -= rot; break; // d

    case 88: // x
      if (event.shiftKey) lon++;
      else lon--;
//      camera.position.x += (event.shiftKey ? -rotX : rotX);
//      camera.position.z += (event.shiftKey ? rotZ : -rotZ);
      break;
    case 89:
      if (event.shiftKey) lat++;
      else lat--;
//    case 90: camera.position.z += (event.shiftKey ? -inc : inc) ; break; // z
//    case 88: camera.position.x += (event.shiftKey ? -inc : inc) ; break; // x
//    case 89: camera.position.y += (event.shiftKey ? -inc : inc) ; break; // y
//    case 90: camera.position.z += (event.shiftKey ? -inc : inc) ; break; // z
    default: console.log("keyCode:" + event.keyCode)
  }
  console.log("camera:" + camera.position.x + "," + camera.position.y + "," + camera.position.z);
}

function init() {
  // the camera starts at 0,0,0 so pull it back
  camera.position.x = 0;
  camera.position.y = 5;
  camera.position.z = 500;

  // start the renderer
  renderer.setSize(WIDTH, HEIGHT);

  // attach the render-supplied DOM element
  $container.append(renderer.domElement);

  // create the sphere's material
  var sphereMaterial = new THREE.MeshLambertMaterial(
  {
      color: 0xFFFFFF
  });

  // create a new mesh with sphere geometry -
  // we will cover the sphereMaterial next!
  var SIZE = 50;
  var SPACE = 5;
  for (var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {
      var cube = new THREE.Mesh(
         new THREE.CubeGeometry(SIZE, SIZE, SIZE),
         sphereMaterial);
    cubes.push(cube);
    cube.position.x = i * (SIZE + SPACE);
    cube.position.y = j * (SIZE + SPACE);
    cube.position.z = 0;

//      cube.rotation.x = Math.random() * 200 - 100;
//      cube.rotation.y = Math.random() * 200 - 100;
//      cube.rotation.z = Math.random() * 200 - 100;

      console.log("Cube position:" + cube.position.x + "," + cube.position.y + "," + cube.position.z);
      // add the sphere to the scene
      scene.add(cube);
    }
  }

  addLights();

  // plane
  var plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshBasicMaterial({
      color: 0x0000ff
  }));
  plane.rotation.x = - 90 * ( Math.PI / 180 );
  plane.doubleSided = true;
  plane.overdraw = true;
  scene.add(plane);

  document.addEventListener('keydown', onDocumentKeyDown, false);
}

function addLights() {

  var positions = new Array(
//    { x: 0, y: 200, z: 0 }
    { x: 0, y: 0, z: 500 }
    , { x: -400, y: 0, z: 0 }
  );
  var colors = new Array(
      0xFF0000,
      0x00FF00,
      0x0000FF
  );

  for (var i = 0; i < positions.length; i++) {
    // create a point light
    var pointLight = new THREE.PointLight(colors[i]);
    
    // set its position
    var p = positions[i];
    pointLight.position = p;
    console.log("Light at: " + p.x + "," + p.y + "," + p.z + " color:" + colors[i]);

    // add to the scene
    scene.add(pointLight);
  }
}

function animate() {
  requestAnimationFrame(animate);
  render();
  // stats.update();
}

function logPosition(s, vector) {
  console.log(s + ": " + vector.x + "," + vector.y + "," + vector.z);
}

function render() {
  var distance = 400;
  lat = Math.max( - 85, Math.min( 85, lat ) );
  phi = ( 90 - lat ) * Math.PI / 180;
  theta = lon * Math.PI / 180;

  camera.position.x = distance * Math.sin( phi ) * Math.cos( theta );
  camera.position.y = distance * Math.cos( phi );
  camera.position.z = distance * Math.sin( phi ) * Math.sin( theta );
  logPosition("Camera:", camera.position);

  // Need to do this at every frame
  camera.lookAt(scene.position);

  renderer.render( scene, camera );
}
