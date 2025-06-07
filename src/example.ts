import { Separator } from '@inquirer/core'
import { form } from './index.js'

export const example = async (): Promise<void> => {
    console.log('')
    try {
        const answers = await form({
            message: 'Fill in the form',
            fields: [
                new Separator('Text fields'),
                {
                    name: 'Alpha',
                    type: 'text',
                    value: 'aaa aaa aaa',
                    description: 'This is a simple text field.',
                },
                {
                    name: 'Bravo',
                    type: 'text',
                    value: 'bbb',
                    description: 'Another simple text field.',
                },
                new Separator('Boolean fields'),
                {
                    name: 'Charlie',
                    type: 'boolean',
                    value: true,
                    description: 'This is a boolean field with a description.',
                },
                {
                    name: 'Delta',
                    type: 'boolean',
                    value: false,
                    description: 'This is another boolean field with a description.',
                },
                new Separator('Multiple choice'),
                {
                    name: 'Echo',
                    type: 'radio',
                    choices: ['foxtrot', 'golf', 'hotel'],
                    value: 'golf',
                    description: 'This is a radio field with a description.',
                },
                {
                    name: 'India',
                    type: 'checkbox',
                    choices: ['juliet', 'kilo', 'lima'],
                    value: ['juliet', 'lima'],
                    description: 'This is a checkbox field with a description.',
                },
            ],
        })

        console.log('\n\nForm values:\n')
        console.log(
            answers
                .map((a) =>
                    a instanceof Separator
                        ? '---------------'
                        : `${a.name}: ${
                              // It's preferred for the demo to print the value, warts and all
                              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                              a.value
                          }`,
                )
                .join('\n'),
        )
    } catch (error) {
        if (error instanceof Error && error.message === 'Escape key pressed') {
            console.log('\n❌ Form cancelled by user')
        } else {
            throw error
        }
    }
}
