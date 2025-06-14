# inquirer-form-prompt

A prompt for [inquirer](https://github.com/SBoudrias/Inquirer.js) that presents a form with multiple fields and form-like interaction

<img src="https://github.com/user-attachments/assets/a19048db-24c2-4039-80dc-dd023463f0aa" alt="Screencast of filling all fields in the demo" width="920">

<!-- ![](https://github.com/user-attachments/assets/a77b4eaa-f1a1-4a89-83ab-30ecea57110e) -->

## Install

```sh
pnpm add inquirer-form-prompt
yarn add inquirer-form-prompt
npm add inquirer-form-prompt
```

## Usage

At minimum, the prompt config must include `message: string` and `fields: Array<Field>`

Example:

```tsx
import form from 'inquirer-form-prompt'

const answer = await form({
    message: 'Trip Details',
    fields: [
        {
            label: 'Full name',
            type: 'text',
        },
        {
            label: 'Transport type',
            type: 'radio',
            choices: ['Train', 'Flight', 'Bus'],
            value: 'Train',
        },
        {
            label: 'Activities',
            type: 'checkbox',
            choices: ['Museums', 'Local Cuisine', 'Historical Sites', 'Nightlife', 'Nature & Parks'],
            value: ['Museums', 'Local Cuisine'],
            description: 'What activities interest you most? (Select all that apply)',
        },
    ],
})
```

> [!tip]
> See `src/demo.ts` for a more thorough example.

## Fields

All fields take the following properties:

```tsx
label: string // The input field's label
description?: string // Help text that will appear when the field is focused
```

### Text

Use this field for strings, numbers, and free entry. Users may also paste from the clipboard when this field is focused.

<img src="https://github.com/user-attachments/assets/aa269f31-c1dd-4fb3-a890-2ec52b080389" alt="Filled in two text fields with the user's name and destination city" width="360">

```tsx
type: 'text'
value?: string // Optional default value
```

Example:

```tsx
{
    label: 'Full name',
    type: 'text',
    description: 'As it appears on your passport'
}
```

### Boolean

Use this field for true-or-false entry.

The left and right arrow keys move between the two options. Pressing the spacebar selects or deselects that option.

<img src="https://github.com/user-attachments/assets/e0a864c8-9cd1-42ab-bd8e-3df9f36d6962" alt="Moving the selection around in a field" width="480">

```tsx
type: 'boolean'
value?: boolean // Optional default value
```

Example:

```tsx
{
    label: 'Do you need a visa?',
    type: 'boolean',
}
```

### Radio button options (select one)

Use this field when the user must choose exactly one option.

The left and right arrow keys move the selection.

<img src="https://github.com/user-attachments/assets/f19a738b-95f1-4868-a443-e23f02be5ef7" alt="Moving the selection among radio button options" width="640">

```tsx
type: 'radio'
choices: Array<string>
value?: boolean // Optional default value, must match one of the choices
```

Example:

```tsx
{
    label: 'Age group',
    type: 'radio',
    choices: ['0-25', '26-50', '51-75', '76-100']
    description: 'In years, on the first day of travel'
}
```

### Check box options (multiple selection)

Use this field when the user may choose multiple options.

The left and right arrow keys move between options. Pressing the spacebar selects or deselects an option. When the form is submitted, only the selected values will be returned.

<img src="https://github.com/user-attachments/assets/e9118f0e-4c36-424b-9ee0-b1a513da4057" alt="Moving the cursor among checkbox options and changing the selection" width="920">

```tsx
type: 'checkbox'
choices: Array<string>
value?: Array<string> // Optional default value, each string must match one of the choices
```

Example:

```tsx
{
    label: 'Activities of Interest',
    type: 'checkbox',
    choices: ['Museums & Art', 'Local Cuisine', 'Historical Sites', 'Nightlife', 'Nature & Parks'],
    value: ['Museums & Art', 'Local Cuisine'],
}
```

## Grouping fields

Fields may be split into groups by placing separators between them in the `fields` array. See examples below.

## Theming

The config object accepts a `theme` prop which can be used to specify a variant.

```tsx
theme?: {
    variant: 'table' | 'label-top'
    dense?: boolean
}
```

### Table

This is the default theme. Each field label and input is displayed in a table row. If a separator is included, it will split the fields into separate tables.

In this example, "Trip Details" and "Preferences" are both separators:

<img src="https://github.com/user-attachments/assets/4a4f19f9-c40c-47fb-bd2b-10b30079d655" width="480" alt="">

### Label Top

With this variant, the label is displayed above the input field. If a separator is included, it will split the fields into separate tables.

<img src="https://github.com/user-attachments/assets/db8e6a02-ce9e-4b57-b1cb-2f361fda4ee9" width="920" alt="">

This variant also supports a `dense` option which removes some of the extra spacing around the fields:

```tsx
theme: {
    variant: 'label-top',
    dense: true
}
```
