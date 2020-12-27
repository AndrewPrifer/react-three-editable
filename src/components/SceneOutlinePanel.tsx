import React, { ReactElement, VFC } from 'react';
import { EditableType, useEditorStore } from '../store';
import shallow from 'zustand/shallow';
import { Button as ButtonImpl, ButtonProps, Group } from 'reakit';
import { IconType } from '@react-icons/all-files';
import { BsFillCollectionFill } from '@react-icons/all-files/bs/BsFillCollectionFill';
import { GiLightProjector } from '@react-icons/all-files/gi/GiLightProjector';
import { BiSun } from '@react-icons/all-files/bi/BiSun';
import { GiCube } from '@react-icons/all-files/gi/GiCube';
import { GiLightBulb } from '@react-icons/all-files/gi/GiLightBulb';
import { BsCameraVideoFill } from '@react-icons/all-files/bs/BsCameraVideoFill';
import { Heading, Button } from './elements';

interface ObjectButtonProps extends ButtonProps {
  objectName: string;
  editableType: EditableType;
  selected: string | null;
}

const ObjectButton: VFC<ObjectButtonProps> = ({
  objectName,
  editableType,
  selected,
  ...props
}) => {
  let icon: ReactElement<IconType>;
  switch (editableType) {
    case 'group':
      icon = <BsFillCollectionFill />;
      break;
    case 'mesh':
      icon = <GiCube />;
      break;
    case 'pointLight':
      icon = <GiLightBulb />;
      break;
    case 'spotLight':
      icon = <GiLightProjector />;
      break;
    case 'directionalLight':
      icon = <BiSun />;
      break;
    case 'perspectiveCamera':
    case 'orthographicCamera':
      icon = <BsCameraVideoFill />;
  }

  return (
    <ButtonImpl
      // @ts-ignore
      {...props}
      className={`inline-flex justify-start items-center rounded-md px-4 py-2 font-medium focus:outline-none focus:ring focus:ring-blue-300 ${
        objectName === selected
          ? 'bg-green-800 hover:bg-green-900 text-white'
          : 'text-gray-700 hover:bg-gray-200'
      }`}
    >
      <span className="mr-2">{icon}</span>
      {objectName}
    </ButtonImpl>
  );
};

const SceneOutlinePanel: VFC = () => {
  const [
    editablesSnapshot,
    selected,
    setSelected,
    createSnapshot,
  ] = useEditorStore(
    (state) => [
      state.editablesSnapshot,
      state.selected,
      state.setSelected,
      state.createSnapshot,
    ],
    shallow
  );

  if (editablesSnapshot === null) {
    return null;
  }

  return (
    <div className="flex flex-col overflow-y-auto w-80 h-full p-5 border-r bg-white">
      <Heading className="mb-5 ml-3 text-3xl">Outline</Heading>
      <Group
        // @ts-ignore
        className="flex flex-col gap-3 flex-1"
      >
        {Object.entries(editablesSnapshot).map(
          ([name, editable]) =>
            editable.role === 'active' && (
              <ObjectButton
                key={name}
                objectName={name}
                editableType={editable.type}
                selected={selected}
                onClick={() => {
                  setSelected(name);
                }}
              />
            )
        )}
      </Group>
      <div className="flex-0 mt-3">
        <Button
          className="w-full"
          onClick={() => {
            createSnapshot();
          }}
        >
          Sync editor
        </Button>
      </div>
    </div>
  );
};

export default SceneOutlinePanel;
