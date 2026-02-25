import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* ── Neural Network Node Positions ── */
function generateNeuralNodes(layers: number[], radius: number) {
  const nodes: THREE.Vector3[] = [];
  const layerCount = layers.length;

  layers.forEach((count, layerIdx) => {
    const layerX = ((layerIdx / (layerCount - 1)) - 0.5) * radius * 2;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const layerRadius = radius * 0.6;
      const y = Math.cos(angle) * layerRadius;
      const z = Math.sin(angle) * layerRadius;
      nodes.push(new THREE.Vector3(layerX, y, z));
    }
  });
  return nodes;
}

/* ── Glowing Neural Nodes ── */
function NeuralNodes({ nodes }: { nodes: THREE.Vector3[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = nodes.length;

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    nodes.forEach((pos, i) => {
      const pulse = 0.04 + Math.sin(t * 2 + i * 0.5) * 0.015;
      dummy.position.copy(pos);
      dummy.scale.setScalar(pulse);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color="#00f0ff"
        emissive="#00c8ff"
        emissiveIntensity={2}
        transparent
        opacity={0.9}
      />
    </instancedMesh>
  );
}

/* ── Animated Synaptic Connections ── */
function Connections({ nodes, layers }: { nodes: THREE.Vector3[]; layers: number[] }) {
  const linesRef = useRef<THREE.Group>(null);

  const connections = useMemo(() => {
    const conns: [number, number][] = [];
    let offset = 0;
    for (let l = 0; l < layers.length - 1; l++) {
      const currCount = layers[l];
      const nextCount = layers[l + 1];
      const nextOffset = offset + currCount;
      for (let i = 0; i < currCount; i++) {
        for (let j = 0; j < nextCount; j++) {
          conns.push([offset + i, nextOffset + j]);
        }
      }
      offset += currCount;
    }
    return conns;
  }, [layers]);

  const lineGeometries = useMemo(() => {
    return connections.map(([a, b]) => {
      const geo = new THREE.BufferGeometry().setFromPoints([nodes[a], nodes[b]]);
      return geo;
    });
  }, [connections, nodes]);

  useFrame(({ clock }) => {
    if (!linesRef.current) return;
    const t = clock.getElapsedTime();
    linesRef.current.children.forEach((child, i) => {
      const mat = (child as THREE.Line).material as THREE.LineBasicMaterial;
      mat.opacity = 0.08 + Math.sin(t * 1.5 + i * 0.3) * 0.06;
    });
  });

  return (
    <group ref={linesRef}>
      {lineGeometries.map((geo, i) => (
        <line key={i} geometry={geo}>
          <lineBasicMaterial color="#00f0ff" transparent opacity={0.1} />
        </line>
      ))}
    </group>
  );
}

/* ── Data Flow Particles (traveling along connections) ── */
function DataFlowParticles({ nodes, layers }: { nodes: THREE.Vector3[]; layers: number[] }) {
  const count = 60;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const connections = useMemo(() => {
    const conns: [number, number][] = [];
    let offset = 0;
    for (let l = 0; l < layers.length - 1; l++) {
      const currCount = layers[l];
      const nextCount = layers[l + 1];
      const nextOffset = offset + currCount;
      for (let i = 0; i < currCount; i++) {
        for (let j = 0; j < nextCount; j++) {
          conns.push([offset + i, nextOffset + j]);
        }
      }
      offset += currCount;
    }
    return conns;
  }, [layers]);

  const particleData = useMemo(() => {
    return Array.from({ length: count }, () => ({
      connIdx: Math.floor(Math.random() * connections.length),
      speed: 0.3 + Math.random() * 0.6,
      offset: Math.random(),
    }));
  }, [connections.length, count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    particleData.forEach((p, i) => {
      const [a, b] = connections[p.connIdx];
      const progress = (t * p.speed + p.offset) % 1;
      const posA = nodes[a];
      const posB = nodes[b];
      dummy.position.lerpVectors(posA, posB, progress);
      dummy.scale.setScalar(0.018 + Math.sin(progress * Math.PI) * 0.01);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#88ddff" transparent opacity={0.8} />
    </instancedMesh>
  );
}

/* ── Floating Ambient Particles ── */
function AmbientParticles() {
  const count = 120;
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      speed: 0.1 + Math.random() * 0.3,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      dummy.position.set(
        p.position[0] + Math.sin(t * p.speed + p.offset) * 0.4,
        p.position[1] + Math.cos(t * p.speed + p.offset) * 0.4,
        p.position[2] + Math.sin(t * p.speed * 0.5) * 0.2
      );
      dummy.scale.setScalar(0.012 + Math.sin(t * 2 + i) * 0.005);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#00f0ff" transparent opacity={0.3} />
    </instancedMesh>
  );
}

/* ── Outer Wireframe Brain Shell ── */
function BrainShell() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.08;
    meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2.2, 1]} />
      <meshBasicMaterial
        color="#00f0ff"
        wireframe
        transparent
        opacity={0.04}
      />
    </mesh>
  );
}

/* ── Main Scene ── */
const LAYERS = [5, 8, 10, 8, 5];

export default function Scene3D() {
  const nodes = useMemo(() => generateNeuralNodes(LAYERS, 2), []);
  const groupRef = useRef<THREE.Group>(null);

  const handlePointerMove = useCallback((e: { clientX: number; clientY: number }) => {
    if (!groupRef.current) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 0.3;
    const y = (e.clientY / window.innerHeight - 0.5) * 0.3;
    groupRef.current.rotation.y = x;
    groupRef.current.rotation.x = -y;
  }, []);

  return (
    <div className="w-full h-full min-h-[400px]" onPointerMove={handlePointerMove}>
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#00f0ff" />
        <pointLight position={[-5, -3, 5]} intensity={0.6} color="#8855ff" />
        <pointLight position={[0, -5, 3]} intensity={0.3} color="#00ffaa" />

        <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.8}>
          <group ref={groupRef}>
            <NeuralNodes nodes={nodes} />
            <Connections nodes={nodes} layers={LAYERS} />
            <DataFlowParticles nodes={nodes} layers={LAYERS} />
            <BrainShell />
          </group>
        </Float>

        <AmbientParticles />
      </Canvas>
    </div>
  );
}
