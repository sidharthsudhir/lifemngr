import { Sidebar } from "@/components/sidebar"
import { ProtectedRoute } from "@/components/protected-route"


export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-zinc-900">
        <Sidebar />
        <main className="flex-1 p-8 ml-24">{children}</main>
      </div>
    </ProtectedRoute>
  )
}

