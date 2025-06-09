import type { KeypressEvent } from '@inquirer/core'
import type { InquirerReadline, InternalCheckboxField, InternalField, InternalFields } from '../util/types.js'

type Props = {
    /**
     * All fields (i.e. in the current state)
     */
    fields: InternalFields

    /**
     * The highlighted field that is being edited
     */
    currentField: InternalCheckboxField

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
}

function updateField({ currentField, key, rl }: Pick<Props, 'currentField' | 'key' | 'rl'>): InternalField {
    const { choices, value: currentValue, highlightIndex: currentHighlightIndex = 0 } = currentField
    const lastChoiceIndex = currentField.choices.length - 1
    const nextField = { ...currentField }

    if (key.name === 'left') {
        if (currentHighlightIndex < 1) {
            nextField.highlightIndex = lastChoiceIndex
        } else {
            nextField.highlightIndex = currentHighlightIndex - 1
        }
    } else if (key.name === 'right') {
        if (currentHighlightIndex >= lastChoiceIndex) {
            nextField.highlightIndex = 0
        } else {
            nextField.highlightIndex = currentHighlightIndex + 1
        }
    } else if (key.name === 'space') {
        const highlightedValue = choices[currentHighlightIndex]

        if (highlightedValue) {
            if (currentValue?.includes(highlightedValue)) {
                nextField.value = currentValue.filter((x) => x !== highlightedValue)
            } else {
                nextField.value = [...(currentValue ?? []), highlightedValue]
            }
        }

        rl.clearLine(0)
    }

    return nextField
}

/**
 * Updates the entire `fields` array when one checkbox field is being edited
 */
export function editCheckboxField({ fields, currentField, key, selectedIndex, rl }: Props): InternalFields {
    if (key.name !== 'left' && key.name !== 'right' && key.name !== 'space') {
        return fields
    }

    const nextFields = [...fields]
    const nextField = updateField({ currentField, key, rl })
    nextFields[selectedIndex] = nextField

    return nextFields
}
