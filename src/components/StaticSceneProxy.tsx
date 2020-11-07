import React, { useLayoutEffect, useRef, useState, VFC } from 'react';
import {
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Object3D,
  Scene,
} from 'three';
import { useEditorStore } from '../store';

export interface StaticSceneProxyProps {
  scene: Scene;
}

const StaticSceneProxy: VFC<StaticSceneProxyProps> = ({ scene }) => {
  const renderMaterials = useRef<{
    [id: string]: Material | Material[];
  }>({});

  const [staticSceneProxy, setStaticSceneProxy] = useState<Scene>();

  const viewportShading = useEditorStore((state) => state.viewportShading);

  useLayoutEffect(() => {
    const staticSceneProxy = scene.clone();

    const remove: Object3D[] = [];

    // could also just reimplement .clone to accept a filter function
    staticSceneProxy.traverse((object) => {
      if (object.userData.editable) {
        remove.push(object);
      }
    });

    remove.forEach((object) => {
      object.parent?.remove(object);
    });

    setStaticSceneProxy(staticSceneProxy);
  }, [scene]);

  useLayoutEffect(() => {
    if (!staticSceneProxy) {
      return;
    }

    Object.keys(renderMaterials).forEach((key) => {
      delete renderMaterials.current[key];
    });

    staticSceneProxy.traverse((object) => {
      const mesh = object as Mesh;
      if (mesh.isMesh && !mesh.userData.helper) {
        renderMaterials.current[mesh.id] = mesh.material;
      }
    });

    return () => {
      Object.entries(renderMaterials.current).forEach(([id, material]) => {
        (staticSceneProxy.getObjectById(
          Number.parseInt(id)
        ) as Mesh).material = material;
      });
    };
  }, [staticSceneProxy]);

  useLayoutEffect(() => {
    if (!staticSceneProxy) {
      return;
    }

    staticSceneProxy.traverse((object) => {
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
            if (renderMaterials.current[mesh.id].hasOwnProperty('color')) {
              material.color = (renderMaterials.current[mesh.id] as any).color;
            }
            if (renderMaterials.current[mesh.id].hasOwnProperty('map')) {
              material.map = (renderMaterials.current[mesh.id] as any).map;
            }
            mesh.material = material;
            break;
          case 'solid':
            material = new MeshPhongMaterial();
            if (renderMaterials.current[mesh.id].hasOwnProperty('color')) {
              material.color = (renderMaterials.current[mesh.id] as any).color;
            }
            if (renderMaterials.current[mesh.id].hasOwnProperty('map')) {
              material.map = (renderMaterials.current[mesh.id] as any).map;
            }
            mesh.material = material;
            break;
          case 'rendered':
            mesh.material = renderMaterials.current[mesh.id];
        }
      }
    });
  }, [viewportShading, staticSceneProxy]);

  return staticSceneProxy ? <primitive object={staticSceneProxy} /> : null;
};

export default StaticSceneProxy;
