import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { parseISO, setHours, setMinutes, setSeconds } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToUTC(isoString: string, timeString: string): string {
  // Parse the base date in UTC
  const baseDate = parseISO(isoString)
  // Extract hours and minutes from the time string
  const [hours, minutes] = timeString.split(':').map(Number)
  // Create the final UTC date with the given time
  const finalUTCDate = setSeconds(setMinutes(setHours(baseDate, hours), minutes), 0)

  return finalUTCDate.toISOString()
}
