import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
    useCreateScheduledActivityStore,
    useFacilityStore,
    useUserStore,
    type CreateScheduledActivitySecondStep,
} from "../../store/store";

const schema = z.object({
    userId: z.number().min(1, "Trabajador responsable requerido"),
    facilityId: z.number().min(1, "Seleccioná una instalación"),
});

const errBorder = (has: boolean) =>
    has ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "";

export default function CreateScheduledActivityFormSecondStep() {
    const navigate = useNavigate();
    const secondStep = useCreateScheduledActivityStore((s) => s.secondStep);
    const users = useUserStore((state) => state.users);
    const facilities = useFacilityStore((state) => state.facilities);
    const workerUsers = users.filter((u) => u.typeId === 1);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateScheduledActivitySecondStep>({
        resolver: zodResolver(schema),
        defaultValues: {
            userId: secondStep.userId,
            facilityId: secondStep.facilityId,
        },
    });

    const onSubmit = (data: CreateScheduledActivitySecondStep) => {
        useCreateScheduledActivityStore.getState().setSecondStep(data);
        navigate("/actividades-rutinarias/crear/paso-3");
    };

    return (
        <div className="mx-auto w-full max-w-2xl">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div className="space-y-1.5">
                    <label htmlFor="userId" className="activityFormLabel">
                        Trabajador responsable
                    </label>
                    <select
                        id="userId"
                        className={`activityFormControl ${errBorder(!!errors.userId)}`}
                        {...register("userId", { valueAsNumber: true })}
                    >
                        <option value={0}>
                            Seleccioná un trabajador responsable
                        </option>
                        {workerUsers.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name}
                            </option>
                        ))}
                    </select>
                    {errors.userId && (
                        <div className="activityFormError">
                            {errors.userId.message}
                        </div>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="facilityId" className="activityFormLabel">
                        Instalación
                    </label>
                    <select
                        id="facilityId"
                        className={`activityFormControl ${errBorder(!!errors.facilityId)}`}
                        {...register("facilityId", { valueAsNumber: true })}
                    >
                        <option value={0}>Seleccioná una instalación</option>
                        {facilities.map((f) => (
                            <option key={f.id} value={f.id}>
                                {f.type}
                            </option>
                        ))}
                    </select>
                    {errors.facilityId && (
                        <div className="activityFormError">
                            {errors.facilityId.message}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                    <button type="submit" className="activityPrimaryButton">
                        Siguiente
                    </button>
                </div>
            </form>
        </div>
    );
}
