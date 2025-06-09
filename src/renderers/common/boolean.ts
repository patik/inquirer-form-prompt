import figures from '@inquirer/figures'
import { bgGray, bold, underline } from 'yoctocolors'
import type { BooleanField } from '../../util/types.js'

export function renderBoolean(field: BooleanField, isFieldFocused: boolean): string {
    const { value } = field
    const t = value ? `${figures.radioOn} ${bold(underline('true'))}` : `${figures.radioOff} true`
    const f = !value ? `${figures.radioOn} ${bold(underline('false'))}` : `${figures.radioOff} false`
    const both = ` ${t}  ${f} `

    return isFieldFocused ? bgGray(both) : both
}
