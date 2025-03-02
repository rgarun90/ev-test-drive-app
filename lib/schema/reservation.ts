import { z } from 'zod'

export const reservationSchema = z.object({
  id: z.number().int().positive(), // Ensures it's a positive integer
  vehicleId: z.string().min(1), // Ensures it's a non-empty string
  startDateTime: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, 'Invalid ISO 8601 UTC datetime format'), // Validates ISO 8601 UTC format
  endDateTime: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, 'Invalid ISO 8601 UTC datetime format'), // Same validation as startDateTime
  customerName: z.string().min(1), // Ensures name is not empty
  customerEmail: z.string().email(), // Ensures a valid email format
  customerPhone: z.string().regex(/^\+?\d{1,4}?\d{6,14}$/, 'Invalid phone number format'), // Allows international phone numbers
})

export type Reservation = z.infer<typeof reservationSchema>
