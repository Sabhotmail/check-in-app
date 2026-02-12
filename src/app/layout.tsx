import type { Metadata } from 'next'
import { Outfit, Inter } from 'next/font/google'
import './globals.css'

const fontSans = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
})

const fontMono = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Check-in System',
  description: 'Employee Attendance & Management',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${fontSans.variable} ${fontMono.variable} antialiased bg-gray-950 text-gray-100 font-sans`}>
        {children}
      </body>
    </html>
  )
}
