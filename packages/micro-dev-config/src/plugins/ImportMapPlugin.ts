import fs from 'node:fs'
import path from 'node:path'
import webpack from 'webpack'
import type { Compilation, Compiler } from 'webpack'

const isImportMapManifest = (data: unknown): data is ImportMapManifest => {
  if (typeof data !== 'object' || data === null) return false
  const map = data as Record<string, unknown>

  return typeof map.name === 'string' && typeof map.file === 'string'
}

class ImportMapPlugin {
  constructor(private _options: ImportMapPluginOptions = {}) {}
  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap('ImportMapPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'ImportMapPlugin',
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
        },
        () => {
          this._generateImportMap(compiler, this._generateInitRecord(compilation), compilation.hash)
        }
      )
    })
  }

  private _generateImportMap(compiler: Compiler, record: Record<string, string>, hash?: string) {
    const outputPath = compiler.options.output.path
    if (!outputPath) return

    const microDir = path.join(outputPath, this._options.mapDir ?? 'micro')
    const baseUrl = this._options.baseUrl?.replace(/\/+$/, '') ?? ''
    const imports = {
      ...this._generateRecordMap(baseUrl, record),
      ...this._generateRecordMap(baseUrl, this._generateMicroRecord(microDir)),
    }

    fs.writeFileSync(
      path.join(outputPath, hash ? `import-map.${hash}.json` : 'import-map.json'),
      JSON.stringify({ imports }, null, 2) + '\n'
    )
  }

  private _generateInitRecord(compilation: Compilation) {
    const init: Record<string, string> = {}
    const importRecord = this._options.imports ?? {}

    for (const [name, entry] of compilation.entrypoints) {
      if (name in importRecord) {
        const mainChunk = entry.chunks.find((chunk) => chunk.name === name)
        const mainJsFile = mainChunk
          ? Array.from(mainChunk.files).find((file) => file.endsWith('.js'))
          : null

        if (mainJsFile) {
          init[importRecord[name]] = mainJsFile
        }
      }
    }

    return init
  }

  private _generateMicroRecord(microDir: string) {
    const record: Record<string, string> = {}
    if (!fs.existsSync(microDir)) return record

    for (const entry of fs.readdirSync(microDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue

      const appDir = path.join(microDir, entry.name)
      const manifest = path.join(appDir, 'import-map.json')

      if (!fs.existsSync(manifest)) continue
      try {
        const json = JSON.parse(fs.readFileSync(manifest, 'utf-8')) as unknown
        if (isImportMapManifest(json) && json.file && json.name) {
          record[json.name] = `${this._options.mapDir ?? 'micro'}/${entry.name}/${json.file}`
        }
      } catch (error) {
        console.warn('Parse map json error:', error)
      }
    }

    return record
  }

  private _generateRecordMap(url: string, record: Record<string, string>) {
    return Object.fromEntries(
      Object.entries(record).map(([key, value]) => [key, `${url}/${value}`])
    )
  }
}

export default ImportMapPlugin

interface ImportMapPluginOptions {
  mapDir?: string
  baseUrl?: string
  imports?: Record<string, string> // { name: moduleName }
}

type ImportMapManifest = {
  file: string
  name: string
}
