import build from './commands/build.ts'
import serve from './commands/serve.ts'

const COMMANDS = ['build', 'serve']
const args = process.argv.slice(2)

const command = COMMANDS.includes(args[0]) ? args[0] : 'build'
const commandArgs = COMMANDS.includes(args[0]) ? args.slice(1) : args

async function main() {
  switch (command) {
    case 'build':
      await build(commandArgs)
      break
    case 'serve':
      await serve(commandArgs)
      break
    default:
      console.log(`
micro-cli

Usage:

  micro-cli build
  micro-cli serve

Commands:

  build    Build production bundle
  serve    Start webpack dev server

`)
  }
}

main()
