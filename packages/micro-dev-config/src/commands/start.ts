import { runWebpack } from "../webpack.js";

export default function start(args: string[]) {
  return runWebpack(["serve"].concat(args));
}