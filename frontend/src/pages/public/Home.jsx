import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ShieldCheck, Truck, ThumbsUp } from 'lucide-react'
import { useFetch } from '@/hooks/useFetch'
import { listingsApi } from '@/api'
import MachineCard from '@/components/shared/MachineCard'
import { Button, Select, Spinner } from '@/components/ui'

const CATEGORIES = [
  { value: '',                        label: 'Todas as categorias' },
  { value: 'mini_escavadeira',        label: 'Mini escavadeira' },
  { value: 'mini_pa_carregadeira',    label: 'Mini pá carregadeira' },
  { value: 'mini_retroescavadeira',   label: 'Mini retroescavadeira' },
]

const REGIONS = [
  { value: '', label: 'Todas as regiões' },
  { value: 'Sul',       label: 'Sul' },
  { value: 'Sudeste',   label: 'Sudeste' },
  { value: 'Centro-Oeste', label: 'Centro-Oeste' },
  { value: 'Nordeste',  label: 'Nordeste' },
  { value: 'Norte',     label: 'Norte' },
]

const STEPS = [
  { icon: <Search size={24} />,      title: 'Busque',    desc: 'Filtre por categoria, região e faixa de preço para encontrar o equipamento ideal.' },
  { icon: <ShieldCheck size={24} />, title: 'Confie',    desc: 'Todos os anúncios são de concessionárias autorizadas YANMAR, com procedência garantida.' },
  { icon: <Truck size={24} />,       title: 'Negocie',   desc: 'Entre em contato diretamente com a concessionária responsável pelo equipamento.' },
  { icon: <ThumbsUp size={24} />,    title: 'Adquira',   desc: 'Finalize a compra com segurança diretamente com a rede autorizada YANMAR.' },
]

export default function Home() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({ category: '', region: '' })

  const { data: featured, loading } = useFetch(() => listingsApi.list({ limit: 6 }))

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v)))
    navigate(`/maquinas${params.toString() ? '?' + params : ''}`)
  }

  return (
    <div>
      {/* ── Hero ───────────────────────────────── */}
      <section className="bg-yanmar-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="text-yanmar-red font-medium text-sm mb-2 uppercase tracking-wide">Rede autorizada YANMAR</p>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Encontre a sua<br />máquina compacta
            </h1>
            <p className="text-gray-400 text-base mb-8">
              Equipamentos usados com procedência garantida da rede de concessionárias autorizadas YANMAR.
            </p>

            {/* Filtro de busca rápida */}
            <form onSubmit={handleSearch} className="bg-white rounded-xl p-4 flex flex-col sm:flex-row gap-3">
              <select
                value={filters.category}
                onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none"
              >
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <select
                value={filters.region}
                onChange={e => setFilters(f => ({ ...f, region: e.target.value }))}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none"
              >
                {REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
              <Button type="submit" size="md" className="whitespace-nowrap">
                <Search size={16} className="mr-2" />
                Encontre a sua máquina
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Máquinas em destaque ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-yanmar-dark">Máquinas em destaque</h2>
          <button onClick={() => navigate('/maquinas')} className="text-sm text-yanmar-red hover:underline">
            Ver todas
          </button>
        </div>

        {loading
          ? <div className="flex justify-center py-12"><Spinner /></div>
          : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured?.data?.map(l => <MachineCard key={l.id} listing={l} />)}
            </div>
          )
        }
      </section>

      {/* ── Passo a passo ───────────────────────── */}
      <section className="bg-yanmar-gray py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-bold text-yanmar-dark text-center mb-10">
            Como funciona a plataforma
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="bg-white border border-yanmar-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-yanmar-red/10 text-yanmar-red flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-sm mb-2">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA institucional ─────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 text-center">
        <div className="bg-yanmar-dark rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-white mb-3">
            Pronto para encontrar seu equipamento?
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Explore todo o catálogo de máquinas disponíveis na rede autorizada.
          </p>
          <Button size="lg" onClick={() => navigate('/maquinas')}>
            Ver todas as máquinas
          </Button>
        </div>
      </section>
    </div>
  )
}
