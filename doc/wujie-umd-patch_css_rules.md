# `wujie` 中 `patchCssRules` 存在重复加载的 `Bug`

`patchCssRules` 说明见：总结 [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#-patchcssrules-%E5%AD%90%E5%BA%94%E7%94%A8%E6%A0%B7%E5%BC%8F%E6%89%93%E8%A1%A5%E4%B8%81)]

问题描述：

- `umd` 模式下 `patchCssRules` 存在重复添加样式的情况

以子应用 `react-project` 举例 [[查看](https://github.com/cgfeel/micro-wujie-app-cra)]：

- 总共包含 2 个样式：`index.css`、`App.css` [[查看](https://github.com/cgfeel/micro-wujie-app-cra/tree/main/src)]
- 在 `index.css` 中添加 `:root` 和 `@font-face` 共计 2 个 [[查看](https://github.com/cgfeel/micro-wujie-app-cra/blob/main/src/index.css)]

## 初次加载应用是正常的

流程顺序从上到下，标 🌟 说明插入 `style` 元素到 `Dom` 中，表 📝 说明 `style` 元素记录到实例中：

### 1. 注入资源：

| 加载方式                                                                                                                                                                                      | 调用场景                                                                                                                                                               | 加载样式               | 说明                                                         |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------ |
| `renderTemplateToShadowRoot` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#rendertemplatetoshadowroot-%E6%B8%B2%E6%9F%93%E8%B5%84%E6%BA%90%E5%88%B0-shadowroot)] | `active`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/sandbox.ts#L232)]                    | 🌟 `WUJIE_SHADE_STYLE` | 静态样式，将作为容器 `html` 元素下的第一个元素，用于撑开应用 |
| `patchRenderEffect` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#patchrendereffect-%E4%B8%BA%E5%AE%B9%E5%99%A8%E6%89%93%E8%A1%A5%E4%B8%81)]                     | `renderTemplateToShadowRoot`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/shadow.ts#L235)] | 没有                   | 不加载样式，只重写 `Dom` 写入操作，为动态加载样式做准备      |
| `patchCssRules` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#-patchcssrules-%E5%AD%90%E5%BA%94%E7%94%A8%E6%A0%B7%E5%BC%8F%E6%89%93%E8%A1%A5%E4%B8%81)]          | `active`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/sandbox.ts#L233)]                    | 没有                   | 静态样式中没有匹配到，等待 `script` 注入后动态渲染样式       |
| `insertScriptToIframe` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#insertscripttoiframe%E4%B8%BA%E6%B2%99%E7%AE%B1%E6%8F%92%E5%85%A5-script)]                  | `start`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/sandbox.ts#L286)]                     | 没有                   | 注入 `script` 渲染应用                                       |

### 2. 动态加载 `index.css`：

| 加载方式                                                                                                                                                                                                                                    | 调用场景                                                                                                                                                               | 加载样式             | 说明                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------ |
| `rewriteAppendOrInsertChild`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L158)]                                                                      | `patchRenderEffect`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L427)]          | 没有                 | 劫持 `Dom` 写入                                                                |
| `styles` - `styleSheetElements` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#2-stylesheetelements-%E6%94%B6%E9%9B%86%E6%A0%B7%E5%BC%8F%E8%A1%A8)]                                                             | `rewriteAppendOrInsertChild`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L247)] | 没有                 | 📝 收集 `style` 元素做记录                                                     |
| `styles` - `rawDOMAppendOrInsertBefore`                                                                                                                                                                                                     | `rewriteAppendOrInsertChild`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L251)] | 🌟 空的 `style` 元素 | 来自 `React` 应用添加                                                          |
| `patchStylesheetElement` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#patchstylesheetelement%E5%8A%AB%E6%8C%81%E5%A4%84%E7%90%86%E6%A0%B7%E5%BC%8F%E5%85%83%E7%B4%A0%E7%9A%84%E5%B1%9E%E6%80%A7)]             | `rewriteAppendOrInsertChild`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L253)] | 没有                 | 劫持 `style` 写入操作                                                          |
| `handleStylesheetElementPatch` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#handlestylesheetelementpatch%E4%B8%BA%E5%BA%94%E7%94%A8%E4%B8%AD%E5%8A%A8%E6%80%81%E6%A0%B7%E5%BC%8F%E6%89%93%E8%A1%A5%E4%B8%81)] | `rewriteAppendOrInsertChild`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L254)] | 没有                 | `style` 内容为空，跳过不处理                                                   |
| `appendChild`                                                                                                                                                                                                                               | `patchStylesheetElement`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L139)]     | `index.css`          | 将样式内容注入 `style` 元素，添加一个微任务执行 `handleStylesheetElementPatch` |

