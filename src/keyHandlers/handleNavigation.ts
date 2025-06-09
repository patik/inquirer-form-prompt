import type { KeypressEvent } from '@inquirer/core'
import { isDownKey, isUpKey, Separator } from '@inquirer/core'
import type { Fields, InquirerReadline } from '../util/types.js'

type Props = {
    /**
     * All fields (i.e. in the current state)
     */
    fields: Fields

    /**
     * Key pressed by the user
     */
    key: KeypressEvent & { shift?: boolean }

    /**
     * Index of the currently highlighted field
     */
    selectedIndex: number

    /**
     * State setter for selectedIndex
     */
    setSelectedIndex: (newValue: number) => void

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
export function handleNavigation({ fields, selectedIndex, setSelectedIndex, key, rl }: Props): boolean {
    if (fields.length === 0) {
        setSelectedIndex(0)
        return true
    }

    const goToNext = isDownKey(key) || (key.name === 'tab' && !key.shift)
    const goToPrevious = isUpKey(key) || (key.name === 'tab' && key.shift)

    if (goToPrevious) {
        rl.clearLine(0)
        if (selectedIndex === 0) {
            setSelectedIndex(previousNonSeparatorIndex(fields, 0))
            return true
        }

        setSelectedIndex(previousNonSeparatorIndex(fields, selectedIndex))
        return true
    }

    if (goToNext) {
        rl.clearLine(0)
        if (selectedIndex === fields.length - 1) {
            setSelectedIndex(nextNonSeparatorIndex(fields, -1))
            return true
        }

        setSelectedIndex(nextNonSeparatorIndex(fields, selectedIndex))
        return true
    }

    return false
}
