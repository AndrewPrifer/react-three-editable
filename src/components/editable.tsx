import React, {
  ComponentProps,
  ComponentType,
  forwardRef,
  RefAttributes,
  useLayoutEffect,
  useRef,
} from 'react';
import {
  DirectionalLight,
  Euler,
  Group,
  Matrix4,
  Mesh,
  OrthographicCamera,
  PerspectiveCamera,
  PointLight,
  Quaternion,
  SpotLight,
  Vector3,
} from 'three';
import { EditableType, useEditorStore } from '../store';
import shallow from 'zustand/shallow';
import mergeRefs from 'react-merge-refs';

interface Elements {
  group: Group;
  mesh: Mesh;
  spotLight: SpotLight;
  directionalLight: DirectionalLight;
  perspectiveCamera: PerspectiveCamera;
  orthographicCamera: OrthographicCamera;
  pointLight: PointLight;
}

const editable = <
  T extends ComponentType<any> | EditableType,
  U extends EditableType
>(
  Component: T,
  type: U
) =>
  forwardRef(
    (
      {
        uniqueName,
        position,
        rotation,
        scale,
        visible,
        ...props
      }: Omit<ComponentProps<T>, 'visible'> & {
        uniqueName: string;
        visible?: boolean | 'editor';
      } & RefAttributes<Elements[U]>,
      ref
    ) => {
      const objectRef = useRef<Elements[U]>();

      const [addEditable, removeEditable] = useEditorStore(
        (state) => [state.addEditable, state.removeEditable],
        shallow
      );

      const transformDeps: string[] = [];

      ['x', 'y', 'z'].forEach((axis) => {
        transformDeps.push(
          props[`position-${axis}` as any],
          props[`rotation-${axis}` as any],
          props[`scale-${axis}` as any]
        );
      });

      useLayoutEffect(() => {
        // calculate initial properties before adding the editable
        const pos: Vector3 = position
          ? new Vector3(...(position as any))
          : new Vector3();
        const rot: Vector3 = rotation
          ? new Vector3(...(rotation as any))
          : new Vector3();
        const scal: Vector3 = scale
          ? new Vector3(...(scale as any))
          : new Vector3(1, 1, 1);

        ['x', 'y', 'z'].forEach((axis, index) => {
          if (props[`position-${axis}` as any])
            pos.setComponent(index, props[`position-${axis}` as any]);
          if (props[`rotation-${axis}` as any])
            rot.setComponent(index, props[`rotation-${axis}` as any]);
          if (props[`scale-${axis}` as any])
            scal.setComponent(index, props[`scale-${axis}` as any]);
        });

        const quaternion = new Quaternion().setFromEuler(
          new Euler().setFromVector3(rot)
        );

        addEditable(type, uniqueName, {
          transform: new Matrix4().compose(pos, quaternion, scal),
        });

        return () => {
          removeEditable(uniqueName);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [
        addEditable,
        position,
        removeEditable,
        rotation,
        scale,
        uniqueName,

        // nasty
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ...transformDeps,
      ]);

      useLayoutEffect(() => {
        const object = objectRef.current!;
        // source of truth is .position, .quaternion and .scale, not the matrix, so we have to do this instead of setting the matrix
        useEditorStore
          .getState()
          .editables[uniqueName].properties.transform.decompose(
            object.position,
            object.quaternion,
            object.scale
          );

        const unsub = useEditorStore.subscribe(
          (transform: Matrix4 | null) => {
            if (transform) {
              useEditorStore
                .getState()
                .editables[uniqueName].properties.transform.decompose(
                  object.position,
                  object.quaternion,
                  object.scale
                );
            }
          },
          (state) => state.editables[uniqueName].properties.transform
        );

        return () => {
          unsub();
        };
      }, [uniqueName]);

      return (
        // @ts-ignore
        <Component
          ref={mergeRefs([objectRef, ref])}
          {...props}
          visible={visible !== 'editor' && visible}
          userData={{
            __editable: true,
            __editableName: uniqueName,
            __editableType: type,
            __visibleOnlyInEditor: visible === 'editor',
          }}
        />
      );
    }
  );

const createEditable = <T extends EditableType>(type: T) =>
  editable(type, type);

editable.group = createEditable('group');
editable.mesh = createEditable('mesh');
editable.spotLight = createEditable('spotLight');
editable.directionalLight = createEditable('directionalLight');
editable.pointLight = createEditable('pointLight');
editable.perspectiveCamera = createEditable('perspectiveCamera');
editable.orthographicCamera = createEditable('orthographicCamera');

export default editable;
