"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type Variant = "observatory" | "nebula" | "midway" | "render" | "portal";

const PALETTE: Record<Variant, { a: string; b: string; c: string }> = {
  observatory: { a: "#ffc857", b: "#7c8cff", c: "#eef0ff" },
  nebula: { a: "#3dffc0", b: "#ff5fd2", c: "#e9fff9" },
  midway: { a: "#ff4d6d", b: "#ffd23f", c: "#fff6e8" },
  render: { a: "#ff7a1a", b: "#b8c4d6", c: "#f4f4f6" },
  portal: { a: "#c58bff", b: "#5fe3a1", c: "#f4eeff" },
};

/** Soft round sprite so points render as glowing dots instead of squares. */
function useDotTexture() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d");
    if (ctx) {
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.35, "rgba(255,255,255,0.8)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
    }
    return new THREE.CanvasTexture(c);
  }, []);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

/** Pointer position in -1..1, shared by every scene for parallax steering. */
function useParallax(group: React.RefObject<THREE.Group | null>, strength = 0.35) {
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, state.pointer.x * strength, 6, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * strength * 0.7, 6, dt);
  });
}

function Stars({ count, color, spread = 40 }: { count: number; color: string; spread?: number }) {
  const ref = useRef<THREE.Points>(null);
  const boost = useRef(0);
  const dot = useDotTexture();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * spread * 2;
      arr[i * 3 + 1] = (Math.random() - 0.5) * spread;
      arr[i * 3 + 2] = (Math.random() - 0.5) * spread * 1.5 - 8;
    }
    return arr;
  }, [count, spread]);
  // The shell fires "park:warp" on every route change; stars spin up, then settle.
  useEffect(() => {
    const h = () => {
      boost.current = 1;
    };
    window.addEventListener("park:warp", h);
    return () => window.removeEventListener("park:warp", h);
  }, []);
  useFrame((_, dt) => {
    if (!ref.current) return;
    boost.current = Math.max(0, boost.current - dt * 0.8);
    ref.current.rotation.y += dt * (0.012 + boost.current * boost.current * 0.9);
    ref.current.position.z = boost.current * 3;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.14} map={dot} color={color} sizeAttenuation transparent opacity={0.85} depthWrite={false} />
    </points>
  );
}

/** A small body on a tilted circular orbit, with a faint guide ring. */
function Orbiter({
  radius, speed, phase, tilt, size, color,
}: { radius: number; speed: number; phase: number; tilt: number; size: number; color: string }) {
  const body = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!body.current) return;
    const t = s.clock.elapsedTime * speed + phase;
    body.current.position.set(Math.cos(t) * radius, 0, Math.sin(t) * radius);
  });
  return (
    <group rotation={[tilt, 0, tilt * 0.6]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.012, 6, 96]} />
        <meshBasicMaterial color={color} transparent opacity={0.22} />
      </mesh>
      <mesh ref={body}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

function Observatory({ n }: { n: number }) {
  const g = useRef<THREE.Group>(null);
  const planet = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const moon = useRef<THREE.Mesh>(null);
  const p = PALETTE.observatory;
  useParallax(g);
  useFrame((s, dt) => {
    if (planet.current) planet.current.rotation.y += dt * 0.08;
    if (ring.current) ring.current.rotation.z += dt * 0.03;
    if (moon.current) {
      const t = s.clock.elapsedTime * 0.3;
      moon.current.position.set(Math.cos(t) * 4.2, Math.sin(t * 0.7) * 0.6, Math.sin(t) * 4.2);
    }
  });
  return (
    <group ref={g}>
      <Stars count={n} color={p.c} />
      <group position={[5, 1.2, -6]} rotation={[0.5, 0, -0.35]}>
        <mesh ref={planet}>
          <icosahedronGeometry args={[2.2, 2]} />
          <meshStandardMaterial color={p.b} flatShading roughness={0.6} />
        </mesh>
        <mesh ref={ring} rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[3.6, 0.07, 8, 96]} />
          <meshStandardMaterial color={p.a} emissive={p.a} emissiveIntensity={0.6} />
        </mesh>
        <mesh ref={moon}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color={p.a} emissive={p.a} emissiveIntensity={0.5} />
        </mesh>
        {/* One orbiter per destination, in that destination's accent color. */}
        <Orbiter radius={5.4} speed={0.22} phase={0} tilt={0.35} size={0.22} color={PALETTE.nebula.a} />
        <Orbiter radius={6.6} speed={0.15} phase={2.1} tilt={-0.25} size={0.26} color={PALETTE.midway.a} />
        <Orbiter radius={7.8} speed={0.1} phase={4.2} tilt={0.15} size={0.3} color={PALETTE.render.a} />
      </group>
    </group>
  );
}

