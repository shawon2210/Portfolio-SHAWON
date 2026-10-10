import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause } from 'lucide-react';

interface TechCanvas3DProps {
  className?: string;
  variant?: 'hero' | 'compact';
}

export const TechCanvas3D: React.FC<TechCanvas3DProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [wireframeMode, setWireframeMode] = useState<'neural' | 'lattice' | 'particles'>('neural');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x10131a, 0.08);

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 240;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = variant === 'hero' ? 4.5 : 3.8;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // Group for all rotating elements
    const systemGroup = new THREE.Group();
    scene.add(systemGroup);

    // 1. Primary Polyhedral Wireframe Core
    const coreGeometry = new THREE.IcosahedronGeometry(1.2, 1);
    const wireframeGeometry = new THREE.WireframeGeometry(coreGeometry);
    const coreLineMaterial = new THREE.LineBasicMaterial({
      color: 0x4cd7f6,
      transparent: true,
      opacity: 0.65,
      linewidth: 1,
    });
    const coreMesh = new THREE.LineSegments(wireframeGeometry, coreLineMaterial);
    systemGroup.add(coreMesh);

    // 2. Vertex Nodes on Polyhedron
    const nodeGeometry = new THREE.SphereGeometry(0.045, 8, 8);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0x4edea3,
    });
    const nodeGroup = new THREE.Group();
    
    // Extract vertices from coreGeometry
    const posAttr = coreGeometry.attributes.position;
    const vertexSet = new Set<string>();
    for (let i = 0; i < posAttr.count; i++) {
      const x = Number(posAttr.getX(i).toFixed(3));
      const y = Number(posAttr.getY(i).toFixed(3));
      const z = Number(posAttr.getZ(i).toFixed(3));
      const key = `${x},${y},${z}`;
      if (!vertexSet.has(key)) {
        vertexSet.add(key);
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.set(x, y, z);
        nodeGroup.add(node);
      }
    }
    systemGroup.add(nodeGroup);

    // 3. Inner Pulsing Core
    const innerGeo = new THREE.OctahedronGeometry(0.55, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    systemGroup.add(innerMesh);

    // 4. Orbital Cybernetic Rings
    const ringGeo1 = new THREE.TorusGeometry(1.65, 0.015, 8, 48);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x4cd7f6,
      transparent: true,
      opacity: 0.35,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    systemGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(1.85, 0.012, 8, 48);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x4edea3,
      transparent: true,
      opacity: 0.3,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 5;
    systemGroup.add(ring2);

    // 5. Surrounding Floating Particle Constellation
    const particleCount = 140;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 1.6 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xadc6ff,
      size: 0.035,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    systemGroup.add(particles);

    // Interactive pointer tracking
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.8;
      targetRotationX = -y * 0.8;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const deltaX = touch.clientX - previousMousePosition.x;
        const deltaY = touch.clientY - previousMousePosition.y;
        systemGroup.rotation.y += deltaX * 0.01;
        systemGroup.rotation.x += deltaY * 0.01;
        previousMousePosition = { x: touch.clientX, y: touch.clientY };
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        previousMousePosition = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        systemGroup.rotation.y += deltaX * 0.01;
        systemGroup.rotation.x += deltaY * 0.01;
        previousMousePosition = { x: e.clientX, y: e.clientY };
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
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Damped mouse rotation
      systemGroup.rotation.y += (targetRotationY - systemGroup.rotation.y) * 0.05;
      systemGroup.rotation.x += (targetRotationX - systemGroup.rotation.x) * 0.05;

      // Constant gentle rotation if active
      if (isRotating) {
        systemGroup.rotation.y += 0.005;
        ring1.rotation.z += 0.008;
        ring2.rotation.z -= 0.006;
        particles.rotation.y -= 0.002;
      }

      // Gentle pulsating energy breathing
      const pulse = 1 + Math.sin(elapsedTime * 2.5) * 0.08;
      innerMesh.scale.set(pulse, pulse, pulse);
      innerMesh.rotation.y += 0.015;

      renderer.render(scene, camera);
    };

    animate();

    // Context loss listeners
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(animationFrameId);
    };
    const canvas = renderer.domElement;
    canvas.addEventListener('webglcontextlost', handleContextLost, false);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('webglcontextlost', handleContextLost);

      coreGeometry.dispose();
      wireframeGeometry.dispose();
      coreLineMaterial.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      innerGeo.dispose();
      innerMat.dispose();
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
  }, [isRotating, variant, wireframeMode]);

  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-gradient-to-b from-surface-container-high/80 to-surface-container-low/90 backdrop-blur-md border border-white/10 shadow-xl group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing min-h-[220px]" />

      {/* Atmospheric Top Glow */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />

      {/* Interactive HUD Layer (Layered DOM overlay per guidelines) */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md border border-white/5 pointer-events-auto shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          <span className="font-status-label text-[10px] text-primary uppercase font-bold tracking-wider">
            Spatial Architecture 3D
          </span>
        </div>

        <div className="flex items-center gap-1 pointer-events-auto">
          <button
            onClick={() => setIsRotating((prev) => !prev)}
            className={`p-1.5 rounded-lg backdrop-blur-md transition-all text-xs border border-white/5 ${
              isRotating
                ? 'bg-primary/20 text-primary'
                : 'bg-surface-container-lowest/80 text-on-surface-variant hover:text-on-surface'
            }`}
            title={isRotating ? 'Pause rotation' : 'Resume rotation'}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Bottom Telemetry HUD */}
      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none text-[11px] font-code-sm">
        <span className="text-on-surface-variant/80 bg-surface-container-lowest/70 backdrop-blur px-2 py-0.5 rounded border border-white/5">
          Drag to orbit · Real-time WebGL
        </span>
        <span className="text-secondary bg-surface-container-lowest/70 backdrop-blur px-2 py-0.5 rounded border border-white/5">
          60 FPS
        </span>
      </div>
    </div>
  );
};
