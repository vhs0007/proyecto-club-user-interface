import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AxiosInstance from '../../config/axios'
import type { Facility, FacilityResponse, FacilityWorkerRequest, UserResponse } from '../../entities/Entities'
import { useClubIdStore, useFacilityStore } from '../../store/store'

function isWorkerAssignedToFacility(
  facility: FacilityResponse,
  workerId: number,
): boolean {
  if (facility.responsibleWorker?.id === workerId) return true
  return (
    facility.assistantWorkers?.some((aw) => aw.id === workerId) ?? false
  )
}

function getAssignmentRole(
  facility: FacilityResponse,
  workerId: number,
): 'responsable' | 'asistente' | null {
  if (facility.responsibleWorker?.id === workerId) return 'responsable'
  if (facility.assistantWorkers?.some((aw) => aw.id === workerId)) return 'asistente'
  return null
}

export default function AssignWorkerFacilitiesForm({
  worker,
}: {
  worker: UserResponse
}) {
  const navigate = useNavigate()
  const clubId = useClubIdStore((s) => s.clubId)
  const facilities = useFacilityStore((s) => s.facilities)
  const setFacilities = useFacilityStore((s) => s.setFacilities)
  const updateFacility = useFacilityStore((s) => s.updateFacility)
  const [selectedFacilityId, setSelectedFacilityId] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [loadingFacilities, setLoadingFacilities] = useState(false)

  useEffect(() => {
    if (!clubId || facilities.length > 0) return

    const loadFacilities = async () => {
      setLoadingFacilities(true)
      try {
        const response = await AxiosInstance.get<FacilityResponse[]>(
          `/facilities?clubId=${clubId}`,
        )
        setFacilities(response.data ?? [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoadingFacilities(false)
      }
    }

    void loadFacilities()
  }, [clubId, facilities.length, setFacilities])

  const assignedFacilities = useMemo(
    () => facilities.filter((f) => isWorkerAssignedToFacility(f, worker.id)),
    [facilities, worker.id],
  )

  const availableFacilities = useMemo(
    () => facilities.filter((f) => !isWorkerAssignedToFacility(f, worker.id)),
    [facilities, worker.id],
  )

  const refreshFacilities = async () => {
    if (!clubId) return
    const response = await AxiosInstance.get<FacilityResponse[]>(
      `/facilities?clubId=${clubId}`,
    )
    setFacilities(response.data ?? [])
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clubId || selectedFacilityId < 1) {
      alert('Seleccioná una instalación')
      return
    }

    const facility = facilities.find((f) => f.id === selectedFacilityId)
    if (!facility) {
      alert('Instalación no encontrada')
      return
    }

    const currentAssistantIds =
      facility.assistantWorkers?.map((aw) => aw.id) ?? []
    const assistantWorkers = [...new Set([...currentAssistantIds, worker.id])]

    const request: FacilityWorkerRequest = {
      facilityId: facility.id,
      userId: worker.id,
      userTypeId: worker.typeId,
      clubId: clubId,
    }

    setLoading(true)
    try {
      const response = await AxiosInstance.patch<FacilityResponse>(
        `/facility-workers/${facility.id}`,
        request,
      )
      updateFacility(response.data)
      await refreshFacilities()
      setSelectedFacilityId(0)
      alert('Instalación asignada correctamente')
    } catch (error) {
      alert('Error al asignar la instalación')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-700">
        <p className="font-medium text-slate-800">{worker.name}</p>
        <p className="text-slate-500">{worker.email || 'Sin email'}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-700">Instalaciones asignadas</h3>
        {loadingFacilities ? (
          <p className="text-sm text-slate-500">Cargando instalaciones…</p>
        ) : assignedFacilities.length === 0 ? (
          <p className="rounded-md border border-dashed border-slate-200 bg-slate-50 py-6 text-center text-sm text-slate-500">
            Este trabajador no tiene instalaciones asignadas
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 rounded-md border border-slate-200 bg-white">
            {assignedFacilities.map((facility) => {
              const role = getAssignmentRole(facility, worker.id)
              return (
                <li
                  key={facility.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                >
                  <span className="font-medium text-slate-800">{facility.type}</span>
                  <span
                    className={
                      role === 'responsable'
                        ? 'listBadgeStatusActive'
                        : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600'
                    }
                  >
                    {role === 'responsable' ? 'Responsable' : 'Asistente'}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="space-y-1.5">
          <label
            htmlFor="facilityId"
            className="block text-sm font-medium text-slate-700"
          >
            Agregar instalación (como asistente)
          </label>
          <select
            id="facilityId"
            value={selectedFacilityId}
            onChange={(e) => setSelectedFacilityId(Number(e.target.value))}
            disabled={loading || availableFacilities.length === 0}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
          >
            <option value={0}>
              {availableFacilities.length === 0
                ? 'No hay instalaciones disponibles'
                : 'Seleccionar instalación'}
            </option>
            {availableFacilities.map((facility) => (
              <option key={facility.id} value={facility.id}>
                {facility.type}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || selectedFacilityId < 1}
          className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Asignando…' : 'Asignar instalación'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => navigate('/trabajadores')}
        className="text-sm text-slate-600 underline hover:text-slate-800"
      >
        Volver al listado
      </button>
    </div>
  )
}