import { State, useEditorStore } from '../store';
import { useThree } from 'react-three-fiber';
import { MutableRefObject, useLayoutEffect, useRef, useState } from 'react';
import {
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Object3D,
} from 'three';

export const useEditableManager = (state?: State) => {
  const init = useEditorStore((state) => state.init);
  const { scene, gl } = useThree();
  const initialStateRef = useRef(state);

  useLayoutEffect(() => {
    init(scene, gl, initialStateRef.current);
  }, [init, scene, gl]);
};

export const useProxy = (
  scene: Object3D
): [Object3D | undefined, MutableRefObject<Object3D | undefined>] => {
  const [proxy, setProxy] = useState<Object3D>();
  const proxyRef = useRef<Object3D>();

  useLayoutEffect(() => {
    const proxy = scene.clone();

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
  }, [scene]);

  const [renderMaterials, setRenderMaterials] = useState<{
    [id: string]: Material | Material[];
  }>({});

  const viewportShading = useEditorStore((state) => state.viewportShading);

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

  return [proxy, proxyRef];
};
