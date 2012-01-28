// set the scene size
var WIDTH = 400,
    HEIGHT = 300;

// set some camera attributes
var VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

// Size of the individual cubes
var SIZE = 50;

// Space between the cubes
var SPACE = 5;

var SUM = SIZE + SPACE;

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
var longitude = 90;
var latitude = 0;

var controls;

var MAIN_CUBE_ROTATION_RAD = Math.PI / 30;
var MINI_ROTATION_RAD = Math.PI / 6;

// Parent of all the cubes
var mainCube = new THREE.Object3D();

var YELLOW = 0xffff00;
var WHITE = 0xffffff;
var ORANGE = 0xffa500;
var RED = 0xff0000;
var BLUE = 0x0000ff;
var GREEN = 0x00ff00;

var MATERIALS = [];

var sides = new Array();

/**
 * Contain an array of wrappers:
 * object: the three.js object
 * x,y,z: -1,0,1 coordinates
 */
var OBJECTS = new Array();

init();
animate();

function onDocumentKeyDown( event ) {

  var rot = MINI_ROTATION_RAD;
  var inc = 5;
  switch (event.keyCode) {
    case 87: //sides[0].rotation.x += rot; break; // w
    case 83: //group.rotation.x -= rot; break; // s
    case 66: rotateSideAroundZ(getBackObjects(), rot); break; // b = back
    case 68: rotateSideAroundY(getDownObjects(), rot); break; // d = down
    case 70: rotateSideAroundZ(getFrontObjects(), rot); break; // f = front
    case 76: rotateSideAroundX(getLeftObjects(), rot); break; // l
    case 82: rotateSideAroundX(getRightObjects(), rot); break; // r
    case 85: rotateSideAroundY(getUpObjects(), rot); break; // u = up

    case 88: // x
      mainCube.rotation.y -= MAIN_CUBE_ROTATION_RAD;
      if (event.shiftKey) longitude += inc;
      else longitude -= inc;
//      camera.position.x += (event.shiftKey ? -rotX : rotX);
//      camera.position.z += (event.shiftKey ? rotZ : -rotZ);
      break;
    case 89:
      mainCube.rotation.y += MAIN_CUBE_ROTATION_RAD;
      if (event.shiftKey) latitude += inc;
      else latitude -= inc;
      break;
    default:
      console.log("keyCode:" + event.keyCode)
      return false;
  }
  console.log("camera:" + camera.position.x + "," + camera.position.y + "," + camera.position.z);
}

function getDownObjects() {
  return getSide(function(o) { return o.position.y == -SUM; });
}

function getUpObjects() {
  return getSide(function(o) { return o.position.y == SUM; });
}

function getLeftObjects() {
  return getSide(function(o) { return o.position.x == -SUM; });
}

function getRightObjects() {
  return getSide(function(o) { return o.position.x == SUM; });
}

function getBackObjects() {
  return getSide(function(o) { return o.position.z == -SUM; });
}

function getFrontObjects() {
  return getSide(function(o) { return o.position.z == SUM; });
}

function getSide(f) {
  var result = new Array();
  for (var i = 0; i < OBJECTS.length; i++) {
    if (f(OBJECTS[i])) result.push(OBJECTS[i]);
  }
  return result;
}

function rotateSideAroundZ(objects, rot) {
  var pivot = new THREE.Object3D();
  for (var i = 0; i < objects.length; i++) {
    rotateAroundZ(pivot, objects[i], rot);
  }
}

function rotateSideAroundY(objects, rot) {
  var pivot = new THREE.Object3D();
  for (var i = 0; i < objects.length; i++) {
    rotateAroundY(pivot, objects[i], rot);
  }
}

function rotateSideAroundX(objects, rot) {
  var pivot = new THREE.Object3D();
  for (var i = 0; i < objects.length; i++) {
    rotateAroundX(pivot, objects[i], rot);
  }
}

