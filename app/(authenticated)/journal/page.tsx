'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { JournalEntries } from "@/components/journal-entries"

type JournalEntry = {
  date: string;
  content: string;
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [currentEntry, setCurrentEntry] = useState('')
  const today = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    const savedEntries = localStorage.getItem('journal-entries')
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  useEffect(() => {
    const todayEntry = entries.find(entry => entry.date === today)
    setCurrentEntry(todayEntry?.content || '')
  }, [entries, today])

  const saveEntry = () => {
    const updatedEntries = entries.filter(entry => entry.date !== today)
    if (currentEntry.trim()) {
      updatedEntries.push({ date: today, content: currentEntry.trim() })
    }
    updatedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setEntries(updatedEntries)
    localStorage.setItem('journal-entries', JSON.stringify(updatedEntries))
  }

  return (
    <div className="space-y-8">
      <Header title="Journal" />
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="font-semibold">{format(new Date(), 'MMMM d, yyyy')}</div>
          <Textarea
            placeholder="Write your thoughts for today..."
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            rows={10}
          />
          <Button onClick={saveEntry}>Save Entry</Button>
        </CardContent>
      </Card>
      <JournalEntries entries={entries} />
    </div>
  )
}

