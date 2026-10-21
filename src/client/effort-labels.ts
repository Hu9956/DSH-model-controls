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
 * 参照 ZCode 的 `composer-thought-meter` 做法，用「第几档 / 总档数」而不是
 * 「第几档 / (总档数-1)」，让最低的有效档也占到一格，竖条不会矮到看不见。
 *
 * 两处与它不同：
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
  return (rank + 1) / scaled.length
}
