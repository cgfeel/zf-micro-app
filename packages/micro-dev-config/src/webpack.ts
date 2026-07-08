import { spawn } from "node:child_process";

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

      child.on("close", code=> {
          if(code === 0) {
            resolve();
          } else {
            reject(new Error(`webpack exited with code ${code}`));
          }
        }
      );
    }
  );