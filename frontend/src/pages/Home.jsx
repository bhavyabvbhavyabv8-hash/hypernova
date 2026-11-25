import { useEffect, useState } from 'react'
import { Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../services/api'

const sampleData = [
  { name: 'Mon', value: 30 },
  { name: 'Tue', value: 45 },
  { name: 'Wed', value: 35 },
  { name: 'Thu', value: 50 },
  { name: 'Fri', value: 40 },
]

function Home() {
  const [healthStatus, setHealthStatus] = useState('checking')

  useEffect(() => {
    let active = true

    api
      .get('/health')
      .then((response) => {
        if (active) {
          setHealthStatus(response.data?.status === 'ok' ? 'connected' : 'unexpected')
        }
      })
      .catch(() => {
        if (active) {
          setHealthStatus('unavailable')
        }
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <p className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
          <Activity className="h-4 w-4" aria-hidden="true" />
          Phase 1 Setup
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-white">Fitness Builder</h1>
        <p className="max-w-2xl text-slate-300">
          Frontend foundation is ready. Workout features and PostgreSQL integration will be added in
          later phases.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold text-white">Backend Health</h2>
          <p className="mt-2 text-sm text-slate-400">GET /api/health</p>
          <p className="mt-4 text-sm">
            Status:{' '}
            <span
              className={
                healthStatus === 'connected'
                  ? 'text-emerald-400'
                  : healthStatus === 'checking'
                    ? 'text-amber-300'
                    : 'text-rose-400'
              }
            >
              {healthStatus}
            </span>
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold text-white">UI Stack Check</h2>
          <p className="mt-2 text-sm text-slate-400">Recharts sample preview</p>
          <div className="mt-4 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sampleData}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
