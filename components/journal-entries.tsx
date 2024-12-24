import { format, parseISO } from 'date-fns'
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useState } from 'react'

type JournalEntry = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

type JournalEntriesProps = {
  entries: JournalEntry[];
  onEntryUpdate: (id: string, title: string, content: string) => Promise<void>;
}

export function JournalEntries({ entries, onEntryUpdate }: JournalEntriesProps) {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  const handleEntryClick = (entry: JournalEntry) => {
    setSelectedEntry(entry)
    setEditTitle(entry.title)
    setEditContent(entry.content)
  }

  const handleSave = async () => {
    if (selectedEntry) {
      await onEntryUpdate(selectedEntry.id, editTitle, editContent)
      setSelectedEntry(null)
    }
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">Previous Entries</h2>
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {entries.map((entry) => (
                <Card 
                  key={entry.id} 
                  className="cursor-pointer transition-transform duration-200 hover:scale-105"
                  onClick={() => handleEntryClick(entry)}
                >
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{entry.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(entry.created_at), 'MMMM d, yyyy')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={selectedEntry !== null} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Journal Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Entry Title"
            />
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={10}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSelectedEntry(null)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

