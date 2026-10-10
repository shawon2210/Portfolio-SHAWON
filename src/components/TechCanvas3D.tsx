import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, Terminal, Code2 } from 'lucide-react';
import { SYNTAX_PALETTE } from '../lib/tokens';

interface TechCanvas3DProps {
  className?: string;
  variant?: 'hero' | 'compact';
}

const HERO_CODE_SNIPPETS = [
  {
    file: 'architecture.ts',
    lang: 'TS',
    lines: [
      { t: '// Microservices & LLM Orchestration', c: SYNTAX_PALETTE.slate },
      { t: 'export async function dispatchTask(', c: SYNTAX_PALETTE.sky },
      { t: '  intent: LLMIntent,', c: SYNTAX_PALETTE.violet },
      { t: '  context: VectorContext', c: SYNTAX_PALETTE.violet },
      { t: '): Promise<ExecutionResult> {', c: SYNTAX_PALETTE.sky },
      { t: '  const stream = await llm.stream({', c: '#cbd5e1' },
      { t: '    model: "claude-3-7-sonnet",', c: SYNTAX_PALETTE.emerald },
      { t: '    temperature: 0.2,', c: SYNTAX_PALETTE.amber },
      { t: '    system: CORE_GUARDRAILS,', c: SYNTAX_PALETTE.violet },
      { t: '  });', c: '#cbd5e1' },
      { t: '  return compileOutput(stream);', c: SYNTAX_PALETTE.sky },
      { t: '}', c: SYNTAX_PALETTE.dim },
    ],
  },
  {
    file: 'systemCluster.ts',
    lang: 'TS',
    lines: [
      { t: 'interface ClusterTelemetry {', c: SYNTAX_PALETTE.violet },
      { t: '  activeNodes: number;', c: SYNTAX_PALETTE.amber },
      { t: '  p99LatencyMs: number;', c: SYNTAX_PALETTE.amber },
      { t: '  distributedState: "SYNCED";', c: SYNTAX_PALETTE.emerald },
      { t: '}', c: SYNTAX_PALETTE.dim },
      { t: 'const telemetry: ClusterTelemetry = {', c: SYNTAX_PALETTE.sky },
      { t: '  activeNodes: 64,', c: SYNTAX_PALETTE.amber },
      { t: '  p99LatencyMs: 14.2,', c: SYNTAX_PALETTE.amber },
      { t: '  distributedState: "SYNCED",', c: SYNTAX_PALETTE.emerald },
      { t: '};', c: SYNTAX_PALETTE.dim },
    ],
  },
  {
    file: 'query.sql',
    lang: 'SQL',
    lines: [
      { t: 'WITH ranked_events AS (', c: SYNTAX_PALETTE.sky },
      { t: '  SELECT trace_id, duration_ms,', c: '#cbd5e1' },
      { t: '    ROW_NUMBER() OVER (', c: SYNTAX_PALETTE.violet },
      { t: '      PARTITION BY service', c: SYNTAX_PALETTE.violet },
      { t: '      ORDER BY timestamp DESC', c: SYNTAX_PALETTE.sky },
      { t: '    ) as rank', c: SYNTAX_PALETTE.amber },
      { t: '  FROM system_telemetry', c: '#cbd5e1' },
      { t: ')', c: SYNTAX_PALETTE.dim },
      { t: 'SELECT * FROM ranked_events', c: SYNTAX_PALETTE.sky },
      { t: 'WHERE rank <= 10;', c: SYNTAX_PALETTE.amber },
    ],
  },
  {
    file: 'neuralEngine.py',
    lang: 'PY',
    lines: [
      { t: '@router.post("/v1/embeddings")', c: SYNTAX_PALETTE.violet },
      { t: 'async def embed_batch(req: BatchReq):', c: SYNTAX_PALETTE.sky },
      { t: '    """Compute dense vector projections"""', c: SYNTAX_PALETTE.slate },
      { t: '    vectors = await model.encode(', c: '#cbd5e1' },
      { t: '        req.documents,', c: SYNTAX_PALETTE.amber },
      { t: '        batch_size=128,', c: SYNTAX_PALETTE.amber },
      { t: '        normalize=True', c: SYNTAX_PALETTE.emerald },
      { t: '    )', c: '#cbd5e1' },
      { t: '    return {"dim": 1536, "data": vectors}', c: SYNTAX_PALETTE.sky },
    ],
  },
];

