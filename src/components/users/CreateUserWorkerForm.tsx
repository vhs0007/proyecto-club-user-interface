import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUserStore, useMembershipStore, useUserStore } from "../../store/store";
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
                isActive: true,
                salary: workerSpecificStep.salary,
                hoursToWorkPerDay: workerSpecificStep.hoursToWorkPerDay,
                startWorkAt: workerSpecificStep.startWorkAt,
                endWorkAt: workerSpecificStep.endWorkAt,
            };

            const response = await AxiosInstance.post<UserResponse>("/users", userToSend);
            if (response) {
                useUserStore.getState().setUser(response.data);
                try{
                    const membership = {
                        userId: response.data.id,
                        membershipTypeId: useCreateUserStore.getState().firstStep.membership,
                    }
                    const membershipResponse = await AxiosInstance.post("/memberships", membership);
                    if(membershipResponse.data){
                        useMembershipStore.getState().setMembership(membershipResponse.data);
                        navigate("/usuarios");
                    }else{
                        AxiosInstance.delete(`/users/${response.data.id}`);
                        throw new Error("Error al crear la membresía");
                    }
                }catch(error){
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
                <label htmlFor="salary" className="form-label">
                    Salario
                </label>
                <input
                    type="number"
                    className="form-control"
                    {...register("salary", { valueAsNumber: true })}
                />
                {errors.salary && <span className="text-danger">{errors.salary.message}</span>}
            </div>

            <div className="mb-3">
                <label htmlFor="hoursToWorkPerDay" className="form-label">
                    Horas de trabajo por día
                </label>
                <input
                    type="number"
                    className="form-control"
                    {...register("hoursToWorkPerDay", { valueAsNumber: true })}
                />
                {errors.hoursToWorkPerDay && (
                    <span className="text-danger">{errors.hoursToWorkPerDay.message}</span>
                )}
            </div>

            <div className="mb-3">
                <label htmlFor="startWorkAt" className="form-label">
                    Inicio de trabajo
                </label>
                <input type="datetime-local" className="form-control" {...register("startWorkAt")} />
                {errors.startWorkAt && <span className="text-danger">{errors.startWorkAt.message}</span>}
            </div>

            <div className="mb-3">
                <label htmlFor="endWorkAt" className="form-label">
                    Fin de trabajo
                </label>
                <input type="datetime-local" className="form-control" {...register("endWorkAt")} />
                {errors.endWorkAt && <span className="text-danger">{errors.endWorkAt.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary">
                Crear usuario
            </button>
        </form>
    );
}