import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type { ISessions } from '@deepseek-ai/dsh-api-session-controller/client'
type SessionId = Parameters<Pick<ISessions, 'subagentAddress'>['subagentAddress']>[0]

type SlotsApi = {
  inject(key: string, callback: () => () => void): void
  register(
    entry: {
      name: string
      id?: string
      key?: string
      order?: number
      priority?: number
      label?: string
      locale?: string
      inject?: (sessionId: SessionId) => Record<string, unknown>
    },
    component: unknown,
  ): () => void
}

/** The locale service this page reads its copy from (structural: the package is not a dependency). */
type LocaleApi = {
  bind(namespace: string): (key: string) => string
  register(namespace: string, dictionaries: Record<string, Record<string, string>>): () => void
  subscribe(listener: () => void): () => void
}

import { ModelControlsEntry } from './ModelControlsEntry'
import type { ModelDirectoryFace } from './model-catalog'
import { pickerCss } from './picker.css'
import { ModelControlsSettings, type ControlsForm, type ControlsTranslate } from './ModelControlsSettings'
import {
  PICKER_NS, SETTINGS_NS, format,
  pickerEn, pickerZh, settingsEn, settingsZh, type PickerKey, type SettingsKey, type Translate,
} from './locales'
export { ModelControlsSettings } from './ModelControlsSettings'

export { ModelControlsEntry } from './ModelControlsEntry'
export { ModelPickerButton } from './ModelPickerButton'
export { ModelPickerPanel } from './ModelPickerPanel'

/** Dictionary namespaces owned by this plugin. */
export const LOCALE_NS = SETTINGS_NS
export const PICKER_LOCALE_NS = PICKER_NS

function injectStylesOnce(): void {
  if (typeof document === 'undefined') return
  const existing = document.querySelector('style[data-plugin="dsh-std-model-picker"]')
  if (existing) {
    existing.textContent = pickerCss
    return
  }
  const style = document.createElement('style')
  style.dataset.plugin = 'dsh-std-model-picker'
  style.textContent = pickerCss
  document.head.appendChild(style)
}

export const inject = ['slots', 'sessions', 'remote', 'remote.session', 'modelDirectories', 'configForms', 'locale']

export function apply(ctx: ClientContext): void {
  injectStylesOnce()

  try {
    const slots = ctx.get('slots') as SlotsApi | undefined
    const forms = ctx.get('configForms') as { get(id: string): ControlsForm } | undefined
    const locale = ctx.get('locale') as LocaleApi | undefined
    if (locale) {
      ctx.effect(() => locale.register(SETTINGS_NS, { zh: settingsZh, en: settingsEn }), 'model-controls: settings dictionaries')
      ctx.effect(() => locale.register(PICKER_NS, { zh: pickerZh, en: pickerEn }), 'model-controls: picker dictionaries')
    }
    // 语言缺失时用中文兜底，界面仍可读；有语言服务时每帧重新绑定，跟随当前语言。
    const translate = <K extends string>(ns: string, fallback: Record<K, string>): Translate<K> => {
      const bound = locale === undefined ? undefined : locale.bind(ns) as (key: string) => string
      return (key, params) => format(bound === undefined ? fallback[key] : bound(key), params)
    }
    if (slots && forms) {
      const namespace = typeof window === 'undefined' ? 'dsh-std-model-picker'
        : (window as unknown as Record<string, unknown>).__DSH_MODEL_CONTROLS_NAMESPACE__
      const form = forms.get(typeof namespace === 'string' ? namespace : 'dsh-std-model-picker')
      const entry = () => ({
        name: 'plugins.bundle.config', key: '@kewen/dsh-model-controls', locale: SETTINGS_NS,
        inject: () => ({ form, t: translate<SettingsKey>(SETTINGS_NS, settingsZh) }),
      })
      slots.inject('plugins.bundle.config', () => {
        let dispose = slots.register(entry(), ModelControlsSettings)
        if (locale === undefined) return () => { dispose() }
        // 语言切换时官方不会重渲染别人的页面，注册方需要自己重注册（官方页面同款做法）。
        const off = locale.subscribe(() => {
          dispose()
          dispose = slots.register(entry(), ModelControlsSettings)
        })
        return () => { off(); dispose() }
      })
    }
    const sessions = ctx.get('sessions') as Pick<ISessions, 'subagentAddress'> | undefined
    const directories = ctx.get('modelDirectories') as { directoryFor(sessionId: SessionId): ModelDirectoryFace }
    if (slots) {
      slots.inject('conversation.input.model', () =>
        slots.register(
          {
            name: 'conversation.input.model',
            priority: -1,
            locale: PICKER_NS,
            inject: (sessionId: SessionId) => ({
              directory: directories.directoryFor(sessionId),
              available: sessions !== undefined
                && sessions.subagentAddress(sessionId) === undefined,
              t: translate<PickerKey>(PICKER_NS, pickerZh),
            }),
          },
          ModelControlsEntry,
        ),
      )
    }
  } catch (e) {
    console.warn('[model-picker] slot registration failed', e)
  }
}
