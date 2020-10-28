import React, {
  ComponentProps,
  forwardRef,
  useLayoutEffect,
  useMemo,
  useRef,
  VFC,
} from 'react';
import { Euler, Group, Matrix4, Quaternion, Vector3 } from 'three';
import { useEditorStore } from '../store';
import shallow from 'zustand/shallow';
import mergeRefs from 'react-merge-refs';

interface EditableComponents {
  group: VFC<ComponentProps<'group'> & { uniqueName: string }>;
}

const editable: EditableComponents = {
  group: forwardRef(
    ({ uniqueName, userData, position, rotation, scale, ...props }, ref) => {
      const objectRef = useRef<Group>();
      const [addEditable, removeEditable] = useEditorStore(
        (state) => [
          state.addEditable,
          state.removeEditable,
          state.editables[uniqueName],
        ],
        shallow
      );

      const codeTransform = useMemo(() => {
        const positionVector = position
          ? Array.isArray(position)
            ? new Vector3(...position)
            : position
          : new Vector3();

        const rotationQuaternion = new Quaternion();
        const euler = rotation
          ? Array.isArray(rotation)
            ? new Euler(...rotation)
            : rotation
          : new Euler();
        rotationQuaternion.setFromEuler(euler);

        const scaleVector = scale
          ? Array.isArray(scale)
            ? new Vector3(...scale)
            : scale
          : new Vector3(1, 1, 1);

        const transformMatrix = new Matrix4();
        transformMatrix.compose(
          positionVector,
          rotationQuaternion,
          scaleVector
        );

        return transformMatrix;
      }, [position, rotation, scale]);

      useLayoutEffect(() => {
        addEditable('group', objectRef.current!, codeTransform, uniqueName);

        return () => {
          removeEditable(uniqueName);
        };
      }, [addEditable, removeEditable, codeTransform]);

      useLayoutEffect(() => {
        const obj = objectRef.current!;
        // source of truth is .position, .quaternion and .scale, not the matrix, so we have to do this instead of setting the matrix
        new Matrix4()
          .multiplyMatrices(
            codeTransform,
            useEditorStore.getState().editables[uniqueName].editorTransform
          )
          .decompose(obj.position, obj.quaternion, obj.scale);

        const unsub = useEditorStore.subscribe(
          (editorTransform: Matrix4 | null) => {
            if (editorTransform) {
              new Matrix4()
                .multiplyMatrices(
                  codeTransform,
                  useEditorStore.getState().editables[uniqueName]
                    .editorTransform
                )
                .decompose(obj.position, obj.quaternion, obj.scale);
            }
          },
          (state) => state.editables[uniqueName].editorTransform
        );

        return () => {
          unsub();
        };
      }, [codeTransform]);

      return (
        <group
          ref={mergeRefs([objectRef, ref])}
          // Should we keep the editable flag on userData as part of the public API?
          userData={{ ...userData, editable: true }}
          {...props}
        />
      );
    }
  ),
};

export default editable;
