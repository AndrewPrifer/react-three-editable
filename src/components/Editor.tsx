import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from 'react-three-fiber';
import { TransformControlMode, useEditorStore } from '../store';
import { OrbitControls } from '@react-three/drei';
import shallow from 'zustand/shallow';
import { WebGLRenderer } from 'three';
import { saveAs } from 'file-saver';
import root from 'react-shadow';
import Proxy from './Proxy';

const referenceHeight = 200;

const EditorScene = () => {
  const orbitControlsRef = useRef<OrbitControls>();

  const [staticSceneProxy, editables, selected, setSelected] = useEditorStore(
    (state) => [
      state.staticSceneProxy,
      state.editables,
      state.selected,
      state.setSelected,
      state.set,
    ],
    shallow
  );

  return (
    <>
      <primitive object={staticSceneProxy} />

      <directionalLight position={[10, 20, 15]} />
      <gridHelper args={[30, 30, 30]} />
      <axesHelper />
      <OrbitControls ref={orbitControlsRef} />

      {Object.entries(editables).map(
        ([name, editable]) =>
          editable.type !== 'nil' && (
            <Proxy
              editableName={name}
              editable={editable}
              selected={selected === name}
              onClick={() => setSelected(name)}
              orbitControlsRef={orbitControlsRef}
              key={name}
            />
          )
      )}
    </>
  );
};

const Editor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [open, setOpen] = useState(false);

  const [
    scene,
    gl,
    editables,
    transformControlsMode,
    setTransformControlsMode,
  ] = useEditorStore((state) => [
    state.scene,
    state.gl,
    state.editables,
    state.transformControlMode,
    state.setTransformControlsMode,
  ]);

  useEffect(() => {
    let animationHandle: number;
    const draw = (gl: WebGLRenderer) => () => {
      const width =
        (gl.domElement.width / gl.domElement.height) * referenceHeight;

      const ctx = canvasRef.current!.getContext('2d')!;

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, referenceHeight);
      ctx.drawImage(gl.domElement, 0, 0, width, referenceHeight);
      animationHandle = requestAnimationFrame(draw(gl));
    };

    if (open && gl) {
      draw(gl)();
    }

    return () => {
      cancelAnimationFrame(animationHandle);
    };
  }, [open]);

  return (
    <root.div>
      {open ? (
        <>
          <div
            style={{
              position: 'fixed',
              width: '100%',
              height: '100%',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1000,
              cursor: 'pointer',
            }}
          >
            {scene ? (
              <Canvas
                colorManagement
                camera={{ position: [5, 5, 5] }}
                onCreated={({ gl }) => {
                  gl.setClearColor('white');
                }}
                shadowMap
              >
                <EditorScene />
              </Canvas>
            ) : (
              <div>Editor hasn't been attached.</div>
            )}
          </div>
          <div
            style={{
              position: 'fixed',
              zIndex: 1001,
            }}
          >
            {gl && (
              <canvas
                ref={canvasRef}
                width={
                  (gl.domElement.width / gl.domElement.height) * referenceHeight
                }
                height={referenceHeight}
                style={{
                  outline: '1px solid black',
                }}
              />
            )}

            <button onClick={() => setOpen(false)}>Close</button>
            <button
              onClick={() => {
                const blob = new Blob(
                  [
                    JSON.stringify(
                      {
                        editables: Object.fromEntries(
                          Object.entries(editables).map(([name, editable]) => [
                            name,
                            {
                              transform: editable.transform.toArray(),
                            },
                          ])
                        ),
                      },
                      null,
                      2
                    ),
                  ],
                  { type: 'text/json;charset=utf-8' }
                );
                saveAs(blob, 'editableState.json');
              }}
            >
              Export
            </button>
            <select
              value={transformControlsMode}
              onChange={(event) =>
                setTransformControlsMode(
                  event.target.value as TransformControlMode
                )
              }
            >
              <option value="translate">Translate</option>
              <option value="rotate">Rotate</option>
              <option value="scale">Scale</option>
            </select>
          </div>
        </>
      ) : (
        <button
          style={{
            position: 'fixed',
            zIndex: 1000,
          }}
          onClick={() => setOpen(true)}
        >
          Editor
        </button>
      )}
    </root.div>
  );
};

export default Editor;
