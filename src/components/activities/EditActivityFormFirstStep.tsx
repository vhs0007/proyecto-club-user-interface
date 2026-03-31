import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ActivityResponse } from "../../entities/Entities";
import { useEditActivityStore } from "../../store/store";

const toMinutes = (value: string) => {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
};

const formSchema = z
  .object({
    name: z.string().min(1, "El nombre es requerido"),
    type: z.string().min(1, "El tipo es requerido"),
    date: z.string().min(1, "Fecha requerida"),
    hourStart: z.string().min(1, "Hora de inicio requerida"),
    hourEnd: z.string().min(1, "Hora de fin requerida"),
    isActive: z.boolean(),
  })
  .refine((data) => toMinutes(data.hourEnd) > toMinutes(data.hourStart), {
    message: "La hora de fin debe ser posterior al inicio",
    path: ["hourEnd"],
  });

type FormData = z.infer<typeof formSchema>;

function toDateInputValue(d: Date | string) {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export default function EditActivityFormFirstStep({ activity }: { activity: ActivityResponse }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: activity.name ?? "",
      type: activity.type ?? "",
      date: toDateInputValue(activity.date),
      hourStart: activity.hourStart ?? "",
      hourEnd: activity.hourEnd ?? "",
      isActive: (activity as ActivityResponse & { isActive?: boolean }).isActive ?? true,
    },
  });

  useEffect(() => {
    const store = useEditActivityStore.getState();
    if (store.editingActivityId === activity.id && store.firstStep.name.trim()) {
      reset({
        name: store.firstStep.name,
        type: store.firstStep.type,
        date: toDateInputValue(store.firstStep.date),
        hourStart: store.firstStep.hourStart,
        hourEnd: store.firstStep.hourEnd,
        isActive: store.firstStep.isActive,
      });
      return;
    }
    const d = new Date(activity.date);
    reset({
      name: activity.name ?? "",
      type: activity.type ?? "",
      date: toDateInputValue(activity.date),
      hourStart: activity.hourStart ?? "",
      hourEnd: activity.hourEnd ?? "",
      isActive: (activity as ActivityResponse & { isActive?: boolean }).isActive ?? true,
    });
    useEditActivityStore.getState().setEditingActivityId(activity.id);
    useEditActivityStore.getState().setFirstStep({
      name: activity.name ?? "",
      type: activity.type ?? "",
      date: d,
      hourStart: activity.hourStart ?? "",
      hourEnd: activity.hourEnd ?? "",
      isActive: (activity as ActivityResponse & { isActive?: boolean }).isActive ?? true,
      clubId: activity.clubId,
    });
  }, [activity, reset]);

  const onSubmit = (data: FormData) => {
    useEditActivityStore.getState().setFirstStep({
      name: data.name,
      type: data.type,
      date: new Date(data.date),
      hourStart: data.hourStart,
      hourEnd: data.hourEnd,
      isActive: data.isActive,
      clubId: activity.clubId,
    });
    useEditActivityStore.getState().setEditingActivityId(activity.id);
    if (!id) return;
    navigate(`/actividades/editar/${id}/paso-2`);
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm"
      >
        <input type="hidden" value={activity.id} readOnly disabled />

        <div className="space-y-1.5">
          <label htmlFor="activityId" className="block text-sm font-medium text-slate-700">
            ID
          </label>
          <input
            id="activityId"
            type="number"
            className="w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-700"
            value={activity.id}
            disabled
            readOnly
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("name")}
          />
          {errors.name && <span className="text-sm text-red-600">{errors.name.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="type" className="block text-sm font-medium text-slate-700">
            Tipo
          </label>
          <input
            id="type"
            type="text"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("type")}
          />
          {errors.type && <span className="text-sm text-red-600">{errors.type.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="date" className="block text-sm font-medium text-slate-700">
            Fecha
          </label>
          <input
            id="date"
            type="date"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("date")}
          />
          {errors.date && <span className="text-sm text-red-600">{errors.date.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="hourStart" className="block text-sm font-medium text-slate-700">
            Hora de inicio
          </label>
          <input
            id="hourStart"
            type="time"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("hourStart")}
          />
          {errors.hourStart && <span className="text-sm text-red-600">{errors.hourStart.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="hourEnd" className="block text-sm font-medium text-slate-700">
            Hora de fin
          </label>
          <input
            id="hourEnd"
            type="time"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("hourEnd")}
          />
          {errors.hourEnd && <span className="text-sm text-red-600">{errors.hourEnd.message}</span>}
        </div>

        <div className="flex items-center gap-2">
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
                  id="isActive"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
                <label className="text-sm font-medium text-slate-700" htmlFor="isActive">
                  Activa
                </label>
              </>
            )}
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          Siguiente
        </button>
      </form>
    </div>
  );
}
