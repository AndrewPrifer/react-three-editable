import React, { ReactNode, VFC, Suspense } from 'react';
import { Canvas, useResource } from 'react-three-fiber';

import {
  Box,
  Plane,
  Sphere,
  useGLTF,
  PerspectiveCamera,
} from '@react-three/drei';
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

const EditableCamera = e(PerspectiveCamera, 'perspectiveCamera');

const SetupScene = () => {
  const material = useResource<Material>();

  return (
    <>
      <EditableCamera makeDefault uniqueName="Camera1" position={[0, 3, 15]} />
      <ambientLight intensity={0.2} />
      <e.spotLight
        position={[5, 5, 5]}
        penumbra={1}
        angle={Math.PI / 6}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        castShadow
        uniqueName="SpotLight1"
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
          <e.mesh uniqueName="Mesh1">
            <dodecahedronBufferGeometry />
            <meshStandardMaterial />
          </e.mesh>
        </group>
      </group>
    </>
  );
};

const Setup: VFC<SetupProps> = ({
  children,
  cameraPosition = [5, 5, 5] as [number, number, number],
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
        <SetupScene />
      </Canvas>
    </div>
  );
};

export default Setup;
