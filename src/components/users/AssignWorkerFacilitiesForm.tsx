import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AxiosInstance from '../../config/axios'
import type {
  FacilityResponse,
  FacilityWorkerRequest,
  FacilityWorkerResponse,
  UserResponse,
} from '../../entities/Entities'
import { useClubIdStore, useFacilityStore, useUserStore } from '../../store/store'

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
  const assignWorkerFacilities = useUserStore((s) => s.assignWorkerFacilities)
  const [selectedFacilityIds, setSelectedFacilityIds] = useState<number[]>([0])
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

  const assignedFacilities = useMemo(() => {
    if (worker.facilities && worker.facilities.length > 0) {
      return worker.facilities
    }
    return facilities.filter((f) => isWorkerAssignedToFacility(f, worker.id))
  }, [facilities, worker.facilities, worker.id])

  const availableFacilities = useMemo(
    () => facilities.filter((f) => !isWorkerAssignedToFacility(f, worker.id)),
    [facilities, worker.id],
  )

  const getOptionsForRow = (rowIndex: number) => {
    const selectedElsewhere = selectedFacilityIds
      .map((id, idx) => (idx === rowIndex ? 0 : id))
      .filter((id) => id > 0)
    return availableFacilities.filter((f) => !selectedElsewhere.includes(f.id))
  }

  const addRow = () => {
    if (selectedFacilityIds.length >= availableFacilities.length) return
    setSelectedFacilityIds((prev) => [...prev, 0])
  }

  const removeRow = (index: number) => {
    setSelectedFacilityIds((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev,
    )
  }

  const updateRow = (index: number, facilityId: number) => {
    setSelectedFacilityIds((prev) =>
      prev.map((id, i) => (i === index ? facilityId : id)),
    )
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clubId) return

    const facilityId = [
      ...new Set(selectedFacilityIds.filter((id) => id > 0)),
    ]
    if (facilityId.length === 0) {
      alert('Seleccioná al menos una instalación')
      return
    }

    const request: FacilityWorkerRequest = {
      facilityId,
      userId: worker.id,
      userTypeId: worker.typeId,
      clubId,
    }

    setLoading(true)
    try {
      const response = await AxiosInstance.post<FacilityWorkerResponse>(
        '/facility-workers',
        request,
      )
      console.log(response.data)
      assignWorkerFacilities(response.data)
      setSelectedFacilityIds([0])
      alert(
        facilityId.length === 1
          ? 'Instalación asignada correctamente'
          : 'Instalaciones asignadas correctamente',
      )
    } catch (error) {
      alert('Error al asignar las instalaciones')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const hasValidSelection = selectedFacilityIds.some((id) => id > 0)

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
              const fromStore = facilities.find((f) => f.id === facility.id)
              const role = fromStore
                ? getAssignmentRole(fromStore, worker.id)
                : facility.responsibleWorker?.id === worker.id
                  ? 'responsable'
                  : 'asistente'
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
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <label className="block text-sm font-medium text-slate-700">
              Agregar instalaciones (como asistente)
            </label>
            <button
              type="button"
              onClick={addRow}
              disabled={
                loading || selectedFacilityIds.length >= availableFacilities.length
              }
              className="text-sm font-medium text-slate-700 underline hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              + Agregar otra
            </button>
          </div>

          {availableFacilities.length === 0 ? (
            <p className="text-sm text-slate-500">No hay instalaciones disponibles</p>
          ) : (
            <div className="space-y-2">
              {selectedFacilityIds.map((selectedId, index) => {
                const rowOptions = getOptionsForRow(index)
                return (
                  <div key={index} className="flex gap-2">
                    <select
                      aria-label={`Instalación ${index + 1}`}
                      value={selectedId}
                      onChange={(e) => updateRow(index, Number(e.target.value))}
                      disabled={loading}
                      className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
                    >
                      <option value={0}>Seleccionar instalación</option>
                      {rowOptions.map((facility) => (
                        <option key={facility.id} value={facility.id}>
                          {facility.type}
                        </option>
                      ))}
                      {selectedId > 0 &&
                        !rowOptions.some((f) => f.id === selectedId) && (
                          <option value={selectedId}>
                            {facilities.find((f) => f.id === selectedId)?.type ??
                              `Instalación #${selectedId}`}
                          </option>
                        )}
                    </select>
                    {selectedFacilityIds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        disabled={loading}
                        className="shrink-0 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                        aria-label="Quitar fila"
                      >
                        Quitar
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !hasValidSelection}
          className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Asignando…' : 'Asignar instalaciones'}
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
