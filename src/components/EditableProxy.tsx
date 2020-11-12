import {
  BoxHelper,
  CameraHelper,
  DirectionalLightHelper,
  Group,
  Matrix4,
  PointLightHelper,
  SpotLightHelper,
} from 'three';
import React, { useEffect, useRef, VFC } from 'react';
import { OrbitControls, useHelper, Sphere } from '@react-three/drei';
import TransformControls from './TransformControls';
import { ActiveEditable, useEditorStore } from '../store';
import shallow from 'zustand/shallow';
import { useFrame } from 'react-three-fiber';
import { useProxy } from '../hooks';

export interface EditableProxyProps {
  editableName: string;
  editable: ActiveEditable;
  onClick?: () => void;
  onChange?: () => void;
  selected?: boolean;
  orbitControlsRef: React.MutableRefObject<OrbitControls | undefined>;
}

const EditableProxy: VFC<EditableProxyProps> = ({
  editableName,
  editable,
  onClick,
  selected,
  orbitControlsRef,
}) => {
  const isBeingEdited = useRef(false);
  const proxyParentRef = useRef<Group>();

  const [proxy, proxyRef] = useProxy(editable.original);

  // set up helper
  let Helper:
    | typeof SpotLightHelper
    | typeof DirectionalLightHelper
    | typeof PointLightHelper
    | typeof BoxHelper
    | typeof CameraHelper;

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
    case 'perspectiveCamera':
    case 'orthographicCamera':
      Helper = CameraHelper;
      break;
    case 'group':
    case 'mesh':
      Helper = BoxHelper;
  }

  let helperArgs: [string] | [number, string] | [];
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
    case 'perspectiveCamera':
    case 'orthographicCamera':
      helperArgs = [];
  }

  useHelper(proxyRef, Helper, ...helperArgs);

  const [
    transformControlsMode,
    transformControlsSpace,
    setEditableTransform,
  ] = useEditorStore(
    (state) => [
      state.transformControlsMode,
      state.transformControlsSpace,
      state.setEditableTransform,
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

  useEffect(() => {
    const unsub = useEditorStore.subscribe(
      (transform) => {
        if (!proxy || isBeingEdited.current) {
          return;
        }

        (transform as Matrix4).decompose(
          proxy.position,
          proxy.quaternion,
          proxy.scale
        );
      },
      (state) => state.editables[editableName].transform
    );

    return () => void unsub();
  }, [editableName, proxy]);

  return proxy ? (
    <>
      <group ref={proxyParentRef} onClick={onClick}>
        <primitive object={proxy}>
          {[
            'spotLight',
            'pointLight',
            'directionalLight',
            'perspectiveCamera',
            'orthographicCamera',
          ].includes(editable.type) && (
            <Sphere
              args={[2, 4, 2]}
              onClick={onClick}
              userData={{ helper: true }}
            >
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
          object={proxy}
          onObjectChange={() => {
            setEditableTransform(editableName, proxy.matrix.clone());
          }}
          onDraggingChange={(event) => (isBeingEdited.current = event.value)}
        />
      )}
    </>
  ) : null;
};

export default EditableProxy;
