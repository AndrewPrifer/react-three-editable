import React, { ReactNode, VFC, Suspense, useRef } from 'react';
import { Canvas, ContainerProps } from 'react-three-fiber';
import Suitcase from './Suitcase';

import {
  Box,
  Plane,
  Sphere,
  useGLTF,
  PerspectiveCamera,
  Environment,
} from '@react-three/drei';
import e from '../src/components/editable';

interface SetupProps extends Omit<ContainerProps, 'children'> {
  children?: ReactNode;
  cameraPosition?: [number, number, number];
  controls?: boolean;
}

const Suzanne = () => {
  const suzanne = useGLTF('/suzanne.glb');

  return <primitive object={suzanne.scene} />;
};

const EditableCamera = e(PerspectiveCamera, 'perspectiveCamera');
const EditablePlane = e(Plane, 'mesh');

const SetupScene = () => {
  // const material = useResource<Material>();
  const material = useRef();
  return (
    <>
      <EditableCamera makeDefault uniqueName="Camera1" />
      <Suspense fallback={null}>
        {/* @ts-ignore */}
        <Environment background files="equi.hdr" path={'/'} />
      </Suspense>
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
      <EditablePlane
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[10, 10, 10]}
        material={material.current}
        receiveShadow
        uniqueName="ground"
      >
        <meshStandardMaterial />
      </EditablePlane>
      <Box castShadow receiveShadow position={[-3, 3, -3]}>
        <meshStandardMaterial color="red" />
      </Box>
      <group position={[0, -1, 0]}>
        <e.group uniqueName="monkey" position={[0, 3, 0]}>
          <Suspense fallback={null}>
            <Suzanne />
            <Suitcase />
          </Suspense>
        </e.group>
        <group position={[0, 1, 0]} scale={[2, 1, 1]}>
          <e.group position={[0.5, 0.5, 0.5]} uniqueName="Box1">
            <Box castShadow receiveShadow>
              <meshStandardMaterial color="hotpink" />
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
            <e.mesh uniqueName="Mesh2" position={[0, 3, 0]}>
              <dodecahedronBufferGeometry />
              <meshStandardMaterial color="red" />
            </e.mesh>
          </e.mesh>
        </group>
      </group>
    </>
  );
};

const EBox = e(Box, 'mesh');

const SmallScene = () => {
  return (
    <EBox castShadow receiveShadow uniqueName="Box">
      <meshBasicMaterial color="hotpink" />
    </EBox>
  );
};

const Setup: VFC<SetupProps> = ({
  children,
  cameraPosition = [-5, 5, 5] as [number, number, number],
  ...props
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
        {...props}
      >
        {children}
        <SetupScene />
      </Canvas>
    </div>
  );
};

export default Setup;
