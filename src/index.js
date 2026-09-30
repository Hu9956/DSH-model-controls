/** Host half: publish explicitly configured display identities to the browser. */
export function apply(ctx, config = {}) {
  const providers = config.displayProviders
  if (providers === undefined || providers === null || typeof providers !== 'object' || Array.isArray(providers)) return
  const displayProviders = {}
  for (const [id, value] of Object.entries(providers)) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) continue
    if (typeof value.name !== 'string' || value.name.trim() === '') continue
    displayProviders[id] = {
      name: value.name.trim(),
      // Only bundled icon keys are accepted; never load arbitrary URLs or markup.
      icon: value.icon === 'magpie' ? 'magpie' : undefined,
    }
  }
  ctx.on('webserver/index-inject', table => {
    table.push({ kind: 'global', name: '__DSH_MODEL_PICKER_DISPLAY_PROVIDERS__', value: displayProviders })
  })
}
