import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { user, logout, isAdmin, isDealer } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const panelPath = isAdmin ? '/admin' : '/painel'

  return (
    <header className="bg-white border-b border-yanmar-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yanmar-red rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">M</span>
          </div>
          <span className="font-semibold text-yanmar-dark text-sm">
            Mini<span className="text-yanmar-red">usadas</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/maquinas" className="text-gray-600 hover:text-yanmar-red transition">Máquinas</Link>
          <Link to="/sobre"    className="text-gray-600 hover:text-yanmar-red transition">Sobre</Link>
          <Link to="/contato"  className="text-gray-600 hover:text-yanmar-red transition">Contato</Link>
        </nav>

        {/* Auth desktop */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                to={panelPath}
                className="text-sm text-gray-600 hover:text-yanmar-red transition"
              >
                {isAdmin ? 'Painel Admin' : 'Meu painel'}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-red-600 transition"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/entrar"
              className="text-sm bg-yanmar-red text-white px-4 py-2 rounded-lg hover:bg-yanmar-red-dark transition"
            >
              Entrar
            </Link>
          )}
        </div>

        {/* Hamburger mobile */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Nav mobile */}
      {open && (
        <div className="md:hidden border-t border-yanmar-border bg-white px-4 py-3 flex flex-col gap-3 text-sm">
          <Link to="/maquinas" onClick={() => setOpen(false)} className="text-gray-700">Máquinas</Link>
          <Link to="/sobre"    onClick={() => setOpen(false)} className="text-gray-700">Sobre</Link>
          <Link to="/contato"  onClick={() => setOpen(false)} className="text-gray-700">Contato</Link>
          {user
            ? <><Link to={panelPath} onClick={() => setOpen(false)} className="text-yanmar-red font-medium">{isAdmin ? 'Painel Admin' : 'Meu painel'}</Link>
                <button onClick={handleLogout} className="text-left text-gray-400">Sair</button></>
            : <Link to="/entrar" onClick={() => setOpen(false)} className="text-yanmar-red font-medium">Entrar</Link>
          }
        </div>
      )}
    </header>
  )
}
