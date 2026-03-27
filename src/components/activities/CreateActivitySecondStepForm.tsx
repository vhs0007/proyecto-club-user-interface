import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../config/axios";
import { useActivityStore } from "../../store/store";
import type { ActivityResponse } from "../../entities/Entities";

const schema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  type: z.string().min(1, "El tipo es requerido"),
  date: z.string().min(1, "Fecha requerida"),
  hourStart: z.string().min(1, "Hora de inicio requerida"),
  hourEnd: z.string().min(1, "Hora de fin requerida"),
  userId: z.number().min(1, "Usuario requerido"),
  cost: z.number().min(0, "El costo debe ser mayor o igual a 0"),
  facilityId: z.number().min(1, "Seleccioná una instalación"),
  isActive: z.boolean().optional(),
});

export type CreateActivityFormData = z.infer<typeof schema>;

export default function CreateActivityForm() {
  const navigate = useNavigate();
  const setActivity = useActivityStore((state) => state.setActivity);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateActivityFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      type: "",
      date: "",
      hourStart: "",
      hourEnd: "",
      userId: 0,
      cost: 0,
      facilityId: 0,
      isActive: true,
    },
  });

  const onSubmit = async (data: CreateActivityFormData) => {
    try {
      const payload = {
        name: data.name,
        type: data.type,
        date: new Date(data.date).toISOString(),
        hourStart: data.hourStart,
        hourEnd: data.hourEnd,
        userId: data.userId,
        cost: data.cost,
        facilityId: data.facilityId,
        ...(data.isActive !== undefined && { isActive: data.isActive }),
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

      <div className="mb-3 form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="isActive"
          {...register("isActive")}
        />
        <label className="form-check-label" htmlFor="isActive">
          Activa
        </label>
      </div>

      <button type="submit" className="btn btn-primary">
        Guardar
      </button>
    </form>
  );
}