import WindowManager from './WindowManager.js';

const t = THREE;
let camera, scene, renderer, world;
let near, far;
let pixR = window.devicePixelRatio ? window.devicePixelRatio : 1;
let spheres = [];
let sceneOffsetTarget = { x: 0, y: 0 };
let sceneOffset = { x: 0, y: 0 };
let mouseGlobal = { x: 0, y: 0 };

let today = new Date();
today.setHours(0);
today.setMinutes(0);
today.setSeconds(0);
today.setMilliseconds(0);
today = today.getTime();

let internalTime = getTime();
let windowManager;
let initialized = false;
let isAdmin = new URLSearchParams(window.location.search).get("admin") === "true";

// 获取当前时间（秒）
function getTime() {
    return (new Date().getTime() - today) / 1000.0;
}

// 监听鼠标移动事件
function onMouseMove(event) {
    if (!isAdmin) {
        let winData = windowManager.getThisWindowData();
        mouseGlobal.x = event.clientX + winData.shape.x;
        mouseGlobal.y = event.clientY + winData.shape.y;
        localStorage.setItem("mouseGlobal", JSON.stringify(mouseGlobal));
    }
}

document.addEventListener('mousemove', onMouseMove);

if (new URLSearchParams(window.location.search).get("clear")) {
    localStorage.clear();
} else {
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState!== 'hidden' &&!initialized) {
            init();
        }
    });

    window.onload = () => {
        if (document.visibilityState!== 'hidden') {
            init();
        }
    };

    function init() {
        initialized = true;
        setTimeout(() => {
            setupScene();
            setupWindowManager();
            resize();
            updateWindowShape(false);
            render();
            window.addEventListener('resize', resize);
        }, 500);
    }

    function setupScene() {
        if (isAdmin) {
            // 管理端场景设置
            let allWindows = windowManager.getWindows();
            let maxX = 0;
            let maxY = 0;
            allWindows.forEach(win => {
                maxX = Math.max(maxX, win.shape.x + win.shape.w);
                maxY = Math.max(maxY, win.shape.y + win.shape.h);
            });
            camera = new t.OrthographicCamera(0, maxX, 0, maxY, -10000, 10000);
        } else {
            camera = new t.OrthographicCamera(0, 0, window.innerWidth, window.innerHeight, -10000, 10000);
        }
        camera.position.z = 2.5;
        near = camera.position.z - .5;
        far = camera.position.z + 0.5;

        scene = new t.Scene();
        scene.background = new t.Color(0.0);
        scene.add(camera);

        renderer = new t.WebGLRenderer({ antialias: true, depthBuffer: true });
        renderer.setPixelRatio(pixR);

        world = new t.Object3D();
        scene.add(world);

        renderer.domElement.setAttribute("id", "scene");
        document.body.appendChild(renderer.domElement);
    }

    function setupWindowManager() {
        windowManager = new WindowManager();
        windowManager.setWinShapeChangeCallback(updateWindowShape);
        windowManager.setWinChangeCallback(windowsUpdated);

        let metaData = { foo: "bar" };
        windowManager.init(metaData);
        windowsUpdated();

        // 监听 localStorage 中鼠标位置的变化
        addEventListener("storage", (event) => {
            if (event.key === "mouseGlobal") {
                let newMouseGlobal = JSON.parse(event.newValue);
                updateSpheresPosition(newMouseGlobal);
            }
        });
    }

    function windowsUpdated() {
        updateNumberOfSpheres();
    }

    function updateNumberOfSpheres() {
        let wins = windowManager.getWindows();
        spheres.forEach((s) => {
            world.remove(s);
        });
        spheres = [];

        for (let i = 0; i < wins.length; i++) {
            let win = wins[i];
            let c = new t.Color();
            c.setHSL(i * .1, 1.0, .5);
            let s = 50;
            let sphere = new t.Mesh(new t.SphereGeometry(s, 32, 32), new t.MeshBasicMaterial({ color: c, wireframe: true }));
            sphere.position.x = win.shape.x + (win.shape.w * .5);
            sphere.position.y = win.shape.y + (win.shape.h * .5);
            world.add(sphere);
            spheres.push(sphere);
        }
    }

    function updateWindowShape(easing = true) {
        if (!isAdmin) {
            sceneOffsetTarget = { x: -window.screenX, y: -window.screenY };
            if (!easing) sceneOffset = sceneOffsetTarget;
        }
    }

    function updateSpheresPosition(mouseGlobal) {
        let wins = windowManager.getWindows();
        for (let i = 0; i < spheres.length; i++) {
            let sphere = spheres[i];
            let win = wins[i];
            let falloff = 0.05;

            let posTarget = {
                x: mouseGlobal.x,
                y: mouseGlobal.y
            };

            sphere.position.x = sphere.position.x + (posTarget.x - sphere.position.x) * falloff;
            sphere.position.y = sphere.position.y + (posTarget.y - sphere.position.y) * falloff;
        }
    }

    function render() {
        let t = getTime();
        windowManager.update();

        let falloff = 0.05;
        if (!isAdmin) {
            sceneOffset.x = sceneOffset.x + ((sceneOffsetTarget.x - sceneOffset.x) * falloff);
            sceneOffset.y = sceneOffset.y + ((sceneOffsetTarget.y - sceneOffset.y) * falloff);
            world.position.x = sceneOffset.x;
            world.position.y = sceneOffset.y;
        }

        let wins = windowManager.getWindows();

        let storedMouseGlobal = JSON.parse(localStorage.getItem("mouseGlobal"));
        if (storedMouseGlobal) {
            updateSpheresPosition(storedMouseGlobal);
        }

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    function resize() {
        if (isAdmin) {
            let allWindows = windowManager.getWindows();
            let maxX = 0;
            let maxY = 0;
            allWindows.forEach(win => {
                maxX = Math.max(maxX, win.shape.x + win.shape.w);
                maxY = Math.max(maxY, win.shape.y + win.shape.h);
            });
            camera = new t.OrthographicCamera(0, maxX, 0, maxY, -10000, 10000);
        } else {
            let width = window.innerWidth;
            let height = window.innerHeight;
            camera = new t.OrthographicCamera(0, width, 0, height, -10000, 10000);
        }
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}