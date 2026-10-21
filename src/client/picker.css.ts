/**
 * 模型选择器样式（--dsw-alias-* 语义色 + --dshT3-* 圆角，深色模式零特判）。
 * 结构：① 触发按钮 ② 面板浮层 ③ 两栏主体 ④ 模型行 ⑤ 底部占位。
 */
export const pickerCss = `

/* ① 组合容器（M-049）：两入口横排一组，占官方模型位；min-width:0 防挤爆 trailing 行 */
.dsh003-model-controls {
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
  min-width: 0 !important;
}
/* 官方 activity 的 :empty 不覆盖 renderer 留下的空插槽 wrapper。
   只隐藏本插件旁的空活动容器；插槽出现实际内容时自动恢复。 */
div:has(> [data-slot="conversation.input.model"] .dsh003-model-controls) + div:has(> [data-slot="conversation.input.activity"]:empty) {
  display: none !important;
}
/* ① 触发按钮：官方模型触发器逐值对齐（ModelSelect.module.css .trigger）——
   28 高/13-20/400/gap 4/padding 0 4 0 8/透明底 24 圆角/secondary 文本；
   hover/focus-visible/disabled 同官方 token。max-width 官方同款双声明：
   220px 回退 + min(360px,45cqw)（composer 卡 container-type: inline-size 内生效），
   长模型名让位不吞 composer（名称 span 另行 ellipsis） */
.dsh003-picker-btn {
  appearance: none !important;
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
  min-width: 0 !important;
  /* 可用宽度由 JS 实测后写入 --dsh003-max：把 composer 那一行里除按钮以外的
     实际宽度减掉，剩下的全给按钮。因此按钮永远不会把那一行顶成两行，
     也不依赖任何硬编码占位（此前写的 140px 是照实测抄的，布局一改就错）。
     45cqw 是 JS 尚未测量时的兜底，360px 是官方同款的绝对上限。 */
  max-width: min(360px, 45cqw) !important;
  max-width: min(360px, var(--dsh003-max, 45cqw)) !important;
  /* 两根量宽探针按此定位（绝对定位 + visibility:hidden），不参与布局。 */
  position: relative !important;
  height: 28px !important;
  padding: 0 4px 0 8px !important;
  border: none !important;
  border-radius: 24px !important;
  outline: none !important;
  background: transparent !important;
  color: var(--dsw-alias-label-secondary) !important;
  font-size: 13px !important;
  line-height: 20px !important;
  font-weight: 400 !important;
  cursor: pointer !important;
  user-select: none !important;
  box-sizing: border-box !important;
  transition: background 120ms ease, color 120ms ease !important;
}
.dsh003-picker-btn:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover) !important;
}
/* data-open 常驻 hover 底：官方弹层与按钮同根无此需求，我们的面板是分离 portal，
   open 态按钮需要锚定提示（同 token 同 chrome，非新视觉语言） */
.dsh003-picker-btn[data-open="true"] {
  background: var(--dsw-alias-interactive-bg-hover) !important;
}
.dsh003-picker-btn:focus-visible {
  box-shadow: 0 0 0 2px var(--dsw-alias-border-l3) !important;
}
.dsh003-picker-btn:disabled {
  color: var(--dsw-alias-label-dimmed) !important;
  cursor: default !important;
}
/* 档位竖条：档位文字让位时才出现（由按钮上的 data-meter 控制，见下）。
   默认 display:none——有档位的模型都会渲染这根元素，但要到让位时才显示。
   轨道 = 文字色 10% 透明（对齐 ZCode 的 bg-foreground/10），
   填充从底部往上长，高度由内联 style 按档位比例给出。
   注意：这条基础规则必须排在让位规则**之前**——同特异性同 !important，
   后面的规则胜出，排反了会把 display:block 整个盖掉，竖条永远不出现。 */
.dsh003-picker-effort-meter {
  display: none !important;
  position: relative !important;
  flex: 0 0 auto !important;
  /* 3px 宽 × 12px 高：比 16px 的品牌 logo 小一档。
     logo 墨迹通常只占盒子的 80%，所以 12px 的竖条与它视觉等重，不会抢过图标。 */
  width: 3px !important;
  height: 12px !important;
  overflow: hidden !important;
  border-radius: 999px !important;
  background: color-mix(in srgb, var(--dsw-alias-label-primary) 10%, transparent) !important;
}
.dsh003-picker-effort-meter-fill {
  position: absolute !important;
  bottom: 0 !important;
  left: 0 !important;
  width: 100% !important;
  border-radius: 999px !important;
  background: var(--dsw-static-deepseek-400) !important;
  transition: height 120ms ease !important;
}
/* 关闭思考：只有空轨道。轨道留着是为了把「有档位但已关闭」与
   「这个模型根本没有档位」（不渲染竖条）区分开。 */
.dsh003-picker-effort-meter[data-empty="true"] .dsh003-picker-effort-meter-fill {
  display: none !important;
}

/* 「这个模型没有档位」的竖条形态：一根更短、更淡的轨道，不填充。
   为什么和「关闭思考」的空轨道不同（12px/10% vs 8px/6%）：
   两者意思不一样——「关闭」是有这个能力、此刻关掉了；「没有档位」是
   根本没有这个能力。意思不同，外观就必须不同。
   短一截是关键：3px 宽下长度的差别比亮度更容易分辨。
   文字形态下它显示「无」（见 effortNoneShort），与这根轨道互斥——
   就像「高」与正常竖条互斥一样，它们是同一个位置的两种形态。
   垂直居中由父级 .dsh003-picker-btn 的 align-items:center 保证。 */
.dsh003-picker-effort-meter[data-none="true"] {
  height: 8px !important;
  background: color-mix(in srgb, var(--dsw-alias-label-primary) 6%, transparent) !important;
}

/* 窄容器降级：**宽度连续收缩，不设台阶**。
 *
 * 按钮的宽度上限只有一个连续公式（见 .dsh003-picker-btn 的 max-width），
 * 所以窗口拖窄时不是「跳一档」，而是每一像素都在变。宽度不够时：
 *
 *   1. 模型名先被省略号吃掉 —— 这是 text-overflow: ellipsis 的连续收缩，
 *      每拖窄一点就少吃一个字，不会整块消失。
 *   2. 模型名缩到 0 后，才轮到档位文字：淡出收成 0 宽，同时竖条淡入。
 *   3. 更窄（≤200px）时连箭头也收掉——它是唯一需要宽度阈值的元素。
 *
 * 为什么以前会「一大段文字突然变没有」：
 * 旧版按容器宽度分了 300 / 240 / 200 三级 max-width 台阶（160 / 57 / 39），
 * 还额外用 display: none 整块砍掉模型名。台阶一过按钮宽度瞬间变，文字就整段没了。
 * 现在 max-width 连续，只有「让位」是离散的，且每一处让位都带 140ms 过渡。
 *
 * 为什么必须有 calc(100cqw - 140px) 这一项：
 * 宿主 composer 行是 flex-wrap: wrap，右侧 .trailing 是 flex: 0 0 auto（拒绝收缩），
 * tools 80 + 间距 12 + 发送 34 + 间距 8 = 134px 是行里别人占死的宽度。
 * 按钮一旦超过「行宽 - 140」，整组就换行。这一项保证无论怎么拖都不会换行。
 *
 * 竖条颜色用主题的 DeepSeek 蓝（#7aaaff），与面板滑杆最高档刻度同色；不用成功绿
 * ——绿色在 DSH 里表示运行中/成功，思考强度借这个语义会让界面自相矛盾。 */

/* 折叠：由 use-effort-truncation.ts 实测溢出量后打 data 属性，
   CSS 只负责「折叠长什么样」。**没有任何宽度阈值**——
   箭头与档位文字是否让位取决于按钮实测放不放得下，而不是窗口多宽。

   为什么箭头要负 margin 补偿：宽度归零后它仍是个 flex 项，两侧 gap 照占；
   负 margin 把这份 gap 一起抵消，让「宽度为零」在几何上也真的等于零。 */

/* 折叠第一级：收掉箭头（纯装饰，缩一半就是残图，只能整块收）。 */
.dsh003-picker-btn[data-compact-chev="true"] .dsh003-picker-chev {
  width: 0 !important;
  margin-left: -4px !important;
  opacity: 0 !important;
  overflow: hidden !important;
}

/* 折叠最末一级：连模型名一起收掉，只留 logo + 竖条。
   为什么不是让它继续省略号：宽度只够一个字符时，屏幕上是「V.…」——读不出
   任何信息，却仍占着比图标更宽的位置，看起来像坏了。ZCode 在同一宽度下也
   是整个收起模型名。要么读得出来，要么不显示，不留半截。 */
.dsh003-picker-btn[data-compact-label="true"] .dsh003-picker-btn-label {
  position: absolute !important;
  left: 0 !important;
  bottom: 0 !important;
  width: 0 !important;
  opacity: 0 !important;
  overflow: hidden !important;
  pointer-events: none !important;
}

/* 折叠第二级：档位文字淡出、竖条淡入。
   同样没有阈值——箭头收掉后仍放不下才轮到这一级（JS 实测）。
   这里只负责「让位长什么样」。

   用 absolute 把档位文字整个移出 flex 流：只设 width:0 仍会保留它两侧的
   4px 间距和一个 flex 项的位置，让位就不彻底；而 display:none 又无法过渡。
   absolute + opacity 过渡既能淡出，又立刻把宽度和间距一并交还给模型名。 */
.dsh003-picker-btn[data-meter="true"] .dsh003-picker-btn-effort {
  position: absolute !important;
  left: 0 !important;
  bottom: 0 !important;
  width: 0 !important;
  opacity: 0 !important;
  overflow: hidden !important;
  pointer-events: none !important;
}
.dsh003-picker-btn[data-meter="true"] .dsh003-picker-effort-meter {
  display: block !important;
  animation: dsh003-meter-in 140ms ease both;
}

@keyframes dsh003-meter-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.dsh003-picker-btn-label {
  /* 可以一路缩到 0：这是「慢慢缩进」的主体，由省略号连续表达。 */
  flex: 1 1 auto !important;
  min-width: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}
/* 思考深度：官方 caption 用色。
   flex: 0 0 auto = 不参与收缩，是按钮里最后一个让位的东西——
   只有箭头已经收掉、按钮仍放不下它时，才由 data-meter 把它淡出成竖条。 */
.dsh003-picker-btn-effort {
  flex: 0 0 auto !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  color: var(--dsw-alias-label-caption) !important;
  transition: width 140ms ease, opacity 140ms ease !important;
}
/* 箭头：官方 IconChevronDownOutline14 原件（caption tone），open 态翻转（官方 .chevron 同款） */
.dsh003-picker-chev {
  flex: 0 0 auto !important;
  color: var(--dsw-alias-label-caption) !important;
  transition: transform 120ms ease, width 140ms ease, opacity 140ms ease !important;
}
/* 量宽探针：按真实内容排版（宽度可读），但绝对定位、不可见、不可交互。
   四根分别量 logo / 档位文字 / 箭头 / 竖条，**都从不参与折叠**，
   所以测量结果与当前渲染状态无关——这是 0.2.19 疯狂抖动的根治方式。 */
/* 0 尺寸裁剪框：让探针按真实宽度排版（宽度可读），同时不伸出按钮撑出横向滚动。 */
.dsh003-picker-probes {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
  pointer-events: none !important;
}
.dsh003-picker-probe {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
  white-space: nowrap !important;
  font-size: 13px !important;
  font-weight: 400 !important;
  line-height: 20px !important;
}
/* logo 与竖条探针：尺寸必须与真实元素一致（16px logo、3px 竖条）。 */
.dsh003-picker-logo-probe {
  width: 16px !important;
  height: 16px !important;
}
.dsh003-picker-meter-probe {
  width: 3px !important;
  height: 12px !important;
}
/* 模型名探针：按真实内容排版（宽度可读），同样绝对定位、从不参与折叠。 */
.dsh003-picker-label-probe {
  white-space: nowrap !important;
}
.dsh003-picker-btn[data-open="true"] .dsh003-picker-chev {
  transform: rotate(180deg) !important;
}

/* ② 面板浮层：位置与布局由插件管理；材质、圆角及 macOS backing 由官方 MenuSurface 管理。 */
.dsh003-picker-panel {
  position: fixed !important;
  z-index: 60 !important;
  display: flex !important;
  flex-direction: column !important;
  width: min(320px, calc(100vw - 16px)) !important;
  height: 360px !important;
  border: 0 !important;
  --dsw-elevation-stroke-color: var(--dsw-alias-border-l1);
  box-shadow: var(--dsw-elevation-prominent) !important;
  color: var(--dsw-alias-label-primary) !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
  animation: none !important;
}

/* ③ 两栏主体（M2-005a 修订：两栏自面板顶部贯通——左栏收藏+提供方，右栏搜索+模型列表） */
.dsh003-picker-body {
  flex: 1 !important;
  min-height: 0 !important;
  display: flex !important;
}
.dsh003-picker-prov-col {
  flex: none !important;
  width: 52px !important;
  display: flex !important;
  flex-direction: column !important;
  border-right: 1px solid var(--dsw-alias-border-l1) !important;
  box-sizing: border-box !important;
}
.dsh003-picker-prov-head {
  flex: none !important;
  display: flex !important;
  justify-content: center !important;
  padding: 8px 0 !important;
}
/* 收藏与供应商之间的分隔线：短缩进线（两侧 8px gutter），微微隔开不横跨 */
.dsh003-picker-prov-divider {
  flex: none !important;
  height: 1px !important;
  margin: 0 8px !important;
  background: var(--dsw-alias-border-l1) !important;
}
.dsh003-picker-prov-list {
  flex: 1 !important;
  min-height: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  /* M-054 R1 节奏对齐模型行：36+4=40px/行；顶部 7px 补偿左栏 divider 1px——首按钮与首模型行逐行像素对齐 */
  gap: 4px !important;
  padding: 7px 0 8px !important;
  overflow-y: auto !important;
  box-sizing: border-box !important;
  --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2) !important;
  --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2) !important;
}
.dsh003-picker-prov {
  appearance: none !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 36px !important;
  height: 36px !important;
  flex: none !important;
  border: 1px solid var(--dsw-alias-border-l1) !important;
  border-radius: var(--dshT3-radius-md, 8px) !important;
  background: transparent !important;
  color: var(--dsw-alias-label-secondary) !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  box-sizing: border-box !important;
  transition: background 120ms ease, color 120ms ease, border-color 120ms ease !important;
}
.dsh003-picker-prov-list > .dsh003-picker-prov {
  position: relative !important;
  touch-action: none !important;
  user-select: none !important;
  -webkit-user-select: none !important;
}
.dsh003-picker-prov-list[data-sorting="true"] > .dsh003-picker-prov {
  cursor: grabbing !important;
}
.dsh003-picker-prov[data-dragging="true"] {
  z-index: 1 !important;
  background: var(--dsw-alias-interactive-bg-hover) !important;
  color: var(--dsw-alias-label-primary) !important;
  transition: none !important;
}
.dsh003-picker-prov[data-insert="before"]::before,
.dsh003-picker-prov-insert-end {
  content: '' !important;
  height: 1px !important;
  width: 28px !important;
  background: var(--dsw-alias-label-secondary) !important;
  pointer-events: none !important;
}
.dsh003-picker-prov[data-insert="before"]::before {
  position: absolute !important;
  top: -3px !important;
  left: 3px !important;
}
.dsh003-picker-prov-insert-end {
  flex: none !important;
  margin-top: -2px !important;
}
.dsh003-picker-prov:hover,
.dsh003-picker-prov:focus-visible {
  background: var(--dsw-alias-interactive-bg-hover) !important;
  color: var(--dsw-alias-label-primary) !important;
}
.dsh003-picker-prov[data-active="true"] {
  background: var(--dsw-alias-interactive-bg-hover) !important;
  color: var(--dsw-alias-label-primary) !important;
}
/* 收藏项（左栏首项）：与提供方块同语言，激活时黄色实心星（M-053：星色语义统一黄系） */
.dsh003-picker-prov-fav[data-active="true"] {
  color: var(--dshT3-warning, #f59e0b) !important;
}
/* 提供方 logo（M-051）：内联 SVG fill=currentColor，色彩继承按钮文本色
   （secondary → hover/active primary），明暗主题零特判；20px 见方居中于 36px 按钮内盒 */
.dsh003-provider-logo {
  display: block !important;
  width: 20px !important;
  height: 20px !important;
  flex: none !important;
  pointer-events: none !important;
}
.dsh003-provider-logo svg {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
}
/* M-056：触发按钮小档——官方触发器 IconDataOutlineRegular 用 size:16，
   本插件原为 14（比官方小一号，与周围图标不成比例），现对齐 16。
   flex:none 防长模型名挤压图标 */
.dsh003-provider-logo--sm {
  width: 16px !important;
  height: 16px !important;
  flex: none !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}
.dsh003-provider-initial {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 16px !important;
  font-weight: 700 !important;
  line-height: 1 !important;
}
/* 触发按钮首字兜底微型徽标：16px 微圆角卡片，对齐左栏 36px 方框语言，中英文字号 11px 清晰不缩水 */
.dsh003-provider-initial--sm {
  width: 16px !important;
  height: 16px !important;
  flex: none !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: var(--dshT3-radius-sm, 4px) !important;
  background: var(--dsw-alias-interactive-bg-hover) !important;
  border: 1px solid var(--dsw-alias-border-l1) !important;
  color: var(--dsw-alias-label-primary) !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  line-height: 1 !important;
  box-sizing: border-box !important;
}
.dsh003-picker-model-col {
  flex: 1 !important;
  min-width: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  box-sizing: border-box !important;
}
.dsh003-picker-search-row {
  flex: none !important;
  padding: 8px !important;
  box-sizing: border-box !important;
}
/* 搜索框：与模型行同语言（interactive-bg-hover 填充、radius-md、同高 40、左右边界对齐 gutter 8） */
.dsh003-picker-search-box {
  position: relative !important;
  display: flex !important;
  align-items: center !important;
  min-width: 0 !important;
}
.dsh003-picker-search-icon {
  position: absolute !important;
  /* left 10：图标墨迹在 14px 盒内自 ~1.5px 起，落在内容列上，与模型名左缘对齐。
     与 padding-left 32 配对是为了让**看得见的**左右间距相等（不是盒子上的数字相等）：
     左侧 = 10 + 1.5 = 11.5；右侧 = 32 + 文字自留白 1.5 − (10 + 图标墨迹右缘 12) = 11.5。
     两个 1.5 都是应用内逐像素实测值（2026-10-07），换字体需重新量。
     不变量见 tests/search-icon-spacing.test.mjs。 */
  left: 10px !important;
  display: inline-flex !important;
  color: var(--dsw-alias-label-secondary) !important;
  pointer-events: none !important;
}
.dsh003-picker-search {
  display: block !important;
  width: 100% !important;
  min-width: 0 !important;
  height: 36px !important;
  /* 左内边距 32：为图标留位并让两侧"看得见的"间距相等——图标墨迹不占满 14px 盒，
     文字本身也带留白，所以盒子上的数字并不对称（左 10 / 右 8）。换算见 icon 规则注释。 */
  padding: 0 12px 0 32px !important;
  border: 1px solid transparent !important;
  border-radius: var(--dshT3-radius-md, 8px) !important;
  background: var(--dsw-alias-interactive-bg-hover) !important;
  color: var(--dsw-alias-label-primary) !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  outline: none !important;
  transition: border-color 120ms ease !important;
}
.dsh003-picker-search::placeholder {
  color: var(--dsw-alias-label-secondary) !important;
}
.dsh003-picker-search:focus-visible {
  border-color: var(--dshT3-ring, var(--dsw-alias-border-l3)) !important;
}
.dsh003-picker-model-list {
  flex: 1 !important;
  min-height: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 4px !important;
  overflow-y: auto !important;
  padding: 8px !important;
  box-sizing: border-box !important;
  --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2) !important;
  --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2) !important;
}
.dsh003-picker-empty {
  margin: 0 !important;
  padding: 16px 8px !important;
  font-size: 12px !important;
  line-height: 1.5 !important;
  color: var(--dsw-alias-label-secondary) !important;
}

/* 目录有部分失败时保留可用列表，并用紧凑说明解释缺失的提供方。 */
.dsh003-picker-notice {
  flex: none !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  margin: 0 !important;
  padding: 6px 12px !important;
  font-size: 11px !important;
  line-height: 16px !important;
  color: var(--dsw-alias-label-secondary) !important;
}
/* 重试：失败行的就地重载入口（官方 ModelSelect 的 .retry 同语义）。
   文字型按钮、右对齐，不抢失败原因的宽度。 */
.dsh003-picker-retry {
  flex: none !important;
  margin-left: auto !important;
  padding: 0 6px !important;
  height: 20px !important;
  border: none !important;
  border-radius: var(--dshT3-radius-sm, 6px) !important;
  background: transparent !important;
  color: var(--dsw-alias-label-primary) !important;
  font-size: 11px !important;
  line-height: 20px !important;
  cursor: pointer !important;
  text-decoration: underline !important;
  text-underline-offset: 2px !important;
}
.dsh003-picker-retry:hover {
  background: var(--dsw-alias-interactive-bg-hover) !important;
}
.dsh003-picker-retry:focus-visible {
  outline: none !important;
  box-shadow: 0 0 0 2px var(--dsw-alias-border-l3) !important;
}

/* ⑤ 模型行 */
.dsh003-picker-model-row {
  display: flex !important;
  align-items: center !important;
  width: 100% !important;
  padding: 6px 12px !important;
  border: none !important;
  border-radius: var(--dshT3-radius-md, 8px) !important;
  background: transparent !important;
  cursor: pointer !important;
  box-sizing: border-box !important;
  text-align: left !important;
  transition: background 120ms ease !important;
}
.dsh003-picker-model-row:hover,
.dsh003-picker-model-row:focus-visible {
  background: var(--dsw-alias-interactive-bg-hover) !important;
}
.dsh003-picker-model-row[data-active="true"] {
  background: var(--dsw-alias-interactive-bg-hover) !important;
}
/* 收藏视图两行制（M-054）：名 13px/1.3 + gap 1px + 副行 10px/1.2 收进 36px——行高由星标 24px 决定（与左栏按钮等高），内边距 6→3 让位 */
.dsh003-picker-model-row[data-sub="true"] {
  padding: 3px 12px !important;
  /* 内容 35.9px 补齐整 36——收藏视图节距 40 与普通视图/供应商列严格一致（M-054 R1） */
  min-height: 36px !important;
}
.dsh003-picker-model-row[data-sub="true"] .dsh003-picker-model-name {
  flex: none !important;
  line-height: 1.3 !important;
}
.dsh003-picker-model-text {
  flex: 1 !important;
  min-width: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 1px !important;
}
.dsh003-picker-model-name {
  flex: 1 !important;
  min-width: 0 !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  line-height: 1.4 !important;
  color: var(--dsw-alias-label-primary) !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}
.dsh003-picker-model-sub {
  font-size: 10px !important;
  line-height: 1.2 !important;
  color: var(--dsw-alias-label-secondary) !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}
.dsh003-picker-row-star {
  appearance: none !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  /* hover-reveal：宽度/间距瞬切（无位移动画），只留淡入——运动克制，长名行的瞬时重排藏在悬停首帧 */
  width: 0 !important;
  height: 24px !important;
  margin-left: 0 !important;
  flex: none !important;
  overflow: hidden !important;
  border: none !important;
  border-radius: var(--dshT3-radius-sm, 6px) !important;
  background: transparent !important;
  color: var(--dsw-alias-label-secondary) !important;
  cursor: pointer !important;
  box-sizing: border-box !important;
  opacity: 0 !important;
  transition: color 120ms ease, opacity 120ms ease !important;
}
.dsh003-picker-model-row:hover .dsh003-picker-row-star,
.dsh003-picker-row-star:focus-visible,
.dsh003-picker-row-star[data-fav="true"] {
  width: 24px !important;
  margin-left: 8px !important;
  opacity: 1 !important;
}
/* hover 预览色=点击结果色（M-053：星色语义统一黄系，收藏后同黄） */
.dsh003-picker-row-star:hover {
  color: var(--dshT3-warning, #f59e0b) !important;
}
.dsh003-picker-row-star[data-fav="true"] {
  color: var(--dshT3-warning, #f59e0b) !important;
}

/* 选中态小勾：与星标/搜索同族几何单线（trailing check，居右常驻，24px 容器盒与星标按钮严格居中对齐） */
.dsh003-picker-row-check {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 24px !important;
  height: 24px !important;
  flex: none !important;
  color: var(--dsw-alias-label-primary) !important;
  margin-left: 8px !important;
}
/* 当星标展开（收藏常驻或鼠标悬停）时，两盒紧挨（margin-left: 0），依靠两盒自带的各 5px 内留白形成天然通透的 10px 呼吸间隙 */
.dsh003-picker-row-star[data-fav="true"] + .dsh003-picker-row-check,
.dsh003-picker-model-row:hover .dsh003-picker-row-star + .dsh003-picker-row-check,
.dsh003-picker-row-star:focus-visible + .dsh003-picker-row-check {
  margin-left: 0 !important;
}

/* ⑥ 底部：思考强度单行集成条（左侧辅助标签+当前档名，右侧胶囊滑轨） */
.dsh003-picker-foot {
  flex: none !important;
  padding: 6px 12px !important;
  border-top: 1px solid var(--dsw-alias-border-l1) !important;
  display: flex !important;
  align-items: center !important;
  box-sizing: border-box !important;
}
.dsh003-picker-foot-inner {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  width: 100% !important;
  box-sizing: border-box !important;
}
/* 左侧文本堆叠：上为辅助标签 11px 中灰稳重，下为当前档位 13px 500 字重平衡。
   两行围绕列的中轴居中：档位名通常只有一两个字（中文「高」13px），
   若左对齐会贴在列最左、右侧空出一大截，读起来像丢了半个字。
   列宽不设 min-width，严格由标签决定——标签在所有语言下都是最宽的一行
   （实测：中文「思考深度」44px vs 最宽值「最高」26px；英文 78px vs 最宽值 56px），
   因此标签左缘恒为内容区起点，切换档位时滑杆也不会跳动。 */
.dsh003-picker-foot-info {
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  align-items: center !important;
  text-align: center !important;
  flex: 0 0 auto !important;
  gap: 0 !important;
  user-select: none !important;
}
.dsh003-picker-effort-sub {
  font-size: 11px !important;
  line-height: 15px !important;
  font-weight: 500 !important;
  color: var(--dsw-alias-label-secondary) !important;
}
.dsh003-picker-effort-val {
  font-size: 13px !important;
  line-height: 17px !important;
  font-weight: 500 !important;
  color: var(--dsw-alias-label-primary) !important;
  white-space: nowrap !important;
}
/* 不支持调节时的空态展示：与上面的档位堆叠保持同一中轴 */
.dsh003-picker-slider-empty {
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  align-items: center !important;
  text-align: center !important;
  gap: 2px !important;
  user-select: none !important;
}
.dsh003-picker-effort-none {
  font-size: 12px !important;
  line-height: 18px !important;
  color: var(--dsw-alias-label-secondary) !important;
}

/* 右侧横向滑轨容器（槽：20px 高，6px 圆角，与把手完全对齐） */
.dsh003-picker-slider {
  position: relative !important;
  flex: 1 1 auto !important;
  height: 20px !important;
  border-radius: var(--dshT3-radius-sm, 6px) !important;
  background: var(--dsw-alias-interactive-bg-hover) !important;
}

/* 命中层（自绘 role=slider）：铺满槽做纯交互面，DOM 顺序在最前：~ 兄弟选择器驱动珠 hover/active/focus 触感 */
.dsh003-picker-range {
  position: absolute !important;
  inset: 0 !important;
  z-index: 1 !important;
  cursor: pointer !important;
  outline: none !important;
  touch-action: none !important;
}

/* 刻度点：4px 细节奏点嵌在槽内（left 由行内样式按档数横向等距对齐珠心可达区），
   纯装饰不承担交互语义；当前档由珠位/档名表达；蓝点=最强端=右端刻度 */
.dsh003-picker-tick {
  position: absolute !important;
  top: 50% !important;
  width: 4px !important;
  height: 4px !important;
  border-radius: 999px !important;
  background: var(--dsw-alias-label-tertiary) !important;
  transform: translate(-50%, -50%) !important;
  pointer-events: none !important;
  transition: background 120ms ease !important;
}
/* 最高档主题色刻度点 */
.dsh003-picker-tick[data-max="true"] {
  background: color-mix(in oklch, var(--dshT3-primary, var(--dsw-alias-label-primary)) 65%, var(--dsw-alias-bg-layer-1)) !important;
}

/* 滑过深灰段：自槽左端向右长到珠心，width 由行内样式按 ratio 计算 */
.dsh003-picker-fill {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  height: 100% !important;
  border-radius: var(--dshT3-radius-sm, 6px) !important;
  background: var(--dsw-alias-interactive-bg-active) !important;
  pointer-events: none !important;
  transition: width 120ms ease !important;
}

/* 竖向扁药丸把手：16px 宽 × 20px 高（贴满槽高，静止零空隙零漏影），6px 圆角；hover/active
   触感 + focus ring 由命中层兄弟选择器驱动（命中层在 DOM 最前，~ 反选后面的视觉层） */
.dsh003-picker-knob {
  position: absolute !important;
  top: 50% !important;
  width: 16px !important;
  height: 20px !important;
  border: 1px solid var(--dsw-alias-border-l1) !important;
  border-radius: var(--dshT3-radius-sm, 6px) !important;
  background: var(--dsw-alias-bg-layer-1) !important;
  box-shadow: var(--dsw-shadow-lv1) !important;
  box-sizing: border-box !important;
  transform: translate(-50%, -50%) !important;
  pointer-events: none !important;
  transition: left 120ms ease, transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease !important;
}
.dsh003-picker-range:hover ~ .dsh003-picker-knob {
  transform: translate(-50%, -50%) scale(1.08) !important;
  box-shadow: var(--dsw-shadow-lv2) !important;
}
.dsh003-picker-range:active ~ .dsh003-picker-knob {
  transform: translate(-50%, -50%) scale(1.15) !important;
}
.dsh003-picker-range:focus-visible ~ .dsh003-picker-knob {
  border-color: var(--dshT3-ring, var(--dsw-alias-border-l3)) !important;
}

/* 拖动中：位移过渡旁路——关掉后 1:1 直跟零迟滞；触感过渡保留。松手 data-dragging 归 false → 平滑吸附 */
.dsh003-picker-slider[data-dragging='true'] .dsh003-picker-fill {
  transition: none !important;
}
.dsh003-picker-slider[data-dragging='true'] .dsh003-picker-knob {
  transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease !important;
}

/* 深色模式定值覆盖（继承 M-069 用户调优标准） */
body[data-ds-dark-theme] {
  --dsh003-effort-track: #4D4D4E;
  --dsh003-effort-fill: #7A7D82;
}
body[data-ds-dark-theme] .dsh003-picker-slider {
  background: var(--dsh003-effort-track, var(--dsw-alias-interactive-bg-hover)) !important;
}
body[data-ds-dark-theme] .dsh003-picker-fill {
  background: var(--dsh003-effort-fill, var(--dsw-alias-interactive-bg-active)) !important;
}
body[data-ds-dark-theme] .dsh003-picker-tick[data-max='true'] {
  background: var(--dsw-static-deepseek-400) !important;
}
body[data-ds-dark-theme] .dsh003-picker-knob {
  background: var(--dsw-alias-label-tertiary) !important;
}
`
