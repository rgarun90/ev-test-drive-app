import Link from 'next/link'
import { Car } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className='border-b bg-background sticky top-0 z-30'>
      <div className='container flex h-16 items-center justify-between px-4'>
        <Link href='/' className='flex items-center space-x-2'>
          <Car className='h-6 w-6' />
          <span className='font-bold text-xl'>EV Test Drive</span>
        </Link>
        <div className='flex items-center gap-4'>
          <Link href='/' legacyBehavior passHref>
            <Button variant='ghost' size='sm'>
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
