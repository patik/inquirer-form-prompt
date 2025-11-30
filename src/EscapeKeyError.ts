/**
 * Custom error to indicate that the Escape key was pressed.
 */
export class EscapeKeyError extends Error {
    override name = 'EscapeKeyError'

    constructor() {
        super('Escape key pressed')
    }
}
