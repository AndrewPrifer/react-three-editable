import create from 'zustand';
import { Matrix4, Object3D, Scene, WebGLRenderer } from 'three';

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

export interface State {
  editables: {
    [key: string]: {
      type: EditableType;
      transform: number[];
    };
  };
}

export type ActiveEditable = {
  type: EditableType;
  role: 'active';
  original: Object3D;
  transform: Matrix4;
};

export type RemovedEditable = {
  type: EditableType;
  role: 'removed';
  original?: null;
  transform: Matrix4;
};

export type Editable = ActiveEditable | RemovedEditable;

export type EditorStore = {
  scene: Scene | null;
  gl: WebGLRenderer | null;
  allowImplicitInstancing: boolean;
  editables: Record<string, Editable>;
  selected: string | null;
  transformControlsMode: TransformControlsMode;
  transformControlsSpace: TransformControlsSpace;
  viewportShading: ViewportShading;
  editorOpen: boolean;
  sceneSnapshot: Scene | null;
  editablesSnapshot: Record<string, Editable> | null;

  init: (
    scene: Scene,
    gl: WebGLRenderer,
    allowImplicitInstancing: boolean,
    initialState?: State
  ) => void;
  addEditable: (
    type: EditableType,
    original: Object3D,
    uniqueName: string
  ) => void;
  removeEditable: (uniqueName: string) => void;
  setEditableTransform: (uniqueName: string, transform: Matrix4) => void;
  setSelected: (name: string | null) => void;
  setTransformControlsMode: (mode: TransformControlsMode) => void;
  setTransformControlsSpace: (mode: TransformControlsSpace) => void;
  setViewportShading: (mode: ViewportShading) => void;
  setEditorOpen: (open: boolean) => void;
  createSnapshot: () => void;
};

export const useEditorStore = create<EditorStore>((set) => ({
  scene: null,
  gl: null,
  allowImplicitInstancing: false,
  editables: {},
  selected: null,
  transformControlsMode: 'translate',
  transformControlsSpace: 'world',
  viewportShading: 'rendered',
  editorOpen: false,
  sceneSnapshot: null,
  editablesSnapshot: null,

  init: (scene, gl, allowImplicitInstancing, initialState) => {
    const editables: Record<string, Editable> = initialState
      ? Object.fromEntries(
          Object.entries(initialState.editables).map(([name, editable]) => [
            name,
            {
              type: editable.type,
              role: 'removed',
              transform: new Matrix4().fromArray(editable.transform),
            },
          ])
        )
      : {};

    set((state) => ({
      scene,
      gl,
      allowImplicitInstancing,
      // in case for some reason EditableManager was initialized after the editables in the scene
      editables: { ...state.editables, ...editables },
    }));
  },
  addEditable: (type, original, uniqueName) =>
    set((state) => {
      let transform = new Matrix4();
      if (state.editables[uniqueName]) {
        if (state.editables[uniqueName].type !== type) {
          console.warn(`There is a mismatch between the serialized type of ${uniqueName} and the one set when adding it to the scene.
Serialized: ${state.editables[uniqueName].type}.
Current: ${type}.`);
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
            original,
            transform,
          },
        },
      };
    }),
  removeEditable: (name) =>
    set((state) => {
      const { [name]: removed, ...rest } = state.editables;
      return {
        editables: {
          ...rest,
          [name]: { ...removed, original: undefined, role: 'removed' },
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
}));
