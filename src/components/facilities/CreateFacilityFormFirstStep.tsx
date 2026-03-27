import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useClubIdStore, useCreateFacilityStore } from '../../store/store'
import { useNavigate } from 'react-router-dom'
const formSchema = z.object({
    type: z.string().min(1),
    capacity: z.number().min(1),
})

export default function CreateFacilityFormFirstStep() {
    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const navigate = useNavigate()

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data)
        const firstStep = {
            type: data.type,
            capacity: data.capacity,
            isActive: true,
            clubId: useClubIdStore.getState().clubId,
        }
        useCreateFacilityStore.getState().setFirstStep(firstStep)
        navigate('/instalaciones/crear/paso-2')
    }

    return (
        <div className="mx-auto w-full max-w-2xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
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