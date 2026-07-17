import { apps } from './application/app.ts'
import { navigationEvent } from './navigation/navigation.event.ts'
import { reroute } from './navigation/reroute.ts'

export const mount = { start: false }
export function start() {
  mount.start = true
  navigationEvent(apps)

  Promise.all(apps.map(({ loaded }) => loaded)).then(() => reroute(apps))
}
