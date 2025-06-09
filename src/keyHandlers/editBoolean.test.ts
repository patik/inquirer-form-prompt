import type { KeypressEvent } from '@inquirer/core'
import { Separator } from '@inquirer/core'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type {
    BooleanField,
    InquirerReadline,
    InternalCheckboxField,
    InternalFields,
    RadioField,
    TextField,
} from '../util/types.js'
import { editBooleanField } from './editBoolean.js'

describe('editBooleanField', () => {
    // Mock readline instance
    const mockRl = {
        clearLine: vi.fn(),
    } as unknown as InquirerReadline

    // Sample fields for testing
    const booleanField: BooleanField = {
        type: 'boolean',
        label: 'Test Boolean',
        value: false,
    }

    const textField: TextField = {
        type: 'text',
        label: 'Test Text',
        value: 'sample',
    }

    const radioField: RadioField = {
        type: 'radio',
        label: 'Test Radio',
        choices: ['Option 1', 'Option 2'],
        value: 'Option 1',
    }

    const checkboxField: InternalCheckboxField = {
        type: 'checkbox',
        label: 'Test Checkbox',
        choices: ['Choice 1', 'Choice 2'],
        value: ['Choice 1'],
        highlightIndex: 0,
    }

    const separator = new Separator('--- Section ---')

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('when left or right arrow keys are pressed', () => {
        it('should toggle boolean value from false to true when left key is pressed', () => {
            const fields: InternalFields = [textField, booleanField, radioField]
            const focusedIndex = 1

            const result = editBooleanField({
                fields,
                currentField: booleanField,
                focusedIndex,
                key: { name: 'left' } as KeypressEvent,
                rl: mockRl,
            })

            expect(result).toHaveLength(3)
            expect(result[0]).toBe(textField) // unchanged
            expect(result[1]).toEqual({
                ...booleanField,
                value: true, // toggled from false to true
            })
            expect(result[2]).toBe(radioField) // unchanged
            expect(mockRl.clearLine).not.toHaveBeenCalled()
        })

        it('should toggle boolean value from true to false when right key is pressed', () => {
            const trueBooleanField: BooleanField = {
                ...booleanField,
                value: true,
            }
            const fields: InternalFields = [textField, trueBooleanField, radioField]
            const focusedIndex = 1

            const result = editBooleanField({
                fields,
                currentField: trueBooleanField,
                focusedIndex,
                key: { name: 'right' } as KeypressEvent,
                rl: mockRl,
            })

            expect(result).toHaveLength(3)
            expect(result[0]).toBe(textField) // unchanged
            expect(result[1]).toEqual({
                ...trueBooleanField,
                value: false, // toggled from true to false
            })
            expect(result[2]).toBe(radioField) // unchanged
            expect(mockRl.clearLine).not.toHaveBeenCalled()
        })

        it('should toggle undefined value to true when left key is pressed', () => {
            const undefinedBooleanField: BooleanField = {
                ...booleanField,
                value: undefined,
            }
            const fields: InternalFields = [undefinedBooleanField]
            const focusedIndex = 0

            const result = editBooleanField({
                fields,
                currentField: undefinedBooleanField,
                focusedIndex,
                key: { name: 'left' } as KeypressEvent,
                rl: mockRl,
            })

            expect(result).toHaveLength(1)
            expect(result[0]).toEqual({
                ...undefinedBooleanField,
                value: true, // !undefined = true
            })
            expect(mockRl.clearLine).not.toHaveBeenCalled()
        })

        it('should toggle missing value to true when right key is pressed', () => {
            const noValueBooleanField: BooleanField = {
                type: 'boolean',
                label: 'No Value Field',
            }
            const fields: InternalFields = [noValueBooleanField]
            const focusedIndex = 0

            const result = editBooleanField({
                fields,
                currentField: noValueBooleanField,
                focusedIndex,
                key: { name: 'right' } as KeypressEvent,
                rl: mockRl,
            })

            expect(result).toHaveLength(1)
            expect(result[0]).toEqual({
                ...noValueBooleanField,
                value: true, // !undefined = true
            })
            expect(mockRl.clearLine).not.toHaveBeenCalled()
        })

        it('should work with fields containing separators', () => {
            const fields: InternalFields = [separator, booleanField, separator]
            const focusedIndex = 1

            const result = editBooleanField({
                fields,
                currentField: booleanField,
                focusedIndex,
                key: { name: 'left' } as KeypressEvent,
                rl: mockRl,
            })

            expect(result).toHaveLength(3)
            expect(result[0]).toBe(separator) // unchanged
            expect(result[1]).toEqual({
                ...booleanField,
                value: true,
            })
            expect(result[2]).toBe(separator) // unchanged
            expect(mockRl.clearLine).not.toHaveBeenCalled()
        })

        it('should work when boolean field is at the beginning of the array', () => {
            const fields: InternalFields = [booleanField, textField, radioField]
            const focusedIndex = 0

            const result = editBooleanField({
                fields,
                currentField: booleanField,
                focusedIndex,
                key: { name: 'left' } as KeypressEvent,
                rl: mockRl,
            })

            expect(result).toHaveLength(3)
            expect(result[0]).toEqual({
                ...booleanField,
                value: true,
            })
            expect(result[1]).toBe(textField) // unchanged
            expect(result[2]).toBe(radioField) // unchanged
            expect(mockRl.clearLine).not.toHaveBeenCalled()
        })

        it('should work when boolean field is at the end of the array', () => {
            const fields: InternalFields = [textField, radioField, booleanField]
            const focusedIndex = 2

            const result = editBooleanField({
                fields,
                currentField: booleanField,
                focusedIndex,
                key: { name: 'right' } as KeypressEvent,
                rl: mockRl,
            })

            expect(result).toHaveLength(3)
            expect(result[0]).toBe(textField) // unchanged
            expect(result[1]).toBe(radioField) // unchanged
            expect(result[2]).toEqual({
                ...booleanField,
                value: true,
            })
            expect(mockRl.clearLine).not.toHaveBeenCalled()
        })

        it('should handle mixed field types correctly', () => {
            const fields: InternalFields = [textField, booleanField, checkboxField, radioField]
            const focusedIndex = 1

            const result = editBooleanField({
                fields,
                currentField: booleanField,
                focusedIndex,
                key: { name: 'left' } as KeypressEvent,
                rl: mockRl,
            })

            expect(result).toHaveLength(4)
            expect(result[0]).toBe(textField) // unchanged
            expect(result[1]).toEqual({
                ...booleanField,
                value: true,
            })
            expect(result[2]).toBe(checkboxField) // unchanged
            expect(result[3]).toBe(radioField) // unchanged
            expect(mockRl.clearLine).not.toHaveBeenCalled()
        })
    })

    describe('when other keys are pressed', () => {
        it('should return unchanged fields and call clearLine when enter key is pressed', () => {
            const fields: InternalFields = [textField, booleanField, radioField]
            const focusedIndex = 1

            const result = editBooleanField({
                fields,
                currentField: booleanField,
                focusedIndex,
                key: { name: 'return' } as KeypressEvent,
                rl: mockRl,
            })

            expect(result).toBe(fields) // should return the same reference
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should return unchanged fields and call clearLine when up key is pressed', () => {
            const fields: InternalFields = [textField, booleanField, radioField]
            const focusedIndex = 1

            const result = editBooleanField({
                fields,
                currentField: booleanField,
                focusedIndex,
                key: { name: 'up' } as KeypressEvent,
                rl: mockRl,
            })

            expect(result).toBe(fields)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should return unchanged fields and call clearLine when down key is pressed', () => {
            const fields: InternalFields = [textField, booleanField, radioField]
            const focusedIndex = 1

            const result = editBooleanField({
                fields,
                currentField: booleanField,
                focusedIndex,
                key: { name: 'down' } as KeypressEvent,
                rl: mockRl,
            })

            expect(result).toBe(fields)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should return unchanged fields and call clearLine when space key is pressed', () => {
            const fields: InternalFields = [booleanField]
            const focusedIndex = 0

            const result = editBooleanField({
                fields,
                currentField: booleanField,
                focusedIndex,
                key: { name: 'space' } as KeypressEvent,
                rl: mockRl,
            })

            expect(result).toBe(fields)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should return unchanged fields and call clearLine when tab key is pressed', () => {
            const fields: InternalFields = [booleanField]
            const focusedIndex = 0

            const result = editBooleanField({
                fields,
                currentField: booleanField,
                focusedIndex,
                key: { name: 'tab' } as KeypressEvent,
                rl: mockRl,
            })

            expect(result).toBe(fields)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should return unchanged fields and call clearLine when escape key is pressed', () => {
            const fields: InternalFields = [booleanField]
            const focusedIndex = 0

            const result = editBooleanField({
                fields,
                currentField: booleanField,
                focusedIndex,
                key: { name: 'escape' } as KeypressEvent,
                rl: mockRl,
            })

            expect(result).toBe(fields)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should return unchanged fields and call clearLine for alphanumeric keys', () => {
            const fields: InternalFields = [booleanField]
            const focusedIndex = 0

            const result = editBooleanField({
                fields,
                currentField: booleanField,
                focusedIndex,
                key: { name: 'a' } as KeypressEvent,
                rl: mockRl,
            })

            expect(result).toBe(fields)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should return unchanged fields and call clearLine for special characters', () => {
            const fields: InternalFields = [booleanField]
            const focusedIndex = 0

            const result = editBooleanField({
                fields,
                currentField: booleanField,
                focusedIndex,
                key: { name: '!' } as KeypressEvent,
                rl: mockRl,
            })

            expect(result).toBe(fields)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should return unchanged fields and call clearLine when key name is undefined', () => {
            const fields: InternalFields = [booleanField]
            const focusedIndex = 0

            const result = editBooleanField({
                fields,
                currentField: booleanField,
                focusedIndex,
                key: { name: undefined } as unknown as KeypressEvent,
                rl: mockRl,
            })

            expect(result).toBe(fields)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })
    })

    describe('immutability and array handling', () => {
        it('should not mutate the original fields array', () => {
            const originalFields: InternalFields = [textField, booleanField, radioField]
            const originalFieldsCopy = [...originalFields]

            editBooleanField({
                fields: originalFields,
                currentField: booleanField,
                focusedIndex: 1,
                key: { name: 'left' } as KeypressEvent,
                rl: mockRl,
            })

            expect(originalFields).toEqual(originalFieldsCopy)
            expect(originalFields[1]).toBe(booleanField) // reference should be unchanged
        })

        it('should not mutate the current field object', () => {
            const originalCurrentField = { ...booleanField }
            const fields: InternalFields = [booleanField]

            editBooleanField({
                fields,
                currentField: booleanField,
                focusedIndex: 0,
                key: { name: 'left' } as KeypressEvent,
                rl: mockRl,
            })

            expect(booleanField).toEqual(originalCurrentField)
        })

        it('should create a new array reference when toggling', () => {
            const fields: InternalFields = [booleanField]

            const result = editBooleanField({
                fields,
                currentField: booleanField,
                focusedIndex: 0,
                key: { name: 'left' } as KeypressEvent,
                rl: mockRl,
            })

            expect(result).not.toBe(fields) // should be a new array reference
        })

        it('should preserve other field references when toggling', () => {
            const fields: InternalFields = [textField, booleanField, radioField]

            const result = editBooleanField({
                fields,
                currentField: booleanField,
                focusedIndex: 1,
                key: { name: 'left' } as KeypressEvent,
                rl: mockRl,
            })

            expect(result[0]).toBe(textField) // same reference
            expect(result[1]).not.toBe(booleanField) // new reference for modified field
            expect(result[2]).toBe(radioField) // same reference
        })
    })

    describe('edge cases', () => {
        it('should handle empty fields array', () => {
            const fields: InternalFields = []

            const result = editBooleanField({
                fields,
                currentField: booleanField,
                focusedIndex: 0,
                key: { name: 'left' } as KeypressEvent,
                rl: mockRl,
            })

            expect(result).toHaveLength(1)
            expect(result[0]).toEqual({
                ...booleanField,
                value: true,
            })
        })

        it('should handle single field array', () => {
            const fields: InternalFields = [booleanField]

            const result = editBooleanField({
                fields,
                currentField: booleanField,
                focusedIndex: 0,
                key: { name: 'right' } as KeypressEvent,
                rl: mockRl,
            })

            expect(result).toHaveLength(1)
            expect(result[0]).toEqual({
                ...booleanField,
                value: true,
            })
        })

        it('should handle boolean field with additional properties', () => {
            const complexBooleanField: BooleanField = {
                type: 'boolean',
                label: 'Complex Boolean',
                description: 'A boolean field with description',
                value: false,
            }
            const fields: InternalFields = [complexBooleanField]

            const result = editBooleanField({
                fields,
                currentField: complexBooleanField,
                focusedIndex: 0,
                key: { name: 'left' } as KeypressEvent,
                rl: mockRl,
            })

            expect(result[0]).toEqual({
                type: 'boolean',
                label: 'Complex Boolean',
                description: 'A boolean field with description',
                value: true,
            })
        })

        it('should handle fields array with only separators and boolean field', () => {
            const separator1 = new Separator('--- Section 1 ---')
            const separator2 = new Separator('--- Section 2 ---')
            const fields: InternalFields = [separator1, booleanField, separator2]

            const result = editBooleanField({
                fields,
                currentField: booleanField,
                focusedIndex: 1,
                key: { name: 'left' } as KeypressEvent,
                rl: mockRl,
            })

            expect(result).toHaveLength(3)
            expect(result[0]).toBe(separator1)
            expect(result[1]).toEqual({
                ...booleanField,
                value: true,
            })
            expect(result[2]).toBe(separator2)
        })
    })

    describe('readline interaction', () => {
        it('should not call readline.clearLine when valid keys are pressed', () => {
            const fields: InternalFields = [booleanField]

            // Test left key
            editBooleanField({
                fields,
                currentField: booleanField,
                focusedIndex: 0,
                key: { name: 'left' } as KeypressEvent,
                rl: mockRl,
            })

            // Test right key
            editBooleanField({
                fields,
                currentField: booleanField,
                focusedIndex: 0,
                key: { name: 'right' } as KeypressEvent,
                rl: mockRl,
            })

            expect(mockRl.clearLine).not.toHaveBeenCalled()
        })

        it('should call readline.clearLine with correct parameter for invalid keys', () => {
            const fields: InternalFields = [booleanField]

            editBooleanField({
                fields,
                currentField: booleanField,
                focusedIndex: 0,
                key: { name: 'invalid' } as KeypressEvent,
                rl: mockRl,
            })

            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
            expect(mockRl.clearLine).toHaveBeenCalledTimes(1)
        })

        it('should handle readline method calls correctly', () => {
            const fields: InternalFields = [booleanField]

            // Test that clearLine is a function that can be called
            editBooleanField({
                fields,
                currentField: booleanField,
                focusedIndex: 0,
                key: { name: 'enter' } as KeypressEvent,
                rl: mockRl,
            })

            expect(typeof mockRl.clearLine).toBe('function')
            expect(mockRl.clearLine).toHaveBeenCalled()
        })
    })
})
