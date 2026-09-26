import { spawnSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const commands = {
  typecheck: [['tsc', '--noEmit', '-p', 'tsconfig.json']],
  bundle: [['tsc', '--noEmit', '-p', 'tsconfig.json'], ['tsdown']],
}
const mode = process.argv[2] ?? 'bundle'
if (!(mode in commands)) throw new Error(`Unknown Model Picker task: ${mode}`)
for (const [tool, ...args] of commands[mode]) {
  const result = spawnSync(resolve(here, 'node_modules/.bin', tool), args, { cwd: here, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}
if (mode === 'bundle') {
  mkdirSync(resolve(here, 'lib'), { recursive: true })
  writeFileSync(resolve(here, 'lib/index.js'), 'export function apply() {}\n')
}
