import type { KeypressEvent } from '@inquirer/core'
import { Separator } from '@inquirer/core'
import { editCheckboxField } from 'src/keyHandlers/editCheckbox.js'
import type {
    BooleanField,
    InquirerReadline,
    InternalCheckboxField,
    InternalField,
    InternalFields,
    RadioField,
    TextField,
} from 'src/util/types.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('editCheckboxField', () => {
    // Mock readline instance
    const mockRl = {
        clearLine: vi.fn(),
    } as unknown as InquirerReadline

    // Sample fields for testing
    const checkboxField: InternalCheckboxField = {
        type: 'checkbox',
        label: 'Test Checkbox',
        choices: ['Option 1', 'Option 2', 'Option 3'],
        value: [],
        highlightIndex: 0,
    }

    const textField: TextField = {
        type: 'text',
        label: 'Test Text',
        value: 'sample',
    }

    const booleanField: BooleanField = {
        type: 'boolean',
        label: 'Test Boolean',
        value: false,
    }

    const radioField: RadioField = {
        type: 'radio',
        label: 'Test Radio',
        choices: ['Radio 1', 'Radio 2'],
        value: 'Radio 1',
    }

    let sampleFields: InternalFields

    beforeEach(() => {
        vi.clearAllMocks()
        sampleFields = [textField, checkboxField, booleanField, new Separator(), radioField]
    })

    describe('left arrow key navigation', () => {
        it('should move highlight index from middle to previous option', () => {
            const field = { ...checkboxField, highlightIndex: 1 }
            const key: KeypressEvent = { name: 'left', ctrl: false }

            const result = editCheckboxField({
                fields: [field],
                currentField: field,
                key,
                focusedIndex: 0,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                highlightIndex: 0,
            })
        })

        it('should wrap to last option when at first option', () => {
            const field = { ...checkboxField, highlightIndex: 0 }
            const key: KeypressEvent = { name: 'left', ctrl: false }

            const result = editCheckboxField({
                fields: [field],
                currentField: field,
                key,
                focusedIndex: 0,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                highlightIndex: 2, // Last choice index (length - 1)
            })
        })

        it('should handle single choice field', () => {
            const singleChoiceField: InternalCheckboxField = {
                ...checkboxField,
                choices: ['Only Option'],
                highlightIndex: 0,
            }
            const key: KeypressEvent = { name: 'left', ctrl: false }

            const result = editCheckboxField({
                fields: [singleChoiceField],
                currentField: singleChoiceField,
                key,
                focusedIndex: 0,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...singleChoiceField,
                highlightIndex: 0, // Should wrap to itself
            })
        })

        it('should handle empty choices array', () => {
            const emptyChoicesField: InternalCheckboxField = {
                ...checkboxField,
                choices: [],
                highlightIndex: 0,
            }
            const key: KeypressEvent = { name: 'left', ctrl: false }

            const result = editCheckboxField({
                fields: [emptyChoicesField],
                currentField: emptyChoicesField,
                key,
                focusedIndex: 0,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...emptyChoicesField,
                highlightIndex: -1, // length - 1 = -1
            })
        })
    })

    describe('right arrow key navigation', () => {
        it('should move highlight index from middle to next option', () => {
            const field = { ...checkboxField, highlightIndex: 1 }
            const key: KeypressEvent = { name: 'right', ctrl: false }

            const result = editCheckboxField({
                fields: [field],
                currentField: field,
                key,
                focusedIndex: 0,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                highlightIndex: 2,
            })
        })

        it('should wrap to first option when at last option', () => {
            const field = { ...checkboxField, highlightIndex: 2 }
            const key: KeypressEvent = { name: 'right', ctrl: false }

            const result = editCheckboxField({
                fields: [field],
                currentField: field,
                key,
                focusedIndex: 0,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                highlightIndex: 0,
            })
        })

        it('should handle single choice field', () => {
            const singleChoiceField: InternalCheckboxField = {
                ...checkboxField,
                choices: ['Only Option'],
                highlightIndex: 0,
            }
            const key: KeypressEvent = { name: 'right', ctrl: false }

            const result = editCheckboxField({
                fields: [singleChoiceField],
                currentField: singleChoiceField,
                key,
                focusedIndex: 0,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...singleChoiceField,
                highlightIndex: 0, // Should wrap to itself
            })
        })

        it('should handle empty choices array', () => {
            const emptyChoicesField: InternalCheckboxField = {
                ...checkboxField,
                choices: [],
                highlightIndex: 0,
            }
            const key: KeypressEvent = { name: 'right', ctrl: false }

            const result = editCheckboxField({
                fields: [emptyChoicesField],
                currentField: emptyChoicesField,
                key,
                focusedIndex: 0,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...emptyChoicesField,
                highlightIndex: 0, // Should stay at 0
            })
        })
    })

    describe('space key selection', () => {
        it('should add option to value when not already selected', () => {
            const field = { ...checkboxField, value: ['Option 1'], highlightIndex: 1 }
            const key: KeypressEvent = { name: 'space', ctrl: false }

            const result = editCheckboxField({
                fields: [field],
                currentField: field,
                key,
                focusedIndex: 0,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                value: ['Option 1', 'Option 2'],
            })
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should remove option from value when already selected', () => {
            const field = { ...checkboxField, value: ['Option 1', 'Option 2'], highlightIndex: 1 }
            const key: KeypressEvent = { name: 'space', ctrl: false }

            const result = editCheckboxField({
                fields: [field],
                currentField: field,
                key,
                focusedIndex: 0,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                value: ['Option 1'],
            })
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should handle adding to empty value array', () => {
            const field = { ...checkboxField, value: [], highlightIndex: 0 }
            const key: KeypressEvent = { name: 'space', ctrl: false }

            const result = editCheckboxField({
                fields: [field],
                currentField: field,
                key,
                focusedIndex: 0,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                value: ['Option 1'],
            })
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should handle removing last selected option', () => {
            const field = { ...checkboxField, value: ['Option 2'], highlightIndex: 1 }
            const key: KeypressEvent = { name: 'space', ctrl: false }

            const result = editCheckboxField({
                fields: [field],
                currentField: field,
                key,
                focusedIndex: 0,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                value: [],
            })
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should handle selecting all options', () => {
            const field = { ...checkboxField, value: ['Option 1', 'Option 2'], highlightIndex: 2 }
            const key: KeypressEvent = { name: 'space', ctrl: false }

            const result = editCheckboxField({
                fields: [field],
                currentField: field,
                key,
                focusedIndex: 0,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...field,
                value: ['Option 1', 'Option 2', 'Option 3'],
            })
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should handle highlighting out of bounds index', () => {
            const field = { ...checkboxField, value: [], highlightIndex: 5 } // Out of bounds
            const key: KeypressEvent = { name: 'space', ctrl: false }

            const result = editCheckboxField({
                fields: [field],
                currentField: field,
                key,
                focusedIndex: 0,
                rl: mockRl,
            })

            // Should not modify value since highlightedValue is undefined
            expect(result[0]).toEqual({
                ...field,
                value: [],
            })
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should handle empty choices array', () => {
            const emptyChoicesField: InternalCheckboxField = {
                ...checkboxField,
                choices: [],
                value: [],
                highlightIndex: 0,
            }
            const key: KeypressEvent = { name: 'space', ctrl: false }

            const result = editCheckboxField({
                fields: [emptyChoicesField],
                currentField: emptyChoicesField,
                key,
                focusedIndex: 0,
                rl: mockRl,
            })

            // Should not modify value since no choices exist
            expect(result[0]).toEqual({
                ...emptyChoicesField,
                value: [],
            })
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })
    })

    describe('default highlight index handling', () => {
        it('should use default highlightIndex of 0 when not provided', () => {
            const fieldWithoutHighlight: InternalCheckboxField = {
                type: 'checkbox',
                label: 'Test',
                choices: ['A', 'B', 'C'],
                value: [],
                highlightIndex: 0, // This will be destructured as 0 due to default
            }

            // Remove highlightIndex to test default
            const { highlightIndex: _, ...fieldProps } = fieldWithoutHighlight
            const fieldWithUndefinedHighlight = fieldProps as InternalField

            const key: KeypressEvent = { name: 'right', ctrl: false }

            const result = editCheckboxField({
                fields: [fieldWithUndefinedHighlight],
                currentField: fieldWithUndefinedHighlight as InternalCheckboxField,
                key,
                focusedIndex: 0,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...fieldWithUndefinedHighlight,
                highlightIndex: 1, // Should move from default 0 to 1
            })
        })
    })

    describe('other key handling', () => {
        it('should not modify field for unsupported keys', () => {
            const field = { ...checkboxField, highlightIndex: 1 }
            const key: KeypressEvent = { name: 'enter', ctrl: false }

            const result = editCheckboxField({
                fields: [field],
                currentField: field,
                key,
                focusedIndex: 0,
                rl: mockRl,
            })

            expect(result[0]).toEqual(field)
            expect(mockRl.clearLine).not.toHaveBeenCalled()
        })

        it('should not modify field for modifier keys', () => {
            const field = { ...checkboxField, highlightIndex: 1 }
            const key: KeypressEvent = { name: 'tab', ctrl: false }

            const result = editCheckboxField({
                fields: [field],
                currentField: field,
                key,
                focusedIndex: 0,
                rl: mockRl,
            })

            expect(result[0]).toEqual(field)
            expect(mockRl.clearLine).not.toHaveBeenCalled()
        })
    })

    describe('multiple fields scenarios', () => {
        it('should only modify the field at focusedIndex', () => {
            const field1 = { ...checkboxField, label: 'Field 1' }
            const field2 = { ...checkboxField, label: 'Field 2', highlightIndex: 1 }
            const field3 = { ...checkboxField, label: 'Field 3' }
            const fields = [field1, field2, field3]

            const key: KeypressEvent = { name: 'right', ctrl: false }

            const result = editCheckboxField({
                fields,
                currentField: field2,
                key,
                focusedIndex: 1,
                rl: mockRl,
            })

            expect(result).toHaveLength(3)
            expect(result[0]).toEqual(field1) // Unchanged
            expect(result[1]).toEqual({ ...field2, highlightIndex: 2 }) // Modified
            expect(result[2]).toEqual(field3) // Unchanged
        })

        it('should handle checkbox field among mixed field types', () => {
            const fields = sampleFields
            const key: KeypressEvent = { name: 'space', ctrl: false }

            const result = editCheckboxField({
                fields,
                currentField: checkboxField,
                key,
                focusedIndex: 1,
                rl: mockRl,
            })

            expect(result).toHaveLength(5)
            expect(result[0]).toEqual(textField) // Unchanged
            expect(result[1]).toEqual({ ...checkboxField, value: ['Option 1'] }) // Modified
            expect(result[2]).toEqual(booleanField) // Unchanged
            expect(result[3]).toBeInstanceOf(Separator) // Unchanged
            expect(result[4]).toEqual(radioField) // Unchanged
        })
    })

    describe('edge cases', () => {
        it('should handle choices with special characters', () => {
            const specialField: InternalCheckboxField = {
                ...checkboxField,
                choices: ['Option with "quotes"', 'Option with émojis 🎉', 'Option with <tags>'],
                value: [],
                highlightIndex: 1,
            }
            const key: KeypressEvent = { name: 'space', ctrl: false }

            const result = editCheckboxField({
                fields: [specialField],
                currentField: specialField,
                key,
                focusedIndex: 0,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                ...specialField,
                value: ['Option with émojis 🎉'],
            })
        })

        it('should handle duplicate choices in array', () => {
            const duplicateField: InternalCheckboxField = {
                ...checkboxField,
                choices: ['Option 1', 'Option 1', 'Option 2'],
                value: ['Option 1'],
                highlightIndex: 1, // Second "Option 1"
            }
            const key: KeypressEvent = { name: 'space', ctrl: false }

            const result = editCheckboxField({
                fields: [duplicateField],
                currentField: duplicateField,
                key,
                focusedIndex: 0,
                rl: mockRl,
            })

            // Should remove the first occurrence of "Option 1"
            expect(result[0]).toEqual({
                ...duplicateField,
                value: [],
            })
        })

        it('should handle very long choice arrays', () => {
            const longChoices = Array.from({ length: 100 }, (_, i) => `Option ${i + 1}`)
            const longField: InternalCheckboxField = {
                ...checkboxField,
                choices: longChoices,
                value: [],
                highlightIndex: 50,
            }

            const leftKey: KeypressEvent = { name: 'left', ctrl: false }
            const rightKey: KeypressEvent = { name: 'right', ctrl: false }

            const leftResult = editCheckboxField({
                fields: [longField],
                currentField: longField,
                key: leftKey,
                focusedIndex: 0,
                rl: mockRl,
            })

            const rightResult = editCheckboxField({
                fields: [longField],
                currentField: longField,
                key: rightKey,
                focusedIndex: 0,
                rl: mockRl,
            })

            expect(leftResult[0]).toEqual({ ...longField, highlightIndex: 49 })
            expect(rightResult[0]).toEqual({ ...longField, highlightIndex: 51 })
        })

        it('should handle wrapping at boundaries with large arrays', () => {
            const longChoices = Array.from({ length: 100 }, (_, i) => `Option ${i + 1}`)
            const fieldAtStart: InternalCheckboxField = {
                ...checkboxField,
                choices: longChoices,
                value: [],
                highlightIndex: 0,
            }
            const fieldAtEnd: InternalCheckboxField = {
                ...checkboxField,
                choices: longChoices,
                value: [],
                highlightIndex: 99,
            }

            const leftKey: KeypressEvent = { name: 'left', ctrl: false }
            const rightKey: KeypressEvent = { name: 'right', ctrl: false }

            const leftFromStart = editCheckboxField({
                fields: [fieldAtStart],
                currentField: fieldAtStart,
                key: leftKey,
                focusedIndex: 0,
                rl: mockRl,
            })

            const rightFromEnd = editCheckboxField({
                fields: [fieldAtEnd],
                currentField: fieldAtEnd,
                key: rightKey,
                focusedIndex: 0,
                rl: mockRl,
            })

            expect(leftFromStart[0]).toEqual({ ...fieldAtStart, highlightIndex: 99 })
            expect(rightFromEnd[0]).toEqual({ ...fieldAtEnd, highlightIndex: 0 })
        })
    })

    describe('immutability', () => {
        it('should not mutate the original fields array', () => {
            const originalFields = [checkboxField]
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const originalFieldsCopy = JSON.parse(JSON.stringify(originalFields))
            const key: KeypressEvent = { name: 'right', ctrl: false }

            editCheckboxField({
                fields: originalFields,
                currentField: checkboxField,
                key,
                focusedIndex: 0,
                rl: mockRl,
            })

            expect(originalFields).toEqual(originalFieldsCopy)
        })

        it('should not mutate the original currentField', () => {
            const originalField = { ...checkboxField }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const originalFieldCopy = JSON.parse(JSON.stringify(originalField))
            const key: KeypressEvent = { name: 'space', ctrl: false }

            editCheckboxField({
                fields: [originalField],
                currentField: originalField,
                key,
                focusedIndex: 0,
                rl: mockRl,
            })

            expect(originalField).toEqual(originalFieldCopy)
        })

        it('should create new arrays for value modifications', () => {
            const originalValue = ['Option 1']
            const field = { ...checkboxField, value: originalValue, highlightIndex: 1 }
            const key: KeypressEvent = { name: 'space', ctrl: false }

            const result = editCheckboxField({
                fields: [field],
                currentField: field,
                key,
                focusedIndex: 0,
                rl: mockRl,
            })

            // Original value array should not be modified
            expect(originalValue).toEqual(['Option 1'])

            if (result[0] instanceof Separator) {
                throw new Error('Expected result[0] to be an InternalCheckboxField, not a Separator')
            }

            // Result should have new array
            expect(result[0]?.value).toEqual(['Option 1', 'Option 2'])
            expect(result[0]?.value).not.toBe(originalValue)
        })
    })
})
