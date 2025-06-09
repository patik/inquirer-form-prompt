import { Separator } from '@inquirer/core'
import type { FormTheme, InternalFields } from '../util/types.js'
import { fieldToLabelTop } from './fieldToLabelTop.js'

const rowSpacer = '\n\n'
const rowSpacerDense = '\n'
const sectionSpacer = '\n'
const sectionSpacerDense = '\n'

export function toLabelTop(fields: InternalFields, selectedIndex: number, dense?: FormTheme['dense']): string {
    const outputRows: string[] = []
    let currentSection: Array<string> = []
    let currentSectionRows: Array<string> = []

    fields.forEach((field, index) => {
        if (field instanceof Separator) {
            if (currentSectionRows.length > 0) {
                currentSection.push(...currentSectionRows)
                outputRows.push(currentSection.join(dense ? rowSpacerDense : rowSpacer))
                currentSectionRows = []
            }

            outputRows.push('')
            outputRows.push(field.separator)

            if (!dense) {
                outputRows.push('')
            }

            currentSection = []

            return
        }

        const isFocused = index === selectedIndex
        const result = fieldToLabelTop({ field, isFocused, dense })
        currentSectionRows.push(result)
    })

    // Push the last section if it's not empty
    if (currentSectionRows.length > 0) {
        currentSection.push(...currentSectionRows)
        outputRows.push(currentSection.join(dense ? rowSpacerDense : rowSpacer))
    }

    return outputRows.join(dense ? sectionSpacerDense : sectionSpacer)
}
