import React, {
  ComponentProps,
  forwardRef,
  useLayoutEffect,
  useRef,
  VFC,
} from 'react';
import { Group, Matrix4 } from 'three';
import { useEditorStore } from '../store';
import shallow from 'zustand/shallow';
import mergeRefs from 'react-merge-refs';

interface EditableComponents {
  group: VFC<
    ComponentProps<'group'> & {
      uniqueName: string;
      // you need a ref to this if you want to apply transforms programmatically or want to re-parent the object
      editableRootRef?: React.Ref<Group>;
    }
  >;
  mesh: VFC<
    ComponentProps<'mesh'> & {
      uniqueName: string;
      editableRootRef?: React.Ref<Group>;
    }
  >;
  spotLight: VFC<
    ComponentProps<'spotLight'> & {
      uniqueName: string;
      editableRootRef?: React.Ref<Group>;
    }
  >;
}

const editable: EditableComponents = {
  group: forwardRef(
    (
      { uniqueName, editableRootRef, position, rotation, scale, ...props },
      ref
    ) => {
      const objectRef = useRef<Group>();

      const [addEditable, removeEditable] = useEditorStore(
        (state) => [
          state.addEditable,
          state.removeEditable,
          state.editables[uniqueName],
        ],
        shallow
      );

      useLayoutEffect(() => {
        addEditable('group', objectRef.current!, uniqueName);

        return () => {
          removeEditable(uniqueName);
        };
      }, [addEditable, removeEditable]);

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
      }, []);

      return (
        <group
          ref={editableRootRef}
          userData={{ editable: true }}
          position={position}
          rotation={rotation}
          scale={scale}
        >
          <group ref={mergeRefs([objectRef, ref])} {...props} />
        </group>
      );
    }
  ),
  mesh: forwardRef(
    (
      { uniqueName, editableRootRef, position, rotation, scale, ...props },
      ref
    ) => {
      const objectRef = useRef<Group>();

      const [addEditable, removeEditable] = useEditorStore(
        (state) => [
          state.addEditable,
          state.removeEditable,
          state.editables[uniqueName],
        ],
        shallow
      );

      useLayoutEffect(() => {
        addEditable('mesh', objectRef.current!, uniqueName);

        return () => {
          removeEditable(uniqueName);
        };
      }, [addEditable, removeEditable]);

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
      }, []);

      return (
        <group
          ref={editableRootRef}
          userData={{ editable: true }}
          position={position}
          rotation={rotation}
          scale={scale}
        >
          <mesh ref={mergeRefs([objectRef, ref])} {...props} />
        </group>
      );
    }
  ),
  spotLight: forwardRef(
    (
      { uniqueName, editableRootRef, position, rotation, scale, ...props },
      ref
    ) => {
      const objectRef = useRef<Group>();

      const [addEditable, removeEditable] = useEditorStore(
        (state) => [
          state.addEditable,
          state.removeEditable,
          state.editables[uniqueName],
        ],
        shallow
      );

      useLayoutEffect(() => {
        addEditable('spotLight', objectRef.current!, uniqueName);

        return () => {
          removeEditable(uniqueName);
        };
      }, [addEditable, removeEditable]);

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
      }, []);

      return (
        <group
          ref={editableRootRef}
          userData={{ editable: true }}
          position={position}
          rotation={rotation}
          scale={scale}
        >
          <spotLight ref={mergeRefs([objectRef, ref])} {...props} />
        </group>
      );
    }
  ),
};

export default editable;
