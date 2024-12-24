'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/auth-context'
import { Header } from '@/components/header'
import { CreateHabitDialog } from '@/components/create-habit-dialog'
import { HabitTracker } from '@/components/habit-tracker'
import { format } from 'date-fns'
import { useHabits } from '@/context/habits-context'

export default function HabitsPage() {
  const { user, loading: authLoading } = useAuth()
  const { habits, completions, loading: habitsLoading } = useHabits()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && user) {
      setLoading(false)
    }
  }, [authLoading, user])

  if (authLoading || loading || habitsLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300" />
      </div>
    )
  }

  return (
    <div>
      <Header title="Habits" />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Habits</h2>
          <p className="text-muted-foreground">
            Track your daily habits and build streaks
          </p>
        </div>
        <CreateHabitDialog />
      </div>
      
      {habits.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No habits created yet.</p>
          <p className="text-muted-foreground">Create your first habit to get started!</p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 space-y-8">
          {habits.map((habit) => {
            const habitCompletions = completions.filter(
              completion => completion.habit_id === habit.id
            )
            return (
              <HabitTracker
                key={habit.id}
                habit={{
                  id: habit.id,
                  name: habit.title
                }}
                completions={habitCompletions.map(completion => ({
                  completed_at: completion.completed_date
                }))}
                readOnly={true}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

