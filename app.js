import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TeapotGeometry } from "./node_modules/three/examples/jsm/geometries/TeapotGeometry";
import { ParametricGeometries } from "./node_modules/three/examples/jsm/geometries/ParametricGeometries";
import * as dat from 'dat.gui';

let mesh, point, camera, light, ani1, plane, controls, selectMaterial, solid;

const scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer({ antialias: true });
let gui = new dat.GUI();
gui.domElement.id = 'gui';

// define tube geometry
class CustomSinCurve extends THREE.Curve {
    constructor(scale = 1) {
        super();
        this.scale = scale;
    }

    getPoint(t, optionalTarget = new THREE.Vector3()) {
        const tx = t * 3 - 1.5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = 0;
        return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
    }
}
const path = new CustomSinCurve(10);

const catalog = {
    box: new THREE.BoxGeometry(10, 10, 10),
    sphere: new THREE.SphereGeometry(5, 32, 32),
    cone: new THREE.ConeGeometry(5, 20, 32),
    cylinder: new THREE.CylinderGeometry(5, 5, 20, 32),
    torus: new THREE.TorusGeometry(10, 3, 16, 100),
    tetrahedron: new THREE.TetrahedronGeometry(8, 0),
    octahedron: new THREE.OctahedronGeometry(10, 0),
    knot: new THREE.TorusKnotGeometry(9, 2, 50, 8),
    teapot: createTeapot(),
    dodecahedron: new THREE.DodecahedronBufferGeometry(10, 0),
    icosahedron: new THREE.IcosahedronGeometry(10, 0),
    tube: new THREE.TubeGeometry(path, 20, 2, 8, false),
    parametric: new THREE.ParametricGeometry(ParametricGeometries.klein, 25, 25)
}

let material = {
    default: new THREE.MeshBasicMaterial({ color: 0xdddddd }),
    standard: new THREE.MeshStandardMaterial({ color: 0xdddddd }),
    point: new THREE.PointsMaterial({ size: 0.2, color: 0xdddddd }),
}

function addGeo(item, materialOpt = 'default') {
    if (mesh !== undefined) {
        scene.remove(mesh);
        mesh.geometry.dispose();
    }
    if (solid !== undefined) {
        scene.remove(solid);
        solid.geometry.dispose();
    }
    if (light !== undefined) {
        selectMaterial = material['standard'];
    } else {
        selectMaterial = material['default'];
    }
    if (point !== undefined) {
        scene.remove(point);
        point.geometry.dispose();
    }
    let geometry = catalog[item];
    mesh = new THREE.Mesh(geometry, selectMaterial);
    mesh.castShadow = true;
    scene.add(mesh);
    update(renderer, scene, camera, controls);
}

function createTeapot() {
    let geometry = new TeapotGeometry(
        10, 10,
        true, true, true, false, false
    );

    return geometry;
}

function drawPoint() {
    let geometry = scene.children[1].geometry === undefined ? scene.children[scene.children.length - 1].geometry : scene.children[1].geometry;
    if (point !== undefined) {
        scene.remove(point);
        point.geometry.dispose();
    }
    if (mesh !== undefined) {
        scene.remove(mesh);
        mesh.geometry.dispose();
    }
    if (solid !== undefined) {
        scene.remove(solid);
        solid.geometry.dispose();
    }
    let selectMaterial = material['point'];

    point = new THREE.Points(geometry, selectMaterial);
    point.castShadow = true;
    scene.add(point);
    update(renderer, scene, camera, controls);
}

function drawLine() {
    let geometry = scene.children[1].geometry === undefined ? scene.children[scene.children.length - 1].geometry : scene.children[1].geometry;
    let selectMaterial = scene.children[1].material === undefined ? scene.children[scene.children.length - 1].material : scene.children[1].material;
    if (point !== undefined) {
        scene.remove(point);
        point.geometry.dispose();
    }
    if (mesh !== undefined) {
        scene.remove(mesh);
        mesh.geometry.dispose();
    }
    if (solid !== undefined) {
        scene.remove(solid);
        solid.geometry.dispose();
    }
    point = new THREE.Line(geometry, selectMaterial);
    point.castShadow = true;
    scene.add(point);
    update(renderer, scene, camera, controls);
}

