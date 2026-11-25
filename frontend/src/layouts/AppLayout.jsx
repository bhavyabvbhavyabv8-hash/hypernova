import { Activity, ArrowUpRight, Dumbbell } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

function AppLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-5 py-5 sm:px-8">
          <NavLink to="/" className="flex items-center gap-3" aria-label="Hyper Nova home">
            <span className="flex size-10 items-center justify-center rounded-xl bg-lime-300 text-zinc-950">
              <Dumbbell size={21} strokeWidth={2.5} />
            </span>
            <span>
              <span className="block text-sm font-bold tracking-[0.18em]">HYPER NOVA</span>
              <span className="mt-0.5 block text-xs text-zinc-500">TRAINING WORKSPACE</span>
            </span>
          </NavLink>

          <nav aria-label="Main navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm transition ${
                  isActive ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white'
                }`
              }
            >
              Home
            </NavLink>
          </nav>

          <span className="hidden items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-400 sm:flex">
            <Activity size={14} className="text-lime-300" />
            Phase 1 foundation
          </span>
        </div>
      </header>

      <Outlet />

      <footer className="mx-auto flex max-w-6xl items-center justify-between border-t border-white/10 px-5 py-6 text-xs text-zinc-500 sm:px-8">
        <span>HYPER NOVA · Built for consistent progress</span>
        <a
          className="inline-flex items-center gap-1 hover:text-zinc-300"
          href="http://localhost:5000/api/health"
          target="_blank"
          rel="noreferrer"
        >
          API health <ArrowUpRight size={13} />
        </a>
      </footer>
    </div>
  )
}

export default AppLayout
