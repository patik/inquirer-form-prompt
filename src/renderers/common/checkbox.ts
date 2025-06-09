import figures from '@inquirer/figures'
import { bgGray, bold, underline } from 'yoctocolors'
import type { InternalCheckboxField } from '../../util/types.js'

function createChoiceRenderer(
    field: InternalCheckboxField,
    isFieldSelected: boolean,
): (choice: string, i: number) => string {
    const { highlightIndex = 0 } = field

    return function renderChoice(choice: string, i: number): string {
        const isChoiceSelected = field.value?.includes(choice)
        const icon = isChoiceSelected ? figures.checkboxOn : figures.checkboxOff

        if (!isFieldSelected) {
            return `${icon} ${choice}`
        }

        const isChoiceHighlighted = i === highlightIndex

        if (isChoiceSelected) {
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

export function renderCheckbox(field: InternalCheckboxField, isFieldSelected: boolean): string {
    const formatter = isFieldSelected ? (x: string) => bgGray(x) : (x: string) => x
    const renderChoice = createChoiceRenderer(field, isFieldSelected)
    const list = field.choices.map(renderChoice)

    return formatter(` ${list.join('  ')} `)
}
