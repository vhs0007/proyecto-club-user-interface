import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useClubIdStore, useCreateActivityStore } from "../../store/store";

const toMinutes = (value: string) => {
  const [hours, minutes] = value.split(":").map(Number);
  return (hours * 60) + minutes;
};

const formSchema = z
  .object({
    name: z.string().min(1, "El nombre es requerido"),
    type: z.string().min(1, "El tipo es requerido"),
    date: z.string().min(1, "Fecha requerida"),
    hourStart: z.string().min(1, "Hora de inicio requerida"),
    hourEnd: z.string().min(1, "Hora de fin requerida"),
  })
  .refine((data) => toMinutes(data.hourEnd) > toMinutes(data.hourStart), {
    message: "La fecha de fin debe ser posterior al inicio",
    path: ["hourEnd"],
  });

export type CreateActivityFirstStepFormData = z.infer<typeof formSchema>;

const errBorder = (has: boolean) =>
  has ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "";

export default function CreateActivityFirstStepForm() {
  const navigate = useNavigate();
  const firstStep = useCreateActivityStore((s) => s.firstStep);

  const { register, handleSubmit, formState: { errors } } = useForm<CreateActivityFirstStepFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: firstStep.name,
      type: firstStep.type,
      date: '',
      hourStart: firstStep.hourStart,
      hourEnd: firstStep.hourEnd,
    },
  });

  const onSubmit = (data: CreateActivityFirstStepFormData) => {
    useCreateActivityStore.getState().setFirstStep({
      name: data.name,
      type: data.type,
      date: new Date(data.date),
      hourStart: data.hourStart,
      hourEnd: data.hourEnd,
      isActive: true,
      clubId: useClubIdStore.getState().clubId,
    });
    navigate("/reservas/crear/paso-2");
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="space-y-1.5">
          <label htmlFor="name" className="activityFormLabel">Nombre</label>
          <input
            type="text"
            id="name"
            className={`activityFormControl ${errBorder(!!errors.name)}`}
            placeholder="Ej: Clase de natación"
            {...register("name")}
          />
          {errors.name && <div className="activityFormError">{errors.name.message}</div>}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="type" className="activityFormLabel">Tipo</label>
          <input
            type="text"
            id="type"
            className={`activityFormControl ${errBorder(!!errors.type)}`}
            placeholder="Ej: Deportiva, recreativa"
            {...register("type")}
          />
          {errors.type && <div className="activityFormError">{errors.type.message}</div>}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="date" className="activityFormLabel">Fecha</label>
          <input
            type="date"
            id="date"
            className={`activityFormControl ${errBorder(!!errors.date)}`}
            {...register("date")}
          />
          {errors.date && <div className="activityFormError">{errors.date.message}</div>}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="hourStart" className="activityFormLabel">Hora de inicio</label>
          <input
            type="time"
            id="hourStart"
            className={`activityFormControl ${errBorder(!!errors.hourStart)}`}
            {...register("hourStart")}
          />
          {errors.hourStart && <div className="activityFormError">{errors.hourStart.message}</div>}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="hourEnd" className="activityFormLabel">Hora de fin</label>
          <input
            type="time"
            id="hourEnd"
            className={`activityFormControl ${errBorder(!!errors.hourEnd)}`}
            {...register("hourEnd")}
          />
          {errors.hourEnd && <div className="activityFormError">{errors.hourEnd.message}</div>}
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button type="submit" className="activityPrimaryButton">
            Siguiente
          </button>
        </div>
      </form>
    </div>
  );
}
