import { BoxHelper, Group, Matrix4 } from 'three';
import React, { useRef, VFC } from 'react';
import { OrbitControls, useHelper } from '@react-three/drei';
import TransformControls from './TransformControls';
import { Editable, useEditorStore } from '../store';
import shallow from 'zustand/shallow';
import { useFrame } from 'react-three-fiber';

export interface ProxyProps {
  editableName: string;
  editable: Exclude<Editable, { type: 'nil' }>;
  onClick?: () => void;
  onChange?: () => void;
  selected?: boolean;
  orbitControlsRef: React.MutableRefObject<OrbitControls | undefined>;
}

const Proxy: VFC<ProxyProps> = ({
  editableName,
  editable,
  onClick,
  selected,
  orbitControlsRef,
}) => {
  // hacky that we're creating a ref just to accommodate useHelper
  const proxyObjectRef = useRef(editable.proxy);
  const proxyParentRef = useRef<Group>();

  useHelper(proxyObjectRef, BoxHelper, selected ? 'darkred' : 'darkblue');

  const [transformControlsMode, set] = useEditorStore(
    (state) => [state.transformControlMode, state.set],
    shallow
  );

  useFrame(() => {
    const proxyParent = proxyParentRef.current!;
    editable.original.parent!.matrixWorld.decompose(
      proxyParent.position,
      proxyParent.quaternion,
      proxyParent.scale
    );
  });

  return (
    <>
      <group ref={proxyParentRef} onClick={onClick}>
        <primitive object={editable.proxy} />
      </group>
      {selected && (
        <TransformControls
          mode={transformControlsMode}
          orbitControlsRef={orbitControlsRef}
          object={editable.proxy}
          onObjectChange={() => {
            set((state) => {
              const codeTransformInverse = new Matrix4();
              codeTransformInverse.getInverse(editable.codeTransform);

              state.editables[
                editableName
              ].editorTransform = new Matrix4()
                .copy(codeTransformInverse)
                .multiply(editable.proxy.matrix);
            });
          }}
        />
      )}
    </>
  );
};

export default Proxy;
