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

```tsx
import form from 'inquirer-form-prompt'

const answer = await form({
    message: 'Choose an option',
    choices: [
        { name: '1', value: '1' },
        { name: '2', value: '2' },
        { name: '3', value: '3' },
    ],
})
```

See `src/example.ts` for a more thorough example.
