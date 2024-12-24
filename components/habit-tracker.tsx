'use client'

import { useMemo, useState } from 'react'
import { eachDayOfInterval, format, isSameDay, startOfMonth, endOfMonth, subMonths, addMonths, isToday } from 'date-fns'
import { cn } from "@/lib/utils"
import { Flame, Trash2Icon } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useHabits } from "@/context/habits-context"

interface HabitTrackerProps {
  habit: {
    id: string
    name: string
  }
  completions: Array<{ completed_at: string }>
  onToggle: () => void
  readOnly?: boolean
}

export function HabitTracker({ habit, completions, onToggle, readOnly = false }: HabitTrackerProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { deleteHabit } = useHabits()

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

  const handleDelete = async () => {
    await deleteHabit(habit.id)
    setShowDeleteDialog(false)
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
        <div className="flex items-center gap-2">
          {!readOnly && (
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
          )}
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="p-2 text-red-500 hover:text-red-600 rounded-full hover:bg-red-500/10"
            title="Delete habit"
          >
            <Trash2Icon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex justify-between w-full gap-4">
        {months.map(({ month, days }) => (
          <div key={month} className="flex flex-col gap-4">
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the habit
              "{habit.name}" and remove all of its completion data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

