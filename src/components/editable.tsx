import React, {
  ComponentProps,
  forwardRef,
  ForwardRefExoticComponent,
  JSXElementConstructor,
  ReactNode,
  RefObject,
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
    }
  >;
} & {
  <
    T extends JSXElementConstructor<V>,
    U extends EditableType,
    V extends ComponentProps<U>
  >(
    Component: T,
    type: U
  ): ForwardRefExoticComponent<
    ComponentProps<T> & {
      uniqueName: string;
      editableRootRef?:
        | ((instance: ReactNode) => void)
        | RefObject<ReactNode>
        | null
        | undefined;
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

// How to type this?
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
          {/* @ts-ignore */}
          <Component ref={mergeRefs([objectRef, ref])} {...props} />
        </group>
      );
    }
  );

editable.group = forwardRef(
  (
    { uniqueName, editableRootRef, position, rotation, scale, ...props },
    ref
  ) => {
    const objectRef = useEditable(uniqueName, 'group');

    return (
      <group
        ref={editableRootRef}
        userData={{
          __editable: true,
          __editableName: uniqueName,
          __editableType: 'group',
        }}
        position={position}
        rotation={rotation}
        scale={scale}
      >
        <group ref={mergeRefs([objectRef, ref])} {...props} />
      </group>
    );
  }
);

editable.mesh = forwardRef(
  (
    { uniqueName, editableRootRef, position, rotation, scale, ...props },
    ref
  ) => {
    const objectRef = useEditable(uniqueName, 'mesh');

    return (
      <group
        ref={editableRootRef}
        userData={{
          __editable: true,
          __editableName: uniqueName,
          __editableType: 'mesh',
        }}
        position={position}
        rotation={rotation}
        scale={scale}
      >
        <mesh ref={mergeRefs([objectRef, ref])} {...props} />
      </group>
    );
  }
);
editable.spotLight = forwardRef(
  (
    { uniqueName, editableRootRef, position, rotation, scale, ...props },
    ref
  ) => {
    const objectRef = useEditable(uniqueName, 'spotLight');

    return (
      <group
        ref={editableRootRef}
        userData={{
          __editable: true,
          __editableName: uniqueName,
          __editableType: 'spotLight',
        }}
        position={position}
        rotation={rotation}
        scale={scale}
      >
        <spotLight ref={mergeRefs([objectRef, ref])} {...props} />
      </group>
    );
  }
);
editable.directionalLight = forwardRef(
  (
    { uniqueName, editableRootRef, position, rotation, scale, ...props },
    ref
  ) => {
    const objectRef = useEditable(uniqueName, 'directionalLight');

    return (
      <group
        ref={editableRootRef}
        userData={{
          __editable: true,
          __editableName: uniqueName,
          __editableType: 'directionalLight',
        }}
        position={position}
        rotation={rotation}
        scale={scale}
      >
        <directionalLight ref={mergeRefs([objectRef, ref])} {...props} />
      </group>
    );
  }
);
editable.pointLight = forwardRef(
  (
    { uniqueName, editableRootRef, position, rotation, scale, ...props },
    ref
  ) => {
    const objectRef = useEditable(uniqueName, 'pointLight');

    return (
      <group
        ref={editableRootRef}
        userData={{
          __editable: true,
          __editableName: uniqueName,
          __editableType: 'pointLight',
        }}
        position={position}
        rotation={rotation}
        scale={scale}
      >
        <pointLight ref={mergeRefs([objectRef, ref])} {...props} />
      </group>
    );
  }
);
editable.perspectiveCamera = forwardRef(
  (
    { uniqueName, editableRootRef, position, rotation, scale, ...props },
    ref
  ) => {
    const objectRef = useEditable(uniqueName, 'perspectiveCamera');

    return (
      <group
        ref={editableRootRef}
        userData={{
          __editable: true,
          __editableName: uniqueName,
          __editableType: 'perspectiveCamera',
        }}
        position={position}
        rotation={rotation}
        scale={scale}
      >
        <perspectiveCamera ref={mergeRefs([objectRef, ref])} {...props} />
      </group>
    );
  }
);
editable.orthographicCamera = forwardRef(
  (
    { uniqueName, editableRootRef, position, rotation, scale, ...props },
    ref
  ) => {
    const objectRef = useEditable(uniqueName, 'orthographicCamera');

    return (
      <group
        ref={editableRootRef}
        userData={{
          __editable: true,
          __editableName: uniqueName,
          __editableType: 'orthographicCamera',
        }}
        position={position}
        rotation={rotation}
        scale={scale}
      >
        <orthographicCamera ref={mergeRefs([objectRef, ref])} {...props} />
      </group>
    );
  }
);

export default editable;
