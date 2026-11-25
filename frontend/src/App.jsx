import { Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout.jsx'
import HomePage from './pages/HomePage.jsx'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route
          path="*"
          element={
            <main className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
              <h1 className="text-3xl font-semibold text-white">Page not found</h1>
              <p className="mt-3 text-zinc-400">The page you requested does not exist.</p>
            </main>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
