import create from 'zustand';
import { Euler, Object3D, Scene, Vector3, WebGLRenderer } from 'three';
import produce, { immerable } from 'immer';
import { devtools } from 'zustand/middleware';

// nil is an object that has either been removed, or yet has to be added
type EditableType = 'group' | 'nil';

export interface InitialState {
  editables: {
    [key: string]: {
      transform: {
        position: [number, number, number];
        rotation: [number, number, number, string];
        scale: [number, number, number];
      };
    };
  };
}

export class Transform {
  position: Vector3;
  rotation: Euler;
  scale: Vector3;

  [immerable] = true;

  constructor({
    position = new Vector3(0, 0, 0),
    rotation = new Euler(0, 0, 0),
    scale = new Vector3(1, 1, 1),
  } = {}) {
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }

  static fromObject({
    position,
    scale,
    rotation,
  }: {
    position: [number, number, number];
    rotation: [number, number, number, string];
    scale: [number, number, number];
  }) {
    return new Transform({
      position: new Vector3(...position),
      rotation: new Euler(...rotation),
      scale: new Vector3(...scale),
    });
  }

  toObject() {
    return {
      position: this.position.toArray(),
      rotation: this.rotation.toArray(),
      scale: this.scale.toArray(),
    };
  }
}

export type Editable =
  | {
      type: Exclude<EditableType, 'nil'>;
      original: Object3D;
      proxy: Object3D;
      editorTransform: Transform;
      codeTransform: Transform;
    }
  | {
      type: 'nil';
      editorTransform: Transform;
    };

export type EditorStore = {
  scene: Scene | null;
  gl: WebGLRenderer | null;

  staticSceneProxy: Scene | null;
  editables: Record<string, Editable>;
  selected: string | null;
  init: (scene: Scene, gl: WebGLRenderer, initialState?: InitialState) => void;

  addEditable: (
    type: Exclude<EditableType, 'nil'>,
    object: Object3D,
    transform: Transform,
    uniqueName: string
  ) => void;
  removeEditable: (uniqueName: string) => void;
  setSelected: (name: string) => void;
  set: (fn: (state: EditorStore) => void) => void;
};

export const useEditorStore = create<EditorStore>(
  devtools((set) => ({
    scene: null,
    gl: null,

    staticSceneProxy: null,
    editables: {},
    selected: null,
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
                editorTransform: Transform.fromObject(editable.transform),
              },
            ])
          )
        : {};

      set({ scene, gl, staticSceneProxy, editables });
    },
    addEditable: (type, object, codeTransform, uniqueName) =>
      set((state) => {
        let editorTransform: Transform = new Transform();
        if (state.editables[uniqueName]) {
          if (state.editables[uniqueName].type !== 'nil') {
            console.warn(`Editor already has an object named ${uniqueName}.`);
          } else {
            editorTransform = state.editables[uniqueName].editorTransform;
          }
        }
        const proxy = object.clone();
        object.parent!.getWorldPosition(proxy.position);

        // transforms not applied yet, so we apply them here
        proxy.position
          .add(codeTransform.position)
          .add(editorTransform.position);

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
    setSelected: (name: string) => {
      set({ selected: name });
    },
    // Not sure why this line makes the type checker flip out when gl is part of the store, but it kills my computer.
    // @ts-ignore
    set: (fn) => set(produce(fn)),
  }))
);
