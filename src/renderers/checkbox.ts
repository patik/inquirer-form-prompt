import figures from '@inquirer/figures'
import { bgGray, bold, underline, white } from 'yoctocolors'
import type { InternalCheckboxField } from '../util/types.js'

export function renderCheckbox(field: InternalCheckboxField, isFieldSelected: boolean): string {
    const formatter = isFieldSelected ? (x: string) => bgGray(white(x)) : (x: string) => x
    const { highlightIndex = 0 } = field
    const list = field.choices.map((choice, i) => {
        const isChoiceSelected = field.value.includes(choice)
        const icon = isChoiceSelected ? figures.tick : figures.checkboxOff

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
    })

    return formatter(` ${list.join('  ')} `)
}
