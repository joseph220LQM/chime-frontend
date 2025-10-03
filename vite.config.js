import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss(),],
  define: {
    global: 'window', // 👈 truco para que global exista en el browser
  },
  optimizeDeps: {
    include: ['amazon-chime-sdk-js'],
  },
});