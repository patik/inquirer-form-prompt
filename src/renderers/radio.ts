import figures from '@inquirer/figures'
import { bgGray, bold, underline, white } from 'yoctocolors'
import type { RadioField } from '../util/types.js'

function createChoiceRenderer(field: RadioField, isFieldSelected: boolean): (choice: string) => string {
    return function renderChoice(choice: string): string {
        const isChoiceSelected = field.value === choice
        const icon = isChoiceSelected ? figures.radioOn : figures.radioOff

        if (isFieldSelected && isChoiceSelected) {
            return `${icon} ${bold(underline(choice))}`
        }

        return `${icon} ${choice}`
    }
}

export function renderRadio(field: RadioField, isFieldSelected: boolean): string {
    const formatter = isFieldSelected ? (s: string) => bgGray(white(s)) : (s: string) => s
    const renderChoice = createChoiceRenderer(field, isFieldSelected)
    const list = field.choices.map(renderChoice)

    return formatter(` ${list.join('  ')} `)
}
