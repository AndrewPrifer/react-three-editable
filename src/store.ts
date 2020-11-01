import create from 'zustand';
import { Matrix4, Object3D, Scene, WebGLRenderer } from 'three';
import produce from 'immer';
import { devtools } from 'zustand/middleware';

// nil is an object that has either been removed, or yet has to be added
export type EditableType =
  | 'group'
  | 'mesh'
  | 'spotLight'
  | 'directionalLight'
  | 'pointLight'
  | 'nil';
export type TransformControlsMode = 'translate' | 'rotate' | 'scale';
export type TransformControlsSpace = 'world' | 'local';

export interface InitialState {
  editables: {
    [key: string]: {
      transform: number[];
    };
  };
}

export type Editable =
  | {
      type: Exclude<EditableType, 'nil'>;
      original: Object3D;
      transform: Matrix4;
    }
  | {
      type: 'nil';
      transform: Matrix4;
    };

export type EditorStore = {
  scene: Scene | null;
  gl: WebGLRenderer | null;
  staticSceneProxy: Scene | null;
  editables: Record<string, Editable>;
  selected: string | null;
  transformControlsMode: TransformControlsMode;
  transformControlsSpace: TransformControlsSpace;
  editorOpen: boolean;

  init: (scene: Scene, gl: WebGLRenderer, initialState?: InitialState) => void;
  addEditable: (
    type: Exclude<EditableType, 'nil'>,
    original: Object3D,
    uniqueName: string
  ) => void;
  removeEditable: (uniqueName: string) => void;
  setSelected: (name: string) => void;
  setTransformControlsMode: (mode: TransformControlsMode) => void;
  setTransformControlsSpace: (mode: TransformControlsSpace) => void;
  setEditorOpen: (open: boolean) => void;
  set: (fn: (state: EditorStore) => void) => void;
};

export const useEditorStore = create<EditorStore>(
  devtools((set) => ({
    scene: null,
    gl: null,
    staticSceneProxy: null,
    editables: {},
    selected: null,
    transformControlsMode: 'translate',
    transformControlsSpace: 'world',
    editorOpen: false,

    init: (scene, gl, initialState) => {
      const staticSceneProxy = scene.clone();

      const remove: Object3D[] = [];

      // could also just reimplement .clone to accept a filter function
      staticSceneProxy.traverse((object) => {
        if (object.userData.editable) {
          remove.push(object);
        }
      });

      remove.forEach((object) => {
        object.parent?.remove(object);
      });

      const editables: Record<string, Editable> = initialState
        ? Object.fromEntries(
            Object.entries(initialState.editables).map(([name, editable]) => [
              name,
              {
                type: 'nil',
                transform: new Matrix4().fromArray(editable.transform),
              },
            ])
          )
        : {};

      set({ scene, gl, staticSceneProxy, editables });
    },
    addEditable: (type, original, uniqueName) =>
      set((state) => {
        let transform = new Matrix4();
        if (state.editables[uniqueName]) {
          if (state.editables[uniqueName].type !== 'nil') {
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
            [name]: { type: 'nil', transform: removed.transform },
          },
        };
      }),
    setSelected: (name) => {
      set({ selected: name });
    },
    setTransformControlsMode: (mode) => {
      set({ transformControlsMode: mode });
    },
    setTransformControlsSpace: (mode) => {
      set({ transformControlsSpace: mode });
    },
    setEditorOpen: (open) => {
      set({ editorOpen: open });
    },
    // Not sure why this line makes the type checker flip out when gl is part of the store, but it kills my computer.
    // @ts-ignore
    set: (fn) => set(produce(fn)),
  }))
);
