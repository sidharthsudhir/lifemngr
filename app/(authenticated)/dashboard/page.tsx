'use client'

import { useAuth } from '@/context/auth-context'
import { Header } from "@/components/header"
import { DailyHabitReminder } from "@/components/daily-habit-reminder"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, Timer, BookOpen, Target } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <Header title={`Welcome, ${user.email}`} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <QuickLinkCard href="/habits" icon={CheckSquare} title="Habits" />
        <QuickLinkCard href="/pomodoro" icon={Timer} title="Pomodoro" />
        <QuickLinkCard href="/journal" icon={BookOpen} title="Journal" />
        <QuickLinkCard href="/goals" icon={Target} title="Goals" />
      </div>
      <DailyHabitReminder />
    </div>
  )
}

function QuickLinkCard({ href, icon: Icon, title }: { href: string, icon: any, title: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Link href={href} className="text-2xl font-bold hover:underline">
          View
        </Link>
      </CardContent>
    </Card>
  )
}

