import React, { VFC } from 'react';
import { GiClockwiseRotation, GiMove, GiResize } from 'react-icons/all';
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
