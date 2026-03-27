import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import AxiosInstance from "../../config/axios";
import { useActivityStore, useCreateActivityStore } from "../../store/store";
import type { ActivityResponse } from "../../entities/Entities";

const formSchema = z.object({
  userId: z.number().min(1, "Usuario requerido"),
  cost: z.number().min(0, "El costo debe ser mayor o igual a 0"),
  facilityId: z.number().min(1, "Seleccioná una instalación"),
});

export type CreateActivitySecondStepFormData = z.infer<typeof formSchema>;

const emptyFirstStep = {
  name: "",
  type: "",
  date: new Date(),
  hourStart: "",
  hourEnd: "",
  isActive: true,
  clubId: 0,
};

const emptySecondStep = { facilityId: 0, userId: 0, cost: 0 };

export default function CreateActivitySecondStepForm() {
  const navigate = useNavigate();
  const firstStep = useCreateActivityStore((s) => s.firstStep);
  const secondStep = useCreateActivityStore((s) => s.secondStep);
  const setActivity = useActivityStore((s) => s.setActivity);

  useEffect(() => {
    if (!firstStep.name.trim()) {
      navigate("/actividades/crear/paso-1", { replace: true });
    }
  }, [firstStep.name, navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm<CreateActivitySecondStepFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: secondStep.userId,
      cost: secondStep.cost,
      facilityId: secondStep.facilityId,
    },
  });

  const onSubmit = async (data: CreateActivitySecondStepFormData) => {
    try {
      useCreateActivityStore.getState().setSecondStep({
        facilityId: data.facilityId,
        userId: data.userId,
        cost: data.cost,
      });

      const fs = useCreateActivityStore.getState().firstStep;

      const payload = {
        name: fs.name,
        type: fs.type,
        date: new Date(fs.date).toISOString(),
        hourStart: new Date(fs.hourStart).toISOString(),
        hourEnd: new Date(fs.hourEnd).toISOString(),
        userId: data.userId,
        cost: data.cost,
        facilityId: data.facilityId,
        isActive: fs.isActive,
      };

      const response = await AxiosInstance.post<ActivityResponse>("/activities", payload);
      const created = response.data;
      if (created) {
        setActivity(created);
        navigate("/actividades");
        useCreateActivityStore.getState().setFirstStep(emptyFirstStep);
        useCreateActivityStore.getState().setSecondStep(emptySecondStep);
      }
    } catch (error: unknown) {
      console.error("[CreateActivitySecondStep] error", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <Link to="/actividades/crear/paso-1" className="btn btn-link p-0">
          Volver al paso 1
        </Link>
      </div>

      <div className="mb-3">
        <label htmlFor="facilityId" className="form-label">ID de instalación</label>
        <input
          type="number"
          id="facilityId"
          min={1}
          placeholder="ID de la instalación"
          className={`form-control ${errors.facilityId ? "is-invalid" : ""}`}
          {...register("facilityId", { valueAsNumber: true })}
        />
        {errors.facilityId && (
          <div className="invalid-feedback d-block">{errors.facilityId.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="userId" className="form-label">ID de usuario</label>
        <input
          type="number"
          id="userId"
          min={1}
          placeholder="ID del usuario"
          className={`form-control ${errors.userId ? "is-invalid" : ""}`}
          {...register("userId", { valueAsNumber: true })}
        />
        {errors.userId && <div className="invalid-feedback d-block">{errors.userId.message}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="cost" className="form-label">Costo</label>
        <input
          type="number"
          id="cost"
          step="0.01"
          min={0}
          placeholder="0"
          className={`form-control ${errors.cost ? "is-invalid" : ""}`}
          {...register("cost", { valueAsNumber: true })}
        />
        {errors.cost && <div className="invalid-feedback d-block">{errors.cost.message}</div>}
      </div>

      <button type="submit" className="btn btn-primary">
        Crear actividad
      </button>
    </form>
  );
}