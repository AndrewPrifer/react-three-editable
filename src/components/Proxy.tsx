import { BoxHelper, Object3D } from 'three';
import React, { useRef, VFC } from 'react';
import { OrbitControls, useHelper } from '@react-three/drei';
import TransformControls from './TransformControls';

export interface ProxyProps {
  onClick?: () => void;
  onChange?: () => void;
  selected?: boolean;
  proxyObject: Object3D;
  orbitControlsRef: React.MutableRefObject<OrbitControls | undefined>;
}

const Proxy: VFC<ProxyProps> = ({
  onClick,
  onChange,
  selected,
  proxyObject,
  orbitControlsRef,
}) => {
  // hacky that we're creating a ref just to accommodate useHelper
  const proxyObjectRef = useRef(proxyObject);
  useHelper(proxyObjectRef, BoxHelper, selected ? 'darkred' : 'darkblue');

  return (
    <>
      <group onClick={onClick}>
        <primitive object={proxyObject} />
      </group>
      {selected && (
        <TransformControls
          orbitControlsRef={orbitControlsRef}
          object={proxyObject}
          onObjectChange={onChange}
        />
      )}
    </>
  );
};

export default Proxy;
