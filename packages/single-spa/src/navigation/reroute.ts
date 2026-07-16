import { AppItemType, getAppChanges, shouldBeActive } from '../application/app.helpers'
import { toBootstrapPromise } from '../lifecycles/bootstrap'
import { toLoadPromise } from '../lifecycles/load'
import { toMountPromise } from '../lifecycles/mount'
import { toUnmoutPromise } from '../lifecycles/unmount'
import { mount } from '../start'
import { UrlChangeEvent, callCaptureEventListener } from './navigation.event'

// 后续路径变化也将在这里重新计算，哪些应用被加载、哪些挂载、哪些卸载
export function reroute(apps: AppItemType[], event?: UrlChangeEvent) {
  // 启动的时候执行
  if (mount.start) {
    // 调用了 start 方法，要处理应用挂载或卸载
    return preformAppChange(apps).then(() => callCaptureEventListener(event))
  }

  // 注册应用没启动，加载完毕后等待需要去挂载应用
  const { appsToLoad } = getAppChanges(apps)

  // 注意：这里是一个微任务，如果 registerApplication 和 start 同时执行
  // 在微任务修改状态完成前，start 已将应用再次添加到新的加载微任务队列中了
  return Promise.all(appsToLoad.map(toLoadPromise)).then(() => callCaptureEventListener(event))
}

function preformAppChange(apps: AppItemType[]) {
  // 获取 app 对应的状态进行分类
  const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges(apps)

  // 将不需要的应用卸载，返回一个卸载的 promise 集合
  // 1) 销毁应用，这里先计算在线的应用，准备在挂载前进行卸载
  const unmountAllPromise = Promise.all(appsToUnmount.map(toUnmoutPromise))

  // 加载需要的应用 - 启动对应的应用 - 卸载所有挂载的应用 - 挂载对应的应用
  // 2) 加载应用（可能这个应用在注册的时候已经被加载了）

  // 默认情况注册的时候路径是 #/app1，但是当 start 启动的时候应用路径已切换为 #/app2
  const loadMountPromises = Promise.all(
    appsToLoad.map((app) =>
      toLoadPromise(app).then((app) => {
        // 加载完毕后需要需要启动和挂载，但是要保证挂在前先卸载不必要的应用
        return tryBootstrapAndMount(app, unmountAllPromise)
      })
    )
  )

  // 已加载的应用只需要挂载即可
  const mountPromises = Promise.all(
    appsToMount.map((app) => tryBootstrapAndMount(app, unmountAllPromise))
  )

  // 返回一个 Promise，去捕获 Event
  return Promise.all([loadMountPromises, mountPromises])
}

function tryBootstrapAndMount(app: AppItemType, unmountAllPromise: Promise<AppItemType[]>) {
  if (shouldBeActive(app)) {
    // 确保卸载完毕再挂载，这里会卸载所有挂载的应用，之后重新挂载
    return toBootstrapPromise(app).then((app) => unmountAllPromise.then(() => toMountPromise(app)))
  }
}
