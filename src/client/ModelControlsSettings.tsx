import * as React from 'react'
import { SettingsForm, SettingsValueField, SettingsFormModel, type SettingsFormScope } from '@deepseek-ai/dsh-client-ui-primitives'

export type ControlsForm = SettingsFormScope<{ magpieBaseURL?: string }>

/** Whether draft text is an endpoint this plugin can compare against the running route. */
function acceptAddress(text: string): { kind: 'set'; value: string } | undefined {
  const value = text.trim()
  if (value === '') return { kind: 'set', value: '' }
  try {
    const url = new URL(value)
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) return undefined
    return { kind: 'set', value }
  } catch { return undefined }
}

/**
 * The plugin's settings page: one optional override for a Magpie endpoint the
 * automatic check cannot recognize. An empty value keeps automatic detection.
 */
export function ModelControlsSettings({ form }: { view?: string; form: ControlsForm }) {
  const model = React.useMemo(() => new SettingsFormModel(form, [{
    field: 'magpieBaseURL',
    format: value => typeof value === 'string' ? value : '',
    parse: acceptAddress,
  }]), [form])
  const store = React.useMemo(() => model.bind(() => ({ ...model.shell(), address: model.field('magpieBaseURL') })), [model])
  const state = React.useSyncExternalStore(listener => store.subscribe(listener), () => store.getSnapshot())
  React.useEffect(() => () => model.dispose(), [model])
  const actions = model.actions()
  return <SettingsForm state={state} onSave={actions.save} onDiscard={actions.discard} labels={{
    save: '保存', saving: '保存中…', unavailable: '正在读取设置，或插件当前未加载。',
    readOnly: '当前设置为只读。', saveFailed: '未能保存，请检查连接或配置后重试。',
  }}>
    <SettingsValueField id="dsh-model-controls-magpie" label="备用 Magpie 接口地址"
      hint="通常留空：留空时按运行配置自动识别 Magpie 接入。"
      placeholder="例如 http://127.0.0.1:3425/v1"
      help={{ label: '备用 Magpie 接口地址说明', content: <>
        <p>默认自动识别：请求使用 Magpie 凭据、且地址为本机的 /v1 接口时，模型与收藏来源显示为 Magpie；撤掉路由后恢复原供应商。</p>
        <p>只有自定义接入未被识别时才需要填写。地址须以 http:// 或 https:// 开头，不含账号密码、查询参数或片段。切换路由后刷新界面。</p>
      </> }}
      overriddenLabel="已覆盖" resetLabel="恢复默认"
      invalidLabel="填写完整的 http:// 或 https:// 地址，不含账号密码、查询参数或片段。"
      disabled={!state.writable || state.saving} {...state.address}
      onEdit={text => actions.edit('magpieBaseURL', text)} onReset={() => actions.resetField('magpieBaseURL')} />
  </SettingsForm>
}
