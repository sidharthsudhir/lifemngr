'use client'

import { useHabits } from "@/context/habits-context"
import { HabitTracker } from "@/components/habit-tracker"

export function HabitList() {
  const { habits } = useHabits()

  return (
    <div className="space-y-6">
      {habits.map((habit) => (
        <HabitTracker
          key={habit.id}
          name={habit.name}
          completedDates={habit.completedDates}
        />
      ))}
    </div>
  )
}

