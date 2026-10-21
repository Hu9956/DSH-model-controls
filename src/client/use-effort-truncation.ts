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
 * 与 ZCode 的共同点：**可替代信息（档位）优先让位给固定信息（模型名）**，
 * 不等「放不下文字」才换。
 *
 * 与 ZCode 的两点不同：
 *
 * 1. **参照物是按钮自身的宽度上限**，不是 composer 宽度。composer 宽度里混着
 *    工具条、发送按钮等与本按钮无关的东西，用它当判据会重现「同一个 composer
 *    宽度下，模型名长短不同却同一断点」的老问题。
 * 2. **判据不是固定断点**，而是「加了档位文字后，模型名还剩多少」。竖条的
 *    唯一职责就是省宽度给名字，所以它该在名字即将受委屈的那一刻接手，
 *    而不是在某个与内容无关的像素值上。档位文字是「高」还是 `Extra high`
 *    都不影响这个时刻的正确性——它们各自按自己的宽度参与计算。
 *
 * 因此这里三个判据，全部基于实测：
 *
 *   1. **宽度上限**：`min(360, 行剩余 × 0.45)`。按钮占那一行的固定份额，
 *      手机不会吃满（曾经是 `min(360, 剩余)`，手机上正好占满 100%）。
 *   2. **档位换竖条**：按上限扣掉文字后名字不足两个字宽时切换。
 *   3. **溢出折叠**：连箭头都放不下时先收箭头（纯装饰，缩一半就是残图）；
 *      名字连一个字宽都分不到时整块收起，不留 `V.…` 这种半截。
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
 * 三个判据用的都是 `cap`（由「行剩余」算出，与按钮当前宽度无关）和固定探针，
 * 因此收掉任何一项都不会让判据翻回去——不会自激。
 */
import * as React from 'react'

/**
 * 按钮宽度上限 = 这一行剩余空间 × 这个比例，再受 {@link ABSOLUTE_CAP} 封顶、
 * 受 {@link MIN_CAP} 托底。
 *
 * ## 为什么是比例，不是「剩余多少就给多少」
 *
 * 原先是 `min(360, 剩余)`——只要行里还有空间就全给按钮。桌面空间充足时没问题，
 * 手机上行剩余小，按钮就**正好占满**：393px 宽的手机上行剩余 248px，按钮吃掉
 * 248px，等于输入框底部三分之二。视觉上不是「名字太长」，而是「按钮撑爆了」。
 *
 * 换成比例后按钮在任何屏幕上都只占那一行的固定份额，手机和桌面一致。
 */
const AVAILABLE_SHARE = 0.45

/**
 * 按钮宽度的下限。
 *
 * ## 为什么比例之外还要一个下限
 *
 * 比例是相对「行剩余」算的，而行剩余已经被左侧的「+」「权限」和右侧发送键
 * 吃掉一大截。窄窗口里行剩余可能只有 200px，45% 就是 90px——扣掉 logo、
 * 内边距、档位与箭头后名字只剩 30 多像素，显示成 `V4....`，等于放弃了
 * 「这是哪个模型」这个按钮最核心的信息。
 *
 * 140px 是能放下「logo + 一个能读懂的名字片段 + 档位 + 箭头」的最低限度：
 * 竖条态下名字约 87px（`V4.1 Flash…`），文字态下约 62px（`V4.1 Flas…`）。
 *
 * 注意这个下限**不会让按钮超出那一行**：`cap` 始终再与 `available` 取小。
 */
const MIN_CAP = 140

/**
 * 按钮宽度的绝对上限（官方触发器的同款值）。
 *
 * 桌面上行剩余 1200px 以上，45% 仍有 540px，这个上限负责把它停在 360px
 * ——再宽也没有信息增量，只会让输入框底部失衡。
 */
const ABSOLUTE_CAP = 360

/**
 * 模型名至少留出的宽度（约一个汉字）。
 *
 * 既用于「还能不能再加一项」的判断，也用于「少到一个字就整块收起」的门槛。
 */
