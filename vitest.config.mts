import path from 'path'
import { defineConfig } from 'vitest/config'

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
