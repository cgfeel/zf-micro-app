import HtmlWebpackPlugin from 'html-webpack-plugin'
import { Compiler } from 'webpack'

class CustomStandaloneDisabledPlugin {
  replaceHandle?: ReplaceHandleType

  constructor({ handle }: StandalonPluginOptions) {
    this.replaceHandle = handle
  }

  apply(compiler: Compiler) {
    const handle = this.replaceHandle
    if (!handle) return

    compiler.hooks.compilation.tap('CustomStandaloneDisabledPlugin', (compilation) => {
      const htmlHooks = HtmlWebpackPlugin.getHooks(compilation)
      htmlHooks.beforeEmit.tapAsync('CustomStandaloneDisabledPlugin', (data, cb) => {
        data.html = handle(data.html)
        cb(null, data)
      })
    })
  }
}

export default CustomStandaloneDisabledPlugin

interface StandalonPluginOptions {
  handle?: ReplaceHandleType
}

type ReplaceHandleType = (html: string) => string
