import figures from '@inquirer/figures'
import { describe, expect, it } from 'vitest'
import { bgGray, bold, underline, white } from 'yoctocolors'
import type { RadioField } from '../util/types.js'
import { renderRadio } from './radio.js'

describe('renderRadio', () => {
    const baseField: RadioField = {
        type: 'radio',
        label: 'test',
        choices: ['Option 1', 'Option 2', 'Option 3'],
    }

    describe('when field is not selected', () => {
        it('should render all choices with radioOff icons when no value is selected', () => {
            const field = { ...baseField }
            const result = renderRadio(field, false)

            expect(result).toBe(
                ` ${figures.radioOff} Option 1  ${figures.radioOff} Option 2  ${figures.radioOff} Option 3 `,
            )
        })

        it('should render selected choice with radioOn icon and others with radioOff', () => {
            const field = { ...baseField, value: 'Option 2' }
            const result = renderRadio(field, false)

            expect(result).toBe(
                ` ${figures.radioOff} Option 1  ${figures.radioOn} Option 2  ${figures.radioOff} Option 3 `,
            )
        })

        it('should render first choice as selected', () => {
            const field = { ...baseField, value: 'Option 1' }
            const result = renderRadio(field, false)

            expect(result).toBe(
                ` ${figures.radioOn} Option 1  ${figures.radioOff} Option 2  ${figures.radioOff} Option 3 `,
            )
        })

        it('should render last choice as selected', () => {
            const field = { ...baseField, value: 'Option 3' }
            const result = renderRadio(field, false)

            expect(result).toBe(
                ` ${figures.radioOff} Option 1  ${figures.radioOff} Option 2  ${figures.radioOn} Option 3 `,
            )
        })

        it('should handle empty choices array', () => {
            const field = { ...baseField, choices: [] }
            const result = renderRadio(field, false)

            expect(result).toBe('  ')
        })

        it('should handle single choice with no selection', () => {
            const field = { ...baseField, choices: ['Single Option'] }
            const result = renderRadio(field, false)

            expect(result).toBe(` ${figures.radioOff} Single Option `)
        })

        it('should handle single choice with selection', () => {
            const field = { ...baseField, choices: ['Single Option'], value: 'Single Option' }
            const result = renderRadio(field, false)

            expect(result).toBe(` ${figures.radioOn} Single Option `)
        })

        it('should handle value that does not match any choice', () => {
            const field = { ...baseField, value: 'Non-existent Option' }
            const result = renderRadio(field, false)

            expect(result).toBe(
                ` ${figures.radioOff} Option 1  ${figures.radioOff} Option 2  ${figures.radioOff} Option 3 `,
            )
        })

        it('should handle choices with special characters', () => {
            const field: RadioField = {
                type: 'radio',
                label: 'special',
                choices: ['Option with "quotes"', 'Option with émojis 🎉', 'Option with <tags>'],
                value: 'Option with émojis 🎉',
            }
            const result = renderRadio(field, false)

            expect(result).toBe(
                ` ${figures.radioOff} Option with "quotes"  ${figures.radioOn} Option with émojis 🎉  ${figures.radioOff} Option with <tags> `,
            )
        })

        it('should handle very long choice names', () => {
            const field: RadioField = {
                type: 'radio',
                label: 'long',
                choices: [
                    'Short',
                    'This is a very long option name that might wrap in some terminals but should be handled gracefully',
                ],
                value: 'Short',
            }
            const result = renderRadio(field, false)

            expect(result).toBe(
                ` ${figures.radioOn} Short  ${figures.radioOff} This is a very long option name that might wrap in some terminals but should be handled gracefully `,
            )
        })
    })

    describe('when field is selected', () => {
        it('should render with bgGray background when no value is selected', () => {
            const field = { ...baseField }
            const result = renderRadio(field, true)
            const expected = bgGray(
                white(` ${figures.radioOff} Option 1  ${figures.radioOff} Option 2  ${figures.radioOff} Option 3 `),
            )

            expect(result).toBe(expected)
        })

        it('should render selected choice with bold underline formatting and bgGray background', () => {
            const field = { ...baseField, value: 'Option 2' }
            const result = renderRadio(field, true)
            const expectedContent = ` ${figures.radioOff} Option 1  ${figures.radioOn} ${bold(underline('Option 2'))}  ${figures.radioOff} Option 3 `
            const expected = bgGray(expectedContent)

            expect(result).toBe(expected)
        })

        it('should render first choice as selected with formatting', () => {
            const field = { ...baseField, value: 'Option 1' }
            const result = renderRadio(field, true)
            const expectedContent = ` ${figures.radioOn} ${bold(underline('Option 1'))}  ${figures.radioOff} Option 2  ${figures.radioOff} Option 3 `
            const expected = bgGray(expectedContent)

            expect(result).toBe(expected)
        })

        it('should render last choice as selected with formatting', () => {
            const field = { ...baseField, value: 'Option 3' }
            const result = renderRadio(field, true)
            const expectedContent = ` ${figures.radioOff} Option 1  ${figures.radioOff} Option 2  ${figures.radioOn} ${bold(underline('Option 3'))} `
            const expected = bgGray(expectedContent)

            expect(result).toBe(expected)
        })

        it('should handle empty choices array with bgGray background', () => {
            const field = { ...baseField, choices: [] }
            const result = renderRadio(field, true)
            const expected = bgGray('  ')

            expect(result).toBe(expected)
        })

        it('should handle single choice with selection and formatting', () => {
            const field = { ...baseField, choices: ['Single Option'], value: 'Single Option' }
            const result = renderRadio(field, true)
            const expectedContent = ` ${figures.radioOn} ${bold(underline('Single Option'))} `
            const expected = bgGray(expectedContent)

            expect(result).toBe(expected)
        })

        it('should handle single choice without selection', () => {
            const field = { ...baseField, choices: ['Single Option'] }
            const result = renderRadio(field, true)
            const expected = bgGray(` ${figures.radioOff} Single Option `)

            expect(result).toBe(expected)
        })

        it('should handle value that does not match any choice', () => {
            const field = { ...baseField, value: 'Non-existent Option' }
            const result = renderRadio(field, true)
            const expected = bgGray(
                white(` ${figures.radioOff} Option 1  ${figures.radioOff} Option 2  ${figures.radioOff} Option 3 `),
            )

            expect(result).toBe(expected)
        })

        it('should format selected choice with special characters', () => {
            const field: RadioField = {
                type: 'radio',
                label: 'special',
                choices: ['Option with "quotes"', 'Option with émojis 🎉', 'Option with <tags>'],
                value: 'Option with émojis 🎉',
            }
            const result = renderRadio(field, true)
            const expectedContent = ` ${figures.radioOff} Option with "quotes"  ${figures.radioOn} ${bold(underline('Option with émojis 🎉'))}  ${figures.radioOff} Option with <tags> `
            const expected = bgGray(expectedContent)

            expect(result).toBe(expected)
        })

        it('should handle multiple choices with same radioOn icon for selected', () => {
            const field: RadioField = {
                type: 'radio',
                label: 'multi',
                choices: ['A', 'B', 'C', 'D', 'E'],
                value: 'C',
            }
            const result = renderRadio(field, true)
            const expectedContent = ` ${figures.radioOff} A  ${figures.radioOff} B  ${figures.radioOn} ${bold(underline('C'))}  ${figures.radioOff} D  ${figures.radioOff} E `
            const expected = bgGray(expectedContent)

            expect(result).toBe(expected)
        })
    })

    describe('formatting consistency', () => {
        it('should maintain consistent spacing between choices', () => {
            const field = { ...baseField, choices: ['A', 'B'] }
            const unselectedResult = renderRadio(field, false)
            const selectedResult = renderRadio(field, true)

            // Both should have the same base structure with consistent spacing
            expect(unselectedResult).toBe(` ${figures.radioOff} A  ${figures.radioOff} B `)
            expect(selectedResult).toBe(bgGray(` ${figures.radioOff} A  ${figures.radioOff} B `))
        })

        it('should apply formatting only to selected choice text, not the icon', () => {
            const field = { ...baseField, value: 'Option 1' }
            const result = renderRadio(field, true)

            // The bold/underline should only apply to the text, not the icon
            const expectedContent = ` ${figures.radioOn} ${bold(underline('Option 1'))}  ${figures.radioOff} Option 2  ${figures.radioOff} Option 3 `
            const expected = bgGray(expectedContent)

            expect(result).toBe(expected)
        })

        it('should handle case sensitivity in value matching', () => {
            const field = { ...baseField, choices: ['Option 1', 'option 1'], value: 'option 1' }
            const result = renderRadio(field, false)

            expect(result).toBe(` ${figures.radioOff} Option 1  ${figures.radioOn} option 1 `)
        })

        it('should handle whitespace in choices and values', () => {
            const field: RadioField = {
                type: 'radio',
                label: 'whitespace',
                choices: [' Leading space', 'Trailing space ', '  Both spaces  '],
                value: 'Trailing space ',
            }
            const result = renderRadio(field, false)

            expect(result).toBe(
                ` ${figures.radioOff}  Leading space  ${figures.radioOn} Trailing space   ${figures.radioOff}   Both spaces   `,
            )
        })
    })

    describe('edge cases', () => {
        it('should handle undefined value gracefully', () => {
            const field: RadioField = {
                type: 'radio',
                label: 'test',
                choices: ['Option 1', 'Option 2'],
                value: undefined,
            }
            const result = renderRadio(field, false)

            expect(result).toBe(` ${figures.radioOff} Option 1  ${figures.radioOff} Option 2 `)
        })

        it('should handle empty string value', () => {
            const field = { ...baseField, value: '' }
            const result = renderRadio(field, false)

            expect(result).toBe(
                ` ${figures.radioOff} Option 1  ${figures.radioOff} Option 2  ${figures.radioOff} Option 3 `,
            )
        })

        it('should handle choices with empty strings', () => {
            const field: RadioField = {
                type: 'radio',
                label: 'empty',
                choices: ['', 'Option 2', ''],
                value: '',
            }
            const result = renderRadio(field, false)

            expect(result).toBe(` ${figures.radioOn}   ${figures.radioOff} Option 2  ${figures.radioOn}  `)
        })

        it('should handle numeric-like strings in choices', () => {
            const field: RadioField = {
                type: 'radio',
                label: 'numbers',
                choices: ['1', '2', '3'],
                value: '2',
            }
            const result = renderRadio(field, false)

            expect(result).toBe(` ${figures.radioOff} 1  ${figures.radioOn} 2  ${figures.radioOff} 3 `)
        })
    })
})
