import { useState, useEffect, useCallback, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import type { Event, Rsvp } from '../types'

const EMOJI_OPTIONS = ['🎉', '🎂', '🍕', '🎸', '🏖️', '🎃', '🥂', '🎄', '💍', '🏠']

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [rsvps, setRsvps] = useState<Record<string, Rsvp[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [coverEmoji, setCoverEmoji] = useState('🎉')
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { setLoading(false); return }
    const { data, error: fetchError } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', session.user.id)
      .is('deleted_at', null)
      .order('event_date', { ascending: true })
    if (fetchError) { setError('Could not load events.'); setLoading(false); return }
    setEvents(data || [])
    if (data && data.length > 0) {
      const ids = data.map((ev: Event) => ev.id)
      const { data: rsvpData } = await supabase
        .from('rsvps')
        .select('*')
        .in('event_id', ids)
        .is('deleted_at', null)
      const grouped: Record<string, Rsvp[]> = {}
      rsvpData?.forEach((r: Rsvp) => {
        if (!grouped[r.event_id]) grouped[r.event_id] = []
        grouped[r.event_id].push(r)
      })
      setRsvps(grouped)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  const handleCreateEvent = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !eventDate) return
    setFormLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { setFormLoading(false); return }
    const slug = crypto.randomUUID().slice(0, 8)
    const { error: insertError } = await supabase.from('events').insert({
      user_id: session.user.id,
      title: title.trim().slice(0, 200),
      description: description.trim().slice(0, 1000),
      location: location.trim().slice(0, 300),
      event_date: eventDate,
      event_time: eventTime || '19:00',
      cover_emoji: coverEmoji,
      share_slug: slug
    })
    setFormLoading(false)
    if (insertError) { setError('Could not create event.'); return }
    setTitle(''); setDescription(''); setLocation(''); setEventDate(''); setEventTime(''); setCoverEmoji('🎉'); setShowForm(false)
    fetchEvents()
  }

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/e/${slug}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const countByStatus = (eventId: string, status: string) =>
    (rsvps[eventId] || []).filter(r => r.status === status).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" role="status" aria-label="Loading"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <h1 className="font-serif text-3xl font-bold">Your events</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="min-h-[44px] inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg font-mono font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {showForm ? 'Cancel' : '+ New event'}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mb-6" role="alert">{error}</p>}

      {showForm && (
        <form onSubmit={handleCreateEvent} className="bg-white border border-ink/10 rounded-xl p-6 mb-10 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Event name</label>
            <input id="title" type="text" required maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} className="w-full min-h-[44px] px-4 py-3 border border-ink/20 rounded-lg bg-paper font-mono focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Saturday BBQ" />
          </div>
          <div>
            <label htmlFor="desc" className="block text-sm font-medium mb-1">Description</label>
            <textarea id="desc" maxLength={1000} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 border border-ink/20 rounded-lg bg-paper font-mono focus:outline-none focus:ring-2 focus:ring-primary" placeholder="What's the occasion?" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
              <input id="location" type="text" maxLength={300} value={location} onChange={(e) => setLocation(e.target.value)} className="w-full min-h-[44px] px-4 py-3 border border-ink/20 rounded-lg bg-paper font-mono focus:outline-none focus:ring-2 focus:ring-primary" placeholder="123 Main St" />
            </div>
            <div>
              <label htmlFor="emoji" className="block text-sm font-medium mb-1">Cover emoji</label>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Cover emoji">
                {EMOJI_OPTIONS.map((em) => (
                  <button key={em} type="button" onClick={() => setCoverEmoji(em)} className={`w-11 h-11 text-xl rounded-lg flex items-center justify-center border-2 focus:outline-none focus:ring-2 focus:ring-primary ${coverEmoji === em ? 'border-primary bg-primary/10' : 'border-ink/10 bg-white'}`} aria-label={em} role="radio" aria-checked={coverEmoji === em}>{em}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
              <input id="date" type="date" required value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full min-h-[44px] px-4 py-3 border border-ink/20 rounded-lg bg-paper font-mono focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium mb-1">Time</label>
              <input id="time" type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} className="w-full min-h-[44px] px-4 py-3 border border-ink/20 rounded-lg bg-paper font-mono focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <button type="submit" disabled={formLoading} className="min-h-[44px] px-8 py-3 bg-primary text-white rounded-lg font-mono font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50">
            {formLoading ? 'Creating...' : 'Create event'}
          </button>
        </form>
      )}

      {events.length === 0 && !showForm && (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4" role="img" aria-label="party">🎈</span>
          <h2 className="font-serif text-2xl font-semibold mb-2">No events yet</h2>
          <p className="text-[#6b6862] mb-6">Create your first event and start inviting guests.</p>
          <button onClick={() => setShowForm(true)} className="min-h-[44px] inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg font-mono font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">+ New event</button>
        </div>
      )}

      <div className="space-y-4">
        {events.map((ev) => (
          <div key={ev.id} className="bg-white border border-ink/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setSelectedEvent(selectedEvent === ev.id ? null : ev.id)}
              className="w-full min-h-[44px] p-5 flex items-center gap-4 text-left hover:bg-paper/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
              aria-expanded={selectedEvent === ev.id}
            >
              <span className="text-3xl">{ev.cover_emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-lg font-semibold truncate">{ev.title}</h3>
                <p className="text-sm text-[#6b6862]">
                  {new Date(ev.event_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  {ev.location ? ` · ${ev.location}` : ''}
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="text-green-700">{countByStatus(ev.id, 'going')} going</span>
                <span className="text-yellow-700">{countByStatus(ev.id, 'maybe')} maybe</span>
              </div>
            </button>
            {selectedEvent === ev.id && (
              <div className="border-t border-ink/10 p-5">
                {ev.description && <p className="text-sm mb-4 text-[#6b6862]">{ev.description}</p>}
                <div className="flex flex-wrap gap-3 mb-5">
                  <button onClick={() => copyLink(ev.share_slug)} className="min-h-[44px] px-4 py-2 bg-ink text-paper rounded-lg text-sm font-mono hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    {copied ? 'Copied!' : 'Copy invite link'}
                  </button>
                </div>
                {(rsvps[ev.id] && rsvps[ev.id].length > 0) ? (
                  <div className="space-y-2">
                    <h4 className="font-mono text-sm font-medium mb-2">Guest list</h4>
                    {rsvps[ev.id].map((r) => (
                      <div key={r.id} className="flex items-center justify-between py-2 px-3 bg-paper rounded-lg text-sm">
                        <div>
                          <span className="font-medium">{r.guest_name}</span>
                          {r.guest_email && <span className="text-[#6b6862] ml-2">{r.guest_email}</span>}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          r.status === 'going' ? 'bg-green-100 text-green-800' :
                          r.status === 'maybe' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {r.status === 'cant_go' ? "Can't go" : r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#6b6862]">No RSVPs yet. Share your invite link to get started.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}