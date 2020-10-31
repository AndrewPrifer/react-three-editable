import { BoxHelper, Group } from 'three';
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
  const proxyParentRef = useRef<Group>();

  // we need to rerender when the proxy object is available
  const proxyObjectRef = useRef(editable.original.clone());

  useHelper(proxyObjectRef, BoxHelper, selected ? 'darkred' : 'darkblue');

  const [transformControlsMode, transformControlsSpace, set] = useEditorStore(
    (state) => [
      state.transformControlMode,
      state.transformControlsSpace,
      state.set,
    ],
    shallow
  );

  // update the parent every frame
  useFrame(() => {
    const proxyParent = proxyParentRef.current!;
    // the first parent is the editable group
    editable.original.parent!.matrixWorld.decompose(
      proxyParent.position,
      proxyParent.quaternion,
      proxyParent.scale
    );
  });

  return (
    <>
      <group ref={proxyParentRef} onClick={onClick}>
        <primitive object={proxyObjectRef.current} />
      </group>
      {selected && (
        <TransformControls
          mode={transformControlsMode}
          space={transformControlsSpace}
          orbitControlsRef={orbitControlsRef}
          object={proxyObjectRef.current}
          onObjectChange={() => {
            set((state) => {
              state.editables[
                editableName
              ].transform = proxyObjectRef.current.matrix.clone();
            });
          }}
        />
      )}
    </>
  );
};

export default Proxy;
