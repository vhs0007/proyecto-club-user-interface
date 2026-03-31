import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import AxiosInstance from "../../config/axios";
import { useActivityStore, useEditActivityStore } from "../../store/store";
import type { ActivityResponse } from "../../entities/Entities";

const schema = z.object({
  userId: z.number().min(1, "Usuario requerido"),
  cost: z.number().min(0, "El costo debe ser mayor o igual a 0"),
  facilityId: z.number().min(1, "Seleccioná una instalación"),
});

type FormData = z.infer<typeof schema>;

export default function EditActivityFormSecondStep({ activity }: { activity: ActivityResponse }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const firstStep = useEditActivityStore((s) => s.firstStep);
  const editingActivityId = useEditActivityStore((s) => s.editingActivityId);

  useEffect(() => {
    if (!firstStep.name.trim()) {
      if (id) navigate(`/actividades/editar/${id}`, { replace: true });
      return;
    }
    if (editingActivityId !== null && editingActivityId !== activity.id) {
      useEditActivityStore.getState().resetEditActivity();
      navigate(`/actividades/editar/${activity.id}`, { replace: true });
    }
  }, [firstStep.name, editingActivityId, activity.id, id, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      userId: activity.user?.id ?? 0,
      cost: activity.cost ?? 0,
      facilityId: activity.facility?.id ?? 0,
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!id) return;
    const fs = useEditActivityStore.getState().firstStep;
    try {
      const payload = {
        name: fs.name,
        type: fs.type,
        clubId: fs.clubId || activity.clubId,
        date: new Date(fs.date).toISOString(),
        hourStart: fs.hourStart,
        hourEnd: fs.hourEnd,
        userId: data.userId,
        cost: data.cost,
        facilityId: data.facilityId,
        isActive: fs.isActive ?? true,
      };
      const response = await AxiosInstance.patch<ActivityResponse>(`/activities/${id}`, payload);
      if (response?.data) {
        useActivityStore.getState().updateActivity(response.data);
        useEditActivityStore.getState().resetEditActivity();
        alert("Actividad actualizada correctamente");
        navigate("/actividades");
      }
    } catch (error) {
      alert("Error al actualizar la actividad");
      console.error(error);
    }
  };

  if (!firstStep.name.trim()) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div>
          <Link to={id ? `/actividades/editar/${id}` : "/actividades"} className="text-sm text-slate-600 underline">
            Volver al paso 1
          </Link>
        </div>

        <p className="text-sm text-slate-700">
          Completá usuario, costo e instalación. Los datos generales se toman del paso anterior.
        </p>

        <div className="space-y-1.5">
          <label htmlFor="userId" className="block text-sm font-medium text-slate-700">
            ID de usuario
          </label>
          <input
            id="userId"
            type="number"
            min={1}
            placeholder="ID del usuario"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("userId", { valueAsNumber: true })}
          />
          {errors.userId && <span className="text-sm text-red-600">{errors.userId.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="cost" className="block text-sm font-medium text-slate-700">
            Costo
          </label>
          <input
            id="cost"
            type="number"
            step="0.01"
            min={0}
            placeholder="0"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("cost", { valueAsNumber: true })}
          />
          {errors.cost && <span className="text-sm text-red-600">{errors.cost.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="facilityId" className="block text-sm font-medium text-slate-700">
            ID de instalación
          </label>
          <input
            id="facilityId"
            type="number"
            min={1}
            placeholder="ID de la instalación"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("facilityId", { valueAsNumber: true })}
          />
          {errors.facilityId && <span className="text-sm text-red-600">{errors.facilityId.message}</span>}
        </div>

        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
