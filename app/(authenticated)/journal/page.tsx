'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { JournalEntries } from "@/components/journal-entries"
import { useAuth } from '@/context/auth-context'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

type JournalEntry = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function JournalPage() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [currentTitle, setCurrentTitle] = useState('')
  const [currentEntry, setCurrentEntry] = useState('')

  useEffect(() => {
    if (user) {
      loadEntries()
    }
  }, [user])

  const loadEntries = async () => {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Failed to load journal entries')
      return
    }

    setEntries(data)
  }

  const saveEntry = async () => {
    if (!user?.id) {
      toast.error('You must be logged in to save entries')
      return
    }

    if (!currentTitle.trim() || !currentEntry.trim()) {
      toast.error('Please provide both a title and content for your entry')
      return
    }

    const { data, error } = await supabase
      .from('journal_entries')
      .insert([
        {
          title: currentTitle.trim(),
          content: currentEntry.trim(),
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      toast.error(`Failed to save journal entry: ${error.message}`)
      return
    }

    setEntries([data, ...entries])
    setCurrentTitle('')
    setCurrentEntry('')
    toast.success('Journal entry saved successfully')
  }

  const updateEntry = async (id: string, title: string, content: string) => {
    const { error } = await supabase
      .from('journal_entries')
      .update({ 
        title: title.trim(),
        content: content.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      toast.error('Failed to update journal entry')
      return
    }

    await loadEntries()
    toast.success('Journal entry updated successfully')
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <Header title="Journal" />
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="font-semibold">{format(new Date(), 'MMMM d, yyyy')}</div>
          <Input
            placeholder="Entry Title"
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
          />
          <Textarea
            placeholder="Write your thoughts for today..."
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            rows={10}
          />
          <Button onClick={saveEntry}>Save Entry</Button>
        </CardContent>
      </Card>
      <JournalEntries entries={entries} onEntryUpdate={updateEntry} />
    </div>
  )
}

