import { Outlet } from 'react-router-dom'
import { Dumbbell } from 'lucide-react'

function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
          <Dumbbell className="h-6 w-6 text-emerald-400" aria-hidden="true" />
          <span className="text-lg font-semibold tracking-tight">Fitness Builder</span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
