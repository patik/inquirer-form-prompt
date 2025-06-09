import { Separator } from '@inquirer/core'
import boxen from 'boxen'
import stripAnsi from 'strip-ansi'
import { dim } from 'yoctocolors'
import type { InternalCheckboxField, InternalField, InternalFormField } from '../util/types.js'
import { renderBoolean } from './boolean.js'
import { renderCheckbox } from './checkbox.js'
import { renderRadio } from './radio.js'
import { renderText } from './text.js'

const staticOptions = {
    borderStyle: 'round',
    titleAlignment: 'left',
    padding: {
        right: 1,
        left: 1,
    },
} as const

function numSelected(field: InternalCheckboxField): number {
    return field.choices.filter((choice) => field.value?.includes(choice)).length
}

function displayField(field: InternalFormField, isFocused: boolean, value: string): string | Separator {
    const { name } = field
    const borderColor = isFocused ? 'blue' : undefined
    const footer = isFocused && field.description ? dim(`  ${field.description}`) : ''

    return `${boxen(value, {
        ...staticOptions,
        title: name,
        borderColor,
        fullscreen: () => [
            Math.max(50, stripAnsi(value).length + (field.type === 'checkbox' ? numSelected(field) * 2 : 10)),
            1,
        ],
    })}
${footer}`
}

function renderValue(field: InternalFormField, isFocused: boolean): string {
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
 * Generates a `renderField()` function when a particular field is selected. The function can be passed to array.map for the entire list of fields in order to build a table.
 */
export function fieldToLabelTop(field: InternalField, isFocused: boolean): string | Separator {
    if (field instanceof Separator) {
        return field
    }

    return displayField(field, isFocused, renderValue(field, isFocused))
}
