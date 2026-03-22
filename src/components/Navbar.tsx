import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-ink text-paper">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-serif text-xl font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-primary rounded">
          🎉 Confetti
        </Link>

        <div className="hidden sm:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-[#c8c4bc] truncate max-w-[200px]">{user.email}</span>
              <Link to="/dashboard" className="min-h-[44px] inline-flex items-center px-4 py-2 text-sm hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded">Dashboard</Link>
              <button onClick={handleLogout} className="min-h-[44px] px-4 py-2 text-sm hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="min-h-[44px] inline-flex items-center px-4 py-2 text-sm hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded">Sign in</Link>
              <Link to="/signup" className="min-h-[44px] inline-flex items-center px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-ink">Get started</Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary rounded"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="sm:hidden border-t border-paper/10 px-4 py-4 space-y-3">
          {user ? (
            <>
              <p className="text-sm text-[#c8c4bc] truncate">{user.email}</p>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block min-h-[44px] py-2 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded">Dashboard</Link>
              <button onClick={handleLogout} className="block min-h-[44px] py-2 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block min-h-[44px] py-2 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded">Sign in</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="block min-h-[44px] py-2 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded">Get started</Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}