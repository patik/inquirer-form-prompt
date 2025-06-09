import { Separator } from '@inquirer/core'
import figures from '@inquirer/figures'
import { bgGray, green, white } from 'yoctocolors'
import type { InternalField, InternalFormField } from '../util/types.js'
import { renderBoolean } from './boolean.js'
import { renderCheckbox } from './checkbox.js'
import { renderRadio } from './radio.js'

function renderRightColumn(field: InternalFormField, isSelected: boolean): string {
    const { type, value } = field

    if (type === 'radio') {
        return renderRadio(field, isSelected)
    }

    if (type === 'checkbox') {
        return renderCheckbox(field, isSelected)
    }

    if (type === 'boolean') {
        return renderBoolean(field, isSelected)
    }

    return isSelected ? bgGray(white(value || ' ')) : value || ' '
}

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
        const { name } = field
        const left = isSelected ? green(`${figures.arrowRight} ${name}`) : `  ${name}`

        return [left, renderRightColumn(field, isSelected)]
    }
}
