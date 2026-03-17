import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateFacilityStore } from '../../store/store'
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
            isActive: true
        }
        useCreateFacilityStore.getState().setFirstStep(firstStep)
        navigate('/instalaciones/crear/paso-2')
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <label htmlFor="type">Tipo</label>
                <input type="text" {...register('type')} />
                {errors.type && <span className="text-danger">{errors.type.message}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="capacity">Aforo</label>
                <input
                    type="number"
                    {...register('capacity', { valueAsNumber: true })}
                />
                {errors.capacity && <span className="text-danger">{errors.capacity.message}</span>}
            </div>
            <button type="submit" className="btn btn-primary">Siguiente</button>
        </form>
    )
}