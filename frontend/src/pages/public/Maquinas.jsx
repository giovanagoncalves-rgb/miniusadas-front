import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { listingsApi } from '@/api'
import MachineCard from '@/components/shared/MachineCard'
import { Button, Select, Spinner, Empty } from '@/components/ui'
import { SlidersHorizontal, X } from 'lucide-react'

const CATEGORIES = [
  { value: '', label: 'Todas' },
  { value: 'mini_escavadeira',        label: 'Mini escavadeira' },
  { value: 'mini_pa_carregadeira',    label: 'Mini pá carregadeira' },
  { value: 'mini_retroescavadeira',   label: 'Mini retroescavadeira' },
]

const REGIONS = [
  { value: '', label: 'Todas' },
  { value: 'Sul', label: 'Sul' },
  { value: 'Sudeste', label: 'Sudeste' },
  { value: 'Centro-Oeste', label: 'Centro-Oeste' },
  { value: 'Nordeste', label: 'Nordeste' },
  { value: 'Norte', label: 'Norte' },
]

export default function Maquinas() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category:  searchParams.get('category')  || '',
    region:    searchParams.get('region')    || '',
    price_min: searchParams.get('price_min') || '',
    price_max: searchParams.get('price_max') || '',
    page: 1,
  })
  const [showFilters, setShowFilters] = useState(false)

  const fetchData = async (f) => {
    setLoading(true)
    try {
      const res = await listingsApi.list(f)
      setData(res)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData(filters) }, [filters])

  const applyFilters = (newF) => {
    const updated = { ...filters, ...newF, page: 1 }
    setFilters(updated)
    const params = Object.fromEntries(Object.entries(updated).filter(([, v]) => v !== '' && v != null && v !== 1))
    setSearchParams(params)
  }

  const clearFilters = () => applyFilters({ category: '', region: '', price_min: '', price_max: '' })

  const hasFilters = filters.category || filters.region || filters.price_min || filters.price_max

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-yanmar-dark">Máquinas disponíveis</h1>
          {data && <p className="text-sm text-gray-500 mt-0.5">{data.total} equipamento{data.total !== 1 ? 's' : ''} encontrado{data.total !== 1 ? 's' : ''}</p>}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm border border-yanmar-border rounded-lg px-3 py-2 hover:bg-yanmar-gray transition md:hidden"
        >
          <SlidersHorizontal size={14} />
          Filtros {hasFilters && <span className="w-2 h-2 rounded-full bg-yanmar-red" />}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filtros */}
        <aside className={`w-56 shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
          <div className="bg-white border border-yanmar-border rounded-xl p-4 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">Filtros</h2>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-yanmar-red flex items-center gap-1">
                  <X size={12} /> Limpar
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Categoria</p>
                {CATEGORIES.map(c => (
                  <label key={c.value} className="flex items-center gap-2 text-sm mb-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={c.value}
                      checked={filters.category === c.value}
                      onChange={() => applyFilters({ category: c.value })}
                      className="accent-yanmar-red"
                    />
                    {c.label}
                  </label>
                ))}
              </div>

              <div className="border-t border-yanmar-border pt-4">
                <p className="text-xs font-medium text-gray-500 mb-2">Região</p>
                {REGIONS.map(r => (
                  <label key={r.value} className="flex items-center gap-2 text-sm mb-2 cursor-pointer">
                    <input
                      type="radio"
                      name="region"
                      value={r.value}
                      checked={filters.region === r.value}
                      onChange={() => applyFilters({ region: r.value })}
                      className="accent-yanmar-red"
                    />
                    {r.label}
                  </label>
                ))}
              </div>

              <div className="border-t border-yanmar-border pt-4">
                <p className="text-xs font-medium text-gray-500 mb-2">Faixa de preço</p>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Mínimo (R$)"
                    value={filters.price_min}
                    onChange={e => setFilters(f => ({ ...f, price_min: e.target.value }))}
                    onBlur={() => applyFilters({ price_min: filters.price_min })}
                    className="w-full border border-yanmar-border rounded-lg px-3 py-1.5 text-xs outline-none focus:border-yanmar-red"
                  />
                  <input
                    type="number"
                    placeholder="Máximo (R$)"
                    value={filters.price_max}
                    onChange={e => setFilters(f => ({ ...f, price_max: e.target.value }))}
                    onBlur={() => applyFilters({ price_max: filters.price_max })}
                    className="w-full border border-yanmar-border rounded-lg px-3 py-1.5 text-xs outline-none focus:border-yanmar-red"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Grid de resultados */}
        <div className="flex-1 min-w-0">
          {loading
            ? <div className="flex justify-center py-20"><Spinner /></div>
            : data?.data?.length === 0
              ? <Empty title="Nenhuma máquina encontrada" description="Tente ajustar os filtros para ver mais resultados." />
              : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {data.data.map(l => <MachineCard key={l.id} listing={l} />)}
                  </div>

                  {/* Paginação simples */}
                  {data.total > data.limit && (
                    <div className="flex justify-center gap-2 mt-8">
                      <Button variant="secondary" size="sm" disabled={filters.page <= 1}
                        onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}>
                        Anterior
                      </Button>
                      <span className="px-3 py-1.5 text-sm text-gray-500">
                        {filters.page} / {Math.ceil(data.total / data.limit)}
                      </span>
                      <Button variant="secondary" size="sm"
                        disabled={filters.page >= Math.ceil(data.total / data.limit)}
                        onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}>
                        Próxima
                      </Button>
                    </div>
                  )}
                </>
              )
          }
        </div>
      </div>
    </div>
  )
}
