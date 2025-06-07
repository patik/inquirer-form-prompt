import figures from '@inquirer/figures'
import { bgGray, bold, underline, white } from 'yoctocolors'
import type { RadioField } from '../types.js'

export function renderRadio(field: RadioField, isFieldSelected: boolean): string {
    const formatter = isFieldSelected ? (s: string) => bgGray(white(s)) : (s: string) => s
    const list = field.choices.map((choice) => {
        const isChoiceSelected = field.value === choice
        const icon = isChoiceSelected ? figures.radioOn : figures.radioOff

        if (isFieldSelected && isChoiceSelected) {
            return `${icon} ${bold(underline(choice))}`
        }

        return `${icon} ${choice}`
    })

    return formatter(` ${list.join('  ')} `)
}
