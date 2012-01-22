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
var lon = 90;
var lat = 0;

var group;

init();
animate();

function onDocumentKeyDown( event ) {

  var rot = Math.PI / 15;
  var inc = 5;
  switch (event.keyCode) {

//          case 38: camera.position.x++; break;  // up
//          case 40: camera.position.x--; break;  // down
//          case 37: moveLeft = true; break; // left
//          case 39: moveRight = true; break; // right
    case 87: group.rotation.x += rot; break; // w
    case 83: group.rotation.x -= rot; break; // s
    case 65: group.rotation.z += rot; break; // a
    case 68: group.rotation.z -= rot; break; // d

    case 88: // x
      if (event.shiftKey) lon += inc;
      else lon -= inc;
//      camera.position.x += (event.shiftKey ? -rotX : rotX);
//      camera.position.z += (event.shiftKey ? rotZ : -rotZ);
      break;
    case 89:
      if (event.shiftKey) lat += inc;
      else lat -= inc;
      break;
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

  // create the material
  var material = new THREE.MeshLambertMaterial(
  {
      color: 0xFF0000
  });

  // create a new mesh with sphere geometry -
  // we will cover the material next!
  var SIZE = 50;
  var SPACE = 5;
  group = new THREE.Object3D();//create an empty container
  for (var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {

      var cube = new THREE.Mesh(
         new THREE.CubeGeometry(SIZE, SIZE, SIZE),
         material);
      cubes.push(cube);
      cube.position.x = i * (SIZE + SPACE);
      cube.position.y = j * (SIZE + SPACE);
      cube.position.z = 0;
      group.add(cube);//add a mesh with geometry to it
  
      console.log("Cube position:" + cube.position.x + "," + cube.position.y + "," + cube.position.z);
      group.add(cube);
    }
  }
  scene.add(group);//when done, add the group to the scene

  addLights();

  // plane
  var plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshBasicMaterial({
      color: 0x0000ff
  }));
  plane.rotation.x = - 90 * ( Math.PI / 180 );
  plane.doubleSided = true;
  plane.overdraw = true;
//  scene.add(plane);

  document.addEventListener('keydown', onDocumentKeyDown, false);
}

function addLights() {
  scene.add(new THREE.AmbientLight(0xffffff));
  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);
  directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(-1, -1, -1).normalize();
  scene.add(directionalLight);
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
//  logPosition("Camera:", camera.position);

  // Need to do this at every frame
  camera.lookAt(scene.position);

  renderer.render( scene, camera );
}
