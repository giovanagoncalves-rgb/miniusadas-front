import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Search, MapPin, Tag, Tractor, ArrowRight,
  ShieldCheck, CheckCircle2, Users, BarChart3,
} from 'lucide-react'
import { useFetch } from '@/hooks/useFetch'
import { listingsApi } from '@/api'
import MachineCard from '@/components/shared/MachineCard'
import { Spinner } from '@/components/ui'
import { MOCK_LISTINGS } from '@/utils/mockListings'

const CATEGORIES = [
  { value: '',                      label: 'Categoria' },
  { value: 'mini_escavadeira',      label: 'Mini escavadeira' },
  { value: 'mini_pa_carregadeira',  label: 'Mini pá carregadeira' },
  { value: 'mini_retroescavadeira', label: 'Mini retroescavadeira' },
]

const REGIONS = [
  { value: '',             label: 'Localização' },
  { value: 'Sul',          label: 'Sul' },
  { value: 'Sudeste',      label: 'Sudeste' },
  { value: 'Centro-Oeste', label: 'Centro-Oeste' },
  { value: 'Nordeste',     label: 'Nordeste' },
  { value: 'Norte',        label: 'Norte' },
]

const PRICES = [
  { value: '',                    label: 'Faixa de preço' },
  { value: '0-50000',             label: 'Até R$ 50.000' },
  { value: '50000-150000',        label: 'R$ 50.000 – R$ 150.000' },
  { value: '150000-400000',       label: 'R$ 150.000 – R$ 400.000' },
  { value: '400000-',             label: 'Acima de R$ 400.000' },
]

const STATS = [
  { value: '2.400+', label: 'Máquinas disponíveis' },
  { value: '340+',   label: 'Concessionárias' },
  { value: '98%',    label: 'Clientes satisfeitos' },
]

const BENEFITS = [
  { icon: ShieldCheck,  title: 'Procedência garantida', description: 'Todas as máquinas são listadas por concessionárias YANMAR autorizadas, com histórico completo.' },
  { icon: CheckCircle2, title: 'Inspeção técnica',      description: 'Laudos técnicos e relatórios de revisão disponíveis antes da compra.' },
  { icon: Users,        title: 'Suporte dedicado',      description: 'Nossa equipe acompanha todo o processo até a conclusão da negociação.' },
  { icon: BarChart3,    title: 'Preço justo',           description: 'Preços de mercado baseados em avaliação técnica e valores de referência YANMAR.' },
]

const STEPS = [
  { number: '01', title: 'Busque sua máquina',   description: 'Use os filtros para encontrar exatamente o modelo, região e faixa de preço que você precisa.' },
  { number: '02', title: 'Analise os detalhes',  description: 'Confira a galeria de fotos, especificações técnicas e os dados da concessionária responsável.' },
  { number: '03', title: 'Demonstre interesse',  description: 'Preencha o formulário e fale direto com a concessionária autorizada pelo equipamento.' },
  { number: '04', title: 'Feche o negócio',      description: 'Com segurança e transparência, conclua a compra diretamente com a rede autorizada.' },
]

