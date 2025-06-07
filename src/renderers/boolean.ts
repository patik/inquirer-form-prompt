import figures from '@inquirer/figures'
import { bgGray, bold, underline, white } from 'yoctocolors'
import type { BooleanField } from '../types.js'

export function renderBoolean(field: BooleanField, isFieldSelected: boolean): string {
    const { value } = field
    const t = value ? `${figures.radioOn} ${bold(underline('true'))}` : `${figures.radioOff} true`
    const f = !value ? `${figures.radioOn} ${bold(underline('false'))}` : `${figures.radioOff} false`
    const both = ` ${t}  ${f} `

    return isFieldSelected ? bgGray(white(both)) : both
}
