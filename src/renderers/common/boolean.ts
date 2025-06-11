import figures from '@inquirer/figures'
import type { BooleanField } from 'src/util/types'
import { bgGray, bold, underline } from 'yoctocolors'

export function renderBoolean(field: BooleanField, isFieldFocused: boolean): string {
    const { value } = field
    const t = value ? `${figures.radioOn} ${bold(underline('true'))}` : `${figures.radioOff} true`
    const f = !value ? `${figures.radioOn} ${bold(underline('false'))}` : `${figures.radioOff} false`
    const both = ` ${t}  ${f} `

    return isFieldFocused ? bgGray(both) : both
}
