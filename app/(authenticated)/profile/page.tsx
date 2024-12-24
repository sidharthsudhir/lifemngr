'use client'

import { useAuth } from '@/context/auth-context'
import { format } from 'date-fns'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) {
    return <div>Loading...</div>
  }

  const formatDate = (dateString: string) => {
    try {
      // First check if we have a valid date
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
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-500">First Name</label>
              <p className="text-lg">{user.firstName}</p>
            </div>
            <div>
              <label className="text-sm text-zinc-500">Last Name</label>
              <p className="text-lg">{user.lastName}</p>
            </div>
            <div>
              <label className="text-sm text-zinc-500">Email</label>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <label className="text-sm text-zinc-500">Member Since</label>
              <p className="text-lg">
                {formatDate(user.createdAt)}
              </p>
            </div>
            <div>
              <label className="text-sm text-zinc-500">Subscription Status</label>
              <p className="text-lg capitalize">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.subscriptionStatus === 'pro' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.subscriptionStatus}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 