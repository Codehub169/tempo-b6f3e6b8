import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // The server port is configured via CLI argument `--port 9000` in startup.sh and package.json scripts
  // server: {
  //   port: 9000 
  // }
})
