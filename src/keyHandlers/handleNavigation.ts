import type { KeypressEvent } from '@inquirer/core'
import { isDownKey, isUpKey, Separator } from '@inquirer/core'
import type { Fields, InquirerReadline } from 'src/util/types.js'

/**
 * Extend `KeypressEvent` to add the shift key, which is actually present at runtime.
 */
type ActualKeypressEvent = KeypressEvent & { shift?: boolean }

type Props = {
    /**
     * All fields (i.e. in the current state)
     */
    fields: Fields

    /**
     * Key pressed by the user
     */
    key: ActualKeypressEvent

    /**
     * Index of the currently highlighted field
     */
    focusedIndex: number

    /**
     * State setter for focusedIndex
     */
    setFocusedIndex: (newValue: number) => void

    /**
     * Readline instance
     */
    rl: InquirerReadline
}

function nextNonSeparatorIndex(fields: Fields, searchFromIndex: number): number {
    let nextIndex = searchFromIndex + 1

    while (nextIndex < fields.length && fields[nextIndex] instanceof Separator) {
        nextIndex += 1
    }

    return nextIndex < fields.length ? nextIndex : 0
}

function previousNonSeparatorIndex(fields: Fields, searchFromIndex: number): number {
    let previousIndex = searchFromIndex - 1

    while (previousIndex >= 0 && fields[previousIndex] instanceof Separator) {
        previousIndex -= 1
    }

    return previousIndex >= 0 ? previousIndex : fields.length - 1
}

/**
 * Handles navigation of the field list. Returns true if it took action, or false if it didn't take action (which means some other handler needs to do something)
 */
export function handleNavigation({ fields, focusedIndex, setFocusedIndex, key, rl }: Props): boolean {
    if (fields.length === 0) {
        setFocusedIndex(0)
        return true
    }

    const goToNext = isDownKey(key) || (key.name === 'tab' && !key.shift)
    const goToPrevious = isUpKey(key) || (key.name === 'tab' && key.shift)

    if (goToPrevious) {
        rl.clearLine(0)
        if (focusedIndex === 0) {
            setFocusedIndex(previousNonSeparatorIndex(fields, 0))
            return true
        }

        setFocusedIndex(previousNonSeparatorIndex(fields, focusedIndex))
        return true
    }

    if (goToNext) {
        rl.clearLine(0)
        if (focusedIndex === fields.length - 1) {
            setFocusedIndex(nextNonSeparatorIndex(fields, -1))
            return true
        }

        setFocusedIndex(nextNonSeparatorIndex(fields, focusedIndex))
        return true
    }

    return false
}
