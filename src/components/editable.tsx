import React, {
  ComponentProps,
  forwardRef,
  useLayoutEffect,
  useMemo,
  useRef,
  VFC,
} from 'react';
import { Euler, Group, Vector3 } from 'three';
import { Transform, useEditorStore } from '../store';
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

      const positionVector = useMemo(
        () =>
          position
            ? Array.isArray(position)
              ? new Vector3(...position)
              : position
            : new Vector3(),
        [position]
      );

      const rotationEuler = useMemo(
        () =>
          rotation
            ? Array.isArray(rotation)
              ? new Euler(...rotation)
              : rotation
            : new Euler(),
        [rotation]
      );

      const scaleVector = useMemo(
        () =>
          scale
            ? Array.isArray(scale)
              ? new Vector3(...scale)
              : scale
            : new Vector3(),
        [scale]
      );

      useLayoutEffect(() => {
        addEditable(
          'group',
          objectRef.current!,
          new Transform({
            position: positionVector,
            rotation: rotationEuler,
            scale: scaleVector,
          }),
          uniqueName
        );

        return () => {
          removeEditable(uniqueName);
        };
      }, [
        addEditable,
        removeEditable,
        positionVector,
        rotationEuler,
        scaleVector,
      ]);

      useLayoutEffect(() => {
        objectRef.current!.position.addVectors(
          positionVector,
          useEditorStore.getState().editables[uniqueName].editorTransform
            .position
        );

        const unsub = useEditorStore.subscribe(
          (editorTransform: Transform | null) => {
            if (editorTransform) {
              objectRef.current!.position.addVectors(
                positionVector,
                editorTransform.position
              );
            }
          },
          (state) => state.editables[uniqueName].editorTransform
        );

        return () => {
          unsub();
        };
      }, [positionVector]);

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
