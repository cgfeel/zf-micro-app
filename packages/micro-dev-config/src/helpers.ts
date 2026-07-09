import { createRequire } from 'node:module'

const requireFromCLI = createRequire(import.meta.url)

export const HtmlWebpackPlugin = requireFromCLI("html-webpack-plugin");

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