import figures from '@inquirer/figures'
import type { InternalCheckboxField } from 'src/util/types.js'
import { bgGray, bold, underline } from 'src/util/styles.js'

function createChoiceRenderer(
    field: InternalCheckboxField,
    isFieldFocused: boolean,
): (choice: string, i: number) => string {
    const { highlightIndex = 0 } = field

    return function renderChoice(choice: string, i: number): string {
        const isChoiceFocused = field.value?.includes(choice)
        const icon = isChoiceFocused ? figures.checkboxOn : figures.checkboxOff

        if (!isFieldFocused) {
            return `${icon} ${choice}`
        }

        const isChoiceHighlighted = i === highlightIndex

        if (isChoiceFocused) {
            if (isChoiceHighlighted) {
                return underline(bold(`${icon} ${choice}`))
            }

            return `${icon} ${choice}`
        }

        if (isChoiceHighlighted) {
            return underline(bold(`${icon} ${choice}`))
        }

        return `${icon} ${choice}`
    }
}

export function renderCheckbox(field: InternalCheckboxField, isFieldFocused: boolean): string {
    const formatter = isFieldFocused ? (x: string) => bgGray(x) : (x: string) => x
    const renderChoice = createChoiceRenderer(field, isFieldFocused)
    const list = field.choices.map(renderChoice)

    return formatter(` ${list.join('  ')} `)
}
