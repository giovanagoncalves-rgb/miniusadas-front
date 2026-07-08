import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  MapPin, Phone, Mail, ChevronLeft, ChevronRight, MessageSquare,
  CheckCircle2, ShieldCheck, Clock,
} from 'lucide-react'
import { useFetch } from '@/hooks/useFetch'
import { listingsApi } from '@/api'
import MachineCard from '@/components/shared/MachineCard'
import { Spinner, toast } from '@/components/ui'
import { formatPrice, formatNumber, CATEGORY_LABEL } from '@/utils/format'
import { getMockListing } from '@/utils/mockListings'

export default function DetalhesMaquina() {
  const { id } = useParams()
  const { data, loading } = useFetch(() => listingsApi.getById(id), [id])
  const [photoIdx, setPhotoIdx] = useState(0)
  const [lead, setLead]     = useState({ name: '', email: '', phone: '', message: 'Olá, tenho interesse neste equipamento. Poderia me enviar mais informações?' })
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)

  if (loading) return <div className="flex justify-center py-32"><Spinner /></div>

  // Usa o anúncio real; se não existir/for inválido (preview sem backend),
  // cai para um anúncio de exemplo.
  const hasReal = data && (data.id || data.title)
  const listing = hasReal ? data : getMockListing(id)
  const isDemo = !hasReal

  const handleLead = async (e) => {
    e.preventDefault()
    if (!lead.name || !lead.email) return toast.error('Nome e e-mail são obrigatórios.')
    setSending(true)
    try {
      if (!isDemo) await listingsApi.lead(id, lead)
      setSent(true)
      toast.success('Interesse registrado! A concessionária entrará em contato.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSending(false)
    }
  }

  const photos = listing.photos?.length ? listing.photos : (listing.cover_url ? [{ url: listing.cover_url }] : [])
  const specs  = listing.specs || {}
  const location = listing.city ? `${listing.city} - ${listing.state}` : listing.dealer_name

  const mainInfo = [
    ['Categoria',    CATEGORY_LABEL[listing.category] || listing.category],
    ['Modelo',       listing.model],
    ['Ano',          listing.year],
    ['Horas de uso', listing.hours_used != null ? `${formatNumber(listing.hours_used)} horas` : null],
    ['Localização',  location],
  ].filter(([, v]) => v)

  return (
    <div className="bg-yanmar-gray min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-yanmar-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-gray-400 text-[0.8rem]">
          <Link to="/" className="hover:text-yanmar-red transition-colors">Início</Link>
          <ChevronRight size={13} />
          <Link to="/maquinas" className="hover:text-yanmar-red transition-colors">Máquinas</Link>
          <ChevronRight size={13} />
          <span className="text-gray-700 line-clamp-1">{listing.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-5">
            {/* Galeria */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-yanmar-border">
              <div className="relative h-[280px] sm:h-[400px] bg-gray-100">
                {photos.length > 0 ? (
                  <img
                    src={photos[photoIdx]?.url}
                    alt={listing.title}
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">🚜</div>
                )}
                {photos.length > 1 && (
                  <>
                    <button onClick={() => setPhotoIdx(i => (i === 0 ? photos.length - 1 : i - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center">
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => setPhotoIdx(i => (i === photos.length - 1 ? 0 : i + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center">
                      <ChevronRight size={18} />
                    </button>
                    <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-0.5 rounded text-xs">
                      {photoIdx + 1}/{photos.length}
                    </div>
                  </>
                )}
              </div>

              {photos.length > 1 && (
                <div className="flex gap-2 p-3">
                  {photos.map((p, i) => (
                    <button key={i} onClick={() => setPhotoIdx(i)}
                      className="flex-1 overflow-hidden rounded h-16"
                      style={{ outline: i === photoIdx ? '2px solid #CC0000' : 'none', opacity: i === photoIdx ? 1 : 0.6 }}>
                      <img src={p.url} alt="" onError={(e) => { e.currentTarget.style.opacity = 0 }} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informações principais */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-yanmar-border">
              <h2 className="text-yanmar-dark font-bold text-[1.1rem] mb-4">Informações principais</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {mainInfo.map(([label, value]) => (
                  <div key={label}>
                    <p className="text-gray-400 text-[0.72rem] font-semibold uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-gray-800 text-[0.9rem] font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Descrição */}
            {listing.description && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-yanmar-border">
                <h2 className="text-yanmar-dark font-bold text-[1.1rem] mb-3">Descrição</h2>
                <p className="text-gray-600 text-[0.9rem] leading-relaxed whitespace-pre-wrap">{listing.description}</p>
              </div>
            )}

            {/* Especificações técnicas */}
            {Object.keys(specs).length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-yanmar-border">
                <h2 className="text-yanmar-dark font-bold text-[1.1rem] mb-4">Especificações técnicas</h2>
                <div className="divide-y divide-gray-50">
                  {Object.entries(specs).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between py-2.5">
                      <span className="text-gray-500 text-[0.83rem] capitalize">{k.replace(/_/g, ' ')}</span>
                      <span className="text-gray-800 text-[0.83rem] font-semibold">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Concessionária */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-yanmar-border">
              <h2 className="text-yanmar-dark font-bold text-[1.1rem] mb-4">Dados da concessionária</h2>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-yanmar-red overflow-hidden">
                  {listing.dealer_logo
                    ? <img src={listing.dealer_logo} alt={listing.dealer_name} className="w-full h-full object-contain" />
                    : <span className="text-white text-[0.6rem] font-extrabold text-center leading-tight">YANMAR<br />AUTH</span>}
                </div>
                <div className="flex-1">
                  <p className="text-yanmar-dark font-bold text-[1rem] mb-1">{listing.dealer_name}</p>
                  {location && (
                    <div className="flex items-center gap-1.5 text-gray-500 text-[0.8rem] mb-2">
                      <MapPin size={13} className="text-yanmar-red" /> {location}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {listing.dealer_phone && (
                      <a href={`tel:${listing.dealer_phone}`} className="flex items-center gap-1.5 px-3 py-1.5 border border-yanmar-border rounded-sm hover:border-yanmar-red hover:text-yanmar-red transition-colors text-gray-600 text-[0.78rem] font-medium">
                        <Phone size={13} /> {listing.dealer_phone}
                      </a>
                    )}
                    {listing.dealer_email && (
                      <a href={`mailto:${listing.dealer_email}`} className="flex items-center gap-1.5 px-3 py-1.5 border border-yanmar-border rounded-sm hover:border-yanmar-red hover:text-yanmar-red transition-colors text-gray-600 text-[0.78rem] font-medium">
                        <Mail size={13} /> E-mail
                      </a>
                    )}
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded bg-green-50">
                  <ShieldCheck size={14} className="text-green-600" />
                  <span className="text-green-600 text-[0.72rem] font-bold">Autorizada YANMAR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar direita */}
          <div className="space-y-5">
            {/* Preço */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-yanmar-border">
              <h1 className="text-yanmar-dark font-extrabold text-[1.05rem] leading-tight mb-0.5">{listing.title}</h1>
              <p className="text-gray-400 text-[0.78rem] mb-3">
                {[listing.year, listing.hours_used != null && `${formatNumber(listing.hours_used)} h`].filter(Boolean).join(' · ')}
              </p>
              <p className="text-yanmar-red font-black text-[1.8rem] leading-none mb-4">{formatPrice(listing.price)}</p>
              {location && (
                <div className="flex items-center gap-1.5 text-gray-500 text-[0.8rem] mb-4">
                  <MapPin size={13} /> {location}
                </div>
              )}
              <div className="space-y-2">
                {[
                  [CheckCircle2, 'Procedência verificada'],
                  [ShieldCheck, 'Concessionária autorizada YANMAR'],
                  [Clock, 'Resposta rápida da concessionária'],
                ].map(([Icon, label]) => (
                  <div key={label} className="flex items-center gap-2 text-gray-500 text-[0.78rem]">
                    <Icon size={14} className="text-yanmar-red" /> {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Formulário de interesse */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-yanmar-border">
              <h2 className="text-yanmar-dark font-bold text-[1rem] mb-4">Tenho interesse nesta máquina</h2>
              {sent ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 bg-green-50">
                    <CheckCircle2 size={26} className="text-green-600" />
                  </div>
                  <p className="text-yanmar-dark font-bold mb-1">Interesse registrado!</p>
                  <p className="text-gray-500 text-[0.85rem]">A concessionária entrará em contato em breve.</p>
                </div>
              ) : (
                <form onSubmit={handleLead} className="space-y-3">
                  <input type="text" placeholder="Seu nome completo" required value={lead.name}
                    onChange={e => setLead(l => ({ ...l, name: e.target.value }))}
                    className="w-full border border-yanmar-border rounded px-3 py-2.5 outline-none focus:border-yanmar-red transition-colors text-[0.83rem]" />
                  <input type="tel" placeholder="Seu telefone / WhatsApp" value={lead.phone}
                    onChange={e => setLead(l => ({ ...l, phone: e.target.value }))}
                    className="w-full border border-yanmar-border rounded px-3 py-2.5 outline-none focus:border-yanmar-red transition-colors text-[0.83rem]" />
                  <input type="email" placeholder="Seu e-mail" required value={lead.email}
                    onChange={e => setLead(l => ({ ...l, email: e.target.value }))}
                    className="w-full border border-yanmar-border rounded px-3 py-2.5 outline-none focus:border-yanmar-red transition-colors text-[0.83rem]" />
                  <textarea rows={3} value={lead.message}
                    onChange={e => setLead(l => ({ ...l, message: e.target.value }))}
                    className="w-full border border-yanmar-border rounded px-3 py-2.5 outline-none focus:border-yanmar-red transition-colors resize-none text-[0.83rem]" />
                  <button type="submit" disabled={sending}
                    className="w-full text-white py-3 rounded-sm bg-yanmar-red hover:bg-yanmar-red-dark transition-colors flex items-center justify-center gap-2 text-[0.875rem] font-bold disabled:opacity-60">
                    <MessageSquare size={15} /> {sending ? 'Enviando…' : 'Enviar mensagem'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Relacionadas */}
        {listing.related?.length > 0 && (
          <div className="mt-10">
            <h2 className="text-yanmar-dark font-bold text-[1.3rem] mb-5">Máquinas relacionadas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {listing.related.map(l => <MachineCard key={l.id} listing={l} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
