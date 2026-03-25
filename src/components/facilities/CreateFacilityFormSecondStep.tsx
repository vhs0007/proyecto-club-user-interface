import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useClubIdStore, useCreateFacilityStore } from '../../store/store'
import { useUserStore } from '../../store/store'
import {useMembershipTypeStore} from '../../store/store'
import {useFacilityStore} from '../../store/store'
import type { UserResponse, Facility, FacilityResponse, MembershipType } from '../../entities/Entities'
import AxiosInstance from '../../config/axios'
import { useNavigate } from 'react-router-dom'

const formSchema = z.object({
    responsibleWorker: z.number().min(1),
    assistantWorker: z.number().min(1),
})

export default function CreateFacilityFormSecondStep() {
    const [membershipTypeIds, setMembershipTypeIds] = useState<number[]>([]);
    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })
    const users : UserResponse[] = useUserStore((state) => state.users)
    const membershipTypes : MembershipType[] = useMembershipTypeStore((state) => state.membershipTypes)
    const navigate = useNavigate()

    const toggleMembershipType = (id: number) => {
        setMembershipTypeIds((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    };
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data)
        console.log('membershipTypeIds seleccionados', membershipTypeIds)
        const secondStep = {
            responsibleWorker: data.responsibleWorker,
            assistantWorker: data.assistantWorker,
            membershipTypeIds,
        }
        useCreateFacilityStore.getState().setSecondStep(secondStep)
        try{
            const request : Facility = {
                type: useCreateFacilityStore.getState().firstStep.type,
                capacity: useCreateFacilityStore.getState().firstStep.capacity,
                responsibleWorker: data.responsibleWorker,
                assistantWorker: data.assistantWorker,
                membershipTypeIds,
                isActive: true,
                clubId: useClubIdStore.getState().clubId,
            }
            const response : FacilityResponse | null = await createFacility(request)
            console.log(response)
            if(response){
                useFacilityStore.getState().setFacility(response)
                alert('Instalación creada correctamente')
                navigate('/instalaciones')
            }
        }catch(error){
            alert('Error al crear la instalación')
            console.error(error)
        }
    }
    const createFacility = async (request: Facility) : Promise<FacilityResponse | null> => {
        try{
            const response = await AxiosInstance.post<FacilityResponse>('/facilities', request)
            console.log(response)
            return response.data
        }catch(error){
            console.error(error)
            return null
        }
    }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
            <label htmlFor="responsibleWorker">Trabajador Encargado</label>
            <select {...register('responsibleWorker', { valueAsNumber: true })}>
                {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                ))}
            </select>
            {errors.responsibleWorker && <span className="text-danger">{errors.responsibleWorker.message}</span>}
        </div>
        <div className="form-group">
            <label htmlFor="assistantWorker">Trabajador Asistente</label>
            <select {...register('assistantWorker', { valueAsNumber: true })}>
                {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                ))}
            </select>
            {errors.assistantWorker && <span className="text-danger">{errors.assistantWorker.message}</span>}
        </div>
        <div className="form-group">
            <label htmlFor="membershipTypeIds">Tipos de membresía</label>
            <div className="d-flex flex-wrap gap-2">
                {membershipTypes.map((membershipType) => {
                    const selected = membershipTypeIds.includes(membershipType.id);
                    return (
                        <button
                            key={membershipType.id}
                            type="button"
                            className={`btn btn-sm ${selected ? 'btn-danger' : 'btn-primary'}`}
                            onClick={() => toggleMembershipType(membershipType.id)}
                        >
                            {membershipType.name}
                        </button>
                    );
                })}
            </div>
        </div>
        <button type="submit" className="btn btn-primary">Crear</button>
    </form>
  )
}