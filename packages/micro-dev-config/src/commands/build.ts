import { runWebpack } from "../webpack.js";

export default function build(args: string[]) {
  return runWebpack([...args]);
}