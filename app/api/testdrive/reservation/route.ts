import { NextRequest, NextResponse } from 'next/server'
import { bookingFormSchema } from '@/lib/schema/booking-form'
import { Reservation } from '@/lib/schema/reservation'

import { checkAvailability } from '@/app/api/testdrive/availability/route'
import { convertToUTC } from '@/lib/utils'
import { addMinutes } from 'date-fns'

// Response Served from JSON-Server
export async function GET() {
  try {
    const response = await fetch(`${process.env.JSON_SERVER_BASE_URL}/reservations`)
    if (!response.ok) {
      throw new Error(`Fetch failed with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    let errorMessage = 'An unknown error occurred'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    //TODO: validation check
    const validatedData = bookingFormSchema.parse(body)
    console.log(validatedData)

    const { location, vehicleType, date, timeSlot, durationMins = 45 } = body //TODO: make durationMins dynamic

    const availableVehicle = await checkAvailability({
      location,
      vehicleType,
      date,
      timeSlot,
      durationMins,
    })
    console.log(`Available Vehicle - ${JSON.stringify(availableVehicle)}`)

    const startDateTime = convertToUTC(date, timeSlot)
    const endDateTime = addMinutes(startDateTime, durationMins).toISOString()
    const bookingId = Math.floor(Math.random() * 90000) + 10000

    const newReservation: Reservation = {
      id: bookingId.toString(),
      vehicleId: availableVehicle.id,
      startDateTime,
      endDateTime,
      customerName: body.name,
      customerEmail: body.email,
      customerPhone: body.phone,
    }

    const apiResponse = await fetch(`${process.env.JSON_SERVER_BASE_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newReservation),
    })
    const data = await apiResponse.json()
    console.log(data)

    return NextResponse.json({ message: `Booking Confirmed and Booking Id - ${bookingId}` })
  } catch (error) {
    let errorMessage = 'An unknown error occurred'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 })
  }
}
