import React, { VFC } from 'react';
import { Box, Flex, Button } from '@chakra-ui/core';
import TransformControlModeRadio from './TransformControlModeRadio';
import { useEditorStore } from '../store';
import shallow from 'zustand/shallow';
import ReferenceWindow from './ReferenceWindow';
import { saveAs } from 'file-saver';
import TransformControlsSpaceRadio from './TransformControlsSpaceRadio';

const UI: VFC = () => {
  const [
    editables,
    transformControlMode,
    transformControlsSpace,
    setTransformControlMode,
    setTransformControlsSpace,
    setEditorOpen,
  ] = useEditorStore(
    (state) => [
      state.editables,
      state.transformControlMode,
      state.transformControlsSpace,
      state.setTransformControlsMode,
      state.setTransformControlsSpace,
      state.setEditorOpen,
    ],
    shallow
  );

  return (
    <Box
      pos="absolute"
      top={0}
      bottom={0}
      left={0}
      right={0}
      zIndex={1005}
      margin="20px"
      pointerEvents="none"
    >
      {/* Top-left corner */}
      <ReferenceWindow height={200} />

      {/* Top row */}
      <Flex pos="absolute" left={0} right={0} top={0} justifyContent="center">
        <Box pointerEvents="all" mr={5}>
          <TransformControlModeRadio
            value={transformControlMode}
            onChange={(value) => setTransformControlMode(value)}
          />
        </Box>
        <Box pointerEvents="all">
          <TransformControlsSpaceRadio
            value={transformControlsSpace}
            onChange={setTransformControlsSpace}
          />
        </Box>
      </Flex>

      {/* Bottom-left corner*/}
      <Button
        pos="absolute"
        left={0}
        bottom={0}
        pointerEvents="all"
        onClick={() => setEditorOpen(false)}
      >
        Close
      </Button>

      {/* Bottom-right corner */}
      <Button
        pos="absolute"
        right={0}
        bottom={0}
        pointerEvents="all"
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
      </Button>
    </Box>
  );
};

export default UI;
