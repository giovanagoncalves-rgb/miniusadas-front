export const formatPrice = (v) =>
  v != null
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
    : 'Consulte'

export const formatNumber = (v) =>
  v != null ? new Intl.NumberFormat('pt-BR').format(v) : '—'

export const CATEGORY_LABEL = {
  mini_escavadeira:      'Mini escavadeira',
  mini_pa_carregadeira:  'Mini pá carregadeira',
  mini_retroescavadeira: 'Mini retroescavadeira',
}

export const STATUS_LABEL = {
  draft:            'Rascunho',
  pending_approval: 'Em aprovação',
  published:        'Publicado',
  paused:           'Pausado',
  sold:             'Vendido',
  deleted:          'Excluído',
}

export const STATUS_COLOR = {
  draft:            'bg-gray-100 text-gray-600',
  pending_approval: 'bg-amber-100 text-amber-700',
  published:        'bg-green-100 text-green-700',
  paused:           'bg-blue-100 text-blue-700',
  sold:             'bg-purple-100 text-purple-700',
  deleted:          'bg-red-100 text-red-600',
}
