import { Activity, BarChart3, Dumbbell } from 'lucide-react'

const foundations = [
  {
    icon: Dumbbell,
    title: 'Workout builder',
    description: 'Plan structured training sessions around the movements that matter to you.',
  },
  {
    icon: BarChart3,
    title: 'Progressive overload',
    description: 'Record sets and follow strength trends as your training develops.',
  },
]

function HomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-14 sm:px-8 sm:py-20">
      <section className="max-w-3xl">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/5 px-3 py-1.5 text-xs font-medium text-lime-200">
          <Activity size={14} />
          Your training foundation starts here
        </p>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
          Train with intent.
          <span className="block text-lime-300">Progress with purpose.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
          HYPER NOVA brings workout planning and progressive overload tracking together.
          The project foundation is ready; training tools will follow in later phases.
        </p>
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-2" aria-label="Planned product foundations">
        {foundations.map(({ icon: Icon, title, description }) => (
          <article
            key={title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-white/5 text-lime-300">
              <Icon size={21} />
            </span>
            <h2 className="mt-6 text-lg font-semibold text-white">{title}</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">{description}</p>
            <span className="mt-6 inline-block rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-500">
              Planned
            </span>
          </article>
        ))}
      </section>
    </main>
  )
}

export default HomePage
