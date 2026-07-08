import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, ChevronDown } from 'lucide-react'
import { toast } from '@/components/ui'

const CHANNELS = [
  { icon: Phone,         title: 'Telefone / SAC', info: '0800 722 7777',            sub: 'Segunda a sexta, 8h às 18h', href: 'tel:08007227777' },
  { icon: Mail,          title: 'E-mail',         info: 'miniusadas@yanmar.com.br', sub: 'Resposta em até 1 dia útil',  href: 'mailto:miniusadas@yanmar.com.br' },
  { icon: MessageSquare, title: 'WhatsApp',       info: '(11) 99999-8888',          sub: 'Segunda a sábado, 8h às 20h', href: '#' },
  { icon: Clock,         title: 'Atendimento',    info: 'Seg–Sex: 8h às 18h',       sub: 'Sábado: 8h às 13h',           href: null },
]

const FAQS = [
  { q: 'Quem pode anunciar máquinas na plataforma?', a: 'A plataforma é exclusiva para concessionárias YANMAR autorizadas. Se você já é revendedor, acesse o painel da concessionária com suas credenciais.' },
  { q: 'As máquinas passam por verificação?', a: 'Sim. Todos os anúncios são cadastrados por concessionárias autorizadas e aprovados pela YANMAR antes da publicação.' },
  { q: 'Como funciona a negociação?', a: 'A negociação é feita diretamente entre o comprador e a concessionária responsável pelo equipamento. O portal facilita o contato e garante a procedência.' },
  { q: 'Posso agendar uma visita para ver a máquina?', a: 'Sim. Após o contato com a concessionária, você pode agendar uma visita para ver o equipamento presencialmente.' },
]

export default function Contato() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Em produção: POST /api/contact
    await new Promise(r => setTimeout(r, 900))
    setSent(true)
    toast.success('Mensagem enviada! Retornaremos em breve.')
    setLoading(false)
  }

  return (
    <div className="bg-yanmar-gray min-h-screen">
      {/* Header */}
      <div className="bg-yanmar-dark py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-white font-extrabold text-[2rem] mb-3">Fale conosco</h1>
          <p className="text-white/65 text-[0.95rem] leading-relaxed">
            Nossa equipe está pronta para ajudar. Escolha o canal de atendimento mais conveniente para você.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Canais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {CHANNELS.map(({ icon: Icon, title, info, sub, href }) => (
            <div key={title} className="bg-white rounded-xl p-5 border border-yanmar-border shadow-sm text-center">
              <div className="w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-3 bg-yanmar-red/[0.08]">
                <Icon size={20} className="text-yanmar-red" />
              </div>
              <p className="text-gray-500 text-[0.72rem] font-bold uppercase tracking-wide mb-0.5">{title}</p>
              {href
                ? <a href={href} className="text-yanmar-dark hover:text-yanmar-red transition-colors block mb-1 text-[0.9rem] font-bold">{info}</a>
                : <p className="text-yanmar-dark mb-1 text-[0.9rem] font-bold">{info}</p>}
              <p className="text-gray-400 text-[0.75rem]">{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-7 border border-yanmar-border shadow-sm">
              <h2 className="text-yanmar-dark font-bold text-[1.2rem] mb-5">Envie uma mensagem</h2>
              {sent ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-green-50">
                    <Send size={28} className="text-green-600" />
                  </div>
                  <p className="text-yanmar-dark font-bold text-[1.1rem] mb-2">Mensagem enviada!</p>
                  <p className="text-gray-500 text-[0.875rem]">Retornaremos em até 1 dia útil.</p>
                  <button onClick={() => setSent(false)} className="mt-4 text-yanmar-red text-[0.85rem] font-semibold hover:underline">Enviar outra mensagem</button>
                </div>
              ) : (
                <form onSubmit={handle} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Nome completo *">
                      <input required type="text" placeholder="Seu nome" value={form.name} onChange={e => set('name', e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Telefone">
                      <input type="tel" placeholder="(11) 99999-9999" value={form.phone} onChange={e => set('phone', e.target.value)} className={inputCls} />
                    </Field>
                  </div>
                  <Field label="E-mail *">
                    <input required type="email" placeholder="seu@email.com" value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Assunto *">
                    <select required value={form.subject} onChange={e => set('subject', e.target.value)} className={`${inputCls} text-gray-700`}>
                      <option value="">Selecione o assunto</option>
                      <option>Dúvida sobre uma máquina</option>
                      <option>Quero me tornar concessionária</option>
                      <option>Suporte da plataforma</option>
                      <option>Reclamação ou sugestão</option>
                      <option>Outros</option>
                    </select>
                  </Field>
                  <Field label="Mensagem *">
                    <textarea required rows={5} placeholder="Descreva sua dúvida ou necessidade..." value={form.message} onChange={e => set('message', e.target.value)} className={`${inputCls} resize-none`} />
                  </Field>
                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 text-white py-3 rounded-sm bg-yanmar-red hover:bg-yanmar-red-dark transition-colors text-[0.9rem] font-bold disabled:opacity-60">
                    <Send size={15} /> {loading ? 'Enviando…' : 'Enviar mensagem'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* FAQ + institucional */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl p-6 border border-yanmar-border shadow-sm">
              <h2 className="text-yanmar-dark font-bold text-[1rem] mb-4">Perguntas frequentes</h2>
              <div className="space-y-2">
                {FAQS.map((faq, i) => (
                  <div key={i} className="border border-yanmar-border rounded-lg overflow-hidden">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left hover:bg-yanmar-gray transition-colors">
                      <span className="text-gray-700 pr-4 text-[0.82rem] font-semibold">{faq.q}</span>
                      <ChevronDown size={15} className={`flex-shrink-0 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4">
                        <p className="text-gray-500 text-[0.8rem] leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-yanmar-border shadow-sm">
              <h2 className="text-yanmar-dark font-bold text-[1rem] mb-4">Informações institucionais</h2>
              <div className="space-y-3">
                <InfoRow icon={MapPin} title="YANMAR Brasil">
                  Rede autorizada de concessionárias em todo o território nacional
                </InfoRow>
                <InfoRow icon={Phone} title="Central de atendimento">
                  0800 722 7777 (gratuito)
                </InfoRow>
                <InfoRow icon={Mail} title="E-mail institucional">
                  <a href="mailto:miniusadas@yanmar.com.br" className="hover:text-yanmar-red transition-colors">miniusadas@yanmar.com.br</a>
                </InfoRow>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const inputCls = 'w-full border border-yanmar-border rounded px-3 py-2.5 outline-none focus:border-yanmar-red transition-colors text-[0.85rem]'

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-gray-600 mb-1.5 text-[0.8rem] font-semibold">{label}</label>
      {children}
    </div>
  )
}

function InfoRow({ icon: Icon, title, children }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={15} className="text-yanmar-red flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-gray-700 text-[0.82rem] font-semibold">{title}</p>
        <p className="text-gray-400 text-[0.78rem]">{children}</p>
      </div>
    </div>
  )
}
