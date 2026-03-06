import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const WALLETS = [
  {
    id: 'metamask',
    name: 'MetaMask',
    desc: 'Connect using browser extension',
    badge: 'Most popular',
    color: '#F6851B',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="10" fill="#F6851B"/>
        <path d="M28 8.5L19.8 14.6l1.5-3.6L28 8.5z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.25"/>
        <path d="M8 8.5l8.1 6.2-1.4-3.7L8 8.5z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.25"/>
        <path d="M24.9 22.9l-2.2 3.3 4.7 1.3 1.3-4.5-3.8-.1z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.25"/>
        <path d="M7.3 23l1.3 4.5 4.7-1.3-2.2-3.3-3.8.1z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.25"/>
        <path d="M13 17.4l-1.3 1.9 4.6.2-.2-4.9-3.1 2.8z" fill="#F6851B" stroke="#F6851B" strokeWidth="0.25"/>
        <path d="M23 17.4l-3.2-2.9-.1 5 4.6-.2-1.3-1.9z" fill="#F6851B" stroke="#F6851B" strokeWidth="0.25"/>
        <path d="M13.3 26.2l2.8-1.3-2.4-1.9-.4 3.2z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.25"/>
        <path d="M19.9 24.9l2.8 1.3-.4-3.2-2.4 1.9z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.25"/>
        <ellipse cx="18" cy="19.5" rx="4.5" ry="3" fill="#FEF3DC"/>
        <circle cx="15.5" cy="19" r="1.2" fill="#1D1D1D"/>
        <circle cx="20.5" cy="19" r="1.2" fill="#1D1D1D"/>
      </svg>
    ),
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    desc: 'Connect with Coinbase Wallet app',
    color: '#0052FF',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="10" fill="#0052FF"/>
        <circle cx="18" cy="18" r="10" fill="white"/>
        <circle cx="18" cy="18" r="6.5" fill="#0052FF"/>
        <path d="M15 18a3 3 0 106 0 3 3 0 00-6 0z" fill="white"/>
      </svg>
    ),
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    desc: 'Scan with any compatible wallet',
    color: '#3B99FC',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="10" fill="#3B99FC"/>
        <path d="M10.5 16.8c4.1-4 10.9-4 15 0l.5.5-1.8 1.8-.5-.5c-3.1-3-8.2-3-11.3 0l-.5.5-1.8-1.8.4-.5z" fill="white"/>
        <path d="M14 20.3l1.9 1.8c1.2 1.1 3 1.1 4.2 0l1.9-1.8 1.8 1.8-1.9 1.8c-2.1 2-5.6 2-7.8 0l-1.9-1.8 1.8-1.8z" fill="white"/>
      </svg>
    ),
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    desc: 'A fun, simple, and secure wallet',
    color: '#FF6B6B',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="10" fill="white"/>
        <defs>
          <linearGradient id="rbow1" x1="6" y1="18" x2="30" y2="18" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF4040"/>
            <stop offset="0.25" stopColor="#FF8C00"/>
            <stop offset="0.5" stopColor="#FFD700"/>
            <stop offset="0.75" stopColor="#00CA4A"/>
            <stop offset="1" stopColor="#0070F3"/>
          </linearGradient>
          <linearGradient id="rbow2" x1="9" y1="18" x2="27" y2="18" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF4040"/>
            <stop offset="0.25" stopColor="#FF8C00"/>
            <stop offset="0.5" stopColor="#FFD700"/>
            <stop offset="0.75" stopColor="#00CA4A"/>
            <stop offset="1" stopColor="#0070F3"/>
          </linearGradient>
        </defs>
        <path d="M6 26c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="url(#rbow1)" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
        <path d="M10 26c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="url(#rbow2)" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.75"/>
      </svg>
    ),
  },
]

function truncateAddr(addr) {
  return addr.slice(0, 6) + '...' + addr.slice(-4)
}

