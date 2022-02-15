# React Three Editable

> ⚠️ React Three Editable is now part of [Theatre.js](https://github.com/theatre-js/theatre) and can be found on NPM as `@theatre/r3f`. The new project is functionally almost the same as this one, just with more features, regular maintenance and... animation tools! 🎉 Chances are your current r3e code will work without any modifications.
>
> For those that haven't heard the news, I'm now also working on Theatre.js, and `@theatre/r3f` will be receiving regular improvements and maintenance as an official Theatre.js extension.
>
> With that, however, this package (`react-three-editable`) is deprecated in favor of `@theatre/r3f`. I encourage you all to check it out at [Theatre.js](https://github.com/theatre-js/theatre) and file issues there!

React Three Editable is a library for React and react-three-fiber that lets you edit your scene in a visual editor while requiring minimal modifications to your r3f code. To get a quick idea of what it's all about, please take a look at this [codesandbox](https://codesandbox.io/s/ide-cream-demo-hcgcd).

**Here be dragons! 🐉** React Three Editable is relatively stable, however being pre-1.0.0 software, the API and the internal logic can drastically change at any time, without warning.

## Quick start

```
yarn add react-three-editable
```

```tsx
import React from 'react';
import { Canvas } from 'react-three-fiber';
import { editable as e, configure } from 'react-three-editable';

// Import your previously exported state
import editableState from './editableState.json';

const bind = configure({
  // Enables persistence in development so your edits aren't discarded when you close the browser window
  enablePersistence: true,
  // Useful if you use r3e in multiple projects
  localStorageNamespace: 'Example',
});

export default function App() {
  return (
    <Canvas onCreated={bind({ state: editableState })}>
      <ambientLight intensity={0.5} />
      {/* Mark objects as editable. */}
      {/* Properties in the code are used as initial values and reset points in the editor. */}
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

The best middle ground so far has been *gltfjsx*, which generates JSX from your exported scene, however it still involves a lot of manual work if you want to split your scene into components, and any modifications you make will have to be reapplied if you make changes to the scene.

React Three Editable aims to fill this gap by allowing you to set up your scene in JSX, giving you reactivity, while allowing you to tweak the properties of these objects in a visual editor, including their transforms, which you can then bake into a json file to be used by the runtime in production. An explicit goal of the project is to mirror regular react-three-fiber code as much as possible. This lets you add it to an existing project with ease, take it out when you don't need it, and generally use it as little or as much as you want, without feeling locked in.

## API

### `editable`

Use it to make objects editable. The properties on `editable` mirror the intrinsic elements of react-three-fiber, however there's no full parity yet. E.g. if you want to create an editable `<mesh>`, you do it by using `<editable.mesh>` instead. These elements have the same interface as the normal ones, with the addition of the below props. Any editable property you set in the code (like `position`) will be used as an initial value/reset point in the editor.

`editable` is also a function, which allows you to make your custom components editable. Your component does have to be compatible with the interface of the editable object type it is meant to represent. You need to pass it the component you want to wrap, and the object type it represents (see object types).

```ts
import { editable } from 'react-three-editable';
import { PerspectiveCamera } from '@react-three/drei';

const EditableCamera = editable(PerspectiveCamera, 'perspectiveCamera');
```

#### Props

`uniqueName: string`: a unique name used to identify the object in the editor.

### `configure(options)`

Lets you configure the editor.

#### Parameters

`options.localStorageNamespace: string = ''`: allows you to namespace the key used for automatically persisting the editor state in development. Useful if you're working on multiple projects at the same time and you don't want one project overwriting the other.

`options.enablePersistence: boolean = true`: sets whether to enable persistence or not.

#### Returns

`bind`: a function that you can use to connect canvases to React Three Editable, see below.

### `bind(options)`

Bind is a curried function that you call with `options` and returns another function that has to be called with `gl` and `scene`.

Use it to bind a `Canvas` to React Three Editable: `<Canvas onCreated={bind(options)}>`. If you use `onCreated` for other things as well, you have to manually call the function returned by `bind()`:

```tsx
<Canvas onCreated={({ gl, scene }) => {
  bind(options)({ gl, scene });
}}>
  // ...
</Canvas>
```

❓ "The above snippet looks wrong...": `bind` is a curried function, so that you don't have to pass `gl` and `scene` manually in the average case when your `onCreated` is empty. The downside is that it looks like this when you have to manually call it with `gl` and `scene`.

⚠️ For now, you can only connect a single canvas, however multi-canvas support is planned.

#### Parameters

`options.state?: EditableState`: a previously exported state.

`options.allowImplicitInstancing: boolean = false`: allows implicit instancing of editable objects through reusing `uniqueName`s. These objects will share all editable properties. It is discouraged since you'll miss out on warnings if you accidentally reuse a `uniqueName`, and will be superseded by prefabs in the future.


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

In production, the bundle size of r3e is [2.9 kB](https://bundlephobia.com/result?p=react-three-editable).

## Contributing

**Any help is welcome!**

This project is still very much in the concept phase, so feedback and ideas are just as valuable a contribution as helping out with the code, or supporting development.

If you have time, please go through the issues and see if there's anything you can help with.
