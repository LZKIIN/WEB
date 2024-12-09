import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


var audio;
var source;
var bufferLength;
var dataArray;
var audioContext;
var analyser;
var ss1;
var ss2;
var ss3;




// drawing board
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// lets get stared 
const intro = document.getElementById('intro');
const startButton = document.getElementById('start');


// MODELS but is no naomi campell
const gltfLoader = new GLTFLoader();

//cargado del  el material 
const textureLoader = new THREE.TextureLoader();


// function para cargar los modelos al intro 


   
function addModelToIntro() {
    gltfLoader.load(
        '/LOADERS/Tpose.glb',  
        (gltf) => {
            const model = gltf.scene.clone();
            //crear una  LA variable para MOI modelo
            ss1 = model
            
            model.position.set(-0.03, 15, 98);  // move or arrange Posición del modelo T pose
            
            const scale = 0.5;
            model.scale.set(scale, scale, scale);  // Escalaer del modelo

            scene.add(model);

        }
    );

    gltfLoader.load(
        '/LOADERS/Tpose.glb',  
        (gltf) => {
            const model = gltf.scene.clone();
            //crear una  LA variable para MOI modelo
            ss3 = model
            
            model.position.set(1, 15, 99);  // move or arrange Posición del modelo T pose
            
            const scale = 0.1;
            model.scale.set(scale, scale, scale);  // Escalaer del modelo

            scene.add(model);

        }
    );


   //cargar otro modelo al intro if it works
    gltfLoader.load(
        '/LOADERS/Tpose.glb',  
        (gltf) => {
            const model = gltf.scene.clone();
             ss2 = model

            
            // cargar la textura
            textureLoader.load(
                '/LOADERS/coalshini.png', 
                (matcapTexture) => {
                // Crear el material MatCap
                const matcapMaterial = new THREE.MeshMatcapMaterial({
                    matcap: matcapTexture
                });
                
                model.traverse((obj) => {
        
                    obj.material = matcapMaterial
                })

            })

            
            model.position.set(3.5, 15, 99);  // Posición del modelo
            
            const scale = 0.8;
            model.scale.set(scale, scale, scale);  // Escala del modelo

            // Establecer la inclinación inicial solo en el eje X
            model.rotation.set(0.2, 80, 0);  // foward tilt on X (foward movement)

            scene.add(model);

            // change the axis of rotation viteeeee
            const animateRotation = () => {
                // spin on Y axis
                model.rotation.y += 0.01;  // velocity control of axis # Y

                renderer.render(scene, camera);
                requestAnimationFrame(animateRotation);
            };

            animateRotation();  // Llamar a la función de animación
        }
    );
}


addModelToIntro();

const ducks = [];
const tposes =[];
const moons = [];

function addRandomTposes() {
    gltfLoader.load(
        '/LOADERS/Tpose.glb',
        (gltf) => {
            const tposes = gltf.scene.children[0].clone();

            const randomX = (Math.random() - 0.5) * 200; 
            const randomY = Math.random() * 70 + 10; 
            const randomZ = -20 + Math.random() * 50; 
            tposes.position.set(randomX, randomY, randomZ);

            const scale = 0.1;
            tposes.scale.set(scale, scale, scale);

            const speed = (Math.random() * 0.02) + 0.01;
            const rotationSpeed = (Math.random() * 0.02) + 0.02; 

            tposes.push({ tposes, speed, rotationSpeed });

            scene.add(tposes);
        }
    );
}



// FunctiLOADERS ()
function addRandomDuck() {
    gltfLoader.load(
        '/LOADERS/Star.glb',
        (gltf) => {
            const duck = gltf.scene.children[0].clone();

            const randomX = (Math.random() - 0.5) * 200; 
            const randomY = Math.random() * 70 + 10; 
            const randomZ = -20 + Math.random() * 50; 
            duck.position.set(randomX, randomY, randomZ);

            const scale = 0.4;
            duck.scale.set(scale, scale, scale);

            const speed = (Math.random() * 0.02) + 0.01;
            const rotationSpeed = (Math.random() * 0.02) + 0.01; 

            ducks.push({ duck, speed, rotationSpeed });

            scene.add(duck);
        }
    );
}