function drawSolid() {
    let geometry = scene.children[1].geometry === undefined ? scene.children[scene.children.length - 1].geometry : scene.children[1].geometry;
    let selectMaterial = scene.children[1].material === undefined ? scene.children[scene.children.length - 1].material : scene.children[1].material;
    if (point !== undefined) {
        scene.remove(point);
        point.geometry.dispose();
    }
    if (mesh !== undefined) {
        scene.remove(mesh);
        mesh.geometry.dispose();
    }
    solid = new THREE.Mesh(geometry, selectMaterial);
    scene.add(solid);
    update(renderer, scene, camera, controls);
}

function texture() {
    lightShow();
    let loader = new THREE.TextureLoader();
    mesh.material = new THREE.MeshStandardMaterial({ color: 0xdddddd })
    let selectMaterial = mesh.material;
    selectMaterial.map = loader.load('./img/2021.png');
    update(renderer, scene, camera, controls);
}

function lightShow() {
    if (light) {
        lightRemove();
    }
    mesh.material = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    plane.material = new THREE.MeshStandardMaterial({
        color: 0x888888,
        side: THREE.DoubleSide
    });
    light = new THREE.SpotLight(0x888888, 4.0);
    light.position.x = 100;
    light.position.y = 50;
    light.position.z = -50;

    light.castShadow = true;
    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    light.name = 'light';
    scene.add(light);

    update(renderer, scene, camera, controls);
}

function lightRemove() {
    scene.children.forEach((e) => {
        if (e.name === 'light') {
            scene.remove(e);
        }
    })
    mesh.material = new THREE.MeshBasicMaterial({ color: 0xdddddd });
    plane.material = new THREE.MeshBasicMaterial({
        color: 0x888888,
        side: THREE.DoubleSide
    })
    // renderer.render(scene, camera);
    update(renderer, scene, camera, controls);
    light = undefined;
}

function onRender() {
    plane = getPlane(300, new THREE.MeshBasicMaterial({
        color: 0x888888,
        side: THREE.DoubleSide
    }));
    plane.rotation.x = Math.PI / 2;
    plane.position.y = -15;
    plane.receiveShadow = true;
    scene.add(plane);

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.x = 1;
    camera.position.y = 20;
    camera.position.z = 20;

    camera.lookAt(new THREE.Vector3(0, 0, 0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('app').appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    update(renderer, scene, camera, controls);
}

onRender()

function update(renderer, scene, camera, controls) {
    renderer.render(
        scene,
        camera
    );

    controls.update();

    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    });
}


function getPlane(size, material) {
    let geometry = new THREE.PlaneGeometry(size, size);
    let mesh = new THREE.Mesh(
        geometry,
        material
    );

    mesh.receiveShadow = true;

    return mesh;
}

function animation_1() {
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", onRender);

    if (mesh) {
        mesh.material.opacity = 0;

        createjs.Tween.get(mesh.material, { loop: true }).to({ opacity: 1 }, 500).wait(1000).to({ opacity: 0, }, 500);
        createjs.Tween.get(mesh.rotation, { loop: true }).wait(500).to({ y: Math.PI * 2, x: Math.PI * 2 }, 1500, createjs.Ease.getPowInOut(3)).wait(500);
    }

    if (point) {
        point.material.opacity = 0;

        createjs.Tween.get(point.material, { loop: true }).to({ opacity: 1 }, 500).wait(1500).to({ opacity: 0 }, 500);
        createjs.Tween.get(point.rotation, { loop: true }).wait(500).to({ y: Math.PI * 2, x: Math.PI * 2 }, 1500, createjs.Ease.getPowInOut(3)).wait(500);
    }
}

