import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateFacilityStore } from '../../store/store'
import { useUserStore } from '../../store/store'
import {useMembershipTypeStore} from '../../store/store'

const formSchema = z.object({
    responsibleWorker: z.number().min(1),
    assistantWorker: z.number().min(1),
    membershipTypeIds: z.array(z.number()).min(1),
})

export default function CreateFacilityFormSecondStep() {
    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })
    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data)
        const secondStep = {
            responsibleWorker: data.responsibleWorker,
            assistantWorker: data.assistantWorker,
            membershipTypeIds: data.membershipTypeIds,
        }
        useCreateFacilityStore.getState().setSecondStep(secondStep)
    }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
            <label htmlFor="responsibleWorker">Trabajador Encargado</label>
            <input type="number" {...register('responsibleWorker')} />
            {errors.responsibleWorker && <span className="text-danger">{errors.responsibleWorker.message}</span>}
        </div>
        <div className="form-group">
            <label htmlFor="assistantWorker">Trabajador Asistente</label>
            <input type="number" {...register('assistantWorker')} />
            {errors.assistantWorker && <span className="text-danger">{errors.assistantWorker.message}</span>}
        </div>
        <div className="form-group">
            <label htmlFor="membershipTypeIds">Tipos de membresía</label>
            <select {...register('membershipTypeIds')} multiple>
                <option value="1">Membresía 1</option>
                <option value="2">Membresía 2</option>
                <option value="3">Membresía 3</option>
            </select>
            {errors.membershipTypeIds && <span className="text-danger">{errors.membershipTypeIds.message}</span>}
        </div>
        <button type="submit" className="btn btn-primary">Crear</button>
    </form>
  )
}