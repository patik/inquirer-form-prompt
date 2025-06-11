import type { FormTheme, InternalFields } from '@/util/types'
import { Separator } from '@inquirer/core'
import { fieldToLabelTop } from './fieldToLabelTop.js'

const rowSpacer = (dense?: boolean): string => (dense ? '\n' : '\n\n')
const sectionSpacer = (dense?: boolean): string => (dense ? '\n' : '\n')

export function toLabelTop(fields: InternalFields, focusedIndex: number, dense?: FormTheme['dense']): string {
    const outputRows: string[] = []
    let currentSection: Array<string> = []
    let currentSectionRows: Array<string> = []

    fields.forEach((field, index) => {
        if (field instanceof Separator) {
            if (currentSectionRows.length > 0) {
                currentSection.push(...currentSectionRows)
                outputRows.push(currentSection.join(rowSpacer(dense)))
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

        const isFocused = index === focusedIndex
        const result = fieldToLabelTop({ field, isFocused, dense })
        currentSectionRows.push(result)
    })

    // Push the last section if it's not empty
    if (currentSectionRows.length > 0) {
        currentSection.push(...currentSectionRows)
        outputRows.push(currentSection.join(rowSpacer(dense)))
    }

    return outputRows.join(sectionSpacer(dense))
}
