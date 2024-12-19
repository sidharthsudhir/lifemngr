import { format, parseISO } from 'date-fns'
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type JournalEntry = {
  date: string;
  content: string;
}

type JournalEntriesProps = {
  entries: JournalEntry[];
}

export function JournalEntries({ entries }: JournalEntriesProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Previous Entries</h2>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-8">
            {entries.map((entry, index) => (
              <div key={entry.date} className="relative">
                <div className="absolute left-0 w-0.5 h-full bg-primary" />
                <div className="ml-6">
                  <h3 className="text-lg font-semibold mb-2">
                    {format(parseISO(entry.date), 'MMMM d, yyyy')}
                  </h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{entry.content}</p>
                </div>
                {index < entries.length - 1 && (
                  <div className="absolute left-0 bottom-0 w-3 h-3 rounded-full bg-primary transform -translate-x-1" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

