import { reroute } from '../navigation/reroute'
import {
  APPLICATION_STATUS,
  ActiveWhenType,
  AppItemType,
  CustomPropsType,
  LoadAppType,
} from './app.helpers'

export const apps: AppItemType[] = []

export function registerApplication(
  appName: string,
  loadApp: LoadAppType,
  activeWhen: ActiveWhenType,
  customProps?: CustomPropsType
) {
  const registeration = {
    customProps: {
      ...customProps,
      _name: appName,
    },
    name: appName,
    status: APPLICATION_STATUS.NOT_LOADED,
    activeWhen,
    loadApp,
  }
  apps.push(registeration)

  // 我们需要给每个应用添加对应的状态变化

  // 未加载 - 加载 - 挂载 - 卸载

  // 需要检查哪些应用要被加载，还有哪些应用要被移除，还有哪些应用要被挂载
  reroute(apps)
}
