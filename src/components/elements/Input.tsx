import React, { forwardRef } from 'react';
import { Input as InputImpl, InputProps } from 'reakit';
import { useFormControlContext } from './FormControl';

export { InputProps };

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const id = useFormControlContext();

  return (
    <InputImpl
      // @ts-ignore
      ref={ref}
      {...props}
      id={props.id ?? id}
      className={`${props.className} w-full h-8 px-3 border rounded-sm focus:outline-none focus:ring focus:ring-blue-300`}
    />
  );
});

export default Input;
