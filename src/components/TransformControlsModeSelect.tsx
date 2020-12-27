import React, { VFC } from 'react';
import { GiResize } from '@react-icons/all-files/gi/GiResize';
import { GiMove } from '@react-icons/all-files/gi/GiMove';
import { GiClockwiseRotation } from '@react-icons/all-files/gi/GiClockwiseRotation';
import { TransformControlsMode } from '../store';
import { CompactModeSelect } from './elements';

export interface TransformControlsModeSelectProps {
  value: TransformControlsMode;
  onChange: (value: TransformControlsMode) => void;
}

const TransformControlsModeSelect: VFC<TransformControlsModeSelectProps> = ({
  value,
  onChange,
}) => (
  <CompactModeSelect
    value={value}
    onChange={onChange}
    options={[
      {
        option: 'translate',
        label: 'Tool: Translate',
        icon: <GiMove />,
      },
      {
        option: 'rotate',
        label: 'Tool: Rotate',
        icon: <GiClockwiseRotation />,
      },
      {
        option: 'scale',
        label: 'Tool: Scale',
        icon: <GiResize />,
      },
    ]}
  />
);

export default TransformControlsModeSelect;
