import type { KeypressEvent } from '@inquirer/core'
import { Separator } from '@inquirer/core'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { BooleanField, InquirerReadline, InternalFields, RadioField, TextField } from '../util/types.js'
import { handleNavigation } from './handleNavigation.js'

describe('handleNavigation', () => {
    // Mock readline instance
    const mockRl = {
        clearLine: vi.fn(),
    } as unknown as InquirerReadline

    // Mock setSelectedIndex function
    const mockSetSelectedIndex = vi.fn()

    // Sample fields for testing
    const textField: TextField = {
        type: 'text',
        name: 'Test Text',
        value: 'sample',
    }

    const radioField: RadioField = {
        type: 'radio',
        name: 'Test Radio',
        choices: ['Option 1', 'Option 2', 'Option 3'],
        value: 'Option 1',
    }

    const booleanField: BooleanField = {
        type: 'boolean',
        name: 'Test Boolean',
        value: true,
    }

    const separator = new Separator('--- Section ---')

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('down key navigation', () => {
        it('should move from first field to second field', () => {
            const fields: InternalFields = [textField, radioField, booleanField]
            const selectedIndex = 0
            const key: KeypressEvent = { name: 'down' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(1)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should move from middle field to next field', () => {
            const fields: InternalFields = [textField, radioField, booleanField]
            const selectedIndex = 1
            const key: KeypressEvent = { name: 'down' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(2)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should wrap from last field to first field', () => {
            const fields: InternalFields = [textField, radioField, booleanField]
            const selectedIndex = 2
            const key: KeypressEvent = { name: 'down' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(0)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should skip separators when moving down', () => {
            const fields: InternalFields = [textField, separator, radioField, booleanField]
            const selectedIndex = 0
            const key: KeypressEvent = { name: 'down' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(2) // Skip separator at index 1
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should handle multiple consecutive separators', () => {
            const separator2 = new Separator('--- Another ---')
            const fields: InternalFields = [textField, separator, separator2, radioField]
            const selectedIndex = 0
            const key: KeypressEvent = { name: 'down' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(3) // Skip both separators
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should wrap to beginning when all remaining fields are separators', () => {
            const fields: InternalFields = [textField, radioField, separator, separator]
            const selectedIndex = 1
            const key: KeypressEvent = { name: 'down' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(0) // Wrap to start since only separators remain
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })
    })

    describe('up key navigation', () => {
        it('should move from last field to previous field', () => {
            const fields: InternalFields = [textField, radioField, booleanField]
            const selectedIndex = 2
            const key: KeypressEvent = { name: 'up' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(1)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should move from middle field to previous field', () => {
            const fields: InternalFields = [textField, radioField, booleanField]
            const selectedIndex = 1
            const key: KeypressEvent = { name: 'up' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(0)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should wrap from first field to last field', () => {
            const fields: InternalFields = [textField, radioField, booleanField]
            const selectedIndex = 0
            const key: KeypressEvent = { name: 'up' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(2)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should skip separators when moving up', () => {
            const fields: InternalFields = [textField, radioField, separator, booleanField]
            const selectedIndex = 3
            const key: KeypressEvent = { name: 'up' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(1) // Skip separator at index 2
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should handle multiple consecutive separators when moving up', () => {
            const separator2 = new Separator('--- Another ---')
            const fields: InternalFields = [textField, separator, separator2, booleanField]
            const selectedIndex = 3
            const key: KeypressEvent = { name: 'up' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(0) // Skip both separators
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should wrap to last non-separator from first when previous fields are separators', () => {
            const fields: InternalFields = [separator, separator, textField, radioField]
            const selectedIndex = 2
            const key: KeypressEvent = { name: 'up' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(3) // Wrap to last non-separator
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })
    })

    describe('tab key navigation', () => {
        it('should behave like down key - move to next field', () => {
            const fields: InternalFields = [textField, radioField, booleanField]
            const selectedIndex = 0
            const key: KeypressEvent = { name: 'tab' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(1)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should wrap from last field to first field like down key', () => {
            const fields: InternalFields = [textField, radioField, booleanField]
            const selectedIndex = 2
            const key: KeypressEvent = { name: 'tab' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(0)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should skip separators like down key', () => {
            const fields: InternalFields = [textField, separator, radioField]
            const selectedIndex = 0
            const key: KeypressEvent = { name: 'tab' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(2)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })
    })

    describe('non-navigation keys', () => {
        it('should return false for enter key', () => {
            const fields: InternalFields = [textField, radioField]
            const selectedIndex = 0
            const key: KeypressEvent = { name: 'return' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(false)
            expect(mockSetSelectedIndex).not.toHaveBeenCalled()
            expect(mockRl.clearLine).not.toHaveBeenCalled()
        })

        it('should return false for left arrow key', () => {
            const fields: InternalFields = [textField, radioField]
            const selectedIndex = 0
            const key: KeypressEvent = { name: 'left' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(false)
            expect(mockSetSelectedIndex).not.toHaveBeenCalled()
            expect(mockRl.clearLine).not.toHaveBeenCalled()
        })

        it('should return false for right arrow key', () => {
            const fields: InternalFields = [textField, radioField]
            const selectedIndex = 0
            const key: KeypressEvent = { name: 'right' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(false)
            expect(mockSetSelectedIndex).not.toHaveBeenCalled()
            expect(mockRl.clearLine).not.toHaveBeenCalled()
        })

        it('should return false for space key', () => {
            const fields: InternalFields = [textField, radioField]
            const selectedIndex = 0
            const key: KeypressEvent = { name: 'space' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(false)
            expect(mockSetSelectedIndex).not.toHaveBeenCalled()
            expect(mockRl.clearLine).not.toHaveBeenCalled()
        })

        it('should return false for alphanumeric keys', () => {
            const fields: InternalFields = [textField, radioField]
            const selectedIndex = 0
            const key: KeypressEvent = { name: 'a' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(false)
            expect(mockSetSelectedIndex).not.toHaveBeenCalled()
            expect(mockRl.clearLine).not.toHaveBeenCalled()
        })

        it('should return false for escape key', () => {
            const fields: InternalFields = [textField, radioField]
            const selectedIndex = 0
            const key: KeypressEvent = { name: 'escape' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(false)
            expect(mockSetSelectedIndex).not.toHaveBeenCalled()
            expect(mockRl.clearLine).not.toHaveBeenCalled()
        })
    })

    describe('edge cases with single field', () => {
        it('should wrap to itself when moving down from single field', () => {
            const fields: InternalFields = [textField]
            const selectedIndex = 0
            const key: KeypressEvent = { name: 'down' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(0)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should wrap to itself when moving up from single field', () => {
            const fields: InternalFields = [textField]
            const selectedIndex = 0
            const key: KeypressEvent = { name: 'up' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(0)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should handle single field with tab navigation', () => {
            const fields: InternalFields = [radioField]
            const selectedIndex = 0
            const key: KeypressEvent = { name: 'tab' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(0)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })
    })

    describe('edge cases with empty fields', () => {
        it('should handle empty fields array gracefully for down key', () => {
            const fields: InternalFields = []
            const selectedIndex = 0
            const key: KeypressEvent = { name: 'down' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(0)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should handle empty fields array gracefully for up key', () => {
            const fields: InternalFields = []
            const selectedIndex = 0
            const key: KeypressEvent = { name: 'up' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(0)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })
    })

    describe('edge cases with only separators', () => {
        it('should handle fields with only separators for down navigation', () => {
            const separator2 = new Separator('--- Another ---')
            const fields: InternalFields = [separator, separator2]
            const selectedIndex = 0
            const key: KeypressEvent = { name: 'down' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            // nextNonSeparatorIndex should return 0 when no non-separator fields exist
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(0)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should handle fields with only separators for up navigation', () => {
            const separator2 = new Separator('--- Another ---')
            const fields: InternalFields = [separator, separator2]
            const selectedIndex = 1
            const key: KeypressEvent = { name: 'up' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            // previousNonSeparatorIndex should return 1 (fields.length - 1) when no non-separator fields exist
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(1)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })
    })

    describe('boundary conditions', () => {
        it('should handle negative selectedIndex for down navigation', () => {
            const fields: InternalFields = [textField, radioField]
            const selectedIndex = -1
            const key: KeypressEvent = { name: 'down' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(0) // nextNonSeparatorIndex from -1
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should handle selectedIndex larger than array length for down navigation', () => {
            const fields: InternalFields = [textField, radioField]
            const selectedIndex = 10
            const key: KeypressEvent = { name: 'down' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(0)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should handle selectedIndex at array length minus 1 for up navigation', () => {
            const fields: InternalFields = [textField, radioField, booleanField]
            const selectedIndex = 2 // Last valid index
            const key: KeypressEvent = { name: 'up' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(1)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })
    })

    describe('complex separator scenarios', () => {
        it('should handle separator at beginning and end', () => {
            const fields: InternalFields = [separator, textField, radioField, separator]
            const selectedIndex = 1
            const key: KeypressEvent = { name: 'down' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(2)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should handle separator in middle with up navigation', () => {
            const fields: InternalFields = [textField, separator, radioField, booleanField]
            const selectedIndex = 2
            const key: KeypressEvent = { name: 'up' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(0) // Skip separator at index 1
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should handle wrapping with separators at end', () => {
            const fields: InternalFields = [textField, radioField, separator, separator]
            const selectedIndex = 1
            const key: KeypressEvent = { name: 'down' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(0) // Wrap to beginning
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should handle wrapping with separators at beginning', () => {
            const fields: InternalFields = [separator, separator, textField, radioField]
            const selectedIndex = 2
            const key: KeypressEvent = { name: 'up' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(3) // Wrap to last non-separator
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })
    })

    describe('key modifiers', () => {
        it('should handle down key with ctrl modifier', () => {
            const fields: InternalFields = [textField, radioField]
            const selectedIndex = 0
            const key: KeypressEvent = { name: 'down', ctrl: true } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(1)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should handle up key with shift modifier', () => {
            const fields: InternalFields = [textField, radioField]
            const selectedIndex = 1
            const key: KeypressEvent = { name: 'up', shift: true, ctrl: false } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(0)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should handle tab key with alt modifier', () => {
            const fields: InternalFields = [textField, radioField]
            const selectedIndex = 0
            const key: KeypressEvent = { name: 'tab', meta: true, ctrl: false } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(1)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })
    })

    describe('different field types', () => {
        it('should navigate between different field types', () => {
            const checkboxField = {
                type: 'checkbox' as const,
                name: 'Test Checkbox',
                choices: ['Choice 1', 'Choice 2'],
                value: ['Choice 1'],
                highlightIndex: 0,
            }

            const fields: InternalFields = [textField, radioField, booleanField, checkboxField]
            const selectedIndex = 0
            const key: KeypressEvent = { name: 'down' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(1)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })

        it('should handle navigation from checkbox field', () => {
            const checkboxField = {
                type: 'checkbox' as const,
                name: 'Test Checkbox',
                choices: ['Choice 1', 'Choice 2'],
                value: ['Choice 1'],
                highlightIndex: 0,
            }

            const fields: InternalFields = [textField, checkboxField, radioField]
            const selectedIndex = 1
            const key: KeypressEvent = { name: 'up' } as KeypressEvent

            const result = handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(result).toBe(true)
            expect(mockSetSelectedIndex).toHaveBeenCalledWith(0)
            expect(mockRl.clearLine).toHaveBeenCalledWith(0)
        })
    })

    describe('console line clearing', () => {
        it('should always call clearLine with 0 for navigation keys', () => {
            const fields: InternalFields = [textField, radioField]
            const navigationKeys = ['down', 'up', 'tab']

            navigationKeys.forEach((keyName) => {
                vi.clearAllMocks()
                const key: KeypressEvent = { name: keyName } as KeypressEvent

                handleNavigation({
                    fields,
                    selectedIndex: 0,
                    setSelectedIndex: mockSetSelectedIndex,
                    key,
                    rl: mockRl,
                })

                expect(mockRl.clearLine).toHaveBeenCalledWith(0)
            })
        })

        it('should not call clearLine for non-navigation keys', () => {
            const fields: InternalFields = [textField, radioField]
            const nonNavigationKeys = ['left', 'right', 'space', 'enter', 'return', 'a', 'escape']

            nonNavigationKeys.forEach((keyName) => {
                vi.clearAllMocks()
                const key: KeypressEvent = { name: keyName } as KeypressEvent

                handleNavigation({
                    fields,
                    selectedIndex: 0,
                    setSelectedIndex: mockSetSelectedIndex,
                    key,
                    rl: mockRl,
                })

                expect(mockRl.clearLine).not.toHaveBeenCalled()
            })
        })
    })

    describe('setSelectedIndex call patterns', () => {
        it('should only call setSelectedIndex once per navigation', () => {
            const fields: InternalFields = [textField, radioField, booleanField]
            const selectedIndex = 1
            const key: KeypressEvent = { name: 'down' } as KeypressEvent

            handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(mockSetSelectedIndex).toHaveBeenCalledTimes(1)
        })

        it('should not call setSelectedIndex for non-navigation keys', () => {
            const fields: InternalFields = [textField, radioField]
            const selectedIndex = 0
            const key: KeypressEvent = { name: 'space' } as KeypressEvent

            handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(mockSetSelectedIndex).not.toHaveBeenCalled()
        })
    })

    describe('return value behavior', () => {
        it('should return true for all navigation keys', () => {
            const fields: InternalFields = [textField, radioField]
            const navigationKeys = ['down', 'up', 'tab']

            navigationKeys.forEach((keyName) => {
                const key: KeypressEvent = { name: keyName } as KeypressEvent
                const result = handleNavigation({
                    fields,
                    selectedIndex: 0,
                    setSelectedIndex: mockSetSelectedIndex,
                    key,
                    rl: mockRl,
                })

                expect(result).toBe(true)
            })
        })

        it('should return false for all non-navigation keys', () => {
            const fields: InternalFields = [textField, radioField]
            const nonNavigationKeys = ['left', 'right', 'space', 'enter', 'return', 'a', 'escape', 'backspace']

            nonNavigationKeys.forEach((keyName) => {
                const key: KeypressEvent = { name: keyName } as KeypressEvent
                const result = handleNavigation({
                    fields,
                    selectedIndex: 0,
                    setSelectedIndex: mockSetSelectedIndex,
                    key,
                    rl: mockRl,
                })

                expect(result).toBe(false)
            })
        })
    })

    describe('data integrity', () => {
        it('should not modify the fields array', () => {
            const fields: InternalFields = [textField, radioField, booleanField]
            const originalFields = [...fields]
            const selectedIndex = 1
            const key: KeypressEvent = { name: 'down' } as KeypressEvent

            handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(fields).toEqual(originalFields)
            expect(fields[0]).toBe(textField)
            expect(fields[1]).toBe(radioField)
            expect(fields[2]).toBe(booleanField)
        })

        it('should not modify individual field objects', () => {
            const originalTextField = { ...textField }
            const originalRadioField = { ...radioField }
            const fields: InternalFields = [textField, radioField]
            const selectedIndex = 0
            const key: KeypressEvent = { name: 'down' } as KeypressEvent

            handleNavigation({
                fields,
                selectedIndex,
                setSelectedIndex: mockSetSelectedIndex,
                key,
                rl: mockRl,
            })

            expect(textField).toEqual(originalTextField)
            expect(radioField).toEqual(originalRadioField)
        })
    })
})
