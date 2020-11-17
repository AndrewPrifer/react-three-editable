import React, {
  ComponentProps,
  forwardRef,
  ForwardRefExoticComponent,
  JSXElementConstructor,
  RefAttributes,
  useLayoutEffect,
  useRef,
} from 'react';
import {
  DirectionalLight,
  Group,
  Matrix4,
  Mesh,
  OrthographicCamera,
  PerspectiveCamera,
  PointLight,
  SpotLight,
} from 'three';
import { EditableType, useEditorStore } from '../store';
import shallow from 'zustand/shallow';
import mergeRefs from 'react-merge-refs';

type EditableComponents = {
  [K in EditableType]: ForwardRefExoticComponent<
    ComponentProps<K> & {
      uniqueName: string;
      // you need a ref to this if you want to apply transforms programmatically or want to re-parent the object
      editableRootRef?: React.Ref<Group>;
    } & RefAttributes<Elements[K]>
  >;
} & {
  <T extends JSXElementConstructor<any> | EditableType, U extends EditableType>(
    Component: T,
    type: U
  ): ForwardRefExoticComponent<
    ComponentProps<T> & {
      uniqueName: string;
      editableRootRef?: React.Ref<Group>;
    } & RefAttributes<Elements[U]>
  >;
};

interface Elements {
  group: Group;
  mesh: Mesh;
  spotLight: SpotLight;
  directionalLight: DirectionalLight;
  perspectiveCamera: PerspectiveCamera;
  orthographicCamera: OrthographicCamera;
  pointLight: PointLight;
}

const useEditable = <T extends EditableType>(uniqueName: string, type: T) => {
  const objectRef = useRef<Elements[T]>();

  const [addEditable, removeEditable] = useEditorStore(
    (state) => [
      state.addEditable,
      state.removeEditable,
      state.editables[uniqueName],
    ],
    shallow
  );

  useLayoutEffect(() => {
    addEditable(type, objectRef.current!, uniqueName);

    return () => {
      removeEditable(uniqueName);
    };
  }, [addEditable, removeEditable, type, uniqueName]);

  useLayoutEffect(() => {
    const object = objectRef.current!;
    // source of truth is .position, .quaternion and .scale, not the matrix, so we have to do this instead of setting the matrix
    useEditorStore
      .getState()
      .editables[uniqueName].transform.decompose(
        object.position,
        object.quaternion,
        object.scale
      );

    const unsub = useEditorStore.subscribe(
      (transform: Matrix4 | null) => {
        if (transform) {
          useEditorStore
            .getState()
            .editables[uniqueName].transform.decompose(
              object.position,
              object.quaternion,
              object.scale
            );
        }
      },
      (state) => state.editables[uniqueName].transform
    );

    return () => {
      unsub();
    };
  }, [uniqueName]);

  return objectRef;
};

// @ts-ignore
const editable: EditableComponents = (Component, type) =>
  forwardRef(
    (
      { uniqueName, editableRootRef, position, rotation, scale, ...props },
      ref
    ) => {
      const objectRef = useEditable(uniqueName, type);

      return (
        <group
          ref={editableRootRef}
          userData={{
            __editable: true,
            __editableName: uniqueName,
            __editableType: type,
          }}
          position={position}
          rotation={rotation}
          scale={scale}
        >
          {/* @ts-ignore* */}
          <Component ref={mergeRefs([objectRef, ref])} {...props} />
        </group>
      );
    }
  );

const createEditable = (type: EditableType) => editable(type, type);

// @ts-ignore
editable.group = createEditable('group');
// @ts-ignore
editable.mesh = createEditable('mesh');
// @ts-ignore
editable.spotLight = createEditable('spotLight');
// @ts-ignore
editable.directionalLight = createEditable('directionalLight');
// @ts-ignore
editable.pointLight = createEditable('pointLight');
// @ts-ignore
editable.perspectiveCamera = createEditable('perspectiveCamera');
// @ts-ignore
editable.orthographicCamera = createEditable('orthographicCamera');

export default editable;
