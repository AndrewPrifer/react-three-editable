import React, { ComponentProps, forwardRef } from 'react';

export type HeadingProps = ComponentProps<'h1'>;

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>((props, ref) => {
  return (
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h1 ref={ref} {...props} className={`${props.className} font-bold`} />
  );
});

export default Heading;
