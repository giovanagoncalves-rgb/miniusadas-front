import { useState, useRef } from 'react'
import { ArrowLeft, Upload, X } from 'lucide-react'
import { dealerApi } from '@/api'
import { Button, Spinner, toast } from '@/components/ui'

export default function UploadFotos({ listing, onBack }) {
  const inputRef = useRef()
  const [previews, setPreviews]  = useState([])
  const [uploading, setUploading] = useState(false)

  const handleFiles = (files) => {
    const arr = Array.from(files).slice(0, 20)
    const newPreviews = arr.map(f => ({ file: f, url: URL.createObjectURL(f) }))
    setPreviews(p => [...p, ...newPreviews].slice(0, 20))
  }

  const remove = (i) => setPreviews(p => p.filter((_, idx) => idx !== i))

  const handleUpload = async () => {
    if (!previews.length) return toast.error('Selecione ao menos uma foto.')
    setUploading(true)
    try {
      const formData = new FormData()
      previews.forEach(p => formData.append('photos', p.file))
      await dealerApi.uploadPhotos(listing.id, formData)
      toast.success(`${previews.length} foto(s) enviada(s) com sucesso!`)
      setPreviews([])
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-yanmar-dark mb-6 transition">
        <ArrowLeft size={16} /> Voltar
      </button>

      <h1 className="text-xl font-bold mb-1">Fotos do anúncio</h1>
      <p className="text-sm text-gray-500 mb-6">{listing.title}</p>

      {/* Zona de drop */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
        className="border-2 border-dashed border-yanmar-border rounded-xl p-10 text-center cursor-pointer hover:border-yanmar-red transition mb-4"
      >
        <Upload size={28} className="mx-auto text-gray-300 mb-3" />
        <p className="text-sm text-gray-500">Arraste fotos aqui ou <span className="text-yanmar-red font-medium">clique para selecionar</span></p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG ou WebP · Até 8 MB por foto · Máximo 20 fotos</p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* Pré-visualização */}
      {previews.length > 0 && (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
            {previews.map((p, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img src={p.url} alt="" className="w-full h-full object-cover" />
                <button onClick={() => remove(i)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70 transition">
                  <X size={12} />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 bg-yanmar-red text-white text-xs px-1.5 py-0.5 rounded">
                    Capa
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setPreviews([])} className="flex-1">
              Limpar
            </Button>
            <Button onClick={handleUpload} loading={uploading} className="flex-1">
              <Upload size={15} className="mr-1.5" />
              Enviar {previews.length} foto{previews.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
