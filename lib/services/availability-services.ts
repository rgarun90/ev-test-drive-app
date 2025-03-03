import { AvailabilityRequest } from '@/lib/types'
import { Vehicle } from '@/lib/schema/vehicle'
import { Reservation } from '@/lib/schema/reservation'

import { DaysType } from '@/lib/enums'
import { convertToUTC } from '@/lib/utils'
import { addMinutes } from 'date-fns'

// Convert time to minutes for comparison
const timeToMinutes = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

const checkExistingReservation = async (matchingVehicles: Vehicle[], request: AvailabilityRequest) => {
  const { date, timeSlot, durationMins = '45' } = request

  const reqStartTime = new Date(convertToUTC(date as unknown as string, timeSlot))
  const reqEndTime = addMinutes(reqStartTime, parseInt(durationMins))

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/testdrive/reservation`)
  const reservations: Reservation[] = await response.json()

  const availableVehicles = matchingVehicles.filter((vehicle) => {
    const existingReservations = reservations.filter((reservation) => reservation.vehicleId === vehicle.id)
    //Check for conflicts with existing reservation
    const hasConflict = existingReservations.some((reservation) => {
      const reservedStartTime = new Date(reservation.startDateTime)
      const reservedEndTime = new Date(reservation.endDateTime)

      const bufferTime = vehicle.minimumMinutesBetweenBookings * 60 * 1000
      const resEndTimeWithBuffer = new Date(reservedEndTime.getTime() + bufferTime)

      return (
        (reqStartTime >= reservedStartTime && reqStartTime < resEndTimeWithBuffer) ||
        (reqEndTime > reservedStartTime && reqEndTime <= resEndTimeWithBuffer) ||
        (reqStartTime < reservedStartTime && reqEndTime >= resEndTimeWithBuffer)
      )
    })

    return !hasConflict
  })

  if (availableVehicles.length == 0) {
    return null
  }

  // Distribute Evenly
  const vehicleReservationCounts = availableVehicles.map((vehicle) => {
    const count = reservations.filter((reservation) => reservation.vehicleId === vehicle.id).length
    return { vehicle, count }
  })

  // Sort by reservation count (ascending) to distribute evenly
  vehicleReservationCounts.sort((a, b) => a.count - b.count)

  // Return the vehicle with the fewest reservations
  return vehicleReservationCounts[0].vehicle
}

function calculateStartAndEndTime(date: Date, timeSlot: string, durationMins: string) {
  const requestedDate = new Date(date)
  const requestedDay: DaysType = requestedDate.toLocaleString('en-US', { weekday: 'short' }).toLowerCase() as DaysType // "mon", "tue", etc.
  // In UI Date and Timeslot are in local timezone but json has UTC. Hence adding(add/sub) the offset value
  const requestedStartMinutes = timeToMinutes(timeSlot) + new Date().getTimezoneOffset()
  const requestedEndMinutes = requestedStartMinutes + parseInt(durationMins)

  return {
    requestedDay,
    requestedStartMinutes,
    requestedEndMinutes,
  }
}

export async function checkAvailability(request: AvailabilityRequest) {
  const { location, vehicleType, date, timeSlot, durationMins } = request
  if (!location || !vehicleType || !date || !timeSlot || !durationMins) {
    throw new Error('Missing required query parameters')
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/testdrive/vehicles`)
  const vehicles: Vehicle[] = await response.json()

  // calculate booking start and End Time
  const { requestedDay, requestedStartMinutes, requestedEndMinutes } = calculateStartAndEndTime(
    date,
    timeSlot,
    durationMins
  )
  console.log(`Day - ${requestedDay} | StartTime - ${requestedStartMinutes} | EndTime - ${requestedEndMinutes}`)

  // Filter available vehicles
  const matchedVehicle = vehicles.filter((vehicle) => {
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

  if (matchedVehicle.length === 0) {
    throw new Error('No vehicles available for the selected time and location.')
  }

  const availableVehicle = await checkExistingReservation(matchedVehicle, request)

  if (!availableVehicle) throw new Error('Requested time conflicts with existing bookings')

  return availableVehicle
}
