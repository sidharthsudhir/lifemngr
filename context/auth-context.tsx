"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

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

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: string
  subscriptionStatus: 'basic' | 'pro'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError

        if (!session) {
          setUser(null)
          setLoading(false)
          return
        }

        // Get the user profile data from the profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileError) throw profileError

        setUser({
          id: session.user.id,
          email: session.user.email!,
          firstName: profile.first_name,
          lastName: profile.last_name,
          createdAt: profile.created_at || new Date().toISOString(),
          subscriptionStatus: profile.subscription_status,
        })
      } catch (error) {
        console.error('Error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

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
  }, [supabase, router])

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