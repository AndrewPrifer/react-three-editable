import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  VFC,
} from 'react';
import { Canvas, useThree } from 'react-three-fiber';
import { useEditorStore } from '../store';
import { OrbitControls } from '@react-three/drei';
import shallow from 'zustand/shallow';
import root from 'react-shadow';
import styles from '../styles.css';
import UI from './UI';
import ProxyManager from './ProxyManager';
import {
  Button,
  Heading,
  Code,
  PortalManager,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  IdProvider,
} from './elements';

const EditorScene = () => {
  const orbitControlsRef = useRef<OrbitControls>();
  const { camera } = useThree();

  const setOrbitControlsRef = useEditorStore(
    (state) => state.setOrbitControlsRef
  );

  useEffect(() => {
    setOrbitControlsRef(orbitControlsRef);
  }, [camera, setOrbitControlsRef]);

  return (
    <>
      <gridHelper args={[30, 30, 30]} />
      <axesHelper />
      <OrbitControls ref={orbitControlsRef} />
      <ProxyManager orbitControlsRef={orbitControlsRef} />
    </>
  );
};

const Editor: VFC = () => {
  const [
    scene,
    editorOpen,
    initialState,
    setEditorOpen,
    setSelected,
    createSnapshot,
    isPersistedStateDifferentThanInitial,
    applyPersistedState,
  ] = useEditorStore(
    (state) => [
      state.scene,
      state.editorOpen,
      state.initialState,
      state.setEditorOpen,
      state.setSelected,
      state.createSnapshot,
      state.isPersistedStateDifferentThanInitial,
      state.applyPersistedState,
    ],
    shallow
  );

  const [stateMismatch, setStateMismatch] = useState(false);

  useLayoutEffect(() => {
    if (initialState) {
      setStateMismatch(isPersistedStateDifferentThanInitial());
    } else {
      applyPersistedState();
    }
  }, [applyPersistedState, initialState, isPersistedStateDifferentThanInitial]);

  return (
    <root.div>
      <div id="react-three-editable-editor-root">
        <PortalManager>
          <IdProvider>
            <div className="relative z-50">
              <div
                className={`fixed ${editorOpen ? 'block' : 'hidden'} inset-0`}
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
                  <div className="flex justify-center items-center bg-white h-screen">
                    <div className="flex flex-col gap-5 items-center ">
                      <Heading className="mb-4">No canvas connected</Heading>
                      <p>
                        Please use <Code>{'<EditableManager />'}</Code> to
                        connect a canvas to React Three Editable.
                      </p>
                      <Code block>
                        {
                          '<Canvas>\n  <EditableManager /> {/* !!! */}\n</Canvas>'
                        }
                      </Code>
                      <Button
                        className=""
                        onClick={() => {
                          setEditorOpen(false);
                        }}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              {editorOpen || (
                <Button
                  className="fixed bottom-5 left-5"
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
            </div>
            <Modal visible={stateMismatch}>
              <ModalHeader>Saved state found</ModalHeader>
              <ModalBody>
                Would you like to use initial state or saved state?
              </ModalBody>
              <ModalFooter>
                <Button
                  className="flex-1"
                  onClick={() => {
                    applyPersistedState();
                    setStateMismatch(false);
                  }}
                >
                  Saved
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    setStateMismatch(false);
                  }}
                >
                  Initial
                </Button>
              </ModalFooter>
            </Modal>
            <style type="text/css">{styles}</style>
            <style>{'canvas { outline: none }'}</style>
          </IdProvider>
        </PortalManager>
      </div>
    </root.div>
  );
};

export default Editor;
