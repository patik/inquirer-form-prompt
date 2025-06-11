import boxen from 'boxen'
import { renderBoolean } from 'src/renderers/common/boolean'
import { renderCheckbox } from 'src/renderers/common/checkbox'
import { renderRadio } from 'src/renderers/common/radio'
import { renderText } from 'src/renderers/common/text'
import type { FormTheme, InternalFormField } from 'src/util/types'
import stripAnsi from 'strip-ansi'
import { dim } from 'yoctocolors'

const staticOptions = {
    titleAlignment: 'left',
    padding: {
        right: 1,
        left: 1,
    },
} as const

function displayField({
    field,
    isFocused,
    value,
    dense,
}: {
    field: InternalFormField
    isFocused: boolean
    value: string
    dense?: FormTheme['dense']
}): string {
    const { label } = field
    const borderColor = isFocused ? 'green' : 'gray'
    const borderStyle = isFocused ? 'bold' : 'round'
    const footer = isFocused && field.description ? dim(`  ${field.description}`) : ''
    const valueLength = stripAnsi(value).length + 2
    const labelLength = label.length + 7 // Magic number assures that that label isn't truncated and all fields show the value starting at the same column
    const fieldLength = Math.max(dense ? 20 : 50, labelLength, valueLength)

    return `${boxen(value, {
        ...staticOptions,
        title: label,
        borderColor,
        borderStyle,
        fullscreen: () => [fieldLength, 1],
    })}
${footer}`
}

function renderValue({ field, isFocused }: { field: InternalFormField; isFocused: boolean }): string {
    const { type } = field

    if (type === 'radio') {
        return renderRadio(field, isFocused)
    }

    if (type === 'checkbox') {
        return renderCheckbox(field, isFocused)
    }

    if (type === 'boolean') {
        return renderBoolean(field, isFocused)
    }

    return renderText(field, isFocused)
}

/**
 * Generates a `renderField()` function when a particular field is focused. The function can be passed to array.map for the entire list of fields in order to build a table.
 */
export function fieldToLabelTop({
    field,
    isFocused,
    dense,
}: {
    field: InternalFormField
    isFocused: boolean
    dense?: FormTheme['dense']
}): string {
    const value = renderValue({ field, isFocused })

    return displayField({ field, isFocused, value, dense })
}
