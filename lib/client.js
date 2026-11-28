window.__ModuleLoader__.load({
	id: "@kewen/dsh-model-controls",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region \0rolldown/runtime.js
		var __create = Object.create;
		var __defProp = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __getProtoOf = Object.getPrototypeOf;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __copyProps = (to, from, except, desc) => {
			if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
			return to;
		};
		var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
			value: mod,
			enumerable: true
		}) : target, mod));
		//#endregion
		let react = require("react");
		react = __toESM(react, 1);
		let react_jsx_runtime = require("react/jsx-runtime");
		let react_dom = require("react-dom");
		//#region ../packages/dsh-ui/src/icons.tsx
		/**
		* 统一 SVG 图标基础样式（02.6 & 08.3）：
		* - 16x16 视框、1.5px 线条、圆头圆角、currentColor 着色、默认 1em 随字号缩放；
		* - .dsh-icon-inline（vertical-align: -0.125em）对齐正文光学中心；
		* - .dsh-spin 加载旋转在 prefers-reduced-motion 下保留 1.8s 慢速旋转防假死。
		*/
		const iconBaseCss = `
@keyframes dsh-spin {
  to { transform: rotate(360deg); }
}
.dsh-icon,
.dsh-i {
  display: inline-block;
  flex: none;
  width: 1em;
  height: 1em;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  overflow: visible;
}
.dsh-icon-inline,
.dsh-i {
  vertical-align: -0.125em;
}
.dsh-spin {
  transform-origin: 50% 50%;
  animation: dsh-spin var(--dsh-dur-spin, 800ms) linear infinite;
}
/* 统一加载环原语（Spinner）：全站按钮 / 侧边栏 / 折叠头 / 状态点 / 空态共享单一 SVG 视觉源 */
.dsh-spinner {
  display: inline-block;
  flex: none;
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: butt;
  color: currentColor;
  transform-origin: 50% 50%;
  animation: dsh-spin var(--dsh-dur-spin, 800ms) linear infinite;
}
.dsh-spinner[hidden] { display: none; }
.dsh-spinner-xs { width: 12px; height: 12px; }
.dsh-spinner-sm { width: 13px; height: 13px; }
.dsh-spinner-md { width: 14px; height: 14px; }
.dsh-spinner-lg { width: 18px; height: 18px; }
.dsh-spinner-brand,
.dsh-spinner.is-brand {
  color: var(--dsw-alias-state-business-primary);
}
@media (prefers-reduced-motion: reduce) {
  .dsh-spin,
  .dsh-spinner {
    animation-duration: 1.8s !important;
    animation-iteration-count: infinite !important;
  }
}
html[data-dsh-reduce-motion] .dsh-spin,
html[data-dsh-reduce-motion] .dsh-spinner {
  animation-duration: 1.8s !important;
  animation-iteration-count: infinite !important;
}
`;
		const SPINNER_SIZE_CLASS = {
			xs: "dsh-spinner-xs",
			sm: "dsh-spinner-sm",
			md: "dsh-spinner-md",
			lg: "dsh-spinner-lg"
		};
		/**
		* 统一加载环原语（Spinner）：
		* 全站常规转圈唯一视觉源（14x14 双环 SVG，22% 淡底轨 + 75% butt 平头实弧，800ms 匀速旋转，减动效 1.8s）。
		*/
		function Spinner({ size = "md", tone = "inherit", className, width, height, ...rest }) {
			const isNamedSize = typeof size === "string";
			const classes = ["dsh-spinner"];
			if (isNamedSize) classes.push(SPINNER_SIZE_CLASS[size]);
			if (tone === "brand") classes.push("is-brand");
			if (className) classes.push(className);
			const ariaHidden = rest["aria-label"] !== void 0 || rest["aria-labelledby"] !== void 0 ? rest["aria-hidden"] : rest["aria-hidden"] ?? true;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 14 14",
				width: width ?? (isNamedSize ? void 0 : size),
				height: height ?? (isNamedSize ? void 0 : size),
				fill: "none",
				stroke: "currentColor",
				strokeWidth: 1.5,
				strokeLinecap: "butt",
				focusable: "false",
				...rest,
				"aria-hidden": ariaHidden,
				className: classes.join(" "),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
					cx: "7",
					cy: "7",
					r: "6.25",
					strokeOpacity: .22
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
					cx: "7",
					cy: "7",
					r: "6.25",
					pathLength: 100,
					strokeDasharray: "75 100",
					strokeLinecap: "butt"
				})]
			});
		}
		function buildSvgProps({ size, inline = true, className, width, height, ...rest }, extraClass) {
			const classes = ["dsh-icon"];
			if (inline) classes.push("dsh-icon-inline");
			if (extraClass) classes.push(extraClass);
			if (className) classes.push(className);
			const ariaHidden = rest["aria-label"] !== void 0 || rest["aria-labelledby"] !== void 0 ? rest["aria-hidden"] : rest["aria-hidden"] ?? true;
			return {
				viewBox: "0 0 16 16",
				width: width ?? size ?? "1em",
				height: height ?? size ?? "1em",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: 1.5,
				strokeLinecap: "round",
				strokeLinejoin: "round",
				focusable: "false",
				...rest,
				"aria-hidden": ariaHidden,
				className: classes.join(" ")
			};
		}
		function CheckIcon(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				...buildSvgProps(props),
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M3 8.5 6.5 12 13 4.5" })
			});
		}
		function SearchIcon(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				...buildSvgProps(props),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
					cx: "7",
					cy: "7",
					r: "4.25"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M10.25 10.25 13.5 13.5" })]
			});
		}
		function CloseIcon(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				...buildSvgProps(props),
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M4 4l8 8M12 4l-8 8" })
			});
		}
		function EyeIcon(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				...buildSvgProps(props),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
					cx: "8",
					cy: "8",
					r: "2"
				})]
			});
		}
		function EyeOffIcon(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				...buildSvgProps(props),
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
						cx: "8",
						cy: "8",
						r: "2"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M2.5 2.5l11 11" })
				]
			});
		}
		function StarIcon({ filled = false, ...props }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				...buildSvgProps(props),
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M8 2.2l1.8 3.7 4 .6-2.9 2.8.7 4L8 11.4l-3.6 1.9.7-4L2.2 6.5l4-.6z",
					fill: filled ? "currentColor" : "none"
				})
			});
		}
		function InfoIcon(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				...buildSvgProps(props),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
					cx: "8",
					cy: "8",
					r: "5.75"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M8 7.5v3.5M8 5.1v.01" })]
			});
		}
		function PlusIcon(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				...buildSvgProps(props),
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M8 3.5v9M3.5 8h9" })
			});
		}
		(0, react.forwardRef)(function Button({ variant = "ghost", size = "md", icon, trailingIcon, loading = false, tip, disabled, className, children, ...rest }, ref) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				ref,
				type: "button",
				disabled: Boolean(disabled || loading),
				"aria-busy": loading || void 0,
				"data-hs-tip": tip,
				className: `hs-btn hs-btn-${variant === "danger" ? "danger-ghost" : variant}${variant === "danger" ? " hs-btn-danger" : ""} hs-btn-${size}${loading ? " is-loading" : ""}${className ? ` ${className}` : ""}`,
				...rest,
				children: [
					loading ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "hs-btn-icon",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { size: size === "sm" ? "sm" : "md" })
					}) : icon != null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "hs-btn-icon",
						children: icon
					}),
					children,
					trailingIcon != null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "hs-btn-chev",
						children: trailingIcon
					})
				]
			});
		});
		const buttonCss = `
@keyframes dsh-spin {
  to { transform: rotate(360deg); }
}
.hs-btn {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  border-radius: 999px;
  corner-shape: round;
  cursor: pointer;
  font-family: inherit;
  font-size: var(--dsh-text-lg, 14px);
  line-height: 22px;
  color: var(--dsw-alias-label-primary);
  background: transparent;
  padding: 0 16px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background var(--dsh-dur-hover, 120ms) ease, opacity var(--dsh-dur-hover, 120ms) ease, transform var(--dsh-dur-release, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.hs-btn[hidden] { display: none; }
.hs-btn:disabled { cursor: not-allowed; opacity: .4; }
.hs-btn-primary:disabled:not(.is-loading),
.hs-btn-danger-solid:disabled:not(.is-loading) {
  opacity: 1;
  background-color: var(--dsh-toolbar-fill-hover, color-mix(in srgb, var(--dsw-alias-label-primary) 7.2%, transparent));
  color: color-mix(in srgb, var(--dsw-alias-label-primary) 38%, transparent);
  box-shadow: none;
}
.hs-btn:active:not(:disabled) {
  transform: scale(.98);
  transition-duration: var(--dsh-dur-press, 60ms);
  transition-timing-function: var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.hs-btn:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: 2px;
}
.hs-btn-md { height: var(--dsh-control-md, 36px); }
.hs-btn-sm {
  position: relative;
  height: var(--dsh-control-sm, 28px);
  gap: 5px;
  font-size: var(--dsh-text-sm, 12px);
  line-height: 18px;
  padding: 0 12px;
  border-radius: 999px;
  corner-shape: round;
}
.hs-btn-md:has(> .hs-btn-icon:first-child) {
  padding-inline-start: 13px;
}
.hs-btn-md:has(> .hs-btn-chev:last-child) {
  padding-inline-end: 13px;
}
.hs-btn-sm:has(> .hs-btn-icon:first-child) {
  padding-inline-start: 10px;
}
.hs-btn-sm:has(> .hs-btn-chev:last-child) {
  padding-inline-end: 10px;
}
.hs-btn:has(> .hs-btn-chev:last-child) {
  gap: 4px;
}
@media (pointer: coarse) {
  .hs-btn-sm::after,
  .dsh-chip::after {
    content: "";
    position: absolute;
    inset: -4px 0;
    border-radius: 999px;
    corner-shape: round;
  }
}
.hs-btn-primary {
  border: 1px solid transparent;
  background-clip: padding-box;
  background-color: var(--dsh-cta-bg, var(--dsh-brand-fill, var(--dsw-alias-button-primary-fill)));
  color: var(--dsh-cta-fg, var(--dsw-alias-label-primary-foreground));
  font-weight: 500;
  box-shadow: var(--dsh-cta-shadow, none);
}
.hs-btn-outline {
  border: 1px solid color-mix(in srgb, var(--dsw-alias-border-l3) 45%, var(--dsw-alias-border-l4));
  background: transparent;
}
.hs-btn-outline:active:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-active);
}
.hs-btn-toolbar {
  background: var(--dsh-toolbar-fill, var(--dsw-alias-button-tool-bar-fill));
}
.hs-btn-toolbar:not([aria-pressed="true"]):active:not(:disabled) {
  background: var(--dsh-toolbar-fill-active);
}
/* 对齐宿主激活胶囊的中性语言：中性加深底 + 1px 中性内描边 + 主字色，不染品牌蓝 */
.hs-btn-toolbar[aria-pressed="true"] {
  background: var(--dsh-toolbar-fill-active, var(--dsw-alias-interactive-bg-active));
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--dsw-alias-label-primary) 36%, transparent);
  color: var(--dsw-alias-label-primary);
  font-weight: 500;
}
.hs-btn-ghost:active:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-active);
}
.hs-btn-danger-ghost,
.hs-btn-danger {
  color: var(--dsh-state-err-text, var(--dsw-alias-state-error-primary));
  background: transparent;
}
.hs-btn-danger-ghost:active:not(:disabled),
.hs-btn-danger:active:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover-danger);
}
/* 淡红浅底危险钮（danger-soft）：三个操作时最左侧的次要破坏性操作（如「不保存」）
   与警示标、危险提示框同一淡红底，文字用对比度专用红字；深色下淡红叠深灰会发浑，单独降到 10% */
.hs-btn-danger-soft {
  color: var(--dsh-state-err-text, var(--dsw-alias-state-error-primary));
  background: var(--dsw-alias-interactive-bg-hover-danger);
}
.hs-btn-danger-soft:active:not(:disabled) {
  background: color-mix(in srgb, var(--dsw-alias-interactive-bg-hover-danger), var(--dsw-alias-state-error-primary) 9%);
}
:is(body[data-ds-dark-theme], html[data-theme="dark"] body) .hs-btn-danger-soft {
  background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent);
}
:is(body[data-ds-dark-theme], html[data-theme="dark"] body) .hs-btn-danger-soft:active:not(:disabled) {
  background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 20%, transparent);
}
.hs-btn-danger-solid {
  border: 1px solid transparent;
  background-clip: padding-box;
  background-color: var(--dsh-danger-solid-bg, var(--dsw-alias-state-error-primary));
  color: var(--dsh-solid-on-color, var(--dsw-alias-label-primary-foreground));
  font-weight: 500;
}
.hs-btn-primary.hs-btn-sm,
.hs-btn-danger-solid.hs-btn-sm {
  border-width: .5px;
}
@media (hover: hover) {
  .hs-btn-primary:hover:not(:disabled) {
    background-color: var(--dsh-cta-bg-hover, var(--dsh-brand-fill-hover, var(--dsw-alias-button-primary-hover)));
  }
  .hs-btn-outline:hover:not(:disabled) {
    background: var(--dsw-alias-interactive-bg-hover);
    border-color: var(--dsw-alias-border-l4);
  }
  .hs-btn-toolbar:not([aria-pressed="true"]):hover:not(:disabled) {
    background: var(--dsh-toolbar-fill-hover, var(--dsw-alias-button-tool-bar-hover));
  }
  .hs-btn-toolbar[aria-pressed="true"]:hover:not(:disabled) {
    background: color-mix(in srgb, var(--dsh-toolbar-fill-active, var(--dsw-alias-interactive-bg-active)), var(--dsw-alias-label-primary) 3.5%);
  }
  .hs-btn-ghost:hover:not(:disabled) {
    background: var(--dsw-alias-interactive-bg-hover);
  }
  .hs-btn-danger-ghost:hover:not(:disabled),
  .hs-btn-danger:hover:not(:disabled) {
    background: var(--dsw-alias-interactive-bg-hover-danger);
  }
  .hs-btn-danger-soft:hover:not(:disabled) {
    background: color-mix(in srgb, var(--dsw-alias-interactive-bg-hover-danger), var(--dsw-alias-state-error-primary) 5%);
  }
  :is(body[data-ds-dark-theme], html[data-theme="dark"] body) .hs-btn-danger-soft:hover:not(:disabled) {
    background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 15%, transparent);
  }
  .hs-btn-danger-solid:hover:not(:disabled) {
    background-color: var(--dsh-danger-solid-hover, var(--dsh-danger-solid-bg));
  }
}
.hs-btn:not(.hs-btn-primary):not(.hs-btn-danger-solid)[aria-expanded="true"] {
  background: var(--dsw-alias-interactive-bg-active);
  border-color: var(--dsw-alias-border-l4);
}
.hs-btn-icon {
  display: inline-flex;
  width: 15px;
  height: 15px;
  align-items: center;
  justify-content: center;
  flex: none;
}
.hs-btn-sm .hs-btn-icon {
  width: 14px;
  height: 14px;
}
.hs-btn-icon .dsh-i,
.hs-btn-chev .dsh-i {
  vertical-align: 0;
}
.hs-btn-sm .hs-btn-icon .dsh-i {
  width: 13px;
  height: 13px;
}
.hs-btn .hs-mark.is-spin {
  color: currentColor;
}
.hs-btn-sm .hs-mark.is-spin {
  width: 13px;
  height: 13px;
}
.hs-btn-chev {
  display: inline-flex;
  transition: transform var(--dsh-dur-expand, 220ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1)), opacity var(--dsh-dur-hover, 120ms) ease;
  opacity: .72;
}
.hs-btn[aria-expanded="true"] .hs-btn-chev {
  transform: rotate(180deg);
  opacity: .92;
}
.hs-spinner {
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  corner-shape: round;
  border: 1.5px solid currentColor;
  border-right-color: color-mix(in srgb, currentColor 22%, transparent);
  animation: dsh-spin var(--dsh-dur-spin, 800ms) linear infinite;
  flex: none;
}
.hs-btn-sm .hs-spinner {
  width: 13px;
  height: 13px;
}
.hs-btn.is-loading,
.hs-btn.is-loading:disabled {
  cursor: progress;
  opacity: 1;
  pointer-events: none;
}
.hs-btn-primary.is-loading {
  color: color-mix(in srgb, var(--dsh-cta-fg, var(--dsw-alias-label-primary-foreground)) 90%, transparent);
}
.hs-btn-danger-solid.is-loading {
  color: color-mix(in srgb, var(--dsh-solid-on-color, var(--dsw-alias-label-primary-foreground)) 90%, transparent);
}
.hs-btn-toolbar.is-loading,
.hs-btn-outline.is-loading,
.hs-btn-ghost.is-loading {
  color: var(--dsw-alias-label-secondary);
}
.dsh-chip {
  position: relative;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: var(--dsh-control-sm, 28px);
  padding: 0 12px;
  border-radius: 999px;
  corner-shape: round;
  border: .5px solid var(--dsw-alias-border-l3);
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: var(--dsh-text-sm, 12px);
  white-space: nowrap;
  flex: none;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background var(--dsh-dur-hover, 120ms) ease, color var(--dsh-dur-hover, 120ms) ease, border-color var(--dsh-dur-hover, 120ms) ease, transform var(--dsh-dur-release, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-chip:active:not(:disabled) {
  transform: scale(.98);
  transition-duration: var(--dsh-dur-press, 60ms);
  transition-timing-function: var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-chip:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: 2px;
}
@media (hover: hover) {
  .dsh-chip:hover {
    background: var(--dsw-alias-interactive-bg-hover);
    color: var(--dsw-alias-label-primary);
  }
}
.dsh-chip[aria-pressed="true"] {
  background: var(--dsw-alias-state-business-tertiary);
  border-color: color-mix(in srgb, var(--dsw-alias-state-business-primary) 42%, transparent);
  color: var(--dsh-state-info-text, var(--dsw-alias-state-business-primary));
  font-weight: 500;
}
.dsh-chip.is-warn[aria-pressed="true"] {
  background: var(--dsw-alias-state-warn-tertiary);
  border-color: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 42%, transparent);
  color: var(--dsh-state-warn-text);
}
@media (prefers-contrast: more) {
  .hs-btn-toolbar {
    border: .5px solid var(--dsw-alias-border-l4);
  }
}
@media (forced-colors: active) {
  .hs-btn-primary,
  .hs-btn-danger-solid,
  .hs-btn-toolbar {
    border: 1px solid ButtonText;
  }
  .hs-btn-toolbar[aria-pressed="true"],
  .dsh-chip[aria-pressed="true"] {
    background: Highlight;
    border-color: Highlight;
    color: HighlightText;
  }
}
`;
		//#endregion
		//#region ../packages/dsh-ui/src/host-bridge.ts
		/**
		* CJK 输入法选词态守卫：兼容原生 KeyboardEvent 与 React SyntheticEvent（isComposing === true || keyCode === 229）。
		*/
		function isImeComposing(event) {
			if (!event) return false;
			if (event.isComposing === true || event.keyCode === 229) return true;
			if (event.nativeEvent?.isComposing === true || event.nativeEvent?.keyCode === 229) return true;
			return false;
		}
		const dragRefCounts = /* @__PURE__ */ new WeakMap();
		/**
		* 全局拖拽防吞指针盾：按根节点做引用计数维护 html[data-dsh-dragging]，
		* 分屏条或浮窗拖拽期间全局锁定 user-select: none 与 iframe { pointer-events: none !important }。
		*/
		function beginGlobalDrag(doc) {
			const root = (doc ?? (typeof document !== "undefined" ? document : void 0))?.documentElement;
			if (!root) return () => {};
			const prev = dragRefCounts.get(root) ?? 0;
			dragRefCounts.set(root, prev + 1);
			root.setAttribute("data-dsh-dragging", "");
			let ended = false;
			return () => {
				if (ended) return;
				ended = true;
				const current = dragRefCounts.get(root) ?? 1;
				const next = Math.max(0, current - 1);
				if (next === 0) {
					dragRefCounts.delete(root);
					root.removeAttribute("data-dsh-dragging");
				} else dragRefCounts.set(root, next);
			};
		}
		//#endregion
		//#region ../packages/dsh-ui/src/infotip-place.ts
		/**
		* 计算说明按钮浮层位置（实测尺寸 + 容器感知边界夹紧 + 动态锚点原点）：
		* - 默认优先在 ⓘ 上方 6px（不挡下一行列表阅读流），仅当上方放不下时翻到下方 6px；
		* - 默认右缘对齐 ⓘ 右缘（从右往左生长贴合左侧被说明文案），并将水平边界夹紧至「视口安全区 ∩ 所属浮层/卡片内边距」；
		* - 动态反算指向 ⓘ 中心的 transform-origin，确保缩放动画始终从圆钮长出。
		*/
		function placeInfoTip(anchor, viewport, options) {
			const maxWidth = options?.maxWidth ?? 300;
			const gap = options?.gap ?? 6;
			const margin = options?.margin ?? 12;
			const containerPadding = options?.containerPadding ?? 8;
			const roomAbove = options?.roomAbove ?? 140;
			const preferredSide = options?.side ?? "top";
			const preferredAlign = options?.align ?? "end";
			const topLimit = Math.max(margin, options?.topClearance ?? margin);
			let minX = margin;
			let maxX = Math.max(margin, viewport.width - margin);
			const bounds = options?.containerBounds;
			if (bounds && bounds.right > bounds.left) {
				const cMin = Math.max(minX, Math.round(bounds.left + containerPadding));
				const cMax = Math.min(maxX, Math.round(bounds.right - containerPadding));
				if (cMax - cMin >= 160) {
					minX = cMin;
					maxX = cMax;
				}
			}
			const availMaxWidth = Math.max(0, Math.min(maxWidth, maxX - minX));
			const measuredW = options?.bubbleWidth;
			const w = measuredW !== void 0 && measuredW > 0 ? Math.min(measuredW, availMaxWidth) : availMaxWidth;
			const anchorLeft = anchor.left ?? Math.max(0, anchor.right - 24);
			const anchorCenterX = (anchorLeft + anchor.right) / 2;
			let rawLeft;
			if (preferredAlign === "start") rawLeft = anchorLeft;
			else if (preferredAlign === "end") rawLeft = anchor.right - w;
			else rawLeft = anchorCenterX - w / 2;
			const left = Math.round(Math.min(Math.max(rawLeft, minX), Math.max(minX, maxX - w)));
			const measuredH = options?.bubbleHeight;
			const hasMeasuredH = measuredH !== void 0 && measuredH > 0;
			const fitsAbove = hasMeasuredH ? anchor.top - measuredH - gap >= topLimit : anchor.top >= roomAbove;
			const fitsBelow = hasMeasuredH ? anchor.bottom + gap + measuredH <= viewport.height - margin : true;
			const resolvedSide = preferredSide === "top" ? fitsAbove || !fitsBelow ? "top" : "bottom" : fitsBelow || !fitsAbove ? "bottom" : "top";
			const origin = `${w > 0 ? Math.round(Math.min(Math.max(anchorCenterX - left, 8), Math.max(8, w - 8))) : 12}px ${resolvedSide === "top" ? "bottom" : "top"}`;
			if (resolvedSide === "top") return {
				left,
				maxWidth: availMaxWidth,
				side: resolvedSide,
				align: preferredAlign,
				origin,
				bottom: Math.round(viewport.height - anchor.top + gap)
			};
			return {
				left,
				maxWidth: availMaxWidth,
				side: resolvedSide,
				align: preferredAlign,
				origin,
				top: Math.round(anchor.bottom + gap)
			};
		}
		//#endregion
		//#region ../packages/dsh-ui/src/scroll-area-dom.ts
		const LONG_LIST_RATIO = 2;
		const THUMB_PAD = 6;
		const FOLLOW_BOTTOM_THRESHOLD = 40;
		const USER_SCROLL_COOLDOWN_MS = 150;
		const SCROLL_ACTIVE_FLASH_MS = 900;
		function setBoolAttr(el, name, on) {
			if (on) el.setAttribute(name, "");
			else el.removeAttribute(name);
		}
		/**
		* 05 ScrollArea 纯 DOM 挂载内核（零外部依赖）：
		* - 动态计算 scrollTop 与可滚高度，切换视口 data-fade-top / data-fade-bottom 驱动 7 段幂律边缘渐隐；
		* - 内容超过阈值时在外框启用悬浮细滑块 .dsh-scroll-thumb（aria-hidden，支持指针拖拽并接入 beginGlobalDrag 防吞指针盾）；
		* - 常驻轻量 MutationObserver：列表筛减、分组折叠跨越阈值时即时刷新滑块与渐隐；
		* - 可选 followBottom 流式自动贴底（距底 <= 40px 自动跟随，用户主动上滚 150ms 冷却防抢滚动条）。
		*/
		function attachScrollAreaWithSync(viewport, options) {
			const frame = viewport.parentElement;
			const thumb = frame?.querySelector(".dsh-scroll-thumb") ?? null;
			const enableFade = options?.fade !== false;
			const followBottom = Boolean(options?.followBottom);
			const thumbThreshold = options?.thumbThreshold ?? LONG_LIST_RATIO;
			const now = options?.now ?? (() => Date.now());
			const win = viewport.ownerDocument?.defaultView;
			const setTimer = typeof win?.setTimeout === "function" ? win.setTimeout.bind(win) : setTimeout;
			const clearTimer = typeof win?.clearTimeout === "function" ? win.clearTimeout.bind(win) : clearTimeout;
			let disposed = false;
			let hideTimer = null;
			let drag = null;
			let lastScrollTop = viewport.scrollTop || 0;
			let lastScrollHeight = viewport.scrollHeight || 0;
			let nearBottom = lastScrollHeight - (viewport.clientHeight || 0) - lastScrollTop <= FOLLOW_BOTTOM_THRESHOLD;
			let cooldownUntil = 0;
			let programmaticScroll = false;
			const metrics = () => {
				const clientH = viewport.clientHeight || 0;
				const scrollH = viewport.scrollHeight || 0;
				const track = Math.max(0, clientH - THUMB_PAD * 2);
				const rawH = scrollH > 0 ? Math.max(24, track * clientH / scrollH) : 24;
				return {
					clientH,
					scrollH,
					track,
					h: track > 0 ? Math.min(track, rawH) : 0,
					maxScroll: Math.max(0, scrollH - clientH)
				};
			};
			const sync = () => {
				if (disposed) return;
				const { clientH, scrollH, track, h, maxScroll } = metrics();
				const topPos = viewport.scrollTop || 0;
				const hasTop = enableFade && topPos > 2;
				const hasBot = enableFade && clientH > 0 && topPos + clientH < scrollH - 2;
				setBoolAttr(viewport, "data-fade-top", hasTop);
				setBoolAttr(viewport, "data-fade-bottom", hasBot);
				if (!thumb) return;
				const isLong = clientH > 0 && track > 0 && scrollH > clientH * thumbThreshold;
				thumb.hidden = !isLong;
				if (!isLong) {
					if (!drag) frame?.removeAttribute("data-scroll-active");
					return;
				}
				const thumbTop = (viewport.offsetTop || 0) + THUMB_PAD + Math.max(0, track - h) * (maxScroll > 0 ? topPos / maxScroll : 0);
				thumb.style.height = `${h}px`;
				thumb.style.transform = `translateY(${thumbTop}px)`;
			};
			const scheduleHideActive = () => {
				if (!frame) return;
				if (hideTimer !== null) {
					clearTimer(hideTimer);
					hideTimer = null;
				}
				if (!drag && !disposed) hideTimer = setTimer(() => {
					hideTimer = null;
					if (!disposed && !drag) frame.removeAttribute("data-scroll-active");
				}, SCROLL_ACTIVE_FLASH_MS);
			};
			const maybeStickToBottom = () => {
				if (!followBottom) return;
				const curScrollH = viewport.scrollHeight || 0;
				const curClientH = viewport.clientHeight || 0;
				const curTop = viewport.scrollTop || 0;
				if (curScrollH <= lastScrollHeight) {
					lastScrollHeight = curScrollH;
					nearBottom = curScrollH - curClientH - curTop <= FOLLOW_BOTTOM_THRESHOLD;
					return;
				}
				const prevDistance = lastScrollHeight - curClientH - curTop;
				const shouldStick = (nearBottom || prevDistance <= FOLLOW_BOTTOM_THRESHOLD) && now() >= cooldownUntil;
				lastScrollHeight = curScrollH;
				if (shouldStick) {
					programmaticScroll = true;
					viewport.scrollTop = Math.max(0, curScrollH - curClientH);
					lastScrollTop = viewport.scrollTop;
					nearBottom = true;
					programmaticScroll = false;
				} else nearBottom = curScrollH - curClientH - curTop <= FOLLOW_BOTTOM_THRESHOLD;
			};
			const onScroll = () => {
				const curTop = viewport.scrollTop || 0;
				const curScrollH = viewport.scrollHeight || 0;
				const curClientH = viewport.clientHeight || 0;
				if (!programmaticScroll && curTop < lastScrollTop - 1) cooldownUntil = now() + USER_SCROLL_COOLDOWN_MS;
				lastScrollTop = curTop;
				lastScrollHeight = curScrollH;
				nearBottom = curScrollH - curClientH - curTop <= FOLLOW_BOTTOM_THRESHOLD;
				sync();
				if (frame) {
					frame.setAttribute("data-scroll-active", "");
					scheduleHideActive();
				}
			};
			const onWheel = (event) => {
				const deltaY = event.deltaY;
				if (typeof deltaY === "number" && deltaY < 0) cooldownUntil = now() + USER_SCROLL_COOLDOWN_MS;
			};
			const endDrag = (event) => {
				if (drag) {
					event?.preventDefault?.();
					event?.stopPropagation?.();
					drag.releaseShield();
					drag = null;
					thumb?.removeAttribute("data-dragging");
					scheduleHideActive();
					return;
				}
				thumb?.removeAttribute("data-dragging");
			};
			const onThumbDown = (event) => {
				event.preventDefault?.();
				event.stopPropagation?.();
				if (!thumb || disposed) return;
				endDrag();
				thumb.setPointerCapture?.(event.pointerId);
				thumb.setAttribute("data-dragging", "");
				frame?.setAttribute("data-scroll-active", "");
				if (hideTimer !== null) {
					clearTimer(hideTimer);
					hideTimer = null;
				}
				const releaseShield = beginGlobalDrag(viewport.ownerDocument);
				drag = {
					y: event.clientY,
					scroll: viewport.scrollTop || 0,
					releaseShield
				};
			};
			const onThumbMove = (event) => {
				if (!drag || disposed) return;
				event.preventDefault?.();
				event.stopPropagation?.();
				const { track, h, maxScroll } = metrics();
				const next = drag.scroll + (event.clientY - drag.y) * maxScroll / Math.max(1, track - h);
				viewport.scrollTop = Math.min(maxScroll, Math.max(0, next));
				sync();
			};
			const swallowClick = (event) => {
				event.preventDefault?.();
				event.stopPropagation?.();
			};
			viewport.addEventListener("scroll", onScroll, { passive: true });
			viewport.addEventListener("wheel", onWheel, { passive: true });
			thumb?.addEventListener("pointerdown", onThumbDown);
			thumb?.addEventListener("pointermove", onThumbMove);
			thumb?.addEventListener("pointerup", endDrag);
			thumb?.addEventListener("pointercancel", endDrag);
			thumb?.addEventListener("lostpointercapture", endDrag);
			thumb?.addEventListener("click", swallowClick);
			const ResizeCtor = win?.ResizeObserver ?? globalThis.ResizeObserver;
			const ro = ResizeCtor ? new ResizeCtor(() => {
				maybeStickToBottom();
				sync();
			}) : null;
			ro?.observe(viewport);
			const MutationCtor = win?.MutationObserver ?? globalThis.MutationObserver;
			const mo = MutationCtor ? new MutationCtor(() => {
				maybeStickToBottom();
				sync();
			}) : null;
			mo?.observe(viewport, {
				childList: true,
				subtree: true,
				...followBottom ? { characterData: true } : {}
			});
			sync();
			const dispose = () => {
				if (disposed) return;
				disposed = true;
				if (drag) {
					drag.releaseShield();
					drag = null;
				}
				thumb?.removeAttribute("data-dragging");
				frame?.removeAttribute("data-scroll-active");
				if (hideTimer !== null) {
					clearTimer(hideTimer);
					hideTimer = null;
				}
				ro?.disconnect();
				mo?.disconnect();
				viewport.removeEventListener("scroll", onScroll);
				viewport.removeEventListener("wheel", onWheel);
				thumb?.removeEventListener("pointerdown", onThumbDown);
				thumb?.removeEventListener("pointermove", onThumbMove);
				thumb?.removeEventListener("pointerup", endDrag);
				thumb?.removeEventListener("pointercancel", endDrag);
				thumb?.removeEventListener("lostpointercapture", endDrag);
				thumb?.removeEventListener("click", swallowClick);
			};
			return {
				sync,
				dispose
			};
		}
		/**
		* 05 ScrollArea 命令式挂载器（返回幂等清理函数）。
		*/
		function attachScrollArea(viewport, options) {
			return attachScrollAreaWithSync(viewport, options).dispose;
		}
		//#endregion
		//#region ../packages/dsh-ui/src/middle-truncate.ts
		/**
		* 中部截断双段样式：外层 inline-flex 整体参与行内排版，head 段可收缩带省略号，
		* tail 段定长不缩、超宽时自身以 70% 上限二次省略，保证文件名 / 模型 ID 尾缀始终可读。
		*/
		const middleTruncateCss = `
.dsh-mtrunc {
  display: inline-flex;
  min-width: 0;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  vertical-align: bottom;
}
.dsh-mtrunc-head {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dsh-mtrunc-tail {
  flex: 0 0 auto;
  max-width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
}
`;
		//#endregion
		//#region ../packages/dsh-ui/src/dom-primitives.ts
		function splitClasses(cls) {
			return (cls ?? "").split(/\s+/).filter(Boolean);
		}
		function hasClass(el, cls) {
			if (!el) return false;
			if (el.classList && typeof el.classList.contains === "function") return el.classList.contains(cls);
			return splitClasses(el.className).includes(cls);
		}
		function addClass(el, ...names) {
			const toAdd = names.flatMap((n) => typeof n === "string" ? splitClasses(n) : []);
			if (toAdd.length === 0) return;
			if (el.classList && typeof el.classList.add === "function") {
				el.classList.add(...toAdd);
				return;
			}
			const existing = splitClasses(el.className);
			for (const c of toAdd) if (!existing.includes(c)) existing.push(c);
			el.className = existing.join(" ");
		}
		function removeClass(el, ...names) {
			if (names.length === 0) return;
			if (el.classList && typeof el.classList.remove === "function") {
				el.classList.remove(...names);
				return;
			}
			const drop = new Set(names);
			el.className = splitClasses(el.className).filter((c) => !drop.has(c)).join(" ");
		}
		function getDirectChildren(el) {
			return Array.from(el.children ?? []);
		}
		function prependChild(parent, child) {
			if (typeof parent.prepend === "function") parent.prepend(child);
			else parent.insertBefore(child, parent.firstChild ?? null);
		}
		function findMatchingItemInMenu(menu, target, itemSelector) {
			if (!target || typeof target !== "object") return null;
			const maybeEl = target;
			if (typeof maybeEl.closest === "function") try {
				const hit = maybeEl.closest(itemSelector);
				return hit && menu.contains(hit) ? hit : null;
			} catch {}
			const candidates = Array.from(menu.querySelectorAll(itemSelector));
			for (const item of candidates) if (item === maybeEl || typeof item.contains === "function" && item.contains(maybeEl)) return item;
			return null;
		}
		const DEFAULT_SLIDING_ITEM_SELECTOR = "[role=\"tab\"], .dsh-seg-item, .dsh-utab, button";
		function isSlidingCandidateSelected(el) {
			return el.getAttribute("aria-selected") === "true" || el.getAttribute("aria-pressed") === "true" || el.getAttribute("aria-current") === "page";
		}
		function measureSelectedItem(container, itemSelector, ignoreEl) {
			const sel = Array.from(container.querySelectorAll(itemSelector)).find((el) => el !== ignoreEl && isSlidingCandidateSelected(el));
			if (!sel) return null;
			let width = sel.offsetWidth || 0;
			let left = sel.offsetLeft || 0;
			if (width === 0 && typeof sel.getBoundingClientRect === "function") {
				const itemRect = sel.getBoundingClientRect();
				width = Math.round(itemRect.width);
				if (typeof container.getBoundingClientRect === "function") {
					const parentRect = container.getBoundingClientRect();
					left = Math.round(itemRect.left - parentRect.left);
				}
			}
			return {
				el: sel,
				left,
				width
			};
		}
		/**
		* 为分段胶囊（.dsh-seg）或下划线标签栏（.dsh-utabs）挂载平滑滑动选中指示器：
		* - 自动识别 aria-selected="true" / aria-pressed="true" / aria-current="page"；
		* - 首次挂载、零宽恢复、子项增删及尺寸变化瞬时对齐（同步 offsetWidth 刷帧消除飞入残影），状态切换平滑过渡。
		*/
		function mountSlidingIndicator(container, options) {
			if (!container || !container.ownerDocument) return {
				sync() {},
				destroy() {}
			};
			const doc = container.ownerDocument;
			const win = doc.defaultView;
			const itemSelector = options?.itemSelector ?? DEFAULT_SLIDING_ITEM_SELECTOR;
			const indicatorClass = options?.indicatorClass ?? (hasClass(container, "dsh-utabs") ? "dsh-utabs-ind" : "dsh-seg-ind");
			let ind = getDirectChildren(container).find((c) => hasClass(c, indicatorClass)) ?? null;
			const createdInd = ind === null;
			if (!ind) {
				ind = doc.createElement("span");
				ind.className = indicatorClass;
				ind.setAttribute("aria-hidden", "true");
				prependChild(container, ind);
			}
			const indicatorEl = ind;
			container.setAttribute("data-ind", "");
			const expandTransition = "transform var(--dsh-dur-expand, 220ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1)), width var(--dsh-dur-expand, 220ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1))";
			let disposed = false;
			let hasPlaced = false;
			let rafId = 0;
			const raf = typeof win?.requestAnimationFrame === "function" ? win.requestAnimationFrame.bind(win) : null;
			const cancelRaf = typeof win?.cancelAnimationFrame === "function" ? win.cancelAnimationFrame.bind(win) : null;
			const place = (instant = false) => {
				if (disposed) return;
				const measured = measureSelectedItem(container, itemSelector, indicatorEl);
				if (!measured) {
					indicatorEl.style.opacity = "0";
					return;
				}
				if (measured.width <= 0) {
					hasPlaced = false;
					indicatorEl.style.opacity = "0";
					return;
				}
				const useInstant = Boolean(instant) || !hasPlaced;
				hasPlaced = true;
				if (useInstant) {
					indicatorEl.setAttribute("data-instant", "");
					indicatorEl.style.transition = "none";
				} else {
					indicatorEl.removeAttribute("data-instant");
					indicatorEl.style.transition = expandTransition;
				}
				indicatorEl.style.opacity = "";
				indicatorEl.style.setProperty("--ind-x", `${measured.left}px`);
				indicatorEl.style.setProperty("--ind-w", `${measured.width}px`);
				indicatorEl.style.width = `${measured.width}px`;
				indicatorEl.style.transform = `translateX(${measured.left}px)`;
				if (useInstant) {
					indicatorEl.offsetWidth;
					indicatorEl.removeAttribute("data-instant");
				}
			};
			const ResizeCtor = win?.ResizeObserver ?? globalThis.ResizeObserver;
			const observedItems = /* @__PURE__ */ new Set();
			const ro = ResizeCtor ? new ResizeCtor(() => {
				place(true);
			}) : null;
			const syncObservedItems = () => {
				if (!ro || disposed) return;
				const nextItems = new Set(Array.from(container.querySelectorAll(itemSelector)).filter((el) => el !== indicatorEl));
				for (const prev of observedItems) if (!nextItems.has(prev)) {
					ro.unobserve?.(prev);
					observedItems.delete(prev);
				}
				for (const item of nextItems) if (!observedItems.has(item)) {
					ro.observe(item);
					observedItems.add(item);
				}
			};
			ro?.observe(container);
			syncObservedItems();
			const MutationCtor = win?.MutationObserver ?? globalThis.MutationObserver;
			const mo = MutationCtor ? new MutationCtor((records) => {
				if (!Array.isArray(records)) {
					place(false);
					return;
				}
				const hasChildList = records.some((r) => r?.type === "childList");
				const hasDirectChildList = records.some((r) => r?.type === "childList" && r.target === container);
				const hasAttr = records.some((r) => r?.type === "attributes");
				if (hasChildList) syncObservedItems();
				if (hasAttr && !hasDirectChildList) place(false);
				else if (hasChildList) place(true);
				else place(false);
			}) : null;
			mo?.observe(container, {
				attributes: true,
				attributeFilter: [
					"aria-selected",
					"aria-pressed",
					"aria-current"
				],
				childList: true,
				subtree: true
			});
			place(true);
			if (!hasPlaced && raf) rafId = raf(() => {
				rafId = 0;
				if (!disposed && !hasPlaced) place(true);
			});
			const fonts = doc.fonts;
			if (fonts?.ready) fonts.ready.then(() => {
				if (!disposed) place(true);
			});
			return {
				sync: (instant = false) => place(Boolean(instant)),
				destroy() {
					if (disposed) return;
					disposed = true;
					if (rafId && cancelRaf) {
						cancelRaf(rafId);
						rafId = 0;
					}
					mo?.disconnect();
					ro?.disconnect();
					observedItems.clear();
					if (createdInd) indicatorEl.remove();
					container.removeAttribute("data-ind");
				}
			};
		}
		const SCROLL_LOCK_KEYS = /* @__PURE__ */ new Set([
			"ArrowDown",
			"ArrowUp",
			"Home",
			"End",
			"PageDown",
			"PageUp",
			"Tab"
		]);
		const DEFAULT_GLIDE_ITEM_SELECTOR = "[data-glide-row], .dsh-glide-item, [role=\"menuitem\"], [role=\"menuitemradio\"], [role=\"menuitemcheckbox\"], [role=\"option\"]";
		function isAutoScrollableViewport(el, win) {
			if (!el) return false;
			if (hasClass(el, "dsh-scroll-area") || hasClass(el, "hs-msurf-scroll-body") || hasClass(el, "dsh-glide-scroll")) return true;
			const cs = win?.getComputedStyle?.(el);
			if (cs && /^(?:auto|scroll|overlay)$/i.test(cs.overflowY || "")) return true;
			return false;
		}
		/**
		* 悬停滑块（Glide Hover）原语：
		* - 普通指针移入时以 220ms cubic-bezier(0.23, 1, 0.32, 1) 驱动单个 GPU 合成层滑块平滑跟随，自动继承目标行圆角与角形；
		* - 跨过分组标题或行隙时停驻在原位，进入新行再滑过去；
		* - 可滚动容器在内容顶部挂载零高锚点 .dsh-glide-pin（随内容滚动，自动抵消容器 paddingTop 与 flex rowGap）：
		*   滚动期间滑块贴着原激活行随内容一起走，不改激活行；滚动后忽略浏览器补发的悬停事件，指针真实移动才重新对准；
		*   原激活行已滚出视口时，新行处直接淡入而不从视口外滑入。
		*/
		function mountGlideHover(container, options) {
			if (!container || typeof container.addEventListener !== "function") return {
				setActiveItem() {},
				sync() {},
				hide() {},
				isHolding: () => false,
				destroy() {}
			};
			const activeDoc = options?.doc ?? container.ownerDocument;
			const activeWin = options?.win ?? activeDoc?.defaultView ?? null;
			const itemSelector = options?.itemSelector ?? DEFAULT_GLIDE_ITEM_SELECTOR;
			const setTimer = typeof activeWin?.setTimeout === "function" ? activeWin.setTimeout.bind(activeWin) : globalThis.setTimeout;
			const clearTimer = typeof activeWin?.clearTimeout === "function" ? activeWin.clearTimeout.bind(activeWin) : globalThis.clearTimeout;
			let scrollEl = null;
			if (options?.scrollContainer === false) scrollEl = null;
			else if (options?.scrollContainer) scrollEl = options.scrollContainer;
			else if (isAutoScrollableViewport(container, activeWin)) scrollEl = container;
			else if (isAutoScrollableViewport(container.parentElement, activeWin)) scrollEl = container.parentElement;
			else if (typeof container.querySelector === "function") {
				const inner = container.querySelector(".dsh-scroll-area, .hs-msurf-scroll-body");
				if (inner && isAutoScrollableViewport(inner, activeWin)) {
					if (Array.from(container.querySelectorAll(itemSelector)).every((it) => inner.contains(it))) scrollEl = inner;
				}
			}
			container.setAttribute("data-dsh-glide", "");
			if (scrollEl === container) container.setAttribute("data-dsh-glide-scroller", "");
			else container.removeAttribute("data-dsh-glide-scroller");
			let pinEl = null;
			let createdPin = false;
			let hlEl = null;
			let createdHl = false;
			let anchorEl = container;
			if (scrollEl && activeDoc) {
				const staleDirectHl = getDirectChildren(container).find((c) => hasClass(c, "dsh-glide-hl"));
				if (staleDirectHl && scrollEl !== container) staleDirectHl.remove();
				pinEl = getDirectChildren(scrollEl).find((c) => hasClass(c, "dsh-glide-pin")) ?? null;
				if (!pinEl) {
					pinEl = activeDoc.createElement("div");
					pinEl.className = "dsh-glide-pin";
					pinEl.setAttribute("aria-hidden", "true");
					prependChild(scrollEl, pinEl);
					createdPin = true;
				}
				const scs = activeWin?.getComputedStyle?.(scrollEl);
				if (scs) {
					const padTop = Number.parseFloat(scs.paddingTop || "0") || 0;
					const rowGap = Number.parseFloat(scs.rowGap || scs.gap || "0") || 0;
					if (padTop !== 0) pinEl.style.marginTop = `${-padTop}px`;
					if (padTop - rowGap !== 0) pinEl.style.marginBottom = `${padTop - rowGap}px`;
				}
				hlEl = getDirectChildren(pinEl).find((c) => hasClass(c, "dsh-glide-hl")) ?? null;
				if (!hlEl) {
					hlEl = activeDoc.createElement("span");
					hlEl.className = "dsh-glide-hl";
					hlEl.setAttribute("aria-hidden", "true");
					pinEl.appendChild(hlEl);
					createdHl = true;
				}
				anchorEl = pinEl;
			} else if (activeDoc) {
				hlEl = getDirectChildren(container).find((c) => hasClass(c, "dsh-glide-hl")) ?? null;
				if (!hlEl) {
					hlEl = activeDoc.createElement("span");
					hlEl.className = "dsh-glide-hl";
					hlEl.setAttribute("aria-hidden", "true");
					prependChild(container, hlEl);
					createdHl = true;
				}
				anchorEl = container;
			}
			if (!hlEl) return {
				setActiveItem() {},
				sync() {},
				hide() {},
				isHolding: () => false,
				destroy() {}
			};
			const hl = hlEl;
			let disposed = false;
			let has = false;
			let hasEverPlaced = false;
			let activeRow = null;
			let fadeResetTimer = 0;
			let lastX = null;
			let lastY = null;
			let lastLeft = NaN;
			let lastTop = NaN;
			let lastWidth = NaN;
			let lastHeight = NaN;
			let lastRadiusStyleKey = "";
			let cachedBorderRadius = "";
			let cachedCornerShape = "";
			let lastAppliedRadius = "";
			let lastAppliedCornerShape = "";
			let lastIsDanger = null;
			let hadInstant = false;
			let sawPointerMove = false;
			let scrolledSincePointer = false;
			let pendingScrollRetarget = false;
			const isEnabled = (el) => {
				if (el.disabled || el.getAttribute("aria-disabled") === "true" || el.hidden || el.getAttribute("aria-hidden") === "true" || el.hasAttribute("data-stale")) return false;
				if (typeof el.closest === "function" && el.closest("[hidden]")) return false;
				return options?.isItemEnabled ? options.isItemEnabled(el) : true;
			};
			const updateCoords = (x, y) => {
				if (typeof x === "number" && typeof y === "number" && Number.isFinite(x) && Number.isFinite(y)) {
					lastX = x;
					lastY = y;
				}
			};
			const setActiveAttr = (row) => {
				if (activeRow === row) return;
				if (activeRow) activeRow.removeAttribute("data-glide-active");
				activeRow = row;
				if (activeRow) activeRow.setAttribute("data-glide-active", "");
			};
			const clearFadeReset = () => {
				if (fadeResetTimer) {
					clearTimer(fadeResetTimer);
					fadeResetTimer = 0;
				}
			};
			const zeroHighlightBox = () => {
				hl.style.transition = "none";
				hl.style.opacity = "0";
				hl.style.transform = "translate3d(0px, 0px, 0)";
				hl.style.width = "0px";
				hl.style.height = "0px";
				hl.offsetWidth;
				hl.style.transition = "";
				has = false;
				hasEverPlaced = false;
				lastLeft = NaN;
				lastTop = NaN;
				lastWidth = NaN;
				lastHeight = NaN;
				lastRadiusStyleKey = "";
				lastAppliedRadius = "";
				lastAppliedCornerShape = "";
				hadInstant = false;
			};
			const syncRowTone = (row) => {
				const isDanger = Boolean(row) && (hasClass(row, "hs-fb-danger") || hasClass(row, "is-danger") || row.getAttribute("data-danger") === "true" || row.getAttribute("data-variant") === "danger" || row.getAttribute("data-tone") === "danger");
				if (isDanger === lastIsDanger) return;
				lastIsDanger = isDanger;
				if (isDanger) hl.setAttribute("data-glide-tone", "danger");
				else hl.removeAttribute("data-glide-tone");
			};
			const applyRow = (row, opts) => {
				if (disposed || !row || !container.contains(row) || !isEnabled(row)) return false;
				clearFadeReset();
				let left = 0;
				let top = 0;
				let width = 0;
				let height = 0;
				if (anchorEl === container && row.offsetParent === container && row.offsetWidth > 0) {
					left = row.offsetLeft;
					top = row.offsetTop;
					width = row.offsetWidth;
					height = row.offsetHeight;
				} else {
					const a = typeof anchorEl.getBoundingClientRect === "function" ? anchorEl.getBoundingClientRect() : null;
					const r = typeof row.getBoundingClientRect === "function" ? row.getBoundingClientRect() : null;
					if (a && r) {
						const rawSx = row.offsetWidth > 0 ? r.width / row.offsetWidth : 1;
						const rawSy = row.offsetHeight > 0 ? r.height / row.offsetHeight : 1;
						const validScale = rawSx > .5 && rawSx < 2 && rawSy > .5 && rawSy < 2 && Math.abs(rawSx - rawSy) < .05;
						const sx = validScale ? rawSx : 1;
						const sy = validScale ? rawSy : 1;
						left = (r.left - a.left) / sx;
						top = (r.top - a.top) / sy;
						width = r.width / sx;
						height = r.height / sy;
					} else {
						left = row.offsetLeft || 0;
						top = row.offsetTop || 0;
						width = row.offsetWidth || 0;
						height = row.offsetHeight || 0;
					}
				}
				if (width <= 0 && height <= 0) {
					setActiveAttr(row);
					return false;
				}
				const snapFull = Boolean(opts?.snap);
				const snapPosFadeIn = !snapFull && !hasEverPlaced;
				const styleKey = `${row.tagName}|${typeof row.className === "string" ? row.className : ""}`;
				if ((row !== activeRow || !has) && styleKey !== lastRadiusStyleKey) {
					const rc = activeWin?.getComputedStyle?.(row);
					if (rc) {
						cachedBorderRadius = rc.borderRadius || "";
						cachedCornerShape = typeof rc.getPropertyValue === "function" ? rc.getPropertyValue("corner-shape") : "";
						lastRadiusStyleKey = styleKey;
					}
				}
				syncRowTone(row);
				if (row !== activeRow || !has) {
					if (cachedBorderRadius && cachedBorderRadius !== lastAppliedRadius) {
						hl.style.borderRadius = cachedBorderRadius;
						lastAppliedRadius = cachedBorderRadius;
					}
					if (cachedCornerShape && cachedCornerShape !== lastAppliedCornerShape) {
						hl.style.setProperty("corner-shape", cachedCornerShape);
						lastAppliedCornerShape = cachedCornerShape;
					}
				}
				const sameBox = has && !snapFull && !snapPosFadeIn && Math.abs(left - lastLeft) < .25 && Math.abs(top - lastTop) < .25 && Math.abs(width - lastWidth) < .25 && Math.abs(height - lastHeight) < .25;
				if (snapFull) {
					hl.setAttribute("data-instant", "");
					hl.style.transition = "none";
					addClass(hl, "is-filter-snap");
					hadInstant = true;
				} else if (snapPosFadeIn) {
					hl.setAttribute("data-instant", "");
					hl.style.transition = "";
					hadInstant = true;
				} else if (!sameBox && hadInstant) {
					hl.removeAttribute("data-instant");
					removeClass(hl, "is-filter-snap");
					hl.style.transition = "";
					hadInstant = false;
				}
				if (!sameBox) {
					if (Math.abs(left - lastLeft) >= .25 || Math.abs(top - lastTop) >= .25 || !hasEverPlaced || snapFull) {
						hl.style.transform = `translate3d(${left}px, ${top}px, 0)`;
						lastLeft = left;
						lastTop = top;
					}
					if (Math.abs(width - lastWidth) >= .25 || !hasEverPlaced || snapFull) {
						hl.style.width = `${width}px`;
						lastWidth = width;
					}
					if (Math.abs(height - lastHeight) >= .25 || !hasEverPlaced || snapFull) {
						hl.style.height = `${height}px`;
						lastHeight = height;
					}
				}
				setActiveAttr(row);
				if (!has) hl.style.opacity = "1";
				has = true;
				hasEverPlaced = true;
				if (snapFull || snapPosFadeIn) {
					hl.offsetWidth;
					hl.removeAttribute("data-instant");
					removeClass(hl, "is-filter-snap");
					if (snapFull) hl.style.transition = "";
					hadInstant = false;
				}
				return true;
			};
			const hide = (opts) => {
				if (disposed) return;
				clearFadeReset();
				setActiveAttr(null);
				if (opts?.resetBox) {
					zeroHighlightBox();
					return;
				}
				if (has) {
					hl.style.opacity = "0";
					has = false;
					fadeResetTimer = setTimer(() => {
						fadeResetTimer = 0;
						if (!has && !disposed) zeroHighlightBox();
					}, 160);
				}
			};
			const sync = (opts) => {
				if (disposed) return;
				const snap = Boolean(opts?.snap);
				const fb = options?.resolveFallbackItem?.() ?? null;
				if (fb && container.contains(fb) && isEnabled(fb)) {
					applyRow(fb, { snap });
					return;
				}
				if (activeRow && container.contains(activeRow) && isEnabled(activeRow)) {
					applyRow(activeRow, { snap });
					return;
				}
				hide({ resetBox: snap });
			};
			const noteRealMove = (x, y) => {
				if (typeof x !== "number" || typeof y !== "number") return;
				if (lastX === null || lastY === null || x !== lastX || y !== lastY) scrolledSincePointer = false;
			};
			const isRowInScrollView = (row) => {
				if (!scrollEl || typeof scrollEl.getBoundingClientRect !== "function") return true;
				if (typeof row.getBoundingClientRect !== "function") return true;
				const s = scrollEl.getBoundingClientRect();
				const r = row.getBoundingClientRect();
				return s.height <= 0 || r.bottom > s.top && r.top < s.bottom;
			};
			const onDocPointerMove = (e) => {
				if (e.pointerType === "touch") return;
				noteRealMove(e.clientX, e.clientY);
				updateCoords(e.clientX, e.clientY);
			};
			const handleContainerPointer = (target) => {
				if (scrolledSincePointer) return;
				const row = findMatchingItemInMenu(container, target, itemSelector);
				if (!row || !container.contains(row) || !isEnabled(row)) return;
				if (pendingScrollRetarget) {
					pendingScrollRetarget = false;
					if (has && activeRow && row !== activeRow && !isRowInScrollView(activeRow)) zeroHighlightBox();
				}
				if (!(row !== activeRow || !has)) return;
				applyRow(row, { snap: false });
				options?.onActiveChange?.(row, { source: "pointer" });
			};
			const onContainerPointerMove = (e) => {
				if (e.pointerType === "touch") return;
				sawPointerMove = true;
				noteRealMove(e.clientX, e.clientY);
				updateCoords(e.clientX, e.clientY);
				handleContainerPointer(e.target);
			};
			const onContainerMouseMove = (e) => {
				if (sawPointerMove) return;
				if (e.clientX || e.clientY) {
					noteRealMove(e.clientX, e.clientY);
					updateCoords(e.clientX, e.clientY);
				}
				handleContainerPointer(e.target);
			};
			const onContainerMouseOver = (e) => {
				if (scrolledSincePointer) return;
				if (e.clientX || e.clientY) updateCoords(e.clientX, e.clientY);
				handleContainerPointer(e.target);
			};
			const onContainerLeave = () => {
				options?.onActiveChange?.(null, { source: "leave" });
				const fb = options?.resolveFallbackItem?.() ?? null;
				if (fb && container.contains(fb) && isEnabled(fb)) applyRow(fb, { snap: false });
				else hide();
			};
			const onFocusIn = (e) => {
				const row = findMatchingItemInMenu(container, e.target, itemSelector);
				if (!row || !container.contains(row) || !isEnabled(row)) return;
				const changed = row !== activeRow || !has;
				applyRow(row, { snap: false });
				if (changed) options?.onActiveChange?.(row, { source: "focus" });
			};
			const onFocusOut = (e) => {
				const rel = e.relatedTarget;
				if (rel && container.contains(rel)) return;
				const fb = options?.resolveFallbackItem?.() ?? null;
				if (fb && container.contains(fb) && isEnabled(fb)) applyRow(fb, { snap: false });
				else hide();
			};
			const onScroll = (e) => {
				if (disposed || container.hidden) return;
				const target = e?.target;
				const isOwnScroll = Boolean(scrollEl && target === scrollEl);
				const isOuterScroll = !isOwnScroll && Boolean(target === activeDoc || target === activeDoc?.documentElement || target === activeDoc?.body || target && typeof target.contains === "function" && target.contains(container));
				if (!isOwnScroll && !isOuterScroll) return;
				scrolledSincePointer = true;
				pendingScrollRetarget = true;
			};
			const onWheel = () => {
				scrolledSincePointer = true;
				pendingScrollRetarget = true;
			};
			const onDocKeyDown = (e) => {
				if (SCROLL_LOCK_KEYS.has(e.key)) scrolledSincePointer = true;
			};
			activeDoc?.addEventListener?.("pointermove", onDocPointerMove, {
				capture: true,
				passive: true
			});
			activeDoc?.addEventListener?.("keydown", onDocKeyDown, true);
			activeDoc?.addEventListener?.("scroll", onScroll, {
				capture: true,
				passive: true
			});
			if (scrollEl && scrollEl !== activeDoc) scrollEl.addEventListener("scroll", onScroll, { passive: true });
			const wheelTarget = scrollEl ?? container;
			wheelTarget.addEventListener("wheel", onWheel, { passive: true });
			container.addEventListener("pointermove", onContainerPointerMove, { passive: true });
			container.addEventListener("mousemove", onContainerMouseMove, { passive: true });
			container.addEventListener("mouseover", onContainerMouseOver);
			container.addEventListener("mouseleave", onContainerLeave);
			container.addEventListener("pointerleave", onContainerLeave);
			container.addEventListener("focusin", onFocusIn);
			container.addEventListener("focusout", onFocusOut);
			const initialFb = options?.resolveFallbackItem?.() ?? null;
			if (initialFb && container.contains(initialFb) && isEnabled(initialFb)) applyRow(initialFb, { snap: true });
			return {
				setActiveItem(item, opts) {
					if (disposed) return;
					if (!item) {
						hide({ resetBox: opts?.snap });
						return;
					}
					applyRow(item, { snap: opts?.snap });
				},
				sync,
				hide,
				isHolding: () => false,
				destroy() {
					if (disposed) return;
					disposed = true;
					clearFadeReset();
					setActiveAttr(null);
					activeDoc?.removeEventListener?.("pointermove", onDocPointerMove, true);
					activeDoc?.removeEventListener?.("keydown", onDocKeyDown, true);
					activeDoc?.removeEventListener?.("scroll", onScroll, true);
					if (scrollEl && scrollEl !== activeDoc) scrollEl.removeEventListener("scroll", onScroll);
					wheelTarget.removeEventListener("wheel", onWheel);
					container.removeEventListener("pointermove", onContainerPointerMove);
					container.removeEventListener("mousemove", onContainerMouseMove);
					container.removeEventListener("mouseover", onContainerMouseOver);
					container.removeEventListener("mouseleave", onContainerLeave);
					container.removeEventListener("pointerleave", onContainerLeave);
					container.removeEventListener("focusin", onFocusIn);
					container.removeEventListener("focusout", onFocusOut);
					container.removeAttribute("data-dsh-glide");
					container.removeAttribute("data-dsh-glide-scroller");
					if (createdPin && pinEl) pinEl.remove();
					else if (createdHl && hlEl) hlEl.remove();
				}
			};
		}
		//#endregion
		//#region ../packages/dsh-ui/src/motion.ts
		const DEFAULT_ITEM_SELECTOR = "[role=\"tab\"], button";
		const DEFAULT_INDICATOR_CLASS = "dsh-seg-ind";
		/**
		* 08.2 滑动选中指示块（Segmented / UnderlineTabs / Popover 分类条通用）：
		* - 注入独立 aria-hidden 指示节点并挂载 data-ind 属性接管选中底；
		* - 首次挂载、从隐藏零宽态首次恢复、动态增删子项及 ResizeObserver（含容器与各子项尺寸变化）瞬时到位；
		* - aria-selected / aria-pressed / aria-current="page" 在有效项间切换时以 --dsh-dur-expand + --dsh-ease-out 驱动 transform 与 width 平滑滑动；
		* - 返回幂等 dispose() 断开观察器并移除节点。
		*/
		function attachSlidingIndicator(container, options) {
			const handle = mountSlidingIndicator(container, {
				itemSelector: options?.itemSelector ?? DEFAULT_ITEM_SELECTOR,
				indicatorClass: options?.indicatorClass ?? DEFAULT_INDICATOR_CLASS
			});
			return () => handle.destroy();
		}
		function isIndicatorOptions(value) {
			if (typeof value !== "object" || value === null) return false;
			return "itemSelector" in value || "indicatorClass" in value;
		}
		function useSlidingIndicator(ref, depOrOptions, maybeOptions) {
			const dep = maybeOptions !== void 0 || depOrOptions !== void 0 && !isIndicatorOptions(depOrOptions) ? depOrOptions : void 0;
			const resolvedOptions = maybeOptions !== void 0 ? maybeOptions : isIndicatorOptions(depOrOptions) ? depOrOptions : void 0;
			const itemSelector = resolvedOptions?.itemSelector;
			const indicatorClass = resolvedOptions?.indicatorClass;
			const bindingRef = (0, react.useRef)({
				el: null,
				itemSelector: void 0,
				indicatorClass: void 0,
				dispose: null
			});
			(0, react.useEffect)(() => {
				const el = ref.current;
				const cur = bindingRef.current;
				if (cur.el === el && cur.itemSelector === itemSelector && cur.indicatorClass === indicatorClass) return;
				cur.dispose?.();
				if (!el) {
					bindingRef.current = {
						el: null,
						itemSelector,
						indicatorClass,
						dispose: null
					};
					return;
				}
				const dispose = attachSlidingIndicator(el, {
					itemSelector,
					indicatorClass
				});
				bindingRef.current = {
					el,
					itemSelector,
					indicatorClass,
					dispose
				};
			}, [
				ref,
				itemSelector,
				indicatorClass,
				dep
			]);
			(0, react.useEffect)(() => () => {
				bindingRef.current.dispose?.();
				bindingRef.current = {
					el: null,
					itemSelector: void 0,
					indicatorClass: void 0,
					dispose: null
				};
			}, []);
		}
		const HORIZONTAL_KEYS = /* @__PURE__ */ new Set([
			"ArrowRight",
			"ArrowLeft",
			"Home",
			"End"
		]);
		const VERTICAL_KEYS = /* @__PURE__ */ new Set([
			"ArrowDown",
			"ArrowUp",
			"Home",
			"End"
		]);
		const ALL_ROVING_KEYS = /* @__PURE__ */ new Set([
			"ArrowRight",
			"ArrowDown",
			"ArrowLeft",
			"ArrowUp",
			"Home",
			"End"
		]);
		/**
		* 08.1 Roving Tabindex 方向键漫游（← / → / ↑ / ↓ / Home / End）：
		* - 对水平 role="tablist" 默认仅拦截 ← / → / Home / End，不劫持 ↑ / ↓ 页面滚动或下拉导航；
		* - 对 role="radiogroup" 等默认保留四向漫游；
		* - 自动跳过禁用与隐藏项，同步 tabindex="0/-1"，支持 automatic（默认）与 manual 激活模式。
		*/
		function handleRovingKeyDown(event, itemSelectorOrOptions = "[role=\"tab\"], [role=\"radio\"], button") {
			if (isImeComposing(event)) return;
			const opts = typeof itemSelectorOrOptions === "string" ? { itemSelector: itemSelectorOrOptions } : itemSelectorOrOptions;
			const itemSelector = opts.itemSelector ?? "[role=\"tab\"], [role=\"radio\"], button";
			const activationMode = opts.activationMode ?? "automatic";
			const container = event.currentTarget;
			if (!container) return;
			const resolvedOrientation = opts.orientation ?? (container.getAttribute?.("role") === "tablist" ? container.getAttribute?.("aria-orientation") === "vertical" ? "vertical" : "horizontal" : "both");
			if (!(resolvedOrientation === "horizontal" ? HORIZONTAL_KEYS : resolvedOrientation === "vertical" ? VERTICAL_KEYS : ALL_ROVING_KEYS).has(event.key)) return;
			const allItems = Array.from(container.querySelectorAll(itemSelector));
			const enabledItems = allItems.filter((el) => {
				if (el.disabled) return false;
				if (el.getAttribute("aria-disabled") === "true") return false;
				if (el.hidden || el.getAttribute("aria-hidden") === "true") return false;
				if (el.style?.display === "none") return false;
				return true;
			});
			if (enabledItems.length === 0) return;
			const activeEl = container.ownerDocument?.activeElement ?? event.target;
			let currentIndex = enabledItems.findIndex((el) => el === activeEl || activeEl !== null && typeof el.contains === "function" && el.contains(activeEl));
			if (currentIndex < 0) currentIndex = enabledItems.findIndex((el) => el.getAttribute("aria-selected") === "true" || el.getAttribute("aria-checked") === "true" || el.getAttribute("tabindex") === "0");
			if (currentIndex < 0) currentIndex = 0;
			event.preventDefault();
			let nextIndex = currentIndex;
			if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (currentIndex + 1) % enabledItems.length;
			else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (currentIndex - 1 + enabledItems.length) % enabledItems.length;
			else if (event.key === "Home") nextIndex = 0;
			else if (event.key === "End") nextIndex = enabledItems.length - 1;
			const nextEl = enabledItems[nextIndex];
			if (!nextEl) return;
			for (const item of allItems) item.setAttribute("tabindex", item === nextEl ? "0" : "-1");
			nextEl.focus?.();
			if (activationMode === "automatic") nextEl.click?.();
		}
		/**
		* 判断列表项上的 pointermove 是否来自真实指针移动（排除键盘滚动列表时静止鼠标伪触发）：
		*/
		function didPointerActuallyMove(lastPosRef, event) {
			if (event.pointerType === "touch") return false;
			const x = typeof event.clientX === "number" ? event.clientX : 0;
			const y = typeof event.clientY === "number" ? event.clientY : 0;
			const prev = lastPosRef.current;
			if (prev !== null && prev.x === x && prev.y === y) return false;
			lastPosRef.current = {
				x,
				y
			};
			return true;
		}
		/**
		* React Hook 封装：为列表/菜单容器绑定悬停滑块（Glide Hover，滚动时随内容走，不跟指针），
		* 返回命令式句柄 ref 以便外部在受控高亮切换或过滤重排时调用 setActiveItem / sync。
		*/
		function useGlideHover(ref, enabled, options) {
			const handleRef = (0, react.useRef)(null);
			const optionsRef = (0, react.useRef)(options);
			optionsRef.current = options;
			const itemSelector = options?.itemSelector;
			const scrollContainer = options?.scrollContainer;
			(0, react.useEffect)(() => {
				if (!enabled) {
					handleRef.current?.destroy();
					handleRef.current = null;
					return;
				}
				const el = ref.current;
				if (!el) return void 0;
				const handle = mountGlideHover(el, {
					itemSelector,
					scrollContainer,
					isItemEnabled: (item) => optionsRef.current?.isItemEnabled ? optionsRef.current.isItemEnabled(item) : true,
					resolveFallbackItem: () => optionsRef.current?.resolveFallbackItem ? optionsRef.current.resolveFallbackItem() : null,
					onActiveChange: (item, meta) => {
						optionsRef.current?.onActiveChange?.(item, meta);
					}
				});
				handleRef.current = handle;
				return () => {
					handle.destroy();
					if (handleRef.current === handle) handleRef.current = null;
				};
			}, [
				ref,
				enabled,
				itemSelector,
				scrollContainer
			]);
			return handleRef;
		}
		const glideHoverCss = `
:where(.dsh-glide, [data-dsh-glide]) {
  --dsh-glide-bg: var(--dsh-subtle-fill);
}
.dsh-glide,
[data-dsh-glide]:not([data-dsh-glide-scroller]) {
  position: relative;
  overflow: clip;
  z-index: 1;
}
[data-dsh-glide][data-dsh-glide-scroller] {
  position: relative;
}
.dsh-glide {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
}
.dsh-glide-pin {
  position: relative;
  width: 0;
  height: 0;
  overflow: visible;
  pointer-events: none;
  z-index: 0;
  flex: none;
}
.dsh-glide-hl {
  box-sizing: border-box;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 0;
  opacity: 0;
  border-radius: var(--dsw-radius-sm, 8px);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  background-color: var(--dsh-glide-bg, var(--dsh-subtle-fill));
  pointer-events: none;
  will-change: transform;
  transition:
    transform var(--dsh-dur-expand, 220ms) cubic-bezier(0.23, 1, 0.32, 1),
    width var(--dsh-dur-expand, 220ms) cubic-bezier(0.23, 1, 0.32, 1),
    height var(--dsh-dur-expand, 220ms) cubic-bezier(0.23, 1, 0.32, 1),
    background-color var(--dsh-dur-pop, 150ms) ease,
    opacity var(--dsh-dur-pop, 150ms) ease;
}
.dsh-glide-hl[data-glide-tone="danger"] {
  background-color: var(--dsw-alias-interactive-bg-hover-danger);
}
.dsh-glide-pin > .dsh-glide-hl,
[data-dsh-glide] .dsh-glide-hl {
  right: auto;
}
.dsh-glide-hl[data-instant],
.dsh-glide-hl.is-filter-snap {
  transition:
    background-color var(--dsh-dur-pop, 150ms) ease,
    opacity var(--dsh-dur-pop, 150ms) ease;
}
.dsh-glide-item {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 5px 8px;
  border-radius: var(--dsw-radius-sm, 8px);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  font-size: 12.5px;
  line-height: 18px;
  color: var(--dsw-alias-label-secondary);
  text-decoration: none;
  transition: color var(--dsh-dur-pop, 150ms) ease;
  outline: none;
}
.dsh-glide-item[data-glide-active],
.dsh-glide-item:focus-visible {
  color: var(--dsw-alias-label-primary);
}
.dsh-glide-item:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: -2px;
}
.dsh-glide-gtitle {
  padding: 10px 8px 4px;
  font-size: var(--dsh-text-xs, 11px);
  color: var(--dsw-alias-label-tertiary);
}
.dsh-glide-gtitle:first-of-type {
  padding-top: 2px;
}
@media (prefers-reduced-motion: reduce) {
  .dsh-glide-hl {
    transition:
      background-color var(--dsh-dur-pop, 150ms) ease,
      opacity var(--dsh-dur-pop, 150ms) ease;
  }
}
html[data-dsh-reduce-motion] .dsh-glide-hl {
  transition:
    background-color var(--dsh-dur-pop, 150ms) ease,
    opacity var(--dsh-dur-pop, 150ms) ease;
}
@media (forced-colors: active) {
  .dsh-glide-hl {
    background-color: transparent;
    border: 1px solid Highlight;
  }
}
`;
		//#endregion
		//#region ../packages/dsh-ui/src/choices.tsx
		function mergeRefs$2(...refs) {
			return (node) => {
				for (const ref of refs) {
					if (!ref) continue;
					if (typeof ref === "function") ref(node);
					else ref.current = node;
				}
			};
		}
		/**
		* 04-B 独立布尔开关（36x20 全圆弧胶囊 + 16px 正圆滑块 · 按压 20px 微伸展）：
		* 关态滑块采用官方 --dsw-alias-switch-thumb 防止深色模式发黑，开态轨道切为 --dsh-brand-fill 并翻转反色滑块。
		*/
		const StandaloneSwitch = (0, react.forwardRef)(function StandaloneSwitch({ checked, onChange, label, disabled = false, className, onClick, ...rest }, ref) {
			const handleClick = (event) => {
				event.stopPropagation?.();
				onClick?.(event);
				if (event.defaultPrevented || disabled) return;
				onChange(!checked);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				ref,
				type: "button",
				role: "switch",
				"aria-checked": checked,
				"aria-label": label ?? rest["aria-label"],
				disabled,
				className: `hs-fb-switch${className ? ` ${className}` : ""}`,
				onClick: handleClick,
				...rest,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "hs-fb-thumb",
					"aria-hidden": "true"
				})
			});
		});
		const INTERACTIVE_LABEL_TAGS = /* @__PURE__ */ new Set([
			"BUTTON",
			"A",
			"INPUT",
			"SELECT",
			"TEXTAREA"
		]);
		function isInteractiveLabelTarget(target, boundary) {
			let cur = target;
			while (cur && typeof cur === "object" && cur !== boundary) {
				if (typeof cur.tagName === "string" && INTERACTIVE_LABEL_TAGS.has(cur.tagName.toUpperCase())) return true;
				cur = cur.parentElement ?? null;
			}
			return false;
		}
		(0, react.forwardRef)(function Checkbox({ checked, onChange, label, disabled = false, className, wrapperClassName, onClick, onKeyDown, ...rest }, ref) {
			const labelId = `dsh-chk-lbl-${(0, react.useId)().replaceAll(":", "")}`;
			const btnRef = (0, react.useRef)(null);
			const nextValue = checked !== true;
			const trigger = () => {
				if (disabled) return;
				onChange?.(nextValue);
			};
			const handleKeyDown = (event) => {
				onKeyDown?.(event);
				if (event.defaultPrevented || isImeComposing(event)) return;
				if (event.key === "Enter") event.preventDefault();
			};
			const buttonNode = /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				...rest,
				ref: mergeRefs$2(btnRef, ref),
				type: "button",
				role: "checkbox",
				"aria-checked": checked === "mixed" ? "mixed" : checked,
				"aria-labelledby": rest["aria-labelledby"] ?? (label !== void 0 ? labelId : void 0),
				disabled,
				className: `dsh-checkbox${className ? ` ${className}` : ""}`,
				onKeyDown: handleKeyDown,
				onClick: (event) => {
					event.stopPropagation?.();
					onClick?.(event);
					if (event.defaultPrevented || disabled) return;
					trigger();
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(CheckIcon, {
					size: 11,
					inline: false,
					className: "dsh-chk-tick"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
					viewBox: "0 0 16 16",
					width: 11,
					height: 11,
					fill: "none",
					stroke: "currentColor",
					strokeWidth: 2,
					strokeLinecap: "round",
					focusable: "false",
					"aria-hidden": "true",
					className: "dsh-icon dsh-chk-dash",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M3.5 8h9" })
				})]
			});
			if (label === void 0) return buttonNode;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: `dsh-check-label${disabled ? " is-disabled" : ""}${wrapperClassName ? ` ${wrapperClassName}` : ""}`,
				onClick: (event) => {
					if (disabled) return;
					if (isInteractiveLabelTarget(event.target, event.currentTarget)) return;
					event.stopPropagation?.();
					btnRef.current?.focus?.();
					if (onClick) {
						btnRef.current?.click?.();
						if (!btnRef.current) trigger();
					} else trigger();
				},
				children: [buttonNode, /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					id: labelId,
					children: label
				})]
			});
		});
		(0, react.forwardRef)(function Radio({ checked, onSelect, label, disabled = false, className, wrapperClassName, tabIndex, onClick, ...rest }, ref) {
			const labelId = `dsh-rad-lbl-${(0, react.useId)().replaceAll(":", "")}`;
			const btnRef = (0, react.useRef)(null);
			const trigger = () => {
				if (disabled) return;
				onSelect?.();
			};
			const buttonNode = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				...rest,
				ref: mergeRefs$2(btnRef, ref),
				type: "button",
				role: "radio",
				"aria-checked": checked,
				"aria-labelledby": rest["aria-labelledby"] ?? (label !== void 0 ? labelId : void 0),
				disabled,
				tabIndex,
				className: `dsh-radio${className ? ` ${className}` : ""}`,
				onClick: (event) => {
					event.stopPropagation?.();
					onClick?.(event);
					if (event.defaultPrevented || disabled) return;
					trigger();
				}
			});
			if (label === void 0) return buttonNode;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: `dsh-check-label${disabled ? " is-disabled" : ""}${wrapperClassName ? ` ${wrapperClassName}` : ""}`,
				onClick: (event) => {
					if (disabled) return;
					if (isInteractiveLabelTarget(event.target, event.currentTarget)) return;
					event.stopPropagation?.();
					btnRef.current?.focus?.();
					if (onClick) {
						btnRef.current?.click?.();
						if (!btnRef.current) trigger();
					} else trigger();
				},
				children: [buttonNode, /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					id: labelId,
					children: label
				})]
			});
		});
		(0, react.forwardRef)(function RadioCard({ checked, title, description, preview, onSelect, disabled = false, className, onClick, children, ...rest }, ref) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				ref,
				type: "button",
				role: "radio",
				"aria-checked": checked,
				disabled,
				className: `dsh-rcard${className ? ` ${className}` : ""}`,
				onClick: (event) => {
					onClick?.(event);
					if (event.defaultPrevented || disabled) return;
					onSelect?.();
				},
				...rest,
				children: [
					preview !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-rcard-fig",
						children: preview
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dsh-rcard-head",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: title }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dsh-rcard-mark",
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CheckIcon, {
								size: 10,
								inline: false
							})
						})]
					}),
					description !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-rcard-sub",
						children: description
					}),
					children
				]
			});
		});
		(0, react.forwardRef)(function Slider({ id, value, min = 0, max = 100, step = 1, onChange, label, formatValue, showValue = label !== void 0 || formatValue !== void 0, wrapperClassName, className, style, ...rest }, ref) {
			const autoId = (0, react.useId)();
			const resolvedId = id ?? (label !== void 0 ? `dsh-slider-${autoId.replaceAll(":", "")}` : void 0);
			const span = max - min;
			const pct = span > 0 ? (Math.min(max, Math.max(min, value)) - min) / span * 100 : 0;
			const rangeStyle = {
				...style,
				"--pct": `${pct.toFixed(1)}%`
			};
			const displayVal = formatValue ? formatValue(value) : String(value);
			const autoValueText = rest["aria-valuetext"] ?? (formatValue && (typeof displayVal === "string" || typeof displayVal === "number") ? String(displayVal) : void 0);
			const inputEl = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
				ref,
				id: resolvedId,
				type: "range",
				min,
				max,
				step,
				value,
				"aria-label": typeof label === "string" && !rest["aria-label"] ? label : rest["aria-label"],
				"aria-valuetext": autoValueText,
				style: rangeStyle,
				className: `dsh-range${className ? ` ${className}` : ""}`,
				onChange: (event) => onChange(Number(event.target.value)),
				...rest
			});
			if (label === void 0 && !showValue) return inputEl;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: `dsh-slider-row${wrapperClassName ? ` ${wrapperClassName}` : ""}`,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dsh-slider-head",
					children: [label !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
						htmlFor: resolvedId,
						children: label
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {}), showValue && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dsh-slider-val",
						children: displayVal
					})]
				}), inputEl]
			});
		});
		const choicesCss = `
.hs-fb-switch {
  box-sizing: border-box;
  position: relative;
  width: 36px;
  height: 20px;
  padding: 1px;
  border: 1px solid transparent;
  background-clip: padding-box;
  border-radius: 999px;
  corner-shape: round;
  background-color: var(--dsw-alias-border-l3);
  cursor: pointer;
  flex: none;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background-color var(--dsh-dur-hover, 120ms) ease, border-color var(--dsh-dur-hover, 120ms) ease;
}
.hs-fb-switch::after {
  content: "";
  position: absolute;
  inset: -4px 0;
  border-radius: 999px;
  corner-shape: round;
}
@media (pointer: coarse) {
  .hs-fb-switch::after {
    inset: -8px -4px;
  }
}
.hs-fb-switch[aria-checked="true"] {
  background-color: var(--dsh-switch-active-bg, var(--dsh-brand-fill, var(--dsw-alias-brand-primary)));
}
.hs-fb-switch:disabled { opacity: .45; cursor: not-allowed; }
.hs-fb-switch:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: 2px;
}
.hs-fb-thumb {
  display: block;
  width: var(--dsh-indicator, 16px);
  height: var(--dsh-indicator, 16px);
  border-radius: 50%;
  corner-shape: round;
  background: var(--dsw-alias-switch-thumb);
  box-shadow: 0 1px 2px rgb(0 0 0 / .14);
  transition:
    transform var(--dsh-dur-release, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1)),
    width var(--dsh-dur-press, 60ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1)),
    background-color var(--dsh-dur-hover, 120ms) ease,
    box-shadow var(--dsh-dur-hover, 120ms) ease;
}
.hs-fb-switch:active:not(:disabled) .hs-fb-thumb {
  width: 20px;
}
.hs-fb-switch[aria-checked="true"] .hs-fb-thumb {
  background: var(--dsh-accent-on-color, var(--dsw-alias-label-primary-foreground));
  box-shadow: var(--dsh-switch-active-thumb-shadow, 0 1px 2px rgb(0 0 0 / .22));
  transform: translateX(16px);
}
.hs-fb-switch[aria-checked="true"]:active:not(:disabled) .hs-fb-thumb {
  transform: translateX(12px);
}

.dsh-radio-group {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
}
.dsh-check-label {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: var(--dsh-text-md, 13px);
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  user-select: none;
}
.dsh-check-label.is-disabled { opacity: .42; cursor: not-allowed; }
.dsh-check-label:not(.is-disabled):active .dsh-checkbox,
.dsh-check-label:not(.is-disabled):active .dsh-radio,
.dsh-checkbox:active:not(:disabled),
.dsh-radio:active:not(:disabled) {
  transform: scale(.94);
}
.dsh-checkbox,
.dsh-radio {
  all: unset;
  position: relative;
  box-sizing: border-box;
  width: var(--dsh-indicator, 16px);
  height: var(--dsh-indicator, 16px);
  flex: none;
  display: inline-grid;
  place-items: center;
  border: 1.25px solid var(--dsh-control-border);
  background: var(--dsw-alias-bg-base);
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background-color var(--dsh-dur-hover, 120ms) ease, border-color var(--dsh-dur-hover, 120ms) ease, border-width var(--dsh-dur-hover, 120ms) ease, color var(--dsh-dur-hover, 120ms) ease, transform var(--dsh-dur-release, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-checkbox:disabled,
.dsh-radio:disabled { opacity: .42; cursor: not-allowed; }
.dsh-checkbox:focus-visible,
.dsh-radio:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: 2px;
}
.dsh-checkbox::after,
.dsh-radio::after {
  content: "";
  position: absolute;
  inset: -4px;
}
@media (pointer: coarse) {
  .dsh-checkbox::after,
  .dsh-radio::after {
    inset: -6px;
  }
}
.dsh-checkbox {
  border-radius: 5px;
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
}
.dsh-checkbox::after {
  border-radius: 8px;
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
}
.dsh-radio,
.dsh-radio::after {
  border-radius: 50%;
  corner-shape: round;
}
@media (hover: hover) {
  .dsh-check-label:not(.is-disabled):hover .dsh-checkbox:not([aria-checked="true"]):not([aria-checked="mixed"]),
  .dsh-check-label:not(.is-disabled):hover .dsh-radio:not([aria-checked="true"]),
  .dsh-checkbox:not(:disabled):not([aria-checked="true"]):not([aria-checked="mixed"]):hover,
  .dsh-radio:not(:disabled):not([aria-checked="true"]):hover {
    border-color: var(--dsw-alias-label-secondary);
  }
}
.dsh-checkbox svg {
  opacity: 0;
  transform: scale(.65);
  transition: opacity var(--dsh-dur-hover, 120ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1)), transform var(--dsh-dur-pop, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-checkbox .dsh-chk-dash { display: none; }
.dsh-checkbox:is([aria-checked="true"], [aria-checked="mixed"]) {
  background: var(--dsh-accent-fill, var(--dsh-brand-fill, var(--dsw-alias-brand-primary)));
  border-color: var(--dsh-accent-fill, var(--dsh-brand-fill, var(--dsw-alias-brand-primary)));
  color: var(--dsh-accent-on-color, var(--dsw-alias-label-primary-foreground));
}
.dsh-checkbox:is([aria-checked="true"], [aria-checked="mixed"]) svg {
  opacity: 1;
  transform: scale(1);
}
.dsh-checkbox[aria-checked="mixed"] .dsh-chk-tick { display: none; }
.dsh-checkbox[aria-checked="mixed"] .dsh-chk-dash { display: inline; }
.dsh-radio[aria-checked="true"] {
  border: 5px solid var(--dsh-accent-border, var(--dsh-brand-fill, var(--dsw-alias-brand-primary)));
  background: var(--dsh-accent-on-color, var(--dsw-alias-label-primary-foreground));
}

.dsh-rcard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.dsh-rcard {
  all: unset;
  --dsh-r-outer: var(--dsw-radius-lg, 16px);
  --dsh-pad: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: var(--dsh-pad) var(--dsh-pad) 10px;
  border-radius: var(--dsh-r-outer);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  border: .5px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: border-color var(--dsh-dur-hover, 120ms) ease, box-shadow var(--dsh-dur-hover, 120ms) ease;
}
.dsh-rcard:disabled { opacity: .45; cursor: not-allowed; }
.dsh-rcard:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: 2px;
}
@media (hover: hover) {
  .dsh-rcard:hover:not(:disabled) { border-color: var(--dsw-alias-border-l4); }
}
.dsh-rcard[aria-checked="true"] {
  border-color: var(--dsh-accent-border, var(--dsh-brand-fill, var(--dsw-alias-brand-primary)));
  box-shadow: 0 0 0 1px var(--dsh-accent-border, var(--dsh-brand-fill, var(--dsw-alias-brand-primary))) inset;
}
.dsh-rcard-fig {
  position: relative;
  height: 50px;
  border-radius: max(0px, calc(var(--dsh-r-outer) - var(--dsh-pad)));
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  background:
    linear-gradient(var(--dsw-alias-label-caption), var(--dsw-alias-label-caption)) 10px 10px / 44% 3.5px no-repeat,
    linear-gradient(var(--dsw-alias-label-caption), var(--dsw-alias-label-caption)) 10px 19px / 68% 3.5px no-repeat,
    var(--dsw-alias-bg-module-platform);
}
.dsh-rcard-fig-bar {
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 7px;
  height: 15px;
  border-radius: 999px;
  corner-shape: round;
  border: .5px solid var(--dsw-alias-border-l3);
  background: var(--dsw-alias-bg-base);
}
.dsh-rcard-fig.is-glass .dsh-rcard-fig-bar {
  background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, var(--dsw-alias-bg-base));
  border-color: color-mix(in srgb, var(--dsw-alias-state-business-primary) 35%, transparent);
}
.dsh-rcard-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  font-size: var(--dsh-text-sm, 12px);
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
}
.dsh-rcard-mark {
  box-sizing: border-box;
  width: var(--dsh-indicator, 16px);
  height: var(--dsh-indicator, 16px);
  border-radius: 50%;
  corner-shape: round;
  border: 1.25px solid var(--dsh-control-border);
  display: grid;
  place-items: center;
  color: transparent;
  font-size: var(--dsh-text-2xs, 10px);
  flex: none;
  transition: background var(--dsh-dur-hover, 120ms) ease, border-color var(--dsh-dur-hover, 120ms) ease, color var(--dsh-dur-hover, 120ms) ease;
}
.dsh-rcard[aria-checked="true"] .dsh-rcard-mark {
  background: var(--dsh-accent-fill, var(--dsh-brand-fill, var(--dsw-alias-brand-primary)));
  border-color: var(--dsh-accent-fill, var(--dsh-brand-fill, var(--dsw-alias-brand-primary)));
  color: var(--dsh-accent-on-color, var(--dsw-alias-label-primary-foreground));
}
.dsh-rcard-sub {
  font-size: var(--dsh-text-sm, 12px);
  line-height: 1.4;
  color: var(--dsw-alias-label-tertiary);
}

.dsh-slider-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.dsh-slider-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--dsh-text-sm, 12px);
  color: var(--dsw-alias-label-primary);
}
.dsh-slider-head label {
  cursor: pointer;
}
.dsh-slider-val {
  font-family: var(--ds-font-family-code);
  font-size: var(--dsh-text-sm, 12px);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--dsh-state-info-text, var(--dsw-alias-state-business-primary));
}
.dsh-range {
  --pct: 50%;
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: 24px;
  margin: -5px 0;
  border-radius: 999px;
  corner-shape: round;
  background: transparent;
  outline: none;
  cursor: pointer;
}
.dsh-range:disabled { opacity: .45; cursor: not-allowed; }
.dsh-range:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: 2px;
}
.dsh-range::-webkit-slider-runnable-track {
  box-sizing: border-box;
  height: 6px;
  border: .5px solid transparent;
  border-radius: 999px;
  corner-shape: round;
  background: linear-gradient(
    to right,
    var(--dsw-alias-state-business-primary) 0%,
    var(--dsw-alias-state-business-primary) var(--pct),
    var(--dsw-alias-border-l3) var(--pct),
    var(--dsw-alias-border-l3) 100%
  );
}
.dsh-range::-moz-range-track {
  box-sizing: border-box;
  height: 6px;
  border: .5px solid transparent;
  border-radius: 999px;
  corner-shape: round;
  background: linear-gradient(
    to right,
    var(--dsw-alias-state-business-primary) 0%,
    var(--dsw-alias-state-business-primary) var(--pct),
    var(--dsw-alias-border-l3) var(--pct),
    var(--dsw-alias-border-l3) 100%
  );
}
.dsh-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: var(--dsh-indicator, 16px);
  height: var(--dsh-indicator, 16px);
  margin-top: calc((5px - var(--dsh-indicator, 16px)) / 2);
  border-radius: 50%;
  corner-shape: round;
  background: var(--dsh-slider-thumb-bg);
  border: .5px solid var(--dsw-alias-border-l3);
  box-shadow: 0 1px 4px rgb(0 0 0 / .24);
  transition: transform var(--dsh-dur-release, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-range::-moz-range-thumb {
  box-sizing: border-box;
  width: var(--dsh-indicator, 16px);
  height: var(--dsh-indicator, 16px);
  border-radius: 50%;
  corner-shape: round;
  background: var(--dsh-slider-thumb-bg);
  border: .5px solid var(--dsw-alias-border-l3);
  box-shadow: 0 1px 4px rgb(0 0 0 / .24);
  transition: transform var(--dsh-dur-release, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-range:not(:disabled):active::-webkit-slider-thumb {
  transform: scale(1.14);
  transition-duration: var(--dsh-dur-press, 60ms);
}
.dsh-range:not(:disabled):active::-moz-range-thumb {
  transform: scale(1.14);
  transition-duration: var(--dsh-dur-press, 60ms);
}
@media (pointer: coarse) {
  .dsh-range {
    height: 32px;
    margin: -8px 0;
  }
  .dsh-range::-webkit-slider-thumb {
    width: 20px;
    height: 20px;
    margin-top: -7.5px;
    border-radius: 50%;
    corner-shape: round;
  }
  .dsh-range::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    corner-shape: round;
  }
}
@media (hover: hover) {
  .dsh-range:not(:disabled)::-webkit-slider-thumb:hover { transform: scale(1.1); }
  .dsh-range:not(:disabled)::-moz-range-thumb:hover { transform: scale(1.1); }
}
@media (prefers-reduced-motion: reduce) {
  .hs-fb-switch:active:not(:disabled) .hs-fb-thumb {
    width: var(--dsh-indicator, 16px);
  }
  .hs-fb-switch[aria-checked="true"]:active:not(:disabled) .hs-fb-thumb {
    transform: translateX(16px);
  }
  .dsh-check-label:not(.is-disabled):active .dsh-checkbox,
  .dsh-check-label:not(.is-disabled):active .dsh-radio,
  .dsh-checkbox:active:not(:disabled),
  .dsh-radio:active:not(:disabled),
  .dsh-range:not(:disabled):active::-webkit-slider-thumb,
  .dsh-range:not(:disabled):active::-moz-range-thumb {
    transform: none;
  }
}
@media (prefers-contrast: more) {
  .hs-fb-switch:not([aria-checked="true"]) {
    border-color: var(--dsh-control-border);
  }
  .dsh-range::-webkit-slider-runnable-track {
    border-color: var(--dsh-control-border);
  }
  .dsh-range::-moz-range-track {
    border-color: var(--dsh-control-border);
  }
}
@media (forced-colors: active) {
  .hs-fb-switch {
    border-color: ButtonText;
  }
  .hs-fb-switch[aria-checked="true"] {
    background-color: Highlight;
    border-color: Highlight;
  }
  .hs-fb-thumb {
    background: ButtonText;
  }
  .hs-fb-switch[aria-checked="true"] .hs-fb-thumb {
    background: HighlightText;
  }
  .dsh-checkbox:is([aria-checked="true"], [aria-checked="mixed"]),
  .dsh-rcard[aria-checked="true"] .dsh-rcard-mark {
    background: Highlight;
    border-color: Highlight;
    color: HighlightText;
  }
  .dsh-radio[aria-checked="true"],
  .dsh-rcard[aria-checked="true"] {
    border-color: Highlight;
  }
  .dsh-range::-webkit-slider-runnable-track {
    border-color: ButtonText;
  }
  .dsh-range::-moz-range-track {
    border-color: ButtonText;
  }
  .dsh-range::-webkit-slider-thumb {
    background: Highlight;
    border-color: HighlightText;
  }
  .dsh-range::-moz-range-thumb {
    background: Highlight;
    border-color: HighlightText;
  }
}
`;
		//#endregion
		//#region ../packages/dsh-ui/src/ScrollArea.tsx
		function assignRef(ref, value) {
			if (!ref) return;
			if (typeof ref === "function") ref(value);
			else ref.current = value;
		}
		const ScrollArea = (0, react.forwardRef)(function ScrollArea({ maxHeight, fadeSize, fade = true, followBottom = false, thumbThreshold, className, style, viewportClassName, viewportStyle, viewportProps, viewportRef, onScroll, children, ...rest }, ref) {
			const innerViewportRef = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				const el = innerViewportRef.current;
				if (!el) return void 0;
				return attachScrollArea(el, {
					fade,
					followBottom,
					thumbThreshold
				});
			}, [
				fade,
				followBottom,
				thumbThreshold
			]);
			const resolvedViewportStyle = {
				...viewportStyle,
				...maxHeight !== void 0 ? { maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight } : {},
				...fadeSize !== void 0 ? { "--dsh-fade-size": typeof fadeSize === "number" ? `${fadeSize}px` : fadeSize } : {}
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				ref,
				className: `dsh-scroll-frame${className ? ` ${className}` : ""}`,
				style,
				...rest,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					...viewportProps,
					ref: (node) => {
						innerViewportRef.current = node;
						assignRef(viewportRef, node);
					},
					className: `dsh-scroll-area${viewportClassName ? ` ${viewportClassName}` : ""}`,
					style: resolvedViewportStyle,
					onScroll,
					children
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dsh-scroll-thumb",
					"aria-hidden": "true",
					hidden: true
				})]
			});
		});
		const scrollAreaCss = `
.dsh-scroll-frame {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.dsh-scroll-demo-frame {
  position: relative;
  border-radius: var(--dsw-radius-md, 12px);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  border: .5px solid var(--dsw-alias-border-l2);
  background: var(--dsh-surface-card);
  overflow: hidden;
}
.dsh-scroll-area {
  --dsh-fade-size: 26px;
  --_ft: 0px;
  --_fb: 0px;
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scroll-padding-block: 16px;
  scrollbar-width: none;
}
.dsh-scroll-area::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}
.dsh-scroll-area[data-fade-top] { --_ft: var(--dsh-fade-size); }
.dsh-scroll-area[data-fade-bottom] { --_fb: var(--dsh-fade-size); }
.dsh-scroll-area[data-fade-top],
.dsh-scroll-area[data-fade-bottom] {
  -webkit-mask-image: linear-gradient(to bottom, transparent 0px, rgb(0 0 0 / .05) calc(var(--_ft) * .15), rgb(0 0 0 / .15) calc(var(--_ft) * .30), rgb(0 0 0 / .30) calc(var(--_ft) * .45), rgb(0 0 0 / .50) calc(var(--_ft) * .60), rgb(0 0 0 / .70) calc(var(--_ft) * .75), rgb(0 0 0 / .85) calc(var(--_ft) * .87), #000 var(--_ft), #000 calc(100% - var(--_fb)), rgb(0 0 0 / .85) calc(100% - var(--_fb) * .87), rgb(0 0 0 / .70) calc(100% - var(--_fb) * .75), rgb(0 0 0 / .50) calc(100% - var(--_fb) * .60), rgb(0 0 0 / .30) calc(100% - var(--_fb) * .45), rgb(0 0 0 / .15) calc(100% - var(--_fb) * .30), rgb(0 0 0 / .05) calc(100% - var(--_fb) * .15), transparent 100%);
  mask-image: linear-gradient(to bottom, transparent 0px, rgb(0 0 0 / .05) calc(var(--_ft) * .15), rgb(0 0 0 / .15) calc(var(--_ft) * .30), rgb(0 0 0 / .30) calc(var(--_ft) * .45), rgb(0 0 0 / .50) calc(var(--_ft) * .60), rgb(0 0 0 / .70) calc(var(--_ft) * .75), rgb(0 0 0 / .85) calc(var(--_ft) * .87), #000 var(--_ft), #000 calc(100% - var(--_fb)), rgb(0 0 0 / .85) calc(100% - var(--_fb) * .87), rgb(0 0 0 / .70) calc(100% - var(--_fb) * .75), rgb(0 0 0 / .50) calc(100% - var(--_fb) * .60), rgb(0 0 0 / .30) calc(100% - var(--_fb) * .45), rgb(0 0 0 / .15) calc(100% - var(--_fb) * .30), rgb(0 0 0 / .05) calc(100% - var(--_fb) * .15), transparent 100%);
}
.dsh-scroll-thumb {
  position: absolute;
  top: 0;
  right: 2px;
  width: 4px;
  min-height: 24px;
  border-radius: 999px;
  corner-shape: round;
  background: var(--dsh-scrollbar-thumb, var(--dsw-alias-scrollbar-bg-l1));
  opacity: 0;
  touch-action: none;
  transition: opacity var(--dsh-dur-pop, 150ms) ease, width var(--dsh-dur-hover, 120ms) ease;
}
.dsh-scroll-thumb::after {
  content: "";
  position: absolute;
  inset: -2px -3px -2px -6px;
}
.dsh-scroll-thumb[hidden] { display: none; }
.dsh-scroll-frame[data-scroll-active] > .dsh-scroll-thumb,
.dsh-scroll-demo-frame[data-scroll-active] .dsh-scroll-thumb,
.dsh-scroll-demo-frame[data-demo-pinned] .dsh-scroll-thumb,
.dsh-scroll-thumb[data-dragging] {
  opacity: 1;
}
.dsh-scroll-thumb[data-dragging] {
  right: 1px;
  width: 6px;
  background: var(--dsh-scrollbar-thumb-hover, var(--dsw-alias-scrollbar-hover-l1));
}
.hs-msurf .dsh-scroll-frame > .dsh-scroll-thumb {
  right: calc(1px - var(--dsh-pad, 4px));
  width: 3px;
}
.hs-msurf .dsh-scroll-frame > .dsh-scroll-thumb[data-dragging] {
  right: calc(.5px - var(--dsh-pad, 4px));
  width: 4px;
}
@media (hover: hover) {
  .dsh-scroll-frame:hover > .dsh-scroll-thumb,
  .dsh-scroll-demo-frame:hover .dsh-scroll-thumb {
    opacity: 1;
  }
  .dsh-scroll-thumb:hover {
    right: 1px;
    width: 6px;
    background: var(--dsh-scrollbar-thumb-hover, var(--dsw-alias-scrollbar-hover-l1));
  }
  .hs-msurf .dsh-scroll-frame > .dsh-scroll-thumb:hover {
    right: calc(.5px - var(--dsh-pad, 4px));
    width: 4px;
  }
}
@media (prefers-contrast: more) {
  .dsh-scroll-thumb {
    opacity: .85;
  }
}
`;
		//#endregion
		//#region ../packages/dsh-ui/src/MenuSurface.tsx
		/** @jsxImportSource react */
		const MenuSurface = (0, react.forwardRef)(function MenuSurface({ compact = false, panel = false, material = "translucent", backing = true, footer, maxBodyHeight, origin, className, style, children, ...rest }, ref) {
			const id = (0, react.useId)();
			const surfaceRef = (0, react.useRef)(null);
			const backingRef = (0, react.useRef)(null);
			const setSurfaceRef = (el) => {
				surfaceRef.current = el;
				if (typeof ref === "function") ref(el);
				else if (ref) ref.current = el;
			};
			(typeof document !== "undefined" ? react.useLayoutEffect : react.useEffect)(() => {
				const backingEl = backingRef.current;
				if (backingEl === null || typeof document === "undefined") return;
				const overlay = surfaceRef.current?.closest?.(".dsh-modal-overlay, .live-overlay") ?? null;
				if (overlay) overlay.insertBefore(backingEl, overlay.firstChild);
				else if (document.body) document.body.appendChild(backingEl);
			}, [material, backing]);
			const canPortal = backing && material === "translucent" && typeof document !== "undefined" && Boolean(document.body);
			const anchor = {
				...canPortal ? { "--dsh-menu-anchor": `--dsh-menu-${id.replaceAll(":", "")}` } : {},
				...origin !== void 0 ? { "--dsh-pop-origin": origin } : {}
			};
			const size = `${compact ? " hs-msurf-compact" : ""}${panel ? " hs-msurf-panel" : ""}`;
			const popAnim = rest["data-pop-anim"];
			const dataSide = rest["data-side"];
			const dataAlign = rest["data-align"];
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				...rest,
				ref: setSurfaceRef,
				"data-menu-material": material,
				className: `hs-msurf${size}${className ? ` ${className}` : ""}`,
				style: {
					...style,
					...anchor
				},
				children: [
					material === "translucent" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						"aria-hidden": "true",
						className: "hs-msurf-material"
					}),
					maxBodyHeight !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ScrollArea, {
						maxHeight: maxBodyHeight,
						thumbThreshold: 1.05,
						className: "hs-msurf-scroll",
						viewportClassName: "hs-msurf-scroll-body",
						children
					}) : children,
					footer !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "hs-msurf-footer",
						children: footer
					})
				]
			}), canPortal && (0, react_dom.createPortal)(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				ref: backingRef,
				"aria-hidden": "true",
				"data-menu-backing": "",
				"data-dsh-portal": "",
				"data-side": dataSide,
				"data-align": dataAlign,
				"data-pop-anim": popAnim,
				className: `hs-msurf-backing${size}`,
				style: {
					...anchor,
					visibility: style?.visibility
				}
			}), document.body)] });
		});
		const menuSurfaceCss = `
@keyframes dsh-menu-pop {
  from { opacity: 0; transform: scale(.96) translate(var(--dsh-pop-dx, 0px), var(--dsh-pop-dy, -2px)); }
  to { opacity: 1; transform: scale(1) translate(0, 0); }
}
@keyframes dsh-menu-pop-geom {
  from {
    transform: scale(.96) translate(var(--dsh-pop-dx, 0px), var(--dsh-pop-dy, -2px));
    box-shadow: none;
  }
  to {
    transform: scale(1) translate(0, 0);
  }
}
@keyframes dsh-menu-pop-glass {
  from {
    background-color: transparent;
    -webkit-backdrop-filter: blur(0px) saturate(1);
    backdrop-filter: blur(0px) saturate(1);
    box-shadow: none;
  }
}
@keyframes dsh-menu-pop-surface {
  from {
    transform: scale(.96) translate(var(--dsh-pop-dx, 0px), var(--dsh-pop-dy, -2px));
    background-color: transparent;
    -webkit-backdrop-filter: blur(0px) saturate(1);
    backdrop-filter: blur(0px) saturate(1);
    box-shadow: none;
  }
  to {
    transform: scale(1) translate(0, 0);
  }
}
@keyframes dsh-menu-pop-fade {
  from { opacity: 0; }
}
.hs-msurf {
  --dsh-r-outer: 22px;
  --dsh-pad: 6px;
  --dsh-menu-anchor: none;
  --dsh-pop-origin: top left;
  --dsh-pop-dx: 0px;
  --dsh-pop-dy: -2px;
  --dsh-glass-inset: var(--dsh-menu-glass-inset);
  --dsh-glass-outer: var(--dsh-menu-glass-outer);
  --dsh-glass-shadow: var(--dsh-menu-glass-shadow);
  box-sizing: border-box;
  padding: var(--dsh-pad);
  display: flex;
  flex-direction: column;
  gap: 1px;
  anchor-name: var(--dsh-menu-anchor);
  isolation: isolate;
  transform-origin: var(--dsh-pop-origin, top left);
}
:where(.hs-msurf) {
  position: relative;
  --dsh-glide-bg: var(--dsw-alias-interactive-bg-hover);
}
/* 菜单：胶囊 + 同心（行圆角 = 外框 − 内距 = 行高 / 2） */
.hs-msurf,
.hs-msurf-backing {
  border-radius: 22px;
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
}
.hs-msurf-compact,
.hs-msurf.hs-msurf-compact {
  --dsh-r-outer: 20px;
  border-radius: 20px;
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
}
/* 非菜单面板：保留宿主圆角矩形 16px / compact 12px */
.hs-msurf-panel {
  --dsh-pad: 4px;
}
.hs-msurf.hs-msurf-panel,
.hs-msurf-backing.hs-msurf-panel {
  --dsh-r-outer: var(--dsw-radius-lg, 16px);
  border-radius: var(--dsw-radius-lg, 16px);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
}
.hs-msurf.hs-msurf-compact.hs-msurf-panel,
.hs-msurf-backing.hs-msurf-compact.hs-msurf-panel {
  --dsh-r-outer: var(--dsw-radius-md, 12px);
  border-radius: var(--dsw-radius-md, 12px);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
}
.hs-msurf[data-side="bottom"],
.hs-msurf-backing[data-side="bottom"] {
  --dsh-pop-origin: top left;
  --dsh-pop-dx: 0px;
  --dsh-pop-dy: -2px;
}
.hs-msurf[data-side="top"],
.hs-msurf-backing[data-side="top"] {
  --dsh-pop-origin: bottom left;
  --dsh-pop-dx: 0px;
  --dsh-pop-dy: 2px;
}
.hs-msurf[data-side="right"],
.hs-msurf-backing[data-side="right"] {
  --dsh-pop-origin: left top;
  --dsh-pop-dx: -2px;
  --dsh-pop-dy: 0px;
}
.hs-msurf[data-side="left"],
.hs-msurf-backing[data-side="left"] {
  --dsh-pop-origin: right top;
  --dsh-pop-dx: 2px;
  --dsh-pop-dy: 0px;
}
.hs-msurf[data-side="bottom"][data-align="start"],
.hs-msurf-backing[data-side="bottom"][data-align="start"] { --dsh-pop-origin: top left; }
.hs-msurf[data-side="bottom"][data-align="center"],
.hs-msurf-backing[data-side="bottom"][data-align="center"] { --dsh-pop-origin: top center; }
.hs-msurf[data-side="bottom"][data-align="end"],
.hs-msurf-backing[data-side="bottom"][data-align="end"] { --dsh-pop-origin: top right; }
.hs-msurf[data-side="top"][data-align="start"],
.hs-msurf-backing[data-side="top"][data-align="start"] { --dsh-pop-origin: bottom left; }
.hs-msurf[data-side="top"][data-align="center"],
.hs-msurf-backing[data-side="top"][data-align="center"] { --dsh-pop-origin: bottom center; }
.hs-msurf[data-side="top"][data-align="end"],
.hs-msurf-backing[data-side="top"][data-align="end"] { --dsh-pop-origin: bottom right; }
.hs-msurf[data-pop-anim="true"] {
  transform-origin: var(--dsh-pop-origin, top left);
}
.hs-msurf-backing[data-pop-anim="true"] {
  animation: dsh-menu-pop-fade var(--dsh-dur-pop, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.hs-msurf[data-menu-material="solid"][data-pop-anim="true"],
.hs-msurf[data-menu-material="optical"][data-pop-anim="true"] {
  animation: dsh-menu-pop var(--dsh-dur-pop, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
/* 毛玻璃浮层严禁在父容器动画 opacity < 1（否则触发 W3C Backdrop Root 阻断子层 backdrop-filter 采样导致结束瞬间突跳模糊） */
.hs-msurf[data-menu-material="translucent"][data-pop-anim="true"] {
  opacity: 1;
  animation: dsh-menu-pop-geom var(--dsh-dur-pop, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.hs-msurf[data-menu-material="translucent"][data-pop-anim="true"] > .hs-msurf-material {
  animation: dsh-menu-pop-glass var(--dsh-dur-pop, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.hs-msurf[data-menu-material="translucent"][data-pop-anim="true"] > :not(.hs-msurf-material) {
  animation: dsh-menu-pop-fade var(--dsh-dur-pop, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.hs-msurf:not([data-menu-material])[data-pop-anim="true"] {
  opacity: 1;
  animation: dsh-menu-pop-surface var(--dsh-dur-pop, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.hs-msurf:not([data-menu-material])[data-pop-anim="true"] > * {
  animation: dsh-menu-pop-fade var(--dsh-dur-pop, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-select-wrap.is-open > .hs-msurf.dsh-select-menu:not([data-pop-anim="true"])[data-menu-material="translucent"] {
  opacity: 1;
  animation: dsh-menu-pop-geom var(--dsh-dur-pop, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-select-wrap.is-open > .hs-msurf.dsh-select-menu:not([data-pop-anim="true"])[data-menu-material="translucent"] > .hs-msurf-material {
  animation: dsh-menu-pop-glass var(--dsh-dur-pop, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-select-wrap.is-open > .hs-msurf.dsh-select-menu:not([data-pop-anim="true"])[data-menu-material="translucent"] > :not(.hs-msurf-material) {
  animation: dsh-menu-pop-fade var(--dsh-dur-pop, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-select-wrap.is-open > .hs-msurf.dsh-select-menu:not([data-pop-anim="true"]):not([data-menu-material]) {
  opacity: 1;
  animation: dsh-menu-pop-surface var(--dsh-dur-pop, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-select-wrap.is-open > .hs-msurf.dsh-select-menu:not([data-pop-anim="true"]):not([data-menu-material]) > * {
  animation: dsh-menu-pop-fade var(--dsh-dur-pop, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
/* 实底把菜单主题色叠在同一元素的不透明基底上，不创建 backdrop-filter 或跨 DOM 的 backing。 */
.hs-msurf[data-menu-material="solid"] {
  background: linear-gradient(var(--dsw-menu-surface-fill), var(--dsw-menu-surface-fill)), var(--dsw-alias-bg-base);
  isolation: auto;
}
.hs-msurf[data-menu-material="optical"] {
  background: var(--dsh-optical-surface-fill);
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
  box-shadow: var(--dsh-optical-glass-shadow);
}
.hs-msurf[data-menu-material="translucent"] {
  box-shadow: var(--dsh-glass-outer, var(--dsh-glass-shadow));
}
/* 静态无 data-menu-material 标记的 .hs-msurf（如预览台标本）直接展示同一套待办栏共享毛玻璃，不与内部 .hs-msurf-material 叠两层滤镜 */
.hs-msurf:not([data-menu-material]) {
  background: var(--dsh-menu-surface-fill, var(--dsw-menu-surface-fill));
  -webkit-backdrop-filter: var(--dsh-menu-backdrop-filter, var(--dsw-menu-backdrop-filter));
  backdrop-filter: var(--dsh-menu-backdrop-filter, var(--dsw-menu-backdrop-filter));
  box-shadow: var(--dsh-glass-shadow);
}
.hs-msurf-material {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  corner-shape: inherit;
  background: var(--dsh-menu-surface-fill, var(--dsw-menu-surface-fill));
  -webkit-backdrop-filter: var(--dsh-menu-backdrop-filter, var(--dsw-menu-backdrop-filter));
  backdrop-filter: var(--dsh-menu-backdrop-filter, var(--dsw-menu-backdrop-filter));
  box-shadow: var(--dsh-glass-inset, none);
  pointer-events: none;
}
/* 同心胶囊菜单项（标准 22 - 6 = 16px / 紧凑 20 - 6 = 14px）与 12px 两端留白分割线（容器内距 + 缩进 = 12px） */
.hs-msurf-item {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 7px;
  width: 100%;
  min-height: var(--dsh-row-sm, 32px);
  padding: 6px 8px;
  border: 0;
  border-radius: max(0px, calc(var(--dsh-r-outer) - var(--dsh-pad, 6px)));
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: var(--dsh-text-md, 13px);
  line-height: 20px;
  text-align: left;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
.hs-msurf-compact .hs-msurf-item {
  min-height: var(--dsh-control-sm, 28px);
  padding: 4px 8px;
  font-size: var(--dsh-text-sm, 12px);
  line-height: 18px;
}
.hs-msurf-item:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: -2px;
}
.hs-msurf[data-menu-managed] .hs-msurf-item[data-highlighted="true"]:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
}
:is(.hs-msurf[data-dsh-glide], .hs-msurf [data-dsh-glide]) .hs-msurf-item[data-highlighted="true"]:not(:disabled) {
  background: transparent;
}
.hs-msurf[data-menu-managed] .hs-msurf-item[data-highlighted="true"] + .hs-msurf-sep,
.hs-msurf[data-menu-managed] .hs-msurf-sep:has(+ .hs-msurf-item[data-highlighted="true"]),
:is(.hs-msurf[data-dsh-glide], .hs-msurf [data-dsh-glide]) .hs-msurf-item[data-glide-active] + .hs-msurf-sep,
:is(.hs-msurf[data-dsh-glide], .hs-msurf [data-dsh-glide]) .hs-msurf-sep:has(+ .hs-msurf-item[data-glide-active]) {
  opacity: 0;
}
.hs-msurf-sep {
  margin: 3px calc(12px - var(--dsh-pad, 4px));
  border-top: .5px solid var(--dsw-alias-border-l2);
  transition: opacity var(--dsh-dur-hover, 120ms) ease;
}
.hs-msurf-footer {
  position: sticky;
  bottom: 0;
  z-index: 1;
  margin-top: 3px;
  display: flex;
  flex-direction: column;
}
.hs-msurf-footer::before {
  content: "";
  display: block;
  margin: 0 calc(12px - var(--dsh-pad, 4px)) 3px;
  border-top: .5px solid var(--dsw-alias-border-l2);
}
.hs-msurf:focus {
  outline: none;
}
.hs-msurf-scroll {
  flex: 1 1 auto;
  min-height: 0;
}
.hs-msurf-scroll-body {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.hs-msurf-scroll-body > .dsh-glide-pin {
  margin-bottom: -1px;
}
@media (hover: hover) {
  .hs-msurf:not([data-menu-managed]):not([data-dsh-glide]):not(:has([data-dsh-glide])) .hs-msurf-item:hover:not(:disabled) {
    background: var(--dsw-alias-interactive-bg-hover);
  }
  .hs-msurf:not([data-menu-managed]) .hs-msurf-item:hover + .hs-msurf-sep,
  .hs-msurf:not([data-menu-managed]) .hs-msurf-sep:has(+ .hs-msurf-item:hover) {
    opacity: 0;
  }
}
@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
  .hs-msurf,
  .hs-msurf[data-menu-material],
  .hs-msurf:not([data-menu-material]) {
    background: var(--dsh-surface-floating, var(--dsw-alias-bg-layer-2));
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    border: 1px solid var(--dsw-alias-border-l4);
    box-shadow: var(--dsw-elevation-prominent);
  }
  .hs-msurf-material {
    background: var(--dsh-surface-floating, var(--dsw-alias-bg-layer-2));
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    box-shadow: none;
  }
  .hs-msurf[data-menu-material="translucent"][data-pop-anim="true"],
  .hs-msurf:not([data-menu-material])[data-pop-anim="true"],
  .dsh-select-wrap.is-open > .hs-msurf.dsh-select-menu:not([data-pop-anim="true"])[data-menu-material="translucent"],
  .dsh-select-wrap.is-open > .hs-msurf.dsh-select-menu:not([data-pop-anim="true"]):not([data-menu-material]) {
    animation-name: dsh-menu-pop;
  }
  .hs-msurf[data-menu-material="translucent"][data-pop-anim="true"] > *,
  .hs-msurf:not([data-menu-material])[data-pop-anim="true"] > *,
  .dsh-select-wrap.is-open > .hs-msurf.dsh-select-menu:not([data-pop-anim="true"])[data-menu-material="translucent"] > *,
  .dsh-select-wrap.is-open > .hs-msurf.dsh-select-menu:not([data-pop-anim="true"]):not([data-menu-material]) > * {
    animation: none;
  }
}
html[data-dsh-reduce-trans] .hs-msurf,
html[data-dsh-reduce-trans] .hs-msurf[data-menu-material],
html[data-dsh-reduce-trans] .hs-msurf:not([data-menu-material]) {
  background: var(--dsh-surface-floating, var(--dsw-alias-bg-layer-2));
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
  border: 1px solid var(--dsw-alias-border-l4);
  box-shadow: var(--dsw-elevation-prominent);
}
html[data-dsh-reduce-trans] .hs-msurf-material {
  background: var(--dsh-surface-floating, var(--dsw-alias-bg-layer-2));
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
  box-shadow: none;
}
html[data-dsh-reduce-trans] .hs-msurf[data-menu-material="translucent"][data-pop-anim="true"],
html[data-dsh-reduce-trans] .hs-msurf:not([data-menu-material])[data-pop-anim="true"],
html[data-dsh-reduce-trans] .dsh-select-wrap.is-open > .hs-msurf.dsh-select-menu:not([data-pop-anim="true"])[data-menu-material="translucent"],
html[data-dsh-reduce-trans] .dsh-select-wrap.is-open > .hs-msurf.dsh-select-menu:not([data-pop-anim="true"]):not([data-menu-material]) {
  animation-name: dsh-menu-pop;
}
html[data-dsh-reduce-trans] .hs-msurf[data-menu-material="translucent"][data-pop-anim="true"] > *,
html[data-dsh-reduce-trans] .hs-msurf:not([data-menu-material])[data-pop-anim="true"] > *,
html[data-dsh-reduce-trans] .dsh-select-wrap.is-open > .hs-msurf.dsh-select-menu:not([data-pop-anim="true"])[data-menu-material="translucent"] > *,
html[data-dsh-reduce-trans] .dsh-select-wrap.is-open > .hs-msurf.dsh-select-menu:not([data-pop-anim="true"]):not([data-menu-material]) > * {
  animation: none;
}
@media (prefers-reduced-motion: reduce) {
  .hs-msurf[data-pop-anim="true"],
  .hs-msurf[data-pop-anim="true"] > *,
  .hs-msurf-backing[data-pop-anim="true"],
  .dsh-select-wrap.is-open > .hs-msurf.dsh-select-menu:not([data-pop-anim="true"]),
  .dsh-select-wrap.is-open > .hs-msurf.dsh-select-menu:not([data-pop-anim="true"]) > * {
    animation: none;
  }
}
.hs-msurf-backing {
  --dsh-pop-dx: 0px;
  --dsh-pop-dy: -2px;
  display: none;
}
html[data-platform=darwin] .hs-msurf-backing {
  display: block;
  position: fixed;
  position-anchor: var(--dsh-menu-anchor);
  top: anchor(top);
  left: anchor(left);
  width: anchor-size(width, 0px);
  height: anchor-size(height, 0px);
  z-index: -1;
  background: var(--dsw-alias-bg-base);
  pointer-events: none;
}
.dsh-modal-overlay > .hs-msurf-backing,
.live-overlay > .hs-msurf-backing,
html[data-platform=darwin] .dsh-modal-overlay > .hs-msurf-backing,
html[data-platform=darwin] .live-overlay > .hs-msurf-backing {
  z-index: 0;
}
.hs-msurf[hidden],
.hs-msurf-backing[hidden],
html[data-platform=darwin] .hs-msurf-backing[hidden] {
  display: none;
}
`;
		//#endregion
		//#region ../packages/dsh-ui/src/anchored-position.ts
		function readFrameTopClearance(margin) {
			if (typeof document === "undefined" || typeof getComputedStyle !== "function") return margin;
			const root = document.documentElement;
			if (!root) return margin;
			const clearance = Number.parseFloat(getComputedStyle(root).getPropertyValue("--dsh-frame-top-clearance"));
			return Number.isNaN(clearance) ? margin : Math.max(margin, (root.hasAttribute("data-fullscreen") ? 0 : clearance) + 20);
		}
		/**
		* 纯几何锚定计算（边缘碰撞翻转 + 安全视口夹紧 + 可用净高 + 动态展开原点）：
		* - 首选方向空间不足且对侧空间更充裕时自动翻转（避免底边硬夹紧盖住触发器本身）；
		* - 窄屏/矮屏统一采用 Math.min(Math.max(raw, min), Math.max(min, max))，绝不跌破左界或顶部 macOS 标题栏安全区；
		* - 动态反算指向触发器中心的 transform-origin 与该侧最大可用高度 maxHeight。
		*/
		function computeAnchoredPlacement(anchor, panelSize, viewport, options) {
			const { side = "bottom", align = "start", gap, margin, topClearance, flip = true } = options;
			const topLimit = Math.max(margin, topClearance ?? margin);
			const { width, height } = panelSize;
			if (side === "right" || side === "left") {
				const availRight = Math.max(0, viewport.width - anchor.right - gap - margin);
				const availLeft = Math.max(0, anchor.left - gap - margin);
				let resolvedSide = side;
				if (flip && width > 0) {
					if (side === "right" && width > availRight && availLeft > availRight) resolvedSide = "left";
					else if (side === "left" && width > availLeft && availRight > availLeft) resolvedSide = "right";
				}
				const rawLeft = resolvedSide === "left" ? anchor.left - gap - width : anchor.right + gap;
				const rawTop = align === "end" ? anchor.bottom - height : anchor.top;
				const left = width > 0 ? Math.min(Math.max(rawLeft, margin), Math.max(margin, viewport.width - width - margin)) : rawLeft;
				const top = height > 0 ? Math.min(Math.max(rawTop, topLimit), Math.max(topLimit, viewport.height - height - margin)) : rawTop;
				const maxHeight = Math.max(96, Math.floor(viewport.height - topLimit - margin));
				return {
					left: Math.round(left),
					top: Math.round(top),
					side: resolvedSide,
					align,
					maxHeight,
					origin: `${resolvedSide === "left" ? "right" : "left"} ${align === "end" ? "bottom" : "top"}`
				};
			}
			const availBelow = Math.max(0, viewport.height - anchor.bottom - gap - margin);
			const availAbove = Math.max(0, anchor.top - gap - topLimit);
			let resolvedSide = side;
			if (flip && height > 0) {
				if (side === "bottom" && height > availBelow && availAbove > availBelow) resolvedSide = "top";
				else if (side === "top" && height > availAbove && availBelow > availAbove) resolvedSide = "bottom";
			}
			const rawLeft = align === "end" ? anchor.right - width : anchor.left;
			const rawTop = resolvedSide === "top" ? anchor.top - gap - height : anchor.bottom + gap;
			const left = width > 0 ? Math.min(Math.max(rawLeft, margin), Math.max(margin, viewport.width - width - margin)) : rawLeft;
			const top = height > 0 ? Math.min(Math.max(rawTop, topLimit), Math.max(topLimit, viewport.height - height - margin)) : rawTop;
			const maxHeight = Math.max(96, Math.floor(resolvedSide === "top" ? availAbove : availBelow));
			const anchorCenterX = (anchor.left + anchor.right) / 2;
			const origin = width > 0 ? `${Math.round(Math.min(Math.max(anchorCenterX - left, 8), Math.max(8, width - 8)))}px ${resolvedSide === "top" ? "bottom" : "top"}` : `${align === "end" ? "right" : "left"} ${resolvedSide === "top" ? "bottom" : "top"}`;
			return {
				left: Math.round(left),
				top: Math.round(top),
				side: resolvedSide,
				align,
				maxHeight,
				origin
			};
		}
		/**
		* 完整锚定方位 Hook：返回坐标、翻转后的实际 side、可用 maxHeight 与指向触发器的 origin。
		* SSR 安全（服务端回退 useEffect 无告警），同时监听窗口缩放、祖先滚动及锚点/面板双端尺寸变化。
		*/
		function useAnchoredPlacement(options) {
			const { open, anchorRef, panelRef, side = "bottom", align = "start", gap, margin, flip = true } = options;
			const [placement, setPlacement] = (0, react.useState)(null);
			(typeof document !== "undefined" ? react.useLayoutEffect : react.useEffect)(() => {
				if (!open || typeof window === "undefined") {
					setPlacement((prev) => prev === null ? prev : null);
					return;
				}
				const measure = () => {
					const anchor = anchorRef.current?.getBoundingClientRect();
					if (!anchor) return;
					const panel = panelRef.current;
					const width = panel?.offsetWidth ?? 0;
					const height = panel?.offsetHeight ?? 0;
					const vv = window.visualViewport;
					const vw = vv?.width ?? window.innerWidth;
					const vh = vv?.height ?? window.innerHeight;
					const next = computeAnchoredPlacement(anchor, {
						width,
						height
					}, {
						width: vw,
						height: vh
					}, {
						side,
						align,
						gap,
						margin,
						topClearance: readFrameTopClearance(margin),
						flip
					});
					setPlacement((prev) => prev && prev.left === next.left && prev.top === next.top && prev.side === next.side && prev.align === next.align && prev.maxHeight === next.maxHeight && prev.origin === next.origin ? prev : next);
				};
				const onScroll = (event) => {
					const anchor = anchorRef.current;
					if (anchor === null) return;
					const target = event.target;
					if (target === window || target === document || target instanceof Node && target !== anchor && target.contains(anchor)) measure();
				};
				measure();
				window.addEventListener("scroll", onScroll, true);
				window.addEventListener("resize", measure);
				const vv = window.visualViewport;
				vv?.addEventListener?.("resize", measure);
				vv?.addEventListener?.("scroll", measure);
				let observer = null;
				if (typeof ResizeObserver !== "undefined") {
					observer = new ResizeObserver(measure);
					if (panelRef.current !== null) observer.observe(panelRef.current);
					if (anchorRef.current !== null) observer.observe(anchorRef.current);
				}
				return () => {
					observer?.disconnect();
					window.removeEventListener("scroll", onScroll, true);
					window.removeEventListener("resize", measure);
					vv?.removeEventListener?.("resize", measure);
					vv?.removeEventListener?.("scroll", measure);
				};
			}, [
				open,
				anchorRef,
				panelRef,
				side,
				align,
				gap,
				margin,
				flip
			]);
			return placement;
		}
		//#endregion
		//#region ../packages/dsh-ui/src/overlay-stack.ts
		const OVERLAY_BASE_Z = {
			tooltip: 1e3,
			menu: 1100,
			popover: 1100,
			select: 1150,
			infotip: 1150,
			modal: 1200,
			toast: 1400
		};
		/**
		* 逻辑父浮层上下文：
		* 让 Portal 到 document.body 的子浮层（如 PopoverRow 内的 InfoTip、Modal 内的 Select / Popover）
		* 在组件树上自动继承父浮层 ID，使外部点击判定将逻辑子孙浮层识别为「内部点击」而非误关父层。
		*/
		const OverlayParentContext = (0, react.createContext)(null);
		const docDispatchers = /* @__PURE__ */ new WeakMap();
		const consumedOutsideEvents = /* @__PURE__ */ new WeakSet();
		function isDomNode(value) {
			return typeof value === "object" && value !== null && typeof value.nodeType === "number";
		}
		function isDescendantOrSelfLayer(layers, candidate, ancestorId) {
			let cur = candidate;
			const visited = /* @__PURE__ */ new Set();
			while (cur) {
				if (cur.id === ancestorId) return true;
				if (!cur.parentId || visited.has(cur.id)) break;
				visited.add(cur.id);
				const pid = cur.parentId;
				cur = layers.find((item) => item.id === pid);
			}
			return false;
		}
		function isNodeInsideLayerTree(layers, layer, target) {
			for (const item of layers) if (isDescendantOrSelfLayer(layers, item, layer.id)) {
				if (item.containsNode?.(target) === true) return true;
			}
			return false;
		}
		function computeLayerZIndex(layers, tier) {
			const base = OVERLAY_BASE_Z[tier];
			if (tier === "toast") {
				let maxAll = base - 10;
				for (const item of layers) if (item.zIndex > maxAll) maxAll = item.zIndex;
				return Math.max(base, maxAll + 10);
			}
			let maxBelowToast = 0;
			for (const item of layers) if (item.tier !== "toast" && item.zIndex > maxBelowToast) maxBelowToast = item.zIndex;
			return maxBelowToast >= base ? maxBelowToast + 10 : base;
		}
		function ensureDocDispatcher(doc) {
			const existing = docDispatchers.get(doc);
			if (existing) return existing;
			const layers = [];
			const onKeyDown = (event) => {
				if (event.key !== "Escape") return;
				if (event.defaultPrevented || isImeComposing(event)) return;
				const activeEl = doc.activeElement;
				const consumeLayer = (layer) => {
					if (!layer.onEscape) return false;
					if (layer.onEscape(event) !== false) {
						event.preventDefault?.();
						event.stopPropagation?.();
						if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
						return true;
					}
					return false;
				};
				if (activeEl) for (let i = layers.length - 1; i >= 0; i -= 1) {
					const layer = layers[i];
					if (layer?.tier === "toast" && layer.containsNode?.(activeEl) === true) {
						if (consumeLayer(layer)) return;
					}
				}
				for (let i = layers.length - 1; i >= 0; i -= 1) {
					const layer = layers[i];
					if (!layer || layer.tier === "toast") continue;
					if (consumeLayer(layer)) return;
				}
				for (let i = layers.length - 1; i >= 0; i -= 1) {
					const layer = layers[i];
					if (layer?.tier === "toast" && consumeLayer(layer)) return;
				}
			};
			const onPointerDownCapture = (event) => {
				const target = event.target;
				if (!isDomNode(target)) return;
				for (let i = layers.length - 1; i >= 0; i -= 1) {
					const layer = layers[i];
					if (!layer) continue;
					if (isNodeInsideLayerTree(layers, layer, target)) return;
					if (layer.onPointerDownOutside) {
						consumedOutsideEvents.add(event);
						layer.onPointerDownOutside(event);
						return;
					}
					if (layer.tier === "modal") return;
				}
			};
			doc.addEventListener("keydown", onKeyDown);
			doc.addEventListener("pointerdown", onPointerDownCapture, true);
			const dispatcher = {
				layers,
				cleanup: () => {
					doc.removeEventListener("keydown", onKeyDown);
					doc.removeEventListener("pointerdown", onPointerDownCapture, true);
					docDispatchers.delete(doc);
				}
			};
			docDispatchers.set(doc, dispatcher);
			return dispatcher;
		}
		/**
		* 命令式浮层入栈注册器（供 Tooltip 等非 React 原语与 useOverlayLayer 共享）：
		* 自动分配不倒挂的动态 zIndex，并在栈空时自动卸载全局 document 监听。
		*/
		function registerOverlayLayer(entry) {
			const doc = entry.doc ?? (typeof document !== "undefined" ? document : void 0);
			const fallbackZ = OVERLAY_BASE_Z[entry.tier];
			if (!doc) return {
				zIndex: fallbackZ,
				dispose: () => {}
			};
			const dispatcher = ensureDocDispatcher(doc);
			const existingIdx = dispatcher.layers.findIndex((item) => item.id === entry.id);
			if (existingIdx >= 0) dispatcher.layers.splice(existingIdx, 1);
			const zIndex = computeLayerZIndex(dispatcher.layers, entry.tier);
			const record = {
				...entry,
				doc,
				zIndex
			};
			dispatcher.layers.push(record);
			let disposed = false;
			return {
				zIndex,
				dispose: () => {
					if (disposed) return;
					disposed = true;
					const idx = dispatcher.layers.indexOf(record);
					if (idx >= 0) dispatcher.layers.splice(idx, 1);
					if (dispatcher.layers.length === 0) dispatcher.cleanup();
				}
			};
		}
		/**
		* React 浮层栈 Hook：
		* - 自动接入 OverlayParentContext 建立逻辑父子链；
		* - 同步计算高于父模态/浮层的动态 zIndex；
		* - 统一 LIFO Escape 与外部 pointerdown 关闭，消除多监听竞态与双重关闭。
		*/
		function useOverlayLayer({ open, tier, containsNode, onEscape, onPointerDownOutside, closeOnEscape = true }) {
			const layerId = `dsh-layer-${(0, react.useId)().replaceAll(":", "")}`;
			const parentId = (0, react.useContext)(OverlayParentContext);
			const [zIndex, setZIndex] = (0, react.useState)(() => OVERLAY_BASE_Z[tier]);
			const callbacksRef = (0, react.useRef)({
				containsNode,
				onEscape,
				onPointerDownOutside,
				closeOnEscape
			});
			callbacksRef.current = {
				containsNode,
				onEscape,
				onPointerDownOutside,
				closeOnEscape
			};
			(typeof document !== "undefined" ? react.useLayoutEffect : react.useEffect)(() => {
				if (!open || typeof document === "undefined") {
					setZIndex(OVERLAY_BASE_Z[tier]);
					return;
				}
				const handle = registerOverlayLayer({
					id: layerId,
					tier,
					parentId,
					doc: document,
					containsNode: (node) => callbacksRef.current.containsNode?.(node) ?? false,
					onEscape: (event) => {
						if (!callbacksRef.current.closeOnEscape || !callbacksRef.current.onEscape) return false;
						return callbacksRef.current.onEscape(event);
					},
					onPointerDownOutside: callbacksRef.current.onPointerDownOutside ? (event) => callbacksRef.current.onPointerDownOutside?.(event) : void 0
				});
				setZIndex((prev) => prev === handle.zIndex ? prev : handle.zIndex);
				return () => {
					handle.dispose();
				};
			}, [
				open,
				tier,
				layerId,
				parentId
			]);
			return {
				layerId,
				zIndex
			};
		}
		//#endregion
		//#region ../packages/dsh-ui/src/InfoTip.tsx
		function findEnclosingBounds(btn) {
			if (typeof btn.closest !== "function") return null;
			const container = btn.closest(".hs-msurf, .dsh-modal, .modal-static, .live-dialog, .dsh-card, .spec-box");
			if (!container) return null;
			const rect = container.getBoundingClientRect();
			if (typeof rect?.left !== "number" || typeof rect?.right !== "number" || rect.right <= rect.left) return null;
			return rect;
		}
		function mergeRefs$1(...refs) {
			return (node) => {
				for (const ref of refs) {
					if (!ref) continue;
					if (typeof ref === "function") ref(node);
					else ref.current = node;
				}
			};
		}
		/**
		* 03 / 06 说明按钮与自适应说明气泡（InfoTip）：
		* - 凡独立 ⓘ 说明按钮均归口本原语（单行短提示与多行详情通用，width: max-content 最宽 300px）；
		* - 三态单向升级（关闭 / 悬停预览 / 点击锁定）：桌面端悬停 120ms 进入临时预览；预览态下点击原地升级为点击锁定而不关闭，仅已锁定时再次点击或经外部点击 / Esc / 滚动关闭；触屏与键盘（Enter / Space）直接锁定并阻断冒泡防误触整行；
		* - 接入统一 overlay-stack：在 Modal 内自动抬升 z-index，在 Popover 内点击气泡正文绝不误关父级 Popover，按 Esc 仅收起当前气泡。
		*/
		const InfoTip = (0, react.forwardRef)(function InfoTip({ content, label = "查看说明", size = "sm", delayMs = 120, maxWidth = 300, side, align, preventFocusSteal = false, portal = true, open: controlledOpen, defaultOpen = false, onOpenChange, className, popClassName, onPointerEnter, onPointerLeave, onMouseDown, onClick, onKeyDown, ...rest }, forwardedRef) {
			const tipId = (0, react.useId)();
			const btnRef = (0, react.useRef)(null);
			const popRef = (0, react.useRef)(null);
			const timerRef = (0, react.useRef)(void 0);
			const hoverPreviewRef = (0, react.useRef)(false);
			const [uncontrolledOpen, setUncontrolledOpen] = (0, react.useState)(defaultOpen);
			const isControlled = controlledOpen !== void 0;
			const isOpen = isControlled ? controlledOpen : uncontrolledOpen;
			const [place, setPlace] = (0, react.useState)(null);
			const computePlace = (0, react.useCallback)((bubble) => {
				const btn = btnRef.current;
				if (!btn || typeof window === "undefined") return null;
				const rect = btn.getBoundingClientRect();
				const vv = window.visualViewport;
				return placeInfoTip(rect, {
					width: vv?.width ?? window.innerWidth,
					height: window.innerHeight
				}, {
					maxWidth,
					side,
					align,
					topClearance: readFrameTopClearance(12),
					containerBounds: findEnclosingBounds(btn),
					bubbleWidth: bubble?.width,
					bubbleHeight: bubble?.height
				});
			}, [
				maxWidth,
				side,
				align
			]);
			const syncPlace = (0, react.useCallback)(() => {
				const pop = popRef.current;
				const bubble = pop ? {
					width: pop.offsetWidth,
					height: pop.offsetHeight
				} : void 0;
				const next = computePlace(bubble);
				if (!next) return;
				setPlace((prev) => prev && prev.left === next.left && prev.maxWidth === next.maxWidth && prev.top === next.top && prev.bottom === next.bottom && prev.side === next.side && prev.align === next.align && prev.origin === next.origin ? prev : next);
			}, [computePlace]);
			const closeTip = (0, react.useCallback)(() => {
				clearTimeout(timerRef.current);
				hoverPreviewRef.current = false;
				if (!isControlled) setUncontrolledOpen(false);
				onOpenChange?.(false);
			}, [isControlled, onOpenChange]);
			const openTip = (0, react.useCallback)((pinned) => {
				clearTimeout(timerRef.current);
				hoverPreviewRef.current = !pinned;
				const nextPlace = computePlace();
				if (nextPlace) setPlace(nextPlace);
				if (!isControlled) setUncontrolledOpen(true);
				onOpenChange?.(true);
			}, [
				computePlace,
				isControlled,
				onOpenChange
			]);
			const activateTrigger = (0, react.useCallback)(() => {
				clearTimeout(timerRef.current);
				if (!isOpen) {
					openTip(true);
					return;
				}
				if (hoverPreviewRef.current) {
					hoverPreviewRef.current = false;
					return;
				}
				closeTip();
			}, [
				closeTip,
				isOpen,
				openTip
			]);
			const { layerId, zIndex } = useOverlayLayer({
				open: isOpen,
				tier: "infotip",
				containsNode: (node) => Boolean(btnRef.current?.contains(node) || popRef.current?.contains(node)),
				onEscape: () => {
					closeTip();
				},
				onPointerDownOutside: () => {
					closeTip();
				}
			});
			(0, react.useEffect)(() => () => clearTimeout(timerRef.current), []);
			(typeof document !== "undefined" ? react.useLayoutEffect : react.useEffect)(() => {
				if (!isOpen) return void 0;
				syncPlace();
				if (typeof window === "undefined") return void 0;
				window.addEventListener("resize", syncPlace);
				const pop = popRef.current;
				let observer = null;
				if (typeof ResizeObserver !== "undefined" && pop) {
					observer = new ResizeObserver(syncPlace);
					observer.observe(pop);
				}
				return () => {
					observer?.disconnect();
					window.removeEventListener("resize", syncPlace);
				};
			}, [isOpen, syncPlace]);
			(0, react.useEffect)(() => {
				if (!isOpen) {
					hoverPreviewRef.current = false;
					clearTimeout(timerRef.current);
					setPlace((prev) => prev === null ? prev : null);
					return;
				}
				if (typeof window === "undefined") return void 0;
				const onScroll = (event) => {
					const target = event.target;
					if (target instanceof Node && popRef.current?.contains(target)) return;
					closeTip();
				};
				window.addEventListener("blur", closeTip);
				window.addEventListener("scroll", onScroll, true);
				return () => {
					window.removeEventListener("blur", closeTip);
					window.removeEventListener("scroll", onScroll, true);
				};
			}, [isOpen, closeTip]);
			if (content === void 0 || content === null || content === "") return null;
			const fallbackSide = side ?? "top";
			const fallbackAlign = align ?? "end";
			const resolvedPlace = place ?? {
				left: 0,
				maxWidth,
				...fallbackSide === "top" ? { bottom: 0 } : { top: 0 },
				side: fallbackSide,
				align: fallbackAlign,
				origin: `${fallbackAlign === "start" ? "left" : fallbackAlign === "end" ? "right" : "center"} ${fallbackSide === "top" ? "bottom" : "top"}`
			};
			const popStyle = {
				zIndex,
				left: resolvedPlace.left,
				maxWidth: resolvedPlace.maxWidth,
				top: resolvedPlace.top,
				bottom: resolvedPlace.bottom,
				...typeof window !== "undefined" && place === null ? { visibility: "hidden" } : {}
			};
			const popNode = isOpen ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(OverlayParentContext.Provider, {
				value: layerId,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MenuSurface, {
					ref: popRef,
					compact: true,
					panel: true,
					material: "translucent",
					id: tipId,
					role: "tooltip",
					"data-dsh-portal": "",
					origin: resolvedPlace.origin,
					"data-side": resolvedPlace.side,
					"data-align": resolvedPlace.align,
					"data-pop-anim": place !== null || typeof window === "undefined" ? "true" : void 0,
					className: `dsh-infotip-pop${popClassName ? ` ${popClassName}` : ""}`,
					style: popStyle,
					onPointerLeave: (event) => {
						if (!hoverPreviewRef.current) return;
						const related = event.relatedTarget;
						if (related instanceof Node && btnRef.current?.contains(related)) return;
						closeTip();
					},
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-infotip-body",
						children: content
					})
				})
			}) : null;
			const canPortal = portal && typeof document !== "undefined" && Boolean(document.body);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				...rest,
				ref: mergeRefs$1(btnRef, forwardedRef),
				type: "button",
				"aria-label": label,
				"aria-expanded": isOpen,
				"aria-describedby": isOpen ? tipId : void 0,
				className: `dsh-infotip-btn${size === "md" ? " dsh-infotip-btn-md" : ""}${className ? ` ${className}` : ""}`,
				onPointerEnter: (event) => {
					onPointerEnter?.(event);
					if (event.pointerType === "touch") return;
					clearTimeout(timerRef.current);
					if (isOpen) return;
					const openHover = () => {
						if (btnRef.current && btnRef.current.isConnected === false) return;
						openTip(false);
					};
					if (delayMs <= 0) openHover();
					else timerRef.current = setTimeout(openHover, delayMs);
				},
				onPointerLeave: (event) => {
					onPointerLeave?.(event);
					clearTimeout(timerRef.current);
					if (!isOpen || !hoverPreviewRef.current) return;
					const related = event.relatedTarget;
					if (related instanceof Node && popRef.current?.contains(related)) return;
					closeTip();
				},
				onMouseDown: (event) => {
					if (preventFocusSteal) {
						event.preventDefault();
						event.stopPropagation?.();
					}
					onMouseDown?.(event);
				},
				onClick: (event) => {
					event.stopPropagation?.();
					onClick?.(event);
					if (event.defaultPrevented) return;
					activateTrigger();
				},
				onKeyDown: (event) => {
					onKeyDown?.(event);
					if (event.defaultPrevented || isImeComposing(event)) return;
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();
						event.stopPropagation?.();
						activateTrigger();
					}
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(InfoIcon, {
					size: 14,
					inline: false
				})
			}), popNode !== null ? canPortal ? (0, react_dom.createPortal)(popNode, document.body) : popNode : null] });
		});
		const infoTipCss = `
.dsh-infotip-btn {
  all: unset;
  box-sizing: border-box;
  position: relative;
  flex: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  corner-shape: round;
  display: inline-grid;
  place-items: center;
  color: var(--dsw-alias-label-caption, var(--dsw-alias-label-tertiary));
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition:
    background var(--dsh-dur-hover, 120ms) ease,
    color var(--dsh-dur-hover, 120ms) ease,
    transform var(--dsh-dur-release, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-infotip-btn-md {
  width: var(--dsh-control-sm, 28px);
  height: var(--dsh-control-sm, 28px);
}
.dsh-infotip-btn::after {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  corner-shape: round;
}
@media (pointer: coarse) {
  .dsh-infotip-btn::after {
    inset: -4px;
  }
}
.dsh-infotip-btn:active {
  transform: scale(.93);
  transition-duration: var(--dsh-dur-press, 60ms);
  transition-timing-function: var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-infotip-btn:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: -2px;
}
.dsh-infotip-btn[aria-expanded="true"] {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
@media (hover: hover) {
  .dsh-infotip-btn:hover {
    background: var(--dsw-alias-interactive-bg-hover);
    color: var(--dsw-alias-label-primary);
  }
}
.hs-msurf.dsh-infotip-pop {
  position: fixed;
  z-index: 1150;
  box-sizing: border-box;
  width: max-content;
  max-width: min(300px, calc(100vw - 24px));
  overflow: visible;
  padding: 8px 10px;
  color: var(--dsw-alias-label-primary);
  font-size: var(--dsh-text-sm, 12px);
  line-height: 18px;
  pointer-events: auto;
}
.dsh-infotip-body {
  max-height: calc(40vh - 16px);
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
  white-space: pre-wrap;
  text-wrap: pretty;
  overflow-wrap: anywhere;
}
.dsh-infotip-body::-webkit-scrollbar {
  display: none;
}
`;
		//#endregion
		//#region ../packages/dsh-ui/src/containers.tsx
		function Card({ className, children, ...rest }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: `dsh-card${className ? ` ${className}` : ""}`,
				...rest,
				children
			});
		}
		function CardRow({ title, description, subtitle, action, info, infoLabel, stack = false, interactive = false, className, children, ...rest }) {
			const sub = description ?? subtitle;
			const cls = `dsh-card-row${stack ? " is-stack" : ""}${interactive ? " is-interactive" : ""}${className ? ` ${className}` : ""}`;
			const infoNode = info !== void 0 && info !== null && info !== "" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(InfoTip, {
				content: info,
				label: infoLabel
			}) : null;
			const titleNode = infoNode ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [title, infoNode] }) : title;
			if (stack) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: cls,
				...rest,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dsh-card-head-line",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-card-title",
							children: titleNode
						}), action !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-card-action",
							children: action
						})]
					}),
					sub !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-card-sub dsh-card-desc",
						children: sub
					}),
					children
				]
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: cls,
				...rest,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dsh-card-body",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-card-title",
							children: titleNode
						}),
						sub !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-card-sub dsh-card-desc",
							children: sub
						}),
						children
					]
				}), action !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dsh-card-action",
					children: action
				})]
			});
		}
		(0, react.forwardRef)(function SidebarList({ glide = true, className, children, ...rest }, forwardedRef) {
			const boxRef = (0, react.useRef)(null);
			useGlideHover(boxRef, glide, { itemSelector: ".hs-conv-row, .hs-phead-btn, .hs-list-row" });
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				"data-hs": "",
				...rest,
				ref: (node) => {
					boxRef.current = node;
					if (typeof forwardedRef === "function") forwardedRef(node);
					else if (forwardedRef) forwardedRef.current = node;
				},
				className: `hs-sidebar-box${className ? ` ${className}` : ""}`,
				children
			});
		});
		const containersCss = `
@keyframes dsh-spin {
  to { transform: rotate(360deg); }
}

.dsh-card {
  --dsh-row-inset: 14px;
  border-radius: var(--dsw-radius-md, 12px);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  border: .5px solid var(--dsw-alias-border-l2);
  background: var(--dsh-surface-card);
  overflow: hidden;
}
.dsh-card-row {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-sizing: border-box;
  min-height: var(--dsh-row-md, 44px);
  padding: 12px var(--dsh-row-inset, 14px);
  transition: background var(--dsh-dur-hover, 120ms) ease;
}
.dsh-card-row.is-stack {
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
}
.dsh-card-row.is-interactive { cursor: pointer; }
.dsh-fold { position: relative; }
.dsh-card-row + .dsh-card-row::before,
.dsh-card-row + .dsh-fold::before,
.dsh-fold + .dsh-card-row::before,
.dsh-fold + .dsh-fold::before {
  content: "";
  position: absolute;
  top: 0;
  left: var(--dsh-row-inset, 14px);
  right: var(--dsh-row-inset, 14px);
  border-top: .5px solid var(--dsw-alias-border-l1);
  pointer-events: none;
  transition: opacity var(--dsh-dur-hover, 120ms) ease;
}
.dsh-card-body { min-width: 0; flex: 1; }
.dsh-card-head-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.dsh-card-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--dsh-text-md, 13px);
  font-weight: 500;
  color: var(--dsw-alias-label-primary);
}
.dsh-card-sub,
.dsh-card-desc {
  margin-top: 2px;
  font-size: var(--dsh-text-sm, 12px);
  line-height: 1.45;
  color: var(--dsw-alias-label-secondary);
}
.dsh-card-action {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.dsh-fold-trigger {
  all: unset;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: var(--dsh-row-md, 44px);
  padding: 10px var(--dsh-row-inset, 14px);
  font-size: var(--dsh-text-sm, 12px);
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  user-select: none;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background var(--dsh-dur-hover, 120ms) ease, color var(--dsh-dur-hover, 120ms) ease;
}
.dsh-fold-trigger:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: -2px;
}
.dsh-fold-title-wrap {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.dsh-fold-right {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: none;
}
@media (hover: hover) {
  .dsh-card-row.is-interactive:hover {
    background: var(--dsw-alias-interactive-bg-hover);
  }
  .dsh-fold-trigger:not([aria-disabled="true"]):hover {
    background: var(--dsw-alias-interactive-bg-hover);
    color: var(--dsw-alias-label-primary);
  }
  .dsh-card-row.is-interactive:hover::before,
  .dsh-card-row.is-interactive:hover + .dsh-card-row::before,
  .dsh-card-row.is-interactive:hover + .dsh-fold::before,
  .dsh-fold:has(> .dsh-fold-trigger:not([aria-disabled="true"]):hover)::before,
  .dsh-fold:has(> .dsh-fold-trigger:not([aria-disabled="true"]):hover) + .dsh-card-row::before,
  .dsh-fold:has(> .dsh-fold-trigger:not([aria-disabled="true"]):hover) + .dsh-fold::before {
    opacity: 0;
  }
}
.dsh-card-row.is-interactive:active {
  background: var(--dsw-alias-interactive-bg-active);
}
.dsh-fold-trigger:not([aria-disabled="true"]):active {
  background: var(--dsw-alias-interactive-bg-active);
  color: var(--dsw-alias-label-primary);
}
.dsh-card-row.is-interactive:active::before,
.dsh-card-row.is-interactive:active + .dsh-card-row::before,
.dsh-card-row.is-interactive:active + .dsh-fold::before,
.dsh-fold:has(> .dsh-fold-trigger:not([aria-disabled="true"]):active)::before,
.dsh-fold:has(> .dsh-fold-trigger:not([aria-disabled="true"]):active) + .dsh-card-row::before,
.dsh-fold:has(> .dsh-fold-trigger:not([aria-disabled="true"]):active) + .dsh-fold::before {
  opacity: 0;
}
.dsh-fold-chev {
  display: inline-flex;
  transition: transform var(--dsh-dur-expand, 220ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
  font-size: var(--dsh-text-xs, 11px);
  color: var(--dsw-alias-label-tertiary);
}
.dsh-fold[data-open="true"] .dsh-fold-trigger,
.dsh-fold[data-streaming="true"] .dsh-fold-trigger {
  color: var(--dsw-alias-label-primary);
  font-weight: 500;
}
.dsh-fold[data-streaming="true"] .dsh-fold-trigger { cursor: default; }
.dsh-fold[data-open="true"] .dsh-fold-chev,
.dsh-fold[data-streaming="true"] .dsh-fold-chev {
  transform: rotate(90deg);
}
.dsh-fold-grid {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--dsh-dur-expand, 220ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-fold[data-open="true"] .dsh-fold-grid,
.dsh-fold[data-streaming="true"] .dsh-fold-grid {
  grid-template-rows: 1fr;
}
.dsh-fold-inner {
  min-height: 0;
  overflow: hidden;
}
.dsh-fold-body {
  border-top: .5px solid var(--dsw-alias-border-l1);
  background: var(--dsh-surface-sunken);
}

.hs-sidebar-box {
  position: relative;
  border-radius: var(--dsw-radius-md, 12px);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  padding: 10px 12px;
  background: var(--dsh-surface-canvas);
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.hs-sidebar-box[data-dsh-glide] {
  --dsh-glide-bg: var(--hs-hover, var(--dsw-alias-interactive-bg-hover));
}
.hs-sidebar-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.hs-ghead-wrap,
.hs-phead-wrap {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
}
.hs-ghead-btn,
.hs-phead-btn {
  all: unset;
  box-sizing: border-box;
  flex: 1;
  min-width: 0;
  height: var(--dsh-row-sm, 32px);
  padding: 0 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: var(--dsw-radius-sm, 8px);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background var(--dsh-dur-hover, 120ms) ease, color var(--dsh-dur-hover, 120ms) ease;
}
.hs-ghead-btn:focus-visible,
.hs-phead-btn:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: -2px;
}
.hs-ghead-btn {
  font-size: var(--dsh-text-sm, 12px);
  color: var(--dsw-alias-label-tertiary);
}
.hs-ghead-wrap:has(> .hs-ghead-acts) > .hs-ghead-btn {
  padding-right: 36px;
}
.hs-phead-btn {
  gap: 10px;
  font-size: var(--dsh-text-md, 13px);
  color: var(--dsw-alias-label-primary);
}
.hs-phead-btn:active { background: var(--hs-press, var(--dsw-alias-interactive-bg-active)); }
.hs-ghead-chev,
.hs-phead-chev {
  display: inline-flex;
  font-size: var(--dsh-text-xs, 11px);
  color: var(--dsw-alias-label-tertiary);
  transition: transform var(--dsh-dur-expand, 220ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1)), opacity var(--dsh-dur-hover, 120ms) ease, color var(--dsh-dur-hover, 120ms) ease;
}
.hs-phead-chev {
  opacity: 0;
  margin-left: -4px;
}
.hs-ghead-btn[aria-expanded="false"] .hs-ghead-chev,
.hs-phead-btn[aria-expanded="false"] .hs-phead-chev {
  transform: rotate(-90deg);
}
.hs-pslot {
  width: 18px;
  height: 18px;
  flex: none;
  display: grid;
  place-items: center;
}
.hs-pslot > * {
  grid-area: 1 / 1;
  display: inline-grid;
  place-items: center;
  transition: opacity var(--dsh-dur-hover, 120ms) ease;
}
.hs-pfolder-open,
.hs-pfolder-closed { color: var(--dsw-alias-label-secondary); }
.hs-phead-btn[aria-expanded="true"] .hs-pfolder-closed,
.hs-phead-btn[aria-expanded="false"] .hs-pfolder-open { display: none; }
.hs-pgrip { opacity: 0; color: var(--dsw-alias-label-tertiary); }
.hs-pmark {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  transition: opacity var(--dsh-dur-hover, 120ms) ease;
}
.hs-phead-btn[aria-expanded="true"] .hs-pmark { display: none; }
.hs-ghead-count {
  font-size: var(--dsh-text-sm, 12px);
  color: var(--dsw-alias-label-caption);
  font-variant-numeric: tabular-nums;
}
.hs-ghead-acts {
  position: absolute;
  right: 4px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--dsh-dur-hover, 120ms) ease;
}
.hs-pacts {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  gap: 15px;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--dsh-dur-hover, 120ms) ease;
}
.hs-ghead-wrap:focus-within .hs-ghead-acts,
.hs-phead-wrap:focus-within .hs-pacts { opacity: 1; pointer-events: auto; }
.hs-phead-wrap:has(> .hs-pacts):focus-within .hs-phead-btn { padding-right: 57px; }
.hs-phead-wrap:focus-within .hs-pfolder-open,
.hs-phead-wrap:focus-within .hs-pfolder-closed,
.hs-phead-wrap:focus-within .hs-pmark { opacity: 0; }
.hs-phead-wrap:focus-within .hs-pgrip,
.hs-phead-wrap:focus-within .hs-phead-chev { opacity: 1; }
.hs-group-rows[hidden] { display: none; }

.hs-conv-wrap,
.hs-list-wrap { position: relative; z-index: 1; }
.hs-conv-row {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-rows: 20px 16px;
  column-gap: 8px;
  row-gap: 2px;
  align-items: center;
  height: var(--dsh-row-lg, 48px);
  padding: 5px 6px;
  border: 1px solid transparent;
  border-radius: var(--dsw-radius-sm, 8px);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  font-weight: 400;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background var(--dsh-dur-hover, 120ms) ease;
}
.hs-conv-row:focus-visible,
.hs-list-row:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: -2px;
}
.hs-conv-row[aria-current="true"],
.hs-list-row[aria-current="true"] {
  background: var(--hs-sel, var(--dsw-alias-interactive-bg-active));
  font-weight: 400;
}
.hs-conv-row:active,
.hs-list-row:active {
  background: var(--hs-press, var(--dsw-alias-interactive-bg-active));
}
.hs-conv-title {
  grid-row: 1;
  grid-column: 1;
  font-size: var(--dsh-text-md, 13px);
  font-weight: 400;
  color: var(--dsw-alias-label-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.hs-conv-state {
  grid-row: 1;
  grid-column: 2;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: var(--dsh-text-sm, 12px);
  color: var(--dsw-alias-label-tertiary);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.hs-mark {
  width: 14px;
  height: 14px;
  flex: none;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.hs-mark.is-spin {
  color: var(--dsw-alias-state-business-primary);
  transform-origin: 50% 50%;
  animation: dsh-spin var(--dsh-dur-spin, 800ms) linear infinite;
}
.hs-mark .hs-spin-track { stroke: color-mix(in srgb, currentColor 22%, transparent); }
.hs-mark .hs-spin-arc { stroke-linecap: butt; }
.hs-mark.is-warn { color: var(--dsw-alias-state-warn-primary); }
.hs-mark.is-ok { color: var(--dsw-alias-state-success-primary); }
.hs-conv-sub {
  grid-row: 2;
  grid-column: 1 / -1;
  font-size: var(--dsh-text-sm, 12px);
  color: var(--dsw-alias-label-tertiary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.hs-sub-ico {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 3px;
  vertical-align: -1.5px;
}
.hs-conv-acts {
  position: absolute;
  right: 5px;
  top: 27px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--dsh-dur-hover, 120ms) ease;
}
.hs-list-wrap > .hs-conv-acts {
  top: 50%;
  transform: translateY(-50%);
}
.hs-conv-acts .hs-obtn svg {
  width: 12px;
  height: 12px;
}
.hs-obtn {
  all: unset;
  position: relative;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  display: inline-grid;
  place-items: center;
  border-radius: var(--dsw-radius-xs, 4px);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  font-size: var(--dsh-text-sm, 12px);
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
  transition: color var(--dsh-dur-hover, 120ms) ease;
}
.hs-obtn::after { content: ""; position: absolute; inset: -4px; }
.hs-obtn:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: 1px;
}
.hs-conv-wrap:focus-within .hs-conv-acts,
.hs-list-wrap:focus-within .hs-conv-acts { opacity: 1; pointer-events: auto; }
.hs-conv-wrap:has(> .hs-conv-acts):focus-within .hs-conv-sub { margin-right: 74px; }
.hs-conv-wrap:has(> .hs-conv-acts):focus-within:has(.hs-done) .hs-conv-sub { margin-right: 95px; }
.hs-list-wrap:has(> .hs-conv-acts):focus-within .hs-conv-state { display: none; }
.hs-list-wrap:has(> .hs-conv-acts):focus-within .hs-list-title { margin-right: 66px; }
.hs-list-row {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: var(--dsh-row-sm, 32px);
  padding: 0 6px;
  border: 1px solid transparent;
  border-radius: var(--dsw-radius-sm, 8px);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  font-size: var(--dsh-text-md, 13px);
  font-weight: 400;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background var(--dsh-dur-hover, 120ms) ease;
}
.hs-list-row.is-in-proj { padding-left: 18px; }
.hs-list-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.hs-row-num-read {
  font-size: var(--dsh-text-2xs, 10px);
  color: var(--dsw-alias-label-caption);
  font-variant-numeric: tabular-nums;
}
.hs-row-meta {
  font-size: var(--dsh-text-xs, 11px);
  color: var(--dsw-alias-label-tertiary);
  font-variant-numeric: tabular-nums;
}
@media (hover: hover) {
  .hs-ghead-btn:hover,
  .hs-ghead-btn:hover .hs-ghead-chev { color: var(--dsw-alias-label-primary); }
  .hs-ghead-wrap:hover .hs-ghead-acts,
  .hs-phead-wrap:hover .hs-pacts { opacity: 1; pointer-events: auto; }
  .hs-phead-btn:hover { background: var(--hs-hover, var(--dsw-alias-interactive-bg-hover)); }
  .hs-sidebar-box[data-dsh-glide] .hs-phead-btn:not(:active):hover { background: transparent; }
  .hs-phead-wrap:has(> .hs-pacts):hover .hs-phead-btn { padding-right: 57px; }
  .hs-phead-wrap:hover .hs-pfolder-open,
  .hs-phead-wrap:hover .hs-pfolder-closed,
  .hs-phead-wrap:hover .hs-pmark { opacity: 0; }
  .hs-phead-wrap:hover .hs-pgrip,
  .hs-phead-wrap:hover .hs-phead-chev { opacity: 1; }
  .hs-conv-row:not([aria-current="true"]):hover,
  .hs-list-row:not([aria-current="true"]):hover {
    background: var(--hs-hover, var(--dsw-alias-interactive-bg-hover));
  }
  .hs-sidebar-box[data-dsh-glide] .hs-conv-row:not([aria-current="true"]):not(:active):hover,
  .hs-sidebar-box[data-dsh-glide] .hs-list-row:not([aria-current="true"]):not(:active):hover {
    background: transparent;
  }
  .hs-conv-wrap:hover .hs-conv-acts,
  .hs-list-wrap:hover .hs-conv-acts { opacity: 1; pointer-events: auto; }
  .hs-conv-wrap:has(> .hs-conv-acts):hover .hs-conv-sub { margin-right: 74px; }
  .hs-conv-wrap:has(> .hs-conv-acts):hover:has(.hs-done) .hs-conv-sub { margin-right: 95px; }
  .hs-list-wrap:has(> .hs-conv-acts):hover .hs-conv-state { display: none; }
  .hs-list-wrap:has(> .hs-conv-acts):hover .hs-list-title { margin-right: 66px; }
  .hs-obtn:hover { color: var(--dsw-alias-label-primary); }
}
@media (hover: none) {
  .hs-ghead-acts,
  .hs-pacts { opacity: 1; pointer-events: auto; }
  .hs-phead-wrap:has(> .hs-pacts) .hs-phead-btn { padding-right: 57px; }
  .hs-conv-wrap:has([aria-current="true"]) .hs-conv-acts,
  .hs-list-wrap:has([aria-current="true"]) .hs-conv-acts { opacity: 1; pointer-events: auto; }
  .hs-conv-wrap:has(> .hs-conv-acts):has([aria-current="true"]) .hs-conv-sub { margin-right: 74px; }
  .hs-conv-wrap:has(> .hs-conv-acts):has([aria-current="true"]):has(.hs-done) .hs-conv-sub { margin-right: 95px; }
  .hs-list-wrap:has(> .hs-conv-acts):has([aria-current="true"]) .hs-conv-state { display: none; }
  .hs-list-wrap:has(> .hs-conv-acts):has([aria-current="true"]) .hs-list-title { margin-right: 66px; }
}
@media (forced-colors: active) {
  .hs-conv-row[aria-current="true"],
  .hs-list-row[aria-current="true"] {
    border-color: Highlight;
  }
}
`;
		(0, react.forwardRef)(function Input({ size = "md", invalid = false, onEnter, onKeyDown, className, ...rest }, ref) {
			const sizeClass = size === "lg" ? " dsh-input-lg" : size === "dialog" ? " dsh-input-dialog" : "";
			const errorClass = invalid ? " is-error dsh-input-error" : "";
			const handleKeyDown = (event) => {
				onKeyDown?.(event);
				if (event.defaultPrevented) return;
				if (event.key === "Enter" && onEnter && !isImeComposing(event)) onEnter(event.currentTarget.value, event);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
				ref,
				"aria-invalid": invalid || rest["aria-invalid"] || void 0,
				onKeyDown: onEnter || onKeyDown ? handleKeyDown : void 0,
				className: `dsh-input${sizeClass}${errorClass}${className ? ` ${className}` : ""}`,
				...rest
			});
		});
		(0, react.forwardRef)(function SearchInput({ value, onChange, clearLabel = "清空搜索", leadingIcon, onEnter, onKeyDown, disabled, className, ...rest }, ref) {
			const localRef = (0, react.useRef)(null);
			const resolvedIcon = leadingIcon === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SearchIcon, {
				size: 14,
				inline: false
			}) : leadingIcon;
			const handleKeyDown = (event) => {
				onKeyDown?.(event);
				if (event.defaultPrevented) return;
				if (event.key === "Enter" && onEnter && !isImeComposing(event)) onEnter(value, event);
			};
			const handleBoxMouseDown = (event) => {
				if (disabled) return;
				const target = event.target;
				if (target instanceof Element && target.closest("input, button")) return;
				event.preventDefault();
				localRef.current?.focus?.();
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: `dsh-search${disabled ? " is-disabled" : ""}${className ? ` ${className}` : ""}`,
				onMouseDown: handleBoxMouseDown,
				children: [
					resolvedIcon !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dsh-search-ico",
						"aria-hidden": "true",
						children: resolvedIcon
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						ref: (node) => {
							localRef.current = node;
							if (typeof ref === "function") ref(node);
							else if (ref) ref.current = node;
						},
						type: "text",
						value,
						disabled,
						onChange: (event) => onChange(event.target.value),
						onKeyDown: onEnter || onKeyDown ? handleKeyDown : void 0,
						...rest
					}),
					value.length > 0 && !disabled && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: "dsh-search-clear",
						"aria-label": clearLabel,
						onClick: () => {
							onChange("");
							localRef.current?.focus?.();
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CloseIcon, {
							size: 12,
							inline: false
						})
					})
				]
			});
		});
		(0, react.forwardRef)(function PasswordInput({ invalid = false, visible, defaultVisible = false, onVisibleChange, revealLabel = "显示密钥", hideLabel = "隐藏密钥", trailingAction, onEnter, onKeyDown, disabled, className, ...rest }, ref) {
			const localRef = (0, react.useRef)(null);
			const [uncontrolledVisible, setUncontrolledVisible] = (0, react.useState)(defaultVisible);
			const isShown = visible !== void 0 ? visible : uncontrolledVisible;
			const toggleVisible = () => {
				if (disabled) return;
				const next = !isShown;
				if (visible === void 0) setUncontrolledVisible(next);
				onVisibleChange?.(next);
			};
			const handleKeyDown = (event) => {
				onKeyDown?.(event);
				if (event.defaultPrevented) return;
				if (event.key === "Enter" && onEnter && !isImeComposing(event)) onEnter(event.currentTarget.value, event);
			};
			const handleBoxMouseDown = (event) => {
				if (disabled) return;
				const target = event.target;
				if (target instanceof Element && target.closest("input, button")) return;
				event.preventDefault();
				localRef.current?.focus?.();
			};
			const boxNode = /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: `dsh-pwd-box${invalid ? " is-error" : ""}${disabled ? " is-disabled" : ""}${trailingAction === void 0 && className ? ` ${className}` : ""}`,
				onMouseDown: handleBoxMouseDown,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
					ref: (node) => {
						localRef.current = node;
						if (typeof ref === "function") ref(node);
						else if (ref) ref.current = node;
					},
					type: isShown ? "text" : "password",
					disabled,
					"aria-invalid": invalid || rest["aria-invalid"] || void 0,
					onKeyDown: onEnter || onKeyDown ? handleKeyDown : void 0,
					...rest
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: "dsh-pwd-eye",
					disabled,
					"aria-label": isShown ? hideLabel : revealLabel,
					"aria-pressed": isShown,
					onClick: toggleVisible,
					children: isShown ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(EyeOffIcon, {
						size: 15,
						inline: false
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(EyeIcon, {
						size: 15,
						inline: false
					})
				})]
			});
			if (trailingAction === void 0) return boxNode;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: `dsh-pwd-wrap${className ? ` ${className}` : ""}`,
				children: [boxNode, trailingAction]
			});
		});
		(0, react.forwardRef)(function Textarea({ invalid = false, code = false, className, ...rest }, ref) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
				ref,
				"aria-invalid": invalid || rest["aria-invalid"] || void 0,
				className: `dsh-textarea${code ? " is-code" : ""}${invalid ? " is-error" : ""}${className ? ` ${className}` : ""}`,
				...rest
			});
		});
		const inputsCss = `
.dsh-input {
  box-sizing: border-box;
  width: 100%;
  height: var(--dsh-control-md, 36px);
  padding: 0 14px;
  border-radius: 999px;
  corner-shape: round;
  border: .5px solid var(--dsw-alias-border-l3);
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: var(--dsh-text-md, 13px);
  outline: none;
}
.dsh-input::placeholder { color: var(--dsw-alias-label-caption); }
.dsh-input:disabled { opacity: .5; cursor: not-allowed; }
.dsh-input:focus-visible {
  border-color: transparent;
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: -1px;
}
.dsh-input[aria-invalid="true"],
.dsh-input.is-error,
.dsh-input-error {
  border-color: var(--dsw-alias-state-error-primary);
}
.dsh-input[aria-invalid="true"]:focus-visible,
.dsh-input.is-error:focus-visible,
.dsh-input-error:focus-visible {
  border-color: transparent;
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsw-alias-state-error-primary);
  outline-offset: -1px;
}
.dsh-field-err {
  font-size: var(--dsh-text-sm, 12px);
  line-height: 1.4;
  color: var(--dsh-state-err-text, var(--dsw-alias-state-error-primary));
  padding-left: 4px;
}
.dsh-input-dialog {
  height: var(--dsh-control-md, 36px);
  padding: 0 14px;
  border-radius: 999px;
  corner-shape: round;
}
.dsh-input-lg {
  height: var(--dsh-control-lg, 44px);
  padding: 0 18px;
  border-radius: 999px;
  corner-shape: round;
  font-size: var(--dsh-text-lg, 14px);
}

.dsh-search {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 8px;
  height: var(--dsh-control-md, 36px);
  padding: 0 8px 0 14px;
  border-radius: 999px;
  corner-shape: round;
  background: var(--dsw-alias-bg-base);
  border: .5px solid var(--dsw-alias-border-l3);
  cursor: text;
}
.dsh-search.is-disabled { opacity: .5; cursor: not-allowed; }
.dsh-search:has(> input:focus-visible) {
  border-color: transparent;
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: -1px;
}
.dsh-search-ico {
  display: inline-grid;
  place-items: center;
  flex: none;
  color: var(--dsw-alias-label-tertiary);
  font-size: var(--dsh-text-md, 13px);
}
.dsh-search input {
  all: unset;
  flex: 1;
  min-width: 0;
  align-self: stretch;
  height: 100%;
  font-size: var(--dsh-text-md, 13px);
  color: var(--dsw-alias-label-primary);
}
.dsh-search input::placeholder { color: var(--dsw-alias-label-tertiary); }
.dsh-search-clear {
  all: unset;
  position: relative;
  width: var(--dsh-control-xs, 20px);
  height: var(--dsh-control-xs, 20px);
  border-radius: 50%;
  corner-shape: round;
  display: grid;
  place-items: center;
  flex: none;
  font-size: var(--dsh-text-xs, 11px);
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background var(--dsh-dur-hover, 120ms) ease, color var(--dsh-dur-hover, 120ms) ease, transform var(--dsh-dur-release, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-search-clear::after {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  corner-shape: round;
}
@media (pointer: coarse) {
  .dsh-search-clear::after { inset: -8px; }
}
.dsh-search-clear:active {
  transform: scale(.94);
  transition-duration: var(--dsh-dur-press, 60ms);
  transition-timing-function: var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-search-clear:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: -2px;
}
@media (hover: hover) {
  .dsh-search-clear:hover {
    background: var(--dsw-alias-interactive-bg-hover);
    color: var(--dsw-alias-label-primary);
  }
}

.dsh-pwd-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dsh-pwd-box {
  box-sizing: border-box;
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  height: var(--dsh-control-md, 36px);
  padding: 0 4px 0 14px;
  border-radius: 999px;
  corner-shape: round;
  border: .5px solid var(--dsw-alias-border-l3);
  background: var(--dsw-alias-bg-base);
  cursor: text;
}
.dsh-pwd-box.is-disabled { opacity: .5; cursor: not-allowed; }
.dsh-pwd-box.is-error { border-color: var(--dsw-alias-state-error-primary); }
.dsh-pwd-box:has(> input:focus-visible) {
  border-color: transparent;
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: -1px;
}
.dsh-pwd-box.is-error:has(> input:focus-visible) {
  border-color: transparent;
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsw-alias-state-error-primary);
  outline-offset: -1px;
}
.dsh-pwd-box input {
  all: unset;
  flex: 1;
  min-width: 0;
  align-self: stretch;
  height: 100%;
  font-family: var(--ds-font-family-code);
  font-size: var(--dsh-text-sm, 12px);
  color: var(--dsw-alias-label-primary);
}
.dsh-pwd-box input::placeholder { color: var(--dsw-alias-label-caption); }
.dsh-pwd-eye {
  all: unset;
  box-sizing: border-box;
  width: var(--dsh-control-sm, 28px);
  height: var(--dsh-control-sm, 28px);
  border-radius: 50%;
  corner-shape: round;
  display: grid;
  place-items: center;
  flex: none;
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background var(--dsh-dur-hover, 120ms) ease, color var(--dsh-dur-hover, 120ms) ease, transform var(--dsh-dur-release, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-pwd-eye:disabled { cursor: not-allowed; }
.dsh-pwd-eye:active:not(:disabled) {
  transform: scale(.95);
  transition-duration: var(--dsh-dur-press, 60ms);
  transition-timing-function: var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-pwd-eye:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: -2px;
}
@media (hover: hover) {
  .dsh-pwd-eye:hover:not(:disabled) {
    background: var(--dsw-alias-interactive-bg-hover);
    color: var(--dsw-alias-label-primary);
  }
}

.dsh-select-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 100%;
  min-width: 0;
}
.dsh-select-wrap.is-open { z-index: 45; }
.dsh-select-wrap[data-enhanced="true"] > select {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  opacity: 0;
  pointer-events: none;
  overflow: hidden;
  clip: rect(0 0 0 0);
  border: 0;
}
.dsh-select-wrap[data-enhanced="true"] > svg {
  display: none;
}
.dsh-select {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  min-width: 0;
  height: var(--dsh-control-md, 36px);
  padding: 0 11px 0 14px;
  border-radius: 999px;
  corner-shape: round;
  border: .5px solid var(--dsw-alias-border-l3);
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: var(--dsh-text-md, 13px);
  text-align: left;
  cursor: pointer;
  outline: none;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: border-color var(--dsh-dur-hover, 120ms) ease, transform var(--dsh-dur-release, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-select-sm {
  height: var(--dsh-control-sm, 28px);
  font-size: var(--dsh-text-sm, 12px);
  padding: 0 10px 0 12px;
  gap: 6px;
  border-radius: 999px;
  corner-shape: round;
}
.dsh-select.is-error,
.dsh-select[aria-invalid="true"] {
  border-color: var(--dsw-alias-state-error-primary);
}
.dsh-select-ico {
  width: 15px;
  height: 15px;
  flex: none;
  display: inline-grid;
  place-items: center;
  color: var(--dsw-alias-label-secondary);
}
.dsh-select-val {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-select-val.is-placeholder { color: var(--dsw-alias-label-caption); }
.dsh-select-desc {
  flex: 0 1 auto;
  min-width: 0;
  max-width: 48%;
  font-family: inherit;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-select-empty {
  padding: 10px 8px;
  text-align: center;
  font-size: var(--dsh-text-sm, 12px);
  color: var(--dsw-alias-label-tertiary);
}
@media (hover: hover) {
  .dsh-select:hover:not(:disabled) { border-color: var(--dsw-alias-border-l4); }
}
.dsh-select[aria-expanded="true"] { border-color: var(--dsw-alias-border-l4); }
.dsh-select:not(:disabled):active {
  transform: scale(.99);
  transition-duration: var(--dsh-dur-press, 60ms);
  transition-timing-function: var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-select:focus-visible {
  border-color: transparent;
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: -1px;
}
.dsh-select.is-error:focus-visible,
.dsh-select[aria-invalid="true"]:focus-visible {
  border-color: transparent;
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsw-alias-state-error-primary);
  outline-offset: -1px;
}
.dsh-select:disabled { opacity: .45; cursor: not-allowed; }
.dsh-select-arrow {
  flex: none;
  color: var(--dsw-alias-label-tertiary);
  transition: transform var(--dsh-dur-expand, 220ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1)), color var(--dsh-dur-hover, 120ms) ease;
}
.dsh-select[aria-expanded="true"] .dsh-select-arrow {
  transform: rotate(180deg);
  color: var(--dsw-alias-label-primary);
}
/* 保持玻璃宿主 overflow: visible 以免触发 Backdrop Root 或 superellipse + overflow 裁切通道，滚动裁切由内层 .dsh-select-list 承载 */
.hs-msurf.dsh-select-portal-menu {
  max-height: 240px;
  overflow: visible;
}
.dsh-select-scroll {
  flex: 1 1 auto;
  min-height: 0;
}
.dsh-select-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  max-height: 232px;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
}
.dsh-select-list::-webkit-scrollbar { display: none; }
.hs-msurf.dsh-select-menu {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  min-width: 156px;
  max-height: 240px;
  overflow: visible;
  z-index: 46;
  visibility: hidden;
  pointer-events: none;
  transform-origin: var(--dsh-pop-origin, top center);
}
.hs-msurf.dsh-select-menu[data-side="top"] {
  top: auto;
  bottom: calc(100% + 5px);
  transform-origin: var(--dsh-pop-origin, bottom center);
}
.dsh-select-wrap.is-open > .hs-msurf.dsh-select-menu {
  visibility: visible;
  pointer-events: auto;
}

.dsh-textarea {
  box-sizing: border-box;
  width: 100%;
  min-height: 76px;
  padding: 10px 14px;
  border-radius: var(--dsw-radius-md, 12px);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  border: .5px solid var(--dsw-alias-border-l3);
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: var(--dsh-text-md, 13px);
  line-height: 1.5;
  resize: vertical;
  outline: none;
}
.dsh-textarea::placeholder { color: var(--dsw-alias-label-caption); }
.dsh-textarea:disabled { opacity: .5; cursor: not-allowed; }
.dsh-textarea.is-code {
  font-family: var(--ds-font-family-code);
  font-size: var(--dsh-text-sm, 12px);
}
.dsh-textarea.is-error,
.dsh-textarea[aria-invalid="true"] {
  border-color: var(--dsw-alias-state-error-primary);
}
.dsh-textarea:focus-visible {
  border-color: transparent;
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: -1px;
}
.dsh-textarea.is-error:focus-visible,
.dsh-textarea[aria-invalid="true"]:focus-visible {
  border-color: transparent;
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsw-alias-state-error-primary);
  outline-offset: -1px;
}

@media (pointer: coarse) and (max-width: 768px) {
  .dsh-input,
  .dsh-search input,
  .dsh-pwd-box input,
  .dsh-textarea,
  .comp-textarea {
    font-size: var(--dsh-text-xl, 16px);
  }
}
`;
		//#endregion
		//#region ../packages/dsh-ui/src/navigation.tsx
		const navigationCss = `
.dsh-seg {
  box-sizing: border-box;
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 2px;
  gap: 2px;
  border-radius: 999px;
  corner-shape: round;
  background: var(--dsh-surface-sunken);
}
.dsh-seg::-webkit-scrollbar { display: none; }
.dsh-seg button,
.dsh-seg-item {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  height: calc(var(--dsh-control-sm, 28px) - 4px);
  padding: 0 12px;
  border: 1px solid transparent;
  border-radius: 999px;
  corner-shape: round;
  font-size: var(--dsh-text-sm, 12px);
  font-weight: 400;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background var(--dsh-dur-hover, 120ms) ease, color var(--dsh-dur-hover, 120ms) ease;
}
.dsh-seg button:disabled,
.dsh-seg-item:disabled { opacity: .45; cursor: not-allowed; }
.dsh-seg button:focus-visible,
.dsh-seg-item:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: -2px;
}
@media (hover: hover) {
  .dsh-seg button:hover:not(:disabled),
  .dsh-seg-item:hover:not(:disabled) {
    color: var(--dsw-alias-label-primary);
  }
}
.dsh-seg button:is([aria-selected="true"], [aria-pressed="true"], [aria-current="page"]),
.dsh-seg-item:is([aria-selected="true"], [aria-pressed="true"], [aria-current="page"]),
.dsh-seg-ind {
  background: var(--dsh-surface-floating);
  box-shadow: 0 1px 2px rgb(0 0 0 / .08);
}
.dsh-seg button:is([aria-selected="true"], [aria-pressed="true"], [aria-current="page"]),
.dsh-seg-item:is([aria-selected="true"], [aria-pressed="true"], [aria-current="page"]) {
  color: var(--dsw-alias-label-primary);
}
.dsh-seg[data-ind] button:is([aria-selected="true"], [aria-pressed="true"], [aria-current="page"]),
.dsh-seg[data-ind] .dsh-seg-item:is([aria-selected="true"], [aria-pressed="true"], [aria-current="page"]) {
  background: transparent;
  box-shadow: none;
}
.dsh-seg-ind {
  box-sizing: border-box;
  position: absolute;
  z-index: -1;
  top: 2px;
  left: 0;
  height: calc(var(--dsh-control-sm, 28px) - 4px);
  border: 1px solid transparent;
  border-radius: 999px;
  corner-shape: round;
  pointer-events: none;
  width: var(--ind-w, 0);
  transform: translateX(var(--ind-x, 0));
  transition: transform var(--dsh-dur-expand, 220ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1)), width var(--dsh-dur-expand, 220ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-seg-ind[data-instant] { transition: none; }

.dsh-utabs {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 0;
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  gap: 18px;
  padding: 0;
}
.dsh-utabs::-webkit-scrollbar { display: none; }
.dsh-utab {
  all: unset;
  box-sizing: border-box;
  flex: none;
  white-space: nowrap;
  height: var(--dsh-control-md, 36px);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-bottom: 2px solid transparent;
  font-size: var(--dsh-text-md, 13px);
  font-weight: 500;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: color var(--dsh-dur-hover, 120ms) ease, border-color var(--dsh-dur-hover, 120ms) ease;
}
.dsh-utab:disabled { opacity: .45; cursor: not-allowed; }
.dsh-utab:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: -2px;
}
@media (hover: hover) {
  .dsh-utab:hover:not(:disabled) { color: var(--dsw-alias-label-primary); }
}
.dsh-utab:is([aria-selected="true"], [aria-current="page"]) {
  color: var(--dsw-alias-label-primary);
  border-bottom-color: var(--dsh-brand-fill, var(--dsw-alias-brand-primary));
}
.dsh-utabs[data-ind] .dsh-utab:is([aria-selected="true"], [aria-current="page"]) {
  border-bottom-color: transparent;
}
.dsh-utabs-ind {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  border-radius: 999px;
  corner-shape: round;
  background: var(--dsh-brand-fill, var(--dsw-alias-brand-primary));
  pointer-events: none;
  width: var(--ind-w, 0);
  transform: translateX(var(--ind-x, 0));
  transition: transform var(--dsh-dur-expand, 220ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1)), width var(--dsh-dur-expand, 220ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-utabs-ind[data-instant] { transition: none; }
.dsh-utabs-borderless {
  border-bottom: none;
  padding: 0;
  gap: 22px;
}
.dsh-utabs-borderless .dsh-utab {
  margin-bottom: 0;
  padding: 0 2px;
  font-size: var(--dsh-text-lg, 14px);
}
.dsh-utabs-borderless .dsh-utabs-ind {
  bottom: 0;
  border-radius: 999px;
  corner-shape: round;
}
.dsh-utab-pane[hidden] { display: none; }

@media (forced-colors: active) {
  .dsh-seg {
    border: 1px solid ButtonText;
  }
  .dsh-seg button:is([aria-selected="true"], [aria-pressed="true"], [aria-current="page"]),
  .dsh-seg-item:is([aria-selected="true"], [aria-pressed="true"], [aria-current="page"]),
  .dsh-seg-ind {
    border-color: Highlight;
  }
  .dsh-utab:is([aria-selected="true"], [aria-current="page"]),
  .dsh-utabs-ind {
    background: Highlight;
    border-bottom-color: Highlight;
  }
}
`;
		(0, react.forwardRef)(function IconButton({ size, shape = "round", variant, tip, className, children, ...rest }, ref) {
			const resolvedSize = size ?? (shape === "xs" ? "xs" : "sm");
			const resolvedVariant = variant ?? (shape === "sm" && size === void 0 ? "outline" : "ghost");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				ref,
				type: "button",
				"data-hs-tip": tip,
				className: `dsh-ibtn ${resolvedSize === "md" ? "dsh-ibtn-md icon-btn-md" : resolvedSize === "xs" ? "dsh-ibtn-xs icon-btn-xs" : `dsh-ibtn-round icon-btn-round${shape === "sm" ? " dsh-ibtn-sm" : ""}`}${resolvedVariant === "outline" ? " icon-btn-outline" : resolvedVariant === "danger-solid" ? " icon-btn-danger-solid" : resolvedVariant === "danger-ghost" ? " icon-btn-danger-ghost" : ""}${className ? ` ${className}` : ""}`,
				...rest,
				children
			});
		});
		const iconButtonCss = `
.dsh-ibtn,
.icon-btn-md,
.icon-btn-round,
.icon-btn-xs {
  all: unset;
  position: relative;
  box-sizing: border-box;
  border-radius: 50%;
  corner-shape: round;
  display: inline-grid;
  place-items: center;
  flex: none;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background var(--dsh-dur-hover, 120ms) ease, color var(--dsh-dur-hover, 120ms) ease, transform var(--dsh-dur-release, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-ibtn[hidden],
.icon-btn-md[hidden],
.icon-btn-round[hidden],
.icon-btn-xs[hidden] {
  display: none;
}
.dsh-ibtn:disabled,
.icon-btn-md:disabled,
.icon-btn-round:disabled,
.icon-btn-xs:disabled {
  opacity: .4;
  cursor: not-allowed;
}
.dsh-ibtn:focus-visible,
.icon-btn-md:focus-visible,
.icon-btn-round:focus-visible,
.icon-btn-xs:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: 2px;
}
.dsh-ibtn-md,
.icon-btn-md {
  width: var(--dsh-control-md, 36px);
  height: var(--dsh-control-md, 36px);
  font-size: var(--dsh-text-xl, 16px);
}
.dsh-ibtn-round,
.dsh-ibtn-sm,
.icon-btn-round {
  width: var(--dsh-control-sm, 28px);
  height: var(--dsh-control-sm, 28px);
  font-size: var(--dsh-text-lg, 14px);
}
.dsh-ibtn-xs,
.icon-btn-xs {
  width: var(--dsh-control-xs, 20px);
  height: var(--dsh-control-xs, 20px);
  font-size: var(--dsh-text-sm, 12px);
  color: var(--dsw-alias-label-tertiary);
}
.dsh-ibtn-xs::after,
.icon-btn-xs::after {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  corner-shape: round;
}
@media (pointer: coarse) {
  .dsh-ibtn-round::after,
  .icon-btn-round::after {
    content: "";
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    corner-shape: round;
  }
  .dsh-ibtn-xs::after,
  .icon-btn-xs::after {
    inset: -8px;
  }
}
.hs-ghead-acts .dsh-ibtn-xs::after,
.hs-ghead-acts .icon-btn-xs::after,
.hs-conv-acts .dsh-ibtn-xs::after,
.hs-conv-acts .icon-btn-xs::after {
  inset: -2px;
}
.icon-btn-outline {
  border: 1px solid color-mix(in srgb, var(--dsw-alias-border-l3) 45%, var(--dsw-alias-border-l4));
}
.icon-btn-danger-ghost {
  color: var(--dsw-alias-state-error-primary);
}
.icon-btn-danger-solid {
  border: 1px solid transparent;
  background-clip: padding-box;
  background-color: var(--dsh-danger-solid-bg, var(--dsw-alias-state-error-primary));
  color: var(--dsh-solid-on-color, var(--dsw-alias-label-primary-foreground));
}
@media (hover: hover) {
  .dsh-ibtn:not(.icon-btn-danger-solid):not(.icon-btn-danger-ghost):hover:not(:disabled),
  .icon-btn-md:not(.icon-btn-danger-solid):not(.icon-btn-danger-ghost):hover:not(:disabled),
  .icon-btn-round:not(.icon-btn-danger-solid):not(.icon-btn-danger-ghost):hover:not(:disabled),
  .icon-btn-xs:not(.icon-btn-danger-solid):not(.icon-btn-danger-ghost):hover:not(:disabled) {
    background: var(--dsw-alias-interactive-bg-hover);
    color: var(--dsw-alias-label-primary);
  }
  .icon-btn-danger-ghost:hover:not(:disabled) {
    background: var(--dsw-alias-interactive-bg-hover-danger);
    color: var(--dsw-alias-state-error-primary);
  }
  .icon-btn-outline:hover:not(:disabled) {
    border-color: var(--dsw-alias-border-l4);
  }
  .icon-btn-danger-solid:hover:not(:disabled) {
    background-color: var(--dsh-danger-solid-hover, var(--dsh-danger-solid-bg));
  }
}
.dsh-ibtn:not(.icon-btn-danger-solid):not(.icon-btn-danger-ghost):active:not(:disabled),
.icon-btn-md:not(.icon-btn-danger-solid):not(.icon-btn-danger-ghost):active:not(:disabled),
.icon-btn-round:not(.icon-btn-danger-solid):not(.icon-btn-danger-ghost):active:not(:disabled),
.icon-btn-xs:not(.icon-btn-danger-solid):not(.icon-btn-danger-ghost):active:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-active);
  transform: scale(.96);
  transition-duration: var(--dsh-dur-press, 60ms);
  transition-timing-function: var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.icon-btn-danger-ghost:active:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover-danger);
  transform: scale(.96);
  transition-duration: var(--dsh-dur-press, 60ms);
  transition-timing-function: var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.icon-btn-danger-solid:active:not(:disabled) {
  transform: scale(.96);
  transition-duration: var(--dsh-dur-press, 60ms);
  transition-timing-function: var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
`;
		const controlsCss = [
			iconButtonCss,
			inputsCss,
			choicesCss,
			navigationCss,
			containersCss,
			scrollAreaCss
		].join("\n");
		//#endregion
		//#region ../packages/dsh-ui/src/feedback.tsx
		const feedbackCss = `
@keyframes dsh-spin {
  to { transform: rotate(360deg); }
}

/* StateDot */
.dsh-sdot-wrap {
  display: inline-flex;
  align-items: center;
}
.dsh-sdot-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--dsh-text-sm, 12px);
  color: var(--dsw-alias-label-secondary);
}
.dsh-sdot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  corner-shape: round;
  flex: none;
  background: var(--dsw-alias-label-caption);
}
.dsh-sdot.is-ok { background: var(--dsw-alias-state-success-primary); }
.dsh-sdot.is-warn { background: var(--dsw-alias-state-warn-primary); }
.dsh-sdot.is-err { background: var(--dsw-alias-state-error-primary); }
.dsh-sdot.is-pulse {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-label-caption) 24%, transparent);
}
.dsh-sdot.is-ok.is-pulse {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-success-primary) 24%, transparent);
}
.dsh-sdot.is-warn.is-pulse {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-warn-primary) 24%, transparent);
}
.dsh-sdot.is-err.is-pulse {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-error-primary) 24%, transparent);
}
.dsh-sdot-spin {
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border-radius: 50%;
  corner-shape: round;
  border: 1.5px solid var(--dsw-alias-state-business-primary);
  border-right-color: color-mix(in srgb, var(--dsw-alias-state-business-primary) 22%, transparent);
  animation: dsh-spin var(--dsh-dur-spin, 800ms) linear infinite;
  flex: none;
}
.dsh-sdot-step {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  corner-shape: round;
  background: var(--dsw-alias-state-success-primary);
  color: var(--dsh-solid-on-color, var(--dsw-alias-label-primary-foreground));
  display: inline-grid;
  place-items: center;
  font-size: var(--dsh-text-2xs, 10px);
  font-weight: 700;
  flex: none;
}
.dsh-sdot-step svg {
  width: 10px;
  height: 10px;
  stroke-width: 2;
}

/* Badge (20px capsule round) */
.dsh-badge {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: var(--dsh-control-xs, 20px);
  padding: 0 8px;
  border-radius: 999px;
  corner-shape: round;
  font-size: var(--dsh-text-xs, 11px);
  font-weight: 500;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  border: .5px solid var(--dsw-alias-border-l3);
  color: var(--dsw-alias-label-secondary);
  background: transparent;
  white-space: nowrap;
}
.dsh-badge-subtle,
.dsh-badge-neutral {
  border-color: transparent;
  background: var(--dsw-alias-bg-module-platform);
  color: var(--dsw-alias-label-secondary);
}
.dsh-badge-solid {
  border-color: transparent;
  background: var(--dsh-brand-fill, var(--dsw-alias-brand-primary));
  color: var(--dsw-alias-label-primary-foreground);
}
.dsh-badge-info {
  border-color: transparent;
  background: var(--dsw-alias-state-business-tertiary);
  color: var(--dsh-state-info-text, var(--dsw-alias-state-business-primary));
}
.dsh-badge-ok {
  border-color: transparent;
  background: var(--dsw-alias-state-success-tertiary);
  color: var(--dsh-state-ok-text, var(--dsw-alias-state-success-primary));
}
.dsh-badge-warn {
  border-color: transparent;
  background: var(--dsw-alias-state-warn-tertiary);
  color: var(--dsh-state-warn-text, var(--dsw-alias-state-warn-primary));
}
.dsh-badge-error,
.dsh-badge-danger {
  border-color: transparent;
  background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent);
  color: var(--dsh-state-err-text, var(--dsw-alias-state-error-primary));
}

/* Meter (bar / level / 20-segment context gauge) */
.dsh-meter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dsh-meter-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--dsh-text-sm, 12px);
  color: var(--dsw-alias-label-secondary);
}
.dsh-meter-label {
  flex: none;
  min-width: 76px;
}
.dsh-meter-track {
  position: relative;
  flex: 1;
  height: 6px;
  border-radius: 999px;
  corner-shape: round;
  background: var(--dsw-alias-bg-module-platform);
  overflow: hidden;
}
.dsh-meter-fill {
  height: 100%;
  border-radius: 999px;
  corner-shape: round;
  background: var(--dsw-alias-state-business-primary);
  transition: width var(--dsh-dur-hover, 120ms) ease, background-color var(--dsh-dur-hover, 120ms) ease;
}
.dsh-meter-fill.is-ok { background: var(--dsw-alias-state-success-primary); }
.dsh-meter-fill.is-warn { background: var(--dsw-alias-state-warn-primary); }
.dsh-meter-fill.is-err { background: var(--dsw-alias-state-error-primary); }
.dsh-meter-tick {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1.5px;
  background: var(--dsw-alias-state-warn-primary);
}
.dsh-meter-num {
  flex: none;
  min-width: 36px;
  text-align: right;
  font-family: var(--ds-font-family-code, monospace);
  font-size: var(--dsh-text-sm, 12px);
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-tertiary);
}
.dsh-meter-seg-wrap {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-variant-numeric: tabular-nums;
}
.dsh-meter-seg-label {
  font-size: var(--dsh-text-sm, 12px);
  color: var(--dsw-alias-label-secondary);
}
.comp-ctx-btn {
  all: unset;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: var(--dsh-control-xs, 20px);
  padding: 0 5px;
  margin: 0 -5px;
  border-radius: var(--dsw-radius-sm, 8px);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  font-variant-numeric: tabular-nums;
  cursor: pointer;
}
.comp-ctx-btn::after {
  content: "";
  position: absolute;
  inset: -4px 0;
  border-radius: var(--dsw-radius-sm, 8px);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
}
.comp-ctx-btn:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: 2px;
}
@media (hover: hover) {
  .comp-ctx-btn:hover {
    background: var(--dsw-alias-interactive-bg-hover);
  }
}
.comp-ctx-meter,
.dsh-meter-segments {
  position: relative;
  display: inline-block;
  width: 59px;
  height: 6px;
  color: var(--dsw-alias-label-secondary);
  background: color-mix(in srgb, currentColor 22%, transparent);
  -webkit-mask-image: repeating-linear-gradient(90deg, #000 0 2px, transparent 2px 3px);
  mask-image: repeating-linear-gradient(90deg, #000 0 2px, transparent 2px 3px);
}
.dsh-meter-segments.is-ok { color: var(--dsw-alias-state-success-primary); }
.dsh-meter-segments.is-warn { color: var(--dsw-alias-state-warn-primary); }
.dsh-meter-segments.is-err { color: var(--dsw-alias-state-error-primary); }
.comp-ctx-meter > span,
.dsh-meter-segments > span {
  position: absolute;
  inset: 0 auto 0 0;
  width: 23px;
  background: currentColor;
}
.dsh-meter-seg-val {
  font-family: var(--ds-font-family-code, monospace);
  font-size: var(--dsh-text-sm, 12px);
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-secondary);
}

/* Banner (12px inline status banner) */
.dsh-banner-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dsh-banner {
  box-sizing: border-box;
  min-height: var(--dsh-row-md, 44px);
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 7px 8px 7px 12px;
  border-radius: var(--dsw-radius-md, 12px);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  border: .5px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-state-business-tertiary);
  font-size: var(--dsh-text-sm, 12px);
  line-height: 1.45;
  color: var(--dsw-alias-label-primary);
}
.dsh-banner.is-info { background: var(--dsw-alias-state-business-tertiary); }
.dsh-banner.is-ok { background: var(--dsw-alias-state-success-tertiary); }
.dsh-banner.is-warn { background: var(--dsw-alias-state-warn-tertiary); }
.dsh-banner.is-err,
.dsh-banner.is-error { background: var(--dsw-alias-interactive-bg-hover-danger); }
.dsh-banner-ico {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: 16px;
  height: 16px;
  font-size: var(--dsh-text-xl, 16px);
}
.dsh-banner.is-info .dsh-banner-ico { color: var(--dsw-alias-state-business-primary); }
.dsh-banner.is-ok .dsh-banner-ico { color: var(--dsh-state-ok-text, var(--dsw-alias-state-success-primary)); }
.dsh-banner.is-warn .dsh-banner-ico { color: var(--dsh-state-warn-text, var(--dsw-alias-state-warn-primary)); }
.dsh-banner.is-err .dsh-banner-ico,
.dsh-banner.is-error .dsh-banner-ico { color: var(--dsw-alias-state-error-primary); }
.dsh-banner-text {
  flex: 1;
  min-width: 0;
}
.dsh-banner-act {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* EmptyState & LoadingState (12px sunken slot) */
.dsh-empty {
  box-sizing: border-box;
  border-radius: var(--dsw-radius-md, 12px);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  border: 1px dashed var(--dsw-alias-border-l3);
  background: var(--dsh-surface-sunken);
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 6px;
}
.dsh-empty.dsh-loading {
  border-style: solid;
}
.dsh-empty-ico {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  corner-shape: round;
  background: var(--dsh-surface-card);
  border: .5px solid var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-tertiary);
  display: grid;
  place-items: center;
  margin-bottom: 2px;
}
.dsh-loading-spin {
  width: 18px;
  height: 18px;
  display: inline-grid;
  place-items: center;
  border: 0;
  color: var(--dsw-alias-state-business-primary);
  margin-bottom: 4px;
}
.dsh-empty-title {
  margin: 0;
  font-size: var(--dsh-text-md, 13px);
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
  text-wrap: balance;
}
.dsh-empty-sub {
  margin: 0;
  max-width: 28em;
  font-size: var(--dsh-text-sm, 12px);
  line-height: 1.5;
  color: var(--dsw-alias-label-tertiary);
  text-wrap: pretty;
}
.dsh-empty-act {
  margin-top: 4px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

@media (prefers-reduced-motion: reduce) {
  .dsh-sdot-spin {
    animation-duration: 1.8s !important;
    animation-iteration-count: infinite !important;
  }
}

/* Skeleton (bar / pill / circle · 宿主 2s 柔和明暗脉冲) */
.dsh-skel {
  background: var(--dsw-alias-bg-skeleton, var(--dsh-surface-sunken));
  animation: dsh-skel-pulse 2s cubic-bezier(.36, 0, .64, 1) infinite;
}
.dsh-skel[data-shape="bar"] {
  display: block;
  height: 12px;
  border-radius: var(--dsw-radius-xs, 4px);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
}
.dsh-skel[data-shape="pill"] {
  display: inline-block;
  height: var(--dsh-control-sm, 28px);
  border-radius: 999px;
  corner-shape: round;
}
.dsh-skel[data-shape="circle"] {
  display: inline-block;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  corner-shape: round;
}
@keyframes dsh-skel-pulse {
  0% { opacity: 1; }
  40% { opacity: .6; }
  80%, to { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .dsh-skel {
    animation: none;
  }
}
html[data-dsh-reduce-motion] .dsh-skel {
  animation: none;
}
`;
		//#endregion
		//#region ../packages/dsh-ui/src/Modal.tsx
		const modalCss = `
@keyframes dsh-backdrop-in {
  from { background-color: transparent; }
}
@keyframes dsh-dialog-in {
  from { opacity: 0; transform: scale(.97) translateY(4px); }
  to { opacity: 1; transform: none; }
}

/* 零模糊纯压暗遮罩：绝不对全屏聊天区施加高开销 backdrop-filter，亦绝不动画 opacity（防止形成 Backdrop Root 破坏弹窗内子下拉毛玻璃） */
.dsh-modal-overlay,
.live-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  box-sizing: border-box;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--dsw-alias-bg-mask-1);
  overscroll-behavior: contain;
}
.dsh-modal-overlay,
.live-overlay.is-open {
  animation: dsh-backdrop-in var(--dsh-dur-pop, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.live-overlay {
  display: none;
}
.live-overlay.is-open {
  display: flex;
}

/* 20px 抬升实底模态框（--dsh-surface-floating + --dsh-modal-shadow 柔和景深影） */
.dsh-modal,
.live-dialog,
.modal-static {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border-radius: var(--dsw-radius-xl, 20px);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  background: var(--dsh-surface-floating);
  color: var(--dsw-alias-label-primary);
  box-shadow: var(--dsh-modal-shadow, var(--dsw-elevation-prominent));
  outline: none;
}
.dsh-modal,
.live-dialog {
  margin: auto;
  width: min(400px, calc(100vw - 32px));
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  padding: 20px 24px 22px;
  animation: dsh-dialog-in var(--dsh-dur-pop, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-modal:has(.dsh-select-wrap.is-open),
.live-dialog:has(.dsh-select-wrap.is-open) {
  overflow: visible;
}
.live-dialog {
  width: min(400px, calc(100vw - 32px));
}
.modal-static {
  width: 100%;
  padding: 20px 24px 22px;
}
.modal-pane[hidden] {
  display: none;
}

/* 对齐 DSH 官方清透输入框：去灰底脏感，弹窗内单行输入采用 12px 圆角矩形与 40px 舒展高度，彻底消除大胶囊套小胶囊 */
.dsh-modal :is(.dsh-input, .dsh-pwd-box),
.modal-static :is(.dsh-input, .dsh-pwd-box),
.live-dialog :is(.dsh-input, .dsh-pwd-box) {
  height: 40px;
  border-radius: var(--dsw-radius-md, 12px);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  background: transparent;
  border: 1px solid var(--dsw-alias-border-l3);
}
.dsh-modal .dsh-input,
.modal-static .dsh-input,
.live-dialog .dsh-input {
  padding: 0 14px;
  font-size: var(--dsh-text-lg, 14px);
}
.dsh-modal :is(.dsh-search, .dsh-select, .dsh-textarea),
.modal-static :is(.dsh-search, .dsh-select, .dsh-textarea),
.live-dialog :is(.dsh-search, .dsh-select, .dsh-textarea) {
  background: transparent;
}
.dsh-modal .dsh-input[aria-invalid="true"],
.dsh-modal .dsh-input.is-error,
.dsh-modal .dsh-pwd-box.is-error,
.modal-static .dsh-input[aria-invalid="true"],
.modal-static .dsh-input.is-error,
.modal-static .dsh-pwd-box.is-error,
.live-dialog .dsh-input[aria-invalid="true"],
.live-dialog .dsh-input.is-error,
.live-dialog .dsh-pwd-box.is-error {
  border-color: var(--dsw-alias-state-error-primary);
}
.dsh-modal .dsh-input:focus-visible,
.modal-static .dsh-input:focus-visible,
.live-dialog .dsh-input:focus-visible,
.dsh-modal .dsh-pwd-box:has(> input:focus-visible),
.modal-static .dsh-pwd-box:has(> input:focus-visible),
.live-dialog .dsh-pwd-box:has(> input:focus-visible) {
  border-color: transparent;
}
@media (hover: hover) {
  .dsh-modal .dsh-input:hover:not(:disabled):not(:focus-visible):not([aria-invalid="true"]):not(.is-error),
  .modal-static .dsh-input:hover:not(:disabled):not(:focus-visible):not([aria-invalid="true"]):not(.is-error),
  .live-dialog .dsh-input:hover:not(:disabled):not(:focus-visible):not([aria-invalid="true"]):not(.is-error),
  .dsh-modal .dsh-pwd-box:hover:not(.is-disabled):not(.is-error):not(:has(> input:focus-visible)),
  .modal-static .dsh-pwd-box:hover:not(.is-disabled):not(.is-error):not(:has(> input:focus-visible)),
  .live-dialog .dsh-pwd-box:hover:not(.is-disabled):not(.is-error):not(:has(> input:focus-visible)) {
    border-color: var(--dsw-alias-border-l4);
  }
}

.dsh-modal-head,
.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.dsh-modal-title,
.modal-title {
  margin: 0;
  font-size: var(--dsh-text-xl, 16px);
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.015em;
  color: var(--dsw-alias-label-primary);
  text-wrap: balance;
}
.dsh-modal-close {
  all: unset;
  box-sizing: border-box;
  flex: none;
  width: var(--dsh-control-sm, 28px);
  height: var(--dsh-control-sm, 28px);
  margin: -2px -10px -2px 0;
  border-radius: 50%;
  corner-shape: round;
  display: inline-grid;
  place-items: center;
  font-size: var(--dsh-text-lg, 14px);
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition:
    background var(--dsh-dur-hover, 120ms) ease,
    color var(--dsh-dur-hover, 120ms) ease,
    transform var(--dsh-dur-release, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.modal-head > .icon-btn-round {
  margin: -2px -10px -2px 0;
}
.dsh-modal-close[hidden] {
  display: none;
}
.dsh-modal-close:active {
  background: var(--dsw-alias-interactive-bg-active);
  transform: scale(.96);
  transition-duration: var(--dsh-dur-press, 60ms);
  transition-timing-function: var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-modal-close:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: 2px;
}
@media (hover: hover) {
  .dsh-modal-close:hover {
    background: var(--dsw-alias-interactive-bg-hover);
    color: var(--dsw-alias-label-primary);
  }
}

.dsh-modal-desc,
.modal-desc {
  margin: 8px 0 0;
  font-size: var(--dsh-text-lg, 14px);
  line-height: 22px;
  color: var(--dsw-alias-label-secondary);
  text-wrap: pretty;
}
.dsh-modal-desc:has(+ :not(.dsh-modal-foot):not(.modal-foot)),
.modal-desc:has(+ :not(.dsh-modal-foot):not(.modal-foot)) {
  margin-bottom: 14px;
}
.dsh-modal-head + :not(.dsh-modal-desc):not(.modal-desc):not(.dsh-modal-foot):not(.modal-foot):not(.modal-warn-box),
.modal-head + :not(.dsh-modal-desc):not(.modal-desc):not(.dsh-modal-foot):not(.modal-foot):not(.modal-warn-box) {
  margin-top: 14px;
}
.modal-warn-box {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 10px 0 12px;
  padding: 10px 12px;
  border-radius: var(--dsw-radius-md, 12px);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  background: var(--dsw-alias-interactive-bg-hover-danger);
  color: var(--dsw-alias-label-primary);
  font-size: var(--dsh-text-sm, 12px);
  line-height: 1.5;
}
.modal-warn-ico {
  flex: none;
  margin-top: 1px;
  color: var(--dsw-alias-state-error-primary);
  display: inline-grid;
  place-items: center;
  font-size: var(--dsh-text-xl, 16px);
}
.dsh-modal-foot,
.modal-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}
.dsh-modal-foot > .hs-btn:not(.hs-btn-ghost),
.modal-foot > .hs-btn:not(.hs-btn-ghost) {
  min-width: 72px;
}
.dsh-modal-aux {
  margin-right: auto;
  display: inline-flex;
  align-items: center;
}

/* HoverCard（富内容悬浮预览卡 · 官方 16px 浮层表面，供预览台与退化卡片复用） */
.dsh-hovercard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
@media (max-width: 640px) {
  .dsh-hovercard-grid {
    grid-template-columns: 1fr;
  }
}
.dsh-hovercard {
  box-sizing: border-box;
  padding: 10px 13px;
  border-radius: var(--dsw-radius-lg, 16px);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: var(--dsh-surface-floating);
  color: var(--dsw-alias-label-primary);
  box-shadow: var(--dsw-elevation-panel);
}
.dsh-hovercard.is-clickable {
  cursor: pointer;
  transition: background var(--dsh-dur-hover, 120ms) ease;
}
.dsh-hovercard[tabindex]:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: 2px;
}
@media (hover: hover) {
  .dsh-hovercard.is-clickable:hover {
    background: color-mix(in srgb, var(--dsh-surface-floating), var(--dsw-alias-label-primary) 4%);
  }
}
.dsh-hc-title {
  font-size: var(--dsh-text-md, 13px);
  font-weight: 500;
  line-height: 1.4;
}
.dsh-hc-sub {
  font-family: var(--ds-font-family-code, monospace);
  font-size: var(--dsh-text-xs, 11px);
  line-height: 1.45;
  color: var(--dsw-alias-label-tertiary);
  overflow-wrap: anywhere;
  word-break: normal;
}
@media (prefers-reduced-motion: reduce) {
  .dsh-modal-overlay,
  .live-overlay.is-open,
  .dsh-modal,
  .live-dialog {
    animation: none;
  }
}
@media (forced-colors: active) {
  .dsh-modal,
  .live-dialog,
  .modal-static {
    border: 1px solid CanvasText;
  }
}
`;
		//#endregion
		//#region ../packages/dsh-ui/src/Popover.tsx
		const PopoverModeContext = (0, react.createContext)({ combobox: false });
		function mergeRefs(...refs) {
			return (node) => {
				for (const r of refs) {
					if (!r) continue;
					if (typeof r === "function") r(node);
					else r.current = node;
				}
			};
		}
		const HIDDEN_POS = {
			left: 0,
			top: 0,
			visibility: "hidden"
		};
		(0, react.forwardRef)(function Popover({ open = true, onClose, anchorRef, side = "bottom", align = "start", gap = 6, portal, material = "translucent", origin, searchable, searchValue, defaultSearchValue = "", onSearchChange, onSearchEnter, searchPlaceholder = "搜索…", searchAriaLabel = "搜索列表", clearSearchLabel = "清空搜索", autoFocusSearch = false, categories, activeCategory, defaultCategory, onCategoryChange, categoryAriaLabel = "分类筛选", headerExtra, maxBodyHeight = 280, footer, className, style, children, ...rest }, forwardedRef) {
			const listboxId = `dsh-pop-list-${(0, react.useId)().replaceAll(":", "")}`;
			const panelRef = (0, react.useRef)(null);
			const searchInputRef = (0, react.useRef)(null);
			const tabsRef = (0, react.useRef)(null);
			const bodyRef = (0, react.useRef)(null);
			const lastPointerRef = (0, react.useRef)(null);
			const [uncontrolledSearch, setUncontrolledSearch] = (0, react.useState)(defaultSearchValue);
			const resolvedSearch = searchValue !== void 0 ? searchValue : uncontrolledSearch;
			const showSearch = Boolean(searchable) || searchValue !== void 0 || onSearchChange !== void 0;
			const [uncontrolledCat, setUncontrolledCat] = (0, react.useState)(() => defaultCategory ?? categories?.[0]?.id ?? "");
			const resolvedCat = activeCategory !== void 0 ? activeCategory : uncontrolledCat;
			const [activeRowId, setActiveRowId] = (0, react.useState)(null);
			useSlidingIndicator(tabsRef, open ? resolvedCat : false, {
				itemSelector: ".dsh-pop-tab",
				indicatorClass: "dsh-pop-tabs-ind"
			});
			const isAnchored = anchorRef !== void 0;
			const shouldPortal = portal ?? isAnchored;
			const anchoredPlacement = useAnchoredPlacement({
				open: open && isAnchored,
				anchorRef: anchorRef ?? { current: null },
				panelRef,
				side,
				align,
				gap,
				margin: 12
			});
			const { layerId, zIndex } = useOverlayLayer({
				open: open && (isAnchored || Boolean(onClose)),
				tier: "popover",
				closeOnEscape: Boolean(onClose),
				containsNode: (node) => Boolean(panelRef.current?.contains(node) || anchorRef?.current?.contains(node)),
				onEscape: onClose ? () => onClose() : void 0,
				onPointerDownOutside: onClose ? () => onClose() : void 0
			});
			const applyHighlight = (nextId, scrollIntoView = false) => {
				const root = bodyRef.current;
				let targetEl;
				if (root) {
					const allRows = Array.from(root.querySelectorAll(".dsh-pop-row"));
					for (const row of allRows) if (nextId !== null && row.id === nextId) {
						row.setAttribute("data-highlighted", "true");
						targetEl = row;
					} else row.removeAttribute("data-highlighted");
				}
				setActiveRowId(nextId);
				if (scrollIntoView && targetEl) targetEl.scrollIntoView?.({ block: "nearest" });
			};
			const getNavigableRows = () => {
				const root = bodyRef.current;
				if (!root) return [];
				return Array.from(root.querySelectorAll(".dsh-pop-row")).filter((el) => el.getAttribute("role") === "option" && !el.classList.contains("is-disabled") && el.getAttribute("aria-disabled") !== "true" && !el.closest("[hidden]"));
			};
			(0, react.useEffect)(() => {
				if (!open) {
					setActiveRowId(null);
					lastPointerRef.current = null;
					return;
				}
				if (!autoFocusSearch || !showSearch) return;
				if (!(typeof window !== "undefined" && typeof window.matchMedia === "function" && Boolean(window.matchMedia("(pointer: coarse)")?.matches))) searchInputRef.current?.focus?.({ preventScroll: true });
			}, [
				open,
				autoFocusSearch,
				showSearch
			]);
			const glideRef = useGlideHover(bodyRef, open, {
				itemSelector: ".dsh-pop-row",
				isItemEnabled: (el) => !el.classList.contains("is-disabled") && el.getAttribute("aria-disabled") !== "true" && !el.hasAttribute("data-static") && el.style?.cursor !== "default",
				onActiveChange: (hit) => {
					if (!hit) {
						if (activeRowId !== null) applyHighlight(null);
						return;
					}
					if (hit.getAttribute("role") === "option" && hit.id && activeRowId !== hit.id) applyHighlight(hit.id);
				}
			});
			(0, react.useEffect)(() => {
				if (!open) return;
				const glide = glideRef.current;
				const body = bodyRef.current;
				if (!glide || !body) return;
				if (activeRowId) {
					const target = Array.from(body.querySelectorAll(".dsh-pop-row")).find((el) => el.id === activeRowId);
					if (target) glide.setActiveItem(target, { snap: false });
				} else if (showSearch) glide.hide();
			}, [
				open,
				activeRowId,
				showSearch,
				glideRef
			]);
			if (!open) return null;
			const updateSearch = (next) => {
				if (searchValue === void 0) setUncontrolledSearch(next);
				applyHighlight(null);
				onSearchChange?.(next);
			};
			const handleSearchKeyDown = (event) => {
				if (isImeComposing(event)) return;
				if (event.key === "ArrowDown" || event.key === "ArrowUp") {
					const rows = getNavigableRows();
					if (rows.length === 0) return;
					event.preventDefault();
					const curIdx = activeRowId ? rows.findIndex((r) => r.id === activeRowId) : -1;
					const targetRow = rows[event.key === "ArrowDown" ? curIdx >= 0 ? (curIdx + 1) % rows.length : 0 : curIdx >= 0 ? (curIdx - 1 + rows.length) % rows.length : rows.length - 1];
					if (targetRow) applyHighlight(targetRow.id, true);
				} else if (event.key === "Enter") {
					if (activeRowId !== null) {
						const activeRow = getNavigableRows().find((r) => r.id === activeRowId);
						if (activeRow) {
							event.preventDefault();
							activeRow.click();
							return;
						}
					}
					onSearchEnter?.(resolvedSearch);
				} else if (event.key === "Escape") {
					if (resolvedSearch.length > 0) {
						event.preventDefault();
						event.stopPropagation?.();
						updateSearch("");
					} else if (onClose) {
						event.preventDefault();
						event.stopPropagation?.();
						onClose();
					}
				}
			};
			const selectCategory = (id) => {
				if (activeCategory === void 0) setUncontrolledCat(id);
				applyHighlight(null);
				onCategoryChange?.(id);
			};
			const hasTopBar = categories !== void 0 && categories.length > 0 || headerExtra !== void 0;
			const resolvedSide = isAnchored ? anchoredPlacement?.side ?? side : rest["data-side"];
			const resolvedOrigin = origin ?? (isAnchored ? anchoredPlacement?.origin : void 0);
			const resolvedPopAnim = isAnchored ? anchoredPlacement !== null || typeof window === "undefined" ? "true" : void 0 : rest["data-pop-anim"];
			const effectiveMaxBodyHeight = isAnchored && anchoredPlacement !== null && typeof maxBodyHeight === "number" ? Math.max(96, Math.min(maxBodyHeight, anchoredPlacement.maxHeight - (showSearch ? 44 : 0) - (hasTopBar ? 36 : 0))) : maxBodyHeight;
			const mergedStyle = isAnchored ? {
				zIndex,
				...anchoredPlacement ? {
					left: anchoredPlacement.left,
					top: anchoredPlacement.top
				} : HIDDEN_POS,
				...style
			} : { ...style };
			const surface = /* @__PURE__ */ (0, react_jsx_runtime.jsx)(OverlayParentContext.Provider, {
				value: layerId,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PopoverModeContext.Provider, {
					value: { combobox: showSearch },
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(MenuSurface, {
						...rest,
						ref: mergeRefs(panelRef, forwardedRef),
						panel: true,
						material,
						origin: resolvedOrigin,
						"data-dsh-portal": shouldPortal ? "" : void 0,
						"data-side": resolvedSide,
						"data-align": isAnchored ? align : rest["data-align"],
						"data-pop-anim": resolvedPopAnim,
						className: `dsh-pop${isAnchored ? " dsh-pop-anchored" : ""}${className ? ` ${className}` : ""}`,
						style: mergedStyle,
						children: [
							showSearch && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-pop-search",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "dsh-pop-search-ico",
										"aria-hidden": "true",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SearchIcon, {})
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										ref: searchInputRef,
										type: "text",
										role: "combobox",
										"aria-expanded": open,
										"aria-autocomplete": "list",
										"aria-controls": listboxId,
										"aria-activedescendant": activeRowId ?? void 0,
										className: "dsh-pop-search-input",
										value: resolvedSearch,
										placeholder: searchPlaceholder,
										"aria-label": searchAriaLabel,
										onChange: (e) => updateSearch(e.target.value),
										onKeyDown: handleSearchKeyDown
									}),
									resolvedSearch.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dsh-pop-search-clear dsh-search-clear",
										"aria-label": clearSearchLabel,
										onClick: () => {
											updateSearch("");
											searchInputRef.current?.focus?.();
										},
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CloseIcon, {})
									})
								]
							}),
							hasTopBar && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-pop-top",
								children: [categories !== void 0 && categories.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									ref: tabsRef,
									className: "dsh-pop-tabs",
									role: "tablist",
									"aria-label": categoryAriaLabel,
									onKeyDown: (e) => handleRovingKeyDown(e, ".dsh-pop-tab"),
									children: categories.map((cat) => {
										const selected = cat.id === resolvedCat;
										return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											role: "tab",
											tabIndex: selected ? 0 : -1,
											"aria-selected": selected,
											disabled: cat.disabled,
											className: "dsh-pop-tab",
											onClick: () => selectCategory(cat.id),
											children: cat.label
										}, cat.id);
									})
								}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {}), headerExtra !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "dsh-pop-extra",
									children: headerExtra
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ScrollArea, {
								maxHeight: effectiveMaxBodyHeight,
								thumbThreshold: 1.05,
								viewportRef: bodyRef,
								viewportProps: {
									id: listboxId,
									role: showSearch ? "listbox" : void 0,
									"data-pop-managed": "",
									onPointerMove: (event) => {
										if (!didPointerActuallyMove(lastPointerRef, event)) return;
										const targetEl = event.target instanceof Element ? event.target.closest(".dsh-pop-row") : null;
										if (targetEl && targetEl.getAttribute("role") === "option" && !targetEl.classList.contains("is-disabled") && targetEl.getAttribute("aria-disabled") !== "true") {
											if (activeRowId !== targetEl.id) applyHighlight(targetEl.id);
										} else if (activeRowId !== null) applyHighlight(null);
									},
									onPointerLeave: () => {
										lastPointerRef.current = null;
										if (activeRowId !== null) applyHighlight(null);
									}
								},
								className: "dsh-pop-scroll",
								viewportClassName: "dsh-pop-body",
								children
							}),
							footer !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dsh-pop-footer",
								children: footer
							})
						]
					})
				})
			});
			if (shouldPortal && typeof document !== "undefined" && Boolean(document.body)) return (0, react_dom.createPortal)(surface, document.body);
			return surface;
		});
		const popoverCss = `
/* Popover 复合弹出面板（外框 16px - 边距 6px = 列表项 10px 严格同心） */
.dsh-pop {
  --dsh-r-outer: var(--dsw-radius-lg, 16px);
  --dsh-pad: 6px;
  padding: var(--dsh-pad);
  gap: 2px;
}
.dsh-pop-anchored {
  position: fixed;
  z-index: 1100;
  min-width: 240px;
  max-width: min(380px, calc(100vw - 24px));
}

/* 顶栏无框搜索条（严守 1-Border Rule：浮层内不重复画胶囊边框，底线两端留白 8px） */
.dsh-pop-search {
  position: relative;
  display: flex;
  align-items: center;
  gap: 7px;
  min-height: var(--dsh-row-sm, 32px);
  padding: 0 6px 5px 8px;
  margin-bottom: 2px;
}
.dsh-pop-search::after {
  content: "";
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 0;
  border-top: .5px solid var(--dsw-alias-border-l1);
  pointer-events: none;
}
.dsh-pop-search-ico {
  flex: none;
  display: inline-grid;
  place-items: center;
  width: 15px;
  height: 15px;
  font-size: var(--dsh-text-lg, 14px);
  color: var(--dsw-alias-label-tertiary);
}
.dsh-pop-search-input {
  all: unset;
  flex: 1;
  min-width: 0;
  font-size: var(--dsh-text-md, 13px);
  line-height: 20px;
  color: var(--dsw-alias-label-primary);
}
.dsh-pop-search-input::placeholder {
  color: var(--dsw-alias-label-tertiary);
}
@media (pointer: coarse) and (max-width: 768px) {
  .dsh-pop-search-input {
    font-size: var(--dsh-text-xl, 16px);
  }
}
.dsh-pop-search-clear {
  all: unset;
  position: relative;
  flex: none;
  width: var(--dsh-control-xs, 20px);
  height: var(--dsh-control-xs, 20px);
  border-radius: 50%;
  corner-shape: round;
  display: grid;
  place-items: center;
  font-size: var(--dsh-text-xs, 11px);
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition:
    background var(--dsh-dur-hover, 120ms) ease,
    color var(--dsh-dur-hover, 120ms) ease,
    transform var(--dsh-dur-release, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-pop-search-clear::after {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  corner-shape: round;
}
@media (pointer: coarse) {
  .dsh-pop-search-clear::after {
    inset: -8px;
  }
}
.dsh-pop-search-clear:active {
  transform: scale(.94);
  transition-duration: var(--dsh-dur-press, 60ms);
  transition-timing-function: var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-pop-search-clear:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: -2px;
}

/* 顶栏滑动胶囊分类筛选条 */
.dsh-pop-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  position: relative;
  padding: 0 2px 5px;
  margin-bottom: 2px;
}
.dsh-pop-top::after {
  content: "";
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 0;
  border-top: .5px solid var(--dsw-alias-border-l1);
  pointer-events: none;
}
.dsh-pop-extra {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: none;
}
.dsh-pop-tabs {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  min-width: 0;
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  gap: 2px;
}
.dsh-pop-tabs::-webkit-scrollbar {
  display: none;
}
.dsh-pop-tab {
  all: unset;
  box-sizing: border-box;
  flex: none;
  white-space: nowrap;
  height: calc(var(--dsh-control-sm, 28px) - 4px);
  padding: 0 9px;
  border-radius: 999px;
  corner-shape: round;
  font-size: var(--dsh-text-sm, 12px);
  font-weight: 500;
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
  touch-action: manipulation;
  transition:
    background var(--dsh-dur-hover, 120ms) ease,
    color var(--dsh-dur-hover, 120ms) ease;
}
.dsh-pop-tab:disabled {
  opacity: .4;
  cursor: not-allowed;
}
.dsh-pop-tab:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: -2px;
}
.dsh-pop-tab[aria-selected="true"],
.dsh-pop-tabs-ind {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-pop-tab[aria-selected="true"] {
  color: var(--dsw-alias-label-primary);
}
.dsh-pop-tabs[data-ind] .dsh-pop-tab[aria-selected="true"] {
  background: transparent;
}
.dsh-pop-tabs-ind {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  height: calc(var(--dsh-control-sm, 28px) - 4px);
  border-radius: 999px;
  corner-shape: round;
  pointer-events: none;
  width: var(--ind-w, 0);
  transform: translateX(var(--ind-x, 0));
  transition:
    transform var(--dsh-dur-expand, 220ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1)),
    width var(--dsh-dur-expand, 220ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-pop-tabs-ind[data-instant] {
  transition: none;
}
.dsh-pop-pin[aria-pressed="true"] {
  color: var(--dsw-alias-state-business-primary);
}

/* ScrollArea 主体列表区 */
.dsh-pop-scroll {
  min-height: 0;
}
.dsh-pop-body {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

/* 10px 同心列表行与星标收藏按钮 */
.dsh-pop[data-dsh-glide],
.dsh-pop-body[data-dsh-glide] {
  --dsh-glide-bg: var(--dsw-alias-interactive-bg-hover);
}
.dsh-pop-body > .dsh-glide-pin {
  margin-bottom: -1px;
}
.dsh-pop-row {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: var(--dsh-row-sm, 32px);
  padding: 4px 8px;
  border-radius: max(0px, calc(var(--dsh-r-outer) - var(--dsh-pad)));
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  font-size: var(--dsh-text-md, 13px);
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
}
.dsh-pop-row[data-highlighted="true"]:not(.is-disabled):not([aria-disabled="true"]) {
  background: var(--dsw-alias-interactive-bg-hover);
}
:is(.dsh-pop[data-dsh-glide], .dsh-pop-body[data-dsh-glide]) .dsh-pop-row[data-highlighted="true"]:not(.is-disabled):not([aria-disabled="true"]):not(.is-selected):not([aria-selected="true"]) {
  background: transparent;
}
.dsh-pop-row.is-selected,
.dsh-pop-row[aria-selected="true"] {
  background: var(--dsw-alias-interactive-bg-active);
}
.dsh-pop-row.is-disabled,
.dsh-pop-row[aria-disabled="true"] {
  opacity: .42;
  cursor: not-allowed;
}
.dsh-pop-row:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: -2px;
}
.dsh-pop-title {
  font-weight: 500;
}
.dsh-pop-alias {
  flex: none;
  font-family: var(--ds-font-family-code, monospace);
  font-size: var(--dsh-text-sm, 12px);
  color: var(--dsw-alias-label-tertiary);
}
.dsh-pop-desc {
  flex: 0 1 auto;
  min-width: 0;
  margin-left: auto;
  font-size: var(--dsh-text-sm, 12px);
  color: var(--dsw-alias-label-tertiary);
  white-space: nowrap;
}
.dsh-pop-row > * {
  min-width: 0;
  white-space: nowrap;
}
.dsh-pop-row > span:not(.hs-fb-icon):not(.dsh-pop-alias) {
  overflow: hidden;
  text-overflow: ellipsis;
}
.dsh-pop-row:has(> .dsh-pop-desc) > span:not(.hs-fb-icon):not(.dsh-pop-alias):not(.dsh-pop-desc) {
  flex: 0 1 auto;
  flex-shrink: 0;
  max-width: 62%;
}

.dsh-pop-star {
  all: unset;
  position: relative;
  flex: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  corner-shape: round;
  display: grid;
  place-items: center;
  color: var(--dsw-alias-label-caption);
  font-size: var(--dsh-text-md, 13px);
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition:
    background var(--dsh-dur-hover, 120ms) ease,
    color var(--dsh-dur-hover, 120ms) ease,
    transform var(--dsh-dur-release, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-pop-star::after {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  corner-shape: round;
}
@media (pointer: coarse) {
  .dsh-pop-star::after {
    inset: -4px;
  }
}
.dsh-pop-star:active {
  transform: scale(.93);
  transition-duration: var(--dsh-dur-press, 60ms);
  transition-timing-function: var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-pop-star:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: -2px;
}
.dsh-pop-star[aria-pressed="true"] {
  color: var(--dsw-alias-state-warn-primary);
}

/* 可折叠底部快捷开关组 */
.dsh-pop-group {
  margin-top: 3px;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.dsh-pop-group::before {
  content: "";
  display: block;
  margin: 0 8px 3px;
  border-top: .5px solid var(--dsw-alias-border-l2);
}
.dsh-pop-ghead {
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 8px;
  border-radius: var(--dsw-radius-sm, 8px);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  font-size: var(--dsh-text-sm, 12px);
  font-weight: 500;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}
.dsh-pop-ghead:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: -2px;
}
.dsh-pop-gchev {
  display: inline-flex;
  font-size: var(--dsh-text-2xs, 10px);
  color: var(--dsw-alias-label-tertiary);
  transition: transform var(--dsh-dur-expand, 220ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh-pop-ghead[aria-expanded="false"] .dsh-pop-gchev {
  transform: rotate(-90deg);
}
.dsh-pop-gbody[hidden] {
  display: none;
}

/* 底部快捷键提示底栏 */
.dsh-pop-footer {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 8px 2px;
  margin-top: 2px;
  font-size: var(--dsh-text-xs, 11px);
  line-height: 1.4;
  color: var(--dsw-alias-label-tertiary);
}
.dsh-pop-footer::before {
  content: "";
  position: absolute;
  left: 8px;
  right: 8px;
  top: 0;
  border-top: .5px solid var(--dsw-alias-border-l1);
  pointer-events: none;
}

@media (hover: hover) {
  .dsh-pop-search-clear:hover {
    background: var(--dsw-alias-interactive-bg-hover);
    color: var(--dsw-alias-label-primary);
  }
  .dsh-pop-tab:not(:disabled):hover {
    color: var(--dsw-alias-label-primary);
  }
  .dsh-pop-body:not([data-pop-managed]):not([data-dsh-glide]) .dsh-pop-row:not([data-combobox-row]):not(.is-disabled):not([aria-disabled="true"]):hover {
    background: var(--dsw-alias-interactive-bg-hover);
  }
  :is(.dsh-pop[data-dsh-glide], .dsh-pop-body[data-dsh-glide]) .dsh-pop-row:not(.is-selected):not([aria-selected="true"]):hover {
    background: transparent;
  }
  .dsh-pop-star:hover {
    background: var(--dsw-alias-interactive-bg-hover);
    color: var(--dsw-alias-label-secondary);
  }
  .dsh-pop-ghead:hover {
    color: var(--dsw-alias-label-primary);
  }
}
`;
		//#endregion
		//#region ../packages/dsh-ui/src/primitives-safe.tsx
		const fallbackCss = `
.hs-fb-anchor {
  position: relative;
  display: inline-flex;
}
.hs-fb-menu {
  position: fixed;
  z-index: 1100;
  box-sizing: border-box;
  min-width: 144px;
  max-width: min(360px, calc(100vw - 16px));
  padding: 4px;
  display: flex;
  flex-direction: column;
}
.hs-fb-group {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.hs-fb-heading {
  padding: 6px 8px 3px;
  font-size: var(--dsh-text-xs, 11px);
  line-height: 15px;
  color: var(--dsw-alias-label-tertiary);
}
/* 菜单分割线两端留白 12px（容器内距 + 缩进 = 12px），与菜单项文字左缘对齐；连续或末尾多余分隔线自动折叠 */
.hs-fb-sep {
  margin: 3px calc(12px - var(--dsh-pad, 6px));
  border-top: .5px solid var(--dsw-alias-border-l2);
  transition: opacity var(--dsh-dur-hover, 120ms) ease;
}
.hs-fb-sep + .hs-fb-sep,
.hs-fb-group:last-child > .hs-fb-sep:last-child {
  display: none;
}
.hs-fb-footer {
  margin-top: 3px;
  display: flex;
  flex-direction: column;
}
.hs-fb-footer::before {
  content: "";
  display: block;
  margin: 0 calc(12px - var(--dsh-pad, 6px)) 3px;
  border-top: .5px solid var(--dsw-alias-border-l2);
}
/* 同心菜单项：标准 16px - 4px = 12px；紧凑 12px - 4px = 8px */
.hs-fb-item {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 7px;
  width: 100%;
  min-height: var(--dsh-row-sm, 32px);
  padding: 6px 8px;
  border: 0;
  border-radius: max(0px, calc(var(--dsh-r-outer, var(--dsw-radius-lg, 16px)) - var(--dsh-pad, 4px)));
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: var(--dsh-text-md, 13px);
  line-height: 20px;
  text-align: left;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
.hs-msurf-compact .hs-fb-item {
  min-height: var(--dsh-control-sm, 28px);
  padding: 4px 8px;
  font-size: var(--dsh-text-sm, 12px);
  line-height: 18px;
}
.hs-fb-item[aria-selected="true"],
.hs-fb-item[aria-checked="true"] {
  font-weight: 500;
}
.hs-fb-item[aria-selected="true"],
.hs-fb-item[role="menuitemradio"][aria-checked="true"] {
  background: var(--dsh-subtle-fill-active);
}
.hs-fb-item:disabled {
  opacity: .4;
  cursor: not-allowed;
}
.hs-fb-item:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: -2px;
}
.hs-fb-danger {
  color: var(--dsh-state-err-text, var(--dsw-alias-state-error-primary));
}
.hs-msurf[data-menu-managed] .hs-fb-item[data-highlighted="true"]:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
}
.hs-msurf[data-menu-managed] .hs-fb-item[aria-selected="true"][data-highlighted="true"]:not(:disabled),
.hs-msurf[data-menu-managed] .hs-fb-item[role="menuitemradio"][aria-checked="true"][data-highlighted="true"]:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-active, var(--dsh-subtle-fill-active));
}
.hs-msurf[data-menu-managed] .hs-fb-danger[data-highlighted="true"]:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover-danger);
}
:is(.hs-msurf[data-dsh-glide], .hs-msurf [data-dsh-glide]) .hs-fb-item[data-highlighted="true"]:not(:disabled):not([aria-selected="true"]):not([role="menuitemradio"][aria-checked="true"]),
:is(.hs-msurf[data-dsh-glide], .hs-msurf [data-dsh-glide]) .hs-fb-danger[data-highlighted="true"]:not(:disabled) {
  background: transparent;
}
:is(.hs-msurf[data-dsh-glide], .hs-msurf [data-dsh-glide]) .hs-fb-item[aria-selected="true"][data-highlighted="true"]:not([data-glide-active]):not(:disabled),
:is(.hs-msurf[data-dsh-glide], .hs-msurf [data-dsh-glide]) .hs-fb-item[role="menuitemradio"][aria-checked="true"][data-highlighted="true"]:not([data-glide-active]):not(:disabled) {
  background: var(--dsh-subtle-fill-active);
}
.hs-msurf[data-menu-managed] .hs-fb-item[data-highlighted="true"] + .hs-fb-sep,
.hs-msurf[data-menu-managed] .hs-fb-sep:has(+ .hs-fb-item[data-highlighted="true"]),
:is(.hs-msurf[data-dsh-glide], .hs-msurf [data-dsh-glide]) .hs-fb-item[data-glide-active] + .hs-fb-sep,
:is(.hs-msurf[data-dsh-glide], .hs-msurf [data-dsh-glide]) .hs-fb-sep:has(+ .hs-fb-item[data-glide-active]) {
  opacity: 0;
}
@media (hover: hover) {
  .hs-msurf:not([data-menu-managed]):not([data-dsh-glide]):not(:has([data-dsh-glide])) .hs-fb-item:hover:not(:disabled) {
    background: var(--dsw-alias-interactive-bg-hover);
  }
  .hs-msurf:not([data-menu-managed]):not([data-dsh-glide]):not(:has([data-dsh-glide])) .hs-fb-item[aria-selected="true"]:hover:not(:disabled),
  .hs-msurf:not([data-menu-managed]):not([data-dsh-glide]):not(:has([data-dsh-glide])) .hs-fb-item[role="menuitemradio"][aria-checked="true"]:hover:not(:disabled) {
    background: var(--dsw-alias-interactive-bg-active, var(--dsh-subtle-fill-active));
  }
  .hs-msurf:not([data-menu-managed]):not([data-dsh-glide]):not(:has([data-dsh-glide])) .hs-fb-danger:hover:not(:disabled) {
    background: var(--dsw-alias-interactive-bg-hover-danger);
  }
  .hs-msurf:not([data-menu-managed]) .hs-fb-item:hover + .hs-fb-sep,
  .hs-msurf:not([data-menu-managed]) .hs-fb-sep:has(+ .hs-fb-item:hover) {
    opacity: 0;
  }
}
.hs-fb-icon {
  width: 15px;
  height: 15px;
  flex: none;
  display: inline-grid;
  place-items: center;
  color: var(--dsw-alias-label-secondary);
}
.hs-fb-danger .hs-fb-icon {
  color: var(--dsh-state-err-text, var(--dsw-alias-state-error-primary));
}
.hs-fb-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.hs-fb-kbd {
  flex: none;
  margin-left: auto;
  font-family: var(--ds-font-family-code, monospace);
  font-size: var(--dsh-text-xs, 11px);
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-tertiary);
}
.hs-fb-danger .hs-fb-kbd {
  color: inherit;
  opacity: .72;
}
.hs-fb-subarrow {
  flex: none;
  margin-left: auto;
  display: inline-grid;
  place-items: center;
  font-size: var(--dsh-text-xs, 11px);
  color: var(--dsw-alias-label-tertiary);
}
.hs-fb-check {
  width: 14px;
  height: 14px;
  flex: none;
  display: inline-grid;
  place-items: center;
  font-size: var(--dsh-text-sm, 12px);
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
}
.hs-fb-check:empty {
  display: none;
}
.hs-fb-item[aria-selected="false"] > .hs-fb-check,
.hs-fb-item[aria-checked="false"] > .hs-fb-check {
  opacity: 0;
}

/* Switch (36x20 胶囊 round + 16px round 滑块 · 按压微伸展 20px，关态跟随 --dsw-alias-switch-thumb 防深色黑洞) */
.hs-fb-switch {
  box-sizing: border-box;
  position: relative;
  flex: 0 0 auto;
  width: 36px;
  height: 20px;
  padding: 1px;
  border: 1px solid transparent;
  background-clip: padding-box;
  border-radius: 999px;
  corner-shape: round;
  background-color: var(--dsw-alias-border-l3);
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background-color var(--dsh-dur-hover, 120ms) ease, border-color var(--dsh-dur-hover, 120ms) ease;
}
.hs-fb-switch::after {
  content: "";
  position: absolute;
  inset: -4px 0;
  border-radius: 999px;
  corner-shape: round;
}
@media (pointer: coarse) {
  .hs-fb-switch::after {
    inset: -8px -4px;
  }
}
.hs-fb-switch[aria-checked="true"] {
  background-color: var(--dsh-switch-active-bg, var(--dsh-brand-fill, var(--dsw-alias-brand-primary)));
}
.hs-fb-switch:disabled {
  opacity: .45;
  cursor: not-allowed;
}
.hs-fb-switch:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-focus-ring-color);
  outline-offset: 2px;
}
.hs-fb-thumb {
  display: block;
  width: var(--dsh-indicator, 16px);
  height: var(--dsh-indicator, 16px);
  border-radius: 50%;
  corner-shape: round;
  background: var(--dsw-alias-switch-thumb);
  box-shadow: 0 1px 2px rgb(0 0 0 / .14);
  transition:
    transform var(--dsh-dur-release, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1)),
    width var(--dsh-dur-press, 60ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1)),
    background-color var(--dsh-dur-hover, 120ms) ease,
    box-shadow var(--dsh-dur-hover, 120ms) ease;
}
.hs-fb-switch:active:not(:disabled) .hs-fb-thumb {
  width: 20px;
}
.hs-fb-switch[aria-checked="true"] .hs-fb-thumb {
  background: var(--dsh-accent-on-color, var(--dsw-alias-label-primary-foreground));
  box-shadow: var(--dsh-switch-active-thumb-shadow, 0 1px 2px rgb(0 0 0 / .22));
  transform: translateX(16px);
}
.hs-fb-switch[aria-checked="true"]:active:not(:disabled) .hs-fb-thumb {
  transform: translateX(12px);
}
@media (prefers-reduced-motion: reduce) {
  .hs-fb-switch:active:not(:disabled) .hs-fb-thumb {
    width: var(--dsh-indicator, 16px);
  }
  .hs-fb-switch[aria-checked="true"]:active:not(:disabled) .hs-fb-thumb {
    transform: translateX(16px);
  }
}
@media (prefers-contrast: more) {
  .hs-fb-switch:not([aria-checked="true"]) {
    border-color: var(--dsh-control-border);
  }
}
@media (forced-colors: active) {
  .hs-fb-switch {
    border-color: ButtonText;
  }
  .hs-fb-switch[aria-checked="true"] {
    background-color: Highlight;
    border-color: Highlight;
  }
  .hs-fb-thumb {
    background: ButtonText;
  }
  .hs-fb-switch[aria-checked="true"] .hs-fb-thumb {
    background: HighlightText;
  }
}
`;
		//#endregion
		//#region ../packages/dsh-ui/src/style-sheet.ts
		/**
		* @kewen/dsh-ui 样式挂载与多插件版本仲裁（08.3.5）：
		* - 每个基础原语块以 <style data-dsh-ui="blockName" data-ver="x.y.z" data-refs="n"> 挂载至 document.head；
		* - 同名块已存在时按 semver 比较版本：现存版本 >= 当前版本则复用并递增引用计数，低于当前版本则原地升级内容与版本号并递增引用计数；
		* - 返回幂等卸载函数，仅当 data-refs 归零时移除 <style> 节点，杜绝单插件卸载误删其他插件正在使用的共享样式。
		*/
		const UI_STYLE_VERSION = "0.2.22";
		function parseSemver(version) {
			const parts = (version.trim().replace(/^v/i, "").split("-")[0] ?? "0.0.0").split(".");
			return [
				Number.parseInt(parts[0] ?? "0", 10) || 0,
				Number.parseInt(parts[1] ?? "0", 10) || 0,
				Number.parseInt(parts[2] ?? "0", 10) || 0
			];
		}
		function compareSemver(a, b) {
			const [aMaj, aMin, aPat] = parseSemver(a);
			const [bMaj, bMin, bPat] = parseSemver(b);
			if (aMaj !== bMaj) return aMaj - bMaj;
			if (aMin !== bMin) return aMin - bMin;
			return aPat - bPat;
		}
		function findStyleByAttr(head, attrName, attrVal) {
			if (typeof head.querySelector === "function") {
				const found = head.querySelector(`style[${attrName}="${attrVal}"]`);
				if (found) return found;
			}
			const nodes = head.children ?? head.childNodes ?? [];
			for (let i = 0; i < nodes.length; i += 1) {
				const node = nodes[i];
				if (node && typeof node.tagName === "string" && node.tagName.toLowerCase() === "style" && node.getAttribute?.(attrName) === attrVal) return node;
			}
			return null;
		}
		/**
		* 幂等挂载插件私有样式表并返回卸载清理函数；重复调用只原地更新内容，不重复造节点。
		*/
		function injectPluginStyles(styleId, css) {
			if (typeof document === "undefined" || !document.head) return () => {};
			let style = findStyleByAttr(document.head, "data-plugin-css", styleId);
			if (style === null) {
				style = document.createElement("style");
				style.setAttribute("data-plugin-css", styleId);
				if (style.dataset) style.dataset.pluginCss = styleId;
				document.head.appendChild(style);
			}
			style.textContent = css;
			const owned = style;
			let disposed = false;
			return () => {
				if (disposed) return;
				disposed = true;
				owned.remove();
			};
		}
		/**
		* 按块名与版本号仲裁挂载 @kewen/dsh-ui 共享样式块，带幂等引用计数卸载。
		*/
		function mountUiStyle(blockName, css, version = UI_STYLE_VERSION) {
			if (typeof document === "undefined" || !document.head) return () => {};
			const head = document.head;
			let style = findStyleByAttr(head, "data-dsh-ui", blockName);
			if (style === null) {
				style = document.createElement("style");
				style.setAttribute("data-dsh-ui", blockName);
				style.setAttribute("data-ver", version);
				style.setAttribute("data-refs", "1");
				style.textContent = css;
				head.appendChild(style);
			} else {
				const existingVer = style.getAttribute("data-ver") ?? "0.0.0";
				const prevRefs = Math.max(0, Number.parseInt(style.getAttribute("data-refs") ?? "0", 10) || 0);
				if (compareSemver(existingVer, version) < 0) {
					style.textContent = css;
					style.setAttribute("data-ver", version);
				}
				style.setAttribute("data-refs", String(prevRefs + 1));
			}
			const target = style;
			let disposed = false;
			return () => {
				if (disposed) return;
				disposed = true;
				const currentRefs = Math.max(0, Number.parseInt(target.getAttribute("data-refs") ?? "1", 10) || 0);
				const nextRefs = Math.max(0, currentRefs - 1);
				target.setAttribute("data-refs", String(nextRefs));
				if (nextRefs === 0) target.remove();
			};
		}
		/**
		* 批量挂载多个 @kewen/dsh-ui 共享样式块，返回合并的幂等卸载函数。
		*/
		function mountUiStyles(blocks, version = UI_STYLE_VERSION) {
			const disposers = blocks.map(([blockName, css]) => mountUiStyle(blockName, css, version));
			let disposed = false;
			return () => {
				if (disposed) return;
				disposed = true;
				for (let i = disposers.length - 1; i >= 0; i -= 1) disposers[i]?.();
			};
		}
		//#endregion
		//#region ../packages/dsh-ui/src/Toast.tsx
		const toastCss = `
.hs-toast,
.toast-demo {
  --dsh-r-outer: 18px;
  --dsh-pad: 4px;
  height: var(--dsh-control-md, 36px);
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: max-content;
  max-width: min(440px, calc(100vw - 32px));
  padding: 0 14px;
  border-radius: 999px;
  corner-shape: round;
  background: var(--dsh-toast-bg);
  color: var(--dsh-toast-fg);
  box-shadow: var(--dsh-toast-shadow);
  font-family: var(--dsw-font-family, inherit);
  font-size: var(--dsh-text-md, 13px);
  font-weight: 500;
  line-height: 1;
}
.toast-demo {
  position: relative;
  max-width: min(440px, 100%);
}
.hs-toast {
  position: fixed;
  top: 40px;
  left: 50%;
  z-index: 1400;
  opacity: 0;
  transform: translate(-50%, -6px);
  pointer-events: none;
  /* 退场只淡出不位移：位移复位延后到淡出结束 */
  transition:
    opacity var(--dsh-dur-pop, 150ms) ease,
    transform 0s linear var(--dsh-dur-pop, 150ms);
}
.hs-toast.hs-toast-on {
  opacity: 1;
  transform: translate(-50%, 0);
  pointer-events: auto;
  transition:
    opacity var(--dsh-dur-pop, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1)),
    transform var(--dsh-dur-pop, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.hs-toast.hs-toast-has-act,
.hs-toast:has(> .hs-toast-btn),
.toast-demo:has(> button:not([hidden])) {
  padding-right: var(--dsh-pad);
}
.hs-toast-lead,
.toast-lead {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
}
.hs-toast-msg,
.toast-lead > span:last-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.hs-toast-ico,
.toast-ico {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: 16px;
  height: 16px;
  font-size: var(--dsh-text-xl, 16px);
}
.hs-toast-ico svg,
.toast-ico .dsh-i {
  stroke-width: 2;
}
.hs-toast-ico.is-ok,
.toast-ico.is-ok {
  color: var(--dsh-toast-ok);
}
.hs-toast-ico.is-warn,
.toast-ico.is-warn {
  color: var(--dsh-toast-warn);
}
.hs-toast-ico.is-err,
.toast-ico.is-err {
  color: var(--dsh-toast-err);
}
.toast-ico[hidden] {
  display: none;
}
/* 28px 同心胶囊按钮（R14 + 4px 边距 = 外框 R18 正圆同心） */
.hs-toast-btn,
.toast-demo button {
  all: unset;
  box-sizing: border-box;
  flex: none;
  height: var(--dsh-control-sm, 28px);
  padding: 0 10px;
  border-radius: 999px;
  corner-shape: round;
  background: var(--dsh-toast-btn-bg);
  color: var(--dsh-toast-fg);
  font-size: var(--dsh-text-sm, 12px);
  font-weight: 500;
  line-height: var(--dsh-control-sm, 28px);
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition:
    background var(--dsh-dur-hover, 120ms) ease,
    transform var(--dsh-dur-release, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.toast-demo button[hidden] {
  display: none;
}
.hs-toast-btn:active,
.toast-demo button:active {
  transform: scale(.96);
  transition-duration: var(--dsh-dur-press, 60ms);
  transition-timing-function: var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.hs-toast-btn:focus-visible,
.toast-demo button:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsh-toast-focus-ring, var(--dsh-focus-ring-color));
  outline-offset: -2px;
}
@media (hover: hover) {
  .hs-toast-btn:hover,
  .toast-demo button:hover {
    background: var(--dsh-toast-btn-hover);
  }
}
@media (prefers-reduced-motion: reduce) {
  .hs-toast,
  .hs-toast.hs-toast-on {
    transition: none;
  }
}
`;
		//#endregion
		//#region ../packages/dsh-ui/src/tokens.ts
		/**
		* 核心基座样式表（01 官方原生动态基线 + Alpaca 按需激活表面与双阶同源清透毛玻璃 + 02 字号/控件尺寸标尺/曲率双轨 + 08 动效/锁帧/拖拽护盾）：
		* - :root 挂载标准控件与字号标尺（绝不覆写宿主 --dsw-corner-shape）；
		* - html[data-hs-active] 注入 --dsh-corner-shape: round；
		* - body / body[data-ds-dark-theme] 默认保持 100% 官方宿主同源动态派生基线（v0.2.3，禁用 dsh-harness-plus 时零 Alpaca 残留、零污染其他插件）；
		* - 仅当 html[data-hs-active]（预览 [data-standalone] / [data-dsh-force-focus] 兜底亦入）时，按需激活 Alpaca 主钮/交互信号与双阶同源清透毛玻璃（8px 小胶囊/输入框 + 13px 菜单/复合浮层）。
		*/
		const DSH_CODE_FONT_STACK = "\"SF Mono\", \"JetBrains Mono\", \"Fira Code\", ui-monospace, \"Roboto Mono\", \"Noto Sans Mono\", \"Droid Sans Mono\", Menlo, Monaco, Consolas, \"Liberation Mono\", \"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", sans-serif";
		const glassTokensCss = `
:root {
  --dsh-text-2xs: calc(10px * var(--dsh-text-scale, 1));
  --dsh-text-xs: calc(11px * var(--dsh-text-scale, 1));
  --dsh-text-sm: calc(12px * var(--dsh-text-scale, 1));
  --dsh-text-md: calc(13px * var(--dsh-text-scale, 1));
  --dsh-text-lg: calc(14px * var(--dsh-text-scale, 1));
  --dsh-text-xl: calc(16px * var(--dsh-text-scale, 1));
  --dsh-control-xs: 20px;
  --dsh-control-sm: 28px;
  --dsh-control-md: 36px;
  --dsh-control-lg: 44px;
  --dsh-row-sm: 32px;
  --dsh-row-md: 44px;
  --dsh-row-lg: 48px;
  --dsh-indicator: 16px;
  --dsh-row-inset: 14px;
  --dsh-dur-press: 60ms;
  --dsh-dur-hover: 120ms;
  --dsh-dur-release: 150ms;
  --dsh-dur-pop: 150ms;
  --dsh-dur-expand: 220ms;
  --dsh-dur-glide: 400ms;
  --dsh-dur-spin: 800ms;
  --dsh-ease-out: cubic-bezier(.22, 1, .36, 1);
}
html:root {
  --dsh-font-family-code-default: ${DSH_CODE_FONT_STACK};
}
html[data-hs-active] {
  --dsh-corner-shape: round;
}
html[data-dsh-theme-switching] *,
html[data-dsh-theme-switching] *::before,
html[data-dsh-theme-switching] *::after {
  transition: none !important;
}
html[data-dsh-dragging],
html[data-dsh-dragging] * {
  user-select: none !important;
}
html[data-dsh-dragging] iframe {
  pointer-events: none !important;
}
html[data-input-modality="pointer"] :is(
  button,
  [role="tab"],
  [role="menuitem"],
  [role="menuitemradio"],
  [role="menuitemcheckbox"],
  [role="option"],
  [role="switch"]
):focus-visible {
  outline: none;
}
body {
  --dsh-control-border: color-mix(in oklab, var(--dsw-alias-label-primary) 44%, transparent);
  --dsh-state-info-text: var(--dsw-alias-state-business-primary);
  --dsh-state-err-text: var(--dsw-alias-state-error-primary);
  --dsh-state-ok-text: color-mix(in oklch, var(--dsw-alias-state-success-primary) 64%, var(--dsw-alias-label-primary));
  --dsh-state-warn-text: color-mix(in oklch, var(--dsw-alias-state-warn-primary) 58%, var(--dsw-alias-label-primary));
  --dsh-surface-canvas: color-mix(in oklab, var(--dsw-alias-bg-module-platform) 78%, var(--dsw-alias-bg-base));
  --dsh-surface-card: var(--dsw-alias-bg-layer-1);
  --dsh-surface-floating: var(--dsw-alias-bg-layer-2);
  --dsh-surface-sunken: color-mix(in oklab, var(--dsw-alias-bg-module-platform) 97%, var(--dsw-alias-label-primary));
  --dsh-capsule-surface-fill: color-mix(in srgb, var(--dsw-alias-bg-layer-1) 80%, transparent);
  --dsh-capsule-surface-fill-hover: color-mix(in srgb, var(--dsw-alias-bg-layer-1) 88%, transparent);
  --dsh-capsule-backdrop-filter: blur(8px) saturate(1.3);
  --dsh-glass-shadow: inset 0 .5px 0 rgb(255 255 255 / .5), inset 0 0 0 .5px rgb(255 255 255 / .7), 0 0 0 .5px rgb(0 0 0 / .07), 0 8px 28px -8px rgb(0 0 0 / .14), 0 1px 3px rgb(0 0 0 / .05);
  --dsh-glass-shadow-pressed: inset 0 .5px 0 rgb(255 255 255 / .5), inset 0 0 0 .5px rgb(255 255 255 / .7), 0 0 0 .5px rgb(0 0 0 / .07), 0 12px 36px -8px rgb(0 0 0 / .14), 0 1px 3px rgb(0 0 0 / .05);
  --dsh-glass-inset: inset 0 .5px 0 rgb(255 255 255 / .5), inset 0 0 0 .5px rgb(255 255 255 / .7);
  --dsh-glass-outer: 0 0 0 .5px rgb(0 0 0 / .07), 0 8px 28px -8px rgb(0 0 0 / .14), 0 1px 3px rgb(0 0 0 / .05);
  --dsh-modal-shadow: inset 0 .5px 0 rgb(255 255 255 / .9), 0 0 0 .5px rgb(0 0 0 / .065), 0 22px 48px -12px rgb(0 0 0 / .18), 0 4px 12px -2px rgb(0 0 0 / .05);
  --dsh-menu-surface-fill: color-mix(in srgb, var(--dsw-alias-bg-layer-1) 80%, transparent);
  --dsh-menu-surface-fill-hover: color-mix(in srgb, var(--dsw-alias-bg-layer-1) 88%, transparent);
  --dsh-menu-backdrop-filter: blur(8px) saturate(1.3);
  --dsh-menu-glass-inset: var(--dsh-glass-inset);
  --dsh-menu-glass-outer: var(--dsh-glass-outer);
  --dsh-menu-glass-shadow: var(--dsh-glass-shadow);
  --dsh-optical-surface-fill: linear-gradient(180deg, color-mix(in srgb, var(--dsw-alias-bg-layer-1) 97%, transparent) 0%, color-mix(in srgb, var(--dsw-alias-bg-layer-2) 94%, transparent) 100%);
  --dsh-optical-surface-fill-hover: linear-gradient(180deg, color-mix(in srgb, var(--dsw-alias-bg-layer-1) 99%, transparent) 0%, color-mix(in srgb, var(--dsw-alias-bg-layer-1) 97%, transparent) 100%);
  --dsh-optical-glass-inset: inset 0 .5px 0 rgb(255 255 255 / .75), inset 0 0 0 .5px rgb(255 255 255 / .8);
  --dsh-optical-glass-shadow: var(--dsh-optical-glass-inset), var(--dsh-glass-outer);
  --dsh-composer-todo-bg: var(--dsh-capsule-surface-fill);
  --dsh-composer-todo-shadow: var(--dsh-glass-shadow);
  --dsh-composer-foot-shadow: 0 1px 2px rgb(255 255 255 / .6);
  --dsh-subtle-fill: color-mix(in srgb, var(--dsw-alias-label-primary) 3%, transparent);
  --dsh-subtle-fill-hover: color-mix(in srgb, var(--dsw-alias-label-primary) 4.7%, transparent);
  --dsh-subtle-fill-active: color-mix(in srgb, var(--dsw-alias-label-primary) 6%, transparent);
  --dsh-toolbar-fill: color-mix(in srgb, var(--dsw-alias-label-primary) 4.2%, transparent);
  --dsh-toolbar-fill-hover: color-mix(in srgb, var(--dsw-alias-label-primary) 7.2%, transparent);
  --dsh-toolbar-fill-active: color-mix(in srgb, var(--dsw-alias-label-primary) 10.2%, transparent);
  --dsh-solid-on-color: var(--dsw-alias-label-primary-foreground);
  --dsh-slider-thumb-bg: var(--dsw-alias-switch-thumb, var(--dsw-alias-bg-base));
  --dsh-tooltip-fg: var(--dsh-solid-on-color);
  --dsh-tooltip-kbd-bg: color-mix(in srgb, var(--dsh-tooltip-fg) 16%, transparent);
  --dsh-focus-ring-color: var(--dsw-alias-state-business-primary);
  --dsh-brand-fill: color-mix(in oklab, var(--dsw-alias-label-primary) 85%, var(--dsw-alias-bg-base));
  --dsh-brand-fill-hover: color-mix(in oklab, var(--dsh-brand-fill) 90%, var(--dsw-alias-bg-base));
  --dsh-cta-bg: var(--dsh-brand-fill);
  --dsh-cta-bg-hover: var(--dsh-brand-fill-hover);
  --dsh-cta-fg: var(--dsw-alias-label-primary-foreground);
  --dsh-cta-shadow: none;
  --dsh-switch-active-bg: var(--dsh-brand-fill);
  --dsh-switch-active-thumb-shadow: none;
  --dsh-accent-fill: var(--dsh-brand-fill);
  --dsh-accent-border: var(--dsh-brand-fill);
  --dsh-accent-on-color: var(--dsw-alias-label-primary-foreground);
  --dsh-danger-solid-bg: var(--dsw-alias-state-error-primary);
  --dsh-danger-solid-hover: color-mix(in oklab, var(--dsh-danger-solid-bg) 88%, var(--dsw-alias-label-primary-foreground));
  --dsh-toast-bg: var(--dsh-brand-fill);
  --dsh-toast-fg: var(--dsw-alias-label-primary-foreground);
  --dsh-toast-focus-ring: color-mix(in oklab, var(--dsw-alias-state-business-primary) 68%, var(--dsh-toast-fg));
  --dsh-toast-shadow: inset 0 .5px 0 rgb(255 255 255 / .12), 0 8px 24px -4px rgb(0 0 0 / .22), 0 2px 6px 0 rgb(0 0 0 / .12);
  --dsh-toast-btn-bg: color-mix(in srgb, var(--dsh-toast-fg) 14%, transparent);
  --dsh-toast-btn-hover: color-mix(in srgb, var(--dsh-toast-fg) 22%, transparent);
  --dsh-toast-ok: var(--dsw-alias-state-success-primary);
  --dsh-toast-warn: color-mix(in oklab, var(--dsw-alias-state-warn-primary) 85%, var(--dsh-toast-fg));
  --dsh-toast-err: color-mix(in oklab, var(--dsw-alias-state-error-primary) 74%, var(--dsh-toast-fg));
  --dsh-scrollbar-width: 5px;
  --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l1);
  --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l1);
}
body[data-ds-dark-theme],
html[data-theme="dark"] body {
  --dsh-control-border: color-mix(in oklab, var(--dsw-alias-label-primary) 44%, transparent);
  --dsh-state-info-text: var(--dsw-alias-state-business-primary);
  --dsh-state-err-text: var(--dsw-alias-state-error-primary);
  --dsh-state-ok-text: color-mix(in oklch, var(--dsw-alias-state-success-primary) 82%, var(--dsw-alias-label-primary));
  --dsh-state-warn-text: color-mix(in oklch, var(--dsw-alias-state-warn-primary) 86%, var(--dsw-alias-label-primary));
  --dsh-surface-canvas: var(--dsw-alias-bg-base);
  --dsh-surface-card: var(--dsw-alias-bg-layer-1);
  --dsh-surface-floating: var(--dsw-alias-bg-layer-2);
  --dsh-surface-sunken: color-mix(in oklab, var(--dsw-alias-bg-base) 72%, var(--dsw-alias-bg-layer-1));
  --dsh-capsule-surface-fill: color-mix(in srgb, color-mix(in oklab, var(--dsw-alias-bg-base) 65%, var(--dsw-alias-bg-layer-1)) 66%, transparent);
  --dsh-capsule-surface-fill-hover: color-mix(in srgb, color-mix(in oklab, var(--dsw-alias-bg-base) 65%, var(--dsw-alias-bg-layer-1)) 74%, transparent);
  --dsh-capsule-backdrop-filter: blur(8px) saturate(1.3);
  --dsh-glass-shadow: inset 0 .5px 0 rgb(255 255 255 / .09), inset 0 0 0 .5px rgb(255 255 255 / .08), 0 0 0 .5px rgb(0 0 0 / .4), 0 8px 28px -8px rgb(0 0 0 / .14), 0 1px 3px rgb(0 0 0 / .3);
  --dsh-glass-shadow-pressed: inset 0 .5px 0 rgb(255 255 255 / .09), inset 0 0 0 .5px rgb(255 255 255 / .08), 0 0 0 .5px rgb(0 0 0 / .4), 0 12px 36px -8px rgb(0 0 0 / .14), 0 1px 3px rgb(0 0 0 / .3);
  --dsh-glass-inset: inset 0 .5px 0 rgb(255 255 255 / .09), inset 0 0 0 .5px rgb(255 255 255 / .08);
  --dsh-glass-outer: 0 0 0 .5px rgb(0 0 0 / .4), 0 8px 28px -8px rgb(0 0 0 / .14), 0 1px 3px rgb(0 0 0 / .3);
  --dsh-modal-shadow: inset 0 .5px 0 rgb(255 255 255 / .11), inset 0 0 0 .5px rgb(255 255 255 / .07), 0 0 0 .5px rgb(0 0 0 / .6), 0 24px 52px -12px rgb(0 0 0 / .62), 0 6px 16px -2px rgb(0 0 0 / .38);
  --dsh-menu-surface-fill: color-mix(in srgb, color-mix(in oklab, var(--dsw-alias-bg-base) 65%, var(--dsw-alias-bg-layer-1)) 66%, transparent);
  --dsh-menu-surface-fill-hover: color-mix(in srgb, color-mix(in oklab, var(--dsw-alias-bg-base) 65%, var(--dsw-alias-bg-layer-1)) 74%, transparent);
  --dsh-menu-backdrop-filter: blur(8px) saturate(1.3);
  --dsh-menu-glass-inset: var(--dsh-glass-inset);
  --dsh-menu-glass-outer: var(--dsh-glass-outer);
  --dsh-menu-glass-shadow: var(--dsh-glass-shadow);
  --dsh-optical-surface-fill: linear-gradient(180deg, color-mix(in srgb, color-mix(in oklab, var(--dsw-alias-bg-layer-2) 97%, var(--dsw-alias-label-primary)) 95%, transparent) 0%, color-mix(in srgb, color-mix(in oklab, var(--dsw-alias-bg-base) 45%, var(--dsw-alias-bg-layer-2)) 93%, transparent) 100%);
  --dsh-optical-surface-fill-hover: linear-gradient(180deg, color-mix(in srgb, color-mix(in oklab, var(--dsw-alias-bg-layer-2) 94%, var(--dsw-alias-label-primary)) 97%, transparent) 0%, color-mix(in srgb, color-mix(in oklab, var(--dsw-alias-bg-base) 35%, var(--dsw-alias-bg-layer-2)) 95%, transparent) 100%);
  --dsh-optical-glass-inset: inset 0 .5px 0 rgb(255 255 255 / .13), inset 0 0 0 .5px rgb(255 255 255 / .08);
  --dsh-optical-glass-shadow: var(--dsh-optical-glass-inset), var(--dsh-glass-outer);
  --dsh-composer-todo-bg: var(--dsh-capsule-surface-fill);
  --dsh-composer-todo-shadow: var(--dsh-glass-shadow);
  --dsh-composer-foot-shadow: 0 1px 2px rgb(0 0 0 / .5);
  --dsh-subtle-fill: color-mix(in srgb, var(--dsw-alias-label-primary) 5.5%, transparent);
  --dsh-subtle-fill-hover: color-mix(in srgb, var(--dsw-alias-label-primary) 7.6%, transparent);
  --dsh-subtle-fill-active: color-mix(in srgb, var(--dsw-alias-label-primary) 9.6%, transparent);
  --dsh-toolbar-fill: color-mix(in srgb, var(--dsw-alias-label-primary) 6.2%, transparent);
  --dsh-toolbar-fill-hover: color-mix(in srgb, var(--dsw-alias-label-primary) 10.5%, transparent);
  --dsh-toolbar-fill-active: color-mix(in srgb, var(--dsw-alias-label-primary) 14%, transparent);
  --dsh-solid-on-color: var(--dsw-alias-label-primary);
  --dsh-slider-thumb-bg: var(--dsw-alias-label-primary);
  --dsh-tooltip-fg: var(--dsh-solid-on-color);
  --dsh-tooltip-kbd-bg: color-mix(in srgb, var(--dsh-tooltip-fg) 16%, transparent);
  --dsh-focus-ring-color: var(--dsw-alias-state-business-primary);
  --dsh-brand-fill: color-mix(in oklab, var(--dsw-alias-label-primary) 93%, var(--dsw-alias-bg-base));
  --dsh-brand-fill-hover: var(--dsw-alias-label-primary);
  --dsh-cta-bg: var(--dsh-brand-fill);
  --dsh-cta-bg-hover: var(--dsh-brand-fill-hover);
  --dsh-cta-fg: var(--dsw-alias-label-primary-foreground);
  --dsh-cta-shadow: none;
  --dsh-switch-active-bg: var(--dsh-brand-fill);
  --dsh-switch-active-thumb-shadow: none;
  --dsh-accent-fill: var(--dsh-brand-fill);
  --dsh-accent-border: var(--dsh-brand-fill);
  --dsh-accent-on-color: var(--dsw-alias-label-primary-foreground);
  --dsh-danger-solid-bg: color-mix(in oklab, var(--dsw-alias-state-error-primary) 82%, var(--dsw-alias-bg-base));
  --dsh-danger-solid-hover: color-mix(in oklab, var(--dsh-danger-solid-bg) 90%, var(--dsw-alias-label-primary));
  --dsh-toast-bg: var(--dsh-brand-fill);
  --dsh-toast-fg: var(--dsw-alias-label-primary-foreground);
  --dsh-toast-focus-ring: color-mix(in oklab, var(--dsw-alias-state-business-primary) 62%, var(--dsh-toast-fg));
  --dsh-toast-shadow: 0 0 0 .5px rgb(255 255 255 / .85), 0 12px 32px -6px rgb(0 0 0 / .58), 0 4px 10px 0 rgb(0 0 0 / .36);
  --dsh-toast-btn-bg: color-mix(in srgb, var(--dsh-toast-fg) 8%, transparent);
  --dsh-toast-btn-hover: color-mix(in srgb, var(--dsh-toast-fg) 15%, transparent);
  --dsh-toast-ok: color-mix(in oklab, var(--dsw-alias-state-success-primary) 68%, var(--dsh-toast-fg));
  --dsh-toast-warn: color-mix(in oklab, var(--dsw-alias-state-warn-primary) 62%, var(--dsh-toast-fg));
  --dsh-toast-err: color-mix(in oklab, var(--dsw-alias-state-error-primary) 78%, var(--dsh-toast-fg));
  --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l1);
  --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l1);
}
:is(html[data-hs-active], html[data-standalone], html[data-dsh-force-focus]):not([data-theme="dark"]) body:not([data-ds-dark-theme]) {
  --dsh-control-border: color-mix(in oklab, var(--dsw-alias-label-primary) 48%, transparent);
  --dsh-state-info-text: color-mix(in oklab, rgb(51 125 244) 79%, var(--dsw-alias-label-primary));
  --dsh-state-info-bg: rgb(51 125 244 / .1);
  --dsh-state-ok-text: color-mix(in oklab, rgb(0 165 88) 72%, var(--dsw-alias-label-primary));
  --dsh-state-ok-bg: rgb(62 237 155 / .2);
  --dsh-state-warn-text: color-mix(in oklab, rgb(245 142 58) 62%, var(--dsw-alias-label-primary));
  --dsh-state-warn-bg: rgb(245 142 58 / .12);
  --dsh-state-err-text: color-mix(in oklab, rgb(245 59 58) 75%, var(--dsw-alias-label-primary));
  --dsh-state-err-bg: rgb(245 59 58 / .12);
  --dsh-state-violet-text: color-mix(in oklab, rgb(149 108 222) 78%, var(--dsw-alias-label-primary));
  --dsh-state-violet-bg: rgb(149 108 222 / .12);
  --dsh-surface-canvas: color-mix(in srgb, var(--dsw-alias-bg-module-platform) 55%, var(--dsw-alias-bg-base));
  --dsh-surface-sunken: var(--dsw-alias-bg-module-platform);
  --dsh-capsule-surface-fill: rgb(255 255 255 / .8);
  --dsh-capsule-surface-fill-hover: rgb(255 255 255 / .88);
  --dsh-menu-surface-fill: rgb(255 255 255 / .83);
  --dsh-menu-surface-fill-hover: rgb(255 255 255 / .91);
  --dsh-menu-backdrop-filter: blur(13px) saturate(1.3);
  --dsh-menu-glass-inset: inset 0 .5px 0 rgb(255 255 255 / .5), inset 0 0 0 .5px rgb(255 255 255 / .7);
  --dsh-menu-glass-outer: 0 0 0 .5px rgb(0 0 0 / .07), 0 10px 28px -8px rgb(0 0 0 / .14), 0 1px 4px rgb(0 0 0 / .05);
  --dsh-menu-glass-shadow: inset 0 .5px 0 rgb(255 255 255 / .5), inset 0 0 0 .5px rgb(255 255 255 / .7), 0 0 0 .5px rgb(0 0 0 / .07), 0 10px 28px -8px rgb(0 0 0 / .14), 0 1px 4px rgb(0 0 0 / .05);
  --dsh-optical-surface-fill: linear-gradient(180deg, rgb(255 255 255 / .97) 0%, rgb(248 248 250 / .94) 100%);
  --dsh-optical-surface-fill-hover: linear-gradient(180deg, rgb(255 255 255 / .99) 0%, rgb(252 252 253 / .97) 100%);
  --dsh-solid-on-color: rgb(255 255 255);
  --dsh-tooltip-fg: var(--dsw-alias-label-primary-foreground);
  --dsh-brand-fill: rgb(54 54 54);
  --dsh-brand-fill-hover: rgb(72 72 72);
  --dsh-cta-bg: var(--dsh-brand-fill);
  --dsh-cta-bg-hover: var(--dsh-brand-fill-hover);
  --dsh-cta-fg: rgb(255 255 255);
  --dsh-cta-shadow: inset 0 .5px 0 rgb(255 255 255 / .16), 0 1px 2px rgb(0 0 0 / .1);
  --dsh-switch-active-bg: rgb(49 124 255);
  --dsh-switch-active-thumb-shadow: 0 1px 2px rgb(0 0 0 / .22);
  --dsh-accent-fill: rgb(49 124 255);
  --dsh-accent-border: rgb(49 124 255);
  --dsh-accent-on-color: rgb(255 255 255);
  --dsh-danger-solid-bg: rgb(245 59 58);
  --dsh-danger-solid-hover: color-mix(in oklab, var(--dsh-danger-solid-bg) 88%, rgb(255 255 255));
  --dsh-toast-bg: rgb(38 38 40);
  --dsh-toast-fg: rgb(255 255 255);
}
:is(html[data-hs-active], html[data-standalone], html[data-dsh-force-focus]) body[data-ds-dark-theme],
:is(html[data-hs-active], html[data-standalone], html[data-dsh-force-focus])[data-theme="dark"] body {
  --dsh-control-border: color-mix(in oklab, var(--dsw-alias-label-primary) 48%, transparent);
  --dsh-state-info-text: color-mix(in oklab, rgb(51 125 244) 62%, var(--dsw-alias-label-primary));
  --dsh-state-info-bg: rgb(51 125 244 / .1);
  --dsh-state-ok-text: rgb(0 236 126);
  --dsh-state-ok-bg: rgb(0 236 126 / .08);
  --dsh-state-warn-text: color-mix(in oklab, rgb(245 142 58) 96%, var(--dsw-alias-label-primary));
  --dsh-state-warn-bg: rgb(245 142 58 / .08);
  --dsh-state-err-text: color-mix(in oklab, rgb(245 59 58) 68%, var(--dsw-alias-label-primary));
  --dsh-state-err-bg: rgb(245 59 58 / .12);
  --dsh-state-violet-text: color-mix(in oklab, rgb(149 108 222) 65%, var(--dsw-alias-label-primary));
  --dsh-state-violet-bg: rgb(149 108 222 / .12);
  --dsh-brand-fill: rgb(249 249 249);
  --dsh-brand-fill-hover: rgb(228 228 228);
  --dsh-surface-sunken: color-mix(in srgb, var(--dsw-alias-bg-base) 78%, rgb(0 0 0));
  --dsh-capsule-surface-fill: rgb(32 32 32 / .66);
  --dsh-capsule-surface-fill-hover: rgb(36 36 36 / .74);
  --dsh-menu-surface-fill: rgb(32 32 32 / .7);
  --dsh-menu-surface-fill-hover: rgb(36 36 36 / .78);
  --dsh-menu-backdrop-filter: blur(13px) saturate(1.3);
  --dsh-menu-glass-inset: inset 0 .5px 0 rgb(255 255 255 / .09), inset 0 0 0 .5px rgb(255 255 255 / .08);
  --dsh-menu-glass-outer: 0 0 0 .5px rgb(0 0 0 / .4), 0 10px 28px -8px rgb(0 0 0 / .22), 0 1px 4px rgb(0 0 0 / .3);
  --dsh-menu-glass-shadow: inset 0 .5px 0 rgb(255 255 255 / .09), inset 0 0 0 .5px rgb(255 255 255 / .08), 0 0 0 .5px rgb(0 0 0 / .4), 0 10px 28px -8px rgb(0 0 0 / .22), 0 1px 4px rgb(0 0 0 / .3);
  --dsh-optical-surface-fill: linear-gradient(180deg, rgb(42 42 45 / .95) 0%, rgb(30 30 32 / .93) 100%);
  --dsh-optical-surface-fill-hover: linear-gradient(180deg, rgb(48 48 52 / .97) 0%, rgb(35 35 38 / .95) 100%);
  --dsh-solid-on-color: rgb(255 255 255);
  --dsh-tooltip-fg: var(--dsw-alias-label-primary);
  --dsh-cta-bg: var(--dsh-brand-fill);
  --dsh-cta-bg-hover: var(--dsh-brand-fill-hover);
  --dsh-cta-fg: rgb(0 0 0);
  --dsh-cta-shadow: 0 1px 2px rgb(0 0 0 / .3);
  --dsh-switch-active-bg: rgb(68 137 255);
  --dsh-switch-active-thumb-shadow: 0 1px 2px rgb(0 0 0 / .22);
  --dsh-accent-fill: rgb(68 137 255);
  --dsh-accent-border: rgb(68 137 255);
  --dsh-accent-on-color: rgb(255 255 255);
  --dsh-danger-solid-bg: rgb(245 59 58);
  --dsh-danger-solid-hover: color-mix(in oklab, var(--dsh-danger-solid-bg) 90%, rgb(255 255 255));
  --dsh-toast-bg: rgb(44 44 46);
  --dsh-toast-fg: var(--dsw-alias-label-primary);
  --dsh-toast-focus-ring: color-mix(in oklab, var(--dsw-alias-state-business-primary) 68%, var(--dsh-toast-fg));
  --dsh-toast-shadow: inset 0 .5px 0 rgb(255 255 255 / .14), 0 0 0 .5px rgb(0 0 0 / .6), 0 12px 32px -6px rgb(0 0 0 / .55);
  --dsh-toast-btn-bg: color-mix(in srgb, var(--dsh-toast-fg) 12%, transparent);
  --dsh-toast-btn-hover: color-mix(in srgb, var(--dsh-toast-fg) 20%, transparent);
  --dsh-toast-ok: var(--dsw-alias-state-success-primary);
  --dsh-toast-warn: color-mix(in oklab, var(--dsw-alias-state-warn-primary) 85%, var(--dsh-toast-fg));
}
::-webkit-scrollbar {
  width: var(--dsh-scrollbar-width, 5px);
  height: var(--dsh-scrollbar-width, 5px);
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  corner-shape: round;
  border-radius: 999px;
  background: var(--dsh-scrollbar-thumb);
}
@media (hover: hover) {
  ::-webkit-scrollbar-thumb:hover {
    background-color: var(--dsh-scrollbar-thumb-hover);
  }
}
.dsh-num {
  font-variant-numeric: tabular-nums;
}
.dsh-break-safe {
  overflow-wrap: anywhere;
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
  [data-hs-fade="scroll"] {
    animation-duration: auto !important;
    animation-iteration-count: 1 !important;
  }
  .dsh-spin,
  .dsh-spinner,
  .hs-spinner,
  .dsh-sdot-spin,
  .dsh-loading-spin,
  .hs-mark.is-spin {
    animation-duration: 1.8s !important;
    animation-iteration-count: infinite !important;
  }
  :is(.hs-btn, .dsh-ibtn, .icon-btn-md, .icon-btn-round, .icon-btn-xs, .dsh-select, .dsh-chip, .dsh-infotip-btn, .dsh-pop-star, .dsh-search-clear, .dsh-pwd-eye, .dsh-modal-close, .hs-toast-btn):active {
    transform: none !important;
  }
}
html[data-dsh-reduce-motion] *,
html[data-dsh-reduce-motion] *::before,
html[data-dsh-reduce-motion] *::after {
  animation-duration: .01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: .01ms !important;
  scroll-behavior: auto !important;
}
html[data-dsh-reduce-motion] [data-hs-fade="scroll"] {
  animation-duration: auto !important;
  animation-iteration-count: 1 !important;
}
html[data-dsh-reduce-motion] .dsh-spin,
html[data-dsh-reduce-motion] .dsh-spinner,
html[data-dsh-reduce-motion] .hs-spinner,
html[data-dsh-reduce-motion] .dsh-sdot-spin,
html[data-dsh-reduce-motion] .dsh-loading-spin,
html[data-dsh-reduce-motion] .hs-mark.is-spin {
  animation-duration: 1.8s !important;
  animation-iteration-count: infinite !important;
}
html[data-dsh-reduce-motion] :is(.hs-btn, .dsh-ibtn, .icon-btn-md, .icon-btn-round, .icon-btn-xs, .dsh-select, .dsh-chip, .dsh-infotip-btn, .dsh-pop-star, .dsh-search-clear, .dsh-pwd-eye, .dsh-modal-close, .hs-toast-btn):active {
  transform: none !important;
}
.dsh-capsule-glass {
  position: relative;
  isolation: isolate;
  background: transparent;
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
  box-shadow: var(--dsh-glass-outer, var(--dsh-glass-shadow));
}
.dsh-capsule-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  border-radius: inherit;
  corner-shape: inherit;
  background: var(--dsh-capsule-surface-fill);
  -webkit-backdrop-filter: var(--dsh-capsule-backdrop-filter);
  backdrop-filter: var(--dsh-capsule-backdrop-filter);
  box-shadow: var(--dsh-glass-inset);
  transition: background-color var(--dsh-dur-hover, 120ms) ease;
}
@media (hover: hover) {
  button.dsh-capsule-glass:hover:not(:disabled)::before,
  a.dsh-capsule-glass:hover::before,
  [role="button"].dsh-capsule-glass:hover:not([aria-disabled="true"])::before {
    background: var(--dsh-capsule-surface-fill-hover);
  }
}
@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
  body,
  body[data-ds-dark-theme],
  html[data-theme="dark"] body {
    --dsh-capsule-surface-fill: var(--dsh-surface-floating, var(--dsw-alias-bg-layer-2));
    --dsh-capsule-surface-fill-hover: var(--dsh-surface-floating, var(--dsw-alias-bg-layer-2));
    --dsh-menu-surface-fill: var(--dsh-surface-floating, var(--dsw-alias-bg-layer-2));
    --dsh-menu-surface-fill-hover: var(--dsh-surface-floating, var(--dsw-alias-bg-layer-2));
    --dsh-capsule-backdrop-filter: none;
    --dsh-menu-backdrop-filter: none;
  }
  .dsh-capsule-glass {
    box-shadow: 0 0 0 1px var(--dsw-alias-border-l4), var(--dsw-elevation-panel);
  }
  .dsh-capsule-glass::before {
    background: var(--dsh-surface-floating, var(--dsw-alias-bg-layer-2));
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    box-shadow: none;
  }
}
@media (prefers-contrast: more) {
  body,
  body[data-ds-dark-theme],
  html[data-theme="dark"] body {
    --dsh-control-border: color-mix(in oklab, var(--dsw-alias-label-primary) 72%, transparent);
    --dsh-subtle-fill-active: color-mix(in srgb, var(--dsw-alias-label-primary) 12%, transparent);
    --dsh-toolbar-fill: color-mix(in srgb, var(--dsw-alias-label-primary) 9%, transparent);
    --dsh-toolbar-fill-hover: color-mix(in srgb, var(--dsw-alias-label-primary) 14%, transparent);
    --dsh-modal-shadow: 0 0 0 1px var(--dsw-alias-border-l4), var(--dsw-elevation-prominent);
  }
}
html[data-dsh-reduce-trans] body {
  --dsh-capsule-surface-fill: var(--dsh-surface-floating, var(--dsw-alias-bg-layer-2));
  --dsh-capsule-surface-fill-hover: var(--dsh-surface-floating, var(--dsw-alias-bg-layer-2));
  --dsh-menu-surface-fill: var(--dsh-surface-floating, var(--dsw-alias-bg-layer-2));
  --dsh-menu-surface-fill-hover: var(--dsh-surface-floating, var(--dsw-alias-bg-layer-2));
  --dsh-capsule-backdrop-filter: none;
  --dsh-menu-backdrop-filter: none;
}
html[data-dsh-reduce-trans] .dsh-capsule-glass {
  box-shadow: 0 0 0 1px var(--dsw-alias-border-l4), var(--dsw-elevation-panel);
}
html[data-dsh-reduce-trans] .dsh-capsule-glass::before {
  background: var(--dsh-surface-floating, var(--dsw-alias-bg-layer-2));
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
  box-shadow: none;
}
.dsh-optical-glass {
  background: var(--dsh-optical-surface-fill);
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
  box-shadow: var(--dsh-optical-glass-shadow);
}
@media (hover: hover) {
  button.dsh-optical-glass:hover:not(:disabled),
  a.dsh-optical-glass:hover,
  [role="button"].dsh-optical-glass:hover:not([aria-disabled="true"]) {
    background: var(--dsh-optical-surface-fill-hover);
  }
}
@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
  .dsh-optical-glass {
    background: var(--dsh-surface-floating, var(--dsw-alias-bg-layer-2));
    box-shadow: 0 0 0 1px var(--dsw-alias-border-l4), var(--dsw-elevation-panel);
  }
}
html[data-dsh-reduce-trans] .dsh-optical-glass {
  background: var(--dsh-surface-floating, var(--dsw-alias-bg-layer-2));
  box-shadow: 0 0 0 1px var(--dsw-alias-border-l4), var(--dsw-elevation-panel);
}
`;
		/**
		* 侧栏与壁纸表面设计 token：
		* 挂在 [data-hs] 根节点上，五阶交互底色由宿主 specific-sidebar-* 经 oklab 同源插值派生；
		* 旧版 --hs-t1~t4 / --hs-card / --hs-line 等语义别名映射至官方与 --dsh-surface-* 变量，清零硬编码灰值同时保持向后兼容。
		*/
		const sidebarTokensCss = `${glassTokensCss}
[data-hs] {
  --hs-rest: color-mix(in oklab, var(--dsw-specific-sidebar-fill) 52%, var(--dsw-specific-sidebar-nav-item-hover, var(--dsw-alias-interactive-bg-hover)));
  --hs-rest-hover: color-mix(in oklab, var(--dsw-specific-sidebar-fill) 22%, var(--dsw-specific-sidebar-nav-item-hover, var(--dsw-alias-interactive-bg-hover)));
  --hs-hover: var(--dsw-specific-sidebar-nav-item-hover, var(--dsw-alias-interactive-bg-hover));
  --hs-press: color-mix(in oklab, var(--dsw-specific-sidebar-nav-item-hover, var(--dsw-alias-interactive-bg-hover)) 45%, var(--dsw-specific-sidebar-nav-item-active, var(--dsw-alias-interactive-bg-active)));
  --hs-sel: var(--dsw-specific-sidebar-nav-item-active, var(--dsw-alias-interactive-bg-active));
  --hs-ctl-fill: color-mix(in oklab, var(--dsw-specific-sidebar-nav-item-active, var(--dsw-alias-interactive-bg-active)) 94%, var(--dsw-alias-label-primary));
  --hs-canvas: var(--dsh-surface-canvas);
  --hs-panel: var(--dsw-specific-sidebar-fill, var(--dsh-surface-canvas));
  --hs-card: var(--dsh-surface-card);
  --hs-line: var(--dsw-alias-border-l2);
  --hs-line-strong: var(--dsw-alias-border-l3);
  --hs-t1: var(--dsw-alias-label-primary);
  --hs-t2: var(--dsw-alias-label-secondary);
  --hs-t3: var(--dsw-alias-label-tertiary);
  --hs-t4: var(--dsw-alias-label-caption);
  --hs-info: var(--dsw-alias-state-business-primary);
  --hs-warn: var(--dsw-alias-state-warn-primary);
  --hs-bad: var(--dsw-alias-state-error-primary);
  --hs-ok: var(--dsw-alias-state-success-primary);
  --hs-sh-pop: var(--dsw-elevation-prominent);
  --hs-font: var(--dsw-font-family, -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif);
  --hs-r-row: 10px;
  --hs-r-pop: var(--dsw-radius-lg, 16px);
  --hs-ease: var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
  font-family: var(--hs-font);
  font-weight: 400;
  color: var(--dsw-alias-label-primary);
  -webkit-font-smoothing: antialiased;
}
[data-hs-wallpaper] body [data-hs] {
  --hs-rest: color-mix(in srgb, var(--dsw-alias-label-primary) 1.4%, transparent);
  --hs-rest-hover: color-mix(in srgb, var(--dsw-alias-label-primary) 3.5%, transparent);
  --hs-hover: color-mix(in srgb, var(--dsw-alias-label-primary) 2.6%, transparent);
  --hs-press: color-mix(in srgb, var(--dsw-alias-label-primary) 4.6%, transparent);
  --hs-sel: color-mix(in srgb, var(--dsw-alias-label-primary) 6.2%, transparent);
  --hs-ctl-fill: color-mix(in srgb, var(--dsw-alias-label-primary) 7%, transparent);
}
[data-hs-wallpaper] body[data-ds-dark-theme] [data-hs],
[data-hs-wallpaper][data-theme="dark"] body [data-hs] {
  --hs-rest: color-mix(in srgb, var(--dsw-alias-label-primary) 2.5%, transparent);
  --hs-rest-hover: color-mix(in srgb, var(--dsw-alias-label-primary) 5.1%, transparent);
  --hs-hover: color-mix(in srgb, var(--dsw-alias-label-primary) 3.8%, transparent);
  --hs-press: color-mix(in srgb, var(--dsw-alias-label-primary) 6%, transparent);
  --hs-sel: color-mix(in srgb, var(--dsw-alias-label-primary) 8.8%, transparent);
  --hs-ctl-fill: color-mix(in srgb, var(--dsw-alias-label-primary) 10.5%, transparent);
}
`;
		/**
		* 双阶同源清透毛玻璃材质常量：
		* 1. 常态清透档（8px · composerGlass / capsuleGlass）：
		*    输入框单层卡片、待办胶囊、手机顶栏悬浮小胶囊共享浅 80% / 深 66% rgb(32 32 32) 同源抬升底 + blur(8px) saturate(1.3) + 0.5px 顶高光五层描边阴影；
		* 2. 浮层微柔档（13px · menuGlass / MenuSurface / Popover）：
		*    100% 沿用同一块底色与 0.5px 顶高光，仅做微距柔化（blur(13px) saturate(1.3)，浅 83% / 深 70%），轻柔化开底层聊天正文笔画锐角且零塑料雾感。
		*
		* 独立 ::before 毛玻璃合成三守则（.dsh-capsule-glass）：
		* 1) 滤镜与内容分家（模糊层 0 重绘 + 零 Backdrop Root）：backdrop-filter 与 --dsh-glass-inset 永远只挂在无子节点的空 ::before / .hs-msurf-material（z-index: -1）上；
		*    玻璃宿主保持 overflow: visible（可复用 .dsh-capsule-glass，挂 isolation: isolate; background: transparent 与 --dsh-glass-outer），
		*    严禁在玻璃宿主或祖先节点同时写 corner-shape: superellipse(...) + overflow: clip/hidden（会击穿硬件 RRectF 裁切并引发 kClipPath 4x 离屏 RenderPass 与 Backdrop Root），
		*    需内容裁切时必须下沉到内部 corner-shape: round 的独立子容器；
		* 2) 常驻玻璃错开、0 叠压：同屏多块独立 RRectF 真毛玻璃在 GPU 中并行批处理（无需限制同屏数量），
		*    但常驻浮层之间必须保持 0px 空间重叠、几何避让错开（如语音胶囊避让 36px 目标条），避免两层 backdrop-filter 垂直叠压触发串行回读阻塞；
		* 3) 禁无限呼吸与 N 节点合成层爆炸，自由位移走 translate3d：
		*    - 严禁在常驻状态点 / 胶囊上挂无限循环的 will-change: opacity 或连续 opacity/scale 呼吸动画（会导致静止页面 120Hz 全列 RenderPass 重合成及单帧整块闪隐）；
		*    - 严禁给 N 个重复 DOM 元素（如 20 根声波条）挂 will-change: transform / scaleY(...) 导致 PictureLayer 爆炸与 TileManager 内存告警，高频多柱波形必须改用单张微型 <canvas> 绘制；
		*    - 自由拖拽与位移动画统一走 transform: translate3d(...) 携独立 ::before 圆角矩形满帧跟手，严禁用多子路径 clip-path: path(...) 裁切单层 backdrop-filter（同节点触发 Chromium crbug.com/983237 外包围盒漏糊，外层包裹 clip-path / mask-image 则触发 CSS Backdrop Root 使内部模糊失效）。
		*/
		const TODO_GLASS_INSET_FALLBACK = ["inset 0 .5px 0 light-dark(rgb(255 255 255 / .5), rgb(255 255 255 / .09))", "inset 0 0 0 .5px light-dark(rgb(255 255 255 / .7), rgb(255 255 255 / .08))"].join(", ");
		const TODO_GLASS_OUTER_FALLBACK = [
			"0 0 0 .5px light-dark(rgb(0 0 0 / .07), rgb(0 0 0 / .4))",
			"0 8px 28px -8px light-dark(rgb(0 0 0 / .14), rgb(0 0 0 / .14))",
			"0 1px 3px light-dark(rgb(0 0 0 / .05), rgb(0 0 0 / .3))"
		].join(", ");
		const TODO_GLASS_EDGE_FALLBACK = `${TODO_GLASS_INSET_FALLBACK}, ${TODO_GLASS_OUTER_FALLBACK}`;
		const MENU_GLASS_OUTER_FALLBACK = [
			"0 0 0 .5px light-dark(rgb(0 0 0 / .07), rgb(0 0 0 / .4))",
			"0 10px 28px -8px light-dark(rgb(0 0 0 / .14), rgb(0 0 0 / .22))",
			"0 1px 4px light-dark(rgb(0 0 0 / .05), rgb(0 0 0 / .3))"
		].join(", ");
		const MENU_GLASS_EDGE_FALLBACK = `${TODO_GLASS_INSET_FALLBACK}, ${MENU_GLASS_OUTER_FALLBACK}`;
		`${TODO_GLASS_EDGE_FALLBACK}`, `${TODO_GLASS_INSET_FALLBACK}`, `${TODO_GLASS_OUTER_FALLBACK}`;
		`${TODO_GLASS_EDGE_FALLBACK}`, `${TODO_GLASS_INSET_FALLBACK}`, `${TODO_GLASS_OUTER_FALLBACK}`;
		`${MENU_GLASS_EDGE_FALLBACK}`, `${TODO_GLASS_INSET_FALLBACK}`, `${MENU_GLASS_OUTER_FALLBACK}`;
		const OPTICAL_GLASS_INSET_FALLBACK = ["inset 0 .5px 0 light-dark(rgb(255 255 255 / .75), rgb(255 255 255 / .13))", "inset 0 0 0 .5px light-dark(rgb(255 255 255 / .8), rgb(255 255 255 / .08))"].join(", ");
		`${OPTICAL_GLASS_INSET_FALLBACK}${TODO_GLASS_OUTER_FALLBACK}`, `${OPTICAL_GLASS_INSET_FALLBACK}`, `${TODO_GLASS_OUTER_FALLBACK}`;
		/**
		* 独立浏览器页（html[data-standalone]）专用宿主 --dsw-* 兜底表（内置于 dshUiFullCss / dist/dsh-ui.css）：
		* - 严格限定在 html[data-standalone] 作用域内，当子页面同源嵌入 DSH（html[data-embed]，无 data-standalone）
		*   或直接在宿主主文档中挂载时 100% 零命中、零污染裸 :root / body；
		* - 消除所有 iframe 插件单独在浏览器打开时手动复制 155 行 --dsw-* 兜底变量的负担。
		*/
		const standaloneHostFallbackCss = `
html[data-standalone] {
  --dsw-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  --ds-font-family-code: ${DSH_CODE_FONT_STACK};
  --ds-ease-in-out: cubic-bezier(.4, 0, .2, 1);
  --ds-transition-duration: .2s;
  --ds-transition-duration-fast: .1s;
  --ds-transition-duration-slow: .3s;
  --dsw-radius-xs: 4px;
  --dsw-radius-sm: 8px;
  --dsw-radius-md: 12px;
  --dsw-radius-lg: 16px;
  --dsw-radius-xl: 20px;
  --dsw-radius-panel: 28px;
  --dsw-focus-ring-width: 2px;
}
@supports (corner-shape: superellipse(1.5)) {
  html[data-standalone] { --dsw-corner-shape: superellipse(1.5); }
  :where(html[data-standalone]) *,
  :where(html[data-standalone]) ::before,
  :where(html[data-standalone]) ::after { corner-shape: var(--dsw-corner-shape); }
}
html[data-standalone] body {
  color-scheme: light;
  --dsw-alias-bg-base: #ffffff;
  --dsw-alias-bg-layer-1: #ffffff;
  --dsw-alias-bg-layer-2: #ffffff;
  --dsw-alias-bg-layer-3: #fafafa;
  --dsw-alias-bg-module-platform: #f6f6f7;
  --dsw-alias-bg-overlay: #ebecef;
  --dsw-alias-bg-mask-1: #0000003d;
  --dsw-alias-border-l1: rgb(0 0 0 / .045);
  --dsw-alias-border-l2: rgb(0 0 0 / .085);
  --dsw-alias-border-l3: rgb(0 0 0 / .13);
  --dsw-alias-border-l4: rgb(0 0 0 / .19);
  --dsw-alias-brand-primary: #363636;
  --dsw-alias-button-primary-fill: var(--dsw-alias-brand-primary);
  --dsw-alias-button-primary-hover: #484848;
  --dsw-alias-button-info-fill: #317cff;
  --dsw-alias-button-info-hover: #4d8dff;
  --dsw-alias-button-tool-bar-fill: #54555717;
  --dsw-alias-button-tool-bar-hover: #54555729;
  --dsw-alias-interactive-bg-hover: rgb(20 20 22 / .05);
  --dsw-alias-interactive-bg-hover-solid: #f2f2f4;
  --dsw-alias-interactive-bg-active: rgb(20 20 22 / .09);
  --dsw-alias-interactive-bg-hover-danger: #f53b3a0d;
  --dsw-alias-label-primary: #141416;
  --dsw-alias-label-primary-foreground: #ffffff;
  --dsw-alias-label-secondary: #5c5c63;
  --dsw-alias-label-tertiary: #787880;
  --dsw-alias-label-caption: #a6a6ae;
  --dsw-alias-label-dimmed: #e2e2e6;
  --dsw-alias-state-business-primary: #317cff;
  --dsw-alias-state-business-tertiary: #ebf3ff;
  --dsw-alias-state-error-primary: #f53b3a;
  --dsw-alias-state-success-primary: #22c55e;
  --dsw-alias-state-success-tertiary: #e6faed;
  --dsw-alias-state-warn-primary: #f58e3a;
  --dsw-alias-state-warn-tertiary: #fef5e7;
  --dsw-alias-state-warn-label: #dd8629;
  --dsw-alias-scrollbar-bg-l1: #e4e4e7;
  --dsw-alias-scrollbar-bg-l2: #e4e4e7;
  --dsw-alias-scrollbar-hover-l1: #d1d1d6;
  --dsw-alias-scrollbar-hover-l2: #d1d1d6;
  --dsw-alias-switch-thumb: #ffffff;
  --dsw-alias-tooltip-bg: #262628;
  --dsw-alias-markdown-code-block: #f6f6f7;
  --dsw-menu-surface-fill: rgb(255 255 255 / .83);
  --dsw-menu-backdrop-filter: blur(13px) saturate(1.3);
  --dsw-specific-sidebar-fill: #fbfbfc;
  --dsw-specific-sidebar-nav-item-hover: #f2f2f4;
  --dsw-specific-sidebar-nav-item-active: #ebebee;
  --dsw-specific-selector: #f3f3f5;
  --dsw-elevation-stroke-color: var(--dsw-alias-border-l4);
  --dsw-focus-ring-color: var(--dsw-alias-state-business-primary);
}
html[data-standalone] body[data-ds-dark-theme],
html[data-standalone][data-theme="dark"] body {
  color-scheme: dark;
  --dsw-alias-bg-base: #1a1a1a;
  --dsw-alias-bg-layer-1: #212121;
  --dsw-alias-bg-layer-2: #282828;
  --dsw-alias-bg-layer-3: #303030;
  --dsw-alias-bg-module-platform: #252526;
  --dsw-alias-bg-overlay: #5c5c63;
  --dsw-alias-bg-mask-1: #00000080;
  --dsw-alias-border-l1: rgb(255 255 255 / .055);
  --dsw-alias-border-l2: rgb(255 255 255 / .095);
  --dsw-alias-border-l3: rgb(255 255 255 / .145);
  --dsw-alias-border-l4: rgb(255 255 255 / .20);
  --dsw-alias-brand-primary: #f9f9f9;
  --dsw-alias-button-primary-fill: #f9f9f9;
  --dsw-alias-button-primary-hover: #e4e4e4;
  --dsw-alias-button-info-fill: #4489ff;
  --dsw-alias-button-info-hover: #5392ff;
  --dsw-alias-button-tool-bar-fill: #ffffff17;
  --dsw-alias-button-tool-bar-hover: #ffffff26;
  --dsw-alias-interactive-bg-hover: #ffffff12;
  --dsw-alias-interactive-bg-hover-solid: #303030;
  --dsw-alias-interactive-bg-active: #ffffff1f;
  --dsw-alias-interactive-bg-hover-danger: #f53b3a26;
  --dsw-alias-label-primary: #f5f5f7;
  --dsw-alias-label-primary-foreground: #141416;
  --dsw-alias-label-secondary: #b8b8be;
  --dsw-alias-label-tertiary: #8e8e95;
  --dsw-alias-label-caption: #71717a;
  --dsw-alias-label-dimmed: #3f3f46;
  --dsw-alias-state-business-primary: #4489ff;
  --dsw-alias-state-business-tertiary: #1d2d44;
  --dsw-alias-state-error-primary: #f53b3a;
  --dsw-alias-state-success-primary: #22c55e;
  --dsw-alias-state-success-tertiary: #233c2c;
  --dsw-alias-state-warn-primary: #f58e3a;
  --dsw-alias-state-warn-tertiary: #27241f;
  --dsw-alias-state-warn-label: #dd8629;
  --dsw-alias-scrollbar-bg-l1: #38383b;
  --dsw-alias-scrollbar-bg-l2: #4c4c50;
  --dsw-alias-scrollbar-hover-l1: #4c4c50;
  --dsw-alias-scrollbar-hover-l2: #636368;
  --dsw-alias-switch-thumb: #b8b8be;
  --dsw-alias-tooltip-bg: #38383b;
  --dsw-alias-markdown-code-block: #1e1e1f;
  --dsw-menu-surface-fill: rgb(32 32 32 / .70);
  --dsw-menu-backdrop-filter: blur(13px) saturate(1.3);
  --dsw-specific-sidebar-fill: #161616;
  --dsw-specific-sidebar-nav-item-hover: #242425;
  --dsw-specific-sidebar-nav-item-active: #2e2e30;
  --dsw-specific-selector: #2b2b2d;
  --dsw-elevation-stroke-color: var(--dsw-alias-border-l4);
  --dsw-focus-ring-color: var(--dsw-alias-state-business-primary);
}
html[data-standalone] body[data-ds-dark-theme] [data-menu-material],
html[data-standalone][data-theme="dark"] body [data-menu-material] {
  --dsw-elevation-stroke-color: var(--dsw-alias-border-l3);
}
html[data-standalone] body,
html[data-standalone] body * {
  --dsw-elevation-stroke: 0 0 0 .5px var(--dsw-elevation-stroke-color);
  --dsw-elevation-panel: var(--dsw-elevation-stroke), 0 3px 8px 0 rgb(0 0 0 / .03), 0 0 16px 0 rgb(0 0 0 / .02);
  --dsw-elevation-prominent: var(--dsw-elevation-stroke), 0 3px 8px 0 rgb(0 0 0 / .04), 0 0 20px 0 rgb(0 0 0 / .05);
  --dsw-elevation-soft: var(--dsw-elevation-stroke), 0 4px 16px 0 rgb(0 0 0 / .03), 0 0 24px 0 rgb(0 0 0 / .03);
}
`;
		//#endregion
		//#region ../packages/dsh-ui/src/tooltip.ts
		const tooltipCss = `
.hs-tip,
.tip-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border-radius: var(--dsw-radius-sm, 8px);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  background: var(--dsw-alias-tooltip-bg);
  color: var(--dsh-tooltip-fg, var(--dsw-alias-label-primary-foreground));
  font-family: var(--dsw-font-family, inherit);
  font-size: var(--dsh-text-sm, 12px);
  font-weight: 400;
  line-height: 1;
  box-shadow: 0 4px 12px rgb(0 0 0 / .18);
  white-space: nowrap;
}
.hs-tip {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  padding: 6px 9px;
  pointer-events: none;
  opacity: 0;
  transform-origin: top center;
  transform: translateY(-2px) scale(.96);
  transition:
    opacity var(--dsh-dur-pop, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1)),
    transform var(--dsh-dur-pop, 150ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.hs-tip[data-side="top"] {
  transform-origin: bottom center;
  transform: translateY(2px) scale(.96);
}
.hs-tip.hs-tip-on {
  opacity: 1;
  transform: none;
}
.hs-tip-kbd,
.tip-kbd {
  padding: 2px 5px;
  border-radius: var(--dsw-radius-xs, 4px);
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round));
  background: var(--dsh-tooltip-kbd-bg, color-mix(in srgb, currentColor 16%, transparent));
  font-family: var(--ds-font-family-code, monospace);
  font-size: var(--dsh-text-xs, 11px);
  line-height: 1;
}
@media (prefers-reduced-motion: reduce) {
  .hs-tip {
    transition: none;
  }
}
`;
		//#endregion
		//#region ../packages/dsh-ui/src/index.ts
		const sidebarRulesOnlyCss = sidebarTokensCss.startsWith(glassTokensCss) ? sidebarTokensCss.slice(glassTokensCss.length).trim() : sidebarTokensCss;
		[
			standaloneHostFallbackCss,
			[
				glassTokensCss,
				iconBaseCss,
				buttonCss,
				controlsCss,
				glideHoverCss,
				menuSurfaceCss,
				popoverCss,
				modalCss,
				fallbackCss,
				toastCss,
				tooltipCss,
				infoTipCss,
				feedbackCss,
				middleTruncateCss
			].join("\n"),
			sidebarRulesOnlyCss
		].join("\n");
		/**
		* 标准分块清单：供 mountDshUiStyles 按 <style data-dsh-ui="..." data-ver="0.2.0" data-refs="n"> 挂载仲裁。
		*/
		const DSH_UI_STYLE_BLOCKS = [
			["tokens", glassTokensCss],
			["icons", iconBaseCss],
			["button", buttonCss],
			["icon-button", iconButtonCss],
			["inputs", inputsCss],
			["choices", choicesCss],
			["navigation", navigationCss],
			["glide-hover", glideHoverCss],
			["containers", containersCss],
			["scroll-area", scrollAreaCss],
			["menu-surface", menuSurfaceCss],
			["popover", popoverCss],
			["modal", modalCss],
			["fallback", fallbackCss],
			["toast", toastCss],
			["tooltip", tooltipCss],
			["info-tip", infoTipCss],
			["feedback", feedbackCss],
			["middle-truncate", middleTruncateCss]
		];
		/**
		* 按块名、版本号与引用计数一键挂载 @kewen/dsh-ui 共享样式，返回幂等卸载清理函数。
		* 多个插件同时运行时自动复用高版本样式块并累加引用计数，单插件卸载绝不误删其他插件正在使用的基础样式。
		*/
		function mountDshUiStyles(optionsOrBlocks) {
			if (Array.isArray(optionsOrBlocks)) return mountUiStyles(optionsOrBlocks, UI_STYLE_VERSION);
			const opts = optionsOrBlocks ?? {};
			const blocks = [...DSH_UI_STYLE_BLOCKS];
			if (opts.sidebar) blocks.push(["sidebar-tokens", sidebarRulesOnlyCss]);
			return mountUiStyles(blocks, opts.version ?? "0.2.22");
		}
		//#endregion
		//#region src/client/chevron-icon.tsx
		/**
		* 下拉箭头：官方 IconChevronDownOutlineRegular 原件逐字复制（14px、viewBox 16、1px 描边、currentColor）。
		* 自带而不从 @deepseek-ai/dsh-client-ui-primitives 取：一枚 SVG 不值得为它承担宿主包缺失时整个插件起不来的风险。
		* 官方原件形状变化时同步这里的 path。
		*/
		/** 与官方 IconChevronDownOutlineRegular 同 props：size 缺省 14、className 透传。 */
		function IconChevronDownOutlineRegular({ size = 14, className }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				width: size,
				height: size,
				className,
				viewBox: "0 0 16 16",
				fill: "none",
				xmlns: "http://www.w3.org/2000/svg",
				"aria-hidden": "true",
				strokeWidth: 1,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M4 6L7.29289 9.29289C7.68342 9.68342 8.31658 9.68342 8.70711 9.29289L12 6",
					stroke: "currentColor"
				})
			});
		}
		//#endregion
		//#region src/client/host-primitives.ts
		const PRIMITIVES_ID = "@deepseek-ai/dsh-client-ui-primitives";
		let warned = false;
		/** 只提示一次：缺失是宿主层面的状况，每处用到的组件各报一遍只会刷屏。 */
		function warnPrimitivesOnce(detail, error) {
			if (warned) return;
			warned = true;
			if (error === void 0) console.warn(`[model-picker] ${detail}`);
			else console.warn(`[model-picker] ${detail}`, error);
		}
		/** 加载宿主模块；任何失败都返回空表，缺失由下面逐个导出判定。 */
		function loadHost() {
			try {
				const load = typeof require === "function" ? require : void 0;
				if (load === void 0) return { table: {} };
				const mod = load(PRIMITIVES_ID);
				return { table: typeof mod === "object" && mod !== null ? mod : {} };
			} catch (error) {
				return {
					table: {},
					error
				};
			}
		}
		const host = loadHost();
		const missing = [];
		/**
		* 取一个导出：取值本身也包 try（模块对象上可能是 getter），形状不对按缺失处理。
		* @param name - 导出名。
		* @param usable - 形状判定：组件是函数或 forwardRef/memo 对象，SettingsFormModel 必须是构造函数。
		*/
		function exportOf(name, usable) {
			let value;
			try {
				value = host.table[name];
			} catch {
				value = void 0;
			}
			if (usable(value)) return value;
			missing.push(name);
		}
		const isComponent = (value) => typeof value === "function" || typeof value === "object" && value !== null && "$$typeof" in value;
		const isConstructor = (value) => typeof value === "function" && value.prototype !== void 0;
		const hostTooltip = exportOf("Tooltip", isComponent);
		const hostSettingsForm = exportOf("SettingsForm", isComponent);
		const hostSettingsValueField = exportOf("SettingsValueField", isComponent);
		const hostSettingsFormModel = exportOf("SettingsFormModel", isConstructor);
		if (missing.length > 0) warnPrimitivesOnce(`${PRIMITIVES_ID} is missing ${missing.join(", ")}; name tooltips and/or the settings form are degraded, the model picker keeps working.`, host.error);
		/** Tooltip 退化：只渲染锚点本身，锚点自己的事件与 ref 原样保留。 */
		function TooltipFallback({ children }) {
			return children;
		}
		/** 宿主 Tooltip；缺失时退化为只渲染 children。 */
		const Tooltip = hostTooltip ?? TooltipFallback;
		/** 三件套齐全时才提供；缺任何一件都整体为 undefined，由设置页显示说明。 */
		const settingsKit = hostSettingsForm !== void 0 && hostSettingsValueField !== void 0 && hostSettingsFormModel !== void 0 ? {
			SettingsForm: hostSettingsForm,
			SettingsValueField: hostSettingsValueField,
			SettingsFormModel: hostSettingsFormModel
		} : void 0;
		//#endregion
		//#region src/client/prefs-sync.ts
		/**
		* 偏好同步：把收藏、思考强度记忆、供应商顺序和 DSH 宿主上的那一份对齐。
		*
		* - 本地 store（picker-data / provider-order）照旧先改内存和 localStorage，界面立即响应；
		*   这里把同一个改动发给宿主（`POST /kewen-model-controls/prefs`）。
		* - 宿主的值是准的：页面加载、SSE 推来 change、断线重连、页面回到前台时都重新取一次，
		*   用宿主的值覆盖本地（同时写回 localStorage，宿主暂时连不上时下次打开也是最新的）。
		* - 首次接入（本机还没合并过）时把本机 localStorage 的旧数据 merge 上去，只增不删，
		*   桌面和手机各自原有的收藏都会保留。
		* - 宿主接口不可用（旧版插件宿主端、未登录）时什么都不做，退回纯 localStorage。
		*
		* 序号规则（照 harness-plus 的 work.ts）：每次取数和每次写入都拿新序号，只认最新一次的结果，
		* 先发的请求后到不会把界面退回旧状态。
		*/
		const PREFS_PATH = "/kewen-model-controls/prefs";
		const MERGED_FLAG = "dsh003.model-picker.prefs-merged";
		function asPrefs(value) {
			if (value === null || typeof value !== "object") return void 0;
			const { favorites, efforts, providerOrder } = value;
			if (!Array.isArray(favorites) || !Array.isArray(providerOrder)) return void 0;
			if (efforts === null || typeof efforts !== "object" || Array.isArray(efforts)) return void 0;
			const strings = (list) => list.filter((v) => typeof v === "string");
			const effortMap = {};
			for (const [k, v] of Object.entries(efforts)) if (typeof v === "string") effortMap[k] = v;
			return {
				favorites: strings(favorites),
				efforts: effortMap,
				providerOrder: strings(providerOrder)
			};
		}
		let binding;
		let seq = 0;
		/** 宿主接口是否可用：首次 GET 成功后才开始发写入，避免对旧宿主狂发 404。 */
		let online = false;
		let started = false;
		/** 首次 GET 之前产生的写入先排着，确认可用后补发。 */
		const queued = [];
		function readMergedFlag() {
			try {
				return window.localStorage.getItem(MERGED_FLAG) === "1";
			} catch {
				return true;
			}
		}
		function writeMergedFlag() {
			try {
				window.localStorage.setItem(MERGED_FLAG, "1");
			} catch {}
		}
		async function post(op) {
			const res = await fetch(PREFS_PATH, {
				method: "POST",
				credentials: "same-origin",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(op)
			});
			return res.ok ? asPrefs(await res.json()) : void 0;
		}
		function accept(n, prefs) {
			if (prefs !== void 0 && n === seq) binding?.replace(prefs);
		}
		/** 从宿主重新取一次，以宿主为准。 */
		function reloadPrefs() {
			if (binding === void 0) return;
			const n = ++seq;
			fetch(PREFS_PATH, { credentials: "same-origin" }).then(async (res) => {
				if (!res.ok) return void 0;
				const prefs = asPrefs(await res.json());
				if (prefs === void 0) return void 0;
				if (!online) {
					online = true;
					if (!readMergedFlag()) {
						const merged = await post({
							op: "merge",
							...binding.local()
						});
						if (merged !== void 0) writeMergedFlag();
						if (merged !== void 0 && queued.length === 0) return merged;
					}
					if (queued.length > 0) {
						let last = prefs;
						for (const op of queued.splice(0)) last = await post(op) ?? last;
						return last;
					}
				}
				return prefs;
			}).then((prefs) => accept(n, prefs)).catch((error) => {
				console.warn("[model-picker] load prefs failed", error);
			});
		}
		/** 本地改动后调用：发给宿主。宿主还没确认可用时先排队。 */
		function pushPrefs(op) {
			if (binding === void 0) return;
			if (!online) {
				queued.push(op);
				return;
			}
			const n = ++seq;
			post(op).then((prefs) => {
				if (prefs === void 0) throw new Error("save prefs failed");
				accept(n, prefs);
			}).catch((error) => {
				console.warn("[model-picker] save prefs failed", error);
				reloadPrefs();
			});
		}
		/**
		* 启动同步（插件 apply 时调用一次）。
		* @returns 停止同步的函数。
		*/
		function startPrefsSync(next) {
			binding = next;
			if (started || typeof window === "undefined" || typeof fetch !== "function") return () => {
				binding = void 0;
			};
			started = true;
			reloadPrefs();
			let events;
			let retry;
			let stopped = false;
			const connect = () => {
				if (stopped || typeof EventSource !== "function") return;
				try {
					const source = new EventSource(`${PREFS_PATH}/events`);
					events = source;
					source.addEventListener("change", reloadPrefs);
					source.addEventListener("open", reloadPrefs);
					source.addEventListener("error", () => {
						if (source.readyState !== EventSource.CLOSED || stopped) return;
						retry = setTimeout(connect, 5e3);
					});
				} catch {}
			};
			connect();
			const onVisible = () => {
				if (document.visibilityState === "visible") reloadPrefs();
			};
			document.addEventListener("visibilitychange", onVisible);
			return () => {
				stopped = true;
				if (retry !== void 0) clearTimeout(retry);
				events?.close();
				document.removeEventListener("visibilitychange", onVisible);
				binding = void 0;
				started = false;
				online = false;
				queued.length = 0;
			};
		}
		//#endregion
		//#region src/client/picker-data.ts
		/**
		* M2-005a 模型选择器：类型与工具。收藏键：`${providerId}/${modelId}`，跨提供方唯一。
		* M2-005b：收藏为模块级持久化 store——localStorage 落盘（页面刷新/应用重启不丢），
		* 组件经 useSyncExternalStore 订阅（快照引用稳定纪律：变更时新建 Set）。
		* M-121：模型思考强度独立记忆（Per-Model Sticky Memory）——localStorage 落盘，
		* 记录用户为特定模型选定的思考强度，隔离跨模型/跨供应商继承污染。
		* 0.2.42：两项都同步到 DSH 宿主（prefs-sync.ts），localStorage 只做离线缓存。
		*/
		/** 收藏键：提供方 id + 模型 id 组合（跨提供方唯一）。 */
		function favoriteKeyOf(providerId, modelId) {
			return `${providerId}/${modelId}`;
		}
		const FAVORITES_STORAGE_KEY = "dsh003.model-picker.favorites";
		function readStoredFavorites() {
			try {
				const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
				if (raw === null) return /* @__PURE__ */ new Set();
				const list = JSON.parse(raw);
				if (!Array.isArray(list)) return /* @__PURE__ */ new Set();
				return new Set(list.filter((v) => typeof v === "string"));
			} catch {
				return /* @__PURE__ */ new Set();
			}
		}
		let favoriteSnapshot = readStoredFavorites();
		const favoriteListeners = /* @__PURE__ */ new Set();
		/** uSES getSnapshot：收藏键集合（引用在变更前保持稳定）。 */
		function getFavoriteSet() {
			return favoriteSnapshot;
		}
		/** uSES subscribe：收藏变更监听，返回解绑函数。 */
		function subscribeFavorites(listener) {
			favoriteListeners.add(listener);
			return () => {
				favoriteListeners.delete(listener);
			};
		}
		/** 切换收藏并落盘 localStorage（写失败时内存态兜底，面板功能不受阻）。 */
		function toggleFavorite(providerId, modelId) {
			const next = new Set(favoriteSnapshot);
			const key = favoriteKeyOf(providerId, modelId);
			if (!next.delete(key)) next.add(key);
			favoriteSnapshot = next;
			try {
				window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...next]));
			} catch {}
			for (const listener of favoriteListeners) listener();
			pushPrefs({
				op: "favorite",
				key,
				on: next.has(key)
			});
		}
		/** 用宿主的收藏覆盖本地（同步写回 localStorage 做离线缓存）。 */
		function replaceFavorites(keys) {
			const next = new Set(keys);
			if (next.size === favoriteSnapshot.size && [...next].every((key) => favoriteSnapshot.has(key))) return;
			favoriteSnapshot = next;
			try {
				window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...next]));
			} catch {}
			for (const listener of favoriteListeners) listener();
		}
		const EFFORTS_STORAGE_KEY = "dsh003.model-picker.model-efforts";
		function readStoredEfforts() {
			try {
				const raw = window.localStorage.getItem(EFFORTS_STORAGE_KEY);
				if (raw === null) return {};
				const parsed = JSON.parse(raw);
				if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
				const result = {};
				for (const [k, v] of Object.entries(parsed)) if (typeof v === "string") result[k] = v;
				return result;
			} catch {
				return {};
			}
		}
		let effortsSnapshot = readStoredEfforts();
		/** 获取特定模型已记忆的思考强度（若从未设定过则返回 undefined）。
		* 键复用 favoriteKeyOf 的 provider/model 组合格式（与收藏键同一命名空间，跨提供方唯一）。 */
		function getModelEffort(providerId, modelId) {
			return effortsSnapshot[favoriteKeyOf(providerId, modelId)];
		}
		/** 记录特定模型的思考强度并持久化到 localStorage。 */
		function setModelEffort(providerId, modelId, effortId) {
			const key = favoriteKeyOf(providerId, modelId);
			if (effortsSnapshot[key] === effortId) return;
			effortsSnapshot = {
				...effortsSnapshot,
				[key]: effortId
			};
			try {
				window.localStorage.setItem(EFFORTS_STORAGE_KEY, JSON.stringify(effortsSnapshot));
			} catch {}
			pushPrefs({
				op: "effort",
				key,
				effort: effortId
			});
		}
		/** 当前全部思考强度记忆（首次合并到宿主时用）。 */
		function getModelEfforts() {
			return effortsSnapshot;
		}
		/** 用宿主的思考强度记忆覆盖本地。 */
		function replaceModelEfforts(efforts) {
			effortsSnapshot = { ...efforts };
			try {
				window.localStorage.setItem(EFFORTS_STORAGE_KEY, JSON.stringify(effortsSnapshot));
			} catch {}
		}
		//#endregion
		//#region src/client/magpie-display.ts
		/**
		* Magpie 网关的显示层适配。
		*
		* Magpie 按 API 协议暴露多个路由（magpie / magpie-responses / magpie-anthropic），
		* 并把「模型 · 路由来源」拼成一个显示名（如 `Qwen3.8-Flash · Qoder CN`）。
		* 这里只做显示转换：provider id 与模型 id 是请求与存储的键，永不改写。
		*/
		/** 显示名分隔符：Magpie 用中点分隔「模型 · 路由来源」与「网关 · 协议」两种显示名。 */
		const SEPARATOR$1 = "·";
		/** 该 provider 是否属于 Magpie 网关：按协议拆出的路由共享同一网关身份。 */
		function isMagpieRoute(providerId) {
			const id = providerId.trim().toLowerCase();
			return id === "magpie" || id.startsWith("magpie-");
		}
		/**
		* 拆分「模型 · 路由来源」显示名。
		* @param name - 上游上报的模型显示名。
		* @returns 模型名与路由来源；命名约定变化（无分隔符、缺一侧）时返回 null，调用方回退单行显示。
		*/
		function splitMagpieModelName(name) {
			const index = name.indexOf(SEPARATOR$1);
			if (index < 0) return null;
			const model = name.slice(0, index).trim();
			const route = name.slice(index + 1).trim();
			if (model === "" || route === "") return null;
			return {
				model,
				route
			};
		}
		/**
		* 取路由显示名的首段作为网关标识（形如「Magpie · Responses」→「Magpie」），
		* 尊重用户在配置里写的网关名，而不是硬编码品牌词。
		* @param displayName - 路由的显示名。
		* @returns 网关标识；首段为空时退回整名。
		*/
		function magpieGatewayLabel(displayName) {
			const index = displayName.indexOf(SEPARATOR$1);
			const head = (index < 0 ? displayName : displayName.slice(0, index)).trim();
			return head === "" ? displayName.trim() : head;
		}
		/**
		* 触发按钮上可以省略的品牌前缀：模型名其余部分已带版本号时，品牌词只是重复信息。
		*
		* 只收「品牌 + 版本号」这类厂商：`DeepSeek-V4.1-Flash` 去掉品牌仍是 `V4.1-Flash`。
		* GPT 在列：`GPT-6.1 Sol` → `6.1 Sol`、`GPT-6 Astra` → `6 Astra`，
		* 小数的版本号加代号本身认得出，供应商图标与悬停提示仍给出完整信息。
		* Step 不在列：`Step-5-Preview` → `5-Preview` 只剩通用词，按已确认结论完整显示。
		*/
		const COMPACT_BRAND_PREFIXES = [
			"deepseek",
			"claude",
			"mimo",
			"glm",
			"qwen",
			"gpt"
		];
		/**
		* 生成触发按钮用的短模型名：去掉冗余品牌前缀。
		*
		* 只作用于**按钮显示**——面板行、搜索匹配、请求参数与存储键一律沿用上游原名。
		*
		* 护栏：去掉品牌后必须还剩下数字，否则保留原名。这条挡住两类坏结果：
		* - `DeepSeek-Flash` → `Flash`（只剩通用词，认不出是谁）
		* - `Beam Free`、`M3` 等本来就没有可去的品牌
		*
		* @param name - 上游模型显示名（不含 `·` 路由后缀，调用方需先拆开）。
		* @returns 按钮显示用的短名；不满足条件时原样返回。
		*/
		function compactModelName(name) {
			const lower = name.toLowerCase();
			for (const brand of COMPACT_BRAND_PREFIXES) {
				if (!lower.startsWith(brand)) continue;
				const rest = name.slice(brand.length).replace(/^[\s\-_]+/, "");
				return rest !== "" && /\d/.test(rest) ? rest : name;
			}
			return name;
		}
		//#endregion
		//#region src/client/effort-labels.ts
		/** 按钮能识别的档位 → locale 键。未收录的档位原样显示宿主的名字。 */
		const EFFORT_KEYS = {
			minimal: "effortMinimal",
			low: "effortLow",
			medium: "effortMedium",
			high: "effortHigh",
			xhigh: "effortXHigh",
			extrahigh: "effortXHigh",
			max: "effortMax",
			none: "effortOff",
			off: "effortOff",
			disabled: "effortOff",
			false: "effortOff",
			no: "effortOff",
			nothink: "effortOff"
		};
		/** 归一化：大小写、空格、下划线与连字符都不参与匹配。 */
		function normalize(name) {
			return name.trim().toLowerCase().replace(/[\s_-]+/g, "");
		}
		/**
		* 把宿主给的档位显示名翻译成 locale 键。
		* @param name - 宿主提供的档位显示名，如 `High`、`Extra High`、`xhigh`。
		* @returns 对应的 locale 键；未收录时返回 `undefined`，调用方回退原值。
		*/
		function effortKeyOf(name) {
			return EFFORT_KEYS[normalize(name)];
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
		const OFF_EFFORTS = /* @__PURE__ */ new Set([
			"off",
			"none",
			"disabled",
			"false",
			"no",
			"nothink"
		]);
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
		function effortProgress(effortIds, activeId) {
			if (activeId === void 0) return 0;
			const wanted = normalize(activeId);
			if (OFF_EFFORTS.has(wanted)) return 0;
			const scaled = effortIds.map(normalize).filter((id) => !OFF_EFFORTS.has(id));
			const rank = scaled.indexOf(wanted);
			if (rank < 0) return 0;
			if (scaled.length <= 1) return 1;
			return rank / (scaled.length - 1);
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
		function effortMeterHeight(effortIds, activeId) {
			const progress = effortProgress(effortIds, activeId);
			if (progress > 0) return progress;
			if (activeId === void 0) return 0;
			const wanted = normalize(activeId);
			if (OFF_EFFORTS.has(wanted)) return 0;
			return effortIds.map(normalize).filter((id) => !OFF_EFFORTS.has(id)).includes(wanted) ? .25 : 0;
		}
		//#endregion
		//#region src/client/magpie.svg?raw
		var magpie_default = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 5 44 34\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M1.5 5.5C1.3 5.7 1.2 6.5 1.2 6.9C1.2 6.9 1.2 7 1.2 7.1C1.1 7.4 1.3 8 1.4 8.3C1.4 8.4 1.5 8.5 1.5 8.7C1.5 8.9 1.7 9 1.8 9.3C2.2 9.9 2.2 10 2.3 10.1C2.4 10.2 2.5 10.3 2.6 10.5C2.8 10.8 3 11.1 3.2 11.3C3.3 11.3 3.4 11.6 3.6 11.8C3.8 12 4.1 12.4 4.2 12.5C4.7 13 5.2 13.7 5.4 13.9C6 14.5 6.5 15.1 6.7 15.3C6.7 15.4 6.9 15.5 6.9 15.7C7.3 15.9 7.7 16.5 7.9 16.8C7.9 16.8 8 16.9 8 16.9C8.1 16.9 8.2 17.2 8.2 17.3C8.2 17.3 8.1 17.2 8.1 17.1C7.9 16.9 7.9 16.9 7.6 16.6C7.5 16.5 7.4 16.5 7.4 16.3C7.2 16.2 6.7 15.7 6.3 15.2C6.1 15.1 6 14.9 6 14.9C5.9 14.8 5.7 14.7 5.7 14.6C5.6 14.5 5.4 14.3 5.3 14.2C5.1 14.1 4.9 13.8 4.7 13.5C4.5 13.3 4.2 13.1 4.1 12.9C4.1 12.9 3.8 12.7 3.8 12.5C3.5 12.3 3 11.8 2.8 11.4C1.8 10.5 0.9 9.6 0.7 9.6C0.6 9.7 0.6 9.8 0.5 10C0.5 10.1 0.6 10.2 0.5 10.3C0.5 10.4 0.6 10.5 0.6 10.6C0.5 10.7 0.5 10.9 0.6 11C0.5 11.1 0.6 11.4 0.6 11.5C0.9 12.9 1.3 13.8 2.8 14.9C2.9 15.1 3.3 15.3 3.4 15.4C3.4 15.5 3.6 15.6 3.7 15.7C4.2 16 6.4 17.8 7 18.4C7.4 18.8 7.4 18.8 7.5 18.9C7.6 19 7.7 19 7.7 19.1C7.7 19.2 7.8 19.2 7.9 19.2C7.9 19.3 8.1 19.4 8.1 19.5C8.2 19.6 8.2 19.7 8.3 19.7C8.3 19.7 8.3 19.7 8.2 19.7C8.2 19.6 8.1 19.6 8 19.6C7.9 19.5 7.9 19.4 7.8 19.4C7.7 19.3 7.6 19.2 7.6 19.2C7.6 19.1 7.5 19 7.3 18.9C7.2 18.9 6.9 18.6 6.7 18.4C6.1 17.8 4.5 16.6 3.5 16C3.4 15.8 3 15.6 2.9 15.5C2.6 15.3 1.5 14.6 0.9 14.3C0.7 14.1 0.6 14.1 0.6 14.2C0.5 14.5 0.8 15.9 0.9 16.1C0.9 16.2 1 16.2 0.9 16.3C1.2 16.8 1.9 17.6 2.7 18.3C2.8 18.5 4 19.2 4.7 19.5C6.2 20.5 6.6 20.7 7.4 21.5C8.2 22.2 8.7 22.7 9.3 23.6C9.5 24.1 9.9 24.4 10.3 25.3C10.4 25.5 10.5 25.8 10.5 25.8C10.7 25.8 10.8 25.7 11 25.4C11.6 25 11.9 24.6 12.3 24.3C12.8 24 13 23.8 13 23.7C13.1 23.7 13.1 23.8 13 24C12 24.8 11 26 10.2 26.9C10.1 27.1 9.9 27.5 9.7 27.7C9.5 27.8 9.4 28 9.4 28C9.4 28 9.3 28.3 9.1 28.5C8.6 29.2 7.7 30.8 7.7 30.9C7.7 31 7.8 31 8.3 30.8C9 30.4 9.5 30.2 10.4 30C11.7 29.6 12.5 29.6 11.6 30C10.5 30.2 9.7 30.6 9.2 31.2C8.8 31.7 8.8 31.7 9.3 31.7C10.1 31.8 10.9 31.9 11.6 32.2C12.8 32.7 13.5 33.1 15.5 34.8C16.4 35.5 17.3 36.2 17.8 36.4C17.9 36.5 18.1 36.7 18.2 36.8C19.1 37.3 21.2 38.1 22.3 38.3C22.4 38.3 22.7 38.3 22.8 38.3C22.8 38.5 23 38.5 23 38.5C23.1 38.5 23.2 38.5 23.3 38.5C23.6 38.6 25.9 38.6 26.1 38.5C26.2 38.5 26.3 38.5 26.4 38.5C26.5 38.5 26.6 38.5 26.7 38.3C26.7 38.3 27 38.3 27.1 38.3C28.3 38.1 30.2 37.3 31.4 36.7C31.5 36.7 31.7 36.4 31.8 36.4C32.2 36.2 33.2 35.4 33.4 35.2C34.2 34.5 35.5 33 35.8 32.6C35.8 32.5 36 32.2 36.1 32C36.4 31.8 36.6 31.4 36.6 31.2C36.7 31.1 36.8 30.9 36.9 30.8C37.2 30.4 37.5 29.6 37.7 29.2C37.7 29.1 37.8 28.7 37.9 28.7C38.1 28.5 38.4 27.1 38.5 26.8C39 25.2 39.1 23.7 39 22.4C39 22.2 38.9 21.9 38.9 21.8C38.9 21.7 38.9 21.6 38.9 21.4C38.6 20.5 38.5 19.9 38.2 19C37.9 18.5 37.5 17.5 37.3 17.2C37 16.8 36.8 15.8 36.8 15.2C36.8 13.8 37.7 12.7 39.6 12.2C40.1 12.1 41.3 11.8 42.1 11.7C43.5 11.5 43.5 11.5 43.4 11.3C42.9 10.7 40.9 9.9 39.2 9.7C37.9 9.5 38.1 9.5 37.6 9C37 8.6 36.4 8 36 7.9C36 7.8 35.8 7.8 35.7 7.7C35.1 7.3 34.2 7 33.1 6.9C32.6 6.7 31.6 6.9 31 7C29.6 7.3 28.3 8 27.3 9.2C26.7 9.8 26.2 10.8 25.7 11.7C25.5 12.1 24.8 13.4 24.7 13.7C24.6 13.9 24.5 14.1 24.1 14.7C23.5 15.7 22.1 16.9 20.6 17.8C20.5 18 20.3 18.2 20.1 18.3C19.7 18.5 19.4 18.8 19.1 19C18.9 19.1 18.7 19.3 18.5 19.4C18 19.8 17.2 20.3 17 20.5C16.9 20.5 16.8 20.6 16.7 20.7C16.3 20.8 16.1 20.9 16 20.9C15.5 20.8 14.9 20.5 14.2 20.2C13.7 19.8 12.7 18.9 12.4 18.6C12.3 18.5 12.2 18.4 12.1 18.2C11.9 18 11.2 17.1 11 16.6C10.9 16.5 10.8 16.4 10.7 16.3C10.7 16.2 10.6 16.1 10.6 15.9C10.5 15.9 10.4 15.7 10.4 15.6C10.3 15.5 10.2 15.2 10.1 15C10 14.8 9.8 14.4 9.7 14.2C9.6 14 9.5 13.7 9.4 13.6C9.4 13.4 9.3 13.2 9.2 13C9.2 12.8 9 12.6 9 12.5C8.9 12.3 8.7 12.1 8.7 12C8.7 12 8.5 11.7 8.5 11.7C8.3 11.2 8.2 10.9 7.5 10C6.4 8.3 4.2 6.4 2.7 5.8C2 5.5 1.6 5.4 1.5 5.5ZM28.4 16.7C29.2 16.9 29.7 17.2 29.9 17.7C30.1 18.2 30 18.9 29.6 19.4C29.2 19.9 28.2 20.9 27.6 21.2C26.8 21.7 25.3 22.4 24.2 22.7C23.9 22.8 23.6 22.9 23.5 22.9C22.8 23.2 20.7 23.7 19.6 24C19 24.2 18.4 24.3 18.1 24.4C17.9 24.4 16.1 24.9 15.3 25.1C14.6 25.2 14.7 25.1 15.7 23.6C16.4 22.7 18.5 20.6 19.4 19.9C20.8 18.8 21.4 18.4 23.2 17.6C23.8 17.4 25.6 16.8 25.9 16.8C25.9 16.8 26.3 16.8 26.6 16.7C26.8 16.7 28.2 16.7 28.4 16.7ZM30.4 20.2C30.5 20.3 30.6 20.6 30.6 20.7C31.7 23.1 33.4 24.6 35.6 25.3C36.1 25.5 36.7 25.7 37.2 25.8C37.7 25.8 37.8 25.9 37.8 26.1C37.7 26.2 37.7 26.3 37.7 26.5C37.7 26.6 37.7 26.8 37.6 27C37.4 28.5 36.8 29.9 36.1 31C36.1 31.2 35.9 31.4 35.9 31.6C35.7 31.9 35.2 32.6 34.7 33.3C32.6 35.6 29.7 37.3 26.6 37.8C26.5 37.8 26.3 37.9 26.2 37.9C25.8 37.9 23.7 37.9 23.3 37.9C23.2 37.9 23 37.8 22.9 37.8C21.1 37.6 19.3 36.8 18 35.7C17.7 35.4 17 34.7 16.8 34.5C16.3 33.8 16.1 33 16.3 32.5C16.5 31.8 16.8 31.6 17.9 31.1C19.1 30.5 19.4 30.4 20.2 30C21.4 29.4 23.2 28.4 23.9 27.9C23.9 27.8 24.2 27.7 24.5 27.6C26.3 26.3 28 24.6 28.9 22.9C29.5 22.2 29.7 21.6 29.9 20.7C30.1 20 30.2 19.9 30.4 20.2Z\"/></svg>\n";
		//#endregion
		//#region src/client/t3-display.ts
		/** 桥接器路由 id 的后缀 → CLI。 */
		const T3_CLI_BY_SUFFIX = {
			codex: "codex",
			agy: "antigravity",
			devin: "devin"
		};
		/** 该 provider 是否由 T3 桥接器注册。 */
		function isT3Route(providerId) {
			return providerId.trim().toLowerCase().startsWith("t3-");
		}
		/**
		* 桥接器路由背后的 CLI。
		* @param providerId - 提供方 id。
		* @returns 认得的 CLI；不是桥接器路由或后缀未收录时返回 undefined（调用方只画 T3 字标）。
		*/
		function t3CliOf(providerId) {
			const id = providerId.trim().toLowerCase();
			return isT3Route(id) ? T3_CLI_BY_SUFFIX[id.slice(3)] : void 0;
		}
		//#endregion
		//#region src/client/provider-logos.tsx
		/**
		* M-051 供应商 Logo 数据模块：模型选择面板左栏提供方 logo（品牌 SVG 内联常量 + providerId 别名归一）。
		* 素材：models.dev/logos/{id}.svg 快照（2026-09-06 拉取），全部为 fill="currentColor" 单色资产——
		* 颜色随 CSS 文本色继承（按钮 secondary / hover、active primary），明暗主题零特判；版权归各品牌，仅作本仓 UI 标识。
		* id 全集 = pi-ai 注册表（llm/listConfigurableProviders 39 项，2026-09-06 实测）；注册表有 id 但
		* models.dev 仅有占位图的（ant-ling / fireworks 等）不内置，走首字母兜底。
		* R1（2026-09-06）：补 qwen（Simple Icons「QWen」结标，品牌紫转 currentColor）与 volcengine；qwen-token-plan 系 / volcengine-ark / ark 走别名映射。
		* R2（2026-09-06）：volcengine 素材纠错——models.dev 条目非火山方舟品牌标，换官方控制台 data-URI 原件的三峰+星芒图形（渐变转 currentColor，保留 0.5/0.45/1.0 分层透明度，剥离光晕滤镜）。
		* R3（2026-09-06）：volcengine 再纠错——R2 的 data-URI 实为页面装饰插画；换品牌区真标（inline SVG arkIcon，双色调五峰 mask 结构，#006AFF/#00DCFF 原色整件内联，仅去 class 属性）。
		* R4（2026-09-06）：volcengine 去官方彩色转 currentColor 家族——mask 三角直提取为 5 条纯 path（绘制序原样），蓝峰 1.0 / 青峰 0.45 透明度替代双色对比，剥离 mask/rect/defs 机制。
		* R6（2026-09-06）：中央青峰同色叠加读不出——蓝峰 group 套 mask 挖真镂空（f 形负形），f 以 0.45 落在镂空位，正负形分隔替代明度差。
		* R7（2026-09-06）：qwen 换千问独立品牌新标（qianwenai.com 控制台品牌 SVG，7 瓣渐变花标转 6 条去重 currentColor path，viewBox 原文保留）；旧 Simple Icons「QWen」结标为弃用的旧通义标。
		* M-056 R1（2026-09-06）：23 枚 viewBox 归一化——getBBox 实测各枚绘制包围盒（剔除 mask/defs，openrouter 的 scale(0.0234375) 已折算）后逐枚改写 viewBox，path 数据仍为快照原文逐字节；各素材留白不一导致的同盒视觉尺寸不一（deepseek 高向仅 59% vs qwen 100%）就此消除，面板 20px 与触发按钮 14px 通用。
		* M-105（2026-09-14）：xiaomi / zai 纠错换官方标——models.dev logos 对小众 id 放占位/错标（实测 xiaomi.svg 装 NVIDIA 路径、zai.svg 装 Baseten 路径）：xiaomi 换 Simple Icons 官方「Xiaomi」；zai 换 z.ai 官网 logo.svg 品牌组合（圆角方块 + 镂空 Z，合并单 path evenodd 负形）。错标遇到一个换一个。
		* T3 桥接器（2026-11-28）：`t3-*` 路由画作「T3 字标 + CLI 图标角标」。字标取自 T3 Code 源码
		*   apps/web/src/components/T3Wordmark.tsx 的原 path 与 viewBox；Devin 取自 ACP registry 的 devin.svg（原件即 currentColor）；
		*   Codex 复用本文件的 openai；Antigravity 在 T3 Code 里只有一张 128px 彩色 PNG，按其透明通道描出单色外形
		*   （与原图重合度 98.7%）。版权归各品牌，仅作本仓 UI 标识。
		* dangerouslySetInnerHTML 注入的是本文件构建期常量（快照 SVG 原文），无任何运行期/用户输入拼入。
		*/
		/** 首字母兜底：无 logo 的 provider 渲染展示名首个可见字符（自 ModelPickerPanel 迁入）。 */
		function providerInitial(name) {
			for (const char of name) if (char.trim() !== "") return char.toUpperCase();
			return "?";
		}
		/** 注册表 id → logo 键（registry 命名 ≠ models.dev id、或多家共用同一素材时收敛）。 */
		const PROVIDER_LOGO_ALIAS = /* @__PURE__ */ new Map([
			["deepseek-official", "deepseek"],
			["openai-codex", "openai"],
			["azure-openai-responses", "openai"],
			["kimi-coding", "moonshotai"],
			["moonshotai-cn", "moonshotai"],
			["minimax-cn", "minimax"],
			["cloudflare-workers-ai", "cloudflare-ai-gateway"],
			["google-vertex", "google"],
			["zai-coding-cn", "zai"],
			["xiaomi-token-plan-ams", "xiaomi"],
			["xiaomi-token-plan-cn", "xiaomi"],
			["xiaomi-token-plan-sgp", "xiaomi"],
			["qwen-token-plan", "qwen"],
			["qwen-token-plan-cn", "qwen"],
			["qwen-token-plan-individual", "qwen"],
			["volcengine-ark", "volcengine"],
			["ark", "volcengine"],
			["opencode-go-anthropic", "opencode"],
			["opencode-go", "opencode"],
			["opencode-go-extra", "opencode"]
		]);
		/** logo 键 → 内联 SVG（models.dev 快照原文，逐字节保留）。 */
		const PROVIDER_LOGOS = new Map(Object.entries({
			deepseek: `<svg width="24" height="24" viewBox="4 7.94 32.01 23.56" xmlns="http://www.w3.org/2000/svg">
<path d="M35.6638 9.91965C35.3251 9.75432 35.1785 10.0703 34.9811 10.2316C34.9131 10.2836 34.8558 10.3516 34.7985 10.413C34.3025 10.9423 33.7238 11.289 32.9678 11.2476C31.8625 11.1863 30.9186 11.533 30.0839 12.3783C29.9066 11.3356 29.3173 10.7143 28.4213 10.3143C27.9519 10.1063 27.4773 9.89965 27.148 9.44766C26.9186 9.12633 26.856 8.76767 26.7413 8.41568C26.668 8.20235 26.5946 7.98502 26.3506 7.94902C26.084 7.90769 25.98 8.13035 25.876 8.31702C25.4587 9.07967 25.2973 9.91965 25.3133 10.7703C25.3493 12.6849 26.1573 14.2102 27.764 15.2942C27.9466 15.4182 27.9933 15.5435 27.9359 15.7249C27.8266 16.0982 27.696 16.4609 27.5813 16.8355C27.508 17.0742 27.3986 17.1248 27.1426 17.0222C26.2777 16.6504 25.4919 16.1164 24.828 15.4489C23.6854 14.3449 22.6534 13.1263 21.3654 12.1716C21.067 11.9511 20.7606 11.7416 20.4468 11.5436C19.1335 10.2676 20.6201 9.21967 20.9641 9.09567C21.3241 8.965 21.0881 8.51968 19.9254 8.52501C18.7628 8.53035 17.6988 8.91834 16.3428 9.43699C16.1413 9.51421 15.934 9.57529 15.7229 9.61966C14.4557 9.38091 13.1598 9.33506 11.8789 9.48366C9.36565 9.76365 7.35902 10.953 5.88305 12.9809C4.10975 15.4182 3.69243 18.1888 4.20308 21.0768C4.74041 24.122 6.29504 26.6433 8.683 28.6139C11.1603 30.6579 14.0122 31.6592 17.2668 31.4672C19.2428 31.3539 21.4441 31.0886 23.9254 28.9873C24.552 29.2993 25.208 29.4233 26.2986 29.5166C27.1386 29.5953 27.9466 29.4766 28.5719 29.3459C29.5519 29.1379 29.4839 28.23 29.1306 28.0646C26.2573 26.726 26.888 27.2713 26.3133 26.83C27.7746 25.102 29.9746 23.3074 30.8359 17.4928C30.9026 17.0302 30.8452 16.7395 30.8359 16.3662C30.8306 16.1395 30.8826 16.0502 31.1426 16.0249C31.8639 15.95 32.5637 15.7349 33.2025 15.3915C35.0638 14.3742 35.8158 12.7049 35.9931 10.7023C36.0198 10.3956 35.9878 10.081 35.6638 9.91965ZM19.4414 27.9433C16.6562 25.754 15.3055 25.0327 14.7482 25.0634C14.2256 25.0954 14.3202 25.6913 14.4349 26.0807C14.5549 26.4647 14.7109 26.7286 14.9295 27.066C15.0815 27.2886 15.1855 27.6206 14.7789 27.87C13.8816 28.4246 12.3229 27.6833 12.2496 27.6473C10.435 26.578 8.91632 25.1673 7.84834 23.2381C6.81637 21.3808 6.21638 19.3888 6.11771 17.2622C6.09105 16.7475 6.24171 16.5662 6.7537 16.4729C7.42583 16.3442 8.11451 16.3267 8.79233 16.4209C11.6349 16.8368 14.0536 18.1075 16.0828 20.1194C17.2402 21.2661 18.1161 22.6354 19.0188 23.974C19.9788 25.3953 21.0108 26.75 22.3254 27.8593C22.7894 28.2486 23.1587 28.5446 23.5134 28.7619C22.4441 28.8819 20.6601 28.9086 19.4414 27.9433ZM20.7748 19.3568C20.7745 19.2906 20.7904 19.2253 20.8211 19.1666C20.8517 19.1078 20.8962 19.0575 20.9507 19.0198C21.0052 18.9821 21.068 18.9583 21.1337 18.9503C21.1995 18.9424 21.2662 18.9505 21.3281 18.9741C21.407 19.0024 21.475 19.0546 21.5228 19.1235C21.5706 19.1923 21.5958 19.2743 21.5947 19.3581C21.5949 19.4123 21.5843 19.4659 21.5636 19.5159C21.5428 19.5659 21.5123 19.6113 21.4738 19.6494C21.4354 19.6875 21.3897 19.7176 21.3395 19.7378C21.2893 19.7581 21.2356 19.7682 21.1814 19.7675C21.1277 19.7676 21.0745 19.7571 21.0248 19.7365C20.9752 19.7158 20.9302 19.6855 20.8925 19.6473C20.8548 19.609 20.825 19.5636 20.805 19.5138C20.785 19.4639 20.7739 19.4105 20.7748 19.3568ZM24.9213 21.4848C24.6547 21.5928 24.3893 21.6861 24.1347 21.6981C23.7516 21.7114 23.3756 21.5918 23.0707 21.3594C22.7054 21.0528 22.4441 20.8821 22.3347 20.3488C22.297 20.0881 22.3042 19.823 22.3561 19.5648C22.4494 19.1288 22.3454 18.8488 22.0374 18.5955C21.7881 18.3875 21.4694 18.3302 21.1201 18.3302C21.0005 18.3232 20.8843 18.2875 20.7814 18.2262C20.6348 18.1542 20.5148 17.9728 20.6294 17.7488C20.6668 17.6768 20.8428 17.5008 20.8854 17.4688C21.3601 17.1995 21.9081 17.2875 22.4134 17.4902C22.8827 17.6822 23.2374 18.0342 23.748 18.5328C24.2694 19.1341 24.364 19.3008 24.6613 19.7515C24.896 20.1048 25.1093 20.4674 25.2547 20.8821C25.344 21.1421 25.2293 21.3541 24.9213 21.4848Z" fill="currentColor"/>
</svg>`,
			openai: `<svg width="24" height="24" viewBox="5.21 4.99 29.47 30.02" xmlns="http://www.w3.org/2000/svg">
<path d="M32.8377 17.282C33.2127 16.25 33.3072 15.218 33.2127 14.1875C33.1197 13.1571 32.7447 12.1251 32.2752 11.1876C31.4322 9.78209 30.2127 8.6571 28.8072 8.0001C27.3072 7.34461 25.7127 7.15711 24.1197 7.53211C23.3698 6.78212 22.5253 6.12512 21.5878 5.65713C20.6503 5.18913 19.5253 5.00013 18.4948 5.00013C16.8851 4.99074 15.3125 5.48246 13.9948 6.40712C12.6824 7.34311 11.7449 8.6571 11.2754 10.1571C10.1504 10.4376 9.21289 10.9071 8.27539 11.4696C7.4324 12.1251 6.77541 12.9696 6.21291 13.8126C5.36992 15.2195 5.08792 16.8125 5.27542 18.407C5.46399 19.9968 6.11605 21.496 7.1504 22.718C6.79608 23.7086 6.66795 24.7659 6.77541 25.8124C6.86991 26.8444 7.2449 27.8749 7.7129 28.8124C8.55739 30.2194 9.77538 31.3444 11.1824 31.9999C12.6824 32.6569 14.2753 32.8444 15.8698 32.4694C16.6198 33.2194 17.4628 33.8749 18.4003 34.3444C19.3378 34.8139 20.4628 34.9999 21.4948 34.9999C23.1043 35.0097 24.6769 34.5185 25.9947 33.5944C27.3072 32.6569 28.2447 31.3444 28.7127 29.8444C29.7719 29.6432 30.7682 29.1934 31.6197 28.5319C32.4627 27.8749 33.2127 27.1249 33.6822 26.1874C34.5251 24.7819 34.8071 23.1875 34.6196 21.5945C34.4322 20 33.8697 18.5015 32.8377 17.282ZM21.5878 33.0304C20.0878 33.0304 18.9628 32.5609 17.9323 31.7179C17.9323 31.7179 18.0253 31.6234 18.1198 31.6234L24.1197 28.1554C24.2862 28.0803 24.4196 27.9469 24.4947 27.7804C24.5698 27.636 24.6021 27.4731 24.5877 27.3109V18.875L27.1197 20.375V27.3124C27.1455 28.0547 27.0215 28.7945 26.755 29.4878C26.4885 30.181 26.085 30.8134 25.5687 31.3473C25.0523 31.8811 24.4337 32.3054 23.7497 32.5949C23.0658 32.8843 22.3305 33.0314 21.5878 33.0304ZM9.49488 27.8749C8.83789 26.7499 8.55739 25.4374 8.83789 24.125C8.83789 24.125 8.93239 24.2195 9.02539 24.2195L15.0253 27.6874C15.1693 27.7638 15.3325 27.7966 15.4948 27.7819C15.6823 27.7819 15.8698 27.7819 15.9628 27.6874L23.2753 23.4695V26.3749L17.1823 29.9374C16.5506 30.3042 15.8527 30.5427 15.1287 30.6393C14.4046 30.7358 13.6686 30.6884 12.9629 30.4999C11.4629 30.1249 10.2449 29.1874 9.49488 27.8749ZM7.9004 14.8445C8.56239 13.7234 9.58826 12.8627 10.8074 12.4056V19.532C10.8074 19.718 10.8074 19.907 10.9004 20C10.9755 20.1665 11.1089 20.2998 11.2754 20.375L18.5878 24.5944L16.0573 26.0944L10.0574 22.625C9.41842 22.2639 8.85742 21.7797 8.40684 21.2004C7.95627 20.6211 7.62506 19.9582 7.4324 19.25C7.05741 17.8445 7.1504 16.157 7.9004 14.8445ZM28.6197 19.625L21.3073 15.407L23.8377 13.9071L29.8377 17.375C30.7752 17.9375 31.5252 18.6875 31.9947 19.625C32.4642 20.5625 32.7447 21.5945 32.6502 22.7195C32.5603 23.7755 32.1699 24.7837 31.5252 25.6249C30.8697 26.4694 30.0252 27.1249 28.9947 27.4999V20.375C28.9947 20.1875 28.9947 20 28.9002 19.907C28.9002 19.907 28.8072 19.718 28.6197 19.625ZM31.1502 15.875C31.1502 15.875 31.0572 15.782 30.9627 15.782L24.9627 12.3126C24.7752 12.2196 24.6822 12.2196 24.4947 12.2196C24.3072 12.2196 24.1197 12.2196 24.0252 12.3126L16.7128 16.532V13.6251L22.8073 10.0626C23.7448 9.50009 24.7752 9.31259 25.9002 9.31259C26.9322 9.31259 27.9627 9.68759 28.9002 10.3446C29.7447 11.0001 30.4947 11.8446 30.8697 12.7821C31.2447 13.7196 31.3377 14.8445 31.1502 15.875ZM15.4003 21.125L12.8699 19.625V12.5946C12.8699 11.5626 13.1503 10.4376 13.7128 9.59459C14.2753 8.6571 15.1198 8.0001 16.0573 7.53211C17.0127 7.05249 18.0956 6.88812 19.1503 7.06261C20.1823 7.15711 21.2128 7.62511 22.0573 8.2821C22.0573 8.2821 21.9628 8.3751 21.8698 8.3751L15.8698 11.8446C15.7033 11.9197 15.57 12.0531 15.4948 12.2196C15.4003 12.4071 15.4003 12.5001 15.4003 12.6876V21.125ZM16.7128 18.125L19.9948 16.25L23.2753 18.125V21.875L19.9948 23.75L16.7128 21.875V18.125Z" fill="currentColor"/>
</svg>`,
			anthropic: `<svg width="24" height="24" viewBox="4.49 9.88 31.01 21.91" xmlns="http://www.w3.org/2000/svg">
<path d="M26.9568 9.88184H22.1265L30.7753 31.7848H35.4917L26.9568 9.88184ZM13.028 9.88184L4.4917 31.7848H9.32203L11.2305 27.1793H20.2166L22.0126 31.6724H26.8444L18.0832 9.88184H13.028ZM12.5783 23.1361L15.4987 15.3853L18.5315 23.1361H12.5783Z" fill="currentColor"/>
</svg>`,
			google: `<svg width="24" height="24" viewBox="3 3 34 34" xmlns="http://www.w3.org/2000/svg">
<path d="M37 20.034C27.8809 20.5837 20.5808 27.8809 20.0326 37H19.966C19.4163 27.8809 12.1177 20.5837 3 20.034V19.9674C12.1191 19.4163 19.4163 12.1191 19.966 3H20.0326C20.5822 12.1191 27.8809 19.4163 37 19.9674V20.034Z" fill="currentColor"/>
</svg>`,
			xai: `<svg width="24" height="24" viewBox="6.36 5 27.28 30" xmlns="http://www.w3.org/2000/svg">
<path d="M12.4579 15.6036L26.1529 35H20.0656L6.37059 15.6036H12.4579ZM12.4524 26.3764L15.4974 30.6909L12.4551 35H6.36377L12.4524 26.3764ZM33.6365 7.15727V35H28.647V14.2236L33.6365 7.15727ZM33.6365 5L20.0656 24.2205L17.0206 19.9073L27.5451 5H33.6365Z" fill="currentColor"/>
</svg>`,
			moonshotai: `<svg width="24" height="24" viewBox="4.49 4.49 31.02 31.02" xmlns="http://www.w3.org/2000/svg">
<path d="M5.85893 26.3499L18.1801 29.6463C18.1635 30.5223 18.1894 31.3987 18.2576 32.2722L25.9507 34.3298C23.669 35.2716 21.1952 35.6547 18.7355 35.4471L18.503 35.4265L18.4462 35.4213L18.3377 35.4097L18.2163 35.3968C18.1486 35.3886 18.081 35.38 18.0135 35.3709L17.8753 35.3528L17.7332 35.3322C17.5951 35.3121 17.4573 35.2901 17.3198 35.2663L17.2656 35.256L17.1687 35.2392L17.0305 35.2133L16.9401 35.194L16.82 35.1694L16.7231 35.1488L16.6004 35.1229L16.4751 35.0932L16.3537 35.0648L16.2659 35.0428L16.1522 35.0144L16.0359 34.9834L15.9132 34.9511L15.8073 34.9214L15.6665 34.8827L15.5864 34.8568L15.4779 34.8245L15.3578 34.7884L15.2222 34.7445L15.1473 34.7199L15.0439 34.6863L14.9277 34.6463L14.8424 34.6153C14.8235 34.6089 14.8045 34.6025 14.7856 34.5959L14.6978 34.5636L14.5673 34.5158L14.4937 34.4874L14.3904 34.4487L14.278 34.4035L14.1643 34.3583L14.0623 34.3169L13.9396 34.2653L13.8582 34.2291L13.7768 34.1942C13.7591 34.1865 13.7415 34.1788 13.7239 34.171L13.6386 34.1322L13.5056 34.0715L13.4384 34.0405L13.3144 33.9811L13.2343 33.9423L13.1258 33.8907L13.0147 33.8338L12.8946 33.7731L12.8274 33.7383L12.6944 33.6672L12.6208 33.6285L12.5459 33.5871C12.526 33.576 12.5062 33.5648 12.4864 33.5536L12.365 33.4851L12.2875 33.4412L12.2217 33.4024L12.1287 33.3495L12.0227 33.2849L11.9026 33.2126L11.8354 33.1712L11.7269 33.1028L11.6482 33.0524L11.5461 32.9878L11.4557 32.9271L11.3872 32.8819C11.3639 32.8665 11.3407 32.851 11.3175 32.8354L11.2607 32.7966L11.2038 32.7579C11.1866 32.7459 11.1693 32.7338 11.1522 32.7217L11.0785 32.6701L10.9804 32.6003L10.8912 32.5357L10.7957 32.466L10.7233 32.4117L10.6252 32.3381L10.527 32.2619L10.4159 32.1753L10.3578 32.1301L10.2751 32.063L10.1795 31.9855L10.0646 31.8912L10.0052 31.8408L9.94575 31.7904C9.92717 31.7746 9.90866 31.7586 9.8902 31.7426L9.83208 31.691L9.75329 31.6225L9.66287 31.5424L9.57504 31.4649L9.49496 31.39L9.40841 31.3099L9.33996 31.2453L9.22629 31.1368C9.18345 31.0953 9.14082 31.0535 9.09842 31.0116L9.06096 30.9754L9.008 30.9211L8.91887 30.8307L8.85429 30.7648L8.78971 30.6964C8.71592 30.6207 8.64357 30.5436 8.57271 30.4652L8.46938 30.3515L8.38929 30.2611L8.29758 30.1578L8.24333 30.0945L8.17488 30.0144L8.09996 29.9266L8.04054 29.8542C8.02888 29.8401 8.01725 29.8258 8.00567 29.8116L7.94754 29.7406L7.86229 29.6346L7.80934 29.5675L7.74475 29.4848L7.71892 29.4525C6.97985 28.4945 6.3556 27.4532 5.85893 26.3499ZM4.54143 18.8661L19.2057 22.7888C18.9602 23.6439 18.758 24.5109 18.5999 25.3864L32.5718 29.1244C31.8777 30.0748 31.0782 30.9436 30.1887 31.7142L5.34872 25.0673L5.32805 25.0079L5.28284 24.8736C5.26087 24.8078 5.23934 24.742 5.21826 24.676L5.20922 24.6462C5.1098 24.3302 5.02063 24.011 4.94184 23.6891L4.90309 23.5264L4.87984 23.423L4.85272 23.2978L4.82947 23.1931L4.80622 23.0769L4.78426 22.9684L4.76101 22.847C4.72743 22.6648 4.69643 22.4814 4.6693 22.2967L4.64735 22.1443L4.63314 22.0371L4.61635 21.9053C4.6077 21.8361 4.59952 21.7668 4.5918 21.6974L4.58535 21.6367C4.48884 20.7162 4.47414 19.7891 4.54143 18.8661ZM6.59905 12.214L22.0318 16.3421C21.5565 17.1236 21.1212 17.9322 20.7273 18.764L35.3166 22.6674C35.1332 23.7266 34.8413 24.7496 34.4538 25.7222L19.5351 21.731L4.66026 17.7526L4.67964 17.6235L4.68997 17.5602L4.70289 17.4736L4.72226 17.3613L4.74551 17.2347C4.7791 17.0435 4.81785 16.8536 4.85918 16.6638L4.89534 16.5036L4.92118 16.3938L4.95218 16.2685C4.98059 16.1523 5.0103 16.036 5.04259 15.9224L5.07876 15.7906L5.10847 15.6834L5.14722 15.5542L5.17951 15.4483L5.21826 15.3243L5.25184 15.2184L5.29189 15.0957C5.62637 14.0924 6.06355 13.1262 6.59646 12.2127L6.59905 12.214ZM12.3366 6.53068L26.913 10.4289C26.1438 11.1271 25.4158 11.8693 24.7327 12.6519L34.8374 15.3553C35.1823 16.4558 35.4083 17.608 35.5 18.7976L7.22034 11.2336L7.27846 11.1497L7.31334 11.098L7.365 11.027L7.42442 10.943L7.49546 10.8448L7.56521 10.7518L7.64788 10.6407L7.71246 10.5568L7.78609 10.4625L7.85713 10.3721L7.93463 10.2765L8.00567 10.1874L8.08963 10.0879L8.15938 10.0027L8.24463 9.90321L8.31308 9.82571L8.40608 9.71979L8.47454 9.64229L8.56108 9.54671L8.63083 9.47179L8.72512 9.37104L8.80004 9.29354L8.88142 9.207L9.09842 8.98742L9.22758 8.86084L9.30379 8.7885L9.40196 8.69679C10.2922 7.86254 11.2771 7.13554 12.3366 6.53068ZM20.022 4.50018H20.1473L20.2532 4.50147L20.3423 4.50277L20.4121 4.50535L20.4999 4.50793L20.5593 4.50922L20.6575 4.5131L20.7182 4.51568L20.7957 4.51956L20.8655 4.52214L20.9778 4.5286L21.1135 4.53764L21.2995 4.55185L21.4131 4.56089L21.47 4.56606L21.5694 4.57639L21.6753 4.58672L21.736 4.59318L21.8678 4.60868L21.9324 4.61643L22.0719 4.63452L22.1765 4.64743L22.2308 4.65518L22.3147 4.6681L22.5821 4.70943L22.6725 4.72493L22.7565 4.73914L22.9373 4.77272L23.0561 4.79597L23.1982 4.82439L23.2576 4.83731L23.3545 4.85797L23.4075 4.87089L23.4875 4.88768L23.5418 4.9006L23.6257 4.91997L23.689 4.93547L23.7807 4.95743L23.9047 4.98843L24.0494 5.02718L24.1954 5.06593L24.3413 5.10726L24.4059 5.12664L24.4963 5.15247L24.5971 5.18347L24.6914 5.21318L24.756 5.23385L24.8205 5.25451L24.9187 5.28681L25.0466 5.32943L25.1783 5.37593L25.2403 5.39789L25.323 5.4276L25.4431 5.47151L25.5852 5.52447L25.735 5.5826L25.8642 5.63426L25.9249 5.6601L26.0024 5.6911L26.0554 5.71435L26.1367 5.74793L26.1884 5.77118L26.262 5.80347L26.4041 5.86547L26.5333 5.92489L26.6289 5.97009L26.7257 6.01659L26.8032 6.05276L26.9221 6.11218L27.0396 6.1703L27.1714 6.23747L27.2398 6.27364L27.3031 6.30722L27.3625 6.33822L27.44 6.38084L27.493 6.40926L27.5602 6.44672L27.6738 6.5113L27.8107 6.5888L27.9231 6.65468L27.9967 6.69859L28.0652 6.73993L28.1892 6.81613L28.3029 6.88718L28.4294 6.96726L28.4759 6.99826L28.5586 7.05122L28.6671 7.12355L28.7188 7.15842L28.7989 7.21267L28.8789 7.26822L28.9086 7.29017C28.9784 7.33797 29.0481 7.38705 29.1166 7.43742L29.2238 7.51492L29.3078 7.57692L29.3801 7.63246L29.4912 7.71642L29.5971 7.79909L29.6488 7.83784L29.7134 7.8908L29.8244 7.97992L29.9265 8.06388L30.0363 8.15559C30.9559 8.93059 31.7839 9.81279 32.5021 10.779L13.8285 5.7841L13.9086 5.74922L13.9925 5.71305L14.0971 5.66914L14.2082 5.62393C14.3542 5.5658 14.5014 5.50768 14.6487 5.45472L14.7727 5.40951L14.8928 5.36689L15.0013 5.32814L15.1253 5.2881C15.2377 5.24935 15.3526 5.21318 15.4663 5.17831L15.5839 5.14343L15.6949 5.11114L15.8267 5.07239L15.9365 5.04268L16.0656 5.0091L16.1767 4.9781L16.293 4.94839L16.4105 4.91997L16.5332 4.89156L16.6495 4.86572L16.7761 4.8386L16.8936 4.81276L17.0163 4.78951L17.1351 4.76627L17.2643 4.74302L17.3818 4.72235L17.5084 4.70039L17.6273 4.68231L17.7526 4.66293L17.8714 4.64614L18.0031 4.62935L18.1207 4.61385L18.2563 4.59835L18.3726 4.58543L18.5082 4.57252C18.6283 4.5596 18.7484 4.54927 18.8698 4.54152L19.0068 4.53118L19.123 4.52472L19.2651 4.51697L19.3852 4.51181L19.5144 4.50664L19.6397 4.50406L19.7675 4.50147L20.022 4.49889V4.50018Z" fill="currentColor"/>
</svg>`,
			openrouter: `<svg viewBox="2.85 5.48 18.29 13.03" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M728.039 234C819.325 234 893.323 308.62 893.323 400.668C893.323 492.716 819.325 567.336 728.039 567.336L891.984 732.656C912.81 753.655 898.061 789.56 868.613 789.56H397.472C245.333 789.56 122 665.193 122 511.78C122 358.367 245.333 234 397.472 234H728.039ZM397.472 345.112C306.189 345.112 232.189 419.732 232.189 511.78C232.189 603.828 306.189 678.448 397.472 678.448C488.756 678.448 562.756 603.828 562.756 511.78C562.756 419.732 488.756 345.112 397.472 345.112Z" fill="currentColor" transform="scale(0.0234375)"/>
</svg>`,
			groq: `<svg width="24" height="24" viewBox="9.14 4.49 21.72 31.01" xmlns="http://www.w3.org/2000/svg">
<path d="M20.056 4.50022C14.0839 4.44597 9.20616 9.15015 9.15036 15.0106C9.09611 20.8726 13.8855 25.6621 19.8576 25.7163H23.6085V21.7391H20.056C16.3252 21.7825 13.2671 18.8468 13.2237 15.1827C13.1787 11.5216 16.1702 8.52086 19.901 8.47746H20.056C23.7868 8.47746 26.8108 11.4457 26.8216 15.1083V24.8809C26.8216 28.5109 23.8085 31.4683 20.1211 31.5132C18.3617 31.5007 16.6759 30.8049 15.42 29.5726L12.551 32.3905C14.5529 34.3571 17.239 35.4715 20.0451 35.4998H20.1877C26.0823 35.413 30.8175 30.7212 30.85 24.9351V14.8603C30.7059 9.0928 25.9165 4.50022 20.056 4.50022Z" fill="currentColor"/>
</svg>`,
			"github-copilot": `<svg width="24" height="24" viewBox="4.5 7.05 31 25.9" xmlns="http://www.w3.org/2000/svg">
<path d="M35.3993 26.4544C34.2871 28.3855 27.8314 32.9425 20 32.9425C12.1686 32.9425 5.71288 28.3855 4.60075 26.4544C4.5427 26.3532 4.50826 26.2401 4.5 26.1237V22.418C4.51199 22.3209 4.53496 22.2256 4.56846 22.1338C5.04896 20.9261 6.30833 19.1733 7.93325 18.7031C8.14896 18.149 8.468 17.3404 8.76508 16.7437C8.71727 16.2776 8.69485 15.8094 8.69792 15.3409C8.69792 13.6217 9.06217 12.113 10.1601 10.9906C10.6729 10.4662 11.3097 10.0644 12.064 9.76091C13.871 8.29357 16.4453 7.05745 19.9716 7.05745C23.4978 7.05745 26.129 8.29357 27.936 9.76091C28.6903 10.0644 29.3271 10.4662 29.8399 10.9906C30.9378 12.113 31.3021 13.6217 31.3021 15.3409C31.3021 15.8162 31.284 16.2877 31.2349 16.7437C31.532 17.3404 31.851 18.149 32.0667 18.7031C33.6917 19.1733 34.951 20.9261 35.4315 22.1338C35.4677 22.2248 35.4908 22.3205 35.5 22.418V26.1237C35.4917 26.2401 35.4573 26.3532 35.3993 26.4544ZM20.2222 18.7147H19.7778C19.6422 18.945 19.4889 19.1644 19.3193 19.3709C18.3247 20.5941 16.8419 21.2981 14.7881 21.2981C12.56 21.2981 10.9273 20.8344 9.90304 19.6719C9.86495 19.6283 9.82833 19.5835 9.79325 19.5375L9.66667 19.6719V28.1775C11.5202 29.1837 15.4972 30.992 20 30.992C24.5028 30.992 28.4798 29.1837 30.3333 28.1775V19.6719L30.2067 19.5375C30.2067 19.5375 30.1641 19.5957 30.097 19.6719C29.0727 20.8344 27.44 21.2981 25.2119 21.2981C23.1581 21.2981 21.6753 20.5941 20.6807 19.3709C20.5111 19.1644 20.3578 18.945 20.2222 18.7147ZM23.2292 22.9127C23.9383 22.9127 24.5208 23.4952 24.5208 24.2043V26.7877C24.5208 27.4968 23.9383 28.0793 23.2292 28.0793C22.52 28.0793 21.9375 27.4968 21.9375 26.7877V24.2043C21.9375 23.4952 22.52 22.9127 23.2292 22.9127ZM16.7708 22.9127C17.48 22.9127 18.0625 23.4952 18.0625 24.2043V26.7877C18.0625 27.4968 17.48 28.0793 16.7708 28.0793C16.0617 28.0793 15.4792 27.4968 15.4792 26.7877V24.2043C15.4792 23.4952 16.0617 22.9127 16.7708 22.9127ZM21.0501 14.9237C21.2258 16.289 21.5707 17.3947 22.1842 18.149C22.7551 18.8517 23.649 19.3606 25.2119 19.3606C27.2437 19.3606 28.1724 18.9253 28.6438 18.3905C29.1398 17.8287 29.3646 16.9051 29.3646 15.3409C29.3646 13.8684 29.0507 12.9552 28.454 12.3455C27.8378 11.7152 26.7502 11.2321 24.8063 11.0216C22.8856 10.8136 21.975 11.1998 21.5345 11.7049C21.187 12.1014 20.97 12.7485 20.9688 13.7431V13.7702C20.9688 14.1121 20.9959 14.4966 21.0501 14.9237ZM18.9499 14.9237C19.0041 14.4966 19.0312 14.1117 19.0312 13.7689V13.7431C19.03 12.7485 18.813 12.1014 18.4655 11.7049C18.025 11.1998 17.1144 10.8136 15.1937 11.0216C13.2498 11.2321 12.1622 11.7152 11.546 12.3455C10.9493 12.9552 10.6354 13.8684 10.6354 15.3409C10.6354 16.9051 10.8615 17.8287 11.3562 18.3905C11.8276 18.9253 12.7563 19.3606 14.7881 19.3606C16.351 19.3606 17.2449 18.8517 17.8158 18.149C18.4293 17.3947 18.7742 16.289 18.9499 14.9237Z" fill="currentColor"/>
</svg>`,
			"amazon-bedrock": `<svg width="24" height="24" viewBox="3.9 2.99 28.65 30.01" xmlns="http://www.w3.org/2000/svg">
<path d="M21.5835 24.7904H25.7835C26.0754 24.7904 26.314 25.0318 26.314 25.3277V27.8096C26.8199 27.9343 27.2691 28.2255 27.5896 28.6362C27.9102 29.047 28.0833 29.5536 28.0813 30.0746C28.0813 31.3605 27.0517 32.4037 25.7835 32.4037C24.514 32.4037 23.4844 31.3605 23.4844 30.0746C23.4844 28.9741 24.2399 28.0509 25.2531 27.8082V25.865H21.5849V32.2237C21.5852 32.3161 21.5618 32.407 21.5169 32.4877C21.4721 32.5684 21.4072 32.6362 21.3285 32.6846L17.6603 34.9224C17.577 34.9733 17.4813 35 17.3837 34.9995C17.2862 34.999 17.1907 34.9714 17.108 34.9197L10.3906 30.7114C10.3131 30.6628 10.2493 30.5952 10.2052 30.515C10.161 30.4348 10.138 30.3447 10.1384 30.2532V25.8636L6.78241 23.9136C6.70609 23.8694 6.64181 23.8071 6.59521 23.7322C6.5486 23.6573 6.52111 23.5721 6.51514 23.4841V23.4472V16.4626C6.51514 16.2717 6.61468 16.0944 6.77696 15.999L10.1384 14.0053V9.70163C10.1384 9.52572 10.2229 9.36208 10.3634 9.26253L10.392 9.24344L17.1107 5.07885C17.194 5.027 17.2901 4.99951 17.3882 4.99951C17.4863 4.99951 17.5824 5.027 17.6657 5.07885L21.3339 7.36296C21.4115 7.41162 21.4753 7.47921 21.5194 7.55938C21.5636 7.63955 21.5866 7.72964 21.5862 7.82115V13.9999H26.8445V11.3857C26.3384 11.2609 25.8889 10.9696 25.5684 10.5585C25.2479 10.1475 25.0749 9.6406 25.0772 9.11935C25.0772 7.83342 26.1067 6.79023 27.3749 6.79023C28.6445 6.79023 29.6727 7.83342 29.6727 9.11935C29.6727 10.2198 28.9186 11.143 27.9054 11.3857V14.5371C27.9059 14.6073 27.8926 14.6768 27.8662 14.7418C27.8399 14.8068 27.8009 14.8659 27.7516 14.9158C27.7024 14.9658 27.6437 15.0055 27.5791 15.0327C27.5144 15.0599 27.4451 15.0741 27.3749 15.0744H21.5862V17.5372H30.6191C30.7351 17.0302 31.0192 16.5773 31.4252 16.2522C31.8313 15.9271 32.3353 15.749 32.8554 15.7467C34.1236 15.7467 35.1532 16.7885 35.1532 18.0745C35.1532 19.3604 34.125 20.4036 32.8554 20.4036C32.3351 20.4012 31.8309 20.2229 31.4249 19.8975C31.0188 19.5722 30.7348 19.119 30.6191 18.6117H21.5835V21.2531H28.3377L29.5854 22.8622C29.9329 22.659 30.3283 22.5522 30.7309 22.5527C32.0004 22.5527 33.0286 23.5945 33.0286 24.8804C33.0286 26.1664 32.0004 27.2096 30.7309 27.2096C29.4627 27.2096 28.4331 26.1664 28.4331 24.8804C28.4331 24.4086 28.5722 23.9695 28.8095 23.6027L27.8222 22.3277H21.5835V24.7904ZM17.3875 6.16704L14.6016 7.89342V11.9407H13.5407V8.55071L11.1993 10.003V14.019L14.0766 15.8735L17.0316 14.0135V10.9098H18.0925V14.3135C18.0925 14.499 17.9971 14.6721 17.8416 14.7703L14.6466 16.779V19.6167L16.5857 20.9927L15.9775 21.8736L14.0602 20.5127L11.9738 21.8831L11.397 20.9831L13.5857 19.5445V16.8308L10.6579 14.9408L7.57606 16.7681V19.0536L10.2652 17.4322L10.8079 18.3554L7.57606 20.304V23.1363L10.5297 24.8518L13.6252 22.9863L14.1666 23.9095L11.1993 25.6973V29.9546L13.7575 31.5569L16.9825 29.6123L17.5253 30.5369L14.7748 32.1951L17.3903 33.8328L20.5239 31.9196V24.0377L14.0357 27.9828L13.4902 27.0623L20.5239 22.7859V8.12115L17.3875 6.16704ZM25.7835 28.8228C25.6198 28.8237 25.4579 28.8568 25.307 28.9204C25.1561 28.984 25.0192 29.0767 24.9042 29.1932C24.7892 29.3097 24.6983 29.4478 24.6367 29.5995C24.5751 29.7512 24.5441 29.9136 24.5453 30.0773C24.5453 30.7687 25.099 31.3292 25.7835 31.3292C25.947 31.3281 26.1087 31.2948 26.2594 31.2313C26.41 31.1677 26.5467 31.0751 26.6615 30.9587C26.7764 30.8424 26.8672 30.7045 26.9287 30.553C26.9903 30.4016 27.0215 30.2395 27.0204 30.076C27.0216 29.9123 26.9906 29.7501 26.9291 29.5985C26.8676 29.4468 26.7769 29.3088 26.662 29.1923C26.5471 29.0758 26.4104 28.9831 26.2597 28.9194C26.109 28.8558 25.9472 28.8238 25.7835 28.8228ZM30.7336 23.6272C30.5699 23.6281 30.4079 23.6613 30.257 23.7249C30.1062 23.7884 29.9693 23.8811 29.8543 23.9977C29.7393 24.1142 29.6484 24.2523 29.5868 24.404C29.5252 24.5557 29.4942 24.7181 29.4954 24.8818C29.4954 25.5745 30.0491 26.1364 30.7322 26.1364C30.896 26.1355 31.0579 26.1023 31.2088 26.0387C31.3597 25.9752 31.4966 25.8825 31.6116 25.7659C31.7266 25.6494 31.8175 25.5113 31.8791 25.3596C31.9406 25.2079 31.9717 25.0455 31.9704 24.8818C31.9717 24.7181 31.9406 24.5557 31.8791 24.404C31.8175 24.2523 31.7266 24.1142 31.6116 23.9977C31.4966 23.8811 31.3597 23.7884 31.2088 23.7249C31.0579 23.6613 30.8973 23.6281 30.7336 23.6272ZM32.8541 16.8226C32.6904 16.8235 32.5284 16.8567 32.3775 16.9203C32.2266 16.9838 32.0898 17.0765 31.9747 17.1931C31.8597 17.3096 31.7688 17.4477 31.7073 17.5994C31.6457 17.7511 31.6146 17.9135 31.6159 18.0772C31.6159 18.7686 32.1709 19.329 32.8541 19.329C33.0176 19.3279 33.1793 19.2947 33.3299 19.2311C33.4806 19.1676 33.6172 19.075 33.7321 18.9586C33.8469 18.8422 33.9377 18.7044 33.9993 18.5529C34.0609 18.4014 34.092 18.2393 34.0909 18.0758C34.0922 17.9122 34.0612 17.7499 33.9997 17.5983C33.9382 17.4467 33.8474 17.3087 33.7325 17.1922C33.6177 17.0757 33.481 16.9829 33.3302 16.9193C33.1795 16.8556 33.0177 16.8223 32.8541 16.8213V16.8226ZM27.3736 7.86342C27.2099 7.86449 27.0482 7.8978 26.8974 7.96145C26.7467 8.02509 26.61 8.11783 26.4951 8.23434C26.3802 8.35086 26.2895 8.48887 26.228 8.64049C26.1665 8.79212 26.1355 8.95437 26.1367 9.11798C26.1367 9.81072 26.6904 10.3725 27.3736 10.3725C27.5373 10.3717 27.6992 10.3385 27.8501 10.2749C28.001 10.2113 28.1379 10.1186 28.2529 10.0021C28.3679 9.88558 28.4588 9.7475 28.5204 9.59579C28.582 9.44408 28.613 9.28171 28.6118 9.11798C28.613 8.95426 28.582 8.79189 28.5204 8.64018C28.4588 8.48847 28.3679 8.35039 28.2529 8.23386C28.1379 8.11733 28.001 8.02462 27.8501 7.96106C27.6992 7.89749 27.5373 7.86432 27.3736 7.86342Z" fill="currentColor"/>
</svg>`,
			minimax: `<svg width="24" height="24" viewBox="3.11 6.62 31.01 26.11" xmlns="http://www.w3.org/2000/svg">
<path d="M17.8758 9.20865C17.8758 8.59461 17.3777 8.09634 16.7663 8.09634C16.155 8.09634 15.6567 8.59575 15.6567 9.20865V27.6446C15.6567 29.0714 14.4985 30.2324 13.0755 30.2324C11.6523 30.2324 10.4941 29.0714 10.4941 27.6446V15.8167C10.4941 15.2027 9.99591 14.7044 9.38453 14.7044C8.77316 14.7044 8.275 15.2038 8.275 15.8167V20.8301C8.275 22.2567 7.11678 23.4179 5.69364 23.4179C4.2705 23.4179 3.1123 22.2567 3.1123 20.8301V19.0129C3.1123 18.6054 3.44177 18.2752 3.84822 18.2752C4.25467 18.2752 4.58413 18.6054 4.58413 19.0129V20.8301C4.58413 21.4441 5.08227 21.9424 5.69364 21.9424C6.30502 21.9424 6.80317 21.443 6.80317 20.8301V15.8167C6.80317 14.39 7.96139 13.2289 9.38453 13.2289C10.8077 13.2289 11.9659 14.39 11.9659 15.8167V27.6446C11.9659 28.2587 12.4641 28.7569 13.0755 28.7569C13.6868 28.7569 14.1849 28.2575 14.1849 27.6446V20.4123V9.20865C14.1849 7.78194 15.3431 6.62082 16.7663 6.62082C18.1894 6.62082 19.3476 7.78194 19.3476 9.20865V24.4746C19.3476 24.8821 19.0182 25.2123 18.6117 25.2123C18.2053 25.2123 17.8758 24.8821 17.8758 24.4746V9.20865ZM31.531 13.2289C30.1079 13.2289 28.9496 14.39 28.9496 15.8167V25.6969C28.9496 26.311 28.4515 26.8093 27.8401 26.8093C27.2287 26.8093 26.7306 26.3099 26.7306 25.6969V9.20865C26.7306 7.78194 25.5723 6.62082 24.1492 6.62082C22.7261 6.62082 21.5679 7.78194 21.5679 9.20865V30.1383C21.5679 30.7523 21.0697 31.2506 20.4583 31.2506C19.8469 31.2506 19.3488 30.7511 19.3488 30.1383V27.5471C19.3488 27.1396 19.0194 26.8093 18.6129 26.8093C18.2065 26.8093 17.877 27.1396 17.877 27.5471V30.1383C17.877 31.565 19.0352 32.7261 20.4583 32.7261C21.8815 32.7261 23.0397 31.565 23.0397 30.1383V9.20865C23.0397 8.59461 23.5378 8.09634 24.1492 8.09634C24.7605 8.09634 25.2587 8.59575 25.2587 9.20865V25.6969C25.2587 27.1237 26.417 28.2848 27.8401 28.2848C29.2632 28.2848 30.4215 27.1237 30.4215 25.6969V15.8167C30.4215 15.2027 30.9196 14.7044 31.531 14.7044C32.1424 14.7044 32.6405 15.2038 32.6405 15.8167V24.4746C32.6405 24.8821 32.97 25.2123 33.3764 25.2123C33.7829 25.2123 34.1123 24.8821 34.1123 24.4746V15.8167C34.1123 14.39 32.9541 13.2289 31.531 13.2289Z" fill="currentColor"/>
</svg>`,
			mistral: `<svg width="24" height="24" viewBox="4.5 8.88 31 22.15" xmlns="http://www.w3.org/2000/svg">
<path d="M8.92783 8.88101H13.357V13.3088H17.7861V17.738H17.7835H22.2152V13.3088H26.6418V8.88101H31.0722V26.5949H35.5V31.0241H22.2139V26.5962H17.7861V22.1671H13.3557V26.5949L17.7861 26.5962V31.0241H4.5V26.5949H8.92783V8.88101ZM22.2139 26.5962H26.6418V22.1671H22.2152V26.5962H22.2139Z" fill="currentColor"/>
</svg>`,
			cerebras: `<svg width="24" height="24" viewBox="7.48 4.49 23.7 31.01" xmlns="http://www.w3.org/2000/svg">
<path d="M22.9846 6.52999C19.4122 6.52999 15.9861 7.94913 13.46 10.4752C10.9339 13.0013 9.51474 16.4274 9.51474 19.9999C9.51474 23.5723 10.9339 26.9984 13.46 29.5245C15.9861 32.0506 19.4122 33.4698 22.9846 33.4698V35.4991C14.4238 35.4991 7.48535 28.5592 7.48535 19.9984C7.48535 11.4376 14.4224 4.49915 22.9832 4.49915V6.52854L22.9846 6.52999ZM29.868 11.8562C28.7978 10.9477 27.5586 10.2598 26.2216 9.83189C24.8846 9.40401 23.4761 9.24465 22.0773 9.36298C20.6785 9.48132 19.3169 9.875 18.0707 10.5214C16.8246 11.1678 15.7185 12.0542 14.8162 13.1295C13.9138 14.2049 13.2329 15.448 12.8126 16.7875C12.3923 18.1269 12.241 19.5362 12.3673 20.9343C12.4936 22.3324 12.895 23.6918 13.5485 24.9342C14.202 26.1767 15.0946 27.2777 16.1751 28.1739L14.87 29.7296C13.594 28.6594 12.5414 27.3482 11.7722 25.871C11.003 24.3939 10.5323 22.7797 10.3871 21.1206C10.2418 19.4615 10.4247 17.7901 10.9255 16.2017C11.4263 14.6134 12.235 13.1392 13.3055 11.8635C14.376 10.5875 15.6873 9.5348 17.1645 8.7656C18.6418 7.99639 20.2561 7.52572 21.9153 7.38045C23.5745 7.23517 25.2461 7.41815 26.8345 7.91893C28.423 8.41971 29.8973 9.22848 31.1732 10.2991L29.868 11.8562ZM26.6016 13.0788C24.7668 12.1311 22.6319 11.9464 20.6616 12.5649C18.6913 13.1834 17.045 14.5551 16.0809 16.3813C15.1169 18.2076 14.9132 20.3408 15.514 22.3165C16.1149 24.2923 17.4718 25.9508 19.2894 26.9311L18.3392 28.7273C16.0689 27.4824 14.3791 25.3948 13.6343 22.915C12.8896 20.4352 13.1498 17.762 14.3586 15.4723C15.5674 13.1826 17.628 11.46 20.0957 10.6762C22.5635 9.89232 25.2404 10.1101 27.5489 11.2826L26.6016 13.0788ZM22.9832 14.9865C21.6536 14.9865 20.3784 15.5147 19.4382 16.4549C18.498 17.3951 17.9698 18.6702 17.9698 19.9999C17.9698 21.3295 18.498 22.6047 19.4382 23.5449C20.3784 24.485 21.6536 25.0132 22.9832 25.0132V27.0441C21.1149 27.0441 19.3232 26.3019 18.0022 24.9809C16.6811 23.6598 15.939 21.8681 15.939 19.9999C15.939 18.1316 16.6811 16.3399 18.0022 15.0189C19.3232 13.6978 21.1149 12.9557 22.9832 12.9557V14.9865Z" fill="currentColor"/>
<path d="M24.8474 18.3138C24.6315 18.0812 24.3826 17.8816 24.1087 17.7213C23.8701 17.5796 23.5982 17.5036 23.3207 17.5011C22.9513 17.5011 22.621 17.5692 22.3299 17.7039C22.0485 17.8307 21.7956 18.0131 21.5865 18.2401C21.3774 18.4672 21.2164 18.7341 21.1131 19.025C21.0059 19.319 20.9538 19.6276 20.9538 19.939C20.9538 20.2548 21.0059 20.5619 21.1131 20.853C21.2172 21.1436 21.3786 21.4104 21.5876 21.6375C21.7966 21.8647 22.049 22.0476 22.3299 22.1756C22.6196 22.3103 22.9528 22.3783 23.3207 22.3783C23.6336 22.3783 23.9247 22.3117 24.1927 22.1828C24.465 22.0524 24.6997 21.8569 24.8808 21.615L26.225 23.0722C26.0222 23.275 25.7904 23.4503 25.5268 23.598C25.0392 23.8699 24.5086 24.0561 23.958 24.1484C23.7118 24.1861 23.4989 24.2064 23.3207 24.2064C22.7362 24.21 22.156 24.107 21.6085 23.9022C21.0909 23.7108 20.6174 23.4166 20.2165 23.0374C19.8178 22.6565 19.5004 22.1987 19.2836 21.6917C19.0481 21.1378 18.9306 20.5409 18.9389 19.939C18.9389 19.2959 19.0548 18.7121 19.2836 18.1863C19.5009 17.6793 19.8167 17.2216 20.215 16.8406C20.6177 16.4625 21.0914 16.1685 21.6085 15.9773C22.156 15.7725 22.7362 15.6694 23.3207 15.6731C23.8349 15.6731 24.352 15.7716 24.8735 15.9686C25.3964 16.1685 25.8658 16.4901 26.2409 16.9087L24.8474 18.3138Z" fill="currentColor"/>
</svg>`,
			"cloudflare-ai-gateway": `<svg width="24" height="24" viewBox="4.6 9.75 31.01 20.54" xmlns="http://www.w3.org/2000/svg">
<path d="M16.1801 15.8791V14.0283C16.3472 14.0155 16.5271 14.0026 16.7199 14.0026C21.7966 13.8356 25.1254 18.3596 25.1254 18.3596C25.1254 18.3596 21.5267 23.3463 17.671 23.3463C17.1569 23.3463 16.6557 23.2692 16.1801 23.1021V17.4728C18.1465 17.7298 18.545 18.591 19.7274 20.5702L22.375 18.3468C22.375 18.3468 20.4343 15.8277 17.1955 15.8277C16.8356 15.8277 16.5014 15.8405 16.1801 15.8791ZM16.1801 9.75492V12.5246C16.3472 12.5118 16.5271 12.4989 16.7199 12.4861C23.763 12.2547 28.377 18.2696 28.377 18.2696C28.377 18.2696 23.0819 24.683 17.5939 24.683C17.0798 24.683 16.6171 24.6444 16.1801 24.5545V26.2767C16.5528 26.3152 16.9384 26.341 17.3625 26.341C22.4649 26.341 26.1664 23.7448 29.7523 20.6473C30.3435 21.1229 32.7597 22.2796 33.261 22.7937C29.8679 25.6341 21.9251 27.9346 17.4396 27.9346C17.0155 27.9346 16.5914 27.9089 16.1801 27.8704V30.2866H35.6001V9.75492H16.1801ZM16.1801 23.1021V24.5545C11.4376 23.7191 10.1266 18.7966 10.1266 18.7966C10.1266 18.7966 12.4015 16.2775 16.1801 15.8791V17.4728H16.1673C14.188 17.2414 12.6329 19.0922 12.6329 19.0922C12.6329 19.0922 13.5068 22.2025 16.1801 23.1021ZM7.77464 18.591C7.77464 18.591 10.5765 14.4525 16.1801 14.0283V12.5246C9.9724 13.0259 4.6001 18.2696 4.6001 18.2696C4.6001 18.2696 7.64612 27.0735 16.1801 27.8575V26.2767C9.90814 25.4798 7.77464 18.591 7.77464 18.591Z" fill="currentColor"/>
</svg>`,
			nvidia: `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M8.948 8.798v-1.43a6.7 6.7 0 0 1 .424-.018c3.922-.124 6.493 3.374 6.493 3.374s-2.774 3.851-5.75 3.851c-.398 0-.787-.062-1.158-.185v-4.346c1.528.185 1.837.857 2.747 2.385l2.04-1.714s-1.492-1.952-4-1.952a6.016 6.016 0 0 0-.796.035m0-4.735v2.138l.424-.027c5.45-.185 9.01 4.47 9.01 4.47s-4.08 4.964-8.33 4.964c-.37 0-.733-.035-1.095-.097v1.325c.3.035.61.062.91.062 3.957 0 6.82-2.023 9.593-4.408.459.371 2.34 1.263 2.73 1.652-2.633 2.208-8.772 3.984-12.253 3.984-.335 0-.653-.018-.971-.053v1.864H24V4.063zm0 10.326v1.131c-3.657-.654-4.673-4.46-4.673-4.46s1.758-1.944 4.673-2.262v1.237H8.94c-1.528-.186-2.73 1.245-2.73 1.245s.68 2.412 2.739 3.11M2.456 10.9s2.164-3.197 6.5-3.533V6.201C4.153 6.59 0 10.653 0 10.653s2.35 6.802 8.948 7.42v-1.237c-4.84-.6-6.492-5.936-6.492-5.936z" fill="currentColor"/>
</svg>`,
			huggingface: `<svg width="24" height="24" viewBox="4.49 5.9 31.01 28.2" xmlns="http://www.w3.org/2000/svg">
<path d="M26.7365 7.70867C30.9594 10.1097 33.562 14.5441 33.562 19.3448C33.562 20.7468 33.3436 22.0995 32.9378 23.3705C33.2276 23.3346 33.5219 23.3669 33.7971 23.4647C34.0723 23.5626 34.3208 23.7233 34.523 23.9341C34.8338 24.2495 35.0303 24.6597 35.0814 25.0996C35.1324 25.5394 35.0351 25.9837 34.8048 26.3619C35.0922 26.5944 35.3008 26.9044 35.4079 27.2525L35.4318 27.3398C35.5164 27.6526 35.6009 28.3121 35.15 28.9828C35.4938 29.5042 35.5431 30.1608 35.2811 30.7244C34.9217 31.5276 34.0228 32.1588 32.2826 32.838L31.9979 32.9479L31.8133 33.0156C31.1398 33.2593 30.5593 33.4312 30.3183 33.5017L30.1971 33.5355C28.9431 33.8779 27.6495 34.0639 26.3476 34.0907C24.4876 34.0907 23.1067 33.5834 22.2289 32.5872C20.7465 32.8382 19.2331 32.8468 17.748 32.6126C16.8688 33.5933 15.4935 34.0907 13.6504 34.0907C12.4424 34.0666 11.2411 33.9044 10.07 33.6074L9.75858 33.5228L9.37391 33.4101C8.81508 33.2406 8.26281 33.0503 7.71825 32.8394C5.97523 32.1588 5.07625 31.529 4.71693 30.7244C4.45485 30.1608 4.50416 29.5028 4.84798 28.9828C4.68566 28.7453 4.57646 28.4756 4.52782 28.1921C4.47919 27.9085 4.49227 27.6178 4.56616 27.3398C4.66339 26.9552 4.88461 26.6127 5.19602 26.3619C4.96607 25.9839 4.86892 25.5399 4.91997 25.1003C4.97102 24.6607 5.16735 24.2508 5.47783 23.9355C5.80614 23.5861 6.26268 23.3846 6.76995 23.362L6.87985 23.3606C6.46754 22.0619 6.2584 20.7073 6.25986 19.3448C6.25986 14.5441 8.86242 10.1097 13.0854 7.70867C15.1666 6.52898 17.518 5.90889 19.9102 5.90889C22.3025 5.90889 24.6553 6.52898 26.7365 7.70867ZM8.99205 23.8862C9.16818 24.8542 12.3132 27.1975 12.0075 27.7006C11.7397 28.1444 10.8858 27.3638 10.6717 27.1566L10.6139 27.1003L10.3772 26.8932C9.58668 26.2182 7.13067 24.2159 6.51631 24.8754C5.91041 25.5235 6.68399 26.0858 8.00288 26.8762L9.10759 27.5343L9.29923 27.6512C10.7717 28.5573 10.8774 28.8349 10.6378 29.2195C10.3729 29.6352 6.312 26.2605 5.93155 27.6935C5.5511 29.1181 10.077 29.5309 9.79804 30.5201C9.51622 31.5064 6.60649 28.6545 6.01469 29.7634C5.41583 30.8766 10.1193 32.1842 10.1574 32.1941L10.3828 32.2504L10.6294 32.3096C12.3583 32.7098 15.6527 33.2255 16.8786 31.4585C17.8269 30.0875 17.7804 29.0504 16.5292 27.7809L16.4488 27.7006C15.1173 26.3929 14.3423 24.4766 14.3423 24.4766L14.3183 24.3949L14.2831 24.2934C14.1676 23.9834 13.8829 23.393 13.3954 23.4705C12.7472 23.5734 12.271 25.1755 13.5645 26.1943L13.6349 26.2478C15.0116 27.2637 13.3602 27.9528 12.8275 27.0002L12.7458 26.8537L12.5443 26.5014C11.8919 25.3756 10.7379 23.5269 10.0939 23.1239C9.34432 22.6561 8.81592 22.9154 8.99205 23.8862ZM29.9055 23.1239C29.1544 23.5959 27.7031 26.0463 27.1719 27.0002C27.0805 27.1684 26.9358 27.3014 26.7606 27.3785C26.5854 27.4555 26.3895 27.4721 26.2038 27.4258C26.1115 27.3997 26.0266 27.3525 25.9558 27.2877C25.9293 27.2626 25.9061 27.2342 25.8868 27.2031L25.8671 27.1637L25.8558 27.1355L25.8459 27.1087L25.8417 27.0904L25.8375 27.0665C25.8337 27.0441 25.8318 27.0215 25.8318 26.9988C25.8318 26.8297 25.9319 26.624 26.1841 26.3972C26.2207 26.3633 26.2602 26.3309 26.3025 26.2985L26.3687 26.2478C26.3997 26.2253 26.4293 26.2027 26.4575 26.1788C27.7017 25.1783 27.2649 23.6283 26.6421 23.4776L26.5984 23.4691L26.5195 23.4635C26.4902 23.4638 26.4609 23.4667 26.4321 23.4719L26.3927 23.479L26.3335 23.4987L26.2785 23.5227L26.2391 23.5438L26.1996 23.5706L26.1489 23.6086L26.1165 23.6368C25.8727 23.8594 25.7318 24.2399 25.6797 24.4005L25.6571 24.4766C25.6571 24.4766 24.9103 26.3211 23.6295 27.6245L23.5534 27.7006C23.0391 28.205 22.7136 28.6728 22.5642 29.135C22.3627 29.7507 22.4712 30.3581 22.8601 31.0415C22.9376 31.1781 23.025 31.3162 23.1236 31.4585C24.3664 33.2551 27.7482 32.6929 29.456 32.2899L29.859 32.1913L30.2112 32.087C30.6001 31.9686 31.2483 31.7587 31.9021 31.4952L32.167 31.3867L32.2586 31.3472L32.3488 31.3078L32.5235 31.2289L32.6376 31.1753C33.383 30.8202 33.996 30.4102 34.0383 30.01L34.0397 29.9593C34.0385 29.8907 34.0206 29.8235 33.9875 29.7634C33.8551 29.5154 33.6057 29.4647 33.2957 29.5267L33.2323 29.5408C33.1703 29.5549 33.1055 29.5746 33.0406 29.5972L32.904 29.6465L32.8279 29.6775C32.0402 30.0016 31.0834 30.6709 30.5635 30.7272H30.572C30.5486 30.7299 30.525 30.7314 30.5015 30.7315H30.4677L30.4339 30.7272L30.4015 30.7202C30.3056 30.6976 30.238 30.6356 30.2042 30.5201C30.191 30.4743 30.1886 30.4261 30.1971 30.3792C30.2845 29.8931 31.547 29.5408 32.6109 29.0969L32.7039 29.0575C33.4479 28.7419 34.0707 28.3769 34.0918 27.8851V27.8288C34.0892 27.7821 34.0816 27.7358 34.0693 27.6907C34.0016 27.4371 33.8227 27.337 33.562 27.337C32.4559 27.337 29.9689 29.2533 29.4475 29.2533C29.4123 29.2533 29.3799 29.2435 29.3658 29.2195C29.3408 29.1801 29.3191 29.1386 29.301 29.0955C29.1601 28.7602 29.3968 28.4445 30.7946 27.5935L31.0891 27.4159C31.8472 26.965 32.5122 26.5874 32.9786 26.245C33.3873 25.9463 33.648 25.6729 33.6874 25.3995L33.6916 25.3601C33.7029 25.2009 33.6381 25.0402 33.4845 24.8754C33.4561 24.8447 33.4228 24.819 33.3859 24.7993L33.338 24.7781L33.3196 24.7711C33.2605 24.7517 33.1987 24.7422 33.1365 24.7429C32.9082 24.7429 32.6165 24.8415 32.2981 24.9965C31.4005 25.4376 30.2817 26.338 29.7251 26.8072L29.3742 27.1101L29.3277 27.1566C29.215 27.2666 28.9219 27.5371 28.6331 27.7006L28.533 27.7527L28.4753 27.7795C28.4202 27.8031 28.3625 27.8202 28.3034 27.8302H28.3104C28.2959 27.8322 28.2813 27.8337 28.2667 27.8344L28.2808 27.833L28.2625 27.8344C28.1512 27.8415 28.0582 27.8048 27.9948 27.7006C27.9792 27.6727 27.9723 27.6408 27.975 27.609C28.0131 26.9537 30.8411 24.8035 31.0074 23.8862L31.02 23.8186C31.1609 22.9027 30.6382 22.6674 29.9055 23.1239ZM19.9123 7.29581C13.1516 7.29581 7.67034 12.6911 7.67034 19.3434C7.67034 20.3184 7.7873 21.2653 8.00852 22.1728L8.01979 22.1601C8.37488 21.7402 8.88214 21.5119 9.45282 21.5119C9.95304 21.5232 10.4378 21.6768 10.852 21.9515C11.162 22.1488 11.5072 22.4926 11.8595 22.9294C12.2273 22.4053 12.8318 22.0868 13.4799 22.077C14.6805 22.077 15.4061 23.1028 15.6809 24.0257L15.7471 24.1736L15.8317 24.3526C16.1022 24.9106 16.6701 25.9575 17.4422 26.7198C18.9359 28.1853 19.3078 29.7 18.5695 31.3219C19.5178 31.4242 20.4747 31.4176 21.4215 31.3021C20.7099 29.724 21.0551 28.2444 22.4642 26.8128L22.5572 26.7198C23.5365 25.756 24.1875 24.3385 24.3213 24.0257C24.5961 23.1028 25.3189 22.077 26.5195 22.077C27.1676 22.0868 27.7721 22.4053 28.1399 22.9294C28.4922 22.4926 28.8374 22.1502 29.1516 21.9515C29.5658 21.6763 30.0494 21.5239 30.5466 21.5119C31.0496 21.5119 31.5076 21.6895 31.85 22.0192C32.0472 21.1596 32.1529 20.2649 32.1529 19.3448C32.1529 12.6911 26.6716 7.29581 19.9123 7.29581ZM22.529 19.8732L23.1476 19.5744C23.9268 19.2025 24.4016 19.0348 24.4016 19.7886C24.4016 21.3287 23.3152 24.3089 19.956 24.385H19.6968C16.4207 24.3117 15.3061 21.4823 15.2497 19.9112L15.2483 19.7886C15.2483 18.2288 17.2943 20.6143 19.8278 20.6143C20.8367 20.6143 21.7709 20.2311 22.529 19.8732ZM28.1892 15.4445C28.8233 15.4445 29.3348 15.9489 29.3348 16.5717C29.3348 17.1931 28.8219 17.699 28.1892 17.699C28.0401 17.7001 27.8922 17.6718 27.754 17.6158C27.6157 17.5597 27.4899 17.477 27.3837 17.3723C27.2774 17.2676 27.1928 17.1431 27.1347 17.0057C27.0766 16.8683 27.0462 16.7209 27.0451 16.5717C27.0451 15.9489 27.558 15.4445 28.1892 15.4445ZM11.8102 15.4445C12.4415 15.4445 12.9544 15.9489 12.9544 16.5717C12.9544 17.1931 12.4415 17.699 11.8102 17.699C11.6609 17.7003 11.5129 17.6721 11.3745 17.6162C11.2361 17.5602 11.1101 17.4775 11.0037 17.3728C10.8973 17.2681 10.8126 17.1435 10.7544 17.006C10.6962 16.8686 10.6657 16.721 10.6646 16.5717C10.6646 15.9489 11.1775 15.4445 11.8102 15.4445ZM22.7868 14.2594C23.2377 13.7184 23.9789 13.4985 24.6609 13.7043C25.3415 13.91 25.8304 14.499 25.8981 15.1979C25.9657 15.8954 25.5993 16.5647 24.9695 16.893C24.5158 17.1297 24.3396 16.2209 23.8887 16.0687L23.8916 16.0645C23.4872 15.9264 22.8038 16.5745 22.5882 16.1758C22.425 15.8734 22.3565 15.529 22.3917 15.1872C22.4269 14.8455 22.5655 14.5222 22.7868 14.2594ZM16.6954 14.2594C17.1492 14.8005 17.2267 15.5558 16.8927 16.1758C16.6785 16.5745 15.9909 15.9264 15.5893 16.0645L15.5935 16.0687C15.4414 16.1194 15.3202 16.2575 15.2089 16.4069L15.0426 16.6394C14.8876 16.8507 14.7326 17.0085 14.5114 16.893C14.2053 16.7349 13.9535 16.4889 13.7882 16.1866C13.623 15.8843 13.552 15.5395 13.5842 15.1965C13.6518 14.499 14.1408 13.91 14.8214 13.7043C15.1538 13.6037 15.5085 13.6026 15.8415 13.7013C16.1746 13.7999 16.4714 13.994 16.6954 14.2594Z" fill="currentColor"/>
</svg>`,
			baseten: `<svg width="24" height="24" viewBox="0 0 24.7 31" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="17.9" height="6.5" fill="currentColor"/><rect x="18.5" y="5.2" width="6.2" height="7.5" fill="currentColor"/><rect x="6.2" y="12.9" width="11.7" height="6.2" fill="currentColor"/><rect x="18.5" y="18.1" width="6.2" height="7.5" fill="currentColor"/><rect x="12.3" y="25.3" width="5.6" height="5.7" fill="currentColor"/>
</svg>`,
			opencode: `<svg width="24" height="24" viewBox="5 3 14.41 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.4004 21H5V3H19.4004V6.59961H8.59961V17.4004H15.7998V13.7998H12.2002V10.2002H19.4004V21Z" fill="currentColor"/>
</svg>`,
			"opencode-go": `<svg width="24" height="24" viewBox="4.8 3 14.41 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.40005 17.4H19.2001V21H4.80005V13.8H8.40005V17.4ZM15.6001 10.2V13.8H8.40005V10.2H15.6001ZM19.2001 10.2H15.6001V6.6H4.80005V3H19.2001V10.2Z" fill="currentColor"/>
</svg>`,
			xiaomi: `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M12 0C8.016 0 4.756.255 2.493 2.516.23 4.776 0 8.033 0 12.012c0 3.98.23 7.235 2.494 9.497C4.757 23.77 8.017 24 12 24c3.983 0 7.243-.23 9.506-2.491C23.77 19.247 24 15.99 24 12.012c0-3.984-.233-7.243-2.502-9.504C19.234.252 15.978 0 12 0zM4.906 7.405h5.624c1.47 0 3.007.068 3.764.827.746.746.827 2.233.83 3.676v4.54a.15.15 0 0 1-.152.147h-1.947a.15.15 0 0 1-.152-.148V11.83c-.002-.806-.048-1.634-.464-2.051-.358-.36-1.026-.441-1.72-.458H7.158a.15.15 0 0 0-.151.147v6.98a.15.15 0 0 1-.152.148H4.906a.15.15 0 0 1-.15-.148V7.554a.15.15 0 0 1 .15-.149zm12.131 0h1.949a.15.15 0 0 1 .15.15v8.892a.15.15 0 0 1-.15.148h-1.949a.15.15 0 0 1-.151-.148V7.554a.15.15 0 0 1 .151-.149zM8.92 10.948h2.046c.083 0 .15.066.15.147v5.352a.15.15 0 0 1-.15.148H8.92a.15.15 0 0 1-.152-.148v-5.352a.15.15 0 0 1 .152-.147Z" fill="currentColor"/>
</svg>`,
			zai: `<svg width="24" height="24" viewBox="1.49 1.49 27.02 27.02" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M24.51 28.51H5.49c-2.21 0-4-1.79-4-4V5.49c0-2.21 1.79-4 4-4h19.03c2.21 0 4 1.79 4 4v19.03C28.51 26.72 26.72 28.51 24.51 28.51ZM15.47 7.1l-1.3 1.85c-.2.29-.54.47-.9.47h-7.1V7.09C6.16 7.1 15.47 7.1 15.47 7.1ZM24.3 7.1 13.14 22.91H5.7L16.86 7.1ZM14.53 22.91l1.31-1.86c.2-.29.54-.47.9-.47h7.09v2.33h-9.3Z" fill="currentColor"/>
</svg>`,
			qwen: `<svg viewBox="0.41 0 27.18 28.01" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27.0482997609375,16.093917358203125L23.2809152609375,13.918146358203124C23.374042060937498,13.757291758203126,23.4248380609375,13.573860658203126,23.4248380609375,13.381963758203124L23.4248380609375,12.217883958203124C23.4248380609375,11.835501458203126,23.2202429609375,11.481338678203125,22.888655660937502,11.289441828203126L21.8797874609375,10.706696778203124C21.5482001609375,10.514799900203124,21.1404194609375,10.514799900203124,20.8088343609375,10.706696778203124L17.7201426009375,12.490208158203124C17.3885564509375,12.682105058203124,17.1839599609375,13.034856558203124,17.1839599609375,13.418650158203125L17.1839599609375,14.582729858203125C17.1839599609375,14.965112658203125,17.3885553809375,15.319275358203125,17.7201426009375,15.511172258203125L24.9684791609375,19.696214658203125C25.300065960937502,19.888112058203127,25.7078466609375,19.888112058203127,26.0394315609375,19.696214658203125L27.0482997609375,19.113469158203124C27.379887960937502,18.921571758203125,27.5844829609375,18.568820958203126,27.5844829609375,18.185026658203125L27.5844829609375,17.020946958203126C27.5844829609375,16.638564558203125,27.379887960937502,16.284401858203125,27.0482997609375,16.092504958203126L27.0482997609375,16.093917358203125Z" fill="currentColor"/>
<path d="M22.335545490625,3.7476133590625L18.568160490625,5.923384639062499C18.475033490625,5.7625300390625,18.342399590625,5.627073739062499,18.175900890625,5.5311251390625L17.167031490625,4.9483796390625C16.835445390625,4.7564827390625,16.427664590625,4.7564827390625,16.096077490625,4.9483796390625L15.087208030625,5.5311251390625C14.755621880625,5.7230219390625,14.551025390625,6.0757734390625,14.551025390625,6.459567339062501L14.551025390625,10.026589839062499C14.551025390625,10.4089722390625,14.755620810625,10.7631349390625,15.087208030625,10.9550318390625L16.096077490625,11.5377769390625C16.427663590625,11.7296743390625,16.835444190625,11.7296743390625,17.167030290625,11.5377769390625L24.415367090625,7.3527338390625C24.746954390625,7.1608369390625,24.951549390625,6.8080854390625,24.951549390625,6.4242920390625L24.951549390625,5.2602123390625C24.951549390625,4.8778299390625,24.746954390625,4.5236670990625,24.415367090625,4.3317704790625005L23.406498890625002,3.7490251990625C23.074911090625,3.5571283180625,22.667130490625,3.5571283180625,22.335545490625,3.7490251990625L22.335545490625,3.7476133590625Z" fill="currentColor"/>
<path d="M9.2878987390625,1.6551098L9.2878987390625,6.0052404C9.1030566390625,6.0052404,8.9182152390625,6.053215,8.7517166390625,6.1491632L7.7428471490625,6.7319088C7.4112609890625,6.9238057,7.2066650390625,7.276557,7.2066650390625,7.6603503L7.2066650390625,8.8244305C7.2066650390625,9.2068129,7.4112609890625,9.560976,7.7428471490625,9.7528725L10.8315389390625,11.536385C11.1631250390625,11.728281,11.570905639062499,11.728281,11.902493039062499,11.536385L12.9113621390625,10.953639C13.2429485390625,10.761743,13.4475450390625,10.408991,13.4475450390625,10.025197L13.4475450390625,1.6551098C13.4475450390625,1.2727274,13.2429494390625,0.91856486,12.9113621390625,0.726668L11.902493039062499,0.1439226C11.5709066390625,-0.047974203,11.1631262390625,-0.047974203,10.8315398390625,0.1439226L9.8226704390625,0.726668C9.4910843390625,0.91856486,9.2864885390625,1.2713163,9.2864885390625,1.6551098L9.2878987390625,1.6551098Z" fill="currentColor"/>
<path d="M0.95170956375,11.90887979140625L4.71909524375,14.08465049140625C4.62596894375,14.245504891406249,4.57517244375,14.428935991406249,4.57517244375,14.62083289140625L4.57517244375,15.78491309140625C4.57517244375,16.16729549140625,4.77976844375,16.52145859140625,5.11135484375,16.71335509140625L6.12022404375,17.296099691406248C6.45181034375,17.48799709140625,6.85959104375,17.48799709140625,7.19117734375,17.296099691406248L10.27987004375,15.51258899140625C10.61145634375,15.32069209140625,10.81605234375,14.96794029140625,10.81605234375,14.584146491406251L10.81605234375,13.42006679140625C10.81605234375,13.03768439140625,10.61145734375,12.68352179140625,10.27987004375,12.491624791406249L3.03153274375,8.30658135140625C2.69994644375,8.11468447040625,2.2921658437500003,8.11468447040625,1.96057944375,8.30658135140625L0.95171022375,8.88932693140625C0.62012319375,9.07981253140625,0.41552734375,9.43397519140625,0.41552734375,9.81635769140625L0.41552734375,10.98043749140625C0.41552734375,11.36281989140625,0.62012319375,11.71698289140625,0.95170956375,11.90887979140625Z" fill="currentColor"/>
<path d="M5.6630003703125,24.25519135703125L9.430386070312501,22.07942055703125C9.523513270312499,22.24027485703125,9.6561469703125,22.37573245703125,9.8226456703125,22.47168015703125L10.8315148703125,23.05442615703125C11.1631011703125,23.24632315703125,11.5708818703125,23.24632315703125,11.9024686703125,23.05442615703125L12.9113387703125,22.47168015703125C13.2429250703125,22.279783257031248,13.4475210703125,21.92703155703125,13.4475210703125,21.54323765703125L13.4475210703125,17.97621525703125C13.4475210703125,17.59383275703125,13.2429260703125,17.23966997703125,12.9113387703125,17.04777312703125L11.9024686703125,16.46502807703125C11.5708827703125,16.27313119903125,11.1631021703125,16.27313119903125,10.8315162703125,16.46502807703125L3.5831791803125,20.65007065703125C3.2515927603125,20.84196755703125,3.0469970703125,21.19471935703125,3.0469970703125,21.57851315703125L3.0469970703125,22.742592857031248C3.0469970703125,23.12497615703125,3.2515930203125,23.47913785703125,3.5831791803125,23.671034857031252L4.5920482703125,24.253780857031252C4.9236347703125,24.44567775703125,5.3314153703125005,24.44567775703125,5.6630019703125,24.253780857031252L5.6630003703125,24.25519135703125Z" fill="currentColor"/>
<path d="M18.7120137640625,26.347708765625L18.7120137640625,21.997577665625002C18.8968553640625,21.997577665625002,19.0816964640625,21.949604065625,19.2481965640625,21.853654365625L20.2570648640625,21.270908365625C20.588652164062502,21.079011465625,20.7932476640625,20.726260165625,20.7932476640625,20.342466365625L20.7932476640625,19.178386465625C20.7932476640625,18.796002865625,20.588652164062502,18.441841165625,20.2570648640625,18.249944365625L17.1683730640625,16.466432955625C16.8367869640625,16.274536084625,16.4290063640625,16.274536084625,16.0974202640625,16.466432955625L15.0885508040625,17.049178005625C14.7569646540625,17.241074855625,14.5523681640625,17.593826265625,14.5523681640625,17.977620165625L14.5523681640625,26.347706765625C14.5523681640625,26.730089765625,14.7569635840625,27.084252765625,15.0885508040625,27.276148765625003L16.0974202640625,27.858895765625C16.4290063640625,28.050791765625,16.8367869640625,28.050791765625,17.1683730640625,27.858895765625L18.1772425640625,27.276148765625003C18.5088286640625,27.084252765625,18.713424164062502,26.731500765625,18.713424164062502,26.347706765625L18.7120137640625,26.347708765625Z" fill="currentColor"/>
</svg>`,
			volcengine: `<svg viewBox="0.34 1.73 22.8 20.54" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="dsh003-ark-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><path fill="#fff" d="M0 0h24v24H0z"/><path d="M5.734 22.267h8.694L10.384 9.68a.315.315 0 0 0-.603 0L5.738 22.267z" fill="#000"/></mask>
<path d="M.348 22.254h6.344L3.819 13.22a.318.318 0 0 0-.606 0z" fill="currentColor" fill-opacity="0.45"/>
<path d="M15.773 22.266h7.362l-3.377-10.642a.318.318 0 0 0-.607 0z" fill="currentColor" fill-opacity="0.45"/>
<g mask="url(#dsh003-ark-cut)">
<path d="M7.012 22.265h13.58L14.105 1.956a.315.315 0 0 0-.4-.205.32.32 0 0 0-.206.205z" fill="currentColor"/>
<path d="M2.886 22.267h10.28L8.328 7.113a.315.315 0 0 0-.401-.206.32.32 0 0 0-.206.206L2.883 22.267z" fill="currentColor"/>
</g>
<path d="M5.734 22.267h8.694L10.384 9.68a.315.315 0 0 0-.603 0L5.738 22.267z" fill="currentColor" fill-opacity="0.45"/>
</svg>`
		}));
		/**
		* 前缀/变体智能归一：注册表 id 未收录时按前缀匹配品牌。
		* （如 `opencode-go-anthropic` 自动匹配 `opencode`；表序即优先级。）
		*/
		const PROVIDER_LOGO_PREFIXES = [
			["opencode", "opencode"],
			["anthropic", "anthropic"],
			["openai", "openai"],
			["deepseek", "deepseek"],
			["google", "google"],
			["qwen", "qwen"],
			["moonshot", "moonshotai"],
			["minimax", "minimax"],
			["volcengine", "volcengine"],
			["ark", "volcengine"],
			["xiaomi", "xiaomi"],
			["zai", "zai"]
		];
		/** 解析 providerId 对应的 logo 键；未收录返回 null。 */
		function resolveProviderLogoKey(id) {
			const direct = PROVIDER_LOGO_ALIAS.get(id) ?? id;
			if (PROVIDER_LOGOS.has(direct)) return direct;
			for (const [prefix, key] of PROVIDER_LOGO_PREFIXES) if (id.startsWith(prefix)) return PROVIDER_LOGOS.has(key) ? key : null;
			return null;
		}
		/** 解析 providerId 对应的 SVG；未收录返回 null（调用方回退首字母）。 */
		function resolveProviderLogo(providerId) {
			const id = (providerId ?? "").trim().toLowerCase();
			if (id === "") return null;
			const key = resolveProviderLogoKey(id);
			return key === null ? null : PROVIDER_LOGOS.get(key) ?? null;
		}
		/**
		* 图标身份：两个提供方的键相同，顶栏就画出一模一样的图标，并成同一格（见 provider-family.ts）。
		* 与 ProviderLogo 的取图顺序一致（Magpie 路由 → T3 桥接 → 内置 logo → 首字母）。
		* @param providerId - 取图用的 id（显示身份覆盖后的值）。
		* @param name - 首字母兜底用的显示名。
		*/
		function providerIconKey(providerId, name) {
			if (isMagpieRoute(providerId)) return "magpie";
			if (isT3Route(providerId)) return `t3:${providerId.trim().toLowerCase()}`;
			const id = providerId.trim().toLowerCase();
			const key = id === "" ? null : resolveProviderLogoKey(id);
			return key === null ? `initial:${providerInitial(name)}` : key;
		}
		/** T3 字标（T3 Code 源码 T3Wordmark.tsx 原 path 与 viewBox）。 */
		const T3_WORDMARK = `<svg viewBox="15.5309 37 94.3941 56.96" xmlns="http://www.w3.org/2000/svg"><path d="M33.4509 93V47.56H15.5309V37H64.3309V47.56H46.4109V93H33.4509ZM86.7253 93.96C82.832 93.96 78.9653 93.4533 75.1253 92.44C71.2853 91.3733 68.032 89.88 65.3653 87.96L70.4053 78.04C72.5386 79.5867 75.0186 80.8133 77.8453 81.72C80.672 82.6267 83.5253 83.08 86.4053 83.08C89.6586 83.08 92.2186 82.44 94.0853 81.16C95.952 79.88 96.8853 78.12 96.8853 75.88C96.8853 73.7467 96.0586 72.0667 94.4053 70.84C92.752 69.6133 90.0853 69 86.4053 69H80.4853V60.44L96.0853 42.76L97.5253 47.4H68.1653V37H107.365V45.4L91.8453 63.08L85.2853 59.32H89.0453C95.9253 59.32 101.125 60.8667 104.645 63.96C108.165 67.0533 109.925 71.0267 109.925 75.88C109.925 79.0267 109.099 81.9867 107.445 84.76C105.792 87.48 103.259 89.6933 99.8453 91.4C96.432 93.1067 92.0586 93.96 86.7253 93.96Z" fill="currentColor"/></svg>`;
		/** T3 桥接的 CLI → 角标图标；Codex 复用上面的 openai。 */
		const T3_CLI_LOGOS = {
			antigravity: `<svg viewBox="0 5.2 128 117.8" xmlns="http://www.w3.org/2000/svg"><path d="M59.1 6.2Q63.2 5.2 66.7 5.7Q70.1 6.1 73.4 7.7Q76.8 9.2 79.8 12.3Q82.9 15.4 84.8 18.3Q86.8 21.2 90.2 29.8Q93.8 38.4 98.8 56.6Q103.9 74.8 107 83.2Q110.1 91.6 113.6 98.1Q117.1 104.6 122.5 111.2Q127.9 117.9 127.9 119.2Q127.9 120.6 127.2 121.3Q126.4 122.1 125.6 122.5Q124.8 122.9 123.7 122.9Q122.6 122.9 120.2 122.2Q117.9 121.6 114.2 119.1Q110.6 116.6 108.4 114.5Q106.2 112.4 102.8 108.1Q99.2 103.8 94.1 95.1Q88.9 86.4 85.6 81.8Q82.2 77.1 79.4 74.6Q76.6 72.1 74.7 71.1Q72.8 70.1 68.8 69.4Q64.9 68.8 60.2 69.4Q55.6 70.1 53.1 71.5Q50.6 72.9 48.2 75.1Q45.9 77.2 43 81.2Q40.1 85.2 36.8 91Q33.6 96.8 30.7 101.1Q27.8 105.4 24.8 109Q21.8 112.6 19.4 114.8Q17.1 116.9 13.8 119.2Q10.6 121.6 8.9 122.2Q7.2 122.8 5 122.8Q2.8 122.8 1.4 121.7Q0.1 120.6 0.1 119.5Q0.1 118.4 5.6 111.4Q11.1 104.4 14.6 97.8Q18.1 91.2 21.5 81.7Q24.9 72.1 30.1 54Q35.2 35.9 38.3 28.7Q41.4 21.4 43.8 17.8Q46.2 14.2 48.3 12.2Q50.4 10.1 52.7 8.7Q54.9 7.2 59.1 6.2Z" fill="currentColor"/></svg>`,
			devin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 263 300"><path fill="currentColor" d="M1.84577e-10 100.797V38.6224C1.88813e-05 35.8899 1.45777 33.365 3.82414 31.9988L57.6539 0.920185C60.0203 -0.446051 62.9358 -0.446051 65.3022 0.920185L119.132 31.9988C121.498 33.3651 122.956 35.8899 122.956 38.6224V70.375C123.192 80.9262 128.769 91.103 138.577 96.7655C148.384 102.428 159.986 102.169 169.242 97.0979L196.74 81.2217C199.107 79.8554 202.022 79.8554 204.388 81.2217L258.218 112.3C260.585 113.667 262.042 116.191 262.042 118.924V181.081C262.042 183.814 260.585 186.339 258.218 187.705L204.388 218.783C202.022 220.15 199.107 220.15 196.74 218.783L169.464 203.036C160.173 197.847 148.465 197.536 138.579 203.244C128.772 208.906 123.195 219.083 122.959 229.634V261.378C122.959 264.111 121.501 266.635 119.135 268.002L65.3048 299.08C62.9384 300.447 60.0229 300.447 57.6566 299.08L3.82673 268.002C1.46036 266.635 0.00260562 264.111 0.00260562 261.378V199.221C0.0026245 196.488 1.46038 193.963 3.82675 192.597L57.6565 161.519C60.0229 160.152 62.9384 160.152 65.3048 161.519L92.8656 177.431C102.11 182.467 113.679 182.711 123.463 177.062C133.349 171.355 138.934 161.06 139.086 150.419C138.85 139.868 133.274 128.601 123.466 122.938C113.658 117.276 102.056 117.534 92.8007 122.606L65.1758 138.645C62.7991 140.025 59.8649 140.024 57.4894 138.642L3.80216 107.407C1.44816 106.038 -1.88809e-05 103.52 1.84577e-10 100.797Z"/></svg>`
		};
		/** CLI 角标的 SVG。 */
		function t3CliLogo(cli) {
			return cli === "codex" ? PROVIDER_LOGOS.get("openai") ?? "" : T3_CLI_LOGOS[cli];
		}
		/** T3 桥接器路由的图标：T3 字标；面板顶栏里右下角再叠一枚 CLI 图标角标，字标在角标处挖出圆形缺口。
		* 触发按钮的 16px 小档只画字标（角标会小到看不清，旁边已有模型名）；后缀未收录的 CLI 也只画字标。 */
		function T3Logo(props) {
			const cli = props.small ? void 0 : t3CliOf(props.providerId);
			const wordmark = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: props.small ? "dsh003-provider-logo dsh003-provider-logo--sm" : "dsh003-provider-logo",
				"aria-hidden": "true",
				dangerouslySetInnerHTML: { __html: T3_WORDMARK }
			});
			if (cli === void 0) return wordmark;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: "dsh003-provider-mark",
				"data-cli-badge": cli,
				"aria-hidden": "true",
				children: [wordmark, /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "dsh003-provider-badge",
					"aria-hidden": "true",
					dangerouslySetInnerHTML: { __html: t3CliLogo(cli) }
				})]
			});
		}
		/** 顶栏/触发按钮提供方 logo：命中渲染内联 SVG（aria-hidden，色彩继承文本色），未命中回退首字母文本。
		* M-056：small=true 为触发按钮 16px 小档，logo 与首字母回退同用 `--sm` 盒。 */
		function ProviderLogo(props) {
			const small = props.small === true;
			if (isT3Route(props.providerId)) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(T3Logo, {
				providerId: props.providerId,
				small
			});
			const cls = small ? "dsh003-provider-logo dsh003-provider-logo--sm" : "dsh003-provider-logo";
			const svg = isMagpieRoute(props.providerId) ? magpie_default : resolveProviderLogo(props.providerId);
			return svg !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: cls,
				"aria-hidden": "true",
				dangerouslySetInnerHTML: { __html: svg }
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: small ? "dsh003-provider-initial dsh003-provider-initial--sm" : "dsh003-provider-initial",
				"aria-hidden": "true",
				children: providerInitial(props.name)
			});
		}
		//#endregion
		//#region src/client/provider-names.ts
		/**
		* M-065 供应商显示名美化：上游 pi-ai 目录对目录路由用路由 id 兜底当 displayName
		* （llm-pi-ai/src/index.ts:133 `declare(provider, provider)`，目录 JSON 无供应商名字段），
		* 设置页与 picker 左列因此显示全小写 id。本 helper 只做显示层转换：
		* 真名（≠ id）原样透传永不覆盖；兜底名按确定性规则美化。
		* 模型 ID / 模型名不经过此函数——ID 是发 API 的标识符必须原样。
		*/
		/** 复合品牌词映射（默认规则会写错形态的少数 token；未收录走通用规则）。 */
		const KNOWN_TOKENS = {
			deepseek: "DeepSeek",
			github: "GitHub",
			glm: "GLM",
			minimax: "MiniMax",
			moonshotai: "MoonshotAI",
			openai: "OpenAI",
			opencode: "OpenCode",
			openrouter: "OpenRouter",
			xai: "xAI",
			zai: "Z.ai"
		};
		function prettifyId(id) {
			return id.split("-").map((token) => {
				if (token === "") return token;
				if (/^\d+$/.test(token)) return token;
				if (token.length <= 2) return token.toUpperCase();
				const known = KNOWN_TOKENS[token.toLowerCase()];
				if (known !== void 0) return known;
				return token.charAt(0).toUpperCase() + token.slice(1);
			}).join(" ");
		}
		/**
		* @param providerId - 路由 id（如 qwen-token-plan-cn）。
		* @param displayName - 上报的显示名；≡ id 视为兜底名，做美化。
		* @returns 展示用名称（数据层原值不变，仅渲染面调用）。
		*/
		function prettifyProviderName(providerId, displayName) {
			if (displayName !== void 0 && displayName !== "" && displayName !== providerId) return displayName;
			return prettifyId(providerId);
		}
		//#endregion
		//#region src/client/display-identity.ts
		/** Presentation only: the official provider ID remains the selection and storage key. */
		function override(id) {
			const payload = window.__DSH_MODEL_PICKER_DISPLAY_PROVIDERS__;
			if (payload === null || typeof payload !== "object" || Array.isArray(payload)) return void 0;
			const entry = payload[id];
			if (entry === null || typeof entry !== "object" || Array.isArray(entry)) return void 0;
			const { name, icon } = entry;
			if (typeof name !== "string" || name.trim() === "") return void 0;
			return {
				name: name.trim(),
				...icon === "magpie" ? { icon } : {}
			};
		}
		function displayProviderName(provider) {
			return override(provider.id)?.name ?? prettifyProviderName(provider.id, provider.name);
		}
		function displayProviderIcon(provider) {
			const identity = override(provider.id);
			return {
				providerId: identity?.icon ?? provider.id,
				name: identity?.name ?? provider.name
			};
		}
		//#endregion
		//#region src/client/provider-family.ts
		/** 显示名里分隔「入口 · 渠道」的中点。 */
		const SEPARATOR = "·";
		/**
		* 图标身份 → 入口键：同品牌图标同入口；首字母兜底的图标各自成格。
		* 图标身份由调用方算（provider-logos.tsx 的 providerIconKey），本模块不依赖图标素材。
		* @param providerId - 提供方 id。
		* @param iconKey - 该提供方的图标身份。
		*/
		function familyKeyOf(providerId, iconKey) {
			return iconKey.startsWith("initial:") ? `solo:${providerId}` : iconKey;
		}
		/** 几个显示名开头相同的那几个词；分隔中点不算词。 */
		function sharedLead(names) {
			const [first = [], ...rest] = names.map((name) => name.split(/\s+/).filter((word) => word !== "" && word !== SEPARATOR));
			let length = first.length;
			for (const words of rest) {
				let index = 0;
				while (index < length && words[index] === first[index]) index += 1;
				length = index;
			}
			return first.slice(0, length).join(" ");
		}
		/** 入口名：单独成格用自己的显示名；并格取成员显示名共同的开头，没有共同开头时用品牌名。 */
		function familyLabel(key, members) {
			const names = members.map(displayProviderName);
			if (names.length === 1) return names[0];
			const lead = sharedLead(names);
			return lead !== "" ? lead : prettifyProviderName(key, void 0);
		}
		/**
		* 把排好序的提供方归并成入口。
		* @param sorted - 已按用户顺序排好的提供方。
		* @param keyOf - 取一个提供方的入口键（见 familyKeyOf）。
		* @returns 入口列表：入口顺序取其第一个成员的位置，成员之间保持原顺序。
		*/
		function groupFamilies(sorted, keyOf) {
			const byKey = /* @__PURE__ */ new Map();
			for (const provider of sorted) {
				const key = keyOf(provider);
				const members = byKey.get(key);
				if (members === void 0) byKey.set(key, [provider]);
				else members.push(provider);
			}
			return [...byKey].map(([key, members]) => ({
				key,
				label: familyLabel(key, members),
				members
			}));
		}
		/** 认得的提供方的渠道名，跟随界面语言，优先于显示名里剩下的那段。
		* `magpie` 的显示名就是入口名本身；DeepSeek 两条宿主上报的是英文「DeepSeek Account」与「DeepSeek」，
		* 照剩下的那段取会得到一个英文「Account」和一个空名字。 */
		const KNOWN_CHANNEL_KEYS = {
			magpie: "channelChat",
			"deepseek-account": "channelAccount",
			"deepseek-official": "channelApiKey"
		};
		/** 一个成员的渠道名：认得的提供方用本地化叫法，其余取显示名去掉入口名之后剩下的部分。 */
		function channelLabelOf(provider, family, t) {
			const key = KNOWN_CHANNEL_KEYS[provider.id];
			if (key !== void 0) return t(key);
			const name = displayProviderName(provider);
			const tail = (name.startsWith(family.label) ? name.slice(family.label.length) : name).replace(/^[\s\u00b7]+/, "").trim();
			return tail !== "" ? tail : name;
		}
		/**
		* 并格入口里各渠道的小标题。
		* @param family - 入口。
		* @param t - 面板的语言读取器。
		* @returns provider id → 渠道名；两个渠道撞名时改用各自的 id 美化名，保证标题能区分。
		*/
		function channelLabels(family, t) {
			const labels = family.members.map((member) => channelLabelOf(member, family, t));
			return new Map(family.members.map((member, index) => [member.id, labels.indexOf(labels[index]) === labels.lastIndexOf(labels[index]) ? labels[index] : prettifyProviderName(member.id, void 0)]));
		}
		//#endregion
		//#region src/client/locales.ts
		/** Namespace of the settings page's copy. */
		const SETTINGS_NS = "settings.modelControls";
		/** Namespace of the picker panel's copy. */
		const PICKER_NS = "modelControls";
		/** Fill `{name}` placeholders ourselves so the no-locale fallback behaves identically. */
		function format(template, params) {
			if (params === void 0) return template;
			return template.replace(/\{(\w+)\}/g, (whole, key) => Object.hasOwn(params, key) ? String(params[key]) : whole);
		}
		/** The form frame's copy, read from the page's dictionary. */
		function settingsFormLabels(t) {
			return {
				save: t("save"),
				saving: t("saving"),
				unavailable: t("unavailable"),
				readOnly: t("readOnly"),
				saveFailed: t("saveFailed")
			};
		}
		/** English copy for the settings page. */
		const settingsEn = {
			save: "Save",
			saving: "Saving…",
			unavailable: "This plugin is not loaded, so it cannot be configured right now.",
			readOnly: "This deployment stores settings read-only.",
			saveFailed: "The deployment did not accept these values; they were left for you to correct.",
			overridden: "Overridden",
			reset: "Reset to default",
			invalid: "Enter a complete http:// or https:// address, without credentials, query or fragment.",
			addressLabel: "Fallback Magpie base URL",
			addressHint: "Usually left blank: an empty value detects Magpie from the running configuration.",
			addressPlaceholder: "for example http://127.0.0.1:3425/v1",
			addressHelpLabel: "About the fallback Magpie base URL",
			addressHelpAutomatic: "Detected automatically by default: when the DeepSeek request uses Magpie credentials and points at this machine's /v1 endpoint, the model and favourite sources are labelled Magpie. Removing that route restores the original provider.",
			addressHelpWhenToFill: "Only fill this in when a custom setup is not detected. The address must start with http:// or https://, without credentials, query parameters or fragments. Refresh the interface after switching routes.",
			compactNamesLabel: "Shorten model names",
			compactNamesHint: "Usually left as on: the model entry reads V4.1-Flash instead of DeepSeek-V4.1-Flash. Type off to show the full upstream name.",
			compactNamesPlaceholder: "on or off",
			compactNamesHelpLabel: "About shortening model names",
			compactNamesHelpOn: "On (default) drops a redundant brand prefix from the model entry, so a narrower entry leaves more room for the input. The model list, search matching and every request keep the upstream name.",
			compactNamesHelpOff: "Off shows the full upstream name on the model entry, exactly as the provider reports it.",
			compactNamesInvalid: "Enter on or off, or clear the field to use the default.",
			formUnavailable: "Settings cannot be shown in this version of DeepSeek Harness. The model picker still works."
		};
		/** Simplified Chinese copy for the settings page. */
		const settingsZh = {
			save: "保存",
			saving: "保存中…",
			unavailable: "正在读取设置，或插件当前未加载。",
			readOnly: "当前设置为只读。",
			saveFailed: "未能保存，请检查连接或配置后重试。",
			overridden: "已覆盖",
			reset: "恢复默认",
			invalid: "填写完整的 http:// 或 https:// 地址，不含账号密码、查询参数或片段。",
			addressLabel: "备用 Magpie 接口地址",
			addressHint: "通常留空：留空时按运行配置自动识别 Magpie 接入。",
			addressPlaceholder: "例如 http://127.0.0.1:3425/v1",
			addressHelpLabel: "备用 Magpie 接口地址说明",
			addressHelpAutomatic: "默认自动识别：请求使用 Magpie 凭据、且地址为本机的 /v1 接口时，模型与收藏来源显示为 Magpie；撤掉路由后恢复原供应商。",
			addressHelpWhenToFill: "只有自定义接入未被识别时才需要填写。地址须以 http:// 或 https:// 开头，不含账号密码、查询参数或片段。切换路由后刷新界面。",
			compactNamesLabel: "模型名精简",
			compactNamesHint: "通常保持 on：模型入口显示 V4.1-Flash，而不是 DeepSeek-V4.1-Flash。填 off 显示完整上游名。",
			compactNamesPlaceholder: "on 或 off",
			compactNamesHelpLabel: "模型名精简说明",
			compactNamesHelpOn: "on（默认）去掉模型入口上多余的品牌前缀，入口更窄，留更多空间给输入框。模型列表、搜索匹配与所有请求都仍用上游原名。",
			compactNamesHelpOff: "off 时模型入口显示完整上游名，与提供方上报的名称完全一致。",
			compactNamesInvalid: "填写 on 或 off，或清空此字段使用默认值。",
			formUnavailable: "当前版本的 DeepSeek Harness 无法显示此设置页，模型选择器仍可正常使用。"
		};
		/** English copy for the picker panel. */
		const pickerEn = {
			searchNeutral: "Search models…",
			searchOtherProviders: "Other providers",
			searchOtherModels: "Other models",
			searchToggleLabel: "Search models",
			searchCloseLabel: "Close search",
			dialogLabel: "Choose a model",
			providerRailLabel: "Providers",
			favoritesLabel: "Favourites",
			favoriteAdd: "Add to favourites",
			favoriteRemove: "Remove from favourites",
			manageProvidersLabel: "Configure models & providers",
			providerReorderHint: "{name} · hold to reorder (Alt + ←/→)",
			channelChat: "Chat",
			channelAccount: "Account sign-in",
			channelApiKey: "API key",
			effortLabel: "Reasoning effort",
			emptyFavorites: "No favourites yet. Star a model to keep it here.",
			emptyNoMatch: "No matching models.",
			loadingCatalog: "Loading the model catalog…",
			loadFailed: "Could not load the model catalog. Try again later.",
			emptyProvider: "This provider lists no models.",
			emptyCatalog: "No models available. Check the provider configuration.",
			partialProviders: "Some providers’ models could not be loaded. Check the provider configuration.",
			retry: "Retry",
			providerLoadFailed: "{name}: {message}",
			effortUnsupported: "This model does not support effort settings",
			effortNoneShort: "N/A",
			effortNoneTitle: "This model has no effort levels",
			modelFallback: "Model",
			switchFailed: "Could not switch the model or the effort. Try again.",
			triggerAria: "Choose a model, currently {model}",
			triggerAriaEffort: "Choose a model, currently {model}, reasoning effort {effort}",
			effortOff: "Off",
			effortMinimal: "Minimal",
			effortLow: "Low",
			effortMedium: "Medium",
			effortHigh: "High",
			effortXHigh: "Extra high",
			effortMax: "Max"
		};
		/** Fallback reader for hosts without a locale service (tests included): Chinese copy. */
		const pickerFallback = (key, params) => format(pickerZh[key], params);
		/** Simplified Chinese copy for the picker panel. */
		const pickerZh = {
			searchNeutral: "搜索模型…",
			searchOtherProviders: "其它供应商",
			searchOtherModels: "其它模型",
			searchToggleLabel: "搜索模型",
			searchCloseLabel: "收起搜索",
			dialogLabel: "选择模型",
			providerRailLabel: "提供方",
			favoritesLabel: "收藏夹",
			favoriteAdd: "收藏",
			favoriteRemove: "取消收藏",
			manageProvidersLabel: "配置模型与提供方",
			providerReorderHint: "{name} · 长按拖动排序（Alt + ←/→）",
			channelChat: "Chat",
			channelAccount: "账号登录",
			channelApiKey: "API 密钥",
			effortLabel: "思考深度",
			emptyFavorites: "暂无收藏；点击模型行右侧的星标即可收藏。",
			emptyNoMatch: "没有匹配的模型。",
			loadingCatalog: "正在加载模型目录…",
			loadFailed: "模型目录加载失败，请稍后重试。",
			emptyProvider: "该提供方暂未公布模型。",
			emptyCatalog: "暂无可用模型，请检查提供方配置。",
			partialProviders: "部分提供方的模型未能加载，请检查提供方配置。",
			retry: "重试",
			providerLoadFailed: "{name}：{message}",
			effortUnsupported: "当前模型不支持调节",
			effortNoneShort: "无",
			effortNoneTitle: "此模型没有思考档位",
			modelFallback: "模型",
			switchFailed: "模型或档位切换失败，请重试。",
			triggerAria: "选择模型，当前 {model}",
			triggerAriaEffort: "选择模型，当前 {model}，思考深度 {effort}",
			effortOff: "关闭",
			effortMinimal: "极低",
			effortLow: "低",
			effortMedium: "中",
			effortHigh: "高",
			effortXHigh: "超高",
			effortMax: "最高"
		};
		//#endregion
		//#region src/client/provider-order.ts
		/** Stable client preference; unavailable providers retain their place for recovery.
		* 0.2.42：顺序同步到 DSH 宿主（prefs-sync.ts），localStorage 只做离线缓存。 */
		const STORAGE_KEY = "dsh003.model-picker.provider-order";
		function normalizeProviderOrder(value) {
			return Array.isArray(value) ? [...new Set(value.filter((id) => typeof id === "string" && id.length > 0))] : [];
		}
		function readOrder() {
			try {
				return normalizeProviderOrder(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]"));
			} catch {
				return [];
			}
		}
		let snapshot = readOrder();
		const listeners = /* @__PURE__ */ new Set();
		const getProviderOrder = () => snapshot;
		function subscribeProviderOrder(listener) {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		}
		function mergeProviderOrder(saved, available) {
			return normalizeProviderOrder([...saved, ...available]);
		}
		function orderedProviders(providers, order) {
			const byId = new Map(providers.map((provider) => [provider.id, provider]));
			return mergeProviderOrder(order, providers.map((provider) => provider.id)).flatMap((id) => {
				const provider = byId.get(id);
				return provider === void 0 ? [] : [provider];
			});
		}
		function setOrder(next) {
			if (next.length === snapshot.length && next.every((id, index) => id === snapshot[index])) return false;
			snapshot = next;
			try {
				window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
			} catch {}
			for (const listener of listeners) listener();
			return true;
		}
		function saveOrder(next) {
			if (setOrder(next)) pushPrefs({
				op: "order",
				order: next
			});
		}
		/** 用宿主的顺序覆盖本地；不回推。 */
		function replaceProviderOrder(order) {
			setOrder(normalizeProviderOrder(order));
		}
		/**
		* 把新出现的供应商补到末尾。只改本地、不推给宿主：这不是用户的排序操作，
		* 推上去会让还没同步的设备（手机首次打开时本地是空的）用目录默认顺序盖掉别处排好的顺序。
		*/
		function rememberProviders(ids) {
			setOrder(mergeProviderOrder(snapshot, ids));
		}
		/**
		* Move a group of visible providers together, keeping their relative order;
		* temporary failures keep their reserved positions.
		* 顶栏一格可能是并在一起的几个提供方（见 provider-family.ts），拖动一格要整组一起挪。
		*/
		function moveProviders(ids, moving, before) {
			const saved = mergeProviderOrder(snapshot, ids);
			const available = new Set(ids);
			const visible = saved.filter((value) => available.has(value));
			const group = visible.filter((value) => moving.includes(value));
			if (group.length === 0 || before !== null && (group.includes(before) || !visible.includes(before))) return;
			const next = visible.filter((value) => !group.includes(value));
			next.splice(before === null ? next.length : next.indexOf(before), 0, ...group);
			let index = 0;
			saveOrder(saved.map((value) => available.has(value) ? next[index++] : value));
		}
		//#endregion
		//#region src/client/use-provider-sort.ts
		/**
		* Long press owns its pointer; no catalog/model writes are involved.
		* @param groupKeyOf - 顶栏一格可以并入几个提供方：键相同的归同一格，拖动时整组一起挪。
		*   每格以第一个成员的 id 作为 `data-provider-id`；不传则一个提供方一格。
		*/
		function useProviderSort(providers, groupKeyOf) {
			const order = react.useSyncExternalStore(subscribeProviderOrder, getProviderOrder);
			const sorted = react.useMemo(() => orderedProviders(providers, order), [providers, order]);
			const groups = react.useMemo(() => {
				const byKey = /* @__PURE__ */ new Map();
				for (const provider of sorted) {
					const key = groupKeyOf === void 0 ? provider.id : groupKeyOf(provider);
					const members = byKey.get(key);
					if (members === void 0) byKey.set(key, [provider.id]);
					else members.push(provider.id);
				}
				return [...byKey.values()];
			}, [sorted, groupKeyOf]);
			const groupOf = (id) => groups.find((group) => group[0] === id) ?? [id];
			const idsKey = react.useMemo(() => JSON.stringify(providers.map((provider) => provider.id)), [providers]);
			const listRef = react.useRef(null);
			const cancelRef = react.useRef(null);
			const blockedClick = react.useRef(null);
			const [drag, setDrag] = react.useState(null);
			react.useEffect(() => {
				rememberProviders(providers.map((provider) => provider.id));
			}, [idsKey]);
			react.useEffect(() => () => {
				cancelRef.current?.();
			}, [idsKey]);
			const begin = (event, id) => {
				if (!event.isPrimary || event.button !== 0) return;
				cancelRef.current?.();
				blockedClick.current = null;
				const element = event.currentTarget;
				const list = listRef.current;
				if (list === null || groups.length < 2) return;
				const pointerId = event.pointerId;
				const originX = event.clientX, originY = event.clientY;
				const origin = element.getBoundingClientRect(), originScroll = list.scrollLeft;
				const ids = sorted.map((provider) => provider.id);
				let x = originX, y = originY;
				let active = false, done = false;
				let before = null;
				let scrollTimer;
				const update = () => {
					const bounds = list.getBoundingClientRect();
					before = Array.from(list.querySelectorAll("[data-provider-id]")).filter((button) => button.dataset.providerId !== id).find((button) => {
						const rect = button.getBoundingClientRect();
						return x < rect.left + rect.width / 2;
					})?.dataset.providerId ?? null;
					const baseLeft = origin.left - (list.scrollLeft - originScroll);
					const desiredLeft = origin.left + x - originX;
					const offset = Math.max(bounds.left, Math.min(bounds.right - origin.width, desiredLeft)) - baseLeft;
					setDrag((previous) => previous?.id === id && previous.before === before && previous.offset === offset ? previous : {
						id,
						before,
						offset
					});
				};
				const cleanup = () => {
					if (done) return;
					done = true;
					window.clearTimeout(holdTimer);
					window.clearInterval(scrollTimer);
					window.removeEventListener("pointermove", onMove);
					window.removeEventListener("pointerup", onUp);
					window.removeEventListener("pointercancel", onCancel);
					window.removeEventListener("blur", cancel);
					document.removeEventListener("keydown", onKey, true);
					element.removeEventListener("lostpointercapture", onCancel);
					cancelRef.current = null;
					setDrag(null);
					try {
						element.releasePointerCapture(pointerId);
					} catch {}
				};
				const cancel = () => {
					if (active) blockedClick.current = id;
					cleanup();
				};
				const onMove = (e) => {
					if (e.pointerId !== pointerId) return;
					x = e.clientX;
					y = e.clientY;
					if (!active) {
						if (Math.hypot(x - originX, y - originY) > 6) {
							blockedClick.current = id;
							cancel();
						}
						return;
					}
					e.preventDefault();
					update();
				};
				const onUp = (e) => {
					if (e.pointerId !== pointerId) return;
					if (active) {
						x = e.clientX;
						y = e.clientY;
						update();
						blockedClick.current = id;
						moveProviders(ids, groupOf(id), before);
					}
					cleanup();
				};
				const onCancel = (e) => {
					if (e.pointerId === pointerId) cancel();
				};
				const onKey = (e) => {
					if (e.key !== "Escape" || !active) return;
					e.preventDefault();
					e.stopPropagation();
					cancel();
					element.focus({ preventScroll: true });
				};
				const holdTimer = window.setTimeout(() => {
					if (done || !list.isConnected) {
						cancel();
						return;
					}
					active = true;
					blockedClick.current = id;
					try {
						element.setPointerCapture(pointerId);
					} catch {}
					update();
					scrollTimer = window.setInterval(() => {
						if (done || !list.isConnected) {
							cancel();
							return;
						}
						const bounds = list.getBoundingClientRect();
						const direction = x < bounds.left + 18 ? -1 : x > bounds.right - 18 ? 1 : 0;
						if (direction !== 0) {
							const previousScroll = list.scrollLeft;
							list.scrollLeft += direction * 10;
							if (list.scrollLeft !== previousScroll) update();
						}
					}, 50);
				}, 300);
				cancelRef.current = cancel;
				window.addEventListener("pointermove", onMove, { passive: false });
				window.addEventListener("pointerup", onUp);
				window.addEventListener("pointercancel", onCancel);
				window.addEventListener("blur", cancel);
				document.addEventListener("keydown", onKey, true);
				element.addEventListener("lostpointercapture", onCancel);
			};
			const suppressClick = (event) => {
				if (blockedClick.current === null) return;
				blockedClick.current = null;
				event.preventDefault();
				event.stopPropagation();
			};
			const keyboardMove = (event, id) => {
				blockedClick.current = null;
				if (!event.altKey || event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
				event.preventDefault();
				cancelRef.current?.();
				const ids = sorted.map((provider) => provider.id);
				const tabs = groups.map((group) => group[0]), index = tabs.indexOf(id);
				if (event.key === "ArrowLeft" && index > 0) moveProviders(ids, groupOf(id), tabs[index - 1]);
				if (event.key === "ArrowRight" && index >= 0 && index < tabs.length - 1) moveProviders(ids, groupOf(id), tabs[index + 2] ?? null);
			};
			const cancel = () => {
				cancelRef.current?.();
			};
			return {
				sorted,
				listRef,
				drag,
				begin,
				cancel,
				suppressClick,
				keyboardMove
			};
		}
		//#endregion
		//#region src/client/ModelPickerPanel.tsx
		/**
		* M2-005a 模型选择器面板（分栏收藏形态，用户参考图拍板 + 验收反馈三项修订）：
		* 顶栏（收藏入口 + 搜索）→ 主体（左提供方 logo 列 | 右模型列表带收藏星标）→ 底部运行框架占位。
		* M-051：左栏首字母色块升级为品牌 logo（provider-logos.tsx，未收录回退首字母）。
		* 数据来自 model-catalog.ts 真目录（providers = 会话可服务路由分组）；行单行模型名（验收反馈：不留 ID 副标题）。
		* 纯受控组件：目录快照/当前选择/收藏/回调全部由 ModelPickerButton 喂入。
		* 收藏视图：右栏跨提供方汇总收藏的模型，行两行制（模型名 + 供应商名副行，M-054，行高 36px 不变）。搜索：模型 id/名称（收藏视图含提供方名）子串过滤。
		* 顶栏按入口归并（provider-family.ts）：画出同一品牌图标的提供方并成一格，列表里按渠道分组、每组一行小标题。
		* 搜索跨供应商：先列当前视图里的匹配，再接一段其它供应商的匹配（副行写明入口与渠道）。
		*/
		/** 未注入语言服务时的兜底（测试或无 locale 的宿主）。 */
		const fallbackTranslate$1 = pickerFallback;
		/** 把 v 夹在 [lo, hi]。 */
		const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
		/** 提供方的入口键：按显示身份覆盖后的图标算，画出同一品牌图标的并成顶栏一格。 */
		function providerFamilyKey(provider) {
			const icon = displayProviderIcon(provider);
			return familyKeyOf(provider.id, providerIconKey(icon.providerId, icon.name));
		}
		/** 空 failures 常量：`props.failures ?? []` 每次 render 新建数组会让下游比对失真。 */
		const EMPTY_FAILURES = [];
		/** 构造一行显示数据。
		* Magpie 模型一律两行（模型 / 网关 · 路由来源），与所在视图无关；
		* 其余供应商只在收藏视图借副行标注来源（跨供应商汇总时需要），供应商视图保持单行紧凑。
		* @param favView - 当前是否收藏视图。
		*/
		function buildRow(provider, model, favView) {
			const providerName = displayProviderName(provider);
			const split = isMagpieRoute(provider.id) ? splitMagpieModelName(model.name) : null;
			const sub = split !== null ? `${magpieGatewayLabel(providerName)} \u00b7 ${split.route}` : favView ? providerName : null;
			return {
				providerId: provider.id,
				providerName,
				modelId: model.id,
				modelName: model.name,
				primary: split?.model ?? model.name,
				sub
			};
		}
		/** 模型名单元：被省略号截断时，悬停显示完整名。
		* 原生 title 在本应用不可靠——行悬停会展开右侧星标、挤窄文本，这次布局重排会不断重置
		* 原生提示的计时器，实测悬停不出来；宿主 Tooltip 由 JS 驱动，不受重排影响。
		* 是否截断在指针进入时按当时布局实测（此刻星标已展开，量到的正是悬停态可用宽度），
		* 未截断则抑制气泡；离开时复位，使下一次进入重新判定。 */
		function ModelName(props) {
			const ref = react.useRef(null);
			const [fits, setFits] = react.useState(false);
			const measure = () => {
				const el = ref.current;
				if (el === null) return;
				setFits(el.scrollWidth <= el.clientWidth);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Tooltip, {
				label: props.name,
				side: "top",
				align: "end",
				delayMs: 150,
				portal: true,
				disabled: fits,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					ref,
					className: "dsh003-picker-model-name",
					onMouseEnter: measure,
					onMouseLeave: () => setFits(false),
					children: props.name
				})
			});
		}
		let rememberedFavView = false;
		let rememberedProviderId = "";
		function ModelPickerPanel(props) {
			const { providers, current, catalogStatus } = props;
			const providerSort = useProviderSort(providers, providerFamilyKey);
			const families = react.useMemo(() => groupFamilies(providerSort.sorted, providerFamilyKey), [providerSort.sorted]);
			const favorites = react.useSyncExternalStore(subscribeFavorites, getFavoriteSet);
			const panelRef = react.useRef(null);
			const modelListRef = react.useRef(null);
			const searchRef = react.useRef(null);
			const searchToggleRef = react.useRef(null);
			const activeProvRef = react.useRef(null);
			const restoreFocusRef = react.useRef(null);
			const [searchExpanded, setSearchExpanded] = react.useState(false);
			react.useLayoutEffect(() => {
				if (window.matchMedia?.("(pointer: coarse)").matches === true) return;
				panelRef.current?.focus({ preventScroll: true });
			}, []);
			react.useLayoutEffect(() => {
				if (searchExpanded) {
					const input = searchRef.current;
					if (input !== null) {
						input.focus({ preventScroll: true });
						const len = input.value.length;
						try {
							input.setSelectionRange(len, len);
						} catch {}
					}
					return;
				}
				const target = restoreFocusRef.current;
				restoreFocusRef.current = null;
				if (target === "toggle") searchToggleRef.current?.focus({ preventScroll: true });
				else if (target === "panel") panelRef.current?.focus({ preventScroll: true });
			}, [searchExpanded]);
			const openSearch = (initialQuery) => {
				providerSort.cancel();
				deferredFollowRef.current = false;
				if (initialQuery !== void 0) setQuery(initialQuery);
				setSearchExpanded(true);
			};
			const closeSearch = (focusTarget = "toggle") => {
				restoreFocusRef.current = focusTarget;
				if (observedSelection.current.provider !== current?.provider || observedSelection.current.model !== current?.model || deferredFollowRef.current) {
					deferredFollowRef.current = false;
					observedSelection.current = {
						provider: current?.provider,
						model: current?.model
					};
					if (current?.provider && providers.some((p) => p.id === current.provider)) {
						rememberedProviderId = current.provider;
						setActiveProviderId(current.provider);
					}
				}
				setQuery("");
				setSearchExpanded(false);
			};
			const t = props.t ?? fallbackTranslate$1;
			const onPanelKeyDown = (event) => {
				if (isImeComposing(event)) return;
				if (event.key === "Escape") {
					event.preventDefault();
					event.stopPropagation();
					if (searchExpanded) {
						closeSearch("panel");
						return;
					}
					cancelDragRef.current?.();
					keyboardPreviewRef.current = false;
					snapIndexRef.current = null;
					props.onClose();
					return;
				}
				if (!searchExpanded) {
					if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "f") {
						event.preventDefault();
						openSearch();
						return;
					}
					if (!event.metaKey && !event.ctrlKey && !event.altKey) {
						const target = event.target;
						if (!(target !== null && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable))) {
							if (event.key === "/") {
								event.preventDefault();
								openSearch();
								return;
							}
							if (event.key.length === 1 && event.key !== " ") {
								event.preventDefault();
								openSearch(event.key);
								return;
							}
						}
					}
				}
				if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
				const rows = Array.from(panelRef.current?.querySelectorAll(".dsh003-picker-model-row") ?? []);
				const index = rows.indexOf(event.target);
				if (event.target !== panelRef.current && event.target !== searchRef.current && index < 0) return;
				if (rows.length === 0) return;
				event.preventDefault();
				const next = index < 0 ? event.key === "ArrowDown" ? 0 : rows.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + rows.length) % rows.length;
				rows[next]?.focus({ preventScroll: true });
				rows[next]?.scrollIntoView({ block: "nearest" });
			};
			const [favView, setFavView] = react.useState(rememberedFavView);
			const [query, setQuery] = react.useState("");
			const [activeProviderId, setActiveProviderId] = react.useState(() => {
				if (current?.provider && providers.some((p) => p.id === current.provider)) return current.provider;
				if (rememberedProviderId !== "" && providers.some((p) => p.id === rememberedProviderId)) return rememberedProviderId;
				return providerSort.sorted[0]?.id ?? "";
			});
			const observedSelection = react.useRef({
				provider: current?.provider,
				model: current?.model
			});
			const deferredFollowRef = react.useRef(false);
			react.useEffect(() => {
				const selectionChanged = observedSelection.current.provider !== current?.provider || observedSelection.current.model !== current?.model;
				observedSelection.current = {
					provider: current?.provider,
					model: current?.model
				};
				const currentId = providers.some((p) => p.id === current?.provider) ? current?.provider : void 0;
				if (searchExpanded) {
					if (selectionChanged) deferredFollowRef.current = true;
					setActiveProviderId((active) => {
						if (providers.some((p) => p.id === active)) return active;
						return currentId ?? providerSort.sorted[0]?.id ?? "";
					});
					return;
				}
				const shouldFollow = selectionChanged || deferredFollowRef.current;
				deferredFollowRef.current = false;
				setActiveProviderId((active) => {
					if (shouldFollow && currentId) return currentId;
					if (providers.some((p) => p.id === active)) return active;
					return currentId ?? providerSort.sorted[0]?.id ?? "";
				});
			}, [
				current?.provider,
				current?.model,
				providers,
				providerSort.sorted,
				searchExpanded
			]);
			const activeRowRef = react.useRef(null);
			react.useEffect(() => {
				if (activeRowRef.current) activeRowRef.current.scrollIntoView({ block: "nearest" });
				if (activeProvRef.current) activeProvRef.current.scrollIntoView({
					block: "nearest",
					inline: "nearest"
				});
			}, [
				activeProviderId,
				favView,
				searchExpanded
			]);
			const normalized = query.trim().toLocaleLowerCase();
			const reasoning = (providers.find((p) => p.id === current?.provider)?.models.find((m) => m.id === current?.model))?.reasoning;
			const efforts = reasoning?.efforts;
			const effectiveEffort = current?.reasoningEffort ?? reasoning?.defaultEffort;
			const hasEfforts = efforts !== void 0 && efforts.length > 1;
			const effortCount = efforts?.length ?? 1;
			const activeIndex = react.useMemo(() => {
				if (!efforts || !effectiveEffort) return 0;
				const idx = efforts.findIndex((e) => e.id === effectiveEffort);
				return idx >= 0 ? idx : 0;
			}, [efforts, effectiveEffort]);
			const [dragRatio, setDragRatio] = react.useState(null);
			const [snapIndex, setSnapIndex] = react.useState(null);
			const snapIndexRef = react.useRef(null);
			const dragRectRef = react.useRef(null);
			const downRef = react.useRef(false);
			const dragRatioRef = react.useRef(null);
			const startXRef = react.useRef(0);
			const startYRef = react.useRef(0);
			const cancelDragRef = react.useRef(null);
			const keyboardPreviewRef = react.useRef(false);
			const lockSnap = (idx) => {
				snapIndexRef.current = idx;
				setSnapIndex(idx);
			};
			react.useEffect(() => {
				if (snapIndex !== null && activeIndex === snapIndex) {
					snapIndexRef.current = null;
					setSnapIndex(null);
				}
			}, [activeIndex, snapIndex]);
			react.useEffect(() => {
				if (!props.pending) {
					snapIndexRef.current = null;
					setSnapIndex(null);
				}
			}, [
				props.pending,
				props.catalogError,
				props.selectionError
			]);
			react.useLayoutEffect(() => {
				cancelDragRef.current?.();
				keyboardPreviewRef.current = false;
				snapIndexRef.current = null;
				setSnapIndex(null);
				dragRatioRef.current = null;
				setDragRatio(null);
				return () => {
					cancelDragRef.current?.();
				};
			}, [current?.provider, current?.model]);
			const maxIndex = Math.max(effortCount - 1, 0);
			const liveIndex = dragRatio !== null ? clamp(Math.round(dragRatio * maxIndex), 0, maxIndex) : clamp(snapIndex ?? activeIndex, 0, maxIndex);
			const positionRatio = dragRatio !== null ? dragRatio : effortCount > 1 ? liveIndex / (effortCount - 1) : 0;
			const displayedEffortName = react.useMemo(() => {
				if (!efforts || efforts.length === 0) return "";
				const level = efforts[liveIndex];
				if (level === void 0) return "";
				const key = effortKeyOf(level.name);
				return key === void 0 ? level.name : t(key);
			}, [
				efforts,
				liveIndex,
				t
			]);
			const commitEffort = () => {
				if (!keyboardPreviewRef.current) return;
				keyboardPreviewRef.current = false;
				if (!efforts) return;
				const idx = clamp(snapIndexRef.current ?? activeIndex, 0, efforts.length - 1);
				const next = efforts[idx];
				if (next !== void 0 && next.id !== effectiveEffort) props.onSelectEffort?.(next.id);
			};
			const onSliderKeyDown = (e) => {
				if (!efforts || efforts.length < 2) return;
				const maxIdx = efforts.length - 1;
				const base = clamp(snapIndexRef.current ?? activeIndex, 0, maxIdx);
				let next = null;
				if (e.key === "ArrowRight" || e.key === "ArrowUp") next = Math.min(base + 1, maxIdx);
				else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = Math.max(base - 1, 0);
				else if (e.key === "Home") next = 0;
				else if (e.key === "End") next = maxIdx;
				if (next === null) return;
				e.preventDefault();
				keyboardPreviewRef.current = true;
				lockSnap(next);
			};
			const beginDrag = (e) => {
				if (e.button !== 0 || !e.isPrimary) return;
				cancelDragRef.current?.();
				keyboardPreviewRef.current = false;
				const hitEl = e.currentTarget;
				const pointerId = e.pointerId;
				downRef.current = true;
				startXRef.current = e.clientX;
				startYRef.current = e.clientY;
				dragRectRef.current = hitEl.getBoundingClientRect();
				dragRatioRef.current = null;
				if (efforts !== void 0 && efforts.length >= 2 && dragRectRef.current !== null) {
					const rect0 = dragRectRef.current;
					const raw0 = (e.clientX - rect0.left - 10) / Math.max(rect0.width - 20, 1);
					lockSnap(Math.round(clamp(raw0, 0, 1) * (efforts.length - 1)));
				}
				try {
					hitEl.setPointerCapture(e.pointerId);
				} catch {}
				const onMove = (ev) => {
					if (!downRef.current || ev.pointerId !== pointerId || dragRectRef.current === null) return;
					if (Math.hypot(ev.clientX - startXRef.current, ev.clientY - startYRef.current) < 5) return;
					const rect = dragRectRef.current;
					const raw = (ev.clientX - rect.left - 10) / Math.max(rect.width - 20, 1);
					const clamped = clamp(raw, 0, 1);
					dragRatioRef.current = clamped;
					setDragRatio(clamped);
				};
				const cleanup = () => {
					downRef.current = false;
					cancelDragRef.current = null;
					window.removeEventListener("pointermove", onMove);
					window.removeEventListener("pointerup", onEnd);
					window.removeEventListener("pointercancel", onCancel);
					window.removeEventListener("blur", cancel);
					hitEl.removeEventListener("lostpointercapture", onCancel);
					try {
						hitEl.releasePointerCapture(pointerId);
					} catch {}
					dragRectRef.current = null;
					dragRatioRef.current = null;
					setDragRatio(null);
				};
				const cancel = () => {
					cleanup();
					snapIndexRef.current = null;
					setSnapIndex(null);
				};
				const onCancel = (ev) => {
					if (ev.pointerId === pointerId && downRef.current) cancel();
				};
				const onEnd = (ev) => {
					if (ev.pointerId !== pointerId || !downRef.current) return;
					const started = dragRatioRef.current;
					cleanup();
					if (!efforts || efforts.length < 2) return;
					const idx = started !== null ? clamp(Math.round(started * (efforts.length - 1)), 0, efforts.length - 1) : clamp(snapIndexRef.current ?? activeIndex, 0, efforts.length - 1);
					lockSnap(idx);
					const next = efforts[idx];
					if (next !== void 0 && next.id !== effectiveEffort) props.onSelectEffort?.(next.id);
				};
				cancelDragRef.current = cancel;
				window.addEventListener("pointermove", onMove);
				window.addEventListener("pointerup", onEnd);
				window.addEventListener("pointercancel", onCancel);
				window.addEventListener("blur", cancel);
				hitEl.addEventListener("lostpointercapture", onCancel);
			};
			const favoriteRows = react.useMemo(() => {
				const rows = [];
				if (!favView) return rows;
				for (const provider of providers) for (const model of provider.models) if (favorites.has(favoriteKeyOf(provider.id, model.id))) rows.push(buildRow(provider, model, true));
				return rows;
			}, [
				favView,
				providers,
				favorites
			]);
			const activeProvider = providers.find((p) => p.id === activeProviderId) ?? providerSort.sorted[0];
			const activeFamily = families.find((family) => family.members.some((member) => member.id === activeProvider?.id)) ?? families[0];
			const grouped = !favView && activeFamily !== void 0 && activeFamily.members.length > 1;
			const activeTabKey = searchExpanded ? false : favView ? "__fav__" : activeFamily?.key ?? "";
			useSlidingIndicator(providerSort.listRef, activeTabKey, {
				itemSelector: ".dsh003-picker-prov",
				indicatorClass: "dsh003-picker-prov-ind"
			});
			const sourceRows = react.useMemo(() => {
				if (favView) return favoriteRows;
				if (!activeFamily) return [];
				return activeFamily.members.flatMap((member) => member.models.map((model) => buildRow(member, model, false)));
			}, [
				favView,
				favoriteRows,
				activeFamily
			]);
			const visibleRows = react.useMemo(() => {
				const matches = (text) => text.toLocaleLowerCase().includes(normalized);
				return normalized === "" ? sourceRows : sourceRows.filter((row) => matches(row.modelName) || matches(row.modelId) || matches(row.providerName));
			}, [sourceRows, normalized]);
			const emptyText = catalogStatus === "loading" ? t("loadingCatalog") : catalogStatus === "error" ? t("loadFailed") : normalized !== "" ? t("emptyNoMatch") : favView ? t("emptyFavorites") : activeFamily ? t("emptyProvider") : t("emptyCatalog");
			const placeholder = t("searchNeutral");
			const channelNames = react.useMemo(() => grouped && activeFamily !== void 0 ? channelLabels(activeFamily, t) : void 0, [
				grouped,
				activeFamily,
				t
			]);
			const otherRows = react.useMemo(() => {
				if (normalized === "") return [];
				const matches = (text) => text.toLocaleLowerCase().includes(normalized);
				const shown = new Set(sourceRows.map((row) => favoriteKeyOf(row.providerId, row.modelId)));
				const rows = [];
				for (const family of families) {
					const channels = family.members.length > 1 ? channelLabels(family, t) : void 0;
					for (const member of family.members) {
						const channel = channels?.get(member.id);
						const where = channel === void 0 ? family.label : `${family.label} \u00b7 ${channel}`;
						for (const model of member.models) {
							if (shown.has(favoriteKeyOf(member.id, model.id))) continue;
							const row = buildRow(member, model, true);
							if (!matches(row.modelName) && !matches(row.modelId) && !matches(row.providerName)) continue;
							const split = isMagpieRoute(member.id) ? splitMagpieModelName(model.name) : null;
							rows.push({
								...row,
								sub: split === null ? where : `${where} \u00b7 ${split.route}`
							});
						}
					}
				}
				return rows;
			}, [
				normalized,
				sourceRows,
				families,
				t
			]);
			const listed = react.useMemo(() => [...visibleRows.map((row, index) => ({
				row,
				heading: row.providerId !== visibleRows[index - 1]?.providerId ? channelNames?.get(row.providerId) : void 0,
				other: false
			})), ...otherRows.map((row, index) => ({
				row,
				heading: index === 0 ? t(favView ? "searchOtherModels" : "searchOtherProviders") : void 0,
				other: true
			}))], [
				visibleRows,
				otherRows,
				channelNames,
				favView,
				t
			]);
			const pick = (providerId, modelId) => {
				props.onPick(providerId, modelId);
			};
			const toggleStar = (e, providerId, modelId) => {
				e.stopPropagation();
				toggleFavorite(providerId, modelId);
			};
			react.useEffect(() => {
				if (searchExpanded) return;
				const el = providerSort.listRef.current;
				if (el === null) return;
				const onWheel = (event) => {
					if (el.scrollWidth <= el.clientWidth) return;
					if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
					event.preventDefault();
					el.scrollLeft += event.deltaY;
				};
				el.addEventListener("wheel", onWheel, { passive: false });
				return () => {
					el.removeEventListener("wheel", onWheel);
				};
			}, [searchExpanded, providerSort.listRef]);
			react.useEffect(() => {
				const list = modelListRef.current;
				if (!list) return void 0;
				let hovered = null;
				let lastX = null;
				let lastY = null;
				const setHovered = (next) => {
					if (hovered === next) return;
					hovered?.removeAttribute("data-hovered");
					hovered = next;
					hovered?.setAttribute("data-hovered", "true");
				};
				const onPointerMove = (e) => {
					if (e.pointerType === "touch") return;
					if (lastX === e.clientX && lastY === e.clientY) return;
					lastX = e.clientX;
					lastY = e.clientY;
					const item = e.target instanceof Element ? e.target.closest(".dsh003-picker-model-item") : null;
					setHovered(item && list.contains(item) ? item : null);
				};
				const onPointerLeave = () => {
					lastX = null;
					lastY = null;
					setHovered(null);
				};
				const onKeyDown = (e) => {
					if (e.key === "ArrowDown" || e.key === "ArrowUp") setHovered(null);
				};
				list.addEventListener("pointermove", onPointerMove, { passive: true });
				list.addEventListener("pointerleave", onPointerLeave);
				const doc = list.ownerDocument;
				doc?.addEventListener("keydown", onKeyDown, true);
				return () => {
					list.removeEventListener("pointermove", onPointerMove);
					list.removeEventListener("pointerleave", onPointerLeave);
					doc?.removeEventListener("keydown", onKeyDown, true);
					setHovered(null);
				};
			}, []);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MenuSurface, {
				ref: panelRef,
				panel: true,
				tabIndex: -1,
				className: "dsh003-picker-panel",
				role: "dialog",
				"aria-label": t("dialogLabel"),
				style: props.containerStyle,
				onKeyDown: onPanelKeyDown,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dsh003-picker-inner",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh003-picker-body",
							children: [searchExpanded ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dsh003-picker-topbar dsh003-picker-topbar-searching",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh003-picker-search-box",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "dsh003-picker-search-icon",
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SearchIcon, {
												size: 14,
												inline: false
											})
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
											ref: searchRef,
											type: "text",
											className: "dsh003-picker-search",
											placeholder,
											"aria-label": t("searchNeutral"),
											title: placeholder,
											value: query,
											onChange: (e) => setQuery(e.target.value),
											onKeyDown: (e) => {
												if (isImeComposing(e)) e.stopPropagation();
											}
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Tooltip, {
											label: t("searchCloseLabel"),
											side: "top",
											delayMs: 120,
											portal: true,
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: "dsh003-picker-top-btn dsh003-picker-search-close",
												"aria-label": t("searchCloseLabel"),
												onClick: () => closeSearch("toggle"),
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CloseIcon, {
													size: 14,
													inline: false
												})
											})
										})
									]
								})
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh003-picker-topbar",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "dsh003-picker-prov-rail-wrap",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										ref: providerSort.listRef,
										className: "dsh003-picker-prov-list",
										role: "tablist",
										"aria-label": t("providerRailLabel"),
										"data-sorting": providerSort.drag ? "true" : void 0,
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Tooltip, {
												label: t("favoritesLabel"),
												side: "top",
												delayMs: 120,
												portal: true,
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
													ref: favView ? activeProvRef : void 0,
													type: "button",
													role: "tab",
													"aria-selected": favView,
													className: "dsh003-picker-prov dsh003-picker-prov-fav",
													"data-active": favView ? "true" : "false",
													"aria-label": t("favoritesLabel"),
													onClick: () => {
														rememberedFavView = !favView;
														setFavView(!favView);
													},
													children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(StarIcon, {
														size: 19,
														inline: false,
														filled: favView
													})
												})
											}),
											families.map((family) => {
												const tabId = family.members[0].id;
												const isActive = !favView && family.key === activeFamily?.key;
												return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Tooltip, {
													label: family.label,
													side: "top",
													delayMs: 120,
													portal: true,
													disabled: providerSort.drag !== null,
													children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
														ref: isActive ? activeProvRef : void 0,
														type: "button",
														role: "tab",
														"aria-selected": isActive,
														className: "dsh003-picker-prov",
														"data-provider-id": tabId,
														"data-dragging": providerSort.drag?.id === tabId ? "true" : void 0,
														"data-insert": providerSort.drag?.before === tabId ? "before" : void 0,
														style: providerSort.drag?.id === tabId ? { transform: `translateX(${providerSort.drag.offset}px)` } : void 0,
														"data-active": isActive ? "true" : "false",
														"aria-label": family.label,
														onPointerDown: (event) => providerSort.begin(event, tabId),
														onClickCapture: providerSort.suppressClick,
														onKeyDown: (event) => providerSort.keyboardMove(event, tabId),
														onContextMenu: (event) => event.preventDefault(),
														onClick: () => {
															const target = family.members.find((member) => member.id === current?.provider) ?? family.members[0];
															rememberedFavView = false;
															rememberedProviderId = target.id;
															setFavView(false);
															setActiveProviderId(target.id);
														},
														children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ProviderLogo, { ...displayProviderIcon(family.members[0]) })
													})
												}, family.key);
											}),
											providerSort.drag?.before === null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "dsh003-picker-prov-insert-end",
												"aria-hidden": "true"
											}),
											props.onOpenSettings !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Tooltip, {
												label: t("manageProvidersLabel"),
												side: "top",
												delayMs: 120,
												portal: true,
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
													type: "button",
													className: "dsh003-picker-top-btn dsh003-picker-add-prov",
													"aria-label": t("manageProvidersLabel"),
													onClick: () => props.onOpenSettings?.(),
													children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PlusIcon, {
														size: 14,
														inline: false
													})
												})
											})
										]
									})
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "dsh003-picker-topbar-actions",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Tooltip, {
										label: t("searchToggleLabel"),
										side: "top",
										delayMs: 120,
										portal: true,
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											ref: searchToggleRef,
											type: "button",
											className: "dsh003-picker-top-btn dsh003-picker-search-toggle",
											"aria-label": t("searchToggleLabel"),
											onClick: () => openSearch(),
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SearchIcon, {
												size: 14,
												inline: false
											})
										})
									})
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(ScrollArea, {
								viewportRef: modelListRef,
								viewportProps: { "data-hover-managed": "" },
								className: "dsh003-picker-model-scroll",
								viewportClassName: "dsh003-picker-model-list",
								children: [listed.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: "dsh003-picker-empty",
									children: emptyText
								}), listed.map(({ row, heading, other }) => {
									const key = favoriteKeyOf(row.providerId, row.modelId);
									const active = row.providerId === current?.provider && row.modelId === current?.model;
									return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react.Fragment, { children: [heading !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: "dsh003-picker-group",
										"data-section": other ? "other" : void 0,
										role: "presentation",
										children: heading
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "dsh003-picker-model-item",
										"data-active": active ? "true" : "false",
										"data-sub": row.sub !== null ? "true" : "false",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											ref: active ? activeRowRef : void 0,
											type: "button",
											className: "dsh003-picker-model-row",
											"data-active": active ? "true" : "false",
											"data-sub": row.sub !== null ? "true" : "false",
											"aria-current": active ? "true" : void 0,
											onClick: () => pick(row.providerId, row.modelId),
											children: row.sub !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
												className: "dsh003-picker-model-text",
												children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
													className: "dsh003-picker-model-title",
													children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ModelName, { name: row.primary }), active && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
														className: "dsh003-picker-row-check",
														"aria-hidden": "true",
														children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CheckIcon, {
															size: 13,
															inline: false
														})
													})]
												}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: "dsh003-picker-model-sub",
													children: row.sub
												})]
											}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
												className: "dsh003-picker-model-title",
												children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ModelName, { name: row.primary }), active && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: "dsh003-picker-row-check",
													"aria-hidden": "true",
													children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CheckIcon, {
														size: 13,
														inline: false
													})
												})]
											})
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: "dsh003-picker-row-star",
											"data-fav": favorites.has(key) ? "true" : "false",
											"aria-label": favorites.has(key) ? t("favoriteRemove") : t("favoriteAdd"),
											onClick: (e) => toggleStar(e, row.providerId, row.modelId),
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(StarIcon, {
												size: 14,
												inline: false,
												filled: favorites.has(key)
											})
										})]
									})] }, key);
								})]
							})]
						}),
						(props.failures ?? EMPTY_FAILURES).map((failure) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
							className: "dsh003-picker-notice",
							role: "status",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: format(t("providerLoadFailed"), {
								name: failure.name ?? failure.id,
								message: failure.message
							}) }), props.onReload && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dsh003-picker-retry",
								onClick: props.onReload,
								children: t("retry")
							})]
						}, failure.id)),
						props.partial && (props.failures ?? EMPTY_FAILURES).length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "dsh003-picker-notice",
							role: "status",
							children: t("partialProviders")
						}),
						props.catalogError && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
							className: "dsh003-picker-empty",
							role: "alert",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: props.catalogError }), props.onReload && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dsh003-picker-retry",
								onClick: props.onReload,
								children: t("retry")
							})]
						}),
						props.selectionError && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "dsh003-picker-empty",
							role: "alert",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: props.selectionError })
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: `dsh003-picker-foot ${hasEfforts ? "" : "dsh003-picker-foot-disabled"}`,
							children: hasEfforts ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh003-picker-foot-inner",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh003-picker-foot-info",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "dsh003-picker-effort-sub",
										children: t("effortLabel")
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "dsh003-picker-effort-val",
										children: displayedEffortName
									})]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh003-picker-slider",
									"data-dragging": dragRatio !== null ? "true" : "false",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
											className: "dsh003-picker-range",
											role: "slider",
											tabIndex: 0,
											"aria-label": t("effortLabel"),
											"aria-orientation": "horizontal",
											"aria-valuemin": 0,
											"aria-valuemax": effortCount - 1,
											"aria-valuenow": liveIndex,
											"aria-valuetext": displayedEffortName,
											onPointerDown: beginDrag,
											onKeyDown: onSliderKeyDown,
											onKeyUp: (e) => {
												if ([
													"ArrowRight",
													"ArrowUp",
													"ArrowLeft",
													"ArrowDown",
													"Home",
													"End"
												].includes(e.key)) commitEffort();
											},
											onBlur: () => {
												if (downRef.current) cancelDragRef.current?.();
												else commitEffort();
											}
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "dsh003-picker-fill",
											style: { width: `calc(20px + (100% - 20px) * ${positionRatio})` }
										}),
										efforts.map((level, i) => {
											const tickRatio = effortCount > 1 ? i / (effortCount - 1) : 0;
											const isMax = i === effortCount - 1;
											const nameKey = effortKeyOf(level.name);
											const tickTitle = level.description ?? (nameKey === void 0 ? level.name : t(nameKey));
											return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "dsh003-picker-tick",
												"data-max": isMax ? "true" : "false",
												style: { left: `calc(10px + (100% - 20px) * ${tickRatio})` },
												title: tickTitle
											}, level.id);
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "dsh003-picker-knob",
											style: { left: `calc(10px + (100% - 20px) * ${positionRatio})` }
										})
									]
								})]
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh003-picker-slider-empty",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dsh003-picker-effort-sub",
									children: t("effortLabel")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dsh003-picker-effort-none",
									children: t("effortUnsupported")
								})]
							})
						}),
						props.optionsSlot != null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh003-picker-options",
							children: props.optionsSlot
						})
					]
				})
			});
		}
		//#endregion
		//#region src/client/picker-position.ts
		/**
		* 把面板放在触发按钮旁，并保证不超出视口、不改变正常尺寸。
		*
		* 水平方向两种策略：
		* - **面板窄于半个视口**（桌面、iPad）：右缘对齐按钮右缘，向左展开。官方入口在
		*   右侧，这样面板正好压住按钮上方，视线不用横跳。
		* - **面板宽于半个视口**（手机）：在视口内水平居中。
		*
		* 为什么手机要单独处理：393px 宽的手机上面板是 320px，右缘对齐按钮后左缘会算到
		* −38px，只能被推回 8px，结果左边空 8px、右边空 65px——肉眼就是「贴在左边」。
		* 面板已经占了八成宽度，「贴按钮」只剩几十像素的差别，却把整个浮层挤到一侧，
		* 不如居中。
		*/
		function pickerPosition(rect, width, height) {
			const inset = 8;
			const gap = 4;
			const panelWidth = Math.min(320, Math.max(0, width - inset * 2));
			const panelHeight = 392;
			const minRight = inset;
			const maxRight = width - panelWidth - inset;
			const clampX = (value) => Math.max(minRight, Math.min(value, Math.max(minRight, maxRight)));
			const alignedRight = width - rect.right;
			const centeredRight = (width - panelWidth) / 2;
			const right = panelWidth * 2 >= width ? clampX(centeredRight) : clampX(alignedRight);
			const clamp = (value) => Math.max(inset, Math.min(value, Math.max(inset, height - inset)));
			const bottom = clamp(height - rect.top + gap);
			const top = clamp(rect.bottom + gap);
			const above = Math.max(0, height - bottom - inset);
			const below = Math.max(0, height - top - inset);
			if (above >= panelHeight || above >= below) return {
				right,
				bottom,
				maxHeight: Math.min(panelHeight, above)
			};
			return {
				right,
				top,
				maxHeight: Math.min(panelHeight, below)
			};
		}
		//#endregion
		//#region src/client/model-catalog.ts
		/** Bridge the official per-session directory to the picker; the catalog default is not session state. */
		const queues = /* @__PURE__ */ new WeakMap();
		function resolveModelEffort(state, provider, model) {
			const reasoning = state.groups.find((g) => g.id === provider)?.models.find((m) => m.id === model)?.reasoning;
			const remembered = getModelEffort(provider, model);
			return reasoning?.efforts.some((e) => e.id === remembered) ? remembered : reasoning?.defaultEffort;
		}
		/** Serialize writes across picker instances sharing this session. Remember only accepted choices. */
		function selectCatalogModel(directory, provider, model, effort) {
			const operation = (queues.get(directory) ?? Promise.resolve()).then(async () => {
				try {
					const before = directory.store.getSnapshot();
					const previous = before.current;
					const reasoningEffort = effort ?? resolveModelEffort(before, provider, model);
					if (!(await directory.select({
						provider,
						model,
						...reasoningEffort === void 0 ? {} : { reasoningEffort }
					})).ok) return false;
					if (previous?.reasoningEffort !== void 0) setModelEffort(previous.provider, previous.model, previous.reasoningEffort);
					const confirmed = directory.store.getSnapshot().current;
					if (confirmed?.provider === provider && confirmed.model === model && confirmed.reasoningEffort !== void 0) setModelEffort(provider, model, confirmed.reasoningEffort);
					else if (reasoningEffort !== void 0) setModelEffort(provider, model, reasoningEffort);
					return true;
				} catch (error) {
					console.warn("[model-picker] model selection failed", error);
					return false;
				}
			});
			queues.set(directory, operation);
			operation.finally(() => {
				if (queues.get(directory) === operation) queues.delete(directory);
			});
			return operation;
		}
		function sameSelection(a, b) {
			if (a === null || b === null) return a === b;
			return a.provider === b.provider && a.model === b.model && a.reasoningEffort === b.reasoningEffort;
		}
		/**
		* 切换已被接受、但会话投影还没送来新 `current` 的最长等待。投影正常约 30ms 到；
		* 超时只是兜底（例如连接重置把 pending 清掉、投影不会再来），到点就回到宿主的 current。
		*/
		const HOLD_TIMEOUT_MS = 2e3;
		/** Stable snapshots for useSyncExternalStore, backed by the official session projection. */
		function createCatalogAdapter(directory) {
			let source;
			let snapshot;
			/**
			* 官方 `select()` 在 RPC 返回时就把 `pending` 清成 null，而新的 `current` 要等会话历史的
			* 投影帧才到。这中间约 30ms 里 `pending ?? current` 是**旧**模型：按钮先变成新模型、
			* 闪回旧模型、再变成新模型，名字宽度不同，按钮就跟着左右跳一下（手机上最明显）。
			*
			* 这里记住最近一次 pending 和它出现时的 current（base）。pending 正常清掉（无错误）
			* 而 current 还停在 base 时，继续显示 pending；current 一变（投影到达或别处改了选择）、
			* 出错或超时，就放手。
			*/
			let lastPending = null;
			let held = null;
			let holdTimer;
			let dirty = false;
			const listeners = /* @__PURE__ */ new Set();
			const release = () => {
				held = null;
				if (holdTimer !== void 0) clearTimeout(holdTimer);
				holdTimer = void 0;
			};
			const shown = (next) => {
				if (next.pending !== null) {
					release();
					if (lastPending === null || !sameSelection(lastPending.selection, next.pending)) lastPending = {
						selection: next.pending,
						base: next.current
					};
					return next.pending;
				}
				if (lastPending !== null) {
					if (next.error === null && sameSelection(next.current, lastPending.base)) {
						held = lastPending;
						if (holdTimer !== void 0) clearTimeout(holdTimer);
						holdTimer = setTimeout(() => {
							holdTimer = void 0;
							if (held === null) return;
							held = null;
							dirty = true;
							for (const fn of listeners) fn();
						}, HOLD_TIMEOUT_MS);
					}
					lastPending = null;
				}
				if (held !== null) {
					if (next.error === null && sameSelection(next.current, held.base)) return held.selection;
					release();
				}
				return next.current;
			};
			return {
				subscribe: (fn) => {
					listeners.add(fn);
					const off = directory.store.subscribe(fn);
					return () => {
						listeners.delete(fn);
						off();
					};
				},
				getSnapshot: () => {
					const next = directory.store.getSnapshot();
					if (source !== next || dirty) {
						dirty = false;
						source = next;
						const selection = shown(next);
						snapshot = {
							status: next.groups.length > 0 ? "ready" : next.status === "selecting" ? "ready" : next.status,
							failures: next.failures,
							partial: next.failures.length > 0,
							groups: next.groups,
							default: selection,
							pending: next.pending !== null,
							error: next.error
						};
					}
					return snapshot;
				},
				load: () => {
					directory.load().catch((error) => {
						console.warn("[model-picker] catalog load failed", error);
					});
				},
				select: (provider, model, effort) => selectCatalogModel(directory, provider, model, effort)
			};
		}
		//#endregion
		//#region src/client/compact-names.ts
		/**
		* 模型名精简开关的客户端读取。
		*
		* 官方设置表单只提供文本 / 数字 / 密钥三种控件，没有布尔开关，所以偏好存成
		* `on` / `off` 文本，由 Host 半边注入页面。这里只读，不写。
		*/
		/** Host 注入的全局变量名（与本插件 Host 半边 `src/index.js` 对应）。 */
		const GLOBAL_KEY = "__DSH_MODEL_CONTROLS_COMPACT_NAMES__";
		/**
		* 是否精简模型入口上显示的模型名。
		*
		* 未注入时默认 `true`：新装、无配置、或宿主尚未注入的情况下，按钮保持精简，
		* 与 0.2.11 起的默认行为一致。
		*
		* @returns `true` 时模型入口显示短名（`V4.1-Flash`），`false` 时显示完整上游名。
		*/
		function compactNamesEnabled() {
			return window[GLOBAL_KEY] !== false;
		}
		//#endregion
		//#region src/client/use-effort-truncation.ts
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
		const AVAILABLE_SHARE = .45;
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
		const MIN_CAP = 140;
		/**
		* 按钮宽度的绝对上限（官方触发器的同款值）。
		*
		* 桌面上行剩余 1200px 以上，45% 仍有 540px，这个上限负责把它停在 360px
		* ——再宽也没有信息增量，只会让输入框底部失衡。
		*/
		const ABSOLUTE_CAP = 360;
		/**
		* 模型名至少留出的宽度（约一个汉字）。
		*
		* 既用于「还能不能再加一项」的判断，也用于「少到一个字就整块收起」的门槛。
		*/
		const MIN_LABEL_ROOM = 12;
		const widthOf = (element) => element === null ? null : element.getBoundingClientRect().width;
		/**
		* 找到 composer 那一行：从按钮往上，第一个 `container-type: inline-size` 的祖先。
		* 这正是宿主用来判定换行、也是 `cqw` 所指向的元素。
		*/
		function findRow(button) {
			let node = button.parentElement;
			while (node !== null) {
				if (window.getComputedStyle(node).containerType === "inline-size") return node;
				node = node.parentElement;
			}
			return null;
		}
		/**
		* 这一行留给按钮的宽度：行可用宽度 − 除按钮以外的实际占位 − 间距。
		*
		* 把「包含按钮的那个子项」的宽度减去按钮自身宽度，因此结果与按钮此刻多宽无关
		* ——这是判定不抖动的前提。
		*
		* @returns 可用宽度（像素）；无法测量时返回 `null`。
		*/
		function measureAvailableWidth(row, button) {
			const style = window.getComputedStyle(row);
			const padding = (Number.parseFloat(style.paddingLeft) || 0) + (Number.parseFloat(style.paddingRight) || 0);
			const gap = Number.parseFloat(style.columnGap) || 0;
			const total = row.clientWidth - padding;
			if (total <= 0) return null;
			const buttonWidth = button.getBoundingClientRect().width;
			let used = 0;
			let count = 0;
			for (const child of Array.from(row.children)) {
				let width = child.getBoundingClientRect().width;
				if (child.contains(button)) width = Math.max(0, width - buttonWidth);
				if (width > 0) {
					used += width;
					count += 1;
				}
			}
			used += Math.max(0, count - 1) * gap;
			return Math.max(0, Math.min(total - used - 1, total));
		}
		/**
		* 实测按钮内部是否放得下，并按顺序折叠。
		*
		* @param buttonRef - 按钮本身，用于找所属行、读内边距与列间距。
		* @param probes - 量宽探针。
		* @param hasEffort - 有档位文字时才走折叠；没有时只判断箭头。
		* @param deps - 触发重新测量的值：档位名 / 模型名 / 档位比例变化时重算。
		* @returns 当前折叠状态；同时把可用宽度写进按钮的 `--dsh003-max`。
		*/
		function useButtonCollapse(buttonRef, probes, hasEffort, deps) {
			const [collapse, setCollapse] = react.useState({
				compactChevron: false,
				showMeter: false,
				compactLabel: false
			});
			react.useLayoutEffect(() => {
				let row = null;
				let lastMax = "";
				const measure = () => {
					const button = buttonRef.current;
					if (button === null) return;
					if (row === null || !row.isConnected) row = findRow(button);
					if (row === null) return;
					const available = measureAvailableWidth(row, button);
					if (available === null) return;
					const cap = Math.min(ABSOLUTE_CAP, available, Math.max(MIN_CAP, available * AVAILABLE_SHARE));
					const nextMax = `${cap}px`;
					if (lastMax !== nextMax) {
						lastMax = nextMax;
						button.style.setProperty("--dsh003-max", nextMax);
					}
					const style = window.getComputedStyle(button);
					const padding = (Number.parseFloat(style.paddingLeft) || 0) + (Number.parseFloat(style.paddingRight) || 0);
					const gap = Number.parseFloat(style.columnGap) || 0;
					const logo = widthOf(probes.logo.current);
					const chevron = widthOf(probes.chevron.current);
					const effort = widthOf(probes.effort.current);
					const meterWidth = widthOf(probes.meter.current);
					if (logo === null || chevron === null) return;
					const base = padding + logo;
					const effortWidth = hasEffort ? effort ?? 0 : 0;
					const fullNameWidth = widthOf(probes.label.current);
					const nameWidth = fullNameWidth === null ? null : Math.min(fullNameWidth, 150);
					const NEEDED_WITH_TEXT = base + gap * 3 + effortWidth + chevron;
					const showMeter = hasEffort && nameWidth !== null && nameWidth + NEEDED_WITH_TEXT > cap + 1;
					const tail = showMeter ? meterWidth ?? 0 : effortWidth;
					const compactChevron = base + gap * 3 + tail + chevron + MIN_LABEL_ROOM > cap;
					const compactLabel = cap - base - gap * 2 - tail < MIN_LABEL_ROOM;
					setCollapse((previous) => previous.compactChevron === compactChevron && previous.showMeter === showMeter && previous.compactLabel === compactLabel ? previous : {
						compactChevron,
						showMeter,
						compactLabel
					});
				};
				measure();
				const observer = new ResizeObserver(measure);
				const button = buttonRef.current;
				if (button !== null) {
					observer.observe(button);
					const owner = row ?? findRow(button);
					if (owner !== null) observer.observe(owner);
				}
				const fonts = document.fonts;
				if (fonts !== void 0) fonts.ready.then(measure).catch(() => {});
				return () => {
					observer.disconnect();
				};
			}, deps);
			return collapse;
		}
		//#endregion
		//#region src/client/ModelPickerButton.tsx
		/** Session picker backed by the official shared directory; remembers accepted per-model efforts. */
		/** 未注入语言服务时的兜底（测试或无 locale 的宿主）。 */
		const fallbackTranslate = pickerFallback;
		function ModelPickerButton({ locked = false, directory, t = fallbackTranslate, renderSlot, onOpenSettings }) {
			const adapter = react.useMemo(() => createCatalogAdapter(directory), [directory]);
			const catalog = react.useSyncExternalStore(adapter.subscribe, adapter.getSnapshot);
			const [selectionError, setSelectionError] = react.useState(null);
			const selectionRequest = react.useRef(0);
			react.useLayoutEffect(() => {
				selectionRequest.current += 1;
				setSelectionError(null);
				return () => {
					selectionRequest.current += 1;
				};
			}, [adapter]);
			const submit = (provider, model, effort) => {
				if (locked) return;
				const request = ++selectionRequest.current;
				setSelectionError(null);
				adapter.select(provider, model, effort).then((ok) => {
					if (request !== selectionRequest.current) return;
					setSelectionError(ok ? null : t("switchFailed"));
				});
			};
			const [open, setOpen] = react.useState(false);
			react.useLayoutEffect(() => {
				if (locked) setOpen(false);
			}, [locked]);
			const [pos, setPos] = react.useState(null);
			const buttonRef = react.useRef(null);
			/** 打开瞬间按钮的视口矩形：滚动时用它判断按钮到底有没有真的挪位。 */
			const anchorRef = react.useRef(null);
			const closeMenu = react.useCallback((restoreFocus = false) => {
				setOpen(false);
				setSelectionError(null);
				if (restoreFocus) buttonRef.current?.focus({ preventScroll: true });
			}, []);
			react.useEffect(() => {
				adapter.load();
			}, [adapter]);
			const toggle = () => {
				if (locked) return;
				if (open) {
					closeMenu();
					return;
				}
				const el = buttonRef.current;
				if (el === null) return;
				const rect = el.getBoundingClientRect();
				anchorRef.current = rect;
				setPos(pickerPosition(rect, window.innerWidth, window.innerHeight));
				setSelectionError(null);
				adapter.load();
				setOpen(true);
			};
			react.useEffect(() => {
				if (!open) return;
				const onPointerDown = (e) => {
					const target = e.target;
					if (target instanceof Element && target.closest(".dsh003-picker-panel") !== null) return;
					if (buttonRef.current?.contains(target) === true) return;
					closeMenu();
				};
				const onKeyDown = (e) => {
					if (isImeComposing(e) || e.defaultPrevented) return;
					if (e.key === "Escape") {
						e.preventDefault();
						closeMenu(true);
					}
				};
				const onScroll = (e) => {
					const target = e.target;
					if (target instanceof Element && target.closest(".dsh003-picker-panel") !== null) return;
					const anchor = anchorRef.current;
					const el = buttonRef.current;
					if (anchor === null || el === null) return;
					const now = el.getBoundingClientRect();
					if (Math.abs(now.top - anchor.top) > 1 || Math.abs(now.left - anchor.left) > 1) closeMenu();
				};
				const onReflow = () => {
					const el = buttonRef.current;
					if (el === null) return;
					const rect = el.getBoundingClientRect();
					anchorRef.current = rect;
					setPos(pickerPosition(rect, window.innerWidth, window.innerHeight));
				};
				document.addEventListener("pointerdown", onPointerDown, true);
				document.addEventListener("keydown", onKeyDown);
				window.addEventListener("scroll", onScroll, true);
				window.addEventListener("resize", onReflow);
				return () => {
					document.removeEventListener("pointerdown", onPointerDown, true);
					document.removeEventListener("keydown", onKeyDown);
					window.removeEventListener("scroll", onScroll, true);
					window.removeEventListener("resize", onReflow);
				};
			}, [open, closeMenu]);
			const selection = catalog.default;
			const currentGroup = react.useMemo(() => {
				if (selection === null) return void 0;
				return catalog.groups.find((g) => g.id === selection.provider);
			}, [catalog.groups, selection]);
			const currentModel = react.useMemo(() => {
				if (selection === null) return void 0;
				return currentGroup?.models.find((m) => m.id === selection.model);
			}, [selection, currentGroup]);
			const currentModelName = react.useMemo(() => {
				if (selection === null) return null;
				if (currentModel !== void 0) return currentModel.name;
				return selection.model;
			}, [selection, currentModel]);
			const currentEffortName = react.useMemo(() => {
				if (selection === null) return null;
				const reasoning = currentModel?.reasoning;
				if (reasoning === void 0 || reasoning.efforts.length <= 1) return null;
				const effectiveEffort = selection.reasoningEffort ?? reasoning.defaultEffort;
				if (effectiveEffort === void 0) return null;
				return reasoning.efforts.find((e) => e.id === effectiveEffort)?.name ?? effectiveEffort;
			}, [selection, currentModel]);
			/** 按钮显示的模型名：开关关闭时用完整上游名；开启时只压缩模型那一段，
			* `· 路由来源` 原样保留（供应商不改）。Magpie 的显示名是「模型 · 路由来源」，
			* 先拆开再压模型名，否则品牌词不在串首、压不到。 */
			const buttonModelName = react.useMemo(() => {
				if (currentModelName === null) return null;
				if (!compactNamesEnabled()) return currentModelName;
				const split = isMagpieRoute(selection?.provider ?? "") ? splitMagpieModelName(currentModelName) : null;
				if (split === null) return compactModelName(currentModelName);
				return `${compactModelName(split.model)} \u00b7 ${split.route}`;
			}, [selection?.provider, currentModelName]);
			/**
			* 这个模型**没有任何**思考档位（不是「关闭」，而是根本没有这个概念）。
			*
			* 必须和「还在加载」区分开：`currentModel` 为 undefined 表示目录里还没找到
			* 这个模型，那时什么都不该画；而这里是有明确答案——它没有档位。
			*/
			const hasNoEfforts = currentModel !== void 0 && (currentModel.reasoning === void 0 || currentModel.reasoning.efforts.length <= 1);
			/**
			* 按钮上档位位置的文字。
			*
			* 「没有档位」也走这一条管线，当作一个名叫「无」的档位——它不是特例，
			* 只是在竖条形态下画成一根短轨道（见 `data-none`）。这样折叠判定、
			* 宽度计算、探针测量全都只有一套逻辑，不需要为它开分支。
			*
			* 跟随界面语言：中文「无」/ 英文 `N/A`。
			*/
			const buttonEffortName = react.useMemo(() => {
				if (hasNoEfforts) return t("effortNoneShort");
				if (currentEffortName === null) return null;
				const key = effortKeyOf(currentEffortName);
				return key === void 0 ? currentEffortName : t(key);
			}, [
				hasNoEfforts,
				currentEffortName,
				t
			]);
			/**
			* 竖条的填充比例与实际高度：档位文字被截断时替代它显示。
			*
			* 「没有档位」返回 0——它在竖条形态下画成短轨道、不填充（`data-none`）。
			* progress 用 effortProgress，与面板滑杆严格同刻度（最低档为 0），写进 data-progress；
			* 绘制高度用 effortMeterHeight：12px 高的竖条分不出「0」与「关闭」，所以抬到最小可见高度。
			* 两者原先是两个逐行重复的 memo，合并成一处推导，免得以后只改一边导致刻度与高度对不上。
			*/
			const effortMeter = react.useMemo(() => {
				if (hasNoEfforts) return {
					progress: 0,
					height: 0
				};
				const reasoning = currentModel?.reasoning;
				if (reasoning === void 0 || reasoning.efforts.length <= 1) return null;
				const ids = reasoning.efforts.map((e) => e.id);
				const effort = selection?.reasoningEffort ?? reasoning.defaultEffort;
				return {
					progress: effortProgress(ids, effort),
					height: effortMeterHeight(ids, effort)
				};
			}, [
				selection?.reasoningEffort,
				currentModel,
				hasNoEfforts
			]);
			const buttonEffortProgress = effortMeter?.progress ?? null;
			const buttonMeterHeight = effortMeter?.height ?? null;
			/** 折叠判定：按实测溢出量决定收箭头 / 换竖条，详见 use-effort-truncation.ts。 */
			const logoProbeRef = react.useRef(null);
			const effortProbeRef = react.useRef(null);
			const chevronProbeRef = react.useRef(null);
			const meterProbeRef = react.useRef(null);
			const labelProbeRef = react.useRef(null);
			const collapse = useButtonCollapse(buttonRef, {
				logo: logoProbeRef,
				effort: effortProbeRef,
				chevron: chevronProbeRef,
				meter: meterProbeRef,
				label: labelProbeRef
			}, buttonEffortName !== null, [
				buttonEffortName,
				buttonModelName,
				buttonEffortProgress
			]);
			const showEffortMeter = buttonEffortProgress !== null && collapse.showMeter;
			/** 悬停提示保留完整信息：上游全名 + 档位，不跟按钮一起压缩。 */
			const buttonTitle = react.useMemo(() => {
				const model = currentModelName ?? t("modelFallback");
				if (hasNoEfforts) return `${model} · ${t("effortNoneTitle")}`;
				return currentEffortName === null ? model : `${model} · ${currentEffortName}`;
			}, [
				currentModelName,
				currentEffortName,
				hasNoEfforts,
				t
			]);
			const pick = (providerId, modelId) => {
				if (selection !== null && selection.provider === providerId && selection.model === modelId) return;
				submit(providerId, modelId);
			};
			const handleSelectEffort = (effortId) => {
				if (selection === null || effortId === selection.reasoningEffort) return;
				submit(selection.provider, selection.model, effortId);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				ref: buttonRef,
				type: "button",
				className: "dsh003-picker-btn",
				"data-open": open ? "true" : "false",
				"data-meter": showEffortMeter ? "true" : "false",
				"data-compact-chev": collapse.compactChevron ? "true" : "false",
				"data-compact-label": collapse.compactLabel ? "true" : "false",
				"aria-haspopup": "dialog",
				"aria-expanded": open,
				"aria-label": buttonEffortName === null ? format(t("triggerAria"), { model: buttonModelName ?? t("modelFallback") }) : format(t("triggerAriaEffort"), {
					model: buttonModelName ?? t("modelFallback"),
					effort: buttonEffortName
				}),
				title: buttonTitle,
				disabled: locked,
				onClick: toggle,
				children: [
					currentGroup !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ProviderLogo, {
						...displayProviderIcon(currentGroup),
						small: true
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dsh003-picker-btn-label",
						children: buttonModelName ?? t("modelFallback")
					}),
					buttonEffortName !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dsh003-picker-btn-effort",
						children: buttonEffortName
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: "dsh003-picker-probes",
						"aria-hidden": "true",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								ref: logoProbeRef,
								className: "dsh003-picker-probe dsh003-picker-logo-probe"
							}),
							buttonEffortName !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								ref: effortProbeRef,
								className: "dsh003-picker-probe",
								children: buttonEffortName
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								ref: chevronProbeRef,
								className: "dsh003-picker-probe dsh003-picker-chev-probe",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconChevronDownOutlineRegular, {})
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								ref: meterProbeRef,
								className: "dsh003-picker-probe dsh003-picker-meter-probe"
							}),
							buttonModelName !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								ref: labelProbeRef,
								className: "dsh003-picker-probe dsh003-picker-label-probe",
								children: buttonModelName
							})
						]
					}),
					showEffortMeter && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dsh003-picker-effort-meter",
						role: "img",
						"aria-label": buttonEffortName ?? "",
						"data-empty": buttonMeterHeight === 0 ? "true" : void 0,
						"data-none": hasNoEfforts ? "true" : void 0,
						"data-progress": buttonEffortProgress,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dsh003-picker-effort-meter-fill",
							style: { height: `${(buttonMeterHeight ?? 0) * 100}%` }
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconChevronDownOutlineRegular, { className: "dsh003-picker-chev" })
				]
			}), open && !locked && pos !== null && (0, react_dom.createPortal)(/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ModelPickerPanel, {
				t,
				pending: catalog.pending,
				catalogError: catalog.error,
				selectionError,
				catalogStatus: catalog.status,
				partial: catalog.partial,
				failures: catalog.failures,
				onReload: adapter.load,
				providers: catalog.groups,
				current: selection,
				containerStyle: pos,
				onPick: pick,
				onSelectEffort: handleSelectEffort,
				onOpenSettings: onOpenSettings === void 0 ? void 0 : () => {
					closeMenu(false);
					onOpenSettings();
				},
				onClose: () => closeMenu(true),
				optionsSlot: renderSlot?.("conversation.input.model.options", {
					locked,
					dismiss: () => closeMenu(true),
					reportFailure: (message) => setSelectionError(message)
				})
			}), document.body)] });
		}
		//#endregion
		//#region src/client/ModelControlsEntry.tsx
		/** Replace the model seat while retaining the official per-session directory and lock semantics. */
		/**
		* 渲染单入口组合容器（官方同款单按钮接管模型位，样式见 picker.css ① 区 .dsh003-model-controls）。
		* @param props - locked/available，见 ModelControlsEntryProps。
		* @returns 容器（含统一模型+思考强度触发按钮）；available=false 时不渲染。
		*/
		function ModelControlsEntry({ locked, available, directory, t, renderSlot, onOpenSettings }) {
			if (!available) return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "dsh003-model-controls",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ModelPickerButton, {
					locked,
					directory,
					t,
					renderSlot,
					onOpenSettings
				})
			});
		}
		//#endregion
		//#region src/client/picker.css.ts
		/**
		* 模型选择器样式（--dsw-alias-* 语义色 + @kewen/dsh-ui 共享毛玻璃与 --dsh-corner-shape 双轨曲率）。
		* 结构：① 触发按钮 ② 面板浮层 ③ 两栏主体 ④ 模型行 ⑤ 底部思考强度条 ⑥ 设置页卡片。
		*/
		const pickerCss = `

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
  border-radius: 999px !important;
  corner-shape: round !important;
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
/* 触屏点按高亮：安卓 Chrome 默认给可点元素盖一层半透明蓝（rgba(51,181,229,.4)），
   点模型行时先闪蓝再变成选中灰，看起来就是「闪一下」。按钮和面板自带按下/选中态，关掉系统那层。 */
.dsh003-picker-btn,
.dsh003-picker-panel,
.dsh003-picker-panel * {
  -webkit-tap-highlight-color: transparent !important;
}
@media (hover: hover) {
  .dsh003-picker-btn:hover:not(:disabled) {
    background: var(--dsw-alias-interactive-bg-hover) !important;
  }
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
  corner-shape: round !important;
  background: color-mix(in srgb, var(--dsw-alias-label-primary) 10%, transparent) !important;
}
.dsh003-picker-effort-meter-fill {
  position: absolute !important;
  bottom: 0 !important;
  left: 0 !important;
  width: 100% !important;
  border-radius: 999px !important;
  corner-shape: round !important;
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
  /* 可以一路缩到 0：这是「慢慢缩进」的主体，由省略号连续表达。
     max-width 是名字自身的固定上限（LABEL_MAX，见 use-effort-truncation.ts）：
     宽屏下按钮不随模型名长短忽宽忽窄；档位文字不受此约束。 */
  flex: 1 1 auto !important;
  min-width: 0 !important;
  max-width: 150px !important;
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

/* ② 面板浮层：位置与布局由插件管理；原版待办栏共享毛玻璃（--dsh-menu-surface-fill + blur(8px) saturate(1.3) + --dsh-glass-shadow）、
   16px 双轨曲率（--dsh-corner-shape）及 macOS CSS anchor backing 由 @kewen/dsh-ui 的 MenuSurface 管理。 */
.dsh003-picker-panel {
  position: fixed !important;
  z-index: 60 !important;
  display: flex !important;
  flex-direction: column !important;
  width: min(320px, calc(100vw - 16px)) !important;
  height: 392px !important;
  padding: 0 !important;
  gap: 0 !important;
  border: 0 !important;
  outline: none !important;
  color: var(--dsw-alias-label-primary) !important;
  box-sizing: border-box !important;
  overflow: visible !important;
  animation: none !important;
}
.dsh003-picker-inner {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  border-radius: inherit !important;
  corner-shape: round !important;
  overflow: clip !important;
}

/* ③ 纵向主体（方案 3 顶栏收纳搜索）：顶栏（横滚供应商 Tab 末尾随滚 +，右侧固定 🔍；点 🔍 或直接打字原地变形为搜索条）→ 全宽模型列表 */
.dsh003-picker-body {
  flex: 1 !important;
  min-height: 0 !important;
  display: flex !important;
  flex-direction: column !important;
}
.dsh003-picker-topbar {
  position: relative !important;
  flex: none !important;
  height: 42px !important;
  display: flex !important;
  align-items: stretch !important;
  /* 左侧 6px 使首项 ☆ 墨迹落在 16px 统一基线；右侧 8px 使 🔍 墨迹落在 17px，与模型行 ★ 严格同轴 */
  padding: 0 8px 0 6px !important;
  border-bottom: 1px solid var(--dsw-alias-border-l1) !important;
  box-sizing: border-box !important;
}
.dsh003-picker-prov-rail-wrap {
  position: relative !important;
  flex: 1 !important;
  min-width: 0 !important;
  display: flex !important;
  align-items: stretch !important;
  overflow: hidden !important;
}
.dsh003-picker-prov-list {
  position: relative !important;
  flex: 1 !important;
  min-width: 0 !important;
  display: flex !important;
  flex-direction: row !important;
  align-items: stretch !important;
  gap: 2px !important;
  padding: 0 14px 0 0 !important;
  overflow-x: auto !important;
  overflow-y: hidden !important;
  scrollbar-width: none !important;
  box-sizing: border-box !important;
  -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 16px), transparent 100%) !important;
  mask-image: linear-gradient(to right, #000 calc(100% - 16px), transparent 100%) !important;
}
.dsh003-picker-prov-list::-webkit-scrollbar {
  display: none !important;
}
.dsh003-picker-prov {
  position: relative !important;
  appearance: none !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 34px !important;
  height: 100% !important;
  flex: none !important;
  padding: 0 !important;
  border: none !important;
  border-radius: 0 !important;
  background: transparent !important;
  color: var(--dsw-alias-label-tertiary) !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  box-sizing: border-box !important;
  transition: color 120ms ease !important;
}
.dsh003-picker-prov-list > [data-provider-id] {
  touch-action: pan-x !important;
  user-select: none !important;
  -webkit-user-select: none !important;
}
.dsh003-picker-prov-list[data-sorting="true"] > [data-provider-id] {
  cursor: grabbing !important;
  touch-action: none !important;
}
.dsh003-picker-prov[data-dragging="true"] {
  z-index: 1 !important;
  color: var(--dsw-alias-label-primary) !important;
  transition: none !important;
}
.dsh003-picker-prov[data-insert="before"]::before,
.dsh003-picker-prov-insert-end {
  content: '' !important;
  width: 2px !important;
  height: 20px !important;
  border-radius: 999px !important;
  corner-shape: round !important;
  background: var(--dsw-alias-label-secondary) !important;
  pointer-events: none !important;
}
.dsh003-picker-prov[data-insert="before"]::before {
  position: absolute !important;
  left: -2px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}
.dsh003-picker-prov-insert-end {
  flex: none !important;
  align-self: center !important;
  margin: 0 -2px !important;
}
@media (hover: hover) {
  .dsh003-picker-prov:hover {
    color: var(--dsw-alias-label-primary) !important;
  }
}
.dsh003-picker-prov:focus-visible {
  outline: none !important;
  color: var(--dsw-alias-label-primary) !important;
}
.dsh003-picker-prov:not([data-insert="before"]):focus-visible::before {
  content: '' !important;
  position: absolute !important;
  inset: 6px 2px !important;
  border-radius: var(--dsw-radius-sm, 8px) !important;
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round)) !important;
  box-shadow: 0 0 0 2px var(--dsh-focus-ring-color, var(--dsw-alias-border-l3)) !important;
  pointer-events: none !important;
}
.dsh003-picker-prov[data-active="true"] {
  color: var(--dsw-alias-label-primary) !important;
}
/* 激活指示底线：沿用 @kewen/dsh-ui UnderlineTabs 中性主色（浅色石墨灰 / 深色亮白），2px 圆头滑块；
   未挂载滑动指示器前由 ::after 静态兜底，挂载 data-ind 后交由 .dsh003-picker-prov-ind 220ms 平滑滑动 */
.dsh003-picker-prov[data-active="true"]::after {
  content: '' !important;
  position: absolute !important;
  left: 7px !important;
  right: 7px !important;
  bottom: 4px !important;
  height: 2px !important;
  border-radius: 999px !important;
  corner-shape: round !important;
  background: var(--dsh-brand-fill, var(--dsw-alias-brand-primary)) !important;
  pointer-events: none !important;
}
.dsh003-picker-prov-list[data-ind] .dsh003-picker-prov[data-active="true"]::after {
  display: none !important;
}
.dsh003-picker-prov-ind {
  position: absolute !important;
  left: 0 !important;
  bottom: 4px !important;
  height: 2px !important;
  background: transparent !important;
  pointer-events: none !important;
  width: var(--ind-w, 0);
  transform: translateX(var(--ind-x, 0));
  transition: transform var(--dsh-dur-expand, 220ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1)), width var(--dsh-dur-expand, 220ms) var(--dsh-ease-out, cubic-bezier(.22, 1, .36, 1));
}
.dsh003-picker-prov-ind::after {
  content: '' !important;
  position: absolute !important;
  left: 7px !important;
  right: 7px !important;
  top: 0 !important;
  bottom: 0 !important;
  border-radius: 999px !important;
  corner-shape: round !important;
  background: var(--dsh-brand-fill, var(--dsw-alias-brand-primary)) !important;
  pointer-events: none !important;
}
.dsh003-picker-prov-ind[data-instant] {
  transition: none !important;
}
/* 拖拽排序期间隐藏滑动指示条，避免拖走激活 Tab 时底线残留在原槽位 */
.dsh003-picker-prov-list[data-sorting="true"] .dsh003-picker-prov-ind {
  opacity: 0 !important;
}
/* 收藏项（顶栏首项）：激活时宿主语义暖黄实心星（M-053：星色语义统一黄系）；
   .dsh-icon 默认按 1em 跟随父级 font-size，而 .dsh003-picker-prov 为 13px 会把星星压成 13px（可见约 10.6px），
   明显小于旁边 18px 满幅供应商 Logo 并制造视觉大空隙；显式定为 19px 盒 + 1.4 线宽（可见约 15.4×14.8px），与 18px 图标光学齐平。 */
.dsh003-picker-prov-fav .dsh-icon {
  width: 19px !important;
  height: 19px !important;
  stroke-width: 1.4 !important;
}
.dsh003-picker-prov-fav[data-active="true"] {
  color: var(--dsw-alias-state-warn-primary) !important;
}
.dsh003-picker-topbar-actions {
  flex: none !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 2px !important;
  padding-left: 2px !important;
}
.dsh003-picker-top-btn {
  appearance: none !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 28px !important;
  height: 28px !important;
  padding: 0 !important;
  border: none !important;
  border-radius: var(--dsw-radius-sm, 8px) !important;
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round)) !important;
  background: transparent !important;
  color: var(--dsw-alias-label-secondary) !important;
  cursor: pointer !important;
  box-sizing: border-box !important;
  transition: background 120ms ease, color 120ms ease !important;
}
/* 顶栏末尾「+」：随供应商栏一同横滚与渐隐，静止态颜色对齐未选中供应商，悬停态复用动作按钮浅底以区分 Tab */
.dsh003-picker-add-prov {
  flex: none !important;
  align-self: center !important;
  margin-left: 2px !important;
  color: var(--dsw-alias-label-tertiary) !important;
}
@media (hover: hover) {
  .dsh003-picker-top-btn:hover {
    background: var(--dsw-alias-interactive-bg-hover) !important;
    color: var(--dsw-alias-label-primary) !important;
  }
}
.dsh003-picker-top-btn:focus-visible {
  outline: none !important;
  box-shadow: 0 0 0 2px var(--dsh-focus-ring-color, var(--dsw-alias-border-l3)) !important;
  color: var(--dsw-alias-label-primary) !important;
}
/* 提供方 logo（M-051）：内联 SVG fill=currentColor，色彩继承按钮文本色
   （tertiary → hover/active primary），明暗主题零特判；18px 见方居中于 34px 顶栏 Tab */
.dsh003-provider-logo {
  display: block !important;
  width: 18px !important;
  height: 18px !important;
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
  font-size: 15px !important;
  font-weight: 700 !important;
  line-height: 1 !important;
}
/* CLI 角标：T3 桥接器的各个 CLI 共用 T3 字标，右下角叠一枚 11px 的 CLI 图标区分。
   字标在角标处挖圆缺口：圆心对准角标中心（15.5, 15.5），四周留白一致（约 1.3px），
   「3」左下的尾巴整段落在缺口内，不留碎片。三格缺口相同，只有角标不同。
   全部继承文本色（tertiary → hover/active primary），明暗主题与选中态零特判。 */
.dsh003-provider-mark {
  position: relative !important;
  display: block !important;
  width: 18px !important;
  height: 18px !important;
  flex: none !important;
  pointer-events: none !important;
}
/* 角标伸出图标框 3px，「图标 + 角标」的可见外形右偏 1.5px；整体左移抵掉，与选中滑块居中对齐 */
.dsh003-picker-prov .dsh003-provider-mark {
  transform: translateX(-1.5px) !important;
}
.dsh003-provider-mark > .dsh003-provider-logo {
  width: 100% !important;
  height: 100% !important;
  -webkit-mask: radial-gradient(circle at 15.5px 15.5px, transparent 6.6px, #000 7px) !important;
  mask: radial-gradient(circle at 15.5px 15.5px, transparent 6.6px, #000 7px) !important;
}
.dsh003-provider-badge {
  position: absolute !important;
  right: -3px !important;
  bottom: -3px !important;
  width: 11px !important;
  height: 11px !important;
  display: block !important;
}
.dsh003-provider-badge svg {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
}
/* 触发按钮首字兜底微型徽标：16px 微圆角卡片，中英文字号 11px 清晰不缩水 */
.dsh003-provider-initial--sm {
  width: 16px !important;
  height: 16px !important;
  flex: none !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: var(--dsw-radius-xs, 4px) !important;
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round)) !important;
  background: var(--dsw-alias-interactive-bg-hover) !important;
  border: 1px solid var(--dsw-alias-border-l1) !important;
  color: var(--dsw-alias-label-primary) !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  line-height: 1 !important;
  box-sizing: border-box !important;
}
.dsh003-picker-model-scroll {
  flex: 1 !important;
  min-height: 0 !important;
}
/* 顶栏原位展开搜索条：占据 42px 顶栏，最右端 × 与原搜索图标严格同位，零位移收起 */
.dsh003-picker-search-box {
  position: relative !important;
  flex: 1 !important;
  display: flex !important;
  align-items: center !important;
  min-width: 0 !important;
}
.dsh003-picker-search-icon {
  position: absolute !important;
  /* left 9.75：@kewen/dsh-ui SearchIcon（16 视框 1.5px 线宽缩至 14px 盒）墨迹自 1.75px 起、至 12.5px 止，
     落在内容列上与模型名左缘对齐（9.75 + 1.75 = 11.5）。与 padding-left 32.25 配对使左右可视留白相等：
     左侧 = 9.75 + 1.75 = 11.5；右侧 = 32.25 + 文字自留白 1.5 − (9.75 + 12.5) = 11.5。
     不变量见 tests/search-icon-spacing.test.mjs。 */
  left: 9.75px !important;
  display: inline-flex !important;
  color: var(--dsw-alias-label-primary) !important;
  pointer-events: none !important;
}
.dsh003-picker-search-icon .dsh-icon {
  width: 14px !important;
  height: 14px !important;
}
.dsh003-picker-search {
  display: block !important;
  width: 100% !important;
  min-width: 0 !important;
  height: 100% !important;
  /* 左内边距 32.25：为 @kewen/dsh-ui SearchIcon 留位并让两侧可视间距严格相等（11.5px）。 */
  padding: 0 34px 0 32.25px !important;
  border: none !important;
  border-radius: 0 !important;
  background: transparent !important;
  color: var(--dsw-alias-label-primary) !important;
  font-size: 12.5px !important;
  box-sizing: border-box !important;
  outline: none !important;
}
.dsh003-picker-search::placeholder {
  color: var(--dsw-alias-label-tertiary) !important;
}
.dsh003-picker-search-close {
  position: absolute !important;
  right: 0 !important;
}
.dsh003-picker-search-close .dsh-icon {
  width: 14px !important;
  height: 14px !important;
}
.dsh003-picker-model-list {
  flex: 1 !important;
  min-height: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 2px !important;
  overflow-y: auto !important;
  padding: 6px 8px 8px !important;
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
  padding: 6px 16px !important;
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
  border-radius: var(--dsw-radius-sm, 8px) !important;
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round)) !important;
  background: transparent !important;
  color: var(--dsw-alias-label-primary) !important;
  font-size: 11px !important;
  line-height: 20px !important;
  cursor: pointer !important;
  text-decoration: underline !important;
  text-underline-offset: 2px !important;
}
@media (hover: hover) {
  .dsh003-picker-retry:hover {
    background: var(--dsw-alias-interactive-bg-hover) !important;
  }
}
.dsh003-picker-retry:focus-visible {
  outline: none !important;
  box-shadow: 0 0 0 2px var(--dsw-alias-border-l3) !important;
}

/* 渠道小标题：并格入口（如 Magpie 的三个协议）在列表里按渠道分组，每组前一行。
   字号 / 字重 / 颜色 / 26px 高 / 8px 左右内边距同 @kewen/dsh-ui 的分组标题 .dsh-pop-ghead；
   左 8px 叠列表 8px 落在 16px 基线，与模型名左缘对齐。 */
.dsh003-picker-group {
  flex: none !important;
  display: flex !important;
  align-items: center !important;
  height: 26px !important;
  padding: 0 8px !important;
  font-size: var(--dsh-text-sm, 12px) !important;
  font-weight: 500 !important;
  color: var(--dsw-alias-label-secondary) !important;
  box-sizing: border-box !important;
}
.dsh003-picker-group:not(:first-child) {
  margin-top: 6px !important;
}
/* 搜索结果里「其它供应商」这一段：上方一条分隔线，免得被当成当前入口的又一条渠道。
   线下 8px 留白并进标题盒（26 + 8 + 1 = 35px）；排在最前（当前入口没有匹配）时不画线。 */
.dsh003-picker-group[data-section="other"]:not(:first-child) {
  height: 35px !important;
  margin-top: 8px !important;
  padding-top: 8px !important;
  border-top: 1px solid var(--dsw-alias-border-l1) !important;
}

/* ⑤ 模型行（item 外壳只留圆角与底色：外层 16px - 8px padding = 8px 同心圆角；
   内边距全数交给行按钮，整行除星标与右缘 2px 外都可点击；
   右侧 2px 抵消 24px 星标盒内留白，使星标中心 22px 与顶栏 🔍 严格同轴。
   行按钮与星标按钮平级并列——星标不再是按钮内的嵌套可交互元素，hover/active 底色由外壳整行铺满） */
.dsh003-picker-model-item {
  display: flex !important;
  align-items: center !important;
  width: 100% !important;
  padding: 0 2px 0 0 !important;
  /* 星标已迁为兄弟按钮，不再替行撑高：36 = 星标 24 + 原行内边距 12，节距与旧结构一致 */
  min-height: 36px !important;
  border: none !important;
  border-radius: var(--dsw-radius-sm, 8px) !important;
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round)) !important;
  background: transparent !important;
  box-sizing: border-box !important;
  transition: background 120ms ease !important;
}
.dsh003-picker-model-item[data-hovered="true"] {
  background: var(--dsw-alias-interactive-bg-hover) !important;
}
@media (hover: hover) {
  .dsh003-picker-model-list:not([data-hover-managed]) .dsh003-picker-model-item:hover {
    background: var(--dsw-alias-interactive-bg-hover) !important;
  }
}
/* 行按钮获焦：环描在外壳上（2px 内阴影随外壳圆角），底色与悬停一致 */
.dsh003-picker-model-item:has(> .dsh003-picker-model-row:focus-visible) {
  background: var(--dsw-alias-interactive-bg-hover) !important;
  box-shadow: inset 0 0 0 2px var(--dsh-focus-ring-color, var(--dsw-alias-border-l3)) !important;
}
.dsh003-picker-model-item[data-active="true"] {
  background: var(--dsw-alias-interactive-bg-hover) !important;
}
/* 收藏视图两行制（M-054）：名 13px/1.3 + gap 1px + 副行 10px/1.2 收进 36px——行高不变，行按钮内边距 6→3 让位 */
.dsh003-picker-model-item[data-sub="true"] {
  /* 内容 35.9px 补齐整 36——收藏视图节距 40 与普通视图/供应商列严格一致（M-054 R1） */
  min-height: 36px !important;
}
.dsh003-picker-model-item[data-sub="true"] .dsh003-picker-model-name {
  line-height: 1.3 !important;
}
/* 行按钮本体：透明裸按钮，stretch 补满外壳整高，内边距承接原行盒——
   左 8px 叠列表 8px 落在 16px 基线；右 6px 把原星标 margin 缺口并进按钮，化为可点击区 */
.dsh003-picker-model-row {
  appearance: none !important;
  display: flex !important;
  align-items: center !important;
  flex: 1 !important;
  align-self: stretch !important;
  min-width: 0 !important;
  padding: 6px 6px 6px 8px !important;
  border: none !important;
  background: transparent !important;
  color: inherit !important;
  font: inherit !important;
  cursor: pointer !important;
  text-align: left !important;
}
.dsh003-picker-model-row[data-sub="true"] {
  padding: 3px 6px 3px 8px !important;
}
.dsh003-picker-model-row:focus-visible {
  outline: none !important;
}
.dsh003-picker-model-text {
  flex: 1 !important;
  min-width: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 1px !important;
}
.dsh003-picker-model-title {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  min-width: 0 !important;
}
.dsh003-picker-model-row > .dsh003-picker-model-title {
  flex: 1 !important;
}
.dsh003-picker-model-name {
  flex: 0 1 auto !important;
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
/* 常驻右侧空心星标（☆）：未收藏轻淡常驻不引起行尾重排，悬停或收藏后变暖黄实心（★） */
.dsh003-picker-row-star {
  appearance: none !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 24px !important;
  height: 24px !important;
  /* 与行按钮的 6px 右内边距配对，星标中心仍落在原 22px 轴线上 */
  margin-left: 0 !important;
  flex: none !important;
  padding: 0 !important;
  border: none !important;
  border-radius: var(--dsw-radius-sm, 8px) !important;
  corner-shape: var(--dsh-corner-shape, var(--dsw-corner-shape, round)) !important;
  background: transparent !important;
  color: var(--dsw-alias-label-caption) !important;
  cursor: pointer !important;
  box-sizing: border-box !important;
  opacity: 0.68 !important;
  transition: color 120ms ease, opacity 120ms ease !important;
}
/* 收藏与否均有焦点环；内阴影随星标自身 8px 圆角 */
.dsh003-picker-row-star:focus-visible {
  outline: none !important;
  box-shadow: inset 0 0 0 2px var(--dsh-focus-ring-color, var(--dsw-alias-border-l3)) !important;
}
.dsh003-picker-row-star:not([data-fav="true"]):focus-visible {
  opacity: 1 !important;
  color: var(--dsw-alias-label-secondary) !important;
}
.dsh003-picker-model-item[data-hovered="true"] .dsh003-picker-row-star:not([data-fav="true"]):not(:hover) {
  opacity: 1 !important;
  color: var(--dsw-alias-label-secondary) !important;
}
@media (hover: hover) {
  .dsh003-picker-model-list:not([data-hover-managed]) .dsh003-picker-model-item:hover .dsh003-picker-row-star:not([data-fav="true"]):not(:hover) {
    opacity: 1 !important;
    color: var(--dsw-alias-label-secondary) !important;
  }
  /* hover 预览色=点击结果色（M-053：星色语义统一宿主暖黄，收藏后同色） */
  .dsh003-picker-row-star:hover {
    opacity: 1 !important;
    color: var(--dsw-alias-state-warn-primary) !important;
  }
}
.dsh003-picker-row-star .dsh-icon {
  width: 14px !important;
  height: 14px !important;
}
.dsh003-picker-row-star[data-fav="true"] {
  opacity: 1 !important;
  color: var(--dsw-alias-state-warn-primary) !important;
}

/* 选中态小勾：紧随模型名末尾（不挤占右侧星标纵列），14px 紧凑盒不撑高两行视图 */
.dsh003-picker-row-check {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 14px !important;
  height: 14px !important;
  flex: none !important;
  color: var(--dsw-alias-label-secondary) !important;
}
.dsh003-picker-row-check .dsh-icon {
  width: 13px !important;
  height: 13px !important;
}

/* ⑥ 底部：思考强度单行集成条（左右 16px 与顶栏/模型名/官方选项区四层严格齐平） */
.dsh003-picker-foot {
  flex: none !important;
  padding: 6px 16px !important;
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

/* 右侧横向滑轨容器（槽：20px 高胶囊圆角，两端半圆圆心在 10px 处，与首尾刻度及圆珠同心） */
.dsh003-picker-slider {
  position: relative !important;
  flex: 1 1 auto !important;
  height: 20px !important;
  border-radius: 999px !important;
  corner-shape: round !important;
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
   用半透主文字色保证在底轨与填充段上均有清晰对比；蓝点=最强端=右端刻度 */
.dsh003-picker-tick {
  position: absolute !important;
  top: 50% !important;
  width: 4px !important;
  height: 4px !important;
  border-radius: 999px !important;
  corner-shape: round !important;
  background: color-mix(in srgb, var(--dsw-alias-label-primary) 34%, transparent) !important;
  transform: translate(-50%, -50%) !important;
  pointer-events: none !important;
  transition: background 120ms ease !important;
}
/* 最高档主题色刻度点 */
.dsh003-picker-tick[data-max="true"] {
  background: color-mix(in oklch, var(--dsw-alias-state-business-primary) 65%, var(--dsw-alias-bg-layer-1)) !important;
}

/* 滑过填充段：自槽左端延伸包住圆珠右缘（calc(20px + (100% - 20px) * r)），胶囊整包零接缝凹口 */
.dsh003-picker-fill {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  height: 100% !important;
  border-radius: 999px !important;
  corner-shape: round !important;
  background: var(--dsw-alias-interactive-bg-active) !important;
  pointer-events: none !important;
  transition: width 120ms ease !important;
}

/* 正圆滑珠：18px × 18px 居中于 20px 胶囊槽（上下各留 1px 呼吸边）；hover/active
   触感 + focus ring 由命中层兄弟选择器驱动（命中层在 DOM 最前，~ 反选后面的视觉层） */
.dsh003-picker-knob {
  position: absolute !important;
  top: 50% !important;
  width: 18px !important;
  height: 18px !important;
  border: 1px solid var(--dsw-alias-border-l1) !important;
  border-radius: 999px !important;
  corner-shape: round !important;
  background: var(--dsw-alias-bg-layer-1) !important;
  box-shadow: var(--dsw-shadow-lv1) !important;
  box-sizing: border-box !important;
  transform: translate(-50%, -50%) !important;
  pointer-events: none !important;
  transition: left 120ms ease, transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease !important;
}
@media (hover: hover) {
  .dsh003-picker-range:hover ~ .dsh003-picker-knob {
    transform: translate(-50%, -50%) scale(1.08) !important;
    box-shadow: var(--dsw-shadow-lv2) !important;
  }
}
.dsh003-picker-range:active ~ .dsh003-picker-knob {
  transform: translate(-50%, -50%) scale(1.15) !important;
}
.dsh003-picker-range:focus-visible ~ .dsh003-picker-knob {
  border-color: var(--dsh-focus-ring-color, var(--dsw-alias-border-l3)) !important;
}

/* 拖动中：位移过渡旁路——关掉后 1:1 直跟零迟滞；触感过渡保留。松手 data-dragging 归 false → 平滑吸附 */
.dsh003-picker-slider[data-dragging='true'] .dsh003-picker-fill {
  transition: none !important;
}
.dsh003-picker-slider[data-dragging='true'] .dsh003-picker-knob {
  transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease !important;
}

/* 深色模式同源色阶覆盖（基于 --dsw-alias-* 派生，零硬编码 #hex）：
   保留 M-069 轨道与已填充段明度对比，圆珠提亮至与顶栏激活线同源亮灰白 */
body[data-ds-dark-theme] {
  --dsh003-effort-track: color-mix(in oklab, var(--dsw-alias-bg-layer-3) 72%, var(--dsw-alias-label-caption));
  --dsh003-effort-fill: color-mix(in oklab, var(--dsw-alias-label-secondary) 58%, var(--dsw-alias-bg-layer-3));
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
  background: var(--dsh-brand-fill, var(--dsw-alias-label-primary)) !important;
}

/* ⑦ 官方扩展选项区（RC2 conversation.input.model.options，如 Agent 团队模式开关）：
   置于思考强度条下方；左右 8px 叠加宿主行自带 8px 落到全局 16px 基线，且悬停高亮条外距与模型列表一致。 */
.dsh003-picker-options {
  flex: none !important;
  padding: 4px 8px !important;
  border-top: 1px solid var(--dsw-alias-border-l1) !important;
  box-sizing: border-box !important;
}
.dsh003-picker-options:empty,
.dsh003-picker-options:has(> [data-slot]:empty) {
  display: none !important;
}

/* ⑧ 设置页卡片：@kewen/dsh-ui Card + CardRow 承接宿主 SettingsValueField 与快捷开关 */
.dsh003-settings-row {
  align-items: flex-start !important;
}
.dsh003-settings-row .dsh-card-title:empty {
  display: none !important;
}
.dsh003-settings-row > .dsh-card-action {
  padding-top: 2px !important;
}

/* 减弱动效：宿主全局 * 降级拼不过本插件的类级 !important 过渡；
   :is() 里永不命中的 #dsh003-reduce-motion 专用于把特异性抬到 ID 级，
   使 transition:none 能盖过 .dsh003-picker-slider[data-dragging] .dsh003-picker-knob 之类的复合规则。 */
@media (prefers-reduced-motion: reduce) {
  :is(#dsh003-reduce-motion, [class*="dsh003-picker"]),
  :is(#dsh003-reduce-motion, [class*="dsh003-picker"])::before,
  :is(#dsh003-reduce-motion, [class*="dsh003-picker"])::after {
    transition: none !important;
    animation: none !important;
  }
}
html[data-dsh-reduce-motion] :is(#dsh003-reduce-motion, [class*="dsh003-picker"]),
html[data-dsh-reduce-motion] :is(#dsh003-reduce-motion, [class*="dsh003-picker"])::before,
html[data-dsh-reduce-motion] :is(#dsh003-reduce-motion, [class*="dsh003-picker"])::after {
  transition: none !important;
  animation: none !important;
}
`;
		//#endregion
		//#region src/client/ModelControlsSettings.tsx
		/**
		* 与 Host schema（src/index.js 的 magpieBaseURL.pattern）同一条正则，改动须两边同步。
		* 不能共享常量：src/index.js 原样拷进 lib/index.js，无法 import 客户端模块。
		* 只靠 new URL 判定会放过 `…/v1?`、`…/v1#`、`Http://…`、路径带空格这类 Host 会拒的写法，
		* 页面不提示、保存时才笼统失败。
		*/
		const HOST_ADDRESS_PATTERN = /^(?:|https?:\/\/[^/\s@?#]+(?:\/[^?\s#]*)?)$/;
		/** Whether draft text is an endpoint this plugin can compare against the running route. */
		function acceptAddress(text) {
			const value = text.trim();
			if (value === "") return {
				kind: "set",
				value: ""
			};
			if (!HOST_ADDRESS_PATTERN.test(value)) return void 0;
			try {
				const url = new URL(value);
				if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash) return void 0;
				return {
					kind: "set",
					value
				};
			} catch {
				return;
			}
		}
		/** Whether draft text is a model-name preference this plugin accepts; empty clears it. */
		function acceptCompactNames(text) {
			const value = text.trim().toLowerCase();
			if (value === "") return { kind: "clear" };
			return value === "on" || value === "off" ? {
				kind: "set",
				value
			} : void 0;
		}
		/**
		* The plugin's settings page: one optional override for a Magpie endpoint the
		* automatic check cannot recognize. An empty value keeps automatic detection.
		* @param props - the requested view, the entry's form, and this page's locale reader.
		* @returns the localized settings form.
		*/
		function ModelControlsSettings(props) {
			if (settingsKit === void 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FormUnavailable, { t: props.t });
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SettingsCard, {
				...props,
				kit: settingsKit
			});
		}
		/** 官方表单不可用时的占位：用 @kewen/dsh-ui 卡片承接一句宿主同源说明。 */
		function FormUnavailable({ t }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Card, {
				className: "dsh003-settings-card",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CardRow, { title: t("formUnavailable") })
			});
		}
		/** SettingsFormModel 实例要用到的方法；构造出的对象缺任何一个都按不可用处理。 */
		const MODEL_METHODS = [
			"bind",
			"shell",
			"field",
			"actions",
			"dispose"
		];
		/**
		* 构造官方表单模型；构造抛错或实例形状不符（宿主改了 API）时返回 undefined，并提示一次。
		* 不在这里兜住，错误会冒到官方 SlotErrorBoundary，整页变空白且没有说明。
		*/
		function createModel(kit, form) {
			try {
				const model = new kit.SettingsFormModel(form, [{
					field: "magpieBaseURL",
					format: (value) => typeof value === "string" ? value : "",
					parse: acceptAddress
				}, {
					field: "compactModelNames",
					format: (value) => typeof value === "string" ? value : "",
					parse: acceptCompactNames
				}]);
				const record = model;
				if (MODEL_METHODS.every((name) => typeof record[name] === "function")) return model;
				warnPrimitivesOnce("SettingsFormModel no longer has the expected methods; the settings page is unavailable.");
			} catch (error) {
				warnPrimitivesOnce("SettingsFormModel could not be created; the settings page is unavailable.", error);
			}
		}
		function SettingsCard({ form, t, kit }) {
			const model = react.useMemo(() => createModel(kit, form), [kit, form]);
			if (model === void 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FormUnavailable, { t });
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SettingsFields, {
				model,
				t,
				kit
			});
		}
		function SettingsFields({ model, t, kit }) {
			const { SettingsForm, SettingsValueField } = kit;
			const store = react.useMemo(() => model.bind(() => ({
				...model.shell(),
				address: model.field("magpieBaseURL"),
				compact: model.field("compactModelNames")
			})), [model]);
			const state = react.useSyncExternalStore((listener) => store.subscribe(listener), () => store.getSnapshot());
			react.useEffect(() => () => model.dispose(), [model]);
			const actions = model.actions();
			const disabled = !state.writable || state.saving;
			const compactChecked = state.compact.text.trim().toLowerCase() !== "off";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SettingsForm, {
				state,
				onSave: actions.save,
				onDiscard: actions.discard,
				labels: settingsFormLabels(t),
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, {
					className: "dsh003-settings-card",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(CardRow, {
						className: "dsh003-settings-row",
						title: null,
						action: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(StandaloneSwitch, {
							checked: compactChecked,
							disabled,
							label: t("compactNamesLabel"),
							onChange: (next) => actions.edit("compactModelNames", next ? "on" : "off")
						}),
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SettingsValueField, {
							id: "dsh-model-controls-compact",
							label: t("compactNamesLabel"),
							hint: t("compactNamesHint"),
							placeholder: t("compactNamesPlaceholder"),
							help: {
								label: t("compactNamesHelpLabel"),
								content: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("compactNamesHelpOn") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("compactNamesHelpOff") })] })
							},
							overriddenLabel: t("overridden"),
							resetLabel: t("reset"),
							invalidLabel: t("compactNamesInvalid"),
							disabled,
							...state.compact,
							onEdit: (text) => actions.edit("compactModelNames", text),
							onReset: () => actions.resetField("compactModelNames")
						})
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CardRow, {
						className: "dsh003-settings-row",
						title: null,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SettingsValueField, {
							id: "dsh-model-controls-magpie",
							label: t("addressLabel"),
							hint: t("addressHint"),
							placeholder: t("addressPlaceholder"),
							help: {
								label: t("addressHelpLabel"),
								content: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("addressHelpAutomatic") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("addressHelpWhenToFill") })] })
							},
							overriddenLabel: t("overridden"),
							resetLabel: t("reset"),
							invalidLabel: t("invalid"),
							disabled,
							...state.address,
							onEdit: (text) => actions.edit("magpieBaseURL", text),
							onReset: () => actions.resetField("magpieBaseURL")
						})
					})]
				})
			});
		}
		//#endregion
		//#region src/client/index.ts
		/** 打开官方设置弹窗并直达「模型 / 供应商」（models）分区；宿主缺口时安全静默返回 false。 */
		function openModelSettings(slots) {
			if (typeof slots.entries !== "function") return false;
			for (const entry of slots.entries("sidebar.settings")) {
				const create = entry.store?.create;
				if (typeof create !== "function") continue;
				try {
					const actions = create()?.actions;
					if (typeof actions?.openSection === "function") {
						actions.openSection("models");
						return true;
					}
					if (typeof actions?.open === "function") {
						actions.open();
						return true;
					}
				} catch {}
			}
			return false;
		}
		/** Dictionary namespaces owned by this plugin. */
		const LOCALE_NS = SETTINGS_NS;
		const PICKER_LOCALE_NS = PICKER_NS;
		/**
		* 挂载 @kewen/dsh-ui 共享样式块（引用计数版本仲裁）与本插件私有样式表，返回幂等组合清理函数。
		*/
		function mountStyles() {
			if (typeof document !== "undefined") document.querySelectorAll("style[data-plugin=\"dsh-std-model-picker\"]").forEach((el) => el.remove());
			const disposeUi = mountDshUiStyles();
			const disposePlugin = injectPluginStyles("@kewen/dsh-model-controls", pickerCss);
			let disposed = false;
			return () => {
				if (disposed) return;
				disposed = true;
				disposePlugin();
				disposeUi();
			};
		}
		const inject = [
			"slots",
			"sessions",
			"remote",
			"remote.session",
			"modelDirectories",
			"configForms",
			"locale"
		];
		function apply(ctx) {
			if (typeof window !== "undefined" && window !== null) {
				const w = window;
				w.__DSH_MODEL_PICKER_SHARED__ = { ModelPickerPanel };
				if (typeof ctx.effect === "function") ctx.effect(() => () => {
					if (w.__DSH_MODEL_PICKER_SHARED__ !== void 0) delete w.__DSH_MODEL_PICKER_SHARED__;
				}, "model-controls: shared panel");
			}
			const disposeStyles = mountStyles();
			if (typeof ctx.effect === "function") ctx.effect(() => disposeStyles, "model-controls: styles");
			if (typeof ctx.effect === "function") ctx.effect(() => startPrefsSync({
				local: () => ({
					favorites: [...getFavoriteSet()],
					efforts: getModelEfforts(),
					providerOrder: getProviderOrder()
				}),
				replace: (prefs) => {
					replaceFavorites(prefs.favorites);
					replaceModelEfforts(prefs.efforts);
					replaceProviderOrder(prefs.providerOrder);
				}
			}), "model-controls: prefs sync");
			try {
				const slots = ctx.get("slots");
				const forms = ctx.get("configForms");
				const locale = ctx.get("locale");
				if (locale) {
					ctx.effect(() => locale.register(SETTINGS_NS, {
						zh: settingsZh,
						en: settingsEn
					}), "model-controls: settings dictionaries");
					ctx.effect(() => locale.register(PICKER_NS, {
						zh: pickerZh,
						en: pickerEn
					}), "model-controls: picker dictionaries");
				}
				const translate = (ns, fallback) => {
					const bound = locale === void 0 ? void 0 : locale.bind(ns);
					return (key, params) => format(bound === void 0 ? fallback[key] : bound(key), params);
				};
				if (slots && forms) {
					const namespace = typeof window === "undefined" ? "dsh-std-model-picker" : window.__DSH_MODEL_CONTROLS_NAMESPACE__;
					const form = forms.get(typeof namespace === "string" ? namespace : "dsh-std-model-picker");
					const entry = () => ({
						name: "plugins.bundle.config",
						key: "@kewen/dsh-model-controls",
						locale: SETTINGS_NS,
						inject: () => ({
							form,
							t: translate(SETTINGS_NS, settingsZh)
						})
					});
					slots.inject("plugins.bundle.config", () => {
						let dispose = slots.register(entry(), ModelControlsSettings);
						if (locale === void 0) return () => {
							dispose();
						};
						const off = locale.subscribe(() => {
							dispose();
							dispose = slots.register(entry(), ModelControlsSettings);
						});
						return () => {
							off();
							dispose();
						};
					});
				}
				const sessions = ctx.get("sessions");
				const directories = ctx.get("modelDirectories");
				if (slots && directories !== void 0 && typeof directories.directoryFor === "function") slots.inject("conversation.input.model", () => {
					const dispose = slots.register({
						name: "conversation.input.model",
						priority: -1,
						locale: PICKER_NS,
						inject: (sessionId) => ({
							directory: directories.directoryFor(sessionId),
							available: sessions !== void 0 && sessions.subagentAddress(sessionId) === void 0,
							t: translate(PICKER_NS, pickerZh),
							...typeof slots.entries === "function" ? { onOpenSettings: () => {
								openModelSettings(slots);
							} } : {}
						})
					}, ModelControlsEntry);
					if (typeof slots.entries !== "function" || typeof slots.subscribe !== "function") return dispose;
					const entriesOf = slots.entries.bind(slots);
					const own = () => entriesOf("conversation.input.model").find((e) => e.component === ModelControlsEntry);
					let borrowed;
					const borrow = () => {
						const mine = own();
						const official = entriesOf("conversation.input.model").find((e) => e.component !== ModelControlsEntry && e.children !== void 0);
						if (mine === void 0 || official?.children === void 0 || borrowed === official.children) return;
						const view = {};
						for (const [key, spec] of Object.entries(official.children)) Object.defineProperty(view, key, {
							value: spec,
							enumerable: false
						});
						mine.children = view;
						borrowed = official.children;
					};
					borrow();
					const unsubscribe = slots.subscribe("conversation.input.model", borrow);
					return () => {
						unsubscribe();
						const mine = own();
						if (mine !== void 0) delete mine.children;
						dispose();
					};
				});
			} catch (e) {
				console.warn("[model-picker] slot registration failed", e);
			}
		}
		//#endregion
		exports.LOCALE_NS = LOCALE_NS;
		exports.ModelControlsEntry = ModelControlsEntry;
		exports.ModelControlsSettings = ModelControlsSettings;
		exports.ModelPickerButton = ModelPickerButton;
		exports.ModelPickerPanel = ModelPickerPanel;
		exports.PICKER_LOCALE_NS = PICKER_LOCALE_NS;
		exports.apply = apply;
		exports.inject = inject;
		exports.mountStyles = mountStyles;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map