import { Link } from 'react-router-dom'
import { Phone, Mail, Instagram, Linkedin, Youtube, Facebook } from 'lucide-react'

const CATEGORIAS = [
  ['Mini escavadeiras',      '/maquinas?category=mini_escavadeira'],
  ['Mini pás carregadeiras', '/maquinas?category=mini_pa_carregadeira'],
  ['Mini retroescavadeiras', '/maquinas?category=mini_retroescavadeira'],
  ['Ver todas as máquinas',  '/maquinas'],
]

const INSTITUCIONAL = [
  ['Sobre a Miniusadas', '/sobre'],
  ['Contato / FAQ',      '/contato'],
  ['Acesso concessionária', '/entrar'],
]

const SOCIAL = [Instagram, Facebook, Linkedin, Youtube]

export default function Footer() {
  return (
    <footer className="bg-yanmar-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Marca */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <span className="text-yanmar-red font-extrabold tracking-tight text-lg leading-none">YANMAR</span>
              <span className="flex items-center pl-3 border-l border-white/20">
                <span className="font-bold text-white text-[0.88rem]">Mini</span>
                <span className="font-normal text-yanmar-red text-[0.88rem]">usadas</span>
              </span>
            </Link>
            <p className="text-white/50 text-[0.8rem] leading-relaxed mb-4">
              O marketplace oficial de máquinas compactas usadas da rede autorizada YANMAR.
            </p>
            <div className="space-y-2">
              <a href="tel:08007227777" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[0.78rem]">
                <Phone size={12} className="text-yanmar-red" /> 0800 722 7777
              </a>
              <a href="mailto:miniusadas@yanmar.com.br" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[0.78rem]">
                <Mail size={12} className="text-yanmar-red" /> miniusadas@yanmar.com.br
              </a>
            </div>
            <div className="flex items-center gap-2 mt-4">
              {SOCIAL.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-white/[0.08] hover:bg-yanmar-red transition-colors"
                >
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {/* Categorias */}
          <div>
            <p className="text-white text-[0.78rem] font-bold uppercase tracking-wider mb-3">Máquinas</p>
            <ul className="space-y-2">
              {CATEGORIAS.map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-white/50 hover:text-white transition-colors text-[0.8rem]">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <p className="text-white text-[0.78rem] font-bold uppercase tracking-wider mb-3">Institucional</p>
            <ul className="space-y-2">
              {INSTITUCIONAL.map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-white/50 hover:text-white transition-colors text-[0.8rem]">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Box concessionária */}
          <div>
            <p className="text-white text-[0.78rem] font-bold uppercase tracking-wider mb-3">Rede autorizada</p>
            <p className="text-white/50 text-[0.8rem] leading-relaxed mb-4">
              O cadastro de anúncios é exclusivo para concessionárias autorizadas YANMAR.
            </p>
            <div className="p-4 rounded-lg bg-yanmar-red/[0.15] border border-yanmar-red/30">
              <p className="text-white/80 text-[0.75rem] font-semibold mb-2">É concessionária YANMAR?</p>
              <Link
                to="/entrar"
                className="block text-center bg-yanmar-red text-white px-3 py-1.5 rounded-sm text-[0.75rem] font-bold hover:bg-yanmar-red-dark transition-colors"
              >
                Acessar painel
              </Link>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/30 text-[0.72rem]">
            © {new Date().getFullYear()} YANMAR Miniusadas. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            {['Privacidade', 'Termos de Uso', 'Cookies'].map(item => (
              <a key={item} href="#" className="text-white/30 hover:text-white/60 transition-colors text-[0.72rem]">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
