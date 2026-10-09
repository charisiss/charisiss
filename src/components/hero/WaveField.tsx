"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { AdditiveBlending, Color, Plane, Raycaster, Vector2, Vector3, type ShaderMaterial } from "three";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uMouse;
  uniform float uMouseStrength;
  uniform float uPixelRatio;
  uniform float uSize;

  varying float vElevation;
  varying float vDepth;
  varying float vGlow;

  void main() {
    vec3 p = position;
    float t = uTime * 0.35;

    float elevation =
      sin(p.x * 0.35 + t * 1.6) * 0.35 +
      sin(p.z * 0.55 + t * 1.1) * 0.25 +
      sin((p.x + p.z) * 0.22 + t * 0.8) * 0.4;

    float d = distance(p.xz, uMouse.xz);
    float ripple = exp(-d * d * 0.16) * uMouseStrength;
    elevation += ripple * (0.85 + 0.25 * sin(d * 3.0 - uTime * 3.0));

    p.y += elevation;

    vElevation = elevation;
    vGlow = ripple;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * uPixelRatio * (1.0 / -mvPosition.z) * (1.0 + ripple * 0.6);
    vDepth = -mvPosition.z;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying float vElevation;
  varying float vDepth;
  varying float vGlow;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;

    float soft = 1.0 - smoothstep(0.05, 0.5, r);
    float h = clamp(vElevation * 0.55 + 0.5, 0.0, 1.0);
    vec3 color = mix(uColorA, uColorB, h) + vGlow * 0.35;
    float fade = (1.0 - smoothstep(3.5, 17.0, vDepth)) * smoothstep(0.5, 2.5, vDepth);

    gl_FragColor = vec4(color, soft * fade * (0.6 + h * 0.7));
  }
`;

type WaveFieldProps = {
  columns: number;
  rows: number;
};

export function WaveField({ columns, rows }: WaveFieldProps) {
  const materialRef = useRef<ShaderMaterial>(null);
  const gl = useThree((state) => state.gl);
  const pointer = useRef({ ndc: new Vector2(0, 0), lastMove: -Infinity });
  const helpers = useMemo(
    () => ({
      raycaster: new Raycaster(),
      plane: new Plane(new Vector3(0, 1, 0), 0),
      hit: new Vector3(),
      target: new Vector3(0, 0, -2),
      lookAt: new Vector3(0, 0, -3),
    }),
    [],
  );

  const positions = useMemo(() => {
    const width = 24;
    const depth = 15;
    const data = new Float32Array(columns * rows * 3);
    let i = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        data[i++] = (col / (columns - 1) - 0.5) * width;
        data[i++] = 0;
        data[i++] = 2.5 - (row / (rows - 1)) * depth;
      }
    }
    return data;
  }, [columns, rows]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new Vector3(0, 0, -2) },
      uMouseStrength: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.75) },
      uSize: { value: 22 },
      uColorA: { value: new Color("#0b4f5a") },
      uColorB: { value: new Color("#00e5e5") },
    }),
    [gl],
  );

  useEffect(() => {
    function onMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      pointer.current.ndc.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
      );
      pointer.current.lastMove = performance.now();
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) return;
    const { camera } = state;
    const time = state.clock.elapsedTime;
    material.uniforms.uTime.value = time;

    const { raycaster, plane, hit, target, lookAt } = helpers;
    const idle = performance.now() - pointer.current.lastMove > 2500;

    if (idle) {
      target.set(Math.sin(time * 0.35) * 5, 0, -3 + Math.cos(time * 0.22) * 2);
    } else {
      raycaster.setFromCamera(pointer.current.ndc, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) target.copy(hit);
    }

    const ease = 1 - Math.exp(-delta * 4);
    material.uniforms.uMouse.value.lerp(target, ease);
    material.uniforms.uMouseStrength.value +=
      ((idle ? 0.55 : 1) - material.uniforms.uMouseStrength.value) * ease;

    const scroll = Math.min(window.scrollY / window.innerHeight, 1.2);
    const px = idle ? 0 : pointer.current.ndc.x * 0.4;
    camera.position.x += (px - camera.position.x) * ease;
    camera.position.y += (1.7 + scroll * 1.4 - camera.position.y) * ease;
    camera.lookAt(lookAt);
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
