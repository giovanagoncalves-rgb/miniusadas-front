import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Search, Phone } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const NAV = [
  { label: 'Início',             href: '/' },
  { label: 'Máquinas',           href: '/maquinas' },
  { label: 'Sobre a Miniusadas', href: '/sobre' },
  { label: 'Contato',            href: '/contato' },
]

function Wordmark() {
  return (
    <Link to="/" className="flex items-center gap-3 flex-shrink-0">
      <span className="text-yanmar-red font-extrabold tracking-tight text-lg leading-none">YANMAR</span>
      <span className="flex items-center pl-3 border-l border-yanmar-border">
        <span className="font-bold text-yanmar-dark text-[0.95rem] tracking-tight">Mini</span>
        <span className="font-normal text-yanmar-red text-[0.95rem]">usadas</span>
      </span>
    </Link>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const panelPath = isAdmin ? '/admin' : '/painel'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const submitSearch = (e) => {
    e.preventDefault()
    navigate(`/maquinas${q ? `?q=${encodeURIComponent(q)}` : ''}`)
    setOpen(false)
  }

  const isActive = (href) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href)

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Barra utilitária */}
      <div className="bg-yanmar-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-8 flex items-center justify-between">
          <span className="text-white/60 text-[0.72rem] hidden sm:block">
            Marketplace oficial de máquinas compactas usadas da rede autorizada YANMAR
          </span>
          <div className="flex items-center gap-4 text-[0.72rem]">
            <Link to="/entrar" className="text-white/60 hover:text-white transition-colors">
              Acesso concessionária
            </Link>
            <span className="text-white/20">|</span>
            <a href="tel:08007227777" className="text-white/60 hover:text-white transition-colors flex items-center gap-1">
              <Phone size={11} /> 0800 722 7777
            </a>
          </div>
        </div>
      </div>

      {/* Nav principal */}
      <div className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 h-16">
          <Wordmark />

          {/* Busca desktop */}
          <form
            onSubmit={submitSearch}
            className="hidden lg:flex flex-1 max-w-md items-center gap-2 bg-yanmar-gray border border-yanmar-border rounded-sm px-3 py-2 focus-within:border-yanmar-red transition-colors"
          >
            <Search size={15} className="text-gray-400" />
            <input
              type="text"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Buscar por modelo, categoria..."
              className="flex-1 bg-transparent outline-none text-gray-700 text-[0.85rem]"
            />
          </form>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-5">
            {NAV.map(item => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-[0.83rem] py-1 border-b-2 transition-colors ${
                  isActive(item.href)
                    ? 'font-bold text-yanmar-red border-yanmar-red'
                    : 'font-medium text-gray-600 border-transparent hover:text-yanmar-red'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth desktop */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {user ? (
              <>
                <Link to={panelPath} className="text-[0.82rem] font-medium text-gray-600 hover:text-yanmar-red transition-colors">
                  {isAdmin ? 'Painel Admin' : 'Meu painel'}
                </Link>
                <button onClick={handleLogout} className="text-[0.82rem] text-gray-400 hover:text-yanmar-red transition-colors">
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/entrar"
                className="inline-flex items-center bg-yanmar-red text-white px-4 py-2 rounded-sm text-[0.82rem] font-bold hover:bg-yanmar-red-dark transition-colors"
              >
                Entrar
              </Link>
            )}
          </div>

          {/* Toggle mobile */}
          <button className="lg:hidden p-2 text-gray-700" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="lg:hidden border-t border-yanmar-border bg-white px-4 py-3">
          <form onSubmit={submitSearch} className="flex items-center gap-2 bg-yanmar-gray border border-yanmar-border rounded-sm px-3 py-2 mb-3">
            <Search size={15} className="text-gray-400" />
            <input
              type="text"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Buscar máquinas..."
              className="flex-1 bg-transparent outline-none text-[0.85rem]"
            />
          </form>
          {NAV.map(item => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 border-b border-gray-50 text-gray-700 text-[0.9rem]"
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <div className="mt-3 flex flex-col gap-2">
              <Link to={panelPath} onClick={() => setOpen(false)} className="text-yanmar-red font-medium text-[0.9rem]">
                {isAdmin ? 'Painel Admin' : 'Meu painel'}
              </Link>
              <button onClick={handleLogout} className="text-left text-gray-400 text-[0.9rem]">Sair</button>
            </div>
          ) : (
            <Link
              to="/entrar"
              onClick={() => setOpen(false)}
              className="mt-3 block text-center bg-yanmar-red text-white py-3 rounded-sm text-[0.9rem] font-bold"
            >
              Entrar
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
