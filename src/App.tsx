import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink font-mono">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center py-32 px-4">
                <h1 className="font-serif text-4xl font-bold mb-4">404</h1>
                <p className="text-lg mb-8">This page doesn't exist.</p>
                <a href="/" className="min-h-[44px] inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg font-mono font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary">Go home</a>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}