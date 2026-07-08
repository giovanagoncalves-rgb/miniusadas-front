import { Link } from 'react-router-dom'
import { MapPin, ChevronRight } from 'lucide-react'
import { formatPrice, formatNumber, CATEGORY_LABEL } from '@/utils/format'

export default function MachineCard({ listing }) {
  const {
    id, title, category, model, year, hours_used,
    price, cover_url, dealer_name, city, state,
  } = listing

  const location = city && state ? `${city} - ${state}` : dealer_name
  const meta = [year, hours_used != null && `${formatNumber(hours_used)} h`]
    .filter(Boolean)
    .join(' · ')

  return (
    <Link
      to={`/maquinas/${id}`}
      className="group block bg-white rounded-xl overflow-hidden border border-yanmar-border hover:shadow-md hover:border-yanmar-red/20 transition-all"
    >
      {/* Foto */}
      <div className="relative overflow-hidden h-[180px] bg-gray-100">
        {cover_url
          ? <img src={cover_url} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">🚜</div>
        }
        <span className="absolute top-3 left-3 bg-yanmar-red text-white px-2 py-0.5 rounded-sm text-[0.68rem] font-bold uppercase tracking-wide">
          {CATEGORY_LABEL[category] || category}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-yanmar-dark font-bold text-[0.9rem] leading-snug mb-1 line-clamp-2">{title}</h3>
        <p className="text-gray-400 text-[0.75rem] mb-3 flex items-center gap-1">
          {meta && <span>{meta} · </span>}
          <MapPin size={11} className="inline" /> {location}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-yanmar-border">
          <span className="text-yanmar-red font-extrabold text-[1.05rem]">{formatPrice(price)}</span>
          <span className="text-yanmar-red flex items-center gap-0.5 group-hover:gap-1.5 transition-all text-[0.78rem] font-semibold">
            Ver detalhes <ChevronRight size={13} />
          </span>
        </div>

        {dealer_name && (
          <p className="text-gray-400 text-[0.72rem] mt-2">{dealer_name}</p>
        )}
      </div>
    </Link>
  )
}
