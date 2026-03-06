import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TokenSelectorModal from './TokenSelectorModal'
import SlippageControl from './SlippageControl'
import SwapIntelligencePanel from './SwapIntelligencePanel'
import PreflightModal from './PreflightModal'
import TransactionModal from './TransactionModal'
import { useTheme } from '../context/ThemeContext'

const DEFAULT_FROM = { symbol: 'ETH',  name: 'Ethereum', balance: '2.4817',   price: 3241.50, change: 2.4,  logo: '⟠', color: '#627EEA' }
const DEFAULT_TO   = { symbol: 'USDC', name: 'USD Coin', balance: '4,820.00', price: 1.00,    change: 0.01, logo: '$', color: '#2775CA' }

const makeInsufficientError = (sym) => ({
  title: `Not enough ${sym}`,
  message: `You don't have enough ${sym} to complete this swap. You can buy more on Coinbase or bridge from another chain.`,
  type: 'error',
})

// Pre-swap validation banner (inside card)
function ValidationBanner({ error, onDismiss }) {
  const { c } = useTheme()
  if (!error) return null
  const isErr = error.type === 'error'
  const color  = isErr ? '#F87171' : '#FBBF24'
  const bg     = isErr ? c('rgba(248,113,113,0.08)', 'rgba(248,113,113,0.06)') : c('rgba(251,191,36,0.08)', 'rgba(251,191,36,0.06)')
  const border = isErr ? 'rgba(248,113,113,0.2)' : 'rgba(251,191,36,0.2)'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.25 }}
        className="mb-3 overflow-hidden"
      >
        <div className="rounded-xl p-3.5 flex items-start gap-3" style={{ background: bg, border: `1px solid ${border}` }}>
          <span style={{ color }} className="text-base flex-shrink-0">{isErr ? '✕' : '⚠'}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold" style={{ color }}>{error.title}</p>
            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: c('rgba(255,255,255,0.5)', 'rgba(0,0,0,0.5)') }}>{error.message}</p>
          </div>
          <button onClick={onDismiss} style={{ color: c('rgba(255,255,255,0.3)', 'rgba(0,0,0,0.3)') }} className="flex-shrink-0 hover:opacity-70 transition-opacity">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function TokenInput({ label, token, amount, onAmountChange, onTokenClick, readOnly, usdValue }) {
  const { c } = useTheme()
  const [focused, setFocused] = useState(false)

  return (
    <div
      className="rounded-2xl p-4 transition-all duration-200"
      style={{
        background: focused
          ? c('rgba(255,255,255,0.07)', 'rgba(0,0,0,0.05)')
          : c('rgba(255,255,255,0.04)', 'rgba(0,0,0,0.03)'),
        border: `1px solid ${focused ? 'rgba(155,109,255,0.35)' : c('rgba(255,255,255,0.08)', 'rgba(0,0,0,0.08)')}`,
        boxShadow: focused ? '0 0 0 3px rgba(155,109,255,0.08)' : 'none',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: c('rgba(255,255,255,0.35)', 'rgba(0,0,0,0.4)') }}>
          {label}
        </span>
        {token && (
          <span className="text-xs" style={{ color: c('rgba(255,255,255,0.3)', 'rgba(0,0,0,0.35)') }}>
            Balance: <span className="font-medium" style={{ color: c('rgba(255,255,255,0.5)', 'rgba(0,0,0,0.6)') }}>{token.balance} {token.symbol}</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          onClick={onTokenClick}
          className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all flex-shrink-0"
          style={{
            background: token ? `${token.color}15` : 'rgba(155,109,255,0.15)',
            border: `1px solid ${token ? `${token.color}30` : 'rgba(155,109,255,0.3)'}`,
          }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
        >
          {token ? (
            <>
              <span className="text-lg leading-none">{token.logo}</span>
              <span className="text-sm font-semibold" style={{ color: c('#ffffff', '#0a0a0a') }}>{token.symbol}</span>
            </>
          ) : (
            <span className="text-sm font-semibold" style={{ color: '#9B6DFF' }}>Select</span>
          )}
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.5 }}>
            <path d="M2 3.5l3 3 3-3" stroke={c('white', 'black')} strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </motion.button>

        <div className="flex-1 text-right">
          <input
            type="number"
            placeholder="0"
            value={amount}
            onChange={e => onAmountChange?.(e.target.value)}
            readOnly={readOnly}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full text-right text-2xl font-bold bg-transparent outline-none transition-all"
            style={{
              color: c('#ffffff', '#0a0a0a'),
              cursor: readOnly ? 'default' : 'text',
            }}
          />
          {usdValue !== undefined && (
            <p className="text-xs mt-1" style={{ color: c('rgba(255,255,255,0.3)', 'rgba(0,0,0,0.35)') }}>
              {usdValue > 0 ? `≈ $${usdValue.toFixed(2)}` : ''}
            </p>
          )}
        </div>
      </div>

      {!readOnly && token && (
        <div className="flex justify-end mt-2">
          <button
            onClick={() => onAmountChange?.(token.balance.replace(/,/g, ''))}
            className="text-xs px-2 py-0.5 rounded transition-all font-medium"
            style={{ background: 'rgba(155,109,255,0.1)', color: 'rgba(155,109,255,0.8)', border: '1px solid rgba(155,109,255,0.2)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(155,109,255,0.2)'; e.currentTarget.style.color = '#9B6DFF' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(155,109,255,0.1)'; e.currentTarget.style.color = 'rgba(155,109,255,0.8)' }}
          >
            MAX
          </button>
        </div>
      )}
    </div>
  )
}

export default function SwapCard() {
  const { c } = useTheme()
  const [fromToken, setFromToken] = useState(DEFAULT_FROM)
  const [toToken, setToToken]     = useState(DEFAULT_TO)
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount]     = useState('')
  const [slippage, setSlippage]     = useState(0.5)
  const [tokenModal, setTokenModal] = useState(null)
  const [preflightOpen, setPreflightOpen] = useState(false)
  const [swapLoading, setSwapLoading]     = useState(false)
  const [txModal, setTxModal]   = useState(null) // { status, error }
  const [valError, setValError] = useState(null) // validation errors (pre-swap)
  const [isFlipping, setIsFlipping] = useState(false)
  const [confidence] = useState(Math.floor(Math.random() * 25 + 72))

  const route = fromToken && toToken
    ? (fromToken.symbol === 'ETH' || toToken.symbol === 'ETH' ? [] : ['WETH'])
    : []

  // Derive output + validate
  useEffect(() => {
    if (!fromAmount || parseFloat(fromAmount) === 0 || !fromToken || !toToken) {
      setToAmount('')
      setValError(null)
      return
    }
    const from = parseFloat(fromAmount)
    setToAmount((from * fromToken.price / toToken.price).toFixed(6))
    const bal = parseFloat(fromToken.balance.replace(/,/g, ''))
    setValError(from > bal ? makeInsufficientError(fromToken.symbol) : null)
  }, [fromAmount, fromToken, toToken])

  const handleFlip = useCallback(() => {
    if (isFlipping) return
    setIsFlipping(true)
    setFromToken(toToken); setToToken(fromToken)
    setFromAmount(toAmount); setToAmount(fromAmount)
    setTimeout(() => setIsFlipping(false), 400)
  }, [fromToken, toToken, fromAmount, toAmount, isFlipping])

  const handleSwap = useCallback(async () => {
    if (!fromAmount || !toAmount) return
    setPreflightOpen(false)
    setSwapLoading(true)

    const snapshotFrom = fromAmount
    const snapshotTo = toAmount

    await new Promise(r => setTimeout(r, 2200))
    setSwapLoading(false)

    if (Math.random() > 0.15) {
      setFromAmount('')
      setToAmount('')
      setTxModal({ status: 'success', fromAmount: snapshotFrom, toAmount: snapshotTo })
    } else {
      setTxModal({
        status: 'error',
        error: {
          title: 'Transaction ran out of gas',
          message: 'The network was congested and your transaction didn\'t have enough gas to complete. This didn\'t cost you anything — the transaction was cancelled.',
          type: 'error',
        },
      })
    }
  }, [fromAmount, toAmount])

  const handleTxClose = () => setTxModal(null)
  const handleRetry   = () => { setTxModal(null); setPreflightOpen(true) }

  const canSwap = fromAmount && parseFloat(fromAmount) > 0 && fromToken && toToken && !valError
  const fromUSD = fromAmount && fromToken ? parseFloat(fromAmount) * fromToken.price : 0
  const toUSD   = toAmount   && toToken   ? parseFloat(toAmount)   * toToken.price   : 0

  return (
    <>
      <motion.div
        className="w-full max-w-[480px] mx-auto"
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Main card */}
        <div
          className="rounded-3xl p-5"
          style={{
            background: c('rgba(255,255,255,0.04)', 'rgba(255,255,255,0.72)'),
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: `1px solid ${c('rgba(255,255,255,0.08)', 'rgba(0,0,0,0.08)')}`,
            boxShadow: 'var(--card-shadow)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-base font-semibold" style={{ color: c('#ffffff', '#0a0a0a') }}>Swap</h1>
              <p className="text-xs mt-0.5" style={{ color: c('rgba(255,255,255,0.3)', 'rgba(0,0,0,0.35)') }}>Trade tokens instantly</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: '0 0 6px #34D399' }} />
                <span className="text-xs font-medium text-green-400">Ethereum</span>
              </div>
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{ background: c('rgba(255,255,255,0.05)', 'rgba(0,0,0,0.05)'), border: `1px solid ${c('rgba(255,255,255,0.08)', 'rgba(0,0,0,0.08)')}` }}
                onMouseEnter={e => e.currentTarget.style.background = c('rgba(255,255,255,0.09)', 'rgba(0,0,0,0.09)')}
                onMouseLeave={e => e.currentTarget.style.background = c('rgba(255,255,255,0.05)', 'rgba(0,0,0,0.05)')}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v1M7 12v1M1 7H2M12 7h1M2.5 2.5l.7.7M10.8 10.8l.7.7M2.5 11.5l.7-.7M10.8 3.2l.7-.7" stroke={c('rgba(255,255,255,0.4)', 'rgba(0,0,0,0.4)')} strokeWidth="1.2" strokeLinecap="round"/>
                  <circle cx="7" cy="7" r="2.5" stroke={c('rgba(255,255,255,0.4)', 'rgba(0,0,0,0.4)')} strokeWidth="1.2"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Validation banner */}
          <ValidationBanner error={valError} onDismiss={() => setValError(null)} />

          {/* From */}
          <TokenInput label="You Pay"     token={fromToken} amount={fromAmount} onAmountChange={setFromAmount} onTokenClick={() => setTokenModal('from')} usdValue={fromUSD} />

          {/* Flip */}
          <div className="flex justify-center my-2 relative z-10">
            <motion.button
              onClick={handleFlip}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(155,109,255,0.15)', border: '1px solid rgba(155,109,255,0.3)', boxShadow: '0 0 20px rgba(155,109,255,0.1)' }}
              whileHover={{ scale: 1.1, background: 'rgba(155,109,255,0.25)', boxShadow: '0 0 30px rgba(155,109,255,0.25)' }}
              whileTap={{ scale: 0.92 }}
              animate={{ rotate: isFlipping ? 180 : 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 2v9M4 11l-2-2M4 11l2-2M12 14V5M12 5l-2 2M12 5l2 2" stroke="#9B6DFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </div>

          {/* To */}
          <TokenInput label="You Receive" token={toToken}   amount={toAmount}   onTokenClick={() => setTokenModal('to')} readOnly usdValue={toUSD} />

          {/* Live rate */}
          <AnimatePresence>
            {fromToken && toToken && fromAmount && parseFloat(fromAmount) > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mt-3 px-1 overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: c('rgba(255,255,255,0.35)', 'rgba(0,0,0,0.4)') }}>
                    1 {fromToken.symbol} = {(fromToken.price / toToken.price).toFixed(4)} {toToken.symbol}
                  </span>
                  <div className="flex items-center gap-1 text-xs" style={{ color: c('rgba(255,255,255,0.25)', 'rgba(0,0,0,0.3)') }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
                    <span>Live</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Slippage */}
          <div className="mt-4 px-1">
            <SlippageControl slippage={slippage} onChange={setSlippage} />
          </div>

          {/* Swap button */}
          <div className="mt-4">
            <motion.button
              onClick={() => canSwap && setPreflightOpen(true)}
              disabled={!canSwap || swapLoading}
              className="w-full py-4 rounded-2xl font-semibold text-sm relative overflow-hidden"
              style={{
                background: canSwap && !swapLoading
                  ? 'linear-gradient(135deg, #9B6DFF 0%, #7B4DDF 60%, #6B3DCF 100%)'
                  : c('rgba(255,255,255,0.06)', 'rgba(0,0,0,0.06)'),
                color: canSwap ? '#fff' : c('rgba(255,255,255,0.25)', 'rgba(0,0,0,0.25)'),
                boxShadow: canSwap && !swapLoading ? '0 0 40px rgba(155,109,255,0.3), inset 0 1px 0 rgba(255,255,255,0.15)' : 'none',
                cursor: canSwap ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
              }}
              whileHover={canSwap && !swapLoading ? { scale: 1.01 } : {}}
              whileTap={canSwap && !swapLoading ? { scale: 0.99 } : {}}
            >
              {swapLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                  Processing swap...
                </span>
              ) : !fromAmount || parseFloat(fromAmount) === 0
                ? 'Enter an amount'
                : valError?.type === 'error'
                ? valError.title
                : 'Preview Swap →'}
            </motion.button>
          </div>

          <p className="text-center text-xs mt-3" style={{ color: c('rgba(255,255,255,0.15)', 'rgba(0,0,0,0.2)') }}>
            Powered by Uniswap V3 Protocol · 0.3% fee
          </p>
        </div>

        {/* Intelligence panel */}
        <SwapIntelligencePanel
          fromToken={fromToken} toToken={toToken}
          amount={fromAmount} confidence={confidence} route={route}
        />
      </motion.div>

      {/* Modals */}
      <TokenSelectorModal isOpen={tokenModal === 'from'} onClose={() => setTokenModal(null)} onSelect={setFromToken} excludeSymbol={toToken?.symbol} />
      <TokenSelectorModal isOpen={tokenModal === 'to'}   onClose={() => setTokenModal(null)} onSelect={setToToken}   excludeSymbol={fromToken?.symbol} />
      <PreflightModal
        isOpen={preflightOpen} onClose={() => setPreflightOpen(false)} onConfirm={handleSwap}
        fromToken={fromToken} toToken={toToken} fromAmount={fromAmount} toAmount={toAmount}
        slippage={slippage} loading={swapLoading}
      />
      <TransactionModal
        isOpen={!!txModal}
        status={txModal?.status}
        error={txModal?.error}
        fromToken={fromToken} toToken={toToken}
        fromAmount={txModal?.fromAmount} toAmount={txModal?.toAmount}
        onClose={handleTxClose}
        onRetry={handleRetry}
      />
    </>
  )
}
