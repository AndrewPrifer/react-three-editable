import React, { VFC } from 'react';
import { TransformControlsSpace } from '../store';
import { CompactModeSelect } from './elements';
import { BiGlobe } from '@react-icons/all-files/bi/BiGlobe';
import { BiCube } from '@react-icons/all-files/bi/BiCube';

export interface TransformControlsSpaceSelectProps {
  value: TransformControlsSpace;
  onChange: (value: TransformControlsSpace) => void;
}

const TransformControlsSpaceSelect: VFC<TransformControlsSpaceSelectProps> = ({
  value,
  onChange,
}) => (
  <CompactModeSelect
    value={value}
    onChange={onChange}
    options={[
      {
        option: 'world',
        label: 'Space: World',
        icon: <BiGlobe />,
      },
      {
        option: 'local',
        label: 'Space: Local',
        icon: <BiCube />,
      },
    ]}
  />
);

export default TransformControlsSpaceSelect;
