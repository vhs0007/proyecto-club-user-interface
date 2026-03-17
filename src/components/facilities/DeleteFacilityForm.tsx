import { useNavigate } from 'react-router-dom'
import type { FacilityResponse } from '../../entities/Entities'
import { useFacilityStore } from '../../store/store'
import AxiosInstance from '../../config/axios'
import { useState } from 'react'

export interface DeleteFacilityFormProps {
  facility: FacilityResponse | null
}

export default function DeleteFacilityForm({ facility }: DeleteFacilityFormProps) {
  const navigate = useNavigate()
  const deleteFacility = useFacilityStore((state) => state.deleteFacility)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!facility?.id) return

    setLoading(true)
    setError(null)

    try {
      await AxiosInstance.delete(`/facilities/${facility.id}`)
      deleteFacility(facility.id)
      navigate('/instalaciones')
    } catch {
      setError('No se pudo eliminar la instalación. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (!facility) return null

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-3">¿Estás seguro de que querés eliminar esta instalación?</p>

      <div className="mb-3">
        <label className="form-label">ID</label>
        <input type="number" value={facility.id} disabled readOnly className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Tipo</label>
        <input type="text" value={facility.type} disabled readOnly className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Aforo</label>
        <input type="number" value={facility.capacity} disabled readOnly className="form-control" />
      </div>

      {error && <p className="text-danger mb-2">{error}</p>}

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-danger" disabled={loading}>
          {loading ? 'Eliminando...' : 'Eliminar'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/instalaciones')}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

