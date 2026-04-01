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
  startAt: z.string().min(1, "Fecha y hora de inicio requerida"),
  endAt: z.string().min(1, "Fecha y hora de fin requerida"),
  userId: z.number().min(1, "Usuario requerido"),
  cost: z.number().min(0, "El costo debe ser mayor o igual a 0"),
  facilityId: z.number().min(1, "Seleccioná una instalación"),
  isActive: z.boolean().optional(),
});

export type CreateActivityFormData = z.infer<typeof schema>;

const errBorder = (has: boolean) =>
  has ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "";

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
      startAt: "",
      endAt: "",
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
        startAt: new Date(data.startAt).toISOString(),
        endAt: new Date(data.endAt).toISOString(),
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
    <div className="mx-auto w-full max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="activityFormLabel">Nombre</label>
          <input
            type="text"
            placeholder="Ej: Clase de natación"
            className={`activityFormControl ${errBorder(!!errors.name)}`}
            {...register("name")}
          />
          {errors.name && (
            <div className="activityFormError">{errors.name.message}</div>
          )}
        </div>

        <div>
          <label className="activityFormLabel">Tipo</label>
          <input
            type="text"
            placeholder="Ej: Deportiva, Recreativa"
            className={`activityFormControl ${errBorder(!!errors.type)}`}
            {...register("type")}
          />
          {errors.type && (
            <div className="activityFormError">{errors.type.message}</div>
          )}
        </div>

        <div>
          <label className="activityFormLabel">Fecha y hora de inicio</label>
          <input
            type="datetime-local"
            className={`activityFormControl ${errBorder(!!errors.startAt)}`}
            {...register("startAt")}
          />
          {errors.startAt && (
            <div className="activityFormError">{errors.startAt.message}</div>
          )}
        </div>

        <div>
          <label className="activityFormLabel">Fecha y hora de fin</label>
          <input
            type="datetime-local"
            className={`activityFormControl ${errBorder(!!errors.endAt)}`}
            {...register("endAt")}
          />
          {errors.endAt && (
            <div className="activityFormError">{errors.endAt.message}</div>
          )}
        </div>

        <div>
          <label className="activityFormLabel">ID de usuario</label>
          <input
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
          <label className="activityFormLabel">Costo</label>
          <input
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
          <label className="activityFormLabel">ID de instalación</label>
          <input
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
            id="isActive"
            {...register("isActive")}
          />
          <label className="text-sm font-medium text-slate-700" htmlFor="isActive">
            Activa
          </label>
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
