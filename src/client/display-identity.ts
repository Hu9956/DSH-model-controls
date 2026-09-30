import type { CatalogGroupSnapshot } from './model-catalog'
import { prettifyProviderName } from './provider-names'

interface DisplayProvider { name: string; icon?: 'magpie' }

/** Presentation only: the official provider ID remains the selection and storage key. */
function override(id: string): DisplayProvider | undefined {
  const payload: unknown = (window as unknown as Record<string, unknown>).__DSH_MODEL_PICKER_DISPLAY_PROVIDERS__
  if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) return undefined
  const entry: unknown = (payload as Record<string, unknown>)[id]
  if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) return undefined
  const { name, icon } = entry as Record<string, unknown>
  if (typeof name !== 'string' || name.trim() === '') return undefined
  return { name: name.trim(), ...(icon === 'magpie' ? { icon } : {}) }
}

export function displayProviderName(provider: CatalogGroupSnapshot): string {
  return override(provider.id)?.name ?? prettifyProviderName(provider.id, provider.name)
}

export function displayProviderIcon(provider: CatalogGroupSnapshot): { providerId: string; name: string } {
  const identity = override(provider.id)
  return { providerId: identity?.icon ?? provider.id, name: identity?.name ?? provider.name }
}
