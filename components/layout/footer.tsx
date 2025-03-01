import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='border-t bg-background'>
      <div className='container flex flex-col md:flex-row items-center justify-between py-6 px-4 gap-4'>
        <div className='text-center md:text-left'>
          <p className='text-sm text-muted-foreground'>
            &copy; {new Date().getFullYear()} EV Test Drive. All rights reserved.
          </p>
        </div>
        <div className='flex gap-6'>
          <Link href='#' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
            Privacy Policy
          </Link>
          <Link href='#' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
            Terms of Service
          </Link>
          <Link href='#' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  )
}
