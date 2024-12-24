'use client'

import { useState, useEffect } from 'react'
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Play, Pause, RotateCcw } from 'lucide-react'
import { Label } from "@radix-ui/react-label"
import { Separator } from "@radix-ui/react-separator"
import { startOfWeek, addDays, format } from 'date-fns'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

type DailyProgress = {
  date: string;
  completedSessions: number;
}

export default function PomodoroPage() {
  // Timer states
  const [time, setTime] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  
  // Settings states
  const [workTime, setWorkTime] = useState(25)
  const [shortBreakTime, setShortBreakTime] = useState(5)
  const [longBreakTime, setLongBreakTime] = useState(15)
  const [currentSession, setCurrentSession] = useState<'work' | 'shortBreak' | 'longBreak'>('work')
  const [sessionCount, setSessionCount] = useState(0)
  const [showSettings, setShowSettings] = useState(false)

  // Weekly progress state
  const [weeklyProgress, setWeeklyProgress] = useState<DailyProgress[]>(() => {
    const saved = localStorage.getItem('pomodoro-weekly-progress')
    return saved ? JSON.parse(saved) : initializeWeeklyProgress()
  })

  // Initialize weekly progress
  function initializeWeeklyProgress(): DailyProgress[] {
    const startDate = startOfWeek(new Date(), { weekStartsOn: 1 }) // Start from Monday
    return Array.from({ length: 7 }).map((_, index) => ({
      date: format(addDays(startDate, index), 'yyyy-MM-dd'),
      completedSessions: 0
    }))
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (time === 0) {
      handleSessionComplete()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, time])

  // Save progress when session completes
  const handleSessionComplete = () => {
    setIsActive(false)
    
    if (currentSession === 'work') {
      // Update session count and progress
      const newSessionCount = sessionCount + 1
      setSessionCount(newSessionCount)
      
      // Update today's progress
      const today = format(new Date(), 'yyyy-MM-dd')
      const updatedProgress = weeklyProgress.map(day => 
        day.date === today 
          ? { ...day, completedSessions: day.completedSessions + 1 }
          : day
      )
      setWeeklyProgress(updatedProgress)
      localStorage.setItem('pomodoro-weekly-progress', JSON.stringify(updatedProgress))
      
      // Handle break selection
      if (newSessionCount % 4 === 0) {
        setCurrentSession('longBreak')
        setTime(longBreakTime * 60)
      } else {
        setCurrentSession('shortBreak')
        setTime(shortBreakTime * 60)
      }
    } else {
      setCurrentSession('work')
      setTime(workTime * 60)
    }
  }

  // Reset weekly progress at the start of each week
  useEffect(() => {
    const today = new Date()
    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    const firstProgressDate = new Date(weeklyProgress[0]?.date)
    
    if (weekStart > firstProgressDate) {
      const newProgress = initializeWeeklyProgress()
      setWeeklyProgress(newProgress)
      localStorage.setItem('pomodoro-weekly-progress', JSON.stringify(newProgress))
    }
  }, [weeklyProgress])

  const toggleTimer = () => setIsActive(!isActive)

  const resetTimer = () => {
    setIsActive(false)
    setCurrentSession('work')
    setSessionCount(0)
    setTime(workTime * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const updateSettings = (setting: string, value: string) => {
    const numValue = parseInt(value) || 1
    switch (setting) {
      case 'work':
        setWorkTime(numValue)
        if (currentSession === 'work') setTime(numValue * 60)
        break
      case 'shortBreak':
        setShortBreakTime(numValue)
        if (currentSession === 'shortBreak') setTime(numValue * 60)
        break
      case 'longBreak':
        setLongBreakTime(numValue)
        if (currentSession === 'longBreak') setTime(numValue * 60)
        break
    }
  }

  return (
    <div className="space-y-8">
      <Header title="Pomodoro Timer" />
      <div className="container mx-auto">
        <Alert variant="warning" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Please stay on this page while your Pomodoro timer is running. Navigating away from this page will reset your timer.
          </AlertDescription>
        </Alert>
        
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="flex gap-8">
              {/* Timer Section */}
              <div className="flex-1 flex flex-col items-center space-y-6">
                <div className="text-sm font-medium">
                  {currentSession === 'work' ? 'Work Session' : 
                   currentSession === 'shortBreak' ? 'Short Break' : 'Long Break'} 
                  {currentSession === 'work' && ` (${sessionCount}/4)`}
                </div>
                <div className="text-6xl font-bold">{formatTime(time)}</div>
                <div className="flex space-x-4">
                  <Button onClick={toggleTimer} size="lg">
                    {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                    {isActive ? 'Pause' : 'Start'}
                  </Button>
                  <Button onClick={resetTimer} variant="outline" size="lg">
                    <RotateCcw className="mr-2" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Separator */}
              <Separator orientation="vertical" className="h-auto" />

              {/* Settings Section */}
              <div className="w-72 space-y-4">
                <h3 className="font-semibold text-lg mb-4">Timer Settings</h3>
                <div className="space-y-2">
                  <Label>Work Session (minutes)</Label>
                  <Input 
                    type="number"
                    min="1"
                    max="60"
                    value={workTime}
                    onChange={(e) => updateSettings('work', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Short Break (minutes)</Label>
                  <Input 
                    type="number"
                    min="1"
                    max="30"
                    value={shortBreakTime}
                    onChange={(e) => updateSettings('shortBreak', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Long Break (minutes)</Label>
                  <Input 
                    type="number"
                    min="5"
                    max="60"
                    value={longBreakTime}
                    onChange={(e) => updateSettings('longBreak', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress Card */}
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Weekly Progress</h3>
            <div className="grid grid-cols-7 gap-4">
              {weeklyProgress.map((day) => {
                const isToday = format(new Date(day.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                return (
                  <div 
                    key={day.date} 
                    className={`flex flex-col items-center p-4 rounded-lg border
                      ${isToday ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'}`}
                  >
                    <div className="text-sm font-medium">
                      {format(new Date(day.date), 'EEE')}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {format(new Date(day.date), 'MMM d')}
                    </div>
                    <div className="text-2xl font-bold mt-2">
                      {day.completedSessions}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      sessions
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

