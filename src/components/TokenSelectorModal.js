import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const TOKENS = [
  { symbol: 'ETH',   name: 'Ethereum',        balance: '2.4817',    price: 3241.50, change:  2.4,  logo: '⟠', color: '#627EEA' },
  { symbol: 'USDC',  name: 'USD Coin',         balance: '4,820.00',  price: 1.00,    change:  0.01, logo: '$', color: '#2775CA' },
  { symbol: 'USDT',  name: 'Tether USD',       balance: '1,200.00',  price: 1.00,    change: -0.02, logo: '₮', color: '#26A17B' },
  { symbol: 'WBTC',  name: 'Wrapped Bitcoin',  balance: '0.0821',    price: 62840.00,change: -1.2,  logo: '₿', color: '#F7931A' },
  { symbol: 'ARB',   name: 'Arbitrum',         balance: '840.00',    price: 1.24,    change:  5.8,  logo: '🔵', color: '#28A0F0' },
  { symbol: 'OP',    name: 'Optimism',         balance: '320.50',    price: 2.87,    change:  3.1,  logo: '🔴', color: '#FF0420' },
  { symbol: 'MATIC', name: 'Polygon',          balance: '2,100.00',  price: 0.89,    change: -0.8,  logo: '⬡', color: '#8247E5' },
  { symbol: 'LINK',  name: 'Chainlink',        balance: '45.20',     price: 14.80,   change:  1.9,  logo: '⬡', color: '#375BD2' },
  { symbol: 'UNI',   name: 'Uniswap',          balance: '28.40',     price: 9.60,    change:  4.2,  logo: '🦄', color: '#FF007A' },
  { symbol: 'AAVE',  name: 'Aave',             balance: '3.10',      price: 182.40,  change:  2.7,  logo: '👻', color: '#B6509E' },
]