### 3. 动态加载 `App.css`：

| 加载方式                                                                                                                                                                                                                                    | 调用场景                                                                                                                                                               | 加载样式             | 说明                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------ |
| `rewriteAppendOrInsertChild`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L158)]                                                                      | `patchRenderEffect`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L427)]          | 没有                 | 劫持 `Dom` 写入                                                                |
| `styles` - `styleSheetElements` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#2-stylesheetelements-%E6%94%B6%E9%9B%86%E6%A0%B7%E5%BC%8F%E8%A1%A8)]                                                             | `rewriteAppendOrInsertChild`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L247)] | 没有                 | 📝 收集 `style` 元素做记录                                                     |
| `styles` - `rawDOMAppendOrInsertBefore`                                                                                                                                                                                                     | `rewriteAppendOrInsertChild`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L251)] | 🌟 空的 `style` 元素 | 来自 `React` 应用添加                                                          |
| `patchStylesheetElement` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#patchstylesheetelement%E5%8A%AB%E6%8C%81%E5%A4%84%E7%90%86%E6%A0%B7%E5%BC%8F%E5%85%83%E7%B4%A0%E7%9A%84%E5%B1%9E%E6%80%A7)]             | `rewriteAppendOrInsertChild`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L253)] | 没有                 | 劫持 `style` 写入操作                                                          |
| `handleStylesheetElementPatch` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#handlestylesheetelementpatch%E4%B8%BA%E5%BA%94%E7%94%A8%E4%B8%AD%E5%8A%A8%E6%80%81%E6%A0%B7%E5%BC%8F%E6%89%93%E8%A1%A5%E4%B8%81)] | `rewriteAppendOrInsertChild`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L254)] | 没有                 | `style` 内容为空，跳过不处理                                                   |
| `appendChild`                                                                                                                                                                                                                               | `patchStylesheetElement`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L139)]     | `App.css`            | 将样式内容注入 `style` 元素，添加一个微任务执行 `handleStylesheetElementPatch` |

### 4. 提取样式打补丁：

