import { APPLICATION_STATUS, AppItemType, MountActionType } from '../application/app.helpers.ts'

export function toLoadPromise(app: AppItemType) {
  return Promise.resolve().then(() => {
    const { customProps, status, loadApp, trigger } = app
    if (status !== APPLICATION_STATUS.NOT_LOADED) {
      // 此应用已加载完毕了
      return app
    }

    // 正在加载应用
    app.status = APPLICATION_STATUS.LOADING_SOURCE_CODE

    // 相当于 systemjs 中的 System.import
    return Promise.resolve()
      .then(() => loadApp(customProps))
      .then(({ bootstrap, mount, unmount }) => {
        // 将加载的信息更新到 app 并返回
        app.status = APPLICATION_STATUS.NOT_BOOTSTRAPED
        app.bootstrap = flattenArrayToPromise(bootstrap)
        app.mount = flattenArrayToPromise(mount)
        app.unmount = flattenArrayToPromise(unmount)

        return app
      })
      .finally(() => trigger())
  })
}

// 拍平挂载的方法
function flattenArrayToPromise(fn: MountActionType) {
  const fns = Array.isArray(fn) ? fn : [fn]
  return (props: AppItemType['customProps']) =>
    fns.reduce((current, fn) => current.then(() => fn(props)), Promise.resolve())
}
