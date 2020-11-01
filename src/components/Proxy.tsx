import {
  BoxHelper,
  DirectionalLightHelper,
  Group,
  PointLightHelper,
  SpotLightHelper,
} from 'three';
import React, { useRef, VFC } from 'react';
import { OrbitControls, useHelper, Sphere } from '@react-three/drei';
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
  const proxyObjectRef = useRef(editable.original.clone());

  let Helper:
    | typeof SpotLightHelper
    | typeof DirectionalLightHelper
    | typeof PointLightHelper
    | typeof BoxHelper;

  switch (editable.type) {
    case 'spotLight':
      Helper = SpotLightHelper;
      break;
    case 'directionalLight':
      Helper = DirectionalLightHelper;
      break;
    case 'pointLight':
      Helper = PointLightHelper;
      break;
    case 'group':
    case 'mesh':
      Helper = BoxHelper;
  }

  let helperArgs: [string] | [number, string];
  const size = 1;
  const color = selected ? 'darkred' : 'darkblue';

  switch (editable.type) {
    case 'directionalLight':
    case 'pointLight':
      helperArgs = [size, color];
      break;
    case 'group':
    case 'mesh':
    case 'spotLight':
      helperArgs = [color];
      break;
  }

  useHelper(proxyObjectRef, Helper, ...helperArgs);

  const [transformControlsMode, transformControlsSpace, set] = useEditorStore(
    (state) => [
      state.transformControlsMode,
      state.transformControlsSpace,
      state.set,
    ],
    shallow
  );

  // update the parent every frame
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
        <primitive object={proxyObjectRef.current}>
          {['spotLight', 'pointLight', 'directionalLight'].includes(
            editable.type
          ) && (
            <Sphere args={[2, 4, 2]} onClick={onClick}>
              <meshBasicMaterial visible={false} />
            </Sphere>
          )}
        </primitive>
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
