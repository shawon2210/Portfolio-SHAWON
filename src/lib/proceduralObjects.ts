/**
 * Procedural 3D Objects Generator for Shared Canvas
 * Creates code-generated 3D meshes for anchors:
 * a) Hero Centerpiece: Polyhedral wireframe/glass core + inner orb + orbiting ring
 * b) About Corners: Torus Knot, Gyroscope Rings, Instanced Cube Blocks, Morphing Noise Sphere
 * c) Contact Globe: Point-cloud globe with rotating lat/long rings
 */

import * as THREE from 'three';
import { THEME_COLORS, SYNTAX_PALETTE } from './tokens';

export interface ProceduralObjects {
  heroCore: THREE.Group;
  aboutTorusKnot: THREE.Mesh;
  aboutGyro: THREE.Group;
  aboutBlocks: THREE.InstancedMesh;
  aboutNoiseSphere: THREE.Mesh;
  contactGlobe: THREE.Group;
  dispose: () => void;
}

export function createProceduralObjects(): ProceduralObjects {
  // 1. Hero Centerpiece: Icosahedron wireframe + inner pulsating core + orbit ring
  const heroCore = new THREE.Group();

  const coreGeo = new THREE.IcosahedronGeometry(1.2, 1);
  const wireGeo = new THREE.WireframeGeometry(coreGeo);
  const coreMat = new THREE.LineBasicMaterial({
    color: new THREE.Color(THEME_COLORS.accent),
    transparent: true,
    opacity: 0.75,
  });
  const coreMesh = new THREE.LineSegments(wireGeo, coreMat);
  heroCore.add(coreMesh);

  // Inner orb
  const innerGeo = new THREE.OctahedronGeometry(0.55, 0);
  const innerMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(SYNTAX_PALETTE.emerald),
    wireframe: true,
    transparent: true,
    opacity: 0.5,
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  heroCore.add(innerMesh);

  // Orbiting ring
  const ringGeo = new THREE.TorusGeometry(1.65, 0.015, 8, 48);
  const ringMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(SYNTAX_PALETTE.sky),
    transparent: true,
    opacity: 0.4,
  });
  const orbitRing = new THREE.Mesh(ringGeo, ringMat);
  orbitRing.rotation.x = Math.PI / 3;
  heroCore.add(orbitRing);

  // 2. About Corner #1: Torus Knot
  const knotGeo = new THREE.TorusKnotGeometry(0.7, 0.18, 64, 12);
  const knotMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(SYNTAX_PALETTE.sky),
    wireframe: true,
    transparent: true,
    opacity: 0.65,
  });
  const aboutTorusKnot = new THREE.Mesh(knotGeo, knotMat);

  // 3. About Corner #2: Gyroscope Rings
  const aboutGyro = new THREE.Group();
  const gyroRing1Geo = new THREE.TorusGeometry(0.9, 0.02, 8, 40);
  const gyroRing1Mat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(SYNTAX_PALETTE.violet),
    transparent: true,
    opacity: 0.6,
  });
  const gyroRing1 = new THREE.Mesh(gyroRing1Geo, gyroRing1Mat);
  aboutGyro.add(gyroRing1);

  const gyroRing2Geo = new THREE.TorusGeometry(0.7, 0.02, 8, 40);
  const gyroRing2Mat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(SYNTAX_PALETTE.emerald),
    transparent: true,
    opacity: 0.6,
  });
  const gyroRing2 = new THREE.Mesh(gyroRing2Geo, gyroRing2Mat);
  gyroRing2.rotation.x = Math.PI / 2;
  aboutGyro.add(gyroRing2);

  const gyroRing3Geo = new THREE.TorusGeometry(0.5, 0.02, 8, 40);
  const gyroRing3Mat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(SYNTAX_PALETTE.amber),
    transparent: true,
    opacity: 0.6,
  });
  const gyroRing3 = new THREE.Mesh(gyroRing3Geo, gyroRing3Mat);
  gyroRing3.rotation.y = Math.PI / 2;
  aboutGyro.add(gyroRing3);

  // 4. About Corner #3: Instanced Cube Blocks Cluster
  const cubeCount = 27; // 3x3x3 grid
  const cubeGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
  const cubeMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(THEME_COLORS.accent),
    wireframe: true,
    transparent: true,
    opacity: 0.6,
  });
  const aboutBlocks = new THREE.InstancedMesh(cubeGeo, cubeMat, cubeCount);
  const blockDummy = new THREE.Object3D();
  let blockIdx = 0;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        blockDummy.position.set(x * 0.35, y * 0.35, z * 0.35);
        blockDummy.updateMatrix();
        aboutBlocks.setMatrixAt(blockIdx++, blockDummy.matrix);
      }
    }
  }
  aboutBlocks.instanceMatrix.needsUpdate = true;

  // 5. About Corner #4: Morphing Noise/Icosahedron Sphere
  const noiseSphereGeo = new THREE.IcosahedronGeometry(0.85, 2);
  const noiseSphereMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(SYNTAX_PALETTE.emerald),
    wireframe: true,
    transparent: true,
    opacity: 0.55,
  });
  const aboutNoiseSphere = new THREE.Mesh(noiseSphereGeo, noiseSphereMat);

  // 6. Contact: Point-cloud Globe with rotating meridian rings
  const contactGlobe = new THREE.Group();
  const globePointsCount = 260;
  const globePositions = new Float32Array(globePointsCount * 3);
  for (let i = 0; i < globePointsCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / globePointsCount);
    const theta = Math.sqrt(globePointsCount * Math.PI) * phi;
    const r = 1.1;
    globePositions[i * 3] = r * Math.cos(theta) * Math.sin(phi);
    globePositions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
    globePositions[i * 3 + 2] = r * Math.cos(phi);
  }
  const globePointsGeo = new THREE.BufferGeometry();
  globePointsGeo.setAttribute('position', new THREE.BufferAttribute(globePositions, 3));
  const globePointsMat = new THREE.PointsMaterial({
    color: new THREE.Color(THEME_COLORS.accent),
    size: 0.04,
    transparent: true,
    opacity: 0.8,
  });
  const globeCloud = new THREE.Points(globePointsGeo, globePointsMat);
  contactGlobe.add(globeCloud);

  const meridianGeo = new THREE.TorusGeometry(1.15, 0.008, 8, 48);
  const meridianMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(SYNTAX_PALETTE.violet),
    transparent: true,
    opacity: 0.35,
  });
  const meridian1 = new THREE.Mesh(meridianGeo, meridianMat);
  meridian1.rotation.y = Math.PI / 4;
  contactGlobe.add(meridian1);

  const meridian2 = new THREE.Mesh(meridianGeo, meridianMat);
  meridian2.rotation.y = -Math.PI / 4;
  contactGlobe.add(meridian2);

  const dispose = () => {
    coreGeo.dispose();
    wireGeo.dispose();
    coreMat.dispose();
    innerGeo.dispose();
    innerMat.dispose();
    ringGeo.dispose();
    ringMat.dispose();

    knotGeo.dispose();
    knotMat.dispose();

    gyroRing1Geo.dispose();
    gyroRing1Mat.dispose();
    gyroRing2Geo.dispose();
    gyroRing2Mat.dispose();
    gyroRing3Geo.dispose();
    gyroRing3Mat.dispose();

    cubeGeo.dispose();
    cubeMat.dispose();

    noiseSphereGeo.dispose();
    noiseSphereMat.dispose();

    globePointsGeo.dispose();
    globePointsMat.dispose();
    meridianGeo.dispose();
    meridianMat.dispose();
  };

  return {
    heroCore,
    aboutTorusKnot,
    aboutGyro,
    aboutBlocks,
    aboutNoiseSphere,
    contactGlobe,
    dispose,
  };
}
