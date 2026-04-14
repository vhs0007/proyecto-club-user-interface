import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Facility, FacilityResponse, MembershipType, UserResponse } from '../../entities/Entities'
import AxiosInstance from '../../config/axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useClubIdStore, useCreateFacilityStore, useFacilityStore, useMembershipTypeStore, useUserStore } from '../../store/store'

const formSchema = z.object({
  responsibleWorker: z.number().min(1),
  assistantWorker: z.number().min(1),
})

type FormData = z.infer<typeof formSchema>

export default function EditFacilityFormSecondStep({ facility }: { facility: FacilityResponse | null }) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const clubIdFromStore = useClubIdStore((s) => s.clubId)

  const [membershipTypeIds, setMembershipTypeIds] = useState<number[]>([])
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      responsibleWorker: facility?.responsibleWorker?.id ?? 0,
      assistantWorker: facility?.assistantWorker?.id ?? 0,
    },
  })

  const users: UserResponse[] = useUserStore((state) => state.users)
  const workerUsers = users.filter((u) => u.typeId === 1)
  const membershipTypes: MembershipType[] = useMembershipTypeStore((state) => state.membershipTypes)

  useEffect(() => {
    if (!facility) return

    setMembershipTypeIds(facility.membershipTypes.map((mt) => mt.id))

  }, [facility])

  const toggleMembershipType = (membershipTypeId: number) => {
    setMembershipTypeIds((prev) =>
      prev.includes(membershipTypeId)
        ? prev.filter((v) => v !== membershipTypeId)
        : [...prev, membershipTypeId]
    )
  }

  const onSubmit = async (data: FormData) => {
    if (!facility?.id || !id) return

    const secondStep = {
      responsibleWorker: data.responsibleWorker,
      assistantWorker: data.assistantWorker,
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
        assistantWorker: data.assistantWorker,
        membershipTypeIds,
        clubId: facility.clubId,
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
        <label htmlFor="responsibleWorker" className="block text-sm font-medium text-slate-700">Trabajador Encargado</label>
        <select
          id="responsibleWorker"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          {...register('responsibleWorker', { valueAsNumber: true })}
        >
          {workerUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        {errors.responsibleWorker && <span className="text-sm text-red-600">{errors.responsibleWorker.message}</span>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="assistantWorker" className="block text-sm font-medium text-slate-700">Trabajador Asistente</label>
        <select
          id="assistantWorker"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          {...register('assistantWorker', { valueAsNumber: true })}
        >
          {workerUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        {errors.assistantWorker && <span className="text-sm text-red-600">{errors.assistantWorker.message}</span>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="membershipTypeIds" className="block text-sm font-medium text-slate-700">Seleccione Tipos de membresía</label>
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

