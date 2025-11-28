import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vitest/config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src'),
        },
    },
    test: {
        include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
        exclude: ['**/node_modules/**', '**/dist/**'],
    },
})
