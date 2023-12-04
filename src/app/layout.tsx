import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "@/components/NavBar";



const inter = Inter({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: 'Technopark Timetable',
  description: 'Technopark Timetable',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={'container-xxl'}>
            <NavBar/>
            {children}
        </div>
      </body>
    </html>
  )
}
