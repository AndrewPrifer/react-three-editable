import React, { VFC } from 'react';
import { GiIceCube } from '@react-icons/all-files/gi/GiIceCube';
import { BiCube } from '@react-icons/all-files/bi/BiCube';
import { FaCube } from '@react-icons/all-files/fa/FaCube';
import { GiCube } from '@react-icons/all-files/gi/GiCube';
import { ViewportShading } from '../store';
import { CompactModeSelect } from './elements';
import ViewportShadingSettings from './ViewportShadingSettings';

export interface ViewportShadingSelectProps {
  value: ViewportShading;
  onChange: (value: ViewportShading) => void;
}

const ViewportShadingSelect: VFC<ViewportShadingSelectProps> = ({
  value,
  onChange,
}) => (
  <CompactModeSelect
    value={value}
    onChange={onChange}
    options={[
      {
        option: 'wireframe',
        label: 'Display: Wireframe',
        icon: <BiCube />,
      },
      {
        option: 'flat',
        label: 'Display: Flat',
        icon: <GiCube />,
      },
      {
        option: 'solid',
        label: 'Display: Solid',
        icon: <FaCube />,
      },
      {
        option: 'rendered',
        label: 'Display: Rendered',
        icon: <GiIceCube />,
      },
    ]}
    settingsPanel={<ViewportShadingSettings />}
  />
);

export default ViewportShadingSelect;
