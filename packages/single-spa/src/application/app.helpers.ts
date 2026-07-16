export enum APPLICATION_STATUS {
  // app status
  LOADING_ERROR = 'LOADING_ERROR',
  LOADING_SOURCE_CODE = 'LOADING_SOURCE_CODE', // 路径匹配过了，要去加载资源
  NOT_LOADED = 'NOT_LOADED', // 没有被加载

  // 启动过程
  BOOTSTRAPING = 'BOOTSTRAPING', // 启动中
  NOT_BOOTSTRAPED = 'NOT_BOOTSTRAPED', // 资源加载完毕，等待启动
  NOT_MOUNTED = 'NOT_MOUNTED', // 没有被挂载

  // 挂载流程
  MOUNTING = 'MOUNTING', // 正在挂载
  MOUNTED = 'MOUNTED', // 挂载完成

  // 卸载流程
  UNMOUNTING = 'UNMOUNTING', // 卸载中
}

export function getAppChanges<T extends AppItemType>(apps: T[]) {
  const appsToLoad: T[] = []
  const appsToMount: T[] = []
  const appsToUnmount: T[] = []

  apps.forEach((app) => {
    // 先去看当前路径激活状态
    const appShouldBeActive = shouldBeActive(app)
    switch (app.status) {
      // 1) 需要加载：没有被加载，路径匹配需要加载资源
      case APPLICATION_STATUS.LOADING_SOURCE_CODE:
      case APPLICATION_STATUS.NOT_LOADED:
        if (appShouldBeActive) {
          appsToLoad.push(app)
        }
        break
      // 2) 需要挂在：启动中，加载完毕等待启动，没有被挂载
      case APPLICATION_STATUS.BOOTSTRAPING:
      case APPLICATION_STATUS.NOT_BOOTSTRAPED:
      case APPLICATION_STATUS.NOT_MOUNTED:
        if (appShouldBeActive) {
          appsToMount.push(app)
        }
        break
      // 3) 需要卸载：已挂载
      case APPLICATION_STATUS.MOUNTED:
        if (!appShouldBeActive) {
          appsToUnmount.push(app)
        }
        break
        4
    }
  })

  return { appsToLoad, appsToMount, appsToUnmount }
}

// 看下这个应用是否被激活
export function isActive(app: AppItemType) {
  return app.status === APPLICATION_STATUS.MOUNTED
}

// 看下此应用是否应该被激活
export function shouldBeActive(app: AppItemType) {
  return app.activeWhen(window.location)
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

export type ActiveWhenType = (location: Location) => boolean
export type CustomPropsType = Record<PropertyKey, any>
export type LoadAppType = (props: AppItemType['customProps']) => Promise<ApplicationType>
export type MountActionType = MountType | MountType[]

type MountType = (props: AppItemType['customProps']) => Promise<void>