| 加载方式                                                                                                                                                                                                                                    | 调用场景                                                                                                                                                                | 加载样式                        | 说明                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `handleStylesheetElementPatch` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#handlestylesheetelementpatch%E4%B8%BA%E5%BA%94%E7%94%A8%E4%B8%AD%E5%8A%A8%E6%80%81%E6%A0%B7%E5%BC%8F%E6%89%93%E8%A1%A5%E4%B8%81)] | `appendChild`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L141)]                 | 没有                            | `index.css` 打补丁，发起宏任务 `patcher`                                                                     |
| `handleStylesheetElementPatch` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#handlestylesheetelementpatch%E4%B8%BA%E5%BA%94%E7%94%A8%E4%B8%AD%E5%8A%A8%E6%80%81%E6%A0%B7%E5%BC%8F%E6%89%93%E8%A1%A5%E4%B8%81)] | `appendChild`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L141)]                 | 没有                            | `App.css` 打补丁，发起宏任务 `patcher`                                                                       |
| `patcher` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#handlestylesheetelementpatch%E4%B8%BA%E5%BA%94%E7%94%A8%E4%B8%AD%E5%8A%A8%E6%80%81%E6%A0%B7%E5%BC%8F%E6%89%93%E8%A1%A5%E4%B8%81)]                      | `handleStylesheetElementPatch`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L66)] | `:host`                         | 从 `index.css` 中提取 `:host`，通过 `appendChild` 插入容器 `head`，由于方法被重写所以写入 `:host` 将再被拦截 |
| `rewriteAppendOrInsertChild`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L158)]                                                                      | `patchRenderEffect`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L427)]           | 没有                            | 劫持 `Dom` 写入                                                                                              |
| `styles` - `styleSheetElements` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#2-stylesheetelements-%E6%94%B6%E9%9B%86%E6%A0%B7%E5%BC%8F%E8%A1%A8)]                                                             | `rewriteAppendOrInsertChild`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L247)]  | 没有                            | 📝 收集 `style` 元素做记录                                                                                   |
| `styles` - `rawDOMAppendOrInsertBefore`                                                                                                                                                                                                     | `rewriteAppendOrInsertChild`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L251)]  | 🌟 将提取的 `:host` 插入 `head` | 来自宏任务 `patcher` 将 `:host` 插入 `head`                                                                  |
| `patchStylesheetElement` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#patchstylesheetelement%E5%8A%AB%E6%8C%81%E5%A4%84%E7%90%86%E6%A0%B7%E5%BC%8F%E5%85%83%E7%B4%A0%E7%9A%84%E5%B1%9E%E6%80%A7)]             | `rewriteAppendOrInsertChild`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L253)]  | 没有                            | 拦截 `style` 属性，但 `:host` 无需再操作                                                                     |
| `handleStylesheetElementPatch` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#handlestylesheetelementpatch%E4%B8%BA%E5%BA%94%E7%94%A8%E4%B8%AD%E5%8A%A8%E6%80%81%E6%A0%B7%E5%BC%8F%E6%89%93%E8%A1%A5%E4%B8%81)] | `rewriteAppendOrInsertChild`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L254)]  | 没有                            | `:host` 打补丁，发起宏任务 `patcher`                                                                         |
| `patcher` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#handlestylesheetelementpatch%E4%B8%BA%E5%BA%94%E7%94%A8%E4%B8%AD%E5%8A%A8%E6%80%81%E6%A0%B7%E5%BC%8F%E6%89%93%E8%A1%A5%E4%B8%81)]                      | `handleStylesheetElementPatch`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L66)] | 🌟 `@font-face`                 | 从 `index.css` 中提取 `@font-face` 插入 `shadowRoot.host`                                                    |
| `patcher` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#handlestylesheetelementpatch%E4%B8%BA%E5%BA%94%E7%94%A8%E4%B8%AD%E5%8A%A8%E6%80%81%E6%A0%B7%E5%BC%8F%E6%89%93%E8%A1%A5%E4%B8%81)]                      | `handleStylesheetElementPatch`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L66)] | 没有                            | `App.css` 中没有提取到样式需要打补丁                                                                         |
| `patcher` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#handlestylesheetelementpatch%E4%B8%BA%E5%BA%94%E7%94%A8%E4%B8%AD%E5%8A%A8%E6%80%81%E6%A0%B7%E5%BC%8F%E6%89%93%E8%A1%A5%E4%B8%81)]                      | `handleStylesheetElementPatch`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L66)] | 没有                            | `:host` 中没有提取到样式需要打补丁                                                                           |

加载的样式共有 6 处：

- `shadowRoot.host` 末尾 1 处：`@font-face`
- 容器 `html` 下第 1 个子元素：`WUJIE_SHADE_STYLE`（静态样式）
- 容器 `head` 下有 3 处：`index.css`、`App.css`、`:host`

`styleSheetElements` 集合共有 3 项：

- `index.css`、`App.css`、`:host`

## 切换应用存在重复引入样式的问题

