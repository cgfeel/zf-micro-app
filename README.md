# zf-micro-app

按照珠峰微前端在线课程，按照章节最小化复现。为了还原真实的微前端开发场景，按照章节、项目拆分不同的子模块。拷贝到本地时需要同时拉取 `submodule`：

```
git clone --recurse-submodules git@github.com:cgfeel/zf-micro-app.git
```

开发环境，除了下面每个章节补充说明外，均在以下环境运行：

- NodeJS `v21.6.1`

## 阅读说明

- 每一个子模块 `README.md` 梳理知识点作为索引，当前仓库会将链接汇总
- 细节查看源码注释

## 示例

点开链接查看详细内容

### `SystemJS` 使用和复现

https://github.com/cgfeel/micro-systemjs

包含：

- 使用 `systemjs` 加载应用
- 复现：通过微任务加载所需资源，通过 `window` 快照提取模块

### `single-spa` 使用和复现

https://github.com/cgfeel/micro-single-app-substrate

包含：

- 父子应用搭建和使用
- 复现：原理、生命周期、注册、加载、挂载、监听路由、目录说明

### `qiankun` 使用和复现

来自官方：可能是你见过最完善的微前端解决方案 🧐

https://github.com/cgfeel/micro-qiankun-substrate

包含：

- 使用：父子应用搭建、手动加载静态应用、父子通信、沙箱隔离样式
- 沙箱原理：`shadowDom`、快照、`proxy` 单例、`proxy` 多例
- `qiankun` 源码解读：注册、执行、预加载、沙箱、加载、卸载
- 常见问题：模块依赖、组件复用、`Vite` 支持、多重嵌套、`CSS` 隔离、要废弃的方法

### `micro-app` 使用和复现

~~来自官方：目前市面上接入微前端成本最低的方案。~~（目前已删除）

https://github.com/cgfeel/micro-app-substrate

包含：

- 使用：父子应用搭建
- `web componet` 创建组件：`slot` 插槽、观察自定义属性、样式隔离、事件触发
- `micro-app` 原理：`microApp.start` 启动、`MicroAppElement` 自定义组件、`CreateApp` 创建应用、`sandbox` 沙箱、`keep-alive` 模式
