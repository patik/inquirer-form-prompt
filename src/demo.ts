import { Separator } from '@inquirer/core'
import { exit } from 'node:process'
import { EscapeKeyError } from 'src/EscapeKeyError.js'
import type { FormTheme, ReturnedItems } from 'src/index.js'
import form from 'src/index.js'

const errorHandler = (error: unknown): void => {
    if (error instanceof Error && error.name === 'ExitPromptError') {
        console.log('✨')
        exit(0)
    } else {
        throw error
    }
}

process.on('uncaughtException', errorHandler)

/**
 * Footer function that generates a live summary of the trip details.
 * This updates in real-time as the user fills in the form.
 */
const generateTripSummary = (values: ReturnedItems): string => {
    const name = values.find((v) => !(v instanceof Separator) && v.label === 'Traveler Name')
    const destination = values.find((v) => !(v instanceof Separator) && v.label === 'Destination City')
    const includeHotels = values.find((v) => !(v instanceof Separator) && v.label === 'Include Hotels')
    const trainPass = values.find((v) => !(v instanceof Separator) && v.label === 'Train pass needed')
    const transport = values.find((v) => !(v instanceof Separator) && v.label === 'Preferred Transport')
    const activities = values.find((v) => !(v instanceof Separator) && v.label === 'Activities of Interest')

    const nameValue = name && !(name instanceof Separator) && name.value ? String(name.value) : 'Unknown Traveler'
    const destValue =
        destination && !(destination instanceof Separator) && destination.value ? String(destination.value) : '?'
    const hotelsValue = includeHotels && !(includeHotels instanceof Separator) && includeHotels.value ? '🏨' : ''
    const trainValue = trainPass && !(trainPass instanceof Separator) && trainPass.value ? '🚂' : ''
    const transportValue =
        transport && !(transport instanceof Separator) && transport.value ? String(transport.value) : 'TBD'
    const activitiesValue =
        activities && !(activities instanceof Separator) && Array.isArray(activities.value) && activities.value.length
            ? activities.value.length
            : 0

    return `━━━ Trip Summary ━━━\n🧳 ${nameValue} → ${destValue} | Transport: ${transportValue} ${hotelsValue}${trainValue} | ${activitiesValue} activities selected`
}

export const demo = async (
    {
        variant = 'table',
        dense = false,
    }: {
        variant: FormTheme['variant']
        dense: FormTheme['dense']
    } = { variant: 'table', dense: false },
): Promise<void> => {
    console.log()
    try {
        const answers = await form({
            message: 'Plan Your Adventure',
            submessage: 'Tell us about your dream trip!',
            fields: [
                new Separator('✈️ Trip Details'),
                {
                    label: 'Traveler Name',
                    type: 'text',
                    value: 'Firstname Lastname',
                    description: 'Your full name as it appears on your passport.',
                },
                {
                    label: 'Destination City',
                    type: 'text',
                    value: '',
                    description: 'Which city would you like to visit?',
                },
                new Separator('🏨 Preferences'),
                {
                    label: 'Include Hotels',
                    type: 'boolean',
                    value: true,
                    description: 'Should we include hotel recommendations in your itinerary?',
                },
                {
                    label: 'Train pass needed',
                    type: 'boolean',
                    value: false,
                    description: 'Will you need a train pass for your trip?',
                },
                new Separator('🚂 Transportation'),
                {
                    label: 'Preferred Transport',
                    type: 'radio',
                    choices: ['High-speed Train', 'Budget Flight', 'Scenic Bus Route'],
                    value: 'High-speed Train',
                    description: 'How would you like to travel between cities?',
                },
                {
                    label: 'Activities of Interest',
                    type: 'checkbox',
                    choices: ['Museums & Art', 'Local Cuisine', 'Historical Sites', 'Nightlife', 'Nature & Parks'],
                    value: ['Museums & Art', 'Local Cuisine'],
                    description: 'What activities interest you most? (Select all that apply)',
                },
            ],
            theme: {
                variant,
                dense,
            },
            footer: generateTripSummary,
        })

        console.log('\n🎯 Your Travel Preferences:\n')
        console.log(
            answers
                .map((a) =>
                    a instanceof Separator
                        ? '─'.repeat(40)
                        : `${a.label}: ${
                              // It's preferred for the demo to print the value, warts and all
                              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                              a.value
                          }`,
                )
                .join('\n'),
        )
    } catch (error) {
        if (error instanceof EscapeKeyError) {
            console.log('\n✈️ Trip planning cancelled - maybe next time!')
        } else {
            throw error
        }
    }
}

// If the --run flag was used, run it immediately
// Read --variant and --dense flags from arguments
if (process.argv.includes('--run')) {
    await demo({
        variant:
            (process.argv.find((arg) => arg.startsWith('--variant='))?.slice(10) as FormTheme['variant']) || 'table',
        dense: process.argv.includes('--dense'),
    })
    exit(0)
}
