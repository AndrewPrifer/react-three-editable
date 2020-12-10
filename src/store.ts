import create, { StateCreator } from 'zustand';
import {
  DefaultLoadingManager,
  Matrix4,
  Object3D,
  Scene,
  WebGLRenderer,
} from 'three';
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

export interface AbstractEditable<T extends EditableType> {
  type: T;
  role: 'active' | 'removed';
  properties: {};
  initialProperties: this['properties'];
}

// all these identical types are to prepare for a future in which different object types have different properties
export interface EditableGroup extends AbstractEditable<'group'> {
  properties: {
    transform: Matrix4;
  };
}

export interface EditableMesh extends AbstractEditable<'mesh'> {
  properties: {
    transform: Matrix4;
  };
}

export interface EditableSpotLight extends AbstractEditable<'spotLight'> {
  properties: {
    transform: Matrix4;
  };
}

export interface EditableDirectionalLight
  extends AbstractEditable<'directionalLight'> {
  properties: {
    transform: Matrix4;
  };
}

export interface EditablePointLight extends AbstractEditable<'pointLight'> {
  properties: {
    transform: Matrix4;
  };
}

export interface EditablePerspectiveCamera
  extends AbstractEditable<'perspectiveCamera'> {
  properties: {
    transform: Matrix4;
  };
}

export interface EditableOrthographicCamera
  extends AbstractEditable<'orthographicCamera'> {
  properties: {
    transform: Matrix4;
  };
}

export type Editable =
  | EditableGroup
  | EditableMesh
  | EditableSpotLight
  | EditableDirectionalLight
  | EditablePointLight
  | EditablePerspectiveCamera
  | EditableOrthographicCamera;

export type EditableSnapshot<T extends Editable = Editable> = {
  proxyObject?: Object3D | null;
} & T;

export interface AbstractSerializedEditable<T extends EditableType> {
  type: T;
}

export interface SerializedEditableGroup
  extends AbstractSerializedEditable<'group'> {
  properties: {
    transform: number[];
  };
}

export interface SerializedEditableMesh
  extends AbstractSerializedEditable<'mesh'> {
  properties: {
    transform: number[];
  };
}

export interface SerializedEditableSpotLight
  extends AbstractSerializedEditable<'spotLight'> {
  properties: {
    transform: number[];
  };
}

export interface SerializedEditableDirectionalLight
  extends AbstractSerializedEditable<'directionalLight'> {
  properties: {
    transform: number[];
  };
}

export interface SerializedEditablePointLight
  extends AbstractSerializedEditable<'pointLight'> {
  properties: {
    transform: number[];
  };
}

export interface SerializedEditablePerspectiveCamera
  extends AbstractSerializedEditable<'perspectiveCamera'> {
  properties: {
    transform: number[];
  };
}

export interface SerializedEditableOrthographicCamera
  extends AbstractSerializedEditable<'orthographicCamera'> {
  properties: {
    transform: number[];
  };
}

export type SerializedEditable =
  | SerializedEditableGroup
  | SerializedEditableMesh
  | SerializedEditableSpotLight
  | SerializedEditableDirectionalLight
  | SerializedEditablePointLight
  | SerializedEditablePerspectiveCamera
  | SerializedEditableOrthographicCamera;

export interface EditableState {
  editables: Record<string, SerializedEditable>;
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
  hdrPaths: string[];
  selectedHdr: string | null;
  showOverlayIcons: boolean;
  useHdrAsBackground: boolean;
  showGrid: boolean;
  showAxes: boolean;

