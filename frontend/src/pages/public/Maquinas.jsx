import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react'
import { listingsApi } from '@/api'
import MachineCard from '@/components/shared/MachineCard'
import { Spinner } from '@/components/ui'
import { MOCK_LISTINGS } from '@/utils/mockListings'

const CATEGORIES = [
  { value: '',                      label: 'Todas' },
  { value: 'mini_escavadeira',      label: 'Mini escavadeira' },
  { value: 'mini_pa_carregadeira',  label: 'Mini pá carregadeira' },
  { value: 'mini_retroescavadeira', label: 'Mini retroescavadeira' },
]

const REGIONS = [
  { value: '',             label: 'Todas as regiões' },
  { value: 'Sul',          label: 'Sul' },
  { value: 'Sudeste',      label: 'Sudeste' },
  { value: 'Centro-Oeste', label: 'Centro-Oeste' },
  { value: 'Nordeste',     label: 'Nordeste' },
  { value: 'Norte',        label: 'Norte' },
]

const PRICES = [
  { value: '',              label: 'Todos os preços' },
  { value: '0-50000',       label: 'Até R$ 50.000' },
  { value: '50000-150000',  label: 'R$ 50.000 – R$ 150.000' },
  { value: '150000-400000', label: 'R$ 150.000 – R$ 400.000' },
  { value: '400000-',       label: 'Acima de R$ 400.000' },
]

const SORTS = [
  { value: 'recentes', label: 'Mais recentes' },
  { value: 'menor',    label: 'Menor preço' },
  { value: 'maior',    label: 'Maior preço' },
]

// Mapa simples estado → região (usado só no fallback de exemplo).
const REGION_BY_STATE = {
  SP: 'Sudeste', RJ: 'Sudeste', MG: 'Sudeste', ES: 'Sudeste',
  PR: 'Sul', SC: 'Sul', RS: 'Sul',
  GO: 'Centro-Oeste', MT: 'Centro-Oeste', MS: 'Centro-Oeste', DF: 'Centro-Oeste',
  BA: 'Nordeste', PE: 'Nordeste', CE: 'Nordeste',
  AM: 'Norte', PA: 'Norte',
}

