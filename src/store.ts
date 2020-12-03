import create, { StateCreator } from 'zustand';
import { Matrix4, Object3D, Scene, WebGLRenderer } from 'three';
import { MutableRefObject } from 'react';
import { OrbitControls } from '@react-three/drei';
import deepEqual from 'fast-deep-equal';

export type EditableType =
  | 'group'
  | 'mesh'
  | 'spotLight'
  | 'directionalLight'
  | 'pointLight'
  | 'perspectiveCamera'
  | 'orthographicCamera';
export type TransformControlsMode = 'translate' | 'rotate' | 'scale';
export type TransformControlsSpace = 'world' | 'local';
export type ViewportShading = 'wireframe' | 'flat' | 'solid' | 'rendered';

export interface EditableState {
  editables: {
    [key: string]: {
      type: EditableType;
      transform: number[];
    };
  };
}

export type Editable = {
  type: EditableType;
  role: 'active' | 'removed';
  transform: Matrix4;
};

export interface EditableSnapshot extends Editable {
  proxyObject?: Object3D | null;
}

export type EditorStore = {
  scene: Scene | null;
  gl: WebGLRenderer | null;
  allowImplicitInstancing: boolean;
  orbitControlsRef: MutableRefObject<OrbitControls | undefined> | null;
  editables: Record<string, Editable>;
  // this will come in handy when we start supporting multiple canvases
  canvasName: string;
  initialState: EditableState | null;
  selected: string | null;
  transformControlsMode: TransformControlsMode;
  transformControlsSpace: TransformControlsSpace;
  viewportShading: ViewportShading;
  editorOpen: boolean;
  sceneSnapshot: Scene | null;
  editablesSnapshot: Record<string, EditableSnapshot> | null;

  init: (
    scene: Scene,
    gl: WebGLRenderer,
    allowImplicitInstancing: boolean,
    initialState?: EditableState
  ) => void;
  setOrbitControlsRef: (
    orbitControlsRef: MutableRefObject<OrbitControls | undefined>
  ) => void;
  addEditable: (type: EditableType, uniqueName: string) => void;
  removeEditable: (uniqueName: string) => void;
  setEditableTransform: (uniqueName: string, transform: Matrix4) => void;
  setSelected: (name: string | null) => void;
  setTransformControlsMode: (mode: TransformControlsMode) => void;
  setTransformControlsSpace: (mode: TransformControlsSpace) => void;
  setViewportShading: (mode: ViewportShading) => void;
  setEditorOpen: (open: boolean) => void;
  createSnapshot: () => void;
  setSnapshotProxyObject: (
    proxyObject: Object3D | null,
    uniqueName: string
  ) => void;
  serialize: () => EditableState;
  isPersistedStateDifferentThanInitial: () => boolean;
  applyPersistedState: () => void;
};

interface PersistedState {
  canvases: {
    [name: string]: EditableState;
  };
}

