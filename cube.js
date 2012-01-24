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

var MINI_ROTATION_RAD = Math.PI / 6;

var sides = new Array();

var BACK_OBJECTS = new Array();
var FRONT_OBJECTS = new Array();
var LEFT_OBJECTS = new Array();
var RIGHT_OBJECTS = new Array();
var DOWN_OBJECTS = new Array();
var UP_OBJECTS = new Array();

init();
animate();

function onDocumentKeyDown( event ) {

  var rot = MINI_ROTATION_RAD;
  var inc = 5;
  switch (event.keyCode) {
    case 87: //sides[0].rotation.x += rot; break; // w
    case 83: //group.rotation.x -= rot; break; // s
    case 66: rotateSideAroundZ(BACK_OBJECTS, rot); break; // b = back
    case 68: rotateSideAroundY(DOWN_OBJECTS, rot); break; // d = down
    case 70: rotateSideAroundZ(FRONT_OBJECTS, rot); break; // f = front
    case 76: rotateSideAroundX(LEFT_OBJECTS, rot); break; // l
    case 82: rotateSideAroundX(RIGHT_OBJECTS, rot); break; // r
    case 85: rotateSideAroundY(UP_OBJECTS, rot); break; // u = up

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
  // the camera starts at 0,0,0 so pull it back
  camera.position.x = 0;
  camera.position.y = 5;
  camera.position.z = 500;

  // start the renderer
  renderer.setSize(WIDTH, HEIGHT);

  // attach the render-supplied DOM element
  $container.append(renderer.domElement);

  // create a new mesh with sphere geometry -
  // we will cover the material next!
  var SIZE = 50;
  var SPACE = 20;

  // Create the six sides
  for (var x = -1; x <= 1; x++) {
    for (var y = -1; y <= 1; y++) {
      for (var z = -1; z <= 1; z++) {
        // create the material
        var material = new THREE.MeshLambertMaterial({
          color: 0xee0000
        });
        
        //    for (var i = 0; i < coo.length; i += 3) {
        var cube = new THREE.Mesh(
            new THREE.CubeGeometry(SIZE, SIZE, SIZE),
            material);
        cubes.push(cube);
        cube.position.x = x * (SIZE + SPACE);
        cube.position.y = y * (SIZE + SPACE);
        cube.position.z = z * (SIZE + SPACE);
        console.log("x,y,z:" + x + "," + y + "," + z);
        if (z == 1) {
          FRONT_OBJECTS.push(cube);
          console.log("Added cube to front:" + cube + " size:" + FRONT_OBJECTS.length);
        }
        if (z == -1) {
          BACK_OBJECTS.push(cube);
          console.log("Added cube to back:" + cube + " size:" + BACK_OBJECTS.length);
        }
        if (y == 1) {
          UP_OBJECTS.push(cube);
          console.log("Added cube to up:" + cube + " size:" + UP_OBJECTS.length);
        }
        if (y == -1) {
          DOWN_OBJECTS.push(cube);
          console.log("Added cube to down:" + cube + " size:" + DOWN_OBJECTS.length);
        }
        if (x == 1) {
          RIGHT_OBJECTS.push(cube);
          console.log("Added cube to right:" + cube + " size:" + RIGHT_OBJECTS.length);
        }
        if (x == -1) {
          LEFT_OBJECTS.push(cube);
          console.log("Added cube to left:" + cube + " size:" + LEFT_OBJECTS.length);
        }
        
        scene.add(cube);
        console.log("Cube position:" + cube.position.x + "," + cube.position.y + "," + cube.position.z);
        //    }
        //    sides.push(thisSide);
      } // sideCount
    }
  }


  // Add all the sides to the scene
//  for (var i = 0; i < sides.length; i++) {
//    scene.add(sides[i]);//when done, add the group to the scene
//  }

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

function rotateAroundPivot(pivot, object) {
  var degrees = 30;
  var position = object.position;
  var offsetX = position.x - pivot.position.x;
  var offsetY = position.y - pivot.position.y;
  var radians = toRadians(degrees);
  var nx = Math.cos(radians) * offsetX - Math.sin(radians) * offsetY;
  var ny = Math.sin(radians) * offsetX + Math.cos(radians)*offsetY;

  logPosition("Before position:", object.position);
  object.rotation.z += radians;
  object.position.x = nx + pivot.position.x;
  object.position.y = ny + pivot.position.y;
  logPosition("New position:", object.position);
}

function rotateAroundPivot2(pivot, object) {
  var q = toRadians(20);
  var c = Math.cos(q);
  var s = Math.sin(q);
  var y = object.position.y;
  var z = object.position.z;
  var m = new THREE.Matrix4(
      1,0,0,0,
      0, c*y, s*y, 0,
      0, -s*z, c*z, 0,
      0, 0, 0, 1);
  object.matrix.multiplySelf(m);
  logPosition("Before matrix: ", object.position);
  object.position.setPositionFromMatrix(object.matrix);
  logPosition("After matrix: ", object.position);
}

function rotateAroundX(pivot, object, q) {
  logPosition("Before position:", object.position);
  var y = object.position.y;
  var z = object.position.z;
  /*
   * x' = x
   * y' = y*cos q - z*sin q
   * z' = y*sin q + z*cos q
   */
  object.rotation.x += q;
  object.position.y = y*Math.cos(q) - z*Math.sin(q);
  object.position.z = y*Math.sin(q) + z*Math.cos(q);
  logPosition("New position:", object.position);
}

function rotateAroundY(pivot, object, q) {
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
  object.position.x = z*s + x*c;
  object.rotation.y += q;
  object.position.z = z*c - x*s;
  logPosition("New position:", object.position);
}

function rotateAroundZ(pivot, object, q) {
  logPosition("Before position:", object.position);
  var c = Math.cos(q);
  var s = Math.sin(q);
  /*
   * x' = x*cos q - y*sin q
   * y' = x*sin q + y*cos q
   * z' = z
   */
  var x = object.position.x;
  var y = object.position.y;
  object.position.x = x*c - y*s;
  object.position.y = x*s + y*c;
  object.rotation.z += q;
  logPosition("New position:", object.position);
}


function toRadians(degrees) {
  return degrees * (Math.PI/180);
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