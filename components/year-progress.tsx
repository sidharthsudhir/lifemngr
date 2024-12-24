import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function YearProgress() {
  const calculateYearProgress = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 1) // January 1st of current year
    const end = new Date(now.getFullYear() + 1, 0, 1) // January 1st of next year
    const progress = (now.getTime() - start.getTime()) / (end.getTime() - start.getTime())
    return Math.round(progress * 100)
  }

  const getDaysRemaining = () => {
    const now = new Date()
    const end = new Date(now.getFullYear() + 1, 0, 1)
    const diffTime = Math.abs(end.getTime() - now.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const progress = calculateYearProgress()
  const daysRemaining = getDaysRemaining()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Year Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{progress}% of {new Date().getFullYear()} completed</span>
          <span className="text-sm text-muted-foreground">{daysRemaining} days remaining</span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardContent>
    </Card>
  )
} 