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
                        navigate("/usuarios");
                    } else {
                        await AxiosInstance.delete(`/users/${response.data.id}`);
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
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
                <label htmlFor="weight" className="form-label">
                    Peso (kg)
                </label>
                <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    {...register("weight", { valueAsNumber: true })}
                />
                {errors.weight && <span className="text-danger">{errors.weight.message}</span>}
            </div>

            <div className="mb-3">
                <label htmlFor="height" className="form-label">
                    Altura (cm)
                </label>
                <input
                    type="number"
                    className="form-control"
                    {...register("height", { valueAsNumber: true })}
                />
                {errors.height && <span className="text-danger">{errors.height.message}</span>}
            </div>

            <div className="mb-3">
                <label htmlFor="gender" className="form-label">
                    Género
                </label>
                <input type="text" className="form-control" {...register("gender")} />
                {errors.gender && <span className="text-danger">{errors.gender.message}</span>}
            </div>

            <div className="mb-3">
                <label htmlFor="birthDate" className="form-label">
                    Fecha de nacimiento
                </label>
                <input type="date" className="form-control" {...register("birthDate")} />
                {errors.birthDate && <span className="text-danger">{errors.birthDate.message}</span>}
            </div>

            <div className="mb-3">
                <label htmlFor="diet" className="form-label">
                    Dieta
                </label>
                <input type="text" className="form-control" {...register("diet")} />
            </div>

            <div className="mb-3">
                <label htmlFor="trainingPlan" className="form-label">
                    Plan de entrenamiento
                </label>
                <input type="text" className="form-control" {...register("trainingPlan")} />
            </div>

            <div className="mb-3">
                <label htmlFor="allergies" className="form-label">
                    Alergias
                </label>
                <input type="text" className="form-control" {...register("allergies")} />
            </div>

            <div className="mb-3">
                <label htmlFor="medications" className="form-label">
                    Medicación
                </label>
                <input type="text" className="form-control" {...register("medications")} />
            </div>

            <div className="mb-3">
                <label htmlFor="medicalConditions" className="form-label">
                    Condiciones médicas
                </label>
                <input type="text" className="form-control" {...register("medicalConditions")} />
            </div>

            <button type="submit" className="btn btn-primary">
                Crear usuario
            </button>
        </form>
    );
}
