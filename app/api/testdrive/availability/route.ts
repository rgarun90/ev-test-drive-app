import { NextRequest, NextResponse } from 'next/server'
import { checkAvailability } from '@/lib/services/availability-services'

export async function POST(req: NextRequest) {
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
