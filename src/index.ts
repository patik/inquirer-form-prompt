import { createPrompt, isEnterKey, Separator, useKeypress, usePrefix, useState } from '@inquirer/core'
import ansiEscapes from 'ansi-escapes'
import Table from 'cli-table3'
import readline from 'readline'
import { bold, dim } from 'yoctocolors'
import { editBooleanField } from './keyHandlers/editBoolean.js'
import { editCheckboxField } from './keyHandlers/editCheckbox.js'
import { editRadioField } from './keyHandlers/editRadio.js'
import { editTextField } from './keyHandlers/editText.js'
import { handleNavigation } from './keyHandlers/handleNavigation.js'
import { fieldToTableRow } from './renderers/fieldToTableRow.js'
import type { Config, Fields, InternalFields, ReturnedItems } from './types.js'

function toInternalFields(fields: Fields): InternalFields {
    return fields.map((field) => {
        if (!(field instanceof Separator) && field.type === 'checkbox') {
            return {
                ...field,
                highlightIndex: 0,
            }
        }

        return field
    })
}

function getInitialIndex(fields: Fields): number {
    const firstNonSeparatorIndex = fields.findIndex((field) => !(field instanceof Separator))

    return firstNonSeparatorIndex >= 0 ? firstNonSeparatorIndex : 0
}

export const form = async (options: Config): Promise<ReturnedItems> => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    // @ts-expect-error Only way I know how to hide the cursor
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    rl.output.write('\x1B[?25l')

    const answer = await createPrompt<ReturnedItems, Config>((config, done) => {
        const [fields, setFields] = useState<InternalFields>(toInternalFields(config.fields))
        const [selectedIndex, setSelectedIndex] = useState(() => getInitialIndex(config.fields))
        const prefix = usePrefix({})

        useKeypress((key, rl) => {
            if (isEnterKey(key)) {
                done(fields)
                return
            }

            if (handleNavigation({ fields, key, selectedIndex, setSelectedIndex, rl })) {
                return
            }

            if (key.name === 'escape') {
                // @ts-expect-error Only way I know how to signal that the user pressed escape
                done(Symbol('Escape key pressed'))
                return
            }

            const currentField = fields[selectedIndex]

            if (!currentField || currentField instanceof Separator) {
                return
            }

            if (currentField.type === 'text') {
                const nextFields = editTextField({ fields, currentField, key, selectedIndex, rl })
                setFields(nextFields)
                return
            }

            if (currentField.type === 'radio') {
                const nextFields = editRadioField({ fields, currentField, selectedIndex, key, rl })
                setFields(nextFields)
                return
            }

            if (currentField.type === 'checkbox') {
                const nextFields = editCheckboxField({ fields, currentField, key, selectedIndex, rl })
                setFields(nextFields)
                return
            }

            const nextFields = editBooleanField({ fields, currentField, selectedIndex, key, rl })

            setFields(nextFields)
            return
        })

        const message = config.message ? bold(config.message) : ''
        const submessage = config.submessage ? `\n\n${config.submessage}\n` : ''
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

            const result = fieldToTableRow(selectedIndex)(field, index)
            if (!(result instanceof Separator)) {
                currentRows.push(result)
            }

            const isSelected = selectedIndex === index

            if (isSelected && !(field instanceof Separator) && field.description) {
                tableFooter = dim(`  ${field.description}`)
            }
        })

        // Push the last table if it has rows
        if (currentRows.length > 0) {
            currentTable.push(...currentRows)
            tables.push(currentTable.toString())
            tables.push(tableFooter)
        }

        return `${prefix} ${message}${submessage} ${dim('(tab/arrows to move between fields, enter to finish)')}

${tables.join('\n')}${ansiEscapes.cursorHide}
`
    })(options)

    // @ts-expect-error Only way I know how to show the cursor
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    rl.output.write('\x1B[?25h')
    rl.close()

    // Check if the user aborted
    if (typeof answer === 'symbol' && String(answer) === 'Symbol(Escape key pressed)') {
        throw new Error('Escape key pressed')
    }

    return answer
}