const config: StateCreator<EditorStore> = (set, get) => ({
  scene: null,
  gl: null,
  allowImplicitInstancing: false,
  orbitControlsRef: null,
  editables: {},
  canvasName: 'default',
  initialState: null,
  selected: null,
  transformControlsMode: 'translate',
  transformControlsSpace: 'world',
  viewportShading: 'rendered',
  editorOpen: false,
  sceneSnapshot: null,
  editablesSnapshot: null,

  init: (scene, gl, allowImplicitInstancing, initialState) => {
    const editables = get().editables;

    const newEditables: Record<string, Editable> = initialState
      ? Object.fromEntries(
          Object.entries(initialState.editables).map(([name, editable]) => {
            const originalEditable = editables[name];
            return [
              name,
              originalEditable?.role === 'active'
                ? {
                    type: editable.type,
                    role: 'active',
                    transform: new Matrix4().fromArray(editable.transform),
                  }
                : {
                    type: editable.type,
                    role: 'removed',
                    transform: new Matrix4().fromArray(editable.transform),
                  },
            ];
          })
        )
      : editables;

    set({
      scene,
      gl,
      allowImplicitInstancing,
      editables: newEditables,
      initialState,
    });
  },
  addEditable: (type, uniqueName) =>
    set((state) => {
      let transform = new Matrix4();
      if (state.editables[uniqueName]) {
        if (
          state.editables[uniqueName].type !== type &&
          process.env.NODE_ENV === 'development'
        ) {
          console.error(`Warning: There is a mismatch between the serialized type of ${uniqueName} and the one set when adding it to the scene.
Serialized: ${state.editables[uniqueName].type}.
Current: ${type}.

This might have happened either because you changed the type of an object, in which case a re-export will solve the issue, or because you re-used the uniqueName for an object of a different type, which is an error.`);
        }
        if (
          state.editables[uniqueName].role === 'active' &&
          !state.allowImplicitInstancing
        ) {
          throw Error(
            `Scene already has an editable object named ${uniqueName}.
If this is intentional, please set the allowImplicitInstancing prop of EditableManager to true.`
          );
        } else {
          transform = state.editables[uniqueName].transform;
        }
      }

      return {
        editables: {
          ...state.editables,
          [uniqueName]: {
            type,
            role: 'active',
            transform,
          },
        },
      };
    }),
  setOrbitControlsRef: (camera) => {
    set({ orbitControlsRef: camera });
  },
  removeEditable: (name) =>
    set((state) => {
      const { [name]: removed, ...rest } = state.editables;
      return {
        editables: {
          ...rest,
          [name]: { ...removed, role: 'removed' },
        },
      };
    }),
  setEditableTransform: (uniqueName, transform) => {
    set((state) => ({
      editables: {
        ...state.editables,
        [uniqueName]: { ...state.editables[uniqueName], transform },
      },
    }));
  },
  setSelected: (name) => {
    set({ selected: name });
  },
  setTransformControlsMode: (mode) => {
    set({ transformControlsMode: mode });
  },
  setTransformControlsSpace: (mode) => {
    set({ transformControlsSpace: mode });
  },
  setViewportShading: (mode) => {
    set({ viewportShading: mode });
  },
  setEditorOpen: (open) => {
    set({ editorOpen: open });
  },
  createSnapshot: () => {
    set((state) => ({
      sceneSnapshot: state.scene?.clone(),
      editablesSnapshot: state.editables,
    }));
  },
  setSnapshotProxyObject: (proxyObject, uniqueName) => {
    set((state) => ({
      editablesSnapshot: {
        ...state.editablesSnapshot,
        [uniqueName]: { ...state.editablesSnapshot![uniqueName], proxyObject },
      },
    }));
  },
  serialize: () => ({
    editables: Object.fromEntries(
      Object.entries(get().editables).map(([name, editable]) => [
        name,
        {
          type: editable.type,
          transform: editable.transform.toArray(),
        },
      ])
    ),
  }),
  isPersistedStateDifferentThanInitial: () => {
    const initialState = get().initialState;
    const canvasName = get().canvasName!;

    if (!initialState || !initialPersistedState) {
      return false;
    }

    return !deepEqual(initialPersistedState.canvases[canvasName], initialState);
  },
  applyPersistedState: () => {
    const editables = get().editables;
    const canvasName = get().canvasName!;

    if (!initialPersistedState) {
      return;
    }

    const newEditables: Record<string, Editable> = Object.fromEntries(
      Object.entries(initialPersistedState.canvases[canvasName].editables).map(
        ([name, editable]) => {
          const originalEditable = editables[name];
          return [
            name,
            originalEditable?.role === 'active'
              ? {
                  type: editable.type,
                  role: 'active',
                  transform: new Matrix4().fromArray(editable.transform),
                }
              : {
                  type: editable.type,
                  role: 'removed',
                  transform: new Matrix4().fromArray(editable.transform),
                },
          ];
        }
      )
    );

    set({
      editables: newEditables,
    });
  },
});

export const useEditorStore = create<EditorStore>(config);

const initPersistence = (
  key: string
): [PersistedState | null, (() => void) | undefined] => {
  let initialPersistedState: PersistedState | null = null;
  let unsub;

  if (process.env.NODE_ENV === 'development') {
    try {
      const rawPersistedState = localStorage.getItem(key);
      if (rawPersistedState) {
        initialPersistedState = JSON.parse(rawPersistedState);
      }
    } catch (e) {}

    unsub = useEditorStore.subscribe(
      () => {
        const canvasName = useEditorStore.getState().canvasName;
        const serialize = useEditorStore.getState().serialize;
        if (canvasName) {
          const editables = serialize();
          localStorage.setItem(
            key,
            JSON.stringify({
              canvases: {
                [canvasName]: editables,
              },
            })
          );
        }
      },
      (state) => state.editables
    );
  }

  return [initialPersistedState, unsub];
};

let [initialPersistedState, unsub] = initPersistence('react-three-editable_');

export const configure = (config: {
  localStorageNamespace?: string;
  enablePersistence?: boolean;
}) => {
  if (unsub) {
    unsub();
  }

  if (config.enablePersistence ?? true) {
    const persistence = initPersistence(
      `react-three-editable_${config.localStorageNamespace ?? ''}`
    );

    initialPersistedState = persistence[0];
    unsub = persistence[1];
  } else {
    initialPersistedState = null;
    unsub = undefined;
  }
};
