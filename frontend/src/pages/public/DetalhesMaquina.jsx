import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { MapPin, Clock, Calendar, Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react'
import { useFetch } from '@/hooks/useFetch'
import { listingsApi } from '@/api'
import MachineCard from '@/components/shared/MachineCard'
import { Button, Input, Textarea, Spinner, toast } from '@/components/ui'
import { formatPrice, formatNumber, CATEGORY_LABEL } from '@/utils/format'

export default function DetalhesMaquina() {
  const { id } = useParams()
  const { data: listing, loading } = useFetch(() => listingsApi.getById(id), [id])
  const [photoIdx, setPhotoIdx] = useState(0)
  const [lead, setLead]         = useState({ name: '', email: '', phone: '', message: '' })
  const [sending, setSending]   = useState(false)
  const [sent, setSent]         = useState(false)

  const handleLead = async (e) => {
    e.preventDefault()
    if (!lead.name || !lead.email) return toast.error('Nome e e-mail são obrigatórios.')
    setSending(true)
    try {
      await listingsApi.lead(id, lead)
      setSent(true)
      toast.success('Interesse registrado! A concessionária entrará em contato.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSending(false)
    }
  }

  if (loading) return <div className="flex justify-center py-32"><Spinner /></div>
  if (!listing) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">Equipamento não encontrado.</div>

  const photos = listing.photos || []
  const specs  = listing.specs  || {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-6">

          {/* Carrossel de fotos */}
          <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-[16/9]">
            {photos.length > 0 ? (
              <>
                <img
                  src={photos[photoIdx]?.url}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                {photos.length > 1 && (
                  <>
                    <button onClick={() => setPhotoIdx(i => (i - 1 + photos.length) % photos.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1.5 hover:bg-black/60 transition">
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => setPhotoIdx(i => (i + 1) % photos.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1.5 hover:bg-black/60 transition">
                      <ChevronRight size={18} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {photos.map((_, i) => (
                        <button key={i} onClick={() => setPhotoIdx(i)}
                          className={`w-2 h-2 rounded-full transition ${i === photoIdx ? 'bg-white' : 'bg-white/50'}`} />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">🚜</div>
            )}
          </div>

          {/* Miniaturas */}
          {photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {photos.map((p, i) => (
                <button key={i} onClick={() => setPhotoIdx(i)}
                  className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${i === photoIdx ? 'border-yanmar-red' : 'border-transparent'}`}>
                  <img src={p.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Título e metadados */}
          <div>
            <span className="text-xs text-yanmar-red font-medium">{CATEGORY_LABEL[listing.category]}</span>
            <h1 className="text-2xl font-bold text-yanmar-dark mt-1 mb-3">{listing.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {listing.year      && <span className="flex items-center gap-1"><Calendar size={14} />{listing.year}</span>}
              {listing.hours_used != null && <span className="flex items-center gap-1"><Clock size={14} />{formatNumber(listing.hours_used)} horas</span>}
              {listing.city      && <span className="flex items-center gap-1"><MapPin size={14} />{listing.city} / {listing.state}</span>}
            </div>
          </div>

          {/* Descrição */}
          {listing.description && (
            <div>
              <h2 className="text-base font-semibold mb-2">Descrição</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
            </div>
          )}

          {/* Especificações técnicas */}
          {Object.keys(specs).length > 0 && (
            <div>
              <h2 className="text-base font-semibold mb-3">Especificações técnicas</h2>
              <div className="border border-yanmar-border rounded-xl overflow-hidden">
                {Object.entries(specs).map(([k, v], i) => (
                  <div key={k} className={`flex text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-yanmar-gray'}`}>
                    <span className="w-1/2 px-4 py-3 font-medium text-gray-600 capitalize">{k.replace(/_/g, ' ')}</span>
                    <span className="w-1/2 px-4 py-3 text-gray-800">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar direita */}
        <div className="space-y-5">

          {/* Preço */}
          <div className="bg-white border border-yanmar-border rounded-xl p-5">
            <p className="text-2xl font-bold text-yanmar-red">{formatPrice(listing.price)}</p>
            {listing.model && <p className="text-sm text-gray-500 mt-1">{listing.model}</p>}
          </div>

          {/* Dados da concessionária */}
          <div className="bg-white border border-yanmar-border rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-3">Concessionária</h2>
            {listing.dealer_logo && (
              <img src={listing.dealer_logo} alt={listing.dealer_name} className="h-10 object-contain mb-3" />
            )}
            <p className="text-sm font-medium text-gray-800">{listing.dealer_name}</p>
            {listing.city && <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><MapPin size={11} />{listing.city} / {listing.state}</p>}
            <div className="mt-3 space-y-1.5">
              {listing.dealer_phone && (
                <a href={`tel:${listing.dealer_phone}`} className="flex items-center gap-2 text-xs text-gray-600 hover:text-yanmar-red">
                  <Phone size={12} /> {listing.dealer_phone}
                </a>
              )}
              {listing.dealer_email && (
                <a href={`mailto:${listing.dealer_email}`} className="flex items-center gap-2 text-xs text-gray-600 hover:text-yanmar-red">
                  <Mail size={12} /> {listing.dealer_email}
                </a>
              )}
            </div>
          </div>

          {/* Formulário de interesse */}
          <div className="bg-white border border-yanmar-border rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-4">Tenho interesse</h2>
            {sent ? (
              <div className="text-center py-4">
                <div className="text-3xl mb-2">✅</div>
                <p className="text-sm text-gray-600">Interesse registrado! A concessionária entrará em contato em breve.</p>
              </div>
            ) : (
              <form onSubmit={handleLead} className="space-y-3">
                <Input label="Nome" placeholder="Seu nome completo" value={lead.name}
                  onChange={e => setLead(l => ({ ...l, name: e.target.value }))} required />
                <Input label="E-mail" type="email" placeholder="seu@email.com" value={lead.email}
                  onChange={e => setLead(l => ({ ...l, email: e.target.value }))} required />
                <Input label="Telefone" placeholder="(00) 00000-0000" value={lead.phone}
                  onChange={e => setLead(l => ({ ...l, phone: e.target.value }))} />
                <Textarea label="Mensagem (opcional)" placeholder="Dúvidas ou informações adicionais..." value={lead.message}
                  onChange={e => setLead(l => ({ ...l, message: e.target.value }))} rows={3} />
                <Button type="submit" loading={sending} className="w-full">
                  Enviar interesse
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Máquinas relacionadas */}
      {listing.related?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-bold mb-5">Máquinas relacionadas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {listing.related.map(l => <MachineCard key={l.id} listing={l} />)}
          </div>
        </div>
      )}
    </div>
  )
}