const MIN_LABEL_ROOM = 12

/**
 * 保留档位**文字**所需的最低名字宽度。
 *
 * 低于它就换成竖条。取 70px（13px 字号下约 10 个字符）——这是模型名还能
 * 被认出来的下限：`V4.1 Flash…` 尚可区分 `V4.1 Flash Free` 与 `V4.1 Flash`，
 * 再短就只剩 `V4.1 Fla…`，区分不了。
 *
 * 与竖条的关系：换过去能把档位文字那 24px 压成 3px，名字立刻多出 21px。
 * 所以在「名字不足 70px」时，那 21px 比「高」这个字更有价值。
 *
 * 数值经过校准：低于 70 时 140px 下限的手机按钮会停在 62px 的名字上
 * （`V4.1 Fla…`），竖条几乎永不启用；正好 70 时它在窄屏启用、在 520px
 * 窗口（名字 90px）仍保留文字。
 */
const MIN_TEXT_LABEL_ROOM = 70

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

      // 按钮的宽度上限：这一行剩余空间的一个固定份额，受绝对上限封顶、
      // 受下限托底。曾经是 `min(360, 剩余)`，手机上于是正好占满整行剩余
      // （393px 的手机按钮吃掉 248px，等于输入框底部三分之二）。比例化之后
      // 任何屏幕下按钮都只占那一行的同一份额。
      //
      // 下限的意义见 MIN_CAP：窄窗口里行剩余可能只有 200px，45% 是 90px，
      // 名字会被压成 `V4....`。但仍与 available 取小，绝不超出那一行。
      const cap = Math.min(ABSOLUTE_CAP, available, Math.max(MIN_CAP, available * AVAILABLE_SHARE))

      // 注意：CSS 拿到的仍然是「上限」，不是定宽。模型名短时按钮会自然更窄。
      button.style.setProperty('--dsh003-max', `${cap}px`)

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

      // 判据一：档位文字换竖条。
      //
      // 参照物必须是上面算出的 cap，不是 available。上方一压，按钮实际就
      // 只有 cap 那么宽了；若仍拿 available（原始行剩余）去判，手机上会
      // 以为还有 374px、判定「放得下文字」，而按钮其实只有 168px——
      // 结果就是文字被硬挤、名字反而更短。
      //
      // 判据本身：加了档位文字后名字还剩不到 {@link MIN_TEXT_LABEL_ROOM}，
      // 就换成竖条。竖条唯一的职责是省宽度给模型名，所以它应该在**名字开始
      // 受委屈时**立刻接手，而不是等按钮窄到某个与内容无关的固定值。
      const NEEDED_FOR_TEXT = base + gap * 3 + effortWidth + chevron
      const showMeter = hasEffort && cap - NEEDED_FOR_TEXT < MIN_TEXT_LABEL_ROOM

      // 判据二：只剩「logo + 模型名」时连箭头都放不下就收掉它。
      // 箭头是纯装饰，且缩一半就是残图，只能整块让位。
      const tail = showMeter ? (meterWidth ?? 0) : effortWidth
      // 间距：logo | 模型名 | 档位(或竖条) | 箭头 → 3 个
      const neededWithChevron = base + gap * 3 + tail + chevron + MIN_LABEL_ROOM
      // 同样对齐 cap，按钮实际只有这么宽。
      const compactChevron = neededWithChevron > cap

      // 判据三：模型名还分不到一个字宽时整个收起。
      // 否则会留下 `V.…` 这样的半截——读不出信息，却仍占着比图标更宽的位置。
      //
      // 判据用的是「模型名若显示能分到多少」，不依赖它当前是否显示：
      // 减去的是固定占位与档位项，与模型名自身宽度无关。因此收掉模型名之后
      // 这个值不会变大，不可能反过来判定「又能显示了」——不会自激。
      // 间距按「logo | 模型名 | 档位(或竖条) | 箭头」中的**三项**算，
      // 这样收掉箭头与否都得到同一个门槛。
      const labelRoom = cap - base - gap * 2 - tail
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
