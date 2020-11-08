import React, { useRef } from 'react';
import { Canvas } from 'react-three-fiber';
import { useEditorStore } from '../store';
import { OrbitControls } from '@react-three/drei';
import shallow from 'zustand/shallow';
import root from 'react-shadow/emotion';
import {
  ChakraProvider,
  PortalManager,
  Button,
  Box,
  Center,
  VStack,
  Heading,
  Text,
  Code,
} from '@chakra-ui/core';
import theme from '../theme';
import Proxy from './Proxy';
import UI from './UI';
import StaticSceneProxy from './StaticSceneProxy';

const EditorScene = () => {
  const orbitControlsRef = useRef<OrbitControls>();

  const [scene, editables, selected, setSelected] = useEditorStore(
    (state) => [
      state.scene,
      state.editables,
      state.selected,
      state.setSelected,
    ],
    shallow
  );

  return (
    <>
      {scene && <StaticSceneProxy scene={scene} />}

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
  const [scene, editorOpen, setEditorOpen, setSelected] = useEditorStore(
    (state) => [
      state.scene,
      state.editorOpen,
      state.setEditorOpen,
      state.setSelected,
    ],
    shallow
  );

  return (
    <root.div>
      <ChakraProvider theme={theme}>
        <PortalManager>
          <Box
            pos="relative"
            zIndex={1000}
            id="react-three-editable-editor-root"
          >
            {editorOpen ? (
              <Box pos="fixed" top={0} bottom={0} left={0} right={0}>
                {scene ? (
                  <>
                    <Canvas
                      colorManagement
                      camera={{ position: [5, 5, 5] }}
                      onCreated={({ gl }) => {
                        gl.setClearColor('white');
                      }}
                      shadowMap
                      pixelRatio={window.devicePixelRatio}
                      onPointerMissed={() => setSelected(null)}
                    >
                      <EditorScene />
                    </Canvas>
                    <UI />
                  </>
                ) : (
                  <Center bg="white" height="100vh">
                    <VStack spacing={5}>
                      <Heading mb={4} colorScheme="red">
                        No canvas has been connected
                      </Heading>
                      <Text>
                        Please use <Code>{'<EditableManager />'}</Code> to
                        connect a canvas to React Three Editable.
                      </Text>
                      <Code width="300px" p={3}>
                        <pre>
                          {
                            '<Canvas>\n  <EditableManager /> {/* !!! */}\n</Canvas>'
                          }
                        </pre>
                      </Code>
                      <Button
                        onClick={() => setEditorOpen(false)}
                        colorScheme="teal"
                      >
                        Close
                      </Button>
                    </VStack>
                  </Center>
                )}
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
        </PortalManager>
      </ChakraProvider>
    </root.div>
  );
};

export default Editor;
