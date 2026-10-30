/**
 * 菜单材质：照官方 MenuSurface（@deepseek-ai/dsh-client-ui-primitives）逐项复制的标记与行为，
 * 类名换成插件前缀 dsh003-menu-surface*，样式在 picker.css.ts 的「菜单材质」一节。
 * 自带而不借用官方：面板是模型选择器的主体，宿主包缺失或改名时不能让它跟着消失。
 *
 * 结构与官方一致：
 * - 可见的 div 带 data-menu-material="translucent"（主题 CSS 据此在深色下改 elevation 描边色），
 *   内含一层只铺背景的 material（只给背景做 backdrop-filter，嵌套菜单与 fixed 浮层不受祖先 backdrop 影响）；
 * - 另有一个 portal 到 body 的 backing（data-menu-backing）：macOS 下 Chromium 需要页面内容背后有不透明像素
 *   才能在原生 vibrancy 上做模糊；它用 CSS anchor 跟随菜单，不需要布局监听。
 * 官方实现改动时以官方为准同步这里与 CSS。
 */
import * as React from 'react'
import { createPortal } from 'react-dom'

/** 与官方 MenuSurfaceProps 相同：原生 div props + compact。 */
export interface MenuSurfaceProps extends React.ComponentPropsWithoutRef<'div'> {
  /** 对齐官方紧凑菜单更小的外圆角。 */
  compact?: boolean
}

/**
 * 绘制菜单材质；macOS 下在菜单范围内的页面内容背后补一块不透明 backing。
 * @param props - div 内容与定位，以及 compact 几何。
 * @param ref - 可见菜单 div（不含不可交互的 backing）。
 * @returns 菜单内容，加一个随菜单卸载的 backing portal。
 */
export const MenuSurface = React.forwardRef<HTMLDivElement, MenuSurfaceProps>(function MenuSurface(
  { compact = false, className, style, children, ...props }, ref,
) {
  const id = React.useId()
  const backingRef = React.useRef<HTMLDivElement | null>(null)
  // 官方同款：挂载后把 backing 移到 body 末尾，叠放次序与官方菜单一致。
  React.useLayoutEffect(() => {
    if (backingRef.current !== null) document.body.appendChild(backingRef.current)
  }, [])
  const anchorStyle = { '--dsh-menu-anchor': `--dsh-menu-${id.replaceAll(':', '')}` } as React.CSSProperties
  const compactClass = compact ? ' dsh003-menu-surface-compact' : ''
  return (
    <>
      <div
        {...props}
        ref={ref}
        data-menu-material="translucent"
        className={`dsh003-menu-surface${compactClass}${className ? ` ${className}` : ''}`}
        style={{ ...style, ...anchorStyle }}
      >
        <div aria-hidden="true" className="dsh003-menu-surface-material" />
        {children}
      </div>
      {createPortal(
        <div
          ref={backingRef}
          aria-hidden="true"
          data-menu-backing=""
          className={`dsh003-menu-surface-backing${compactClass}`}
          style={{ ...anchorStyle, visibility: style?.visibility }}
        />,
        document.body,
      )}
    </>
  )
})
