import { APPLICATION_STATUS } from '../application/app.helpers.ts'
import { AppItemType } from '../application/app.ts'

export function toMountPromise(app: AppItemType) {
  return Promise.resolve().then(() => {
    const { customProps, status, mount } = app
    if (status !== APPLICATION_STATUS.NOT_MOUNTED || !mount) {
      // 只挂载没有挂载的应用
      return app
    }

    return mount(customProps).then(() => {
      app.status = APPLICATION_STATUS.MOUNTED
      return app
    })
  })
}