export default function Maquinas() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [raw, setRaw]     = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [sort, setSort]   = useState('recentes')

  const filters = {
    q:         searchParams.get('q')         || '',
    category:  searchParams.get('category')  || '',
    region:    searchParams.get('region')    || '',
    price_min: searchParams.get('price_min') || '',
    price_max: searchParams.get('price_max') || '',
  }

  // Busca os anúncios uma vez; se a API falhar ou vier vazia, usa exemplos.
  useEffect(() => {
    let active = true
    setLoading(true)
    listingsApi.list({ limit: 60 })
      .then(res => { if (active) setRaw(res?.data?.length ? res.data : MOCK_LISTINGS) })
      .catch(() => { if (active) setRaw(MOCK_LISTINGS) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  const clearFilters = () => setSearchParams({})

  const hasFilters = filters.category || filters.region || filters.price_min || filters.price_max || filters.q

  // Filtragem e ordenação (client-side — robusto e sem risco de crash).
  const priceRange = [Number(filters.price_min) || 0, Number(filters.price_max) || Infinity]
  let list = raw.filter(m => {
    if (filters.q && !(`${m.title} ${m.model || ''}`.toLowerCase().includes(filters.q.toLowerCase()))) return false
    if (filters.category && m.category !== filters.category) return false
    if (filters.region) {
      const region = REGION_BY_STATE[m.state] || ''
      if (region !== filters.region) return false
    }
    if (m.price != null && (m.price < priceRange[0] || m.price > priceRange[1])) return false
    return true
  })
  list = [...list].sort((a, b) => {
    if (sort === 'menor') return (a.price ?? 0) - (b.price ?? 0)
    if (sort === 'maior') return (b.price ?? 0) - (a.price ?? 0)
    return (b.year ?? 0) - (a.year ?? 0)
  })

  const Sidebar = () => (
    <div className="space-y-6">
      <FilterGroup title="Categoria">
        {CATEGORIES.map(c => (
          <Radio key={c.value} name="category" label={c.label}
            checked={filters.category === c.value}
            onChange={() => updateParam('category', c.value)} />
        ))}
      </FilterGroup>

      <div className="border-t border-yanmar-border" />

      <FilterGroup title="Localização">
        {REGIONS.map(r => (
          <Radio key={r.value} name="region" label={r.label}
            checked={filters.region === r.value}
            onChange={() => updateParam('region', r.value)} />
        ))}
      </FilterGroup>

      <div className="border-t border-yanmar-border" />

      <FilterGroup title="Faixa de preço">
        {PRICES.map(p => {
          const [min, max] = p.value.split('-')
          const checked = (filters.price_min || '') === (min || '') && (filters.price_max || '') === (max || '')
          return (
            <Radio key={p.value} name="price" label={p.label}
              checked={p.value ? checked : (!filters.price_min && !filters.price_max)}
              onChange={() => {
                const next = new URLSearchParams(searchParams)
                if (min) next.set('price_min', min); else next.delete('price_min')
                if (max) next.set('price_max', max); else next.delete('price_max')
                setSearchParams(next)
              }} />
          )
        })}
      </FilterGroup>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-2 border border-yanmar-red/30 text-yanmar-red rounded-sm hover:bg-yanmar-red/5 transition-colors text-[0.82rem] font-semibold"
        >
          Limpar filtros
        </button>
      )}
    </div>
  )

  return (
    <div className="bg-yanmar-gray min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Cabeçalho */}
        <div className="mb-6">
          <h1 className="text-yanmar-dark font-extrabold text-[1.5rem]">Máquinas disponíveis</h1>
          <p className="text-gray-500 text-[0.85rem] mt-0.5">
            {loading ? 'Carregando…' : `${list.length} equipamento${list.length !== 1 ? 's' : ''} encontrado${list.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Busca + ordenação */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 flex items-center gap-2 bg-white border border-yanmar-border rounded-sm px-3 py-2.5 focus-within:border-yanmar-red transition-colors shadow-sm">
            <Search size={15} className="text-gray-400" />
            <input
              type="text"
              value={filters.q}
              onChange={e => updateParam('q', e.target.value)}
              placeholder="Buscar por modelo ou categoria..."
              className="flex-1 bg-transparent outline-none text-gray-700 text-[0.875rem]"
            />
          </div>

          <button
            onClick={() => setShowFilters(true)}
            className="lg:hidden flex items-center gap-1.5 bg-white border border-yanmar-border px-3 py-2.5 rounded-sm shadow-sm text-[0.82rem] font-semibold text-gray-600"
          >
            <SlidersHorizontal size={15} /> Filtros
          </button>

          <div className="flex items-center gap-2 bg-white border border-yanmar-border px-3 py-2.5 rounded-sm shadow-sm">
            <ArrowUpDown size={14} className="text-gray-400" />
            <select value={sort} onChange={e => setSort(e.target.value)} className="bg-transparent outline-none text-gray-600 text-[0.82rem]">
              {SORTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-yanmar-border sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <p className="text-yanmar-dark font-bold text-[0.9rem]">Filtros</p>
                <SlidersHorizontal size={15} className="text-gray-400" />
              </div>
              <Sidebar />
            </div>
          </aside>

          {/* Filtros mobile (drawer) */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
              <div className="relative ml-auto w-72 bg-white h-full overflow-y-auto p-5">
                <div className="flex items-center justify-between mb-5">
                  <p className="font-bold">Filtros</p>
                  <button onClick={() => setShowFilters(false)}><X size={18} /></button>
                </div>
                <Sidebar />
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex justify-center py-20"><Spinner /></div>
            ) : list.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-yanmar-border">
                <p className="text-gray-400">Nenhuma máquina encontrada com os filtros selecionados.</p>
                {hasFilters && (
                  <button onClick={clearFilters} className="mt-3 text-yanmar-red text-[0.85rem] font-semibold">Limpar filtros</button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {list.map(l => <MachineCard key={l.id} listing={l} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterGroup({ title, children }) {
  return (
    <div>
      <p className="text-gray-700 font-bold text-[0.85rem] mb-3">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Radio({ name, label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="accent-yanmar-red" />
      <span className="text-gray-600 group-hover:text-gray-900 transition-colors text-[0.82rem]">{label}</span>
    </label>
  )
}
