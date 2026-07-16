import { runWebpack } from '../webpack.ts'

export default function build(args: string[]) {
  return runWebpack([...args])
}
