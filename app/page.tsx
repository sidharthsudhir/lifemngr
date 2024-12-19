import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { CuboidIcon, CheckSquare, Timer, BookOpen, Target } from 'lucide-react'


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-900">
      <header className="container mx-auto px-4 py-8 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <CuboidIcon className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-zinc-100">Life Mngr</span>
        </div>
        <nav>
          <Link href="/auth">
            <Button variant="outline">Log in</Button>
          </Link>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-6 text-zinc-100">Manage Your Life, All in One Place</h1>
        <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
          Life Mngr helps you track habits, focus on tasks, journal your thoughts, and achieve your goals.
        </p>
        <Link href="/auth">
          <Button size="lg">Get Started</Button>
        </Link>
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard icon={CheckSquare} title="Habit Tracking" description="Build and maintain positive habits" />
          <FeatureCard icon={Timer} title="Pomodoro Timer" description="Stay focused and productive" />
          <FeatureCard icon={BookOpen} title="Journaling" description="Record your thoughts and experiences" />
          <FeatureCard icon={Target} title="Goal Setting" description="Set and achieve your long-term goals" />
        </div>
      </main>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-6 border border-zinc-800 rounded-lg bg-zinc-800/50">
      <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
      <h2 className="text-xl font-semibold mb-2 text-zinc-100">{title}</h2>
      <p className="text-zinc-400">{description}</p>
    </div>
  )
}

