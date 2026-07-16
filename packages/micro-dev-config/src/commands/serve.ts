import { runWebpack } from '../webpack'

export default function serve(args: string[]) {
  return runWebpack(['serve'].concat(args))
}
