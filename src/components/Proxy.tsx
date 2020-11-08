import {
  BoxHelper,
  CameraHelper,
  DirectionalLightHelper,
  Group,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Object3D,
  PointLightHelper,
  SpotLightHelper,
} from 'three';
import React, { useLayoutEffect, useRef, useState, VFC } from 'react';
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
  const [proxy, setProxy] = useState<Object3D>();
  // this is only for the helper
  const proxyRef = useRef<Object3D>();
  const [renderMaterials, setRenderMaterials] = useState<{
    [id: string]: Material | Material[];
  }>({});

  // prepare proxy object
  useLayoutEffect(() => {
    const proxy = editable.original.clone();

    const remove: Object3D[] = [];

    // could also just reimplement .clone to accept a filter function
    proxy.traverse((object) => {
      if (object.userData.editable) {
        remove.push(object);
      }
    });

    remove.forEach((object) => {
      object.parent?.remove(object);
    });

    proxyRef.current = proxy;
    setProxy(proxy);
  }, [editable.original]);

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
    viewportShading,
    setEditableTransform,
  ] = useEditorStore(
    (state) => [
      state.transformControlsMode,
      state.transformControlsSpace,
      state.viewportShading,
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

  // save original materials
  useLayoutEffect(() => {
    if (!proxy) {
      return;
    }

    const renderMaterials: {
      [id: string]: Material | Material[];
    } = {};

    proxy.traverse((object) => {
      const mesh = object as Mesh;
      if (mesh.isMesh && !mesh.userData.helper) {
        renderMaterials[mesh.id] = mesh.material;
      }
    });

    setRenderMaterials(renderMaterials);

    return () => {
      Object.entries(renderMaterials).forEach(([id, material]) => {
        (proxy.getObjectById(Number.parseInt(id)) as Mesh).material = material;
      });
    };
  }, [proxy]);

  useLayoutEffect(() => {
    if (!proxy) {
      return;
    }

    proxy.traverse((object) => {
      const mesh = object as Mesh;
      if (mesh.isMesh && !mesh.userData.helper) {
        let material;
        switch (viewportShading) {
          case 'wireframe':
            mesh.material = new MeshBasicMaterial({
              wireframe: true,
              color: 'black',
            });
            break;
          case 'flat':
            material = new MeshBasicMaterial();
            if (renderMaterials[mesh.id].hasOwnProperty('color')) {
              material.color = (renderMaterials[mesh.id] as any).color;
            }
            if (renderMaterials[mesh.id].hasOwnProperty('map')) {
              material.map = (renderMaterials[mesh.id] as any).map;
            }
            mesh.material = material;
            break;
          case 'solid':
            material = new MeshPhongMaterial();
            if (renderMaterials[mesh.id].hasOwnProperty('color')) {
              material.color = (renderMaterials[mesh.id] as any).color;
            }
            if (renderMaterials[mesh.id].hasOwnProperty('map')) {
              material.map = (renderMaterials[mesh.id] as any).map;
            }
            mesh.material = material;
            break;
          case 'rendered':
            mesh.material = renderMaterials[mesh.id];
        }
      }
    });
  }, [viewportShading, proxy, renderMaterials]);

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
        />
      )}
    </>
  ) : null;
};

export default Proxy;
