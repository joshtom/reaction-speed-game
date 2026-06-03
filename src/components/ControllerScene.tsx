import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Environment, Float, Html, OrbitControls, PerspectiveCamera, Text, useGLTF } from "@react-three/drei";
import { Box3, DoubleSide, Group, Material, Mesh, MeshStandardMaterial, Object3D, Vector3 } from "three";
import { Gamepad2 } from "lucide-react";
import { COLORS, FACE_BUTTONS } from "../constants";
import type { FaceButton, PromptDisplay, PromptMode } from "../types";

type ControllerSceneProps = {
  prompt: PromptDisplay | null;
  mode: PromptMode;
};

export function ControllerScene({ prompt, mode }: ControllerSceneProps) {
  return (
    <Canvas className="scene-canvas" shadows dpr={[1, 1.7]}>
      <PerspectiveCamera makeDefault position={[0, 1.15, 5.4]} fov={34} />
      <ambientLight intensity={0.72} />
      <spotLight position={[2.8, 4.8, 4.8]} angle={0.48} penumbra={0.55} intensity={5.8} castShadow />
      <pointLight position={[-3, 1.4, 2.5]} intensity={2.1} color={COLORS.cross} />
      <Suspense fallback={<Html center><Gamepad2 size={50} /></Html>}>
        <Environment preset="city" />
        <Float speed={1.15} rotationIntensity={0.04} floatIntensity={0.12}>
          <ControllerModel prompt={prompt} mode={mode} />
        </Float>
      </Suspense>
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={0.82}
        maxPolarAngle={2.12}
        target={[0, 0.3, 0]}
      />
    </Canvas>
  );
}

function ControllerModel({ prompt, mode }: ControllerSceneProps) {
  const { scene } = useGLTF("/models/dualshock.glb");
  const { model, modelPosition, modelScale } = useMemo(() => normalizeModel(scene), [scene]);
  const activeButton = mode === "live" && prompt?.id !== undefined
    ? FACE_BUTTONS.find((button) => button.id === prompt.id) ?? null
    : null;

  return (
    <group position={[0, 0.34, 0]} rotation={[-0.08, 0, 0]}>
      <group rotation={[0, Math.PI, 0]}>
        <primitive object={model} position={modelPosition} scale={modelScale} />
      </group>
      {activeButton && <ButtonHighlight button={activeButton} />}
    </group>
  );
}

function ButtonHighlight({ button }: { button: FaceButton }) {
  const group = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 8) * 0.12;
    group.current.scale.setScalar(pulse);
  });

  return (
    <group ref={group} position={button.modelPosition}>
      <Billboard>
        <mesh renderOrder={5}>
          <ringGeometry args={[0.11, 0.17, 48]} />
          <meshBasicMaterial color={button.color} transparent opacity={0.95} depthTest={false} />
        </mesh>
        <mesh renderOrder={4}>
          <circleGeometry args={[0.18, 48]} />
          <meshBasicMaterial color={button.color} transparent opacity={0.22} depthTest={false} />
        </mesh>
        <Text position={[0, 0, 0.01]} fontSize={0.105} color={COLORS.white} anchorX="center" anchorY="middle" renderOrder={6}>
          {button.symbol}
        </Text>
      </Billboard>
    </group>
  );
}

function normalizeModel(scene: Object3D): { model: Object3D; modelPosition: [number, number, number]; modelScale: number } {
  const cloned = scene.clone(true);
  cloned.traverse((child) => {
    if (!(child instanceof Mesh)) return;

    child.castShadow = true;
    child.receiveShadow = true;
    const usesMaterialArray = Array.isArray(child.material);
    const materials = usesMaterialArray ? child.material : [child.material];
    const solidMaterials = materials.map((material: Material) => solidifyMaterial(material));
    child.material = usesMaterialArray ? solidMaterials : solidMaterials[0];
    child.frustumCulled = false;
  });

  const bounds = new Box3().setFromObject(cloned);
  const center = bounds.getCenter(new Vector3());
  const size = bounds.getSize(new Vector3());
  const scale = 2.72 / Math.max(size.x, size.y, size.z);

  return {
    model: cloned,
    modelPosition: [-center.x * scale, -center.y * scale, -center.z * scale],
    modelScale: scale
  };
}

function solidifyMaterial(material: Material | undefined): Material {
  if (!material) {
    return new MeshStandardMaterial({ color: COLORS.modelFallback, roughness: 0.58, metalness: 0.12, side: DoubleSide });
  }

  const clone = material.clone();
  clone.transparent = false;
  clone.opacity = 1;
  clone.alphaTest = 0;
  clone.depthWrite = true;
  clone.depthTest = true;
  clone.side = DoubleSide;
  clone.toneMapped = true;

  if (clone instanceof MeshStandardMaterial) {
    clone.roughness = Math.min(clone.roughness ?? 0.58, 0.74);
    clone.metalness = Math.max(clone.metalness ?? 0.08, 0.1);
    if (clone.map) {
      clone.map.flipY = false;
      clone.map.needsUpdate = true;
    }
    clone.alphaMap = null;
  }

  clone.needsUpdate = true;
  return clone;
}

useGLTF.preload("/models/dualshock.glb");