  init: (
    scene: Scene,
    gl: WebGLRenderer,
    allowImplicitInstancing: boolean,
    initialState?: EditableState
  ) => void;
  setOrbitControlsRef: (
    orbitControlsRef: MutableRefObject<OrbitControls | undefined>
  ) => void;
  addEditable: <T extends EditableType>(
    type: T,
    uniqueName: string,
    initialProperties: Extract<Editable, { type: T }>['properties']
  ) => void;
  removeEditable: (uniqueName: string) => void;
  setEditableTransform: (uniqueName: string, transform: Matrix4) => void;
  setSelected: (name: string | null) => void;
  setSelectedHdr: (hdr: string | null) => void;
  setTransformControlsMode: (mode: TransformControlsMode) => void;
  setTransformControlsSpace: (mode: TransformControlsSpace) => void;
  setViewportShading: (mode: ViewportShading) => void;
  setShowOverlayIcons: (show: boolean) => void;
  setUseHdrAsBackground: (use: boolean) => void;
  setShowGrid: (show: boolean) => void;
  setShowAxes: (show: boolean) => void;
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

const config: StateCreator<EditorStore> = (set, get) => {
  setTimeout(() => {
    const existingHandler = DefaultLoadingManager.onProgress;
    DefaultLoadingManager.onProgress = (url, loaded, total) => {
      existingHandler(url, loaded, total);
      if (url.match(/\.hdr$/)) {
        set((state) => {
          const newPaths = new Set(state.hdrPaths);
          newPaths.add(url);
          return { hdrPaths: Array.from(newPaths) };
        });
      }
    };
  });

  return {
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
    hdrPaths: [],
    selectedHdr: null,
    showOverlayIcons: false,
    useHdrAsBackground: true,
    showGrid: true,
    showAxes: true,

    init: (scene, gl, allowImplicitInstancing, initialState) => {
      const editables = get().editables;

      const newEditables: Record<string, Editable> = initialState
        ? Object.fromEntries(
            Object.entries(initialState.editables).map(([name, editable]) => {
              const originalEditable = editables[name];
              return [
                name,
                {
                  type: editable.type,
                  role: originalEditable?.role ?? 'removed',
                  properties: {
                    transform: new Matrix4().fromArray(
                      editable.properties.transform
                    ),
                  },
                  initialProperties: originalEditable?.initialProperties ?? {
                    transform: new Matrix4(),
                  },
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
    addEditable: (type, uniqueName, initialProperties) =>
      set((state) => {
        let properties = initialProperties;
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
            properties = state.editables[uniqueName].properties;
          }
        }

        return {
          editables: {
            ...state.editables,
            [uniqueName]: {
              type: type as EditableType,
              role: 'active',
              properties,
              initialProperties,
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
          [uniqueName]: {
            ...state.editables[uniqueName],
            properties: { transform },
          },
        },
      }));
    },
    setSelected: (name) => {
      set({ selected: name });
    },
    setSelectedHdr: (hdr) => {
      set({ selectedHdr: hdr });
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
    setShowOverlayIcons: (show) => {
      set({ showOverlayIcons: show });
    },
    setUseHdrAsBackground: (use) => {
      set({ useHdrAsBackground: use });
    },
    setShowGrid: (show) => {
      set({ showGrid: show });
    },
    setShowAxes: (show) => {
      set({ showAxes: show });
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
          [uniqueName]: {
            ...state.editablesSnapshot![uniqueName],
            proxyObject,
          },
        },
      }));
    },
    serialize: () => ({
      editables: Object.fromEntries(
        Object.entries(get().editables).map(([name, editable]) => [
          name,
          {
            type: editable.type,
            properties: {
              transform: editable.properties.transform.toArray(),
            },
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

      return !deepEqual(
        initialPersistedState.canvases[canvasName],
        initialState
      );
    },
    applyPersistedState: () => {
      const editables = get().editables;
      const canvasName = get().canvasName!;

      if (!initialPersistedState) {
        return;
      }

      const newEditables: Record<string, Editable> = Object.fromEntries(
        Object.entries(
          initialPersistedState.canvases[canvasName].editables
        ).map(([name, editable]) => {
          const originalEditable = editables[name];
          return [
            name,
            {
              type: editable.type,
              role: originalEditable?.role ?? 'removed',
              properties: {
                transform: new Matrix4().fromArray(
                  editable.properties.transform
                ),
              },
              initialProperties: originalEditable?.initialProperties ?? {
                transform: new Matrix4(),
              },
            },
          ];
        })
      );

      set({
        editables: newEditables,
      });
    },
  };
};

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

export type BindFunction = (options?: {
  allowImplicitInstancing?: boolean;
  state?: EditableState;
}) => (options: { gl: WebGLRenderer; scene: Scene }) => void;

export const configure = ({
  localStorageNamespace = '',
  enablePersistence = true,
} = {}): BindFunction => {
  if (unsub) {
    unsub();
  }

  if (enablePersistence) {
    const persistence = initPersistence(
      `react-three-editable_${localStorageNamespace}`
    );

    initialPersistedState = persistence[0];
    unsub = persistence[1];
  } else {
    initialPersistedState = null;
    unsub = undefined;
  }

  return ({ allowImplicitInstancing = false, state } = {}) => {
    return ({ gl, scene }) => {
      const init = useEditorStore.getState().init;
      init(scene, gl, allowImplicitInstancing, state);
    };
  };
};
