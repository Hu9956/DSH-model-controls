import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type { ISessions } from '@deepseek-ai/dsh-api-session-controller/client'
type SessionId = Parameters<Pick<ISessions, 'subagentAddress'>['subagentAddress']>[0]

type SlotEntry = {
  component: unknown
  children?: Record<string, unknown>
}

type SlotsApi = {
  inject(key: string, callback: () => () => void): void
  entries?(key: string): readonly SlotEntry[]
  subscribe?(key: string, listener: () => void): () => void
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

import { injectPluginStyles, mountDshUiStyles } from '@kewen/dsh-ui'
import { ModelControlsEntry } from './ModelControlsEntry'
import type { ModelDirectoryFace } from './model-catalog'
import { pickerCss } from './picker.css'
import { startPrefsSync } from './prefs-sync'
import { getFavoriteSet, getModelEfforts, replaceFavorites, replaceModelEfforts } from './picker-data'
import { getProviderOrder, replaceProviderOrder } from './provider-order'
import { ModelControlsSettings, type ControlsForm } from './ModelControlsSettings'
import {
  PICKER_NS, SETTINGS_NS, format,
  pickerEn, pickerZh, settingsEn, settingsZh, type PickerKey, type SettingsKey, type Translate,
} from './locales'
import { ModelPickerPanel } from './ModelPickerPanel'
export { ModelControlsSettings } from './ModelControlsSettings'

export { ModelControlsEntry } from './ModelControlsEntry'
export { ModelPickerButton } from './ModelPickerButton'
export { ModelPickerPanel }

/** Dictionary namespaces owned by this plugin. */
export const LOCALE_NS = SETTINGS_NS
export const PICKER_LOCALE_NS = PICKER_NS

/**
 * 挂载 @kewen/dsh-ui 共享样式块（引用计数版本仲裁）与本插件私有样式表，返回幂等组合清理函数。
 */
export function mountStyles(): () => void {
  const disposeUi = mountDshUiStyles()
  const disposePlugin = injectPluginStyles('@kewen/dsh-model-controls', pickerCss)
  let disposed = false
  return () => {
    if (disposed) return
    disposed = true
    disposePlugin()
    disposeUi()
  }
}

// 数组形式的 inject 全是必需服务：任一缺失插件停在 PENDING，apply 不会运行。
// remote / remote.session 必须列：本插件代码不直接读，但 modelDirectories.directoryFor 是经本插件
// ctx 的代理执行的，会读 remote.session；不列就抛 `cannot get property "remote.session" without inject`，
// 官方 SlotErrorBoundary 让本条目让位，按钮退回官方样式（0.2.36 删掉它们，用户 10-30 报「时好时坏」）。
export const inject = ['slots', 'sessions', 'remote', 'remote.session', 'modelDirectories', 'configForms', 'locale']

export function apply(ctx: ClientContext): void {
  if (typeof window !== 'undefined' && window !== null) {
    const w = window as unknown as Record<string, unknown>
    w.__DSH_MODEL_PICKER_SHARED__ = { ModelPickerPanel }
    if (typeof ctx.effect === 'function') {
      ctx.effect(() => () => {
        if (w.__DSH_MODEL_PICKER_SHARED__ !== undefined) delete w.__DSH_MODEL_PICKER_SHARED__
      }, 'model-controls: shared panel')
    }
  }
  const disposeStyles = mountStyles()
  if (typeof ctx.effect === 'function') {
    ctx.effect(() => disposeStyles, 'model-controls: styles')
  }
  // 收藏 / 思考强度记忆 / 供应商顺序与 DSH 宿主同步，电脑和手机共用一份。
  // 测试里的假 ctx 没有 effect；真实 cordis 总有。
  if (typeof ctx.effect === 'function') ctx.effect(() => startPrefsSync({
    local: () => ({ favorites: [...getFavoriteSet()], efforts: getModelEfforts(), providerOrder: getProviderOrder() }),
    replace: prefs => {
      replaceFavorites(prefs.favorites)
      replaceModelEfforts(prefs.efforts)
      replaceProviderOrder(prefs.providerOrder)
    },
  }), 'model-controls: prefs sync')

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
    const directories = ctx.get('modelDirectories') as { directoryFor(sessionId: SessionId): ModelDirectoryFace } | undefined
    // 真实宿主里服务缺失时插件停在 PENDING、apply 不会运行；这些 undefined 判断只用来兼容
    // 测试的假 ctx 或非 cordis 调用方（bundle.test 故意不给 locale）。
    // inject 回调是延迟执行的，外层 try 兜不住，这里仍显式跳过注册。
    if (slots && directories !== undefined && typeof directories.directoryFor === 'function') {
      slots.inject('conversation.input.model', () => {
        const dispose = slots.register(
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
        )
        if (typeof slots.entries !== 'function' || typeof slots.subscribe !== 'function') {
          return dispose
        }
        // RC2 起官方 ModelSelect 在 conversation.input.model 上声明了子插槽（如 conversation.input.model.options，
        // 承载 Agent 团队模式开关）。不可枚举地借到本注册上：renderSlot 可按名查找，卸载时宿主不会误撤官方声明。
        const entriesOf = slots.entries.bind(slots)
        const own = () => entriesOf('conversation.input.model').find(e => e.component === ModelControlsEntry)
        let borrowed: Record<string, unknown> | undefined
        const borrow = () => {
          const mine = own()
          const official = entriesOf('conversation.input.model').find(
            e => e.component !== ModelControlsEntry && e.children !== undefined,
          )
          if (mine === undefined || official?.children === undefined || borrowed === official.children) return
          const view: Record<string, unknown> = {}
          for (const [key, spec] of Object.entries(official.children)) {
            Object.defineProperty(view, key, { value: spec, enumerable: false })
          }
          mine.children = view
          borrowed = official.children
        }
        borrow()
        const unsubscribe = slots.subscribe('conversation.input.model', borrow)
        return () => {
          unsubscribe()
          const mine = own()
          if (mine !== undefined) delete mine.children
          dispose()
        }
      })
    }
  } catch (e) {
    console.warn('[model-picker] slot registration failed', e)
  }
}
