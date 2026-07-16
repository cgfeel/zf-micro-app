import { AppItemType } from '../application/app'
import { APPLICATION_STATUS } from '../application/app.helpers'

export function toUnmoutPromise(app: AppItemType) {
  return Promise.resolve().then(() => {
    const { customProps, status, unmount } = app
    if (status !== APPLICATION_STATUS.MOUNTED || !unmount) {
      // 只能卸载已挂载的应用
      return app
    }

    app.status = APPLICATION_STATUS.UNMOUNTING
    return unmount(customProps).then(() => {
      app.status = APPLICATION_STATUS.NOT_MOUNTED
      return app
    })
  })
}
