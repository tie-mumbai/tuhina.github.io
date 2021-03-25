var camera   = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1500),
    scene    = new THREE.Scene(),
    renderer = new THREE.WebGLRenderer({ antialias: true }),
    geometry = new THREE.Geometry(),
    mat      = new THREE.ParticleBasicMaterial({ color: 0x22aaff, size: 3 }),
    radius   = 500;

// Setup
camera.position.z = 1500;
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// Take geographic coordinates and convert them
// into cartesian coordinates (x,y,z)
var geoToCartesian = function(lat, lon, radius) {
  var x, y, z;
  lat *= Math.PI / 180;
  lon *= Math.PI / 180;
  x = -radius * Math.cos(lat) * Math.cos(lon);
  y = radius * Math.sin(lat);
  z = radius * Math.cos(lat) * Math.sin(lon);
  return new THREE.Vector3(x, y, z);
};

cities.forEach(function(city) {
  var vertex = geoToCartesian(city[0], city[1], 400);
  
  geometry.vertices.push(vertex);

  var factor = 100 + Math.random() * 1000;
  var growth = Math.min(0.9, 0.35 + Math.random());
  
  requestAnimationFrame(function update() {
      factor *= growth;
      if (factor > 1) requestAnimationFrame(update);
      vertex.normalize().multiplyScalar(radius + factor);
  });    
});

var particles = new THREE.ParticleSystem(geometry, mat);

scene.add(particles);


// So that the globe may rotate, setup an animation loop and incrementally rotate
requestAnimationFrame(function update() {
  requestAnimationFrame(update);
    
  var time = Date.now() * 0.00005;
  var hue = ( 360 * ( 1.0 + time ) % 360 ) / 360;

  mat.color.setHSL(hue, 0.5, 0.5 );    
  particles.rotation.y += 0.002;
  particles.geometry.verticesNeedUpdate = true;
    
  renderer.render(scene, camera);
});