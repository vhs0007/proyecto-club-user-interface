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
    <div className="mx-auto w-full max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <input type="hidden" value={facility.id} />

        <div className="space-y-1.5">
          <label htmlFor="type" className="block text-sm font-medium text-slate-700">Tipo</label>
          <input
            id="type"
            type="text"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register('type')}
          />
          {errors.type && <span className="text-sm text-red-600">{errors.type.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="capacity" className="block text-sm font-medium text-slate-700">Aforo</label>
          <input
            id="capacity"
            type="number"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register('capacity', { valueAsNumber: true })}
          />
          {errors.capacity && <span className="text-sm text-red-600">{errors.capacity.message}</span>}
        </div>

        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          Siguiente
        </button>
      </form>
    </div>
  )
}