function Nebula({ n }: { n: number }) {
  const g = useRef<THREE.Group>(null);
  const p = PALETTE.nebula;
  useParallax(g, 0.35);
  const nodeCount = Math.min(46, Math.floor(n / 14));
  const { pos, lines, edges } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      pts.push(new THREE.Vector3((Math.random() - 0.5) * 22, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 10 - 6));
    }
    const seg: number[] = [];
    const ed: [number, number][] = [];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < 5.2) {
          seg.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
          ed.push([i, j]);
        }
      }
    }
    return { pos: pts, lines: new Float32Array(seg), edges: ed };
  }, [nodeCount]);

  // Signals: bright dots that travel along random connections.
  const signalCount = Math.min(28, Math.floor(nodeCount * 0.6));
  const signals = useMemo(
    () => ({
      buf: new Float32Array(signalCount * 3),
      state: Array.from({ length: signalCount }, () => ({
        e: Math.floor(Math.random() * Math.max(1, edges.length)),
        t: Math.random(),
        v: 0.25 + Math.random() * 0.45,
        rev: Math.random() < 0.5,
      })),
    }),
    [signalCount, edges.length],
  );
  const sigPoints = useRef<THREE.Points>(null);
  const dot = useDotTexture();
  const nodes = useRef<THREE.Group>(null);
  useFrame((s, dt) => {
    if (nodes.current) {
      nodes.current.children.forEach((c, i) => {
        c.scale.setScalar(1 + Math.sin(s.clock.elapsedTime * 1.1 + i) * 0.25);
      });
    }
    if (g.current) g.current.position.y = Math.sin(s.clock.elapsedTime * 0.2) * 0.2;
    if (!sigPoints.current || edges.length === 0) return;
    signals.state.forEach((st, k) => {
      st.t += dt * st.v * 0.6;
      if (st.t >= 1) {
        st.t = 0;
        st.e = Math.floor(Math.random() * edges.length);
        st.rev = Math.random() < 0.5;
      }
      const [i, j] = edges[st.e];
      const a = st.rev ? pos[j] : pos[i];
      const b = st.rev ? pos[i] : pos[j];
      signals.buf[k * 3] = a.x + (b.x - a.x) * st.t;
      signals.buf[k * 3 + 1] = a.y + (b.y - a.y) * st.t;
      signals.buf[k * 3 + 2] = a.z + (b.z - a.z) * st.t;
    });
    sigPoints.current.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <group ref={g}>
      <Stars count={Math.floor(n / 2)} color={p.c} />
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={p.a} transparent opacity={0.28} />
      </lineSegments>
      <points ref={sigPoints}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[signals.buf, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.5} map={dot} color="#ffffff" sizeAttenuation transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <group ref={nodes}>
        {pos.map((v, i) => (
          <mesh key={i} position={v}>
            <sphereGeometry args={[0.16, 10, 10]} />
            <meshBasicMaterial color={i % 4 === 0 ? p.b : p.a} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Midway({ n }: { n: number }) {
  const g = useRef<THREE.Group>(null);
  const wheel = useRef<THREE.Group>(null);
  const cubes = useRef<THREE.InstancedMesh>(null);
  const p = PALETTE.midway;
  useParallax(g, 0.3);
  const cols = 14;
  const rows = 8;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorA = useMemo(() => new THREE.Color(p.a), [p.a]);
  const colorB = useMemo(() => new THREE.Color(p.b), [p.b]);
  useFrame((s, dt) => {
    if (wheel.current) wheel.current.rotation.z += dt * 0.12;
    if (cubes.current) {
      let i = 0;
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          const h = 0.4 + (Math.sin(s.clock.elapsedTime * 0.8 + x * 0.6 + y * 0.9) + 1) * 0.5;
          dummy.position.set((x - cols / 2) * 1.1, -4.5 + h / 2, -14 + y * 1.2);
          dummy.scale.set(0.8, h, 0.8);
          dummy.updateMatrix();
          cubes.current.setMatrixAt(i, dummy.matrix);
          cubes.current.setColorAt(i, (x + y) % 2 ? colorA : colorB);
          i++;
        }
      }
      cubes.current.instanceMatrix.needsUpdate = true;
      if (cubes.current.instanceColor) cubes.current.instanceColor.needsUpdate = true;
    }
  });
  const spokes = 12;
  return (
    <group ref={g}>
      <Stars count={Math.floor(n / 2)} color={p.c} />
      <instancedMesh ref={cubes} args={[undefined, undefined, cols * rows]}>
        <boxGeometry />
        <meshStandardMaterial roughness={0.5} />
      </instancedMesh>
      <group ref={wheel} position={[5.5, 1.5, -9]}>
        <mesh>
          <torusGeometry args={[3.2, 0.08, 8, 64]} />
          <meshStandardMaterial color={p.b} emissive={p.b} emissiveIntensity={0.5} />
        </mesh>
        {Array.from({ length: spokes }).map((_, i) => {
          const a = (i / spokes) * Math.PI * 2;
          return (
            <group key={i} rotation={[0, 0, a]}>
              <mesh position={[1.6, 0, 0]}>
                <boxGeometry args={[3.2, 0.03, 0.03]} />
                <meshBasicMaterial color={p.c} transparent opacity={0.5} />
              </mesh>
              <mesh position={[3.2, 0, 0]}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color={p.a} emissive={p.a} emissiveIntensity={0.4} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

function RenderDim({ n }: { n: number }) {
  const g = useRef<THREE.Group>(null);
  const knot = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.Mesh>(null);
  const p = PALETTE.render;
  useParallax(g, 0.4);
  useFrame((_, dt) => {
    if (knot.current) knot.current.rotation.y += dt * 0.18;
    if (wire.current) {
      wire.current.rotation.y -= dt * 0.12;
      wire.current.rotation.x += dt * 0.06;
    }
  });
  return (
    <group ref={g}>
      <Stars count={Math.floor(n / 3)} color={p.c} />
      <group position={[4.8, 0.6, -6]}>
        <mesh ref={knot}>
          <torusKnotGeometry args={[1.6, 0.5, 160, 24]} />
          <meshStandardMaterial color={p.a} metalness={0.6} roughness={0.25} />
        </mesh>
        <mesh ref={wire} scale={1.35}>
          <icosahedronGeometry args={[2.6, 1]} />
          <meshBasicMaterial color={p.b} wireframe transparent opacity={0.35} />
        </mesh>
      </group>
      <gridHelper args={[60, 60, p.b, "#33333a"]} position={[0, -4.5, -10]} />
    </group>
  );
}

function Portal({ n }: { n: number }) {
  const g = useRef<THREE.Group>(null);
  const orbs = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const count = 12;
  const curPos = useRef<Float32Array>(new Float32Array(count * 3));
  const p = PALETTE.portal;
  useParallax(g, 0.3);
  const basePositions = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < count; i++) {
      arr.push(
        (Math.random() - 0.5) * 26,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 20 - 6
      );
    }
    return arr;
  }, [count]);
  const speeds = useMemo(() => {
    return Array.from({ length: count }, () => 0.15 + Math.random() * 0.25);
  }, [count]);
  const phases = useMemo(() => {
    return Array.from({ length: count }, () => Math.random() * Math.PI * 2);
  }, [count]);
  // Constellation edges between spheres that start close to each other
  const edges = useMemo(() => {
    const seg: number[] = [];
    const ed: [number, number][] = [];
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      pts.push(
        new THREE.Vector3(
          basePositions[i * 3],
          basePositions[i * 3 + 1],
          basePositions[i * 3 + 2]
        )
      );
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < 14) {
          seg.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
          ed.push([i, j]);
        }
      }
    }
    return { seg: new Float32Array(seg), ed };
  }, [count]);
  useFrame((s, dt) => {
    if (!orbs.current || !linesRef.current) return;
    const t = s.clock.elapsedTime;
    const pulse = 0.15 + Math.sin(t * 1.5) * 0.1;
    (linesRef.current.material as THREE.LineBasicMaterial).opacity = pulse;
    const lineBuf = linesRef.current.geometry.attributes.position
      .array as Float32Array;
    orbs.current.children.forEach((c, i) => {
      const tt = t * speeds[i] + phases[i];
      const x = basePositions[i * 3] + Math.cos(tt * 0.5) * 1.2;
      const y = basePositions[i * 3 + 1] + Math.sin(tt * 0.4) * 1.0;
      const z = basePositions[i * 3 + 2] + Math.sin(tt * 0.7) * 1.5;
      curPos.current[i * 3] = x;
      curPos.current[i * 3 + 1] = y;
      curPos.current[i * 3 + 2] = z;
      c.position.set(x, y, z);
      c.rotation.y += dt * 0.15;
      c.rotation.x += dt * 0.1;
      const m = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
      m.opacity = 0.45 + Math.sin(tt) * 0.25;
    });
    edges.ed.forEach(([a, b], k) => {
      lineBuf[k * 6] = curPos.current[a * 3];
      lineBuf[k * 6 + 1] = curPos.current[a * 3 + 1];
      lineBuf[k * 6 + 2] = curPos.current[a * 3 + 2];
      lineBuf[k * 6 + 3] = curPos.current[b * 3];
      lineBuf[k * 6 + 4] = curPos.current[b * 3 + 1];
      lineBuf[k * 6 + 5] = curPos.current[b * 3 + 2];
    });
    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <group ref={g}>
      <Stars count={Math.floor(n / 2)} color={p.c} />
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edges.seg, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={p.a} transparent opacity={0.25} />
      </lineSegments>
      <group ref={orbs} position={[0, 0, -8]}>
        {basePositions.map((_, i) => {
          if (i % 3 !== 0) return null;
          return (
            <mesh key={i / 3} position={[basePositions[i], basePositions[i + 1], basePositions[i + 2]]}>
              <icosahedronGeometry args={[0.7, 3]} />
              <meshBasicMaterial color={(i / 3) % 2 === 0 ? p.a : p.b} transparent opacity={0.5} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

export default function Scene({ variant, lite }: { variant: Variant; lite: boolean }) {
  const n = lite ? 500 : 1600;
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 55 }}
      dpr={lite ? [1, 1.25] : [1, 1.75]}
      gl={{ antialias: !lite, powerPreference: "low-power", alpha: true }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 8, 6]} intensity={1.4} />
      <pointLight position={[-8, -4, 4]} intensity={20} color={PALETTE[variant].a} />
      {variant === "observatory" && <Observatory n={n} />}
      {variant === "nebula" && <Nebula n={n} />}
      {variant === "midway" && <Midway n={n} />}
      {variant === "render" && <RenderDim n={n} />}
      {variant === "portal" && <Portal n={n} />}
    </Canvas>
  );
}
