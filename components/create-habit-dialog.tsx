'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { PlusIcon } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { toast } from 'sonner'
import { supabase } from "@/lib/supabase"

export function CreateHabitDialog() {
  const [open, setOpen] = useState(false)
  const [habitName, setHabitName] = useState("")
  const [loading, setLoading] = useState(false)
  const { session } = useAuth()

  const addHabit = async (title: string) => {
    try {
      if (!session) {
        toast.error('Please login to create habits')
        return
      }
      setLoading(true)
      const { error } = await supabase
        .from('habits')
        .insert([
          {
            title,
            user_id: session.user.id,
          }
        ])

      if (error) throw error
      toast.success('Habit created successfully')

      // Optionally trigger a refresh of the habits list
      // This could be achieved via a callback or by re-fetching in the parent component
    } catch (error: any) {
      toast.error(error.message || 'Failed to create habit')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (habitName.trim()) {
      await addHabit(habitName.trim())
      setHabitName("")
      setOpen(false)
      // Optionally refresh habits from parent or context
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
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Habit'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

