import { useState } from 'react'
import { Mail, Phone } from 'lucide-react'
import { Button, Input, Textarea, Select, toast } from '@/components/ui'

export default function Contato() {
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Em produção: POST /api/contact
    await new Promise(r => setTimeout(r, 1000))
    setSent(true)
    toast.success('Mensagem enviada! Retornaremos em breve.')
    setLoading(false)
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-yanmar-dark mb-3">Fale conosco</h1>
        <p className="text-gray-500">Tire suas dúvidas sobre o portal ou entre em contato com nossa equipe.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Formulário */}
        <div>
          {sent ? (
            <div className="text-center py-12 border border-yanmar-border rounded-xl">
              <div className="text-4xl mb-3">✅</div>
              <h2 className="font-semibold mb-2">Mensagem enviada!</h2>
              <p className="text-sm text-gray-500">Retornaremos em até 2 dias úteis.</p>
              <button onClick={() => setSent(false)} className="mt-4 text-sm text-yanmar-red hover:underline">
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handle} className="space-y-4 bg-white border border-yanmar-border rounded-xl p-6">
              <h2 className="text-base font-semibold mb-2">Formulário de contato</h2>
              <Input label="Nome" placeholder="Seu nome" value={form.name}
                onChange={e => set('name', e.target.value)} required />
              <Input label="E-mail" type="email" placeholder="seu@email.com" value={form.email}
                onChange={e => set('email', e.target.value)} required />
              <Select label="Assunto" value={form.subject} onChange={e => set('subject', e.target.value)}>
                <option value="">Selecione...</option>
                <option value="duvida">Dúvida sobre equipamento</option>
                <option value="suporte">Suporte técnico</option>
                <option value="parceria">Parceria / concessionária</option>
                <option value="outro">Outro</option>
              </Select>
              <Textarea label="Mensagem" placeholder="Descreva sua dúvida ou solicitação..." value={form.message}
                onChange={e => set('message', e.target.value)} required rows={5} />
              <Button type="submit" loading={loading} className="w-full">Enviar mensagem</Button>
            </form>
          )}
        </div>

        {/* Informações */}
        <div className="space-y-5">
          <div className="bg-white border border-yanmar-border rounded-xl p-6">
            <h2 className="text-base font-semibold mb-4">Informações de contato</h2>
            <div className="space-y-3">
              <a href="mailto:contato@miniusadas.com.br" className="flex items-center gap-3 text-sm text-gray-600 hover:text-yanmar-red transition">
                <Mail size={16} className="text-yanmar-red" /> contato@miniusadas.com.br
              </a>
              <a href="tel:+5511000000000" className="flex items-center gap-3 text-sm text-gray-600 hover:text-yanmar-red transition">
                <Phone size={16} className="text-yanmar-red" /> (11) 0000-0000
              </a>
            </div>
          </div>

          <div className="bg-yanmar-gray rounded-xl p-6">
            <h3 className="text-sm font-semibold mb-3">Horário de atendimento</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Segunda a sexta: 8h às 18h</p>
              <p>Sábado: 8h às 12h</p>
            </div>
          </div>

          <div className="bg-yanmar-dark text-white rounded-xl p-6">
            <h3 className="text-sm font-semibold mb-2">É concessionária YANMAR?</h3>
            <p className="text-sm text-gray-400 mb-4">Acesse o painel exclusivo para gerenciar seus anúncios.</p>
            <a href="/entrar" className="text-sm bg-yanmar-red text-white px-4 py-2 rounded-lg inline-block hover:bg-yanmar-red-dark transition">
              Acessar painel
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
