import React, { VFC } from 'react';
import { useEditorStore } from '../store';
import shallow from 'zustand/shallow';
import { Checkbox, FormControl } from './elements';

const ViewportShadingSettings: VFC = () => {
  const [
    showOverlayIcons,
    showGrid,
    showAxes,
    setShowOverlayIcons,
    setShowGrid,
    setShowAxes,
  ] = useEditorStore(
    (state) => [
      state.showOverlayIcons,
      state.showGrid,
      state.showAxes,
      state.setShowOverlayIcons,
      state.setShowGrid,
      state.setShowAxes,
    ],
    shallow
  );

  return (
    <div className="flex flex-col gap-3">
      <FormControl>
        <Checkbox
          // @ts-ignore
          checked={showOverlayIcons}
          onChange={() => setShowOverlayIcons(!showOverlayIcons)}
        >
          Show overlay icons
        </Checkbox>
      </FormControl>
      <FormControl>
        <Checkbox
          // @ts-ignore
          checked={showGrid}
          onChange={() => setShowGrid(!showGrid)}
        >
          Show grid
        </Checkbox>
      </FormControl>
      <FormControl>
        <Checkbox
          // @ts-ignore
          checked={showAxes}
          onChange={() => setShowAxes(!showAxes)}
        >
          Show axes
        </Checkbox>
      </FormControl>
    </div>
  );
};

export default ViewportShadingSettings;
