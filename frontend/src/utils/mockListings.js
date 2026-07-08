// Máquinas fictícias usadas como PLACEHOLDER visual.
// Só aparecem quando a API real não retorna anúncios (ex.: ambiente de preview
// sem backend). Em produção, os dados reais da API sempre têm prioridade.
const img = (n) => `/img/maq-${n}.jpg`

export const MOCK_LISTINGS = [
  {
    id: 'demo-1',
    title: 'Mini escavadeira YANMAR ViO17',
    category: 'mini_escavadeira',
    model: 'ViO17',
    year: 2022,
    hours_used: 320,
    price: 148000,
    cover_url: img(1),
    dealer_name: 'AgroSul Máquinas',
    city: 'Campinas',
    state: 'SP',
  },
  {
    id: 'demo-2',
    title: 'Mini pá carregadeira YANMAR V8',
    category: 'mini_pa_carregadeira',
    model: 'V8',
    year: 2021,
    hours_used: 1100,
    price: 132000,
    cover_url: img(2),
    dealer_name: 'Constru Tech SP',
    city: 'São Paulo',
    state: 'SP',
  },
  {
    id: 'demo-3',
    title: 'Mini retroescavadeira YANMAR CBL40',
    category: 'mini_retroescavadeira',
    model: 'CBL40',
    year: 2019,
    hours_used: 2400,
    price: 98000,
    cover_url: img(3),
    dealer_name: 'Máquinas Ribeirão',
    city: 'Ribeirão Preto',
    state: 'SP',
  },
  {
    id: 'demo-4',
    title: 'Mini escavadeira YANMAR ViO55',
    category: 'mini_escavadeira',
    model: 'ViO55',
    year: 2023,
    hours_used: 180,
    price: 210000,
    cover_url: img(4),
    dealer_name: 'Constru Paraná',
    city: 'Curitiba',
    state: 'PR',
  },
  {
    id: 'demo-5',
    title: 'Mini pá carregadeira YANMAR V4',
    category: 'mini_pa_carregadeira',
    model: 'V4',
    year: 2020,
    hours_used: 950,
    price: 89000,
    cover_url: img(5),
    dealer_name: 'Energia Sul RS',
    city: 'Porto Alegre',
    state: 'RS',
  },
  {
    id: 'demo-6',
    title: 'Mini escavadeira YANMAR ViO35',
    category: 'mini_escavadeira',
    model: 'ViO35',
    year: 2021,
    hours_used: 640,
    price: 165000,
    cover_url: img(6),
    dealer_name: 'YANMAR Agro Goiás',
    city: 'Goiânia',
    state: 'GO',
  },
]

// Especificações técnicas de exemplo por categoria.
const MOCK_SPECS = {
  mini_escavadeira: {
    'Potência do motor': '14,5 CV',
    'Peso operacional': '1.720 kg',
    'Profundidade de escavação': '2.300 mm',
    'Largura da esteira': '230 mm',
    'Capacidade da caçamba': '0,04 m³',
    'Tipo de motor': 'Diesel 3 cilindros',
  },
  mini_pa_carregadeira: {
    'Potência do motor': '26 CV',
    'Peso operacional': '2.100 kg',
    'Capacidade de carga': '600 kg',
    'Altura de despejo': '2.200 mm',
    'Tração': '4x4',
    'Tipo de motor': 'Diesel 3 cilindros',
  },
  mini_retroescavadeira: {
    'Potência do motor': '40 CV',
    'Peso operacional': '2.800 kg',
    'Profundidade de escavação': '2.600 mm',
    'Capacidade da caçamba': '0,08 m³',
    'Tração': '4x2',
    'Tipo de motor': 'Diesel 3 cilindros',
  },
}

// Fotos extras de exemplo para o carrossel da página de detalhes.
const EXTRA_PHOTOS = ['/img/hero.jpg', '/img/cta-comprador.jpg']

// Retorna um anúncio de exemplo (formato da página de detalhes) para um id,
// usado como fallback quando a API não está disponível no preview.
export function getMockListing(id) {
  const base = MOCK_LISTINGS.find(l => String(l.id) === String(id)) || MOCK_LISTINGS[0]
  return {
    ...base,
    description:
      `${base.title} em excelente estado de conservação, revisada e com procedência garantida por concessionária autorizada YANMAR. ` +
      `Máquina com ${base.hours_used} horas de uso, ano ${base.year}, pronta para trabalhar.`,
    photos: [{ url: base.cover_url }, ...EXTRA_PHOTOS.map(url => ({ url }))],
    specs: MOCK_SPECS[base.category] || {},
    dealer_phone: '(19) 3333-4444',
    dealer_email: 'contato@concessionaria.com.br',
    related: MOCK_LISTINGS.filter(l => l.id !== base.id).slice(0, 4),
  }
}
