import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Send, Pause, Tag, Trash2, Upload } from 'lucide-react'
import { useFetch } from '@/hooks/useFetch'
import { dealerApi } from '@/api'
import { useAuth } from '@/context/AuthContext'
import { Button, Badge, Modal, Spinner, Empty, toast } from '@/components/ui'
import { formatPrice, STATUS_LABEL, STATUS_COLOR, CATEGORY_LABEL } from '@/utils/format'
import FormAnuncio from './FormAnuncio'
import UploadFotos from './UploadFotos'

export default function PainelDealer() {
  const { user, logout }   = useAuth()
  const navigate            = useNavigate()
  const { data, loading, refetch } = useFetch(dealerApi.myListings)

  const [view,       setView]       = useState('list') // list | form | photos
  const [selected,   setSelected]   = useState(null)
  const [modalDel,   setModalDel]   = useState(null)
  const [modalSold,  setModalSold]  = useState(null)
  const [acting,     setActing]     = useState(false)

  const act = async (fn, successMsg) => {
    setActing(true)
    try { await fn(); toast.success(successMsg); refetch() }
    catch (e) { toast.error(e.message) }
    finally { setActing(false) }
  }

  if (view === 'form') return (
    <FormAnuncio
      listing={selected}
      onSaved={(created) => {
        refetch()
        // Anúncio novo → vai direto para o upload de fotos.
        if (created?.id) { setSelected(created); setView('photos') }
        else setView('list')
      }}
      onBack={() => setView('list')}
    />
  )

  if (view === 'photos') return (
    <UploadFotos
      listing={selected}
      onBack={() => { setView('list'); refetch() }}
    />
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

      {/* Header do painel */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-yanmar-dark">Painel da concessionária</h1>
          <p className="text-sm text-gray-500 mt-0.5">{user?.dealer_name || user?.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate('/')}>Ver portal</Button>
          <Button onClick={() => { setSelected(null); setView('form') }}>
            <Plus size={15} className="mr-1.5" /> Novo anúncio
          </Button>
        </div>
      </div>

      {/* Estatísticas rápidas */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Publicados',     val: data.filter(l => l.status === 'published').length,        color: 'text-green-600' },
            { label: 'Em aprovação',   val: data.filter(l => l.status === 'pending_approval').length, color: 'text-amber-600' },
            { label: 'Rascunhos',      val: data.filter(l => l.status === 'draft').length,            color: 'text-gray-600'  },
            { label: 'Vendidos',       val: data.filter(l => l.status === 'sold').length,             color: 'text-purple-600'},
          ].map(s => (
            <div key={s.label} className="bg-white border border-yanmar-border rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabela de anúncios */}
      {loading
        ? <div className="flex justify-center py-16"><Spinner /></div>
        : !data?.length
          ? <Empty title="Nenhum anúncio ainda" description="Crie seu primeiro anúncio clicando em 'Novo anúncio'." />
          : (
            <div className="bg-white border border-yanmar-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-yanmar-gray border-b border-yanmar-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Equipamento</th>
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
                        <div className="flex items-center gap-3">
                          {l.cover_url
                            ? <img src={l.cover_url} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                            : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">🚜</div>
                          }
                          <div>
                            <p className="font-medium text-yanmar-dark line-clamp-1">{l.title}</p>
                            {l.rejection_reason && (
                              <p className="text-xs text-red-500 mt-0.5">Motivo: {l.rejection_reason}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                        {CATEGORY_LABEL[l.category]}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={STATUS_COLOR[l.status]}>{STATUS_LABEL[l.status]}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">{formatPrice(l.price)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {/* Editar — só em rascunho */}
                          {['draft', 'paused'].includes(l.status) && (
                            <button title="Editar" onClick={() => { setSelected(l); setView('form') }}
                              className="p-1.5 text-gray-400 hover:text-yanmar-dark rounded transition">
                              ✏️
                            </button>
                          )}
                          {/* Fotos */}
                          {['draft', 'paused', 'published'].includes(l.status) && (
                            <button title="Fotos" onClick={() => { setSelected(l); setView('photos') }}
                              className="p-1.5 text-gray-400 hover:text-yanmar-dark rounded transition">
                              <Upload size={14} />
                            </button>
                          )}
                          {/* Enviar para aprovação */}
                          {['draft', 'paused'].includes(l.status) && (
                            <button title="Enviar para aprovação" disabled={acting}
                              onClick={() => act(() => dealerApi.submit(l.id), 'Enviado para aprovação!')}
                              className="p-1.5 text-gray-400 hover:text-amber-600 rounded transition">
                              <Send size={14} />
                            </button>
                          )}
                          {/* Pausar */}
                          {l.status === 'published' && (
                            <button title="Pausar" disabled={acting}
                              onClick={() => act(() => dealerApi.pause(l.id), 'Anúncio pausado.')}
                              className="p-1.5 text-gray-400 hover:text-blue-600 rounded transition">
                              <Pause size={14} />
                            </button>
                          )}
                          {/* Marcar como vendido */}
                          {l.status === 'published' && (
                            <button title="Marcar como vendido" disabled={acting}
                              onClick={() => setModalSold(l)}
                              className="p-1.5 text-gray-400 hover:text-purple-600 rounded transition">
                              <Tag size={14} />
                            </button>
                          )}
                          {/* Excluir */}
                          {!['sold', 'deleted'].includes(l.status) && (
                            <button title="Excluir" onClick={() => setModalDel(l)}
                              className="p-1.5 text-gray-400 hover:text-red-600 rounded transition">
                              <Trash2 size={14} />
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

      {/* Modal confirmar exclusão */}
      <Modal open={!!modalDel} onClose={() => setModalDel(null)} title="Excluir anúncio">
        <p className="text-sm text-gray-600 mb-5">Tem certeza que deseja excluir <strong>{modalDel?.title}</strong>? Esta ação não pode ser desfeita.</p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setModalDel(null)}>Cancelar</Button>
          <Button variant="danger" loading={acting}
            onClick={() => act(() => dealerApi.remove(modalDel.id), 'Anúncio excluído.').then(() => setModalDel(null))}>
            Excluir
          </Button>
        </div>
      </Modal>

      {/* Modal confirmar vendido */}
      <Modal open={!!modalSold} onClose={() => setModalSold(null)} title="Marcar como vendido">
        <p className="text-sm text-gray-600 mb-5">Confirmar que <strong>{modalSold?.title}</strong> foi vendido? O anúncio será removido do portal.</p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setModalSold(null)}>Cancelar</Button>
          <Button loading={acting}
            onClick={() => act(() => dealerApi.markSold(modalSold.id), 'Marcado como vendido!').then(() => setModalSold(null))}>
            Confirmar venda
          </Button>
        </div>
      </Modal>
    </div>
  )
}
