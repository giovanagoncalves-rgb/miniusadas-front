import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import { useFetch } from '@/hooks/useFetch'
import { adminApi } from '@/api'
import { useAuth } from '@/context/AuthContext'
import { Button, Badge, Modal, Textarea, Spinner, Empty, toast } from '@/components/ui'
import { formatPrice, STATUS_LABEL, STATUS_COLOR, CATEGORY_LABEL } from '@/utils/format'

const STATUS_TABS = [
  { value: '',                label: 'Todos' },
  { value: 'pending_approval',label: 'Em aprovação' },
  { value: 'published',       label: 'Publicados' },
  { value: 'draft',           label: 'Rascunhos' },
  { value: 'paused',          label: 'Pausados' },
  { value: 'sold',            label: 'Vendidos' },
]

export default function PainelAdmin() {
  const { user, logout } = useAuth()
  const navigate          = useNavigate()
  const [tab,      setTab]      = useState('pending_approval')
  const [modalRej, setModalRej] = useState(null)
  const [reason,   setReason]   = useState('')
  const [acting,   setActing]   = useState(false)

  const { data, loading, refetch } = useFetch(() => adminApi.listings({ status: tab }), [tab])

  const act = async (fn, msg) => {
    setActing(true)
    try { await fn(); toast.success(msg); refetch() }
    catch (e) { toast.error(e.message) }
    finally { setActing(false) }
  }

  const handleReject = async () => {
    if (!reason.trim() || reason.length < 10) return toast.error('Informe o motivo (mínimo 10 caracteres).')
    await act(() => adminApi.reject(modalRej.id, reason), 'Anúncio recusado e concessionária notificada.')
    setModalRej(null)
    setReason('')
  }

  const pending = data?.filter(l => l.status === 'pending_approval').length || 0

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Painel administrador</h1>
          <p className="text-sm text-gray-500 mt-0.5">YANMAR Master · {user?.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate('/')}>Ver portal</Button>
          <Button variant="ghost" size="sm" onClick={logout}>Sair</Button>
        </div>
      </div>

      {/* Cards de resumo */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Em aprovação', val: data.filter(l => l.status === 'pending_approval').length, color: 'text-amber-600' },
            { label: 'Publicados',   val: data.filter(l => l.status === 'published').length,        color: 'text-green-600' },
            { label: 'Total',        val: data.length,                                              color: 'text-yanmar-dark' },
            { label: 'Vendidos',     val: data.filter(l => l.status === 'sold').length,             color: 'text-purple-600' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-yanmar-border rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs de status */}
      <div className="flex gap-1 border-b border-yanmar-border mb-5 overflow-x-auto">
        {STATUS_TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition -mb-px ${
              tab === t.value
                ? 'border-yanmar-red text-yanmar-red'
                : 'border-transparent text-gray-500 hover:text-gray-700'
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
      {loading
        ? <div className="flex justify-center py-16"><Spinner /></div>
        : !data?.length
          ? <Empty title="Nenhum anúncio nesta categoria" />
          : (
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
                  {data.map(l => (
                    <tr key={l.id} className="hover:bg-yanmar-gray/40 transition">
                      <td className="px-4 py-3">
                        <p className="font-medium text-yanmar-dark">{l.title}</p>
                        {l.model && <p className="text-xs text-gray-400">{l.model} {l.year ? `· ${l.year}` : ''}</p>}
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{l.dealer_name}</td>
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{CATEGORY_LABEL[l.category]}</td>
                      <td className="px-4 py-3">
                        <Badge className={STATUS_COLOR[l.status]}>{STATUS_LABEL[l.status]}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">{formatPrice(l.price)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {/* Ver no portal */}
                          {l.status === 'published' && (
                            <a href={`/maquinas/${l.id}`} target="_blank" rel="noreferrer"
                              className="p-1.5 text-gray-400 hover:text-yanmar-dark rounded transition">
                              <ExternalLink size={14} />
                            </a>
                          )}
                          {/* Aprovar */}
                          {l.status === 'pending_approval' && (
                            <button title="Aprovar" disabled={acting}
                              onClick={() => act(() => adminApi.approve(l.id), `"${l.title}" aprovado e publicado!`)}
                              className="p-1.5 text-gray-400 hover:text-green-600 rounded transition">
                              <CheckCircle size={16} />
                            </button>
                          )}
                          {/* Recusar */}
                          {l.status === 'pending_approval' && (
                            <button title="Recusar" onClick={() => { setModalRej(l); setReason('') }}
                              className="p-1.5 text-gray-400 hover:text-red-600 rounded transition">
                              <XCircle size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
      }

      {/* Modal recusar */}
      <Modal open={!!modalRej} onClose={() => setModalRej(null)} title="Recusar anúncio">
        <p className="text-sm text-gray-600 mb-4">
          Informe o motivo da recusa para <strong>{modalRej?.title}</strong>. A concessionária será notificada por e-mail.
        </p>
        <Textarea
          label="Motivo da recusa *"
          placeholder="Ex: Fotos de baixa qualidade. Por favor, reenvie com imagens nítidas de todos os ângulos."
          value={reason}
          onChange={e => setReason(e.target.value)}
          rows={4}
        />
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="secondary" onClick={() => setModalRej(null)}>Cancelar</Button>
          <Button variant="danger" loading={acting} onClick={handleReject}>
            Recusar e notificar
          </Button>
        </div>
      </Modal>
    </div>
  )
}
