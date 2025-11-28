import { Separator } from '@inquirer/core'
import figures from '@inquirer/figures'
import { renderBoolean } from 'src/renderers/common/boolean.js'
import { renderCheckbox } from 'src/renderers/common/checkbox.js'
import { renderRadio } from 'src/renderers/common/radio.js'
import { bgGray, green } from 'src/util/styles.js'
import type { InternalField, InternalFormField } from 'src/util/types.js'

function renderRightColumn(field: InternalFormField, isFocused: boolean): string {
    const { type, value } = field

    if (type === 'radio') {
        return renderRadio(field, isFocused)
    }

    if (type === 'checkbox') {
        return renderCheckbox(field, isFocused)
    }

    if (type === 'boolean') {
        return renderBoolean(field, isFocused)
    }

    return isFocused && value ? bgGray(value) : value || ' '
}

/**
 * Generates a `renderField()` function when a particular field is focused. The function can be passed to array.map for the entire list of fields in order to build a table.
 */
export function fieldToTableRow(
    focusedIndex: number,
): (field: InternalField, index: number) => [string, string] | Separator {
    /**
     * Takes a `Field` and returns a two-column row to be used in a table
     */
    return function renderField(field: InternalField, index: number) {
        if (field instanceof Separator) {
            return field
        }

        const isFocused = focusedIndex === index
        const { label } = field
        const left = isFocused ? green(`${figures.arrowRight} ${label}`) : `  ${label}`

        return [left, renderRightColumn(field, isFocused)]
    }
}
