import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl =
    env.VITE_API_URL ||
    process.env.VITE_API_URL ||
    (mode === 'production'
      ? 'https://blog-application-2zat.onrender.com'
      : 'http://localhost:5000');

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.VITE_API_URL': JSON.stringify(apiUrl),
    },
  };
});
