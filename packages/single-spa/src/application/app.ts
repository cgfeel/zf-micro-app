import { reroute } from '../navigation/reroute.ts'
import { APPLICATION_STATUS } from './app.helpers.ts'

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

export interface ApplicationType {
  bootstrap: MountActionType
  mount: MountActionType
  unmount: MountActionType
}

export type AppItemType = Partial<Record<keyof ApplicationType, MountType>> & {
  customProps: CustomPropsType & { _name: string }
  name: string
  status: APPLICATION_STATUS
  activeWhen: ActiveWhenType
  loadApp: LoadAppType
}

export type MountActionType = MountType | MountType[]

type ActiveWhenType = (location: Location) => boolean
type CustomPropsType = Record<PropertyKey, any>
type LoadAppType = (props: AppItemType['customProps']) => Promise<ApplicationType>
type MountType = (props: AppItemType['customProps']) => Promise<void>
