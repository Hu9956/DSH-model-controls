# 模型选择器按钮：改动清单（已完成）

> **状态：已实现并发布为 0.2.14。** 本文是实施前的方案，保留以备追溯；实际落地的代码与下面有出入，差异见文末「实施后的偏差」。

范围：**只改触发按钮的显示**。面板（模型列表、供应商栏、收藏视图）不改。供应商名不改。

---

## 一、目标

| 指标 | 改前 | 改后 |
|---|---|---|
| 按钮平均宽度 | 251px | **206px** |
| 最长按钮 | 347px | **294px** |
| ≥300px 的按钮 | 6 / 30 | **0 / 30** |
| 360px 上限下截断 | 0 | 0（不为防截断，只为省地方） |

预期效果：

```
改前  DeepSeek-V4.1-Flash  High
改后  V4.1-Flash  高

改前  DeepSeek V4.1 Flash Free · OpenCode Zen  High
改后  V4.1 Flash Free · OpenCode Zen  高
```

---

## 二、改动点（3 个文件）

### 1. `src/client/magpie-display.ts` —— 新增缩短函数

在文件末尾追加（现有 42 行，只加不改）：

```ts
/** 按钮上可以省略的品牌词：模型名其余部分已足够识别时，前缀是冗余。 */
const BUTTON_BRAND_PREFIXES: readonly string[] = [
  'deepseek', 'claude', 'mimo', 'glm', 'qwen',
]

/**
 * 生成按钮用的短模型名：去掉冗余品牌前缀。
 *
 * 只用于**触发按钮**的显示，面板行、搜索、请求、存储键全部沿用上游原名。
 *
 * 护栏：去掉品牌后必须还剩下数字，否则保留原名。这条挡住两类坏结果：
 * - `DeepSeek-Flash` → `Flash`（只剩通用词，认不出是谁）
 * - `Beam Free`、`M3` 之类本就没有品牌可去
 *
 * `GPT` / `Step` 不在名单里：`GPT-6 Astra` → `6 Astra`、`Step-5-Preview` → `5-Preview`
 * 都会失去可读性，按已确认结论完整显示。
 *
 * @param name - 上游上报的模型显示名（可能含 `·` 路由后缀，调用方需先拆开）。
 * @returns 按钮用它显示的名字；不满足条件时原样返回。
 */
export function compactModelName(name: string): string {
  const lower = name.toLowerCase()
  for (const brand of BUTTON_BRAND_PREFIXES) {
    if (!lower.startsWith(brand)) continue
    const rest = name.slice(brand.length).replace(/^[\s\-_]+/, '')
    return rest !== '' && /\d/.test(rest) ? rest : name
  }
  return name
}
```

### 2. `src/client/ModelPickerButton.tsx` —— 按钮用短名 + 中文档位

**先删掉不再使用的 `triggerLabel`**（第 136–138 行），改由下面两个 memo 承担：

```ts
  const triggerLabel = currentEffortName !== null        // ← 删除这 3 行
    ? `${currentModelName ?? t('modelFallback')} · ${currentEffortName}`
    : (currentModelName ?? t('modelFallback'))
```

**新增三个 memo**（放在 `currentEffortName` 之后）：

```ts
  /** 按钮显示的模型名：Magpie 拆掉 `· route` 只留模型，再去掉冗余品牌前缀。 */
  const buttonModelName = React.useMemo(() => {
    if (currentModelName === null) return null
    const split = isMagpieRoute(catalog.default?.provider ?? '')
      ? splitMagpieModelName(currentModelName)
      : null
    return compactModelName(split?.model ?? currentModelName)
  }, [catalog.default?.provider, currentModelName])

  /** 按钮显示的档位：宿主给的 name 是英文，按钮上换成中文；未收录的原样显示。 */
  const buttonEffortName = React.useMemo(() => {
    if (currentEffortName === null) return null
    return effortLabelZh(currentEffortName) ?? currentEffortName
  }, [currentEffortName])

  /** 悬停提示保留完整信息：模型全名 + 来源 + 档位，不跟按钮一起缩。 */
  const buttonTitle = React.useMemo(() => {
    if (currentModelName === null) return t('modelFallback')
    const parts = [currentModelName]
    if (currentEffortName !== null) parts.push(currentEffortName)
    return parts.join(' · ')
  }, [currentModelName, currentEffortName, t])
```

