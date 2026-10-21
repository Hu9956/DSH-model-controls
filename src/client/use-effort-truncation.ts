/**
 * 触发按钮的折叠判定。
 *
 * ## 依据：ZCode 的 composer 折叠
 *
 * ZCode 把模型选择器和档位控件放在**同一个折叠优先级 3**（最后才折叠），
 * 但它们各自还有一层容器断点：
 *
 *     模型名：  hidden @xl/composer:inline-flex       // < 576px 隐藏
 *     档位文字：hidden @sm/composer:inline-flex       // < 384px 隐藏
 *     竖条：    hidden @sm/composer:inline-flex @xl/composer:hidden
 *                                                     // 384–576px 显示
 *
 * 也就是：
 *
 *     ≥ 576px   模型名 + 档位文字
 *     384–576   竖条（文字让位）
 *     < 384     竖条（图标模式）
 *
 * 关键结论：**档位文字在 576px 就让位，不跟模型名抢那最后几个像素。**
 * 这比「实测到放不下才换」早得多，也更一致——固定信息（模型名）优先，
 * 可替代信息（档位）按断点让位。
 *
 * ## 本实现
 *
 * 保留 ZCode 的断点语义，但宽度取自**实测的按钮可用宽度**而不是 composer 宽度：
 * composer 宽度里混着工具条、发送按钮等与本按钮无关的东西，用它当判据会让
 * 「同一个 composer 宽度下，模型名长短不同却同一断点」这个老问题重现。
 *
 * 因此这里只有两个判据，都基于实测：
 *
 *   1. **档位宽度断点**：按钮可用宽度 ≥ EFFORT_BREAKPOINT 时显示档位文字，
 *      否则换竖条。对应 ZCode 的 576px 断点，按按钮实际能占的宽度换算。
 *   2. **溢出折叠**：连箭头都放不下时先收箭头（纯装饰，缩一半就是残图）。
 *
 * 模型名保持连续收缩（`ellipsis`），这是 DSH 用户明确要的「慢慢缩」，
 * ZCode 是整块换图标，这里不照搬。
 *
 * ## 为什么不会像 0.2.19 那样疯狂抖动
 *
 * 0.2.19 量的是**会被自己隐藏的元素**：判定截断 → `display:none` →
 * 下一次量到 0 → 判定翻回 → 文字回来 → 又被截断，每帧翻转一次。
 *
 * 这里量的是**永不参与折叠的探针**（绝对定位、`visibility:hidden`、从不显隐），
 * 并且量可用宽度时把按钮自身宽度从所占宽度里减掉，所以结果与渲染状态无关。
 */
import * as React from 'react'

/**
 * 档位文字与竖条的切换断点（按钮可用宽度）。
 *
 * 对应 ZCode 在 composer 576px 处让档位文字让位；按 ZCode 的按钮占比换算，
 * 那个时刻按钮可用宽度约 130–160px，取 150px。
 *
 * 为什么不能再低：常态要完整放下「logo + 模型名一个字 + 档位文字 + 箭头」，
 * 中文最长「最高」需 92px、英文 `Extra high` 需 128px。断点低于 133px 时
 * 英文档位一出现就已经放不下，会立刻又跳成竖条——那正是抖动的来源。
 * 150px 给英文留 22px 余量、中文留 58px。
 *
 * 与 ZCode 的差别只在**参照物**：ZCode 用 composer 宽度，这里用按钮自身可用宽度，
 * 因为同一个 composer 宽度下模型名长短差异可达 200px，用 composer 宽度必然误伤。
 */
const EFFORT_BREAKPOINT = 150

/**
 * 模型名至少留出的宽度（约一个汉字）。仅用来判断「还有没有意义再加一项」，
 * 不是档位让位的门槛——那个由 EFFORT_BREAKPOINT 决定。
 */
const MIN_LABEL_ROOM = 12

