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
  T extends ComponentType<any> | EditableType | 'primitive',
  U extends T extends EditableType ? T : EditableType
>(
  Component: T,
  type: T extends 'primitive' ? null : U
) => {
  type Props = Omit<ComponentProps<T>, 'visible'> & {
    uniqueName: string;
    visible?: boolean | 'editor';
  } & (T extends 'primitive'
      ? {
          editableType: U;
        }
      : {}) &
    RefAttributes<Elements[U]>;

  return forwardRef(
    ({ uniqueName, visible, editableType, ...props }: Props, ref) => {
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
        const pos: Vector3 = props.position
          ? Array.isArray(props.position)
            ? new Vector3(...(props.position as any))
            : props.position
          : new Vector3();
        const rot: Vector3 = props.rotation
          ? Array.isArray(props.rotation)
            ? new Vector3(...(props.rotation as any))
            : props.rotation
          : new Vector3();
        const scal: Vector3 = props.scale
          ? Array.isArray(props.scale)
            ? new Vector3(...(props.scale as any))
            : props.scale
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

        addEditable(type ?? editableType, uniqueName, {
          transform: new Matrix4().compose(pos, quaternion, scal),
        });

        return () => {
          removeEditable(uniqueName);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [
        addEditable,
        removeEditable,
        uniqueName,
        props.position,
        props.rotation,
        props.scale,

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
            console.log('t', transform);

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
            __editableType: type ?? editableType,
            __visibleOnlyInEditor: visible === 'editor',
          }}
        />
      );
    }
  );
};

const createEditable = <T extends EditableType>(type: T) =>
  // @ts-ignore
  editable(type, type);

editable.primitive = editable('primitive', null);
editable.group = createEditable('group');
editable.mesh = createEditable('mesh');
editable.spotLight = createEditable('spotLight');
editable.directionalLight = createEditable('directionalLight');
editable.pointLight = createEditable('pointLight');
editable.perspectiveCamera = createEditable('perspectiveCamera');
editable.orthographicCamera = createEditable('orthographicCamera');

export default editable;
