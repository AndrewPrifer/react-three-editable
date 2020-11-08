import { extendTheme } from '@chakra-ui/core';
import { mode } from '@chakra-ui/theme-tools';

const theme = extendTheme({
  styles: {
    global: (props: any) => ({
      '#react-three-editable-editor-root': {
        fontFamily: 'body',
        color: mode('gray.800', 'whiteAlpha.900')(props),
        bg: mode('white', 'gray.800')(props),
        transition: 'background-color 0.2s',
        lineHeight: 'base',
      },
    }),
  },
});

export default theme;
