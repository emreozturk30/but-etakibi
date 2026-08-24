import { useEffect } from 'react'

export type AppView = 'dashboard' | 'investments' | 'portfolio'

interface NavDrawerProps {
  open: boolean
  view: AppView
  onNavigate: (view: AppView) => void
  onClose: () => void
  onSignOut: () => void
}

export function NavDrawer({ open, view, onNavigate, onClose, onSignOut }: NavDrawerProps) {
  useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  return (
    <div
      className={`nav-drawer-overlay ${open ? 'open' : ''}`}
      onClick={onClose}
      aria-hidden={!open}
    >
      <nav
        className="nav-drawer"
        onClick={(event) => event.stopPropagation()}
        aria-label="Ana menü"
      >
        <button
          type="button"
          className={view === 'dashboard' ? 'active' : ''}
          onClick={() => onNavigate('dashboard')}
        >
          Bütçe Takip
        </button>
        <button
          type="button"
          className={view === 'investments' ? 'active' : ''}
          onClick={() => onNavigate('investments')}
        >
          Yatırımlar
        </button>
        <button
          type="button"
          className={view === 'portfolio' ? 'active' : ''}
          onClick={() => onNavigate('portfolio')}
        >
          Portföy
        </button>
        <button
          type="button"
          className="nav-drawer-signout"
          onClick={onSignOut}
        >
          Çıkış Yap
        </button>
      </nav>
    </div>
  )
}
