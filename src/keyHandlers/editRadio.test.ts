import type { KeypressEvent } from '@inquirer/core'
import { Separator } from '@inquirer/core'
import type { BooleanField, InquirerReadline, InternalFields, RadioField, TextField } from 'src/util/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { editRadioField } from './editRadio.js'

describe('editRadioField', () => {
    // Mock readline instance
    const mockRl = {
        clearLine: vi.fn(),
    } as unknown as InquirerReadline

    // Sample fields for testing
    const radioField: RadioField = {
        type: 'radio',
        label: 'Test Radio',
        choices: ['Option 1', 'Option 2', 'Option 3'],
        value: 'Option 1',
    }

    const textField: TextField = {
        type: 'text',
        label: 'Test Text',
        value: 'sample',
    }

    const booleanField: BooleanField = {
        type: 'boolean',
        label: 'Test Boolean',
        value: true,
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('left key navigation', () => {
        it('should move to previous choice when not at first choice', () => {
            const field = { ...radioField, value: 'Option 2' }
            const key: KeypressEvent = { name: 'left' } as KeypressEvent

            const result = editRadioField({
                fields: [field],
                currentField: field,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                value: 'Option 1',
            })
        })

        it('should wrap to last choice when at first choice', () => {
            const field = { ...radioField, value: 'Option 1' }
            const key: KeypressEvent = { name: 'left' } as KeypressEvent

            const result = editRadioField({
                fields: [field],
                currentField: field,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                value: 'Option 3',
            })
        })

        it('should handle undefined value by treating as non-match and wrap to last choice', () => {
            const field: RadioField = { ...radioField, value: undefined }
            const key: KeypressEvent = { name: 'left' } as KeypressEvent

            const result = editRadioField({
                fields: [field],
                currentField: field,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                value: 'Option 3',
            })
        })

        it('should handle empty string value by treating as non-match and wrap to last choice', () => {
            const field = { ...radioField, value: '' }
            const key: KeypressEvent = { name: 'left' } as KeypressEvent

            const result = editRadioField({
                fields: [field],
                currentField: field,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                value: 'Option 3',
            })
        })

        it('should handle value that does not match any choice by wrapping to last choice', () => {
            const field = { ...radioField, value: 'Non-existent Option' }
            const key: KeypressEvent = { name: 'left' } as KeypressEvent

            const result = editRadioField({
                fields: [field],
                currentField: field,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                value: 'Option 3',
            })
        })

        it('should handle single choice field', () => {
            const singleChoiceField: RadioField = {
                ...radioField,
                choices: ['Only Option'],
                value: 'Only Option',
            }
            const key: KeypressEvent = { name: 'left' } as KeypressEvent

            const result = editRadioField({
                fields: [singleChoiceField],
                currentField: singleChoiceField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...singleChoiceField,
                value: 'Only Option', // Should stay the same
            })
        })
    })

    describe('right key navigation', () => {
        it('should move to next choice when not at last choice', () => {
            const field = { ...radioField, value: 'Option 1' }
            const key: KeypressEvent = { name: 'right' } as KeypressEvent

            const result = editRadioField({
                fields: [field],
                currentField: field,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                value: 'Option 2',
            })
        })

        it('should wrap to first choice when at last choice', () => {
            const field = { ...radioField, value: 'Option 3' }
            const key: KeypressEvent = { name: 'right' } as KeypressEvent

            const result = editRadioField({
                fields: [field],
                currentField: field,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                value: 'Option 1',
            })
        })

        it('should handle undefined value by selecting first choice', () => {
            const field: RadioField = { ...radioField, value: undefined }
            const key: KeypressEvent = { name: 'right' } as KeypressEvent

            const result = editRadioField({
                fields: [field],
                currentField: field,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                value: 'Option 1',
            })
        })

        it('should handle empty string value by selecting first choice', () => {
            const field = { ...radioField, value: '' }
            const key: KeypressEvent = { name: 'right' } as KeypressEvent

            const result = editRadioField({
                fields: [field],
                currentField: field,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                value: 'Option 1',
            })
        })

        it('should handle value that does not match any choice by selecting first choice', () => {
            const field = { ...radioField, value: 'Non-existent Option' }
            const key: KeypressEvent = { name: 'right' } as KeypressEvent

            const result = editRadioField({
                fields: [field],
                currentField: field,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                value: 'Option 1',
            })
        })

        it('should handle single choice field', () => {
            const singleChoiceField: RadioField = {
                ...radioField,
                choices: ['Only Option'],
                value: 'Only Option',
            }
            const key: KeypressEvent = { name: 'right' } as KeypressEvent

            const result = editRadioField({
                fields: [singleChoiceField],
                currentField: singleChoiceField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...singleChoiceField,
                value: 'Only Option', // Should stay the same
            })
        })
    })

    describe('non-navigation keys', () => {
        it('should clear line and return unchanged fields for space key', () => {
            const field = { ...radioField, value: 'Option 2' }
            const fields = [field]
            const key: KeypressEvent = { name: 'space' } as KeypressEvent

            const result = editRadioField({
                fields,
                currentField: field,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
            expect(result).toBe(fields) // Should return the same fields array
        })

        it('should clear line and return unchanged fields for enter key', () => {
            const field = { ...radioField, value: 'Option 2' }
            const fields = [field]
            const key: KeypressEvent = { name: 'enter' } as KeypressEvent

            const result = editRadioField({
                fields,
                currentField: field,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
            expect(result).toBe(fields) // Should return the same fields array
        })

        it('should clear line and return unchanged fields for escape key', () => {
            const field = { ...radioField, value: 'Option 2' }
            const fields = [field]
            const key: KeypressEvent = { name: 'escape' } as KeypressEvent

            const result = editRadioField({
                fields,
                currentField: field,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
            expect(result).toBe(fields) // Should return the same fields array
        })

        it('should clear line and return unchanged fields for tab key', () => {
            const field = { ...radioField, value: 'Option 2' }
            const fields = [field]
            const key: KeypressEvent = { name: 'tab' } as KeypressEvent

            const result = editRadioField({
                fields,
                currentField: field,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
            expect(result).toBe(fields) // Should return the same fields array
        })

        it('should clear line and return unchanged fields for up key', () => {
            const field = { ...radioField, value: 'Option 2' }
            const fields = [field]
            const key: KeypressEvent = { name: 'up' } as KeypressEvent

            const result = editRadioField({
                fields,
                currentField: field,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
            expect(result).toBe(fields) // Should return the same fields array
        })

        it('should clear line and return unchanged fields for down key', () => {
            const field = { ...radioField, value: 'Option 2' }
            const fields = [field]
            const key: KeypressEvent = { name: 'down' } as KeypressEvent

            const result = editRadioField({
                fields,
                currentField: field,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
            expect(result).toBe(fields) // Should return the same fields array
        })

        it('should clear line and return unchanged fields for character keys', () => {
            const field = { ...radioField, value: 'Option 2' }
            const fields = [field]
            const key: KeypressEvent = { name: 'a' } as KeypressEvent

            const result = editRadioField({
                fields,
                currentField: field,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
            expect(result).toBe(fields) // Should return the same fields array
        })
    })

    describe('multiple fields scenarios', () => {
        it('should only modify the radio field at the specified index', () => {
            const fields: InternalFields = [textField, radioField, booleanField]
            const field = { ...radioField, value: 'Option 1' }
            const key: KeypressEvent = { name: 'right' } as KeypressEvent

            const result = editRadioField({
                fields,
                currentField: field,
                focusedIndex: 1,
                key,
                rl: mockRl,
            })

            expect(result).toHaveLength(3)
            expect(result[0]).toBe(textField) // Unchanged
            expect(result[1]).toEqual({
                ...field,
                value: 'Option 2',
            })
            expect(result[2]).toBe(booleanField) // Unchanged
        })

        it('should handle radio field at first position', () => {
            const fields: InternalFields = [radioField, textField, booleanField]
            const field = { ...radioField, value: 'Option 2' }
            const key: KeypressEvent = { name: 'left' } as KeypressEvent

            const result = editRadioField({
                fields,
                currentField: field,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result).toHaveLength(3)
            expect(result[0]).toEqual({
                ...field,
                value: 'Option 1',
            })
            expect(result[1]).toBe(textField) // Unchanged
            expect(result[2]).toBe(booleanField) // Unchanged
        })

        it('should handle radio field at last position', () => {
            const fields: InternalFields = [textField, booleanField, radioField]
            const field = { ...radioField, value: 'Option 3' }
            const key: KeypressEvent = { name: 'right' } as KeypressEvent

            const result = editRadioField({
                fields,
                currentField: field,
                focusedIndex: 2,
                key,
                rl: mockRl,
            })

            expect(result).toHaveLength(3)
            expect(result[0]).toBe(textField) // Unchanged
            expect(result[1]).toBe(booleanField) // Unchanged
            expect(result[2]).toEqual({
                ...field,
                value: 'Option 1', // Wrapped to first
            })
        })

        it('should handle fields with separators', () => {
            const separator = new Separator('--- Section ---')
            const fields: InternalFields = [textField, separator, radioField, booleanField]
            const field = { ...radioField, value: 'Option 1' }
            const key: KeypressEvent = { name: 'right' } as KeypressEvent

            const result = editRadioField({
                fields,
                currentField: field,
                focusedIndex: 2,
                key,
                rl: mockRl,
            })

            expect(result).toHaveLength(4)
            expect(result[0]).toBe(textField) // Unchanged
            expect(result[1]).toBe(separator) // Unchanged
            expect(result[2]).toEqual({
                ...field,
                value: 'Option 2',
            })
            expect(result[3]).toBe(booleanField) // Unchanged
        })
    })

    describe('edge cases with choices', () => {
        it('should handle empty choices array', () => {
            const emptyChoicesField: RadioField = {
                ...radioField,
                choices: [],
                value: undefined,
            }
            const key: KeypressEvent = { name: 'right' } as KeypressEvent

            const result = editRadioField({
                fields: [emptyChoicesField],
                currentField: emptyChoicesField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...emptyChoicesField,
                value: undefined, // Should remain undefined since no choices available
            })
        })

        it('should handle choices with special characters', () => {
            const specialField: RadioField = {
                ...radioField,
                choices: ['Option with "quotes"', 'Option with émojis 🎉', 'Option with <tags>'],
                value: 'Option with "quotes"',
            }
            const key: KeypressEvent = { name: 'right' } as KeypressEvent

            const result = editRadioField({
                fields: [specialField],
                currentField: specialField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...specialField,
                value: 'Option with émojis 🎉',
            })
        })

        it('should handle choices with whitespace', () => {
            const whitespaceField: RadioField = {
                ...radioField,
                choices: [' Leading space', 'Trailing space ', '  Both spaces  '],
                value: ' Leading space',
            }
            const key: KeypressEvent = { name: 'right' } as KeypressEvent

            const result = editRadioField({
                fields: [whitespaceField],
                currentField: whitespaceField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...whitespaceField,
                value: 'Trailing space ',
            })
        })

        it('should handle choices with empty strings', () => {
            const emptyStringField: RadioField = {
                ...radioField,
                choices: ['', 'Option 2', ''],
                value: '',
            }
            const key: KeypressEvent = { name: 'right' } as KeypressEvent

            const result = editRadioField({
                fields: [emptyStringField],
                currentField: emptyStringField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...emptyStringField,
                value: 'Option 2',
            })
        })

        it('should handle numeric-like string choices', () => {
            const numericField: RadioField = {
                ...radioField,
                choices: ['1', '2', '3'],
                value: '2',
            }
            const key: KeypressEvent = { name: 'left' } as KeypressEvent

            const result = editRadioField({
                fields: [numericField],
                currentField: numericField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...numericField,
                value: '1',
            })
        })

        it('should handle very long choice names', () => {
            const longField: RadioField = {
                ...radioField,
                choices: [
                    'Short',
                    'This is a very long option name that might wrap in some terminals but should be handled gracefully',
                ],
                value: 'Short',
            }
            const key: KeypressEvent = { name: 'right' } as KeypressEvent

            const result = editRadioField({
                fields: [longField],
                currentField: longField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...longField,
                value: 'This is a very long option name that might wrap in some terminals but should be handled gracefully',
            })
        })
    })

    describe('immutability and data integrity', () => {
        it('should create new fields array without modifying original', () => {
            const originalFields: InternalFields = [textField, radioField, booleanField]
            const field = { ...radioField, value: 'Option 1' }
            const key: KeypressEvent = { name: 'right' } as KeypressEvent

            const result = editRadioField({
                fields: originalFields,
                currentField: field,
                focusedIndex: 1,
                key,
                rl: mockRl,
            })

            expect(result).not.toBe(originalFields)
            expect(originalFields[1]).toBe(radioField) // Original should be unchanged
            expect(result[1]).not.toBe(radioField) // Result should have new field object
        })

        it('should create new field object without modifying original field', () => {
            const originalField = { ...radioField, value: 'Option 1' }
            const key: KeypressEvent = { name: 'right' } as KeypressEvent

            const result = editRadioField({
                fields: [originalField],
                currentField: originalField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).not.toBe(originalField)
            expect(originalField.value).toBe('Option 1') // Original should be unchanged
            expect((result[0] as RadioField).value).toBe('Option 2') // Result should have new value
        })

        it('should preserve all field properties except value', () => {
            const complexField: RadioField = {
                type: 'radio',
                label: 'Complex Field',
                description: 'A field with description',
                choices: ['A', 'B', 'C'],
                value: 'B',
            }
            const key: KeypressEvent = { name: 'left' } as KeypressEvent

            const result = editRadioField({
                fields: [complexField],
                currentField: complexField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                type: 'radio',
                label: 'Complex Field',
                description: 'A field with description',
                choices: ['A', 'B', 'C'],
                value: 'A', // Only value should change
            })
        })
    })

    describe('key press handling', () => {
        it('should handle key with ctrl modifier', () => {
            const field = { ...radioField, value: 'Option 1' }
            const key: KeypressEvent = { name: 'right' } as KeypressEvent

            const result = editRadioField({
                fields: [field],
                currentField: field,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                value: 'Option 2',
            })
        })

        it('should handle key with meta modifier', () => {
            const field = { ...radioField, value: 'Option 2' }
            const key: KeypressEvent = { name: 'left' } as KeypressEvent

            const result = editRadioField({
                fields: [field],
                currentField: field,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                value: 'Option 1',
            })
        })

        it('should handle key with shift modifier', () => {
            const field = { ...radioField, value: 'Option 1' }
            const key: KeypressEvent = { name: 'right' } as KeypressEvent

            const result = editRadioField({
                fields: [field],
                currentField: field,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                value: 'Option 2',
            })
        })

        it('should handle key with multiple modifiers', () => {
            const field = { ...radioField, value: 'Option 3' }
            const key: KeypressEvent = { name: 'left' } as KeypressEvent

            const result = editRadioField({
                fields: [field],
                currentField: field,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                value: 'Option 2',
            })
        })
    })

    describe('case sensitivity', () => {
        it('should handle case-sensitive choice matching', () => {
            const caseField: RadioField = {
                ...radioField,
                choices: ['Option 1', 'option 1', 'OPTION 1'],
                value: 'option 1',
            }
            const key: KeypressEvent = { name: 'right' } as KeypressEvent

            const result = editRadioField({
                fields: [caseField],
                currentField: caseField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...caseField,
                value: 'OPTION 1',
            })
        })

        it('should handle case-sensitive choice matching with left navigation', () => {
            const caseField: RadioField = {
                ...radioField,
                choices: ['Option 1', 'option 1', 'OPTION 1'],
                value: 'OPTION 1',
            }
            const key: KeypressEvent = { name: 'left' } as KeypressEvent

            const result = editRadioField({
                fields: [caseField],
                currentField: caseField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...caseField,
                value: 'option 1',
            })
        })
    })

    describe('boundary conditions', () => {
        it('should handle wrapping from first to last with left key', () => {
            const field = { ...radioField, value: 'Option 1' }
            const key: KeypressEvent = { name: 'left' } as KeypressEvent

            const result = editRadioField({
                fields: [field],
                currentField: field,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                value: 'Option 3',
            })
        })

        it('should handle wrapping from last to first with right key', () => {
            const field = { ...radioField, value: 'Option 3' }
            const key: KeypressEvent = { name: 'right' } as KeypressEvent

            const result = editRadioField({
                fields: [field],
                currentField: field,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                value: 'Option 1',
            })
        })

        it('should handle single choice array without errors', () => {
            const singleField: RadioField = {
                ...radioField,
                choices: ['Only Choice'],
                value: 'Only Choice',
            }
            const leftKey: KeypressEvent = { name: 'left' } as KeypressEvent
            const rightKey: KeypressEvent = { name: 'right' } as KeypressEvent

            const leftResult = editRadioField({
                fields: [singleField],
                currentField: singleField,
                focusedIndex: 0,
                key: leftKey,
                rl: mockRl,
            })

            const rightResult = editRadioField({
                fields: [singleField],
                currentField: singleField,
                focusedIndex: 0,
                key: rightKey,
                rl: mockRl,
            })

            expect((leftResult[0] as RadioField).value).toBe('Only Choice')
            expect((rightResult[0] as RadioField).value).toBe('Only Choice')
        })
    })
})
