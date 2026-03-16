import { useState } from 'react'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedBackground from '../components/AnimatedBackground'
import SwapCard from '../components/SwapCard'
import ConnectWalletModal from '../components/ConnectWalletModal'
import { useTheme } from '../context/ThemeContext'

const TICKER_TOKENS = [
  { symbol: 'ETH',  price: '$3,241.50', change: '+2.4%',  up: true  },
  { symbol: 'BTC',  price: '$62,840',   change: '-1.2%',  up: false },
  { symbol: 'USDC', price: '$1.000',    change: '+0.01%', up: true  },
  { symbol: 'ARB',  price: '$1.24',     change: '+5.8%',  up: true  },
  { symbol: 'OP',   price: '$2.87',     change: '+3.1%',  up: true  },
  { symbol: 'MATIC',price: '$0.89',     change: '-0.8%',  up: false },
  { symbol: 'UNI',  price: '$9.60',     change: '+4.2%',  up: true  },
  { symbol: 'AAVE', price: '$182.40',   change: '+2.7%',  up: true  },
  { symbol: 'LINK', price: '$14.80',    change: '+1.9%',  up: true  },
  { symbol: 'WBTC', price: '$62,720',   change: '-1.3%',  up: false },
]

function Ticker() {
  const { c } = useTheme()
  const items = [...TICKER_TOKENS, ...TICKER_TOKENS]
  return (
    <div
      className="w-full overflow-hidden py-3"
      style={{ borderBottom: `1px solid ${c('rgba(255,255,255,0.05)', 'rgba(0,0,0,0.07)')}` }}
    >
      <div className="ticker-inner">
        {items.map((token, i) => (
          <div key={i} className="flex items-center gap-2 mx-6 flex-shrink-0">
            <span className="text-xs font-semibold" style={{ color: c('rgba(255,255,255,0.55)', 'rgba(0,0,0,0.5)') }}>
              {token.symbol}
            </span>
            <span className="text-xs font-medium" style={{ color: c('rgba(255,255,255,0.8)', 'rgba(0,0,0,0.75)') }}>
              {token.price}
            </span>
            <span className="text-xs font-medium" style={{ color: token.up ? '#34D399' : '#F87171' }}>
              {token.change}
            </span>
            <div className="w-px h-3 ml-3" style={{ background: c('rgba(255,255,255,0.1)', 'rgba(0,0,0,0.1)') }} />
          </div>
        ))}
      </div>
    </div>
  )
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="3" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M7.5 1v1M7.5 13v1M1 7.5h1M13 7.5h1M2.9 2.9l.7.7M11.4 11.4l.7.7M2.9 12.1l.7-.7M11.4 3.6l.7-.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M12.5 9A6 6 0 015 1.5a6 6 0 100 11A6 6 0 0112.5 9z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

function NavBar({ onConnectClick, connectedWallet }) {
  const { isDark, toggle, c } = useTheme()

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 px-6 py-4"
      style={{
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--nav-border)',
      }}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
            <polygon points="8,2 13.2,11 2.8,11" stroke="#9B6DFF" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
            <circle cx="8" cy="8" r="2" fill="#9B6DFF"/>
          </svg>
          <span className="text-sm font-bold tracking-tight" style={{ color: c('#ffffff', '#0a0a0a'), fontFamily: 'Inter, sans-serif' }}>my-dex</span>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {['Swap', 'Pool', 'Analytics', 'Docs'].map((item, i) => (
            <button
              key={item}
              className="px-4 py-2 rounded-lg text-sm transition-all font-medium"
              style={{
                background: i === 0 ? 'rgba(155,109,255,0.12)' : 'transparent',
                color: i === 0 ? '#C4A8FF' : c('rgba(255,255,255,0.4)', 'rgba(0,0,0,0.4)'),
                border: i === 0 ? '1px solid rgba(155,109,255,0.2)' : '1px solid transparent',
              }}
              onMouseEnter={e => { if (i !== 0) { e.currentTarget.style.color = c('rgba(255,255,255,0.7)', 'rgba(0,0,0,0.7)'); e.currentTarget.style.background = c('rgba(255,255,255,0.04)', 'rgba(0,0,0,0.04)') } }}
              onMouseLeave={e => { if (i !== 0) { e.currentTarget.style.color = c('rgba(255,255,255,0.4)', 'rgba(0,0,0,0.4)'); e.currentTarget.style.background = 'transparent' } }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <motion.button
            onClick={toggle}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{
              background: c('rgba(255,255,255,0.06)', 'rgba(0,0,0,0.06)'),
              border: `1px solid ${c('rgba(255,255,255,0.1)', 'rgba(0,0,0,0.1)')}`,
              color: c('rgba(255,255,255,0.6)', 'rgba(0,0,0,0.6)'),
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isDark ? 'moon' : 'sun'}
                initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
                transition={{ duration: 0.18 }}
              >
                {isDark ? <MoonIcon /> : <SunIcon />}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* Connect wallet */}
          <motion.button
            onClick={onConnectClick}
            className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
            style={{
              background: connectedWallet
                ? c('rgba(52,211,153,0.1)', 'rgba(52,211,153,0.08)')
                : 'linear-gradient(135deg, rgba(155,109,255,0.15) 0%, rgba(155,109,255,0.08) 100%)',
              border: connectedWallet
                ? '1px solid rgba(52,211,153,0.25)'
                : '1px solid rgba(155,109,255,0.3)',
              color: connectedWallet ? '#34D399' : '#C4A8FF',
            }}
            whileHover={{
              boxShadow: connectedWallet
                ? '0 0 16px rgba(52,211,153,0.15)'
                : '0 0 20px rgba(155,109,255,0.2)',
            }}
            whileTap={{ scale: 0.97 }}
          >
            {connectedWallet ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: '0 0 5px #34D399' }} />
                <span className="font-mono text-xs">
                  {connectedWallet.address.slice(0, 6)}…{connectedWallet.address.slice(-4)}
                </span>
              </>
            ) : (
              'Connect Wallet'
            )}
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}

