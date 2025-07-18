/* eslint-disable no-control-regex */

import figures from '@inquirer/figures'
import { renderBoolean } from 'src/renderers/common/boolean.js'
import type { BooleanField } from 'src/util/types.js'
import { describe, expect, it } from 'vitest'
import { bgGray, bold, underline } from 'yoctocolors'

describe('renderBoolean', () => {
    const baseField: BooleanField = {
        type: 'boolean',
        label: 'test',
    }

    describe('when field is not focused', () => {
        it('should render true as focused and false as unfocused when value is true', () => {
            const field = { ...baseField, value: true }
            const result = renderBoolean(field, false)

            expect(result).toBe(` ${figures.radioOn} ${bold(underline('true'))}  ${figures.radioOff} false `)
        })

        it('should render false as focused and true as unfocused when value is false', () => {
            const field = { ...baseField, value: false }
            const result = renderBoolean(field, false)

            expect(result).toBe(` ${figures.radioOff} true  ${figures.radioOn} ${bold(underline('false'))} `)
        })

        it('should render false as focused and true as unfocused when value is undefined', () => {
            const field = { ...baseField, value: undefined }
            const result = renderBoolean(field, false)

            expect(result).toBe(` ${figures.radioOff} true  ${figures.radioOn} ${bold(underline('false'))} `)
        })

        it('should render false as focused and true as unfocused when value is not provided', () => {
            const field = { ...baseField }
            const result = renderBoolean(field, false)

            expect(result).toBe(` ${figures.radioOff} true  ${figures.radioOn} ${bold(underline('false'))} `)
        })
    })

    describe('when field is focused', () => {
        it('should render with bgGray background when value is true', () => {
            const field = { ...baseField, value: true }
            const result = renderBoolean(field, true)
            const expectedContent = ` ${figures.radioOn} ${bold(underline('true'))}  ${figures.radioOff} false `
            const expected = bgGray(expectedContent)

            expect(result).toBe(expected)
        })

        it('should render with bgGray background when value is false', () => {
            const field = { ...baseField, value: false }
            const result = renderBoolean(field, true)
            const expectedContent = ` ${figures.radioOff} true  ${figures.radioOn} ${bold(underline('false'))} `
            const expected = bgGray(expectedContent)

            expect(result).toBe(expected)
        })

        it('should render with bgGray background when value is undefined', () => {
            const field = { ...baseField, value: undefined }
            const result = renderBoolean(field, true)
            const expectedContent = ` ${figures.radioOff} true  ${figures.radioOn} ${bold(underline('false'))} `
            const expected = bgGray(expectedContent)

            expect(result).toBe(expected)
        })

        it('should render with bgGray background when value is not provided', () => {
            const field = { ...baseField }
            const result = renderBoolean(field, true)
            const expectedContent = ` ${figures.radioOff} true  ${figures.radioOn} ${bold(underline('false'))} `
            const expected = bgGray(expectedContent)

            expect(result).toBe(expected)
        })
    })

    describe('formatting consistency', () => {
        it('should maintain consistent structure regardless of selection state', () => {
            const field = { ...baseField, value: true }
            const unfocusedResult = renderBoolean(field, false)
            const focusedResult = renderBoolean(field, true)

            // Both should have the same base content structure
            const expectedContent = ` ${figures.radioOn} ${bold(underline('true'))}  ${figures.radioOff} false `
            expect(unfocusedResult).toBe(expectedContent)
            expect(focusedResult).toBe(bgGray(expectedContent))
        })

        it('should apply formatting only to focused option text, not the icon', () => {
            const trueField = { ...baseField, value: true }
            const falseField = { ...baseField, value: false }

            const trueResult = renderBoolean(trueField, false)
            const falseResult = renderBoolean(falseField, false)

            // Bold/underline should only apply to the text, not the icon
            expect(trueResult).toBe(` ${figures.radioOn} ${bold(underline('true'))}  ${figures.radioOff} false `)
            expect(falseResult).toBe(` ${figures.radioOff} true  ${figures.radioOn} ${bold(underline('false'))} `)
        })

        it('should maintain consistent spacing between true and false options', () => {
            const field = { ...baseField, value: true }
            const result = renderBoolean(field, false)

            // Should have exactly two spaces between the end of 'true' and the start of the false icon
            expect(result).toBe(` ${figures.radioOn} ${bold(underline('true'))}  ${figures.radioOff} false `)
        })

        it('should always show both true and false options', () => {
            const trueField = { ...baseField, value: true }
            const falseField = { ...baseField, value: false }
            const undefinedField = { ...baseField, value: undefined }

            const trueResult = renderBoolean(trueField, false)
            const falseResult = renderBoolean(falseField, false)
            const undefinedResult = renderBoolean(undefinedField, false)

            // All results should contain both 'true' and 'false'
            expect(trueResult).toContain('true')
            expect(trueResult).toContain('false')
            expect(falseResult).toContain('true')
            expect(falseResult).toContain('false')
            expect(undefinedResult).toContain('true')
            expect(undefinedResult).toContain('false')
        })
    })

    describe('icon usage', () => {
        it('should use radioOn for focused option and radioOff for unfocused', () => {
            const trueField = { ...baseField, value: true }
            const falseField = { ...baseField, value: false }

            const trueResult = renderBoolean(trueField, false)
            const falseResult = renderBoolean(falseField, false)

            // When true is focused
            expect(trueResult).toContain(`${figures.radioOn} ${bold(underline('true'))}`)
            expect(trueResult).toContain(`${figures.radioOff} false`)

            // When false is focused
            expect(falseResult).toContain(`${figures.radioOff} true`)
            expect(falseResult).toContain(`${figures.radioOn} ${bold(underline('false'))}`)
        })

        it('should use radioOff for true and radioOn for false when no value is set', () => {
            const field = { ...baseField }
            const result = renderBoolean(field, false)

            expect(result).toContain(`${figures.radioOff} true`)
            expect(result).toContain(`${figures.radioOn} ${bold(underline('false'))}`)
        })
    })

    describe('text formatting', () => {
        it('should apply bold and underline only to focused option', () => {
            const trueField = { ...baseField, value: true }
            const result = renderBoolean(trueField, false)

            // Check the complete expected output
            expect(result).toBe(` ${figures.radioOn} ${bold(underline('true'))}  ${figures.radioOff} false `)
        })

        it('should not apply formatting to true when no option is explicitly focused', () => {
            const field = { ...baseField }
            const result = renderBoolean(field, false)

            // Check the complete expected output (undefined defaults to false)
            expect(result).toBe(` ${figures.radioOff} true  ${figures.radioOn} ${bold(underline('false'))} `)
        })
    })

    describe('background styling', () => {
        it('should apply bgGray white background when field is focused', () => {
            const field = { ...baseField, value: true }
            const focusedResult = renderBoolean(field, true)
            const unfocusedResult = renderBoolean(field, false)

            expect(focusedResult).toBe(bgGray(unfocusedResult))
        })

        it('should not apply background styling when field is not focused', () => {
            const field = { ...baseField, value: true }
            const result = renderBoolean(field, false)

            // Should not contain any background styling
            expect(result).not.toMatch(/\x1b\[47m/) // bgGray escape sequence
            expect(result).not.toMatch(/\x1b\[37m/) // white escape sequence
        })
    })

    describe('edge cases and field variations', () => {
        it('should handle field with additional properties', () => {
            const field: BooleanField = {
                type: 'boolean',
                label: 'complex field',
                description: 'A complex boolean field',
                value: true,
            }
            const result = renderBoolean(field, false)

            expect(result).toBe(` ${figures.radioOn} ${bold(underline('true'))}  ${figures.radioOff} false `)
        })

        it('should handle field with different name', () => {
            const field: BooleanField = {
                type: 'boolean',
                label: 'different name',
                value: false,
            }
            const result = renderBoolean(field, false)

            expect(result).toBe(` ${figures.radioOff} true  ${figures.radioOn} ${bold(underline('false'))} `)
        })

        it('should produce consistent results for equivalent fields', () => {
            const field1 = { ...baseField, value: true }
            const field2: BooleanField = {
                type: 'boolean',
                label: 'different',
                value: true,
            }

            const result1 = renderBoolean(field1, false)
            const result2 = renderBoolean(field2, false)

            // Results should be identical regardless of other field properties
            expect(result1).toBe(result2)
        })
    })

    describe('boolean value handling', () => {
        it('should treat falsy values correctly', () => {
            // Test explicit false
            const falseField = { ...baseField, value: false }
            const falseResult = renderBoolean(falseField, false)
            expect(falseResult).toBe(` ${figures.radioOff} true  ${figures.radioOn} ${bold(underline('false'))} `)

            // Test undefined (should be treated as false selection)
            const undefinedField = { ...baseField, value: undefined }
            const undefinedResult = renderBoolean(undefinedField, false)
            expect(undefinedResult).toBe(` ${figures.radioOff} true  ${figures.radioOn} ${bold(underline('false'))} `)
        })

        it('should treat truthy values correctly', () => {
            const trueField = { ...baseField, value: true }
            const result = renderBoolean(trueField, false)
            expect(result).toBe(` ${figures.radioOn} ${bold(underline('true'))}  ${figures.radioOff} false `)
        })
    })
})
