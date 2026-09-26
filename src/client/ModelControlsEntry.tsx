/** Replace the model seat while retaining the official per-session directory and lock semantics. */
import * as React from 'react'

import type { ModelDirectoryFace } from './model-catalog'

import { ModelPickerButton } from './ModelPickerButton'

/** 组件收到的座位 props：owner share（locked）+ 本注册 inject face（available）。 */
export interface ModelControlsEntryProps {
  /** composer 当前拒绝交互（锁发送/命令时模型位一并锁定，官方触发器同款）。 */
  directory: ModelDirectoryFace
  locked: boolean
  /** 本会话是否支持模型检视与选择（官方 available 语义：非寻址 subagent 会话）。 */
  available: boolean
}

/**
 * 渲染单入口组合容器（官方同款单按钮接管模型位，样式见 picker.css ① 区 .dsh003-model-controls）。
 * @param props - locked/available，见 ModelControlsEntryProps。
 * @returns 容器（含统一模型+思考强度触发按钮）；available=false 时不渲染。
 */
export function ModelControlsEntry({ locked, available, directory }: ModelControlsEntryProps): React.ReactNode {
  if (!available) return null
  return (
    <div className="dsh003-model-controls">
      <ModelPickerButton locked={locked} directory={directory} />
    </div>
  )
}
