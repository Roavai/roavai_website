import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// --- CONFIGURATION ---
// Change these URLs to your actual GLB/GLTF files
const PLACEHOLDER_MODEL = "Models/slide1.mkv";

const slidesData = [
  { id: 0, model: "Models/slide1.mkv", scale: 0.4, y: -1.5 }, // Menu (using slide1 as default)

  // TO USER: Replace these filenames with your actual video files in the Models folder
  { id: 1, model: "Models/slide1.mkv", scale: 0.5, y: -1.5 }, // Offline AI
  { id: 2, model: "Models/slide2.mkv", scale: 0.5, y: -1.5 }, // Vision
  { id: 3, model: "Models/slide1.mkv", scale: 0.5, y: -1.5 }, // Voice
  { id: 4, model: "Models/slide1.mkv", scale: 0.5, y: -1.5 }, // Motion
  { id: 5, model: "Models/slide1.mkv", scale: 0.5, y: -1.5 }, // Charging
  { id: 6, model: "Models/slide1.mkv", scale: 0.5, y: -1.5 }, // Mapping
];

// --- SCENE / VISUAL MANAGER WRAPPER ---
class VideoManager {
  constructor(slideIndex, containerId, videoUrl) {
    this.container = document.getElementById(containerId);
    this.slideIndex = slideIndex;
    this.isActive = false;

    // Setup Video
    this.video = document.createElement('video');
    this.video.src = videoUrl;
    this.video.style.width = '100%';
    this.video.style.height = '100%';
    this.video.style.objectFit = 'cover';
    this.video.style.position = 'absolute';
    this.video.style.top = '0';
    this.video.style.left = '0';
    // this.video.style.transform = 'scale(1.1)'; // Slight zoom for parallax

    this.video.muted = true;
    this.video.loop = true;
    this.video.playsInline = true;
    this.video.autoplay = false; // Controlled by start/stop

    // Hide by default until started? 
    // No, the container is hidden/shown by CSS transitions. 
    // But we want to avoid loading if not needed? 
    // Video elements load metadata automatically usually.

    this.container.appendChild(this.video);

    // Remove loader immediately for video
    const loaderEl = this.container.querySelector('.loader');
    if (loaderEl) loaderEl.style.display = 'none';

    // Listen for error
    this.video.addEventListener('error', (e) => {
      console.error("Video load error:", e);
      // Show error in UI
      const loaderEl = this.container.querySelector('.loader');
      if (loaderEl) {
        loaderEl.textContent = "Video Format Not Supported";
        loaderEl.style.display = 'block';
        loaderEl.style.color = 'red';
      }
    });
  }

  start() {
    if (!this.isActive) {
      this.isActive = true;
      this.video.play().catch(e => console.warn("Auto-play prevented", e));
    }
  }

  stop() {
    this.isActive = false;
    this.video.pause();
  }
}

class SceneManager {
  constructor(slideIndex, containerId, modelUrl, config) {
    this.container = document.getElementById(containerId);
    this.slideIndex = slideIndex;
    this.isActive = false;

    // 1. Setup Scene
    this.scene = new THREE.Scene();
    // Add some fog for depth matching the background
    this.scene.fog = new THREE.FogExp2(0x111111, 0.02);

    // 2. Setup Camera
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(0, 1, 5); // Default view

    // 3. Setup Renderer
    // Alpha: true ensures background CSS gradient shows through
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 20);
    spotLight.position.set(5, 10, 5);
    spotLight.angle = 0.5;
    spotLight.penumbra = 0.5;
    spotLight.castShadow = true;
    this.scene.add(spotLight);

    const blueLight = new THREE.PointLight(0x0044ff, 10, 10);
    blueLight.position.set(-2, 2, 2);
    this.scene.add(blueLight);

    // 5. Load Model
    this.mixer = null;
    this.clock = new THREE.Clock();
    this.model = null;

    const loader = new GLTFLoader();
    loader.load(modelUrl, (gltf) => {
      this.model = gltf.scene;
      this.model.scale.set(config.scale, config.scale, config.scale);
      this.model.position.y = config.y;

      // Enable shadows
      this.model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.scene.add(this.model);

      // Animations (if available)
      if (gltf.animations && gltf.animations.length) {
        this.mixer = new THREE.AnimationMixer(this.model);
        // Play 'Idle' or just the first animation found
        const action = this.mixer.clipAction(gltf.animations[0]);
        action.play();
      }

      // Remove loader text
      const loaderEl = this.container.querySelector('.loader');
      if (loaderEl) loaderEl.style.display = 'none';

    }, undefined, (error) => {
      console.error('An error happened loading model', error);
    });

