"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from './auth-context'
import { toast } from 'sonner'

const supabase = createClientComponentClient()

interface Habit {
  id: string
  title: string
  user_id: string
  created_at: string
}

interface HabitCompletion {
  id: string
  habit_id: string
  completed_date: string
  user_id: string
}

interface HabitsContextType {
  habits: Habit[]
  loading: boolean
  addHabit: (title: string) => Promise<void>
  toggleHabit: (habitId: string, date: string) => Promise<void>
  refreshHabits: () => Promise<void>
  completions: HabitCompletion[]
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined)

export function HabitsProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [completions, setCompletions] = useState<HabitCompletion[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchHabits = async () => {
    try {
      if (!user) return

      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (habitsError) throw habitsError

      const { data: completionsData, error: completionsError } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)

      if (completionsError) throw completionsError

      setHabits(habitsData || [])
      setCompletions(completionsData || [])
    } catch (error: any) {
      console.error('Error fetching habits:', error)
      toast.error('Failed to load habits')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchHabits()
    }
  }, [user])

  const addHabit = async (title: string) => {
    try {
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('habits')
        .insert([
          {
            title,
            user_id: user.id,
            created_at: new Date().toISOString()
          }
        ])

      if (error) throw error

      await fetchHabits()
      toast.success('Habit created successfully')
    } catch (error: any) {
      console.error('Error adding habit:', error)
      toast.error(error.message || 'Failed to create habit')
    }
  }

  const toggleHabit = async (habitId: string, date: string) => {
    try {
      if (!user) throw new Error('User not authenticated')

      const existingCompletion = completions.find(
        c => c.habit_id === habitId && c.completed_date === date
      )

      if (existingCompletion) {
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .match({ 
            habit_id: habitId, 
            completed_date: date,
            user_id: user.id 
          })

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('habit_completions')
          .insert([
            {
              habit_id: habitId,
              completed_date: date,
              user_id: user.id
            }
          ])

        if (error) throw error
      }

      await fetchHabits()
    } catch (error: any) {
      console.error('Error toggling habit:', error)
      toast.error(error.message || 'Failed to update habit')
    }
  }

  return (
    <HabitsContext.Provider value={{ 
      habits, 
      loading, 
      addHabit, 
      toggleHabit, 
      refreshHabits: fetchHabits,
      completions 
    }}>
      {children}
    </HabitsContext.Provider>
  )
}

export const useHabits = () => {
  const context = useContext(HabitsContext)
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitsProvider')
  }
  return context
} 