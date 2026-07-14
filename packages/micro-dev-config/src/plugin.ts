import { createRequire } from 'node:module'
import CopyPlugin from 'copy-webpack-plugin'
import webpack from 'webpack'

const requireFromCLI = createRequire(import.meta.url)

export const HtmlWebpackPlugin = requireFromCLI('html-webpack-plugin')
export function copyPlugin(patterns: CopyPlugin.Pattern[]) {
  return new CopyPlugin({ patterns })
}

export function defineEnvPlugin(env: PluginEnvType, defineRecord: PluginDefineType = {}) {
  return new webpack.DefinePlugin({
    ...Object.fromEntries(
      Object.entries(defineRecord).map(([key, value]) => [
        `process.env.${key}`,
        JSON.stringify(value),
      ])
    ),
    'process.env.NODE_ENV': JSON.stringify(env.production ? 'production' : 'development'),
  })
}

export { default as CustomStandaloneDisabledPlugin } from './plugins/CustomStandaloneDisabledPlugin.ts'
export { default as GenerateImportMapPlugin } from './plugins/GenerateImportMapPlugin.ts'
export { default as ImportMapPlugin } from './plugins/ImportMapPlugin.ts'

type PluginEnvType = { production?: boolean }
type PluginDefineType = Record<string, unknown>
