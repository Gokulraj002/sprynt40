"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// Three.js materials need real color values, not CSS custom properties.
const MUTED_GREY = "#a1a1aa"; // zinc-400 — visible on the light hero
const ACCENT_ORANGE = "#f97316";
const ACCENT_RATIO = 0.08;

const POINT_COUNT = 3600;
const OVERSCAN = 1.2;
const DEPTH_HALF = 1.5;

const MOUSE_LERP = 0.06;

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/**
 * Precomputes a scattered point cloud plus, per point, an "affinity" toward a
 * horizontal waveform band positioned across the middle-right of the
 * viewport. High-affinity points (mostly on the right, near the band's
 * height) settle into the wave; low-affinity points keep drifting as noise —
 * "noise becoming signal".
 */
function SignalPoints() {
  const pointsRef = useRef<THREE.Points>(null!);
  const mouse = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const field = useMemo(() => {
    const halfW = (viewport.width * OVERSCAN) / 2;
    const halfH = (viewport.height * OVERSCAN) / 2;
    const bandCenterY = halfH * 0.03;
    const waveAmplitude = halfH * 0.22;
    const waveFreq = (Math.PI * 2 * 1.4) / (halfW * 2 || 1);
    const repelRadius = Math.max(Math.min(halfW, halfH) * 0.3, 0.6);
    const repelStrength = repelRadius * 0.9;

    const positions = new Float32Array(POINT_COUNT * 3);
    const colors = new Float32Array(POINT_COUNT * 3);
    const basePositions = new Float32Array(POINT_COUNT * 3);
    const affinities = new Float32Array(POINT_COUNT);
    const seeds = new Float32Array(POINT_COUNT);

    const grey = new THREE.Color(MUTED_GREY);
    const accent = new THREE.Color(ACCENT_ORANGE);
    const random = seededRandom(42);

    for (let i = 0; i < POINT_COUNT; i++) {
      const i3 = i * 3;
      const bx = (random() * 2 - 1) * halfW;
      const by = (random() * 2 - 1) * halfH;
      const bz = (random() * 2 - 1) * DEPTH_HALF;

      basePositions[i3] = bx;
      basePositions[i3 + 1] = by;
      basePositions[i3 + 2] = bz;
      positions[i3] = bx;
      positions[i3 + 1] = by;
      positions[i3 + 2] = bz;

      seeds[i] = random() * Math.PI * 2;

      // Rightward points, and points already near the band's height, are
      // more likely to be "captured" into the signal — with randomness so
      // the boundary reads as organic rather than a hard cutoff.
      const xNorm = THREE.MathUtils.clamp((bx + halfW * 0.15) / (halfW * 1.15), 0, 1);
      const yDist = Math.abs(by - bandCenterY) / halfH;
      const proximity = Math.max(0, 1 - yDist * 1.2);
      const affinity = xNorm * (0.35 + 0.65 * proximity) * (0.5 + 0.5 * random());
      affinities[i] = Math.min(affinity, 0.85);

      const color = random() < ACCENT_RATIO ? accent : grey;
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    return {
      positions,
      colors,
      basePositions,
      affinities,
      seeds,
      bandCenterY,
      waveAmplitude,
      waveFreq,
      repelRadius,
      repelStrength,
    };
  }, [viewport.width, viewport.height]);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;

    const posAttr = points.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const t = state.clock.elapsedTime;

    const {
      basePositions,
      affinities,
      seeds,
      bandCenterY,
      waveAmplitude,
      waveFreq,
      repelRadius,
      repelStrength,
    } = field;

    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, state.pointer.x, MOUSE_LERP);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, state.pointer.y, MOUSE_LERP);
    const mouseWorldX = mouse.current.x * viewport.width * 0.5;
    const mouseWorldY = mouse.current.y * viewport.height * 0.5;
    const repelRadiusSq = repelRadius * repelRadius;

    for (let i = 0; i < POINT_COUNT; i++) {
      const i3 = i * 3;
      const bx = basePositions[i3];
      const by = basePositions[i3 + 1];
      const bz = basePositions[i3 + 2];
      const seed = seeds[i];
      const affinity = affinities[i];
      const driftFactor = 1 - affinity;

      // Cheap pseudo curl-noise: cross-mixed sin/cos of position + time
      // instead of a real curl-noise field — visually similar drift, far
      // cheaper per point.
      const driftX = Math.sin(by * 0.6 + t * 0.22 + seed) * Math.cos(bz * 0.4 + t * 0.14) * 0.35;
      const driftY = Math.cos(bx * 0.5 - t * 0.18 + seed) * Math.sin(bz * 0.6 + t * 0.16) * 0.3;
      const driftZ = Math.sin(bx * 0.3 + by * 0.3 + t * 0.1 + seed) * 0.22;

      const waveY = bandCenterY + Math.sin(bx * waveFreq + t * 0.5 + seed * 0.5) * waveAmplitude;

      let px = bx + driftX * driftFactor;
      let py = THREE.MathUtils.lerp(by + driftY, waveY, affinity);
      const pz = (bz + driftZ) * (1 - affinity * 0.6);

      const dx = px - mouseWorldX;
      const dy = py - mouseWorldY;
      const distSq = dx * dx + dy * dy;
      if (distSq < repelRadiusSq && distSq > 0.0001) {
        const dist = Math.sqrt(distSq);
        const force = (1 - dist / repelRadius) * repelStrength;
        px += (dx / dist) * force;
        py += (dy / dist) * force;
      }

      arr[i3] = px;
      arr[i3 + 1] = py;
      arr[i3 + 2] = pz;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[field.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[field.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        sizeAttenuation={false}
        vertexColors
        transparent
        opacity={0.75}
        blending={THREE.NormalBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

export default function SignalField() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: false, alpha: true }}
      camera={{ position: [0, 0, 6], fov: 50, near: 0.1, far: 20 }}
    >
      <SignalPoints />
    </Canvas>
  );
}
