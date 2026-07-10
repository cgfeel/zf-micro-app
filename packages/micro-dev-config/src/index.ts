import build from './commands/build.ts'
import serve from './commands/serve.ts'

const args = process.argv.slice(2)
const command = args[0]

async function main() {
  switch (command) {
    case 'build':
      await build(args.slice(1))
      break
    case 'serve':
      await serve(args.slice(1))
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
