import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { TestDriveProvider } from '@/context/TestDriveContext'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'EV Test Drive Booking',
  description: 'Book a test drive with our latest electric vehicles',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className='flex min-h-screen flex-col'>
          <Header />
          <TestDriveProvider>
            <main className='flex-1 p-2'>{children}</main>
            <Toaster position='top-center' />
          </TestDriveProvider>
          <Footer />
        </div>
      </body>
    </html>
  )
}
