"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from './auth-context'

interface ProfileData {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: string
  subscriptionStatus: 'basic' | 'pro'
}

interface ProfileContextType {
  profileData: ProfileData | null
  loading: boolean
  refreshProfile: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextType>({
  profileData: null,
  loading: true,
  refreshProfile: async () => {},
})

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const refreshProfile = async () => {
    try {
      const response = await fetch('/api/auth/user')
      const data = await response.json()
      setProfileData(data)
    } catch (error) {
      console.error('Error fetching profile data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      refreshProfile()
    }
  }, [user])

  return (
    <ProfileContext.Provider value={{ profileData, loading, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
} 