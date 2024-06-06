# zf-micro-app

按照珠峰微前端在线课程，按照章节最小化复现。为了还原真实的微前端开发场景，按照章节、项目拆分不同的子模块。拷贝到本地时需要同时拉取 `submodule`：

```
git clone --recurse-submodules git@github.com:cgfeel/zf-micro-app.git
```

开发环境，除了下面每个章节补充说明外，均在以下环境运行：

- NodeJS `v21.6.1`

## 阅读说明

- 每一个字模块 `README.md` 梳理一个大概知识点作为索引
- 当前仓库会将链接汇总
- 细节查看仓库源码注释

## 示例

### `SystemJS` 使用和复现

https://github.com/cgfeel/micro-systemjs

### `Single-spa` 使用

`Single-spa` 是通过 URL 来加载不同的子应用实现微前端

目录：`./systemjs` [[查看](https://github.com/cgfeel/zf-micro-app/tree/main/single-spa)]

包含 3 个项目：`single-spa` 主应用，基座 - `React` 子应用 - `Vue` 子应用

运行方式：依次启动主应用、子应用服务，访问主应用顶部有子应用导航链接

**`single-spa` 主应用：**

目录：`./single-spa/substrate` [[查看](https://github.com/cgfeel/micro-single-app-substrate)]

加载顺序，和前面 `systemjs` 方式一致的：

- `webpack.config.js` 通过 `HtmlWebpackPlugin` 拿 `./src/index.ejs` 作为入口模板
- `./src/index.ejs` 拉到底部可看到导入语句 `System.import('@levi/root-config');`
- 即当前目录下的 `levi-root-config.ts`

几个关键点：

- `Single-spa` 每个应用中包含一个组织名：`orgName`、还有一个项目名：`root-config`，作为完整的名称：`@levi/root-config`
- `index.ejs` 中去除不需要的部分再来看，和原来的 `systemjs` 是一样的，包含：`runtime`、`systemjs-importmap`、`System.import`
- `levi-root-config.ts` 分别通过：`registerApplication` 注册应用、`start` 启动

每个添加的应用都需要：

- 在 `systemjs-importmap` 指明项目名称，以及对应的链接
- 在 `registerApplication` 指明应用完整的名称、以子项目名称作为导入 id、指定激活的 URL

**`React` 子应用：**

目录：`./single-spa/react-project` [[查看](https://github.com/cgfeel/micro-single-app-react)]

通过 `Single-spa` 默认创建的 `React 17`，在 `webpack.config.js` 中有几个关键点：

- 设置组织名和项目名
- 通过 `devServer` 设置 `port: 3000`
- 修改 `./src` 下以完整名称对应的入口文件：`levi-react.tsx`，见下方总结

项目中为了演示保留了 `react`、`react-dom`，并添加了 `React-Router`

**`Vue` 子应用：**

目录：`./single-spa/vue-project` [[查看](https://github.com/cgfeel/micro-single-app-vue)]

通过 `Single-spa` 默认创建的 `Vue 3`，和 `React` 不同的是

- 没有 `webpack.config.js`，项目名默认使用 `package.json`
- 通过 `vue.config.js` 设置 `devServer` 为 `port: 4000`
- 在 `./src` 下入口文件 `main.js`，见下方总结

项目中为了演示添加了 `Vue-Router`，并且需要去除 `SystemJSPublicPathWebpackPlugin`

**总结：**

- 无论子应用是 `React` 还是 `Vue`，默认都是子应用模式启动服务，同时还提供一个独立运行的模式：`{start|serve}:standalone`
- 所有子应用都需要修改入口文件，暴露 3 个方法：`bootstrap`, `mount`, `unmount` 用于主应用启动、加载和卸载
- 在主应用中需要对所有子应用分别设置：`systemjs-importmap`、`registerApplication`
- 子应用的入口链接并非有规律的，比如 `Vue` 就是以 ` app.js` 提供，建议运行后在启动页面查看子应用的加载链接

---- 分割线 ----