export default function ConnectWalletModal({ isOpen, onClose, onConnect }) {
  const { c } = useTheme()
  const [connecting, setConnecting] = useState(null)
  const [connected, setConnected] = useState(null)

  const handleWalletClick = async (wallet) => {
    setConnecting(wallet.id)
    await new Promise(r => setTimeout(r, 1600))
    const addr = '0x' + Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 6)
    setConnecting(null)
    setConnected({ wallet, address: addr })
    onConnect?.({ wallet: wallet.name, address: addr })
  }

  const handleClose = () => {
    setConnecting(null)
    setConnected(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm rounded-2xl overflow-hidden"
              style={{
                background: c('rgba(14,12,22,0.98)', 'rgba(252,251,249,0.99)'),
                border: `1px solid ${c('rgba(255,255,255,0.1)', 'rgba(0,0,0,0.08)')}`,
                boxShadow: c(
                  '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(155,109,255,0.1)',
                  '0 16px 48px rgba(0,0,0,0.12), 0 0 0 1px rgba(155,109,255,0.12)'
                ),
              }}
              initial={{ scale: 0.92, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onClick={e => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                {connected ? (
                  /* ── Connected state ── */
                  <motion.div
                    key="connected"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="p-6 text-center"
                  >
                    {/* Wallet icon + check */}
                    <div className="relative w-16 h-16 mx-auto mb-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden">
                        {connected.wallet.icon}
                      </div>
                      <motion.div
                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: '#34D399' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25, delay: 0.1 }}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                      <p className="text-sm font-semibold mb-1" style={{ color: c('#ffffff', '#0a0a0a') }}>
                        Connected to {connected.wallet.name}
                      </p>
                      <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mx-auto mb-4"
                        style={{ background: c('rgba(255,255,255,0.06)', 'rgba(0,0,0,0.05)'), border: `1px solid ${c('rgba(255,255,255,0.1)', 'rgba(0,0,0,0.08)')}` }}
                      >
                        <div className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: '0 0 6px #34D399' }} />
                        <span className="text-xs font-mono" style={{ color: c('rgba(255,255,255,0.7)', 'rgba(0,0,0,0.6)') }}>
                          {truncateAddr(connected.address)}
                        </span>
                      </div>

                      <button
                        onClick={handleClose}
                        className="w-full py-3 rounded-xl font-semibold text-sm text-white"
                        style={{ background: 'linear-gradient(135deg, #9B6DFF 0%, #7B4DDF 100%)', boxShadow: '0 0 24px rgba(155,109,255,0.3)' }}
                      >
                        Start Trading →
                      </button>
                    </motion.div>
                  </motion.div>
                ) : (
                  /* ── Wallet list ── */
                  <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 pt-5 pb-4">
                      <div>
                        <h2 className="text-base font-semibold" style={{ color: c('#ffffff', '#0a0a0a') }}>Connect Wallet</h2>
                        <p className="text-xs mt-0.5" style={{ color: c('rgba(255,255,255,0.35)', 'rgba(0,0,0,0.4)') }}>
                          Choose how you want to connect
                        </p>
                      </div>
                      <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                        style={{ background: c('rgba(255,255,255,0.06)', 'rgba(0,0,0,0.05)') }}
                        onMouseEnter={e => e.currentTarget.style.background = c('rgba(255,255,255,0.1)', 'rgba(0,0,0,0.09)')}
                        onMouseLeave={e => e.currentTarget.style.background = c('rgba(255,255,255,0.06)', 'rgba(0,0,0,0.05)')}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M1 1l10 10M11 1L1 11" stroke={c('rgba(255,255,255,0.5)', 'rgba(0,0,0,0.5)')} strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>

                    {/* Wallet options */}
                    <div className="px-3 pb-3 space-y-1.5">
                      {WALLETS.map((wallet, i) => {
                        const isConnecting = connecting === wallet.id
                        const isOtherConnecting = connecting && connecting !== wallet.id
                        return (
                          <motion.button
                            key={wallet.id}
                            onClick={() => !connecting && handleWalletClick(wallet)}
                            disabled={!!connecting}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all"
                            style={{
                              background: isConnecting
                                ? `${wallet.color}15`
                                : c('rgba(255,255,255,0.04)', 'rgba(0,0,0,0.03)'),
                              border: `1px solid ${isConnecting ? `${wallet.color}35` : c('rgba(255,255,255,0.07)', 'rgba(0,0,0,0.07)')}`,
                              opacity: isOtherConnecting ? 0.4 : 1,
                              cursor: connecting ? 'default' : 'pointer',
                            }}
                            whileHover={!connecting ? {
                              background: c('rgba(255,255,255,0.07)', 'rgba(0,0,0,0.06)'),
                            } : {}}
                            whileTap={!connecting ? { scale: 0.99 } : {}}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                          >
                            {/* Icon */}
                            <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
                              {wallet.icon}
                            </div>

                            {/* Name + desc */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold" style={{ color: c('#ffffff', '#0a0a0a') }}>{wallet.name}</span>
                                {wallet.badge && (
                                  <span
                                    className="text-xs px-1.5 py-0.5 rounded font-medium"
                                    style={{ background: 'rgba(155,109,255,0.15)', color: '#C4A8FF', border: '1px solid rgba(155,109,255,0.2)' }}
                                  >
                                    {wallet.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs mt-0.5 truncate" style={{ color: c('rgba(255,255,255,0.35)', 'rgba(0,0,0,0.4)') }}>
                                {wallet.desc}
                              </p>
                            </div>

                            {/* Arrow / spinner */}
                            <div className="flex-shrink-0">
                              {isConnecting ? (
                                <motion.div
                                  className="w-5 h-5 rounded-full border-2 border-t-transparent"
                                  style={{ borderColor: `${wallet.color}40`, borderTopColor: wallet.color }}
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                />
                              ) : (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.25 }}>
                                  <path d="M6 3l5 5-5 5" stroke={c('white', 'black')} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>

                    {/* Footer */}
                    <div
                      className="px-5 py-3 text-center"
                      style={{ borderTop: `1px solid ${c('rgba(255,255,255,0.06)', 'rgba(0,0,0,0.06)')}` }}
                    >
                      <p className="text-xs" style={{ color: c('rgba(255,255,255,0.2)', 'rgba(0,0,0,0.3)') }}>
                        New to Web3?{' '}
                        <span className="text-accent cursor-pointer" style={{ color: '#9B6DFF' }}>
                          Learn about wallets →
                        </span>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
