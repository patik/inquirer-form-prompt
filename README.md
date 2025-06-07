# inquirer-form-prompt

Inquirer multi-field prompt with form-like interface

A prompt for [inquirer](https://github.com/SBoudrias/Inquirer.js)

![Demo](https://github.com/user-attachments/assets/a77b4eaa-f1a1-4a89-83ab-30ecea57110e)

You provide a `statefulBanner` function. This function receives a `setState` function which can be called at will. The string sent to `setState` is shown above the select prompt. `statefulBanner` can also return a cleanup function.

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

### Return value

If your banner has any side effects (e.g. timeouts), you can return a cleanup function which will be called when the prompt quits.

### Example

See `src/example.ts` for a full example using `async`/`await`.
