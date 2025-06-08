import { createPrompt } from '@inquirer/core'
import readline from 'readline'
import { promptCreator } from './promptCreator.js'
import type { Config, ReturnedItems } from './util/types.js'

export default async function form(options: Config): Promise<ReturnedItems> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    // @ts-expect-error Only way I know how to hide the cursor
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    rl.output.write('\x1B[?25l')

    const answer = await createPrompt<ReturnedItems, Config>(promptCreator)(options)

    // @ts-expect-error Only way I know how to show the cursor
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    rl.output.write('\x1B[?25h')
    rl.close()

    // Check if the user aborted
    if (typeof answer === 'symbol' && String(answer) === 'Symbol(Escape key pressed)') {
        throw new Error('Escape key pressed')
    }

    return answer
}

export type {
    BooleanField,
    Config,
    Field,
    Fields,
    FormField,
    RadioField,
    ReturnedField,
    ReturnedItem,
    ReturnedItems,
    TextField,
} from './util/types.js'
