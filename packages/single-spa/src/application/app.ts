import { reroute } from '../navigation/reroute.ts'
import { APPLICATION_STATUS, ActiveWhenType, AppItemType, LoadAppType } from './app.helpers.ts'

export const apps: AppItemType[] = []

export function registerApplication(
  appName: string,
  loadApp: LoadAppType,
  activeWhen: ActiveWhenType,
  customProps?: Record<PropertyKey, any>
) {
  if (apps.find(({ name }) => name === appName)) return

  let trigger = (value: void | PromiseLike<void>) => {}
  const loaded = new Promise<void>((resolve) => {
    trigger = resolve
  })

  const registeration = {
    customProps: {
      ...customProps,
      _name: appName,
    },
    name: appName,
    status: APPLICATION_STATUS.NOT_LOADED,
    loaded,
    activeWhen,
    loadApp,
    trigger,
  }

  apps.push(registeration)

  // 我们需要给每个应用添加对应的状态变化

  // 未加载 - 加载 - 挂载 - 卸载

  // 需要检查哪些应用要被加载，还有哪些应用要被移除，还有哪些应用要被挂载
  reroute(apps)
}
