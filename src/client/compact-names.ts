/**
 * 模型名精简开关的客户端读取。
 *
 * 官方设置表单只提供文本 / 数字 / 密钥三种控件，没有布尔开关，所以偏好存成
 * `on` / `off` 文本，由 Host 半边注入页面。这里只读，不写。
 */

/** Host 注入的全局变量名（与本插件 Host 半边 `src/index.js` 对应）。 */
const GLOBAL_KEY = '__DSH_MODEL_CONTROLS_COMPACT_NAMES__'

/**
 * 是否精简模型入口上显示的模型名。
 *
 * 未注入时默认 `true`：新装、无配置、或宿主尚未注入的情况下，按钮保持精简，
 * 与 0.2.11 起的默认行为一致。
 *
 * @returns `true` 时模型入口显示短名（`V4.1-Flash`），`false` 时显示完整上游名。
 */
export function compactNamesEnabled(): boolean {
  const payload: unknown = (window as unknown as Record<string, unknown>)[GLOBAL_KEY]
  return payload !== false
}
