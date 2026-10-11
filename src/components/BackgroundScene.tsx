import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Play, Pause, Activity } from 'lucide-react';
import { createCodeAtlas, CodeAtlasResult } from '../lib/codeAtlas';
import { THEME_COLORS } from '../lib/tokens';
import { anchorRegistry } from '../lib/anchorRegistry';
import { createProceduralObjects, ProceduralObjects } from '../lib/proceduralObjects';

export interface FloatingCodeConfig {
  count?: number;
  speed?: number;
  depth?: number;
  opacity?: number;
  parallax?: boolean;
  quality?: 'auto' | 'high' | 'medium' | 'low';
}

interface BackgroundSceneProps {
  config?: FloatingCodeConfig;
  className?: string;
  isPaused?: boolean;
  onTogglePause?: () => void;
}

interface CardInstance {
  baseX: number;
  baseY: number;
  baseZ: number;
  x: number;
  y: number;
  z: number;
  scale: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  speedY: number;
  swayFreq: number;
  swayAmp: number;
  phase: number;
  alpha: number;
  tileIndex: number;
}

type QualityTier = 'high' | 'medium' | 'low';

export const BackgroundScene: React.FC<BackgroundSceneProps> = ({
  config: userConfig,
  className = '',
  isPaused: externalPaused,
  onTogglePause,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [internalPaused, setInternalPaused] = useState(() => {
    try {
      return localStorage.getItem('shawon_portfolio_bg_paused') === 'true';
    } catch {
      return false;
    }
  });
  const [fps, setFps] = useState(60);
  const [drawCalls, setDrawCalls] = useState(2);
  const [triangles, setTriangles] = useState(0);
  const [qualityTier, setQualityTier] = useState<QualityTier>('high');
  const [showDebug, setShowDebug] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [activeAnchorsCount, setActiveAnchorsCount] = useState(0);

  const isPaused = externalPaused !== undefined ? externalPaused : internalPaused;

  const togglePause = useCallback(() => {
    if (onTogglePause) {
      onTogglePause();
    } else {
      setInternalPaused((prev) => {
        const next = !prev;
        try {
          localStorage.setItem('shawon_portfolio_bg_paused', String(next));
        } catch {}
        return next;
      });
    }
  }, [onTogglePause]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isDebug = urlParams.get('bg') === 'debug';
    const isForce = urlParams.get('bg') === 'force';
    setShowDebug(isDebug);

    // Reduced motion check
    const prefersReducedMotion =
      !isForce &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Viewport-based initial tier
    const width = window.innerWidth;
    let initialTier: QualityTier = 'high';
    if (width < 640) initialTier = 'low';
    else if (width < 1024) initialTier = 'medium';

    setQualityTier(initialTier);

    const cardCounts: Record<QualityTier, number> = {
      high: 24,
      medium: 14,
      low: 8,
    };

    const count = userConfig?.count ?? cardCounts[initialTier];

    // Check WebGL
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) {
      setWebGLSupported(false);
      return;
    }

    if (!containerRef.current) return;

    let destroyed = false;
    let animationFrameId: number;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let instancedCardsMesh: THREE.InstancedMesh | null = null;
    let dustPoints: THREE.Points | null = null;
    let atlasResult: CodeAtlasResult | null = null;
    let proceduralObjs: ProceduralObjects | null = null;

    // Anchored Objects Group
    const anchorsGroup = new THREE.Group();

    // Mouse and scroll parallax trackers
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const scroll = { y: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scroll.targetY = window.scrollY;
      anchorRegistry.updateRects();
    };

    if (window.innerWidth >= 768) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    // FPS measurement
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsAccumulator = 0;
    const fpsHistory: number[] = [];

    // Helper: Map Screen Rect to 3D World Coordinates at a given z-plane.
    // Camera is at z=18. targetZ=10 → 8 units away, clearly visible.
    // targetZ=8 → 10 units away. Fog exp(-0.008*8)≈0.94 — nearly opaque.
    const mapScreenToWorld = (rect: DOMRect, targetZ = 8): { pos: THREE.Vector3; scale: number } => {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized Device Coordinates (-1 to +1)
      const ndcX = (centerX / window.innerWidth) * 2 - 1;
      const ndcY = -(centerY / window.innerHeight) * 2 + 1;

      // Unproject NDC → world direction, then intersect with z-plane
      const vec = new THREE.Vector3(ndcX, ndcY, 0.5);
      vec.unproject(camera);
      vec.sub(camera.position).normalize();
      // Guard: if ray nearly parallel to plane, fall back to origin
      if (Math.abs(vec.z) < 0.001) return { pos: new THREE.Vector3(0, 0, targetZ), scale: 1 };
      const distance = (targetZ - camera.position.z) / vec.z;
      const worldPos = camera.position.clone().add(vec.multiplyScalar(distance));

      // Scale: frustum width at targetZ → map rect pixel ratio to world units
      const vFov = (camera.fov * Math.PI) / 180;
      const visibleHeightAtZ = 2 * Math.tan(vFov / 2) * Math.abs(camera.position.z - targetZ);
      const visibleWidthAtZ = visibleHeightAtZ * camera.aspect;
      const scale = (rect.width / window.innerWidth) * (visibleWidthAtZ / 3.4);

      return { pos: worldPos, scale: Math.max(0.35, scale) };
    };

    // Initialize Three.js Scene
    const initScene = async () => {
      const container = containerRef.current;
      if (!container || destroyed) return;

      const w = window.innerWidth;
      const h = window.innerHeight;

      // 1. Scene & Depth Fog (density lowered so mid-range anchored objects at z=8-10 are clear)
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2('#090b11', 0.008);

      // 2. Perspective Camera
      camera = new THREE.PerspectiveCamera(54, w / h, 0.1, 100);
      camera.position.set(0, 0, 18);

      // 3. Single Shared WebGL Renderer
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: window.devicePixelRatio < 1.5,
        powerPreference: 'high-performance',
      });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;

      container.appendChild(renderer.domElement);

      // 4. Create Texture Atlas
      try {
        atlasResult = await createCodeAtlas();
      } catch (err) {
        console.warn('Code atlas creation failed, falling back to basic material', err);
      }

      if (destroyed) return;

      // 5. Build Instanced Floating Code Cards
      const cardW = 3.6;
      const cardH = 1.9;
      const cardGeom = new THREE.PlaneGeometry(cardW, cardH);

      const cardMat = new THREE.MeshBasicMaterial({
        map: atlasResult?.texture || null,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      cardMat.onBeforeCompile = (shader) => {
        shader.vertexShader = `
          attribute vec4 instanceUv;
          attribute float instanceAlpha;
          varying vec2 vInstanceUv;
          varying float vInstanceAlpha;
          ${shader.vertexShader}
        `.replace(
          '#include <uv_vertex>',
          `
          #include <uv_vertex>
          vInstanceUv = uv * instanceUv.zw + instanceUv.xy;
          vInstanceAlpha = instanceAlpha;
          `
        );

        shader.fragmentShader = `
          varying vec2 vInstanceUv;
          varying float vInstanceAlpha;
          ${shader.fragmentShader}
        `.replace(
          '#include <map_fragment>',
          `
          #ifdef USE_MAP
            vec4 sampledColor = texture2D( map, vInstanceUv );
            diffuseColor *= sampledColor;
            diffuseColor.a *= vInstanceAlpha;
          #endif
          `
        );
      };

      instancedCardsMesh = new THREE.InstancedMesh(cardGeom, cardMat, count);
      instancedCardsMesh.frustumCulled = false;

      const instanceUvArray = new Float32Array(count * 4);
      const instanceAlphaArray = new Float32Array(count);

      const cards: CardInstance[] = [];
      const tiles = atlasResult?.tiles || [];

      for (let i = 0; i < count; i++) {
        let z = -22 + Math.random() * 8;
        let scale = 0.55 + Math.random() * 0.2;
        let baseAlpha = 0.35 + Math.random() * 0.25;

        if (i % 3 === 1) {
          z = -14 + Math.random() * 6;
          scale = 0.8 + Math.random() * 0.25;
          baseAlpha = 0.55 + Math.random() * 0.25;
        } else if (i % 3 === 2) {
          z = -7 + Math.random() * 4;
          scale = 1.05 + Math.random() * 0.3;
          baseAlpha = 0.22 + Math.random() * 0.12;
        }

        const xSpread = 16 * (1 + Math.abs(z) * 0.05);
        let x = (Math.random() - 0.5) * xSpread * 2;
        if (Math.abs(x) < 3.5 && Math.random() > 0.3) {
          x += x > 0 ? 3.5 : -3.5;
        }

        const y = -14 + Math.random() * 28;
        const tileIdx = i % (tiles.length || 1);
        const tile = tiles[tileIdx] || { uOffset: 0, vOffset: 0, uScale: 1, vScale: 1 };

        instanceUvArray[i * 4 + 0] = tile.uOffset;
        instanceUvArray[i * 4 + 1] = tile.vOffset;
        instanceUvArray[i * 4 + 2] = tile.uScale;
        instanceUvArray[i * 4 + 3] = tile.vScale;
        instanceAlphaArray[i] = baseAlpha;

        cards.push({
          baseX: x,
          baseY: y,
          baseZ: z,
          x,
          y,
          z,
          scale,
          rotX: (Math.random() - 0.5) * 0.35,
          rotY: (Math.random() - 0.5) * 0.45,
          rotZ: (Math.random() - 0.5) * 0.2,
          speedY: 0.15 + Math.random() * 0.35,
          swayFreq: 0.4 + Math.random() * 0.6,
          swayAmp: 0.2 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2,
          alpha: baseAlpha,
          tileIndex: tileIdx,
        });
      }

      cardGeom.setAttribute(
        'instanceUv',
        new THREE.InstancedBufferAttribute(instanceUvArray, 4)
      );
      cardGeom.setAttribute(
        'instanceAlpha',
        new THREE.InstancedBufferAttribute(instanceAlphaArray, 1)
      );

      scene.add(instancedCardsMesh);

      // 6. Particle Constellation Dust
      const dustCount = initialTier === 'high' ? 120 : 60;
      const dustGeom = new THREE.BufferGeometry();
      const dustPos = new Float32Array(dustCount * 3);
      for (let i = 0; i < dustCount; i++) {
        dustPos[i * 3 + 0] = (Math.random() - 0.5) * 40;
        dustPos[i * 3 + 1] = (Math.random() - 0.5) * 35;
        dustPos[i * 3 + 2] = -25 + Math.random() * 25;
      }
      dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
      const dustMat = new THREE.PointsMaterial({
        color: new THREE.Color(THEME_COLORS.accent),
        size: 0.06,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      });
      dustPoints = new THREE.Points(dustGeom, dustMat);
      scene.add(dustPoints);

      // 7. Procedural 3D Objects for Anchors (Single Canvas Unification)
      proceduralObjs = createProceduralObjects();
      scene.add(anchorsGroup);

      anchorsGroup.add(proceduralObjs.heroCore);
      anchorsGroup.add(proceduralObjs.aboutTorusKnot);
      anchorsGroup.add(proceduralObjs.aboutGyro);
      anchorsGroup.add(proceduralObjs.aboutBlocks);
      anchorsGroup.add(proceduralObjs.aboutNoiseSphere);
      anchorsGroup.add(proceduralObjs.contactGlobe);

      const dummy = new THREE.Object3D();

      const renderComposedFrame = () => {
        for (let i = 0; i < count; i++) {
          const c = cards[i];
          dummy.position.set(c.x, c.y, c.z);
          dummy.rotation.set(c.rotX, c.rotY, c.rotZ);
          dummy.scale.set(c.scale, c.scale, 1);
          dummy.updateMatrix();
          instancedCardsMesh?.setMatrixAt(i, dummy.matrix);
        }
        instancedCardsMesh!.instanceMatrix.needsUpdate = true;
        renderer.render(scene, camera);
      };

      renderComposedFrame();

      if (prefersReducedMotion) {
        return;
      }

      // 8. Animation Loop with Anchored Coordinate Mapping
      const boundTop = 18;
      const boundBottom = -18;

      const animate = () => {
        if (destroyed) return;

        animationFrameId = requestAnimationFrame(animate);

        if (isPaused) return;

        const now = performance.now();
        const delta = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        frameCount++;
        fpsAccumulator += delta;

        if (fpsAccumulator >= 0.5) {
          const currentFps = Math.round(frameCount / fpsAccumulator);
          setFps(currentFps);
          fpsHistory.push(currentFps);
          if (fpsHistory.length > 10) fpsHistory.shift();

          setDrawCalls(renderer.info.render.calls);
          setTriangles(renderer.info.render.triangles);

          if (fpsHistory.length >= 4) {
            const avgFps = fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length;
            if (avgFps < 45 && initialTier === 'high') {
              setQualityTier('medium');
            }
          }

          frameCount = 0;
          fpsAccumulator = 0;
        }

        // Parallax Lerp
        mouse.x += (mouse.targetX - mouse.x) * 0.04;
        mouse.y += (mouse.targetY - mouse.y) * 0.04;
        scroll.y += (scroll.targetY - scroll.y) * 0.05;

        // Camera gentle drift from parallax and scroll depth dolly
        camera.position.x = mouse.x * 1.5;
        camera.position.y = mouse.y * 1.0 - scroll.y * 0.002;
        camera.rotation.y = -mouse.x * 0.03;
        camera.rotation.x = mouse.y * 0.02;

        const time = now * 0.001;

        // Update Instanced Floating Code Cards
        for (let i = 0; i < count; i++) {
          const c = cards[i];
          c.y += c.speedY * delta;
          if (c.y > boundTop) {
            c.y = boundBottom;
          }

          const swayX = Math.sin(time * c.swayFreq + c.phase) * c.swayAmp;
          const currentRotX = c.rotX + Math.sin(time * 0.3 + c.phase) * 0.04;
          const currentRotY = c.rotY + Math.cos(time * 0.4 + c.phase) * 0.05;
          const currentRotZ = c.rotZ + Math.sin(time * 0.2 + c.phase) * 0.02;

          let nudgeX = 0;
          let nudgeY = 0;
          if (c.z > -18) {
            const dx = c.x - mouse.x * 12;
            const dy = c.y - mouse.y * 8;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 6 && dist > 0.1) {
              const force = (1 - dist / 6) * 0.3;
              nudgeX = (dx / dist) * force;
              nudgeY = (dy / dist) * force;
            }
          }

          dummy.position.set(c.x + swayX + nudgeX, c.y + nudgeY, c.z);
          dummy.rotation.set(currentRotX, currentRotY, currentRotZ);
          dummy.scale.set(c.scale, c.scale, 1);
          dummy.updateMatrix();

          instancedCardsMesh?.setMatrixAt(i, dummy.matrix);
        }

        if (instancedCardsMesh) {
          instancedCardsMesh.instanceMatrix.needsUpdate = true;
        }

        // Update Dust Particles
        if (dustPoints) {
          dustPoints.rotation.y = time * 0.012;
          dustPoints.rotation.x = Math.sin(time * 0.008) * 0.05;
        }

        // 9. Update Anchored 3D Objects from DOM Rects
        anchorRegistry.updateRects();
        const activeAnchors = anchorRegistry.getAll();
        setActiveAnchorsCount(activeAnchors.filter((a) => a.isVisible).length);

        if (proceduralObjs) {
          // A) Hero Centerpiece Anchor
          const heroReg = anchorRegistry.get('hero-centerpiece');
          if (heroReg && heroReg.isVisible) {
            proceduralObjs.heroCore.visible = true;
            const mapped = mapScreenToWorld(heroReg.screenRect, 10);
            proceduralObjs.heroCore.position.copy(mapped.pos);
            proceduralObjs.heroCore.scale.setScalar(mapped.scale);
            proceduralObjs.heroCore.rotation.y = time * 0.6 + mouse.x * 0.8;
            proceduralObjs.heroCore.rotation.x = time * 0.3 - mouse.y * 0.5;
          } else {
            proceduralObjs.heroCore.visible = false;
          }

          // B) About Corner: Torus Knot
          const torusReg = anchorRegistry.get('about-torus');
          if (torusReg && torusReg.isVisible) {
            proceduralObjs.aboutTorusKnot.visible = true;
            const mapped = mapScreenToWorld(torusReg.screenRect, 8);
            proceduralObjs.aboutTorusKnot.position.copy(mapped.pos);
            proceduralObjs.aboutTorusKnot.scale.setScalar(mapped.scale);
            proceduralObjs.aboutTorusKnot.rotation.x = time * 0.8;
            proceduralObjs.aboutTorusKnot.rotation.y = time * 0.5;
          } else {
            proceduralObjs.aboutTorusKnot.visible = false;
          }

          // C) About Corner: Gyroscope
          const gyroReg = anchorRegistry.get('about-gyro');
          if (gyroReg && gyroReg.isVisible) {
            proceduralObjs.aboutGyro.visible = true;
            const mapped = mapScreenToWorld(gyroReg.screenRect, 8);
            proceduralObjs.aboutGyro.position.copy(mapped.pos);
            proceduralObjs.aboutGyro.scale.setScalar(mapped.scale);
            proceduralObjs.aboutGyro.rotation.z = time * 0.7;
            proceduralObjs.aboutGyro.rotation.y = time * 0.4;
          } else {
            proceduralObjs.aboutGyro.visible = false;
          }

          // D) About Corner: Blocks
          const blocksReg = anchorRegistry.get('about-blocks');
          if (blocksReg && blocksReg.isVisible) {
            proceduralObjs.aboutBlocks.visible = true;
            const mapped = mapScreenToWorld(blocksReg.screenRect, 8);
            proceduralObjs.aboutBlocks.position.copy(mapped.pos);
            proceduralObjs.aboutBlocks.scale.setScalar(mapped.scale);
            proceduralObjs.aboutBlocks.rotation.y = time * 0.45;
            proceduralObjs.aboutBlocks.rotation.x = time * 0.25;
          } else {
            proceduralObjs.aboutBlocks.visible = false;
          }

          // E) About Corner: Noise Sphere
          const sphereReg = anchorRegistry.get('about-noise-sphere');
          if (sphereReg && sphereReg.isVisible) {
            proceduralObjs.aboutNoiseSphere.visible = true;
            const mapped = mapScreenToWorld(sphereReg.screenRect, 8);
            proceduralObjs.aboutNoiseSphere.position.copy(mapped.pos);
            proceduralObjs.aboutNoiseSphere.scale.setScalar(
              mapped.scale * (1 + Math.sin(time * 2.5) * 0.08)
            );
            proceduralObjs.aboutNoiseSphere.rotation.y = time * 0.6;
          } else {
            proceduralObjs.aboutNoiseSphere.visible = false;
          }

          // F) Contact Globe Anchor
          const globeReg = anchorRegistry.get('contact-globe');
          if (globeReg && globeReg.isVisible) {
            proceduralObjs.contactGlobe.visible = true;
            const mapped = mapScreenToWorld(globeReg.screenRect, 8);
            proceduralObjs.contactGlobe.position.copy(mapped.pos);
            proceduralObjs.contactGlobe.scale.setScalar(mapped.scale * 0.75);
            proceduralObjs.contactGlobe.rotation.y = time * 0.35 + mouse.x * 0.4;
            proceduralObjs.contactGlobe.rotation.x = mouse.y * 0.2;
          } else {
            proceduralObjs.contactGlobe.visible = false;
          }
        }

        renderer.render(scene, camera);
      };

      animate();
    };

    initScene();

    const handleResize = () => {
      if (!renderer || !camera) return;
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      anchorRegistry.updateRects();
    };

    window.addEventListener('resize', handleResize);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        lastTime = performance.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Clean up all resources
    return () => {
      destroyed = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (instancedCardsMesh) {
        instancedCardsMesh.geometry.dispose();
        if (Array.isArray(instancedCardsMesh.material)) {
          instancedCardsMesh.material.forEach((m) => m.dispose());
        } else {
          instancedCardsMesh.material.dispose();
        }
      }

      if (dustPoints) {
        dustPoints.geometry.dispose();
        (dustPoints.material as THREE.Material).dispose();
      }

      if (atlasResult) {
        atlasResult.texture.dispose();
      }

      if (proceduralObjs) {
        proceduralObjs.dispose();
      }

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentElement) {
          renderer.domElement.parentElement.removeChild(renderer.domElement);
        }
      }
    };
  }, [userConfig?.count, isPaused]);

  if (!webGLSupported) {
    return (
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-[#090b11] overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-radial from-sky-950/20 via-transparent to-transparent opacity-40" />
      </div>
    );
  }

  return (
    <>
      {/* 3D WebGL Canvas Layer (Fixed full-viewport, behind content) */}
      <div
        ref={containerRef}
        className={`fixed inset-0 z-0 pointer-events-none overflow-hidden ${className}`}
        aria-hidden="true"
      >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(9,11,17,0.15)_0%,rgba(9,11,17,0.55)_80%,rgba(9,11,17,0.8)_100%)]" />
      </div>

      {/* Accessible Control: Pause/Resume Toggle (OUTSIDE aria-hidden canvas wrapper) */}
      <div className="fixed bottom-5 left-5 z-40 hidden sm:flex items-center gap-2">
        <button
          onClick={togglePause}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0d1017]/85 backdrop-blur-md border border-white/[0.08] hover:border-sky-400/40 text-[11px] font-mono text-slate-400 hover:text-white transition-all shadow-lg cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400"
          title={isPaused ? 'Resume 3D Background' : 'Pause 3D Background'}
          aria-label={isPaused ? 'Resume 3D animations' : 'Pause 3D animations'}
        >
          {isPaused ? (
            <>
              <Play className="w-3 h-3 text-emerald-400" />
              <span>Resume 3D</span>
            </>
          ) : (
            <>
              <Pause className="w-3 h-3 text-sky-400" />
              <span>Pause 3D</span>
            </>
          )}
        </button>

        {/* Debug HUD Overlay (?bg=debug) */}
        {showDebug && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/90 border border-sky-500/30 text-[11px] font-mono text-sky-300 shadow-xl">
            <Activity className="w-3 h-3 text-sky-400 animate-pulse" />
            <span>{fps} FPS</span>
            <span className="text-slate-600">|</span>
            <span>{drawCalls} Calls</span>
            <span className="text-slate-600">|</span>
            <span>{triangles} Tris</span>
            <span className="text-slate-600">|</span>
            <span>{activeAnchorsCount} Anchors</span>
            <span className="text-slate-600">|</span>
            <span className="uppercase">{qualityTier} Tier</span>
          </div>
        )}
      </div>
    </>
  );
};

export default BackgroundScene;
