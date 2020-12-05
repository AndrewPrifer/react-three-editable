import React, { VFC } from 'react';
import { ViewportShading } from '../store';
import { FaCube, GiCube, GiIceCube, BiCube } from 'react-icons/all';
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
