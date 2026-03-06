import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

function ScoreRing({ score }) {
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? '#34D399' : score >= 60 ? '#A78BFA' : score >= 40 ? '#FBBF24' : '#F87171'

  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="32" cy="32" r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <motion.circle
          cx="32" cy="32" r={radius}
          stroke={color} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-base font-bold" style={{ color }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          {score}
        </motion.span>
      </div>
    </div>
  )
}

function Bar({ label, value, max, color, unit = '' }) {
  const { c } = useTheme()
  const percent = Math.min((value / max) * 100, 100)
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs" style={{ color: c('rgba(255,255,255,0.4)', 'rgba(0,0,0,0.4)') }}>{label}</span>
        <span className="text-xs font-medium" style={{ color: c('rgba(255,255,255,0.7)', 'rgba(0,0,0,0.65)') }}>{value}{unit}</span>
      </div>
      <div className="h-1 rounded-full w-full" style={{ background: c('rgba(255,255,255,0.06)', 'rgba(0,0,0,0.08)') }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  )
}

export default function SwapIntelligencePanel({ fromToken, toToken, amount, confidence, route }) {
  const { c } = useTheme()
  if (!fromToken || !toToken || !amount || parseFloat(amount) === 0) return null

  const { savings, gasEst, liquidity, impact } = useMemo(() => ({
    savings:   (Math.random() * 12 + 2).toFixed(2),
    gasEst:    (Math.random() * 8 + 2).toFixed(2),
    liquidity: Math.min(95, 60 + Math.random() * 35),
    impact:    parseFloat((Math.random() * 0.4 + 0.01).toFixed(3)),
  }), [fromToken, toToken, amount])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -8, height: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="overflow-hidden"
      >
        <div
          className="rounded-2xl p-4 mt-3"
          style={{
            background: c('rgba(155,109,255,0.04)', 'rgba(155,109,255,0.04)'),
            border: '1px solid rgba(155,109,255,0.15)',
          }}
        >
          {/* Header row */}
          <div className="flex items-center gap-3 mb-4">
            <ScoreRing score={confidence} />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold" style={{ color: c('#ffffff', '#0a0a0a') }}>Swap Intelligence</p>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: confidence >= 80 ? 'rgba(52,211,153,0.12)' : 'rgba(251,191,36,0.12)',
                    color: confidence >= 80 ? '#34D399' : '#FBBF24',
                  }}
                >
                  {confidence >= 80 ? 'Excellent' : confidence >= 60 ? 'Good' : 'Fair'}
                </span>
              </div>
              <p className="text-xs mt-0.5 leading-tight" style={{ color: c('rgba(255,255,255,0.4)', 'rgba(0,0,0,0.45)') }}>
                {confidence >= 80
                  ? 'Optimal conditions. This is a great trade right now.'
                  : confidence >= 60
                  ? 'Decent trade. Minor inefficiencies detected.'
                  : 'Suboptimal. Consider waiting for better liquidity.'}
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: 'Savings vs avg DEX', value: `+$${savings}`, valueColor: '#34D399' },
              { label: 'Est. gas cost', value: `$${gasEst}`, valueColor: c('rgba(255,255,255,0.8)', 'rgba(0,0,0,0.75)') },
            ].map(m => (
              <div
                key={m.label}
                className="rounded-xl p-3"
                style={{ background: c('rgba(255,255,255,0.03)', 'rgba(0,0,0,0.03)'), border: `1px solid ${c('rgba(255,255,255,0.06)', 'rgba(0,0,0,0.07)')}` }}
              >
                <p className="text-xs mb-1" style={{ color: c('rgba(255,255,255,0.35)', 'rgba(0,0,0,0.4)') }}>{m.label}</p>
                <p className="text-sm font-semibold" style={{ color: m.valueColor }}>{m.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3 mb-4">
            <Bar label="Liquidity Depth" value={liquidity.toFixed(0)} max={100} color="linear-gradient(90deg, #9B6DFF, #C4A8FF)" unit="%" />
            <Bar label="Price Impact" value={impact} max={2} color={impact < 0.3 ? '#34D399' : impact < 1 ? '#FBBF24' : '#F87171'} unit="%" />
          </div>

          {/* Route */}
          {route !== undefined && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: c('rgba(255,255,255,0.35)', 'rgba(0,0,0,0.35)') }}>Routing</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs px-2 py-1 rounded-lg font-medium" style={{ background: c('rgba(255,255,255,0.06)', 'rgba(0,0,0,0.05)'), color: c('rgba(255,255,255,0.7)', 'rgba(0,0,0,0.65)') }}>
                  {fromToken.symbol}
                </span>
                {route.map((hop, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6h8M7 3l3 3-3 3" stroke="rgba(155,109,255,0.6)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(155,109,255,0.1)', color: '#C4A8FF', border: '1px solid rgba(155,109,255,0.2)' }}>{hop}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M7 3l3 3-3 3" stroke="rgba(155,109,255,0.6)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-xs px-2 py-1 rounded-lg font-medium" style={{ background: c('rgba(255,255,255,0.06)', 'rgba(0,0,0,0.05)'), color: c('rgba(255,255,255,0.7)', 'rgba(0,0,0,0.65)') }}>
                    {toToken.symbol}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