流程顺序从上到下，标 🌟 说明插入 `style` 元素到 `Dom` 中，表 📝 说明 `style` 元素记录到实例中：

### 1. 注入资源：

| 加载方式                                                                                                                                                                                      | 调用场景                                                                                                                                                               | 加载样式               | 说明                                                         |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------ |
| `renderTemplateToShadowRoot` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#rendertemplatetoshadowroot-%E6%B8%B2%E6%9F%93%E8%B5%84%E6%BA%90%E5%88%B0-shadowroot)] | `active`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/sandbox.ts#L232)]                    | 🌟 `WUJIE_SHADE_STYLE` | 静态样式，将作为容器 `html` 元素下的第一个元素，用于撑开应用 |
| `patchRenderEffect` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#patchrendereffect-%E4%B8%BA%E5%AE%B9%E5%99%A8%E6%89%93%E8%A1%A5%E4%B8%81)]                     | `renderTemplateToShadowRoot`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/shadow.ts#L235)] | 没有                   | 不加载样式，只重写 `Dom` 写入操作，为动态加载样式做准备      |
| `patchCssRules` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#-patchcssrules-%E5%AD%90%E5%BA%94%E7%94%A8%E6%A0%B7%E5%BC%8F%E6%89%93%E8%A1%A5%E4%B8%81)]          | `active`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/sandbox.ts#L233)]                    | 没有                   | 静态样式中没有匹配到，等待 `script` 注入后动态渲染样式       |

### 2. 重建样式：

