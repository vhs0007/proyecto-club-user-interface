import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClubIdStore, useCreateUserStore, useUserStore } from "../../store/store";
import AxiosInstance from "../../config/axios";
import type { UserResponse } from "../../entities/Entities";
import { useNavigate } from "react-router-dom";

export default function CreateUserWorkerForm() {
    const formSchema = z.object({
        salary: z.number().min(1, "El salario es requerido"),
        hoursToWorkPerDay: z.number().min(1, "Las horas por día son requeridas"),
        startWorkAt: z.string().min(1, "La fecha de inicio es requerida"),
        endWorkAt: z.string().min(1, "La fecha de fin es requerida"),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const navigate = useNavigate();

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const workerSpecificStep = {
                salary: data.salary,
                hoursToWorkPerDay: data.hoursToWorkPerDay,
                startWorkAt: new Date(data.startWorkAt),
                endWorkAt: new Date(data.endWorkAt),
            };

            useCreateUserStore.getState().setWorkerSpecificStep(workerSpecificStep);

            const firstStep = useCreateUserStore.getState().firstStep;
            const userToSend = {
                name: firstStep.name,
                typeId: firstStep.typeId,
                email: firstStep.email,
                document: firstStep.document,
                isActive: true,
                salary: workerSpecificStep.salary,
                hoursToWorkPerDay: workerSpecificStep.hoursToWorkPerDay,
                startWorkAt: workerSpecificStep.startWorkAt,
                endWorkAt: workerSpecificStep.endWorkAt,
                clubId: useClubIdStore.getState().clubId,
            };

            const response = await AxiosInstance.post<UserResponse>("/users", userToSend);
            console.log(response);
            if(response.data){
                useUserStore.getState().setUser(response.data);
                navigate("/trabajadores");
            }else{
                throw new Error("Error al crear el usuario");
            }
        } catch (error) {
            alert("Error al crear el usuario");
            console.error(error);
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = form;

    return (
        <div className="mx-auto w-full max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <div className="space-y-1.5">
                <label htmlFor="salary" className="block text-sm font-medium text-slate-700">
                    Salario
                </label>
                <input
                    id="salary"
                    type="number"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    {...register("salary", { valueAsNumber: true })}
                />
                {errors.salary && <span className="text-sm text-red-600">{errors.salary.message}</span>}
            </div>

            <div className="space-y-1.5">
                <label htmlFor="hoursToWorkPerDay" className="block text-sm font-medium text-slate-700">
                    Horas de trabajo por día
                </label>
                <input
                    id="hoursToWorkPerDay"
                    type="number"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    {...register("hoursToWorkPerDay", { valueAsNumber: true })}
                />
                {errors.hoursToWorkPerDay && (
                    <span className="text-sm text-red-600">{errors.hoursToWorkPerDay.message}</span>
                )}
            </div>

            <div className="space-y-1.5">
                <label htmlFor="startWorkAt" className="block text-sm font-medium text-slate-700">
                    Inicio de trabajo
                </label>
                <input
                    id="startWorkAt"
                    type="datetime-local"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    {...register("startWorkAt")}
                />
                {errors.startWorkAt && <span className="text-sm text-red-600">{errors.startWorkAt.message}</span>}
            </div>

            <div className="space-y-1.5">
                <label htmlFor="endWorkAt" className="block text-sm font-medium text-slate-700">
                    Fin de trabajo
                </label>
                <input
                    id="endWorkAt"
                    type="datetime-local"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    {...register("endWorkAt")}
                />
                {errors.endWorkAt && <span className="text-sm text-red-600">{errors.endWorkAt.message}</span>}
            </div>

            <button
                type="submit"
                className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
                Crear usuario
            </button>
        </form>
        </div>
    );
}