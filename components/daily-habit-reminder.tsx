'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/context/auth-context'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { supabase } from '@/lib/supabase'

type HabitCompletion = {
  id: string
  habit_id: string
  completed_date: string
  user_id: string
}

type Habit = {
  id: string
  title: string
  user_id: string
}

export function DailyHabitReminder() {
  const { user, session } = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])
  const [completions, setCompletions] = useState<HabitCompletion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchHabitsAndCompletions()
    }
  }, [session])

  async function fetchHabitsAndCompletions() {
    try {
      // Fetch habits
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', session?.user.id)

      if (habitsError) throw habitsError

      // Fetch today's completions
      const today = format(new Date(), 'yyyy-MM-dd')
      const { data: completionsData, error: completionsError } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', session?.user.id)
        .eq('completed_date', today)

      if (completionsError) throw completionsError

      setHabits(habitsData || [])
      setCompletions(completionsData || [])
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.message || 'Failed to fetch habits')
    } finally {
      setLoading(false)
    }
  }

  const isHabitCompletedForDate = (habitId: string, date: string) => {
    return completions.some(
      completion => 
        completion.habit_id === habitId && 
        completion.completed_date === date
    )
  }

  const toggleHabit = async (habitId: string, date: string) => {
    try {
      if (!session) {
        toast.error('Please login to update habits')
        return
      }

      const isCompleted = isHabitCompletedForDate(habitId, date)

      if (isCompleted) {
        // Delete completion
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .match({ 
            habit_id: habitId, 
            completed_date: date,
            user_id: session.user.id 
          })

        if (error) throw error
      } else {
        // Add completion
        const { error } = await supabase
          .from('habit_completions')
          .insert([
            {
              habit_id: habitId,
              completed_date: date,
              user_id: session.user.id
            }
          ])

        if (error) throw error
      }

      // Refresh completions
      fetchHabitsAndCompletions()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update habit')
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
        <CardTitle>Daily Habits</CardTitle>
      </CardHeader>
      <CardContent>
        {habits.length === 0 ? (
          <p className="text-muted-foreground">No habits created yet. Add some habits to get started!</p>
        ) : (
          <ul className="space-y-2">
            {habits.map((habit) => (
              <li key={habit.id} className="flex items-center justify-between">
                <span>{habit.title}</span>
                <Button
                  variant={isHabitCompletedForDate(habit.id, today) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleHabit(habit.id, today)}
                >
                  {isHabitCompletedForDate(habit.id, today) ? "Completed" : "Mark Complete"}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

