import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import rollupNodePolyfills from 'rollup-plugin-polyfill-node';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      util: 'util/', // Ensure util is properly aliased
      process: 'process/browser',
      stream: 'stream-browserify',  // Add stream polyfill
      buffer: 'buffer',  // Add buffer polyfill if needed
    },
  },
  define: {
    'process.env': {}, // Ensure process is defined
    global: 'window', // Use window as the global object
  },
  optimizeDeps: {
    include: ['webex', 'util', 'stream-browserify', 'buffer'],
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyfills()],
    },
  },
});
