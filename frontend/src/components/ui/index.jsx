import { useState, useEffect } from 'react'

// ── Button ───────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', loading, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary:   'bg-yanmar-red text-white hover:bg-yanmar-red-dark',
    secondary: 'bg-white text-yanmar-dark border border-yanmar-border hover:bg-yanmar-gray',
    ghost:     'text-yanmar-dark hover:bg-yanmar-gray',
    danger:    'bg-red-600 text-white hover:bg-red-700',
  }
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' }
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && <span className="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  )
}

// ── Input ────────────────────────────────────
export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        className={`border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yanmar-red/30 focus:border-yanmar-red transition ${error ? 'border-red-500' : 'border-yanmar-border'} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

// ── Textarea ─────────────────────────────────
export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <textarea
        className={`border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yanmar-red/30 focus:border-yanmar-red transition resize-none ${error ? 'border-red-500' : 'border-yanmar-border'} ${className}`}
        rows={4}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

// ── Select ───────────────────────────────────
export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <select
        className={`border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yanmar-red/30 focus:border-yanmar-red transition bg-white ${error ? 'border-red-500' : 'border-yanmar-border'} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

// ── Badge ────────────────────────────────────
export function Badge({ children, className = '' }) {
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${className}`}>
      {children}
    </span>
  )
}

// ── Card ─────────────────────────────────────
export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border border-yanmar-border rounded-xl p-6 ${className}`}>
      {children}
    </div>
  )
}

// ── Spinner ──────────────────────────────────
export function Spinner({ className = '' }) {
  return (
    <div className={`w-8 h-8 border-4 border-yanmar-red/20 border-t-yanmar-red rounded-full animate-spin ${className}`} />
  )
}

// ── Toast simples ─────────────────────────────
const toastListeners = []
export const toast = {
  success: (msg) => toastListeners.forEach(fn => fn({ msg, type: 'success' })),
  error:   (msg) => toastListeners.forEach(fn => fn({ msg, type: 'error' })),
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([])
  useEffect(() => {
    const handler = (t) => {
      const id = Date.now()
      setToasts(p => [...p, { ...t, id }])
      setTimeout(() => setToasts(p => p.filter(x => x.id !== id)), 4000)
    }
    toastListeners.push(handler)
    return () => { const i = toastListeners.indexOf(handler); if (i > -1) toastListeners.splice(i, 1) }
  }, [])
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className={`px-4 py-3 rounded-lg text-sm text-white shadow-lg ${t.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {t.msg}
        </div>
      ))}
    </div>
  )
}

// ── Modal ─────────────────────────────────────
export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Empty state ───────────────────────────────
export function Empty({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
      <div className="text-5xl mb-3">{icon || '📭'}</div>
      <p className="font-medium text-gray-600">{title}</p>
      {description && <p className="text-sm mt-1">{description}</p>}
    </div>
  )
}
