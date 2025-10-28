export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 pt-10 pb-[9rem] pb-safe md:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-stone-400 sm:px-6 md:flex-row">
        <p>© {new Date().getFullYear()} HoneyPot. Built on Consensus + Linea.</p>
        <div className="flex flex-wrap items-center gap-6">
          <a href="https://linea.build" target="_blank" rel="noreferrer" className="hover:text-amber-200">
            Linea docs
          </a>
          <a
            href="https://metamask.io/price/metamask-usd"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-200"
          >
            MetaMask mUSD
          </a>
          <a href="mailto:team@honeypot.game" className="hover:text-amber-200">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
