import { useTheme } from '../context/ThemeContext'

export default function AnimatedBackground() {
  const { c } = useTheme()

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Deep gradient: rich purple/indigo at top → pure black/off-white at bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: c(
            'linear-gradient(180deg, rgba(55,25,110,0.28) 0%, rgba(30,10,80,0.18) 22%, rgba(15,5,45,0.10) 42%, transparent 65%)',
            'linear-gradient(180deg, rgba(155,109,255,0.09) 0%, rgba(110,65,210,0.05) 25%, rgba(80,40,180,0.02) 45%, transparent 65%)'
          ),
        }}
      />

      {/* Subtle vignette: deep indigo edge glow at top corners */}
      <div
        className="absolute inset-0"
        style={{
          background: c(
            'radial-gradient(ellipse 100% 55% at 50% -5%, rgba(80,35,160,0.22) 0%, transparent 70%)',
            'radial-gradient(ellipse 100% 55% at 50% -5%, rgba(155,109,255,0.07) 0%, transparent 70%)'
          ),
        }}
      />

      {/* Grid texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          opacity: 'var(--grid-opacity)',
        }}
      />

      {/* Subtle noise */}
      <div
        className="absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />
    </div>
  )
}
