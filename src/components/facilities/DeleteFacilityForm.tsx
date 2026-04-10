import { useNavigate } from 'react-router-dom'
import type { FacilityResponse } from '../../entities/Entities'
import { useClubIdStore, useFacilityStore } from '../../store/store'
import AxiosInstance from '../../config/axios'
import { useState } from 'react'

export interface DeleteFacilityFormProps {
  facility: FacilityResponse | null
}

export default function DeleteFacilityForm({ facility }: DeleteFacilityFormProps) {
  const navigate = useNavigate()
  const clubIdFromStore = useClubIdStore((state) => state.clubId)
  const deleteFacility = useFacilityStore((state) => state.deleteFacility)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!facility?.id) return
    const clubId = facility.clubId ?? clubIdFromStore
    if (!clubId) {
      setError('No se pudo determinar el club de la instalación.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await AxiosInstance.delete(`/facilities/${facility.id}?clubId=${clubId}`)
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
    <div className="mx-auto w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-700">¿Estás seguro de que querés eliminar esta instalación?</p>

        <div className="space-y-1.5">
          <label htmlFor="delete-facility-id" className="block text-sm font-medium text-slate-700">ID</label>
          <input id="delete-facility-id" type="number" value={facility.id} disabled readOnly className="w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-700" />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="delete-facility-type" className="block text-sm font-medium text-slate-700">Tipo</label>
          <input id="delete-facility-type" type="text" value={facility.type} disabled readOnly className="w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-700" />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="delete-facility-capacity" className="block text-sm font-medium text-slate-700">Aforo</label>
          <input id="delete-facility-capacity" type="number" value={facility.capacity} disabled readOnly className="w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-700" />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2">
          <button type="submit" className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed disabled:opacity-70" disabled={loading}>
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
          <button type="button" className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200" onClick={() => navigate('/instalaciones')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

