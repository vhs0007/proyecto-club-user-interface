import { useForm, useFieldArray } from 'react-hook-form'
import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useClubIdStore, useCreateFacilityStore } from '../../store/store'
import { useUserStore } from '../../store/store'
import { useMembershipTypeStore } from '../../store/store'
import { useFacilityStore } from '../../store/store'
import type { UserResponse, Facility, FacilityResponse, MembershipType } from '../../entities/Entities'
import AxiosInstance from '../../config/axios'
import { useNavigate } from 'react-router-dom'

const formSchema = z.object({
  responsibleWorker: z.number().min(1),
  assistantWorkers: z.array(
    z.object({ workerId: z.number() }),
  ),
})

type FormData = z.infer<typeof formSchema>

export default function CreateFacilityFormSecondStep() {
  const [membershipTypeIds, setMembershipTypeIds] = useState<number[]>([])
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      responsibleWorker: 0,
      assistantWorkers: [],
    },
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'assistantWorkers',
  })
  const responsibleWorkerId = watch('responsibleWorker')
  const assistantRows = watch('assistantWorkers')
  const users: UserResponse[] = useUserStore((state) => state.users)
  const workerUsers = users.filter((user) => user.typeId === 1)
  const membershipTypes: MembershipType[] = useMembershipTypeStore((state) => state.membershipTypes)
  const navigate = useNavigate()

  const getAssistantOptions = (currentIndex: number) => {
    const selectedElsewhere = (assistantRows ?? [])
      .map((row, idx) => (idx === currentIndex ? 0 : row.workerId))
      .filter((id) => id > 0)
    return workerUsers.filter(
      (user) =>
        user.id !== responsibleWorkerId &&
        !selectedElsewhere.includes(user.id),
    )
  }

  const toggleMembershipType = (id: number) => {
    setMembershipTypeIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    )
  }

  const onSubmit = async (data: FormData) => {
    const assistantWorkers = data.assistantWorkers
      .map((row) => row.workerId)
      .filter((id) => id > 0)

    const secondStep = {
      responsibleWorker: data.responsibleWorker,
      assistantWorkers,
      membershipTypeIds,
    }
    useCreateFacilityStore.getState().setSecondStep(secondStep)
    try {
      const request: Facility = {
        type: useCreateFacilityStore.getState().firstStep.type,
        capacity: useCreateFacilityStore.getState().firstStep.capacity,
        responsibleWorker: data.responsibleWorker,
        ...(assistantWorkers.length > 0 ? { assistantWorkers } : {}),
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

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="block text-sm font-medium text-slate-700">Trabajadores asistentes</span>
            <button
              type="button"
              onClick={() => append({ workerId: 0 })}
              className="text-sm font-medium text-slate-700 underline hover:text-slate-900"
            >
              + Agregar asistente
            </button>
          </div>
          {fields.length === 0 && (
            <p className="text-sm text-slate-500">Sin asistentes (opcional)</p>
          )}
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <select
                className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                {...register(`assistantWorkers.${index}.workerId`, { valueAsNumber: true })}
              >
                <option value={0}>Seleccionar asistente</option>
                {getAssistantOptions(index).map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => remove(index)}
                className="shrink-0 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                title="Quitar"
              >
                Quitar
              </button>
            </div>
          ))}
        </div>

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
