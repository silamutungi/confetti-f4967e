import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <section className="px-4 py-20 md:py-32 text-center max-w-4xl mx-auto">
        <span className="text-6xl mb-6 block" role="img" aria-label="confetti">🎉</span>
        <h1 className="font-serif text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          Beautiful event invitations your guests actually want to open.
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-[#6b6862]">
          Create an event in seconds. Share a link. Watch your guest list fill up. No app downloads, no accounts required for guests.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="min-h-[44px] inline-flex items-center justify-center px-8 py-3 bg-primary text-white rounded-full font-mono font-medium text-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Create your first event
          </Link>
          <Link
            to="/login"
            className="min-h-[44px] inline-flex items-center justify-center px-8 py-3 border-2 border-primary-dark text-primary-dark rounded-full font-mono font-medium text-lg hover:bg-primary-dark hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section className="bg-ink text-paper px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-16">How it works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-4xl mb-4" role="img" aria-label="sparkles">✨</div>
              <h3 className="font-serif text-xl font-semibold mb-3">Create in seconds</h3>
              <p className="text-[#c8c4bc]">Pick an emoji, add a title, date, and location. Your event page is ready to share instantly.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4" role="img" aria-label="link">🔗</div>
              <h3 className="font-serif text-xl font-semibold mb-3">Share a link</h3>
              <p className="text-[#c8c4bc]">Send your unique event link to anyone. Guests RSVP without creating an account or downloading anything.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4" role="img" aria-label="clipboard">📋</div>
              <h3 className="font-serif text-xl font-semibold mb-3">Manage your guest list</h3>
              <p className="text-[#c8c4bc]">See who's going, who's maybe, and who can't make it — all from your dashboard in real time.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">No more group chat chaos</h2>
        <p className="text-lg text-[#6b6862] mb-10">
          Stop asking "are you coming?" in 14 different threads. Confetti gives you one link, one guest list, and zero headaches.
        </p>
        <Link
          to="/signup"
          className="min-h-[44px] inline-flex items-center justify-center px-8 py-3 bg-primary text-white rounded-full font-mono font-medium text-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Get started free
        </Link>
      </section>
    </div>
  )
}