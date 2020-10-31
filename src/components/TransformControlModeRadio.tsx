import React, { ReactElement, VFC } from 'react';
import {
  Button,
  ButtonGroup,
  useRadio,
  useRadioGroup,
  UseRadioProps,
} from '@chakra-ui/core';
import { GiClockwiseRotation, GiMove, GiResize } from 'react-icons/gi';
import { IconType } from 'react-icons';
import { TransformControlMode } from '../store';

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

export interface TransformControlModeRadioProps {
  value: TransformControlMode;
  onChange: (value: TransformControlMode) => void;
}

const TransformControlModeRadio: VFC<TransformControlModeRadioProps> = ({
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
        {...getRadioProps({ value: 'translate' })}
        label="Translate"
        icon={<GiMove />}
      />
      <RadioCard
        {...getRadioProps({ value: 'rotate' })}
        label="Rotate"
        icon={<GiClockwiseRotation />}
      />
      <RadioCard
        {...getRadioProps({ value: 'scale' })}
        label="Scale"
        icon={<GiResize />}
      />
    </ButtonGroup>
  );
};

export default TransformControlModeRadio;
