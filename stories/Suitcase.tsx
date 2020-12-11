import * as THREE from 'three';
import React, { useRef } from 'react';
import { useLoader } from 'react-three-fiber';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import e from '../src/components/editable';

type GLTFResult = GLTF & {
  nodes: {
    about_button: THREE.Mesh;
    interests_button: THREE.Mesh;
    projects_button: THREE.Mesh;
    social_links_button: THREE.Mesh;
    work_button: THREE.Mesh;
    suitcase_top: THREE.Mesh;
    handle: THREE.Mesh;
    clasp: THREE.Mesh;
    clasp001: THREE.Mesh;
    static: THREE.Mesh;
    static001: THREE.Mesh;
    Text: THREE.Mesh;
  };
  materials: {
    realistic: THREE.MeshStandardMaterial;
  };
};

export default function Model(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>();
  const { nodes } = useLoader<GLTFResult>(GLTFLoader, '/suitcase.gltf');

  const lidRef = useRef<THREE.Mesh>();

  // useFrame(() => {
  //   lidRef.current!.rotation.set(
  //     ...(animation.lid.rotation.get() as [number, number, number])
  //   );
  // });

  return (
    <>
      <e.group
        ref={group}
        {...props}
        dispose={null}
        rotation={[0, Math.PI, 0]}
        uniqueName="Suitcase"
      >
        <primitive object={nodes.static} />
        <e.mesh
          ref={lidRef}
          geometry={nodes.suitcase_top.geometry}
          material={nodes.suitcase_top.material}
          position={[0, 1.53, 2.79]}
          rotation={[0, 0, 0]}
          uniqueName="Lid"
        >
          <mesh
            material={nodes.clasp.material}
            geometry={nodes.clasp.geometry}
            position={[-2.28, 0.38, -5.68]}
          />
          <mesh
            material={nodes.clasp001.material}
            geometry={nodes.clasp001.geometry}
            position={[2.28, 0.38, -5.68]}
          />
          <primitive object={nodes.static001} />
        </e.mesh>
        <e.mesh
          geometry={nodes.Text.geometry}
          uniqueName="React Three Editable Text"
        >
          <meshStandardMaterial color="hotpink" />
        </e.mesh>
      </e.group>
    </>
  );
}
