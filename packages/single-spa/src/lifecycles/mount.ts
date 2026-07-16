import { APPLICATION_STATUS, AppItemType } from '../application/app.helpers'

export function toMountPromise(app: AppItemType) {
  return Promise.resolve().then(() => {
    const { customProps, status, mount } = app
    if (status !== APPLICATION_STATUS.NOT_MOUNTED || !mount) {
      // 只挂载没有挂载的应用
      return app
    }

    return Promise.resolve()
      .then(() => mount(customProps))
      .then(() => {
        app.status = APPLICATION_STATUS.MOUNTED
        return app
      })
  })
}
