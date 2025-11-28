import { createPrompt, Separator } from '@inquirer/core'
import { render } from '@inquirer/testing'
import { promptCreator } from 'src/promptCreator.js'
import type { Config, ReturnedItems } from 'src/util/types.js'
import { describe, expect, it } from 'vitest'

// Create a proper prompt function compatible with @inquirer/testing
const formPrompt = createPrompt<ReturnedItems, Config>(promptCreator)

describe('Form Prompt', () => {
    describe('Basic Rendering', () => {
        it('should render a form with text fields', async () => {
            const { getScreen } = await render(formPrompt, {
                message: 'Please fill out this form',
                fields: [
                    {
                        type: 'text',
                        label: 'Full Name',
                        value: 'John Doe',
                    },
                    {
                        type: 'text',
                        label: 'Email',
                        value: 'john@example.com',
                    },
                ],
            })

            const screen = getScreen()
            expect(screen).toContain('Please fill out this form')
            expect(screen).toContain(' → Full Name')
            expect(screen).toContain('  Email')
            expect(screen).toContain('John Doe')
            expect(screen).toContain('john@example.com')
            expect(screen).toContain('(tab/arrows to move between fields, enter to finish)')
        })

        it('should render a form with boolean fields', async () => {
            const { getScreen } = await render(formPrompt, {
                message: 'Settings',
                fields: [
                    {
                        type: 'boolean',
                        label: 'Enable notifications',
                        value: true,
                    },
                    {
                        type: 'boolean',
                        label: 'Auto-save',
                        value: false,
                    },
                ],
            })

            const screen = getScreen()
            expect(screen).toContain('? Settings')
            expect(screen).toContain(' → Enable notifications')
            expect(screen).toContain('  Auto-save')
            expect(screen).toContain('true')
            expect(screen).toContain('false')
        })

        it('should render a form with radio fields', async () => {
            const { getScreen } = await render(formPrompt, {
                message: 'Select option',
                fields: [
                    {
                        type: 'radio',
                        label: 'Preferred language',
                        choices: ['JavaScript', 'TypeScript', 'Python'],
                        value: 'TypeScript',
                    },
                ],
            })

            const screen = getScreen()
            expect(screen).toContain('Select option')
            expect(screen).toContain('Preferred language')
            expect(screen).toContain('TypeScript')
        })

        it('should render a form with checkbox fields', async () => {
            const { getScreen } = await render(formPrompt, {
                message: 'Select technologies',
                fields: [
                    {
                        type: 'checkbox',
                        label: 'Technologies',
                        choices: ['React', 'Vue', 'Angular', 'Svelte'],
                        value: ['React', 'Vue'],
                    },
                ],
            })

            const screen = getScreen()
            expect(screen).toContain('Select technologies')
            expect(screen).toContain('Technologies')
            expect(screen).toContain('☒ React  ☒ Vue  ☐ Angular  ☐ Svelte')
        })

        it('should render a form with separators', async () => {
            const { getScreen } = await render(formPrompt, {
                message: 'User Profile',
                fields: [
                    {
                        type: 'text',
                        label: 'Name',
                        value: 'John',
                    },
                    new Separator('--- Contact Information ---'),
                    {
                        type: 'text',
                        label: 'Email',
                        value: 'john@example.com',
                    },
                    {
                        type: 'text',
                        label: 'Phone',
                        value: '+1234567890',
                    },
                ],
            })

            const screen = getScreen()
            expect(screen).toContain('User Profile')
            expect(screen).toContain('Name')
            expect(screen).toContain('--- Contact Information ---')
            expect(screen).toContain('Email')
            expect(screen).toContain('Phone')
        })

        it('should render submessage when provided', async () => {
            const { getScreen } = await render(formPrompt, {
                message: 'Main message',
                submessage: 'Additional instructions here',
                fields: [
                    {
                        type: 'text',
                        label: 'Field',
                        value: '',
                    },
                ],
            })

            const screen = getScreen()
            expect(screen).toContain('Main message')
            expect(screen).toContain('Additional instructions here')
        })

        it('should work without a main message', async () => {
            const { getScreen } = await render(formPrompt, {
                fields: [
                    {
                        type: 'text',
                        label: 'Field',
                        value: 'value',
                    },
                ],
            })

            const screen = getScreen()
            expect(screen).toContain('Field')
            expect(screen).toContain('value')
            expect(screen).toContain('(tab/arrows to move between fields, enter to finish)')
        })
    })

    describe('Field Selection and Cursor', () => {
        it('should handle initial field selection correctly', async () => {
            const { getScreen } = await render(formPrompt, {
                fields: [
                    new Separator('--- Header ---'),
                    {
                        type: 'text',
                        label: 'First selectable field',
                        value: '',
                    },
                    {
                        type: 'text',
                        label: 'Second field',
                        value: '',
                    },
                ],
            })

            const screen = getScreen()
            expect(screen).toContain('First selectable field')
            expect(screen).toContain('Second field')
            // The first selectable field should be focused (indicated by arrow)
            expect(screen).toContain('→')
        })

        it('should show field description when field is focused', async () => {
            const { getScreen } = await render(formPrompt, {
                fields: [
                    {
                        type: 'text',
                        label: 'API Key',
                        value: '',
                        description: 'Enter your API key from the dashboard',
                    },
                    {
                        type: 'boolean',
                        label: 'Debug mode',
                        value: false,
                    },
                ],
            })

            const screen = getScreen()
            expect(screen).toContain('API Key')
            expect(screen).toContain('Enter your API key from the dashboard')
        })
    })

    describe('Navigation and Interaction', () => {
        it('should allow navigation between fields with arrow keys', async () => {
            const { getScreen, events } = await render(formPrompt, {
                message: 'Test Navigation',
                fields: [
                    {
                        type: 'text',
                        label: 'First Field',
                        value: 'value1',
                    },
                    {
                        type: 'text',
                        label: 'Second Field',
                        value: 'value2',
                    },
                    {
                        type: 'boolean',
                        label: 'Third Field',
                        value: true,
                    },
                ],
            })

            // Initially, first field should be focused
            expect(getScreen()).toContain('→ First Field')

            // Navigate down to second field
            events.keypress('down')
            expect(getScreen()).toContain('→ Second Field')

            // Navigate down to third field
            events.keypress('down')
            expect(getScreen()).toContain('→ Third Field')

            // Navigate back up
            events.keypress('up')
            expect(getScreen()).toContain('→ Second Field')
        })

        it('should complete the form when enter is pressed', async () => {
            const { answer, events } = await render(formPrompt, {
                message: 'Complete this form',
                fields: [
                    {
                        type: 'text',
                        label: 'Username',
                        value: 'testuser',
                    },
                    {
                        type: 'boolean',
                        label: 'Active',
                        value: true,
                    },
                ],
            })

            // Press enter to submit the form
            events.keypress('enter')

            await expect(answer).resolves.toEqual([
                {
                    type: 'text',
                    label: 'Username',
                    value: 'testuser',
                },
                {
                    type: 'boolean',
                    label: 'Active',
                    value: true,
                },
            ])
        })

        it('should handle escape key to cancel', async () => {
            const { answer, events } = await render(formPrompt, {
                message: 'Test Cancel',
                fields: [
                    {
                        type: 'text',
                        label: 'Field',
                        value: 'value',
                    },
                ],
            })

            // Press escape to cancel
            events.keypress('escape')

            expect(await answer).toBeTypeOf('symbol')
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            expect((await answer).toString()).toMatch('Escape key pressed')
        })
    })

    describe('Mixed Field Types', () => {
        it('should render complex forms with all field types', async () => {
            const { getScreen } = await render(formPrompt, {
                message: 'Complete Survey',
                submessage: 'Please fill out all fields',
                fields: [
                    {
                        type: 'text',
                        label: 'Full Name',
                        value: 'Jane Doe',
                    },
                    {
                        type: 'text',
                        label: 'Email',
                        value: 'jane@example.com',
                    },
                    new Separator('--- Preferences ---'),
                    {
                        type: 'boolean',
                        label: 'Subscribe to newsletter',
                        value: true,
                    },
                    {
                        type: 'radio',
                        label: 'Preferred contact method',
                        choices: ['Email', 'Phone', 'SMS'],
                        value: 'Email',
                    },
                    {
                        type: 'checkbox',
                        label: 'Topics of interest',
                        choices: ['Technology', 'Sports', 'Music', 'Travel'],
                        value: ['Technology', 'Music'],
                    },
                ],
            })

            const screen = getScreen()
            expect(screen).toContain('Complete Survey')
            expect(screen).toContain('Please fill out all fields')
            expect(screen).toContain('Full Name')
            expect(screen).toContain('Email')
            expect(screen).toContain('--- Preferences ---')
            expect(screen).toContain('Subscribe to newsletter')
            expect(screen).toContain('Preferred contact method')
            expect(screen).toContain('Topics of interest')
        })
    })

    describe('Edge Cases', () => {
        it('should handle fields with undefined values', async () => {
            const { getScreen } = await render(formPrompt, {
                message: 'Edge cases',
                fields: [
                    {
                        type: 'text',
                        label: 'Optional field',
                        value: undefined,
                    },
                    {
                        type: 'boolean',
                        label: 'Optional boolean',
                        value: undefined,
                    },
                    {
                        type: 'radio',
                        label: 'Optional radio',
                        choices: ['A', 'B'],
                        value: undefined,
                    },
                ],
            })

            const screen = getScreen()
            expect(screen).toContain('Edge cases')
            expect(screen).toContain('Optional field')
            expect(screen).toContain('Optional boolean')
            expect(screen).toContain('Optional radio')
        })

        it('should handle empty arrays for checkbox choices', async () => {
            const { getScreen } = await render(formPrompt, {
                fields: [
                    {
                        type: 'checkbox',
                        label: 'Empty choices',
                        choices: [],
                        value: [],
                    },
                ],
            })

            const screen = getScreen()
            expect(screen).toContain('Empty choices')
        })

        it('should handle very long field names', async () => {
            const { getScreen } = await render(formPrompt, {
                fields: [
                    {
                        type: 'text',
                        label: 'This is a very long field name that should be handled properly by the form renderer without breaking the layout',
                        value: 'test value',
                    },
                ],
            })

            const screen = getScreen()
            expect(screen).toContain('This is a very long field name')
            expect(screen).toContain('test value')
        })

        it('should handle forms with only separators', async () => {
            const { getScreen } = await render(formPrompt, {
                message: 'Only separators',
                fields: [
                    new Separator('--- Section 1 ---'),
                    new Separator('--- Section 2 ---'),
                    new Separator('--- Section 3 ---'),
                ],
            })

            const screen = getScreen()
            expect(screen).toContain('Only separators')
            expect(screen).toContain('--- Section 1 ---')
            expect(screen).toContain('--- Section 2 ---')
            expect(screen).toContain('--- Section 3 ---')
        })

        it('should handle empty fields array', async () => {
            const { getScreen } = await render(formPrompt, {
                message: 'Empty form',
                fields: [],
            })

            const screen = getScreen()
            expect(screen).toContain('Empty form')
            expect(screen).toContain('(tab/arrows to move between fields, enter to finish)')
        })
    })

    describe('Snapshots', () => {
        it('should match snapshot for basic form', async () => {
            const { getScreen } = await render(formPrompt, {
                message: 'User Information',
                fields: [
                    {
                        type: 'text',
                        label: 'First Name',
                        value: 'John',
                        description: 'Enter your first name',
                    },
                    {
                        type: 'text',
                        label: 'Last Name',
                        value: 'Doe',
                    },
                    {
                        type: 'boolean',
                        label: 'Subscribe',
                        value: true,
                    },
                ],
            })

            expect(getScreen()).toMatchSnapshot()
        })

        it('should match snapshot for complex form with separators', async () => {
            const { getScreen } = await render(formPrompt, {
                message: 'Complete Profile',
                submessage: 'Fill out all sections',
                fields: [
                    new Separator('Personal Information'),
                    {
                        type: 'text',
                        label: 'Name',
                        value: 'Jane Smith',
                    },
                    {
                        type: 'text',
                        label: 'Email',
                        value: 'jane@example.com',
                    },
                    new Separator('Preferences'),
                    {
                        type: 'radio',
                        label: 'Theme',
                        choices: ['light', 'dark', 'auto'],
                        value: 'dark',
                    },
                    {
                        type: 'checkbox',
                        label: 'Languages',
                        choices: ['JavaScript', 'TypeScript', 'Python'],
                        value: ['JavaScript', 'TypeScript'],
                    },
                ],
            })

            expect(getScreen()).toMatchSnapshot()
        })
    })

    describe('Footer', () => {
        it('should render a static footer', async () => {
            const { getScreen } = await render(formPrompt, {
                message: 'Form with footer',
                fields: [
                    {
                        type: 'text',
                        label: 'Name',
                        value: 'John',
                    },
                ],
                footer: () => 'This is a static footer',
            })

            const screen = getScreen()
            expect(screen).toContain('Form with footer')
            expect(screen).toContain('Name')
            expect(screen).toContain('This is a static footer')
        })

        it('should render a dynamic footer based on field values', async () => {
            const { getScreen } = await render(formPrompt, {
                message: 'Dynamic footer test',
                fields: [
                    {
                        type: 'text',
                        label: 'Name',
                        value: 'Alice',
                    },
                    {
                        type: 'text',
                        label: 'City',
                        value: 'New York',
                    },
                ],
                footer: (values) => {
                    const name = values.find((v) => !(v instanceof Separator) && v.label === 'Name')
                    const city = values.find((v) => !(v instanceof Separator) && v.label === 'City')
                    const nameValue = name && !(name instanceof Separator) ? name.value : ''
                    const cityValue = city && !(city instanceof Separator) ? city.value : ''
                    return `Hello ${nameValue} from ${cityValue}!`
                },
            })

            const screen = getScreen()
            expect(screen).toContain('Hello Alice from New York!')
        })

        it('should update footer when field values change', async () => {
            const { getScreen, events } = await render(formPrompt, {
                message: 'Updating footer',
                fields: [
                    {
                        type: 'text',
                        label: 'Name',
                        value: '',
                    },
                ],
                footer: (values) => {
                    const name = values.find((v) => !(v instanceof Separator) && v.label === 'Name')
                    const nameValue = name && !(name instanceof Separator) ? (name.value ?? '') : ''
                    return nameValue ? `Welcome, ${nameValue}!` : 'Please enter your name'
                },
            })

            // Initially empty, should show default message
            expect(getScreen()).toContain('Please enter your name')

            // Type a name
            events.type('Bob')

            // Footer should update
            expect(getScreen()).toContain('Welcome, Bob!')
        })

        it('should not render footer when footer function is not provided', async () => {
            const { getScreen } = await render(formPrompt, {
                message: 'No footer form',
                fields: [
                    {
                        type: 'text',
                        label: 'Name',
                        value: 'Test',
                    },
                ],
            })

            const screen = getScreen()
            expect(screen).toContain('No footer form')
            // Should not have extra newlines from footer
            expect(screen).not.toContain('undefined')
        })

        it('should handle footer with separators in fields', async () => {
            const { getScreen } = await render(formPrompt, {
                message: 'Form with separators',
                fields: [
                    new Separator('--- Personal Info ---'),
                    {
                        type: 'text',
                        label: 'Name',
                        value: 'Jane',
                    },
                    new Separator('--- Contact ---'),
                    {
                        type: 'text',
                        label: 'Email',
                        value: 'jane@example.com',
                    },
                ],
                footer: (values) => {
                    const formFields = values.filter((v) => !(v instanceof Separator))
                    return `Form has ${formFields.length} fields`
                },
            })

            const screen = getScreen()
            expect(screen).toContain('Form has 2 fields')
        })

        it('should handle footer with boolean field values', async () => {
            const { getScreen, events } = await render(formPrompt, {
                message: 'Boolean footer test',
                fields: [
                    {
                        type: 'boolean',
                        label: 'Subscribe',
                        value: false,
                    },
                ],
                footer: (values) => {
                    const subscribe = values.find((v) => !(v instanceof Separator) && v.label === 'Subscribe')
                    const isSubscribed = subscribe && !(subscribe instanceof Separator) ? subscribe.value : false
                    return isSubscribed ? '✓ You will receive updates' : '✗ You will not receive updates'
                },
            })

            // Initially false
            expect(getScreen()).toContain('✗ You will not receive updates')

            // Press left/right arrow to toggle boolean value
            events.keypress('left')

            // Footer should update
            expect(getScreen()).toContain('✓ You will receive updates')
        })

        it('should handle footer with checkbox field values', async () => {
            const { getScreen } = await render(formPrompt, {
                message: 'Checkbox footer test',
                fields: [
                    {
                        type: 'checkbox',
                        label: 'Languages',
                        choices: ['JavaScript', 'TypeScript', 'Python'],
                        value: ['JavaScript', 'TypeScript'],
                    },
                ],
                footer: (values) => {
                    const langs = values.find((v) => !(v instanceof Separator) && v.label === 'Languages')
                    const langValues =
                        langs && !(langs instanceof Separator) && Array.isArray(langs.value) ? langs.value : []
                    return `Selected: ${langValues.join(', ')}`
                },
            })

            expect(getScreen()).toContain('Selected: JavaScript, TypeScript')
        })

        it('should handle footer with radio field values', async () => {
            const { getScreen } = await render(formPrompt, {
                message: 'Radio footer test',
                fields: [
                    {
                        type: 'radio',
                        label: 'Theme',
                        choices: ['Light', 'Dark', 'Auto'],
                        value: 'Dark',
                    },
                ],
                footer: (values) => {
                    const theme = values.find((v) => !(v instanceof Separator) && v.label === 'Theme')
                    const themeValue = theme && !(theme instanceof Separator) ? theme.value : 'unknown'
                    return `Current theme: ${themeValue}`
                },
            })

            expect(getScreen()).toContain('Current theme: Dark')
        })

        it('should handle empty string returned from footer function', async () => {
            const { getScreen } = await render(formPrompt, {
                message: 'Empty footer',
                fields: [
                    {
                        type: 'text',
                        label: 'Name',
                        value: 'Test',
                    },
                ],
                footer: () => '',
            })

            const screen = getScreen()
            expect(screen).toContain('Empty footer')
            expect(screen).toContain('Name')
        })
    })
})
