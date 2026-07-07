import { Link } from 'react-router-dom'
import { MapPin, Clock } from 'lucide-react'
import { formatPrice, formatNumber, CATEGORY_LABEL } from '@/utils/format'

export default function MachineCard({ listing }) {
  const {
    id, title, category, model, year, hours_used,
    price, cover_url, dealer_name, city, state,
  } = listing

  return (
    <Link
      to={`/maquinas/${id}`}
      className="group bg-white border border-yanmar-border rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col"
    >
      {/* Foto */}
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
        {cover_url
          ? <img src={cover_url} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">🚜</div>
        }
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-yanmar-red font-medium mb-1">
          {CATEGORY_LABEL[category] || category}
        </span>
        <h3 className="font-semibold text-sm text-yanmar-dark line-clamp-2 mb-1">{title}</h3>
        {model && <p className="text-xs text-gray-500 mb-3">{model} {year && `· ${year}`}</p>}

        <div className="mt-auto space-y-1">
          {hours_used != null && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={12} />
              <span>{formatNumber(hours_used)} horas</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin size={12} />
            <span>{city && state ? `${city} / ${state}` : dealer_name}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-yanmar-border">
          <p className="text-base font-bold text-yanmar-red">{formatPrice(price)}</p>
        </div>
      </div>
    </Link>
  )
}
