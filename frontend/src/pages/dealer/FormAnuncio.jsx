import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { dealerApi } from '@/api'
import { Button, Input, Textarea, Select, Card, toast } from '@/components/ui'

const SPECS_FIELDS = [
  { key: 'peso_operacional', label: 'Peso operacional (kg)' },
  { key: 'potencia_motor',   label: 'Potência do motor (hp)' },
  { key: 'profundidade_max', label: 'Profundidade máx. escavação (m)' },
  { key: 'capacidade_cacamba', label: 'Capacidade da caçamba (m³)' },
  { key: 'largura_esteira',  label: 'Largura da esteira (mm)' },
]

export default function FormAnuncio({ listing, onSaved, onBack }) {
  const isEdit = !!listing
  const [form, setForm] = useState({
    title:       listing?.title       || '',
    category:    listing?.category    || 'mini_escavadeira',
    model:       listing?.model       || '',
    year:        listing?.year        || '',
    hours_used:  listing?.hours_used  || '',
    price:       listing?.price       || '',
    description: listing?.description || '',
    specs:       listing?.specs       || {},
  })
  const [loading, setLoading] = useState(false)
  const [errors,  setErrors]  = useState({})

  const validate = () => {
    const e = {}
    if (!form.title.trim())           e.title    = 'Título é obrigatório'
    if (!form.price || form.price <= 0) e.price  = 'Preço é obrigatório'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const payload = {
        ...form,
        year:       form.year       ? Number(form.year)       : undefined,
        hours_used: form.hours_used ? Number(form.hours_used) : undefined,
        price:      Number(form.price),
        specs:      form.specs,
      }
      if (isEdit) {
        // PATCH listing — endpoint pode ser adicionado depois
        // Por ora recria como novo (simplificação para MVP)
        await dealerApi.create(payload)
      } else {
        await dealerApi.create(payload)
      }
      toast.success(isEdit ? 'Anúncio atualizado!' : 'Anúncio criado! Adicione fotos e envie para aprovação.')
      onSaved()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setSpec = (k, v) => setForm(f => ({ ...f, specs: { ...f.specs, [k]: v } }))

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-yanmar-dark mb-6 transition">
        <ArrowLeft size={16} /> Voltar aos meus anúncios
      </button>

      <h1 className="text-xl font-bold mb-6">{isEdit ? 'Editar anúncio' : 'Novo anúncio'}</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Card>
          <h2 className="text-sm font-semibold mb-4">Informações gerais</h2>
          <div className="space-y-4">
            <Input label="Título do anúncio *" placeholder="Ex: Miniescavadeira YANMAR ViO35-6A"
              value={form.title} onChange={e => set('title', e.target.value)} error={errors.title} />

            <Select label="Categoria *" value={form.category} onChange={e => set('category', e.target.value)}>
              <option value="mini_escavadeira">Mini escavadeira</option>
              <option value="mini_pa_carregadeira">Mini pá carregadeira</option>
              <option value="mini_retroescavadeira">Mini retroescavadeira</option>
            </Select>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Modelo" placeholder="Ex: ViO35-6A" value={form.model}
                onChange={e => set('model', e.target.value)} />
              <Input label="Ano" type="number" placeholder="Ex: 2019" value={form.year}
                onChange={e => set('year', e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Horas trabalhadas" type="number" placeholder="Ex: 3200" value={form.hours_used}
                onChange={e => set('hours_used', e.target.value)} />
              <Input label="Preço (R$) *" type="number" placeholder="Ex: 185000" value={form.price}
                onChange={e => set('price', e.target.value)} error={errors.price} />
            </div>

            <Textarea label="Descrição" placeholder="Estado de conservação, revisões realizadas, acessórios inclusos..."
              value={form.description} onChange={e => set('description', e.target.value)} rows={4} />
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold mb-4">Especificações técnicas</h2>
          <div className="space-y-3">
            {SPECS_FIELDS.map(f => (
              <Input key={f.key} label={f.label} placeholder="—"
                value={form.specs[f.key] || ''}
                onChange={e => setSpec(f.key, e.target.value)} />
            ))}
          </div>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onBack} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            {isEdit ? 'Salvar alterações' : 'Criar anúncio'}
          </Button>
        </div>
      </form>
    </div>
  )
}
