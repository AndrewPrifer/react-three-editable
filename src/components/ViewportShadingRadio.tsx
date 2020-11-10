import React, { ReactElement, VFC } from 'react';
import {
  useRadio,
  useRadioGroup,
  UseRadioProps,
  useId,
  IconButton,
  ButtonGroup,
  Tooltip,
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
      <Tooltip label={props.label} hasArrow>
        <IconButton
          cursor="pointer"
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
      label: 'Display: Wireframe',
      icon: <BiCube />,
    },
    flat: {
      label: 'Display: Flat',
      icon: <GiCube />,
    },
    solid: {
      label: 'Display: Solid',
      icon: <FaCube />,
    },
    rendered: {
      label: 'Display: Rendered',
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
          key={key}
          {...getRadioProps({ value: key })}
          label={label}
          icon={icon}
        />
      ))}
    </ButtonGroup>
  );
};

export default ViewportShadingRadio;
