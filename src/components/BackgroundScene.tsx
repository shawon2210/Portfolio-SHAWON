import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause } from 'lucide-react';

export interface BackgroundSceneConfig {
  /** Particle count (default: 1800 to ensure high density and visibility) */
  particleCount?: number;
  /** Movement speed factor */
  speed?: number;
  /** Opacity / brightness intensity factor (0.1 - 1.0) */
  intensity?: number;
  /** Primary node color */
  primaryColor?: string;
  /** Connection line & secondary glow color */
  secondaryColor?: string;
  /** Accent particle color */
  accentColor?: string;
  /** Proximity threshold for constellation connection lines (in world units) */
  connectDistance?: number;
  /** Particle size in world units */
  particleSize?: number;
}

interface BackgroundSceneProps {
  config?: BackgroundSceneConfig;
  className?: string;
  isPaused?: boolean;
  onTogglePause?: () => void;
}

const DEFAULT_CONFIG: Required<BackgroundSceneConfig> = {
  particleCount: 1800,
  speed: 0.6,
  intensity: 0.9,
  primaryColor: '#4cd7f6', // High-tech luminous Cyan
  secondaryColor: '#70d6ff', // Bright Ice Sky
  accentColor: '#4edea3', // Vibrant Emerald Accent
  connectDistance: 0.82,
  particleSize: 0.065,
};

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const BackgroundScene: React.FC<BackgroundSceneProps> = ({
  config: userConfig,
  className = '',
  isPaused: externalPaused = false,
  onTogglePause,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [internalPaused, setInternalPaused] = useState(false);
  const [fps, setFps] = useState<number>(60);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const config = { ...DEFAULT_CONFIG, ...userConfig };
  const paused = externalPaused || internalPaused;

  useEffect(() => {
    // 1. WebGL Verification
    if (!checkWebGLSupport()) {
      setWebGLSupported(false);
      return;
    }

    // 2. Reduced Motion & URL Override (?bg=force)
    const urlParams = new URLSearchParams(window.location.search);
    const isForceBg = urlParams.get('bg') === 'force';

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const initialReduced = !isForceBg && motionQuery.matches;
    setIsReducedMotion(initialReduced);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (!isForceBg) {
        setIsReducedMotion(e.matches);
      }
    };

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', handleMotionChange);
    }

    return () => {
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener('change', handleMotionChange);
      }
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !webGLSupported) return;

    // URL Override check (?bg=force)
    const urlParams = new URLSearchParams(window.location.search);
    const isForceBg = urlParams.get('bg') === 'force';

    // DPR Clamping (Max 1.5 to guarantee high performance across Retina/4K displays)
    const targetDPR = Math.min(window.devicePixelRatio || 1, 1.5);

    // Three.js Scene Setup
    const scene = new THREE.Scene();

    let width = container.clientWidth || window.innerWidth || 1440;
    let height = container.clientHeight || window.innerHeight || 900;

    // Camera at z=8 with 60 deg FOV
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 8;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(targetDPR);
      renderer.domElement.setAttribute('aria-hidden', 'true');
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.inset = '0';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.pointerEvents = 'none';
      renderer.domElement.style.zIndex = '0';
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.warn('WebGL Renderer initialization error:', err);
      setWebGLSupported(false);
      return;
    }

    // World coordinate boundary calculations at camera z=8
    const halfFovRad = (60 / 2) * (Math.PI / 180);
    const visibleHeightAtOrigin = 2 * Math.tan(halfFovRad) * 8;
    const visibleWidthAtOrigin = visibleHeightAtOrigin * (width / height);

    const bounds = {
      x: visibleWidthAtOrigin * 0.95,
      y: visibleHeightAtOrigin * 0.95,
      z: 5.0,
    };

    const count = config.particleCount;
    const maxConnections = Math.min(count * 4, 3000);

    // Particle Buffers (Preallocated Float32Arrays for zero GC churn)
    const particlePositions = new Float32Array(count * 3);
    const particleVelocities = new Float32Array(count * 3);
    const particleColors = new Float32Array(count * 3);

    const primaryCol = new THREE.Color(config.primaryColor);
    const secCol = new THREE.Color(config.secondaryColor);
    const accentCol = new THREE.Color(config.accentColor);
    const whiteIceCol = new THREE.Color('#e2f7ff');

    const effectiveSpeed = (isReducedMotion && !isForceBg ? 0.04 : 1.0) * config.speed;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * bounds.x * 2;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * bounds.y * 2;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * bounds.z * 2;

      // Smooth multi-directional velocities
      particleVelocities[i3] = (Math.random() - 0.5) * 0.009 * effectiveSpeed;
      particleVelocities[i3 + 1] = (Math.random() - 0.5) * 0.009 * effectiveSpeed;
      particleVelocities[i3 + 2] = (Math.random() - 0.5) * 0.006 * effectiveSpeed;

      // Color distribution: high-contrast neon cyan, ice-blue, and white-hot nodes
      const rand = Math.random();
      const col = rand > 0.6 ? primaryCol : rand > 0.3 ? secCol : rand > 0.12 ? accentCol : whiteIceCol;
      particleColors[i3] = col.r;
      particleColors[i3 + 1] = col.g;
      particleColors[i3 + 2] = col.b;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );
    particlesGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(particleColors, 3)
    );

    // Procedural Glowing Circular Particle Texture (Crisp, self-illuminated nodes)
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 64;
    particleCanvas.height = 64;
    const pCtx = particleCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.2, 'rgba(76, 215, 246, 0.95)');
      grad.addColorStop(0.5, 'rgba(112, 214, 255, 0.5)');
      grad.addColorStop(0.8, 'rgba(78, 222, 163, 0.15)');
      grad.addColorStop(1, 'rgba(16, 19, 26, 0)');
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 64, 64);
    }
    const particleTexture = new THREE.CanvasTexture(particleCanvas);

    const particlesMaterial = new THREE.PointsMaterial({
      size: config.particleSize,
      sizeAttenuation: true,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.95 * config.intensity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // Constellation Connection Lines Buffer
    const linePositions = new Float32Array(maxConnections * 6);
    const lineColors = new Float32Array(maxConnections * 6);
    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage)
    );
    linesGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage)
    );

    const linesMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.55 * config.intensity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const linesSystem = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(linesSystem);

    // Mouse Parallax & Scroll Integration (Captured on window so pointer-events: none works)
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let targetScrollOffset = 0;

    const handlePointerMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 0.9;
      mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 0.7;
    };

    const handleScroll = () => {
      targetScrollOffset = (window.scrollY / Math.max(window.innerHeight, 1)) * 0.6;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Responsive Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Tab Visibility API (Pause when tab is hidden, resume when visible)
    let animationFrameId: number;
    let isTabVisible = document.visibilityState === 'visible';
    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsUpdate = lastTime;

    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Core Continuous Render Loop
    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isTabVisible || paused) {
        return;
      }

      // FPS Tracking
      frameCount++;
      if (currentTime - lastFpsUpdate > 1000) {
        const measuredFps = Math.round((frameCount * 1000) / (currentTime - lastFpsUpdate));
        setFps(measuredFps);
        frameCount = 0;
        lastFpsUpdate = currentTime;
      }

      // Camera Parallax & Scroll Drift
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      camera.position.x = mouse.x;
      camera.position.y = mouse.y - targetScrollOffset * 0.3;
      camera.lookAt(0, -targetScrollOffset * 0.3, 0);

      // Particle Position Updates & Bounding Containment
      const posAttr = particlesGeometry.attributes.position as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;

      let lineIndex = 0;
      const distThreshold = config.connectDistance;
      const distThresholdSq = distThreshold * distThreshold;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        positions[i3] += particleVelocities[i3];
        positions[i3 + 1] += particleVelocities[i3 + 1];
        positions[i3 + 2] += particleVelocities[i3 + 2];

        // Soft rebound inside frustum bounds
        if (Math.abs(positions[i3]) > bounds.x) {
          particleVelocities[i3] *= -1;
          positions[i3] = Math.sign(positions[i3]) * bounds.x;
        }
        if (Math.abs(positions[i3 + 1]) > bounds.y) {
          particleVelocities[i3 + 1] *= -1;
          positions[i3 + 1] = Math.sign(positions[i3 + 1]) * bounds.y;
        }
        if (Math.abs(positions[i3 + 2]) > bounds.z) {
          particleVelocities[i3 + 2] *= -1;
          positions[i3 + 2] = Math.sign(positions[i3 + 2]) * bounds.z;
        }

        // Constellation lines connection calculation (subsampled for 60 FPS performance)
        if (i % 2 === 0) {
          for (let j = i + 1; j < Math.min(i + 45, count); j++) {
            if (lineIndex >= maxConnections) break;

            const j3 = j * 3;
            const dx = positions[i3] - positions[j3];
            const dy = positions[i3 + 1] - positions[j3 + 1];
            const dz = positions[i3 + 2] - positions[j3 + 2];
            const distSq = dx * dx + dy * dy + dz * dz;

            if (distSq < distThresholdSq) {
              const alpha = (1 - Math.sqrt(distSq) / distThreshold) * 0.65 * config.intensity;
              const l6 = lineIndex * 6;

              linePositions[l6] = positions[i3];
              linePositions[l6 + 1] = positions[i3 + 1];
              linePositions[l6 + 2] = positions[i3 + 2];

              linePositions[l6 + 3] = positions[j3];
              linePositions[l6 + 4] = positions[j3 + 1];
              linePositions[l6 + 5] = positions[j3 + 2];

              lineColors[l6] = secCol.r * alpha;
              lineColors[l6 + 1] = secCol.g * alpha;
              lineColors[l6 + 2] = secCol.b * alpha;
              lineColors[l6 + 3] = primaryCol.r * alpha;
              lineColors[l6 + 4] = primaryCol.g * alpha;
              lineColors[l6 + 5] = primaryCol.b * alpha;

              lineIndex++;
            }
          }
        }
      }

      posAttr.needsUpdate = true;

      const linePosAttr = linesGeometry.attributes.position as THREE.BufferAttribute;
      const lineColorAttr = linesGeometry.attributes.color as THREE.BufferAttribute;
      linePosAttr.needsUpdate = true;
      lineColorAttr.needsUpdate = true;
      linesGeometry.setDrawRange(0, lineIndex * 2);

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    // Start render loop immediately
    animationFrameId = requestAnimationFrame(animate);

    // Comprehensive Resource Disposal Lifecycle
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      particlesGeometry.dispose();
      linesGeometry.dispose();
      particlesMaterial.dispose();
      particleTexture.dispose();
      linesMaterial.dispose();

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, [webGLSupported, isReducedMotion, paused, config.particleCount, config.speed, config.intensity, config.particleSize]);

  // Fallback: If WebGL is completely unsupported
  if (!webGLSupported) {
    return (
      <div
        aria-hidden="true"
        className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
        style={{
          background:
            'radial-gradient(circle at 50% 20%, rgba(76, 215, 246, 0.12) 0%, rgba(16, 19, 26, 0.95) 75%), #10131a',
        }}
      >
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>
    );
  }

  return (
    <>
      <div
        aria-hidden="true"
        className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none ${className}`}
      >
        {/* 3D WebGL Canvas Container */}
        <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

        {/* High-Contrast WCAG AA Protection Scrim: Gentle vignetting allowing full particle luminosity */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              'radial-gradient(circle at 50% 30%, rgba(16, 19, 26, 0.15) 0%, rgba(16, 19, 26, 0.45) 70%, rgba(16, 19, 26, 0.72) 100%)',
          }}
        />

        {/* Subtle Ambient Scanline Grid for Systems Aesthetic */}
        <div className="absolute inset-0 opacity-[0.018] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none z-[2]" />
      </div>

      {/* Accessible Background Controls (Floating micro-pill for toggling pause) */}
      <div className="fixed bottom-4 left-4 z-50 pointer-events-auto opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
        <button
          type="button"
          onClick={() => {
            if (onTogglePause) onTogglePause();
            else setInternalPaused((prev) => !prev);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-outline hover:text-primary transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest"
          title={paused ? 'Resume 3D Ambient Constellation' : 'Pause 3D Ambient Constellation'}
          aria-label={paused ? 'Resume 3D background animation' : 'Pause 3D background animation'}
        >
          {paused ? <Play className="w-3.5 h-3.5" aria-hidden="true" /> : <Pause className="w-3.5 h-3.5" aria-hidden="true" />}
          <span>{paused ? 'RESUME 3D' : `${fps} FPS`}</span>
        </button>
      </div>
    </>
  );
};

export default BackgroundScene;
