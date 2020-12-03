import React, { VFC } from 'react';
import TransformControlsModeSelect from './TransformControlsModeSelect';
import { useEditorStore } from '../store';
import shallow from 'zustand/shallow';
import ReferenceWindow from './ReferenceWindow';
import { saveAs } from 'file-saver';
import TransformControlsSpaceSelect from './TransformControlsSpaceSelect';
import ViewportShadingSelect from './ViewportShadingSelect';
import SceneOutlinePanel from './SceneOutlinePanel';
import PropertiesPanel from './PropertiesPanel';
import { RiFocus3Line } from 'react-icons/all';
import { Vector3 } from 'three';
import { IconButton, Button } from './elements';

const UI: VFC = () => {
  const [
    transformControlsMode,
    transformControlsSpace,
    viewportShading,
    setTransformControlsMode,
    setTransformControlsSpace,
    setViewportShading,
    setEditorOpen,
  ] = useEditorStore(
    (state) => [
      state.transformControlsMode,
      state.transformControlsSpace,
      state.viewportShading,
      state.setTransformControlsMode,
      state.setTransformControlsSpace,
      state.setViewportShading,
      state.setEditorOpen,
    ],
    shallow
  );

  return (
    <div className="absolute inset-0 z-50 pointer-events-none">
      <div className="flex h-full">
        <div className="w-min pointer-events-auto">
          <SceneOutlinePanel />
        </div>
        <div className="relative flex-1 m-5">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="pointer-events-auto">
                <TransformControlsModeSelect
                  value={transformControlsMode}
                  onChange={(value) => setTransformControlsMode(value)}
                />
              </div>
              <div className="pointer-events-auto">
                <TransformControlsSpaceSelect
                  value={transformControlsSpace}
                  onChange={setTransformControlsSpace}
                />
              </div>
              <div className="pointer-events-auto">
                <ViewportShadingSelect
                  value={viewportShading}
                  onChange={setViewportShading}
                />
              </div>
              <div className="pointer-events-auto">
                <IconButton
                  label="Focus on selected"
                  icon={<RiFocus3Line />}
                  onClick={() => {
                    const orbitControls = useEditorStore.getState()
                      .orbitControlsRef?.current;
                    const selected = useEditorStore.getState().selected;
                    let focusObject;

                    if (selected) {
                      focusObject = useEditorStore.getState()
                        .editablesSnapshot![selected].proxyObject;
                    }

                    if (orbitControls && focusObject) {
                      focusObject.getWorldPosition(
                        orbitControls.target as Vector3
                      );
                    }
                  }}
                />
              </div>
            </div>
            <ReferenceWindow height={120} />
          </div>

          {/* Bottom-left corner*/}
          <Button
            className="absolute left-0 bottom-0 pointer-events-auto"
            onClick={() => setEditorOpen(false)}
          >
            Close
          </Button>

          {/* Bottom-right corner */}
          <Button
            className="absolute right-0 bottom-0 pointer-events-auto"
            onClick={() => {
              const blob = new Blob(
                [JSON.stringify(useEditorStore.getState().serialize())],
                { type: 'text/json;charset=utf-8' }
              );
              saveAs(blob, 'editableState.json');
            }}
          >
            Export
          </Button>
        </div>
        <div className="w-min pointer-events-auto">
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
};

export default UI;
