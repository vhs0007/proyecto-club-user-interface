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
    <form onSubmit={handleSubmit(onSubmit)}>

      <div className="mb-3">
        <label className="form-label">ID de usuario</label>
        <input
          type="number"
          min={1}
          placeholder="ID del usuario"
          className={`form-control ${errors.userId ? "is-invalid" : ""}`}
          {...register("userId", { valueAsNumber: true })}
        />
        {errors.userId && (
          <div className="invalid-feedback">{errors.userId.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Costo</label>
        <input
          type="number"
          step="0.01"
          min={0}
          placeholder="0"
          className={`form-control ${errors.cost ? "is-invalid" : ""}`}
          {...register("cost", { valueAsNumber: true })}
        />
        {errors.cost && (
          <div className="invalid-feedback">{errors.cost.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">ID de instalación</label>
        <input
          type="number"
          min={1}
          placeholder="ID de la instalación"
          className={`form-control ${errors.facilityId ? "is-invalid" : ""}`}
          {...register("facilityId", { valueAsNumber: true })}
        />
        {errors.facilityId && (
          <div className="invalid-feedback">{errors.facilityId.message}</div>
        )}
      </div>

      <button type="submit" className="btn btn-primary">
        Guardar
      </button>
    </form>
  );
}