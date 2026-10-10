import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Play, Pause, Activity } from 'lucide-react';
import { createCodeAtlas, CodeAtlasResult } from '../lib/codeAtlas';
import { THEME_COLORS } from '../lib/tokens';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
  const [qualityTier, setQualityTier] = useState<QualityTier>('high');
  const [showDebug, setShowDebug] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);

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

    // Mouse and scroll parallax trackers
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const scroll = { y: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to [-1, 1]
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scroll.targetY = window.scrollY;
    };

    if (window.innerWidth >= 768) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    // FPS measurement
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsAccumulator = 0;
    let fpsHistory: number[] = [];

    // Initialize Three.js Scene
    const initScene = async () => {
      const container = containerRef.current;
      if (!container || destroyed) return;

      const w = window.innerWidth;
      const h = window.innerHeight;

      // 1. Scene & Exponential Fog (fading out into #090b11)
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2('#090b11', 0.015);

      // 2. Camera
      camera = new THREE.PerspectiveCamera(54, w / h, 0.1, 100);
      camera.position.set(0, 0, 18);

      // 3. Renderer with clamped DPR to 1.5
      renderer = new THREE.WebGLRenderer({
        antialias: window.devicePixelRatio < 1.5,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(w, h);
      renderer.setClearColor(0x000000, 0); // Transparent canvas, html has #090b11

      container.appendChild(renderer.domElement);

      // 4. Generate Texture Atlas
      atlasResult = await createCodeAtlas();
      if (destroyed) {
        atlasResult.texture.dispose();
        return;
      }

      const { texture: atlasTexture, tiles } = atlasResult;

      // 5. Build Cards Instances
      // Card geometry: aspect ratio ~ 1.55 (e.g. 5.6 x 3.6 world units)
      const cardW = 5.4;
      const cardH = 3.4;
      const cardGeom = new THREE.PlaneGeometry(cardW, cardH);

      // Custom instanced shader material
      const cardMat = new THREE.MeshBasicMaterial({
        map: atlasTexture,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      cardMat.onBeforeCompile = (shader) => {
        shader.vertexShader = `
          attribute vec4 instanceUv;
          attribute float instanceAlpha;
          varying vec2 vTileUv;
          varying float vInstanceAlpha;
          ${shader.vertexShader}
        `.replace(
          '#include <uv_vertex>',
          `
          #include <uv_vertex>
          vTileUv = uv * instanceUv.zw + instanceUv.xy;
          vInstanceAlpha = instanceAlpha;
          `
        );

        shader.fragmentShader = `
          varying vec2 vTileUv;
          varying float vInstanceAlpha;
          ${shader.fragmentShader}
        `.replace(
          '#include <map_fragment>',
          `
          #ifdef USE_MAP
            vec4 sampledColor = texture2D( map, vTileUv );
            diffuseColor = sampledColor;
            diffuseColor.a *= vInstanceAlpha;
          #endif
          `
        );
      };

      instancedCardsMesh = new THREE.InstancedMesh(cardGeom, cardMat, count);
      instancedCardsMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

      // UV offset attributes: vec4(uOffset, vOffset, uScale, vScale)
      const instanceUvArray = new Float32Array(count * 4);
      const instanceAlphaArray = new Float32Array(count);

      // Setup 3 Depth Bands:
      // Band 0 (Near): z in [-8, -3], alpha 0.50, scale 1.2
      // Band 1 (Mid): z in [-20, -10], alpha 0.72, scale 1.0
      // Band 2 (Far): z in [-34, -22], alpha 0.45, scale 0.78
      const cards: CardInstance[] = [];

      for (let i = 0; i < count; i++) {
        const band = i % 3;
        let baseZ = -15;
        let scale = 1.0;
        let alpha = 0.55;

        if (band === 0) {
          // Near layer
          baseZ = -3 - Math.random() * 5;
          scale = 1.2;
          alpha = 0.48; // Crisp and visible, yet restrained
        } else if (band === 1) {
          // Mid layer
          baseZ = -10 - Math.random() * 10;
          scale = 1.0;
          alpha = 0.72;
        } else {
          // Far layer
          baseZ = -22 - Math.random() * 14;
          scale = 0.78;
          alpha = 0.45;
        }


        // Layout awareness: distribute across width with exclusion zone in center-left column
        let x = (Math.random() - 0.5) * 36;
        if (x > -8 && x < 2) {
          // Push out of center-left hero text column
          x += Math.random() > 0.5 ? 8 : -8;
        }

        const y = (Math.random() - 0.5) * 32;

        const tileIndex = i % tiles.length;
        const tile = tiles[tileIndex];

        instanceUvArray[i * 4 + 0] = tile.uOffset;
        instanceUvArray[i * 4 + 1] = tile.vOffset;
        instanceUvArray[i * 4 + 2] = tile.uScale;
        instanceUvArray[i * 4 + 3] = tile.vScale;
        instanceAlphaArray[i] = alpha;

        cards.push({
          baseX: x,
          baseY: y,
          baseZ,
          x,
          y,
          z: baseZ,
          scale,
          rotX: (Math.random() - 0.5) * 0.15,
          rotY: (Math.random() - 0.5) * 0.25,
          rotZ: (Math.random() - 0.5) * 0.1,
          speedY: 0.15 + Math.random() * 0.25,
          swayFreq: 0.4 + Math.random() * 0.6,
          swayAmp: 0.3 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          alpha,
          tileIndex,
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

      // 6. Dust & Space Particle Motes Layer
      const dustCount = initialTier === 'high' ? 300 : initialTier === 'medium' ? 180 : 80;
      const dustGeom = new THREE.BufferGeometry();
      const dustPos = new Float32Array(dustCount * 3);

      for (let i = 0; i < dustCount; i++) {
        dustPos[i * 3 + 0] = (Math.random() - 0.5) * 45;
        dustPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
        dustPos[i * 3 + 2] = -42 + Math.random() * 40;
      }

      dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));

      // Luminous cyan/emerald tiny particle motes
      const dustMat = new THREE.PointsMaterial({
        color: new THREE.Color(THEME_COLORS.accent),
        size: 0.18,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });

      dustPoints = new THREE.Points(dustGeom, dustMat);
      scene.add(dustPoints);

      // Helper matrix
      const dummy = new THREE.Object3D();

      // Render one initial composed frame (useful for reduced motion or static fallback)
      const renderComposedFrame = (time: number) => {
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

      renderComposedFrame(0);

      // If reduced motion is requested, stop right here after composed frame!
      if (prefersReducedMotion) {
        return;
      }

      // 7. Animation Loop
      const boundTop = 18;
      const boundBottom = -18;

      const animate = () => {
        if (destroyed) return;

        animationFrameId = requestAnimationFrame(animate);

        // Pause check
        if (isPaused) {
          return;
        }

        const now = performance.now();
        const delta = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        // FPS calculation & degradation check
        frameCount++;
        fpsAccumulator += delta;
        if (fpsAccumulator >= 0.5) {
          const currentFps = Math.round(frameCount / fpsAccumulator);
          setFps(currentFps);
          setDrawCalls(renderer.info.render.calls);
          fpsHistory.push(currentFps);
          if (fpsHistory.length > 4) fpsHistory.shift();

          // Auto-drop tier if average FPS stays under 45 for 2 seconds
          if (fpsHistory.length >= 4) {
            const avgFps = fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length;
            if (avgFps < 45 && initialTier === 'high') {
              setQualityTier('medium');
            }
          }

          frameCount = 0;
          fpsAccumulator = 0;
        }

        // Smooth Parallax Lerp
        mouse.x += (mouse.targetX - mouse.x) * 0.04;
        mouse.y += (mouse.targetY - mouse.y) * 0.04;
        scroll.y += (scroll.targetY - scroll.y) * 0.05;

        // Camera gentle drift from parallax
        camera.position.x = mouse.x * 1.8;
        camera.position.y = mouse.y * 1.2 - (scroll.y * 0.003);
        camera.rotation.y = -mouse.x * 0.035;
        camera.rotation.x = mouse.y * 0.025;

        const time = now * 0.001;

        // Update Code Cards
        for (let i = 0; i < count; i++) {
          const c = cards[i];

          // Slow vertical drift
          c.y += c.speedY * delta;
          if (c.y > boundTop) {
            c.y = boundBottom;
          }

          // Gentle sine sway and tiny rotations
          const swayX = Math.sin(time * c.swayFreq + c.phase) * c.swayAmp;
          const currentRotX = c.rotX + Math.sin(time * 0.3 + c.phase) * 0.04;
          const currentRotY = c.rotY + Math.cos(time * 0.4 + c.phase) * 0.05;
          const currentRotZ = c.rotZ + Math.sin(time * 0.2 + c.phase) * 0.02;

          // Mouse proximity nudge (desktop only, for near/mid cards)
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

        // Dust drift
        if (dustPoints) {
          dustPoints.rotation.y = time * 0.012;
          dustPoints.rotation.x = Math.sin(time * 0.008) * 0.05;
        }

        renderer.render(scene, camera);
      };

      animate();
    };

    initScene();

    // Resize handler
    const handleResize = () => {
      if (!renderer || !camera) return;
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    };

    window.addEventListener('resize', handleResize);

    // Visibility API (pause when tab hidden to save GPU cycles)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        lastTime = performance.now();
        if (!isPaused && !prefersReducedMotion) {
          animationFrameId = requestAnimationFrame(animateLoopResume);
        }
      }
    };

    const animateLoopResume = () => {
      // Trigger requestAnimationFrame resume
      lastTime = performance.now();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Clean up
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
        {/* Soft radial vignette overlay ensuring WCAG AA contrast while preserving card visibility */}
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
            <span>{drawCalls} Draw Calls</span>
            <span className="text-slate-600">|</span>
            <span className="uppercase">{qualityTier} Tier</span>
            <span className="text-slate-600">|</span>
            <span>2048x1024 Atlas</span>
          </div>
        )}
      </div>
    </>
  );
};

export default BackgroundScene;
