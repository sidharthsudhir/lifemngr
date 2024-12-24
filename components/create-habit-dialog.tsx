'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { PlusIcon } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useHabits } from "@/context/habits-context"

export function CreateHabitDialog() {
  const [open, setOpen] = useState(false)
  const [habitName, setHabitName] = useState("")
  const { session } = useAuth()
  const { addHabit } = useHabits()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (habitName.trim()) {
      await addHabit(habitName.trim())
      setHabitName("")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Habit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Enter habit name"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
          />
          <Button type="submit" className="w-full">
            Create Habit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

