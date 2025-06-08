# inquirer-form-prompt

A prompt for [inquirer](https://github.com/SBoudrias/Inquirer.js) that presents a form with multiple fields and form-like interaction

<img src="https://github.com/user-attachments/assets/a19048db-24c2-4039-80dc-dd023463f0aa" alt="" width="920">

<!-- ![](https://github.com/user-attachments/assets/a77b4eaa-f1a1-4a89-83ab-30ecea57110e) -->

## Install

```sh
pnpm add inquirer-form-prompt
yarn add inquirer-form-prompt
npm add inquirer-form-prompt
```

## Usage

At minimum, the prompt config must include a `message: string` and a `choices: Array<Field>`

Example:

```tsx
import form from 'inquirer-form-prompt'

const answer = await form({
    message: 'Trip Details',
    choices: [
        {
            name: 'Full name',
            type: 'text',
        },
        {
            name: 'Transport type',
            type: 'radio',
            choices: ['Train', 'Flight', 'Bus'],
            value: 'Train',
        },
        {
            name: 'Activities',
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
name: string // The field's label
description?: string // Help text that will appear when the field is focused
```

### Text

Use this field for strings, numbers, and free entry. Users may also paste from the clipboard when this field is focused.

<img src="https://github.com/user-attachments/assets/aa269f31-c1dd-4fb3-a890-2ec52b080389" alt="" width="360">

```tsx
type: 'text'
value?: string // Optional default value
```

Example:

```tsx
{
    name: 'Full name',
    type: 'text',
    description: 'As it appears on your passport'
}
```

### Boolean

Use this field for true-or-false entry.

The left and right arrow keys move between the two options. Pressing the spacebar selects or deselects that option.

<img src="https://github.com/user-attachments/assets/e0a864c8-9cd1-42ab-bd8e-3df9f36d6962" alt="" width="480">

```tsx
type: 'boolean'
value?: boolean // Optional default value
```

Example:

```tsx
{
    name: 'Do you need a visa?',
    type: 'boolean',
}
```

### Radio button options (select one)

Use this field when the user must choose exactly one option.

The left and right arrow keys moves the selection.

<img src="https://github.com/user-attachments/assets/f19a738b-95f1-4868-a443-e23f02be5ef7" alt="" width="640">

```tsx
type: 'radio'
choices: Array<string>
value?: boolean // Optional default value, must match one of the choices
```

Example:

```tsx
{
    name: 'Age group',
    type: 'radio',
    choices: ['0-25', '26-50', '51-75', '76-100']
    description: 'In years, on the first day of travel'
}
```

### Check box options (multiple selection)

Use this field when the user may choose multiple options.

The left and right arrow keys move between options. Pressing the spacebar selects or deselects an option. When the form is submitted, only the selected values will be returned.

<img src="https://github.com/user-attachments/assets/e9118f0e-4c36-424b-9ee0-b1a513da4057" alt="" width="920">

```tsx
type: 'checkbox'
choices: Array<string>
value?: Array<string> // Optional default value, each string must match one of the choices
```

Example:

```tsx
{
    name: 'Activities of Interest',
    type: 'checkbox',
    choices: ['Museums & Art', 'Local Cuisine', 'Historical Sites', 'Nightlife', 'Nature & Parks'],
    value: ['Museums & Art', 'Local Cuisine'],
}
```

## Grouping fields

Fields may be split into groups by placing separators between them.
