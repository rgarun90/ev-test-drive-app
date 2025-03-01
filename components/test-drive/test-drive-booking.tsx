'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { cn } from '@/lib/utils'

import { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'

import { format, addDays } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  //   vehicleType: z.enum(['tesla-model-3', 'tesla-model-x', 'tesla-model-y']),
  date: z.date(),
  timeSlot: z.string(),
  location: z.string().min(2, 'Location is required'),
})

type BookingFormData = z.infer<typeof bookingSchema>

const citiesInIreland = ['Dublin', 'Cork', 'Limerick', 'Galway', 'Waterford', 'Kilkenny', 'Sligo', 'Wexford']
const timeSlots = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
]
// Calculate the date range (today to 14 days in the future)
const today = new Date()
const maxDate = addDays(today, 14)

export default function TestDriveBooking() {
  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      date: undefined,
      timeSlot: '',
      location: '',
    },
  })

  const { control, handleSubmit } = form

  const onSubmit = (data: BookingFormData) => {
    console.log(data)
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Book a Test Drive</CardTitle>
        <CardDescription>Schedule a test drive for the latest EV</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 max-w-md p-6 rounded-lg shadlow-lg'>
            {/* Name Field */}
            <FormField
              control={control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Field */}
            <FormField
              control={control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Field */}
            <FormField
              control={control}
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      {/* className='w-full border border-gray-300 rounded-md h-9 text-left pl-2' */}
                      <SelectTrigger>
                        <SelectValue placeholder='Select location' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {citiesInIreland.map((city, idx) => (
                        <SelectItem key={`${idx}-${city}`} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Field */}
            <FormField
              control={control}
              name='date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Select a date</span>}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < today || date > maxDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Bookings are available for next 14 days</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Field */}
            <FormField
              control={control}
              name='timeSlot'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select a Time</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      {/* className='w-full border border-gray-300 rounded-md h-9 text-left pl-2' */}
                      <SelectTrigger>
                        <SelectValue placeholder='Select a time slot' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSlots.map((time, idx) => (
                        <SelectItem key={`${idx}-${time}`} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full'>
              Book Test Drive
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
