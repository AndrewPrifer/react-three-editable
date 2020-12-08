import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  VFC,
} from 'react';
import { useEditorStore } from '../store';
import { createPortal } from 'react-three-fiber';
import EditableProxy from './EditableProxy';
import { OrbitControls } from '@react-three/drei';
import TransformControls from './TransformControls';
import shallow from 'zustand/shallow';
import {
  Material,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Object3D,
} from 'three';

export interface ProxyManagerProps {
  orbitControlsRef: React.MutableRefObject<OrbitControls | undefined>;
}

type EditableProxy = {
  portal: ReturnType<typeof createPortal>;
  object: Object3D;
};

const ProxyManager: VFC<ProxyManagerProps> = ({ orbitControlsRef }) => {
  const isBeingEdited = useRef(false);
  const [
    sceneSnapshot,
    selected,
    transformControlsMode,
    transformControlsSpace,
    viewportShading,
    setEditableTransform,
  ] = useEditorStore(
    (state) => [
      state.sceneSnapshot,
      state.selected,
      state.transformControlsMode,
      state.transformControlsSpace,
      state.viewportShading,
      state.setEditableTransform,
    ],
    shallow
  );
  const sceneProxy = useMemo(() => sceneSnapshot?.clone(), [sceneSnapshot]);
  const [editableProxies, setEditableProxies] = useState<{
    [name: string]: EditableProxy;
  }>({});

  // set up scene proxies
  useLayoutEffect(() => {
    if (!sceneProxy) {
      return;
    }

    const editableProxies: { [name: string]: EditableProxy } = {};

    sceneProxy.traverse((object) => {
      if (object.userData.__editable) {
        // there are duplicate uniqueNames in the scene, only display one instance in the editor
        if (editableProxies[object.userData.__editableName]) {
          object.parent!.remove(object);
        } else {
          editableProxies[object.userData.__editableName] = {
            portal: createPortal(
              <EditableProxy
                editableName={object.userData.__editableName}
                editableType={object.userData.__editableType}
                object={object}
              />,
              object.parent
            ),
            object: object,
          };
        }
      }
    });

    setEditableProxies(editableProxies);
  }, [orbitControlsRef, sceneProxy]);

  // subscribe to external changes
  useEffect(() => {
    if (!selected) {
      return;
    }

    const unsub = useEditorStore.subscribe(
      (transform) => {
        if (isBeingEdited.current) {
          return;
        }

        const object = editableProxies[selected].object;

        (transform as Matrix4).decompose(
          object.position,
          object.quaternion,
          object.scale
        );
      },
      (state) => state.editables[selected].properties.transform
    );

    return () => void unsub();
  }, [editableProxies, selected]);

  // set up viewport shading modes
  const [renderMaterials, setRenderMaterials] = useState<{
    [id: string]: Material | Material[];
  }>({});

  useLayoutEffect(() => {
    if (!sceneProxy) {
      return;
    }

    const renderMaterials: {
      [id: string]: Material | Material[];
    } = {};

    sceneProxy.traverse((object) => {
      const mesh = object as Mesh;
      if (mesh.isMesh && !mesh.userData.helper) {
        renderMaterials[mesh.id] = mesh.material;
      }
    });

    setRenderMaterials(renderMaterials);

    return () => {
      Object.entries(renderMaterials).forEach(([id, material]) => {
        (sceneProxy.getObjectById(
          Number.parseInt(id)
        ) as Mesh).material = material;
      });
    };
  }, [sceneProxy]);

  useLayoutEffect(() => {
    if (!sceneProxy) {
      return;
    }

    sceneProxy.traverse((object) => {
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
            // it is possible that renderMaterials hasn't updated yet
            if (!renderMaterials[mesh.id]) {
              return;
            }
            material = new MeshBasicMaterial();
            if (renderMaterials[mesh.id].hasOwnProperty('color')) {
              material.color = (renderMaterials[mesh.id] as any).color;
            }
            if (renderMaterials[mesh.id].hasOwnProperty('map')) {
              material.map = (renderMaterials[mesh.id] as any).map;
            }
            if (renderMaterials[mesh.id].hasOwnProperty('vertexColors')) {
              material.vertexColors = (renderMaterials[
                mesh.id
              ] as any).vertexColors;
            }
            mesh.material = material;
            break;
          case 'solid':
            // it is possible that renderMaterials hasn't updated yet
            if (!renderMaterials[mesh.id]) {
              return;
            }
            material = new MeshPhongMaterial();
            if (renderMaterials[mesh.id].hasOwnProperty('color')) {
              material.color = (renderMaterials[mesh.id] as any).color;
            }
            if (renderMaterials[mesh.id].hasOwnProperty('map')) {
              material.map = (renderMaterials[mesh.id] as any).map;
            }
            if (renderMaterials[mesh.id].hasOwnProperty('vertexColors')) {
              material.vertexColors = (renderMaterials[
                mesh.id
              ] as any).vertexColors;
            }
            mesh.material = material;
            break;
          case 'rendered':
            mesh.material = renderMaterials[mesh.id];
        }
      }
    });
  }, [viewportShading, renderMaterials, sceneProxy]);

  if (!sceneProxy) {
    return null;
  }

  return (
    <>
      <primitive object={sceneProxy} />
      {selected && (
        <TransformControls
          mode={transformControlsMode}
          space={transformControlsSpace}
          orbitControlsRef={orbitControlsRef}
          object={editableProxies[selected].object}
          onObjectChange={() => {
            setEditableTransform(
              selected,
              editableProxies[selected].object.matrix.clone()
            );
          }}
          onDraggingChange={(event) => (isBeingEdited.current = event.value)}
        />
      )}
      {Object.values(editableProxies).map(({ portal }) => portal)}
    </>
  );
};

export default ProxyManager;
