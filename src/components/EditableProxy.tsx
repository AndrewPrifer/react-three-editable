import {
  BoxHelper,
  CameraHelper,
  DirectionalLightHelper,
  Object3D,
  PointLightHelper,
  SpotLightHelper,
} from 'three';
import React, {
  ReactElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  VFC,
} from 'react';
import { useHelper, Sphere, Html } from '@react-three/drei';
import { EditableType, useEditorStore } from '../store';
import shallow from 'zustand/shallow';
import { BsFillCollectionFill } from '@react-icons/all-files/bs/BsFillCollectionFill';
import { GiLightProjector } from '@react-icons/all-files/gi/GiLightProjector';
import { BiSun } from '@react-icons/all-files/bi/BiSun';
import { GiCube } from '@react-icons/all-files/gi/GiCube';
import { GiLightBulb } from '@react-icons/all-files/gi/GiLightBulb';
import { BsCameraVideoFill } from '@react-icons/all-files/bs/BsCameraVideoFill';
import { IconType } from '@react-icons/all-files';

export interface EditableProxyProps {
  editableName: string;
  editableType: EditableType;
  object: Object3D;
  onChange?: () => void;
}

const EditableProxy: VFC<EditableProxyProps> = ({
  editableName,
  editableType,
  object,
}) => {
  const [
    selected,
    showOverlayIcons,
    setSelected,
    setSnapshotProxyObject,
  ] = useEditorStore(
    (state) => [
      state.selected,
      state.showOverlayIcons,
      state.setSelected,
      state.setSnapshotProxyObject,
    ],
    shallow
  );

  useEffect(() => {
    setSnapshotProxyObject(object, editableName);

    return () => setSnapshotProxyObject(null, editableName);
  }, [editableName, object, setSnapshotProxyObject]);

  // set up helper
  let Helper:
    | typeof SpotLightHelper
    | typeof DirectionalLightHelper
    | typeof PointLightHelper
    | typeof BoxHelper
    | typeof CameraHelper;

  switch (editableType) {
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
  const color = 'darkblue';

  switch (editableType) {
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

  let icon: ReactElement<IconType>;
  switch (editableType) {
    case 'group':
      icon = <BsFillCollectionFill />;
      break;
    case 'mesh':
      icon = <GiCube />;
      break;
    case 'pointLight':
      icon = <GiLightBulb />;
      break;
    case 'spotLight':
      icon = <GiLightProjector />;
      break;
    case 'directionalLight':
      icon = <BiSun />;
      break;
    case 'perspectiveCamera':
    case 'orthographicCamera':
      icon = <BsCameraVideoFill />;
  }

  const objectRef = useRef(object);

  useLayoutEffect(() => {
    objectRef.current = object;
  }, [object]);

  const dimensionless = [
    'spotLight',
    'pointLight',
    'directionalLight',
    'perspectiveCamera',
    'orthographicCamera',
  ];

  const [hovered, setHovered] = useState(false);

  useHelper(
    objectRef,
    selected === editableName || dimensionless.includes(editableType) || hovered
      ? Helper
      : null,
    ...helperArgs
  );

  return (
    <>
      <group
        onClick={(e) => {
          if (e.delta < 2) {
            e.stopPropagation();
            setSelected(editableName);
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        <primitive object={object}>
          {showOverlayIcons && (
            <Html
              center
              className="pointer-events-none p-1 rounded bg-white bg-opacity-70 shadow text-gray-700"
            >
              {icon}
            </Html>
          )}
          {dimensionless.includes(editableType) && (
            <Sphere
              args={[2, 4, 2]}
              onClick={(e) => {
                if (e.delta < 2) {
                  e.stopPropagation();
                  setSelected(editableName);
                }
              }}
              userData={{ helper: true }}
            >
              <meshBasicMaterial visible={false} />
            </Sphere>
          )}
        </primitive>
      </group>
    </>
  );
};

export default EditableProxy;
