import React, { ComponentProps, forwardRef } from 'react';

export interface CodeProps extends ComponentProps<'code'> {
  block?: boolean;
}

const Code = forwardRef<HTMLElement, CodeProps>(
  ({ className, block, ...props }, ref) => {
    return (
      <code
        ref={ref}
        {...props}
        className={`${className} font-mono whitespace-pre bg-gray-200 rounded ${
          block ? 'block p-4' : 'inline p-1'
        }`}
      />
    );
  }
);

export default Code;
