# CLAUDE.md

This file fully briefs Claude Code on the my-dex project. Read this before making any changes.

## Project Context

my-dex is a **portfolio piece** by Dinesh Kothapalli, a 23-year-old HCI Master's student at Northeastern (graduating April 2026). Goal: land a full-time Web3/DeFi product designer role at Coinbase, MetaMask, or ZetaChain. This is project 1 of 4.

**Design thesis:** "my-dex is the first DEX designed for humans, not crypto natives."

**Design language:** Apple meets Bloomberg Terminal — glassmorphism, `#080808` bg, `#9B6DFF` accent, Inter font.

## Commands
```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint via next lint
```

No test suite configured.

## Stack

- Next.js (Pages Router, NO TypeScript)
- Tailwind CSS
- Framer Motion (all animations)
- No real blockchain — swaps are fully simulated

## Architecture

**Entry points:**
- `src/pages/_app.js` — wraps everything in `ThemeProvider`
- `src/pages/index.js` — composes `NavBar`, `Ticker`, `AnimatedBackground`, `SwapCard`, `ConnectWalletModal`

**Component map:**
- `SwapCard.js` — master component, owns all swap state
- `TokenSelectorModal.js` — token search + quick-select
- `SlippageControl.js` — slider with plain-English explanations
- `SwapIntelligencePanel.js` — animated confidence ring + metric bars
- `PreflightModal.js` — pre-swap confirmation
- `TransactionModal.js` — post-swap success/error overlay
- `ConnectWalletModal.js` — wallet picker (simulated)
- `AnimatedBackground.js` — fixed grid + gradient bg
- `context/ThemeContext.js` — dark/light theme system

## Theme System — CRITICAL

- `useTheme()` exposes `{ isDark, toggle, c }`
- `c(darkVal, lightVal)` — ALWAYS use this for colors, never hardcode hex in components
- NEVER use Tailwind `text-white` or `text-black` — use `style={{ color: c('#ffffff', '#0a0a0a') }}`
- CSS vars (`--nav-bg`, `--nav-border`, `--grid-line`, etc.) handle structural colors in `globals.css`
- Theme persisted to `localStorage` as `'dex-theme'`, applied as `data-theme` on `<html>`

## Styling Conventions

- Tailwind for layout/spacing only
- Inline `style={{ }}` via `c()` for all color values
- Framer Motion for ALL animations — no CSS transitions on interactive elements
- Glassmorphism: `backdropFilter: 'blur(24px)'`, semi-transparent backgrounds
- Accent color: `#9B6DFF` (purple), success: `#34D399` (green), error: `#F87171` (red)
- Border radius language: cards = `rounded-3xl`, modals = `rounded-2xl`, buttons = `rounded-xl`

## Known Bugs to Fix

### BUG 1 — NaN ETH on success screen (PRIORITY)
**File:** `src/components/SwapCard.js`
**Cause:** `handleSwap` clears `fromAmount`/`toAmount` state BEFORE passing them to `setTxModal`. `TransactionModal` then receives empty strings and `parseFloat('')` = NaN.
**Fix:** Snapshot the amounts into local variables before clearing, pass snapshots into `setTxModal`, and use `txModal.fromAmount`/`txModal.toAmount` as props in the `TransactionModal` render.

### BUG 2 — Hardcoded text-white
**Files:** `ConnectWalletModal.js`, `TransactionModal.js`
**Cause:** Several elements use `className="... text-white"` instead of `style={{ color: c('#ffffff', '#0a0a0a') }}`
**Fix:** Find all `text-white` instances in these two files and replace with proper `c()` calls.

### BUG 3 — Random values flicker on re-render
**Files:** `SwapIntelligencePanel.js`, `PreflightModal.js`, `TransactionModal.js`
**Cause:** `Math.random()` calls are at render level — they recalculate every re-render, causing numbers to jump.
**Fix:** Wrap in `useMemo` with `[fromToken, toToken, amount]` as deps in SwapIntelligencePanel; use `useMemo` with `[]` in PreflightModal and TransactionModal (stable per open).

## Swap Flow

1. User enters amount in `SwapCard` → output calculated via price ratio
2. Validation runs → shows `ValidationBanner` if insufficient balance
3. User clicks "Preview Swap" → `PreflightModal` opens
4. User confirms → `handleSwap` runs (2.2s simulated delay)
5. 85% chance success, 15% chance error → `TransactionModal` opens
6. Success: amounts cleared, modal shows final trade summary
7. Error: retry button re-opens PreflightModal

## Animation Principles

- Entry animations: `opacity 0→1`, `y 20→0`, spring physics preferred
- Use `AnimatePresence` for all mount/unmount transitions
- Stagger children with `delay: i * 0.06` for lists
- Interactive elements: `whileHover={{ scale: 1.02 }}`, `whileTap={{ scale: 0.97 }}`
- Loading states: rotating border spinner via `animate={{ rotate: 360 }}`

## What NOT to Do

- No TypeScript — this is plain JS
- No backend calls — everything is simulated
- No hardcoded colors — always `c()`
- No CSS transitions on Framer Motion elements
- No new dependencies without asking first
