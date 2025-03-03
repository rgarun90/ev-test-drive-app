'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTestDrive } from '@/context/TestDriveContext'

import { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { type bookingFormValues, bookingFormSchema } from '@/lib/schema/booking-form'
import { timeSlotOptions, cityOptions } from '@/lib/enums'
import { cn } from '@/lib/utils'

import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

import { format, addDays } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

export default function TestDriveBooking() {
  const { vehicleType } = useTestDrive()
  const [open, setOpen] = useState(false)

  // Calculate the date range (today to 14 days in the future)
  const today = new Date()
  const maxDate = addDays(today, 14)

  const form = useForm({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      date: undefined,
      timeSlot: '',
      location: '',
    },
  })
  const { control, handleSubmit, reset } = form

  const onSubmit = async (data: bookingFormValues) => {
    const response = await fetch('/api/testdrive/reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, vehicleType }),
    })

    const result = await response.json()

    if (response.ok) {
      reset()
      toast.success(result.message, { duration: 10000 })
    } else {
      toast.error(result.message, { duration: 5000 })
    }
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
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      {/* className='w-full border border-gray-300 rounded-md h-9 text-left pl-2' */}
                      <SelectTrigger>
                        <SelectValue placeholder='Select location' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cityOptions.map((city, idx) => (
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
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          onClick={() => setOpen((prev) => !prev)}
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
                        onSelect={(date) => {
                          field.onChange(date)
                          setOpen(false) // Close the popover after selection
                        }}
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
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      {/* className='w-full border border-gray-300 rounded-md h-9 text-left pl-2' */}
                      <SelectTrigger>
                        <SelectValue placeholder='Select a time slot' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSlotOptions.map((time, idx) => (
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
