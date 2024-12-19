import { AuthProvider } from '@/context/auth-context'
import { HabitsProvider } from '@/context/habits-context'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import './globals.css'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Life Mngr",
  description: "Your all-in-one life management solution",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <HabitsProvider>
            {children}
          </HabitsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

