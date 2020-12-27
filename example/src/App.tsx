import React from 'react';
import { Canvas } from 'react-three-fiber';
import { editable as e, configure } from '../../';
import { PerspectiveCamera } from '@react-three/drei';

const bind = configure();

const ECamera = e(PerspectiveCamera, 'perspectiveCamera');

function App() {
  return (
    <Canvas shadowMap onCreated={bind()}>
      <ECamera makeDefault uniqueName="Camera" />
      <e.spotLight
        uniqueName="Key Light"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        castShadow
      />
      <e.spotLight
        uniqueName="Fill Light"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        castShadow
      />
      <e.mesh uniqueName="Ground" receiveShadow>
        <planeBufferGeometry />
        <meshStandardMaterial color="lightblue" />
      </e.mesh>
      <e.group uniqueName="Ice Cream">
        <e.mesh uniqueName="Cone" castShadow>
          <coneBufferGeometry />
          <meshStandardMaterial color="orange" />
        </e.mesh>
        <e.mesh uniqueName="Scoop 1" castShadow>
          <sphereBufferGeometry />
          <meshStandardMaterial color="red" />
        </e.mesh>
        <e.mesh uniqueName="Scoop 2" castShadow>
          <sphereBufferGeometry />
          <meshStandardMaterial color="green" />
        </e.mesh>
        <e.mesh uniqueName="Scoop 3" castShadow>
          <sphereBufferGeometry />
          <meshStandardMaterial color="blue" />
        </e.mesh>
      </e.group>
    </Canvas>
  );
}

export default App;
