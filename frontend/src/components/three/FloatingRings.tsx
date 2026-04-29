import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * FloatingRings
 * Decorative abstract rings that drift and rotate in 3D space.
 * Used to add depth to page backgrounds.
 */
export default function FloatingRings() {
  const groupRef = useRef<THREE.Group>(null);

  // Generate 5 decorative rings with varying properties
  const rings = useMemo(() => {
    return [
      { radius: 1.5, color: '#d4a017', opacity: 0.08, rotationSpeed: 0.005, axis: 'x' as const },
      { radius: 2.5, color: '#00c9a7', opacity: 0.06, rotationSpeed: 0.003, axis: 'y' as const },
      { radius: 3.5, color: '#d4a017', opacity: 0.08, rotationSpeed: 0.002, axis: 'z' as const },
      { radius: 4.0, color: '#00c9a7', opacity: 0.06, rotationSpeed: 0.004, axis: 'x' as const },
      { radius: 5.0, color: '#d4a017', opacity: 0.08, rotationSpeed: 0.001, axis: 'y' as const },
    ].map((r, i) => ({
      ...r,
      id: i,
      // Random initial tilt
      tilt: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number]
    }));
  }, []);

  const ringRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    ringRefs.current.forEach((ring, i) => {
      if (!ring) return;
      const config = rings[i];
      
      // Rotate based on config axis
      if (config.axis === 'x') ring.rotation.x += config.rotationSpeed;
      if (config.axis === 'y') ring.rotation.y += config.rotationSpeed;
      if (config.axis === 'z') ring.rotation.z += config.rotationSpeed;

      // Subtle positional drift
      ring.position.y = Math.sin(time * 0.2 + i) * 0.2;
      ring.position.x = Math.cos(time * 0.15 + i) * 0.1;
    });
  });

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh
          key={ring.id}
          ref={(el) => (ringRefs.current[i] = el)}
          rotation={ring.tilt}
        >
          <torusGeometry args={[ring.radius, 0.015, 16, 100]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={ring.opacity}
          />
        </mesh>
      ))}
    </group>
  );
}
