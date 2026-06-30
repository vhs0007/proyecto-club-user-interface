import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ActivityResponse } from "../../entities/Entities";
import { ACTIVITY_STATES } from "../../entities/Entities";
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
    state: z.enum(ACTIVITY_STATES),
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

const errBorder = (has: boolean) =>
  has ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "";

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
      state: activity.state ?? "PENDIENTE",
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
        state: store.firstStep.state as FormData["state"],
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
      state: activity.state ?? "PENDIENTE",
    });
    useEditActivityStore.getState().setEditingActivityId(activity.id);
    useEditActivityStore.getState().setFirstStep({
      name: activity.name ?? "",
      type: activity.type ?? "",
      date: d,
      hourStart: activity.hourStart ?? "",
      hourEnd: activity.hourEnd ?? "",
      state: activity.state ?? "PENDIENTE",
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
      state: data.state,
      clubId: activity.clubId,
    });
    useEditActivityStore.getState().setEditingActivityId(activity.id);
    if (!id) return;
    navigate(`/reservas/editar/${id}/paso-2`);
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm"
      >
        <input type="hidden" value={activity.id} readOnly disabled />

        <div className="space-y-1.5">
          <label htmlFor="activityId" className="activityFormLabel">
            ID
          </label>
          <input
            id="activityId"
            type="number"
            className="activityFormControl bg-slate-50"
            value={activity.id}
            disabled
            readOnly
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="name" className="activityFormLabel">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            className={`activityFormControl ${errBorder(!!errors.name)}`}
            {...register("name")}
          />
          {errors.name && <span className="activityFormError">{errors.name.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="type" className="activityFormLabel">
            Tipo
          </label>
          <input
            id="type"
            type="text"
            className={`activityFormControl ${errBorder(!!errors.type)}`}
            {...register("type")}
          />
          {errors.type && <span className="activityFormError">{errors.type.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="date" className="activityFormLabel">
            Fecha
          </label>
          <input
            id="date"
            type="date"
            className={`activityFormControl ${errBorder(!!errors.date)}`}
            {...register("date")}
          />
          {errors.date && <span className="activityFormError">{errors.date.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="hourStart" className="activityFormLabel">
            Hora de inicio
          </label>
          <input
            id="hourStart"
            type="time"
            className={`activityFormControl ${errBorder(!!errors.hourStart)}`}
            {...register("hourStart")}
          />
          {errors.hourStart && <span className="activityFormError">{errors.hourStart.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="hourEnd" className="activityFormLabel">
            Hora de fin
          </label>
          <input
            id="hourEnd"
            type="time"
            className={`activityFormControl ${errBorder(!!errors.hourEnd)}`}
            {...register("hourEnd")}
          />
          {errors.hourEnd && <span className="activityFormError">{errors.hourEnd.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="state" className="activityFormLabel">
            Estado
          </label>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <select
                id="state"
                className={`activityFormControl ${errBorder(!!errors.state)}`}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              >
                {ACTIVITY_STATES.map((stateOption) => (
                  <option key={stateOption} value={stateOption}>
                    {stateOption}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.state && <span className="activityFormError">{errors.state.message}</span>}
        </div>

        <button type="submit" className="activityPrimaryButton">
          Siguiente
        </button>
      </form>
    </div>
  );
}
