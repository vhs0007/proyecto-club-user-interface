import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Facility, FacilityResponse, MembershipType } from '../../entities/Entities'
import AxiosInstance from '../../config/axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useClubIdStore, useCreateFacilityStore, useFacilityStore, useMembershipTypeStore, useUserStore } from '../../store/store'
import SelectActivityMembers from '../scheduledActivities/SelectActivityMembers'

const formSchema = z.object({
  responsibleWorker: z.number().min(1),
})

type FormData = z.infer<typeof formSchema>

export default function EditFacilityFormSecondStep({ facility }: { facility: FacilityResponse | null }) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const clubIdFromStore = useClubIdStore((s) => s.clubId)

  const [membershipTypeIds, setMembershipTypeIds] = useState<number[]>([])
  const [assistantWorkerIds, setAssistantWorkerIds] = useState<number[]>([])
  const [membersModalOpen, setMembersModalOpen] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      responsibleWorker: 0,
    },
  })

  const responsibleWorkerId = watch('responsibleWorker')
  const users = useUserStore((state) => state.users)
  const workerUsers = users.filter((u) => u.typeId === 1)
  const membershipTypes: MembershipType[] = useMembershipTypeStore((state) => state.membershipTypes)

  useEffect(() => {
    if (!facility) return

    reset({
      responsibleWorker: facility.responsibleWorker?.id ?? 0,
    })
    setAssistantWorkerIds(
      (facility.assistantWorkers ?? []).map((aw) => aw.id),
    )
    setMembershipTypeIds(facility.membershipTypes.map((mt) => mt.id))
  }, [facility, reset])

  useEffect(() => {
    if (responsibleWorkerId > 0) {
      setAssistantWorkerIds((prev) =>
        prev.filter((workerId) => workerId !== responsibleWorkerId),
      )
    }
  }, [responsibleWorkerId])

  const selectedAssistantNames = users
    .filter((u) => u.typeId === 1 && assistantWorkerIds.includes(u.id))
    .map((u) => u.name)
    .join(', ')

  const toggleMembershipType = (membershipTypeId: number) => {
    setMembershipTypeIds((prev) =>
      prev.includes(membershipTypeId)
        ? prev.filter((v) => v !== membershipTypeId)
        : [...prev, membershipTypeId],
    )
  }

  const onSubmit = async (data: FormData) => {
    if (!facility?.id || !id) return

    const secondStep = {
      responsibleWorker: data.responsibleWorker,
      assistantWorkers: assistantWorkerIds,
      membershipTypeIds,
    }

    useCreateFacilityStore.getState().setSecondStep(secondStep)

    try {
      const resolvedClubId = facility.clubId ?? clubIdFromStore
      if (!resolvedClubId) {
        alert('No se pudo determinar el club de la instalación')
        return
      }
      const request: Facility = {
        type: useCreateFacilityStore.getState().firstStep.type,
        capacity: useCreateFacilityStore.getState().firstStep.capacity,
        responsibleWorker: data.responsibleWorker,
        ...(assistantWorkerIds.length > 0 ? { assistantWorkers: assistantWorkerIds } : {}),
        membershipTypeIds,
        clubId: resolvedClubId,
        isActive: facility.isActive,
      }

      const response = await AxiosInstance.patch<FacilityResponse>(
        `/facilities/${facility.id}?clubId=${resolvedClubId}`,
        request,
      )

      if (response) {
        useFacilityStore.getState().updateFacility(response.data)
        alert('Instalación actualizada correctamente')
        navigate('/instalaciones')
      }
    } catch (error) {
      alert('Error al actualizar la instalación')
      console.error(error)
    }
  }

  if (!facility) return null

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <input type="hidden" value={facility.id} />

        <div className="space-y-1.5">
          <label htmlFor="responsibleWorker" className="block text-sm font-medium text-slate-700">
            Trabajador Encargado
          </label>
          <select
            id="responsibleWorker"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register('responsibleWorker', { valueAsNumber: true })}
          >
            <option value={0}>Seleccionar encargado</option>
            {workerUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {errors.responsibleWorker && (
            <span className="text-sm text-red-600">{errors.responsibleWorker.message}</span>
          )}
        </div>

        <div className="space-y-1.5">
          <span className="block text-sm font-medium text-slate-700">
            Trabajadores asistentes (opcional)
          </span>
          <button
            type="button"
            className="activityFormControl w-full text-left"
            onClick={() => setMembersModalOpen(true)}
          >
            {assistantWorkerIds.length > 0
              ? `${assistantWorkerIds.length} seleccionado(s)`
              : 'Seleccionar asistentes'}
          </button>
          {selectedAssistantNames && (
            <p className="text-sm text-slate-600">{selectedAssistantNames}</p>
          )}
        </div>

        <SelectActivityMembers
          open={membersModalOpen}
          onClose={() => setMembersModalOpen(false)}
          selectedIds={assistantWorkerIds}
          onConfirm={setAssistantWorkerIds}
          excludeUserIds={responsibleWorkerId > 0 ? [responsibleWorkerId] : []}
        />

        <div className="space-y-1.5">
          <label htmlFor="membershipTypeIds" className="block text-sm font-medium text-slate-700">
            Seleccione Tipos de membresía
          </label>
          <div className="flex flex-wrap gap-2">
            {membershipTypes.map((membershipType) => {
              const selected = membershipTypeIds.includes(membershipType.id)
              return (
                <button
                  key={membershipType.id}
                  type="button"
                  className={`facilitySelectButton ${selected ? 'facilitySelectButton--selected' : 'facilitySelectButton--unselected'}`}
                  onClick={() => toggleMembershipType(membershipType.id)}
                >
                  {membershipType.name}
                </button>
              )
            })}
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          Guardar
        </button>
      </form>
    </div>
  )
}
