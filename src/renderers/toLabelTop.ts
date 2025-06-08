import { Separator } from '@inquirer/core'
import type { InternalFields } from '../util/types.js'
import { fieldToLabelTop } from './fieldToLabelTop.js'

export function toLabelTop(fields: InternalFields, selectedIndex: number): string {
    const sections: string[] = []
    let currentSection: Array<string> = []
    let currentSectionFields: Array<string> = []
    // let tableFooter = ''

    fields.forEach((field, index) => {
        if (field instanceof Separator) {
            if (currentSectionFields.length > 0) {
                currentSection.push(...currentSectionFields)
                sections.push(currentSection.join('\n\n'))
                currentSectionFields = []
            }

            // sections.push(tableFooter)
            sections.push('')
            sections.push(field.separator)
            currentSection = []
            // tableFooter = ''

            return
        }

        const result = fieldToLabelTop(field, index === selectedIndex)
        if (!(result instanceof Separator)) {
            currentSectionFields.push(result)
        }

        const isSelected = selectedIndex === index
        if (isSelected && !(field instanceof Separator) && field.description) {
            // tableFooter = dim(`  ${field.description}`)
        }
    })

    // Push the last table if it has rows
    if (currentSectionFields.length > 0) {
        currentSection.push(...currentSectionFields)
        sections.push(currentSection.join('\n\n'))
        // sections.push(tableFooter)
    }

    return sections.join('\n\n')
}