function animation_2() {
    if (mesh) {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
        mesh.rotation.z += 0.01;
        mesh.position.x += 0.1;
        mesh.position.y += 0.02;
        mesh.position.z -= 0.1;
        if (mesh.position.y > 15) {
            mesh.position.y = 0
        }
    }

    if (point) {
        point.rotation.x += 0.01;
        point.rotation.y += 0.01;
        point.rotation.z += 0.01;
        point.position.x += 0.1;
        point.position.y += 0.02;
        point.position.z -= 0.1;
        if (point.position.y > 15) {
            point.position.y = 0
        }
    }

    update(renderer, scene, camera, controls);
    ani1 = requestAnimationFrame(animation_2);
}

function stopAnimation() {
    if (ani1) {
        cancelAnimationFrame(ani1);
    } else {
        createjs.Ticker.addEventListener("tick", animation_1);
    }
}

class MinMaxGUIHelper {
    constructor(obj, minProp, maxProp, minDif) {
        this.obj = obj;
        this.minProp = minProp;
        this.maxProp = maxProp;
        this.minDif = minDif;
    }
    get min() {
        return this.obj[this.minProp];
    }
    set min(v) {
        this.obj[this.minProp] = v;
        this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
    }
    get max() {
        return this.obj[this.maxProp];
    }
    set max(v) {
        this.obj[this.maxProp] = v;
        this.min = this.min;
    }
}

let controlObject = {
    posX: 0,
    posY: 0,
    posZ: 0,

    rotX: 0,
    rotY: 0,
    rotZ: 0,

    scaX: 0,
    scaY: 0,
    scaZ: 0,
}

function setColor() {
    let params = {
        color: 0xff00ff,
        lightColor: 0xdddddd
    };
    gui.addColor(params, 'color')
        .onChange(function () {
            mesh.material.color.set(params.color);
        });
}

function setLight() {
    let params = {
        light: 0xdddddd,
    };
    gui.addColor(params, 'light')
        .onChange(function () {
            light.color.setHex(params.light);
        });
}

function setControlObj() {
    let affineTransform = gui.addFolder('Affine transform');
    affineTransform.add(controlObject, 'posX', -20, 20).name('position x').onChange(function () {
        if (mesh) {
            mesh.position.set(0, 0, 0)
            mesh.position.x += controlObject.posX;
        }
        if (point) {
            point.position.set(0, 0, 0)
            point.position.x += controlObject.posX;
        }
    });
    affineTransform.add(controlObject, 'posY', -20, 20).name('position y').onChange(function () {
        if (mesh) {
            mesh.position.set(0, 0, 0)
            mesh.position.y += controlObject.posY;
        }
        if (point) {
            point.position.set(0, 0, 0)
            point.position.y += controlObject.posY;
        }
    });
    affineTransform.add(controlObject, 'posZ', -20, 20).name('position z').onChange(function () {
        if (mesh) {
            mesh.position.set(0, 0, 0)
            mesh.position.z += controlObject.posZ;
        }
        if (point) {
            point.position.set(0, 0, 0)
            point.position.z += controlObject.posZ;
        }
    });
    affineTransform.add(controlObject, 'rotX', 0, 20).name('rotate x').onChange(function () {
        if (mesh) {
            mesh.rotation.set(0, 0, 0);
            mesh.rotation.x += controlObject.rotX;
        }
        if (point) {
            point.rotation.set(0, 0, 0);
            point.rotation.x += controlObject.rotX;
        }
    });
    affineTransform.add(controlObject, 'rotY', 0, 20).name('rotate y').onChange(function () {
        if (mesh) {
            mesh.rotation.set(0, 0, 0);
            mesh.rotation.y += controlObject.rotY;
        }
        if (point) {
            point.rotation.set(0, 0, 0);
            point.rotation.y += controlObject.rotY;
        }
    });
    affineTransform.add(controlObject, 'rotZ', 0, 20).name('rotate z').onChange(function () {
        if (mesh) {
            mesh.rotation.set(0, 0, 0);
            mesh.rotation.z += controlObject.rotZ;
        }
        if (point) {
            point.rotation.set(0, 0, 0);
            point.rotation.z += controlObject.rotZ;
        }
    });
    affineTransform.add(controlObject, 'scaX', 0, 20).name('scale x').onChange(function () {
        if (mesh) {
            mesh.scale.x = controlObject.scaX;
        }
        if (point) {
            point.scale.x = controlObject.scaX;
        }
    });
    affineTransform.add(controlObject, 'scaY', 0, 20).name('scale y').onChange(function () {
        if (mesh) {
            mesh.scale.y = controlObject.scaY;
        }
        if (point) {
            point.scale.y = controlObject.scaY;
        }
    });
    affineTransform.add(controlObject, 'scaZ', 0, 20).name('scale z').onChange(function () {
        if (mesh) {
            mesh.scale.z = controlObject.scaZ;
        }
        if (point) {
            point.scale.z = controlObject.scaZ;
        }
    });
}

