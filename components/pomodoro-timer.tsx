'use client'

import { usePomodoro } from '@/context/pomodoro-context'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { PlayCircle, PauseCircle, RotateCcw } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function PomodoroTimer() {
  const pathname = usePathname()
  const { isRunning, timeRemaining, mode, startTimer, pauseTimer, resetTimer, toggleMode } = usePomodoro()

  // Don't show the floating timer on the pomodoro page
  if (pathname === '/pomodoro') {
    return null
  }

  // Don't show if timer hasn't been started yet
  if (!isRunning && timeRemaining === (mode === 'work' ? 25 * 60 : 5 * 60)) {
    return null
  }

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  return (
    <Card className="fixed bottom-4 right-4 z-50 shadow-lg">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="text-xl font-bold">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className="flex gap-2">
          {!isRunning ? (
            <Button size="sm" variant="outline" onClick={startTimer}>
              <PlayCircle className="h-4 w-4" />
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={pauseTimer}>
              <PauseCircle className="h-4 w-4" />
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={resetTimer}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant={mode === 'work' ? 'default' : 'secondary'}
            onClick={toggleMode}
          >
            {mode === 'work' ? 'Work' : 'Break'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 