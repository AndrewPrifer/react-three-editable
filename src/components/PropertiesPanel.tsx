import React, { useCallback, useEffect, VFC } from 'react';
import { useForm, UseFormMethods } from 'react-hook-form';
import {
  Input,
  Box,
  FormControl,
  FormLabel,
  HStack,
  VisuallyHiddenInput,
  VStack,
  Heading,
} from '@chakra-ui/core';
import { useEditorStore } from '../store';
import { Euler, Matrix4, Quaternion, Vector3 } from 'three';
import shallow from 'zustand/shallow';

interface Vector3InputProps {
  register: UseFormMethods['register'];
  onBlur?: () => void;
  label: string;
  name: string;
}

const Vector3Input: VFC<Vector3InputProps> = ({
  register,
  onBlur,
  label,
  name,
}) => {
  return (
    <Box>
      <FormLabel>{label}</FormLabel>
      <HStack>
        {/*<Input name={`${name}X`} ref={register} onBlur={onBlur} />*/}
        <FormControl id={`${name}-x`}>
          <Input name={`${name}X`} ref={register} onBlur={onBlur} size="sm" />
        </FormControl>
        <FormControl id={`${name}-y`}>
          <Input name={`${name}Y`} ref={register} onBlur={onBlur} size="sm" />
        </FormControl>
        <FormControl id={`${name}-z`}>
          <Input name={`${name}Z`} ref={register} onBlur={onBlur} size="sm" />
        </FormControl>
      </HStack>
    </Box>
  );
};

type Inputs = {
  positionX: number;
  positionY: number;
  positionZ: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
};

const PropertiesPanel: VFC = () => {
  const [selected, setEditableTransform] = useEditorStore(
    (state) => [state.selected, state.setEditableTransform],
    shallow
  );

  const getFormValuesFromEditable = useCallback(() => {
    if (!selected) {
      return;
    }

    const position = new Vector3();
    const rotation = new Quaternion();
    const scale = new Vector3();

    useEditorStore
      .getState()
      // the ? is purely to accommodate hot reloading
      .editables[selected]?.transform.decompose(position, rotation, scale);

    const rotationEuler = new Euler();
    rotationEuler.setFromQuaternion(rotation);

    return {
      positionX: position.x,
      positionY: position.y,
      positionZ: position.z,
      rotationX: rotationEuler.x,
      rotationY: rotationEuler.y,
      rotationZ: rotationEuler.z,
      scaleX: scale.x,
      scaleY: scale.y,
      scaleZ: scale.z,
    };
  }, [selected]);

  const { handleSubmit, register, setValue, reset } = useForm<Inputs>({
    defaultValues: getFormValuesFromEditable(),
  });

  useEffect(() => {
    if (!selected) {
      return;
    }

    const formValues = getFormValuesFromEditable();
    if (formValues) {
      Object.entries(formValues).forEach(([key, value]) => {
        // avoids rerenders, unlike reset
        setValue(key, value);
      });
    }

    const unsub = useEditorStore.subscribe(
      () => {
        const formValues = getFormValuesFromEditable();
        if (formValues) {
          Object.entries(formValues).forEach(([key, value]) => {
            // avoids rerenders, unlike reset
            setValue(key, value);
          });
        }
      },
      (state) => state.editables[selected]
    );

    return () => unsub();
  }, [getFormValuesFromEditable, selected, setValue]);

  return selected ? (
    <Box
      overflow="scroll"
      width="300px"
      height="100%"
      p={5}
      bg="white"
      borderLeftWidth={1}
    >
      <form
        onSubmit={handleSubmit((values) => {
          const position = new Vector3(
            Number(values.positionX),
            Number(values.positionY),
            Number(values.positionZ)
          );
          const rotation = new Quaternion().setFromEuler(
            new Euler(
              Number(values.rotationX),
              Number(values.rotationY),
              Number(values.rotationZ)
            )
          );
          const scale = new Vector3(
            Number(values.scaleX),
            Number(values.scaleY),
            Number(values.scaleZ)
          );
          const transform = new Matrix4().compose(position, rotation, scale);
          setEditableTransform(selected, transform);
        })}
      >
        <VStack align="left">
          <Heading as="h3" size="lg" mb={3}>
            Properties
          </Heading>
          <Vector3Input
            register={register}
            onBlur={() => reset(getFormValuesFromEditable())}
            label="Position"
            name="position"
          />
          <Vector3Input
            register={register}
            onBlur={() => reset(getFormValuesFromEditable())}
            label="Rotation"
            name="rotation"
          />
          <Vector3Input
            register={register}
            onBlur={() => reset(getFormValuesFromEditable())}
            label="Scale"
            name="scale"
          />
        </VStack>
        {/* so that submitting with enter works */}
        <VisuallyHiddenInput type="submit" />
      </form>
    </Box>
  ) : null;
};

export default PropertiesPanel;
