import { AppItemType } from '../application/app'
import { reroute } from './reroute'

const listener: Partial<EventListenerObject> = {}

export function callCaptureEventListener(event?: UrlChangeEvent) {
  event &&
    isObject(captureEventListeners, event.type) &&
    captureEventListeners[event.type].forEach(({ listener }) =>
      isEventListenerObject(listener)
        ? listener.handleEvent.apply(null, [event])
        : listener.apply(null, [event])
    )
}

// 对用户的路径进行劫持，劫持后重新调用 rerouter 方法重新计算加载应用
export function navigationEvent(apps: AppItemType[]) {
  if (listener.handleEvent === undefined) {
    listener.handleEvent = function (event: UrlChangeEvent) {
      reroute(apps, event)
    }
  }

  if (haveEventListenerObject(listener)) {
    originalRemoveEventListener('hashchange', listener)
    originalRemoveEventListener('popstate', listener)

    originalAddEventListener('hashchange', listener)
    originalAddEventListener('popstate', listener)
  }
}

export type UrlChangeEvent = HashChangeEvent | PopStateEvent

function patchFn(updateState: typeof window.history.pushState) {
  return function (...args: Parameters<typeof window.history.pushState>) {
    const urlBefore = window.location.href
    updateState.apply(window.history, args)

    const urlAfter = window.location.href
    if (urlBefore !== urlAfter) {
      // 通过触发 Event 的方式也是保证包含相同 event 的应用，加载完成后再切换路由
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }
}

// 但是当路由切换的时候，触发 single-spa 的 EventListener，而应用中也可能包含 addEventLister
// 需要劫持原生路由系统，保证我们加载完后再切换路由
const captureEventListeners: Record<'hashchange' | 'popstate', ListenerItemType[]> = {
  hashchange: [],
  popstate: [],
}

const haveEventListenerObject = (listener: object): listener is EventListenerObject =>
  'handleEvent' in listener
const isEventListenerObject = (
  listener: EventListenerOrEventListenerObject
): listener is EventListenerObject => 'handleEvent' in listener
const isObject = <T extends Record<PropertyKey, any>, R extends PropertyKey>(
  data: T,
  key: R
): data is T & Record<R, ListenerItemType[]> => key in data

const originalAddEventListener = window.addEventListener
const originalRemoveEventListener = window.removeEventListener

window.addEventListener = function (
  eventName: string,
  callback: EventListenerOrEventListenerObject,
  options?: ListenerItemType['options']
) {
  // 符合被劫持的事件，函数不能重复
  if (
    isObject(captureEventListeners, eventName) &&
    !captureEventListeners[eventName].some(({ listener }) => listener === callback)
  ) {
    captureEventListeners[eventName].push({ listener: callback, options })
    return
  }
  return originalAddEventListener.apply(this, [eventName, callback, options])
}

window.removeEventListener = function (
  eventName: string,
  callback: EventListenerOrEventListenerObject,
  options?: ListenerItemType['options']
) {
  // 符合被劫持的事件，函数不能重复
  if (isObject(captureEventListeners, eventName)) {
    captureEventListeners[eventName] = captureEventListeners[eventName].filter(
      ({ listener }) => listener !== callback
    )
    return
  }
  return originalRemoveEventListener.apply(this, [eventName, callback, options])
}

window.history.pushState = patchFn(window.history.pushState)
window.history.replaceState = patchFn(window.history.replaceState)

type ListenerItemType = {
  listener: EventListenerOrEventListenerObject
  options?: boolean | AddEventListenerOptions
}
