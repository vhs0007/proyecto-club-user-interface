import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Activity, ActivityResponse } from "../../entities/Entities";
import { useEditActivityStore, useActivityStore } from "../../store/store";
import AxiosInstance from "../../config/axios";

const formSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  startAt: z.string().min(1),
  endAt: z.string().min(1),
  isActive: z.boolean(),
  cost: z.coerce.number().min(0),
});

type FormData = z.infer<typeof formSchema>;

export default function EditActivityForm({ activity }: { activity: Activity }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: activity.name ?? "",
      type: activity.type ?? "",
      startAt: activity.startAt ?? "",
      endAt: activity.endAt ?? "",
      isActive: activity.isActive ?? true,
      cost: activity.cost ?? 0,
    },
  });

  useEffect(() => {
    reset({
      name: activity.name ?? "",
      type: activity.type ?? "",
      startAt: activity.startAt ?? "",
      endAt: activity.endAt ?? "",
      isActive: activity.isActive ?? true,
      cost: activity.cost ?? 0,
    });
  }, [activity, reset]);

      const onSubmit = async (data: FormData) => {
        useEditActivityStore.getState().setActivity({
            name: data.name,
            type: data.type,
            startAt: data.startAt,
            endAt: data.endAt,
            isActive: true,
            cost: Number(data.cost),
          });
          try {
            const response = await AxiosInstance.patch<Activity>(`/activities/${id}`, {
              name: data.name,
              type: data.type,
            startAt: new Date(data.startAt).toISOString(),
            endAt: new Date(data.endAt).toISOString(),
            isActive: true,
            cost: Number(data.cost),
          });
          if (response?.data) {
            useActivityStore.getState().updateActivity(response.data);
            alert("Actividad actualizada correctamente");
            navigate(`/actividades`);
          }
          } catch (error) {
            alert("Error al actualizar la actividad");
            console.error(error);
          }
      };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" value={activity.id} readOnly disabled />

      <div className="form-group mb-3">
        <label htmlFor="activityId" className="form-label">
          ID
        </label>
        <input
          type="number"
          id="activityId"
          className="form-control"
          value={activity.id}
          disabled
          readOnly
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="name" className="form-label">
          Nombre
        </label>
        <input type="text" id="name" className="form-control" {...register("name")} />
        {errors.name && <span className="text-danger">{errors.name.message}</span>}
      </div>

      <div className="form-group mb-3">
        <label htmlFor="type" className="form-label">
          Tipo
        </label>
        <input type="text" id="type" className="form-control" {...register("type")} />
        {errors.type && <span className="text-danger">{errors.type.message}</span>}
      </div>

      <div className="form-group mb-3">
        <label htmlFor="cost" className="form-label">
          Costo
        </label>
        <input type="number" id="cost" className="form-control" {...register("cost")} />
        {errors.cost && <span className="text-danger">{errors.cost.message}</span>}
      </div>

      <div className="form-group mb-3">
        <label htmlFor="startAt" className="form-label">
          Fecha de inicio
        </label>
        <input type="datetime-local" id="startAt" className="form-control" {...register("startAt")} />
        {errors.startAt && <span className="text-danger">{errors.startAt.message}</span>}
      </div>

     

      <div className="form-group mb-3">
        <label htmlFor="endAt" className="form-label">
          Fecha de fin
        </label>
        <input type="datetime-local" id="endAt" className="form-control" {...register("endAt")} />
        {errors.endAt && <span className="text-danger">{errors.endAt.message}</span>}
      </div>

      <div className="form-check mb-3">
        <input type="checkbox" id="isActive" className="form-check-input" {...register("isActive")} />
        <label htmlFor="isActive" className="form-check-label">
          Activo
        </label>
        {errors.isActive && <span className="text-danger d-block">{errors.isActive.message}</span>}
      </div>

      <button type="submit" className="btn btn-primary">
        Guardar cambios
      </button>
    </form>
  );
}
