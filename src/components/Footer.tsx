export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif text-lg font-semibold">🎉 Confetti</p>
          <div className="flex gap-6 text-sm text-[#c8c4bc]">
            <a href="/privacy" className="hover:text-paper transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded">Privacy Policy</a>
            <a href="/terms" className="hover:text-paper transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded">Terms of Service</a>
          </div>
        </div>
        <p className="text-center text-xs text-[#c8c4bc] mt-6">&copy; {new Date().getFullYear()} Confetti. All rights reserved.</p>
      </div>
    </footer>
  )
}