'use client'

import { format } from 'date-fns'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Header } from '@/components/header'
import { useProfile } from '@/context/profile-context'

export default function ProfilePage() {
  const { profileData, loading } = useProfile()

  if (loading) {
    return <div>Loading...</div>
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Not available'
      }
      return format(date, 'MMMM d, yyyy')
    } catch (error) {
      console.error('Date formatting error:', error)
      return 'Not available'
    }
  }

  return (
    <div className="profile-page">
      <Header title="Profile" />
      <div className="pl-4 pr-6 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-zinc-500">First Name</label>
                <p className="text-lg">{profileData?.firstName}</p>
              </div>
              <div>
                <label className="text-sm text-zinc-500">Last Name</label>
                <p className="text-lg">{profileData?.lastName}</p>
              </div>
              <div>
                <label className="text-sm text-zinc-500">Email</label>
                <p className="text-lg">{profileData?.email}</p>
              </div>
              <div>
                <label className="text-sm text-zinc-500">Member Since</label>
                <p className="text-lg">
                  {formatDate(profileData?.createdAt || '')}
                </p>
              </div>
              <div>
                <label className="text-sm text-zinc-500">Subscription Status</label>
                <p className="text-lg capitalize">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    profileData?.subscriptionStatus === 'pro' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {profileData?.subscriptionStatus}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}