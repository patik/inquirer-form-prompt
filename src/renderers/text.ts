import { bgGray, white } from 'yoctocolors'
import type { TextField } from '../util/types.js'

export function renderText(field: TextField, isFocused: boolean): string {
    const { value } = field

    return isFocused ? bgGray(white(value || ' ')) : value || ' '
}
