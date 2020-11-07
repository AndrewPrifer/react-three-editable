import React, { ReactElement, VFC } from 'react';
import {
  ButtonGroup,
  IconButton,
  Tooltip,
  useId,
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
  const id = useId(props.id, `transformControlsModeRadio`);
  const { getInputProps, getCheckboxProps } = useRadio({ id, ...props });

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <>
      <Tooltip label={props.label} hasArrow>
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
      </Tooltip>
      <input {...input} />
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
        label="Space: World"
        icon={<BiGlobe />}
      />
      <RadioCard
        {...getRadioProps({ value: 'local' })}
        label="Space: Local"
        icon={<BiCube />}
      />
    </ButtonGroup>
  );
};

export default TransformControlsSpaceRadio;
