import React, { ReactElement, VFC } from 'react';
import {
  Box,
  VStack,
  Button,
  Heading,
  useRadioGroup,
  UseRadioProps,
  useRadio,
} from '@chakra-ui/core';
import { EditableType, useEditorStore } from '../store';
import { IconType } from 'react-icons';
import shallow from 'zustand/shallow';
import {
  BiSun,
  BsCameraVideoFill,
  BsFillCollectionFill,
  GiCube,
  GiLightBulb,
  GiLightProjector,
} from 'react-icons/all';

interface ObjectRadioButtonProps extends UseRadioProps {
  label: string;
  editableType: Exclude<EditableType, 'nil'>;
}

const ObjectRadioButton: VFC<ObjectRadioButtonProps> = ({
  label,
  editableType,
  ...props
}) => {
  const { getInputProps, getCheckboxProps } = useRadio({ ...props });

  const input = getInputProps();
  const checkbox = getCheckboxProps();

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
    <Button
      as="label"
      leftIcon={icon}
      cursor="pointer"
      width="full"
      variant="ghost"
      justifyContent="start"
      {...checkbox}
      _checked={{
        bg: 'teal.600',
        color: 'white',
        borderColor: 'teal.600',
      }}
    >
      <input {...input} />
      {label}
    </Button>
  );
};

const SceneOutlinePanel: VFC = () => {
  const [editables, selected, setSelected] = useEditorStore(
    (state) => [state.editables, state.selected, state.setSelected],
    shallow
  );

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'selectedObject',
    value: selected ?? '',
    onChange: (value) => void setSelected(value as string),
  });

  const group = getRootProps();

  return (
    <Box
      overflow="scroll"
      width="300px"
      height="100%"
      p={5}
      bg="white"
      borderRightWidth={1}
    >
      <VStack {...group} align="start">
        <Heading as="h3" size="lg" mb={3} ml={3}>
          Outline
        </Heading>
        {Object.entries(editables).map(
          ([name, editable]) =>
            editable.type !== 'nil' && (
              <ObjectRadioButton
                key={name}
                label={name}
                editableType={editable.type}
                {...getRadioProps({ value: name })}
              />
            )
        )}
      </VStack>
    </Box>
  );
};

export default SceneOutlinePanel;
