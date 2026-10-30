/**
 * 官方 @deepseek-ai/dsh-client-ui-primitives 的安全垫片。
 *
 * 官方插件指南禁止插件 require 这个包：它随宿主改动、不另行通知。原先打包产物顶部是一句
 * 无保护的 require，包一旦缺失或改名，整个插件加载失败，连模型选择器按钮也起不来。
 * 这里改为 try/catch 加载、每个导出单独取值：缺什么只退化用到它的那一小块，并 console.warn 一次。
 *
 * 仍然借用官方的只有两块，都是复刻成本高、退化代价小的：
 * - Tooltip：缺失时只渲染 children（模型名截断后悬停不再出完整名，其余不受影响）；
 * - 设置表单（SettingsForm / SettingsValueField / SettingsFormModel）：三者缺一即整体视为缺失，
 *   设置页显示一句说明（见 ModelControlsSettings），不影响模型选择器按钮。
 * MenuSurface 与下拉箭头已改为插件自带（MenuSurface.tsx / chevron-icon.tsx），不经过这里。
 *
 * 类型仍用 import type（编译后不留 require），宿主 API 的形状由 typecheck 对着 devDependency 核对。
 */
import type * as React from 'react'
import type {
  SettingsForm as HostSettingsForm,
  SettingsFormModel as HostSettingsFormModel,
  SettingsValueField as HostSettingsValueField,
  Tooltip as HostTooltip,
} from '@deepseek-ai/dsh-client-ui-primitives'

// 宿主 __ModuleLoader__ 传给 factory 的 require（见 tsdown.config.ts 的 banner）。
// 模块表里没有该包时它直接抛错，所以必须包在 try 里；源码直接运行时不存在，typeof 兜住。
// 包名放进变量再调用：避免打包器把它识别成静态依赖、又提回文件顶部变成无保护的 require。
declare const require: ((id: string) => unknown) | undefined

const PRIMITIVES_ID = '@deepseek-ai/dsh-client-ui-primitives'

let warned = false
/** 只提示一次：缺失是宿主层面的状况，每处用到的组件各报一遍只会刷屏。 */
export function warnPrimitivesOnce(detail: string, error?: unknown): void {
  if (warned) return
  warned = true
  if (error === undefined) console.warn(`[model-picker] ${detail}`)
  else console.warn(`[model-picker] ${detail}`, error)
}

/** 加载宿主模块；任何失败都返回空表，缺失由下面逐个导出判定。 */
function loadHost(): { table: Record<string, unknown>; error?: unknown } {
  try {
    const load = typeof require === 'function' ? require : undefined
    if (load === undefined) return { table: {} }
    const mod = load(PRIMITIVES_ID)
    return { table: typeof mod === 'object' && mod !== null ? mod as Record<string, unknown> : {} }
  } catch (error) {
    return { table: {}, error }
  }
}

const host = loadHost()
const missing: string[] = []

/**
 * 取一个导出：取值本身也包 try（模块对象上可能是 getter），形状不对按缺失处理。
 * @param name - 导出名。
 * @param usable - 形状判定：组件是函数或 forwardRef/memo 对象，SettingsFormModel 必须是构造函数。
 */
function exportOf<T>(name: string, usable: (value: unknown) => boolean): T | undefined {
  let value: unknown
  try { value = host.table[name] } catch { value = undefined }
  if (usable(value)) return value as T
  missing.push(name)
  return undefined
}

const isComponent = (value: unknown): boolean =>
  typeof value === 'function' || (typeof value === 'object' && value !== null && '$$typeof' in value)
const isConstructor = (value: unknown): boolean =>
  typeof value === 'function' && (value as { prototype?: unknown }).prototype !== undefined

const hostTooltip = exportOf<typeof HostTooltip>('Tooltip', isComponent)
const hostSettingsForm = exportOf<typeof HostSettingsForm>('SettingsForm', isComponent)
const hostSettingsValueField = exportOf<typeof HostSettingsValueField>('SettingsValueField', isComponent)
const hostSettingsFormModel = exportOf<typeof HostSettingsFormModel>('SettingsFormModel', isConstructor)

if (missing.length > 0) {
  warnPrimitivesOnce(
    `${PRIMITIVES_ID} is missing ${missing.join(', ')}; name tooltips and/or the settings form are degraded, the model picker keeps working.`,
    host.error,
  )
}

/** Tooltip 退化：只渲染锚点本身，锚点自己的事件与 ref 原样保留。 */
function TooltipFallback({ children }: Parameters<typeof HostTooltip>[0]): React.JSX.Element {
  return children as React.JSX.Element
}

/** 宿主 Tooltip；缺失时退化为只渲染 children。 */
export const Tooltip: typeof HostTooltip = hostTooltip ?? TooltipFallback

/** 设置页依赖的官方表单三件套。 */
export interface SettingsKit {
  SettingsForm: typeof HostSettingsForm
  SettingsValueField: typeof HostSettingsValueField
  SettingsFormModel: typeof HostSettingsFormModel
}

/** 三件套齐全时才提供；缺任何一件都整体为 undefined，由设置页显示说明。 */
export const settingsKit: SettingsKit | undefined =
  hostSettingsForm !== undefined && hostSettingsValueField !== undefined && hostSettingsFormModel !== undefined
    ? { SettingsForm: hostSettingsForm, SettingsValueField: hostSettingsValueField, SettingsFormModel: hostSettingsFormModel }
    : undefined