/** 按钮内部的折叠状态。 */
export interface ButtonCollapse {
  /** 收掉箭头：放不下时第一个让位的纯装饰元素。 */
  compactChevron: boolean
  /** 档位文字换成竖条：箭头收掉后仍放不下才发生。 */
  showMeter: boolean
  /**
   * 连模型名一起收掉，只留 logo + 竖条。
   *
   * 为什么要有这一级：模型名用省略号收缩，宽度不够时最后会只剩一个字符加
   * 省略号（`V.…`）。那不是「信息变少」，而是「看起来像坏了」——一个孤零零
   * 的字母加省略号读不出任何东西，还把按钮撑得比图标宽。ZCode 在同一宽度下
   * 直接整个收起模型名（`data-composer-model-icon`），这里照做：要么读得出来，
   * 要么不显示，不留半截。
   */
  compactLabel: boolean
}

/** 四个恒定存在的量宽探针；都绝对定位、从不显隐。 */
export interface CollapseProbes {
  /** 与真实 logo 同尺寸。logo 本身不会被折叠，但统一用探针以避免量到 0。 */
  logo: React.RefObject<HTMLElement | null>
  /** 档位文字的排版宽度。 */
  effort: React.RefObject<HTMLElement | null>
  /** 箭头图标宽度。真实箭头折叠后宽度为 0，所以必须单独量一份。 */
  chevron: React.RefObject<HTMLElement | null>
  /** 竖条宽度。 */
  meter: React.RefObject<HTMLElement | null>
}

const widthOf = (element: HTMLElement | null): number | null =>
  element === null ? null : element.getBoundingClientRect().width

/**
 * 找到 composer 那一行：从按钮往上，第一个 `container-type: inline-size` 的祖先。
 * 这正是宿主用来判定换行、也是 `cqw` 所指向的元素。
 */
function findRow(button: HTMLElement): HTMLElement | null {
  let node: HTMLElement | null = button.parentElement
  while (node !== null) {
    if (window.getComputedStyle(node).containerType === 'inline-size') return node
    node = node.parentElement
  }
  return null
}

/**
 * 这一行留给按钮的宽度：行可用宽度 − 除按钮以外的实际占位 − 间距。
 *
 * 把「包含按钮的那个子项」的宽度减去按钮自身宽度，因此结果与按钮此刻多宽无关
 * ——这是判定不抖动的前提。
 *
 * @returns 可用宽度（像素）；无法测量时返回 `null`。
 */
function measureAvailableWidth(row: HTMLElement, button: HTMLElement): number | null {
  const style = window.getComputedStyle(row)
  const padding = (Number.parseFloat(style.paddingLeft) || 0) + (Number.parseFloat(style.paddingRight) || 0)
  const gap = Number.parseFloat(style.columnGap) || 0
  const total = row.clientWidth - padding
  if (!(total > 0)) return null
  const buttonWidth = button.getBoundingClientRect().width
  let used = 0
  let count = 0
  for (const child of Array.from(row.children)) {
    let width = child.getBoundingClientRect().width
    // 子项里含按钮（通常是 trailing 之一）：把按钮自身让出的部分减掉。
    if (child.contains(button)) width = Math.max(0, width - buttonWidth)
    if (width > 0) {
      used += width
      count += 1
    }
  }
  used += Math.max(0, count - 1) * gap
  // 留 1px 余量：算到「刚好占满」时，亚像素舍入就会让宿主判定为放不下而换行。
  // 上限再夹到行宽本身，避免极端情况下（按钮比其容器还宽）算出超过整行的值。
  return Math.max(0, Math.min(total - used - 1, total))
}

/**
 * 实测按钮内部是否放得下，并按顺序折叠。
 *
 * @param buttonRef - 按钮本身，用于找所属行、读内边距与列间距。
 * @param probes - 四个量宽探针。
 * @param hasEffort - 有档位文字时才走折叠；没有时只判断箭头。
 * @param deps - 触发重新测量的值：档位名 / 模型名 / 档位比例变化时重算。
 * @returns 当前折叠状态；同时把可用宽度写进按钮的 `--dsh003-max`。
 */