function init() {
  MATERIALS.push( new THREE.MeshBasicMaterial( { color: YELLOW } ) );       // Left side
  MATERIALS.push( new THREE.MeshBasicMaterial( { color: WHITE } ) );       // Right side
  MATERIALS.push( new THREE.MeshBasicMaterial( { color: RED} ) );       // Top side
  MATERIALS.push( new THREE.MeshBasicMaterial( { color: ORANGE} ) );       // Bottom side
  MATERIALS.push( new THREE.MeshBasicMaterial( { color: GREEN} ) );       // Front side
  MATERIALS.push( new THREE.MeshBasicMaterial( { color: BLUE } ) );       // Back side

  // the camera starts at 0,0,0 so pull it back
  camera.position.x = 300;
  camera.position.y = 300;
  camera.position.z = 500;

  // start the renderer
  renderer.setSize(WIDTH, HEIGHT);

  // attach the render-supplied DOM element
  $container.append(renderer.domElement);

  // Create the six sides
  for (var x = -1; x <= 1; x++) {
    for (var y = -1; y <= 1; y++) {
      for (var z = 1; z >= -1; z--) {
        var materials = [];

        for ( var i = 0; i < 6; i ++ ) {
          materials.push( new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } ) );
        }

        cube = new THREE.Mesh(new THREE.CubeGeometry(SIZE, SIZE, SIZE, 1, 1, 1, MATERIALS),
            new THREE.MeshFaceMaterial());
//        
//        var materials = getMaterial(x, y, z);
//        
//        //    for (var i = 0; i < coo.length; i += 3) {
//        var cubeGeometry = new THREE.CubeGeometry(SIZE, SIZE, SIZE, 1, 1, 1, materials);
//        var cube = new THREE.Mesh(cubeGeometry, new THREE.MeshFaceMaterial());
        cube.overdraw = true;
        cubes.push(cube);
        mainCube.add(cube);
        cube.position.x = x * (SIZE + SPACE);
        cube.position.y = y * (SIZE + SPACE);
        cube.position.z = z * (SIZE + SPACE);
        console.log("x,y,z:" + x + "," + y + "," + z);

//        scene.add(cube);
        OBJECTS.push(cube);
        console.log("Cube position:" + cube.position.x + "," + cube.position.y + "," + cube.position.z);
        //    }
        //    sides.push(thisSide);
      } // sideCount
    }
  }
  scene.add(mainCube);


  // Add all the sides to the scene
//  for (var i = 0; i < sides.length; i++) {
//    scene.add(sides[i]);//when done, add the group to the scene
//  }

  addLights();

  // plane
  var planeMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    transparent: true,
    wireframe: true
  });
  planeMaterial.opacity = 0.5;
  var plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000, 10, 10), planeMaterial);
  plane.position.y = -100;
  plane.rotation.x = - 90 * ( Math.PI / 180 );
  plane.doubleSided = true;
  plane.overdraw = true;
  scene.add(plane);

  controls = new THREE.TrackballControls( camera );
  controls.target.set( 0, 0, 0 );
//  controls.keys = [ 49, 50, 51 ];

//  document.addEventListener('keydown', onDocumentKeyDown, false);
}

function getMaterial(x, y, z) {
//  var result = [];
//  var colors;
//  if (x == 1 && y == 1 && z == 1) {
//    colors = [ RED, GREEN, ORANGE, BLUE, YELLOW, WHITE ]
//  } else {
//    colors = [ 0xcc00cc, 0xcc00cc, 0xcc00cc, 0xcc00cc, 0xcc00cc, 0xcc00cc ]
//  }
  return MATERIALS;
//  for (var i = 0; i < MATERIALS.length; i++) {
//    result.push(MATERIALS[i]);
//    var c = colors[i];
//    console.log("Pushing color: " + c);
//    var lm = new THREE.MeshBasicMaterial({
//      color: c;
//    });
//    result.push(lm);
//  }

//  return result;
}

