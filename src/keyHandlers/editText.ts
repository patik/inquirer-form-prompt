import type { KeypressEvent } from '@inquirer/core'
import clipboard from 'clipboardy'
import type { InquirerReadline, InternalFields, TextField } from '../util/types.js'

/**
 * Updates the entire `fields` array when one text field is being edited
 */
export const editTextField = ({
    fields,
    currentField,
    key,
    selectedIndex,
    rl,
}: {
    /**
     * All fields (i.e. in the current state)
     */
    fields: InternalFields

    /**
     * The highlighted field that is being edited
     */
    currentField: TextField

    /**
     * Key pressed by the user
     */
    key: KeypressEvent

    /**
     * Index of the currently highlighted field
     */
    selectedIndex: number

    /**
     * Readline instance
     */
    rl: InquirerReadline
}): InternalFields => {
    // Ignore left/right arrow keys for text fields, since we don't support a cursor, otherwise the value
    // would be overwritten with the last typed value, even if it was entered for a different field.
    if (key.name === 'left' || key.name === 'right') {
        return fields
    }

    const isPasting = key.ctrl && key.name === 'v'
    const value = isPasting ? clipboard.readSync() : rl.line
    const nextFields = [...fields]

    nextFields[selectedIndex] = {
        ...currentField,
        value,
    }

    return nextFields
}
