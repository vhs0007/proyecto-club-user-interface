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
    isActive: z.boolean(),
  })
  .refine((data) => toMinutes(data.hourEnd) > toMinutes(data.hourStart), {
    message: "La fecha de fin debe ser posterior al inicio",
    path: ["hourEnd"],
  });

export type CreateActivityFirstStepFormData = z.infer<typeof formSchema>;

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
      isActive: firstStep.isActive,
    },
  });

  const onSubmit = (data: CreateActivityFirstStepFormData) => {
    useCreateActivityStore.getState().setFirstStep({
      name: data.name,
      type: data.type,
      date: new Date(data.date),
      hourStart: data.hourStart,
      hourEnd: data.hourEnd,
      isActive: data.isActive,
      clubId: useClubIdStore.getState().clubId,
    });
    navigate("/actividades/crear/paso-2");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Nombre</label>
        <input
          type="text"
          id="name"
          className={`form-control ${errors.name ? "is-invalid" : ""}`}
          placeholder="Ej: Clase de natación"
          {...register("name")}
        />
        {errors.name && <div className="invalid-feedback d-block">{errors.name.message}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="type" className="form-label">Tipo</label>
        <input
          type="text"
          id="type"
          className={`form-control ${errors.type ? "is-invalid" : ""}`}
          placeholder="Ej: Deportiva, recreativa"
          {...register("type")}
        />
        {errors.type && <div className="invalid-feedback d-block">{errors.type.message}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="date" className="form-label">Fecha</label>
        <input
          type="date"
          id="date"
          className={`form-control ${errors.date ? "is-invalid" : ""}`}
          {...register("date")}
        />
        {errors.date && <div className="invalid-feedback d-block">{errors.date.message}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="hourStart" className="form-label">Hora de inicio</label>
        <input
          type="time"
          id="hourStart"
          className={`form-control ${errors.hourStart ? "is-invalid" : ""}`}
          {...register("hourStart")}
        />
        {errors.hourStart && <div className="invalid-feedback d-block">{errors.hourStart.message}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="hourEnd" className="form-label">Hora de fin</label>
        <input
          type="time"
          id="hourEnd"
          className={`form-control ${errors.hourEnd ? "is-invalid" : ""}`}
          {...register("hourEnd")}
        />
        {errors.hourEnd && <div className="invalid-feedback d-block">{errors.hourEnd.message}</div>}
      </div>
      <div className="mb-3 form-check">
        <input type="checkbox" className="form-check-input" id="isActive" {...register("isActive")} />
        <label className="form-check-label" htmlFor="isActive">
          Activa
        </label>
      </div>
      <button type="submit" className="btn btn-primary">
        Siguiente
      </button>
    </form>
  );
}