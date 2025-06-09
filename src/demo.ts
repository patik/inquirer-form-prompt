import { Separator } from '@inquirer/core'
import { exit } from 'node:process'
import form from './index.js'

const errorHander = (error: unknown): void => {
    if (error instanceof Error && error.name === 'ExitPromptError') {
        console.log('✨')
        exit(0)
    } else {
        throw error
    }
}

process.on('uncaughtException', errorHander)

export const demo = async (): Promise<void> => {
    console.log()
    try {
        const answers = await form({
            message: 'Plan Your Adventure',
            submessage: 'Tell us about your dream trip!',
            fields: [
                new Separator('✈️ Trip Details'),
                {
                    name: 'Traveler Name',
                    type: 'text',
                    value: 'Firstname Lastname',
                    description: 'Your full name as it appears on your passport.',
                },
                {
                    name: 'Destination City',
                    type: 'text',
                    value: '',
                    description: 'Which city would you like to visit?',
                },
                new Separator('🏨 Preferences'),
                {
                    name: 'Include Hotels',
                    type: 'boolean',
                    value: true,
                    description: 'Should we include hotel recommendations in your itinerary?',
                },
                {
                    name: 'Train pass needed',
                    type: 'boolean',
                    value: false,
                    description: 'Will you need a train pass for your trip?',
                },
                new Separator('🚂 Transportation'),
                {
                    name: 'Preferred Transport',
                    type: 'radio',
                    choices: ['High-speed Train', 'Budget Flight', 'Scenic Bus Route'],
                    value: 'High-speed Train',
                    description: 'How would you like to travel between cities?',
                },
                {
                    name: 'Activities of Interest',
                    type: 'checkbox',
                    choices: ['Museums & Art', 'Local Cuisine', 'Historical Sites', 'Nightlife', 'Nature & Parks'],
                    value: ['Museums & Art', 'Local Cuisine'],
                    description: 'What activities interest you most? (Select all that apply)',
                },
            ],
        })

        console.log('\n🎯 Your Travel Preferences:\n')
        console.log(
            answers
                .map((a) =>
                    a instanceof Separator
                        ? '─'.repeat(40)
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
            console.log('\n✈️ Trip planning cancelled - maybe next time!')
        } else {
            throw error
        }
    }
}

// If the --run flag was used, run it immediately
if (process.argv.includes('--run')) {
    await demo()
    exit(0)
}
