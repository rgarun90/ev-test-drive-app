export type VehicleType = 'tesla_model3' | 'tesla_modelx' | 'tesla_modely'

export interface AvailabilityRequest {
  location: string
  vehicleType: VehicleType
  date: Date
  timeSlot: string
  durationMins?: string
}
