import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const SUCCESS_MESSAGES = [
  'Clean execution — no slippage, no surprises.',
  'Routed through the deepest liquidity pool available.',
  'Confirmed in one block. That\'s fast.',
]

const ERROR_SUGGESTIONS = {
  gas: [
    'Wait a few minutes and try again — congestion clears quickly.',
    'Bump your gas limit by 20% in your wallet settings.',
    'Consider switching to Arbitrum for lower fees.',
  ],
  slippage: [
    'Increase your slippage tolerance to 0.5%.',
    'Try a smaller amount — large trades move the price more.',
    'Wait for a calmer moment in the market.',
  ],
  default: [
    'Refresh the page and try again.',
    'Check your wallet has enough ETH for gas.',
    'Try a different token pair with more liquidity.',
  ],
}

function AnimatedCheck() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      {/* Background circle ring */}
      <motion.circle
        cx="24" cy="24" r="21"
        stroke="#34D399"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ rotate: -90, originX: '24px', originY: '24px' }}
      />
      {/* Checkmark */}
      <motion.path
        d="M14 24l8 8 14-16"
        stroke="#34D399"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.55, ease: 'easeOut' }}
      />
    </svg>
  )
}

function AnimatedX() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <motion.circle
        cx="24" cy="24" r="21"
        stroke="#F87171"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      <motion.path
        d="M16 16l16 16M32 16L16 32"
        stroke="#F87171"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.35, delay: 0.45, ease: 'easeOut' }}
      />
    </svg>
  )
}

