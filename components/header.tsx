import { CuboidIcon } from 'lucide-react'

type HeaderProps = {
  title: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex items-center justify-between pb-6 mb-6 border-b">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <CuboidIcon className="w-8 h-8 text-primary" />
    </header>
  )
}

