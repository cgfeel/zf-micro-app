import { Compiler } from 'webpack'

class GenerateImportMapPlugin {
  findHandle: HandleType = (file) => file.endsWith('.js')
  output = ''
  moduleName?: string

  constructor({ module, handle, output = 'import-map.json' }: GenerateMapProps) {
    if (handle) this.findHandle = handle
    this.moduleName = module
    this.output = output
  }

  apply(compiler: Compiler) {
    const hooks = compiler.hooks.thisCompilation
    hooks.tap('GenerateImportMapPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'GenerateImportMapPlugin',
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
        },
        () => {
          const jsFile = Object.keys(compilation.assets).find(this.findHandle)
          if (jsFile) {
            const manifest = {
              name: this.moduleName,
              file: jsFile,
            }

            compilation.emitAsset(
              this.output,
              new compiler.webpack.sources.RawSource(JSON.stringify(manifest, null, 2))
            )
          }
        }
      )
    })
  }
}

export default GenerateImportMapPlugin

interface GenerateMapProps {
  module?: string
  output?: string
  handle?: HandleType
}

type HandleType = (name: string) => boolean
