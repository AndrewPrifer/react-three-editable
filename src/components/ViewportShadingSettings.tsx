import React, { VFC } from 'react';
import { useEditorStore } from '../store';
import shallow from 'zustand/shallow';
import EnvironmentPreview from './EnvironmentPreview';
import { Heading } from './elements';

const ViewportShadingSettings: VFC = () => {
  const [hdrPaths, selectedHdr, setSelectedHdr] = useEditorStore(
    (state) => [state.hdrPaths, state.selectedHdr, state.setSelectedHdr],
    shallow
  );

  return (
    <div className="w-full">
      <Heading className="text-xl mb-3">Environment</Heading>
      <div className="grid grid-cols-2 gap-4 auto-rows-16">
        <EnvironmentPreview
          url={null}
          selected={selectedHdr === null}
          onClick={() => {
            setSelectedHdr(null);
          }}
        />
        {hdrPaths.map((hdrPath) => (
          <EnvironmentPreview
            url={hdrPath}
            selected={hdrPath === selectedHdr}
            onClick={() => {
              setSelectedHdr(hdrPath);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ViewportShadingSettings;
