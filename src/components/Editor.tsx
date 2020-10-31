import React, { useRef } from 'react';
import { Canvas } from 'react-three-fiber';
import { useEditorStore } from '../store';
import { OrbitControls } from '@react-three/drei';
import shallow from 'zustand/shallow';
import root from 'react-shadow/emotion';
import { ChakraProvider, Button, Box } from '@chakra-ui/core';
import Proxy from './Proxy';
import UI from './UI';

const EditorScene = () => {
  const orbitControlsRef = useRef<OrbitControls>();

  const [staticSceneProxy, editables, selected, setSelected] = useEditorStore(
    (state) => [
      state.staticSceneProxy,
      state.editables,
      state.selected,
      state.setSelected,
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
  const [scene, editorOpen, setEditorOpen] = useEditorStore(
    (state) => [state.scene, state.editorOpen, state.setEditorOpen],
    shallow
  );

  return (
    <root.div>
      <ChakraProvider>
        <Box pos="relative" zIndex={1000}>
          {editorOpen ? (
            <Box pos="fixed" top={0} bottom={0} left={0} right={0}>
              {scene ? (
                <Canvas
                  colorManagement
                  camera={{ position: [5, 5, 5] }}
                  onCreated={({ gl }) => {
                    gl.setClearColor('white');
                  }}
                  shadowMap
                  pixelRatio={window.devicePixelRatio}
                >
                  <EditorScene />
                </Canvas>
              ) : (
                <div>Editor hasn't been attached.</div>
              )}
              <UI />
            </Box>
          ) : (
            <Button
              pos="fixed"
              bottom="20px"
              left="20px"
              onClick={() => setEditorOpen(true)}
            >
              Editor
            </Button>
          )}
        </Box>
      </ChakraProvider>
    </root.div>
  );
};

export default Editor;
