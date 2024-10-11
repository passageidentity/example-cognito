import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(() => {
  const env = loadEnv('', '.');
  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT) || 8081,
    },
  };
});
