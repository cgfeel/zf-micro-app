import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export const runWebpack = (
  args:string[]
) => new Promise<void>(
    (resolve, reject)=> {
      const cliPath = require.resolve("webpack-cli/bin/cli.js");
      const child = spawn(process.execPath,
        [cliPath].concat(args),
        {
          stdio: "inherit"
        }
      );

      child.on("error", reject);
      child.on("close", code=> {
          if(code === 0) {
            resolve();
          } else {
            reject(new Error(`webpack exited with code ${code ?? -1}`));
          }
        }
      );
    }
  );