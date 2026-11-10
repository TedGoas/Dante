import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Registers our custom font size, or text-body gets treated as a color.
const twMerge = extendTailwindMerge({ extend: { theme: { text: ['body'] } } })

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
