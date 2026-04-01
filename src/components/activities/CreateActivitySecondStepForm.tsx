import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../config/axios";
import { useActivityStore, useCreateActivityStore } from "../../store/store";
import type { ActivityResponse } from "../../entities/Entities";

const schema = z.object({
  userId: z.number().min(1, "Usuario requerido"),
  cost: z.number().min(0, "El costo debe ser mayor o igual a 0"),
  facilityId: z.number().min(1, "Seleccioná una instalación"),
});

export type CreateActivityFormData = z.infer<typeof schema>;

const errBorder = (has: boolean) =>
  has ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "";

export default function CreateActivitySecondStepForm() {
  const navigate = useNavigate();
  const setActivity = useActivityStore((state) => state.setActivity);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateActivityFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      userId: 0,
      cost: 0,
      facilityId: 0,
    },
  });

  const onSubmit = async (data: CreateActivityFormData) => {
    try {
      const firstStep = useCreateActivityStore.getState().firstStep;
      const payload = {
        name: firstStep.name,
        type: firstStep.type,
        clubId: firstStep.clubId,
        date: new Date(firstStep.date).toISOString(),
        hourStart: firstStep.hourStart,
        hourEnd: firstStep.hourEnd,
        userId: data.userId,
        cost: data.cost,
        facilityId: data.facilityId,
        isActive: firstStep.isActive,
      };
      const response = await AxiosInstance.post<ActivityResponse>("/activities", payload);
      const created = response.data;
      if (created) setActivity(created);
      navigate("/actividades");
    } catch (error: any) {
      console.error("[CreateActivity] error", error);
      console.error("[CreateActivity] response data", error?.response?.data);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="create-step2-userId" className="activityFormLabel">ID de usuario</label>
          <input
            id="create-step2-userId"
            type="number"
            min={1}
            placeholder="ID del usuario"
            className={`activityFormControl ${errBorder(!!errors.userId)}`}
            {...register("userId", { valueAsNumber: true })}
          />
          {errors.userId && (
            <div className="activityFormError">{errors.userId.message}</div>
          )}
        </div>

        <div>
          <label htmlFor="create-step2-cost" className="activityFormLabel">Costo</label>
          <input
            id="create-step2-cost"
            type="number"
            step="0.01"
            min={0}
            placeholder="0"
            className={`activityFormControl ${errBorder(!!errors.cost)}`}
            {...register("cost", { valueAsNumber: true })}
          />
          {errors.cost && (
            <div className="activityFormError">{errors.cost.message}</div>
          )}
        </div>

        <div>
          <label htmlFor="create-step2-facilityId" className="activityFormLabel">ID de instalación</label>
          <input
            id="create-step2-facilityId"
            type="number"
            min={1}
            placeholder="ID de la instalación"
            className={`activityFormControl ${errBorder(!!errors.facilityId)}`}
            {...register("facilityId", { valueAsNumber: true })}
          />
          {errors.facilityId && (
            <div className="activityFormError">{errors.facilityId.message}</div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button type="submit" className="activityPrimaryButton">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
