import React, { ReactElement, VFC } from 'react';
import {
  Button,
  ButtonGroup,
  useRadio,
  useRadioGroup,
  UseRadioProps,
} from '@chakra-ui/core';
import { IconType } from 'react-icons';
import { TransformControlsSpace } from '../store';
import { BiCube, BiGlobe } from 'react-icons/bi';

interface RadioCardProps extends UseRadioProps {
  label: string;
  icon: ReactElement<IconType>;
}

const RadioCard: VFC<RadioCardProps> = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <>
      <Button
        size="sm"
        leftIcon={props.icon}
        as="label"
        {...checkbox}
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
        }}
      >
        {props.label}
        <input {...input} />
      </Button>
    </>
  );
};

export interface TransformControlsSpaceRadioProps {
  value: TransformControlsSpace;
  onChange: (value: TransformControlsSpace) => void;
}

const TransformControlsSpaceRadio: VFC<TransformControlsSpaceRadioProps> = ({
  value,
  onChange,
}) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'transformControlsMode',
    value,
    onChange,
  });

  const group = getRootProps();

  return (
    <ButtonGroup {...group} isAttached>
      <RadioCard
        {...getRadioProps({ value: 'world' })}
        label="World"
        icon={<BiGlobe />}
      />
      <RadioCard
        {...getRadioProps({ value: 'local' })}
        label="Local"
        icon={<BiCube />}
      />
    </ButtonGroup>
  );
};

export default TransformControlsSpaceRadio;
