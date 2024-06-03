# zf-micro-app

按照珠峰微前端在线课程，按照章节最小化复现。为了还原真实的微前端开发场景，按照章节、项目拆分不同的子模块。拷贝到本地时需要同时拉取 `submodule`：

```
git clone --recurse-submodules git@github.com:cgfeel/zf-micro-app.git
```

开发环境，除了下面每个章节补充说明外，均在以下环境运行：

- NodeJS `v21.6.1`

## 阅读说明

- 会在 `README.md` 梳理一个大概知识点作为索引
- 具体查看源码注释

## 示例

### `SystemJS` 使用和复现

目录：`./systemjs` [[查看](https://github.com/cgfeel/micro-systemjs)]

运行环境：`Webpack` + `React` + `Typescript` (不重要，换成 `Vue` 也是一样的)

重点：

- `Webpack` 打包模式 `mode: development`，方便查看打包后的文件 [[查看配置](https://github.com/cgfeel/micro-systemjs/blob/main/webpack.config.js)]
- 最终编译为 `index.js` 放置在 `dist`，手写两个 html 了解 `systemjs` [[查看 index.js](https://github.com/cgfeel/micro-systemjs/blob/main/dist/index.js)]
