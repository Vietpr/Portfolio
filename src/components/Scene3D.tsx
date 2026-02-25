import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* ── Sacred Geometry Constants ── */
const PHI = (1 + Math.sqrt(5)) / 2; // Golden ratio
const TAU = Math.PI * 2;

/* ── Generate vertices for sacred geometry patterns ── */
function generateConstellationNodes() {
  const nodes: THREE.Vector3[] = [];

  // Inner ring: hexagram (Star of David / 六芒星)
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * TAU - Math.PI / 2;
    nodes.push(new THREE.Vector3(Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 0));
  }

  // Middle ring: dodecagon (12-sided) rotated
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * TAU + TAU / 24;
    const r = 2.2;
    nodes.push(new THREE.Vector3(Math.cos(angle) * r, Math.sin(angle) * r, Math.sin(angle * 2) * 0.3));
  }

  // Outer ring: 18 points (constellation boundary)
  for (let i = 0; i < 18; i++) {
    const angle = (i / 18) * TAU;
    const r = 3.2 + Math.sin(angle * 3) * 0.3;
    nodes.push(new THREE.Vector3(
      Math.cos(angle) * r,
      Math.sin(angle) * r,
      Math.cos(angle * 2) * 0.5
    ));
  }

  // Center node
  nodes.push(new THREE.Vector3(0, 0, 0));

  // Floating outer satellites
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * TAU + 0.2;
    const r = 4.2;
    nodes.push(new THREE.Vector3(
      Math.cos(angle) * r,
      Math.sin(angle) * r,
      Math.sin(angle * 3) * 0.8
    ));
  }

  return nodes;
}

/* ── Generate connections between nodes (sacred geometry lines) ── */
function generateConnections(nodeCount: number) {
  const connections: [number, number][] = [];

  // Inner hexagram: connect alternate vertices to form two triangles
  for (let i = 0; i < 6; i++) {
    connections.push([i, (i + 1) % 6]); // hexagon edges
    connections.push([i, (i + 2) % 6]); // star of david diagonals
  }

  // Inner to middle ring
  for (let i = 0; i < 6; i++) {
    connections.push([i, 6 + i * 2]);
    connections.push([i, 6 + (i * 2 + 1) % 12]);
  }

  // Middle ring connections
  for (let i = 0; i < 12; i++) {
    connections.push([6 + i, 6 + (i + 1) % 12]);
  }

  // Middle to outer
  for (let i = 0; i < 12; i++) {
    connections.push([6 + i, 18 + Math.floor(i * 1.5) % 18]);
  }

  // Outer ring partial connections (not all — for aesthetic)
  for (let i = 0; i < 18; i += 2) {
    connections.push([18 + i, 18 + (i + 2) % 18]);
    connections.push([18 + i, 18 + (i + 3) % 18]);
  }

  // Center to inner ring
  const centerIdx = 36;
  for (let i = 0; i < 6; i++) {
    connections.push([centerIdx, i]);
  }

  // Outer satellites to outer ring
  for (let i = 0; i < 8; i++) {
    const satIdx = 37 + i;
    const outerIdx = 18 + Math.floor(i * 2.25) % 18;
    connections.push([satIdx, outerIdx]);
    connections.push([satIdx, 18 + (Math.floor(i * 2.25) + 1) % 18]);
  }

  return connections.filter(([a, b]) => a < nodeCount && b < nodeCount);
}

/* ── Glowing Nodes ── */
function ConstellationNodes({ nodes }: { nodes: THREE.Vector3[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = nodes.length;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    nodes.forEach((pos, i) => {
      // Gentle floating motion
      const floatY = Math.sin(t * 0.5 + i * 0.7) * 0.05;
      const floatX = Math.cos(t * 0.3 + i * 1.1) * 0.03;
      dummy.position.set(pos.x + floatX, pos.y + floatY, pos.z);

      // Center node is larger, outer satellites pulse
      const isCenter = i === 36;
      const isSatellite = i >= 37;
      const baseScale = isCenter ? 0.06 : isSatellite ? 0.035 : 0.03;
      const pulse = Math.sin(t * 2 + i * 0.8) * 0.01;
      dummy.scale.setScalar(baseScale + pulse);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshStandardMaterial
        color="#00f0ff"
        emissive="#00c8ff"
        emissiveIntensity={3}
        transparent
        opacity={0.9}
      />
    </instancedMesh>
  );
}

/* ── Sacred Geometry Lines ── */
function ConstellationLines({
  nodes,
  connections,
}: {
  nodes: THREE.Vector3[];
  connections: [number, number][];
}) {
  const groupRef = useRef<THREE.Group>(null);

  const lineGeometries = useMemo(() => {
    return connections.map(([a, b]) => {
      return new THREE.BufferGeometry().setFromPoints([nodes[a], nodes[b]]);
    });
  }, [connections, nodes]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const mat = (child as THREE.Line).material as THREE.LineBasicMaterial;
      const dist = (connections[i]?.[0] ?? 0) / 10;
      mat.opacity = 0.06 + Math.sin(t * 1.2 + dist * 2) * 0.04;
    });
  });

  // Build line objects imperatively to avoid SVG <line> conflict
  const lines = useMemo(() => {
    return lineGeometries.map((geo) => {
      const mat = new THREE.LineBasicMaterial({ color: "#00f0ff", transparent: true, opacity: 0.08 });
      return new THREE.Line(geo, mat);
    });
  }, [lineGeometries]);

  return (
    <group ref={groupRef}>
      {lines.map((lineObj, i) => (
        <primitive key={i} object={lineObj} />
      ))}
    </group>
  );
}

