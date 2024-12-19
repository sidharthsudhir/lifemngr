'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { Home, CheckSquare, Timer, BookOpen, Target, CuboidIcon, LogOut } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/habits', icon: CheckSquare, label: 'Habits' },
  { href: '/pomodoro', icon: Timer, label: 'Pomodoro' },
  { href: '/journal', icon: BookOpen, label: 'Journal' },
  { href: '/goals', icon: Target, label: 'Goals' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <nav className="fixed left-4 top-4 bottom-4 w-16 bg-zinc-800 rounded-lg shadow-lg flex flex-col items-center py-4">
      <Link href="/dashboard" className="mb-8">
        <CuboidIcon className="w-8 h-8 text-primary" />
        <span className="sr-only">Life Mngr</span>
      </Link>
      <div className="flex-1 flex flex-col items-center space-y-4">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100 transition-colors",
              pathname === href && "bg-zinc-700 text-zinc-100"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="sr-only">{label}</span>
          </Link>
        ))}
      </div>
      <Button variant="ghost" size="icon" onClick={signOut} className="mt-auto text-zinc-400 hover:text-zinc-100">
        <LogOut className="w-5 h-5" />
        <span className="sr-only">Log out</span>
      </Button>
    </nav>
  )
}

