/**
 * 触发按钮上的档位显示名。
 *
 * 档位的 `name` 由宿主目录提供，语言取决于宿主设置。本插件面板里已经是中文
 * （`思考深度` / `低` / `高`），按钮若直接回显宿主的 `High` 就与面板不一致。
 * 这里把宿主显示名归一到本插件的 locale 键，**跟随界面语言**：中文界面显示
 * 「高」，英文界面仍显示 `High`。
 *
 * 只做显示映射：档位 id 与提交给宿主的 reasoningEffort 不受影响。
 */
import type { PickerKey } from './locales'

/** 按钮能识别的档位 → locale 键。未收录的档位原样显示宿主的名字。 */
const EFFORT_KEYS: Readonly<Record<string, PickerKey>> = {
  // 宿主可能用 XHigh，也可能用 Extra High 表示同一档。
  minimal: 'effortMinimal',
  low: 'effortLow',
  medium: 'effortMedium',
  high: 'effortHigh',
  xhigh: 'effortXHigh',
  extrahigh: 'effortXHigh',
  max: 'effortMax',
  // 关闭思考的写法各家不一，见 OFF_EFFORTS；显示名统一成「关闭 / Off」，
  // 否则按钮会原样回显 `disabled`、`no_think` 这类上游 id。
  none: 'effortOff',
  off: 'effortOff',
  disabled: 'effortOff',
  false: 'effortOff',
  no: 'effortOff',
  nothink: 'effortOff',
}

/** 归一化：大小写、空格、下划线与连字符都不参与匹配。 */
function normalize(name: string): string {
  return name.trim().toLowerCase().replace(/[\s_-]+/g, '')
}

/**
 * 把宿主给的档位显示名翻译成 locale 键。
 * @param name - 宿主提供的档位显示名，如 `High`、`Extra High`、`xhigh`。
 * @returns 对应的 locale 键；未收录时返回 `undefined`，调用方回退原值。
 */
export function effortKeyOf(name: string): PickerKey | undefined {
  return EFFORT_KEYS[normalize(name)]
}

/**
 * 关闭思考的档位标识：这些档位不占进度，竖条只显示空轨道。
 *
 * 清单照 ZCode 的 `CXt` 取（它列了 8 个），因为上游各家对「不思考」的写法并不统一：
 * `off` / `none` / `disabled` / `false` / `no` / `nothink` / `no-think` / `no_think`。
 * 少认一个的后果不是「显示得不好看」，而是**竖条被填上一格**——把一个关闭态
 * 画成有强度，属于显示错误。
 *
 * 比较前已过 {@link normalize}（去空白、下划线、连字符并小写），所以这里只写
 * 归一化后的形态：`no-think` 与 `no_think` 都变成 `nothink`，只需列一次。
 */
const OFF_EFFORTS: ReadonlySet<string> = new Set(['off', 'none', 'disabled', 'false', 'no', 'nothink'])

/**
 * 竖条填充比例：0 到 1。
 *
 * **必须与面板滑杆同一套刻度**：`第几档 / (档数 − 1)`。
 *
 * 曾经这里用 ZCode 的「(第几档 + 1) / 总档数」，让最低的有效档也占一格。
 * 但面板滑杆用的是 `第几档 / (档数 − 1)`，两套并存的结果是同一个模型
 * 在两处显示差一档：3 档模型里「中」在滑杆上是 50%、在竖条上却是 67%，
 * 「低」在滑杆上是 0%、竖条上却是 33%。用户看到的就是「中等快满了、
 * 低档还有三成」。
 *
 * 权衡：宁可最低档的竖条矮到几乎看不见，也要与滑杆一致——竖直方向的比例
 * 会被眼睛直接比较，而「最低档到底是 0% 还是 1/n」没有参照物可比。
 *
 * 两处保留 ZCode 的处理：
 * - **关闭档为 0**：`off` 表示不思考，填满或占一格都会读成「有强度」，
 *   因此返回 0，界面只画空轨道（轨道本身留着，区别于「这个模型没有档位」）。
 * - 关闭档不参与分母：3 档模型里 `off/low/high` 的 `high` 是最强，应该满格。
 *
 * @param effortIds - 该模型声明的全部档位 id，按由弱到强排列。
 * @param activeId - 当前生效的档位 id。
 * @returns 0 到 1 的填充比例；找不到当前档位时返回 0。
 */
export function effortProgress(effortIds: readonly string[], activeId: string | undefined): number {
  if (activeId === undefined) return 0
  const wanted = normalize(activeId)
  if (OFF_EFFORTS.has(wanted)) return 0
  // 关闭档不占一个强度格子，分母只数真正的强度档。
  const scaled = effortIds.map(normalize).filter(id => !OFF_EFFORTS.has(id))
  const rank = scaled.indexOf(wanted)
  if (rank < 0) return 0
  // 单档模型：没有「进度」可言，但也不该是 0（那会看起来像关闭）。
  if (scaled.length <= 1) return 1
  // 与面板滑杆一致：最低档 0%、最高档 100%。
  return rank / (scaled.length - 1)
}

/**
 * 竖条的**可见**填充高度比例：在 {@link effortProgress} 之上保证最低的有效档
 * 也画得出来。
 *
 * 为什么不直接改 progress：那个值要与面板滑杆严格同刻度，最低档必须是 0。
 * 但竖条只有 12px 高，0 与「关闭」在视觉上完全一样，用户无法区分
 * 「这个模型最低档」与「思考已关闭」。所以只在绘制时抬到最小可见高度。
 *
 * 抬升只作用于最低的那一格，且永远小于下一档，因此不会打乱档位顺序。
 *
 * @param effortIds - 该模型声明的全部档位 id，按由弱到强排列。
 * @param activeId - 当前生效的档位 id。
 * @returns 0 到 1 的绘制比例；关闭档仍为 0（只画空轨道）。
 */
export function effortMeterHeight(effortIds: readonly string[], activeId: string | undefined): number {
  const progress = effortProgress(effortIds, activeId)
  if (progress > 0) return progress
  // progress 为 0 有两种含义：关闭思考，或处在最低的有效档。前者必须保持 0。
  if (activeId === undefined) return 0
  const wanted = normalize(activeId)
  if (OFF_EFFORTS.has(wanted)) return 0
  const scaled = effortIds.map(normalize).filter(id => !OFF_EFFORTS.has(id))
  // 最低的有效档：给一个看得见但不抢眼的起点。
  return scaled.includes(wanted) ? 0.25 : 0
}
