import React, { ReactNode, VFC, Suspense } from 'react';
import { Canvas, useResource } from 'react-three-fiber';

import { OrbitControls, Box, Plane, Sphere, useGLTF } from '@react-three/drei';
import e from '../src/components/editable';
import { Material } from 'three';

interface SetupProps {
  children?: ReactNode;
  cameraPosition?: [number, number, number];
  controls?: boolean;
}

const Suzanne = () => {
  const suzanne = useGLTF('/suzanne.glb');

  return <primitive object={suzanne.scene} />;
};

const SetupScene = () => {
  const material = useResource<Material>();

  return (
    <>
      <ambientLight intensity={0.2} />
      <spotLight
        position={[10, 30, 30]}
        penumbra={1}
        angle={Math.PI / 6}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        castShadow
      />
      <pointLight position={[-10, 30, 30]} />
      <Plane
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[10, 10, 10]}
        material={material.current}
        receiveShadow
      >
        <meshStandardMaterial />
      </Plane>
      <group position={[0, -1, 0]}>
        <e.group uniqueName="monkey" position={[0, 3, 0]}>
          <Suspense fallback={null}>
            <Suzanne />
          </Suspense>
        </e.group>
        <group position={[0, 1, 0]} scale={[2, 1, 1]}>
          <e.group position={[0.5, 0.5, 0.5]} uniqueName="Box1">
            <Box castShadow receiveShadow>
              <meshStandardMaterial />
            </Box>
          </e.group>
          <e.group position={[3, 2, 1]} uniqueName="Box2">
            <Sphere material={material.current} castShadow receiveShadow>
              <meshStandardMaterial />
            </Sphere>
          </e.group>
        </group>
      </group>
    </>
  );
};

const Setup: VFC<SetupProps> = ({
  children,
  cameraPosition = [5, 5, 5] as [number, number, number],
  controls = true,
}) => {
  return (
    <div
      style={{
        height: '100%',
      }}
    >
      <Canvas
        colorManagement
        shadowMap
        camera={{ position: cameraPosition }}
        pixelRatio={window.devicePixelRatio}
      >
        {children}
        {controls && <OrbitControls />}
        <SetupScene />
      </Canvas>
    </div>
  );
};

export default Setup;
