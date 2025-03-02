'use client'
import { createContext, useContext, useState, type ReactNode } from 'react'
import { VehicleType } from '@/lib/types'

interface TestDriveContextType {
  vehicleType: VehicleType | null
  setVehicleType: (model: VehicleType | null) => void
}

// Create the context with default values
const TestDriveContext = createContext<TestDriveContextType | undefined>(undefined)

// Context provider component
export const TestDriveProvider = ({ children }: { children: ReactNode }) => {
  const [vehicleType, setVehicleType] = useState<VehicleType | null>('tesla_modelx')

  return <TestDriveContext.Provider value={{ vehicleType, setVehicleType }}>{children}</TestDriveContext.Provider>
}

// Custom hook to use the context
export const useTestDrive = () => {
  const context = useContext(TestDriveContext)
  if (!context) {
    throw new Error('useTestDrive must be used within an TestDriveProvider')
  }
  return context
}