/* ── Energy Flow Particles (traveling sacred paths) ── */
function EnergyParticles({
  nodes,
  connections,
}: {
  nodes: THREE.Vector3[];
  connections: [number, number][];
}) {
  const count = 40;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particleData = useMemo(() => {
    return Array.from({ length: count }, () => ({
      connIdx: Math.floor(Math.random() * connections.length),
      speed: 0.2 + Math.random() * 0.5,
      offset: Math.random(),
    }));
  }, [connections.length]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    particleData.forEach((p, i) => {
      const [a, b] = connections[p.connIdx];
      if (!nodes[a] || !nodes[b]) return;
      const progress = (t * p.speed + p.offset) % 1;
      dummy.position.lerpVectors(nodes[a], nodes[b], progress);
      dummy.scale.setScalar(0.015 + Math.sin(progress * Math.PI) * 0.008);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#88ddff" transparent opacity={0.7} />
    </instancedMesh>
  );
}

/* ── Ambient Star Dust ── */
function StarDust() {
  const count = 80;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      pos: [
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 6,
      ] as [number, number, number],
      speed: 0.05 + Math.random() * 0.15,
      offset: Math.random() * TAU,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      dummy.position.set(
        p.pos[0] + Math.sin(t * p.speed + p.offset) * 0.2,
        p.pos[1] + Math.cos(t * p.speed + p.offset) * 0.2,
        p.pos[2]
      );
      dummy.scale.setScalar(0.008 + Math.sin(t * 3 + i * 1.5) * 0.004);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#00f0ff" transparent opacity={0.2} />
    </instancedMesh>
  );
}

/* ── Outer Geometry Rings ── */
function GeometryRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.04;
      ring1Ref.current.rotation.x = Math.sin(t * 0.02) * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.03;
      ring2Ref.current.rotation.y = Math.cos(t * 0.025) * 0.1;
    }
  });

  return (
    <>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3.8, 0.005, 8, 64]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.08} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[4.5, 0.004, 8, 48]} />
        <meshBasicMaterial color="#8855ff" transparent opacity={0.05} />
      </mesh>
    </>
  );
}

/* ── Mouse Parallax Controller ── */
function ParallaxController({ groupRef }: { groupRef: React.RefObject<THREE.Group> }) {
  const { mouse } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    // Smooth parallax rotation based on mouse position
    groupRef.current.rotation.y += (mouse.x * 0.15 - groupRef.current.rotation.y) * 0.03;
    groupRef.current.rotation.x += (-mouse.y * 0.1 - groupRef.current.rotation.x) * 0.03;
  });

  return null;
}

/* ── Main Scene ── */
export default function Scene3D() {
  const nodes = useMemo(() => generateConstellationNodes(), []);
  const connections = useMemo(() => generateConnections(nodes.length), [nodes.length]);
  const groupRef = useRef<THREE.Group>(null!);

  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.15} />
        <pointLight position={[4, 4, 6]} intensity={0.8} color="#00f0ff" />
        <pointLight position={[-4, -3, 5]} intensity={0.5} color="#8855ff" />
        <pointLight position={[0, -5, 3]} intensity={0.2} color="#00ffaa" />

        <Float speed={0.8} rotationIntensity={0.08} floatIntensity={0.3}>
          <group ref={groupRef}>
            <ConstellationNodes nodes={nodes} />
            <ConstellationLines nodes={nodes} connections={connections} />
            <EnergyParticles nodes={nodes} connections={connections} />
            <GeometryRings />
          </group>
        </Float>

        <StarDust />
        <ParallaxController groupRef={groupRef} />
      </Canvas>
    </div>
  );
}
