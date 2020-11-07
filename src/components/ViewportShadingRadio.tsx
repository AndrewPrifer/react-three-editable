import React, { ReactElement, VFC } from 'react';
import {
  useRadio,
  useRadioGroup,
  UseRadioProps,
  useId,
  IconButton,
  ButtonGroup,
} from '@chakra-ui/core';
import { IconType } from 'react-icons';
import { ViewportShading } from '../store';
import { FaCube, GiCube, GiIceCube, BiCube } from 'react-icons/all';

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

export interface ViewportShadingRadioProps {
  value: ViewportShading;
  onChange: (value: ViewportShading) => void;
}

const ViewportShadingRadio: VFC<ViewportShadingRadioProps> = ({
  value,
  onChange,
}) => {
  const controls: {
    [key in ViewportShading]: RadioCardProps;
  } = {
    wireframe: {
      label: 'Wireframe',
      icon: <BiCube />,
    },
    flat: {
      label: 'Flat',
      icon: <GiCube />,
    },
    solid: {
      label: 'Solid',
      icon: <FaCube />,
    },
    rendered: {
      label: 'Rendered',
      icon: <GiIceCube />,
    },
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'viewportShading',
    value,
    onChange,
  });

  const group = getRootProps();

  return (
    <ButtonGroup {...group} isAttached>
      {Object.entries(controls).map(([key, { label, icon }]) => (
        <RadioCard
          {...getRadioProps({ value: key })}
          label={label}
          icon={icon}
        />
      ))}
    </ButtonGroup>
  );
};

export default ViewportShadingRadio;
