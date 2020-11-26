import React, { forwardRef } from 'react';
import { Button as ButtonImpl, ButtonProps } from 'reakit';

export { ButtonProps };

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return (
    <ButtonImpl
      ref={ref}
      {...props}
      className={`${props.className} inline-flex justify-center rounded-md px-4 py-2 font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring focus:ring-blue-300`}
    />
  );
});

export default Button;
