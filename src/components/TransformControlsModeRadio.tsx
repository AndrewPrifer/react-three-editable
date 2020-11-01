import React, { ReactElement, VFC } from 'react';
import {
  IconButton,
  ButtonGroup,
  useRadio,
  useRadioGroup,
  useId,
  UseRadioProps,
} from '@chakra-ui/core';
import { GiClockwiseRotation, GiMove, GiResize } from 'react-icons/gi';
import { IconType } from 'react-icons';
import { TransformControlsMode } from '../store';

interface RadioCardProps extends UseRadioProps {
  label: string;
  icon: ReactElement<IconType>;
}

const RadioCard: VFC<RadioCardProps> = (props) => {
  const id = useId(props.id, `transformControlsModeRadio`);
  const { getInputProps, getCheckboxProps } = useRadio({ id, ...props });

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <>
      <IconButton
        aria-label={props.label}
        size="sm"
        icon={props.icon}
        as="label"
        htmlFor={input.id}
        {...checkbox}
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
        }}
      />
      <input {...input} />
    </>
  );
};

export interface TransformControlsModeRadioProps {
  value: TransformControlsMode;
  onChange: (value: TransformControlsMode) => void;
}

const TransformControlsModeRadio: VFC<TransformControlsModeRadioProps> = ({
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

export default TransformControlsModeRadio;
