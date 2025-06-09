/* eslint-disable no-regex-spaces */
/* eslint-disable no-control-regex */

import figures from '@inquirer/figures'
import { describe, expect, it } from 'vitest'
import { bgGray, bold, underline, white } from 'yoctocolors'
import type { InternalCheckboxField } from '../util/types.js'
import { renderCheckbox } from './checkbox.js'

describe('renderCheckbox', () => {
    const baseField: InternalCheckboxField = {
        type: 'checkbox',
        label: 'test',
        choices: ['Option 1', 'Option 2', 'Option 3'],
        value: [],
        highlightIndex: 0,
    }

    describe('when field is not selected', () => {
        it('should render all choices with checkboxOff icons when none are selected', () => {
            const field = { ...baseField }
            const result = renderCheckbox(field, false)

            expect(result).toBe(
                ` ${figures.checkboxOff} Option 1  ${figures.checkboxOff} Option 2  ${figures.checkboxOff} Option 3 `,
            )
        })

        it('should render selected choices with tick icons', () => {
            const field = { ...baseField, value: ['Option 1', 'Option 3'] }
            const result = renderCheckbox(field, false)

            expect(result).toBe(` ${figures.tick} Option 1  ${figures.checkboxOff} Option 2  ${figures.tick} Option 3 `)
        })

        it('should render all choices with tick icons when all are selected', () => {
            const field = { ...baseField, value: ['Option 1', 'Option 2', 'Option 3'] }
            const result = renderCheckbox(field, false)

            expect(result).toBe(` ${figures.tick} Option 1  ${figures.tick} Option 2  ${figures.tick} Option 3 `)
        })

        it('should handle empty choices array', () => {
            const field = { ...baseField, choices: [] }
            const result = renderCheckbox(field, false)

            expect(result).toBe('  ')
        })

        it('should handle single choice', () => {
            const field = { ...baseField, choices: ['Single Option'], value: [] }
            const result = renderCheckbox(field, false)

            expect(result).toBe(` ${figures.checkboxOff} Single Option `)
        })

        it('should handle single selected choice', () => {
            const field = { ...baseField, choices: ['Single Option'], value: ['Single Option'] }
            const result = renderCheckbox(field, false)

            expect(result).toBe(` ${figures.tick} Single Option `)
        })
    })

    describe('when field is selected', () => {
        it('should apply background formatting to the entire result', () => {
            const field = { ...baseField }
            const result = renderCheckbox(field, true)
            const expected = bgGray(
                white(
                    ` ${underline(bold(`${figures.checkboxOff} Option 1`))}  ${figures.checkboxOff} Option 2  ${figures.checkboxOff} Option 3 `,
                ),
            )

            expect(result).toBe(expected)
        })

        it('should highlight the first choice by default (highlightIndex: 0)', () => {
            const field = { ...baseField, highlightIndex: 0 }
            const result = renderCheckbox(field, true)
            const expectedContent = ` ${underline(bold(`${figures.checkboxOff} Option 1`))}  ${figures.checkboxOff} Option 2  ${figures.checkboxOff} Option 3 `
            const expected = bgGray(white(expectedContent))

            expect(result).toBe(expected)
        })

        it('should highlight the second choice when highlightIndex is 1', () => {
            const field = { ...baseField, highlightIndex: 1 }
            const result = renderCheckbox(field, true)
            const expectedContent = ` ${figures.checkboxOff} Option 1  ${underline(bold(`${figures.checkboxOff} Option 2`))}  ${figures.checkboxOff} Option 3 `
            const expected = bgGray(white(expectedContent))

            expect(result).toBe(expected)
        })

        it('should highlight the last choice when highlightIndex is at the end', () => {
            const field = { ...baseField, highlightIndex: 2 }
            const result = renderCheckbox(field, true)
            const expectedContent = ` ${figures.checkboxOff} Option 1  ${figures.checkboxOff} Option 2  ${underline(bold(`${figures.checkboxOff} Option 3`))} `
            const expected = bgGray(white(expectedContent))

            expect(result).toBe(expected)
        })

        it('should highlight selected choices with tick icons', () => {
            const field = { ...baseField, value: ['Option 1'], highlightIndex: 0 }
            const result = renderCheckbox(field, true)
            const expectedContent = ` ${underline(bold(`${figures.tick} Option 1`))}  ${figures.checkboxOff} Option 2  ${figures.checkboxOff} Option 3 `
            const expected = bgGray(white(expectedContent))

            expect(result).toBe(expected)
        })

        it('should highlight non-selected choices with checkboxOff icons', () => {
            const field = { ...baseField, value: ['Option 2'], highlightIndex: 0 }
            const result = renderCheckbox(field, true)
            const expectedContent = ` ${underline(bold(`${figures.checkboxOff} Option 1`))}  ${figures.tick} Option 2  ${figures.checkboxOff} Option 3 `
            const expected = bgGray(white(expectedContent))

            expect(result).toBe(expected)
        })

        it('should handle multiple selected choices with highlighting', () => {
            const field = { ...baseField, value: ['Option 1', 'Option 3'], highlightIndex: 1 }
            const result = renderCheckbox(field, true)
            const expectedContent = ` ${figures.tick} Option 1  ${underline(bold(`${figures.checkboxOff} Option 2`))}  ${figures.tick} Option 3 `
            const expected = bgGray(white(expectedContent))

            expect(result).toBe(expected)
        })

        it('should handle highlighting when all choices are selected', () => {
            const field = { ...baseField, value: ['Option 1', 'Option 2', 'Option 3'], highlightIndex: 1 }
            const result = renderCheckbox(field, true)
            const expectedContent = ` ${figures.tick} Option 1  ${underline(bold(`${figures.tick} Option 2`))}  ${figures.tick} Option 3 `
            const expected = bgGray(white(expectedContent))

            expect(result).toBe(expected)
        })

        it('should handle highlighting when highlighted choice is selected', () => {
            const field = { ...baseField, value: ['Option 2'], highlightIndex: 1 }
            const result = renderCheckbox(field, true)
            const expectedContent = ` ${figures.checkboxOff} Option 1  ${underline(bold(`${figures.tick} Option 2`))}  ${figures.checkboxOff} Option 3 `
            const expected = bgGray(white(expectedContent))

            expect(result).toBe(expected)
        })

        it('should default to highlightIndex 0 when not provided', () => {
            const field = { ...baseField }
            // delete field.highlightIndex
            const result = renderCheckbox(field, true)
            const expectedContent = ` ${underline(bold(`${figures.checkboxOff} Option 1`))}  ${figures.checkboxOff} Option 2  ${figures.checkboxOff} Option 3 `
            const expected = bgGray(white(expectedContent))

            expect(result).toBe(expected)
        })

        it('should handle empty choices array when selected', () => {
            const field = { ...baseField, choices: [] }
            const result = renderCheckbox(field, true)
            const expected = bgGray(white('  '))

            expect(result).toBe(expected)
        })

        it('should handle single choice when selected and highlighted', () => {
            const field = { ...baseField, choices: ['Single Option'], value: [], highlightIndex: 0 }
            const result = renderCheckbox(field, true)
            const expectedContent = ` ${underline(bold(`${figures.checkboxOff} Single Option`))} `
            const expected = bgGray(white(expectedContent))

            expect(result).toBe(expected)
        })

        it('should handle single selected choice when highlighted', () => {
            const field = { ...baseField, choices: ['Single Option'], value: ['Single Option'], highlightIndex: 0 }
            const result = renderCheckbox(field, true)
            const expectedContent = ` ${underline(bold(`${figures.tick} Single Option`))} `
            const expected = bgGray(white(expectedContent))

            expect(result).toBe(expected)
        })
    })

    describe('edge cases', () => {
        it('should handle choices with special characters', () => {
            const field = {
                ...baseField,
                choices: ['Option & Ampersand', 'Option "Quotes"', 'Option <Tags>'],
                value: ['Option & Ampersand'],
            }
            const result = renderCheckbox(field, false)

            expect(result).toBe(
                ` ${figures.tick} Option & Ampersand  ${figures.checkboxOff} Option "Quotes"  ${figures.checkboxOff} Option <Tags> `,
            )
        })

        it('should handle very long choice names', () => {
            const longChoice = 'This is a very long choice name that might wrap or cause display issues'
            const field = {
                ...baseField,
                choices: [longChoice, 'Short'],
                value: [longChoice],
            }
            const result = renderCheckbox(field, false)

            expect(result).toBe(` ${figures.tick} ${longChoice}  ${figures.checkboxOff} Short `)
        })

        it('should handle choices with whitespace', () => {
            const field = {
                ...baseField,
                choices: ['  Leading spaces', 'Trailing spaces  ', '  Both sides  '],
                value: ['  Leading spaces'],
            }
            const result = renderCheckbox(field, false)

            expect(result).toBe(
                ` ${figures.tick}   Leading spaces  ${figures.checkboxOff} Trailing spaces    ${figures.checkboxOff}   Both sides   `,
            )
        })

        it('should handle empty string choices', () => {
            const field = {
                ...baseField,
                choices: ['', 'Non-empty'],
                value: [''],
            }
            const result = renderCheckbox(field, false)

            expect(result).toBe(` ${figures.tick}   ${figures.checkboxOff} Non-empty `)
        })

        it('should handle highlightIndex out of bounds (negative)', () => {
            const field = { ...baseField, highlightIndex: -1 }
            const result = renderCheckbox(field, true)
            // Should not highlight anything since index is out of bounds
            const expectedContent = ` ${figures.checkboxOff} Option 1  ${figures.checkboxOff} Option 2  ${figures.checkboxOff} Option 3 `
            const expected = bgGray(white(expectedContent))

            expect(result).toBe(expected)
        })

        it('should handle highlightIndex out of bounds (too high)', () => {
            const field = { ...baseField, highlightIndex: 10 }
            const result = renderCheckbox(field, true)
            // Should not highlight anything since index is out of bounds
            const expectedContent = ` ${figures.checkboxOff} Option 1  ${figures.checkboxOff} Option 2  ${figures.checkboxOff} Option 3 `
            const expected = bgGray(white(expectedContent))

            expect(result).toBe(expected)
        })

        it('should handle value array with non-existent choices', () => {
            const field = {
                ...baseField,
                value: ['Option 1', 'Non-existent Option', 'Option 3'],
            }
            const result = renderCheckbox(field, false)
            // Should only show ticks for choices that actually exist
            expect(result).toBe(` ${figures.tick} Option 1  ${figures.checkboxOff} Option 2  ${figures.tick} Option 3 `)
        })

        it('should handle duplicate choices', () => {
            const field = {
                ...baseField,
                choices: ['Option 1', 'Option 1', 'Option 2'],
                value: ['Option 1'],
            }
            const result = renderCheckbox(field, false)
            // Both instances of "Option 1" should be checked
            expect(result).toBe(` ${figures.tick} Option 1  ${figures.tick} Option 1  ${figures.checkboxOff} Option 2 `)
        })

        it('should handle Unicode characters in choices', () => {
            const field = {
                ...baseField,
                choices: ['🚀 Rocket', '🎯 Target', '💡 Idea'],
                value: ['🚀 Rocket'],
            }
            const result = renderCheckbox(field, false)

            expect(result).toBe(
                ` ${figures.tick} 🚀 Rocket  ${figures.checkboxOff} 🎯 Target  ${figures.checkboxOff} 💡 Idea `,
            )
        })
    })

    describe('rendering consistency', () => {
        it('should maintain consistent spacing between choices', () => {
            const field = { ...baseField, value: ['Option 2'] }
            const result = renderCheckbox(field, false)

            // Should have exactly 2 spaces between each choice
            expect(result).toMatch(/Option 1  .*Option 2  .*Option 3/)
        })

        it('should maintain consistent spacing when field is selected', () => {
            const field = { ...baseField, value: ['Option 2'], highlightIndex: 1 }
            const result = renderCheckbox(field, true)

            // Should still have consistent spacing even with highlighting
            const unformatted = result.replace(/\u001b\[[0-9;]*m/g, '') // Remove ANSI codes
            expect(unformatted).toMatch(/Option 1  .*Option 2  .*Option 3/)
        })

        it('should wrap result with single spaces', () => {
            const field = { ...baseField }
            const result = renderCheckbox(field, false)

            expect(result.startsWith(' ')).toBe(true)
            expect(result.endsWith(' ')).toBe(true)
        })

        it('should wrap result with single spaces when field is selected', () => {
            const field = { ...baseField }
            const result = renderCheckbox(field, true)

            // Remove color formatting to check the actual content structure
            const unformatted = result.replace(/\u001b\[[0-9;]*m/g, '')
            expect(unformatted.startsWith(' ')).toBe(true)
            expect(unformatted.endsWith(' ')).toBe(true)
        })
    })
})
