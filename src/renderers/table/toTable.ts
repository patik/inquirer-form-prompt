import { Separator } from '@inquirer/core'
import Table from 'cli-table3'
import { dim } from 'yoctocolors'
import type { InternalFields } from '../../util/types.js'
import { fieldToTableRow } from './fieldToTableRow.js'

export function toTable(fields: InternalFields, focusedIndex: number): string {
    const tables: string[] = []
    let currentTable = new Table()
    let currentRows: Array<[string, string]> = []
    let tableFooter = ''

    fields.forEach((field, index) => {
        if (field instanceof Separator) {
            if (currentRows.length > 0) {
                currentTable.push(...currentRows)
                tables.push(currentTable.toString())
                currentRows = []
            }

            tables.push(tableFooter)
            tables.push('')
            tables.push(field.separator)
            currentTable = new Table()
            tableFooter = ''

            return
        }

        const result = fieldToTableRow(focusedIndex)(field, index)
        if (!(result instanceof Separator)) {
            currentRows.push(result)
        }

        const isFocused = focusedIndex === index
        if (isFocused && !(field instanceof Separator) && field.description) {
            tableFooter = dim(`  ${field.description}`)
        }
    })

    // Push the last table if it has rows
    if (currentRows.length > 0) {
        currentTable.push(...currentRows)
        tables.push(currentTable.toString())
        tables.push(tableFooter)
    }

    return tables.join('\n')
}
