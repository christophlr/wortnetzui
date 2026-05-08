import { defineConfig } from 'vite'
import path from 'path'
import { execSync } from 'node:child_process'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function getAppVersion() {
  try {
    const commitCount = execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim()
    if (/^\d+$/.test(commitCount)) {
      return `0.${commitCount}`
    }
  } catch {
    // Fall back in environments where git metadata is unavailable.
  }
  return '0.0'
}

export default defineConfig({
  base: '/wortnetzui/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(getAppVersion()),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
