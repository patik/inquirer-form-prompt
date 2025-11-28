import { styleText } from 'node:util'

export const bgGray = (text: string): string => styleText('bgGray', text)
export const bold = (text: string): string => styleText('bold', text)
export const dim = (text: string): string => styleText('dim', text)
export const green = (text: string): string => styleText('green', text)
export const underline = (text: string): string => styleText('underline', text)
