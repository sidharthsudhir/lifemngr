'use client'

import { useAuth } from '@/context/auth-context'
import { Header } from "@/components/header"
import { DailyHabitReminder } from "@/components/daily-habit-reminder"
import { YearProgress } from "@/components/year-progress"
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
      <YearProgress />
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-[1fr_4fr] gap-8 px-4">
        <div className="grid gap-4 md:grid-rows-2 lg:grid-rows-4">
          <QuickLinkCard href="/habits" icon={CheckSquare} title="Habits" />
          <QuickLinkCard href="/pomodoro" icon={Timer} title="Pomodoro" />
          <QuickLinkCard href="/journal" icon={BookOpen} title="Journal" />
          <QuickLinkCard href="/goals" icon={Target} title="Goals" />
        </div>
        <div>
          <DailyHabitReminder />
        </div>
      </div>
    </div>
  )
}

function QuickLinkCard({ href, icon: Icon, title }: { href: string, icon: any, title: string }) {
  return (
    <Card className="transition-transform duration-200 hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Link href={href} className="text-xs font-bold hover:underline">
          View
        </Link>
      </CardContent>
    </Card>
  )
}

