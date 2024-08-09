| 加载方式                                | 调用场景                       | 加载样式                     | 说明                                                                           |
| --------------------------------------- | ------------------------------ | ---------------------------- | ------------------------------------------------------------------------------ |
| `renderTemplateToShadowRoot`            | `active`                       | `WUJIE_SHADE_STYLE`          | 用于撑开应用                                                                   |
| `patchRenderEffect`                     | `renderTemplateToShadowRoot`   | 没有                         | 不加载样式，只重写 `Dom` 写入操作，为动态加载样式做准备                        |
| `patchCssRules`                         | `active`                       | 没有                         | 静态样式中没有匹配到，等待 `script` 注入后动态渲染样式                         |
| `insertScriptToIframe`                  | `start`                        | 没有                         | 注入 `script` 渲染应用                                                         |
| `rewriteAppendOrInsertChild`            | `patchRenderEffect`            | 没有                         | 劫持 `Dom` 写入                                                                |
| `styles` - `rawDOMAppendOrInsertBefore` | `rewriteAppendOrInsertChild`   | 空的 `style` 元素            | 来自 `React` 应用添加                                                          |
| `patchStylesheetElement`                | `rewriteAppendOrInsertChild`   | 没有                         | 劫持 `style` 写入操作                                                          |
| `handleStylesheetElementPatch`          | `rewriteAppendOrInsertChild`   | 没有                         | `style` 内容为空，跳过不处理                                                   |
| `appendChild`                           | `patchStylesheetElement`       | `index.css`                  | 将样式内容注入 `style` 元素，添加一个微任务执行 `handleStylesheetElementPatch` |
| `rewriteAppendOrInsertChild`            | `patchRenderEffect`            | 没有                         | 劫持 `Dom` 写入                                                                |
| `styles` - `rawDOMAppendOrInsertBefore` | `rewriteAppendOrInsertChild`   | 空的 `style` 元素            | 来自 `React` 应用添加                                                          |
| `patchStylesheetElement`                | `rewriteAppendOrInsertChild`   | 没有                         | 劫持 `style` 写入操作                                                          |
| `handleStylesheetElementPatch`          | `rewriteAppendOrInsertChild`   | 没有                         | `style` 内容为空，跳过不处理                                                   |
| `appendChild`                           | `patchStylesheetElement`       | `App.css`                    | 将样式内容注入 `style` 元素，添加一个微任务执行 `handleStylesheetElementPatch` |
| `handleStylesheetElementPatch`          | `appendChild`                  | 没有                         | `index.css` 打补丁，发起宏任务 `patcher`                                       |
| `handleStylesheetElementPatch`          | `appendChild`                  | 没有                         | `App.css` 打补丁，发起宏任务 `patcher`                                         |
| `patcher`                               | `handleStylesheetElementPatch` | `:host`                      | 从 `index.css` 中提取 `:host`，通过 `appendChild` 插入容器 `head`              |
| `rewriteAppendOrInsertChild`            | `patchRenderEffect`            | 没有                         | 劫持 `Dom` 写入                                                                |
| `styles` - `rawDOMAppendOrInsertBefore` | `rewriteAppendOrInsertChild`   | 将提取的 `:host` 插入 `head` | 由于 `head` 的写入被重写，所以 `:host` 也被拦截                                |
| `patchStylesheetElement`                | `rewriteAppendOrInsertChild`   | 没有                         | 拦截 `style` 属性，但 `:host` 无需再操作                                       |
| `handleStylesheetElementPatch`          | `appendChild`                  | 没有                         | `:host` 打补丁，发起宏任务 `patcher`                                           |
| `patcher`                               | `handleStylesheetElementPatch` | `@font-face`                 | 从 `index.css` 中提取 `@font-face` 插入 `shadowRoot.host`                      |
| `patcher`                               | `handleStylesheetElementPatch` | 没有                         | `App.css` 中没有提取到样式需要打补丁                                           |
| `patcher`                               | `handleStylesheetElementPatch` | 没有                         | `:host` 中没有提取到样式需要打补丁                                             |