export default function TransactionModal({
  isOpen,
  status,         // 'success' | 'error'
  error,          // { title, message, type }
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  onClose,
  onRetry,
}) {
  const { c } = useTheme()
  const isSuccess = status === 'success'
  const suggestions = error?.message?.includes('gas')
    ? ERROR_SUGGESTIONS.gas
    : error?.message?.includes('slippage')
    ? ERROR_SUGGESTIONS.slippage
    : ERROR_SUGGESTIONS.default

  const { fakeTxHash, randomTip } = useMemo(() => ({
    fakeTxHash: '0x' + Math.random().toString(16).slice(2, 18) + '...',
    randomTip:  SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)],
  }), [])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(16px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm rounded-2xl overflow-hidden"
              style={{
                background: c('rgba(14,12,22,0.99)', 'rgba(252,251,249,0.99)'),
                border: `1px solid ${isSuccess
                  ? 'rgba(52,211,153,0.2)'
                  : 'rgba(248,113,113,0.2)'}`,
                boxShadow: c(
                  isSuccess
                    ? '0 32px 80px rgba(0,0,0,0.8), 0 0 60px rgba(52,211,153,0.08)'
                    : '0 32px 80px rgba(0,0,0,0.8), 0 0 60px rgba(248,113,113,0.08)',
                  isSuccess
                    ? '0 16px 48px rgba(0,0,0,0.1), 0 0 40px rgba(52,211,153,0.06)'
                    : '0 16px 48px rgba(0,0,0,0.1), 0 0 40px rgba(248,113,113,0.06)'
                ),
              }}
              initial={{ scale: 0.88, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 24, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Icon */}
                <motion.div
                  className="flex justify-center mb-5"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      background: isSuccess ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
                      border: `1px solid ${isSuccess ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}`,
                    }}
                  >
                    {isSuccess ? <AnimatedCheck /> : <AnimatedX />}
                  </div>
                </motion.div>

                {/* Title */}
                <motion.div
                  className="text-center mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <h2
                    className="text-lg font-bold mb-1"
                    style={{ color: isSuccess ? '#34D399' : '#F87171' }}
                  >
                    {isSuccess ? 'Swap Complete' : (error?.title || 'Swap Failed')}
                  </h2>
                  <p className="text-sm" style={{ color: c('rgba(255,255,255,0.5)', 'rgba(0,0,0,0.5)') }}>
                    {isSuccess
                      ? `Swapped ${parseFloat(fromAmount).toFixed(4)} ${fromToken?.symbol} for ${parseFloat(toAmount).toFixed(4)} ${toToken?.symbol}`
                      : error?.message || 'Something went wrong with your transaction.'}
                  </p>
                </motion.div>

                {/* Success details */}
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-4 space-y-2"
                  >
                    {/* Trade summary */}
                    <div
                      className="flex items-center justify-between p-3 rounded-xl"
                      style={{ background: c('rgba(52,211,153,0.06)', 'rgba(52,211,153,0.05)'), border: '1px solid rgba(52,211,153,0.12)' }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{fromToken?.logo}</span>
                        <span className="text-sm font-semibold" style={{ color: c('#ffffff', '#0a0a0a') }}>{parseFloat(fromAmount).toFixed(4)} {fromToken?.symbol}</span>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-green-400">{parseFloat(toAmount).toFixed(4)} {toToken?.symbol}</span>
                        <span className="text-lg">{toToken?.logo}</span>
                      </div>
                    </div>

                    {/* Tx hash */}
                    <div
                      className="flex items-center justify-between p-3 rounded-xl"
                      style={{ background: c('rgba(255,255,255,0.03)', 'rgba(0,0,0,0.03)'), border: `1px solid ${c('rgba(255,255,255,0.06)', 'rgba(0,0,0,0.06)')}` }}
                    >
                      <span className="text-xs" style={{ color: c('rgba(255,255,255,0.35)', 'rgba(0,0,0,0.4)') }}>Transaction</span>
                      <span className="text-xs font-mono" style={{ color: '#9B6DFF' }}>{fakeTxHash}</span>
                    </div>

                    {/* Tip */}
                    <p className="text-xs text-center" style={{ color: c('rgba(255,255,255,0.25)', 'rgba(0,0,0,0.3)') }}>
                      ✦ {randomTip}
                    </p>
                  </motion.div>
                )}

                {/* Error suggestions */}
                {!isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="mb-4"
                  >
                    <div
                      className="p-3 rounded-xl"
                      style={{ background: c('rgba(248,113,113,0.06)', 'rgba(248,113,113,0.05)'), border: '1px solid rgba(248,113,113,0.12)' }}
                    >
                      <p className="text-xs font-medium mb-2" style={{ color: 'rgba(248,113,113,0.8)' }}>
                        Try these fixes:
                      </p>
                      <ul className="space-y-1.5">
                        {suggestions.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs" style={{ color: c('rgba(255,255,255,0.5)', 'rgba(0,0,0,0.5)') }}>
                            <span className="mt-0.5 flex-shrink-0" style={{ color: 'rgba(248,113,113,0.6)' }}>→</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}

                {/* Actions */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {isSuccess ? (
                    <>
                      <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl font-semibold text-sm"
                        style={{ background: 'linear-gradient(135deg, #9B6DFF 0%, #7B4DDF 100%)', boxShadow: '0 0 24px rgba(155,109,255,0.25)', color: '#ffffff' }}
                      >
                        Swap Again
                      </button>
                      <button
                        onClick={onClose}
                        className="w-full py-2.5 rounded-xl text-sm font-medium transition-all"
                        style={{ color: c('rgba(255,255,255,0.4)', 'rgba(0,0,0,0.4)') }}
                      >
                        View on Etherscan ↗
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={onRetry}
                        className="w-full py-3 rounded-xl font-semibold text-sm"
                        style={{ background: 'linear-gradient(135deg, #9B6DFF 0%, #7B4DDF 100%)', boxShadow: '0 0 24px rgba(155,109,255,0.25)', color: '#ffffff' }}
                      >
                        Try Again
                      </button>
                      <button
                        onClick={onClose}
                        className="w-full py-2.5 rounded-xl text-sm font-medium transition-all"
                        style={{ color: c('rgba(255,255,255,0.4)', 'rgba(0,0,0,0.4)') }}
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
