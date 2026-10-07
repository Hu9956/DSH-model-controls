/**
 * Release check: install a packed tarball into a throwaway profile and prove the
 * artifact is self-consistent.
 *
 * It needs no harness checkout — only the DSH app's own pnpm (or `pnpm` on PATH).
 * The harness performs profile reconciliation itself (adding the package to
 * `dsh.profile.bundles`), so this script verifies what the artifact must already
 * be: a valid package that declares an installable bundle patch, loads its Host
 * half, and ships the expected client bundle. Passing two tarballs also checks
 * the upgrade path, which is where a bad version string bites.
 *
 * Usage:
 *   npm run check:install -- <new.tgz> [old.tgz]
 *   DSH_PNPM=/path/to/pnpm.cjs npm run check:install -- <new.tgz>
 */
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'
import assert from 'node:assert/strict'
import { parse as parseYaml } from 'yaml'

const APP_PNPM = '/Applications/DeepSeek Harness.app/Contents/Resources/runtime/pnpm/bin/pnpm.cjs'

/** Locate a pnpm to run: explicit override, the DSH app's own copy, then PATH. */
function resolvePnpm() {
  const override = process.env.DSH_PNPM
  if (override !== undefined && override !== '') return { command: process.execPath, prefix: [resolve(override)] }
  if (existsSync(APP_PNPM)) return { command: process.execPath, prefix: [APP_PNPM] }
  return { command: 'pnpm', prefix: [] }
}

/** Run pnpm in the profile directory, inheriting nothing but what it needs. */
function runPnpm(profile, args) {
  const { command, prefix } = resolvePnpm()
  const result = spawnSync(command, [...prefix, ...args, '--ignore-scripts'], {
    cwd: profile, encoding: 'utf8', env: { ...process.env, CI: '1' },
  })
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim()
  assert.equal(result.status, 0, `pnpm ${args.join(' ')} failed:\n${output}`)
  return output
}

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'))

/** Install one tarball and check everything the artifact itself must satisfy. */
async function installAndCheck(profile, tarball, expectedVersion, label, markers = null) {
  runPnpm(profile, ['add', tarball])
  const manifest = await readJson(join(profile, 'package.json'))
  const spec = Object.entries(manifest.dependencies ?? {}).find(([, value]) => String(value).includes(tarball))
  assert.ok(spec, `${label}: the dependency must record ${tarball}`)
  const [name] = spec

  const dir = join(profile, 'node_modules', ...name.split('/'))
  const installed = await readJson(join(dir, 'package.json'))
  assert.equal(installed.version, expectedVersion, `${label}: installed version must match the tarball`)

  // The bundle patch is what makes the package installable as a profile layer.
  const patch = installed.dsh?.bundle?.patch
  assert.ok(typeof patch === 'string', `${label}: package.json must declare dsh.bundle.patch`)
  const patchPath = resolve(dir, patch)
  assert.ok(patchPath.startsWith(dir + sep), `${label}: the patch must live inside the package`)
  assert.ok(existsSync(patchPath), `${label}: ${patch} must be shipped in the package`)
  const rows = parseYaml(await readFile(patchPath, 'utf8'))
  const inserted = Array.isArray(rows) ? rows.flatMap((layer) => layer?.insert ?? []) : []
  assert.equal(inserted.length, 1, `${label}: the patch must insert exactly one row`)
  assert.ok(inserted[0].id && inserted[0].name, `${label}: the inserted row needs an id and a name`)
  assert.equal(inserted[0].name, installed.name, `${label}: the inserted row must name this package`)

  // Host half: importable with only the profile's own dependencies.
  const host = await import(pathToFileURL(join(dir, 'lib', 'index.js')).href)
  assert.equal(typeof host.apply, 'function', `${label}: the Host half must export apply`)
  const config = host.Config({})
  assert.equal(typeof config.magpieBaseURL?.get, 'function', `${label}: the settings field must be a live value`)
  assert.equal(config.magpieBaseURL.get(), '', `${label}: the fallback address must default to empty`)

  // Client half: shipped as a browser bundle (content markers only for the version under test).
  const client = await readFile(join(dir, 'lib', 'client.js'), 'utf8')
  assert.ok(client.includes('__ModuleLoader__'), `${label}: the client half must be a loadable bundle`)
  for (const marker of markers ?? []) {
    assert.ok(client.includes(marker), `${label}: the client bundle must contain ${JSON.stringify(marker)}`)
  }
  return installed.version
}

/** Read the tarball's own package.json version, without unpacking the whole archive. */
function versionOf(tarball) {
  const result = spawnSync('tar', ['-xzOf', tarball, 'package/package.json'], { encoding: 'utf8' })
  assert.equal(result.status, 0, `could not read package.json from ${tarball}`)
  return JSON.parse(result.stdout).version
}

const [next, previous] = process.argv.slice(2)
assert.ok(next, 'usage: npm run check:install -- <new.tgz> [old.tgz]')
for (const tarball of [next, previous].filter(Boolean)) {
  assert.ok(existsSync(tarball), `no such tarball: ${tarball}`)
}

const profile = await mkdtemp(join(tmpdir(), 'dsh-install-check-'))
try {
  await writeFile(join(profile, 'package.json'), JSON.stringify({ name: 'dsh-install-check', private: true }, null, 2))
  if (previous !== undefined) {
    const before = await installAndCheck(profile, resolve(previous), versionOf(previous), 'previous')
    console.log(`previous installed: ${before}`)
  }
  const after = await installAndCheck(profile, resolve(next), versionOf(next),
    previous === undefined ? 'install' : 'upgrade',
    // 当前版本的文案标记：中英字典 + 搜索框间距修复
    ['Search models…', '搜索模型…', '0 12px 0 32px'])
  console.log(`${previous === undefined ? 'install' : 'upgrade'} ok: ${after}`)
  console.log('install check: PASS')
} finally {
  await rm(profile, { recursive: true, force: true })
}
