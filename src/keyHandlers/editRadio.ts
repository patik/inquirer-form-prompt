import type { KeypressEvent } from '@inquirer/core'
import type { InquirerReadline, InternalFields, RadioField } from '../util/types.js'

/**
 * Updates the entire `fields` array when one radio field is being edited
 */
export const editRadioField = ({
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
    currentField: RadioField

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

    const { choices, value } = currentField
    const currentChoiceIndex = choices.indexOf(value ?? '')
    const lastChoiceIndex = choices.length - 1
    const nextField = { ...currentField }
    let nextChoiceIndex = 0

    if (key.name === 'left') {
        if (currentChoiceIndex < 1) {
            nextChoiceIndex = lastChoiceIndex
        } else {
            nextChoiceIndex = currentChoiceIndex - 1
        }
    } else {
        if (currentChoiceIndex >= lastChoiceIndex) {
            nextChoiceIndex = 0
        } else {
            nextChoiceIndex = currentChoiceIndex + 1
        }
    }

    const nextFields = [...fields]
    nextField.value = choices[nextChoiceIndex]
    nextFields[selectedIndex] = nextField

    return nextFields
}