    // Handle Resize
    window.addEventListener('resize', () => this.onWindowResize(), false);
  }

  onWindowResize() {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  render() {
    // Only render if active to save battery/performance
    if (!this.isActive) return;

    const delta = this.clock.getDelta();
    if (this.mixer) this.mixer.update(delta);

    // Subtle idle rotation if no animation
    if (this.model) {
      this.model.rotation.y += 0.002;
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.render());
  }

  start() {
    if (!this.isActive) {
      this.isActive = true;
      this.render();
    }
  }

  stop() {
    this.isActive = false;
  }
}

// --- APP LOGIC ---
const scenes = [];

// Helper to check for video extensions
function isVideo(url) {
  return url.match(/\.(mp4|webm|ogg|mkv|avi|mov)$/i);
}

// Initialize all scenes (3D or Video)
slidesData.forEach((data, index) => {
  // Check if element exists before initializing
  if (document.getElementById(`canvas-${index}`)) {
    let mgr;
    if (isVideo(data.model)) {
      mgr = new VideoManager(index, `canvas-${index}`, data.model);
    } else {
      mgr = new SceneManager(index, `canvas-${index}`, data.model, data);
    }
    scenes.push(mgr);
  }
});

// Start the first scene
if (scenes.length > 0) scenes[0].start();

// --- HOVER INTERACTION LOGIC ---
// Run immediately as script is loaded after DOM injection
const setupHover = (id, slideIndex) => {
  const link = document.getElementById(id);
  if (!link) {
    console.warn("Link not found:", id);
    return;
  }

  link.addEventListener('mouseenter', () => {
    // Only change if not already there and not animating 
    if (currentSlide !== slideIndex) {
      console.log("Hover triggering slide:", slideIndex);
      window.app.goToSlide(slideIndex);
    }
  });
};

setupHover('link-1', 1);
setupHover('link-2', 2);
setupHover('link-3', 3);
setupHover('link-4', 4);
setupHover('link-5', 5);
setupHover('link-6', 6);

// Note: We do NOT add a mouseleave listener to "go back to 0".
// The user requested: "if the cursor is outside the feature then it will just pause the slideshow"
// We interpret this as "stay on the current feaure slide".

// --- TRANSITION LOGIC ---
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
// Timer reference for interruption
let transitionTimer = null;

window.app = {
  goToSlide: function (targetIndex) {
    if (targetIndex === currentSlide) return;
    changeSlide(targetIndex);
  }
};

function changeSlide(targetIndex) {
  if (!scenes[targetIndex]) return;

  // Interrupt existing transition if any
  if (transitionTimer) {
    clearTimeout(transitionTimer);
    transitionTimer = null;
  }

  // Cleanup previous state immediately if we were mid-transition
  const previousSlideEl = slides[currentSlide];

  // Logic:
  // 1. Activate New Scene immediately
  scenes[targetIndex].start();

  // 2. Stop Old Scene (we can stop immediately for performance since new one overlays)
  if (scenes[currentSlide] && currentSlide !== targetIndex) {
    scenes[currentSlide].stop();
  }

  // 3. UI Class Swapping (Instant or very fast for hover)
  // For hover, we want instant feedback.

  // Reset all classes for clean slate (brute force reliability)
  slides.forEach(s => {
    s.classList.remove('active', 'next', 'expanding', 'leaving');
    s.style.width = '';
    s.style.height = '';
  });

  // Activate New
  slides[targetIndex].classList.add('active');

  // Update State
  currentSlide = targetIndex;
}

// Optional: Mouse movement parallax effect
document.addEventListener('mousemove', (e) => {
  // Current Scene Handler
  const currentMgr = scenes[currentSlide];
  if (!currentMgr) return;

  // Parallax Factor
  const x = (e.clientX / window.innerWidth) - 0.5;
  const y = (e.clientY / window.innerHeight) - 0.5;

  // 1. 3D Model Logic
  if (currentMgr.model) {
    currentMgr.model.rotation.y = (x * 0.5);
    currentMgr.model.rotation.x = (y * 0.2);
  }

  // 2. Video Logic
  if (currentMgr.video) {
    // Move the video slightly opposite to mouse to create depth
    // We scale it up slightly in CSS/Constructor to avoid edges showing
    // currentMgr.video.style.transform = `scale(1.1) translate(${-x * 30}px, ${-y * 30}px)`;
    // Actually, let's keep it simple:
    currentMgr.video.style.transform = `scale(1.1) translate(${x * 20}px, ${y * 20}px)`;
  }
});
