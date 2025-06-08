import { Separator } from '@inquirer/core'
import { describe, expect, it, vi } from 'vitest'
import { bgGray, green, white } from 'yoctocolors'
import type { BooleanField, InternalCheckboxField, RadioField, TextField } from '../util/types.js'
import { fieldToTableRow } from './fieldToTableRow.js'

// Mock the renderer functions
vi.mock('./boolean.js', () => ({
    renderBoolean: vi.fn((field, isSelected) => (isSelected ? 'mocked-boolean-selected' : 'mocked-boolean-unselected')),
}))

vi.mock('./checkbox.js', () => ({
    renderCheckbox: vi.fn((field, isSelected) =>
        isSelected ? 'mocked-checkbox-selected' : 'mocked-checkbox-unselected',
    ),
}))

vi.mock('./radio.js', () => ({
    renderRadio: vi.fn((field, isSelected) => (isSelected ? 'mocked-radio-selected' : 'mocked-radio-unselected')),
}))

describe('fieldToTableRow', () => {
    const textField: TextField = {
        type: 'text',
        name: 'Text Field',
        value: 'Sample text',
    }

    const booleanField: BooleanField = {
        type: 'boolean',
        name: 'Boolean Field',
        value: true,
    }

    const radioField: RadioField = {
        type: 'radio',
        name: 'Radio Field',
        choices: ['Option 1', 'Option 2'],
        value: 'Option 1',
    }

    const checkboxField: InternalCheckboxField = {
        type: 'checkbox',
        name: 'Checkbox Field',
        choices: ['Option 1', 'Option 2'],
        value: ['Option 1'],
        highlightIndex: 0,
    }

    describe('when field is selected (highlighted)', () => {
        it('should render text field with green name and bgGray white value', () => {
            const renderField = fieldToTableRow(0)
            const result = renderField(textField, 0)

            expect(result).toEqual([green('→ Text Field'), bgGray(white('Sample text'))])
        })

        it('should render text field with empty value as single space', () => {
            const emptyTextField: TextField = {
                type: 'text',
                name: 'Empty Field',
                value: '',
            }
            const renderField = fieldToTableRow(0)
            const result = renderField(emptyTextField, 0)

            expect(result).toEqual([green('→ Empty Field'), bgGray(white(' '))])
        })

        it('should render text field with undefined value as single space', () => {
            const undefinedTextField: TextField = {
                type: 'text',
                name: 'Undefined Field',
            }
            const renderField = fieldToTableRow(0)
            const result = renderField(undefinedTextField, 0)

            expect(result).toEqual([green('→ Undefined Field'), bgGray(white(' '))])
        })

        it('should render boolean field with mocked renderer', () => {
            const renderField = fieldToTableRow(0)
            const result = renderField(booleanField, 0)

            expect(result).toEqual([green('→ Boolean Field'), 'mocked-boolean-selected'])
        })

        it('should render radio field with mocked renderer', () => {
            const renderField = fieldToTableRow(0)
            const result = renderField(radioField, 0)

            expect(result).toEqual([green('→ Radio Field'), 'mocked-radio-selected'])
        })

        it('should render checkbox field with mocked renderer', () => {
            const renderField = fieldToTableRow(0)
            const result = renderField(checkboxField, 0)

            expect(result).toEqual([green('→ Checkbox Field'), 'mocked-checkbox-selected'])
        })
    })

    describe('when field is not selected', () => {
        it('should render text field with normal name and plain value', () => {
            const renderField = fieldToTableRow(1)
            const result = renderField(textField, 0)

            expect(result).toEqual(['  Text Field', 'Sample text'])
        })

        it('should render text field with empty value as single space', () => {
            const emptyTextField: TextField = {
                type: 'text',
                name: 'Empty Field',
                value: '',
            }
            const renderField = fieldToTableRow(1)
            const result = renderField(emptyTextField, 0)

            expect(result).toEqual(['  Empty Field', ' '])
        })

        it('should render text field with undefined value as single space', () => {
            const undefinedTextField: TextField = {
                type: 'text',
                name: 'Undefined Field',
            }
            const renderField = fieldToTableRow(1)
            const result = renderField(undefinedTextField, 0)

            expect(result).toEqual(['  Undefined Field', ' '])
        })

        it('should render boolean field with mocked renderer', () => {
            const renderField = fieldToTableRow(1)
            const result = renderField(booleanField, 0)

            expect(result).toEqual(['  Boolean Field', 'mocked-boolean-unselected'])
        })

        it('should render radio field with mocked renderer', () => {
            const renderField = fieldToTableRow(1)
            const result = renderField(radioField, 0)

            expect(result).toEqual(['  Radio Field', 'mocked-radio-unselected'])
        })

        it('should render checkbox field with mocked renderer', () => {
            const renderField = fieldToTableRow(1)
            const result = renderField(checkboxField, 0)

            expect(result).toEqual(['  Checkbox Field', 'mocked-checkbox-unselected'])
        })
    })

    describe('when field is a Separator', () => {
        it('should return the separator as is', () => {
            const separator = new Separator()
            const renderField = fieldToTableRow(0)
            const result = renderField(separator, 0)

            expect(result).toBe(separator)
        })

        it('should return separator regardless of selection state', () => {
            const separator = new Separator('--- Custom Separator ---')
            const renderField = fieldToTableRow(5)
            const result = renderField(separator, 0)

            expect(result).toBe(separator)
        })
    })

    describe('multiple field scenarios', () => {
        it('should handle different field types with correct selection logic', () => {
            const fields = [textField, booleanField, radioField, checkboxField]
            const renderField = fieldToTableRow(2) // Select radio field

            const results = fields.map((field, index) => renderField(field, index))

            expect(results).toEqual([
                ['  Text Field', 'Sample text'], // Not selected
                ['  Boolean Field', 'mocked-boolean-unselected'], // Not selected
                [green('→ Radio Field'), 'mocked-radio-selected'], // Selected
                ['  Checkbox Field', 'mocked-checkbox-unselected'], // Not selected
            ])
        })

        it('should handle mixed fields with separators', () => {
            const separator1 = new Separator('--- Section 1 ---')
            const separator2 = new Separator()
            const fieldsWithSeparators = [textField, separator1, booleanField, separator2, radioField]
            const renderField = fieldToTableRow(2) // Select boolean field (index 2)

            const results = fieldsWithSeparators.map((field, index) => renderField(field, index))

            expect(results).toEqual([
                ['  Text Field', 'Sample text'], // Index 0, not selected
                separator1, // Index 1, separator
                [green('→ Boolean Field'), 'mocked-boolean-selected'], // Index 2, selected
                separator2, // Index 3, separator
                ['  Radio Field', 'mocked-radio-unselected'], // Index 4, not selected
            ])
        })
    })

    describe('edge cases', () => {
        it('should handle negative selectedIndex', () => {
            const renderField = fieldToTableRow(-1)
            const result = renderField(textField, 0)

            expect(result).toEqual(['  Text Field', 'Sample text'])
        })

        it('should handle selectedIndex larger than array', () => {
            const renderField = fieldToTableRow(100)
            const result = renderField(textField, 0)

            expect(result).toEqual(['  Text Field', 'Sample text'])
        })

        it('should handle field with special characters in name', () => {
            const specialField: TextField = {
                type: 'text',
                name: 'Field with émojis 🎉 and "quotes"',
                value: 'Special value',
            }
            const renderField = fieldToTableRow(0)
            const result = renderField(specialField, 0)

            expect(result).toEqual([green('→ Field with émojis 🎉 and "quotes"'), bgGray(white('Special value'))])
        })

        it('should handle field with very long values', () => {
            const longValueField: TextField = {
                type: 'text',
                name: 'Long Field',
                value: 'This is a very long value that might wrap or cause display issues in some scenarios but should be handled gracefully',
            }
            const renderField = fieldToTableRow(0)
            const result = renderField(longValueField, 0)

            expect(result).toEqual([
                green('→ Long Field'),
                bgGray(
                    white(
                        'This is a very long value that might wrap or cause display issues in some scenarios but should be handled gracefully',
                    ),
                ),
            ])
        })
    })

    describe('function return behavior', () => {
        it('should return a function that can be used with Array.map', () => {
            const renderField = fieldToTableRow(1)

            expect(typeof renderField).toBe('function')
            expect(renderField.length).toBe(2) // Function should accept 2 parameters
        })

        it('should work with Array.map on field arrays', () => {
            const fields = [textField, booleanField, radioField]
            const renderField = fieldToTableRow(1)

            const results = fields.map(renderField)

            expect(results).toHaveLength(3)
            expect(results[0]).toEqual(['  Text Field', 'Sample text'])
            expect(results[1]).toEqual([green('→ Boolean Field'), 'mocked-boolean-selected'])
            expect(results[2]).toEqual(['  Radio Field', 'mocked-radio-unselected'])
        })
    })
})
