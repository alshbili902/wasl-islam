import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import os from 'os';

function getLocalNetworkIp(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const netList = interfaces[name];
    if (!netList) continue;
    for (const net of netList) {
      if (net.family === 'IPv4' && !net.internal && !net.address.startsWith('169.254.')) {
        return net.address;
      }
    }
  }
  return '192.168.8.103';
}

const lanIp = getLocalNetworkIp();

export default defineConfig({
  plugins: [react()],
  define: {
    __LAN_IP__: JSON.stringify(lanIp),
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    strictPort: false,
    cors: true,
  },
  preview: {
    port: 5173,
    host: '0.0.0.0',
    cors: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-hls': ['hls.js'],
          'vendor-adhan': ['adhan'],
        },
      },
    },
  },
});