setColor();
setLight();

function updateCamera() {
    camera.updateProjectionMatrix();
}

function addGui() {
    gui.add(camera, 'fov', 1, 150).onChange(updateCamera);
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
    gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
    gui.add(minMaxGUIHelper, 'max', 0.1, 5000, 0.1).name('far').onChange(updateCamera);
}

addGui();
setControlObj();

let box = document.querySelector('.box');
let sphere = document.querySelector('.sphere');
let cone = document.querySelector('.cone');
let cylinder = document.querySelector('.cylinder');
let torus = document.querySelector('.torus');
let tetra = document.querySelector('.tetrahedron');
let octa = document.querySelector('.octahedron');
let knot = document.querySelector('.knot');
let teapot = document.querySelector('.teapot');
let dode = document.querySelector('.dodecahedron');
let icosa = document.querySelector('.icosahedron');
let tube = document.querySelector('.tube');
let para = document.querySelector('.parametric');
let drawWithPoint = document.querySelector('.point');
let drawWithLine = document.querySelector('.line');
let drawWithSolid = document.querySelector('.solid');
let drawWithTexture = document.querySelector('.texture');
let playAnimation_1 = document.querySelector('.animation-1');
let playAnimation_2 = document.querySelector('.animation-2');
let pointLight = document.querySelector('.point-light')
let lightDel = document.querySelector('.light-del')
let removeAnimation = document.querySelector('.remove-animation')

function addFunc() {
    // Geometry
    box.onclick = function () {
        addGeo('box');
    };
    sphere.onclick = function () {
        addGeo('sphere');
    };
    cone.onclick = function () {
        addGeo('cone');
    };
    cylinder.onclick = function () {
        addGeo('cylinder');
    };
    torus.onclick = function () {
        addGeo('torus');
    };
    tetra.onclick = function () {
        addGeo('tetrahedron');
    }
    octa.onclick = function () {
        addGeo('octahedron');
    }
    knot.onclick = function () {
        addGeo('knot');
    }
    teapot.onclick = function () {
        addGeo('teapot');
    }
    dode.onclick = function () {
        addGeo('dodecahedron');
    }
    icosa.onclick = function () {
        addGeo('icosahedron');
    }
    tube.onclick = function () {
        addGeo('tube');
    }
    para.onclick = function () {
        addGeo('parametric');
    }

    // Surface
    drawWithPoint.onclick = function () {
        drawPoint();
    };
    drawWithLine.onclick = function () {
        drawLine();
    };
    drawWithSolid.onclick = function () {
        drawSolid();
    };
    drawWithTexture.onclick = function () {
        texture();
    }

    // Animation
    playAnimation_1.onclick = function () {
        animation_1();
    }
    playAnimation_2.onclick = function () {
        animation_2();
    }
    removeAnimation.onclick = function () {
        stopAnimation();
    }

    // Light
    pointLight.onclick = function () {
        lightShow();
    }
    lightDel.onclick = function () {
        lightRemove();
    }
}

addFunc()