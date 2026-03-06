import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const PRESETS = [0.1, 0.5, 1.0]

function getSlippageInfo(value) {
  if (value <= 0.1) return { label: 'Ultra Safe',  desc: 'May fail on volatile markets', color: '#60A5FA', emoji: '🛡️' }
  if (value <= 0.5) return { label: 'Balanced',    desc: 'Recommended for most trades',  color: '#34D399', emoji: '⚡' }
  if (value <= 1.0) return { label: 'Standard',    desc: 'Good for moderate conditions', color: '#A78BFA', emoji: '✓'  }
  if (value <= 2.0) return { label: 'Aggressive',  desc: 'Higher front-run risk',        color: '#FBBF24', emoji: '⚠️' }
  return               { label: 'Danger Zone', desc: 'Very likely to be front-run',  color: '#F87171', emoji: '🚨' }
}

export default function SlippageControl({ slippage, onChange }) {
  const { c } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [customInput, setCustomInput] = useState('')
  const info = getSlippageInfo(slippage)
  const sliderPercent = Math.min((slippage / 5) * 100, 100)

  const handleSlider = (e) => { onChange(parseFloat(e.target.value)); setCustomInput('') }
  const handleCustom = (e) => {
    const val = e.target.value
    setCustomInput(val)
    const num = parseFloat(val)
    if (!isNaN(num) && num > 0 && num <= 50) onChange(num)
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs transition-all"
        style={{ color: c('rgba(255,255,255,0.45)', 'rgba(0,0,0,0.45)') }}
        onMouseEnter={e => e.currentTarget.style.color = c('rgba(255,255,255,0.75)', 'rgba(0,0,0,0.7)')}
        onMouseLeave={e => e.currentTarget.style.color = c('rgba(255,255,255,0.45)', 'rgba(0,0,0,0.45)')}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M6 4v3M6 8.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <span>Slippage: </span>
        <span style={{ color: info.color }} className="font-semibold">{slippage}%</span>
        <span style={{ color: info.color }}>{info.emoji}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div
              className="mt-3 p-4 rounded-xl"
              style={{ background: c('rgba(255,255,255,0.03)', 'rgba(0,0,0,0.03)'), border: `1px solid ${c('rgba(255,255,255,0.07)', 'rgba(0,0,0,0.07)')}` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: c('rgba(255,255,255,0.7)', 'rgba(0,0,0,0.7)') }}>Slippage Tolerance</p>
                  <p className="text-xs mt-0.5" style={{ color: c('rgba(255,255,255,0.35)', 'rgba(0,0,0,0.4)') }}>Max price change you&apos;ll accept</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold" style={{ color: info.color }}>{info.emoji} {info.label}</span>
                  <p className="text-xs mt-0.5 max-w-[140px] text-right leading-tight" style={{ color: c('rgba(255,255,255,0.35)', 'rgba(0,0,0,0.4)') }}>{info.desc}</p>
                </div>
              </div>

              {/* Presets */}
              <div className="flex gap-2 mb-4">
                {PRESETS.map(preset => (
                  <button
                    key={preset}
                    onClick={() => { onChange(preset); setCustomInput('') }}
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: slippage === preset ? 'rgba(155,109,255,0.2)' : c('rgba(255,255,255,0.05)', 'rgba(0,0,0,0.04)'),
                      border: `1px solid ${slippage === preset ? 'rgba(155,109,255,0.5)' : c('rgba(255,255,255,0.08)', 'rgba(0,0,0,0.08)')}`,
                      color: slippage === preset ? '#C4A8FF' : c('rgba(255,255,255,0.5)', 'rgba(0,0,0,0.5)'),
                    }}
                  >
                    {preset}%
                  </button>
                ))}
                {/* Custom */}
                <div
                  className="flex-1 flex items-center px-2 rounded-lg"
                  style={{
                    background: customInput ? 'rgba(155,109,255,0.1)' : c('rgba(255,255,255,0.05)', 'rgba(0,0,0,0.04)'),
                    border: `1px solid ${customInput ? 'rgba(155,109,255,0.4)' : c('rgba(255,255,255,0.08)', 'rgba(0,0,0,0.08)')}`,
                  }}
                >
                  <input
                    type="number" placeholder="Custom" value={customInput} onChange={handleCustom}
                    className="w-full bg-transparent text-xs outline-none text-center"
                    style={{ color: customInput ? '#C4A8FF' : c('rgba(255,255,255,0.4)', 'rgba(0,0,0,0.4)') }}
                    min="0.01" max="50" step="0.1"
                  />
                  {customInput && <span className="text-xs ml-0.5" style={{ color: c('rgba(255,255,255,0.4)', 'rgba(0,0,0,0.4)') }}>%</span>}
                </div>
              </div>

              {/* Slider */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-2" style={{ color: c('rgba(255,255,255,0.25)', 'rgba(0,0,0,0.3)') }}>
                  <span>🛡️ Safe</span>
                  <span>⚡ Fast</span>
                </div>
                <div className="relative">
                  <div
                    className="absolute top-1/2 left-0 h-1 rounded-full -translate-y-1/2 pointer-events-none transition-all"
                    style={{ width: `${sliderPercent}%`, background: `linear-gradient(90deg, #60A5FA, ${info.color})` }}
                  />
                  <input type="range" min="0.05" max="5" step="0.05" value={slippage} onChange={handleSlider} className="w-full relative" style={{ position: 'relative', zIndex: 1 }} />
                </div>
              </div>

              {/* Plain English */}
              <motion.div
                key={slippage}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg"
                style={{ background: `${info.color}10`, border: `1px solid ${info.color}25` }}
              >
                <p className="text-xs leading-relaxed" style={{ color: `${info.color}CC` }}>
                  {slippage <= 0.1 && 'Your swap only executes if the price moves less than 0.1%. Very safe, but may fail if the market is moving.'}
                  {slippage > 0.1 && slippage <= 0.5 && `If the price moves up to ${slippage}% while your transaction processes, it still goes through. Sweet spot for most swaps.`}
                  {slippage > 0.5 && slippage <= 1.0 && `You\'ll accept up to ${slippage}% worse price than quoted. Good for larger trades or volatile tokens.`}
                  {slippage > 1.0 && slippage <= 2.0 && `Warning: at ${slippage}% slippage, MEV bots may sandwich your trade, costing you extra. Only use if lower settings keep failing.`}
                  {slippage > 2.0 && `Danger: ${slippage}% slippage is very high. Bots will likely front-run your trade. Only use for highly illiquid tokens.`}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
