import { apps } from './application/app'
import { navigationEvent } from './navigation/navigation.event'
import { reroute } from './navigation/reroute'

export const mount = { start: false }
export function start() {
  mount.start = true
  reroute(apps)
  navigationEvent(apps)
}
