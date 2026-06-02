import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useCreateScheduledActivityStore, type CreateScheduledActivityFirstStep } from "../../store/store";

const toMinutes = (value: string) => {
    const [hours, minutes] = value.split(":").map(Number);
    return (hours * 60) + minutes;
};

const formSchema = z.object({
    name: z.string().min(1),
    type: z.string().min(1),
    date: z.string().min(1),
    hourStart: z.string().min(1),
    hourEnd: z.string().min(1),
})
.refine((data) => toMinutes(data.hourEnd) > toMinutes(data.hourStart), {
    message: "La hora de fin debe ser posterior al inicio",
    path: ["hourEnd"],
})

export default function CreateScheduledActivityFormFirstStep() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<CreateScheduledActivityFirstStep>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            type: '',
            date: '',
            hourStart: '',
            hourEnd: '',
        },
    });

    const onSubmit = (data: CreateScheduledActivityFirstStep) => {
        useCreateScheduledActivityStore.getState().setFirstStep(data);
        navigate('/actividades-rutinarias/crear/paso-2');
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" {...register('name')} placeholder="Nombre" />
            {errors.name && <span className="text-red-500">{errors.name.message}</span>}
            <input type="text" {...register('type')} placeholder="Tipo" />
            {errors.type && <span className="text-red-500">{errors.type.message}</span>}
            <input type="text" {...register('date')} placeholder="Fecha" />
            {errors.date && <span className="text-red-500">{errors.date.message}</span>}
            <input type="text" {...register('hourStart')} placeholder="Hora de inicio" />
            {errors.hourStart && <span className="text-red-500">{errors.hourStart.message}</span>}
            <input type="text" {...register('hourEnd')} placeholder="Hora de fin" />
            {errors.hourEnd && <span className="text-red-500">{errors.hourEnd.message}</span>}
            <button type="submit">Siguiente</button>
        </form>
    )
}