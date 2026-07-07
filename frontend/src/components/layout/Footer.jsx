import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-yanmar-dark text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-yanmar-red rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">M</span>
              </div>
              <span className="text-white font-semibold text-sm">Miniusadas YANMAR</span>
            </div>
            <p className="text-xs leading-relaxed">
              Marketplace oficial de máquinas compactas usadas da rede autorizada YANMAR.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-medium mb-3">Navegação</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/maquinas" className="hover:text-white transition">Máquinas</Link></li>
              <li><Link to="/sobre"    className="hover:text-white transition">Sobre a Miniusadas</Link></li>
              <li><Link to="/contato"  className="hover:text-white transition">Contato / FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-medium mb-3">Concessionárias</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/entrar" className="hover:text-white transition">Acesso ao painel</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-xs text-center">
          © {new Date().getFullYear()} Miniusadas — Rede autorizada YANMAR. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
