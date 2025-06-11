import type { KeypressEvent } from '@inquirer/core'
import { Separator } from '@inquirer/core'
import type { BooleanField, InquirerReadline, InternalFields, RadioField, TextField } from 'src/util/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { editTextField } from './editText.js'

// Mock clipboardy
vi.mock('clipboardy', () => ({
    default: {
        readSync: vi.fn(),
    },
}))

describe('editTextField', async () => {
    // Mock readline instance
    const mockRl = {
        line: '',
    } as unknown as InquirerReadline

    // Mock clipboard
    const mockClipboard = vi.mocked((await import('clipboardy')).default)

    // Sample fields for testing
    const textField: TextField = {
        type: 'text',
        label: 'Test Text',
        value: 'initial value',
    }

    const radioField: RadioField = {
        type: 'radio',
        label: 'Test Radio',
        choices: ['Option 1', 'Option 2'],
        value: 'Option 1',
    }

    const booleanField: BooleanField = {
        type: 'boolean',
        label: 'Test Boolean',
        value: true,
    }

    beforeEach(() => {
        vi.clearAllMocks()
        mockRl.line = ''
        mockClipboard.readSync.mockReturnValue('')
    })

    describe('arrow key handling', () => {
        it('should ignore left arrow key and return original fields unchanged', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'left' } as KeypressEvent

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result).toBe(fields) // Should return the exact same reference
            expect(result).toEqual(fields)
        })

        it('should ignore right arrow key and return original fields unchanged', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'right' } as KeypressEvent

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result).toBe(fields) // Should return the exact same reference
            expect(result).toEqual(fields)
        })

        it('should ignore left arrow key with modifiers', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'left', ctrl: true } as KeypressEvent

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result).toBe(fields)
        })

        it('should ignore right arrow key with modifiers', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'right', shift: true, ctrl: false } as KeypressEvent

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result).toBe(fields)
        })
    })

    describe('regular typing behavior', () => {
        it('should update text field value from rl.line for regular keys', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'a' } as KeypressEvent
            mockRl.line = 'new text value'

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result).not.toBe(fields) // Should create new array
            expect(result[0]).toEqual({
                ...textField,
                value: 'new text value',
            })
            expect((result[0] as TextField).value).toBe('new text value')
        })

        it('should handle empty rl.line', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'backspace' } as KeypressEvent
            mockRl.line = ''

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect((result[0] as TextField).value).toBe('')
        })

        it('should handle special characters in rl.line', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'space' } as KeypressEvent
            mockRl.line = 'Special chars: !@#$%^&*()_+-=[]{}|;:\'",.<>?/`~'

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect((result[0] as TextField).value).toBe('Special chars: !@#$%^&*()_+-=[]{}|;:\'",.<>?/`~')
        })

        it('should handle unicode characters in rl.line', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'u' } as KeypressEvent
            mockRl.line = '🚀 Unicode: café naïve résumé 日本語 中文 🎉'

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect((result[0] as TextField).value).toBe('🚀 Unicode: café naïve résumé 日本語 中文 🎉')
        })

        it('should handle newlines and tabs in rl.line', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'enter' } as KeypressEvent
            mockRl.line = 'Line 1\nLine 2\tTabbed'

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect((result[0] as TextField).value).toBe('Line 1\nLine 2\tTabbed')
        })

        it('should handle very long text in rl.line', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'a' } as KeypressEvent
            const longText = 'a'.repeat(10000)
            mockRl.line = longText

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect((result[0] as TextField).value).toBe(longText)
            expect((result[0] as TextField).value?.length).toBe(10000)
        })
    })

    describe('clipboard paste behavior', () => {
        it('should use clipboard value when Ctrl+V is pressed', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'v', ctrl: true } as KeypressEvent
            mockRl.line = 'current input'
            mockClipboard.readSync.mockReturnValue('pasted text')

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(mockClipboard.readSync).toHaveBeenCalledOnce()
            expect((result[0] as TextField).value).toBe('pasted text')
        })

        it('should handle empty clipboard on paste', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'v', ctrl: true } as KeypressEvent
            mockRl.line = 'current input'
            mockClipboard.readSync.mockReturnValue('')

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect((result[0] as TextField).value).toBe('')
        })

        it('should handle special characters in clipboard', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'v', ctrl: true } as KeypressEvent
            mockClipboard.readSync.mockReturnValue('Clipboard: !@#$%^&*()_+-=[]{}|;:\'",.<>?/`~')

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect((result[0] as TextField).value).toBe('Clipboard: !@#$%^&*()_+-=[]{}|;:\'",.<>?/`~')
        })

        it('should handle unicode in clipboard', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'v', ctrl: true } as KeypressEvent
            mockClipboard.readSync.mockReturnValue('🎨 Clipboard: café naïve résumé 日本語 中文 🌟')

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect((result[0] as TextField).value).toBe('🎨 Clipboard: café naïve résumé 日本語 中文 🌟')
        })

        it('should handle multiline clipboard content', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'v', ctrl: true } as KeypressEvent
            mockClipboard.readSync.mockReturnValue('Line 1\nLine 2\nLine 3')

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect((result[0] as TextField).value).toBe('Line 1\nLine 2\nLine 3')
        })

        it('should not use clipboard for Ctrl+V without ctrl flag', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'v' } as KeypressEvent
            mockRl.line = 'typed v'
            mockClipboard.readSync.mockReturnValue('clipboard content')

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(mockClipboard.readSync).not.toHaveBeenCalled()
            expect((result[0] as TextField).value).toBe('typed v')
        })

        it('should not use clipboard for other keys with ctrl', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'c', ctrl: true } as KeypressEvent
            mockRl.line = 'ctrl+c pressed'
            mockClipboard.readSync.mockReturnValue('clipboard content')

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(mockClipboard.readSync).not.toHaveBeenCalled()
            expect((result[0] as TextField).value).toBe('ctrl+c pressed')
        })
    })

    describe('multiple fields scenarios', () => {
        it('should update only the focused text field in mixed field types', () => {
            const fields = [radioField, textField, booleanField]
            const key: KeypressEvent = { name: 'a' } as KeypressEvent
            mockRl.line = 'updated text'

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 1,
                key,
                rl: mockRl,
            })

            expect(result).toHaveLength(3)
            expect(result[0]).toBe(radioField) // Unchanged reference
            expect(result[2]).toBe(booleanField) // Unchanged reference
            expect(result[1]).toEqual({
                ...textField,
                value: 'updated text',
            })
        })

        it('should handle multiple text fields correctly', () => {
            const textField1 = { ...textField, label: 'Text 1', value: 'value 1' }
            const textField2 = { ...textField, label: 'Text 2', value: 'value 2' }
            const textField3 = { ...textField, label: 'Text 3', value: 'value 3' }
            const fields = [textField1, textField2, textField3]
            const key: KeypressEvent = { name: 'b' } as KeypressEvent
            mockRl.line = 'middle field updated'

            const result = editTextField({
                fields,
                currentField: textField2,
                focusedIndex: 1,
                key,
                rl: mockRl,
            })

            expect(result[0]).toBe(textField1) // Unchanged
            expect(result[2]).toBe(textField3) // Unchanged
            expect((result[1] as TextField).value).toBe('middle field updated')
            expect((result[1] as TextField).label).toBe('Text 2')
        })

        it('should work with separators in fields array', () => {
            const separator = new Separator('--- Section ---')
            const fields = [textField, separator, radioField]
            const key: KeypressEvent = { name: 'x' } as KeypressEvent
            mockRl.line = 'text with separator'

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result[1]).toBe(separator) // Separator unchanged
            expect(result[2]).toBe(radioField) // Radio field unchanged
            expect((result[0] as TextField).value).toBe('text with separator')
        })

        it('should update first field when focusedIndex is 0', () => {
            const fields = [textField, radioField, booleanField]
            const key: KeypressEvent = { name: 'f' } as KeypressEvent
            mockRl.line = 'first field'

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect((result[0] as TextField).value).toBe('first field')
            expect(result[1]).toBe(radioField)
            expect(result[2]).toBe(booleanField)
        })

        it('should update last field when focusedIndex is last', () => {
            const lastTextField = { ...textField, label: 'Last Text' }
            const fields = [radioField, booleanField, lastTextField]
            const key: KeypressEvent = { name: 'l' } as KeypressEvent
            mockRl.line = 'last field'

            const result = editTextField({
                fields,
                currentField: lastTextField,
                focusedIndex: 2,
                key,
                rl: mockRl,
            })

            expect(result[0]).toBe(radioField)
            expect(result[1]).toBe(booleanField)
            expect((result[2] as TextField).value).toBe('last field')
        })
    })

    describe('edge cases and data integrity', () => {
        it('should preserve all original field properties except value', () => {
            const complexTextField: TextField = {
                type: 'text',
                label: 'Complex Text Field',
                value: 'original',
                // Add any other properties that might exist
            }
            const fields = [complexTextField]
            const key: KeypressEvent = { name: 'n' } as KeypressEvent
            mockRl.line = 'new value'

            const result = editTextField({
                fields,
                currentField: complexTextField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            const updatedField = result[0] as TextField
            expect(updatedField.type).toBe('text')
            expect(updatedField.label).toBe('Complex Text Field')
            expect(updatedField.value).toBe('new value')
        })

        it('should create immutable updates (new array reference)', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 't' } as KeypressEvent
            mockRl.line = 'test immutability'

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result).not.toBe(fields) // Different array reference
            expect(result[0]).not.toBe(textField) // Different object reference
        })

        it('should handle null/undefined rl.line gracefully', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'n' } as KeypressEvent
            // @ts-expect-error Just a test
            mockRl.line = null

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect((result[0] as TextField).value).toBe(null)
        })

        it('should handle clipboard read errors gracefully', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'v', ctrl: true } as KeypressEvent
            mockRl.line = 'fallback text'
            mockClipboard.readSync.mockImplementation(() => {
                throw new Error('Clipboard access denied')
            })

            expect(() => {
                editTextField({
                    fields,
                    currentField: textField,
                    focusedIndex: 0,
                    key,
                    rl: mockRl,
                })
            }).toThrow('Clipboard access denied')
        })

        it('should work with empty fields array edge case', () => {
            const fields: InternalFields = []
            const key: KeypressEvent = { name: 'e' } as KeypressEvent
            mockRl.line = 'empty array test'

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect(result).toEqual([
                {
                    ...textField,
                    value: 'empty array test',
                },
            ])
        })
    })

    describe('key modifier combinations', () => {
        it('should handle shift+key combinations (non-paste)', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'a', shift: true, ctrl: false } as KeypressEvent
            mockRl.line = 'SHIFT+A'

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect((result[0] as TextField).value).toBe('SHIFT+A')
        })

        it('should handle alt+key combinations', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'a', meta: true, ctrl: false } as KeypressEvent
            mockRl.line = 'alt+a pressed'

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect((result[0] as TextField).value).toBe('alt+a pressed')
        })

        it('should handle ctrl+shift+key combinations (non-paste)', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'z', ctrl: true, shift: true } as KeypressEvent
            mockRl.line = 'ctrl+shift+z'

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect((result[0] as TextField).value).toBe('ctrl+shift+z')
        })
    })

    describe('special key names', () => {
        it('should handle enter key', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'return' } as KeypressEvent
            mockRl.line = 'enter pressed'

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect((result[0] as TextField).value).toBe('enter pressed')
        })

        it('should handle backspace key', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'backspace' } as KeypressEvent
            mockRl.line = 'after backspace'

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect((result[0] as TextField).value).toBe('after backspace')
        })

        it('should handle delete key', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'delete' } as KeypressEvent
            mockRl.line = 'after delete'

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect((result[0] as TextField).value).toBe('after delete')
        })

        it('should handle escape key', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'escape' } as KeypressEvent
            mockRl.line = 'escape pressed'

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect((result[0] as TextField).value).toBe('escape pressed')
        })

        it('should handle tab key', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'tab', ctrl: false }
            mockRl.line = 'tab\tkey'

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect((result[0] as TextField).value).toBe('tab\tkey')
        })

        it('should handle space key', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'space', ctrl: false }
            mockRl.line = 'space key pressed'

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect((result[0] as TextField).value).toBe('space key pressed')
        })
    })

    describe('boundary conditions', () => {
        it('should handle focusedIndex at boundary (0)', () => {
            const fields = [textField, radioField]
            const key: KeypressEvent = { name: 'b', ctrl: false }
            mockRl.line = 'boundary test'

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect((result[0] as TextField).value).toBe('boundary test')
            expect(result[1]).toBe(radioField)
        })

        it('should handle very large focusedIndex', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'l', ctrl: false }
            mockRl.line = 'large index'

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 999,
                key,
                rl: mockRl,
            })

            // Should still work, creating sparse array
            expect(result[999]).toEqual({
                ...textField,
                value: 'large index',
            })
        })

        it('should handle negative focusedIndex gracefully', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'n', ctrl: false }
            mockRl.line = 'negative index'

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: -1,
                key,
                rl: mockRl,
            })

            // JavaScript allows negative array indices as properties
            expect(result[-1]).toEqual({
                ...textField,
                value: 'negative index',
            })
        })
    })

    describe('clipboard edge cases', () => {
        it('should handle clipboard with very long content', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'v', ctrl: true }
            const longClipboardContent = 'x'.repeat(100000)
            mockClipboard.readSync.mockReturnValue(longClipboardContent)

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect((result[0] as TextField).value).toBe(longClipboardContent)
            expect((result[0] as TextField).value?.length).toBe(100000)
        })

        it('should handle clipboard returning null/undefined', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'v', ctrl: true }
            // @ts-expect-error Just a test
            mockClipboard.readSync.mockReturnValue(null)

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect((result[0] as TextField).value).toBe(null)
        })

        it('should prioritize clipboard over rl.line for paste operation', () => {
            const fields = [textField]
            const key: KeypressEvent = { name: 'v', ctrl: true } as KeypressEvent
            mockRl.line = 'current typing'
            mockClipboard.readSync.mockReturnValue('clipboard wins')

            const result = editTextField({
                fields,
                currentField: textField,
                focusedIndex: 0,
                key,
                rl: mockRl,
            })

            expect((result[0] as TextField).value).toBe('clipboard wins')
        })
    })
})
