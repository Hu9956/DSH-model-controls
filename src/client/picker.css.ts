/**
 * M2-005a 模型选择器样式（settings 自绘家族同语言：--dsw-alias-* 语义色 + --dshT3-* 圆角，
 * 深色模式零特判）。挂载方式同 pluginCardsCss：layout-guard 注入独立 style 标签。
 * M-049：① 区触发按钮重写为官方模型触发器 chrome（ModelSelect.module.css .trigger 逐值
 * 对齐），新增组合容器类；②-⑥ 区面板浮层样式零改动。
 * 结构：① 触发按钮（M-049 官方对齐） ② 面板浮层（自适应高 + subtle enter） ③ 两栏主体（左栏收藏/短线/提供方，
 * 右栏搜索框/模型列表，gutter 统一 8px） ④ 模型行 ⑤ 底部占位。
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
  max-width: 220px !important;
  max-width: min(360px, 45cqw) !important;
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
/* 模型名：ellipsis 三件套（官方 .triggerLabel 同款）；宽度由按钮 max-width 钳制 */
.dsh003-picker-btn-label {
  min-width: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}
/* 推理等级：官方 caption 用色；空间不足时优先收缩并省略。 */
.dsh003-picker-btn-effort {
  flex-shrink: 1000 !important;
  min-width: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  color: var(--dsw-alias-label-caption) !important;
}
/* 箭头：官方 IconChevronDownOutline14 原件（caption tone），open 态翻转（官方 .chevron 同款） */
.dsh003-picker-chev {
  flex: 0 0 auto !important;
  color: var(--dsw-alias-label-caption) !important;
  transition: transform 120ms ease !important;
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
/* M-056：触发按钮 14px 小档——占位=实际渲染尺寸（SVG 随盒缩放），满幅 logo≈13px 文字高；
   flex:none 防长模型名挤压图标 */
.dsh003-provider-logo--sm {
  width: 14px !important;
  height: 14px !important;
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
  padding: 0 12px 0 36px !important;
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
  margin: 0 !important;
  padding: 6px 12px !important;
  font-size: 11px !important;
  line-height: 16px !important;
  color: var(--dsw-alias-label-secondary) !important;
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
/* 左侧文本堆叠：上为辅助标签 11px 中灰稳重，下为当前档位 13px 500 字重平衡 */
.dsh003-picker-foot-info {
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  flex: 0 0 auto !important;
  min-width: 56px !important;
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
/* 不支持调节时的空态展示 */
.dsh003-picker-slider-empty {
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  gap: 2px !important;
  user-select: none !important;
}
.dsh003-picker-effort-none {
  font-size: 12px !important;
  line-height: 18px !important;
  color: var(--dsw-alias-label-secondary) !important;
}

/* 右侧横向滑轨容器（槽：20px 高横胶囊，原竖轨 20px 宽全高倒过来） */
.dsh003-picker-slider {
  position: relative !important;
  flex: 1 1 auto !important;
  height: 20px !important;
  border-radius: 999px !important;
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

/* 滑过深灰段：真元素，自槽左端（Off 端）向右长到珠心，width 由行内样式按 ratio 计算 */
.dsh003-picker-fill {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  height: 100% !important;
  border-radius: 999px 0 0 999px !important;
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
