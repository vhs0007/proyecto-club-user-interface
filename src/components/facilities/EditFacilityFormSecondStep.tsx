import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Facility, FacilityResponse, MembershipType, UserResponse } from '../../entities/Entities'
import AxiosInstance from '../../config/axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useCreateFacilityStore, useFacilityStore, useMembershipTypeStore, useUserStore } from '../../store/store'

const formSchema = z.object({
  responsibleWorker: z.number().min(1),
  assistantWorker: z.number().min(1),
})

type FormData = z.infer<typeof formSchema>

export default function EditFacilityFormSecondStep({ facility }: { facility: FacilityResponse | null }) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [membershipTypeIds, setMembershipTypeIds] = useState<number[]>([])
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      responsibleWorker: facility?.responsibleWorker?.id ?? 0,
      assistantWorker: facility?.assistantWorker?.id ?? 0,
    },
  })

  const users: UserResponse[] = useUserStore((state) => state.users)
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
      const request: Facility = {
        type: useCreateFacilityStore.getState().firstStep.type,
        capacity: useCreateFacilityStore.getState().firstStep.capacity,
        responsibleWorker: data.responsibleWorker,
        assistantWorker: data.assistantWorker,
        membershipTypeIds,
        isActive: facility.isActive,
      }

      const response = await AxiosInstance.patch<FacilityResponse>(`/facilities/${facility.id}`, request)

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" value={facility.id} />

      <div className="form-group">
        <label htmlFor="responsibleWorker">Trabajador Encargado</label>
        <select {...register('responsibleWorker', { valueAsNumber: true })}>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        {errors.responsibleWorker && <span className="text-danger">{errors.responsibleWorker.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="assistantWorker">Trabajador Asistente</label>
        <select {...register('assistantWorker', { valueAsNumber: true })}>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        {errors.assistantWorker && <span className="text-danger">{errors.assistantWorker.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="membershipTypeIds">Tipos de membresía</label>
        <div className="d-flex flex-wrap gap-2">
          {membershipTypes.map((membershipType) => {
            const selected = membershipTypeIds.includes(membershipType.id)
            return (
              <button
                key={membershipType.id}
                type="button"
                className={`btn btn-sm ${selected ? 'btn-danger' : 'btn-primary'}`}
                onClick={() => toggleMembershipType(membershipType.id)}
              >
                {membershipType.name}
              </button>
            )
          })}
        </div>
      </div>

      <button type="submit" className="btn btn-primary">
        Guardar
      </button>
    </form>
  )
}

