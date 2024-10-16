# zf-micro-app

本仓库计划按照 3 个部分展开：

- 珠峰微前端视频课，包含：基座和子应用创建、原理复现（已完成，按照框架整理到基座）
- 源码解读：珠峰解读太粗糙了，我重新整理了一份（已完成，按照框架和珠峰课程一起整理到基座）
- 官方文档实例复现（计划中，待开始）

为了还原真实的微前端开发场景，按照章节、项目拆分不同的子模块。拷贝到本地时需要同时拉取 `submodule`：

```
git clone --recurse-submodules git@github.com:cgfeel/zf-micro-app.git
```

开发环境，除了下面每个章节补充说明外，均在以下环境运行：

- NodeJS `v21.6.1`

## 阅读说明

- 每一个子模块 `README.md` 梳理知识点作为索引，当前仓库会将链接汇总
- 细节查看源码注释

## 微前端示例、原理，以及源码解读

以下仓库整理了：珠峰课程内容，以及官方源码的自我解读

### `SystemJS` 使用和复现

https://github.com/cgfeel/micro-systemjs

包含：

- 使用 `systemjs` 加载应用
- 复现：通过微任务加载所需资源，通过 `window` 快照提取模块

### `single-spa` 使用和复现

来自官方：A javascript router for front-end microservices

特点：通过路由劫持实现微前端

https://github.com/cgfeel/micro-single-app-substrate

包含：

- 父子应用搭建和使用
- 复现：原理、生命周期、注册、加载、挂载、监听路由、目录说明

### `qiankun` 使用和原理

来自官方：可能是你见过最完善的微前端解决方案 🧐

特点：基于 `sing-spa`，在此基础之上添加了沙箱、预加载

https://github.com/cgfeel/micro-qiankun-substrate

包含：

- 使用：父子应用搭建、手动加载静态应用、父子通信、沙箱隔离样式
- 沙箱原理：`shadowDom`、快照、`proxy` 单例、`proxy` 多例
- `qiankun` 源码解读：注册、执行、预加载、沙箱、加载、卸载
- 常见问题：模块依赖、组件复用、`Vite` 支持、多重嵌套、`CSS` 隔离、要废弃的方法

### `micro-app` 使用和原理

来自官方：一款简约、高效、功能强大的微前端框架

特点：基于 `web component`，沙箱支持通过 `iframe` 作为隔离

https://github.com/cgfeel/micro-app-substrate

包含：

- 使用：父子应用搭建
- `web componet` 创建组件：`slot` 插槽、观察自定义属性、样式隔离、事件触发
- `micro-app` 原理：`microApp.start` 启动、`MicroAppElement` 自定义组件、`CreateApp` 创建应用、`sandbox` 沙箱、挂载和卸载、`keep-alive` 模式

### `wujie` 复现、使用和原理

来自官方：极致的微前端框架

特点：基于 `web component` 和 `iframe` 沙箱，和 `micro-app` 不同的是 `wujie` 劫持 `iframe` 对象和 `web component` 进行通信，而不是提取子应用的 `script` 包裹在模块中，通过 `with` 使用沙箱的 `proxyWindow` 做隔离

https://github.com/cgfeel/micro-wujie-substrate

## 官方文档复现

计划中，待开始...
