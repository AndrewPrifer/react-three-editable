import React, { useLayoutEffect, useState, VFC } from 'react';
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
  const [renderMaterials, setRenderMaterials] = useState<{
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

    const renderMaterials: {
      [id: string]: Material | Material[];
    } = {};

    staticSceneProxy.traverse((object) => {
      const mesh = object as Mesh;
      if (mesh.isMesh && !mesh.userData.helper) {
        renderMaterials[mesh.id] = mesh.material;
      }
    });

    setRenderMaterials(renderMaterials);

    return () => {
      Object.entries(renderMaterials).forEach(([id, material]) => {
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
  }, [viewportShading, staticSceneProxy, renderMaterials]);

  return staticSceneProxy ? <primitive object={staticSceneProxy} /> : null;
};

export default StaticSceneProxy;
