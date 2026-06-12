import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useClubIdStore, useCreateFacilityStore } from '../../store/store'
import { useUserStore } from '../../store/store'
import { useMembershipTypeStore } from '../../store/store'
import { useFacilityStore } from '../../store/store'
import type { Facility, FacilityResponse, MembershipType } from '../../entities/Entities'
import AxiosInstance from '../../config/axios'
import { useNavigate } from 'react-router-dom'
import SelectActivityMembers from '../scheduledActivities/SelectActivityMembers'

const formSchema = z.object({
  responsibleWorker: z.number().min(1),
})

type FormData = z.infer<typeof formSchema>

export default function CreateFacilityFormSecondStep() {
  const [membershipTypeIds, setMembershipTypeIds] = useState<number[]>([])
  const [assistantWorkerIds, setAssistantWorkerIds] = useState<number[]>([])
  const [membersModalOpen, setMembersModalOpen] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      responsibleWorker: 0,
    },
  })

  const responsibleWorkerId = watch('responsibleWorker')
  const users = useUserStore((state) => state.users)
  const workerUsers = users.filter((user) => user.typeId === 1)
  const membershipTypes: MembershipType[] = useMembershipTypeStore((state) => state.membershipTypes)
  const navigate = useNavigate()

  useEffect(() => {
    if (responsibleWorkerId > 0) {
      setAssistantWorkerIds((prev) =>
        prev.filter((id) => id !== responsibleWorkerId),
      )
    }
  }, [responsibleWorkerId])

  const selectedAssistantNames = users
    .filter((u) => u.typeId === 1 && assistantWorkerIds.includes(u.id))
    .map((u) => u.name)
    .join(', ')

  const toggleMembershipType = (id: number) => {
    setMembershipTypeIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    )
  }

  const onSubmit = async (data: FormData) => {
    const secondStep = {
      responsibleWorker: data.responsibleWorker,
      assistantWorkers: assistantWorkerIds,
      membershipTypeIds,
    }
    useCreateFacilityStore.getState().setSecondStep(secondStep)
    try {
      const request: Facility = {
        type: useCreateFacilityStore.getState().firstStep.type,
        capacity: useCreateFacilityStore.getState().firstStep.capacity,
        responsibleWorker: data.responsibleWorker,
        ...(assistantWorkerIds.length > 0 ? { assistantWorkers: assistantWorkerIds } : {}),
        membershipTypeIds,
        isActive: true,
        clubId: useClubIdStore.getState().clubId,
      }
      const response: FacilityResponse | null = await createFacility(request)
      if (response) {
        useFacilityStore.getState().setFacility(response)
        alert('Instalación creada correctamente')
        navigate('/instalaciones')
      }
    } catch (error) {
      alert('Error al crear la instalación')
      console.error(error)
    }
  }

  const createFacility = async (request: Facility): Promise<FacilityResponse | null> => {
    try {
      const response = await AxiosInstance.post<FacilityResponse>('/facilities', request)
      return response.data
    } catch (error) {
      console.error(error)
      return null
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
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
          Crear
        </button>
      </form>
    </div>
  )
}
