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

`Webpack` 打包总结：

- `mode: development`，方便查看打包后的文件 [[查看配置](https://github.com/cgfeel/micro-systemjs/blob/main/webpack.config.js)]
- `externals: ["react", "react-dom"]`，分离依赖的框架
- `libraryTarget: "system"` 最终编译为 `index.js` 放置在 `dist` [[查看 index.js](https://github.com/cgfeel/micro-systemjs/blob/main/dist/index.js)]

`index.js` 概览：

- 由 `System.register` 完成注册，接受 2 个参数，第一个是依赖，这里是 `["react","react-dom"]`
- 第二个是加载回调函数，有 2 个参数 [[见文件注释](https://github.com/cgfeel/micro-systemjs/blob/main/dist/index.html)]，返回一个对象，包含：
  - `setters`：记录加载模块的数组对象，顺序和加载依赖数组一致
  - `execute`：全部加载完毕后执行方法进行渲染

知识点：手写两个 html 了解 `systemjs`

1. 通过 `systemjs` 加载应用和对应的逻辑，完成渲染

文件：`./systemjs/dist/systemjs.html` [[查看](https://github.com/cgfeel/micro-systemjs/blob/main/dist/systemjs.html)]

分 3 个部分：

- 类型 `type="systemjs-importmap"` 的 `script` 作为依赖源码地址，这里全部采用 `umd` 模式
- `system.min.js` 本身的源码包
- `System.import` 导入打包后的文件 `index.js`

2.  复现 `systemjs`

文件：`./systemjs/dist/index.html` [[查看](https://github.com/cgfeel/micro-systemjs/blob/main/dist/index.html)]

详细见文件注释，罗列几个关键点：

- 使用微任务的方式，通过 `script` 加载所需的依赖
- 加载顺序：
  - 先加载本地导入的包：`index.js`
  - 由于加载过程是一个微任务，所以 `script` 加载完成后会立即执行 `System.register`
  - 将 `System.register` 提供的 2 个参数存起来，等待上面微任务继续执行
  - 继续下一个微任务，分别拿到依赖项加载，并按照顺序分别提供给回调方法返回的 `setters`
  - 最后执行回调方法放回的 `execute` 完成渲染

至此整个 `systemjs` 的加载过程大致已了解，和课程内容不同的是，为了尽可能还原 `SystemJS`，我将加载方法和对象全部放在了 `Class SystemJS` 中

---- 分割线 ----
