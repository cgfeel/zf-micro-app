import { runWebpack } from '../webpack'

export default function build(args: string[]) {
  return runWebpack([...args])
}
