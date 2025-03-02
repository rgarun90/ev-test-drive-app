import { z } from 'zod'

export const vehicleSchema = z.object({
  id: z.string(),
  type: z.string(),
  location: z.string(),
  availableFromTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, 'Invalid time format (HH:MM:SS)'),
  availableToTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, 'Invalid time format (HH:MM:SS)'),
  availableDays: z.array(z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'])),
  minimumMinutesBetweenBookings: z.number().int().positive(),
})

export type Vehicle = z.infer<typeof vehicleSchema>
