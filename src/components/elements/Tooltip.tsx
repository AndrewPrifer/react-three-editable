import React, { VFC } from 'react';
import {
  Tooltip as TooltipImpl,
  TooltipReference,
  useTooltipState,
} from 'reakit';

import type { TooltipProps, TooltipReferenceProps } from 'reakit';

export type { TooltipProps, TooltipReferenceProps };

export { TooltipReference, useTooltipState };

export const Tooltip: VFC<TooltipProps> = ({ className, ...props }) => (
  <TooltipImpl
    // @ts-ignore
    {...props}
    className={`${className} px-2 py-1  text-white bg-gray-700 rounded-sm text-sm pointer-events-none shadow-md`}
  />
);