| 加载方式                                                                                                                                                                                                                                    | 调用场景                                                                                                                                                                                       | 加载样式                           | 说明                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------- |
| `rebuildStyleSheets` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#-rebuildstylesheets-%E9%87%8D%E6%96%B0%E6%81%A2%E5%A4%8D%E6%A0%B7%E5%BC%8F)]                                                                | `startApp`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/index.ts#L245)]                                            | 🌟 `index.css`、`App.css`、`:host` | 通过 `styleSheetElements` 恢复样式                                                  |
| `patchCssRules` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#-patchcssrules-%E5%AD%90%E5%BA%94%E7%94%A8%E6%A0%B7%E5%BC%8F%E6%89%93%E8%A1%A5%E4%B8%81)]                                                        | `rebuildStyleSheets`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/sandbox.ts#L446)]                                | 没有                               | 再次提取到 `:host` 执行 `appendChild`，由于注入资源时已重写了方法，所以操作会被拦截 |
| `rewriteAppendOrInsertChild`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L158)]                                                                      | `patchRenderEffect`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L427)]                                  | 没有                               | 劫持 `Dom` 写入                                                                     |
| `styles` - `styleSheetElements` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#2-stylesheetelements-%E6%94%B6%E9%9B%86%E6%A0%B7%E5%BC%8F%E8%A1%A8)]                                                             | `rewriteAppendOrInsertChild`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L247)]                         | 没有                               | 📝 收集 `:host` 样式元素做记录                                                      |
| `styles` - `rawDOMAppendOrInsertBefore`                                                                                                                                                                                                     | `rewriteAppendOrInsertChild`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L251)]                         | 🌟 将提取的 `:host` 插入 `head`    | 由 `patchCssRules` 重复执行导致                                                     |
| `patchStylesheetElement` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#patchstylesheetelement%E5%8A%AB%E6%8C%81%E5%A4%84%E7%90%86%E6%A0%B7%E5%BC%8F%E5%85%83%E7%B4%A0%E7%9A%84%E5%B1%9E%E6%80%A7)]             | `rewriteAppendOrInsertChild`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L253)]                         | 没有                               | 拦截 `style` 属性，但 `:host` 无需再操作                                            |
| `handleStylesheetElementPatch` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#handlestylesheetelementpatch%E4%B8%BA%E5%BA%94%E7%94%A8%E4%B8%AD%E5%8A%A8%E6%80%81%E6%A0%B7%E5%BC%8F%E6%89%93%E8%A1%A5%E4%B8%81)] | `rewriteAppendOrInsertChild`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L254)]                         | 没有                               | `:host` 打补丁，发起宏任务 `patcher`                                                |
| `styleSheetElements` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#2-stylesheetelements-%E6%94%B6%E9%9B%86%E6%A0%B7%E5%BC%8F%E8%A1%A8)]                                                                        | 挂起宏任务后，继续返回到 `patchCssRules` 执行上下文，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/sandbox.ts#L464)] | 没有                               | 📝 再次收集 `:host` 样式元素做记录                                                  |
| `fontStyleSheetElement`                                                                                                                                                                                                                     | `patchCssRules`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/sandbox.ts#L467)]                                     | 🌟 `@font-face`                    | 再次将 `@font-face` 添加到 `shadowRoot.host` 末尾                                   |
| `WUJIE_DATA_ATTACH_CSS_FLAG`                                                                                                                                                                                                                | `patchCssRules`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/sandbox.ts#L470)]                                     | 没有                               | 打上标记避免下次重复执行                                                            |
| `patcher` [[查看](https://github.com/cgfeel/micro-wujie-substrate?tab=readme-ov-file#handlestylesheetelementpatch%E4%B8%BA%E5%BA%94%E7%94%A8%E4%B8%AD%E5%8A%A8%E6%80%81%E6%A0%B7%E5%BC%8F%E6%89%93%E8%A1%A5%E4%B8%81)]                      | `handleStylesheetElementPatch`，见：源码 [[查看](https://github.com/Tencent/wujie/blob/9733864b0b5e27d41a2dc9fac216e62043273dd3/packages/wujie-core/src/effect.ts#L66)]                        | 没有                               | 最后的宏任务，`:host` 中没有提取到样式需要打补丁                                    |

### 3. 总结：

重复加载样式 2 条：

- `:host`：重复插入 `head` 1 条
- `@font-face`：重复插入 1 条到 `shadowRoot.host`

重复记录 `styleSheetElements` 两条，都是 `:host`：

- `rewriteAppendOrInsertChild`：动态添加样式 1 条
- `patchCssRules`：动态添加样式 1 条

> 至此由于打上了标签 `WUJIE_DATA_ATTACH_CSS_FLAG`，下次切换应用不会再重复增加

问题来源：

- `rebuildStyleSheets`：重建样式之后 `patchCssRules`

影响：

- 除了重复添加了 `Dom` 元素，没有任何影响

不同模式对比：

| 模式     | 初次加载                 | 切换应用                                        |
| -------- | ------------------------ | ----------------------------------------------- |
| `alive`  | 和重建模式一样           | 不删除资源，也不用恢复资源                      |
| 重建模式 | 样式来自动态收集，不重复 | 每次都销毁实例，和初次加载一样                  |
| `umd`    | 样式来自动态收集，不重复 | `rebuildStyleSheets` 1 次，`patchCssRules` 1 次 |

重复添加的样式在哪里销毁：

- `shadowRoot` 下的样式随容器在 `unmount` 时一同销毁
- `shadowRoot.host` 下的样式会在 `destroy` 时清空挂载点

关于 `styleSheetElements` 额外说明：

- 来自 `rawDOMAppendOrInsertBefore` 拦截写入的 `style` 元素会插入集合
- 然后通过 `patchStylesheetElement` 劫持 `style` 的属性写入操作
- 通过 `handleStylesheetElementPatch` 提取每次注入时指定的样式
- 其中 `@font-face` 因为是插入 `shadowRoot.host`，所以不用关心应用切换是否销毁
- 而 `:hoot` 在注入 `head` 时候会再次被 `patchRenderEffect` 拦截
- 然后再次转交 `:host` 给 `rawDOMAppendOrInsertBefore` 进行处理
- 这样插入的 `:host` 因此也记录在 `styleSheetElements` 集合做
- 然后 `:host` 因为本身样式不符合 `handleStylesheetElementPatch` 提取规定，所以单个流程结束
