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
      inject?: (sessionId: SessionId) => Record<string, unknown>
    },
    component: unknown,
  ): () => void
}

import { ModelControlsEntry } from './ModelControlsEntry'
import type { ModelDirectoryFace } from './model-catalog'
import { pickerCss } from './picker.css'

export { ModelControlsEntry } from './ModelControlsEntry'
export { ModelPickerButton } from './ModelPickerButton'
export { ModelPickerPanel } from './ModelPickerPanel'

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

export const inject = ['slots', 'sessions', 'remote', 'remote.session', 'modelDirectories']

export function apply(ctx: ClientContext): void {
  injectStylesOnce()

  try {
    const slots = ctx.get('slots') as SlotsApi | undefined
    const sessions = ctx.get('sessions') as Pick<ISessions, 'subagentAddress'> | undefined
    const directories = ctx.get('modelDirectories') as { directoryFor(sessionId: SessionId): ModelDirectoryFace }
    if (slots) {
      slots.inject('conversation.input.model', () =>
        slots.register(
          {
            name: 'conversation.input.model',
            priority: -1,
            inject: (sessionId) => ({
              directory: directories.directoryFor(sessionId),
              available: sessions !== undefined
                && sessions.subagentAddress(sessionId) === undefined,
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
