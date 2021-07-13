import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let mesh, point, camera, light;

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();

let plane = getPlane(300);
plane.name = 'plane-1';
plane.rotation.x = Math.PI / 2;
plane.position.y = -20;
scene.add(plane);
onRender();


const catalog = {
    box: new THREE.BoxGeometry(10, 10, 10),
    sphere: new THREE.SphereGeometry(5, 32, 32),
    cone: new THREE.ConeGeometry(5, 20, 32),
    cylinder: new THREE.CylinderGeometry(5, 5, 20, 32),
    torus: new THREE.TorusGeometry(10, 3, 16, 100),
}

let material = {
    default: new THREE.MeshLambertMaterial({ color: 0xdddddd }),
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
    let selectMaterial = material[materialOpt];

    mesh = new THREE.Mesh(geometry, selectMaterial);
    scene.add(mesh);
    console.log(scene)
    onRender();
}

function changeMaterial(item) {
    // console.log(geometry)
    scene.children[1].material = material[item];
    onRender();
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
    scene.add(point);
    onRender();
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
    scene.add(point);
    onRender();
}

// function texture() {
//     let imgTextture = new THREE.TextureLoader();
//     let mapTexture = imgTextture.load('./background.jpg');
//     mapTexture.format = THREE.RGBFormat;
//     console.log(mapTexture)
//     let geometry = catalog['box'];
//     let selectMaterial = new THREE.MeshBasicMaterial({ map: mapTexture });

//     mesh = new THREE.Mesh(geometry, selectMaterial);
//     scene.add(mesh);
//     console.log(mesh)
//     onRender();
// }

// var fileTag = document.getElementById("filetag");
// // preview = document.getElementById("preview");

// fileTag.addEventListener("change", function () {
//     changeImage(this);
// });

// function changeImage(input) {
//     var reader;

//     if (input.files && input.files[0]) {
//         reader = new FileReader();

//         reader.onload = function (e) {
//             // preview.setAttribute('src', e.target.result);
//             // console.log(e.target.result)
//             scene.children[1].material.map - new THREE.TextureLoader(e.target.result);
//             scene.children[1].material.needsUpdate = true;

//         }


//         reader.readAsDataURL(input.files[0]);
//     }
// }

function lightShow() {
    light = new THREE.PointLight(0xff0000, 1, 100);
    light.position.set(1, 20, 20);
    light.name = 'light';
    scene.add(light);
    onRender();
}

function lightRemove() {
    scene.children.forEach((e) => {
        if (e.name === 'light') {
            scene.remove(e);
        }
    })
    onRender();
}

function onRender() {
    renderer.setSize(window.innerWidth, window.innerHeight);
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
    // renderer.setClearColor(0xffffff)
    renderer.render(scene, camera);
    document.getElementById('app').appendChild(renderer.domElement);
}

function getPlane(size) {
    let geometry = new THREE.PlaneGeometry(size, size);
    let material = new THREE.MeshBasicMaterial({
        color: 0x888888,
        side: THREE.DoubleSide
    });
    let mesh = new THREE.Mesh(
        geometry,
        material
    );

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

    onRender();
    requestAnimationFrame(animation_2);
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

    // Light
    pointLight.onclick = function () {
        lightShow();
    }
    lightDel.onclick = function () {
        lightRemove();
    }
}

addFunc()