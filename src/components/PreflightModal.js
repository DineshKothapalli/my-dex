import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

function Row({ label, value, sub, highlight }) {
  const { c } = useTheme()
  return (
    <div className="flex items-start justify-between py-2.5" style={{ borderBottom: `1px solid ${c('rgba(255,255,255,0.05)', 'rgba(0,0,0,0.05)')}` }}>
      <span className="text-sm" style={{ color: c('rgba(255,255,255,0.5)', 'rgba(0,0,0,0.5)') }}>{label}</span>
      <div className="text-right ml-4">
        <span className="text-sm font-medium" style={{ color: highlight || c('rgba(255,255,255,0.9)', '#0a0a0a') }}>{value}</span>
        {sub && <p className="text-xs mt-0.5" style={{ color: c('rgba(255,255,255,0.3)', 'rgba(0,0,0,0.35)') }}>{sub}</p>}
      </div>
    </div>
  )
}

export default function PreflightModal({ isOpen, onClose, onConfirm, fromToken, toToken, fromAmount, toAmount, slippage, loading }) {
  const { c } = useTheme()
  if (!fromToken || !toToken) return null

  const rate        = (fromToken.price / toToken.price).toFixed(6)
  const minReceived = toAmount ? (parseFloat(toAmount) * (1 - slippage / 100)).toFixed(6) : '–'
  const { priceImpact, gasUSD } = useMemo(() => ({
    priceImpact: (Math.random() * 0.3 + 0.01).toFixed(3),
    gasUSD:      (Math.random() * 8 + 2).toFixed(2),
  }), [])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="w-full max-w-sm rounded-2xl overflow-hidden"
              style={{
                background: c('rgba(14,12,22,0.98)', 'rgba(252,251,249,0.99)'),
                border: `1px solid ${c('rgba(255,255,255,0.1)', 'rgba(0,0,0,0.09)')}`,
                boxShadow: c(
                  '0 40px 100px rgba(0,0,0,0.9), 0 0 0 1px rgba(155,109,255,0.12)',
                  '0 16px 48px rgba(0,0,0,0.12), 0 0 0 1px rgba(155,109,255,0.1)'
                ),
              }}
              initial={{ scale: 0.9, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 24, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-base font-semibold" style={{ color: c('#ffffff', '#0a0a0a') }}>Confirm Swap</h2>
                  <button
                    onClick={onClose}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: c('rgba(255,255,255,0.06)', 'rgba(0,0,0,0.05)') }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1 1l10 10M11 1L1 11" stroke={c('rgba(255,255,255,0.5)', 'rgba(0,0,0,0.5)')} strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
                <p className="text-xs" style={{ color: c('rgba(255,255,255,0.35)', 'rgba(0,0,0,0.4)') }}>Here&apos;s exactly what will happen</p>
              </div>

              {/* Trade visual */}
              <div className="px-6 pb-4">
                <div className="rounded-2xl p-4" style={{ background: 'rgba(155,109,255,0.06)', border: '1px solid rgba(155,109,255,0.15)' }}>
                  {/* From */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs mb-1" style={{ color: c('rgba(255,255,255,0.4)', 'rgba(0,0,0,0.4)') }}>You send</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{fromToken.logo}</span>
                        <div>
                          <p className="text-xl font-bold" style={{ color: c('#ffffff', '#0a0a0a') }}>{parseFloat(fromAmount).toFixed(4)}</p>
                          <p className="text-xs" style={{ color: c('rgba(255,255,255,0.4)', 'rgba(0,0,0,0.4)') }}>{fromToken.symbol}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs" style={{ color: c('rgba(255,255,255,0.3)', 'rgba(0,0,0,0.3)') }}>
                      ≈ ${(parseFloat(fromAmount) * fromToken.price).toFixed(2)}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center my-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(155,109,255,0.15)', border: '1px solid rgba(155,109,255,0.3)' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 2v10M3 8l4 4 4-4" stroke="#9B6DFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* To */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs mb-1" style={{ color: 'rgba(52,211,153,0.7)' }}>You receive (est.)</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{toToken.logo}</span>
                        <div>
                          <p className="text-xl font-bold text-green-400">{parseFloat(toAmount || 0).toFixed(4)}</p>
                          <p className="text-xs" style={{ color: c('rgba(255,255,255,0.4)', 'rgba(0,0,0,0.4)') }}>{toToken.symbol}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs" style={{ color: c('rgba(255,255,255,0.3)', 'rgba(0,0,0,0.3)') }}>
                      ≈ ${(parseFloat(toAmount || 0) * toToken.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="px-6 pb-2">
                <Row label="Exchange rate"    value={`1 ${fromToken.symbol} = ${rate} ${toToken.symbol}`} />
                <Row label="Minimum received" value={`${minReceived} ${toToken.symbol}`} sub={`Swap cancels if price moves >${slippage}%`} highlight="#C4A8FF" />
                <Row label="Price impact"     value={`${priceImpact}%`} highlight={parseFloat(priceImpact) < 0.3 ? '#34D399' : '#FBBF24'} />
                <Row label="Network fee"      value={`$${gasUSD}`} sub="Paid in ETH to Ethereum validators" />
                <Row label="Route"            value="Uniswap V3 → Direct" />
              </div>

              {/* Plain English summary */}
              <div className="px-6 pb-5 pt-2">
                <div className="p-3 rounded-xl" style={{ background: c('rgba(52,211,153,0.06)', 'rgba(52,211,153,0.05)'), border: '1px solid rgba(52,211,153,0.15)' }}>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(52,211,153,0.8)' }}>
                    ✓ You&apos;ll spend <strong style={{ color: c('#ffffff', '#0a0a0a') }}>{parseFloat(fromAmount).toFixed(4)} {fromToken.symbol}</strong> and receive at least{' '}
                    <strong style={{ color: c('#ffffff', '#0a0a0a') }}>{minReceived} {toToken.symbol}</strong>. If the market moves more than {slippage}%, nothing happens and your tokens stay safe.
                  </p>
                </div>
              </div>

              {/* Confirm button */}
              <div className="px-6 pb-6">
                <motion.button
                  onClick={onConfirm}
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-semibold text-sm relative overflow-hidden"
                  style={{
                    background: loading ? 'rgba(155,109,255,0.3)' : 'linear-gradient(135deg, #9B6DFF 0%, #7B4DDF 100%)',
                    color: loading ? 'rgba(255,255,255,0.5)' : '#fff',
                    boxShadow: loading ? 'none' : '0 0 30px rgba(155,109,255,0.3)',
                  }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      />
                      Confirming in wallet...
                    </span>
                  ) : 'Confirm Swap'}
                </motion.button>
                <p className="text-center text-xs mt-3" style={{ color: c('rgba(255,255,255,0.2)', 'rgba(0,0,0,0.25)') }}>
                  By confirming, you agree to the swap terms and network fees
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
