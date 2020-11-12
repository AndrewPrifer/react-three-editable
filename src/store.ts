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
  original: Object3D;
  transform: Matrix4;
  removed: false;
};

export type Editable =
  | ActiveEditable
  | {
      type: EditableType;
      transform: Matrix4;
      removed: true;
    };

export type EditorStore = {
  scene: Scene | null;
  gl: WebGLRenderer | null;
  editables: Record<string, Editable>;
  selected: string | null;
  transformControlsMode: TransformControlsMode;
  transformControlsSpace: TransformControlsSpace;
  viewportShading: ViewportShading;
  editorOpen: boolean;

  init: (scene: Scene, gl: WebGLRenderer, initialState?: State) => void;
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
};

export const useEditorStore = create<EditorStore>((set) => ({
  scene: null,
  gl: null,
  editables: {},
  selected: null,
  transformControlsMode: 'translate',
  transformControlsSpace: 'world',
  viewportShading: 'rendered',
  editorOpen: false,

  init: (scene, gl, initialState) => {
    const editables: Record<string, Editable> = initialState
      ? Object.fromEntries(
          Object.entries(initialState.editables).map(([name, editable]) => [
            name,
            {
              type: editable.type,
              transform: new Matrix4().fromArray(editable.transform),
              removed: true,
            },
          ])
        )
      : {};

    set({ scene, gl, editables });
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
        if (!state.editables[uniqueName].removed) {
          console.warn(`Editor already has an object named ${uniqueName}.`);
        } else {
          transform = state.editables[uniqueName].transform;
        }
      }

      return {
        editables: {
          ...state.editables,
          [uniqueName]: {
            type,
            original,
            transform,
            removed: false,
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
          [name]: { ...removed, original: undefined, removed: true },
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
}));
