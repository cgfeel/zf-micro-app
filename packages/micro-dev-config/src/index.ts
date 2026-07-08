import start from "./commands/start.ts";
import build from "./commands/build.ts";

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch(command) {
    case "start":
      await start(args.slice(1));
      break;
    case "build":
      await build(args.slice(1));
      break;
    default:
      console.log(`
micro-cli

Usage:

  micro-cli start
  micro-cli build

Commands:

  start    Start webpack dev server
  build    Build production bundle

`);
  }
}


main();