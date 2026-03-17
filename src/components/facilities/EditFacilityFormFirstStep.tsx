import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { FacilityResponse } from '../../entities/Entities'
import { useCreateFacilityStore } from '../../store/store'

const formSchema = z.object({
  type: z.string().min(1),
  capacity: z.number().min(1),
})

type FormData = z.infer<typeof formSchema>

export default function EditFacilityFormFirstStep({ facility }: { facility: FacilityResponse | null }) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: facility?.type ?? '',
      capacity: facility?.capacity ?? 0,
    },
  })

  useEffect(() => {
    if (!facility) return
    reset({
      type: facility.type ?? '',
      capacity: facility.capacity ?? 0,
    })
  }, [facility, reset])

  const onSubmit = (data: FormData) => {
    const firstStep = {
      type: data.type,
      capacity: data.capacity,
      isActive: facility?.isActive ?? true,
    }

    useCreateFacilityStore.getState().setFirstStep(firstStep)

    if (!id) return
    navigate(`/instalaciones/editar/${id}/paso-2`)
  }

  if (!facility) return null

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" value={facility.id} />

      <div className="form-group">
        <label htmlFor="type">Tipo</label>
        <input type="text" {...register('type')} />
        {errors.type && <span className="text-danger">{errors.type.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="capacity">Aforo</label>
        <input type="number" {...register('capacity', { valueAsNumber: true })} />
        {errors.capacity && <span className="text-danger">{errors.capacity.message}</span>}
      </div>

      <button type="submit" className="btn btn-primary">
        Siguiente
      </button>
    </form>
  )
}

