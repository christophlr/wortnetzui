import { defineConfig } from 'vite'
import fs from 'node:fs'
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

function getLastCommitHash(): string {
  try {
    return execSync('git log -1 --format=%h', { encoding: 'utf8' }).trim()
  } catch {
    return 'unknown'
  }
}

function getLastCommitDate(): string {
  try {
    return execSync('git log -1 --format=%cI', { encoding: 'utf8' }).trim()
  } catch {
    return new Date().toISOString()
  }
}

function getBuildNumber(): string {
  const buildStateFile = path.resolve(__dirname, '.version-build-state.json')
  const appVersion = getAppVersion()
  try {
    const state = JSON.parse(fs.readFileSync(buildStateFile, 'utf8')) as { version?: string; buildCount?: number } | null
    if (state?.version === appVersion && Number.isInteger(state.buildCount) && state.buildCount > 0) {
      return `${appVersion}.${state.buildCount}`
    }
  } catch {
    // Fall back to the first build for the current commit when no build state exists yet.
  }
  return `${appVersion}.1`
}

export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/wortnetzui/' : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('/three/') || id.includes('three/examples/')) {
            return 'vendor-three';
          }

          if (id.includes('/@radix-ui/')) {
            return 'vendor-radix';
          }

          if (id.includes('lucide-react')) {
            return 'vendor-icons';
          }

          if (id.includes('@mui')) {
            return 'vendor-mui';
          }

          if (id.includes('recharts')) {
            return 'vendor-recharts';
          }

          if (id.includes('motion')) {
            return 'vendor-motion';
          }

          return 'vendor';
        },
      },
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(getAppVersion()),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    __BUILD_NUMBER__: JSON.stringify(getBuildNumber()),
    __LAST_COMMIT_HASH__: JSON.stringify(getLastCommitHash()),
    __LAST_COMMIT_DATE__: JSON.stringify(getLastCommitDate()),
  },
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