**import 补一行**：

```ts
import { compactModelName, isMagpieRoute, splitMagpieModelName } from './magpie-display'
import { effortLabelZh } from './effort-labels'
```

**JSX 改动（第 154–171 行）**：

| 行 | 改前 | 改后 |
|---|---|---|
| 159–161 | `aria-label` 用 `currentModelName` / `currentEffortName` | 用 `buttonModelName` / `buttonEffortName` |
| 163 | `title={triggerLabel}` | `title={buttonTitle}` |
| 168 | `{currentModelName ?? t('modelFallback')}` | `{buttonModelName ?? t('modelFallback')}` |
| 170 | `{currentEffortName}` | `{buttonEffortName}` |

> `aria-label` 用短名还是全名，我倾向**用短名**：读屏用户听到的和看到的应该一致，全名在 `title` 里已有。

### 3. `src/client/effort-labels.ts` —— 新建，档位中英映射

```ts
/**
 * 档位显示名的中文化（按钮层）。
 *
 * 档位的 `name` 由宿主提供，中英文取决于宿主语言设置。面板里本插件已用中文
 * （`思考深度` / `低` / `高`），按钮若显示 `High` 就与面板不一致。这里只做
 * 显示映射，档位 id 与请求参数不受影响。
 *
 * 用 id 而不是显示名做键更稳：宿主若改了显示名，也仍能映射到中文。
 */
const EFFORT_ZH: Readonly<Record<string, string>> = {
  minimal: '极低',
  low: '低',
  medium: '中',
  high: '高',
  xhigh: '超高',
  max: '最高',
}

/**
 * 把宿主给的档位显示名映射成中文。
 * @param name - 宿主提供的档位显示名，如 `High` / `Extra High`。
 * @returns 中文名；未收录时返回 `undefined`，调用方回退原值。
 */
export function effortLabelZh(name: string): string | undefined {
  const key = name.trim().toLowerCase().replace(/[\s_-]+/g, '')
  const byKey: Readonly<Record<string, string>> = {
    minimal: '极低', low: '低', medium: '中',
    high: '高', xhigh: '超高', extrahigh: '超高', max: '最高',
  }
  return byKey[key] ?? EFFORT_ZH[key]
}
```

> 注意：这里有两套键（`xhigh` 和 `extrahigh`），是因为宿主可能显示 `XHigh` 也可能显示 `Extra High`。实现时可以合并成一个表，按归一化后的键查。

---

## 三、⚠️ 需要你确认的一个副作用

**英文界面下按钮会变成中文档位。**

现在插件有完整的 `pickerEn` 英文字典，第 866 行还有一条测试明确断言"英文界面不能出现任何汉字"：

```js
assert.ok(!/[\u4e00-\u9fa5]/.test(win.document.body.textContent), 'no Chinese copy may remain in the English picker')
```

如果按钮档位无条件中文化，**这条测试会失败，而且英文用户会看到 `High` 变「高」**。

三个处理方式：

| 方案 | 说明 |
|---|---|
| **A. 跟随界面语言**（推荐） | 中文界面用「高」，英文界面保留 `High`。用现有的 `t()` 机制加 `effortHigh` / `effortLow` 等键 |
| B. 永远中文 | 最简单，但破坏英文界面一致性，要改那条测试 |
| C. 按钮不显示档位 | 省 79px，但你说要保留 |

**我建议 A**：加 5 个 locale 键，行为和现在其他文案一致，也不用动现有测试。

代价是省下的宽度略少：中文界面省 14px，英文界面省 0px。但方案 A 不会破坏任何现有功能。

---

## 四、测试改动

