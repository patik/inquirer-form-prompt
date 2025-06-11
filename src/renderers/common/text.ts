import type { TextField } from 'src/util/types'
import { bgGray } from 'yoctocolors'

export function renderText(field: TextField, isFocused: boolean): string {
    const { value } = field

    return isFocused && value ? bgGray(value) : value || ' '
}
