import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle, XCircle, ExternalLink, Eye, X,
  ChevronLeft, ChevronRight, MapPin, Phone, Mail,
} from 'lucide-react'
import { useFetch } from '@/hooks/useFetch'
import { adminApi } from '@/api'
import { useAuth } from '@/context/AuthContext'
import { Button, Badge, Textarea, Spinner, Empty, toast } from '@/components/ui'
import { formatPrice, formatNumber, STATUS_LABEL, STATUS_COLOR, CATEGORY_LABEL } from '@/utils/format'

const STATUS_TABS = [
  { value: '',                 label: 'Todos' },
  { value: 'pending_approval', label: 'Em aprovação' },
  { value: 'published',        label: 'Publicados' },
  { value: 'draft',            label: 'Recusados / Rascunhos' },
  { value: 'paused',           label: 'Pausados' },
  { value: 'sold',             label: 'Vendidos' },
]

export default function PainelAdmin() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('pending_approval')
  const [reviewId, setReviewId] = useState(null)

  // Busca TODOS os anúncios uma vez; estatísticas e abas filtram no cliente.
  const { data, loading, refetch } = useFetch(() => adminApi.listings({ limit: 100 }))
  const all = data || []
  const list = tab ? all.filter(l => l.status === tab) : all

  const count = (s) => all.filter(l => l.status === s).length
  const pending = count('pending_approval')

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-yanmar-dark">Painel administrador</h1>
          <p className="text-sm text-gray-500 mt-0.5">YANMAR Master · {user?.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate('/')}>Ver portal</Button>
          <Button variant="ghost" size="sm" onClick={logout}>Sair</Button>
        </div>
      </div>

      {/* Cards de resumo (sempre sobre o total) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Em aprovação', val: pending,           color: 'text-amber-600' },
          { label: 'Publicados',   val: count('published'), color: 'text-green-600' },
          { label: 'Total',        val: all.length,         color: 'text-yanmar-dark' },
          { label: 'Vendidos',     val: count('sold'),      color: 'text-purple-600' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-yanmar-border rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Abas */}
      <div className="flex gap-1 border-b border-yanmar-border mb-5 overflow-x-auto">
        {STATUS_TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition -mb-px ${
              tab === t.value ? 'border-yanmar-red text-yanmar-red' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
            {t.value === 'pending_approval' && pending > 0 && (
              <span className="ml-2 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pending}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tabela */}
      {loading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : !list.length ? (
        <Empty title="Nenhum anúncio nesta categoria" />
      ) : (
        <div className="bg-white border border-yanmar-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-yanmar-gray border-b border-yanmar-border">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Equipamento</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 hidden md:table-cell">Concessionária</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 hidden sm:table-cell">Categoria</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Preço</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-yanmar-border">
              {list.map(l => (
                <tr key={l.id} className="hover:bg-yanmar-gray/40 transition cursor-pointer" onClick={() => setReviewId(l.id)}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-yanmar-dark">{l.title}</p>
                    {l.model && <p className="text-xs text-gray-400">{l.model} {l.year ? `· ${l.year}` : ''}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{l.dealer_name}</td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{CATEGORY_LABEL[l.category]}</td>
                  <td className="px-4 py-3"><Badge className={STATUS_COLOR[l.status]}>{STATUS_LABEL[l.status]}</Badge></td>
                  <td className="px-4 py-3 text-right font-medium">{formatPrice(l.price)}</td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        title="Analisar" onClick={() => setReviewId(l.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-yanmar-red border border-yanmar-red/30 rounded hover:bg-yanmar-red/5 transition"
                      >
                        <Eye size={13} /> Analisar
                      </button>
                      {l.status === 'published' && (
                        <a href={`/maquinas/${l.id}`} target="_blank" rel="noreferrer"
                          className="p-1.5 text-gray-400 hover:text-yanmar-dark rounded transition" title="Ver no portal">
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {reviewId && (
        <ReviewModal
          id={reviewId}
          onClose={() => setReviewId(null)}
          onDone={() => { setReviewId(null); refetch() }}
        />
      )}
    </div>
  )
}

// ── Modal de análise ────────────────────────────────
function ReviewModal({ id, onClose, onDone }) {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [photoIdx, setPhotoIdx] = useState(0)
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState('')
  const [acting, setActing] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    adminApi.getById(id)
      .then(d => { if (active) setListing(d) })
      .catch(e => { toast.error(e.message); onClose() })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  const approve = async () => {
    setActing(true)
    try { await adminApi.approve(id); toast.success('Anúncio aprovado e publicado!'); onDone() }
    catch (e) { toast.error(e.message) }
    finally { setActing(false) }
  }

  const reject = async () => {
    if (reason.trim().length < 10) return toast.error('Informe o motivo (mínimo 10 caracteres).')
    setActing(true)
    try { await adminApi.reject(id, reason); toast.success('Anúncio recusado e concessionária notificada.'); onDone() }
    catch (e) { toast.error(e.message) }
    finally { setActing(false) }
  }

  const photos = listing?.photos || []
  const specs = listing?.specs || {}
  const isPending = listing?.status === 'pending_approval'

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl my-8" onClick={e => e.stopPropagation()}>
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-yanmar-border sticky top-0 bg-white rounded-t-xl">
          <h2 className="font-bold text-yanmar-dark">Análise do anúncio</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Título + status */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs text-yanmar-red font-semibold uppercase tracking-wide">{CATEGORY_LABEL[listing.category]}</span>
                <h3 className="text-lg font-bold text-yanmar-dark">{listing.title}</h3>
                <p className="text-sm text-gray-400">{listing.model} {listing.year ? `· ${listing.year}` : ''}</p>
              </div>
              <Badge className={STATUS_COLOR[listing.status]}>{STATUS_LABEL[listing.status]}</Badge>
            </div>

            {/* Galeria de fotos */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Fotos ({photos.length})</p>
              {photos.length > 0 ? (
                <>
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-[16/9]">
                    <img src={photos[photoIdx]?.url} alt="" onError={e => { e.currentTarget.style.display = 'none' }} className="w-full h-full object-cover" />
                    {photos.length > 1 && (
                      <>
                        <button onClick={() => setPhotoIdx(i => (i === 0 ? photos.length - 1 : i - 1))}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center"><ChevronLeft size={16} /></button>
                        <button onClick={() => setPhotoIdx(i => (i === photos.length - 1 ? 0 : i + 1))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center"><ChevronRight size={16} /></button>
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-0.5 rounded text-xs">{photoIdx + 1}/{photos.length}</div>
                      </>
                    )}
                  </div>
                  {photos.length > 1 && (
                    <div className="flex gap-2 mt-2">
                      {photos.map((p, i) => (
                        <button key={i} onClick={() => setPhotoIdx(i)} className="w-16 h-12 rounded overflow-hidden"
                          style={{ outline: i === photoIdx ? '2px solid #CC0000' : 'none', opacity: i === photoIdx ? 1 : 0.6 }}>
                          <img src={p.url} alt="" onError={e => { e.currentTarget.style.opacity = 0 }} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3">
                  ⚠️ Este anúncio não tem fotos. Considere recusar e pedir imagens à concessionária.
                </div>
              )}
            </div>

            {/* Preço + dados principais */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Info label="Preço" value={formatPrice(listing.price)} highlight />
              <Info label="Ano" value={listing.year || '—'} />
              <Info label="Horas de uso" value={listing.hours_used != null ? `${formatNumber(listing.hours_used)} h` : '—'} />
              <Info label="Localização" value={listing.city ? `${listing.city} - ${listing.state}` : '—'} />
            </div>

            {/* Descrição */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Descrição</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {listing.description || <span className="text-gray-400">Sem descrição informada.</span>}
              </p>
            </div>

            {/* Especificações */}
            {Object.keys(specs).length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Especificações técnicas</p>
                <div className="border border-yanmar-border rounded-lg overflow-hidden">
                  {Object.entries(specs).map(([k, v], i) => (
                    <div key={k} className={`flex text-sm ${i % 2 ? 'bg-yanmar-gray' : 'bg-white'}`}>
                      <span className="w-1/2 px-3 py-2 text-gray-500 capitalize">{k.replace(/_/g, ' ')}</span>
                      <span className="w-1/2 px-3 py-2 text-gray-800 font-medium">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Concessionária */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Concessionária responsável</p>
              <div className="border border-yanmar-border rounded-lg p-4">
                <p className="font-semibold text-yanmar-dark">{listing.dealer_name}</p>
                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1.5 text-sm text-gray-500">
                  {listing.city && <span className="flex items-center gap-1"><MapPin size={13} className="text-yanmar-red" /> {listing.city} - {listing.state}</span>}
                  {listing.dealer_phone && <span className="flex items-center gap-1"><Phone size={13} className="text-yanmar-red" /> {listing.dealer_phone}</span>}
                  {listing.dealer_email && <span className="flex items-center gap-1"><Mail size={13} className="text-yanmar-red" /> {listing.dealer_email}</span>}
                </div>
              </div>
            </div>

            {/* Motivo de recusa anterior, se houver */}
            {listing.rejection_reason && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <p className="text-xs font-semibold text-red-700 mb-0.5">Motivo da última recusa</p>
                <p className="text-sm text-red-600">{listing.rejection_reason}</p>
              </div>
            )}
          </div>
        )}

        {/* Rodapé com ações */}
        {!loading && (
          <div className="border-t border-yanmar-border px-6 py-4 sticky bottom-0 bg-white rounded-b-xl">
            {isPending ? (
              rejecting ? (
                <div className="space-y-3">
                  <Textarea
                    label="Motivo da recusa *"
                    placeholder="Ex: Fotos de baixa qualidade. Reenvie com imagens nítidas de todos os ângulos e informe o estado real do equipamento."
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => { setRejecting(false); setReason('') }}>Voltar</Button>
                    <Button variant="danger" loading={acting} onClick={reject}>Confirmar recusa</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-gray-500 hidden sm:block">Analise fotos, descrição e estado antes de decidir.</p>
                  <div className="flex gap-2">
                    <Button variant="danger" onClick={() => setRejecting(true)}>
                      <XCircle size={15} className="mr-1.5" /> Recusar
                    </Button>
                    <Button loading={acting} onClick={approve}>
                      <CheckCircle size={15} className="mr-1.5" /> Aprovar e publicar
                    </Button>
                  </div>
                </div>
              )
            ) : (
              <div className="flex justify-end">
                <Button variant="secondary" onClick={onClose}>Fechar</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Info({ label, value, highlight }) {
  return (
    <div className="bg-yanmar-gray rounded-lg px-3 py-2">
      <p className="text-[0.68rem] text-gray-400 uppercase tracking-wide">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? 'text-yanmar-red' : 'text-gray-800'}`}>{value}</p>
    </div>
  )
}
