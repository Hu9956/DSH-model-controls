import * as React from 'react'
import { SettingsForm, SettingsValueField, SettingsFormModel, type SettingsFormScope } from '@deepseek-ai/dsh-client-ui-primitives'
import { settingsFormLabels, type SettingsKey, type Translate } from './locales'

export type ControlsForm = SettingsFormScope<{ magpieBaseURL?: string }>

/** The page's localized copy reader, injected by the client half's slot registration. */
export type ControlsTranslate = Translate<SettingsKey>

export interface ModelControlsSettingsProps {
  view?: 'summary' | 'page'
  form: ControlsForm
  t: ControlsTranslate
}

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
 * @param props - the requested view, the entry's form, and this page's locale reader.
 * @returns the localized settings form.
 */
export function ModelControlsSettings({ form, t }: ModelControlsSettingsProps) {
  const model = React.useMemo(() => new SettingsFormModel(form, [{
    field: 'magpieBaseURL',
    format: value => typeof value === 'string' ? value : '',
    parse: acceptAddress,
  }]), [form])
  const store = React.useMemo(() => model.bind(() => ({ ...model.shell(), address: model.field('magpieBaseURL') })), [model])
  const state = React.useSyncExternalStore(listener => store.subscribe(listener), () => store.getSnapshot())
  React.useEffect(() => () => model.dispose(), [model])
  const actions = model.actions()
  return <SettingsForm state={state} onSave={actions.save} onDiscard={actions.discard} labels={settingsFormLabels(t)}>
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
