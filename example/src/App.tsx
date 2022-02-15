import '@theatre/studio';
import { editable as e, configure } from 'react-three-editable';
import { PerspectiveCamera } from '@react-three/drei';
import { getProject } from '@theatre/core';
import * as THREE from 'three';
import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { softShadows, Shadow } from '@react-three/drei';

// console.log(studio);

const ECamera = e(PerspectiveCamera, 'perspectiveCamera');

const bindToCanvas = configure({});

// Soft shadows are expensive, comment and refresh when it's too slow
// softShadows();

// credit: https://codesandbox.io/s/camera-pan-nsb7f

function Button() {
  const vec = new THREE.Vector3();
  const light = useRef();
  const [active, setActive] = useState(false);
  const [zoom, set] = useState(true);
  useEffect(
    () => void (document.body.style.cursor = active ? 'pointer' : 'auto'),
    [active]
  );

  useFrame((state) => {
    const step = 0.1;
    state.camera.fov = THREE.MathUtils.lerp(
      state.camera.fov,
      zoom ? 10 : 42,
      step
    );
    state.camera.position.lerp(
      vec.set(zoom ? 25 : 10, zoom ? 1 : 5, zoom ? 0 : 10),
      step
    );
    state.camera.lookAt(0, 0, 0);
    state.camera.updateProjectionMatrix();
    light.current.position.lerp(
      vec.set(zoom ? 4 : 0, zoom ? 3 : 8, zoom ? 3 : 5),
      step
    );
  });

  return (
    <mesh
      receiveShadow
      castShadow
      onClick={() => set(!zoom)}
      onPointerOver={() => setActive(true)}
      onPointerOut={() => setActive(false)}
    >
      <sphereBufferGeometry args={[0.75, 64, 64]} />
      <meshPhysicalMaterial
        color={active ? 'purple' : '#e7b056'}
        clearcoat={1}
        clearcoatRoughness={0}
      />
      <Shadow
        position-y={-0.79}
        rotation-x={-Math.PI / 2}
        opacity={0.6}
        scale={[0.8, 0.8, 1]}
      />
      <directionalLight
        ref={light}
        castShadow
        intensity={1.5}
        shadow-camera-far={70}
      />
    </mesh>
  );
}

function Plane({ color, uniqueName, ...props }) {
  return (
    <e.mesh receiveShadow castShadow {...props} uniqueName={uniqueName}>
      <boxBufferGeometry />
      <meshStandardMaterial color={color} />
    </e.mesh>
  );
}

function App() {
  return (
    <Canvas
      shadowMap
      onCreated={bindToCanvas({
        theatreProject: getProject('Example project'),
      })}
    >
      <ECamera makeDefault uniqueName="Camera" />
      <ambientLight intensity={0.4} />
      <pointLight position={[-10, -10, 5]} intensity={2} color="#ff20f0" />
      <pointLight
        position={[0, 0.5, -1]}
        distance={1}
        intensity={2}
        color="#e4be00"
      />
      <group position={[0, -0.9, -3]}>
        <Plane
          color="hotpink"
          rotation-x={-Math.PI / 2}
          position-z={2}
          scale={[4, 20, 0.2]}
          uniqueName="plane1"
        />
        <Plane
          color="#e4be00"
          rotation-x={-Math.PI / 2}
          position-y={1}
          scale={[4.2, 0.2, 4]}
          uniqueName="plane2"
        />
        <Plane
          color="#736fbd"
          rotation-x={-Math.PI / 2}
          position={[-1.7, 1, 3.5]}
          scale={[0.5, 4, 4]}
          uniqueName="plane3"
        />
        <Plane
          color="white"
          rotation-x={-Math.PI / 2}
          position={[0, 4.5, 3]}
          scale={[2, 0.03, 4]}
          uniqueName="plane4"
        />
      </group>
      <Button />
    </Canvas>
  );
}

export default App;
