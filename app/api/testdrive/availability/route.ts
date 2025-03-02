import { NextRequest, NextResponse } from 'next/server'
import { AvailabilityRequest } from '@/lib/types'
import { Vehicle } from '@/lib/schema/vehicle'
// import { Reservation } from '@/lib/schema/reservation'

import { DaysType } from '@/lib/enums'

// Convert time to minutes for comparison
const timeToMinutes = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

// TODO
// const checkExistingReservation = async (matchingVehicles: Vehicle[]) => {
//   const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/testdrive/reservation`)
//   const reservations: Reservation[] = await response.json()
//   console.log(reservations)

//   const availableVehicles = matchingVehicles.filter((vehicle) => {
//     const vehicleReservations = reservations.filter((reservation) => reservation.vehicleId === vehicle.id)
//   })
// }

export async function checkAvailability(request: AvailabilityRequest) {
  const { location, vehicleType, date, timeSlot, durationMins } = request

  if (!location || !vehicleType || !date || !timeSlot || !durationMins) {
    throw new Error('Missing required query parameters')
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/testdrive/vehicles`)
  const vehicles: Vehicle[] = await response.json()

  // Booking Date
  const requestedDate = new Date(date)
  const requestedDay: DaysType = requestedDate.toLocaleString('en-US', { weekday: 'short' }).toLowerCase() as DaysType // "mon", "tue", etc.

  // Booking Time
  const requestedStartMinutes = timeToMinutes(timeSlot)
  const requestedEndMinutes = requestedStartMinutes + parseInt(durationMins)

  console.log(`Day - ${requestedDay} | StartTime - ${requestedStartMinutes} | EndTime - ${requestedEndMinutes}`)
  // Filter available vehicles
  const availableVehicles = vehicles.filter((vehicle) => {
    if (vehicle.location !== location.toLowerCase() || vehicle.type !== vehicleType) {
      return false
    }

    if (!vehicle.availableDays.includes(requestedDay)) {
      return false
    }

    const availableStartMinutes = timeToMinutes(vehicle.availableFromTime)
    const availableEndMinutes = timeToMinutes(vehicle.availableToTime)

    console.log(`vehicleId - ${vehicle.id} | ST- ${availableStartMinutes} | ET-${availableEndMinutes}`)
    return requestedStartMinutes >= availableStartMinutes && requestedEndMinutes <= availableEndMinutes
  })

  if (availableVehicles.length === 0) {
    throw new Error('No available vehicles for the selected time.')
  }

  //   checkExistingReservation(availableVehicles)

  return availableVehicles[0]
}

export default async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { location, vehicleType, date, timeSlot, durationMins = '45' } = body //TODO: make durationMins dynamic

    const availableVehicles = await checkAvailability({
      location,
      vehicleType,
      date,
      timeSlot,
      durationMins,
    })

    return NextResponse.json({ availableVehicles })
  } catch (error) {
    return NextResponse.json({ message: 'Error : ' + error }, { status: 400 })
  }
}
