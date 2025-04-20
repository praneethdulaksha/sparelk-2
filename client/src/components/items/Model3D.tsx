import { OrbitControls, PresentationControls, Stage, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

export default function Model3D() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 3.5], fov: 50 }}
      className="w-full h-full"
    >
      {/* <color attach="background" args={["#ffffff"]} /> */}
      <PresentationControls
        global
        speed={1.5}
        zoom={0.2}
        // polar={[-0.4, 0.2]}
      >
        <Stage
          environment={null}
        >
          <Model scale={0.01} />
        </Stage>
      </PresentationControls>
    </Canvas>
  )
}

function Model(props: any) {
  const { scene } = useGLTF("/model.glb") as any;

  return (
    <primitive object={scene} {...props} />
  );
}