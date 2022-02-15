import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      'react-three-editable': path.resolve(__dirname, '../src/index.tsx'),
    },
  },
  define: {
    global: 'window',
  },
  plugins: [reactRefresh()],
  server: {
    fsServe: {
      root: '..',
    },
  },
  optimizeDeps: {
    include: ['@theatre/studio'],
  },
});
