import { Separator } from '@inquirer/core'
import { bgGray, green, white } from 'yoctocolors'
import type { InternalField } from '../util/types.js'
import { renderBoolean } from './boolean.js'
import { renderCheckbox } from './checkbox.js'
import { renderRadio } from './radio.js'

/**
 * Generates a `renderField()` function when a particular field is selected. The function can be passed to array.map for the entire list of fields in order to build a table.
 */
export function fieldToTableRow(
    selectedIndex: number,
): (field: InternalField, index: number) => [string, string] | Separator {
    /**
     * Takes a `Field` and returns a two-column row to be used in a table
     */
    return function renderField(field: InternalField, index: number) {
        if (field instanceof Separator) {
            return field
        }

        const isSelected = selectedIndex === index
        const { name, type, value } = field
        const left = isSelected ? green(name) : name

        if (type === 'radio') {
            const right = renderRadio(field, isSelected)

            return [left, right]
        }

        if (type === 'checkbox') {
            const right = renderCheckbox(field, isSelected)

            return [left, right]
        }

        if (type === 'boolean') {
            const right = renderBoolean(field, isSelected)

            return [left, right]
        }

        const right = isSelected ? bgGray(white(value || ' ')) : value || ' '

        return [left, right]
    }
}
