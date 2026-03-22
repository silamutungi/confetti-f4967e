import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both fields.')
      return
    }
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (authError) {
      setError('Invalid email or password. Please try again.')
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="flex items-center justify-center px-4 py-16 md:py-24">
      <div className="w-full max-w-md">
        <h1 className="font-serif text-3xl font-bold text-center mb-2">Welcome back</h1>
        <p className="text-center text-[#6b6862] mb-8">Sign in to manage your events.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              type="email"
              required
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-[44px] px-4 py-3 border border-ink/20 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              id="password"
              type="password"
              required
              maxLength={128}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full min-h-[44px] px-4 py-3 border border-ink/20 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Your password"
            />
          </div>
          {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[44px] px-6 py-3 bg-primary text-white rounded-lg font-mono font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="text-center text-sm mt-6 text-[#6b6862]">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-dark underline font-medium focus:outline-none focus:ring-2 focus:ring-primary">Sign up</Link>
        </p>
      </div>
    </div>
  )
}