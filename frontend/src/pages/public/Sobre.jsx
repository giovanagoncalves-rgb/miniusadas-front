import { ShieldCheck, Users, Award, CheckCircle } from 'lucide-react'

const FAQS = [
  { q: 'As máquinas têm procedência garantida?', a: 'Sim. Todos os equipamentos listados pertencem a concessionárias autorizadas YANMAR, com histórico de manutenção e revisão documentado.' },
  { q: 'Como funciona a compra?', a: 'A negociação é feita diretamente entre o comprador e a concessionária responsável pelo equipamento. O portal facilita o contato e garante a procedência.' },
  { q: 'Os preços são negociáveis?', a: 'Os valores são indicativos. Toda negociação é realizada diretamente com a concessionária.' },
  { q: 'Posso anunciar uma máquina?', a: 'O cadastro de anúncios é restrito à rede de concessionárias autorizadas YANMAR.' },
]

export default function Sobre() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-yanmar-dark mb-3">Sobre a Miniusadas</h1>
        <p className="text-gray-500 max-w-xl mx-auto">A plataforma oficial para compra de máquinas compactas usadas da rede autorizada YANMAR.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: <ShieldCheck size={24} />, title: 'Procedência garantida', desc: 'Todos os equipamentos são de concessionárias autorizadas com histórico verificado.' },
          { icon: <Users size={24} />,       title: 'Rede autorizada',       desc: 'Parceiros oficiais YANMAR espalhados por todo o Brasil.' },
          { icon: <Award size={24} />,       title: 'Qualidade YANMAR',      desc: 'Máquinas com padrão de qualidade e manutenção da marca.' },
        ].map((item, i) => (
          <div key={i} className="border border-yanmar-border rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-yanmar-red/10 text-yanmar-red flex items-center justify-center mx-auto mb-4">{item.icon}</div>
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-yanmar-gray rounded-xl p-8 mb-12">
        <h2 className="text-xl font-bold mb-4">Nossa missão</h2>
        <p className="text-gray-600 leading-relaxed">
          A Miniusadas nasceu para conectar compradores a equipamentos compactos usados de qualidade comprovada.
          Acreditamos que a transparência e a procedência são fundamentais em transações de alto valor.
          Por isso, todos os anúncios passam por aprovação da YANMAR antes de serem publicados.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-6">Perguntas frequentes</h2>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-yanmar-border rounded-xl p-5">
              <div className="flex gap-3">
                <CheckCircle size={18} className="text-yanmar-red shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-sm mb-1">{faq.q}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
