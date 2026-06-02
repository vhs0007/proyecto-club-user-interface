import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useCreateScheduledActivityStore, useFacilityStore, useUserStore } from "../../store/store";
import type { FacilityResponse } from "../../entities/Entities";
import type { UserResponse } from "../../entities/Entities";

const schema = z.object({
    userId: z.number().min(1, "Usuario requerido"),
    cost: z.number().min(0, "El costo debe ser mayor o igual a 0"),
    facilityId: z.number().min(1, "Seleccioná una instalación"),
});

export type CreateScheduledActivityFormSecondStep = z.infer<typeof schema>;
export default function CreateScheduledActivityFormSecondStep() {
    const facilities: FacilityResponse[] = useFacilityStore((state) => state.facilities);
    const users: UserResponse[] = useUserStore((state) => state.users);
    const workerUsers = users.filter((u) => u.typeId === 1);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<CreateScheduledActivityFormSecondStep>({
        resolver: zodResolver(schema),
        defaultValues: {
            userId: 0,
            cost: 0,
            facilityId: 0,
        },
    });

    const onSubmit = (data: CreateScheduledActivityFormSecondStep) => {
        useCreateScheduledActivityStore.getState().setSecondStep(data);
        navigate('/actividades-rutinarias/crear/paso-3');
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <select {...register('userId', { valueAsNumber: true })}>
                <option value={0}>Seleccioná un trabajador responsable</option>
                {workerUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                        {u.name}
                    </option>
                ))}
            </select>
            {errors.userId && <span className="text-red-500">{errors.userId.message}</span>}
            <input type="number" {...register('cost', { valueAsNumber: true })} placeholder="Costo" />
            {errors.cost && <span className="text-red-500">{errors.cost.message}</span>}
            <select {...register('facilityId', { valueAsNumber: true })}>
                <option value={0}>Seleccioná una instalación</option>
                {facilities.map((f) => (
                    <option key={f.id} value={f.id}>
                        {f.type}
                    </option>
                ))}
            </select>
            {errors.facilityId && <span className="text-red-500">{errors.facilityId.message}</span>}
            <button type="submit">Siguiente</button>
        </form>
    )
}