import { bgGray } from 'src/util/styles.js'
import type { TextField } from 'src/util/types.js'

export function renderText(field: TextField, isFocused: boolean): string {
    const { value } = field

    return isFocused && value ? bgGray(value) : value || ' '
}
