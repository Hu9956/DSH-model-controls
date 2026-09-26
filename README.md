# DSH Model Picker

官方 DeepSeek Harness 桌面版的模型选择器插件。源码、构建工具和产物均在本目录；构建不需要 DSH003。运行时使用宿主提供的 React、插槽、模型目录和 MenuSurface。

## 构建与验证

需要 Node.js 22.18+（或 24+）及 npm：

```sh
npm ci --ignore-scripts
npm run verify
npm pack
```

`package-lock.json` 锁定依赖版本。`lib/` 保存已构建产物，桌面版运行不需要安装本目录的开发依赖。npm 包包含运行产物和此说明；本目录还保存源代码、测试及构建配置。

## 安装

将本目录长期保留。在官方桌面版配置 `~/.dsh/profiles/desktop/cordis.patch.yml` 的现有 `insert` 中添加或更新这一行（已有同 id 时不要重复）：

```yaml
- insert:
    - id: dsh-std-model-picker
      name: '/Users/kewen/Documents/DSH-plugins/model-picker/lib/index.js'
```

若使用打包产物，先解压到稳定目录，再将 name 指向其 `lib/index.js`。保留已有替换官方 model 插槽的配置。重载官方桌面版后生效。

## 更新与回退

更新前备份本目录和配置。先在其他目录执行构建、测试，再替换运行产物并重载桌面版；若失败，恢复旧目录或旧配置路径。不要直接删除仍被配置引用的目录。

## 卸载

从 `cordis.patch.yml` 移除插件 id 对应的插入项，并恢复安装时覆盖的官方模型选择器配置，再重载桌面版。确认官方入口恢复后再删除插件文件。卸载不自动删除偏好。

## 兼容与保存位置

构建依赖使用公开发布的 DSH `0.1.7-rc.2` 类型包及 Cordis `4.0.4`。宿主需要提供 `modelDirectories.directoryFor`、会话服务、`conversation.input.model` 插槽、MenuSurface 和模块加载器。此条件不代表任意旧版本或未来版本都兼容；宿主升级后应重新验证。

模型档位和收藏仍使用原 localStorage 键：

- `dsh003.model-picker.model-efforts`
- `dsh003.model-picker.favorites`

改插件文件路径不会主动清空这些数据；数据属于当前客户端 origin，不会跨应用或设备同步。会话当前模型由宿主保存，插件保存每个模型接受成功的档位偏好。

## 本次迁移范围

保留当前模型切换、档位记忆、右对齐、官方半透明菜单材质和无入场动画的实现。此次只整理安装和构建，不更改颜色或交互。

此前发现的垂直越界、拖动取消提交、键盘焦点及部分供应商加载失败提示问题仍待独立处理。弹窗闪烁是否完全消失仍需实际使用确认。

## 2026-09-26 迁移验证

- 本目录及全新临时目录均通过类型检查、构建与 8 项测试；两处生成的 client.js 完全一致。
- 无 DOM 的模块加载测试执行 factory 和 apply，验证宿主模块引用及模型插槽注册；此测试使用简化宿主，不代替真实桌面验证。
- 官方桌面重启后正常加载；实测 Pro / High → Flash / Low → Pro / High → Flash / Low，档位独立恢复。验证后恢复原 Pro / High，并将 Flash 恢复为原 High。
- 菜单截图确认右对齐和官方半透明外观；未用逐帧录制验证闪烁。
- 原沙箱目录与官方配置备份保留，未提交 Git。
