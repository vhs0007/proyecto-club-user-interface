import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
    useCreateScheduledActivityStore,
    type CreateScheduledActivityFirstStep,
} from "../../store/store";

const toMinutes = (value: string) => {
    const [hours, minutes] = value.split(":").map(Number);
    return hours * 60 + minutes;
};

const formSchema = z
    .object({
        name: z.string().min(1, "El nombre es obligatorio"),
        type: z.string().min(1, "El tipo es obligatorio"),
        date: z.string().min(1, "La fecha es obligatoria"),
        hourStart: z.string().min(1, "La hora de inicio es obligatoria"),
        hourEnd: z.string().min(1, "La hora de fin es obligatoria"),
    })
    .refine(
        (data) => toMinutes(data.hourEnd) > toMinutes(data.hourStart),
        {
            message: "La hora de fin debe ser posterior al inicio",
            path: ["hourEnd"],
        }
    );

const errBorder = (hasError: boolean) =>
    hasError ? "border-red-500" : "border-slate-300";

export default function CreateScheduledActivityFormFirstStep() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateScheduledActivityFirstStep>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "",
            date: "",
            hourStart: "",
            hourEnd: "",
        },
    });

    const onSubmit = (data: CreateScheduledActivityFirstStep) => {
        useCreateScheduledActivityStore.getState().setFirstStep(data);
        navigate("/actividades-rutinarias/crear/paso-2");
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm"
        >
            <div className="space-y-1.5">
                <label>Nombre de la actividad</label>
                <input
                    type="text"
                    {...register("name")}
                    placeholder="Nombre"
                    className={`activityFormControl ${errBorder(
                        !!errors.name
                    )}`}
                />
                {errors.name && (
                    <span className="text-sm text-red-500">
                        {errors.name.message}
                    </span>
                )}
            </div>

            <div className="space-y-1.5">
                <label>Tipo</label>
                <input
                    type="text"
                    {...register("type")}
                    placeholder="Tipo"
                    className={`activityFormControl ${errBorder(
                        !!errors.type
                    )}`}
                />
                {errors.type && (
                    <span className="text-sm text-red-500">
                        {errors.type.message}
                    </span>
                )}
            </div>

            <div className="space-y-1.5">
                <label>Fecha</label>
                <input
                    type="date"
                    {...register("date")}
                    className={`activityFormControl ${errBorder(
                        !!errors.date
                    )}`}
                />
                {errors.date && (
                    <span className="text-sm text-red-500">
                        {errors.date.message}
                    </span>
                )}
            </div>

            <div className="space-y-1.5">
                <label>Hora de inicio</label>
                <input
                    type="time"
                    {...register("hourStart")}
                    className={`activityFormControl ${errBorder(
                        !!errors.hourStart
                    )}`}
                />
                {errors.hourStart && (
                    <span className="text-sm text-red-500">
                        {errors.hourStart.message}
                    </span>
                )}
            </div>

            <div className="space-y-1.5">
                <label>Hora de fin</label>
                <input
                    type="time"
                    {...register("hourEnd")}
                    className={`activityFormControl ${errBorder(
                        !!errors.hourEnd
                    )}`}
                />
                {errors.hourEnd && (
                    <span className="text-sm text-red-500">
                        {errors.hourEnd.message}
                    </span>
                )}
            </div>

            <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-white"
            >
                Siguiente
            </button>
        </form>
    );
}