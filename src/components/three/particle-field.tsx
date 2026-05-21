"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function seededUnit(index: number, seed: number) {
  const x = Math.sin(index * 12.9898 + seed) * 43758.5453;
  return x - Math.floor(x);
}

function Particles({ count = 1500, color = "#6366f1" }: { count?: number; color?: string }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Deterministic pseudo-random distribution to keep renders pure.
      arr[i * 3 + 0] = (seededUnit(i, 1.23) - 0.5) * 12;
      arr[i * 3 + 1] = (seededUnit(i, 4.56) - 0.5) * 6;
      arr[i * 3 + 2] = (seededUnit(i, 7.89) - 0.5) * 6;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.04;
    ref.current.rotation.x += delta * 0.01;
    // Subtle parallax following mouse
    const { x, y } = state.pointer;
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, x * 0.3, 0.05);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, y * 0.2, 0.05);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color={color}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticleField({ accent }: { accent: string }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
    >
      <Particles color={accent} />
    </Canvas>
  );
}
