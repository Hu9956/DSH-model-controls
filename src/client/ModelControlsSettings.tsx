import * as React from 'react'
import type { SettingsFormModel, SettingsFormScope } from '@deepseek-ai/dsh-client-ui-primitives'
import { settingsKit, warnPrimitivesOnce, type SettingsKit } from './host-primitives'
import { settingsFormLabels, type SettingsKey, type Translate } from './locales'

export type ControlsForm = SettingsFormScope<{ magpieBaseURL?: string; compactModelNames?: string }>

/** The page's localized copy reader, injected by the client half's slot registration. */
export type ControlsTranslate = Translate<SettingsKey>

export interface ModelControlsSettingsProps {
  view?: 'summary' | 'page'
  form: ControlsForm
  t: ControlsTranslate
}

/**
 * 与 Host schema（src/index.js 的 magpieBaseURL.pattern）同一条正则，改动须两边同步。
 * 不能共享常量：src/index.js 原样拷进 lib/index.js，无法 import 客户端模块。
 * 只靠 new URL 判定会放过 `…/v1?`、`…/v1#`、`Http://…`、路径带空格这类 Host 会拒的写法，
 * 页面不提示、保存时才笼统失败。
 */
const HOST_ADDRESS_PATTERN = /^(?:|https?:\/\/[^/\s@?#]+(?:\/[^?\s#]*)?)$/

/** Whether draft text is an endpoint this plugin can compare against the running route. */
function acceptAddress(text: string): { kind: 'set'; value: string } | undefined {
  const value = text.trim()
  if (value === '') return { kind: 'set', value: '' }
  if (!HOST_ADDRESS_PATTERN.test(value)) return undefined
  // 正则之后仍做 URL 解析：挡住 `http://:::` 这类正则放过、但解析不了的地址。提交原样的 value，不做规范化。
  try {
    const url = new URL(value)
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) return undefined
    return { kind: 'set', value }
  } catch { return undefined }
}

/** Whether draft text is a model-name preference this plugin accepts; empty clears it. */
function acceptCompactNames(text: string): { kind: 'set'; value: string } | { kind: 'clear' } | undefined {
  const value = text.trim().toLowerCase()
  if (value === '') return { kind: 'clear' }
  return value === 'on' || value === 'off' ? { kind: 'set', value } : undefined
}

/**
 * The plugin's settings page: one optional override for a Magpie endpoint the
 * automatic check cannot recognize. An empty value keeps automatic detection.
 * @param props - the requested view, the entry's form, and this page's locale reader.
 * @returns the localized settings form.
 */
export function ModelControlsSettings(props: ModelControlsSettingsProps) {
  // 官方表单组件缺失时只退化这一页：显示一句说明，模型选择器按钮不受影响。
  if (settingsKit === undefined) return <FormUnavailable t={props.t} />
  return <SettingsCard {...props} kit={settingsKit} />
}

/** 官方表单不可用时的占位：一句说明，用宿主的说明文字色。 */
function FormUnavailable({ t }: { t: ControlsTranslate }) {
  return <p style={{ margin: 0, color: 'var(--dsw-alias-label-secondary)' }}>{t('formUnavailable')}</p>
}

/** SettingsFormModel 实例要用到的方法；构造出的对象缺任何一个都按不可用处理。 */
const MODEL_METHODS = ['bind', 'shell', 'field', 'actions', 'dispose'] as const

/**
 * 构造官方表单模型；构造抛错或实例形状不符（宿主改了 API）时返回 undefined，并提示一次。
 * 不在这里兜住，错误会冒到官方 SlotErrorBoundary，整页变空白且没有说明。
 */
function createModel(kit: SettingsKit, form: ControlsForm): SettingsFormModel<unknown> | undefined {
  try {
    const model = new kit.SettingsFormModel(form, [{
      field: 'magpieBaseURL',
      format: value => typeof value === 'string' ? value : '',
      parse: acceptAddress,
    }, {
      field: 'compactModelNames',
      format: value => typeof value === 'string' ? value : '',
      parse: acceptCompactNames,
    }]) as SettingsFormModel<unknown>
    const record = model as unknown as Record<string, unknown>
    if (MODEL_METHODS.every(name => typeof record[name] === 'function')) return model
    warnPrimitivesOnce('SettingsFormModel no longer has the expected methods; the settings page is unavailable.')
  } catch (error) {
    warnPrimitivesOnce('SettingsFormModel could not be created; the settings page is unavailable.', error)
  }
  return undefined
}

function SettingsCard({ form, t, kit }: ModelControlsSettingsProps & { kit: SettingsKit }) {
  const model = React.useMemo(() => createModel(kit, form), [kit, form])
  if (model === undefined) return <FormUnavailable t={t} />
  return <SettingsFields model={model} t={t} kit={kit} />
}

function SettingsFields({ model, t, kit }: { model: SettingsFormModel<unknown>; t: ControlsTranslate; kit: SettingsKit }) {
  const { SettingsForm, SettingsValueField } = kit
  const store = React.useMemo(() => model.bind(() => ({
    ...model.shell(),
    address: model.field('magpieBaseURL'),
    compact: model.field('compactModelNames'),
  })), [model])
  const state = React.useSyncExternalStore(listener => store.subscribe(listener), () => store.getSnapshot())
  React.useEffect(() => () => model.dispose(), [model])
  const actions = model.actions()
  return <SettingsForm state={state} onSave={actions.save} onDiscard={actions.discard} labels={settingsFormLabels(t)}>
    <SettingsValueField id="dsh-model-controls-compact" label={t('compactNamesLabel')}
      hint={t('compactNamesHint')}
      placeholder={t('compactNamesPlaceholder')}
      help={{ label: t('compactNamesHelpLabel'), content: <>
        <p>{t('compactNamesHelpOn')}</p>
        <p>{t('compactNamesHelpOff')}</p>
      </> }}
      overriddenLabel={t('overridden')} resetLabel={t('reset')}
      invalidLabel={t('compactNamesInvalid')}
      disabled={!state.writable || state.saving} {...state.compact}
      onEdit={text => actions.edit('compactModelNames', text)} onReset={() => actions.resetField('compactModelNames')} />
    <SettingsValueField id="dsh-model-controls-magpie" label={t('addressLabel')}
      hint={t('addressHint')}
      placeholder={t('addressPlaceholder')}
      help={{ label: t('addressHelpLabel'), content: <>
        <p>{t('addressHelpAutomatic')}</p>
        <p>{t('addressHelpWhenToFill')}</p>
      </> }}
      overriddenLabel={t('overridden')} resetLabel={t('reset')}
      invalidLabel={t('invalid')}
      disabled={!state.writable || state.saving} {...state.address}
      onEdit={text => actions.edit('magpieBaseURL', text)} onReset={() => actions.resetField('magpieBaseURL')} />
  </SettingsForm>
}