| 文件 | 改动 |
|---|---|
| `tests/magpie-display.test.ts` | 新增 `compactModelName` 用例（约 8 条，见下） |
| `tests/picker-interactions.test.mjs` | 第 875 行 `aria-label` 断言：`Model A` 保持不变（测试用的是 `Model a`，无品牌前缀）；新增一条按钮显示短名的用例 |

新增测试建议覆盖：

```ts
compactModelName('DeepSeek-V4.1-Flash')      // 'V4.1-Flash'
compactModelName('Deepseek-V4.1-Flash')      // 'V4.1-Flash'
compactModelName('DeepSeek V4.1 Flash Free') // 'V4.1 Flash Free'
compactModelName('claude-sonnet-5')          // 'sonnet-5'
compactModelName('MiMo-V2.6-Flash Free')     // 'V2.6-Flash Free'
compactModelName('DeepSeek-Flash')           // 'DeepSeek-Flash'  护栏拦下
compactModelName('GPT-6 Astra')              // 'GPT-6 Astra'     不在名单
compactModelName('Step-5-Preview')           // 'Step-5-Preview'  不在名单
compactModelName('Beam Free')                // 'Beam Free'       无品牌
compactModelName('M3')                       // 'M3'
```

---

## 五、不做的事（明确排除）

- ❌ 面板模型行不改（`ModelPickerPanel.tsx` 的 `buildRow` / 行渲染不动）
- ❌ 供应商名不缩写
- ❌ 搜索匹配逻辑不改（仍匹配上游原名与模型 id，搜 `DeepSeek` 照样能搜到）
- ❌ 收藏存储键、请求参数、档位 id 不改
- ❌ 按钮 `max-width` 不改（现在 360px 已经够用，改后平均 206px 更宽松）
- ❌ 悬停提示保留完整名 + 来源，不跟着缩

---

## 六、验收方式

```sh
cd /Users/kewen/Documents/DSH-plugins/model-picker
npm run verify      # typecheck + bundle + 全部测试
npm pack            # 产出 kewen-dsh-model-controls-0.2.11.tgz
```

然后装包、重载，肉眼核对三件事：

1. 按钮上显示 `V4.1-Flash 高` / `sonnet-5 高`
2. 悬停按钮，弹窗仍是完整名 `Deepseek-V4.1-Flash · routing group · High`
3. 打开面板，模型行仍是完整的 `Deepseek-V4.1-Flash` + 副行 `Magpie · routing group`

---

## 七、版本与文档

- `package.json`：`0.2.10` → `0.2.11`
- `CHANGELOG.md`：加一条 v0.2.11，说明"按钮显示精简名，面板与搜索不变"
- `README.md`：无需改（描述的是面板功能）

---

## 实施后的偏差（0.2.11 – 0.2.14）

实施过程中有几处和上面这份方案不同，记录在此避免误导：

1. **`isMagpieRoute` 的判断对象**：方案写 `catalog.default?.provider`，实际也是这样，但按钮上拆出来的只有模型名那一半，`· route` 原样拼回去，因为已确认供应商名不改。
2. **档位中文化做成了可跟随语言**：方案里 `effortLabelZh` 无条件返回中文。实际改为读 locale 键（`effortHigh` 等），中文界面「高」、英文界面 `High`。原因：插件的英文测试明确要求英文界面不能出现汉字。
3. **多了一个设置项**：新增 `compactModelNames`（`on` / `off`，默认 `on`），Host 半边注入 `__DSH_MODEL_CONTROLS_COMPACT_NAMES__`。官方设置表单只有文本 / 数字 / 密钥三种控件，没有布尔开关，所以用文本框承载。
4. **面板底栏也改了**：方案说「面板不动」，但档位文案面板同样显示宿主给的英文，一并改成了跟随语言。后续又调整了对齐（v0.2.13 → v0.2.14）。
5. **测试替身被修正**：`tests/picker-interactions.test.mjs` 里的 `SettingsFormModel` 原本只支持单字段、硬编码读 `magpieBaseURL`，改成支持多字段后才测得了第二个字段。原有地址测试的入库值断言保留未弱化。