export default function Home() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({ category: '', region: '', price: '' })

  const { data: featured, loading } = useFetch(() => listingsApi.list({ limit: 6 }))

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.region)   params.set('region', filters.region)
    if (filters.price) {
      const [min, max] = filters.price.split('-')
      if (min) params.set('price_min', min)
      if (max) params.set('price_max', max)
    }
    const qs = params.toString()
    navigate(`/maquinas${qs ? '?' + qs : ''}`)
  }

  // Usa os dados reais da API; se não houver, cai para as máquinas de exemplo.
  const featuredList = featured?.data?.length ? featured.data : MOCK_LISTINGS

  return (
    <div>
      {/* ── Hero ──────────────────────────────── */}
      <section
        className="relative w-full"
        style={{ background: 'linear-gradient(135deg, #1C1C1C 0%, #2D2D2D 60%, #3D1A1A 100%)', minHeight: '480px' }}
      >
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: "url('/img/hero.jpg')" }}
        />

        <div className="relative max-w-5xl mx-auto px-6 py-16 flex flex-col items-center text-center">
          <span className="inline-block bg-yanmar-red text-white px-3 py-1 rounded-full mb-5 text-[0.72rem] font-bold uppercase tracking-wider">
            Marketplace Oficial YANMAR
          </span>

          <h1 className="text-white mb-3 font-extrabold leading-[1.15] tracking-tight text-[2rem] md:text-[2.5rem]">
            Encontre a sua máquina<br />compacta com segurança
          </h1>
          <p className="text-white/70 mb-10 text-base leading-relaxed max-w-[520px]">
            Mini escavadeiras, pás carregadeiras e retroescavadeiras usadas, com procedência garantida da rede de concessionárias autorizadas YANMAR.
          </p>

          {/* Card de busca */}
          <form onSubmit={handleSearch} className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="flex flex-col sm:flex-row items-stretch">
              <label className="flex-1 flex items-center gap-2 px-4 py-3.5 border-b sm:border-b-0 sm:border-r border-gray-100">
                <Tractor size={16} className="text-gray-400 flex-shrink-0" />
                <select
                  value={filters.category}
                  onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
                  className="flex-1 bg-transparent outline-none text-gray-700 text-[0.875rem]"
                >
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </label>

              <label className="flex-1 flex items-center gap-2 px-4 py-3.5 border-b sm:border-b-0 sm:border-r border-gray-100">
                <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                <select
                  value={filters.region}
                  onChange={e => setFilters(f => ({ ...f, region: e.target.value }))}
                  className="flex-1 bg-transparent outline-none text-gray-700 text-[0.875rem]"
                >
                  {REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </label>

              <label className="flex-1 flex items-center gap-2 px-4 py-3.5 border-b sm:border-b-0 sm:border-r border-gray-100">
                <Tag size={16} className="text-gray-400 flex-shrink-0" />
                <select
                  value={filters.price}
                  onChange={e => setFilters(f => ({ ...f, price: e.target.value }))}
                  className="flex-1 bg-transparent outline-none text-gray-700 text-[0.875rem]"
                >
                  {PRICES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </label>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-yanmar-red text-white font-bold text-[0.9rem] min-w-[140px] hover:bg-yanmar-red-dark transition-colors"
              >
                <Search size={16} /> Buscar
              </button>
            </div>
          </form>

          {/* Estatísticas */}
          <div className="flex items-center gap-8 mt-8">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-white font-extrabold text-[1.2rem]">{s.value}</div>
                <div className="text-white/50 text-[0.72rem]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Máquinas em destaque ──────────────── */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-7">
            <div>
              <p className="text-yanmar-red text-[0.75rem] font-bold uppercase tracking-widest mb-1">Máquinas em destaque</p>
              <h2 className="text-yanmar-dark font-bold text-[1.6rem]">Equipamentos mais recentes</h2>
            </div>
            <Link to="/maquinas" className="hidden md:flex items-center gap-1 text-yanmar-red hover:text-yanmar-red-dark transition-colors text-[0.85rem] font-semibold">
              Ver todas as máquinas <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Spinner /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredList.map(l => <MachineCard key={l.id} listing={l} />)}
            </div>
          )}

          <div className="text-center mt-7">
            <Link
              to="/maquinas"
              className="inline-flex items-center gap-2 border border-yanmar-red text-yanmar-red px-7 py-2.5 rounded-sm hover:bg-yanmar-red hover:text-white transition-all text-[0.875rem] font-semibold"
            >
              Ver catálogo completo <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Benefícios ────────────────────────── */}
      <section className="bg-yanmar-gray py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <p className="text-yanmar-red text-[0.75rem] font-bold uppercase tracking-widest mb-1">Por que a Miniusadas</p>
            <h2 className="text-yanmar-dark font-bold text-[1.6rem]">Benefícios da plataforma</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BENEFITS.map(b => {
              const Icon = b.icon
              return (
                <div key={b.title} className="bg-white p-6 rounded-xl border border-yanmar-border hover:border-yanmar-red/20 hover:shadow-sm transition-all">
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-4 bg-yanmar-red/[0.08]">
                    <Icon size={20} className="text-yanmar-red" />
                  </div>
                  <h3 className="text-yanmar-dark font-bold text-[0.95rem] mb-2">{b.title}</h3>
                  <p className="text-gray-500 text-[0.83rem] leading-relaxed">{b.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Como funciona ─────────────────────── */}
      <section className="bg-yanmar-dark py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-yanmar-red text-[0.75rem] font-bold uppercase tracking-widest mb-1">Passo a passo</p>
            <h2 className="text-white font-bold text-[1.6rem]">Como funciona</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {STEPS.map((step, i) => (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-yanmar-red flex-shrink-0">
                  <span className="text-white font-extrabold text-[1.1rem]">{step.number}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[calc(50%+28px)] w-[calc(100%-56px)] h-0.5 bg-yanmar-red/30" />
                )}
                <h3 className="text-white font-bold text-[0.95rem] mb-2">{step.title}</h3>
                <p className="text-white/55 text-[0.82rem] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTAs ──────────────────────────────── */}
      <section className="bg-yanmar-gray py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Comprador */}
          <div
            className="rounded-xl overflow-hidden relative flex items-end p-8 min-h-[260px]"
            style={{
              backgroundImage: "url('/img/cta-comprador.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.75) 100%)' }} />
            <div className="relative">
              <p className="text-white/80 text-[0.8rem] font-semibold uppercase tracking-wider mb-1">Para compradores</p>
              <h3 className="text-white font-extrabold text-[1.4rem] mb-4 leading-tight">Encontre a máquina<br />ideal para seu negócio</h3>
              <Link
                to="/maquinas"
                className="inline-flex items-center gap-2 bg-yanmar-red text-white px-5 py-2.5 rounded-sm hover:bg-yanmar-red-dark transition-colors text-[0.875rem] font-bold"
              >
                Ver equipamentos <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Concessionária (acesso restrito, sem CTA público de anunciar) */}
          <div className="rounded-xl p-8 flex flex-col justify-between bg-yanmar-red min-h-[260px]">
            <div>
              <p className="text-white/80 text-[0.8rem] font-semibold uppercase tracking-wider mb-1">Para concessionárias</p>
              <h3 className="text-white font-extrabold text-[1.4rem] mb-3 leading-tight">Gerencie seus anúncios<br />no painel exclusivo</h3>
              <p className="text-white/80 text-[0.875rem] leading-relaxed mb-6">
                O cadastro de máquinas é restrito às concessionárias autorizadas YANMAR. Acesse com suas credenciais para publicar e gerenciar anúncios.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/entrar"
                className="inline-flex items-center gap-2 bg-white text-yanmar-red px-5 py-2.5 rounded-sm hover:bg-gray-100 transition-colors text-[0.875rem] font-bold"
              >
                Acessar painel <ArrowRight size={14} />
              </Link>
              <Link to="/sobre" className="text-white/80 hover:text-white transition-colors text-[0.83rem] font-medium">
                Saiba mais
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
