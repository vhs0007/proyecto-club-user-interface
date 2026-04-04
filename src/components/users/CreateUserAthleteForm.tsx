import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUserStore, useMembershipStore, useUserStore } from "../../store/store";
import AxiosInstance from "../../config/axios";
import type { UserResponse } from "../../entities/Entities";
import { useNavigate } from "react-router-dom";

export default function CreateUserAthleteForm() {
    const formSchema = z.object({
        weight: z.number().min(1, "El peso es requerido"),
        height: z.number().min(1, "La altura es requerida"),
        gender: z.string().min(1, "El género es requerido"),
        birthDate: z.string().min(1, "La fecha de nacimiento es requerida"),
        diet: z.string(),
        trainingPlan: z.string(),
        allergies: z.string(),
        medications: z.string(),
        medicalConditions: z.string(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            diet: "",
            trainingPlan: "",
            allergies: "",
            medications: "",
            medicalConditions: "",
        },
    });

    const navigate = useNavigate();

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const birthDateIso = new Date(`${data.birthDate}T00:00:00.000Z`).toISOString();
            const athleteSpecificStep = {
                weight: data.weight,
                height: data.height,
                gender: data.gender,
                birthDate: birthDateIso,
                diet: data.diet,
                trainingPlan: data.trainingPlan,
                allergies: data.allergies,
                medications: data.medications,
                medicalConditions: data.medicalConditions,
            };

            useCreateUserStore.getState().setAthleteSpecificStep(athleteSpecificStep);

            const firstStep = useCreateUserStore.getState().firstStep;
            const userToSend = {
                name: firstStep.name,
                typeId: firstStep.typeId,
                email: firstStep.email,
                isActive: true,
                weight: athleteSpecificStep.weight,
                height: athleteSpecificStep.height,
                gender: athleteSpecificStep.gender,
                birthDate: birthDateIso,
                diet: athleteSpecificStep.diet || null,
                trainingPlan: athleteSpecificStep.trainingPlan || null,
                allergies: athleteSpecificStep.allergies || null,
                medications: athleteSpecificStep.medications || null,
                medicalConditions: athleteSpecificStep.medicalConditions || null,
            };

            const response = await AxiosInstance.post<UserResponse>("/users", userToSend);
            if (response) {
                useUserStore.getState().setUser(response.data);
                try {
                    const membership = {
                        userId: response.data.id,
                        type: firstStep.membership,
                    };
                    const membershipResponse = await AxiosInstance.post("/membership", membership);
                    if (membershipResponse.data) {
                        useMembershipStore.getState().setMembership(membershipResponse.data);
                        navigate("/miembros");
                    } else {
                        await AxiosInstance.delete(`/users/${response.data.id}`);
                        useUserStore.getState().deleteUser(response.data.id);
                        throw new Error("Error al crear la membresía");
                    }
                } catch (error) {
                    alert("Error al crear la membresía");
                    console.error(error);
                }
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
                <label htmlFor="weight" className="block text-sm font-medium text-slate-700">
                    Peso (kg)
                </label>
                <input
                    id="weight"
                    type="number"
                    step="0.1"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    {...register("weight", { valueAsNumber: true })}
                />
                {errors.weight && <span className="text-sm text-red-600">{errors.weight.message}</span>}
            </div>

            <div className="space-y-1.5">
                <label htmlFor="height" className="block text-sm font-medium text-slate-700">
                    Altura (cm)
                </label>
                <input
                    id="height"
                    type="number"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    {...register("height", { valueAsNumber: true })}
                />
                {errors.height && <span className="text-sm text-red-600">{errors.height.message}</span>}
            </div>

            <div className="space-y-1.5">
                <label htmlFor="gender" className="block text-sm font-medium text-slate-700">
                    Género
                </label>
                <input
                    id="gender"
                    type="text"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    {...register("gender")}
                />
                {errors.gender && <span className="text-sm text-red-600">{errors.gender.message}</span>}
            </div>

            <div className="space-y-1.5">
                <label htmlFor="birthDate" className="block text-sm font-medium text-slate-700">
                    Fecha de nacimiento
                </label>
                <input
                    id="birthDate"
                    type="date"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    {...register("birthDate")}
                />
                {errors.birthDate && <span className="text-sm text-red-600">{errors.birthDate.message}</span>}
            </div>

            <div className="space-y-1.5">
                <label htmlFor="diet" className="block text-sm font-medium text-slate-700">
                    Dieta
                </label>
                <input
                    id="diet"
                    type="text"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    {...register("diet")}
                />
            </div>

            <div className="space-y-1.5">
                <label htmlFor="trainingPlan" className="block text-sm font-medium text-slate-700">
                    Plan de entrenamiento
                </label>
                <input
                    id="trainingPlan"
                    type="text"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    {...register("trainingPlan")}
                />
            </div>

            <div className="space-y-1.5">
                <label htmlFor="allergies" className="block text-sm font-medium text-slate-700">
                    Alergias
                </label>
                <input
                    id="allergies"
                    type="text"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    {...register("allergies")}
                />
            </div>

            <div className="space-y-1.5">
                <label htmlFor="medications" className="block text-sm font-medium text-slate-700">
                    Medicación
                </label>
                <input
                    id="medications"
                    type="text"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    {...register("medications")}
                />
            </div>

            <div className="space-y-1.5">
                <label htmlFor="medicalConditions" className="block text-sm font-medium text-slate-700">
                    Condiciones médicas
                </label>
                <input
                    id="medicalConditions"
                    type="text"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    {...register("medicalConditions")}
                />
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
