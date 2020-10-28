import create from 'zustand';
import { Matrix4, Object3D, Scene, WebGLRenderer } from 'three';
import produce from 'immer';
import { devtools } from 'zustand/middleware';

// nil is an object that has either been removed, or yet has to be added
export type EditableType = 'group' | 'nil';
export type TransformControlMode = 'translate' | 'rotate' | 'scale';

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
      proxy: Object3D;
      editorTransform: Matrix4;
      codeTransform: Matrix4;
    }
  | {
      type: 'nil';
      editorTransform: Matrix4;
    };

export type EditorStore = {
  scene: Scene | null;
  gl: WebGLRenderer | null;

  staticSceneProxy: Scene | null;
  editables: Record<string, Editable>;
  selected: string | null;
  transformControlMode: TransformControlMode;
  init: (scene: Scene, gl: WebGLRenderer, initialState?: InitialState) => void;

  addEditable: (
    type: Exclude<EditableType, 'nil'>,
    object: Object3D,
    codeTransform: Matrix4,
    uniqueName: string
  ) => void;
  removeEditable: (uniqueName: string) => void;
  setSelected: (name: string) => void;
  setTransformControlsMode: (mode: TransformControlMode) => void;
  set: (fn: (state: EditorStore) => void) => void;
};

export const useEditorStore = create<EditorStore>(
  devtools((set) => ({
    scene: null,
    gl: null,

    staticSceneProxy: null,
    editables: {},
    selected: null,
    transformControlMode: 'translate',
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
                editorTransform: new Matrix4().fromArray(editable.transform),
              },
            ])
          )
        : {};

      set({ scene, gl, staticSceneProxy, editables });
    },
    addEditable: (type, object, codeTransform, uniqueName) =>
      set((state) => {
        let editorTransform = new Matrix4();
        if (state.editables[uniqueName]) {
          if (state.editables[uniqueName].type !== 'nil') {
            console.warn(`Editor already has an object named ${uniqueName}.`);
          } else {
            editorTransform = state.editables[uniqueName].editorTransform;
          }
        }
        const proxy = object.clone();

        // transforms not applied yet, so we apply them here
        new Matrix4()
          .copy(codeTransform)
          .multiply(editorTransform)
          .decompose(proxy.position, proxy.quaternion, proxy.scale);

        return {
          editables: {
            ...state.editables,
            [uniqueName]: {
              type,
              original: object,
              proxy,
              editorTransform,
              codeTransform,
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
            [name]: { type: 'nil', editorTransform: removed.editorTransform },
          },
        };
      }),
    setSelected: (name) => {
      set({ selected: name });
    },
    setTransformControlsMode: (mode) => {
      set({ transformControlMode: mode });
    },
    // Not sure why this line makes the type checker flip out when gl is part of the store, but it kills my computer.
    // @ts-ignore
    set: (fn) => set(produce(fn)),
  }))
);
