import { createRequire } from 'node:module'
import webpack from 'webpack'

const requireFromCLI = createRequire(import.meta.url)

export const HtmlWebpackPlugin = requireFromCLI('html-webpack-plugin')

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

/**
 * 返回 loader 的绝对路径
 */
export function loader(name: string) {
  return requireFromCLI.resolve(name)
}

/**
 * 返回普通模块
 */
export function plugin<T>(name: string): T {
  return requireFromCLI(name)
}

/**
 * 返回模块的绝对路径
 */
export function resolve(name: string) {
  return requireFromCLI.resolve(name)
}

type PluginEnvType = { production?: boolean }
type PluginDefineType = Record<string, unknown>
