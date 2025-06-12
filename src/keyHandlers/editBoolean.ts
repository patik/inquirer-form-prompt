import type { KeypressEvent } from '@inquirer/core'
import type { BooleanField, InquirerReadline, InternalFields } from 'src/util/types.js'

type Props = {
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
    focusedIndex: number

    /**
     * Key pressed by the user
     */
    key: KeypressEvent

    /**
     * Readline instance
     */
    rl: InquirerReadline
}

/**
 * Updates the entire `fields` array when one boolean field is being edited
 */
export function editBooleanField({ fields, currentField, focusedIndex, key, rl }: Props): InternalFields {
    if (key.name !== 'left' && key.name !== 'right') {
        rl.clearLine(0)
        return fields
    }

    const nextFields = [...fields]

    nextFields[focusedIndex] = {
        ...currentField,
        value: !currentField.value,
    }

    return nextFields
}
