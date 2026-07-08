import serve from "./commands/server.ts";
import build from "./commands/build.ts";

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch(command) {
    case "serve":
      await serve(args.slice(1));
      break;
    case "build":
      await build(args.slice(1));
      break;
    default:
      console.log(`
micro-cli

Usage:

  micro-cli server
  micro-cli build

Commands:

  start    Start webpack dev server
  build    Build production bundle

`);
  }
}


main();