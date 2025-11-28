import { Separator } from '@inquirer/core'
import { toLabelTop } from 'src/renderers/labelTop/toLabelTop.js'
import type { BooleanField, InternalCheckboxField, InternalFormField, RadioField, TextField } from 'src/util/types.js'
import { describe, expect, it, vi } from 'vitest'

// Mock the fieldToLabelTop function
vi.mock('src/renderers/labelTop/fieldToLabelTop.js', () => ({
    fieldToLabelTop: vi.fn(
        ({ field, isFocused, dense }: { field: InternalFormField; isFocused: boolean; dense?: boolean }) => {
            const focusIndicator = isFocused ? '[FOCUSED]' : '[UNFOCUSED]'
            const denseIndicator = dense ? '[DENSE]' : '[NORMAL]'
            return `${focusIndicator}${denseIndicator} ${field.label}: ${field.type}`
        },
    ),
}))

describe('toLabelTop', () => {
    const textField1: TextField = {
        type: 'text',
        label: 'First Name',
        value: 'John',
    }

    const textField2: TextField = {
        type: 'text',
        label: 'Last Name',
        value: 'Doe',
    }

    const booleanField: BooleanField = {
        type: 'boolean',
        label: 'Subscribe to newsletter',
        value: true,
    }

    const radioField: RadioField = {
        type: 'radio',
        label: 'Preferred contact',
        choices: ['Email', 'Phone', 'SMS'],
        value: 'Email',
    }

    const checkboxField: InternalCheckboxField = {
        type: 'checkbox',
        label: 'Interests',
        choices: ['Sports', 'Music', 'Travel'],
        value: ['Sports', 'Music'],
        highlightIndex: 0,
    }

    describe('Basic functionality', () => {
        it('should render a single field correctly', () => {
            const fields = [textField1]
            const focusedIndex = 0

            const result = toLabelTop(fields, focusedIndex)

            expect(result).toMatchInlineSnapshot(`"[FOCUSED][NORMAL] First Name: text"`)
        })

        it('should render multiple fields with correct focus state', () => {
            const fields = [textField1, textField2, booleanField]
            const focusedIndex = 1

            const result = toLabelTop(fields, focusedIndex)

            expect(result).toMatchInlineSnapshot(
                `
              "[UNFOCUSED][NORMAL] First Name: text

              [FOCUSED][NORMAL] Last Name: text

              [UNFOCUSED][NORMAL] Subscribe to newsletter: boolean"
            `,
            )
        })

        it('should handle empty fields array', () => {
            const fields: InternalFormField[] = []
            const focusedIndex = 0

            const result = toLabelTop(fields, focusedIndex)

            expect(result).toBe('')
        })

        it('should handle focusedIndex out of bounds', () => {
            const fields = [textField1, textField2]
            const focusedIndex = 5

            const result = toLabelTop(fields, focusedIndex)

            expect(result).toMatchInlineSnapshot(
                `
              "[UNFOCUSED][NORMAL] First Name: text

              [UNFOCUSED][NORMAL] Last Name: text"
            `,
            )
        })

        it('should handle negative focusedIndex', () => {
            const fields = [textField1, textField2]
            const focusedIndex = -1

            const result = toLabelTop(fields, focusedIndex)

            expect(result).toMatchInlineSnapshot(
                `
              "[UNFOCUSED][NORMAL] First Name: text

              [UNFOCUSED][NORMAL] Last Name: text"
            `,
            )
        })
    })

    describe('Field types', () => {
        it('should render text fields correctly', () => {
            const fields = [textField1]
            const focusedIndex = 0

            const result = toLabelTop(fields, focusedIndex)

            expect(result).toMatchInlineSnapshot(`"[FOCUSED][NORMAL] First Name: text"`)
        })

        it('should render boolean fields correctly', () => {
            const fields = [booleanField]
            const focusedIndex = 0

            const result = toLabelTop(fields, focusedIndex)

            expect(result).toMatchInlineSnapshot(`"[FOCUSED][NORMAL] Subscribe to newsletter: boolean"`)
        })

        it('should render radio fields correctly', () => {
            const fields = [radioField]
            const focusedIndex = 0

            const result = toLabelTop(fields, focusedIndex)

            expect(result).toMatchInlineSnapshot(`"[FOCUSED][NORMAL] Preferred contact: radio"`)
        })

        it('should render checkbox fields correctly', () => {
            const fields = [checkboxField]
            const focusedIndex = 0

            const result = toLabelTop(fields, focusedIndex)

            expect(result).toMatchInlineSnapshot(`"[FOCUSED][NORMAL] Interests: checkbox"`)
        })

        it('should render mixed field types correctly', () => {
            const fields = [textField1, booleanField, radioField, checkboxField]
            const focusedIndex = 2

            const result = toLabelTop(fields, focusedIndex)

            expect(result).toMatchInlineSnapshot(
                `
              "[UNFOCUSED][NORMAL] First Name: text

              [UNFOCUSED][NORMAL] Subscribe to newsletter: boolean

              [FOCUSED][NORMAL] Preferred contact: radio

              [UNFOCUSED][NORMAL] Interests: checkbox"
            `,
            )
        })
    })

    describe('Separators', () => {
        it('should render a single separator correctly', () => {
            const separator = new Separator('--- Personal Info ---')
            const fields = [separator]
            const focusedIndex = 0

            const result = toLabelTop(fields, focusedIndex)

            expect(result).toMatchInlineSnapshot(`
              "
--- Personal Info ---
"
            `)
        })

        it('should render fields with separators correctly', () => {
            const separator1 = new Separator('--- Personal Info ---')
            const separator2 = new Separator('--- Preferences ---')
            const fields = [separator1, textField1, textField2, separator2, booleanField]
            const focusedIndex = 1

            const result = toLabelTop(fields, focusedIndex)

            expect(result).toMatchInlineSnapshot(
                `
              "
              --- Personal Info ---

              [FOCUSED][NORMAL] First Name: text

              [UNFOCUSED][NORMAL] Last Name: text

              --- Preferences ---

              [UNFOCUSED][NORMAL] Subscribe to newsletter: boolean"
            `,
            )
        })

        it('should handle multiple consecutive separators', () => {
            const separator1 = new Separator('--- Section 1 ---')
            const separator2 = new Separator('--- Section 2 ---')
            const separator3 = new Separator('--- Section 3 ---')
            const fields = [separator1, separator2, separator3, textField1]
            const focusedIndex = 3

            const result = toLabelTop(fields, focusedIndex)

            expect(result).toMatchInlineSnapshot(
                `
              "
              --- Section 1 ---


              --- Section 2 ---


              --- Section 3 ---

              [FOCUSED][NORMAL] First Name: text"
            `,
            )
        })

        it('should handle separator at the end', () => {
            const separator = new Separator('--- End ---')
            const fields = [textField1, separator]
            const focusedIndex = 0

            const result = toLabelTop(fields, focusedIndex)

            expect(result).toMatchInlineSnapshot(`
              "[FOCUSED][NORMAL] First Name: text

--- End ---
"
            `)
        })

        it('should handle only separators', () => {
            const separator1 = new Separator('--- Section 1 ---')
            const separator2 = new Separator('--- Section 2 ---')
            const fields = [separator1, separator2]
            const focusedIndex = 0

            const result = toLabelTop(fields, focusedIndex)

            expect(result).toMatchInlineSnapshot(`
              "
--- Section 1 ---


--- Section 2 ---
"
            `)
        })

        it('should handle separators with empty string', () => {
            const separator = new Separator('')
            const fields = [textField1, separator, textField2]
            const focusedIndex = 0

            const result = toLabelTop(fields, focusedIndex)

            expect(result).toMatchInlineSnapshot(`
              "[FOCUSED][NORMAL] First Name: text

              ──────────────

              [UNFOCUSED][NORMAL] Last Name: text"
            `)
        })
    })

    describe('Dense mode', () => {
        it('should render fields in dense mode correctly', () => {
            const fields = [textField1, textField2]
            const focusedIndex = 0
            const dense = true

            const result = toLabelTop(fields, focusedIndex, dense)

            expect(result).toMatchInlineSnapshot(
                `
              "[FOCUSED][DENSE] First Name: text
              [UNFOCUSED][DENSE] Last Name: text"
            `,
            )
        })

        it('should render fields with separators in dense mode', () => {
            const separator = new Separator('--- Personal Info ---')
            const fields = [separator, textField1, textField2]
            const focusedIndex = 1
            const dense = true

            const result = toLabelTop(fields, focusedIndex, dense)

            expect(result).toMatchInlineSnapshot(
                `
              "
              --- Personal Info ---
              [FOCUSED][DENSE] First Name: text
              [UNFOCUSED][DENSE] Last Name: text"
            `,
            )
        })

        it('should use normal spacing when dense is false', () => {
            const fields = [textField1, textField2]
            const focusedIndex = 0
            const dense = false

            const result = toLabelTop(fields, focusedIndex, dense)

            expect(result).toMatchInlineSnapshot(
                `
              "[FOCUSED][NORMAL] First Name: text

              [UNFOCUSED][NORMAL] Last Name: text"
            `,
            )
        })

        it('should use normal spacing when dense is undefined', () => {
            const fields = [textField1, textField2]
            const focusedIndex = 0

            const result = toLabelTop(fields, focusedIndex)

            expect(result).toMatchInlineSnapshot(
                `
              "[FOCUSED][NORMAL] First Name: text

              [UNFOCUSED][NORMAL] Last Name: text"
            `,
            )
        })
    })

    describe('Complex scenarios', () => {
        it('should render a complex form with all field types and separators', () => {
            const personalSeparator = new Separator('--- Personal Information ---')
            const preferencesSeparator = new Separator('--- Preferences ---')
            const contactSeparator = new Separator('--- Contact ---')

            const fields = [
                personalSeparator,
                textField1,
                textField2,
                preferencesSeparator,
                booleanField,
                radioField,
                contactSeparator,
                checkboxField,
            ]
            const focusedIndex = 4

            const result = toLabelTop(fields, focusedIndex)

            expect(result).toMatchInlineSnapshot(
                `
              "
              --- Personal Information ---

              [UNFOCUSED][NORMAL] First Name: text

              [UNFOCUSED][NORMAL] Last Name: text

              --- Preferences ---

              [FOCUSED][NORMAL] Subscribe to newsletter: boolean

              [UNFOCUSED][NORMAL] Preferred contact: radio

              --- Contact ---

              [UNFOCUSED][NORMAL] Interests: checkbox"
            `,
            )
        })

        it('should handle form starting with fields before separators', () => {
            const separator = new Separator('--- Additional Info ---')
            const fields = [textField1, booleanField, separator, radioField]
            const focusedIndex = 1
            const result = toLabelTop(fields, focusedIndex)

            expect(result).toMatchInlineSnapshot(
                `
              "[UNFOCUSED][NORMAL] First Name: text

              [FOCUSED][NORMAL] Subscribe to newsletter: boolean

              --- Additional Info ---

              [UNFOCUSED][NORMAL] Preferred contact: radio"
            `,
            )
        })

        it('should handle empty sections between separators', () => {
            const separator1 = new Separator('--- Section 1 ---')
            const separator2 = new Separator('--- Empty Section ---')
            const separator3 = new Separator('--- Section 3 ---')
            const fields = [separator1, textField1, separator2, separator3, textField2]
            const focusedIndex = 4

            const result = toLabelTop(fields, focusedIndex)

            expect(result).toMatchInlineSnapshot(
                `
              "
              --- Section 1 ---

              [UNFOCUSED][NORMAL] First Name: text

              --- Empty Section ---


              --- Section 3 ---

              [FOCUSED][NORMAL] Last Name: text"
            `,
            )
        })

        it('should maintain proper spacing in dense mode with complex layout', () => {
            const separator1 = new Separator('--- Personal ---')
            const separator2 = new Separator('--- Settings ---')
            const fields = [separator1, textField1, textField2, separator2, booleanField]
            const focusedIndex = 2
            const dense = true

            const result = toLabelTop(fields, focusedIndex, dense)

            expect(result).toMatchInlineSnapshot(
                `
              "
              --- Personal ---
              [UNFOCUSED][DENSE] First Name: text
              [FOCUSED][DENSE] Last Name: text

              --- Settings ---
              [UNFOCUSED][DENSE] Subscribe to newsletter: boolean"
            `,
            )
        })
    })

    describe('Edge cases', () => {
        it('should handle fields with special characters in labels', () => {
            const specialField: TextField = {
                type: 'text',
                label: 'Field with "quotes" & symbols!',
                value: 'test',
            }
            const fields = [specialField]
            const focusedIndex = 0

            const result = toLabelTop(fields, focusedIndex)

            expect(result).toMatchInlineSnapshot(`"[FOCUSED][NORMAL] Field with "quotes" & symbols!: text"`)
        })

        it('should handle separators with special characters', () => {
            const separator = new Separator('=== Special: Chars & "Quotes" ===')
            const fields = [separator, textField1]
            const focusedIndex = 1

            const result = toLabelTop(fields, focusedIndex)

            expect(result).toMatchInlineSnapshot(
                `
              "
              === Special: Chars & "Quotes" ===

              [FOCUSED][NORMAL] First Name: text"
            `,
            )
        })

        it('should handle very long field labels', () => {
            const longField: TextField = {
                type: 'text',
                label: 'This is a very long field label that might cause layout issues in some contexts but should be handled gracefully',
                value: 'test',
            }
            const fields = [longField]
            const focusedIndex = 0

            const result = toLabelTop(fields, focusedIndex)

            expect(result).toMatchInlineSnapshot(
                `"[FOCUSED][NORMAL] This is a very long field label that might cause layout issues in some contexts but should be handled gracefully: text"`,
            )
        })

        it('should handle field selection at boundary indices', () => {
            const fields = [textField1, textField2, booleanField]

            // Test first field
            let result = toLabelTop(fields, 0)
            expect(result).toContain('[FOCUSED][NORMAL] First Name: text')

            // Test last field
            result = toLabelTop(fields, 2)
            expect(result).toContain('[FOCUSED][NORMAL] Subscribe to newsletter: boolean')
        })
    })

    describe('Sectioning behavior', () => {
        it('should properly group fields within sections', () => {
            const separator1 = new Separator('--- Section A ---')
            const separator2 = new Separator('--- Section B ---')
            const fields = [separator1, textField1, textField2, separator2, booleanField, radioField]
            const focusedIndex = 4

            const result = toLabelTop(fields, focusedIndex)

            // Fields in the same section should be joined with normal row spacing
            // Different sections should be separated by section spacing
            expect(result).toMatchInlineSnapshot(
                `
              "
              --- Section A ---

              [UNFOCUSED][NORMAL] First Name: text

              [UNFOCUSED][NORMAL] Last Name: text

              --- Section B ---

              [FOCUSED][NORMAL] Subscribe to newsletter: boolean

              [UNFOCUSED][NORMAL] Preferred contact: radio"
            `,
            )
        })

        it('should handle single field sections', () => {
            const separator1 = new Separator('--- Single Field Section ---')
            const separator2 = new Separator('--- Another Section ---')
            const fields = [separator1, textField1, separator2, booleanField]
            const focusedIndex = 1

            const result = toLabelTop(fields, focusedIndex)

            expect(result).toMatchInlineSnapshot(
                `
              "
              --- Single Field Section ---

              [FOCUSED][NORMAL] First Name: text

              --- Another Section ---

              [UNFOCUSED][NORMAL] Subscribe to newsletter: boolean"
            `,
            )
        })
    })
})
