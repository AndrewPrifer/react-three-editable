# React Three Editable

React Three Editable is a library for React and react-three-fiber that lets you edit your scene in a visual editor while requiring minimal modifications to your r3f code. To get a quick idea of what it's all about, please take a look at this [codesandbox](https://codesandbox.io/s/ide-cream-demo-hcgcd).

## Quick start

```
yarn add react-three-editable
```

```tsx
import React from 'react';
import { Canvas } from 'react-three-fiber';
import { EditableManager, editable as e } from 'react-three-editable';

// Import our previously exported state
import editableState from './editableState.json';

export default function App() {
  return (
    <Canvas>
      {/* EditableManager connnects this canvas to the editor. Here we can also pass our state. */}
      <EditableManager state={editableState} />
      <ambientLight intensity={0.5} />
      {/* Mark objects as editable. */}
      {/* Transforms applied in the editor are added on top of transforms applied in code. */}
      <e.spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        uniqueName="Spotlight"
      />
      <e.pointLight uniqueName="PointLight" />
      <e.mesh uniqueName="Box">
        <boxBufferGeometry />
        <meshStandardMaterial color="orange" />
      </e.mesh>
    </Canvas>
  );
}
```

([Codesandbox](https://codesandbox.io/s/minimal-r3e-demo-o1brl))

## Why

When creating a 3D scene for react-three-fiber, you can choose two routes: you can either code it in r3f, which gives you reactivity, and the flexibility that comes with it, or you can use a 3D software like Blender and export it, but then if you want to dynamically modify that scene at runtime, you'll have to fall back to imperative code.

The best middle ground so far has been gltfjsx, which generates JSX from your exported scene, however it still involves a lot of manual work if you want to split your scene into components, and any modifications you make will have to be reapplied if you make changes to the scene.

React Three Editable aims to fill this gap by allowing you to set up your scene in JSX, giving you reactivity, while allowing you to tweak the properties of these objects in a visual editor, including their transforms, which you can then bake into a json file to be used by the runtime in production. An explicit goal of the project is to require as few modifications to the original code as possible, and to allow freely mixing and blending the static values applied in the editor with dynamic ones applied in code.

## API

### `<EditableManager>`

By placing it inside your r3f `<Canvas>`, you connect it to React Three Editable.

For now you can only connect a single canvas, however multi-canvas support is planned.

#### Props

`state`: a previously exported state.

`allowImplicitInstancing`: allows implicit instancing of editable objects through reusing `uniqueName`s. These objects will share all editable properties. It is discouraged since you'll miss out on warnings if you accidentally reuse a `uniqueName`, and will be superseded by prefabs in the future.

### `editable`

Use it to make objects editable. The properties on `editable` mirror the intrinsic elements of react-three-fiber, however there's no full parity yet. E.g. if you want to create an editable `<mesh>`, you do it by using `<editable.mesh>` instead. These elements have the same interface as the normal ones, with the addition of the below props.

`editable` is also a function, which allows you to make your custom components editable. Your component does have to be compatible with the interface of the editable object type it is meant to represent. You need to pass it the component you want to wrap, and the object type it represents (see object types).

```ts
import { editable } from 'react-three-editable';
import { PerspectiveCamera } from '@react-three/drei';

const EditableCamera = editable(PerspectiveCamera, 'perspectiveCamera');
```

#### Props

`uniqueName`: a unique name used to identify the object in the editor.

`editableRootRef`: pass a ref to this prop to be able to imperatively apply transforms on top of editor transforms, or to imperatively re-parent the object.

### `configure(options)`

Lets you configure the editor.

#### Parameters

`options.localStorageNamespace: string = ''`: allows you to namespace the key used for automatically persisting the editor state in development. Useful if you're working on multiple projects at the same time and you don't want one project overwriting the other.

`options.enablePersistence: boolean = true`: sets whether to a enable persistence of not.

## Object types

React Three Editable currently supports the following object types:

- group
- mesh
- spotLight
- directionalLight
- pointLight
- perspectiveCamera
- orthographicCamera

These are available as properties of `editable`, and you need to pass them as the second parameter when wrapping custom components.

## Production/development build

React Three Editable automatically displays the editor in development and removes it in production, similarly to how React has two different builds. To make use of this, you need to have your build system set up to handle `process.env.NODE_ENV` checks. If you are using CRA or Next.js, this is already done for you.

In production, the bundle size of r3e should not exceed 3 KB (at least this is the goal for 1.0.0, see issue [#39](https://github.com/AndrewPrifer/react-three-editable/issues/39)).

## Contributing

**Any help is welcome!**

This project is still very much in the concept phase, so feedback and ideas are just as valuable a contribution as helping out with the code, or supporting development.

If you have time, please go through the issues and see if there's anything you can help with.
