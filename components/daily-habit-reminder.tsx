'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from 'date-fns'
import { useHabits } from '@/context/habits-context'
import { cn } from "@/lib/utils"
import confetti from 'canvas-confetti'
import { useRef } from 'react'

export function DailyHabitReminder() {
  const { habits, completions, toggleHabit, loading } = useHabits()
  
  const isHabitCompletedForDate = (habitId: string, date: string) => {
    return completions.some(
      completion => 
        completion.habit_id === habitId && 
        completion.completed_date === date
    )
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x: 0.9, y: 0.7 },  // Adjusted to appear near the button area
      colors: ['#22c55e', '#16a34a', '#15803d'], // Green shades
      startVelocity: 20,
      ticks: 200
    })
  }

  const handleToggle = async (habitId: string, date: string) => {
    const wasCompleted = isHabitCompletedForDate(habitId, date)
    await toggleHabit(habitId, date)
    
    // Only show confetti when marking as complete, not when uncompleting
    if (!wasCompleted) {
      triggerConfetti()
    }
  }

  const today = format(new Date(), 'yyyy-MM-dd')

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Habits</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading habits...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Daily Habits</CardTitle>
      </CardHeader>
      <CardContent>
        {habits.length === 0 ? (
          <p className="text-muted-foreground">No habits created yet. Add some habits to get started!</p>
        ) : (
          <ul className="space-y-2">
            {habits.map((habit) => {
              const isCompleted = isHabitCompletedForDate(habit.id, today)
              return (
                <li 
                  key={habit.id} 
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg transition-all duration-300",
                    isCompleted ? "bg-green-500/10" : "bg-transparent"
                  )}
                >
                  <span className={cn(
                    "transition-colors duration-300",
                    isCompleted ? "text-green-500" : ""
                  )}>
                    {habit.title}
                  </span>
                  <Button
                    variant={isCompleted ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToggle(habit.id, today)}
                    className={cn(
                      "transition-all duration-300",
                      isCompleted 
                        ? "bg-green-500 hover:bg-green-600 text-white" 
                        : ""
                    )}
                  >
                    {isCompleted ? "Completed" : "Mark Complete"}
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

