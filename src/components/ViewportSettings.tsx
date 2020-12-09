import React, { VFC } from 'react';
import { useEditorStore } from '../store';
import shallow from 'zustand/shallow';
import { Checkbox, FormControl } from './elements';

const ViewportShadingSettings: VFC = () => {
  const [showOverlayIcons, setShowOverlayIcons] = useEditorStore(
    (state) => [state.showOverlayIcons, state.setShowOverlayIcons],
    shallow
  );

  return (
    <div>
      <FormControl>
        <Checkbox
          // @ts-ignore
          checked={showOverlayIcons}
          onChange={() => setShowOverlayIcons(!showOverlayIcons)}
        >
          Show overlay icons
        </Checkbox>
      </FormControl>
    </div>
  );
};

export default ViewportShadingSettings;
