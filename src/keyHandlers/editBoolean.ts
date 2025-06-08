import type { KeypressEvent } from '@inquirer/core'
import type { BooleanField, InquirerReadline, InternalFields } from '../util/types.js'

/**
 * Updates the entire `fields` array when one boolean field is being edited
 */
export const editBooleanField = ({
    fields,
    currentField,
    selectedIndex,
    key,
    rl,
}: {
    /**
     * All fields (i.e. in the current state)
     */
    fields: InternalFields

    /**
     * The highlighted field that is being edited
     */
    currentField: BooleanField

    /**
     * Index of the currently highlighted field
     */
    selectedIndex: number

    /**
     * Key pressed by the user
     */
    key: KeypressEvent

    /**
     * Readline instance
     */
    rl: InquirerReadline
}): InternalFields => {
    if (key.name !== 'left' && key.name !== 'right') {
        rl.clearLine(0)
        return fields
    }

    const nextFields = [...fields]

    nextFields[selectedIndex] = {
        ...currentField,
        value: !currentField.value,
    }

    return nextFields
}