function addLights() {
//  scene.add(new THREE.AmbientLight(0xffffff));
//  var directionalLight = new THREE.DirectionalLight(0xffffff);
//  directionalLight.position.set(1, 1, 1).normalize();
//  scene.add(directionalLight);
  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 0, 0).normalize();
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

function round(f) {
  return Math.round(parseFloat(f)*100)/100;
}

function rotateAroundX(pivot, fullObject, q) {
  var object = fullObject;
  logPosition("Before position:", object.position);
  var y = object.position.y;
  var z = object.position.z;
  /*
   * x' = x
   * y' = y*cos q - z*sin q
   * z' = y*sin q + z*cos q
   */
  object.rotation.x += q;
  object.position.y = round(y*Math.cos(q) - z*Math.sin(q));
  object.position.z = round(y*Math.sin(q) + z*Math.cos(q));
  logPosition("New position:", object.position);
}

function rotateAroundY(pivot, fullObject, q) {
  var object = fullObject;
  logPosition("Before position:", object.position);
  var c = Math.cos(q);
  var s = Math.sin(q);
  var x = object.position.x;
  var z = object.position.z;

  /*
   * x' = z*sin q + x*cos q
   * y' = y
   * z' = z*cos q - x*sin q
   */
  object.position.x = round(z*s + x*c);
  object.rotation.y += q;
  object.position.z = round(z*c - x*s);
  logPosition("New position:", object.position);
}

/*
 * x' = x*cos q - y*sin q
 * y' = x*sin q + y*cos q
 * z' = z
 */
//function rotateZFunction(position, q) {
//  var c = Math.cos(q);
//  var s = Math.sin(q);
//  position.x = round(position.x*c - position.y*s);
//  position.y = round(position.x*s + position.y*c);
//  object.rotation.z += q;
//}

function rotateAroundZ(pivot, fullObject, q) {
  var object = fullObject;
  logPosition("Before position:", object.position);
//  rotateZFunction(object.position, q);
//  (fullObject.position, q);
  /*
   * x' = x*cos q - y*sin q
   * y' = x*sin q + y*cos q
   * z' = z
   */
  var c = Math.cos(q);
  var s = Math.sin(q);
  var x = object.position.x;
  var y = object.position.y;
  object.position.x = round(x*c - y*s);
  object.position.y = round(x*s + y*c);
  object.rotation.z += q;
  logPosition("New position:", object.position);
}


function toRadians(degrees) {
  return degrees * (Math.PI/180);
}

function render() {
  var distance = 400;
  latitude = Math.max( - 85, Math.min( 85, latitude ) );
  phi = ( 90 - latitude ) * Math.PI / 180;
  theta = longitude * Math.PI / 180;

//  camera.position.x = distance * Math.sin( phi ) * Math.cos( theta );
//  camera.position.y = distance * Math.cos( phi );
//  camera.position.z = distance * Math.sin( phi ) * Math.sin( theta );
//
//  // Need to do this at every frame
  camera.lookAt(scene.position);
  controls.update();
  renderer.render( scene, camera );
}

function align(target, dir, rot) {
  //Three.js uses a Y up coordinate system, so the cube inits with this vector
  var up = new THREE.Vector3(0, 1, 0);

  //euler angle between direction vector and up vector
  var angle = Math.acos(up.dot(dir));

  //cross product of the up vector and direction vector
  var axis = new THREE.Vector3();
  axis.cross(up, dir);
  axis.normalize();

  //rotation to aligns the target with the direction vector
  var rotate = THREE.Matrix4.rotationAxisAngleMatrix(axis, angle);

  //rotation around direction vector
  var revolve = THREE.Matrix4.rotationAxisAngleMatrix(dir, rot);

  //compose the rotations (order matters, can be done other ways)
  revolve.multiplySelf(rotate);

  //assign matrix (autoUpdateMatrix = false)
  target.matrix = revolve;
}

function dump() {
  for (var i = 0; i < OBJECTS.length; i++) {
    var o = OBJECTS[i];
    logPosition("Cube:", o.position);
  }
}