function addRandomMoon() {
    gltfLoader.load(
        '/LOADERS/Cpose.glb',
        (gltf) => {
            const moon = gltf.scene.children[0].clone();

            const randomX = (Math.random() - 0.5) * 200; 
            const randomY = Math.random() * 70 + 10; 
            const randomZ = -20 + Math.random() * 50; 
            moon.position.set(randomX, randomY, randomZ);

            const scale = 0.1;
            moon.scale.set(scale, scale, scale);

            const speed = (Math.random() * 0.02) + 0.01;
            const rotationSpeed = (Math.random() * 0.02) + 0.02; 

            moons.push({ moon, speed, rotationSpeed });

            scene.add(moon);
        }
    );
}


//backgrounscenaPT3
const gradientGeometry = new THREE.PlaneGeometry(400, 200);
//import or createw the material
const gradientMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uColor1: { value: new THREE.Color(0xffff00) },
        uColor2: { value: new THREE.Color(0xffff00) }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying vec2 vUv;
        void main() {
            gl_FragColor = vec4(mix(uColor2, uColor1, vUv.y), 1.0);
        }
    `,
    side: THREE.DoubleSide
});
const gradientPlane = new THREE.Mesh(gradientGeometry, gradientMaterial);
gradientPlane.scale.set(10, 10, 1); 
gradientPlane.position.set(0, 0, -300); 
scene.add(gradientPlane);

/**
 * Lights 
 */
const ambientLight = new THREE.AmbientLight(0xffff0f, 2.5);
scene.add(ambientLight);

/**
 * Camera
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, 0.1, 500);
camera.position.set(0, 15, 99); 
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
scene.background = null;

/**
 * Window Resize Handling and tools
 */
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    //simpre recuerda darle update
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// pianio EVENT 

document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (['t'].includes(key)) {
        addRandomTposes();
    }
});

document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (['m'].includes(key)) {
        addRandomDuck();
    }
});


document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (['n'].includes(key)) {
        addRandomMoon();
    }
});

// backgrounds colors

function updateBackgroundColor() {
    if (analyser) {
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength/ 3; i++) {
            sum += dataArray[i];
        }
        let average = sum / bufferLength;

        const colorFactor = (average / 230) * 9; // bigger data equals a mayor shift 
        const newColor1 = new THREE.Color( 0x00ff00).lerp(new THREE.Color( 0x00ff00), colorFactor); 
        const newColor2 = new THREE.Color( 0x00ff00).lerp(new THREE.Color( 0x0000ff), colorFactor);
        
        gradientMaterial.uniforms.uColor1.value = newColor1;
        gradientMaterial.uniforms.uColor2.value = newColor2;
    }
}

const clock = new THREE.Clock();

const animate = () => {
    const elapsedTime = clock.getElapsedTime();
    updateBackgroundColor();

    ducks.forEach(({ duck, speed, rotationSpeed }) => {
        duck.position.z += speed * 10;
        duck.rotation.y += rotationSpeed;
        duck.rotation.x += rotationSpeed * 0.3;

        if (duck.position.z > camera.position.z) {
            scene.remove(duck);
            const index = ducks.indexOf(duck);
            if (index > -1) ducks.splice(index, 1); 
        }
    });

    tposes.forEach(({ tposes, speed, rotationSpeed }) => {
        tposes.position.z += speed * 10;
        tposes.rotation.y += rotationSpeed;
        tposes.rotation.x += rotationSpeed * 0.3; 

        if (tposes.position.z > camera.position.z) {
            scene.remove(tposes);
            const index = tposes.indexOf(tposes);
            if (index > -1) tposes.splice(index, 1); 
        }
    });


    moons.forEach(({ moon, speed, rotationSpeed }) => {
        moon.position.z += speed * 10;
        moon.rotation.y += rotationSpeed;
        moon.rotation.x += rotationSpeed * 0.3; 

        if (moon.position.z > camera.position.z) {
            scene.remove(moon);
            const index = moons.indexOf(moon);
            if (index > -1) moons.splice(index, 1); 
        }
    });


    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

// tengo musica por dentro
async function waitForAudioLoad(audio) {
    if (audio.readyState >= 3) {
        return;
    }
    return new Promise((resolve) => {
        audio.addEventListener("loadeddata", resolve, { once: true });
    });
}

async function initAudioFileInteraction() {
    audio = document.getElementById("audio");

    await waitForAudioLoad(audio);
    audio.setAttribute('controls', true);
    audio.play(); 
}

function setupAudioContext() {
    if (audioContext) return;

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256; 

    source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
};

startButton.addEventListener('click', async () => {
    intro.style.display = 'none';     
    await initAudioFileInteraction(); 
    setupAudioContext();
    ss1.visible = false
    ss2.visible = false
    ss3.visible = false
});


animate();  
