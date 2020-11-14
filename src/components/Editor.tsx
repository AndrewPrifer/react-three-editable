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
import UI from './UI';
import ProxyManager from './ProxyManager';

const EditorScene = () => {
  const orbitControlsRef = useRef<OrbitControls>();

  return (
    <>
      <gridHelper args={[30, 30, 30]} />
      <axesHelper />
      <OrbitControls ref={orbitControlsRef} />
      <ProxyManager orbitControlsRef={orbitControlsRef} />
    </>
  );
};

const Editor = () => {
  const [
    scene,
    editorOpen,
    setEditorOpen,
    setSelected,
    createSnapshot,
  ] = useEditorStore(
    (state) => [
      state.scene,
      state.editorOpen,
      state.setEditorOpen,
      state.setSelected,
      state.createSnapshot,
    ],
    shallow
  );

  return (
    <root.div>
      <ChakraProvider theme={theme}>
        <Box id="react-three-editable-editor-root">
          <PortalManager>
            <Box pos="relative" zIndex={1000}>
              <Box
                pos="fixed"
                d={editorOpen ? 'block' : 'none'}
                top={0}
                bottom={0}
                left={0}
                right={0}
              >
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
              {editorOpen || (
                <Button
                  pos="fixed"
                  bottom="20px"
                  left="20px"
                  onClick={() => {
                    if (!useEditorStore.getState().sceneSnapshot) {
                      createSnapshot();
                    }
                    setEditorOpen(true);
                  }}
                >
                  Editor
                </Button>
              )}
            </Box>
          </PortalManager>
        </Box>
      </ChakraProvider>
    </root.div>
  );
};

export default Editor;
