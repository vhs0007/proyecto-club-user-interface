import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClubIdStore, useCreateScheduledActivityStore, useMembershipTypeStore, useScheduledActivityStore, useUserStore, type CreateScheduledActivityThirdStep } from "../../store/store";
import type { MembershipType, ScheduledActivityRequest, ScheduledActivityResponse } from "../../entities/Entities";
import type { UserResponse } from "../../entities/Entities";
import AxiosInstance from "../../config/axios";
import { useNavigate } from "react-router-dom";

const schema = z.object({
    membershipTypeId: z.number().min(1, "Tipo de membresía requerido"),
    hourStart: z.string().min(1, "Hora de inicio requerida"),
    hourEnd: z.string().min(1, "Hora de fin requerida"),
    workingDayId: z.number().min(1, "Día requerido"),
    assistantWorkerId: z.number(),
});

export type CreateScheduledActivityFormThirdStep = z.infer<typeof schema>;

export default function CreateScheduledActivityFormThirdStep() {
    const membershipTypes: MembershipType[] = useMembershipTypeStore((state) => state.membershipTypes);
    const users: UserResponse[] = useUserStore((state) => state.users);
    const firstStep = useCreateScheduledActivityStore((state) => state.firstStep);
    const workerUsers = users.filter((u) => u.typeId === 1);
    const { register, handleSubmit, formState: { errors } } = useForm<CreateScheduledActivityFormThirdStep>({
        resolver: zodResolver(schema),
        defaultValues: {
            membershipTypeId: 0,
            hourStart: firstStep.hourStart,
            hourEnd: firstStep.hourEnd,
            workingDayId: 0,
            assistantWorkerId: 0,
        },
    });

    const navigate = useNavigate();
    const setScheduledActivity = useScheduledActivityStore((state) => state.setScheduledActivity);

    const onSubmit = async (data: CreateScheduledActivityFormThirdStep) => {
        const datetimeScheduledActivities = [{
            hourStart: data.hourStart,
            hourEnd: data.hourEnd,
            workingDayId: data.workingDayId,
        }];
        const assistantWorkerIds = data.assistantWorkerId > 0 ? [data.assistantWorkerId] : [];
        const membershipTypesIds = [data.membershipTypeId];

        const thirdStep: CreateScheduledActivityThirdStep = {
            membershipTypesIds,
            datetimeScheduledActivities,
            assistantWorkerIds,
        };

        useCreateScheduledActivityStore.getState().setThirdStep(thirdStep);

        const secondStep = useCreateScheduledActivityStore.getState().secondStep;
        const request: ScheduledActivityRequest = {
            clubId: useClubIdStore.getState().clubId,
            facilityId: secondStep.facilityId,
            userId: secondStep.userId,
            userTypeId: 1,
            membershipTypesIds,
            datetimeScheduledActivities,
            assistantWorkerIds,
            name: firstStep.name,
        };

        try {
            const response = await AxiosInstance.post<ScheduledActivityResponse>("/scheduled-activities", request);
            const created = response.data;
            if (created) setScheduledActivity(created);
            useCreateScheduledActivityStore.getState().resetCreateScheduledActivity();
            navigate("/actividades-rutinarias");
        } catch (error: unknown) {
            console.error("[CreateScheduledActivity] error", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <select {...register('membershipTypeId', { valueAsNumber: true })}>
                <option value={0}>Seleccioná un tipo de membresía</option>
                {membershipTypes.map((mt) => (
                    <option key={mt.id} value={mt.id}>
                        {mt.name}
                    </option>
                ))}
            </select>
            {errors.membershipTypeId && <span className="text-red-500">{errors.membershipTypeId.message}</span>}
            <input type="text" {...register('hourStart')} placeholder="Hora de inicio" />
            {errors.hourStart && <span className="text-red-500">{errors.hourStart.message}</span>}
            <input type="text" {...register('hourEnd')} placeholder="Hora de fin" />
            {errors.hourEnd && <span className="text-red-500">{errors.hourEnd.message}</span>}
            <select {...register('workingDayId', { valueAsNumber: true })}>
                <option value={0}>Seleccioná un día</option>
                <option value={1}>Lunes</option>
                <option value={2}>Martes</option>
                <option value={3}>Miércoles</option>
                <option value={4}>Jueves</option>
                <option value={5}>Viernes</option>
                <option value={6}>Sábado</option>
                <option value={7}>Domingo</option>
            </select>
            {errors.workingDayId && <span className="text-red-500">{errors.workingDayId.message}</span>}
            <select {...register('assistantWorkerId', { valueAsNumber: true })}>
                <option value={0}>Seleccioná un trabajador asistente (opcional)</option>
                {workerUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                        {u.name}
                    </option>
                ))}
            </select>
            <button type="submit">Crear</button>
        </form>
    )
}