function createSnippetTexture(snippet: typeof HERO_CODE_SNIPPETS[number]): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 360;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background card with glass styling
  ctx.fillStyle = 'rgba(9, 11, 17, 0.94)';
  ctx.beginPath();
  ctx.roundRect(4, 4, 632, 352, 16);
  ctx.fill();

  // Subtle border
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Window titlebar
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.beginPath();
  ctx.roundRect(4, 4, 632, 38, [16, 16, 0, 0]);
  ctx.fill();

  // Window control dots
  const dots = ['#ef4444', '#eab308', '#22c55e'];
  dots.forEach((color, i) => {
    ctx.beginPath();
    ctx.arc(22 + i * 14, 22, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });

  // Filename label
  ctx.font = '12px "JetBrains Mono", Menlo, monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(snippet.file, 74, 26);

  // Language pill
  ctx.font = '10px "JetBrains Mono", Menlo, monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`[${snippet.lang}]`, 580, 26);

  // Code lines
  ctx.font = '13px "JetBrains Mono", Menlo, monospace';
  let y = 68;
  snippet.lines.forEach((line, idx) => {
    // Line number
    ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.fillText(`${(idx + 1).toString().padStart(2, ' ')}`, 18, y);

    // Code text
    ctx.fillStyle = line.c;
    ctx.fillText(line.t, 52, y);
    y += 24;
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

export const TechCanvas3D: React.FC<TechCanvas3DProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const isRotatingRef = useRef(isRotating);
  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  const [activeSnippetIdx, setActiveSnippetIdx] = useState(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#090b11', 0.08);

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 340;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio < 1.5,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Central 3D Floating Code Card Stack
    const cardGroup = new THREE.Group();
    rootGroup.add(cardGroup);

    const cardGeo = new THREE.PlaneGeometry(2.35, 1.35);
    const textures: THREE.CanvasTexture[] = [];
    const materials: THREE.MeshBasicMaterial[] = [];
    const cardMeshes: THREE.Mesh[] = [];

    HERO_CODE_SNIPPETS.forEach((snippet, i) => {
      const tex = createSnippetTexture(snippet);
      textures.push(tex);
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: i === 0 ? 0.95 : 0.45,
        side: THREE.DoubleSide,
      });
      materials.push(mat);
      const mesh = new THREE.Mesh(cardGeo, mat);

      // Stack cards at slight offset in 3D depth
      const zOffset = (i - 1.5) * 0.45;
      const yOffset = (i - 1.5) * 0.15;
      mesh.position.set(0, yOffset, zOffset);
      mesh.rotation.x = 0.08;
      mesh.rotation.y = (i - 1.5) * -0.12;

      cardMeshes.push(mesh);
      cardGroup.add(mesh);
    });

    // 2. Cybernetic Orbit Rings around the code cards
    const ringGeo1 = new THREE.TorusGeometry(2.1, 0.012, 8, 54);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2.6;
    ring1.rotation.y = 0.2;
    rootGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.35, 0.01, 8, 54);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.25,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 3;
    ring2.rotation.y = -0.3;
    rootGroup.add(ring2);

    // 3. Orbiting Data Nodes / Constellation Particles
    const particleCount = 90;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 1.9 + Math.random() * 1.3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.04,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particles);

    // Mouse / Touch interaction
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.6;
      targetRotationX = -y * 0.45;
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouse.x;
        const deltaY = e.clientY - prevMouse.y;
        rootGroup.rotation.y += deltaX * 0.008;
        rootGroup.rotation.x += deltaY * 0.008;
        prevMouse = { x: e.clientX, y: e.clientY };
      } else {
        handlePointerMove(e);
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Visibility & reduced motion throttling
    let isInView = true;
    let observer: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isInView = entry.isIntersecting;
        },
        { threshold: 0.01 }
      );
      observer.observe(container);
    }

    let isDocVisible = typeof document !== 'undefined' ? !document.hidden : true;
    const handleVisibilityChange = () => {
      isDocVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isInView || !isDocVisible) return;

      const elapsed = (performance.now() - startTime) * 0.001;

      // Mouse parallax damping
      rootGroup.rotation.y += (targetRotationY - rootGroup.rotation.y) * 0.05;
      rootGroup.rotation.x += (targetRotationX - rootGroup.rotation.x) * 0.05;

      // Subtle float oscillation
      const floatOffset = Math.sin(elapsed * 1.8) * 0.05;
      cardGroup.position.y = floatOffset;

      if (isRotatingRef.current) {
        const speed = prefersReducedMotion ? 0.15 : 1.0;
        rootGroup.rotation.y += 0.003 * speed;
        ring1.rotation.z += 0.005 * speed;
        ring2.rotation.z -= 0.004 * speed;
        particles.rotation.y -= 0.002 * speed;
      }

      // Sine wave dynamic card hover wave
      cardMeshes.forEach((mesh, idx) => {
        const wave = Math.sin(elapsed * 2.2 + idx * 0.9) * 0.03;
        mesh.position.y = (idx - 1.5) * 0.15 + wave;
      });

      renderer.render(scene, camera);
    };

    animate();

    const canvas = renderer.domElement;
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(animationFrameId);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost, false);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (observer) observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('webglcontextlost', handleContextLost);

      cardGeo.dispose();
      textures.forEach((t) => t.dispose());
      materials.forEach((m) => m.dispose());
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, [variant]);

  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-md border border-white/[0.08] shadow-2xl group ${className}`}
    >
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing min-h-[300px]" />

      {/* Atmospheric Top Glow */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-sky-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Interactive HUD Layer */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#090b11]/85 backdrop-blur-md border border-white/10 pointer-events-auto shadow-sm">
          <Code2 className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-mono text-[10px] text-sky-400 font-bold tracking-wider uppercase">
            3D Code Engine
          </span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setIsRotating((prev) => !prev)}
            className={`p-1.5 rounded-lg backdrop-blur-md transition-all text-xs border border-white/10 ${
              isRotating
                ? 'bg-sky-500/20 text-sky-400'
                : 'bg-[#090b11]/80 text-[#94a3b8] hover:text-[#e2e8f0]'
            }`}
            title={isRotating ? 'Pause rotation' : 'Resume rotation'}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Bottom Telemetry HUD */}
      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none text-[11px] font-mono">
        <span className="text-[#94a3b8] bg-[#090b11]/80 backdrop-blur px-2 py-0.5 rounded border border-white/10 flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-emerald-400" />
          <span>Interactive 3D Code Matrix</span>
        </span>
        <span className="text-emerald-400 bg-[#090b11]/80 backdrop-blur px-2 py-0.5 rounded border border-white/10 font-bold">
          60 FPS
        </span>
      </div>
    </div>
  );
};
