# inquirer-form-prompt

A prompt for [inquirer](https://github.com/SBoudrias/Inquirer.js) that presents a form with multiple fields and form-like interaction

![](https://github.com/user-attachments/assets/a77b4eaa-f1a1-4a89-83ab-30ecea57110e)

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

Use this field for strings, numbers, and free entry.

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

```tsx
type: 'boolean'
value?: boolean // Optional default value
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