export default function Home() {
  const { isDark, c } = useTheme()
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState(null)

  return (
    <>
      <Head>
        <title>my-dex — Swap tokens intelligently</title>
        <meta name="description" content="A premium decentralized exchange. Swap tokens with intelligence." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%239B6DFF'/><path d='M16 4L6 9.5v11L16 26l10-5.5v-11L16 4z' stroke='white' stroke-width='2' fill='rgba(255,255,255,0.1)'/><circle cx='16' cy='16' r='4' fill='white'/></svg>" />
      </Head>

      <div className="relative min-h-screen" style={{ background: c('#080808', '#F5F4F2'), transition: 'background 0.3s ease' }}>
        <AnimatedBackground />
        <NavBar
          onConnectClick={() => setWalletModalOpen(true)}
          connectedWallet={connectedWallet}
        />

        {/* Price ticker */}
        <div className="fixed top-[61px] left-0 right-0 z-30" style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <Ticker />
        </div>

        {/* Main content */}
        <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-36 pb-16">
          {/* Hero text */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, transparent, rgba(155,109,255,0.4))' }} />
              <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(155,109,255,0.7)' }}>
                Decentralized Exchange
              </span>
              <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, rgba(155,109,255,0.4), transparent)' }} />
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold tracking-tight leading-tight"
              style={{ color: c('#ffffff', '#0a0a0a') }}
            >
              Trade with{' '}
              <span style={{ background: 'linear-gradient(135deg, #C4A8FF 0%, #9B6DFF 50%, #7B4DDF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                intelligence
              </span>
            </h1>
            <p className="text-base mt-3 max-w-sm mx-auto leading-relaxed" style={{ color: c('rgba(255,255,255,0.4)', 'rgba(0,0,0,0.45)') }}>
              Swap tokens at the best rates. No hidden fees, no surprises — just clear, transparent trades.
            </p>
          </motion.div>

          {/* Swap card */}
          <SwapCard />

          {/* Stats */}
          <motion.div
            className="flex items-center gap-8 mt-10 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {[
              { label: 'Total Volume', value: '$2.4B' },
              { label: 'Trades Today', value: '48,291' },
              { label: 'Avg Savings', value: '$12.40' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-lg font-bold" style={{ color: c('#ffffff', '#0a0a0a') }}>{stat.value}</p>
                <p className="text-xs mt-0.5" style={{ color: c('rgba(255,255,255,0.3)', 'rgba(0,0,0,0.35)') }}>{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 py-6 px-6" style={{ borderTop: `1px solid ${c('rgba(255,255,255,0.05)', 'rgba(0,0,0,0.07)')}` }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <p className="text-xs" style={{ color: c('rgba(255,255,255,0.2)', 'rgba(0,0,0,0.3)') }}>
              © 2026 my-dex. Built on Ethereum.
            </p>
            <div className="flex gap-4">
              {['Terms', 'Privacy', 'Docs', 'Discord'].map(link => (
                <button
                  key={link}
                  className="text-xs transition-colors"
                  style={{ color: c('rgba(255,255,255,0.25)', 'rgba(0,0,0,0.3)') }}
                  onMouseEnter={e => e.currentTarget.style.color = c('rgba(255,255,255,0.55)', 'rgba(0,0,0,0.6)')}
                  onMouseLeave={e => e.currentTarget.style.color = c('rgba(255,255,255,0.25)', 'rgba(0,0,0,0.3)')}
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        </footer>
      </div>

      <ConnectWalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onConnect={(data) => {
          setConnectedWallet(data)
          setWalletModalOpen(false)
        }}
      />
    </>
  )
}
