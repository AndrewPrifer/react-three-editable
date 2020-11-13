import { State, useEditorStore } from '../store';
import { useThree } from 'react-three-fiber';
import {
  MutableRefObject,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  object: Object3D
): [Object3D, MutableRefObject<Object3D>, string[]] => {
  const proxy = useMemo(() => object.clone(), [object]);
  const proxyRef = useRef<Object3D>(proxy);
  // this depends on proxy, which is reactive already, so we can safely use a ref
  const [childEditableNames, setChildEditableNames] = useState<string[]>([]);

  useLayoutEffect(() => {
    const editableChildren: Object3D[] = [];

    // could also just reimplement .clone to accept a filter function
    proxy.traverse((object) => {
      // userData editable properties are not set on the editable object itself, but on its parent, so we don't really need this
      // other than for potentially saving myself from some future headaches
      if (object === proxy) {
        return;
      }

      if (object.userData.__editable) {
        editableChildren.push(object);
      }
    });

    const childEditableNames: string[] = [];
    editableChildren.forEach((object) => {
      childEditableNames.push(object.userData.__editableName);
      object.parent?.remove(object);
    });

    setChildEditableNames(childEditableNames);
    proxyRef.current = proxy;
  }, [proxy, setChildEditableNames]);

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

  return [proxy, proxyRef, childEditableNames];
};