export function useButtonCollapse(
  buttonRef: React.RefObject<HTMLElement | null>,
  probes: CollapseProbes,
  hasEffort: boolean,
  deps: readonly unknown[],
): ButtonCollapse {
  const [collapse, setCollapse] = React.useState<ButtonCollapse>({
    compactChevron: false,
    showMeter: false,
    compactLabel: false,
  })

  React.useEffect(() => {
    let row: HTMLElement | null = null

    const measure = (): void => {
      const button = buttonRef.current
      if (button === null) return
      if (row === null || !row.isConnected) row = findRow(button)
      if (row === null) return

      const available = measureAvailableWidth(row, button)
      if (available === null) return

      // 把可用宽度交给 CSS 当 max-width：按钮因此永远不会把这一行顶成两行。
      // 这一步用真实测量替代了此前写死的 `calc(100cqw - 140px)`。
      button.style.setProperty('--dsh003-max', `${available}px`)

      const style = window.getComputedStyle(button)
      const padding = (Number.parseFloat(style.paddingLeft) || 0) + (Number.parseFloat(style.paddingRight) || 0)
      const gap = Number.parseFloat(style.columnGap) || 0
      const logo = widthOf(probes.logo.current)
      const chevron = widthOf(probes.chevron.current)
      const effort = widthOf(probes.effort.current)
      const meterWidth = widthOf(probes.meter.current)
      // 任一探针缺失 = 还没挂载完，保持现状，不要用半份数据下结论。
      if (logo === null || chevron === null) return
      // 固定部分：内边距 + logo。间距按「有几项」补。
      const base = padding + logo
      const effortWidth = hasEffort ? (effort ?? 0) : 0

      // 判据一：档位宽度断点。低于它就把档位文字换成竖条，不再等「放不下」。
      // 这是 ZCode 的核心行为：档位是可替代信息，模型名才是要保住的。
      const showMeter = hasEffort && available < EFFORT_BREAKPOINT

      // 判据二：只剩「logo + 模型名」时连箭头都放不下就收掉它。
      // 箭头是纯装饰，且缩一半就是残图，只能整块让位。
      const tail = showMeter ? (meterWidth ?? 0) : effortWidth
      // 间距：logo | 模型名 | 档位(或竖条) | 箭头 → 3 个
      const neededWithChevron = base + gap * 3 + tail + chevron + MIN_LABEL_ROOM
      const compactChevron = neededWithChevron > available

      // 判据三：模型名还分不到一个字宽时整个收起。
      // 否则会留下 `V.…` 这样的半截——读不出信息，却仍占着比图标更宽的位置。
      //
      // 判据用的是「模型名若显示能分到多少」，不依赖它当前是否显示：
      // 减去的是固定占位与档位项，与模型名自身宽度无关。因此收掉模型名之后
      // 这个值不会变大，不可能反过来判定「又能显示了」——不会自激。
      // 间距按「logo | 模型名 | 档位(或竖条) | 箭头」中的**三项**算，
      // 这样收掉箭头与否都得到同一个门槛。
      const labelRoom = available - base - gap * 2 - tail
      const compactLabel = labelRoom < MIN_LABEL_ROOM

      setCollapse({ compactChevron, showMeter, compactLabel })
    }

    measure()
    const observer = new ResizeObserver(measure)
    const button = buttonRef.current
    if (button !== null) {
      observer.observe(button)
      // 观察整行：窗口拖动时行的宽度变化是最直接的信号。
      const owner: HTMLElement | null = row ?? findRow(button)
      if (owner !== null) observer.observe(owner)
    }
    const fonts = document.fonts
    fonts?.ready.then(measure).catch(() => { /* 字体接口不可用时忽略 */ })
    return () => { observer.disconnect() }
    // deps 由调用方给出：档位名 / 模型名变化时重新测量。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return collapse
}
