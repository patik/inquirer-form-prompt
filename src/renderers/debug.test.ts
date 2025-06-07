import { describe, it } from 'vitest'
import figures from '@inquirer/figures'
import { bold, underline } from 'yoctocolors'
import type { BooleanField } from '../util/types.js'
import { renderBoolean } from './boolean.js'

describe('debug renderBoolean', () => {
    it('should show actual output', () => {
        const field1: BooleanField = { type: 'boolean', name: 'test', value: true }

        const result = renderBoolean(field1, false)
        console.log('True value result:', JSON.stringify(result))
        console.log('Contains plain false?', result.includes('false'))
        console.log('Contains formatted false?', result.includes(bold(underline('false'))))
        console.log('Contains plain true?', result.includes('true'))
        console.log('Contains formatted true?', result.includes(bold(underline('true'))))

        // Let's check the exact expected pattern
        const expectedFalse = `${figures.radioOff} false`
        console.log('Expected false pattern:', JSON.stringify(expectedFalse))
        console.log('Contains expected false pattern?', result.includes(expectedFalse))
    })
})
