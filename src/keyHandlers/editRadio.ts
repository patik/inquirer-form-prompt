import type { InquirerReadline, InternalField, InternalFields, RadioField } from '@/util/types'
import type { KeypressEvent } from '@inquirer/core'

type Props = {
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

function updateField({ currentField, key }: Pick<Props, 'currentField' | 'key'>): InternalField {
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

    nextField.value = choices[nextChoiceIndex]
    return nextField
}

/**
 * Updates the entire `fields` array when one radio field is being edited
 */
export function editRadioField({ fields, currentField, focusedIndex, key, rl }: Props): InternalFields {
    if (key.name !== 'left' && key.name !== 'right') {
        rl.clearLine(0)
        return fields
    }

    const nextFields = [...fields]
    const nextField = updateField({ currentField, key })
    nextFields[focusedIndex] = nextField

    return nextFields
}