function formatUSD(v) {
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`
  if (v < 0.01)  return `$${v.toFixed(6)}`
  return `$${v.toFixed(2)}`
}

export default function TokenSelectorModal({ isOpen, onClose, onSelect, excludeSymbol }) {
  const { c } = useTheme()
  const [search, setSearch] = useState('')
  const [hovered, setHovered] = useState(null)
  const inputRef = useRef(null)

  const filtered = TOKENS.filter(
    t => t.symbol !== excludeSymbol &&
      (t.symbol.toLowerCase().includes(search.toLowerCase()) ||
       t.name.toLowerCase().includes(search.toLowerCase()))
  )

  useEffect(() => {
    if (isOpen) { setSearch(''); setTimeout(() => inputRef.current?.focus(), 100) }
  }, [isOpen])

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="w-full max-w-md rounded-2xl overflow-hidden"
              style={{
                background: c('rgba(16,14,24,0.96)', 'rgba(252,251,249,0.99)'),
                border: `1px solid ${c('rgba(255,255,255,0.1)', 'rgba(0,0,0,0.09)')}`,
                boxShadow: c(
                  '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(155,109,255,0.1)',
                  '0 16px 48px rgba(0,0,0,0.12), 0 0 0 1px rgba(155,109,255,0.1)'
                ),
              }}
              initial={{ scale: 0.92, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-4">
                <div>
                  <h2 className="text-base font-semibold" style={{ color: c('#ffffff', '#0a0a0a') }}>Select Token</h2>
                  <p className="text-xs mt-0.5" style={{ color: c('rgba(255,255,255,0.4)', 'rgba(0,0,0,0.4)') }}>Choose the token you want to trade</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                  style={{ background: c('rgba(255,255,255,0.06)', 'rgba(0,0,0,0.05)') }}
                  onMouseEnter={e => e.currentTarget.style.background = c('rgba(255,255,255,0.1)', 'rgba(0,0,0,0.09)')}
                  onMouseLeave={e => e.currentTarget.style.background = c('rgba(255,255,255,0.06)', 'rgba(0,0,0,0.05)')}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 1l12 12M13 1L1 13" stroke={c('rgba(255,255,255,0.5)', 'rgba(0,0,0,0.5)')} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Search */}
              <div className="px-5 pb-3">
                <div
                  className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all"
                  style={{ background: c('rgba(255,255,255,0.05)', 'rgba(0,0,0,0.04)'), border: `1px solid ${c('rgba(255,255,255,0.08)', 'rgba(0,0,0,0.08)')}` }}
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="flex-shrink-0">
                    <circle cx="6.5" cy="6.5" r="5.5" stroke={c('rgba(255,255,255,0.3)', 'rgba(0,0,0,0.3)')} strokeWidth="1.5"/>
                    <path d="M10.5 10.5L13.5 13.5" stroke={c('rgba(255,255,255,0.3)', 'rgba(0,0,0,0.3)')} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search name or paste address"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none"
                    style={{ color: c('#ffffff', '#0a0a0a') }}
                  />
                  {search && (
                    <button onClick={() => setSearch('')} style={{ color: c('rgba(255,255,255,0.3)', 'rgba(0,0,0,0.3)') }} className="hover:opacity-70 transition-opacity">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Popular quick-select */}
              <div className="px-5 pb-3">
                <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: c('rgba(255,255,255,0.3)', 'rgba(0,0,0,0.35)') }}>Popular</p>
                <div className="flex gap-2 flex-wrap">
                  {['ETH', 'USDC', 'USDT', 'WBTC'].map(sym => {
                    const token = TOKENS.find(t => t.symbol === sym)
                    if (!token || token.symbol === excludeSymbol) return null
                    return (
                      <button
                        key={sym}
                        onClick={() => { onSelect(token); onClose() }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                        style={{
                          background: c('rgba(255,255,255,0.05)', 'rgba(0,0,0,0.04)'),
                          border: `1px solid ${c('rgba(255,255,255,0.08)', 'rgba(0,0,0,0.08)')}`,
                          color: c('rgba(255,255,255,0.7)', 'rgba(0,0,0,0.6)'),
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(155,109,255,0.15)'; e.currentTarget.style.borderColor = 'rgba(155,109,255,0.3)'; e.currentTarget.style.color = c('#fff', '#0a0a0a') }}
                        onMouseLeave={e => { e.currentTarget.style.background = c('rgba(255,255,255,0.05)', 'rgba(0,0,0,0.04)'); e.currentTarget.style.borderColor = c('rgba(255,255,255,0.08)', 'rgba(0,0,0,0.08)'); e.currentTarget.style.color = c('rgba(255,255,255,0.7)', 'rgba(0,0,0,0.6)') }}
                      >
                        <span>{token.logo}</span>
                        <span>{sym}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div style={{ height: '1px', background: c('rgba(255,255,255,0.06)', 'rgba(0,0,0,0.06)'), margin: '0 20px' }} />

              {/* Token list */}
              <div className="overflow-y-auto" style={{ maxHeight: '320px' }}>
                {filtered.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm" style={{ color: c('rgba(255,255,255,0.3)', 'rgba(0,0,0,0.3)') }}>No tokens found</p>
                    <p className="text-xs mt-1" style={{ color: c('rgba(255,255,255,0.2)', 'rgba(0,0,0,0.25)') }}>Try searching by name or symbol</p>
                  </div>
                ) : (
                  <div className="py-2">
                    {filtered.map((token) => {
                      const usdValue = parseFloat(token.balance.replace(/,/g, '')) * token.price
                      return (
                        <motion.button
                          key={token.symbol}
                          className="w-full flex items-center gap-3 px-5 py-3 text-left transition-all"
                          style={{ background: hovered === token.symbol ? c('rgba(255,255,255,0.04)', 'rgba(0,0,0,0.03)') : 'transparent' }}
                          onMouseEnter={() => setHovered(token.symbol)}
                          onMouseLeave={() => setHovered(null)}
                          onClick={() => { onSelect(token); onClose() }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 font-bold"
                            style={{ background: `${token.color}20`, border: `1px solid ${token.color}30` }}
                          >
                            {token.logo}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold" style={{ color: c('#ffffff', '#0a0a0a') }}>{token.symbol}</span>
                              <span
                                className="text-xs px-1.5 py-0.5 rounded"
                                style={{
                                  background: token.change >= 0 ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
                                  color: token.change >= 0 ? '#34D399' : '#F87171',
                                }}
                              >
                                {token.change >= 0 ? '+' : ''}{token.change}%
                              </span>
                            </div>
                            <p className="text-xs mt-0.5 truncate" style={{ color: c('rgba(255,255,255,0.35)', 'rgba(0,0,0,0.4)') }}>{token.name}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-medium" style={{ color: c('rgba(255,255,255,0.8)', 'rgba(0,0,0,0.75)') }}>{token.balance}</p>
                            <p className="text-xs" style={{ color: c('rgba(255,255,255,0.35)', 'rgba(0,0,0,0.4)') }}>{formatUSD(usdValue)}</p>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="px-5 py-3" style={{ borderTop: `1px solid ${c('rgba(255,255,255,0.06)', 'rgba(0,0,0,0.06)')}` }}>
                <p className="text-xs text-center" style={{ color: c('rgba(255,255,255,0.2)', 'rgba(0,0,0,0.25)') }}>
                  Prices update every 15 seconds · Powered by CoinGecko
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
