import React, {
  ComponentProps,
  forwardRef,
  useLayoutEffect,
  useRef,
  VFC,
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
  [K in Exclude<EditableType, 'nil'>]: VFC<
    ComponentProps<K> & {
      uniqueName: string;
      // you need a ref to this if you want to apply transforms programmatically or want to re-parent the object
      editableRootRef?: React.Ref<Group>;
    }
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

const useEditable = <T extends Exclude<EditableType, 'nil'>>(
  uniqueName: string,
  type: T
) => {
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

  return objectRef;
};

const editable: EditableComponents = {
  group: forwardRef(
    (
      { uniqueName, editableRootRef, position, rotation, scale, ...props },
      ref
    ) => {
      const objectRef = useEditable(uniqueName, 'group');

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
      const objectRef = useEditable(uniqueName, 'mesh');

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
      const objectRef = useEditable(uniqueName, 'spotLight');

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
  directionalLight: forwardRef(
    (
      { uniqueName, editableRootRef, position, rotation, scale, ...props },
      ref
    ) => {
      const objectRef = useEditable(uniqueName, 'directionalLight');

      return (
        <group
          ref={editableRootRef}
          userData={{ editable: true }}
          position={position}
          rotation={rotation}
          scale={scale}
        >
          <directionalLight ref={mergeRefs([objectRef, ref])} {...props} />
        </group>
      );
    }
  ),
  pointLight: forwardRef(
    (
      { uniqueName, editableRootRef, position, rotation, scale, ...props },
      ref
    ) => {
      const objectRef = useEditable(uniqueName, 'pointLight');

      return (
        <group
          ref={editableRootRef}
          userData={{ editable: true }}
          position={position}
          rotation={rotation}
          scale={scale}
        >
          <pointLight ref={mergeRefs([objectRef, ref])} {...props} />
        </group>
      );
    }
  ),
  perspectiveCamera: forwardRef(
    (
      { uniqueName, editableRootRef, position, rotation, scale, ...props },
      ref
    ) => {
      const objectRef = useEditable(uniqueName, 'perspectiveCamera');

      return (
        <group
          ref={editableRootRef}
          userData={{ editable: true }}
          position={position}
          rotation={rotation}
          scale={scale}
        >
          <perspectiveCamera ref={mergeRefs([objectRef, ref])} {...props} />
        </group>
      );
    }
  ),
  orthographicCamera: forwardRef(
    (
      { uniqueName, editableRootRef, position, rotation, scale, ...props },
      ref
    ) => {
      const objectRef = useEditable(uniqueName, 'orthographicCamera');

      return (
        <group
          ref={editableRootRef}
          userData={{ editable: true }}
          position={position}
          rotation={rotation}
          scale={scale}
        >
          <orthographicCamera ref={mergeRefs([objectRef, ref])} {...props} />
        </group>
      );
    }
  ),
};

export default editable;
