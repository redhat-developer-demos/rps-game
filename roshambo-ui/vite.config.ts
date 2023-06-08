import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import basicSsl from '@vitejs/plugin-basic-ssl'
import env from 'env-var'

const SSL_ENABLED = env.get('SSL_ENABLED').asBool()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()].concat(SSL_ENABLED ? [basicSsl()] : []),
  server: {
    proxy: {
      '/game': {
        followRedirects: true,
        target: 'http://localhost:8080'
      }
    }
  }
})
