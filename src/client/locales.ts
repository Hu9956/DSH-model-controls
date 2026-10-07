/**
 * Locale dictionaries for this plugin: the settings page and the picker panel.
 * Shared labels reuse the official DSH wording so both surfaces read the same.
 */

import type { SettingsFormLabels } from '@deepseek-ai/dsh-client-ui-primitives'

/** Namespace of the settings page's copy. */
export const SETTINGS_NS = 'settings.modelControls'
/** Namespace of the picker panel's copy. */
export const PICKER_NS = 'modelControls'

/** Reads one key for the active locale, optionally filling `{placeholders}`. */
export type Translate<K extends string> = (key: K, params?: Record<string, string | number>) => string

/** Fill `{name}` placeholders ourselves so the no-locale fallback behaves identically. */
export function format(template: string, params?: Record<string, string | number>): string {
  if (params === undefined) return template
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    Object.hasOwn(params, key) ? String(params[key]) : whole)
}

/** The form frame's copy, read from the page's dictionary. */
export function settingsFormLabels(t: Translate<SettingsKey>): SettingsFormLabels {
  return {
    save: t('save'), saving: t('saving'), unavailable: t('unavailable'),
    readOnly: t('readOnly'), saveFailed: t('saveFailed'),
  }
}

/** Settings-page locale keys. */
export type SettingsKey =
  | 'save' | 'saving' | 'unavailable' | 'readOnly' | 'saveFailed'
  | 'overridden' | 'reset' | 'invalid'
  | 'addressLabel' | 'addressHint' | 'addressPlaceholder' | 'addressHelpLabel'
  | 'addressHelpAutomatic' | 'addressHelpWhenToFill'

/** English copy for the settings page. */
export const settingsEn: Record<SettingsKey, string> = {
  save: 'Save',
  saving: 'Saving…',
  unavailable: 'This plugin is not loaded, so it cannot be configured right now.',
  readOnly: 'This deployment stores settings read-only.',
  saveFailed: 'The deployment did not accept these values; they were left for you to correct.',
  overridden: 'Overridden',
  reset: 'Reset to default',
  invalid: 'Enter a complete http:// or https:// address, without credentials, query or fragment.',
  addressLabel: 'Fallback Magpie base URL',
  addressHint: 'Usually left blank: an empty value detects Magpie from the running configuration.',
  addressPlaceholder: 'for example http://127.0.0.1:3425/v1',
  addressHelpLabel: 'About the fallback Magpie base URL',
  addressHelpAutomatic: 'Detected automatically by default: when the DeepSeek request uses Magpie credentials and points at this machine\'s /v1 endpoint, the model and favourite sources are labelled Magpie. Removing that route restores the original provider.',
  addressHelpWhenToFill: 'Only fill this in when a custom setup is not detected. The address must start with http:// or https://, without credentials, query parameters or fragments. Refresh the interface after switching routes.',
}

/** Simplified Chinese copy for the settings page. */
export const settingsZh: Record<SettingsKey, string> = {
  save: '保存',
  saving: '保存中…',
  unavailable: '正在读取设置，或插件当前未加载。',
  readOnly: '当前设置为只读。',
  saveFailed: '未能保存，请检查连接或配置后重试。',
  overridden: '已覆盖',
  reset: '恢复默认',
  invalid: '填写完整的 http:// 或 https:// 地址，不含账号密码、查询参数或片段。',
  addressLabel: '备用 Magpie 接口地址',
  addressHint: '通常留空：留空时按运行配置自动识别 Magpie 接入。',
  addressPlaceholder: '例如 http://127.0.0.1:3425/v1',
  addressHelpLabel: '备用 Magpie 接口地址说明',
  addressHelpAutomatic: '默认自动识别：请求使用 Magpie 凭据、且地址为本机的 /v1 接口时，模型与收藏来源显示为 Magpie；撤掉路由后恢复原供应商。',
  addressHelpWhenToFill: '只有自定义接入未被识别时才需要填写。地址须以 http:// 或 https:// 开头，不含账号密码、查询参数或片段。切换路由后刷新界面。',
}

/** Picker-panel locale keys. */
export type PickerKey =
  | 'searchNeutral' | 'searchFavorites' | 'searchProvider' | 'searchProviderShort'
  | 'dialogLabel' | 'providerRailLabel' | 'favoritesLabel' | 'favoriteAdd' | 'favoriteRemove'
  | 'providerReorderHint' | 'effortLabel'
  | 'emptyFavorites' | 'emptyNoMatch' | 'loadingCatalog' | 'loadFailed' | 'emptyProvider' | 'emptyCatalog'
  | 'partialProviders' | 'effortUnsupported'
  | 'modelFallback' | 'switchFailed' | 'triggerAria' | 'triggerAriaEffort'

/** English copy for the picker panel. */
export const pickerEn: Record<PickerKey, string> = {
  searchNeutral: 'Search models…',
  searchFavorites: 'Search favourites…',
  searchProvider: 'Search {name} models…',
  searchProviderShort: 'Search {name}…',
  dialogLabel: 'Choose a model',
  providerRailLabel: 'Providers',
  favoritesLabel: 'Favourites',
  favoriteAdd: 'Add to favourites',
  favoriteRemove: 'Remove from favourites',
  providerReorderHint: '{name} · hold to reorder (Alt + ↑/↓)',
  effortLabel: 'Reasoning effort',
  emptyFavorites: 'No favourites yet. Star a model to keep it here.',
  emptyNoMatch: 'No matching models.',
  loadingCatalog: 'Loading the model catalog…',
  loadFailed: 'Could not load the model catalog. Try again later.',
  emptyProvider: 'This provider lists no models.',
  emptyCatalog: 'No models available. Check the provider configuration.',
  partialProviders: 'Some providers\u2019 models could not be loaded. Check the provider configuration.',
  effortUnsupported: 'This model does not support effort settings',
  modelFallback: 'Model',
  switchFailed: 'Could not switch the model or the effort. Try again.',
  triggerAria: 'Choose a model, currently {model}',
  triggerAriaEffort: 'Choose a model, currently {model}, reasoning effort {effort}',
}

/** Simplified Chinese copy for the picker panel. */
export const pickerZh: Record<PickerKey, string> = {
  searchNeutral: '搜索模型…',
  searchFavorites: '搜索收藏模型…',
  searchProvider: '搜索 {name} 模型…',
  searchProviderShort: '搜索 {name}…',
  dialogLabel: '选择模型',
  providerRailLabel: '提供方',
  favoritesLabel: '收藏夹',
  favoriteAdd: '收藏',
  favoriteRemove: '取消收藏',
  providerReorderHint: '{name} · 长按拖动排序（Alt + ↑/↓）',
  effortLabel: '推理等级',
  emptyFavorites: '暂无收藏；点击模型行右侧的星标即可收藏。',
  emptyNoMatch: '没有匹配的模型。',
  loadingCatalog: '正在加载模型目录…',
  loadFailed: '模型目录加载失败，请稍后重试。',
  emptyProvider: '该提供方暂未公布模型。',
  emptyCatalog: '暂无可用模型，请检查提供方配置。',
  partialProviders: '部分提供方的模型未能加载，请检查提供方配置。',
  effortUnsupported: '当前模型不支持调节',
  modelFallback: '模型',
  switchFailed: '模型或档位切换失败，请重试。',
  triggerAria: '选择模型，当前 {model}',
  triggerAriaEffort: '选择模型，当前 {model}，推理等级 {effort}',
}
