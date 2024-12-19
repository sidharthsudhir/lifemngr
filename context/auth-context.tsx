"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'

const supabase = createClientComponentClient()

interface AuthContextType {
  user: any
  session: any
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const autoLogin = async () => {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: 'sidharthsudhir12@gmail.com',
          password: 'Jinzita123!'
        })

        if (error) throw error

        const { data: { session: currentSession } } = await supabase.auth.getSession()
        
        // Ensure the user object has the correct ID
        const userWithCorrectId = {
          ...currentSession?.user,
          id: '7698a174-c76a-4f67-96b1-07c3cac71692'
        }
        
        setSession({
          ...currentSession,
          user: userWithCorrectId
        })
        setUser(userWithCorrectId)
      } catch (error: any) {
        console.error('Auto-login failed:', error)
        toast.error('Failed to authenticate')
      } finally {
        setLoading(false)
      }
    }

    autoLogin()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const userWithCorrectId = {
          ...session.user,
          id: '7698a174-c76a-4f67-96b1-07c3cac71692'
        }
        setSession({
          ...session,
          user: userWithCorrectId
        })
        setUser(userWithCorrectId)
      } else {
        setSession(null)
        setUser(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 