// Host-shared module identities; React and UI primitives must stay external.
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
const PLATFORM_MODULES = [
  'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client', '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-store', '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-ui-primitives', '@deepseek-ai/dsh-client-ui-dockkit',
] as const

const id = '@dsh-std/model-picker'
const baseline = new Set<string>(PLATFORM_MODULES)
export default {
  entry: { client: 'src/client/index.ts' },
  outDir: 'lib',
  format: 'cjs',
  platform: 'browser',
  dts: false,
  sourcemap: true,
  clean: false,
  plugins: [{
    name: 'magpie-svg-raw',
    resolveId(source: string) {
      return source === './magpie.svg?raw'
        ? `${fileURLToPath(new URL('./src/client/magpie.svg', import.meta.url))}?raw`
        : null
    },
    async load(id: string) {
      const path = fileURLToPath(new URL('./src/client/magpie.svg', import.meta.url))
      if (id !== `${path}?raw`) return null
      this.addWatchFile(path)
      return `export default ${JSON.stringify(await readFile(path, 'utf8'))}`
    },
  }],
  deps: {
    neverBundle: (s: string) => baseline.has(s),
    alwaysBundle: (s: string) => !baseline.has(s),
  },
  define: {
    'process.env.NODE_ENV': '"production"',
    'import.meta.env': '{"MODE":"production"}',
  },
  outputOptions: {
    entryFileNames: 'client.js',
    banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(id)}, factory: (require) => {`,
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
}
