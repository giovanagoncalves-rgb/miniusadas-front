import { Link } from 'react-router-dom'
import { CheckCircle2, ShieldCheck, Users, BarChart3, ArrowRight, Award } from 'lucide-react'

const STEPS = [
  { n: '01', title: 'Busque',  desc: 'Use os filtros para encontrar a máquina certa por categoria, região e faixa de preço.' },
  { n: '02', title: 'Analise', desc: 'Veja fotos, especificações técnicas e informações da concessionária responsável.' },
  { n: '03', title: 'Contate', desc: 'Envie uma mensagem ou ligue diretamente para a concessionária autorizada.' },
  { n: '04', title: 'Negocie', desc: 'Conclua o negócio com segurança e transparência, com o respaldo da rede YANMAR.' },
]

const BENEFITS_BUYER = [
  'Acesso a máquinas verificadas por concessionárias autorizadas YANMAR',
  'Especificações técnicas e histórico de manutenção disponíveis',
  'Fotos reais do equipamento antes da compra',
  'Filtros por categoria, região e faixa de preço',
  'Contato direto com a concessionária responsável',
  'Garantia de procedência e autenticidade dos equipamentos',
]

const BENEFITS_DEALER = [
  'Alcance nacional: expanda suas vendas para todo o Brasil',
  'Plataforma exclusiva YANMAR com público qualificado',
  'Gestão simples de anúncios pelo painel da concessionária',
  'Aprovação da YANMAR antes da publicação de cada anúncio',
  'Notificações automáticas de novos interessados',
  'Suporte dedicado da equipe YANMAR',
]

const SECURITY = [
  { icon: ShieldCheck,  title: 'Concessionárias autorizadas', desc: 'Somente revendedores YANMAR certificados podem anunciar na plataforma.' },
  { icon: CheckCircle2, title: 'Aprovação YANMAR',            desc: 'Cada anúncio passa pela aprovação da YANMAR antes de ser publicado.' },
  { icon: Award,        title: 'Procedência garantida',       desc: 'Equipamentos com origem verificada e padrão de qualidade YANMAR.' },
]

export default function Sobre() {
  return (
    <div className="bg-yanmar-gray min-h-screen">
      {/* Hero */}
      <div className="relative py-16" style={{ background: 'linear-gradient(135deg, #1C1C1C 0%, #2D1A1A 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block bg-yanmar-red text-white px-3 py-1 rounded-full mb-5 text-[0.72rem] font-bold uppercase tracking-wider">
            Sobre a plataforma
          </span>
          <h1 className="text-white font-extrabold text-[1.8rem] md:text-[2.2rem] leading-tight mb-4">
            O que é a Miniusadas YANMAR?
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-base leading-relaxed">
            A Miniusadas é o marketplace oficial da YANMAR para compra e venda de máquinas compactas usadas.
            Uma plataforma segura que conecta compradores às concessionárias autorizadas em todo o Brasil.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-14">
        {/* Como funciona */}
        <section>
          <div className="text-center mb-8">
            <p className="text-yanmar-red text-[0.75rem] font-bold uppercase tracking-widest mb-1">Passo a passo</p>
            <h2 className="text-yanmar-dark font-bold text-[1.6rem]">Como funciona</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {STEPS.map(s => (
              <div key={s.n} className="bg-white rounded-xl p-5 border border-yanmar-border text-center shadow-sm">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-yanmar-red">
                  <span className="text-white font-extrabold">{s.n}</span>
                </div>
                <h3 className="text-yanmar-dark font-bold text-[0.95rem] mb-2">{s.title}</h3>
                <p className="text-gray-500 text-[0.82rem] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefícios compradores */}
        <BenefitBlock icon={Users} title="Benefícios para compradores" items={BENEFITS_BUYER} />

        {/* Benefícios concessionárias */}
        <BenefitBlock icon={BarChart3} title="Benefícios para concessionárias" items={BENEFITS_DEALER} />

        {/* Segurança */}
        <section>
          <div className="text-center mb-6">
            <h2 className="text-yanmar-dark font-bold text-[1.3rem]">Segurança, transparência e procedência</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {SECURITY.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-6 border border-yanmar-border shadow-sm text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-yanmar-red/[0.08]">
                  <Icon size={22} className="text-yanmar-red" />
                </div>
                <h3 className="text-yanmar-dark font-bold text-[0.95rem] mb-2">{title}</h3>
                <p className="text-gray-500 text-[0.82rem] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTAs */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link to="/maquinas" className="flex items-center justify-between bg-white border border-yanmar-border rounded-xl p-6 hover:border-yanmar-red/30 hover:shadow-md transition-all group">
            <div>
              <p className="text-yanmar-dark font-bold text-[1rem] mb-1">Visualizar máquinas disponíveis</p>
              <p className="text-gray-500 text-[0.82rem]">Explore o catálogo completo de equipamentos</p>
            </div>
            <ArrowRight size={20} className="text-yanmar-red group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/entrar" className="flex items-center justify-between rounded-xl p-6 hover:opacity-90 transition-opacity group bg-yanmar-red">
            <div>
              <p className="text-white font-bold text-[1rem] mb-1">Acesso da concessionária</p>
              <p className="text-white/70 text-[0.82rem]">Área exclusiva da rede autorizada YANMAR</p>
            </div>
            <ArrowRight size={20} className="text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>
      </div>
    </div>
  )
}

function BenefitBlock({ icon: Icon, title, items }) {
  return (
    <section className="bg-white rounded-2xl p-8 border border-yanmar-border shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-yanmar-red/[0.08]">
          <Icon size={20} className="text-yanmar-red" />
        </div>
        <h2 className="text-yanmar-dark font-bold text-[1.3rem]">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(b => (
          <div key={b} className="flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-yanmar-red flex-shrink-0 mt-0.5" />
            <p className="text-gray-600 text-[0.85rem] leading-snug">{b}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
