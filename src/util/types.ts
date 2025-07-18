import type { Separator, Theme, useKeypress } from '@inquirer/core'
import type { PartialDeep } from '@inquirer/type'

export type FormTheme = {
    variant?: 'table' | 'label-top'
    dense?: boolean
}

export type Config = {
    message?: string
    submessage?: string
    default?: boolean
    fields: Fields
    theme?: PartialDeep<Theme<FormTheme>>
}

type FieldBase = {
    label: string
    description?: string
}
export type TextField = FieldBase & {
    type: 'text'
    value?: string
}
export type BooleanField = FieldBase & {
    type: 'boolean'
    value?: boolean
}
export type RadioField = FieldBase & {
    type: 'radio'
    choices: Array<string>
    value?: string
}
type CheckboxField = FieldBase & {
    type: 'checkbox'
    choices: Array<string>
    value?: Array<string>
}
/**
 * With additional prop for internal use
 */
export type InternalCheckboxField = CheckboxField & {
    highlightIndex: number
}

export type FormField = TextField | BooleanField | RadioField | CheckboxField

/**
 * Object that is defined by the user. A single prompt accepts one or more Fields.
 */
export type Field = FormField | Separator

/**
 * List of objects that is defined by the user. A single prompt accepts one or more Fields.
 */
export type Fields = Array<Field>

/**
 * Field with some additional data that is only used internally.
 */
export type InternalFormField = TextField | BooleanField | RadioField | InternalCheckboxField
export type InternalField = InternalFormField | Separator

/**
 * Fields with some additional data that is only used internally.
 */
export type InternalFields = Array<InternalField>

export type ReturnedField = Pick<FormField, 'type' | 'label' | 'value'>

/**
 * Response that is returned to the user.
 */
export type ReturnedItem = ReturnedField | Separator

/**
 * List of responses that is returned to the user.
 */
export type ReturnedItems = Array<ReturnedItem>

// Because Inquirer doesn't export this type
export type InquirerReadline = Parameters<Parameters<typeof useKeypress>[0]>[1]
