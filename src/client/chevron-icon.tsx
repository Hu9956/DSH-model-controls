/**
 * 下拉箭头：官方 IconChevronDownOutlineRegular 原件逐字复制（14px、viewBox 16、1px 描边、currentColor）。
 * 自带而不从 @deepseek-ai/dsh-client-ui-primitives 取：一枚 SVG 不值得为它承担宿主包缺失时整个插件起不来的风险。
 * 官方原件形状变化时同步这里的 path。
 */
import * as React from 'react'

/** 与官方 IconChevronDownOutlineRegular 同 props：size 缺省 14、className 透传。 */
export function IconChevronDownOutlineRegular({ size = 14, className }: { size?: number; className?: string }): React.JSX.Element {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true" strokeWidth={1}>
      <path d="M4 6L7.29289 9.29289C7.68342 9.68342 8.31658 9.68342 8.70711 9.29289L12 6" stroke="currentColor" />
    </svg>
  )
}
