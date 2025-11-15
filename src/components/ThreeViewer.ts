import * as THREE from 'three';
import type { ThreeSceneConfig } from '../types/index.js';

export class ThreeViewer {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private container: HTMLElement;
    private animationId: number | null = null;
    private controls: any = null;

    constructor(config: ThreeSceneConfig) {
        this.container = document.getElementById(config.containerId)!;

        if (!this.container) {
            throw new Error(`Container with id ${config.containerId} not found`);
        }

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

        this.init(config);
    }

    private init(config: ThreeSceneConfig): void {
        // Clear any existing content (like loading placeholder)
        this.container.innerHTML = '';

        // Setup renderer
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(config.backgroundColor || 0x000000, 0);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.container.appendChild(this.renderer.domElement);

        // Setup camera position
        if (config.cameraPosition) {
            this.camera.position.set(...config.cameraPosition);
        } else {
            this.camera.position.set(0, 0, 5);
        }

        this.camera.lookAt(0, 0, 0);

        // Add controls if enabled
        if (config.enableControls !== false) {
            this.setupControls();
        }

        // Add default lighting
        this.setupLighting();

        // Create sample robotics visualization
        this.createSampleRoboticsVisualization();

        // Setup resize listener
        this.setupResize();

        // Start animation loop
        this.animate();
    }

    private setupControls(): void {
        // Simple mouse controls without external library
        let isMouseDown = false;
        let mouseX = 0;
        let mouseY = 0;
        let targetRotationX = 0;
        let targetRotationY = 0;
        let rotationX = 0;
        let rotationY = 0;

        this.container.addEventListener('mousedown', (event) => {
            isMouseDown = true;
            mouseX = event.clientX;
            mouseY = event.clientY;
        });

        this.container.addEventListener('mousemove', (event) => {
            if (!isMouseDown) return;

            const deltaX = event.clientX - mouseX;
            const deltaY = event.clientY - mouseY;

            targetRotationY += deltaX * 0.01;
            targetRotationX += deltaY * 0.01;

            mouseX = event.clientX;
            mouseY = event.clientY;
        });

        this.container.addEventListener('mouseup', () => {
            isMouseDown = false;
        });

        // Fix: Also listen to global mouseup to handle cursor leaving the container
        document.addEventListener('mouseup', () => {
            isMouseDown = false;
        });

        // Fix: Handle mouse leave to prevent stuck drag state
        this.container.addEventListener('mouseleave', () => {
            isMouseDown = false;
        });

        this.container.addEventListener('wheel', (event) => {
            event.preventDefault();
            const scale = event.deltaY > 0 ? 1.1 : 0.9;
            this.camera.position.multiplyScalar(scale);
        });

        // Apply rotation in animation loop
        const updateControls = () => {
            rotationX += (targetRotationX - rotationX) * 0.1;
            rotationY += (targetRotationY - rotationY) * 0.1;

            const radius = this.camera.position.length();
            this.camera.position.x = radius * Math.sin(rotationY) * Math.cos(rotationX);
            this.camera.position.y = radius * Math.sin(rotationX);
            this.camera.position.z = radius * Math.cos(rotationY) * Math.cos(rotationX);
            this.camera.lookAt(0, 0, 0);
        };

        this.controls = updateControls;
    }

    private setupLighting(): void {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Point light for rim lighting
        const pointLight = new THREE.PointLight(0x00aaff, 0.5, 10);
        pointLight.position.set(-3, 2, 3);
        this.scene.add(pointLight);
    }

    private createSampleRoboticsVisualization(): void {
        // Create a sample robotics visualization
        const group = new THREE.Group();

        // Main structure (representing a drone or robot core)
        const mainGeometry = new THREE.SphereGeometry(1, 32, 32);
        const mainMaterial = new THREE.MeshPhongMaterial({
            color: 0xff6b6b,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        });
        const mainMesh = new THREE.Mesh(mainGeometry, mainMaterial);
        mainMesh.castShadow = true;
        mainMesh.receiveShadow = true;
        group.add(mainMesh);

        // Add some internal structures
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 0.3;

            const innerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
            const innerMaterial = new THREE.MeshPhongMaterial({
                color: 0x4ecdc4,
                transparent: true,
                opacity: 0.9
            });

            const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
            innerMesh.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle * 2) * 0.2,
                Math.sin(angle) * radius
            );
            innerMesh.castShadow = true;
            group.add(innerMesh);
        }

        // Add surrounding grid (representing scan data)
        const gridHelper = new THREE.GridHelper(4, 10, 0x444444, 0x222222);
        gridHelper.position.y = -1.5;
        group.add(gridHelper);

        // Add coordinate axes
        const axesHelper = new THREE.AxesHelper(2);
        group.add(axesHelper);

        // Add particles for additional visual interest
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1000;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 8;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.005,
            color: 0x94a3b8,
            transparent: true,
            opacity: 0.3
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        group.add(particlesMesh);

        this.scene.add(group);

        // Store references for animation
        (this.scene as any).mainGroup = group;
        (this.scene as any).particles = particlesMesh;
    }

    private setupResize(): void {
        const resizeObserver = new ResizeObserver(() => {
            this.handleResize();
        });

        resizeObserver.observe(this.container);
    }

    private handleResize(): void {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    private animate = (): void => {
        this.animationId = requestAnimationFrame(this.animate);

        // Update controls
        if (this.controls) {
            this.controls();
        }

        // Rotate the main group slowly
        const mainGroup = (this.scene as any).mainGroup;
        const particles = (this.scene as any).particles;

        if (mainGroup) {
            mainGroup.rotation.y += 0.005;
            mainGroup.rotation.x += 0.002;
        }

        if (particles) {
            particles.rotation.y += 0.001;
        }

        this.renderer.render(this.scene, this.camera);
    };

    public destroy(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        // Clean up Three.js objects
        this.scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                object.geometry.dispose();
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });

        this.renderer.dispose();

        if (this.container && this.renderer.domElement.parentNode === this.container) {
            this.container.removeChild(this.renderer.domElement);
        }
    }

    public getScene(): THREE.Scene {
        return this.scene;
    }

    public getCamera(): THREE.Camera {
        return this.camera;
    }

    public getRenderer(): THREE.WebGLRenderer {
        return this.renderer;
    }
}