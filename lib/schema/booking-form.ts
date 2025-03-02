import { z } from 'zod'
import { parseISO } from 'date-fns'

export const bookingFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),

  date: z.preprocess(
    (val) => (typeof val === 'string' ? parseISO(val) : val),
    z.date({ required_error: 'Please select a date for your test drive' })
  ),
  timeSlot: z.string({ required_error: 'Please select a location' }),
  location: z.string({ required_error: 'Location is required' }),
})

export type bookingFormValues = z.infer<typeof bookingFormSchema>
