'use client'

import { useMemo } from 'react'
import { eachDayOfInterval, format, isSameDay, startOfMonth, endOfMonth, subMonths, addMonths, isToday } from 'date-fns'
import { cn } from "@/lib/utils"
import { Flame } from 'lucide-react'

interface HabitTrackerProps {
  habit: {
    id: string
    name: string
  }
  completions: Array<{ completed_at: string }>
  onToggle: () => void
}

export function HabitTracker({ habit, completions, onToggle }: HabitTrackerProps) {
  const months = useMemo(() => {
    const today = new Date()
    const sevenMonthsAgo = subMonths(today, 7)
    const nextMonth = addMonths(today, 1)
    const startDate = startOfMonth(sevenMonthsAgo)
    const endDate = endOfMonth(nextMonth)

    const days = eachDayOfInterval({ start: startDate, end: endDate })
    const monthsData: any[] = []
    let currentMonth: string | null = null

    days.forEach(day => {
      const monthKey = format(day, 'MMM yyyy')
      if (monthKey !== currentMonth) {
        currentMonth = monthKey
        monthsData.push({
          month: monthKey,
          days: []
        })
      }
      monthsData[monthsData.length - 1].days.push(day)
    })

    return monthsData
  }, [])

  const currentStreak = useMemo(() => {
    let streak = 0
    const today = new Date()
    let currentDate = today

    while (true) {
      const hasCompletion = completions.some(completion =>
        isSameDay(new Date(completion.completed_at), currentDate)
      )

      if (!hasCompletion) break
      streak++
      currentDate = new Date(currentDate.setDate(currentDate.getDate() - 1))
    }

    return streak
  }, [completions])

  const getDayColor = (date: Date) => {
    const hasCompletion = completions.some(completion => 
      isSameDay(new Date(completion.completed_at), date)
    )
    
    if (!hasCompletion) return 'bg-muted'
    return 'bg-green-500'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{habit.name}</h3>
          {currentStreak > 0 && (
            <div className="flex items-center gap-1 text-sm text-orange-500">
              <Flame className="h-4 w-4" />
              <span>{currentStreak}</span>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className={cn(
            "px-3 py-1 rounded-md text-sm transition-colors",
            completions.some(c => isSameDay(new Date(c.completed_at), new Date()))
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-muted hover:bg-muted/80"
          )}
        >
          {completions.some(c => isSameDay(new Date(c.completed_at), new Date()))
            ? "Completed"
            : "Mark Complete"}
        </button>
      </div>

      <div className="flex justify-between w-full">
        {months.map(({ month, days }) => (
          <div key={month} className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{month}</span>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "w-3 h-3 rounded-sm",
                    getDayColor(day)
                  )}
                  title={`${format(day, 'PP')}: ${
                    completions.some(c => isSameDay(new Date(c.completed_at), day))
                      ? 'Completed'
                      : 'Not completed'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

