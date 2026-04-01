import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function BuildingViewer({ glbPath, height = "100%", autoRotate = false }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const mountNode = mountRef.current;

    const width = mountNode.clientWidth;
    const heightPx = mountNode.clientHeight;

    const scene = new THREE.Scene();
    // Warm light gray bg — matches page background, won't tint model
    scene.background = new THREE.Color(0xf0f2f5);

    const grid = new THREE.GridHelper(200, 40, 0xcccccc, 0xe0e0e0);
    scene.add(grid);

    const camera = new THREE.PerspectiveCamera(55, width / heightPx, 0.1, 2000);
    camera.position.set(40, 30, 40);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // NoToneMapping = raw colors, exactly as authored in GLB
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountNode.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.5;
    controls.enableZoom = true;
    controls.minDistance = 2;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 1.8;

    // Pure neutral white lighting — zero color cast
    const ambient = new THREE.AmbientLight(0xffffff, 3.0);
    scene.add(ambient);

    const top = new THREE.DirectionalLight(0xffffff, 1.2);
    top.position.set(0, 100, 0);
    scene.add(top);

    const front = new THREE.DirectionalLight(0xffffff, 0.8);
    front.position.set(0, 20, 60);
    scene.add(front);

    const back = new THREE.DirectionalLight(0xffffff, 0.4);
    back.position.set(0, 20, -60);
    scene.add(back);

    const left = new THREE.DirectionalLight(0xffffff, 0.4);
    left.position.set(-60, 20, 0);
    scene.add(left);

    const right = new THREE.DirectionalLight(0xffffff, 0.4);
    right.position.set(60, 20, 0);
    scene.add(right);

    const loader = new GLTFLoader();
    loader.load(
      glbPath,
      (gltf) => {
        const model = gltf.scene;

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            // Keep original material, just ensure both sides render
            child.material.side = THREE.DoubleSide;
            child.material.needsUpdate = true;
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.sub(center);
        model.position.y += size.y * 0.5;

        const maxDim = Math.max(size.x, size.y, size.z);
        const fitDistance = maxDim * 2;
        camera.position.set(fitDistance, fitDistance * 0.8, fitDistance);
        camera.lookAt(0, 0, 0);
        controls.target.set(0, 0, 0);
        controls.maxDistance = maxDim * 8;
        controls.minDistance = maxDim * 0.2;
        controls.update();

        scene.add(model);
        console.log("✅ Model loaded:", glbPath, "| size:", size);
      },
      undefined,
      (err) => console.error("❌ GLB error:", err)
    );

    const handleResize = () => {
      if (!mountNode) return;
      const w = mountNode.clientWidth;
      const h = mountNode.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    let animFrameId;
    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      if (mountNode && renderer.domElement && mountNode.contains(renderer.domElement)) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, [glbPath, autoRotate]);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height, borderRadius: "inherit", overflow: "hidden" }}
    />
  );
}

export default BuildingViewer;
