import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Camera, Clock, DirectionalLight, MeshBasicMaterial, Plane } from 'three';

let mesh, point, camera, light, ani1, ani2, plane, ambientLight, controls;

const scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer({ antialias: true });

const catalog = {
    box: new THREE.BoxGeometry(10, 10, 10),
    sphere: new THREE.SphereGeometry(5, 32, 32),
    cone: new THREE.ConeGeometry(5, 20, 32),
    cylinder: new THREE.CylinderGeometry(5, 5, 20, 32),
    torus: new THREE.TorusGeometry(10, 3, 16, 100),
}

let material = {
    default: new THREE.MeshBasicMaterial({ color: 0xdddddd }),
    standard: new THREE.MeshStandardMaterial({ color: 0xdddddd }),
    point: new THREE.PointsMaterial({ size: 0.05, color: 0xdddddd }),
}

function addGeo(item, materialOpt = 'default') {
    if (mesh !== undefined) {
        scene.remove(mesh);
        mesh.geometry.dispose();
    }
    if (point !== undefined) {
        scene.remove(point);
        point.geometry.dispose();
    }

    let geometry = catalog[item];
    let selectMaterial = material['default'];

    mesh = new THREE.Mesh(geometry, selectMaterial);
    mesh.castShadow = true;
    scene.add(mesh);
    update(renderer, scene, camera, controls);
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
    point = new THREE.Line(geometry, selectMaterial);
    point.castShadow = true;
    scene.add(point);
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
    // light = undefined;
    update(renderer, scene, camera, controls);
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

    controls.update()

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

// function scaleGeo() {
//     mesh.scale.y = 2.0;
// }

let box = document.querySelector('.box');
let sphere = document.querySelector('.sphere');
let cone = document.querySelector('.cone');
let cylinder = document.querySelector('.cylinder');
let torus = document.querySelector('.torus');
let drawWithPoint = document.querySelector('.point');
let drawWithLine = document.querySelector('.line');
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

    // Surface
    drawWithPoint.onclick = function () {
        drawPoint();
    };
    drawWithLine.onclick = function () {
        drawLine();
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