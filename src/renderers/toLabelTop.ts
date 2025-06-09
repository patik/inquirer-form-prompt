import { Separator } from '@inquirer/core'
import type { InternalFields } from '../util/types.js'
import { fieldToLabelTop } from './fieldToLabelTop.js'

const rowSpacer = '\n\n'
const sectionSpacer = '\n'

export function toLabelTop(fields: InternalFields, selectedIndex: number): string {
    const outputRows: string[] = []
    let currentSection: Array<string> = []
    let currentSectionRows: Array<string> = []

    fields.forEach((field, index) => {
        if (field instanceof Separator) {
            if (currentSectionRows.length > 0) {
                currentSection.push(...currentSectionRows)
                outputRows.push(currentSection.join(rowSpacer))
                currentSectionRows = []
            }

            outputRows.push('')
            outputRows.push(field.separator)
            currentSection = []

            return
        }

        const result = fieldToLabelTop(field, index === selectedIndex)
        currentSectionRows.push(result)
    })

    // Push the last section if it's not empty
    if (currentSectionRows.length > 0) {
        currentSection.push(...currentSectionRows)
        outputRows.push(currentSection.join(rowSpacer))
    }

    return outputRows.join(sectionSpacer)
}
