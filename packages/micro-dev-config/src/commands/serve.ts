import { runWebpack } from "../webpack.ts";

export default function serve(args: string[]) {
  return runWebpack(["serve"].concat(args));
}