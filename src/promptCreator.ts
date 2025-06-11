import type { Config, Fields, InquirerReadline, InternalFields, InternalFormField, ReturnedItems } from '@/util/types'
import type { KeypressEvent } from '@inquirer/core'
import { isEnterKey, Separator, useKeypress, usePrefix, useState } from '@inquirer/core'
import ansiEscapes from 'ansi-escapes'
import { bold, dim } from 'yoctocolors'
import { editBooleanField } from './keyHandlers/editBoolean.js'
import { editCheckboxField } from './keyHandlers/editCheckbox.js'
import { editRadioField } from './keyHandlers/editRadio.js'
import { editTextField } from './keyHandlers/editText.js'
import { handleNavigation } from './keyHandlers/handleNavigation.js'
import { toLabelTop } from './renderers/labelTop/toLabelTop.js'
import { toTable } from './renderers/table/toTable.js'

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

const updateFields = ({
    fields,
    currentField,
    key,
    setFields,
    focusedIndex,
    rl,
}: {
    fields: InternalFields
    setFields: (newFields: InternalFields) => void
    currentField: InternalFormField
    key: KeypressEvent
    focusedIndex: number
    rl: InquirerReadline
}): void => {
    if (currentField.type === 'boolean') {
        const nextFields = editBooleanField({ fields, currentField, focusedIndex, key, rl })
        setFields(nextFields)
        return
    }

    if (currentField.type === 'radio') {
        const nextFields = editRadioField({ fields, currentField, focusedIndex, key, rl })
        setFields(nextFields)
        return
    }

    if (currentField.type === 'checkbox') {
        const nextFields = editCheckboxField({ fields, currentField, key, focusedIndex, rl })
        setFields(nextFields)
        return
    }

    const nextFields = editTextField({ fields, currentField, key, focusedIndex, rl })
    setFields(nextFields)
    return
}

/**
 * Exported for testing purposes
 */
export const promptCreator = (config: Config, done: (value: ReturnedItems) => void): string => {
    const [fields, setFields] = useState<InternalFields>(toInternalFields(config.fields))
    const [focusedIndex, setFocusedIndex] = useState(() => getInitialIndex(config.fields))
    const prefix = usePrefix({})

    useKeypress((key, rl) => {
        if (isEnterKey(key)) {
            done(fields)
            return
        }

        if (key.name === 'escape') {
            // @ts-expect-error This is the only way I know how to signal that the user pressed escape
            done(Symbol('Escape key pressed'))
            return
        }

        if (handleNavigation({ fields, key, focusedIndex, setFocusedIndex, rl })) {
            return
        }

        const currentField = fields[focusedIndex]

        if (!currentField || currentField instanceof Separator) {
            return
        }

        updateFields({
            fields,
            currentField,
            key,
            setFields,
            focusedIndex,
            rl,
        })
    })

    const message = config.message ? bold(config.message) : ''
    const submessage = config.submessage ? `\n\n${config.submessage}\n` : ''
    const fieldOutput =
        config.theme?.variant === 'label-top'
            ? toLabelTop(fields, focusedIndex, config.theme.dense)
            : toTable(fields, focusedIndex)

    return `${prefix} ${message}${submessage} ${dim('(tab/arrows to move between fields, enter to finish)')}
${fieldOutput}${ansiEscapes.cursorHide}
`
}
