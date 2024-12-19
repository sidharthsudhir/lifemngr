'use client'

import { useState, useEffect } from 'react'
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

type Goal = {
  id: string
  text: string
  completed: boolean
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [newGoal, setNewGoal] = useState('')

  useEffect(() => {
    const savedGoals = localStorage.getItem('long-term-goals')
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('long-term-goals', JSON.stringify(goals))
  }, [goals])

  const addGoal = () => {
    if (newGoal.trim()) {
      const updatedGoals = [...goals, { id: crypto.randomUUID(), text: newGoal, completed: false }]
      setGoals(updatedGoals)
      setNewGoal('')
    }
  }

  const toggleGoal = (id: string) => {
    const updatedGoals = goals.map(goal =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    )
    setGoals(updatedGoals)
  }

  return (
    <div className="space-y-8">
      <Header title="Long-Term Goals" />
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter a new goal..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addGoal()}
            />
            <Button onClick={addGoal}>Add Goal</Button>
          </div>
          <ul className="space-y-2">
            {goals.map(goal => (
              <li key={goal.id} className="flex items-center space-x-2">
                <Checkbox
                  id={goal.id}
                  checked={goal.completed}
                  onCheckedChange={() => toggleGoal(goal.id)}
                />
                <label
                  htmlFor={goal.id}
                  className={`flex-1 ${goal.completed ? 'line-through text-muted-foreground' : ''}`}
                >
                  {goal.text}
                </label>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

